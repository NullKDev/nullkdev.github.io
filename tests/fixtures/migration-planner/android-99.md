---
title: 'Android 99: a fixture'
---

Intro paragraph that is not part of any section the planner reads.

## At a glance

|                       |                                 |
| --------------------- | ------------------------------- |
| Version               | Android 99 (and 99.1)           |
| API level             | 99                              |
| Name                  | Zabaione, internal, but visible |
| `Build.VERSION_CODES` | `ZABAIONE`                      |

### Android 99W, API 100

A watch variant that the planner ignores.

## Permissions

Android 99 changed one permission:

| Permission      | What changed in API 99 | What to declare                        | What to remove or limit      |
| --------------- | ---------------------- | -------------------------------------- | ---------------------------- |
| `POST_FIXTURES` | New runtime permission | `<uses-permission android:name="x" />` | `android:maxSdkVersion="98"` |
| `READ_FIXTURES` | Has no effect          | Keep it for older versions             | Nothing                      |

## What changed for your app

### All apps on Android 99

| Change                     | What to do                      | How to check |
| -------------------------- | ------------------------------- | ------------ |
| Pipes \| in a cell survive | See [Permissions](#permissions) |              |

### Apps targeting API 99

| Change                    | What to do                                | How to check               |
| ------------------------- | ----------------------------------------- | -------------------------- |
| Components must be strict | Set `android:exported` on every component | Lint `ExportedFixture`     |
| Alarms are fussier        | Use **inexact** alarms                    | `adb shell am compat list` |

### What changed for low-RAM fixtures

| Change           | What to do | How to check |
| ---------------- | ---------- | ------------ |
| Ignored entirely | Nothing    |              |

## Migrating to API 99

From `targetSdk 98` to 99, in this order:

1. **Update the toolchain.** Set `compileSdk 99`.
   Skipped, nothing compiles. Verify: the project builds.
2. **Mark components.** Add `android:exported`. Verify: lint
   `ExportedFixture`.
3. **Test** on a device, see the [Android 98 note](/notes/android-98/).

Skipping several levels at once: do each version's steps in order.

## What lasted

- Nothing in this list is read.
