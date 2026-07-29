import { parse, stringify } from 'yaml'

export const LAB_INPUT_LIMIT_BYTES = 64 * 1024
export const LAB_OUTPUT_LIMIT_BYTES = 256 * 1024
export const UNICODE_INSPECT_LIMIT_CODEPOINTS = 10_000

export type ToolErrorCode =
  | 'input-required'
  | 'input-too-large'
  | 'input-too-complex'
  | 'output-too-large'
  | 'invalid-json'
  | 'invalid-yaml'
  | 'invalid-base64'
  | 'invalid-ipv4'
  | 'invalid-cidr'
  | 'invalid-docker-command'
  | 'unsupported-docker-option'
  | 'invalid-docker-port'
  | 'missing-docker-image'
  | 'invalid-timestamp'

export class ToolError extends Error {
  constructor(
    readonly code: ToolErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'ToolError'
  }
}

const invalid = (code: ToolErrorCode, message: string): never => {
  throw new ToolError(code, message)
}

const byteLength = (value: string) => new TextEncoder().encode(value).byteLength

export const assertLabInputWithinLimits = (
  input: string,
  maxCodePoints?: number,
) => {
  if (byteLength(input) > LAB_INPUT_LIMIT_BYTES) {
    return invalid('input-too-large', 'Input is too large')
  }
  if (maxCodePoints !== undefined && [...input].length > maxCodePoints) {
    return invalid('input-too-complex', 'Input is too complex')
  }
}

const checkedOutput = (output: string) => {
  if (byteLength(output) > LAB_OUTPUT_LIMIT_BYTES) {
    return invalid('output-too-large', 'Output is too large')
  }
  return output
}

export type JsonMode = 'format' | 'minify' | 'validate'

export const transformJson = (
  input: string,
  mode: JsonMode,
  indent: 2 | 4 = 2,
) => {
  assertLabInputWithinLimits(input)
  try {
    const value: unknown = JSON.parse(input)
    if (mode === 'validate') return 'Valid JSON'
    return checkedOutput(
      JSON.stringify(value, null, mode === 'minify' ? 0 : indent),
    )
  } catch (error) {
    if (error instanceof ToolError) throw error
    return invalid('invalid-json', 'Invalid JSON')
  }
}

export const formatJson = (input: string, indent: 2 | 4 = 2) =>
  transformJson(input, 'format', indent)

const bytesToBinary = (bytes: Uint8Array) => {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return binary
}

export const encodeBase64 = (input: string) => {
  assertLabInputWithinLimits(input)
  if (input.length === 0) return ''
  return checkedOutput(btoa(bytesToBinary(new TextEncoder().encode(input))))
}

export const decodeBase64 = (input: string) => {
  assertLabInputWithinLimits(input)
  const normalized = input.trim()
  if (normalized.length === 0) return ''
  if (
    normalized.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)
  ) {
    return invalid('invalid-base64', 'Invalid Base64')
  }
  try {
    const binary = atob(normalized)
    return checkedOutput(
      new TextDecoder('utf-8', { fatal: true }).decode(
        Uint8Array.from(binary, (character) => character.charCodeAt(0)),
      ),
    )
  } catch (error) {
    if (error instanceof ToolError) throw error
    return invalid('invalid-base64', 'Invalid Base64')
  }
}

export type YamlMode = 'validate' | 'format' | 'to-json' | 'from-json'

export const transformYaml = (input: string, mode: YamlMode) => {
  assertLabInputWithinLimits(input)
  try {
    if (mode === 'from-json') {
      return checkedOutput(stringify(JSON.parse(input)))
    }
    const value: unknown = parse(input, { maxAliasCount: 50 })
    if (mode === 'validate') return 'Valid YAML'
    if (mode === 'to-json') {
      return checkedOutput(JSON.stringify(value, null, 2))
    }
    return checkedOutput(stringify(value))
  } catch (error) {
    if (error instanceof ToolError) throw error
    return invalid(
      mode === 'from-json' ? 'invalid-json' : 'invalid-yaml',
      mode === 'from-json' ? 'Invalid JSON' : 'Invalid YAML',
    )
  }
}

const parseIpv4 = (input: string) => {
  const parts = input.split('.').map(Number)
  if (
    parts.length !== 4 ||
    parts.some(
      (part, index) =>
        !Number.isInteger(part) ||
        part < 0 ||
        part > 255 ||
        String(part) !== input.split('.')[index],
    )
  ) {
    return invalid('invalid-ipv4', 'Invalid IPv4 address')
  }
  return parts.reduce((value, part) => (value * 256 + part) >>> 0, 0)
}

const formatIpv4 = (value: number) =>
  [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join('.')

export const calculateSubnet = (ip: string, cidr: number) => {
  assertLabInputWithinLimits(ip)
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) {
    return invalid('invalid-cidr', 'Invalid CIDR')
  }
  const address = parseIpv4(ip)
  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0
  const network = (address & mask) >>> 0
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const totalHosts = 2 ** (32 - cidr)
  const usableHosts = cidr === 32 ? 1 : cidr === 31 ? 2 : totalHosts - 2
  return {
    networkAddress: formatIpv4(network),
    broadcastAddress: formatIpv4(broadcast),
    firstUsableAddress: formatIpv4(cidr >= 31 ? network : network + 1),
    lastUsableAddress: formatIpv4(cidr >= 31 ? broadcast : broadcast - 1),
    subnetMask: formatIpv4(mask),
    totalHosts,
    usableHosts,
  }
}

