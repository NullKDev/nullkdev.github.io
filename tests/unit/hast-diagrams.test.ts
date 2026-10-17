import { toHtml } from 'hast-util-to-html'
import { describe, expect, it } from 'vitest'

// Build-time plugin, authored as plain ESM like the other scripts/ modules the
// Astro config imports directly.
import hastDiagrams, { renderDiagram } from '../../scripts/hast-diagrams.mjs'

interface Node {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  data?: { meta?: string }
  children?: Node[]
}

const fence = (source: string, lang: string, meta?: string): Node => ({
  type: 'element',
  tagName: 'pre',
  properties: {},
  children: [
    {
      type: 'element',
      tagName: 'code',
      properties: { className: [`language-${lang}`] },
      data: meta === undefined ? undefined : { meta },
      children: [{ type: 'text', value: source }],
    },
  ],
})

const root = (...children: Node[]): Node => ({ type: 'root', children })

const run = (tree: Node, path = 'note.mdx') => {
  hastDiagrams()(tree, { path })
  return tree
}

const FLOW = 'flowchart LR\n  a[Scan] --> b[Report]'
// Tall enough that growing it would push past the height cap.
const TALL = `flowchart TB\n${Array.from({ length: 12 }, (_, i) => `  n${i}[Step ${i}] --> n${i + 1}[Step ${i + 1}]`).join('\n')}`

const sizeOf = (figure: Node) => {
  const style = String(figure.properties?.style)
  const px = (name: string) =>
    Number(style.match(new RegExp(`${name}: (\\d+)px`))?.[1])
  const svg = figure.children![0].children![0]
  const drawn = Number(String(svg.properties?.viewBox).split(/\s+/)[2])
  return { width: px('--diagram-width'), min: px('--diagram-min'), drawn }
}

describe('hastDiagrams', () => {
  it('replaces a mermaid fence with a named, static SVG figure', () => {
    const tree = run(root(fence(FLOW, 'mermaid', 'title="Scan flow"')))
    const figure = tree.children![0]

    expect(figure.tagName).toBe('figure')
    expect(figure.properties?.className).toEqual(['diagram'])
    const pane = figure.children![0]
    expect(pane.properties?.className).toEqual(['diagram__pane'])
    expect(pane.properties?.tabIndex).toBe(0)
    const svg = pane.children![0]
    expect(svg.tagName).toBe('svg')
    expect(svg.properties?.role).toBe('img')
    expect(svg.properties?.ariaLabel).toBe('Scan flow')
  })

  it('reads the title from MDX, which moves the fence meta to metastring', () => {
    const mdxFence = fence(FLOW, 'mermaid')
    mdxFence.children![0].properties!.metastring = 'title="Scan flow"'
    const svg = run(root(mdxFence)).children![0].children![0].children![0]

    expect(svg.properties?.ariaLabel).toBe('Scan flow')
  })

  it('ships no stylesheet, third-party import or pinned size inside the SVG', () => {
    const html = toHtml(renderDiagram(FLOW, 'Scan flow') as never)

    expect(html).not.toContain('<style')
    expect(html).not.toContain('fonts.googleapis.com')
    expect(html).not.toMatch(/<svg[^>]*\sstyle=/)
    expect(html).not.toMatch(/<svg[^>]*\swidth=/)
    expect(html).toContain('Scan')
    expect(html).toContain('Report')
  })

  it('grows a small diagram by at most 1.25 and never below its drawn size', () => {
    const { width, min, drawn } = sizeOf(
      renderDiagram(FLOW, 'Scan flow') as Node,
    )

    // Rounded away from each limit: never under 1×, never over 1.25×.
    expect(min).toBe(Math.ceil(drawn))
    expect(width).toBe(Math.floor(drawn * 1.25))
  })

  it('stops growing a tall diagram at its drawn size', () => {
    const { width, min, drawn } = sizeOf(renderDiagram(TALL, 'Steps') as Node)

    expect(min).toBe(Math.ceil(drawn))
    expect(width).toBe(min)
  })

  it('gives every diagram its own ids, so two on one page never collide', () => {
    // Node ids come from the mermaid source (`code`, `open`…) and the arrow
    // markers are fixed (`arrowhead`), so without a suffix two diagrams — or
    // a diagram and a heading anchor — share an id and `url(#…)` resolves to
    // whichever came first.
    const idsOf = (html: string) =>
      [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    const first = toHtml(renderDiagram(FLOW, 'Scan flow') as never)
    const second = toHtml(
      renderDiagram(
        'flowchart LR\n  a[Scan] --> c[Ship]',
        'Ship flow',
      ) as never,
    )

    expect(idsOf(first).filter((id) => idsOf(second).includes(id))).toEqual([])
    expect(idsOf(first)).not.toContain('arrowhead')
    expect(idsOf(first)).not.toContain('a')
    for (const html of [first, second]) {
      const references = [
        ...html.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g),
      ].map((match) => match[1] ?? match[2])
      expect(references.length).toBeGreaterThan(0)
      for (const reference of references) {
        expect(idsOf(html)).toContain(reference)
      }
    }
  })

  it('renders the same bytes on every build', () => {
    expect(toHtml(renderDiagram(FLOW, 'Scan flow') as never)).toBe(
      toHtml(renderDiagram(FLOW, 'Scan flow') as never),
    )
  })

  it('leaves every other code block untouched', () => {
    const other = fence('const a = 1', 'ts')
    const tree = run(root(other))

    expect(tree.children![0]).toBe(other)
  })

  it('fails the build when a diagram has no accessible name', () => {
    expect(() => run(root(fence(FLOW, 'mermaid')))).toThrow(
      'note.mdx: a mermaid fence needs title="…" — it is the diagram\'s accessible name.',
    )
  })
})
