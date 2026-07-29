/**
 * Monoline glyphs for Lab entries.
 *
 * Each entry is identified by its `implementationId` (falling back to its
 * slug). Anything without a dedicated glyph falls back to a generic mark for
 * its `kind`, so a new Lab entry always renders a real icon instead of a hole.
 */

const open = (extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>`

const glyphs: Record<string, string> = {
  // Braces — structured text in, structured text out.
  'json-formatter': `${open()}
    <path d="M9.6 4c-1.8 0-2.6.8-2.6 2.6v2.6c0 1.6-.7 2.4-2 2.5v.6c1.3.1 2 .9 2 2.5v2.6c0 1.8.8 2.6 2.6 2.6"/>
    <path d="M14.4 4c1.8 0 2.6.8 2.6 2.6v2.6c0 1.6.7 2.4 2 2.5v.6c-1.3.1-2 .9-2 2.5v2.6c0 1.8-.8 2.6-2.6 2.6"/>
  </svg>`,

  // Indented key tree — the shape of a YAML document.
  'yaml-validator': `${open()}
    <circle cx="3.8" cy="6" r="1.15" fill="currentColor" stroke="none"/>
    <path d="M7.4 6h12.4"/>
    <circle cx="9.4" cy="12" r="1.15" fill="currentColor" stroke="none"/>
    <path d="M13 12h6.8"/>
    <circle cx="9.4" cy="18" r="1.15" fill="currentColor" stroke="none"/>
    <path d="M13 18h4"/>
  </svg>`,

  // Two-way transform.
  'base64-encoder': `${open()}
    <path d="M3.6 9h15.6l-3.4-3.4"/>
    <path d="M20.4 15H4.8l3.4 3.4"/>
  </svg>`,

  // Key.
  'password-generator': `${open()}
    <circle cx="8" cy="12" r="4.2"/>
    <path d="M12.2 12h9"/>
    <path d="M17.4 12v3.2"/>
    <path d="M20.4 12v2.2"/>
  </svg>`,

  // Router over two hosts.
  'subnet-calculator': `${open()}
    <rect x="8.8" y="3" width="6.4" height="4.6" rx="1.2"/>
    <rect x="2.4" y="16.4" width="6.4" height="4.6" rx="1.2"/>
    <rect x="15.2" y="16.4" width="6.4" height="4.6" rx="1.2"/>
    <path d="M12 7.6v4.2"/>
    <path d="M5.6 16.4v-4.6h12.8v4.6"/>
  </svg>`,

  // Clock.
  'timestamp-converter': `${open()}
    <circle cx="12" cy="12" r="8.2"/>
    <path d="M12 7.2V12l3.2 2"/>
  </svg>`,

  // A character in its cell.
  'ascii-converter': `${open()}
    <rect x="3" y="4.2" width="18" height="15.6" rx="2.2"/>
    <path d="M8.4 15.8 12 8.2l3.6 7.6"/>
    <path d="M9.7 13.2h4.6"/>
  </svg>`,

  // A ribbed container, translated outward.
  'docker-converter': `${open()}
    <rect x="2.2" y="8.2" width="8.8" height="7.6" rx="1.5"/>
    <path d="M5.1 8.2v7.6"/>
    <path d="M8 8.2v7.6"/>
    <path d="M13.6 12h6.6"/>
    <path d="m17.4 9.2 2.8 2.8-2.8 2.8"/>
  </svg>`,
}

/**
 * Second link in the chain: a subject glyph. With thousands of entries most
 * will never earn a dedicated mark, and a topic-shaped icon still carries more
 * meaning than one generic mark repeated down the grid.
 */
const byTopic: Record<string, string> = {
  ai: `${open()}
    <path d="M12 3.4v3.2M12 17.4v3.2M3.4 12h3.2M17.4 12h3.2"/>
    <path d="M6.2 6.2 8.5 8.5M15.5 15.5l2.3 2.3M17.8 6.2 15.5 8.5M8.5 15.5l-2.3 2.3"/>
    <circle cx="12" cy="12" r="3.4"/>
  </svg>`,
  security: `${open()}
    <path d="M12 3.2 19.4 6v6c0 4.2-3 7.2-7.4 8.8C7.6 19.2 4.6 16.2 4.6 12V6z"/>
    <path d="m8.8 12 2.2 2.2 4.2-4.4"/>
  </svg>`,
  networking: `${open()}
    <circle cx="12" cy="12" r="8.4"/>
    <path d="M3.6 12h16.8"/>
    <path d="M12 3.6c2.4 2.4 3.6 5.2 3.6 8.4s-1.2 6-3.6 8.4c-2.4-2.4-3.6-5.2-3.6-8.4S9.6 6 12 3.6z"/>
  </svg>`,
  containers: `${open()}
    <rect x="3.2" y="7.4" width="17.6" height="9.2" rx="1.6"/>
    <path d="M8.2 7.4v9.2M12 7.4v9.2M15.8 7.4v9.2"/>
  </svg>`,
  encoding: `${open()}
    <path d="M3.6 9h15.6l-3.4-3.4"/>
    <path d="M20.4 15H4.8l3.4 3.4"/>
  </svg>`,
  dates: `${open()}
    <circle cx="12" cy="12" r="8.2"/>
    <path d="M12 7.2V12l3.2 2"/>
  </svg>`,
  performance: `${open()}
    <path d="M4 17.4a8.6 8.6 0 1 1 16 0"/>
    <path d="M12 17.4 16 9.8"/>
    <circle cx="12" cy="17.4" r="1.3" fill="currentColor" stroke="none"/>
  </svg>`,
  web: `${open()}
    <rect x="3" y="4.6" width="18" height="14.8" rx="2"/>
    <path d="M3 9.2h18"/>
    <circle cx="6.4" cy="6.9" r="0.9" fill="currentColor" stroke="none"/>
  </svg>`,
}

const fallbacks: Record<string, string> = {
  // Sliders — something you operate.
  tool: `${open()}
    <path d="M3.6 7h8.2"/><path d="M16.4 7h4"/>
    <path d="M3.6 12h2.8"/><path d="M11 12h9.4"/>
    <path d="M3.6 17h9.8"/><path d="M18 17h2.4"/>
    <circle cx="14.1" cy="7" r="2.3"/>
    <circle cx="8.7" cy="12" r="2.3"/>
    <circle cx="15.7" cy="17" r="2.3"/>
  </svg>`,

  // Flask — something still being tried.
  experiment: `${open()}
    <path d="M9.4 3.2v6.5l-4.8 8.1a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3l-4.8-8.1V3.2"/>
    <path d="M7.8 3.2h8.4"/>
    <path d="M7.4 14.4h9.2"/>
  </svg>`,
}

/**
 * Resolution chain, widest coverage last: a dedicated glyph, then the first
 * topic or technology that has one, then the generic mark for the entry's
 * kind. An entry can never end up without an icon.
 */
export const getLabIcon = (
  implementationId: string | undefined,
  slug: string,
  kind: string,
  subjects: readonly string[] = [],
): string => {
  const dedicated = glyphs[implementationId ?? ''] ?? glyphs[slug]
  if (dedicated) return dedicated
  for (const subject of subjects) {
    if (byTopic[subject]) return byTopic[subject]
  }
  return fallbacks[kind] ?? fallbacks.tool
}
