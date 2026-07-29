import { useState, useSyncExternalStore, type SyntheticEvent } from 'react'

import {
  calculateSubnet,
  convertDockerRun,
  decodeBase64,
  encodeBase64,
  formatTimestamp,
  inspectAscii,
  ToolError,
  transformJson,
  transformYaml,
  type JsonMode,
  type ToolErrorCode,
  type YamlMode,
} from '@/lib/tools'

interface Props {
  implementationId: string
  locale: 'en' | 'es'
}

const copy = {
  en: {
    input: 'Input',
    output: 'Output',
    run: 'Run locally',
    copy: 'Copy output',
    clear: 'Clear',
    copied: 'Copied',
    operation: 'Operation',
    indentation: 'Indentation',
    length: 'Length',
    groups: 'Character groups',
    format: 'Format',
    minify: 'Minify',
    validate: 'Validate',
    encode: 'Encode',
    decode: 'Decode',
    toJson: 'YAML to JSON',
    fromJson: 'JSON to YAML',
    lower: 'Lowercase',
    upper: 'Uppercase',
    numbers: 'Numbers',
    symbols: 'Symbols',
    validJson: 'Valid JSON',
    validYaml: 'Valid YAML',
    noScript:
      'JavaScript is required to run this local tool. Your input is not submitted anywhere.',
    errors: {
      'input-required': 'Input is required.',
      'input-too-large': 'Input is too large. Use a file smaller than 64 KB.',
      'input-too-complex':
        'Input is too complex for safe in-browser processing.',
      'output-too-large': 'The result is too large to display safely.',
      'invalid-json': 'Invalid JSON.',
      'invalid-yaml': 'Invalid YAML.',
      'invalid-base64': 'Invalid Base64.',
      'invalid-ipv4': 'Invalid IPv4 address.',
      'invalid-cidr': 'Invalid CIDR prefix.',
      'invalid-docker-command': 'Invalid or unsupported Docker command.',
      'unsupported-docker-option': 'That Docker option is not supported.',
      'invalid-docker-port': 'Invalid published port.',
      'missing-docker-image': 'A container image is required.',
      'invalid-timestamp': 'Invalid or ambiguous timestamp.',
    },
  },
  es: {
    input: 'Entrada',
    output: 'Resultado',
    run: 'Ejecutar localmente',
    copy: 'Copiar resultado',
    clear: 'Limpiar',
    copied: 'Copiado',
    operation: 'Operación',
    indentation: 'Indentación',
    length: 'Longitud',
    groups: 'Grupos de caracteres',
    format: 'Formatear',
    minify: 'Minificar',
    validate: 'Validar',
    encode: 'Codificar',
    decode: 'Decodificar',
    toJson: 'YAML a JSON',
    fromJson: 'JSON a YAML',
    lower: 'Minúsculas',
    upper: 'Mayúsculas',
    numbers: 'Números',
    symbols: 'Símbolos',
    validJson: 'JSON válido',
    validYaml: 'YAML válido',
    noScript:
      'JavaScript es necesario para ejecutar esta herramienta local. Tu entrada no se envía a ningún sitio.',
    errors: {
      'input-required': 'La entrada es obligatoria.',
      'input-too-large':
        'La entrada es demasiado grande. Usá un archivo menor a 64 KB.',
      'input-too-complex':
        'La entrada es demasiado compleja para procesarla de forma segura en el navegador.',
      'output-too-large':
        'El resultado es demasiado grande para mostrarlo de forma segura.',
      'invalid-json': 'JSON no válido.',
      'invalid-yaml': 'YAML no válido.',
      'invalid-base64': 'Base64 no válido.',
      'invalid-ipv4': 'Dirección IPv4 no válida.',
      'invalid-cidr': 'Prefijo CIDR no válido.',
      'invalid-docker-command': 'Comando Docker no válido o no soportado.',
      'unsupported-docker-option': 'Esa opción de Docker no está soportada.',
      'invalid-docker-port': 'Puerto publicado no válido.',
      'missing-docker-image': 'Se necesita una imagen de contenedor.',
      'invalid-timestamp': 'Timestamp no válido o ambiguo.',
    },
  },
} as const

const examples: Record<string, string> = {
  'json-formatter': '{"archive":{"public":true,"signals":3}}',
  'yaml-validator': 'archive:\n  public: true\n  signals: 3',
  'base64-encoder': 'Signal archive · Archivo de señales',
  'subnet-calculator': '192.168.10.42',
  'timestamp-converter': '2026-07-23T12:00:00Z',
  'docker-converter':
    'docker run --name archive -p 8080:80 -e MODE=static nginx:1.27',
  'ascii-converter': 'CarlosDev / señal',
}

const subscribeHydration = () => () => undefined

const password = (length: number, groups: string[]) => {
  const alphabet = groups.join('')
  if (!alphabet) throw new ToolError('input-required', 'Select a group')
  const values = new Uint32Array(length)
  crypto.getRandomValues(values)
  return [...values].map((value) => alphabet[value % alphabet.length]).join('')
}

