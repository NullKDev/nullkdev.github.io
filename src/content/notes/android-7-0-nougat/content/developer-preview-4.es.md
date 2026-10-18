---
parentDomain: notes
parentId: notes-android-7-0-nougat-es
documentId: developer-preview-4
locale: es
translationKey: android-7-0-nougat-developer-preview-4
slug: developer-preview-4
title: 'Android N Developer Preview 4: APIs finales'
summary: 15 de junio de 2016. El nivel de API 24 quedó final con el SDK de N, las apps podían publicarse en Google Play y los atajos del launcher salieron de la API pública.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 4, build `NPD56N`, salió el 15 de junio de 2016 con el
SDK final de Android N. Todas las APIs eran finales y el nivel de API era 24.
Desde ese día se podían publicar en Google Play, en los canales alpha, beta y
producción, apps compiladas contra API 24 y opcionalmente con API 24 como
target. Requería Android Studio 2.1.2 o superior, y la Support Library 24.0.0
llevaba las APIs de multiventana, notificaciones y Direct Boot a versiones
anteriores.

## Lo que cambió la Developer Preview 4

- **Atajos del launcher eliminados.** Como se anunció con la Preview 3, las
  APIs de `ShortcutManager` salieron de la API pública.
- **Atributos de multiventana renombrados:** `android:minimalHeight` y
  `android:minimalWidth` pasaron a ser `android:minHeight` y
  `android:minWidth`.
- **Escaneo Bluetooth LE:** una app que inicia y detiene escaneos más de cinco
  veces en 30 segundos queda bloqueada, y los escaneos largos pasan a ser
  oportunistas.
- **Los recursos de idioma** se negocian por cada objeto de recurso, en lugar
  de que la app arranque con todos sus recursos de idioma cargados.

La aprobación CTS cubría Nexus 5X, 6, 6P y Pixel C. La vista previa llegó a
todos los dispositivos compatibles, incluido el Sony Xperia Z3.
