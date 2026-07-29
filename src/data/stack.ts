import type { Locale } from '@/i18n'

const source = 'https://github.com/NullKDev/nullkdev.github.io'
const keyboard = 'https://github.com/NullKDev/Keyboard-Simple'

export const stack = {
  en: {
    locale: 'en',
    translationKey: 'stack',
    intro: 'Technologies appear here only where the archive contains evidence.',
    technologies: [
      { name: 'Java', evidence: 'Keyboard Simple source', href: keyboard },
      {
        name: 'Kotlin',
        evidence: 'Keyboard Simple and Android notes',
        href: keyboard,
      },
      {
        name: 'Android',
        evidence: 'Work and Notes',
        href: '/work/keyboard-simple/',
      },
      { name: 'Astro 7', evidence: 'Archive runtime', href: source },
      {
        name: 'TypeScript',
        evidence: 'Queries, tools, and tests',
        href: source,
      },
      {
        name: 'React',
        evidence: 'Interactive Lab and protected content',
        href: source,
      },
      {
        name: 'Tailwind CSS',
        evidence: 'Token and utility layer',
        href: source,
      },
      {
        name: 'Markdown / MDX',
        evidence: 'Portable archive content',
        href: source,
      },
      { name: 'Bun', evidence: 'Package and command runtime', href: source },
      {
        name: 'GitHub Actions',
        evidence: 'CI and Pages deployment',
        href: source,
      },
      { name: 'Vitest', evidence: 'Unit and content checks', href: source },
      { name: 'Playwright', evidence: 'Browser and axe checks', href: source },
    ],
  },
  es: {
    locale: 'es',
    translationKey: 'stack',
    intro:
      'Las tecnologías aparecen solo cuando el archivo contiene evidencia.',
    technologies: [
      { name: 'Java', evidence: 'Código de Keyboard Simple', href: keyboard },
      {
        name: 'Kotlin',
        evidence: 'Keyboard Simple y notas Android',
        href: keyboard,
      },
      {
        name: 'Android',
        evidence: 'Trabajo y Notas',
        href: '/es/work/teclado-simple/',
      },
      { name: 'Astro 7', evidence: 'Runtime del archivo', href: source },
      {
        name: 'TypeScript',
        evidence: 'Consultas, herramientas y pruebas',
        href: source,
      },
      {
        name: 'React',
        evidence: 'Lab interactivo y contenido protegido',
        href: source,
      },
      {
        name: 'Tailwind CSS',
        evidence: 'Capa de tokens y utilidades',
        href: source,
      },
      { name: 'Markdown / MDX', evidence: 'Contenido portable', href: source },
      { name: 'Bun', evidence: 'Paquetes y comandos', href: source },
      {
        name: 'GitHub Actions',
        evidence: 'CI y despliegue Pages',
        href: source,
      },
      {
        name: 'Vitest',
        evidence: 'Pruebas unitarias y de contenido',
        href: source,
      },
      {
        name: 'Playwright',
        evidence: 'Pruebas de navegador y axe',
        href: source,
      },
    ],
  },
} as const satisfies Record<Locale, object>
