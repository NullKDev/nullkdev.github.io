---
parentDomain: notes
parentId: notes-android-15-es
documentId: developer-preview-1
locale: es
translationKey: android-15-developer-preview-1
slug: developer-preview-1
title: 'Android 15 Developer Preview 1: fs-verity, MIDI'
summary: 16 de febrero de 2024. La primera preview, solo para desarrolladores, trajo FileIntegrityManager, compartir una sola app, controles de flash y poca luz, MIDI 2.0 virtual y ADPF.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 1 salió el 16 de febrero de 2024. Era solo para
desarrolladores, se instalaba flasheando una imagen del sistema, y Google
anunció que esperaba la estabilidad de plataforma en junio de 2024.

|                           |                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------- |
| Fecha                     | 16 de febrero de 2024                                                           |
| Build                     | `AP31.240119.016`                                                               |
| Parche de seguridad       | Febrero de 2024                                                                 |
| Dispositivos              | Pixel 6, 6 Pro, 6a, 7, 7 Pro, 7a, 8 y 8 Pro, Pixel Fold, Pixel Tablet; emulador |
| Cómo obtenerla            | Flashear una imagen del sistema; todavía sin inscripción en Android Beta        |
| Estabilidad de plataforma | No                                                                              |

- **Integridad de archivos.** `FileIntegrityManager` suma APIs basadas en
  fs-verity del kernel, para que una app proteja archivos con sus propias
  firmas criptográficas y detecte si alguien los alteró.
- **Compartir una sola app.** Compartir o grabar la ventana de una app,
  activado primero en Android 14 QPR2, recibe callbacks de
  `MediaProjection`. Cada sesión de captura necesita ahora el consentimiento
  del usuario.
- **Cámara.** Extensiones para aclarar la vista previa con poca luz y para la
  intensidad del flash en los modos `SINGLE` y `TORCH`, en los dispositivos
  compatibles.
- **MIDI 2.0 virtual.** Los Universal MIDI Packets, admitidos por USB desde
  Android 13, llegan a las apps MIDI virtuales: una app de composición puede
  controlar una app de sintetizador.
- **ADPF.** Las hint sessions tienen un modo de ahorro de energía y pueden
  informar la duración del trabajo de GPU junto al de CPU; los umbrales de
  margen térmico ayudan a anticipar el throttling.
- **Módulos actualizables.** Ad Services pasa al nivel de extensión 10 con la
  última versión de Privacy Sandbox, Health Connect suma tipos de datos de
  ejercicio y nutrición, y nuevas APIs de OpenJDK llegan a Android 12 y
  posteriores por las actualizaciones del sistema de Google Play.

Google recomendó a quienes estaban en la beta QPR de Android 14 pasar de
inmediato a la Preview 1, porque una build QPR más reciente obligaría
después a borrar los datos.
