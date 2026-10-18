import { resolve } from 'node:path'
import { expect, test, type Page } from '@playwright/test'

/* The Android migration planner, end to end: range → steps, ticks that
   survive a reload, a pasted manifest, and export. */

const PATH = '/lab/android-migration-planner/'
const MANIFEST = resolve('tests/fixtures/migration-planner/AndroidManifest.xml')

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

const open = async (page: Page, path = PATH) => {
  await page.goto(path)
  await expect(page.locator('.planner')).toHaveAttribute(
    'data-hydrated',
    'true',
  )
}

const pickRange = async (page: Page, from: string, to: string) => {
  await page.getByLabel('Current targetSdk').selectOption(from)
  await page.getByLabel('New targetSdk').selectOption(to)
}

test('picking a range lists every level crossed, in order', async ({
  page,
}) => {
  await open(page)
  await pickRange(page, '28', '31')
  await expect(page.locator('.planner-level h3')).toHaveText([
    'Android 10 · API 29',
    'Android 11 · API 30',
    'Android 12 · API 31',
  ])
  await expect(page.locator('.planner-stats dd').first()).toHaveText('3')
  await expect(page).toHaveURL(/\?from=28&to=31$/)
  await expect(page.getByRole('status').first()).toContainText(
    'Plan from API 28 to API 31: 3 levels',
  )

  // A target at or below the current level is explained, not left blank.
  await page.getByLabel('New targetSdk').selectOption('26')
  await expect(page.getByRole('alert')).toHaveText(
    'Pick a new targetSdk above the current one to see the steps between them.',
  )
  await expect(page.locator('.planner-level')).toHaveCount(0)

  // Swapping puts the ends the right way round: 26 → 28.
  await page.getByRole('button', { name: 'Swap current and new' }).click()
  await expect(page.locator('.planner-level h3')).toHaveText([
    'Android 8.1 · API 27',
    'Android 9 · API 28',
  ])

  // A shared link reopens the same range.
  await open(page, `${PATH}?from=33&to=35`)
  await expect(page.locator('.planner-level h3')).toHaveText([
    'Android 14 · API 34',
    'Android 15 · API 35',
  ])
})

test('a ticked step is still ticked after a reload', async ({ page }) => {
  await open(page, `${PATH}?from=32&to=33`)
  const step = page.locator('.planner-checklist input').first()
  await step.check()
  await expect(
    page.locator('.planner-level__progress span').first(),
  ).toHaveText(/^1 of \d+$/)
  await page.reload()
  await expect(page.locator('.planner')).toHaveAttribute(
    'data-hydrated',
    'true',
  )
  await expect(page.locator('.planner-checklist input').first()).toBeChecked()
  await page.locator('.planner-checklist input').first().uncheck()
  await page.reload()
  await expect(
    page.locator('.planner-checklist input').first(),
  ).not.toBeChecked()
})

test('the scope and the filter narrow the changes shown', async ({ page }) => {
  await open(page, `${PATH}?from=32&to=33`)
  const level = page.locator('.planner-level').first()
  await expect(level.locator('.planner-group summary')).toHaveText([
    /When you target API 33/,
    /Permissions/,
  ])
  await page.getByText('Also on every app').click()
  await expect(level.locator('.planner-group summary')).toHaveText([
    /When you target API 33/,
    /On Android 13, for every app/,
    /Permissions/,
  ])
  await page.getByLabel('Filter changes').fill('POST_NOTIFICATIONS')
  await expect(page.locator('.planner-filter__count')).toContainText(
    'changes match',
  )
  const targeting = level.locator('.planner-group').first()
  await expect(targeting).toHaveAttribute('open', '')
  await expect(targeting.locator('.planner-row').first()).toContainText(
    'POST_NOTIFICATIONS',
  )
})

test('a pasted manifest reports what it shows, at the right level', async ({
  page,
}) => {
  await open(page, `${PATH}?from=26&to=34`)
  await page.getByText('Check a merged manifest').click()
  await page
    .locator('.planner-manifest input[type="file"]')
    .setInputFiles(MANIFEST)
  const detected = page.locator(
    '.planner-results__group[data-status="detected"]',
  )
  await expect(detected).toContainText(
    'Components with an intent filter declare android:exported',
  )
  await expect(detected).toContainText('.MainActivity')
  await expect(
    detected.getByRole('link', { name: /android:exported/ }),
  ).toHaveAttribute('href', '/notes/android-12/#apps-targeting-api-31')
  await expect(page.getByRole('status').first()).toContainText(
    'Manifest findings',
  )
  // The same finding sits inside the API 31 step.
  await expect(
    page
      .locator('.planner-level', { hasText: 'Android 12 · API 31' })
      .locator('.planner-findings'),
  ).toContainText('android:exported')
  // The manifest's own target can become the starting point.
  await expect(page.getByText('This manifest targets API 29.')).toBeVisible()
  await page.getByRole('button', { name: 'Plan from API 29' }).click()
  await expect(page).toHaveURL(/\?from=29&to=34$/)
  await expect(page.locator('.planner-level h3').first()).toHaveText(
    'Android 11 · API 30',
  )

  // Malformed XML is explained, not thrown.
  await page.getByLabel('Merged AndroidManifest.xml').fill('<manifest><oops>')
  await page.getByRole('button', { name: 'Analyze' }).click()
  await expect(page.getByRole('alert')).toContainText(
    'That is not well-formed XML.',
  )
})

test('the plan exports as Markdown with the reader’s ticks', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page, `${PATH}?from=32&to=33`)
  await page.locator('.planner-checklist input').first().check()
  await page.getByRole('button', { name: 'Copy as Markdown' }).click()
  await expect(page.getByRole('status').first()).toHaveText(
    'Plan copied as Markdown, with your ticks.',
  )
  const markdown = await page.evaluate(() => navigator.clipboard.readText())
  expect(markdown).toContain('# Android targetSdk migration plan')
  expect(markdown).toContain('## Android 13 · API 33')
  expect(markdown).toMatch(/^- \[x\] \*\*Update the toolchain\.\*\*/m)
  expect(markdown).toContain(
    'http://127.0.0.1:4321/notes/android-13/#migrating-to-api-33',
  )

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download .md' }).click()
  expect((await download).suggestedFilename()).toBe(
    'android-migration-api-32-to-33.md',
  )
})
