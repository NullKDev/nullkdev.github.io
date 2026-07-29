import { readdir, readFile, stat } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'

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

const exists = async (path: string) =>
  stat(path)
    .then(() => true)
    .catch(() => false)

const failures: string[] = []
const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'))
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  const values = [
    ...html.matchAll(/(?:href|src|component-url|renderer-url)="([^"]+)"/g),
  ].map((match) => match[1])
  for (const value of values) {
    if (
      value.startsWith('#') ||
      value.startsWith('mailto:') ||
      value.startsWith('data:') ||
      value.startsWith('blob:')
    ) {
      continue
    }
    let url: URL
    try {
      url = new URL(value, 'https://nullkdev.github.io')
    } catch {
      failures.push(`${file}: invalid URL ${value}`)
      continue
    }
    if (url.origin !== 'https://nullkdev.github.io') continue
    const pathname = decodeURIComponent(url.pathname)
    const target = pathname.endsWith('/')
      ? join(dist, pathname, 'index.html')
      : extname(pathname)
        ? join(dist, pathname)
        : join(dist, pathname, 'index.html')
    if (!(await exists(target))) failures.push(`${file}: missing ${pathname}`)
  }
}

if (failures.length > 0) {
  throw new Error(`Built-link crawl failed:\n${failures.join('\n')}`)
}
console.info(`Built-link crawl passed across ${htmlFiles.length} HTML files.`)
