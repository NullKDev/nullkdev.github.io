---
title: "The Reflow Tax: Why Measuring Text Is Expensive"
description: "Before understanding why pretext is fast, you need to understand what layout reflow is, why the browser does it, and exactly when your code triggers it — often without knowing."
date: 2026-04-04
tags: ["javascript", "performance", "web", "typography"]
authors: ["me"]
lang: en
order: 2
---

*Part 1 of [Pretext: The 15 kb Library That Bypasses Your Browser's Most Expensive Operation](/blog/pretext)*

---

## What Is Layout Reflow?

When a browser renders a page, it builds two trees: the **DOM tree** (what elements exist) and the **layout tree** (where each element is, in pixels). Building the layout tree requires knowing fonts, content, container dimensions, and CSS rules for every element. It's expensive — modern pages can take tens of milliseconds.

The browser is smart about this. It batches DOM mutations and only recomputes the layout tree when it absolutely has to — typically before painting. This batching is what makes complex JavaScript UIs feel fast.

The problem is that some JavaScript operations *force* the browser to abandon that batching and compute the layout immediately, synchronously, in the middle of your code. This forced synchronous computation is **layout reflow**.

---

## What Triggers Reflow?

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

## Measuring Text Is Always a Dirty Read

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

## When This Actually Hurts

Most websites never run into this. A static blog with 10 posts does not care. The patterns where it becomes critical are:

### AI Streaming Chat

A streaming response updates a chat bubble every few milliseconds. If you compute height using DOM measurement, each token triggers a reflow. At even 10 tokens per second, you're forcing 10 layout passes per second just for height, on top of all the regular rendering. Bubbles stutter, animations jank, the scroll anchor fights with each update.

### Virtualized Lists

Libraries like `react-virtual` or `tanstack/virtual` need to know each item's height before it renders to correctly position items below it. The typical solution is to render items into a hidden container, measure them, then remove them. For a list of 1,000 items this means 1,000 forced reflows before you can even scroll.

### Masonry Layouts

Masonry requires knowing card heights before placing them in columns. The same hidden-render-then-measure pattern causes the same reflow storm.

### Real-Time Collaboration

Any interface where text content changes rapidly from external updates (collaborative docs, live feeds, dashboards) hits this wall. Content arrives, layout adjusts, measurements update — all fighting each other on the main thread.

---

## Why getBoundingClientRect Can't Be Made Fast

You might wonder: can browsers optimize this? The answer is mostly no. The reason `getBoundingClientRect()` must trigger a synchronous layout recalculation is that **JavaScript is single-threaded and browsers must give you a valid, current answer**.

If the browser computed layout lazily in the background (which it does for painting), a JavaScript call that reads geometry would get stale data. Since JavaScript can make decisions based on those measurements (if height > 300 do X), browsers cannot lie about the current layout state.

The only way to make text measurement truly fast is to move it outside the DOM entirely.

---

## Next: How Pretext Solves It

That is exactly what Pretext does. Instead of asking the browser's layout engine for heights, it asks the browser's **font engine** — through Canvas — which does not have a layout tree and never causes reflow.

[How Pretext Works →](/blog/pretext/how-it-works)
