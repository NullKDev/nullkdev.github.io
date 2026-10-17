import { readFile } from 'node:fs/promises'
import { glob } from 'node:fs/promises'

import { describe, expect, it } from 'vitest'

/**
 * Spanish copy is neutral: no voseo. The forms below are the ones that have
 * already slipped into the archive, plus the common ones around them. Code is
 * exempt — `vos` can be an identifier — so fenced and inline code are removed
 * before matching.
 */
const voseo = [
  'vos',
  'sos',
  'acá',
  // present tense
  'podés',
  'tenés',
  'querés',
  'sabés',
  'hacés',
  'decís',
  'subís',
  'necesitás',
  'obtenés',
  'conocés',
  'creés',
  'elegís',
  'distribuís',
  'mostrás',
  'pagás',
  'agregás',
  'planificás',
  'parseás',
  'pineás',
  'inyectás',
  'consultás',
  'declarás',
  'generás',
  'enterás',
  'manejás',
  'cambiás',
  'cruzás',
  'medís',
  'respondés',
  'atrapás',
  'controlás',
  'apuntás',
  'ejecutás',
  'usás',
  'probás',
  // imperative
  'mirá',
  'fijate',
  'ingresá',
  'continuá',
  'usá',
  'probá',
  'revisá',
  'leé',
  'activá',
  'actualizá',
  'auditá',
  'contá',
  'dejá',
  'ejecutá',
  'exportá',
  'empezá',
  'poné',
  'tomá',
  'corré',
  'resolvé',
  'respondé',
  'encontrá',
  'enviá',
  'compará',
  'verificá',
  'validá',
  'generá',
  'calculá',
  'traducí',
  'convertí',
  'preferí',
  'inspeccioná',
  'codificá',
  'decodificá',
  'formateá',
  'minificá',
  'transformá',
  'escaneá',
  'separá',
  'registrá',
  'chequeá',
  // imperative with a pronoun attached
  'usalo',
  'ejecutalo',
  'escribilo',
  'mantenelo',
  'ponelo',
  'subilo',
  'pasate',
  'tomate',
  'asegurate',
  'acordate',
]

const letter = 'A-Za-zÁÉÍÓÚÑÜáéíóúñü'
const pattern = new RegExp(
  `(?<![${letter}])(${voseo.join('|')})(?![${letter}])`,
  'giu',
)

/** Prose only: fenced blocks and inline code may legitimately say `vos`. */
const prose = (source: string) =>
  source.replaceAll(/```[\s\S]*?```/g, '').replaceAll(/`[^`\n]*`/g, '')

const findVoseo = (source: string): string[] =>
  [...prose(source).matchAll(pattern)].map((match) => match[1])

const spanishSources = async () => {
  const files = ['src/i18n/es.ts']
  for await (const file of glob('src/content/**/*.es.{md,mdx}')) {
    files.push(file)
  }
  return files
}

describe('voseo detector', () => {
  it('catches voseo in prose and ignores it inside code', () => {
    expect(findVoseo('Si subís el targetSdk, vos elegís.')).toEqual([
      'subís',
      'vos',
      'elegís',
    ])
    expect(findVoseo('Usalo `vos` y\n```\nconst vos = 1\n```')).toEqual([
      'Usalo',
    ])
    expect(findVoseo('Puedes subirlo; después, más tarde.')).toEqual([])
  })
})

describe('Spanish copy is neutral', () => {
  it('has no voseo in Spanish content or UI strings', async () => {
    const offenders: string[] = []
    for (const file of await spanishSources()) {
      const found = findVoseo(await readFile(file, 'utf8'))
      if (found.length > 0) offenders.push(`${file}: ${found.join(', ')}`)
    }
    expect(offenders).toEqual([])
  })
})
