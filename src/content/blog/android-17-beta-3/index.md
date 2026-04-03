---
title: "Android 17 Beta 3: Platform Stability Reached — What Developers Need to Know"
description: "Android 17 Beta 3 (API level 37) marks platform stability. APIs are locked, apps can now target Android 17 on Google Play. Here's a full breakdown of every new API, breaking change, and what to do right now."
date: 2026-03-27
tags: ["android", "kotlin", "android-17"]
authors: ["me"]
lang: en
image: ./banner.svg
---

Android 17 Beta 3 dropped on March 26, 2026, and it carries a very specific signal for developers: **platform stability has been reached**. That means the API surface is now locked. No more additions, no more removals, no more surprises. If you're a library author, SDK vendor, or app developer, the clock is ticking.

Build number `CP21.260306.017`, API level 37, security patch `2026-03-05`. This is the real thing.

## What "Platform Stability" Means in Practice

Google uses Beta 3 as the point at which the final API set is frozen. From here until the stable release:

- **No new public APIs will be added or removed**
- Apps submitted to Google Play can now target API 37
- SDK and library authors should publish compatibility updates immediately
- Game engines and developer tooling vendors need to validate against this build

The stable release is expected later in 2026. We don't have an exact date yet, but the timeline mirrors previous years: Beta 3 in March → stable around Q3.

---

## Camera and Media

### Photo Picker Gets Aspect Ratio Customization

A long-requested feature: the photo picker now supports portrait `9:16` grid aspect ratio alongside the existing `1:1` square. Use `PhotoPickerUiCustomizationParams`:

```kotlin
val params = PhotoPickerUiCustomizationParams.Builder()
    .setAspectRatio(PhotoPickerUiCustomizationParams.ASPECT_RATIO_PORTRAIT_9_16)
    .build()
```

Works with `ACTION_PICK_IMAGES` and the embedded photo picker variant. Useful for apps where vertical video or portrait photography is the primary use case.

### RAW14: 14-bit Single-Channel RAW Format

`ImageFormat.RAW14` is a new constant for 14-bit per pixel, densely packed RAW images (4 pixels stored in every 7 bytes). Professional camera apps with access to compatible sensors can now capture maximum color depth without custom format hacks.

### Camera Device Type Queries

You can now query whether a camera is built-in hardware, an external USB webcam, or a virtual camera. No more guessing from `CameraCharacteristics` workarounds.

### Vendor-Defined Camera Extensions

Hardware partners can define custom extension modes — think Super Resolution, AI-driven night modes, or manufacturer-specific enhancements. Query support via `isExtensionSupported(int)` on `CameraExtensionCharacteristics`.

### Bluetooth LE Audio Hearing Aid Support

New `AudioDeviceInfo.TYPE_BLE_HEARING_AID` constant distinguishes hearing aids from generic LE Audio headsets:

```kotlin
val devices = audioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS)
val hearingAidConnected = devices.any {
    it.type == AudioDeviceInfo.TYPE_BLE_HEARING_AID
}
```

This also enables **granular hearing aid audio routing** — users can independently route notifications, ringtones, and alarms to the hearing aid or device speaker, with no app changes required.

### Extended HE-AAC Software Encoder

New system-provided MediaCodec (`c2.android.xheaac.encoder`) for high-efficiency speech and audio encoding. Unified codec supporting both high and low bitrates, with mandatory loudness metadata for consistent volume in low-bandwidth conditions.

```kotlin
val encoder = MediaCodec.createByCodecName("c2.android.xheaac.encoder")
val format = MediaFormat.createAudioFormat(
    MediaFormat.MIMETYPE_AUDIO_AAC,
    sampleRate = 48000,
    channelCount = 1
)
format.setInteger(
    MediaFormat.KEY_AAC_PROFILE,
    MediaCodecInfo.CodecProfileLevel.AACObjectXHE
)
```

---

## Privacy and Security

### System-Provided Location Button

A new system-rendered button (delivered via Jetpack) that grants **one-time precise location** for the current session only — with no system permission dialog. Requires the new `USE_LOCATION_BUTTON` permission.

This is a meaningful UX improvement for apps where users want to share their location for a single action (ordering food, sharing with a friend) without granting persistent location access.

### Discrete Password Visibility

The "Show passwords" setting is now split in two:

- **Touch/soft keyboard input**: briefly echoes the last typed character (same as before)
- **Physical keyboard input**: hidden immediately by default

If your app uses custom text fields, use the new `ShowSecretsSetting` API:

```kotlin
val isPhysicalKeyboard =
    event.source and InputDevice.SOURCE_KEYBOARD == InputDevice.SOURCE_KEYBOARD
val shouldShowPassword =
    android.text.ShowSecretsSetting.shouldShowPassword(context, isPhysicalKeyboard)
```

### Post-Quantum Cryptography APK Signing

Android 17 introduces **APK signature scheme v3.2** with a hybrid approach: classical RSA or Elliptic Curve signatures combined with ML-DSA (Module Lattice Digital Signature Algorithm — a NIST-standardized post-quantum algorithm). This future-proofs the ecosystem against quantum computing threats without breaking compatibility with current tooling.

### Native Dynamic Code Loading — Read-Only Enforcement Extended

Since Android 14, Java/DEX files loaded dynamically must be read-only. **Android 17 extends this enforcement to native libraries**. If your app calls `System.load()` on a native file that isn't marked read-only, it now throws `UnsatisfiedLinkError`. Audit your native library loading paths.

### Certificate Transparency — On by Default

