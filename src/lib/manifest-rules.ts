/**
 * Deterministic checks of a merged `AndroidManifest.xml`, run in the browser.
 *
 * The manifest is parsed with the browser's own `DOMParser`; nothing is
 * uploaded or executed. Every rule is tied to the version note that explains
 * it: `api` is the level where the change starts to matter, `section` names the
 * note table that documents it, and `evidence` lists the identifiers that table
 * must contain (tests/content/migration-planner.test.ts holds each rule to its
 * note in both languages, and checks that every lint ID named here is one the
 * notes name).
 *
 * A rule answers for one from→to range:
 * - `detected`: the manifest shows the problem.
 * - `check`: the manifest cannot decide it; run the named lint check or test.
 * - `not-applicable`: the range does not cross the rule's level, or the
 *   manifest has nothing the rule is about.
 */

export const ANDROID_NS = 'http://schemas.android.com/apk/res/android'

/** A merged manifest is a few hundred kilobytes at most. */
export const MAX_MANIFEST_BYTES = 2 * 1024 * 1024

export interface ManifestPermission {
  readonly name: string
  readonly maxSdkVersion?: number
  readonly usesPermissionFlags?: string
}

export interface ManifestComponent {
  readonly kind: 'activity' | 'activity-alias' | 'service' | 'receiver'
  readonly name: string
  readonly exported?: string
  readonly hasIntentFilter: boolean
  readonly foregroundServiceType?: string
}

export interface ManifestFacts {
  readonly usesSdk?: {
    readonly minSdkVersion?: number
    readonly targetSdkVersion?: number
  }
  readonly permissions: readonly ManifestPermission[]
  readonly application: {
    readonly usesCleartextTraffic?: string
    readonly networkSecurityConfig?: string
    readonly requestLegacyExternalStorage?: string
  }
  readonly components: readonly ManifestComponent[]
  readonly hasQueries: boolean
}

export type ManifestError = 'empty' | 'too-large' | 'malformed' | 'not-manifest'

export type ParsedManifest =
  | { readonly ok: true; readonly manifest: ManifestFacts }
  | { readonly ok: false; readonly error: ManifestError }

const COMPONENT_KINDS = [
  'activity',
  'activity-alias',
  'service',
  'receiver',
] as const

/** `android:x` read through the namespace, or by its literal prefix. */
const attribute = (element: Element, name: string): string | undefined =>
  element.getAttributeNS(ANDROID_NS, name) ??
  element.getAttribute(`android:${name}`) ??
  undefined

const integer = (value: string | undefined): number | undefined => {
  const parsed = Number(value)
  return value !== undefined && Number.isInteger(parsed) ? parsed : undefined
}

const defined = <T extends object>(value: T): T =>
  Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  ) as T

/**
 * Reads a pasted manifest into plain facts. Never throws: malformed input
 * comes back as an error code the page can explain.
 */
