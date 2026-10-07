---

description: "Lista de tareas de la plataforma de portafolio UX/UI"
---

# Tasks: Plataforma de portafolio UX/UI

**Input**: Design documents from `specs/001-ux-portfolio-platform/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidas por decisión del responsable: accesibilidad y tokens. Se escriben antes de implementar y MUST fallar primero.

**Organization**: Primero la infraestructura (tokens, accesibilidad, contenido, SEO), sin pantallas. Después una fase por historia de usuario.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ir en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario (US1, US2, US3)
- **⛔ APROBACIÓN**: Tarea de compuerta. Nada que dependa de ella empieza sin la aprobación explícita del responsable (Constitución, principio V)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Proyecto vacío y herramientas, sin ninguna pantalla

- [ ] T001 Crear el proyecto React Router 7 en modo framework sobre Vite con TypeScript, con `appDirectory: "src"` y `prerender` activado, en `react-router.config.ts`, `vite.config.ts` y `package.json`
- [ ] T002 Fijar Node.js 22 LTS en `.nvmrc` y en `engines` de `package.json`
- [ ] T003 [P] Instalar SASS y Tailwind CSS 3.4 con PostCSS en `postcss.config.js`
- [ ] T004 [P] Instalar `@fontsource/manrope` y `@fontsource/inter`, solo los pesos 400 y 600 de Inter y 600 y 700 de Manrope, en `package.json`
- [ ] T005 [P] Configurar ESLint y Prettier para TypeScript y React en `eslint.config.js` y `.prettierrc`
- [ ] T006 [P] Configurar Stylelint con prohibición de colores y medidas literales fuera de `src/styles/tokens/` en `.stylelintrc.json`
- [ ] T007 [P] Configurar Vitest con jsdom, Testing Library y `vitest-axe` en `vitest.config.ts` y `tests/setup.ts`
- [ ] T008 [P] Configurar Playwright con `@axe-core/playwright` y proyectos de 360, 768 y 1280px en `playwright.config.ts`
- [ ] T009 [P] Configurar Lighthouse CI con umbral 0.95 en Rendimiento, Accesibilidad y Buenas prácticas, en teléfono y escritorio, en `lighthouserc.json`
- [ ] T010 Crear las carpetas vacías `src/components/atoms/`, `molecules/`, `organisms/`, `templates/` y `pages/` con un `.gitkeep` en cada una
- [ ] T011 Definir los scripts `dev`, `build`, `preview`, `lint`, `test:unit`, `test:e2e` y `lighthouse` en `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tokens, accesibilidad global, contenido y SEO. Bloquea todas las historias.

**⚠️ CRITICAL**: Ninguna historia empieza hasta cerrar esta fase.

### Pruebas de tokens y de arquitectura (escribir primero, deben fallar)

- [ ] T012 [P] Escribir la prueba de contraste que compila `src/styles/main.scss` con la API de `sass`, lee las variables de `:root` y mide cada pareja de `contracts/tokens.md` (4.5:1 texto, 3:1 foco y bordes de control) en `tests/unit/tokens/contrast.test.ts`
- [ ] T013 [P] Escribir la prueba de propagación: compila con un valor alterado de `--color-primary` y comprueba que cambia el CSS resuelto de `bg-primary` en `tests/unit/tokens/propagation.test.ts`
- [ ] T014 [P] Escribir la prueba que rechaza clases arbitrarias de Tailwind (`[#...]`, `[13px]`, `[1.1rem]`) y estilos en línea con valores visuales en `src/components/` en `tests/unit/tokens/no-hardcoded.test.ts`
- [ ] T015 [P] Escribir la prueba de capas: ningún archivo de una capa importa una capa superior (atoms < molecules < organisms < templates < pages) en `tests/unit/architecture/layers.test.ts`

### Tokens (SASS como origen, Tailwind como consumidor)

