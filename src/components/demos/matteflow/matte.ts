/**
 * Colour-distance matte for the Matteflow demo — a compressed port of the
 * `matte.js` and `profile.js` modules of Matteflow by summerKK
 * (https://github.com/summerKK/Matteflow).
 *
 * Pure functions over a frame's RGBA pixels: no canvas, no DOM, so the cut-out
 * a reader sees can be pinned by unit tests.
 */

export interface Band {
  width: number
  offset: number
}

export interface RGB {
  r: number
  g: number
  b: number
}

export interface Bounds {
  left: number
  top: number
  right: number
  bottom: number
}

const average = (samples: number[]): number =>
  Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length)

const pixelOffset = (width: number, x: number, y: number): number =>
  (y * width + x) * 4

/** The backdrop colour, read from the frame's edges. */
export function estimateBackgroundColor(
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
    const offset = pixelOffset(width, x, y)
    red.push(pixels[offset])
    green.push(pixels[offset + 1])
    blue.push(pixels[offset + 2])
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

const colorDistance = (r: number, g: number, b: number, bg: RGB): number =>
  Math.sqrt((r - bg.r) ** 2 + (g - bg.g) ** 2 + (b - bg.b) ** 2)

/** One alpha byte per pixel: 0 is backdrop, 255 is subject. */
export function createForegroundAlphaMask(
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
      const offset = pixelOffset(width, x, y)
      const distance = colorDistance(
        pixels[offset],
        pixels[offset + 1],
        pixels[offset + 2],
        background,
      )
      const normalized = (distance - threshold) / Math.max(1, feather)
      alpha[y * width + x] = Math.round(
        Math.max(0, Math.min(1, normalized)) * 255,
      )
    }
  }
  return alpha
}

const smoothProfile = (profile: Band[]): Band[] =>
  profile.map((band, index) => {
    const previous = profile[index - 1] ?? band
    const next = profile[index + 1] ?? band
    return {
      width: (previous.width + band.width + next.width) / 3,
      offset: (previous.offset + band.offset + next.offset) / 3,
    }
  })

/**
 * The subject's silhouette as horizontal bands: how wide it is, and how far
 * off-centre, from top to bottom. Text wraps against this, not the raw mask.
 */
export function deriveProfileFromAlpha(
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  { bands = 10, minAlpha = 22, minWidth = 0.1 } = {},
): Band[] {
  const profile: Band[] = []
  for (let band = 0; band < bands; band++) {
    const startY = Math.floor((band / bands) * height)
    const endY = Math.max(startY + 1, Math.floor(((band + 1) / bands) * height))
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
    const bandWidth = Math.max(minWidth, (right - left + 1) / width)
    const center = (left + right + 1) / 2 / width
    profile.push({ width: bandWidth, offset: center - 0.5 })
  }
  return smoothProfile(profile)
}

/** The subject's bounding box, or `null` when the frame holds no subject. */
export function deriveForegroundBounds(
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  { minAlpha = 22, padding = 0 } = {},
): Bounds | null {
  let left = width
  let right = -1
  let top = height
  let bottom = -1
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

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value))

/** Where the cut-out lands inside the stage: fitted, never outside it. */
export function computeForegroundPlacement({
  bounds,
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
}: {
  bounds: Bounds
  sourceWidth: number
  sourceHeight: number
  targetWidth: number
  targetHeight: number
}) {
  const subjectWidth = bounds.right - bounds.left + 1
  const subjectHeight = bounds.bottom - bounds.top + 1
  const fit = Math.min(targetWidth / subjectWidth, targetHeight / subjectHeight)
  const drawWidth = subjectWidth * fit
  const drawHeight = subjectHeight * fit
  const centerX =
    ((bounds.left + bounds.right + 1) / 2 / sourceWidth) * targetWidth
  const centerY =
    ((bounds.top + bounds.bottom + 1) / 2 / sourceHeight) * targetHeight
  return {
    drawX: clamp(
      centerX - drawWidth / 2,
      0,
      Math.max(0, targetWidth - drawWidth),
    ),
    drawY: clamp(
      centerY - drawHeight / 2,
      0,
      Math.max(0, targetHeight - drawHeight),
    ),
    drawWidth,
    drawHeight,
  }
}
