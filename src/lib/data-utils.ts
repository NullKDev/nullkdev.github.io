import { getCollection, render, type CollectionEntry } from 'astro:content'
import { readingTime, calculateWordCountFromHtml } from '@/lib/utils'

export async function getAllPhotos(): Promise<CollectionEntry<'photos'>[]> {
  const photos = await getCollection('photos')
  return photos
    .filter((p) => p.data.lang !== 'es')
    .sort((a, b) => {
      const dateA = a.data.date ? new Date(a.data.date).getTime() : 0
      const dateB = b.data.date ? new Date(b.data.date).getTime() : 0
      return dateB - dateA
    })
}

export async function getAllEsPhotos(): Promise<CollectionEntry<'photos'>[]> {
  const photos = await getCollection('photos')
  return photos
    .filter((p) => p.data.lang === 'es')
    .sort((a, b) => {
      const dateA = a.data.date ? new Date(a.data.date).getTime() : 0
      const dateB = b.data.date ? new Date(b.data.date).getTime() : 0
      return dateB - dateA
    })
}

export function getPhotoUrl(
  photoId: string,
  locale: 'en' | 'es' = 'en',
): string {
  const baseSlug = getBaseSlug(photoId, locale)
  return locale === 'es' ? `/es/photos/${baseSlug}` : `/photos/${baseSlug}`
}

export async function hasPhotoTranslation(
  photoId: string,
  locale: string,
): Promise<boolean> {
  const esId = getLocaleId(photoId, locale)
  const all = await getCollection('photos')
  return all.some((p) => p.id === esId)
}

export async function getAlbumImages(albumId: string, lang?: string) {
  const allImages = import.meta.glob<{ default: ImageMetadata }>(
    '/src/content/photos/**/*.{jpeg,jpg,png,webp,avif}',
  )
  // ES albums share images with the EN album — strip locale suffix to get the EN folder
  const resolvedAlbumId = getBaseSlug(albumId, lang)
  const albumImages = Object.entries(allImages).filter(([path]) => {
    return path.includes(`/${resolvedAlbumId}/assets/`)
  })
  const resolvedImages = await Promise.all(
    albumImages.map(async ([path, loader]) => {
      const mod = await loader()
      return {
        src: mod.default,
        fileName: path.split('/').pop(),
      }
    }),
  )
  //resolvedImages.sort(() => Math.random() - 0.5);
  return resolvedImages
}

export async function getAlbumCount() {
  const allImages = import.meta.glob(
    '/src/content/photos/**/assets/*.{jpeg,jpg,png,webp,avif}',
  )
  const stats: Record<string, number> = {}
  Object.keys(allImages).forEach((path) => {
    const match = path.match(/\/photos\/([^\/]+)\/assets\//)
    if (match && match[1]) {
      const albumId = match[1]
      stats[albumId] = (stats[albumId] || 0) + 1
    }
  })
  return stats
}

export async function getAlbumsByTag(tag: string) {
  const allPhotos = await getAllPhotos()
  return allPhotos.filter((photo) =>
    photo.data.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()),
  )
}

export async function getAlbumsByAuthor(authorId: string) {
  const allPhotos = await getAllPhotos()
  return allPhotos.filter((photo) => photo.data.authors.includes(authorId))
}

export async function getAllAuthors(): Promise<CollectionEntry<'authors'>[]> {
  return await getCollection('authors')
}

export async function getAuthorById(
  authorId: string,
): Promise<CollectionEntry<'authors'> | null> {
  const allAuthors = await getAllAuthors()
  return allAuthors.find((author) => author.id === authorId) || null
}

export async function getAllPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog')
  return posts
    .filter(
      (post) =>
        !post.data.draft && !isSubpost(post.id) && post.data.lang !== 'es',
    )
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getAllPostsAndSubposts(): Promise<
  CollectionEntry<'blog'>[]
