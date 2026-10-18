import type { Locale } from '@/i18n'

/**
 * How much of a date a surface shows. `medium` is the full day ("Mar 27,
 * 2026"); `month` is the month a card or row needs ("Mar 2026").
 */
export type DateStyle = 'medium' | 'month'

const options: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  medium: { dateStyle: 'medium' },
  month: { month: 'short', year: 'numeric' },
}

/**
 * Every date the archive renders goes through here.
 *
 * Frontmatter dates (`publishedAt: 2026-03-27`) parse as UTC midnight. Formatted
 * in the build machine's zone — GMT-5 here — that instant is still the 26th, so
 * every page showed its date one day early. The record declares a calendar day,
 * not an instant, so it is formatted in UTC: the day written is the day shown.
 */
export const formatDate = (
  date: Date,
  locale: Locale,
  style: DateStyle = 'medium',
): string =>
  new Intl.DateTimeFormat(locale, {
    ...options[style],
    timeZone: 'UTC',
  }).format(date)

/** The declared day as `YYYY-MM-DD`, for `<time datetime>`. */
export const isoDate = (date: Date): string => date.toISOString().slice(0, 10)

/** Two dates on the same declared day. An update that day is not news. */
export const isSameDay = (left: Date | undefined, right: Date | undefined) =>
  Boolean(left && right && isoDate(left) === isoDate(right))
