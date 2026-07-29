import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      '@components': new URL('./src/components', import.meta.url).pathname,
      '@ui': new URL('./src/components/ui', import.meta.url).pathname,
      '@layouts': new URL('./src/layouts', import.meta.url).pathname,
      '@lib': new URL('./src/lib', import.meta.url).pathname,
      '@content': new URL('./src/content', import.meta.url).pathname,
      '@styles': new URL('./src/styles', import.meta.url).pathname,
      '@i18n': new URL('./src/i18n', import.meta.url).pathname,
      '@data': new URL('./src/data', import.meta.url).pathname,
      '@assets': new URL('./src/assets', import.meta.url).pathname,
      '@hooks': new URL('./src/hooks', import.meta.url).pathname,
    },
  },
  test: {
    setupFiles: ['./tests/setup.ts'],
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
        },
      },
      {
        extends: true,
        test: {
          name: 'content',
          environment: 'node',
          include: ['tests/content/**/*.{test,spec}.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/lib/**/*.ts', 'src/content/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/lib/content.ts',
        'src/lib/protection/routes.ts',
      ],
      /* Tiered on purpose. A flat 80% was aspirational rather than true — it
         has never passed — and a gate that is always red teaches everyone to
         ignore it, which costs more than having no gate at all.

         This is an archive. Most changes are a post in two languages, and
         holding those to the same bar as executable logic would block writing
         to satisfy a number. So the global floor sits just under where the
         suite actually is: it cannot be met by deleting tests, and a real
         regression still fails, but publishing never does.

         Where a bug is expensive, the bar stays high. The protection module
         derives keys and encrypts payloads that are then published to a public
         host; a silent regression there is not a coverage statistic, it is
         readable private content. The content module validates the schemas
         every page is projected from. Both are pinned near their current
         numbers, so they can only go up. */
      thresholds: {
        statements: 68,
        branches: 63,
        functions: 62,
        lines: 68,

        'src/lib/protection/**': {
          statements: 85,
          branches: 78,
          functions: 88,
          lines: 88,
        },
        'src/content/**': {
          statements: 95,
          branches: 90,
          functions: 95,
          lines: 95,
        },
      },
    },
  },
})
