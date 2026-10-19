/**
 * The Android targetSdk migration planner, derived from the version notes.
 *
 * Nothing here is hand-entered. Every Android version note shares one shape
 * (docs/writing-notes.md, "Shape of a version note"): an at-a-glance table, a
 * permissions table, a "What changed for your app" section with an all-apps
 * table and a targeting table, and a "Migrating to API N" checklist. This
 * module reads those sections out of each note's markdown and keeps their cells
 * as inline markdown, so the planner says exactly what the note says.
 *
 * Anchors come from the headings the site itself rendered (Astro's
 * `entry.rendered.metadata.headings`), never from a slug recomputed here, so a
 * link from the planner lands where the note really puts its heading. A section
 * that exists without a rendered heading fails the build instead of shipping a
 * dead fragment.
 */
import type { Token, Tokens } from 'marked'

import type { Locale } from '@/i18n'

export interface PlannerHeading {
  readonly depth: number
  readonly slug: string
  readonly text: string
}

/** One version note, as `src/lib/content.ts` hands it over. */
export interface PlannerSource {
  readonly slug: string
  readonly locale: Locale
  readonly title: string
  readonly href: string
  /**
   * The note body as `marked` tokens. Lexing happens where the note is read
   * (`getPlannerSources`), so this module needs no markdown parser at runtime
   * and the island that imports it does not ship one.
   */
  readonly tokens: readonly Token[]
  readonly headings: readonly PlannerHeading[]
}

/** A row of a "Change | What to do | How to check" table. */
export interface ChangeRow {
  readonly change: string
  readonly action: string
  readonly check: string
}

/** A row of the permissions table. */
export interface PermissionRow {
  readonly permission: string
  readonly changed: string
  readonly declare: string
  readonly remove: string
}

export interface Checklist {
  readonly intro: string
  readonly steps: readonly string[]
  readonly outro: readonly string[]
}

export interface PlannerAnchors {
  readonly permissions?: string
  readonly allApps?: string
  readonly targeting?: string
  readonly migrating?: string
}

export interface PlannerVersion {
  readonly api: number
  /** The marketing number, `13`, `5.1` or `12L`. */
  readonly version: string
  readonly name?: string
  readonly title: string
  readonly href: string
  readonly anchors: PlannerAnchors
  readonly permissions: readonly PermissionRow[]
  readonly permissionsNote?: string
  readonly allApps: readonly ChangeRow[]
  readonly targeting: readonly ChangeRow[]
  /** Why the targeting table is empty, in the note's own words. */
  readonly targetingNote?: string
  readonly checklist?: Checklist
}

/** The series every version note belongs to. */
export const PLANNER_SERIES = 'android-versions'

/**
 * A version note of the series. The series hub (the "all versions" overview)
 * shares its translation key with the series id and has no checklist of its
 * own, so it is not a level the planner can cross.
 */
export const isPlannerVersionNote = (data: {
  readonly translationKey: string
  readonly series?: { readonly id: string }
}): boolean =>
  data.series?.id === PLANNER_SERIES && data.translationKey !== PLANNER_SERIES

type SectionKey = 'glance' | 'permissions' | 'changed' | 'migrating'
type SubsectionKey = 'allApps' | 'targeting'

const SECTION_PATTERNS: Record<SectionKey, RegExp> = {
  glance: /^(at a glance|de un vistazo)$/i,
  permissions: /^(permissions|permisos)$/i,
  changed: /^(what changed for your app|qué cambió para tu app)$/i,
  migrating: /^(migrating to|migrar a) api \d+$/i,
}

const SUBSECTION_PATTERNS: Record<SubsectionKey, RegExp> = {
  allApps: /^(all apps|todas las apps)\b/i,
  targeting: /\b(targeting|target|apuntan a)\b.*\bapi \d+$/i,
}

const GLANCE_LABELS = {
  version: /^(version|versión)$/i,
  api: /^(api level|nivel de api)$/i,
  name: /^(name|nombre)$/i,
}

// ---------------------------------------------------------------------------
// Inline markdown
// ---------------------------------------------------------------------------

