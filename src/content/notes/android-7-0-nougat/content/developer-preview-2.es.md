---
parentDomain: notes
parentId: notes-android-7-0-nougat-es
documentId: developer-preview-2
locale: es
translationKey: android-7-0-nougat-developer-preview-2
slug: developer-preview-2
title: 'Android N Developer Preview 2: llega Vulkan'
summary: 13 de abril de 2016. La segunda vista previa integró Vulkan a la plataforma, sumó atajos del launcher y emoji de Unicode 9, y corrigió bugs reportados en la primera.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 2 salió el 13 de abril de 2016, builds `NPC91K` y
`NPC91O`, para los mismos dispositivos que la primera; el Nexus Player la
recibió varios días después. Los dispositivos del Android Beta Program la
recibieron por OTA. Seguía exigiendo Android Studio 2.1 y seguía sin ser apta
para uso diario.

## Lo que sumó la Developer Preview 2

- **Vulkan** pasó a ser parte de la plataforma: una API 3D de bajo overhead que
  Google ayudó a desarrollar en Khronos. Google dijo que algunos benchmarks
  sintéticos lograban hasta 10 veces el rendimiento de draw calls en un núcleo
  frente a OpenGL ES.
- **Atajos del launcher.** `ShortcutManager.setDynamicShortcuts()` y
  `addDynamicShortcut()` permitían a una app publicar intents hacia pantallas
  concretas. Esta API no sobrevivió: ver las Developer Preview 3 y 4.
- **Emoji.** Glifos de Unicode 9, tonos de piel y un diseño nuevo, más humano,
  para los emoji de personas. Las apps comprueban un glifo con
  `Paint.hasGlyph()`.
- **Multiventana** sumó un alto mínimo y un ancho mínimo separados para una
  actividad, y varios nombres de su API cambiaron.

También corrigió bugs reportados en la Preview 1, entre ellos redes Wi-Fi
ocultas que no conectaban (AOSP 203116), YouTube que se pausaba al cambiar el
foco en multiventana (203424) y Direct Reply cerrando una actividad abierta
(204411).
