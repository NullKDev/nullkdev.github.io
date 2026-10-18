---
parentDomain: notes
parentId: notes-android-12-es
documentId: beta-4
locale: es
translationKey: android-12-beta-4
slug: beta-4
title: 'Android 12 Beta 4: estabilidad de plataforma'
summary: 11 de agosto de 2021. La cuarta beta alcanzó la estabilidad de plataforma, con las API, el comportamiento hacia las apps y las restricciones no-SDK congelados.
order: 7
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 4 salió el 11 de agosto de 2021 y alcanzó la estabilidad de
plataforma: las API del SDK y del NDK, el comportamiento del sistema hacia
las apps y las restricciones de interfaces no-SDK quedaron finales. Google
dijo que se podían publicar actualizaciones compatibles "knowing that the
platform won't change".

|                       |                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Fecha                 | 11 de agosto de 2021; Beta 4.1 el 25 de agosto de 2021                                    |
| Build                 | `SPB4.210715.011`; 4.1 `SPB4.210715.014`                                                  |
| Parche de seguridad   | Agosto de 2021                                                                            |
| Dispositivos          | Del Pixel 3 al Pixel 5; teléfonos de ASUS, OnePlus, Oppo, Realme, Sharp y ZTE; Android TV |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando                                                    |
| Estabilidad de la API | Sí                                                                                        |

El anuncio no sumó funciones. Enumeró qué probar: para todas las apps, el
panel de privacidad, los indicadores e interruptores, el aviso del
portapapeles, el overscroll elástico, las splash screens y la eliminación de
BouncyCastle; para las apps con target 31, el inicio de foreground services,
la ubicación aproximada, `SCHEDULE_EXACT_ALARM`, las cookies `SameSite` en
`WebView`, `android:exported`, las notificaciones personalizadas y los
trampolines de notificación. Google pidió a quienes hacen librerías, SDK y
motores de juego publicar primero, porque otros dependen de ellos.

La Beta 4.1 corrigió un bucle de arranque tras reiniciar, notificaciones
emergentes que no aparecían, los controles de volumen al transmitir y el
desbloqueo facial en algunos dispositivos.
