import { expect, test, type Page } from '@playwright/test'

/* The copy a reader meets at the top of an entry: what replaced it, where it
   sits in a series, and facts that do not repeat themselves. Each rule comes
   from a real-browser audit; the built-HTML gate in check-built-metadata.ts
   covers the strings that must never appear at all. */

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
})

const replacements = [
  {
    url: '/notes/android-17-beta-3/',
    lead: 'This note was replaced by',
    href: '/notes/android-17-stable/',
  },
  {
    url: '/es/notes/android-17-beta-3/',
    lead: 'Esta nota fue reemplazada por',
    href: '/es/notes/android-17-estable/',
  },
]

for (const { url, lead, href } of replacements) {
  test(`a replaced note links to its replacement above the fold (${url})`, async ({
    page,
  }) => {
    await page.goto(url)
    const notice = page.locator('.entry-superseded')
    await expect(notice).toContainText(lead)
    const link = notice.getByRole('link')
    await expect(link).toHaveAttribute('href', href)
    // Above the fold: the notice starts inside the first viewport.
    const box = await notice.boundingBox()
    const viewport = page.viewportSize()
    expect(box && viewport && box.y < viewport.height).toBeTruthy()
  })
}

test('a series member says which part of which series it is', async ({
  page,
}) => {
  await page.goto('/notes/android-17-stable/')
  await expect(page.locator('[data-series-position]')).toHaveText(
    'Part 2 of 3 · Android 17',
  )
  await expect(page.locator('.series-navigation strong')).toHaveText(
    'Series: Android 17',
  )

  await page.goto('/es/notes/android-17-estable/')
  await expect(page.locator('[data-series-position]')).toHaveText(
    'Parte 2 de 3 · Android 17',
  )
})

test('a subpost is "Part n of m", and a single part is not counted', async ({
  page,
}) => {
  await page.goto('/notes/gof-patterns-android/')
  await expect(page.locator('.subpost-index').first()).toHaveText('Part 1 of 4')
  await page.goto('/notes/remote-compose/')
  await expect(page.locator('.subpost-index')).toHaveCount(0)
  await expect(page.locator('.series-navigation')).toHaveCount(0)
})

test('header facts read "N min" and skip an update on the publication day', async ({
  page,
}) => {
  await page.goto('/notes/android-17-stable/')
  const facts = page.locator('.entry-facts')
  await expect(facts.locator('dd').nth(2)).toHaveText(/^\d+ min$/)
  await expect(facts).toContainText('Write-up')
  await expect(facts.locator('time').first()).toHaveAttribute(
    'datetime',
    /^\d{4}-\d{2}-\d{2}$/,
  )

  // Published and updated on 2026-07-23: one date, not two.
  await page.goto('/lab/base64-encoder/')
  await expect(page.locator('.entry-facts')).not.toContainText('Updated')
  // The chip says "Stable"; the write-up is also stable, so it is said once.
  await expect(page.locator('.entry-heading')).toContainText('Stable')
  await expect(
    page.locator('.entry-heading').getByText('Stable', { exact: true }),
  ).toHaveCount(1)
})

test('dates show the day the record declares, not the day before', async ({
  page,
}) => {
  await page.goto('/notes/android-17-beta-3/')
  await expect(page.locator('.entry-facts time').first()).toHaveText(
    'Mar 27, 2026',
  )
})

test('the lifecycle chip explains itself and links to the colophon', async ({
  page,
}) => {
  await page.goto('/notes/android-17-stable/')
  const chip = page.locator('.entry-status-link')
  await expect(chip).toHaveAttribute('title', /colophon/)
  await chip.click()
  await expect(page).toHaveURL(/\/colophon\/?#record-status$/)
  await expect(page.locator('#record-status')).toContainText(
    'How records are classified',
  )
})

test('an entry topic opens the filtered Notes list', async ({ page }) => {
  await page.goto('/notes/android-17-stable/')
  await expect(
    page.locator('.entry-topics a', { hasText: 'Android' }),
  ).toHaveAttribute('href', '/notes/topic/android/')
})

/* The number the prose prints before a heading comes from a CSS counter
   ("06", and "6.2" for a subsection after it); the index prints one derived
   in src/lib/outline.ts. They are two implementations of one rule, so this
   reads the counter as the browser rendered it — a pseudo-element is not in
   the DOM text, and `getComputedStyle` reports the unresolved `counter()` —
   and requires the same number on every heading, in the same order. */
const renderedHeadingNumbers = async (
  page: Page,
): Promise<[string, string][]> => {
  const cdp = await page.context().newCDPSession(page)
  const { documents, strings } = await cdp.send('DOMSnapshot.captureSnapshot', {
    computedStyles: [],
  })
  const { nodes, layout } = documents[0]
  const text = new Map<number, string>()
  layout.nodeIndex.forEach((node, index) => {
    const value = layout.text[index]
    if (value >= 0) text.set(node, (text.get(node) ?? '') + strings[value])
  })
  const attribute = (node: number, name: string) => {
    const pairs = nodes.attributes?.[node] ?? []
    for (let i = 0; i < pairs.length; i += 2) {
      if (strings[pairs[i]] === name) return strings[pairs[i + 1]]
    }
    return undefined
  }
  const pseudo = nodes.pseudoType!
  const parents = nodes.parentIndex!
  const numbers: [string, string][] = []
  pseudo.index.forEach((node, index) => {
    const heading = parents[node]
    const tag = strings[nodes.nodeName![heading]]
    const id = attribute(heading, 'id')
    const number = text.get(node)?.trim()
    if (strings[pseudo.value[index]] !== 'before' || !id || !number) return
    if (!/^H[23]$/.test(tag)) return
    if (attribute(parents[heading], 'class')?.split(' ').includes('prose')) {
      numbers.push([id, number])
    }
  })
  await cdp.detach()
  return numbers
}

for (const url of [
  '/notes/android-17-stable/',
  '/es/notes/android-17-estable/',
  '/notes/android-17-beta-3/',
]) {
  test(`every numbered heading shows the number its index entry shows (${url})`, async ({
    page,
  }) => {
    await page.goto(url)
    const indexed = await page
      .locator('.entry-index [data-toc] a:has(.toc-num)')
      .evaluateAll((links) =>
        links.map((link) => [
          decodeURIComponent(link.getAttribute('href')!.slice(1)),
          link.querySelector('.toc-num')!.textContent!.trim(),
        ]),
      )
    const rendered = await renderedHeadingNumbers(page)
    // Subsections are numbered after their section, never counted on their own.
    expect(indexed.some(([, number]) => /^\d+\.\d+$/.test(number))).toBe(true)
    expect(rendered).toEqual(indexed)
  })
}
