---
parentDomain: notes
parentId: notes-android-5-0-lollipop-es
documentId: final-preview-images
locale: es
translationKey: android-5-0-lollipop-final-preview-images
slug: imagenes-preview-finales
title: 'SDK final e imágenes preview LPX13D'
summary: 17 de octubre de 2014. El SDK final de Android 5.0 con API 21, Play abierto a las apps con ese target y una última build preview, LPX13D, para Nexus 5 y Nexus 7 (2013).
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

El 17 de octubre de 2014, dos días después de anunciar Lollipop, Google
publicó el SDK final de Android 5.0 y una última build preview, `LPX13D`,
para Nexus 5 y Nexus 7 (2013) Wi-Fi. Las API quedaron definitivas en el nivel
21, y Google Play aceptó apps con `targetSdkVersion` 21 desde ese día. La
imagen del sistema para usuarios llegó dos semanas después.

El SDK sumó imágenes de emulador x86 de 32 y 64 bits, la biblioteca v7
`appcompat` con el tema Material para versiones anteriores, la biblioteca v17
`leanback` para TV y el NDK r10c. Google advirtió que "APIs have changed
between the preview SDK and the final SDK": las apps compiladas contra la
preview debían recompilarse, y los paquetes `android-L` borrarse.

Las imágenes `LPX13D` no tenían OTA: había que borrar el dispositivo e instalarlas a mano, y Google aclaró que "only have the minimal apps pre-installed" (solo traen las apps mínimas). Para recibir la actualización de noviembre había que volver a una imagen de fábrica.
GSMArena informó de la build el mismo día.
