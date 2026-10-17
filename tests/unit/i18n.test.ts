import { describe, expect, it } from 'vitest'

import {
  getAlternateLocale,
  getDictionary,
  getLocaleFromPath,
  getLocalizedPath,
} from '@/i18n'
import { getArchiveLabel } from '@/i18n/archive'

describe('native locale routing', () => {
  it('uses unprefixed English and explicit Spanish routes', () => {
    expect(getLocalizedPath('/work/example', 'en')).toBe('/work/example')
    expect(getLocalizedPath('/work/example', 'es')).toBe('/es/work/example')
    expect(getLocalizedPath('/es/work/example', 'en')).toBe('/work/example')
  })

  /* Every locale prefix on the site is built here — section indexes, the
     counterpart link, entry and legacy routes — so the call sites' shapes are
     pinned: the root, trailing slashes, an already-prefixed path, and a bare
     `/es`. */
  it('prefixes every route shape the archive builds, and only once', () => {
    expect(getLocalizedPath('/', 'es')).toBe('/es/')
    expect(getLocalizedPath('/', 'en')).toBe('/')
    expect(getLocalizedPath('/about/', 'es')).toBe('/es/about/')
    expect(getLocalizedPath('/notes/type/note/', 'es')).toBe(
      '/es/notes/type/note/',
    )
    expect(getLocalizedPath('/es/notes/type/note/', 'es')).toBe(
      '/es/notes/type/note/',
    )
    expect(getLocalizedPath('/es/notes/', 'en')).toBe('/notes/')
    expect(getLocalizedPath('/es/', 'en')).toBe('/')
    expect(getLocalizedPath('/es', 'en')).toBe('/')
    expect(getLocalizedPath('/notes-search.json', 'es')).toBe(
      '/es/notes-search.json',
    )
    expect(getLocalizedPath('notes/', 'es')).toBe('/es/notes/')
  })

  it('names the other locale for a counterpart link', () => {
    expect(getAlternateLocale('en')).toBe('es')
    expect(getAlternateLocale('es')).toBe('en')
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
