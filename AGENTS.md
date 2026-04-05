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

Vitest test framework with v8 coverage. Tests live in `tests/**/*.test.ts`. No linter beyond `astro check` (runs as part of `pnpm build`).

## Package Manager

Use **pnpm** exclusively. Lockfile is `pnpm-lock.yaml`. Running `pnpm install` triggers `patch-package` postinstall — do not remove `patches/`.

## Architecture

Astro 5 static site with React islands (`client:idle`). Tailwind CSS 4 via `@tailwindcss/vite` plugin. Deployed to GitHub Pages.

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

## Server Functions

`functions/api/` contains Cloudflare Pages Functions (newsletter, reactions). These are **not** Astro API routes — they run server-side on Cloudflare Pages only.

## Conventions

- Prettier: no semicolons, single quotes, auto-organize imports
- React components use `client:idle` — never render React without a hydration directive
- Tools pages: prefer pure Astro; use React island only for complex state
- Dark mode via `data-theme` attribute on `<html>`
- CSS variables defined in `src/styles/global.css`

## Docs

See `docs/` for detailed guides on content writing, i18n, tools, SEO, deployment, and components.
