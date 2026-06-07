/**
 * Unit tests for the i18n check/lint functionality
 */
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('i18n files', () => {
  const enPath = join(process.cwd(), 'src/i18n/en.ts')
  const esPath = join(process.cwd(), 'src/i18n/es.ts')

  it('should have both en.ts and es.ts files', () => {
    expect(existsSync(enPath)).toBe(true)
    expect(existsSync(esPath)).toBe(true)
  })

  it('should have matching key sets between en.ts and es.ts', () => {
    const enContent = readFileSync(enPath, 'utf-8')
    const esContent = readFileSync(esPath, 'utf-8')

    // Extract all keys from both files
    const enKeys = extractI18nKeys(enContent)
    const esKeys = extractI18nKeys(esContent)

    // Find keys in en but not in es
    const missingInEs = enKeys.filter((k) => !esKeys.includes(k))
    // Find keys in es but not in en
    const missingInEn = esKeys.filter((k) => !enKeys.includes(k))

    // These are expected differences (temporary):
    // - Some keys only need to exist when their feature is implemented

    // Sort for consistent comparison
    const sortedEn = [...enKeys].sort()
    const sortedEs = [...esKeys].sort()

    // Basic structural check: en.ts and es.ts should have the same keys
    // Allow known exceptions for keys unique to one language
    const knownExceptions: string[] = []

    const filteredMissingInEs = missingInEs.filter(
      (k) => !knownExceptions.includes(k),
    )
    const filteredMissingInEn = missingInEn.filter(
      (k) => !knownExceptions.includes(k),
    )

    const errorParts: string[] = []
    if (filteredMissingInEs.length > 0) {
      errorParts.push(
        `Keys in en.ts but missing in es.ts: ${filteredMissingInEs.join(', ')}`,
      )
    }
    if (filteredMissingInEn.length > 0) {
      errorParts.push(
        `Keys in es.ts but missing in en.ts: ${filteredMissingInEn.join(', ')}`,
      )
    }

    expect(
      errorParts.join('; '),
      errorParts.length > 0 ? errorParts.join('; ') : 'All keys match',
    ).toBe('')
  })
})

function extractI18nKeys(content: string): string[] {
  const keys: string[] = []
  // Match patterns like: 'key.name': 'value'
  // or: "key.name": "value"
  const regex = /['"]((?:[a-z]+\.)+[a-z0-9_]+)['"]:\s*['"]/g
  let match
  while ((match = regex.exec(content)) !== null) {
    keys.push(match[1])
  }
  return keys
}
