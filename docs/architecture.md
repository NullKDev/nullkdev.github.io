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
│   └── api/            # Prerendered JSON endpoints
├── styles/
│   ├── global.css      # Tailwind import + CSS variables + fonts
│   └── typography.css  # Prose typography overrides
└── consts.ts           # Site-wide constants (SITE, AUTHOR, NAV_LINKS)
```

## Routing

Astro uses file-based routing. Key patterns:

| Pattern | Purpose | Example URL |
|---|---|---|
| `[...page].astro` | Paginated listing | `/blog/2` |
| `[...id].astro` | Individual entry (supports subposts) | `/blog/my-post/part-1` |
| `[id].astro` | Single item | `/photos/my-album` |
| `es/blog/[...id].astro` | Spanish version of entry | `/es/blog/my-post` |

### Spanish Routes

Spanish content lives under `src/pages/es/`. Only blog, projects, and photos have `/es/*` routes — static pages (about, tools) use the i18n JS toggle in place.

## Key Files

### `src/consts.ts`
Global configuration: site URL, author info, nav links, social links, analytics ID placeholder.

### `src/content.config.ts`
Defines the four Astro Content Collections (`blog`, `projects`, `photos`, `authors`) with their Zod schemas. Any new field must be declared here first.

### `src/lib/data-utils.ts`
**Single source of truth for all content fetching.** Never call `getCollection()` directly from pages — always use a function from this file. Key functions:

| Function | Returns |
|---|---|
| `getAllPosts()` | EN parent posts only (no drafts, no subposts, no translations) |
| `getAllPostsAndSubposts()` | EN posts including subposts |
| `getAllEsPostsAndSubposts()` | ES translated posts |
| `getSubpostsForParent(id)` | Subposts of a given parent, sorted |
| `getAdjacentPosts(id)` | Prev/next for a post or subpost |
| `getTOCSections(id)` | TOC data including subposts |
| `isSubpost(id)` | `true` if ID contains `/` |
| `isTranslation(id)` | `true` if root segment ends in `.es` |
| `getBaseSlug(id)` | Strips locale suffix (`slug.es/sub` → `slug/sub`) |
| `getLocaleId(id, locale)` | Adds locale suffix (`slug` → `slug.es`) |
| `getPostUrl(id, locale)` | Builds correct URL for a post |

Same pattern exists for projects (`getAllProjects`, `getSubProjectsForParent`, etc.) and photos (`getAllPhotos`, `getAlbumImages`, etc.).

## Layout

`Layout.astro` is the single root layout used by all pages. It:
- Imports global CSS and typography
- Renders `<Header>`, `<Footer>`
- Injects the i18n translation engine (see [i18n.md](./i18n.md))
- Accepts `class` prop for max-width control (e.g. `<Layout class="max-w-4xl">`)
- Accepts `hideFloatingSidebar` prop

## React Islands

React is used only for interactive components that need client-side state. They are loaded with `client:idle` to avoid blocking render. Current React components live in `src/components/` and are typically tool pages or search.

## Search

`src/pages/api/search-index.json.ts` is a prerendered endpoint that builds a Flexsearch index from all posts and projects at build time. The `SearchButton` React component fetches this JSON and queries it client-side.

## Path Alias

`@/*` maps to `src/*`. Always use this for internal imports:

```ts
import { getAllPosts } from '@/lib/data-utils'
import Layout from '@/layouts/Layout.astro'
```
