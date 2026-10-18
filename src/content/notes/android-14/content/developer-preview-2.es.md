---
parentDomain: notes
parentId: notes-android-14-es
documentId: developer-preview-2
locale: es
translationKey: android-14-developer-preview-2
slug: developer-preview-2
title: 'Android 14 Developer Preview 2: fotos elegidas'
summary: '8 de marzo de 2023. La segunda preview permitió compartir solo las fotos y videos elegidos, hizo de Credential Manager una API de plataforma y congeló antes las apps en caché.'
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 2 salió el 8 de marzo de 2023, todavía por descarga
manual para quienes empezaban y por OTA para quienes tenían la Preview 1. Fue
la última build antes de las betas.

|                       |                                                                             |
| --------------------- | --------------------------------------------------------------------------- |
| Fecha                 | 8 de marzo de 2023                                                          |
| Build                 | `UPP2.230217.004`                                                           |
| Parche de seguridad   | Marzo de 2023                                                               |
| Dispositivos          | Los mismos Pixel que la Preview 1; imágenes de 64 bits del Android Emulator |
| Cómo se obtenía       | Flasheando a mano, o por OTA desde la Preview 1                             |
| Estabilidad de la API | No                                                                          |

El cambio principal fue el acceso a fotos elegidas. Cuando una app pide
`READ_MEDIA_IMAGES` o `READ_MEDIA_VIDEO`, el usuario puede conceder solo los
elementos que elige, y `READ_MEDIA_VISUAL_USER_SELECTED` le permite a la app
volver a preguntar. Credential Manager pasó a ser una API de plataforma, con
una librería de Jetpack que llega hasta Android 4.4.

En las apps con target en la nueva plataforma, un `PendingIntent` mutable
creado a partir de un intent implícito ahora lanza una excepción, y las apps
deben aceptar de forma explícita compartir su derecho a iniciar actividades
desde segundo plano. En todas las apps, el trabajo en segundo plano se detuvo
pocos segundos después de pasar a caché, lo que Google describió como "an order
of magnitude faster than on Android 13". Las notificaciones con
`FLAG_ONGOING_EVENT` se pudieron descartar con el teléfono desbloqueado.

Las notas de versión suman la detección de capturas de pantalla, las
preferencias regionales como `getTemperatureUnit()`,
`killBackgroundProcesses()` limitado a los procesos de la propia app y el
nombre del dueño de los archivos multimedia ocultado. Las tiendas de apps
recibieron `requestUserPreapproval()`, `setRequestUpdateOwnership()`,
`setDontKillApp()` y la API `InstallConstraints`.
