# Skill Registry

## Project Skills

### Local Skills (.agents/skills/)
- `astro` — Astro web framework (components, collections, SSG/SSR)
- `frontend-design` — Frontend UI design and creation
- `tailwind-css-patterns` — Tailwind CSS utility patterns
- `tailwind-v4-shadcn` — Tailwind CSS v4 with shadcn/ui
- `shadcn` — shadcn/ui component management
- `typescript-advanced-types` — TypeScript advanced types
- `nodejs-best-practices` — Node.js development principles
- `nodejs-backend-patterns` — Node.js backend patterns
- `accessibility` — Web accessibility (WCAG 2.2)
- `seo` — Search engine optimization
- `vercel-react-best-practices` — React/Next.js optimization
- `vercel-composition-patterns` — React composition patterns

### Global Skills (~/.config/opencode/skills/)
- `sdd-*` — SDD workflow phases (init, explore, propose, spec, design, tasks, apply, verify, archive, onboard)
- `skill-registry` — Skill registry management
- `skill-creator` — New skill creation
- `go-testing` — Go testing patterns
- `branch-pr` — PR creation workflow
- `issue-creation` — Issue creation workflow
- `judgment-day` — Adversarial review

## Context

### Tech Stack
- **Framework**: Astro 6.1.3 (static site)
- **UI**: React 19 (islands with client:idle)
- **Styling**: Tailwind CSS 4 (@tailwindcss/vite)
- **Package Manager**: pnpm 10.24.0
- **Testing**: Vitest 4.1.2 with v8 coverage

### Architecture
- Content Collections: blog, projects, photos, authors (Zod schemas)
- Server Functions: Cloudflare Pages (functions/api/)
- Deployment: GitHub Pages

### Conventions
- Prettier: no semicolons, single quotes
- Path alias: @/* → src/*
- i18n: EN (default) / ES (folder suffix .es)
- Dark mode: data-theme attribute

### Commands
- `pnpm dev` — Dev server on port 1234
- `pnpm build` — Type-check + build
- `pnpm test` — Run Vitest
- `pnpm test:coverage` — Tests with v8 coverage

## Trigger Table

| Context | Skill |
|--------|-------|
| Astro components/pages | astro |
| React components | frontend-patterns, vercel-react-best-practices |
| Tailwind styling | tailwind-v4-shadcn, tailwind-css-patterns |
| TypeScript types | typescript-advanced-types |
| Backend work | nodejs-backend-patterns, nodejs-best-practices |
| Accessibility | accessibility |
| SEO | seo |
| Testing | python-testing (no project-specific) |
| Go code | go-testing |
| SDD phases | sdd-* (global) |