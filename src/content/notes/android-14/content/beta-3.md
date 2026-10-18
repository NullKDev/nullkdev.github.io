---
parentDomain: notes
parentId: notes-android-14
documentId: beta-3
locale: en
translationKey: android-14-beta-3
slug: beta-3
title: 'Android 14 Beta 3: platform stability'
summary: '7 June 2023. The third beta reached platform stability, so SDK and NDK APIs and app-facing behaviours were final, and the Pixel 7a joined the beta.'
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 3 came out on 7 June 2023 and reached platform stability: the
developer APIs and all app-facing behaviours were final. Google asked
developers to start final compatibility testing, and SDK, library and game
engine developers to ship first.

|                    |                                                               |
| ------------------ | ------------------------------------------------------------- |
| Release date       | 7 June 2023; Beta 3.1 on 14 June 2023                         |
| Build              | `UPB3.230519.008`; 3.1 `UPB3.230519.014`                      |
| Security patch     | May 2023; 3.1 June 2023                                       |
| Devices            | Pixel 4a (5G) to Pixel 7 Pro, plus the new Pixel 7a; emulator |
| How to get it      | Over the air through Android Beta, or by flashing             |
| Platform stability | Yes                                                           |

The post listed what to test. For all apps: font scaling to 200%, partial
photo access, which the system treats as a one-time permission once the app
goes to the background, and the data safety section in permission dialogs. For
apps targeting 34: foreground service types, OpenJDK 17 changes to regular
expressions and `UUID` handling, and the security changes such as the zip path
traversal check.

The foreground service list took its final shape here. `health` and
`remoteMessaging` were new types, and `shortService`, `specialUse` and
`systemExempted` were reserved for their cases.

Beta 3.1 fixed fingerprint unlock on some devices and crashes in apps that use
mapping SDKs.
