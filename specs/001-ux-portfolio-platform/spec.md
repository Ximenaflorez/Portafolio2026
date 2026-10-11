# Feature Specification: Plataforma de portafolio UX/UI

**Feature Branch**: `001-ux-portfolio-platform`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "Plataforma de portafolio para un perfil de UX/UI y product design. Debe superar al portafolio estático de pantallas finales y demostrar pensamiento sistémico, arquitectura de la solución y criterio de producto ante engineering managers, product managers y reclutadores especializados. El portafolio es el caso de estudio principal. Incluye al menos dos casos con problema, evidencia de usuario, arquitectura de la solución y resultados o aprendizajes. La experiencia debe ser accesible (WCAG 2.2 AA), consistente desde un sistema visual central, usable con teclado, responsiva en teléfono, tableta y escritorio, rápida y encontrable en buscadores."

## Clarifications

### Session 2026-10-07

- Q: ¿Qué tamaño mínimo deben tener los controles que se tocan o se cliquean? → A: 44×44 px como mínimo para todos los controles; los enlaces dentro de un párrafo quedan exentos.
- Q: ¿El encabezado se queda fijo arriba al hacer scroll o se desplaza con la página? → A: Se desplaza con la página. *(Sustituida el 2026-10-08: ver la sesión siguiente.)*
- Q: ¿Cómo se comporta el portafolio con animaciones y transiciones? → A: Solo transiciones breves de estado, de hasta 200 ms, desactivadas si el sistema pide reducir movimiento.
- Q: ¿Cuántos casos destacados muestra Inicio y cómo se eligen? → A: Los 3 casos de producto, en el orden que fija el responsable.
- Q: ¿Qué regla se aplica a citas, datos de usuario e información de empresas en los casos? → A: Todo anonimizado siempre, incluido el nombre de la empresa.

### Session 2026-10-08

Tras comparar dos prototipos con contenido de prueba (una página por módulo frente a una sola página con scroll):

- Q: ¿Cómo se organizan Inicio, Trabajos, Sobre mí y Contacto? → A: Como secciones de una sola página (`/`) a las que se llega por scroll desde el menú. Cada caso de estudio conserva su propia página.
- Q: ¿El encabezado sigue sin ser fijo? → A: Pasa a ser fijo, porque en una página larga el menú debe estar siempre a mano. Esto sustituye la decisión del 2026-10-07.
- Q: ¿Cómo se comporta el encabezado fijo en teléfono? → A: Solo queda fija la fila del menú; el nombre se desplaza con la página.
- Q: ¿Qué pasa con las URLs `/trabajos/`, `/sobre-mi/` y `/contacto/`? → A: Se mantienen y redirigen a su sección de `/`.
- Q: ¿Cuántos estilos de botón hay? → A: Dos: primario (relleno) y secundario (con borde y sin relleno), con el mismo tamaño y los mismos estados.
- Q: ¿Hay formulario de contacto? → A: No. Contacto se mantiene como enlaces: correo, perfil profesional y CV.
- Q: ¿Cómo se presenta el resumen de un caso? → A: Como cuadrícula de datos dentro de una tarjeta con borde (2 columnas en escritorio, 1 en teléfono), con el resultado clave destacado.
- Q: ¿Qué ancho tiene el texto de un caso y sus imágenes? → A: El texto en una columna de lectura de unos 65 caracteres; las imágenes de apoyo, más anchas, hasta el ancho del contenido.
- Q: ¿Qué navegación hay dentro de un caso? → A: Enlace «Volver a Trabajos» antes del título e índice con las cuatro secciones. Sin enlace de volver al final ni caso siguiente.
- Q: ¿Cómo se muestra la sección Trabajos? → A: Cuatro tarjetas iguales con imagen y chip de rubro, en dos columnas desde `sm` (decidido el 2026-10-09: el caso de este portafolio es el cuarto proyecto, ya no una tarjeta aparte).
- Q: ¿Hay modo claro y oscuro? → A: Sí, ambos. Esto sustituye la exclusión del tema oscuro del alcance anterior.
- Q: ¿Cómo se elige el tema? → A: Empieza con la preferencia del sistema y hay un botón para cambiarlo; el sitio recuerda la elección.
- Q: ¿Qué colores tiene el modo oscuro? → A: Se adapta la paleta actual (índigo y teal) a fondos oscuros. Los valores se proponen en un prototipo y se fijan tras la aprobación del responsable.
- Q: ¿Hay versión en inglés? → A: Sí: español e inglés. Esto sustituye la exclusión de la internacionalización del alcance anterior.
- Q: ¿Cómo se organizan los dos idiomas? → A: Español en `/` e inglés en `/en/`, cada uno con sus propias direcciones, para poder compartirlas e indexarlas.
- Q: ¿Quién redacta los textos en inglés? → A: El responsable entrega cada texto en español y en inglés, en archivos paralelos. No hay traducción automática ni borrador de traducción.

