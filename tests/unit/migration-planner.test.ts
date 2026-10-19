import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { marked } from 'marked'
import { createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import MigrationPlanner from '@/components/lab/MigrationPlanner'
import {
  COPY_FEEDBACK_MS,
  CopyButton,
} from '@/components/lab/planner/CopyButton'
import { getDictionary } from '@/i18n'

import {
  buildPlannerModel,
  fill,
  getDefaultRange,
  getPlanRange,
  normalizeRange,
  parseInline,
  parsePlannerVersion,
  parseRangeQuery,
  planFromTarget,
  planToMarkdown,
  PROGRESS_KEY,
  readProgress,
  rowMatches,
  splitStep,
  stepKey,
  toPlainText,
  writeProgress,
  type PlannerSource,
  type PlannerVersion,
} from '@/lib/migration-planner'

const fixture = readFileSync(
  resolve('tests/fixtures/migration-planner/android-99.md'),
  'utf8',
).replace(/^---\n[\s\S]*?\n---\n/, '')

/** What `getPlannerSources` does to a note body. */
const lex = (markdown: string) => marked.lexer(markdown)

/* What Astro hands over in `entry.rendered.metadata.headings`: every heading,
   in order, already slugged by the markdown pipeline. */
const fixtureHeadings = [
  { depth: 2, slug: 'at-a-glance', text: 'At a glance' },
  { depth: 3, slug: 'android-99w-api-100', text: 'Android 99W, API 100' },
  { depth: 2, slug: 'permissions', text: 'Permissions' },
  {
    depth: 2,
    slug: 'what-changed-for-your-app',
    text: 'What changed for your app',
  },
  { depth: 3, slug: 'all-apps-on-android-99', text: 'All apps on Android 99' },
  { depth: 3, slug: 'apps-targeting-api-99', text: 'Apps targeting API 99' },
  {
    depth: 3,
    slug: 'what-changed-for-low-ram-fixtures',
    text: 'What changed for low-RAM fixtures',
  },
  { depth: 2, slug: 'migrating-to-api-99', text: 'Migrating to API 99' },
  { depth: 2, slug: 'what-lasted', text: 'What lasted' },
]

const source = (overrides: Partial<PlannerSource> = {}): PlannerSource => ({
  slug: 'android-99',
  locale: 'en',
  title: 'Android 99: a fixture',
  href: '/notes/android-99/',
  tokens: lex(fixture),
  headings: fixtureHeadings,
  ...overrides,
})

const minimal = (api: number, extra = ''): string => `
## At a glance

|           |              |
| --------- | ------------ |
| Version   | Android ${api} |
| API level | ${api}       |

## Permissions

Nothing changed here.

## What changed for your app

### Apps targeting API ${api}

None. Nothing is gated on the target.

## Migrating to API ${api}

1. One.
2. Two.
3. Three.
${extra}`

const minimalHeadings = (api: number) => [
  { depth: 2, slug: 'at-a-glance', text: 'At a glance' },
  { depth: 2, slug: 'permissions', text: 'Permissions' },
  {
    depth: 2,
    slug: 'what-changed-for-your-app',
    text: 'What changed for your app',
  },
  {
    depth: 3,
    slug: `apps-targeting-api-${api}`,
    text: `Apps targeting API ${api}`,
  },
  {
    depth: 2,
    slug: `migrating-to-api-${api}`,
    text: `Migrating to API ${api}`,
  },
]

const minimalSource = (api: number): PlannerSource => ({
  slug: `android-${api}`,
  locale: 'en',
  title: `Android ${api}`,
  href: `/notes/android-${api}/`,
  tokens: lex(minimal(api)),
  headings: minimalHeadings(api),
})

describe('parsePlannerVersion', () => {
  const version = parsePlannerVersion(source())

  it('reads the version, API level and name from the at-a-glance table', () => {
    expect(version.api).toBe(99)
    expect(version.version).toBe('99')
    expect(version.name).toBe('Zabaione')
    expect(version.title).toBe('Android 99: a fixture')
    expect(version.href).toBe('/notes/android-99/')
  })

  it('reads the permissions table as typed rows, keeping inline markdown', () => {
    expect(version.permissions).toEqual([
      {
        permission: '`POST_FIXTURES`',
        changed: 'New runtime permission',
        declare: '`<uses-permission android:name="x" />`',
        remove: '`android:maxSdkVersion="98"`',
      },
      {
        permission: '`READ_FIXTURES`',
        changed: 'Has no effect',
        declare: 'Keep it for older versions',
        remove: 'Nothing',
      },
    ])
    expect(version.permissionsNote).toBe('Android 99 changed one permission:')
  })

  it('splits all-apps and targeting rows and ignores any other h3', () => {
    expect(version.allApps).toEqual([
      {
        change: 'Pipes | in a cell survive',
        action: 'See [Permissions](/notes/android-99/#permissions)',
        check: '',
      },
    ])
    expect(version.targeting.map((row) => row.change)).toEqual([
      'Components must be strict',
      'Alarms are fussier',
    ])
    expect(version.targeting[0].check).toBe('Lint `ExportedFixture`')
    expect(
      [...version.allApps, ...version.targeting].map((row) => row.change),
    ).not.toContain('Ignored entirely')
  })

  it('reads the migration checklist, joining wrapped lines', () => {
    expect(version.checklist?.intro).toBe(
      'From `targetSdk 98` to 99, in this order:',
    )
    expect(version.checklist?.steps).toEqual([
      '**Update the toolchain.** Set `compileSdk 99`. Skipped, nothing compiles. Verify: the project builds.',
      '**Mark components.** Add `android:exported`. Verify: lint `ExportedFixture`.',
      '**Test** on a device, see the [Android 98 note](/notes/android-98/).',
    ])
    expect(version.checklist?.outro).toEqual([
      "Skipping several levels at once: do each version's steps in order.",
    ])
  })

  it('takes every anchor from the headings the site rendered', () => {
    expect(version.anchors).toEqual({
      permissions: 'permissions',
      allApps: 'all-apps-on-android-99',
      targeting: 'apps-targeting-api-99',
      migrating: 'migrating-to-api-99',
    })
  })

  it('keeps an explicit reason when no change is gated on the target', () => {
    const empty = parsePlannerVersion(minimalSource(22))
    expect(empty.targeting).toEqual([])
    expect(empty.targetingNote).toBe('None. Nothing is gated on the target.')
    expect(empty.permissions).toEqual([])
    expect(empty.permissionsNote).toBe('Nothing changed here.')
    expect(empty.allApps).toEqual([])
    expect(empty.anchors.allApps).toBeUndefined()
  })

  it('reads Spanish headings and tables', () => {
    const spanish = parsePlannerVersion({
      slug: 'android-99',
      locale: 'es',
      title: 'Android 99',
      href: '/es/notes/android-99/',
      tokens: lex(`
## De un vistazo

|               |            |
| ------------- | ---------- |
| Versión       | Android 12L |
| Nivel de API  | 32         |

## Permisos

| Permiso | Qué cambió en API 32 | Qué declarar | Qué quitar o limitar |
| ------- | -------------------- | ------------ | -------------------- |
| \`X\`   | Nuevo                | Nada         | Nada                 |

## Qué cambió para tu app

### Todas las apps en Android 12L

| Cambio | Qué hacer | Cómo comprobarlo |
| ------ | --------- | ---------------- |
| Uno    | Dos       | Tres             |

### Apps que apuntan a API 32

| Cambio | Qué hacer | Cómo comprobarlo |
| ------ | --------- | ---------------- |
| A      | B         | C                |

## Migrar a API 32

De \`targetSdk 31\` a 32:

1. Uno.
2. Dos.
3. Tres.
`),
      headings: [
        { depth: 2, slug: 'de-un-vistazo', text: 'De un vistazo' },
        { depth: 2, slug: 'permisos', text: 'Permisos' },
        {
          depth: 2,
          slug: 'qué-cambió-para-tu-app',
          text: 'Qué cambió para tu app',
        },
        {
          depth: 3,
          slug: 'todas-las-apps-en-android-12l',
          text: 'Todas las apps en Android 12L',
        },
        {
          depth: 3,
          slug: 'apps-que-apuntan-a-api-32',
          text: 'Apps que apuntan a API 32',
        },
        { depth: 2, slug: 'migrar-a-api-32', text: 'Migrar a API 32' },
      ],
    })
    expect(spanish.api).toBe(32)
    expect(spanish.version).toBe('12L')
    expect(spanish.permissions).toHaveLength(1)
    expect(spanish.allApps).toEqual([
      { change: 'Uno', action: 'Dos', check: 'Tres' },
    ])
    expect(spanish.targeting).toEqual([
      { change: 'A', action: 'B', check: 'C' },
    ])
    expect(spanish.checklist?.steps).toHaveLength(3)
    expect(spanish.anchors.migrating).toBe('migrar-a-api-32')
    expect(spanish.anchors.targeting).toBe('apps-que-apuntan-a-api-32')
  })

  it('fails loudly when a note has no API level', () => {
    expect(() =>
      parsePlannerVersion(
        source({ tokens: lex('## At a glance\n\nNothing.') }),
      ),
    ).toThrow(/android-99.*API level/)
  })

  it('fails loudly when a section exists but the site rendered no heading for it', () => {
    expect(() =>
      parsePlannerVersion(
        source({
          headings: fixtureHeadings.filter(
            ({ slug }) => slug !== 'migrating-to-api-99',
          ),
        }),
      ),
    ).toThrow(/android-99.*Migrating to API 99/)
  })
})

describe('buildPlannerModel and ranges', () => {
  const model = buildPlannerModel(
    [33, 31, 32, 34, 35].map((api) => minimalSource(api)),
  )

  it('sorts versions by API level', () => {
    expect(model.map(({ api }) => api)).toEqual([31, 32, 33, 34, 35])
  })

  it('rejects two notes for one API level', () => {
    expect(() =>
      buildPlannerModel([minimalSource(33), minimalSource(33)]),
    ).toThrow(/API 33/)
  })

  it('returns every level crossed, oldest first, excluding the start', () => {
    expect(getPlanRange(model, 31, 34).map(({ api }) => api)).toEqual([
      32, 33, 34,
    ])
    expect(getPlanRange(model, 34, 34)).toEqual([])
    expect(getPlanRange(model, 35, 31)).toEqual([])
  })

  it('defaults to the last three migrations of the newest documented level', () => {
    expect(getDefaultRange(model)).toEqual({ from: 32, to: 35 })
    expect(getDefaultRange(model.slice(0, 2))).toEqual({ from: 31, to: 32 })
  })
})

describe('splitStep', () => {
  it('separates the bold lead, the body and the verification', () => {
    expect(
      splitStep(
        '**Update the toolchain.** Set `compileSdk 99`. Verify: the project builds.',
      ),
    ).toEqual({
      lead: 'Update the toolchain.',
      body: 'Set `compileSdk 99`.',
      verify: 'the project builds.',
    })
    expect(splitStep('**Lead.** Body. Comprueba: lint `X`.')).toEqual({
      lead: 'Lead.',
      body: 'Body.',
      verify: 'lint `X`.',
    })
  })

  it('leaves a plain step whole', () => {
    expect(splitStep('Just do it.')).toEqual({ body: 'Just do it.' })
  })
})

describe('parseInline', () => {
  it('turns code, bold and links into nodes and keeps everything else as text', () => {
    expect(
      parseInline(
        'Use **bold** and `a <b>` with [a link](/notes/x/) <script>x</script>',
      ),
    ).toEqual([
      { type: 'text', value: 'Use ' },
      { type: 'strong', value: 'bold' },
      { type: 'text', value: ' and ' },
      { type: 'code', value: 'a <b>' },
      { type: 'text', value: ' with ' },
      { type: 'link', value: 'a link', href: '/notes/x/' },
      { type: 'text', value: ' <script>x</script>' },
    ])
  })

  it('drops a link whose target is not the site or https', () => {
    expect(parseInline('[bad](javascript:alert(1))')).toEqual([
      { type: 'text', value: 'bad' },
    ])
    expect(parseInline('[ok](https://developer.android.com/x)')).toEqual([
      {
        type: 'link',
        value: 'ok',
        href: 'https://developer.android.com/x',
      },
    ])
  })

  it('reads backslash escapes literally', () => {
    expect(parseInline('a \\* b')).toEqual([{ type: 'text', value: 'a * b' }])
  })

  it('strips the markup for plain text', () => {
    expect(toPlainText('Set **this** `code` [here](/x/)')).toBe(
      'Set this code here',
    )
  })
})

describe('rowMatches', () => {
  const row = { change: 'Set `android:exported`', action: 'Do it', check: '' }

  it('matches every word of the query, case-insensitively, without markup', () => {
    expect(rowMatches(row, '')).toBe(true)
    expect(rowMatches(row, 'EXPORTED do')).toBe(true)
    expect(rowMatches(row, 'exported alarm')).toBe(false)
  })
})

describe('planToMarkdown', () => {
  const model: PlannerVersion[] = buildPlannerModel([
    minimalSource(32),
    minimalSource(33),
  ])

  it('writes one section per level with checkbox state and the note link', () => {
    const markdown = planToMarkdown({
      steps: getPlanRange(model, 31, 33),
      from: 31,
      to: 33,
      done: new Set([
        stepKey(32, model[0].checklist?.steps[0] ?? ''),
        stepKey(33, model[1].checklist?.steps[2] ?? ''),
      ]),
      origin: 'https://example.test',
      strings: {
        title: 'Migration plan',
        range: 'From API {from} to API {to}',
        targeting: 'Apps targeting this level',
        readNote: 'Read the Android {version} note',
        disclaimer: 'Run lint.',
      },
    })
    expect(markdown).toContain('# Migration plan')
    expect(markdown).toContain('From API 31 to API 33')
    expect(markdown).toContain('## Android 32 · API 32')
    expect(markdown).toContain('- [x] One.')
    expect(markdown).toContain('- [ ] Two.')
    expect(markdown).toContain('- [x] Three.')
    expect(markdown).toContain(
      '[Read the Android 33 note](https://example.test/notes/android-33/#migrating-to-api-33)',
    )
    expect(markdown).toContain('None. Nothing is gated on the target.')
    expect(markdown.trim().endsWith('Run lint.')).toBe(true)
  })
})

describe('progress storage', () => {
  const memory = () => {
    const values = new Map<string, string>()
    return {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => void values.set(key, value),
    }
  }

  it('keeps each locale apart and survives a round trip', () => {
    const storage = memory()
    expect(writeProgress(storage, 'en', new Set(['33:0', '33:2']))).toBe(true)
    expect(writeProgress(storage, 'es', new Set(['34:1']))).toBe(true)
    expect([...readProgress(storage, 'en')]).toEqual(['33:0', '33:2'])
    expect([...readProgress(storage, 'es')]).toEqual(['34:1'])
  })

  it('reads nothing from a missing, blocked or corrupt store', () => {
    expect(readProgress(undefined, 'en').size).toBe(0)
    const throwing = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    }
    expect(readProgress(throwing, 'en').size).toBe(0)
    expect(writeProgress(throwing, 'en', new Set(['1:0']))).toBe(false)
    const corrupt = memory()
    corrupt.setItem(PROGRESS_KEY, '{not json')
    expect(readProgress(corrupt, 'en').size).toBe(0)
    corrupt.setItem(PROGRESS_KEY, JSON.stringify({ en: [1, '33:0', null] }))
    expect([...readProgress(corrupt, 'en')]).toEqual(['33:0'])
  })
})

