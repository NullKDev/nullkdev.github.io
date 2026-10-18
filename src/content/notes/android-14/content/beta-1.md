---
parentDomain: notes
parentId: notes-android-14
documentId: beta-1
locale: en
translationKey: android-14-beta-1
slug: beta-1
title: 'Android 14 Beta 1: open to early adopters'
summary: '12 April 2023. The first beta opened the Android Beta program, and added sharesheet custom actions, queryable paths and the accessibilityDataSensitive attribute.'
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 1 came out on 12 April 2023 and opened Android 14 to early adopters
through the Android Beta program. Pixel owners already in the Android 13 QPR
beta got it without doing anything.

|                    |                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------- |
| Release date       | 12 April 2023; Beta 1.1 on 26 April 2023                                              |
| Build              | `UPB1.230309.014`; 1.1 `UPB1.230309.017` (`.A1` for Pixel 6, 6 Pro and 6a on Verizon) |
| Security patch     | April 2023 (March 2023 for Pixel 6 phones on Verizon)                                 |
| Devices            | Pixel 4a (5G) to Pixel 7 Pro; 64-bit Android Emulator images                          |
| How to get it      | Over the air through Android Beta, or by flashing                                     |
| Platform stability | No                                                                                    |

Apps can add their own actions to the system sharesheet with
`ChooserAction.Builder` and `Intent.EXTRA_CHOOSER_CUSTOM_ACTIONS`, and direct
share ranking reads usage reported through `pushDynamicShortcut()`. `Path`
became queryable and interpolatable, with an AndroidX library back to API 21.
The `accessibilityDataSensitive` attribute hides a view from accessibility
services that do not claim to help users with disabilities.

Gesture navigation got a larger back arrow that follows the wallpaper colors.
Android Studio Giraffe Canary 7 with AGP 8.1.0-alpha07 started generating the
`LocaleConfig` file for per-app languages.

Beta 1.1 fixed a System UI crash in "Wallpaper & style", fingerprint unlock,
a missing mobile network icon and SIM or eSIM detection.
