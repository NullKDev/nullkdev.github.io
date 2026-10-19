import type { ReactNode } from 'react'

import type { Dictionary } from '@/i18n'
import type { RuleResult } from '@/lib/manifest-rules'
import {
  fill,
  rowMatches,
  splitStep,
  stepKey,
  versionLabel,
  type ChangeRow,
  type PermissionRow,
  type PlannerVersion,
} from '@/lib/migration-planner'

import { Inline } from './Inline'
import type { PlannerIcons } from './icons'

export type Scope = 'targeting' | 'all'

interface Props {
  version: PlannerVersion
  /** The level this step migrates from. */
  from: number
  position: number
  done: ReadonlySet<string>
  onToggle: (key: string, checked: boolean) => void
  scope: Scope
  query: string
  findings: readonly RuleResult[]
  strings: Dictionary['planner']
  icons: PlannerIcons
  interactive: boolean
  onCopied: (ok: boolean) => void
}

interface GroupProps {
  title: string
  rows: readonly (ChangeRow | PermissionRow)[]
  query: string
  empty?: string
  strings: Dictionary['planner']
  children: (row: ChangeRow | PermissionRow, index: number) => ReactNode
}

/**
 * One table of the note, folded. It opens by itself while a filter is typed,
 * so a match is never hidden behind a closed summary.
 */
function ChangeGroup({
  title,
  rows,
  query,
  empty,
  strings,
  children,
}: GroupProps) {
  const shown = rows.filter((row) => rowMatches(row, query))
  if (rows.length === 0 && !empty) return null
  return (
    <details
      className="planner-group"
      open={query ? shown.length > 0 : undefined}
    >
      <summary>
        <span>{title}</span>
        <span className="planner-group__count">
          {query ? `${shown.length}/${rows.length}` : rows.length}
        </span>
      </summary>
      {rows.length === 0 ? (
        <p className="planner-group__empty">
          <Inline markdown={empty ?? ''} />
        </p>
      ) : shown.length === 0 ? (
        <p className="planner-group__empty">{strings.noMatches}</p>
      ) : (
        <ul className="planner-rows">{shown.map(children)}</ul>
      )}
    </details>
  )
}

