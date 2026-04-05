import CryptoJS from 'crypto-js'

export function encryptContent(content: string, password: string): string {
  return CryptoJS.AES.encrypt(content, password).toString()
}

export function decryptContent(
  encrypted: string,
  password: string,
): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, password)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted || null
  } catch {
    return null
  }
}

export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString()
}

export function verifyPassword(hash: string, input: string): boolean {
  return CryptoJS.SHA256(input).toString() === hash
}

export async function slowHashPassword(
  password: string,
  salt: string,
): Promise<string> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  )
  return Array.from(new Uint8Array(derived))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
