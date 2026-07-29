export const ALLOWED_ROBOT_ANIMATIONS = [
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
] as const

export type RobotAnimation = (typeof ALLOWED_ROBOT_ANIMATIONS)[number]
export type RobotAnimationPhase = 'idle' | 'wave' | 'random'

interface RobotVisibilityInput {
  rect: {
    top: number
    right: number
    bottom: number
    left: number
    width: number
    height: number
  }
  viewportWidth: number
  viewportHeight: number
  /** Height of the sticky header covering the top of the viewport. */
  occludedTop: number
}

interface RobotVisibility {
  /** visibleHeight / requiredHeight, clamped to 1. */
  coverage: number
  /** How much of the model we can reasonably demand be on screen. */
  requiredHeight: number
  /** How much of it actually is. */
  visibleHeight: number
}

/**
 * Measures how much of the model region sits in the unobstructed band between
 * the header and the bottom of the viewport. A region taller than that band can
 * never be fully shown, so the requirement is capped at the band itself —
 * otherwise a tall hero on a short screen would never qualify as visible.
 */
export const measureRobotVisibility = ({
  rect,
  viewportHeight,
  occludedTop,
}: RobotVisibilityInput): RobotVisibility => {
  const bandTop = occludedTop
  const bandBottom = viewportHeight
  const bandHeight = Math.max(bandBottom - bandTop, 0)

  const requiredHeight = Math.min(rect.height, bandHeight)
  const visibleHeight = Math.max(
    Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop),
    0,
  )

  return {
    coverage:
      requiredHeight > 0 ? Math.min(visibleHeight / requiredHeight, 1) : 0,
    requiredHeight,
    visibleHeight,
  }
}

export const canLoadRobot = ({
  nearViewport,
  webglHealthy,
}: {
  nearViewport: boolean
  webglHealthy: boolean
}): boolean => nearViewport && webglHealthy

export const canAnimateRobot = ({
  fullyVisible,
  documentVisible,
  loaded,
  webglHealthy,
}: {
  fullyVisible: boolean
  documentVisible: boolean
  loaded: boolean
  webglHealthy: boolean
}): boolean => fullyVisible && documentVisible && loaded && webglHealthy

export const getNextRobotAnimation = ({
  availableAnimations,
  phase,
  previousAnimation,
  random = Math.random,
}: {
  availableAnimations: readonly string[]
  phase: RobotAnimationPhase
  previousAnimation: string | null
  random?: () => number
}): { animation: RobotAnimation; nextPhase: RobotAnimationPhase } | null => {
  const available = new Set(availableAnimations)

  if (phase === 'idle') {
    return available.has('Idle')
      ? { animation: 'Idle', nextPhase: 'wave' }
      : null
  }
  if (phase === 'wave') {
    return available.has('Wave')
      ? { animation: 'Wave', nextPhase: 'random' }
      : null
  }

  const pool = RANDOM_POOL.filter((animation) => available.has(animation))
  if (pool.length === 0) return null

  // Avoid playing the same clip twice in a row, unless it is the only one left.
  const withoutRepeat = pool.filter(
    (animation) => animation !== previousAnimation,
  )
  const choices = withoutRepeat.length > 0 ? withoutRepeat : pool

  const value = Math.min(Math.max(random(), 0), 1 - Number.EPSILON)
  return {
    animation: choices[Math.floor(value * choices.length)],
    nextPhase: 'random',
  }
}

/**
 * Idle is the resting pose the robot returns to, not a performance. Leaving it
 * in the shuffle made it roughly a third of all picks, so the robot spent most
 * of its time breathing while the short clips snapped past.
 */
const RANDOM_POOL = ALLOWED_ROBOT_ANIMATIONS.filter(
  (animation) => animation !== 'Idle',
)

/**
 * Walking and Running are locomotion cycles: one repetition is a single step,
 * which reads as a glitch rather than an animation. Looping them a few times
 * lets the cycle resolve and puts their length in range of the other clips.
 */
const CLIP_REPETITIONS: Partial<Record<RobotAnimation, number>> = {
  Running: 3,
  Walking: 3,
}

export const getRobotRepetitions = (animation: RobotAnimation): number =>
  CLIP_REPETITIONS[animation] ?? 1

/** Pause held between one clip finishing and the next one starting. */
export const ROBOT_GAP_MS = 300

/** Playback rate for every clip: 15% slower than the authored speed. */
export const ROBOT_TIME_SCALE = 0.85

/** Share of the showable band the model must occupy before it performs. */
export const VISIBILITY_THRESHOLD = 0.98

export function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    if (!context) return false

    context.getExtension('WEBGL_lose_context')?.loseContext()
    canvas.width = 0
    canvas.height = 0
    return true
  } catch {
    return false
  }
}
