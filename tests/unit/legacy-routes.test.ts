import { describe, expect, it } from 'vitest'

import { getLegacyRoutes } from '@/data/legacy-routes'

describe('legacy compatibility routes', () => {
  it('maps migrated content without redirect loops in both locales', () => {
    const routes = getLegacyRoutes()
    expect(routes).toContainEqual(
      expect.objectContaining({
        source: '/blog/pretext/how-it-works/',
        target: '/notes/pretext-text-layout/how-it-works/',
      }),
    )
    expect(routes).toContainEqual(
      expect.objectContaining({
        source: '/es/projects/keyboard-simple/',
        target: '/es/work/teclado-simple/',
      }),
    )
    expect(routes.every(({ source, target }) => source !== target)).toBe(true)
  })

  it('retires unverified photos honestly to Gallery', () => {
    const photos = getLegacyRoutes().filter(
      ({ retirement }) => retirement === 'photo',
    )
    expect(
      photos.map(
        ({ target }) => new URL(target, 'https://archive.test').pathname,
      ),
    ).toEqual(expect.arrayContaining(['/gallery/', '/es/gallery/']))
  })

  it('retires former Pretext demos without claiming they were migrated', () => {
    expect(getLegacyRoutes()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: '/blog/pretext/matteflow/',
          kind: 'retired',
          retirement: 'demo',
        }),
      ]),
    )
  })
})
