import { describe, expect, it } from 'vitest'

import { sortFeedEntries } from '@/lib/rss'

describe('RSS ordering', () => {
  it('sorts independently by published or updated date descending', () => {
    const entries = [
      { data: { publishedAt: new Date('2026-01-01') } },
      { data: { updatedAt: new Date('2026-07-01') } },
      { data: { publishedAt: new Date('2026-03-01') } },
    ]

    expect(sortFeedEntries(entries)).toEqual([
      entries[1],
      entries[2],
      entries[0],
    ])
  })

  it('rejects feed entries without a real date', () => {
    expect(() => sortFeedEntries([{ data: {} }])).toThrow(
      'RSS entries require a publishedAt or updatedAt date',
    )
  })
})
