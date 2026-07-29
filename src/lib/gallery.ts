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
