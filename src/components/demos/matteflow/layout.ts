/**
 * Line placement for the Matteflow demo: where each line of article text may
 * go once the subject's silhouette is cut out of the column. Pure arithmetic —
 * measuring is injected, so it runs in a unit test as well as on a canvas.
 */
import type { Band } from './matte'

export interface LineCursor {
  wordIndex: number
  carry: string
}

export interface PlacedLine {
  text: string
  width: number
  end: LineCursor
}

/**
 * One prepared paragraph. `nextLine` returns the line that fits `maxWidth`
 * from `cursor`, or `null` once the text is spent. Both the pretext adapter
 * and the canvas fallback implement it.
 */
export interface PreparedText {
  startCursor: LineCursor
  nextLine: (cursor: LineCursor, maxWidth: number) => PlacedLine | null
}

export interface Region {
  x: number
  width: number
}

export function sampleProfileBand(profile: Band[], normalizedY: number): Band {
  const clamped = Math.max(0, Math.min(0.999999, normalizedY))
  const index = Math.min(
    profile.length - 1,
    Math.floor(clamped * profile.length),
  )
  return profile[index]
}

/** The column spans a line may use at height `y`: one, or two either side. */
export function computeWrapRegions({
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
}): Region[] {
  const lineMid = y + lineHeight / 2
  const stageBottom = stageTop + stageHeight
  if (lineMid < stageTop || lineMid > stageBottom) {
    return [{ x: articleLeft, width: articleWidth }]
  }
  const band = sampleProfileBand(profile, (lineMid - stageTop) / stageHeight)
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
  return [left, right].filter((region) => region.width > 24)
}

/**
 * Word-wrapping over any width function. Used with canvas `measureText` when
 * pretext cannot load; a word wider than the line is split character by
 * character and its tail carried to the next line.
 */
export function createMeasuredPrepared(
  text: string,
  measure: (text: string) => number,
): PreparedText {
  const words = text.replace(/\s+/g, ' ').trim().split(' ')
  return {
    startCursor: { wordIndex: 0, carry: '' },
    nextLine(start, maxWidth) {
      let { wordIndex: index, carry } = start
      if (index >= words.length && !carry) return null
      let line = ''
      while (index < words.length || carry) {
        const word = carry || words[index]
        const candidate = line ? `${line} ${word}` : word
        if (measure(candidate) <= maxWidth) {
          line = candidate
          if (carry) carry = ''
          index++
          continue
        }
        if (line) break
        let fit = ''
        for (const character of word) {
          if (measure(fit + character) > maxWidth && fit) break
          fit += character
        }
        line = fit || word[0]
        const tail = word.slice(line.length)
        return {
          text: line,
          width: measure(line),
          end: { wordIndex: tail ? index : index + 1, carry: tail },
        }
      }
      return {
        text: line,
        width: measure(line),
        end: { wordIndex: index, carry },
      }
    },
  }
}

/**
 * Fills the frame from `margin` down, one line per region, re-laid from the
 * start of the text every frame. Stops when the text or the space runs out.
 */
export function layoutArticleLines({
  prepared,
  height,
  margin,
  lineHeight,
  regionsAt,
}: {
  prepared: PreparedText
  width: number
  height: number
  margin: number
  lineHeight: number
  regionsAt: (y: number) => Region[]
}): { text: string; x: number; y: number }[] {
  const lines: { text: string; x: number; y: number }[] = []
  let cursor = prepared.startCursor
  for (let y = margin; y + lineHeight <= height - margin; y += lineHeight) {
    let placedAny = false
    for (const region of regionsAt(y)) {
      const line = prepared.nextLine(cursor, region.width)
      if (!line) return lines
      lines.push({ text: line.text, x: region.x, y })
      cursor = line.end
      placedAny = true
    }
    if (!placedAny) break
  }
  return lines
}
