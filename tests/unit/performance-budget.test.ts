import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  assertRouteBudget,
  collectRouteWeight,
} from '../../scripts/check-performance-budgets'

describe('route performance budgets', () => {
  it('discovers Astro island modules, renderers, recursive chunks, CSS, fonts, and images', async () => {
    const root = await mkdtemp(join(tmpdir(), 'archive-budget-'))
    await mkdir(join(root, '_astro'), { recursive: true })
    await writeFile(
      join(root, 'index.html'),
      '<link rel="stylesheet" href="/_astro/site.css"><link rel="preload" as="font" href="/font.woff2"><img src="/image.png"><astro-island component-url="/_astro/island.js" renderer-url="/_astro/renderer.js"></astro-island>',
    )
    await writeFile(join(root, '_astro/site.css'), 'body{color:#123}')
    await writeFile(
      join(root, '_astro/island.js'),
      "import './chunk.js';export{}",
    )
    await writeFile(join(root, '_astro/chunk.js'), 'export const value = 1')
    await writeFile(join(root, '_astro/renderer.js'), 'export const render = 1')
    await writeFile(join(root, 'font.woff2'), 'font')
    await writeFile(join(root, 'image.png'), 'image')

    const result = await collectRouteWeight(root, 'index.html')

    expect(result.assets.map(({ path }) => path)).toEqual(
      expect.arrayContaining([
        '/_astro/site.css',
        '/_astro/island.js',
        '/_astro/chunk.js',
        '/_astro/renderer.js',
        '/font.woff2',
        '/image.png',
      ]),
    )
  })

  it('fails a deliberately oversized Astro island', async () => {
    const root = await mkdtemp(join(tmpdir(), 'archive-budget-'))
    await mkdir(join(root, '_astro'), { recursive: true })
    await writeFile(
      join(root, 'index.html'),
      '<astro-island component-url="/_astro/island.js"></astro-island>',
    )
    await writeFile(join(root, '_astro/island.js'), 'x'.repeat(50_000))

    const result = await collectRouteWeight(root, 'index.html')

    expect(() =>
      assertRouteBudget('oversized', result, { totalGzip: 100 }),
    ).toThrow('oversized')
  })
})
