/**
 * Seals the Content-Security-Policy of every built page.
 *
 * GitHub Pages serves static files and gives you no header configuration, so
 * the policy has to travel inside the document. That rules out a nonce — there
 * is no request to generate one per — which leaves hashes.
 *
 * Astro inlines small component scripts into the HTML rather than emitting
 * them as files, and there is no build flag to stop it. Hand-maintaining those
 * hashes would be a trap: the gallery pages carry data payloads that change
 * whenever the content changes, so a checked-in list would rot silently and the
 * page would break in production while every local check stayed green.
 *
 * So the hashes are derived from the bytes that actually shipped, after the
 * build, on the same footing as the link and metadata checks. Edit anything and
 * the policy follows on the next build.
 *
 * The alternative — `script-src 'unsafe-inline'` — would let any injected
 * `<script>` execute, which is the single thing a CSP exists to prevent.
 */
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const DIST = 'dist'

/** Types the browser executes. Anything else in a <script> is inert data. */
const EXECUTABLE_TYPES = new Set([
  '',
  'text/javascript',
  'application/javascript',
  'module',
  'importmap',
])

/** model-viewer decodes Draco-compressed geometry through a WASM module. */
const WASM = "'wasm-unsafe-eval'"

/**
 * Google Analytics is the one third-party the archive talks to, and only when a
 * measurement ID is configured. Read from the environment rather than assumed:
 * a build without the ID ships no tag, so it must also ship no allowlist —
 * otherwise every fork would carry a hole for a script it never loads.
 *
 * `region1..4` exist because GA4 routes collection through regional endpoints;
 * omitting them silently drops events for readers outside the default region.
 */
const analyticsEnabled = /^G-[A-Z0-9]{6,}$/.test(
  process.env.PUBLIC_GOOGLE_ANALYTICS_ID ?? '',
)
const GA_SCRIPT = 'https://www.googletagmanager.com'
const GA_COLLECT = [
  'https://www.google-analytics.com',
  'https://region1.google-analytics.com',
  'https://region2.google-analytics.com',
  'https://region3.google-analytics.com',
  'https://region4.google-analytics.com',
]

const allow = (base: string, ...extra: string[]): string =>
  analyticsEnabled ? [base, ...extra].join(' ') : base

const BASE = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  allow("img-src 'self' data: blob:", GA_SCRIPT, ...GA_COLLECT),
  "font-src 'self'",
  allow("connect-src 'self'", GA_SCRIPT, ...GA_COLLECT),
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-src 'none'",
  'upgrade-insecure-requests',
]

const htmlFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return htmlFiles(path)
      return entry.name.endsWith('.html') ? [path] : []
    }),
  )
  return nested.flat()
}

const typeOf = (attributes: string): string =>
  (attributes.match(/\btype\s*=\s*["']([^"']*)["']/i)?.[1] ?? '')
    .trim()
    .toLowerCase()

/** Hashes every executable inline script on the page, in document order. */
const scriptHashes = (html: string): string[] => {
  const hashes = new Set<string>()
  const pattern = /<script(?![^>]*\bsrc\s*=)([^>]*)>([\s\S]*?)<\/script>/gi

  for (const [, attributes, body] of html.matchAll(pattern)) {
    if (!EXECUTABLE_TYPES.has(typeOf(attributes))) continue
    if (body.trim() === '') continue
    hashes.add(createHash('sha256').update(body).digest('base64'))
  }

  return [...hashes].map((hash) => `'sha256-${hash}'`)
}

const files = await htmlFiles(DIST)
let sealed = 0
let maxHashes = 0

for (const file of files) {
  const html = await readFile(file, 'utf8')
  const hashes = scriptHashes(html)
  maxHashes = Math.max(maxHashes, hashes.length)

  const policy = [
    allow(`script-src 'self' ${WASM} ${hashes.join(' ')}`.trimEnd(), GA_SCRIPT),
    ...BASE,
  ].join('; ')

  const patched = html.replace(
    /(<meta http-equiv="Content-Security-Policy" content=")[^"]*(")/i,
    (_match, open: string, close: string) => `${open}${policy}${close}`,
  )

  if (patched === html) {
    console.error(`No Content-Security-Policy meta tag to seal in ${file}.`)
    process.exit(1)
  }

  await writeFile(file, patched)
  sealed += 1
}

console.log(
  `Content-Security-Policy sealed across ${sealed} HTML files ` +
    `(up to ${maxHashes} inline script hashes per page).`,
)
