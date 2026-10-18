---
parentDomain: notes
parentId: notes-android-8-0-oreo-es
documentId: developer-preview-3
locale: es
translationKey: android-8-0-oreo-developer-preview-3
slug: developer-preview-3
title: 'Android O Developer Preview 3: API 26 final'
summary: 8 de junio de 2017. La tercera preview congeló la API en el nivel 26, trajo el SDK final y permitió publicar en Google Play apps con target API 26.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 3 salió el 8 de junio de 2017 con "the final Android O
APIs". Desde esta build el nivel de API 26 ya no cambió, así que se podía
compilar contra él y publicar.

|                       |                                                                       |
| --------------------- | --------------------------------------------------------------------- |
| Fecha                 | 8 de junio de 2017                                                    |
| Build                 | `OPP3.170518.006`                                                     |
| Dispositivos          | Nexus 5X, Nexus 6P, Nexus Player, Pixel, Pixel XL y Pixel C; emulador |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando la imagen de fábrica           |
| Estabilidad de la API | Sí: nivel de API 26 final                                             |

## Qué significó la API final para los desarrolladores

- **SDK final.** El SDK de API 26 llegó por el SDK Manager, y la Support
  Library 26.0.0 beta 2 por el repositorio Maven de Google. Google recomendó
  poner `compileSdkVersion` en 26, y `targetSdkVersion` en 26 para probar
  los cambios de comportamiento de Android O.
- **Publicar en Play.** Las apps compiladas contra API 26, con o sin target
  API 26, podían ir a los canales alfa, beta y producción. Los dispositivos
  de Android Beta fueron los primeros en recibirlas.
- **Herramientas.** Android Studio 3.0, en el canal canary, traía el
  asistente de íconos adaptables y soporte para fuentes XML y descargables.
  Android Studio 2.3.3, en el canal estable, podía compilar para O sin esas
  herramientas.
- **Cambios de API.** Las API volvieron a cambiar desde la Preview 2; Google
  remitió al informe de diferencias para el código escrito contra las
  previews anteriores.

Google anunció "one more preview update coming in July" con imágenes de
sistema casi finales.
