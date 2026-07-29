/**
 * A private, local record of when this browser last opened each note.
 *
 * It stores a timestamp rather than a flag, which is what makes it useful: an
 * entry revised after you read it can be surfaced as changed, instead of
 * staying quietly ticked off. The log lives in localStorage and never leaves
 * the device — the site does not track visitors, so "read" is something the
 * reader's own browser remembers, not something the site observes.
 *
 * Every operation fails soft: a browser with storage disabled gets an index
 * with nothing marked.
 */
const KEY = 'nullkdev:notes-read'

/** entry translationKey → epoch milliseconds of the last visit. */
export type ReadingLog = Record<string, number>

export const getReadingLog = (): ReadingLog => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    // The first version of this log stored a plain array of ids. Migrate it
    // rather than dropping what the reader had already marked; entries with no
    // known timestamp are treated as read before any recorded revision.
    if (Array.isArray(parsed)) {
      return Object.fromEntries(parsed.map((id) => [String(id), 0]))
    }
    return typeof parsed === 'object' && parsed ? (parsed as ReadingLog) : {}
  } catch {
    return {}
  }
}

export const markRead = (id: string): void => {
  if (!id) return
  try {
    const log = getReadingLog()
    log[id] = Date.now()
    localStorage.setItem(KEY, JSON.stringify(log))
  } catch {
    // Storage unavailable or full — the marker is a convenience, not state
    // anything else depends on.
  }
}

export type ReadState = 'unread' | 'read' | 'revised'

/**
 * `revised` means: you read this, and it changed afterwards.
 *
 * A migrated entry carries timestamp 0 — we know it was read but not when.
 * Those stay `read`: claiming "revised since you read it" without knowing when
 * that was would be an assertion the data does not support, and it would flag
 * every migrated entry at once.
 */
export const getReadState = (
  log: ReadingLog,
  id: string | undefined,
  updatedAt: string | undefined,
): ReadState => {
  if (!id || !(id in log)) return 'unread'
  const readAt = log[id]
  if (!readAt || !updatedAt) return 'read'
  const revisedAt = Date.parse(updatedAt)
  return Number.isFinite(revisedAt) && revisedAt > readAt ? 'revised' : 'read'
}
