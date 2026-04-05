# Architecture

## Directory Structure

```
src/
├── components/         # Reusable Astro/React components
├── content/            # Content collections (blog, projects, photos, authors)
│   ├── blog/
│   ├── projects/
│   ├── photos/
│   └── authors/
├── i18n/               # Translation dictionaries
│   ├── en.ts           # English (source of truth)
│   └── es.ts           # Spanish
├── layouts/
│   └── Layout.astro    # Root layout — injects i18n engine, theme toggle
├── lib/
│   ├── data-utils.ts   # All content fetching functions
│   ├── encryption.ts   # AES encrypt/decrypt, SHA-256 hash, PBKDF2 slow hash
│   └── utils.ts        # Shared utilities (cn, readingTime, etc.)
├── pages/              # File-based routing
│   ├── index.astro
│   ├── about.astro
│   ├── blog/
│   ├── projects/
│   ├── photos/
│   ├── tools/
│   ├── es/             # Spanish routes (blog, projects, photos)
│   ├── tags/
│   ├── authors/
│   └── api/            # Prerendered JSON endpoints (search-index)
├── styles/
│   ├── global.css      # Tailwind import + CSS variables + fonts
│   └── typography.css  # Prose typography overrides
└── consts.ts           # Site-wide constants (SITE_URL, SITE, AUTHOR, NAV_LINKS)

functions/              # Cloudflare Pages Functions (server-side only)
├── api/
│   ├── newsletter/
│   │   └── subscribe.ts
│   └── reactions/
│       └── [postId].ts

public/
├── _headers            # Security headers for Cloudflare Pages
└── ...                 # Static assets (favicon, fonts, images)
```

## Routing

Astro uses file-based routing. Key patterns:

| Pattern                 | Purpose                              | Example URL            |
| ----------------------- | ------------------------------------ | ---------------------- |
| `[...page].astro`       | Paginated listing                    | `/blog/2`              |
| `[...id].astro`         | Individual entry (supports subposts) | `/blog/my-post/part-1` |
| `[id].astro`            | Single item                          | `/photos/my-album`     |
| `es/blog/[...id].astro` | Spanish version of entry             | `/es/blog/my-post`     |

### Spanish Routes

Spanish content lives under `src/pages/es/`. Only blog, projects, and photos have `/es/*` routes — static pages (about, tools) use the i18n JS toggle in place.

## Key Files

### `src/consts.ts`

Global configuration: `SITE_URL` (single source of truth for the production URL, no trailing slash), `AUTHOR`, `SITE`, `NAV_LINKS`, `SOCIAL_LINKS`, `UI`. All URL-dependent values derive from `SITE_URL`.

### `src/content.config.ts`

Defines the four Astro Content Collections (`blog`, `projects`, `photos`, `authors`) with their Zod schemas. Any new field must be declared here first.

### `src/lib/data-utils.ts`

**Single source of truth for all content fetching.** Never call `getCollection()` directly from pages — always use a function from this file. Key functions:

| Function                     | Returns                                                        |
| ---------------------------- | -------------------------------------------------------------- |
| `getAllPosts()`              | EN parent posts only (no drafts, no subposts, no translations) |
| `getAllPostsAndSubposts()`   | EN posts including subposts                                    |
| `getAllEsPostsAndSubposts()` | ES translated posts                                            |
| `getSubpostsForParent(id)`   | Subposts of a given parent, sorted                             |
| `getAdjacentPosts(id)`       | Prev/next for a post or subpost                                |
| `getTOCSections(id)`         | TOC data including subposts                                    |
| `isSubpost(id)`              | `true` if ID contains `/`                                      |
| `isTranslation(id)`          | `true` if root segment ends in `.es`                           |
| `getBaseSlug(id)`            | Strips locale suffix (`slug.es/sub` → `slug/sub`)              |
| `getLocaleId(id, locale)`    | Adds locale suffix (`slug` → `slug.es`)                        |
| `getPostUrl(id, locale)`     | Builds correct URL for a post                                  |

Same pattern exists for projects (`getAllProjects`, `getSubProjectsForParent`, etc.) and photos (`getAllPhotos`, `getAlbumImages`, etc.).

## Layout

`Layout.astro` is the single root layout used by all pages. It:

- Imports global CSS and typography
- Renders `<Header>`, `<Footer>`
- Injects the i18n translation engine (see [i18n.md](./i18n.md))
- Accepts `class` prop for max-width control (e.g. `<Layout class="max-w-4xl">`)
- Accepts `hideFloatingSidebar` prop

## React Islands

React is used only for interactive components that need client-side state. They are loaded with `client:idle` to avoid blocking render. Current React components live in `src/components/react/` and include tool pages, search, password protection, gallery viewer, and toast notifications.

## Search

`src/pages/api/search-index.json.ts` is a prerendered endpoint that builds a Flexsearch index from all posts and projects at build time. The `SearchButton` React component fetches this JSON and queries it client-side.

## Server-Side Functions (Cloudflare Pages only)

`functions/` contains Cloudflare Pages Functions that run server-side, separate from the static build:

| Function                      | Purpose                                | Features                                                    |
| ----------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| `api/newsletter/subscribe.ts` | Brevo double opt-in subscription       | Rate limiting (5 req/10min), error sanitization             |
| `api/reactions/[postId].ts`   | Post reaction counts via Cloudflare KV | Rate limiting (20 req/hour), CORS restricted to site origin |

These functions are **not** part of the GitHub Pages build. They require Cloudflare Pages deployment with appropriate env vars and KV bindings.

## Security

- **Security headers** defined in `public/_headers` (applied by Cloudflare Pages): CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP, CORP
- **Password protection**: `ToolProtection.astro` hashes passwords at build time (SHA-256), only the hash reaches the client. `PasswordProtection.tsx` and `ProjectPasswordProtection.tsx` sanitize decrypted HTML with DOMPurify
- **Rate limiting**: Client-side lockout (5 attempts, 30s) on all password forms. Server-side per-IP rate limiting on Cloudflare Functions
- **CORS**: Reactions API restricted to `SITE_URL` origin only

## Path Alias

`@/*` maps to `src/*`. Always use this for internal imports:

```ts
import { getAllPosts } from '@/lib/data-utils'
import Layout from '@/layouts/Layout.astro'
```
