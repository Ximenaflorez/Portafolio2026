# Contract: Rutas públicas

Todas las rutas se prerenderizan. Cada una MUST exponer `<title>`, `<meta name="description">`,
URL canónica, un único `<h1>` y `lang="es"` en el documento (FR-014).

| Ruta | Módulo | Fuente de contenido | En sitemap |
|---|---|---|---|
| `/` | Inicio, Trabajos, Sobre mí y Contacto, como secciones de una sola página | `pages/inicio.md`, `pages/trabajos.md`, `pages/sobre-mi.md`, `pages/contacto.md`, `profile.md`, los casos `product` por `order` | Sí |
| `/trabajos/:slug/` | Caso de estudio | `cases/<slug>.md` con `type: product` | Sí, uno por caso publicado |
| `/trabajos/este-portafolio/` | Caso meta | `cases/este-portafolio.md` | Sí |
| `/trabajos/` | Redirección | — | No |
| `/sobre-mi/` | Redirección | — | No |
| `/contacto/` | Redirección | — | No |
| `404.html` | No encontrada | fija | No |

## Secciones de `/`

Cada sección es un `<section>` con `id` y encabezado propio, en este orden:

| `id` | Sección | Encabezado |
|---|---|---|
| `inicio` | Inicio | `h1` (único de la página) |
| `trabajos` | Trabajos | `h2` |
| `sobre-mi` | Sobre mí y proceso | `h2` |
| `contacto` | Contacto | `h2` |

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

1. Enlace "Saltar al contenido", primer elemento enfocable, hacia `<main id="contenido">`.
2. Encabezado con navegación: Inicio, Trabajos, Sobre mí, Contacto. Son enlaces con ancla
   (`/#inicio`, `/#trabajos`, …) que funcionan sin JavaScript (FR-031).
3. `<main id="contenido">`.
4. Pie con correo, perfil profesional, CV, la navegación repetida y la línea de crédito con enlace
   al caso meta.

Navegación y página actual (FR-031):

- En `/`, la sección visible se marca con `aria-current="location"`. Al llegar al final de la
  página queda marcada la última sección.
- En la página de un caso, ningún enlace se marca como actual, y cada enlace lleva a `/#<id>`.

Encabezado fijo (FR-028):

- Tableta y escritorio: el encabezado completo queda fijo arriba.
- Teléfono: el nombre se desplaza y solo queda fija la fila de la navegación.
- El documento reserva espacio arriba (`scroll-padding-top`) para que ni el control enfocado, ni su
  anillo de foco, ni el título de una sección queden tapados.

Desde cualquier ruta, Contacto queda a una acción en la navegación (SC-010).
Todo control tiene un área de toque o clic de al menos 44×44 px (FR-027).

## Sitemap y robots

- `sitemap.xml` lista exactamente las rutas marcadas "Sí" con URL absoluta desde `SITE_URL`
  (SC-007).
- `robots.txt` permite todo y apunta al sitemap.
