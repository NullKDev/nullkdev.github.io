import { getCollection, type CollectionEntry } from 'astro:content'

import {
  validateContentIntegrity,
  type ContentDomain,
  type IntegrityDocument,
  type IntegrityEntry,
} from '@/content/integrity'
import type { Locale } from '@/i18n'
import { buildDocumentPath, buildEntryPath } from '@/lib/archive-routes'

export const archiveDomains = ['work', 'lab', 'notes', 'gallery'] as const
export type ArchiveDomain = (typeof archiveDomains)[number]
export type ArchiveEntry =
  | CollectionEntry<'work'>
  | CollectionEntry<'lab'>
  | CollectionEntry<'notes'>
  | CollectionEntry<'gallery'>
export type ArchiveDocument = CollectionEntry<'documents'>

const loadDomain = async (domain: ArchiveDomain): Promise<ArchiveEntry[]> => {
  switch (domain) {
    case 'work':
      return getCollection('work')
    case 'lab':
      return getCollection('lab')
    case 'notes':
      return getCollection('notes')
    case 'gallery':
      return getCollection('gallery')
  }
}

const dateValue = (entry: ArchiveEntry) =>
  entry.data.updatedAt?.getTime() ?? entry.data.publishedAt?.getTime() ?? 0

const sortEntries = (entries: ArchiveEntry[]) =>
  entries.toSorted((left, right) => {
    const leftRank = left.data.featuredRank ?? Number.MAX_SAFE_INTEGER
    const rightRank = right.data.featuredRank ?? Number.MAX_SAFE_INTEGER
    return leftRank - rightRank || dateValue(right) - dateValue(left)
  })

export const getArchiveEntries = async (
  domain: ArchiveDomain,
  locale: Locale,
) =>
  sortEntries(
    (await loadDomain(domain)).filter(
      ({ data }) =>
        data.locale === locale &&
        data.visibility === 'public' &&
        data.protection.mode === 'public',
    ),
  )

export const getAllPublicEntries = async (locale?: Locale) => {
  const entries = (
    await Promise.all(archiveDomains.map((domain) => loadDomain(domain)))
  ).flat()
  return sortEntries(
    entries.filter(
      ({ data }) =>
        (!locale || data.locale === locale) &&
        data.visibility === 'public' &&
        data.protection.mode === 'public',
    ),
  )
}

export const getEntryBySlug = async (
  domain: ArchiveDomain,
  locale: Locale,
  slug: string,
) =>
  (await getArchiveEntries(domain, locale)).find(
    ({ data }) => data.slug === slug,
  )

export const getEntryDomain = (entry: ArchiveEntry): ArchiveDomain => {
  if ('lifecycle' in entry.data && 'domains' in entry.data) return 'work'
  if ('execution' in entry.data) return 'lab'
  if ('citations' in entry.data) return 'notes'
  return 'gallery'
}

export const getEntryPath = (entry: ArchiveEntry) =>
  buildEntryPath(getEntryDomain(entry), entry.data.slug, entry.data.locale)

export const getDocumentsForEntry = async (entry: ArchiveEntry) =>
  (await getCollection('documents'))
    .filter(
      ({ data }) =>
        data.parentId === entry.data.entryId &&
        data.locale === entry.data.locale &&
        data.visibility === 'public' &&
        data.protection.mode === 'public',
    )
    .toSorted((left, right) => left.data.order - right.data.order)

export const getDocumentPath = (
  entry: ArchiveEntry,
  document: ArchiveDocument,
) =>
  buildDocumentPath(
    getEntryDomain(entry),
    entry.data.slug,
    document.data.slug,
    entry.data.locale,
  )

export const getCounterpartEntry = async (entry: ArchiveEntry) => {
  const locale: Locale = entry.data.locale === 'en' ? 'es' : 'en'
  return (await loadDomain(getEntryDomain(entry))).find(
    ({ data }) =>
      data.translationKey === entry.data.translationKey &&
      data.locale === locale &&
      data.visibility === 'public',
  )
}

