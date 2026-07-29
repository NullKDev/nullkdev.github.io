# Astro 7 Foundation

## Runtime and routes

The site is an Astro 7 static build for GitHub Pages. English is canonical and unprefixed; Spanish records render only under `/es`. UI dictionaries are typed in `src/i18n/`, and `getLocalizedPath()` removes or applies the locale prefix without translating content implicitly.

The root shell uses CSS variables through Tailwind CSS 4. Theme selection is applied by a small inline bootstrap before paint, stored as an explicit `light` or `dark` preference, and otherwise follows the operating-system preference. Public pages are Astro-first. React is reserved for the local Lab workspace and unlock form.

## UI system

The component boundary is deliberate:

- `src/components/primitives/` owns project-authored shared UI: `Icon`, `StatusChip`, `Breadcrumb`, `Pagination`, `BrandMark`, `SignalMotif`. These are the only components with no domain knowledge.
- `src/components/ui/` belongs to **shadcn**. `components.json` maps the `ui` alias here, so the CLI writes into it and may overwrite. Never put project components in it. It currently holds only `button.tsx`.
- `src/components/` owns semantic Astro composition such as the header, home, and section shells.
- `src/components/{lab,notes,gallery}/` own one domain each: its index, its card, and anything only that section uses.
- Focused stateful React domains remain the island convention: `components/lab/` for local transformations and `components/protection/` for protected-content state. Create another focused domain only when a feature has a real hydration boundary; do not duplicate every primitive in Astro and React.
- **Never write an inline `<svg>` in a component.** Every icon is mapped in `src/lib/icons.ts` and renders through `<Icon>` or `renderIcon()`. The registry resolves **Lucide** (interface marks, normalised to this site's 1.7 stroke) and **Simple Icons** (brand logos) at build time via `@iconify/utils`; `@iconify-json/lucide`, `@iconify-json/simple-icons` and `@iconify/utils` are devDependencies and never reach the browser. The one deliberate exception is `src/components/lab/lab-icons.ts`, whose per-entry glyphs are content, not chrome.

`components.json` is valid metadata for possible future shadcn code generation against Tailwind CSS 4, `src/styles/global.css`, CSS variables, and the real `@components`, `@ui`, and `@lib` aliases. It does not mean shadcn or its CLI is installed. The current button admits only the utilities it consumes: CVA, `clsx`, `tailwind-merge`, and Radix Slot.

TypeScript is the editor and Astro/Vite alias source of truth. Vitest mirrors aliases explicitly because its project config does not consume all TypeScript path mappings automatically. Available prefixes are `@`, `@components`, `@ui`, `@layouts`, `@lib`, `@content`, `@styles`, `@i18n`, `@data`, `@assets`, and `@hooks` (defined but not yet used).

The visual identity is a clean, modern product surface — an airy neutral canvas, one indigo accent, and an emerald signal colour kept from the systems metaphor. It deliberately replaced an earlier editorial world (serif display, terracotta, newspaper rules); see `DESIGN.md` for the direction and why it changed.

**Switzer** carries display, headings, UI, and body; **IBM Plex Mono** is reserved for technical accents — labels, metadata, counts, and code. Both are vendored with their licenses under `public/fonts/`, declared through `@font-face`, and requested only from the site origin. `@font-face` currently requests exactly two files: `switzer-variable.woff2` and `ibm-plex-mono-regular.woff2`. `src/assets/brand/` and `public/visuals/` contain first-party SVGs used by the shell and Gallery. The editable social-card source and generated 1200×630 PNG live under `public/og/`. Palette, elevation, focus, selection, and diagram accents are centralized in `src/styles/global.css`; archive composition lives in `src/styles/archive.css`.

## Content folders

Each parent domain follows this layout:

```text
src/content/<work|lab|notes|gallery>/stable-entry-name/
├── index.md
├── index.es.md
├── items.yml        gallery only — one record per asset
├── assets/
└── content/
    ├── architecture.md
    └── architecture.es.md
```

Gallery is the one collection whose items are not in frontmatter: `items.yml`
feeds the `galleryItems` collection through a custom Astro loader, and one
manifest serves both locales. `bun run gallery:scan` appends a stub per new
asset with the facts a machine can read (size, format, dimensions, and a 16px
WebP placeholder), leaving a literal `TODO` wherever a human is required.

Parent collections load only `index.md`, `index.es.md`, `index.mdx`, and `index.es.mdx`. The shared `documents` collection loads only records below `content/`. README files and templates therefore cannot become entries accidentally. Parent frontmatter owns public identity, routes, locale, lifecycle, and the ordered child manifest, including each localized child slug. The integrity gate loads actual child records and validates bidirectional domain, parent, locale, ID, slug, order, visibility, duplicate, missing, extra, and orphan contracts.

All pages read records through `src/lib/content.ts`; pages must not call `getCollection()` directly. Route counterparts resolve through `translationKey`, not translated-slug assumptions. To add an entry, copy the shape of an existing record, replace all stable IDs, keep translated records independent, and run `bun run test:content` followed by `bun run build`. Never put implementation components in Lab frontmatter; bind `implementationId` values in `src/implementations/lab.ts`.

## Public route map

- `/work`, `/lab`, `/notes`, `/gallery`, and `/about` are the primary archive.
- Notes additionally owns `/notes/:page`, `/notes/type/:kind/:page`, and `/notes/topic/:topic/:page`, because filtering a paginated collection on the client would filter only the visible page and misreport the result. `/notes-search.json` is a build-time index so search covers the whole collection.
- `/uses`, `/stack`, `/tags`, and `/colophon` are supporting indexes.
- `/:domain/:slug` renders public records or generated protected manifests.
- `/:domain/:slug/:document` renders ordered nested records.
- Spanish counterparts use the same shapes under `/es` and may have independent slugs.
- `/rss.xml`, `/robots.txt`, sitemap output, and `/404.html` cover discovery and failures.
- Known legacy `/blog`, `/projects`, `/tools`, and `/photos` routes emit accessible noindex compatibility pages with canonical targets and visible explanations. Retired demos and unverified photos are not restored.

## Local Lab tools

The eight Lab records bind to one keyboard-accessible React workspace. Algorithms live in `src/lib/tools.ts` and do not execute input or send it to a server. All string tools enforce a 64 KB UTF-8 input limit and a 256 KB output limit before synchronous amplification; Unicode inspection additionally caps code points. Errors are typed and localized by the workspace. The server-rendered submit action remains disabled until hydration, and Astro provides a localized no-JavaScript explanation. Docker conversion accepts only explicitly supported flags and emits a constrained Kubernetes Deployment and optional Service; it is not production cluster configuration.

## Performance contracts

`bun run build` finishes with route-weight, link, metadata, and leak gates. `scripts/check-performance-budgets.ts` discovers Astro island component/renderer modules, recursively follows JavaScript and CSS imports, and reports gzip-equivalent HTML, JavaScript, CSS, font, and image totals for Home, index, record, Gallery, and Lab classes. Measured 2026-07-25 (gzip): gallery ≈130 KB, index ≈133 KB, record ≈207 KB, Lab ≈223 KB with 93 KB of JavaScript, and home ≈242 KB. Fonts are ≈92 KB of every route — still the largest fixed cost, and already WOFF2, so the remaining lever is loading fewer faces rather than smaller ones. Treat these as a snapshot: the budgets in the script, not this paragraph, are the contract. `check-built-links.ts` crawls every emitted HTML file, while `check-built-metadata.ts` validates robots, RSS, sitemap/noindex separation, JSON-LD, PNG social metadata, and hreflang.

## Vendored fonts

`public/fonts/` holds exactly what `@font-face` requests, plus the licence each
vendored file obliges us to carry:

| File                          | Size  | Requested by                               |
| ----------------------------- | ----- | ------------------------------------------ |
| `switzer-variable.woff2`      | 43 KB | `--font-sans`, preloaded in `Layout.astro` |
| `ibm-plex-mono-regular.woff2` | 49 KB | `--font-mono`                              |

**Nothing else belongs here.** `public/` is copied to `dist/` wholesale, so an
unreferenced file ships on every deploy — and the route budgets will not catch
it, because they count only the fonts a route actually loads. That blind spot let
`fraunces-variable.ttf` (352 KB, retired with the editorial visual world) and
`switzer-variable.ttf` (138 KB, superseded by the WOFF2) sit in production
unnoticed. Both were deleted on 2026-07-25, along with the Fraunces licence.
When a font is retired, delete the file in the same change.

Both are WOFF2 only, with no TTF fallback — every browser that can run this site
has supported WOFF2 since 2016. IBM Plex Mono was converted from a 173 KB TTF on
2026-07-25 (`fontTools`, `DSIG` dropped since the signature does not survive a
re-write); all 1049 code points were kept.

**Do not subset IBM Plex Mono.** The Lab's Unicode inspector renders arbitrary
code points supplied by the visitor, so any subset guarantees fallback glyphs in
the one place where the glyph itself is the content.

## Deployment gate

`.github/workflows/deploy.yml` is the single verification and Pages workflow. Format, application-scoped lint, Astro diagnostics, coverage, normal build gates, and a fresh protected-fixture Playwright build must pass before a least-privilege production artifact job runs. Only the final deploy job receives Pages and OIDC write permissions.

## Static encrypted content

Static encryption is an accepted deterrent, not authorization. Ciphertext, KDF parameters, and encrypted assets are public. Anyone can download them and attempt offline password guessing. Confidential material requiring access control must use an authenticated service or remain unpublished.

Public collection entries contain metadata stubs only:

```yaml
protection:
  mode: encrypted
  keyId: client-field-notes
  unlockMessageKey: protection.work
  publicPreview: Optional public summary.
```

Private sources live in ignored `.private-content/<entryId>/<en|es>/index.md`, with optional `assets/`. Use `.private-content.example/` as the safe shape reference. Private frontmatter accepts only `entryId`, `locale`, and public `keyId`; password, hash, salt, secret, or key material causes generation to fail.

Set the secret in memory for the build shell:

```sh
export PRIVATE_CONTENT_KEY_CLIENT_FIELD_NOTES='a long passphrase from a secret manager'
bun run build
```

The generator uses native Web Crypto with PBKDF2-HMAC-SHA-256 at 600,000 iterations, a random 16-byte salt, AES-256-GCM, and a random 12-byte IV. AAD binds envelope version, entry, locale, payload kind, and content type. There is no separate password hash. `marked` renders trusted local Markdown at build time and `yaml` parses the minimal frontmatter; this two-package build-only pipeline avoids a larger unified plugin graph. Private asset names become opaque IDs before any manifest is emitted.

`bun run private:scan` checks all of `dist`, including feeds, sitemap, JSON, and bundles, for configured plaintext markers, private asset names, and serialized credential/hash/key fields. The public KDF salt is intentionally allowed inside versioned envelopes. Put unique expected markers in `.private-content/.leak-markers`, one per line. The scan cannot prove cryptographic authorization; it proves only that configured plaintext did not enter the generated output.

## Commands

```sh
bun install --frozen-lockfile
bun run format:check
bun run lint
bun run check
bun run test
bun run test:content
bun run test:coverage
bun run gallery:scan
bun run build
bun run test:e2e
```
