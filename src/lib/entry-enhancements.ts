/**
 * Client enhancements for a long-form entry page, mounted by `EntryPage.astro`.
 *
 * Each one is progressive: without JavaScript the page is complete — the code
 * is still readable, the contents still link, the images still show. These
 * only add a progress bar, copy buttons, the active-section marker and a
 * lightbox. Kept here rather than inline so the page component stays a layout.
 */

/** Reading progress: fraction of the article scrolled past the viewport. */
export const mountReadingProgress = (): void => {
  const bar = document.querySelector<HTMLElement>('[data-read-progress]')
  const article = document.querySelector<HTMLElement>('.entry-page .prose')
  if (bar && article) {
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
}

/** Wrap each code block with a language label and a copy button. */
export const mountCodeBlocks = (main: HTMLElement | null): void => {
  const copyText = main?.dataset.copy ?? 'Copy'
  const copiedText = main?.dataset.copied ?? 'Copied'
  document
    .querySelectorAll<HTMLPreElement>('.entry-page .prose pre.astro-code')
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
          await navigator.clipboard.writeText(pre.innerText)
          button.textContent = copiedText
          button.classList.add('is-copied')
          setTimeout(() => {
            button.textContent = copyText
            button.classList.remove('is-copied')
          }, 1600)
        } catch {
          /* Clipboard may be unavailable; ignore. */
        }
      })
      bar.append(label, button)
      pre.replaceWith(wrap)
      wrap.append(bar, pre)
    })
}

/** Table of contents: mark the section currently in view as active. */
export const mountTocHighlight = (): void => {
  const tocLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-toc] a[href^="#"]'),
  )
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const linkById = new Map<string, HTMLAnchorElement>()
    const targets: HTMLElement[] = []
    tocLinks.forEach((link) => {
      const id = decodeURIComponent(link.hash.slice(1))
      const target = document.getElementById(id)
      if (target) {
        linkById.set(id, link)
        targets.push(target)
      }
    })
    let activeId: string | null = null
    const setActive = (id: string) => {
      if (id === activeId) return
      activeId = id
      tocLinks.forEach((link) => link.removeAttribute('aria-current'))
      linkById.get(id)?.setAttribute('aria-current', 'true')
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-12% 0px -70% 0px', threshold: 0 },
    )
    targets.forEach((target) => observer.observe(target))
  }
}

/**
 * Figures & lightbox: promote standalone markdown images to <figure> with a
 * caption from their alt text, and open any zoomable image in a lightbox.
 */
export const mountFigures = (main: HTMLElement | null): void => {
  const prose = document.querySelector<HTMLElement>('.entry-page .prose')
  const closeLabel = main?.dataset.close ?? 'Close'
  if (prose) {
    prose.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
      img.dataset.zoomable = ''
      if (img.closest('figure')) return
      const parent = img.parentElement
      // A markdown image on its own line renders as a paragraph whose only
      // child is the image; promote that whole paragraph to a figure.
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
    })

    let lightbox: HTMLElement | null = null
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
    }
    function closeLightbox() {
      lightbox?.remove()
      lightbox = null
      document.removeEventListener('keydown', onKey)
    }
    const openLightbox = (src: string, alt: string) => {
      lightbox = document.createElement('div')
      lightbox.className = 'lightbox'
      lightbox.setAttribute('role', 'dialog')
      lightbox.setAttribute('aria-modal', 'true')
      if (alt) lightbox.setAttribute('aria-label', alt)
      const big = document.createElement('img')
      big.src = src
      big.alt = alt
      const close = document.createElement('button')
      close.type = 'button'
      close.className = 'lightbox__close'
      close.setAttribute('aria-label', closeLabel)
      close.textContent = '✕'
      lightbox.append(big, close)
      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox || event.target === close) closeLightbox()
      })
      document.body.appendChild(lightbox)
      document.addEventListener('keydown', onKey)
      close.focus()
    }
    prose.addEventListener('click', (event) => {
      const image = (event.target as HTMLElement)?.closest<HTMLImageElement>(
        'img[data-zoomable]',
      )
      if (image) openLightbox(image.currentSrc || image.src, image.alt)
    })
  }
}
