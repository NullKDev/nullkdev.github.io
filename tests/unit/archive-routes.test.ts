import { describe, expect, it } from 'vitest'

import {
  buildDocumentPath,
  buildEntryPath,
  getCounterpartPath,
} from '@/lib/archive-routes'

describe('archive route helpers', () => {
  it('builds localized entry and nested document paths', () => {
    expect(buildEntryPath('work', 'keyboard-simple', 'en')).toBe(
      '/work/keyboard-simple/',
    )
    expect(buildEntryPath('notes', 'composicion-remota', 'es')).toBe(
      '/es/notes/composicion-remota/',
    )
    expect(
      buildDocumentPath('notes', 'remote-compose', 'getting-started', 'en'),
    ).toBe('/notes/remote-compose/getting-started/')
  })

  it('resolves translated slugs by translation key without guessing', () => {
    const entries = [
      {
        locale: 'en' as const,
        translationKey: 'remote-compose',
        slug: 'remote-compose',
      },
      {
        locale: 'es' as const,
        translationKey: 'remote-compose',
        slug: 'composicion-remota',
      },
    ]

    expect(getCounterpartPath(entries[0], entries, 'notes', '/notes/')).toBe(
      '/es/notes/composicion-remota/',
    )
  })

  it('falls back to the translated section when no counterpart exists', () => {
    const entry = {
      locale: 'en' as const,
      translationKey: 'only-english',
      slug: 'only-english',
    }

    expect(getCounterpartPath(entry, [entry], 'notes', '/notes/')).toBe(
      '/es/notes/',
    )
  })
})
