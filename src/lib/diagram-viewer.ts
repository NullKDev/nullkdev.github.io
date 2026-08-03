/**
 * Zoom and pan for rendered mermaid diagrams.
 *
 * Mermaid draws at a fixed intrinsic size, so a diagram is either wider than
 * the column on a phone or narrower than it on a desktop. Its own answer is to
 * scale the whole drawing to fit, which solves the first case by taking a
 * 651px diagram to 47% and its 12px labels with it. So the pane scrolls and the
 * reader zooms instead, and type never falls below what it was drawn at.
 *
 * Progressive enhancement: without this the `.mermaid` block is still a framed,
 * scrollable figure. Nothing here is required to read the diagram.
 *
 * The toolbar is cloned from a `<template>` rendered on the server rather than
 * built here, which is what keeps its marks coming from the icon registry and
 * its labels from the locale dictionary — see `DiagramControls.astro`.
 */

const MIN = 0.4
const MAX = 3
/** Horizontal padding of the pane, excluded when measuring the space to fill. */
const PANE_PADDING = 48

const widthOf = (element: SVGElement): number => {
  const viewBox = element.getAttribute('viewBox')?.split(/\s+/).map(Number)
  return viewBox?.[2] ?? element.getBoundingClientRect().width
}

const build = (node: HTMLElement, controls: HTMLTemplateElement): boolean => {
  let svg = node.querySelector('svg')
  if (!svg || node.closest('.diagram')) return false

  let intrinsic = widthOf(svg)
  if (!intrinsic) return false

  const bar = controls.content.firstElementChild?.cloneNode(true) as
    HTMLElement | undefined
  if (!bar) return false
  const readout = bar.querySelector<HTMLElement>('[data-zoom-readout]')

  const figure = document.createElement('figure')
  figure.className = 'diagram'
  node.replaceWith(figure)

  const pane = document.createElement('div')
  pane.className = 'diagram__pane'
  // Focusable so the diagram can be scrolled from the keyboard.
  pane.tabIndex = 0
  pane.appendChild(node)

  let zoom = 1
  const apply = () => {
    if (!svg) return
    svg.style.maxWidth = 'none'
    svg.style.width = `${Math.round(intrinsic * zoom)}px`
    svg.style.height = 'auto'
    if (readout) readout.textContent = `${Math.round(zoom * 100)}%`
  }
  const set = (next: number) => {
    zoom = Math.min(MAX, Math.max(MIN, Number(next.toFixed(2))))
    apply()
  }
  /* Pressing "fit to width" fits, in both directions. An earlier version
     refused to shrink — protecting legibility — which made the control do
     nothing on exactly the diagrams a reader would press it for. Trading
     readable labels for an overview is the reader's call to make. */
  const fit = () => set((pane.clientWidth - PANE_PADDING) / intrinsic)

  const steps: Record<string, () => void> = {
    out: () => set(zoom - 0.2),
    in: () => set(zoom + 0.2),
    fit,
  }
  bar.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((item) => {
    const step = steps[item.dataset.zoom ?? '']
    if (step) item.addEventListener('click', step)
  })

  figure.append(pane, bar)
  /* Opens at the size mermaid drew, every time. Scaling to fill the column
     sounds tidier but pushes a tall diagram past the pane's height, so the
     reader lands on a fragment of it; and scaling down to fit is what made the
     labels unreadable to begin with. 100% is the one size known to be legible,
     and both buttons lead away from it. */
  apply()

  /* Toggling the theme makes mermaid redraw and swap in a brand-new <svg>.
     Without re-acquiring it the controls keep sizing a detached element: the
     readout still counts up and the diagram never moves. Comparing identity is
     what keeps `apply()` from retriggering this forever. */
  new MutationObserver(() => {
    const current = node.querySelector('svg')
    if (!current || current === svg) return
    svg = current
    intrinsic = widthOf(current) || intrinsic
    apply()
  }).observe(node, { childList: true, subtree: true })

  return true
}

/**
 * Attach a viewer to every mermaid block inside `selector`.
 *
 * Safe to call before mermaid has drawn anything: it renders on the client, so
 * the `<svg>` usually does not exist yet and enhancing straight away finds
 * nothing at all. Each block is upgraded now if it is already drawn, and
 * watched until it is otherwise.
 */
export const mountDiagramViewers = (selector = '.entry-page .prose'): void => {
  const controls = document.querySelector<HTMLTemplateElement>(
    '[data-diagram-controls]',
  )
  if (!controls) return

  document
    .querySelectorAll<HTMLElement>(`${selector} .mermaid`)
    .forEach((node) => {
      if (build(node, controls)) return
      const observer = new MutationObserver(() => {
        if (build(node, controls)) observer.disconnect()
      })
      observer.observe(node, { childList: true, subtree: true })
    })
}
