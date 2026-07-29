import { describe, expect, it } from 'vitest'

import { getDictionary, getLocaleFromPath, getLocalizedPath } from '@/i18n'
import { getArchiveLabel } from '@/i18n/archive'

describe('native locale routing', () => {
  it('uses unprefixed English and explicit Spanish routes', () => {
    expect(getLocalizedPath('/work/example', 'en')).toBe('/work/example')
    expect(getLocalizedPath('/work/example', 'es')).toBe('/es/work/example')
    expect(getLocalizedPath('/es/work/example', 'en')).toBe('/work/example')
  })

  it('detects locale without inventing translation fallback', () => {
    expect(getLocaleFromPath('/es/notes')).toBe('es')
    expect(getLocaleFromPath('/notes')).toBe('en')
    /* Probed through copy that must be translated. `home.title` is the author's
       name — identical in both dictionaries by design, so it can never show
       whether a translation happened or English leaked through. */
    expect(getDictionary('en').nav.work).toBe('Work')
    expect(getDictionary('es').nav.work).toBe('Trabajo')
    expect(getDictionary('es').home.intro).not.toBe(
      getDictionary('en').home.intro,
    )
  })

  it('localizes archive domain, lifecycle, maturity, provenance, and link enums', () => {
    expect(getArchiveLabel('domain', 'work', 'es')).toBe('Trabajo')
    expect(getArchiveLabel('lifecycle', 'shipped', 'es')).toBe('Publicado')
    expect(getArchiveLabel('maturity', 'growing', 'es')).toBe('En desarrollo')
    expect(getArchiveLabel('provenance', 'third-party', 'es')).toBe('Terceros')
    expect(getArchiveLabel('linkKind', 'repository', 'es')).toBe('Repositorio')
  })
})