export type InlineNode =
  | { readonly type: 'text'; readonly value: string }
  | { readonly type: 'code'; readonly value: string }
  | { readonly type: 'strong'; readonly value: string }
  | { readonly type: 'link'; readonly value: string; readonly href: string }

const ESCAPABLE = /[\\`*_{}[\]()#+\-.!|<>~"']/

/** A link may point into the site or to an https page; nothing else. */
const isSafeHref = (href: string): boolean =>
  (href.startsWith('/') && !href.startsWith('//')) ||
  href.startsWith('https://')

/** Index of the `)` closing the `(` at `open`, counting nested parentheses. */
const closingParen = (text: string, open: number): number => {
  let depth = 0
  for (let index = open; index < text.length; index += 1) {
    if (text[index] === '(') depth += 1
    if (text[index] === ')') {
      depth -= 1
      if (depth === 0) return index
    }
  }
  return -1
}

/**
 * The few inline constructs the notes' tables and checklists use — code spans,
 * bold and links — as nodes. Everything else, HTML included, stays literal
 * text, so a renderer never has to trust the markdown.
 */
export const parseInline = (markdown: string): InlineNode[] => {
  const nodes: InlineNode[] = []
  let text = ''
  const flush = () => {
    if (text) nodes.push({ type: 'text', value: text })
    text = ''
  }

  let index = 0
  while (index < markdown.length) {
    const character = markdown[index]

    if (character === '\\' && ESCAPABLE.test(markdown[index + 1] ?? '')) {
      text += markdown[index + 1]
      index += 2
      continue
    }

    if (character === '`') {
      let run = 1
      while (markdown[index + run] === '`') run += 1
      const fence = '`'.repeat(run)
      const end = markdown.indexOf(fence, index + run)
      if (end > -1) {
        flush()
        nodes.push({
          type: 'code',
          value: markdown.slice(index + run, end).trim(),
        })
        index = end + run
        continue
      }
    }

    if (markdown.startsWith('**', index)) {
      const end = markdown.indexOf('**', index + 2)
      if (end > index + 2) {
        flush()
        nodes.push({
          type: 'strong',
          value: toPlainText(markdown.slice(index + 2, end)),
        })
        index = end + 2
        continue
      }
    }

    if (character === '[') {
      const labelEnd = markdown.indexOf('](', index)
      const hrefEnd = labelEnd > -1 ? closingParen(markdown, labelEnd + 1) : -1
      if (labelEnd > -1 && hrefEnd > -1) {
        const label = toPlainText(markdown.slice(index + 1, labelEnd))
        const href = markdown.slice(labelEnd + 2, hrefEnd).trim()
        if (isSafeHref(href)) {
          flush()
          nodes.push({ type: 'link', value: label, href })
        } else {
          text += label
        }
        index = hrefEnd + 1
        continue
      }
    }

    text += character
    index += 1
  }
  flush()
  return nodes
}

/** The words a reader sees, without any markup. */
export const toPlainText = (markdown: string): string =>
  parseInline(markdown)
    .map((node) => node.value)
    .join('')

// ---------------------------------------------------------------------------
// Parsing a note
// ---------------------------------------------------------------------------

const normalise = (text: string): string => text.replace(/\s+/g, ' ').trim()

