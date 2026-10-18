---
parentDomain: notes
parentId: notes-android-8-1-oreo-es
documentId: developer-preview-1
locale: es
translationKey: android-8-1-oreo-developer-preview-1
slug: vista-previa-1
title: 'Android 8.1 Developer Preview 1: APIs finales'
summary: 25 de octubre de 2017. La primera build de Android 8.1 ya traía el nivel de API 27 final, así que Google Play aceptó apps con ese target el mismo día.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 1 fue la primera build de Android 8.1, publicada el
25 de octubre de 2017. Ya tenía las APIs finales: Google dijo que el nivel de API 27 estaba
"already finalized" y ese día abrió Google Play a las apps compiladas contra
él o con ese target.

|                           |                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Fecha                     | 25 de octubre de 2017                                                                                                |
| Build                     | `OPP5.170921.005`                                                                                                    |
| Dispositivos              | Pixel 2, Pixel 2 XL, Pixel, Pixel XL, Pixel C, Nexus 5X y Nexus 6P, con el Android Beta Program; el Android Emulator |
| Google Play services      | 11.5.76                                                                                                              |
| Estabilidad de plataforma | Sí, desde esta build: el nivel de API 27 era final                                                                   |

El post de Google nombró cuatro áreas de API: las optimizaciones de memoria
de Android Go y las constantes de hardware para equipos con poca RAM, la
Neural Networks API en el NDK, cambios de Autofill como
`setAutofillOptions()` para spinners, y la API `SharedMemory`. Las notas de
versión suman un cambio de Wear que salió a la vez: el fragmento sin interfaz
`AmbientMode`, con el que una app de Wear ya no necesita extender
`WearableActivity` para seguir visible en modo ambiente. Google recomendó
Android Studio 3.0 y la Support Library 27.0.0 para compilar contra API 27.

## Problemas conocidos de la Developer Preview 1

- **Imágenes de fábrica del Pixel 2.** Un problema de configuración del
  bootloader impedía instalar esta build en un Pixel 2; Google indicó a sus
  dueños que se inscribieran en el Android Beta Program.
- **Neural Networks API.** `ANeuralNetworksModel_identifyInputsAndOutputs()`
  no se podía resolver en esta build. La Developer Preview 2 lo corrigió.
- **Pixel Visual Core.** Los dueños de un Pixel 2 todavía no podían probarlo.
  Android Police informó el 1 de noviembre que la opción de desarrollador
  "Camera HAL HDR+" solo aparecía en builds de depuración, y que Google había
  cambiado sus notas para decir que las pruebas empezarían con la Developer
  Preview 2.
