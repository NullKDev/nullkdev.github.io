# AGENTS.md

## Commands

```bash
pnpm dev          # Dev server on port 1234
pnpm build        # Type-check (astro check) then build to dist/
pnpm preview      # Preview dist/ locally
pnpm prettier     # Format TS/TSX/CSS/Astro (no semicolons, single quotes)
pnpm test         # Run Vitest tests (tests/**/*.test.ts)
pnpm test:watch   # Run Vitest in watch mode
pnpm test:coverage # Run tests with v8 coverage report
```

Vitest test framework with v8 coverage. Tests live in `tests/**/*.test.ts`. Coverage target: 80% for encryption.ts, 60% for core utilities.

### Testing Infrastructure

- Unit tests: `tests/unit/`
- Integration tests: `tests/integration/`
- Test setup: `tests/setup.ts` (includes @testing-library/jest-dom)
- Run coverage: `pnpm test:coverage`

## Package Manager

Use **pnpm** exclusively. Lockfile is `pnpm-lock.yaml`. Running `pnpm install` triggers `patch-package` postinstall — do not remove `patches/`.

## Architecture

Astro 6 static site with React islands (`client:idle`). Tailwind CSS 4 via `@tailwindcss/vite` plugin. Deployed to GitHub Pages.

### Content Collections

Four collections defined in `src/content.config.ts`: `blog`, `projects`, `photos`, `authors`. Subposts/subprojects are nested directories (e.g. `src/content/blog/my-post/part-1.md`).

**Never call `getCollection()` directly from pages.** Always use functions from `src/lib/data-utils.ts` (e.g. `getAllPosts()`, `getAdjacentPosts()`). This is the single source of truth for content fetching.

### Key Files

- `src/consts.ts` — site URL, author info, nav links, social links, analytics
- `src/content.config.ts` — Zod schemas for all content collections; new fields go here first
- `src/lib/data-utils.ts` — all content fetching functions
- `src/layouts/Layout.astro` — root layout for every page; accepts `class` prop for max-width

### Routing

File-based under `src/pages/`. `[...page].astro` = paginated listing, `[...id].astro` = individual entry (supports subposts).

### Path Alias

`@/*` maps to `src/*`. Always use for internal imports.

## i18n

Bilingual EN/ES. Two separate mechanisms:

1. **Content** — folder suffix convention: `my-post/` (EN) vs `my-post.es/` (ES). Spanish routes live under `src/pages/es/`. Only blog, projects, and photos have `/es/*` routes — static pages (about, tools) use in-place JS toggle.
2. **UI strings** — `src/i18n/en.ts` and `es.ts`. Use `data-i18n="key"` (textContent), `data-i18n-html="key"` (innerHTML), `data-i18n-title`, `data-i18n-aria`, `data-i18n-placeholder` attributes. Always add keys to both `en.ts` and `es.ts`.

## Skills

| Skill | Description | Trigger |
|-------|-------------|---------|
| astro | Astro framework patterns, content collections, SSG | .astro files, islands, content collections |
| seo | SEO optimization, meta tags, sitemap | "improve SEO", meta tags |
| accessibility | WCAG 2.2 a11y audit | "improve accessibility", a11y |
| tailwind-css-patterns | Tailwind CSS v4 styling | styling, responsive layouts |
| frontend-design | Production-grade frontend UI | web components, UI design |
| shadcn | shadcn/ui component management | components.json, --preset |
| nodejs-backend-patterns | Node.js backend patterns | Express/Fastify servers |
| nodejs-best-practices | Node.js principles and decisions | async patterns, security |
| typescript-advanced-types | TypeScript generics and types | complex type logic |
| vercel-composition-patterns | React composition at scale | compound components |
| vercel-react-best-practices | React/Next.js performance | React optimization |

## Tool Pages

- `/tools/json-formatter` — JSON formatter & validator
- `/tools/yaml-validator` — YAML validator
- `/tools/base64-encoder` — Base64 encoder/decoder
- `/tools/password-generator` — Secure password generator
- `/tools/docker-converter` — Docker to Kubernetes converter
- `/tools/ascii-converter` — ASCII/Unicode converter
- `/tools/ip-dns-lookup` — IP & DNS lookup tool
- `/tools/subnet-calculator` — Subnet calculator

## Server Functions

`functions/api/` contains Cloudflare Pages Functions (newsletter, reactions). These are **not** Astro API routes — they run server-side on Cloudflare Pages only.

## Conventions

- Prettier: no semicolons, single quotes, auto-organize imports
- React components use `client:idle` — never render React without a hydration directive
- Tools pages: prefer pure Astro; use React island only for complex state
- Dark mode via `data-theme` attribute on `<html>`
- CSS variables defined in `src/styles/global.css`

## Docs

| Page | Description |
|------|-------------|
| docs/README.md | Overview and getting started |
| docs/architecture.md | Project structure and technical decisions |
| docs/content-blog.md | Blog content collection guide |
| docs/content-projects.md | Projects content collection guide |
| docs/content-photos.md | Photos content collection guide |
| docs/content-schema.md | Content schema reference |
| docs/components.md | Reusable UI components |
| docs/styling.md | Tailwind CSS and styling |
| docs/i18n.md | Internationalization guide |
| docs/tools.md | Tool pages development |
| docs/seo.md | SEO optimization guide |
| docs/deployment.md | GitHub Pages deployment |

## Content Protection

Content can be password-protected using frontmatter:
- `protected: true` — Enable protection
- `passwordHash: "sha256..."` — Hashed password (recommended)
- `password: "secret"` — Password plaintext (demo mode only)
- `protectionMessage: "Enter password"` — Custom message

**Security**: Use `passwordHash` for production. Hash with SHA-256 at build time or use environment variables. The `password` field exists for demo purposes only.
