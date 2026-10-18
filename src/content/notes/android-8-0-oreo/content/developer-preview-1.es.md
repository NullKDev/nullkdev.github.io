---
parentDomain: notes
parentId: notes-android-8-0-oreo-es
documentId: developer-preview-1
locale: es
translationKey: android-8-0-oreo-developer-preview-1
slug: developer-preview-1
title: 'Android O Developer Preview 1: solo por flasheo'
summary: 21 de marzo de 2017. La primera build de Android O, solo para desarrolladores y por flasheo manual, trajo límites en segundo plano, canales, autocompletado y PiP en teléfonos.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google publicó la primera developer preview de "Android O" el 21 de marzo de
2017, cinco meses antes de la versión final. El post de Dave Burke la
presentó como temprana: "there are more features coming, and there's still
plenty of stabilization and performance work ahead of us. But it's booting
:)".

|                       |                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| Fecha                 | 21 de marzo de 2017                                                                             |
| Build                 | `OPP1.170223.013`, según la etiqueta de AOSP "Android O Preview Release 1"                      |
| Dispositivos          | Nexus 5X, Nexus 6P, Nexus Player, Pixel, Pixel XL y Pixel C; Android Emulator; emulador de Wear |
| Cómo se obtenía       | Solo por descarga y flasheo manual; Android Beta todavía no estaba abierto para O               |
| Estabilidad de la API | No; las API seguían cambiando                                                                   |

Casi todo lo que define a Android 8.0 ya estaba en esta build: los límites
en segundo plano para broadcasts implícitos, servicios y actualizaciones de
ubicación; los canales de notificación; el framework de autocompletado; el
picture-in-picture en teléfonos y tablets; las fuentes como recurso XML; los
íconos adaptables; el color de gama amplia por actividad; Wi-Fi Aware y el
códec LDAC; la API nativa de audio AAudio, publicada como versión temprana
para recibir comentarios; el `WebView` multiproceso por defecto con Safe
Browsing, y `java.time`. Google pidió leer primero los límites en segundo
plano, porque "represent a significant change in Android".

El consejo de Google fue probar la app actual en la preview y publicar una
actualización compatible sin cambiar `targetSdkVersion`. La Support Library
26.0.0 salió ese día como alfa y subió su `minSdkVersion` a 14. Google
recibió los reportes de errores de la preview en Issue Tracker, la
herramienta que también usa internamente.
