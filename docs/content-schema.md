# Content Schema Reference

Complete frontmatter reference for all collections. Defined in `src/content.config.ts`.

## Blog

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `title` | string | ✓ | — | Post title |
| `description` | string | ✓ | — | Shown in cards and meta tags |
| `date` | date | ✓ | — | ISO string or `YYYY-MM-DD` |
| `tags` | string[] | — | — | Used for filtering and related posts |
| `authors` | string[] | — | `["me"]` | Author IDs from `src/content/authors/` |
| `draft` | boolean | — | `false` | If `true`, hidden from all listings |
| `lang` | `"en"` \| `"es"` | — | `"en"` | Content language |
| `image` | image | — | — | Relative path, Astro-optimized |
| `order` | number | — | — | Subpost sort order when dates are equal |

## Projects

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `title` | string | ✓ | — | Project name |
| `description` | string | ✓ | — | Short description |
| `tags` | string[] | ✓ | — | At least one required |
| `image` | image | — | — | Relative path, Astro-optimized |
| `link` | string | — | — | External URL (GitHub, demo, store) |
| `startDate` | date | — | — | ISO string |
| `endDate` | date | — | — | ISO string. Omit if ongoing |
| `contributors` | string[] | — | `["me"]` | Author IDs |
| `lang` | `"en"` \| `"es"` | — | `"en"` | Content language |
| `order` | number | — | — | Subproject sort order |

## Photos

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `name` | string | ✓ | — | Must match folder slug exactly |
| `description` | string | ✓ | — | **Max 160 chars** (OG requirement) |
| `image` | image | ✓ | — | Cover image, relative path |
| `title` | string | — | — | Display title |
| `date` | date | — | — | ISO string, used for sorting |
| `tags` | string[] | — | `[]` | Album tags |
| `authors` | string[] | — | `["me"]` | Author IDs |
| `model` | string | — | — | Camera or phone model |
| `preset` | string | — | — | Post-processing preset |
| `lang` | `"en"` \| `"es"` | — | `"en"` | Content language |

## Authors

Defined in `src/content/authors/`. The default author file is `me.md`.

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `name` | string | ✓ | — | Display name |
| `avatar` | string | ✓ | — | URL or path starting with `/` |
| `pronouns` | string | — | — | e.g. `"he/him"` |
| `bio` | string | — | — | Short bio |
| `mail` | string | — | — | Email address |
| `website` | string | — | — | Full URL |
| `twitter` | string | — | — | Full URL |
| `github` | string | — | — | Full URL |
| `linkedin` | string | — | — | Full URL |
| `discord` | string | — | — | Full URL |
| `isRegistered` | boolean | — | `false` | Controls author card display |

## Translation ID Convention

The locale suffix goes on the **root segment** of the folder name:

```
blog/my-post/index.md          → ID: my-post
blog/my-post.es/index.md       → ID: my-post.es

blog/my-series/part-1.md       → ID: my-series/part-1
blog/my-series.es/part-1.md    → ID: my-series.es/part-1
```

Helper functions in `data-utils.ts`:
- `isTranslation(id)` — `true` if root ends in `.es`
- `getBaseSlug(id)` — strips locale suffix
- `getLocaleId(id, 'es')` — adds locale suffix
