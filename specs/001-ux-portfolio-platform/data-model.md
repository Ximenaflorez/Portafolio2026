# Data Model: Plataforma de portafolio UX/UI

Contenido estático: no hay persistencia ni escritura en tiempo de ejecución. Las reglas exactas de
cada campo están en [contracts/content-schema.md](./contracts/content-schema.md).

## Entidades

### CaseStudy

- **Campos**: `slug`, `type` (`product` | `meta`), `status` (`draft` | `published`), `order`,
  `featured`, `title`, `seo`, `summary`, `body`.
- **Relaciones**: pertenece a un `Profile`. Genera una `PublicPage`.
- **Validación**: resumen completo (FR-020), cuatro secciones en orden (FR-002), decisión con
  alternativa (FR-022), lo que no funcionó (FR-023), sin `[COMPLETAR]` al publicar (FR-026).

### Profile

- **Campos**: `name`, `role`, `valueProposition`, `email`, `linkedin`, `cv`.
- **Relaciones**: tiene 3 `CaseStudy` de tipo `product` y 1 de tipo `meta`.
- **Validación**: correo y URL válidos. El CV es opcional en tiempo de ejecución (caso límite de la
  spec).

### ModulePage

- **Campos**: `id` (`inicio` | `sobre-mi` | `contacto`), `seo`, `body`.
- **Relaciones**: genera una `PublicPage`.
- **Validación**: `sobre-mi` contiene forma de trabajar, métodos y problemas que busca (FR-025).

### PublicPage (derivada en el build)

- **Campos**: `path`, `title`, `description`, `canonical`, `inSitemap`.
- **Origen**: `CaseStudy` publicados, `ModulePage` y la ruta fija de Trabajos.
- **Validación**: título y descripción no vacíos (FR-014). El sitemap enumera exactamente las
  páginas con `inSitemap` (SC-007).

### DesignToken (SASS, no contenido)

- **Campos**: `name`, `category` (`color` | `typography` | `spacing`), `cssVariable`, `value`,
  `tailwindKey`.
- **Validación**: contraste por pareja (SC-008) y propagación (SC-006). Ver
  [contracts/tokens.md](./contracts/tokens.md).

## Transiciones de estado

```text
CaseStudy: draft ──(sin [COMPLETAR] y validación completa)──▶ published
```

- `draft`: no genera ruta, no entra en Trabajos, Inicio ni el sitemap.
- `published`: el build falla si el caso no pasa la validación completa.
- Publicar el sitio exige 3 casos `product` y 1 `meta` en `published` (FR-001).
