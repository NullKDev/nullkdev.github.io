import { createHash } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import {
  ASTRO_RUNTIME_SCRIPTS,
  buildScriptPolicy,
  classifyInlineScripts,
  loadsModelViewer,
} from '../../scripts/apply-csp'

const hashOf = (body: string) =>
  `'sha256-${createHash('sha256').update(body).digest('base64')}'`

const page = (head: string, body: string) =>
  `<!doctype html><html><head><meta charset="utf-8">${head}</head><body>${body}</body></html>`

const runtimeScript = [...ASTRO_RUNTIME_SCRIPTS][0] as string

describe('inline script sealing', () => {
  it('hashes an unmarked executable script in <head>, byte for byte', () => {
    const body = ";(() => { document.documentElement.dataset.js = 'true' })()"
    const report = classifyInlineScripts(page(`<script>${body}</script>`, ''))

    expect(report.violations).toEqual([])
    expect(report.hashes).toEqual([hashOf(body)])
  })

  it('hashes a body script that opts in with data-csp-inline', () => {
    const body = 'console.info(1)'
    const report = classifyInlineScripts(
      page('', `<main><script data-csp-inline>${body}</script></main>`),
    )

    expect(report.violations).toEqual([])
    expect(report.hashes).toEqual([hashOf(body)])
  })

  it('hashes a module script in <head>, which only the layout writes', () => {
    const body = 'var e=document.querySelector(`[data-gallery-pieces]`)'
    const report = classifyInlineScripts(
      page(`<script type="module">${body}</script>`, ''),
    )

    expect(report.violations).toEqual([])
    expect(report.hashes).toEqual([hashOf(body)])
  })

  /* Component scripts ship as `/_astro/*.js` files (`assetsInlineLimit` in
     astro.config.mjs), so a bare inline module in the body is no longer
     something Astro writes — and a build-time injection would look exactly
     like one. */
  it('rejects a bare module script in the body', () => {
    const body = 'var e=document.querySelector(`[data-gallery-pieces]`)'
    const report = classifyInlineScripts(
      page('', `<main><script type="module">${body}</script></main>`),
    )

    expect(report.hashes).toEqual([])
    expect(report.violations).toHaveLength(1)
    expect(report.violations[0]?.reason).toMatch(/<body>/)
  })

  it("hashes Astro's hydration runtime even inside an <article>", () => {
    const report = classifyInlineScripts(
      page(
        '',
        `<main><article><script>${runtimeScript}</script></article></main>`,
      ),
    )

    expect(report.violations).toEqual([])
    expect(report.hashes).toEqual([hashOf(runtimeScript)])
  })

  it('rejects an unmarked classic script in the body', () => {
    const report = classifyInlineScripts(
      page('', '<main><script>alert(1)</script></main>'),
    )

    expect(report.hashes).toEqual([])
    expect(report.violations).toHaveLength(1)
    expect(report.violations[0]?.snippet).toContain('alert(1)')
  })

  it('rejects a module script inside an <article>', () => {
    const report = classifyInlineScripts(
      page('', '<article><script type="module">alert(1)</script></article>'),
    )

    expect(report.hashes).toEqual([])
    expect(report.violations[0]?.reason).toMatch(/<article>/)
  })

  it('rejects a module script inside an <svg>', () => {
    const report = classifyInlineScripts(
      page('', '<svg><script type="module">alert(1)</script></svg>'),
    )

    expect(report.hashes).toEqual([])
    expect(report.violations).toHaveLength(1)
  })

  it('rejects a near-copy of the hydration runtime', () => {
    const report = classifyInlineScripts(
      page('', `<article><script>${runtimeScript};alert(1)</script></article>`),
    )

    expect(report.hashes).toEqual([])
    expect(report.violations).toHaveLength(1)
  })

  it('rejects a module script that carries extra attributes', () => {
    const report = classifyInlineScripts(
      page('', '<main><script type="module" async>alert(1)</script></main>'),
    )

    expect(report.hashes).toEqual([])
    expect(report.violations).toHaveLength(1)
  })

  it('treats an unquoted type attribute the way the browser does', () => {
    const report = classifyInlineScripts(
      page('', '<article><script type=module>alert(1)</script></article>'),
    )

    expect(report.violations).toHaveLength(1)
  })

  it('rejects an import map in the body', () => {
    const report = classifyInlineScripts(
      page('', '<script type="importmap">{"imports":{}}</script>'),
    )

    expect(report.violations).toHaveLength(1)
  })

  it('ignores inert data blocks, empty scripts and external scripts', () => {
    const report = classifyInlineScripts(
      page(
        '<script type="application/ld+json">{"@type":"WebPage"}</script>',
        '<main><script type="application/json">{"a":1}</script>' +
          '<script></script><script type="module" src="/_astro/a.js"></script></main>',
      ),
    )

    expect(report).toEqual({ hashes: [], violations: [] })
  })

  it('deduplicates identical scripts', () => {
    const report = classifyInlineScripts(
      page(
        '',
        `<script>${runtimeScript}</script><script>${runtimeScript}</script>`,
      ),
    )

    expect(report.hashes).toEqual([hashOf(runtimeScript)])
  })
})

describe('script-src policy', () => {
  const hash = hashOf('a')

  it('lists self and the page hashes, and Google only with analytics on', () => {
    expect(buildScriptPolicy([hash], { analytics: false, wasm: false })).toBe(
      `script-src 'self' ${hash}`,
    )
    expect(buildScriptPolicy([hash], { analytics: true, wasm: false })).toBe(
      `script-src 'self' ${hash} https://www.googletagmanager.com`,
    )
  })

  it("grants 'wasm-unsafe-eval' only when asked to", () => {
    expect(
      buildScriptPolicy([hash], { analytics: false, wasm: false }),
    ).not.toContain('wasm-unsafe-eval')
    expect(buildScriptPolicy([hash], { analytics: false, wasm: true })).toBe(
      `script-src 'self' 'wasm-unsafe-eval' ${hash}`,
    )
  })

  it('detects the model-viewer hero by its element, not by mentions of it', () => {
    expect(
      loadsModelViewer(
        page('', '<div class="hero" data-model-showcase></div>'),
      ),
    ).toBe(true)
    expect(
      loadsModelViewer(
        page('', '<pre><code>&lt;div data-model-showcase&gt;</code></pre>'),
      ),
    ).toBe(false)
    expect(loadsModelViewer(page('', '<main></main>'))).toBe(false)
  })
})
