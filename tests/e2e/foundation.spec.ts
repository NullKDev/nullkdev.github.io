import { SITE_URL } from '../../site.config.mjs'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const browserErrors = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  browserErrors.set(page, errors)
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
})

test.afterEach(({ page }) => expect(browserErrors.get(page) ?? []).toEqual([]))

const expectNoAxeViolations = async (page: Page) =>
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])

/* `body` cross-fades `color` over 180ms on a theme change, while surfaces that
   read `--surface-raised` snap immediately. Sampling contrast inside that window
   reports the incoming background against the outgoing text — a frame no reader
   settles on. Wait for the transitions themselves rather than a fixed sleep. */
const settleTransitions = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation instanceof CSSTransition)
        .map((animation) => animation.finished.catch(() => undefined)),
    ).then(() => undefined),
  )

test('home initializes and synchronizes theme, locale, fonts, and metadata', async ({
  page,
}) => {
  const fontRequests: string[] = []
  page.on('requestfinished', (request) => {
    if (request.url().includes('/fonts/')) fontRequests.push(request.url())
  })
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Carlos Alarcon',
  )
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
    'href',
    `${SITE_URL}/es/`,
  )
  const theme = page.getByRole('button', { name: 'Switch to dark theme' })
  await expect(theme).toHaveAttribute('aria-pressed', 'false')
  await theme.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(
    page.getByRole('button', { name: 'Switch to light theme' }),
  ).toHaveAttribute('aria-pressed', 'true')

  await expect.poll(() => fontRequests.length).toBeGreaterThanOrEqual(2)
  expect(
    await page.evaluate(() => ({
      body: getComputedStyle(document.body).fontFamily,
      mono: getComputedStyle(document.querySelector('.kicker')!).fontFamily,
      switzer: document.fonts.check('16px "Switzer"'),
      plex: document.fonts.check('16px "IBM Plex Mono"'),
    })),
  ).toEqual(
    expect.objectContaining({
      body: expect.stringContaining('Switzer'),
      mono: expect.stringContaining('IBM Plex Mono'),
      switzer: true,
      plex: true,
    }),
  )
  await settleTransitions(page)
  await expectNoAxeViolations(page)
})

test('autonomous Robot hero is unboxed, single-model, and announces readiness', async ({
  page,
  request,
}) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 760, 'desktop-only behavior')
  const modelRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().endsWith('.glb')) modelRequests.push(request.url())
  })
  let releaseRobot: () => void = () => undefined
  const robotGate = new Promise<void>((resolve) => {
    releaseRobot = resolve
  })
  await page.route('**/RobotExpressive.glb', async (route) => {
    await robotGate
    await route.continue()
  })

  const html = await (await request.get('/')).text()
  expect(html).toContain('data-model-loader')
  expect(html).not.toContain('signal-relay')
  expect(html).not.toContain('hero-stage')
  expect(html).not.toContain('data-model-option')
  expect(html).not.toContain('data-animation-controls')

  await page.goto('/')
  const visual = page.locator('.hero-visual')
  const loader = page.locator('[data-model-loader]')
  await expect(loader).toContainText('Assembling 3D model…')
  expect(
    await visual.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        backgroundColor: style.backgroundColor,
        borderTopWidth: style.borderTopWidth,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
      }
    }),
  ).toEqual({
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderTopWidth: '0px',
    borderRadius: '0px',
    boxShadow: 'none',
  })

  releaseRobot()
  await expect(page.locator('[data-model-showcase]')).toHaveAttribute(
    'data-ready',
    '',
  )
  await expect(loader).toHaveAttribute('data-state', 'ready')
  await expect(loader).toContainText('3D model ready.')
  await expect(loader).toBeHidden()
  expect(modelRequests.map((url) => new URL(url).pathname)).toEqual([
    '/models/RobotExpressive.glb',
  ])
  const viewerBox = await page.locator('model-viewer').boundingBox()
  expect(viewerBox?.width).toBeGreaterThan(
    (page.viewportSize()?.width ?? 0) * 0.48,
  )

  const attribution = page.getByText('RobotExpressive by Tomás Laulhé · CC0', {
    exact: true,
  })
  await expect(attribution).toBeVisible()
  expect(await attribution.evaluate((element) => element.tagName)).toBe('P')
  await expect(page.locator('.model-showcase > a')).toHaveCount(0)
  await expect(page.locator('.model-showcase > button')).toHaveCount(0)
  await expect(page.locator('.model-showcase > select')).toHaveCount(0)
  await expectNoAxeViolations(page)
})

