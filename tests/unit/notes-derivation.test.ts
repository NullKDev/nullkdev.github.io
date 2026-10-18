import { beforeEach, describe, expect, it } from 'vitest'

import { resetCollections, setCollection } from '../stubs/astro-content'

import {
  countByKind,
  getAvailableKinds,
  getAvailableTopics,
  getNotesMeta,
  getNeighbourAge,
  getReadingMinutes,
  getSupersededBy,
  noteKinds,
  NOTES_PER_PAGE,
  resolveNotesCounterpart,
} from '@/lib/notes'

/* Derived from the function signature rather than imported from
   `astro:content`, whose types only exist inside a build. */
type Note = Parameters<typeof countByKind>[0][number]

interface NoteShape {
  id?: string
  body?: string
  entryId?: string
  kind?: string
  topics?: string[]
  translationKey?: string
  supersededBy?: string
}

const note = ({
  id = 'n',
  body = '',
  entryId = `notes-${id}`,
  kind = 'article',
  topics = [],
  translationKey = id,
  supersededBy,
}: NoteShape = {}) =>
  ({
    id,
    body,
    data: { entryId, kind, topics, translationKey, supersededBy },
  }) as unknown as Note

interface DocumentShape {
  parentId: string
  order: number
  title: string
  body?: string
  visibility?: string
}

const document_ = ({
  parentId,
  order,
  title,
  body = '',
  visibility = 'public',
}: DocumentShape) => ({ body, data: { parentId, order, title, visibility } })

beforeEach(() => {
  resetCollections()
})

describe('reading minutes', () => {
  it('rounds at 200 words per minute across every body it is given', () => {
    expect(getReadingMinutes([Array(400).fill('word').join(' ')])).toBe(2)
    expect(
      getReadingMinutes([
        Array(200).fill('word').join(' '),
        Array(200).fill('word').join(' '),
      ]),
    ).toBe(2)
  })

  it('never reports zero minutes for a note that exists', () => {
    // A one-line note rounding to 0 would render "0 min read".
    expect(getReadingMinutes(['three short words'])).toBe(1)
    expect(getReadingMinutes([''])).toBe(1)
    expect(getReadingMinutes([])).toBe(1)
  })

  it('ignores a missing body instead of counting it as text', () => {
    expect(getReadingMinutes([undefined, 'one two three'])).toBe(1)
  })
})

describe('kind counting', () => {
  it('counts each kind present', () => {
    expect(
      countByKind([
        note({ id: 'a', kind: 'article' }),
        note({ id: 'b', kind: 'article' }),
        note({ id: 'c', kind: 'guide' }),
      ]),
    ).toEqual({ article: 2, guide: 1 })
  })

  it('returns an empty record rather than zeroes for an empty archive', () => {
    expect(countByKind([])).toEqual({})
  })
})

describe('available kinds', () => {
  it('keeps the declared order regardless of how many entries each has', () => {
    // The filter bar must not reshuffle as the archive grows.
    expect(
      getAvailableKinds([
        note({ id: 'a', kind: 'reference' }),
        note({ id: 'b', kind: 'article' }),
        note({ id: 'c', kind: 'guide' }),
      ]),
    ).toEqual(['article', 'guide', 'reference'])
  })

  it('omits a kind with no entries, so no tab leads nowhere', () => {
    const kinds = getAvailableKinds([note({ kind: 'note' })])
    expect(kinds).toEqual(['note'])
    expect(kinds).not.toContain('paper')
  })

  it('never invents a kind outside the declared vocabulary', () => {
    const kinds = getAvailableKinds([
      note({ id: 'a', kind: 'article' }),
      note({ id: 'b', kind: 'not-a-kind' }),
    ])
    expect(kinds.every((kind) => noteKinds.includes(kind))).toBe(true)
    expect(kinds).toEqual(['article'])
  })
})

describe('superseded resolution', () => {
  const replacement = note({ id: 'new', translationKey: 'new-key' })

  it('resolves by translationKey', () => {
    const stale = note({ id: 'old', supersededBy: 'new-key' })
    expect(getSupersededBy(stale, [replacement])).toBe(replacement)
  })

  it('resolves by entryId as well', () => {
    const stale = note({ id: 'old', supersededBy: 'notes-new' })
    expect(getSupersededBy(stale, [replacement])).toBe(replacement)
  })

  it('returns undefined when nothing supersedes the entry', () => {
    expect(getSupersededBy(note({ id: 'old' }), [replacement])).toBeUndefined()
  })

  it('returns undefined when the replacement is not published', () => {
    // A dangling pointer must not become a broken link.
    const stale = note({ id: 'old', supersededBy: 'unpublished' })
    expect(getSupersededBy(stale, [replacement])).toBeUndefined()
  })
})

describe('available topics', () => {
  it('orders by count, then alphabetically so builds are stable', () => {
    expect(
      getAvailableTopics([
        note({ id: 'a', topics: ['kotlin', 'android'] }),
        note({ id: 'b', topics: ['android', 'web'] }),
        note({ id: 'c', topics: ['android'] }),
      ]),
    ).toEqual([
      { id: 'android', count: 3 },
      { id: 'kotlin', count: 1 },
      { id: 'web', count: 1 },
    ])
  })

  it('counts a topic once per entry even if it is repeated', () => {
    expect(
      getAvailableTopics([note({ topics: ['android', 'android'] })]),
    ).toEqual([{ id: 'android', count: 1 }])
  })

  it('returns nothing for an archive with no topics', () => {
    expect(getAvailableTopics([])).toEqual([])
  })
})