/** Fragment-only links are relative to the note, not to the planner page. */
const anchorLinks = (markdown: string, href: string): string =>
  markdown.replace(/\]\(#/g, `](${href}#`)

const cellText = (cell: Tokens.TableCell, href: string): string =>
  anchorLinks(normalise(cell.text), href)

const isImage = (token: Token): boolean =>
  token.type === 'paragraph' && token.text.trimStart().startsWith('![')

interface Collected {
  glance: Tokens.Table[]
  permissions: Token[]
  allApps: Token[]
  targeting: Token[]
  migrating: Token[]
  headings: Partial<Record<SectionKey | SubsectionKey, Tokens.Heading>>
}

/** Groups the tokens of the four sections the planner reads. */
const collect = (tokens: readonly Token[]): Collected => {
  const collected: Collected = {
    glance: [],
    permissions: [],
    allApps: [],
    targeting: [],
    migrating: [],
    headings: {},
  }
  let section: SectionKey | undefined
  let subsection: SubsectionKey | undefined

  for (const token of tokens) {
    if (token.type === 'heading') {
      const text = toPlainText(token.text)
      if (token.depth <= 2) {
        section = (Object.keys(SECTION_PATTERNS) as SectionKey[]).find((key) =>
          SECTION_PATTERNS[key].test(text),
        )
        subsection = undefined
        if (section) collected.headings[section] ??= token as Tokens.Heading
        continue
      }
      if (token.depth === 3) {
        subsection =
          section === 'changed'
            ? (Object.keys(SUBSECTION_PATTERNS) as SubsectionKey[]).find(
                (key) => SUBSECTION_PATTERNS[key].test(text),
              )
            : undefined
        if (subsection)
          collected.headings[subsection] ??= token as Tokens.Heading
        // An h3 inside "At a glance" or the checklist (4.4W, three 7.1
        // releases) ends the part the planner reads.
        if (section !== 'changed') section = undefined
        continue
      }
    }
    if (section === 'glance' && token.type === 'table') {
      collected.glance.push(token as Tokens.Table)
    }
    if (section === 'permissions') collected.permissions.push(token)
    if (section === 'changed' && subsection) collected[subsection].push(token)
    if (section === 'migrating') collected.migrating.push(token)
  }
  return collected
}

const glanceValue = (
  tables: readonly Tokens.Table[],
  label: RegExp,
): string | undefined => {
  for (const table of tables) {
    for (const row of [table.header, ...table.rows]) {
      if (row.length >= 2 && label.test(toPlainText(normalise(row[0].text)))) {
        return toPlainText(normalise(row[1].text))
      }
    }
  }
  return undefined
}

const firstParagraph = (tokens: readonly Token[]): string | undefined => {
  const paragraph = tokens.find(
    (token) => token.type === 'paragraph' && !isImage(token),
  )
  return paragraph ? normalise((paragraph as Tokens.Paragraph).text) : undefined
}

const tables = (tokens: readonly Token[], columns: number): Tokens.Table[] =>
  tokens.filter(
    (token): token is Tokens.Table =>
      token.type === 'table' &&
      (token as Tokens.Table).header.length === columns,
  )

const changeRows = (tokens: readonly Token[], href: string): ChangeRow[] =>
  tables(tokens, 3).flatMap((table) =>
    table.rows.map(([change, action, check]) => ({
      change: cellText(change, href),
      action: cellText(action, href),
      check: cellText(check, href),
    })),
  )

const permissionRows = (
  tokens: readonly Token[],
  href: string,
): PermissionRow[] =>
  tables(tokens, 4).flatMap((table) =>
    table.rows.map(([permission, changed, declare, remove]) => ({
      permission: cellText(permission, href),
      changed: cellText(changed, href),
      declare: cellText(declare, href),
      remove: cellText(remove, href),
    })),
  )

const checklist = (
  tokens: readonly Token[],
  href: string,
): Checklist | undefined => {
  const listIndex = tokens.findIndex(
    (token) => token.type === 'list' && (token as Tokens.List).ordered,
  )
  if (listIndex < 0) return undefined
  const list = tokens[listIndex] as Tokens.List
  const paragraphs = (part: readonly Token[]) =>
    part
      .filter((token) => token.type === 'paragraph' && !isImage(token))
      .map((token) =>
        anchorLinks(normalise((token as Tokens.Paragraph).text), href),
      )
  return {
    intro: paragraphs(tokens.slice(0, listIndex)).join(' '),
    steps: list.items.map((item) => anchorLinks(normalise(item.text), href)),
    outro: paragraphs(tokens.slice(listIndex + 1)),
  }
}

/**
 * Resolves each heading the planner links to against the headings the site
 * rendered, consuming them in order so a repeated heading text maps to the
 * right occurrence.
 */
const resolveAnchors = (
  source: PlannerSource,
  tokens: readonly Token[],
  wanted: Collected['headings'],
): PlannerAnchors => {
  const pending = [...source.headings]
  const anchors: Record<string, string> = {}
  const keys = Object.entries(wanted) as [string, Tokens.Heading][]

  for (const token of tokens) {
    if (token.type !== 'heading') continue
    const text = toPlainText(token.text).trim()
    const index = pending.findIndex(
      (heading) =>
        heading.depth === token.depth && heading.text.trim() === text,
    )
    const match = index > -1 ? pending.splice(index, 1)[0] : undefined
    for (const [key, heading] of keys) {
      if (heading !== token || key === 'glance' || key === 'changed') continue
      if (!match) {
        throw new Error(
          `${source.slug} (${source.locale}): no rendered heading for "${text}"`,
        )
      }
      anchors[key] = match.slug
    }
  }
  return anchors as PlannerAnchors
}

/** Reads one version note into its planner record. */
export const parsePlannerVersion = (source: PlannerSource): PlannerVersion => {
  const { tokens } = source
  const sections = collect(tokens)
  const apiText = glanceValue(sections.glance, GLANCE_LABELS.api)
  const api = Number(apiText?.match(/\d+/)?.[0])
  if (!Number.isInteger(api) || api <= 0) {
    throw new Error(
      `${source.slug} (${source.locale}): the at-a-glance table has no API level`,
    )
  }
  const versionText = glanceValue(sections.glance, GLANCE_LABELS.version) ?? ''
  const version = versionText.match(/Android\s+([\d.]+L?)/i)?.[1] ?? String(api)
  const name = glanceValue(sections.glance, GLANCE_LABELS.name)
    ?.split(/[,;(]/)[0]
    .trim()

  const targeting = changeRows(sections.targeting, source.href)
  const permissionsNote = firstParagraph(sections.permissions)

  return {
    api,
    version,
    ...(name ? { name } : {}),
    title: source.title,
    href: source.href,
    anchors: resolveAnchors(source, tokens, sections.headings),
    permissions: permissionRows(sections.permissions, source.href),
    ...(permissionsNote ? { permissionsNote } : {}),
    allApps: changeRows(sections.allApps, source.href),
    targeting,
    ...(targeting.length === 0 && firstParagraph(sections.targeting)
      ? { targetingNote: firstParagraph(sections.targeting) }
      : {}),
    ...(checklist(sections.migrating, source.href)
      ? { checklist: checklist(sections.migrating, source.href) }
      : {}),
  }
}

/** Every version note of one locale, oldest API level first. */
export const buildPlannerModel = (
  sources: readonly PlannerSource[],
): PlannerVersion[] => {
  const versions = sources
    .map(parsePlannerVersion)
    .toSorted((left, right) => left.api - right.api)
  for (let index = 1; index < versions.length; index += 1) {
    if (versions[index].api === versions[index - 1].api) {
      throw new Error(
        `Two version notes claim API ${versions[index].api}: ${versions[index - 1].href} and ${versions[index].href}`,
      )
    }
  }
  return versions
}

// ---------------------------------------------------------------------------
// Ranges, steps and filters
// ---------------------------------------------------------------------------

/** The levels crossed going from one target to another, in order. */
export const getPlanRange = (
  model: readonly PlannerVersion[],
  from: number,
  to: number,
): PlannerVersion[] => model.filter(({ api }) => api > from && api <= to)

/**
 * The newest level with a checklist, reached from three levels below: the
 * migrations a maintained app is most likely to have ahead of it. Shorter
 * when the model has fewer levels.
 */
export const DEFAULT_SPAN = 3

export const getDefaultRange = (
  model: readonly PlannerVersion[],
): { from: number; to: number } => {
  const documented = model.filter(({ checklist }) => checklist)
  const target = (documented.at(-1) ?? model.at(-1))?.api ?? 0
  const index = model.findIndex(({ api }) => api === target)
  return {
    from: model[Math.max(0, index - DEFAULT_SPAN)]?.api ?? 0,
    to: target,
  }
}

/** Replaces each `{name}` in a dictionary string with its value. */
export const fill = (
  template: string,
  values: Readonly<Record<string, string | number>>,
): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )

/** "Android 13 · API 33", the label of a level everywhere it is picked. */
export const versionLabel = (
  version: Pick<PlannerVersion, 'version' | 'api'>,
) => `Android ${version.version} · API ${version.api}`

export interface StepParts {
  readonly lead?: string
  readonly body: string
  readonly verify?: string
}

const VERIFY = /\s*\b(?:Verify|Comprueba):\s*/

/**
 * A checklist step reads "**Lead.** What to do. Verify: how." — split so the
 * verification can sit on its own line.
 */
export const splitStep = (step: string): StepParts => {
  const leadMatch = /^\*\*(.+?)\*\*\s*/.exec(step)
  const rest = leadMatch ? step.slice(leadMatch[0].length) : step
  const [body, ...verify] = rest.split(VERIFY)
  return {
    ...(leadMatch ? { lead: leadMatch[1].trim() } : {}),
    body: body.trim(),
    ...(verify.length ? { verify: verify.join(' ').trim() } : {}),
  }
}

/** Every word of the query appears somewhere in the row's visible text. */
export const rowMatches = (
  row: ChangeRow | PermissionRow,
  query: string,
): boolean => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack = Object.values(row).map(toPlainText).join(' ').toLowerCase()
  return words.every((word) => haystack.includes(word))
}