### Session 2026-10-08 (trayectoria)

- Q: ¿Dónde van las herramientas? → A: Dentro de cada experiencia de la trayectoria, como chips de solo lectura. Sobre mí ya no tiene un bloque «Herramientas» suelto; forma de trabajar y métodos se mantienen como bloques apilados antes de la trayectoria.
- Q: ¿Sobre mí conserva «Problemas que busco»? → A: No. Se retira de la página y de la spec; Sobre mí queda con presentación, forma de trabajar, métodos y trayectoria.
- Q: ¿Dónde se muestran la experiencia laboral, la educación y los certificados? → A: En Sobre mí, como un bloque «Trayectoria» visible en la página, con tres grupos: experiencia, educación y certificados. El CV sigue enlazado en Contacto y en el pie.
- Q: ¿La trayectoria muestra los nombres de las empresas? → A: Sí, con el nombre real. La anonimización de FR-030 se limita a los casos de estudio y no se aplica a la trayectoria.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Evaluar el pensamiento de producto (Priority: P1)

Un engineering manager, product manager o reclutador abre un caso de estudio y entiende el problema, la evidencia de usuario, cómo se estructuró la solución y qué resultado o aprendizaje quedó. No necesita reconstruir esa historia a partir de pantallas finales sueltas.

**Why this priority**: Es la razón de existir de la plataforma. Sin esta narrativa, el portafolio vuelve a ser una galería estática y no permite juzgar madurez de producto.

**Independent Test**: Con los casos de producto y el caso meta publicados, un evaluador abre cada uno, lee el resumen y señala las cuatro partes sin ayuda. Eso ya entrega el valor central, aunque el resto del sitio siga mínimo.

**Acceptance Scenarios**:

1. **Given** un caso publicado, **When** el evaluador lo recorre de principio a fin, **Then** encuentra problema inicial, investigación o datos de usuario, arquitectura de la solución, y resultados o aprendizajes.
2. **Given** un caso que solo muestra pantallas finales, **When** se revisa si cuenta para el mínimo, **Then** no se considera completo.
3. **Given** la entrada del portafolio, **When** el evaluador elige un caso, **Then** llega a ese caso y puede volver al conjunto de trabajos sin perder el contexto de que está evaluando al mismo perfil.
4. **Given** el inicio de un caso, **When** un reclutador lee solo el resumen, **Then** conoce producto, rol, equipo, duración y resultado clave en menos de 30 segundos.
5. **Given** el caso meta, **When** un engineering manager lo recorre, **Then** entiende cómo se construyó el portafolio: sistema de diseño, estructura de componentes, accesibilidad y uso de IA en el desarrollo.

---

### User Story 2 - Confiar en la calidad de la experiencia (Priority: P2)

El evaluador recorre la plataforma y comprueba que la experiencia es operable, legible y estable: teclado, foco visible, contraste, estados de interacción y lectura correcta en teléfono, tableta y escritorio. También comprueba que la apariencia sale de un solo sistema visual.

**Why this priority**: Este público evalúa si el criterio de diseño es viable, no solo si la narrativa convence. La calidad perceptible de la propia plataforma es parte de la prueba.