> {
  const posts = await getCollection('blog')
  return posts
    .filter((post) => !post.data.draft && post.data.lang !== 'es')
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

// All ES translated posts (parent + subposts)
export async function getAllEsPostsAndSubposts(): Promise<
  CollectionEntry<'blog'>[]
> {
  const posts = await getCollection('blog')
  return posts
    .filter((post) => !post.data.draft && post.data.lang === 'es')
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

// ES parent posts only (no subposts, no drafts) — for listing pages
export async function getAllEsPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog')
  return posts
    .filter(
      (post) =>
        !post.data.draft && !isSubpost(post.id) && post.data.lang === 'es',
    )
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

// Generic locale-aware post functions (supports any locale, not just 'es')
export async function getPostsAndSubpostsByLocale(
  locale: string,
): Promise<CollectionEntry<'blog'>[]> {
  if (locale === 'en') return getAllPostsAndSubposts()
  const posts = await getCollection('blog')
  return posts
    .filter((p) => !p.data.draft && p.data.lang === locale)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getPostsByLocale(
  locale: string,
): Promise<CollectionEntry<'blog'>[]> {
  if (locale === 'en') return getAllPosts()
  const posts = await getCollection('blog')
  return posts
    .filter((p) => !p.data.draft && !isSubpost(p.id) && p.data.lang === locale)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

// Check if a post has a translation in the given locale
export async function hasTranslation(
  postId: string,
  locale: string,
): Promise<boolean> {
  const esId = getLocaleId(postId, locale)
  const allPosts = await getCollection('blog')
  return allPosts.some((p) => p.id === esId && !p.data.draft)
}

export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects')
  return projects
    .filter(
      (project) => !isSubProject(project.id) && project.data.lang !== 'es',
    )
    .sort((a, b) => {
      if (!a.data.endDate && b.data.endDate) return -1
      if (a.data.endDate && !b.data.endDate) return 1
      if (!a.data.endDate && !b.data.endDate) return 0
      return (b.data.endDate?.valueOf() ?? 0) - (a.data.endDate?.valueOf() ?? 0)
    })
}

export async function getAllProjectsAndSubProjects(): Promise<
  CollectionEntry<'projects'>[]
> {
  const projects = await getCollection('projects')
  return projects
    .filter((p) => p.data.lang !== 'es')
    .sort((a, b) => {
      if (!a.data.endDate && b.data.endDate) return -1
      if (a.data.endDate && !b.data.endDate) return 1
      if (!a.data.endDate && !b.data.endDate) return 0
      return (b.data.endDate?.valueOf() ?? 0) - (a.data.endDate?.valueOf() ?? 0)
    })
}

export async function getAllEsProjectsAndSubProjects(): Promise<
  CollectionEntry<'projects'>[]
> {
  const projects = await getCollection('projects')
  return projects
    .filter((p) => p.data.lang === 'es')
    .sort((a, b) => {
      if (!a.data.endDate && b.data.endDate) return -1
      if (a.data.endDate && !b.data.endDate) return 1
      if (!a.data.endDate && !b.data.endDate) return 0
      return (b.data.endDate?.valueOf() ?? 0) - (a.data.endDate?.valueOf() ?? 0)
    })
}

// ES parent projects only (no subprojects) — for listing pages
export async function getAllEsProjects(): Promise<
  CollectionEntry<'projects'>[]
> {
  const projects = await getCollection('projects')
  return projects
    .filter((p) => !isSubProject(p.id) && p.data.lang === 'es')
    .sort((a, b) => {
      if (!a.data.endDate && b.data.endDate) return -1
      if (a.data.endDate && !b.data.endDate) return 1
      if (!a.data.endDate && !b.data.endDate) return 0
      return (b.data.endDate?.valueOf() ?? 0) - (a.data.endDate?.valueOf() ?? 0)
    })
}

// Generic locale-aware project functions
export async function getProjectsAndSubProjectsByLocale(
  locale: string,
): Promise<CollectionEntry<'projects'>[]> {
  if (locale === 'en') return getAllProjectsAndSubProjects()
  const projects = await getCollection('projects')
  return projects
    .filter((p) => p.data.lang === locale)
    .sort((a, b) => {
      if (!a.data.endDate && b.data.endDate) return -1
      if (a.data.endDate && !b.data.endDate) return 1
      if (!a.data.endDate && !b.data.endDate) return 0
      return (b.data.endDate?.valueOf() ?? 0) - (a.data.endDate?.valueOf() ?? 0)
    })
}

export async function getProjectsByLocale(
  locale: string,
): Promise<CollectionEntry<'projects'>[]> {
  if (locale === 'en') return getAllProjects()
  const projects = await getCollection('projects')
  return projects
    .filter((p) => !isSubProject(p.id) && p.data.lang === locale)
    .sort((a, b) => {
      if (!a.data.endDate && b.data.endDate) return -1
      if (a.data.endDate && !b.data.endDate) return 1
      if (!a.data.endDate && !b.data.endDate) return 0
      return (b.data.endDate?.valueOf() ?? 0) - (a.data.endDate?.valueOf() ?? 0)
    })
}

export function getProjectUrl(
  projectId: string,
  locale: 'en' | 'es' = 'en',
): string {
  const baseSlug = getBaseSlug(projectId, locale)
  return locale === 'es' ? `/es/projects/${baseSlug}` : `/projects/${baseSlug}`
}

export async function getProjectByIdRaw(
  projectId: string,
): Promise<CollectionEntry<'projects'> | null> {
  const all = await getCollection('projects')
  return all.find((p) => p.id === projectId) ?? null
}

export async function hasProjectTranslation(
  projectId: string,
  locale: string,
): Promise<boolean> {
  const esId = getLocaleId(projectId, locale)
  const all = await getCollection('projects')
  return all.some((p) => p.id === esId)
}

// Generic locale-aware photo function
export async function getPhotosByLocale(
  locale: string,
): Promise<CollectionEntry<'photos'>[]> {
  if (locale === 'en') return getAllPhotos()
  const photos = await getCollection('photos')
  return photos
    .filter((p) => p.data.lang === locale)
    .sort((a, b) => {
      const dateA = a.data.date ? new Date(a.data.date).getTime() : 0
      const dateB = b.data.date ? new Date(b.data.date).getTime() : 0
      return dateB - dateA
    })
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPosts()
  const projects = await getAllProjects()

  var postTags = posts.reduce((acc, post) => {
    post.data.tags?.forEach((tag) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())

  var projectTags = projects.reduce((acc, project) => {
    project.data.tags?.forEach((tag) => {
      acc.set(tag, (acc.get(tag) || 0) + 1)
    })
    return acc
  }, new Map<string, number>())

  return new Map([...postTags, ...projectTags])
}

export async function getAdjacentPosts(currentId: string): Promise<{
  newer: CollectionEntry<'blog'> | null
  older: CollectionEntry<'blog'> | null
  parent: CollectionEntry<'blog'> | null
}> {
  const allPosts = await getAllPosts()

  if (isSubpost(currentId)) {
    const parentId = getParentId(currentId)
    const allPosts = await getAllPosts()
    const parent = allPosts.find((post) => post.id === parentId) || null

    const posts = await getCollection('blog')
    const subposts = posts
      .filter(
        (post) =>
          isSubpost(post.id) &&
          getParentId(post.id) === parentId &&
          !post.data.draft,
      )
      .sort((a, b) => {
        const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
        if (dateDiff !== 0) return dateDiff

        const orderA = a.data.order ?? 0
        const orderB = b.data.order ?? 0
        return orderA - orderB
      })

    const currentIndex = subposts.findIndex((post) => post.id === currentId)
    if (currentIndex === -1) {
      return { newer: null, older: null, parent }
    }

    return {
      newer:
        currentIndex < subposts.length - 1 ? subposts[currentIndex + 1] : null,
      older: currentIndex > 0 ? subposts[currentIndex - 1] : null,
      parent,
    }
  }

  const parentPosts = allPosts.filter((post) => !isSubpost(post.id))
  const currentIndex = parentPosts.findIndex((post) => post.id === currentId)

  if (currentIndex === -1) {
    return { newer: null, older: null, parent: null }
  }

  return {
    newer: currentIndex > 0 ? parentPosts[currentIndex - 1] : null,
    older:
      currentIndex < parentPosts.length - 1
        ? parentPosts[currentIndex + 1]
        : null,
    parent: null,
  }
}

export async function getAdjacentProjects(currentId: string): Promise<{
  newer: CollectionEntry<'projects'> | null
  older: CollectionEntry<'projects'> | null
  parent: CollectionEntry<'projects'> | null
}> {
  const allProjects = await getAllProjects()

  if (isSubpost(currentId)) {
    const parentId = getParentId(currentId)
    const allProjects = await getAllProjects()
    const parent =
      allProjects.find((project) => project.id === parentId) || null

    const projects = await getCollection('projects')
    const subprojects = projects
      .filter(
        (project) =>
          isSubpost(project.id) && getParentId(project.id) === parentId,
      )
      .sort((a, b) => {
        const dateDiff =
          (a.data.endDate?.valueOf() ?? -1) - (b.data.endDate?.valueOf() ?? 0)
        if (dateDiff !== 0) return dateDiff

        const orderA = a.data.order ?? 0
        const orderB = b.data.order ?? 0
        return orderA - orderB
      })

    const currentIndex = subprojects.findIndex(
      (project) => project.id === currentId,
    )
    if (currentIndex === -1) {
      return { newer: null, older: null, parent }
    }

    return {
      newer:
        currentIndex < subprojects.length - 1
          ? subprojects[currentIndex + 1]
          : null,
      older: currentIndex > 0 ? subprojects[currentIndex - 1] : null,
      parent,
    }
  }

  const parentProjects = allProjects.filter((project) => !isSubpost(project.id))
  const currentIndex = parentProjects.findIndex(
    (project) => project.id === currentId,
  )

  if (currentIndex === -1) {
    return { newer: null, older: null, parent: null }
  }

  return {
    newer: currentIndex > 0 ? parentProjects[currentIndex - 1] : null,
    older:
      currentIndex < parentProjects.length - 1
        ? parentProjects[currentIndex + 1]
        : null,
    parent: null,
  }
}

// Locale-aware adjacent posts (fixes EN-only bug in ES/other locale pages)
export async function getAdjacentPostsByLocale(
  currentId: string,
  locale: string,
): Promise<{
  newer: CollectionEntry<'blog'> | null
  older: CollectionEntry<'blog'> | null
  parent: CollectionEntry<'blog'> | null
}> {
  if (locale === 'en') return getAdjacentPosts(currentId)

  const allLocalePosts = await getPostsAndSubpostsByLocale(locale)

  if (isSubpost(currentId)) {
    const parentId = getParentId(currentId)
    const parent = allLocalePosts.find((p) => p.id === parentId) ?? null
    const subposts = allLocalePosts
      .filter((p) => isSubpost(p.id) && getParentId(p.id) === parentId)
      .sort((a, b) => {
        const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
        if (dateDiff !== 0) return dateDiff
        return (a.data.order ?? 0) - (b.data.order ?? 0)
      })
    const currentIndex = subposts.findIndex((p) => p.id === currentId)
    if (currentIndex === -1) return { newer: null, older: null, parent }
    return {
      newer:
        currentIndex < subposts.length - 1 ? subposts[currentIndex + 1] : null,
      older: currentIndex > 0 ? subposts[currentIndex - 1] : null,
      parent,
    }
  }

  const parentPosts = allLocalePosts.filter((p) => !isSubpost(p.id))
  const currentIndex = parentPosts.findIndex((p) => p.id === currentId)
  if (currentIndex === -1) return { newer: null, older: null, parent: null }
  return {
    newer: currentIndex > 0 ? parentPosts[currentIndex - 1] : null,
    older:
      currentIndex < parentPosts.length - 1
        ? parentPosts[currentIndex + 1]
        : null,
    parent: null,
  }
}

// Locale-aware adjacent projects
export async function getAdjacentProjectsByLocale(
  currentId: string,
  locale: string,
): Promise<{
  newer: CollectionEntry<'projects'> | null
  older: CollectionEntry<'projects'> | null
  parent: CollectionEntry<'projects'> | null
}> {
  if (locale === 'en') return getAdjacentProjects(currentId)

  const allLocaleProjects = await getProjectsAndSubProjectsByLocale(locale)

  if (isSubpost(currentId)) {
    const parentId = getParentId(currentId)
    const parent = allLocaleProjects.find((p) => p.id === parentId) ?? null
    const subprojects = allLocaleProjects
      .filter((p) => isSubpost(p.id) && getParentId(p.id) === parentId)
      .sort((a, b) => {
        const dateDiff =
          (a.data.endDate?.valueOf() ?? -1) - (b.data.endDate?.valueOf() ?? 0)
        if (dateDiff !== 0) return dateDiff
        return (a.data.order ?? 0) - (b.data.order ?? 0)
      })
    const currentIndex = subprojects.findIndex((p) => p.id === currentId)
    if (currentIndex === -1) return { newer: null, older: null, parent }
    return {
      newer:
        currentIndex < subprojects.length - 1
          ? subprojects[currentIndex + 1]
          : null,
      older: currentIndex > 0 ? subprojects[currentIndex - 1] : null,
      parent,
    }
  }

  const parentProjects = allLocaleProjects.filter((p) => !isSubpost(p.id))
  const currentIndex = parentProjects.findIndex((p) => p.id === currentId)
  if (currentIndex === -1) return { newer: null, older: null, parent: null }
  return {
    newer: currentIndex > 0 ? parentProjects[currentIndex - 1] : null,
    older:
      currentIndex < parentProjects.length - 1
        ? parentProjects[currentIndex + 1]
        : null,
    parent: null,
  }
}

export async function getPostsByAuthor(
  authorId: string,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.data.authors?.includes(authorId))
}

export async function getProjectsByAuthor(
  authorId: string,
): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getAllProjects()
  return projects.filter((project) =>
    project.data.contributors?.includes(authorId),
  )
}

export async function getPostsByTag(
  tag: string,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.data.tags?.includes(tag))
}

export async function getProjectsByTag(
  tag: string,
): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getAllProjects()
  return projects.filter((project) => project.data.tags?.includes(tag))
}

export async function getRecentPosts(
  count: number,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getAllPosts()
  return posts.slice(0, count)
}

export async function getRecentProjects(
  count: number,
): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getAllProjects()
  return projects.slice(0, count)
}

