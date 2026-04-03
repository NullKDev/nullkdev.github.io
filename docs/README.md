# nullkdev.github.io — Project Docs

Personal portfolio and blog built with **Astro 5**, deployed to **GitHub Pages**.

## Quick Start

```bash
pnpm install
pnpm dev        # http://localhost:1234
pnpm build      # type-check + build to dist/
pnpm preview    # preview built site
pnpm prettier   # format TS/TSX/CSS/Astro files
```

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (static output) |
| UI Islands | React (`client:idle`) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Content | Astro Content Collections (MDX/Markdown) |
| Fonts | Geist + Geist Mono (self-hosted) |
| Search | Flexsearch (prerendered JSON index) |
| Deployment | GitHub Actions → GitHub Pages |

## Documentation Index

| Doc | What it covers |
|---|---|
| [architecture.md](./architecture.md) | Project structure, routing, key files |
| [content-blog.md](./content-blog.md) | Writing posts and subposts |
| [content-projects.md](./content-projects.md) | Adding projects and subprojects |
| [content-photos.md](./content-photos.md) | Creating photo albums |
| [content-schema.md](./content-schema.md) | All frontmatter fields reference |
| [i18n.md](./i18n.md) | Bilingual system (EN/ES) |
| [tools.md](./tools.md) | Adding a new tool page |
| [components.md](./components.md) | Component catalog |
| [styling.md](./styling.md) | Tailwind, CSS variables, dark mode |
| [seo.md](./seo.md) | OG images, sitemap, schema.org, RSS |
| [deployment.md](./deployment.md) | GitHub Actions, env vars |
