import { describe, expect, it } from 'vitest'

import {
  assertLabInputWithinLimits,
  calculateSubnet,
  convertDockerRun,
  decodeBase64,
  encodeBase64,
  formatJson,
  formatTimestamp,
  inspectAscii,
  transformJson,
  transformYaml,
} from '@/lib/tools'

describe('local Lab algorithms', () => {
  it('formats JSON and reports invalid input', () => {
    expect(formatJson('{"signal":true}', 2)).toContain('\n  "signal": true\n')
    expect(() => formatJson('{bad}', 2)).toThrow('Invalid JSON')
  })

  it('supports JSON format, minify, and validate modes with controlled indentation', () => {
    expect(transformJson('{"signal":true}', 'format', 4)).toContain(
      '\n    "signal": true\n',
    )
    expect(transformJson('{"signal":true}', 'minify')).toBe('{"signal":true}')
    expect(transformJson('{"signal":true}', 'validate')).toBe('Valid JSON')
  })

  it('round-trips Unicode through Base64', () => {
    const source = 'Señal orbital 🛰️'
    expect(decodeBase64(encodeBase64(source))).toBe(source)
    expect(() => decodeBase64('%%%')).toThrow('Invalid Base64')
  })

  it('treats empty Base64 input as an empty round-trip', () => {
    expect(encodeBase64('')).toBe('')
    expect(decodeBase64('   ')).toBe('')
  })

  it('validates YAML and converts it to JSON', () => {
    expect(transformYaml('name: archive\nactive: true', 'to-json')).toContain(
      '"active": true',
    )
    expect(() => transformYaml('name: [', 'validate')).toThrow('Invalid YAML')
  })

  it('calculates IPv4 subnet boundaries including /31', () => {
    expect(calculateSubnet('192.168.10.42', 24)).toMatchObject({
      networkAddress: '192.168.10.0',
      broadcastAddress: '192.168.10.255',
      usableHosts: 254,
    })
    expect(calculateSubnet('10.0.0.4', 31).usableHosts).toBe(2)
    expect(() => calculateSubnet('999.1.1.1', 24)).toThrow('Invalid IPv4')
  })

  it('converts supported docker run flags to Kubernetes without executing input', () => {
    const output = convertDockerRun(
      'docker run --name archive -p 8080:80 -e MODE=static nginx:1.27',
    )
    expect(output).toContain('kind: Deployment')
    expect(output).toContain('kind: Service')
    expect(output).toContain('image: nginx:1.27')
    expect(output).toContain('port: 8080')
    expect(output).toContain('targetPort: 80')
    expect(output).toContain('name: MODE')
    expect(output).toContain('value: static')
    expect(() => convertDockerRun('rm -rf /')).toThrow('docker run')
    expect(() => convertDockerRun('docker run -p nope nginx')).toThrow(
      'published port',
    )
    expect(() =>
      convertDockerRun('docker run --restart unless-stopped nginx'),
    ).toThrow('Unsupported Docker option: --restart')
    expect(() => convertDockerRun('docker run --privileged nginx')).toThrow(
      'Unsupported Docker option: --privileged',
    )
  })

  it('formats timestamps and inspects Unicode code points', () => {
    expect(formatTimestamp('0').iso).toBe('1970-01-01T00:00:00.000Z')
    expect(inspectAscii('Aé')).toEqual([
      { character: 'A', codePoint: 65, hex: 'U+0041' },
      { character: 'é', codePoint: 233, hex: 'U+00E9' },
    ])
  })

  it('rejects blank, ambiguous, and out-of-range timestamps', () => {
    expect(() => formatTimestamp('  ')).toThrow('Timestamp is required')
    expect(formatTimestamp('9999999999').unixSeconds).toBe(9_999_999_999)
    expect(() => formatTimestamp('10000000000')).toThrow('Invalid timestamp')
    expect(formatTimestamp('100000000000').iso).toBe('1973-03-03T09:46:40.000Z')
    expect(() => formatTimestamp('8640000000000001')).toThrow(
      'Invalid timestamp',
    )
  })

  it('rejects oversized multibyte input before synchronous work or amplification', () => {
    expect(() => assertLabInputWithinLimits('🛰️'.repeat(20_000))).toThrow(
      'Input is too large',
    )
    expect(() => inspectAscii('A'.repeat(10_001))).toThrow(
      'Input is too complex',
    )
    expect(() => formatJson(`{"value":"${'a'.repeat(70_000)}"}`)).toThrow(
      'Input is too large',
    )
  })
})
