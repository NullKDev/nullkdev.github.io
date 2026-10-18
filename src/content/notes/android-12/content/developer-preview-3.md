---
parentDomain: notes
parentId: notes-android-12
documentId: developer-preview-3
locale: en
translationKey: android-12-developer-preview-3
slug: developer-preview-3
title: 'Android 12 Developer Preview 3: splash screens'
summary: 21 April 2021. The last developer preview added the system splash screen, CallStyle notifications, SCHEDULE_EXACT_ALARM, new web link handling and the RenderScript deprecation.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 3 came out on 21 April 2021, four weeks before Google I/O.
It was the last developer-only build; Google asked for compatible app updates
"over the next few weeks", ahead of Beta 1.

|                    |                                                   |
| ------------------ | ------------------------------------------------- |
| Release date       | 21 April 2021                                     |
| Build              | `SPP3.210325.010`                                 |
| Security patch     | April 2021                                        |
| Devices            | Pixel 3, 3a, 4, 4a, 4a 5G and 5; Android Emulator |
| How to get it      | Flash or sideload; over the air from Preview 2    |
| Platform stability | No                                                |

Preview 3 brought the launch experience and the alarm rule:

- **Splash screens.** A launch animation and a splash screen with the app
  icon, on by default for every app, customizable through the new splash
  screen APIs.
- **`Notification.CallStyle`** for incoming, ongoing and screened calls.
- **`SCHEDULE_EXACT_ALARM`.** Apps targeting Android 12 had to declare it to
  set exact alarms. Google described it as a normal permission granted at
  first start that the user could revoke in "Special app access", and added
  `canScheduleExactAlarms()`.
- **Web links.** Links not verified as Android App Links or approved by the
  user opened in the default browser instead of a chooser.
- **Backup rules.** Apps targeting Android 12 got a new XML format with
  separate rules for cloud backup and device-to-device transfer.
- **Native crashes.** `ApplicationExitInfo.getTraceInputStream()` returned
  the tombstone of a `REASON_CRASH_NATIVE` exit as a protocol buffer.
- **Camera and media.** Camera2 vendor extensions, quad bayer sensor support
  and standard keys for video encoder quantization.

Google also deprecated RenderScript in favour of Vulkan and OpenGL, and made
Neural Networks API drivers updatable through Google Play services.