describe('notes meta', () => {
  const words = (count: number) => Array(count).fill('word').join(' ')

  it('counts subpost bodies into the parent reading time', async () => {
    // A four-part series is not a two-minute read.
    setCollection('documents', [
      document_({
        parentId: 'notes-a',
        order: 1,
        title: 'Part one',
        body: words(200),
      }),
    ])
    const meta = await getNotesMeta([note({ id: 'a', body: words(200) })])
    expect(meta.a.minutes).toBe(2)
    expect(meta.a.parts).toEqual(['Part one'])
  })

  it('lists subposts by title in declared order, not by slug', async () => {
    setCollection('documents', [
      document_({ parentId: 'notes-a', order: 2, title: 'Second' }),
      document_({ parentId: 'notes-a', order: 1, title: 'First' }),
    ])
    const meta = await getNotesMeta([note({ id: 'a' })])
    expect(meta.a.parts).toEqual(['First', 'Second'])
  })

  it('excludes a non-public subpost from the titles and the count', async () => {
    // A private subpost must not leak its title, nor inflate the read time.
    setCollection('documents', [
      document_({
        parentId: 'notes-a',
        order: 1,
        title: 'Draft',
        visibility: 'private',
        body: words(1000),
      }),
    ])
    const meta = await getNotesMeta([note({ id: 'a', body: 'short body' })])
    expect(meta.a.parts).toEqual([])
    expect(meta.a.minutes).toBe(1)
  })

  it("ignores another entry's subposts", async () => {
    setCollection('documents', [
      document_({ parentId: 'notes-other', order: 1, title: 'X' }),
    ])
    const meta = await getNotesMeta([note({ id: 'a', body: words(400) })])
    expect(meta.a).toEqual({ minutes: 2, parts: [] })
  })

  it('keys the record by entry id, for every entry it is given', async () => {
    const meta = await getNotesMeta([note({ id: 'a' }), note({ id: 'b' })])
    expect(Object.keys(meta).toSorted()).toEqual(['a', 'b'])
  })
})

describe('pagination', () => {
  it('exposes one page size for every notes route', () => {
    expect(NOTES_PER_PAGE).toBe(8)
  })
})

describe('resolveNotesCounterpart', () => {
  const many = (count: number, shape: NoteShape = {}) =>
    Array.from({ length: count }, (_, index) =>
      note({ ...shape, id: `${shape.kind ?? 'n'}-${index}` }),
    )

  it('pairs the same page of the same view when the other locale has it', () => {
    const other = many(NOTES_PER_PAGE + 1)
    expect(
      resolveNotesCounterpart({
        otherEntries: other,
        otherBase: '/es/notes',
        page: 2,
      }),
    ).toEqual({ alternatePath: '/es/notes/2/', switchPath: '/es/notes/2/' })
    expect(
      resolveNotesCounterpart({
        otherEntries: other,
        otherBase: '/es/notes',
        page: 1,
      }),
    ).toEqual({ alternatePath: '/es/notes/', switchPath: '/es/notes/' })
  })

  it('names no alternate for a page number the other locale does not build', () => {
    const other = many(NOTES_PER_PAGE)
    expect(
      resolveNotesCounterpart({
        otherEntries: other,
        otherBase: '/es/notes',
        page: 2,
      }),
    ).toEqual({ alternatePath: undefined, switchPath: '/es/notes/' })
  })

  it('keeps the unfiltered index paired even when the other locale is empty', () => {
    expect(
      resolveNotesCounterpart({
        otherEntries: [],
        otherBase: '/notes',
        page: 1,
      }),
    ).toEqual({ alternatePath: '/notes/', switchPath: '/notes/' })
  })

  it('pairs a filter only when the other locale has entries in it', () => {
    const other = [
      ...many(2, { kind: 'guide' }),
      ...many(1, { topics: ['astro'] }),
    ]
    expect(
      resolveNotesCounterpart({
        otherEntries: other,
        otherBase: '/es/notes',
        page: 1,
        kind: 'guide',
      }),
    ).toEqual({
      alternatePath: '/es/notes/type/guide/',
      switchPath: '/es/notes/type/guide/',
    })
    expect(
      resolveNotesCounterpart({
        otherEntries: other,
        otherBase: '/es/notes',
        page: 1,
        topic: 'astro',
      }),
    ).toEqual({
      alternatePath: '/es/notes/topic/astro/',
      switchPath: '/es/notes/topic/astro/',
    })
    expect(
      resolveNotesCounterpart({
        otherEntries: other,
        otherBase: '/es/notes',
        page: 1,
        kind: 'paper',
      }),
    ).toEqual({ alternatePath: undefined, switchPath: '/es/notes/' })
  })
})

describe('pager neighbour age', () => {
  /* Inside a series the date pager sits under the series navigation; calling
     both "Previous" made two different "previous" notes. The pager says
     which way in time it goes instead — derived, because the archive order
     ranks featured notes first and is not strictly by date. */
  const day = (value: string) => new Date(value)

  it('names a later neighbour newer and an earlier one older', () => {
    expect(getNeighbourAge(day('2026-05-01'), day('2026-06-01'))).toBe('newer')
    expect(getNeighbourAge(day('2026-05-01'), day('2026-04-01'))).toBe('older')
  })

  it('makes no claim when a date is missing or the same', () => {
    expect(getNeighbourAge(undefined, day('2026-04-01'))).toBeUndefined()
    expect(getNeighbourAge(day('2026-04-01'), undefined)).toBeUndefined()
    expect(
      getNeighbourAge(day('2026-04-01'), day('2026-04-01')),
    ).toBeUndefined()
  })
})
