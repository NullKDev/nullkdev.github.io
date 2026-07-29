import { readFile } from 'node:fs/promises'

import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

describe('shadcn theme compatibility', () => {
  it('defines both theme values and mappings for common overlay and danger tokens', async () => {
    const css = await readFile('src/styles/global.css', 'utf8')
    for (const token of [
      'popover',
      'popover-foreground',
      'destructive',
      'destructive-foreground',
    ]) {
      expect(css).toContain(`--color-${token}: var(--${token})`)
      expect(css.match(new RegExp(`--${token}:`, 'g'))).toHaveLength(2)
    }
    expect(css).toMatch(
      /@source inline\(\s*['"]bg-popover text-popover-foreground bg-destructive text-destructive-foreground['"]\s*\)/,
    )
  })

  it('generates Tailwind utilities from the token namespace', async () => {
    const compiler = await compile(`
      @theme {
        --color-popover: var(--popover);
        --color-popover-foreground: var(--popover-foreground);
        --color-destructive: var(--destructive);
        --color-destructive-foreground: var(--destructive-foreground);
      }
      @tailwind utilities;
    `)
    const output = compiler.build([
      'bg-popover',
      'text-popover-foreground',
      'bg-destructive',
      'text-destructive-foreground',
    ])

    expect(output).toContain('.bg-popover')
    expect(output).toContain('.text-popover-foreground')
    expect(output).toContain('.bg-destructive')
    expect(output).toContain('.text-destructive-foreground')
  })
})
