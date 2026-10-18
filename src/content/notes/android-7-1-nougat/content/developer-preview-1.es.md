---
parentDomain: notes
parentId: notes-android-7-1-nougat-es
documentId: developer-preview-1
locale: es
translationKey: android-7-1-nougat-developer-preview-1
slug: developer-preview-1
title: 'Android 7.1 Developer Preview 1: API 25 final'
summary: 19 de octubre de 2016. La primera build de 7.1 para Nexus llegó con la API 25 ya final, así que se podían publicar en Google Play apps con target API 25 ese mismo día.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 1 llevó Android 7.1 a los Nexus el 19 de octubre de 2016,
dos semanas después de que el Pixel saliera con esa versión. Como 7.1 ya
estaba en un teléfono a la venta, Google la calificó de "beta quality" y dijo
que su objetivo era "to tease out any device-specific issues".

|                  |                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------- |
| Fecha            | 19 de octubre de 2016                                                              |
| Build            | `NPF10C`                                                                           |
| Dispositivos     | Nexus 5X, Nexus 6P y Pixel C, por OTA a través de Android Beta                     |
| Estado de la API | Final: "We've finalized the new APIs as API Level 25"                              |
| Google Play      | Abierto a apps compiladas contra la API 25 y, si se quería, con target 25          |
| SDK              | Plataforma API 25 e imágenes de emulador en el SDK Manager de Android Studio 2.2.2 |

A diferencia de las previews de Android 7.0, esta no empezó con APIs
inestables. El SDK de la API 25 fue final desde la primera build, así que una
app compilada contra él no necesitaba recompilarse para la versión final.
Google recomendó poner `targetSdkVersion` en 25 para probar "with
compatibility behaviors disabled".

La preview traía las funciones para desarrolladores que ya tenía el Pixel:
accesos directos, iconos redondos y teclados con imágenes. La imagen de
emulador Google APIs para la API 25 incluía el Pixel Launcher, para revisar
los iconos redondos. Las imágenes de los dispositivos incluían Messenger y
Google Keyboard, que ya usaban la API de teclados con imágenes. Con ella salió
la support library 25.0.0, que llevó los teclados con imágenes hasta la API 13
y sumó el widget `BottomNavigationView`.

En un Nexus 5X, 9to5Google encontró también cambios que el Pixel ya tenía
para el usuario: un botón más en la fila superior de Quick Settings, con un acceso a
Settings al lado, y una pantalla "Moves" con el gesto de doble giro para la cámara. Los
iconos redondos no aparecían ahí, ni siquiera con el Pixel Launcher instalado
a mano. El 3 de noviembre Google añadió la preview a los dispositivos
virtuales de Firebase Test Lab, gratis hasta fin de 2016.
