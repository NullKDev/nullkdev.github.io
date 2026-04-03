---
title: "Android 17 Beta 3: Estabilidad de Plataforma Alcanzada — Todo lo que Necesitas Saber"
description: "Android 17 Beta 3 (API nivel 37) alcanza la estabilidad de plataforma. Las APIs están bloqueadas, las apps ya pueden apuntar a Android 17 en Google Play. Análisis completo de cada nueva API, cambio de comportamiento y qué hacer ahora."
date: 2026-03-27
tags: ["android", "kotlin", "android-17"]
authors: ["me"]
lang: es
image: ../android-17-beta-3/banner.svg
---

Android 17 Beta 3 llegó el 26 de marzo de 2026 con una señal muy específica para desarrolladores: **se alcanzó la estabilidad de plataforma**. Las APIs están bloqueadas — sin más adiciones, sin más eliminaciones, sin más sorpresas. Si eres autor de librerías, vendor de SDKs o desarrollador de apps, el tiempo corre.

Build `CP21.260306.017`, API nivel 37, parche de seguridad `2026-03-05`. Esto es en serio.

## Qué Significa "Estabilidad de Plataforma"

Beta 3 es el punto en que el conjunto final de APIs queda congelado. De aquí al lanzamiento estable:

- **No se agregarán ni eliminarán APIs públicas**
- Las apps enviadas a Google Play ya pueden apuntar a API 37
- Los autores de SDKs y librerías deben publicar actualizaciones de compatibilidad de inmediato
- Los motores de juego y herramientas de desarrollo necesitan validar contra este build

El lanzamiento estable se espera para más adelante en 2026. Aún no hay fecha exacta, pero el patrón es consistente con años anteriores: Beta 3 en marzo → estable en torno al Q3.

---

## Cámara y Multimedia

### Personalización de la Photo Picker

Una función muy pedida: el selector de fotos ahora soporta relación de aspecto `9:16` en retrato, además del `1:1` cuadrado de siempre. Se usa `PhotoPickerUiCustomizationParams`:

```kotlin
val params = PhotoPickerUiCustomizationParams.Builder()
    .setAspectRatio(PhotoPickerUiCustomizationParams.ASPECT_RATIO_PORTRAIT_9_16)
    .build()
```

Compatible con `ACTION_PICK_IMAGES` y con la variante de photo picker embebida. Muy útil para apps donde el video vertical o la fotografía en retrato es el caso de uso principal.

### RAW14: Formato RAW de 14 Bits

`ImageFormat.RAW14` es una nueva constante para imágenes RAW de 14 bits por píxel, empaquetadas de forma compacta (4 píxeles en 7 bytes). Las apps de cámara profesional con acceso a sensores compatibles pueden ahora capturar la máxima profundidad de color sin trucos con formatos personalizados.

### Consulta del Tipo de Dispositivo de Cámara

Ahora es posible consultar si una cámara es hardware integrado, una webcam USB externa, o una cámara virtual — sin recurrir a workarounds de `CameraCharacteristics`.

### Extensiones de Cámara Definidas por el Fabricante

Los fabricantes de hardware pueden definir modos de extensión propios — Super Resolución, mejoras nocturnas con IA, o mejoras exclusivas del fabricante. Se consulta el soporte con `isExtensionSupported(int)` en `CameraExtensionCharacteristics`.

### Soporte para Audífonos Bluetooth LE Audio

Nueva constante `AudioDeviceInfo.TYPE_BLE_HEARING_AID` para distinguir audífonos de prótesis auditivas en los dispositivos LE Audio genéricos:

```kotlin
val devices = audioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS)
val hayAudifonoConectado = devices.any {
    it.type == AudioDeviceInfo.TYPE_BLE_HEARING_AID
}
```

Esto también habilita el **enrutamiento granular de audio hacia audífonos** — los usuarios pueden enrutar notificaciones, tonos de llamada y alarmas de forma independiente hacia el audífono o el altavoz del dispositivo, sin cambios en la app.

### Codificador de Software HE-AAC Extendido

Nuevo MediaCodec provisto por el sistema (`c2.android.xheaac.encoder`) para codificación eficiente de voz y audio. Unifica voz y audio en un solo codec, con metadatos de loudness obligatorios para volumen consistente en condiciones de bajo ancho de banda.

