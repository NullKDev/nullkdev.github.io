---
parentDomain: notes
parentId: notes-android-10-es
documentId: beta-5
locale: es
translationKey: android-10-beta-5
slug: beta-5
title: 'Android Q Beta 5: ajustes a los gestos'
summary: 10 de julio de 2019. La Beta 5 acercó el sistema al comportamiento final y ajustó los gestos, con el gesto de esquina para el Asistente y un plan para launchers de terceros.
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 5 salió el 10 de julio de 2019. Google dijo que dejaba la beta "very
close to the system behaviors you'll see in the final release"; las API ya
eran finales desde la Beta 4.

|                       |                                                                             |
| --------------------- | --------------------------------------------------------------------------- |
| Fecha                 | 10 de julio de 2019                                                         |
| Build                 | `QPP5.190530.014` (Pixel), parche de seguridad de julio de 2019             |
| Dispositivos          | Los Pixel y el emulador; los dispositivos de socios "over the coming weeks" |
| Cómo se obtenía       | Android Beta por OTA, imágenes de sistema o Generic System Images           |
| Estabilidad de la API | Sí; API 29 final                                                            |

Casi todos los cambios fueron en la navegación por gestos. Deslizar desde
cualquiera de las esquinas inferiores pasó a abrir el Asistente, con
indicadores en las esquinas que Google todavía estaba ajustando. Las apps con
navigation drawer recibieron un "peek" cuando el usuario tomaba el borde, en
todas las versiones de `DrawerLayout` y mejor con la 1.1.0-alpha02.

Los launchers de terceros seguían con problemas de estabilidad con los gestos
y Recents. Google anunció que desde la Beta 6 el sistema pasaría a la
navegación de 3 botones por defecto a quienes usaran un launcher de terceros,
y que corregiría el resto en una actualización posterior al lanzamiento. El
post también dijo que habría una beta más antes del lanzamiento al público.