- [ ] T016 [P] Definir los 13 tokens de color como canales RGB en `src/styles/tokens/_color.scss`, con los valores exactos de `contracts/tokens.md`
- [ ] T017 [P] Definir familias (Manrope titulares, Inter texto) y los 7 pasos de la escala 1.25 en `rem` en `src/styles/tokens/_typography.scss`
- [ ] T018 [P] Definir el espaciado (4px medio paso y múltiplos de 8px: 0, 4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 128) en `src/styles/tokens/_spacing.scss`
- [ ] T019 Emitir todos los tokens como variables CSS en `:root`, incluidos `--duration-state: 200ms` y `--target-min: 44px`, desde `src/styles/tokens/_index.scss` y `src/styles/main.scss`
- [ ] T020 Configurar `tailwind.config.ts` para **reemplazar** `colors`, `fontFamily`, `fontSize` y `spacing` con `rgb(var(--color-*) / <alpha-value>)` y `var(--*)`, según `contracts/tokens.md`
- [ ] T021 Ejecutar T012 a T014 y confirmar que pasan

### Accesibilidad global

- [ ] T022 [P] Escribir el reset con `box-sizing` y márgenes a cero, y fijar `--duration-state: 0ms` con `prefers-reduced-motion: reduce`, en `src/styles/base/_reset.scss`
- [ ] T023 [P] Definir `:focus-visible` global con outline de 2px `rgb(var(--color-focus))` y `outline-offset: 2px`, y `:focus:not(:focus-visible)` sin outline, en `src/styles/base/_focus.scss`
- [ ] T024 [P] Definir la tipografía base (cuerpo Inter paso 0, encabezados Manrope) en `src/styles/base/_typography.scss`
- [ ] T025 Crear el documento raíz con `lang="es"`, carga de Fontsource, precarga de Inter y `main.scss` en `src/root.tsx`

### Contenido

- [ ] T026 [P] Escribir pruebas del esquema: falla un caso `published` con `[COMPLETAR`, sin las cuatro secciones, sin `**Decisiones clave:**` o sin `**Lo que no funcionó:**` / `**Lo que haría distinto:**`, o con una imagen sin alt; pasa un `draft` incompleto, en `tests/unit/content/schema.test.ts`
- [ ] T027 Implementar los esquemas `zod` de caso, perfil y página de módulo con los límites de `contracts/content-schema.md` (`seo.title` 1 a 60, `seo.description` 50 a 160, `title` 1 a 80, `summary.indexLine` 1 a 120) en `src/content/schema.ts`
- [ ] T028 Implementar la lectura con `gray-matter`, la validación y el filtro de `published`; el build falla si no hay exactamente 3 casos `product` y 1 `meta` publicados cuando `REQUIRE_COMPLETE_CONTENT=true`, en `src/content/load.ts`
- [ ] T029 [P] Migrar los borradores `specs/001-ux-portfolio-platform/content/case-01.md`, `case-02.md`, `case-03.md` y `case-meta.md` a `src/content/cases/` con frontmatter y `status: draft`; `case-meta.md` pasa a `este-portafolio.md`
- [ ] T030 [P] Crear `src/content/profile.md` y `src/content/pages/inicio.md`, `sobre-mi.md` y `contacto.md` desde `specs/001-ux-portfolio-platform/content/modules.md`, con `[COMPLETAR]` donde falten datos

### SEO e infraestructura de rutas

- [ ] T031 [P] Implementar el helper de título, descripción y URL canónica con `SITE_URL` y `BASE_PATH` en `src/lib/seo.ts`
- [ ] T032 Declarar el mapa de rutas de `contracts/routes.md` sin componentes visuales (cada ruta exporta `meta` y `loader`) en `src/routes.ts`
- [ ] T033 [P] Implementar la generación de `sitemap.xml` desde las rutas publicadas en `scripts/generate-sitemap.ts`, y `public/robots.txt`
- [ ] T034 [P] Configurar CI (lint, test:unit, build) en `.github/workflows/ci.yml`

**Checkpoint**: tokens, foco, contenido y SEO listos. Todavía no existe ninguna pantalla.

---

## Phase 3: Elementos globales (bloquea US1, US2 y US3)

