import { parseInline } from '@/lib/migration-planner'

import { CopyButton } from './CopyButton'

interface Props {
  /** Inline markdown from a note: code, bold and links only. */
  markdown: string
  /** Code spans that read as a shell command get their own copy button. */
  copyLabel?: string
  copyIcon?: string
  onCopied?: (ok: boolean) => void
}

/** A command a reader would paste: `adb …`, `./gradlew …`, `aapt …`. */
const isCommand = (code: string): boolean =>
  /^(adb|\.\/gradlew|gradlew|aapt2?|apksigner|bundletool|sdkmanager)\s/.test(
    code,
  )

/**
 * Renders note markdown as React nodes. Nothing is injected as HTML: text,
 * code and link labels are all text nodes, and `parseInline` only keeps links
 * into the site or to https pages.
 */
export function Inline({ markdown, copyLabel, copyIcon, onCopied }: Props) {
  return (
    <>
      {parseInline(markdown).map((node, index) => {
        switch (node.type) {
          case 'code':
            return copyLabel && isCommand(node.value) ? (
              <span className="planner-command" key={index}>
                <code>{node.value}</code>
                <CopyButton
                  text={node.value}
                  label={`${copyLabel}: ${node.value}`}
                  icon={copyIcon}
                  onCopied={onCopied}
                />
              </span>
            ) : (
              <code key={index}>{node.value}</code>
            )
          case 'strong':
            return <strong key={index}>{node.value}</strong>
          case 'link':
            return (
              <a key={index} href={node.href}>
                {node.value}
              </a>
            )
          default:
            return <span key={index}>{node.value}</span>
        }
      })}
    </>
  )
}
