# Design

<!-- impeccable:design-schema 1 -->

## Direction contract

**THESIS.** A working developer's home that reads as *modern product software*, not an editorial magazine. It refuses the broadsheet-editorial rut it replaces (serif display, terracotta, newspaper hairlines, field-grid texture). Clarity and depth over decoration.

**OWN-WORLD.** Light-first, airy neutral canvas with one confident indigo accent and an emerald *signal* status color kept from the brand's systems metaphor. Type: **Switzer** (premium neutral grotesque) across UI/text/display + **IBM Plex Mono** for technical labels, meta, and code — the "aire IBM/corporate" comes from the mono + grid discipline, not from full Carbon rigidity. Soft realistic shadows and restrained glass/transparency give layered depth. Precise 2px signal accent lines. Rounded-but-tight corners.

**STORY.** A peer lands, immediately reads "this person builds real systems" from a calm, confident, depth-rich hero (3D signature moment), then scans Work · Lab · Notes · Gallery with zero friction and follows evidence outward.

**FIRST VIEWPORT.** Clean hero: mono eyebrow (name · role), large tight Switzer headline (left, ~2 lines), one-line intro, a primary action + a live status line — set against a **3D signature animation** occupying the right/background. Generous whitespace; nothing shouts.

**FORM.** Canon commitment (user chose the category standard — clean modern SaaS dev site, sitting alongside **Stripe**, with an IBM corporate whisper and elevated type). Executed at full fidelity, no irony.

## Platform

web

## Color

Strategy: **Restrained** — neutral canvas + one accent (indigo), plus a signal/status hue (emerald). Color at page scale means large calm neutral fields, accent reserved for action and emphasis. Light is the default scene (a developer reading in a bright editor/browser); dark is a first-class parity theme, not an inversion afterthought.

Roles (finalized in `global.css` on first build):
- **Canvas / surface:** near-white neutrals, cool-leaning (not the old warm sage paper). Raised surfaces slightly lighter/elevated with soft shadow + optional subtle glass on floating/sticky elements.
- **Ink:** deep cool slate (not the green-black `#12231e`); muted ink for secondary text.
- **Line:** hairline neutral borders; `line-strong` for structural 2px accents.
- **Primary / action:** confident indigo (evolved from Stripe blurple, not a copy). Used for primary buttons, links-on-emphasis, focus.
- **Signal:** emerald — status dots, "live/building", success. Honors the brand's signal/systems identity.
- **Destructive:** standard red role.
- Remove: terracotta accent, coordinate gold, warm-paper washes, field-grid mask.

## Typography

- **Switzer** (`switzer-variable.woff2`, weights 100–900) — primary family for everything: display, headings, UI, body. Tight negative tracking on large display sizes; regular tracking for text. Hierarchy comes from weight/size/tracking, not from a second display face.
- **IBM Plex Mono** — technical accents only: eyebrows/kickers, metadata, status lines, tags, code, table numerics. This is the deliberate "IBM aire." **Retire the editorial tic** of uppercase-tracked mono on *everything*; use it purposefully and sparingly.
- **Fraunces (serif) is gone** — it was the core editorial signifier being removed. All references were dropped and the file was deleted on 2026-07-25. Do not reintroduce a serif display face; hierarchy comes from Switzer.

## Form & depth

- **Corners:** rounded but restrained — small/medium radii (e.g. 6–12px), not the old near-zero editorial sharpness, not pill-round everywhere.
- **Shadows (wanted):** soft, realistic, layered elevation (ambient + key). Two-to-three step elevation scale. Used to lift cards, popovers, sticky header, and the hero object.
- **Transparency/glass (wanted):** modernized — subtle backdrop-blur on sticky header and floating panels; keep tasteful, performance-bounded, with a solid fallback when `data-fx-glass='off'` or reduced transparency is preferred.
- **Grid discipline (IBM aire):** consistent max-width container, honest columns, 2px signal accent lines to mark structure. Functional, not decorative.

## Signature: 3D hero

- Built with **React Three Fiber** as a lazy, isolated island (`client:visible`/idle), bounded draw cost, capped DPR, paused when offscreen.
- **Graceful fallback is mandatory, not the default experience:** a static, well-composed poster/SVG for `prefers-reduced-motion`, no-WebGL, and low-power clients.
- Concept ties to the brand's **signal/systems** identity; professional and calm, never gamey. (Exact motif chosen with the user — see surface brief for home.)
- Respect the light/dark theme; the object re-materials per theme.

## Motion

Purposeful and quiet: entrance reveals (respecting `prefers-reduced-motion`), soft hover elevation on interactive surfaces, one orchestrated hero motion. No infinite scattered hover effects, no scroll-jacking, no animated vanity counters.

## Responsive

Mobile-first integrity: the 3D hero degrades to the static poster on small/low-power screens; grids collapse to single column; the mono labels and structure remain legible. Existing responsive breakpoints in `global.css` are preserved and adapted.

## Accessibility

WCAG 2.2 AA target (see PRODUCT.md). Preserve: skip link, visible focus ring (indigo), 44px touch targets, reduced-motion neutralization, accessible names on icon controls, real contrast in both themes. New accent/ink pairs must pass AA before shipping.

## What is preserved from the incumbent

Structure, information architecture, section system, semantic token *architecture* (CSS variables + Tailwind `@theme inline` mapping), i18n, glass/shadow infrastructure, responsive scaffolding, dev DesignPanel knobs. Only the *skin* (type, color, texture, editorial signifiers) is replaced.
