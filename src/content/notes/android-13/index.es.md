---
entryId: notes-android-13-es
locale: es
translationKey: android-13
slug: android-13
title: 'Android 13: permisos de notificaciones y medios'
summary: API 33, agosto de 2022. Notificar pasó a requerir permiso, READ_EXTERNAL_STORAGE se dividió en tres permisos de medios y llegó un selector de fotos que no pide permisos.
visibility: public
maturity: stable
publishedAt: 2026-10-17
topics: [android, platform-apis, security]
image: /banners/android-13.svg
imageAlt: 'Banner de Android 13 Tiramisu, con el logo de la versión.'
links:
  - label: Funciones y APIs de Android 13
    href: https://developer.android.com/about/versions/13/features
    kind: publication
  - label: 'Cambios de comportamiento: apps con target Android 13'
    href: https://developer.android.com/about/versions/13/behavior-changes-13
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
  order: 15
citations:
  - title: 'Android 13 emblem — Wikimedia Commons (PD-textlogo, trademark of Google LLC)'
    url: https://commons.wikimedia.org/wiki/File:Android_13_Developer_Preview_logo.svg
    accessedAt: 2026-10-17
  - title: Android 13 features and APIs
    url: https://developer.android.com/about/versions/13/features
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 13)'
    url: https://developer.android.com/about/versions/13/behavior-changes-all
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 13'
    url: https://developer.android.com/about/versions/13/behavior-changes-13
    accessedAt: 2026-10-17
  - title: Set up the Android 13 SDK
    url: https://developer.android.com/about/versions/13/setup-sdk
    accessedAt: 2026-10-17
  - title: Notification runtime permission
    url: https://developer.android.com/develop/ui/views/notifications/notification-permission
    accessedAt: 2026-10-17
  - title: Photo picker
    url: https://developer.android.com/training/data-storage/shared/photopicker
    accessedAt: 2026-10-17
  - title: Per-app language preferences
    url: https://developer.android.com/guide/topics/resources/app-languages
    accessedAt: 2026-10-17
  - title: Copy and paste
    url: https://developer.android.com/develop/ui/views/touch-and-input/copy-paste
    accessedAt: 2026-10-17
  - title: Intents and intent filters
    url: https://developer.android.com/guide/components/intents-filters
    accessedAt: 2026-10-17
  - title: Schedule alarms
    url: https://developer.android.com/develop/background-work/services/alarms
    accessedAt: 2026-10-17
  - title: Context reference (revokeSelfPermissionsOnKill)
    url: https://developer.android.com/reference/android/content/Context
    accessedAt: 2026-10-17
  - title: PackageInstaller reference (PACKAGE_SOURCE_*)
    url: https://developer.android.com/reference/android/content/pm/PackageInstaller
    accessedAt: 2026-10-17
  - title: Build.VERSION_CODES reference
    url: https://developer.android.com/reference/android/os/Build.VERSION_CODES
    accessedAt: 2026-10-17
  - title: Add support for predictive back
    url: https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture
    accessedAt: 2026-10-17
  - title: Schedule exact alarms are denied by default (Android 14)
    url: https://developer.android.com/about/versions/14/changes/schedule-exact-alarms
    accessedAt: 2026-10-17
  - title: Grant partial access to photos and videos (Android 14)
    url: https://developer.android.com/about/versions/14/changes/partial-photo-video-access
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 14'
    url: https://developer.android.com/about/versions/14/behavior-changes-14
    accessedAt: 2026-10-17
  - title: Android 13 and Android 13 QPR release notes (AOSP)
    url: https://source.android.com/docs/setup/about/android-13-release
    accessedAt: 2026-10-17
  - title: Security enhancements (AOSP)
    url: https://source.android.com/docs/security/enhancements
    accessedAt: 2026-10-17
  - title: Android 13 Compatibility Definition (AOSP)
    url: https://source.android.com/docs/compatibility/13/android-13-cdd
    accessedAt: 2026-10-17
  - title: Android 15 Compatibility Definition (AOSP)
    url: https://source.android.com/docs/compatibility/15/android-15-cdd
    accessedAt: 2026-10-17
  - title: Codenames, tags, and build numbers (AOSP)
    url: https://source.android.com/docs/setup/reference/build-numbers
    accessedAt: 2026-10-17
  - title: Build.java at android-13.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r1/core/java/android/os/Build.java
    accessedAt: 2026-10-17
  - title: ClipboardService.java at android-13.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r1/services/core/java/com/android/server/clipboard/ClipboardService.java
    accessedAt: 2026-10-17
  - title: InstallPackageHelper.java at android-13.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r1/services/core/java/com/android/server/pm/InstallPackageHelper.java
    accessedAt: 2026-10-17
  - title: RestrictedPreferenceHelper.java at android-13.0.0_r1 (AOSP Settings)
    url: https://android.googlesource.com/platform/packages/apps/Settings/+/refs/tags/android-13.0.0_r1/src/com/android/settings/accessibility/RestrictedPreferenceHelper.java
    accessedAt: 2026-10-17
  - title: RestrictedSwitchPreference.java at android-13.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r1/packages/SettingsLib/src/com/android/settingslib/RestrictedSwitchPreference.java
    accessedAt: 2026-10-17
  - title: PlatLogoActivity.java at android-13.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r1/core/java/com/android/internal/app/PlatLogoActivity.java
    accessedAt: 2026-10-17
  - title: Android 13 is in AOSP!
    url: https://android-developers.googleblog.com/2022/08/android-13-is-in-aosp.html
    accessedAt: 2026-10-17
  - title: First preview of Android 13
    url: https://android-developers.googleblog.com/2022/02/first-preview-android-13.html
    accessedAt: 2026-10-17
  - title: 'Lucky number Android 13: The latest features and updates (The Keyword)'
    url: https://blog.google/products/android/android-13/
    accessedAt: 2026-10-17
  - title: 'The latest and greatest: meet Pixel 7 and Pixel 7 Pro (The Keyword)'
    url: https://blog.google/products-and-platforms/devices/pixel/pixel-7-pixel-7-pro/
    accessedAt: 2026-10-17
  - title: Pixel phone hardware tech specs
    url: https://support.google.com/pixelphone/answer/7158570
    accessedAt: 2026-10-17
  - title: Learn about restricted settings (Android Help)
    url: https://support.google.com/android/answer/12623953
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps (archived 16 March 2023)
    url: https://web.archive.org/web/20230316194303/https://support.google.com/googleplay/android-developer/answer/11926878?hl=en
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps (archived 16 October 2023)
    url: https://web.archive.org/web/20231016070924/https://support.google.com/googleplay/android-developer/answer/11926878?hl=en
    accessedAt: 2026-10-17
  - title: 'Android 13 review: Plans for the future, but not much to offer today (Ars Technica)'
    url: https://arstechnica.com/gadgets/2022/08/android-13-review-plans-for-the-future-but-not-much-to-offer-today/
    accessedAt: 2026-10-17
  - title: Google releases Android 13 for Pixel phones (MobileSyrup)
    url: https://mobilesyrup.com/2022/08/15/google-releases-android-13-pixel-phones/
    accessedAt: 2026-10-17
  - title: Android 13 Easter egg (9to5Google)
    url: https://9to5google.com/2022/06/27/android-13-easter-egg/
    accessedAt: 2026-10-17
  - title: Android 13 restricted setting blocks sideloaded apps from notifications (Chrome Unboxed)
    url: https://chromeunboxed.com/android-13-restricted-setting-feature-blocks-sideloaded-apps-from-notifications/
    accessedAt: 2026-10-17
  - title: Android 15 sideloaded apps restrictions (9to5Google)
    url: https://9to5google.com/2024/09/12/android-15-sideloaded-apps-restrictions/
    accessedAt: 2026-10-17
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
  - title: 'Captura de la pantalla de inicio de Android 13 — Wikimedia Commons (Free screenshot, Apache 2.0)'
    url: https://commons.wikimedia.org/wiki/File:Android_13_Homescreen_Screenshot.png
    accessedAt: 2026-10-18
  - title: ScanResult reference (WIFI_STANDARD_11BE)
    url: https://developer.android.com/reference/android/net/wifi/ScanResult
    accessedAt: 2026-10-18
  - title: Android 13 Developer Preview 2
    url: https://android-developers.googleblog.com/2022/03/second-preview-android-13.html
    accessedAt: 2026-10-18
  - title: 'The Beta for Android 13 is out now: Android 13 Beta 1'
    url: https://android-developers.googleblog.com/2022/04/android-13-beta-1-blog.html
    accessedAt: 2026-10-18
  - title: Second Beta of Android 13
    url: https://android-developers.googleblog.com/2022/05/second-beta-of-android-13.html
    accessedAt: 2026-10-18
  - title: Android 13 Beta 3 and Platform Stability
    url: https://android-developers.googleblog.com/2022/06/android-13-beta-3-platform-stability.html
    accessedAt: 2026-10-18
  - title: 'Final Android 13 Beta update, official release is next!'
    url: https://android-developers.googleblog.com/2022/07/Final-Android-13-Beta-update-official-release-is-next.html
    accessedAt: 2026-10-18
  - title: 'Android 13 release notes, Developer Preview 1 to Beta 4.1 (archived 13 August 2022)'
    url: https://web.archive.org/web/20220813171935/https://developer.android.com/about/versions/13/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 13 gets accelerated release timeline with earlier betas (9to5Google)'
    url: https://9to5google.com/2022/02/10/android-13-timeline/
    accessedAt: 2026-10-18
  - title: 'Google releases Android 13 DP2 for Pixel phones (9to5Google)'
    url: https://9to5google.com/2022/03/17/android-13-dp2-release/
    accessedAt: 2026-10-18
  - title: 'Google rolling out Android 13 Beta 1 for Pixel phones (9to5Google)'
    url: https://9to5google.com/2022/04/26/android-13-beta-1-pixel-launch/
    accessedAt: 2026-10-18
  - title: 'Android 13 Beta 2 hands-on: Top new features (9to5Google)'
    url: https://9to5google.com/2022/05/11/android-13-beta-2/
    accessedAt: 2026-10-18
  - title: 'Google releases Android 13 Beta 3 for Pixel phones (9to5Google)'
    url: https://9to5google.com/2022/06/08/android-13-beta-3-pixel-launch/
    accessedAt: 2026-10-18
  - title: 'Google rolling out Android 13 Beta 4 for Pixel (9to5Google)'
    url: https://9to5google.com/2022/07/13/android-13-beta-4-pixel-launch/
    accessedAt: 2026-10-18
  - title: Compatibility framework changes (Android 13)
    url: https://developer.android.com/about/versions/13/reference/compat-framework-changes
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
  - title: Request permission to access nearby Wi-Fi devices
    url: https://developer.android.com/develop/connectivity/wifi/wifi-permissions
    accessedAt: 2026-10-18
  - title: Handle user-initiated stopping of apps running foreground services
    url: https://developer.android.com/develop/background-work/services/fgs/handle-user-stopping
    accessedAt: 2026-10-18
  - title: 'Behavior changes: apps targeting Android 16 (health permissions)'
    url: https://developer.android.com/about/versions/16/behavior-changes-16
    accessedAt: 2026-10-18
  - title: AdvertisingIdClient.Info reference (AD_ID and tools:node="remove")
    url: https://developers.google.com/android/reference/com/google/android/gms/ads/identifier/AdvertisingIdClient.Info
    accessedAt: 2026-10-18
  - title: Advertising ID (Play Console Help)
    url: https://support.google.com/googleplay/android-developer/answer/6048248
    accessedAt: 2026-10-18
  - title: 'Lint check NotificationPermission: Notifications Without Permission'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/NotificationPermission.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check ScopedStorage: Affected by scoped storage'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/ScopedStorage.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check ExactAlarm: Invalid Usage of Exact Alarms'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/ExactAlarm.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check UnspecifiedRegisterReceiverFlag: Missing registerReceiver() exported flag'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/UnspecifiedRegisterReceiverFlag.md.html
    accessedAt: 2026-10-18
  - title: 'Android 13 review: The update we need, not the one we want (Android Police)'
    url: https://www.androidpolice.com/android-13-review/
    accessedAt: 2026-10-18
  - title: 'Android 13 Developer Preview 1 is here (XDA Developers)'
    url: https://www.xda-developers.com/android-13-developer-preview-1/
    accessedAt: 2026-10-18
