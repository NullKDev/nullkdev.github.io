import { getAlternateLocale, getLocalizedPath, type Locale } from '@/i18n'

export type ArchiveDomain = 'work' | 'lab' | 'notes' | 'gallery'

interface TranslatedRouteEntry {
  locale: Locale
  translationKey: string
  slug: string
}

export const buildEntryPath = (
  domain: ArchiveDomain,
  slug: string,
  locale: Locale,
) => getLocalizedPath(`/${domain}/${slug}/`, locale)

export const buildDocumentPath = (
  domain: ArchiveDomain,
  slug: string,
  documentSlug: string,
  locale: Locale,
) => `${buildEntryPath(domain, slug, locale)}${documentSlug}/`

export const getCounterpartPath = (
  entry: TranslatedRouteEntry,
  entries: TranslatedRouteEntry[],
  domain: ArchiveDomain,
  fallbackPath: string,
) => {
  const targetLocale = getAlternateLocale(entry.locale)
  const counterpart = entries.find(
    (candidate) =>
      candidate.translationKey === entry.translationKey &&
      candidate.locale === targetLocale,
  )
  if (counterpart) {
    return buildEntryPath(domain, counterpart.slug, targetLocale)
  }
  return getLocalizedPath(fallbackPath, targetLocale)
}
