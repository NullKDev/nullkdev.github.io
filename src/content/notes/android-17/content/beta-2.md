---
parentDomain: notes
parentId: notes-android-17
documentId: beta-2
locale: en
translationKey: android-17-beta-2
slug: beta-2
title: 'Android 17 Beta 2: pickers and local network'
summary: 26 February 2026. App bubbles, the EyeDropper and Contacts Picker, cross-device handoff, the ACCESS_LOCAL_NETWORK permission and a three-hour hold on OTP messages.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Beta 2 arrived on 26 February 2026, thirteen days after Beta 1. It brought
most of the system pickers that Android 17 uses in place of broad permissions,
and the two privacy changes that reach apps through the network and the SMS
inbox.

|                    |                                                                                 |
| ------------------ | ------------------------------------------------------------------------------- |
| Release date       | 26 February 2026                                                                |
| Build              | `CP21.260206.011` (`.A1` for Pixel 6, 6 Pro, 6a, 7 and 7 Pro)                   |
| Security patch     | 2026-02-05                                                                      |
| Devices            | Supported Pixel phones and tablets over the air; 64-bit Android Emulator images |
| Platform stability | Not yet; still targeted for March                                               |

## New APIs in Beta 2

- **App bubbles.** Users can turn any app into a floating bubble by
  long-pressing its launcher icon; large screens get a bubble bar in the
  taskbar. Google's post adds that bubbles "aren't yet fully enabled in
  Beta 2".
- **EyeDropper.** `Intent.ACTION_OPEN_EYE_DROPPER` returns the colour of any
  pixel on the display without a screen capture permission.
- **Contacts Picker.** `ACTION_PICK_CONTACTS` grants temporary access to only
  the fields the user picks, from the personal or the work profile, without
  `READ_CONTACTS`.
- **Touchpad pointer capture.** A captured touchpad now reports relative,
  mouse-like movement; `View.POINTER_CAPTURE_MODE_ABSOLUTE` keeps the raw
  finger positions.
- **Cross-device handoff.** The Handoff API resumes an app's state on a nearby
  device, such as a tablet, through `CompanionDeviceManager`, with a web
  fallback.
- **Ranging and data plans.** UWB DL-TDOA (FiRa 4.0) for indoor navigation,
  Wi-Fi Alliance proximity detection, and
  `getStreamingAppMaxDownlinkKbps()` / `getStreamingAppMaxUplinkKbps()` for
  carrier-allocated streaming rates.
- **Time and text.** `ACTION_TIMEZONE_OFFSET_CHANGED` fires on offset changes
  such as daylight saving time, and ICU 78 brings Unicode 17.

## Behaviour changes in Beta 2

- **Local network.** Apps targeting API 37 lose LAN access unless they use a
  system device picker or hold the new `ACCESS_LOCAL_NETWORK` runtime
  permission. It belongs to the `NEARBY_DEVICES` group, so users who already
  granted a nearby devices permission are not asked again.
- **OTP messages held for three hours.** WebOTP messages are held from every
  app that is not the verified recipient, whatever it targets. For apps
  targeting 37, the hold covers every SMS with an OTP. The default SMS app,
  the assistant and connected companion apps are exempt; Google points
  everyone else to SMS Retriever or SMS User Consent.
- **NPU access.** Apps targeting 37 that use the neural processing unit
  directly, including through the LiteRT NPU delegate or the deprecated
  NNAPI, must declare `FEATURE_NEURAL_PROCESSING_UNIT` or they are blocked.

The release notes list 16 fixed issues. The first is an Android 16 regression
that made active apps restart or refresh on their own.