**Independent Test**: En la entrada publicada, una persona solo con teclado recorre navegación y enlaces, ve el foco, y la misma vista se lee sin romperse en teléfono, tableta y escritorio. Un cambio de una decisión visual central se nota en toda la vista.

**Acceptance Scenarios**:

1. **Given** la navegación principal y los enlaces o botones de un caso, **When** el evaluador usa solo el teclado, **Then** llega a cada control, lo activa y ve un foco visible, sin quedar atrapado.
2. **Given** un control que admite puntero, **When** se pasa el puntero o se presiona, **Then** el estado al pasar el puntero y el estado al presionar se distinguen del estado en reposo y del foco por teclado.
3. **Given** una decisión central de color, tipografía o espaciado, **When** esa decisión cambia, **Then** todas las vistas que la usan cambian de la misma manera y no quedan valores visuales sueltos.
4. **Given** anchos de teléfono, tableta y escritorio, **When** el evaluador lee un caso, **Then** el contenido principal no se solapa, no se corta y no queda fuera de alcance.

---

### User Story 3 - Encontrar el perfil y contactarlo (Priority: P3)

Un reclutador encuentra la plataforma, entiende de qué perfil se trata y sabe cómo contactar. Las páginas públicas se pueden indexar con título y descripción propios.

**Why this priority**: La evaluación no ocurre si el perfil no se encuentra o si, al terminar, no hay un paso de contacto.

**Independent Test**: Desde la entrada pública, un visitante identifica el rol del perfil y un medio de contacto, y cada página pública expone título y descripción propios más una lista descubrible del conjunto.

**Acceptance Scenarios**:

1. **Given** la entrada pública, **When** un reclutador llega por primera vez, **Then** identifica que se trata de un perfil de UX/UI y product design y ve cómo contactar.
2. **Given** el módulo Sobre mí y proceso, **When** un product manager lo lee, **Then** entiende la forma de trabajar y los métodos que domina el perfil, y ve su trayectoria: experiencia (con empresa), educación y certificados.
3. **Given** el módulo Contacto, **When** un reclutador quiere avanzar, **Then** encuentra correo, perfil profesional y un enlace al CV.
4. **Given** una página pública, **When** se prepara para aparecer en resultados de búsqueda, **Then** tiene un título propio, una descripción breve y una estructura de encabezados comprensible.
5. **Given** el conjunto de páginas públicas, **When** un buscador necesita descubrirlas, **Then** existe una lista descubrible de esas páginas.

---

### Edge Cases

