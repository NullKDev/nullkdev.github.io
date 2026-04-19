/**
 * Unit tests for encryption utilities
 * Tests both sync (Node.js) and async (Web Crypto) implementations
 */

import { describe, it, expect, beforeAll, vi } from 'vitest'

// Import sync functions via ESM with alias
import {
  encryptContentSync,
  decryptContentSync,
  hashPasswordSync,
  verifyPasswordSync,
} from '@/lib/encryption'

describe('Encryption - Sync Functions (Node.js)', () => {
  describe('encryptContentSync', () => {
    it('should encrypt and decrypt content correctly', () => {
      const content = 'Hello, World!'
      const password = 'test-password-123'

      const encrypted = encryptContentSync(content, password)
      expect(encrypted).toBeDefined()
      expect(typeof encrypted).toBe('string')
      expect(encrypted.length).toBeGreaterThan(0)

      const decrypted = decryptContentSync(encrypted, password)
      expect(decrypted).toBe(content)
    })

    it('should produce different ciphertext for same content with different passwords', () => {
      const content = 'Secret message'
      const password1 = 'password1'
      const password2 = 'password2'

      const encrypted1 = encryptContentSync(content, password1)
      const encrypted2 = encryptContentSync(content, password2)

      expect(encrypted1).not.toBe(encrypted2)
    })

    it('should encrypt empty string', () => {
      const content = ''
      const password = 'test-password'

      const encrypted = encryptContentSync(content, password)
      const decrypted = decryptContentSync(encrypted, password)

      expect(decrypted).toBe(content)
    })

    it('should encrypt unicode content', () => {
      const content = 'Hola Mundo! 你好世界 🎉'
      const password = 'test-password'

      const encrypted = encryptContentSync(content, password)
      const decrypted = decryptContentSync(encrypted, password)

      expect(decrypted).toBe(content)
    })

    it('should encrypt large content', () => {
      const content = 'A'.repeat(10000)
      const password = 'test-password'

      const encrypted = encryptContentSync(content, password)
      const decrypted = decryptContentSync(encrypted, password)

      expect(decrypted).toBe(content)
    })

    it('should handle special characters', () => {
      const content = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
      const password = 'test-password'

      const encrypted = encryptContentSync(content, password)
      const decrypted = decryptContentSync(encrypted, password)

      expect(decrypted).toBe(content)
    })

    it('should handle multiline content', () => {
      const content = 'Line 1\nLine 2\nLine 3'
      const password = 'test-password'

      const encrypted = encryptContentSync(content, password)
      const decrypted = decryptContentSync(encrypted, password)

      expect(decrypted).toBe(content)
    })
  })

  describe('decryptContentSync', () => {
    it('should return null for invalid password', () => {
      const content = 'Secret message'
      const password = 'correct-password'
      const wrongPassword = 'wrong-password'

      const encrypted = encryptContentSync(content, password)
      const decrypted = decryptContentSync(encrypted, wrongPassword)

      expect(decrypted).toBeNull()
    })

    it('should return null for corrupted encrypted data', () => {
      const password = 'test-password'

      const corrupted = Buffer.from('not-valid-base64').toString('base64')
      const decrypted = decryptContentSync(corrupted, password)

      expect(decrypted).toBeNull()
    })

    it('should return null for empty encrypted data', () => {
      const password = 'test-password'

      const decrypted = decryptContentSync('', password)
      expect(decrypted).toBeNull()
    })

    it('should return null for invalid base64', () => {
      const password = 'test-password'

      const invalidBase64 = '!!!invalid-base64!!!'
      const decrypted = decryptContentSync(invalidBase64, password)

      expect(decrypted).toBeNull()
    })
  })

  describe('hashPasswordSync', () => {
    it('should produce consistent hash for same input', () => {
      const password = 'test-password'

      const hash1 = hashPasswordSync(password)
      const hash2 = hashPasswordSync(password)

      expect(hash1).toBe(hash2)
    })

    it('should produce different hash for different passwords', () => {
      const hash1 = hashPasswordSync('password1')
      const hash2 = hashPasswordSync('password2')

      expect(hash1).not.toBe(hash2)
    })

    it('should return base64 encoded string', () => {
      const password = 'test-password'

      const hash = hashPasswordSync(password)

      // Should be valid base64
      expect(() => Buffer.from(hash, 'base64')).not.toThrow()
    })

    it('should hash empty string', () => {
      const hash = hashPasswordSync('')

      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })

    it('should produce fixed-length output', () => {
      const hash1 = hashPasswordSync('short')
      const hash2 = hashPasswordSync('a-very-long-password-that-is-much-longer')

      expect(hash1.length).toBe(hash2.length)
    })
  })

  describe('verifyPasswordSync', () => {
    it('should verify correct password', () => {
      const password = 'test-password'

      const hash = hashPasswordSync(password)
      const isValid = verifyPasswordSync(hash, password)

      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', () => {
      const password = 'correct-password'
      const wrongPassword = 'wrong-password'

      const hash = hashPasswordSync(password)
      const isValid = verifyPasswordSync(hash, wrongPassword)

      expect(isValid).toBe(false)
    })

    it('should reject empty password when hash is for non-empty', () => {
      const password = 'test-password'

      const hash = hashPasswordSync(password)
      const isValid = verifyPasswordSync(hash, '')

      expect(isValid).toBe(false)
    })

    it('should accept empty password when hash is for empty', () => {
      const hash = hashPasswordSync('')
      const isValid = verifyPasswordSync(hash, '')

      expect(isValid).toBe(true)
    })
  })
})

