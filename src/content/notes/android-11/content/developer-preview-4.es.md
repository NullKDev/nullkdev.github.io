---
parentDomain: notes
parentId: notes-android-11-es
documentId: developer-preview-4
locale: es
translationKey: android-11-developer-preview-4
slug: developer-preview-4
title: 'Android 11 Developer Preview 4: fuera de plan'
summary: 6 de mayo de 2020. Una cuarta preview no prevista llegó con un calendario nuevo que retrasó la Beta 1 y todas las etapas siguientes cerca de un mes, sin mover el final del Q3.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 4 no estaba en el plan original. Según 9to5Google, el
calendario de Google de febrero tenía tres previews y la Beta 1 en mayo. El 6 de mayo de 2020, Google
publicó una cuarta preview y movió "Beta 1 and all subsequent milestones by
about a month", sin cambiar la versión final, prevista para "later in Q3".

|                       |                                                          |
| --------------------- | -------------------------------------------------------- |
| Fecha                 | 6 de mayo de 2020                                        |
| Build                 | `RPP4.200409.015`                                        |
| Dispositivos          | Pixel 2, 3, 3a y 4, con sus modelos XL; Android Emulator |
| Cómo se obtenía       | Flasheo manual u OTA desde una preview anterior          |
| Estabilidad de la API | No; las API seguían cambiando                            |

El nuevo calendario puso la Beta 1, con las API finales del SDK y del NDK, el 3
de junio; la Beta 2, con Platform Stability, en julio, y la Beta 3, con builds
candidatas a versión final, en agosto. Sin Google I/O presencial ese año, Google planeó
para el 3 de junio un evento en línea, "#Android11: the Beta Launch Show".

La build trajo "the latest bug fixes, API tweaks, and features to try". Dos
cambios alcanzaron a las apps con target Android 11: ya no se instalaban con un
`resources.arsc` comprimido, y `getLine1Number()` en `TelephonyManager` y
`TelecomManager` pasó a exigir `READ_PHONE_NUMBERS`.
