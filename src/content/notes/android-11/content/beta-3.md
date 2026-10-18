---
parentDomain: notes
parentId: notes-android-11
documentId: beta-3
locale: en
translationKey: android-11-beta-3
slug: beta-3
title: 'Android 11 Beta 3: release candidate'
summary: 6 August 2020. The last beta was a release candidate for Pixel 2 to 4, and later the 4a, and let Exposure Notification apps run with the device location setting off.
order: 7
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 3 came out on 6 August 2020, "our last update in this year's preview
cycle". It was a release candidate build for Pixel phones and the Android
Emulator, on the APIs and behaviors frozen since Beta 2.

|                    |                                                                     |
| ------------------ | ------------------------------------------------------------------- |
| Release date       | 6 August 2020                                                       |
| Build              | `RPB3.200720.005`                                                   |
| Devices            | Pixel 2, 3, 3a and 4, with their XL models; Pixel 4a from 24 August |
| How to get it      | Over the air through Android Beta, Android Flash Tool, or by flash  |
| Platform stability | Yes, since Beta 2                                                   |

The one change Google called out was for the Exposure Notifications System.
From Beta 3, apps built on it could scan for Bluetooth devices without the
device location setting on. Every other app still needed location on and a
location permission to scan.

The fixes included package visibility: an intent filter for browsers now made
only browser apps visible, not a broader set. Google said Beta 3 would reach the
Pixel 4a when the phone went on sale; 9to5Google saw it in Android Beta on 24
August. Android 11 shipped on 8 September 2020.
