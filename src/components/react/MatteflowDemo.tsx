'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

// ─── profile.js (inlined) ────────────────────────────────────────────────────

const DEFAULT_PROFILE = [
  { width: 0.16, offset: 0 },
  { width: 0.2, offset: 0 },
  { width: 0.26, offset: 0 },
  { width: 0.34, offset: 0 },
  { width: 0.44, offset: 0 },
  { width: 0.5, offset: 0 },
  { width: 0.47, offset: 0 },
  { width: 0.38, offset: 0 },
  { width: 0.28, offset: 0 },
  { width: 0.2, offset: 0 },
]

type Band = { width: number; offset: number }

function sampleProfileBand(profile: Band[], normalizedY: number): Band {
  const clamped = Math.max(0, Math.min(0.999999, normalizedY))
  const idx = Math.min(profile.length - 1, Math.floor(clamped * profile.length))
  return profile[idx]
}

// ─── matte.js (inlined) ──────────────────────────────────────────────────────

function average(samples: number[]): number {
  return Math.round(samples.reduce((s, v) => s + v, 0) / samples.length)
}

function pixelOffset(width: number, x: number, y: number): number {
  return (y * width + x) * 4
}

type RGB = { r: number; g: number; b: number }

function estimateBackgroundColor(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): RGB {
  const red: number[] = []
  const green: number[] = []
  const blue: number[] = []
  const seen = new Set<string>()

  const sample = (x: number, y: number) => {
    const key = `${x}:${y}`
    if (seen.has(key)) return
    seen.add(key)
    const off = pixelOffset(width, x, y)
    red.push(pixels[off])
    green.push(pixels[off + 1])
    blue.push(pixels[off + 2])
  }

  for (let x = 0; x < width; x++) {
    sample(x, 0)
    sample(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    sample(0, y)
    sample(width - 1, y)
  }
  return { r: average(red), g: average(green), b: average(blue) }
}

function colorDistance(r: number, g: number, b: number, bg: RGB): number {
  return Math.sqrt((r - bg.r) ** 2 + (g - bg.g) ** 2 + (b - bg.b) ** 2)
}

function createForegroundAlphaMask(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  {
    background = estimateBackgroundColor(pixels, width, height),
    threshold = 34,
    feather = 28,
  }: { background?: RGB; threshold?: number; feather?: number } = {},
): Uint8ClampedArray {
  const alpha = new Uint8ClampedArray(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const off = pixelOffset(width, x, y)
      const dist = colorDistance(
        pixels[off],
        pixels[off + 1],
        pixels[off + 2],
        background,
      )
      const normalized = (dist - threshold) / Math.max(1, feather)
      alpha[y * width + x] = Math.round(
        Math.max(0, Math.min(1, normalized)) * 255,
      )
    }
  }
  return alpha
}

function smoothProfile(profile: Band[]): Band[] {
  return profile.map((band, i) => {
    const prev = profile[i - 1] ?? band
    const next = profile[i + 1] ?? band
    return {
      width: (prev.width + band.width + next.width) / 3,
      offset: (prev.offset + band.offset + next.offset) / 3,
    }
  })
}

function deriveProfileFromAlpha(
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  { bands = 10, minAlpha = 22, minWidth = 0.1 } = {},
): Band[] {
  const profile: Band[] = []
  for (let b = 0; b < bands; b++) {
    const startY = Math.floor((b / bands) * height)
    const endY = Math.max(startY + 1, Math.floor(((b + 1) / bands) * height))
    let left = width
    let right = -1
    for (let y = startY; y < endY; y++) {
      for (let x = 0; x < width; x++) {
        if (alpha[y * width + x] < minAlpha) continue
        left = Math.min(left, x)
        right = Math.max(right, x)
      }
    }
    if (right === -1) {
      profile.push({ width: minWidth, offset: 0 })
      continue
    }
    const bw = Math.max(minWidth, (right - left + 1) / width)
    const center = (left + right + 1) / 2 / width
    profile.push({ width: bw, offset: center - 0.5 })
  }
  return smoothProfile(profile)
}

