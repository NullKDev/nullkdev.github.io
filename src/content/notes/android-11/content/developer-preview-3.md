---
parentDomain: notes
parentId: notes-android-11
documentId: developer-preview-3
locale: en
translationKey: android-11-developer-preview-3
slug: developer-preview-3
title: 'Android 11 Developer Preview 3: developer tools'
summary: 23 April 2020. The third preview focused on tools for developers, with wireless debugging, ADB Incremental, GWP-ASan for apps and revised exit-reason and data-auditing APIs.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 3 came out on 23 April 2020. Google described it as "bug
fixes and a set of productivity improvements for developers". Pixels on an
earlier preview got it over the air.

|                    |                                                              |
| ------------------ | ------------------------------------------------------------ |
| Release date       | 23 April 2020                                                |
| Build              | `RPP3.200320.017`                                            |
| Devices            | Pixel 2, 3, 3a and 4, with their XL models; Android Emulator |
| How to get it      | Manual flash, or OTA from an earlier preview                 |
| Platform stability | No; APIs still changing                                      |

Wireless debugging arrived, with the pairing-code flow on the command line; QR
pairing from Android Studio was promised for later. ADB Incremental made
installing APKs of 2 GB or more "up to 10x faster", for APKs signed with the new
signature scheme v4. In this build it worked only on the Pixel 4, because it
needed a file system change on the device.

GWP-ASan, a sampling heap error detector, ran by default in platform binaries
and system apps, and apps could turn it on. The app exit reasons API was revised
from developer feedback, and several data access auditing APIs were renamed.

Apps targeting Android 11 now needed `READ_PHONE_NUMBERS` instead of
`READ_PHONE_STATE` to read phone numbers. The non-SDK restrictions relaxed for
OkHttp in Developer Preview 1.1 were back, and Google asked OkHttp users to
update.
