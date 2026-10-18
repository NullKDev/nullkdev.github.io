import { glob, readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

/**
 * Every version note in the Android series rests on at least five distinct
 * websites (docs/writing-notes.md). Wikimedia hosts the images, so it does not
 * count as a source for what the release did.
 */
const MIN_SOURCES = 5
const IMAGE_HOSTS = new Set(['commons.wikimedia.org', 'upload.wikimedia.org'])

interface Note {
  readonly file: string
  readonly series?: { id: string }
  readonly citations?: readonly { url: string }[]
}

const seriesNotes = async (): Promise<Note[]> => {
  const notes: Note[] = []
  for await (const file of glob('src/content/notes/*/index*.md')) {
    const text = (await readFile(file, 'utf8')).replace(/\r\n?/g, '\n')
    const match = /^---\n([\s\S]*?)\n---/.exec(text)
    if (!match) continue
    const data = parse(match[1]) as Omit<Note, 'file'>
    if (data.series?.id === 'android-versions') notes.push({ file, ...data })
  }
  return notes
}

export const distinctSources = (
  citations: readonly { url: string }[] = [],
): number =>
  new Set(
    citations
      .map(({ url }) => new URL(url).hostname.replace(/^www\./, ''))
      .filter((host) => !IMAGE_HOSTS.has(host)),
  ).size

describe('android-versions series sources', () => {
  it('finds the series', async () => {
    expect((await seriesNotes()).length).toBeGreaterThanOrEqual(38)
  })

  it(`backs every note with at least ${MIN_SOURCES} distinct websites`, async () => {
    const thin = (await seriesNotes())
      .map((note) => ({
        file: note.file,
        count: distinctSources(note.citations),
      }))
      .filter(({ count }) => count < MIN_SOURCES)
      .map(({ file, count }) => `${file}: ${count}`)
    expect(thin).toEqual([])
  })

  it('counts websites, not pages, and ignores the image host', () => {
    expect(
      distinctSources([
        { url: 'https://developer.android.com/a' },
        { url: 'https://developer.android.com/b' },
        { url: 'https://www.androidpolice.com/x' },
        { url: 'https://commons.wikimedia.org/wiki/File:x.svg' },
      ]),
    ).toBe(2)
  })
})
