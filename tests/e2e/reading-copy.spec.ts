import { expect, test, type Page } from '@playwright/test'

/* The copy a reader meets at the top of an entry: what replaced it, where it
   sits in a series, and facts that do not repeat themselves. Each rule comes
   from a real-browser audit; the built-HTML gate in check-built-metadata.ts
   covers the strings that must never appear at all. */

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
})

/* No published note is superseded any more: the Android 17 notes that used
   `supersededBy` were merged into one note with parts. The resolution rule is
   covered in tests/unit/notes-derivation.test.ts. */

test('a series member says which part of which series it is', async ({
  page,
}) => {
  await page.goto('/notes/android-16/')
  await expect(page.locator('[data-series-position]')).toHaveText(
    'Part 18 of 19 · Android, version by version',
  )
  await expect(page.locator('.series-navigation strong')).toHaveText(
    'Series: Android, version by version',
  )

  await page.goto('/es/notes/android-16/')
  await expect(page.locator('[data-series-position]')).toHaveText(
    'Parte 18 de 19 · Android, versión por versión',
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
  await page.goto('/notes/android-17/')
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
  await page.goto('/notes/android-17/')
  await expect(page.locator('.entry-facts time').first()).toHaveText(
    'Oct 17, 2026',
  )
})

test('the lifecycle chip explains itself and links to the colophon', async ({
  page,
}) => {
  await page.goto('/notes/android-17/')
  const chip = page.locator('.entry-status-link')
  await expect(chip).toHaveAttribute('title', /colophon/)
  await chip.click()
  await expect(page).toHaveURL(/\/colophon\/?#record-status$/)
  await expect(page.locator('#record-status')).toContainText(
    'How records are classified',
  )
})

test('an entry topic opens the filtered Notes list', async ({ page }) => {
  await page.goto('/notes/android-17/')
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
  '/notes/android-17/',
  '/es/notes/android-17/',
  '/notes/android-16/',
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
