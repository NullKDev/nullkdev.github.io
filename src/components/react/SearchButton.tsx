import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchDialog from './SearchDialog'
import { ErrorBoundary } from './ErrorBoundary'

// Simple translation - reads from localStorage (matches Astro's i18n script)
function useI18n() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const getText = (key: string): string => {
    // On server, return empty (SSR default)
    if (typeof window === 'undefined') {
      return ''
    }
    
    // After mount, get language from localStorage (same as Astro)
    const lang = localStorage.getItem('lang') || 'en'
    
    // Try to get from window.__i18n if available
    const dict = (window as any).__i18n?.[lang]
    if (dict && dict[key]) {
      return dict[key]
    }
    
    // Fallback to English from window.__i18n
    const enDict = (window as any).__i18n?.en
    if (enDict && enDict[key]) {
      return enDict[key]
    }
    
    return ''
  }
  
  return {
    t: getText,
    search_title: mounted ? getText('common.search_title') : '',
    search_aria: mounted ? getText('common.search_aria') : '',
    search: mounted ? getText('common.search') : '',
  }
}

const SearchButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t, search_title, search_aria, search } = useI18n()

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !isInput) {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ErrorBoundary>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hover:bg-muted size-9 border md:-my-2 md:-me-2 md:size-8 md:border-0 md:bg-transparent"
        title={search_title}
        aria-label={search_aria}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        suppressHydrationWarning
      >
        <Search className="h-5 w-5 md:h-4 md:w-4" />
        <span className="sr-only" suppressHydrationWarning>{search}</span>
      </Button>
      <ErrorBoundary>
        <SearchDialog open={isOpen} onOpenChange={setIsOpen} />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}

export default SearchButton
