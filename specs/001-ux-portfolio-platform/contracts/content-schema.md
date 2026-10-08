# Contract: Esquema de contenido

Los archivos viven en `src/content/`. El build valida cada archivo con `zod` y falla ante cualquier
violación. Los borradores de redacción viven en `specs/001-ux-portfolio-platform/content/`.

## Caso (`src/content/cases/*.md`)

Frontmatter:

| Campo | Tipo | Regla |
|---|---|---|
| `slug` | string | Obligatorio, minúsculas y guiones, único |
| `type` | `product` \| `meta` | Obligatorio |
| `status` | `draft` \| `published` | Obligatorio |
| `order` | entero ≥ 1 | Obligatorio y único por tipo; orden en la sección Trabajos |
| `title` | string | Obligatorio, 1 a 80 caracteres |
| `seo.title` | string | Obligatorio, 1 a 60 caracteres |
| `seo.description` | string | Obligatorio, 50 a 160 caracteres |
| `summary.product` | string | Obligatorio |
| `summary.role` | string | Obligatorio |
| `summary.team` | string | Obligatorio si `type: product` |
| `summary.duration` | string | Obligatorio |
| `summary.keyResult` | string | Obligatorio |
| `summary.indexLine` | string | Obligatorio si `type: product`; 1 a 120 caracteres |
| `summary.productType` | string | Obligatorio si `type: product` |

Cuerpo: es el cuerpo de `content/case-template.md` sin el bloque de resumen, que pasa al
frontmatter. MUST contener estos encabezados `##`, en este orden. Se acepta un prefijo numérico
como `1.`:

1. `Problema inicial`
2. `Investigación y datos de usuario`
3. `Arquitectura de la solución`
4. `Resultados y aprendizajes`

Reglas de publicación (`status: published`):

- Ningún campo ni el cuerpo contiene `[COMPLETAR` (FR-026).
- `Arquitectura de la solución` contiene la etiqueta `**Decisiones clave:**` con al menos una
  decisión, su motivo y la alternativa descartada (FR-022).
- `Resultados y aprendizajes` contiene `**Lo que no funcionó:**` o `**Lo que haría distinto:**`
  con texto (FR-023).
- Un caso `meta` no exige las etiquetas de equipo, índice ni tipo de producto.
- El anonimato (FR-030) no se puede validar del todo de forma automática. Se revisa a mano antes de
  pasar un caso a `published`.
- Toda imagen tiene texto alternativo no vacío (FR-016).
- Para publicar el sitio MUST haber exactamente 3 casos `product` publicados y 1 caso `meta`
  publicado (FR-001).

## Perfil (`src/content/profile.md`)

| Campo | Tipo | Regla |
|---|---|---|
| `name` | string | Obligatorio |
| `role` | string | Obligatorio |
| `valueProposition` | string | Obligatorio, 1 a 160 caracteres |
| `email` | string | Obligatorio, correo válido |
| `linkedin` | URL | Obligatorio |
| `cv` | ruta o URL | Obligatorio; si falta el archivo, el build avisa y Contacto oculta solo ese enlace |

## Páginas de módulo (`src/content/pages/*.md`)

`inicio.md`, `trabajos.md`, `sobre-mi.md` y `contacto.md` son las cuatro secciones de `/` (cuerpo
Markdown; `trabajos.md` puede no tener cuerpo). Solo `inicio.md` lleva `seo.title` y
`seo.description`, que son los de la página `/`; las demás secciones no tienen SEO propio.
`sobre-mi.md` MUST contener `## Forma de trabajar`, `## Métodos` y `## Problemas que busco`
(FR-025).
