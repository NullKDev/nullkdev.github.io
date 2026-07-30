/**
 * Draws every banner from `src/data/banners.ts`, then rasterises each one.
 *
 * Two outputs from one source, because they serve two consumers that disagree:
 *
 *   `public/banners/<slug>.svg`    — what the site renders. Small, crisp, and
 *                                    editable as text.
 *   `public/og/banners/<slug>.png` — what social scrapers render. **X,
 *                                    Facebook, LinkedIn, Slack and WhatsApp do
 *                                    not render SVG `og:image`.** Pointing a
 *                                    preview at the SVG produces no image at
 *                                    all, which is worse than a generic one.
 *
 * The artwork is pulled from the icon registry rather than drawn here. That is
 * the whole point: `simple-icons:android` was already shipping while a banner
 * carried a hand-drawn robot. A banner can only use marks the site already has,
 * and extending the registry is the way to add one.
 */
import { mkdir, writeFile } from 'node:fs/promises'

import sharp from 'sharp'

import { brand } from '../src/data/brand'
import { banners, type BannerSpec } from '../src/data/banners'
import { renderIcon } from '../src/lib/icons'

const SVG_DIRECTORY = 'public/banners'
const PNG_DIRECTORY = 'public/og/banners'

const WIDTH = 1200
const HEIGHT = 630

/* Displayed at 2.5:1 and centre-cropped, so only y=75..555 survives. Every
   element below is placed inside that band — see `scripts/check-banners.ts`,
   which prints the same bounds. */
const SAFE_TOP = 75
const SAFE_BOTTOM = 555

const escape = (value: string): string =>
  value.replace(/[<>&]/g, (character) =>
    character === '<' ? '&lt;' : character === '>' ? '&gt;' : '&amp;',
  )

/**
 * Lifts a registry icon into banner scale.
 *
 * Icons are authored on a 24-unit grid; the banner wants ~300px of artwork. The
 * inner `<svg>` is unwrapped to its body so the transform applies to the paths
 * rather than nesting a viewport that would clip them.
 */
const artwork = (spec: BannerSpec): string => {
  const source = renderIcon(spec.icon, 24)
  const body = source.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
  const scale = 13 // 24 * 13 = 312px, comfortably inside the safe band
  const x = 760
  const y = SAFE_TOP + (SAFE_BOTTOM - SAFE_TOP - 24 * scale) / 2

  return (
    `<g opacity="0.13" transform="translate(${x} ${y.toFixed(0)}) scale(${scale})" ` +
    `fill="none" stroke="${spec.accent}" stroke-width="1.4" ` +
    `stroke-linecap="round" stroke-linejoin="round">${body}</g>`
  )
}

export const renderBanner = (spec: BannerSpec): string => {
  const id = spec.slug.replace(/[^a-z0-9]/g, '')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" role="img" aria-label="${escape(spec.alt)}">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="${WIDTH}" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="${spec.deep}"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg-${id})"/>
${artwork(spec)}
  <rect x="96" y="150" width="76" height="4" rx="2" fill="${spec.accent}"/>
  <text x="96" y="205" font-family="'IBM Plex Mono',ui-monospace,monospace" font-size="26" letter-spacing="4" fill="${spec.accent}">${escape(spec.kicker.toUpperCase())}</text>
  <text x="96" y="300" font-family="Switzer,'Helvetica Neue',Arial,sans-serif" font-size="72" font-weight="500" letter-spacing="-2" fill="#F8FAFC">${escape(spec.title[0])}</text>
  <text x="96" y="384" font-family="Switzer,'Helvetica Neue',Arial,sans-serif" font-size="72" font-weight="500" letter-spacing="-2" fill="#94A3B8">${escape(spec.title[1])}</text>
  <text x="96" y="470" font-family="'IBM Plex Mono',ui-monospace,monospace" font-size="24" fill="#64748B">${escape(spec.meta)}</text>
</svg>
`
}

/**
 * The identity card, used wherever a page is not one entry — home, About, the
 * section indexes.
 *
 * Generated from `brand` rather than hand-drawn, because the hand-drawn one
 * still read `<nullKdev/>` and "Software artifacts, tools, and field notes"
 * months after the rename and the section restructure. A card nobody rebuilds
 * is a card that quietly keeps advertising the previous site.
 */
const renderIdentity =
  (): string => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" role="img" aria-label="${escape(brand.name)} — bilingual archive of software, tools and notes.">
  <defs>
    <linearGradient id="bg-identity" x1="0" y1="0" x2="${WIDTH}" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E1B4B"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg-identity)"/>
  <rect x="96" y="150" width="76" height="4" rx="2" fill="#818CF8"/>
  <text x="96" y="205" font-family="'IBM Plex Mono',ui-monospace,monospace" font-size="26" letter-spacing="4" fill="#818CF8">SOFTWARE DEVELOPER · LIMA, PERU</text>
  <text x="96" y="308" font-family="Switzer,'Helvetica Neue',Arial,sans-serif" font-size="84" font-weight="500" letter-spacing="-3" fill="#F8FAFC">Carlos Alarcon</text>
  <text x="96" y="382" font-family="Switzer,'Helvetica Neue',Arial,sans-serif" font-size="40" font-weight="400" fill="#94A3B8">Work · Lab · Notes · Gallery</text>
  <text x="96" y="470" font-family="'IBM Plex Mono',ui-monospace,monospace" font-size="24" fill="#64748B">${escape(brand.mark)} · EN / ES</text>
</svg>
`

if (import.meta.main) {
  await mkdir(SVG_DIRECTORY, { recursive: true })
  await mkdir(PNG_DIRECTORY, { recursive: true })

  for (const spec of banners) {
    const svg = renderBanner(spec)
    await writeFile(`${SVG_DIRECTORY}/${spec.slug}.svg`, svg)

    /* `density` matters: sharp rasterises SVG through librsvg at 72dpi by
       default, which would render a 1200-unit viewBox far smaller than 1200px
       and then upscale it into mush. */
    await sharp(Buffer.from(svg), { density: 144 })
      .resize(WIDTH, HEIGHT, { fit: 'fill' })
      .png({ compressionLevel: 9 })
      .toFile(`${PNG_DIRECTORY}/${spec.slug}.png`)
  }

  const identity = renderIdentity()
  await writeFile('public/og/signal-archive-source.svg', identity)
  await sharp(Buffer.from(identity), { density: 144 })
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toFile('public/og/signal-archive.png')

  console.log(
    `Generated ${banners.length} banners as SVG in ${SVG_DIRECTORY} ` +
      `and PNG in ${PNG_DIRECTORY}, plus the identity card.`,
  )
}