```kotlin
val encoder = MediaCodec.createByCodecName("c2.android.xheaac.encoder")
val format = MediaFormat.createAudioFormat(
    MediaFormat.MIMETYPE_AUDIO_AAC,
    48000,
    1
)
format.setInteger(
    MediaFormat.KEY_AAC_PROFILE,
    MediaCodecInfo.CodecProfileLevel.AACObjectXHE
)
```

---

## Privacidad y Seguridad

### Botón de Ubicación Provisto por el Sistema

Un nuevo botón renderizado por el sistema (entregado vía Jetpack) que otorga **ubicación precisa de una sola vez** para la sesión actual — sin diálogo de permisos del sistema. Requiere el nuevo permiso `USE_LOCATION_BUTTON`.

Una mejora UX significativa para apps donde el usuario quiere compartir su ubicación en una acción específica (pedir comida, compartir con un amigo) sin otorgar acceso permanente.

### Visibilidad de Contraseñas Diferenciada

La opción "Mostrar contraseñas" ahora se divide en dos:

- **Teclado táctil/virtual**: muestra brevemente el último carácter escrito (igual que antes)
- **Teclado físico**: oculto inmediatamente por defecto

Si tu app usa campos de texto personalizados, usa la nueva API `ShowSecretsSetting`:

```kotlin
val esTecladoFisico =
    event.source and InputDevice.SOURCE_KEYBOARD == InputDevice.SOURCE_KEYBOARD
val mostrarContrasena =
    android.text.ShowSecretsSetting.shouldShowPassword(context, esTecladoFisico)
```

### Firma de APK Post-Cuántica

Android 17 introduce el **esquema de firma APK v3.2** con un enfoque híbrido: firmas RSA o Curva Elíptica clásicas combinadas con ML-DSA (Module Lattice Digital Signature Algorithm — un algoritmo post-cuántico estandarizado por NIST). Prepara el ecosistema ante amenazas de computación cuántica sin romper la compatibilidad actual.

### Carga Dinámica de Código Nativo — Aplicación de Solo Lectura

Desde Android 14, los archivos Java/DEX cargados dinámicamente deben ser de solo lectura. **Android 17 extiende esta restricción a las librerías nativas**. Si tu app llama a `System.load()` sobre un archivo nativo que no está marcado como solo lectura, ahora lanza `UnsatisfiedLinkError`. Revisa tus rutas de carga de librerías nativas.

### Certificate Transparency — Activado por Defecto

Lo que era una función opt-in en Android 16 ahora **está activada por defecto para todas las apps**. No se requieren cambios en apps que usen HTTPS estándar — pero si haces validación de certificados manual o certificate pinning, revisa tu implementación.

---

## Rendimiento y Batería

### AlarmManager: Alarmas Exactas con Callback Listener

Nueva sobrecarga de `setExactAndAllowWhileIdle()` que acepta un `OnAlarmListener` en lugar de un `PendingIntent`. Pensado para apps que actualmente usan wakelocks continuos para temporización precisa:

```java
alarmManager.setExactAndAllowWhileIdle(
    AlarmManager.RTC_WAKEUP,
    triggerAtMillis,
    "com.example.MI_ALARMA",
    executor,
    new AlarmManager.OnAlarmListener() {
        @Override
        public void onAlarm() {
            // Manejar la alarma
        }
    }
);
```

> **Nota:** CommonsWare señaló que la documentación de esta API es contradictoria — dice apuntar a apps "que dependen de wakelocks continuos" pero también promete "reducir wakelocks". La intención parece ser una alternativa más precisa a los wakelocks de larga duración.

---

## Experiencia de Usuario y UI del Sistema

### Widgets en Pantallas Externas

`RemoteViews.setViewPadding()` ahora acepta unidades complejas (DP y SP, no solo píxeles). Los widgets pueden obtener el ID de la pantalla en la que se renderizan:

```kotlin
val displayId = appWidgetManager
    .getAppWidgetOptions(appWidgetId)
    .getInt(AppWidgetManager.OPTION_APPWIDGET_DISPLAY_ID)
```

Permite adaptar el layout del widget para monitores externos con distintas densidades de píxeles — crítico para el Modo Escritorio.

### Picture-in-Picture Interactivo en Modo Escritorio

Las apps pueden solicitar una capa de ventana anclada en modo escritorio. La ventana es siempre-en-frente y completamente interactiva. Requiere el nuevo permiso `USE_PINNED_WINDOWING_LAYER`:

