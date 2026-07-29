import type { Locale } from '@/i18n'

export interface LegacyRoute {
  source: string
  target: string
  locale: Locale
  kind: 'migrated' | 'retired'
  retirement?: 'photo' | 'demo'
}

const migrated = {
  blog: {
    'android-17-beta-3': 'notes/android-17-beta-3',
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
  tools: {
    'json-formatter': 'lab/json-formatter',
    'yaml-validator': 'lab/yaml-validator',
    'base64-encoder': 'lab/base64-encoder',
    'password-generator': 'lab/password-generator',
    'docker-converter': 'lab/docker-to-kubernetes',
    'ascii-converter': 'lab/unicode-inspector',
    'subnet-calculator': 'lab/subnet-calculator',
    'ip-dns-lookup': 'lab',
  },
} as const

const spanishTargets: Record<string, string> = {
  'notes/android-17-beta-3': 'notes/android-17-beta-3',
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
  'lab/json-formatter': 'lab/formateador-json',
  'lab/yaml-validator': 'lab/validador-yaml',
  'lab/base64-encoder': 'lab/codificador-base64',
  'lab/password-generator': 'lab/generador-contrasenas',
  'lab/docker-to-kubernetes': 'lab/docker-a-kubernetes',
  'lab/unicode-inspector': 'lab/inspector-unicode',
  'lab/subnet-calculator': 'lab/calculadora-subred',
  lab: 'lab',
}

const route = (
  source: string,
  target: string,
  locale: Locale,
  kind: LegacyRoute['kind'] = 'migrated',
  retirement?: LegacyRoute['retirement'],
): LegacyRoute => ({
  source: `${locale === 'es' ? '/es' : ''}/${source}/`.replaceAll('//', '/'),
  target: `${locale === 'es' ? '/es' : ''}/${target}/`.replaceAll('//', '/'),
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
