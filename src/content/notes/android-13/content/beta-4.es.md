---
parentDomain: notes
parentId: notes-android-13-es
documentId: beta-4
locale: es
translationKey: android-13-beta-4
slug: beta-4
title: 'Android 13 Beta 4: la release candidate'
summary: 13 de julio de 2022. La última beta fue una release candidate para Pixel y el emulador, sin novedades para desarrolladores; la Beta 4.1 llegó el 25 de julio con correcciones.
order: 6
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 4 salió el 13 de julio de 2022 como "a final update for your testing
and development". Era una build release candidate para Pixel y el Android
Emulator. Como la estabilidad de plataforma había llegado con la Beta 3, no
cambió ninguna API ni comportamiento; trajo correcciones y optimizaciones.

|                       |                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| Fecha                 | 13 de julio de 2022; Beta 4.1 el 25 de julio de 2022 (1 de agosto en el Pixel 6a)                |
| Build                 | `TPB4.220624.005`; 4.1 `TPB4.220624.008`, `TPB4.220624.008.A2` en el Pixel 6a                    |
| Parche de seguridad   | Julio de 2022                                                                                    |
| Dispositivos          | Del Pixel 4 al Pixel 6 Pro; el Pixel 6a desde la Beta 4.1; dispositivos de socios; emulador; GSI |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando                                                           |
| Estabilidad de la API | Sí, desde la Beta 3                                                                              |

La Beta 4.1 corrigió apps que no podían activar ni desactivar Bluetooth sin
`BLUETOOTH_CONNECT` aunque su target no lo exigía, cierres y reinicios en
algunas redes Wi-Fi, llamadas de Meet que se cortaban al conducir y lecturas
erróneas de datos de GPS. La versión final llegó a AOSP y a los Pixel el
15 de agosto de 2022.
