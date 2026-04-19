# Plan: Portfolio Improvements

## Objective

Implement 15 improvements across accessibility, SEO, performance, UX, and infrastructure for the NullKDev portfolio site.

## Dependency Graph

```
Step 1 (reduced-motion) ──────────────────────────┐
Step 2 (floating-sidebar) ────────────────────────┤
Step 3 (prefetch + images) ───────────────────────┤
Step 4 (BlogPosting schema) ──────────────────────┤  ← PARALLEL GROUP A
Step 5 (sitemap images) ──────────────────────────┤
Step 6 (toast system + tool feedback) ────────────┤
Step 7 ("En Desarrollo" projects) ────────────────┤
Step 8 (CSP headers) ─────────────────────────────┘

Step 9 (link checker CI) ─────────────────────────┐
Step 10 (test framework) ─────────────────────────┤  ← PARALLEL GROUP B (after A)
Step 11 (re-enable sidebar + docs) ───────────────┘

Step 12 (full regression + build verification) ─── ← SERIAL (after A + B)
```

**Parallelism**: Steps 1–8 can run in parallel (no shared files). Steps 9–11 can run in parallel after 1–8. Step 12 is serial.

---

## Step 1: `prefers-reduced-motion` Support

**Context**: The site has CSS animations (`.animate-fade-up`, `.animate-fade-in`, stagger delays, Framer Motion marquee) but no `prefers-reduced-motion` media query. This is a WCAG 2.2 requirement.

**Files to modify**:

- `src/styles/global.css` — add `@media (prefers-reduced-motion: reduce)` block
- `src/components/react/Skills.tsx` — respect reduced motion in Framer Motion
- `src/components/react/GalleryViewer.tsx` — disable lightbox animations
- `src/components/react/InfiniteScroll.tsx` — disable marquee animation

**Tasks**:

1. Add global CSS rule in `global.css` that disables all CSS animations for `prefers-reduced-motion: reduce`
2. Create a React hook `useReducedMotion()` in `src/lib/utils.ts` that checks `window.matchMedia('(prefers-reduced-motion: reduce)')`
3. Update `Skills.tsx` to use the hook and skip Framer Motion animations
4. Update `GalleryViewer.tsx` to skip lightbox transitions
5. Update `InfiniteScroll.tsx` to render static grid instead of marquee

**Verification**:

- `pnpm build` succeeds
- In browser devtools, toggle `prefers-reduced-motion` in Rendering panel — all animations should stop
- No JS errors in console

**Exit criteria**: All CSS and JS animations respect the user's motion preference.

---

## Step 2: Toast Notification System

**Context**: All 7 tool pages have zero shared feedback mechanism. Copy uses icon-only swap, primary actions have no success confirmation, and error messages are hardcoded in English (no i18n).

**Files to create**:

- `src/components/react/ToastProvider.tsx` — context + provider component
- `src/components/react/Toast.tsx` — toast UI component (success, error, info variants)

**Files to modify**:

- `src/components/react/PasswordTool.tsx`
- `src/components/react/JSONFormatter.tsx`
- `src/components/react/YAMLValidator.tsx`
- `src/components/react/Base64Tool.tsx`
- `src/components/react/SubnetCalculator.tsx`
- `src/components/react/IPDNSLookup.tsx`
- `src/components/react/DockerConverter.tsx`
- `src/i18n/en.ts` — add toast feedback keys
- `src/i18n/es.ts` — mirror all toast keys

**Tasks**:

1. Create `ToastProvider.tsx` with a React context that exposes `toast({ message, type, duration })`
2. Create `Toast.tsx` with three variants: success (green), error (red), info (blue). Use Radix `Toast` from shadcn/ui or custom implementation with auto-dismiss
3. Wrap all tool pages with `ToastProvider` (add to tool page layouts or a shared tool wrapper)
4. Add i18n keys for all feedback strings:
   - `tools.toast.copied` — "Copiado al portapapeles" / "Copied to clipboard"
   - `tools.toast.password_generated` — "Contraseña generada" / "Password generated"
   - `tools.toast.json_valid` / `json_invalid`
   - `tools.toast.yaml_valid` / `yaml_invalid`
   - `tools.toast.encoded` / `decoded`
   - `tools.toast.subnet_calculated`
   - `tools.toast.lookup_success` / `lookup_error`
   - `tools.toast.converted`
   - `tools.toast.no_charset` — error when no charset selected