function deriveForegroundBounds(
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  { minAlpha = 22, padding = 0 } = {},
) {
  let left = width,
    right = -1,
    top = height,
    bottom = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x] < minAlpha) continue
      left = Math.min(left, x)
      right = Math.max(right, x)
      top = Math.min(top, y)
      bottom = Math.max(bottom, y)
    }
  }
  if (right === -1) return null
  return {
    left: Math.max(0, left - padding),
    top: Math.max(0, top - padding),
    right: Math.min(width - 1, right + padding),
    bottom: Math.min(height - 1, bottom + padding),
  }
}

function computeForegroundPlacement({
  bounds,
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
}: {
  bounds: { left: number; top: number; right: number; bottom: number }
  sourceWidth: number
  sourceHeight: number
  targetWidth: number
  targetHeight: number
}) {
  const sw = bounds.right - bounds.left + 1
  const sh = bounds.bottom - bounds.top + 1
  const fit = Math.min(targetWidth / sw, targetHeight / sh)
  const dw = sw * fit
  const dh = sh * fit
  const scx = (bounds.left + bounds.right + 1) / 2
  const scy = (bounds.top + bounds.bottom + 1) / 2
  const tcx = (scx / sourceWidth) * targetWidth
  const tcy = (scy / sourceHeight) * targetHeight
  const clamp = (v: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, v))
  return {
    drawX: clamp(tcx - dw / 2, 0, Math.max(0, targetWidth - dw)),
    drawY: clamp(tcy - dh / 2, 0, Math.max(0, targetHeight - dh)),
    drawWidth: dw,
    drawHeight: dh,
  }
}

// ─── layout.js (core wrap, inlined) ─────────────────────────────────────────

function computeWrapRegions({
  y,
  lineHeight,
  articleLeft,
  articleWidth,
  stageTop,
  stageHeight,
  stageCenterX,
  stageWidth,
  profile,
  wrapStrength,
  gutter,
}: {
  y: number
  lineHeight: number
  articleLeft: number
  articleWidth: number
  stageTop: number
  stageHeight: number
  stageCenterX: number
  stageWidth: number
  profile: Band[]
  wrapStrength: number
  gutter: number
}): { x: number; width: number }[] {
  const lineMid = y + lineHeight / 2
  const stageBottom = stageTop + stageHeight
  if (lineMid < stageTop || lineMid > stageBottom) {
    return [{ x: articleLeft, width: articleWidth }]
  }
  const normalizedY = (lineMid - stageTop) / stageHeight
  const band = sampleProfileBand(profile, normalizedY)
  const actualCenterX = stageCenterX + band.offset * stageWidth
  const halfWidth = (stageWidth * Math.max(0.06, band.width) * wrapStrength) / 2
  const exclusionLeft = actualCenterX - halfWidth - gutter
  const exclusionRight = actualCenterX + halfWidth + gutter
  const articleRight = articleLeft + articleWidth
  const left = {
    x: articleLeft,
    width: Math.max(0, exclusionLeft - articleLeft),
  }
  const right = {
    x: Math.min(articleRight, exclusionRight),
    width: Math.max(0, articleRight - exclusionRight),
  }
  return [left, right].filter((r) => r.width > 24)
}

// ─── Canvas-based text measurer (fallback + primary) ─────────────────────────

type PreparedText = {
  startCursor: { wordIndex: number; carry: string }
  nextLine: (
    cursor: { wordIndex: number; carry: string },
    maxWidth: number,
  ) => {
    text: string
    width: number
    end: { wordIndex: number; carry: string }
  } | null
}

