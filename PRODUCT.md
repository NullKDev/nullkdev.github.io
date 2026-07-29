# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two co-primary audiences, weighted equally:

1. **The owner (Carlos).** The site is first a durable personal record — a system to add, revise, and retrieve his own work, notes, decisions, and collections over years. It must stay useful as memory and publishing even if no professional visitor ever arrives.
2. **Peer developers.** Engineers who arrive from a repo, a shared note, a tool, or a search result and stay to read, learn, or reuse. Their job is to understand something technical and judge whether it holds up. They read closely, value correctness and traceable evidence over polish, and distrust filler.

Secondary (present, not the design priority): returning readers, curious builders/researchers, and professional/hiring visitors — served in that order, without letting a hiring funnel reshape the product.

## Product Purpose

CarlosDev is Carlos Alarcon's durable personal space — one bilingual home for the systems he builds, the questions he investigates, the tools he makes, the things he writes, and the visual collections he keeps. It combines a work archive, a workbench (Lab), a publication (Notes), a curated gallery, and a set of local developer tools. It exists to preserve useful work and connected evidence over time. Success: the owner can capture and retrieve any artifact without touching page components, and a first-time peer understands Work · Lab · Notes · Gallery · About in one scan and can trace a project from overview to a decision to a post-launch observation.

## Positioning

**Design thesis:** the site earns trust by preserving useful work and connected evidence over time, not by performing employability.

It is a working developer's own archive, not a marketing portfolio: content organized as a browsable, cross-linked record across technical domains, published fully in two languages, alongside privacy-respecting tools. It behaves like a small knowledge graph (build-time backlinks, explicit relationships) without a graph database, and it reads as a "personal field station" — precise, quiet, evidence-dense — rather than a conversion funnel. A neighboring portfolio could copy the sections; it could not truthfully copy the depth of connected, evidence-backed artifacts accumulated over time.

## Operating Context

- **Primary sections:** Home (orientation + selected artifacts), Work (project inventory + evidence-rich case studies + embedded Systems Atlas), Lab (tools and experiments with substantial explanations), Notes (one bilingual stream typed `note` / `article` / `paper`, including Decision Ledger entries), Gallery (curated `album` / `shelf` collections), About (profile/CV + prominent dated Now block).
- **Secondary routes:** `/uses`, `/stack` (evidence-backed), `/colophon` (implementation, accessibility, privacy, changelog, Site Archaeology), `/tags`, RSS, sitemap, robots, and a useful 404. Search is conditional — added only when content volume proves it necessary, never a decorative placeholder.
- **Reading & reuse loop:** visitors read notes, browse work, run tools client-side, and follow out to the real source repositories cited in the content.
- **Author workflow:** content is added/revised as typed collection entries and per-locale data registries — never by editing page components; visible counts are derived from validated records at build time.

## Capabilities and Constraints

- Static Astro site (declared range `^7.1.3`) with selectively hydrated React islands; **Bun** as package/command runtime (`bun@1.3.13`), Node compatibility floor `>=22.12.0`. Deployed to **GitHub Pages via GitHub Actions**.
- **Static-host boundary (hard constraint):** no SSR, runtime secrets, authenticated APIs, response-header control, live collections, or real private-content authorization. Static encrypted payloads are accepted as a **deterrent only** — content is public even if client-obfuscated. Build secrets must never enter generated HTML, JS, source maps, or logs. Any "privacy"/"protected" claim must be accurate to this boundary.
- Content collections: `work`, `lab`, `notes`, `gallery`, `documents`, plus per-locale `about` / `uses` / `stack` registries and a canonical taxonomy (`src/data/taxonomy.ts`).
- **Separate controlled vocabularies** (never overload one `status`/`tags` field): domains (`web · mobile · desktop · iot · cloud · ai`), surfaces, topics, technologies; publication visibility (`draft · public · unlisted`), editorial maturity (`seed · growing · stable · archived`), project lifecycle (`research · prototype · active · shipped · maintained · archived`).
- Standalone in-browser developer tools (JSON formatter, YAML validator, Base64, password generator, converters, subnet calculator, etc.). **Most run entirely client-side; some do not** — IP/DNS lookup queries third parties (`ipapi.co`, `dns.google`, `api.ipify.org`). Every tool must disclose its true execution/network behavior; never claim "all local" when requests leave the browser.
- Content protection: entries can be password-gated; treated as an audited deterrent, not authorization (see boundary above).
- Full EN/ES bilingual UI and content, default English unprefixed + explicit `/es` counterparts.
- No CMS, PWA, analytics, Pagefind, animation framework, or 3D engine by default; every dependency needs a named consumer, cost, and removal path.

