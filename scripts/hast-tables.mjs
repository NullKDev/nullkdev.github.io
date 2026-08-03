/**
 * Markdown tables, made presentable without authoring burden.
 *
 * Two jobs, neither of which a markdown author can do by hand because table
 * syntax carries no attributes:
 *
 * 1. **Wrap each table in its own scroll container.** A wide table inside prose
 *    otherwise widens the page and the whole document scrolls sideways. The
 *    wrapper is what scrolls, so the article never does.
 * 2. **Mark numeric columns.** Measurements belong in mono with tabular figures
 *    and aligned right, so a column of numbers can be compared by scanning down
 *    it. Every table gets it, including ones written before this existed.
 *
 * Alignment is decided per **column**, not per cell. Marking cells
 * individually leaves the header of a numeric column left-aligned while its
 * numbers sit right — the header stops labelling the thing underneath it. It
 * also means one `n/a` in a column of measurements does not break the column.
 *
 * A column qualifies when most of its filled body cells read as a pure
 * quantity, so a version string or prose containing a number cannot drag a
 * column of labels to the right.
 */

/** A whole cell that is a quantity: `0.785`, `92%`, `10–50%`, `1.44`, `130`. */
const QUANTITY =
  /^[<>~±]?\d[\d\s.,]*\s*(?:[%×]|[a-z]{1,3})?(?:\s*[–—-]\s*[<>~±]?\d[\d\s.,]*\s*(?:[%×]|[a-z]{1,3})?)?$/i

/** Share of a column's filled cells that must be quantities to align it. */
const NUMERIC_SHARE = 0.6

const textOf = (node) => {
  if (node.type === 'text') return node.value
  if (!Array.isArray(node.children)) return ''
  return node.children.map(textOf).join('')
}

const isElement = (node, ...names) =>
  node?.type === 'element' && names.includes(node.tagName)

/** Every `tr` under `table`, whether or not the section wrapper is present. */
const rowsOf = (table, section) => {
  const rows = []
  const walk = (node, inside) => {
    if (!Array.isArray(node.children)) return
    for (const child of node.children) {
      if (isElement(child, 'thead', 'tbody', 'tfoot')) {
        walk(child, child.tagName)
      } else if (isElement(child, 'tr')) {
        // A bare `tr` directly under `table` belongs to the body.
        if ((inside ?? 'tbody') === section) rows.push(child)
      }
    }
  }
  walk(table, null)
  return rows
}

const cellsOf = (row) =>
  (row.children ?? []).filter((child) => isElement(child, 'th', 'td'))

const mark = (cell) => {
  cell.properties = { ...cell.properties, 'data-numeric': '' }
}

const alignNumericColumns = (table) => {
  const head = rowsOf(table, 'thead')
  const body = rowsOf(table, 'tbody')
  if (body.length === 0) return

  const width = Math.max(...body.map((row) => cellsOf(row).length))

  for (let column = 0; column < width; column += 1) {
    let filled = 0
    let numeric = 0

    for (const row of body) {
      const text = textOf(
        cellsOf(row)[column] ?? { type: 'text', value: '' },
      ).trim()
      if (!text) continue
      filled += 1
      if (QUANTITY.test(text)) numeric += 1
    }

    if (filled === 0 || numeric / filled < NUMERIC_SHARE) continue

    for (const row of [...head, ...body]) {
      const cell = cellsOf(row)[column]
      if (cell) mark(cell)
    }
  }
}

const visit = (node, parent, index, fn) => {
  fn(node, parent, index)
  if (!Array.isArray(node.children)) return
  // Reverse so replacing a child does not shift the nodes still to visit.
  for (let i = node.children.length - 1; i >= 0; i -= 1) {
    visit(node.children[i], node, i, fn)
  }
}

export default function hastTables() {
  return (tree) => {
    visit(tree, null, null, (node, parent, index) => {
      if (!isElement(node, 'table') || !parent) return
      // Already wrapped on a previous pass. Tested for presence, not truth:
      // the marker's value is the empty string, so a truthiness check silently
      // never fires and every extra pass nests another scroll container.
      if (
        parent.type === 'element' &&
        parent.properties !== undefined &&
        'data-table' in parent.properties
      ) {
        return
      }

      alignNumericColumns(node)

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: {
          'data-table': '',
          // Focusable so a keyboard user can scroll a wide table. Deliberately
          // no `role="region"`: a landmark needs an accessible name, the name
          // would have to be localised, and a markdown table carries no caption
          // to derive one from. An unnamed region is an axe failure; a
          // focusable scroll container is the accessible pattern.
          tabindex: '0',
        },
        children: [node],
      }
    })
  }
}
