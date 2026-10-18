import { describe, expect, it } from 'vitest'

import { getLegacyRoutes } from '@/data/legacy-routes'
import { getLegacyStaticPaths } from '@/lib/legacy-routes'

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

  it('keeps no URL of the retired tools, only the section root', () => {
    const tools = getLegacyRoutes().filter(({ source }) =>
      /^(\/es)?\/tools\//.test(source),
    )
    expect(tools.map(({ source, target }) => [source, target])).toEqual([
      ['/tools/', '/lab/'],
      ['/es/tools/', '/es/lab/'],
    ])
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

describe('legacy compatibility static paths', () => {
  const sections = ['blog', 'projects', 'tools', 'photos'] as const
  const locales = ['en', 'es'] as const

  it('builds every legacy route exactly once across the eight route files', () => {
    const built = sections.flatMap((section) =>
      locales.flatMap((locale) =>
        getLegacyStaticPaths(section, locale).map(({ props }) => props.route),
      ),
    )
    expect(built).toHaveLength(getLegacyRoutes().length)
    expect(new Set(built.map(({ source }) => source)).size).toBe(built.length)
  })

  it('maps a section root and a nested record to the rest parameter', () => {
    const paths = getLegacyStaticPaths('blog', 'en')
    expect(paths).toContainEqual(
      expect.objectContaining({
        params: { slug: undefined },
        props: expect.objectContaining({
          route: expect.objectContaining({ source: '/blog/' }),
        }),
      }),
    )
    expect(paths.map(({ params }) => params.slug)).toContain(
      'pretext/how-it-works',
    )
  })

  it('pairs each route with its counterpart in the other locale', () => {
    const english = getLegacyStaticPaths('projects', 'en').find(
      ({ params }) => params.slug === 'keyboard-simple',
    )
    expect(english?.props.counterpart).toEqual(
      expect.objectContaining({
        source: '/es/projects/keyboard-simple/',
        locale: 'es',
      }),
    )

    const spanish = getLegacyStaticPaths('photos', 'es').find(
      ({ params }) => params.slug === 'palo-alto',
    )
    expect(spanish?.props.route.source).toBe('/es/photos/palo-alto/')
    expect(spanish?.props.counterpart).toEqual(
      expect.objectContaining({ source: '/photos/palo-alto/', locale: 'en' }),
    )
  })
})