export const getEntryCounterpartPath = async (entry: ArchiveEntry) => {
  const counterpart = await getCounterpartEntry(entry)
  if (counterpart) return getEntryPath(counterpart)
  const locale: Locale = entry.data.locale === 'en' ? 'es' : 'en'
  return `${locale === 'es' ? '/es' : ''}/${getEntryDomain(entry)}/`
}

export const getCounterpartDocument = async (document: ArchiveDocument) => {
  const locale: Locale = document.data.locale === 'en' ? 'es' : 'en'
  return (await getCollection('documents')).find(
    ({ data }) =>
      data.translationKey === document.data.translationKey &&
      data.locale === locale &&
      data.visibility === 'public',
  )
}

export const getDocumentCounterpartPath = async (
  entry: ArchiveEntry,
  document: ArchiveDocument,
) => {
  const [counterpartEntry, counterpartDocument] = await Promise.all([
    getCounterpartEntry(entry),
    getCounterpartDocument(document),
  ])
  if (counterpartEntry && counterpartDocument) {
    return getDocumentPath(counterpartEntry, counterpartDocument)
  }
  const locale: Locale = entry.data.locale === 'en' ? 'es' : 'en'
  return `${locale === 'es' ? '/es' : ''}/${getEntryDomain(entry)}/`
}

export const getAdjacentDocuments = async (
  entry: ArchiveEntry,
  document: ArchiveDocument,
) => {
  const documents = await getDocumentsForEntry(entry)
  const index = documents.findIndex(({ id }) => id === document.id)
  return {
    previous: index > 0 ? documents[index - 1] : undefined,
    next: index >= 0 ? documents[index + 1] : undefined,
  }
}

export const getAdjacentEntries = async (entry: ArchiveEntry) => {
  const domain = getEntryDomain(entry)
  const entries = await getArchiveEntries(domain, entry.data.locale)
  const index = entries.findIndex(({ id }) => id === entry.id)
  if (index === -1) return { previous: undefined, next: undefined }
  return {
    previous: index > 0 ? entries[index - 1] : undefined,
    next: entries[index + 1],
  }
}

export const getNotesSeriesNavigation = async (entry: ArchiveEntry) => {
  if (!('citations' in entry.data) || !entry.data.series) return undefined
  const seriesId = entry.data.series.id
  const seriesOrder = entry.data.series.order
  const series = (await getArchiveEntries('notes', entry.data.locale))
    .filter(
      (candidate) =>
        'series' in candidate.data && candidate.data.series?.id === seriesId,
    )
    .toSorted((left, right) => {
      const leftOrder =
        'series' in left.data ? (left.data.series?.order ?? 0) : 0
      const rightOrder =
        'series' in right.data ? (right.data.series?.order ?? 0) : 0
      return leftOrder - rightOrder
    })
  const index = series.findIndex(({ id }) => id === entry.id)
  return {
    id: seriesId,
    order: seriesOrder,
    total: series.length,
    previous: index > 0 ? series[index - 1] : undefined,
    next: index >= 0 ? series[index + 1] : undefined,
  }
}

export const getEntryRelationships = async (entry: ArchiveEntry) => {
  const entries = await getAllPublicEntries(entry.data.locale)
  const references = entry.data.references.flatMap((reference) => {
    const target = entries.find(
      ({ data }) => data.entryId === reference.entryId,
    )
    return target ? [{ reference, entry: target }] : []
  })
  const backlinks = entries.flatMap((candidate) =>
    candidate.data.references
      .filter(({ entryId }) => entryId === entry.data.entryId)
      .map((reference) => ({ reference, entry: candidate })),
  )
  return { references, backlinks }
}

export const getDocumentRelationships = async (document: ArchiveDocument) => {
  const entries = await getAllPublicEntries(document.data.locale)
  return document.data.references.flatMap((reference) => {
    const target = entries.find(
      ({ data }) => data.entryId === reference.entryId,
    )
    return target ? [{ reference, entry: target }] : []
  })
}

export const getTopicIndex = async (locale: Locale) => {
  const entries = await getAllPublicEntries(locale)
  const topics = new Map<string, ArchiveEntry[]>()
  for (const entry of entries) {
    for (const topic of entry.data.topics) {
      topics.set(topic, [...(topics.get(topic) ?? []), entry])
    }
  }
  return topics
}

