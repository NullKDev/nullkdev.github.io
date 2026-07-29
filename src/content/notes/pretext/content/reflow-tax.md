---
parentDomain: notes
parentId: notes-pretext
documentId: reflow-tax
locale: en
translationKey: pretext-reflow-tax
slug: reflow-tax
title: 'The reflow tax: why measuring text is expensive'
summary: What layout reflow is, exactly which reads trigger it, and why text measurement is always a dirty read.
order: 1
visibility: public
maturity: growing
publishedAt: 2026-04-04
updatedAt: 2026-07-23
topics: [javascript, performance, typography, web]
references: []
evidence: []
protection: { mode: public }
---

## What is layout reflow?

When a browser renders a page, it builds two trees: the **DOM tree** (what elements exist) and the **layout tree** (where each element is, in pixels). Building the layout tree requires knowing fonts, content, container dimensions, and CSS rules for every element. It's expensive — modern pages can take tens of milliseconds.

The browser is smart about this. It batches DOM mutations and only recomputes the layout tree when it absolutely has to — typically before painting. This batching is what makes complex JavaScript UIs feel fast.

The problem is that some JavaScript operations _force_ the browser to abandon that batching and compute the layout immediately, synchronously, in the middle of your code. This forced synchronous computation is **layout reflow**.

---

## What triggers reflow?

Reading any geometry property when the layout is "dirty" (meaning JavaScript has changed something since the last layout pass) triggers reflow:

```js
// This write makes the layout dirty
element.style.width = '300px'

// This read forces immediate reflow — the browser must
// finish layout before it can give you a valid answer
const height = element.getBoundingClientRect().height

// Another write, another dirty mark
element.style.fontSize = '18px'

// Another forced reflow
const newHeight = element.offsetHeight
```

The pattern above — write, read, write, read — is called **layout thrashing**. Each read-after-write pair forces a full layout recalculation.

The properties that trigger forced reflow include:

- `getBoundingClientRect()`
- `offsetHeight`, `offsetWidth`, `offsetTop`, `offsetLeft`
- `scrollHeight`, `scrollWidth`
- `clientHeight`, `clientWidth`
- `getComputedStyle()`

---

## Measuring text is always a dirty read

Here's the specific pain point for text measurement. When you want to know how tall a block of text will be, the standard approach is:

```js
function getTextHeight(text, font, maxWidth) {
  const el = document.createElement('div')
  el.style.cssText = `
    position: fixed;
    top: -9999px;
    width: ${maxWidth}px;
    font: ${font};
    word-break: break-word;
  `
  el.textContent = text
  document.body.appendChild(el)

  const height = el.getBoundingClientRect().height // ← forced reflow

  document.body.removeChild(el)
  return height
}
```

Every call to `getTextHeight()` appends a DOM element (dirties the layout), reads geometry (forces reflow), and removes the element (dirties again). If you call this for 100 list items, you trigger 100 synchronous layout passes.

On a complex page, each forced reflow can take 10–50 ms. For 100 items that's potentially 5 seconds of blocked main thread — for measurements only.

---

## When this actually hurts

Most websites never run into this. A static blog with 10 posts does not care. The patterns where it becomes critical are:

### AI streaming chat

A streaming response updates a chat bubble every few milliseconds. If you compute height using DOM measurement, each token triggers a reflow. At even 10 tokens per second, you're forcing 10 layout passes per second just for height, on top of all the regular rendering. Bubbles stutter, animations jank, the scroll anchor fights with each update.

### Virtualized lists

Libraries like `react-virtual` or `tanstack/virtual` need to know each item's height before it renders to correctly position items below it. The typical solution is to render items into a hidden container, measure them, then remove them. For a list of 1,000 items this means 1,000 forced reflows before you can even scroll.

### Masonry layouts

Masonry requires knowing card heights before placing them in columns. The same hidden-render-then-measure pattern causes the same reflow storm.

### Real-time collaboration

Any interface where text content changes rapidly from external updates (collaborative docs, live feeds, dashboards) hits this wall. Content arrives, layout adjusts, measurements update — all fighting each other on the main thread.

---

## Why getBoundingClientRect can't be made fast

You might wonder: can browsers optimize this? The answer is mostly no. The reason `getBoundingClientRect()` must trigger a synchronous layout recalculation is that **JavaScript is single-threaded and browsers must give you a valid, current answer**.

If the browser computed layout lazily in the background (which it does for painting), a JavaScript call that reads geometry would get stale data. Since JavaScript can make decisions based on those measurements (if height > 300 do X), browsers cannot lie about the current layout state.

The only way to make text measurement truly fast is to move it outside the DOM entirely.

That is exactly what pretext does. Instead of asking the browser's layout engine for heights, it asks the browser's **font engine** — through Canvas — which has no layout tree and never causes reflow.
