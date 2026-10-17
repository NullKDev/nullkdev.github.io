import { useCallback, useEffect, useRef, useState } from 'react'

import { DemoIcon } from './DemoIcon'
import type { DemoIcons, StreamingLabels } from './labels'
import { streamText, waitFor } from './streaming/stream'

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
    // Bundled from node_modules, not fetched from a CDN at runtime: a
    // third-party origin serving executable code into a reader's browser is a
    // supply-chain dependency this archive does not need to take on, and it
    // contradicts the local-first claim the rest of the site makes.
    return (await import('@chenglou/pretext')) as unknown as PretextModule
  } catch {
    return null
  }
}

const FONT = '14px ui-sans-serif, system-ui, sans-serif'
const LINE_HEIGHT = 22

type Mode = 'pretext' | 'dom'
export type StreamingIconRole = 'fast' | 'slow' | 'play' | 'stop'

interface ChatMessage {
  id: number
  role: 'user' | 'ai'
  displayed: string
  height: number
  done: boolean
}

const scriptFrom = (labels: StreamingLabels) =>
  [
    { role: 'user', text: labels.question1 },
    { role: 'ai', text: labels.answer1 },
    { role: 'ai', text: labels.answer2 },
    { role: 'user', text: labels.question2 },
    { role: 'ai', text: labels.answer3 },
  ] as const

