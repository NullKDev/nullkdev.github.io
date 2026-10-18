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
const FRONTMATTER = /^---\n([\s\S]*?)\n---/
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
      const match = FRONTMATTER.exec(await readFile(file, 'utf8'))
      if (!match) continue
      try {
        parse(match[1])
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
      const match = FRONTMATTER.exec(await readFile(file, 'utf8'))
      if (!match) continue
      const data = parse(match[1]) as { summary?: unknown } | null
      const summary = data?.summary
      if (typeof summary === 'string' && summary.length > SUMMARY_LIMIT) {
        tooLong.push(`${file}: ${summary.length}`)
      }
    }
    expect(tooLong).toEqual([])
  })
})
