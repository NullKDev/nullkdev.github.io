import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, delimiter, join, relative, resolve, sep } from 'node:path'

import {
  extractPrivateTextMarkers,
  parsePrivateMarkdown,
} from '../src/lib/protection/build'

const projectRoot = resolve(import.meta.dirname, '..')
const distRoot = resolve(
  process.env.PRIVATE_CONTENT_DIST_ROOT ?? join(projectRoot, 'dist'),
)
const configuredSourceRoots = process.env.PRIVATE_CONTENT_SOURCE_ROOTS
const privateRoots = configuredSourceRoots
  ? configuredSourceRoots
      .split(delimiter)
      .filter(Boolean)
      .map((path) => resolve(path))
  : [join(projectRoot, '.private-content')]
if (
  !configuredSourceRoots &&
  process.env.PRIVATE_CONTENT_INCLUDE_EXAMPLE === '1'
) {
  privateRoots.push(join(projectRoot, '.private-content.example'))
}

const exists = async (path: string) =>
  stat(path).then(
    () => true,
    () => false,
  )
const walkFiles = async (directory: string): Promise<string[]> => {
  if (!(await exists(directory))) return []
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? walkFiles(path) : Promise.resolve([path])
    }),
  )
  return nested.flat()
}

if (!(await exists(distRoot)))
  throw new Error('dist does not exist; build before scanning')

const configuredMarkers = (process.env.PRIVATE_CONTENT_LEAK_MARKERS ?? '')
  .split(',')
  .map((marker) => marker.trim())
  .filter(Boolean)
for (const root of privateRoots) {
  const markerFile = join(root, '.leak-markers')
  if (await exists(markerFile)) {
    configuredMarkers.push(
      ...(await readFile(markerFile, 'utf8'))
        .split(/\r?\n/)
        .map((marker) => marker.trim())
        .filter(Boolean),
    )
  }
}

const privateFiles = (await Promise.all(privateRoots.map(walkFiles))).flat()
const privateAssetFiles = privateFiles.filter((path) =>
  path.split(sep).includes('assets'),
)
const privateAssetNames = privateAssetFiles
  .map((path) => basename(path))
  .filter((name) => name.length > 4)
const privateTextMarkers = await Promise.all(
  privateFiles
    .filter((path) => path.endsWith('index.md'))
    .map(async (path) =>
      extractPrivateTextMarkers(
        parsePrivateMarkdown(await readFile(path, 'utf8')).markdown,
      ),
    ),
)
const configuredSecrets = Object.entries(process.env)
  .filter(
    ([name, value]) =>
      name.startsWith('PRIVATE_CONTENT_KEY_') && (value?.length ?? 0) >= 8,
  )
  .map(([, value]) => value as string)
const ASSET_WINDOW_BYTES = 32
const isBinaryAsset = (bytes: Buffer) => {
  const sample = bytes.subarray(0, Math.min(bytes.length, 512))
  const nonTextBytes = [...sample].filter(
    (byte) => byte === 0 || byte < 9 || (byte > 13 && byte < 32),
  ).length
  return nonTextBytes / Math.max(sample.length, 1) > 0.05
}
const privateAssetWindows = (
  await Promise.all(
    privateAssetFiles.map(async (path) => {
      const bytes = await readFile(path)
      if (bytes.length < ASSET_WINDOW_BYTES) return []
      if (!isBinaryAsset(bytes)) {
        return bytes
          .toString('utf8')
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length >= 24 && new Set(line).size >= 10)
          .map((line) => Buffer.from(line))
      }
      const starts = new Set([
        0,
        Math.floor((bytes.length - ASSET_WINDOW_BYTES) / 2),
        bytes.length - ASSET_WINDOW_BYTES,
      ])
      return [...starts]
        .map((start) => bytes.subarray(start, start + ASSET_WINDOW_BYTES))
        .filter((window) => new Set(window).size >= 8)
    }),
  )
).flat()
// The KDF salt is public by design and must be present in every encrypted envelope.
const forbiddenSerializedField =
  /["'](?:password|passwordHash|passphrase|secretKey|encryptionKey)["']\s*:/i
const textNeedles = [
  ...configuredMarkers.map((value) => ({
    category: 'configured-marker',
    value,
  })),
  ...privateAssetNames.map((value) => ({ category: 'asset-filename', value })),
  ...privateTextMarkers
    .flat()
    .map((value) => ({ category: 'private-text', value })),
  ...configuredSecrets.map((value) => ({
    category: 'environment-password',
    value,
  })),
]
const failures = new Set<string>()

for (const file of await walkFiles(distRoot)) {
  const bytes = await readFile(file)
  const content = bytes.toString('utf8')
  const target = relative(distRoot, file).split(sep).join('/')
  for (const needle of textNeedles) {
    if (content.includes(needle.value)) {
      failures.add(`category=${needle.category} target=${target}`)
    }
  }
  if (privateAssetWindows.some((window) => bytes.includes(window))) {
    failures.add(`category=asset-content target=${target}`)
  }
  if (forbiddenSerializedField.test(content))
    failures.add(`category=serialized-credential target=${target}`)
}

if (failures.size > 0)
  throw new Error(
    `Private-content leak scan failed:\n${[...failures].join('\n')}`,
  )
console.log(
  `Leak scan passed across dist with ${textNeedles.length} text marker(s) and ${privateAssetWindows.length} asset window(s).`,
)
