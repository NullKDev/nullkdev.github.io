---
parentDomain: notes
parentId: notes-android-16-es
documentId: beta-2
locale: es
translationKey: android-16-beta-2
slug: beta-2
title: 'Android 16 Beta 2: edge-to-edge sin salida'
summary: 13 de febrero de 2025. La segunda beta sumó controles de cámara profesionales y filtros AGSL, quitó la exclusión de edge-to-edge y reforzó la redirección de intents en toda app.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

La Beta 2 salió el 13 de febrero de 2025, tres semanas después de la Beta 1.
Fue la última beta antes de la estabilidad de plataforma, y trajo la mayoría
de los cambios de comportamiento que luego definieron apuntar a la API 36.

|                           |                                                                               |
| ------------------------- | ----------------------------------------------------------------------------- |
| Fecha                     | 13 de febrero de 2025; Beta 2.1 el 27 de febrero de 2025                      |
| Build                     | `BP22.250124.009`; Beta 2.1 `BP22.250124.010`                                 |
| Parche de seguridad       | Febrero de 2025                                                               |
| Dispositivos              | Pixel 6 y posteriores, Pixel Fold y Pixel Tablet; Android Emulator de 64 bits |
| Estabilidad de plataforma | No; prevista con la Beta 3                                                    |

## Qué agregó la Beta 2

- **Cámara.** Autoexposición híbrida, control preciso de temperatura de color
  y tinte, intents para capturar fotos en movimiento e imágenes UltraHDR en
  HEIC.
- **Gráficos.** Shaders AGSL como efectos de color y de mezcla
  (`RuntimeColorFilter`, `RuntimeXfermode`).
- **Rendimiento.** `SystemHealthManager.getCpuHeadroom()` y
  `getGpuHeadroom()` estiman cuánta CPU y GPU le queda a una app o un juego.
- **Compartir claves.** `KeyStoreManager` concede y revoca a otra app, por
  UID, el acceso a una clave del Android Keystore.
- **Otras.** Un ajuste "Measurement system" en las preferencias regionales,
  una API de contenido para fondos animados (`WallpaperDescription`,
  `WallpaperInstance`), un paquete `MediaQuality` para perfiles de imagen y
  audio en TV, y APIs de accesibilidad para duraciones en `TtsSpan`, elementos
  expandibles, barras de progreso indeterminadas y casillas de tres estados.

## Qué cambió la Beta 2

- **Edge-to-edge.** En apps con target 36,
  `windowOptOutEdgeToEdgeEnforcement` queda obsoleto y desactivado.
- **Permisos de salud.** En apps con target 36, `BODY_SENSORS` da paso a los
  permisos granulares de `android.permissions.health`.
- **Jobs abandonados.** Un job cuyo `JobParameters` es recolectado antes de
  `jobFinished()` se detiene con `STOP_REASON_TIMEOUT_ABANDONED`.
- **Redirección de intents.** Reforzada por defecto en toda app, sea cual sea
  su target; `removeLaunchSecurityProtection()` excluye un intent anidado.
- **Fuentes elegantes.** `elegantTextHeight` queda obsoleto y se ignora en
  apps con target 36.
- **Páginas de 16 KB.** Una app alineada a 4 KB en un dispositivo de 16 KB
  corre en un modo de compatibilidad y el usuario ve un diálogo;
  `android:pageSizeCompat` lo controla.

La Beta 2.1, una actualización de correcciones, llegó el 27 de febrero.
Corrigió dispositivos que a veces no entraban en Doze y reinicios
inesperados.
