import CryptoJS from 'crypto-js'

export function encryptContent(content: string, password: string): string {
  return CryptoJS.AES.encrypt(content, password).toString()
}

export function decryptContent(encrypted: string, password: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, password)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted || null
  } catch {
    return null
  }
}
