---
entryId: lab-password-generator-es
locale: es
translationKey: password-generator
slug: generador-contrasenas
title: Generador de contraseñas
summary: Generá contraseñas aleatorias localmente con Web Crypto y grupos de caracteres seleccionables; los valores no salen de la página.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [security, developer-tools, web]
statusNote: Una contraseña generada es solo una parte de la seguridad; usá un gestor y autenticación multifactor cuando sea posible.
links:
  - label: Código del sitio
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: password-implementation-es
    kind: artifact
    claim: La selección aleatoria usa crypto.getRandomValues en el navegador.
    source: Código del sitio
    provenance: first-party
    permission: public
    url: https://github.com/NullKDev/nullkdev.github.io
documents: []
protection: { mode: public }
kind: tool
lifecycle: stable
surface: form
execution: local
sendsDataTo: []
inputs: [longitud, grupos de caracteres]
outputs: [contraseña aleatoria]
implementationId: password-generator
---

La generación ocurre solo tras una acción explícita y usa Web Crypto. La herramienta no guarda, transmite, puntúa ni recupera valores generados.
