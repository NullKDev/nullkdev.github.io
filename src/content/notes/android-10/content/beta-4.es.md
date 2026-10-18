---
parentDomain: notes
parentId: notes-android-10-es
documentId: beta-4
locale: es
translationKey: android-10-beta-4
slug: beta-4
title: 'Android Q Beta 4: API final, nivel 29'
summary: 5 de junio de 2019. La Beta 4 congeló las API en el nivel 29, publicó el SDK oficial de API 29 y abrió Google Play a las apps compiladas contra la API 29 o con ese target.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 4 salió el 5 de junio de 2019 con "the final Android Q APIs and
official SDK". Desde esta build, las API para desarrolladores quedaron fijas
en el nivel 29.

|                       |                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------- |
| Fecha                 | 5 de junio de 2019                                                                  |
| Build                 | `QPP4.190502.019` (Pixel), parche de seguridad de junio de 2019                     |
| Dispositivos          | Primero los Pixel y el emulador; los dispositivos de socios "over the coming weeks" |
| Cómo se obtenía       | Android Beta por OTA, imágenes de sistema o Generic System Images                   |
| Estabilidad de la API | Sí; API 29 final                                                                    |

El SDK oficial de API 29 funcionaba en Android Studio 3.4 estable, con la 3.5
Beta recomendada para el soporte más reciente de Android Q. Ese mismo día,
Google Play aceptó apps compiladas contra la API 29 o con ese target, para que
los desarrolladores pudieran publicar actualizaciones compatibles para los
usuarios de la beta.

La lista de Google para esta build: probar la app actual frente a los cambios
de privacidad, la navegación por gestos y las nuevas rutas del enlazador
dinámico para las bibliotecas de Bionic. Las apps que subían su target a la
API 29 también debían probar el almacenamiento acotado, el permiso de
ubicación para escaneos inalámbricos y el permiso para full-screen intents.
Google dijo que pronto llegarían las builds release candidate.

Del lado del usuario, 9to5Google contó cuatro colores de acento nuevos en esta
build: Cinnamon, Ocean, Space y Orchid.
