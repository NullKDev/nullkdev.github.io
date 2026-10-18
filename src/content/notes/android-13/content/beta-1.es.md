---
parentDomain: notes
parentId: notes-android-13-es
documentId: beta-1
locale: es
translationKey: android-13-beta-1
slug: beta-1
title: 'Android 13 Beta 1: permisos de medios separados'
summary: 26 de abril de 2022. La primera beta abrió Android Beta antes de Google I/O y dividió READ_EXTERNAL_STORAGE en READ_MEDIA_IMAGES, READ_MEDIA_VIDEO y READ_MEDIA_AUDIO.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 1 salió el 26 de abril de 2022, dos semanas antes de Google I/O, donde
solían empezar las betas. Abrió Android Beta, así que quien quisiera probarla
podía inscribir un Pixel y recibir la build por OTA.

|                       |                                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| Fecha                 | 26 de abril de 2022                                                          |
| Build                 | `TPB1.220310.029`                                                            |
| Parche de seguridad   | Abril de 2022                                                                |
| Dispositivos          | Del Pixel 4 al Pixel 6 Pro; Android Emulator; GSI                            |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando; las previews se actualizaban por OTA |
| Estabilidad de la API | No; se seguía esperando para junio                                           |

- **Permisos de medios separados.** `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` y
  `READ_MEDIA_AUDIO` reemplazaron a `READ_EXTERNAL_STORAGE` para los medios
  compartidos en apps con target 13. Imágenes y video pedidos juntos comparten
  un solo diálogo.
- **Errores de Keystore y KeyMint.** Nuevas excepciones bajo
  `java.security.ProviderException` incluyen el código de error de KeyMint y
  dicen si conviene reintentar.
- **Ruta del audio.** `AudioManager.getAudioDevicesForAttributes()` y
  `getDirectProfilesForAttributes()` le dicen a una app multimedia por dónde
  va a salir su audio y si puede reproducirse de forma directa.
- **Los controles multimedia** pasaron a salir de las acciones de
  `PlaybackState`, y se quitó la copia heredada del servicio de voz de la app
  de Google.
