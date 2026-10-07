# Contract: Rutas públicas

Todas las rutas se prerenderizan. Cada una MUST exponer `<title>`, `<meta name="description">`,
URL canónica, un único `<h1>` y `lang="es"` en el documento (FR-014).

| Ruta | Módulo | Fuente de contenido | En sitemap |
|---|---|---|---|
| `/` | Inicio | `pages/inicio.md`, `profile.md`, casos `featured` | Sí |
| `/trabajos/` | Trabajos | casos `product` publicados | Sí |
| `/trabajos/:slug/` | Caso de estudio | `cases/<slug>.md` con `type: product` | Sí, uno por caso publicado |
| `/trabajos/este-portafolio/` | Caso meta | `cases/este-portafolio.md` | Sí |
| `/sobre-mi/` | Sobre mí y proceso | `pages/sobre-mi.md` | Sí |
| `/contacto/` | Contacto | `pages/contacto.md`, `profile.md` | Sí |
| `404.html` | No encontrada | fija | No |

## Elementos globales (FR-017)

Presentes en todas las rutas, en este orden de tabulación:

1. Enlace "Saltar al contenido", primer elemento enfocable, hacia `<main id="contenido">`.
2. Encabezado con navegación: Inicio, Trabajos, Sobre mí, Contacto. La página actual se marca con
   `aria-current="page"`.
3. `<main id="contenido">`.
4. Pie con correo y perfil profesional.

Desde cualquier ruta, Contacto queda a una acción en la navegación (SC-010).

## Sitemap y robots

- `sitemap.xml` lista exactamente las rutas marcadas "Sí" con URL absoluta desde `SITE_URL`
  (SC-007).
- `robots.txt` permite todo y apunta al sitemap.
