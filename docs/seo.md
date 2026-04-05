# SEO

## OG Images

Open Graph images are generated at build time via `src/pages/og/[...route].ts`. Each post and project gets a unique OG image using its title and metadata.

The image URL pattern: `/og/blog/my-post.png`

`PostHead.astro` and `ProjectHead.astro` automatically inject the correct `<meta property="og:image">` tag — nothing to configure manually per post.

## Sitemap

Generated automatically by `@astrojs/sitemap` at build time. Configuration is in `astro.config.ts`. The output is `dist/sitemap-index.xml`.

All published (non-draft) pages are included. Draft posts are excluded because they aren't built.

## RSS Feed

`src/pages/rss.xml.ts` generates an RSS feed from all EN blog posts. URL: `/rss.xml`. Referenced in `<Head.astro>` as a `<link rel="alternate">`.

No configuration needed — new posts appear automatically in the feed on next build.

## Structured Data (schema.org)

The site uses JSON-LD structured data on multiple pages:

| Page            | Schema type                             | File                |
| --------------- | --------------------------------------- | ------------------- |
| Home            | `WebSite` + `Person`                    | `index.astro`       |
| About           | `Person` (enhanced)                     | `about.astro`       |
| Blog post       | `Article` or `BlogPosting`              | `PostHead.astro`    |
| Project         | `SoftwareApplication` or `CreativeWork` | `ProjectHead.astro` |
| Tools index     | `CollectionPage` + `ItemList`           | `tools/index.astro` |
| Individual tool | `WebApplication`                        | each tool page      |

### Adding structured data to a new page

Inline a `<script type="application/ld+json">` in the page:

```astro
<script
  type="application/ld+json"
  set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Page Title',
    url: new URL(Astro.url.pathname, Astro.site).href,
  })}
/>
```

### FAQ and HowTo schemas

For posts with Q&A sections or step-by-step tutorials, use the dedicated components:

```mdx
import FAQSchema from '@/components/FAQSchema.astro'
import HowToSchema from '@/components/HowToSchema.astro'

<FAQSchema questions={[{ question: 'What is X?', answer: 'X is ...' }]} />
```

## Meta Tags

`PageHead.astro` handles per-page `<title>` and `<meta name="description">`. Always use it:

```astro
<PageHead
  slot="head"
  title="Page Title"
  description="Page description under 160 chars."
/>
```

`PostHead.astro` extends this for blog posts with additional OG, Twitter Card, and canonical URL tags.

## Canonical URLs

Set automatically by `PostHead.astro` based on `Astro.site` + the current URL. For translated pages (`/es/blog/*`), the canonical points to the EN version to avoid duplicate content penalties.

## Google Analytics

Injected via `Head.astro` using `PUBLIC_GOOGLE_ANALYTICS_ID` from the environment. The GA ID is set in the GitHub Actions workflow — see [deployment.md](./deployment.md).

To disable analytics in local dev: the env var is not set by default, so no tracking happens unless you add it to a `.env` file.
