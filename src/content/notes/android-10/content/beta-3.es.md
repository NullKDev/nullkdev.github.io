---
parentDomain: notes
parentId: notes-android-10-es
documentId: beta-3
locale: es
translationKey: android-10-beta-3
slug: beta-3
title: 'Android Q Beta 3: I/O, socios y tema oscuro'
summary: 7 de mayo de 2019. Publicada en Google I/O para 23 dispositivos de 13 fabricantes, la Beta 3 sumó el tema oscuro y los gestos, y relajó el almacenamiento acotado.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google publicó la Beta 3 el 7 de mayo de 2019, en Google I/O. Fue la primera
build fuera de los Pixel: 15 dispositivos de 12 fabricantes socios, Huawei,
Xiaomi, Nokia, Sony, Vivo, OPPO, OnePlus, ASUS, LGE, TECNO, Essential y realme.
Con todos los Pixel, sumaban 23 dispositivos de 13 fabricantes. Google
atribuyó el salto a Project Treble.

|                       |                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| Fecha                 | 7 de mayo de 2019                                                                                        |
| Build                 | `QPP3.190404.015` (Pixel), parche de seguridad de mayo de 2019                                           |
| Dispositivos          | Todos los Pixel, 15 dispositivos de socios listados en android.com/beta, Generic System Images, emulador |
| Cómo se obtenía       | Android Beta por OTA en los Pixel; el sitio de cada socio para los demás                                 |
| Estabilidad de la API | No; las API seguían cambiando                                                                            |

## Lo que la Beta 3 mostró a los usuarios

El tema oscuro del sistema llegó en esta build: en Settings > Display, como
mosaico de Quick Settings o al activar Battery Saver. Las apps sin tema oscuro
podían activar Force Dark con `android:forceDarkAllowed="true"`. Un nuevo modo
de navegación totalmente por gestos, en Settings > System > Gestures, eliminó
la barra de navegación: deslizar hacia arriba para Home, deslizar y mantener
para Recents, deslizar desde cualquiera de los bordes para Back. Las
notificaciones recibieron por defecto respuestas y acciones inteligentes
generadas por el sistema; las apps las desactivan por notificación con
`setAllowGeneratedReplies()` y `setAllowSystemGeneratedContextualActions()`.

## Cambios de comportamiento que la Beta 3 endureció o relajó

Los inicios de actividades en segundo plano pasaron de un toast de advertencia
a un bloqueo real. El almacenamiento acotado se relajó: Google había anunciado
el 25 de abril que, desde la Beta 3, las apps con target API 28 o menor no
verían cambios por defecto, con un atributo del manifiesto para activarlo
antes. El mismo post dijo que el almacenamiento acotado "will be required in
next year’s major platform release for all apps, independent of target SDK
level". TLS 1.3 quedó activo en todas las conexiones a través de Conscrypt,
sin importar el target. `WebViewRendererClient` pasó a llamarse
`WebViewRenderProcessClient`, y las notas de versión advirtieron de cierres en
apps cuyas bibliotecas de DRM o seguridad dependían de las rutas antiguas de
las bibliotecas de Bionic.

Google también anunció Project Mainline en I/O: componentes del sistema que se
actualizan desde Google Play sin una actualización completa del sistema, y que
según Google podrían recibir todos los dispositivos con Android Q o posterior.