export const parseManifest = (
  xml: string,
  parser: DOMParser = new DOMParser(),
): ParsedManifest => {
  if (!xml.trim()) return { ok: false, error: 'empty' }
  if (new TextEncoder().encode(xml).byteLength > MAX_MANIFEST_BYTES) {
    return { ok: false, error: 'too-large' }
  }
  // A merged manifest never carries a DTD. Refusing one keeps entity
  // expansion out of the question, whatever the browser's parser would do.
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) return { ok: false, error: 'malformed' }

  let document: Document
  try {
    document = parser.parseFromString(xml, 'application/xml')
  } catch {
    return { ok: false, error: 'malformed' }
  }
  if (document.getElementsByTagName('parsererror').length > 0) {
    return { ok: false, error: 'malformed' }
  }
  const root = document.documentElement
  if (!root || root.localName !== 'manifest') {
    return { ok: false, error: 'not-manifest' }
  }

  const children = (parent: Element, name: string) =>
    [...parent.children].filter((child) => child.localName === name)

  const usesSdk = children(root, 'uses-sdk')[0]
  const application = children(root, 'application')[0]

  const permissions = [
    ...children(root, 'uses-permission'),
    ...children(root, 'uses-permission-sdk-23'),
  ].map((element) =>
    defined({
      name: attribute(element, 'name') ?? '',
      maxSdkVersion: integer(attribute(element, 'maxSdkVersion')),
      usesPermissionFlags: attribute(element, 'usesPermissionFlags'),
    }),
  )

  const components = application
    ? [...application.children]
        .filter((child): child is Element =>
          (COMPONENT_KINDS as readonly string[]).includes(child.localName),
        )
        .map((element) =>
          defined({
            kind: element.localName as ManifestComponent['kind'],
            name: attribute(element, 'name') ?? '',
            exported: attribute(element, 'exported'),
            hasIntentFilter: children(element, 'intent-filter').length > 0,
            foregroundServiceType: attribute(element, 'foregroundServiceType'),
          }),
        )
    : []

  return {
    ok: true,
    manifest: defined({
      usesSdk: usesSdk
        ? defined({
            minSdkVersion: integer(attribute(usesSdk, 'minSdkVersion')),
            targetSdkVersion: integer(attribute(usesSdk, 'targetSdkVersion')),
          })
        : undefined,
      permissions,
      application: application
        ? defined({
            usesCleartextTraffic: attribute(
              application,
              'usesCleartextTraffic',
            ),
            networkSecurityConfig: attribute(
              application,
              'networkSecurityConfig',
            ),
            requestLegacyExternalStorage: attribute(
              application,
              'requestLegacyExternalStorage',
            ),
          })
        : {},
      components,
      hasQueries: children(root, 'queries').length > 0,
    }),
  }
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

export type RuleStatus = 'detected' | 'check' | 'not-applicable'

/** Why a rule reached its status, so the page can say it in words. */
export type RuleReason =
  'found' | 'cannot-tell' | 'not-present' | 'out-of-range'

interface Verdict {
  readonly status: 'detected' | 'check' | 'clear'
  readonly items?: readonly string[]
}

export interface ManifestRule {
  readonly id: string
  /** The level where the change starts to matter. */
  readonly api: number
  /** The table of that level's note that documents the change. */
  readonly section: 'permissions' | 'allApps' | 'targeting'
  /** Identifiers the note at `api` must contain for this rule to stand. */
  readonly evidence: readonly string[]
  /** Lint checks the notes name for this change. */
  readonly lint?: readonly string[]
  readonly evaluate: (manifest: ManifestFacts) => Verdict
}

export interface RuleResult {
  readonly id: string
  readonly api: number
  readonly section: ManifestRule['section']
  readonly lint: readonly string[]
  readonly status: RuleStatus
  readonly reason: RuleReason
  readonly items: readonly string[]
}

const PERMISSION = 'android.permission.'

const find = (manifest: ManifestFacts, name: string) =>
  manifest.permissions.find(
    (permission) => permission.name === `${PERMISSION}${name}`,
  )

const has = (manifest: ManifestFacts, name: string) =>
  find(manifest, name) !== undefined

/** Declared and not capped at or below `cap`. */
const uncapped = (manifest: ManifestFacts, name: string, cap: number) => {
  const permission = find(manifest, name)
  return (
    permission !== undefined &&
    (permission.maxSdkVersion === undefined || permission.maxSdkVersion > cap)
  )
}

const typedServices = (manifest: ManifestFacts) =>
  manifest.components.filter(
    (component) =>
      component.kind === 'service' && component.foregroundServiceType,
  )

/** `dataSync` → `FOREGROUND_SERVICE_DATA_SYNC`, the permission per type. */
const typePermission = (type: string) =>
  `FOREGROUND_SERVICE_${type.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase()}`

const clear: Verdict = { status: 'clear' }

