import { SITE_URL } from '../site.config.mjs'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'

import { seriesIds } from '../src/data/series'

const dist = resolve('dist')
const walk = async (directory: string): Promise<string[]> =>
  (
    await Promise.all(
      (await readdir(directory, { withFileTypes: true })).map((entry) => {
        const path = join(directory, entry.name)
        return entry.isDirectory() ? walk(path) : [path]
      }),
    )
  ).flat()

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'))
const sitemap = await readFile(join(dist, 'sitemap-0.xml'), 'utf8')
const failures: string[] = []

interface BuiltPage {
  readonly file: string
  readonly locale: string | undefined
  readonly noindex: boolean
  readonly socialImage: string | undefined
  /** hreflang → href, exactly as the page declares them. */
  readonly alternates: ReadonlyMap<string, string>
}
/** Every built page by the URL it is served at. */
const pages = new Map<string, BuiltPage>()
const subposts: { url: string; file: string }[] = []

/* What a reader sees: text content plus the labels a screen reader announces.
   Scripts, styles and the JSON-LD are not copy. */
const readableCopy = (html: string) =>
  [
    html
      .replaceAll(/<(script|style)\b[\s\S]*?<\/\1>/g, ' ')
      .replaceAll(/<[^>]+>/g, ' '),
    ...[...html.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]),
  ]
    .join(' ')
    .replaceAll(/\s+/g, ' ')

/* Three slips the copy must never ship again: an internal collection name
   ("Documents") as a label, a "1 / 1" count that says nothing, and a series
   printed by its slug instead of its title. */
