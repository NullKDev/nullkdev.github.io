# AGENTS.md

Bilingual static archive. **Work** (shipped), **Lab** (runs in the browser),
**Notes** (read), **Gallery** (kept). Astro 7 · Bun · GitHub Pages.

`CLAUDE.md` is a symlink to this file. Document once, here.

## Commands

```bash
bun run dev            # http://localhost:4321
bun run build          # full pipeline; any link failing fails the build
bun run test           # Vitest          · test:content, test:e2e, test:coverage
bun run lint           # ESLint          · format / format:check for Prettier
bun run commits:check  # commit subjects · also `-- --title "<pr title>"`
bun run banners:build  # regenerate every banner SVG + PNG
bun run banners:check  # every banner is 1200x630
bun run gallery:scan   # stub items.yml records for new gallery assets
bun run audit          # dependency advisories
```

Build chain:

```
private:generate → astro check → astro build → gallery:copy → private:copy
  → private:scan → banners:check → csp:apply → performance:check
  → links:check → metadata:check
```

A green build proves: types, no leaked private content, banners 1200×630,
gzip budgets, no broken internal links, valid metadata/RSS/sitemap/JSON-LD/
hreflang, every page sharing its own image, and a CSP whose hashes match the
shipped bytes.

**Bun only.** Lockfile is `bun.lock`.

## Architecture

Content is data; pages are projections. Nothing in between invents facts.

```
src/content/**            typed records (source of truth)
  → src/content.config.ts Zod schemas — the contract
  → src/lib/*.ts          derivation only
  → src/components/       presentation only
  → src/pages/            routing only
```

| Rule | |
|---|---|
| Pages never call `getCollection()` | reads go through `src/lib/content.ts` |
| Components never fetch | they take typed entries as props |
| Derived values live in `src/lib/` | never inline in a component |
| Never hand-enter a count or a claim | derive it from validated records |

`@/*` maps to `src/*`. Use it for every internal import.

Detail: [docs/architecture.md](docs/architecture.md).

### Collections

Six in `src/content.config.ts`: `work`, `lab`, `notes`, `gallery`,
`galleryItems`, `documents`. The last two are sidecars joined to a parent, not
routed on their own.

**Read [docs/content-schema.md](docs/content-schema.md) before adding a field.**
The three status axes — `visibility` / `maturity` / `lifecycle` — must never be
merged.

Notes frontmatter that is easy to get wrong:

| Field | Accepts |
|---|---|
| `maturity` | `seed` · `growing` · `stable` · `archived` |
| `lifecycle` | `current` · `superseded` · `archived` |
| `summary` | ≤180 chars. **Quote it if it contains `": "`** or the YAML fails |
| `featuredRank` | unique per domain **and** locale; the integrity check enforces it |
| `series` | `{ id, order }` — renders prev/next navigation across sibling posts |
| `topics` | ids from `src/data/taxonomy.ts` only |

### Routing

File-based under `src/pages/`. EN unprefixed, ES under `/es`. Notes owns its own
routes because its filters and pagination are real URLs
(`/notes/type/<kind>/2/`). Legacy `/blog/*`, `/projects/*`, `/photos/*`,
`/tools/*` build as `noindex` compatibility pages — not live sections.

## i18n

Two mechanisms; never mix them.

1. **Content** — one record per locale, `index.md` / `index.es.md`, linked by
   `translationKey`. Slugs are translated. A missing translation stays missing:
   English never renders under `/es`, and `hreflang` is emitted only for real
   reciprocal counterparts.
2. **UI strings** — `src/i18n/en.ts` and `es.ts`, identical shape enforced by
   `Dictionary`. Controlled vocabulary in `src/i18n/archive.ts`. Always add the
   key to both.

## Conventions

- Prettier: no semicolons, single quotes, organised imports.
- React only where something genuinely runs in the browser, always with a
  hydration directive and a no-JS fallback.
- Dark mode via `data-theme` on `<html>`; tokens in `src/styles/global.css`.
- Anything that looks actionable works completely and is keyboard-operable, or
  it is omitted.
- `src/components/ui/` belongs to shadcn; project components go in
  `src/components/primitives/`.

## Icons

Every mark resolves from `src/lib/icons.ts` — Lucide (interface) and Simple
Icons (brand), resolved at build, nothing shipped to the browser.

- **Never write an inline `<svg>`.** Map it in the registry, render with
  `<Icon>` / `renderIcon()`.
- **Never hand-draw what a pack already has.** Check the registry first.
- Missing mark → **extend the registry**, so swapping icon sets stays one edit.
- Unicode glyphs are not icons; screen readers announce them.

## Banners

Declared, not drawn. Add a spec to `src/data/banners.ts`, run
`bun run banners:build`.

**Artwork is a motif, not an icon.** `scripts/banner-art.ts` draws the *subject*
— a page parsed into structure, memory past a ceiling, a release reaching its
last stop. A lone registry icon is a category badge: it says which section the
post is filed under and nothing about the post. Registry marks appear **inside**
a motif, at content scale, never floating in a corner.

