/* The in-page half of the responsive sweep (responsive.spec.ts).

   `auditLayout` is serialised into the page by `page.evaluate`, so it must be
   self-contained: no imports, no closures over module scope. Every rule reads
   the rendered layout — boxes and computed styles — never a hand list of
   selectors, because the bugs this exists for were invisible in the source:

   - a `<picture>` dissolved with `display: contents` turned its `<source>`
     children into grid items, so the contact sheet grew six implicit rows;
   - `.status-chip--sm` declared before `.status-chip` lost the cascade and
     kept a bottom margin that pushed the chip 11px off its label.

   The one exception is PROMISED_TARGETS: the controls the stylesheets
   explicitly size to 44px. That promise lives in CSS comments and values, not
   in anything a computed style can tell apart from an ordinary 44px box. */

export type Violation = { check: string; element: string; detail: string }

export const PROMISED_TARGETS = [
  // global.css — header, drawer and locale controls (`min-width: 44px`).
  '.icon-control',
  '.menu-control',
  '.locale-control',
  '.drawer-heading button',
  // entry.css — the mobile table of contents rows (`min-height: 2.75rem`).
  '.toc-mobile__list a',
  // home.css — the model showcase pause control ("A 44px target").
  '.model-showcase__motion',
  // prose.css — diagram toolbar and lightbox close.
  '.diagram__button',
  '.lightbox__close',
  // gallery-detail.css — the viewer's previous / next steps.
  '.gallery-viewer__step',
]

