import { describe, expect, it } from 'vitest'

import { getAmbientSceneMode } from '@/components/ambient/scene-policy'

describe('ambient scene policy', () => {
  it('uses the static fallback when WebGL is unavailable', () => {
    expect(
      getAmbientSceneMode({
        webglAvailable: false,
        reducedMotion: false,
        isVisible: true,
      }),
    ).toBe('fallback')
  })

  it('uses a still demand-rendered scene when reduced motion is requested', () => {
    expect(
      getAmbientSceneMode({
        webglAvailable: true,
        reducedMotion: true,
        isVisible: true,
      }),
    ).toBe('still')
  })

  it('pauses rendering while outside the viewport', () => {
    expect(
      getAmbientSceneMode({
        webglAvailable: true,
        reducedMotion: false,
        isVisible: false,
      }),
    ).toBe('paused')
  })
})
