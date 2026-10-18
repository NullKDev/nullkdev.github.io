import { en } from './en'
import { es } from './es'

export type Locale = 'en' | 'es'

type WidenStrings<T> = {
  [Key in keyof T]: T[Key] extends string ? string : WidenStrings<T[Key]>
}

export type Dictionary = WidenStrings<typeof en>

const dictionaries: Record<Locale, Dictionary> = { en, es }

export const getDictionary = (locale: Locale): Dictionary =>
  dictionaries[locale]

export const getLocaleFromPath = (pathname: string): Locale =>
  pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en'

const withoutLocalePrefix = (pathname: string) => {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (normalized === '/es') return '/'
  return normalized.startsWith('/es/') ? normalized.slice(3) || '/' : normalized
}

/**
 * The one place a locale prefix is written. Every route the archive builds —
 * section indexes, counterpart links, entry and legacy paths — goes through
 * it, so `/es` is spelled only in this module.
 *
 * Chosen over Astro's `getRelativeLocaleUrl()` from `astro:i18n`: that is a
 * virtual module, so it cannot run in a Vitest unit test, a build script or a
 * React island, and it rewrites slashes from `trailingSlash` rather than
 * keeping the path it was given. This is a pure function of its arguments and
 * agrees with the `i18n` block in `astro.config.mjs` (English unprefixed,
 * Spanish under `/es`). It is idempotent: an already-prefixed path is
 * re-prefixed, never doubled.
 */
export const getLocalizedPath = (pathname: string, locale: Locale): string => {
  const basePath = withoutLocalePrefix(pathname)
  return locale === 'es'
    ? basePath === '/'
      ? '/es/'
      : `/es${basePath}`
    : basePath
}

/** The locale a counterpart link points at. */
export const getAlternateLocale = (locale: Locale): Locale =>
  locale === 'en' ? 'es' : 'en'
