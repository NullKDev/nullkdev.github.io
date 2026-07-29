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
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
})
