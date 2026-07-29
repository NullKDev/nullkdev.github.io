import type { APIRoute } from 'astro'
import type { CollectionEntry } from 'astro:content'
import { getTopicLabel } from '@/data/taxonomy'
import { getArchiveLabel } from '@/i18n/archive'
import { getArchiveEntries, getEntryPath } from '@/lib/content'
import {
  getAvailableKinds,
  getAvailableTopics,
  getNotesMeta,
} from '@/lib/notes'
import { getLocalizedPath, type Locale } from '@/i18n'

/**
 * Every published note in one small document, so search covers the whole
 * collection rather than the page the reader happens to be on. Emitted per
 * locale; the client fetches it once, on first keystroke.
 */
export const buildNotesSearchIndex = async (locale: Locale) => {
  const entries = (await getArchiveEntries(
    'notes',
    locale,
  )) as CollectionEntry<'notes'>[]
  const meta = await getNotesMeta(entries)
  const base = getLocalizedPath('/notes', locale)

  // Typing a subject should offer the dedicated view for it, not just the
  // entries that mention it — that page is linkable, paginated, and is where
  // someone browsing a topic actually wants to end up.
  const filters = [
    ...getAvailableKinds(entries).map((kind) => ({
      label: getArchiveLabel('noteKindPlural', kind, locale),
      count: entries.filter((entry) => entry.data.kind === kind).length,
      path: `${base}/type/${kind}/`,
    })),
    ...getAvailableTopics(entries).map(({ id, count }) => ({
      label: getTopicLabel(id, locale),
      count,
      path: `${base}/topic/${id}/`,
    })),
  ]

  const rows = entries.map((entry) => ({
    title: entry.data.title,
    summary: entry.data.summary,
    kind: entry.data.kind,
    kindLabel: getArchiveLabel('noteKind', entry.data.kind, locale),
    topics: entry.data.topics.map((topic) => getTopicLabel(topic, locale)),
    path: getEntryPath(entry),
    minutes: meta[entry.id]?.minutes ?? 1,
    date:
      entry.data.publishedAt?.toLocaleDateString(locale, {
        month: 'short',
        year: 'numeric',
      }) ?? '',
  }))

  return { entries: rows, filters }
}

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildNotesSearchIndex('en')), {
    headers: { 'Content-Type': 'application/json' },
  })
