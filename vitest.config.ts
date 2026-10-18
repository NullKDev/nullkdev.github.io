import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      /* Astro's virtual module does not exist outside a build, so Vite
         cannot resolve it and vi.mock never gets a turn. The stub is what
         makes a lib module that reads a collection testable. */
      'astro:content': new URL(
        './tests/stubs/astro-content.ts',
        import.meta.url,
      ).pathname,
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
      exclude: ['src/**/*.d.ts', 'src/lib/protection/routes.ts'],
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

         Nothing shipped is excluded to make an average look better — that is
         how a gate becomes decoration. `src/lib/content.ts` reads collections
         through the `astro:content` stub, and the browser-only modules
         (`diagram-viewer.ts`, `entry-enhancements.ts`) run under jsdom. */
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
