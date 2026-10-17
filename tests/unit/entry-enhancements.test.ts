import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import {
  mountCodeBlocks,
  mountEntryEnhancements,
  mountFigures,
  mountTocHighlight,
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

describe('contents marker', () => {
  it('marks the link of the section in view', () => {
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
    const root = page(
      '<h2 id="one">One</h2><h2 id="two">Two</h2>',
      '<ol data-toc><li><a href="#one">One</a></li><li><a href="#two">Two</a></li></ol>',
    )
    mountTocHighlight(root)
    notify([
      {
        isIntersecting: true,
        target: document.getElementById('two')!,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ])
    expect(
      root.querySelector('a[href="#two"]')?.getAttribute('aria-current'),
    ).toBe('true')
    expect(
      root.querySelector('a[href="#one"]')?.hasAttribute('aria-current'),
    ).toBe(false)
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
