import type { Locale } from '@/i18n'
import type { IconName } from '@/lib/icons'

/* The icon travels with the link rather than being guessed at the call site, so
   the header, the footer and the About page cannot drift apart. Names are
   registry keys from `src/lib/icons.ts`. */
const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/nullkdev',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jcarlos-dev/',
    icon: 'linkedin',
  },
  {
    label: 'Email',
    href: 'mailto:carlos.alarcon.dev@gmail.com',
    icon: 'mail',
  },
] as const satisfies readonly {
  label: string
  href: string
  icon: IconName
}[]

/* The one date the practice length is measured from. Every "years of
   experience" figure on the site derives from this at build time, so it can
   never drift out of date or be inflated by hand. */
export const careerStart = '2018-06'

export interface Position {
  readonly org: string
  readonly orgUrl?: string
  readonly role: string
  readonly start: string
  readonly end: string | null
  readonly mode: string
  readonly place: string
  readonly summary: string
  readonly highlights: readonly string[]
  readonly products?: readonly Product[]
}

/**
 * Where a build actually reaches its users. `direct` means it never went
 * through a store at all — the APK is handed over. A channel without an `href`
 * still states the fact; it just has no public listing to point at.
 */
export type ChannelKind = 'playstore' | 'appgallery' | 'appstore' | 'direct'

export interface Product {
  readonly name: string
  readonly channels: readonly {
    readonly kind: ChannelKind
    readonly href?: string
  }[]
}

export interface Facet {
  readonly label: string
  readonly body: string
}

export interface CapabilityGroup {
  readonly label: string
  readonly body: string
  readonly items: readonly string[]
}

export interface Credential {
  readonly title: string
  readonly issuer: string
  readonly year: string
}