describe('stepKey', () => {
  it('keys a step by its level and a hash of its own text', () => {
    const key = stepKey(33, '**Update the toolchain.** Bump AGP.')
    expect(key).toMatch(/^33:[0-9a-f]{8}$/)
    expect(stepKey(33, '**Update the toolchain.** Bump AGP.')).toBe(key)
    expect(stepKey(34, '**Update the toolchain.** Bump AGP.')).not.toBe(key)
    expect(stepKey(33, '**Update the toolchain.** Bump AGP 9.')).not.toBe(key)
  })

  it('stores ticks under a new key, so index-keyed ticks are discarded', () => {
    expect(PROGRESS_KEY).toBe('nullkdev:migration-planner:v2')
  })
})

describe('normalizeRange', () => {
  const model = buildPlannerModel([31, 32, 33].map((api) => minimalSource(api)))

  it('leaves a valid range alone', () => {
    expect(normalizeRange(model, { from: 31, to: 33 }, 'from')).toEqual({
      from: 31,
      to: 33,
    })
  })

  it('moves the new target above a current one picked at or past it', () => {
    expect(normalizeRange(model, { from: 32, to: 31 }, 'from')).toEqual({
      from: 32,
      to: 33,
    })
    expect(normalizeRange(model, { from: 32, to: 32 }, 'from')).toEqual({
      from: 32,
      to: 33,
    })
  })

  it('moves the current level below the newest when the newest is picked', () => {
    expect(normalizeRange(model, { from: 33, to: 31 }, 'from')).toEqual({
      from: 32,
      to: 33,
    })
  })

  it('moves the current level below a new target picked at or under it', () => {
    expect(normalizeRange(model, { from: 33, to: 32 }, 'to')).toEqual({
      from: 31,
      to: 32,
    })
    expect(normalizeRange(model, { from: 32, to: 31 }, 'to')).toEqual({
      from: 31,
      to: 32,
    })
  })
})