test('Robot runs Idle then Wave then non-repeating allowed random clips', async ({
  page,
}) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 760, 'desktop-only behavior')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(() => {
    Math.random = () => 0
  })
  await page.goto('/')
  const showcase = page.locator('[data-model-showcase]')
  await expect(showcase).toHaveAttribute('data-ready', '')
  const viewer = page.locator('model-viewer')
  expect(
    await viewer.evaluate(
      (element) =>
        (element as HTMLElement & { availableAnimations: string[] })
          .availableAnimations,
    ),
  ).toEqual([
    'Dance',
    'Death',
    'Idle',
    'Jump',
    'No',
    'Running',
    'ThumbsUp',
    'Walking',
    'WalkJump',
    'Wave',
    'Yes',
  ])

  // Clips run at 0.85x, so Idle and Dance are ~3.9s each plus a 300ms gap.
  // These budgets carry that plus headroom for parallel workers.
  await expect(showcase).toHaveAttribute('data-animation', 'Idle')
  await expect
    .poll(() => showcase.getAttribute('data-animation'), { timeout: 10_000 })
    .toBe('Wave')
  await expect
    .poll(() => showcase.getAttribute('data-animation'), { timeout: 8_000 })
    .toBe('Dance')
  await expect
    .poll(() => showcase.getAttribute('data-animation'), { timeout: 10_000 })
    .toBe('Death')
})

test('Robot autostarts when persisted type scale makes the hero row taller', async ({
  page,
}) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 760, 'desktop-only behavior')
  await page.setViewportSize({ width: 800, height: 500 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem(
      'nullkdev-design-tune',
      JSON.stringify({
        vars: {
          '--ui-scale': '1.2',
          '--display-mult': '1.25',
          '--density': '1.25',
        },
        accent: null,
        fx: {},
      }),
    )
  })
  await page.reload()

  const showcase = page.locator('[data-model-showcase]')
  await expect(showcase).toHaveAttribute('data-ready', '')
  await expect(showcase).toHaveAttribute('data-animation', 'Idle')

  // The hero is taller than the band left by the sticky header, so an
  // IntersectionObserver ratio could never reach the threshold and the robot
  // stayed frozen for good. Coverage caps the requirement at what the band can
  // show, so scrolling the hero into it is now enough to start the sequence.
  await expect
    .poll(async () =>
      Number(await showcase.getAttribute('data-visibility-coverage')),
    )
    .toBeGreaterThan(0)

  let started = false
  for (const offset of [0, 30, 60, 90]) {
    await page.evaluate((y) => window.scrollTo(0, y), offset)
    await page.waitForTimeout(400)
    if ((await showcase.getAttribute('data-motion')) === 'playing') {
      started = true
      break
    }
  }
  expect(started).toBe(true)

  await expect
    .poll(async () =>
      Number(await showcase.getAttribute('data-visibility-coverage')),
    )
    .toBeGreaterThanOrEqual(0.98)
})

test('Robot pauses clips and pending gaps outside strict activity conditions', async ({
  page,
}) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 760, 'desktop-only behavior')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(() => {
    Math.random = () => 0
  })
  await page.goto('/')
  const showcase = page.locator('[data-model-showcase]')
  const viewer = page.locator('model-viewer')
  await expect(showcase).toHaveAttribute('data-animation', 'Idle')
  await expect
    .poll(() =>
      viewer.evaluate(
        (element) =>
          (element as HTMLElement & { currentTime: number }).currentTime,
      ),
    )
    .toBeGreaterThan(0.2)

  await viewer.dispatchEvent('finished')
  await expect(showcase).toHaveAttribute('data-gap-active', '')
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded()
  await expect(showcase).not.toHaveAttribute('data-gap-active', '')
  await expect(showcase).toHaveAttribute('data-motion', 'paused')
  const offscreenAnimation = await showcase.getAttribute('data-animation')
  await page.waitForTimeout(1100)
  await expect(showcase).toHaveAttribute(
    'data-animation',
    offscreenAnimation ?? '',
  )

  // The gap is a fixed 300 ms, too short to catch as an attribute without
  // racing the poll interval. Advancing to the next clip is the durable proof
  // that the pending gap resumed on re-entry.
  await showcase.scrollIntoViewIfNeeded()
  await expect
    .poll(() => showcase.getAttribute('data-animation'), { timeout: 5_000 })
    .toBe('Wave')
  await expect
    .poll(() =>
      viewer.evaluate(
        (element) =>
          (element as HTMLElement & { currentTime: number }).currentTime,
      ),
    )
    .toBeGreaterThan(0.1)

  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(showcase).toHaveAttribute('data-motion', 'paused')
  const hiddenTime = await viewer.evaluate(
    (element) => (element as HTMLElement & { currentTime: number }).currentTime,
  )
  await page.waitForTimeout(700)
  expect(
    await viewer.evaluate(
      (element) =>
        (element as HTMLElement & { currentTime: number }).currentTime,
    ),
  ).toBeCloseTo(hiddenTime, 2)
  await expect(showcase).not.toHaveAttribute('data-gap-active', '')

  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect(showcase).toHaveAttribute('data-motion', 'playing')
})

