# Decision log

Decisions that shaped the project and are **not** recoverable from the code —
the alternatives that were rejected, and why. Newest first. Add an entry when a
decision closes off other options; skip it when the code already says it.

Format: what was decided · why · what it rules out.

---

## 2026-07-30 — A shared link shows what was shared

**Decided.** An entry's social preview is its own banner; only home, About and
the section indexes fall back to the identity card. Banners are authored at
1200×630 and rasterised to PNG, because X, Facebook, LinkedIn, Slack and
WhatsApp render nothing at all for an SVG `og:image`.

**Why.** Every page advertised the same card, which still carried the previous
brand and section names. The blocker was not the missing prop: the metadata
checker *asserted* that every page use the shared image, so the correct change
could not pass the build. When a check enforces the wrong thing, the check is
the defect.

**Rules out.** A single shared card. Authoring banners at any other size — the
same file has to serve as both banner and Open Graph image. Pointing a preview
at an SVG.

## 2026-07-30 — One banner shape, declared not drawn

**Decided.** Banners are specs in `src/data/banners.ts` rendered by one script,
with artwork taken from the icon registry. One display ratio for every surface,
held in `--banner-ratio`, with the aspect ratio applied to the `<img>`.

**Why.** Six different treatments existed for the same images, and one banner
rendered at 3.76:1 on desktop, 2.35:1 at 900px and 1.90:1 on a phone. Separately,
a hand-drawn Android robot shipped while `simple-icons:android` was already in
the registry.

**Rules out.** Hand-drawn banner artwork. A second banner shape without a new
token and a written reason. Applying the ratio to a wrapper, where `height: 100%`
against an auto-height parent is indefinite and the image sizes the box instead.

## 2026-07-30 — Banner colour is measured against the surface it lands on

**Decided.** Every colour in a banner spec is checked with a contrast ratio
before it ships: the light ground against `--surface-raised`, the type against
the ground and against the deepest corner of the gradient, and each accent
against all four grounds it can appear on — dark base, dark deep, light ground,
light tint.

**Why.** The light surface was `#F8FAFC`, which measures 1.05:1 against the
`#ffffff` card and 1.01:1 against the page. The banner had no edge; its corner
*was* the surface behind it, so the artwork read as floating on the card. The
100-level tints had the same problem at 1.13–1.23:1 — a colour present in the
file and absent on screen. Measuring also caught what looking could not: emerald
`#059669` clears 3:1 on three grounds and fails its own light tint at 2.94:1.

**Rules out.** Picking a banner ground because it looks light, or an accent
because it looks visible in one theme. A single accent serving both themes is
what makes four measurements mandatory rather than one.

## 2026-07-30 — Commits, changelog and releases are one system

**Decided.** `type(scope): description` verified in CI on commits and PR titles;
a hand-curated `CHANGELOG.md`; releases triggered by a version bump rather than a
merge, with notes generated from commit subjects.

**Why.** The generated notes are only readable if the subjects are disciplined,
so the format is not style — it is the input. Releasing on every merge would
increment the version for housekeeping, and a number that moves for nothing
stops meaning anything. The changelog stays hand-written because the curation —
excluding `chore`, `style`, `ci`, `docs` — is the entire value; generated, it is
a `git log` with extra steps.

**Rules out.** Free-form subjects. Auto-generating the changelog. Releasing on
merge. Enforcing the convention over history that predates it.

## 2026-07-26 — The public name is CarlosDev; the address stays nullkdev

**Decided.** The wordmark, page titles, feed and `og:site_name` read
**CarlosDev**. The name now lives in one place, `src/data/brand.ts`, instead of
being retyped in fifteen files.

**Why.** The owner wanted a name that reads as a person rather than a handle.

**Rules out.** A global find-and-replace on "nullkdev". Four kinds of string
only *look* like the brand and must never be swept up: the host
(`nullkdev.github.io`), the GitHub URLs, and two classes of identifier —
`nullkdev:notes-read`, whose rename discards every visitor's reading history,
and `nullkdev:protected:v*`, which is bound into the encryption envelope and
whose rename makes already-published protected content undecryptable.
Provenance records in `items.yml` also keep the old name: they state the name
the asset was authored under, and rewriting them would falsify a history field.

## 2026-07-26 — Icons come from packs, behind the existing registry

**Decided.** `src/lib/icons.ts` stopped storing hand-drawn paths and became a map
from intent to a pack icon, resolved at build through `@iconify/utils`.
**Lucide** for interface marks, **Simple Icons** for brand logos. All 44 call
sites were left untouched.

**Why.** Hand-drawn brand logos failed: the Google Play mark read as an envelope
and AppGallery was four generic squares. A pack carries designed optical
harmony — equal stroke weight across glyphs, consistent terminals, shapes that
survive rasterising at 16px — which hand-drawing cannot reproduce.

