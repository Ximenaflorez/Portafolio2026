---
slug: caso-06-ui-kit-marca-colombia
type: product
status: draft
order: 6
title: "Un UI kit para que Marca Colombia se vea igual"
seo:
  title: "UI kit de Marca Colombia | Caso de estudio"
  description: "UI kit personal de 2024, sin inteligencia artificial, para que Marca Colombia use el mismo color, tipo y componentes en cada pantalla."
summary:
  product: "Un sistema visual para mostrar Marca Colombia con el mismo color, la misma tipografía y los mismos componentes en cualquier pantalla."
  role: "Product Designer"
  team: "Proyecto personal"
  duration: "2024"
  keyResult: "El manual de marca queda en un UI kit: cinco colores, Poppins y componentes para móvil, tablet y escritorio."
  indexLine: "UI kit personal de 2024, sin IA, para la misma marca en cada pantalla."
  cardTitle: "UI Kit: It's Colombia, not columbia"
  cardLine: "Proyecto personal de 2024, sin IA. Pasa el manual de marca a color, Poppins, iconos y componentes para móvil, tablet y escritorio."
  cardTags:
    - Figma
    - Design System
    - UI Kit
  screenUrl: "https://www.figma.com/proto/mPaIRCq791jqOBT1CyIkit/Design-Systems-Colombia?node-id=529-22811&viewport=-286%2C-1923%2C0.18&t=N0fSo52ckhklQomP-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=529%3A22811&page-id=93%3A263"
  screenLabel: "Ver la presentación"
  productType: "Design system"
  sector: "Marca"
  kind: "UI kit"
---

*Proyecto personal de 2024 sobre la marca país pública. No es un encargo oficial de la marca. Se armó a mano, sin inteligencia artificial.*

## 1. Problema inicial

*Tensión: ¿por qué importaba?*

**Contexto de negocio:** La presentación abre con «It's Colombia, not Columbia» y con «Colombia, la casa de todos». El sistema existe para que la marca se vea coherente al mostrar los lugares del país y se reconozca fuera.

**Problema del usuario:** Quien llega a conocer, comprar o invertir no debería encontrar una marca distinta en cada pantalla. La página tiene que seguir vigente y dar la bienvenida antes de esa decisión.

**Cómo lo sabíamos:** El propio manual de marca y el logo. No hay entrevistas ni pruebas con personas en este archivo.

**Restricciones:** Seguir el manual. Traducirlo a un kit, no inventar otra paleta. Trabajo personal, hecho en Figma y sin inteligencia artificial.

**Objetivo y métrica de éxito:** Un UI kit que deje color, tipo, iconos y componentes listos para móvil, tablet y escritorio. El cierre de la presentación invita a revisar el prototipo y el handoff.

## 2. Investigación

*Descubrimiento: ¿qué no era obvio?*

**Métodos:** Lectura del manual y del logo «CO Colombia», y paso de esa lectura a piezas del kit: moodboard, color, formas, tipo, iconos, botones, barra, tarjetas, mockups y bocetos de inicio, ingreso y ciudad.

**Hallazgos:**

- El amarillo se asocia al sol y a las riquezas del patrimonio.
- El azul, a los ríos y los océanos.
- El rojo representa la alegría y la pasión.
- El verde representa la riqueza natural.
- El violeta es un guiño a la orquídea, la flor nacional.
- Del logo salen cinco versiones de color. La marca queda como un contenedor que se adapta a lo que tiene el país.
- También hay versiones en blanco y negro, en escala de grises y en un solo tono.
- La voz del kit es Poppins, en Bold, Medium y Regular. La escala va del H1 de 96 px al overline de 10 px.
- Los valores que la marca quiere que se perciban son calidez, diversidad, hospitalidad y alegría.

![Lámina de principios y valores: el texto de la esencia de la marca y cuatro pastillas amarillas, Calidez, Diversidad, Hospitalidad y Alegría.](/casos/caso-06-principios.png "Los valores que la marca quiere que se perciban.")

El logo lo dice así: «Esta es nuestra cara al mundo, como nos gusta vernos y por la que seguro ya nos conocen. Simboliza el encuentro entre nuestras regiones y sus distintas riquezas. Es colorido, extrovertido y cálido como nuestra gente. La imagen de nuestras exportaciones, turismo y proyectos de inversión es también la de cada colombiano que saluda al mundo con una sonrisa indeleble.»

> **Insight que cambió el rumbo:** Los cinco colores no son adorno. Cada uno nombra una parte del país, y el kit tiene que cargar con eso.

## 3. Arquitectura de la solución

*Decisión: ¿qué elegiste y qué descartaste?*

**Decisiones clave:** Un solo kit en lugar de pantallas sueltas. Se descartó una paleta nueva: el color sale del logo. Poppins es la única familia. Los botones cubren default, hover, focus y disabled, en azul, amarillo, rojo, azul secundario y ghost, y en tamaños small, medium y large. Móvil, tablet y escritorio se resuelven con vistas propias y keyframes, para que lo interactivo se comporte igual y no se pierda información. La rejilla se fija en 360, 1024 y 1440 px.

**Sistema y componentes:** El texto de interfaz usa el azul `#103F5C`. El amarillo `#F3BD37` marca los valores. Las láminas del kit son estas.

**Moodboard:** Referencias visuales y muestras de color, antes de los componentes.

