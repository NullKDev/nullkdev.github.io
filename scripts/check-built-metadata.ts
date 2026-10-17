import { SITE_URL } from '../site.config.mjs'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'

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

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
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
const rss = await readFile(join(dist, 'rss.xml'), 'utf8')
if (!rss.includes('<rss') || !rss.includes('<pubDate>')) {
  failures.push('rss.xml: missing channel or dated entries')
}

if (failures.length > 0) {
  throw new Error(`Built metadata checks failed:\n${failures.join('\n')}`)
}
console.info(
  `Metadata, robots, RSS, sitemap, JSON-LD, and hreflang checks passed across ${htmlFiles.length} HTML files.`,
)
