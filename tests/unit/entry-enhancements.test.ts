import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import {
  mountCodeBlocks,
  mountEntryEnhancements,
  mountFigures,
  mountLocaleAnchor,
  mountSectionLinks,
  mountTocHighlight,
  withAnchor,
} from '@/lib/entry-enhancements'

/* jsdom ships `<dialog>` without `showModal`/`close`. Stand in the part of the
   browser contract the viewer relies on: `open` toggles, `close` fires the
   `close` event, and Escape on an open modal closes it. */
beforeAll(() => {
  const proto = HTMLDialogElement.prototype as HTMLDialogElement & {
    showModal: () => void
    close: () => void
  }
  proto.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
    this.querySelector<HTMLElement>('button')?.focus()
  }
  proto.close = function (this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    document
      .querySelectorAll<HTMLDialogElement>('dialog[open]')
      .forEach((dialog) => dialog.close())
  })
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const page = (prose: string, extra = '') => {
  document.body.innerHTML = `
    <main class="entry-page" data-copy="Copiar" data-copied="Copiado">
      <div class="read-progress"><span data-read-progress></span></div>
      <article class="prose">${prose}</article>
      ${extra}
      <dialog class="lightbox" data-entry-lightbox
        data-open-label="Abrir imagen" data-fallback-label="Imagen">
        <button type="button" data-lightbox-close aria-label="Cerrar">x</button>
      </dialog>
    </main>`
  return document.querySelector<HTMLElement>('.entry-page')!
}

describe('code blocks', () => {
  it('wraps each block once, with its language and a localized copy button', async () => {
    const root = page(
      '<pre class="astro-code" data-language="kotlin"><code>val a = 1\nval b = 2</code></pre>',
    )
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    mountCodeBlocks(root)
    mountCodeBlocks(root)

    expect(root.querySelectorAll('.code-block')).toHaveLength(1)
    expect(root.querySelector('.code-block__lang')?.textContent).toBe('kotlin')
    const button = root.querySelector<HTMLButtonElement>('.code-block__copy')!
    expect(button.textContent).toBe('Copiar')
    button.click()
    await vi.waitFor(() => expect(button.textContent).toBe('Copiado'))
    expect(writeText).toHaveBeenCalledWith('val a = 1\nval b = 2')
  })

  it('leaves plaintext unlabelled', () => {
    const root = page(
      '<pre class="astro-code" data-language="plaintext"><code>x</code></pre>',
    )
    mountCodeBlocks(root)
    expect(root.querySelector('.code-block__lang')?.textContent).toBe('')
  })
})

describe('image viewer', () => {
  it('turns a standalone image into a captioned figure behind a named button', () => {
    const root = page('<p><img src="/a.png" alt="A chart"></p>')
    mountFigures(root)
    const figure = root.querySelector('.prose figure')!
    const button = figure.querySelector<HTMLButtonElement>(
      'button.zoom-trigger',
    )!
    expect(button.getAttribute('aria-label')).toBe('Abrir imagen: A chart')
    expect(button.querySelector('img')).not.toBeNull()
    expect(figure.querySelector('figcaption')?.textContent).toBe('A chart')
  })

  it('opens a named dialog and returns focus to the image on close', () => {
    const root = page('<p><img src="/a.png" alt="A chart"></p>')
    mountFigures(root)
    const dialog = root.querySelector<HTMLDialogElement>('dialog')!
    const button = root.querySelector<HTMLButtonElement>('.zoom-trigger')!

    button.focus()
    button.click()
    expect(dialog.hasAttribute('open')).toBe(true)
    expect(dialog.getAttribute('aria-label')).toBe('A chart')
    expect(
      dialog.querySelector<HTMLImageElement>('.lightbox__image')?.alt,
    ).toBe('A chart')
    expect(document.activeElement).toBe(
      dialog.querySelector('[data-lightbox-close]'),
    )

    dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]')!.click()
    expect(dialog.hasAttribute('open')).toBe(false)
    expect(dialog.querySelector('.lightbox__image')).toBeNull()
    expect(document.activeElement).toBe(button)
  })

  it('closes on Escape and on a backdrop click, returning focus each time', () => {
    const root = page('<p><img src="/a.png" alt=""></p>')
    mountFigures(root)
    const dialog = root.querySelector<HTMLDialogElement>('dialog')!
    const button = root.querySelector<HTMLButtonElement>('.zoom-trigger')!

    button.click()
    // An image with no alt still gets a named dialog and a named button.
    expect(dialog.getAttribute('aria-label')).toBe('Imagen')
    expect(button.getAttribute('aria-label')).toBe('Abrir imagen')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(dialog.hasAttribute('open')).toBe(false)
    expect(document.activeElement).toBe(button)

    button.click()
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(dialog.hasAttribute('open')).toBe(false)
    expect(document.activeElement).toBe(button)
  })

  it('leaves linked images alone and offers no viewer without a dialog', () => {
    const root = page(
      '<p><a href="/x"><img src="/l.png" alt="linked"></a></p><p><img src="/b.png" alt="B"></p>',
    )
    root.querySelector('dialog')!.remove()
    mountFigures(root)
    expect(root.querySelectorAll('.zoom-trigger')).toHaveLength(0)
    expect(root.querySelector('a img')).not.toBeNull()
    expect(root.querySelectorAll('figure')).toHaveLength(1)
  })
})

