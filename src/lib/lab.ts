import type { CollectionEntry } from 'astro:content'
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