```kotlin
appTask.requestWindowingLayer(
    ActivityManager.AppTask.WINDOWING_LAYER_PINNED,
    context.mainExecutor,
    object : OutcomeReceiver<Int, Exception> {
        override fun onResult(result: Int) { /* éxito */ }
        override fun onError(e: Exception) { /* manejar */ }
    }
)
```

### Etiquetas de Apps Ocultas

Los usuarios pueden ocultar los nombres de las apps en la pantalla de inicio. Recomendación de Google: asegúrate de que el ícono de tu app sea reconocible sin su etiqueta.

### Toolbar de Grabación de Pantalla Rediseñado

Nueva barra de herramientas flotante para los controles de grabación. El toolbar se excluye del video final capturado.

---

## Cambios de Comportamiento (Breaking Changes)

### Para Todas las Apps

| Cambio | Qué hacer |
|---|---|
| **DCL nativo aplicado** | Asegúrate de que las librerías nativas en `System.load()` estén en rutas de solo lectura |
| **Certificate Transparency por defecto** | Revisa validaciones de certificados personalizadas |
| **Acceso a red local bloqueado** | Apps apuntando a Android 17+ necesitan `ACCESS_LOCAL_NETWORK` para acceder a dispositivos LAN |

### Para Apps Apuntando a API 37

| Cambio | Qué hacer |
|---|---|
| **Redimensionamiento en pantallas grandes obligatorio** | Probar en plegables y tablets — no puedes optar por no cumplir las restricciones |
| **`String.getChars()` eliminado** | Migrar a `String.getBytes()` o equivalente (cambio de OpenJDK 21) |
| **`ACTION_TAG_DISCOVERED` deprecado** | Migrar a las nuevas acciones de intent NFC |
| **`DnsResolver.getInstance()` eliminado** | Usar el constructor en su lugar |

---

## APIs Poco Documentadas

CommonsWare identificó varias APIs nuevas en el diff sin documentación clara:

- **`SerialManager`** — acceso a puertos serie, alcance incierto
- **`WebAppManager`** — relación con el navegador predeterminado desconocida
- **`FileManager`** — I/O de disco en segundo plano para apps privilegiadas
- **Notificaciones bridgeadas** — desde otros dispositivos conectados
- **Registro de advertencia ANR** — callbacks de timeout antes de que ocurra un ANR

Por ahora, tratar estas como APIs internas o para socios.

---

## Correcciones de Estabilidad en Beta 3

Beta 3 incluye un número inusualmente grande de correcciones de estabilidad, lo que sugiere que las betas anteriores tenían problemas significativos de fiabilidad:

- **Regresión del ciclo de vida del proceso** (Android 16): reinicios aleatorios de apps y parpadeo de pantalla
- **Cámara**: fallos al cambiar al teleobjetivo 5x, tartamudeo en la transición de lentes
- **Android Auto**: congelamiento de pantalla de bloqueo tras desconexión
- **Reinicios espontáneos**: más de 40 problemas relacionados, cuelgues durante el reposo
- **Bluetooth**: emparejamiento bloqueado durante 150 segundos
- **Artefactos de UI**: íconos de la barra de estado desapareciendo, fallos al descartar notificaciones

---

## Qué Hacer Ahora

1. **Autores de librerías/SDKs**: publica tu actualización de compatibilidad con Android 17. Las APIs están congeladas.
2. **Desarrolladores de apps**: prueba tu app en el emulador o imagen de sistema Beta 3. Presta atención a los cambios de DCL nativo y acceso a red local.
3. **Prueba en pantallas grandes**: el cambio de redimensionamiento obligatorio es el más probable de generar problemas en plegables y tablets.
4. **Revisa tu código NFC**: si usas `ACTION_TAG_DISCOVERED`, empieza a planificar la migración.
5. **Sube tu app a Google Play** apuntando a API 37 — ya puedes hacerlo.

---

## Recursos

- [Android 17 Beta 3 — Blog Oficial de Google](https://android-developers.googleblog.com/2026/03/the-third-beta-of-android-17.html)
- [Notas de lanzamiento de Android 17](https://developer.android.com/about/versions/17/release-notes)
- [Diferencias de API de Android 17](https://developer.android.com/sdk/api_diff/37/changes)
- [CommonsWare — Reflexiones sobre Beta 3](https://commonsware.com/blog/2026/03/27/random-musings-android-17-beta-3.html)