/** 32-bit FNV-1a of a string, as eight hex digits: short, pure, stable. */
const fnv1a = (text: string): string => {
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

/**
 * The key one checklist step is remembered under: its level and a hash of its
 * own text. Keyed by content, not position, so a step added, removed or
 * reordered in a note never moves a tick onto a different step; an edited step
 * simply starts unticked.
 */
export const stepKey = (api: number, step: string): string =>
  `${api}:${fnv1a(step)}`

// ---------------------------------------------------------------------------
// Per-viewer state
// ---------------------------------------------------------------------------

/**
 * Ticked steps, kept in this browser only — a convenience for one reader, not
 * a record. Keyed per locale because the two notes of a level word their steps
 * differently. v1 keyed steps by position; those ticks are left behind rather
 * than misapplied to whatever step now sits at that index.
 */
export const PROGRESS_KEY = 'nullkdev:migration-planner:v2'

type ProgressStore = Partial<Record<Locale, readonly string[]>>

const readStore = (
  storage: Pick<Storage, 'getItem'> | undefined,
): ProgressStore => {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(PROGRESS_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? (parsed as ProgressStore) : {}
  } catch {
    return {}
  }
}

export const readProgress = (
  storage: Pick<Storage, 'getItem'> | undefined,
  locale: Locale,
): Set<string> => {
  const keys = readStore(storage)[locale]
  return new Set(
    Array.isArray(keys)
      ? keys.filter((key): key is string => typeof key === 'string')
      : [],
  )
}

/** False when the browser refused to store it; the page still works. */
export const writeProgress = (
  storage: Pick<Storage, 'getItem' | 'setItem'> | undefined,
  locale: Locale,
  done: ReadonlySet<string>,
): boolean => {
  if (!storage) return false
  try {
    storage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ ...readStore(storage), [locale]: [...done] }),
    )
    return true
  } catch {
    return false
  }
}