## Brand Commitments

Confirmed non-negotiable — future design and content work must preserve these:

- **CarlosDev identity** — the **CarlosDev** name rendered as `<CarlosDev/>`, the "archive / field station" framing, and the signal/systems visual metaphor. The public name is defined once in `src/data/brand.ts`. It is **not** the address: the site is served from `nullkdev.github.io`, the GitHub account is `nullkdev`, and two storage identifiers (`nullkdev:notes-read`, `nullkdev:protected:v*`) are load-bearing — renaming them destroys reading history and already-encrypted content respectively.
- **Full EN/ES bilingual parity** — both UI and content stay genuinely bilingual. English default is unprefixed; Spanish lives under `/es`. Missing translations stay missing — never merge English fields into Spanish records or render English fallback under a Spanish URL; emit `hreflang` only for real, reciprocal counterparts.
- **Local-first tools & privacy** — tools compute client-side and the site does not track visitors; where a tool must call a third party, that is disclosed accurately rather than hidden behind an "all local" claim.

Author: Carlos Alarcon — mobile & multiplatform developer (Kotlin · Jetpack Compose · Kotlin Multiplatform; Android first), Lima, Peru (GMT-5 — stated for privacy; see `src/data/about.ts`). Links: GitHub `nullkdev`, LinkedIn `jcarlos-dev`, email `carlos.alarcon.dev@gmail.com`.

## Evidence on Hand

- Real project artifacts: **Keyboard Simple** (Java/Kotlin Android, GitHub source, EN+ES case study) and this site's own source repository.
- Bilingual field notes (Android beta coverage, GoF patterns for Android, Compose remote, "pretext"), each in EN + ES; several are multi-part series.
- Working local developer tools under `/tools/*` (ten in the backup).
- Photo material in the backup (albums + imported assets) available for curated Gallery collections after captions/alt/ordering/rights pass.
- Illustrated avatar asset (`/avatar.png`); self-hosted IBM Plex Sans/Mono.
- **Absences to respect — must NOT be fabricated:** the backup carried invented metrics (e.g. "100k+ MAU", "99.8% crash-free", "500k+ users", "42 posts") that are not backed by any system. There are no client testimonials, no verified traffic metrics, and no press coverage. Future work states only what exists and derives counts from validated records; absences stay absent.

## Product Principles

1. **Owner usefulness and peer legibility, together.** Optimize both for the author's long-term capture/retrieval and for a peer reading closely and reusing what they find.
2. **Evidence before claims (binding).** Every claimed capability, technology, or outcome links to a project, note, artifact, or observation — or it is omitted. Never invent metrics, testimonials, clients, or press; derive counts, never hand-enter vanity numbers.
3. **Bilingual is structural.** Every surface and every piece of content lives in EN and ES with real parity; a Spanish page never silently falls back to English.
4. **Static-first and honest about the host.** Core reading and navigation work without client JavaScript; the site never pretends a static host is a server, and never makes false privacy or authorization claims.
5. **Interaction integrity.** Anything that looks actionable works completely and is keyboard-operable — otherwise it is omitted. No nonfunctional filters, dead links, mislabeled CTAs, or decorative controls.
6. **No decorative infrastructure.** Dependencies and effects enter only with a named user need and measurable acceptance criteria.

## Accessibility & Inclusion

- **Target: WCAG 2.2 AA**, verified with manual keyboard, screen-reader, zoom, contrast, and reduced-motion checks — not only source-pattern assertions. Access behavior is a product requirement, not an add-on.
- Bilingual EN/ES access is a first-class inclusion requirement.
- The project already exercises axe/Playwright checks in CI; treat rendered a11y correctness (accessible names on icon buttons, per-image alt text, locale-correct aria strings, visible focus that component styles don't strip) as the expected baseline for new surfaces.
