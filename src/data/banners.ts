import type { Motif } from '../../scripts/banner-art'

/**
 * Every banner, declared rather than drawn.
 *
 * They were hand-authored SVGs, which meant each one was a separate chance to
 * get the safe area wrong, invent a fifth accent colour, or — as happened —
 * redraw the Android robot by hand when `simple-icons:android` was already in
 * the registry. A manifest plus one renderer makes the family consistent by
 * construction: change the template once and every banner follows.
 *
 * Artwork comes from the icon registry, so a banner can only use marks the
 * site already ships. That is a feature. If a banner needs a symbol the
 * registry lacks, the registry is the thing to extend.
 */
export interface BannerSpec {
  /** File stem in `public/banners/`, and the name posts reference. */
  readonly slug: string
  /** Small monospaced line above the title. Kept short; it is set in caps. */
  readonly kicker: string
  /** Two display lines. The second is set in a muted tone. */
  readonly title: readonly [string, string]
  /** Monospaced footnote — the specifics a reader can verify. */
  readonly meta: string
  /**
   * Composition drawn on the right half. A motif shows the SUBJECT — a page
   * parsed into structure, memory past a ceiling — because a lone icon reads
   * as a category badge and says nothing about the post.
   */
  readonly art: Motif
  /**
   * Accent stays identical in both themes — it is the banner's identity. Only
   * the ground changes: `deep` in dark, `pale` in light.
   */
  readonly accent: string
  readonly deep: string
  readonly pale: string
  /** Alt text. Describes the banner, not the article. */
  readonly alt: string
}

/* Four palettes, one per subject family, so a reader recognises the shape of a
   post before reading its title. Indigo is the site accent and stays with the
   archive's own subjects. */
const PALETTE = {
  ai: { accent: '#7C3AED', deep: '#2A1E3B', pale: '#EDE9FE' },
  android: { accent: '#059669', deep: '#0B2B22', pale: '#D1FAE5' },
  warning: { accent: '#DC2626', deep: '#3B1E1E', pale: '#FEE2E2' },
  web: { accent: '#2563EB', deep: '#12233F', pale: '#DBEAFE' },
  archive: { accent: '#4F46E5', deep: '#1E1B4B', pale: '#E0E7FF' },
} as const

export const banners: readonly BannerSpec[] = [
  {
    slug: 'chandra-ocr',
    kicker: 'OCR · Benchmarks',
    title: ['What an 85.9%', 'score leaves out'],
    meta: 'Chandra 2 · olmOCR · RealDocBench',
    art: 'document-parse',
    ...PALETTE.ai,
    alt: 'Chandra OCR banner — what an 85.9% score leaves out.',
  },
  {
    slug: 'android-17-stable',
    kicker: 'Android 17 · API 37',
    title: ['Stable, six', 'weeks in'],
    meta: 'Beta 3 → Beta 4 → 16 Jun 2026',
    art: 'release-train',
    ...PALETTE.android,
    alt: 'Android 17 stable banner — stable, six weeks in.',
  },
  {
    slug: 'android-17-memory-limits',
    kicker: 'Android 17 · Memory',
    title: ['Killed with no', 'stack trace'],
    meta: 'cgroup memory.high · MemoryLimiter:AnonSwap',
    art: 'memory-ceiling',
    ...PALETTE.warning,
    alt: 'Android 17 memory limits banner — killed with no stack trace.',
  },
  {
    slug: 'android-17-beta-3',
    kicker: 'Android 17 · Beta 3',
    title: ['Platform', 'stability'],
    meta: 'API 37 locked · 27 Mar 2026',
    art: 'api-locked',
    ...PALETTE.android,
    alt: 'Android 17 Beta 3 banner — platform stability reached.',
  },
  {
    slug: 'gof-patterns-android',
    kicker: 'Android · Architecture',
    title: ['Eight patterns,', 'four rules'],
    meta: 'Observer · Proxy · Adapter · Strategy',
    art: 'pattern-pairs',
    ...PALETTE.android,
    alt: 'Design patterns banner — eight patterns, four rules.',
  },
  {
    slug: 'pretext',
    kicker: 'Web · Layout',
    title: ['Measuring text', 'without reflow'],
    meta: 'Canvas oracle · 500× faster layout()',
    art: 'text-measure',
    ...PALETTE.web,
    alt: 'Pretext banner — measuring text without reflow.',
  },
  {
    slug: 'remote-compose',
    kicker: 'Android · Compose',
    title: ['UI that crosses', 'the process line'],
    meta: 'Remote Compose · remote-player-view',
    art: 'process-bridge',
    ...PALETTE.android,
    alt: 'Remote Compose banner — UI that crosses the process line.',
  },
  {
    slug: 'work',
    kicker: 'Archive · Work',
    title: ['Things that', 'shipped'],
    meta: 'Source · releases · downloadable artifacts',
    art: 'shipped-stack',
    ...PALETTE.archive,
    alt: 'Work banner — things that shipped.',
  },
]
