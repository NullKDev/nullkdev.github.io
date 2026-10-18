---
parentDomain: notes
parentId: notes-android-5-0-lollipop-es
documentId: l-developer-preview
locale: es
translationKey: android-5-0-lollipop-l-developer-preview
slug: l-developer-preview
title: 'L Developer Preview: Android antes de salir'
summary: 26 de junio de 2014. La primera preview pública de una versión de Android, build LPV79, para Nexus 5, Nexus 7 (2013) y el emulador, sin nivel de API ni publicación en Play.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La L Developer Preview fue la primera vez que Google entregó a los
desarrolladores una versión de Android antes de su lanzamiento. Google la
anunció en la keynote de Google I/O el 25 de junio de 2014 y abrió las
descargas el 26 de junio. Su anuncio dice: "For the first time since we
launched Android, we're giving you early access to a development version of
an upcoming release."

|              |                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------- |
| Publicación  | 26 de junio de 2014 (las notas de la preview la fechan el 25, día de la keynote)               |
| Build        | `LPV79` (`hammerhead-lpv79-preview`, `razor-lpv79-preview`)                                    |
| Dispositivos | Nexus 5 (GSM/LTE) y Nexus 7 (2013) Wi-Fi, instalada a mano; imágenes del emulador              |
| Nivel de API | Ninguno. Las apps compiladas contra ella no se podían publicar en Google Play                  |
| SDK          | Herramientas del L Developer Preview SDK, imagen de emulador de 32 bits e imagen de Android TV |

## Qué incluía la L Developer Preview

Los anuncios de Google enumeran lo que se podía probar con meses de
anticipación: el tema Material, las notificaciones en la pantalla de bloqueo
y heads-up, Recents centrado en documentos, `JobScheduler` y Battery
Historian (Project Volta), el modo periférico de Bluetooth LE, la API
`android.hardware.camera2`, OpenGL ES 3.1 y el Android Extension Pack, las ABI
de 64 bits y ART como runtime por defecto. La imagen de emulador de 64 bits
se anunció como "coming soon".

Las notas de la preview advertían que `camera2` y `android.bluetooth.le` solo
funcionaban en el Nexus 5, y que `AudioTrack.write(float[], …)` todavía no
funcionaba. Google dijo que las API no eran definitivas y que había que
"expect minor API changes over time". La prueba de Android Police del mismo
día encontró la nueva pantalla de bloqueo y las notificaciones en tarjetas,
pero iconos de barra de estado al estilo KitKat y una versión que solo decía
"Android L".
