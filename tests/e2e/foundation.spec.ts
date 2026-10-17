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

/* The Robot is ready once model-viewer has parsed the GLB and drawn a frame.
   Locally that takes ~2–2.6s even with the CPU throttled 4×, but CI runners
   draw WebGL in software (SwiftShader), which CPU throttling does not model,
   and the default 5s expect timeout left too little margin: these assertions
   failed intermittently there. The requirement is that it becomes ready, not
   that it does so within 5s, so readiness waits get their own budget. */
const MODEL_READY = { timeout: 15_000 }

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

/* Some requirements are about what must NOT happen over a stretch of time — a
   clip that must not advance while paused, a model that must not be requested
   again. A Playwright sleep followed by one sample proves only the last
   instant. These watch the whole window inside the page instead: every
   attribute mutation is recorded, every frame's `currentTime` is sampled. */
const attributeChangesDuring = (
  locator: ReturnType<Page['locator']>,
  attribute: string,
  windowMs: number,
) =>
  locator.evaluate(
    (element, { attribute, windowMs }) =>
      new Promise<string[]>((resolve) => {
        const seen: string[] = []
        const observer = new MutationObserver(() =>
          seen.push(element.getAttribute(attribute) ?? ''),
        )
        observer.observe(element, { attributeFilter: [attribute] })
        window.setTimeout(() => {
          observer.disconnect()
          resolve(seen)
        }, windowMs)
      }),
    { attribute, windowMs },
  )

const currentTimesDuring = (
  locator: ReturnType<Page['locator']>,
  windowMs: number,
) =>
  locator.evaluate(
    (element, windowMs) =>
      new Promise<number[]>((resolve) => {
        const media = element as HTMLElement & { currentTime: number }
        const samples: number[] = []
        const started = performance.now()
        const sample = (now: number) => {
          samples.push(media.currentTime)
          if (now - started < windowMs) requestAnimationFrame(sample)
          else resolve(samples)
        }
        requestAnimationFrame(sample)
      }),
    windowMs,
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
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
    'href',
    `${SITE_URL}/`,
  )
  // model-viewer compiles its bundled WebAssembly decoder on import, so the
  // hero page needs the grant; a page without the model must not carry it.
  await expect(
    page.locator('meta[http-equiv="Content-Security-Policy"]'),
  ).toHaveAttribute('content', /'wasm-unsafe-eval'/)
  expect(await (await page.request.get('/notes/')).text()).not.toContain(
    'wasm-unsafe-eval',
  )
  // A toggle button: one fixed name, and only `aria-pressed` changes.
  const theme = page.getByRole('button', { name: 'Dark theme', exact: true })
  await expect(theme).toHaveAttribute('aria-pressed', 'false')
  await theme.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(theme).toHaveAttribute('aria-pressed', 'true')
  await expect(theme).toHaveAccessibleName('Dark theme')

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
    MODEL_READY,
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
  // The one control is the reader's pause (WCAG 2.2.2) — no clip pickers.
  await expect(page.locator('.model-showcase > button')).toHaveCount(1)
  await expect(
    page.getByRole('button', { name: 'Pause the robot animation' }),
  ).toBeVisible()
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
  await expect(showcase).toHaveAttribute('data-ready', '', MODEL_READY)
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
  await expect(showcase).toHaveAttribute('data-ready', '', MODEL_READY)
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

  // Each offset gets the same 400 ms it had as a fixed sleep, but as an upper
  // bound: the step ends as soon as playback starts.
  let started = false
  for (const offset of [0, 30, 60, 90]) {
    await page.evaluate((y) => window.scrollTo(0, y), offset)
    started = await expect(showcase)
      .toHaveAttribute('data-motion', 'playing', { timeout: 400 })
      .then(
        () => true,
        () => false,
      )
    if (started) break
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
  // Not one clip change during the whole 1.1 s window, not just at its end.
  expect(
    await attributeChangesDuring(showcase, 'data-animation', 1100),
  ).toEqual([])
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
  // Every frame across 700 ms stays on the paused time.
  for (const time of await currentTimesDuring(viewer, 700)) {
    expect(time).toBeCloseTo(hiddenTime, 2)
  }
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

test('Robot pause control stops clips and gaps until the reader resumes', async ({
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
  const toggle = page.getByRole('button', {
    name: 'Pause the robot animation',
  })
  const currentTime = () =>
    viewer.evaluate(
      (element) =>
        (element as HTMLElement & { currentTime: number }).currentTime,
    )

  await expect(showcase).toHaveAttribute('data-ready', '', MODEL_READY)
  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  const box = await toggle.boundingBox()
  expect(box?.width).toBeGreaterThanOrEqual(44)
  expect(box?.height).toBeGreaterThanOrEqual(44)
  await expect.poll(currentTime).toBeGreaterThan(0.2)

  // Keyboard first: the control is reachable and operable without a pointer.
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(showcase).toHaveAttribute('data-motion', 'paused')
  const pausedTime = await currentTime()
  for (const time of await currentTimesDuring(viewer, 700)) {
    expect(time).toBeCloseTo(pausedTime, 2)
  }

  // A clip ending while paused must not schedule the next one.
  await viewer.dispatchEvent('finished')
  await expect(showcase).not.toHaveAttribute('data-gap-active', '')
  await expect(showcase).toHaveAttribute('data-motion', 'paused')
  expect(
    await attributeChangesDuring(showcase, 'data-animation', 1100),
  ).toEqual([])
  await expect(showcase).toHaveAttribute('data-animation', 'Idle')

  // The pause outlives a reload for the rest of the session.
  await page.reload()
  await expect(showcase).toHaveAttribute('data-ready', '', MODEL_READY)
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(showcase).toHaveAttribute('data-motion', 'paused')

  // Resuming restarts the sequence where the activity gate allows.
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(showcase).toHaveAttribute('data-motion', 'playing')
  await expect.poll(currentTime).toBeGreaterThan(0.2)
  await expectNoAxeViolations(page)
})

test('reduced motion still animates and context loss stops all work', async ({
  page,
}) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 760, 'desktop-only behavior')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const showcase = page.locator('[data-model-showcase]')
  const viewer = page.locator('model-viewer')
  await expect(showcase).toHaveAttribute('data-ready', '', MODEL_READY)

  // Playback is gated on visibility and WebGL health only — the clip sequence
  // runs the same for every visitor. currentTime restarts at every clip, so
  // two point samples can coincide; sample a window and require movement.
  const samples = await currentTimesDuring(viewer, 1200)
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
  // No retry for the whole 1.2 s window: waiting for a second request must
  // time out.
  await expect(
    page.waitForRequest((request) => request.url().endsWith('.glb'), {
      timeout: 1200,
    }),
  ).rejects.toThrow()
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

test('@mobile loads only Robot near the viewport without clip controls or overflow', async ({
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
    MODEL_READY,
  )
  expect(modelRequests.map((url) => new URL(url).pathname)).toEqual([
    '/models/RobotExpressive.glb',
  ])
  // Only the reader's pause control, at a full touch-target size.
  await expect(page.locator('.model-showcase > button')).toHaveCount(1)
  const pause = page.getByRole('button', { name: 'Pause the robot animation' })
  await expect(pause).toBeInViewport()
  const box = await pause.boundingBox()
  expect(box?.width).toBeGreaterThanOrEqual(44)
  expect(box?.height).toBeGreaterThanOrEqual(44)
  await expect(page.locator('.model-showcase > select')).toHaveCount(0)
  expect(
    await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    })),
  ).toEqual({ clientWidth: 390, scrollWidth: 390 })
  await expectNoAxeViolations(page)
})

