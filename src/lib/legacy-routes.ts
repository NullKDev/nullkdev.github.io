import { getLegacyRoutes, type LegacyRoute } from '@/data/legacy-routes'
import { getAlternateLocale, getLocalizedPath, type Locale } from '@/i18n'

/** The retired top-level sections that still answer with a notice. */
export type LegacySection = 'blog' | 'projects' | 'tools' | 'photos'

export interface LegacyStaticPath {
  params: { slug: string | undefined }
  props: { route: LegacyRoute; counterpart: LegacyRoute | undefined }
}

/**
 * `getStaticPaths` for one legacy section in one locale. Eight route files
 * (`src/pages/{,es/}{blog,projects,tools,photos}/[...slug].astro`) render the
 * same `CompatibilityPage`; they differ only in these two arguments.
 *
 * The route table is read once per call rather than once per route, and the
 * counterpart is the other locale's route whose source localises to this one.
 */
export const getLegacyStaticPaths = (
  section: LegacySection,
  locale: Locale,
  routes: readonly LegacyRoute[] = getLegacyRoutes(),
): LegacyStaticPath[] => {
  const prefix = getLocalizedPath(`/${section}/`, locale)
  const alternate = getAlternateLocale(locale)
  return routes
    .filter(
      (route) => route.locale === locale && route.source.startsWith(prefix),
    )
    .map((route) => ({
      params: { slug: route.source.slice(prefix.length, -1) || undefined },
      props: {
        route,
        counterpart: routes.find(
          (candidate) =>
            candidate.locale === alternate &&
            getLocalizedPath(candidate.source, locale) === route.source,
        ),
      },
    }))
}
