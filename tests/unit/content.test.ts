import { beforeEach, describe, expect, it } from 'vitest'

import { resetCollections, setCollection } from '../stubs/astro-content'

import {
  getAdjacentDocuments,
  getAdjacentEntries,
  getArchiveEntries,
  getDocumentAlternatePath,
  getDocumentCounterpartPath,
  getDocumentPath,
  getDocumentRelationships,
  getDocumentsForEntry,
  getEntryAlternatePath,
  getEntryCounterpartPath,
  getEntryDomain,
  getEntryPath,
  getEntryRelationships,
  getHomeSections,
  getNotesSeriesNavigation,
  type ArchiveDocument,
  type ArchiveEntry,
} from '@/lib/content'

type Collection = 'work' | 'lab' | 'notes' | 'gallery'

interface EntryShape {
  collection?: Collection
  slug: string
  locale?: 'en' | 'es'
  translationKey?: string
  featuredRank?: number
  publishedAt?: string
  visibility?: string
  protection?: string
  references?: { entryId: string; relationship: string }[]
  series?: { id: string; order: number }
  /** Domain-specific marker fields, to prove they no longer decide domain. */
  extra?: Record<string, unknown>
}

const entry = ({
  collection = 'notes',
  slug,
  locale = 'en',
  translationKey = slug,
  featuredRank,
  publishedAt = '2026-01-01',
  visibility = 'public',
  protection = 'public',
  references = [],
  series,
  extra = {},
}: EntryShape) =>
  ({
    id: `${collection}/${slug}.${locale}`,
    collection,
    body: '',
    data: {
      entryId: `${collection}-${translationKey}`,
      slug,
      locale,
      translationKey,
      featuredRank,
      publishedAt: new Date(publishedAt),
      visibility,
      protection: { mode: protection },
      references,
      series,
      topics: [],
      ...extra,
    },
  }) as unknown as ArchiveEntry

const document = (
  parentId: string,
  slug: string,
  order: number,
  { locale = 'en', translationKey = slug, references = [] } = {} as {
    locale?: 'en' | 'es'
    translationKey?: string
    references?: { entryId: string; relationship: string }[]
  },
) =>
  ({
    id: `${parentId}/${slug}.${locale}`,
    collection: 'documents',
    data: {
      parentId,
      slug,
      order,
      locale,
      translationKey,
      visibility: 'public',
      protection: { mode: 'public' },
      references,
    },
  }) as unknown as ArchiveDocument

const seed = (entries: ArchiveEntry[], documents: ArchiveDocument[] = []) => {
  for (const name of ['work', 'lab', 'notes', 'gallery'] as const) {
    setCollection(
      name,
      entries.filter((item) => item.collection === name),
    )
  }
  setCollection('documents', documents)
}

beforeEach(() => resetCollections())

describe('entry domain', () => {
  it('comes from the collection, not from which fields happen to exist', () => {
    /* A gallery entry that carried `citations` used to be filed as a note. */
    const gallery = entry({
      collection: 'gallery',
      slug: 'g',
      extra: { citations: [], execution: {} },
    })
    expect(getEntryDomain(gallery)).toBe('gallery')
    expect(getEntryDomain(entry({ collection: 'lab', slug: 'l' }))).toBe('lab')
    expect(getEntryPath(gallery)).toBe('/gallery/g/')
  })
})

describe('archive listing', () => {
  it('keeps public entries in the locale, featured first then newest', async () => {
    seed([
      entry({ slug: 'old', publishedAt: '2025-01-01' }),
      entry({ slug: 'new', publishedAt: '2026-05-01' }),
      entry({ slug: 'pinned', featuredRank: 1, publishedAt: '2024-01-01' }),
      entry({ slug: 'hidden', visibility: 'private' }),
      entry({ slug: 'locked', protection: 'encrypted' }),
      entry({ slug: 'spanish', locale: 'es' }),
    ])
    expect(
      (await getArchiveEntries('notes', 'en')).map(({ data }) => data.slug),
    ).toEqual(['pinned', 'new', 'old'])
  })

  it('home sections take the first entries of that same order', async () => {
    seed([
      entry({ slug: 'a', publishedAt: '2026-03-01' }),
      entry({ slug: 'b', featuredRank: 1, publishedAt: '2020-01-01' }),
      entry({ slug: 'c', publishedAt: '2026-04-01' }),
    ])
    const notes = (await getHomeSections('en', 2)).find(
      ({ domain }) => domain === 'notes',
    )
    expect(notes?.total).toBe(3)
    expect(notes?.items.map(({ data }) => data.slug)).toEqual(['b', 'c'])
  })
})

