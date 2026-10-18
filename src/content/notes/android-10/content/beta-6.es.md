---
parentDomain: notes
parentId: notes-android-10-es
documentId: beta-6
locale: es
translationKey: android-10-beta-6
slug: beta-6
title: 'Android Q Beta 6: la release candidate'
summary: 7 de agosto de 2019. La última beta, una release candidate con el comportamiento final, limitó a 200dp la exclusión del gesto Back y sumó un ajuste de sensibilidad.
order: 6
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 6, "the last Beta update", salió el 7 de agosto de 2019. Las notas de
versión la llamaron "a release candidate build of Android Q" con "final system
behaviors". Android 10 llegó a los Pixel y a AOSP el 3 de septiembre de 2019.

|                       |                                                                             |
| --------------------- | --------------------------------------------------------------------------- |
| Fecha                 | 7 de agosto de 2019                                                         |
| Build                 | `QPP6.190730.005` (Pixel), parche de seguridad de agosto de 2019            |
| Dispositivos          | Los Pixel y el emulador; los dispositivos de socios "over the coming weeks" |
| Cómo se obtenía       | Android Beta por OTA, imágenes de sistema o Generic System Images           |
| Estabilidad de la API | Sí; API 29 final y comportamiento final del sistema                         |

Los cambios en los gestos afectaron directamente a las apps. Google fijó "a 200dp vertical app
exclusion limit for the Back gesture", un tope a cuánto borde de la pantalla
puede reservar una app para sus propios gestos. Los usuarios recibieron un ajuste de sensibilidad para el gesto
Back. Se eliminó la opción de desarrollador que desactivaba el bloqueo de los
inicios de actividades en segundo plano. 9to5Google también notó que la barra
de gestos ahora se ocultaba en la pantalla de inicio.

El último pedido de Google fue el mismo que desde la Beta 4: probar la app
actual en Android Q y publicar la actualización compatible antes del
lanzamiento al público.
