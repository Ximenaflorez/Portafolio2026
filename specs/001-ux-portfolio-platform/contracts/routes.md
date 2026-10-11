# Contract: Rutas públicas

Todas las rutas se prerenderizan. Cada una MUST exponer `<title>`, `<meta name="description">`,
URL canónica, un único `<h1>` y el `lang` de su idioma en el documento, además de las alternativas
del otro idioma (`<link rel="alternate" hreflang>`) (FR-014, FR-041).

## Idiomas (FR-039)

El español no lleva prefijo. El inglés vive bajo `/en/`. Cada ruta existe en los dos idiomas.

| Español (`lang="es"`) | Inglés (`lang="en"`) | Módulo | En sitemap |
|---|---|---|---|
| `/` | `/en/` | Inicio, Trabajos, Sobre mí y Contacto, como secciones de una sola página | Sí |
| `/trabajos/:slug/` | `/en/work/:slug/` | Caso de estudio | Sí, uno por caso publicado y por idioma |
| `/trabajos/este-portafolio/` | `/en/work/this-portfolio/` | Caso meta | Sí |
| `/trabajos/` | — | Redirección | No |
| `/sobre-mi/` | — | Redirección | No |
| `/contacto/` | — | Redirección | No |
| `404.html` | `404.html` (un solo archivo, con `lang` neutro y los dos idiomas) | No encontrada | No |

Las tres redirecciones existen solo en español, por compatibilidad con la versión anterior. En
inglés las secciones se alcanzan con anclas: `/en/#work`, `/en/#about`, `/en/#contact`.

Los `slug` de los casos son de cada idioma (el de inglés puede diferir). El emparejamiento entre
idiomas lo da el **nombre del archivo** del caso, igual en ambas carpetas de contenido (ver
`content-schema.md`).

Hospedaje estático (GitHub Pages): no hay detección de idioma ni redirecciones del servidor. Quien
entra a `/` ve español; quien entra a `/en/` ve inglés (FR-040).

## Secciones de `/` y de `/en/`

Cada sección es un `<section>` con `id` y encabezado propio, en este orden. Los `id` son los mismos
en los dos idiomas para que el selector de idioma pueda conservar la sección.

| `id` | Sección (es / en) | Encabezado |
|---|---|---|
| `inicio` | Inicio / Home | `h1` (único de la página) |
| `trabajos` | Trabajos / Work | `h2` |
| `sobre-mi` | Sobre mí y proceso / About and process | `h2` |
| `contacto` | Contacto / Contact | `h2` |

## Redirecciones (FR-032)

| Origen | Destino |
|---|---|
| `/trabajos/` | `/#trabajos` |
| `/sobre-mi/` | `/#sobre-mi` |
| `/contacto/` | `/#contacto` |

Son páginas prerenderizadas con redirección inmediata, URL canónica `/` y `noindex`, porque el
despliegue en GitHub Pages es estático.

## Elementos globales (FR-017)

Presentes en todas las rutas, en este orden de tabulación:

1. Enlace "Saltar al contenido" (en el idioma de la página), primer elemento enfocable, hacia
   `<main id="contenido">`.
2. Encabezado con navegación: Inicio, Trabajos, Sobre mí, Contacto. Son enlaces con ancla
   (`/#inicio`, `/#trabajos`, … o `/en/#inicio`, … en inglés) que funcionan sin JavaScript
   (FR-031).
3. En el encabezado, junto a la navegación: el selector de idioma y el botón de tema (FR-038,
   FR-040).
4. `<main id="contenido">`.
5. Pie con correo, perfil profesional, CV y la línea de crédito con enlace al caso meta. No repite
   la navegación entre secciones.

Selector de idioma (FR-040):

- Es un enlace (`<a hreflang lang>`) a la página equivalente en el otro idioma: desde `/#trabajos`
  lleva a `/en/#trabajos`; desde un caso, al mismo caso en el otro idioma (por el nombre de
  archivo).
- Muestra el código del otro idioma, «EN» o «ES» (aprobado en T086). Su nombre accesible empieza por
  ese código y añade el nombre del idioma en ese idioma ("EN English" / "ES Español"), con `lang`
  propio (SC 2.5.3).
- Funciona sin JavaScript. No hay detección automática del idioma.

Botón de tema (FR-036, FR-038):

- Es un `<button>` con ícono de sol (tema claro activo) o de luna (tema oscuro activo), con
  `aria-pressed` (oscuro activo o no) y un nombre accesible constante en el idioma de la página. Sin JavaScript no hace nada y el tema sigue al sistema; por eso se inserta solo con
  JavaScript activo.

Navegación y página actual (FR-031):

- En `/` y `/en/`, la sección visible se marca con `aria-current="location"`. Al llegar al final de
  la página queda marcada la última sección.
- En la página de un caso, ningún enlace se marca como actual, y cada enlace lleva a la sección de
  la página principal del mismo idioma (`/#<id>` o `/en/#<id>`).

Encabezado fijo (FR-028, FR-043):

- Tableta y escritorio: el encabezado completo queda fijo arriba.
- Teléfono (cambio aprobado el 2026-10-08 sobre la variante B de T086): la fila de arriba lleva el
  nombre y, a la derecha, el selector de idioma y el botón de tema, y se desplaza con la página;
  queda fija solo la fila del menú (`--header-height` de `61px`). Desde `sm` todo va en una sola
  fila, con la misma altura. En el documento el orden es siempre nombre, menú, idioma y tema.
- El documento reserva espacio arriba (`scroll-padding-top`) para que ni el control enfocado, ni su
  anillo de foco, ni el título de una sección queden tapados.

Desde cualquier ruta, Contacto queda a una acción en la navegación (SC-010).
Todo control tiene un área de toque o clic de al menos 44×44 px (FR-027).

## Sitemap y robots

- `sitemap.xml` lista exactamente las rutas marcadas "Sí", de los dos idiomas, con URL absoluta
  desde `SITE_URL` y las alternativas del otro idioma (SC-007).
- `robots.txt` permite todo y apunta al sitemap.
