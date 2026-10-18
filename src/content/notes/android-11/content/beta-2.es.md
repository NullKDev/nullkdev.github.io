---
parentDomain: notes
parentId: notes-android-11-es
documentId: beta-2
locale: es
translationKey: android-11-beta-2
slug: beta-2
title: 'Android 11 Beta 2: Platform Stability'
summary: 8 de julio de 2020. La segunda beta llegó a Platform Stability, nueva en Android 11, con API, comportamientos y restricciones fuera del SDK finales dos meses antes.
order: 6
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 2 salió el 8 de julio de 2020 y llevó Android 11 a Platform Stability,
la etapa que Google agregó ese año "just for developers". Significaba que "all
app-facing surfaces and behaviors are now final": las API del SDK y del NDK, los
comportamientos del sistema y las restricciones de interfaces fuera del SDK.

|                       |                                                                 |
| --------------------- | --------------------------------------------------------------- |
| Fecha                 | 8 de julio de 2020                                              |
| Build                 | `RPB2.200611.009`                                               |
| Dispositivos          | Pixel 2, 3, 3a y 4, con sus modelos XL; Android Emulator        |
| Cómo se obtenía       | Por OTA con Android Beta, automática para quien tenía la Beta 1 |
| Estabilidad de la API | Sí, desde esta build                                            |

Google pidió a todos los desarrolladores de apps empezar las pruebas finales de
compatibilidad, y a los de SDK, bibliotecas y motores de juegos publicar primero,
porque las apps que dependen de ellos "may be blocked" hasta entonces. Los
cuatro cambios que listó para todas las apps fueron los permisos de una sola
vez, el fin del acceso a archivos de otras apps en el almacenamiento externo, el
asignador Scudo para código nativo y fdsan activado por defecto.

El 22 de julio llegó la Beta 2.5 (`RPB2.200611.012`). Corrigió la pérdida de
audio después de una llamada VoIP, reinicios aleatorios, el parpadeo de pantalla
con brillo bajo y un bloqueo que impedía volver a Android 10 en algunos Pixel 4.
