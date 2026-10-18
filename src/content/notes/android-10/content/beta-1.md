---
parentDomain: notes
parentId: notes-android-10
documentId: beta-1
locale: en
translationKey: android-10-beta-1
slug: beta-1
title: 'Android Q Beta 1: the privacy changes first'
summary: 13 March 2019. The first Android Q build, for every Pixel generation, shipped the location, storage, background-start and identifier changes six months before release.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google released Android Q Beta 1 on 13 March 2019, almost six months before
the final release. Dave Burke's post called it "Beta 1 of Android Q for early
adopters and a preview SDK for developers". There was no separate developer
preview: the first public build was already in the Android Beta program.

|                    |                                                                                 |
| ------------------ | ------------------------------------------------------------------------------- |
| Release date       | 13 March 2019                                                                   |
| Build              | `QPP1.190205.018.B4`, March 2019 security patch                                 |
| Devices            | Pixel, Pixel XL, Pixel 2, Pixel 2 XL, Pixel 3 and Pixel 3 XL; Android Emulator  |
| How to get it      | Over the air through Android Beta, or by flashing the downloadable system image |
| Platform stability | No; preview SDK with APIs still changing                                        |

The original Pixel was included, which Google said it had extended "by
popular demand". To build against the preview, the release notes set
`compileSdkVersion "android-Q"` and `targetSdkVersion "Q"` with Android Studio
3.3 or newer.

Google put the privacy changes in the first build so developers had the most
time to adapt. Location gained the "all the time" versus "only while the app
is in use" choice. Scoped storage moved shared files behind new permissions
for the Photos and Videos and the Audio collections, and Downloads behind the
system file picker. Apps in the background could no longer start an activity;
the fallback was a high-priority notification with a full-screen intent.
Access to IMEI, serial number and similar non-resettable identifiers was
restricted, and MAC randomisation per Wi-Fi network became the default.

The developer APIs in Beta 1 included sharing shortcuts, the
`Settings.Panel` actions, Wi-Fi network specifiers and suggestions that need
no location permission, low-latency Wi-Fi locks, the Dynamic Depth photo
format, AV1, Opus and HDR10+, a native MIDI API, experimental ANGLE on Vulkan,
Neural Networks API 1.2 with 60 new operations, passive biometrics in
`BiometricPrompt`, and TLS 1.3 on by default. New non-SDK interface
restrictions applied only to apps targeting Q, and apps targeting an API level
below 23 now showed a warning dialog on first run.

Two details were reversed later. Beta 1 changed the default of
`android:extractNativeLibs` to `false`; Beta 2 set it back to `true`. The
system-wide dark theme was missing: 9to5Google found no dark mode setting at
all in the build, and Google added it in Beta 3.
