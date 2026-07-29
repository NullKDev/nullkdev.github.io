import type { CollectionEntry } from 'astro:content'

type NoteEntry = CollectionEntry<'notes'>

/**
 * The order types appear in the filter bar. Fixed rather than derived from
 * counts, so the bar does not reshuffle as the archive grows.
 */
export const noteKinds = [
  'article',
  'note',
  'guide',
  'paper',
  'decision',
  'reference',
] as const

export type NoteKind = (typeof noteKinds)[number]

/** Entries per page. One number, used by every notes route. */
export const NOTES_PER_PAGE = 8

export const getReadingMinutes = (
  bodies: readonly (string | undefined)[],
): number => {
  const words = bodies.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/**
 * Per-entry index data derived in one pass: reading time counting subposts,
 * and the real titles of those subposts. A four-part series is not a
 * two-minute read, and a manual should list what it covers by title rather
 * than by slug. The documents collection is read once for the whole page.
 */
export const getNotesMeta = async (
  entries: readonly NoteEntry[],
): Promise<Record<string, { minutes: number; parts: string[] }>> => {
  const { getCollection } = await import('astro:content')
  const documents = await getCollection('documents')
  const byParent = new Map<
    string,
    { order: number; title: string; body: string }[]
  >()
  for (const document of documents) {
    if (document.data.visibility !== 'public') continue
    const list = byParent.get(document.data.parentId) ?? []
    list.push({
      order: document.data.order,
      title: document.data.title,
      body: document.body ?? '',
    })
    byParent.set(document.data.parentId, list)
  }
  return Object.fromEntries(
    entries.map((entry) => {
      const parts = (byParent.get(entry.data.entryId) ?? []).toSorted(
        (left, right) => left.order - right.order,
      )
      return [
        entry.id,
        {
          minutes: getReadingMinutes([
            entry.body,
            ...parts.map((part) => part.body),
          ]),
          parts: parts.map((part) => part.title),
        },
      ]
    }),
  )
}

export const countByKind = (
  entries: readonly NoteEntry[],
): Record<string, number> => {
  const counts: Record<string, number> = {}
  for (const entry of entries) {
    counts[entry.data.kind] = (counts[entry.data.kind] ?? 0) + 1
  }
  return counts
}

/**
 * Which kinds get a tab. A type with no entries would be a dead filter, and
 * PRODUCT.md rules out controls that lead nowhere.
 */
export const getAvailableKinds = (
  entries: readonly NoteEntry[],
): NoteKind[] => {
  const counts = countByKind(entries)
  return noteKinds.filter((kind) => (counts[kind] ?? 0) > 0)
}

/** Resolve `supersededBy` to the entry that replaced this one, if published. */
export const getSupersededBy = (
  entry: NoteEntry,
  pool: readonly NoteEntry[],
): NoteEntry | undefined =>
  entry.data.supersededBy
    ? pool.find(
        (candidate) =>
          candidate.data.translationKey === entry.data.supersededBy ||
          candidate.data.entryId === entry.data.supersededBy,
      )
    : undefined

/**
 * Topics that actually appear in the collection, most used first. Only these
 * get a route, so a topic link is never a page that does not exist.
 */
export const getAvailableTopics = (
  entries: readonly NoteEntry[],
): { id: string; count: number }[] => {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    for (const topic of new Set(entry.data.topics)) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort(
      (left, right) =>
        right.count - left.count || left.id.localeCompare(right.id),
    )
}
