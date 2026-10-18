/**
 * The streaming demo's clock, cancellable. A reader can stop a run, switch
 * mode, or leave the page mid-stream; every pending frame and timer is
 * dropped on abort, so nothing updates a component that is gone.
 */

type Schedule = (callback: FrameRequestCallback) => number
type Cancel = (handle: number) => void

/**
 * Reveals `text` a few characters per frame. Resolves `true` when the whole
 * text is shown, `false` when `signal` aborted first.
 */
export function streamText(
  text: string,
  {
    signal,
    onStep,
    random = Math.random,
    schedule = requestAnimationFrame,
    cancel = cancelAnimationFrame,
  }: {
    signal: AbortSignal
    onStep: (displayed: string, done: boolean) => void
    random?: () => number
    schedule?: Schedule
    cancel?: Cancel
  },
): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve(false)
    let position = 0
    let handle = 0
    const onAbort = () => {
      cancel(handle)
      resolve(false)
    }
    const tick = () => {
      if (signal.aborted) return
      position = Math.min(text.length, position + Math.floor(random() * 4) + 1)
      const done = position >= text.length
      onStep(text.slice(0, position), done)
      if (!done) {
        handle = schedule(tick)
        return
      }
      signal.removeEventListener('abort', onAbort)
      resolve(true)
    }
    signal.addEventListener('abort', onAbort, { once: true })
    handle = schedule(tick)
  })
}

/** `setTimeout` as a promise: `true` once elapsed, `false` if aborted. */
export function waitFor(ms: number, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve(false)
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve(true)
    }, ms)
    const onAbort = () => {
      clearTimeout(timer)
      resolve(false)
    }
    signal.addEventListener('abort', onAbort, { once: true })
  })
}
