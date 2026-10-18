---
parentDomain: notes
parentId: notes-android-7-0-nougat
documentId: developer-preview-4
locale: en
translationKey: android-7-0-nougat-developer-preview-4
slug: developer-preview-4
title: 'Android N Developer Preview 4: final APIs'
summary: 15 June 2016. API level 24 became final with the N SDK, apps could ship to Google Play, and launcher shortcuts left the public API.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 4, build `NPD56N`, shipped on 15 June 2016 with the final
Android N SDK. Every API was final and the API level was 24. From that day
developers could publish apps compiled against, and optionally targeting,
API 24 to the alpha, beta and production channels in Google Play. It needed
Android Studio 2.1.2 or later, and Support Library 24.0.0 brought the
multi-window, notification and Direct Boot APIs to older versions.

## What Developer Preview 4 changed

- **Launcher shortcuts removed.** As announced with Preview 3, the
  `ShortcutManager` APIs were gone from the public API.
- **Multi-window attributes renamed:** `android:minimalHeight` and
  `android:minimalWidth` became `android:minHeight` and `android:minWidth`.
- **Bluetooth LE scanning:** an app that starts and stops scans more than five
  times in 30 seconds is blocked, and long-running scans become opportunistic.
- **Locale resources** are negotiated for each resource object, instead of the
  app starting with all its locale resources loaded.

CTS approval covered the Nexus 5X, 6, 6P and Pixel C. The preview reached
every supported device, including the Sony Xperia Z3.
