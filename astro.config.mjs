import { SITE_URL } from './site.config.mjs'
import mdx from '@astrojs/mdx'
import { unified } from '@astrojs/markdown-remark'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import hastDiagrams from './scripts/hast-diagrams.mjs'
import hastTables from './scripts/hast-tables.mjs'
import {
  createReadStream,
  existsSync,
  readdirSync,
  readFileSync,
} from 'node:fs'
import { join, resolve } from 'node:path'

/**
 * Gallery assets are authored beside their manifest in
 * `src/content/gallery/<collection>/assets/`, and the build copies them to
 * `dist/gallery/<collection>/`. The dev server does not serve `src/`, so this
 * maps the same public path onto the authoring location — without it every
 * gallery image is broken in development only, which is the worst kind of
 * difference between dev and the built site.
 */
const galleryAssets = () => ({
  name: 'gallery-assets-dev',
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      const match = /^\/gallery\/([^/]+)\/([^/?#]+)/.exec(request.url ?? '')
      if (!match) return next()
      const file = resolve(
        'src/content/gallery',
        decodeURIComponent(match[1]),
        'assets',
        decodeURIComponent(match[2]),
      )
      if (!existsSync(file)) return next()
      const types = {
        svg: 'image/svg+xml',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
        avif: 'image/avif',
        gif: 'image/gif',
        mp4: 'video/mp4',
        webm: 'video/webm',
        pdf: 'application/pdf',
        zip: 'application/zip',
      }
      const extension = file.split('.').pop()?.toLowerCase() ?? ''
      response.setHeader(
        'Content-Type',
        types[extension] ?? 'application/octet-stream',
      )
      createReadStream(file).pipe(response)
    })
  },
})

const protectedUrls = new Set()
const generatedRoot = resolve('.generated/protected')
try {
  for (const entry of readdirSync(generatedRoot)) {
    for (const locale of readdirSync(join(generatedRoot, entry))) {
      const manifest = JSON.parse(
        readFileSync(
          join(generatedRoot, entry, locale, 'manifest.json'),
          'utf8',
        ),
      )
      protectedUrls.add(
        `${SITE_URL}${locale === 'es' ? '/es' : ''}/${manifest.domain}/${manifest.slug}/`,
      )
    }
  }
} catch {
  // A normal public build has no generated protected records.
}

const compatibilityPrefixes = ['/blog/', '/projects/', '/tools/', '/photos/']

export default defineConfig({
  output: 'static',
  site: SITE_URL,
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/^\/es(?=\/)/, '')
        return (
          !protectedUrls.has(page) &&
          !pathname.endsWith('/404/') &&
          !compatibilityPrefixes.some((prefix) => pathname.startsWith(prefix))
        )
      },
    }),
  ],
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    /* `.md` and `.mdx` share one unified pipeline, declared here once.

       hastTables wraps every table in its own scroll container and marks
       numeric columns, neither of which markdown table syntax can express.
       hastDiagrams compiles ```mermaid fences to static SVG. See each module.

       Astro 7 defaults `.md` to Sätteri, which renders only `.md`; MDX always
       runs unified. Declaring `processor: unified()` keeps both formats on the
       same renderer, and @astrojs/mdx inherits `processor.options.rehypePlugins`
       when the processor is unified, so one list reaches both. The deprecated
       `markdown.rehypePlugins` did the same thing — Astro coerced it into
       `unified()` at config load — and only added a warning.

       Not `satteri({ hastPlugins })`: MDX would not inherit them, and every
       `.mdx` entry silently lost the treatment (0 wrappers on a page that had
       2). Not `mdx({ rehypePlugins })`: deprecated, and redundant here. */
    processor: unified({ rehypePlugins: [hastTables, hastDiagrams] }),
    // Shiki runs before the plugins above. Excluding mermaid leaves the fence
    // as plain `code.language-mermaid` with its `title` meta for hastDiagrams.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['math', 'mermaid'] },
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
      transformers: [
        {
          // Expose the fence language so the UI can label the code block.
          pre(node) {
            node.properties['data-language'] = this.options.lang
          },
        },
      ],
    },
  },
  vite: {
    plugins: [tailwindcss(), galleryAssets()],
    build: {
      /* Astro inlines a component script under this limit as a bare
         `<script type="module">`, which the CSP sealer cannot tell apart from
         one injected at build time. `false` for `.js` keeps every processed
         script a `/_astro/*.js` file that `script-src 'self'` covers; any
         other asset returns `undefined`, which keeps the default 4 KB rule
         (it is what inlines small stylesheets). See `scripts/apply-csp.ts`. */
      assetsInlineLimit: (filePath) =>
        filePath.endsWith('.js') ? false : undefined,
    },
  },
})
