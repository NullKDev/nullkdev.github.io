---
parentDomain: notes
parentId: notes-android-16
documentId: developer-preview-1
locale: en
translationKey: android-16-developer-preview-1
slug: developer-preview-1
title: 'Android 16 Developer Preview 1: two SDKs a year'
summary: 19 November 2024. The first Android 16 build, for developers only, announced a major SDK in Q2 and a minor one in Q4, and previewed SDK_INT_FULL and the embedded photo picker.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google released the first developer preview of Android 16 on
19 November 2024, three months earlier than the February previews of the
five releases before it. The reason was the launch date: Google moved the
major release from Q3 to Q2 2025, "to better align with the schedule of
device launches across our ecosystem".

|                    |                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Release date       | 19 November 2024                                                                                                                |
| Build              | `BP21.241018.009`                                                                                                               |
| Security patch     | November 2024                                                                                                                   |
| Devices            | Pixel 6, 6 Pro, 6a, 7, 7 Pro, 7a, Fold, Tablet, 8, 8 Pro, 8a, 9, 9 Pro, 9 Pro XL and 9 Pro Fold; 64-bit Android Emulator images |
| How to get it      | Manual download only: flash a system image. Android Beta was not open                                                           |
| Platform stability | No; Google expected it in March 2025                                                                                            |

The post announced two API releases in 2025. The Q2 major release would be
the only one with planned behaviour changes tied to `targetSdkVersion`. A Q4
minor release would add APIs, features and fixes, but no app-impacting
behaviour changes. To check for minor releases, DP1 previewed
`SDK_INT_FULL`, the `VERSION_CODES_FULL` enumeration and
`Build.getMinorSdkVersion()`, with the warning that they "have not yet been
finalized". The Google Play target API requirement stayed one per year, tied
to the major API level.

The developer APIs in this build were few. Apps could embed the photo picker
in their own view hierarchy, keeping its process isolation. Health Connect
got an early-access API to read and write medical records in FHIR format.
And the build carried the latest Privacy Sandbox on Android, including the
SDK Runtime; Google retired the SDK Runtime and most other Privacy Sandbox
technologies on 17 October 2025.

A Pixel already on the Android 15 QPR2 Beta 1 could not move to this preview
without a wipe.
