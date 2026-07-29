export type ContentDomain = 'work' | 'lab' | 'notes' | 'gallery'
export type ContentLocale = 'en' | 'es'

export interface SubdocumentReference {
  parentId: string
  documentId: string
  slug: string
  order: number
}

export interface GalleryIntegrityImage {
  id: string
  order: number
  alt: Partial<Record<ContentLocale, string>>
  rights: string
  provenance: string
}

export interface IntegrityDocument {
  parentDomain: ContentDomain
  parentId: string
  documentId: string
  locale: ContentLocale
  translationKey: string
  slug: string
  order: number
  visibility: 'draft' | 'public' | 'unlisted'
}

export interface IntegrityEntry {
  domain: ContentDomain
  entryId: string
  locale: ContentLocale
  translationKey: string
  slug: string
  publishedAt?: string
  updatedAt?: string
  references: string[]
  evidence: unknown[]
  subdocuments: SubdocumentReference[]
  images?: GalleryIntegrityImage[]
  rawFrontmatter: Record<string, unknown>
  featuredRank?: number
}

export interface IntegrityIssue {
  code:
    | 'duplicate-entry-id'
    | 'duplicate-slug'
    | 'duplicate-translation'
    | 'translation-document-parity'
    | 'cross-locale-reference'
    | 'orphan-subdocument'
    | 'duplicate-subdocument'
    | 'misordered-subdocuments'
    | 'broken-reference'
    | 'invalid-date'
    | 'invalid-date-range'
    | 'missing-work-evidence'
    | 'missing-gallery-alt'
    | 'missing-gallery-rights'
    | 'missing-gallery-provenance'
    | 'forbidden-protection-field'
    | 'duplicate-featured-rank'
    | 'missing-document'
    | 'extra-document'
    | 'orphan-document'
    | 'document-manifest-mismatch'
    | 'duplicate-document-id'
    | 'duplicate-document-slug'
    | 'duplicate-gallery-image'
    | 'misordered-gallery-images'
  entryId: string
  message: string
}

const FORBIDDEN_PROTECTION_FIELD =
  /(password|passphrase|secret|salt|(^|_)key($|_))/i

const issue = (
  code: IntegrityIssue['code'],
  entryId: string,
  message: string,
): IntegrityIssue => ({ code, entryId, message })

const duplicateKeys = (values: string[]) => {
  const seen = new Set<string>()
  return new Set(
    values.filter((value) => (seen.has(value) ? true : !seen.add(value))),
  )
}

const parseDate = (value?: string) => {
  if (!value) return undefined
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? null : timestamp
}

const validateEntryDates = (entry: IntegrityEntry): IntegrityIssue[] => {
  const publishedAt = parseDate(entry.publishedAt)
  const updatedAt = parseDate(entry.updatedAt)
  const issues: IntegrityIssue[] = []

  if (publishedAt === null || updatedAt === null) {
    issues.push(
      issue('invalid-date', entry.entryId, 'Entry contains an invalid date'),
    )
  } else if (
    publishedAt !== undefined &&
    updatedAt !== undefined &&
    updatedAt < publishedAt
  ) {
    issues.push(
      issue(
        'invalid-date-range',
        entry.entryId,
        'updatedAt cannot precede publishedAt',
      ),
    )
  }
  return issues
}

const validateSubdocuments = (entry: IntegrityEntry): IntegrityIssue[] => {
  if (entry.subdocuments.length === 0) return []

  const issues: IntegrityIssue[] = []
  if (
    entry.subdocuments.some((document) => document.parentId !== entry.entryId)
  ) {
    issues.push(
      issue(
        'orphan-subdocument',
        entry.entryId,
        'Subdocument parent does not exist',
      ),
    )
  }
  if (
    duplicateKeys(entry.subdocuments.map((document) => document.documentId))
      .size > 0
  ) {
    issues.push(
      issue(
        'duplicate-subdocument',
        entry.entryId,
        'Subdocument IDs must be unique',
      ),
    )
  }
  if (
    entry.subdocuments.some((document, index) => document.order !== index + 1)
  ) {
    issues.push(
      issue(
        'misordered-subdocuments',
        entry.entryId,
        'Subdocument order must be contiguous',
      ),
    )
  }
  return issues
}

