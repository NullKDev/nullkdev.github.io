/**
 * Mermaid fences, compiled to static SVG at build time.
 *
 * Diagrams used to render in the reader's browser, which meant the reader's
 * browser measured the text: the same diagram laid out at 351px in one Chrome
 * and past 1,600px in another, and nothing in the page could predict which. A
 * diagram drawn here has one size, known before the page ships.
 *
 * `beautiful-mermaid` lays out in plain TypeScript, with no DOM and no browser,
 * so the output is identical on every build. Three things are stripped from
 * what it emits, each for a reason the browser would not report:
 *
 * - The `<style>` block. An inline SVG's stylesheet applies to the whole
 *   document, so its bare `svg {}` and `text {}` rules would restyle every
 *   icon on the page. The variables it declares are set in `archive.css`
 *   instead, scoped to `.diagram__pane > svg` and fed from the site's tokens.
 * - Its `@import` of Google Fonts, inside that block. CSP blocks it, and the
 *   page already loads Switzer.
 * - The inline `style` on the root, which pins `--bg`/`--fg` per diagram.
 *
 * Sizing is decided here, where the drawn size is known. A diagram may grow to
 * MAX_SCALE or until it reaches MAX_HEIGHT, whichever comes first, and never
 * shrinks below the size it was drawn at: shrinking is what once took labels
 * to 6px on a phone. A diagram wider than the column scrolls in its pane.
 *
 * Every diagram needs `title="…"` on its fence. It becomes the accessible
 * name, because a screen reader announces an SVG's loose `<text>` nodes as a
 * list of fragments, and a figure with no name is an axe failure.
 */

import { renderMermaidSVG } from 'beautiful-mermaid'
import { fromHtml } from 'hast-util-from-html'

/** Upper bound on growth, so a small diagram does not turn into display type. */
const MAX_SCALE = 1.25
/** Tallest a diagram may grow to, in CSS pixels, before growth stops. */
const MAX_HEIGHT = 560

/** Tight enough that a three-way fan-out fits a 390px phone at 100%. */
const LAYOUT = {
  padding: 12,
  layerSpacing: 32,
  nodeSpacing: 16,
  transparent: true,
}

const TITLE = /\btitle="([^"]+)"/

const textOf = (node) => {
  if (node.type === 'text') return node.value
  if (!Array.isArray(node.children)) return ''
  return node.children.map(textOf).join('')
}

const mermaidCode = (node) => {
  if (node.type !== 'element' || node.tagName !== 'pre') return undefined
  const code = node.children.find(
    (child) => child.type === 'element' && child.tagName === 'code',
  )
  const classes = code?.properties?.className ?? []
  return classes.includes('language-mermaid') ? code : undefined
}

/**
 * Render one mermaid source to the figure that replaces its fence. Exported so
 * the sizing and stripping can be tested without a markdown pipeline.
 */
export const renderDiagram = (source, title) => {
  const svg = renderMermaidSVG(source, LAYOUT)
    .replace(/<style>[\s\S]*?<\/style>/, '')
    .replace(/^<svg([^>]*?)\sstyle="[^"]*"/, '<svg$1')

  const [, , width, height] = svg
    .match(/viewBox="([^"]+)"/)[1]
    .split(/\s+/)
    .map(Number)
  const scale = Math.min(MAX_SCALE, Math.max(1, MAX_HEIGHT / height))
  // The viewBox is fractional. Round each bound away from the limit it
  // guards: up for the drawn size, down for the grown one.
  const min = Math.ceil(width)
  const target = Math.max(min, Math.floor(width * scale))

  const root = fromHtml(svg, { fragment: true, space: 'svg' }).children.find(
    (child) => child.type === 'element' && child.tagName === 'svg',
  )
  // The pane decides the rendered size; fixed attributes would fight it.
  delete root.properties.width
  delete root.properties.height
  root.properties.role = 'img'
  root.properties.ariaLabel = title

  return {
    type: 'element',
    tagName: 'figure',
    properties: {
      className: ['diagram'],
      style: `--diagram-width: ${target}px; --diagram-min: ${min}px`,
    },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['diagram__pane'], tabIndex: 0 },
        children: [root],
      },
    ],
  }
}

export default function hastDiagrams() {
  return (tree, file) => {
    const visit = (node) => {
      if (!Array.isArray(node.children)) return
      node.children.forEach((child, index) => {
        const code = mermaidCode(child)
        if (!code) {
          visit(child)
          return
        }
        // Markdown keeps the fence meta in `data`; Astro's MDX moves it to a
        // property. Read both, as Astro's own highlighter does.
        const meta = code.data?.meta ?? code.properties?.metastring ?? ''
        const title = meta.match(TITLE)?.[1]
        if (!title) {
          throw new Error(
            `${file?.path ?? 'markdown'}: a mermaid fence needs title="…" — it is the diagram's accessible name.`,
          )
        }
        node.children[index] = renderDiagram(textOf(code), title)
      })
    }
    visit(tree)
  }
}
