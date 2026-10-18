---
parentDomain: notes
parentId: notes-android-15
documentId: developer-preview-1
locale: en
translationKey: android-15-developer-preview-1
slug: developer-preview-1
title: 'Android 15 Developer Preview 1: fs-verity, MIDI'
summary: 16 February 2024. The first preview, for developers only, brought FileIntegrityManager, partial screen sharing, flash and low-light camera controls, virtual MIDI 2.0 and ADPF.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 1 came out on 16 February 2024. It was for developers
only, installed by flashing a system image, and Google said it expected
platform stability in June 2024.

|                    |                                                                                   |
| ------------------ | --------------------------------------------------------------------------------- |
| Release date       | 16 February 2024                                                                  |
| Build              | `AP31.240119.016`                                                                 |
| Security patch     | February 2024                                                                     |
| Devices            | Pixel 6, 6 Pro, 6a, 7, 7 Pro, 7a, 8 and 8 Pro, Pixel Fold, Pixel Tablet; Emulator |
| How to get it      | Flash a system image; no Android Beta enrolment yet                               |
| Platform stability | No                                                                                |

- **File integrity.** `FileIntegrityManager` gains APIs built on the kernel's
  fs-verity, so an app can protect files with its own cryptographic
  signatures and detect tampering.
- **Partial screen sharing.** Sharing or recording a single app window, first
  enabled in Android 14 QPR2, gets `MediaProjection` callbacks. Each capture
  session now needs the user's consent.
- **Camera.** Extensions for low-light preview brightening and for flash
  strength in `SINGLE` and `TORCH` modes, on supported devices.
- **Virtual MIDI 2.0.** Universal MIDI Packets, supported over USB since
  Android 13, extend to virtual MIDI apps, so a composition app can drive a
  synthesizer app.
- **ADPF.** Hint sessions get a power-efficiency mode and can report GPU work
  duration next to CPU work; thermal headroom thresholds help predict
  throttling.
- **Updatable modules.** Ad Services moves to extension level 10 with the
  latest Privacy Sandbox, Health Connect adds fitness and nutrition data
  types, and new OpenJDK APIs reach Android 12 and later through Google Play
  system updates.

Google advised testers on the Android 14 QPR beta to move to Preview 1 right
away, because a later QPR build date would otherwise force a data wipe.
