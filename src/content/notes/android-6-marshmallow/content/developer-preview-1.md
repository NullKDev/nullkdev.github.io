---
parentDomain: notes
parentId: notes-android-6-marshmallow
documentId: developer-preview-1
locale: en
translationKey: android-6-marshmallow-developer-preview-1
slug: developer-preview-1
title: 'M Developer Preview 1: Android M at I/O'
summary: 28 May 2015. The first build of Android M, shown at Google I/O, brought runtime permissions, App Links, Doze and the fingerprint APIs to four Nexus devices.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google announced Android M at Google I/O on 28 May 2015 and released the first
developer preview the same day, right after the keynote. The release had no
number and no name yet: the SDK called it "Android MNC Preview", and projects
built against it with `compileSdkVersion 'android-MNC'`.

|                      |                                                                       |
| -------------------- | --------------------------------------------------------------------- |
| Release date         | 28 May 2015                                                           |
| Build                | `MPZ44Q`                                                              |
| Devices              | Nexus 5, Nexus 6, Nexus 9 and Nexus Player, by flashing system images |
| Emulator             | x86 and ARM, 32- and 64-bit                                           |
| Google Play services | 7.5                                                                   |
| API status           | Preview APIs, not final; no API level yet                             |

## What Preview 1 introduced

Google's announcement framed M as "improving the fundamentals". The headline
changes for developers were already in this build:

- **Runtime permissions.** Apps request permissions in context while running,
  and users can grant or refuse each one and change it later in settings.
  Google told developers to "account for permissions that don't get granted".
- **App Links.** An `autoVerify` attribute in the manifest lets a verified app
  open its own URLs with no disambiguation prompt.
- **Doze.** When significant motion detection shows the device has been left
  unattended, Android backs off background activity. Google pointed chat apps
  to high-priority messages to wake them.
- **Fingerprint.** New APIs let apps authorise with the fingerprint sensor,
  the same mechanism behind Android Pay and Play purchases.
- **Now on tap.** Assist APIs feed the current screen to Google Now; Google
  asked developers to implement App Indexing to appear in it.

Google released Android Studio 1.3 Preview, with C and C++ editing and
debugging for the NDK, and the Android Design Support Library alongside it.

## The planned timeline

This time Google promised "a clear timeline". The preview site set it out:
Preview 2 in "late June/early July", Preview 3 "near final, late
July", and the final SDK later in the third quarter. Devices already on a
preview build would get each update over the air.
