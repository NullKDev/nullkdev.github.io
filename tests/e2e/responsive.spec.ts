import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { devices, expect, test, type Page } from '@playwright/test'
import {
  auditLayout,
  PROMISED_TARGETS,
  type Violation,
} from './responsive-audit'

/* The responsive sweep: every page type, on mobile, tablet and desktop, in
   both themes, against layout invariants read from the rendered page (see
   responsive-audit.ts for each rule and why it exists).

   Mobile and tablet are emulated devices, not narrow windows: touch, a mobile
   viewport and a 2–3× pixel ratio, so `(hover: none)` and `(pointer: coarse)`
   match and hover-only UI is exercised the way a phone meets it.

   On failure a full-page screenshot lands in test-results/responsive/.
   RESPONSIVE_SHOTS=all saves one for every page × device × theme; otherwise a
   small sample is kept for review. */

type DeviceClass = 'mobile' | 'tablet' | 'desktop'
type Device = {
  label: string
  kind: DeviceClass
  width: number
  height: number
  scale: number
}

const DEVICES: Device[] = [
  {
    kind: 'mobile',
    label: 'iPhone SE (1st gen)',
    width: 320,
    height: 640,
    scale: 2,
  },
  { kind: 'mobile', label: 'Galaxy S9+', width: 360, height: 740, scale: 3 },
  { kind: 'mobile', label: 'iPhone 13', width: 390, height: 844, scale: 3 },
  { kind: 'mobile', label: 'iPhone 11', width: 414, height: 896, scale: 2 },
  {
    kind: 'tablet',
    label: 'iPad Mini portrait',
    width: 768,
    height: 1024,
    scale: 2,
  },
  {
    kind: 'tablet',
    label: 'iPad Air portrait',
    width: 820,
    height: 1180,
    scale: 2,
  },
  {
    kind: 'tablet',
    label: 'iPad Mini landscape',
    width: 1024,
    height: 768,
    scale: 2,
  },
  { kind: 'desktop', label: 'laptop', width: 1280, height: 800, scale: 1 },
  { kind: 'desktop', label: 'desktop', width: 1440, height: 900, scale: 1 },
  { kind: 'desktop', label: 'full HD', width: 1920, height: 1080, scale: 1 },
]

/* Chromium user agents: the engine is Chromium, so an iOS agent would lie. */
const AGENTS: Record<DeviceClass, string> = {
  mobile: devices['Pixel 7'].userAgent,
  tablet: devices['Galaxy Tab S4'].userAgent,
  desktop: devices['Desktop Chrome'].userAgent,
}

/* One of every page type. A path that 404s is the 404 page itself. */
const PAGES = [
  '/',
  '/es/',
  '/work/',
  '/work/keyboard-simple/',
  '/lab/',
  '/lab/subnet-calculator/',
  '/notes/',
  '/notes/type/article/',
  '/notes/2/',
  '/notes/android-17/',
  '/notes/codex-security-precision-gap/',
  '/notes/codex-security-precision-gap/ci-integration/',
  '/gallery/',
  '/es/gallery/',
  '/gallery/san-francisco/',
  '/about/',
  '/colophon/',
  '/tags/',
  '/this-page-does-not-exist/',
]

const SAMPLE_PAGES = new Set([
  '/',
  '/es/gallery/',
  '/notes/codex-security-precision-gap/',
])
const SAMPLE_WIDTHS = new Set([360, 820, 1440])
const SHOTS_DIR = join('test-results', 'responsive')

const slug = (path: string) =>
  path.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home'

const setTheme = async (page: Page, theme: 'light' | 'dark') => {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
  await page.evaluate((value) => {
    document.documentElement.dataset.theme = value
  }, theme)
  // Surfaces cross-fade colour for ~180ms; layout does not depend on it, but
  // screenshots do.
  await page.waitForTimeout(250)
}

const format = (violations: Violation[]) =>
  violations.map((v) => `  [${v.check}] ${v.element} — ${v.detail}`).join('\n')

/* An untested threshold is decoration: each case re-creates a bug the sweep
   exists for, on the real page, and the audit must name it. */
