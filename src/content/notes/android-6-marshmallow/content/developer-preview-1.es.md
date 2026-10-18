---
parentDomain: notes
parentId: notes-android-6-marshmallow-es
documentId: developer-preview-1
locale: es
translationKey: android-6-marshmallow-developer-preview-1
slug: developer-preview-1
title: 'M Developer Preview 1: Android M en I/O'
summary: 28 de mayo de 2015. La primera build de Android M, presentada en Google I/O, llevó permisos en tiempo de ejecución, App Links, Doze y las APIs de huella a cuatro Nexus.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google anunció Android M en Google I/O el 28 de mayo de 2015 y publicó la
primera vista previa para desarrolladores ese mismo día, justo después de la
keynote. La versión aún no tenía número ni nombre: el SDK la llamaba "Android
MNC Preview" y los proyectos compilaban contra ella con
`compileSdkVersion 'android-MNC'`.

|                      |                                                                          |
| -------------------- | ------------------------------------------------------------------------ |
| Fecha                | 28 de mayo de 2015                                                       |
| Build                | `MPZ44Q`                                                                 |
| Dispositivos         | Nexus 5, Nexus 6, Nexus 9 y Nexus Player, flasheando imágenes de sistema |
| Emulador             | x86 y ARM, 32 y 64 bits                                                  |
| Google Play services | 7.5                                                                      |
| Estado de la API     | APIs de vista previa, no finales; todavía sin nivel de API               |

## Lo que trajo la Preview 1

El anuncio de Google presentó M como una versión para "mejorar los
fundamentos". Los cambios principales para desarrolladores ya estaban en esta
build:

- **Permisos en tiempo de ejecución.** Las apps piden permisos en contexto
  mientras se ejecutan, y el usuario puede conceder o rechazar cada uno y
  cambiarlo después en ajustes. Google pidió a los desarrolladores contemplar
  los permisos que no se concedan.
- **App Links.** Un atributo `autoVerify` en el manifiesto permite que una app
  verificada abra sus propias URL sin el diálogo de elección de app.
- **Doze.** Cuando la detección de movimiento significativo indica que el
  dispositivo lleva un rato sin uso, Android reduce la actividad en segundo
  plano. Google recomendó a las apps de chat usar mensajes de alta prioridad
  para despertarlas.
- **Huella digital.** Nuevas APIs permiten a las apps autorizar con el sensor
  de huella, el mismo mecanismo de Android Pay y de las compras en Play.
- **Now on tap.** Las APIs de asistencia pasan la pantalla actual a Google
  Now; Google pidió implementar App Indexing para aparecer ahí.

Junto con la preview, Google publicó Android Studio 1.3 Preview, con edición y
depuración de C y C++ para el NDK, y la Android Design Support Library.

## El calendario previsto

Esta vez Google prometió un calendario claro. El sitio de la preview lo
detallaba: la Preview 2 a finales de junio o principios de
julio, la Preview 3, casi final, a finales de julio, y el SDK final más
adelante en el tercer trimestre. Los dispositivos con una build de preview
recibirían cada actualización por OTA.
