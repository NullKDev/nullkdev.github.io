import { spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'

import { afterEach, describe, expect, it } from 'vitest'

const temporaryRoots: string[] = []
const password = 'fixture-password-never-print-4b821'
const privateText = 'Distinct private telescope calibration notes 91f0.'
const assetName = 'private-orbit-payload.bin'
const assetBytes = Uint8Array.from(
  { length: 96 },
  (_, index) => (index * 47 + 19) % 256,
)

afterEach(async () => {
  await Promise.all(
    temporaryRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  )
})

const runLeakCase = async (
  category: string,
  publicContent: string | Uint8Array,
) => {
  const root = await mkdtemp(join(tmpdir(), 'private-leak-scan-'))
  temporaryRoots.push(root)
  const sourceRoot = join(root, 'private')
  const entryRoot = join(sourceRoot, 'fixture', 'en')
  const assetRoot = join(entryRoot, 'assets')
  const distRoot = join(root, 'dist')
  await mkdir(assetRoot, { recursive: true })
  await mkdir(distRoot, { recursive: true })
  await writeFile(
    join(entryRoot, 'index.md'),
    `---\nentryId: fixture\nlocale: en\nkeyId: fixture\ndomain: work\nslug: fixture\n---\n${privateText}\n`,
  )
  await writeFile(join(assetRoot, assetName), assetBytes)
  await writeFile(join(distRoot, 'leaked-output.bin'), publicContent)

  const result = spawnSync('bun', [resolve('scripts/scan-private-leaks.ts')], {
    cwd: resolve('.'),
    encoding: 'utf8',
    env: {
      ...process.env,
      PRIVATE_CONTENT_DIST_ROOT: distRoot,
      PRIVATE_CONTENT_SOURCE_ROOTS: sourceRoot,
      PRIVATE_CONTENT_KEY_FIXTURE: password,
    },
  })
  const output = `${result.stdout}\n${result.stderr}`

  expect(result.status).not.toBe(0)
  expect(output).toContain(`category=${category}`)
  expect(output).toContain('target=leaked-output.bin')
  expect(output).not.toContain(password)
  expect(output).not.toContain(privateText)
  expect(output).not.toContain(assetName)
}

describe('private leak scanner executable', () => {
  it('redacts a leaked environment password', async () => {
    await runLeakCase('environment-password', password)
  })

  it('redacts a leaked private text chunk', async () => {
    await runLeakCase('private-text', privateText)
  })

  it('redacts a leaked private asset filename', async () => {
    await runLeakCase('asset-filename', assetName)
  })

  it('detects representative private binary asset bytes', async () => {
    const leaked = new Uint8Array(160)
    leaked.set(assetBytes, 32)
    await runLeakCase('asset-content', leaked)
  })
})
