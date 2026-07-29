---
entryId: notes-pretext-es
locale: es
translationKey: pretext
slug: pretext-layout-de-texto
title: 'Pretext: la librería de 15 kb que esquiva la operación más cara del navegador'
summary: Prepara las métricas del texto una vez y compón las líneas con aritmética pura, sin lecturas del DOM ni reflow. Serie de cuatro partes con dos demos en vivo.
visibility: public
maturity: growing
publishedAt: 2026-04-04
updatedAt: 2026-07-23
topics: [javascript, performance, typography, web]
featuredRank: 3
image: /banners/pretext.svg
imageAlt: Banner de la serie Pretext — reflow de layout frente a layout aritmético cacheado.
links:
  - label: Código de Pretext
    href: https://github.com/chenglou/pretext
    kind: repository
references: []
evidence: []
documents:
  - documentId: reflow-tax
    slug: costo-de-reflow
    order: 1
  - documentId: how-it-works
    slug: como-funciona
    order: 2
  - documentId: react-demo
    slug: demo-react
    order: 3
  - documentId: matteflow
    slug: matteflow
    order: 4
protection: { mode: public }
kind: note
lifecycle: current
citations:
  - title: Repositorio de Pretext
    url: https://github.com/chenglou/pretext
    accessedAt: 2026-07-23
---

Cada vez que llamas a `getBoundingClientRect()` para medir un elemento de texto, el navegador hace algo brutal en silencio: descarta todo su árbol de layout, recalcula cada posición desde cero y te devuelve un número. Todo ocurre de forma síncrona, en el hilo principal, bloqueando todo lo demás.

Para un blog estático esto no importa. Para una interfaz de chat de IA que hace streaming a 60 fotogramas por segundo — o una lista virtualizada con cientos de elementos de altura variable — es un muro.

**Pretext** es una librería de 15 kb de [Cheng Lou](https://github.com/chenglou) (creador de React Motion, ingeniero senior en Midjourney) que elimina este costo por completo. Mide y compone texto multilínea usando aritmética pura, sin tocar el DOM después de la preparación.

---

## La idea central en un párrafo

Pretext divide el trabajo en dos fases. `prepare()` se ejecuta una vez por combinación texto+fuente: usa la API `measureText()` del Canvas para medir cada segmento de texto y cachea los resultados. `layout()` se ejecuta tantas veces como necesites: calcula saltos de línea y alturas usando solo aritmética sobre esos anchos cacheados — cero lecturas del DOM, cero reflow. Los cambios de ancho son gratuitos. Las actualizaciones en streaming son gratuitas. El costo de medición se paga una sola vez.

```ts
import { prepare, layout } from '@chenglou/pretext'

const prepared = prepare(
  'El reflow de layout es el asesino silencioso del rendimiento.',
  '16px Inter',
)

// Primer ancho — barato
const { height, lineCount } = layout(prepared, 320, 24)

// Ancho diferente — sigue siendo solo aritmética
const { height: h2 } = layout(prepared, 480, 24)
```

---

## Por qué importa ahora

El momento no es accidental. Las aplicaciones de IA que transmiten texto token por token necesitan redimensionar burbujas en cada fotograma. Las listas virtualizadas necesitan predecir alturas antes de que los elementos existan en el DOM. Los layouts de tipo masonry necesitan conocer las alturas antes de colocar las tarjetas. Todos estos patrones eran o poco fluidos o requerían rodeos con contenedores ocultos fuera de pantalla.

Pretext resuelve el problema subyacente en lugar de esquivarlo: **tratar el motor de fuentes del navegador como un oráculo durante la preparación, y nunca volver a preguntarle**.

---

## Los números

| Operación                             | Costo                                                     |
| ------------------------------------- | --------------------------------------------------------- |
| `prepare()` para 500 bloques          | ~19 ms (igual que un pase DOM)                            |
| `layout()` por llamada                | ~0.09 ms                                                  |
| `getBoundingClientRect()` por llamada | ~0.04 ms — pero fuerza reflow cuando el layout está sucio |
| Reflow completo en árbol sucio        | 10–100+ ms según la complejidad de la página              |

La ganancia real no está en la velocidad por llamada — está en que `layout()` nunca ensucia el árbol de layout, así que nunca desencadena la cascada.

---

## Lo que viene

El resto del texto va del problema a un demo funcionando: qué es realmente el
layout reflow y por qué `getBoundingClientRect()` es caro, y después el modelo
de dos fases que lo evita — el oráculo Canvas, el layout aritmético y la API
completa. De ahí en adelante deja de ser teoría: un chat de IA en streaming con
las alturas de burbuja medidas con pretext, y un layout editorial donde el texto
fluye alrededor de un bailarín y se recomputa en cada fotograma.

> **¿Querés verlo antes de leer nada?** Texto fluyendo alrededor de una figura
> bailando, recomputado en cada fotograma, corriendo en esta misma página — sin
> instalación. [Saltar al demo de Matteflow](#part-4)
