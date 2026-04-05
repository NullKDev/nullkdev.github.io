import { useState, useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'
import { decryptContent } from '@/lib/encryption'

interface Props {
  postId: string
  encryptedContent: string
  protectionMessage?: string
}

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 30_000

export default function ProjectPasswordProtection({
  postId,
  encryptedContent,
  protectionMessage,
}: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [decryptedHtml, setDecryptedHtml] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(`project-pw-${postId}`)
    if (stored) {
      const html = decryptContent(encryptedContent, stored)
      if (html) setDecryptedHtml(html)
      else sessionStorage.removeItem(`project-pw-${postId}`)
    }
  }, [postId, encryptedContent])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (locked) return
    if (!input) return

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
      sessionStorage.setItem(`project-pw-${postId}`, input)
      setDecryptedHtml(DOMPurify.sanitize(html))
      setError(false)
      setAttempts(0)
    } else {
      setError(true)
      setAttempts((prev) => prev + 1)
      setInput('')
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50)
    }
  }

  if (decryptedHtml) {
    return (
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: decryptedHtml }}
      />
    )
  }

  return (
    <div className="my-8 font-mono text-sm">
      <div className="overflow-hidden rounded-lg border border-zinc-700/60 bg-zinc-950 shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-red-500/80" />
            <span className="size-3 rounded-full bg-yellow-500/80" />
            <span className="size-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 text-xs tracking-wide text-zinc-500">
            access-control — bash
          </span>
          <div className="ml-auto rounded border border-red-500/40 px-2 py-0.5 text-[10px] tracking-widest text-red-400/80 uppercase">
            RESTRICTED
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5">
          {/* Context lines */}
          <div className="space-y-1 text-zinc-500">
            <p>
              <span className="text-zinc-600">$</span> cat project.md
            </p>
            <p className="text-red-400/80">
              permission denied: content is encrypted
            </p>
            <p>
              <span className="text-zinc-600">$</span> unlock --project{' '}
              <span className="text-zinc-300">{postId}</span>
            </p>
          </div>

          {/* Lock message */}
          <div className="space-y-0.5 rounded border border-zinc-700/40 bg-zinc-900/60 px-4 py-3">
            <p className="font-medium text-zinc-300">
              This project is encrypted
            </p>
            <p className="text-xs text-zinc-500">
              {protectionMessage ??
                'Enter the access key to decrypt and read the full content.'}
            </p>
          </div>

          {locked && (
            <p className="text-center text-xs text-amber-500">
              Too many attempts. Please wait 30 seconds.
            </p>
          )}

          {/* Input */}
          <div className="space-y-2">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded border border-zinc-700/60 bg-zinc-900 px-3 py-2 transition-colors focus-within:border-green-500/40"
            >
              <span className="shrink-0 text-green-400 select-none">$</span>
              <input
                ref={inputRef}
                type="password"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setError(false)
                }}
                placeholder="enter access key to unlock"
                autoFocus
                disabled={locked}
                className="flex-1 border-none bg-transparent text-zinc-100 caret-green-400 outline-none placeholder:text-zinc-600 disabled:opacity-50"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                disabled={!input || locked}
                className="shrink-0 rounded border border-green-500/30 bg-green-500/15 px-2.5 py-1 text-[11px] text-green-400 transition-colors hover:bg-green-500/25 disabled:cursor-not-allowed disabled:opacity-30"
              >
                UNLOCK
              </button>
            </form>

            {error && (
              <p className="pl-1 text-xs text-red-400">
                &gt; ERR_ACCESS_DENIED: Invalid key. {MAX_ATTEMPTS - attempts}{' '}
                attempts remaining.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
