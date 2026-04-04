# Styling

## Stack

- **Tailwind CSS 4** — utility-first, configured via `@theme` in CSS
- **CSS custom properties** — all design tokens live as CSS variables
- **Dark mode** — toggled via `data-theme="dark"` on `<html>` (not via `prefers-color-scheme`)

## Files

| File | Purpose |
|---|---|
| `src/styles/global.css` | Tailwind import, `@theme` tokens, CSS variables, font faces |
| `src/styles/typography.css` | Prose/article typography overrides |

## CSS Variables (Design Tokens)

Defined in `:root` (light) and `[data-theme=dark]` (dark) inside `global.css`.

| Variable | Usage |
|---|---|
| `--background` | Page background |
| `--foreground` | Default text color |
| `--primary` | Brand color — blue `hsl(214 95% 52%)` |
| `--primary-foreground` | Text on primary backgrounds |
| `--secondary` | Secondary surfaces |
| `--muted` | Muted surfaces (e.g. code blocks) |
| `--muted-foreground` | Subdued text |
| `--accent` | Accent color for highlights |
| `--border` | Border color |
| `--ring` | Focus ring color |
| `--destructive` | Error/danger color |

In Tailwind 4, these map to utilities via `@theme inline`:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-muted-foreground: var(--muted-foreground);
  /* etc. */
}
```

So you can use them as: `bg-primary`, `text-muted-foreground`, `border-border`, etc.

## Dark Mode

Dark mode is toggled via the `data-theme` attribute on `<html>`, not via `prefers-color-scheme`. This is intentional — user choice takes precedence.

```css
/* global.css */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

Usage in components:

```html
<div class="bg-background dark:bg-card">...</div>
```

`ThemeToggle.astro` handles the toggle and persists the choice to `localStorage` under the key `theme`.

## Fonts

Self-hosted variable fonts, declared in `global.css`:

| Font | Variable | File |
|---|---|---|
| Geist | `--font-sans` | `public/fonts/GeistVF.woff2` |
| Geist Mono | `--font-mono` | `public/fonts/GeistMonoVF.woff2` |

Both support weights 100–900 via a single variable font file.

## Utility Function: `cn()`

From `src/lib/utils.ts`. Merges class names with Tailwind conflict resolution (wraps `clsx` + `tailwind-merge`):

```ts
import { cn } from '@/lib/utils'

cn('px-4 py-2', isActive && 'bg-primary', className)
```

Always use `cn()` when combining conditional classes or accepting a `class` prop.

## UI Components

`src/components/ui/` contains shadcn/ui-style components (Badge, Card, CardContent, etc.) following the **new-york** style variant. These are primitive building blocks — compose them in page-level components.

```astro
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
```

## Typography

`typography.css` overrides Tailwind's prose plugin for article content. It controls heading sizes, line heights, code block styles, and link decoration inside `.prose` or article containers. Modify here when you need to change how rendered MDX content looks.

## CSS Animations

Defined at the bottom of `global.css`. All animations use `animation-fill-mode: both` so the final state persists.

### Keyframes

| Class | Effect |
|---|---|
| `animate-fade-up` | Fades in while sliding up 16px, duration 500ms ease-out |
| `animate-fade-in` | Simple opacity fade, duration 400ms ease-out |

### Delay utilities

`animation-delay-100` through `animation-delay-500` (100ms steps). Use for staggered entrance animations:

```html
<div class="animate-fade-up animation-delay-200">...</div>
```

### `gradient-text`

Applies a left-to-right gradient to text using `background-clip: text`. Has separate light and dark variants defined in `global.css` to work correctly with both themes.

```html
<span class="gradient-text">Dev</span>
```

Light: primary blue → purple-500. Dark: brighter variant of the same.

### `stat-number`

Used in `HomeStatsBar` for large stat figures. Applies `font-variant-numeric: tabular-nums` for consistent digit widths.

---

## Conventions

- Use Tailwind utilities directly in markup — no custom CSS classes unless truly necessary
- Keep component-specific styles co-located in the `.astro` file's `<style>` block (scoped by default in Astro)
- Never hardcode colors — always use the CSS variable tokens via Tailwind utilities
- Responsive design: mobile-first (`sm:`, `md:`, `lg:`, `xl:` breakpoints)
