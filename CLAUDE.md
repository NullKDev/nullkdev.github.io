# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on port 1234
pnpm build        # Type-check (astro check) then build to dist/
pnpm preview      # Preview the built site
pnpm prettier     # Format all TS/TSX/CSS/Astro files
```

No test suite is configured.

## Architecture

**Astro 5 static site** deployed to GitHub Pages. React is used only for interactive islands (search, mobile menu, theme toggle) via `client:idle` directives.

### Content System

Content lives in `src/content/` as MDX/Markdown and is managed via Astro Content Collections. Schemas are defined in `src/content.config.ts`. The four collections are:

- **blog** — posts with optional subposts (multi-part series). A subpost is a file nested under a parent slug directory.
- **projects** — portfolio projects, same nesting support as blog
- **authors** — author metadata referenced by posts
- **photos** — photo albums with camera/preset metadata

All content fetching goes through `src/lib/data-utils.ts`. Key functions: `getAllPosts()` (no drafts, no subposts), `getAllPostsAndSubposts()`, `getAdjacentPosts(id)` (handles parent/child navigation), `getTOCSections()`.

### Routing

File-based routing under `src/pages/`. Dynamic routes use `[...page].astro` for paginated listings and `[...id].astro` for individual entries. The blog and projects sections share the same structural pattern.

API endpoints:
- `src/pages/api/search-index.json.ts` — prerendered search index consumed by the React `SearchButton` component (Flexsearch)
- `src/pages/api/indexnow.ts` — notifies search engines of new content

Cloudflare Pages Functions in `functions/` handle dynamic server-side features (newsletter, post reactions).

### Styling

Tailwind CSS 4 with CSS custom properties. Theme variables are defined in `src/styles/global.css`. Dark mode is toggled via `data-theme` attribute on `<html>`. UI components in `src/components/ui/` follow the shadcn/new-york style.

### Site Configuration

Global constants (site URL, author info, nav links, social links) are in `src/consts.ts`. The Astro config (`astro.config.ts`) sets `output: "static"` and `site: "https://nullkdev.github.io/"`.

### Path Alias

`@/*` maps to `src/*` — use this for all internal imports.

## Deployment

Push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which runs `withastro/action@v4` and deploys to GitHub Pages. `PUBLIC_GOOGLE_ANALYTICS_ID` is set as an environment variable in the workflow.