const copyRules: { readonly pattern: RegExp; readonly message: string }[] = [
  {
    pattern: /(?<![\w-])Document(?:s|os)(?![\w-])/,
    message: 'shows the internal collection name "Documents"',
  },
  {
    pattern: /(?<![\d/])1 ?\/ ?1(?![\d/])|\b1 (?:of|de) 1\b/,
    message: 'announces a count of one ("1 / 1")',
  },
  {
    pattern: new RegExp(`Series?: (?:${seriesIds.join('|')})(?![\\w-])`),
    message: 'prints a series by its raw id',
  },
]

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  const copy = readableCopy(html)
  for (const { pattern, message } of copyRules) {
    const found = copy.match(pattern)
    if (found) failures.push(`${file}: ${message} — "${found[0]}"`)
  }
  const relativePath = relative(dist, file).split(sep).join('/')
  const sourcePath =
    relativePath === 'index.html'
      ? '/'
      : relativePath === '404.html'
        ? '/404.html'
        : `/${relativePath.replace(/index\.html$/, '')}`
  const sourceUrl = `${SITE_URL}${sourcePath}`
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  const noindex = /<meta name="robots" content="noindex, nofollow"/.test(html)
  if (!/<html lang="(?:en|es)"/.test(html))
    failures.push(`${file}: missing lang`)
  /* Each language subscribes to its own feed. Spanish pages used to offer
     `/rss.xml`, an English feed, in both the <head> and the footer. */
  const pageLang = html.match(/<html lang="(en|es)"/)?.[1]
  const ownFeed = pageLang === 'es' ? '/es/rss.xml' : '/rss.xml'
  const otherFeed = pageLang === 'es' ? '/rss.xml' : '/es/rss.xml'
  const feedLink = html.match(
    /<link rel="alternate" type="application\/rss\+xml"[^>]*href="([^"]+)"/,
  )?.[1]
  if (feedLink !== ownFeed) {
    failures.push(`${file}: feed link ${String(feedLink)}, expected ${ownFeed}`)
  }
  if (html.includes(`href="${otherFeed}"`)) {
    failures.push(`${file}: links the other language's feed ${otherFeed}`)
  }
  /* An indexable page must name its canonical URL. A noindex page may omit
     it: the 404 stands in for every missing path, and a canonical there told
     crawlers the error page and the home page were one document. Legacy
     compatibility pages keep theirs, pointing at the record that replaced
     them. */
  if (!canonical && !noindex) failures.push(`${file}: missing canonical`)
  if (!/<meta name="description" content="[^"]+"/.test(html)) {
    failures.push(`${file}: missing description`)
  }
  /* Was: every page must carry the one shared card. That assertion is what
     kept previews generic — an entry could not advertise its own banner without
     failing the build. Now: every page must carry SOME absolute PNG under this
     origin, and an entry with a banner must carry THAT banner.

     PNG is not a style preference. X, LinkedIn, Slack and WhatsApp render
     nothing for an SVG `og:image`. */
  const socialImage = /<meta property="og:image" content="([^"]+)"/.exec(
    html,
  )?.[1]
  if (!socialImage) {
    failures.push(`${file}: missing social image`)
  } else if (!socialImage.startsWith(`${SITE_URL}/`)) {
    failures.push(`${file}: social image is not absolute under ${SITE_URL}`)
  } else if (!socialImage.endsWith('.png')) {
    failures.push(
      `${file}: social image is ${socialImage.split('.').pop()}, not png — scrapers will render nothing`,
    )
  }

  const banner =
    /<meta property="og:image" content="[^"]*"[\s\S]{0,400}?class="entry-banner"/.test(
      html,
    )
  if (banner) {
    const declared =
      /<figure class="entry-banner">\s*<img\s+src="\/banners\/([^"]+)\.svg"/.exec(
        html,
      )?.[1]
    if (
      declared &&
      socialImage &&
      !socialImage.endsWith(`/og/banners/${declared}.png`)
    ) {
      failures.push(
        `${file}: shows banner "${declared}" but shares ${socialImage} — the preview should be the banner`,
      )
    }
  }
  const alternates = new Map(
    [
      ...html.matchAll(
        /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g,
      ),
    ].map(([, hreflang, href]) => [hreflang, href]),
  )
  const locale = /<html lang="(en|es)"/.exec(html)?.[1]
  pages.set(sourceUrl, { file, locale, noindex, socialImage, alternates })
  /* hreflang describes indexable pages to search engines. A noindex page —
     the 404, a protected record, a legacy compatibility page — is not a
     translation of anything, and naming one as an alternate is exactly the
     non-reciprocal annotation search engines discard. */
  if (noindex && alternates.size > 0) {
    failures.push(`${file}: noindex page declares hreflang alternates`)
  }
  if (!noindex && locale && alternates.get(locale) !== canonical) {
    failures.push(
      `${file}: missing self hreflang="${locale}" pointing at its canonical`,
    )
  }
  if (noindex && sitemap.includes(`<loc>${sourceUrl}</loc>`)) {
    failures.push(`${file}: noindex source appears in sitemap`)
  }
  const structuredData: Record<string, unknown>[] = []
  for (const match of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      structuredData.push(JSON.parse(match[1]) as Record<string, unknown>)
    } catch {
      failures.push(`${file}: invalid JSON-LD`)
    }
  }
  /* Entries and their subposts are articles with an author — the rule
     AGENTS.md documents. An entry that shares its banner names that same
     image, so search and social previews agree. */
  const longForm = /<main class="entry-page(?: document-page)?"/.test(html)
  if (/<main class="entry-page document-page"/.test(html) && !noindex) {
    subposts.push({ url: sourceUrl, file })
  }
  if (longForm && !noindex) {
    const article = structuredData.find(
      ({ '@type': type }) => type === 'Article' || type === 'TechArticle',
    )
    if (!article) {
      failures.push(`${file}: entry without Article/TechArticle JSON-LD`)
    } else {
      if (!article.author) failures.push(`${file}: article without author`)
      if (
        socialImage?.includes('/og/banners/') &&
        article.image !== socialImage
      ) {
        failures.push(
          `${file}: article image ${String(article.image)} is not the shared banner ${socialImage}`,
        )
      }
    }
  }
}

/* Reciprocity. An alternate is only a translation when the page it names
   exists, is indexable, and names this page back; anything else is a guess —
   a section index standing in for an untranslated entry, or page 1 standing
   in for page 2 — and search engines ignore a one-way pair. `x-default` exists
   only for a real en/es pair and always names the English page. */
