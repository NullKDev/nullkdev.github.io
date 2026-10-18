import { createMeasuredPrepared, type PreparedText } from './layout'

type PretextModule = {
  prepareWithSegments: (text: string, font: string) => unknown
  layoutNextLine: (
    prepared: unknown,
    cursor: unknown,
    width: number,
  ) => ReturnType<PreparedText['nextLine']>
}

let pretextPromise: Promise<PretextModule | null> | undefined

/**
 * Bundled from node_modules, not fetched from a CDN at runtime: a third-party
 * origin serving executable code into a reader's browser is a supply-chain
 * dependency this archive does not need to take on, and it contradicts the
 * local-first claim the rest of the site makes.
 */
export function loadPretext(): Promise<PretextModule | null> {
  pretextPromise ??= import('@chenglou/pretext')
    .then((module) => module as unknown as PretextModule)
    .catch(() => null)
  return pretextPromise
}

/**
 * Pretext when it loads; canvas `measureText` word-wrapping when it does not,
 * so the demo still flows text either way.
 */
export async function createPreparedText(
  text: string,
  font: string,
  context: CanvasRenderingContext2D,
): Promise<PreparedText> {
  const pretext = await loadPretext()
  if (pretext) {
    const prepared = pretext.prepareWithSegments(text, font)
    return {
      // Pretext's cursor is its own shape; the demo only passes it back.
      startCursor: {
        segmentIndex: 0,
        graphemeIndex: 0,
      } as unknown as PreparedText['startCursor'],
      nextLine: (cursor, maxWidth) =>
        pretext.layoutNextLine(prepared, cursor, maxWidth),
    }
  }
  context.font = font
  return createMeasuredPrepared(
    text,
    (candidate) => context.measureText(candidate).width,
  )
}
