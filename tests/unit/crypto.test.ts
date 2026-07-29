import { describe, expect, it } from 'vitest'

import {
  PBKDF2_ITERATIONS,
  decryptPayload,
  encryptPayload,
  type ProtectionContext,
} from '@/lib/protection/crypto'

const context: ProtectionContext = {
  entryId: 'work-secure-system',
  locale: 'en',
  payloadKind: 'document',
  payloadId: 'content',
  contentType: 'text/html; charset=utf-8',
}

const fixedRandom = {
  salt: Uint8Array.from({ length: 16 }, (_, index) => index),
  iv: Uint8Array.from({ length: 12 }, (_, index) => index + 16),
}

describe('encrypted payloads', () => {
  it('uses the centrally defined OWASP PBKDF2 work factor', () => {
    expect(PBKDF2_ITERATIONS).toBe(600_000)
  })

  it('round-trips a shared deterministic test vector', async () => {
    const payload = new TextEncoder().encode('<h1>Private field notes</h1>')
    const envelope = await encryptPayload(
      'correct horse battery staple',
      payload,
      context,
      fixedRandom,
    )

    expect(envelope).toMatchInlineSnapshot(`
      {
        "aad": "bnVsbGtkZXY6cHJvdGVjdGVkOnYyAHdvcmstc2VjdXJlLXN5c3RlbQBlbgBkb2N1bWVudABjb250ZW50AHRleHQvaHRtbDsgY2hhcnNldD11dGYtOA==",
        "cipher": {
          "iv": "EBESExQVFhcYGRob",
          "name": "AES-256-GCM",
        },
        "ciphertext": "MHpM+0CNwQGqzvzoqpoRlnUY9IvyAqWX7Fgq1G7YSX4DQAtIBTcd4/2/M8Y=",
        "contentType": "text/html; charset=utf-8",
        "entryId": "work-secure-system",
        "kdf": {
          "hash": "SHA-256",
          "iterations": 600000,
          "name": "PBKDF2",
          "salt": "AAECAwQFBgcICQoLDA0ODw==",
        },
        "locale": "en",
        "payloadId": "content",
        "payloadKind": "document",
        "version": 2,
      }
    `)

    expect(
      Array.from(
        await decryptPayload('correct horse battery staple', envelope, context),
      ),
    ).toEqual(Array.from(payload))
  })

  it('rejects a wrong password', async () => {
    const envelope = await encryptPayload(
      'right-password',
      new TextEncoder().encode('protected'),
      context,
    )

    await expect(
      decryptPayload('wrong-password', envelope, context),
    ).rejects.toThrow('Unable to unlock content')
  })

  it('rejects tampered ciphertext', async () => {
    const envelope = await encryptPayload(
      'password',
      new TextEncoder().encode('protected'),
      context,
    )
    const ciphertext = Uint8Array.from(
      Buffer.from(envelope.ciphertext, 'base64'),
    )
    ciphertext[0] ^= 1

    await expect(
      decryptPayload(
        'password',
        {
          ...envelope,
          ciphertext: Buffer.from(ciphertext).toString('base64'),
        },
        context,
      ),
    ).rejects.toThrow('Unable to unlock content')
  })

  it('binds entry, locale, payload kind, and content type through AAD', async () => {
    const envelope = await encryptPayload(
      'password',
      new TextEncoder().encode('protected'),
      context,
    )

    await expect(
      decryptPayload('password', { ...envelope, locale: 'es' }, context),
    ).rejects.toThrow('Invalid protected-content envelope')
  })

  it('rejects an authentic envelope substituted into another caller context', async () => {
    const envelope = await encryptPayload(
      'password',
      new TextEncoder().encode('protected'),
      context,
    )

    await expect(
      decryptPayload('password', envelope, {
        ...context,
        entryId: 'work-other-system',
      }),
    ).rejects.toThrow('Invalid protected-content envelope')
  })

  it('binds each encrypted asset to its manifest asset ID', async () => {
    const assetContext: ProtectionContext = {
      ...context,
      payloadKind: 'asset',
      payloadId: 'asset-1',
      contentType: 'image/png',
    }
    const envelope = await encryptPayload(
      'password',
      Uint8Array.from([1, 2, 3]),
      assetContext,
    )

    await expect(
      decryptPayload('password', envelope, {
        ...assetContext,
        payloadId: 'asset-2',
      }),
    ).rejects.toThrow('Invalid protected-content envelope')
  })

  it('preserves Unicode and arbitrary binary bytes', async () => {
    const unicode = new TextEncoder().encode('Español, 日本語, and emoji: 🛰️')
    const binary = Uint8Array.from([0, 255, 1, 128, 64, 10])

    const unicodeEnvelope = await encryptPayload(
      'unicode-key',
      unicode,
      context,
    )
    const binaryEnvelope = await encryptPayload('binary-key', binary, {
      ...context,
      payloadKind: 'asset',
      payloadId: 'asset-binary',
      contentType: 'application/octet-stream',
    })

    expect(
      Array.from(await decryptPayload('unicode-key', unicodeEnvelope, context)),
    ).toEqual(Array.from(unicode))
    expect(
      Array.from(
        await decryptPayload('binary-key', binaryEnvelope, {
          ...context,
          payloadKind: 'asset',
          payloadId: 'asset-binary',
          contentType: 'application/octet-stream',
        }),
      ),
    ).toEqual(Array.from(binary))
  })

  it('uses a fresh random IV for each encryption', async () => {
    const payload = new TextEncoder().encode('same content')
    const first = await encryptPayload('password', payload, context)
    const second = await encryptPayload('password', payload, context)

    expect(first.cipher.iv).not.toBe(second.cipher.iv)
    expect(first.ciphertext).not.toBe(second.ciphertext)
  })
})
