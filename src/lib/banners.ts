import type { Locale } from '@/i18n'

/**
 * Resolves a banner's variants for a locale.
 *
 * `banners:build` emits four SVG per banner — two locales × two surfaces — plus
 * one PNG per locale for social scrapers. An entry stores only the base path,
 * so every surface that renders a banner has to derive the rest.
 *
 * This lives in `lib/` rather than in the component that first needed it. The
 * derivation was written inline in `EntryPage` and the five card surfaces kept
 * rendering the raw `image` field: English copy on Spanish pages, dark artwork
 * in light theme. One shared derivation is the difference between fixing a bug
 * and fixing it in one of six places.
 */
export interface BannerSources {
  /** Dark-surface SVG. What the `<img>` loads. */
  readonly dark: string
  /** Light-surface SVG. CSS swaps to it via `--banner-light`. */
  readonly light: string
  /** Rasterised dark surface, for `og:image`. Scrapers ignore SVG. */
  readonly social: string
}

/** `/banners/<slug>.svg` → `<slug>`. Anything else is not a generated banner. */
const slugOf = (image: string | undefined): string | undefined =>
  image?.match(/\/banners\/([^/]+?)(?:-es)?(?:-light)?\.svg$/)?.[1]

export const getBannerSources = (
  image: string | undefined,
  locale: Locale,
): BannerSources | undefined => {
  const slug = slugOf(image)
  if (!slug) return undefined

  const suffix = locale === 'es' ? '-es' : ''
  return {
    dark: `/banners/${slug}${suffix}.svg`,
    light: `/banners/${slug}${suffix}-light.svg`,
    social: `/og/banners/${slug}${suffix}.png`,
  }
}

/**
 * Inline style that hands the light variant to CSS.
 *
 * The value is per-entry, so it cannot live in a stylesheet; the swap rule can.
 * Returns `undefined` rather than an empty string so the attribute is omitted
 * entirely when there is no banner.
 */
export const bannerStyle = (
  sources: BannerSources | undefined,
): string | undefined =>
  sources ? `--banner-light: url(${sources.light})` : undefined
