---
entryId: notes-android-12-es
locale: es
translationKey: android-12
slug: android-12
title: 'Android 12: Material You y panel de privacidad'
summary: API 31, octubre de 2021. El fondo de pantalla tiñó el sistema, un panel mostró quién usó ubicación, cámara y micrófono, y con target 31 había que declarar exported y PendingIntent.
visibility: public
maturity: stable
publishedAt: 2026-10-17
topics: [android, platform-apis, security]
image: /banners/android-12.svg
imageAlt: 'Banner de Android 12 Snow Cone, con el logo de la versión.'
links:
  - label: Funciones y APIs de Android 12
    href: https://developer.android.com/about/versions/12/features
    kind: publication
  - label: 'Cambios de comportamiento: apps con target Android 12'
    href: https://developer.android.com/about/versions/12/behavior-changes-12
    kind: publication
references: []
evidence: []
documents: []
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-versions
  order: 13
citations:
  - title: Android 12 features and APIs
    url: https://developer.android.com/about/versions/12/features
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 12)'
    url: https://developer.android.com/about/versions/12/behavior-changes-all
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 12'
    url: https://developer.android.com/about/versions/12/behavior-changes-12
    accessedAt: 2026-10-17
  - title: Foreground service launch restrictions (Android 12)
    url: https://developer.android.com/about/versions/12/foreground-services
    accessedAt: 2026-10-17
  - title: Explain access to more sensitive information
    url: https://developer.android.com/training/permissions/explaining-access
    accessedAt: 2026-10-17
  - title: Bluetooth permissions
    url: https://developer.android.com/develop/connectivity/bluetooth/bt-permissions
    accessedAt: 2026-10-17
  - title: Request permission to access nearby Wi-Fi devices
    url: https://developer.android.com/develop/connectivity/wifi/wifi-permissions
    accessedAt: 2026-10-17
  - title: Schedule alarms
    url: https://developer.android.com/develop/background-work/services/alarms/schedule
    accessedAt: 2026-10-17
  - title: App hibernation
    url: https://developer.android.com/topic/performance/app-hibernation
    accessedAt: 2026-10-17
  - title: Splash screens
    url: https://developer.android.com/develop/ui/views/launch/splash-screen
    accessedAt: 2026-10-17
  - title: Receive rich content
    url: https://developer.android.com/develop/ui/views/receive-rich-content
    accessedAt: 2026-10-17
  - title: Sensors overview (rate limiting)
    url: https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview
    accessedAt: 2026-10-17
  - title: Android 12 release notes (AOSP)
    url: https://source.android.com/docs/setup/about/android-12-release
    accessedAt: 2026-10-17
  - title: Modular system components (AOSP)
    url: https://source.android.com/docs/core/ota/modular-system
    accessedAt: 2026-10-17
  - title: Codenames, tags, and build numbers (AOSP)
    url: https://source.android.com/docs/setup/reference/build-numbers
    accessedAt: 2026-10-17
  - title: Build.java at android-12.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-12.0.0_r1/core/java/android/os/Build.java
    accessedAt: 2026-10-17
  - title: frameworks/base commit log at android-12.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+log/refs/tags/android-12.0.0_r1
    accessedAt: 2026-10-17
  - title: AndroidManifest.xml (framework permissions) at android-12.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-12.0.0_r1/core/res/AndroidManifest.xml
    accessedAt: 2026-10-17
  - title: ThemeOverlayController.java at android-12.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-12.0.0_r1/packages/SystemUI/src/com/android/systemui/theme/ThemeOverlayController.java
    accessedAt: 2026-10-17
  - title: PlatLogoActivity.java at android-12.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-12.0.0_r1/core/java/com/android/internal/app/PlatLogoActivity.java
    accessedAt: 2026-10-17
  - title: EasterEgg strings.xml at android-12.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-12.0.0_r1/packages/EasterEgg/res/values/strings.xml
    accessedAt: 2026-10-17
  - title: Android 12 is live in AOSP!
    url: https://android-developers.googleblog.com/2021/10/android-12-is-live-in-aosp.html
    accessedAt: 2026-10-17
  - title: Android 12 is here (The Keyword)
    url: https://blog.google/products-and-platforms/platforms/android/android-12/
    accessedAt: 2026-10-17
  - title: 'Android 12 Beta: Designed for you (The Keyword)'
    url: https://blog.google/products-and-platforms/platforms/android/android-12-beta/
    accessedAt: 2026-10-17
  - title: Introducing Android's Private Compute Services
    url: https://security.googleblog.com/2021/09/introducing-androids-private-compute.html
    accessedAt: 2026-10-17
  - title: 'More personal, more powerful: Meet Pixel 6 and Pixel 6 Pro (The Keyword)'
    url: https://www.blog.google/products/pixel/meet-pixel-6-pixel-6-pro/
    accessedAt: 2026-10-17
  - title: The latest ART work on hundreds of millions of devices
    url: https://android-developers.googleblog.com/2023/08/latest-artwork-on-hundreds-of-millions-of-devices.html
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps (Play Console Help, archived 6 April 2022)
    url: https://web.archive.org/web/20220406212336/https://support.google.com/googleplay/android-developer/answer/11926878
    accessedAt: 2026-10-17
  - title: "Expanding Play's Target Level API Requirements to Strengthen User Security"
    url: https://android-developers.googleblog.com/2022/04/expanding-plays-target-level-api-requirements-to-strengthen-user-security.html
    accessedAt: 2026-10-17
  - title: 'Android 12: The Ars Technica Review'
    url: https://arstechnica.com/gadgets/2021/11/android-12-the-ars-technica-review/
    accessedAt: 2026-10-17
  - title: Android 12 officially has a dessert name (TechRadar, embeds Dave Burke's post)
    url: https://www.techradar.com/news/android-12-officially-has-a-dessert-name-and-we-now-know-what-it-is
    accessedAt: 2026-10-17
  - title: "Android 12 officially brings back the dessert names with 'Snow Cone' (Android Central)"
    url: https://www.androidcentral.com/android-12-snow-cone-dessert-name
    accessedAt: 2026-10-17
  - title: 'File:Android 12 Logo.svg (Wikimedia Commons)'
    url: https://commons.wikimedia.org/wiki/File:Android_12_Logo.svg
    accessedAt: 2026-10-17
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
---

Android 12 es la versión en la que el fondo de pantalla eligió los colores de
todo el sistema. Al usuario le trajo Material You, un panel de privacidad e
interruptores que apagan la cámara y el micrófono para todas las apps. A las
apps con target API 31 les exigió `android:exported` y la mutabilidad de cada
`PendingIntent`, y les impidió iniciar servicios en primer plano desde segundo
plano.

![El logotipo de Android 12: la palabra android seguida del número 12, en negro](./assets/android-12-logo.svg 'Logo de Android 12, sobre una placa clara. Wikimedia Commons · Dominio público (PD-textlogo) · Marca registrada de Google LLC')

## De un vistazo

|                                    |                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| Versión                            | Android 12                                                                                |
| Nivel de API                       | 31                                                                                        |
| Nombre                             | Snow Cone, nombre en clave interno. Nombre público: Android 12                            |
| `Build.VERSION_CODES`              | `S`                                                                                       |
| Lanzamiento                        | Despliegue en Pixel desde el 19 de octubre de 2021                                        |
| Dispositivos de lanzamiento        | Pixel 6 y Pixel 6 Pro, anunciados el 19 de octubre de 2021, en tiendas desde el 28        |
| Plazo de target API en Google Play | Apps nuevas desde el 1 de agosto de 2022, actualizaciones desde el 1 de noviembre de 2022 |

Google publicó el código de Android 12 en AOSP el 4 de octubre de 2021. Los
teléfonos esperaron dos semanas más: el despliegue empezó el 19 de octubre, para
el Pixel 3 en adelante, el mismo día en que Google anunció el Pixel 6 y el Pixel
6 Pro. Google nombró a Samsung, OnePlus, Oppo, realme, Tecno, Vivo y Xiaomi para
más adelante en el año. El primer build, `SP1A.210812.015`, cubrió del Pixel 3
al Pixel 5a.

El nombre en clave fue Snow Cone. En AOSP las ramas de la versión son `sc-dev`
y `sc-release`, el prefijo al que se fusionan los commits de la etiqueta
`android-12.0.0_r1`. El 4 de octubre de 2021, Dave Burke, vicepresidente de
ingeniería de Android, publicó "A cool background to celebrate the launch of
Android Snow Cone!", según reportaron TechRadar y Android Central. La constante
del SDK sigue siendo `S`, y Google nunca usó el nombre en sus anuncios oficiales
de la versión.

## Qué trajo

- **Material You.** Un nuevo lenguaje de diseño con controles más grandes, un
  panel de notificaciones y unos Quick Settings rediseñados, y widgets con
  esquinas redondeadas.
- **Color dinámico.** El sistema arma una paleta a partir del fondo de pantalla y
  la aplica a la pantalla de bloqueo, las notificaciones, los ajustes, los
  widgets y las apps que la adoptan. Las apps la leen con 65 recursos de color
  nuevos, cinco paletas de 13 tonos cada una (`system_accent1_0` a
  `system_neutral2_1000`). Google la lanzó primero en Pixel.
- **Pantallas de inicio.** Toda app recibe una pantalla de inicio del sistema en
  los arranques en frío y en tibio, hecha con su ícono y su tema. La API
  `SplashScreen` la personaliza con atributos como
  `windowSplashScreenAnimatedIcon`.
- **Overscroll elástico.** Las listas se estiran y rebotan en el borde en lugar
  de mostrar un brillo.
- **Inserción de contenido enriquecido.** Un solo callback,
  `OnReceiveContentListener`, recibe imágenes y otros contenidos desde el
  portapapeles, el teclado o al arrastrar y soltar.
- **Gráficos y multimedia.** `RenderEffect` desenfoca y filtra una vista en una
  llamada, las imágenes AVIF se decodifican de forma nativa y el sistema puede
  transcodificar video HEVC y HDR a AVC para las apps que no lo leen.
- **Notificaciones.** `Notification.CallStyle` para llamadas, imágenes animadas
  en los estilos de mensajería y de imagen grande, y acciones de notificación que
  exigen el dispositivo desbloqueado (`setAuthenticationRequired()`).
- **Otras novedades.** APIs de esquinas redondeadas (`RoundedCorner`), hápticos
  más ricos (`VibratorManager`), una API de Game Mode, AppSearch,
  picture-in-picture que entra solo (`setAutoEnterEnabled()`) y el nombre del
  chipset en `Build.SOC_MANUFACTURER` y `Build.SOC_MODEL`.

La publicación de Google para desarrolladores dijo que Android 12 redujo un 22%
el tiempo de CPU que usan los servicios centrales del sistema.

## Seguridad y privacidad

- **Panel de privacidad.** Una pantalla de Settings muestra una línea de tiempo
  de qué apps usaron ubicación, cámara y micrófono en las últimas 24 horas. Una
  app puede explicar cada acceso con una actividad protegida por
  `START_VIEW_PERMISSION_USAGE` que maneje `VIEW_PERMISSION_USAGE_FOR_PERIOD`.
- **Indicadores de cámara y micrófono.** Aparece un ícono en la barra de estado
  cada vez que una app usa alguno de los dos sensores. AOSP hace obligatorios los
  indicadores para todos los fabricantes.
- **Interruptores de cámara y micrófono.** "Camera access" y "Mic access" en
  Quick Settings apagan el sensor para todas las apps. Una app bloqueada recibe
  una imagen de cámara en blanco o audio en silencio, sin ningún error. Las
  llamadas de emergencia vuelven a encender el micrófono.
- **Aviso del portapapeles.** La primera vez que una app lee el contenido de otra
  con `getPrimaryClip()`, el sistema muestra "APP pasted from your clipboard".
  `getPrimaryClipDescription()` no lo dispara.
- **Private Compute Core.** Una parte aislada y de código abierto del sistema,
  donde Live Caption, Now Playing y Smart Reply procesan datos en el
  dispositivo. Las funciones dentro de ella no tienen acceso directo a la red;
  las actualizaciones de modelos llegan a través de Private Compute Services.
- **Superposiciones.** Se bloquean los toques que atraviesan una ventana que
  tapa la app, una app puede ocultar las superposiciones de otras con
  `HIDE_OVERLAY_WINDOWS`, y las apps preinstaladas ya no reciben
  `SYSTEM_ALERT_WINDOW` de forma automática.
- **Plataforma.** ART pasa a ser un módulo Mainline (`com.android.art`), así que
  Google puede actualizar el runtime con las actualizaciones del sistema de
  Google Play. Se admite Rust en el código de la plataforma. Los teléfonos nuevos
  usan el Generic Kernel Image, y Ars Technica llamó al Pixel 6 el primer
  teléfono con GKI. El usuario también puede desactivar el 2G, y los perfiles de
  trabajo pierden acceso al IMEI y al número de serie.
- **Criptografía.** Desaparecen los algoritmos obsoletos de BouncyCastle,
  incluidas todas las variantes de AES, en favor de Conscrypt.

## Permisos

- **Ubicación aproximada.** Cuando una app pide `ACCESS_FINE_LOCATION`, el
  diálogo ofrece "Precise" o "Approximate", junto a las opciones de una sola vez
  de [Android 11](/es/notes/android-11/). La app debe pedir
  `ACCESS_COARSE_LOCATION` en la misma llamada, o en algunas versiones de Android
  12 el diálogo no aparece.

![Un diálogo de permiso de ubicación con dos opciones, Precise y Approximate, sobre los botones While using the app, Only this time y Deny](./assets/approximate-location-dialog.png 'El diálogo de ubicación de Android 12, con "Precise" y "Approximate". Android Developers · CC BY 2.5')

- **Dispositivos cercanos.** `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT` y
  `BLUETOOTH_ADVERTISE` son permisos nuevos en tiempo de ejecución, que el
  usuario ve como "Nearby devices", junto con `UWB_RANGING`. Reemplazan a
  `BLUETOOTH` y `BLUETOOTH_ADMIN` en las apps con target 31. Una app que nunca
  deduce la ubicación de los escaneos agrega
  `usesPermissionFlags="neverForLocation"` y prescinde de
  `ACCESS_FINE_LOCATION`.
- **Alarmas exactas.** Para las apps con target 31, `SCHEDULE_EXACT_ALARM` es un
  permiso de app-op que se concede en la pantalla de acceso especial "Alarms &
  reminders". Hay que llamar a `canScheduleExactAlarms()` antes de programar
  una; si el usuario lo revoca, la app se detiene y sus alarmas exactas se
  cancelan.
- **Sensores rápidos.** Para las apps con target 31, el acelerómetro, el
  giroscopio y el magnetómetro quedan limitados a 200 Hz con
  `registerListener()`. Las frecuencias mayores necesitan
  `HIGH_SAMPLING_RATE_SENSORS`, y con el micrófono apagado el límite se aplica
  igual.
- **Hibernación.** Para las apps con target 31, el reinicio automático de
  permisos de Android 11 crece: una app que el usuario no abre en unos meses
  también pierde sus jobs, alarmas, mensajes push y caché. El interruptor es
  "Remove permissions and free up space" en App info.

![La pantalla Location usage del panel de privacidad: una línea de tiempo de las apps que usaron la ubicación hoy y ayer, con un botón Manage permission](./assets/privacy-dashboard.png 'El panel de privacidad de Android 12, con el uso de la ubicación en 24 horas. Android Developers · CC BY 2.5')

## Qué cambió para tu app

### Todas las apps en Android 12

| Cambio                                                                     | Qué hacer                                                                                |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| El sistema muestra su propia pantalla de inicio                            | Migrar la actividad de splash propia a la API `SplashScreen`                             |
| El usuario puede elegir ubicación aproximada                               | Pedir `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` juntos                           |
| Los interruptores de cámara y micrófono pueden bloquear la app en silencio | Consultar `SensorPrivacyManager.supportsSensorToggle()` y esperar datos vacíos           |
| Los enlaces web genéricos abren la app solo en dominios aprobados          | Verificar el dominio con Android App Links (`https`, `BROWSABLE`)                        |
| Back en la actividad raíz del launcher manda la tarea a segundo plano      | Llamar a `super.onBackPressed()` en lugar de `finish()`                                  |
| Se bloquean los toques no confiables a través de superposiciones           | Mantener las superposiciones en 0.8 de opacidad combinada o menos, o fuera del camino    |
| `ACTION_CLOSE_SYSTEM_DIALOGS` está obsoleto y ya no funciona               | Quitarlo; los servicios de accesibilidad usan `GLOBAL_ACTION_DISMISS_NOTIFICATION_SHADE` |
| Las apps pueden caer en el bucket restringido de App Standby               | Revisar si `getAppStandbyBucket()` devuelve `STANDBY_BUCKET_RESTRICTED`                  |
| Desaparecen AES de BouncyCastle y las claves de 512 bits                   | Usar tamaños de clave de Conscrypt y un IV de 12 bytes para GCM                          |
| `Display.getRealSize()` y `getRealMetrics()` están obsoletos               | Usar `WindowMetrics`                                                                     |

### Apps con target API 31

| Cambio                                                                                | Qué hacer                                                                                                  |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Los componentes con intent filter deben declarar `android:exported`                   | `true` para la actividad del launcher y lo que llamen otras apps, `false` en el resto                      |
| Todo `PendingIntent` debe indicar su mutabilidad                                      | Pasar `FLAG_IMMUTABLE`, o `FLAG_MUTABLE` solo si el intent debe completarse después                        |
| Los servicios en primer plano no pueden iniciarse desde segundo plano                 | Usar trabajo acelerado de WorkManager, o una alarma exacta para una acción del usuario                     |
| Se bloquean los trampolines de notificación                                           | Apuntar `setContentIntent()` directamente a la actividad                                                   |
| Las alarmas exactas necesitan `SCHEDULE_EXACT_ALARM`                                  | Declararlo, revisar `canScheduleExactAlarms()` y usar alarmas exactas solo para horarios que ve el usuario |
| Bluetooth necesita los nuevos permisos en tiempo de ejecución                         | Declarar y pedir `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT` o `BLUETOOTH_ADVERTISE`                             |
| Las vistas de notificación propias van en una plantilla del sistema, de 48dp plegadas | Probarlas en el panel y ofrecer una vista expandida                                                        |
| Las reglas de backup pasan a `android:dataExtractionRules`                            | Escribir reglas separadas en `<cloud-backup>` y `<device-transfer>`                                        |
| `adb backup` deja fuera los datos de la app                                           | Probar los backups con un build depurable                                                                  |
| WebView trata las cookies sin `SameSite` como `Lax`                                   | Poner `SameSite=None; Secure` en las cookies entre sitios                                                  |
| Las bibliotecas nativas del fabricante quedan ocultas                                 | Declarar cada una con `<uses-native-library>`                                                              |

Sin `android:exported`, la app no se instala en Android 12: el build falla con
un error de fusión del manifiesto. La falta del flag de mutabilidad falla en
tiempo de ejecución, y lint lo marca como `UnspecifiedImmutableFlag`.

La regla de los servicios en primer plano lanza
`ForegroundServiceStartNotAllowedException`. Entre las excepciones están un
mensaje FCM de alta prioridad, un toque en la notificación o el widget de la
app, una alarma exacta, `BOOT_COMPLETED` y las apps que el usuario sacó de la
optimización de batería.

```mermaid title="Iniciar un servicio en primer plano en una app con target API 31"
flowchart TD
  start([El trabajo debe empezar ya]) --> visible{¿App visible para el usuario?}
  visible -- sí --> fgs[startForegroundService]
  visible -- no --> exempt{¿Aplica una excepción?}
  exempt -- sí --> fgs
  exempt -- no --> work[Trabajo acelerado de WorkManager]
```

Llamar a `startForegroundService()` de todos modos en la rama "no" es lo que
lanza la excepción.

## Qué perduró

- **Material You y el color dinámico** siguen siendo la base del diseño de
  Android, y los 65 recursos de color del sistema siguen siendo la forma en que
  las apps leen la paleta.
- **El grupo Nearby devices** creció: Android 13 sumó `NEARBY_WIFI_DEVICES`, así
  que escanear redes Wi-Fi tampoco necesita la ubicación.
- **Las alarmas exactas** se endurecieron. Android 13 agregó `USE_EXACT_ALARM`
  para apps de alarmas y calendario, y dejó de conceder de antemano
  `SCHEDULE_EXACT_ALARM` a las instalaciones nuevas de apps con target 33.
- **La hibernación** se quedó. Desde Android 13 el interruptor dice "Pause app
  activity if unused".
- **Los servicios en primer plano** siguieron cerrándose: las apps con target
  Android 14 deben declarar un tipo para cada uno.
- **La pantalla de inicio** llegó a dispositivos anteriores con
  `androidx.core:core-splashscreen`, que la lleva hasta API 23.
- **ART** como módulo dio resultado. En 2023 Google dijo que sus actualizaciones
  de ART llegaban a todos los dispositivos con Android 12 o posterior, con un
  arranque de apps hasta 30% más rápido en algunos.

La versión menor que siguió, [Android 12L](/es/notes/android-12l/) (API 32), rehízo el sistema para
pantallas grandes y tiene su propia nota en esta serie.

## Para saber

- El Easter egg es un reloj analógico. Si se arrastran sus agujas hasta las
  12:00, empieza la etapa siguiente; el código registra "12:00 let's gooooo".
- Después el fondo se llena de burbujas con la paleta de acentos del sistema, y
  el egg desbloquea **Paint Chips**, un widget para la pantalla de inicio que
  muestra la paleta de color dinámico "in a manner similar to a set of paint
  samples from a hardware store", como dice el comentario del string en AOSP.
- En AOSP, el código que pasa del fondo de pantalla al tema está detrás de un
  flag llamado Monet (`isMonetEnabled()` en el `ThemeOverlayController` de
  SystemUI). La reseña de Ars Technica informó que Monet era el nombre en clave
  del sistema de color.
- La constante `S` en el `Build.java` de AOSP lleva un comentario de una
  palabra: `S.`.
