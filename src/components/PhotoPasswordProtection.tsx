import { useState, useEffect, useRef } from 'react'
import { verifyPassword } from '@/lib/encryption'
import { GalleryViewer } from '@/components/react/GalleryViewer'

interface ImageAsset {
  src: string
  fileName?: string
  width?: number
  height?: number
}

interface Props {
  albumId: string
  hashedPassword: string
  images: ImageAsset[]
  coverSrc: string
  protectionMessage?: string
}

export default function PhotoPasswordProtection({
  albumId,
  hashedPassword,
  images,
  coverSrc,
  protectionMessage,
}: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(`photo-pw-${albumId}`)
    if (stored && verifyPassword(hashedPassword, stored)) {
      setUnlocked(true)
    }
  }, [albumId, hashedPassword])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input) return

    if (verifyPassword(hashedPassword, input)) {
      sessionStorage.setItem(`photo-pw-${albumId}`, input)
      setUnlocked(true)
    } else {
      setError(true)
      setShaking(true)
      setInput('')
      setTimeout(() => {
        setShaking(false)
        setError(false)
        inputRef.current?.focus()
      }, 600)
    }
  }

  if (unlocked) {
    return <GalleryViewer images={images} />
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{ minHeight: '420px' }}
    >
      {/* Mosaic of blurred tiles — fills the full container */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-4 gap-0.5 select-none sm:grid-cols-6">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${coverSrc})` }}
          >
            <div className="bg-background/50 absolute inset-0 saturate-0 backdrop-blur-xl" />
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `url(${coverSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: `${(i % 6) * 20}% ${Math.floor(i / 6) * 33}%`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Frosted overlay — purely decorative, must not intercept events */}
      <div className="bg-background/65 pointer-events-none absolute inset-0 backdrop-blur-sm" />

      {/* Lock card centered */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
        <div
          className={`border-border/50 bg-card/90 flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl border p-8 shadow-2xl backdrop-blur-xl transition-transform ${shaking ? 'animate-[shake_0.4s_ease]' : ''}`}
        >
          {/* Icon */}
          <div className="relative">
            <div className="bg-muted border-border/40 flex size-14 items-center justify-center rounded-full border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </div>
          </div>

          <div className="space-y-1 text-center">
            <h3 className="text-base font-semibold">Private Gallery</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {protectionMessage ?? 'Enter the password to view this album.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <input
              ref={inputRef}
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError(false)
              }}
              placeholder="Password"
              autoFocus
              className={`bg-background/60 placeholder:text-muted-foreground/50 h-10 w-full rounded-xl border px-4 text-center text-sm tracking-widest transition-all outline-none placeholder:tracking-normal ${
                error
                  ? 'border-destructive/60 bg-destructive/5 ring-destructive/30 ring-1'
                  : 'border-border/50 focus:border-foreground/30 focus:bg-background/80'
              }`}
            />
            {error && (
              <p className="text-destructive text-center text-xs">
                Incorrect password.
              </p>
            )}
            <button
              type="submit"
              disabled={!input}
              className="bg-foreground text-background hover:bg-foreground/90 h-10 w-full rounded-xl text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              View Album
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