export default function LabWorkbench({ implementationId, locale }: Props) {
  const labels = copy[locale]
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  )
  const [input, setInput] = useState(examples[implementationId] ?? '')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<JsonMode | YamlMode | 'encode' | 'decode'>(
    implementationId === 'json-formatter' ? 'format' : 'encode',
  )
  const [indent, setIndent] = useState<2 | 4>(2)
  const [cidr, setCidr] = useState(24)
  const [length, setLength] = useState(20)
  const [groups, setGroups] = useState(['lower', 'upper', 'numbers', 'symbols'])
  const [copyState, setCopyState] = useState<string>(labels.copy)

  const run = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!hydrated) return
    setError('')
    try {
      let result: unknown
      switch (implementationId) {
        case 'json-formatter':
          result = transformJson(input, mode as JsonMode, indent)
          if (mode === 'validate') result = labels.validJson
          break
        case 'yaml-validator':
          result = transformYaml(input, mode as YamlMode)
          if (mode === 'validate') result = labels.validYaml
          break
        case 'base64-encoder':
          result = mode === 'decode' ? decodeBase64(input) : encodeBase64(input)
          break
        case 'subnet-calculator':
          result = calculateSubnet(input.trim(), cidr)
          break
        case 'timestamp-converter':
          result = formatTimestamp(input)
          break
        case 'docker-converter':
          result = convertDockerRun(input)
          break
        case 'ascii-converter':
          result = inspectAscii(input)
          break
        case 'password-generator':
          result = password(
            length,
            groups.map(
              (group) =>
                ({
                  lower: 'abcdefghijklmnopqrstuvwxyz',
                  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                  numbers: '0123456789',
                  symbols: '!@#$%^&*_-+=',
                })[group] ?? '',
            ),
          )
          break
        default:
          throw new ToolError('input-required', 'Unavailable implementation')
      }
      setOutput(
        typeof result === 'string' ? result : JSON.stringify(result, null, 2),
      )
    } catch (cause) {
      setOutput('')
      const code =
        cause instanceof ToolError
          ? cause.code
          : ('input-required' as ToolErrorCode)
      setError(labels.errors[code])
    }
  }

  const toggleGroup = (group: string) =>
    setGroups((current) =>
      current.includes(group)
        ? current.filter((item) => item !== group)
        : [...current, group],
    )

  const operationOptions =
    implementationId === 'json-formatter'
      ? [
          ['format', labels.format],
          ['minify', labels.minify],
          ['validate', labels.validate],
        ]
      : implementationId === 'yaml-validator'
        ? [
            ['validate', labels.validate],
            ['format', labels.format],
            ['to-json', labels.toJson],
            ['from-json', labels.fromJson],
          ]
        : [
            ['encode', labels.encode],
            ['decode', labels.decode],
          ]

  return (
    <form className="lab-workbench" onSubmit={run} data-hydrated={hydrated}>
      <div className="lab-controls">
        {['json-formatter', 'yaml-validator', 'base64-encoder'].includes(
          implementationId,
        ) && (
          <label>
            {labels.operation}
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as typeof mode)}
            >
              {operationOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        )}
        {implementationId === 'json-formatter' && (
          <label>
            {labels.indentation}
            <select
              value={indent}
              disabled={mode !== 'format'}
              onChange={(event) =>
                setIndent(Number(event.target.value) as 2 | 4)
              }
            >
              <option value="2">2</option>
              <option value="4">4</option>
            </select>
          </label>
        )}
        {implementationId === 'subnet-calculator' && (
          <label>
            CIDR
            <input
              type="number"
              min="0"
              max="32"
              value={cidr}
              onChange={(event) => setCidr(Number(event.target.value))}
            />
          </label>
        )}
        {implementationId === 'password-generator' && (
          <>
            <label>
              {labels.length}
              <input
                type="number"
                min="8"
                max="128"
                value={length}
                onChange={(event) => setLength(Number(event.target.value))}
              />
            </label>
            <fieldset>
              <legend>{labels.groups}</legend>
              {(['lower', 'upper', 'numbers', 'symbols'] as const).map(
                (group) => (
                  <label key={group}>
                    <input
                      type="checkbox"
                      checked={groups.includes(group)}
                      onChange={() => toggleGroup(group)}
                    />
                    {labels[group]}
                  </label>
                ),
              )}
            </fieldset>
          </>
        )}
      </div>
      {implementationId !== 'password-generator' && (
        <label className="lab-pane">
          <span>{labels.input}</span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
          />
        </label>
      )}
      <div className="lab-actions">
        <button type="submit" disabled={!hydrated}>
          {labels.run}
        </button>
        <button
          type="button"
          className="quiet-button"
          onClick={() => {
            setInput('')
            setOutput('')
            setError('')
          }}
        >
          {labels.clear}
        </button>
      </div>
      <label className="lab-pane output-pane">
        <span>{labels.output}</span>
        <textarea value={output} readOnly aria-live="polite" />
      </label>
      {error && (
        <p className="tool-error" role="alert">
          {error}
        </p>
      )}
      {output && (
        <button
          type="button"
          className="quiet-button"
          onClick={async () => {
            await navigator.clipboard.writeText(output)
            setCopyState(labels.copied)
            window.setTimeout(() => setCopyState(labels.copy), 1400)
          }}
        >
          {copyState}
        </button>
      )}
    </form>
  )
}