5. Replace all icon-only copy feedback with `toast({ message: t('tools.toast.copied'), type: 'success' })`
6. Add success toasts for primary actions in each tool
7. Ensure toasts are accessible: `role="status"`, `aria-live="polite"`, keyboard dismissible

**Verification**:

- `pnpm build` succeeds
- Each tool shows a toast on copy, success, and error
- Toasts auto-dismiss after 3 seconds
- Toasts are keyboard accessible (Escape to dismiss)
- Spanish locale shows Spanish toast messages

**Exit criteria**: All 7 tools use the shared toast system with i18n support.

---

## Step 3: "En Desarrollo" Status for Projects

**Context**: Projects have no status field. The only indicator of active work is absence of `endDate`. We need a visible "En Desarrollo" / "In Development" badge.

**Files to modify**:

- `src/content.config.ts` — add `status` field to project schema
- `src/components/ProjectCard.astro` — render status badge
- `src/pages/projects/[...id].astro` — render status badge on detail page
- `src/pages/[locale]/projects/[...id].astro` — same for Spanish
- `src/i18n/en.ts` — add status keys
- `src/i18n/es.ts` — mirror status keys

**Tasks**:

1. Add `status` field to project Zod schema: `status: z.enum(['completed', 'in-development', 'archived']).default('completed')`
2. Add i18n keys:
   - `project.status.completed` — "Completado" / "Completed"
   - `project.status.in-development` — "En Desarrollo" / "In Development"
   - `project.status.archived` — "Archivado" / "Archived"
3. Update `ProjectCard.astro` to render a colored badge:
   - `in-development` → amber/yellow badge with pulse animation
   - `completed` → green badge (optional, can be hidden)
   - `archived` → gray badge
4. Update project detail pages to show status badge near the title/date
5. Default existing projects to `completed` (no `status` field = completed)

**Verification**:

- `pnpm build` succeeds
- Existing projects render without status badge (default completed)
- A test project with `status: in-development` shows the amber badge
- Badge text is in correct language for EN/ES routes

**Exit criteria**: Projects can declare their status and it renders visibly on cards and detail pages.

---

## Step 4: BlogPosting Schema for Projects + Photo Schema

**Context**: Blog posts already have `BlogPosting` schema in `PostHead.astro`. Projects have NO structured data. Photo albums have NO structured data.

**Files to create**:

- `src/components/ProjectSchema.astro` — JSON-LD for `SoftwareApplication` or `CreativeWork`
- `src/components/PhotoAlbumSchema.astro` — JSON-LD for `ImageGallery`

**Files to modify**:

- `src/pages/projects/[...id].astro` — import and render `ProjectSchema`
- `src/pages/[locale]/projects/[...id].astro` — same
- `src/pages/photos/[id].astro` — import and render `PhotoAlbumSchema`
- `src/pages/[locale]/photos/[id].astro` — same

**Tasks**:

1. Create `ProjectSchema.astro` following the same pattern as `FAQSchema.astro`:
   - `@type: "SoftwareApplication"` (or `"CreativeWork"` if not software)
   - `name`, `description`, `dateCreated`, `programmingLanguage` (from tags)
   - `author` (from contributors)
   - `url`, `image` (if available)
2. Create `PhotoAlbumSchema.astro`:
   - `@type: "ImageGallery"`
   - `name`, `description`
   - `associatedMedia` array of `ImageObject` with `contentUrl`, `width`, `height`
3. Import and render in respective detail pages
4. Ensure all URLs are absolute (use `SITE.url` from consts)

