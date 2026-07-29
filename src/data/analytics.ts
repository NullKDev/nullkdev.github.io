/**
 * Analytics configuration.
 *
 * The measurement ID is read from the environment and is empty by default, so
 * a clone of this repository ships no tracking until someone deliberately sets
 * it. Nothing is hardcoded: an ID in source is an ID that follows every fork.
 *
 * `PUBLIC_` is not a suggestion — Vite only exposes prefixed variables to the
 * client, and a measurement ID is public by nature anyway (it travels in every
 * request the tag makes). Do not put anything secret behind this prefix.
 *
 * Two things this deliberately does NOT do:
 *
 * - It does not load on a page the reader has not consented to be measured on,
 *   because there is no consent mechanism here yet. GA4 writes cookies and, in
 *   the EU/UK, that needs consent before the tag fires. Turning this on without
 *   a banner is a legal decision, not a technical one.
 * - It does not widen the CSP on its own. Google's tag is served from
 *   googletagmanager.com and beacons to google-analytics.com; both would have
 *   to be added to `script-src` and `connect-src` in `scripts/apply-csp.ts`.
 *   That is the point at which "no third-party origins" stops being true, so
 *   the change should be made knowingly rather than fall out of a config flag.
 */
const measurementId = import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID ?? ''

/** A GA4 measurement ID looks like `G-XXXXXXXXXX`. */
const isMeasurementId = (value: string): boolean =>
  /^G-[A-Z0-9]{6,}$/.test(value)

export const analytics = {
  googleMeasurementId: isMeasurementId(measurementId) ? measurementId : '',
  get enabled(): boolean {
    return this.googleMeasurementId !== ''
  },
} as const
