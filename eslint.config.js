import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '.astro/**',
      '.agents/**',
      '.claude/**',
      '.generated/**',
      '.private-content/**',
      'backup/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'patches/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    /* `@/` is the one internal alias. The per-folder prefixes (`@components`,
       `@lib`, …) were retired from tsconfig.json; this keeps them from coming
       back through Vitest, which declares its own aliases. */
    files: [
      'src/**/*.{ts,tsx,astro}',
      'tests/**/*.{ts,tsx}',
      'scripts/**/*.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex:
                '^@(components|ui|layouts|lib|content|styles|i18n|data|assets|hooks)(/|$)',
              message: 'Import internal modules through the `@/` alias.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.tsx'],
    plugins: {
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
    },
  },
)
