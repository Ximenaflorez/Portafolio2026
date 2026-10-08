# Data Model: Plataforma de portafolio UX/UI

Contenido estático: no hay persistencia ni escritura en tiempo de ejecución. Las reglas exactas de
cada campo están en [contracts/content-schema.md](./contracts/content-schema.md).

## Entidades

### CaseStudy

- **Campos**: `lang` (`es` | `en`, dado por la carpeta), `slug`, `type` (`product` | `meta`),
  `status` (`draft` | `published`), `order`, `title`, `seo`, `summary`, `body`. `order` fija el orden
  en la sección Trabajos (FR-019).
- **Relaciones**: pertenece a un `Profile`. Genera una `PublicPage`. Se empareja con el mismo caso
  del otro idioma por el nombre de archivo (FR-042).
- **Validación**: resumen completo (FR-020), cuatro secciones en orden (FR-002), decisión con
  alternativa (FR-022), lo que no funcionó (FR-023), sin `[COMPLETAR]` al publicar (FR-026),
  anonimizado (FR-030, revisión manual antes de publicar).

### Profile

- **Campos**: `lang`, `name`, `role`, `valueProposition`, `email`, `linkedin`, `cv`. Hay un perfil
  por idioma.
- **Relaciones**: tiene 3 `CaseStudy` de tipo `product` y 1 de tipo `meta`.
- **Validación**: correo y URL válidos. El CV es opcional en tiempo de ejecución (caso límite de la
  spec).

### ModulePage

- **Campos**: `lang`, `id` (`inicio` | `trabajos` | `sobre-mi` | `contacto`), `seo` (solo
  `inicio`), `body`.
- **Relaciones**: genera una `PublicPage`.
- **Validación**: `sobre-mi` contiene forma de trabajar, métodos y problemas que busca (FR-025).

### PublicPage (derivada en el build)

- **Campos**: `lang`, `path`, `title`, `description`, `canonical`, `alternate` (la ruta equivalente
  en el otro idioma), `inSitemap`.
- **Origen**: `CaseStudy` publicados y la página `/` (formada por las cuatro `ModulePage`). Las
  redirecciones `/trabajos/`, `/sobre-mi/` y `/contacto/` no son `PublicPage`.
- **Validación**: título y descripción no vacíos (FR-014). El sitemap enumera exactamente las
  páginas con `inSitemap` (SC-007).

### DesignToken (SASS, no contenido)

- **Campos**: `name`, `category` (`color` | `typography` | `spacing`), `cssVariable`, `value`
  (los de color, uno por tema: `light` y `dark`), `tailwindKey`.
- **Validación**: contraste por pareja (SC-008) y propagación (SC-006). Ver
  [contracts/tokens.md](./contracts/tokens.md).

## Transiciones de estado

```text
CaseStudy: draft ──(sin [COMPLETAR] y validación completa)──▶ published
```

- `draft`: no genera ruta, no entra en la sección Trabajos ni en el sitemap.
- `published`: el build falla si el caso no pasa la validación completa.
- Publicar el sitio exige 3 casos `product` y 1 `meta` en `published`, en cada idioma (FR-001,
  FR-042). Un caso `published` en un idioma sin su par `published` en el otro hace fallar el build.
