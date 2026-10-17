/**
 * Seals the Content-Security-Policy of every built page.
 *
 * GitHub Pages serves static files and gives you no header configuration, so
 * the policy has to travel inside the document. That rules out a nonce — there
 * is no request to generate one per — which leaves hashes.
 *
 * Astro inlines its hydration runtime into the HTML whenever a page carries an
 * island, and there is no build flag to stop it. Hand-maintaining those hashes
 * would be a trap: an Astro upgrade changes the bytes, so a checked-in list
 * would rot silently and the page would break in production while every local
 * check stayed green.
 *
 * So the hashes are derived from the bytes that actually shipped, after the
 * build, on the same footing as the link and metadata checks. Edit anything and
 * the policy follows on the next build.
 *
 * The alternative — `script-src 'unsafe-inline'` — would let any injected
 * `<script>` execute, which is the single thing a CSP exists to prevent.
 *
 * Hashing whatever shipped has the opposite trap: a script injected at build
 * time — raw HTML in an entry, a JSON payload that breaks out of its element, a
 * compromised dependency writing markup — would be hashed and allowed like any
 * other. So only inline scripts this archive expects are sealed:
 *
 * - any executable script in `<head>`, which only the layout and pages write;
 * - Astro's hydration runtime, compared byte for byte against the copy in the
 *   installed `astro` package, wherever an island puts it — `<article>`
 *   included, because islands live inside entries;
 * - a body script that opts in with `data-csp-inline`.
 *
 * Component scripts are not on that list. Astro would inline the small ones as
 * a bare `<script type="module">`, which is indistinguishable from an injected
 * one, so `vite.build.assetsInlineLimit` in `astro.config.mjs` keeps every
 * processed script an external `/_astro/*.js` file that `'self'` covers.
 *
 * Any other executable inline script fails the build, naming the file.
 */
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import islandScript from 'astro/runtime/server/astro-island.prebuilt.js'
import idleScript from 'astro/runtime/client/idle.prebuilt.js'
import loadScript from 'astro/runtime/client/load.prebuilt.js'
import mediaScript from 'astro/runtime/client/media.prebuilt.js'
import onlyScript from 'astro/runtime/client/only.prebuilt.js'
import visibleScript from 'astro/runtime/client/visible.prebuilt.js'
import { fromHtml } from 'hast-util-from-html'

const DIST = 'dist'

/**
 * The classic scripts Astro writes in front of the first island of each kind:
 * the `<astro-island>` element definition and one loader per `client:*`
 * directive. Read from the installed package so an Astro upgrade moves the
 * allowlist with it.
 */
export const ASTRO_RUNTIME_SCRIPTS: ReadonlySet<string> = new Set([
  islandScript,
  idleScript,
  loadScript,
  mediaScript,
  onlyScript,
  visibleScript,
])

/** Types the browser executes. Anything else in a <script> is inert data. */
const EXECUTABLE_TYPES = new Set([
  '',
  'text/javascript',
  'application/javascript',
  'module',
  'importmap',
])

/** Where only content renders; named in the failure so it can be traced. */
const CONTENT_REGIONS = new Set(['article', 'svg', 'template'])

const OPT_IN = 'dataCspInline'

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
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-src 'none'",
  'upgrade-insecure-requests',
]

/*
 * `'wasm-unsafe-eval'` is granted to the pages that render the 3D hero and to
 * no other. model-viewer bundles three.js's meshopt decoder as inline
 * WebAssembly and compiles it when the module loads, whether or not the model
 * is compressed — the robot GLB is not, yet Chromium reports a CSP violation
 * the moment the hero imports model-viewer without the grant. Everywhere else
 * the grant would only widen what an injected script could do.
 */
const WASM = "'wasm-unsafe-eval'"

/** True when the page renders the model-viewer hero (`ModelShowcase`). */
export const loadsModelViewer = (html: string): boolean =>
  /<[a-z][\w-]*\s[^>]*\bdata-model-showcase\b/i.test(html)

export interface ScriptPolicyOptions {
  analytics: boolean
  wasm: boolean
}

/** The `script-src` directive for a page carrying these inline hashes. */
export const buildScriptPolicy = (
  hashes: readonly string[],
  { analytics, wasm }: ScriptPolicyOptions,
): string =>
  [
    `script-src 'self'`,
    ...(wasm ? [WASM] : []),
    ...hashes,
    ...(analytics ? [GA_SCRIPT] : []),
  ].join(' ')

export interface InlineScriptViolation {
  reason: string
  snippet: string
}

