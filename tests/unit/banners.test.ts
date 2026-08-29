import { describe, expect, it } from 'vitest'

import { bannerStyle, getBannerSources } from '@/lib/banners'

describe('banner sources', () => {
  it('derives all three surfaces from the base path for English', () => {
    expect(getBannerSources('/banners/codex-security.svg', 'en')).toEqual({
      dark: '/banners/codex-security.svg',
      light: '/banners/codex-security-light.svg',
      social: '/og/banners/codex-security.png',
    })
  })

  it('adds the locale suffix for Spanish, artwork included', () => {
    // The bug this module exists for: five card surfaces rendered the raw
    // `image` field, so a Spanish page showed English artwork.
    expect(getBannerSources('/banners/codex-security.svg', 'es')).toEqual({
      dark: '/banners/codex-security-es.svg',
      light: '/banners/codex-security-es-light.svg',
      social: '/og/banners/codex-security-es.png',
    })
  })

  it('serves the social variant as PNG, because scrapers ignore SVG', () => {
    // X, Facebook, LinkedIn, Slack and WhatsApp render nothing for an SVG
    // og:image, so this must never resolve to the .svg the page displays.
    const sources = getBannerSources('/banners/pretext.svg', 'en')
    expect(sources?.social).toMatch(/\.png$/)
    expect(sources?.social).not.toMatch(/\.svg$/)
  })

  it('normalises an already-derived path back to the same slug', () => {
    // A caller passing a variant it derived earlier must not compound the
    // suffix into `-es-es` or `-light-light`.
    const canonical = getBannerSources('/banners/gof-android.svg', 'es')
    for (const variant of [
      '/banners/gof-android-es.svg',
      '/banners/gof-android-light.svg',
      '/banners/gof-android-es-light.svg',
    ]) {
      expect(getBannerSources(variant, 'es')).toEqual(canonical)
    }
  })

  it('returns undefined for anything that is not a generated banner', () => {
    expect(getBannerSources(undefined, 'en')).toBeUndefined()
    expect(getBannerSources('', 'en')).toBeUndefined()
    expect(getBannerSources('/gallery/photo.jpg', 'en')).toBeUndefined()
    expect(getBannerSources('/banners/nested/path.png', 'en')).toBeUndefined()
  })
})

describe('banner style', () => {
  it('hands the light variant to CSS as a custom property', () => {
    const sources = getBannerSources('/banners/chandra-ocr.svg', 'en')
    expect(bannerStyle(sources)).toBe(
      '--banner-light: url(/banners/chandra-ocr-light.svg)',
    )
  })

  it('omits the attribute entirely rather than emitting an empty one', () => {
    // An empty string would still render `style=""` on the figure.
    expect(bannerStyle(undefined)).toBeUndefined()
  })
})
