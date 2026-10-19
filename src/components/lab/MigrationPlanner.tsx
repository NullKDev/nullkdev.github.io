import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

import type { Dictionary, Locale } from '@/i18n'
import {
  evaluateManifest,
  parseManifest,
  type ManifestError,
  type ManifestFacts,
} from '@/lib/manifest-rules'
import {
  fill,
  getPlanRange,
  normalizeRange,
  parseRangeQuery,
  planToMarkdown,
  rowMatches,
  stepKey,
  versionLabel,
  type PlanRange,
  type PlannerVersion,
} from '@/lib/migration-planner'

import { copyText } from './planner/CopyButton'
import { ManifestPanel } from './planner/ManifestPanel'
import { PlanStep, type Scope } from './planner/PlanStep'
import type { PlannerIcons } from './planner/icons'
import {
  progressSnapshot,
  saveProgress,
  serverProgressSnapshot,
  subscribeProgress,
} from './planner/progress-store'

interface Props {
  model: readonly PlannerVersion[]
  defaultRange: { from: number; to: number }
  strings: Dictionary['planner']
  icons: PlannerIcons
  locale: Locale
}

const noSubscription = () => () => {}

/**
 * The Android targetSdk migration planner: pick where the app targets now and
 * where it is going, then work through each level's checklist from its note.
 *
 * Server-rendered with the default range, so the page reads as a full plan
 * without JavaScript; hydration adds the range picker, ticks, filters, the
 * manifest check and export. Everything runs in this browser.
 */
