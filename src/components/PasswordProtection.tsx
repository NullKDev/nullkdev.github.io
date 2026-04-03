import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { decryptContent } from '@/lib/encryption'

interface Props {
  postId: string
  encryptedContent: string
  protectionMessage?: string
}

export default function PasswordProtection({ postId, encryptedContent, protectionMessage }: Props) {
  const [input, setInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [decryptedHtml, setDecryptedHtml] = useState<string | null>(null)

  // Restore from session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(`post-pw-${postId}`)
    if (stored) {
      const html = decryptContent(encryptedContent, stored)
      if (html) setDecryptedHtml(html)
      else sessionStorage.removeItem(`post-pw-${postId}`)
    }
  }, [postId, encryptedContent])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const html = decryptContent(encryptedContent, input)
    if (html) {
      sessionStorage.setItem(`post-pw-${postId}`, input)
      setDecryptedHtml(html)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (decryptedHtml) {
    return (
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: decryptedHtml }}
      />
    )
  }

  return (
    <div className="col-start-2 my-8">
      {/* Blurred preview strip */}
      <div className="relative mb-6 overflow-hidden rounded-xl border border-border/40">
        <div className="pointer-events-none select-none blur-sm opacity-40 p-6 text-sm leading-relaxed line-clamp-4">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p className="mt-3">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      </div>

      {/* Lock card */}
      <div className="flex flex-col items-center text-center gap-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-8 shadow-sm">
        <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/10 border border-primary/20">
          <Lock className="size-6 text-primary" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-foreground">Protected Content</h3>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            {protectionMessage ?? 'This content is password protected. Enter the password to read it.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false) }}
              placeholder="Enter password"
              autoFocus
              className={`w-full h-10 rounded-lg border bg-background px-3 pr-10 text-sm outline-none transition-colors
                focus:ring-2 focus:ring-ring
                ${error
                  ? 'border-destructive focus:ring-destructive/30 bg-destructive/5'
                  : 'border-border/60 focus:border-primary'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-destructive text-left">
              Incorrect password. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={!input}
            className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium
              hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