/** In API order: the order a reader meets them crossing levels. */
export const MANIFEST_RULES: readonly ManifestRule[] = [
  {
    id: 'cleartext',
    api: 28,
    section: 'targeting',
    evidence: ['cleartextTrafficPermitted', 'InsecureBaseConfiguration'],
    lint: ['InsecureBaseConfiguration'],
    evaluate: ({ application }) => {
      if (application.usesCleartextTraffic === 'true') {
        return { status: 'detected', items: ['android:usesCleartextTraffic'] }
      }
      if (application.usesCleartextTraffic === 'false') return clear
      return {
        status: 'check',
        items: application.networkSecurityConfig
          ? [application.networkSecurityConfig]
          : [],
      }
    },
  },
  {
    id: 'foreground-service-permission',
    api: 28,
    section: 'permissions',
    evidence: ['FOREGROUND_SERVICE', 'startForeground()'],
    evaluate: (manifest) => {
      if (has(manifest, 'FOREGROUND_SERVICE')) return clear
      const services = typedServices(manifest)
      return services.length
        ? { status: 'detected', items: services.map(({ name }) => name) }
        : { status: 'check' }
    },
  },
  {
    id: 'background-location',
    api: 29,
    section: 'permissions',
    evidence: ['ACCESS_BACKGROUND_LOCATION'],
    evaluate: (manifest) =>
      has(manifest, 'ACCESS_BACKGROUND_LOCATION') ? { status: 'check' } : clear,
  },
  {
    id: 'legacy-external-storage',
    api: 30,
    section: 'targeting',
    evidence: ['requestLegacyExternalStorage', 'ScopedStorage'],
    lint: ['ScopedStorage'],
    evaluate: ({ application }) =>
      application.requestLegacyExternalStorage === 'true'
        ? {
            status: 'detected',
            items: ['android:requestLegacyExternalStorage'],
          }
        : clear,
  },
  {
    id: 'write-storage-cap',
    api: 30,
    section: 'permissions',
    evidence: ['WRITE_EXTERNAL_STORAGE', 'android:maxSdkVersion="29"'],
    lint: ['ScopedStorage'],
    evaluate: (manifest) =>
      uncapped(manifest, 'WRITE_EXTERNAL_STORAGE', 29)
        ? {
            status: 'detected',
            items: [`${PERMISSION}WRITE_EXTERNAL_STORAGE`],
          }
        : clear,
  },
  {
    id: 'package-visibility',
    api: 30,
    section: 'targeting',
    evidence: ['<queries>', 'QueryPermissionsNeeded', 'QUERY_ALL_PACKAGES'],
    lint: ['QueryPermissionsNeeded'],
    evaluate: (manifest) => {
      if (has(manifest, 'QUERY_ALL_PACKAGES')) {
        return {
          status: 'detected',
          items: [`${PERMISSION}QUERY_ALL_PACKAGES`],
        }
      }
      return manifest.hasQueries ? clear : { status: 'check' }
    },
  },
  {
    id: 'phone-numbers',
    api: 30,
    section: 'permissions',
    evidence: ['READ_PHONE_NUMBERS', 'android:maxSdkVersion="29"'],
    evaluate: (manifest) =>
      has(manifest, 'READ_PHONE_STATE') && !has(manifest, 'READ_PHONE_NUMBERS')
        ? { status: 'check' }
        : clear,
  },
  {
    id: 'exported-intent-filter',
    api: 31,
    section: 'targeting',
    evidence: ['android:exported', 'IntentFilterExportedReceiver'],
    lint: ['IntentFilterExportedReceiver'],
    evaluate: ({ components }) => {
      const missing = components.filter(
        (component) => component.hasIntentFilter && !component.exported,
      )
      return missing.length
        ? { status: 'detected', items: missing.map(({ name }) => name) }
        : clear
    },
  },
  {
    id: 'bluetooth-permissions',
    api: 31,
    section: 'permissions',
    evidence: [
      'BLUETOOTH_SCAN',
      'BLUETOOTH_CONNECT',
      'android:maxSdkVersion="30"',
    ],
    evaluate: (manifest) => {
      const legacy = ['BLUETOOTH', 'BLUETOOTH_ADMIN'].filter((name) =>
        uncapped(manifest, name, 30),
      )
      const declaresNew = [
        'BLUETOOTH_SCAN',
        'BLUETOOTH_CONNECT',
        'BLUETOOTH_ADVERTISE',
      ].some((name) => has(manifest, name))
      const hasLegacy = ['BLUETOOTH', 'BLUETOOTH_ADMIN'].some((name) =>
        has(manifest, name),
      )
      if (legacy.length) {
        return {
          status: 'detected',
          items: legacy.map((name) => `${PERMISSION}${name}`),
        }
      }
      return hasLegacy && !declaresNew
        ? { status: 'detected', items: [`${PERMISSION}BLUETOOTH_CONNECT`] }
        : clear
    },
  },
  {
    id: 'exact-alarm',
    api: 31,
    section: 'targeting',
    evidence: ['SCHEDULE_EXACT_ALARM', 'ScheduleExactAlarm'],
    lint: ['ScheduleExactAlarm'],
    evaluate: (manifest) =>
      has(manifest, 'SCHEDULE_EXACT_ALARM') ? { status: 'check' } : clear,
  },
  {
    id: 'exact-alarm-both',
    api: 33,
    section: 'permissions',
    evidence: [
      'USE_EXACT_ALARM',
      'SCHEDULE_EXACT_ALARM',
      'android:maxSdkVersion="32"',
    ],
    evaluate: (manifest) =>
      has(manifest, 'USE_EXACT_ALARM') &&
      uncapped(manifest, 'SCHEDULE_EXACT_ALARM', 32)
        ? {
            status: 'detected',
            items: [`${PERMISSION}SCHEDULE_EXACT_ALARM`],
          }
        : clear,
  },
  {
    id: 'post-notifications',
    api: 33,
    section: 'permissions',
    evidence: ['POST_NOTIFICATIONS', 'NotificationPermission'],
    lint: ['NotificationPermission'],
    evaluate: (manifest) => {
      if (has(manifest, 'POST_NOTIFICATIONS')) return clear
      // A foreground service always posts a notification; without the
      // permission it shows only in the Task Manager (Android 13 note).
      const foreground =
        has(manifest, 'FOREGROUND_SERVICE') || typedServices(manifest).length
      return foreground
        ? { status: 'detected', items: [`${PERMISSION}POST_NOTIFICATIONS`] }
        : { status: 'check' }
    },
  },
  {
    id: 'read-storage-cap',
    api: 33,
    section: 'permissions',
    evidence: ['READ_EXTERNAL_STORAGE', 'android:maxSdkVersion="32"'],
    lint: ['ScopedStorage'],
    evaluate: (manifest) =>
      uncapped(manifest, 'READ_EXTERNAL_STORAGE', 32)
        ? {
            status: 'detected',
            items: [`${PERMISSION}READ_EXTERNAL_STORAGE`],
          }
        : clear,
  },
  {
    id: 'foreground-service-type',
    api: 34,
    section: 'targeting',
    evidence: [
      'foregroundServiceType',
      'FOREGROUND_SERVICE_*',
      'ForegroundServiceType',
    ],
    lint: ['ForegroundServiceType', 'ForegroundServicePermission'],
    evaluate: (manifest) => {
      const services = typedServices(manifest)
      if (services.length === 0) {
        return has(manifest, 'FOREGROUND_SERVICE')
          ? { status: 'detected', items: ['FOREGROUND_SERVICE'] }
          : clear
      }
      // `shortService` needs no type permission (Android 14 note).
      const missing = services.flatMap(({ name, foregroundServiceType }) =>
        (foregroundServiceType ?? '')
          .split('|')
          .map((type) => type.trim())
          .filter((type) => type && type !== 'shortService')
          .map(typePermission)
          .filter((permission) => !has(manifest, permission))
          .map((permission) => `${name} → ${permission}`),
      )
      return missing.length ? { status: 'detected', items: missing } : clear
    },
  },
]

/** Every rule's answer for one manifest and one from→to range. */
export const evaluateManifest = (
  manifest: ManifestFacts,
  from: number,
  to: number,
): RuleResult[] =>
  MANIFEST_RULES.map((rule) => {
    const base = {
      id: rule.id,
      api: rule.api,
      section: rule.section,
      lint: rule.lint ?? [],
    }
    if (rule.api <= from || rule.api > to) {
      return {
        ...base,
        status: 'not-applicable',
        reason: 'out-of-range',
        items: [],
      }
    }
    const verdict = rule.evaluate(manifest)
    return {
      ...base,
      status: verdict.status === 'clear' ? 'not-applicable' : verdict.status,
      reason:
        verdict.status === 'detected'
          ? 'found'
          : verdict.status === 'check'
            ? 'cannot-tell'
            : 'not-present',
      items: verdict.items ?? [],
    }
  })
