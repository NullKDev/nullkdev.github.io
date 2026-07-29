# AGENTS.md

A bilingual static archive: **Work** (things that shipped), **Lab** (things that
run in your browser), **Notes** (things that are read), **Gallery** (things that
are kept). Astro 7, Bun, GitHub Pages.

## Commands

```bash
bun run dev            # Dev server on http://localhost:4321
bun run build          # Full pipeline — see below
bun run test           # Vitest
bun run test:content   # Content-integrity project only
bun run test:e2e       # Playwright
bun run format         # Format (no semicolons, single quotes); format:check verifies
bun run lint           # ESLint over src, tests, scripts, configs
bun run gallery:scan   # Stub items.yml records for new gallery assets
```

`bun run build` is a chain, and a failure in any link fails the build:

```
private:generate → astro check → astro build → gallery:copy → private:copy
  → private:scan → csp:apply → performance:check → links:check → metadata:check
```

That means a green build already proves: types check, no private content leaked,
per-route gzip budgets hold, no broken internal links, metadata / RSS / sitemap /
JSON-LD / hreflang are all valid, and every page carries a CSP whose script
hashes match the bytes that shipped.

## Package manager

**Bun**, exclusively. The lockfile is `bun.lock`. There is no `pnpm-lock.yaml`
and no `patches/` directory.

## Architecture

Content is data; pages are projections of it. Nothing in between invents facts.

```
src/content/**            typed records (the source of truth)
  → src/content.config.ts Zod schemas — the contract
  → src/lib/*.ts          derivation only, no rendering
  → src/components/       presentation only, no fetching
  → src/pages/            routing only
```

Four rules hold this together:

1. **Pages never call `getCollection()`.** Reads go through `src/lib/content.ts`.
2. **Components never fetch.** They take typed entries as props.
3. **Derived values live in `src/lib/`**, never inline in a component.
4. **Never hand-enter a count or a claim.** Every number is derived from
   validated records at build time.

Full detail in [docs/architecture.md](docs/architecture.md).

### Content collections

Six, in `src/content.config.ts`: `work`, `lab`, `notes`, `gallery`,
`galleryItems`, `documents`. The last two are sidecars — subposts and gallery
assets — joined to their parent rather than routed on their own.

**Read [docs/content-schema.md](docs/content-schema.md) before adding a field.**
It explains the three status axes (`visibility` / `maturity` / `lifecycle`) that
must never be merged, and why each collection is shaped the way it is.

### Routing

File-based under `src/pages/`. EN unprefixed, ES under `/es`.
Most sections are one index plus one detail route; **Notes owns its own routes**
because its type filter, topic filter, and pagination are all real URLs
(`/notes/type/<kind>/2/`). Legacy `/blog/*`, `/projects/*`, `/photos/*`,
`/tools/*` paths still build as compatibility pages that point at the current
record — they are not live sections.

### Path alias

`@/*` maps to `src/*`. Always use it for internal imports.

## i18n

Two independent mechanisms; do not mix them.

1. **Content** — one record per locale, `index.md` and `index.es.md`, linked by
   `translationKey`. Slugs are genuinely translated
   (`/es/lab/calculadora-subred/`). A missing translation stays missing:
   English never renders under a `/es` URL, and `hreflang` is emitted only for
   real reciprocal counterparts.
2. **UI strings** — `src/i18n/en.ts` and `es.ts`, identical shape, enforced by
   the `Dictionary` type. Controlled-vocabulary labels (lifecycle, kinds,
   origins, capabilities) live in `src/i18n/archive.ts`. Always add a key to
   both files.

## Conventions

- Prettier: no semicolons, single quotes, organised imports.
- React only where something genuinely runs in the browser (the Lab workbench,
  protected-content unlock). Always with a hydration directive and a no-JS
  fallback.
- Dark mode via `data-theme` on `<html>`; tokens in `src/styles/global.css`.
- Anything that looks actionable must work completely and be keyboard-operable,
  or it is omitted.

## Skills

Match by file context and task, and invoke before working:

