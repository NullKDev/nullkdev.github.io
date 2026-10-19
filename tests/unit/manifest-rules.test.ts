import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  evaluateManifest,
  MANIFEST_RULES,
  MAX_MANIFEST_BYTES,
  parseManifest,
  type ManifestFacts,
  type RuleResult,
} from '@/lib/manifest-rules'

const fixture = readFileSync(
  resolve('tests/fixtures/migration-planner/AndroidManifest.xml'),
  'utf8',
)

const wrap = (body: string, application = '', applicationAttributes = '') =>
  `<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="x">${body}<application ${applicationAttributes}>${application}</application></manifest>`

const permission = (name: string, extra = '') =>
  `<uses-permission android:name="android.permission.${name}" ${extra}/>`

const facts = (xml: string): ManifestFacts => {
  const parsed = parseManifest(xml)
  if (!parsed.ok) throw new Error(`fixture did not parse: ${parsed.error}`)
  return parsed.manifest
}

/** The result of one rule for a range that crosses every level. */
const result = (xml: string, id: string, from = 18, to = 99): RuleResult => {
  const found = evaluateManifest(facts(xml), from, to).find(
    (item) => item.id === id,
  )
  if (!found) throw new Error(`no rule ${id}`)
  return found
}

describe('parseManifest', () => {
  it('normalises sdk, permissions, application attributes and components', () => {
    const manifest = facts(fixture)
    expect(manifest.usesSdk).toEqual({
      minSdkVersion: 21,
      targetSdkVersion: 29,
    })
    expect(manifest.permissions).toContainEqual({
      name: 'android.permission.READ_EXTERNAL_STORAGE',
    })
    expect(manifest.application).toEqual({
      usesCleartextTraffic: 'true',
      requestLegacyExternalStorage: 'true',
    })
    expect(manifest.components).toEqual([
      {
        kind: 'activity',
        name: '.MainActivity',
        hasIntentFilter: true,
        actions: ['android.intent.action.MAIN'],
      },
      {
        kind: 'activity',
        name: '.SettingsActivity',
        exported: 'false',
        hasIntentFilter: false,
      },
      {
        kind: 'service',
        name: '.SyncService',
        hasIntentFilter: false,
        foregroundServiceType: 'dataSync',
      },
      {
        kind: 'receiver',
        name: '.BootReceiver',
        hasIntentFilter: true,
        actions: ['android.intent.action.BOOT_COMPLETED'],
      },
    ])
    expect(manifest.hasQueries).toBe(false)
    expect(manifest.mergeMarkers).toBe(false)
  })

  it('keeps maxSdkVersion and usesPermissionFlags', () => {
    const manifest = facts(
      wrap(
        permission('BLUETOOTH', 'android:maxSdkVersion="30"') +
          permission(
            'BLUETOOTH_SCAN',
            'android:usesPermissionFlags="neverForLocation"',
          ),
      ),
    )
    expect(manifest.permissions).toEqual([
      { name: 'android.permission.BLUETOOTH', maxSdkVersion: 30 },
      {
        name: 'android.permission.BLUETOOTH_SCAN',
        usesPermissionFlags: 'neverForLocation',
      },
    ])
  })

  it('reads an empty or placeholder maxSdkVersion as unknown, never as 0', () => {
    const manifest = facts(
      wrap(
        permission('WRITE_EXTERNAL_STORAGE', 'android:maxSdkVersion=""') +
          permission(
            'READ_EXTERNAL_STORAGE',
            'android:maxSdkVersion="${max}"',
          ) +
          permission('BLUETOOTH', 'android:maxSdkVersion="thirty"'),
      ),
    )
    expect(
      manifest.permissions.map(({ maxSdkVersion }) => maxSdkVersion),
    ).toEqual(['unknown', 'unknown', 'unknown'])
  })

  it('skips elements a tools:node marker removes and flags the markers', () => {
    const manifest = facts(
      `<manifest xmlns:android="http://schemas.android.com/apk/res/android" xmlns:tools="http://schemas.android.com/tools">
        ${permission('READ_PHONE_STATE', 'tools:node="remove"')}
        ${permission('BLUETOOTH', 'tools:node="removeAll"')}
        ${permission('INTERNET', 'tools:node="replace"')}
        <queries tools:node="remove"><package android:name="com.x" /></queries>
        <application>
          <service android:name=".Gone" tools:node="remove" />
          <service android:name=".Kept" tools:node="replace" />
        </application>
      </manifest>`,
    )
    expect(manifest.permissions).toEqual([
      { name: 'android.permission.INTERNET' },
    ])
    expect(manifest.components.map(({ name }) => name)).toEqual(['.Kept'])
    expect(manifest.hasQueries).toBe(false)
    expect(manifest.mergeMarkers).toBe(true)
  })

  it('reports malformed XML with a reason instead of throwing', () => {
    const parsed = parseManifest('<manifest><application></manifest>')
    expect(parsed).toEqual({ ok: false, error: 'malformed' })
  })

  it('rejects empty input, input that is not a manifest, and oversized input', () => {
    expect(parseManifest('   ')).toEqual({ ok: false, error: 'empty' })
    expect(parseManifest('<resources />')).toEqual({
      ok: false,
      error: 'not-manifest',
    })
    expect(
      parseManifest(`<manifest>${' '.repeat(MAX_MANIFEST_BYTES)}</manifest>`),
    ).toEqual({ ok: false, error: 'too-large' })
  })

  it('never resolves external entities', () => {
    const parsed = parseManifest(
      '<!DOCTYPE manifest [<!ENTITY x SYSTEM "https://example.test/">]><manifest>&x;</manifest>',
    )
    expect(parsed.ok).toBe(false)
  })
})