Four files per banner — two locales × two surfaces:

| Output | Used by |
|---|---|
| `<slug>.svg` · `<slug>-light.svg` | English page, dark / light theme |
| `<slug>-es.svg` · `<slug>-es-light.svg` | Spanish page, dark / light theme |
| `og/banners/<slug>.png` · `<slug>-es.png` | social scrapers, per locale |

**Banner copy is localised** like every other string. Declare `copy: { en, es }`
in the spec — an English banner on a Spanish page is the same failure as an
English heading.

**Never derive banner paths in a component.** `src/lib/banners.ts` owns it:
`getBannerSources(image, locale)` returns the dark, light and social variants,
and `bannerStyle()` produces the `--banner-light` the CSS swap reads. Writing
that inline fixed the entry hero and left five card surfaces rendering English
dark artwork on Spanish light-theme pages.

**Two surfaces, one identity.** Accent, artwork and shadows are identical in
both themes — only the ground and the type invert: deep surface with light type,
pale surface with dark type. A banner stays recognisably the same object.

**A light ground is slate, never near-white.** It was `#F8FAFC`, which measures
**1.05:1** against the `#ffffff` card and **1.01:1** against the page — the
banner's own corner was the surface behind it, so it read as a drawing floating
on the card instead of an object sitting on it. `#E2E8F0` is 1.23:1: an edge
without a frame. Measure a new ground against `--surface-raised` before shipping
it; "it looks light" is not the test.

**Every colour a banner uses is measured, in both themes.** One accent serves
dark and light, so it has to clear **3:1 on all four grounds** — dark base, dark
deep, light base, light tint. Emerald `#059669` cleared three and failed its own
light tint at 2.94:1; `#00875A` clears all four. Type follows the same rule:
light meta is `#55617A`, the site's `--ink-muted`, because `#64748B` on slate is
3.86:1 and only passes as large text.

An `<img>` cannot read `data-theme`, so `EntryPage` passes `--banner-light` on
the figure and CSS swaps the rendered file with `content:`. That keeps it an
image — alt text and the reserved box survive, which a `background-image` would
lose.

Both are required: **X, Facebook, LinkedIn, Slack and WhatsApp render nothing
for an SVG `og:image`.** The identity card `public/og/signal-archive.png` is
generated from `brand` by the same script — never hand-edit it.

**Constraints**

- **1200×630**, always. `banners:check` fails the build otherwise. It is the
  Open Graph size, so one file serves both jobs.
- **Displayed 2.5:1, centre-cropped. Safe band: y=75..555.** Anything that must
  stay legible goes inside it.
- Display ratio is one token, `--banner-ratio` in `src/styles/global.css`.
- **Put the ratio on the `<img>`, never the wrapper.** `height: 100%` against an
  auto-height parent is indefinite; the image falls back to its intrinsic ratio
  and sizes the box it should fit inside.
- Never add a second banner shape. A different crop needs a new token with a
  written reason, not a local `aspect-ratio`.
- Gallery media is not a banner — photos and video keep their own shapes.

## Sharing and search

An entry's preview is **its own banner**. Only home, About and the section
indexes use the identity card. `EntryPage` swaps `/banners/<slug>.svg` for
`/og/banners/<slug>.png`; `check-built-metadata.ts` asserts it.

| Budget | Target |
|---|---|
| `<title>` | ≤60 chars total — the `— CarlosDev` suffix costs 12, leaving ~48 |
| `description` | 50–160 chars |
| Title + description | unique per language |
| Every indexable page | structured data: `Article`/`TechArticle` for entries, `CollectionPage` for indexes and filters, `WebPage` for reference pages, `WebSite`+`Person` for home |

- A title never restates its parent; the breadcrumb, canonical URL and JSON-LD
  already carry the relationship.
- Filter and paginated pages must name their filter and page number.
- `SITE_URL` resolves in `site.config.mjs` and is the **only** place the origin
  is written.

## Verifying your own work

Every rule above exists because something broke invisibly.

- **Check exit codes, not output.** A build piped to `/dev/null` leaves a stale
  `dist/` that reads as success.
- **Measure the rendered box, not the declared value.** `getComputedStyle` can
  report the value you set while the element renders at another.
- **Prove a gate fires** by pushing it past the real number and watching it
  fail. An untested threshold is decoration.
- **A `{/* … */}` between component attributes is invalid** in `.astro` and
  fails with a misleading `ts(1002)`. Put the explanation in the frontmatter.
- **If a check blocks a correct change, fix the check.** A metadata assertion
  once forced every page to share the same preview image.

## Branching

```
feat/… · fix/…  ──PR──▶  dev  ──PR──▶  main  ──▶  deploy + release
```

