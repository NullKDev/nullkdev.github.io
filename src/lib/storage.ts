/**
 * LocalStorage abstraction with error handling and type safety
 */

const STORAGE_PREFIX = 'nullkdev:'

type StorageValue = string | number | boolean | object | null

interface StorageOptions {
  prefix?: boolean
}

/**
 * Get item from localStorage with optional fallback
 */
export function getItem<T extends StorageValue>(
  key: string,
  fallback?: T,
  options: StorageOptions = {},
): T {
  try {
    const storageKey = options.prefix ? `${STORAGE_PREFIX}${key}` : key
    const item = localStorage.getItem(storageKey)

    if (item === null) {
      return fallback as T
    }

    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(item) as T
    } catch {
      return item as T
    }
  } catch {
    return fallback as T
  }
}

/**
 * Set item in localStorage with error handling for quota exceeded
 */
export function setItem(
  key: string,
  value: StorageValue,
  options: StorageOptions = {},
): boolean {
  try {
    const storageKey = options.prefix ? `${STORAGE_PREFIX}${key}` : key
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(storageKey, serialized)
    return true
  } catch (error) {
    // Handle quota exceeded error
    if (
      error instanceof DOMException &&
      error.name === 'QuotaExceededError'
    ) {
      console.error('localStorage quota exceeded')
    }
    return false
  }
}

/**
 * Remove item from localStorage
 */
export function removeItem(key: string, options: StorageOptions = {}): boolean {
  try {
    const storageKey = options.prefix ? `${STORAGE_PREFIX}${key}` : key
    localStorage.removeItem(storageKey)
    return true
  } catch {
    return false
  }
}

/**
 * Clear all items with optional prefix
 */
export function clear(prefixedOnly: boolean = false): void {
  if (prefixedOnly) {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(STORAGE_PREFIX)) {
        keys.push(key)
      }
    }
    keys.forEach((key) => localStorage.removeItem(key))
  } else {
    localStorage.clear()
  }
}

/**
 * Check if localStorage is available
 */
export function isAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Get storage usage info
 */
export function getUsage(): { used: number; available: boolean } {
  let used = 0
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        used += localStorage.getItem(key)?.length ?? 0
      }
    }
  } catch {
    // Ignore errors
  }
  return { used, available: isAvailable() }
}