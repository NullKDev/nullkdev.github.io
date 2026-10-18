---
parentDomain: notes
parentId: notes-android-14
documentId: beta-5
locale: en
translationKey: android-14-beta-5
slug: beta-5
title: 'Android 14 Beta 5: the last scheduled beta'
summary: '10 August 2023. The last scheduled beta, the third with platform stability, followed by three bug-fix updates before the stable release on 4 October.'
order: 7
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 5 came out on 10 August 2023, the last scheduled beta and the third
build with platform stability. Apps targeting SDK 34 could ship on Google
Play.

|                    |                                                                                  |
| ------------------ | -------------------------------------------------------------------------------- |
| Release date       | 10 August 2023; 5.1 on 18 August, 5.2 on 25 August, 5.3 on 6 September 2023      |
| Build              | `UPB5.230623.003`; 5.1 `.005`, 5.2 `.006` (`.A1` on Tablet and Fold), 5.3 `.009` |
| Security patch     | August 2023                                                                      |
| Devices            | Pixel 4a (5G) to Pixel 7a, Pixel Tablet and Pixel Fold                           |
| How to get it      | Over the air through Android Beta, or by flashing                                |
| Platform stability | Yes                                                                              |

The post repeated the changes to test first: partial photo access, full-screen
intents limited to calling and alarm apps, `SCHEDULE_EXACT_ALARM` denied by
default, and font scaling to 200%. Google said emulator images would
follow soon.

The final release took almost two months more, so Beta 5 got three fix
updates. 5.1 fixed SIM detection with Fixed Dialing Numbers enabled and 5G
standalone drops. 5.2 fixed reboot stalls and fingerprint problems on the
Tablet and Fold. 5.3 fixed crashes after a `CallStyle` notification and a
slow path for background CPU limits. Android 14 shipped on
4 October 2023.
