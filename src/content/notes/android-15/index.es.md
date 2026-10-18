---
entryId: notes-android-15-es
locale: es
translationKey: android-15
slug: android-15
title: 'Android 15: edge-to-edge y espacio privado'
summary: API 35, octubre de 2024. Con target 35 las apps van edge-to-edge, dataSync tiene seis horas al día, el espacio privado oculta apps y el código nativo debe usar páginas de 16 KB.
visibility: public
maturity: stable
publishedAt: 2026-10-17
topics: [android, platform-apis, security]
image: /banners/android-15.svg
imageAlt: 'Banner de Android 15 Vanilla Ice Cream, con el logo de la versión.'
links:
  - label: Funciones y APIs de Android 15
    href: https://developer.android.com/about/versions/15/features
    kind: publication
  - label: Cambios de comportamiento para apps con target Android 15
    href: https://developer.android.com/about/versions/15/behavior-changes-15
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
  - documentId: beta-1
    slug: beta-1
    order: 3
  - documentId: beta-2
    slug: beta-2
    order: 4
  - documentId: beta-3
    slug: beta-3
    order: 5
  - documentId: beta-4
    slug: beta-4
    order: 6
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-versions
  order: 17
citations:
  - title: 'Android 15 home screen screenshot — Wikimedia Commons (Free screenshot, Apache 2.0)'
    url: https://commons.wikimedia.org/wiki/File:Android_15_Homescreen_Screenshot.png
    accessedAt: 2026-10-18
  - title: Android common kernels (AOSP)
    url: https://source.android.com/docs/core/architecture/kernel/android-common
    accessedAt: 2026-10-18
  - title: 'Android 15 emblem — Wikimedia Commons (AOSP licence, trademark of Google LLC)'
    url: https://commons.wikimedia.org/wiki/File:Android_15_Developer_Preview_logo.svg
    accessedAt: 2026-10-17
  - title: Android 15 features and APIs
    url: https://developer.android.com/about/versions/15/features
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 15)'
    url: https://developer.android.com/about/versions/15/behavior-changes-all
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 15'
    url: https://developer.android.com/about/versions/15/behavior-changes-15
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 16'
    url: https://developer.android.com/about/versions/16/behavior-changes-16
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 16)'
    url: https://developer.android.com/about/versions/16/behavior-changes-all
    accessedAt: 2026-10-17
  - title: Support 16 KB page sizes
    url: https://developer.android.com/guide/practices/page-sizes
    accessedAt: 2026-10-17
  - title: Support 16 KB page sizes (archived 31 August 2025)
    url: https://web.archive.org/web/20250831231121/https://developer.android.com/guide/practices/page-sizes
    accessedAt: 2026-10-17
  - title: Media projection
    url: https://developer.android.com/media/grow/media-projection
    accessedAt: 2026-10-17
  - title: Manifest.permission reference
    url: https://developer.android.com/reference/android/Manifest.permission
    accessedAt: 2026-10-17
  - title: R.attr reference (windowOptOutEdgeToEdgeEnforcement)
    url: https://developer.android.com/reference/android/R.attr
    accessedAt: 2026-10-17
  - title: Android 15 and Android 15 QPR1 release notes (AOSP)
    url: https://source.android.com/docs/whatsnew/android-15-release
    accessedAt: 2026-10-17
  - title: Codenames, tags, and build numbers (AOSP)
    url: https://source.android.com/docs/setup/reference/build-numbers
    accessedAt: 2026-10-17
  - title: Build.java at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/core/java/android/os/Build.java
    accessedAt: 2026-10-17
  - title: PlatLogoActivity.java at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/core/java/com/android/internal/app/PlatLogoActivity.java
    accessedAt: 2026-10-17
  - title: EasterEgg AndroidManifest.xml at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/packages/EasterEgg/AndroidManifest.xml
    accessedAt: 2026-10-17
  - title: EasterEgg landroid_strings.xml at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/packages/EasterEgg/res/values/landroid_strings.xml
    accessedAt: 2026-10-17
  - title: The First Developer Preview of Android 15
    url: https://android-developers.googleblog.com/2024/02/first-developer-preview-android15.html
    accessedAt: 2026-10-17
  - title: 'The Second Developer Preview of Android 15'
    url: https://android-developers.googleblog.com/2024/03/the-second-developer-preview-of-android-15.html
    accessedAt: 2026-10-18
  - title: 'The First Beta of Android 15'
    url: https://android-developers.googleblog.com/2024/04/the-first-beta-of-android-15.html
    accessedAt: 2026-10-18
  - title: 'The Second Beta of Android 15'
    url: https://android-developers.googleblog.com/2024/05/the-second-beta-of-android-15.html
    accessedAt: 2026-10-18
  - title: 'The Third Beta of Android 15'
    url: https://android-developers.googleblog.com/2024/06/the-third-beta-of-android-15.html
    accessedAt: 2026-10-18
  - title: 'The Fourth Beta of Android 15'
    url: https://android-developers.googleblog.com/2024/07/the-fourth-beta-of-android-15.html
    accessedAt: 2026-10-18
  - title: 'Android 15 release notes, Developer Preview 1 and 2 (archived 5 April 2024)'
    url: https://web.archive.org/web/20240405121053/https://developer.android.com/about/versions/15/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 15 release notes, Beta 1 to 1.2 (archived 10 May 2024)'
    url: https://web.archive.org/web/20240510092844/https://developer.android.com/about/versions/15/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 15 release notes, Beta 2 to 2.2 (archived 10 June 2024)'
    url: https://web.archive.org/web/20240610024208/https://developer.android.com/about/versions/15/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 15 release notes, Beta 3 and 3.1 (archived 11 July 2024)'
    url: https://web.archive.org/web/20240711141847/https://developer.android.com/about/versions/15/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 15 release notes, Beta 4 to 4.2 (archived 24 August 2024)'
    url: https://web.archive.org/web/20240824150600/https://developer.android.com/about/versions/15/release-notes
    accessedAt: 2026-10-18
  - title: 'AppWidgetManager reference (setWidgetPreview)'
    url: https://developer.android.com/reference/android/appwidget/AppWidgetManager
    accessedAt: 2026-10-18
  - title: 'Android 15 Developer Preview 1 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/02/16/android-15-developer-preview-pixel/
    accessedAt: 2026-10-18
  - title: 'Android 15 Developer Preview 2 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/03/21/android-15-developer-preview-2-pixel/
    accessedAt: 2026-10-18
  - title: 'Android 15 Beta 1 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/04/11/android-15-beta-1-pixel/
    accessedAt: 2026-10-18
  - title: 'Android 15 Beta 2 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/05/15/android-15-beta-2-pixel/
    accessedAt: 2026-10-18
  - title: 'Android 15 Beta 2 available on these partner devices (9to5Google)'
    url: https://9to5google.com/2024/05/15/android-15-beta-available-for-these-devices/
    accessedAt: 2026-10-18
  - title: 'Android 15 Beta 3 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/06/18/android-15-beta-3-pixel/
    accessedAt: 2026-10-18
  - title: 'Android 15 Beta 4 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/07/18/android-15-beta-4-pixel/
    accessedAt: 2026-10-18
  - title: Android 15 is released to AOSP
    url: https://android-developers.googleblog.com/2024/09/android-15-is-released-to-aosp.html
    accessedAt: 2026-10-17
  - title: "What's new in Android 15, plus more updates (The Keyword)"
    url: https://blog.google/products/android/android-15/
    accessedAt: 2026-10-17
  - title: Bringing new theft protection features to Android users around the world
    url: https://security.googleblog.com/2024/10/android-theft-protection.html
    accessedAt: 2026-10-17
  - title: Pixel tech specs (Google Store)
    url: https://store.google.com/us/product/pixel_9_specs?hl=en-US
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps
    url: https://support.google.com/googleplay/android-developer/answer/11926878
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps (archived 29 August 2025)
    url: https://web.archive.org/web/20250829010255/https://support.google.com/googleplay/android-developer/answer/11926878?hl=en
    accessedAt: 2026-10-17
  - title: Android 15 released to AOSP, Pixel update in 'coming weeks' (9to5Google)
    url: https://9to5google.com/2024/09/03/android-15-aosp/
    accessedAt: 2026-10-17
  - title: Google launches Android 15, rolling out now to Pixel (9to5Google)
    url: https://9to5google.com/2024/10/15/google-android-15-pixel-launch/
    accessedAt: 2026-10-17
  - title: Pixel 9 runs Android 14 out of the box (9to5Google)
    url: https://9to5google.com/2024/08/13/pixel-9-android-14/
    accessedAt: 2026-10-17
  - title: Android 15's Landroid Easter egg as a screen saver (9to5Google)
    url: https://9to5google.com/2024/07/19/android-15-landroid/
    accessedAt: 2026-10-17
  - title: Android 15's internal code name is Vanilla Ice Cream (Android Authority)
    url: https://www.androidauthority.com/android-15-vanilla-ice-cream-3292769/
    accessedAt: 2026-10-17
  - title: Compatibility framework changes (Android 15)
    url: https://developer.android.com/about/versions/15/reference/compat-framework-changes
    accessedAt: 2026-10-18
  - title: Compatibility framework tools (test and debug)
    url: https://developer.android.com/guide/app-compatibility/test-debug
    accessedAt: 2026-10-18
  - title: Set up the Android 15 SDK
    url: https://developer.android.com/about/versions/15/setup-sdk
    accessedAt: 2026-10-18
  - title: 'Android Gradle plugin: minimum versions of tools for each API level'
    url: https://developer.android.com/build/releases/about-agp
    accessedAt: 2026-10-18
  - title: Foreground service timeouts
    url: https://developer.android.com/develop/background-work/services/fgs/timeout
    accessedAt: 2026-10-18
  - title: Foreground service types
    url: https://developer.android.com/develop/background-work/services/fgs/service-types
    accessedAt: 2026-10-18
  - title: NotificationManager reference (setInterruptionFilter, setNotificationPolicy)
    url: https://developer.android.com/reference/android/app/NotificationManager
    accessedAt: 2026-10-18
  - title: 'Lint check Aligned16KB: native library dependency not 16 KB aligned'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/Aligned16KB.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check ForegroundServicePermission'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/ForegroundServicePermission.md.html
    accessedAt: 2026-10-18
  - title: Android 15 is finally here in stable with a Pixel Feature Drop (Android Police)
    url: https://www.androidpolice.com/android-15-announcement-pixel-feature-drop/
    accessedAt: 2026-10-18
  - title: Android 15 is officially out, but not in the way you want (Android Police)
    url: https://www.androidpolice.com/android-15-officially-out-but-not-in-the-way-you-want/
    accessedAt: 2026-10-18
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
---