- Un caso con una de las cuatro partes vacía, o con un espacio de plantilla sin completar, no se publica.
- Si hay menos de tres casos de producto completos, la plataforma no cumple el alcance de esta especificación.
- El caso meta no cuenta para el mínimo de tres casos de producto.
- Las métricas de resultado se expresan siempre como porcentaje, rango o efecto observado (FR-030), y el caso sigue contando como completo.
- Si el CV no está disponible, el contacto sigue funcionando con correo y perfil profesional.
- En tacto, sin puntero, ninguna información necesaria depende del estado al pasar el puntero.
- Con el texto ampliado al 200%, el contenido principal sigue legible, sin solapes ni recortes.
- Si una imagen no carga, la argumentación del caso sigue pudiendo leerse.
- Un flujo donde el foco entra y no puede salir no se considera listo para publicar.
- Entre los anchos de teléfono, tableta y escritorio, el contenido no se rompe en los anchos intermedios.
- Una página pública sin título propio o sin descripción breve no se considera lista para indexar.
- Un caso o una sección que existe en un idioma y no en el otro no se publica.
- Un grupo de la trayectoria sin entradas (por ejemplo, sin certificados) no muestra ni su título.
- Si la persona ya eligió un tema con el botón, esa elección prevalece sobre la preferencia del sistema; si no eligió, se sigue al sistema, también si el sistema cambia.
- Sin JavaScript, el tema sigue al sistema, el selector de idioma sigue funcionando y la navegación por anclas también.
- Al cambiar de idioma desde la página de un caso, se llega al mismo caso en el otro idioma, no a la página principal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La plataforma MUST publicar tres casos de producto completos y un caso meta sobre la construcción del propio portafolio.
- **FR-002**: Cada caso de producto completo MUST incluir problema inicial, investigación o datos de usuario, arquitectura de la solución, y resultados o aprendizajes.
- **FR-003**: Un evaluador MUST poder ir de la entrada del portafolio a cada caso y regresar al conjunto de trabajos.
- **FR-004**: La entrada MUST identificar el perfil como UX/UI y product design, más allá de una galería de pantallas finales.
- **FR-005**: La plataforma MUST ofrecer un medio de contacto visible: correo, perfil profesional y enlace al CV.
- **FR-006**: Todo control interactivo MUST poder alcanzarse y activarse solo con teclado, sin trampas de foco.
- **FR-007**: Todo control interactivo MUST mostrar un foco de teclado visible. Si el control admite puntero o presión, MUST distinguir el estado al pasar el puntero y el estado al presionar.
- **FR-008**: La información necesaria para entender un caso MUST estar disponible sin depender del estado al pasar el puntero.
- **FR-009**: La plataforma MUST cumplir WCAG 2.2 nivel AA en contraste, nombre accesible y estado de los elementos interactivos.
- **FR-010**: Una descripción accesible adicional MUST usarse solo cuando el significado nativo del elemento no alcance.
- **FR-011**: Color, tipografía y espaciado MUST provenir de un único sistema visual central.
- **FR-012**: Un cambio en una decisión de ese sistema visual MUST reflejarse en todas las vistas que la usan, sin valores visuales sueltos.
- **FR-013**: La lectura MUST mantenerse íntegra en teléfono, tableta y escritorio, incluidos los anchos intermedios.
- **FR-014**: Cada página pública MUST tener título propio, descripción breve y una jerarquía de encabezados comprensible.
- **FR-015**: El conjunto de páginas públicas MUST poder descubrirse mediante una lista de esas páginas.
- **FR-016**: El contenido principal de un caso MUST poder leerse aunque fallen las imágenes de apoyo.
- **FR-017**: La plataforma MUST organizarse en estos módulos: Inicio, Trabajos (índice), Caso de estudio, Caso meta, Sobre mí y proceso, y Contacto. Inicio, Trabajos, Sobre mí y Contacto MUST ser secciones de una sola página (`/`); cada caso y el caso meta MUST tener su propia página. Además MUST tener elementos globales: encabezado con navegación, selector de idioma y botón de tema, enlace para saltar al contenido y pie con contacto.
- **FR-018**: Inicio MUST mostrar quién es el perfil, qué hace, para quién trabaja, los 3 casos de producto y el acceso a contacto.
- **FR-019**: La sección Trabajos MUST listar los cuatro proyectos (los tres casos de producto y el caso de este portafolio, como un proyecto más) como tarjetas iguales, en el orden fijado por el responsable, en dos columnas desde `sm` y en una en teléfono. Cada tarjeta MUST mostrar una imagen arriba a todo el ancho (genérica y decorativa hasta que el caso tenga la suya, con su texto alternativo cuando la tenga), un chip de solo lectura con el rubro del caso (Fintech, ATS, Research, Design system…), el título, el rol si lo hay, una línea de resultado y el enlace al caso. El chip MUST anunciarse con su etiqueta («Rubro: Fintech») y no depender del color.
- **FR-020**: Cada caso MUST abrir con un resumen de producto, rol, equipo, duración y resultado clave.
- **FR-021**: Cada caso MUST seguir el arco narrativo: tensión, descubrimiento, decisión, prueba, impacto y reflexión.
- **FR-022**: En la arquitectura de la solución, cada caso MUST documentar al menos una decisión clave con su motivo y la alternativa descartada.
- **FR-023**: En resultados y aprendizajes, cada caso MUST incluir lo que no funcionó o lo que se haría distinto.
- **FR-024**: El caso meta MUST explicar el sistema de diseño, la estructura de componentes, el enfoque de accesibilidad y el uso de IA en el desarrollo del portafolio.
- **FR-025**: Sobre mí y proceso MUST describir la forma de trabajar y los métodos dominados por el perfil. No incluye un bloque de problemas que busca ni uno de herramientas suelto (las herramientas van en la trayectoria, FR-044).
- **FR-026**: Ningún caso MUST publicarse con espacios de plantilla sin completar.
- **FR-027**: Todo control interactivo MUST tener un área de toque o clic de al menos 44×44 px, incluidos los enlaces de la navegación, los llamados a contacto y los enlaces de "ver caso". Los enlaces dentro de un párrafo de texto quedan exentos, como permite WCAG 2.2 AA.
- **FR-028**: El encabezado MUST permanecer visible al hacer scroll. En tableta y escritorio queda fijo completo (nombre y navegación); en teléfono solo queda fija la fila de la navegación y el nombre se desplaza. Ningún elemento fijo MUST tapar, ni en parte, el control que tiene el foco del teclado, ni el título de la sección a la que se salta: el documento reserva espacio igual a la altura visible del encabezado más el anillo de foco. El encabezado fijo MUST ser traslúcido (cristal de iOS): su fondo deja ver, desenfocado, el contenido que pasa por detrás, con una opacidad con la que texto y foco cumplen el contraste en el peor caso (blanco o negro puro detrás) en los dos temas, y MUST volver a un fondo sólido con `prefers-reduced-transparency`, `prefers-contrast: more`, `forced-colors` o sin soporte de `backdrop-filter`. Es el único elemento con cristal.
- **FR-029**: El movimiento MUST limitarse a transiciones de cambio de estado (puntero, presión, foco) de 200 ms como máximo y al desplazamiento suave al saltar a una sección. No hay animaciones de aparición, de scroll ni en bucle. Si el sistema pide reducir movimiento, MUST no haber ninguna transición y el salto a una sección MUST ser instantáneo.
- **FR-030**: Todo caso de estudio MUST estar anonimizado (esta regla no aplica a la trayectoria, FR-044): sin nombre de empresa ni de clientes, sin nombres de personas, con citas sin atribución y con métricas en porcentajes o rangos. Las imágenes MUST no mostrar logos, nombres ni datos reales. La empresa se describe solo por sector y tamaño.
- **FR-031**: La navegación MUST marcar la sección que se está viendo (con `aria-current="location"`), también al llegar al final de la página, y MUST llevar a cada sección sin JavaScript (enlaces con ancla). Desde la página de un caso, los enlaces de la navegación MUST llevar a la sección correspondiente de `/`.
- **FR-032**: `/trabajos/`, `/sobre-mi/` y `/contacto/` MUST redirigir a su sección de `/` y no aparecer en el sitemap.
- **FR-033**: Los llamados a la acción MUST usar una de dos variantes de botón: primaria (acción principal de un bloque) o secundaria (acción alternativa). Ambas MUST tener el mismo tamaño y los mismos estados de reposo, puntero, presión y foco. Un bloque MUST tener una sola acción primaria. En teléfono los botones MUST ocupar todo el ancho disponible y desde `sm` el de su contenido. Ambas MUST ser píldoras con capa de estado (el color no cambia al pasar el puntero ni al presionar; se superpone una capa de la etiqueta), la secundaria con relleno tonal y contorno Primary que dé 3:1 contra la página.
- **FR-034**: El módulo Contacto MUST limitarse a enlaces (correo, perfil profesional y CV); no hay formulario.
- **FR-035**: La página de un caso MUST empezar con el enlace «Volver a Trabajos» antes del título, y MUST ofrecer un índice con enlaces a sus cuatro secciones. El resumen MUST presentarse como cuadrícula de datos con el resultado clave destacado. El texto MUST tener un ancho de lectura de unos 65 caracteres por línea.
- **FR-036**: La plataforma MUST ofrecer un tema claro y un tema oscuro. En la primera visita MUST usar la preferencia del sistema; un botón en el encabezado MUST permitir cambiar de tema, y el sitio MUST recordar esa elección en las visitas siguientes. Sin JavaScript MUST seguir la preferencia del sistema.
- **FR-037**: Ambos temas MUST cumplir WCAG 2.2 AA (FR-009): contraste de texto, de foco y de bordes de control, estados de puntero, presión y foco visibles, y los mismos tamaños de control. Al cargar o cambiar el tema MUST NOT haber un destello del tema equivocado ni una transición de color más larga que la de FR-029.
- **FR-038**: El botón de tema MUST ser un control con nombre accesible y estado (pulsado o no), operable con teclado y con un área de al menos 44×44 px (FR-027).
- **FR-039**: La plataforma MUST publicarse en español y en inglés. El español vive en `/` y el inglés en `/en/`; cada página pública MUST existir en los dos idiomas, con direcciones propias (la del inglés bajo `/en/`).
- **FR-040**: El encabezado MUST ofrecer un selector de idioma que lleve a la página equivalente en el otro idioma (la misma sección o el mismo caso). MUST funcionar sin JavaScript, indicar el idioma al que lleva con `lang` y un nombre accesible, y tener un área de al menos 44×44 px. El idioma MUST NOT cambiarse por detección automática del navegador.
- **FR-041**: Cada página MUST declarar su idioma en el documento, y tener título, descripción breve y URL canónica propios en ese idioma, además de las alternativas del otro idioma. La lista de páginas públicas MUST incluir las páginas de los dos idiomas.
- **FR-042**: Todo texto del sitio (casos, secciones, perfil e interfaz) MUST existir en español y en inglés, redactado por el responsable. Un caso, una sección o un dato de perfil sin su par en el otro idioma MUST impedir la publicación.
- **FR-043**: El selector de idioma y el botón de tema MUST caber en el encabezado fijo en 360, 768 y 1280px sin romper FR-028 ni tapar el foco, y el nombre accesible de ambos MUST estar en el idioma de la página.
- **FR-044**: Sobre mí MUST incluir un bloque «Trayectoria», visible en la página, con tres grupos: experiencia, educación y certificados. Cada entrada de experiencia MUST mostrar el rol, el nombre real de la empresa, las fechas, una línea de logro y, si hay, las herramientas usadas, mostradas como chips de solo lectura dentro de una lista con nombre accesible (sin ser controles ni depender del color); cada entrada de educación, el título, la institución y el año; cada certificado, el nombre, quien lo emite, el año y, si existe, un enlace a la credencial. Las entradas van de la más reciente a la más antigua. Cada grupo MUST ser una lista semántica con fechas legibles por tecnologías de apoyo, sin logos ni información que dependa solo de una imagen. Un grupo sin entradas MUST no mostrarse. Cada entrada MUST existir en español y en inglés (FR-042). La anonimización de FR-030 MUST NOT aplicarse aquí.

