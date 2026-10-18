---
parentDomain: notes
parentId: notes-android-14
documentId: developer-preview-1
locale: en
translationKey: android-14-developer-preview-1
slug: developer-preview-1
title: 'Android 14 Developer Preview 1: typed services'
summary: '8 February 2023. The first Android 14 build, for developers only, required foreground service types, blocked installs below target 23 and denied exact alarms by default.'
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Google released the first developer preview of Android 14 on
8 February 2023, eight months before the Pixel rollout. Dave Burke's post
called it "just the beginning", and the Android Beta program was not open for
it.

|                    |                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------- |
| Release date       | 8 February 2023                                                                    |
| Build              | `UPP1.230113.009`                                                                  |
| Security patch     | February 2023                                                                      |
| Devices            | Pixel 4a (5G), 5, 5a 5G, 6, 6 Pro, 6a, 7 and 7 Pro; 64-bit Android Emulator images |
| How to get it      | Flash a system image by hand; later previews and betas then arrived over the air   |
| Platform stability | No; Google expected it in June 2023                                                |

Most of what defines targeting API 34 was already here. Foreground services
had to declare a type, and a new user-initiated data transfer job took over
large downloads and uploads. Context-registered broadcasts were queued while an
app was cached. Newly installed apps targeting 33 or higher lost the
pre-granted `SCHEDULE_EXACT_ALARM`; clock and calendar apps could declare
`USE_EXACT_ALARM` instead.

Apps with a `targetSdkVersion` below 23 could no longer be installed, and
`adb install --bypass-low-target-sdk-block` existed for testing from day one.
Runtime receivers had to say whether they were exported, implicit intents
stopped reaching internal components, and dynamically loaded code had to be
read-only.

The build also brought fonts up to 200% on a non-linear curve,
`LocaleManager.setOverrideLocaleConfig()`, the Grammatical Inflection API and
about 300 OpenJDK 17 classes. Most behaviour changes could be toggled one by
one from Developer options or `adb`.
