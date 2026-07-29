---
entryId: notes-pretext
locale: en
translationKey: pretext
slug: pretext-text-layout
title: "Pretext: the 15 kb library that bypasses your browser's most expensive operation"
summary: Measure text once with a canvas font oracle, then lay out lines with pure arithmetic — no DOM reads, no reflow. A four-part series with two live demos.
visibility: public
maturity: growing
publishedAt: 2026-04-04
updatedAt: 2026-07-23
topics: [javascript, performance, typography, web]
featuredRank: 3
image: /banners/pretext.svg
imageAlt: Pretext series banner — layout reflow versus cached arithmetic layout.
links:
  - label: Pretext source
    href: https://github.com/chenglou/pretext
    kind: repository
references: []
evidence: []
documents:
  - documentId: reflow-tax
    slug: reflow-tax
    order: 1
  - documentId: how-it-works
    slug: how-it-works
    order: 2
  - documentId: react-demo
    slug: react-demo
    order: 3
  - documentId: matteflow
    slug: matteflow
    order: 4
protection: { mode: public }
kind: note
lifecycle: current
citations:
  - title: Pretext source repository
    url: https://github.com/chenglou/pretext
    accessedAt: 2026-07-23
---

Every time you call `getBoundingClientRect()` to measure a text element, your browser quietly does something brutal: it discards its entire layout tree, recalculates every position from scratch, and hands you back a number. This happens synchronously, on the main thread, and it blocks everything else.

For a static blog this doesn't matter. For a streaming AI chat interface updating 60 times per second — or a virtualized list with hundreds of variable-height items — it is a wall.

**Pretext** is a 15 kb library by [Cheng Lou](https://github.com/chenglou) (creator of React Motion, senior engineer at Midjourney) that eliminates this cost entirely. It measures and lays out multiline text using pure arithmetic, never touching the DOM after preparation.

---

## The core idea in one paragraph

Pretext splits work into two phases. `prepare()` runs once per text+font combination: it uses Canvas's `measureText()` API to measure every text segment, then caches the results. `layout()` runs as many times as you need: it computes line breaks and heights using only arithmetic on those cached widths — zero DOM reads, zero reflow. Width changes are free. Streaming updates are free. You pay the measurement cost once.

```ts
import { prepare, layout } from '@chenglou/pretext'

const prepared = prepare(
  'Layout reflow is the silent performance killer.',
  '16px Inter',
)

// First width — cheap
const { height, lineCount } = layout(prepared, 320, 24)

// Different width — still just arithmetic
const { height: h2 } = layout(prepared, 480, 24)
```

---

## Why it matters now

The timing is not accidental. AI applications that stream text token by token need to resize bubbles on every frame. Virtualized lists need to predict heights before elements exist in the DOM. Masonry layouts need to know heights before placing cards. All of these patterns were either janky or required workarounds involving hidden off-screen containers.

Pretext solves the underlying problem rather than working around it: **treat the browser's font engine as an oracle during preparation, then never ask it again**.

---

## The numbers

| Operation                          | Cost                                              |
| ---------------------------------- | ------------------------------------------------- |
| `prepare()` for 500 blocks         | ~19 ms (same as one DOM pass)                     |
| `layout()` per call                | ~0.09 ms                                          |
| `getBoundingClientRect()` per call | ~0.04 ms — but forces reflow when layout is dirty |
| Full reflow on dirty tree          | 10–100+ ms depending on page complexity           |

The real win is not the per-call speed — it is that `layout()` never dirties the layout tree, so it never triggers the cascade.

---

## What follows

The rest of this piece works from the problem to a running demo: what layout
reflow actually is and why `getBoundingClientRect()` is expensive, then the
two-phase model that avoids it — the Canvas oracle, the arithmetic layout, and
the full API. After that it stops being theory: a streaming AI chat whose bubble
heights are measured with pretext, and an editorial layout where text flows
around a dancer and is recomputed every frame.

> **Want to see it before reading any of it?** Text flowing around a dancing
> figure, recomputed every frame, running in this page — no setup, no install.
> [Jump to the Matteflow demo](#part-4)