export function auditLayout(promised: string[]): Violation[] {
  const out: Violation[] = []
  const vw = document.documentElement.clientWidth

  const describe = (el: Element): string => {
    const tag = el.tagName.toLowerCase()
    const id = el.id ? `#${el.id}` : ''
    const cls =
      typeof el.className === 'string' && el.className.trim()
        ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
        : ''
    let context = ''
    const named = el.parentElement?.closest('[class]')
    if (named && named !== document.body) {
      const nc = String(named.className).trim().split(/\s+/)[0]
      if (nc) context = ` in .${nc}`
    }
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40)
    return `${tag}${id}${cls}${context}${text ? ` "${text}"` : ''}`
  }
  const px = (value: string) => Number.parseFloat(value) || 0
  const r = (n: number) => Math.round(n * 10) / 10
  const push = (check: string, el: Element, detail: string) =>
    out.push({ check, element: describe(el), detail })

  const visible = (el: Element) =>
    el.checkVisibility({
      visibilityProperty: true,
      contentVisibilityAuto: true,
    })
  /* Screen-reader-only text is clipped to a 1px box on purpose. */
  const srOnly = (el: Element, cs: CSSStyleDeclaration) => {
    const box = el.getBoundingClientRect()
    // `clip` is deprecated, but it is what the sr-only pattern still sets.
    const clip = cs.getPropertyValue('clip')
    return (
      (box.width <= 1 && box.height <= 1) ||
      (clip !== 'auto' && clip !== '') ||
      cs.clipPath.startsWith('inset(50%')
    )
  }
  const inSvg = (el: Element) =>
    el.namespaceURI === 'http://www.w3.org/2000/svg' && el.tagName !== 'svg'

  /* Children as the layout sees them: a `display: contents` element is
     replaced by its own children, exactly as the box tree does it. */
  const layoutChildren = (parent: Element): Element[] =>
    Array.from(parent.children).flatMap((child) =>
      getComputedStyle(child).display === 'contents'
        ? layoutChildren(child)
        : [child],
    )

  const all = Array.from(document.body.querySelectorAll('*'))

  // 1. The page itself never scrolls sideways.
  const root = document.documentElement
  if (root.scrollWidth > root.clientWidth + 1) {
    // Name the widest offenders so the message points somewhere useful.
    const culprits = all
      .filter((el) => {
        const b = el.getBoundingClientRect()
        return b.width > 0 && b.right > root.clientWidth + 1
      })
      .filter(
        (el) =>
          !el.parentElement ||
          el.parentElement.getBoundingClientRect().right <=
            root.clientWidth + 1,
      )
      .slice(0, 3)
      .map(describe)
    out.push({
      check: 'page-overflow',
      element: 'html',
      detail: `scrollWidth ${root.scrollWidth} > clientWidth ${root.clientWidth}; widest: ${culprits.join(' | ') || 'n/a'}`,
    })
  }

  /* An ancestor that scrolls horizontally owns its overflow: a code block, a
     table wrapper, a diagram pane. Derived from computed styles, not from a
     list of class names. An ancestor that merely clips (`hidden`, `clip`)
     does not: it hides the overflow, which is the bug, not the excuse — a
     card's rounded corners once cut a title off mid-word. Only media may be
     cropped by design. */
  const ownedOverflow = (el: Element) => {
    if (el.closest('img, video, picture, canvas, iframe, svg, model-viewer'))
      return true
    for (
      let a = el.parentElement;
      a && a !== document.body;
      a = a.parentElement
    ) {
      const ox = getComputedStyle(a).overflowX
      if (ox === 'auto' || ox === 'scroll') return true
    }
    return false
  }

  /* Everything inside a screen-reader-only box is clipped with it: a stacked
     table hides its whole `thead`, and its `th` cells keep their table widths. */
  const srOnlyBoxes = new Set<Element>()
  const insideSrOnly = (el: Element) => {
    for (let p = el.parentElement; p; p = p.parentElement)
      if (srOnlyBoxes.has(p)) return true
    return false
  }

  for (const el of all) {
    if (inSvg(el) || !visible(el)) continue
    const cs = getComputedStyle(el)
    if (srOnly(el, cs)) {
      srOnlyBoxes.add(el)
      continue
    }
    if (cs.display === 'contents' || insideSrOnly(el)) continue
    const box = el.getBoundingClientRect()
    if (box.width === 0 && box.height === 0) continue

    // 2. Nothing in flow pokes past its container's content box.
    const flowing =
      (cs.position === 'static' ||
        (cs.position === 'relative' &&
          cs.left === 'auto' &&
          cs.right === 'auto') ||
        cs.position === 'sticky') &&
      cs.transform === 'none' &&
      cs.float === 'none'
    let parent = el.parentElement
    while (parent && getComputedStyle(parent).display === 'contents')
      parent = parent.parentElement
    if (
      flowing &&
      parent &&
      parent !== document.documentElement &&
      !ownedOverflow(el)
    ) {
      const ps = getComputedStyle(parent)
      const pb = parent.getBoundingClientRect()
      const left = pb.left + px(ps.borderLeftWidth) + px(ps.paddingLeft)
      const right = pb.right - px(ps.borderRightWidth) - px(ps.paddingRight)
      /* The margin box, not the border box: a negative margin is a declared,
         intentional bleed (full-width rules, optical alignment). */
      const mLeft = box.left - px(cs.marginLeft)
      const mRight = box.right + px(cs.marginRight)
      const inline = cs.display === 'inline'
      const over = Math.max(
        mRight - right,
        inline ? 0 : left - mLeft, // inline boxes start mid-line by design
      )
      if (over > 1 && pb.width > 0)
        push(
          'element-overflow',
          el,
          `${r(over)}px past ${describe(parent).split(' "')[0]} content box`,
        )
    }

    // 5. No clipped text, unless it is an ellipsis or a declared line clamp.
    const hasText = Array.from(el.childNodes).some(
      (n) =>
        n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '',
    )
    if (
      hasText &&
      !/^(INPUT|TEXTAREA|SELECT|OPTION|CODE|PRE)$/.test(el.tagName)
    ) {
      const he = el as HTMLElement
      const clipsY = cs.overflowY === 'hidden' || cs.overflowY === 'clip'
      const clipsX = cs.overflowX === 'hidden' || cs.overflowX === 'clip'
      const clamped =
        cs.getPropertyValue('-webkit-line-clamp') !== 'none' &&
        cs.getPropertyValue('-webkit-line-clamp') !== ''
      if (clipsY && !clamped && he.scrollHeight > he.clientHeight + 1)
        push(
          'text-clipped',
          el,
          `scrollHeight ${he.scrollHeight} > clientHeight ${he.clientHeight}`,
        )
      if (
        clipsX &&
        cs.textOverflow !== 'ellipsis' &&
        he.scrollWidth > he.clientWidth + 1
      )
        push(
          'text-clipped',
          el,
          `scrollWidth ${he.scrollWidth} > clientWidth ${he.clientWidth}`,
        )
    }

    // 7. Images load and keep their shape.
    if (el instanceof HTMLImageElement && el.getAttribute('src')) {
      if (el.complete && el.naturalWidth === 0)
        push('image-broken', el, `src ${el.currentSrc || el.src}`)
      else if (
        el.complete &&
        el.naturalWidth > 0 &&
        cs.objectFit === 'fill' &&
        cs.content === 'normal'
      ) {
        const w =
          box.width -
          px(cs.paddingLeft) -
          px(cs.paddingRight) -
          px(cs.borderLeftWidth) -
          px(cs.borderRightWidth)
        const h =
          box.height -
          px(cs.paddingTop) -
          px(cs.paddingBottom) -
          px(cs.borderTopWidth) -
          px(cs.borderBottomWidth)
        const natural = el.naturalWidth / el.naturalHeight
        if (w > 8 && h > 8 && Math.abs(w / h / natural - 1) > 0.02)
          push(
            'image-stretched',
            el,
            `rendered ${r(w / h)} vs natural ${r(natural)}`,
          )
      }
    }
  }

  // 3. Grids: no implicit rows past a declared template, no empty items.
  const grids = all.filter((el) => {
    if (!visible(el)) return false
    const d = getComputedStyle(el).display
    return d === 'grid' || d === 'inline-grid'
  })
  const countTracks = (value: string): number | null => {
    const v = value.replace(/\[[^\]]*\]/g, ' ').trim()
    if (!v || v === 'none' || v === 'subgrid' || v === 'masonry') return null
    if (/repeat\(\s*auto-(fill|fit)/.test(v)) return null
    let count = 0
    let depth = 0
    let token = ''
    const flush = () => {
      const t = token.trim()
      token = ''
      if (!t) return
      const rep = /^repeat\(\s*(\d+)\s*,(.*)\)$/.exec(t)
      count += rep ? Number(rep[1]) * (countTracks(rep[2]) ?? 1) : 1
    }
    for (const ch of v) {
      if (ch === '(') depth++
      if (ch === ')') depth--
      if (/\s/.test(ch) && depth === 0) flush()
      else token += ch
    }
    flush()
    return count
  }
  const resolved = grids.map((g) => {
    const cs = getComputedStyle(g)
    return {
      rows: countTracks(cs.gridTemplateRows) ?? 0,
      flow: cs.gridAutoFlow,
    }
  })
  for (const g of grids) {
    for (const item of layoutChildren(g)) {
      const ib = item.getBoundingClientRect()
      if (ib.width > 0 || ib.height > 0 || !visible(item)) continue
      const filled = Array.from(item.querySelectorAll('*')).some((d) => {
        const db = d.getBoundingClientRect()
        return db.width > 0 && db.height > 0
      })
      if (filled)
        push(
          'grid-empty-item',
          item,
          `0x0 grid item in ${describe(g).split(' "')[0]} with visible content`,
        )
    }
  }
  /* A grid container's resolved `grid-template-rows` lists every track,
     implicit ones included; with the grid taken out of layout it reads back
     the declared template instead. Done last, in one batch, and restored. */
  const saved = grids.map((g) =>
    (g as HTMLElement).style.getPropertyValue('display'),
  )
  const savedPriority = grids.map((g) =>
    (g as HTMLElement).style.getPropertyPriority('display'),
  )
  grids.forEach((g) =>
    (g as HTMLElement).style.setProperty('display', 'none', 'important'),
  )
  const declared = grids.map((g) => {
    const cs = getComputedStyle(g)
    const rows = countTracks(cs.gridTemplateRows)
    const areas =
      cs.gridTemplateAreas === 'none'
        ? null
        : (cs.gridTemplateAreas.match(/"[^"]*"/g) ?? []).length
    return rows === null && areas === null
      ? null
      : Math.max(rows ?? 0, areas ?? 0)
  })
  grids.forEach((g, i) =>
    (g as HTMLElement).style.setProperty('display', saved[i], savedPriority[i]),
  )
  grids.forEach((g, i) => {
    const explicit = declared[i]
    if (explicit === null || resolved[i].flow.startsWith('column')) return
    if (resolved[i].rows > explicit)
      push(
        'grid-implicit-rows',
        g,
        `${resolved[i].rows} rows rendered, template declares ${explicit}`,
      )
  })

  // 4. Centred flex rows keep their items on one centre line.
  for (const el of all) {
    if (inSvg(el) || !visible(el)) continue
    const cs = getComputedStyle(el)
    if (
      !/flex$/.test(cs.display) ||
      !cs.flexDirection.startsWith('row') ||
      cs.alignItems !== 'center'
    )
      continue
    const items = layoutChildren(el).filter((item) => {
      const s = getComputedStyle(item)
      const b = item.getBoundingClientRect()
      return (
        visible(item) &&
        b.width > 0 &&
        b.height > 0 &&
        !srOnly(item, s) &&
        (s.position === 'static' || s.position === 'relative') &&
        (s.alignSelf === 'auto' || s.alignSelf === 'center') &&
        s.transform === 'none'
      )
    })
    /* Bare text is a flex item too (an anonymous one): a label written as
       text beside a chip element is exactly the pair that drifted apart. */
    const boxes: { box: DOMRect; label: string }[] = items.map((item) => ({
      box: item.getBoundingClientRect(),
      label: describe(item),
    }))
    for (const node of el.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE || !(node.textContent ?? '').trim())
        continue
      const range = document.createRange()
      range.selectNodeContents(node)
      const box = range.getBoundingClientRect()
      if (box.width > 0 && box.height > 0)
        boxes.push({
          box,
          label: `text "${(node.textContent ?? '').trim().slice(0, 30)}"`,
        })
    }
    if (boxes.length < 2) continue
    // Group wrapped lines: items whose vertical spans overlap share a line.
    const lines: (typeof boxes)[] = []
    for (const item of boxes.sort((a, b) => a.box.top - b.box.top)) {
      const b = item.box
      const line =
        cs.flexWrap === 'nowrap'
          ? lines[0]
          : lines.find((l) =>
              l.some((o) => b.top < o.box.bottom && b.bottom > o.box.top),
            )
      if (line) line.push(item)
      else lines.push([item])
    }
    for (const line of lines) {
      if (line.length < 2) continue
      const centres = line.map(({ box }) => (box.top + box.bottom) / 2)
      const spread = Math.max(...centres) - Math.min(...centres)
      if (spread > 2) {
        const high = line[centres.indexOf(Math.min(...centres))]
        const low = line[centres.indexOf(Math.max(...centres))]
        push(
          'flex-off-centre',
          el,
          `items ${r(spread)}px apart: ${high.label} above ${low.label}`,
        )
      }
    }
  }

  // 6, 8, 9. Interactive targets.
  const hoverless = matchMedia('(hover: none)').matches
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(
      'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => {
    if (inSvg(el) || !visible(el)) return false
    const cs = getComputedStyle(el)
    if (srOnly(el, cs) || cs.pointerEvents === 'none') return false
    const b = el.getBoundingClientRect()
    return b.width > 0 && b.height > 0 && b.right > 0 && b.left < vw
  })
  /* Ancestors that are themselves targets are a single target to a pointer. */
  const leaves = targets.filter(
    (t) => !targets.some((o) => o !== t && t.contains(o)),
  )
  const opacity = (el: Element) => {
    let o = 1
    for (let a: Element | null = el; a; a = a.parentElement)
      o *= Number(getComputedStyle(a).opacity)
    return o
  }
  /* WCAG 2.5.8 exempts a link inside a sentence: its size is set by the text. */
  const inSentence = (el: HTMLElement) => {
    if (getComputedStyle(el).display !== 'inline') return false
    let block = el.parentElement
    while (block && getComputedStyle(block).display.startsWith('inline'))
      block = block.parentElement
    const own = (el.textContent ?? '').trim().length
    const around = (block?.textContent ?? '').replace(/\s+/g, ' ').trim().length
    return around > own + 12
  }
  const rects = leaves.map((t) => t.getBoundingClientRect())
  /* Whether a tap on the target's centre reaches it, i.e. it is painted on
     top there. Needs the point on screen, so the target is scrolled to the
     middle of the viewport first (clear of a sticky header). */
  const reachable = (t: HTMLElement) => {
    t.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: 'instant',
    })
    const b = t.getBoundingClientRect()
    const hit = document.elementFromPoint(
      (b.left + b.right) / 2,
      (b.top + b.bottom) / 2,
    )
    return Boolean(hit && (hit === t || t.contains(hit)))
  }
  const contains = (outer: DOMRect, inner: DOMRect) =>
    outer.left <= inner.left + 0.5 &&
    outer.right >= inner.right - 0.5 &&
    outer.top <= inner.top + 0.5 &&
    outer.bottom >= inner.bottom - 0.5
  /* A card's stretched link encloses the card's own small links and is
     painted beneath them: it is their container, not a neighbour. A mis-tap
     next to a topic opens the card, which is where the reader already was
     heading. Both stay reachable, so the pair is not a conflict. */
  const reachCache = new Map<HTMLElement, boolean>()
  const isReachable = (t: HTMLElement) => {
    if (!reachCache.has(t)) reachCache.set(t, reachable(t))
    return reachCache.get(t)!
  }
  const encloses = (i: number, j: number) =>
    contains(rects[i], rects[j]) && isReachable(leaves[j])
  leaves.forEach((t, i) => {
    const b = rects[i]
    if (b.width < 24 || b.height < 24) {
      if (inSentence(t)) return
      /* The spacing exception: a 24px circle on the target's centre must not
         touch any other target. */
      const cx = (b.left + b.right) / 2
      const cy = (b.top + b.bottom) / 2
      const crowded = rects.some((o, j) => {
        if (j === i || encloses(j, i)) return false
        const dx = Math.max(o.left - cx, 0, cx - o.right)
        const dy = Math.max(o.top - cy, 0, cy - o.bottom)
        return dx * dx + dy * dy < 144
      })
      if (crowded)
        push(
          'target-size',
          t,
          `${r(b.width)}x${r(b.height)} < 24x24 and crowded`,
        )
    }
    if (hoverless && opacity(t) < 0.05 && !t.matches(':focus-within'))
      push(
        'target-hidden-without-hover',
        t,
        'tappable but invisible on a hover-less device',
      )
  })
  for (const sel of promised)
    for (const t of document.querySelectorAll(sel)) {
      if (!visible(t)) continue
      const b = t.getBoundingClientRect()
      if (b.width > 0 && (b.width < 43.5 || b.height < 43.5))
        push(
          'target-44',
          t,
          `${r(b.width)}x${r(b.height)}; ${sel} promises 44x44`,
        )
    }
  for (let i = 0; i < leaves.length; i++)
    for (let j = i + 1; j < leaves.length; j++) {
      const a = rects[i]
      const b = rects[j]
      const w = Math.min(a.right, b.right) - Math.max(a.left, b.left)
      const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
      if (w > 2 && h > 2 && !encloses(i, j) && !encloses(j, i))
        push(
          'target-overlap',
          leaves[i],
          `overlaps ${describe(leaves[j])} by ${r(w)}x${r(h)}`,
        )
    }

  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  return out
}