describe('counterparts', () => {
  it('links to the translated entry, or to the section index', async () => {
    const english = entry({ slug: 'hello', translationKey: 'k' })
    const spanish = entry({ slug: 'hola', translationKey: 'k', locale: 'es' })
    const lonely = entry({ slug: 'solo' })
    seed([english, spanish, lonely])
    expect(await getEntryCounterpartPath(english)).toBe('/es/notes/hola/')
    expect(await getEntryCounterpartPath(spanish)).toBe('/notes/hello/')
    expect(await getEntryCounterpartPath(lonely)).toBe('/es/notes/')
  })

  it('names an hreflang alternate only for a real translation', async () => {
    const english = entry({ slug: 'hello', translationKey: 'k' })
    const spanish = entry({ slug: 'hola', translationKey: 'k', locale: 'es' })
    const lonely = entry({ slug: 'solo' })
    seed([english, spanish, lonely])
    expect(await getEntryAlternatePath(english)).toBe('/es/notes/hola/')
    expect(await getEntryAlternatePath(spanish)).toBe('/notes/hello/')
    expect(await getEntryAlternatePath(lonely)).toBeUndefined()
  })

  it('needs both the entry and the document translated', async () => {
    const english = entry({ slug: 'hello', translationKey: 'k' })
    const spanish = entry({ slug: 'hola', translationKey: 'k', locale: 'es' })
    const part = document('notes-k', 'part', 1, { translationKey: 'p' })
    const parte = document('notes-k', 'parte', 1, {
      translationKey: 'p',
      locale: 'es',
    })
    const untranslated = document('notes-k', 'only', 2)
    seed([english, spanish], [part, parte, untranslated])
    expect(await getDocumentCounterpartPath(english, part)).toBe(
      '/es/notes/hola/parte/',
    )
    expect(await getDocumentCounterpartPath(english, untranslated)).toBe(
      '/es/notes/',
    )
    expect(await getDocumentAlternatePath(english, part)).toBe(
      '/es/notes/hola/parte/',
    )
    expect(
      await getDocumentAlternatePath(english, untranslated),
    ).toBeUndefined()
  })
})

describe('adjacency', () => {
  it('orders documents and steps through them', async () => {
    const parent = entry({ slug: 'p', translationKey: 'p' })
    const second = document('notes-p', 'two', 2)
    const first = document('notes-p', 'one', 1)
    const third = document('notes-p', 'three', 3)
    const otherLocale = document('notes-p', 'uno', 1, { locale: 'es' })
    seed([parent], [second, first, third, otherLocale])

    expect(
      (await getDocumentsForEntry(parent)).map(({ data }) => data.slug),
    ).toEqual(['one', 'two', 'three'])
    expect(getDocumentPath(parent, second)).toBe('/notes/p/two/')

    const middle = await getAdjacentDocuments(parent, second)
    expect(middle.previous?.data.slug).toBe('one')
    expect(middle.next?.data.slug).toBe('three')
    const start = await getAdjacentDocuments(parent, first)
    expect(start.previous).toBeUndefined()
    const last = await getAdjacentDocuments(parent, third)
    expect(last.next).toBeUndefined()
  })

  it('steps through entries in archive order, and not for hidden ones', async () => {
    const a = entry({ slug: 'a', featuredRank: 1 })
    const b = entry({ slug: 'b', featuredRank: 2 })
    const c = entry({ slug: 'c', featuredRank: 3 })
    const hidden = entry({ slug: 'h', visibility: 'private' })
    seed([a, b, c, hidden])
    const around = await getAdjacentEntries(b)
    expect(around.previous?.data.slug).toBe('a')
    expect(around.next?.data.slug).toBe('c')
    expect(await getAdjacentEntries(hidden)).toEqual({
      previous: undefined,
      next: undefined,
    })
  })

  it('walks a notes series by declared order', async () => {
    const two = entry({ slug: 'two', series: { id: 's', order: 2 } })
    const one = entry({ slug: 'one', series: { id: 's', order: 1 } })
    const three = entry({ slug: 'three', series: { id: 's', order: 3 } })
    const outside = entry({ slug: 'x', series: { id: 'other', order: 1 } })
    seed([two, one, three, outside])
    const series = await getNotesSeriesNavigation(two)
    expect(series).toMatchObject({ id: 's', order: 2, total: 3 })
    expect(series?.previous?.data.slug).toBe('one')
    expect(series?.next?.data.slug).toBe('three')
    expect(await getNotesSeriesNavigation(entry({ slug: 'none' }))).toBe(
      undefined,
    )
    expect(
      await getNotesSeriesNavigation(
        entry({ collection: 'work', slug: 'w', series: { id: 's', order: 1 } }),
      ),
    ).toBeUndefined()
  })
})

describe('relationships', () => {
  it('resolves references and backlinks among public entries only', async () => {
    const target = entry({ slug: 'target', translationKey: 'target' })
    const source = entry({
      slug: 'source',
      references: [
        { entryId: 'notes-target', relationship: 'extends' },
        { entryId: 'notes-missing', relationship: 'cites' },
      ],
    })
    const hiddenSource = entry({
      slug: 'hidden',
      visibility: 'private',
      references: [{ entryId: 'notes-target', relationship: 'cites' }],
    })
    seed([target, source, hiddenSource])

    const fromSource = await getEntryRelationships(source)
    expect(fromSource.references.map(({ entry }) => entry.data.slug)).toEqual([
      'target',
    ])
    const toTarget = await getEntryRelationships(target)
    expect(toTarget.backlinks.map(({ entry }) => entry.data.slug)).toEqual([
      'source',
    ])
    expect(toTarget.backlinks[0].reference.relationship).toBe('extends')
  })

  it('resolves a document reference to its public entry', async () => {
    const target = entry({ slug: 'target', translationKey: 'target' })
    seed([target])
    const part = document('notes-x', 'part', 1, {
      references: [
        { entryId: 'notes-target', relationship: 'cites' },
        { entryId: 'notes-gone', relationship: 'cites' },
      ],
    })
    expect(
      (await getDocumentRelationships(part)).map(
        ({ entry }) => entry.data.slug,
      ),
    ).toEqual(['target'])
  })
})
