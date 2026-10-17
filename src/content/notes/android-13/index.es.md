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
documents: []
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-versions
  order: 15
citations:
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
  - title: 'File:Android 13 logo.svg (Wikimedia Commons)'
    url: https://commons.wikimedia.org/wiki/File:Android_13_logo.svg
    accessedAt: 2026-10-17
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
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

Google publicó Android 13 en AOSP y empezó el despliegue en Pixel el 15 de
agosto de 2022. Su anuncio nombró a Samsung, Asus, HMD, Motorola, OnePlus,
OPPO, Sony, Xiaomi y otros para más adelante ese año. Los primeros teléfonos de
Google vendidos con esta versión fueron el Pixel 7 y el Pixel 7 Pro, anunciados
el 6 de octubre y en tiendas de Estados Unidos desde el 13 de octubre.

El nombre público es solo Android 13. Tiramisu es el nombre interno de postre,
y desde esta versión ya no está oculto: la constante es `TIRAMISU`, no una
letra, y el SDK Manager de Android Studio muestra la plataforma como
"Android 13.0 ("Tiramisu")". Los build IDs empiezan con T (`TP1A`).

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
- **Controles multimedia.** Para apps con target 33, el sistema arma los botones
  del reproductor a partir de las acciones de `PlaybackState`, no de la lista
  de acciones de la notificación.
- **Audio.** Bluetooth LE Audio integrado en dispositivos compatibles, MIDI 2.0
  por USB, audio espacial con seguimiento de cabeza y APIs de `AudioManager`
  que le dicen a una app por dónde va a salir su audio.
- **Gráficos y texto.** `RuntimeShader` con AGSL, emoji vectoriales COLRv1,
  separación silábica hasta 200% más rápida, mejor altura de línea para
  escrituras no latinas y cortes de línea por frase en japonés.
- **Runtime.** Llamadas JNI hasta 2,5 veces más rápidas, procesamiento de
  referencias casi sin bloqueos y un primer grupo de APIs de OpenJDK 11
  (`String.strip()`, `Optional.isEmpty()` y más), que también llegaron a
  Android 12 por el módulo de ART.
- **Predictive back.** Nuevas APIs permiten que una app avise de antemano que
  maneja el gesto atrás, para que el sistema muestre el destino. En Android 13
  la animación solo está detrás de una opción de desarrollador.
- **Tablets.** Parte de [Android 12L](/notes/android-12l/): una barra de
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
  reintentar.

## Permisos

Permisos nuevos en tiempo de ejecución en Android 13:

| Permiso                                                     | Reemplaza o amplía                                    | Lo concede                                      |
| ----------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| `POST_NOTIFICATIONS`                                        | Las notificaciones estaban activadas por defecto      | Diálogo en tiempo de ejecución                  |
| `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO` | `READ_EXTERNAL_STORAGE` para medios de otras apps     | Diálogo en tiempo de ejecución                  |
| `NEARBY_WIFI_DEVICES`                                       | `ACCESS_FINE_LOCATION` para escanear y conectar Wi-Fi | Diálogo (grupo `NEARBY_DEVICES`)                |
| `BODY_SENSORS_BACKGROUND`                                   | Lleva `BODY_SENSORS` al segundo plano                 | Hard-restricted; lista permitida del instalador |

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

Dos cambios más:

- **Alarmas exactas.** `USE_EXACT_ALARM` se concede al instalar y no se puede
  revocar, pero está pensado solo para despertadores, temporizadores y
  calendarios, y una política de Google Play lo limita a ellos. El resto sigue
  con `SCHEDULE_EXACT_ALARM`, que el usuario puede revocar.
- **Devolver permisos.** `Context.revokeSelfPermissionsOnKill()` permite que una
  app suelte permisos que ya no necesita. Se aplica cuando se terminan los
  procesos de la app, no mientras está en primer plano.

## Qué cambió para tu app

### Todas las apps en Android 13

| Cambio                                                                                            | Qué hacer                                                                            |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Las instalaciones nuevas empiezan con las notificaciones desactivadas                             | Sube a target 33 y pide `POST_NOTIFICATIONS` en contexto                             |
| El portapapeles muestra una vista previa de lo copiado                                            | Marca `EXTRA_IS_SENSITIVE` en contraseñas y tarjetas; quita tu propio aviso de copia |
| El usuario puede detener un servicio en primer plano desde el Task Manager                        | Trátalo como una detención forzada por el usuario                                    |
| Las notificaciones de servicios en primer plano se pueden descartar                               | No dependas de que la notificación siga visible                                      |
| Los jobs de prefetch corren antes del próximo arranque previsto                                   | Comprueba que el trabajo con `setPrefetch()` siga corriendo cuando esperas           |
| Una app restringida por batería no inicia servicios en primer plano; sus jobs y alarmas no corren | Prueba con `adb shell cmd appops set <package> RUN_ANY_IN_BACKGROUND ignore`         |
| Los FCM de alta prioridad que nunca muestran notificación bajan de prioridad                      | Envía prioridad normal cuando no sigue una notificación                              |
| Desapareció el trampolín del servicio de voz de la app de Google                                  | Usa el `SpeechService` por defecto del dispositivo, no un paquete fijo               |

### Apps con target API 33

| Cambio                                                                    | Qué hacer                                                                                        |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| La app decide cuándo aparece el diálogo de notificaciones                 | Pide `POST_NOTIFICATIONS` después de una acción del usuario, no al abrir                         |
| `READ_EXTERNAL_STORAGE` ya no da acceso a los medios de otras apps        | Pide `READ_MEDIA_*`, o usa el selector de fotos para imágenes y video                            |
| Las APIs de Wi-Fi exigen `NEARBY_WIFI_DEVICES`                            | Declara `android:usesPermissionFlags="neverForLocation"` si nunca obtienes ubicación             |
| Los intents de otras apps deben coincidir con tu `<intent-filter>`        | Revisa los componentes exportados; quien envía recibe `ActivityNotFoundException` si no coincide |
| Los sensores corporales en segundo plano exigen `BODY_SENSORS_BACKGROUND` | Pídelo después de `BODY_SENSORS`                                                                 |
| El ID de publicidad es todo ceros sin `AD_ID`                             | Declara `com.google.android.gms.permission.AD_ID` si lo usas                                     |
| `BluetoothAdapter.enable()` y `disable()` devuelven false                 | Lleva al usuario a los ajustes de Bluetooth                                                      |
| `WebView.setForceDark()` no hace nada                                     | Deja que `isLightTheme` defina `prefers-color-scheme`; usa `setAlgorithmicDarkeningAllowed()`    |
| Sin `BOOT_COMPLETED` mientras el usuario restringe tu uso de batería      | No dependas de él en apps restringidas                                                           |

La coincidencia de intents no se exige a componentes sin ningún filtro, a
intents de la misma app ni a intents del sistema o de root.

![Dos pantallas de Quick Settings: la primera tiene abajo un botón con el número 1; al tocarlo se abre una lista Active apps con un botón Stop junto a una app](./assets/fgs-task-manager.png 'El Foreground Services Task Manager en Quick Settings. Android Developers · CC BY 2.5')

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
