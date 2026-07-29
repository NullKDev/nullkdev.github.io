import { readdir, readFile, rm, stat, writeFile, mkdir } from 'node:fs/promises'
import { extname, join, relative, resolve, sep } from 'node:path'

import { marked } from 'marked'

import {
  parsePrivateMarkdown,
  safeAssetPath,
  sanitizeRenderedHtml,
  secretEnvironmentName,
} from '../src/lib/protection/build'
import {
  encryptPayload,
  type ProtectionContext,
} from '../src/lib/protection/crypto'

const projectRoot = resolve(import.meta.dirname, '..')
const outputRoot = join(projectRoot, '.generated', 'protected')
const sourceRoots = [join(projectRoot, '.private-content')]
if (process.env.PRIVATE_CONTENT_INCLUDE_EXAMPLE === '1') {
  sourceRoots.push(join(projectRoot, '.private-content.example'))
}

const exists = async (path: string) =>
  stat(path).then(
    () => true,
    () => false,
  )

const walkFiles = async (directory: string): Promise<string[]> => {
  if (!(await exists(directory))) return []
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? walkFiles(path) : Promise.resolve([path])
    }),
  )
  return files.flat().sort()
}

const mimeType = (path: string) => {
  const extension = extname(path).toLowerCase()
  return (
    {
      '.avif': 'image/avif',
      '.gif': 'image/gif',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
    }[extension] ?? 'application/octet-stream'
  )
}

const writeJson = async (path: string, value: unknown) => {
  await mkdir(resolve(path, '..'), { recursive: true })
  await writeFile(path, `${JSON.stringify(value)}\n`)
}

await rm(outputRoot, { recursive: true, force: true })
await mkdir(outputRoot, { recursive: true })

const sourceFiles = (await Promise.all(sourceRoots.map(walkFiles))).flat()
const indexes = sourceFiles.filter((path) => path.endsWith(`${sep}index.md`))

for (const indexPath of indexes) {
  const entryDirectory = resolve(indexPath, '..')
  const parsed = parsePrivateMarkdown(await readFile(indexPath, 'utf8'))
  const { entryId, locale, keyId, domain, slug } = parsed.metadata
  if (
    entryDirectory.split(sep).at(-1) !== locale ||
    entryDirectory.split(sep).at(-2) !== entryId
  ) {
    throw new Error(
      `Private content path does not match frontmatter: ${indexPath}`,
    )
  }

  const environmentName = secretEnvironmentName(keyId)
  const password = process.env[environmentName]
  if (!password)
    throw new Error(
      `Missing required private-content secret: ${environmentName}`,
    )

  const assetDirectory = join(entryDirectory, 'assets')
  const assetFiles = await walkFiles(assetDirectory)
  const assets = assetFiles.map((path, index) => ({
    path,
    source: safeAssetPath(relative(entryDirectory, path).split(sep).join('/')),
    assetId: `asset-${index + 1}`,
  }))

  let markdown = parsed.markdown
  for (const asset of assets) {
    markdown = markdown.replaceAll(
      `./${asset.source}`,
      `protected-asset:${asset.assetId}`,
    )
    markdown = markdown.replaceAll(
      asset.source,
      `protected-asset:${asset.assetId}`,
    )
  }
  const rendered = sanitizeRenderedHtml(
    (await marked.parse(markdown)).replaceAll(
      /src="protected-asset:([a-z0-9-]+)"/g,
      'data-protected-asset="$1"',
    ),
  )

  const contentContext: ProtectionContext = {
    entryId,
    locale,
    payloadKind: 'document',
    payloadId: 'content',
    contentType: 'text/html; charset=utf-8',
  }
  const targetDirectory = join(outputRoot, entryId, locale)
  await writeJson(
    join(targetDirectory, 'content.envelope.json'),
    await encryptPayload(
      password,
      new TextEncoder().encode(rendered),
      contentContext,
    ),
  )

  const manifestAssets = []
  for (const asset of assets) {
    const contentType = mimeType(asset.path)
    const envelopeName = `${asset.assetId}.envelope.json`
    await writeJson(
      join(targetDirectory, envelopeName),
      await encryptPayload(
        password,
        new Uint8Array(await readFile(asset.path)),
        {
          entryId,
          locale,
          payloadKind: 'asset',
          payloadId: asset.assetId,
          contentType,
        },
      ),
    )
    manifestAssets.push({
      assetId: asset.assetId,
      url: `/protected/${entryId}/${locale}/${envelopeName}`,
    })
  }

  await writeJson(join(targetDirectory, 'manifest.json'), {
    version: 1,
    entryId,
    locale,
    domain,
    slug,
    content: { url: `/protected/${entryId}/${locale}/content.envelope.json` },
    assets: manifestAssets,
  })
}

console.log(`Generated ${indexes.length} encrypted private-content record(s).`)