export interface PlanRange {
  readonly from: number
  readonly to: number
}

/** The documented level just above `api`, if any. */
const levelAbove = (
  model: readonly PlannerVersion[],
  api: number,
): number | undefined => model.find((version) => version.api > api)?.api

/** The documented level just below `api`, if any. */
const levelBelow = (
  model: readonly PlannerVersion[],
  api: number,
): number | undefined => model.findLast((version) => version.api < api)?.api

/**
 * A range that always goes up. The end the reader just picked stays where they
 * put it and the other end moves to the nearest level that makes a plan: a
 * current level at or past the new target pushes the target to the next level
 * (or, from the newest level, pulls the current level one below it); a new
 * target at or under the current level pulls the current level below it.
 */
export const normalizeRange = (
  model: readonly PlannerVersion[],
  range: PlanRange,
  picked: 'from' | 'to',
): PlanRange => {
  const { from, to } = range
  if (to > from) return { from, to }
  if (picked === 'from') {
    const above = levelAbove(model, from)
    if (above !== undefined) return { from, to: above }
    const below = levelBelow(model, from)
    return below === undefined ? { from, to } : { from: below, to: from }
  }
  const below = levelBelow(model, to)
  if (below !== undefined) return { from: below, to }
  const above = levelAbove(model, to)
  return above === undefined ? { from, to } : { from: to, to: above }
}

