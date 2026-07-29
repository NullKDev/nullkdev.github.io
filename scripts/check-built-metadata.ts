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
  if (
    !html.includes(
      `<meta property="og:image" content="${SITE_URL}/og/signal-archive.png"`,
    )
  ) {
    failures.push(`${file}: missing PNG social image`)
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
