# Changelog

Historial de versiones de este archivo, mantenido a mano.

Lectores: quien trabaje en el proyecto, no visitantes del sitio. El nivel de
detalle técnico es intencional — se nombran módulos, rutas y comportamiento
real.

## Cómo se mantiene

**Se escribe al mergear cada PR, no en el release.** El autor agrega su línea
bajo `## [Unreleased]`, en la categoría que corresponda. Es parte del review.

**Una feature sin publicar es UNA sola entrada** (regla _single-story_).
Mientras vive bajo `## [Unreleased]`, la feature y cualquier corrección o
continuación posterior — aunque sean commits o sesiones distintas — se pliegan
en esa misma línea, referenciando todos los commits. No se agrega una segunda
viñeta _Corregido_. Recién cuando la feature ya salió en una versión publicada,
una corrección posterior amerita su propia línea.

**Solo registran entrada** los PR de tipo `feat`, `fix`, `perf`, `security`, y
`refactor`/`build` con impacto observable para otro dev. Los `style`, `test`,
`ci`, `docs`, `chore` y el refactor puro sin impacto no se anotan — esa
curaduría es lo que se gana al mantenerlo a mano en vez de generarlo del log.

**En el release**, `## [Unreleased]` se renombra a la versión y su fecha, y se
abre un `## [Unreleased]` vacío arriba. La fuente de verdad de la versión es
`version` en `package.json`; el workflow `release.yml` no publica nada si esa
versión ya tiene tag.

### Categorías

`Agregado` (feat) · `Corregido` (fix) · `Rendimiento` (perf) ·
`Cambiado` (refactor/build con impacto) · `Seguridad` (security) · `Eliminado`

Solo se incluyen las categorías con contenido. No se dejan secciones vacías.

**Formato de línea:** resumen en prosa, en español neutro, de lo más importante
del cambio — no la lista de archivos.

```
- Resumen de lo que cambió y por qué importa. ([abc1234](url-del-commit))
```