**Rules out.** `astro-icon`, the obvious pick: its `<Icon>` is a component and
cannot return a string, but `renderIcon()` is consumed by `set:html` in 19
places. Consuming the JSON packs directly preserved both APIs. Also rules out
subsetting IBM Plex Mono — the Lab's Unicode inspector renders arbitrary
visitor-supplied code points, so any subset guarantees fallback glyphs exactly
where the glyph *is* the content.

## 2026-07-25 — Gallery items live in a manifest, filled by a scanner

**Decided.** Each collection is one folder holding everything about it:
`index.md`, `items.yml`, and `assets/`. `bun run gallery:scan` appends a stub
for every asset it finds, pre-filled with path, size, format, and — for images —
pixel dimensions read straight from the file header. `bun run gallery:copy`
publishes `assets/` to `dist/gallery/<collection>/` at build; a small Vite
middleware serves the same paths in dev.

**Why.** Pure auto-discovery cannot work here: bilingual alt text is a WCAG AA
product requirement and no scanner can write it honestly, nor can it know
rights, provenance, or which model produced an image. Pure hand-authoring does
not survive a photo library of hundreds. The split is the answer — **the machine
fills facts, the human fills meaning** — and stubs are written with literal
`TODO` values so an unfinished record fails validation instead of shipping a
placeholder.

**Rules out.** Gallery assets in `public/`, and items inline in entry
frontmatter (a 200-image `index.md` is an unreviewable diff).

## 2026-07-25 — Gallery items are typed, and generated media declares its model

**Decided.** `galleryItems` is a discriminated union on `type`: `image`,
`video`, `document`, `archive`, `link`. Every item carries `origin`
(`captured | generated | derived | third-party`), and `origin: generated`
*requires* a `generation` block with tool, model, and prompt — enforced by a
schema refinement in both directions.

**Why.** A generated image and a photograph are not the same kind of object and
must not be presented as one; `PRODUCT.md`'s evidence rule makes recording how
a thing was made a requirement, not a nicety. Different types genuinely need
different metadata — a link has a host, a PDF has pages, an image has alt.

**Rules out.** Untyped "media" records, and generated media without an
attributable model and prompt.

## 2026-07-25 — Gallery index shows contact sheets, not banners

**Decided.** Each collection card is a mosaic of its real first pieces plus a
tally by item type, instead of one chosen banner image.

**Why.** A gallery card should look like what it holds. It also keeps the
section structurally distinct from Work, Lab, and Notes, and it needs no extra
authoring — the sheet is derived from items that already exist.

## 2026-07-25 — No featured entry on Notes

**Decided.** The Notes index has no lead card. The stream is reverse-chronological
and every card is the same component.

**Why.** "Most popular" is impossible — the site has no analytics by design and
`PRODUCT.md` forbids inventing metrics. "Newest" is already stated by position:
the first card *is* the newest, so featuring it repeated the same fact at a cost
of 464px above the fold. On a page built for browsing and filtering, the first
screen should show more choices, not fewer.

**Rules out.** Reinstating a lead without an explicit editorial signal in the
data (a `pinned` field the author sets by hand). Popularity-based ordering is
ruled out permanently while the site has no analytics.

## 2026-07-25 — Notes is a card grid, and search covers the whole collection

**Decided.** The stream is `repeat(auto-fill, minmax(21rem, 1fr))` — three
columns at 1440px, one on mobile. Topics became a second route axis
(`/notes/topic/<id>/`). A build-time per-locale JSON index (`/notes-search.json`,
`/es/notes-search.json`) backs a client filter that searches every entry, not
the current page. The filter bar is sticky. Reading state is a private
localStorage marker.

**Why.** Full-width rows stretched a two-line title across 1300px. Search over
the visible page only would repeat the exact mistake that made client-side
filtering wrong here — it would report a subset as if it were the whole archive.

**Rules out.** Any Notes search or filter that operates on the rendered page
instead of the full collection. Reading state stays local and unmeasured: the
site does not observe what visitors read.

## 2026-07-24 — Notes filters and pagination are routes, not client state

**Decided.** `/notes/`, `/notes/2/`, `/notes/type/<kind>/`, `/notes/type/<kind>/2/`,
and their `/es` counterparts. Each filtered view is its own paginated set.

**Why.** The archive will grow. Lab's client-side facet filter works because Lab
is a single page; applied to a paginated list it would filter only the visible
page and quietly lie about the result. Route-based filtering also works without
JS, is linkable, and is indexable.

**Rules out.** Reusing Lab's filter component for Notes, and any client-side
filtering over a paginated collection. Notes was removed from `[section].astro`
so it can own its routes.

## 2026-07-24 — The form of the writing is the design

