---
parentDomain: notes
parentId: notes-android-12l
documentId: developer-preview-1
locale: en
translationKey: android-12l-developer-preview-1
slug: developer-preview-1
title: '12L Developer Preview 1: emulator only'
summary: 27 October 2021. Announced at Android Dev Summit, the first 12L build ran only in the emulator, with the taskbar, two-column UI and provisional API level Sv2.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google announced 12L at Android Dev Summit on 27 October 2021 and released
Developer Preview 1 the same day. It was for developers only, and it ran only
in the Android Emulator: phones did not get it.

|                    |                                                                               |
| ------------------ | ----------------------------------------------------------------------------- |
| Release date       | 27 October 2021                                                               |
| Build              | `SPP4.211001.003`                                                             |
| Security patch     | October 2021                                                                  |
| Devices            | Android Emulator (x86 64-bit and ARM v8-A); later the Lenovo Tab P12 Pro      |
| Platform stability | No; provisional API level `Sv2`, and Google expected API changes before final |

The build already had what 12L is known for: the two-column notification
shade and lock screen on screens above 600dp, the taskbar with drag-and-drop
into split screen, and letterboxing that device makers can customise. Dave
Burke's post promised no breaking changes, so Google would not require apps
to target 12L.

To use the new APIs, an app had to set `compileSdkVersion`,
`targetSdkVersion` and `minSdkVersion` to `"Sv2"`. Google Play blocked
publishing apps that targeted `Sv2`. Google's advice was to test the current
app in split screen with windows of several sizes and in the new
compatibility mode. Lenovo later offered the same Developer Preview 1 for its
Tab P12 Pro, the first real tablet that could run 12L.