test('Spanish demos speak Spanish, use registry marks, and can be stopped', async ({
  page,
}) => {
  await page.goto('/es/notes/pretext-layout-de-texto/demo-react/')
  const start = page.getByRole('button', { name: 'Simular streaming' })
  await expect(start).toBeVisible()
  await expect(
    page.getByRole('group', { name: 'Método de medición' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'pretext' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await start.click()
  const stop = page.getByRole('button', { name: 'Detener' })
  await expect(stop).toBeVisible()
  await stop.click()
  await expect(start).toBeVisible()

  // No clip ships with the demo: the article fills the column, and the only
  // control offered is the one that works — choosing a video.
  await page.goto('/es/notes/pretext-layout-de-texto/matteflow/')
  await expect(
    page.getByRole('img', { name: /Texto de un artículo/ }),
  ).toBeVisible()
  await expect(
    page.getByRole('status').filter({ hasText: 'Elige un video' }),
  ).toBeVisible()
  await expect(page.getByText('Usar tu propio video')).toBeVisible()
  await expect(
    page.getByRole('button', { name: /Pausar|Reproducir/ }),
  ).toHaveCount(0)

  for (const path of [
    '/es/notes/pretext-layout-de-texto/demo-react/',
    '/es/notes/pretext-layout-de-texto/matteflow/',
  ]) {
    await page.goto(path)
    const text = await page.locator('main').innerText()
    for (const glyph of ['⏳', '⏸', '▶', '⚡', '🐢']) {
      expect(text).not.toContain(glyph)
    }
    for (const english of [
      'Simulate stream',
      'Use your own video',
      'Loading…',
    ]) {
      expect(text).not.toContain(english)
    }
  }
  await expectNoAxeViolations(page)
})

test('demos explain themselves without JavaScript, in the page language', async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4321',
    javaScriptEnabled: false,
  })
  const page = await context.newPage()
  await page.goto('/es/notes/pretext-layout-de-texto/matteflow/')
  await expect(
    page.getByText(
      'Esta demo se ejecuta en tu navegador y necesita JavaScript.',
      {
        exact: false,
      },
    ),
  ).toBeVisible()
  await page.goto('/notes/pretext-text-layout/react-demo/')
  await expect(
    page.getByText('This demo runs in your browser and needs JavaScript.', {
      exact: false,
    }),
  ).toBeVisible()
  await context.close()
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
  // A series of one has nowhere to go: no series navigation.
  await page.goto('/notes/gof-patterns-android/')
  await expect(page.getByRole('navigation', { name: 'Series' })).toHaveCount(0)
  await page.goto('/notes/android-17-beta-3/')
  // The series is named by its title, never its slug.
  await expect(page.getByRole('navigation', { name: 'Series' })).toContainText(
    'Series: Android 17',
  )
  // Under it, the date pager says which way in time it goes rather than
  // offering a second, different "Previous".
  const pager = page.getByRole('navigation', { name: 'More entries' })
  await expect(pager).not.toContainText('Previous')
  await expect(pager).not.toContainText('Next')
  await expect(pager.locator('.pager-link__label').first()).toHaveText(
    /(Older|Newer) note/,
  )
  await page.goto('/notes/gof-patterns-android/proxy-facade/')
  const navigation = page.getByRole('navigation', { name: 'Parts' })
  await expect(navigation).toContainText('Observer & State')
  await expect(navigation).toContainText('Adapter & Factory')
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
  // getByLabel matches on substring, so 'Entrada' also caught the
  // 'Entradas relacionadas' region and the 'Más entradas' pager. Name the role.
  await page
    .getByRole('textbox', { name: 'Entrada', exact: true })
    .fill('{"signal":true}')
  await page.getByRole('button', { name: 'Ejecutar localmente' }).click()
  await expect(
    page.getByRole('textbox', { name: 'Resultado', exact: true }),
  ).toHaveValue('{"signal":true}')
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
  const trigger = page.getByRole('button', { name: 'Menu', exact: true })
  for (const locator of [
    trigger,
    page.getByRole('link', { name: 'View in Spanish' }),
    page.getByRole('button', { name: 'Dark theme', exact: true }),
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

test('a subpost on its own URL gets the same reading tools as its entry', async ({
  page,
}) => {
  // Subposts used to mount only the diagram viewer: the same code was
  // copyable inside the entry and not on the subpost's own page.
  // The outline under test is the wide index beside the text.
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/notes/gof-patterns-android/adapter-factory/')
  const main = page.locator('main.entry-page')
  const copy = main.locator('.code-block__copy')
  await expect(copy.first()).toHaveText('Copy')
  expect(await copy.count()).toBe(
    await main.locator('.prose pre.astro-code').count(),
  )
  await expect(main.locator('.code-block__lang').first()).toHaveText('kotlin')
  await expect(page.locator('[data-read-progress]')).toHaveCount(1)

  // One outline rule on both pages: h2 and h3 only.
  const outline = main.getByRole('navigation', { name: 'In this record' })
  const links = outline.locator('[data-toc] a')
  const levels = await outline
    .locator('[data-toc] li')
    .evaluateAll((items) => items.map((item) => item.dataset.level))
  expect(levels.length).toBeGreaterThan(1)
  expect(levels.every((level) => level === '1' || level === '2')).toBe(true)

  const target = links.nth(1)
  await target.click()
  await expect(target).toHaveAttribute('aria-current', 'true')

  const types = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent ?? '{}')['@type']),
    )
  expect(types).toContain('TechArticle')
})

test('a page that inlines two diagrams carries no duplicate id', async ({
  page,
}) => {
  // The note inlines its CI subpost, so it holds both diagrams. Fixed marker
  // ids (`arrowhead`) once appeared twice, and `url(#…)` resolved to the first.
  await page.goto('/notes/codex-security-precision-gap/')
  await expect(page.locator('.prose figure.diagram')).toHaveCount(2)
  const duplicates = await page.evaluate(() => {
    const seen = new Map<string, number>()
    document.querySelectorAll('[id]').forEach(({ id }) => {
      seen.set(id, (seen.get(id) ?? 0) + 1)
    })
    return [...seen].filter(([, count]) => count > 1).map(([id]) => id)
  })
  expect(duplicates).toEqual([])
})

test('diagrams ship as static SVG that fits the column and zooms on request', async ({
  page,
}) => {
  const runtimeRenderers: string[] = []
  page.on('request', (request) => {
    if (/mermaid|fonts\.googleapis/.test(request.url()))
      runtimeRenderers.push(request.url())
  })

  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/notes/codex-security-precision-gap/ci-integration/')
    const figure = page.locator('.prose figure.diagram').first()
    const svg = figure.locator('.diagram__pane > svg')

    await expect(svg).toHaveAttribute('role', 'img')
    await expect(svg).toHaveAttribute('aria-label', /^Exit codes:/)
    const fit = await figure.evaluate((element) => {
      const pane = element.querySelector('.diagram__pane')!
      const drawn = element.querySelector('svg')!.viewBox.baseVal.width
      return {
        overflows: pane.scrollWidth > pane.clientWidth,
        scale:
          element.querySelector('svg')!.getBoundingClientRect().width / drawn,
        page:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      }
    })
    expect(fit.overflows, `pane scrolls at ${width}px`).toBe(false)
    expect(fit.page, `page overflows at ${width}px`).toBe(0)
    // Never drawn smaller than authored, never grown past 1.25×.
    expect(fit.scale).toBeGreaterThanOrEqual(1)
    expect(fit.scale).toBeLessThanOrEqual(1.25)
  }

  const figure = page.locator('.prose figure.diagram').first()
  const svg = figure.locator('.diagram__pane > svg')
  const pane = figure.locator('.diagram__pane')
  const readout = figure.locator('[data-zoom-readout]')
  // Where the page sits around the diagram: the pane's height and the
  // document position of whatever follows the figure.
  const layout = () =>
    figure.evaluate((element) => {
      const viewport = element.querySelector('.diagram__pane')!
      return {
        pane: viewport.getBoundingClientRect().height,
        below:
          element.nextElementSibling!.getBoundingClientRect().top +
          window.scrollY,
      }
    })
  // How far each scrollable axis sits from its centre, in pixels.
  const offCentre = () =>
    pane.evaluate((element) => ({
      x: Math.abs(
        element.scrollLeft - (element.scrollWidth - element.clientWidth) / 2,
      ),
      y: Math.abs(
        element.scrollTop - (element.scrollHeight - element.clientHeight) / 2,
      ),
    }))

  const fitted = (await svg.boundingBox())!.width
  const before = await layout()
  // The readout is a live region, so a screen reader hears each zoom level.
  await expect(readout).toHaveAttribute('role', 'status')
  await expect(readout).toHaveText('100%')

  await figure.getByRole('button', { name: 'Zoom in' }).click()
  await figure.getByRole('button', { name: 'Zoom in' }).click()
  await expect(figure.getByRole('status')).toHaveText('150%')
  await settleTransitions(page)
  // The viewer rounds to whole pixels.
  expect(
    Math.abs((await svg.boundingBox())!.width - fitted * 1.5),
  ).toBeLessThanOrEqual(1)
  // The diagram grows inside a fixed window; the article does not move.
  expect(await layout()).toEqual(before)
  const centred = await offCentre()
  expect(centred.x).toBeLessThanOrEqual(2)
  expect(centred.y).toBeLessThanOrEqual(2)

  // Dragging with a mouse pans the diagram inside the pane.
  const start = await pane.evaluate((element) => ({
    left: element.scrollLeft,
    top: element.scrollTop,
  }))
  const box = (await pane.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 15)
  await page.mouse.up()
  expect(
    await pane.evaluate((element) => ({
      left: element.scrollLeft,
      top: element.scrollTop,
    })),
  ).toEqual({
    left: Math.max(0, start.left - 20),
    top: Math.max(0, start.top - 15),
  })

  await figure.getByRole('button', { name: 'Fit to width' }).click()
  await expect(readout).toHaveText('100%')
  await settleTransitions(page)
  expect(
    Math.abs((await svg.boundingBox())!.width - fitted),
  ).toBeLessThanOrEqual(1)
  expect(await layout()).toEqual(before)

  expect(runtimeRenderers).toEqual([])
  await expectNoAxeViolations(page)
})

