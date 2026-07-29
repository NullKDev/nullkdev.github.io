import { describe, expect, it } from 'vitest'

import {
  CHANGELOG_TYPES,
  checkSubject,
  checkSubjects,
  TYPES,
} from '../../scripts/check-commit-messages'

const ok = (subject: string) => expect(checkSubject(subject)).toBeNull()
const bad = (subject: string, problem: string) =>
  expect(checkSubject(subject)?.problem).toContain(problem)

describe('accepted subjects', () => {
  it('accepts every allowed type', () => {
    for (const type of TYPES) {
      ok(`${type}: describe the change plainly`)
    }
  })

  it('accepts an optional scope', () => {
    ok('feat(lab): add a subnet calculator')
    ok('fix(notes): stop inline code overflowing at 320px')
  })

  it('accepts a path-like or hyphenated scope', () => {
    ok('security(lib/protection): raise the iteration count')
    ok('ci(release-notes): group commits by type')
    ok('chore(deps): bump astro to 7.1.6')
  })

  it('accepts a breaking-change marker, with or without a scope', () => {
    ok('feat!: drop the legacy blog routes')
    ok('refactor(content)!: rename the work collection')
  })

  it('leaves git- and GitHub-generated subjects alone', () => {
    // Neither is written by hand, and rejecting them would fail every merge.
    ok('Merge pull request #1 from NullKDev/dev')
    ok('Merge branch main into dev')
    ok('Revert "feat: add the thing"')
  })

  it('accepts a subject exactly at the length limit', () => {
    const subject = `feat: ${'a'.repeat(72 - 6)}`
    expect(subject).toHaveLength(72)
    ok(subject)
  })
})

describe('rejected subjects', () => {
  it('rejects the shapes this repository actually used before the convention', () => {
    // Real subjects from the history that predates this check.
    bad('Update .gitignore', 'no type prefix')
    bad('update icons', 'no type prefix')
    bad('protected bug', 'no type prefix')
    bad('add pretext post', 'no type prefix')
  })

  it('rejects a missing description', () => {
    bad('feat:', 'malformed prefix')
    bad('feat: ', 'no description')
    bad('fix(lab): ', 'no description')
  })

  it('rejects a description too short to inform anyone', () => {
    bad('fix: bug', 'too short')
    bad('feat: add it', 'too short')
  })

  it('rejects an unknown or misspelled type', () => {
    bad('feature: add a subnet calculator', 'unknown type')
    bad('doc: update the readme text', 'unknown type')
    bad('hotfix: correct the canonical url', 'unknown type')
  })

  it('rejects an uppercase type', () => {
    bad('Feat: add a subnet calculator', 'malformed prefix')
    bad('FIX: correct the canonical url', 'malformed prefix')
  })

  it('rejects spacing mistakes around the colon', () => {
    bad('feat : add a subnet calculator', 'malformed prefix')
    bad('feat:add a subnet calculator', 'malformed prefix')
    bad('feat:  add a subnet calculator', 'padded description')
    bad('feat: add a subnet calculator ', 'padded description')
  })

  it('rejects a malformed or empty scope', () => {
    bad('feat(): add a subnet calculator', 'empty scope')
    bad('feat(Lab): add a subnet calculator', 'invalid scope')
    bad('feat(my scope): add a subnet calculator', 'invalid scope')
    bad('feat(-lab): add a subnet calculator', 'invalid scope')
  })

  it('rejects prose habits that make a log harder to scan', () => {
    bad('feat: Add a subnet calculator', 'capitalised')
    bad('feat: add a subnet calculator.', 'ends in a period')
  })

  it('rejects a subject one character over the limit', () => {
    const subject = `feat: ${'a'.repeat(72 - 6 + 1)}`
    expect(subject).toHaveLength(73)
    bad(subject, 'too long')
  })

  it('rejects an empty subject', () => {
    bad('', 'empty subject')
    bad('   ', 'empty subject')
  })

  it('reports every offender, not just the first', () => {
    expect(
      checkSubjects([
        'feat: this one is perfectly fine',
        'Update .gitignore',
        'fix: bug',
        'chore(deps): bump astro to 7.1.6',
      ]),
    ).toHaveLength(2)
  })
})

describe('changelog types', () => {
  it('only includes types a reader or another dev would notice', () => {
    expect(CHANGELOG_TYPES).toEqual([
      'feat',
      'fix',
      'perf',
      'refactor',
      'security',
      'build',
    ])
  })

  it('excludes the housekeeping types', () => {
    // A changelog full of `chore` and `style` is a git log with extra steps.
    for (const type of ['docs', 'style', 'test', 'ci', 'chore', 'revert']) {
      expect(CHANGELOG_TYPES).not.toContain(type)
    }
  })

  it('keeps every changelog type inside the allowed set', () => {
    for (const type of CHANGELOG_TYPES) expect(TYPES).toContain(type)
  })
})
