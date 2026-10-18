---
parentDomain: notes
parentId: notes-android-16-es
documentId: beta-1
locale: es
translationKey: android-16-beta-1
slug: beta-1
title: 'Android 16 Beta 1: apps adaptables, Live Updates'
summary: 23 de enero de 2025. La primera beta abrió Android Beta y trajo la regla de redimensionado en pantallas grandes, ProgressStyle, el códec APV y el atrás predictivo obligatorio.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 1 salió el 23 de enero de 2025. Fue la primera build de Android 16
para usuarios pioneros: los dueños de un Pixel podían inscribirse en Android
Beta y recibirla por OTA, y los teléfonos con la DP2 se actualizaron solos.

|                           |                                                                               |
| ------------------------- | ----------------------------------------------------------------------------- |
| Fecha                     | 23 de enero de 2025                                                           |
| Build                     | `BP22.250103.008`                                                             |
| Parche de seguridad       | Enero de 2025                                                                 |
| Dispositivos              | Pixel 6 y posteriores, Pixel Fold y Pixel Tablet; Android Emulator de 64 bits |
| Cómo se obtenía           | Por OTA con Android Beta, o flasheando una imagen del sistema                 |
| Estabilidad de plataforma | No; seguía prevista para marzo de 2025                                        |

## Qué agregó la Beta 1

- **Apps adaptables.** En pantallas de más de 600dp de ancho, las apps con
  target API 36 ven ignoradas sus restricciones de orientación y de tamaño.
  Los juegos quedan fuera, y las apps podían excluirse en 2025; Google dijo
  que la versión de 2026 quitaría esa opción. El flag de compatibilidad
  `UNIVERSAL_RESIZABLE_BY_DEFAULT` permitía probarlo sin apuntar a 36.
- **Live Updates.** Llegó `Notification.ProgressStyle`, con tramos, hitos e
  íconos propios. Google lo sugirió solo para viajes compartidos, comida a
  domicilio y navegación.
- **Cámara y multimedia.** El códec APV para video profesional, y
  `EXTENSION_NIGHT_MODE_INDICATOR`, que indica a una app cuándo pasar a una
  sesión de cámara en modo noche.
- **Texto vertical.** `Paint.VERTICAL_TEXT_FLAG` para bibliotecas que dibujan
  escrituras verticales.
- **Accesibilidad.** `setSupplementalDescription()` para grupos de vistas y
  `setFieldRequired()` para campos obligatorios de un formulario.
- **Medición de distancia.** `RangingManager` mide distancia y ángulo con
  channel sounding de Bluetooth, RSSI de Bluetooth, Ultra-Wideband o el
  tiempo de ida y vuelta de Wi-Fi.

## Qué cambió la Beta 1

- **Internos de ART.** El código que accede a estructuras internas de ART
  puede fallar en Android 16, y en versiones anteriores que reciben ART por
  las actualizaciones del sistema de Google Play.
- **Atrás predictivo.** En apps con target 36, `onBackPressed()` deja de
  llamarse; hay que migrar o excluirse. Con la navegación de tres botones,
  mantener presionado atrás muestra la animación predictiva en las apps
  migradas.
- **Tareas a frecuencia fija.** En apps con target 36, `scheduleAtFixedRate`
  ejecuta como mucho una ejecución perdida cuando la app vuelve.
- **Broadcasts ordenados.** `android:priority` solo ordena los receptores
  dentro de un mismo proceso.
