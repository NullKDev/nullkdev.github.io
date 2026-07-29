/**
 * Gallery assets are authored beside their manifest, inside
 * `src/content/gallery/<collection>/assets/`, so everything about a collection
 * lives in one folder. Astro does not serve `src/`, so the built site gets a
 * copy at `dist/gallery/<collection>/` — the path recorded in `items.yml`.
 */
import { existsSync } from 'node:fs'
import { cp, mkdir, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(projectRoot, 'src/content/gallery')
const target = resolve(projectRoot, 'dist/gallery')

if (!existsSync(source)) {
  console.log('No gallery collections; nothing to copy.')
  process.exit(0)
}

let copied = 0
for (const entry of await readdir(source, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const assets = join(source, entry.name, 'assets')
  if (!existsSync(assets)) continue
  const destination = join(target, entry.name)
  await mkdir(destination, { recursive: true })
  await cp(assets, destination, { recursive: true })
  copied += (await readdir(assets)).length
}

console.log(`Copied ${copied} gallery asset(s) into dist/gallery/.`)
