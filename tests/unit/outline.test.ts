import { describe, expect, it } from 'vitest'

import {
  buildDocumentOutline,
  buildEntryOutline,
  getCompactOutline,
  getCounterpartAnchors,
  getPartAnchor,
  getTopLevelOutline,
  groupOutlineByPart,
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
          minutes: 4,
          headings: [heading(2, 'setup'), heading(3, 'step'), heading(4, 'x')],
        },
      ],
    )
    expect(outline).toEqual([
      { slug: 'intro', text: 'INTRO', level: 1, number: '01' },
      { slug: 'detail', text: 'DETAIL', level: 2, number: '1.1' },
      { slug: 'part-1', text: 'Part one', level: 1, part: true, minutes: 4 },
      { slug: 'setup', text: 'SETUP', level: 2 },
      { slug: 'step', text: 'STEP', level: 3 },
    ])
  })

  it('numbers top-level headings the way the prose counter numbers them', () => {
    /* The counter in prose.css numbers `.prose > h2` only: an entry's own
       sections. A subpost's h2s sit inside its `<section>`, so they carry no
       number in the text and must carry none in the index either. */
    const outline = buildEntryOutline(
      [heading(2, 'a'), heading(3, 'a1'), heading(2, 'b')],
      [{ slug: 'part-1', title: 'P', headings: [heading(2, 'c')] }],
    )
    expect(outline.map((item) => item.number)).toEqual([
      '01',
      '1.1',
      '02',
      undefined,
      undefined,
    ])
  })

  it('numbers a subsection after its parent section, as the prose does', () => {
    /* prose.css resets a sub-counter on every `.prose > h2` and prints
       "<section>.<n>" on the h3s that follow it, so the index must say "2.1"
       where the text says "2.1" — never a count that ignores the parent. An
       h3 before the first h2 has no parent and the prose leaves it bare. */
    const outline = buildEntryOutline(
      [
        heading(3, 'orphan'),
        heading(2, 'a'),
        heading(3, 'a1'),
        heading(2, 'b'),
        heading(3, 'b1'),
        heading(3, 'b2'),
      ],
      [{ slug: 'part-1', title: 'P', headings: [heading(3, 'c1')] }],
    )
    expect(outline.map((item) => item.number)).toEqual([
      undefined,
      '01',
      '1.1',
      '02',
      '2.1',
      '2.2',
      undefined,
      undefined,
    ])
  })

  it('drops a typed ordinal from a label it numbers, never the heading text otherwise', () => {
    const outline = buildEntryOutline(
      [
        { depth: 2, slug: 'a', text: 'Changes' },
        { depth: 3, slug: 'a1', text: '1. Resizability' },
        { depth: 3, slug: 'a2', text: '2) Native libraries' },
        { depth: 3, slug: 'a3', text: '2026 in review' },
      ],
      [],
    )
    expect(outline.map(({ number, text }) => [number, text])).toEqual([
      ['01', 'Changes'],
      ['1.1', 'Resizability'],
      ['1.2', 'Native libraries'],
      ['1.3', '2026 in review'],
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
      { slug: 'setup', text: 'SETUP', level: 1, number: '01' },
      { slug: 'step', text: 'STEP', level: 2, number: '1.1' },
    ])
  })
})

describe('outline grouping', () => {
  const outline = buildEntryOutline(
    [heading(2, 'intro'), heading(3, 'detail')],
    [
      { slug: 'part-1', title: 'One', headings: [heading(2, 'setup')] },
      { slug: 'part-2', title: 'Two', headings: [] },
    ],
  )

  it('splits the entry’s own sections from each part and its headings', () => {
    const { lead, parts } = groupOutlineByPart(outline)
    expect(lead.map(({ slug }) => slug)).toEqual(['intro', 'detail'])
    expect(
      parts.map(({ part, items }) => [
        part.slug,
        items.map(({ slug }) => slug),
      ]),
    ).toEqual([
      ['part-1', ['setup']],
      ['part-2', []],
    ])
  })

  it('has no parts for an entry without subposts', () => {
    const { lead, parts } = groupOutlineByPart(buildDocumentOutline([]))
    expect(lead).toEqual([])
    expect(parts).toEqual([])
  })

  it('keeps only the top rung for the compact phone contents', () => {
    expect(getTopLevelOutline(outline).map(({ slug }) => slug)).toEqual([
      'intro',
      'part-1',
      'part-2',
    ])
  })
})

describe('counterpart anchors', () => {
  const en = buildDocumentOutline([
    heading(2, 'setup'),
    heading(3, 'step'),
    heading(2, 'wrap-up'),
  ])
  const es = buildDocumentOutline([
    heading(2, 'preparacion'),
    heading(3, 'paso'),
    heading(2, 'cierre'),
  ])

  it('maps heading i of one language to heading i of the other', () => {
    expect(getCounterpartAnchors(en, es)).toEqual({
      setup: 'preparacion',
      step: 'paso',
      'wrap-up': 'cierre',
    })
  })

  it('degrades to no mapping when the outlines differ in length', () => {
    expect(getCounterpartAnchors(en, es.slice(0, 2))).toBeUndefined()
  })

  it('degrades to no mapping when the outlines differ in shape', () => {
    /* Same length, different nesting: heading i is no longer the same
       section, so landing there would be a confident wrong answer. */
    const reshaped = buildDocumentOutline([
      heading(2, 'preparacion'),
      heading(2, 'paso'),
      heading(2, 'cierre'),
    ])
    expect(getCounterpartAnchors(en, reshaped)).toBeUndefined()
  })

  it('has nothing to map without a translation', () => {
    expect(getCounterpartAnchors(en, undefined)).toBeUndefined()
    expect(getCounterpartAnchors([], [])).toBeUndefined()
  })
})

describe('part anchor', () => {
  it('is derived from the subpost order', () => {
    expect(getPartAnchor(3)).toBe('part-3')
  })
})

describe('compact outline (phone contents)', () => {
  const item = (slug: string, level: 1 | 2) => ({ slug, text: slug, level })

  it('lists the top rung when it has at least two sections', () => {
    const outline = [item('a', 1), item('a1', 2), item('b', 1)]
    expect(getCompactOutline(outline).map(({ slug }) => slug)).toEqual([
      'a',
      'b',
    ])
  })

  it('falls back to the one section and its subsections', () => {
    // One h2 with many h3s: the wide index shows them, so the phone must too.
    const outline = [item('only', 1), item('x', 2), item('y', 2)]
    expect(getCompactOutline(outline).map(({ slug }) => slug)).toEqual([
      'only',
      'x',
      'y',
    ])
  })

  it('offers nothing when there is a single heading to jump to', () => {
    expect(getCompactOutline([item('only', 1)])).toEqual([])
    expect(getCompactOutline([])).toEqual([])
  })
})