test('Matteflow plays a video the reader chooses', async ({ page }) => {
  // The file plays from a blob: URL. With `media-src 'self'` alone the CSP
  // blocked it, the console logged the violation, and the demo could only ever
  // show its "could not play" message.
  await page.goto('/notes/pretext-text-layout/matteflow/')
  const demo = page.locator('canvas[role="img"]').first().locator('..')
  await expect(demo.getByRole('status')).toBeVisible()
  await page
    .locator('input[type="file"][accept="video/*"]')
    .setInputFiles(new URL('fixtures/probe.webm', import.meta.url).pathname)
  await expect(demo.getByRole('status')).toHaveCount(0)
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
  // The redirect carries the missed address so the 404 can suggest notes.
  await expect(page).toHaveURL(
    /\/es\/404\/\?from=%2Fes%2Funknown-archive-record%2F$/,
  )
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

test('without JavaScript the header offers only controls that work', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  try {
    await page.goto('/notes/')
    await expect(page.locator('.menu-control')).toBeHidden()
    await expect(page.locator('[data-theme-toggle]')).toBeHidden()

    const nav = page.locator('.desktop-nav')
    await expect(nav).toBeVisible()
    for (const name of ['Work', 'Lab', 'Notes', 'Gallery', 'About']) {
      await expect(nav.getByRole('link', { name, exact: true })).toBeVisible()
    }
    // Current section is matched on a path segment, so only Notes is marked.
    await expect(nav.locator('a[aria-current="page"]')).toHaveText(['Notes'])
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
  } finally {
    await context.close()
  }
})

test('notes search finds entries across the archive and announces the count', async ({
  page,
}) => {
  const searchRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().includes('notes-search.json'))
      searchRequests.push(request.url())
  })
  await page.goto('/notes/')
  const search = page.getByRole('searchbox', { name: 'Search notes' })
  const results = page.locator('[data-notes-results]')
  const status = page.locator('[data-notes-status]')
  await expect(status).toHaveAttribute('role', 'status')
  await expect(status).toBeAttached()

  await search.fill('android')
  await expect(results).toBeVisible()
  await expect(page.locator('[data-notes-list] li').first()).toBeVisible()
  await expect(status).toHaveText(/^\d+ of \d+ notes match\.$/)
  await expect(
    page.locator('[data-notes-list] .notes-results__meta').last(),
  ).toHaveText(/ · \d+ min read$/)
  await expect(page.locator('.notes-stream')).toBeHidden()

  // A second query reuses the index already fetched.
  await search.fill('compose')
  await expect(status).toHaveText(/notes match/)
  expect(searchRequests).toHaveLength(1)

  await search.fill('')
  await expect(results).toBeHidden()
  await expect(status).toHaveText('')
  await expect(page.locator('.notes-stream')).toBeVisible()
})

