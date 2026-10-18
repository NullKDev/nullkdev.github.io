---
parentDomain: notes
parentId: notes-android-6-marshmallow
documentId: developer-preview-3
locale: en
translationKey: android-6-marshmallow-developer-preview-3
slug: developer-preview-3
title: 'M Developer Preview 3: final SDK, a name'
summary: 17 August 2015. The last preview shipped the official Android 6.0 SDK at API 23, named the release Marshmallow and opened Google Play to apps targeting it.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Preview 3 came out on 17 August 2015, with the official Android 6.0 SDK. The
same post named the release Marshmallow and fixed it at API level 23. Google
Play began accepting apps that target API 23 on every channel: Alpha, Beta and
Production.

|                      |                                                                              |
| -------------------- | ---------------------------------------------------------------------------- |
| Release date         | 17 August 2015                                                               |
| Build                | `MPA44I`                                                                     |
| Devices              | Nexus 5, Nexus 6, Nexus 9 and Nexus Player, over the air or by flashing      |
| Emulator             | x86 and ARM, 32- and 64-bit; Android 6.0 SDK through the SDK Manager         |
| Google Play services | 7.8                                                                          |
| API status           | Final, API level 23; system images near final and not meant for consumer use |

It was late. The plan had been "near final, late July"; on 31 July Android
Police reported that Google would miss that date. The first Preview 3 images
were build `MPA44G`, and Google replaced them the same day with `MPA44I`,
which the preview site lists as the Preview 3 build.

## What Preview 3 finalised

Google called the API changes since Preview 2 "fairly incremental":

- **Permissions UI.** The permission dialogs and settings took their final
  form, with some behaviour changes.
- **`GET_ACCOUNTS`.** It joined the `CONTACTS` group as "dangerous", so apps
  targeting API 23 must request it at runtime. `READ_PROFILE` and
  `WRITE_PROFILE` left the `CONTACTS` group.
- **Wi-Fi and Bluetooth LE scans.** Apps targeting API 23 need a location
  permission to get scan results. Apps targeting API 22 or lower still get
  them, but only in the foreground.
- **Fingerprint API.** Better error reporting, a better enrolment flow and
  enumeration support.

Support Library 23 shipped the same day, with new `customtabs`, `percent`,
`recommendation` and `preference` libraries, and backward-compatible helpers for
the permission and fingerprint APIs.

Preview builds could not take consumer updates. To get the public release,
which reached Nexus devices on 5 October, testers had to flash a factory image
by hand.
