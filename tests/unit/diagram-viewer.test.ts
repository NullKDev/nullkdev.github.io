import { afterEach, describe, expect, it, vi } from 'vitest'

import { mountDiagramViewers } from '@/lib/diagram-viewer'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const CONTROLS = `
  <template data-diagram-controls>
    <div class="diagram__bar" role="group" aria-label="Diagram">
      <button type="button" data-zoom="out" aria-label="Zoom out">-</button>
      <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
      <button type="button" data-zoom="fit" aria-label="Fit">=</button>
      <span class="diagram__readout" role="status" data-zoom-readout></span>
    </div>
  </template>`

const mount = () => {
  document.body.innerHTML = `${CONTROLS}
    <main class="entry-page"><article class="prose">
      <figure class="diagram"><div class="diagram__pane"><svg></svg></div></figure>
    </article></main>`
  const figure = document.querySelector<HTMLElement>('figure.diagram')!
  const pane = figure.querySelector<HTMLElement>('.diagram__pane')!
  const svg = pane.querySelector('svg')!
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    width: 400,
  } as DOMRect)
  vi.spyOn(pane, 'getBoundingClientRect').mockReturnValue({
    height: 300,
  } as DOMRect)
  mountDiagramViewers()
  const press = (action: string) =>
    figure.querySelector<HTMLButtonElement>(`[data-zoom="${action}"]`)!.click()
  const readout = () =>
    figure.querySelector('[data-zoom-readout]')?.textContent ?? null
  return { figure, pane, svg, press, readout }
}

describe('diagram viewer', () => {
  it('attaches the localized toolbar and starts at 100% without announcing a change', () => {
    const { figure, readout } = mount()
    expect(figure.querySelector('.diagram__bar')).not.toBeNull()
    expect(readout()).toBe('100%')
  })

  it('zooms in steps of 25% from the fitted width and locks the pane height', () => {
    const { pane, svg, press, readout } = mount()
    press('in')
    expect(readout()).toBe('125%')
    expect(svg.style.width).toBe('500px')
    expect(pane.style.height).toBe('300px')
    expect(pane.classList.contains('is-zoomed')).toBe(true)
    press('in')
    expect(readout()).toBe('150%')
    expect(svg.style.width).toBe('600px')
  })

  it('releases the height and hands sizing back to CSS on fit', () => {
    const { pane, svg, press, readout } = mount()
    press('in')
    press('fit')
    expect(readout()).toBe('100%')
    expect(svg.style.width).toBe('')
    expect(pane.style.height).toBe('')
    expect(pane.classList.contains('is-zoomed')).toBe(false)
  })

  it('clamps between 50% and 300%', () => {
    const { press, readout } = mount()
    for (let index = 0; index < 5; index += 1) press('out')
    expect(readout()).toBe('50%')
    for (let index = 0; index < 20; index += 1) press('in')
    expect(readout()).toBe('300%')
  })

  it('does nothing when the page has no toolbar template', () => {
    document.body.innerHTML = `<main class="entry-page"><article class="prose">
      <figure class="diagram"><div class="diagram__pane"><svg></svg></div></figure>
    </article></main>`
    mountDiagramViewers()
    expect(document.querySelector('.diagram__bar')).toBeNull()
  })
})
