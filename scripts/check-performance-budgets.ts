import { readFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

export interface RouteAssetWeight {
  path: string
  type: 'js' | 'css' | 'font' | 'image' | 'other'
  gzip: number
  raw: number
}

export interface RouteWeight {
  htmlGzip: number
  htmlRaw: number
  assets: RouteAssetWeight[]
  totals: Record<RouteAssetWeight['type'] | 'totalGzip', number>
}

export interface RouteBudget {
  totalGzip: number
  jsGzip?: number
  cssGzip?: number
  imageGzip?: number
  fontGzip?: number
}

const classify = (path: string): RouteAssetWeight['type'] => {
  const extension = extname(path).toLowerCase()
  if (['.js', '.mjs'].includes(extension)) return 'js'
  if (extension === '.css') return 'css'
  if (['.woff', '.woff2', '.ttf', '.otf'].includes(extension)) return 'font'
  if (
    ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg'].includes(
      extension,
    )
  )
    return 'image'
  return 'other'
}

const localPath = (value: string) => {
  const cleaned = value
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .split(/[?#]/)[0]
  return cleaned.startsWith('/') && !cleaned.endsWith('/') ? cleaned : undefined
}

const htmlAssets = (html: string) => {
  const values = new Set<string>()
  const patterns = [
    /(?:src|href|component-url|renderer-url)="([^"]+)"/g,
    /srcset="([^"]+)"/g,
  ]
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      for (const candidate of match[1].split(',')) {
        const path = localPath(candidate.trim().split(/\s+/)[0])
        if (path && path !== '/favicon.svg' && !path.endsWith('/'))
          values.add(path)
      }
    }
  }
  return values
}

const importedAssets = (path: string, source: string) => {
  const values = new Set<string>()
  const directory = path.slice(0, path.lastIndexOf('/') + 1)
  const patterns = [
    /(?:import|export)\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g,
    /import\(['"]([^'"]+)['"]\)/g,
    /url\(([^)]+)\)/g,
    /@import\s+['"]([^'"]+)['"]/g,
  ]
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const value = match[1].trim().replace(/^['"]|['"]$/g, '')
      const candidate = value.startsWith('.')
        ? new URL(value, `https://archive.test${directory}`).pathname
        : value
      const normalized = localPath(candidate)
      if (normalized) values.add(normalized)
    }
  }
  return values
}

export const collectRouteWeight = async (
  distRoot: string,
  routeFile: string,
): Promise<RouteWeight> => {
  const htmlBuffer = await readFile(resolve(distRoot, routeFile))
  const html = htmlBuffer.toString('utf8')
  const pending = [...htmlAssets(html)]
  const visited = new Set<string>()
  const assets: RouteAssetWeight[] = []

  while (pending.length > 0) {
    const path = pending.shift()
    if (!path || visited.has(path)) continue
    visited.add(path)
    const file = resolve(distRoot, path.slice(1))
    /* Read first and let the failure classify the entry, instead of asking
       `stat` whether it is a directory and then opening it by name. Two
       lookups of the same path can disagree — CodeQL flags it as CWE-367 —
       and the single read is also one syscall cheaper per asset. */
    let buffer: Buffer
    try {
      buffer = await readFile(file)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EISDIR') continue
      throw error
    }
    const type = classify(path)
    assets.push({
      path,
      type,
      gzip: gzipSync(buffer).byteLength,
      raw: buffer.byteLength,
    })
    if (type === 'js' || type === 'css') {
      for (const imported of importedAssets(path, buffer.toString('utf8'))) {
        if (!visited.has(imported)) pending.push(imported)
      }
    }
  }

  const totals = {
    js: 0,
    css: 0,
    font: 0,
    image: 0,
    other: 0,
    totalGzip: gzipSync(htmlBuffer).byteLength,
  }
  for (const asset of assets) {
    totals[asset.type] += asset.gzip
    totals.totalGzip += asset.gzip
  }
  return {
    htmlGzip: gzipSync(htmlBuffer).byteLength,
    htmlRaw: htmlBuffer.byteLength,
    assets: assets.toSorted((left, right) =>
      left.path.localeCompare(right.path),
    ),
    totals,
  }
}

export const assertRouteBudget = (
  name: string,
  weight: RouteWeight,
  budget: RouteBudget,
) => {
  const failures: string[] = []
  const checks = [
    ['total gzip', weight.totals.totalGzip, budget.totalGzip],
    ['JS gzip', weight.totals.js, budget.jsGzip],
    ['CSS gzip', weight.totals.css, budget.cssGzip],
    ['image gzip', weight.totals.image, budget.imageGzip],
    ['font gzip', weight.totals.font, budget.fontGzip],
  ] as const
  for (const [label, actual, limit] of checks) {
    if (limit !== undefined && actual > limit) {
      failures.push(`${label}: ${actual} > ${limit} bytes`)
    }
  }
  if (failures.length > 0) {
    throw new Error(`${name} performance budget failed: ${failures.join(', ')}`)
  }
}

const routes: Record<string, { file: string; budget: RouteBudget }> = {
  home: {
    // The 3D glass hero (Three.js + R3F + drei) is code-split into a lazy chunk
    // that only WebGL-capable, non-reduced-motion clients fetch at runtime, so it
    // is not part of the eager bundle measured here. This budget covers the eager
    // React island baseline (React runtime + the hydration gate).
    file: 'index.html',
    budget: {
      totalGzip: 320_000,
      jsGzip: 90_000,
      cssGzip: 30_000,
      fontGzip: 330_000,
    },
  },
  index: {
    file: 'notes/index.html',
    budget: {
      totalGzip: 360_000,
      jsGzip: 20_000,
      cssGzip: 30_000,
      fontGzip: 330_000,
    },
  },
  record: {
    // The Pretext note embeds two live React demos, so this route carries a
    // React island baseline (React runtime + demo code) like home and lab.
    file: 'notes/pretext-text-layout/index.html',
    budget: {
      totalGzip: 370_000,
      jsGzip: 90_000,
      cssGzip: 30_000,
      fontGzip: 330_000,
    },
  },
  gallery: {
    file: 'gallery/signal-archive/index.html',
    budget: {
      totalGzip: 390_000,
      jsGzip: 20_000,
      cssGzip: 30_000,
      fontGzip: 330_000,
      imageGzip: 30_000,
    },
  },
  lab: {
    file: 'lab/json-formatter/index.html',
    budget: {
      totalGzip: 470_000,
      jsGzip: 110_000,
      cssGzip: 30_000,
      fontGzip: 330_000,
    },
  },
}

const run = async () => {
  for (const [name, { file, budget }] of Object.entries(routes)) {
    const weight = await collectRouteWeight(resolve('dist'), file)
    assertRouteBudget(name, weight, budget)
    console.info(
      `${name}: total=${weight.totals.totalGzip}B gzip html=${weight.htmlGzip}B js=${weight.totals.js}B css=${weight.totals.css}B fonts=${weight.totals.font}B images=${weight.totals.image}B`,
    )
  }
  console.info(
    `Performance budgets passed for ${Object.keys(routes).length} route classes.`,
  )
}

if (import.meta.main) await run()
