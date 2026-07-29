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
