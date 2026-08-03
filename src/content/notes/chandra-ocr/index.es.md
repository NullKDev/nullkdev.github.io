---
entryId: notes-chandra-ocr-es
locale: es
translationKey: chandra-ocr
slug: chandra-ocr-puntajes-benchmark
title: 'Lo que el 85.9% de Chandra no te dice'
summary: 'Un modelo abierto de 5B le gana a Gemini y GPT-5 Mini en OCR. Dos cosas que el leaderboard omite: quién escribió el benchmark y qué permite la licencia.'
visibility: public
maturity: stable
publishedAt: 2026-07-29
updatedAt: 2026-07-29
topics: [ai, architecture, performance]
featuredRank: 2
image: /banners/chandra-ocr.svg
imageAlt: Banner de Chandra OCR — lo que un puntaje de 85.9% deja afuera.
links:
  - label: datalab-to/chandra
    href: https://github.com/datalab-to/chandra
    kind: repository
  - label: Pesos de chandra-ocr-2
    href: https://huggingface.co/datalab-to/chandra-ocr-2
    kind: publication
references: []
evidence: []
documents: []
protection: { mode: public }
kind: article
lifecycle: current
citations:
  - title: datalab-to/chandra
    url: https://github.com/datalab-to/chandra
    accessedAt: 2026-07-29
  - title: Model card de chandra-ocr-2
    url: https://huggingface.co/datalab-to/chandra-ocr-2
    accessedAt: 2026-07-29
  - title: 'RealDocBench: field-level QA and layout understanding on real-world regulated documents'
    url: https://arxiv.org/abs/2606.07401
    accessedAt: 2026-07-29
  - title: 'dots.ocr: multilingual document layout parsing in a single vision-language model'
    url: https://arxiv.org/abs/2512.02498
    accessedAt: 2026-07-29
---

Chandra 2 salió en marzo de 2026 y el titular es genuinamente impresionante:
**85.9% en el benchmark olmOCR con un modelo de 5 mil millones de parámetros**,
contra 67.6% de Gemini 2.5 Flash y 60.5% de GPT-5 Mini. La mitad de parámetros
que Chandra 1, mejor puntaje, y lo podés correr vos.

Fui a buscar la letra chica y encontré dos cosas. Ninguna es un defecto del
modelo. Las dos son cosas que un leaderboard no puede mostrarte.

## La idea central en un párrafo

Chandra no es reconocimiento de caracteres. Toma una página y la reconstruye como
un **artefacto estructurado** — markdown, HTML o JSON con coordenadas de layout —
para que una doble columna siga siendo dos columnas, una tabla siga siendo tabla,
y un formulario conserve sus checkboxes. La salida está pensada para que la
consuma algo más abajo en la cadena, y por eso el JSON lleva posiciones y no solo
texto. Está construido sobre Qwen 3.5, maneja más de 90 idiomas, y reporta 1.44
páginas/segundo en una H100 con 96 secuencias concurrentes.

## De dónde sale el número

Hay dos benchmarks en juego, y no son el mismo tipo de cosa.

**olmOCR es externo.** Lo construyó AllenAI, otros modelos reportan contra él, y
85.9% significa algo comparable. Ese es el número que vale citar.

**El benchmark multilingüe es propio de Chandra.** El repositorio es honesto sobre
el motivo — los autores dicen que no existe una alternativa pública multilingüe
decente, y es cierto. Pero significa que el promedio de 77.8% en 43 idiomas, y el
72.7% en 90, son puntajes en un examen que escribió su propio autor. Eso no es
deshonesto. Es simplemente una afirmación más débil que la de olmOCR, y las dos se
citan como si fueran lo mismo.

