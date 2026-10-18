---
parentDomain: notes
parentId: notes-android-9-pie-es
documentId: beta-2
locale: es
translationKey: android-9-pie-beta-2
slug: beta-2
title: 'Android P Beta 2: la API 28 es final'
summary: 6 de junio de 2018. La Developer Preview 3 congeló el nivel de API 28, trajo el SDK oficial, abrió Google Play a apps con ese target y fijó qué interfaces non-SDK seguían abiertas.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 2 salió el 6 de junio de 2018, cuatro semanas después de Google I/O.
Google la describió como "an update that includes the final Android P APIs".
AOSP la etiqueta como `android-p-preview-3`, y 9to5Google la reportó como
Developer Preview 3.

|                       |                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------- |
| Fecha                 | 6 de junio de 2018                                                                       |
| Build                 | `PPP3.180510.008`, en el mensaje de la etiqueta de AOSP y en el reporte de 9to5Google    |
| Dispositivos          | Pixel, Pixel XL, Pixel 2 y Pixel 2 XL; los teléfonos de socios en las semanas siguientes |
| Cómo se obtenía       | Por aire con Android Beta, o flasheando la imagen de fábrica                             |
| Estabilidad de la API | Sí: nivel de API 28 y SDK oficial                                                        |

Con la API congelada, Google abrió Google Play a los APK compilados contra la
API 28 o con ese target, y pidió subir `targetSdkVersion` a 28 "as soon as
possible". Para una app que ya apuntaba a API 26 por la próxima regla de Play,
dijo, era "a small jump".

El 12 de junio Google explicó qué hacía la Beta 2 con las interfaces non-SDK.
La mayoría de las que reportaron los desarrolladores pasó a una greylist que
seguía disponible. Las apps con target API 28 solo podían usar la greylist;
las apps con target Oreo o inferior conservaban casi todo el acceso y
recibían advertencias en logcat. Google dijo que la Beta 2 debía "closely
match" la versión final en este punto.
