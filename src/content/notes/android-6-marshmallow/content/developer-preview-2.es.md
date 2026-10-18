---
parentDomain: notes
parentId: notes-android-6-marshmallow-es
documentId: developer-preview-2
locale: es
translationKey: android-6-marshmallow-developer-preview-2
slug: developer-preview-2
title: 'M Developer Preview 2: APIs casi finales'
summary: 9 de julio de 2015. La segunda preview rehízo el modelo de permisos, convirtió el almacenamiento externo en permiso de tiempo de ejecución y dejó el USB solo en carga.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

La Preview 2 llegó el 9 de julio de 2015, dentro del plazo de finales de junio
o principios de julio que Google había fijado. Google la describió como APIs
"near-final" con correcciones a partir de lo que reportaron los
desarrolladores. Casi todos sus cambios fueron en el modelo de permisos.

|                      |                                                              |
| -------------------- | ------------------------------------------------------------ |
| Fecha                | 9 de julio de 2015                                           |
| Build                | `MPZ79M` (Nexus 5, 6, 9); `MPZ79N` (Nexus Player)            |
| Dispositivos         | Los mismos cuatro Nexus; por OTA desde `MPZ44Q` o flasheando |
| Emulador             | x86 y ARM, 32 y 64 bits, desde el SDK Manager                |
| Google Play services | 7.6                                                          |
| Estado de la API     | Casi final                                                   |

## Cómo rehízo los permisos la Preview 2

- **Almacenamiento.** `WRITE_EXTERNAL_STORAGE` pasó a "dangerous", así que las
  apps deben pedirlo en tiempo de ejecución. Junto con
  `READ_EXTERNAL_STORAGE` forma el grupo `STORAGE`.
- **Huella digital.** `USE_FINGERPRINT` pasó a "normal" y ya no necesita la
  aprobación del usuario. No da acceso al registro de huellas.
- **Wi-Fi y Bluetooth.** `BLUETOOTH`, `BLUETOOTH_ADMIN`, `CHANGE_WIFI_STATE`,
  `CHANGE_WIMAX_STATE` y `CHANGE_WIFI_MULTICAST_STATE` pasaron a "normal".
  Leer la dirección MAC de un dispositivo Bluetooth o Wi-Fi remoto ahora exige
  `ACCESS_COARSE_LOCATION` o `ACCESS_FINE_LOCATION`.
- **Cuentas.** Algunos permisos de cuentas e identidad pasaron al grupo
  `CONTACTS`; `USE_CREDENTIALS`, `MANAGE_ACCOUNTS` y `AUTHENTICATE_ACCOUNTS`
  quedaron sin grupo a la espera de más cambios. Se eliminaron los permisos
  de marcadores y de feeds suscritos.
- **Apps del sistema.** Las apps de la imagen del sistema dejaron de recibir
  permisos peligrosos de forma automática.
- **Justificación.** `Activity.shouldShowRequestPermissionRationale(String)`
  indica si el usuario ya rechazó un permiso, para que la app explique por qué
  lo necesita.

## Otros cambios de la Preview 2

- Las conexiones USB quedan en solo carga por defecto; el usuario debe
  permitir el acceso a datos.
- `android.app.AssistContent` y `AssistStructure` pasaron al nuevo paquete
  `android.app.assist`.
- Los listeners del lápiz cambiaron de nombre: `View.OnContextClickListener` y
  `GestureDetector.OnContextClickListener` sustituyen a las versiones
  `OnStylusButtonPress`.
- `InputDevice.hasMicrophone()` indica si un dispositivo de entrada tiene
  micrófono.

El tema de sistema "Dark" de la Preview 1 desapareció. 9to5Google citó después
a un empleado de Google en el issue tracker de la preview: "This will not be
included in the M release."
