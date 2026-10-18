---
parentDomain: notes
parentId: notes-android-15
documentId: developer-preview-2
locale: en
translationKey: android-15-developer-preview-2
slug: developer-preview-2
title: 'Android 15 Developer Preview 2: satellite, PDF'
summary: 21 March 2024. The second preview added satellite and NFC observe-mode APIs, an updatable PdfRenderer, ApplicationStartInfo, the mediaProcessing service type and loudness control.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 2 came out on 21 March 2024, five weeks after the first.
It was still for developers only: Google offered no sideload images this
time, so it came by flashing or over the air from Preview 1.

|                    |                                                                                   |
| ------------------ | --------------------------------------------------------------------------------- |
| Release date       | 21 March 2024                                                                     |
| Build              | `AP31.240223.016.A3`                                                              |
| Security patch     | March 2024                                                                        |
| Devices            | Pixel 6, 6 Pro, 6a, 7, 7 Pro, 7a, 8 and 8 Pro, Pixel Fold, Pixel Tablet; Emulator |
| How to get it      | Flash, or over the air from Preview 1                                             |
| Platform stability | No                                                                                |

- **Connectivity.** `ServiceState.isUsingNonTerrestrialNetwork()` reports a
  satellite connection, and SMS, MMS and preloaded RCS apps can message over
  it. On supported devices, `NfcAdapter` observe mode hands the app
  `PollingFrame` objects without answering the reader.
- **PDF.** `PdfRenderer` moves to a module updated through Google Play system
  updates, with password-protected files, annotations, forms, search and
  selection. `PdfRendererPreV` brings it to Android 11.
- **Text and intents.** `<nobreak>` and `<nohyphen>` keep words on one line or
  unhyphenated. `<uri-relative-filter-group>` matches deep links on query
  parameters and fragments.
- **App insight.** `ApplicationStartInfo` explains why and how the app
  started. `StorageStats.getAppBytesByDataType()` splits app size by type.
  Force-stopped apps lose their pending intents and get `BOOT_COMPLETED` when
  the user launches them again.
- **Background work.** The new `mediaProcessing` foreground service type
  covers jobs such as transcoding; Google said a later beta would cap it at
  six hours.
- **Media.** `setDesiredHdrHeadroom()` balances HDR and SDR content, and
  `LoudnessCodecController` applies CTA-2075 loudness to AAC. `Virtualizer`
  is deprecated in favour of `Spatializer`.
- **More.** Opt-in support for the cover screens of flippable phones, screen
  recording detection, new SQLite APIs (read-only deferred transactions,
  changed-row counts), `AutomaticZenRule` types, icons and device effects,
  and, for apps targeting Android 15, `elegantTextHeight` true by default.