Android 15 es la versión en la que edge-to-edge dejó de ser opcional. Las apps
con target API 35 se dibujan detrás de la barra de estado y de navegación por
defecto, y los foreground services de tipo `dataSync` tienen un límite de
tiempo diario. Para el usuario trajo el espacio privado, una zona con bloqueo
que oculta apps del resto del teléfono.

![La pantalla de inicio de un teléfono con un fondo oscuro y una onda azul pálido arriba, la fecha arriba a la izquierda, cinco íconos redondos de apps en el dock y una barra de búsqueda de Google debajo](./assets/android-15-home-screen.png 'La pantalla de inicio de Android 15, capturada en el emulador de Android. Wikimedia Commons · Apache 2.0')

## De un vistazo

|                                    |                                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| Versión                            | Android 15                                                                                          |
| Nivel de API                       | 35                                                                                                  |
| Nombre                             | Vanilla Ice Cream, interno; visible en la constante del SDK. Nombre público: Android 15             |
| `Build.VERSION_CODES`              | `VANILLA_ICE_CREAM`                                                                                 |
| Lanzamiento                        | Código en AOSP el 3 de septiembre de 2024; despliegue en Pixel desde el 15 de octubre de 2024       |
| Dispositivos de lanzamiento        | Ninguno al salir: la serie Pixel 9 llegó con Android 14                                             |
| Plazo de target API en Google Play | Apps nuevas y actualizaciones desde el 31 de agosto de 2025, con prórroga al 1 de noviembre de 2025 |
| Herramientas                       | `compileSdk 35`, Android Gradle Plugin 8.6 o posterior (Studio abajo)                               |