export async function getRelatedPosts(
  currentPostId: string,
  limit: number = 3,
): Promise<CollectionEntry<'blog'>[]> {
  const allPosts = await getAllPosts()
  const currentPost = allPosts.find((post) => post.id === currentPostId)

  if (
    !currentPost ||
    !currentPost.data.tags ||
    currentPost.data.tags.length === 0
  ) {
    // If no tags, return recent posts excluding current
    return allPosts.filter((post) => post.id !== currentPostId).slice(0, limit)
  }

  // Score posts based on tag overlap
  const scoredPosts = allPosts
    .filter((post) => post.id !== currentPostId)
    .map((post) => {
      const currentTags = new Set(currentPost.data.tags || [])
      const postTags = new Set(post.data.tags || [])

      // Count matching tags
      let score = 0
      postTags.forEach((tag) => {
        if (currentTags.has(tag)) {
          score += 1
        }
      })

      return { post, score }
    })
    .filter((item) => item.score > 0) // Only include posts with at least one matching tag
    .sort((a, b) => {
      // Sort by score (descending), then by date (descending)
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return b.post.data.date.valueOf() - a.post.data.date.valueOf()
    })
    .slice(0, limit)
    .map((item) => item.post)

  // If we don't have enough related posts, fill with recent posts
  if (scoredPosts.length < limit) {
    const recentPosts = allPosts
      .filter(
        (post) =>
          post.id !== currentPostId &&
          !scoredPosts.some((related) => related.id === post.id),
      )
      .slice(0, limit - scoredPosts.length)
    return [...scoredPosts, ...recentPosts]
  }

  return scoredPosts
}

