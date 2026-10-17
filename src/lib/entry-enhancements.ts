/**
 * Client enhancements for long-form pages: an entry (`EntryPage.astro`) and a
 * subpost read on its own URL (`DocumentPage.astro`). Both call
 * `mountEntryEnhancements`, so the same text gets the same reading tools
 * wherever it is read.
 *
 * Each one is progressive: without JavaScript the page is complete — the code
 * is still readable, the contents still link, the images still show. These
 * only add a progress bar, copy buttons, the active-section marker, section
 * self-links, a language switch that keeps the reader's place, diagram zoom
 * and an image viewer.
 *
 * Anything the browser shows comes from the server-rendered page: labels from
 * `data-*` attributes written from the locale dictionary, and the viewer's
 * close mark from the icon registry (`EntryLightbox.astro`). Client code cannot
 * import either, and building them here would ship English labels and Unicode
 * glyphs that a screen reader reads aloud.
 */
import { mountDiagramViewers } from '@/lib/diagram-viewer'

/** Reading progress: fraction of the article scrolled past the viewport. */
export const mountReadingProgress = (root: HTMLElement): void => {
  const bar = root.querySelector<HTMLElement>('[data-read-progress]')
  const article = root.querySelector<HTMLElement>('.prose')
  if (!bar || !article) return
  let ticking = false
  const update = () => {
    ticking = false
    const rect = article.getBoundingClientRect()
    const total = rect.height - window.innerHeight
    const scrolled = -rect.top
    const ratio = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0
    bar.style.transform = `scaleX(${ratio})`
  }
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
}

/** Wrap each code block with a language label and a copy button. */
export const mountCodeBlocks = (root: HTMLElement): void => {
  const copyText = root.dataset.copy ?? 'Copy'
  const copiedText = root.dataset.copied ?? 'Copied'
  root
    .querySelectorAll<HTMLPreElement>('.prose pre.astro-code')
    .forEach((pre) => {
      if (pre.parentElement?.classList.contains('code-block')) return
      const lang = pre.getAttribute('data-language') ?? ''
      const wrap = document.createElement('div')
      wrap.className = 'code-block'
      const bar = document.createElement('div')
      bar.className = 'code-block__bar'
      const label = document.createElement('span')
      label.className = 'code-block__lang'
      label.textContent = lang === 'plaintext' ? '' : lang
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'code-block__copy'
      button.textContent = copyText
      button.addEventListener('click', async () => {
        try {
          // `textContent`, not `innerText`: the copy must be the source as
          // written, whatever the layout currently hides or wraps.
          await navigator.clipboard.writeText(pre.textContent ?? '')
          button.textContent = copiedText
          button.classList.add('is-copied')
          setTimeout(() => {
            button.textContent = copyText
            button.classList.remove('is-copied')
          }, 1600)
        } catch {
          /* Clipboard may be unavailable; the code stays selectable. */
        }
      })
      bar.append(label, button)
      pre.replaceWith(wrap)
      wrap.append(bar, pre)
    })
}

const prefersReducedMotion = (): boolean =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? true

/**
 * Keep `link` visible inside its scrolling index, the way
 * `scrollIntoView({ block: 'nearest' })` would — but by moving that list only.
 * `scrollIntoView` also scrolls every scrollable ancestor, the page included,
 * and the page is exactly what the reader is scrolling.
 */
const revealInList = (list: HTMLElement, link: HTMLElement): void => {
  const box = list.getBoundingClientRect()
  const item = link.getBoundingClientRect()
  // A little air, so the active link never sits flush against the fade.
  const margin = 24
  let delta = 0
  if (item.top < box.top) delta = item.top - box.top - margin
  else if (item.bottom > box.bottom) delta = item.bottom - box.bottom + margin
  if (delta === 0) return
  const top = Math.max(0, list.scrollTop + delta)
  if (prefersReducedMotion() || typeof list.scrollTo !== 'function') {
    list.scrollTop = top
  } else {
    list.scrollTo({ top, behavior: 'smooth' })
  }
}

/**
 * The part group an index link belongs to: the `<details>` it sits in, or,
 * for a part's own title, the `<details>` beside it.
 */
const partGroupOf = (link: HTMLElement): HTMLDetailsElement | null =>
  link.closest<HTMLDetailsElement>('details[data-toc-part]') ??
  link.parentElement?.querySelector<HTMLDetailsElement>(
    ':scope > details[data-toc-part]',
  ) ??
  null

