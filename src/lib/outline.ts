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
}

/** A subpost rendered inline: its anchor, its title and its own headings. */
export interface OutlinePart {
  readonly slug: string
  readonly title: string
  readonly headings: readonly OutlineHeading[]
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
 * An entry and the subposts it inlines, as one anchored outline. Subposts are
 * read continuously rather than navigated, so their headings belong in the
 * index too — nested under the part they live in.
 */
export const buildEntryOutline = (
  headings: readonly OutlineHeading[],
  parts: readonly OutlinePart[],
): OutlineItem[] => [
  ...toItems(headings, 1),
  ...parts.flatMap(({ slug, title, headings: partHeadings }) => [
    { slug, text: title, level: 1 as const },
    ...toItems(partHeadings, 2),
  ]),
]

/** A subpost on its own URL: the same rule, with its `h2` at the top rung. */
export const buildDocumentOutline = (
  headings: readonly OutlineHeading[],
): OutlineItem[] => toItems(headings, 1)

/** The anchor an inlined subpost carries inside its entry. */
export const getPartAnchor = (order: number): string => `part-${order}`
