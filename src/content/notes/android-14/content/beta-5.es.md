---
parentDomain: notes
parentId: notes-android-14-es
documentId: beta-5
locale: es
translationKey: android-14-beta-5
slug: beta-5
title: 'Android 14 Beta 5: la última beta prevista'
summary: '10 de agosto de 2023. La última beta prevista, tercera con estabilidad de plataforma, seguida de tres actualizaciones de corrección antes de la versión estable del 4 de octubre.'
order: 7
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 5 salió el 10 de agosto de 2023, la última beta prevista y la
tercera build con estabilidad de plataforma. Las apps con target SDK 34 ya se
podían publicar en Google Play.

|                       |                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- |
| Fecha                 | 10 de agosto de 2023; 5.1 el 18 de agosto, 5.2 el 25 de agosto, 5.3 el 6 de septiembre |
| Build                 | `UPB5.230623.003`; 5.1 `.005`, 5.2 `.006` (`.A1` en Tablet y Fold), 5.3 `.009`         |
| Parche de seguridad   | Agosto de 2023                                                                         |
| Dispositivos          | Del Pixel 4a (5G) al Pixel 7a, Pixel Tablet y Pixel Fold                               |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando                                                 |
| Estabilidad de la API | Sí                                                                                     |

El post repitió los cambios para probar primero: el acceso parcial a fotos, los
intents de pantalla completa limitados a apps de llamadas y alarmas,
`SCHEDULE_EXACT_ALARM` negado por defecto y la escala de fuente hasta 200%.
Google anunció que las imágenes del emulador llegarían pronto.

La versión final tardó casi dos meses más, así que la Beta 5 recibió tres
actualizaciones de corrección. La 5.1 corrigió la detección de la SIM con
Fixed Dialing Numbers activado y cortes en 5G standalone. La 5.2 corrigió
bloqueos al reiniciar y problemas de huella en la Tablet y el Fold. La 5.3
corrigió cierres tras una notificación `CallStyle` y un camino lento al
limitar la CPU en segundo plano. Android 14 salió el 4 de octubre de 2023.
