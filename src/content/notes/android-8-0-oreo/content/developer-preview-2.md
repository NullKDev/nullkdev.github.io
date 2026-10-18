---
parentDomain: notes
parentId: notes-android-8-0-oreo
documentId: developer-preview-2
locale: en
translationKey: android-8-0-oreo-developer-preview-2
slug: developer-preview-2
title: 'Android O Developer Preview 2: public beta'
summary: 17 May 2017, at Google I/O. The first beta-quality build opened Android Beta enrollment for O and added notification dots, Autofill with Google and Smart Text Selection.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 2 came out on 17 May 2017, at Google I/O. Google called it
"our first beta-quality candidate, available to test on your primary phone
or tablet", and opened the Android Beta program to Android O the same day.

|                    |                                                                             |
| ------------------ | --------------------------------------------------------------------------- |
| Release date       | 17 May 2017                                                                 |
| Build              | `OPP2.170420.017`                                                           |
| Devices            | Nexus 5X, Nexus 6P, Nexus Player, Pixel, Pixel XL and Pixel C; emulator     |
| How to get it      | Over the air through Android Beta, or by flashing the factory image         |
| Platform stability | No; APIs changed since Preview 1, and Google pointed to the API diff report |

## What Preview 2 added

- **Notification dots** on launcher icons, which Google said "work with zero
  effort for most apps", with the dot colour taken from the icon.
- **Autofill with Google**, Chrome's autofill brought to Android apps on top
  of the autofill framework. Apps can give hints about the data a field
  expects.
- **Smart Text Selection**: on-device machine learning selects a whole
  address, URL, phone number or email address and offers the matching app.
- **A new Android TV home screen** where apps publish channels, through the
  `TvProvider` support library.

Google also announced TensorFlow Lite and a Neural Networks API for a
maintenance update later that year, and showed Android Go for devices with
1 GB of memory or less.

The support libraries moved from the SDK Manager to Google's Maven
repository with Support Library 26.0.0 beta. Devices enrolled in the
Android N beta had to enroll again to receive O, 9to5Google reported.
