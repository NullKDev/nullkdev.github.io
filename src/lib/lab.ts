import type { CollectionEntry } from 'astro:content'
import { getTopicLabel } from '@/data/taxonomy'
import type { Locale } from '@/i18n'

type LabEntry = CollectionEntry<'lab'>

/** Execution maps onto the same tone vocabulary the status chips use. */
export type ExecutionTone = 'live' | 'progress' | 'neutral'

export const getExecutionTone = (execution: string): ExecutionTone =>
  execution === 'local'
    ? 'live'
    : execution === 'third-party-network'
      ? 'progress'
      : 'neutral'

/**
 * The hosts an entry actually contacts, read from `sendsDataTo` so the page
 * can never claim "nothing leaves your browser" while requests do.
 */
export const getDataHosts = (urls: readonly string[]): string[] => {
  const hosts = new Set<string>()
  for (const url of urls) {
    try {
      hosts.add(new URL(url).hostname)
    } catch {
      // A malformed URL is dropped rather than printed raw.
    }
  }
  return [...hosts].sort()
}

/** Binary-prefixed size, so a model weight reads the way a download does. */
export const formatBytes = (bytes: number, locale: Locale): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  const formatted = value.toLocaleString(locale, {
    maximumFractionDigits: value < 10 && unit > 0 ? 1 : 0,
  })
  return `${formatted} ${units[unit]}`
}

export const getTotalDownloadBytes = (
  downloads: readonly { bytes: number }[],
): number => downloads.reduce((total, item) => total + item.bytes, 0)

/**
 * Neighbours are derived from shared technologies and topics — with thousands
 * of entries, a curated "see also" list is not maintainable.
 */
export const getRelatedLabEntries = (
  entry: LabEntry,
  pool: readonly LabEntry[],
  limit = 3,
): LabEntry[] => {
  const own = new Set([...entry.data.technologies, ...entry.data.topics])
  return pool
    .filter((candidate) => candidate.id !== entry.id)
    .map((candidate) => ({
      candidate,
      shared: [...candidate.data.technologies, ...candidate.data.topics].filter(
        (tag) => own.has(tag),
      ).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort(
      (left, right) =>
        right.shared - left.shared ||
        left.candidate.data.title.localeCompare(right.candidate.data.title),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

/**
 * A tag on 85% or more of the listed entries is not a filter: choosing it
 * hides at most one or two entries, so the button promises a narrowing it
 * cannot deliver. `developer-tools` on 8 of 8 tools and `web` on 7 of 8 were
 * exactly that. For the same reason the listing's cards leave them out too —
 * a chip on every card distinguishes none. They stay on the records.
 */
export const FACET_COVERAGE_LIMIT = 0.85

export interface LabFacet {
  readonly id: string
  readonly count: number
  readonly label: string
}

/**
 * Every tag an entry carries, technologies and topics, once each. The filter
 * matches on this set, so the facet counts are counted on it too.
 */
export const getLabTags = (entry: LabEntry): string[] => [
  ...new Set([...entry.data.technologies, ...entry.data.topics]),
]

const countLabTags = (entries: readonly LabEntry[]): Map<string, number> => {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    for (const tag of getLabTags(entry)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return counts
}

const isUbiquitous = (count: number, total: number): boolean =>
  count / total >= FACET_COVERAGE_LIMIT

/** Tags on so many of the listed entries that they narrow nothing. */
export const getUbiquitousLabTags = (
  entries: readonly LabEntry[],
): Set<string> =>
  new Set(
    [...countLabTags(entries)]
      .filter(([, count]) => isUbiquitous(count, entries.length))
      .map(([id]) => id),
  )

/**
 * Filter facets derived from the records: each entry counts once per tag it
 * carries. Most used first, then by label.
 */
export const getLabFacets = (
  entries: readonly LabEntry[],
  locale: Locale,
): LabFacet[] =>
  [...countLabTags(entries)]
    .filter(([, count]) => !isUbiquitous(count, entries.length))
    .map(([id, count]) => ({ id, count, label: getTopicLabel(id, locale) }))
    .sort(
      (left, right) =>
        right.count - left.count ||
        left.label.localeCompare(right.label, locale),
    )

/**
 * The chips on a listing card. Technologies are the point when they exist;
 * topics stand in for the smaller entries that only carry subject tags. Tags
 * the listing finds on nearly every entry are left out, as in the filter bar.
 */
export const getLabCardTags = (
  entry: LabEntry,
  ubiquitous: ReadonlySet<string>,
  limit = 3,
): string[] =>
  (entry.data.technologies.length ? entry.data.technologies : entry.data.topics)
    .filter((tag) => !ubiquitous.has(tag))
    .slice(0, limit)