describe('planFromTarget', () => {
  const model = buildPlannerModel([31, 32, 33].map((api) => minimalSource(api)))

  it('starts at the manifest target and keeps a later new target', () => {
    expect(planFromTarget(model, 31, 33)).toEqual({ from: 31, to: 33 })
  })

  it('moves the new target to the next level when it is not above', () => {
    expect(planFromTarget(model, 32, 31)).toEqual({ from: 32, to: 33 })
    expect(planFromTarget(model, 32, 32)).toEqual({ from: 32, to: 33 })
  })

  it('offers nothing for the newest level or an undocumented one', () => {
    expect(planFromTarget(model, 33, 33)).toBeUndefined()
    expect(planFromTarget(model, 30, 33)).toBeUndefined()
  })
})

describe('parseRangeQuery', () => {
  const model = buildPlannerModel([31, 32, 33].map((api) => minimalSource(api)))

  it('accepts two documented levels from the query string', () => {
    expect(parseRangeQuery('?from=31&to=33', model)).toEqual({
      from: 31,
      to: 33,
    })
  })

  it('corrects a shared range that does not go up, keeping its start', () => {
    expect(parseRangeQuery('?from=32&to=31', model)).toEqual({
      from: 32,
      to: 33,
    })
    expect(parseRangeQuery('?from=33&to=33', model)).toEqual({
      from: 32,
      to: 33,
    })
  })

  it('ignores missing, unknown or non-numeric levels', () => {
    expect(parseRangeQuery('', model)).toBeUndefined()
    expect(parseRangeQuery('?from=30&to=33', model)).toBeUndefined()
    expect(parseRangeQuery('?from=x&to=33', model)).toBeUndefined()
  })
})

