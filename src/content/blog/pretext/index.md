---
title: "Pretext: The 15 kb Library That Bypasses Your Browser's Most Expensive Operation"
description: "Every time your JavaScript measures text with getBoundingClientRect(), the browser discards its entire layout tree and recalculates from scratch. Pretext eliminates that cost using canvas arithmetic — and the results are dramatic."
date: 2026-04-04
tags: ["javascript", "performance", "web", "typography"]
authors: ["me"]
lang: en
image: ./banner.svg
order: 1
---

Every time you call `getBoundingClientRect()` to measure a text element, your browser quietly does something brutal: it discards its entire layout tree, recalculates every position from scratch, and hands you back a number. This happens synchronously, on the main thread, and it blocks everything else.

For a static blog this doesn't matter. For a streaming AI chat interface updating 60 times per second — or a virtualized list with hundreds of variable-height items — it is a wall.

**Pretext** is a 15 kb library by [Cheng Lou](https://github.com/chenglou) (creator of React Motion, senior engineer at Midjourney) that eliminates this cost entirely. It measures and lays out multiline text using pure arithmetic, never touching the DOM after preparation.

---

## The Core Idea in One Paragraph

Pretext splits work into two phases. `prepare()` runs once per text+font combination: it uses Canvas's `measureText()` API to measure every text segment, then caches the results. `layout()` runs as many times as you need: it computes line breaks and heights using only arithmetic on those cached widths — zero DOM reads, zero reflow. Width changes are free. Streaming updates are free. You pay the measurement cost once.

```ts
import { prepare, layout } from '@chenglou/pretext'

const prepared = prepare('Layout reflow is the silent performance killer.', '16px Inter')

// First width — cheap
const { height, lineCount } = layout(prepared, 320, 24)

// Different width — still just arithmetic
const { height: h2 } = layout(prepared, 480, 24)
```

---

## Why It Matters Now

The timing is not accidental. AI applications that stream text token by token need to resize bubbles on every frame. Virtualized lists need to predict heights before elements exist in the DOM. Masonry layouts need to know heights before placing cards. All of these patterns were either janky or required workarounds involving hidden off-screen containers.

Pretext solves the underlying problem rather than working around it: **treat the browser's font engine as an oracle during preparation, then never ask it again**.

---

## The Numbers

| Operation | Cost |
|---|---|
| `prepare()` for 500 blocks | ~19 ms (same as one DOM pass) |
| `layout()` per call | ~0.09 ms |
| `getBoundingClientRect()` per call | ~0.04 ms — but forces reflow when layout is dirty |
| Full reflow on dirty tree | 10–100+ ms depending on page complexity |

The real win is not the per-call speed — it is that `layout()` never dirties the layout tree, so it never triggers the cascade.

---

## Series Structure

This series covers pretext from fundamentals to live demos:

1. **[The Reflow Tax](/blog/pretext/reflow-tax)** — what layout reflow actually is, when it hurts, and why `getBoundingClientRect()` is expensive
2. **[How Pretext Works](/blog/pretext/how-it-works)** — the two-phase model, Canvas oracle, arithmetic layout, and the full API
3. **[React Demo: Streaming Chat](/blog/pretext/react-demo)** — building a live streaming AI chat with pretext-measured bubble heights
4. **[Matteflow: Text Around a Dancer](/blog/pretext/matteflow)** — a full editorial demo: text flowing around a moving foreground subject, recomputed every frame with pretext

---

<div class="not-prose my-8 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 to-primary/3 p-6 text-center shadow-sm">
  <p class="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-2">Live demo</p>
  <p class="text-xl font-bold text-foreground mb-1">Skip the theory — see it move</p>
  <p class="text-sm text-muted-foreground mb-5">Text flowing around a dancing figure, recomputed every frame with pretext. No setup, no install.</p>
  <a href="/blog/pretext/matteflow" class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 active:scale-95 transition-all no-underline">
    Open Matteflow Demo →
  </a>
</div>

Start with [The Reflow Tax →](/blog/pretext/reflow-tax)
