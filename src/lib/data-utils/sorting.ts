/**
 * Sorting utilities for data-utils
 * Extracted from data-utils.ts for better organization
 */

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDateDesc<T extends { data: { date: Date } }>(
  a: T,
  b: T,
): number {
  return b.data.date.valueOf() - a.data.date.valueOf()
}

/**
 * Sort posts by date (oldest first)
 */
export function sortPostsByDateAsc<T extends { data: { date: Date } }>(
  a: T,
  b: T,
): number {
  return a.data.date.valueOf() - b.data.date.valueOf()
}

/**
 * Sort projects by endDate (newest first, ongoing last)
 */
export function sortProjectsByEndDateDesc<
  T extends { data: { endDate?: Date | null; startDate?: Date } },
>(a: T, b: T): number {
  // Ongoing (no endDate) goes to the top
  if (!a.data.endDate && b.data.endDate) return -1
  if (a.data.endDate && !b.data.endDate) return 1
  if (!a.data.endDate && !b.data.endDate) return 0

  return (b.data.endDate?.valueOf() ?? 0) - (a.data.endDate?.valueOf() ?? 0)
}

/**
 * Sort photos by date (newest first)
 */
export function sortPhotosByDateDesc<T extends { data: { date?: Date } }>(
  a: T,
  b: T,
): number {
  const dateA = a.data.date ? new Date(a.data.date).getTime() : 0
  const dateB = b.data.date ? new Date(b.data.date).getTime() : 0
  return dateB - dateA
}

/**
 * Sort tags alphabetically with count
 */
export function sortTagsByCount<T extends string>(
  tagCounts: Map<T, number>,
): { tag: T; count: number }[] {
  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

/**
 * Sort subposts by date and order
 */
export function sortSubposts<T extends { data: { date: Date; order?: number } }>(
  a: T,
  b: T,
): number {
  const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
  if (dateDiff !== 0) return dateDiff

  const orderA = a.data.order ?? 0
  const orderB = b.data.order ?? 0
  return orderA - orderB
}