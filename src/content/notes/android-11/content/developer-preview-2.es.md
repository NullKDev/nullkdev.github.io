---
parentDomain: notes
parentId: notes-android-11-es
documentId: developer-preview-2
locale: es
translationKey: android-11-developer-preview-2
slug: developer-preview-2
title: 'Android 11 Developer Preview 2: primera OTA'
summary: 18 de marzo de 2020. La segunda preview llegó por OTA a quienes tenían la DP1 y sumó la API de estado 5G, el sensor de bisagra, los tipos camera y microphone y resume on reboot.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 2 salió el 18 de marzo de 2020, cuatro semanas después de
la primera. Seguía siendo solo para desarrolladores, pero quien ya tenía un Pixel
con la Developer Preview 1 o 1.1 la recibió por OTA. Android Flash Tool fue una
forma nueva y opcional de instalarla.

|                       |                                                                       |
| --------------------- | --------------------------------------------------------------------- |
| Fecha                 | 18 de marzo de 2020                                                   |
| Build                 | `RPP2.200227.009`                                                     |
| Dispositivos          | Pixel 2, 3, 3a y 4, con sus modelos XL; Android Emulator              |
| Cómo se obtenía       | Flasheo manual, Android Flash Tool u OTA desde la Developer Preview 1 |
| Estabilidad de la API | No; las API seguían cambiando                                         |

La build sumó una API de estado 5G para saber si el usuario está en una red 5G,
un sensor de ángulo de bisagra para plegables, y la opción de que las apps de
filtrado de llamadas informen por qué rechazaron una llamada. Los servicios en
primer plano ganaron los tipos `camera` y `microphone`, obligatorios para usar
cualquiera de los dos desde un servicio. El scoped storage recibió una vía para
migrar archivos desde el modelo anterior.

También trajo animaciones de teclado sincronizadas con
`WindowInsetsAnimationController` y un listener de animación de insets, una tasa
de fotogramas preferida por ventana para pantallas de frecuencia variable, y
resume on reboot: tras reiniciar por una OTA, las apps podían leer el
almacenamiento cifrado por credenciales antes de que el usuario desbloqueara el
dispositivo. El emulador sumó cámaras frontal y trasera.

El 2 de abril llegó la Developer Preview 2.1 (`RPP2.200227.014`), con
correcciones de cierres en la vista de apps recientes, la barra de estado y la
app de Settings.
