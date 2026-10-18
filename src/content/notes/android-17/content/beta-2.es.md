---
parentDomain: notes
parentId: notes-android-17-es
documentId: beta-2
locale: es
translationKey: android-17-beta-2
slug: beta-2
title: 'Android 17 Beta 2: selectores y red local'
summary: 26 de febrero de 2026. Burbujas para cualquier app, EyeDropper y Contacts Picker, handoff entre dispositivos, el permiso ACCESS_LOCAL_NETWORK y tres horas de espera para los OTP.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

La Beta 2 llegó el 26 de febrero de 2026, trece días después de la Beta 1.
Trajo casi todos los selectores del sistema que Android 17 usa en lugar de
permisos amplios, y los dos cambios de privacidad que tocan a las apps por la
red y por la bandeja de SMS.

|                           |                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------- |
| Fecha                     | 26 de febrero de 2026                                                                   |
| Build                     | `CP21.260206.011` (`.A1` para Pixel 6, 6 Pro, 6a, 7 y 7 Pro)                            |
| Parche de seguridad       | 2026-02-05                                                                              |
| Dispositivos              | Teléfonos y tablets Pixel compatibles por OTA; imágenes de 64 bits del Android Emulator |
| Estabilidad de plataforma | Todavía no; Google seguía apuntando a marzo                                             |

## APIs nuevas en la Beta 2

- **Burbujas de apps.** El usuario puede convertir cualquier app en una
  burbuja flotante con una pulsación larga sobre su icono; las pantallas
  grandes tienen una barra de burbujas en la barra de tareas. El post de
  Google aclara que las burbujas "aren't yet fully enabled in Beta 2".
- **EyeDropper.** `Intent.ACTION_OPEN_EYE_DROPPER` devuelve el color de
  cualquier píxel de la pantalla sin permiso de captura de pantalla.
- **Contacts Picker.** `ACTION_PICK_CONTACTS` da acceso temporal solo a los
  campos que el usuario elige, del perfil personal o del de trabajo, sin
  `READ_CONTACTS`.
- **Captura del puntero en touchpads.** Un touchpad capturado ahora reporta
  movimiento relativo, como un mouse; `View.POINTER_CAPTURE_MODE_ABSOLUTE`
  mantiene las posiciones crudas de los dedos.
- **Handoff entre dispositivos.** La Handoff API retoma el estado de una app
  en un dispositivo cercano, como una tablet, mediante
  `CompanionDeviceManager`, con una alternativa web.
- **Ranging y planes de datos.** UWB DL-TDOA (FiRa 4.0) para navegación en
  interiores, detección de proximidad de la Wi-Fi Alliance, y
  `getStreamingAppMaxDownlinkKbps()` / `getStreamingAppMaxUplinkKbps()` para
  las tasas de streaming que asigna el operador.
- **Hora y texto.** `ACTION_TIMEZONE_OFFSET_CHANGED` se dispara cuando cambia
  el desfase horario, por ejemplo con el horario de verano, e ICU 78 trae
  Unicode 17.

## Cambios de comportamiento en la Beta 2

- **Red local.** Las apps con target API 37 pierden el acceso a la LAN salvo
  que usen un selector de dispositivos del sistema o tengan el nuevo permiso
  de runtime `ACCESS_LOCAL_NETWORK`. Pertenece al grupo `NEARBY_DEVICES`, así
  que a quien ya concedió un permiso de dispositivos cercanos no se le vuelve
  a preguntar.
- **OTP retenidos tres horas.** Los mensajes WebOTP se retienen para toda app
  que no sea el destinatario verificado, sea cual sea su target. Para las apps
  con target 37, la retención cubre todo SMS con un OTP. La app de SMS
  predeterminada, el asistente y las apps de dispositivos conectados quedan
  exentas; Google recomienda al resto SMS Retriever o SMS User Consent.
- **Acceso a la NPU.** Las apps con target 37 que usan la unidad de
  procesamiento neuronal directamente, también mediante el delegado NPU de
  LiteRT o la obsoleta NNAPI, deben declarar `FEATURE_NEURAL_PROCESSING_UNIT`
  o quedan bloqueadas.

Las notas de versión listan 16 problemas corregidos. El primero es una
regresión de Android 16 que hacía que las apps activas se reiniciaran o se
recargaran solas.
