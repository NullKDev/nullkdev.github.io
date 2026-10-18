import { describe, expect, it } from 'vitest'

import {
  MIN_PASSPHRASE_LENGTH,
  requirePassphrase,
} from '../../scripts/generate-private-content'

const NAME = 'PRIVATE_CONTENT_KEY_DEMO'

describe('private-content passphrase', () => {
  it('requires at least 16 characters', () => {
    expect(MIN_PASSPHRASE_LENGTH).toBe(16)
  })

  it('rejects a missing passphrase and names the variable', () => {
    expect(() => requirePassphrase(NAME, undefined)).toThrow(
      `Missing required private-content secret: ${NAME}`,
    )
    expect(() => requirePassphrase(NAME, '')).toThrow(NAME)
  })

  it('rejects a passphrase shorter than 16 characters', () => {
    expect(() => requirePassphrase(NAME, 'fifteen-chars!!')).toThrow(
      `${NAME} must be at least 16 characters long (got 15).`,
    )
  })

  it('accepts a passphrase of 16 characters or more', () => {
    expect(requirePassphrase(NAME, 'sixteen-chars!!!')).toBe('sixteen-chars!!!')
    expect(requirePassphrase(NAME, 'foundation-fixture-passphrase')).toBe(
      'foundation-fixture-passphrase',
    )
  })
})
