import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { isProtectedManifest, type ProtectedManifest } from './manifest'

const generatedRoot = resolve('.generated/protected')

export const getGeneratedProtectedRoutes = async (): Promise<
  ProtectedManifest[]
> => {
  const manifests: ProtectedManifest[] = []
  const entries = await readdir(generatedRoot, { withFileTypes: true }).catch(
    () => [],
  )

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const locales = await readdir(join(generatedRoot, entry.name), {
      withFileTypes: true,
    })
    for (const locale of locales) {
      if (!locale.isDirectory()) continue
      const manifestPath = join(
        generatedRoot,
        entry.name,
        locale.name,
        'manifest.json',
      )
      const value: unknown = JSON.parse(await readFile(manifestPath, 'utf8'))
      if (!isProtectedManifest(value)) {
        throw new Error(`Invalid generated protected manifest: ${manifestPath}`)
      }
      manifests.push(value)
    }
  }

  const routeKeys = manifests.map(
    ({ locale, domain, slug }) => `${locale}:${domain}:${slug}`,
  )
  if (new Set(routeKeys).size !== routeKeys.length) {
    throw new Error('Generated protected routes must be unique')
  }
  return manifests
}