/**
 * "Plan from API N" for a manifest that targets N: start there and keep the
 * new target if it is still ahead, else move it to the next level. Undefined
 * when N is not a documented level or is already the newest one, so the page
 * never offers a plan with nothing in it.
 */
export const planFromTarget = (
  model: readonly PlannerVersion[],
  target: number,
  to: number,
): PlanRange | undefined => {
  if (!model.some(({ api }) => api === target)) return undefined
  const above = levelAbove(model, target)
  return above === undefined
    ? undefined
    : { from: target, to: Math.max(to, above) }
}

/**
 * A shared link's `?from=31&to=36`, when both are documented levels. A pair
 * that does not go up is corrected the way a picked one is, keeping its start.
 */
export const parseRangeQuery = (
  search: string,
  model: readonly PlannerVersion[],
): PlanRange | undefined => {
  const params = new URLSearchParams(search)
  const from = Number(params.get('from'))
  const to = Number(params.get('to'))
  const known = (api: number) => model.some((version) => version.api === api)
  return known(from) && known(to)
    ? normalizeRange(model, { from, to }, 'from')
    : undefined
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export interface PlanMarkdownStrings {
  readonly title: string
  /** `{from}` and `{to}` are replaced with the API levels. */
  readonly range: string
  readonly targeting: string
  /** `{version}` is replaced with the marketing number. */
  readonly readNote: string
  readonly disclaimer: string
}

export interface PlanMarkdownInput {
  readonly steps: readonly PlannerVersion[]
  readonly from: number
  readonly to: number
  readonly done: ReadonlySet<string>
  /** Absolute origin, so the exported file's links work outside the site. */
  readonly origin: string
  readonly strings: PlanMarkdownStrings
}

/** The plan as a Markdown checklist, with what the reader already ticked. */
export const planToMarkdown = ({
  steps,
  from,
  to,
  done,
  origin,
  strings,
}: PlanMarkdownInput): string => {
  const absolute = (markdown: string) =>
    markdown.replace(/\]\(\//g, `](${origin}/`)
  const lines = [
    `# ${strings.title}`,
    '',
    strings.range.replace('{from}', String(from)).replace('{to}', String(to)),
  ]
  for (const version of steps) {
    lines.push('', `## ${versionLabel(version)}`, '')
    if (version.checklist) {
      if (version.checklist.intro) {
        lines.push(absolute(version.checklist.intro), '')
      }
      for (const step of version.checklist.steps) {
        const mark = done.has(stepKey(version.api, step)) ? 'x' : ' '
        lines.push(`- [${mark}] ${absolute(step)}`)
      }
      for (const paragraph of version.checklist.outro) {
        lines.push('', absolute(paragraph))
      }
    }
    lines.push('', `### ${strings.targeting}`, '')
    if (version.targeting.length) {
      for (const row of version.targeting) {
        const check = row.check ? ` (${absolute(row.check)})` : ''
        lines.push(`- ${absolute(row.change)}: ${absolute(row.action)}${check}`)
      }
    } else if (version.targetingNote) {
      lines.push(absolute(version.targetingNote))
    }
    const anchor = version.anchors.migrating ?? version.anchors.targeting
    lines.push(
      '',
      `[${strings.readNote.replace('{version}', version.version)}](${origin}${version.href}${anchor ? `#${anchor}` : ''})`,
    )
  }
  lines.push('', '---', '', strings.disclaimer, '')
  return lines.join('\n')
}
