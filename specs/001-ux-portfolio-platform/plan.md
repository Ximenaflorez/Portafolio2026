# Implementation Plan: Plataforma de portafolio UX/UI

**Branch**: `001-ux-portfolio-platform` | **Date**: 2026-10-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-ux-portfolio-platform/spec.md`

## Summary

Portafolio estático y prerenderizado con siete módulos, tres casos de producto y un caso meta.
La infraestructura va primero: tokens de diseño en SASS consumidos por Tailwind, foco y contraste
globales, pruebas automatizadas de accesibilidad y de tokens, y SEO por página. Las pantallas se
construyen solo después, una por una y con aprobación previa (principio V).

## Technical Context

**Language/Version**: TypeScript 5.x sobre Node.js 24 LTS

**Primary Dependencies**: React 19, Vite, React Router 7 en modo framework con prerender,
SASS (`sass`), Tailwind CSS 3.4, `gray-matter` y `zod` para el contenido, `react-markdown`,
Fontsource (Manrope e Inter)

**Storage**: Archivos Markdown con frontmatter en `src/content/`. Sin base de datos.

**Testing**: Vitest, Testing Library y `vitest-axe` para componentes; Playwright con
`@axe-core/playwright` para páginas y teclado; Lighthouse CI para el umbral de 95; prueba de
tokens que compila SASS y mide contraste.

**Target Platform**: Navegadores evergreen en teléfono, tableta y escritorio. Publicación estática
en GitHub Pages.

**Project Type**: Aplicación web estática (frontend único, sin backend)

**Performance Goals**: Más de 95 en Rendimiento, Accesibilidad y Buenas prácticas en vista de
teléfono y de escritorio (SC-004)

**Constraints**: WCAG 2.2 AA; sin valores visuales fuera de los tokens; sin pantallas sin
aprobación; HTML prerenderizado por ruta; fuentes alojadas en el propio sitio

**Scale/Scope**: 5 páginas públicas: `/` (con las secciones Inicio, Trabajos, Sobre mí y Contacto), 3 casos y el caso meta; más 3 redirecciones y la 404
más 404

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cómo lo cumple el plan | Estado |
|---|---|---|
| I. Stack | React y Vite (React Router 7 corre sobre Vite). SASS define tokens y estilos globales. Tailwind 3.4 consume esos tokens. Git. | Pasa |
| II. Tokens | Origen único en `src/styles/tokens/`. Tailwind reemplaza (no extiende) color, tipografía y espaciado, así que no hay valores por defecto disponibles. Prueba de propagación y prueba anti valores sueltos. | Pasa |
| III. Atomic Design | Cinco capas en `src/components/`. Las rutas solo montan pages. Prueba de dependencias entre capas. | Pasa |
| IV. Accesibilidad | Foco global con el token Focus (2px, separado). axe en componentes y páginas. Prueba de contraste de tokens. Recorridos de teclado en Playwright. | Pasa |
| V. Aprobación previa | Cada pantalla se propone como prototipo en `/prototipos/`, sin publicar ni entrar en el sitemap, y se borra al aprobarse. Las tareas definitivas quedan bloqueadas por esa compuerta. | Pasa |

Re-check post-design (Phase 1): Pasa. Ningún artefacto de diseño introduce una pantalla ni un valor
visual nuevo.

## Project Structure

### Documentation (this feature)

```text
specs/001-ux-portfolio-platform/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── tokens.md
│   ├── content-schema.md
│   └── routes.md
├── content/              # Borradores con espacios [COMPLETAR]
├── checklists/
└── tasks.md              # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── root.tsx                    # Documento HTML, idioma, fuentes, estilos globales
├── routes.ts                   # Mapa de rutas (contracts/routes.md)
├── routes/                     # Módulos de ruta: loader + meta, montan una page
├── styles/
│   ├── tokens/                 # _color.scss, _typography.scss, _spacing.scss
│   ├── base/                   # _reset.scss, _focus.scss, _typography.scss
│   └── main.scss
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│   └── pages/
├── content/
│   ├── cases/                  # case-01.md, case-02.md, case-03.md, este-portafolio.md
│   ├── pages/                  # inicio.md, sobre-mi.md, contacto.md
│   ├── profile.md
│   ├── schema.ts               # Esquemas zod (contracts/content-schema.md)
│   └── load.ts                 # Lectura, validación y filtro de publicados
└── lib/
    └── seo.ts                  # Título, descripción, URL canónica

public/
├── robots.txt
└── cv.pdf                      # Lo aporta el responsable

scripts/
└── generate-sitemap.ts         # Se ejecuta tras el build

tests/
├── unit/                       # tokens, contenido, capas, componentes con axe
└── e2e/                        # páginas con axe, teclado, responsive, SEO

tailwind.config.ts
react-router.config.ts
vite.config.ts
playwright.config.ts
lighthouserc.json
.github/workflows/              # ci.yml y deploy.yml (GitHub Pages)
```

**Structure Decision**: Frontend único. `appDirectory` de React Router apunta a `src/`. Las
carpetas de Atomic Design siguen el principio III. El contenido vive fuera de los componentes
para que las pages solo combinen templates con datos.

## Complexity Tracking

Sin violaciones de la constitución que justificar.