/**
 * Table of contents: mark the section currently in view as active, in every
 * contents on the page (the desktop index and the phone contents list the same
 * sections). In the desktop index it also opens the part being read, closes
 * the part it opened before — never one the reader opened — and scrolls the
 * index itself so the active link stays visible.
 */
export const mountTocHighlight = (
  root: HTMLElement,
  onActive?: (id: string) => void,
): void => {
  const tocLinks = Array.from(
    root.querySelectorAll<HTMLAnchorElement>('[data-toc] a[href^="#"]'),
  )
  if (!tocLinks.length || !('IntersectionObserver' in window)) return
  const linksById = new Map<string, HTMLAnchorElement[]>()
  const targets: HTMLElement[] = []
  const idOf = new WeakMap<Element, string>()
  tocLinks.forEach((link) => {
    const id = decodeURIComponent(link.hash.slice(1))
    const target = document.getElementById(id)
    if (!target) return
    const links = linksById.get(id)
    if (links) links.push(link)
    else {
      linksById.set(id, [link])
      /* A part's `<section>` stays in the band for as long as the reader is
         anywhere inside it, so after a jump it outranked the heading actually
         in view. Watch its title heading instead, reported as the part. */
      const watched =
        target.matches('section') && target.querySelector('h2')
          ? target.querySelector<HTMLElement>('h2')!
          : target
      idOf.set(watched, id)
      targets.push(watched)
    }
  })
  let activeId: string | null = null
  let opened: HTMLDetailsElement | null = null
  const setActive = (id: string) => {
    if (id === activeId) return
    activeId = id
    tocLinks.forEach((link) => link.removeAttribute('aria-current'))
    const links = linksById.get(id) ?? []
    links.forEach((link) => link.setAttribute('aria-current', 'true'))
    // One part per section, whichever contents the link sits in.
    const group = links.map(partGroupOf).find(Boolean) ?? null
    if (group !== opened) {
      if (opened?.dataset.autoOpen !== undefined) {
        opened.open = false
        delete opened.dataset.autoOpen
      }
      opened = null
      if (group && !group.open) {
        group.open = true
        group.dataset.autoOpen = ''
        opened = group
      }
    }
    links.forEach((link) => {
      const list = link.closest<HTMLElement>('[data-toc-scroll]')
      if (list) revealInList(list, link)
    })
    onActive?.(id)
  }
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      const first = visible[0]?.target
      if (first) setActive(idOf.get(first) ?? first.id)
    },
    { rootMargin: '-12% 0px -70% 0px', threshold: 0 },
  )
  targets.forEach((target) => observer.observe(target))
}

/**
 * A self-link on every anchored `h2`/`h3`, revealed on hover and focus, so a
 * reader can copy the address of the section they are on.
 *
 * The mark and the label come from a server-rendered `<template>` (registry
 * icon, locale dictionary). The link sits inside the heading, so the heading
 * is re-labelled by its own text: otherwise "Link to section: …" would become
 * part of every heading's name in a screen reader's headings list.
 */
export const mountSectionLinks = (root: HTMLElement): void => {
  const template = root.querySelector<HTMLTemplateElement>(
    'template[data-section-link]',
  )
  const anchor = template?.content.querySelector<HTMLAnchorElement>('a')
  if (!template || !anchor) return
  const label = template.dataset.label ?? 'Link to section'
  root
    .querySelectorAll<HTMLHeadingElement>('.prose h2[id], .prose h3[id]')
    .forEach((heading) => {
      if (heading.querySelector('.heading-anchor')) return
      const text = (heading.textContent ?? '').replace(/\s+/g, ' ').trim()
      const title = document.createElement('span')
      title.id = `${heading.id}--title`
      title.append(...Array.from(heading.childNodes))
      const link = anchor.cloneNode(true) as HTMLAnchorElement
      link.setAttribute('href', `#${heading.id}`)
      link.setAttribute('aria-label', `${label}: ${text}`)
      heading.append(title, link)
      heading.setAttribute('aria-labelledby', title.id)
    })
}

/** `href` with its fragment replaced by `anchor`, or removed without one. */
export const withAnchor = (
  href: string,
  anchor: string | undefined,
): string => {
  const base = href.split('#')[0]
  return anchor ? `${base}#${anchor}` : base
}

/**
 * Keep the reader's place across the language switch. The server writes the
 * heading i → heading i mapping on the page only when both translations share
 * an outline (`getCounterpartAnchors`); here the switch's address follows the
 * active section, so a click, a middle-click and a copied link all land on the
 * same section in the other language. Without a mapping it is left alone and
 * lands at the top, as before.
 */