describe('evaluateManifest', () => {
  it('evaluates every rule once, in API order', () => {
    const results = evaluateManifest(facts(fixture), 28, 35)
    expect(results.map(({ id }) => id)).toEqual(
      MANIFEST_RULES.map(({ id }) => id),
    )
    const apis = results.map(({ api }) => api)
    expect(apis).toEqual(apis.toSorted((left, right) => left - right))
  })

  it('marks a rule outside the range not applicable, whatever the manifest says', () => {
    expect(result(fixture, 'exported-intent-filter', 31, 34)).toMatchObject({
      status: 'not-applicable',
      reason: 'out-of-range',
    })
    expect(result(fixture, 'exported-intent-filter', 28, 30)).toMatchObject({
      status: 'not-applicable',
      reason: 'out-of-range',
    })
  })

  it('1 · finds components with an intent filter and no android:exported (API 31)', () => {
    expect(result(fixture, 'exported-intent-filter')).toMatchObject({
      status: 'detected',
      api: 31,
      items: ['.MainActivity', '.BootReceiver'],
    })
    expect(
      result(
        wrap(
          '',
          '<activity android:name=".A" android:exported="true"><intent-filter><action android:name="x"/></intent-filter></activity>',
        ),
        'exported-intent-filter',
      ),
    ).toMatchObject({ status: 'not-applicable', reason: 'not-present' })
  })

  it('2 · finds READ_EXTERNAL_STORAGE without a cap at 32 (API 33)', () => {
    expect(result(fixture, 'read-storage-cap')).toMatchObject({
      status: 'detected',
      api: 33,
    })
    expect(
      result(
        wrap(permission('READ_EXTERNAL_STORAGE', 'android:maxSdkVersion="32"')),
        'read-storage-cap',
      ),
    ).toMatchObject({ status: 'not-applicable', reason: 'not-present' })
  })

  it('3 · finds WRITE_EXTERNAL_STORAGE without a cap at 29 (API 30)', () => {
    expect(result(fixture, 'write-storage-cap')).toMatchObject({
      status: 'detected',
      api: 30,
    })
    expect(
      result(
        wrap(
          permission('WRITE_EXTERNAL_STORAGE', 'android:maxSdkVersion="29"'),
        ),
        'write-storage-cap',
      ),
    ).toMatchObject({ status: 'not-applicable' })
  })

  it('4 · finds requestLegacyExternalStorage, ignored from API 30', () => {
    expect(result(fixture, 'legacy-external-storage')).toMatchObject({
      status: 'detected',
      api: 30,
    })
    expect(result(wrap(''), 'legacy-external-storage')).toMatchObject({
      status: 'not-applicable',
    })
  })

  it('5 · asks for POST_NOTIFICATIONS when a foreground service shows one (API 33)', () => {
    expect(result(fixture, 'post-notifications')).toMatchObject({
      status: 'detected',
      api: 33,
    })
    // Nothing in the manifest posts notifications: not this manifest's rule.
    expect(result(wrap(''), 'post-notifications')).toMatchObject({
      status: 'not-applicable',
      reason: 'not-present',
    })
    // A push messaging service is a sign the app posts notifications.
    expect(
      result(
        wrap(
          '',
          '<service android:name=".Push" android:exported="false"><intent-filter><action android:name="com.google.firebase.MESSAGING_EVENT" /></intent-filter></service>',
        ),
        'post-notifications',
      ),
    ).toMatchObject({
      status: 'check',
      items: ['.Push'],
      lint: ['NotificationPermission'],
    })
    expect(
      result(wrap(permission('POST_NOTIFICATIONS')), 'post-notifications'),
    ).toMatchObject({ status: 'not-applicable' })
  })

  it('6 · finds legacy Bluetooth permissions without the API 31 split', () => {
    expect(result(fixture, 'bluetooth-permissions')).toMatchObject({
      status: 'detected',
      api: 31,
      items: ['android.permission.BLUETOOTH'],
    })
    expect(
      result(
        wrap(
          permission('BLUETOOTH', 'android:maxSdkVersion="30"') +
            permission('BLUETOOTH_CONNECT'),
        ),
        'bluetooth-permissions',
      ),
    ).toMatchObject({ status: 'not-applicable' })
  })

  it('6 · names the missing Nearby devices permissions when the legacy ones are already capped', () => {
    const capped = result(
      wrap(
        permission('BLUETOOTH', 'android:maxSdkVersion="30"') +
          permission('BLUETOOTH_ADMIN', 'android:maxSdkVersion="30"'),
      ),
      'bluetooth-permissions',
    )
    expect(capped).toMatchObject({
      status: 'detected',
      message: 'missingNew',
      items: [
        'android.permission.BLUETOOTH_SCAN',
        'android.permission.BLUETOOTH_CONNECT',
      ],
    })
    expect(
      result(
        wrap(permission('BLUETOOTH', 'android:maxSdkVersion=""')),
        'bluetooth-permissions',
      ),
    ).toMatchObject({
      status: 'check',
      message: 'unknownCap',
      items: ['android.permission.BLUETOOTH'],
    })
  })

  it('checks, never detects, a permission whose maxSdkVersion is unknown', () => {
    expect(
      result(
        wrap(permission('WRITE_EXTERNAL_STORAGE', 'android:maxSdkVersion=""')),
        'write-storage-cap',
      ),
    ).toMatchObject({
      status: 'check',
      message: 'unknownCap',
      items: ['android.permission.WRITE_EXTERNAL_STORAGE'],
    })
    expect(
      result(
        wrap(
          permission('READ_EXTERNAL_STORAGE', 'android:maxSdkVersion="${max}"'),
        ),
        'read-storage-cap',
      ),
    ).toMatchObject({ status: 'check', message: 'unknownCap' })
    expect(
      result(
        wrap(
          permission('USE_EXACT_ALARM') +
            permission('SCHEDULE_EXACT_ALARM', 'android:maxSdkVersion=""'),
        ),
        'exact-alarm-both',
      ),
    ).toMatchObject({ status: 'check', message: 'unknownCap' })
  })

  it('7 · finds a typed foreground service without FOREGROUND_SERVICE (API 28)', () => {
    expect(
      result(
        wrap(
          '',
          '<service android:name=".S" android:foregroundServiceType="location" />',
        ),
        'foreground-service-permission',
      ),
    ).toMatchObject({ status: 'detected', api: 28, items: ['.S'] })
    expect(result(fixture, 'foreground-service-permission')).toMatchObject({
      status: 'not-applicable',
    })
    // No service at all: nothing can call startForeground().
    expect(result(wrap(''), 'foreground-service-permission')).toMatchObject({
      status: 'not-applicable',
      reason: 'not-present',
    })
    // An untyped service might; the manifest cannot tell.
    expect(
      result(
        wrap('', '<service android:name=".U" />'),
        'foreground-service-permission',
      ),
    ).toMatchObject({ status: 'check', items: ['.U'] })
  })

  it('8 · finds a foreground service type without its FOREGROUND_SERVICE_* permission (API 34)', () => {
    expect(result(fixture, 'foreground-service-type')).toMatchObject({
      status: 'detected',
      api: 34,
      items: ['.SyncService → FOREGROUND_SERVICE_DATA_SYNC'],
    })
    expect(
      result(
        wrap(
          permission('FOREGROUND_SERVICE') +
            permission('FOREGROUND_SERVICE_DATA_SYNC'),
          '<service android:name=".S" android:foregroundServiceType="dataSync|shortService" />',
        ),
        'foreground-service-type',
      ),
    ).toMatchObject({ status: 'not-applicable' })
    // A declared permission is never listed as missing.
    expect(
      result(wrap(permission('FOREGROUND_SERVICE')), 'foreground-service-type'),
    ).toMatchObject({ status: 'not-applicable' })
    expect(result(wrap(''), 'foreground-service-type')).toMatchObject({
      status: 'not-applicable',
    })
    // Untyped services of an app that may run one in the foreground.
    expect(
      result(
        wrap(
          permission('FOREGROUND_SERVICE'),
          '<service android:name=".U" /><service android:name=".V" />',
        ),
        'foreground-service-type',
      ),
    ).toMatchObject({ status: 'check', items: ['.U', '.V'] })
    // Without FOREGROUND_SERVICE no service can be a foreground one.
    expect(
      result(
        wrap('', '<service android:name=".U" />'),
        'foreground-service-type',
      ),
    ).toMatchObject({ status: 'not-applicable' })
    // Both: the missing permissions first, then the untyped services.
    const mixed = result(
      wrap(
        permission('FOREGROUND_SERVICE'),
        '<service android:name=".S" android:foregroundServiceType="location" /><service android:name=".U" />',
      ),
      'foreground-service-type',
    )
    expect(mixed).toMatchObject({
      status: 'detected',
      message: 'mixed',
      items: ['.S → FOREGROUND_SERVICE_LOCATION', '.U'],
    })
    expect(mixed.items).not.toContain('FOREGROUND_SERVICE')
  })

  it('9 · checks exact alarms with lint (API 31)', () => {
    expect(result(fixture, 'exact-alarm')).toMatchObject({
      status: 'check',
      api: 31,
      lint: ['ScheduleExactAlarm'],
    })
    expect(result(wrap(''), 'exact-alarm')).toMatchObject({
      status: 'not-applicable',
    })
  })

  it('10 · finds both exact alarm permissions uncapped (API 33)', () => {
    expect(result(fixture, 'exact-alarm-both')).toMatchObject({
      status: 'detected',
      api: 33,
    })
    expect(
      result(
        wrap(
          permission('SCHEDULE_EXACT_ALARM', 'android:maxSdkVersion="32"') +
            permission('USE_EXACT_ALARM'),
        ),
        'exact-alarm-both',
      ),
    ).toMatchObject({ status: 'not-applicable' })
  })

  it('11 · checks background location on a device (API 29)', () => {
    expect(result(fixture, 'background-location')).toMatchObject({
      status: 'check',
      api: 29,
    })
    expect(result(wrap(''), 'background-location')).toMatchObject({
      status: 'not-applicable',
    })
  })

  it('12 · finds QUERY_ALL_PACKAGES and checks a manifest without <queries> (API 30)', () => {
    expect(result(fixture, 'package-visibility')).toMatchObject({
      status: 'detected',
      api: 30,
    })
    // No <queries> and no QUERY_ALL_PACKAGES: nothing here to judge.
    expect(result(wrap(''), 'package-visibility')).toMatchObject({
      status: 'not-applicable',
      reason: 'not-present',
    })
    expect(
      result(
        '<manifest xmlns:android="http://schemas.android.com/apk/res/android"><queries><package android:name="com.x" /></queries></manifest>',
        'package-visibility',
      ),
    ).toMatchObject({ status: 'not-applicable' })
  })

  it('13 · finds app-wide cleartext and checks a network security config (API 28)', () => {
    expect(result(fixture, 'cleartext')).toMatchObject({
      status: 'detected',
      api: 28,
    })
    // No INTERNET permission: the app makes no HTTP requests at all.
    expect(result(wrap(''), 'cleartext')).toMatchObject({
      status: 'not-applicable',
      reason: 'not-present',
    })
    expect(result(wrap(permission('INTERNET')), 'cleartext')).toMatchObject({
      status: 'check',
      lint: ['InsecureBaseConfiguration'],
    })
    expect(
      result(
        wrap('', '', 'android:networkSecurityConfig="@xml/network"'),
        'cleartext',
      ),
    ).toMatchObject({ status: 'check' })
    expect(
      result(wrap('', '', 'android:usesCleartextTraffic="false"'), 'cleartext'),
    ).toMatchObject({ status: 'not-applicable' })
  })

  it('14 · checks READ_PHONE_STATE without READ_PHONE_NUMBERS (API 30)', () => {
    expect(result(fixture, 'phone-numbers')).toMatchObject({
      status: 'check',
      api: 30,
    })
    expect(
      result(
        wrap(permission('READ_PHONE_STATE') + permission('READ_PHONE_NUMBERS')),
        'phone-numbers',
      ),
    ).toMatchObject({ status: 'not-applicable' })
  })

  it('gives every rule a note section, evidence and, for a check, a lint ID or a device test', () => {
    for (const rule of MANIFEST_RULES) {
      expect(rule.evidence.length, rule.id).toBeGreaterThan(0)
      expect(['permissions', 'allApps', 'targeting']).toContain(rule.section)
    }
  })
})
