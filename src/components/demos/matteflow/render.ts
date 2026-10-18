/**
 * Draws one Matteflow frame: matte the video frame, lay the article out around
 * the subject's silhouette, then composite the cut-out on top.
 */
import {
  computeWrapRegions,
  layoutArticleLines,
  type PreparedText,
} from './layout'
import {
  computeForegroundPlacement,
  createForegroundAlphaMask,
  deriveForegroundBounds,
  deriveProfileFromAlpha,
  estimateBackgroundColor,
} from './matte'

export const FONT = '19px Georgia, serif'
export const CANVAS_WIDTH = 900
export const CANVAS_HEIGHT = 520
export const PAPER = '#f7f4ef'
const INK = '#1a1612'
const LINE_HEIGHT = 31
const GUTTER = 9
const MARGIN = 36
const MATTE_THRESHOLD = 34
const MATTE_FEATHER = 28

export interface StageParams {
  wrapStrength: number
  scale: number
  verticalShift: number
  horizontalShift: number
}

const fullColumn = () => [{ x: MARGIN, width: CANVAS_WIDTH - MARGIN * 2 }]

/** The article alone, across the full column — the state before a video. */
export function renderArticleOnly(
  canvas: HTMLCanvasElement,
  prepared: PreparedText,
): void {
  const context = canvas.getContext('2d')
  if (!context) return
  context.fillStyle = PAPER
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  drawLines(
    context,
    layoutArticleLines({
      prepared,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      margin: MARGIN,
      lineHeight: LINE_HEIGHT,
      regionsAt: fullColumn,
    }),
  )
}

const drawLines = (
  context: CanvasRenderingContext2D,
  lines: { text: string; x: number; y: number }[],
) => {
  context.fillStyle = INK
  context.font = FONT
  context.textBaseline = 'top'
  for (const line of lines) context.fillText(line.text, line.x, line.y)
}

export function renderMatteflowFrame({
  canvas,
  video,
  scratch,
  composite,
  prepared,
  stage,
}: {
  canvas: HTMLCanvasElement
  video: HTMLVideoElement
  /** Offscreen canvas the frame is read back from. */
  scratch: HTMLCanvasElement
  /** Offscreen canvas holding the matted subject. */
  composite: HTMLCanvasElement
  prepared: PreparedText
  stage: StageParams
}): void {
  const context = canvas.getContext('2d')
  const scratchContext = scratch.getContext('2d', { willReadFrequently: true })
  const compositeContext = composite.getContext('2d')
  if (!context || !scratchContext || !compositeContext) return

  const W = CANVAS_WIDTH
  const H = CANVAS_HEIGHT
  scratchContext.clearRect(0, 0, W, H)
  scratchContext.drawImage(
    video,
    0,
    0,
    video.videoWidth,
    video.videoHeight,
    0,
    0,
    W,
    H,
  )
  const frame = scratchContext.getImageData(0, 0, W, H)

  const alpha = createForegroundAlphaMask(frame.data, W, H, {
    background: estimateBackgroundColor(frame.data, W, H),
    threshold: MATTE_THRESHOLD,
    feather: MATTE_FEATHER,
  })
  const profile = deriveProfileFromAlpha(alpha, W, H)
  const bounds = deriveForegroundBounds(alpha, W, H, { padding: 8 })

  context.fillStyle = PAPER
  context.fillRect(0, 0, W, H)

  const stageWidth = W * stage.scale
  const stageHeight = H * stage.scale
  const stageCenterX = W * (0.5 + stage.horizontalShift)
  const stageTop =
    H * (0.5 - stageHeight / 2 / H + stage.verticalShift) - stageHeight * 0.1

  const lines = layoutArticleLines({
    prepared,
    width: W,
    height: H,
    margin: MARGIN,
    lineHeight: LINE_HEIGHT,
    regionsAt: (y) =>
      computeWrapRegions({
        y,
        lineHeight: LINE_HEIGHT,
        articleLeft: MARGIN,
        articleWidth: W - MARGIN * 2,
        stageTop,
        stageHeight,
        stageCenterX,
        stageWidth,
        profile,
        wrapStrength: stage.wrapStrength,
        gutter: GUTTER,
      }),
  })

  drawLines(context, lines)

  if (!bounds) {
    // No subject detected — show the raw frame in the stage instead.
    context.globalAlpha = 0.6
    context.drawImage(
      video,
      stageCenterX - stageWidth / 2,
      stageTop,
      stageWidth,
      stageHeight,
    )
    context.globalAlpha = 1
    return
  }

  // The frame already read back is reused: its alpha channel becomes the matte.
  for (let index = 0; index < alpha.length; index++) {
    frame.data[index * 4 + 3] = alpha[index]
  }
  compositeContext.putImageData(frame, 0, 0)

  const placement = computeForegroundPlacement({
    bounds,
    sourceWidth: W,
    sourceHeight: H,
    targetWidth: stageWidth,
    targetHeight: stageHeight,
  })
  context.drawImage(
    composite,
    bounds.left,
    bounds.top,
    bounds.right - bounds.left + 1,
    bounds.bottom - bounds.top + 1,
    stageCenterX - stageWidth / 2 + placement.drawX,
    stageTop + placement.drawY,
    placement.drawWidth,
    placement.drawHeight,
  )
}