const REGRESSIONS = [
  {
    name: 'picture sources back in the contact sheet grid',
    path: '/es/gallery/',
    css: '.gallery-sheet__contact source { display: block !important }',
    check: 'grid-implicit-rows',
  },
  {
    name: 'the compact status chip losing the cascade',
    path: '/es/gallery/',
    css: '.status-chip--sm { margin-bottom: 1.35rem !important }',
    check: 'flex-off-centre',
  },
  {
    name: 'a fixed-width box wider than a phone',
    path: '/notes/',
    css: '.note-row__title { min-width: 30rem }',
    check: 'element-overflow',
  },
  {
    name: 'a header control squeezed under 44px',
    path: '/notes/',
    css: '.icon-control { width: 2rem !important; min-width: 0 !important }',
    check: 'target-44',
  },
  {
    name: 'a page wider than the screen',
    path: '/notes/',
    css: '.notes-stream { min-width: 40rem }',
    check: 'page-overflow',
  },
  {
    name: 'a summary cut off by a fixed height',
    path: '/notes/',
    css: '.note-row__dek { height: 0.6rem; overflow: hidden }',
    check: 'text-clipped',
  },
  {
    name: 'a thumbnail squashed out of its aspect ratio',
    path: '/es/gallery/',
    css: '.gallery-sheet__contact img { height: 400px !important; object-fit: fill !important }',
    check: 'image-stretched',
  },
  {
    name: 'topic links drawn on top of each other',
    path: '/notes/',
    css: '.note-row__topics li + li a { margin-left: -2.5rem }',
    check: 'target-overlap',
  },
  {
    name: 'a link revealed only on hover',
    path: '/notes/',
    css: '.note-row__topics a { opacity: 0 }',
    check: 'target-hidden-without-hover',
  },
]

test.describe('the audit catches what it exists for', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  test.beforeEach(() => {
    test.skip(
      test.info().project.name !== 'chromium',
      'device matrix is self-contained',
    )
  })
  for (const regression of REGRESSIONS) {
    test(regression.name, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
      await page.goto(regression.path, { waitUntil: 'load' })
      expect(
        await page.evaluate(auditLayout, PROMISED_TARGETS),
        'clean before',
      ).toEqual([])
      await page.addStyleTag({ content: regression.css })
      const checks = (await page.evaluate(auditLayout, PROMISED_TARGETS)).map(
        (v) => v.check,
      )
      expect(checks).toContain(regression.check)
    })
  }
})

for (const device of DEVICES) {
  const name = `${device.kind} ${device.width}x${device.height} (${device.label})`
  test.describe(name, () => {
    test.use({
      viewport: { width: device.width, height: device.height },
      deviceScaleFactor: device.scale,
      isMobile: device.kind !== 'desktop',
      hasTouch: device.kind !== 'desktop',
      userAgent: AGENTS[device.kind],
    })

    test.beforeEach(() => {
      // The matrix brings its own devices; running it again under the
      // project-level Pixel 7 would only repeat it.
      test.skip(
        test.info().project.name !== 'chromium',
        'device matrix is self-contained',
      )
    })

    for (const path of PAGES) {
      test(`layout holds on ${path}`, async ({ page }) => {
        await page.emulateMedia({
          colorScheme: 'light',
          reducedMotion: 'reduce',
        })
        await page.goto(path, { waitUntil: 'load' })
        await page.evaluate(() => document.fonts.ready)
        if (device.kind !== 'desktop')
          expect(
            await page.evaluate(() => matchMedia('(hover: none)').matches),
            'touch emulation',
          ).toBe(true)

        const failures: string[] = []
        for (const theme of ['light', 'dark'] as const) {
          await setTheme(page, theme)
          const violations = await page.evaluate(auditLayout, PROMISED_TARGETS)
          const where = `${path} · ${name} · ${theme}`
          const keep =
            violations.length > 0 ||
            process.env.RESPONSIVE_SHOTS === 'all' ||
            (SAMPLE_PAGES.has(path) && SAMPLE_WIDTHS.has(device.width))
          if (keep) {
            mkdirSync(SHOTS_DIR, { recursive: true })
            const file = join(
              SHOTS_DIR,
              `${device.kind}-${device.width}x${device.height}-${theme}-${slug(path)}.png`,
            )
            await page.screenshot({ path: file, fullPage: true })
            if (violations.length)
              failures.push(`${where} (${file})\n${format(violations)}`)
          }
        }
        expect(failures, failures.join('\n\n')).toEqual([])
      })
    }
  })
}
