---
parentDomain: notes
parentId: notes-android-16
documentId: beta-1
locale: en
translationKey: android-16-beta-1
slug: beta-1
title: 'Android 16 Beta 1: adaptive apps, Live Updates'
summary: 23 January 2025. The first beta opened Android Beta and brought the large-screen resizability rule, ProgressStyle for Live Updates, the APV codec and mandatory predictive back.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 1 came out on 23 January 2025. It was the first Android 16 build for
early adopters: Pixel owners could enroll in Android Beta and get it over the
air, and phones on DP2 were updated automatically.

|                    |                                                                         |
| ------------------ | ----------------------------------------------------------------------- |
| Release date       | 23 January 2025                                                         |
| Build              | `BP22.250103.008`                                                       |
| Security patch     | January 2025                                                            |
| Devices            | Pixel 6 and newer, Pixel Fold and Pixel Tablet; 64-bit Android Emulator |
| How to get it      | OTA through Android Beta, or flash a system image                       |
| Platform stability | No; still expected in March 2025                                        |

## What Beta 1 added

- **Adaptive apps.** On displays wider than 600dp, apps targeting API 36
  have their orientation and resizability restrictions ignored. Games are
  exempt, and apps could opt out in 2025; Google said the 2026 release would
  remove the opt-out. The `UNIVERSAL_RESIZABLE_BY_DEFAULT` compat flag
  let developers test it without targeting 36.
- **Live Updates.** `Notification.ProgressStyle` arrived, with segments,
  points and custom icons. Google suggested it only for ride-sharing, food
  delivery and navigation.
- **Camera and media.** The APV codec for professional video, and
  `EXTENSION_NIGHT_MODE_INDICATOR`, which tells an app when to switch to a
  night mode camera session.
- **Vertical text.** `Paint.VERTICAL_TEXT_FLAG` for libraries that render
  vertical scripts.
- **Accessibility.** `setSupplementalDescription()` for view groups and
  `setFieldRequired()` for required form fields.
- **Ranging.** `RangingManager` measures distance and angle with Bluetooth
  channel sounding, Bluetooth RSSI, Ultra-Wideband or Wi-Fi round trip time.

## What Beta 1 changed

- **ART internals.** Code that reaches into ART's internal structures may
  break on Android 16, and on earlier versions that get ART updates through
  Google Play system updates.
- **Predictive back.** For apps targeting 36, `onBackPressed()` is no longer
  called; apps must migrate or opt out. With 3-button navigation, a long
  press on back now shows the predictive animation for migrated apps.
- **Fixed-rate scheduling.** For apps targeting 36, `scheduleAtFixedRate`
  runs at most one missed execution when the app returns.
- **Ordered broadcasts.** `android:priority` only orders receivers within one
  process.
