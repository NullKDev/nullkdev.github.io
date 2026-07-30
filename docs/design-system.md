# Design system

`DESIGN.md` holds the direction (why the site looks like this). This file holds
the parts (what to reach for when building).

## Tokens

Defined in `src/styles/global.css` on `:root`, overridden on
`:root[data-theme='dark']`. Never hardcode a colour in a component.

| Token | Use |
|---|---|
| `--paper`, `--surface`, `--surface-raised` | Page canvas → recessed → raised |
| `--ink`, `--ink-muted` | Primary and secondary text |
| `--line`, `--line-strong` | Hairlines and structural rules |
| `--accent`, `--accent-hover`, `--accent-soft`, `--accent-foreground` | Indigo: action, emphasis, focus |
| `--signal`, `--signal-soft` | Emerald: live status, success |
| `--radius-sm/md/lg` | 4 / 8 / 12px |
| `--shadow-1`, `--shadow-2` | Two-step elevation |
| `--display-mult`, `--density`, `--ui-scale` | Dev DesignPanel knobs |

**Status tones** are not tokens — they are derived. `getLifecycleTone()` in
`src/lib/status.ts` maps any collection's lifecycle vocabulary onto
`live | progress | archived | neutral`, and the CSS colours the chip from that.
Add a lifecycle value to the map, not a new colour to a component.

## Type

- **Switzer** for everything visible: display, headings, UI, body.
- **IBM Plex Mono** for technical accents only — labels, metadata, status lines,
  counts, code, tabular numerics. Not as decoration. If mono is being used to
  make something "look technical", that is the wrong reason.

## Icons

**One registry: `src/lib/icons.ts`** — and it is the only seam between this site
and whoever draws its icons. Marks are no longer drawn by hand; the registry maps
*intent* to a pack icon and resolves it at build time through `@iconify/utils`:

```ts
evidence:  'lucide:file-check'
playstore: 'simple-icons:googleplay'
```

- **Lucide** supplies interface marks — 24×24, no fill, `currentColor`, round
  caps and joins. Its stroke is 2; this site draws at **1.7**, so `render()`
  normalises it.
- **Simple Icons** supplies brand logos, which are filled single paths with
  official geometry.

A filled logo beside a stroked interface mark is correct, not inconsistent: a
brand is a solid shape, an interface mark is a line.

Two ways to use it:

```astro
import Icon from '@/components/primitives/Icon.astro'
<Icon name="evidence" size={18} />
```

```ts
import { renderIcon } from '@/lib/icons'
const markup = renderIcon('check', 13)   // for set:html inside existing markup
```

Both packs are **devDependencies**: they resolve during the build and nothing
ships to the browser. Swapping packs means editing `registry` and nothing else —
call sites name intent (`evidence`, `release`), never a vendor's icon id.

Never write an `<svg>` inline in a component. That rule exists because the same
marks were once redrawn in five files at three stroke widths, and it had already
grown back: `Callout.astro` carried its own four-icon set at a fourth width, and
`ReadmeCard.astro` inlined a book path identical to `citations`.

**A mark is painted in ink, never in a border token.** `--line` / `--line-strong`
are for 1px rules between blocks; used for a list marker they measured 1.44:1 and
were invisible. Keep a marker subordinate by making it *small*, never by making
it *faint* — the same reason channel labels are not dimmed with `opacity`.

**Wrapper sizing.** Tailwind's preflight sets `svg { display: block }`, which
drops any inline mark onto its own line. `global.css` corrects it once on the
`.icon` wrapper (`display: inline-flex`, `vertical-align: -0.125em`); do not
patch it per component.

**Lab subject glyphs** are the one deliberate exception: `src/components/lab/lab-icons.ts`
holds per-entry marks with a resolution chain — dedicated glyph → topic glyph →
`kind` fallback — so an archive of thousands of entries always renders an icon.
They share the same drawing conventions.

## Primitives

`src/components/primitives/` — project-owned, reusable, no domain knowledge.

| Component | Props | Notes |
|---|---|---|
| `Icon.astro` | `name`, `size`, `class` | The only way to render an icon |
| `StatusChip.astro` | `lifecycle`, `locale`, `size` | Derives tone and label itself |
| `Breadcrumb.astro` | `locale`, `trail[]` | Semantic `<ol>`; chevrons drawn in CSS so they never reach the a11y tree |
| `Pagination.astro` | `current`, `total`, `href()`, `labels` | Route-based paging; used by Notes |
| `BrandMark.astro` · `SignalMotif.astro` | — | Brand marks |

`src/components/ui/` is **shadcn's**. Do not add to it.

## Section identity

Each primary section is structurally distinct on purpose — a peer should know
where they are without reading the title. This is a design commitment, not an
accident; do not converge them.