export default function MigrationPlanner({
  model,
  defaultRange,
  strings,
  icons,
  locale,
}: Props) {
  const id = useId()
  // True only in the browser, after hydration: the server snapshot is false.
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  )
  const search = useSyncExternalStore(
    noSubscription,
    () => window.location.search,
    () => '',
  )
  const done = useSyncExternalStore(
    subscribeProgress,
    () => progressSnapshot(locale),
    serverProgressSnapshot,
  )
  // The reader's own choice wins; before one, a shared `?from=&to=` link,
  // then the default the page was rendered with.
  const [chosen, setChosen] = useState<{ from: number; to: number }>()
  const range = chosen ?? parseRangeQuery(search, model) ?? defaultRange
  const [scope, setScope] = useState<Scope>('targeting')
  const [query, setQuery] = useState('')
  const [manifest, setManifest] = useState<ManifestFacts>()
  const [manifestError, setManifestError] = useState<ManifestError>()
  const [announcement, setAnnouncement] = useState('')
  const frame = useRef<number | undefined>(undefined)
  useEffect(
    () => () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current)
    },
    [],
  )
  // Empty the live region, then fill it on the next frame: the same message
  // twice in a row (a second copy) is still a change a screen reader reads.
  const announce = (message: string) => {
    setAnnouncement('')
    if (frame.current !== undefined) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      frame.current = undefined
      setAnnouncement(message)
    })
  }

  const { from, to } = range
  const valid = to > from
  const steps = useMemo(
    () => (valid ? getPlanRange(model, from, to) : []),
    [model, from, to, valid],
  )
  const totalSteps = steps.reduce(
    (sum, version) => sum + (version.checklist?.steps.length ?? 0),
    0,
  )
  const doneSteps = steps.reduce(
    (sum, version) =>
      sum +
      (version.checklist?.steps.filter((step) =>
        done.has(stepKey(version.api, step)),
      ).length ?? 0),
    0,
  )
  const rows = steps.flatMap((version) => [
    ...version.targeting,
    ...version.permissions,
    ...(scope === 'all' ? version.allApps : []),
  ])
  const matching = query
    ? rows.filter((row) => rowMatches(row, query)).length
    : rows.length
  const results = useMemo(
    () => (manifest ? evaluateManifest(manifest, from, to) : undefined),
    [manifest, from, to],
  )

  const changeRange = (next: PlanRange) => {
    setChosen(next)
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('from', String(next.from))
      url.searchParams.set('to', String(next.to))
      window.history.replaceState(window.history.state, '', url)
    } catch {
      // A sandboxed frame may refuse; the plan still updates.
    }
    if (next.to > next.from) {
      const crossed = getPlanRange(model, next.from, next.to)
      announce(
        fill(strings.planReady, {
          from: next.from,
          to: next.to,
          levels: crossed.length,
          steps: crossed.reduce(
            (sum, version) => sum + (version.checklist?.steps.length ?? 0),
            0,
          ),
        }),
      )
    }
  }

  const toggle = (key: string, checked: boolean) => {
    const next = new Set(done)
    if (checked) next.add(key)
    else next.delete(key)
    saveProgress(locale, next)
  }

  const markdown = () =>
    planToMarkdown({
      steps,
      from,
      to,
      done,
      origin: window.location.origin,
      strings: {
        title: strings.markdownTitle,
        range: strings.markdownRange,
        targeting: strings.markdownTargeting,
        readNote: strings.readNote,
        disclaimer: strings.disclaimer,
      },
    })

  const copyPlan = async () => {
    const ok = await copyText(markdown())
    announce(ok ? strings.planCopied : strings.copyFailed)
  }

  const downloadPlan = () => {
    const url = URL.createObjectURL(
      new Blob([markdown()], { type: 'text/markdown;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = fill(strings.fileName, { from, to })
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    announce(strings.planDownloaded)
  }

  const analyze = (xml: string) => {
    const parsed = parseManifest(xml)
    if (!parsed.ok) {
      setManifest(undefined)
      setManifestError(parsed.error)
      return
    }
    setManifestError(undefined)
    setManifest(parsed.manifest)
    const found = evaluateManifest(parsed.manifest, from, to)
    announce(
      `${strings.manifest.results}: ${fill(strings.manifest.summary, {
        detected: found.filter(({ status }) => status === 'detected').length,
        check: found.filter(({ status }) => status === 'check').length,
        na: found.filter(({ status }) => status === 'not-applicable').length,
      })}`,
    )
  }

  const announceCopy = (ok: boolean) =>
    announce(ok ? strings.copied : strings.copyFailed)

  const options = model.map((version) => (
    <option key={version.api} value={version.api}>
      {versionLabel(version)}
    </option>
  ))

  return (
    <div className="planner" data-hydrated={hydrated ? 'true' : 'false'}>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <p className="lab-noscript lab-nojs-fallback">
        {fill(strings.noScript, { from, to })}
      </p>

      <fieldset className="planner-range">
        <legend>{strings.rangeLegend}</legend>
        <div className="planner-range__pick">
          <label htmlFor={`${id}-from`}>{strings.from}</label>
          <select
            id={`${id}-from`}
            value={from}
            disabled={!hydrated}
            onChange={(event) =>
              changeRange(
                normalizeRange(
                  model,
                  { from: Number(event.target.value), to },
                  'from',
                ),
              )
            }
          >
            {options}
          </select>
        </div>
        <div className="planner-range__pick">
          <label htmlFor={`${id}-to`}>{strings.to}</label>
          <select
            id={`${id}-to`}
            value={to}
            disabled={!hydrated}
            onChange={(event) =>
              changeRange(
                normalizeRange(
                  model,
                  { from, to: Number(event.target.value) },
                  'to',
                ),
              )
            }
          >
            {options}
          </select>
        </div>
        <dl className="planner-stats">
          <div>
            <dt>{strings.levels}</dt>
            <dd>{steps.length}</dd>
          </div>
          <div>
            <dt>{strings.steps}</dt>
            <dd>{totalSteps}</dd>
          </div>
          <div>
            <dt>{strings.done}</dt>
            <dd>{doneSteps}</dd>
          </div>
        </dl>
      </fieldset>

      <div className="planner-toolbar">
        <fieldset className="planner-scope">
          <legend>{strings.scopeLegend}</legend>
          <div className="planner-segmented">
            {(['targeting', 'all'] as const).map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name={`${id}-scope`}
                  value={value}
                  checked={scope === value}
                  disabled={!hydrated}
                  onChange={() => setScope(value)}
                />
                {value === 'targeting'
                  ? strings.scopeTargeting
                  : strings.scopeAll}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="planner-filter">
          <label htmlFor={`${id}-filter`}>{strings.filter}</label>
          <input
            id={`${id}-filter`}
            type="search"
            value={query}
            placeholder={strings.filterPlaceholder}
            disabled={!hydrated}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <p className="planner-filter__count">
              {fill(strings.filterCount, {
                shown: matching,
                total: rows.length,
              })}
            </p>
          )}
        </div>
        <div
          className="planner-export"
          role="group"
          aria-label={strings.export}
        >
          <button
            type="button"
            className="planner-button"
            disabled={!hydrated || !valid}
            onClick={copyPlan}
          >
            <span
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: icons.copy }}
            />
            {strings.copyPlan}
          </button>
          <button
            type="button"
            className="planner-button"
            disabled={!hydrated || !valid}
            onClick={downloadPlan}
          >
            <span
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: icons.download }}
            />
            {strings.downloadPlan}
          </button>
        </div>
      </div>

      <p className="planner-disclaimer">{strings.disclaimer}</p>

      <ManifestPanel
        strings={strings.manifest}
        icons={icons}
        interactive={hydrated}
        results={results}
        error={manifestError}
        targetSdk={manifest?.usesSdk?.targetSdkVersion}
        mergeMarkers={manifest?.mergeMarkers ?? false}
        model={model}
        from={from}
        to={to}
        onAnalyze={analyze}
        onFail={(error) => {
          setManifest(undefined)
          setManifestError(error)
        }}
        onClear={() => {
          setManifest(undefined)
          setManifestError(undefined)
        }}
        onUseTarget={changeRange}
      />

      {steps.length > 0 && (
        <ol className="planner-steps">
          {steps.map((version, index) => (
            <PlanStep
              key={version.api}
              version={version}
              from={index === 0 ? from : steps[index - 1].api}
              position={index + 1}
              done={done}
              onToggle={toggle}
              scope={scope}
              query={query}
              findings={(results ?? []).filter(
                (result) =>
                  result.api === version.api &&
                  result.status !== 'not-applicable',
              )}
              strings={strings}
              icons={icons}
              interactive={hydrated}
              onCopied={announceCopy}
            />
          ))}
        </ol>
      )}

      <p className="planner-saved">{strings.savedLocally}</p>
    </div>
  )
}