---

Android 13 es la versión en la que una app tuvo que pedir permiso antes de
enviar una notificación. También dividió el permiso de almacenamiento en
imágenes, video y audio, y trajo un selector de fotos que no necesita permisos.
Para quien desarrolla, el resto fue una lista corta: idioma por app, íconos
temáticos y una entrega de intents más estricta.

## De un vistazo

|                                    |                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| Versión                            | Android 13                                                                      |
| Nivel de API                       | 33                                                                              |
| Nombre                             | Tiramisu, interno, pero visible en la constante del SDK                         |
| `Build.VERSION_CODES`              | `TIRAMISU`                                                                      |
| Lanzamiento                        | Código en AOSP y despliegue en Pixel desde el 15 de agosto de 2022              |
| Dispositivos de lanzamiento        | Pixel 7 y Pixel 7 Pro, anunciados el 6 de octubre de 2022                       |
| Plazo de target API en Google Play | Apps nuevas y actualizaciones desde el 31 de agosto de 2023 (prórroga al 1 nov) |
| Herramientas                       | `compileSdk 33`, Android Gradle Plugin 7.2 o posterior (Studio abajo)           |

La tabla de compatibilidad de Google indica Android Studio Flamingo (2022.2.1)
como mínimo para API 33. La página de configuración del SDK de Android 13,
escrita en el lanzamiento, recomienda Chipmunk (2021.2.1) o superior y escribe
`compileSdk 33` para AGP 7.0 o posterior. Usa la tabla más nueva cuando no
coinciden.

