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
documents:
  - documentId: developer-preview-1
    slug: developer-preview-1
    order: 1
  - documentId: developer-preview-2
    slug: developer-preview-2
    order: 2
  - documentId: developer-preview-3
    slug: developer-preview-3
    order: 3
  - documentId: beta-1
    slug: beta-1
    order: 4
  - documentId: beta-2
    slug: beta-2
    order: 5
  - documentId: beta-3
    slug: beta-3
    order: 6
  - documentId: beta-4
    slug: beta-4
    order: 7
  - documentId: beta-5
    slug: beta-5
    order: 8
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-versions
  order: 13
citations:
  - title: 'Android 12 emblem — Wikimedia Commons (PD-textlogo, trademark of Google LLC)'
    url: https://commons.wikimedia.org/wiki/File:Android_12_Developer_Preview_logo.svg
    accessedAt: 2026-10-17
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
  - title: 'Android 12 home screen screenshot — Wikimedia Commons (Free screenshot, Apache 2.0)'
    url: https://commons.wikimedia.org/wiki/File:Android_12_Homescreen_Screenshot.png
    accessedAt: 2026-10-17
  - title: 'Android 12 Easter egg animation — Wikimedia Commons (Hajoon0102, CC BY-SA 4.0)'
    url: https://commons.wikimedia.org/wiki/File:Android_12_easter_egg.gif
    accessedAt: 2026-10-17
  - title: First preview of Android 12
    url: https://android-developers.googleblog.com/2021/02/android-12-dp1.html
    accessedAt: 2026-10-17
  - title: "What's new in Android 12 Beta"
    url: https://android-developers.googleblog.com/2021/05/whats-new-in-android-12-beta.html
    accessedAt: 2026-10-17
  - title: Android 12 Beta 4 and Platform Stability
    url: https://android-developers.googleblog.com/2021/08/android-12-beta-4-and-platform-stability.html
    accessedAt: 2026-10-17
  - title: 'Android 12 Developer Preview 2'
    url: https://android-developers.googleblog.com/2021/03/android-12-developer-preview-2.html
    accessedAt: 2026-10-18
  - title: 'Android 12 Developer Preview 3'
    url: https://android-developers.googleblog.com/2021/04/android-12-developer-preview-3.html
    accessedAt: 2026-10-18
  - title: 'Android 12 Beta 2 Update'
    url: https://android-developers.googleblog.com/2021/06/android-12-beta-2-update.html
    accessedAt: 2026-10-18
  - title: 'Android 12 Beta 3 and final APIs'
    url: https://android-developers.googleblog.com/2021/07/android-12-beta-3.html
    accessedAt: 2026-10-18
  - title: 'Android 12 Beta 5 update, official release is next!'
    url: https://android-developers.googleblog.com/2021/08/android12beta5.html
    accessedAt: 2026-10-18
  - title: 'Android 12 release notes, Developer Preview 1 and 1.1 (archived 15 March 2021)'
    url: https://web.archive.org/web/20210315183111/https://developer.android.com/about/versions/12/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 12 release notes, Developer Preview 2 to 2.2 (archived 14 April 2021)'
    url: https://web.archive.org/web/20210414205949/https://developer.android.com/about/versions/12/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 12 release notes, Developer Preview 3 (archived 18 May 2021)'
    url: https://web.archive.org/web/20210518025512/https://developer.android.com/about/versions/12/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 12 release notes, Beta 1 to Beta 5 (archived 24 September 2021)'
    url: https://web.archive.org/web/20210924193654/https://developer.android.com/about/versions/12/release-notes
    accessedAt: 2026-10-18
  - title: 'Google launches Android 12 Developer Preview for Pixel phones (9to5Google)'
    url: https://9to5google.com/2021/02/18/android-12-developer-preview-1-launch/
    accessedAt: 2026-10-18
  - title: 'Android 12 Developer Preview 2 hands-on (9to5Google)'
    url: https://9to5google.com/2021/03/17/android-12-developer-preview-2-hands-on-top-new-features-video/
    accessedAt: 2026-10-18
  - title: 'Google rolling out Android 12 Developer Preview 3 for Pixel (9to5Google)'
    url: https://9to5google.com/2021/04/21/android-12-dp3-launch/
    accessedAt: 2026-10-18
  - title: 'Google releases Android 12 Beta 1 for Pixel phones (9to5Google)'
    url: https://9to5google.com/2021/05/18/android-12-beta-1-launch/
    accessedAt: 2026-10-18
  - title: 'Google rolling out Android 12 Beta 2 for Pixel phones (9to5Google)'
    url: https://9to5google.com/2021/06/09/android-12-beta-2/
    accessedAt: 2026-10-18
  - title: 'Google releases Android 12 Beta 3 for Pixel phones (9to5Google)'
    url: https://9to5google.com/2021/07/14/android-12-beta-3/
    accessedAt: 2026-10-18
  - title: 'Android 12 Beta 4 (9to5Google)'
    url: https://9to5google.com/2021/08/11/android-12-beta-4/
    accessedAt: 2026-10-18
  - title: 'Google rolling out Android 12 Beta 5 release candidate for Pixel (9to5Google)'
    url: https://9to5google.com/2021/09/08/android-12-beta-5-release-candidate/
    accessedAt: 2026-10-18
  - title: ScrollCaptureCallback reference
    url: https://developer.android.com/reference/android/view/ScrollCaptureCallback
    accessedAt: 2026-10-17
  - title: PackageInstaller.SessionParams reference (setRequireUserAction)
    url: https://developer.android.com/reference/android/content/pm/PackageInstaller.SessionParams#setRequireUserAction(int)
    accessedAt: 2026-10-17
  - title: A closer look at Android 12 (Go edition) (The Keyword)
    url: https://blog.google/products-and-platforms/platforms/android/introducing-android-12-go-edition/
    accessedAt: 2026-10-17
  - title: Android Security Bulletin, March 2025
    url: https://source.android.com/docs/security/bulletin/2025-03-01
    accessedAt: 2026-10-17
  - title: Android Security Bulletin, April 2025
    url: https://source.android.com/docs/security/bulletin/2025-04-01
    accessedAt: 2026-10-17
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
  - title: Set up the Android 12 SDK
    url: https://developer.android.com/about/versions/12/setup-sdk
    accessedAt: 2026-10-18
  - title: Compatibility framework changes (Android 12)
    url: https://developer.android.com/about/versions/12/reference/compat-framework-changes
    accessedAt: 2026-10-18
  - title: Compatibility framework tools (test and debug)
    url: https://developer.android.com/guide/app-compatibility/test-debug
    accessedAt: 2026-10-18
  - title: 'Android Gradle plugin: minimum versions of tools for each API level'
    url: https://developer.android.com/build/releases/about-agp
    accessedAt: 2026-10-18
  - title: Manifest.permission reference
    url: https://developer.android.com/reference/android/Manifest.permission
    accessedAt: 2026-10-18
  - title: PendingIntent reference (FLAG_MUTABLE)
    url: https://developer.android.com/reference/android/app/PendingIntent
    accessedAt: 2026-10-18
  - title: Window reference (setHideOverlayWindows)
    url: https://developer.android.com/reference/android/view/Window
    accessedAt: 2026-10-18
  - title: Request location permissions (approximate location)
    url: https://developer.android.com/develop/sensors-and-location/location/permissions/runtime
    accessedAt: 2026-10-18
  - title: 'Lint check IntentFilterExportedReceiver: Unspecified android:exported in manifest'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/IntentFilterExportedReceiver.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check UnspecifiedImmutableFlag: Missing PendingIntent mutability flag'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/UnspecifiedImmutableFlag.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check NotificationTrampoline: Notification Trampolines'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/NotificationTrampoline.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check ScheduleExactAlarm: Scheduling Exact Alarms Without Required Permission'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/ScheduleExactAlarm.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check CoarseFineLocation: Cannot use ACCESS_FINE_LOCATION without ACCESS_COARSE_LOCATION'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/CoarseFineLocation.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check HighSamplingRate: High sensor sampling rate'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/HighSamplingRate.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check DataExtractionRules: Missing data extraction rules'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/DataExtractionRules.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check CustomSplashScreen: Application-defined Launch Screen'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/CustomSplashScreen.md.html
    accessedAt: 2026-10-18
  - title: 'Google releases Android 12 to AOSP, but no Pixel launch today (9to5Google)'
    url: https://9to5google.com/2021/10/04/android-12-aosp/
    accessedAt: 2026-10-18
  - title: 'Google rolling out Android 12 to current Pixel phones today (9to5Google)'
    url: https://9to5google.com/2021/10/19/google-android-12-pixel-launch/
    accessedAt: 2026-10-18
  - title: 'Android 12 is now available in stable for Google Pixel phones (XDA Developers)'
    url: https://www.xda-developers.com/android-12-stable-rollout-google-pixel/
    accessedAt: 2026-10-18
