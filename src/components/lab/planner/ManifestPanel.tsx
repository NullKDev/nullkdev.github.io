import { useId, useRef, useState, type ChangeEvent } from 'react'

import type { Dictionary } from '@/i18n'
import {
  MAX_MANIFEST_BYTES,
  type ManifestError,
  type RuleResult,
  type RuleStatus,
} from '@/lib/manifest-rules'
import { fill, type PlannerVersion } from '@/lib/migration-planner'

import { Inline } from './Inline'
import type { PlannerIcons } from './icons'

type Strings = Dictionary['planner']['manifest']
type RuleId = keyof Strings['rules']

interface Props {
  strings: Strings
  icons: PlannerIcons
  interactive: boolean
  results: readonly RuleResult[] | undefined
  error: ManifestError | 'read' | undefined
  targetSdk: number | undefined
  model: readonly PlannerVersion[]
  from: number
  onAnalyze: (xml: string) => void
  onFail: (error: ManifestError) => void
  onClear: () => void
  onUseTarget: (api: number) => void
}

const ORDER: readonly RuleStatus[] = ['detected', 'check', 'not-applicable']

/**
 * The optional manifest check. The text is read by the browser's DOMParser in
 * `parseManifest`; a file is read with FileReader. Neither leaves the page.
 */
export function ManifestPanel({
  strings,
  icons,
  interactive,
  results,
  error,
  targetSdk,
  model,
  from,
  onAnalyze,
  onFail,
  onClear,
  onUseTarget,
}: Props) {
  const [text, setText] = useState('')
  const [readError, setReadError] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const id = useId()

  const openFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setReadError(false)
    if (file.size > MAX_MANIFEST_BYTES) {
      onFail('too-large')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : ''
      setText(content)
      onAnalyze(content)
    }
    reader.onerror = () => setReadError(true)
    reader.readAsText(file)
  }

  const shownError = readError ? 'read' : error
  const label = (status: RuleStatus) =>
    status === 'detected'
      ? strings.detected
      : status === 'check'
        ? strings.check
        : strings.notApplicable
  const href = (result: RuleResult) => {
    const version = model.find(({ api }) => api === result.api)
    const anchor = version?.anchors[result.section]
    return version ? `${version.href}${anchor ? `#${anchor}` : ''}` : undefined
  }
  const counts = Object.fromEntries(
    ORDER.map((status) => [
      status,
      results?.filter((result) => result.status === status).length ?? 0,
    ]),
  ) as Record<RuleStatus, number>

  return (
    <details className="planner-manifest">
      <summary className="planner-manifest__head">
        <h3 id={`${id}-heading`}>{strings.heading}</h3>
        <span className="planner-tag">{strings.optional}</span>
      </summary>
      <p className="planner-manifest__intro">{strings.intro}</p>

      <form
        className="planner-manifest__form"
        onSubmit={(event) => {
          event.preventDefault()
          setReadError(false)
          onAnalyze(text)
        }}
      >
        <label htmlFor={`${id}-xml`}>{strings.label}</label>
        <textarea
          id={`${id}-xml`}
          value={text}
          rows={8}
          spellCheck={false}
          autoComplete="off"
          aria-describedby={`${id}-hint ${id}-privacy`}
          aria-invalid={shownError ? true : undefined}
          aria-errormessage={shownError ? `${id}-error` : undefined}
          disabled={!interactive}
          onChange={(event) => setText(event.target.value)}
          placeholder={
            '<manifest xmlns:android="http://schemas.android.com/apk/res/android">'
          }
        />
        <p id={`${id}-hint`} className="planner-hint">
          {strings.hint}
        </p>
        <div className="planner-manifest__actions">
          <button
            type="submit"
            className="planner-button"
            data-variant="primary"
            disabled={!interactive}
          >
            {strings.analyze}
          </button>
          <button
            type="button"
            className="planner-button"
            disabled={!interactive}
            onClick={() => fileInput.current?.click()}
          >
            <span
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: icons.upload }}
            />
            {strings.file}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".xml,text/xml,application/xml"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={openFile}
          />
          {(text || results || shownError) && (
            <button
              type="button"
              className="planner-button"
              data-variant="quiet"
              disabled={!interactive}
              onClick={() => {
                setText('')
                setReadError(false)
                onClear()
              }}
            >
              {strings.clear}
            </button>
          )}
        </div>
        <p id={`${id}-privacy`} className="planner-privacy">
          <span
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: icons.shield }}
          />
          {strings.privacy}
        </p>
        {shownError && (
          <p id={`${id}-error`} className="planner-error" role="alert">
            {strings.errors[shownError]}
          </p>
        )}
      </form>

      {results && !shownError && (
        <div className="planner-results">
          <h4>{strings.results}</h4>
          <p className="planner-results__summary">
            {fill(strings.summary, {
              detected: counts.detected,
              check: counts.check,
              na: counts['not-applicable'],
            })}
          </p>
          {targetSdk !== undefined && (
            <p className="planner-results__target">
              {fill(strings.targetSdk, { api: targetSdk })}{' '}
              {targetSdk !== from &&
                model.some(({ api }) => api === targetSdk) && (
                  <button
                    type="button"
                    className="planner-link-button"
                    onClick={() => onUseTarget(targetSdk)}
                  >
                    {fill(strings.useTarget, { api: targetSdk })}
                  </button>
                )}
            </p>
          )}
          {ORDER.filter((status) => counts[status] > 0).map((status) => (
            <section
              className="planner-results__group"
              data-status={status}
              key={status}
              aria-label={`${label(status)} (${counts[status]})`}
            >
              <h5>
                <span className="planner-status">{label(status)}</span>
                <span className="planner-group__count">{counts[status]}</span>
              </h5>
              <ul>
                {results
                  .filter((result) => result.status === status)
                  .map((result) => {
                    const copy = strings.rules[result.id as RuleId]
                    const message =
                      status === 'detected'
                        ? copy?.detected
                        : status === 'check'
                          ? copy?.check
                          : result.reason === 'out-of-range'
                            ? strings.outOfRange
                            : strings.notPresent
                    const link = href(result)
                    return (
                      <li key={result.id} className="planner-result">
                        <p className="planner-result__title">
                          <span className="planner-result__api">
                            {fill(strings.atLevel, { api: result.api })}
                          </span>
                          {link ? (
                            <a href={link}>
                              <Inline markdown={copy?.title ?? result.id} />
                            </a>
                          ) : (
                            <Inline markdown={copy?.title ?? result.id} />
                          )}
                        </p>
                        {message && (
                          <p>
                            <Inline markdown={message} />
                          </p>
                        )}
                        {result.items.length > 0 && (
                          <ul className="planner-result__items">
                            {result.items.map((item) => (
                              <li key={item}>
                                <code>{item}</code>
                              </li>
                            ))}
                          </ul>
                        )}
                        {(status === 'check' ||
                          (status === 'detected' &&
                            result.lint.length > 0)) && (
                          <p className="planner-result__how">
                            {result.lint.length > 0 ? (
                              <>
                                {strings.runLint}{' '}
                                {result.lint.map((lint, index) => (
                                  <span key={lint}>
                                    {index > 0 && ', '}
                                    <code>{lint}</code>
                                  </span>
                                ))}
                              </>
                            ) : (
                              strings.testDevice
                            )}
                          </p>
                        )}
                      </li>
                    )
                  })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </details>
  )
}
