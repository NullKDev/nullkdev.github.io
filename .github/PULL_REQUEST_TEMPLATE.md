## What changed

<!-- The change itself, in a sentence or two. -->

## Why

<!-- The problem this solves. Link an issue if there is one. -->

## Evidence

<!-- How you know it works. Paste output, not adjectives.
     A green `bun run build` already proves: types, no leaked private content,
     gzip budgets, no broken internal links, valid metadata/RSS/sitemap/JSON-LD/
     hreflang, and a sealed CSP. Say what you checked beyond that. -->

- [ ] `bun run build` passes
- [ ] `bun run test` passes
- [ ] `bun run lint` and `bun run format:check` pass

## Checks that need a human

- [ ] Content changes are in **both** locales, or the omission is deliberate
- [ ] No count, date, or claim was hand-entered — all derived from records
- [ ] New interactive UI is keyboard-operable and has a no-JS fallback
- [ ] No new third-party origin (it would be blocked by the CSP anyway)
- [ ] No secret, key, or private path in the diff
