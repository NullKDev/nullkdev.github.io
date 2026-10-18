---
parentDomain: notes
parentId: notes-android-6-marshmallow-es
documentId: developer-preview-3
locale: es
translationKey: android-6-marshmallow-developer-preview-3
slug: developer-preview-3
title: 'M Developer Preview 3: SDK final y nombre'
summary: 17 de agosto de 2015. La última preview trajo el SDK oficial de Android 6.0 con API 23, dio a la versión el nombre Marshmallow y abrió Google Play a las apps con ese target.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Preview 3 salió el 17 de agosto de 2015, con el SDK oficial de Android 6.0.
El mismo anuncio le dio a la versión el nombre Marshmallow y la fijó en el
nivel de API 23. Google Play empezó a aceptar apps con target API 23 en todos
los canales: Alpha, Beta y Production.

|                      |                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------- |
| Fecha                | 17 de agosto de 2015                                                                    |
| Build                | `MPA44I`                                                                                |
| Dispositivos         | Nexus 5, Nexus 6, Nexus 9 y Nexus Player, por OTA o flasheando                          |
| Emulador             | x86 y ARM, 32 y 64 bits; SDK de Android 6.0 desde el SDK Manager                        |
| Google Play services | 7.8                                                                                     |
| Estado de la API     | Final, nivel de API 23; imágenes de sistema casi finales, no pensadas para consumidores |

Llegó tarde. El plan era tenerla casi final a finales de julio; el 31 de julio
Android Police informó que Google no cumpliría esa fecha. Las primeras
imágenes de la Preview 3 eran la build `MPA44G`, y Google las sustituyó ese
mismo día por `MPA44I`, la build que el sitio de la preview registra como
Preview 3.

## Lo que cerró la Preview 3

Google calificó los cambios de API desde la Preview 2 como "fairly
incremental":

- **Interfaz de permisos.** Los diálogos y los ajustes de permisos tomaron su
  forma final, con algunos cambios de comportamiento.
- **`GET_ACCOUNTS`.** Entró al grupo `CONTACTS` como "dangerous", así que las
  apps con target API 23 deben pedirlo en tiempo de ejecución. `READ_PROFILE`
  y `WRITE_PROFILE` salieron del grupo `CONTACTS`.
- **Escaneos de Wi-Fi y Bluetooth LE.** Las apps con target API 23 necesitan
  un permiso de ubicación para recibir resultados. Las apps con target API 22
  o menor los siguen recibiendo, pero solo en primer plano.
- **API de huella digital.** Mejor reporte de errores, mejor flujo de registro
  de huellas y soporte de enumeración.

La Support Library 23 salió el mismo día, con las nuevas bibliotecas
`customtabs`, `percent`, `recommendation` y `preference`, y ayudas compatibles con
versiones anteriores para las APIs de permisos y de huella.

Las builds de preview no podían recibir actualizaciones de consumo. Para
obtener la versión pública, que llegó a los Nexus el 5 de octubre, había que
flashear a mano una imagen de fábrica.
