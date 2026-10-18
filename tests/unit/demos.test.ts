import { describe, expect, it, vi } from 'vitest'

import {
  computeWrapRegions,
  createMeasuredPrepared,
  layoutArticleLines,
  sampleProfileBand,
} from '@/components/demos/matteflow/layout'
import {
  computeForegroundPlacement,
  createForegroundAlphaMask,
  deriveForegroundBounds,
  deriveProfileFromAlpha,
  estimateBackgroundColor,
} from '@/components/demos/matteflow/matte'
import { streamText, waitFor } from '@/components/demos/streaming/stream'

/** A 4×4 frame: white everywhere except a black 2×2 subject in the middle. */
const frame = () => {
  const width = 4
  const height = 4
  const pixels = new Uint8ClampedArray(width * height * 4).fill(255)
  for (const [x, y] of [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ]) {
    const offset = (y * width + x) * 4
    pixels[offset] = 0
    pixels[offset + 1] = 0
    pixels[offset + 2] = 0
  }
  return { pixels, width, height }
}

describe('matteflow matte', () => {
  it('reads the background from the frame edges and cuts the subject out', () => {
    const { pixels, width, height } = frame()
    expect(estimateBackgroundColor(pixels, width, height)).toEqual({
      r: 255,
      g: 255,
      b: 255,
    })

    const alpha = createForegroundAlphaMask(pixels, width, height)
    expect(Array.from(alpha)).toEqual([
      0, 0, 0, 0, 0, 255, 255, 0, 0, 255, 255, 0, 0, 0, 0, 0,
    ])
    expect(deriveForegroundBounds(alpha, width, height)).toEqual({
      left: 1,
      top: 1,
      right: 2,
      bottom: 2,
    })
  })

  it('reports no subject on an empty frame', () => {
    const alpha = new Uint8ClampedArray(16)
    expect(deriveForegroundBounds(alpha, 4, 4)).toBeNull()
    const profile = deriveProfileFromAlpha(alpha, 4, 4, { bands: 2 })
    expect(profile).toHaveLength(2)
    for (const band of profile) {
      expect(band.width).toBeCloseTo(0.1)
      expect(band.offset).toBe(0)
    }
  })

  it('fits the subject into the stage without leaving it', () => {
    expect(
      computeForegroundPlacement({
        bounds: { left: 0, top: 0, right: 9, bottom: 19 },
        sourceWidth: 10,
        sourceHeight: 20,
        targetWidth: 100,
        targetHeight: 100,
      }),
    ).toEqual({ drawX: 25, drawY: 0, drawWidth: 50, drawHeight: 100 })
  })
})

describe('matteflow layout', () => {
  const profile = [{ width: 0.5, offset: 0 }]

  it('clamps profile sampling to the first and last band', () => {
    const bands = [
      { width: 1, offset: 0 },
      { width: 2, offset: 0 },
    ]
    expect(sampleProfileBand(bands, -1)).toBe(bands[0])
    expect(sampleProfileBand(bands, 2)).toBe(bands[1])
  })

  it('keeps full-width lines outside the stage and splits lines inside it', () => {
    const base = {
      lineHeight: 10,
      articleLeft: 0,
      articleWidth: 400,
      stageTop: 100,
      stageHeight: 100,
      stageCenterX: 200,
      stageWidth: 200,
      profile,
      wrapStrength: 1,
      gutter: 0,
    }
    expect(computeWrapRegions({ ...base, y: 0 })).toEqual([
      { x: 0, width: 400 },
    ])
    expect(computeWrapRegions({ ...base, y: 140 })).toEqual([
      { x: 0, width: 150 },
      { x: 250, width: 150 },
    ])
  })

  it('wraps words by measured width and carries an over-long word', () => {
    const prepared = createMeasuredPrepared(
      'aa bb ccccc',
      (text) => text.length,
    )
    const first = prepared.nextLine(prepared.startCursor, 5)
    expect(first?.text).toBe('aa bb')
    const second = prepared.nextLine(first!.end, 3)
    expect(second?.text).toBe('ccc')
    const third = prepared.nextLine(second!.end, 3)
    expect(third?.text).toBe('cc')
    expect(prepared.nextLine(third!.end, 3)).toBeNull()
  })

  it('lays the article out top to bottom until text or space runs out', () => {
    const prepared = createMeasuredPrepared(
      'one two three',
      (text) => text.length,
    )
    const lines = layoutArticleLines({
      prepared,
      width: 100,
      height: 100,
      margin: 10,
      lineHeight: 20,
      regionsAt: () => [{ x: 10, width: 7 }],
    })
    expect(lines).toEqual([
      { text: 'one two', x: 10, y: 10 },
      { text: 'three', x: 10, y: 30 },
    ])
  })
})

describe('streaming demo loop', () => {
  /** Runs scheduled frames synchronously, one per call to `flush`. */
  const fakeFrames = () => {
    const queue: FrameRequestCallback[] = []
    return {
      schedule: (callback: FrameRequestCallback) => {
        queue.push(callback)
        return queue.length
      },
      cancel: vi.fn(),
      flush: () => queue.shift()?.(0),
      get pending() {
        return queue.length
      },
    }
  }

  it('reveals the text in steps and reports completion', async () => {
    const frames = fakeFrames()
    const steps: string[] = []
    const done = streamText('abcdef', {
      signal: new AbortController().signal,
      onStep: (displayed) => steps.push(displayed),
      random: () => 0.99,
      schedule: frames.schedule,
      cancel: frames.cancel,
    })
    while (frames.pending) frames.flush()
    await expect(done).resolves.toBe(true)
    expect(steps).toEqual(['abcd', 'abcdef'])
  })

  it('stops scheduling and reports an abort, so nothing updates after unmount', async () => {
    const frames = fakeFrames()
    const controller = new AbortController()
    const onStep = vi.fn()
    const done = streamText('abcdefghij', {
      signal: controller.signal,
      onStep,
      random: () => 0,
      schedule: frames.schedule,
      cancel: frames.cancel,
    })
    frames.flush()
    controller.abort()
    await expect(done).resolves.toBe(false)
    expect(frames.cancel).toHaveBeenCalled()
    expect(onStep).toHaveBeenCalledTimes(1)
    while (frames.pending) frames.flush()
    expect(onStep).toHaveBeenCalledTimes(1)
  })

  it('cuts a wait short on abort and refuses one already aborted', async () => {
    vi.useFakeTimers()
    try {
      const controller = new AbortController()
      const waiting = waitFor(1000, controller.signal)
      controller.abort()
      await expect(waiting).resolves.toBe(false)

      await expect(waitFor(10, controller.signal)).resolves.toBe(false)

      const fresh = waitFor(10, new AbortController().signal)
      vi.advanceTimersByTime(10)
      await expect(fresh).resolves.toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })
})
