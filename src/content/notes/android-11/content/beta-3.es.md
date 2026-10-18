---
parentDomain: notes
parentId: notes-android-11-es
documentId: beta-3
locale: es
translationKey: android-11-beta-3
slug: beta-3
title: 'Android 11 Beta 3: candidata a versión final'
summary: 6 de agosto de 2020. La última beta fue una candidata a versión final para Pixel 2 a 4, luego el 4a, y dejó funcionar las apps de Exposure Notifications sin ubicación.
order: 7
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 3 salió el 6 de agosto de 2020, "our last update in this year's preview
cycle". Era una build candidata a versión final para los Pixel y el Android
Emulator, sobre las API y los comportamientos congelados desde la Beta 2.

|                       |                                                                        |
| --------------------- | ---------------------------------------------------------------------- |
| Fecha                 | 6 de agosto de 2020                                                    |
| Build                 | `RPB3.200720.005`                                                      |
| Dispositivos          | Pixel 2, 3, 3a y 4, con sus modelos XL; Pixel 4a desde el 24 de agosto |
| Cómo se obtenía       | Por OTA con Android Beta, con Android Flash Tool o por flasheo         |
| Estabilidad de la API | Sí, desde la Beta 2                                                    |

El único cambio que Google destacó fue para el Exposure Notifications System.
Desde la Beta 3, las apps basadas en él podían buscar dispositivos Bluetooth sin
la configuración de ubicación activada. Las demás apps seguían necesitando la
ubicación activada y un permiso de ubicación para buscar.

Entre las correcciones estuvo la visibilidad de paquetes: un intent filter para
navegadores pasó a hacer visibles solo las apps de navegador, no un conjunto más
amplio. Google dijo que la Beta 3 llegaría al Pixel 4a cuando saliera a la
venta; 9to5Google la vio en Android Beta el 24 de agosto. Android 11 salió el 8
de septiembre de 2020.
