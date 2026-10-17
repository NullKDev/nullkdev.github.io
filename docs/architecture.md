# Architecture

How this site is put together, and the rules that keep it that way. If a change
breaks one of the rules below, the rule is wrong or the change is — resolve that
before merging, don't route around it.

## The shape

Content is data. Pages are projections of that data. Nothing in between invents
facts.

```
src/content/<domain>/<entry>/index[.es].md   typed records, the source of truth
        │
        ▼
src/content.config.ts                        Zod schemas — the contract
        │
        ▼
src/lib/*.ts                                 derivation layer (no rendering)
        │
        ▼
src/components/                              presentation (no data fetching)
        │
        ▼
src/pages/                                   routing only
```

### Rules

1. **Pages never call `getCollection()`.** All reads go through `src/lib/content.ts`.
   A page that fetches its own data is a page that will drift from every other page.
2. **Components never fetch.** They receive typed entries as props. The one
   exception is `EntryPage.astro`, which resolves relationships and neighbours —
   that is a known wart, not a pattern to copy.
3. **Derived values live in `src/lib/`, never inline in a component.** Counts,
   tones, related entries, byte formatting, capability probes. If two components
   would compute the same thing, it belongs here.
4. **Never hand-enter a count or a claim.** Every number on the site is derived
   from validated records at build time. See `PRODUCT.md` — "evidence before claims"
   is binding, not aspirational.
5. **New content fields go in `content.config.ts` first**, with a default, so
   existing entries stay valid and the UI can treat the field as optional.

## Directory map

| Path | What lives here |
|---|---|
| `src/content/` | Typed records: `work`, `lab`, `notes`, `gallery`, `galleryItems`, `documents` |
| `src/content.config.ts` | Zod schemas for every collection. See [content-schema.md](content-schema.md) |
| `src/data/taxonomy.ts` | Controlled vocabularies (domains, surfaces, topics, technologies) |
| `src/data/brand.ts` | The public name, written once. **Not the address** — the host, the GitHub URLs and the storage identifiers stay `nullkdev` and must never be renamed with it |
| `src/data/about.ts` | The About record: positions, products and their distribution channels, capabilities, credentials |
| `src/components/primitives/` | Project-owned shared UI (`Icon`, `StatusChip`, `Breadcrumb`, `BrandMark`) |
| `src/components/ui/` | **shadcn only.** `shadcn add` writes here and may overwrite — never put project components in it |
| `src/components/{lab,notes,gallery}/` | One folder per domain; the index, its card, and anything only that section uses |
| `src/components/entry/` | Long-form furniture shared by `EntryPage` and `DocumentPage`: the outline, evidence and relationship blocks, and the reading tools (diagram toolbar, progress bar, image viewer) |
| `src/components/mdx/` | An authoring kit for `.mdx` entries (`Callout`, `Figure`, `ReadmeCard`, `BenchmarkBars`). A component here is kept even while no entry uses it |
| `src/i18n/` | UI strings (`en.ts`, `es.ts`) and label registries (`archive.ts`) |
| `src/styles/` | `global.css` (tokens, base, shell) and `archive.css` (primitives every page shares), both loaded by `Layout`; `sections/*.css` holds one stylesheet per surface, imported by the component that renders it |
| `src/pages/` | File-based routes; EN unprefixed, ES under `/es` |

### Stylesheets per surface

A page ships `global.css` and `archive.css` plus only the section sheets its
route imports — the home page never downloads the notes index or the lab
console. A rule used by one surface goes in that surface's
`src/styles/sections/<surface>.css`; a rule two unrelated surfaces share stays
in `archive.css`. Keep every sheet under ~800 lines.

The component that owns a surface imports, in this order:

```astro
import '@/styles/global.css'
import '@/styles/archive.css'
import '@/styles/sections/notes.css'
```

The first two lines are not redundant. Astro emits a page's CSS from the
shallowest module first, so a sheet imported by `NotesIndex` would otherwise
land **before** `Layout`'s and lose every equal-specificity tie to it. Importing
the shared sheets first pins them ahead; Vite still ships them once.

Order between two section sheets on the same route is decided by the bundler,
not by the import list, so two sheets on one route must never compete for the
same element at the same specificity. The colophon lives in `prose.css` for
that reason: it is a `.prose` variant and its overrides must follow `.prose`.

### The derivation layer — `src/lib/`

Everything a component would otherwise recompute. If two components would
derive the same value, it belongs here.

