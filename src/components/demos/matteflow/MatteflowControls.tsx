import { DemoIcon } from '../DemoIcon'
import type { DemoIcons, MatteflowLabels } from '../labels'
import type { StageParams } from './render'

export type MatteflowIconRole = 'play' | 'pause' | 'loading' | 'upload'

type SliderKey = keyof StageParams

const SLIDERS: readonly {
  key: SliderKey
  label: keyof MatteflowLabels
  min: number
  max: number
}[] = [
  { key: 'wrapStrength', label: 'wrap', min: 0, max: 1.5 },
  { key: 'scale', label: 'scale', min: 0.3, max: 1.2 },
  { key: 'verticalShift', label: 'verticalShift', min: -0.3, max: 0.3 },
  { key: 'horizontalShift', label: 'horizontalShift', min: -0.3, max: 0.3 },
]

/** Playback, video upload, and the four stage sliders under the canvas. */
export function MatteflowControls({
  labels,
  icons,
  loading,
  hasVideo,
  playing,
  stage,
  onTogglePlay,
  onFile,
  onStageChange,
}: {
  labels: MatteflowLabels
  icons: DemoIcons<MatteflowIconRole>
  loading: boolean
  /** Playback is offered only once there is something to play. */
  hasVideo: boolean
  playing: boolean
  stage: StageParams
  onTogglePlay: () => void
  onFile: (file: File) => void
  onStageChange: (key: SliderKey, value: number) => void
}) {
  const playback = loading
    ? { icon: icons.loading, text: labels.loading }
    : playing
      ? { icon: icons.pause, text: labels.pause }
      : { icon: icons.play, text: labels.play }

  return (
    <div className="border-border bg-muted/20 space-y-3 border-t px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(hasVideo || loading) && (
            <button
              type="button"
              onClick={onTogglePlay}
              disabled={loading}
              className="bg-primary text-primary-foreground inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all hover:opacity-90 disabled:opacity-50"
            >
              <DemoIcon svg={playback.icon} />
              {playback.text}
            </button>
          )}
          {/* The input is visually hidden, so the label carries its focus
              ring (WCAG 2.4.7) — only for keyboard focus, never on click. */}
          <label
            className="border-border bg-background text-muted-foreground hover:text-foreground inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-xs transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-[color:var(--focus)]"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const file = event.dataTransfer.files?.[0]
              if (file?.type.startsWith('video/')) onFile(file)
            }}
          >
            <DemoIcon svg={icons.upload} />
            {labels.ownVideo}
            <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onFile(file)
              }}
            />
          </label>
        </div>
        <span className="text-muted-foreground text-[11px]">
          {labels.layoutVia}{' '}
          <a
            href="https://github.com/chenglou/pretext"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground underline"
          >
            @chenglou/pretext
          </a>
        </span>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
        <strong>{labels.tipLead}</strong> {labels.tipBody}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        {SLIDERS.map(({ key, label, min, max }) => (
          <label key={key} className="flex flex-col gap-1">
            <span className="text-muted-foreground font-medium">
              {labels[label]}{' '}
              <span className="text-foreground font-mono">
                {stage[key].toFixed(2)}
              </span>
            </span>
            <input
              type="range"
              min={min}
              max={max}
              step={0.01}
              value={stage[key]}
              onChange={(event) =>
                onStageChange(key, parseFloat(event.target.value))
              }
              className="accent-primary w-full"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