/* jsdom has no IntersectionObserver; capture the callback so a test can say
   which heading is in view. */
const stubObserver = () => {
  let notify: (entries: Partial<IntersectionObserverEntry>[]) => void = () =>
    undefined
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: typeof notify) {
        notify = callback
      }
      observe() {}
      disconnect() {}
    },
  )
  return (id: string) =>
    notify([
      {
        isIntersecting: true,
        target: document.getElementById(id)!,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ])
}

const rect = (top: number, height: number) =>
  ({ top, bottom: top + height, height }) as DOMRect

describe('contents marker', () => {
  it('marks the link of the section in view', () => {
    const show = stubObserver()
    const root = page(
      '<h2 id="one">One</h2><h2 id="two">Two</h2>',
      '<ol data-toc><li><a href="#one">One</a></li><li><a href="#two">Two</a></li></ol>',
    )
    mountTocHighlight(root)
    show('two')
    expect(
      root.querySelector('a[href="#two"]')?.getAttribute('aria-current'),
    ).toBe('true')
    expect(
      root.querySelector('a[href="#one"]')?.hasAttribute('aria-current'),
    ).toBe(false)
  })

  it('marks the same section in every contents on the page', () => {
    /* The desktop index and the phone contents both list the section; one
       id → one link lost the marker on whichever rendered second. */
    const show = stubObserver()
    const root = page(
      '<h2 id="one">One</h2>',
      '<ol data-toc><li><a href="#one">One</a></li></ol><ol data-toc><li><a href="#one">One</a></li></ol>',
    )
    mountTocHighlight(root)
    show('one')
    expect(root.querySelectorAll('a[aria-current="true"]')).toHaveLength(2)
  })

  it('opens the part being read and closes the one it opened before', () => {
    const show = stubObserver()
    const root = page(
      '<section id="part-1"><h3 id="a">A</h3></section><section id="part-2"><h3 id="b">B</h3></section>',
      `<ol data-toc>
        <li><a href="#part-1">One</a><details data-toc-part><summary>1</summary><ol><li><a href="#a">A</a></li></ol></details></li>
        <li><a href="#part-2">Two</a><details data-toc-part><summary>1</summary><ol><li><a href="#b">B</a></li></ol></details></li>
      </ol>`,
    )
    const [first, second] = root.querySelectorAll('details')
    mountTocHighlight(root)
    show('a')
    expect(first.open).toBe(true)
    expect(second.open).toBe(false)
    // The part title itself is in view: its own group opens.
    show('part-2')
    expect(first.open).toBe(false)
    expect(second.open).toBe(true)
  })

  it('leaves a part the reader opened by hand alone', () => {
    const show = stubObserver()
    const root = page(
      '<section id="part-1"><h3 id="a">A</h3></section><section id="part-2"><h3 id="b">B</h3></section>',
      `<ol data-toc>
        <li><a href="#part-1">One</a><details data-toc-part open><summary>1</summary><ol><li><a href="#a">A</a></li></ol></details></li>
        <li><a href="#part-2">Two</a><details data-toc-part><summary>1</summary><ol><li><a href="#b">B</a></li></ol></details></li>
      </ol>`,
    )
    mountTocHighlight(root)
    show('b')
    expect(root.querySelectorAll('details')[0].open).toBe(true)
  })

  it('scrolls only the index to keep the active link in view', () => {
    const show = stubObserver()
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const root = page(
      '<h2 id="one">One</h2><h2 id="far">Far</h2>',
      '<ol data-toc data-toc-scroll><li><a href="#one">One</a></li><li><a href="#far">Far</a></li></ol>',
    )
    const list = root.querySelector<HTMLElement>('[data-toc-scroll]')!
    const far = root.querySelector<HTMLElement>('a[href="#far"]')!
    vi.spyOn(list, 'getBoundingClientRect').mockReturnValue(rect(100, 400))
    vi.spyOn(far, 'getBoundingClientRect').mockReturnValue(rect(620, 30))
    list.scrollTop = 0

    mountTocHighlight(root)
    show('far')

    // 620 + 30 - (100 + 400) = 150 past the bottom edge, plus breathing room.
    expect(list.scrollTop).toBeGreaterThanOrEqual(150)
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('tracks a part by its title, not by the whole section', () => {
    /* A part's section stays in the band for as long as the reader is inside
       it, so it outranked the heading actually in view after any jump. The
       part is watched through its title heading instead. */
    let observed: Element[] = []
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe(element: Element) {
          observed.push(element)
        }
        disconnect() {}
      },
    )
    const root = page(
      '<section id="part-1"><h2>One</h2><h3 id="a">A</h3></section>',
      '<ol data-toc><li><a href="#part-1">One</a></li><li><a href="#a">A</a></li></ol>',
    )
    mountTocHighlight(root)
    expect(observed.map((element) => element.tagName)).toEqual(['H2', 'H3'])
    observed = []
  })

  it('reports each newly active section', () => {
    const show = stubObserver()
    const root = page(
      '<h2 id="one">One</h2>',
      '<ol data-toc><li><a href="#one">One</a></li></ol>',
    )
    const seen: string[] = []
    mountTocHighlight(root, (id) => seen.push(id))
    show('one')
    show('one')
    expect(seen).toEqual(['one'])
  })
})

