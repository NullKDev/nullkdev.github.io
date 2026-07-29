import { afterEach, describe, expect, it, vi } from 'vitest'

import { probeCapabilities } from '@/lib/capabilities'
import { iconNames, renderIcon } from '@/lib/icons'

afterEach(() => vi.unstubAllGlobals())

describe('capability probes', () => {
  it('reports permission-gated APIs as prompts, never as supported', () => {
    /* The API existing is not consent. Saying "supported" for the camera would
       tell a reader the tool just works, when clicking will actually raise a
       browser permission dialog. */
    vi.stubGlobal('navigator', {
      mediaDevices: { getUserMedia: () => undefined },
      clipboard: {},
    })
    expect(probeCapabilities('camera')).toBe('prompts')
    expect(probeCapabilities('microphone')).toBe('prompts')
    expect(probeCapabilities('clipboard')).toBe('prompts')
  })

  it('reports a permission API that is absent as missing, not prompts', () => {
    vi.stubGlobal('navigator', {})
    expect(probeCapabilities('camera')).toBe('missing')
    expect(probeCapabilities('clipboard')).toBe('missing')
  })

  it('detects WebGPU by feature, never by user agent', () => {
    vi.stubGlobal('navigator', { gpu: {} })
    expect(probeCapabilities('webgpu')).toBe('supported')
    vi.stubGlobal('navigator', {})
    expect(probeCapabilities('webgpu')).toBe('missing')
  })

  it('treats a context that cannot be created as missing rather than throwing', () => {
    vi.stubGlobal('document', {
      createElement: () => ({ getContext: () => null }),
    })
    expect(probeCapabilities('webgl')).toBe('missing')

    vi.stubGlobal('document', {
      createElement: () => {
        throw new Error('blocked')
      },
    })
    expect(probeCapabilities('webgl')).toBe('missing')
  })

  it('validates a real SIMD module rather than trusting a version check', () => {
    expect(['supported', 'missing']).toContain(probeCapabilities('simd'))
    expect(probeCapabilities('wasm')).toBe('supported')
  })

  it('probes storage by writing, because availability is not the same as permission', () => {
    vi.stubGlobal('localStorage', {
      setItem: () => undefined,
      removeItem: () => undefined,
    })
    expect(probeCapabilities('storage')).toBe('supported')

    vi.stubGlobal('localStorage', {
      setItem: () => {
        throw new Error('denied')
      },
      removeItem: () => undefined,
    })
    expect(probeCapabilities('storage')).toBe('missing')
  })

  it('only calls the network missing when the browser says it is offline', () => {
    vi.stubGlobal('navigator', { onLine: false })
    expect(probeCapabilities('network')).toBe('missing')
    vi.stubGlobal('navigator', { onLine: true })
    expect(probeCapabilities('network')).toBe('supported')
    // `undefined` is unknown, not offline — do not accuse the connection.
    vi.stubGlobal('navigator', {})
    expect(probeCapabilities('network')).toBe('supported')
  })

  it('assumes an unrecognised requirement is met rather than blocking a tool', () => {
    // A typo in frontmatter should not silently disable a working entry; the
    // build-time content checks are where an unknown name gets caught.
    expect(probeCapabilities('teleportation')).toBe('supported')
  })
})

describe('icon registry', () => {
  it('resolves every registered name to real SVG markup', () => {
    expect(iconNames.length).toBeGreaterThan(20)
    for (const name of iconNames) {
      const markup = renderIcon(name)
      expect(markup, name).toContain('<svg')
      expect(markup, name).toContain('</svg>')
    }
  })

  it('inherits colour instead of baking one in', () => {
    /* Every icon has to survive the theme toggle. A hardcoded fill would look
       correct in light mode and disappear in dark. */
    const markup = renderIcon('check')
    expect(markup).toMatch(/currentColor/)
  })

  it('honours the requested size', () => {
    const markup = renderIcon('check', 32)
    expect(markup).toContain('32')
  })

  it('returns the same markup for the same request', () => {
    // Results are cached by name and size; a mutated cache entry would leak
    // one icon's attributes into another's.
    expect(renderIcon('check', 24)).toBe(renderIcon('check', 24))
    expect(renderIcon('check', 24)).not.toBe(renderIcon('check', 48))
  })
})
