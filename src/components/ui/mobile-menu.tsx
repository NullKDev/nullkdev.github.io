import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NAV_LINKS } from '@/consts'
import { Menu, ExternalLink } from 'lucide-react'
import { useTranslation } from '@/i18n/use-locale'

const TRANSLATABLE = new Set(['blog', 'projects', 'photos'])

function localizeHref(href: string, locale: 'en' | 'es'): string {
  if (href.startsWith('http')) return href
  const section = href.replace(/^\/(?:es\/)?/, '')
  if (TRANSLATABLE.has(section)) {
    return locale === 'es' ? `/es/${section}` : `/${section}`
  }
  return href
}

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [locale, setLocale] = useState<'en' | 'es'>('en')
  const { t } = useTranslation()

  useEffect(() => {
    const updateLocale = () => {
      const path = window.location.pathname
      setLocale(path === '/es' || path.startsWith('/es/') ? 'es' : 'en')
    }
    updateLocale()
    document.addEventListener('astro:page-load', updateLocale)
    return () => document.removeEventListener('astro:page-load', updateLocale)
  }, [])

  useEffect(() => {
    const handleViewTransitionStart = () => setIsOpen(false)
    document.addEventListener('astro:before-swap', handleViewTransitionStart)
    return () =>
      document.removeEventListener(
        'astro:before-swap',
        handleViewTransitionStart,
      )
  }, [])

  const isExternalLink = (href: string) => href.startsWith('http')

  return (
    <DropdownMenu open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DropdownMenuTrigger asChild onClick={() => setIsOpen((val) => !val)}>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          title={t('common.toggle_menu')}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t('common.toggle_menu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        {NAV_LINKS.map((item) => {
          const isExternal = isExternalLink(item.href)
          const isInsideLink = item.label.toLowerCase() === 'inside'
          const href = localizeHref(item.href, locale)
          return (
            <DropdownMenuItem key={item.href} asChild>
              <a
                href={href}
                target={isExternal ? '_blank' : '_self'}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={`flex w-full items-center gap-2 text-lg font-medium capitalize ${
                  isInsideLink
                    ? 'text-primary hover:text-primary/80'
                    : isExternal
                      ? 'text-primary/90 hover:text-primary'
                      : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span>
                  {t(`nav.${item.label.toLowerCase()}`) || item.label}
                </span>
                {isExternal && (
                  <ExternalLink
                    className={`h-4 w-4 flex-shrink-0 opacity-80 ${isInsideLink ? 'text-primary' : ''}`}
                    aria-hidden="true"
                  />
                )}
              </a>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MobileMenu
