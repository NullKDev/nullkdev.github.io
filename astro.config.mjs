import { SITE_URL } from './site.config.mjs'
import mdx from '@astrojs/mdx'
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
    /* Wraps every table in its own scroll container and marks numeric columns,
       neither of which markdown table syntax can express. See the module.

       This option is deprecated in Astro 7, and the replacements were both
       measured against it rather than assumed:

       - `processor: satteri({ hastPlugins })` is the native path and silences
         the warning, but Sätteri only renders `.md`. MDX keeps its own unified
         pipeline, so every `.mdx` entry silently lost the treatment — verified
         as 0 wrappers on a page that had 2.
       - `mdx({ rehypePlugins })` is deprecated as well and did not apply.

       Reaching a clean log would mean moving the whole site onto the unified
       processor: a different renderer for 168 pages in exchange for one table
       fix. The deprecated option works on both `.md` and `.mdx` today, so it
       stays until the Sätteri and MDX pipelines converge.

       hastDiagrams compiles ```mermaid fences to static SVG; see the module. */
    rehypePlugins: [hastTables, hastDiagrams],
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
  },
})