El versionado sigue [Semantic Versioning](https://semver.org/lang/es/). El
formato se inspira en [Keep a Changelog](https://keepachangelog.com/es-ES/),
con las categorías en español mapeadas a los tipos de Conventional Commit que
este repo usa de verdad — no las genéricas del estándar.

---

## [Unreleased]

### Agregado

- Vuelven los diagramas de la nota de Codex Security: la arquitectura (qué parte
  corre en tu máquina y cuál queda cerrada en OpenAI) y los códigos de salida en
  CI. Ahora se compilan a SVG estático en el build con `beautiful-mermaid`, en
  lugar de dibujarse en el navegador del lector: con Mermaid en el cliente, el
  mismo diagrama medía 351px en un navegador y más de 1.600px en otro. El tamaño
  se decide en el build: llenan la columna hasta 1,25×, con tope de alto, y
  nunca se achican por debajo de lo dibujado; un diagrama más ancho que la
  columna se desplaza dentro de su panel, con controles de zoom. Al hacer zoom,
  el panel queda como una ventana fija: el diagrama crece adentro, centrado en
  lo que se estaba mirando y se arrastra con el mouse, sin empujar el resto
  del artículo. Los colores
  salen de los tokens del sitio, así que un mismo SVG sigue los dos temas sin
  redibujarse. Cada diagrama lleva un nombre accesible obligatorio (el build
  falla sin `title`). Se elimina `astro-mermaid` y sus ~248 KB de JavaScript.

- El índice de los artículos largos ya no se corta: la columna lateral tiene
  como máximo el alto de la ventana y desplaza su propia lista (nunca la
  página) para mantener a la vista la sección que se está leyendo. En una nota
  con subpartes, cada parte muestra su título, cuántas secciones tiene y sus
  minutos de lectura, y despliega sus encabezados solo cuando se está leyendo
  (con `<details>`, así que funciona sin JavaScript). Las secciones de primer
  nivel llevan el mismo número que el texto ("06 Breaking changes") y las
  subsecciones se numeran según su sección ("2.1", "2.2"), igual en el índice
  y en el encabezado; los números ya no se escriben a mano en el título. Los temas
  ("Archivado en") salen de la columna y pasan al final del texto.
- Índice en el teléfono: un `<details>` plegado ("En este registro · N
  secciones") antes del primer párrafo, con las secciones de primer nivel.
  Antes el índice aparecía después del artículo, a más de 12.000px.
- Cada encabezado de sección tiene un enlace a sí mismo, visible al pasar el
  cursor o con el foco del teclado y con nombre accesible localizado ("Enlace
  a la sección: …"), sin alterar el nombre del encabezado. Cambiar de idioma
  conserva la posición: la sección i en inglés lleva a la sección i en
  español, solo cuando ambas traducciones tienen el mismo esquema (lo verifica
  una prueba sobre las notas reales); si no, o si el lector está por encima de
  la primera sección, se llega al inicio.
- Estilos de impresión: sin cabecera, navegación, índices, banner, barra de
  progreso ni botones de copiar; negro sobre blanco en ambos temas, sin cortar
  bloques de código, figuras ni tablas, y con la URL de cada enlace externo.
- Una nota dice en qué estado está, arriba del todo: una nota reemplazada
  enlaza a la que la reemplazó ("Esta nota fue reemplazada por …", en el idioma
  de la página) y una archivada sin reemplazo lo explica en una frase. Las notas
  de una serie muestran "Parte 2 de 3 · Android 17" en la cabecera y en su
  tarjeta, con el título de la serie desde `src/data/series.ts` (el esquema
  rechaza un `series.id` que no esté ahí). "Parte" queda solo para las
  subpartes ("4 partes", "Parte 3 de 4") y ninguna cuenta de uno se anuncia. La
  cabecera muestra la madurez de la redacción ("Redacción: Estable"), y el chip
  de ciclo de vida explica qué es y enlaza a la nueva sección del colofón que
  define los tres estados.
- La página 404 sugiere las notas más cercanas a la dirección que no existe
  (una ruta antigua de `/blog/`, un slug mal escrito o cortado), en inglés y en
  español, a partir del mismo índice que la búsqueda. Sin JavaScript, o sin
  nada parecido, se queda con los enlaces de siempre.

### Corregido

- Las fechas ya no salen un día antes: una fecha del frontmatter
  (`2026-03-27`) es medianoche UTC y se formateaba en la zona del build
  (GMT-5), así que la página decía 26. Toda fecha pasa por `formatDate` en
  `src/lib/dates.ts`, en UTC, y los `datetime` son fechas ISO. "Actualizado"
  se oculta cuando coincide con el día de publicación, y la lectura dice
  "7 min" en lugar de "Lectura: 7 min de lectura".
- Etiquetas que confundían: la navegación de subpartes decía "Documentos" (el
  nombre interno de la colección) y ahora dice "Partes"; la serie se nombraba
  por su id; un tema en una nota lleva al listado de Notas filtrado, como en las
  tarjetas, en lugar de a `/tags`; los conteos de `/tags` ya no llevan cero a la
  izquierda; la Galería muestra "23 piezas" en lugar de "+18"; el botón de
  Trabajo de la portada usa una flecha y no el ícono de enlace externo; y el
  filtro del Laboratorio y sus tarjetas omiten temas presentes en el 85% o más
  de las entradas, que no filtraban nada; cada cifra del filtro cuenta las
  mismas etiquetas con las que filtra. El build falla si vuelve a aparecer
  "Documents" o un "1 / 1" en la navegación de partes y series, o un id de
  serie en el HTML.
- El español es neutro en todo el contenido: se quitó el voseo (podés, tenés,
  subís, probá…) de las notas, el Laboratorio y Trabajo, y una prueba lo
  detecta en el contenido en español y en `es.ts` (fuera de bloques de código).
- El robot de la portada se puede pausar: un botón visible de 44 px, operable
  con teclado, con nombre fijo ("Pausar la animación del robot") y
  `aria-pressed`. La pausa detiene el clip en curso y la espera hasta el
  siguiente, se mantiene durante la sesión y convive con las pausas
  automáticas (fuera de pantalla, pestaña oculta, fallo de WebGL). La
  animación sigue siendo autónoma para todos, también con movimiento reducido.
  El fin de cada clip se escucha con el evento público `finished` de
  model-viewer, sin tocar sus propiedades internas.
- Las demos de Pretext hablan el idioma de la página: botones, textos de
  ayuda, el artículo de Matteflow y la conversación simulada se traducen desde
  los diccionarios, con iconos del registro en lugar de emojis. Sin
  JavaScript, cada demo explica que lo necesita en vez de dejar un hueco.
  Matteflow ya no promete un video de ejemplo que no existe: muestra el
  artículo y pide elegir un video, informa si no se puede reproducir y libera
  el video subido al salir. Elegir un video propio nunca había funcionado en
  producción: la CSP bloqueaba los `blob:` en `media-src`, y ahora los
  permite. El chat simulado se puede detener y deja de
  actualizarse al abandonar la página.
- Las páginas 404 ya no declaran como canónica la portada (`/` y `/es/`), lo
  que les decía a los buscadores que el error y el archivo eran el mismo
  documento. Siguen fuera del índice y sus textos se traducen desde los
  diccionarios.
- Sin JavaScript, el encabezado ya no ofrece controles que no funcionan: el
  botón de menú y el de tema se ocultan, y bajo 760 px los enlaces de sección
  quedan visibles en su propia fila en lugar de esconderse detrás de un botón
  inerte. La sección actual se reconoce por segmento de ruta, no por
  subcadena. El botón de tema es un interruptor con nombre fijo ("Tema
  oscuro") y `aria-pressed`; antes también cambiaba su nombre y anunciaba el
  estado dos veces. Las utilidades `dark:` de Tailwind siguen el tema elegido
  en el sitio (`data-theme`) y no el del sistema operativo.
- La búsqueda de Notas maneja los errores: si el índice no carga, lo dice en
  pantalla y lo anuncia, y el archivo sigue visible; se descarga una sola vez
  aunque se escriba rápido, y una respuesta tardía ya no muestra resultados de
  una búsqueda que se borró. Los resultados se anuncian en una región viva que
  existe desde el inicio, y cada uno indica sus minutos de lectura con unidad.
  Los enlaces "Más antiguas" y "Más recientes" de la paginación llevan la barra
  final y ya no pasan por una redirección.
- El visor de la Galería detiene el video al cerrarse y no cambia de pieza
  cuando las flechas se usan en los controles del video; la semilla de una
  imagen generada se muestra traducida. La marca de "Destacado" en las
  tarjetas de Trabajo sale del registro de íconos en lugar de un carácter.
- El panel de diseño de desarrollo ya no deja sus estilos ni su script en el
  build de producción (unos 700 bytes gzip menos por página).
- El logo, el selector de idioma y el botón de menú del encabezado anunciaban
  un nombre accesible que no contenía su texto visible ("Home" para el logo,
  "Open navigation" para un botón que dice "Menu"), lo que incumple WCAG 2.5.3
  y deja sin respuesta a quien navega por voz. Ahora el nombre empieza por lo
  que se ve. Lo detectó la regla `label-content-name-mismatch` de axe-core 4.14.
- La consola de los laboratorios anunciaba "este navegador no cumple los
  requisitos" en una región viva que aparecía junto con el mensaje, y los
  lectores de pantalla podían perderlo. La región ahora existe desde el inicio
  y solo cambia su texto.
- Las páginas con traducción declaran `hreflang="x-default"` apuntando a la
  versión en inglés, para quien no lee ninguno de los dos idiomas. Los
  `hreflang` solo nombran la traducción real de la misma página: una entrada
  sin traducir ya no anuncia el índice de su sección, la página 2 de Notas ya
  no anuncia la página 1 del otro idioma, y las páginas `noindex` (404,
  contenido protegido, rutas antiguas) no declaran ninguno. El build falla si
  un par no es recíproco.
- Una subpublicación abierta en su propia URL ahora tiene las mismas
  herramientas de lectura que dentro de su entrada: botón para copiar el código
  y su lenguaje, barra de progreso, marcador de la sección activa en el índice
  y visor de imágenes. Antes solo tenía el zoom de diagramas, y su índice
  listaba todos los niveles de título mientras la entrada mostraba solo `h2` y
  `h3`; ahora ambas siguen la misma regla.
- El visor de imágenes de los artículos se puede usar con teclado: cada imagen
  es un botón con nombre accesible, el visor es un diálogo modal nativo que
  retiene el foco, se cierra con Escape y devuelve el foco a la imagen que lo
  abrió. Siempre tiene nombre, aunque la imagen no tenga texto alternativo, y
  el botón de cerrar usa el ícono del registro con un área de 44 px.
- La búsqueda de Notas encuentra los títulos de sección: el índice incluye los
  encabezados `h2`/`h3` de cada nota con su ancla, y un resultado que solo
  coincide en un encabezado lleva directo a esa sección ("en la sección
  AlarmManager"). Los accesos a filtros ignoran tildes, igual que las notas.
  Sin resultados, dice qué se buscó y ofrece limpiar la búsqueda o explorar
  temas; el recuento ya no habla de "todo el archivo", solo de notas. Mientras
  se busca, las pestañas de tipo ocultan sus totales, y queda un único botón
  para limpiar. El build falla si una ancla indexada no existe o si el índice
  supera su presupuesto gzip.
- Quien lee en español recibe un feed en español: `/es/rss.xml` existe, con
  `<language>es</language>` y solo las notas en español, y las páginas en
  español lo enlazan en el `<head>`, el pie y la cabecera de Notas. El feed en
  inglés declara `<language>en</language>`. El build verifica que cada idioma
  enlace su propio feed y que ambos se lean como XML.
- Las herramientas del Lab se usan en el teléfono: entrada y salida se apilan
  en una columna por debajo de 760 px en lugar de quedar lado a lado a unos
  150 px cada una. La regla para apilarlas existía pero perdía por
  especificidad frente a la de dos columnas.
- En `astro dev`, la CSP ya no bloquea los scripts que inician las islas de
  React, así que las herramientas del Lab y las demos funcionan al
  desarrollar. La política publicada no cambia.

### Rendimiento

- Las fotos de la Galería pasan por `astro:assets`: se sirven en AVIF y WebP a
  varios anchos con `srcset`/`sizes` y con dimensiones intrínsecas, en lugar
  del JPG original. El índice de la Galería baja de ~1,3 MB a ~33 KB de
  imágenes en el peor caso, y el álbum de San Francisco de ~6,5 MB a ~0,9 MB.
  El enlace de cada pieza y el visor abren una versión WebP de hasta 2048 px,
  no el original de cámara. Las miniaturas del índice reservan su espacio, y
  un video sin póster ya no se muestra como imagen rota.
- El CSS se divide por tipo de página, en lugar de una sola hoja con el de todo
  el sitio. El inicio y el índice de Notas bajan de ~29 KB a ~15 KB de CSS
  comprimido y la página 404 a ~13 KB. Las páginas de sección (Trabajo, Lab,
  Galería, Acerca de y las secundarias) comparten un paquete de ~22 KB, igual
  que las fichas, que incluyen los estilos de Lab y Galería; las subentradas
  quedan en ~19 KB. También se eliminan reglas que ya no usaba ninguna página.

### Cambiado

- Tipografía de lectura: el texto corrido queda en ~70 caracteres por línea
  (antes ~83 a 1280px); por debajo de 1024px el índice deja de ir al lado del
  texto, que a 820px quedaba en 441px. Títulos de entrada con menos
  interletrado (−0,035em; "17:qué" se pegaba), `text-wrap` en párrafos y
  encabezados, guiones automáticos en español en pantallas angostas y una sola
  fuente monoespaciada para el código.
- En las notas, el banner se ajusta al ancho de la columna de texto (misma
  proporción `--banner-ratio`): pasa de 471px a 282px de alto y el texto
  empieza ~190px más arriba. Dentro de una serie, el paginador por fecha dice
  "Nota más antigua / más reciente" en lugar de un segundo "Anterior", y una
  serie de una sola nota ya no muestra navegación de serie.
- Los datos estructurados de cada página salen de un solo módulo. Las entradas
  de Notas y Galería se declaran `Article`, y las de Trabajo y Lab
  `TechArticle` (Lab usaba `SoftwareApplication`, que sin precio ni
  valoración es un resultado enriquecido inválido); todas indican autor e
  imagen, la misma que se comparte en redes. Una subpublicación abierta en su
  propia URL comparte el banner de su entrada en lugar de la tarjeta genérica
  del sitio. El build falla si una entrada o subpublicación pierde cualquiera
  de las dos.

### Seguridad

- Se cierran los 35 advisories (16 high) en dependencias transitivas
  (`devalue`, `brace-expansion`, `fast-uri`, `source-map-js`, `smol-toml`,
  `sharp`, `undici`, `dompurify`, entre otras). Como en 0.4.0, los parches ya
  cabían en los rangos de sus paquetes padre y bastó con volver a resolver el
  lockfile. El `audit` en rojo bloqueaba todos los PR de Dependabot. El último,
  en `katex`, se fue con `mermaid` al compilar los diagramas en el build.
- La CSP ya no autoriza cualquier script inline que salga del build: solo
  sella los del `<head>`, el runtime de hidratación de Astro (comparado byte a
  byte con el paquete instalado) y los marcados con `data-csp-inline`.
  Cualquier otro hace fallar el build, en vez de quedar permitido sin que
  nadie lo note. Los scripts de componentes ya no se insertan en el HTML: se
  sirven como archivos `/_astro/*.js`, así que un `<script type="module">`
  inline en el `<body>`, indistinguible de uno inyectado, también hace fallar
  el build. `'wasm-unsafe-eval'` queda solo en las
  páginas que muestran el robot 3D, cuyo visor compila WebAssembly al cargar;
  el resto del sitio ya no lo concede.
- El JSON que se escribe dentro de un `<script>` (JSON-LD, la galería, la
  consola de laboratorios) escapa `<`, así que un valor con `</script>` ya no
  puede cerrar el elemento e inyectar marcado.
- El build exige que cada clave `PRIVATE_CONTENT_KEY_*` tenga al menos 16
  caracteres: el contenido cifrado es público y se ataca sin conexión.

## [0.4.0] — 2026-08-30

### Agregado

- Nota nueva sobre Codex Security, el escáner de vulnerabilidades que OpenAI
  liberó bajo Apache 2.0: el 92% que se publicó es recall, y la precisión —la
  métrica que decide si los hallazgos son usables— nunca se reportó. Se contrasta
  con los benchmarks independientes RealVuln y el de LLM de frontera, que miden
  justamente eso. Incluye un subpost operativo sobre integrarlo a CI: códigos de
  salida, política de severidad, techo de costo y el directorio de salida, que
  contiene fragmentos de código fuente y no debe quedar dentro del repositorio.
  Trae un motivo de banner nuevo, `unmeasured-half`, para el sujeto de una
  medición publicada a la mitad. La comparación de precisión se dibuja con un
  componente nuevo, `BenchmarkBars`, que codifica el valor como longitud para
  que la brecha se vea antes de leer las cifras, sin dejar de ser una tabla real
  para un lector de pantalla.
- La nota de Android 17 estable pasa de cuatro cambios que rompen en targetSdk 37
  a ocho, verificados contra la documentación oficial: se suman el audio en
  background —que exige un foreground service con capacidades while-in-use, no
  `MediaSessionService` como suele repetirse—, la reflection sobre la plataforma
  (`static final` y el `MessageQueue` sin locks, cuyo `mMessages` ahora siempre
  es null y rompe Espresso y Robolectric), la retención de tres horas de los SMS
  con OTP y el angostamiento de contactos. Se agrega además el GC generacional de
  ART, que es el único de la tanda que llega sin subir targetSdk. El título decía
  «cuatro» y contaba mal, así que ahora nombra el criterio en vez de la cantidad.
- Nota nueva sobre el Model Hardware Standard, el estándar de hardware que
  Anthropic abrió en research preview el 27 de agosto. Corrige el encuadre que
  se repitió en toda la cobertura —«MCP para hardware»—: el anuncio dice que MHS
  es model-agnostic y que MCP es una de tres vías de acceso, junto a una CLI y a
  code file APIs, así que no está construido sobre MCP ni compromete con el
  stack de Anthropic. Separa lo anunciado de la extrapolación: los partners son
  laboratorios e instrumentos, y SCADA, PLC y MES no aparecen en ninguna parte.
  Toma como evidencia los números de QuEra —58% a 99.3% de éxito en recuperación
  de láser, 150 s a 0.9–14 s— en lugar del rango de integración, cuyos propios
  casos de respaldo tardaron ocho horas y una semana. Deja explícito que es un
  preview cerrado, que el sitio del estándar no publica la especificación y que
  el open source todavía no tiene fecha. Trae un motivo de banner nuevo,
  `standard-bus`, para el sujeto de N traductores a medida colapsados en una
  superficie, y una marca nueva en el registro de iconos, `device`, para el
  instrumento programable del otro lado del driver. Queda en `featuredRank: 1` y
  el resto del archivo de notas corre un lugar.

### Corregido

- El topic `ai` se usaba en las notas pero solo existía como dominio, no como
  topic, así que `getTopicLabel` caía al fallback y lo rotulaba «Ai» en los dos
  idiomas en vez de «AI» e «IA». Se agrega a `taxonomy.topics`, con lo que la
  nota de Chandra OCR queda bien rotulada también.

### Cambiado

- Las tablas de los posts se renderizaban con el estilo por defecto del
  navegador: sin padding, columnas pegadas y ocupando la mitad del ancho de la
  columna de texto. Ahora hay estilo propio, y un plugin de build las envuelve
  en un contenedor que scrollea solo —así una tabla ancha no manda de costado a
  toda la página— y detecta las columnas numéricas para pasarlas a mono con
  cifras tabulares alineadas a la derecha, encabezado incluido. La alineación se
  decide por columna y no por celda: marcada celda por celda, el encabezado
  queda a la izquierda y deja de rotular lo que tiene debajo. Aplica a todo el
  archivo, incluidos los posts escritos antes.
- Los diagramas de mermaid quedan desactivados por ahora. Se dibujan con los
  tokens del sitio y hay un visor compartido con zoom, teclado y área táctil de
  44px, pero el tamaño que produce el motor de layout no entra bien en una
  columna de lectura: cada arreglo cambiaba un alto excesivo por un ancho
  excesivo. La fuente de cada diagrama queda comentada en su lugar y el detalle
  de lo medido está en el issue #24, así que retomarlo es descomentar un bloque,
  no reinvestigar.

### Seguridad

- Se cierran cinco advisories high en dependencias transitivas
  (`brace-expansion`, `nanoid`, `js-yaml`). Los parches ya estaban dentro del
  rango que permiten sus paquetes padre; el lockfile había quedado rancio, y por
  eso `bun update` no reportaba nada mientras el árbol seguía en las versiones
  vulnerables. Volver a resolverlo alcanza: `package.json` no se toca y ninguna
  dependencia directa cambia de major. Esto además destraba el despliegue —
  `build` depende de `[verify, audit, e2e]`, así que un `audit` en rojo venía
  saltándose el deploy de Pages desde el 30 de julio.

## [0.3.0] — 2026-07-30

### Corregido

- Al compartir el link de una nota, la preview ahora muestra el banner de esa
  nota en vez de una tarjeta genérica que además seguía diciendo `<nullKdev/>`.
  El bloqueo no era solo que faltara pasarlo: el propio validador de metadata
  exigía que toda página usara la misma imagen. Los banners se rasterizan a PNG
  porque X, LinkedIn y WhatsApp no renderizan SVG en `og:image`.
- `/notes/type/note/` tenía el mismo título y la misma descripción que `/notes/`
  en el mismo idioma — contenido duplicado que un buscador no puede separar. De
  15 descripciones idénticas a ninguna repetida.
- Los títulos de subposts concatenaban el del padre y llegaban a 153 caracteres.

### Cambiado

- Los banners se declaran en un manifiesto y se generan con `banners:build`,
  tomando el arte del registro de iconos en vez de dibujarlo. La tarjeta de
  identidad se genera desde `brand`, así que no puede volver a quedarse con la
  marca vieja. Cada banner dibuja ahora su tema — una página convertida en
  estructura, memoria pasando un techo — en vez de un solo icono, que funciona
  como insignia de categoría y no dice nada del post. Se emiten cuatro SVG por
  banner, idioma × tema: el texto está traducido y el fondo se adapta, mientras
  el acento, el arte y las sombras se mantienen idénticos para que sea el mismo
  objeto en ambos temas. La derivación de rutas vive en `src/lib/banners.ts`;
  escribirla dentro de un componente dejaba cinco superficies de tarjeta
  mostrando arte inglés y oscuro en páginas en español con tema claro. El fondo
  claro es plomo y no casi-blanco: `#F8FAFC` medía 1.05:1 contra la tarjeta que
  lo contiene, así que el banner no tenía borde y el arte parecía flotar.
- Structured data en todas las páginas indexables: `CollectionPage` en índices y
  filtros, `WebPage` en las de referencia, `WebSite` + `Person` en la home.

## [0.2.0] — 2026-07-29

### Agregado

- Tres notas nuevas, en ambos idiomas: Chandra 2 y lo que un puntaje de benchmark
  no dice, Android 17 estable y los cuatro cambios que rompen en `targetSdk 37`, y
  los límites de memoria de Android 17 que matan el proceso sin stack trace. Las
  tres de Android quedan encadenadas como serie con la nota de la Beta 3, que ahora
  apunta a la estable en vez de terminar en un callejón sin salida.

### Corregido

- Los banners se renderizaban con tres proporciones distintas según el ancho de
  pantalla — 3.76:1 en desktop, 1.90:1 en teléfono — porque `height: auto` peleaba
  con `max-height`. Había seis tratamientos para las mismas imágenes. Ahora hay un
  solo token, el ratio va en el `img` y no en el wrapper, y un validador en el build
  exige que todo banner sea 1200×630. Encontró uno de 640×360 en su primera corrida.

## [0.1.0] — 2026-07-29

Primera versión publicada del archivo reconstruido.

### Agregado

- Convención de commits verificada en CI (`type(scope): descripción`), con los
  tipos derivados del historial real del repo y no de una lista genérica.
  Incluye `security`, que acá se usa. El validador es un script testeado, así
  que corre igual en local con `bun run commits:check`.
- Este changelog, y releases automáticos al mergear a `main` cuando la versión
  de `package.json` cambia.

### Seguridad

- CSP real en todas las páginas, sellado después del build hasheando los
  scripts inline que efectivamente se publicaron. Antes la documentación
  afirmaba un CSP en un archivo que no existía. Al aplicarlo apareció una
  exposición de cadena de suministro: los dos demos de pretext importaban
  `@chenglou/pretext` desde `esm.sh` en runtime, dejando que un origen de
  terceros ejecutara código en el navegador de quien leyera — ahora se bundlea.
  Verificado: cero violaciones y cero pedidos externos en nueve rutas.
- Pipeline de CI endurecido: actions pinneadas a SHA, `GITHUB_TOKEN` de solo
  lectura por defecto, `persist-credentials: false`, timeouts por job, auditoría
  de dependencias bloqueante, CodeQL, y `actionlint` + `zizmor` sobre los
  propios workflows.
- Corregida una condición de carrera de sistema de archivos (CWE-367) en el
  script de presupuestos de rendimiento, detectada por CodeQL.

### Cambiado

- El sitio dejó de ser blog/projects/photos/tools y pasó a cuatro dominios de
  contenido tipados — Work, Lab, Notes, Gallery — con Zod validando cada
  registro, para que ningún número ni afirmación de una página se escriba a
  mano. Las rutas viejas quedan como páginas de compatibilidad `noindex`.
- El origen del sitio sale de una única fuente (`site.config.mjs`). Estaba
  hardcodeado en seis lugares, uno de ellos dentro de un regex, y `robots.txt`
  seguía apuntando a un dominio que el resto del build ya había dejado.
- Analytics con Google Analytics 4, apagado salvo que `PUBLIC_GOOGLE_ANALYTICS_ID`
  esté configurado, con Consent Mode negando almacenamiento publicitario. El
  colofón ahora dice qué se envía, porque antes afirmaba que nada.
- Umbrales de cobertura escalonados y honestos: piso global apenas por debajo
  de lo real, y barra alta donde un bug cuesta caro (`src/lib/protection`,
  `src/content`). El 80% plano nunca se había alcanzado.

### Corregido

- El índice lateral de una entrada descartaba la profundidad de los headings,
  así que todo se veía al mismo nivel. Ahora es un outline real que además
  incluye los headings de los subposts.
- El robot 3D quedaba congelado para siempre en pantallas donde el hero es más
  alto que el viewport: el umbral del `IntersectionObserver` era matemáticamente
  inalcanzable. La visibilidad ahora se mide contra la banda que el viewport
  puede mostrar, descontando el header sticky.
- El código inline empujaba el documento a 542px de ancho en pantallas de
  320px, porque un identificador no tiene dónde cortar.
