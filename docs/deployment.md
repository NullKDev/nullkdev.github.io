# Deployment

## Overview

Every push to `main` automatically builds and deploys the site to GitHub Pages via GitHub Actions.

```
git push origin main
  → GitHub Actions triggers
  → withastro/action@v4 runs: pnpm install + astro check + astro build
  → dist/ is uploaded as a Pages artifact
  → actions/deploy-pages@v4 publishes to GitHub Pages
```

Live URL: `https://nullkdev.github.io/`

## Workflow File

`.github/workflows/deploy.yml`

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:       # allows manual trigger from GitHub UI

jobs:
  build:
    steps:
      - uses: actions/checkout@v5
      - uses: withastro/action@v4
        env:
          PUBLIC_GOOGLE_ANALYTICS_ID: 'G-EHJ4VSJT4Q'
  deploy:
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

`withastro/action@v4` auto-detects pnpm from the lockfile and runs the full build pipeline.

## Environment Variables

| Variable | Where set | Purpose |
|---|---|---|
| `PUBLIC_GOOGLE_ANALYTICS_ID` | Hardcoded in workflow | GA4 measurement ID |

Variables prefixed with `PUBLIC_` are exposed to the client bundle. Variables without the prefix are server-side only (not relevant for a static build).

To add a new env variable:
1. Add it to the `env:` block in `deploy.yml` if it should be set at build time
2. Or add it as a GitHub Actions secret (Settings → Secrets) and reference it as `${{ secrets.MY_VAR }}`

## Local Build

```bash
pnpm build      # runs astro check then astro build
pnpm preview    # serves dist/ locally to verify the build
```

Always run `pnpm build` before pushing if you've made significant changes — it catches TypeScript errors that `pnpm dev` might not surface.

## Manual Deploy

You can trigger a deployment manually from the GitHub Actions tab without pushing code (via `workflow_dispatch`). Useful if a deploy failed and you want to retry without a new commit.

## GitHub Pages Settings

- Source: **GitHub Actions** (not the legacy branch-based method)
- Custom domain: not configured — uses `nullkdev.github.io`
- Enforce HTTPS: enabled

The `astro.config.ts` must have `site: "https://nullkdev.github.io/"` for sitemap, canonical URLs, and OG image URLs to be correct.

## Cloudflare Pages Functions

`functions/` at the repo root contains serverless functions for dynamic features (newsletter subscription, post reactions). These are **not** part of the static GitHub Pages build — they run only if the site is hosted on Cloudflare Pages instead. Currently unused in the active GitHub Pages deployment.