---

Android 12 es la versión en la que el fondo de pantalla eligió los colores de
todo el sistema. Al usuario le trajo Material You, un panel de privacidad e
interruptores que apagan la cámara y el micrófono para todas las apps. A las
apps con target API 31 les exigió `android:exported` y la mutabilidad de cada
`PendingIntent`, y les impidió iniciar servicios en primer plano desde segundo
plano.

![La pantalla de inicio de un teléfono con un fondo rosa y morado, la fecha arriba a la izquierda, cinco íconos de apps en el dock y una barra de búsqueda de Google debajo](./assets/android-12-home-screen.png 'La pantalla de inicio de Android 12, capturada en el emulador de Android. Wikimedia Commons · Apache 2.0')

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
| Herramientas                       | `compileSdk 31`, Android Studio Arctic Fox (2020.3.1) o posterior                         |

La página de configuración del SDK de Android 12 indica Arctic Fox como la
versión de Studio que hay que usar y fija `compileSdkVersion 31`. La tabla de
Google con las versiones mínimas del Android Gradle Plugin por nivel de API
empieza en API 33, así que ninguna fuente primaria indica un AGP mínimo para
API 31.

Google anunció Android 12 con la Developer Preview 1 el 18 de febrero de 2021.
La Beta 1 llegó el 18 de mayo en Google I/O, y la Beta 4 alcanzó la estabilidad
de plataforma el 11 de agosto, con las APIs y el comportamiento hacia las apps
ya congelados. Las tres developer previews y las cinco betas son las partes
que siguen a esta vista general.

