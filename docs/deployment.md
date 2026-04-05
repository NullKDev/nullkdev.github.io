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
  workflow_dispatch: # allows manual trigger from GitHub UI

jobs:
  build:
    steps:
      - uses: actions/checkout@v5
      - uses: withastro/action@v4
        env:
          PUBLIC_GOOGLE_ANALYTICS_ID: ${{ vars.PUBLIC_GOOGLE_ANALYTICS_ID }}
          SITE_URL: ${{ vars.SITE_URL }}
  deploy:
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

`withastro/action@v4` auto-detects pnpm from the lockfile and runs the full build pipeline.

## Environment Variables

Variables are set in GitHub repo settings → **Settings → Secrets and variables → Actions → Variables**:

| Variable                     | Type     | Purpose                                 |
| ---------------------------- | -------- | --------------------------------------- |
| `SITE_URL`                   | Variable | Production site URL (no trailing slash) |
| `PUBLIC_GOOGLE_ANALYTICS_ID` | Variable | GA4 measurement ID                      |

Variables prefixed with `PUBLIC_` are exposed to the client bundle. Variables without the prefix are server-side only (not relevant for a static build).

To add a new env variable:

1. Add it as a **Repository Variable** (Settings → Secrets and variables → Actions → Variables)
2. Reference it in `deploy.yml` as `${{ vars.MY_VAR }}`
3. For secrets (API keys, tokens), use **Secrets** and reference as `${{ secrets.MY_VAR }}`

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

The `astro.config.ts` imports `SITE_URL` from `src/consts.ts` for the `site` option. Change `SITE_URL` in one place to migrate domains.

## Cloudflare Pages Functions

`functions/` at the repo root contains serverless functions for dynamic features:

| Function                      | Purpose                          | Storage                        |
| ----------------------------- | -------------------------------- | ------------------------------ |
| `api/newsletter/subscribe.ts` | Brevo double opt-in subscription | Brevo API                      |
| `api/reactions/[postId].ts`   | Post reaction counts             | Cloudflare KV (`REACTIONS_KV`) |

These run **only on Cloudflare Pages**, not on GitHub Pages. Required Cloudflare env vars:

| Variable        | Purpose                                     |
| --------------- | ------------------------------------------- |
| `BREVO_API_KEY` | Brevo API key for newsletter                |
| `BREVO_LIST_ID` | Brevo contact list ID                       |
| `SITE_URL`      | Redirect URL for double opt-in confirmation |
| `REACTIONS_KV`  | Cloudflare KV namespace binding             |

Both functions include rate limiting (by `CF-Connecting-IP`) and CORS restrictions.

## Security Headers

`public/_headers` defines security headers served by Cloudflare Pages:

- `Content-Security-Policy` — restricts script/style sources
- `Strict-Transport-Security` — forces HTTPS
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — disables camera, microphone, geolocation, etc.
- `Cross-Origin-Opener-Policy` / `Cross-Origin-Resource-Policy` — isolation
