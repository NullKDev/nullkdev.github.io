---
parentDomain: notes
parentId: notes-android-7-0-nougat-es
documentId: developer-preview-3
locale: es
translationKey: android-7-0-nougat-developer-preview-3
slug: developer-preview-3
title: 'Android N Developer Preview 3: calidad beta'
summary: 18 de mayo de 2016, en Google I/O. La primera build de N con calidad beta, apta para el teléfono principal, sumó VR Mode y FrameMetrics y postergó los atajos del launcher.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google anunció la Developer Preview 3 en Google I/O el 18 de mayo de 2016 como
"our first beta-quality candidate, available to test on your primary phone or
tablet". La build `NPD35K` tenía aprobación CTS en Nexus 5X, 6, 6P y Pixel C,
así que las apps que la exigen, como Android Pay, funcionaban. Llegó a todos
los dispositivos compatibles y al Sony Xperia Z3 (D6603 y D6653).

## Lo que sumó la Developer Preview 3

- **VR Mode**: un núcleo de CPU exclusivo para apps de VR, seguimiento de
  cabeza, notificaciones estereoscópicas y gráficos de baja latencia. Google
  midió una latencia de movimiento a fotón menor a 20 ms en un Nexus 6P.
- **Modo de rendimiento sostenido**: indicaciones del dispositivo para apps
  que corren mucho tiempo a un nivel estable. En esta vista previa solo se
  podía probar en el Nexus 6P.
- **API FrameMetrics**: un listener que transmite los tiempos de cada frame de
  la ventana de la app, para medir el rendimiento de la UI en producción sin
  USB.
- **Keyboard Shortcuts helper**: Meta+/ lista los atajos del sistema y de la
  app.
- **WebView multiproceso** tras una opción de desarrollador: el contenido web
  corre en un proceso aislado aparte desde WebView 51.

## Cambios de comportamiento en la Developer Preview 3

- **Atajos del launcher postergados.** Google sacó la función de N y avisó que
  `ShortcutManager` dejaría la API pública en la siguiente vista previa.
- **WebView**, para apps con target N: el contexto de JavaScript se reinicia en
  cada carga de página, y la geolocalización solo funciona en orígenes seguros
  (HTTPS).
- **Data Saver**: las apps pueden abrir un diálogo del sistema que las agrega a
  la lista de exenciones de Data Saver.
- **Bloqueo de números** por un llamador no autorizado ahora lanza
  `SecurityException` en lugar de `UnsupportedOperationException`.
- **Los tiles de Quick Settings** toman su modo del metadato
  `TileService.META_DATA_ACTIVE_TILE` en lugar del valor que devuelve
  `onTileAdded()`.
