import { describe, expect, it } from 'vitest'

import {
  validateContentIntegrity,
  type IntegrityDocument,
  type IntegrityEntry,
} from '@/content/integrity'

const makeEntry = (
  overrides: Partial<IntegrityEntry> = {},
): IntegrityEntry => ({
  domain: 'notes',
  entryId: 'notes-foundation',
  locale: 'en',
  translationKey: 'notes-foundation',
  slug: 'foundation',
  publishedAt: '2026-07-23',
  updatedAt: '2026-07-23',
  references: [],
  evidence: [],
  subdocuments: [],
  rawFrontmatter: {},
  ...overrides,
})

const issueCodes = (entries: IntegrityEntry[]) =>
  validateContentIntegrity(entries).map((issue) => issue.code)

const makeDocument = (
  overrides: Partial<IntegrityDocument> = {},
): IntegrityDocument => ({
  parentDomain: 'notes',
  parentId: 'notes-foundation',
  documentId: 'architecture',
  locale: 'en',
  translationKey: 'notes-foundation-architecture',
  slug: 'architecture',
  order: 1,
  visibility: 'public',
  ...overrides,
})

describe('content integrity', () => {
  it('accepts a valid bilingual parent with ordered documents and references', () => {
    const entries = [
      makeEntry({ references: ['lab-renderer'] }),
      makeEntry({
        entryId: 'notes-foundation-es',
        locale: 'es',
        slug: 'fundamentos',
        references: ['lab-renderer-es'],
      }),
      makeEntry({
        domain: 'lab',
        entryId: 'lab-renderer',
        translationKey: 'lab-renderer',
        slug: 'renderer',
        subdocuments: [
          {
            parentId: 'lab-renderer',
            documentId: 'architecture',
            slug: 'architecture',
            order: 1,
          },
          {
            parentId: 'lab-renderer',
            documentId: 'decisions',
            slug: 'decisions',
            order: 2,
          },
        ],
      }),
      makeEntry({
        domain: 'lab',
        entryId: 'lab-renderer-es',
        locale: 'es',
        translationKey: 'lab-renderer',
        slug: 'renderizador',
        subdocuments: [
          {
            parentId: 'lab-renderer-es',
            documentId: 'architecture',
            slug: 'arquitectura',
            order: 1,
          },
          {
            parentId: 'lab-renderer-es',
            documentId: 'decisions',
            slug: 'decisiones',
            order: 2,
          },
        ],
      }),
    ]

    expect(validateContentIntegrity(entries)).toEqual([])
  })

  it('detects duplicate IDs and locale-scoped slugs', () => {
    const duplicate = makeEntry()
    const codes = issueCodes([duplicate, { ...duplicate }])

    expect(codes).toContain('duplicate-entry-id')
    expect(codes).toContain('duplicate-slug')
  })

  it('requires featured ranks to be unique per domain and locale', () => {
    const codes = issueCodes([
      makeEntry({ featuredRank: 1 }),
      makeEntry({
        entryId: 'notes-second',
        translationKey: 'notes-second',
        slug: 'second',
        featuredRank: 1,
      }),
    ])

    expect(codes).toContain('duplicate-featured-rank')
  })

  it('detects translation parity and locale mixing', () => {
    const codes = issueCodes([
      makeEntry({
        subdocuments: [
          {
            parentId: 'notes-foundation',
            documentId: 'architecture',
            slug: 'architecture',
            order: 1,
          },
        ],
      }),
      makeEntry({
        entryId: 'notes-other-es',
        locale: 'es',
        translationKey: 'notes-foundation',
        slug: 'fundamentos',
        references: ['notes-foundation'],
        subdocuments: [
          {
            parentId: 'notes-other-es',
            documentId: 'implementation',
            slug: 'implementacion',
            order: 1,
          },
        ],
      }),
    ])

    expect(codes).toContain('translation-document-parity')
    expect(codes).toContain('cross-locale-reference')
  })

  it('detects orphaned, duplicate, and misordered subdocuments', () => {
    const codes = issueCodes([
      makeEntry({
        subdocuments: [
          {
            parentId: 'missing-parent',
            documentId: 'architecture',
            slug: 'architecture',
            order: 2,
          },
          {
            parentId: 'notes-foundation',
            documentId: 'architecture',
            slug: 'architecture-copy',
            order: 2,
          },
        ],
      }),
    ])

    expect(codes).toContain('orphan-subdocument')
    expect(codes).toContain('duplicate-subdocument')
    expect(codes).toContain('misordered-subdocuments')
  })

  it('detects broken references and invalid date ranges', () => {
    const codes = issueCodes([
      makeEntry({
        references: ['missing-entry'],
        publishedAt: '2026-07-24',
        updatedAt: '2026-07-23',
      }),
    ])

    expect(codes).toContain('broken-reference')
    expect(codes).toContain('invalid-date-range')
  })

  it('requires typed evidence for published Work outcomes', () => {
    const codes = issueCodes([
      makeEntry({
        domain: 'work',
        entryId: 'work-app',
        translationKey: 'work-app',
      }),
    ])

    expect(codes).toContain('missing-work-evidence')
  })

  it('requires localized alt text, rights, and provenance for gallery images', () => {
    const codes = issueCodes([
      makeEntry({
        domain: 'gallery',
        entryId: 'gallery-field',
        translationKey: 'gallery-field',
        images: [
          {
            id: 'image-1',
            order: 1,
            alt: { en: '' },
            rights: '',
            provenance: '',
          },
        ],
      }),
    ])

    expect(codes).toContain('missing-gallery-alt')
    expect(codes).toContain('missing-gallery-rights')
    expect(codes).toContain('missing-gallery-provenance')
  })

  it.each(['password', 'passwordHash', 'salt', 'secretKey', 'encryption_key'])(
    'forbids password-like frontmatter field %s',
    (field) => {
      expect(
        issueCodes([makeEntry({ rawFrontmatter: { [field]: 'forbidden' } })]),
      ).toContain('forbidden-protection-field')
    },
  )

  it('accepts exact bidirectional parent and real child document parity', () => {
    const parent = makeEntry({
      subdocuments: [
        {
          parentId: 'notes-foundation',
          documentId: 'architecture',
          slug: 'architecture',
          order: 1,
        },
      ],
    })

    expect(validateContentIntegrity([parent], [makeDocument()])).toEqual([])
  })

  it('detects missing, extra, orphaned, misparented, and mismatched documents', () => {
    const parent = makeEntry({
      subdocuments: [
        {
          parentId: 'notes-foundation',
          documentId: 'architecture',
          slug: 'architecture',
          order: 1,
        },
        {
          parentId: 'notes-foundation',
          documentId: 'missing',
          slug: 'missing',
          order: 2,
        },
      ],
    })
    const codes = validateContentIntegrity(
      [parent],
      [
        makeDocument({ order: 2 }),
        makeDocument({
          documentId: 'extra',
          slug: 'extra',
          translationKey: 'extra',
          order: 3,
        }),
        makeDocument({
          parentId: 'unknown-parent',
          documentId: 'orphan',
          slug: 'orphan',
          translationKey: 'orphan',
        }),
        makeDocument({
          parentDomain: 'work',
          documentId: 'wrong-domain',
          slug: 'wrong-domain',
          translationKey: 'wrong-domain',
        }),
      ],
    ).map(({ code }) => code)

    expect(codes).toContain('missing-document')
    expect(codes).toContain('extra-document')
    expect(codes).toContain('orphan-document')
    expect(codes).toContain('document-manifest-mismatch')
  })

  it('detects duplicate document IDs and localized slugs', () => {
    const codes = validateContentIntegrity(
      [makeEntry()],
      [makeDocument(), makeDocument()],
    ).map(({ code }) => code)

    expect(codes).toContain('duplicate-document-id')
    expect(codes).toContain('duplicate-document-slug')
  })

  it('requires unique contiguous Gallery image IDs and order with both alts', () => {
    const codes = issueCodes([
      makeEntry({
        domain: 'gallery',
        entryId: 'gallery-field',
        translationKey: 'gallery-field',
        images: [
          {
            id: 'signal',
            order: 2,
            alt: { en: 'Signal', es: '' },
            rights: 'First-party',
            provenance: 'Archive source',
          },
          {
            id: 'signal',
            order: 2,
            alt: { en: 'Signal', es: 'Señal' },
            rights: 'First-party',
            provenance: 'Archive source',
          },
        ],
      }),
    ])

    expect(codes).toContain('duplicate-gallery-image')
    expect(codes).toContain('misordered-gallery-images')
    expect(codes).toContain('missing-gallery-alt')
  })
})
