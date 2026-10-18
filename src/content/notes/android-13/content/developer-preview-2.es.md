---
parentDomain: notes
parentId: notes-android-13-es
documentId: developer-preview-2
locale: es
translationKey: android-13-developer-preview-2
slug: developer-preview-2
title: 'Android 13 Developer Preview 2: notificaciones'
summary: 17 de marzo de 2022. La segunda y última preview convirtió las notificaciones en un permiso en tiempo de ejecución, POST_NOTIFICATIONS, y sumó emoji COLRv1, LE Audio y MIDI 2.0.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 2 llegó el 17 de marzo de 2022, una semana después de
que la feature drop 12L llegara a AOSP. Los dispositivos con la Developer
Preview 1 la recibieron por OTA.

|                       |                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------ |
| Fecha                 | 17 de marzo de 2022                                                                  |
| Build                 | `TPP2.220218.010`                                                                    |
| Parche de seguridad   | Marzo de 2022                                                                        |
| Dispositivos          | Del Pixel 4 al Pixel 6 Pro, como en la Developer Preview 1; emulador de 64 bits; GSI |
| Cómo se obtenía       | Flasheando una imagen del sistema, o por OTA desde la Developer Preview 1            |
| Estabilidad de la API | No                                                                                   |

Aquí llegó el cambio que definió la versión: `POST_NOTIFICATIONS`. Las apps
con target Android 13 tenían que pedir permiso antes de publicar una
notificación, y el sistema manejaba el flujo de actualización para targets
anteriores. Google advirtió que ese flujo todavía se iba a ajustar.

La misma build sumó una API para devolver permisos ya concedidos, las marcas
`RECEIVER_EXPORTED` y `RECEIVER_NOT_EXPORTED` para receivers registrados en
tiempo de ejecución (recomendadas, no obligatorias), `BODY_SENSORS_BACKGROUND`,
el Foreground Services Task Manager, los jobs de prefetch en `JobScheduler` y
APK Signature Scheme v3.1. En texto trajo cortes por frase en japonés con
`android:lineBreakWordStyle="phrase"`, alturas de línea mayores para escrituras
no latinas en apps con target 13, APIs de conversión de texto y emoji
vectoriales COLRv1. Bluetooth LE Audio integrado y MIDI 2.0 por USB la
completaron.
