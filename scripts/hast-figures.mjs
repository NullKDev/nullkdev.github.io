/**
 * Captioned markdown images, built at build time.
 *
 * Markdown has no caption syntax, but it has an image title:
 * `![alt](./assets/logo.svg "Source · Licence")`. A standalone image with a
 * title becomes `<figure data-figure>` with the title as its `<figcaption>`.
 *
 * Why the title and not the alt text: alt text describes the image for a
 * reader who cannot see it; a caption credits it for everyone. Folding a
 * licence into alt text makes a screen reader announce the credit as if it
 * were the picture. The client-side fallback in `entry-enhancements.ts`
 * captions untitled images with their alt, and skips images already inside a
 * `<figure>`, so the two never double up.
 *
 * The title is moved off the `<img>`, because the caption already shows it
 * and a tooltip would repeat it. The `<img>` node itself is kept intact:
 * Astro's own image step runs after user rehype plugins and still finds it.
 *
 * An image that shares its paragraph with text, or has no title, is left
 * alone.
 */

const isElement = (node, name) =>
  node?.type === 'element' && node.tagName === name

const isBlank = (node) => node.type === 'text' && !node.value.trim()

/** The `<img>` a paragraph holds on its own, ignoring whitespace. */
const loneImage = (paragraph) => {
  const content = (paragraph.children ?? []).filter((node) => !isBlank(node))
  return content.length === 1 && isElement(content[0], 'img')
    ? content[0]
    : undefined
}

const titleOf = (img) => {
  const title = img.properties?.title
  return typeof title === 'string' ? title.trim() : ''
}

const toFigure = (img) => {
  const properties = { ...img.properties }
  delete properties.title
  return {
    type: 'element',
    tagName: 'figure',
    properties: { 'data-figure': '' },
    children: [
      { ...img, properties },
      {
        type: 'element',
        tagName: 'figcaption',
        properties: {},
        children: [{ type: 'text', value: titleOf(img) }],
      },
    ],
  }
}

const visit = (node) => {
  if (!Array.isArray(node.children)) return
  node.children = node.children.map((child) => {
    if (!isElement(child, 'p')) return child
    const img = loneImage(child)
    return img && titleOf(img) ? toFigure(img) : child
  })
  node.children.forEach(visit)
}

export default function hastFigures() {
  return (tree) => {
    visit(tree)
  }
}
