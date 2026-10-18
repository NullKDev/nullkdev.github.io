---
parentDomain: notes
parentId: notes-android-8-1-oreo-es
documentId: developer-preview-2
locale: es
translationKey: android-8-1-oreo-developer-preview-2
slug: vista-previa-2
title: 'Android 8.1 Developer Preview 2: Visual Core'
summary: 27 de noviembre de 2017. La última vista previa antes del lanzamiento trajo imágenes casi finales, el parche de noviembre de 2017 y Pixel Visual Core en el Pixel 2.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 2 salió el 27 de noviembre de 2017, la última vista
previa antes del lanzamiento de diciembre. Google la describió como imágenes
de sistema "near-final" con el nivel de API 27 oficial, las últimas
correcciones y el parche de seguridad de noviembre de 2017. Los dispositivos
ya inscritos en el Android Beta Program la recibieron por OTA "over the next
few days".

|                      |                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------- |
| Fecha                | 27 de noviembre de 2017                                                                |
| Build                | `OPP6.171019.012`                                                                      |
| Parche de seguridad  | Noviembre de 2017                                                                      |
| Dispositivos         | Pixel 2, Pixel 2 XL, Pixel, Pixel XL, Pixel C, Nexus 6P, Nexus 5X; el Android Emulator |
| Google Play services | 11.5.80                                                                                |

## Qué cambió la Developer Preview 2

- **Pixel Visual Core.** En el Pixel 2, una nueva opción de desarrollador
  activaba el coprocesador de imagen de Google, y las apps que usan la Camera
  API podían tomar fotos HDR+ con él. Es el cambio que conservó la versión
  final; ver "Qué trajo" arriba.
- **TensorFlow Lite.** El post de Google anunció TensorFlow Lite disponible
  ese mismo día, ejecutando modelos como MobileNets, Inception v3 y Smart
  Reply sobre la Neural Networks API.
- **Una corrección nombrada.** `ANeuralNetworksModel_identifyInputsAndOutputs()`,
  que faltaba en la Developer Preview 1, pasó a poder resolverse. Las notas de
  versión no listan otras correcciones ni cambios de API; el nivel de API 27
  ya era final.