const validateGallery = (entry: IntegrityEntry): IntegrityIssue[] => {
  if (entry.domain !== 'gallery') return []
  const images = entry.images ?? []
  const issues: IntegrityIssue[] = []
  if (images.some((image) => !image.alt.en?.trim() || !image.alt.es?.trim())) {
    issues.push(
      issue(
        'missing-gallery-alt',
        entry.entryId,
        'Gallery image alt text is required',
      ),
    )
  }
  if (images.some((image) => !image.rights.trim())) {
    issues.push(
      issue(
        'missing-gallery-rights',
        entry.entryId,
        'Gallery image rights are required',
      ),
    )
  }
  if (images.some((image) => !image.provenance.trim())) {
    issues.push(
      issue(
        'missing-gallery-provenance',
        entry.entryId,
        'Gallery image provenance is required',
      ),
    )
  }
  if (duplicateKeys(images.map(({ id }) => id)).size > 0) {
    issues.push(
      issue(
        'duplicate-gallery-image',
        entry.entryId,
        'Gallery image IDs must be unique',
      ),
    )
  }
  const ordered = images.toSorted((left, right) => left.order - right.order)
  if (ordered.some((image, index) => image.order !== index + 1)) {
    issues.push(
      issue(
        'misordered-gallery-images',
        entry.entryId,
        'Gallery image order must be unique and contiguous',
      ),
    )
  }
  return issues
}

const validateDocuments = (
  entries: IntegrityEntry[],
  documents: IntegrityDocument[],
) => {
  if (documents.length === 0) return []
  const issues: IntegrityIssue[] = []
  const byId = new Map(entries.map((entry) => [entry.entryId, entry]))
  const duplicateIds = duplicateKeys(
    documents.map(
      (document) =>
        `${document.parentDomain}:${document.locale}:${document.parentId}:${document.documentId}`,
    ),
  )
  const duplicateSlugs = duplicateKeys(
    documents.map(
      (document) =>
        `${document.parentDomain}:${document.locale}:${document.parentId}:${document.slug}`,
    ),
  )

  for (const document of documents) {
    const key = `${document.parentDomain}:${document.locale}:${document.parentId}:${document.documentId}`
    const slugKey = `${document.parentDomain}:${document.locale}:${document.parentId}:${document.slug}`
    if (duplicateIds.has(key)) {
      issues.push(
        issue(
          'duplicate-document-id',
          document.parentId,
          `Duplicate document ID: ${document.documentId}`,
        ),
      )
    }
    if (duplicateSlugs.has(slugKey)) {
      issues.push(
        issue(
          'duplicate-document-slug',
          document.parentId,
          `Duplicate document slug: ${document.slug}`,
        ),
      )
    }

    const parent = byId.get(document.parentId)
    if (!parent) {
      issues.push(
        issue(
          'orphan-document',
          document.parentId,
          `Document ${document.documentId} has no parent entry`,
        ),
      )
      continue
    }
    const manifest = parent.subdocuments.find(
      ({ documentId }) => documentId === document.documentId,
    )
    if (!manifest) {
      issues.push(
        issue(
          'extra-document',
          parent.entryId,
          `Document ${document.documentId} is absent from its parent manifest`,
        ),
      )
      continue
    }
    if (
      document.parentDomain !== parent.domain ||
      document.locale !== parent.locale ||
      document.order !== manifest.order ||
      document.slug !== manifest.slug ||
      document.visibility !==
        ((parent.rawFrontmatter
          .visibility as IntegrityDocument['visibility']) ?? 'public')
    ) {
      issues.push(
        issue(
          'document-manifest-mismatch',
          parent.entryId,
          `Document ${document.documentId} does not match parent domain, locale, slug, order, or visibility`,
        ),
      )
    }
  }

  for (const entry of entries) {
    for (const manifest of entry.subdocuments) {
      const child = documents.find(
        (document) =>
          document.parentId === entry.entryId &&
          document.documentId === manifest.documentId &&
          document.locale === entry.locale,
      )
      if (!child) {
        issues.push(
          issue(
            'missing-document',
            entry.entryId,
            `Manifest document ${manifest.documentId} has no matching child`,
          ),
        )
      }
    }
  }
  return issues
}

