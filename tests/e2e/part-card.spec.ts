import { expect, test } from '@playwright/test'

/* Each subpost inlined in its entry opens with a part card: where it sits
   ("Part N of M"), its title set larger than its own sections, its summary,
   and a link to the part on its own URL. Without it, a part started with a
   hairline and an h2 the same size as the one after it, and a reader lost
   track of where one chapter ended and the next began. */

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
})

const notes = [
  {
    url: '/notes/gof-patterns-android/',
    position: (order: number) => `Part ${order} of 4`,
    link: 'Read on its own',
    parts: [
      {
        title: 'Observer & State: UI that never lies',
        summary:
          'Observer keeps the UI in sync with data automatically; State makes impossible screen states impossible at compile time.',
        href: '/notes/gof-patterns-android/observer-state/',
      },
      {
        title: 'Proxy & Facade: cache gates and thin ViewModels',
        summary:
          'Proxy adds caching and retry invisible to callers; Facade hides a multi-service flow behind a single call so ViewModels stay thin.',
        href: '/notes/gof-patterns-android/proxy-facade/',
      },
      {
        title: 'Adapter & Factory: zero SDK lock-in and 10× faster tests',
        summary:
          "Adapter wraps any third-party SDK behind your own interface; Factory creates those implementations so they're mockable from day one.",
        href: '/notes/gof-patterns-android/adapter-factory/',
      },
      {
        title: 'Strategy & Decorator: A/B tests at runtime and additive layers',
        summary:
          'Strategy switches algorithms at runtime without touching business logic; Decorator wraps an interface to add one cross-cutting concern at a time.',
        href: '/notes/gof-patterns-android/strategy-decorator/',
      },
    ],
  },
  {
    url: '/es/notes/patrones-gof-android/',
    position: (order: number) => `Parte ${order} de 4`,
    link: 'Leer por separado',
    parts: [
      {
        title: 'Observer & State: UI que nunca miente',
        summary:
          'Observer mantiene la UI sincronizada con los datos automáticamente; State elimina los estados imposibles de pantalla en tiempo de compilación.',
        href: '/es/notes/patrones-gof-android/observer-state/',
      },
      {
        title: 'Proxy & Facade: cache gates y ViewModels delgados',
        summary:
          'Proxy agrega caché y reintentos invisibles para quien llama; Facade oculta un flujo de varios servicios detrás de una sola llamada para mantener delgados los ViewModels.',
        href: '/es/notes/patrones-gof-android/proxy-facade/',
      },
      {
        title: 'Adapter & Factory: cero lock-in de SDK y tests 10× más rápidos',
        summary:
          'Adapter envuelve cualquier SDK de terceros detrás de tu propia interfaz; Factory crea esas implementaciones de forma mockeable desde el día uno.',
        href: '/es/notes/patrones-gof-android/adapter-factory/',
      },
      {
        title: 'Strategy & Decorator: A/B tests en runtime y capas aditivas',
        summary:
          'Strategy cambia algoritmos en runtime sin tocar la lógica de negocio; Decorator envuelve una interfaz para agregar una preocupación transversal a la vez.',
        href: '/es/notes/patrones-gof-android/strategy-decorator/',
      },
    ],
  },
]

for (const { url, position, link, parts } of notes) {
  test(`every inlined part opens with a part card (${url})`, async ({
    page,
  }) => {
    await page.goto(url)
    await expect(page.locator('section.subpost')).toHaveCount(parts.length)

    for (const [index, part] of parts.entries()) {
      const order = index + 1
      const section = page.locator(`section.subpost#part-${order}`)
      const card = section.locator('.part-card')
      await expect(card).toHaveCount(1)

      await expect(card).toContainText(position(order))
      await expect(card).toContainText(/\d+ min/)
      const title = card.getByRole('heading', { level: 2 })
      await expect(title).toHaveText(part.title)
      await expect(card).toContainText(part.summary)

      const readAlone = card.getByRole('link', { name: new RegExp(`^${link}`) })
      await expect(readAlone).toHaveAttribute('href', part.href)
      // Four identical "Read on its own" links: each names its part too.
      await expect(readAlone).toHaveAccessibleName(
        new RegExp(part.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      )

      // Chapter > section: the card title is set larger than every h2 the
      // part itself contains.
      const sizes = await section.evaluate((element) => {
        const px = (node: Element) =>
          Number.parseFloat(getComputedStyle(node).fontSize)
        const cardTitle = element.querySelector('.part-card h2')
        const own = [...element.querySelectorAll(':scope > h2')]
        return {
          title: cardTitle ? px(cardTitle) : 0,
          own: own.map(px),
        }
      })
      expect(sizes.own.length).toBeGreaterThan(0)
      for (const size of sizes.own) {
        expect(sizes.title).toBeGreaterThan(size * 1.15)
      }
    }
  })
}

test('the part card link is reachable by keyboard and goes to the part', async ({
  page,
}) => {
  await page.goto('/notes/gof-patterns-android/')
  const readAlone = page
    .locator('#part-2 .part-card')
    .getByRole('link', { name: /^Read on its own/ })
  await readAlone.focus()
  await expect(readAlone).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/notes\/gof-patterns-android\/proxy-facade\/$/)
})
