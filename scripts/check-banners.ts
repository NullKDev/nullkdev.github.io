/**
 * Every banner is authored at exactly one size.
 *
 * The CSS pins the *display* ratio, which is why a banner can no longer render
 * as three different crops of itself. It does not stop anyone authoring a
 * 800x400 file: that would still be forced into 2.5:1 and quietly stretched or
 * cropped, and the mistake would only be visible to whoever happened to look.
 * So the size is asserted here, in the build, where it fails loudly instead.
 *
 * One canonical size, two jobs:
 *
 *   1200x630 is the Open Graph card size. Banners double as social previews,
 *   so authoring at anything else means a second asset to keep in sync.
 *
 *   Displayed at 2.5:1 the top and bottom are centre-cropped — 75px off each
 *   edge. Anything that must stay legible belongs inside the middle band. The
 *   check reports that safe area so it is a number, not a memory.
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const DIRECTORY = 'public/banners'

/** The authored size. Open Graph's card, and the source for every surface. */
export const BANNER_WIDTH = 1200
export const BANNER_HEIGHT = 630

/** What the CSS `--banner-ratio` token displays. Keep the two in step. */
export const DISPLAY_RATIO = 1200 / 480

/** Vertical band that survives the centre crop at the display ratio. */
export const safeArea = (): { top: number; height: number } => {
  const visible = Math.round(BANNER_WIDTH / DISPLAY_RATIO)
  return { top: Math.round((BANNER_HEIGHT - visible) / 2), height: visible }
}

export interface BannerSize {
  width: number
  height: number
}

/**
 * Reads the intrinsic size of an SVG.
 *
 * `viewBox` is preferred over `width`/`height`: the attributes are often a CSS
 * length ("100%", "75rem") while the viewBox is always user units, and it is
 * the viewBox that decides the shape the browser scales into.
 */
export const readSvgSize = (source: string): BannerSize | null => {
  const viewBox =
    /viewBox\s*=\s*["']\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(
      source,
    )
  if (viewBox) {
    return { width: Number(viewBox[3]), height: Number(viewBox[4]) }
  }

  const width = /\swidth\s*=\s*["']([\d.]+)(?:px)?["']/i.exec(source)
  const height = /\sheight\s*=\s*["']([\d.]+)(?:px)?["']/i.exec(source)
  if (width && height) {
    return { width: Number(width[1]), height: Number(height[1]) }
  }
  return null
}

/** PNG carries its size in the IHDR chunk, at a fixed offset. */
export const readPngSize = (bytes: Uint8Array): BannerSize | null => {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10]
  if (bytes.length < 24) return null
  if (signature.some((byte, index) => bytes[index] !== byte)) return null

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return { width: view.getUint32(16), height: view.getUint32(20) }
}

export const describe = (size: BannerSize | null): string =>
  size ? `${size.width}x${size.height}` : 'unreadable'

export const isCanonical = (size: BannerSize | null): boolean =>
  size?.width === BANNER_WIDTH && size?.height === BANNER_HEIGHT

if (import.meta.main) {
  const entries = await readdir(DIRECTORY, { withFileTypes: true }).catch(
    () => [],
  )
  const banners = entries
    .filter((entry) => entry.isFile() && /\.(svg|png)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort()

  if (banners.length === 0) {
    console.error(`No banners found in ${DIRECTORY}.`)
    process.exit(1)
  }

  const failures: string[] = []

  for (const name of banners) {
    const path = join(DIRECTORY, name)
    const size = name.toLowerCase().endsWith('.svg')
      ? readSvgSize(await readFile(path, 'utf8'))
      : readPngSize(new Uint8Array(await readFile(path)))

    if (!isCanonical(size)) {
      failures.push(
        `  ${path}: ${describe(size)} — must be ${BANNER_WIDTH}x${BANNER_HEIGHT}`,
      )
    }
  }

  if (failures.length > 0) {
    const { top, height } = safeArea()
    console.error(`${failures.length} banner(s) are not the canonical size:\n`)
    console.error(failures.join('\n'))
    console.error(
      `\nAuthor every banner at ${BANNER_WIDTH}x${BANNER_HEIGHT} — it is the Open Graph card size, so the` +
        `\nsame file serves as the social preview. It is displayed at ${DISPLAY_RATIO.toFixed(2)}:1, which` +
        `\ncentre-crops to y=${top}..${top + height}: keep anything that must stay legible in there.`,
    )
    process.exit(1)
  }

  const { top, height } = safeArea()
  console.log(
    `All ${banners.length} banners are ${BANNER_WIDTH}x${BANNER_HEIGHT} ` +
      `(safe area y=${top}..${top + height} at ${DISPLAY_RATIO.toFixed(2)}:1).`,
  )
}
