---
parentDomain: notes
parentId: notes-android-16-es
documentId: developer-preview-1
locale: es
translationKey: android-16-developer-preview-1
slug: developer-preview-1
title: 'Android 16 Developer Preview 1: dos SDK al año'
summary: 19 de noviembre de 2024. La primera build de Android 16, solo para desarrolladores, anunció un SDK mayor en el T2 y uno menor en el T4, y adelantó SDK_INT_FULL.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google publicó la primera developer preview de Android 16 el 19 de noviembre
de 2024, tres meses antes que las previews de febrero de las cinco versiones
anteriores. El motivo fue la fecha de lanzamiento: Google movió la versión
mayor del tercer al segundo trimestre de 2025, "to better align with the
schedule of device launches across our ecosystem".

|                           |                                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha                     | 19 de noviembre de 2024                                                                                                                 |
| Build                     | `BP21.241018.009`                                                                                                                       |
| Parche de seguridad       | Noviembre de 2024                                                                                                                       |
| Dispositivos              | Pixel 6, 6 Pro, 6a, 7, 7 Pro, 7a, Fold, Tablet, 8, 8 Pro, 8a, 9, 9 Pro, 9 Pro XL y 9 Pro Fold; imágenes de 64 bits del Android Emulator |
| Cómo se obtenía           | Solo por descarga manual: flasheando una imagen del sistema. Android Beta no estaba abierto                                             |
| Estabilidad de plataforma | No; Google la esperaba para marzo de 2025                                                                                               |

El anuncio presentó dos versiones de API en 2025. La mayor, en el segundo
trimestre, sería la única con cambios de comportamiento planificados ligados
a `targetSdkVersion`. Una versión menor en el cuarto trimestre sumaría APIs,
funciones y correcciones, pero ningún cambio de comportamiento que afectara a
las apps. Para detectar versiones menores, la DP1 adelantó `SDK_INT_FULL`, la
enumeración `VERSION_CODES_FULL` y `Build.getMinorSdkVersion()`, con la
advertencia de que "have not yet been finalized". El requisito de target API
de Google Play siguió siendo uno por año, ligado al nivel de API mayor.

Las APIs nuevas de esta build eran pocas. Las apps podían integrar el selector
de fotos en su propia jerarquía de vistas, sin perder su aislamiento de
proceso. Health Connect recibió una API de acceso anticipado para leer y
escribir registros médicos en formato FHIR. Y la build traía la última versión
de Privacy Sandbox en Android, con el SDK Runtime; Google retiró el SDK Runtime
y casi todas las demás tecnologías de Privacy Sandbox el 17 de octubre de 2025.

Un Pixel que ya tenía la Beta 1 de Android 15 QPR2 no podía pasar a esta
preview sin borrar sus datos.
