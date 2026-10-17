import { describe, expect, it } from 'vitest'

import {
  searchNotes,
  suggestNotesForPath,
  toSearchSections,
  type SearchRow,
} from '@/lib/notes-search'
import type { OutlineItem } from '@/lib/outline'
import { getFeedCopy, getFeedPath } from '@/lib/rss'

const row = (overrides: Partial<SearchRow>): SearchRow => ({
  title: 'Untitled',
  summary: '',
  kind: 'article',
  kindLabel: 'Article',
  topics: [],
  path: '/notes/untitled/',
  minutes: 1,
  date: 'Jan 2026',
  sections: [],
  ...overrides,
})

describe('toSearchSections', () => {
  it('keeps every outline anchor and its text, numbering dropped', () => {
    const outline: OutlineItem[] = [
      { slug: 'intro', text: 'Intro', level: 1, number: '01' },
      { slug: 'alarmmanager', text: 'AlarmManager', level: 2 },
      { slug: 'part-1', text: 'Part one', level: 1, part: true, minutes: 4 },
    ]
    expect(toSearchSections(outline)).toEqual([
      { slug: 'intro', text: 'Intro' },
      { slug: 'alarmmanager', text: 'AlarmManager' },
      { slug: 'part-1', text: 'Part one' },
    ])
  })
})

describe('searchNotes', () => {
  const rows = [
    row({
      title: 'Android 17 beta 3',
      path: '/notes/android-17-beta-3/',
      sections: [
        { slug: 'whats-new', text: "What's new" },
        { slug: 'alarmmanager', text: 'AlarmManager' },
      ],
    }),
    row({
      title: 'Compose remote',
      summary: 'Server-driven UI over AlarmManager-free transport',
      path: '/notes/compose-remote/',
      sections: [{ slug: 'alarmmanager-notes', text: 'AlarmManager notes' }],
    }),
    row({ title: 'Unrelated', path: '/notes/unrelated/' }),
  ]

  it('finds a note by a heading and links straight to its anchor', () => {
    const hits = searchNotes(rows, 'alarmmanager')
    const beta = hits.find((hit) => hit.row.path.includes('android-17'))
    expect(beta?.section).toEqual({
      slug: 'alarmmanager',
      text: 'AlarmManager',
    })
    expect(beta?.href).toBe('/notes/android-17-beta-3/#alarmmanager')
  })

  it('ranks metadata matches before heading-only matches, one hit per note', () => {
    const hits = searchNotes(rows, 'AlarmManager')
    expect(hits.map((hit) => hit.row.path)).toEqual([
      '/notes/compose-remote/',
      '/notes/android-17-beta-3/',
    ])
    // A metadata match links to the note itself, not a section.
    expect(hits[0].section).toBeUndefined()
    expect(hits[0].href).toBe('/notes/compose-remote/')
  })

  it('ignores case and accents', () => {
    const accented = [row({ title: 'Diseño de interacción', path: '/es/a/' })]
    expect(searchNotes(accented, 'diseno INTERACCION')).toHaveLength(1)
  })

  it('requires every word of the query to match', () => {
    expect(searchNotes(rows, 'android nothing')).toEqual([])
  })

  it('returns nothing for a blank query', () => {
    expect(searchNotes(rows, '   ')).toEqual([])
  })
})

describe('suggestNotesForPath', () => {
  const rows = [
    row({ title: 'Android 17 beta 3', path: '/notes/android-17-beta-3/' }),
    row({ title: 'Compose Remote', path: '/notes/compose-remote/' }),
    row({
      title: 'GoF patterns on Android',
      path: '/notes/gof-patterns-android/',
    }),
    row({ title: 'Pretext text layout', path: '/notes/pretext-text-layout/' }),
  ]

  it('maps a legacy or mistyped path to the closest notes', () => {
    const paths = suggestNotesForPath('/blog/compose-remote', rows).map(
      (hit) => hit.path,
    )
    expect(paths[0]).toBe('/notes/compose-remote/')
  })

  it('ranks by shared words in slug and title', () => {
    const paths = suggestNotesForPath('/notes/android-beta/', rows).map(
      (hit) => hit.path,
    )
    expect(paths[0]).toBe('/notes/android-17-beta-3/')
    expect(paths).toContain('/notes/gof-patterns-android/')
  })

  it('tolerates a truncated word', () => {
    const paths = suggestNotesForPath('/notes/pretex', rows).map(
      (hit) => hit.path,
    )
    expect(paths).toEqual(['/notes/pretext-text-layout/'])
  })

  it('returns nothing when no word is shared or the path is generic', () => {
    expect(suggestNotesForPath('/es/notes/', rows)).toEqual([])
    expect(suggestNotesForPath('/zzz-qqq', rows)).toEqual([])
  })

  it('caps the list', () => {
    expect(
      suggestNotesForPath('/android-compose-gof-pretext', rows, 2),
    ).toHaveLength(2)
  })
})

describe('getFeedPath', () => {
  it('gives each locale its own feed', () => {
    expect(getFeedPath('en')).toBe('/rss.xml')
    expect(getFeedPath('es')).toBe('/es/rss.xml')
  })

  it('names each feed in its own language', () => {
    expect(getFeedCopy('en')).toEqual({
      title: 'CarlosDev Notes',
      description: 'Research notes, articles, and papers from CarlosDev.',
      language: 'en',
    })
    expect(getFeedCopy('es').title).toBe('Notas de CarlosDev')
    expect(getFeedCopy('es').language).toBe('es')
  })
})
