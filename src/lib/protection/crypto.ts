export const PBKDF2_ITERATIONS = 600_000

const SALT_BYTES = 16
const IV_BYTES = 12
const ENVELOPE_VERSION = 2 as const

export type ProtectionLocale = 'en' | 'es'
export type PayloadKind = 'document' | 'asset'

export interface ProtectionContext {
  entryId: string
  locale: ProtectionLocale
  payloadKind: PayloadKind
  payloadId: string
  contentType: string
}

export interface ProtectedEnvelope extends ProtectionContext {
  version: typeof ENVELOPE_VERSION
  kdf: {
    name: 'PBKDF2'
    hash: 'SHA-256'
    iterations: typeof PBKDF2_ITERATIONS
    salt: string
  }
  cipher: {
    name: 'AES-256-GCM'
    iv: string
  }
  aad: string
  ciphertext: string
}

interface FixedRandomValues {
  salt: Uint8Array
  iv: Uint8Array
}

type OwnedBytes = Uint8Array<ArrayBuffer>

const encoder = new TextEncoder()

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

const base64ToBytes = (value: string): OwnedBytes => {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

const createAad = (context: ProtectionContext): OwnedBytes =>
  encoder.encode(
    [
      `nullkdev:protected:v${ENVELOPE_VERSION}`,
      context.entryId,
      context.locale,
      context.payloadKind,
      context.payloadId,
      context.contentType,
    ].join('\0'),
  )

const deriveKey = async (
  password: string,
  salt: OwnedBytes,
  usage: KeyUsage,
) => {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations: PBKDF2_ITERATIONS,
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    [usage],
  )
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0

export const isProtectedEnvelope = (
  value: unknown,
): value is ProtectedEnvelope => {
  if (!value || typeof value !== 'object') return false
  const envelope = value as Partial<ProtectedEnvelope>

  return (
    envelope.version === ENVELOPE_VERSION &&
    isNonEmptyString(envelope.entryId) &&
    (envelope.locale === 'en' || envelope.locale === 'es') &&
    (envelope.payloadKind === 'document' || envelope.payloadKind === 'asset') &&
    isNonEmptyString(envelope.payloadId) &&
    isNonEmptyString(envelope.contentType) &&
    envelope.kdf?.name === 'PBKDF2' &&
    envelope.kdf.hash === 'SHA-256' &&
    envelope.kdf.iterations === PBKDF2_ITERATIONS &&
    isNonEmptyString(envelope.kdf.salt) &&
    envelope.cipher?.name === 'AES-256-GCM' &&
    isNonEmptyString(envelope.cipher.iv) &&
    isNonEmptyString(envelope.aad) &&
    isNonEmptyString(envelope.ciphertext)
  )
}

export const encryptPayload = async (
  password: string,
  plaintext: Uint8Array,
  context: ProtectionContext,
  fixedRandom?: FixedRandomValues,
): Promise<ProtectedEnvelope> => {
  if (!password) throw new Error('A non-empty password is required')

  const salt = new Uint8Array(
    fixedRandom?.salt ?? crypto.getRandomValues(new Uint8Array(SALT_BYTES)),
  )
  const iv = new Uint8Array(
    fixedRandom?.iv ?? crypto.getRandomValues(new Uint8Array(IV_BYTES)),
  )
  if (salt.byteLength !== SALT_BYTES || iv.byteLength !== IV_BYTES) {
    throw new Error('Invalid salt or IV length')
  }

  const aad = createAad(context)
  const key = await deriveKey(password, salt, 'encrypt')
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: aad, tagLength: 128 },
    key,
    new Uint8Array(plaintext),
  )

  return {
    version: ENVELOPE_VERSION,
    ...context,
    kdf: {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: PBKDF2_ITERATIONS,
      salt: bytesToBase64(salt),
    },
    cipher: { name: 'AES-256-GCM', iv: bytesToBase64(iv) },
    aad: bytesToBase64(aad),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
  }
}

export const decryptPayload = async (
  password: string,
  envelope: unknown,
  expectedContext: ProtectionContext,
): Promise<Uint8Array> => {
  if (!isProtectedEnvelope(envelope))
    throw new Error('Invalid protected-content envelope')

  if (
    envelope.entryId !== expectedContext.entryId ||
    envelope.locale !== expectedContext.locale ||
    envelope.payloadKind !== expectedContext.payloadKind ||
    envelope.payloadId !== expectedContext.payloadId ||
    envelope.contentType !== expectedContext.contentType
  ) {
    throw new Error('Invalid protected-content envelope')
  }

  const expectedAad = createAad(expectedContext)
  if (bytesToBase64(expectedAad) !== envelope.aad) {
    throw new Error('Invalid protected-content envelope')
  }

  try {
    const key = await deriveKey(
      password,
      base64ToBytes(envelope.kdf.salt),
      'decrypt',
    )
    const plaintext = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: base64ToBytes(envelope.cipher.iv),
        additionalData: expectedAad,
        tagLength: 128,
      },
      key,
      base64ToBytes(envelope.ciphertext),
    )
    return new Uint8Array(plaintext)
  } catch {
    throw new Error('Unable to unlock content')
  }
}