**Goal**: Encabezado, navegación, enlace para saltar al contenido y pie, presentes en todas las rutas (FR-017)

- [ ] T035 ⛔ APROBACIÓN: presentar la propuesta de encabezado no fijo, navegación (incluido el comportamiento en teléfono), enlace para saltar al contenido y pie, y obtener aprobación explícita
- [ ] T036 [P] Escribir prueba axe y de teclado para `SkipLink`, `NavLink` y `TextLink` en `tests/unit/components/atoms.test.tsx`
- [ ] T037 [P] Crear el átomo `SkipLink` hacia `#contenido` en `src/components/atoms/SkipLink.tsx`
- [ ] T038 [P] Crear el átomo `TextLink` con estados de puntero, presión y foco desde tokens en `src/components/atoms/TextLink.tsx`
- [ ] T039 [P] Crear el átomo `NavLink` con `aria-current="page"` en `src/components/atoms/NavLink.tsx`
- [ ] T040 Crear el organismo `SiteHeader` con la navegación Inicio, Trabajos, Sobre mí y Contacto en `src/components/organisms/SiteHeader.tsx`
- [ ] T041 Crear el organismo `SiteFooter` con correo y perfil profesional en `src/components/organisms/SiteFooter.tsx`
- [ ] T042 Crear el template `SiteTemplate` (SkipLink, SiteHeader, `<main id="contenido">`, SiteFooter) en `src/components/templates/SiteTemplate.tsx`

**Checkpoint**: estructura global aprobada y probada.

---

## Phase 4: User Story 1 - Evaluar el pensamiento de producto (Priority: P1) 🎯 MVP

**Goal**: Trabajos, los tres casos de producto y el caso meta, con resumen y arco narrativo

**Independent Test**: Con contenido de prueba publicado, un evaluador abre cada caso, lee el resumen y señala las cuatro partes; puede volver a Trabajos

### Tests for User Story 1

- [ ] T043 [P] [US1] Escribir prueba e2e: desde `/trabajos/` se llega a cada caso y se vuelve; cada caso muestra resumen y las cuatro secciones en orden, en `tests/e2e/cases.spec.ts`
- [ ] T044 [P] [US1] Escribir prueba e2e con axe sobre `/trabajos/` y cada caso en `tests/e2e/a11y-cases.spec.ts`
- [ ] T045 [P] [US1] Crear contenido de prueba publicado (3 casos y meta) en `tests/fixtures/content/`

### Implementation for User Story 1

- [ ] T046 [US1] ⛔ APROBACIÓN: presentar la propuesta de la página de caso (resumen, cuatro secciones, apoyo visual) y del índice de Trabajos, y obtener aprobación explícita
- [ ] T047 [P] [US1] Crear los átomos `Heading` (niveles 1 a 4 con la escala) y `Text` en `src/components/atoms/Heading.tsx` y `Text.tsx`
- [ ] T048 [P] [US1] Crear el átomo `Figure` con alt obligatorio y pie de imagen en `src/components/atoms/Figure.tsx`
- [ ] T049 [P] [US1] Crear la molécula `CaseSummary` (producto, rol, equipo, duración, resultado clave) como lista de definiciones en `src/components/molecules/CaseSummary.tsx`
- [ ] T050 [P] [US1] Crear la molécula `CaseCard` (título, rol, tipo de producto, línea de resultado, enlace con texto descriptivo) en `src/components/molecules/CaseCard.tsx`
- [ ] T051 [US1] Crear el organismo `CaseBody` que renderiza Markdown con `react-markdown` mapeado a `Heading`, `Text`, `TextLink` y `Figure` en `src/components/organisms/CaseBody.tsx`
- [ ] T052 [US1] Crear el organismo `CaseIndex` con la lista de `CaseCard` y el acceso al caso meta en `src/components/organisms/CaseIndex.tsx`
- [ ] T053 [US1] Crear el template `CaseTemplate` (CaseSummary, CaseBody, regreso a Trabajos) en `src/components/templates/CaseTemplate.tsx`
- [ ] T054 [US1] Crear las pages `WorksPage` y `CasePage` en `src/components/pages/WorksPage.tsx` y `CasePage.tsx`
- [ ] T055 [US1] Conectar `/trabajos/`, `/trabajos/:slug/` y `/trabajos/este-portafolio/` con loader y meta en `src/routes/`
- [ ] T056 [US1] Ejecutar T043 y T044 y confirmar que pasan

