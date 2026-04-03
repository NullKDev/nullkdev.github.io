# Projects Content

## File Location

```
src/content/projects/
└── my-project-slug/
    ├── index.md          ← main project content (required)
    ├── banner.svg        ← optional banner/logo
    └── assets/
        └── screenshot.webp
```

## Frontmatter

```yaml
---
title: "Project Name"
description: "What the project does. Keep under 160 chars."
tags: ["android", "kotlin", "kmm"]
startDate: 2023-01-01       # optional
endDate: 2024-06-01         # optional — omit if ongoing (shows as "Present")
link: "https://github.com/nullkdev/my-project"   # optional
image: ./banner.svg         # optional
contributors: ["me"]        # optional, defaults to ["me"]
lang: en                    # optional, defaults to en
order: 1                    # optional, for subproject ordering
---
```

### Required fields
- `title`
- `description`
- `tags` — at least one tag required (unlike blog where it's optional)

### Optional fields
- `startDate` / `endDate` — ISO date strings. No `endDate` = ongoing project (sorts to top of list)
- `link` — external URL (GitHub, Play Store, etc.)
- `image` — banner image, processed by Astro
- `contributors` — array of author IDs, defaults to `["me"]`
- `lang` — `en` or `es`
- `order` — integer for subproject ordering when dates tie

## Sorting Logic

Projects sort by `endDate` descending. **Projects without `endDate` always appear first** (treated as ongoing). This means active projects naturally bubble to the top without any manual intervention.

## Subprojects

Same nesting pattern as blog subposts. Use a subfolder structure:

```
src/content/projects/
└── my-app/
    ├── index.md          ← parent (overview)
    ├── v1-release.md     ← subproject
    └── v2-release.md     ← subproject
```

Subproject ID = `my-app/v1-release` (contains `/`).

Subprojects sort by `startDate` first, then `order`.

## Translation (ES)

Same convention as blog — create a sibling folder with `.es`:

```
src/content/projects/
├── my-project/
│   └── index.md
└── my-project.es/
    └── index.md          ← translated title, description, and body
```

If no ES version exists, the EN version is shown when the user switches language.

## Key Differences from Blog

| | Blog | Projects |
|---|---|---|
| `tags` | Optional | **Required** |
| Sorting | By `date` desc | By `endDate` desc (ongoing first) |
| Extra fields | — | `startDate`, `endDate`, `link` |
| Navigation label | Newer / Older | Newer / Older |
| Related items | Related posts by tags | — |