- **`main` publishes.** Never commit to it directly.
- **`dev` integrates** and is permanent. Do not delete it.
- Branches are short-lived and prefixed with their commit type: `feat/`, `fix/`,
  `refactor/`, `ci/`, `docs/`. Delete once merged.
- Dependabot targets `dev`.

CI verifies pull requests and pushes to `main` only — GitHub builds the
`pull_request` event against the merge result, so verifying `dev` pushes as well
would double every job.

## Commits

```
type(scope): description
```

Verified in CI on every PR **and on the PR title** (a squash merge takes its
subject from the title). Rules live in `scripts/check-commit-messages.ts` and are
unit-tested; run `bun run commits:check` before pushing.

| Part | Requirement |
|---|---|
| type | required, lowercase, from the list below |
| scope | optional, lowercase, `-` and `/` allowed — `(lab)`, `(lib/protection)` |
| `!` | before the colon, marks breaking: `feat(content)!: …` |
| description | required, ≥10 chars, lowercase, no trailing period |
| subject | ≤72 chars |

`feat` · `fix` · `perf` · `refactor` · `security` · `docs` · `style` · `test` ·
`build` · `ci` · `chore` · `revert`

`security` is not standard Conventional Commits; it is kept because the
distinction from a bug fix matters here. If no type fits, it is two changes.

Merge and revert subjects are exempt. The check reads only the commits a PR
adds — earlier history predates the convention.

## Changelog and releases

`CHANGELOG.md` is hand-written. Add your line under `## [Unreleased]` **in the
pull request**, not at release time.

- Only `feat`, `fix`, `perf`, `security`, and `refactor`/`build` with observable
  impact earn a line. `style`, `test`, `ci`, `docs`, `chore` do not — that
  curation is the reason it is not generated.
- An unreleased feature is **one** entry; later corrections fold into it. Once
  shipped in a version, a later fix earns its own line.
- Categories: `Agregado` · `Corregido` · `Rendimiento` · `Cambiado` ·
  `Seguridad` · `Eliminado`. Only non-empty ones appear.

**To release:** move `## [Unreleased]` to `## [x.y.z] — YYYY-MM-DD`, open an
empty `## [Unreleased]` above, bump `version` in `package.json`, merge to
`main`. `release.yml` publishes only when that version has no tag — the bump is
the trigger, not the merge. Notes are generated from commit subjects, which is
what the commit format exists for.

## Content protection

`protection: { mode: 'encrypted', keyId, … }` in frontmatter; pipeline in
`src/lib/protection/` plus the `private:*` scripts.

**A deterrent, not authorization.** A static host has nothing to check a
password against, so protected content is public but obfuscated. Any copy
describing it must say so. `private:scan` fails the build if plaintext reaches
`dist/`.

## Security

- Never commit secrets. Build secrets must not reach HTML, JS, source maps or
  logs.
- PBKDF2 at 600,000 iterations, salted, stored as `base64(salt):hash`.
- CSP is emitted by `src/layouts/Layout.astro` and **sealed after the build** by
  `scripts/apply-csp.ts`, which hashes the inline scripts that shipped. Never
  hand-maintain those hashes.
- `script-src` is `'self'` plus hashes. `'unsafe-inline'` is styles only.
- **Google Analytics is the only third-party origin**, and only when
  `PUBLIC_GOOGLE_ANALYTICS_ID` is set. Any other third-party request is blocked
  and the feature visibly fails — bundle the dependency instead of widening the
  allowlist.
- GitHub Pages cannot set response headers: `frame-ancestors`, HSTS,
  `X-Content-Type-Options` and `Permissions-Policy` are unavailable, and a
  `_headers` file does nothing. See [SECURITY.md](SECURITY.md).
- Workflows must pass `actionlint` and `zizmor`; actions are pinned to SHAs.

## Skills

Invoke before working, matched by file and task.

| Skill | For |
|---|---|
| `astro` | `.astro`, content collections, loaders, SSG routing |
| `impeccable` | any design, redesign, audit or polish |
| `accessibility` | WCAG 2.2; the project targets AA |
| `tailwind-css-patterns` | Tailwind v4 over the token layer |
| `seo` | meta tags, sitemap, structured data |
| `typescript-advanced-types` | schema and generic type work |
| `vitest` · `playwright-best-practices` | unit and end-to-end tests |

## Docs

| Page | Read it when |
|---|---|
| [docs/architecture.md](docs/architecture.md) | adding a page, lib module or component |
| [docs/design-system.md](docs/design-system.md) | building or restyling any UI |
| [docs/content-schema.md](docs/content-schema.md) | adding an entry or a frontmatter field |
| [docs/decisions.md](docs/decisions.md) | before revisiting a settled question |
| [docs/foundation.md](docs/foundation.md) | changing config or the pipeline |
| [PRODUCT.md](PRODUCT.md) | what the site is for |
| [DESIGN.md](DESIGN.md) | how it should look |
| [SECURITY.md](SECURITY.md) | reporting or reasoning about a vulnerability |