test('notes search loads its index once and drops a stale slow response', async ({
  page,
}) => {
  let release: () => void = () => undefined
  const gate = new Promise<void>((resolve) => (release = resolve))
  const searchRequests: string[] = []
  await page.route('**/notes-search.json', async (route) => {
    searchRequests.push(route.request().url())
    await gate
    await route.continue()
  })
  // The 120 ms debounce runs on a controlled clock, so each step below fires
  // exactly when the test says rather than after a guessed sleep.
  await page.clock.install()
  await page.goto('/notes/')
  const search = page.getByRole('searchbox', { name: 'Search notes' })
  const results = page.locator('[data-notes-results]')

  await search.fill('an')
  await page.clock.runFor(200)
  await expect.poll(() => searchRequests.length).toBe(1)
  // A second debounce fires while the first request is still in flight.
  await search.fill('android')
  await page.clock.runFor(200)
  // Then the field drops below two characters before the index arrives.
  await search.fill('a')
  await page.clock.resume()
  const response = page.waitForResponse('**/notes-search.json')
  release()
  await response

  // Nothing renders for a query that is no longer in the field, for the whole
  // window in which the late index is parsed and handled.
  expect(await attributeChangesDuring(results, 'hidden', 500)).toEqual([])
  await expect(results).toBeHidden()
  await expect(page.locator('.notes-stream')).toBeVisible()
  expect(searchRequests).toHaveLength(1)
})

