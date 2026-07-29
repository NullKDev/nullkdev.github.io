import type { Locale } from '@i18n/index'

export type ProtectedDomain = 'work' | 'lab' | 'notes' | 'gallery'

export interface ProtectedAssetManifestItem {
  assetId: string
  url: string
}

export interface ProtectedManifest {
  version: 1
  entryId: string
  locale: Locale
  domain: ProtectedDomain
  slug: string
  content: { url: string }
  assets: ProtectedAssetManifestItem[]
}

const identifier = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const isProtectedManifest = (
  value: unknown,
): value is ProtectedManifest => {
  if (!value || typeof value !== 'object') return false
  const manifest = value as Partial<ProtectedManifest>
  return (
    manifest.version === 1 &&
    typeof manifest.entryId === 'string' &&
    identifier.test(manifest.entryId) &&
    (manifest.locale === 'en' || manifest.locale === 'es') &&
    (manifest.domain === 'work' ||
      manifest.domain === 'lab' ||
      manifest.domain === 'notes' ||
      manifest.domain === 'gallery') &&
    typeof manifest.slug === 'string' &&
    identifier.test(manifest.slug) &&
    typeof manifest.content?.url === 'string' &&
    Array.isArray(manifest.assets) &&
    manifest.assets.every(
      (asset) =>
        typeof asset?.assetId === 'string' &&
        identifier.test(asset.assetId) &&
        typeof asset.url === 'string',
    )
  )
}
