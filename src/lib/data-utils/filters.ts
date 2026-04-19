/**
 * Filter utilities for data-utils
 * Extracted from data-utils.ts for better organization
 */

/**
 * Filter posts by locale (exclude drafts by default)
 */
export function filterPostsByLocale(
  items: { data: { draft?: boolean; lang: string } }[],
  locale: string,
): typeof items {
  return items.filter((item) => !item.data.draft && item.data.lang === locale) as typeof items
}

/**
 * Filter posts by locale including drafts
 */
export function filterPostsByLocaleWithDrafts(
  items: { data: { lang: string } }[],
  locale: string,
): typeof items {
  return items.filter((item) => item.data.lang === locale) as typeof items
}

/**
 * Filter projects by locale (exclude drafts by default)
 */
export function filterProjectsByLocale(
  items: { data: { lang: string } }[],
  locale: string,
): typeof items {
  return items.filter((item) => item.data.lang === locale) as typeof items
}

/**
 * Filter photos by locale
 */
export function filterPhotosByLocale(
  items: { data: { lang: string } }[],
  locale: string,
): typeof items {
  return items.filter((item) => item.data.lang === locale) as typeof items
}

/**
 * Filter out subposts (parent posts only)
 */
export function filterParents(items: { id: string }[]): typeof items {
  return items.filter((item) => !item.id.includes('/')) as typeof items
}

/**
 * Filter subposts for a specific parent
 */
export function filterSubpostsForParent(
  items: { id: string }[],
  parentId: string,
): typeof items {
  return items.filter((item) => {
    const segments = item.id.split('/')
    return segments[0] === parentId
  }) as typeof items
}

/**
 * Filter posts by author
 */
export function filterByAuthor(
  items: { data: { authors?: string[] } }[],
  authorId: string,
): typeof items {
  return items.filter((item) => item.data.authors?.includes(authorId)) as typeof items
}

/**
 * Filter posts by tag
 */
export function filterByTag(
  items: { data: { tags?: string[] } }[],
  tag: string,
): typeof items {
  const normalizedTag = tag.toLowerCase()
  return items.filter((item) =>
    item.data.tags?.map((t) => t.toLowerCase()).includes(normalizedTag),
  ) as typeof items
}

/**
 * Filter published posts only (exclude drafts)
 */
export function filterPublished(items: { data: { draft?: boolean } }[]): typeof items {
  return items.filter((item) => !item.data.draft) as typeof items
}

/**
 * Filter posts that match any tag
 */
export function filterByAnyTag(
  items: { data: { tags?: string[] } }[],
  tags: string[],
): typeof items {
  return items.filter((item) =>
    tags.some((tag) =>
      item.data.tags?.map((t) => t.toLowerCase()).includes(tag.toLowerCase()),
    ),
  ) as typeof items
}