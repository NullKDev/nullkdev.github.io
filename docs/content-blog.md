# Blog Content

## File Location

All blog content lives in `src/content/blog/`. Each entry is a folder named after the post slug.

```
src/content/blog/
└── my-post-slug/
    ├── index.md          ← main post content (required)
    ├── banner.svg        ← optional banner image
    └── assets/           ← images referenced in the post
        └── screenshot.webp
```

## Frontmatter

```yaml
---
title: "Post Title"
description: "Brief description shown in cards and meta tags. Keep under 160 chars."
date: 2024-06-15
tags: ["android", "kotlin"]
authors: ["me"]          # optional, defaults to ["me"]
draft: false             # optional, omit to publish
lang: en                 # optional, defaults to en
image: ./banner.svg      # optional, used for OG and post card
order: 1                 # optional, used to sort subposts
---
```

### Required fields
- `title` — post title
- `description` — shown in cards, OG meta, and search index
- `date` — publication date (ISO format)

### Optional fields
- `tags` — array of strings, shown on cards and filterable via `/tags`
- `authors` — array of author IDs from `src/content/authors/`. Defaults to `["me"]`
- `draft: true` — hides the post from all listings and builds
- `lang` — `en` or `es`, defaults to `en`
- `image` — relative path to image file (Astro processes and optimizes it)
- `order` — integer for explicit ordering of subposts when dates are equal

## Simple Post

Create `src/content/blog/my-post/index.md` and write your content in Markdown or MDX.

## Subposts (Multi-Part Series)

A subpost is a nested file inside a parent folder. The parent acts as the overview/introduction, and subposts are the individual parts.

```
src/content/blog/
└── my-series/
    ├── index.md          ← parent post (overview)
    ├── part-1.md         ← subpost
    ├── part-2.md         ← subpost
    └── assets/
```

**Subpost ID** = `my-series/part-1` (contains `/` — that's how `isSubpost()` detects them).

**Subpost ordering**: subposts sort by `date` first, then `order` field. If all subposts share the same date, use `order: 1`, `order: 2`, etc.

**Navigation**: subposts automatically get prev/next navigation within the series, and a link back to the parent. The TOC sidebar shows headings from all subposts in the series.

## Adding a Translation (ES)

To add a Spanish version of a post, create a sibling folder with `.es` appended to the slug:

```
src/content/blog/
├── my-post/
│   └── index.md          ← EN version
└── my-post.es/
    └── index.md          ← ES version
```

The ES file uses the same frontmatter but with translated `title`, `description`, and body content. Set `lang: es`.

**If no ES version exists**, the site keeps displaying the EN version when the user switches to Spanish — no broken pages.

### Subpost translations

Translate subposts the same way, inside the `.es` parent folder:

```
src/content/blog/
├── my-series/
│   ├── index.md
│   └── part-1.md
└── my-series.es/
    ├── index.md
    └── part-1.md
```

## Images in Posts

Reference images with relative paths from the post folder:

```md
![Screenshot](./assets/screenshot.webp)
```

Astro automatically optimizes images referenced this way (WebP, responsive sizes).

## Authors

Authors listed in `authors` frontmatter must have a matching file in `src/content/authors/`. The default `"me"` author is pre-configured. See [content-schema.md](./content-schema.md) for the authors schema.
