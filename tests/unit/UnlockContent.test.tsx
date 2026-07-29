import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { UnlockContent } from '@/components/protection/UnlockContent'
import { decryptPayload } from '@/lib/protection/crypto'

vi.mock('@/lib/protection/crypto', () => ({
  decryptPayload: vi.fn(),
}))

const manifest = {
  version: 1,
  entryId: 'demo-foundation',
  locale: 'en',
  domain: 'work',
  slug: 'protected-foundation',
  content: { url: '/protected/demo-foundation/en/content.envelope.json' },
  assets: [],
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('UnlockContent', () => {
  it('does not offer the content passphrase to account password managers', () => {
    render(
      <UnlockContent
        entryId="demo-foundation"
        manifestUrl="/protected/demo-foundation/en/manifest.json"
        locale="en"
        message="Enter the shared passphrase."
      />,
    )

    expect(screen.getByLabelText('Passphrase')).toHaveAttribute(
      'autocomplete',
      'off',
    )
  })

  it('rejects a manifest for a different protected entry', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ...manifest, entryId: 'other-entry' }),
      }),
    )
    const user = userEvent.setup()

    render(
      <UnlockContent
        entryId="demo-foundation"
        manifestUrl="/protected/demo-foundation/en/manifest.json"
        locale="en"
        message="Enter the shared passphrase."
      />,
    )
    await user.type(screen.getByLabelText('Passphrase'), 'right')
    await user.click(
      screen.getByRole('button', { name: 'Unlock in this browser' }),
    )

    expect(await screen.findByRole('alert')).toBeVisible()
    expect(decryptPayload).not.toHaveBeenCalled()
  })

  it('announces errors and returns focus to the passphrase field', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => manifest }),
    )
    vi.mocked(decryptPayload).mockRejectedValue(
      new Error('Unable to unlock content'),
    )
    const user = userEvent.setup()

    render(
      <UnlockContent
        entryId="demo-foundation"
        manifestUrl="/protected/demo-foundation/en/manifest.json"
        locale="en"
        message="Enter the shared passphrase."
      />,
    )
    const input = screen.getByLabelText('Passphrase')
    await user.type(input, 'wrong')
    await user.click(
      screen.getByRole('button', { name: 'Unlock in this browser' }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'That passphrase could not unlock this material.',
    )
    await waitFor(() => expect(input).toHaveFocus())
  })

  it('renders trusted decrypted HTML and clears it on reset', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => manifest })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ciphertext: 'fixture' }),
        }),
    )
    vi.mocked(decryptPayload).mockResolvedValue(
      new TextEncoder().encode('<h2>Decrypted field note</h2>'),
    )
    const user = userEvent.setup()

    render(
      <UnlockContent
        entryId="demo-foundation"
        manifestUrl="/protected/demo-foundation/en/manifest.json"
        locale="en"
        message="Enter the shared passphrase."
      />,
    )
    await user.type(screen.getByLabelText('Passphrase'), 'right')
    await user.click(
      screen.getByRole('button', { name: 'Unlock in this browser' }),
    )

    expect(
      await screen.findByRole('heading', { name: 'Decrypted field note' }),
    ).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Lock again' }))
    await waitFor(() =>
      expect(
        screen.queryByText('Decrypted field note'),
      ).not.toBeInTheDocument(),
    )
  })
})
