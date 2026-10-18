---
parentDomain: notes
parentId: notes-android-8-0-oreo-es
documentId: developer-preview-2
locale: es
translationKey: android-8-0-oreo-developer-preview-2
slug: developer-preview-2
title: 'Android O Developer Preview 2: beta pública'
summary: 17 de mayo de 2017, en Google I/O. La primera build de calidad beta abrió Android Beta para O y sumó puntos de notificación, Autofill with Google y Smart Text Selection.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 2 salió el 17 de mayo de 2017, en Google I/O. Google la
llamó "our first beta-quality candidate, available to test on your primary
phone or tablet" y ese mismo día abrió el programa Android Beta para
Android O.

|                       |                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------- |
| Fecha                 | 17 de mayo de 2017                                                                  |
| Build                 | `OPP2.170420.017`                                                                   |
| Dispositivos          | Nexus 5X, Nexus 6P, Nexus Player, Pixel, Pixel XL y Pixel C; emulador               |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando la imagen de fábrica                         |
| Estabilidad de la API | No; las API cambiaron desde la Preview 1 y Google remitió al informe de diferencias |

## Qué sumó la Preview 2

- **Puntos de notificación** en los íconos del launcher, que según Google
  "work with zero effort for most apps", con el color del punto tomado del
  ícono.
- **Autofill with Google**: el autocompletado de Chrome llevado a las apps
  Android sobre el framework de autocompletado. Las apps pueden indicar qué
  dato espera cada campo.
- **Smart Text Selection**: aprendizaje automático en el dispositivo
  selecciona una dirección, URL, teléfono o correo completo y ofrece la app
  que corresponde.
- **Una nueva pantalla de inicio de Android TV** donde las apps publican
  canales, con la librería de soporte `TvProvider`.

Google también anunció TensorFlow Lite y una Neural Networks API para una
actualización de mantenimiento a fin de año, y mostró Android Go para
dispositivos con 1 GB de memoria o menos.

Las librerías de soporte pasaron del SDK Manager al repositorio Maven de
Google con la Support Library 26.0.0 beta. Los dispositivos inscritos en la
beta de Android N tenían que volver a inscribirse para recibir O, según
9to5Google.
