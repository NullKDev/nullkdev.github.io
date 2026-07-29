/**
 * The one place the public name is written.
 *
 * It used to be repeated in fifteen files — page titles, the header and footer
 * marks, the feed, `og:site_name` — so renaming meant a search-and-replace over
 * strings that only *looked* alike.
 *
 * **The name is not the address, and neither is an identifier.** These stay
 * `nullkdev` on purpose and must never be swept up in a rename:
 *
 * - `nullkdev.github.io` — the actual host, in `astro.config.mjs` and `package.json`.
 * - `github.com/nullkdev` and `github.com/NullKDev/*` — real URLs.
 * - `nullkdev:notes-read` (`src/lib/reading-log.ts`) — renaming it discards
 *   every visitor's reading history.
 * - `nullkdev:protected:v*` (`src/lib/protection/crypto.ts`) — bound into the
 *   encryption envelope; renaming it makes already-published protected content
 *   undecryptable.
 * - `nullkdev-theme`, `nullkdev-design-tune` — stored preferences; renaming
 *   silently resets them.
 */
export const brand = {
  /** Shown to readers: titles, the header and footer marks, the feed. */
  name: 'CarlosDev',
  /** Rendered as a self-closing tag by `BrandMark`. */
  mark: '<CarlosDev/>',
} as const

/** `Page — CarlosDev`, the shape every route title takes. */
export const pageTitle = (title: string): string => `${title} — ${brand.name}`
