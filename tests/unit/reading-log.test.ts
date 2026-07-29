import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  getReadingLog,
  getReadState,
  markRead,
  type ReadingLog,
} from '@/lib/reading-log'

const KEY = 'nullkdev:notes-read'

/* Neither this jsdom setup nor Node supplies a usable `localStorage` — Node's
   own is gated behind --localstorage-file and shadows jsdom's. Rather than
   configure a browser API into existence, stand up the smallest thing that
   satisfies the contract the module actually uses. What is under test is the
   migration, the corruption handling and the fail-soft behaviour, none of
   which care whose Storage implementation is underneath. */
class MemoryStorage {
  #entries = new Map<string, string>()
  getItem(key: string) {
    return this.#entries.get(key) ?? null
  }
  setItem(key: string, value: string) {
    this.#entries.set(key, String(value))
  }
  removeItem(key: string) {
    this.#entries.delete(key)
  }
  clear() {
    this.#entries.clear()
  }
}

const storage = new MemoryStorage()
vi.stubGlobal('localStorage', storage)

afterEach(() => {
  storage.clear()
  vi.restoreAllMocks()
  vi.stubGlobal('localStorage', storage)
})

describe('reading log storage', () => {
  it('starts empty rather than undefined', () => {
    expect(getReadingLog()).toEqual({})
  })

  it('migrates the first-version array instead of discarding it', () => {
    /* The log used to be a plain array of ids. Dropping it would silently
       un-read everything the reader had already marked, which is worse than
       any formatting benefit. Migrated entries get timestamp 0: known read,
       time unknown. */
    localStorage.setItem(KEY, JSON.stringify(['alpha', 'beta']))
    expect(getReadingLog()).toEqual({ alpha: 0, beta: 0 })
  })

  it('survives corrupted storage without throwing at the reader', () => {
    localStorage.setItem(KEY, '{ not json')
    expect(getReadingLog()).toEqual({})
  })

  it('ignores a stored primitive that is not a log', () => {
    localStorage.setItem(KEY, '"a string"')
    expect(getReadingLog()).toEqual({})
    localStorage.setItem(KEY, 'null')
    expect(getReadingLog()).toEqual({})
  })

  it('records a timestamp when marking read', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
    markRead('alpha')
    expect(getReadingLog()).toEqual({ alpha: 1_700_000_000_000 })
  })

  it('refuses an empty id rather than writing a blank key', () => {
    markRead('')
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('stays silent when storage is unavailable', () => {
    // Private browsing and disabled storage both throw here. A convenience
    // marker must never take the page down with it.
    vi.stubGlobal('localStorage', {
      ...storage,
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    })
    expect(() => markRead('alpha')).not.toThrow()
  })
})

describe('read state', () => {
  const log: ReadingLog = { read: 1_700_000_000_000, migrated: 0 }

  it('treats an entry that was never opened as unread', () => {
    expect(getReadState(log, 'unknown', '2026-01-01')).toBe('unread')
    expect(getReadState(log, undefined, '2026-01-01')).toBe('unread')
  })

  it('flags revised only when the change came after the visit', () => {
    expect(getReadState(log, 'read', '2023-12-01')).toBe('revised')
    expect(getReadState(log, 'read', '2023-11-01')).toBe('read')
  })

  it('never claims revised for a migrated entry', () => {
    /* Timestamp 0 means "read, time unknown". Comparing against it would mark
       every migrated entry as revised at once — an assertion the data cannot
       support. */
    expect(getReadState(log, 'migrated', '2026-01-01')).toBe('read')
  })

  it('stays read when the entry carries no revision date', () => {
    expect(getReadState(log, 'read', undefined)).toBe('read')
  })

  it('ignores an unparseable revision date instead of guessing', () => {
    expect(getReadState(log, 'read', 'not a date')).toBe('read')
  })
})
