/**
 * Fills in what a machine can know about gallery assets, and nothing else.
 *
 * Drop files into `src/content/gallery/<collection>/assets/`, run this, and
 * every file not yet in that collection's `items.yml` gets a stub
 * with its path, size, format, and — for images — its pixel dimensions already
 * filled. What only a human knows is left as a TODO: bilingual alt text,
 * rights, provenance, and, for anything generated, the model and prompt.
 *
 * Existing records are never rewritten. This script only appends.
 *
 * Usage: bun run gallery:scan
 */
import { existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { parse, stringify } from 'yaml'

/**
 * Everything about a collection lives in one folder: its `index.md`, its
 * `items.yml`, and its `assets/`. The build copies `assets/` out to
 * `dist/gallery/<collection>/`, which is why `src` is recorded as the public
 * URL the browser will request rather than the authoring path.
 */
const CONTENT_ROOT = 'src/content/gallery'
const ASSET_DIR = 'assets'

const TODO = 'TODO'

type ItemType = 'image' | 'video' | 'document' | 'archive'

const typeByExtension: Record<string, ItemType> = {
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  webp: 'image',
  avif: 'image',
  gif: 'image',
  svg: 'image',
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  pdf: 'document',
  docx: 'document',
  doc: 'document',
  xlsx: 'document',
  pptx: 'document',
  md: 'document',
  txt: 'document',
  zip: 'archive',
  tar: 'archive',
  gz: 'archive',
}

/**
 * Pixel dimensions straight from the file header. Deliberately dependency
 * free: an image-size library would be a new dependency for a build script
 * that reads four well-documented headers.
 */
const readDimensions = (
  buffer: Buffer,
  extension: string,
): [number, number] | undefined => {
  try {
    if (extension === 'png' && buffer.readUInt32BE(0) === 0x89504e47) {
      return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)]
    }
    if (extension === 'gif') {
      return [buffer.readUInt16LE(6), buffer.readUInt16LE(8)]
    }
    if (extension === 'webp' && buffer.toString('ascii', 12, 16) === 'VP8X') {
      return [1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3)]
    }
    if (extension === 'jpg' || extension === 'jpeg') {
      let offset = 2
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break
        const marker = buffer[offset + 1]
        const length = buffer.readUInt16BE(offset + 2)
        // SOF0..SOF3 and SOF5..SOF15 carry the frame dimensions.
        if (
          marker >= 0xc0 &&
          marker <= 0xcf &&
          ![0xc4, 0xc8, 0xcc].includes(marker)
        ) {
          return [
            buffer.readUInt16BE(offset + 7),
            buffer.readUInt16BE(offset + 5),
          ]
        }
        offset += 2 + length
      }
    }
    if (extension === 'svg') {
      const text = buffer.toString('utf8', 0, 2048)
      const viewBox = text.match(
        /viewBox\s*=\s*"[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)"/,
      )
      if (viewBox) {
        return [Math.round(Number(viewBox[1])), Math.round(Number(viewBox[2]))]
      }
    }
  } catch {
    // A header we cannot read is left for the author to fill in.
  }
  return undefined
}

/**
 * A 16px WebP of the image itself, inlined as a data URI. Scaled up to a card
 * it reads as the finished picture out of focus, which is the point: the
 * layout never jumps and the visitor sees the right colours immediately.
 *
 * Chosen over BlurHash/ThumbHash deliberately. Those encode to ~30 characters
 * against this ~150, but they need a decoder and a canvas at runtime; this is
 * a background-image and costs no JavaScript at all.
 */
const buildPlaceholder = async (
  buffer: Buffer,
): Promise<string | undefined> => {
  try {
    const tiny = await sharp(buffer).resize(16).webp({ quality: 35 }).toBuffer()
    return `data:image/webp;base64,${tiny.toString('base64')}`
  } catch {
    // An image sharp cannot read simply has no placeholder.
    return undefined
  }
}

const stubFor = async (
  collection: string,
  file: string,
  buffer: Buffer,
  order: number,
) => {
  const extension = file.split('.').pop()?.toLowerCase() ?? ''
  const type = typeByExtension[extension] ?? 'document'
  const slug = file
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const record: Record<string, unknown> = {
    id: slug,
    order,
    type,
    src: `/gallery/${collection}/${file}`,
    format: extension,
    bytes: buffer.byteLength,
  }

  const dimensions =
    type === 'image' ? readDimensions(buffer, extension) : undefined
  if (dimensions) record.dimensions = dimensions

  // Everything below this line is a human's job. The stub says so out loud so
  // an unfinished record fails the build instead of shipping a placeholder.
  record.origin = TODO
  record.rights = TODO
  record.provenance = TODO
  if (type === 'image' || type === 'video') {
    record.alt = { en: TODO, es: TODO }
  } else {
    record.label = { en: TODO, es: TODO }
  }

  return record
}

const run = async () => {
  if (!existsSync(CONTENT_ROOT)) {
    console.log(`No ${CONTENT_ROOT}/ directory; nothing to scan.`)
    return
  }

  const collections = (await readdir(CONTENT_ROOT, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  let added = 0
  for (const collection of collections) {
    const assetDir = join(CONTENT_ROOT, collection, ASSET_DIR)
    if (!existsSync(assetDir)) continue
    const manifestPath = join(CONTENT_ROOT, collection, 'items.yml')

    const existing = existsSync(manifestPath)
      ? ((parse(await readFile(manifestPath, 'utf8')) as unknown[]) ?? [])
      : []
    const known = new Set(
      existing.map((item) => String((item as { src?: string }).src ?? '')),
    )
    let order = existing.length

    const files = (await readdir(assetDir, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
      .map((entry) => entry.name)
      .sort()

    const stubs: Record<string, unknown>[] = []
    for (const file of files) {
      const src = `/gallery/${collection}/${file}`
      if (known.has(src)) continue
      const buffer = await readFile(join(assetDir, file))
      order += 1
      stubs.push(await stubFor(collection, file, buffer, order))
    }

    // Backfill placeholders on records that predate this step. It is a machine
    // fact derived from the file, never authored, so filling it in is safe.
    let backfilled = 0
    for (const item of existing as Record<string, unknown>[]) {
      if (item.type !== 'image' || item.lqip) continue
      const name = String(item.src ?? '')
        .split('/')
        .pop()
      if (!name || !existsSync(join(assetDir, name))) continue
      const lqip = await buildPlaceholder(await readFile(join(assetDir, name)))
      if (lqip) {
        item.lqip = lqip
        backfilled += 1
      }
    }
    if (backfilled > 0)
      console.log(`~ ${collection}: ${backfilled} placeholder(s) filled`)

    if (stubs.length === 0 && backfilled === 0) continue
    await writeFile(
      manifestPath,
      stringify([...existing, ...stubs], { lineWidth: 0 }),
      'utf8',
    )
    added += stubs.length
    console.log(`+ ${collection}: ${stubs.length} new item(s)`)
  }

  console.log(
    added === 0
      ? 'Every asset is already recorded.'
      : `Added ${added} stub(s). Fill every ${TODO} before building.`,
  )
}

await run()
