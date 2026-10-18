import { describe, expect, it } from 'vitest'

import { about } from '@/data/about'
import { brand } from '@/data/brand'
import {
  buildCollectionPageLd,
  buildDocumentArticleLd,
  buildEntryArticleLd,
  buildHomeLd,
  buildProfileLd,
  buildWebPageLd,
  getEntrySchemaType,
} from '@/lib/structured-data'

const site = new URL('https://example.test/')

describe('entry articles', () => {
  it('types every domain as Article or TechArticle', () => {
    expect(getEntrySchemaType('notes')).toBe('Article')
    expect(getEntrySchemaType('gallery')).toBe('Article')
    expect(getEntrySchemaType('work')).toBe('TechArticle')
    expect(getEntrySchemaType('lab')).toBe('TechArticle')
  })

  it('carries author, absolute image, url and dates', () => {
    const ld = buildEntryArticleLd({
      domain: 'lab',
      title: 'Tool',
      summary: 'What it does',
      locale: 'es',
      path: '/es/lab/tool/',
      image: '/og/banners/tool-es.png',
      publishedAt: new Date('2026-01-02T00:00:00Z'),
      updatedAt: undefined,
      site,
    })
    expect(ld).toEqual({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'Tool',
      description: 'What it does',
      inLanguage: 'es',
      url: 'https://example.test/es/lab/tool/',
      mainEntityOfPage: 'https://example.test/es/lab/tool/',
      image: 'https://example.test/og/banners/tool-es.png',
      datePublished: '2026-01-02T00:00:00.000Z',
      author: {
        '@type': 'Person',
        name: about.es.name,
        url: 'https://example.test/es/about/',
      },
      isPartOf: { '@type': 'WebSite', name: brand.name, url: site.href },
    })
  })

  it('omits image when the entry has no banner', () => {
    const ld = buildEntryArticleLd({
      domain: 'notes',
      title: 'Note',
      summary: 'S',
      locale: 'en',
      path: '/notes/note/',
      site,
    })
    expect(ld).not.toHaveProperty('image')
    expect(ld).not.toHaveProperty('dateModified')
    expect(ld.author).toEqual({
      '@type': 'Person',
      name: about.en.name,
      url: 'https://example.test/about/',
    })
  })
})

describe('document articles', () => {
  it('points at the parent entry and keeps the shared author', () => {
    const ld = buildDocumentArticleLd({
      title: 'Part',
      summary: 'S',
      locale: 'en',
      path: '/notes/parent/part/',
      parentPath: '/notes/parent/',
      image: '/og/banners/parent.png',
      site,
    })
    expect(ld['@type']).toBe('TechArticle')
    expect(ld.isPartOf).toBe('https://example.test/notes/parent/')
    expect(ld.url).toBe('https://example.test/notes/parent/part/')
    expect(ld.image).toBe('https://example.test/og/banners/parent.png')
    expect(ld.author).toMatchObject({ '@type': 'Person' })
  })
})

describe('page-level builders', () => {
  it('collection pages name their website and count their items', () => {
    expect(
      buildCollectionPageLd({
        name: 'Notes',
        description: 'D',
        locale: 'en',
        site,
        numberOfItems: 4,
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Notes',
      description: 'D',
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: brand.name, url: site.href },
      numberOfItems: 4,
    })
  })

  it('collection pages without a count omit it', () => {
    expect(
      buildCollectionPageLd({
        name: 'Lab',
        description: 'D',
        locale: 'en',
        site,
      }),
    ).not.toHaveProperty('numberOfItems')
  })

  it('reference pages are WebPage', () => {
    expect(
      buildWebPageLd({ name: 'Uses', description: 'D', locale: 'es', site }),
    ).toMatchObject({ '@type': 'WebPage', inLanguage: 'es' })
  })

  it('home is a WebSite authored by the person', () => {
    expect(buildHomeLd({ description: 'D', locale: 'es', site })).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: brand.name,
      url: site.href,
      inLanguage: 'es',
      description: 'D',
      author: {
        '@type': 'Person',
        name: about.es.name,
        jobTitle: about.es.role,
        url: 'https://example.test/es/about/',
      },
    })
  })

  it('the profile lists employer only when there is a current position', () => {
    const profile = about.en
    const withEmployer = buildProfileLd({
      profile,
      current: profile.positions[0],
      site,
    })
    expect(withEmployer).toMatchObject({
      '@type': 'Person',
      name: profile.name,
      worksFor: { '@type': 'Organization', name: profile.positions[0].org },
    })
    expect(
      (withEmployer.sameAs as string[]).some((href) =>
        href.startsWith('mailto:'),
      ),
    ).toBe(false)
    expect(
      buildProfileLd({ profile, current: undefined, site }),
    ).not.toHaveProperty('worksFor')
  })
})
