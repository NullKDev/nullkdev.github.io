---
parentDomain: notes
parentId: notes-android-17
documentId: beta-4
locale: en
translationKey: android-17-beta-4
slug: beta-4
title: 'Android 17 Beta 4: the last scheduled beta'
summary: 16 April 2026. The final scheduled beta added RAM-based app memory limits, an anomaly profiling trigger and ML-DSA keys, and relaxed the background audio rules.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, performance]
references: []
evidence: []
protection: { mode: public }
---

Beta 4 came out on 16 April 2026, three weeks after Beta 3. Google called it
"the last scheduled beta of this release cycle". The API surface was already
locked, so it brought few new APIs and one change every app feels: memory
limits.

|                    |                                                                                 |
| ------------------ | ------------------------------------------------------------------------------- |
| Release date       | 16 April 2026; Beta 4.1 on 1 June 2026                                          |
| Build              | `CP21.260330.008`; Beta 4.1 `CP21.260330.011`                                   |
| Security patch     | 2026-04-05; Beta 4.1 2026-05-05                                                 |
| Devices            | Supported Pixel phones and tablets over the air; 64-bit Android Emulator images |
| Platform stability | Yes, since Beta 3                                                               |

## What Beta 4 added

- **App memory limits.** The system kills an app whose memory use passes a
  limit derived from the device's total RAM. Google set the limits
  "conservatively" for Android 17, to catch extreme leaks and outliers. An
  affected app finds `"MemoryLimiter"` in
  `ApplicationExitInfo.getDescription()`. The memory limits part below covers
  it in full.
- **`TRIGGER_TYPE_ANOMALY`.** A new `ProfilingManager` trigger hands the app a
  heap dump when it breaches the memory limit, or a binder stack sample when it
  makes excessive binder calls. The callback runs before the system enforces
  anything.
- **ML-DSA in Android Keystore.** On supported devices, apps can generate
  `ML-DSA-65` and `ML-DSA-87` keys in secure hardware through
  `KeyPairGenerator`, `KeyFactory` and `Signature`.
- **LeakCanary in Android Studio.** Android Studio Panda adds LeakCanary as a
  task in the Profiler.

## What Beta 4 changed

- **Background audio, relaxed.** After developer feedback, Google limited the
  while-in-use foreground service requirement to apps targeting 37 and
  exempted alarm audio.
- **Cross-profile loopback blocked.** Loopback traffic between profiles is no
  longer allowed by default, for every app on Android 17. Traffic within one
  profile is unaffected.

Beta 4.1, a bug-fix update, followed on 1 June. Android 17 itself shipped on
16 June.
