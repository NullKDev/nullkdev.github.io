import { posix } from 'node:path'

import sanitizeHtml from 'sanitize-html'
import { parse } from 'yaml'

export interface PrivateContentMetadata {
  entryId: string
  locale: 'en' | 'es'
  keyId: string
  domain: 'work' | 'lab' | 'notes' | 'gallery'
  slug: string
}

const identifier = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const forbiddenField = /(password|passphrase|secret|salt|key$|(^|_)key($|_))/i

const findForbiddenField = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') return undefined
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenField.test(key) && key !== 'keyId') return key
    const nested = findForbiddenField(child)
    if (nested) return nested
  }
  return undefined
}

export const parsePrivateMarkdown = (
  source: string,
): { metadata: PrivateContentMetadata; markdown: string } => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error('Private Markdown requires YAML frontmatter')

  const value: unknown = parse(match[1])
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Private-content frontmatter must be an object')
  }
  const forbidden = findForbiddenField(value)
  if (forbidden)
    throw new Error(`Forbidden private-content frontmatter field: ${forbidden}`)

  const record = value as Record<string, unknown>
  const allowedFields = new Set([
    'entryId',
    'locale',
    'keyId',
    'domain',
    'slug',
  ])
  const unknownField = Object.keys(record).find(
    (field) => !allowedFields.has(field),
  )
  if (unknownField)
    throw new Error(
      `Unknown private-content frontmatter field: ${unknownField}`,
    )
  if (
    typeof record.entryId !== 'string' ||
    !identifier.test(record.entryId) ||
    (record.locale !== 'en' && record.locale !== 'es') ||
    typeof record.keyId !== 'string' ||
    !identifier.test(record.keyId) ||
    (record.domain !== 'work' &&
      record.domain !== 'lab' &&
      record.domain !== 'notes' &&
      record.domain !== 'gallery') ||
    typeof record.slug !== 'string' ||
    !identifier.test(record.slug)
  ) {
    throw new Error('Invalid private-content frontmatter')
  }

  return {
    metadata: {
      entryId: record.entryId,
      locale: record.locale,
      keyId: record.keyId,
      domain: record.domain,
      slug: record.slug,
    },
    markdown: match[2],
  }
}

export const safeAssetPath = (value: string): string => {
  if (
    value.includes('\\') ||
    value.startsWith('/') ||
    posix.normalize(value) !== value ||
    value.startsWith('../')
  ) {
    throw new Error(`Unsafe private asset path: ${value}`)
  }
  return value
}

export const sanitizeRenderedHtml = (html: string): string =>
  sanitizeHtml(html, {
    allowedTags: [
      'a',
      'blockquote',
      'br',
      'code',
      'del',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hr',
      'img',
      'li',
      'ol',
      'p',
      'pre',
      'strong',
      'table',
      'tbody',
      'td',
      'th',
      'thead',
      'tr',
      'ul',
    ],
    allowedAttributes: {
      a: ['href', 'title'],
      code: ['class'],
      img: ['alt', 'title', 'width', 'height', 'data-protected-asset'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
    },
    allowedClasses: {
      code: [/^language-[a-z0-9-]+$/],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
  })

export const extractPrivateTextMarkers = (markdown: string): string[] =>
  markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('!['))
    .map((line) =>
      line
        .replace(/^#{1,6}\s+/, '')
        .replace(/^(?:[-*>]|\d+\.)\s+/, '')
        .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
        .replace(/[*_`~]/g, '')
        .trim(),
    )
    .filter((line) => line.length >= 12)

export const secretEnvironmentName = (keyId: string) =>
  `PRIVATE_CONTENT_KEY_${keyId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`