function createCanvasPrepared(
  text: string,
  font: string,
  ctx: CanvasRenderingContext2D,
): PreparedText {
  const words = text.replace(/\s+/g, ' ').trim().split(' ')
  ctx.font = font
  return {
    startCursor: { wordIndex: 0, carry: '' },
    nextLine(start, maxWidth) {
      let { wordIndex: idx, carry } = start
      if (idx >= words.length && !carry) return null
      let line = ''
      while (idx < words.length || carry) {
        const word = carry || words[idx]
        const candidate = line ? `${line} ${word}` : word
        if (ctx.measureText(candidate).width <= maxWidth) {
          line = candidate
          if (carry) carry = ''
          idx++
        } else {
          if (!line) {
            // force-fit first word character by character
            let fit = ''
            for (const ch of word) {
              if (ctx.measureText(fit + ch).width > maxWidth && fit) break
              fit += ch
            }
            line = fit || word[0]
            const tail = word.slice(fit.length)
            return {
              text: line,
              width: ctx.measureText(line).width,
              end: { wordIndex: tail ? idx : idx + 1, carry: tail },
            }
          }
          break
        }
      }
      return {
        text: line,
        width: ctx.measureText(line).width,
        end: { wordIndex: idx, carry },
      }
    },
  }
}

// ─── Pretext dynamic loader ───────────────────────────────────────────────────

type PretextMod = {
  prepareWithSegments: (t: string, f: string) => unknown
  layoutNextLine: (
    p: unknown,
    cursor: unknown,
    w: number,
  ) => { text: string; width: number; end: unknown } | null
}

let pretextPromise: Promise<PretextMod | null> | undefined
function loadPretext(): Promise<PretextMod | null> {
  if (!pretextPromise) {
    const url = 'https://esm.sh/@chenglou/pretext'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pretextPromise = import(/* @vite-ignore */ url as any).catch(() => null)
  }
  return pretextPromise
}

async function createPreparedText(
  text: string,
  font: string,
  ctx: CanvasRenderingContext2D,
): Promise<PreparedText> {
  const mod = await loadPretext()
  if (mod) {
    const p = mod.prepareWithSegments(text, font)
    return {
      startCursor: { segmentIndex: 0, graphemeIndex: 0 } as unknown as {
        wordIndex: number
        carry: string
      },
      nextLine(cursor, maxWidth) {
        return mod.layoutNextLine(p, cursor, maxWidth) as ReturnType<
          PreparedText['nextLine']
        >
      },
    }
  }
  return createCanvasPrepared(text, font, ctx)
}

// ─── Sample article text ──────────────────────────────────────────────────────

const ARTICLE_TEXT = `Typography has always shaped how we receive words. Long before screens, typographers spent careers perfecting the rhythm of text on a page — the interplay of white space, column width, and line length that makes reading effortless. The browser, for all its power, treats text layout as a side effect: something that happens after the fact, triggered by the DOM, measured by reflowing the entire layout tree. Pretext changes that contract. It brings text measurement into userland — pure arithmetic on cached segment widths — so that layout becomes an input to your render loop rather than a costly side effect of it. The result you see here is a direct consequence: article text that flows around a moving foreground subject, line by line, recomputed each frame at near-zero cost. This is what it looks like when the browser is no longer in charge of measuring its own words.`

// ─── React component ──────────────────────────────────────────────────────────

const FONT = '19px Georgia, serif'
const LINE_HEIGHT = 31
const GUTTER = 9
const CANVAS_W = 900
const CANVAS_H = 520
const MATTE_THRESHOLD = 34
const MATTE_FEATHER = 28

const DEFAULT_VIDEO = '/assets/dance.mp4'