What was an opt-in feature on Android 16 is now **enabled by default for all apps**. No code changes needed for apps that use standard HTTPS — but if you're doing manual certificate validation or certificate pinning, review your implementation.

---

## Performance and Battery

### AlarmManager: Exact Alarms with a Listener Callback

New overload of `setExactAndAllowWhileIdle()` that accepts an `OnAlarmListener` instead of a `PendingIntent`. Intended for apps currently using continuous wakelocks for precise timing (messaging sockets, medical monitoring apps):

```java
alarmManager.setExactAndAllowWhileIdle(
    AlarmManager.RTC_WAKEUP,
    triggerAtMillis,
    "com.example.MY_ALARM",
    executor,
    new AlarmManager.OnAlarmListener() {
        @Override
        public void onAlarm() {
            // Handle the alarm
        }
    }
);
```

> **Note:** CommonsWare flagged the API documentation as internally contradictory — it simultaneously claims to target apps "reliant on continuous wakelocks" but also "reduces wakelocks." The intent appears to be a more targeted alternative to long-lived wakelocks, not a complete removal of wakelock semantics.

---

## User Experience and System UI

### Widget Support on External Displays

`RemoteViews.setViewPadding()` now accepts complex units (DP and SP, not just pixels). Widgets can retrieve the display ID of the screen they're rendering on via `OPTION_APPWIDGET_DISPLAY_ID`:

```kotlin
val displayId = appWidgetManager
    .getAppWidgetOptions(appWidgetId)
    .getInt(AppWidgetManager.OPTION_APPWIDGET_DISPLAY_ID)
```

This makes it possible to adapt widget layouts for external monitors with different pixel densities — critical for Desktop Mode.

### Desktop Interactive Picture-in-Picture

Apps can request a pinned windowing layer in desktop mode (now the default on external displays). The window is always-on-top and fully interactive. Requires the new `USE_PINNED_WINDOWING_LAYER` permission:

```kotlin
appTask.requestWindowingLayer(
    ActivityManager.AppTask.WINDOWING_LAYER_PINNED,
    context.mainExecutor,
    object : OutcomeReceiver<Int, Exception> {
        override fun onResult(result: Int) { /* success */ }
        override fun onError(e: Exception) { /* handle */ }
    }
)
```

### Hidden App Labels

Users can now hide app names on the home screen. Google's guidance to developers: make sure your app icon is recognizable without its label.

### Redesigned Screen Recording Toolbar

New floating toolbar for recording controls. The toolbar itself is excluded from the final captured video — a simple but important fix that any screen recorder user will appreciate.

---

## Breaking Changes

### For All Apps (Regardless of Target API)

| Change | What to do |
|---|---|
| **DCL native enforcement** | Ensure native libs loaded via `System.load()` are on read-only paths |
| **Certificate Transparency on by default** | Review custom certificate validation code |
| **Local Network Access blocked** | Apps targeting Android 17+ need `ACCESS_LOCAL_NETWORK` permission to reach LAN devices |

### For Apps Targeting API 37

| Change | What to do |
|---|---|
| **Large screen resizability enforced** | Cannot opt out of orientation/resizability constraints on large screens — test on foldables and tablets |
| **`String.getChars()` removed** | Migrate to `String.getBytes()` or equivalent — this is an OpenJDK 21 change |
| **`ACTION_TAG_DISCOVERED` deprecated** | Migrate to the newer NFC intent actions |
| **`DnsResolver.getInstance()` removed** | Use the constructor-based approach instead |

---

## Notable Underdocumented APIs

CommonsWare identified several new APIs in the API diff that lack documentation:

- **`SerialManager`** — serial port access, scope unclear
- **`WebAppManager`** — relationship to the browser unknown
- **`FileManager`** system service — background disk I/O for privileged apps
- **Bridged notifications** — from other connected devices
- **ANR warning registration** — graceful timeout callbacks before an ANR is triggered
- **Alternative SMS transport framework** — RCS and beyond

Treat these as internal or partner-restricted for now.

---

## Stability Fixes in Beta 3

Beta 3 included an unusually large number of stability fixes, suggesting that earlier betas had significant reliability issues:

- **Process lifecycle regression** (Android 16) causing random app restarts and screen flickering
- **Camera**: 5x telephoto lens switching failures, lens transition stuttering
- **Android Auto**: lock screen freeze after disconnection
- **Spontaneous reboots**: 40+ related issues, hangs during idle
- **Bluetooth**: 150-second pairing hang
- **UI artifacts**: status bar icons disappearing, notification dismiss failures

---

## What You Should Do Right Now

1. **Library/SDK authors**: publish your Android 17 compatibility release now. The API surface is frozen.
2. **App developers**: run your app on the Beta 3 system image or emulator. Pay attention to the native DCL enforcement and local network access changes.
3. **Test on large screens**: the resizability enforcement change is the most likely to surface new issues in foldable/tablet form factors.
4. **Check your NFC code**: if you use `ACTION_TAG_DISCOVERED`, start planning the migration.
5. **Submit your app to Google Play** targeting API 37 — you can do it now.

---

## Resources

- [Android 17 Beta 3 — Official Blog Post](https://android-developers.googleblog.com/2026/03/the-third-beta-of-android-17.html)
- [Android 17 Release Notes](https://developer.android.com/about/versions/17/release-notes)
- [Android 17 API Differences Report](https://developer.android.com/sdk/api_diff/37/changes)
- [CommonsWare — Beta 3 Musings](https://commonsware.com/blog/2026/03/27/random-musings-android-17-beta-3.html)
