import { describe, expect, it } from 'vitest'

import {
  extractPrivateTextMarkers,
  parsePrivateMarkdown,
  safeAssetPath,
  sanitizeRenderedHtml,
} from '@/lib/protection/build'

describe('private content build boundary', () => {
  it('parses the admitted public identifiers and trusted Markdown body', () => {
    const source = `---
entryId: demo-foundation
locale: en
keyId: demo-foundation
domain: work
slug: protected-foundation
---
# Private heading
`

    expect(parsePrivateMarkdown(source)).toEqual({
      metadata: {
        entryId: 'demo-foundation',
        locale: 'en',
        keyId: 'demo-foundation',
        domain: 'work',
        slug: 'protected-foundation',
      },
      markdown: '# Private heading\n',
    })
  })

  it.each(['password', 'passwordHash', 'salt', 'secret', 'encryptionKey'])(
    'rejects forbidden frontmatter field %s',
    (field) => {
      expect(() =>
        parsePrivateMarkdown(
          `---\nentryId: demo\nlocale: en\nkeyId: demo\ndomain: work\nslug: demo\n${field}: nope\n---\nbody`,
        ),
      ).toThrow('Forbidden private-content frontmatter field')
    },
  )

  it('rejects malformed frontmatter and path traversal', () => {
    expect(() => parsePrivateMarkdown('body without frontmatter')).toThrow(
      'frontmatter',
    )
    expect(() => safeAssetPath('../secret.txt')).toThrow(
      'Unsafe private asset path',
    )
    expect(safeAssetPath('assets/diagram.png')).toBe('assets/diagram.png')
  })

  it('sanitizes rendered Markdown with a strict content allowlist', () => {
    const rendered = sanitizeRenderedHtml(`
      <h2 onclick="alert(1)">Field note</h2>
      <script>alert(1)</script>
      <p style="position:fixed">Safe <strong>content</strong>.</p>
      <a href="javascript:alert(1)" target="_blank">unsafe</a>
      <a href="//evil.example/path">protocol relative</a>
      <a href="https://example.com/path">safe link</a>
      <img src="protected-asset:asset-1" data-protected-asset="asset-1" onerror="alert(1)">
      <iframe src="https://evil.example"></iframe>
    `)

    expect(rendered).toContain('<h2>Field note</h2>')
    expect(rendered).toContain('<strong>content</strong>')
    expect(rendered).toContain('href="https://example.com/path"')
    expect(rendered).toContain('data-protected-asset="asset-1"')
    expect(rendered).not.toMatch(/script|onclick|onerror|style=|iframe/i)
    expect(rendered).not.toContain('javascript:')
    expect(rendered).not.toContain('href="//evil.example/path"')
    expect(rendered).not.toContain('src="protected-asset:')
  })

  it('extracts meaningful plaintext markers for production leak scanning', () => {
    expect(
      extractPrivateTextMarkers(
        '# Private field note\n\nA distinctive confidential sentence lives here.\n\n![Diagram](./assets/private.svg)',
      ),
    ).toEqual([
      'Private field note',
      'A distinctive confidential sentence lives here.',
    ])
  })
})
