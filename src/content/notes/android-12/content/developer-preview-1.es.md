---
parentDomain: notes
parentId: notes-android-12-es
documentId: developer-preview-1
locale: es
translationKey: android-12-developer-preview-1
slug: developer-preview-1
title: 'Android 12 Developer Preview 1: solo por flasheo'
summary: 18 de febrero de 2021. Primera build de Android 12, para desarrolladores. Exigió android:exported y mutabilidad en PendingIntent, y frenó foreground services desde segundo plano.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Google publicó la primera developer preview de Android 12 el 18 de febrero
de 2021, ocho meses antes del despliegue en Pixel. El post de Dave Burke la
llamó "just the start", y Android Beta no estaba abierto para ella.

|                       |                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| Fecha                 | 18 de febrero de 2021; Developer Preview 1.1 el 3 de marzo de 2021                                        |
| Build                 | `SPP1.210122.020.A3`; 1.1 `SPP1.210122.022`                                                               |
| Parche de seguridad   | Febrero de 2021; 1.1 marzo de 2021                                                                        |
| Dispositivos          | Pixel 3, 3a, 4, 4a, 4a 5G y 5; imágenes de 64 bits del Android Emulator; una build aparte para Android TV |
| Cómo se obtenía       | Flasheando una imagen de fábrica, o instalando una OTA en un Pixel con Android 11, sin borrar nada        |
| Estabilidad de la API | No; Google la esperaba para agosto de 2021                                                                |

Las reglas que luego definieron el target API 31 ya estaban aquí: los
componentes con un intent filter debían declarar `android:exported`, cada
`PendingIntent` necesitaba `FLAG_MUTABLE` o el nuevo `FLAG_IMMUTABLE`, y
los foreground services ya no podían arrancar desde segundo plano. Para
reemplazarlos, Google sumó los trabajos acelerados a `JobScheduler` y a
WorkManager. Los trampolines de notificación quedaron bloqueados para las
apps con target en la nueva plataforma, y todas las apps mostraban un toast
al usar uno.

La build también trajo la transcodificación compatible de HEVC a AVC, las
imágenes AVIF, `OnReceiveContentListener` para contenido enriquecido, la
háptica derivada de una sesión de audio y el comportamiento de cookies
`SameSite` en `WebView`. La restricción de la MAC de Netlink de Android 11
pasó a aplicarse a todas las apps, sin importar su target. ART se volvió un
módulo Mainline. La mayoría de los cambios de comportamiento se podían
activar uno por uno desde las opciones de desarrollador o con `adb`.

La Developer Preview 1.1 corrigió cortes de Wi-Fi, un cierre de System UI al
capturar pantalla desde la pantalla de bloqueo, el consumo de batería por
wake locks parciales y un lector de huellas que dejaba de responder.