| Skill | Use it for |
|---|---|
| `astro` | `.astro` files, content collections, loaders, SSG routing |
| `impeccable` | Any design, redesign, audit, or polish of a surface |
| `accessibility` | WCAG 2.2 work; the project targets AA |
| `tailwind-css-patterns` | Tailwind v4 styling over the token layer |
| `seo` | Meta tags, sitemap, structured data |
| `typescript-advanced-types` | Schema and generic type work |
| `vitest` · `playwright-best-practices` | Unit and end-to-end tests |

## Docs

Portfolio backup reference: [`backup/PROJECT_ANALYSIS.md`](backup/PROJECT_ANALYSIS.md). Consult it for the backup project's screens, UI states, architecture, content, integrations, risks, and migration priorities.

| Page | Description | Read it when |
|------|-------------|--------------|
| [docs/architecture.md](docs/architecture.md) | Layers, directory map, the rules that keep them | Adding a page, a lib module, or a component |
| [docs/design-system.md](docs/design-system.md) | Tokens, type, the icon registry, primitives, per-section identity | Building or restyling any UI |
| [docs/content-schema.md](docs/content-schema.md) | What each collection models and **why** — the three status axes, per-collection rationale, integrity rules | Adding an entry or a frontmatter field, or wondering why a field exists |
| [docs/decisions.md](docs/decisions.md) | Decision log — what was chosen, why, and what it rules out | Before revisiting a settled question |
| [docs/foundation.md](docs/foundation.md) | Toolchain, aliases, build pipeline | Changing config or the pipeline |
| [PRODUCT.md](PRODUCT.md) | Users, purpose, binding product principles | Any question about what the site is for |
| [DESIGN.md](DESIGN.md) | The visual direction and why it replaced the previous one | Any question about how it should look |

**Two rules that are load-bearing, repeated here so they are not missed:**
- Never write an inline `<svg>` in a component — map it in `src/lib/icons.ts` and render with `<Icon>` / `renderIcon()`. The registry maps intent to a **Lucide** (interface) or **Simple Icons** (brand) icon, resolved at build; both packs are devDependencies and nothing ships to the browser.
- `src/components/ui/` belongs to shadcn; project components go in `src/components/primitives/`.

## Content protection

Entries can be gated with `protection: { mode: 'encrypted', keyId, ... }` in
frontmatter. The pipeline lives in `src/lib/protection/` and the
`private:generate` / `private:copy` / `private:scan` scripts.

**This is a deterrent, not authorization.** The host is static: there is no
server to check a password against, so protected content is public but
obfuscated. Any copy describing it must say so. `private:scan` fails the build
if plaintext leaks into `dist/`.

## Security posture

- Never commit secrets; build secrets must not reach HTML, JS, source maps, or logs.
- PBKDF2 at 600,000 iterations, salted, stored as `base64(salt):hash`.
- CSP is emitted by `src/layouts/Layout.astro` and **sealed after the build** by
  `scripts/apply-csp.ts`, which hashes every inline script that actually shipped.
  Never hand-maintain those hashes — several are content-derived and would rot.
- `script-src` is `'self'` plus hashes. `'unsafe-inline'` is used for styles only.
- **Google Analytics is the only third-party origin, and only when
  `PUBLIC_GOOGLE_ANALYTICS_ID` is set.** `scripts/apply-csp.ts` widens the
  allowlist solely in that case, so a fork or a local build reaches nothing.
- Any *other* third-party request is blocked by the CSP and the feature visibly
  fails. Bundle the dependency instead of widening the allowlist — that is the
  policy working, not a bug in it.
- GitHub Pages cannot set response headers, so `frame-ancestors`, HSTS,
  `X-Content-Type-Options` and `Permissions-Policy` are **not available**. A
  `_headers` file does nothing here. See [SECURITY.md](SECURITY.md).
- `bun run audit` for dependency advisories; `bun run build` for type and leak checks.
- Workflow changes must pass `actionlint` and `zizmor`; actions are pinned to SHAs.