export const mountLocaleAnchor = (
  root: HTMLElement,
): ((id: string) => void) => {
  const link = document.querySelector<HTMLAnchorElement>(
    '[data-locale-control]',
  )
  let anchors: Record<string, string> = {}
  try {
    anchors = JSON.parse(root.dataset.counterpartAnchors ?? '{}')
  } catch {
    /* A malformed mapping only costs the reader their place. */
  }
  const base = link?.getAttribute('href') ?? ''
  return (id) => {
    if (!link || !base) return
    link.setAttribute('href', withAnchor(base, anchors[id]))
  }
}

/**
 * Promote a standalone markdown image to a `<figure>` captioned by its alt
 * text. A markdown image on its own line renders as a paragraph whose only
 * child is the image; that whole paragraph becomes the figure.
 */
const promoteToFigure = (img: HTMLImageElement): void => {
  if (img.closest('figure')) return
  const parent = img.parentElement
  const alone = parent?.tagName === 'P' && parent.childNodes.length === 1
  const figure = document.createElement('figure')
  ;(alone ? parent : img).replaceWith(figure)
  figure.appendChild(img)
  const alt = img.getAttribute('alt')?.trim()
  if (alt) {
    const caption = document.createElement('figcaption')
    caption.textContent = alt
    figure.appendChild(caption)
  }
}

/**
 * Figures and the image viewer.
 *
 * Every zoomable image is wrapped in a real `<button>`, so it is reachable and
 * operable from the keyboard and announced as something that opens. The
 * viewer is a native modal `<dialog>`: `showModal()` makes the page behind it
 * inert, keeps focus inside, and closes on Escape. Focus goes back to the
 * image that opened it, so a keyboard reader does not land at the top of the
 * page.
 */
export const mountFigures = (root: HTMLElement): void => {
  const prose = root.querySelector<HTMLElement>('.prose')
  if (!prose) return
  const dialog = root.querySelector<HTMLDialogElement>('[data-entry-lightbox]')
  // Without a viewer, an image that looks clickable would be a dead control.
  const canView = Boolean(dialog && typeof dialog.showModal === 'function')
  const openLabel = dialog?.dataset.openLabel ?? 'Open image'
  const fallbackName = dialog?.dataset.fallbackLabel ?? 'Image'
  let trigger: HTMLButtonElement | null = null

  const open = (img: HTMLImageElement, from: HTMLButtonElement) => {
    if (!dialog) return
    const alt = img.getAttribute('alt')?.trim() ?? ''
    // Built on open rather than shipped empty, so no source-less image tag is
    // ever in the page.
    const large = document.createElement('img')
    large.className = 'lightbox__image'
    large.src = img.currentSrc || img.src
    large.alt = alt
    dialog.querySelector('.lightbox__image')?.remove()
    dialog.append(large)
    dialog.setAttribute('aria-label', alt || fallbackName)
    trigger = from
    dialog.showModal()
  }

  prose.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    // An image that is already a link or control keeps that meaning.
    if (img.closest('a, button')) return
    promoteToFigure(img)
    if (!canView) return
    img.dataset.zoomable = ''
    const alt = img.getAttribute('alt')?.trim()
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'zoom-trigger'
    button.setAttribute('aria-label', alt ? `${openLabel}: ${alt}` : openLabel)
    img.replaceWith(button)
    button.append(img)
    button.addEventListener('click', () => open(img, button))
  })

  if (!dialog || !canView) return
  dialog
    .querySelector<HTMLButtonElement>('[data-lightbox-close]')
    ?.addEventListener('click', () => dialog.close())
  // A click on the dialog itself is a click on the space around the image.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })
  // Escape, the close button and a backdrop click all end here.
  dialog.addEventListener('close', () => {
    dialog.querySelector('.lightbox__image')?.remove()
    trigger?.focus()
    trigger = null
  })
}

/** Mount every enhancement inside one long-form page. */
export const mountEntryEnhancements = (
  root: HTMLElement | null = document.querySelector<HTMLElement>('.entry-page'),
): void => {
  if (!root) return
  mountReadingProgress(root)
  mountCodeBlocks(root)
  mountSectionLinks(root)
  mountTocHighlight(root, mountLocaleAnchor(root))
  mountDiagramViewers()
  mountFigures(root)
}
