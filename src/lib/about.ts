import { careerStart, type Position } from '@/data/about'
import type { Locale } from '@/i18n'

/* `YYYY-MM` parsed as a UTC instant. Constructing through `new Date('2023-10')`
   would land on a local-midnight boundary and shift the month for anyone west
   of UTC — including the author's own GMT-5 build machine. */
const parseMonth = (value: string): Date => {
  const [year, month] = value.split('-').map(Number)
  return new Date(Date.UTC(year, (month ?? 1) - 1, 1))
}

const monthsBetween = (from: Date, to: Date): number =>
  (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
  (to.getUTCMonth() - from.getUTCMonth())

/** Whole years building, measured from `careerStart` at build time. */
export const getYearsBuilding = (now = new Date()): number =>
  Math.floor(monthsBetween(parseMonth(careerStart), now) / 12)

export const isCurrent = (position: Position): boolean => position.end === null

/** `Oct 2023 — present` · `Jun 2018 — Sep 2023`, in the reader's language. */
export const formatPeriod = (
  position: Position,
  locale: Locale,
  present: string,
): string => {
  const format = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const start = format.format(parseMonth(position.start))
  const end = position.end ? format.format(parseMonth(position.end)) : present
  return `${start} — ${end}`
}

export interface DurationUnits {
  readonly year: string
  readonly years: string
  readonly month: string
  readonly months: string
}

/**
 * Elapsed time as `5 years 4 months`. Unit labels arrive already translated,
 * because this module derives and never renders — and Spanish needs both
 * number agreement and its own words.
 */
export const formatDuration = (
  position: Position,
  units: DurationUnits,
  now = new Date(),
): string => {
  const total = monthsBetween(
    parseMonth(position.start),
    position.end ? parseMonth(position.end) : now,
  )
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts: string[] = []
  if (years > 0)
    parts.push(`${years} ${years === 1 ? units.year : units.years}`)
  if (months > 0)
    parts.push(`${months} ${months === 1 ? units.month : units.months}`)
  return parts.join(' ') || `0 ${units.months}`
}