**Decided.** `kind` gained `guide`, `decision`, and `reference`. Each type has a
colour token (`--kind-*`), an icon, and its own row structure: a paper sits in a
framed document with its citation count and PDF badge; a guide lists what it
covers, by subpost title; a note stays compact; anything with an image shows a
preview whose shape varies by type.

**Why.** The owner names the archive as "posts, notes, papers, manuals" — the
type is the mental model, and the schema could not express half of it. A reader
should know what kind of object they are looking at before reading a word.

**Rules out.** One card component recoloured per type. Also: a preview
conditioned on type — any entry with an image shows one.

## 2026-07-24 — `supersededBy` closes an existing hole

**Decided.** Notes carry an optional `supersededBy` pointing at the entry that
replaced them; the index renders it as a forward link.

**Why.** `lifecycle: superseded` already existed with nothing to point at, so the
site could tell a reader something was stale and then strand them.

**Rules out.** Marking an entry stale without saying what replaced it.

## 2026-07-24 — Lab requirements are declared, then verified

**Decided.** Lab entries declare `requires`, `downloads`, `steps`, and `surface`
in frontmatter. A client script (`src/lib/capabilities.ts`) probes the visitor's
browser and marks each requirement `supported`, `missing`, or `prompts`.

**Why.** Lab will hold locally-run models, OCR with camera, emulators, and
lookups — not just text transforms. The question every such entry raises is "can
my browser run this, and what will it cost me?", and that had nowhere to live.

**Rules out.** Inferring requirements from the implementation, and user-agent
sniffing. Permission-gated APIs report `prompts` rather than `supported` on
purpose: the API existing is not the user's consent.

## 2026-07-24 — The Lab console is shape-agnostic

**Decided.** `LabConsole.astro` frames the tool with a status bar, an optional
setup panel, and a stage sized by `surface`. An `inputs → outputs` contract is an
optional block, not a structural element.

**Why.** A text-in/text-out spec describes a JSON formatter and nothing else. An
emulator, a camera tool, and a 3D viewer would each break a layout built around
two textareas.

**Rules out.** Per-tool page layouts. Every Lab entry uses this one template and
every block disappears when its data is absent.

## 2026-07-24 — Execution and privacy copy is derived, never written

**Decided.** The "runs in your browser / sends data to X" line reads `execution`
and `sendsDataTo` and prints real hostnames.

**Why.** It was hardcoded to "runs locally, no input is sent to a server" for
every Lab entry regardless of the fields. True for the current eight; a lie the
moment a networked tool ships. `PRODUCT.md` treats accurate execution disclosure
as a non-negotiable brand commitment.

**Rules out.** Any hand-written privacy claim on a Lab surface.

## 2026-07-24 — Lab is organised by facets, not by exclusive groups

**Decided.** One grid plus a filter bar derived from the entries' own
technologies and topics. A tag carried by every entry is dropped from the bar.

**Why.** An entry can belong to several groups; exclusive sections would either
duplicate it or force a false primary category. Considered and rejected:
status-grouped rows, and curated shelves (which need hand-maintained collections
and do not survive thousands of entries).

**Rules out.** Hand-curated Lab groupings.

## 2026-07-24 — One icon registry

**Decided.** `src/lib/icons.ts` holds every icon. Components use
`<Icon>` or `renderIcon()`. No inline `<svg>` in components.

**Why.** Five components had grown their own icon systems at three stroke widths,
and two of them drew the same seven link icons independently.

**Rules out.** Per-component icon maps. The one exception is Lab subject glyphs,
which are per-entry data with a documented fallback chain.

## 2026-07-24 — `src/components/ui/` belongs to shadcn

**Decided.** Project-owned shared components live in `src/components/primitives/`.
`components.json` maps `ui` → `src/components/ui`, so `shadcn add` writes there.

**Why.** Project components in that folder can be overwritten by the CLI.
`brand-mark` and `signal-motif` were already squatting there and were moved.

**Rules out.** Adding anything to `ui/` that shadcn did not generate.

## 2026-07-24 — Section layouts stay structurally distinct

**Decided.** Work, Lab, Notes, and Gallery each get their own index structure.

**Why.** A shared grid recoloured four ways reads as one undifferentiated
archive. Distinct structure tells a returning visitor where they are before they
read a word.

**Rules out.** Refactoring the four indexes onto one shared card component.

## Earlier

- **Editorial visual world replaced with clean modern SaaS + 3D glass hero.**
  The serif/terracotta/newspaper direction was judged a mistake by the owner;
  `DESIGN.md` records the replacement direction. Fraunces is retired.
- **Reading experience (entry detail) rebuilt in four phases** — code
  highlighting, status header + record dossier, active TOC + pager, Mermaid +
  figures + MDX kit.
- **No fabricated metrics, testimonials, or press.** The predecessor site carried
  invented numbers; every count here is derived from validated records.