Google publicó el código de Android 12 en AOSP el 4 de octubre de 2021. Los
teléfonos esperaron dos semanas más: el despliegue empezó el 19 de octubre, para
el Pixel 3 en adelante, el mismo día en que Google anunció el Pixel 6 y el Pixel
6 Pro. 9to5Google informó las dos fechas, el código sin teléfonos el 4 de
octubre y la actualización de Pixel el 19; XDA informó el mismo despliegue en
Pixel. Google nombró a Samsung, OnePlus, Oppo, realme, Tecno, Vivo y Xiaomi para
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
- **Capturas con desplazamiento.** Una captura de pantalla puede crecer hasta
  abarcar una página entera con scroll. Las apps pueden entregar al sistema el
  contenido desplazado de una vista propia con `ScrollCaptureCallback`,
  registrado con `View.setScrollCaptureCallback()` o
  `Window.registerScrollCaptureCallback()`.
- **Botón de encendido.** En Pixel, mantener presionado el botón de encendido
  abre Google Assistant, y el menú de apagado pasa a un botón en Quick
  Settings. Los controles del hogar inteligente y Google Pay, que Android 11
  había puesto en ese menú, pasaron a ser tiles de Quick Settings.
- **Accesibilidad.** Una lupa en ventana amplía una parte de la pantalla sin
  ocultar el resto, y "Extra dim" baja el brillo por debajo del mínimo.
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
  más ricos (`VibratorManager`), vibración generada a partir de una sesión de
  audio (`HapticGenerator`), una API de Game Mode, AppSearch,
  picture-in-picture que entra solo (`setAutoEnterEnabled()`) y el nombre del
  chipset en `Build.SOC_MANUFACTURER` y `Build.SOC_MODEL`.

La publicación de Google para desarrolladores dijo que Android 12 redujo un 22%
el tiempo de CPU que usan los servicios centrales del sistema.

Después llegó Android 12 (Go edition), para teléfonos de gama de entrada. Google
la presentó el 14 de diciembre de 2021 para equipos que salían en 2022. Según
Google, ahí las apps abren hasta un 30% más rápido, las apps sin uso hibernan
solas y el panel de privacidad también está incluido.

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

Android 12 agregó nueve permisos que una app común puede declarar, además de los
de dispositivos acompañantes, y cambió las reglas de cuatro anteriores:

