/**
 * What a demo island receives from its Astro wrapper. An island cannot read
 * the page's locale or the icon registry (the registry resolves icon packs at
 * build time and must not ship to the browser), so the wrapper hands over the
 * translated strings and the already-rendered marks.
 */
import type { Dictionary } from '@/i18n'

export type MatteflowLabels = Dictionary['demos']['matteflow']
export type StreamingLabels = Dictionary['demos']['streaming']

/** Inline SVG strings produced by `renderIcon`, keyed by role. */
export type DemoIcons<Role extends string> = Readonly<Record<Role, string>>
