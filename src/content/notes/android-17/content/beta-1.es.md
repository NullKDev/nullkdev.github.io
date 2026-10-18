---
parentDomain: notes
parentId: notes-android-17-es
documentId: beta-1
locale: es
translationKey: android-17-beta-1
slug: beta-1
title: 'Android 17 Beta 1: directo a beta'
summary: 13 de febrero de 2026. La primera build de Android 17, sin Developer Preview antes, quitó la exclusión de orientación en pantallas grandes para apps con target API 37.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 1 fue la primera build de Android 17 que Google entregó a los
desarrolladores, el 13 de febrero de 2026. No hubo Developer Preview antes:
Google reemplazó esa fase con el canal Android Canary. Casi todo lo que luego
se rompe con `targetSdk 37` ya estaba en esta build.

|                           |                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------- |
| Fecha                     | 13 de febrero de 2026                                                                   |
| Build                     | `CP21.260116.011` (`.A1` para Pixel 6, 6 Pro, 6a, 7 y 7 Pro; `.B1` para el resto)       |
| Parche de seguridad       | 2026-01-05                                                                              |
| Dispositivos              | Teléfonos y tablets Pixel compatibles por OTA; imágenes de 64 bits del Android Emulator |
| Estabilidad de plataforma | Todavía no; Google apuntaba a marzo                                                     |

Google la describe como "suitable for development, testing, and general use",
con la advertencia de que el sistema y las apps "might not always work as
expected". Llegó a los Pixel dos días más tarde de lo previsto: 9to5Google
informó un retraso de dos días antes de que empezara el despliegue el día 13.

## Por qué no hubo Developer Preview

El post de Google sobre la Beta 1 dice que Android "has replaced the
traditional 'Developer Preview' with a continuous Canary channel". Las
funciones y APIs llegan a Canary en cuanto pasan las pruebas internas, Canary
se actualiza por OTA y la beta arranca más cerca de la versión final. El mismo
post fijó el plan del año: la versión de Q2 es la única con cambios de
comportamiento que rompen apps, y en Q4 llega un SDK menor.

## Cambios de comportamiento en la Beta 1

- **Pantallas grandes.** Las apps con target API 37 en pantallas con un ancho
  mínimo de 600dp o más ya no pueden excluirse del cambio de tamaño ni de
  orientación. Ahí se ignoran `screenOrientation`, `setRequestedOrientation()`,
  `resizeableActivity`, `minAspectRatio` y `maxAspectRatio`. Las apps que
  declaran `android:appCategory="game"` quedan exentas.
- **Menos reinicios de actividad.** `CONFIG_KEYBOARD`,
  `CONFIG_KEYBOARD_HIDDEN`, `CONFIG_NAVIGATION`, `CONFIG_TOUCHSCREEN`,
  `CONFIG_COLOR_MODE` y algunos cambios de `CONFIG_UI_MODE` ya no recrean la
  actividad; esta recibe `onConfigurationChanged()`.
  `android:recreateOnConfigChanges` recupera el comportamiento anterior.
- **`MessageQueue` sin locks** para apps con target 37. El código que usa
  reflexión sobre sus campos privados se rompe.
- **`static final` es final.** Cambiar uno por reflexión lanza
  `IllegalAccessException`; hacerlo por JNI cierra la app.
- **Vistas de notificación personalizadas** con límites de tamaño estrictos
  para apps con target 37, que cierran el atajo de usar URIs para saltarse los
  anteriores.
- **Audio en segundo plano.** La reproducción, las solicitudes de foco y los
  cambios de volumen fallan en silencio si la app no está en un estado de
  ciclo de vida válido. La Beta 4 suavizó luego esta regla.
- **Tráfico en texto plano.** Google anunció que `android:usesCleartextTraffic`
  queda obsoleto; las notas de versión dicen que entra en vigor con un nivel de
  SDK futuro, y que las apps deben pasar a una network security config.

## APIs nuevas en la Beta 1

- Disparadores de `ProfilingManager` para arranque en frío, OOM y uso
  excesivo de CPU.
- `CameraCaptureSession.updateOutputConfigurations()` cambia entre foto y
  video sin cerrar la sesión, y `LOGICAL_MULTI_CAMERA_ADDITIONAL_RESULTS`
  devuelve metadatos de cada cámara física activa.
- Soporte de H.266 (VVC) en dispositivos con decodificador por hardware, y
  `MediaRecorder.setVideoEncodingQuality()` para grabar con calidad constante.
- Una Service Provider Interface pública para cifrado híbrido HPKE.
- Perfiles de dispositivo médico y de pulsera de actividad en
  `CompanionDeviceManager`, y `setExtraPermissions()` para juntar los permisos
  de dispositivos cercanos en el diálogo de vinculación.

El post de Google también presentó el recolector de basura generacional de
ART como un cambio de Android 17. AOSP muestra que ya estaba activo en
Android 16 QPR2; ver "Para saber" en la vista general de arriba.
