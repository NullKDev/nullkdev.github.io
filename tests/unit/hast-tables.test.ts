import { describe, expect, it } from 'vitest'

// Build-time plugin, authored as plain ESM like the other scripts/ modules the
// Astro config imports directly.
import hastTables from '../../scripts/hast-tables.mjs'

interface Node {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: Node[]
}

const text = (value: string): Node => ({ type: 'text', value })

const cell = (tagName: 'th' | 'td', value: string): Node => ({
  type: 'element',
  tagName,
  properties: {},
  children: [text(value)],
})

const row = (tagName: 'th' | 'td', values: readonly string[]): Node => ({
  type: 'element',
  tagName: 'tr',
  properties: {},
  children: values.map((value) => cell(tagName, value)),
})

const table = (
  head: readonly string[],
  body: readonly (readonly string[])[],
): Node => ({
  type: 'element',
  tagName: 'table',
  properties: {},
  children: [
    {
      type: 'element',
      tagName: 'thead',
      properties: {},
      children: [row('th', head)],
    },
    {
      type: 'element',
      tagName: 'tbody',
      properties: {},
      children: body.map((values) => row('td', values)),
    },
  ],
})

const run = (node: Node): Node => {
  const tree: Node = { type: 'root', children: [node] }
  hastTables()(tree)
  return tree
}

/** Every cell in document order, as `<tag>:<text>:<numeric?>`. */
const cells = (node: Node): string[] => {
  const found: string[] = []
  const walk = (current: Node) => {
    if (current.tagName === 'th' || current.tagName === 'td') {
      const value = (current.children ?? []).map((c) => c.value ?? '').join('')
      const numeric = current.properties?.['data-numeric'] !== undefined
      found.push(`${current.tagName}:${value}:${numeric}`)
    }
    for (const child of current.children ?? []) walk(child)
  }
  walk(node)
  return found
}

describe('hastTables', () => {
  it('wraps a table in a focusable scroll container', () => {
    const tree = run(table(['Scanner'], [['Semgrep']]))
    const wrapper = tree.children?.[0]

    expect(wrapper?.tagName).toBe('div')
    expect(wrapper?.properties?.['data-table']).toBe('')
    // Keyboard users must be able to scroll a wide table.
    expect(wrapper?.properties?.tabindex).toBe('0')
    expect(wrapper?.children?.[0]?.tagName).toBe('table')
  })

  it('never adds an unnamed region landmark, which axe fails', () => {
    const tree = run(table(['Scanner'], [['Semgrep']]))

    expect(tree.children?.[0]?.properties?.role).toBeUndefined()
  })

  it('marks a numeric column including its header', () => {
    const tree = run(
      table(
        ['Scanner', 'Precision'],
        [
          ['Semgrep', '0.205'],
          ['Snyk', '0.282'],
        ],
      ),
    )

    expect(cells(tree)).toEqual([
      'th:Scanner:false',
      'th:Precision:true',
      'td:Semgrep:false',
      'td:0.205:true',
      'td:Snyk:false',
      'td:0.282:true',
    ])
  })

  it('leaves a label column alone when it merely contains digits', () => {
    const tree = run(
      table(
        ['Scanner'],
        [['Claude Sonnet 4.6'], ['Gemini 3.1 Pro'], ['GPT-5 Mini']],
      ),
    )

    expect(cells(tree).every((entry) => entry.endsWith(':false'))).toBe(true)
  })

  it('keeps a mostly-numeric column aligned despite one gap', () => {
    const tree = run(
      table(
        ['Model', 'Precision'],
        [
          ['A', '0.904'],
          ['B', '0.785'],
          ['C', '0.611'],
          ['D', 'not reported'],
        ],
      ),
    )

    // One prose cell must not drag a column of measurements back to the left.
    expect(cells(tree)).toContain('th:Precision:true')
    expect(cells(tree)).toContain('td:0.904:true')
  })

  it('recognises percentages, ranges and bare integers', () => {
    const tree = run(
      table(
        ['Metric', 'Value'],
        [
          ['False positives', '10–50%'],
          ['Recall', '92%'],
          ['Exit code', '130'],
        ],
      ),
    )

    expect(cells(tree)).toContain('td:10–50%:true')
    expect(cells(tree)).toContain('td:92%:true')
    expect(cells(tree)).toContain('td:130:true')
  })

  it('is idempotent, so a second pass cannot double-wrap', () => {
    const tree: Node = {
      type: 'root',
      children: [table(['Scanner'], [['Semgrep']])],
    }
    hastTables()(tree)
    hastTables()(tree)

    const wrapper = tree.children?.[0]
    expect(wrapper?.properties?.['data-table']).toBe('')
    expect(wrapper?.children?.[0]?.tagName).toBe('table')
    expect(wrapper?.children?.[0]?.children?.length).toBe(2)
  })

  describe('stacking wide prose tables into cards', () => {
    const permissions = () =>
      run(
        table(
          ['Permission', 'What changed', 'What to declare', 'Remove or limit'],
          [
            [
              'POST_NOTIFICATIONS',
              'New runtime permission',
              'Declare it',
              'Nothing',
            ],
            [
              'READ_EXTERNAL_STORAGE',
              'No effect at 33',
              'Keep for 32',
              'maxSdkVersion 32',
            ],
          ],
        ),
      )

    it('marks a prose table of three or more columns to stack', () => {
      const wrapper = permissions().children?.[0]
      expect(wrapper?.properties?.['data-table-stack']).toBe('')
    })

    it('labels every body cell with its column header', () => {
      const labels: string[] = []
      const walk = (node: Node) => {
        if (node.tagName === 'td')
          labels.push(String(node.properties?.['data-label']))
        for (const child of node.children ?? []) walk(child)
      }
      walk(permissions())
      expect(labels).toEqual([
        'Permission',
        'What changed',
        'What to declare',
        'Remove or limit',
        'Permission',
        'What changed',
        'What to declare',
        'Remove or limit',
      ])
    })

    it('keeps mixed code and text in one block per field', () => {
      const tree = run(
        table(
          ['Permission', 'Change', 'Declare'],
          [['A', 'New', 'code and text']],
        ),
      )
      const fields: Node[] = []
      const walk = (node: Node) => {
        if (node.tagName === 'td') fields.push(node)
        for (const child of node.children ?? []) walk(child)
      }
      walk(tree)
      for (const field of fields) {
        expect(field.children).toHaveLength(1)
        expect(field.children?.[0]?.tagName).toBe('span')
      }
    })

    it('marks an empty field so the card can leave it out', () => {
      const tree = run(
        table(['Change', 'What to do', 'How to check'], [['A', 'Do it', '']]),
      )
      const empty: string[] = []
      const walk = (node: Node) => {
        if (
          node.tagName === 'td' &&
          node.properties?.['data-empty'] !== undefined
        ) {
          empty.push(String(node.properties?.['data-label']))
        }
        for (const child of node.children ?? []) walk(child)
      }
      walk(tree)
      expect(empty).toEqual(['How to check'])
    })

    it('keeps two-column and numeric tables as tables', () => {
      const pair = run(table(['Field', 'Value'], [['API', 'Tiramisu']]))
      expect(
        pair.children?.[0]?.properties?.['data-table-stack'],
      ).toBeUndefined()
      const numbers = run(
        table(
          ['Model', 'Score', 'Cost'],
          [
            ['A', '92%', '10'],
            ['B', '85%', '12'],
          ],
        ),
      )
      expect(
        numbers.children?.[0]?.properties?.['data-table-stack'],
      ).toBeUndefined()
    })
  })
})
