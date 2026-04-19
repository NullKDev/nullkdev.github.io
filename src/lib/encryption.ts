/**
 * Encryption utilities - Hybrid implementation for SSG and runtime
 *
 * Uses Node crypto at build time (sync) and Web Crypto at runtime (async)
 */

// ============================================================================
// SYNC VERSIONS (for Astro frontmatter SSG - dynamically loaded)
// ============================================================================

function getNodeCrypto() {
  const { createCipheriv, createDecipheriv, createHash, pbkdf2Sync, randomBytes } = require('crypto')
  return { createCipheriv, createDecipheriv, createHash, pbkdf2Sync, randomBytes }
}

const ALGORITHM = 'aes-256-cbc'
const KEY_LENGTH = 32
const IV_LENGTH = 16
const SALT_LENGTH = 32
const ITERATIONS = 100_000
const DIGEST = 'sha512'

function deriveKeyNode(password: string, salt: unknown): Buffer {
  const { pbkdf2Sync } = getNodeCrypto()
  return pbkdf2Sync(password, salt as Buffer, ITERATIONS, KEY_LENGTH, DIGEST)
}

export function encryptContentSync(content: string, password: string): string {
  const { randomBytes, createCipheriv } = getNodeCrypto()
  const salt = randomBytes(SALT_LENGTH)
  const iv = randomBytes(IV_LENGTH)
  const key = deriveKeyNode(password, salt)

  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(content, 'utf8'),
    cipher.final(),
  ])

  const combined = Buffer.concat([salt, iv, encrypted])
  return combined.toString('base64')
}

export function decryptContentSync(
  encryptedData: string,
  password: string,
): string | null {
  try {
    const { createDecipheriv } = getNodeCrypto()
    const combined = Buffer.from(encryptedData, 'base64')

    const salt = combined.subarray(0, SALT_LENGTH)
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
    const ciphertext = combined.subarray(SALT_LENGTH + IV_LENGTH)

    const key = deriveKeyNode(password, salt)
    const decipher = createDecipheriv(ALGORITHM, key, iv)

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ])

    return decrypted.toString('utf8')
  } catch {
    return null
  }
}

export function hashPasswordSync(password: string): string {
  const { createHash } = getNodeCrypto()
  return createHash('sha256').update(password).digest('base64')
}

export function verifyPasswordSync(hash: string, input: string): boolean {
  return hashPasswordSync(input) === hash
}

// ============================================================================
// ASYNC VERSIONS (for browser runtime using Web Crypto API)
// ============================================================================

function arrayToBase64(array: Uint8Array): string {
  let binary = ''
  array.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function base64ToArray(base64: string): Uint8Array {
  const binary = atob(base64)
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }
  return array
}

async function deriveKeyWebCrypto(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' } as Algorithm,
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256',
    } as Pbkdf2Params,
    keyMaterial,
    { name: 'AES-GCM', length: 256 } as AesDerivedKeyParams,
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptContent(
  content: string,
  password: string,
): Promise<string> {
  const encoder = new TextEncoder()

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKeyWebCrypto(password, salt)

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv } as Algorithm,
    key,
    encoder.encode(content),
  )

  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
  combined.set(salt, 0)
  combined.set(iv, salt.length)
  combined.set(new Uint8Array(encrypted), salt.length + iv.length)

  return arrayToBase64(combined)
}

export async function decryptContent(
  encryptedData: string,
  password: string,
): Promise<string | null> {
  try {
    const combined = base64ToArray(encryptedData)

    const salt = combined.slice(0, 16)
    const iv = combined.slice(16, 28)
    const ciphertext = combined.slice(28)

    const key = await deriveKeyWebCrypto(password, salt)

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv } as Algorithm,
      key,
      ciphertext,
    )

    return new TextDecoder().decode(decrypted)
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password))
  return arrayToBase64(new Uint8Array(hashBuffer))
}

export async function verifyPassword(
  hash: string,
  input: string,
): Promise<boolean> {
  const inputHash = await hashPassword(input)
  return inputHash === hash
}

export async function slowHashPassword(
  password: string,
  salt: string,
): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' } as Algorithm,
      false,
      ['deriveBits'],
    )
    const derived = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 100_000,
        hash: 'SHA-256',
      } as Pbkdf2Params,
      keyMaterial,
      256,
    )
    return Array.from(new Uint8Array(derived))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const { pbkdf2Sync } = getNodeCrypto()
  const derived = pbkdf2Sync(password, salt, 100_000, 32, 'sha256') as unknown as Buffer
  return Array.from(derived)
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('')
}