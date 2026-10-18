---
parentDomain: notes
parentId: notes-android-12
documentId: developer-preview-1
locale: en
translationKey: android-12-developer-preview-1
slug: developer-preview-1
title: 'Android 12 Developer Preview 1: flash only'
summary: 18 February 2021. The first Android 12 build, for developers only, made android:exported and PendingIntent mutability mandatory and blocked background foreground service starts.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Google released the first developer preview of Android 12 on
18 February 2021, eight months before the Pixel rollout. Dave Burke's post
called it "just the start", and Android Beta was not open for it.

|                    |                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Release date       | 18 February 2021; Developer Preview 1.1 on 3 March 2021                                       |
| Build              | `SPP1.210122.020.A3`; 1.1 `SPP1.210122.022`                                                   |
| Security patch     | February 2021; 1.1 March 2021                                                                 |
| Devices            | Pixel 3, 3a, 4, 4a, 4a 5G and 5; 64-bit Android Emulator images; a separate Android TV build  |
| How to get it      | Flash a factory image, or sideload an OTA image on a Pixel running Android 11, without a wipe |
| Platform stability | No; Google expected it by August 2021                                                         |

The rules that later defined targeting API 31 were already here:
components with an intent filter had to declare `android:exported`, every
`PendingIntent` needed `FLAG_MUTABLE` or the new `FLAG_IMMUTABLE`, and
foreground services could no longer start from the background. To replace
them Google added expedited jobs to `JobScheduler` and WorkManager.
Notification trampolines were blocked for apps targeting the new platform,
and every app got a toast when it used one.

The build also brought compatible media transcoding from HEVC to AVC, AVIF
images, `OnReceiveContentListener` for rich content, haptics coupled to an
audio session, and WebView's `SameSite` cookie behaviour. The Netlink MAC
restriction from Android 11 now applied to every app, whatever its target.
ART became a Mainline module. Most behaviour changes could be toggled one by
one from Developer options or `adb`.

Developer Preview 1.1 fixed Wi-Fi drops, a System UI crash on screenshots
from the lock screen, battery drain from partial wake locks, and an
unresponsive fingerprint reader.
