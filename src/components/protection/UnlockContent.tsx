import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { getDictionary, type Locale } from '@i18n/index'
import { decryptPayload } from '@lib/protection/crypto'
import { isProtectedManifest } from '@lib/protection/manifest'
import { Button } from '@ui/button'

interface UnlockContentProps {
  entryId: string
  manifestUrl: string
  locale: Locale
  message: string
}

interface FormSubmission {
  preventDefault(): void
}

const fetchJson = async (url: string): Promise<unknown> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Protected payload is unavailable')
  return response.json()
}

const subscribeToHydration = () => () => undefined
const getHydratedSnapshot = () => true
const getServerSnapshot = () => false

export function UnlockContent({
  entryId,
  manifestUrl,
  locale,
  message,
}: UnlockContentProps) {
  const dictionary = getDictionary(locale).protection
  const [password, setPassword] = useState('')
  const [html, setHtml] = useState<string>()
  const [assetUrls, setAssetUrls] = useState<Map<string, string>>(new Map())
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'error' | 'unlocked'
  >('idle')
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerSnapshot,
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const shouldRestoreFocus = useRef(false)

  useEffect(() => {
    if (
      !shouldRestoreFocus.current ||
      (status !== 'error' && status !== 'idle')
    )
      return
    shouldRestoreFocus.current = false
    inputRef.current?.focus()
  }, [status])

  useEffect(() => {
    const container = contentRef.current
    if (!container || !html) return
    container.innerHTML = html
    for (const [source, objectUrl] of assetUrls) {
      for (const element of container.querySelectorAll<HTMLElement>(
        '[data-protected-asset]',
      )) {
        if (element.dataset.protectedAsset !== source) continue
        if (
          element instanceof HTMLImageElement ||
          element instanceof HTMLSourceElement
        ) {
          element.src = objectUrl
          element.removeAttribute('data-protected-asset')
        }
      }
    }
  }, [assetUrls, html])

  useEffect(
    () => () => {
      for (const url of assetUrls.values()) URL.revokeObjectURL(url)
    },
    [assetUrls],
  )

  const reset = () => {
    for (const url of assetUrls.values()) URL.revokeObjectURL(url)
    setAssetUrls(new Map())
    setHtml(undefined)
    setPassword('')
    shouldRestoreFocus.current = true
    setStatus('idle')
  }

  const unlock = async (event: FormSubmission) => {
    event.preventDefault()
    setStatus('loading')

    try {
      const manifestValue = await fetchJson(manifestUrl)
      if (
        !isProtectedManifest(manifestValue) ||
        manifestValue.entryId !== entryId ||
        manifestValue.locale !== locale
      ) {
        throw new Error('Invalid protected-content manifest')
      }
      const contentEnvelope = await fetchJson(manifestValue.content.url)
      const decryptedContent = await decryptPayload(password, contentEnvelope, {
        entryId: manifestValue.entryId,
        locale,
        payloadKind: 'document',
        payloadId: 'content',
        contentType: 'text/html; charset=utf-8',
      })
      const nextAssetUrls = new Map<string, string>()

      for (const asset of manifestValue.assets) {
        const envelope = await fetchJson(asset.url)
        const contentType =
          typeof envelope === 'object' && envelope && 'contentType' in envelope
            ? String(envelope.contentType)
            : 'application/octet-stream'
        const bytes = await decryptPayload(password, envelope, {
          entryId: manifestValue.entryId,
          locale,
          payloadKind: 'asset',
          payloadId: asset.assetId,
          contentType,
        })
        nextAssetUrls.set(
          asset.assetId,
          URL.createObjectURL(
            new Blob([new Uint8Array(bytes).buffer], { type: contentType }),
          ),
        )
      }

      setAssetUrls(nextAssetUrls)
      setHtml(new TextDecoder().decode(decryptedContent))
      setPassword('')
      setStatus('unlocked')
    } catch {
      shouldRestoreFocus.current = true
      setStatus('error')
    }
  }

  if (status === 'unlocked') {
    return (
      <section className="unlock-panel unlock-panel--open">
        <div ref={contentRef} className="protected-prose" />
        <Button
          className="text-button"
          variant="quiet"
          type="button"
          onClick={reset}
        >
          {dictionary.reset}
        </Button>
      </section>
    )
  }

  return (
    <section className="unlock-panel" aria-labelledby="unlock-title">
      <p className="kicker">AES-256-GCM / PBKDF2</p>
      <h1 id="unlock-title">{dictionary.title}</h1>
      <p>{message}</p>
      <p className="security-note">{dictionary.explanation}</p>
      <form onSubmit={unlock}>
        <label htmlFor="protected-passphrase">{dictionary.label}</label>
        <input
          ref={inputRef}
          id="protected-passphrase"
          name="passphrase"
          type="password"
          autoComplete="off"
          value={password}
          required
          disabled={!isHydrated || status === 'loading'}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit" disabled={!isHydrated || status === 'loading'}>
          {status === 'loading' ? dictionary.loading : dictionary.unlock}
        </Button>
      </form>
      <div aria-live="assertive">
        {status === 'error' && <p role="alert">{dictionary.error}</p>}
      </div>
    </section>
  )
}
