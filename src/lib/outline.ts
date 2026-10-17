/**
 * The "In this record" outline for long-form pages.
 *
 * One depth rule for every surface: only `h2` and `h3` are listed. Anything
 * deeper is detail inside a section, not a place a reader navigates to, and a
 * subpost read on its own URL must not get a longer index than the same text
 * gets inside its entry.
 *
 * `level` is the normalised outline depth (1-3) the sidebar indents by. The
 * raw markdown depth would collapse an entry `h2` and a subpost `h2` onto the
 * same rung despite one sitting inside the other.
 */
export interface OutlineHeading {
  readonly depth: number
  readonly slug: string
  readonly text: string
}

export type OutlineLevel = 1 | 2 | 3

export interface OutlineItem {
  readonly slug: string
  readonly text: string
  readonly level: OutlineLevel
  /** The number the prose counter prints before this heading ("06"). Only an
      entry's own `h2`s carry one — see `numberSections`. */
  readonly number?: string
  /** Set on the title of an inlined subpost, the group its headings sit in. */
  readonly part?: true
  /** Reading minutes of that subpost, when known. */
  readonly minutes?: number
}

/** A subpost rendered inline: its anchor, its title and its own headings. */
export interface OutlinePart {
  readonly slug: string
  readonly title: string
  readonly headings: readonly OutlineHeading[]
  readonly minutes?: number
}

/** The outline split the way the index renders it: the entry's own sections,
    then one group per inlined subpost. */
export interface OutlineGroups {
  readonly lead: readonly OutlineItem[]
  readonly parts: readonly {
    readonly part: OutlineItem
    readonly items: readonly OutlineItem[]
  }[]
}

const MIN_DEPTH = 2
const MAX_DEPTH = 3

const isListed = ({ depth }: OutlineHeading) =>
  depth >= MIN_DEPTH && depth <= MAX_DEPTH

/** `offset` is the level an `h2` lands on in this context. */
const toItems = (
  headings: readonly OutlineHeading[],
  offset: number,
): OutlineItem[] =>
  headings.filter(isListed).map(({ slug, text, depth }) => ({
    slug,
    text,
    level: Math.min(depth - MIN_DEPTH + offset, 3) as OutlineLevel,
  }))

/**
 * Number the top rung the way `prose.css` numbers the text: its counter
 * increments on `.prose > h2`, a page's own sections, with two digits. The
 * index and the heading then show the same "06" for the same section, so a
 * reader can match one to the other at a glance.
 */
const numberSections = (items: readonly OutlineItem[]): OutlineItem[] => {
  let count = 0
  return items.map((item) =>
    item.level === 1
      ? { ...item, number: String(++count).padStart(2, '0') }
      : item,
  )
}

/**
 * An entry and the subposts it inlines, as one anchored outline. Subposts are
 * read continuously rather than navigated, so their headings belong in the
 * index too — nested under the part they live in. A subpost's own `h2`s sit
 * inside its `<section>`, outside the prose counter, so they get no number.
 */
export const buildEntryOutline = (
  headings: readonly OutlineHeading[],
  parts: readonly OutlinePart[],
): OutlineItem[] => [
  ...numberSections(toItems(headings, 1)),
  ...parts.flatMap(({ slug, title, minutes, headings: partHeadings }) => [
    {
      slug,
      text: title,
      level: 1 as const,
      part: true as const,
      ...(minutes === undefined ? {} : { minutes }),
    },
    ...toItems(partHeadings, 2),
  ]),
]

/** A subpost on its own URL: the same rule, with its `h2` at the top rung. */
export const buildDocumentOutline = (
  headings: readonly OutlineHeading[],
): OutlineItem[] => numberSections(toItems(headings, 1))

/**
 * Group the outline by part. A long multi-part entry listed 51 items in one
 * column; grouped, each part collapses to its title and only the part being
 * read shows its headings.
 */
export const groupOutlineByPart = (
  items: readonly OutlineItem[],
): OutlineGroups => {
  const firstPart = items.findIndex((item) => item.part)
  const lead = firstPart === -1 ? items : items.slice(0, firstPart)
  const parts: { part: OutlineItem; items: OutlineItem[] }[] = []
  for (const item of firstPart === -1 ? [] : items.slice(firstPart)) {
    if (item.part) parts.push({ part: item, items: [] })
    else parts.at(-1)?.items.push(item)
  }
  return { lead, parts }
}

/** The top rung only: what a phone-width contents lists. */
export const getTopLevelOutline = (
  items: readonly OutlineItem[],
): OutlineItem[] => items.filter(({ level }) => level === 1)

/**
 * The phone contents: the top rung when it offers a choice, otherwise the one
 * section with its subsections — a long note with a single h2 and many h3s
 * would else get an index on desktop and none on a phone. Empty when there is
 * nowhere to jump but the one heading.
 */
export const getCompactOutline = (
  items: readonly OutlineItem[],
): OutlineItem[] => {
  const top = getTopLevelOutline(items)
  if (top.length > 1) return top
  return items.length > 1 ? [...items] : []
}

/**
 * Heading i of this page → heading i of its translation, so switching
 * language keeps the reader's place. Only when both outlines have the same
 * length and the same nesting; otherwise heading i is not the same section,
 * and no mapping (the switch lands at the top) beats a wrong one.
 */
export const getCounterpartAnchors = (
  source: readonly OutlineItem[],
  target: readonly OutlineItem[] | undefined,
): Record<string, string> | undefined => {
  if (!target || source.length === 0 || source.length !== target.length) {
    return undefined
  }
  if (source.some((item, index) => item.level !== target[index].level)) {
    return undefined
  }
  return Object.fromEntries(
    source.map((item, index) => [item.slug, target[index].slug]),
  )
}

/** The anchor an inlined subpost carries inside its entry. */
export const getPartAnchor = (order: number): string => `part-${order}`
