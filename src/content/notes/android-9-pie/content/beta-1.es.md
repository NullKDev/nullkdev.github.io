---
parentDomain: notes
parentId: notes-android-9-pie-es
documentId: beta-1
locale: es
translationKey: android-9-pie-beta-1
slug: beta-1
title: 'Android P Beta: abierta a teléfonos de socios'
summary: 8 de mayo de 2018. La build de I/O, también Developer Preview 2, llegó a seis teléfonos de socios con Treble y trajo Adaptive Battery, Slices, BiometricPrompt y errores non-SDK.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google anunció Android P Beta el 8 de mayo de 2018, en Google I/O. Es la
segunda developer preview: AOSP la etiqueta como `android-p-preview-2`, y
9to5Google la llamó "the second Developer Preview build of Android P". Fue
la primera build de P que cualquiera podía recibir por aire.

|                       |                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha                 | 8 de mayo de 2018                                                                                                                        |
| Dispositivos          | Pixel, Pixel XL, Pixel 2 y Pixel 2 XL; Sony Xperia XZ2, Xiaomi Mi Mix 2S, Nokia 7 Plus, Oppo R15 Pro, Vivo X21UD y X21, y Essential PH-1 |
| Cómo se obtenía       | Por aire con Android Beta en Pixel; las builds de socios, desde el sitio de cada fabricante                                              |
| Estabilidad de la API | No; las API finales llegaron con la Beta 2                                                                                               |

Los teléfonos de socios fueron posibles gracias a Project Treble, que Google
presentó como "proof of what Treble can do". La build sumó las funciones por
las que se recuerda a Pie: Adaptive Battery con cuatro App Standby buckets,
la navegación con un solo botón, las restricciones en segundo plano por
batería en Ajustes y el `Magnifier` de texto. Para desarrolladores trajo
Slices (con las API en Android Jetpack), respuestas inteligentes en
notificaciones, nuevos tipos de entidad en `TextClassifier`, el efecto de
audio Dynamics Processing, Android Protected Confirmation y las claves
StrongBox.

Dos cambios rompieron lo que traía la Preview 1. `BiometricPrompt` reemplazó
a `FingerprintDialog`, con un único permiso `USE_BIOMETRIC`, y
`FingerprintManager` y `USE_FINGERPRINT` quedaron obsoletos. Las interfaces
non-SDK no exentas pasaron a lanzar excepciones en lugar de mostrar un toast,
y `StrictMode` sumó `detectNonSdkApiUsage()` para encontrarlas.
