/**
 * The one place the site's origin is decided.
 *
 * It was hardcoded in five: the Astro config twice, the metadata checker twice,
 * and the end-to-end tests. Five copies of a constant is five chances for a
 * domain change to leave one behind, and the one left behind would be a
 * canonical tag or a sitemap entry — exactly the things nobody notices are
 * wrong until search results are.
 *
 * Resolution order:
 *
 *   1. `SITE_URL` from the environment. GitHub Actions passes the repository
 *      variable, so production is configured outside the code.
 *   2. `astro dev` → localhost, so local links and previews stay local.
 *   3. Anything else, including a local `bun run build` → the production
 *      origin. A local build has to produce the same canonicals, sitemap and
 *      hreflang as CI, or the build gates and e2e tests would be checking a
 *      site that never ships.
 *
 * Trailing slashes are stripped: `new URL()` handles either, but the checker
 * compares strings, and `https://host//path` is a real bug report waiting.
 */
const PRODUCTION = 'https://nullkdev.github.io'
const LOCAL = 'http://localhost:4321'

const isDevServer = process.argv.includes('dev')

export const SITE_URL = (
  process.env.SITE_URL ?? (isDevServer ? LOCAL : PRODUCTION)
).replace(/\/+$/, '')