![Moodboard de Marca Colombia: referencias en amarillo, azul y rojo, con muestras Blue/600, Yellow/400 y Red/600.](/casos/caso-06-moodboard.png "Referencias visuales que siguen el amarillo, el azul y el rojo del manual.")

**Layouts:** Tres anchos. En móvil, 360 px, 4 columnas, margen de 16 px y gutter de 16 px. En tablet, 1024 px, 8 columnas y margen de 24 px. En escritorio, 1440 px, 12 columnas y margen de 24 px. El gutter de tablet y escritorio también es de 16 px.

**Colores:** Además de los cinco del logo, hay rampas de neutro, gris y secundarios, y alertas de warning, error, check e info.

![Rampas del kit: neutros, azul primario, amarillo, rojo y alertas de error, información, advertencia y confirmación.](/casos/caso-06-rampas.png "Además de los cinco del logo, el kit fija neutros, primario, secundarios y alertas.")

**Shapes:** Una tabla de formas. La lámina dice que la disposición de texto, imágenes y botones define la experiencia y la usabilidad.

![Tabla de formas: radios de 0 a 56 px, estilo sólido y punteado, y bordes de 0, 1 y 2 px.](/casos/caso-06-shapes.png "La forma fija el radio y el borde de botones, tarjetas, campos y alertas.")

**Iconos:** Cuatro grupos: Editar, Herramientas, Alertas y Personalizado.

![Retícula de iconos con su nombre: búsqueda, engranaje, flechas, basura, mapa, ubicación, calendario y otros.](/casos/caso-06-iconos.png "Los iconos nombran la acción para que la interfaz se reconozca.")

**Botones:** Default, hover, focus y disabled. Tipos primary blue, primary yellow, primary red, secondary blue y ghost. Tamaños small, medium y large.

![Botones small y medium en azul, amarillo, rojo, contorno y fondo claro, en default, hover, focus y disabled.](/casos/caso-06-botones.png "Cada tamaño repite los mismos colores y los cuatro estados.")

**Text fields:** Etiqueta, texto de apoyo, icono a la izquierda, icono a la derecha e icono a ambos lados. Estados default, focus, active, filled, error, disabled y filled/disabled. Tamaños small y medium. También hay campos de país, celular, correo y contraseña.

**Navigation bar:** En móvil, casa, lugares y calendario. El icono tiene default, select y disabled. En escritorio, el menú dice «Dónde quieres ir», «Esto es colombia», «Cultura» y «Extranjeros».

![Barra de móvil con Inicio, Lugares y Calendario. En cada fila uno de los tres queda marcado.](/casos/caso-06-nav.png "El icono activo cambia de color para decir en qué página está la persona.")

**Dropdown:** Default, open, filled, error, disabled y filled/disabled, en small y medium.

**Search:** Default, hover, select y open. La barra superior tiene estado normal y con notificación. El avatar puede ir activo, inactivo o con una letra.

**Cards:** Tres modos, principal, segunda y tercera, en default, hovered, focus y disabled. Hay tarjetas de Caribe y de Andes, en default y large.

![Tarjetas de San Andrés en móvil, tablet y escritorio, repetidas en tres estados.](/casos/caso-06-cards.png "La misma tarjeta cambia de composición según el ancho y el estado.")

**Menús:** Título y subtítulo en default, hover y select, con cierre, y un menú principal para móvil.

**Tabs:** Default y select. Los tags nombran Caribe, Andes, Amazonas, Pacífico y Llanos orientales, en small y medium, con default, hover y select.

**Responsive:** La misma página en tres marcos. Móvil de 360 × 800 px, con barra superior, búsqueda, tags, imagen, tarjetas apiladas y barra inferior. Tablet de 1024 × 768 px y escritorio de 1440 × 1024 px, con imagen, «Colombia, la casa de todos» y esta línea: «Colombia te ofrece una diversidad única en su oferta turística, donde podrás disfrutar de turismo de aventura, cultural, comunitario, gastronómico y mucho más.» En escritorio el menú va arriba, junto a la búsqueda y el avatar.

**Validación:** *Por completar: pruebas con personas.* La presentación no trae resultados de uso. Cierra invitando a revisar el prototipo y el handoff.

## 4. Resultados y aprendizajes

*Impacto y reflexión*

**Resultados:** Quedó un UI kit personal que traduce el manual a piezas reutilizables: moodboard, layouts, colores, shapes, iconos, botones, text fields, navigation bar, dropdown, search, cards, menús, tabs y responsive, más la escala Poppins y los bocetos de inicio, ingreso y ciudad. No hay una cifra de adopción. El archivo no dice que la marca país lo haya puesto en producción.

## 5. Apoyo visual

*Evidencia visual*

![Tarjeta titulada Design System. El texto dice que el sistema de Marca Colombia busca coherencia visual para mostrar los lugares del país y facilitar su reconocimiento.](/casos/caso-06-marca.png "Para qué existe el sistema: la misma marca al mostrar los lugares del país.")

![Lámina de branding con el logo CO Colombia, el significado de amarillo, azul, rojo, verde y violeta, cinco versiones de color, colombia.co en esos tonos, y versiones en blanco y negro, grises y un solo tono.](/casos/caso-06-colores.png "Los cinco colores del logo y las versiones que convierten la marca en un contenedor adaptable.")

![Tres pesos de Poppins, Bold, Medium y Regular, y la escala del H1 de 96 px al overline de 10 px.](/casos/caso-06-tipo.png "Poppins es la única familia. La escala cubre títulos, cuerpo, botones, caption y overline.")