**Verification**:

- `pnpm build` succeeds
- Validate with Google Rich Results Test tool (or check JSON-LD manually)
- No duplicate schema on any page

**Exit criteria**: All project and photo album pages emit valid JSON-LD structured data.

---

## Step 5: Image Sitemap + RSS Improvements

**Context**: The sitemap is auto-generated by `@astrojs/sitemap` with no customization. Photo albums are not included in the sitemap with image metadata. RSS feed has no image enclosures.

**Files to modify**:

- `astro.config.ts` — add custom sitemap `serialize` function with image entries
- `src/pages/rss.xml.ts` — add image enclosures and `content:encoded`

**Tasks**:

1. Configure `@astrojs/sitemap` with a custom `serialize` function that:
   - Includes all photo album URLs
   - Adds `<image:image>` entries for each album cover
   - Sets appropriate `<changefreq>` and `<priority>` per content type
2. Update `rss.xml.ts` to include:
   - `content` field with full post/project content (using `content:encoded`)
   - Image enclosure for posts/projects with featured images
   - `<image>` element in channel for the site logo

**Verification**:

- `pnpm build` succeeds
- Inspect `dist/sitemap-index.xml` — photo album URLs present with image entries
- Inspect `dist/rss.xml` — has image enclosures and content

**Exit criteria**: Sitemap includes photo albums with image metadata. RSS feed includes images and full content.

---

## Step 6: Image Optimization (AVIF + `<picture>` + lazy loading)

**Context**: Zero `<picture>` element usage. No AVIF support. GalleryViewer uses native `<img>` without `width`/`height` (CLS risk). Lightbox loads all images eagerly.

**Files to modify**:

- `src/components/react/GalleryViewer.tsx` — add `width`/`height` to `<img>`, use `<picture>` with AVIF
- `src/lib/data-utils.ts` — add `avif` to `getAlbumImages()` glob pattern
- `src/pages/photos/index.astro` — ensure `loading="lazy"` on listing images
- `src/components/BlogCard.astro` — add `format="avif"` to `<Image>`
- `src/components/ProjectCard.astro` — add `format="avif"` to `<Image>`

**Tasks**:

1. Update `getAlbumImages()` glob to include `avif`: `{jpeg,jpg,png,webp,avif}`
2. In `GalleryViewer.tsx` masonry grid:
   - Add `width` and `height` attributes from `ImageAsset` to prevent CLS
   - Replace `<img>` with `<picture>` containing `<source type="image/avif">` and `<source type="image/webp">` fallback
3. In `GalleryViewer.tsx` lightbox:
   - Change `loading="eager"` to `loading="lazy"` for images not currently visible
   - Only load the current + next/prev images eagerly
4. Add `format="avif"` to all Astro `<Image>` components in cards
5. Verify `photos/index.astro` listing images have `loading="lazy"`

**Verification**:

- `pnpm build` succeeds
- Lighthouse shows no CLS from images
- Network tab shows AVIF images being served (when browser supports it)
- Lightbox only loads visible images initially

**Exit criteria**: All images use AVIF when available, have explicit dimensions, and lazy-load appropriately.

---

## Step 7: Route Prefetching

**Context**: No prefetching of critical routes. Users navigate cold to blog, projects, about pages.

**Files to modify**:

- `src/layouts/Layout.astro` — add prefetch hints
- `src/components/Header.astro` — add `prefetch` to nav links
- `src/components/Link.astro` — enable Astro's built-in prefetch

**Tasks**:

1. Add `<link rel="prefetch">` tags in `Head.astro` for homepage → about, blog, projects
2. Update `Link.astro` to use Astro's `prefetch` directive: `<Link prefetch href={...}>`
3. Update nav links in `Header.astro` to use `prefetch="hover"` (prefetch on hover)
4. Add `prefetch="tap"` on blog cards and project cards (prefetch on touch/click start)

**Verification**:

