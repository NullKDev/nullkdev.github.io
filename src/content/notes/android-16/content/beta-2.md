---
parentDomain: notes
parentId: notes-android-16
documentId: beta-2
locale: en
translationKey: android-16-beta-2
slug: beta-2
title: 'Android 16 Beta 2: edge-to-edge without escape'
summary: 13 February 2025. The second beta added pro camera controls and AGSL colour filters, removed the edge-to-edge opt-out and hardened intent redirection for every app.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Beta 2 came out on 13 February 2025, three weeks after Beta 1. It was the
last beta before platform stability, and it carried most of the behaviour
changes that later defined targeting API 36.

|                    |                                                                         |
| ------------------ | ----------------------------------------------------------------------- |
| Release date       | 13 February 2025; Beta 2.1 on 27 February 2025                          |
| Build              | `BP22.250124.009`; Beta 2.1 `BP22.250124.010`                           |
| Security patch     | February 2025                                                           |
| Devices            | Pixel 6 and newer, Pixel Fold and Pixel Tablet; 64-bit Android Emulator |
| Platform stability | No; expected with Beta 3                                                |

## What Beta 2 added

- **Camera.** Hybrid auto-exposure, precise colour temperature and tint
  controls, motion photo capture intents, and UltraHDR images in HEIC.
- **Graphics.** AGSL shaders as colour and blend effects
  (`RuntimeColorFilter`, `RuntimeXfermode`).
- **Performance.** `SystemHealthManager.getCpuHeadroom()` and
  `getGpuHeadroom()` estimate the CPU and GPU an app or game can still use.
- **Key sharing.** `KeyStoreManager` grants and revokes another app's access
  to an Android Keystore key, by UID.
- **Other.** A "Measurement system" setting in regional preferences, a
  content API for live wallpapers (`WallpaperDescription`,
  `WallpaperInstance`), a `MediaQuality` package for TV picture and audio
  profiles, and accessibility APIs for durations in `TtsSpan`, expandable
  elements, indeterminate progress bars and tri-state checkboxes.

## What Beta 2 changed

- **Edge-to-edge.** For apps targeting 36,
  `windowOptOutEdgeToEdgeEnforcement` is deprecated and disabled.
- **Health permissions.** For apps targeting 36, `BODY_SENSORS` gives way to
  the granular `android.permissions.health` permissions.
- **Abandoned jobs.** A job whose `JobParameters` is garbage collected before
  `jobFinished()` stops with `STOP_REASON_TIMEOUT_ABANDONED`.
- **Intent redirection.** Hardened by default for every app, whatever its
  target; `removeLaunchSecurityProtection()` opts a nested intent out.
- **Elegant fonts.** `elegantTextHeight` is deprecated and ignored for apps
  targeting 36.
- **16 KB pages.** A 4 KB-aligned app on a 16 KB device runs in a
  compatibility mode and the user sees a dialog; `android:pageSizeCompat`
  controls it.

Beta 2.1, a bug-fix update, followed on 27 February. It fixed devices that
sometimes could not enter Doze and unexpected reboots.