### Key Entities

- **Caso de estudio**: Unidad de evaluación. Atributos visibles: título, resumen (producto, rol, equipo, duración, resultado clave), problema inicial, evidencia de usuario, arquitectura de la solución, resultados o aprendizajes, y apoyo visual que no reemplaza esa narrativa. Tipo: caso de producto o caso meta.
- **Perfil**: La persona evaluada. Atributos visibles: práctica (UX/UI y product design), forma de trabajar, métodos, correo, perfil profesional, CV y trayectoria. Se relaciona con tres casos de producto y un caso meta.
- **Entrada de trayectoria**: Un dato de experiencia, educación o certificado del perfil. Atributos visibles: grupo, título o rol, organización (empresa, institución o emisor), fechas o año, una línea de logro (solo experiencia) y enlace a la credencial (solo certificados). Existe en español y en inglés.
- **Módulo**: Destino del portafolio con un propósito propio: Inicio, Trabajos, Caso de estudio, Caso meta, Sobre mí y proceso, o Contacto.
- **Sistema visual**: Conjunto único de decisiones de color, tipografía y espaciado que aplican a todas las vistas publicadas. El color tiene un valor para el tema claro y otro para el oscuro.
- **Página pública**: Destino encontrable. Atributos: idioma, título, descripción breve, su equivalente en el otro idioma y lugar en la lista de páginas públicas. Puede ser la entrada, un caso o el destino de contacto.
- **Idioma**: Versión completa del sitio (español o inglés), con su propio contenido, direcciones y metadatos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En al menos 4 de 5 recorridos de prueba, un evaluador identifica las cuatro partes de un caso (problema, evidencia de usuario, arquitectura de la solución, resultados o aprendizajes) en menos de 3 minutos.
- **SC-002**: La plataforma publica 3 casos de producto que cumplen SC-001, más el caso meta. Cero casos incompletos cuentan para ese mínimo.
- **SC-003**: El 100% de los controles de la navegación principal y de los casos se alcanza y se activa solo con teclado, con foco visible y sin trampas de foco.
- **SC-004**: Una auditoría automatizada de la versión pública supera 95 sobre 100 en accesibilidad, en rendimiento y en buenas prácticas, tanto en una vista de teléfono como en una de escritorio.
- **SC-005**: En vistas de teléfono, tableta y escritorio, el contenido principal no se solapa ni se corta, incluido el texto ampliado al 200%.
- **SC-006**: Al cambiar una decisión central de color, de tipografía o de espaciado, el 100% de las vistas que la usan reflejan el cambio y no conservan un valor visual suelto de esa decisión.
- **SC-007**: El 100% de las páginas públicas, en cada idioma, tiene título propio y descripción breve, y existe una lista que enumera exactamente esas páginas.
- **SC-008**: Las combinaciones de texto y de controles publicadas no presentan fallos de contraste respecto de WCAG 2.2 AA, ni en el tema claro ni en el oscuro.
- **SC-009**: En al menos 4 de 5 recorridos de prueba, un reclutador que lee solo el resumen de un caso nombra el rol y el resultado clave en menos de 30 segundos.
- **SC-010**: En al menos 4 de 5 recorridos de prueba, un visitante llega desde cualquier módulo a Contacto en no más de 2 acciones.

