---
parentDomain: notes
parentId: notes-android-11-es
documentId: developer-preview-1
locale: es
translationKey: android-11-developer-preview-1
slug: developer-preview-1
title: 'Android 11 Developer Preview 1: solo por flasheo'
summary: 19 de febrero de 2020. La preview más temprana de Google hasta entonces, para Pixel 2 a 4 por flasheo, con permisos de una vez, burbujas, API de 5G y el plan de Platform Stability.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google publicó la primera developer preview de Android 11 el 19 de febrero de
2020, casi siete meses antes de la versión final. El post de Dave Burke dijo que
Google la publicaba "earlier than ever". Era "an early baseline build for
developers only".

|                       |                                                                    |
| --------------------- | ------------------------------------------------------------------ |
| Fecha                 | 19 de febrero de 2020                                              |
| Build                 | `RPP1.200123.016`                                                  |
| Dispositivos          | Pixel 2, 3, 3a y 4, con sus modelos XL; Android Emulator; GSI      |
| Cómo se obtenía       | Solo por descarga y flasheo manual; Android Beta no estaba abierto |
| Estabilidad de la API | No; las API seguían cambiando                                      |

Buena parte de Android 11 ya estaba ahí: los permisos de una sola vez para
ubicación, cámara y micrófono; la sección de conversaciones y la API de Bubbles;
imágenes en las respuestas rápidas de las notificaciones; estimaciones de
medición y ancho de banda en 5G; pantallas tipo cascada; NNAPI 1.3; el filtrado
de llamadas con el estado STIR/SHAKEN; HEIF animado y un decodificador de
imágenes nativo; decodificación de video de baja latencia, y el etiquetado de
punteros del heap para apps con target 11. El scoped storage sumó rutas de
archivo directas para multimedia y ediciones por lote en `MediaStore`, y Google
aclaró que sus reglas solo aplicarían cuando la app tuviera target Android 11.

Para la compatibilidad, la preview trajo interruptores por cambio en Developer
options y en adb, para probar una app sin cambiar `targetSdkVersion`. También
sumó una API pública Resource Loader, 12 módulos Mainline nuevos, y anunció una
etapa nueva, "Platform Stability", prevista para inicios de junio. Congelaría no
solo las API, sino "final internal APIs and system behaviors that may affect
apps".

El 4 de marzo llegó una actualización de correcciones, la Developer Preview 1.1
(`RPP1.200123.020`). Eliminó una excepción de seguridad para las apps que pedían
ubicación en primer plano junto con otro permiso, y relajó por un tiempo las
restricciones de interfaces fuera del SDK en algunos métodos que usa OkHttp.