for (const [url, page] of pages) {
  if (page.noindex || !page.locale) continue
  const otherLocale = page.locale === 'en' ? 'es' : 'en'
  const other = page.alternates.get(otherLocale)
  const xDefault = page.alternates.get('x-default')
  if (other) {
    const target = pages.get(other)
    if (!target) {
      failures.push(
        `${page.file}: hreflang="${otherLocale}" ${other} is not a built page`,
      )
    } else if (target.noindex) {
      failures.push(
        `${page.file}: hreflang="${otherLocale}" ${other} is noindex`,
      )
    } else if (target.alternates.get(page.locale) !== url) {
      failures.push(
        `${page.file}: hreflang="${otherLocale}" ${other} does not name ${url} back`,
      )
    }
    const english = page.locale === 'en' ? url : other
    if (xDefault !== english) {
      failures.push(
        `${page.file}: x-default is ${String(xDefault)}, expected the English page ${english}`,
      )
    }
  } else if (xDefault) {
    failures.push(`${page.file}: x-default without a translated counterpart`)
  }
}

/* A subpost on its own URL shares its parent entry's image: it is a part of
   that record, and AGENTS.md says a page shares its own image, never the
   generic identity card. The article image follows from the og:image rule
   above. */
for (const { url, file } of subposts) {
  const parentUrl = url.replace(/[^/]+\/$/, '')
  const parent = pages.get(parentUrl)
  if (!parent) {
    failures.push(`${file}: parent entry ${parentUrl} is not a built page`)
  } else if (parent.socialImage !== pages.get(url)?.socialImage) {
    failures.push(
      `${file}: shares ${String(pages.get(url)?.socialImage)}, not its entry's image ${String(parent.socialImage)}`,
    )
  }
}

const robots = await readFile(join(dist, 'robots.txt'), 'utf8')
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap-index.xml`)) {
  failures.push('robots.txt: missing canonical sitemap')
}
/* Both feeds must declare their language and hold only that language's
   entries — every Spanish URL lives under /es/. That each one parses as XML
   is asserted in a real browser by the e2e suite (`DOMParser`). */
for (const [feedFile, language] of [
  ['rss.xml', 'en'],
  ['es/rss.xml', 'es'],
] as const) {
  const xml = await readFile(join(dist, feedFile), 'utf8')
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(
    ([, body]) => body,
  )
  if (!/^<\?xml[^>]*\?>\s*<rss[\s>]/.test(xml) || items.length === 0) {
    failures.push(`${feedFile}: missing channel or entries`)
    continue
  }
  if (!xml.includes(`<language>${language}</language>`)) {
    failures.push(`${feedFile}: <language> is not ${language}`)
  }
  for (const item of items) {
    const link = item.match(/<link>([^<]+)<\/link>/)?.[1] ?? ''
    const inSpanish = link.startsWith(`${SITE_URL}/es/`)
    if (!item.includes('<pubDate>')) {
      failures.push(`${feedFile}: entry ${link} has no pubDate`)
    }
    if (inSpanish !== (language === 'es')) {
      failures.push(`${feedFile}: entry ${link} is not in ${language}`)
    }
  }
}

/* A heading hit in notes search links to `path#slug`. Every indexed anchor
   must exist on the page it points at, or search lands at the top. */
for (const searchFile of ['notes-search.json', 'es/notes-search.json']) {
  const index = JSON.parse(await readFile(join(dist, searchFile), 'utf8')) as {
    entries: { path: string; sections: { slug: string }[] }[]
  }
  for (const { path, sections } of index.entries) {
    const page = await readFile(join(dist, path, 'index.html'), 'utf8')
    for (const { slug } of sections) {
      if (!page.includes(`id="${slug}"`)) {
        failures.push(`${searchFile}: ${path}#${slug} is not an anchor`)
      }
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Built metadata checks failed:\n${failures.join('\n')}`)
}
console.info(
  `Metadata, robots, RSS, sitemap, JSON-LD, and hreflang checks passed across ${htmlFiles.length} HTML files.`,
)