## Assumptions

- La interfaz pública está en español y en inglés. El español es el idioma por defecto (`/`). No hay un tercer idioma.
- Hay un solo perfil. El nombre público es contenido pendiente y no cambia estos requisitos.
- El contacto es un destino visible con correo, perfil profesional y enlace al CV. No hay cuentas, formulario, mensajes internos ni agenda.
- El contenido de cada caso parte de la plantilla en `specs/001-ux-portfolio-platform/content/`. El responsable completa los espacios vacíos antes de publicar.
- El contenido se publica con la plataforma. No hay edición por usuarios autenticados ni panel de administración.
- El sistema visual tiene un tema claro y un tema oscuro. Los valores del oscuro se fijan tras aprobar su prototipo; hasta entonces no hay valores vigentes.
- El responsable redacta todos los textos en los dos idiomas. Los casos se anonimizan igual en ambos (FR-030); la trayectoria muestra los nombres reales de empresas e instituciones (FR-044).
- Los casos demuestran criterio de producto en entornos de impacto operativo. No es obligatorio que sean del mismo sector.
- "Resultados o aprendizajes" acepta un efecto observado, una métrica o un aprendizaje explícito. No exige una métrica de negocio en cada caso.
- La conformidad de accesibilidad es WCAG 2.2 AA, que cubre la exigencia 2.1/2.2 planteada por el responsable.
- La auditoría de SC-004 es la auditoría pública automatizada que el responsable fijó como criterio de aceptación, ejecutada sobre la versión pública en vista de teléfono y de escritorio.
- Las reglas de implementación del proyecto viven en la constitución. Esta especificación no las convierte en requisitos de usuario.
- Ninguna pantalla diseñada forma parte de este alcance hasta que el responsable la apruebe. Aquí se fijan resultados, no la composición visual de cada vista.
- Quedan fuera: bitácora o blog, filtros de proyectos, formulario de contacto, un tercer idioma, traducción automática, detección automática del idioma y cualquier producto B2B distinto de este portafolio.