Google publicó Android 13 en AOSP y empezó el despliegue en Pixel el 15 de
agosto de 2022. Su anuncio nombró a Samsung, Asus, HMD, Motorola, OnePlus,
OPPO, Sony, Xiaomi y otros para más adelante ese año. Los primeros teléfonos de
Google vendidos con esta versión fueron el Pixel 7 y el Pixel 7 Pro, anunciados
el 6 de octubre y en tiendas de Estados Unidos desde el 13 de octubre.

El nombre público es solo Android 13. Tiramisu es el nombre interno de postre,
y desde esta versión ya no está oculto: la constante es `TIRAMISU`, no una
letra, y el SDK Manager de Android Studio muestra la plataforma como
"Android 13.0 ("Tiramisu")". Los build IDs empiezan con T (`TP1A`).

Google anunció Android 13 con la Developer Preview 1 el 10 de febrero de 2022.
La Beta 1 llegó el 26 de abril y la Beta 3 alcanzó la estabilidad de plataforma
el 8 de junio, con el SDK de API 33 y el comportamiento hacia las apps
congelados. Las dos developer previews y las cuatro betas son las partes que
siguen a esta presentación.

![La pantalla de inicio de un teléfono con un fondo oscuro y una onda azul pálido arriba, la fecha arriba a la izquierda, cinco íconos redondos de apps en el dock y una barra de búsqueda de Google debajo](./assets/android-13-home-screen.png 'La pantalla de inicio de Android 13, capturada en el Android Emulator. Wikimedia Commons · Apache 2.0')

