# Components

All components live in `src/components/`. Import with the `@/` alias:

```astro
import Breadcrumbs from '@/components/Breadcrumbs.astro'
```

---

## Layout & Navigation

### `Header.astro`
Top navigation bar with logo, nav links, search button, theme toggle, and language toggle. Used once in `Layout.astro`.

### `Footer.astro`
Site footer with social links and copyright. Used once in `Layout.astro`.

### `Breadcrumbs.astro`
Shows the current page path. Each page passes its own items.

```astro
<Breadcrumbs
  items={[
    { label: 'Blog', href: '/blog', icon: 'lucide:book-open' },
    { label: 'Post Title', icon: 'lucide:file-text' },
  ]}
/>
```

- Last item has no `href` (current page)
- `icon` is a Lucide icon name

### `ThemeToggle.astro`
Sun/moon button that toggles `data-theme` on `<html>`. Persists to `localStorage`.

### `LanguageToggle.astro`
EN/ES toggle button. On content pages redirects to the translated URL; on static pages applies i18n in place. See [i18n.md](./i18n.md).

---

## Content Display

### `BlogCard.astro`
Card used in blog listing pages. Shows title, description, date, tags, reading time, and cover image.

### `ProjectCard.astro`
Card for project listings. Shows title, description, tags, dates, and external link if set.

### `AuthorCard.astro`
Displays author info (avatar, name, bio, social links). Used in post detail pages.

### `RelatedPosts.astro`
Shows related posts by tag overlap. Used at the bottom of blog post pages.

### `PostNavigation.astro`
Prev/next navigation between posts or subposts. Renders "Newer" / "Older" links.

---

## Table of Contents

### `TOCHeader.astro`
Inline TOC shown above the post content on mobile. Collapsible.

### `TOCSidebar.astro`
Sticky sidebar TOC for blog posts (desktop). Supports multi-section TOC when there are subposts.

### `TOCSidebarProject.astro`
Same as `TOCSidebar` but for projects.

---

## Subposts / Subprojects

### `SubpostsHeader.astro`
Navigation strip shown at the top of blog posts that belong to a series. Lists all parts with links. Injected via `Layout.astro`'s `subposts-navigation` slot.

### `SubpostsSidebar.astro`
Sidebar list of subposts for the current series. Highlights the active subpost.

### `SubprojectsHeader.astro`
Same as `SubpostsHeader` but for project subpages.

### `SubprojectsSidebar.astro`
Same as `SubpostsSidebar` but for projects.

---

## Head / SEO

### `Head.astro`
Base `<head>` with charset, viewport, fonts, favicon, and shared meta. Used inside `Layout.astro`.

### `PageHead.astro`
Page-specific head slot — sets `<title>` and `<meta description>`. Use this on every page:

```astro
<PageHead slot="head" title="Page Title" description="Page description." />
```

### `PostHead.astro`
Extended head for blog posts — adds OG image, article schema, canonical URL.

### `ProjectHead.astro`
Same as `PostHead` but for projects.

### `Favicons.astro`
All favicon link tags. Included in `Head.astro`.

---

## Utility Components

### `Link.astro`
Wrapper around `<a>` that adds `data-internal-link="true"` for same-page navigation prevention, and `target="_blank" rel="noopener"` for external links.

```astro
<Link href="/blog">Blog</Link>
<Link href="https://github.com" external>GitHub</Link>
```

### `LinkButton.astro`
Styled button-like link. Used for CTA buttons.

### `Callout.astro`
Highlighted callout box for notes, warnings, tips in MDX content.

```mdx
<Callout type="warning">This is a warning.</Callout>
```

Types: `info`, `warning`, `danger`, `tip`

### `SocialIcons.astro`
Row of social icon links. Used in footer and author cards.

### `SocialShare.astro`
Share buttons (Twitter/X, LinkedIn, copy link) shown at the bottom of posts.

### `FAQSchema.astro`
Injects FAQ structured data (schema.org). Use in posts that have a Q&A section.

### `HowToSchema.astro`
Injects HowTo structured data. Use in tutorial-style posts.

### `FloatingSidebar.astro`
Currently disabled (`{false && ...}` in Layout). Was a floating navigation sidebar.
