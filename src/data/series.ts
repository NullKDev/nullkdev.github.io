/**
 * Display titles for note series, one place for every series id.
 *
 * A series id is a slug (`gof-android`); printing it raw put "Series:
 * gof-android" on a page. The schema only accepts ids declared here, so a
 * series can never render without a title in both languages.
 */
export const series = {
  'android-versions': {
    en: 'Android, version by version',
    es: 'Android, versión por versión',
  },
  'gof-android': {
    en: 'GoF patterns on Android',
    es: 'Patrones GoF en Android',
  },
  'remote-compose': { en: 'Remote Compose', es: 'Remote Compose' },
} as const

export type SeriesId = keyof typeof series

export const seriesIds = Object.keys(series) as [SeriesId, ...SeriesId[]]

export const getSeriesTitle = (
  id: string,
  locale: 'en' | 'es',
): string | undefined => series[id as SeriesId]?.[locale]
