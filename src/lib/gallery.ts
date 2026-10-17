import type { ImageMetadata } from 'astro'
import type { CollectionEntry } from 'astro:content'

export type GalleryItemEntry = CollectionEntry<'galleryItems'>
type ItemData = GalleryItemEntry['data']

type OfType<T extends ItemData['type']> = Extract<ItemData, { type: T }>

export type MediaItem = GalleryItemEntry & {
  data: OfType<'image'> | OfType<'video'>
}
export type FileItem = GalleryItemEntry & {
  data: OfType<'document'> | OfType<'archive'> | OfType<'link'>
}

/**
 * `Array.filter` does not narrow a discriminated union, so the two surfaces —
 * the bento of pictures and the list of files — get explicit guards rather
 * than casts at every use site.
 */
export const isMedia = (item: GalleryItemEntry): item is MediaItem =>
  item.data.type === 'image' || item.data.type === 'video'

export const isFile = (item: GalleryItemEntry): item is FileItem =>
  !isMedia(item)

/**
 * The picture a piece can be represented by when it is not playing: the image
 * itself, or a video's poster. A video without a poster has no still, and
 * pointing an image tag at the video file would ship a broken image.
 */
export const galleryStill = (item: MediaItem): string | undefined =>
  item.data.type === 'image' ? item.data.src : item.data.poster

/** One collection's items, in declared order. */
export const itemsInCollection = (
  items: readonly GalleryItemEntry[],
  key: string,
): GalleryItemEntry[] =>
  items
    .filter(({ data }) => data.collection === key)
    .toSorted((left, right) => left.data.order - right.data.order)

export interface GallerySheet<Entry> {
  entry: Entry
  items: GalleryItemEntry[]
  /** Up to five pieces that have a still to show on the contact sheet. */
  thumbs: MediaItem[]
  generated: number
  /** Item counts per type, in the order each type first appears. */
  tally: { type: ItemData['type']; count: number }[]
}

export interface GalleryTotals {
  collections: number
  pieces: number
  generated: number
}

const THUMBS_PER_SHEET = 5

/**
 * Everything the Gallery index shows about its collections, derived once from
 * the records instead of counted inside the component.
 */
export const summarizeGallery = <Entry extends CollectionEntry<'gallery'>>(
  entries: readonly Entry[],
  allItems: readonly GalleryItemEntry[],
): { sheets: GallerySheet<Entry>[]; totals: GalleryTotals } => {
  const sheets = entries.map((entry) => {
    const items = itemsInCollection(allItems, entry.data.translationKey)
    const counts = new Map<ItemData['type'], number>()
    for (const { data } of items) {
      counts.set(data.type, (counts.get(data.type) ?? 0) + 1)
    }
    return {
      entry,
      items,
      thumbs: items
        .filter(isMedia)
        .filter((item) => galleryStill(item) !== undefined)
        .slice(0, THUMBS_PER_SHEET),
      generated: items.filter(({ data }) => data.origin === 'generated').length,
      tally: [...counts].map(([type, count]) => ({ type, count })),
    }
  })
  return {
    sheets,
    totals: {
      collections: entries.length,
      pieces: sheets.reduce((sum, sheet) => sum + sheet.items.length, 0),
      generated: sheets.reduce((sum, sheet) => sum + sheet.generated, 0),
    },
  }
}

/**
 * Raster gallery assets imported through Vite, so `astro:assets` can resize
 * and re-encode them at build. Vectors stay out: an SVG has nothing to resize
 * and is served as authored.
 */
const rasters = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/gallery/*/assets/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
)

/**
 * Maps the public path an `items.yml` records (`/gallery/<collection>/<file>`)
 * onto the imported asset authored at
 * `src/content/gallery/<collection>/assets/<file>`.
 */
export const resolveGalleryImage = (src: string): ImageMetadata | undefined => {
  const match = /^\/gallery\/([^/]+)\/([^/]+)$/.exec(src)
  if (!match) return undefined
  return rasters[`/src/content/gallery/${match[1]}/assets/${match[2]}`]?.default
}