La tabla de compatibilidad de Google indica Android Studio Koala Feature Drop y
AGP 8.6.0 como mínimo para API 35, y numera esa versión de Studio como
2024.2.1. La página de configuración del SDK de Android 15 pide Koala Feature
Drop 2024.1.2 o superior y AGP 8.6.1 o superior. Usa la versión de AGP más
alta cuando no coinciden.

La primera developer preview salió el 16 de febrero de 2024. Le siguieron una
segunda preview y cuatro betas, y la Beta 3 alcanzó la estabilidad de
plataforma el 18 de junio de 2024. Cada hito es una de las partes que siguen a
esta vista general. El 3 de septiembre
de 2024 Google publicó el código de Android 15 en AOSP antes de que ningún Pixel
recibiera la actualización, algo que rompía la costumbre de lanzar ambos el
mismo día. La última versión que los había separado fue Android 12. El tag
`android-15.0.0_r1` tiene fecha del 5 de septiembre. El despliegue en Pixel
empezó el 15 de octubre de 2024 para el Pixel 6 y posteriores, el Pixel Fold y
la Pixel Tablet.

Los Pixel 9, presentados en agosto de 2024, venían con Android 14 de fábrica.
El primer Pixel vendido con Android 15 fue el Pixel 9a. El anuncio de Google
nombró además a Samsung, Honor, Lenovo, Motorola, Nothing, OnePlus, Oppo, Sony,
vivo y Xiaomi entre los fabricantes que llevarían la actualización en los meses
siguientes.

El nombre en clave Vanilla Ice Cream nunca se usó en el marketing, pero es la
constante del SDK, y AOSP la documenta en una línea: `Vanilla Ice Cream.`
Apareció en cambios de código de AOSP mucho antes del lanzamiento, según
informó Android Authority.

## Qué trajo

- **Espacio privado.** Una zona separada y con bloqueo para apps sensibles.
  Sus apps tienen su propio contenedor en el launcher y, mientras está
  bloqueado, desaparecen de recientes, notificaciones, ajustes y otras apps.
  Puede usar el bloqueo del dispositivo o uno propio, y admitir una cuenta de
  Google distinta.