Vale mirar quién tiene paper y quién no. `dots.ocr`, al que Chandra 2 le gana por
dos puntos en olmOCR, está [publicado](https://arxiv.org/abs/2512.02498) con su
metodología expuesta a que la ataquen. Chandra es un release de modelo y un
README. Los puntajes más altos de esta comparación vienen del artefacto con menos
documentación revisada — vale tenerlo presente, no como acusación, sino como una
diferencia en qué estás confiando.

## El paper que sí lo evaluó

[RealDocBench](https://arxiv.org/abs/2606.07401) hace otra pregunta: no "qué tan
bien transcribe el modelo una página" sino **"puede extraer el valor correcto de
un campo específico en un documento regulado real"**. Evalúa AWS Textract, Azure
Document Intelligence, Claude, Gemini, olmOCR, Docling, PaddleOCR, LlamaParse,
Reducto — y Chandra.

Su hallazgo es el que importa si estás por construir sobre alguno de estos: los
modelos que rinden bien en benchmarks establecidos muestran **precisión
significativamente menor** en documentos regulatorios auténticos con requisitos a
nivel de campo. El planteo del propio paper es que los benchmarks estándar no
transfieren.

No sorprende una vez dicho. olmOCR pide una lectura fiel de una página. Tu
pipeline de facturas pregunta: cuál es el total, y es el total o el subtotal. Un
modelo puede sacar 85.9% en lo primero y aun así meter el número equivocado en tu
base de datos, porque una página transcripta 95% bien puede estar 100% mal en el
único campo que necesitabas.

**La consecuencia práctica:** el leaderboard te dice qué modelo poner en la lista
corta. No te dice si alguno pasa tu umbral. Eso sigue requiriendo tus documentos,
tus campos, y contar los errores vos.

## Qué permite la licencia

Esta es la parte que yo querría saber antes de escribir una línea de código, y es
fácil pasarla por alto porque el repositorio es Apache 2.0.

El **código** es Apache 2.0. Los **pesos** no. Salen bajo una licencia OpenRAIL-M
modificada: gratis para investigación, uso personal, y startups por debajo de
**2 millones de dólares en financiamiento o ingresos** — y, explícitamente,
**no se pueden usar para competir con la API de Datalab**.

Leé esa segunda cláusula con cuidado. Un umbral de ingresos es un umbral; sabés
cuándo lo cruzás. "No competitivamente con nuestra API" es un juicio sobre qué es
tu producto, hecho por la parte con cuya API estarías compitiendo. Si estás
construyendo una función de procesamiento de documentos dentro de un producto más
grande, probablemente estés bien. Si el procesamiento de documentos **es** el
producto, estás negociando una licencia comercial, y conviene saberlo el día uno y
no después de integrar.

Llamar a esto "open source" es un estiramiento. El código lo es; la cosa que hace
el trabajo es source-available con restricciones comerciales. Esa distinción
desaparece en casi todas las notas que se escriben, y es la que tiene
consecuencias contractuales.

## Qué cuesta correrlo

El throughput está medido en una **H100 80GB**. El model card no declara un mínimo
de VRAM, lo que en la práctica significa que nadie se comprometió con uno.

Para un modelo visión-lenguaje de 5B se puede razonar el piso: los pesos en bf16
son unos 10GB antes de cualquier KV cache o tensor de imagen, así que una placa de
consumo de 24GB es plausible para trabajo de una página, y una H100 es lo que
necesitás para las 1.44 páginas/segundo con 96 secuencias concurrentes. Son
máquinas muy distintas. Si tu plan implica procesar un archivo entero, el número de
throughput y el hardware donde se midió viajan juntos.

Hay CLI (`chandra input.pdf ./output --method hf|vllm`), una app en Streamlit, y un
servidor vLLM dockerizado. Ponerlo a andar no es la parte difícil.

## Dónde cae la precisión de verdad

El model card reporta puntajes multilingües que van de **8.1% a 97.0%** según el
idioma. Ese rango es el número más útil de la página y el que menos se cita.

Un promedio de 72.7% en 90 idiomas es compatible con rendimiento excelente en los
veinte idiomas que dominan los datos de entrenamiento y con ser casi inservible en
la cola. Si tus documentos están en inglés, ese promedio subestima lo que vas a
obtener. Si están en un idioma de pocos recursos, lo sobreestima — posiblemente
por mucho. Mirá tu idioma, no la media.

## Qué haría yo

- **Ponelo en la lista corta.** Para modelos abiertos de este tamaño el puntaje de
  olmOCR es real, y la salida que preserva layout tiene la forma correcta para
  cualquier cosa que venga después.
- **No confíes en el puntaje para tu caso.** Tomá cincuenta documentos tuyos, extraé
  los campos que realmente necesitás, y contá los errores. RealDocBench existe
  porque esa brecha es medible y consistente.
- **Chequeá tu idioma contra la tabla por idioma**, no contra el promedio.
- **Resolvé la licencia antes de integrar**, no después. La línea de los 2 millones
  es clara; la cláusula de no competencia no lo es, y esa es la que hay que dejar
  por escrito.

Lo interesante de Chandra no es que un modelo abierto de 5B le haya ganado a dos
modelos frontera hospedados. Es que lo hizo en una tarea **estrecha y bien
definida** — y ese es el patrón que vale llevarse. Un modelo hecho para un trabajo,
evaluado en ese trabajo, le gana a los sistemas de propósito general. Lo que el
benchmark no puede decirte es si ese trabajo tiene la misma forma que el tuyo.