## Qué trajo

- **Idioma por app.** El usuario elige un idioma para cada app en "App
  languages", mientras el sistema sigue en otro. Una app declara
  `android:localeConfig` para aparecer ahí y puede fijar el idioma con
  `LocaleManager.setApplicationLocales()`. AppCompat 1.6 lleva la API a
  versiones anteriores.
- **Íconos temáticos.** Una app que agrega una capa monocromática a su ícono
  adaptativo se tiñe con los colores del fondo de pantalla, si el usuario activa
  "Themed icons" y el launcher lo soporta. Ars Technica señaló que la función
  seguía en beta en el lanzamiento.
- **Vista previa del portapapeles.** Al copiar aparece una confirmación pequeña
  con una vista previa del contenido, como la miniatura de una captura; al
  tocarla se abre un editor.
- **Foreground Services Task Manager.** La parte inferior de Quick Settings
  muestra cuántas apps tienen un servicio en primer plano, con un botón "Stop"
  para cada una.
- **API de ubicación en Quick Settings.** Una app puede pedirle al usuario, en
  un solo diálogo del sistema, que agregue su tile.
- **Controles multimedia.** El reproductor del sistema se arma a partir del
  `PlaybackState` de la sesión multimedia; lo que cambia para las apps con
  target 33 está en [la tabla de target](#apps-con-target-api-33).
- **Audio.** Bluetooth LE Audio integrado en dispositivos compatibles, MIDI 2.0
  por USB, audio espacial con seguimiento de cabeza y APIs de `AudioManager`
  que le dicen a una app por dónde va a salir su audio.
- **Gráficos y texto.** `RuntimeShader` con AGSL, emoji vectoriales COLRv1,
  separación silábica hasta 200% más rápida, mejor altura de línea para
  escrituras no latinas y cortes de línea por frase en japonés.
- **Runtime.** Llamadas JNI hasta 2,5 veces más rápidas, procesamiento de
  referencias casi sin bloqueos y un primer grupo de APIs de OpenJDK 11
  (`String.strip()`, `Optional.isEmpty()` y más), que también llegaron a
  Android 12 por el módulo de ART. Un recolector de basura basado en
  `userfaultfd` del kernel no venía en la versión: Google dijo que llegaría a
  los dispositivos con Android 13 en una actualización posterior del sistema
  de Google Play.
- **Wi-Fi 7.** `ScanResult.WIFI_STANDARD_11BE`, nuevo en API 33, permite que
  una app distinga los puntos de acceso 802.11be en los resultados de escaneo.
  Que un teléfono se conecte por Wi-Fi 7 depende de su hardware.
- **Predictive back.** Nuevas APIs permiten que una app avise de antemano que
  maneja el gesto atrás, para que el sistema muestre el destino. En Android 13
  la animación solo está detrás de una opción de desarrollador.
- **Tablets.** Parte de [Android 12L](/es/notes/android-12l/): una barra de
  tareas con cajón de apps y multiventana activada para todas las apps en
  pantallas grandes.

## Seguridad y privacidad

- **Selector de fotos.** Una pantalla del sistema donde el usuario elige fotos
  o videos concretos, y solo esos llegan a la app. La app no declara ningún
  permiso. El mismo selector llegó a Android 11 y 12 con una actualización del
  sistema de Google Play.
- **Borrado automático del portapapeles.** El portapapeles se vacía un tiempo
  después de la última copia. En AOSP el valor por defecto es `3600000` ms, una
  hora, y el dispositivo puede cambiarlo con `DeviceConfig`. Las apps que
  copian contraseñas deben marcar `ClipDescription.EXTRA_IS_SENSITIVE` para que
  la vista previa oculte el contenido.
- **Restricted settings.** A una app instalada desde un archivo local o
  descargado no se le puede dar acceso de accesibilidad ni de notification
  listener hasta que el usuario abre su página de información y elige "Allow
  restricted settings". AOSP lo aplica a instalaciones con origen
  `PACKAGE_SOURCE_LOCAL_FILE` o `PACKAGE_SOURCE_DOWNLOADED_FILE`, así que las
  instalaciones hechas por una tienda de apps no quedan marcadas.
- **Coincidencia de intents.** Un componente exportado de una app con target 33
  solo recibe intents de otras apps que coinciden con uno de sus
  `<intent-filter>`. Más abajo está qué cambiar.
- **Receivers exportados.** `registerReceiver()` acepta `RECEIVER_EXPORTED` o
  `RECEIVER_NOT_EXPORTED`, así que un receiver registrado en tiempo de
  ejecución ya no tiene que quedar abierto a todas las apps.
- **Plataforma.** El acceso a los logs del dispositivo necesita la aprobación
  del usuario en cada pedido. El Android Virtualization Framework (pKVM) llega
  como función opcional para cargas aisladas. APK Signature Scheme v3.1 permite
  que la rotación de claves apunte solo a Android 13 y posteriores. Keystore y
  KeyMint informan los errores con excepciones tipadas que dicen si conviene
  reintentar. Bluetooth y Ultra-wideband pasaron a ser módulos Mainline, así
  que Google puede actualizarlos con actualizaciones del sistema de Google
  Play.

## Permisos

Android 13 agregó siete permisos que una app puede declarar. Cuatro permisos
anteriores reciben un límite superior o una regla nueva:

| Permiso                                   | Qué cambió en API 33                                                                                                                                                 | Qué declarar                                                                                     | Qué quitar o limitar                                                                                             |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `POST_NOTIFICATIONS`                      | Permiso nuevo en tiempo de ejecución; las instalaciones nuevas empiezan con las notificaciones desactivadas                                                          | `<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />` y pedirlo en contexto | Nada                                                                                                             |
| `READ_MEDIA_IMAGES`                       | Permiso nuevo en tiempo de ejecución para imágenes de otras apps                                                                                                     | Decláralo solo si lees imágenes ajenas; mejor el selector de fotos, que no necesita permisos     | Nada                                                                                                             |
| `READ_MEDIA_VIDEO`                        | Permiso nuevo en tiempo de ejecución para videos de otras apps; comparte diálogo con imágenes                                                                        | Decláralo solo si lees videos ajenos; mejor el selector de fotos                                 | Nada                                                                                                             |
| `READ_MEDIA_AUDIO`                        | Permiso nuevo en tiempo de ejecución para audio de otras apps                                                                                                        | Decláralo si lees audio ajeno                                                                    | Nada                                                                                                             |
| `READ_EXTERNAL_STORAGE`                   | No tiene efecto en apps con target 33                                                                                                                                | Mantenlo para dispositivos hasta Android 12L                                                     | `android:maxSdkVersion="32"`                                                                                     |
| `NEARBY_WIFI_DEVICES`                     | Permiso nuevo del grupo `NEARBY_DEVICES` para Wi-Fi Aware, Wi-Fi Direct, hotspot local y Wi-Fi RTT                                                                   | `android:usesPermissionFlags="neverForLocation"` si nunca obtienes ubicación del Wi-Fi           | Nada                                                                                                             |
| `ACCESS_FINE_LOCATION`                    | Ya no hace falta para esas APIs de Wi-Fi; sigue haciendo falta para `getScanResults()` y `startScan()`                                                               | Mantenlo para versiones anteriores                                                               | `android:maxSdkVersion="32"`, solo si no necesitas ubicación y no llamas a ninguno de los dos métodos de escaneo |
| `BODY_SENSORS_BACKGROUND`                 | Nuevo; leer sensores corporales en segundo plano lo exige además de `BODY_SENSORS`. Hard-restricted: el instalador debe permitirlo                                   | Decláralo y pídelo después de `BODY_SENSORS`                                                     | Nada; las apps con target Android 16 pasan a los permisos `android.permission.health`                            |
| `USE_EXACT_ALARM`                         | Nuevo, se concede al instalar y no se puede revocar; solo para apps cuya función principal es un despertador, temporizador o calendario, y Google Play revisa su uso | Decláralo solo para esa función principal                                                        | Nunca en otras apps; esas siguen con `SCHEDULE_EXACT_ALARM`                                                      |
| `SCHEDULE_EXACT_ALARM`                    | Igual que en Android 12, pero un dispositivo debe ver solo uno de los dos, este o `USE_EXACT_ALARM`                                                                  | Mantenlo para alarmas exactas de una función secundaria                                          | `android:maxSdkVersion="32"` al pasar a `USE_EXACT_ALARM`                                                        |
| `com.google.android.gms.permission.AD_ID` | Google Play services devuelve un ID de publicidad en ceros a las apps con target 33 que no lo declaran                                                               | Decláralo si usas el ID de publicidad; los SDK de anuncios suelen fusionarlo                     | `tools:node="remove"` para bloquear la copia fusionada si no lo usas                                             |

Un manifiesto para una app que corre en Android 12L o anterior y en 13 o
posterior. Conserva solo los bloques que tu app necesita:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Notificaciones: permiso en tiempo de ejecución desde API 33 -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Medios: el permiso antiguo hasta API 32, los granulares desde 33 -->
    <uses-permission
        android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />

    <!-- Wi-Fi: ubicación hasta API 32, dispositivos cercanos desde 33.
         Quita maxSdkVersion si llamas a getScanResults() o startScan(). -->
    <uses-permission
        android:name="android.permission.ACCESS_FINE_LOCATION"
        android:maxSdkVersion="32" />
    <uses-permission
        android:name="android.permission.NEARBY_WIFI_DEVICES"
        android:usesPermissionFlags="neverForLocation" />

    <!-- Solo despertadores, temporizadores o calendarios -->
    <uses-permission
        android:name="android.permission.SCHEDULE_EXACT_ALARM"
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />

    <!-- Sin ID de publicidad: bloquea la copia que fusiona un SDK -->
    <uses-permission
        android:name="com.google.android.gms.permission.AD_ID"
        tools:node="remove" />
</manifest>
```

Las guías de almacenamiento de Google ponen `maxSdkVersion="32"` en
`READ_EXTERNAL_STORAGE`; el texto de la comprobación de lint `ScopedStorage`
dice 33. El permiso no tiene efecto desde API 33, así que ambos valores dan el
mismo acceso.

El permiso de notificaciones alcanza a todas las apps, pero de forma distinta
según el target:

```mermaid title="Cuándo aparece el diálogo de notificaciones en Android 13"
flowchart TD
  start([App en un dispositivo con Android 13]) --> upgraded{¿Instalada antes de actualizar?}
  upgraded -- sí, con notificaciones activas --> pre[Concedido de antemano, sin diálogo]
  upgraded -- no, instalación nueva --> target{targetSdkVersion}
  target -- 33 o más --> own[La app pide POST_NOTIFICATIONS cuando decide]
  target -- 32 o menos --> sys[El sistema pregunta al crear el primer canal de notificación]
  sys -- Don't allow --> stuck[Sin diálogo nuevo hasta reinstalar o subir a target 33]
```

Las sesiones multimedia y las apps que gestionan sus propias llamadas
(`Notification.CallStyle`) están exentas. Un servicio en primer plano puede
arrancar sin el permiso, pero su notificación solo aparece en el Task Manager.

![Un diálogo del sistema que dice Allow My App to access music and other audio files on this device, con los botones Allow y Don't allow](./assets/read-media-audio-dialog.png 'El diálogo de READ_MEDIA_AUDIO en Android 13. Android Developers · CC BY 2.5')

Imágenes y video comparten un solo diálogo si se piden juntos. Una app que ya
tenía `READ_EXTERNAL_STORAGE` recibe los nuevos permisos de medios
automáticamente cuando sube su target.

`Context.revokeSelfPermissionsOnKill()` permite que una app devuelva permisos
que ya no necesita. Se aplica cuando se terminan los procesos de la app, no
mientras está en primer plano.

## Qué cambió para tu app

### Todas las apps en Android 13

| Cambio                                                                                            | Qué hacer                                                                                                                        | Cómo comprobarlo                                                                                                           |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Las instalaciones nuevas empiezan con las notificaciones desactivadas                             | Sube a target 33 y pide `POST_NOTIFICATIONS` en contexto                                                                         | `adb shell pm revoke <package> android.permission.POST_NOTIFICATIONS` simula una instalación nueva                         |
| El portapapeles muestra una vista previa de lo copiado                                            | Marca `EXTRA_IS_SENSITIVE` en contraseñas y tarjetas; quita tu propio aviso de copia                                             |                                                                                                                            |
| El usuario puede detener un servicio en primer plano desde el Task Manager                        | Trátalo como una detención forzada por el usuario; lee `REASON_USER_REQUESTED` de `ApplicationExitInfo` en el siguiente arranque | `adb shell cmd activity stop-app <package>`                                                                                |
| Las notificaciones de servicios en primer plano se pueden descartar                               | No dependas de que la notificación siga visible                                                                                  |                                                                                                                            |
| Los jobs de prefetch corren antes del próximo arranque previsto                                   | Comprueba que el trabajo con `setPrefetch()` siga corriendo cuando esperas                                                       |                                                                                                                            |
| Una app restringida por batería no inicia servicios en primer plano; sus jobs y alarmas no corren | Maneja cada uno de esos fallos                                                                                                   | `adb shell cmd appops set <package> RUN_ANY_IN_BACKGROUND ignore` y `adb shell am set-standby-bucket <package> restricted` |
| Los FCM de alta prioridad que nunca muestran notificación bajan de prioridad                      | Envía prioridad normal cuando no sigue una notificación                                                                          |                                                                                                                            |
| Desapareció el trampolín del servicio de voz de la app de Google                                  | Usa el `SpeechService` por defecto del dispositivo, no un paquete fijo                                                           |                                                                                                                            |
| Un shared user ID se puede abandonar en instalaciones nuevas                                      | Pon `android:sharedUserMaxSdkVersion="32"`; nunca quites `android:sharedUserId`, o las actualizaciones fallan                    |                                                                                                                            |

### Apps con target API 33

| Cambio                                                                                                           | Qué hacer                                                                                        | Cómo comprobarlo                                                                                   |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| La app decide cuándo aparece el diálogo de notificaciones                                                        | Pide `POST_NOTIFICATIONS` después de una acción del usuario, no al abrir                         | Lint `NotificationPermission`; compat `NOTIFICATION_PERM_CHANGE_ID` (194833441)                    |
| Sin el permiso de notificaciones, los avisos de servicios en primer plano solo aparecen en el Task Manager       | No uses esa notificación como única forma de avisar algo al usuario                              |                                                                                                    |
| `READ_EXTERNAL_STORAGE` ya no da acceso a los medios de otras apps                                               | Pide `READ_MEDIA_*`, o usa el selector de fotos para imágenes y video                            | Lint `ScopedStorage`; `adb shell cmd appops get --uid <package>` muestra los permisos actualizados |
| Las APIs de Wi-Fi exigen `NEARBY_WIFI_DEVICES` y lanzan `SecurityException` sin él                               | Decláralo con `android:usesPermissionFlags="neverForLocation"` si nunca obtienes ubicación       |                                                                                                    |
| Los intents de otras apps deben coincidir con tu `<intent-filter>`                                               | Revisa los componentes exportados; quien envía recibe `ActivityNotFoundException` si no coincide | Compat `ENFORCE_INTENTS_TO_MATCH_INTENT_FILTERS` (161252188)                                       |
| Los sensores corporales en segundo plano exigen `BODY_SENSORS_BACKGROUND`                                        | Pídelo después de `BODY_SENSORS`                                                                 |                                                                                                    |
| `USE_EXACT_ALARM` queda disponible                                                                               | Úsalo solo para un despertador, temporizador o calendario                                        | Lint `ExactAlarm`; compat `ENABLE_USE_EXACT_ALARM` (218533173)                                     |
| El ID de publicidad es todo ceros sin `AD_ID`                                                                    | Declara `com.google.android.gms.permission.AD_ID` si lo usas                                     |                                                                                                    |
| `BluetoothAdapter.enable()` y `disable()` devuelven false                                                        | Lleva al usuario a los ajustes de Bluetooth                                                      |                                                                                                    |
| `WebView.setForceDark()` no hace nada                                                                            | Deja que `isLightTheme` defina `prefers-color-scheme`; usa `setAlgorithmicDarkeningAllowed()`    | Compat `ENABLE_SIMPLIFIED_DARK_MODE` (214741472)                                                   |
| Sin `BOOT_COMPLETED` mientras el usuario restringe tu uso de batería                                             | No dependas de él en apps restringidas                                                           | Compat `DEFER_BOOT_COMPLETED_BROADCAST_CHANGE_ID` (203704822)                                      |
| Los controles multimedia salen de las acciones de `PlaybackState`, no de la lista de acciones de la notificación | Declara reproducir, saltar y las acciones personalizadas en el `PlaybackState` de la sesión      | Compat `MEDIA_CONTROL_SESSION_ACTIONS` (203800354)                                                 |
| Los jobs de prefetch no pueden tener plazo                                                                       | Quita `setOverrideDeadline()` de los jobs creados con `setPrefetch(true)`                        | Compat `DISALLOW_DEADLINES_FOR_PREFETCH_JOBS` (194532703)                                          |
| Un valor no válido en `JobInfo.Builder.setPriority()` lanza una excepción                                        | Pasa solo valores de prioridad válidos                                                           | Compat `THROW_ON_INVALID_PRIORITY_VALUE` (140852299)                                               |
| `registerComponentCallbacks()` en una activity registra en esa activity, no en la aplicación                     | Anula el registro en el mismo contexto; registra en la aplicación si lo querías para toda la app | Compat `OVERRIDABLE_COMPONENT_CALLBACKS` (193247900)                                               |

La coincidencia de intents no se exige a componentes sin ningún filtro, a
intents de la misma app ni a intents del sistema o de root. La lista de compat
de Google lo marca "Enabled for all apps", mientras que la guía de intents lo
liga al target de la app que recibe. La lista de compat también incluye
cambios de telefonía, splash screen y diseño de texto que pocas apps tocan.

![Dos pantallas de Quick Settings: la primera tiene abajo un botón con el número 1; al tocarlo se abre una lista Active apps con un botón Stop junto a una app](./assets/fgs-task-manager.png 'El Foreground Services Task Manager en Quick Settings. Android Developers · CC BY 2.5')

## Migrar a API 33

De `targetSdk 32` a 33, en este orden:

1. **Actualiza las herramientas.** Pon `compileSdk 33` y usa AGP 7.2 o
   posterior. Si lo saltas, las constantes nuevas (`POST_NOTIFICATIONS`,
   `READ_MEDIA_*`) no compilan. Comprueba: el proyecto compila y lint no
   muestra errores nuevos.
2. **Pide las notificaciones.** Declara `POST_NOTIFICATIONS` y pídelo después
   de una acción del usuario que lo necesite; maneja "Don't allow". Si lo
   saltas, las instalaciones nuevas nunca muestran tus notificaciones.
   Comprueba: lint `NotificationPermission` y las tres secuencias de
   `adb shell pm` de la página del permiso de notificaciones (instalación
   nueva, actualización con notificaciones activas, actualización con ellas
   desactivadas).
3. **Cambia el acceso a medios.** Usa el selector de fotos para imágenes y
   video; pide `READ_MEDIA_*` solo para lo que no cubre, y limita
   `READ_EXTERNAL_STORAGE` con `maxSdkVersion="32"`. Si lo saltas, leer medios
   de otras apps falla en Android 13. Comprueba: una instalación nueva en un
   dispositivo con Android 13 y lint `ScopedStorage`.
4. **Cambia el acceso a Wi-Fi.** Declara `NEARBY_WIFI_DEVICES` con
   `neverForLocation`; mantén `ACCESS_FINE_LOCATION` para escanear y para
   versiones anteriores. Si lo saltas, las llamadas a Wi-Fi Direct, Aware,
   hotspot y RTT lanzan `SecurityException`. Comprueba: cada flujo de Wi-Fi en
   Android 13.
5. **Revisa los componentes exportados.** Cada intent que otra app te envía
   debe coincidir con un `<intent-filter>`. Si lo saltas, esas apps reciben
   `ActivityNotFoundException`. Comprueba: con `targetSdk 33`, envía cada
   intent que otras apps realmente te mandan, desde una app de prueba o con
   `adb shell am start`, y verifica que llega.
6. **Revisa las filas menores** de la tabla de target que te apliquen:
   sensores corporales, alarmas exactas, `AD_ID`, activar Bluetooth, tema
   oscuro de WebView, controles multimedia, jobs de prefetch y prioridades de
   jobs.
7. **Prueba el resultado** en un dispositivo o emulador con Android 13 y
   `targetSdk 33`. Para aislar un cambio, cámbialo en una build depurable en
   Developer options > "App Compatibility Changes", o con
   `adb shell am compat disable <change ID> <package>`.

Opcional ya que estás: pasa `RECEIVER_EXPORTED` o `RECEIVER_NOT_EXPORTED` a
`registerReceiver()`. Lint `UnspecifiedRegisterReceiverFlag` encuentra las
llamadas, y las apps con target Android 14 están obligadas a hacerlo.

Si saltas varios niveles a la vez: haz los pasos de cada versión en orden,
desde [Android 12](/es/notes/android-12/) si tu target es 30 o menos.

## Qué perduró

- **El acceso granular a medios** se mantuvo, y Android 14 lo afinó más:
  `READ_MEDIA_VISUAL_USER_SELECTED` deja que el usuario comparta solo algunas
  fotos.
- **Alarmas exactas.** Desde Android 14, `SCHEDULE_EXACT_ALARM` queda denegado
  por defecto en la mayoría de las instalaciones nuevas de apps con target 33 o
  más, lo que empuja a usar `USE_EXACT_ALARM` o alarmas inexactas.
- **Receivers exportados.** El flag que aquí era opcional pasó a ser obligatorio
  para receivers registrados por contexto en apps con target Android 14.
- **Restricted settings** creció. El CDD de Android 15 lo exige para
  administradores del dispositivo, mostrar sobre otras apps, acceso de uso, los
  roles de teléfono y SMS y los permisos de SMS, además de accesibilidad y
  notification listeners.
- **Predictive back** salió de la opción de desarrollador en Android 15, para
  las apps que se adhirieron.
- **Sensores corporales.** En apps con target Android 16, `BODY_SENSORS` y
  `BODY_SENSORS_BACKGROUND` dan paso a los permisos `android.permission.health`:
  `READ_HEART_RATE` y otros mientras la app está en uso,
  `READ_HEALTH_DATA_IN_BACKGROUND` en segundo plano.
- El **selector de fotos** llega ahora también a Android 4.4 a 10 como módulo
  adaptado mediante Google Play services.

## Para saber

- El Easter egg reutiliza el reloj de Android 12; su ajuste de desbloqueo se
  sigue llamando `egg_mode_s`. Si se ponen las agujas en la 1:00, el código
  registra `"13:00"` y burbujas con colores de Material You llenan la pantalla.
  Una pulsación larga recorre 14 juegos de emoji, de frutas a signos del
  zodiaco.
- Un juego nunca salió. AOSP lo conserva comentado con la nota "this one is too
  much" ("este es demasiado").
- `TIRAMISU` es la primera constante escrita como postre desde `LOLLIPOP_MR1`
  de Android 5.1; de 6.0 a 12L se usaron letras. En AOSP su comentario es una
  sola palabra: "Tiramisu."
- Google fijó primero el plazo de API 33 para el 1 de agosto de 2023 en apps
  nuevas y el 1 de noviembre de 2023 en actualizaciones. Después movió ambos al
  31 de agosto, "unifying the dates to August 31 every year" (unificando las
  fechas al 31 de agosto de cada año).