- **Archivado de apps.** `PackageInstaller.requestArchive()` borra el APK y la
  caché de una app pero conserva sus datos; `requestUnarchive()` la restaura.
  En Pixel, el usuario también puede archivar una app desde App info.
- **Compartir una sola app.** El usuario puede compartir o grabar la ventana de
  una app en vez de toda la pantalla. Apareció primero en Android 14 QPR2;
  Android 15 suma callbacks de `MediaProjection` para adaptar la experiencia.
- **PDF.** `PdfRenderer` abre archivos protegidos con contraseña y admite
  anotaciones, edición de formularios (`FormEditRecord`), búsqueda de texto
  (`Page.searchText()`) y selección con copia. `PdfRendererPreV` lleva la misma
  API a Android 11 y posteriores.
- **Satélite.** `ServiceState.isUsingNonTerrestrialNetwork()` indica que el
  dispositivo está en una red satelital. Las apps de SMS, MMS y RCS
  preinstaladas pueden enviar y recibir mensajes por ella.
- **Cámara.** Low Light Boost aclara la vista previa con poca luz, y
  `FLASH_SINGLE_STRENGTH_DEFAULT_LEVEL` y `FLASH_TORCH_STRENGTH_DEFAULT_LEVEL`
  dan a las apps control sobre la intensidad del flash.
- **Audio y video.** `LoudnessCodecController` aplica el estándar de sonoridad
  CTA-2075 al contenido AAC que trae metadatos de sonoridad. El decodificador
  AV1 por software dav1d está disponible como `c2.android.av1-dav1d.decoder`
  en dispositivos sin decodificación AV1 por hardware; las apps lo eligen por
  nombre, y las actualizaciones del sistema de Google Play lo llevan hasta
  Android 11.
- **Pago con NFC.** En los dispositivos compatibles, el modo de observación de
  `NfcAdapter` permite escuchar a un lector sin responderle, así una app de
  pagos se prepara antes del primer intercambio. Un nuevo rol de Wallet
  reemplaza el ajuste de pago sin contacto predeterminado.
- **Herramientas de rendimiento.** `ApplicationStartInfo` informa si el
  arranque fue en frío, templado o en caliente, y por qué arrancó la app.
  `ProfilingManager` toma volcados de heap y muestras de pila desde la propia
  app. `StorageStats.getAppBytesByDataType()` desglosa el tamaño de la app por
  APK, código AOT y bibliotecas.
- **Bibliotecas de la plataforma.** APIs de OpenJDK 17 como
  `SequencedCollection`, que las actualizaciones del sistema de Google Play
  también llevan a Android 12 y posteriores. SQLite 3.44.3 con transacciones
  diferidas de solo lectura. `Canvas.clipShader()` y `Matrix44`.
- **Pantallas grandes.** Pares de apps guardados para pantalla dividida y una
  barra de tareas que el usuario puede fijar.
- **Vistas previas de widgets.** `AppWidgetManager.setWidgetPreview()` permite
  que una app envíe `RemoteViews` generadas como vista previa en el selector,
  en lugar de una imagen estática que pocas veces coincidía con el widget
  real.

![El cajón de apps de un launcher Android con un contenedor bloqueado llamado Private al final](./assets/private-space.png 'El espacio privado como contenedor bloqueado al final del cajón de apps. Android Developers · CC BY 2.5')

## Seguridad y privacidad

- **Protección contra robo, en dos partes.** Android 15 pide el PIN, la
  contraseña o la biometría para cambiar ajustes sensibles como Find My Device,
  bloquea el dispositivo tras varios intentos de desbloqueo fallidos y refuerza
  la protección contra el restablecimiento de fábrica. Theft Detection Lock,
  Offline Device Lock y Remote Lock son otra cosa: llegaron con una
  actualización de Google Play services a la mayoría de dispositivos con
  Android 10 o superior, no con Android 15.
- **OTP ocultos.** Los notification listeners que no son de confianza ya no
  pueden leer notificaciones en las que el sistema detectó una contraseña de
  un solo uso. Los de confianza, como las apps de dispositivos acompañantes,
  quedan exentos.
- **Protección al compartir pantalla.** Mientras se comparte la pantalla, el
  contenido de las notificaciones y los campos de contraseña quedan ocultos
  para quien mira. Una app puede marcar una vista como sensible con
  `setContentSensitivity`.
- **Detección de grabación de pantalla.**
  `WindowManager.addScreenRecordingCallback()` avisa a la app cuando la están
  grabando.
- **Redes móviles inseguras.** Nuevos ajustes avisan cuando la conexión no está
  cifrada o cuando la red pide identificadores como el IMSI de una forma que
  permitiría rastrear al usuario. Los operadores ya no pueden ocultar el
  interruptor de 2G.
- **Credential Manager.** Las apps pueden vincular campos de usuario y
  contraseña con una solicitud de Credential Manager, así sus sugerencias
  aparecen en el autocompletado. Credential Manager además muestra él mismo el
  diálogo biométrico al registrarse e iniciar sesión, y los proveedores ya no
  tienen que construir el suyo.
