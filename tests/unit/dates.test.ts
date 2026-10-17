// The build machine sits west of UTC. A frontmatter date (`2026-03-27`) parses
// as UTC midnight, so formatting it in the machine's zone printed the 26th.
process.env.TZ = 'America/Lima'

import { describe, expect, it } from 'vitest'

import { formatDate, isoDate, isSameDay } from '@/lib/dates'

const published = new Date('2026-03-27')

describe('formatDate', () => {
  it('reproduces the bug it exists for: the local zone shifts the day', () => {
    expect(published.toLocaleDateString('en', { dateStyle: 'medium' })).toBe(
      'Mar 26, 2026',
    )
  })

  it('formats the calendar day the frontmatter declares, in both locales', () => {
    expect(formatDate(published, 'en')).toBe('Mar 27, 2026')
    expect(formatDate(published, 'es')).toMatch(/^27 mar\.? 2026$/)
  })

  it('keeps the month when only the month is shown', () => {
    expect(formatDate(new Date('2026-04-01'), 'en', 'month')).toBe('Apr 2026')
    expect(formatDate(new Date('2026-04-01'), 'es', 'month')).toMatch(
      /^abr\.? 2026$/,
    )
  })
})

describe('isoDate', () => {
  it('writes the declared day for a datetime attribute', () => {
    expect(isoDate(published)).toBe('2026-03-27')
  })
})

describe('isSameDay', () => {
  it('compares calendar days, not instants', () => {
    expect(isSameDay(published, new Date('2026-03-27T18:00:00Z'))).toBe(true)
    expect(isSameDay(published, new Date('2026-03-28'))).toBe(false)
    expect(isSameDay(published, undefined)).toBe(false)
  })
})
