/**
 * Banner artwork.
 *
 * A single faint icon is a category badge, not artwork: it says "this post is
 * filed under Android" and nothing about the post. Each motif here draws the
 * *subject* — a page being parsed into structure, memory running past a
 * ceiling, a release train reaching its last stop — so the banner carries an
 * idea before the title is read.
 *
 * Registry icons still appear, but as one element inside a composition rather
 * than the whole of it.
 *
 * Everything is drawn inside x=700..1130, y=110..520 — the right half of the
 * safe band that survives the 2.5:1 centre crop.
 */
import { renderIcon, type IconName } from '../src/lib/icons'

export type Motif =
  | 'document-parse'
  | 'release-train'
  | 'memory-ceiling'
  | 'api-locked'
  | 'pattern-pairs'
  | 'text-measure'
  | 'process-bridge'
  | 'shipped-stack'
  | 'unmeasured-half'

interface Ink {
  /** Full-strength accent, for the one element that should be read first. */
  readonly accent: string
  /** Structure the eye reads as context, not content. */
  readonly muted: string
}

/** Registry icon as a positioned group. Used *within* a motif, never alone. */
const icon = (
  name: IconName,
  x: number,
  y: number,
  size: number,
  colour: string,
  opacity = 1,
): string => {
  const body = renderIcon(name, 24)
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '')
  const scale = size / 24
  return (
    `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}" ` +
    `fill="none" stroke="${colour}" stroke-width="${(1.7 / scale).toFixed(2)}" ` +
    `stroke-linecap="round" stroke-linejoin="round">${body}</g>`
  )
}

const line = (
  x: number,
  y: number,
  w: number,
  colour: string,
  opacity: number,
  h = 12,
): string =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${colour}" opacity="${opacity}"/>`

