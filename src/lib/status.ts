/**
 * Every collection carries its own lifecycle vocabulary (`shipped`, `stable`,
 * `collecting`, …). The UI only needs to know how urgent a record is, so those
 * vocabularies collapse onto one shared tone that drives the status chip colour
 * across Work, Lab, Notes, and Gallery.
 */
export type StatusTone = 'live' | 'progress' | 'archived' | 'neutral'

const live = ['shipped', 'maintained', 'active', 'stable', 'current', 'curated']
const progress = ['prototype', 'research', 'collecting']
const archived = ['archived', 'superseded']

export const getLifecycleTone = (lifecycle: string): StatusTone =>
  live.includes(lifecycle)
    ? 'live'
    : progress.includes(lifecycle)
      ? 'progress'
      : archived.includes(lifecycle)
        ? 'archived'
        : 'neutral'
