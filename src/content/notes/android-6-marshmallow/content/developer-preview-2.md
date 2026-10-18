---
parentDomain: notes
parentId: notes-android-6-marshmallow
documentId: developer-preview-2
locale: en
translationKey: android-6-marshmallow-developer-preview-2
slug: developer-preview-2
title: 'M Developer Preview 2: near-final APIs'
summary: 9 July 2015. The second preview reshaped the permission model, made external storage a runtime permission and set USB connections to charge-only by default.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Preview 2 arrived on 9 July 2015, within the "late June/early July" window
Google had set. Google described it as "near-final APIs" with fixes from
developer feedback. Most of its changes were to the permission model.

|                      |                                                                     |
| -------------------- | ------------------------------------------------------------------- |
| Release date         | 9 July 2015                                                         |
| Build                | `MPZ79M` (Nexus 5, 6, 9); `MPZ79N` (Nexus Player)                   |
| Devices              | Same four Nexus devices; over the air from `MPZ44Q`, or by flashing |
| Emulator             | x86 and ARM, 32- and 64-bit, through the SDK Manager                |
| Google Play services | 7.6                                                                 |
| API status           | Near-final                                                          |

## How Preview 2 reshaped permissions

- **Storage.** `WRITE_EXTERNAL_STORAGE` became "dangerous", so apps must ask
  for it at runtime. It and `READ_EXTERNAL_STORAGE` form the `STORAGE` group.
- **Fingerprint.** `USE_FINGERPRINT` became "normal" and no longer needs the
  user's approval. It does not give access to fingerprint enrolment.
- **Wi-Fi and Bluetooth.** `BLUETOOTH`, `BLUETOOTH_ADMIN`, `CHANGE_WIFI_STATE`,
  `CHANGE_WIMAX_STATE` and `CHANGE_WIFI_MULTICAST_STATE` became "normal".
  Reading the MAC address of a remote Bluetooth or Wi-Fi device now needs
  `ACCESS_COARSE_LOCATION` or `ACCESS_FINE_LOCATION`.
- **Accounts.** Some account and identity permissions moved into the
  `CONTACTS` group; `USE_CREDENTIALS`, `MANAGE_ACCOUNTS` and
  `AUTHENTICATE_ACCOUNTS` were left ungrouped "pending further changes".
  Bookmark and subscribed-feed permissions were removed.
- **System apps.** Apps in the system image stopped getting dangerous
  permissions automatically.
- **Rationale.** `Activity.shouldShowRequestPermissionRationale(String)` tells
  an app whether the user has already refused a permission, so it can explain
  why it needs it.

## Other Preview 2 changes

- USB connections default to charge-only; the user must allow data access.
- `android.app.AssistContent` and `AssistStructure` moved to the new
  `android.app.assist` package.
- The stylus listeners were renamed: `View.OnContextClickListener` and
  `GestureDetector.OnContextClickListener` replace the `OnStylusButtonPress`
  versions.
- `InputDevice.hasMicrophone()` reports whether an input device has a
  microphone.

The "Dark" system theme from Preview 1 was gone. 9to5Google later quoted a
Googler on the preview issue tracker: "This will not be included in the M
release."
