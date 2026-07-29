---
parentDomain: notes
parentId: notes-pretext
documentId: how-it-works
locale: en
translationKey: pretext-how-it-works
slug: how-it-works
title: 'How pretext works: two phases, one canvas, zero reflow'
summary: The two-phase mental model — a Canvas font oracle in prepare(), pure arithmetic in layout() — and the full API.
order: 2
visibility: public
maturity: growing
publishedAt: 2026-04-04
updatedAt: 2026-07-23
topics: [javascript, performance, typography, web]
references: []
evidence: []
protection: { mode: public }
---

## The mental model

Pretext is built around one insight: **measuring text and laying out text are two different problems**.

Measuring is expensive because it requires the browser's full font shaping pipeline — kerning, ligatures, complex script rules, emoji clusters. But you only need to do this once per text+font combination.

Laying out is fast if you already have the measurements: it's just arithmetic — accumulate widths until you overflow the container, insert a line break, repeat.

Pretext separates these cleanly:

```
prepare(text, font) → PreparedText    // Font oracle: measure once
layout(prepared, width, lineHeight)   // Pure arithmetic: run many times
```

---

## Phase 1: `prepare()` — the canvas oracle

```ts
import { prepare } from '@chenglou/pretext'

const prepared = prepare(
  'Hello, world! Pretext handles text layout in pure JavaScript.',
  '16px Inter',
)
```

During `prepare()`, pretext does three things:

**1. Segmentation** — Using `Intl.Segmenter`, it splits the text into language-aware segments. This handles CJK characters, Arabic right-to-left text, emoji clusters, and word boundaries correctly across scripts.

**2. Canvas measurement** — Each segment is measured using `CanvasRenderingContext2D.measureText()`. This is the key operation. Canvas's `measureText()` asks the browser's font engine for pixel-accurate widths — the same engine that the DOM uses for layout — but without going through the layout pipeline. No reflow, no layout tree, just glyph metrics.

**3. Caching** — The results are stored in an opaque `PreparedText` handle. This handle is width-independent: you can call `layout()` with any container width and the measurements remain valid.

The preparation cost is roughly equivalent to one DOM measurement pass. You pay it once.

---

## Phase 2: `layout()` — pure arithmetic

```ts
import { layout } from '@chenglou/pretext'

const { height, lineCount } = layout(prepared, 320, 24)
// 320px container width, 24px line height
```

`layout()` iterates through the cached segment widths, accumulating the running line width. When the accumulated width would exceed `maxWidth`, it breaks the line. Each line break adds `lineHeight` to the total height.

This is integer/float arithmetic on an array of numbers. No DOM access, no Canvas calls, no font engine interaction. It runs in microseconds regardless of text length.

**The resize case** — the most important optimization — becomes trivial:

```ts
const prepared = prepare(text, font) // once

// Respond to container resize — just arithmetic
window.addEventListener('resize', () => {
  const { height } = layout(prepared, container.offsetWidth, 24)
  element.style.height = `${height}px`
})
```

---

## The rich API: `prepareWithSegments` + `layoutWithLines`

The fast path gives you height and line count. When you need actual line content — for custom rendering, cursor placement, or streaming layout — use the rich API:

```ts
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const prepared = prepareWithSegments(
  'Every token that streams adds to the layout cost — unless you use pretext.',
  '18px "Helvetica Neue"',
)
const { lines } = layoutWithLines(prepared, 320, 26)

for (const line of lines) {
  console.log(`"${line.text}" — ${line.width}px`)
}
```

Each `LayoutLine` carries `text`, `width`, `start`, and `end` cursors. The cursors are segment/grapheme positions — not raw string offsets — so they stay correct across multi-byte characters and emoji.

---

## Streaming layout: `layoutNextLine`

For AI streaming, you often need to flow text line by line as tokens arrive. The `layoutNextLine` function handles this:

```ts
import {
  prepareWithSegments,
  layoutNextLine,
  type LayoutCursor,
} from '@chenglou/pretext'

const prepared = prepareWithSegments(streamingText, '16px Inter')
let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }

// Called each time text grows
function renderNextLine(containerWidth: number) {
  const line = layoutNextLine(prepared, cursor, containerWidth)
  if (!line) return

  drawLine(line.text, currentY)
  cursor = line.end
  currentY += lineHeight
}
```

This is the API that makes streaming AI chat smooth: each new token may extend the current line or start a new one, and the cost of that determination is nanoseconds.

---

## What pretext handles (and what it doesn't)

**Handles correctly:**

- Latin, CJK (Chinese, Japanese, Korean), Arabic, Hebrew, Thai, Khmer
- Emoji and emoji sequences (🏳️‍🌈 counts as one cluster)
- Bidirectional text (Unicode BiDi algorithm)
- `overflow-wrap: break-word` for very long words
- `white-space: pre-wrap` (tabs, newlines, explicit spaces)
- `word-break: keep-all` for CJK headlines

**Does not handle:**

- `system-ui` font on macOS — Canvas and DOM can resolve different optical variants for the same size. Always use explicit font names: `'16px Inter'` not `'16px system-ui'`
- Server-side rendering — Canvas requires a browser environment. The `prepare()` call must run client-side
- Full CSS inline formatting (nested spans with mixed fonts) — use the inline-flow sidecar for that

---

## When not to use it

Pretext adds setup overhead (`prepare()` is as expensive as one DOM pass) and mental complexity. It is the wrong tool for:

- Static content that does not resize or stream
- One-time measurements of a handful of elements
- Any context where you're not in the "measure many times" hot path

If `getBoundingClientRect()` is not causing you performance problems, pretext will not help. Add complexity when the numbers justify it.

The theory is clean. The demos that follow make it tangible.