export default function MatteflowDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const offRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number>(0)
  const preparedRef = useRef<PreparedText | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(DEFAULT_VIDEO)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [wrapStrength, setWrapStrength] = useState(0.77)
  const [scale, setScale] = useState(0.79)
  const [vShift, setVShift] = useState(0.02)
  const [hShift, setHShift] = useState(0.21)

  // Load pretext eagerly
  useEffect(() => {
    loadPretext()
  }, [])

  // Prepare article text once
  useEffect(() => {
    const off = document.createElement('canvas')
    off.width = CANVAS_W
    off.height = CANVAS_H
    offRef.current = off
    const ctx = off.getContext('2d')!
    createPreparedText(ARTICLE_TEXT, FONT, ctx).then((p) => {
      preparedRef.current = p
    })
  }, [])

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const off = offRef.current
    const prepared = preparedRef.current
    if (!canvas || !video || !off || !prepared || video.readyState < 2) return

    const ctx = canvas.getContext('2d')!
    const offCtx = off.getContext('2d', { willReadFrequently: true })!
    const W = CANVAS_W
    const H = CANVAS_H

    // Draw frame to offscreen canvas to read pixels
    const vw = video.videoWidth
    const vh = video.videoHeight
    offCtx.clearRect(0, 0, W, H)
    offCtx.drawImage(video, 0, 0, vw, vh, 0, 0, W, H)
    const imageData = offCtx.getImageData(0, 0, W, H)

    // Matte
    const bg = estimateBackgroundColor(imageData.data, W, H)
    const alpha = createForegroundAlphaMask(imageData.data, W, H, {
      background: bg,
      threshold: MATTE_THRESHOLD,
      feather: MATTE_FEATHER,
    })
    const profile = deriveProfileFromAlpha(alpha, W, H)
    const bounds = deriveForegroundBounds(alpha, W, H, { padding: 8 })

    // Render background (paper white)
    ctx.fillStyle = '#f7f4ef'
    ctx.fillRect(0, 0, W, H)

    // Compute stage placement
    const stageW = W * scale
    const stageH = H * scale
    const stageCX = W * (0.5 + hShift)
    const stageTop = H * (0.5 - stageH / 2 / H + vShift) - stageH * 0.1

    // Compute text layout
    const MARGIN = 36
    const articleLeft = MARGIN
    const articleWidth = W - MARGIN * 2
    const lines: { text: string; x: number; y: number }[] = []
    let cursor = prepared.startCursor
    let y = MARGIN

    while (y + LINE_HEIGHT <= H - MARGIN) {
      const regions = computeWrapRegions({
        y,
        lineHeight: LINE_HEIGHT,
        articleLeft,
        articleWidth,
        stageTop,
        stageHeight: stageH,
        stageCenterX: stageCX,
        stageWidth: stageW,
        profile,
        wrapStrength,
        gutter: GUTTER,
      })

      let placedAny = false
      for (const region of regions) {
        const line = prepared.nextLine(cursor, region.width)
        if (!line) {
          y = H
          break
        }
        lines.push({ text: line.text, x: region.x, y })
        cursor = line.end
        placedAny = true
      }
      if (!placedAny) break
      y += LINE_HEIGHT
    }

    // Draw text
    ctx.fillStyle = '#1a1612'
    ctx.font = FONT
    ctx.textBaseline = 'top'
    for (const line of lines) {
      ctx.fillText(line.text, line.x, line.y)
    }

    // Draw foreground subject with matte
    if (bounds) {
      const placement = computeForegroundPlacement({
        bounds,
        sourceWidth: W,
        sourceHeight: H,
        targetWidth: stageW,
        targetHeight: stageH,
      })
      const sx = bounds.left,
        sy = bounds.top
      const sw = bounds.right - bounds.left + 1
      const sh = bounds.bottom - bounds.top + 1
      const dx = stageCX - stageW / 2 + placement.drawX
      const dy = stageTop + placement.drawY

      // Composite foreground with alpha
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = W
      tempCanvas.height = H
      const tCtx = tempCanvas.getContext('2d')!
      tCtx.drawImage(video, 0, 0, vw, vh, 0, 0, W, H)
      const td = tCtx.getImageData(0, 0, W, H)
      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          td.data[(py * W + px) * 4 + 3] = alpha[py * W + px]
        }
      }
      tCtx.putImageData(td, 0, 0)
      ctx.drawImage(
        tempCanvas,
        sx,
        sy,
        sw,
        sh,
        dx,
        dy,
        placement.drawWidth,
        placement.drawHeight,
      )
    } else {
      // No subject detected — draw raw video in stage area
      ctx.globalAlpha = 0.6
      ctx.drawImage(video, stageCX - stageW / 2, stageTop, stageW, stageH)
      ctx.globalAlpha = 1
    }

    // Reset cursor for next frame (re-layout from scratch each frame)
    preparedRef.current = prepared
  }, [wrapStrength, scale, vShift, hShift])

  const startLoop = useCallback(() => {
    const loop = () => {
      renderFrame()
      rafRef.current = requestAnimationFrame(loop)
    }
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [renderFrame])

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
  }, [])

  const loadVideoFile = useCallback(
    (file: File) => {
      if (videoUrl && videoUrl.startsWith('blob:'))
        URL.revokeObjectURL(videoUrl)
      stopLoop()
      setVideoUrl(URL.createObjectURL(file))
      setPlaying(false)
      setLoading(true)
    },
    [videoUrl, stopLoop],
  )

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) loadVideoFile(file)
    },
    [loadVideoFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith('video/')) loadVideoFile(file)
    },
    [loadVideoFile],
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoUrl) return

    video.src = videoUrl
    video.loop = true
    video.muted = true
    video.playsInline = true

    const onReady = () => {
      setLoading(false)
      video
        .play()
        .then(() => {
          setPlaying(true)
          startLoop()
        })
        .catch(() => setPlaying(false))
    }

    video.addEventListener('loadeddata', onReady, { once: true })
    return () => {
      video.removeEventListener('loadeddata', onReady)
      stopLoop()
    }
  }, [videoUrl, startLoop, stopLoop])

  // Re-render when sliders change
  useEffect(() => {
    if (playing) {
      stopLoop()
      startLoop()
    }
  }, [wrapStrength, scale, vShift, hShift, playing, startLoop, stopLoop])

  useEffect(
    () => () => {
      stopLoop()
    },
    [stopLoop],
  )

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (playing) {
      video.pause()
      stopLoop()
      setPlaying(false)
    } else {
      video.play().then(() => {
        setPlaying(true)
        startLoop()
      })
    }
  }, [playing, startLoop, stopLoop])

  return (
    <div className="not-prose border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      {/* Hidden video element */}
      <video ref={videoRef} className="hidden" />

      {/* Canvas */}
      <div className="relative bg-[#f7f4ef]">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block h-auto w-full"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f7f4ef]/80">
            <p className="animate-pulse text-sm text-gray-600">Loading…</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="border-border bg-muted/20 space-y-3 border-t px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              disabled={loading}
              className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? '⏳ Loading…' : playing ? '⏸ Pause' : '▶ Play'}
            </button>
            <label
              className="border-border bg-background text-muted-foreground hover:text-foreground cursor-pointer rounded-lg border px-3 py-1.5 text-xs transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              Use your own video
              <input
                type="file"
                accept="video/*"
                className="sr-only"
                onChange={handleFile}
              />
            </label>
          </div>
          <span className="text-muted-foreground text-[11px]">
            Text layout via{' '}
            <a
              href="https://github.com/chenglou/pretext"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline"
            >
              @chenglou/pretext
            </a>
          </span>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <strong>Best results with your video:</strong> use a recording with a
          person against a plain, uniform background — green screen, white wall,
          or solid color backdrop. The matte algorithm measures color distance
          from the frame edges, so busy or gradient backgrounds will reduce
          quality.
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          {[
            {
              label: 'Wrap',
              value: wrapStrength,
              set: setWrapStrength,
              min: 0,
              max: 1.5,
              step: 0.01,
            },
            {
              label: 'Scale',
              value: scale,
              set: setScale,
              min: 0.3,
              max: 1.2,
              step: 0.01,
            },
            {
              label: 'V-Shift',
              value: vShift,
              set: setVShift,
              min: -0.3,
              max: 0.3,
              step: 0.01,
            },
            {
              label: 'H-Shift',
              value: hShift,
              set: setHShift,
              min: -0.3,
              max: 0.3,
              step: 0.01,
            },
          ].map(({ label, value, set, min, max, step }) => (
            <label key={label} className="flex flex-col gap-1">
              <span className="text-muted-foreground font-medium">
                {label}{' '}
                <span className="text-foreground font-mono">
                  {value.toFixed(2)}
                </span>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => set(parseFloat(e.target.value))}
                className="accent-primary w-full"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
