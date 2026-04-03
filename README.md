# nullkdev.github.io

Personal portfolio and blog of **Carlos Alarcon** ([@NullKDev](https://github.com/nullkdev)) — Android developer specialized in Kotlin, Flutter, and Kotlin Multiplatform.

🌐 **Live site:** [nullkdev.github.io](https://nullkdev.github.io)

---

## Tech Stack

- [Astro 5](https://astro.build) — static site generator
- [React](https://react.dev) — interactive islands (`client:idle`)
- [Tailwind CSS 4](https://tailwindcss.com) — utility-first styling
- [MDX](https://mdxjs.com) — content with components
- [Expressive Code](https://expressive-code.com) — syntax-highlighted code blocks
- [Flexsearch](https://github.com/nextapps-de/flexsearch) — client-side full-text search
- GitHub Actions + GitHub Pages — CI/CD and hosting

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:1234
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server on port 1234 |
| `pnpm build` | Type-check + build to `dist/` |
| `pnpm preview` | Preview the built site locally |
| `pnpm prettier` | Format all TS/TSX/CSS/Astro files |

## Project Structure

```
src/
├── components/     # Reusable UI components
├── content/        # Blog posts, projects, photos, authors (MDX/Markdown)
├── i18n/           # Translation dictionaries (en.ts, es.ts)
├── layouts/        # Page layouts
├── lib/            # Data fetching utilities and helpers
├── pages/          # File-based routing
└── styles/         # Global CSS and typography
```

## Features

- **Blog** with multi-part series (subposts) support
- **Projects** portfolio with subproject nesting
- **Photo gallery** with camera metadata
- **Tools** collection (password generator, subnet calculator, JSON formatter, and more)
- **Bilingual** — English (default) and Spanish, with smart per-page language toggle
- **Dark mode** — user preference persisted to localStorage
- **Full-text search** — powered by Flexsearch, prebuilt at compile time
- **SEO** — OG images, sitemap, RSS feed, schema.org structured data

## Documentation

Internal project docs live in [`docs/`](./docs/):

| Doc | Description |
|---|---|
| [architecture.md](./docs/architecture.md) | Project structure and key files |
| [content-blog.md](./docs/content-blog.md) | Writing posts and subposts |
| [content-projects.md](./docs/content-projects.md) | Adding projects |
| [content-photos.md](./docs/content-photos.md) | Creating photo albums |
| [content-schema.md](./docs/content-schema.md) | Frontmatter field reference |
| [i18n.md](./docs/i18n.md) | Bilingual system (EN/ES) |
| [tools.md](./docs/tools.md) | Adding a new tool page |
| [components.md](./docs/components.md) | Component catalog |
| [styling.md](./docs/styling.md) | Tailwind, CSS variables, dark mode |
| [seo.md](./docs/seo.md) | OG images, sitemap, RSS, schema.org |
| [deployment.md](./docs/deployment.md) | GitHub Actions and Pages setup |

## Deployment

Pushing to `main` triggers the GitHub Actions workflow which builds and deploys to GitHub Pages automatically. See [docs/deployment.md](./docs/deployment.md) for details.

## License

Content (posts, photos) © Carlos Alarcon. Code is available for reference.