// Test async function signatures (cannot fully mock Web Crypto in Node.js)
describe('Encryption - Async Function Signatures', () => {
  describe('hashPassword', () => {
    it('should be async function', async () => {
      const { hashPassword } = await import('@/lib/encryption')

      expect(hashPassword).toBeDefined()
      expect(typeof hashPassword).toBe('function')
    })

    it('should accept string and return Promise', async () => {
      const { hashPassword } = await import('@/lib/encryption')

      const result = hashPassword('test-password')
      expect(result).toBeInstanceOf(Promise)
    })
  })

  describe('verifyPassword', () => {
    it('should be async function', async () => {
      const { verifyPassword } = await import('@/lib/encryption')

      expect(verifyPassword).toBeDefined()
      expect(typeof verifyPassword).toBe('function')
    })

    it('should accept two string parameters', async () => {
      const { verifyPassword } = await import('@/lib/encryption')

      const result = verifyPassword('hash', 'password')
      expect(result).toBeInstanceOf(Promise)
    })
  })

  describe('encryptContent', () => {
    it('should be async function', async () => {
      const { encryptContent } = await import('@/lib/encryption')

      expect(encryptContent).toBeDefined()
      expect(typeof encryptContent).toBe('function')
    })

    it('should accept two string parameters and return Promise', async () => {
      const { encryptContent } = await import('@/lib/encryption')

      const result = encryptContent('content', 'password')
      expect(result).toBeInstanceOf(Promise)
    })
  })

  describe('decryptContent', () => {
    it('should be async function', async () => {
      const { decryptContent } = await import('@/lib/encryption')

      expect(decryptContent).toBeDefined()
      expect(typeof decryptContent).toBe('function')
    })

    it('should accept two string parameters and return Promise', async () => {
      const { decryptContent } = await import('@/lib/encryption')

      const result = decryptContent('encrypted', 'password')
      expect(result).toBeInstanceOf(Promise)
    })
  })

  describe('slowHashPassword', () => {
    it('should be async function', async () => {
      const { slowHashPassword } = await import('@/lib/encryption')

      expect(slowHashPassword).toBeDefined()
      expect(typeof slowHashPassword).toBe('function')
    })

    it('should accept password and salt parameters', async () => {
      const { slowHashPassword } = await import('@/lib/encryption')

      const result = slowHashPassword('password', 'salt')
      expect(result).toBeInstanceOf(Promise)
    })
  })
})