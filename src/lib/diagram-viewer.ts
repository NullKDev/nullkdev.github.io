/**
 * Zoom controls for build-time diagrams.
 *
 * The diagram already arrives sized: `scripts/hast-diagrams.mjs` writes its
 * fitted width into the figure, and CSS fills the column with it. This only
 * adds the reader's override — zoom in to read a dense drawing, zoom out for an
 * overview, drag or scroll the pane to move around, reset to the fitted size.
 *
 * The pane is a fixed window while zoomed. Letting it grow with the drawing
 * pushed the article down on every press, so the reader lost their place in
 * the text to look at a diagram. Its height is locked on the first zoom and
 * released on reset; everything outside the figure stays where it was.
 *
 * Progressive enhancement: without this the figure is still a complete,
 * scrollable diagram at its fitted size. Nothing here is required to read it.
 *
 * The toolbar is cloned from a `<template>` rendered on the server rather than
 * built here, which is what keeps its marks coming from the icon registry and
 * its labels from the locale dictionary — see `DiagramControls.astro`.
 */

const MIN = 0.5
const MAX = 3
const STEP = 0.25

/** The point at the centre of the pane, as a share of its scrollable content. */
const centreOf = (pane: HTMLElement) => ({
  x: (pane.scrollLeft + pane.clientWidth / 2) / pane.scrollWidth,
  y: (pane.scrollTop + pane.clientHeight / 2) / pane.scrollHeight,
})

/**
 * Drag to pan, for a mouse. Touch already pans an overflowing pane natively,
 * and taking it over here would break that and the page scroll with it.
 */
const enableDrag = (pane: HTMLElement): void => {
  let origin: { x: number; y: number; left: number; top: number } | undefined

  pane.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    if (!pane.classList.contains('is-zoomed')) return
    origin = {
      x: event.clientX,
      y: event.clientY,
      left: pane.scrollLeft,
      top: pane.scrollTop,
    }
    pane.setPointerCapture(event.pointerId)
    pane.classList.add('is-dragging')
  })
  pane.addEventListener('pointermove', (event) => {
    if (!origin) return
    pane.scrollLeft = origin.left - (event.clientX - origin.x)
    pane.scrollTop = origin.top - (event.clientY - origin.y)
  })
  const release = () => {
    origin = undefined
    pane.classList.remove('is-dragging')
  }
  pane.addEventListener('pointerup', release)
  pane.addEventListener('pointercancel', release)
}

const build = (figure: HTMLElement, controls: HTMLTemplateElement): void => {
  const pane = figure.querySelector<HTMLElement>('.diagram__pane')
  const svg = pane?.querySelector<SVGSVGElement>(':scope > svg')
  const bar = controls.content.firstElementChild?.cloneNode(true) as
    HTMLElement | undefined
  if (!pane || !svg || !bar) return
  const readout = bar.querySelector<HTMLElement>('[data-zoom-readout]')

  let zoom = 1
  // Measured on the first zoom, not at mount: the fitted width depends on the
  // column, and the column can change between page load and the first press.
  let fitted = 0

  const set = (next: number) => {
    const target = Math.min(MAX, Math.max(MIN, Number(next.toFixed(2))))
    if (target === zoom) return

    if (zoom === 1) {
      fitted = svg.getBoundingClientRect().width
      pane.style.height = `${pane.getBoundingClientRect().height}px`
    }
    const centre = centreOf(pane)
    zoom = target

    if (zoom === 1) {
      // Hand sizing back to CSS, so the diagram keeps tracking the column.
      svg.style.removeProperty('width')
      svg.style.removeProperty('min-width')
      pane.style.removeProperty('height')
      pane.classList.remove('is-zoomed')
    } else {
      svg.style.width = `${Math.round(fitted * zoom)}px`
      svg.style.minWidth = '0'
      pane.classList.add('is-zoomed')
      // Keep the point the reader was looking at under the same spot.
      pane.scrollLeft = centre.x * pane.scrollWidth - pane.clientWidth / 2
      pane.scrollTop = centre.y * pane.scrollHeight - pane.clientHeight / 2
    }
    if (readout) readout.textContent = `${Math.round(zoom * 100)}%`
  }

  const steps: Record<string, () => void> = {
    out: () => set(zoom - STEP),
    in: () => set(zoom + STEP),
    fit: () => set(1),
  }
  bar.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((item) => {
    const step = steps[item.dataset.zoom ?? '']
    if (step) item.addEventListener('click', step)
  })

  enableDrag(pane)
  figure.append(bar)
  if (readout) readout.textContent = '100%'
}

/** Attach zoom controls to every diagram inside `selector`. */
export const mountDiagramViewers = (selector = '.entry-page .prose'): void => {
  const controls = document.querySelector<HTMLTemplateElement>(
    '[data-diagram-controls]',
  )
  if (!controls) return

  document
    .querySelectorAll<HTMLElement>(`${selector} figure.diagram`)
    .forEach((figure) => build(figure, controls))
}