- `pnpm build` succeeds
- Network tab shows prefetch requests on hover
- Navigation feels instant for prefetched pages
- No excessive prefetching (only on hover/tap)

**Exit criteria**: Critical routes are prefetched on hover, cards prefetch on tap.

---

## Step 8: Content-Security-Policy Meta Tag

**Context**: No CSP headers or meta tags. Since this is a static site on GitHub Pages, HTTP headers can't be set server-side. Use `<meta http-equiv>` as the best available option.

**Files to modify**:

- `src/components/Head.astro` — add CSP meta tag

**Tasks**:

1. Add `<meta http-equiv="Content-Security-Policy">` to `Head.astro` with a policy that allows:
   - `'self'` for scripts and styles
   - Google Analytics domains (`www.googletagmanager.com`, `www.google-analytics.com`)
   - `'unsafe-inline'` for styles (needed for Astro/Tailwind)
   - `'unsafe-inline'` for scripts (needed for inline i18n script in Layout)
   - Image sources: `'self'`, `data:`, GA domains
   - Font sources: `'self'`
   - Connect sources: `'self'`, GA domains, IP lookup APIs (`ip-api.com`, `ipapi.co`)
2. Test that all functionality still works (analytics, IP lookup, search, theme toggle, i18n)
3. Document the CSP in `docs/` for future maintenance

**Verification**:

- `pnpm build` succeeds
- No CSP violations in browser console
- Google Analytics still fires
- IP lookup tools still work
- Search still works
- Theme toggle and i18n still work

**Exit criteria**: CSP meta tag is present and no functionality is broken.

---

## Step 9: Link Checker in CI

**Context**: No broken link detection exists. CI only builds and deploys.

**Files to create**:

- `.github/workflows/link-check.yml` — new workflow

**Tasks**:

1. Create a GitHub Actions workflow that:
   - Runs on push to `main` (after deploy) and on PR
   - Uses `lychee` (or `checkly/cli`) to check all links in the built site
   - Excludes external URLs that may be flaky (use retry or exclude list)
   - Fails the workflow on internal broken links
   - Warns on external broken links (non-blocking)
2. Configure to scan `dist/` after build
3. Exclude patterns: `mailto:`, `tel:`, anchor links (`#`)
4. Add `--exclude` for known flaky external domains

**Verification**:

- Workflow runs successfully on `main`
- Intentionally break an internal link → workflow fails
- Restore link → workflow passes

**Exit criteria**: CI workflow detects broken internal links and reports them.

---

## Step 10: Test Framework Setup

**Context**: Zero test infrastructure. AGENTS.md says "No test framework."

**Files to create**:

- `vitest.config.ts`
- `tests/setup.ts`
- `tests/build.test.ts` — basic build verification test
- Update `package.json` — add `test` and `test:watch` scripts

**Tasks**:

1. Install `vitest` and `@vitest/coverage-v8` as dev dependencies
2. Create `vitest.config.ts` with basic config
3. Create `tests/build.test.ts` that:
   - Runs `astro build` programmatically
   - Verifies `dist/` directory exists and contains `index.html`
   - Verifies `dist/sitemap-index.xml` exists
   - Verifies `dist/rss.xml` exists
   - Verifies no 404 pages in expected routes
4. Add scripts to `package.json`:
   - `"test": "vitest run"`
   - `"test:watch": "vitest"`
   - `"test:coverage": "vitest run --coverage"`
5. Update AGENTS.md to document the test setup

**Verification**:

- `pnpm test` runs and passes
- `pnpm test:coverage` shows coverage report
- Tests fail if build output is missing expected files

**Exit criteria**: Vitest is configured, basic build tests pass, scripts work.

---

## Step 11: Re-enable FloatingSidebar + Update Docs

**Context**: `FloatingSidebar` is fully implemented (370 lines) but disabled with `{false && ...}` in `Layout.astro:109`. Docs mention it's disabled.

**Files to modify**:

