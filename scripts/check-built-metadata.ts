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
  if (!canonical) failures.push(`${file}: missing canonical`)
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
  if (!/<link rel="alternate" hreflang="(?:en|es)"/.test(html)) {
    failures.push(`${file}: missing hreflang`)
  }
  if (noindex && sitemap.includes(`<loc>${sourceUrl}</loc>`)) {
    failures.push(`${file}: noindex source appears in sitemap`)
  }
  for (const match of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(match[1])
    } catch {
      failures.push(`${file}: invalid JSON-LD`)
    }
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
