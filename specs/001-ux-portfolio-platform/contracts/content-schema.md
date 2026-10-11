# Contract: Esquema de contenido

Los archivos viven en `src/content/`. El build valida cada archivo con `zod` y falla ante cualquier
violación. Los borradores de redacción viven en `specs/001-ux-portfolio-platform/content/`.

## Idiomas (FR-039, FR-042)

El contenido está en dos carpetas con la misma estructura y los mismos nombres de archivo. El
responsable redacta ambas; no hay traducción automática.

```text
src/content/
├── es/
│   ├── profile.md
│   ├── pages/{inicio,trabajos,sobre-mi,contacto}.md
│   └── cases/{caso-01,caso-02,caso-03,este-portafolio}.md
├── en/
│   ├── profile.md
│   ├── pages/{inicio,trabajos,sobre-mi,contacto}.md
│   └── cases/{caso-01,caso-02,caso-03,este-portafolio}.md
└── ui/{es,en}.json        # textos de la interfaz: menú, botones, pie, etiquetas accesibles
```

Reglas de paridad (el build falla si se incumplen):

- Cada archivo de `es/` tiene su par con el mismo nombre en `en/`, y al revés. El nombre de archivo
  es el vínculo entre los dos idiomas: el selector de idioma lleva al par (FR-040).
- Un par comparte `type`, `status` y `order`. `slug`, `title`, `seo` y `summary` son de cada idioma.
- Un caso `published` en un idioma exige su par `published` en el otro.
- `ui/es.json` y `ui/en.json` tienen exactamente las mismas claves, sin valores vacíos.
- Los encabezados `##` y las etiquetas de cada caso van en el idioma de su carpeta (ver abajo).

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
| `summary.productType` | string | Obligatorio si `type: product`; se muestra en la página del caso |
| `summary.sector` | string | Obligatorio en `product` y en `meta`; rubro del caso (p. ej. Fintech, ATS, Research, Design system), el chip de su tarjeta en Trabajos |

Cuerpo: es el cuerpo de `content/case-template.md` sin el bloque de resumen, que pasa al
frontmatter. MUST contener estos encabezados `##`, en este orden. Se acepta un prefijo numérico
como `1.`:

| # | Español (`es/`) | Inglés (`en/`) |
|---|---|---|
| 1 | `Problema inicial` | `Initial problem` |
| 2 | `Investigación y datos de usuario` | `Research and user data` |
| 3 | `Arquitectura de la solución` | `Solution architecture` |
| 4 | `Resultados y aprendizajes` | `Results and learnings` |

Las etiquetas obligatorias de las reglas de publicación también tienen su versión en inglés:
`**Decisiones clave:**` = `**Key decisions:**`, `**Lo que no funcionó:**` = `**What didn't work:**`
y `**Lo que haría distinto:**` = `**What I would do differently:**`. El espacio de plantilla sin
completar en inglés es `[COMPLETAR` también (el marcador no cambia de idioma).

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
  publicado (FR-001), en cada idioma.

## Perfil (`src/content/<lang>/profile.md`)

| Campo | Tipo | Regla |
|---|---|---|
| `name` | string | Obligatorio |
| `role` | string | Obligatorio |
| `valueProposition` | string | Obligatorio, 1 a 160 caracteres |
| `email` | string | Obligatorio, correo válido |
| `linkedin` | URL | Obligatorio |
| `cv` | ruta o URL | Obligatorio; si falta el archivo, el build avisa y Contacto oculta solo ese enlace |

### Trayectoria (FR-044)

La trayectoria se declara en el mismo `profile.md`, bajo la clave `career`, que agrupa las entradas
en `experience`, `education` y `certificates`. Cada grupo es opcional y, si no tiene entradas, no se
muestra. Las entradas van de la más reciente a la más antigua. Los nombres de empresas e
instituciones son reales: la regla de anonimato de FR-030 no aplica aquí.

| Campo de la entrada | Aplica a | Regla |
|---|---|---|
| `title` | todos | Obligatorio: rol, título o nombre del certificado |
| `organization` | todos | Obligatorio: empresa, institución o emisor (nombre real) |
| `from` | todos | Obligatorio: `AAAA` o `AAAA-MM` |
| `to` | `experience` | `AAAA`, `AAAA-MM` o ausente (= actualidad) |
| `summary` | `experience` | Opcional, una línea de logro |
| `tools` | `experience` | Opcional, lista de nombres de herramientas (texto corto, sin traducir; se muestran como chips) |
| `credentialUrl` | `certificates` | Opcional, URL válida |

Las entradas deben existir en `es/` y en `en/` en el mismo orden y con las mismas fechas y
`credentialUrl`; cambian los textos (`title`, `organization` si se traduce, `summary`). Sin
`[COMPLETAR` al publicar (FR-026). *(Forma de los campos pendiente de confirmar con la aprobación de
T066.)*

## Páginas de módulo (`src/content/<lang>/pages/*.md`)

`inicio.md`, `trabajos.md`, `sobre-mi.md` y `contacto.md` son las cuatro secciones de `/` (cuerpo
Markdown; `trabajos.md` puede no tener cuerpo). Solo `inicio.md` lleva `seo.title` y
`seo.description`, que son los de la página `/`; las demás secciones no tienen SEO propio.
`sobre-mi.md` MUST contener `## Forma de trabajar` y `## Métodos` (FR-025); en `en/`:
`## Way of working` y `## Methods`. No lleva `## Problemas que busco` ni `## Herramientas`; las
herramientas van en la trayectoria (FR-044).