| Permiso                                    | Qué cambió en API 31                                                                                                        | Qué declarar                                                                      | Qué quitar o limitar                                                        |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `ACCESS_FINE_LOCATION`                     | El usuario puede conceder solo la ubicación aproximada; pedido solo, el pedido se ignora en algunas versiones de Android 12 | Decláralo y pídelo junto con `ACCESS_COARSE_LOCATION`                             | `android:maxSdkVersion="30"` si solo lo necesitabas para escanear Bluetooth |
| `BLUETOOTH_SCAN`                           | Permiso nuevo en tiempo de ejecución del grupo "Nearby devices", para apps con target 31                                    | `android:usesPermissionFlags="neverForLocation"` si nunca obtienes la ubicación   | Nada                                                                        |
| `BLUETOOTH_CONNECT`, `BLUETOOTH_ADVERTISE` | Permisos nuevos en tiempo de ejecución del mismo grupo: hablar con dispositivos vinculados, hacer visible el teléfono       | Declara solo el que usa tu función                                                | Nada                                                                        |
| `BLUETOOTH`, `BLUETOOTH_ADMIN`             | Los reemplazan los tres anteriores en apps con target 31                                                                    | Mantenlos para dispositivos hasta Android 11                                      | `android:maxSdkVersion="30"`                                                |
| `UWB_RANGING`                              | Permiso nuevo en tiempo de ejecución para medir distancia por banda ultraancha, del grupo "Nearby devices"                  | Decláralo y pídelo si usas UWB                                                    | Nada                                                                        |
| `SCHEDULE_EXACT_ALARM`                     | Acceso especial nuevo, "Alarms & reminders"; obligatorio para alarmas exactas en apps con target 31                         | Decláralo para horarios que ve el usuario; revisa `canScheduleExactAlarms()`      | No lo declares para trabajo que puede correr tarde                          |
| `HIGH_SAMPLING_RATE_SENSORS`               | Permiso normal nuevo; sin él, los sensores de movimiento quedan limitados a 200 Hz en apps con target 31                    | Decláralo solo si necesitas muestras más rápidas                                  | Nada; lint avisa que Play puede revisarlo                                   |
| `READ_PHONE_STATE`                         | Ahora lo exigen las APIs del estado de llamada, como `getCallState()`, en apps con target 31                                | Decláralo y pídelo si lees el estado de llamada                                   | Nada                                                                        |
| `HIDE_OVERLAY_WINDOWS`                     | Nuevo; permite ocultar las ventanas superpuestas de otras apps sobre la propia                                              | Decláralo y llama a `Window.setHideOverlayWindows(true)` en pantallas sensibles   | Nada                                                                        |
| `UPDATE_PACKAGES_WITHOUT_USER_ACTION`      | Permiso normal nuevo para tiendas de apps                                                                                   | Decláralo y llama a `setRequireUserAction(USER_ACTION_NOT_REQUIRED)` en la sesión | Nada                                                                        |
| `MANAGE_MEDIA`                             | Acceso especial nuevo para gestores de medios: editar o borrar medios sin diálogo de confirmación                           | Decláralo junto a `READ_EXTERNAL_STORAGE` o `MANAGE_EXTERNAL_STORAGE`             | Nada                                                                        |

