/**
 * Matching over the notes search index (`/notes-search.json`).
 *
 * Shared by the build, which writes the index, and by the two client scripts
 * that read it: the Notes search field and the 404 suggestions. Keep it free
 * of `astro:content` and of anything else that cannot run in a browser.
 */
import type { OutlineItem } from '@/lib/outline'

/** One heading of a note, with the anchor its page renders for it. */
export interface SearchSection {
  readonly slug: string
  readonly text: string
}

export interface SearchRow {
  readonly title: string
  readonly summary: string
  readonly kind: string
  readonly kindLabel: string
  readonly topics: readonly string[]
  readonly path: string
  readonly minutes: number
  readonly date: string
  readonly sections: readonly SearchSection[]
}

export interface SearchHit {
  readonly row: SearchRow
  /** Set when only a heading matched: the hit then links to that section. */
  readonly section?: SearchSection
  readonly href: string
}

/**
 * The sections a note's page lists in its outline, so a heading hit links to
 * an anchor that exists. Built from the same `buildEntryOutline` result as the
 * page's own index; the section numbers are display only and are dropped.
 */
export const toSearchSections = (
  outline: readonly OutlineItem[],
): SearchSection[] => outline.map(({ slug, text }) => ({ slug, text }))

/** Lowercase, without accents: "Diseño" and "diseno" are the same query. */
export const normalize = (value: string): string =>
  value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

const toWords = (query: string): string[] =>
  normalize(query).split(/\s+/).filter(Boolean)

const matchesAll = (haystack: string, words: readonly string[]): boolean => {
  const text = normalize(haystack)
  return words.every((word) => text.includes(word))
}

/**
 * Every word of the query appears in `text`, accents and case ignored. The
 * one matching rule: the filter jump rows use it as the notes do.
 */
export const matchesQuery = (text: string, query: string): boolean =>
  matchesAll(text, toWords(query))

/**
 * Every word of the query has to match. A note whose title, summary, type or
 * topics match comes first and links to the note; a note that only matches in
 * a heading follows and links straight to that heading. One hit per note, so
 * the count is a count of notes.
 */
export const searchNotes = (
  rows: readonly SearchRow[],
  query: string,
): SearchHit[] => {
  const words = toWords(query)
  if (words.length === 0) return []

  const byMetadata: SearchHit[] = []
  const byHeading: SearchHit[] = []
  for (const row of rows) {
    const metadata = [row.title, row.summary, row.kindLabel, ...row.topics]
    if (matchesAll(metadata.join(' '), words)) {
      byMetadata.push({ row, href: row.path })
      continue
    }
    // The title counts too, so "android alarmmanager" still finds the heading.
    const section = row.sections.find((candidate) =>
      matchesAll(`${row.title} ${candidate.text}`, words),
    )
    if (section) {
      byHeading.push({ row, section, href: `${row.path}#${section.slug}` })
    }
  }
  return [...byMetadata, ...byHeading]
}

/** Path segments that name a section or a locale, not a subject. */
const GENERIC_SEGMENTS = new Set([
  'es',
  'en',
  'notes',
  'note',
  'blog',
  'projects',
  'project',
  'photos',
  'tools',
  'work',
  'lab',
  'gallery',
  'type',
  'topic',
  'index',
  'html',
  'page',
])

const decode = (pathname: string): string => {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}

const splitWords = (value: string): string[] =>
  normalize(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

/**
 * The notes closest to a path that does not exist — a legacy `/blog/<slug>`,
 * a mistyped slug, a truncated link. Scored by the words the path shares with
 * each note's slug and title: a whole word counts double, a word the path cuts
 * short counts once. Generic segments ("notes", "es") score nothing, so a bare
 * section path suggests nothing rather than everything.
 */
export const suggestNotesForPath = (
  pathname: string,
  rows: readonly SearchRow[],
  limit = 3,
): SearchRow[] => {
  const tokens = [
    ...new Set(
      splitWords(decode(pathname)).filter(
        (token) => token.length >= 3 && !GENERIC_SEGMENTS.has(token),
      ),
    ),
  ]
  if (tokens.length === 0) return []

  return rows
    .map((row, order) => {
      const words = new Set(splitWords(`${row.path} ${row.title}`))
      const score = tokens.reduce((total, token) => {
        if (words.has(token)) return total + 2
        const partial =
          token.length >= 4 && [...words].some((word) => word.startsWith(token))
        return partial ? total + 1 : total
      }, 0)
      return { row, order, score }
    })
    .filter(({ score }) => score > 0)
    .toSorted(
      (left, right) => right.score - left.score || left.order - right.order,
    )
    .slice(0, limit)
    .map(({ row }) => row)
}