- **Claves de contactos.** `E2eeContactKeysManager` guarda en el sistema las
  claves públicas de los contactos para apps con cifrado de extremo a extremo,
  y permite al usuario verificarlas desde la app de contactos.
- **Comprobación de URIs de contenido.**
  `Context.checkContentUriPermissionFull()` comprueba por completo un URI de
  contenido, y el atributo de actividad `requireContentUriPermissionFromCaller`
  exige permisos sobre los URIs que pasa quien la inicia.
- **Intents inseguros.** `StrictMode.VmPolicy.Builder().detectUnsafeIntentLaunch()`
  registra en el log los usos indebidos de intents mientras desarrollas.
- **Para apps con target 35**, TLS 1.0 y 1.1 no están permitidos y los inicios
  de actividad desde segundo plano son más estrictos; ambos están en
  [la tabla de target](#apps-con-target-api-35).
- **Plataforma.** Los permisos de firma que piden apps que no son del sistema
  pasan por una allowlist explícita. Virtual A/B versión 3 hace las
  actualizaciones más pequeñas y rápidas.

## Permisos

Android 15 no agregó ningún permiso de tiempo de ejecución ni reemplazó
ninguno, así que aquí ningún permiso necesita `maxSdkVersion`. Agregó tres
permisos normales, concedidos al instalar, y cambió lo que permiten cinco de
los existentes:

| Permiso                               | Qué cambió en API 35                                                                                                                    | Qué declarar                                                                    | Qué quitar o limitar                                                     |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `FOREGROUND_SERVICE_MEDIA_PROCESSING` | Permiso normal nuevo para el nuevo tipo de foreground service `mediaProcessing`                                                         | Este permiso y `android:foregroundServiceType="mediaProcessing"` en el servicio | Nada                                                                     |
| `ACCESS_HIDDEN_PROFILES`              | Permiso normal nuevo; un launcher lo necesita, junto con el rol de home, para mostrar el espacio privado                                | Solo en un launcher                                                             | Nunca en otras apps                                                      |
| `DETECT_SCREEN_RECORDING`             | Permiso normal nuevo, exigido por `WindowManager.addScreenRecordingCallback()`                                                          | Solo si registras ese callback                                                  | Nada                                                                     |
| `FOREGROUND_SERVICE_DATA_SYNC`        | En apps con target 35, sus servicios comparten 6 horas cada 24                                                                          | Mantenlo para sincronizaciones que inicia el usuario                            | Pasa las sincronizaciones largas o repetidas a WorkManager               |
| `RECEIVE_BOOT_COMPLETED`              | En apps con target 35, un receiver de arranque no puede iniciar `dataSync`, `camera`, `mediaPlayback`, `phoneCall` ni `mediaProjection` | Mantenlo para alarmas y jobs                                                    | No inicies esos tipos de servicio desde el receiver de arranque          |
| `SYSTEM_ALERT_WINDOW`                 | En apps con target 35, permite iniciar un foreground service desde segundo plano solo con una ventana superpuesta visible               | Mantenlo si dibujas ventanas superpuestas                                       | No dependas solo de él para iniciar servicios                            |
| `ACCESS_NOTIFICATION_POLICY`          | En apps con target 35, el acceso a la política ya no cambia el estado global de No molestar                                             | Mantenlo; tus llamadas ahora manejan una `AutomaticZenRule` de tu app           | No esperes que `INTERRUPTION_FILTER_ALL` apague las reglas de otras apps |
| `REQUEST_DELETE_PACKAGES`             | Ahora también permite llamar a `PackageInstaller.requestArchive()`                                                                      | Solo si desinstalas o archivas otras apps                                       | Nada                                                                     |

Un manifiesto para una app que corre en Android 14 y anteriores y en 15 y
posteriores. Ninguno de estos permisos reemplaza a uno anterior, así que
ninguno necesita un límite de versión. Deja solo los bloques que tu app
necesita:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <!-- Sincronización: obligatorio desde API 34; desde 35 tiene 6 horas al día -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />

    <!-- Transcodificación: tipo nuevo en API 35, con el mismo presupuesto de 6 horas -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROCESSING" />

    <!-- Solo si registras un callback de grabación de pantalla -->
    <uses-permission android:name="android.permission.DETECT_SCREEN_RECORDING" />

    <!-- Solo launchers, junto con el rol de home -->
    <uses-permission android:name="android.permission.ACCESS_HIDDEN_PROFILES" />

    <application>
        <service
            android:name=".SyncService"
            android:exported="false"
            android:foregroundServiceType="dataSync" />
        <!-- Inicia este con FOREGROUND_SERVICE_TYPE_MEDIA_PROCESSING
             solo en API 35 y posteriores -->
        <service
            android:name=".TranscodeService"
            android:exported="false"
            android:foregroundServiceType="mediaProcessing" />
    </application>
</manifest>
```

El acceso a fotos, que Android 14 volvió parcial con
`READ_MEDIA_VISUAL_USER_SELECTED`, suma
`MediaStore.QUERY_ARG_LATEST_SELECTION_ONLY` para que una app consulte solo las
fotos que el usuario eligió la última vez. No requiere ninguna declaración
nueva. En [Android 14](/es/notes/android-14/) está cómo funciona el acceso
parcial.

## Qué cambió para tu app

### Todas las apps en Android 15

| Cambio                                                                              | Qué hacer                                                                                               | Cómo comprobarlo                                                                |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| No se pueden instalar apps con target menor que 24                                  | Sube el target; las apps ya instaladas se quedan                                                        | `adb install --bypass-low-target-sdk-block <apk>` la instala igual para pruebas |
| Una app detenida a la fuerza pierde sus pending intents; los widgets se ven grises  | Vuelve a registrar alarmas y pending intents con el `ACTION_BOOT_COMPLETED` del siguiente inicio        | `ApplicationStartInfo.wasForceStopped()` indica que ocurrió                     |
| Los dispositivos pueden usar páginas de memoria de 16 KB                            | Recompila las bibliotecas nativas con alineación ELF de 16 KB; las apps solo Kotlin o Java ya funcionan | Lint `Aligned16KB`; `zipalign -c -P 16 -v 4 <apk>`                              |
| Tu app puede instalarse otra vez dentro del espacio privado                         | No supongas que un segundo perfil es un perfil de trabajo                                               |                                                                                 |
| Desaparece la fuente de emoji PNG `NotoColorEmojiLegacy.ttf`                        | Dibuja los emoji con las APIs de texto de la plataforma o con COLRv1                                    | Busca `NotoColorEmojiLegacy.ttf` en tu código                                   |
| Las animaciones de predictive back aparecen en las apps que se adhirieron           | Si te adheriste, revisa las animaciones de retroceso y las transiciones de fragments                    |                                                                                 |
| Las peticiones de red fuera de un ciclo de vida válido del proceso fallan           | Ata las peticiones a un ciclo de vida; usa WorkManager o un foreground service para trabajo largo       |                                                                                 |
| Un track de audio directo u offload nuevo puede invalidar el tuyo                   | Maneja que tu `AudioTrack` quede invalidado cuando se alcanzan los límites de recursos                  |                                                                                 |
| Desde Android 15 QPR1, la proyección de pantalla se detiene al bloquear la pantalla | Maneja el fin de la proyección; un chip en la barra de estado también permite detenerla                 |                                                                                 |

### Apps con target API 35

| Cambio                                                                             | Qué hacer                                                                                         | Cómo comprobarlo                                                                |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Edge-to-edge es el comportamiento por defecto; `setStatusBarColor` no hace nada    | Maneja los window insets; los componentes de Material 3 lo hacen por ti                           | Compat `ENFORCE_EDGE_TO_EDGE` (309578419)                                       |
| Los modos de recorte de pantalla distintos de `ALWAYS` se leen como `ALWAYS`       | Aplica padding de insets; un crash al iniciar apunta a core splashscreen anterior a 1.2.0-alpha01 |                                                                                 |
| `Configuration.screenWidthDp` y `screenHeightDp` incluyen las barras del sistema   | Calcula el layout con `WindowInsets` o `WindowMetricsCalculator`, no con `Configuration`          |                                                                                 |
| Los servicios `dataSync` y `mediaProcessing` tienen 6 horas cada 24                | Llama a `stopSelf()` en `Service.onTimeout(int, int)` o pasa el trabajo a WorkManager             | Compat `FGS_INTRODUCE_TIME_LIMITS` (317799821)                                  |
| Los receivers de arranque no pueden iniciar cinco tipos de foreground service      | Inícialos más tarde, a partir de una acción del usuario                                           | Compat `FGS_BOOT_COMPLETED_RESTRICTIONS` (296558535)                            |
| `SYSTEM_ALERT_WINDOW` solo ya no inicia servicios desde segundo plano              | Muestra antes una ventana superpuesta visible                                                     | Compat `FGS_SAW_RESTRICTIONS` (319471980)                                       |
| Quien crea un `PendingIntent` bloquea los inicios de actividad desde segundo plano | Acepta de forma explícita si quien lo envía debe abrir tu actividad                               | Compat `DEFAULT_RESCIND_BAL_PRIVILEGES_FROM_PENDING_INTENT_CREATOR` (296478951) |
| TLS 1.0 y 1.1 no están permitidos                                                  | Usa TLS 1.2 o superior en todos los servidores                                                    |                                                                                 |
| Las peticiones de audio focus desde segundo plano fallan                           | Pide el foco con la app al frente o desde un foreground service                                   | La llamada devuelve `AUDIOFOCUS_REQUEST_FAILED`                                 |
| Las apps no pueden cambiar el No molestar global                                   | Aporta una `AutomaticZenRule`                                                                     | Compat `MANAGE_GLOBAL_ZEN_VIA_IMPLICIT_RULES` (308670109)                       |
| `elegantTextHeight` es true por defecto                                            | Revisa los layouts en árabe, tailandés, tamil y los demás sistemas de escritura listados          | Compat `DEPRECATE_UI_FONT` (279646685)                                          |
| `TextView` ocupa más ancho con letras de forma compleja                            | Revisa los layouts ajustados; `setUseBoundsForWidth(false)` vuelve al ancho anterior              |                                                                                 |
| `EditText` reserva la altura de línea del locale                                   | Pon `useLocalePreferredLineHeightForMinimum` en false para volver a la altura anterior            |                                                                                 |
| `Arrays.asList(...).toArray()` devuelve `Object[]`                                 | Usa `toArray(new String[0])`                                                                      | Compat `DO_NOT_CLONE_IN_ARRAYS_AS_LIST` (202956589)                             |
| `String.format()` valida los formatos de forma estricta                            | Corrige índices de argumento del estilo `%0`                                                      | Compat `ENABLE_STRICT_FORMATTER_VALIDATION` (270674727)                         |
| Hebreo, ídish e indonesio conservan sus códigos ISO 639-1                          | Espera `he`, `yi` e `id`, no `iw`, `ji` e `in`                                                    | Compat `USE_NEW_ISO_LOCALE_CODES` (291868760)                                   |
| `Random.ints()` ya no coincide con `Random.nextInt()`                              | No dependas de que las dos secuencias sean iguales                                                | Compat `STREAM_INT_DIFFERS_FROM_NEXT_INT` (308103782)                           |
| Los callbacks de red incluyen las redes locales por defecto                        | Revisa los callbacks que suponían solo redes con internet                                         | Compat `ENABLE_MATCH_LOCAL_NETWORK` (319212206)                                 |

La lista de compatibilidad también incluye cambios en sesiones de cámara, en
el propietario del dispositivo y en el análisis de `Content-Disposition` que
afectan a pocas apps. Todo cambio con ID se puede activar o desactivar en una
compilación depurable.

El cambio a edge-to-edge es el que más apps notaron. Las barras se vuelven
transparentes (la navegación de tres botones conserva un velo del 80 %) y lo
que no tenga padding de insets queda debajo: top app bars, botones flotantes,
el último elemento de una lista. Con target 35 todavía se podía salir con
`windowOptOutEdgeToEdgeEnforcement` mientras se arreglaban las pantallas.

El nuevo tipo `mediaProcessing`, pensado para tareas como transcodificar,
tiene el mismo presupuesto de seis horas que `dataSync`:

```mermaid title="Un foreground service dataSync en una app con target API 35"
flowchart TD
  start([startForeground con tipo dataSync]) --> run[El servicio corre]
  run -- 6 horas usadas en las últimas 24 --> timeout[El sistema llama a onTimeout]
  timeout -- stopSelf en pocos segundos --> stopped[El servicio se detiene bien]
  timeout -- sigue corriendo --> crash[RemoteServiceException]
  stopped --> again{¿Iniciar otro dataSync?}
  again -- la app sigue en segundo plano --> denied[ForegroundServiceStartNotAllowedException]
  again -- el usuario trae la app al frente --> reset[El contador se reinicia]
```

Los cinco tipos bloqueados en el arranque son `dataSync`, `camera`,
`mediaPlayback`, `phoneCall` y `mediaProjection`; `microphone` lo está desde
Android 14.

## Migrar a API 35

De `targetSdk 34` a 35, en este orden:

1. **Actualiza las herramientas.** Pon `compileSdk 35`, usa AGP 8.6 o
   posterior y Android Studio Koala Feature Drop o posterior. Si lo saltas,
   las constantes nuevas (`FOREGROUND_SERVICE_TYPE_MEDIA_PROCESSING`) no
   compilan. Compilar contra 35 hace además que `list.removeFirst()` y
   `removeLast()` de Kotlin se resuelvan con los nuevos métodos de `List`, que
   fallan con `NoSuchMethodError` en Android 14 y anteriores. Comprueba: lint
   `NewApi` no reporta errores, y quita cualquier `@SuppressLint("NewApi")` que
   los oculte; usa `removeAt(0)` en su lugar.
2. **Maneja los insets en todas las pantallas.** Aplica padding con
   `WindowInsets`, agrega `android:fitsSystemWindows="true"` a un
   `AppBarLayout` y `clipToPadding="false"` a un `RecyclerView` con padding.
   Si lo saltas, barras, botones y elementos de lista quedan debajo de la
   barra de estado y la de navegación. Comprueba: en un dispositivo con
   Android 15, abre cada pantalla, incluidas la de bienvenida y los ajustes,
   con navegación por gestos y con tres botones.
3. **Acota tus foreground services.** Implementa `Service.onTimeout(int, int)`
   en los servicios `dataSync` y `mediaProcessing`, pasa a una acción del
   usuario los inicios en el arranque de los cinco tipos bloqueados y muestra
   una ventana superpuesta antes de iniciar con `SYSTEM_ALERT_WINDOW`. Si lo
   saltas, los servicios fallan o lanzan
   `ForegroundServiceStartNotAllowedException`. Comprueba:
   `adb shell am compat enable FGS_INTRODUCE_TIME_LIMITS <package>`, acorta el
   límite con
   `adb shell device_config put activity_manager data_sync_fgs_timeout_duration <ms>`
   y envía `adb shell am broadcast -a android.intent.action.BOOT_COMPLETED <package>`
   con `FGS_BOOT_COMPLETED_RESTRICTIONS` activado. Lint
   `ForegroundServicePermission` detecta un permiso de tipo que falta.
4. **Revisa los inicios desde segundo plano.** Donde otra app o el sistema
   deban abrir tu actividad con tu `PendingIntent`, concédelo de forma
   explícita. Si lo saltas, esos inicios se bloquean. Comprueba: recorre el
   flujo con el target ya subido.
5. **Revisa red y audio.** Cada servidor debe usar TLS 1.2 o superior, y el
   audio focus se pide con la app al frente o desde un foreground service. Si
   lo saltas, las conexiones fallan y las peticiones de foco devuelven
   `AUDIOFOCUS_REQUEST_FAILED`. Comprueba: ejecuta cada llamada al servidor y
   cada ruta de reproducción en Android 15.
6. **Recorre las filas menores** de la tabla de target que te apliquen:
   `elegantTextHeight`, anchos de texto, `String.format()`, `Arrays.asList()`,
   códigos de idioma, `Random.ints()`, callbacks de redes locales y No
   molestar.
7. **Revisa las páginas de 16 KB.** Google Play exige que las apps con target
   35 o superior soporten páginas de 16 KB en dispositivos de 64 bits. Si lo
   saltas, Play rechazará las actualizaciones desde el 1 de febrero de 2027.
   Comprueba: lint `Aligned16KB`, `zipalign -c -P 16 -v 4 <apk>` y un emulador
   de 16 KB donde `adb shell getconf PAGE_SIZE` imprima `16384`.
8. **Prueba el resultado** en un dispositivo o emulador con Android 15 y
   `targetSdk 35`. Para aislar un cambio, actívalo o desactívalo en una
   compilación depurable desde Opciones de desarrollador > "App Compatibility
   Changes", o con `adb shell am compat disable <change ID> <package>`.

Si saltas varios niveles a la vez: sigue los pasos de cada versión en orden,
empezando por [Android 14](/es/notes/android-14/) si tu target es 33 o menor.

## Qué perduró

- **Edge-to-edge se volvió obligatorio.** Para apps con target Android 16,
  `windowOptOutEdgeToEdgeEnforcement` está obsoleto y se ignora.
- **Predictive back fue más lejos.** Las apps con target Android 16 tienen las
  animaciones del sistema por defecto y ya no se llama a `onBackPressed`.
- **`elegantTextHeight`**, activado por defecto aquí, está obsoleto en Android
  16 y se ignora en las apps con ese target.
- **Las páginas de 16 KB se volvieron una regla de Play.** Desde el 1 de
  noviembre de 2025, las apps nuevas y las actualizaciones con target Android
  15 o superior debían soportar páginas de 16 KB en dispositivos de 64 bits. La
  página actual fija el 1 de febrero de 2027 como la fecha desde la que se
  rechazan las actualizaciones que no cumplan. Android 16 agregó un modo de
  compatibilidad para algunas apps de 4 KB.
- **El espacio privado, el archivado de apps y los límites de tiempo de los
  foreground services** siguen igual.

## Para saber

- El Easter egg es **Landroid**, el juego espacial de Android 14. Mantener
  pulsado el logotipo de Android 15 carga un salto estelar durante cinco
  segundos, con el teléfono vibrando, antes de abrir el juego.
- Como novedad de Android 15, el juego también funciona como protector de
  pantalla una vez desbloqueado. Su descripción en AOSP es
  `---- AUTOPILOT ENGAGED ----`, y la nave vuela sola entre planetas.
- Google midió las páginas de 16 KB en sus propios dispositivos: arranques de
  apps cerca de un 3 % más rápidos con poca memoria libre y un inicio del
  sistema alrededor de un 8 % (unos 950 ms) más rápido de media.
- Android 15 estrenó el kernel `android15-6.6`, sobre Linux 6.6. También admite
  kernels GKI anteriores hasta `android12-5.10`, así que un teléfono actualizado
  puede conservar el kernel con el que salió. Desde esta versión hay un solo
  kernel GKI nuevo por versión de kernel: no existe `android15-6.1`.
