---
parentDomain: notes
parentId: notes-android-15
documentId: beta-1
locale: en
translationKey: android-15-beta-1
slug: beta-1
title: 'Android 15 Beta 1: edge-to-edge by default'
summary: 11 April 2024. The first beta opened Android Beta enrolment and made apps targeting Android 15 edge-to-edge by default, with app archiving, ProfilingManager and contact keys.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 1 came out on 11 April 2024 and opened the Android Beta program, so
any supported Pixel could enrol and get it over the air. Two point releases
followed within two weeks.

|                    |                                                                         |
| ------------------ | ----------------------------------------------------------------------- |
| Release date       | 11 April 2024; 1.1 on 22 April; 1.2 on 25 April 2024                    |
| Build              | `AP31.240322.018`; 1.1 `AP31.240322.023`; 1.2 `AP31.240322.027`         |
| Security patch     | April 2024                                                              |
| Devices            | Pixel 6, 6 Pro, 6a, 7, 7 Pro, 7a, 8 and 8 Pro, Pixel Fold, Pixel Tablet |
| How to get it      | Over the air through Android Beta, or by flashing; Emulator images      |
| Platform stability | No                                                                      |

- **Edge-to-edge.** Apps targeting Android 15 draw behind the system bars
  without calling `enableEdgeToEdge()`. Material 3 composables handle the
  insets for you.
- **App archiving.** Apps holding `REQUEST_DELETE_PACKAGES` can call
  `PackageInstaller.requestArchive()`, which removes the APK and caches but
  keeps user data. Any app store can now implement it.
- **Profiling.** `ProfilingManager` collects heap dumps, heap profiles and
  stack samples from inside the app.
- **Security.** `E2eeContactKeysManager` stores contacts' public keys for
  end-to-end encryption, and new rules limit background apps that bring other
  apps to the front.
- **NFC and text.** Apps can be notified of NFC polling loop activity on
  supported devices. `JUSTIFICATION_MODE_INTER_CHARACTER` justifies Chinese
  and Japanese text by letter spacing.
- **Accessibility.** TalkBack supports Braille displays that use HID over USB
  and Bluetooth.

Beta 1.1 fixed NFC problems that broke wallet apps. Beta 1.2 fixed app
freezes, battery drain and a Settings crash when adding a fingerprint.
