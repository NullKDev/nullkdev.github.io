import { glob, readFile } from 'node:fs/promises'
import GithubSlugger from 'github-slugger'
import { marked, type Tokens } from 'marked'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

import { MANIFEST_RULES } from '@/lib/manifest-rules'
import {
  buildPlannerModel,
  isPlannerVersionNote,
  toPlainText,
  type PlannerHeading,
  type PlannerSource,
  type PlannerVersion,
} from '@/lib/migration-planner'

/**
 * The planner reads the real version notes. These checks run against the files
 * themselves, with the slugger Astro's markdown pipeline uses
 * (`rehypeHeadingIds` in @astrojs/markdown-remark is github-slugger over the
 * heading text), so an anchor the planner links to is a heading id the note
 * page really carries.
 */
const renderedHeadings = (body: string): PlannerHeading[] => {
  const slugger = new GithubSlugger()
  return marked
    .lexer(body)
    .filter((token): token is Tokens.Heading => token.type === 'heading')
    .map((token) => {
      const text = toPlainText(token.text)
      return { depth: token.depth, slug: slugger.slug(text), text }
    })
}

interface Frontmatter {
  readonly slug: string
  readonly locale: 'en' | 'es'
  readonly title: string
  readonly translationKey: string
  readonly series?: { id: string }
}

const sources = async (): Promise<PlannerSource[]> => {
  const found: PlannerSource[] = []
  for await (const file of glob('src/content/notes/*/index*.md')) {
    const text = (await readFile(file, 'utf8')).replace(/\r\n?/g, '\n')
    const match = /^---\n([\s\S]*?)\n---\n/.exec(text)
    if (!match) continue
    const data = parse(match[1]) as Frontmatter
    if (!isPlannerVersionNote(data)) continue
    const body = text.slice(match[0].length)
    found.push({
      slug: data.slug,
      locale: data.locale,
      title: data.title,
      href: `${data.locale === 'es' ? '/es' : ''}/notes/${data.slug}/`,
      tokens: marked.lexer(body),
      headings: renderedHeadings(body),
    })
  }
  return found
}

const models = async (): Promise<Record<'en' | 'es', PlannerVersion[]>> => {
  const all = await sources()
  return {
    en: buildPlannerModel(all.filter(({ locale }) => locale === 'en')),
    es: buildPlannerModel(all.filter(({ locale }) => locale === 'es')),
  }
}

describe('migration planner model from the version notes', async () => {
  const { en, es } = await models()
  const all = [...en, ...es]

  it('finds one record per version note in each locale, with the same levels', () => {
    expect(en.length).toBeGreaterThanOrEqual(18)
    expect(es.map(({ api }) => api)).toEqual(en.map(({ api }) => api))
  })

  it('gives every record an API level and a targeting table or a reason it is empty', () => {
    const missing = all
      .filter(
        (version) => version.targeting.length === 0 && !version.targetingNote,
      )
      .map(({ href }) => href)
    expect(missing).toEqual([])
  })

  it('gives every record a migration checklist of at least three steps', () => {
    const thin = all
      .filter((version) => (version.checklist?.steps.length ?? 0) < 3)
      .map(({ href }) => href)
    expect(thin).toEqual([])
  })

  it('links only to heading ids the note really renders', async () => {
    const byHref = new Map(
      (await sources()).map((source) => [
        source.href,
        new Set(source.headings.map(({ slug }) => slug)),
      ]),
    )
    const broken = all.flatMap((version) =>
      Object.entries(version.anchors)
        .filter(([, slug]) => !byHref.get(version.href)?.has(slug))
        .map(([key, slug]) => `${version.href}#${slug} (${key})`),
    )
    expect(broken).toEqual([])
    for (const version of all) {
      expect(version.anchors.migrating, version.href).toBeTruthy()
      expect(version.anchors.targeting, version.href).toBeTruthy()
      expect(version.anchors.permissions, version.href).toBeTruthy()
    }
  })

  it('backs every manifest rule with the note at its API level', () => {
    const unsupported = MANIFEST_RULES.flatMap((rule) =>
      [en, es].flatMap((model) => {
        const version = model.find(({ api }) => api === rule.api)
        if (!version) return [`${rule.id}: no note for API ${rule.api}`]
        const anchor = version.anchors[rule.section]
        const text = [
          ...version.permissions,
          ...version.allApps,
          ...version.targeting,
        ]
          .map((row) => Object.values(row).join(' '))
          .join(' ')
          .concat(' ', version.permissionsNote ?? '')
        return [
          ...(anchor ? [] : [`${rule.id}: ${version.href} has no anchor`]),
          ...rule.evidence
            .filter((term) => !text.includes(term))
            .map((term) => `${rule.id}: "${term}" not in ${version.href}`),
        ]
      }),
    )
    expect(unsupported).toEqual([])
  })

  it('only names lint checks the notes themselves name', () => {
    const corpus = all
      .flatMap((version) => [
        ...version.targeting,
        ...version.allApps,
        ...version.permissions,
      ])
      .map((row) => Object.values(row).join(' '))
      .concat(all.flatMap((version) => version.checklist?.steps ?? []))
      .join(' ')
    const unnamed = MANIFEST_RULES.flatMap((rule) => rule.lint ?? []).filter(
      (id) => !corpus.includes(`\`${id}\``),
    )
    expect(unnamed).toEqual([])
  })
})