const tokenize = (input: string) =>
  [...input.matchAll(/"([^"]*)"|'([^']*)'|([^\s]+)/g)].map(
    (match) => match[1] ?? match[2] ?? match[3],
  )

const requireOptionValue = (option: string, value?: string) => {
  if (!value || value.startsWith('-')) {
    return invalid(
      'invalid-docker-command',
      `Docker option requires a value: ${option}`,
    )
  }
  return value
}

export const convertDockerRun = (input: string) => {
  assertLabInputWithinLimits(input)
  const tokens = tokenize(input.replace(/\\\s*\n/g, ' '))
  if (tokens[0] !== 'docker' || tokens[1] !== 'run') {
    return invalid('invalid-docker-command', 'Input must begin with docker run')
  }
  const ports: { port: number; targetPort: number }[] = []
  const environment: Record<string, string> = {}
  let name = 'app'
  let image = ''

  for (let index = 2; index < tokens.length; index += 1) {
    const token = tokens[index]
    const [option, inlineValue] = token.split(/=(.*)/s, 2)
    const nextValue = inlineValue ?? tokens[index + 1]
    const consumesNext = inlineValue === undefined

    if (option === '--name') {
      const value = requireOptionValue(option, nextValue)
      name = value.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
      if (consumesNext) index += 1
    } else if (option === '-p' || option === '--publish') {
      const value = requireOptionValue(option, nextValue)
      const values = value.split(':').map(Number)
      const port = values.length === 1 ? values[0] : values.at(-2)
      const targetPort = values.at(-1)
      if (
        !port ||
        !targetPort ||
        !Number.isInteger(port) ||
        !Number.isInteger(targetPort) ||
        port > 65_535 ||
        targetPort > 65_535
      ) {
        return invalid('invalid-docker-port', 'Invalid published port')
      }
      ports.push({ port, targetPort })
      if (consumesNext) index += 1
    } else if (option === '-e' || option === '--env') {
      const value = requireOptionValue(option, nextValue)
      const separator = value.indexOf('=')
      environment[separator > 0 ? value.slice(0, separator) : value] =
        separator > 0 ? value.slice(separator + 1) : ''
      if (consumesNext) index += 1
    } else if (['-d', '--detach', '--rm'].includes(option)) {
      continue
    } else if (option.startsWith('-')) {
      return invalid(
        'unsupported-docker-option',
        `Unsupported Docker option: ${option}`,
      )
    } else if (!image) {
      image = token
    } else {
      return invalid(
        'invalid-docker-command',
        'Container commands are not supported',
      )
    }
  }

  if (!image)
    return invalid('missing-docker-image', 'A container image is required')
  const labels = { app: name }
  const container: Record<string, unknown> = { name, image }
  if (ports.length > 0) {
    container.ports = ports.map(({ targetPort }) => ({
      containerPort: targetPort,
    }))
  }
  if (Object.keys(environment).length > 0) {
    container.env = Object.entries(environment).map(([key, value]) => ({
      name: key,
      value,
    }))
  }
  const resources: Record<string, unknown>[] = [
    {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: { name },
      spec: {
        replicas: 1,
        selector: { matchLabels: labels },
        template: {
          metadata: { labels },
          spec: { containers: [container] },
        },
      },
    },
  ]
  if (ports.length > 0) {
    resources.push({
      apiVersion: 'v1',
      kind: 'Service',
      metadata: { name },
      spec: { selector: labels, ports },
    })
  }
  return checkedOutput(
    resources.map((resource) => stringify(resource).trim()).join('\n---\n'),
  )
}

export const formatTimestamp = (input: string) => {
  assertLabInputWithinLimits(input)
  const normalized = input.trim()
  if (!normalized) return invalid('input-required', 'Timestamp is required')

  const numeric = Number(normalized)
  let date: Date
  if (Number.isFinite(numeric)) {
    const absolute = Math.abs(numeric)
    if (absolute <= 9_999_999_999) date = new Date(numeric * 1000)
    else if (absolute >= 100_000_000_000) date = new Date(numeric)
    else return invalid('invalid-timestamp', 'Invalid timestamp')
  } else {
    date = new Date(normalized)
  }
  if (Number.isNaN(date.getTime())) {
    return invalid('invalid-timestamp', 'Invalid timestamp')
  }
  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    unixSeconds: Math.floor(date.getTime() / 1000),
  }
}

export const inspectAscii = (input: string) => {
  assertLabInputWithinLimits(input, UNICODE_INSPECT_LIMIT_CODEPOINTS)
  return [...input].map((character) => {
    const codePoint = character.codePointAt(0) ?? 0
    return {
      character,
      codePoint,
      hex: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
    }
  })
}
