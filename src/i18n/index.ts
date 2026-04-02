import { en, type TranslationKeys } from './en'
import { es } from './es'

export type Locale = 'en' | 'es'

export const DEFAULT_LOCALE: Locale = 'en'
export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'es'] as const

const translations: Record<Locale, Record<string, string>> = { en, es }

export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  return (
    translations[locale][key as TranslationKeys] ??
    translations.en[key as TranslationKeys] ??
    key
  )
}

export function getLocaleFromStorage(): Locale {
  if (typeof localStorage === 'undefined') return DEFAULT_LOCALE
  const stored = localStorage.getItem('lang')
  if (stored === 'es' || stored === 'en') return stored
  return DEFAULT_LOCALE
}
