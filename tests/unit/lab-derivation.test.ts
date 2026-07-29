import { describe, expect, it } from 'vitest'

import { isFile, isMedia, type GalleryItemEntry } from '@/lib/gallery'
import {
  formatBytes,
  getDataHosts,
  getExecutionTone,
  getTotalDownloadBytes,
} from '@/lib/lab'
import { getLifecycleTone } from '@/lib/status'

const item = (type: string) =>
  ({ data: { type } }) as unknown as GalleryItemEntry

describe('lifecycle tone', () => {
  it('collapses each collection vocabulary onto the shared tone', () => {
    for (const value of ['shipped', 'maintained', 'stable', 'curated']) {
      expect(getLifecycleTone(value)).toBe('live')
    }
    for (const value of ['prototype', 'research', 'collecting']) {
      expect(getLifecycleTone(value)).toBe('progress')
    }
    for (const value of ['archived', 'superseded']) {
      expect(getLifecycleTone(value)).toBe('archived')
    }
  })

  it('falls back to neutral instead of guessing at an unknown lifecycle', () => {
    // A new vocabulary word should render as unremarkable, never as "live".
    expect(getLifecycleTone('experimental')).toBe('neutral')
    expect(getLifecycleTone('')).toBe('neutral')
  })
})

describe('execution tone', () => {
  it('separates local execution from anything that leaves the browser', () => {
    expect(getExecutionTone('local')).toBe('live')
    expect(getExecutionTone('third-party-network')).toBe('progress')
    expect(getExecutionTone('unknown')).toBe('neutral')
  })
})

describe('data hosts', () => {
  it('deduplicates and sorts, so the disclosure is stable between builds', () => {
    expect(
      getDataHosts([
        'https://b.example/one',
        'https://a.example/two',
        'https://b.example/three',
      ]),
    ).toEqual(['a.example', 'b.example'])
  })

  it('drops a malformed URL rather than printing it raw', () => {
    // This list is what tells a reader where their input goes. A parse failure
    // must not surface as an unparsed string in a privacy claim.
    expect(getDataHosts(['not a url', 'https://ok.example/x'])).toEqual([
      'ok.example',
    ])
  })

  it('reports nothing when an entry contacts nothing', () => {
    expect(getDataHosts([])).toEqual([])
  })
})

describe('byte formatting', () => {
  it('uses binary prefixes, because a download does', () => {
    expect(formatBytes(512, 'en')).toBe('512 B')
    expect(formatBytes(1024, 'en')).toBe('1 KB')
    expect(formatBytes(1024 * 1024, 'en')).toBe('1 MB')
    expect(formatBytes(1024 ** 4, 'en')).toBe('1 TB')
  })

  it('keeps one decimal only where it carries information', () => {
    // 1.5 KB is worth saying; 512 KB does not need ".0", and bytes never do.
    expect(formatBytes(1536, 'en')).toBe('1.5 KB')
    expect(formatBytes(1024 * 512, 'en')).toBe('512 KB')
    expect(formatBytes(999, 'en')).toBe('999 B')
  })

  it('stops at the largest unit rather than inventing one', () => {
    expect(formatBytes(1024 ** 5, 'en')).toBe('1,024 TB')
  })

  it('formats the number in the reader locale', () => {
    expect(formatBytes(1024 ** 5, 'es')).toBe('1024 TB')
  })

  it('sums downloads', () => {
    expect(getTotalDownloadBytes([{ bytes: 10 }, { bytes: 32 }])).toBe(42)
    expect(getTotalDownloadBytes([])).toBe(0)
  })
})

describe('gallery guards', () => {
  it('narrows media and files as complements of each other', () => {
    expect(isMedia(item('image'))).toBe(true)
    expect(isMedia(item('video'))).toBe(true)
    expect(isMedia(item('document'))).toBe(false)

    for (const type of ['document', 'archive', 'link']) {
      expect(isFile(item(type))).toBe(true)
    }
    expect(isFile(item('image'))).toBe(false)
  })

  it('routes an unrecognised type to the file list, never dropping it', () => {
    // isFile is defined as "not media", so a new type still renders somewhere
    // instead of vanishing from both surfaces.
    expect(isFile(item('spreadsheet'))).toBe(true)
  })
})
