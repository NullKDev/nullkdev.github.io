/**
 * Translation and locale utilities for data-utils
 * Extracted from data-utils.ts for better organization
 */

/**
 * Get the parent ID from a subpost/subproject ID
 * E.g., "android-17-beta-3" → "android-17-beta-3"
 * E.g., "android-17-beta-3/part-1" → "android-17-beta-3"
 */
export function getParentId(subpostId: string): string {
  return subpostId.split('/')[0]
}

/**
 * Check if an ID represents a subpost/subproject
 */
export function isSubpost(postId: string): boolean {
  return postId.includes('/')
}

/**
 * Get the base slug by removing locale suffix
 * Handles both Astro 5 format ('sluges' → 'slug') and legacy dot format ('slug.es' → 'slug')
 *
 * @param postId - The content ID
 * @param lang - Optional language hint for disambiguation
 */
export function getBaseSlug(postId: string, lang?: string): string {
  const parts = postId.split('/')
  const root = parts[0]

  if (lang && lang !== 'en') {
    const dotLang = '.' + lang
    if (root.endsWith(dotLang)) {
      // Legacy dot format: 'compose-remote.es' → 'compose-remote'
      parts[0] = root.slice(0, -dotLang.length)
      return parts.join('/')
    }
    if (root.endsWith(lang)) {
      // Astro 5 format (dots stripped): 'compose-remotees' → 'compose-remote'
      parts[0] = root.slice(0, -lang.length)
      return parts.join('/')
    }
  }

  // Legacy dot format fallback (no lang passed): 'slug.es' → 'slug'
  parts[0] = root.replace(/\.\w{2}$/, '')
  return parts.join('/')
}

/**
 * Get the locale-specific ID for a translated post
 * E.g., "android-17" + "es" → "android-17es"
 */
export function getLocaleId(postId: string, locale: string): string {
  const parts = postId.split('/')
  parts[0] = getBaseSlug(parts[0]) + locale
  return parts.join('/')
}

/**
 * Build the correct URL for a post given its ID and target locale
 */
export function getPostUrlByLocale(
  postId: string,
  locale: 'en' | 'es',
): string {
  const baseSlug = getBaseSlug(postId, locale)
  return locale === 'es' ? `/es/blog/${baseSlug}` : `/blog/${baseSlug}`
}

/**
 * Build the correct URL for a project given its ID and target locale
 */
export function getProjectUrlByLocale(
  projectId: string,
  locale: 'en' | 'es',
): string {
  const baseSlug = getBaseSlug(projectId, locale)
  return locale === 'es' ? `/es/projects/${baseSlug}` : `/projects/${baseSlug}`
}

/**
 * Build the correct URL for a photo given its ID and target locale
 */
export function getPhotoUrlByLocale(
  photoId: string,
  locale: 'en' | 'es',
): string {
  const baseSlug = getBaseSlug(photoId, locale)
  return locale === 'es' ? `/es/photos/${baseSlug}` : `/photos/${baseSlug}`
}

/**
 * Check if a post has a translation in the given locale
 */
export async function hasTranslation(
  postId: string,
  allPosts: { id: string }[],
  locale: string,
): Promise<boolean> {
  const translatedId = getLocaleId(postId, locale)
  return allPosts.some((p) => p.id === translatedId)
}