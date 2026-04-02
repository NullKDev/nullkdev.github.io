import { useState, useEffect } from 'react'
import { t as translate, getLocaleFromStorage, type Locale } from './index'

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en'
    return getLocaleFromStorage()
  })

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ locale: Locale }>).detail
      setLocale(detail.locale)
    }
    window.addEventListener('locale-changed', handler)
    return () => window.removeEventListener('locale-changed', handler)
  }, [])

  return locale
}

export function useTranslation() {
  const locale = useLocale()
  return {
    locale,
    t: (key: string) => translate(key, locale),
  }
}
