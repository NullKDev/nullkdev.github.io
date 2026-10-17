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
    slug: 'android-4-4-kitkat',
    copy: {
      en: {
        kicker: 'Android 4.4 · API 19',
        title: ['Android', 'in 512 MB'],
        meta: 'KitKat · Oct 2013 · Project Svelte',
        alt: 'Android 4.4 KitKat banner — Android slimmed down to fit 512 MB of RAM.',
      },
      es: {
        kicker: 'Android 4.4 · API 19',
        title: ['Android', 'en 512 MB'],
        meta: 'KitKat · oct. 2013 · Project Svelte',
        alt: 'Banner de Android 4.4 KitKat — Android aligerado para caber en 512 MB de RAM.',
      },
    },
    art: 'memory-ceiling',
    ...PALETTE.android,
  },
  {
    slug: 'android-5-0-lollipop',
    copy: {
      en: {
        kicker: 'Android 5.0 · API 21',
        title: ['ART replaces', 'Dalvik'],
        meta: 'Lollipop · Nov 2014 · ART + Material Design',
        alt: 'Android 5.0 Lollipop banner — ART replaces Dalvik.',
      },
      es: {
        kicker: 'Android 5.0 · API 21',
        title: ['ART reemplaza', 'a Dalvik'],
        meta: 'Lollipop · nov 2014 · ART + Material Design',
        alt: 'Banner de Android 5.0 Lollipop — ART reemplaza a Dalvik.',
      },
    },
    art: 'process-bridge',
    ...PALETTE.android,
  },
  {
    slug: 'android-5-1-lollipop',
    copy: {
      en: {
        kicker: 'Android 5.1 · API 22',
        title: ['Two SIMs,', 'one locked reset'],
        meta: 'Lollipop · March 2015 · Device Protection',
        alt: 'Android 5.1 Lollipop banner — multiple SIM cards and a lock that survives a factory reset.',
      },
      es: {
        kicker: 'Android 5.1 · API 22',
        title: ['Dos SIM,', 'reset bloqueado'],
        meta: 'Lollipop · marzo de 2015 · Device Protection',
        alt: 'Banner de Android 5.1 Lollipop — varias tarjetas SIM y un bloqueo que sobrevive al restablecimiento de fábrica.',
      },
    },
    art: 'api-locked',
    ...PALETTE.android,
  },
  {
    slug: 'android-6-marshmallow',
    copy: {
      en: {
        kicker: 'Android 6.0 · API 23',
        title: ['Permissions,', 'asked at runtime'],
        meta: 'Marshmallow · 5 Oct 2015 · Doze',
        alt: 'Android 6.0 Marshmallow banner — permissions asked at runtime.',
      },
      es: {
        kicker: 'Android 6.0 · API 23',
        title: ['Permisos pedidos', 'en ejecución'],
        meta: 'Marshmallow · 5 oct 2015 · Doze',
        alt: 'Banner de Android 6.0 Marshmallow — permisos pedidos en ejecución.',
      },
    },
    art: 'api-locked',
    ...PALETTE.android,
  },
  {
    slug: 'android-7-0-nougat',
    copy: {
      en: {
        kicker: 'Android 7.0 · API 24',
        title: ['Two apps,', 'one screen'],
        meta: 'Nougat · Aug 2016 · Multi-window',
        alt: 'Android 7.0 Nougat banner — two apps sharing one screen.',
      },
      es: {
        kicker: 'Android 7.0 · API 24',
        title: ['Dos apps,', 'una pantalla'],
        meta: 'Nougat · ago 2016 · Multiventana',
        alt: 'Banner de Android 7.0 Nougat — dos apps que comparten una pantalla.',
      },
    },
    art: 'process-bridge',
    ...PALETTE.android,
  },
  {
    slug: 'android-7-1-nougat',
    copy: {
      en: {
        kicker: 'Android 7.1 · API 25',
        title: ['App shortcuts', 'and the Pixel'],
        meta: 'Nougat · October 2016 · app shortcuts',
        alt: 'Android 7.1 Nougat banner — app shortcuts from the launcher icon.',
      },
      es: {
        kicker: 'Android 7.1 · API 25',
        title: ['Accesos directos', 'y el Pixel'],
        meta: 'Nougat · octubre de 2016 · accesos directos',
        alt: 'Banner de Android 7.1 Nougat — accesos directos desde el icono del launcher.',
      },
    },
    art: 'release-train',
    ...PALETTE.android,
  },
  {
    slug: 'android-8-0-oreo',
    copy: {
      en: {
        kicker: 'Android 8.0 · API 26',
        title: ['Background work', 'on a leash'],
        meta: 'Oreo · Aug 2017 · background limits',
        alt: 'Android 8.0 Oreo banner — background work under new limits.',
      },
      es: {
        kicker: 'Android 8.0 · API 26',
        title: ['Segundo plano', 'con correa'],
        meta: 'Oreo · ago 2017 · límites en segundo plano',
        alt: 'Banner de Android 8.0 Oreo — el trabajo en segundo plano bajo nuevos límites.',
      },
    },
    art: 'memory-ceiling',
    ...PALETTE.android,
  },
  {
    slug: 'android-8-1-oreo',
    copy: {
      en: {
        kicker: 'Android 8.1 · API 27',
        title: ['Android Go', 'for 1 GB phones'],
        meta: 'Oreo · Dec 2017 · Go edition, Neural Networks API',
        alt: 'Android 8.1 Oreo banner — Android Go for low-RAM phones.',
      },
      es: {
        kicker: 'Android 8.1 · API 27',
        title: ['Android Go', 'para 1 GB de RAM'],
        meta: 'Oreo · dic 2017 · edición Go, Neural Networks API',
        alt: 'Banner de Android 8.1 Oreo — Android Go para teléfonos con poca RAM.',
      },
    },
    art: 'memory-ceiling',
    ...PALETTE.android,
  },
  {
    slug: 'android-9-pie',
    copy: {
      en: {
        kicker: 'Android 9 · API 28',
        title: ['Idle apps lose', 'camera and mic'],
        meta: 'Pie · Aug 2018 · TLS by default',
        alt: 'Android 9 Pie banner — idle apps cut off from the camera, microphone and sensors.',
      },
      es: {
        kicker: 'Android 9 · API 28',
        title: ['Sin cámara ni', 'micro en reposo'],
        meta: 'Pie · ago 2018 · TLS por defecto',
        alt: 'Banner de Android 9 Pie — apps inactivas sin acceso a cámara, micrófono ni sensores.',
      },
    },
    art: 'api-locked',
    ...PALETTE.android,
  },
  {
    slug: 'android-10',
    copy: {
      en: {
        kicker: 'Android 10 · API 29',
        title: ['Scoped storage,', 'no dessert'],
        meta: 'Quince Tart · Sep 2019 · scoped storage',
        alt: 'Android 10 banner — storage scoped to each app.',
      },
      es: {
        kicker: 'Android 10 · API 29',
        title: ['Almacenamiento', 'acotado'],
        meta: 'Quince Tart · sep 2019 · almacenamiento acotado',
        alt: 'Banner de Android 10 — almacenamiento acotado a cada app.',
      },
    },
    art: 'api-locked',
    ...PALETTE.android,
  },
  {
    slug: 'android-11',
    copy: {
      en: {
        kicker: 'Android 11 · API 30',
        title: ['Permission for', 'one session'],
        meta: 'Red Velvet Cake · Sep 2020 · one-time grants',
        alt: 'Android 11 banner — a permission granted for one session only.',
      },
      es: {
        kicker: 'Android 11 · API 30',
        title: ['Permiso por', 'una sesión'],
        meta: 'Red Velvet Cake · sep 2020 · permisos de una vez',
        alt: 'Banner de Android 11 — un permiso otorgado solo por una sesión.',
      },
    },
    art: 'api-locked',
    ...PALETTE.android,
  },
  {
    slug: 'android-12',
    copy: {
      en: {
        kicker: 'Android 12 · API 31',
        title: ['Material You,', 'locked exports'],
        meta: 'Snow Cone · Oct 2021 · Privacy dashboard',
        alt: 'Android 12 banner — wallpaper-driven color, a privacy dashboard and mandatory exported flags.',
      },
      es: {
        kicker: 'Android 12 · API 31',
        title: ['Material You,', 'exports cerrados'],
        meta: 'Snow Cone · oct. 2021 · Panel de privacidad',
        alt: 'Banner de Android 12 — color tomado del fondo, panel de privacidad y exported obligatorio.',
      },
    },
    art: 'api-locked',
    ...PALETTE.android,
  },
  {
    slug: 'android-12l',
    copy: {
      en: {
        kicker: 'Android 12L · API 32',
        title: ['Built for', 'large screens'],
        meta: '12L · Mar 2022 · Taskbar and split screen',
        alt: 'Android 12L banner — a taskbar and split screen for tablets and foldables.',
      },
      es: {
        kicker: 'Android 12L · API 32',
        title: ['Hecho para', 'pantallas grandes'],
        meta: '12L · mar 2022 · Barra de tareas y pantalla dividida',
        alt: 'Banner de Android 12L — barra de tareas y pantalla dividida para tablets y plegables.',
      },
    },
    art: 'process-bridge',
    ...PALETTE.android,
  },
  {
    slug: 'android-13',
    copy: {
      en: {
        kicker: 'Android 13 · API 33',
        title: ['Ask before you', 'notify'],
        meta: 'Tiramisu · Aug 2022 · POST_NOTIFICATIONS',
        alt: 'Android 13 banner — the notification permission and granular media access.',
      },
      es: {
        kicker: 'Android 13 · API 33',
        title: ['Pide permiso', 'para notificar'],
        meta: 'Tiramisu · ago 2022 · POST_NOTIFICATIONS',
        alt: 'Banner de Android 13 — el permiso de notificaciones y el acceso granular a medios.',
      },
    },
    art: 'api-locked',
    ...PALETTE.android,
  },
  {
    slug: 'android-14',
    copy: {
      en: {
        kicker: 'Android 14 · API 34',
        title: ['Every service', 'states its type'],
        meta: 'Upside Down Cake · Oct 2023 · foreground service types',
        alt: 'Android 14 banner — typed foreground services and selected photo access.',
      },
      es: {
        kicker: 'Android 14 · API 34',
        title: ['Cada servicio', 'declara su tipo'],
        meta: 'Upside Down Cake · oct 2023 · tipos de servicio',
        alt: 'Banner de Android 14 — servicios en primer plano con tipo y acceso a fotos elegidas.',
      },
    },
    art: 'api-locked',
    ...PALETTE.android,
  },
  {
    slug: 'android-15',
    copy: {
      en: {
        kicker: 'Android 15 · API 35',
        title: ['Edge to edge,', 'by default'],
        meta: 'Vanilla Ice Cream · October 2024 · Private space',
        alt: 'Android 15 banner — enforced edge-to-edge and the private space.',
      },
      es: {
        kicker: 'Android 15 · API 35',
        title: ['Edge-to-edge,', 'por defecto'],
        meta: 'Vanilla Ice Cream · octubre 2024 · Espacio privado',
        alt: 'Banner de Android 15 — edge-to-edge obligatorio y el espacio privado.',
      },
    },
    art: 'api-locked',
    ...PALETTE.android,
  },
  {
    slug: 'android-16',
    copy: {
      en: {
        kicker: 'Android 16 · API 36',
        title: ['Adaptive by', 'default'],
        meta: 'Baklava · June 2025 · large screens',
        alt: 'Android 16 banner — adaptive layouts on large screens and the first minor SDK release.',
      },
      es: {
        kicker: 'Android 16 · API 36',
        title: ['Adaptable por', 'defecto'],
        meta: 'Baklava · junio de 2025 · pantallas grandes',
        alt: 'Banner de Android 16 — diseños adaptables en pantallas grandes y la primera versión menor del SDK.',
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
