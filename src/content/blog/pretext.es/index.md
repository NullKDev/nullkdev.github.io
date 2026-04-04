---
title: "Pretext: La Librería de 15 kb Que Esquiva la Operación Más Cara del Navegador"
description: "Cada vez que tu JavaScript mide texto con getBoundingClientRect(), el navegador descarta todo su árbol de layout y lo recalcula desde cero. Pretext elimina ese costo usando aritmética sobre canvas — y los resultados son dramáticos."
date: 2026-04-04
tags: ["javascript", "performance", "web", "typography"]
authors: ["me"]
lang: es
image: ../pretext/banner.svg
order: 1
---

Cada vez que llamas a `getBoundingClientRect()` para medir un elemento de texto, el navegador hace algo brutal en silencio: descarta todo su árbol de layout, recalcula cada posición desde cero y te devuelve un número. Todo ocurre de forma síncrona, en el hilo principal, bloqueando todo lo demás.

Para un blog estático esto no importa. Para una interfaz de chat de IA que hace streaming a 60 fotogramas por segundo — o una lista virtualizada con cientos de elementos de altura variable — es un muro.

**Pretext** es una librería de 15 kb de [Cheng Lou](https://github.com/chenglou) (creador de React Motion, ingeniero senior en Midjourney) que elimina este costo por completo. Mide y compone texto multilínea usando aritmética pura, sin tocar el DOM después de la preparación.

---

## La Idea Central en Un Párrafo

Pretext divide el trabajo en dos fases. `prepare()` se ejecuta una vez por combinación texto+fuente: usa la API `measureText()` del Canvas para medir cada segmento de texto y cachea los resultados. `layout()` se ejecuta tantas veces como necesites: calcula saltos de línea y alturas usando solo aritmética sobre esos anchos cacheados — cero lecturas del DOM, cero reflow. Los cambios de ancho son gratuitos. Las actualizaciones en streaming son gratuitas. El costo de medición se paga una sola vez.

```ts
import { prepare, layout } from '@chenglou/pretext'

const prepared = prepare('El reflow de layout es el asesino silencioso del rendimiento.', '16px Inter')

// Primer ancho — barato
const { height, lineCount } = layout(prepared, 320, 24)

// Ancho diferente — sigue siendo solo aritmética
const { height: h2 } = layout(prepared, 480, 24)
```

---

## Por Qué Importa Ahora

El momento no es accidental. Las aplicaciones de IA que transmiten texto token por token necesitan redimensionar burbujas en cada fotograma. Las listas virtualizadas necesitan predecir alturas antes de que los elementos existan en el DOM. Los layouts de tipo masonry necesitan conocer las alturas antes de colocar las tarjetas. Todos estos patrones eran o poco fluidos o requerían rodeos con contenedores ocultos fuera de pantalla.

Pretext resuelve el problema subyacente en lugar de esquivarlo: **tratar el motor de fuentes del navegador como un oráculo durante la preparación, y nunca volver a preguntarle**.

---

## Los Números

| Operación | Costo |
|---|---|
| `prepare()` para 500 bloques | ~19 ms (igual que un pase DOM) |
| `layout()` por llamada | ~0.09 ms |
| `getBoundingClientRect()` por llamada | ~0.04 ms — pero fuerza reflow cuando el layout está sucio |
| Reflow completo en árbol sucio | 10–100+ ms según la complejidad de la página |

La ganancia real no está en la velocidad por llamada — está en que `layout()` nunca ensucia el árbol de layout, así que nunca desencadena la cascada.

---

## Estructura de la Serie

Esta serie cubre pretext desde los fundamentos hasta demos en vivo:

1. **[El Impuesto del Reflow](/es/blog/pretext/reflow-tax)** — qué es realmente el layout reflow, cuándo duele y por qué `getBoundingClientRect()` es caro
2. **[Cómo Funciona Pretext](/es/blog/pretext/how-it-works)** — el modelo de dos fases, el oráculo Canvas, el layout aritmético y la API completa
3. **[Demo React: Chat en Streaming](/es/blog/pretext/react-demo)** — construyendo un chat de IA en vivo con alturas de burbuja medidas con pretext
4. **[Matteflow: Texto Alrededor de un Bailarín](/es/blog/pretext/matteflow)** — un demo editorial completo: texto que fluye alrededor de un sujeto en movimiento, recomputado en cada fotograma con pretext

---

<div class="not-prose my-8 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 to-primary/3 p-6 text-center shadow-sm">
  <p class="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-2">Demo en vivo</p>
  <p class="text-xl font-bold text-foreground mb-1">Sáltate la teoría — míralo en movimiento</p>
  <p class="text-sm text-muted-foreground mb-5">Texto fluyendo alrededor de una figura bailando, recomputado en cada fotograma con pretext. Sin instalación.</p>
  <a href="/es/blog/pretext/matteflow" class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 active:scale-95 transition-all no-underline">
    Abrir Demo Matteflow →
  </a>
</div>

Empieza con [El Impuesto del Reflow →](/es/blog/pretext/reflow-tax)