export interface InlineScriptReport {
  /** CSP source expressions, deduplicated, in document order. */
  hashes: string[]
  violations: InlineScriptViolation[]
}

type HastRoot = ReturnType<typeof fromHtml>
type HastNode = HastRoot | HastRoot['children'][number]
type HastElement = Extract<HastNode, { type: 'element' }>

const typeOf = (element: HastElement): string =>
  String(element.properties.type ?? '')
    .trim()
    .toLowerCase()

/** The raw bytes between the tags, which is what the browser hashes. */
const rawBody = (html: string, element: HastElement): string => {
  const first = element.children[0]?.position?.start.offset
  const last = element.children.at(-1)?.position?.end.offset
  return first === undefined || last === undefined
    ? ''
    : html.slice(first, last)
}

const verdict = (
  element: HastElement,
  body: string,
  ancestors: readonly string[],
  runtimeScripts: ReadonlySet<string>,
): string | null => {
  if (ancestors.includes('head')) return null
  if (element.properties[OPT_IN] !== undefined) return null

  const type = typeOf(element)
  const region = ancestors.find((name) => CONTENT_REGIONS.has(name))

  if (type === '' && runtimeScripts.has(body)) return null
  return region
    ? `an unexpected inline script inside <${region}>`
    : 'an unexpected inline script in <body>'
}

/**
 * Splits a page's executable inline scripts into the hashes to seal and the
 * ones that must fail the build. Pure: the caller decides what to do with it.
 */
export const classifyInlineScripts = (
  html: string,
  runtimeScripts: ReadonlySet<string> = ASTRO_RUNTIME_SCRIPTS,
): InlineScriptReport => {
  const hashes = new Set<string>()
  const violations: InlineScriptViolation[] = []

  const visit = (node: HastNode, ancestors: readonly string[]): void => {
    if (node.type === 'element' && node.tagName === 'script') {
      if (node.properties.src !== undefined) return
      if (!EXECUTABLE_TYPES.has(typeOf(node))) return
      const body = rawBody(html, node)
      if (body.trim() === '') return

      const reason = verdict(node, body, ancestors, runtimeScripts)
      if (reason) {
        violations.push({
          reason,
          snippet: body.trim().slice(0, 80).replace(/\s+/g, ' '),
        })
        return
      }
      hashes.add(createHash('sha256').update(body).digest('base64'))
      return
    }
    if (!('children' in node)) return
    const next =
      node.type === 'element' ? [...ancestors, node.tagName] : ancestors
    for (const child of node.children) visit(child, next)
    if (node.type === 'element' && node.tagName === 'template') {
      for (const child of node.content?.children ?? []) visit(child, next)
    }
  }

  visit(fromHtml(html), [])
  return {
    hashes: [...hashes].map((hash) => `'sha256-${hash}'`),
    violations,
  }
}

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

const run = async (): Promise<void> => {
  const files = await htmlFiles(DIST)
  const failures: string[] = []
  let sealed = 0
  let maxHashes = 0

  for (const file of files) {
    const html = await readFile(file, 'utf8')
    const { hashes, violations } = classifyInlineScripts(html)

    for (const { reason, snippet } of violations) {
      failures.push(`${file}: ${reason}: ${snippet}`)
    }
    if (violations.length > 0) continue
    maxHashes = Math.max(maxHashes, hashes.length)

    const scriptPolicy = buildScriptPolicy(hashes, {
      analytics: analyticsEnabled,
      wasm: loadsModelViewer(html),
    })
    const policy = [scriptPolicy, ...BASE].join('; ')

    const patched = html.replace(
      /(<meta http-equiv="Content-Security-Policy" content=")[^"]*(")/i,
      (_match, open: string, close: string) => `${open}${policy}${close}`,
    )

    if (patched === html && !html.includes(policy)) {
      console.error(`No Content-Security-Policy meta tag to seal in ${file}.`)
      process.exit(1)
    }

    await writeFile(file, patched)
    sealed += 1
  }

  if (failures.length > 0) {
    console.error(
      `Refusing to seal ${failures.length} unexpected inline script(s). ` +
        'Move the code into a processed <script>, or mark a deliberate ' +
        'is:inline body script with data-csp-inline:\n' +
        failures.map((failure) => `  ${failure}`).join('\n'),
    )
    process.exit(1)
  }

  console.log(
    `Content-Security-Policy sealed across ${sealed} HTML files ` +
      `(up to ${maxHashes} inline script hashes per page).`,
  )
}

if (import.meta.main) await run()