export const getFeaturedByDomain = async (locale: Locale) =>
  Object.fromEntries(
    await Promise.all(
      archiveDomains.map(async (domain) => [
        domain,
        (await getArchiveEntries(domain, locale))[0],
      ]),
    ),
  ) as Record<ArchiveDomain, ArchiveEntry | undefined>

export interface HomeSection {
  domain: ArchiveDomain
  items: ArchiveEntry[]
  total: number
}

/** Most recent `limit` entries per domain, plus the domain total, in nav order. */
export const getHomeSections = async (
  locale: Locale,
  limit = 3,
): Promise<HomeSection[]> =>
  Promise.all(
    archiveDomains.map(async (domain) => {
      const all = await getArchiveEntries(domain, locale)
      return { domain, items: all.slice(0, limit), total: all.length }
    }),
  )

export const getPublicEnglishNotes = async () =>
  (await getArchiveEntries('notes', 'en')) as CollectionEntry<'notes'>[]

export const assertTrackedContentIntegrity = async () => {
  const collections = await Promise.all(
    archiveDomains.map(async (domain) => ({
      domain,
      entries: await loadDomain(domain),
    })),
  )

  // One manifest serves both locales, so the integrity input is grouped by
  // collection key. Images and videos carry `alt`; files and links carry
  // `label` — both bilingual, so one rule covers every item type.
  const galleryItemsByCollection = new Map<
    string,
    {
      id: string
      order: number
      alt: { en: string; es: string }
      rights: string
      provenance: string
    }[]
  >()
  for (const item of await getCollection('galleryItems')) {
    const data = item.data
    const list = galleryItemsByCollection.get(data.collection) ?? []
    list.push({
      id: data.id,
      order: data.order,
      alt: 'alt' in data ? data.alt : data.label,
      rights: 'rights' in data ? data.rights : '',
      provenance: 'provenance' in data ? data.provenance : '',
    })
    galleryItemsByCollection.set(data.collection, list)
  }

  const entries: IntegrityEntry[] = collections.flatMap(({ domain, entries }) =>
    entries.map(({ data }) => ({
      domain: domain as ContentDomain,
      entryId: data.entryId,
      locale: data.locale,
      translationKey: data.translationKey,
      slug: data.slug,
      publishedAt: data.publishedAt?.toISOString(),
      updatedAt: data.updatedAt?.toISOString(),
      references: data.references.map(({ entryId }) => entryId),
      evidence: [
        ...data.evidence,
        ...('outcomes' in data
          ? data.outcomes.flatMap((outcome) => outcome.evidence)
          : []),
      ],
      subdocuments: data.documents.map((document) => ({
        parentId: data.entryId,
        documentId: document.documentId,
        slug: document.slug,
        order: document.order,
      })),
      // Gallery assets moved out of entry frontmatter into a per-collection
      // manifest; the integrity rules (bilingual alt, rights, provenance,
      // unique ids, ordering) still apply and now cover files and links too.
      images: galleryItemsByCollection.get(data.translationKey),
      rawFrontmatter: data,
      featuredRank: data.featuredRank,
    })),
  )
  const documents: IntegrityDocument[] = (await getCollection('documents')).map(
    ({ data }) => ({
      parentDomain: data.parentDomain,
      parentId: data.parentId,
      documentId: data.documentId,
      locale: data.locale,
      translationKey: data.translationKey,
      slug: data.slug,
      order: data.order,
      visibility: data.visibility,
    }),
  )
  const issues = validateContentIntegrity(entries, documents)
  if (issues.length > 0) {
    throw new Error(
      `Content integrity failed:\n${issues
        .map(({ code, entryId, message }) => `${code} (${entryId}): ${message}`)
        .join('\n')}`,
    )
  }
}

/**
 * The assets belonging to a gallery collection, in declared order. Items live
 * in one manifest per collection and are shared by both locales — an asset's
 * size, origin, and model do not change by language; only its alt and caption
 * do, and those are bilingual inside the record.
 */
export const getGalleryItems = async (entry: ArchiveEntry) =>
  (await getCollection('galleryItems'))
    .filter(({ data }) => data.collection === entry.data.translationKey)
    .toSorted((left, right) => left.data.order - right.data.order)
