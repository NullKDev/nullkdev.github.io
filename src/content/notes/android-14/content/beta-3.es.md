---
parentDomain: notes
parentId: notes-android-14-es
documentId: beta-3
locale: es
translationKey: android-14-beta-3
slug: beta-3
title: 'Android 14 Beta 3: estabilidad de plataforma'
summary: '7 de junio de 2023. La tercera beta alcanzó la estabilidad de plataforma: APIs del SDK y NDK y comportamiento hacia las apps cerrados. El Pixel 7a entró en la beta.'
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 3 salió el 7 de junio de 2023 y alcanzó la estabilidad de
plataforma: las APIs para desarrolladores y todo el comportamiento hacia las
apps quedaron cerrados. Google pidió empezar las pruebas finales de
compatibilidad, y a quienes desarrollan SDKs, librerías y motores de juego,
publicar primero.

|                       |                                                                   |
| --------------------- | ----------------------------------------------------------------- |
| Fecha                 | 7 de junio de 2023; Beta 3.1 el 14 de junio de 2023               |
| Build                 | `UPB3.230519.008`; 3.1 `UPB3.230519.014`                          |
| Parche de seguridad   | Mayo de 2023; 3.1 junio de 2023                                   |
| Dispositivos          | Del Pixel 4a (5G) al Pixel 7 Pro, más el nuevo Pixel 7a; emulador |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando                            |
| Estabilidad de la API | Sí                                                                |

El post listó qué probar. Para todas las apps: la escala de fuente hasta 200%,
el acceso parcial a fotos, que el sistema trata como un permiso de una sola vez
cuando la app pasa a segundo plano, y la sección de seguridad de los datos en
los diálogos de permisos. Para las apps con target 34: los tipos de foreground
service, los cambios de OpenJDK 17 en expresiones regulares y en el manejo de
`UUID`, y los cambios de seguridad como el control de path traversal en zip.

La lista de foreground services tomó su forma final aquí. `health` y
`remoteMessaging` fueron tipos nuevos, y `shortService`, `specialUse` y
`systemExempted` quedaron reservados para sus casos.

La Beta 3.1 corrigió el desbloqueo con huella en algunos dispositivos y cierres
en apps que usan SDKs de mapas.
