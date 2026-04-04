'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type PretextModule = {
  prepare: (text: string, font: string) => unknown
  layout: (
    prepared: unknown,
    width: number,
    lineHeight: number,
  ) => { height: number; lineCount: number }
}

async function loadPretext(): Promise<PretextModule | null> {
  try {
    const url = 'https://esm.sh/@chenglou/pretext'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await import(/* @vite-ignore */ url as any)
  } catch {
    return null
  }
}

const FONT = '14px ui-sans-serif, system-ui, sans-serif'
const LINE_HEIGHT = 22

const MESSAGES = [
  {
    role: 'user' as const,
    text: 'How does pretext avoid layout reflow when measuring text?',
  },
  {
    role: 'ai' as const,
    text: "Pretext splits work into two phases. First, prepare() uses Canvas's measureText() API to measure every segment once — this runs outside the browser's layout pipeline, so no reflow happens. The results are cached on an opaque handle.",
  },
  {
    role: 'ai' as const,
    text: 'Then layout() takes that handle and computes line breaks using pure arithmetic — it never touches the DOM. Width changes are essentially free: just call layout() again with the new width, no re-measuring needed.',
  },
  {
    role: 'user' as const,
    text: 'What kind of speedup does that give in practice?',
  },
  {
    role: 'ai' as const,
    text: 'For 500 text blocks: prepare() ≈ 19ms (same as one DOM pass), but layout() ≈ 0.09ms per call. Once prepared, each subsequent resize or streaming update costs almost nothing — that is roughly 500× faster for height prediction in hot paths like AI chat or virtualized lists.',
  },
]

interface ChatMessage {
  id: number
  role: 'user' | 'ai'
  full: string
  displayed: string
  height: number
  done: boolean
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: 'pretext' | 'dom'
  onChange: (m: 'pretext' | 'dom') => void
}) {
  return (
    <div className="bg-background border-border flex items-center gap-1 rounded-lg border p-0.5 text-xs">
      {(['pretext', 'dom'] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`rounded-md px-3 py-1 font-medium transition-all ${
            mode === m
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {m === 'pretext' ? '⚡ pretext' : '🐢 DOM'}
        </button>
      ))}
    </div>
  )
}

export default function PretextStreamingDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState<'pretext' | 'dom'>('pretext')
  const [fps, setFps] = useState<number | null>(null)
  const [pretextReady, setPretextReady] = useState(false)

  const pretextRef = useRef<PretextModule | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const frameCountRef = useRef(0)
  const lastFpsRef = useRef(Date.now())

  useEffect(() => {
    loadPretext().then((mod) => {
      pretextRef.current = mod
      setPretextReady(!!mod)
    })
  }, [])

  const measureWithPretext = useCallback(
    (text: string, maxWidth: number): number => {
      const mod = pretextRef.current
      if (!mod || !text.trim()) return LINE_HEIGHT + 16
      try {
        const prepared = mod.prepare(text, FONT)
        const { height } = mod.layout(prepared, maxWidth, LINE_HEIGHT)
        return height + 24
      } catch {
        return LINE_HEIGHT + 16
      }
    },
    [],
  )

  const measureWithDOM = useCallback((text: string): number => {
    if (!text.trim()) return LINE_HEIGHT + 16
    const el = document.createElement('div')
    el.style.cssText =
      'position:fixed;top:-9999px;left:0;width:300px;font:14px ui-sans-serif,system-ui,sans-serif;line-height:22px;padding:12px 14px;word-break:break-word;white-space:pre-wrap;'
    el.textContent = text
    document.body.appendChild(el)
    const h = el.getBoundingClientRect().height
    document.body.removeChild(el)
    return h
  }, [])

  const tickFps = useCallback(() => {
    frameCountRef.current++
    const now = Date.now()
    const elapsed = now - lastFpsRef.current
    if (elapsed >= 600) {
      setFps(Math.round((frameCountRef.current / elapsed) * 1000))
      frameCountRef.current = 0
      lastFpsRef.current = now
    }
  }, [])

  const startStream = useCallback(async () => {
    if (running) return
    setRunning(true)
    setMessages([])
    setFps(null)
    frameCountRef.current = 0
    lastFpsRef.current = Date.now()

    const bubbleWidth =
      Math.min((containerRef.current?.clientWidth ?? 420) * 0.72, 320) - 28

    for (let i = 0; i < MESSAGES.length; i++) {
      const { role, text } = MESSAGES[i]
      const id = i
      const isAi = role === 'ai'

      setMessages((prev) => [
        ...prev,
        {
          id,
          role,
          full: text,
          displayed: '',
          height: LINE_HEIGHT + 24,
          done: false,
        },
      ])

      if (!isAi) {
        // User messages appear instantly
        const h =
          mode === 'pretext'
            ? measureWithPretext(text, bubbleWidth)
            : measureWithDOM(text)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, displayed: text, height: h, done: true } : m,
          ),
        )
        tickFps()
        await new Promise((r) => setTimeout(r, 400))
        continue
      }

      // AI messages stream character by character
      await new Promise<void>((resolve) => {
        let pos = 0
        const tick = () => {
          pos += Math.floor(Math.random() * 4) + 1
          const displayed = text.slice(0, pos)
          const done = pos >= text.length

          const h =
            mode === 'pretext'
              ? measureWithPretext(displayed, bubbleWidth)
              : measureWithDOM(displayed)

          tickFps()

          setMessages((prev) =>
            prev.map((m) =>
              m.id === id ? { ...m, displayed, height: h, done } : m,
            ),
          )

          if (!done) requestAnimationFrame(tick)
          else resolve()
        }
        requestAnimationFrame(tick)
      })

      await new Promise((r) => setTimeout(r, 350))
    }

    setRunning(false)
  }, [running, mode, measureWithPretext, measureWithDOM, tickFps])

  return (
    <div className="not-prose border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      {/* Toolbar */}
      <div className="border-border bg-muted/30 flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <ModeToggle mode={mode} onChange={setMode} />
          {fps !== null && (
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-xs font-semibold ${
                fps >= 50
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                  : fps >= 25
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
              }`}
            >
              {fps} fps
            </span>
          )}
        </div>
        <button
          onClick={startStream}
          disabled={running}
          className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          {running ? 'Streaming…' : 'Simulate Stream'}
        </button>
      </div>

      {/* Chat */}
      <div
        ref={containerRef}
        className="bg-background/60 min-h-52 space-y-2.5 p-4"
      >
        {messages.length === 0 && !running && (
          <p className="text-muted-foreground py-10 text-center text-sm">
            {pretextReady
              ? 'Press "Simulate Stream" to watch AI messages stream in real time'
              : 'Loading pretext…'}
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              style={{ height: msg.height }}
              className={`max-w-[72%] overflow-hidden rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed transition-[height] duration-75 will-change-[height] ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted text-foreground rounded-bl-sm'
              }`}
            >
              <span className="break-words">
                {msg.displayed}
                {!msg.done && (
                  <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse rounded-sm bg-current align-text-bottom opacity-60" />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-border bg-muted/20 flex items-center justify-between border-t px-4 py-2">
        <p className="text-muted-foreground text-[11px]">
          {mode === 'pretext' ? (
            <>
              <span className="font-semibold text-emerald-600">⚡ pretext</span>{' '}
              — arithmetic layout, zero DOM reads per frame
            </>
          ) : (
            <>
              <span className="font-semibold text-amber-600">🐢 DOM</span> —
              getBoundingClientRect() triggers layout reflow each frame
            </>
          )}
        </p>
      </div>
    </div>
  )
}