**Checkpoint**: US1 funciona y se valida sola.

---

## Phase 5: User Story 2 - Confiar en la calidad de la experiencia (Priority: P2)

**Goal**: Teclado, estados, responsive, zoom y propagación de tokens comprobados en todas las rutas existentes

**Independent Test**: Solo con teclado se recorren navegación y casos con foco visible; sin desborde en 360, 768 y 1280px ni con texto al 200%

### Tests for User Story 2

- [ ] T057 [P] [US2] Escribir prueba e2e de teclado: orden de Tab, foco visible (outline presente y sin ningún elemento fijo encima, FR-028), sin trampas, y cada control con área de al menos 44×44 px (FR-027), en todas las rutas, en `tests/e2e/keyboard.spec.ts`
- [ ] T058 [P] [US2] Escribir prueba e2e de responsive: sin desborde horizontal en 320, 360, 768 y 1280px y con texto al 200%, en `tests/e2e/responsive.spec.ts`
- [ ] T059 [P] [US2] Escribir prueba e2e de estados: el estilo al pasar el puntero, al presionar y con foco difiere del de reposo en `TextLink`, `NavLink` y `CaseCard`; ninguna transición dura más de 200 ms y ninguna existe con movimiento reducido (FR-029), en `tests/e2e/states.spec.ts`

### Implementation for User Story 2

- [ ] T060 [US2] Corregir en los componentes de las fases 3 y 4 cualquier fallo de T057 a T059, usando solo tokens
- [ ] T061 [US2] Confirmar que ninguna información de un caso depende del estado al pasar el puntero (FR-008) y documentarlo en `tests/e2e/states.spec.ts`
- [ ] T062 [US2] Ejecutar T012 a T015 y T057 a T059 y confirmar que pasan

**Checkpoint**: US1 y US2 funcionan y se validan.

---

## Phase 6: User Story 3 - Encontrar el perfil y contactarlo (Priority: P3)

**Goal**: Inicio, Sobre mí y proceso, Contacto, 404, y encontrabilidad completa

**Independent Test**: Desde Inicio se identifica el rol y el contacto; cada página tiene título y descripción propios; el sitemap lista exactamente las páginas publicadas

### Tests for User Story 3

- [ ] T063 [P] [US3] Escribir prueba e2e de SEO: título, descripción, canónica, un solo `h1` y `lang="es"` por ruta; el sitemap coincide con las rutas publicadas, en `tests/e2e/seo.spec.ts`
- [ ] T064 [P] [US3] Escribir prueba e2e: desde cualquier ruta, Contacto queda a una acción, y muestra correo, perfil profesional y CV (el enlace al CV se oculta si falta el archivo), en `tests/e2e/contact.spec.ts`
- [ ] T065 [P] [US3] Escribir prueba e2e con axe sobre `/`, `/sobre-mi/`, `/contacto/` y la 404 en `tests/e2e/a11y-pages.spec.ts`

### Implementation for User Story 3

