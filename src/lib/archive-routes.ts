import type { Locale } from '@/i18n'

export type ArchiveDomain = 'work' | 'lab' | 'notes' | 'gallery'

interface TranslatedRouteEntry {
  locale: Locale
  translationKey: string
  slug: string
}

const localePrefix = (locale: Locale) => (locale === 'es' ? '/es' : '')

export const buildEntryPath = (
  domain: ArchiveDomain,
  slug: string,
  locale: Locale,
) => `${localePrefix(locale)}/${domain}/${slug}/`

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
  const targetLocale: Locale = entry.locale === 'en' ? 'es' : 'en'
  const counterpart = entries.find(
    (candidate) =>
      candidate.translationKey === entry.translationKey &&
      candidate.locale === targetLocale,
  )
  if (counterpart) {
    return buildEntryPath(domain, counterpart.slug, targetLocale)
  }
  return `${localePrefix(targetLocale)}${fallbackPath}`
}