Un manifiesto para una app que corre en Android 11 o anterior y en 12 o
posterior. Deja solo los bloques que tu app necesita:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Ubicación: pide las dos, el usuario puede elegir "Approximate" -->
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

    <!-- Bluetooth: el par antiguo hasta API 30, Nearby devices desde 31 -->
    <uses-permission
        android:name="android.permission.BLUETOOTH"
        android:maxSdkVersion="30" />
    <uses-permission
        android:name="android.permission.BLUETOOTH_ADMIN"
        android:maxSdkVersion="30" />
    <uses-permission
        android:name="android.permission.BLUETOOTH_SCAN"
        android:usesPermissionFlags="neverForLocation" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

    <!-- Alarmas exactas para una función que ve el usuario -->
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
</manifest>
```

Si la ubicación solo servía para escanear Bluetooth, quita
`ACCESS_COARSE_LOCATION` y agrega `android:maxSdkVersion="30"` a
`ACCESS_FINE_LOCATION`, como hace la guía de Bluetooth de Google.
`neverForLocation` filtra algunas balizas BLE de los resultados del escaneo.

Cuando una app pide `ACCESS_FINE_LOCATION`, el diálogo ofrece "Precise" o
"Approximate", junto a las opciones de una sola vez de
[Android 11](/es/notes/android-11/). Bajar de precisa a aproximada, en el
diálogo o en los ajustes, reinicia el proceso de la app.

![Un diálogo de permiso de ubicación con dos opciones, Precise y Approximate, sobre los botones While using the app, Only this time y Deny](./assets/approximate-location-dialog.png 'El diálogo de ubicación de Android 12, con "Precise" y "Approximate". Android Developers · CC BY 2.5')

`SCHEDULE_EXACT_ALARM` se concede en la pantalla de acceso especial "Alarms &
reminders". Si el usuario lo revoca, la app se detiene y sus alarmas exactas se
cancelan. Con el micrófono apagado, el límite de 200 Hz se aplica aunque la app
tenga `HIGH_SAMPLING_RATE_SENSORS`.

Una tienda con `UPDATE_PACKAGES_WITHOUT_USER_ACTION` puede actualizar apps sin
diálogo de confirmación solo si ella las instaló, o consigo misma, y en
Android 12 solo si la app actualizada tiene target API 29 o superior.

La hibernación es un cambio de target y está en
[la tabla de target](#apps-con-target-api-31). En las apps con target 31, el
reinicio automático de permisos de Android 11 crece: una app que el usuario no
abre en unos meses también pierde sus jobs, alarmas, mensajes push y caché. El
interruptor es "Remove permissions and free up space" en App info.

![La pantalla Location usage del panel de privacidad: una línea de tiempo de las apps que usaron la ubicación hoy y ayer, con un botón Manage permission](./assets/privacy-dashboard.png 'El panel de privacidad de Android 12, con el uso de la ubicación en 24 horas. Android Developers · CC BY 2.5')

## Qué cambió para tu app

### Todas las apps en Android 12

| Cambio                                                                     | Qué hacer                                                                                | Cómo comprobarlo                                       |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| El sistema muestra su propia pantalla de inicio                            | Migrar la actividad de splash propia a la API `SplashScreen`                             | Lint `CustomSplashScreen`                              |
| El usuario puede elegir ubicación aproximada                               | Pedir `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` juntos                           | Lint `CoarseFineLocation`                              |
| Los interruptores de cámara y micrófono pueden bloquear la app en silencio | Consultar `SensorPrivacyManager.supportsSensorToggle()` y esperar datos vacíos           |                                                        |
| Los enlaces web genéricos abren la app solo en dominios aprobados          | Verificar el dominio con Android App Links (`https`, `BROWSABLE`)                        |                                                        |
| Back en la actividad raíz del launcher manda la tarea a segundo plano      | Llamar a `super.onBackPressed()` en lugar de `finish()`                                  |                                                        |
| Se bloquean los toques no confiables a través de superposiciones           | Mantener las superposiciones en 0.8 de opacidad combinada o menos, o fuera del camino    | Compat `BLOCK_UNTRUSTED_TOUCHES` (158002302)           |
| `ACTION_CLOSE_SYSTEM_DIALOGS` está obsoleto y ya no funciona               | Quitarlo; los servicios de accesibilidad usan `GLOBAL_ACTION_DISMISS_NOTIFICATION_SHADE` | Compat `DROP_CLOSE_SYSTEM_DIALOGS` (174664120)         |
| Las apps pueden caer en el bucket restringido de App Standby               | Revisar si `getAppStandbyBucket()` devuelve `STANDBY_BUCKET_RESTRICTED`                  | `adb shell am set-standby-bucket <package> restricted` |
| Desaparecen AES de BouncyCastle y las claves de 512 bits                   | Usar tamaños de clave de Conscrypt y un IV de 12 bytes para GCM                          |                                                        |
| `Display.getRealSize()` y `getRealMetrics()` están obsoletos               | Usar `WindowMetrics`                                                                     |                                                        |

### Apps con target API 31

| Cambio                                                                                | Qué hacer                                                                                                  | Cómo comprobarlo                                                                                  |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Los componentes con intent filter deben declarar `android:exported`                   | `true` para la actividad del launcher y lo que llamen otras apps, `false` en el resto                      | Lint `IntentFilterExportedReceiver`; compat `MISSING_EXPORTED_FLAG` (150232615)                   |
| Todo `PendingIntent` debe indicar su mutabilidad                                      | Pasar `FLAG_IMMUTABLE`, o `FLAG_MUTABLE` solo si el intent debe completarse después                        | Lint `UnspecifiedImmutableFlag`; compat `PENDING_INTENT_EXPLICIT_MUTABILITY_REQUIRED` (160794467) |
| Las APIs de ubicación rechazan un `PendingIntent` inmutable                           | Pasar `FLAG_MUTABLE` a los que entregas a pedidos de ubicación                                             | Compat `BLOCK_IMMUTABLE_PENDING_INTENTS` (171317480)                                              |
| Los servicios en primer plano no pueden iniciarse desde segundo plano                 | Usar trabajo acelerado de WorkManager, o una alarma exacta para una acción del usuario                     | Compat `FGS_BG_START_RESTRICTION_CHANGE_ID` (170668199)                                           |
| Se bloquean los trampolines de notificación                                           | Apuntar `setContentIntent()` directamente a la actividad                                                   | Lint `NotificationTrampoline`; compat `NOTIFICATION_TRAMPOLINE_BLOCK` (167676448)                 |
| Las alarmas exactas necesitan `SCHEDULE_EXACT_ALARM`                                  | Declararlo, revisar `canScheduleExactAlarms()` y usar alarmas exactas solo para horarios que ve el usuario | Lint `ScheduleExactAlarm`; compat `REQUIRE_EXACT_ALARM_PERMISSION` (171306433)                    |
| Las alarmas inexactas reciben una ventana de al menos unos minutos                    | Usar una alarma exacta cuando importa una ventana más corta                                                | Compat `ENFORCE_MINIMUM_WINDOW_ON_INEXACT_ALARMS` (185199076)                                     |
| Bluetooth necesita los nuevos permisos en tiempo de ejecución                         | Declarar y pedir `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT` o `BLUETOOTH_ADVERTISE`                             |                                                                                                   |
| Los sensores de movimiento quedan limitados a 200 Hz                                  | Declarar `HIGH_SAMPLING_RATE_SENSORS` solo si se necesita más                                              | Lint `HighSamplingRate`; compat `CHANGE_ID_SAMPLING_RATE_SENSORS_PERMISSION` (136069189)          |
| Las apps sin uso hibernan                                                             | Esperar la pérdida de permisos, jobs, alarmas y caché tras meses sin uso                                   |                                                                                                   |
| Las APIs del estado de llamada necesitan `READ_PHONE_STATE`                           | Pedirlo antes de `getCallState()` o de un listener del estado de llamada                                   | Compat `ENABLE_GET_CALL_STATE_PERMISSION_PROTECTION` (157233955)                                  |
| Enviar `ACTION_CLOSE_SYSTEM_DIALOGS` se rechaza                                       | Quitar el broadcast                                                                                        | Compat `LOCK_DOWN_CLOSE_SYSTEM_DIALOGS` (174664365)                                               |
| Las vistas de notificación propias van en una plantilla del sistema, de 48dp plegadas | Probarlas en el panel y ofrecer una vista expandida                                                        |                                                                                                   |
| La verificación de App Links necesita el intent filter completo                       | Agregar `autoVerify`, `VIEW`, `BROWSABLE`, `DEFAULT` y `https`                                             | Compat `RESTRICT_DOMAINS` (175408749)                                                             |
| Las reglas de backup pasan a `android:dataExtractionRules`                            | Escribir reglas separadas en `<cloud-backup>` y `<device-transfer>`                                        | Lint `DataExtractionRules`; compat `IGNORE_FULL_BACKUP_CONTENT_IN_D2D` (180523564)                |
| `adb backup` deja fuera los datos de la app                                           | Probar los backups con un build depurable                                                                  | Compat `RESTRICT_ADB_BACKUP` (171032338)                                                          |
| WebView trata las cookies sin `SameSite` como `Lax`                                   | Poner `SameSite=None; Secure` en las cookies entre sitios                                                  | Flag de WebView DevTools `webview-enable-modern-cookie-same-site`                                 |
| Las bibliotecas nativas del fabricante quedan ocultas                                 | Declarar cada una con `<uses-native-library>`                                                              | Compat `ENFORCE_NATIVE_SHARED_LIBRARY_DEPENDENCIES` (142191088)                                   |
| Las etiquetas de atribución deben declararse                                          | Listar cada etiqueta en el manifiesto con `<attribution>`                                                  | Compat `SECURITY_EXCEPTION_ON_INVALID_ATTRIBUTION_TAG_CHANGE` (151105954)                         |

Sin `android:exported`, la app no se instala en Android 12: el build falla con
un error de fusión del manifiesto. La falta del flag de mutabilidad falla en
tiempo de ejecución. La lista de compat también incluye cambios de telefonía,
GNSS, el proveedor de medios y Android TV que pocas apps encuentran.

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

## Migrar a API 31

De `targetSdk 30` a 31, en este orden:

1. **Actualiza las herramientas.** Pon `compileSdk 31` y usa Android Studio
   Arctic Fox o posterior. Si lo saltas, las constantes nuevas (`FLAG_MUTABLE`,
   `BLUETOOTH_SCAN`) no compilan. Comprueba: el proyecto compila y lint no
   muestra errores nuevos.
2. **Declara `android:exported`** en cada actividad, servicio y receiver con
   intent filter, incluidos los que llegan de bibliotecas. Si lo saltas, el
   build falla en la fusión del manifiesto, o con herramientas antiguas sale un
   APK que no se instala. Comprueba: lint `IntentFilterExportedReceiver` y el
   manifiesto fusionado.
3. **Indica la mutabilidad de cada `PendingIntent`.** `FLAG_IMMUTABLE` por
   defecto, `FLAG_MUTABLE` para respuestas en línea, burbujas y pedidos de
   ubicación. Si lo saltas, la app falla en tiempo de ejecución. Comprueba:
   lint `UnspecifiedImmutableFlag`.
4. **Mueve los inicios en segundo plano de servicios en primer plano** a
   trabajo acelerado de WorkManager, o mantenlos solo con una excepción. Si lo
   saltas, el inicio lanza `ForegroundServiceStartNotAllowedException`.
   Comprueba: dispara cada camino de inicio con la app en segundo plano.
5. **Quita los trampolines de notificación.** Apunta cada notificación y
   acción directamente a su actividad. Si lo saltas, la actividad no se abre.
   Comprueba: lint `NotificationTrampoline`, luego toca cada notificación y lee
   la sección "NotifInteractionLog" de
   `adb shell dumpsys activity service com.android.systemui/.dump.SystemUIAuxiliaryDumpService`.
6. **Actualiza los permisos** como en [la tabla](#permisos): el trío de
   Bluetooth con `maxSdkVersion="30"` en el par antiguo, ubicación precisa y
   aproximada juntas, y `SCHEDULE_EXACT_ALARM` con una comprobación de
   `canScheduleExactAlarms()`. Si lo saltas, se niegan los escaneos y
   conexiones Bluetooth y no se pueden programar alarmas exactas. Comprueba:
   lint `CoarseFineLocation` y `ScheduleExactAlarm`, y luego cada flujo de
   Bluetooth y de alarmas en Android 12.
7. **Escribe `android:dataExtractionRules`** con reglas separadas para la nube
   y para la transferencia entre dispositivos. Si lo saltas, las
   transferencias entre dispositivos ignoran tus reglas de exclusión antiguas.
   Comprueba: lint `DataExtractionRules`.
8. **Revisa las filas menores** de la tabla de target que te apliquen:
   notificaciones personalizadas, App Links, cookies de WebView, bibliotecas
   del fabricante, sensores, etiquetas de atribución y estado de llamada.
9. **Prueba el resultado** en un dispositivo o emulador con Android 12 y
   `targetSdk 31`. Para aislar un cambio, cámbialo en una build depurable en
   Developer options > "App Compatibility Changes", o con
   `adb shell am compat disable <change ID> <package>`.

Opcional ya que estás: reemplaza la actividad de splash propia por la API
`SplashScreen`, o el usuario verá dos pantallas de inicio. Lint
`CustomSplashScreen` la encuentra.

Si saltas varios niveles a la vez: haz los pasos de cada versión en orden,
desde [Android 11](/es/notes/android-11/) si tu target es 29 o menos.

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
- **Los parches de seguridad** siguieron hasta marzo de 2025. El Android
  Security Bulletin de ese mes todavía incluye 12 y 12L entre las versiones de
  AOSP actualizadas; desde abril de 2025 la lista empieza en Android 13.

La versión menor que siguió, [Android 12L](/es/notes/android-12l/) (API 32), rehízo el sistema para
pantallas grandes y tiene su propia nota en esta serie.

## Para saber

- El Easter egg es un reloj analógico. Si se arrastran sus agujas hasta las
  12:00, empieza la etapa siguiente; el código registra "12:00 let's gooooo".

![El Easter egg: una esfera de reloj gris con borde ondulado y dos agujas, sobre un degradado azul, bajo la barra de estado](./assets/easter-egg-clock.png 'Un fotograma del Easter egg, antes de que las agujas lleguen a las 12:00. Hajoon0102, Wikimedia Commons · CC BY-SA 4.0')

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