test('reduced motion still animates and context loss stops all work', async ({
  page,
}) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 760, 'desktop-only behavior')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const showcase = page.locator('[data-model-showcase]')
  const viewer = page.locator('model-viewer')
  await expect(showcase).toHaveAttribute('data-ready', '')

  // Playback is gated on visibility and WebGL health only — the clip sequence
  // runs the same for every visitor. currentTime restarts at every clip, so
  // two point samples can coincide; sample a window and require movement.
  const samples: number[] = []
  for (let i = 0; i < 8; i += 1) {
    samples.push(
      await viewer.evaluate(
        (element) =>
          (element as HTMLElement & { currentTime: number }).currentTime,
      ),
    )
    await page.waitForTimeout(150)
  }
  expect(new Set(samples.map((time) => time.toFixed(2))).size).toBeGreaterThan(
    1,
  )

  await viewer.dispatchEvent('error', {
    detail: { type: 'webglcontextlost' },
  })
  await expect(showcase).not.toHaveAttribute('data-ready', '')
  await expect(showcase).toHaveAttribute('data-motion', 'stopped')
  await expect(page.locator('[data-model-loader]')).toContainText(
    'The 3D model is unavailable.',
  )
  await expect(showcase).not.toHaveAttribute('data-gap-active', '')
})

test('load failure is honest, stable, and does not retry', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 760, 'desktop-only behavior')
  const modelRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().endsWith('.glb')) modelRequests.push(request.url())
  })
  await page.route('**/RobotExpressive.glb', (route) => route.abort('failed'))

  await page.goto('/')
  const showcase = page.locator('[data-model-showcase]')
  await expect(page.locator('[data-model-loader]')).toContainText(
    'The 3D model is unavailable.',
  )
  await expect(showcase).toHaveAttribute('data-motion', 'stopped')
  expect(modelRequests).toHaveLength(1)
  expect(modelRequests[0]).toContain('/models/RobotExpressive.glb')
  await page.waitForTimeout(1200)
  expect(modelRequests).toHaveLength(1)
  await expect(showcase).not.toHaveAttribute('data-gap-active', '')
  browserErrors.set(
    page,
    (browserErrors.get(page) ?? []).filter(
      (error) =>
        !error.includes('net::ERR_FAILED') &&
        !error.includes('TypeError: Failed to fetch'),
    ),
  )
})

test('@mobile loads only Robot near the viewport without controls or overflow', async ({
  page,
}) => {
  const modelRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().endsWith('.glb')) modelRequests.push(request.url())
  })
  await page.setViewportSize({ width: 390, height: 844 })

  await page.goto('/')
  await expect(page.locator('[data-model-showcase]')).toHaveAttribute(
    'data-ready',
    '',
  )
  expect(modelRequests.map((url) => new URL(url).pathname)).toEqual([
    '/models/RobotExpressive.glb',
  ])
  await expect(page.locator('.model-showcase > button')).toHaveCount(0)
  await expect(page.locator('.model-showcase > select')).toHaveCount(0)
  expect(
    await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    })),
  ).toEqual({ clientWidth: 390, scrollWidth: 390 })
  await expectNoAxeViolations(page)
})

test('Spanish shell and detail metadata contain no known English UI labels', async ({
  page,
}) => {
  await page.goto('/es/work/teclado-simple/')
  const body = await page.locator('body').innerText()
  for (const untranslated of [
    'Record status',
    'Status note',
    'Source ↗',
    'Open record',
    'records',
    'Rights:',
    'Provenance:',
  ]) {
    expect(body).not.toContain(untranslated)
  }
  await expect(
    page.getByRole('navigation', { name: 'Ruta de navegación' }),
  ).toBeVisible()
  await expectNoAxeViolations(page)
})

test('public records, series, and nested document adjacency resolve', async ({
  page,
}) => {
  await page.goto('/notes/gof-patterns-android/')
  await expect(page.getByRole('navigation', { name: 'Series' })).toContainText(
    'gof-android',
  )
  await page.goto('/notes/gof-patterns-android/proxy-facade/')
  const navigation = page.getByRole('navigation', { name: 'Documents' })
  await expect(navigation).toContainText('Observer and State')
  await expect(navigation).toContainText('Adapter and Factory')
  await page.getByRole('link', { name: 'View in Spanish' }).click()
  await expect(page).toHaveURL(
    /\/es\/notes\/patrones-gof-android\/proxy-facade\/$/,
  )
})