- `src/layouts/Layout.astro` — line 109
- `docs/components.md` — update documentation
- `src/pages/index.astro` — decide if homepage should show it
- `src/consts.ts` — optionally add a config flag

**Tasks**:

1. Remove `false &&` from `Layout.astro:109`:
   ```astro
   {!hideFloatingSidebar && <FloatingSidebar />}
   ```
2. Optionally add `showFloatingSidebar` to `src/consts.ts` for easy toggling
3. Update `docs/components.md` to reflect that it's now enabled
4. Test on all page types (blog posts with subposts should still hide it via `hideFloatingSidebar` prop)
5. Verify responsive behavior (hidden below 1280px per component CSS)

**Verification**:

- `pnpm build` succeeds
- Sidebar appears on blog listing, projects listing, tools, photos, about
- Sidebar is hidden on blog posts with subposts (existing `hideFloatingSidebar` logic)
- Sidebar is hidden on screens < 1280px
- No layout shifts or overlaps with footer

**Exit criteria**: FloatingSidebar is visible on appropriate pages, hidden where intended.

---

## Step 12: Full Regression + Build Verification

**Context**: After all changes, a full regression ensures nothing is broken.

**Tasks**:

1. Run `pnpm build` — must succeed with zero errors
2. Run `pnpm test` — all tests pass
3. Run `pnpm preview` — manually verify:
   - Homepage renders correctly
   - Blog listing and detail pages work
   - Projects listing and detail pages work
   - All 7 tool pages work with new toast feedback
   - Photo albums load with optimized images
   - Dark mode toggle works
   - Language toggle works (EN/ES)
   - Search dialog works
   - FloatingSidebar appears and behaves correctly
   - Reduced motion preference disables animations
   - CSP doesn't block any functionality
   - Responsive design on mobile viewports
4. Run link checker workflow manually
5. Verify structured data with Google Rich Results Test (sample pages)
6. Run Lighthouse audit — check Performance, Accessibility, Best Practices, SEO scores

**Verification**:

- All automated checks pass
- No console errors
- Lighthouse scores: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95

**Exit criteria**: Site builds, tests pass, manual regression complete, Lighthouse scores meet targets.

---

## Rollback Strategy

Each step is isolated to specific files. If any step causes issues:

- **Steps 1-8**: Revert the specific files changed. No cross-step dependencies within the parallel group.
- **Steps 9-10**: Delete new workflow/test files. No production impact.
- **Step 11**: Re-add `false &&` to Layout.astro:109.
- **Step 12**: No changes — verification only.

## Model Tier Recommendations

- **Steps 2, 4, 6, 8**: Use strongest model (complex UI work, structured data, security)
- **Steps 1, 3, 5, 7, 11**: Default model sufficient
- **Steps 9, 10, 12**: Default model sufficient

## Summary

| Step | Description                    | Files Changed          | Parallel?     |
| ---- | ------------------------------ | ---------------------- | ------------- |
| 1    | `prefers-reduced-motion`       | 4 files                | Yes (Group A) |
| 2    | Toast notification system      | 11 files               | Yes (Group A) |
| 3    | "En Desarrollo" project status | 6 files                | Yes (Group A) |
| 4    | BlogPosting + Photo schema     | 6 files                | Yes (Group A) |
| 5    | Image sitemap + RSS            | 2 files                | Yes (Group A) |
| 6    | AVIF + image optimization      | 5 files                | Yes (Group A) |
| 7    | Route prefetching              | 3 files                | Yes (Group A) |
| 8    | CSP meta tag                   | 1 file                 | Yes (Group A) |
| 9    | Link checker CI                | 1 new file             | Yes (Group B) |
| 10   | Test framework                 | 4 new files            | Yes (Group B) |
| 11   | Re-enable FloatingSidebar      | 2-3 files              | Yes (Group B) |
| 12   | Full regression                | 0 files (verification) | No (serial)   |

**Total**: ~44 files touched/created across 12 steps. 8 parallel in Group A, 3 parallel in Group B, 1 serial verification.