| Module | Owns |
|---|---|
| `content.ts` | **The only place collections are read.** Entry lookup, counterparts, adjacency, relationships, and `assertTrackedContentIntegrity()` |
| `status.ts` | `getLifecycleTone()` — every collection's lifecycle vocabulary onto one shared tone |
| `icons.ts` | The single icon registry, and the only seam to the icon packs (Lucide · Simple Icons). **No inline `<svg>` in components** |
| `lab.ts` | Execution tone, `sendsDataTo` hostnames, `formatBytes`, download totals, related entries |
| `capabilities.ts` | Runtime browser capability probe (feature detection, never user-agent) |
| `notes.ts` | Type/topic facets, `NOTES_PER_PAGE`, `getNotesMeta()` (reading time + subpost titles in one pass), `getSupersededBy()` |
| `reading-log.ts` | Private localStorage record of when each note was opened, and `read` / `revised` state |
| `outline.ts` | The "In this record" outline — one `h2`–`h3` rule for an entry and for a subpost on its own URL |
| `structured-data.ts` | Every page's schema.org JSON-LD: `Article`/`TechArticle` for entries and subposts (with author and banner image), `CollectionPage`, `WebPage`, `WebSite`, `Person` |
| `entry-enhancements.ts` · `diagram-viewer.ts` | Browser-side reading tools for long-form pages, mounted once through `mountEntryEnhancements()` |
| `about.ts` | Career derivation — years of practice from `careerStart`, position periods and durations. **No figure on the About page is typed by hand** |
| `gallery.ts` | `isMedia` / `isFile` type guards (`Array.filter` does not narrow a discriminated union); `summarizeGallery` sheets and totals for the index (read through `getGallerySheets` in `content.ts`); `resolveGalleryImage` maps an `items.yml` path to its imported raster so `astro:assets` can resize it |
| `archive-routes.ts` · `rss.ts` · `protection/` | Path building, feed ordering, and the encrypted-content pipeline. Every locale prefix goes through `getLocalizedPath()` in `src/i18n/index.ts`; `/es` is never written by hand |
| `legacy-routes.ts` | `getLegacyStaticPaths(section, locale)` — the one `getStaticPaths` behind all eight `/blog`, `/projects`, `/tools`, `/photos` compatibility routes |

### Build scripts — `scripts/`

Registered in `package.json` and chained into `bun run build`.

| Script | Does |
|---|---|
| `gallery:scan` | Appends `items.yml` stubs for new assets with machine-known facts (size, format, dimensions, `lqip`); backfills placeholders |
| `gallery:copy` | Publishes `src/content/gallery/*/assets/` to `dist/gallery/<collection>/`. Pages display rasters through `astro:assets` (AVIF/WebP at several widths); the copy serves what links to the authored path — files, videos, vectors, an entry's `image` |
| `private:generate` · `private:copy` · `private:scan` | Encrypted-content pipeline and leak scan |
| `performance:check` | Per-route gzip budgets for total, JS, CSS, images, fonts |
| `banners:build` · `banners:check` | Renders every banner from `src/data/banners.ts` into SVG + PNG; verifies all are 1200×630 |
| `csp:apply` | Seals each page's CSP with SHA-256 hashes of the inline scripts this archive expects (`<head>` scripts, Astro's hydration runtime, and `data-csp-inline` opt-ins); any other executable inline script fails the build. Component scripts are never inline — `assetsInlineLimit` in `astro.config.mjs` keeps them `/_astro/*.js` files |
| `links:check` · `metadata:check` | Built-link crawl, and metadata/RSS/sitemap/JSON-LD/hreflang checks — including that every page shares its own image |
| `commits:check` | Commit subjects and PR titles against the convention (not chained into the build; runs in CI and locally) |

### One origin — `site.config.mjs`

The site origin resolves in exactly one module: `SITE_URL` from the environment,
else `http://localhost:4321` under `astro dev`, else production. Astro's `site`,
the JSON-LD manifest URLs, `robots.txt` and the metadata checker all read it.

It was previously hardcoded in six places, one inside a regex, which is how
`robots.txt` kept advertising a domain the rest of the build had already left.

## Route families

Most sections are one index plus one detail route. **Notes is the exception**
and owns its own routes, because filters and pagination there are real URLs:

```
/notes/  ·  /notes/2/
/notes/type/<kind>/  ·  /notes/type/<kind>/2/
/notes/topic/<topic>/  ·  /notes/topic/<topic>/2/
/notes-search.json                      build-time index for client search
```

with `/es` counterparts throughout. Filtering a paginated collection on the
client would filter only the visible page and misreport the result, so both
axes are routes. `[section].astro` explicitly excludes `notes` for this reason.

## Islands

React is used only where something genuinely runs in the browser: the Lab
workbench and protected-content unlocking. Everything else is static Astro.
An island always gets a hydration directive and a no-JS fallback.

## i18n

Two independent mechanisms, do not mix them:

- **Content** — separate records per locale (`index.md` / `index.es.md`) linked by
  `translationKey`. Spanish slugs are translated (`/es/lab/calculadora-subred/`).
  A missing translation stays missing; English never leaks under a `/es` URL.
- **UI strings** — `src/i18n/en.ts` and `es.ts`, same shape, enforced by the
  `Dictionary` type. Controlled-vocabulary labels live in `src/i18n/archive.ts`.

## Static-host boundary

GitHub Pages. No SSR, no runtime secrets, no response headers, no real
authorization. Content protection is a deterrent, and the copy must say so.
Any privacy claim on a page must be derived from data (see the Lab `execution`
field), never written by hand.

## Verification

`bun run build` runs, in order: type-check, build, private-content copy, leak
scan, performance budgets, built-link crawl, and metadata/RSS/sitemap/hreflang
checks. A green build means all of those passed.