test('notes search failure is visible and announced, and the archive stays', async ({
  page,
}) => {
  await page.route('**/notes-search.json', (route) =>
    route.fulfill({ status: 500, body: '' }),
  )
  await page.goto('/notes/')
  await page.getByRole('searchbox', { name: 'Search notes' }).fill('android')

  const message =
    'Search could not load. The type and topic filters below still work.'
  await expect(page.locator('[data-notes-count]')).toHaveText(message)
  await expect(page.locator('[data-notes-status]')).toHaveText(message)
  await expect(page.locator('.notes-stream')).toBeVisible()
  browserErrors.set(
    page,
    (browserErrors.get(page) ?? []).filter(
      (error) => !error.includes('status of 500'),
    ),
  )
})

test('notes type and topic filters and pagination are real URLs', async ({
  page,
}) => {
  await page.goto('/notes/')
  const filter = page.getByRole('navigation', { name: 'Filter by type' })
  await filter.locator('a[data-kind="article"]').click()
  await expect(page).toHaveURL(/\/notes\/type\/article\/$/)
  await expect(filter.locator('a[data-kind="article"]')).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(page.locator('.note-row').first()).toBeVisible()

  await page.goto('/notes/topic/android/')
  await expect(page.locator('.notes-filter__topic')).toBeVisible()
  await expect(page.locator('.note-row').first()).toBeVisible()

  await page.goto('/notes/')
  await page.locator('.pagination').getByRole('link', { name: /Older/ }).click()
  await expect(page).toHaveURL(/\/notes\/2\/$/)
  await expect(page).toHaveTitle(/2/)
  await expect(page.locator('.note-row').first()).toBeVisible()
})

test('Lab topic filter narrows the grid and reports what it shows', async ({
  page,
}) => {
  await page.goto('/lab/')
  const bar = page.locator('[data-lab-filter]')
  await expect(bar).toBeVisible()
  const facets = bar.locator('button[data-facet]:not([data-facet=""])')
  const facet = facets.first()
  await facet.click()
  await expect(facet).toHaveAttribute('aria-pressed', 'true')
  await expect(bar.locator('button[data-facet=""]')).toHaveAttribute(
    'aria-pressed',
    'false',
  )

  const shown = await page.locator('[data-lab-grid] > li:visible').count()
  const total = await page.locator('[data-lab-grid] > li').count()
  await expect(page.locator('[data-lab-status]')).toHaveText(
    `Showing ${shown} of ${total}.`,
  )

  await bar.locator('button[data-facet=""]').click()
  await expect(page.locator('[data-lab-grid] > li:visible')).toHaveCount(total)
  await expect(page.locator('[data-lab-status]')).toHaveText('')
})

