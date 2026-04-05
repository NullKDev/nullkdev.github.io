import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap'
import icon from 'astro-icon'

import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import expressiveCode from 'astro-expressive-code'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'

import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

import tailwindcss from '@tailwindcss/vite'

import { SITE_URL } from './src/consts'

export default defineConfig({
  site: SITE_URL,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  //base: 'mi-repo',
  // Static output - API routes are handled by Cloudflare Pages Functions in /functions folder
  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme="${theme.name.split('-')[1]}"]`,
      defaultProps: {
        wrap: true,
        collapseStyle: 'collapsible-auto',
        overridesByLang: {
          'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh':
            {
              showLineNumbers: false,
            },
        },
      },
      styleOverrides: {
        codeFontSize: '0.75rem',
        borderColor: 'var(--border)',
        codeFontFamily: 'var(--font-mono)',
        codeBackground: 'color-mix(in oklab, var(--muted) 25%, transparent)',
        frames: {
          editorActiveTabForeground: 'var(--muted-foreground)',
          editorActiveTabBackground:
            'color-mix(in oklab, var(--muted) 25%, transparent)',
          editorActiveTabIndicatorBottomColor: 'transparent',
          editorActiveTabIndicatorTopColor: 'transparent',
          editorTabBorderRadius: '0',
          editorTabBarBackground: 'transparent',
          editorTabBarBorderBottomColor: 'transparent',
          frameBoxShadowCssValue: 'none',
          terminalBackground:
            'color-mix(in oklab, var(--muted) 25%, transparent)',
          terminalTitlebarBackground: 'transparent',
          terminalTitlebarBorderBottomColor: 'transparent',
          terminalTitlebarForeground: 'var(--muted-foreground)',
        },
        lineNumbers: {
          foreground: 'var(--muted-foreground)',
        },
        uiFontFamily: 'var(--font-sans)',
      },
    }),
    mdx(),
    react(),
    sitemap({
      serialize: (item) => {
        const url = item.url
        if (url === `${SITE_URL}/` || url === `${SITE_URL}/en/`) {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 1.0
        } else if (url.includes('/blog/')) {
          item.changefreq = ChangeFreqEnum.WEEKLY
          item.priority = 0.8
        } else if (url.includes('/projects/')) {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 0.7
        } else if (url.includes('/photos/')) {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 0.6
        } else if (url.includes('/tools/')) {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 0.5
        } else if (url.includes('/about/')) {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 0.6
        } else if (url.includes('/blog')) {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 0.7
        } else if (url.includes('/projects')) {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 0.6
        } else if (url.includes('/photos')) {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 0.5
        } else if (url.includes('/tools')) {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 0.4
        } else if (url.includes('/about')) {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 0.5
        } else {
          item.changefreq = ChangeFreqEnum.MONTHLY
          item.priority = 0.5
        }
        return item
      },
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 1234,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow', 'noreferrer', 'noopener'],
        },
      ],
      rehypeHeadingIds,
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: {
            light: 'github-light',
            dark: 'github-dark',
          },
        },
      ],
    ],
    remarkPlugins: [remarkMath, remarkEmoji],
  },
})
