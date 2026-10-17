import { useCallback, useEffect, useRef, useState } from 'react'

import type { DemoIcons, MatteflowLabels } from './labels'
import type { PreparedText } from './matteflow/layout'
import {
  MatteflowControls,
  type MatteflowIconRole,
} from './matteflow/MatteflowControls'
import { createPreparedText, loadPretext } from './matteflow/pretext'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FONT,
  PAPER,
  renderArticleOnly,
  renderMatteflowFrame,
  type StageParams,
} from './matteflow/render'

const INITIAL_STAGE: StageParams = {
  wrapStrength: 0.77,
  scale: 0.79,
  verticalShift: 0.02,
  horizontalShift: 0.21,
}

const createOffscreen = () => {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  return canvas
}

/**
 * Article text flowing around a matted video subject, re-laid every frame.
 * Rendered through `MatteflowIsland.astro`, which supplies the page's strings
 * and icons plus the no-JavaScript fallback.
 */
export default function MatteflowDemo({
  labels,
  icons,
}: {
  labels: MatteflowLabels
  icons: DemoIcons<MatteflowIconRole>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const offscreenRef = useRef<{
    scratch: HTMLCanvasElement
    composite: HTMLCanvasElement
  } | null>(null)
  const frameRef = useRef(0)
  const preparedRef = useRef<PreparedText | null>(null)
  /** The object URL of an uploaded video, owned here so it is always revoked. */
  const uploadUrlRef = useRef<string | null>(null)
  /* No bundled clip: the reader brings the video. Until then the canvas shows
     the article across the full column, and the only control offered is the
     one that works — choosing a file. */
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [stage, setStage] = useState(INITIAL_STAGE)

  // Prepare the article once per text; fall back to canvas measuring when
  // pretext cannot load.
  useEffect(() => {
    let cancelled = false
    void loadPretext()
    const scratch = createOffscreen()
    offscreenRef.current = { scratch, composite: createOffscreen() }
    const context = scratch.getContext('2d')
    if (!context) return
    void createPreparedText(labels.article, FONT, context).then((prepared) => {
      if (cancelled) return
      preparedRef.current = prepared
      const canvas = canvasRef.current
      if (canvas && !videoRef.current?.currentSrc) {
        renderArticleOnly(canvas, prepared)
      }
    })
    return () => {
      cancelled = true
    }
  }, [labels.article])

  const stopLoop = useCallback(() => cancelAnimationFrame(frameRef.current), [])

  const startLoop = useCallback(() => {
    const loop = () => {
      const canvas = canvasRef.current
      const video = videoRef.current
      const offscreen = offscreenRef.current
      const prepared = preparedRef.current
      if (canvas && video && offscreen && prepared && video.readyState >= 2) {
        renderMatteflowFrame({ canvas, video, ...offscreen, prepared, stage })
      }
      frameRef.current = requestAnimationFrame(loop)
    }
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(loop)
  }, [stage])

  const loadVideoFile = useCallback(
    (file: File) => {
      if (uploadUrlRef.current) URL.revokeObjectURL(uploadUrlRef.current)
      const url = URL.createObjectURL(file)
      uploadUrlRef.current = url
      stopLoop()
      setVideoUrl(url)
      setPlaying(false)
      setFailed(false)
      setLoading(true)
    },
    [stopLoop],
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoUrl) return

    video.src = videoUrl
    video.loop = true
    video.muted = true
    video.playsInline = true

    const onReady = () => {
      setLoading(false)
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }

    const onError = () => {
      setLoading(false)
      setPlaying(false)
      setFailed(true)
    }

    video.addEventListener('loadeddata', onReady, { once: true })
    video.addEventListener('error', onError, { once: true })
    return () => {
      video.removeEventListener('loadeddata', onReady)
      video.removeEventListener('error', onError)
    }
  }, [videoUrl])

  // The loop follows `playing` and the stage values it draws with.
  useEffect(() => {
    if (!playing) return
    startLoop()
    return stopLoop
  }, [playing, startLoop, stopLoop])

  // Unmount: stop drawing, stop decoding, release an uploaded video.
  useEffect(() => {
    const video = videoRef.current
    return () => {
      stopLoop()
      video?.pause()
      if (uploadUrlRef.current) URL.revokeObjectURL(uploadUrlRef.current)
      uploadUrlRef.current = null
    }
  }, [stopLoop])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (playing) {
      video.pause()
      setPlaying(false)
      return
    }
    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [playing])

  const updateStage = useCallback(
    (key: keyof StageParams, value: number) =>
      setStage((current) => ({ ...current, [key]: value })),
    [],
  )

  return (
    <div className="not-prose border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      {/* Not media for the viewer: this element only decodes frames that are
          read into the canvas below. It is never shown and has no audio, so a
          captions track would be theatre — it is hidden from the a11y tree
          instead, which is also what satisfies the captions rule without
          suppressing it. `muted` + `playsInline` are what let it autoplay. */}
      <video
        ref={videoRef}
        className="hidden"
        aria-hidden="true"
        muted
        playsInline
      />

      <div className="relative" style={{ background: PAPER }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          role="img"
          aria-label={labels.canvasLabel}
          className="block h-auto w-full"
        />
        {(loading || failed || !videoUrl) && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center p-3">
            <p
              role="status"
              className="rounded-md bg-[#f7f4ef]/95 px-3 py-1.5 text-center text-sm text-gray-800 shadow-sm"
            >
              {loading
                ? labels.loading
                : failed
                  ? labels.videoError
                  : labels.empty}
            </p>
          </div>
        )}
      </div>

      <MatteflowControls
        labels={labels}
        icons={icons}
        loading={loading}
        hasVideo={videoUrl !== null && !failed}
        playing={playing}
        stage={stage}
        onTogglePlay={togglePlay}
        onFile={loadVideoFile}
        onStageChange={updateStage}
      />
    </div>
  )
}
