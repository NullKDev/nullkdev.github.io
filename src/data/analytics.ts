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
 * What turning it on actually does — stated plainly, because an earlier
 * version of this comment promised the opposite:
 *
 * - There is no consent mechanism. When the ID is set, every page loads
 *   Google's tag on idle with Consent Mode defaulting `analytics_storage` to
 *   `granted` (advertising storage, user data and personalisation are
 *   denied). GA4 then sets its first-party cookies without asking. In the
 *   EU/UK that normally needs consent first, so setting the ID is a legal
 *   decision as much as a technical one.
 * - The CSP widens automatically. `scripts/apply-csp.ts` reads the same
 *   variable and, only when it holds a valid ID, adds googletagmanager.com to
 *   `script-src` and the google-analytics.com collection endpoints (regional
 *   ones included) to `connect-src` and `img-src`. Without the ID, no Google
 *   origin appears in the policy.
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
