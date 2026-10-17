import { describe, expect, it } from 'vitest'

import {
  buildDocumentOutline,
  buildEntryOutline,
  getPartAnchor,
} from '@/lib/outline'

const heading = (depth: number, slug: string) => ({
  depth,
  slug,
  text: slug.toUpperCase(),
})

describe('entry outline', () => {
  it('keeps only h2 and h3, and nests subpost headings under their part', () => {
    const outline = buildEntryOutline(
      [heading(1, 'title'), heading(2, 'intro'), heading(3, 'detail')],
      [
        {
          slug: 'part-1',
          title: 'Part one',
          headings: [heading(2, 'setup'), heading(3, 'step'), heading(4, 'x')],
        },
      ],
    )
    expect(outline).toEqual([
      { slug: 'intro', text: 'INTRO', level: 1 },
      { slug: 'detail', text: 'DETAIL', level: 2 },
      { slug: 'part-1', text: 'Part one', level: 1 },
      { slug: 'setup', text: 'SETUP', level: 2 },
      { slug: 'step', text: 'STEP', level: 3 },
    ])
  })

  it('is empty when nothing qualifies', () => {
    expect(buildEntryOutline([heading(4, 'deep')], [])).toEqual([])
  })
})

describe('document outline', () => {
  it('applies the same h2–h3 rule a subpost gets inside its entry', () => {
    /* A subpost on its own URL used to list every heading depth while the
       same content inside the entry kept h2–h3 only. */
    expect(
      buildDocumentOutline([
        heading(1, 'title'),
        heading(2, 'setup'),
        heading(3, 'step'),
        heading(4, 'too-deep'),
      ]),
    ).toEqual([
      { slug: 'setup', text: 'SETUP', level: 1 },
      { slug: 'step', text: 'STEP', level: 2 },
    ])
  })
})

describe('part anchor', () => {
  it('is derived from the subpost order', () => {
    expect(getPartAnchor(3)).toBe('part-3')
  })
})
