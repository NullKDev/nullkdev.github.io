import { glob, readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

/**
 * Every content file's frontmatter parses as YAML.
 *
 * Only `astro build` used to notice a malformed record: a citation title
 * written as `"quoted" (Android Central)` passed lint, Prettier and every
 * other content test, then failed the build with "Unexpected scalar".
 */
const FRONTMATTER = /^---\n([\s\S]*?)\n---(?:\n|$)/

/** The YAML between the fences, or an error string for a block that opens and
    never closes. BOM and CRLF are normalised first, so neither can make a
    malformed file slip past unread. Undefined when there is no frontmatter. */
const readFrontmatter = (
  text: string,
): { yaml: string } | { error: string } | undefined => {
  const normalised = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  if (!normalised.startsWith('---\n')) return undefined
  const match = FRONTMATTER.exec(normalised)
  return match ? { yaml: match[1] } : { error: 'frontmatter is never closed' }
}
const SUMMARY_LIMIT = 180

const contentFiles = async (): Promise<string[]> => {
  const files: string[] = []
  for await (const file of glob('src/content/**/*.{md,mdx}')) files.push(file)
  return files.sort()
}

describe('content frontmatter', () => {
  it('finds content files to check', async () => {
    expect((await contentFiles()).length).toBeGreaterThan(0)
  })

  it('parses as YAML in every file', async () => {
    const failures: string[] = []
    for (const file of await contentFiles()) {
      const block = readFrontmatter(await readFile(file, 'utf8'))
      if (!block) continue
      if ('error' in block) {
        failures.push(`${file}: ${block.error}`)
        continue
      }
      try {
        parse(block.yaml)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        failures.push(`${file}: ${message.split('\n')[0]}`)
      }
    }
    expect(failures).toEqual([])
  })

  // The schema caps every summary at 180 characters, but only `astro build`
  // enforced it; writers who cannot build kept finding 181-character Spanish
  // summaries one step too late.
  it('keeps every summary within the 180-character cap', async () => {
    const tooLong: string[] = []
    for (const file of await contentFiles()) {
      const block = readFrontmatter(await readFile(file, 'utf8'))
      if (!block || 'error' in block) continue
      const data = parse(block.yaml) as { summary?: unknown } | null
      const summary = data?.summary
      if (typeof summary === 'string' && summary.length > SUMMARY_LIMIT) {
        tooLong.push(`${file}: ${summary.length}`)
      }
    }
    expect(tooLong).toEqual([])
  })

  it('reads frontmatter written with a BOM or CRLF and flags an open block', () => {
    expect(readFrontmatter('\uFEFF---\ntitle: a\n---\nbody')).toEqual({
      yaml: 'title: a',
    })
    expect(readFrontmatter('---\r\ntitle: a\r\n---\r\nbody')).toEqual({
      yaml: 'title: a',
    })
    expect(readFrontmatter('---\ntitle: a\nbody')).toEqual({
      error: 'frontmatter is never closed',
    })
    expect(readFrontmatter('# no frontmatter')).toBeUndefined()
  })
})
