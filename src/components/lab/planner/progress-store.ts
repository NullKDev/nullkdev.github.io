import type { Locale } from '@/i18n'
import {
  PROGRESS_KEY,
  readProgress,
  writeProgress,
} from '@/lib/migration-planner'

/**
 * The ticked steps as an external store for `useSyncExternalStore`: the
 * server snapshot is empty, the browser's comes from localStorage, and a tick
 * made while storage is blocked still shows for the rest of the visit.
 */
const EMPTY: ReadonlySet<string> = new Set()
const listeners = new Set<() => void>()
const session = new Map<Locale, ReadonlySet<string>>()
let cached:
  { locale: Locale; raw: string | null; value: ReadonlySet<string> } | undefined

const storage = (): Storage | undefined => {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

const rawValue = (): string | null => {
  try {
    return storage()?.getItem(PROGRESS_KEY) ?? null
  } catch {
    return null
  }
}

const notify = () => {
  for (const listener of listeners) listener()
}

export const subscribeProgress = (listener: () => void): (() => void) => {
  listeners.add(listener)
  // Another tab ticking the same plan updates this one.
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

export const progressSnapshot = (locale: Locale): ReadonlySet<string> => {
  const kept = session.get(locale)
  if (kept) return kept
  const raw = rawValue()
  if (cached?.locale !== locale || cached.raw !== raw) {
    cached = { locale, raw, value: readProgress(storage(), locale) }
  }
  return cached.value
}

export const serverProgressSnapshot = (): ReadonlySet<string> => EMPTY

export const saveProgress = (
  locale: Locale,
  done: ReadonlySet<string>,
): void => {
  // Stored: the next snapshot reads it back. Refused (private window, blocked
  // site data): keep it for this visit only.
  if (writeProgress(storage(), locale, done)) session.delete(locale)
  else session.set(locale, done)
  notify()
}
