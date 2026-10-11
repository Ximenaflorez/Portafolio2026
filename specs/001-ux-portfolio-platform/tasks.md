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

- [X] T001 Crear el proyecto React Router 7 en modo framework sobre Vite con TypeScript, con `appDirectory: "src"` y `prerender` activado, en `react-router.config.ts`, `vite.config.ts` y `package.json`
- [X] T002 Fijar Node.js 24 LTS en `.nvmrc` y en `engines` de `package.json`
- [X] T003 [P] Instalar SASS y Tailwind CSS 3.4 con PostCSS en `postcss.config.js`
- [X] T004 [P] Instalar `@fontsource/manrope` y `@fontsource/inter`, solo los pesos 400 y 600 de Inter y 600 y 700 de Manrope, en `package.json`
- [X] T005 [P] Configurar ESLint y Prettier para TypeScript y React en `eslint.config.js` y `.prettierrc`
- [X] T006 [P] Configurar Stylelint con prohibición de colores y medidas literales fuera de `src/styles/tokens/` en `.stylelintrc.json`
- [X] T007 [P] Configurar Vitest con jsdom, Testing Library y `vitest-axe` en `vitest.config.ts` y `tests/setup.ts`
- [X] T008 [P] Configurar Playwright con `@axe-core/playwright` y proyectos de 360, 768 y 1280px en `playwright.config.ts`
- [X] T009 [P] Configurar Lighthouse CI con umbral 0.95 en Rendimiento, Accesibilidad y Buenas prácticas, en teléfono y escritorio, en `lighthouserc.json`
- [X] T010 Crear las carpetas vacías `src/components/atoms/`, `molecules/`, `organisms/`, `templates/` y `pages/` con un `.gitkeep` en cada una
- [X] T011 Definir los scripts `dev`, `build`, `preview`, `lint`, `test:unit`, `test:e2e` y `lighthouse` en `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tokens, accesibilidad global, contenido y SEO. Bloquea todas las historias.

**⚠️ CRITICAL**: Ninguna historia empieza hasta cerrar esta fase.

### Pruebas de tokens y de arquitectura (escribir primero, deben fallar)

- [X] T012 [P] Escribir la prueba de contraste que compila `src/styles/main.scss` con la API de `sass`, lee las variables de `:root` y mide cada pareja de `contracts/tokens.md` (4.5:1 texto, 3:1 foco y bordes de control) en `tests/unit/tokens/contrast.test.ts`
- [X] T013 [P] Escribir la prueba de propagación: compila con un valor alterado de `--color-primary` y comprueba que cambia el CSS resuelto de `bg-primary` en `tests/unit/tokens/propagation.test.ts`
- [X] T014 [P] Escribir la prueba que rechaza clases arbitrarias de Tailwind (`[#...]`, `[13px]`, `[1.1rem]`) y estilos en línea con valores visuales en `src/components/` en `tests/unit/tokens/no-hardcoded.test.ts`
- [X] T015 [P] Escribir la prueba de capas: ningún archivo de una capa importa una capa superior (atoms < molecules < organisms < templates < pages) en `tests/unit/architecture/layers.test.ts`

### Tokens (SASS como origen, Tailwind como consumidor)

- [X] T016 [P] Definir los 13 tokens de color como canales RGB en `src/styles/tokens/_color.scss`, con los valores exactos de `contracts/tokens.md`
- [X] T017 [P] Definir familias (Manrope titulares, Inter texto) y los 7 pasos de la escala 1.25 en `rem` en `src/styles/tokens/_typography.scss`
- [X] T018 [P] Definir el espaciado (4px medio paso y múltiplos de 8px: 0, 4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 128) en `src/styles/tokens/_spacing.scss`
- [X] T019 Emitir todos los tokens como variables CSS en `:root`, incluidos `--duration-state: 200ms` y `--target-min: 44px`, desde `src/styles/tokens/_index.scss` y `src/styles/main.scss`
- [X] T020 Configurar `tailwind.config.ts` para **reemplazar** `colors`, `fontFamily`, `fontSize`, `spacing` y `transitionDuration` (solo `state: var(--duration-state)`) con `rgb(var(--color-*) / <alpha-value>)` y `var(--*)`, y extender `minWidth` y `minHeight` con `target: var(--target-min)`, según `contracts/tokens.md`
- [X] T021 Ejecutar T012 a T014 y confirmar que pasan

### Accesibilidad global

- [X] T022 [P] Escribir el reset con `box-sizing` y márgenes a cero, y fijar `--duration-state: 0ms` con `prefers-reduced-motion: reduce`, en `src/styles/base/_reset.scss`
- [X] T023 [P] Definir `:focus-visible` global con outline de 2px `rgb(var(--color-focus))` y `outline-offset: 2px`, y `:focus:not(:focus-visible)` sin outline, en `src/styles/base/_focus.scss`
- [X] T024 [P] Definir la tipografía base (cuerpo Inter paso 0, encabezados Manrope) en `src/styles/base/_typography.scss`
- [X] T025 Crear el documento raíz con `lang="es"`, carga de Fontsource, precarga de Inter y `main.scss` en `src/root.tsx`

### Contenido

- [X] T026 [P] Escribir pruebas del esquema: falla un caso `published` con `[COMPLETAR`, sin las cuatro secciones, sin `**Decisiones clave:**` o sin `**Lo que no funcionó:**` / `**Lo que haría distinto:**`, o con una imagen sin alt; pasa un `draft` incompleto, en `tests/unit/content/schema.test.ts`
- [X] T027 Implementar los esquemas `zod` de caso, perfil y página de módulo con los límites de `contracts/content-schema.md` (`seo.title` 1 a 60, `seo.description` 50 a 160, `title` 1 a 80, `summary.indexLine` 1 a 120) en `src/content/schema.ts`
- [X] T028 Implementar la lectura con `gray-matter`, la validación y el filtro de `published`, leyendo desde `CONTENT_DIR` (por defecto `src/content/`, en pruebas `tests/fixtures/content/`); el build falla si no hay exactamente 3 casos `product` y 1 `meta` publicados cuando `REQUIRE_COMPLETE_CONTENT=true`, en `src/content/load.server.ts` (sufijo `.server` para que nunca llegue al navegador)
- [X] T029 [P] Migrar los borradores `specs/001-ux-portfolio-platform/content/case-01.md`, `case-02.md`, `case-03.md` y `case-meta.md` a `src/content/cases/` con frontmatter y `status: draft`; `case-meta.md` pasa a `este-portafolio.md`
- [X] T030 [P] Crear `src/content/profile.md` y `src/content/pages/inicio.md`, `sobre-mi.md` y `contacto.md` desde `specs/001-ux-portfolio-platform/content/modules.md`, con `[COMPLETAR]` donde falten datos

### SEO e infraestructura de rutas

- [X] T031 [P] Implementar el helper de título, descripción y URL canónica con `SITE_URL` y `BASE_PATH` en `src/lib/seo.ts`
- [X] T032 Declarar el mapa de rutas de `contracts/routes.md` sin componentes visuales (cada ruta exporta `meta` y `loader`) en `src/routes.ts`; las rutas `/prototipos/*` solo existen en desarrollo, nunca se prerenderizan ni entran en el sitemap
- [X] T033 [P] Implementar la generación de `sitemap.xml` desde las rutas publicadas en `scripts/generate-sitemap.ts`, que también genera `robots.txt` (con `SITE_URL`) y `404.html` en `build/client/`
- [X] T034 [P] Configurar CI (lint, test:unit, build) en `.github/workflows/ci.yml`

**Checkpoint**: tokens, foco, contenido y SEO listos. Todavía no existe ninguna pantalla.

---

## Phase 3: Elementos globales (bloquea US1, US2 y US3)

**Goal**: Encabezado, navegación, enlace para saltar al contenido y pie, presentes en todas las rutas (FR-017)

- [X] T035 ⛔ APROBADO el 2026-10-08: presentar en `src/routes/prototipos/globales.tsx` un prototipo con contenido de prueba de la página única con secciones: los botones primario y secundario con sus estados, el encabezado fijo (en teléfono solo la fila del menú), la navegación con la sección actual marcada, el enlace para saltar al contenido y el pie; obtener aprobación explícita y borrar el prototipo
- [X] T036 [P] Escribir prueba axe y de teclado para `SkipLink`, `NavLink` y `TextLink` en `tests/unit/components/atoms.test.tsx`
- [X] T037 [P] Crear el átomo `SkipLink` hacia `#contenido` en `src/components/atoms/SkipLink.tsx`
- [X] T038 [P] Crear el átomo `TextLink` con estados de puntero, presión y foco desde tokens en `src/components/atoms/TextLink.tsx`
- [X] T039 [P] Crear el átomo `NavLink` (enlace con ancla, `aria-current="location"` y subrayado de `--indicator-width`) en `src/components/atoms/NavLink.tsx`
- [X] T084 [P] Escribir prueba axe, de teclado y de estados para el átomo `Button` (variantes `primary` y `secondary`, como enlace o botón, mismo tamaño, estados de puntero, presión y foco; FR-033) en `tests/unit/components/button.test.tsx`
- [X] T085 [P] Crear el átomo `Button` con las variantes `primary` y `secondary` desde tokens, según `contracts/tokens.md`, en `src/components/atoms/Button.tsx`
- [X] T040 Crear el organismo `SiteHeader` fijo (en teléfono solo la fila del menú, con `top-header-collapse sm:top-0`) con la navegación Inicio, Trabajos, Sobre mí y Contacto, y el hook que marca la sección visible, incluida la última al llegar al final y salto instantáneo con movimiento reducido, en `src/components/organisms/SiteHeader.tsx`
- [X] T041 Crear el organismo `SiteFooter` con correo, LinkedIn, CV, crédito con enlace al caso meta y © con año, en `src/components/organisms/SiteFooter.tsx`
- [ ] T083 [P] [US3] (depende de T072, cuando exista `/` con secciones; la verificación manual en 360, 768 y 1280px ya pasó con los componentes reales) Escribir prueba e2e del encabezado fijo en 360, 768 y 1280px: queda visible tras el scroll (en teléfono sin el nombre); al tabular, ningún control enfocado queda bajo él; al ir a una sección su título queda libre; al final de la página el menú marca Contacto; con movimiento reducido el salto es instantáneo (FR-028, FR-029, FR-031), en `tests/e2e/header.spec.ts`
- [X] T042 Crear el template `SiteTemplate` (SkipLink, SiteHeader, `<main id="contenido">`, SiteFooter) en `src/components/templates/SiteTemplate.tsx`

**Checkpoint**: estructura global aprobada y probada.

---

## Phase 3B: Temas claro y oscuro, e idiomas español e inglés (FR-036 a FR-043)

**Goal**: Dos temas con los mismos tokens, dos idiomas con direcciones y contenido propios, selector de idioma y botón de tema en el encabezado

**Orden**: primero la compuerta T086 (puede ir en paralelo con T046); luego pruebas (deben fallar); luego implementación.

### Aprobación

- [X] T086 ⛔ APROBADO el 2026-10-08 (paleta oscura propuesta, variante B del encabezado en teléfono, selector «EN»/«ES» y botón de sol y luna): presentar en `src/routes/prototipos/temas.tsx` un prototipo con contenido de prueba que muestre (a) la propuesta de los 13 tokens de color del tema oscuro, adaptando el índigo y el teal, con la razón de contraste medida de cada pareja de `contracts/tokens.md`; (b) los botones, enlaces, tarjetas y el foco en los dos temas; (c) el encabezado con el selector de idioma y el botón de tema en 360, 768 y 1280px, con la colocación en teléfono dentro de FR-028 y FR-043. Obtener aprobación explícita, fijar los valores del tema oscuro en `.specify/memory/constitution.md` y `contracts/tokens.md`, y borrar el prototipo

### Pruebas (escribir primero, deben fallar)

- [X] T087 [P] Extender la prueba de contraste para medir cada pareja de `contracts/tokens.md` en el tema claro y en el oscuro (4.5:1 texto, 3:1 foco y bordes de control), en `tests/unit/tokens/contrast.test.ts`
- [X] T088 [P] Probar que los selectores de `contracts/tokens.md` emiten los 13 tokens en `:root`, en `prefers-color-scheme: dark` sobre `:root:not([data-theme="light"])`, y en `[data-theme="dark"]` y `[data-theme="light"]`; que cambiar un token oscuro se propaga a la utilidad de Tailwind; y que `src/components/` no usa variantes `dark:` ni lee el tema, en `tests/unit/tokens/propagation.test.ts` y `no-hardcoded.test.ts`
- [X] T089 [P] Escribir la prueba de `src/lib/i18n.ts`: ruta de cada página en cada idioma (`/` y `/en/`, `/trabajos/:slug/` y `/en/work/:slug/`), página equivalente (caso, sección y principal), alternativas `hreflang` y que `/trabajos/`, `/sobre-mi/` y `/contacto/` no existen en inglés, en `tests/unit/lib/i18n.test.ts`
- [X] T090 [P] Escribir la prueba de paridad de contenido: falla un archivo sin su par en el otro idioma, un par con `type`, `status` u `order` distintos, un caso `published` sin su par `published`, claves de `ui/es.json` y `ui/en.json` distintas o vacías, y encabezados o etiquetas en el idioma equivocado; pasa un par completo, en `tests/unit/content/parity.test.ts`
- [X] T091 [P] Escribir prueba axe, de teclado y de estado para `ThemeToggle` (`aria-pressed`, nombre accesible por idioma, 44×44 px) y `LanguageSwitch` (enlace con `hreflang` y `lang`, 44×44 px, lleva al par), en `tests/unit/components/controls.test.tsx`

### Implementación

- [X] T092 Definir el tema oscuro de los 13 tokens con los valores aprobados en T086 y emitir los cuatro selectores, con `color-scheme: light dark`, en `src/styles/tokens/_color.scss` y `_index.scss`; confirmar que pasan T087 y T088
- [X] T093 Crear `src/lib/theme.ts` (leer y guardar la elección en `localStorage`, clave `theme`) y el script mínimo en línea en `<head>` que aplica `data-theme` antes de pintar; fijar transiciones de color en 0ms al cambiar de tema, en `src/lib/theme.ts` y `src/root.tsx`
- [X] T094 [P] Crear `src/lib/i18n.ts` (idiomas, rutas por idioma, página equivalente) y los textos de interfaz `src/content/ui/es.json` y `en.json`, con un helper para leerlos; confirmar que pasa T089
- [X] T095 Reorganizar el contenido en `src/content/es/` y `src/content/en/` (mover `profile.md`, `pages/` y `cases/` a `es/`; crear los pares en `en/` con `status: draft` y `[COMPLETAR]`), cargar por idioma, validar paridad y aceptar los encabezados y etiquetas en inglés, en `src/content/schema.ts` y `load.server.ts`; actualizar `tests/unit/content/schema.test.ts`; confirmar que pasa T090
- [X] T096 Declarar las rutas `/en/`, `/en/work/:slug/` y `/en/work/this-portfolio/`, el `lang` por documento en `root.tsx`, canónica y alternativas `hreflang` en `src/lib/seo.ts`, sitemap con los dos idiomas y alternativas, y la 404 con los dos idiomas, en `src/routes.ts`, `src/root.tsx` y `scripts/generate-sitemap.ts`
- [X] T097 Crear el átomo `ThemeToggle` y el átomo `LanguageSwitch`, incorporarlos en `SiteHeader` en la posición aprobada en T086, y pasar los textos de `SkipLink`, `SiteNav`, `SiteHeader` y `SiteFooter` por el helper de interfaz; adaptar `tests/unit/components/site.test.tsx`; confirmar que pasa T091, en `src/components/atoms/`, `organisms/SiteHeader.tsx` y `organisms/SiteFooter.tsx`
- [X] T098 [P] Escribir prueba e2e de tema (sigue al sistema, el botón cambia y recuerda, sin destello al cargar, sin JavaScript sigue al sistema) y de idioma (el selector lleva a la página equivalente, `lang`, canónica y `hreflang` correctos, el sitemap lista los dos idiomas), con axe en los dos temas y los dos idiomas, y comprobar FR-043 en 360, 768 y 1280px, en `tests/e2e/theme.spec.ts` y `i18n.spec.ts`
- [X] T099 Ejecutar T087 a T091 y T098 y confirmar que pasan
- [X] T105 Cambio aprobado el 2026-10-08 sobre T086: en teléfono el selector de idioma y el botón de tema pasan a la fila del nombre (derecha, se desplaza) y queda fija solo la fila del menú; `--header-height` pasa a `61px` en todos los anchos; pruebas actualizadas en `header.test.ts` y `site.test.tsx`
- [X] T106 ⛔ APROBADO el 2026-10-09 (encabezado traslúcido al 90 %, botones opción D «píldora tonal con capa de estado» con contorno en el secundario, tarjetas tonales con borde de 1px y esquinas de 16px): prototipo comparativo en `src/routes/prototipos/estilo.tsx` (borrado tras la aprobación). Con pruebas primero (en rojo y luego en verde): tokens `--button-radius`, `--card-radius`, `--state-hover`, `--state-press`, `--header-alpha`, `--header-blur`, `--header-saturate` y colores derivados `surface-tonal` y `secondary-container` (15 tokens de color); clase `.header-glass` con respaldo sólido; `Button`, `SiteHeader`, `CaseCard` y `CaseSummary` actualizados; pruebas de contraste en el peor caso y con la capa de estado en `contrast.test.ts` y `style.test.ts`. Pendiente: las pantallas nuevas (T068, T071 en adelante) deben usar `rounded-card`, `bg-surface-tonal` y los botones nuevos; los chips quedan como están hasta que se apruebe otra cosa
- [X] T107 ⛔ APROBADO el 2026-10-09 (tarjetas de caso con imagen genérica arriba y chip de rubro; el caso meta es el cuarto proyecto, en dos columnas; botones a todo el ancho en teléfono): con pruebas primero (rojo y luego verde), `summary.sector` obligatorio en `product` y `meta` (`schema.ts`, fixtures y borradores en es/en, `content-schema.md`), `CaseCard` con imagen recortada por la esquina y chip «Rubro: …», `CaseIndex` sin tarjeta destacada y con `sm:grid-cols-2`, clave `work.sector` en `ui/es.json` y `ui/en.json` (sustituye a `work.featuredEyebrow`), `Button` con `w-full sm:w-auto`, FR-019 y FR-033 actualizados. Pendiente: las imágenes reales de cada caso (campo de portada con su texto alternativo) cuando las entregue la responsable

**Checkpoint**: temas e idiomas funcionan en los elementos globales. Las pantallas de las historias nacen ya con los dos temas y los dos idiomas.

---

## Phase 4: User Story 1 - Evaluar el pensamiento de producto (Priority: P1) 🎯 MVP

**Goal**: Trabajos, los tres casos de producto y el caso meta, con resumen y arco narrativo

**Independent Test**: Con contenido de prueba publicado, un evaluador abre cada caso, lee el resumen y señala las cuatro partes; puede volver a Trabajos

### Tests for User Story 1

- [ ] T043 [P] [US1] Escribir prueba e2e: desde la sección `/#trabajos` se llega a cada caso y se vuelve a ella; cada caso muestra resumen y las cuatro secciones en orden, en `tests/e2e/cases.spec.ts`
- [ ] T044 [P] [US1] Escribir prueba e2e con axe sobre `/` y `/en/` (todas sus secciones) y cada caso, en los dos temas, en `tests/e2e/a11y-cases.spec.ts`
- [X] T045 [P] [US1] Crear contenido de prueba publicado (3 casos y meta) en español y en inglés, con la estructura de `es/` y `en/`, en `tests/fixtures/content/`

### Implementation for User Story 1

- [X] T046 [US1] ⛔ APROBADO el 2026-10-08: presentar en `src/routes/prototipos/casos.tsx` un prototipo con contenido de prueba de la página de caso (resumen, cuatro secciones, apoyo visual) y de la sección Trabajos dentro de `/`; obtener aprobación explícita y borrar el prototipo
- [X] T047 [P] [US1] Crear los átomos `Heading` (niveles 1 a 4 con la escala) y `Text` en `src/components/atoms/Heading.tsx` y `Text.tsx`
- [X] T048 [P] [US1] Crear el átomo `Figure` con alt obligatorio y pie de imagen en `src/components/atoms/Figure.tsx`
- [X] T049 [P] [US1] Crear la molécula `CaseSummary` (producto, rol, equipo, duración, resultado clave) como lista de definiciones en una cuadrícula dentro de una tarjeta con borde, con el resultado clave destacado (FR-035), en `src/components/molecules/CaseSummary.tsx`
- [X] T050 [P] [US1] Crear la molécula `CaseCard` (título, rol, tipo de producto, línea de resultado, enlace con texto descriptivo) en `src/components/molecules/CaseCard.tsx`
- [X] T051 [US1] Crear el organismo `CaseBody` que renderiza Markdown con `react-markdown` mapeado a `Heading`, `Text`, `TextLink` y `Figure` en `src/components/organisms/CaseBody.tsx`
- [X] T052 [US1] Crear el organismo `CaseIndex` con la lista de `CaseCard` y el acceso al caso meta en `src/components/organisms/CaseIndex.tsx`
- [X] T053 [US1] Crear el template `CaseTemplate` (enlace «Volver a Trabajos» a `/#trabajos` antes del título, CaseSummary, índice con las cuatro secciones, CaseBody con texto de `max-w-prose` e imágenes de ancho completo; FR-035) en `src/components/templates/CaseTemplate.tsx`
- [X] T054 [US1] Crear la page `CasePage` en `src/components/pages/CasePage.tsx`
- [X] T055 [US1] (depende de T096) Conectar `/trabajos/:slug/`, `/trabajos/este-portafolio/` y sus pares `/en/work/:slug/` y `/en/work/this-portfolio/` con loader y meta en `src/routes/`
- [ ] T056 [US1] Ejecutar T043 y T044 y confirmar que pasan

**Checkpoint**: US1 funciona y se valida sola.

---

## Phase 5: User Story 2 - Confiar en la calidad de la experiencia (Priority: P2)

**Goal**: Teclado, estados, responsive, zoom y propagación de tokens comprobados en todas las rutas existentes

**Independent Test**: Solo con teclado se recorren navegación y casos con foco visible; sin desborde en 360, 768 y 1280px ni con texto al 200%

### Tests for User Story 2

- [ ] T057 [P] [US2] Escribir prueba e2e de teclado: orden de Tab, foco visible (outline presente y sin ningún elemento fijo encima, FR-028), sin trampas, y cada control con área de al menos 44×44 px salvo los enlaces dentro de un párrafo (FR-027), en todas las rutas, en `tests/e2e/keyboard.spec.ts`
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

- [ ] T063 [P] [US3] Escribir prueba e2e de SEO: título, descripción, canónica, alternativas `hreflang`, un solo `h1` y el `lang` correcto (`es` o `en`) por ruta; el sitemap coincide con las rutas publicadas de los dos idiomas, en `tests/e2e/seo.spec.ts`
- [ ] T064 [P] [US3] Escribir prueba e2e: desde cualquier ruta, Contacto queda a una acción, y muestra correo, perfil profesional y CV (el enlace al CV se oculta si falta el archivo), en `tests/e2e/contact.spec.ts`
- [ ] T065 [P] [US3] Escribir prueba e2e con axe sobre `/`, `/en/`, las redirecciones y la 404, en los dos temas, en `tests/e2e/a11y-pages.spec.ts`

### Implementation for User Story 3

- [X] T066 [US3] ⛔ APROBADO el 2026-10-09: prototipos de `/` y `/en/` en `src/routes/prototipos/principal.tsx` (Inicio con foto, cifras 4+/4/20–30 %, Trabajos con tarjetas de caso, Sobre mí con Forma de trabajar, Métodos y Trayectoria con chips de herramientas, y Contacto) y de la 404 bilingüe en `src/routes/prototipos/no-encontrada.tsx`; aprobados explícitamente, borrados los archivos de prototipo y restauradas las rutas reales en `src/routes.ts`
- [X] T067 [P] [US3] Crear la molécula `ContactList` (solo enlaces: correo, perfil profesional, CV; sin formulario, FR-034) en `src/components/molecules/ContactList.tsx`; la usan también el pie y la sección Contacto. Prueba en `tests/unit/components/home.test.tsx`
- [X] T068 [P] [US3] Crear el organismo `ProfileIntro` (foto arriba del titular a la izquierda, nombre, rol, propuesta de valor, botón primario «Ver mis trabajos» y botón secundario «Escríbeme» que abre el correo) en `src/components/organisms/ProfileIntro.tsx`. Pendiente: las cifras del prototipo (4+, 4, 20–30 %) esperan sus datos reales
- [X] T100 [P] [US3] (tras T066) Escribir prueba de esquema de la trayectoria: acepta grupos opcionales, fechas `AAAA` y `AAAA-MM`, `to` ausente como actualidad; acepta `tools` opcional como lista de textos no vacíos y sin repetir en cada experiencia; rechaza fechas inválidas, orden no descendente, URL de credencial inválida, entradas sin par en el otro idioma o con fechas distintas, y `[COMPLETAR` al publicar; no aplica el anonimato (FR-044), en `tests/unit/content/career.test.ts`
- [X] T101 [P] [US3] (tras T066) Escribir prueba de componente y axe de `Career`: un grupo es una lista semántica con su encabezado, las fechas usan `<time>`, las herramientas son una lista (`ul`) con nombre accesible, de solo lectura (sin foco ni rol de botón) y con chips de contraste suficiente, un grupo sin entradas no se muestra, el enlace a la credencial tiene nombre accesible único, sin información solo en imagen, en `tests/unit/components/career.test.tsx`
- [X] T102 [US3] Añadir `career` a `validateProfile` y a los loaders, con paridad entre idiomas, y los datos de prueba del perfil en `tests/fixtures/content/`; confirmar que pasa T100, en `src/content/schema.ts` y `load.server.ts`
- [X] T103 [P] [US3] Crear la molécula `CareerEntry` y el organismo `Career` con los textos de interfaz en `ui/es.json` y `en.json`; confirmar que pasa T101, en `src/components/molecules/` y `organisms/`
- [X] T104 [US3] Incluir `Career` dentro de Sobre mí en `HomePage` (T071) y cargar `career` en el loader de `/` (T072); el loader ya entrega `profile.career`
- [X] T069 [P] [US3] ~~Crear el organismo `HomeCases`~~ Sustituido por `CaseIndex` (FR-019: cuatro tarjetas iguales, el caso meta como cuarta)
- [X] T070 [US3] Crear el template `ContentTemplate` para las secciones de `/` en `src/components/templates/ContentTemplate.tsx`
- [X] T071 [US3] Crear las pages `HomePage` (compone las secciones Inicio, Trabajos, Sobre mí y Contacto; Sobre mí con el organismo `ProseBody`) y `NotFoundPage` (bilingüe) en `src/components/pages/`
- [X] T072 [US3] Conectar `/`, `/en/` y la 404 con loader y meta en `src/routes/` (vista compartida en `routes/home-view.tsx`; el loader de `/` carga también el cuerpo de `sobre-mi.md`)
- [ ] T081 [US3] Reemplazar las rutas `/trabajos/`, `/sobre-mi/` y `/contacto/` por redirecciones prerenderizadas a `/#trabajos`, `/#sobre-mi` y `/#contacto` (canónica `/`, `noindex`, fuera del sitemap; FR-032), y escribir su prueba e2e en `tests/e2e/redirects.spec.ts`
- [ ] T082 [US3] Adaptar lo ya construido al modelo de página única: `validatePage` exige `seo` solo en `inicio.md`; `loadPage` y los módulos de ruta actuales de `trabajos`, `sobre-mi` y `contacto` pasan a ser redirecciones; `src/content/es/pages/` y `en/pages/` y su prueba en `tests/unit/content/schema.test.ts` se actualizan
- [ ] T073 [US3] Encadenar `scripts/generate-sitemap.ts` al final de `npm run build` en `package.json`
- [ ] T074 [US3] Ejecutar T063 a T065 y confirmar que pasan

**Checkpoint**: las tres historias funcionan y se validan.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T075 [P] Configurar el despliegue en GitHub Pages con `BASE_PATH` y `SITE_URL` como variables y `REQUIRE_COMPLETE_CONTENT=true`, en `.github/workflows/deploy.yml`
- [ ] T076 [P] Optimizar imágenes (dimensiones declaradas, carga diferida, formatos modernos) en `src/components/atoms/Figure.tsx`
- [ ] T077 Ejecutar `npm run lighthouse` y corregir hasta superar 95 en las tres categorías, en teléfono y escritorio
- [ ] T078 Completar el contenido real en español y en inglés: ningún `[COMPLETAR]` en `src/content/es/` ni `en/`, revisar a mano el anonimato de cada caso en los dos idiomas (FR-030), y pasar los 4 casos a `status: published` en ambos
- [ ] T079 Ejecutar todos los escenarios de `quickstart.md`
- [ ] T080 Realizar los recorridos con evaluadores de SC-001, SC-009 y SC-010 (al menos 4 de 5) y una revisión con NVDA

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup; bloquea todo lo demás
- **Elementos globales (Phase 3)**: depende de Foundational y de la aprobación T035
- **Temas e idiomas (Phase 3B)**: depende de Phase 3; la aprobación T086 puede ir en paralelo con T046; bloquea T055 y la conexión de rutas de US3 (T072, T081, T082)
- **US1 (Phase 4)**: depende de Phase 3 y de la aprobación T046; T055 depende además de T096
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
- Phase 3B: T087 a T091 juntas; T094 y T098
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
