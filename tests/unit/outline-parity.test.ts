import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  buildEntryOutline,
  getCounterpartAnchors,
  getPartAnchor,
  type OutlineHeading,
} from '@/lib/outline'

/* The language switch keeps the reader's place by heading order: heading i in
   English lands on heading i in Spanish. That is only true while both
   translations of a note have the same outline. When they do not,
   `getCounterpartAnchors` returns nothing and the switch lands at the top —
   correct, but a lost feature. This test reads the real notes so a translation
   that drifts is noticed rather than silently degrading. */

const NOTES = join(process.cwd(), 'src/content/notes')

/** h2/h3 from markdown, outside fenced code, in source order. */
const readHeadings = (path: string): OutlineHeading[] => {
  const body = readFileSync(path, 'utf8').replace(/^---[\s\S]*?\n---\n/, '')
  const headings: OutlineHeading[] = []
  let fenced = false
  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced
    if (fenced) continue
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (match) {
      headings.push({
        depth: match[1].length,
        slug: `${path}#${headings.length}`,
        text: match[2],
      })
    }
  }
  return headings
}

const findFile = (dir: string, base: string) =>
  ['.md', '.mdx']
    .map((extension) => join(dir, `${base}${extension}`))
    .find((path) => existsSync(path))

const readOrder = (path: string) =>
  Number(/^order:\s*(\d+)/m.exec(readFileSync(path, 'utf8'))?.[1] ?? 0)

const outlineFor = (dir: string, suffix: '' | '.es') => {
  const entry = findFile(dir, `index${suffix}`)
  if (!entry) return undefined
  const contentDir = join(dir, 'content')
  const parts = existsSync(contentDir)
    ? readdirSync(contentDir)
        .filter((name) =>
          suffix ? /\.es\.mdx?$/.test(name) : !/\.es\.mdx?$/.test(name),
        )
        .map((name) => join(contentDir, name))
        .map((path) => ({ path, order: readOrder(path) }))
        .toSorted((left, right) => left.order - right.order)
        .map(({ path, order }) => ({
          slug: getPartAnchor(order),
          title: `${order}`,
          headings: readHeadings(path),
        }))
    : []
  return buildEntryOutline(readHeadings(entry), parts)
}

const pairs = readdirSync(NOTES, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map(({ name }) => ({
    name,
    en: outlineFor(join(NOTES, name), ''),
    es: outlineFor(join(NOTES, name), '.es'),
  }))
  .filter(({ en, es }) => en && es)

describe('translated note outlines', () => {
  it('finds the translated notes', () => {
    expect(pairs.length).toBeGreaterThan(0)
  })

  it.each(pairs)(
    '$name keeps its place across the language switch',
    ({ en, es }) => {
      const anchors = getCounterpartAnchors(en!, es)
      expect(anchors && Object.keys(anchors)).toHaveLength(en!.length)
    },
  )
})
