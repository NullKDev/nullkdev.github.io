---
parentDomain: notes
parentId: notes-android-13
documentId: developer-preview-2
locale: en
translationKey: android-13-developer-preview-2
slug: developer-preview-2
title: 'Android 13 Developer Preview 2: notifications'
summary: 17 March 2022. The second and last preview made posting notifications a runtime permission, POST_NOTIFICATIONS, and added COLRv1 emoji, LE Audio and MIDI 2.0.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 2 arrived on 17 March 2022, a week after the 12L feature
drop reached AOSP. Devices already on Developer Preview 1 got it over the air.

|                    |                                                                         |
| ------------------ | ----------------------------------------------------------------------- |
| Release date       | 17 March 2022                                                           |
| Build              | `TPP2.220218.010`                                                       |
| Security patch     | March 2022                                                              |
| Devices            | Pixel 4 to Pixel 6 Pro, as in Developer Preview 1; 64-bit emulator; GSI |
| How to get it      | Flash a system image, or OTA from Developer Preview 1                   |
| Platform stability | No                                                                      |

The change that defined the release landed here: `POST_NOTIFICATIONS`. Apps
targeting Android 13 had to ask before posting a notification, and the system
handled the upgrade flow for older targets. Google warned that this flow
would still be tuned.

The same build added an API to give back granted runtime permissions, the
`RECEIVER_EXPORTED` and `RECEIVER_NOT_EXPORTED` flags for context-registered
receivers (recommended, not required), `BODY_SENSORS_BACKGROUND`, the
Foreground Services Task Manager, prefetch jobs in `JobScheduler` and APK
Signature Scheme v3.1. For text it brought phrase-based Japanese wrapping with
`android:lineBreakWordStyle="phrase"`, taller line heights for non-Latin
scripts in apps targeting 13, text conversion APIs and COLRv1 vector emoji.
Built-in Bluetooth LE Audio and MIDI 2.0 over USB completed it.
