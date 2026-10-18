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
 * Which way in time a pager neighbour lies. The archive order ranks featured
 * notes first, so "the next one in the list" is not necessarily older; the
 * label is derived from the dates instead, and makes no claim without two
 * distinct ones.
 */
export const getNeighbourAge = (
  current: Date | undefined,
  neighbour: Date | undefined,
): 'newer' | 'older' | undefined => {
  if (!current || !neighbour) return undefined
  const difference = neighbour.getTime() - current.getTime()
  if (difference === 0) return undefined
  return difference > 0 ? 'newer' : 'older'
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

/** The axis a Notes index is filtered on, if any. Topic wins, as in routing. */
export interface NotesView {
  readonly kind?: string
  readonly topic?: string
}

/** One place that knows how a Notes URL is built, for every axis. */
export const getNotesViewPath = (base: string, { kind, topic }: NotesView) =>
  topic
    ? `${base}/topic/${topic}/`
    : kind
      ? `${base}/type/${kind}/`
      : `${base}/`

/** Page 1 is the view itself; Astro serves later pages one level down. */
export const getNotesPagePath = (viewPath: string, page: number) =>
  page === 1 ? viewPath : `${viewPath}${page}/`

const inView = (entry: NoteEntry, { kind, topic }: NotesView) =>
  topic
    ? entry.data.topics.includes(topic)
    : kind
      ? entry.data.kind === kind
      : true

/**
 * The other locale's version of one Notes index page.
 *
 * Two answers, because they are two questions. `switchPath` is where the
 * language switch goes, and a fallback is fine there. `alternatePath` is the
 * same page in the other language — same filter, same page number — and it is
 * `undefined` unless the other locale actually builds it, because an hreflang
 * that names a different page is a one-way annotation search engines discard.
 *
 * Page counts mirror the routes: a filter is routed only when it has entries,
 * while the unfiltered index always builds page 1, even when empty.
 */
export const resolveNotesCounterpart = ({
  otherEntries,
  otherBase,
  page,
  ...view
}: NotesView & {
  readonly otherEntries: readonly NoteEntry[]
  /** `/notes` or `/es/notes`, without the trailing slash. */
  readonly otherBase: string
  readonly page: number
}): { alternatePath: string | undefined; switchPath: string } => {
  const filtered = Boolean(view.topic || view.kind)
  const matching = otherEntries.filter((entry) => inView(entry, view)).length
  const pages = Math.ceil(matching / NOTES_PER_PAGE)
  const built = filtered ? pages : Math.max(1, pages)
  const viewPath = getNotesViewPath(otherBase, view)
  if (built === 0) {
    return { alternatePath: undefined, switchPath: `${otherBase}/` }
  }
  if (page > built) return { alternatePath: undefined, switchPath: viewPath }
  const alternatePath = getNotesPagePath(viewPath, page)
  return { alternatePath, switchPath: alternatePath }
}
