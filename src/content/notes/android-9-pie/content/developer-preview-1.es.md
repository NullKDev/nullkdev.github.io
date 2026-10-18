---
parentDomain: notes
parentId: notes-android-9-pie-es
documentId: developer-preview-1
locale: es
translationKey: android-9-pie-developer-preview-1
slug: developer-preview-1
title: 'Android P Developer Preview 1: primera build'
summary: 7 de marzo de 2018. Una build solo para desarrolladores y por flasheo que ya traía soporte de notch, los límites a apps inactivas, cleartext bloqueado y primeros avisos non-SDK.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google publicó la primera developer preview de "Android P" el 7 de marzo de
2018, cinco meses antes de la versión final. Dave Burke la llamó "an early
baseline build for developers only" y prometió más novedades para Google I/O
en mayo.

|                       |                                                                                   |
| --------------------- | --------------------------------------------------------------------------------- |
| Fecha                 | 7 de marzo de 2018                                                                |
| Build                 | `PPP1.180208.014`, según Droid Life; AOSP la etiqueta como `android-p-preview-1`  |
| Dispositivos          | Pixel, Pixel XL, Pixel 2 y Pixel 2 XL; Android Emulator                           |
| Cómo se obtenía       | Solo por descarga y flasheo manual; Android Beta todavía no estaba abierto para P |
| Estabilidad de la API | No; las API seguían cambiando                                                     |

La build trajo Wi-Fi RTT (IEEE 802.11mc) para ubicación en interiores, soporte
para el recorte de pantalla con `getDisplayCutout()` y
`layoutInDisplayCutoutMode`, una opción de desarrollador que simula ese
recorte, notificaciones `MessagingStyle` más completas, la API multicámara,
`ImageDecoder` y `AnimatedImageDrawable`, HDR VP9 y codificación HEIF, pistas
de costo de datos para `JobScheduler`, la Neural Networks API 1.1 y la Open
Mobile API de GlobalPlatform para elementos seguros.

Varios cambios de comportamiento clave ya estaban presentes. Las apps
inactivas perdían el micrófono, la cámara y los sensores. Network Security
Configuration bloqueaba el tráfico en texto plano por defecto. `Build.SERIAL`
pasó a requerir `READ_PHONE_STATE`, e instalar una app con target menor a API
17 mostraba un diálogo de advertencia. Usar interfaces non-SDK restringidas
mostraba un toast y una línea en el log. La autenticación por huella usaba una
nueva API `FingerprintDialog`, que el siguiente hito reemplazó.