test('gallery serves resized modern formats and a keyboard-operable viewer', async ({
  page,
}) => {
  await page.goto('/gallery/')
  const thumb = page.locator('.gallery-sheet__contact picture').first()
  await expect(thumb.locator('source[type="image/avif"]')).toHaveCount(1)
  await expect(thumb.locator('source[type="image/webp"]')).toHaveCount(1)
  await expect(thumb.locator('img')).toHaveAttribute('width', /\d+/)
  await expect(thumb.locator('img')).toHaveAttribute('height', /\d+/)

  await page.goto('/gallery/san-francisco/')
  const triggers = page.locator('.gallery-piece__open')
  const total = await triggers.count()
  // The no-JS link opens a re-encoded view, never the camera original.
  await expect(triggers.first()).toHaveAttribute('href', /^\/_astro\/.+\.webp$/)

  await triggers.first().click()
  const viewer = page.locator('[data-lightbox]')
  const counter = viewer.locator('[data-lightbox-counter]')
  await expect(viewer).toBeVisible()
  await expect(counter).toHaveText(`1 / ${total}`)
  await expect(viewer.locator('[data-lightbox-media] img')).toHaveAttribute(
    'src',
    /\.webp$/,
  )

  await page.keyboard.press('ArrowRight')
  await expect(counter).toHaveText(`2 / ${total}`)
  await page.keyboard.press('ArrowLeft')
  await expect(counter).toHaveText(`1 / ${total}`)
  await page.keyboard.press('ArrowLeft')
  await expect(counter).toHaveText(`${total} / ${total}`)

  await page.keyboard.press('Escape')
  await expect(viewer).toBeHidden()
  await expect(viewer.locator('[data-lightbox-media] > *')).toHaveCount(0)
  await expect(triggers.first()).toBeFocused()
})

/* ------------------------------------------------------------------ */
/* Reading structure: contents, section links, measure, print          */
/* ------------------------------------------------------------------ */

/** Average characters per full line across the long paragraphs in view. */
const charactersPerLine = (page: Page) =>
  page.evaluate(() => {
    const paragraphs = Array.from(
      document.querySelectorAll<HTMLElement>('.prose p'),
    ).filter((p) => p.textContent!.length > 250 && p.offsetParent)
    const averages: number[] = []
    const range = document.createRange()
    for (const paragraph of paragraphs.slice(0, 5)) {
      const lines = new Map<number, number>()
      const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT)
      let node: Node | null
      while ((node = walker.nextNode())) {
        for (let i = 0; i < (node as Text).length; i++) {
          range.setStart(node, i)
          range.setEnd(node, i + 1)
          const rect = range.getClientRects()[0]
          if (!rect) continue
          const top = Math.round(rect.top)
          lines.set(top, (lines.get(top) ?? 0) + 1)
        }
      }
      const counts = [...lines.values()].slice(0, -1)
      if (counts.length) {
        averages.push(counts.reduce((a, b) => a + b, 0) / counts.length)
      }
    }
    return averages.reduce((a, b) => a + b, 0) / averages.length
  })

test('the wide index fits the window and keeps the active section in view', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium', 'wide layout only')
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/notes/gof-patterns-android/')
  const index = page.locator('.entry-index')
  const headings = await page
    .locator('.entry-index [data-toc] a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')!))
  // 51 sections across four parts: the case that used to run off-screen.
  expect(headings.length).toBeGreaterThan(40)

  const sample = headings.filter(
    (_, i) => i % 6 === 0 || i === headings.length - 1,
  )
  for (const href of sample) {
    await page.evaluate(
      (id) => {
        const target = document.getElementById(id)!
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 150,
          behavior: 'instant',
        })
      },
      decodeURIComponent(href.slice(1)),
    )
    // The section reported active is the one the observer settles on; what
    // is required is that, whichever it is, the reader can see it.
    const active = page.locator(
      '.entry-index [data-toc] a[aria-current="true"]',
    )
    await expect
      .poll(
        async () => {
          const box = await active.boundingBox()
          return Boolean(box && box.y >= 0 && box.y + box.height <= 900)
        },
        { message: href },
      )
      .toBe(true)
    const indexBox = (await index.boundingBox())!
    expect(indexBox.height).toBeLessThanOrEqual(900)
  }
  // Topics no longer share the sticky box.
  await expect(index.locator('.topic-list')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Filed under' }),
  ).toBeAttached()
})

test('@mobile phone contents sit before the first paragraph, collapsed', async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const scripted of [true, false]) {
    const context = scripted
      ? undefined
      : await browser.newContext({
          javaScriptEnabled: false,
          viewport: { width: 390, height: 844 },
        })
    const view = context ? await context.newPage() : page
    await view.goto('/notes/gof-patterns-android/')
    const contents = view.locator('details.toc-mobile')
    await expect(contents).toBeVisible()
    await expect(view.locator('.entry-index')).toBeHidden()
    const box = (await contents.boundingBox())!
    expect(box.height).toBeLessThan(56)
    const firstParagraph = (await view
      .locator('.prose > p')
      .first()
      .boundingBox())!
    expect(box.y).toBeLessThan(firstParagraph.y)
    await expect(contents.locator('summary')).toContainText('In this record')
    await expect(contents.locator('summary')).toContainText('sections')

    await contents.locator('summary').click()
    const links = contents.locator('a')
    await expect(links.first()).toBeVisible()
    // The top rung only, numbered like the headings in the text.
    await expect(links.first().locator('.toc-num')).toHaveText('01')
    await links.nth(1).click()
    await expect(view).toHaveURL(/#.+/)
    await context?.close()
  }
})