- [ ] T066 [US3] ⛔ APROBACIÓN: presentar las propuestas de Inicio, Sobre mí y proceso, Contacto y 404, y obtener aprobación explícita de cada una
- [ ] T067 [P] [US3] Crear la molécula `ContactList` (correo, perfil profesional, CV) en `src/components/molecules/ContactList.tsx`
- [ ] T068 [P] [US3] Crear el organismo `ProfileIntro` (nombre, rol, propuesta de valor, llamado a contacto) en `src/components/organisms/ProfileIntro.tsx`
- [ ] T069 [P] [US3] Crear el organismo `HomeCases` con los 3 casos de producto ordenados por `order` en `src/components/organisms/HomeCases.tsx`
- [ ] T070 [US3] Crear el template `ContentTemplate` para páginas de módulo en `src/components/templates/ContentTemplate.tsx`
- [ ] T071 [US3] Crear las pages `HomePage`, `AboutPage`, `ContactPage` y `NotFoundPage` en `src/components/pages/`
- [ ] T072 [US3] Conectar `/`, `/sobre-mi/`, `/contacto/` y la 404 con loader y meta en `src/routes/`
- [ ] T073 [US3] Encadenar `scripts/generate-sitemap.ts` al final de `npm run build` en `package.json`
- [ ] T074 [US3] Ejecutar T063 a T065 y confirmar que pasan

**Checkpoint**: las tres historias funcionan y se validan.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T075 [P] Configurar el despliegue en GitHub Pages con `BASE_PATH` y `SITE_URL` como variables y `REQUIRE_COMPLETE_CONTENT=true`, en `.github/workflows/deploy.yml`
- [ ] T076 [P] Optimizar imágenes (dimensiones declaradas, carga diferida, formatos modernos) en `src/components/atoms/Figure.tsx`
- [ ] T077 Ejecutar `npm run lighthouse` y corregir hasta superar 95 en las tres categorías, en teléfono y escritorio
- [ ] T078 Completar el contenido real: ningún `[COMPLETAR]` en `src/content/`, revisar a mano el anonimato de cada caso (FR-030), y pasar los 4 casos a `status: published`
- [ ] T079 Ejecutar todos los escenarios de `quickstart.md`
- [ ] T080 Realizar los recorridos con evaluadores de SC-001, SC-009 y SC-010 (al menos 4 de 5) y una revisión con NVDA

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup; bloquea todo lo demás
- **Elementos globales (Phase 3)**: depende de Foundational y de la aprobación T035
- **US1 (Phase 4)**: depende de Phase 3 y de la aprobación T046
- **US2 (Phase 5)**: depende de Phase 4, porque prueba las rutas que ya existen
- **US3 (Phase 6)**: depende de Phase 3 y de la aprobación T066; puede ir en paralelo con US1
- **Polish (Phase 7)**: depende de las historias que se quieran publicar; T078 depende del contenido del responsable

### Within Each Phase

- Las pruebas se escriben y fallan antes de implementar
- Átomos, luego moléculas, organismos, templates y pages
- Ninguna tarea de componente visual empieza antes de su compuerta ⛔

### Parallel Opportunities

- Setup: T003 a T009
- Foundational: T012 a T015 juntas; T016 a T018 juntas; T022 a T024 juntas; T029 a T031 y T033 a T034
- Phase 3: T036 a T039
- US1: T043 a T045; T047 a T050
- US3: T063 a T065; T067 a T069

---

## Parallel Example: Foundational

```bash
Task: "Prueba de contraste en tests/unit/tokens/contrast.test.ts"
Task: "Prueba de propagación en tests/unit/tokens/propagation.test.ts"
Task: "Prueba anti valores sueltos en tests/unit/tokens/no-hardcoded.test.ts"
Task: "Prueba de capas en tests/unit/architecture/layers.test.ts"
```

---

## Implementation Strategy

### Infraestructura primero

1. Phase 1 y Phase 2: proyecto, tokens, foco, contenido y SEO, sin pantallas
2. **STOP**: revisar las pruebas de tokens y de capas en verde

### MVP (US1)

1. Aprobación T035, luego Phase 3
2. Aprobación T046, luego Phase 4
3. **STOP and VALIDATE**: los casos se leen y se recorren

### Entrega incremental

1. US2: calidad comprobada en lo que ya existe
2. US3: Inicio, Sobre mí, Contacto y SEO completo
3. Polish: contenido real, Lighthouse, despliegue

---

## Notes

- Las compuertas ⛔ son obligatorias y no se marcan sin tu aprobación explícita
- Commit al cerrar cada fase
- `[COMPLETAR]` en `draft` es válido; en `published` rompe el build
