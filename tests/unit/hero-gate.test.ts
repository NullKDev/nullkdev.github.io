import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ALLOWED_ROBOT_ANIMATIONS,
  canAnimateRobot,
  canLoadRobot,
  getNextRobotAnimation,
  getRobotRepetitions,
  measureRobotVisibility,
  ROBOT_GAP_MS,
  supportsWebGL2,
} from '@/components/hero/model-showcase-policy'

describe('autonomous robot policy', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('defines the exact runtime clip allowlist', () => {
    expect(ALLOWED_ROBOT_ANIMATIONS).toEqual([
      'Dance',
      'Death',
      'Idle',
      'Jump',
      'No',
      'Running',
      'ThumbsUp',
      'Walking',
      'WalkJump',
      'Wave',
      'Yes',
    ])
    expect(ALLOWED_ROBOT_ANIMATIONS).not.toContain('Punch')
    expect(ALLOWED_ROBOT_ANIMATIONS).not.toContain('Sitting')
    expect(ALLOWED_ROBOT_ANIMATIONS).not.toContain('Standing')
  })

  it('loads only when near the viewport and WebGL is healthy', () => {
    expect(canLoadRobot({ nearViewport: true, webglHealthy: true })).toBe(true)
    expect(canLoadRobot({ nearViewport: false, webglHealthy: true })).toBe(
      false,
    )
    expect(canLoadRobot({ nearViewport: true, webglHealthy: false })).toBe(
      false,
    )
  })

  it('animates only while every lifecycle condition is true', () => {
    const eligible = {
      fullyVisible: true,
      documentVisible: true,
      loaded: true,
      webglHealthy: true,
    }

    expect(canAnimateRobot(eligible)).toBe(true)
    for (const key of Object.keys(eligible) as (keyof typeof eligible)[]) {
      expect(canAnimateRobot({ ...eligible, [key]: false })).toBe(false)
    }
  })

  it('animates regardless of the reduced-motion preference', () => {
    // The robot is the page's single deliberate motion piece: a short clip,
    // a pause, then the next one. Playback is gated on visibility and WebGL
    // health only, so the sequence is identical for every visitor.
    expect(
      canAnimateRobot({
        fullyVisible: true,
        documentVisible: true,
        loaded: true,
        webglHealthy: true,
      }),
    ).toBe(true)
  })

  it('always starts Idle then Wave before choosing a random clip', () => {
    const availableAnimations = [...ALLOWED_ROBOT_ANIMATIONS]
    const idle = getNextRobotAnimation({
      availableAnimations,
      phase: 'idle',
      previousAnimation: null,
      random: () => 0.5,
    })
    const wave = getNextRobotAnimation({
      availableAnimations,
      phase: idle?.nextPhase ?? 'idle',
      previousAnimation: idle?.animation ?? null,
      random: () => 0.5,
    })
    const random = getNextRobotAnimation({
      availableAnimations,
      phase: wave?.nextPhase ?? 'idle',
      previousAnimation: wave?.animation ?? null,
      random: () => 0,
    })

    expect(idle).toEqual({ animation: 'Idle', nextPhase: 'wave' })
    expect(wave).toEqual({ animation: 'Wave', nextPhase: 'random' })
    expect(random).toEqual({ animation: 'Dance', nextPhase: 'random' })
  })

  it('restricts random selection to available allowed clips', () => {
    const result = getNextRobotAnimation({
      availableAnimations: ['Punch', 'Idle', 'Wave', 'Yes'],
      phase: 'random',
      previousAnimation: 'Wave',
      random: () => 0.999,
    })

    expect(result).toEqual({ animation: 'Yes', nextPhase: 'random' })
  })

  it('avoids immediate random repetition without biasing the remaining pool', () => {
    const availableAnimations = ['Dance', 'Death', 'Yes', 'Idle']
    const first = getNextRobotAnimation({
      availableAnimations,
      phase: 'random',
      previousAnimation: 'Dance',
      random: () => 0,
    })
    const last = getNextRobotAnimation({
      availableAnimations,
      phase: 'random',
      previousAnimation: 'Dance',
      random: () => 0.999,
    })

    expect(first?.animation).toBe('Death')
    expect(last?.animation).toBe('Yes')
  })

  it('keeps Idle out of the random pool', () => {
    // Idle is the resting pose, not a performance. In the shuffle it was about
    // a third of all picks, leaving the robot breathing most of the time.
    for (const random of [0, 0.25, 0.5, 0.75, 0.999999]) {
      expect(
        getNextRobotAnimation({
          availableAnimations: [...ALLOWED_ROBOT_ANIMATIONS],
          phase: 'random',
          previousAnimation: null,
          random: () => random,
        })?.animation,
      ).not.toBe('Idle')
    }
  })

  it('falls back to repeating the only clip left rather than stopping', () => {
    expect(
      getNextRobotAnimation({
        availableAnimations: ['Dance', 'Idle'],
        phase: 'random',
        previousAnimation: 'Dance',
        random: () => 0.5,
      }),
    ).toEqual({ animation: 'Dance', nextPhase: 'random' })
  })

  it('loops locomotion cycles so a step resolves instead of cutting', () => {
    expect(getRobotRepetitions('Walking')).toBe(3)
    expect(getRobotRepetitions('Running')).toBe(3)
    expect(getRobotRepetitions('Wave')).toBe(1)
    expect(getRobotRepetitions('Dance')).toBe(1)
  })

  it('holds a fixed 300 ms gap between clips', () => {
    expect(ROBOT_GAP_MS).toBe(300)
  })

  it('measures a fully visible model region as complete', () => {
    expect(
      measureRobotVisibility({
        rect: {
          top: 100,
          right: 900,
          bottom: 500,
          left: 400,
          width: 500,
          height: 400,
        },
        viewportWidth: 1280,
        viewportHeight: 720,
        occludedTop: 70,
      }),
    ).toEqual({ coverage: 1, requiredHeight: 400, visibleHeight: 400 })
  })

  it('caps required visibility when the model region exceeds available height', () => {
    expect(
      measureRobotVisibility({
        rect: {
          top: 70,
          right: 900,
          bottom: 770,
          left: 400,
          width: 500,
          height: 700,
        },
        viewportWidth: 1280,
        viewportHeight: 500,
        occludedTop: 70,
      }),
    ).toEqual({ coverage: 1, requiredHeight: 430, visibleHeight: 430 })
  })

  it('penalizes model regions hidden behind the header or viewport edge', () => {
    const behindHeader = measureRobotVisibility({
      rect: {
        top: 20,
        right: 900,
        bottom: 370,
        left: 400,
        width: 500,
        height: 350,
      },
      viewportWidth: 1280,
      viewportHeight: 500,
      occludedTop: 70,
    })
    const belowViewport = measureRobotVisibility({
      rect: {
        top: 450,
        right: 900,
        bottom: 800,
        left: 400,
        width: 500,
        height: 350,
      },
      viewportWidth: 1280,
      viewportHeight: 500,
      occludedTop: 70,
    })

    expect(behindHeader.coverage).toBeCloseTo(300 / 350)
    expect(belowViewport.coverage).toBeCloseTo(50 / 350)
  })

  it('releases the temporary WebGL2 probe context', () => {
    const loseContext = vi.fn()
    const context = {
      getExtension: vi.fn(() => ({ loseContext })),
    } as unknown as WebGL2RenderingContext
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context)

    expect(supportsWebGL2()).toBe(true)
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith(
      'webgl2',
    )
    expect(loseContext).toHaveBeenCalledOnce()
  })
})