export function PlanStep({
  version,
  from,
  position,
  done,
  onToggle,
  scope,
  query,
  findings,
  strings,
  icons,
  interactive,
  onCopied,
}: Props) {
  const steps = version.checklist?.steps ?? []
  const ticked = steps.filter((step) =>
    done.has(stepKey(version.api, step)),
  ).length
  const headingId = `planner-level-${version.api}`
  const anchor = version.anchors.migrating ?? version.anchors.targeting
  const copy = {
    copyLabel: strings.copyCommand,
    copyIcon: icons.copy,
    onCopied,
  }

  const changeRow = (row: ChangeRow | PermissionRow, index: number) => {
    const change = row as ChangeRow
    return (
      <li className="planner-row" key={index}>
        <p className="planner-row__title">
          <Inline markdown={change.change} />
        </p>
        <dl>
          <div>
            <dt>{strings.whatToDo}</dt>
            <dd>
              <Inline markdown={change.action} />
            </dd>
          </div>
          {change.check && (
            <div>
              <dt>{strings.howToCheck}</dt>
              <dd>
                <Inline markdown={change.check} {...copy} />
              </dd>
            </div>
          )}
        </dl>
      </li>
    )
  }

  const permissionRow = (row: ChangeRow | PermissionRow, index: number) => {
    const permission = row as PermissionRow
    return (
      <li className="planner-row" key={index}>
        <p className="planner-row__title">
          <Inline markdown={permission.permission} />
        </p>
        <dl>
          <div>
            <dt>{strings.changed}</dt>
            <dd>
              <Inline markdown={permission.changed} />
            </dd>
          </div>
          <div>
            <dt>{strings.declare}</dt>
            <dd>
              <Inline markdown={permission.declare} />
            </dd>
          </div>
          <div>
            <dt>{strings.remove}</dt>
            <dd>
              <Inline markdown={permission.remove} />
            </dd>
          </div>
        </dl>
      </li>
    )
  }

  return (
    <li
      className="planner-level"
      data-complete={
        steps.length > 0 && ticked === steps.length ? '' : undefined
      }
    >
      <section aria-labelledby={headingId}>
        <header className="planner-level__head">
          <span className="planner-level__index" aria-hidden="true">
            {String(position).padStart(2, '0')}
          </span>
          <div className="planner-level__title">
            <h3 id={headingId}>{versionLabel(version)}</h3>
            <p>
              {fill(strings.fromLevel, { from })}
              {version.name && version.name !== version.version
                ? ` · ${version.name}`
                : ''}
            </p>
          </div>
          {steps.length > 0 && (
            <p className="planner-level__progress">
              <span>
                {fill(strings.progress, { done: ticked, total: steps.length })}
              </span>
              <span className="planner-meter" aria-hidden="true">
                <span style={{ width: `${(ticked / steps.length) * 100}%` }} />
              </span>
            </p>
          )}
        </header>

        {findings.length > 0 && (
          <div className="planner-findings">
            <p className="planner-findings__label">
              {strings.manifest.findings}
            </p>
            <ul>
              {findings.map((finding) => (
                <li key={finding.id} data-status={finding.status}>
                  <span className="planner-status">
                    {finding.status === 'detected'
                      ? strings.manifest.detected
                      : strings.manifest.check}
                  </span>
                  <Inline
                    markdown={
                      strings.manifest.rules[
                        finding.id as keyof Dictionary['planner']['manifest']['rules']
                      ]?.title ?? finding.id
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {version.checklist ? (
          <>
            {version.checklist.intro && (
              <p className="planner-level__intro">
                <Inline markdown={version.checklist.intro} />
              </p>
            )}
            <ol className="planner-checklist">
              {steps.map((step, index) => {
                const key = stepKey(version.api, step)
                const id = `planner-step-${version.api}-${index}`
                const parts = splitStep(step)
                return (
                  <li key={`${index}-${key}`}>
                    <input
                      id={id}
                      type="checkbox"
                      checked={done.has(key)}
                      disabled={!interactive}
                      onChange={(event) => onToggle(key, event.target.checked)}
                    />
                    <div>
                      <label htmlFor={id}>
                        {parts.lead && <strong>{parts.lead} </strong>}
                        <Inline markdown={parts.body} />
                      </label>
                      {parts.verify && (
                        <p className="planner-verify">
                          <span>{strings.verify}</span>
                          <Inline markdown={parts.verify} {...copy} />
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
            {version.checklist.outro.map((paragraph) => (
              <p className="planner-level__outro" key={paragraph}>
                <Inline markdown={paragraph} />
              </p>
            ))}
          </>
        ) : (
          <p className="planner-level__intro">{strings.noChecklist}</p>
        )}

        <div className="planner-groups">
          <ChangeGroup
            title={fill(strings.targeting, { api: version.api })}
            rows={version.targeting}
            query={query}
            empty={version.targetingNote ?? strings.noTargeting}
            strings={strings}
          >
            {changeRow}
          </ChangeGroup>
          {scope === 'all' && (
            <ChangeGroup
              title={fill(strings.allApps, { version: version.version })}
              rows={version.allApps}
              query={query}
              strings={strings}
            >
              {changeRow}
            </ChangeGroup>
          )}
          <ChangeGroup
            title={strings.permissions}
            rows={version.permissions}
            query={query}
            empty={version.permissionsNote}
            strings={strings}
          >
            {permissionRow}
          </ChangeGroup>
        </div>

        <a
          className="planner-level__note"
          href={`${version.href}${anchor ? `#${anchor}` : ''}`}
        >
          {fill(strings.readNote, { version: version.version })}
          <span
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: icons.arrow }}
          />
        </a>
      </section>
    </li>
  )
}