export const validateContentIntegrity = (
  entries: IntegrityEntry[],
  documents: IntegrityDocument[] = [],
): IntegrityIssue[] => {
  const issues: IntegrityIssue[] = []
  const byId = new Map(entries.map((entry) => [entry.entryId, entry]))
  const duplicateIds = duplicateKeys(entries.map((entry) => entry.entryId))
  const duplicateSlugs = duplicateKeys(
    entries.map((entry) => `${entry.domain}:${entry.locale}:${entry.slug}`),
  )
  const duplicateTranslations = duplicateKeys(
    entries.map(
      (entry) => `${entry.domain}:${entry.locale}:${entry.translationKey}`,
    ),
  )
  const duplicateFeaturedRanks = duplicateKeys(
    entries
      .filter((entry) => entry.featuredRank !== undefined)
      .map(
        (entry) =>
          `${entry.domain}:${entry.locale}:${String(entry.featuredRank)}`,
      ),
  )

  for (const entry of entries) {
    if (duplicateIds.has(entry.entryId)) {
      issues.push(
        issue(
          'duplicate-entry-id',
          entry.entryId,
          'Entry IDs must be globally unique',
        ),
      )
    }
    if (duplicateSlugs.has(`${entry.domain}:${entry.locale}:${entry.slug}`)) {
      issues.push(
        issue(
          'duplicate-slug',
          entry.entryId,
          'Slugs must be unique per domain and locale',
        ),
      )
    }
    if (
      duplicateTranslations.has(
        `${entry.domain}:${entry.locale}:${entry.translationKey}`,
      )
    ) {
      issues.push(
        issue(
          'duplicate-translation',
          entry.entryId,
          'Translation keys must be unique per locale',
        ),
      )
    }
    if (
      entry.featuredRank !== undefined &&
      duplicateFeaturedRanks.has(
        `${entry.domain}:${entry.locale}:${String(entry.featuredRank)}`,
      )
    ) {
      issues.push(
        issue(
          'duplicate-featured-rank',
          entry.entryId,
          'Featured ranks must be unique per domain and locale',
        ),
      )
    }

    issues.push(
      ...validateEntryDates(entry),
      ...validateSubdocuments(entry),
      ...validateGallery(entry),
    )

    if (entry.domain === 'work' && entry.evidence.length === 0) {
      issues.push(
        issue(
          'missing-work-evidence',
          entry.entryId,
          'Published Work outcomes require evidence',
        ),
      )
    }

    for (const reference of entry.references) {
      const target = byId.get(reference)
      if (!target) {
        issues.push(
          issue(
            'broken-reference',
            entry.entryId,
            `Unknown reference: ${reference}`,
          ),
        )
      } else if (target.locale !== entry.locale) {
        issues.push(
          issue(
            'cross-locale-reference',
            entry.entryId,
            `Reference crosses locales: ${reference}`,
          ),
        )
      }
    }

    for (const field of Object.keys(entry.rawFrontmatter)) {
      if (FORBIDDEN_PROTECTION_FIELD.test(field)) {
        issues.push(
          issue(
            'forbidden-protection-field',
            entry.entryId,
            `Forbidden frontmatter field: ${field}`,
          ),
        )
      }
    }
  }

  const translationGroups = Map.groupBy(
    entries,
    (entry) => `${entry.domain}:${entry.translationKey}`,
  )
  for (const group of translationGroups.values()) {
    if (group.length < 2) continue
    const manifests = group.map((entry) =>
      entry.subdocuments
        .map((document) => `${document.order}:${document.documentId}`)
        .join('|'),
    )
    if (new Set(manifests).size > 1) {
      for (const entry of group) {
        issues.push(
          issue(
            'translation-document-parity',
            entry.entryId,
            'Translated entries must expose the same ordered document manifest',
          ),
        )
      }
    }
  }

  issues.push(...validateDocuments(entries, documents))

  return issues
}
