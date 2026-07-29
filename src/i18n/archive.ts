import type { Locale } from '@/i18n'

const labels = {
  domain: {
    work: { en: 'Work', es: 'Trabajo' },
    lab: { en: 'Lab', es: 'Laboratorio' },
    notes: { en: 'Notes', es: 'Notas' },
    gallery: { en: 'Gallery', es: 'Galería' },
  },
  lifecycle: {
    research: { en: 'Research', es: 'Investigación' },
    prototype: { en: 'Prototype', es: 'Prototipo' },
    active: { en: 'Active', es: 'Activo' },
    shipped: { en: 'Shipped', es: 'Publicado' },
    maintained: { en: 'Maintained', es: 'Mantenido' },
    archived: { en: 'Archived', es: 'Archivado' },
    stable: { en: 'Stable', es: 'Estable' },
    current: { en: 'Current', es: 'Actual' },
    superseded: { en: 'Superseded', es: 'Reemplazado' },
    collecting: { en: 'Collecting', es: 'En colección' },
    curated: { en: 'Curated', es: 'Curado' },
  },
  maturity: {
    seed: { en: 'Seed', es: 'Inicial' },
    growing: { en: 'Growing', es: 'En desarrollo' },
    stable: { en: 'Stable', es: 'Estable' },
    archived: { en: 'Archived', es: 'Archivado' },
  },
  provenance: {
    'first-party': { en: 'First-party', es: 'Propia' },
    'third-party': { en: 'Third-party', es: 'Terceros' },
    derived: { en: 'Derived', es: 'Derivada' },
    'self-reported': { en: 'Self-reported', es: 'Declarada por el autor' },
  },
  linkKind: {
    repository: { en: 'Repository', es: 'Repositorio' },
    demo: { en: 'Demo', es: 'Demo' },
    publication: { en: 'Publication', es: 'Publicación' },
    external: { en: 'External', es: 'Externo' },
    release: { en: 'Release', es: 'Versión' },
  },
  galleryKind: {
    album: { en: 'Album', es: 'Álbum' },
    shelf: { en: 'Shelf', es: 'Estante' },
    library: { en: 'Library', es: 'Biblioteca' },
  },
  itemType: {
    image: { en: 'image', es: 'imagen' },
    video: { en: 'video', es: 'video' },
    document: { en: 'file', es: 'archivo' },
    archive: { en: 'archive', es: 'comprimido' },
    link: { en: 'link', es: 'enlace' },
  },
  itemTypePlural: {
    image: { en: 'images', es: 'imágenes' },
    video: { en: 'videos', es: 'videos' },
    document: { en: 'files', es: 'archivos' },
    archive: { en: 'archives', es: 'comprimidos' },
    link: { en: 'links', es: 'enlaces' },
  },
  origin: {
    captured: { en: 'Captured', es: 'Capturada' },
    generated: { en: 'AI generated', es: 'Generada con IA' },
    derived: { en: 'Derived', es: 'Derivada' },
    'third-party': { en: 'Third party', es: 'De terceros' },
  },
  noteKind: {
    article: { en: 'Article', es: 'Artículo' },
    note: { en: 'Note', es: 'Nota' },
    guide: { en: 'Guide', es: 'Manual' },
    paper: { en: 'Paper', es: 'Paper' },
    decision: { en: 'Decision', es: 'Decisión' },
    reference: { en: 'Reference', es: 'Referencia' },
  },
  noteKindPlural: {
    article: { en: 'Articles', es: 'Artículos' },
    note: { en: 'Notes', es: 'Notas' },
    guide: { en: 'Guides', es: 'Manuales' },
    paper: { en: 'Papers', es: 'Papers' },
    decision: { en: 'Decisions', es: 'Decisiones' },
    reference: { en: 'References', es: 'Referencias' },
  },
  level: {
    intro: { en: 'Introductory', es: 'Introductorio' },
    working: { en: 'Working knowledge', es: 'Nivel de trabajo' },
    deep: { en: 'In depth', es: 'En profundidad' },
  },
  execution: {
    none: { en: 'Nothing to run', es: 'Nada que ejecutar' },
    local: { en: 'Runs in your browser', es: 'Corre en tu navegador' },
    'third-party-network': {
      en: 'Sends data to a third party',
      es: 'Envía datos a un tercero',
    },
  },
  capability: {
    webgpu: { en: 'WebGPU', es: 'WebGPU' },
    webgl: { en: 'WebGL', es: 'WebGL' },
    wasm: { en: 'WebAssembly', es: 'WebAssembly' },
    simd: { en: 'SIMD', es: 'SIMD' },
    threads: { en: 'Threads', es: 'Hilos' },
    'shared-array-buffer': {
      en: 'SharedArrayBuffer',
      es: 'SharedArrayBuffer',
    },
    camera: { en: 'Camera access', es: 'Acceso a la cámara' },
    microphone: { en: 'Microphone access', es: 'Acceso al micrófono' },
    clipboard: { en: 'Clipboard access', es: 'Acceso al portapapeles' },
    'file-system': { en: 'File access', es: 'Acceso a archivos' },
    storage: { en: 'Local storage', es: 'Almacenamiento local' },
    network: { en: 'Network access', es: 'Acceso a la red' },
  },
  relationship: {
    implements: { en: 'Implements', es: 'Implementa' },
    documents: { en: 'Documents', es: 'Documenta' },
    supports: { en: 'Supports', es: 'Respalda' },
    extends: { en: 'Extends', es: 'Extiende' },
    related: { en: 'Related', es: 'Relacionado' },
  },
} as const

type Category = keyof typeof labels

export const getArchiveLabel = <CategoryName extends Category>(
  category: CategoryName,
  value: string,
  locale: Locale,
) => {
  const categoryLabels = labels[category] as Record<
    string,
    Record<Locale, string>
  >
  return categoryLabels[value]?.[locale] ?? value
}