describe('fill', () => {
  it('replaces known placeholders and leaves unknown ones visible', () => {
    expect(fill('API {from} to {to} {other}', { from: 31, to: '33' })).toBe(
      'API 31 to 33 {other}',
    )
  })
})

describe('copy feedback', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const clipboard = (writeText: () => Promise<void>) =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

  it('shows the tick for two seconds, then reads as idle again', async () => {
    vi.useFakeTimers()
    clipboard(() => Promise.resolve())
    const onCopied = vi.fn()
    render(createElement(CopyButton, { text: 'adb', label: 'Copy', onCopied }))
    const button = screen.getByRole('button', { name: 'Copy' })
    await act(async () => {
      fireEvent.click(button)
      await Promise.resolve()
    })
    expect(button).toHaveAttribute('data-state', 'done')
    expect(onCopied).toHaveBeenCalledWith(true)
    act(() => vi.advanceTimersByTime(COPY_FEEDBACK_MS - 1))
    expect(button).toHaveAttribute('data-state', 'done')
    act(() => vi.advanceTimersByTime(1))
    expect(button).toHaveAttribute('data-state', 'idle')
  })

  it('clears its timer when it unmounts', async () => {
    vi.useFakeTimers()
    clipboard(() => Promise.resolve())
    const { unmount } = render(
      createElement(CopyButton, { text: 'adb', label: 'Copy' }),
    )
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
      await Promise.resolve()
    })
    expect(vi.getTimerCount()).toBe(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('announces a second copy of the plan again', async () => {
    clipboard(() => Promise.resolve())
    const frames: FrameRequestCallback[] = []
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback)
      return frames.length
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    const model = buildPlannerModel([32, 33].map((api) => minimalSource(api)))
    const strings = getDictionary('en').planner
    render(
      createElement(MigrationPlanner, {
        model,
        defaultRange: { from: 32, to: 33 },
        strings,
        icons: {
          copy: '',
          download: '',
          arrow: '',
          upload: '',
          shield: '',
        },
        locale: 'en',
      }),
    )
    const status = screen.getAllByRole('status')[0]
    const copyPlan = screen.getByRole('button', { name: strings.copyPlan })
    for (let round = 0; round < 2; round += 1) {
      await act(async () => {
        fireEvent.click(copyPlan)
        await Promise.resolve()
      })
      // Emptied first, so the same words are a change the reader hears.
      expect(status).toHaveTextContent(/^$/)
      act(() => frames.splice(0).forEach((frame) => frame(0)))
      expect(status).toHaveTextContent(strings.planCopied)
    }
  })
})