const motifs: Record<Motif, (ink: Ink) => string> = {
  /* A page on the left, its structure recovered on the right. The subject of
     every OCR post: not characters, but layout that survives. */
  'document-parse': ({ accent, muted }) => `
    <rect x="700" y="130" width="180" height="240" rx="10" fill="none" stroke="${muted}" stroke-width="2" opacity="0.5"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => line(720, 156 + i * 26, i % 3 === 2 ? 90 : 140, muted, 0.35, 9)).join('')}
    <path d="M900 250 h44" stroke="${accent}" stroke-width="2" opacity="0.8"/>
    <path d="M932 240 l12 10 -12 10" fill="none" stroke="${accent}" stroke-width="2" opacity="0.8"/>
    <rect x="960" y="130" width="170" height="110" rx="8" fill="none" stroke="${accent}" stroke-width="2" opacity="0.75"/>
    ${line(978, 152, 120, accent, 0.5, 9)}${line(978, 172, 84, accent, 0.35, 9)}${line(978, 192, 108, accent, 0.35, 9)}
    <rect x="960" y="256" width="80" height="60" rx="6" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5"/>
    <rect x="1050" y="256" width="80" height="60" rx="6" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5"/>
    <rect x="960" y="332" width="170" height="38" rx="6" fill="${accent}" opacity="0.14"/>
    ${line(974, 346, 60, accent, 0.6, 10)}
    ${icon('check', 1096, 340, 22, accent, 0.9)}`,

  /* Three stops; the Android mark IS the final one, not a badge beside it. */
  'release-train': ({ accent, muted }) => `
    <path d="M726 292 H1010" stroke="${muted}" stroke-width="3" opacity="0.4"/>
    <circle cx="736" cy="292" r="14" fill="none" stroke="${muted}" stroke-width="3" opacity="0.55"/>
    <circle cx="876" cy="292" r="14" fill="none" stroke="${muted}" stroke-width="3" opacity="0.55"/>
    <circle cx="1030" cy="292" r="62" fill="${accent}" opacity="0.14"/>
    <circle cx="1030" cy="292" r="62" fill="none" stroke="${accent}" stroke-width="3.5"/>
    ${icon('android', 992, 262, 76, accent, 0.95)}
    ${line(700, 350, 74, muted, 0.28, 8)}
    ${line(840, 350, 74, muted, 0.28, 8)}
    ${line(978, 384, 104, accent, 0.6, 8)}
    ${line(700, 180, 190, muted, 0.22, 10)}
    ${line(700, 206, 130, muted, 0.16, 10)}`,

  /* Bars climbing into a limit. The last one crosses and is cut there — the
     post is about a process stopped mid-allocation, not a warning sign. */
  'memory-ceiling': ({ accent, muted }) => `
    <path d="M1046 148 V468" stroke="${accent}" stroke-width="4" stroke-dasharray="11 9" opacity="0.85"/>
    ${[0, 1, 2].map((i) => `<rect x="700" y="${180 + i * 60}" width="${132 + i * 92}" height="42" rx="6" fill="${muted}" opacity="0.28"/>`).join('')}
    <rect x="700" y="360" width="346" height="42" rx="6" fill="${accent}" opacity="0.26"/>
    <rect x="700" y="360" width="346" height="42" rx="6" fill="none" stroke="${accent}" stroke-width="2.5"/>
    <path d="M1046 360 h56 a6 6 0 0 1 6 6 v30 a6 6 0 0 1 -6 6 h-56" fill="none" stroke="${accent}" stroke-width="2.5" stroke-dasharray="7 7" opacity="0.4"/>
    ${icon('cross', 1064, 366, 30, accent, 0.9)}
    ${line(700, 430, 210, muted, 0.2, 10)}`,

  /* An API surface with its boundary sealed. The Android mark sits inside the
     surface it belongs to, at a size that reads as content. */
  'api-locked': ({ accent, muted }) => `
    <rect x="700" y="150" width="368" height="286" rx="16" fill="none" stroke="${muted}" stroke-width="2.5" opacity="0.4"/>
    ${[0, 1, 2, 3].map((i) => line(726, 184 + i * 40, i === 3 ? 128 : 196, muted, 0.26, 10)).join('')}
    ${icon('android', 856, 300, 104, accent, 0.6)}
    <circle cx="1068" cy="288" r="52" fill="${accent}" opacity="0.16"/>
    <circle cx="1068" cy="288" r="52" fill="none" stroke="${accent}" stroke-width="3"/>
    ${icon('shield', 1042, 262, 52, accent, 0.95)}
    ${line(726, 396, 150, accent, 0.5, 10)}`,

  /* Four pairs. The article is about patterns that only make sense two at a
     time, so the artwork is pairs, not eight loose shapes. */
  'pattern-pairs': ({ accent, muted }) => `
    ${[0, 1, 2, 3]
      .map((i) => {
        const x = 706 + (i % 2) * 216
        const y = 150 + Math.floor(i / 2) * 148
        const on = i === 0
        const c = on ? accent : muted
        const o = on ? 0.75 : 0.4
        return `<rect x="${x}" y="${y}" width="86" height="86" rx="10" fill="none" stroke="${c}" stroke-width="2.5" opacity="${o}"/>
                <rect x="${x + 100}" y="${y}" width="86" height="86" rx="10" fill="none" stroke="${c}" stroke-width="2.5" opacity="${o}"/>
                <path d="M${x + 86} ${y + 43} h14" stroke="${c}" stroke-width="2.5" opacity="${o}"/>
                ${on ? `<rect x="${x}" y="${y}" width="186" height="86" rx="10" fill="${accent}" opacity="0.1"/>` : ''}`
      })
      .join('')}`,

  /* Text lines with measurement ticks, one line resolved off-DOM. */
  'text-measure': ({ accent, muted }) => `
    ${[0, 1, 2, 3, 4].map((i) => line(706, 168 + i * 40, i === 4 ? 180 : 300 - (i % 2) * 46, muted, 0.32, 14)).join('')}
    <path d="M700 152 H1030" stroke="${accent}" stroke-width="2" opacity="0.5"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${706 + i * 54} 146 v13" stroke="${accent}" stroke-width="2" opacity="0.5"/>`).join('')}
    <rect x="1048" y="196" width="82" height="150" rx="10" fill="${accent}" opacity="0.14"/>
    <rect x="1048" y="196" width="82" height="150" rx="10" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.7"/>
    ${line(1062, 218, 54, accent, 0.55, 9)}${line(1062, 238, 36, accent, 0.4, 9)}
    ${icon('check', 1076, 292, 26, accent, 0.9)}
    ${line(706, 372, 180, accent, 0.6, 14)}`,

  /* Two processes. The Android mark lives inside the process that is Android,
     at content scale, rather than floating beside the composition. */
  'process-bridge': ({ accent, muted }) => `
    <rect x="700" y="164" width="176" height="252" rx="16" fill="none" stroke="${muted}" stroke-width="2.5" opacity="0.4"/>
    <rect x="954" y="164" width="176" height="252" rx="16" fill="${accent}" opacity="0.1"/>
    <rect x="954" y="164" width="176" height="252" rx="16" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.7"/>
    ${[0, 1, 2, 3].map((i) => line(724, 194 + i * 32, i === 3 ? 82 : 128, muted, 0.26, 11)).join('')}
    ${icon('android', 1000, 200, 84, accent, 0.85)}
    ${[0, 1, 2].map((i) => line(978, 312 + i * 30, i === 2 ? 78 : 128, accent, 0.42, 11)).join('')}
    <path d="M876 290 H954" stroke="${accent}" stroke-width="3.5" stroke-dasharray="10 8"/>
    <path d="M934 277 l18 13 -18 13" fill="none" stroke="${accent}" stroke-width="3.5"/>
    ${line(700, 442, 176, muted, 0.2, 9)}`,

  /* Releases stacked, the newest tagged. No badge in the corner — the tag is
     attached to the artifact it labels. */
  'shipped-stack': ({ accent, muted }) => `
    <rect x="758" y="278" width="340" height="126" rx="12" fill="none" stroke="${muted}" stroke-width="2.5" opacity="0.26"/>
    <rect x="730" y="240" width="340" height="126" rx="12" fill="none" stroke="${muted}" stroke-width="2.5" opacity="0.4"/>
    <rect x="702" y="202" width="340" height="126" rx="12" fill="${accent}" opacity="0.13"/>
    <rect x="702" y="202" width="340" height="126" rx="12" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.8"/>
    ${line(728, 230, 196, accent, 0.5, 11)}${line(728, 256, 134, accent, 0.3, 11)}${line(728, 282, 172, accent, 0.3, 11)}
    <circle cx="1042" cy="202" r="34" fill="${accent}" opacity="0.2"/>
    <circle cx="1042" cy="202" r="34" fill="none" stroke="${accent}" stroke-width="2.5"/>
    ${icon('release', 1024, 184, 36, accent, 0.95)}
    ${line(702, 438, 250, muted, 0.2, 10)}`,

  /* A findings list beside the pair of numbers that describes it. One dial is
     drawn and labelled; the other is an empty dashed ring. The post is about a
     measurement that was published with half of itself missing, so the missing
     half is the loudest shape in the composition — absence drawn, not implied. */
  'unmeasured-half': ({ accent, muted }) => `
    <rect x="700" y="150" width="286" height="286" rx="16" fill="none" stroke="${muted}" stroke-width="2.5" opacity="0.4"/>
    ${[0, 1, 2, 3, 4].map((i) => line(724, 184 + i * 52, i === 1 ? 168 : 238 - (i % 2) * 44, i === 1 ? accent : muted, i === 1 ? 0.7 : 0.24, 12)).join('')}
    ${icon('check', 910, 230, 26, accent, 0.95)}
    <circle cx="1064" cy="222" r="50" fill="${accent}" opacity="0.16"/>
    <circle cx="1064" cy="222" r="50" fill="none" stroke="${accent}" stroke-width="3"/>
    ${icon('shield', 1040, 198, 48, accent, 0.95)}
    <circle cx="1064" cy="372" r="50" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="9 10" opacity="0.45"/>
    ${icon('search', 1040, 348, 48, accent, 0.3)}`,
}

export const renderArt = (
  motif: Motif,
  accent: string,
  muted = '#94A3B8',
): string => motifs[motif]({ accent, muted })
