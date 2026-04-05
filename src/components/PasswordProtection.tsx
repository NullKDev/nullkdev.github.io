import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import DOMPurify from 'dompurify'
import { decryptContent } from '@/lib/encryption'

interface Props {
  postId: string
  encryptedContent: string
  protectionMessage?: string
}

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 30_000

export default function PasswordProtection({
  postId,
  encryptedContent,
  protectionMessage,
}: Props) {
  const [input, setInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [decryptedHtml, setDecryptedHtml] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)

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
    if (locked) return

    if (attempts >= MAX_ATTEMPTS) {
      setLocked(true)
      setTimeout(() => {
        setLocked(false)
        setAttempts(0)
      }, LOCKOUT_MS)
      return
    }

    const html = decryptContent(encryptedContent, input)
    if (html) {
      sessionStorage.setItem(`post-pw-${postId}`, input)
      setDecryptedHtml(DOMPurify.sanitize(html))
      setError(false)
      setAttempts(0)
    } else {
      setError(true)
      setAttempts((prev) => prev + 1)
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
      <div className="border-border/40 relative mb-6 overflow-hidden rounded-xl border">
        <div className="pointer-events-none line-clamp-4 p-6 text-sm leading-relaxed opacity-40 blur-sm select-none">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className="mt-3">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        </div>
        <div className="via-background/60 to-background absolute inset-0 bg-gradient-to-b from-transparent" />
      </div>

      {/* Lock card */}
      <div className="border-border/60 bg-card/60 flex flex-col items-center gap-5 rounded-2xl border p-8 text-center shadow-sm backdrop-blur-sm">
        <div className="bg-primary/10 border-primary/20 flex size-14 items-center justify-center rounded-2xl border">
          <Lock className="text-primary size-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-foreground text-lg font-semibold">
            Protected Content
          </h3>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            {protectionMessage ??
              'This content is password protected. Enter the password to read it.'}
          </p>
        </div>

        {locked && (
          <p className="text-center text-xs text-amber-500">
            Too many attempts. Please wait 30 seconds.
          </p>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError(false)
              }}
              placeholder="Enter password"
              autoFocus
              disabled={locked}
              className={`bg-background focus:ring-ring h-10 w-full rounded-lg border px-3 pr-10 text-sm transition-colors outline-none focus:ring-2 ${
                error
                  ? 'border-destructive focus:ring-destructive/30 bg-destructive/5'
                  : 'border-border/60 focus:border-primary'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-destructive text-left text-xs">
              Incorrect password. {MAX_ATTEMPTS - attempts} attempts remaining.
            </p>
          )}

          <button
            type="submit"
            disabled={!input || locked}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
