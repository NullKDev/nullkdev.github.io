---
parentDomain: notes
parentId: notes-android-9-pie
documentId: developer-preview-1
locale: en
translationKey: android-9-pie-developer-preview-1
slug: developer-preview-1
title: 'Android P Developer Preview 1: first build'
summary: 7 March 2018. A flash-only build for developers that already had cutout support, the idle-app limits on camera and mic, cleartext blocked by default and the first non-SDK warnings.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google released the first developer preview of "Android P" on 7 March 2018,
five months before the final release. Dave Burke called it "an early
baseline build for developers only" and promised more for Google I/O in May.

|                    |                                                                                  |
| ------------------ | -------------------------------------------------------------------------------- |
| Release date       | 7 March 2018                                                                     |
| Build              | `PPP1.180208.014`, as reported by Droid Life; AOSP tags it `android-p-preview-1` |
| Devices            | Pixel, Pixel XL, Pixel 2 and Pixel 2 XL; Android Emulator                        |
| How to get it      | Manual download and flash only; Android Beta was not open for P                  |
| Platform stability | No; APIs still changing                                                          |

The build brought Wi-Fi RTT (IEEE 802.11mc) for indoor positioning, display
cutout support with `getDisplayCutout()` and `layoutInDisplayCutoutMode`, a
developer option that simulates a cutout, richer `MessagingStyle`
notifications, the multi-camera API, `ImageDecoder` and
`AnimatedImageDrawable`, HDR VP9 and HEIF encoding, data-cost hints for
`JobScheduler`, Neural Networks API 1.1, and the GlobalPlatform Open Mobile
API for secure elements.

Several defining behaviour changes were already in place. Idle apps lost the
microphone, camera and sensors. Network Security Configuration blocked
cleartext traffic by default. `Build.SERIAL` moved behind
`READ_PHONE_STATE`, and installing an app targeting below API 17 showed a
warning dialog. Calls into restricted non-SDK interfaces showed a toast and
a log line. Fingerprint authentication used a new `FingerprintDialog` API,
which the next milestone replaced.
