import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const distDir = join(process.cwd(), 'dist')

describe('Build output', () => {
  it('should have dist directory', () => {
    expect(existsSync(distDir)).toBe(true)
  })

  it('should have index.html', () => {
    expect(existsSync(join(distDir, 'index.html'))).toBe(true)
  })

  it('should have sitemap', () => {
    const files = readdirSync(distDir)
    const hasSitemap = files.some((f) => f.startsWith('sitemap'))
    expect(hasSitemap).toBe(true)
  })

  it('should have RSS feed', () => {
    expect(existsSync(join(distDir, 'rss.xml'))).toBe(true)
  })

  it('should have robots.txt', () => {
    expect(existsSync(join(distDir, 'robots.txt'))).toBe(true)
  })

  it('should have 404 page', () => {
    expect(existsSync(join(distDir, '404.html'))).toBe(true)
  })
})
