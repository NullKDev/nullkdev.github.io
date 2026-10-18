---
parentDomain: notes
parentId: notes-android-8-0-oreo
documentId: developer-preview-3
locale: en
translationKey: android-8-0-oreo-developer-preview-3
slug: developer-preview-3
title: 'Android O Developer Preview 3: final API 26'
summary: 8 June 2017. The third preview froze the API at level 26, shipped the final SDK and let developers publish apps targeting API 26 to Google Play.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 3 shipped on 8 June 2017 with "the final Android O APIs".
From this build on, API level 26 did not change, so developers could compile
against it and publish.

|                    |                                                                         |
| ------------------ | ----------------------------------------------------------------------- |
| Release date       | 8 June 2017                                                             |
| Build              | `OPP3.170518.006`                                                       |
| Devices            | Nexus 5X, Nexus 6P, Nexus Player, Pixel, Pixel XL and Pixel C; emulator |
| How to get it      | Over the air through Android Beta, or by flashing the factory image     |
| Platform stability | Yes: final API level 26                                                 |

## What final APIs meant for developers

- **Final SDK.** The API 26 SDK came through the SDK Manager, and Support
  Library 26.0.0 beta 2 through Google's Maven repository. Google
  recommended setting `compileSdkVersion` to 26, and `targetSdkVersion` to 26
  to test the Android O behaviour changes.
- **Publishing on Play.** Apps compiled against, and optionally targeting,
  API 26 could go to the alpha, beta and production tracks. Devices in
  Android Beta were the first to receive them.
- **Tools.** Android Studio 3.0 on the canary channel had the adaptive icon
  wizard and XML and downloadable font support. Android Studio 2.3.3, on the
  stable channel, could build for O without those tools.
- **API changes.** APIs changed again since Preview 2; Google pointed to the
  diff report for code written against the earlier previews.

Google promised "one more preview update coming in July" with near-final
system images.
