/**
 * The one icon registry — and the only seam between this site and whoever
 * draws its icons.
 *
 * Marks are no longer drawn by hand. Two packs supply them, resolved at build
 * time and inlined into the HTML; neither package ships to the browser, which
 * is why both are devDependencies:
 *
 * - **Lucide** for interface marks. Same language the hand-drawn set was
 *   imitating: 24×24, no fill, `currentColor`, round caps and joins. Its stroke
 *   is 2; this site's is 1.7, so `render` normalises it.
 * - **Simple Icons** for brand logos, which are filled single paths with
 *   official geometry. Hand-approximating those is what produced a Google Play
 *   mark that read as an envelope and an AppGallery mark that was four squares.
 *
 * A filled logo beside a stroked interface mark is correct, not inconsistent:
 * a brand is a solid shape, an interface mark is a line.
 *
 * **Swapping packs means editing `registry` below and nothing else.** Call
 * sites name intent (`evidence`, `release`), never a vendor's icon id, so the
 * 44 usages across the site are insulated from this choice.
 *
 * Render with `<Icon name="…" />` (src/components/primitives/Icon.astro) rather
 * than calling `renderIcon` directly, unless you need the raw string for
 * `set:html` inside an existing element. Note `primitives/`, not `ui/` — that
 * folder belongs to shadcn and may be overwritten by its CLI.
 */

import { icons as lucide } from '@iconify-json/lucide'
import { icons as simpleIcons } from '@iconify-json/simple-icons'
import { getIconData, iconToSVG } from '@iconify/utils'
import type { IconifyJSON } from '@iconify/types'

const STROKE = 1.7

const sets: Record<string, IconifyJSON> = {
  lucide,
  'simple-icons': simpleIcons,
}

/**
 * Intent → pack icon. The key is what the mark *means* on this site; the value
 * is where the drawing currently comes from. Keep the keys stable.
 */
const registry = {
  // Navigation and structure
  home: 'lucide:house',
  chevronRight: 'lucide:chevron-right',
  arrowRight: 'lucide:arrow-right',
  arrowLeft: 'lucide:arrow-left',
  arrowUp: 'lucide:arrow-up',
  arrowDown: 'lucide:arrow-down-to-line',
  check: 'lucide:check',
  cross: 'lucide:x',
  minus: 'lucide:minus',
  plus: 'lucide:plus',
  fitWidth: 'lucide:scan',

  // Record apparatus — the blocks under an entry
  outcomes: 'lucide:target',
  conditions: 'lucide:sliders-horizontal',
  evidence: 'lucide:file-check',
  citations: 'lucide:book-open',
  links: 'lucide:link',
  list: 'lucide:list',
  shield: 'lucide:shield',

  archive: 'lucide:archive',
  search: 'lucide:search',
  feed: 'lucide:rss',

  // Note types — each one has to read as the thing it is at a glance, so no
  // two of these may share a drawing.
  article: 'lucide:newspaper',
  note: 'lucide:file-text',
  guide: 'lucide:list-ordered',
  paper: 'lucide:scroll-text',
  decision: 'lucide:signpost',
  reference: 'lucide:library',

  // Typed outbound links — one drawing shared by Work cards and entry records
  repository: 'lucide:code',
  release: 'lucide:tag',
  demo: 'lucide:circle-play',
  publication: 'lucide:book-open-text',
  external: 'lucide:external-link',
  mail: 'lucide:mail',

  // Brand logos
  github: 'simple-icons:github',
  linkedin: 'simple-icons:linkedin',
  playstore: 'simple-icons:googleplay',
  appgallery: 'simple-icons:appgallery',
  appstore: 'simple-icons:appstore',
  /* Stands for a build handed straight to the user as an APK, with no store
     in between — so the three distribution marks stay one visual family. */
  android: 'simple-icons:android',

  // Theme toggle
  sun: 'lucide:sun',
  moon: 'lucide:moon',

  /* Callout tones — consumed by src/components/mdx/Callout.astro, which used to
     carry its own private icon set at a fourth stroke width. Named after the
     mark, not the tone: `note` is already taken by the Notes entry kind, and
     one key must never mean two things. */
  pencil: 'lucide:pencil',
  info: 'lucide:info',
  circleCheck: 'lucide:circle-check',
  warning: 'lucide:triangle-alert',
} as const

export type IconName = keyof typeof registry

/* Every page renders the same handful of marks, so resolving each one once per
   build is worth a map. */
const cache = new Map<string, string>()

const render = (name: IconName, size: number): string => {
  const id = registry[name]
  const [setName, iconName] = id.split(':')
  const data = getIconData(sets[setName], iconName)
  if (!data) {
    throw new Error(
      `Icon "${name}" maps to "${id}", which the pack does not contain.`,
    )
  }
  const { body } = iconToSVG(data, { height: String(size) })
  /* Lucide bakes its own stroke width into the path. The site is drawn at 1.7,
     and that lighter line is part of the committed visual identity. */
  const normalised = body.replaceAll(
    'stroke-width="2"',
    `stroke-width="${STROKE}"`,
  )
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false">${normalised}</svg>`
}

export const renderIcon = (name: IconName, size = 20): string => {
  const key = `${name}:${size}`
  const hit = cache.get(key)
  if (hit) return hit
  const svg = render(name, size)
  cache.set(key, svg)
  return svg
}

export const iconNames = Object.keys(registry) as IconName[]
