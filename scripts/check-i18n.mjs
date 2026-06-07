#!/usr/bin/env node

/**
 * check-i18n.mjs — validates that all data-i18n keys used in .astro/.tsx files
 * exist in both en.ts and es.ts translation files.
 *
 * Usage:
 *   node scripts/check-i18n.mjs          # check all src files
 *   node scripts/check-i18n.mjs --fix    # report unused keys
 *
 * Returns exit code 0 if all keys match, 1 if mismatches found.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

// Load translation keys from en.ts and es.ts
function loadTranslationKeys(filePath) {
  const absolutePath = join(ROOT, filePath)
  if (!existsSync(absolutePath)) {
    console.error(`❌ Translation file not found: ${filePath}`)
    process.exit(1)
  }
  const content = readFileSync(absolutePath, 'utf-8')
  return extractKeys(content)
}

function extractKeys(content) {
  const keys = new Set()
  // Match patterns like: 'key.name': 'value'
  const regex = /['"]((?:[a-z]+\.)+[a-z0-9_]+)['"]:\s*['"]/g
  let match
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1])
  }
  return keys
}

// Extract data-i18n keys from file content
function extractUsedKeys(content) {
  const keys = new Set()

  // data-i18n="key.name"
  const dataI18nRegex = /data-i18n(?:-html|-title|-aria|-placeholder)?="([^"]+)"/g
  let match
  while ((match = dataI18nRegex.exec(content)) !== null) {
    keys.add(match[1])
  }

  // data-i18n='key.name'
  const dataI18nSingleRegex = /data-i18n(?:-html|-title|-aria|-placeholder)?='([^']+)'/g
  while ((match = dataI18nSingleRegex.exec(content)) !== null) {
    keys.add(match[1])
  }

  return keys
}

// Recursively get .astro and .tsx files from src/
function getSourceFiles(dir) {
  const results = []
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      // Skip node_modules and dist
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        results.push(...getSourceFiles(fullPath))
      }
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.astro') || entry.name.endsWith('.tsx'))
    ) {
      results.push(fullPath)
    }
  }
  return results
}

function main() {
  const args = process.argv.slice(2)
  const fixMode = args.includes('--fix')

  console.log('🔍 Checking i18n keys...\n')

  // Load translation keys
  const enKeys = loadTranslationKeys('src/i18n/en.ts')
  const esKeys = loadTranslationKeys('src/i18n/es.ts')

  // Collect all keys used in components
  const srcDir = join(ROOT, 'src')
  const files = getSourceFiles(srcDir)
  const usedKeys = new Set()

  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    const fileKeys = extractUsedKeys(content)
    for (const key of fileKeys) {
      usedKeys.add(key)
    }
  }

  let hasErrors = false

  // Check 1: All used keys must exist in both en.ts and es.ts
  const missingInEn = []
  const missingInEs = []

  for (const key of usedKeys) {
    if (!enKeys.has(key)) missingInEn.push(key)
    if (!esKeys.has(key)) missingInEs.push(key)
  }

  if (missingInEn.length > 0) {
    hasErrors = true
    console.error(
      `❌ Keys used in components but missing from en.ts:\n  ${missingInEn.join('\n  ')}\n`,
    )
  }

  if (missingInEs.length > 0) {
    hasErrors = true
    console.error(
      `❌ Keys used in components but missing from es.ts:\n  ${missingInEs.join('\n  ')}\n`,
    )
  }

  // Check 2: en.ts and es.ts should have the same keys (for parity)
  const enOnly = []
  const esOnly = []

  for (const key of enKeys) {
    if (!esKeys.has(key)) enOnly.push(key)
  }
  for (const key of esKeys) {
    if (!enKeys.has(key)) esOnly.push(key)
  }

  if (enOnly.length > 0) {
    hasErrors = true
    console.error(
      `❌ Keys in en.ts but missing from es.ts:\n  ${enOnly.join('\n  ')}\n`,
    )
  }

  if (esOnly.length > 0) {
    hasErrors = true
    console.error(
      `❌ Keys in es.ts but missing from en.ts:\n  ${esOnly.join('\n  ')}\n`,
    )
  }

  // Summary
  const totalKeys = enKeys.size
  if (!hasErrors) {
    console.log(
      `✅ All ${totalKeys} i18n keys verified — zero gaps across ${files.length} files.\n`,
    )
  } else {
    console.error(
      `❌ ${missingInEn.length + missingInEs.length + enOnly.length + esOnly.length} issue(s) found across ${totalKeys} keys.\n`,
    )
  }

  process.exit(hasErrors ? 1 : 0)
}

main()
