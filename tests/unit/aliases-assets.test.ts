import brandMark from '@assets/brand/carlosdev-mark.svg?raw'
import orbitDivider from '@assets/illustrations/orbit-divider.svg?raw'
import fieldGrid from '@assets/patterns/field-grid.svg?raw'
import { getAmbientSceneMode } from '@components/ambient/scene-policy'
import { validateContentIntegrity } from '@content/integrity'
import { taxonomy } from '@data/taxonomy'
import { getDictionary } from '@i18n/index'
import { cn } from '@lib/utils'
import * as hooksBoundary from '@hooks/index'

import { describe, expect, it } from 'vitest'

/* Illustrations and patterns adapt to the theme through `currentColor`. The
   brand mark deliberately does not: it carries its own palette so the logo is
   the same object on a light page, a dark page, and a browser tab. */
const inheritColour = [orbitDivider, fieldGrid]
const allAssets = [brandMark, ...inheritColour]

describe('workspace aliases', () => {
  it('resolve representative UI, component, lib, content, i18n, data, and asset imports', () => {
    expect(cn('field', undefined, 'atlas')).toBe('field atlas')
    expect(getDictionary('es').nav.work).toBe('Trabajo')
    expect(taxonomy.topics.architecture.en).toBe('Architecture')
    expect(validateContentIntegrity([])).toEqual([])
    expect(
      getAmbientSceneMode({
        webglAvailable: false,
        reducedMotion: false,
        isVisible: true,
      }),
    ).toBe('fallback')
    expect(brandMark).toContain('<svg')
    expect(Object.keys(hooksBoundary)).toEqual([])
  })
})

describe('identity SVG assets', () => {
  it('remain small, scalable, and free of expensive or embedded content', () => {
    for (const asset of allAssets) {
      expect(asset).toMatch(/viewBox="0 0 \d+ \d+"/)
      expect(asset).not.toMatch(/data:image|<image|<filter|<animate|<text/i)
      expect(asset.length).toBeLessThan(2_000)
    }
  })

  it('let illustrations inherit the theme, while the brand mark keeps its own', () => {
    for (const asset of inheritColour) expect(asset).toContain('currentColor')
    expect(brandMark).not.toContain('currentColor')
    /* Inlined three times per page, so a gradient `id` would collide. */
    expect(brandMark).not.toMatch(/id=|<linearGradient|<radialGradient/)
  })
})
