export const taxonomy = {
  topics: {
    accessibility: { en: 'Accessibility', es: 'Accesibilidad' },
    android: { en: 'Android', es: 'Android' },
    architecture: { en: 'Architecture', es: 'Arquitectura' },
    compose: { en: 'Compose', es: 'Compose' },
    containers: { en: 'Containers', es: 'Contenedores' },
    dates: { en: 'Dates', es: 'Fechas' },
    'design-patterns': { en: 'Design patterns', es: 'Patrones de diseño' },
    'design-systems': { en: 'Design systems', es: 'Sistemas de diseño' },
    'developer-tools': {
      en: 'Developer tools',
      es: 'Herramientas de desarrollo',
    },
    encoding: { en: 'Encoding', es: 'Codificación' },
    gradle: { en: 'Gradle', es: 'Gradle' },
    java: { en: 'Java', es: 'Java' },
    javascript: { en: 'JavaScript', es: 'JavaScript' },
    json: { en: 'JSON', es: 'JSON' },
    kotlin: { en: 'Kotlin', es: 'Kotlin' },
    libraries: { en: 'Libraries', es: 'Librerías' },
    networking: { en: 'Networking', es: 'Redes' },
    performance: { en: 'Performance', es: 'Rendimiento' },
    'platform-apis': { en: 'Platform APIs', es: 'APIs de plataforma' },
    security: { en: 'Security', es: 'Seguridad' },
    typography: { en: 'Typography', es: 'Tipografía' },
    'visual-language': { en: 'Visual language', es: 'Lenguaje visual' },
    web: { en: 'Web', es: 'Web' },
    yaml: { en: 'YAML', es: 'YAML' },
  },
  domains: {
    web: { en: 'Web', es: 'Web' },
    mobile: { en: 'Mobile', es: 'Móvil' },
    desktop: { en: 'Desktop', es: 'Desktop' },
    iot: { en: 'IoT', es: 'IoT' },
    cloud: { en: 'Cloud', es: 'Cloud' },
    ai: { en: 'AI', es: 'IA' },
  },
  surfaces: {
    'web-ui': { en: 'Web interface', es: 'Interfaz web' },
    'android-library': { en: 'Android library', es: 'Librería Android' },
    api: { en: 'API', es: 'API' },
  },
} as const

export type TopicId = keyof typeof taxonomy.topics

export const getTopicLabel = (topic: string, locale: 'en' | 'es') =>
  taxonomy.topics[topic as TopicId]?.[locale] ??
  topic
    .replaceAll('-', ' ')
    .replace(/^./, (character) => character.toUpperCase())
