import { describe, expect, it } from 'vitest'

import { renderArt } from '../../scripts/banner-art'
import { renderBanner } from '../../scripts/generate-banners'
import type { BannerSpec } from '@/data/banners'

const base: BannerSpec = {
  slug: 'probe',
  copy: {
    en: {
      kicker: 'API 23 · Oct 2015',
      title: ['Android 6.0', 'Marshmallow'],
      meta: 'Runtime permissions · Doze',
      alt: 'Android 6.0 Marshmallow banner.',
    },
    es: {
      kicker: 'API 23 · oct 2015',
      title: ['Android 6.0', 'Marshmallow'],
      meta: 'Permisos en ejecución · Doze',
      alt: 'Banner de Android 6.0 Marshmallow.',
    },
  },
  art: 'api-locked',
  accent: '#00875A',
  deep: '#0B2B22',
  pale: '#A7F3D0',
}

const fontSizeOf = (svg: string, text: string): number => {
  const match = new RegExp(`font-size="(\\d+)"[^>]*>${text}<`).exec(svg)
  return Number(match?.[1])
}

describe('renderBanner', () => {
  it('draws the motif and two equal title lines without a logo', () => {
    const svg = renderBanner(base, 'en', 'dark')
    expect(svg).toContain(renderArt('api-locked', '#00875A', '#94A3B8'))
    expect(svg).not.toContain('<image')
    expect(fontSizeOf(svg, 'Android 6.0')).toBe(72)
    expect(fontSizeOf(svg, 'Marshmallow')).toBe(72)
  })

  it('shows the version logo instead of the motif', () => {
    const svg = renderBanner(
      {
        ...base,
        logo: 'src/content/notes/android-6-marshmallow/assets/android-marshmallow-logo.svg',
      },
      'en',
      'dark',
    )
    expect(svg).toMatch(
      /<image [^>]*href="data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+"/,
    )
    expect(svg).not.toContain(renderArt('api-locked', '#00875A', '#94A3B8'))
  })

  it('makes "Android <version>" the headline and the name its subtext', () => {
    const svg = renderBanner(
      {
        ...base,
        logo: 'src/content/notes/android-6-marshmallow/assets/android-marshmallow-logo.svg',
      },
      'es',
      'light',
    )
    expect(fontSizeOf(svg, 'Android 6.0')).toBeGreaterThan(
      fontSizeOf(svg, 'Marshmallow'),
    )
    expect(fontSizeOf(svg, 'Android 6.0')).toBeGreaterThanOrEqual(88)
  })

  it('keeps the logo inside the right half of the safe band', () => {
    const svg = renderBanner(
      {
        ...base,
        logo: 'src/content/notes/android-6-marshmallow/assets/android-marshmallow-logo.svg',
      },
      'en',
      'dark',
    )
    const [, x, y, w, h] =
      /<image x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"/.exec(svg) ?? []
    expect(Number(x)).toBeGreaterThanOrEqual(700)
    expect(Number(x) + Number(w)).toBeLessThanOrEqual(1130)
    expect(Number(y)).toBeGreaterThanOrEqual(75)
    expect(Number(y) + Number(h)).toBeLessThanOrEqual(555)
  })
})
