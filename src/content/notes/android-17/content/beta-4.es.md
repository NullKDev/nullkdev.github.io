---
parentDomain: notes
parentId: notes-android-17-es
documentId: beta-4
locale: es
translationKey: android-17-beta-4
slug: beta-4
title: 'Android 17 Beta 4: la última beta prevista'
summary: 16 de abril de 2026. La última beta prevista trajo límites de memoria según el RAM, un disparador de perfilado de anomalías y claves ML-DSA, y suavizó las reglas de audio.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, performance]
references: []
evidence: []
protection: { mode: public }
---

La Beta 4 salió el 16 de abril de 2026, tres semanas después de la Beta 3.
Google la llamó "the last scheduled beta of this release cycle". La superficie
de APIs ya estaba cerrada, así que trajo pocas APIs nuevas y un cambio que
nota toda app: los límites de memoria.

|                           |                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------- |
| Fecha                     | 16 de abril de 2026; Beta 4.1 el 1 de junio de 2026                                     |
| Build                     | `CP21.260330.008`; Beta 4.1 `CP21.260330.011`                                           |
| Parche de seguridad       | 2026-04-05; Beta 4.1 2026-05-05                                                         |
| Dispositivos              | Teléfonos y tablets Pixel compatibles por OTA; imágenes de 64 bits del Android Emulator |
| Estabilidad de plataforma | Sí, desde la Beta 3                                                                     |

## Qué agregó la Beta 4

- **Límites de memoria por app.** El sistema mata la app cuyo uso de memoria
  supera un límite que depende del RAM total del dispositivo. Google fijó los
  límites de forma conservadora en Android 17, para atrapar fugas extremas
  y casos atípicos. Una app afectada encuentra `"MemoryLimiter"` en
  `ApplicationExitInfo.getDescription()`. La parte sobre límites de memoria,
  más abajo, lo cubre a fondo.
- **`TRIGGER_TYPE_ANOMALY`.** Un nuevo disparador de `ProfilingManager`
  entrega a la app un heap dump cuando supera el límite de memoria, o una
  muestra de pilas de binder cuando hace demasiadas llamadas binder. El
  callback llega antes de que el sistema aplique cualquier medida.
- **ML-DSA en Android Keystore.** En dispositivos compatibles, las apps pueden
  generar claves `ML-DSA-65` y `ML-DSA-87` en hardware seguro con
  `KeyPairGenerator`, `KeyFactory` y `Signature`.
- **LeakCanary en Android Studio.** Android Studio Panda suma LeakCanary como
  una tarea del Profiler.

## Qué cambió la Beta 4

- **Audio en segundo plano, más flexible.** Tras los comentarios de los
  desarrolladores, Google limitó la exigencia de un servicio en primer plano
  con capacidad while-in-use a las apps con target 37 y eximió el audio de
  alarmas.
- **Loopback entre perfiles bloqueado.** El tráfico loopback entre perfiles
  deja de estar permitido por defecto, para toda app en Android 17. El tráfico
  dentro de un mismo perfil no cambia.

La Beta 4.1, una actualización de correcciones, llegó el 1 de junio. Android 17
salió el 16 de junio.