test('every section heading carries a named, keyboard-reachable self-link', async ({
  page,
}) => {
  await page.goto('/notes/android-17-beta-3/')
  const heading = page.locator('.prose h2[id]').first()
  const id = await heading.getAttribute('id')
  const name = (await heading.innerText()).trim()
  // The heading keeps its own name; the link is not folded into it.
  await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(1)
  const link = page.getByRole('link', { name: `Link to section: ${name}` })
  await expect(link).toHaveAttribute('href', `#${id}`)
  await link.focus()
  await expect(link).toBeFocused()
  await expect
    .poll(() => link.evaluate((el) => getComputedStyle(el).opacity))
    .toBe('1')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(new RegExp(`#${id}$`))

  await page.goto('/es/notes/android-17-beta-3/')
  await expect(
    page.getByRole('link', { name: /^Enlace a la sección: / }).first(),
  ).toBeAttached()
})

test('switching language lands on the same section', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium', 'wide layout only')
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/notes/android-17-beta-3/')
  const links = page.locator('.entry-index [data-toc] a')
  const index = 7
  const href = (await links.nth(index).getAttribute('href'))!
  await page.evaluate((id) => {
    const target = document.getElementById(id)!
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 150,
      behavior: 'instant',
    })
  }, href.slice(1))
  await expect(links.nth(index)).toHaveAttribute('aria-current', 'true')

  await page.locator('[data-locale-control]').click()
  await expect(page).toHaveURL(/\/es\/notes\/android-17-beta-3\/#.+/)
  const counterpart = await page
    .locator('.entry-index [data-toc] a')
    .nth(index)
    .getAttribute('href')
  expect(new URL(page.url()).hash).toBe(counterpart)
  const landed = (await page
    .locator(`[id="${decodeURIComponent(counterpart!.slice(1))}"]`)
    .boundingBox())!
  expect(landed.y).toBeGreaterThanOrEqual(0)
  expect(landed.y).toBeLessThan(900)
})

test('running text keeps a 60–75 character measure', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium', 'wide layouts only')
  for (const width of [1280, 820]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/notes/android-17-beta-3/')
    const measure = await charactersPerLine(page)
    expect(measure, `${width}px`).toBeGreaterThanOrEqual(60)
    expect(measure, `${width}px`).toBeLessThanOrEqual(75)
  }
})

test('a note prints as text, without the screen chrome', async ({ page }) => {
  await page.goto('/notes/android-17-beta-3/')
  await page.evaluate(() =>
    document.documentElement.setAttribute('data-theme', 'dark'),
  )
  await page.emulateMedia({ media: 'print' })
  await settleTransitions(page)
  for (const selector of [
    '.site-header',
    '.site-footer',
    '.entry-index',
    '.toc-mobile',
    '.entry-banner',
    '.read-progress',
    '.code-block__bar',
    '.heading-anchor',
  ]) {
    const hidden = await page
      .locator(selector)
      .evaluateAll((elements) =>
        elements.every((el) => getComputedStyle(el).display === 'none'),
      )
    expect(hidden, selector).toBe(true)
  }
  const colours = await page.evaluate(() => ({
    paper: getComputedStyle(document.body).backgroundColor,
    ink: getComputedStyle(document.querySelector('.prose p')!).color,
  }))
  // Black on white even from the dark theme.
  expect(colours.paper).toBe('rgb(255, 255, 255)')
  expect(colours.ink).toBe('rgb(0, 0, 0)')
  const external = page.locator('.prose a[href^="http"]').first()
  const after = await external.evaluate(
    (el) => getComputedStyle(el, '::after').content,
  )
  expect(after).toContain('http')
  await expect(page.locator('.prose').first()).toBeVisible()
})

/* ------------------------------------------------------------------------
   UX round: search by heading, per-locale feeds, 404 suggestions, Lab on a
   phone. Kept together at the end of the file.
   ------------------------------------------------------------------------ */

