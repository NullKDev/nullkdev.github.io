/**
 * Schema.org structured data for every indexable page.
 *
 * Each surface used to assemble its own JSON-LD object inline — nine copies of
 * the same `WebSite` reference, and entry types that disagreed with the rule
 * AGENTS.md documents. Building them here keeps one shape per kind of page:
 *
 * - entries: `Article` (notes, gallery) or `TechArticle` (work, lab);
 * - subposts: `TechArticle`, part of their entry;
 * - section indexes and filters: `CollectionPage`;
 * - reference pages: `WebPage`;
 * - home: `WebSite`, with its author; About: `Person`.
 *
 * The objects are plain data. `Layout.astro` serialises them through
 * `serializeJsonForScript`, which is what makes a field holding `</script>`
 * safe to embed.
 */
import { about, type Position } from '@/data/about'
import { brand } from '@/data/brand'
import { getLocalizedPath, type Locale } from '@/i18n'
import type { ArchiveDomain } from '@/lib/archive-routes'

export type JsonLd = Record<string, unknown>

type Site = URL | string | undefined

const CONTEXT = 'https://schema.org'

/** Absolute URL under the site origin; the path as given when there is none. */
const absolute = (path: string, site: Site): string =>
  site ? new URL(path, site).href : path

const siteUrl = (site: Site): string | undefined =>
  site ? new URL(site).href : undefined

const websiteRef = (site: Site): JsonLd => ({
  '@type': 'WebSite',
  name: brand.name,
  url: siteUrl(site),
})

/** The person every entry is written by, linked to their About page. */
const authorRef = (locale: Locale, site: Site): JsonLd => ({
  '@type': 'Person',
  name: about[locale].name,
  url: absolute(getLocalizedPath('/about/', locale), site),
})

/**
 * Work and Lab records document how something was built or how an instrument
 * behaves — technical writing. Notes and Gallery collections are articles.
 * `SoftwareApplication` was used for Lab, but without `offers` and a rating it
 * is an invalid rich result, and the page is a write-up around the tool.
 */
export const getEntrySchemaType = (
  domain: ArchiveDomain,
): 'Article' | 'TechArticle' =>
  domain === 'work' || domain === 'lab' ? 'TechArticle' : 'Article'

interface ArticleInput {
  readonly title: string
  readonly summary: string
  readonly locale: Locale
  /** Site-relative path of the page itself. */
  readonly path: string
  /** Site-relative social PNG; omitted when the record has no banner. */
  readonly image?: string
  readonly publishedAt?: Date
  readonly updatedAt?: Date
  readonly site: Site
}

const articleFields = ({
  title,
  summary,
  locale,
  path,
  image,
  publishedAt,
  updatedAt,
  site,
}: ArticleInput): JsonLd => {
  const url = absolute(path, site)
  return {
    headline: title,
    description: summary,
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    ...(image ? { image: absolute(image, site) } : {}),
    ...(publishedAt ? { datePublished: publishedAt.toISOString() } : {}),
    ...(updatedAt ? { dateModified: updatedAt.toISOString() } : {}),
    author: authorRef(locale, site),
  }
}

export const buildEntryArticleLd = ({
  domain,
  ...input
}: ArticleInput & { readonly domain: ArchiveDomain }): JsonLd => ({
  '@context': CONTEXT,
  '@type': getEntrySchemaType(domain),
  ...articleFields(input),
  isPartOf: websiteRef(input.site),
})

export const buildDocumentArticleLd = ({
  parentPath,
  ...input
}: ArticleInput & { readonly parentPath: string }): JsonLd => ({
  '@context': CONTEXT,
  '@type': 'TechArticle',
  ...articleFields(input),
  isPartOf: absolute(parentPath, input.site),
})

interface PageInput {
  readonly name: string
  readonly description: string
  readonly locale: Locale
  readonly site: Site
}

/** Section indexes and their filters list records, so `CollectionPage`. */
export const buildCollectionPageLd = ({
  numberOfItems,
  ...page
}: PageInput & { readonly numberOfItems?: number }): JsonLd => ({
  '@context': CONTEXT,
  '@type': 'CollectionPage',
  name: page.name,
  description: page.description,
  inLanguage: page.locale,
  isPartOf: websiteRef(page.site),
  ...(numberOfItems === undefined ? {} : { numberOfItems }),
})

/** Reference pages describe the site itself; they do not list records. */
export const buildWebPageLd = (page: PageInput): JsonLd => ({
  '@context': CONTEXT,
  '@type': 'WebPage',
  name: page.name,
  description: page.description,
  inLanguage: page.locale,
  isPartOf: websiteRef(page.site),
})

export const buildHomeLd = ({
  description,
  locale,
  site,
}: Omit<PageInput, 'name'>): JsonLd => ({
  '@context': CONTEXT,
  '@type': 'WebSite',
  name: brand.name,
  url: siteUrl(site),
  inLanguage: locale,
  description,
  author: {
    '@type': 'Person',
    name: about[locale].name,
    jobTitle: about[locale].role,
    url: absolute(getLocalizedPath('/about/', locale), site),
  },
})

export const buildProfileLd = ({
  profile,
  current,
  site,
}: {
  readonly profile: (typeof about)[Locale]
  readonly current: Position | undefined
  readonly site: Site
}): JsonLd => ({
  '@context': CONTEXT,
  '@type': 'Person',
  name: profile.name,
  url: siteUrl(site),
  jobTitle: profile.role,
  description: `${profile.bio.thesis} ${profile.bio.note}`,
  ...(current
    ? { worksFor: { '@type': 'Organization', name: current.org } }
    : {}),
  alumniOf: profile.education.map((entry) => ({
    '@type': 'CollegeOrUniversity',
    name: entry.issuer,
  })),
  knowsAbout: profile.capabilities.flatMap((group) => group.items),
  sameAs: profile.links
    .filter((link) => !link.href.startsWith('mailto:'))
    .map((link) => link.href),
})
