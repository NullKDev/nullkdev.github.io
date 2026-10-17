/**
 * Zoom controls for build-time diagrams.
 *
 * The diagram already arrives sized: `scripts/hast-diagrams.mjs` writes its
 * fitted width into the figure, and CSS fills the column with it. This only
 * adds the reader's override — zoom in to read a dense drawing, zoom out for an
 * overview, scroll the pane to move around, reset to return to the fitted size.
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

const build = (figure: HTMLElement, controls: HTMLTemplateElement): void => {
  const svg = figure.querySelector<SVGSVGElement>('svg')
  const bar = controls.content.firstElementChild?.cloneNode(true) as
    HTMLElement | undefined
  if (!svg || !bar) return
  const readout = bar.querySelector<HTMLElement>('[data-zoom-readout]')

  let zoom = 1
  // Measured on the first zoom, not at mount: the fitted width depends on the
  // column, and the column can change between page load and the first press.
  let fitted = 0
  const apply = () => {
    if (zoom === 1) {
      // Hand sizing back to CSS, so the diagram keeps tracking the column.
      svg.style.removeProperty('width')
      svg.style.removeProperty('min-width')
    } else {
      svg.style.width = `${Math.round(fitted * zoom)}px`
      svg.style.minWidth = '0'
    }
    if (readout) readout.textContent = `${Math.round(zoom * 100)}%`
  }
  const set = (next: number) => {
    if (zoom === 1) fitted = svg.getBoundingClientRect().width
    zoom = Math.min(MAX, Math.max(MIN, Number(next.toFixed(2))))
    apply()
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

  figure.append(bar)
  apply()
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