test('notes search finds a heading and links straight to its section', async ({
  page,
}) => {
  await page.goto('/notes/')
  const search = page.getByRole('searchbox', { name: 'Search notes' })
  await search.fill('AlarmManager')

  const hit = page.locator('[data-notes-list] a', { hasText: 'AlarmManager' })
  await expect(hit.first()).toBeVisible()
  await expect(hit.first()).toHaveAttribute(
    'href',
    /\/notes\/android-17-beta-3\/#alarmmanager-/,
  )
  await expect(hit.first().locator('.notes-results__section')).toHaveText(
    /^in § AlarmManager/,
  )
  // The type tabs drop their whole-collection counts while a query is active.
  await expect(page.locator('.notes-filter__n').first()).toBeHidden()
  // One clear control, the labelled one.
  await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible()

  await hit.first().click()
  await expect(page).toHaveURL(/#alarmmanager-/)
  const anchor = decodeURIComponent(new URL(page.url()).hash.slice(1))
  await expect(page.locator(`[id="${anchor}"]`)).toBeInViewport()
})

test('notes search with no match names the query and offers ways on', async ({
  page,
}) => {
  await page.goto('/notes/')
  const search = page.getByRole('searchbox', { name: 'Search notes' })
  await search.fill('zzqqxx')

  const empty = page.locator('[data-notes-empty]')
  await expect(empty).toContainText('No notes match “zzqqxx”.')
  await expect(empty).not.toContainText('archive')
  await expect(page.locator('[data-notes-status]')).toHaveText(
    'No notes match “zzqqxx”.',
  )
  await expect(
    empty.getByRole('link', { name: 'browse topics' }),
  ).toHaveAttribute('href', '/tags/')
  await empty.getByRole('button', { name: 'Clear search' }).click()
  await expect(search).toHaveValue('')
  await expect(search).toBeFocused()
  await expect(page.locator('[data-notes-results]')).toBeHidden()
  await expect(page.locator('.notes-filter__n').first()).toBeVisible()
})

test('each locale links its own feed, and the Spanish feed is Spanish', async ({
  page,
  request,
}) => {
  await page.goto('/es/notes/')
  await expect(
    page.locator('link[rel="alternate"][type="application/rss+xml"]'),
  ).toHaveAttribute('href', '/es/rss.xml')
  await expect(page.locator('.site-footer a[href="/es/rss.xml"]')).toHaveCount(
    1,
  )
  await expect(page.locator('a[href="/rss.xml"]')).toHaveCount(0)

  await page.goto('/notes/')
  await expect(
    page.locator('link[rel="alternate"][type="application/rss+xml"]'),
  ).toHaveAttribute('href', '/rss.xml')

  const feed = await request.get('/es/rss.xml')
  expect(feed.status()).toBe(200)
  const xml = await feed.text()
  // Parsed by the browser's own XML parser, as a feed reader would.
  const parsed = await page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, 'application/xml')
    return {
      error: doc.querySelector('parsererror') !== null,
      language: doc.querySelector('channel > language')?.textContent,
      items: doc.querySelectorAll('channel > item').length,
    }
  }, xml)
  expect(parsed.error).toBe(false)
  expect(parsed.language).toBe('es')
  expect(parsed.items).toBeGreaterThan(0)
  expect(xml).toContain('<language>es</language>')
  expect(xml).toContain('/es/notes/')
  expect(await (await request.get('/rss.xml')).text()).toContain(
    '<language>en</language>',
  )
})

test('the 404 suggests the closest notes, in both languages', async ({
  page,
}) => {
  // Each missing path is served with a 404 status, which Chromium may log as
  // a generic "Failed to load resource" console error for the document. That
  // message cannot tell the document from a broken fetch, so the network is
  // checked instead: no request other than the page itself may fail.
  const failedSubresources: string[] = []
  page.on('response', (response) => {
    const request = response.request()
    if (response.status() >= 400 && request.resourceType() !== 'document') {
      failedSubresources.push(`${response.status()} ${request.url()}`)
    }
  })
  const expectOnlyDocument404 = () => {
    expect(failedSubresources).toEqual([])
    browserErrors.set(
      page,
      (browserErrors.get(page) ?? []).filter(
        (message) => !message.startsWith('Failed to load resource:'),
      ),
    )
  }

  // A truncated slug: no such page, but three notes share its words.
  await page.goto('/notes/android-17-beta/')
  expectOnlyDocument404()
  const english = page.locator('[data-not-found-suggestions]')
  await expect(english).toBeVisible()
  await expect(english.locator('a').first()).toHaveAttribute(
    'href',
    '/notes/android-17-beta-3/',
  )

  await page.goto('/es/notes/android-17-beta/')
  await expect(page).toHaveURL(/\/es\/404\/\?from=/)
  expectOnlyDocument404()
  const spanish = page.locator('[data-not-found-suggestions]')
  await expect(spanish).toBeVisible()
  await expect(spanish.locator('h2')).toHaveText(
    'Notas más cercanas a esta dirección',
  )
  await expect(spanish.locator('a').first()).toHaveAttribute(
    'href',
    '/es/notes/android-17-beta-3/',
  )

  // Nothing close: the section stays hidden and the plain links remain.
  await page.goto('/zzqqxx/')
  expectOnlyDocument404()
  await expect(page.locator('[data-not-found-suggestions]')).toBeHidden()
  await expect(page.locator('.hero-actions a')).toHaveCount(2)
  expectOnlyDocument404()
})

test('a Lab tool stacks input and output on a phone', async ({ page }) => {
  for (const [width, columns] of [
    [390, 1],
    [1280, 2],
  ] as const) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/lab/json-formatter/')
    const inputBox = await page
      .locator('.lab-pane:not(.output-pane)')
      .boundingBox()
    const outputBox = await page.locator('.output-pane').boundingBox()
    expect(inputBox && outputBox).toBeTruthy()
    const sideBySide = Math.abs(inputBox!.y - outputBox!.y) < 1
    expect(sideBySide ? 2 : 1, `${width}px`).toBe(columns)
    if (columns === 1) expect(inputBox!.width).toBeGreaterThan(300)
  }
})
