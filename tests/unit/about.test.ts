import { describe, expect, it } from 'vitest'

import type { Position } from '@/data/about'
import {
  formatDuration,
  formatPeriod,
  getYearsBuilding,
  isCurrent,
} from '@/lib/about'

const position = (start: string, end: string | null): Position =>
  ({ start, end }) as Position

const units = {
  year: 'year',
  years: 'years',
  month: 'month',
  months: 'months',
}

describe('about derivation', () => {
  it('counts only whole years, so the figure never rounds up', () => {
    // Career starts 2018-06. Eleven months in is still "7 years", not 8.
    expect(getYearsBuilding(new Date(Date.UTC(2026, 4, 1)))).toBe(7)
    expect(getYearsBuilding(new Date(Date.UTC(2026, 5, 1)))).toBe(8)
  })

  it('parses YYYY-MM as UTC so a GMT-5 machine cannot shift the month', () => {
    /* `new Date('2023-10')` is midnight UTC, but any local-time construction
       lands in September for the author's own build machine. A period that
       silently reads one month early is the kind of error nobody spots. */
    expect(formatPeriod(position('2023-10', null), 'en', 'present')).toBe(
      'Oct 2023 — present',
    )
    expect(formatPeriod(position('2018-06', '2023-09'), 'en', 'present')).toBe(
      'Jun 2018 — Sep 2023',
    )
  })

  it('renders the period in the reader language', () => {
    expect(formatPeriod(position('2023-10', null), 'es', 'actualidad')).toMatch(
      /2023 — actualidad$/,
    )
  })

  it('treats a null end as the position still being held', () => {
    expect(isCurrent(position('2023-10', null))).toBe(true)
    expect(isCurrent(position('2018-06', '2023-09'))).toBe(false)
  })

  it('agrees number on both units independently', () => {
    expect(formatDuration(position('2023-01', '2024-02'), units)).toBe(
      '1 year 1 month',
    )
    expect(formatDuration(position('2023-01', '2025-04'), units)).toBe(
      '2 years 3 months',
    )
  })

  it('drops the empty half rather than printing a zero', () => {
    expect(formatDuration(position('2023-01', '2025-01'), units)).toBe(
      '2 years',
    )
    expect(formatDuration(position('2023-01', '2023-05'), units)).toBe(
      '4 months',
    )
  })

  it('measures an open position against now', () => {
    expect(
      formatDuration(
        position('2023-10', null),
        units,
        new Date(Date.UTC(2026, 6, 1)),
      ),
    ).toBe('2 years 9 months')
  })

  it('says zero months rather than an empty string on a same-month range', () => {
    expect(formatDuration(position('2024-03', '2024-03'), units)).toBe(
      '0 months',
    )
  })
})