| Section | Structure | Why |
|---|---|---|
| **Work** | Large vertical cards, banner image, folded status ribbon, typed link icons | Shipped artifacts deserve a product-spec presentation |
| **Lab** | Uniform grid + derived facet filter, icon-led cards | Must scale to thousands of diverse entries; scanning beats browsing |
| **Notes** | Card grid (3-up at 1440px), colour + icon + distinct structure per `kind`; type and topic filters, pagination, and search are real routes over the whole collection | The form of the writing is the organising idea, and this is where a reader browses longest |
| **Gallery** | Contact-sheet cards built from real contents; detail splits into a bento of pieces and a list of files/links | A collection card should look like what it holds |

## Banners

Declared in `src/data/banners.ts`, rendered by `scripts/generate-banners.ts`.
Never hand-drawn: artwork comes from the icon registry, so a banner can only use
marks the site already ships.

| | |
|---|---|
| Authored size | **1200×630** — the Open Graph card, so one file is both banner and social preview |
| Display ratio | **2.5:1**, one token `--banner-ratio`, centre-cropped |
| Safe band | **y=75..555** — anything that must stay legible lives here |
| Outputs | four SVG per banner (locale × theme) plus one PNG per locale for scrapers |
| Copy | localised — `copy: { en, es }` in the spec |
| Artwork | a motif from `scripts/banner-art.ts`, not a lone icon |

**Artwork draws the subject.** A single registry icon reads as a category badge
— it names the section, not the post. Motifs compose primitives into something
that carries an idea, and registry marks sit inside them at content scale.

**Two surfaces, one identity.** The accent, the composition and the shadows are
identical across themes; only the ground and the type invert. The banner is the
same object in both, not two designs. `EntryPage` sets `--banner-light` and CSS
swaps the file with `content:`, because an `<img>` cannot read `data-theme` and a
`background-image` would drop the alt text.

Two constraints that are easy to violate:

**The ratio belongs on the `<img>`, not the wrapper.** `height: 100%` against an
auto-height parent is indefinite, so the image falls back to its intrinsic ratio
and sizes the box it was meant to fit inside — producing a different crop at
every breakpoint while `getComputedStyle` reports the value you set.

**PNG is not optional.** X, Facebook, LinkedIn, Slack and WhatsApp render nothing
for an SVG `og:image`.

Every banner surface reads the same token: entry hero, featured note, note rows,
home cards, work and lab cards. Gallery media is not a banner — photographs keep
their own shapes.

`bun run banners:check` enforces the size and fails the build otherwise.

## Note types

`--kind-article | -note | -guide | -paper | -decision | -reference` in
`global.css`, per theme. Each is used as label text, so each passes AA on a
raised surface. The type sets `--kind` on the row via `[data-kind]`, and every
tinted surface in that row mixes from it.

Structure differs by type, not just colour: a paper is framed like a document
and leads with citations; a guide lists what it covers; a note is compact. A
preview is shown by any entry that has an image — only its aspect changes.

**Browse controls.** The filter bar is sticky. Type and topic are route axes;
search is a client filter over a build-time index of the *whole* collection, so
it never reports a page as if it were the archive. Read state is a private
localStorage marker (`src/lib/reading-log.ts`) — the site measures nothing.

## Lab console

`src/components/lab/LabConsole.astro` frames whatever an entry runs. It is
shape-agnostic by design because Lab entries range from a text transform to an
OCR pass to an emulator.

- `surface` (`form | canvas | viewport | embed | none`) sizes and insets the stage.
- The setup panel renders only when the entry declares `steps`, `requires`, or
  `downloads`. An entry with none gets a full-width stage, not an empty column.
- The status bar is **derived from `execution` and `sendsDataTo`** — it lists real
  hostnames. It must never be hardcoded; it was once, and it would have lied.
- Declared `requires` are verified at runtime by `src/lib/capabilities.ts`
  (feature detection, never user-agent). Permission-gated APIs report `prompts`,
  not `supported`, because an API existing is not consent. Without JS the list
  degrades to the declared requirements.

## Two reset traps, both hit in this project

Worth checking whenever a browser or framework default "should" apply and does
not:

1. **Tailwind utilities live in `@layer utilities`, and an unlayered rule beats
   every layer.** A bare `a { color: inherit }` in `global.css` silently
   overrode `text-[var(--action-foreground)]` on a button variant. The anchor
   rule is now `a:not([data-slot='button'])`.
2. **Tailwind preflight zeroes every margin**, which destroys the `margin: auto`
   a native modal `<dialog>` relies on to centre itself. `.gallery-viewer`
   restores it explicitly.

Related: a filled control's fill sets its own contrast floor, so it cannot be
lightened for the dark theme the way a text colour is. Both `--action` and the
Work status ribbon had to keep their light-theme values in dark.

## Rules of thumb

- Anything that looks actionable must work completely and be keyboard-operable,
  or it is omitted.
- Every block is conditional on real data. Prefer a shorter page to an empty heading.
- Both themes ship together. A new accent/ink pair passes AA before it lands.
- Motion: one authored moment per surface, neutralised under `prefers-reduced-motion`.
