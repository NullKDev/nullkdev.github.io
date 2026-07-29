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

export const getLocalizedPath = (pathname: string, locale: Locale): string => {
  const basePath = withoutLocalePrefix(pathname)
  return locale === 'es'
    ? basePath === '/'
      ? '/es/'
      : `/es${basePath}`
    : basePath
}
