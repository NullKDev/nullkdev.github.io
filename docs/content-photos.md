# Photos Content

## File Location

Each album is a folder. Photos go inside `assets/`.

```
src/content/photos/
└── my-album-slug/
    ├── index.md          ← album metadata (required)
    └── assets/           ← all images for this album
        ├── photo-01.webp
        ├── photo-02.jpg
        └── photo-03.png
```

## Frontmatter

```yaml
---
name: "my-album-slug"     # must match the folder name exactly
title: "Album Title"       # optional, shown in the album page header
description: "Short description of the album. Max 160 chars (OG requirement)."
image: ./assets/photo-01.webp    # cover image (required)
date: 2024-08-20           # optional, used for sorting
tags: ["travel", "nature"] # optional
authors: ["me"]            # optional, defaults to ["me"]
model: "iPhone 15 Pro"     # optional, camera/device
preset: "Lightroom Preset Name"  # optional, post-processing preset
lang: en                   # optional, defaults to en
---
```

### Required fields
- `name` — must exactly match the folder slug
- `description` — hard limit of 160 characters (enforced by Zod schema)
- `image` — cover image shown in the gallery listing

### Optional fields
- `title` — display title; if omitted, the album page won't show a header title
- `date` — used to sort albums chronologically (newest first)
- `tags` — shown on the album and filterable
- `model` — camera body or phone model
- `preset` — Lightroom or Capture One preset used

## Image Files

Supported formats: `.jpeg`, `.jpg`, `.png`, `.webp`

Images are loaded via `import.meta.glob` at build time from the `assets/` subfolder. Filenames sort alphabetically — name them accordingly if order matters:

```
assets/
├── 01-wide-shot.webp
├── 02-detail.webp
└── 03-sunset.webp
```

There is no manual ordering field for individual images — use filename prefixes.

## Translation (ES)

Create a sibling folder with `.es`:

```
src/content/photos/
├── my-album/
│   ├── index.md
│   └── assets/
└── my-album.es/
    └── index.md          ← translated title, description (assets are shared)
```

**The `.es` album does not duplicate images** — `getAlbumImages()` strips the locale suffix and always loads from the base album's `assets/` folder.

## Key Differences from Blog/Projects

| | Blog/Projects | Photos |
|---|---|---|
| No subpost nesting | ✗ (has subposts) | ✓ (flat structure) |
| Image gallery | No | Yes — all `assets/` images shown |
| Camera metadata | No | Yes (`model`, `preset`) |
| `description` limit | None | 160 chars (hard limit) |
| `name` field | No | Yes (must match folder) |