test('local Lab provides bounded localized operations without network requests', async ({
  page,
}) => {
  const externalRequests: string[] = []
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4321')) {
      externalRequests.push(request.url())
    }
  })
  await page.goto('/es/lab/formateador-json/')
  await expect(page.locator('.lab-workbench')).toHaveAttribute(
    'data-hydrated',
    'true',
  )
  await page.selectOption('select', 'minify')
  await page.getByLabel('Entrada').fill('{"signal":true}')
  await page.getByRole('button', { name: 'Ejecutar localmente' }).click()
  await expect(page.getByLabel('Resultado')).toHaveValue('{"signal":true}')
  expect(externalRequests).toEqual([])
  await expectNoAxeViolations(page)
})

test('Lab SSR and no-JS state cannot submit destructively', async ({
  browser,
  request,
}) => {
  const response = await request.get('/lab/json-formatter/')
  const html = await response.text()
  expect(html).toMatch(/<button type="submit" disabled/)
  expect(html).toContain('JavaScript is required')

  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4321',
    javaScriptEnabled: false,
  })
  const page = await context.newPage()
  await page.goto('/lab/json-formatter/')
  await expect(page.getByRole('button', { name: 'Run locally' })).toBeDisabled()
  await expect(page.getByText('JavaScript is required')).toBeVisible()
  const before = page.url()
  await page.getByLabel('Input').press('Enter')
  await expect(page).toHaveURL(before)
  await context.close()
})

test('protected fixture unlocks and remains absent from sitemap', async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get('/sitemap-0.xml')).text()
  expect(sitemap).not.toContain('/work/protected-foundation/')
  expect(sitemap).not.toContain('/es/work/protected-foundation/')

  await page.goto('/work/protected-foundation/')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  )
  await page.getByLabel('Passphrase').fill('foundation-fixture-passphrase')
  await page.getByRole('button', { name: 'Unlock in this browser' }).click()
  await expect(
    page.getByRole('heading', { name: 'Decrypted field note' }),
  ).toBeVisible()
  await expectNoAxeViolations(page)
})

test('@mobile drawer and 44px controls reset native dialog state', async ({
  page,
}) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Open navigation' })
  for (const locator of [
    trigger,
    page.getByRole('link', { name: 'View in Spanish' }),
    page.getByRole('button', { name: 'Switch to dark theme' }),
  ]) {
    const box = await locator.boundingBox()
    expect(box?.width).toBeGreaterThanOrEqual(44)
    expect(box?.height).toBeGreaterThanOrEqual(44)
  }
  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(trigger).toBeFocused()
})

test('long-form Work and Notes documents do not overflow at 320 or 390px', async ({
  page,
}) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of [
      '/work/keyboard-simple/integration/',
      '/notes/remote-compose/getting-started/',
      '/notes/gof-patterns-android/adapter-factory/',
      '/notes/pretext-text-layout/how-it-works/',
    ]) {
      await page.goto(route)
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      expect(dimensions.scrollWidth, `${route} at ${width}px`).toBe(
        dimensions.clientWidth,
      )
    }
  }
})

test('legacy routes are noindex canonical compatibility pages without loops', async ({
  page,
  request,
}) => {
  const response = await request.get('/blog/pretext/how-it-works/', {
    maxRedirects: 0,
  })
  const html = await response.text()
  expect(html).toContain('noindex, nofollow')
  expect(html).toContain(
    `rel="canonical" href="${SITE_URL}/notes/pretext-text-layout/how-it-works/"`,
  )
  expect(html).toContain('http-equiv="refresh"')
  await page.goto('/es/projects/keyboard-simple/')
  await expect(page).toHaveURL(/\/es\/work\/teclado-simple\/$/)
})

test('unknown Spanish paths recover through the real localized 404', async ({
  page,
}) => {
  await page.goto('/es/unknown-archive-record/')
  browserErrors.set(page, [])
  await expect(page).toHaveURL(/\/es\/404\/$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Señal no encontrada.',
  )
  await expect(
    page.getByRole('link', { name: 'Ver en inglés' }),
  ).toHaveAttribute('href', '/')
  await expectNoAxeViolations(page)
})

test('primary and secondary routes remain accessible in both themes and locales', async ({
  page,
}) => {
  for (const route of [
    '/work/',
    '/lab/',
    '/notes/',
    '/gallery/',
    '/about/',
    '/tags/',
    '/colophon/',
    '/es/work/',
    '/es/lab/',
    '/es/notes/',
    '/es/gallery/',
    '/es/about/',
    '/es/tags/',
    '/es/colophon/',
  ]) {
    await page.goto(route)
    await expectNoAxeViolations(page)
    await page.locator('[data-theme-toggle]').click()
    await settleTransitions(page)
    await expectNoAxeViolations(page)
  }
})
