import type { Locale } from '@/i18n'

export const uses = {
  en: {
    locale: 'en',
    translationKey: 'uses',
    intro:
      'Tools and principles used to build and maintain this archive. Personal hardware is intentionally omitted until it can be documented accurately.',
    groups: [
      {
        title: 'Authoring',
        items: [
          'Markdown and MDX for portable source content',
          'Typed Astro collections for editorial contracts',
          'Git for reviewable history and provenance',
        ],
      },
      {
        title: 'Verification',
        items: [
          'Vitest for domain and content invariants',
          'Playwright and axe for browser behavior and accessibility',
          'Prettier, ESLint, and Astro diagnostics before builds',
        ],
      },
      {
        title: 'Operating principles',
        items: [
          'Static by default; hydrate only earned interactions',
          'Evidence before claims; explicit status before implied freshness',
          'Local-first tools with visible privacy and limitations',
        ],
      },
    ],
  },
  es: {
    locale: 'es',
    translationKey: 'uses',
    intro:
      'Herramientas y principios usados para construir y mantener este archivo. El hardware personal queda fuera hasta poder documentarlo con precisión.',
    groups: [
      {
        title: 'Autoría',
        items: [
          'Markdown y MDX como fuentes portables',
          'Colecciones Astro tipadas como contratos editoriales',
          'Git para historia y procedencia revisables',
        ],
      },
      {
        title: 'Verificación',
        items: [
          'Vitest para dominio e invariantes de contenido',
          'Playwright y axe para navegador y accesibilidad',
          'Prettier, ESLint y diagnósticos Astro antes de compilar',
        ],
      },
      {
        title: 'Principios operativos',
        items: [
          'Estático por defecto; hidratar solo interacciones justificadas',
          'Evidencia antes que afirmaciones; estado explícito antes que frescura implícita',
          'Herramientas locales con privacidad y límites visibles',
        ],
      },
    ],
  },
} as const satisfies Record<Locale, object>