describe('section links', () => {
  const template = `<template data-section-link data-label="Enlace a la sección"><a class="heading-anchor"><svg aria-hidden="true"></svg></a></template>`

  it('gives every anchored heading a named, focusable self-link', () => {
    const root = page(
      '<h2 id="cambios">Cambios <code>API</code></h2><h3 id="detalle">Detalle</h3><h4 id="x">X</h4>',
      template,
    )
    mountSectionLinks(root)
    mountSectionLinks(root)
    const links = root.querySelectorAll<HTMLAnchorElement>('.heading-anchor')
    expect(links).toHaveLength(2)
    expect(links[0].getAttribute('href')).toBe('#cambios')
    expect(links[0].getAttribute('aria-label')).toBe(
      'Enlace a la sección: Cambios API',
    )
    expect(links[0].tabIndex).toBe(0)
  })

  it('keeps the heading named by its text, not by the link inside it', () => {
    const root = page('<h2 id="cambios">Cambios</h2>', template)
    mountSectionLinks(root)
    const heading = root.querySelector('h2')!
    const label = document.getElementById(
      heading.getAttribute('aria-labelledby')!,
    )
    expect(label?.textContent).toBe('Cambios')
    expect(label?.contains(heading.querySelector('.heading-anchor'))).toBe(
      false,
    )
  })

  it('does nothing without the server-rendered template', () => {
    const root = page('<h2 id="a">A</h2>')
    mountSectionLinks(root)
    expect(root.querySelector('.heading-anchor')).toBeNull()
  })
})

describe('language switch', () => {
  it('appends an anchor, replacing any it already had', () => {
    expect(withAnchor('/es/notes/x/', 'cierre')).toBe('/es/notes/x/#cierre')
    expect(withAnchor('/es/notes/x/#old', 'cierre')).toBe('/es/notes/x/#cierre')
    expect(withAnchor('/es/notes/x/#old', undefined)).toBe('/es/notes/x/')
  })

  const switchPage = (anchors?: string) => {
    const root = page('<h2 id="setup">Setup</h2>')
    if (anchors) root.dataset.counterpartAnchors = anchors
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<a data-locale-control href="/es/notes/x/">ES</a>',
    )
    return {
      root,
      link: document.querySelector<HTMLAnchorElement>('[data-locale-control]')!,
    }
  }

  it('points the switch at the same heading in the other language', () => {
    const { root, link } = switchPage('{"setup":"preparacion"}')
    const sync = mountLocaleAnchor(root)
    sync('setup')
    expect(link.getAttribute('href')).toBe('/es/notes/x/#preparacion')
    sync('unknown')
    expect(link.getAttribute('href')).toBe('/es/notes/x/')
  })

  it('leaves the switch at the top of the page without a mapping', () => {
    const { root, link } = switchPage()
    mountLocaleAnchor(root)('setup')
    expect(link.getAttribute('href')).toBe('/es/notes/x/')
  })

  it('ignores a malformed mapping instead of breaking the page', () => {
    const { root, link } = switchPage('{not json')
    expect(() => mountLocaleAnchor(root)('setup')).not.toThrow()
    expect(link.getAttribute('href')).toBe('/es/notes/x/')
  })
})

describe('mounting', () => {
  it('does nothing without a long-form page', () => {
    expect(() => mountEntryEnhancements(null)).not.toThrow()
  })

  it('mounts every enhancement on the page it is given', () => {
    const root = page(
      '<pre class="astro-code" data-language="ts"><code>x</code></pre><p><img src="/a.png" alt="A"></p>',
    )
    vi.stubGlobal('requestAnimationFrame', (callback: () => void) => {
      callback()
      return 0
    })
    mountEntryEnhancements(root)
    expect(root.querySelector('.code-block__copy')).not.toBeNull()
    expect(root.querySelector('.zoom-trigger')).not.toBeNull()
    expect(
      root.querySelector<HTMLElement>('[data-read-progress]')?.style.transform,
    ).toBe('scaleX(0)')
  })
})
