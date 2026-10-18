import { getLocalizedPath, type Locale } from '@/i18n'

export interface LegacyRoute {
  source: string
  target: string
  locale: Locale
  kind: 'migrated' | 'retired'
  retirement?: 'photo' | 'demo'
}

const migrated = {
  blog: {
    'compose-remote': 'notes/remote-compose',
    'compose-remote/getting-started': 'notes/remote-compose/getting-started',
    'gof-patterns-android': 'notes/gof-patterns-android',
    'gof-patterns-android/observer-state':
      'notes/gof-patterns-android/observer-state',
    'gof-patterns-android/proxy-facade':
      'notes/gof-patterns-android/proxy-facade',
    'gof-patterns-android/adapter-factory':
      'notes/gof-patterns-android/adapter-factory',
    'gof-patterns-android/strategy-decorator':
      'notes/gof-patterns-android/strategy-decorator',
    pretext: 'notes/pretext-text-layout',
    'pretext/reflow-tax': 'notes/pretext-text-layout/reflow-tax',
    'pretext/how-it-works': 'notes/pretext-text-layout/how-it-works',
    'pretext/matteflow': 'notes/pretext-text-layout',
    'pretext/react-demo': 'notes/pretext-text-layout',
  },
  projects: { 'keyboard-simple': 'work/keyboard-simple' },
} as const

const spanishTargets: Record<string, string> = {
  'notes/remote-compose': 'notes/composicion-remota',
  'notes/remote-compose/getting-started':
    'notes/composicion-remota/primeros-pasos',
  'notes/gof-patterns-android': 'notes/patrones-gof-android',
  'notes/gof-patterns-android/observer-state':
    'notes/patrones-gof-android/observer-state',
  'notes/gof-patterns-android/proxy-facade':
    'notes/patrones-gof-android/proxy-facade',
  'notes/gof-patterns-android/adapter-factory':
    'notes/patrones-gof-android/adapter-factory',
  'notes/gof-patterns-android/strategy-decorator':
    'notes/patrones-gof-android/strategy-decorator',
  'notes/pretext-text-layout': 'notes/pretext-layout-de-texto',
  'notes/pretext-text-layout/reflow-tax':
    'notes/pretext-layout-de-texto/costo-de-reflow',
  'notes/pretext-text-layout/how-it-works':
    'notes/pretext-layout-de-texto/como-funciona',
  'work/keyboard-simple': 'work/teclado-simple',
}

const route = (
  source: string,
  target: string,
  locale: Locale,
  kind: LegacyRoute['kind'] = 'migrated',
  retirement?: LegacyRoute['retirement'],
): LegacyRoute => ({
  source: getLocalizedPath(`/${source}/`, locale),
  target: getLocalizedPath(`/${target}/`, locale),
  locale,
  kind,
  retirement,
})

export const getLegacyRoutes = (): LegacyRoute[] => {
  const routes: LegacyRoute[] = []
  for (const locale of ['en', 'es'] as const) {
    routes.push(
      route('blog', 'notes', locale),
      route('projects', 'work', locale),
      // The retired tools are gone, and so are their URLs; only the section
      // root still points readers at the Lab.
      route('tools', 'lab', locale),
      route('photos', 'gallery', locale, 'retired', 'photo'),
      route('photos/palo-alto', 'gallery', locale, 'retired', 'photo'),
      route('photos/san-francisco', 'gallery', locale, 'retired', 'photo'),
    )
    for (const [section, mappings] of Object.entries(migrated)) {
      for (const [source, englishTarget] of Object.entries(mappings)) {
        const target =
          locale === 'es'
            ? (spanishTargets[englishTarget] ?? englishTarget)
            : englishTarget
        const retiredDemo =
          source === 'pretext/matteflow' || source === 'pretext/react-demo'
        routes.push(
          route(
            `${section}/${source}`,
            target,
            locale,
            retiredDemo ? 'retired' : 'migrated',
            retiredDemo ? 'demo' : undefined,
          ),
        )
      }
    }
  }
  return routes
}
