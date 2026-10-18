---
parentDomain: notes
parentId: notes-android-15-es
documentId: beta-1
locale: es
translationKey: android-15-beta-1
slug: beta-1
title: 'Android 15 Beta 1: edge-to-edge por defecto'
summary: 11 de abril de 2024. La primera beta abrió Android Beta y puso edge-to-edge por defecto a las apps con target Android 15, con archivado, ProfilingManager y claves de contactos.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 1 salió el 11 de abril de 2024 y abrió el programa Android Beta:
cualquier Pixel compatible podía inscribirse y recibirla por OTA. En las dos
semanas siguientes llegaron dos actualizaciones menores.

|                           |                                                                       |
| ------------------------- | --------------------------------------------------------------------- |
| Fecha                     | 11 de abril de 2024; 1.1 el 22 de abril; 1.2 el 25 de abril de 2024   |
| Build                     | `AP31.240322.018`; 1.1 `AP31.240322.023`; 1.2 `AP31.240322.027`       |
| Parche de seguridad       | Abril de 2024                                                         |
| Dispositivos              | Pixel 6, 6 Pro, 6a, 7, 7 Pro, 7a, 8 y 8 Pro, Pixel Fold, Pixel Tablet |
| Cómo obtenerla            | Por OTA con Android Beta, o flasheando; imágenes para el emulador     |
| Estabilidad de plataforma | No                                                                    |

- **Edge-to-edge.** Las apps con target Android 15 dibujan detrás de las
  barras del sistema sin llamar a `enableEdgeToEdge()`. Los composables de
  Material 3 manejan los insets.
- **Archivado de apps.** Las apps con `REQUEST_DELETE_PACKAGES` pueden llamar
  a `PackageInstaller.requestArchive()`, que borra el APK y las cachés pero
  conserva los datos del usuario. Cualquier tienda de apps puede usarlo.
- **Profiling.** `ProfilingManager` recoge volcados y perfiles de heap y
  muestras de pila desde la propia app.
- **Seguridad.** `E2eeContactKeysManager` guarda las claves públicas de los
  contactos para el cifrado de extremo a extremo, y nuevas reglas limitan a
  las apps en segundo plano que traen otras apps al frente.
- **NFC y texto.** Las apps pueden recibir avisos de la actividad del ciclo de
  sondeo NFC en los dispositivos compatibles.
  `JUSTIFICATION_MODE_INTER_CHARACTER` justifica texto chino y japonés con
  espaciado entre letras.
- **Accesibilidad.** TalkBack admite pantallas braille que usan HID por USB y
  Bluetooth.

La Beta 1.1 corrigió fallos de NFC que rompían las apps de billetera. La Beta
1.2 corrigió bloqueos de apps, consumo excesivo de batería y un cierre de
Settings al agregar una huella.
