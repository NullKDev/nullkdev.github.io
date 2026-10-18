---
parentDomain: notes
parentId: notes-android-13-es
documentId: beta-3
locale: es
translationKey: android-13-beta-3
slug: beta-3
title: 'Android 13 Beta 3: estabilidad de plataforma'
summary: '8 de junio de 2022. La Beta 3 alcanzó la estabilidad de plataforma: el SDK y el NDK de API 33 y todo comportamiento hacia las apps quedaron finales, dos meses antes que Android 12.'
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 3 salió el 8 de junio de 2022 y llevó Android 13 a la estabilidad de
plataforma. Desde esta build el SDK y el NDK oficiales de API 33, los
comportamientos hacia las apps y las listas de interfaces no SDK quedaron
finales, así que los desarrolladores podían publicar actualizaciones de
compatibilidad sabiendo que la plataforma ya no cambiaría.

|                       |                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Fecha                 | 8 de junio de 2022; Beta 3.1 el 10 de junio, 3.2 el 16 de junio, 3.3 el 27 de junio       |
| Build                 | `TPB3.220513.017`; 3.1 `TPB3.220513.017.B1`; 3.2 `TPB3.220610.004`; 3.3 `TPB3.220617.002` |
| Parche de seguridad   | Junio de 2022                                                                             |
| Dispositivos          | Del Pixel 4 al Pixel 6 Pro; dispositivos de socios; Android Emulator; GSI                 |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando                                                    |
| Estabilidad de la API | Sí: API finales y comportamiento final hacia las apps                                     |

La única función que las notas de versión dan como nueva es copiar y pegar: la
vista previa del portapapeles, en la que las apps deben evitar mostrar
contraseñas. La lista de Google para todas las apps nombraba el permiso de
notificaciones, esa vista previa y el prefetch de `JobScheduler`.

En junio siguieron tres versiones menores. La Beta 3.1 devolvió la app Android
Beta Feedback. La Beta 3.2 corrigió apps que se cerraban al abrirse, el gesto
atrás que fallaba en algunas apps y el micrófono que se encendía y apagaba
solo. La Beta 3.3 corrigió un cierre de System UI con el gesto atrás, redes
Wi-Fi que no conectaban, teléfonos que dejaban de responder tras cargar toda la
noche y un kernel panic.