function ModeToggle({
  mode,
  onChange,
  labels,
  icons,
}: {
  mode: Mode
  onChange: (mode: Mode) => void
  labels: StreamingLabels
  icons: DemoIcons<StreamingIconRole>
}) {
  const options = [
    { value: 'pretext', label: labels.pretextMode, icon: icons.fast },
    { value: 'dom', label: labels.domMode, icon: icons.slow },
  ] as const
  return (
    <div
      role="group"
      aria-label={labels.modeLabel}
      className="bg-background border-border flex items-center gap-1 rounded-lg border p-0.5 text-xs"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={mode === option.value}
          onClick={() => onChange(option.value)}
          className={`inline-flex min-h-10 items-center gap-1.5 rounded-md px-3 font-medium transition-all ${
            mode === option.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <DemoIcon svg={option.icon} />
          {option.label}
        </button>
      ))}
    </div>
  )
}

/**
 * A simulated AI chat whose bubble heights are measured either by pretext or
 * by the DOM. Rendered through `PretextStreamingIsland.astro`, which supplies
 * the page's strings and icons plus the no-JavaScript fallback.
 */
export default function PretextStreamingDemo({
  labels,
  icons,
}: {
  labels: StreamingLabels
  icons: DemoIcons<StreamingIconRole>
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState<Mode>('pretext')
  const [fps, setFps] = useState<number | null>(null)
  const [pretextReady, setPretextReady] = useState(false)

  const pretextRef = useRef<PretextModule | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const runRef = useRef<AbortController | null>(null)
  const frameCountRef = useRef(0)
  /* Seeded at 0, not `Date.now()`: a ref's initial argument is evaluated on
     every render, and reading the clock during render is impure. `startStream`
     sets the real timestamp before any frame is measured. */
  const lastFpsRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    void loadPretext().then((module) => {
      if (cancelled) return
      pretextRef.current = module
      setPretextReady(!!module)
    })
    // Leaving the page mid-stream drops every pending frame and timer.
    return () => {
      cancelled = true
      runRef.current?.abort()
      runRef.current = null
    }
  }, [])

  const measureWithPretext = useCallback(
    (text: string, maxWidth: number): number => {
      const pretext = pretextRef.current
      if (!pretext || !text.trim()) return LINE_HEIGHT + 16
      try {
        const prepared = pretext.prepare(text, FONT)
        const { height } = pretext.layout(prepared, maxWidth, LINE_HEIGHT)
        return height + 24
      } catch {
        return LINE_HEIGHT + 16
      }
    },
    [],
  )

  const measureWithDOM = useCallback((text: string): number => {
    if (!text.trim()) return LINE_HEIGHT + 16
    const element = document.createElement('div')
    element.style.cssText =
      'position:fixed;top:-9999px;left:0;width:300px;font:14px ui-sans-serif,system-ui,sans-serif;line-height:22px;padding:12px 14px;word-break:break-word;white-space:pre-wrap;'
    element.textContent = text
    document.body.appendChild(element)
    const height = element.getBoundingClientRect().height
    document.body.removeChild(element)
    return height
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
    if (runRef.current) return
    const run = new AbortController()
    runRef.current = run
    const { signal } = run
    setRunning(true)
    setMessages([])
    setFps(null)
    frameCountRef.current = 0
    lastFpsRef.current = Date.now()

    const bubbleWidth =
      Math.min((containerRef.current?.clientWidth ?? 420) * 0.72, 320) - 28
    const measure = (text: string) =>
      mode === 'pretext'
        ? measureWithPretext(text, bubbleWidth)
        : measureWithDOM(text)
    const update = (id: number, displayed: string, done: boolean) =>
      setMessages((previous) =>
        previous.map((message) =>
          message.id === id
            ? { ...message, displayed, height: measure(displayed), done }
            : message,
        ),
      )

    for (const [id, { role, text }] of scriptFrom(labels).entries()) {
      if (signal.aborted) break
      setMessages((previous) => [
        ...previous,
        { id, role, displayed: '', height: LINE_HEIGHT + 24, done: false },
      ])

      if (role === 'user') {
        // User messages appear at once.
        update(id, text, true)
        tickFps()
        if (!(await waitFor(400, signal))) break
        continue
      }

      // AI messages stream a few characters per frame.
      const finished = await streamText(text, {
        signal,
        onStep: (displayed, done) => {
          tickFps()
          update(id, displayed, done)
        },
      })
      if (!finished || !(await waitFor(350, signal))) break
    }

    // A run that was stopped or unmounted has already been released; only
    // one that ran to the end clears its own state.
    if (runRef.current === run) {
      runRef.current = null
      setRunning(false)
    }
  }, [labels, mode, measureWithPretext, measureWithDOM, tickFps])

  const stopStream = useCallback(() => {
    runRef.current?.abort()
    runRef.current = null
    setRunning(false)
    setMessages((previous) =>
      previous.map((message) => ({ ...message, done: true })),
    )
  }, [])

  return (
    <div className="not-prose border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <ModeToggle
            mode={mode}
            onChange={setMode}
            labels={labels}
            icons={icons}
          />
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
              {fps} {labels.fps}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={running ? stopStream : startStream}
          className="bg-primary text-primary-foreground inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all hover:opacity-90 active:scale-95"
        >
          <DemoIcon svg={running ? icons.stop : icons.play} />
          {running ? labels.stop : labels.start}
        </button>
      </div>

      <div
        ref={containerRef}
        className="bg-background/60 min-h-52 space-y-2.5 p-4"
      >
        {messages.length === 0 && !running && (
          <p className="text-muted-foreground py-10 text-center text-sm">
            {pretextReady ? labels.idle : labels.loading}
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              style={{ height: message.height }}
              className={`max-w-[72%] overflow-hidden rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed transition-[height] duration-75 will-change-[height] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted text-foreground rounded-bl-sm'
              }`}
            >
              <span className="break-words">
                {message.displayed}
                {!message.done && (
                  <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse rounded-sm bg-current align-text-bottom opacity-60" />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border bg-muted/20 flex items-center justify-between border-t px-4 py-2">
        <p className="text-muted-foreground inline-flex items-center gap-1.5 text-[11px]">
          {mode === 'pretext' ? (
            <>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                <DemoIcon svg={icons.fast} />
                {labels.pretextMode}
              </span>
              — {labels.pretextNote}
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                <DemoIcon svg={icons.slow} />
                {labels.domMode}
              </span>
              — {labels.domNote}
            </>
          )}
        </p>
      </div>
    </div>
  )
}
