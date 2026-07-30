import type { Motif } from '../../scripts/banner-art'

export type BannerLocale = 'en' | 'es'

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
  /**
   * Copy, per locale. A banner sits above the article it belongs to, so an
   * English banner on a Spanish page is the same failure as an English heading
   * would be — the site is bilingual down to its artwork.
   */
  readonly copy: Record<
    BannerLocale,
    {
      /** Small monospaced line above the title. Set in caps. */
      readonly kicker: string
      /** Two display lines. The second is set in a muted tone. */
      readonly title: readonly [string, string]
      /** Monospaced footnote — specifics a reader can verify. */
      readonly meta: string
      /** Describes the banner, not the article. */
      readonly alt: string
    }
  >
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
}

/* Four palettes, one per subject family, so a reader recognises the shape of a
   post before reading its title. Indigo is the site accent and stays with the
   archive's own subjects.

   `pale` is the far corner of the light gradient and carries the family colour
   there. The 100-level tints it started with measured 1.13–1.23:1 against the
   white card — the tint was present in the file and invisible on screen. These
   sit at 1.28–1.49:1: still calm, but the corner is legibly emerald or red.

   Emerald moved from `#059669` because at that value the accent measured
   2.94:1 on its own light tint, under the 3:1 a graphic needs. `#00875A` clears
   3:1 on all four grounds — light ground, light tint, dark ground, dark deep —
   which is what keeping one accent across both themes actually requires. */
const PALETTE = {
  ai: { accent: '#7C3AED', deep: '#2A1E3B', pale: '#DDD6FE' },
  android: { accent: '#00875A', deep: '#0B2B22', pale: '#A7F3D0' },
  warning: { accent: '#DC2626', deep: '#3B1E1E', pale: '#FECACA' },
  web: { accent: '#2563EB', deep: '#12233F', pale: '#BFDBFE' },
  archive: { accent: '#4F46E5', deep: '#1E1B4B', pale: '#C7D2FE' },
} as const

export const banners: readonly BannerSpec[] = [
  {
    slug: 'chandra-ocr',
    copy: {
      en: {
        kicker: 'OCR · Benchmarks',
        title: ['What an 85.9%', 'score leaves out'],
        meta: 'Chandra 2 · olmOCR · RealDocBench',
        alt: 'Chandra OCR banner — what an 85.9% score leaves out.',
      },
      es: {
        kicker: 'OCR · Benchmarks',
        title: ['Lo que un 85.9%', 'deja afuera'],
        meta: 'Chandra 2 · olmOCR · RealDocBench',
        alt: 'Banner de Chandra OCR — lo que un puntaje de 85.9% deja afuera.',
      },
    },
    art: 'document-parse',
    ...PALETTE.ai,
  },
  {
    slug: 'android-17-stable',
    copy: {
      en: {
        kicker: 'Android 17 · API 37',
        title: ['Stable, six', 'weeks in'],
        meta: 'Beta 3 → Beta 4 → 16 Jun 2026',
        alt: 'Android 17 stable banner — stable, six weeks in.',
      },
      es: {
        kicker: 'Android 17 · API 37',
        title: ['Estable, seis', 'semanas después'],
        meta: 'Beta 3 → Beta 4 → 16 jun 2026',
        alt: 'Banner de Android 17 estable — estable, seis semanas después.',
      },
    },
    art: 'release-train',
    ...PALETTE.android,
  },
  {
    slug: 'android-17-memory-limits',
    copy: {
      en: {
        kicker: 'Android 17 · Memory',
        title: ['Killed with no', 'stack trace'],
        meta: 'cgroup memory.high · MemoryLimiter:AnonSwap',
        alt: 'Android 17 memory limits banner — killed with no stack trace.',
      },
      es: {
        kicker: 'Android 17 · Memoria',
        title: ['Muerto sin', 'stack trace'],
        meta: 'cgroup memory.high · MemoryLimiter:AnonSwap',
        alt: 'Banner de límites de memoria en Android 17 — muerto sin stack trace.',
      },
    },
    art: 'memory-ceiling',
    ...PALETTE.warning,
  },
  {
    slug: 'android-17-beta-3',
    copy: {
      en: {
        kicker: 'Android 17 · Beta 3',
        title: ['Platform', 'stability'],
        meta: 'API 37 locked · 27 Mar 2026',
        alt: 'Android 17 Beta 3 banner — platform stability reached.',
      },
      es: {
        kicker: 'Android 17 · Beta 3',
        title: ['Estabilidad de', 'plataforma'],
        meta: 'API 37 bloqueada · 27 mar 2026',
        alt: 'Banner de Android 17 Beta 3 — estabilidad de plataforma alcanzada.',
      },
    },
    art: 'api-locked',
    ...PALETTE.android,
  },
  {
    slug: 'gof-patterns-android',
    copy: {
      en: {
        kicker: 'Android · Architecture',
        title: ['Eight patterns,', 'four rules'],
        meta: 'Observer · Proxy · Adapter · Strategy',
        alt: 'Design patterns banner — eight patterns, four rules.',
      },
      es: {
        kicker: 'Android · Arquitectura',
        title: ['Ocho patrones,', 'cuatro reglas'],
        meta: 'Observer · Proxy · Adapter · Strategy',
        alt: 'Banner de patrones de diseño — ocho patrones, cuatro reglas.',
      },
    },
    art: 'pattern-pairs',
    ...PALETTE.android,
  },
  {
    slug: 'pretext',
    copy: {
      en: {
        kicker: 'Web · Layout',
        title: ['Measuring text', 'without reflow'],
        meta: 'Canvas oracle · 500× faster layout()',
        alt: 'Pretext banner — measuring text without reflow.',
      },
      es: {
        kicker: 'Web · Maquetado',
        title: ['Medir texto', 'sin reflow'],
        meta: 'Oráculo Canvas · layout() 500× más rápido',
        alt: 'Banner de Pretext — medir texto sin reflow.',
      },
    },
    art: 'text-measure',
    ...PALETTE.web,
  },
  {
    slug: 'remote-compose',
    copy: {
      en: {
        kicker: 'Android · Compose',
        title: ['UI that crosses', 'the process line'],
        meta: 'Remote Compose · remote-player-view',
        alt: 'Remote Compose banner — UI that crosses the process line.',
      },
      es: {
        kicker: 'Android · Compose',
        title: ['UI que cruza', 'el límite de proceso'],
        meta: 'Remote Compose · remote-player-view',
        alt: 'Banner de Remote Compose — UI que cruza el límite de proceso.',
      },
    },
    art: 'process-bridge',
    ...PALETTE.android,
  },
  {
    slug: 'work',
    copy: {
      en: {
        kicker: 'Archive · Work',
        title: ['Things that', 'shipped'],
        meta: 'Source · releases · downloadable artifacts',
        alt: 'Work banner — things that shipped.',
      },
      es: {
        kicker: 'Archivo · Trabajo',
        title: ['Cosas que', 'se publicaron'],
        meta: 'Código · releases · artefactos descargables',
        alt: 'Banner de Trabajo — cosas que se publicaron.',
      },
    },
    art: 'shipped-stack',
    ...PALETTE.archive,
  },
]
