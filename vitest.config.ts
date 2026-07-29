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
      /* Tiered, and set just under the numbers the suite actually reaches.
         A threshold above reality is not a standard, it is a permanently red
         check that everyone learns to scroll past; one far below reality
         cannot catch anything. These sit close enough underneath that a real
         regression fails, and low enough that a normal change — a post in two
         languages — never has to argue with them.

         Where a bug is expensive the bar is higher and can only go up. The
         protection module derives keys and encrypts payloads that are then
         served from a public host: a silent regression there is not a coverage
         statistic, it is readable private content. The content module
         validates the schemas every page is projected from.

         src/lib/notes.ts is still uncovered. It is a thin read over
         `getCollection`, like src/lib/content.ts which is already excluded —
         left in the numbers rather than excluded, so the gap stays visible. */
      thresholds: {
        statements: 84,
        branches: 76,
        functions: 79,
        lines: 85,

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
