import { beforeEach, describe, expect, it } from 'vitest'

import { resetCollections, setCollection } from '../stubs/astro-content'

import { getGalleryItems, getGallerySheets } from '@/lib/content'
import {
  galleryStill,
  resolveGalleryImage,
  type GalleryItemEntry,
  type MediaItem,
} from '@/lib/gallery'
import type { CollectionEntry } from 'astro:content'

type Shape = {
  id: string
  collection: string
  order: number
  type: 'image' | 'video' | 'document' | 'archive' | 'link'
  origin?: 'captured' | 'generated'
  poster?: string
}

const item = ({
  id,
  collection,
  order,
  type,
  origin = 'captured',
  poster,
}: Shape) =>
  ({
    id: `${collection}/${id}`,
    collection: 'galleryItems',
    data: {
      id,
      collection,
      order,
      type,
      origin,
      src: `/gallery/${collection}/${id}.jpg`,
      ...(poster ? { poster } : {}),
    },
  }) as unknown as GalleryItemEntry

const sheet = (key: string) =>
  ({
    id: `gallery/${key}`,
    collection: 'gallery',
    data: { translationKey: key },
  }) as unknown as CollectionEntry<'gallery'>

beforeEach(() => resetCollections())

describe('gallery sheets', () => {
  it('groups items per collection in declared order and tallies them', async () => {
    setCollection('galleryItems', [
      item({ id: 'b', collection: 'one', order: 2, type: 'document' }),
      item({ id: 'a', collection: 'one', order: 1, type: 'image' }),
      item({
        id: 'c',
        collection: 'one',
        order: 3,
        type: 'image',
        origin: 'generated',
      }),
      item({ id: 'z', collection: 'two', order: 1, type: 'link' }),
    ])

    const { sheets, totals } = await getGallerySheets([
      sheet('one'),
      sheet('two'),
    ])

    expect(
      sheets.map((entry) => entry.items.map(({ data }) => data.id)),
    ).toEqual([['a', 'b', 'c'], ['z']])
    expect(sheets[0].tally).toEqual([
      { type: 'image', count: 2 },
      { type: 'document', count: 1 },
    ])
    expect(sheets[0].generated).toBe(1)
    expect(sheets[1].thumbs).toEqual([])
    expect(totals).toEqual({ collections: 2, pieces: 4, generated: 1 })
  })

  it('never offers a video without a poster as a thumbnail', async () => {
    setCollection('galleryItems', [
      item({ id: 'v', collection: 'one', order: 1, type: 'video' }),
      item({
        id: 'p',
        collection: 'one',
        order: 2,
        type: 'video',
        poster: '/gallery/one/p-poster.jpg',
      }),
      item({ id: 'i', collection: 'one', order: 3, type: 'image' }),
    ])

    const [{ thumbs }] = (await getGallerySheets([sheet('one')])).sheets

    expect(thumbs.map(({ data }) => data.id)).toEqual(['p', 'i'])
    expect(thumbs.map(galleryStill)).toEqual([
      '/gallery/one/p-poster.jpg',
      '/gallery/one/i.jpg',
    ])
  })

  it('keeps getGalleryItems on the same grouping', async () => {
    setCollection('galleryItems', [
      item({ id: 'b', collection: 'one', order: 2, type: 'image' }),
      item({ id: 'a', collection: 'one', order: 1, type: 'image' }),
      item({ id: 'x', collection: 'two', order: 1, type: 'image' }),
    ])

    const items = await getGalleryItems(
      sheet('one') as unknown as Parameters<typeof getGalleryItems>[0],
    )
    expect(items.map(({ data }) => data.id)).toEqual(['a', 'b'])
  })
})

describe('gallery image sources', () => {
  it('resolves an authored raster to its imported asset', () => {
    expect(
      resolveGalleryImage('/gallery/san-francisco/preview.jpg'),
    ).toBeDefined()
  })

  it('leaves vectors, unknown files and foreign paths unresolved', () => {
    expect(
      resolveGalleryImage('/gallery/signal-archive/signal-mark.svg'),
    ).toBeUndefined()
    expect(
      resolveGalleryImage('/gallery/san-francisco/missing.jpg'),
    ).toBeUndefined()
    expect(resolveGalleryImage('/banners/work.svg')).toBeUndefined()
  })

  it('has no still for a video without a poster', () => {
    const video = item({
      id: 'v',
      collection: 'one',
      order: 1,
      type: 'video',
    }) as MediaItem
    expect(galleryStill(video)).toBeUndefined()
  })
})
