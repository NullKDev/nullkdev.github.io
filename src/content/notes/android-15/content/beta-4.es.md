---
parentDomain: notes
parentId: notes-android-15-es
documentId: beta-4
locale: es
translationKey: android-15-beta-4
slug: beta-4
title: 'Android 15 Beta 4: última beta, sin emoji PNG'
summary: 18 de julio de 2024. La última beta prevista fue la segunda build con estabilidad de plataforma. Quitó la fuente de emoji PNG; la Beta 4.2 llegó al Pixel 9 y 9 Pro XL en agosto.
order: 6
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 4 salió el 18 de julio de 2024. Fue la última beta prevista y la
segunda versión con estabilidad de plataforma. Trajo sobre todo correcciones,
antes de que el código llegara a AOSP el 3 de septiembre.

|                           |                                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| Fecha                     | 18 de julio de 2024; 4.1 el 29 de julio; 4.2 el 13 de agosto de 2024 (22 de agosto en Pixel 9 y 9 Pro XL) |
| Build                     | `AP31.240617.009`; 4.1 `AP31.240617.010`; 4.2 `AP31.240617.015`                                           |
| Parche de seguridad       | Julio de 2024; 4.2 agosto de 2024                                                                         |
| Dispositivos              | Pixel 6 a Pixel 8a, Pixel Fold, Pixel Tablet; Pixel 9 y 9 Pro XL desde la Beta 4.2                        |
| Cómo obtenerla            | Por OTA con Android Beta, o flasheando; imágenes para el emulador                                         |
| Estabilidad de plataforma | Sí                                                                                                        |

El único cambio nuevo fue quitar `NotoColorEmojiLegacy.ttf`, la fuente de
emoji PNG que se mantenía desde Android 13 para las apps con su propio motor
de fuentes. Google dio tres salidas: renderizar el texto con la plataforma,
usar una biblioteca compatible con COLRv1, como FreeType 2.13.0 o posterior,
o incluir la fuente antigua en la app, que pesa 10,1 MB.

La Beta 4.1 corrigió cierres del audio durante las llamadas. La Beta 4.2
corrigió dispositivos que tardaban en despertar, cierres y baja tasa de
fotogramas de la cámara, parpadeos de la interfaz y cierres de YouTube.
