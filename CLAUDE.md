# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on port 1234
pnpm build        # Type-check (astro check) then build to dist/
pnpm preview      # Preview the built site
pnpm prettier     # Format all TS/TSX/CSS/Astro files
pnpm test         # Run Vitest tests (tests/**/*.test.ts)
pnpm test:watch   # Run Vitest in watch mode
pnpm test:coverage # Run tests with v8 coverage report
```

Vitest test framework with v8 coverage. Tests live in `tests/**/*.test.ts`. No linter beyond `astro check` (runs as part of `pnpm build`).

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

Cloudflare Pages Functions in `functions/` handle dynamic server-side features:

- `functions/api/newsletter/subscribe.ts` — newsletter subscription via Brevo API (double opt-in, rate limited 5 req/10min per IP)
- `functions/api/reactions/[postId].ts` — post reaction counts stored in Cloudflare KV (rate limited 20 req/hour per IP, CORS restricted to site origin)

### Styling

Tailwind CSS 4 with CSS custom properties. Theme variables are defined in `src/styles/global.css`. Dark mode is toggled via `data-theme` attribute on `<html>`. UI components in `src/components/ui/` follow the shadcn/new-york style.

### Site Configuration

Global constants in `src/consts.ts`: `SITE_URL` (single source of truth for the production URL), `AUTHOR`, `SITE`, `NAV_LINKS`, `SOCIAL_LINKS`. The Astro config (`astro.config.ts`) references `SITE_URL` for the `site` option and sitemap serialization.

### Security

- **Security headers** via `public/_headers` (Cloudflare Pages): CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP, CORP
- **Password protection**: ToolProtection hashes passwords at build time (SHA-256), only the hash is sent to the client. Blog/project password-protected content is sanitized with DOMPurify before rendering.
- **Rate limiting**: Client-side lockout (5 attempts, 30s) on all password forms. Server-side rate limiting on Cloudflare Functions.
- **CORS**: Reactions API restricted to site origin only.

### Path Alias

`@/*` maps to `src/*` — use this for all internal imports.

## Deployment

Push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which runs `withastro/action@v4` and deploys to GitHub Pages. Environment variables are set as GitHub repository variables (`vars.PUBLIC_GOOGLE_ANALYTICS_ID`, `vars.SITE_URL`).