export const about = {
  en: {
    locale: 'en',
    translationKey: 'about',
    name: 'Carlos Alarcon',
    role: 'Digital product developer, focused on mobile',
    location: 'Lima, Peru · GMT-5',
    avatar: '/avatar.png',
    avatarAlt:
      'Illustrated avatar: a laptop on a desk beside a plant, with a small block-stacking game on screen.',
    bio: {
      thesis: 'How should this be made?',
      note: 'The same question at every layer: the architecture holding an app up, the screen someone taps one-handed while standing in an aisle, the model deciding what to show them. I write down what I learn answering it — mostly the things I wish I had found already written.',
    },
    facets: [
      {
        label: 'What I build',
        body: 'Digital product, mostly on mobile. Apps, libraries and tools other people use to do their job.',
      },
      {
        label: 'How I work',
        body: 'The full product lifecycle rather than an isolated ticket, with how the thing feels to use treated as part of the work. Agile in practice more than in ceremony.',
      },
      {
        label: 'What I reach for',
        body: 'Kotlin and TypeScript day to day. Clean Architecture with MVI, MVVM or MVP, depending on what the problem asks for.',
      },
    ] as readonly Facet[],
    now: {
      updatedAt: '2026-07-25',
      items: [
        'Redesigning the LiveTrade Android application at Overall Strategy.',
        'Keeping the released version maintained while that redesign runs.',
        'Learning iOS and Python.',
        'Building this archive, and writing down what it teaches me.',
      ],
    },
    links: socials,
    positions: [
      {
        org: 'Overall Strategy S.A.C.',
        orgUrl: 'https://www.overall.pe/',
        role: 'Mobile Developer',
        start: '2023-10',
        end: null,
        mode: 'Remote',
        place: 'Peru',
        summary:
          'Overall runs process outsourcing, industrial and trade services across more than thirty cities in Peru. LiveTrade is what the brands it serves run their field teams on: one application for the promoter at the point of sale, the supervisor on the route and the analyst at a desk, where the signal does not reach and every one of them carries a different phone. A great many users, and not all of them in Peru.',
        highlights: [
          'Redesigning the LiveTrade Android application.',
          'Maintaining the released Android version alongside that work.',
          'Working on point-of-sale capture, GPS attendance and the real-time reporting the operation depends on.',
        ],
        products: [
          {
            name: 'LiveTrade',
            channels: [
              {
                kind: 'playstore',
                href: 'https://play.google.com/store/apps/details?id=pe.overall.livetrade',
              },
              {
                kind: 'appgallery',
                href: 'https://appgallery.huawei.com/app/C103933455',
              },
              {
                kind: 'appstore',
                href: 'https://apps.apple.com/us/app/livetrade-overall/id6473452653',
              },
            ],
          },
          {
            name: 'Livetrade Impulso',
            channels: [
              {
                kind: 'playstore',
                href: 'https://play.google.com/store/apps/details?id=pe.overall.livetrade.lite',
              },
              {
                kind: 'appgallery',
                href: 'https://appgallery.huawei.com/app/C110387883',
              },
            ],
          },
          {
            name: 'LiveTrade (redesign)',
            channels: [
              {
                kind: 'playstore',
                href: 'https://play.google.com/store/apps/details?id=pe.overall.livetrade2',
              },
            ],
          },
        ],
      },
      {
        org: 'Agrosmart S.A.C.',
        orgUrl: 'https://www.agromas.pe',
        role: 'Mobile Developer',
        start: '2018-06',
        end: '2023-09',
        mode: 'On-site',
        place: 'Ica, Peru',
        summary:
          'Software for agroindustry — applications used in packing houses and in the field, where the phone is cheap, the signal is poor, and the person holding it did not choose the tool. Five years of it, across more than a dozen projects.',
        highlights: [
          'Delivered and maintained more than twelve projects for agroindustry companies.',
          'Migrated the Android codebase from Java to Kotlin.',
          'Integrated OCR with Tesseract and computer vision with ML Kit and OpenCV.',
          'Connected thermal point-of-sale printers over USB and Bluetooth.',
          'Wrote the shared internal component libraries the other projects were built on.',
        ],
        products: [
          {
            name: 'DigitalDocs, KPI and Digital',
            channels: [
              {
                kind: 'playstore',
                href: 'https://play.google.com/store/apps/developer?id=AGROSMART+SAC',
              },
            ],
          },
          {
            name: 'Other applications',
            channels: [{ kind: 'direct' }],
          },
        ],
      },
    ] as readonly Position[],
    capabilities: [
      {
        label: 'Mobile',
        body: 'Native Android first, multiplatform where it earns its place.',
        items: [
          'Kotlin',
          'Jetpack Compose',
          'Java',
          'Android SDK',
          'Android NDK',
          'Kotlin Multiplatform',
          'Swift',
        ],
      },
      {
        label: 'Architecture & practice',
        body: 'How the code is organised, tested, and kept honest over years.',
        items: [
          'Clean Architecture',
          'MVI · MVVM · MVP',
          'SOLID',
          'Dependency injection (Dagger Hilt)',
          'Design patterns',
          'JUnit · Espresso',
          'GitFlow',
          'Scrum',
        ],
      },
      {
        label: 'Vision, IoT & devices',
        body: 'Software that has to read the physical world and trust what it finds.',
        items: [
          'ML Kit',
          'OpenCV',
          'Tesseract OCR',
          'MQTT',
          'ESP32 · M5Stack',
          'C · C++',
          'Thermal POS printers',
        ],
      },
      {
        label: 'Web & services',
        body: 'The other half of a product, when the product needs one.',
        items: [
          'TypeScript',
          'React',
          'Node.js',
          'Python',
          'Laravel · PHP',
          'MySQL',
          'SQLite',
        ],
      },
    ] as readonly CapabilityGroup[],
    education: [
      {
        title: 'Systems Engineer',
        issuer: 'Universidad Autónoma de Ica',
        year: '2022',
      },
      {
        title: 'BSc, Systems & Computer Engineering',
        issuer: 'Universidad Alas Peruanas',
        year: '2018',
      },
    ] as readonly Credential[],
    recognition: [
      {
        title: 'Scrum Fundamentals Certified',
        issuer: 'ScrumStudy',
        year: '2022',
      },
      { title: '20th place, AdventJS', issuer: 'midudev', year: '2022' },
    ] as readonly Credential[],
  },
  es: {
    locale: 'es',
    translationKey: 'about',
    name: 'Carlos Alarcon',
    role: 'Desarrollador de producto digital, enfocado en mobile',
    location: 'Lima, Perú · GMT-5',
    avatar: '/avatar.png',
    avatarAlt:
      'Avatar ilustrado: una laptop sobre un escritorio junto a una planta, con un pequeño juego de bloques en la pantalla.',
    bio: {
      thesis: '¿Cómo debería estar hecho esto?',
      note: 'La misma pregunta en cualquier capa: la arquitectura que sostiene una app, la pantalla que alguien toca con una sola mano y de pie en un pasillo, el modelo que decide qué mostrarle. Escribo lo que aprendo respondiéndola, sobre todo lo que me habría gustado encontrar ya escrito.',
    },
    facets: [
      {
        label: 'Qué construyo',
        body: 'Producto digital, sobre todo en mobile. Apps, librerías y herramientas que otros usan para trabajar.',
      },
      {
        label: 'Cómo trabajo',
        body: 'El ciclo completo del producto y no un ticket aislado, con la experiencia de uso como parte del trabajo. Ágil más en la práctica que en la ceremonia.',
      },
      {
        label: 'A qué recurro',
        body: 'Kotlin y TypeScript en el día a día. Clean Architecture con MVI, MVVM o MVP, según lo que pida el problema.',
      },
    ] as readonly Facet[],
    now: {
      updatedAt: '2026-07-25',
      items: [
        'Rediseñando la aplicación Android de LiveTrade en Overall Strategy.',
        'Manteniendo la versión publicada mientras avanza el rediseño.',
        'Aprendiendo iOS y Python.',
        'Construyendo este archivo, y anotando lo que me va enseñando.',
      ],
    },
    links: socials,
    positions: [
      {
        org: 'Overall Strategy S.A.C.',
        orgUrl: 'https://www.overall.pe/',
        role: 'Desarrollador mobile',
        start: '2023-10',
        end: null,
        mode: 'Remoto',
        place: 'Perú',
        summary:
          'Overall opera servicios de tercerización de procesos, industriales y de trade en más de treinta ciudades del Perú. LiveTrade es con lo que las marcas que atiende manejan a su equipo en campo: una sola aplicación para el promotor en el punto de venta, el supervisor en ruta y el analista en oficina, donde la señal no entra y cada uno trae un teléfono distinto. Muchísimos usuarios, y no todos en Perú.',
        highlights: [
          'Rediseñando la aplicación Android de LiveTrade.',
          'Manteniendo en paralelo la versión Android publicada.',
          'Trabajo sobre la captura en punto de venta, la asistencia por GPS y el reporte en tiempo real del que depende la operación.',
        ],
        products: [
          {
            name: 'LiveTrade',
            channels: [
              {
                kind: 'playstore',
                href: 'https://play.google.com/store/apps/details?id=pe.overall.livetrade',
              },
              {
                kind: 'appgallery',
                href: 'https://appgallery.huawei.com/app/C103933455',
              },
              {
                kind: 'appstore',
                href: 'https://apps.apple.com/us/app/livetrade-overall/id6473452653',
              },
            ],
          },
          {
            name: 'Livetrade Impulso',
            channels: [
              {
                kind: 'playstore',
                href: 'https://play.google.com/store/apps/details?id=pe.overall.livetrade.lite',
              },
              {
                kind: 'appgallery',
                href: 'https://appgallery.huawei.com/app/C110387883',
              },
            ],
          },
          {
            name: 'LiveTrade (rediseño)',
            channels: [
              {
                kind: 'playstore',
                href: 'https://play.google.com/store/apps/details?id=pe.overall.livetrade2',
              },
            ],
          },
        ],
      },
      {
        org: 'Agrosmart S.A.C.',
        orgUrl: 'https://www.agromas.pe',
        role: 'Desarrollador mobile',
        start: '2018-06',
        end: '2023-09',
        mode: 'Presencial',
        place: 'Ica, Perú',
        summary:
          'Software para agroindustria: aplicaciones usadas en packing y en campo, donde el teléfono es barato, la señal es mala y quien lo sostiene no eligió la herramienta. Cinco años de eso, en más de una docena de proyectos.',
        highlights: [
          'Entregué y mantuve más de doce proyectos para empresas de la agroindustria.',
          'Migré el código Android de Java a Kotlin.',
          'Integré OCR con Tesseract y visión por computadora con ML Kit y OpenCV.',
          'Conecté impresoras térmicas de punto de venta por USB y Bluetooth.',
          'Escribí las librerías internas de componentes compartidas sobre las que se apoyaban los demás proyectos.',
        ],
        products: [
          {
            name: 'DigitalDocs, KPI y Digital',
            channels: [
              {
                kind: 'playstore',
                href: 'https://play.google.com/store/apps/developer?id=AGROSMART+SAC',
              },
            ],
          },
          {
            name: 'Otras aplicaciones',
            channels: [{ kind: 'direct' }],
          },
        ],
      },
    ] as readonly Position[],
    capabilities: [
      {
        label: 'Mobile',
        body: 'Android nativo primero; multiplataforma cuando se gana el lugar.',
        items: [
          'Kotlin',
          'Jetpack Compose',
          'Java',
          'Android SDK',
          'Android NDK',
          'Kotlin Multiplatform',
          'Swift',
        ],
      },
      {
        label: 'Arquitectura y práctica',
        body: 'Cómo se organiza, se prueba y se mantiene honesto el código durante años.',
        items: [
          'Clean Architecture',
          'MVI · MVVM · MVP',
          'SOLID',
          'Inyección de dependencias (Dagger Hilt)',
          'Patrones de diseño',
          'JUnit · Espresso',
          'GitFlow',
          'Scrum',
        ],
      },
      {
        label: 'Visión, IoT y dispositivos',
        body: 'Software que tiene que leer el mundo físico y confiar en lo que encuentra.',
        items: [
          'ML Kit',
          'OpenCV',
          'Tesseract OCR',
          'MQTT',
          'ESP32 · M5Stack',
          'C · C++',
          'Impresoras térmicas POS',
        ],
      },
      {
        label: 'Web y servicios',
        body: 'La otra mitad de un producto, cuando el producto la necesita.',
        items: [
          'TypeScript',
          'React',
          'Node.js',
          'Python',
          'Laravel · PHP',
          'MySQL',
          'SQLite',
        ],
      },
    ] as readonly CapabilityGroup[],
    education: [
      {
        title: 'Ingeniero de Sistemas',
        issuer: 'Universidad Autónoma de Ica',
        year: '2022',
      },
      {
        title: 'Bachiller en Ingeniería de Sistemas e Informática',
        issuer: 'Universidad Alas Peruanas',
        year: '2018',
      },
    ] as readonly Credential[],
    recognition: [
      {
        title: 'Scrum Fundamentals Certified',
        issuer: 'ScrumStudy',
        year: '2022',
      },
      { title: 'Puesto 20, AdventJS', issuer: 'midudev', year: '2022' },
    ] as readonly Credential[],
  },
} as const satisfies Record<Locale, object>
