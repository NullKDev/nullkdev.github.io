import { useEffect, useRef, useState } from 'react'

/** How long the tick or cross stays before the button reads as idle again. */
export const COPY_FEEDBACK_MS = 2000

/** Writes to the clipboard; false when the browser refuses. */
export const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

interface Props {
  text: string
  /** Accessible name; the button itself shows only the mark. */
  label: string
  icon?: string
  onCopied?: (ok: boolean) => void
}

/**
 * An icon button that copies one command. Its outcome is announced by the
 * planner's live region through `onCopied`, and shown here as a tick.
 */
export function CopyButton({ text, label, icon, onCopied }: Props) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return (
    <button
      type="button"
      className="planner-icon-button"
      data-state={state}
      aria-label={label}
      title={label}
      onClick={async () => {
        const ok = await copyText(text)
        setState(ok ? 'done' : 'failed')
        onCopied?.(ok)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(
          () => setState('idle'),
          COPY_FEEDBACK_MS,
        )
      }}
    >
      <span
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: icon ?? '' }}
      />
    </button>
  )
}
