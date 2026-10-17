import type { CollectionEntry } from 'astro:content'

import { getSeriesTitle } from '@/data/series'
import type { Locale } from '@/i18n'

type NoteEntry = CollectionEntry<'notes'>

/**
 * "Part" and "series" mean two different things here, and each label says only
 * one of them:
 *
 * - a **part** is a subpost rendered inside its entry (`documents`);
 * - a **series** is a run of separate notes sharing `series.id`.
 *
 * A count of one is not information, so neither is announced when there is
 * only one: "Part 1 / 1" and "Series of 1 part" said nothing.
 */
export interface SeriesPosition {
  readonly id: string
  readonly title: string
  readonly order: number
  readonly total: number
}

/**
 * Where a note sits in its series, or `undefined` when there is no run.
 *
 * `order` is the note's place among the siblings that exist in its language,
 * not the raw `series.order`: a series written out of order (orders 2, 5, 7
 * published, the rest still drafts) read "Part 7 of 3".
 */
export const getSeriesPosition = (
  entry: NoteEntry,
  pool: readonly NoteEntry[],
  locale: Locale,
): SeriesPosition | undefined => {
  const membership = entry.data.series
  if (!membership) return undefined
  const title = getSeriesTitle(membership.id, locale)
  const siblings = pool
    .filter(
      (candidate) =>
        candidate.data.series?.id === membership.id &&
        candidate.data.locale === entry.data.locale,
    )
    .map((candidate) => candidate.data.series?.order ?? 0)
    .sort((a, b) => a - b)
  if (!title || siblings.length < 2) return undefined
  return {
    id: membership.id,
    title,
    order: siblings.indexOf(membership.order) + 1,
    total: siblings.length,
  }
}

/** `Part {order} of {total}` → "Part 2 of 3". */
export const formatPartOf = (
  template: string,
  order: number,
  total: number,
): string =>
  template.replace('{order}', String(order)).replace('{total}', String(total))

/** `{count} parts` → "4 parts"; nothing for one part or none. */
export const formatPartCount = (
  template: string,
  count: number,
): string | undefined =>
  count > 1 ? template.replace('{count}', String(count)) : undefined
