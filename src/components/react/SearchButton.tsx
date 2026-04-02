import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchDialog from './SearchDialog'
import { ErrorBoundary } from './ErrorBoundary'
import { useTranslation } from '@/i18n/use-locale'

const SearchButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

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
        title={t('common.search_title')}
        aria-label={t('common.search_aria')}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Search className="h-5 w-5 md:h-4 md:w-4" />
        <span className="sr-only">{t('common.search')}</span>
      </Button>
      <ErrorBoundary>
        <SearchDialog open={isOpen} onOpenChange={setIsOpen} />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}

export default SearchButton
