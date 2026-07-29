# CarlosDev

A bilingual static archive at **[nullkdev.github.io](https://nullkdev.github.io)** —
one home for the things Carlos Alarcon builds, runs, writes and keeps.

> The site is named **CarlosDev**; the address stays `nullkdev.github.io`. The
> name is a brand, the host is an address, and several `nullkdev` strings in the
> source are identifiers that must never be renamed with it. See
> [`src/data/brand.ts`](src/data/brand.ts).

| Section | What lives there |
|---|---|
| **Work** | Things that shipped — with their public source, releases and evidence |
| **Lab** | Things that run in your browser, local-first |
| **Notes** | Things that are read — articles, papers, guides, decision records |
| **Gallery** | Things that are kept — images, generated studies, files, links |

Astro 7 · Bun · TypeScript · Tailwind CSS 4 · deployed to GitHub Pages.

## Getting started

```sh
bun install
bun run dev        # http://localhost:4321
```

## Commands

```sh
bun run build          # full pipeline — see below
bun run test           # Vitest
bun run test:content   # content-integrity project only
bun run test:e2e       # Playwright
bun run format         # Prettier; format:check verifies
bun run lint           # ESLint over src, tests, scripts, configs
bun run gallery:scan   # stub items.yml records for new gallery assets
```

`bun run build` is a chain, and a failure in any link fails the build:

```
private:generate → astro check → astro build → gallery:copy → private:copy
  → private:scan → performance:check → links:check → metadata:check
```

So a green build already proves types check, no protected content leaked into
`dist/`, per-route gzip budgets hold, no internal link is broken, and the
metadata, RSS, sitemap, JSON-LD and hreflang output are all valid.

## How it is put together

Content is data; pages are projections of it. Nothing in between invents facts —
no count or claim is typed by hand, every figure is derived from validated
records at build time.

```
src/content/**            typed records (the source of truth)
  → src/content.config.ts Zod schemas — the contract
  → src/lib/*.ts          derivation only, no rendering
  → src/components/       presentation only, no fetching
  → src/pages/            routing only
```

Both locales are first-class: English is unprefixed, Spanish lives under `/es`,
and a missing translation stays missing rather than falling back to English.

## Documentation

| Document | Read it when |
|---|---|
| [AGENTS.md](AGENTS.md) | Working in this repo at all — the short version of every rule |
| [docs/architecture.md](docs/architecture.md) | Adding a page, a lib module or a component |
| [docs/content-schema.md](docs/content-schema.md) | Adding an entry or a frontmatter field |
| [docs/design-system.md](docs/design-system.md) | Building or restyling any UI |
| [docs/decisions.md](docs/decisions.md) | Before revisiting a settled question |
| [docs/foundation.md](docs/foundation.md) | Changing config or the build pipeline |
| [PRODUCT.md](PRODUCT.md) | Any question about what the site is for |
| [DESIGN.md](DESIGN.md) | Any question about how it should look |

## A note on protected content

Some entries are gated with an encrypted envelope. **This is a deterrent, not
authorization** — the host is static, so there is no server to check a password
against and the content is public but obfuscated. Any copy describing it says
so, and `private:scan` fails the build if plaintext reaches `dist/`.

## Licence

Two licences, because the code and the archive are not the same kind of work.

| | Licence | |
|---|---|---|
| Source code | **MIT** | [LICENSE](LICENSE) |
| Writing, images, brand marks | **CC BY-NC 4.0** | [LICENSE-CONTENT.md](LICENSE-CONTENT.md) |

Copy and adapt the code freely. Share and adapt the writing for any
non-commercial purpose with attribution — and for anything commercial, ask; the
answer is usually yes. Code snippets printed inside an article are MIT like the
rest of the code, so paste them wherever you like.

Fonts, 3D models and icon sets are third-party and keep their own licences;
[LICENSE](LICENSE) lists each one.

## Security

Please report vulnerabilities privately — see [SECURITY.md](SECURITY.md), which
also documents what a static host on GitHub Pages can and cannot defend.
