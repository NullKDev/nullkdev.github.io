import type { CollectionEntry } from 'astro:content'
import { describe, expect, it } from 'vitest'

import { getSeriesTitle, seriesIds } from '@/data/series'
import { en } from '@/i18n/en'
import { es } from '@/i18n/es'
import { formatPartCount, formatPartOf, getSeriesPosition } from '@/lib/series'

type Note = CollectionEntry<'notes'>

const note = (
  id: string,
  series?: { id: string; order: number },
  locale = 'en',
): Note =>
  ({
    id,
    collection: 'notes',
    data: { locale, translationKey: id, series },
  }) as unknown as Note

describe('series registry', () => {
  it('gives every series a display title in both locales', () => {
    for (const id of seriesIds) {
      expect(getSeriesTitle(id, 'en')).toBeTruthy()
      expect(getSeriesTitle(id, 'es')).toBeTruthy()
    }
  })

  it('never falls back to printing the raw id', () => {
    expect(getSeriesTitle('android-17', 'en')).toBe('Android 17')
    expect(getSeriesTitle('not-a-series', 'en')).toBeUndefined()
  })
})

describe('getSeriesPosition', () => {
  const pool = [
    note('beta', { id: 'android-17', order: 1 }),
    note('stable', { id: 'android-17', order: 2 }),
    note('memory', { id: 'android-17', order: 3 }),
    note('gof', { id: 'gof-android', order: 1 }),
    note('loose'),
  ]

  it('places a member of a real series and names it', () => {
    expect(getSeriesPosition(pool[1], pool, 'es')).toEqual({
      id: 'android-17',
      title: 'Android 17',
      order: 2,
      total: 3,
    })
  })

  it('counts the position among published siblings, not the raw order', () => {
    // Orders 2, 5 and 7 with 1, 3, 4 and 6 not written yet read "Part 7 of 3".
    const gapped = [
      note('kitkat', { id: 'android-17', order: 2 }),
      note('marshmallow', { id: 'android-17', order: 5 }),
      note('nougat', { id: 'android-17', order: 7 }),
    ]
    expect(getSeriesPosition(gapped[2], gapped, 'en')).toMatchObject({
      order: 3,
      total: 3,
    })
    expect(getSeriesPosition(gapped[0], gapped, 'en')).toMatchObject({
      order: 1,
      total: 3,
    })
  })

  it('counts each locale on its own', () => {
    const mixed = [
      note('a', { id: 'android-17', order: 1 }),
      note('b', { id: 'android-17', order: 2 }),
      note('b-es', { id: 'android-17', order: 2 }, 'es'),
      note('c-es', { id: 'android-17', order: 3 }, 'es'),
    ]
    expect(getSeriesPosition(mixed[3], mixed, 'es')).toMatchObject({
      order: 2,
      total: 2,
    })
  })

  it('says nothing for a series of one or no series at all', () => {
    expect(getSeriesPosition(pool[3], pool, 'en')).toBeUndefined()
    expect(getSeriesPosition(pool[4], pool, 'en')).toBeUndefined()
  })
})

describe('part labels', () => {
  it('reads "Part n of m" in both locales', () => {
    expect(formatPartOf(en.archive.partOf, 2, 3)).toBe('Part 2 of 3')
    expect(formatPartOf(es.archive.partOf, 2, 3)).toBe('Parte 2 de 3')
  })

  it('counts parts only when there is more than one', () => {
    expect(formatPartCount(en.notes.partCount, 4)).toBe('4 parts')
    expect(formatPartCount(es.notes.partCount, 4)).toBe('4 partes')
    expect(formatPartCount(en.notes.partCount, 1)).toBeUndefined()
    expect(formatPartCount(en.notes.partCount, 0)).toBeUndefined()
  })
})
