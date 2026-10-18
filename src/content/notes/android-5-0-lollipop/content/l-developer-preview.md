---
parentDomain: notes
parentId: notes-android-5-0-lollipop
documentId: l-developer-preview
locale: en
translationKey: android-5-0-lollipop-l-developer-preview
slug: l-developer-preview
title: 'L Developer Preview: Android before release'
summary: 26 June 2014. The first public preview of an Android release, build LPV79, for the Nexus 5, the Nexus 7 (2013) and the emulator, with no API level and no Play publishing.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

The L Developer Preview was the first time Google gave developers an Android
release before launch. Google announced it in the Google I/O keynote on
25 June 2014 and opened the downloads on 26 June. Its launch post says: "For
the first time since we launched Android, we're giving you early access to a
development version of an upcoming release."

|           |                                                                                    |
| --------- | ---------------------------------------------------------------------------------- |
| Released  | 26 June 2014 (the preview's release notes date it 25 June, the day of the keynote) |
| Build     | `LPV79` (`hammerhead-lpv79-preview`, `razor-lpv79-preview`)                        |
| Devices   | Nexus 5 (GSM/LTE) and Nexus 7 (2013) Wi-Fi, flashed by hand; emulator images       |
| API level | None. Apps compiled against it could not be published on Google Play               |
| SDK       | L Developer Preview SDK tools, 32-bit emulator image, Android TV emulator image    |

## What the L Developer Preview included

Google's posts list what developers could try months ahead: the Material
theme, lock-screen and heads-up notifications, document-centric Recents,
`JobScheduler` and Battery Historian (Project Volta), Bluetooth LE peripheral
mode, the `android.hardware.camera2` API, OpenGL ES 3.1 and the Android
Extension Pack, 64-bit ABIs, and ART as the default runtime. The 64-bit
emulator image was announced as "coming soon".

The preview's release notes warned that `camera2` and `android.bluetooth.le`
worked only on the Nexus 5, and that `AudioTrack.write(float[], …)` did not
work yet. Google said the APIs were not final and to "expect minor API
changes over time". Android Police's hands-on the same day found the new
lock screen and notification cards, but KitKat-style status bar icons and a
version shown only as "Android L".
