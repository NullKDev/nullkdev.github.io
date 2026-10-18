---
parentDomain: notes
parentId: notes-android-11-es
documentId: developer-preview-3
locale: es
translationKey: android-11-developer-preview-3
slug: developer-preview-3
title: 'Android 11 Developer Preview 3: herramientas'
summary: 23 de abril de 2020. La tercera preview se centró en herramientas, con depuración inalámbrica, ADB Incremental, GWP-ASan para apps y cambios en las API de salidas y auditoría.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 3 salió el 23 de abril de 2020. Google la describió como
"bug fixes and a set of productivity improvements for developers". Los Pixel con
una preview anterior la recibieron por OTA.

|                       |                                                          |
| --------------------- | -------------------------------------------------------- |
| Fecha                 | 23 de abril de 2020                                      |
| Build                 | `RPP3.200320.017`                                        |
| Dispositivos          | Pixel 2, 3, 3a y 4, con sus modelos XL; Android Emulator |
| Cómo se obtenía       | Flasheo manual u OTA desde una preview anterior          |
| Estabilidad de la API | No; las API seguían cambiando                            |

Llegó la depuración inalámbrica, con el emparejamiento por código desde la línea
de comandos; el emparejamiento por QR desde Android Studio quedó para más
adelante. ADB Incremental instalaba APK de 2 GB o más "up to 10x faster", si
estaban firmados con el nuevo esquema de firma v4. En esta build solo funcionaba
en el Pixel 4, porque necesitaba un cambio en el sistema de archivos del
dispositivo.

GWP-ASan, un detector de errores de heap por muestreo, corría por defecto en los
binarios de la plataforma y en las apps del sistema, y las apps podían
activarlo. La API de motivos de salida de la app cambió según los comentarios de
los desarrolladores, y varias API de auditoría de acceso a datos cambiaron de
nombre.

Las apps con target Android 11 pasaron a necesitar `READ_PHONE_NUMBERS` en lugar
de `READ_PHONE_STATE` para leer números de teléfono. Volvieron las restricciones
de interfaces fuera del SDK que la Developer Preview 1.1 había relajado para
OkHttp, y Google pidió actualizar OkHttp.
