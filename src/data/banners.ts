import type { IconName } from '../lib/icons'
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
   * The subject's own mark, drawn where the motif would be. For a version of
   * a platform the logo is the subject — "Android 6.0" next to a generic
   * shield said less than the marshmallow the release is known by. Either a
   * repo path to a licensed SVG (credited in the note that uses it) or a
   * registry icon when no licensed file exists. With a logo, the first title
   * line becomes the headline and the second its subtext.
   */
  readonly logo?: string | { readonly icon: IconName }
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
    slug: 'model-hardware-standard',
    copy: {
      en: {
        kicker: 'MHS · Research preview',
        title: ['One driver', 'surface, not MCP'],
        meta: '27 Aug 2026 · read/write · model-agnostic',
        alt: 'Model Hardware Standard banner — one driver surface, not MCP.',
      },
      es: {
        kicker: 'MHS · Research preview',
        title: ['Una superficie', 'de driver, no MCP'],
        meta: '27 ago 2026 · read/write · model-agnostic',
        alt: 'Banner del Model Hardware Standard — una superficie de driver, no MCP.',
      },
    },
    art: 'standard-bus',
    ...PALETTE.ai,
  },
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
    slug: 'android-versions',
    copy: {
      en: {
        kicker: 'API 19–37 · 2013–2026',
        title: ['Android', 'Version by version'],
        meta: '18 versions · KitKat to Cinnamon Bun',
        alt: 'Android, version by version banner, with the Android robot.',
      },
      es: {
        kicker: 'API 19–37 · 2013–2026',
        title: ['Android', 'Versión por versión'],
        meta: '18 versiones · de KitKat a Cinnamon Bun',
        alt: 'Banner de Android, versión por versión, con el robot de Android.',
      },
    },
    art: 'release-train',
    logo: { icon: 'android' },
    ...PALETTE.android,
  },
  {
    slug: 'android-4-4-kitkat',
    copy: {
      en: {
        kicker: 'API 19 · Oct 2013',
        title: ['Android 4.4', 'KitKat'],
        meta: 'Project Svelte · 512 MB',
        alt: 'Android 4.4 KitKat banner, with the version logo.',
      },
      es: {
        kicker: 'API 19 · oct 2013',
        title: ['Android 4.4', 'KitKat'],
        meta: 'Project Svelte · 512 MB',
        alt: 'Banner de Android 4.4 KitKat, con el logo de la versión.',
      },
    },
    art: 'memory-ceiling',
    logo: 'src/content/notes/android-4-4-kitkat/assets/android-kitkat-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-5-0-lollipop',
    copy: {
      en: {
        kicker: 'API 21 · Nov 2014',
        title: ['Android 5.0', 'Lollipop'],
        meta: 'ART · Material Design',
        alt: 'Android 5.0 Lollipop banner, with the version logo.',
      },
      es: {
        kicker: 'API 21 · nov 2014',
        title: ['Android 5.0', 'Lollipop'],
        meta: 'ART · Material Design',
        alt: 'Banner de Android 5.0 Lollipop, con el logo de la versión.',
      },
    },
    art: 'process-bridge',
    logo: 'src/content/notes/android-5-0-lollipop/assets/android-lollipop-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-5-1-lollipop',
    copy: {
      en: {
        kicker: 'API 22 · Mar 2015',
        title: ['Android 5.1', 'Lollipop'],
        meta: 'Multi-SIM · Device Protection',
        alt: 'Android 5.1 Lollipop banner, with the version logo.',
      },
      es: {
        kicker: 'API 22 · mar 2015',
        title: ['Android 5.1', 'Lollipop'],
        meta: 'Varias SIM · Device Protection',
        alt: 'Banner de Android 5.1 Lollipop, con el logo de la versión.',
      },
    },
    art: 'api-locked',
    logo: 'src/content/notes/android-5-1-lollipop/assets/android-lollipop-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-6-marshmallow',
    copy: {
      en: {
        kicker: 'API 23 · Oct 2015',
        title: ['Android 6.0', 'Marshmallow'],
        meta: 'Runtime permissions · Doze',
        alt: 'Android 6.0 Marshmallow banner, with the version logo.',
      },
      es: {
        kicker: 'API 23 · oct 2015',
        title: ['Android 6.0', 'Marshmallow'],
        meta: 'Permisos en ejecución · Doze',
        alt: 'Banner de Android 6.0 Marshmallow, con el logo de la versión.',
      },
    },
    art: 'api-locked',
    logo: 'src/content/notes/android-6-marshmallow/assets/android-marshmallow-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-7-0-nougat',
    copy: {
      en: {
        kicker: 'API 24 · Aug 2016',
        title: ['Android 7.0', 'Nougat'],
        meta: 'Multi-window · FileProvider',
        alt: 'Android 7.0 Nougat banner, with the version logo.',
      },
      es: {
        kicker: 'API 24 · ago 2016',
        title: ['Android 7.0', 'Nougat'],
        meta: 'Multiventana · FileProvider',
        alt: 'Banner de Android 7.0 Nougat, con el logo de la versión.',
      },
    },
    art: 'process-bridge',
    logo: 'src/content/notes/android-7-0-nougat/assets/android-nougat-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-7-1-nougat',
    copy: {
      en: {
        kicker: 'API 25 · Oct 2016',
        title: ['Android 7.1', 'Nougat'],
        meta: 'App shortcuts · Pixel',
        alt: 'Android 7.1 Nougat banner, with the version logo.',
      },
      es: {
        kicker: 'API 25 · oct 2016',
        title: ['Android 7.1', 'Nougat'],
        meta: 'Accesos directos · Pixel',
        alt: 'Banner de Android 7.1 Nougat, con el logo de la versión.',
      },
    },
    art: 'release-train',
    logo: 'src/content/notes/android-7-1-nougat/assets/android-nougat-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-8-0-oreo',
    copy: {
      en: {
        kicker: 'API 26 · Aug 2017',
        title: ['Android 8.0', 'Oreo'],
        meta: 'Background limits · Treble',
        alt: 'Android 8.0 Oreo banner, with the version logo.',
      },
      es: {
        kicker: 'API 26 · ago 2017',
        title: ['Android 8.0', 'Oreo'],
        meta: 'Límites en segundo plano · Treble',
        alt: 'Banner de Android 8.0 Oreo, con el logo de la versión.',
      },
    },
    art: 'memory-ceiling',
    logo: 'src/content/notes/android-8-0-oreo/assets/android-oreo-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-8-1-oreo',
    copy: {
      en: {
        kicker: 'API 27 · Dec 2017',
        title: ['Android 8.1', 'Oreo'],
        meta: 'Go edition · Neural Networks API',
        alt: 'Android 8.1 Oreo banner, with the version logo.',
      },
      es: {
        kicker: 'API 27 · dic 2017',
        title: ['Android 8.1', 'Oreo'],
        meta: 'Edición Go · Neural Networks API',
        alt: 'Banner de Android 8.1 Oreo, con el logo de la versión.',
      },
    },
    art: 'memory-ceiling',
    logo: 'src/content/notes/android-8-1-oreo/assets/android-oreo-8-1-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-9-pie',
    copy: {
      en: {
        kicker: 'API 28 · Aug 2018',
        title: ['Android 9', 'Pie'],
        meta: 'Idle apps lose camera and mic',
        alt: 'Android 9 Pie banner, with the version logo.',
      },
      es: {
        kicker: 'API 28 · ago 2018',
        title: ['Android 9', 'Pie'],
        meta: 'Sin cámara ni micro en reposo',
        alt: 'Banner de Android 9 Pie, con el logo de la versión.',
      },
    },
    art: 'api-locked',
    logo: 'src/content/notes/android-9-pie/assets/android-pie-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-10',
    copy: {
      en: {
        kicker: 'API 29 · Sep 2019',
        title: ['Android 10', 'Quince Tart'],
        meta: 'Internal name · scoped storage',
        alt: 'Android 10 Quince Tart banner, with the version logo.',
      },
      es: {
        kicker: 'API 29 · sep 2019',
        title: ['Android 10', 'Quince Tart'],
        meta: 'Nombre interno · almacenamiento acotado',
        alt: 'Banner de Android 10 Quince Tart, con el logo de la versión.',
      },
    },
    art: 'api-locked',
    logo: 'src/content/notes/android-10/assets/android-10-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-11',
    copy: {
      en: {
        kicker: 'API 30 · Sep 2020',
        title: ['Android 11', 'Red Velvet Cake'],
        meta: 'Internal name · one-time grants',
        alt: 'Android 11 Red Velvet Cake banner, with the version logo.',
      },
      es: {
        kicker: 'API 30 · sep 2020',
        title: ['Android 11', 'Red Velvet Cake'],
        meta: 'Nombre interno · permisos de una vez',
        alt: 'Banner de Android 11 Red Velvet Cake, con el logo de la versión.',
      },
    },
    art: 'api-locked',
    logo: 'src/content/notes/android-11/assets/android-11-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-12',
    copy: {
      en: {
        kicker: 'API 31 · Oct 2021',
        title: ['Android 12', 'Snow Cone'],
        meta: 'Internal name · Material You',
        alt: 'Android 12 Snow Cone banner, with the version logo.',
      },
      es: {
        kicker: 'API 31 · oct 2021',
        title: ['Android 12', 'Snow Cone'],
        meta: 'Nombre interno · Material You',
        alt: 'Banner de Android 12 Snow Cone, con el logo de la versión.',
      },
    },
    art: 'api-locked',
    logo: 'src/content/notes/android-12/assets/android-12-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-12l',
    copy: {
      en: {
        kicker: 'API 32 · Mar 2022',
        title: ['Android 12L', 'Large screens'],
        meta: 'S_V2 · tablets and foldables',
        alt: 'Android 12L banner, with the Android robot.',
      },
      es: {
        kicker: 'API 32 · mar 2022',
        title: ['Android 12L', 'Pantallas grandes'],
        meta: 'S_V2 · tablets y plegables',
        alt: 'Banner de Android 12L, con el robot de Android.',
      },
    },
    art: 'process-bridge',
    logo: { icon: 'android' },
    ...PALETTE.android,
  },
  {
    slug: 'android-13',
    copy: {
      en: {
        kicker: 'API 33 · Aug 2022',
        title: ['Android 13', 'Tiramisu'],
        meta: 'TIRAMISU · notification permission',
        alt: 'Android 13 Tiramisu banner, with the version logo.',
      },
      es: {
        kicker: 'API 33 · ago 2022',
        title: ['Android 13', 'Tiramisu'],
        meta: 'TIRAMISU · permiso de notificaciones',
        alt: 'Banner de Android 13 Tiramisu, con el logo de la versión.',
      },
    },
    art: 'api-locked',
    logo: 'src/content/notes/android-13/assets/android-13-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-14',
    copy: {
      en: {
        kicker: 'API 34 · Oct 2023',
        title: ['Android 14', 'Upside Down Cake'],
        meta: 'UPSIDE_DOWN_CAKE · typed services',
        alt: 'Android 14 Upside Down Cake banner, with the version logo.',
      },
      es: {
        kicker: 'API 34 · oct 2023',
        title: ['Android 14', 'Upside Down Cake'],
        meta: 'UPSIDE_DOWN_CAKE · servicios con tipo',
        alt: 'Banner de Android 14 Upside Down Cake, con el logo de la versión.',
      },
    },
    art: 'api-locked',
    logo: 'src/content/notes/android-14/assets/android-14-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-15',
    copy: {
      en: {
        kicker: 'API 35 · Oct 2024',
        title: ['Android 15', 'Vanilla Ice Cream'],
        meta: 'VANILLA_ICE_CREAM · edge-to-edge',
        alt: 'Android 15 Vanilla Ice Cream banner, with the version logo.',
      },
      es: {
        kicker: 'API 35 · oct 2024',
        title: ['Android 15', 'Vanilla Ice Cream'],
        meta: 'VANILLA_ICE_CREAM · edge-to-edge',
        alt: 'Banner de Android 15 Vanilla Ice Cream, con el logo de la versión.',
      },
    },
    art: 'api-locked',
    logo: 'src/content/notes/android-15/assets/android-15-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-16',
    copy: {
      en: {
        kicker: 'API 36 · Jun 2025',
        title: ['Android 16', 'Baklava'],
        meta: 'BAKLAVA · adaptive by default',
        alt: 'Android 16 Baklava banner, with the version logo.',
      },
      es: {
        kicker: 'API 36 · jun 2025',
        title: ['Android 16', 'Baklava'],
        meta: 'BAKLAVA · adaptable por defecto',
        alt: 'Banner de Android 16 Baklava, con el logo de la versión.',
      },
    },
    art: 'api-locked',
    logo: 'src/content/notes/android-16/assets/android-16-logo.svg',
    ...PALETTE.android,
  },
  {
    slug: 'android-17',
    copy: {
      en: {
        kicker: 'API 37 · Jun 2026',
        title: ['Android 17', 'Cinnamon Bun'],
        meta: 'CINNAMON_BUN · memory limits',
        alt: 'Android 17 Cinnamon Bun banner, with the Android robot.',
      },
      es: {
        kicker: 'API 37 · jun 2026',
        title: ['Android 17', 'Cinnamon Bun'],
        meta: 'CINNAMON_BUN · límites de memoria',
        alt: 'Banner de Android 17 Cinnamon Bun, con el robot de Android.',
      },
    },
    art: 'memory-ceiling',
    logo: { icon: 'android' },
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
  {
    slug: 'codex-security',
    copy: {
      en: {
        kicker: 'AppSec · Benchmarks',
        title: ['The number they', 'did not publish'],
        meta: '92% recall · precision unreported',
        alt: 'Codex Security banner — the number they did not publish.',
      },
      es: {
        kicker: 'AppSec · Benchmarks',
        title: ['El número que', 'no publicaron'],
        meta: '92% de recall · precisión sin reportar',
        alt: 'Banner de Codex Security — el número que no publicaron.',
      },
    },
    art: 'unmeasured-half',
    ...PALETTE.warning,
  },
]
