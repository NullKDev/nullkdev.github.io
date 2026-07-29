import type { APIRoute } from 'astro'

/**
 * Generated rather than kept in `public/`, because a static file cannot read
 * `SITE_URL` — it is copied verbatim. That is how the sitemap line ended up
 * pointing at a domain the rest of the build had already stopped using: every
 * canonical, hreflang and sitemap URL followed the configured origin, and this
 * one line silently did not.
 *
 * `Astro.site` is the same value the sitemap integration uses, so the two
 * cannot disagree.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site?.href.replace(/\/+$/, '') ?? ''

  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /protected/',
      '',
      `Sitemap: ${origin}/sitemap-index.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  )
}
