---
parentDomain: notes
parentId: notes-android-16
documentId: developer-preview-2
locale: en
translationKey: android-16-developer-preview-2
slug: developer-preview-2
title: 'Android 16 Developer Preview 2: jobs and traces'
summary: 18 December 2024. The second preview added system-triggered profiling, job pending reasons and richer haptics, and brought the first JobScheduler behaviour changes.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, performance]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 2 came out on 18 December 2024. Google said its changes were
"designed to enhance the app experience, improve battery life, and boost
performance while minimizing incompatibilities". Phones on DP1 got it over the air; it was
still a developer-only build.

|                    |                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Release date       | 18 December 2024                                                                           |
| Build              | `BP21.241121.009`                                                                          |
| Security patch     | December 2024                                                                              |
| Devices            | Pixel 6 and newer, Pixel Fold and Pixel Tablet; 64-bit Android Emulator images             |
| How to get it      | Flash a system image, or OTA from DP1. Android 15 QPR Beta 2 could flash it without a wipe |
| Platform stability | No; still expected in March 2025                                                           |

## What Developer Preview 2 added

- **System-triggered profiling.** `ProfilingManager.addProfilingTriggers()`
  asks the system to capture a trace on a cold start (`onFullyDrawn`) or an
  ANR, cases an app cannot trace itself.
- **Start component.** `ApplicationStartInfo.getStartComponent()` says which
  kind of component started the process.
- **Job introspection.** `JobScheduler.getPendingJobReasons(int)` returns
  every reason a job is waiting, and `getPendingJobReasonsHistory(int)` the
  recent constraint changes.
- **Adaptive refresh rate.** `hasArrSupport()` and
  `getSuggestedFrameRate(int)` arrived, and `getSupportedRefreshRates()` was
  restored.
- **Richer haptics.** Apps can define the amplitude and frequency curves of a
  haptic effect, independent of the device's actuator.
- **Predictive back.** `PRIORITY_SYSTEM_NAVIGATION_OBSERVER` lets an app see
  system-handled back gestures, and `finishAndRemoveTaskCallback()` and
  `moveTaskToBackCallback()` trigger system animations.
- **Other.** Cloud search APIs for the photo picker; secure Wi-Fi ranging
  with 802.11az, with AES-256 encryption and protection against
  man-in-the-middle attacks; and an `ACTIVITY_INTENSITY` data type in Health
  Connect.

## What Developer Preview 2 changed

- **Job quotas.** Regular and expedited job runtime now depends on the
  standby bucket, and also counts while the app is visible or running a
  foreground service.
- **`setImportantWhileForeground()`.** Deprecated since Android 12, it is now
  ignored, and `isImportantWhileForeground()` returns `false`.
- **Accessibility announcements.** `announceForAccessibility()` and
  `TYPE_ANNOUNCEMENT` events are deprecated in favour of pane titles, live
  regions and `setError()`.

The build also fixed a Terminal app error, "No local assets", reported on
DP1.
