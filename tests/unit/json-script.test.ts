import { describe, expect, it } from 'vitest'

import { serializeJsonForScript } from '@/lib/json-script'

describe('serializeJsonForScript', () => {
  it('cannot close the <script> element it is written into', () => {
    const value = { title: '</script><script>alert(1)</script>' }
    const output = serializeJsonForScript(value)

    expect(output.toLowerCase()).not.toContain('</script')
    expect(output).not.toContain('<')
    expect(JSON.parse(output)).toEqual(value)
  })

  it('cannot open an HTML comment that changes script parsing', () => {
    const output = serializeJsonForScript({ note: '<!-- <script>' })

    expect(output).not.toContain('<!--')
    expect(JSON.parse(output)).toEqual({ note: '<!-- <script>' })
  })

  it('escapes the line and paragraph separators', () => {
    const value = { text: 'a\u2028b\u2029c' }
    const output = serializeJsonForScript(value)

    expect(output).not.toMatch(/[\u2028\u2029]/)
    expect(output).toContain('\\u2028')
    expect(output).toContain('\\u2029')
    expect(JSON.parse(output)).toEqual(value)
  })

  it('leaves ordinary JSON byte-identical to JSON.stringify', () => {
    const value = { a: 1, b: ['x', true, null], c: 'é > &' }

    expect(serializeJsonForScript(value)).toBe(JSON.stringify(value))
  })
})