export async function getSortedTags(): Promise<
  { tag: string; count: number }[]
> {
  const tagCounts = await getAllTags()
  return [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      const countDiff = b.count - a.count
      return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
    })
}

export function getParentId(subpostId: string): string {
  return subpostId.split('/')[0]
}

export async function getSubpostsForParent(
  parentId: string,
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog')
  return posts
    .filter(
      (post) =>
        !post.data.draft &&
        isSubpost(post.id) &&
        getParentId(post.id) === parentId,
    )
    .sort((a, b) => {
      const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
      if (dateDiff !== 0) return dateDiff

      const orderA = a.data.order ?? 0
      const orderB = b.data.order ?? 0
      return orderA - orderB
    })
}

export async function getSubProjectsForParent(
  parentId: string,
): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects')
  return projects
    .filter(
      (project) =>
        isSubpost(project.id) && getParentId(project.id) === parentId,
    )
    .sort((a, b) => {
      const dateDiff =
        (a.data.startDate?.valueOf() ?? 0) - (b.data.startDate?.valueOf() ?? 0)
      if (dateDiff !== 0) return dateDiff

      const orderA = a.data.order ?? 0
      const orderB = b.data.order ?? 0
      return orderA - orderB
    })
}

export function groupPostsByYear(
  posts: CollectionEntry<'blog'>[],
): Record<string, CollectionEntry<'blog'>[]> {
  return posts.reduce(
    (acc: Record<string, CollectionEntry<'blog'>[]>, post) => {
      const year = post.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {},
  )
}

export function groupProjectsByYear(
  projects: CollectionEntry<'projects'>[],
): Record<string, CollectionEntry<'projects'>[]> {
  return projects.reduce(
    (acc: Record<string, CollectionEntry<'projects'>[]>, project) => {
      const year = project.data.endDate
        ? project.data.endDate.getFullYear().toString()
        : 'Present'
      ;(acc[year] ??= []).push(project)
      return acc
    },
    {},
  )
}

export async function hasSubposts(postId: string): Promise<boolean> {
  const subposts = await getSubpostsForParent(postId)
  return subposts.length > 0
}

export async function hasSubProjects(projectId: string): Promise<boolean> {
  const subprojects = await getSubProjectsForParent(projectId)
  return subprojects.length > 0
}

export function isSubpost(postId: string): boolean {
  return postId.includes('/')
}

export function isSubProject(projectId: string): boolean {
  return projectId.includes('/')
}

// Translation helpers
// NOTE: isTranslation() relies on a dot separator ('slug.es') which Astro 5's glob
// loader strips from folder-based IDs ('slug.es/' → id 'sluges'). Use post.data.lang
// for reliable filtering. This function is kept for legacy compatibility only.
export function isTranslation(postId: string): boolean {
  return /\.\w{2}$/.test(postId.split('/')[0])
}

// Remove locale suffix from root segment.
// Handles both Astro 5 format ('android-17-beta-3es' → 'android-17-beta-3')
// and legacy dot format ('slug.es/sub' → 'slug/sub').
// Pass lang when you know it (e.g. post.data.lang) for reliable stripping.
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

// Produce the Astro 5 content ID for a translated post.
// Astro 5 strips dots from folder names: 'slug.es/' → id 'sluges', not 'slug.es'.
export function getLocaleId(postId: string, locale: string): string {
  const parts = postId.split('/')
  parts[0] = getBaseSlug(parts[0]) + locale
  return parts.join('/')
}

// Build the correct URL for a post given its ID and target locale
export function getPostUrl(postId: string, locale: 'en' | 'es' = 'en'): string {
  const baseSlug = getBaseSlug(postId, locale)
  return locale === 'es' ? `/es/blog/${baseSlug}` : `/blog/${baseSlug}`
}

// Lookup a post by ID without any collection filters (for ES posts lookup)
export async function getPostByIdRaw(
  postId: string,
): Promise<CollectionEntry<'blog'> | null> {
  const allPosts = await getCollection('blog')
  return allPosts.find((p) => p.id === postId) ?? null
}

export async function getParentPost(
  subpostId: string,
): Promise<CollectionEntry<'blog'> | null> {
  if (!isSubpost(subpostId)) {
    return null
  }

  const parentId = getParentId(subpostId)
  // Use raw lookup so ES parents (e.g. 'slug.es') are also found
  return getPostByIdRaw(parentId)
}

export async function getParentProject(
  subprojectId: string,
): Promise<CollectionEntry<'projects'> | null> {
  if (!isSubProject(subprojectId)) {
    return null
  }

  const parentId = getParentId(subprojectId)
  return getProjectByIdRaw(parentId)
}

export async function parseAuthors(authorIds: string[] = []) {
  if (!authorIds.length) return []

  const allAuthors = await getAllAuthors()
  const authorMap = new Map(allAuthors.map((author) => [author.id, author]))

  return authorIds.map((id) => {
    const author = authorMap.get(id)
    return {
      id,
      name: author?.data?.name || id,
      avatar: author?.data?.avatar || '/static/logo.png',
      isRegistered: author?.data?.isRegistered || false,
    }
  })
}

export async function getPostById(
  postId: string,
): Promise<CollectionEntry<'blog'> | null> {
  // Use raw lookup so both EN and ES posts are found by ID
  return getPostByIdRaw(postId)
}

export async function getPostsById(
  postIds: string[],
): Promise<CollectionEntry<'blog'>[]> {
  const allPosts = await getAllPostsAndSubposts()
  return allPosts.filter((post) => postIds.includes(post.id))
}

export async function getProjectById(
  projectId: string,
): Promise<CollectionEntry<'projects'> | null> {
  return getProjectByIdRaw(projectId)
}

export async function getProjectsById(
  projectIds: string[],
): Promise<CollectionEntry<'projects'>[]> {
  const allProjects = await getAllProjectsAndSubProjects()
  return allProjects.filter((project) => projectIds.includes(project.id))
}

export async function getSubpostCount(parentId: string): Promise<number> {
  const subposts = await getSubpostsForParent(parentId)
  return subposts.length
}

export async function getSubprojectCount(parentId: string): Promise<number> {
  const subprojects = await getSubProjectsForParent(parentId)
  return subprojects.length
}

export async function getCombinedReadingTime(postId: string): Promise<string> {
  const post = await getPostById(postId)
  if (!post) return readingTime(0)

  let totalWords = calculateWordCountFromHtml(post.body)

  if (!isSubpost(postId)) {
    const subposts = await getSubpostsForParent(postId)
    for (const subpost of subposts) {
      totalWords += calculateWordCountFromHtml(subpost.body)
    }
  }

  return readingTime(totalWords)
}

export async function getPostReadingTime(postId: string): Promise<string> {
  const post = await getPostById(postId)
  if (!post) return readingTime(0)

  const wordCount = calculateWordCountFromHtml(post.body)
  return readingTime(wordCount)
}

export type TOCHeading = {
  slug: string
  text: string
  depth: number
  isSubpostTitle?: boolean
}

export type TOCSection = {
  type: 'parent' | 'subpost'
  title: string
  headings: TOCHeading[]
  subpostId?: string
}

export async function getTOCSections(postId: string): Promise<TOCSection[]> {
  const post = await getPostById(postId)
  if (!post) return []

  const parentId = isSubpost(postId) ? getParentId(postId) : postId
  const parentPost = isSubpost(postId) ? await getPostById(parentId) : post

  if (!parentPost) return []

  const sections: TOCSection[] = []

  const { headings: parentHeadings } = await render(parentPost)
  if (parentHeadings.length > 0) {
    sections.push({
      type: 'parent',
      title: 'Overview',
      headings: parentHeadings.map((heading) => ({
        slug: heading.slug,
        text: heading.text,
        depth: heading.depth,
      })),
    })
  }

  const subposts = await getSubpostsForParent(parentId)
  for (const subpost of subposts) {
    const { headings: subpostHeadings } = await render(subpost)
    if (subpostHeadings.length > 0) {
      sections.push({
        type: 'subpost',
        title: subpost.data.title,
        headings: subpostHeadings.map((heading, index) => ({
          slug: heading.slug,
          text: heading.text,
          depth: heading.depth,
          isSubpostTitle: index === 0,
        })),
        subpostId: subpost.id,
      })
    }
  }

  return sections
}

export async function getTOCSectionsProjects(
  projectId: string,
): Promise<TOCSection[]> {
  const post = await getProjectById(projectId)
  if (!post) return []

  const parentId = isSubProject(projectId) ? getParentId(projectId) : projectId
  const parentPost = isSubProject(projectId)
    ? await getProjectById(parentId)
    : post

  if (!parentPost) return []

  const sections: TOCSection[] = []

  const { headings: parentHeadings } = await render(parentPost)
  if (parentHeadings.length > 0) {
    sections.push({
      type: 'parent',
      title: 'Overview',
      headings: parentHeadings.map((heading) => ({
        slug: heading.slug,
        text: heading.text,
        depth: heading.depth,
      })),
    })
  }

  const subposts = await getSubProjectsForParent(parentId)
  for (const subpost of subposts) {
    const { headings: subpostHeadings } = await render(subpost)
    if (subpostHeadings.length > 0) {
      sections.push({
        type: 'subpost',
        title: subpost.data.title,
        headings: subpostHeadings.map((heading, index) => ({
          slug: heading.slug,
          text: heading.text,
          depth: heading.depth,
          isSubpostTitle: index === 0,
        })),
        subpostId: subpost.id,
      })
    }
  }

  return sections
}

// ============================================================================
// Re-exports from modularized utilities
// ============================================================================

// Sorting utilities
export {
  sortPostsByDateDesc,
  sortPostsByDateAsc,
  sortProjectsByEndDateDesc,
  sortPhotosByDateDesc,
  sortTagsByCount,
  sortSubposts,
} from './data-utils/sorting'

// Filter utilities
export {
  filterPostsByLocale,
  filterPostsByLocaleWithDrafts,
  filterProjectsByLocale,
  filterPhotosByLocale,
  filterParents,
  filterSubpostsForParent,
  filterByAuthor,
  filterByTag,
  filterPublished,
  filterByAnyTag,
} from './data-utils/filters'

// Translation utilities - These already exist in data-utils.ts so we don't re-export
// to avoid "Cannot redeclare exported variable" errors
// The modules are available for direct import if needed
