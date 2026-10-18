---
parentDomain: notes
parentId: notes-android-13-es
documentId: developer-preview-1
locale: es
translationKey: android-13-developer-preview-1
slug: developer-preview-1
title: 'Android 13 Developer Preview 1: privacidad'
summary: 10 de febrero de 2022. La primera build de Android 13, solo para desarrolladores, trajo el selector de fotos, el permiso NEARBY_WIFI_DEVICES, íconos temáticos e idioma por app.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google publicó la primera developer preview de Android 13 el 10 de febrero
de 2022, seis meses antes del despliegue en Pixel. Era una descarga manual para
desarrolladores; Android Beta no estaba abierto para ella. Google también dijo
que esta vez habría solo dos previews antes de la Beta 1.

|                       |                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------- |
| Fecha                 | 10 de febrero de 2022                                                               |
| Build                 | `TPP1.220114.016`                                                                   |
| Parche de seguridad   | Febrero de 2022                                                                     |
| Dispositivos          | Pixel 4, 4 XL, 4a, 4a (5G), 5, 5a 5G, 6 y 6 Pro; Android Emulator de 64 bits; GSI   |
| Cómo se obtenía       | Flasheando una imagen del sistema; las previews y betas siguientes llegaban por OTA |
| Estabilidad de la API | No; Google la esperaba para junio de 2022                                           |

El trabajo de privacidad empezó aquí. El selector de fotos del sistema permitía
compartir fotos y videos elegidos sin que la app tuviera un permiso de
almacenamiento, y Google planeaba llevarlo a Android 11 y posteriores con una
actualización del módulo MediaProvider. `NEARBY_WIFI_DEVICES`, del grupo
`NEARBY_DEVICES`, permitía a las apps de Wi-Fi escanear y conectarse sin
ubicación si declaraban `neverForLocation`.

Para desarrolladores la build sumó la API para ubicar tiles en Quick Settings,
los íconos temáticos (al principio en Pixel), una API de plataforma para el
idioma por app, separación silábica más rápida con las frecuencias `fullFast` y
`normalFast`, `RuntimeShader` con AGSL y las primeras actualizaciones de las
bibliotecas de OpenJDK 11. Bluetooth y Ultra-wideband pasaron a ser módulos
Mainline nuevos. La mayoría de los cambios de comportamiento se podían activar
uno por uno desde las opciones de desarrollador o con `adb`.
