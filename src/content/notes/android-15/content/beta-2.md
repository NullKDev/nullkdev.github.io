---
parentDomain: notes
parentId: notes-android-15
documentId: beta-2
locale: en
translationKey: android-15-beta-2
slug: beta-2
title: 'Android 15 Beta 2: private space, partner phones'
summary: 15 May 2024. The second beta reached partner phones and added private space, six-hour timeouts for dataSync and mediaProcessing, 16 KB page support and a minimum target SDK of 24.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 2 came out on 15 May 2024, during Google I/O. It was the first Android
15 build on phones from other makers, and it added most of the features
users would see in the release.

|                    |                                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Release date       | 15 May 2024; 2.1 on 20 May; 2.2 on 3 June 2024                                                                                                         |
| Build              | `AP31.240426.022`; 2.1 `AP31.240426.023`; 2.2 `AP31.240426.023.B4`                                                                                     |
| Security patch     | May 2024                                                                                                                                               |
| Devices            | Pixel 6 to Pixel 8a, Pixel Fold, Pixel Tablet; partner devices from Honor, iQOO, Lenovo, Nothing, OnePlus, OPPO, Realme, Sharp, Tecno, vivo and Xiaomi |
| How to get it      | Over the air through Android Beta, or by flashing; partner programs                                                                                    |
| Platform stability | No                                                                                                                                                     |

- **Private space.** A separate user profile behind its own authentication.
  When the user locks it, the profile is paused and its apps stop running.
- **Foreground services.** `dataSync` and `mediaProcessing` services time out
  after about six hours, and the system calls `Service.onTimeout(int, int)`.
  An app targeting Android 15 that relies on `SYSTEM_ALERT_WINDOW` to start
  one from the background must show a visible overlay first.
- **16 KB pages.** Android 15 supports devices with 16 KB memory pages, and
  apps with native code need a rebuild. Google's first tests showed 3.16%
  faster launches under memory pressure and a 1.5% (about 0.8 s) faster boot;
  later figures in its 16 KB guide are higher.
- **Install floor.** Apps targeting below API 24 can no longer be installed;
  the install fails with `INSTALL_FAILED_DEPRECATED_SDK_VERSION`.
- **App security.** `Context.checkContentUriPermissionFull()` and the
  `requireContentUriPermissionFromCaller` attribute check access to content
  URIs. An opt-in flag blocks task hijacking from apps lower in the same
  task. Stricter intent matching can be tried under `StrictMode`.
- **Photos.** `QUERY_ARG_LATEST_SELECTION_ONLY` returns only the photos the
  user picked most recently under partial access.
- **Graphics.** ANGLE is an optional layer that runs OpenGL ES on Vulkan.
  `Matrix44` and `Canvas.clipShader()` join the Canvas API, and the dav1d AV1
  software decoder is available by name.
- **Screens and UI.** Pinned taskbar and saved app pairs on large screens.
  `Configuration.screenWidthDp` includes the system bars for apps targeting
  Android 15. Generated widget previews, smoother picture-in-picture entry,
  predictive back animations outside developer options, and per-channel
  vibration with `NotificationChannel.setVibrationEffect()`.
- **Language.** A grammatical gender setting, in French first, ICU 74 with
  Unicode 15.1, a variable NotoSansCJK font and a Hentaigana font.

Beta 2.1 only partly fixed home screen icons vanishing when a private space
was first created. Beta 2.2 finished that fix and repaired NFC payments with
the Wallet role and observe mode.
