import { describe, expect, it } from 'vitest'

// Build-time plugin, authored as plain ESM like the other scripts/ modules the
// Astro config imports directly.
import hastFigures from '../../scripts/hast-figures.mjs'

interface Node {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: Node[]
}

const text = (value: string): Node => ({ type: 'text', value })

const image = (properties: Record<string, unknown>): Node => ({
  type: 'element',
  tagName: 'img',
  properties,
  children: [],
})

const paragraph = (...children: Node[]): Node => ({
  type: 'element',
  tagName: 'p',
  properties: {},
  children,
})

const run = (...children: Node[]): Node => {
  const tree: Node = { type: 'root', children }
  hastFigures()(tree)
  return tree
}

const textOf = (node: Node | undefined): string =>
  node?.type === 'text'
    ? (node.value ?? '')
    : (node?.children ?? []).map(textOf).join('')

describe('hastFigures', () => {
  it('turns a standalone image with a title into a captioned figure', () => {
    const tree = run(
      paragraph(
        image({
          src: './assets/logo.svg',
          alt: 'Android 6.0 Marshmallow logo',
          title: 'Wikimedia Commons · Public domain',
        }),
      ),
    )
    const figure = tree.children?.[0]

    expect(figure?.tagName).toBe('figure')
    expect(figure?.properties?.['data-figure']).toBe('')
    expect(figure?.children?.map((child) => child.tagName)).toEqual([
      'img',
      'figcaption',
    ])
    expect(textOf(figure?.children?.[1])).toBe(
      'Wikimedia Commons · Public domain',
    )
  })

  it('keeps the alt text and source, and moves the title off the image', () => {
    const tree = run(
      paragraph(
        image({ src: './a.png', alt: 'Permission dialog', title: 'Credit' }),
      ),
    )
    const img = tree.children?.[0]?.children?.[0]

    expect(img?.properties?.src).toBe('./a.png')
    expect(img?.properties?.alt).toBe('Permission dialog')
    // The caption already shows it; a tooltip would repeat it.
    expect(img?.properties?.title).toBeUndefined()
  })

  it('ignores whitespace around the image inside the paragraph', () => {
    const tree = run(
      paragraph(text('\n'), image({ src: './a.png', alt: 'A', title: 'T' })),
    )

    expect(tree.children?.[0]?.tagName).toBe('figure')
  })

  it('leaves an image without a title untouched', () => {
    const tree = run(paragraph(image({ src: './a.png', alt: 'A' })))

    expect(tree.children?.[0]?.tagName).toBe('p')
  })

  it('leaves an image that shares its paragraph with text untouched', () => {
    const tree = run(
      paragraph(text('See '), image({ src: './a.png', alt: 'A', title: 'T' })),
    )

    expect(tree.children?.[0]?.tagName).toBe('p')
  })

  it('is idempotent across repeated passes', () => {
    const tree = run(paragraph(image({ src: './a.png', alt: 'A', title: 'T' })))
    hastFigures()(tree)

    expect(tree.children?.[0]?.tagName).toBe('figure')
    expect(tree.children?.[0]?.children?.[0]?.tagName).toBe('img')
  })
})
