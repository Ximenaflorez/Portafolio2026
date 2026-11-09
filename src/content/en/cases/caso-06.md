---
slug: case-06-brand-colombia-ui-kit
type: product
status: draft
order: 6
title: "A UI kit so Brand Colombia looks the same"
seo:
  title: "Brand Colombia UI kit | Case study"
  description: "A personal 2024 UI kit, made without artificial intelligence, so Brand Colombia keeps the same color, type, and components on every screen."
summary:
  product: "A visual system for showing Brand Colombia with the same color, the same type, and the same components on any screen."
  role: "Product Designer"
  team: "Personal project"
  duration: "2024"
  keyResult: "The brand manual becomes a UI kit: five colors, Poppins, and components for mobile, tablet, and desktop."
  indexLine: "A personal 2024 UI kit, without AI, so the brand matches on every screen."
  cardTitle: "UI Kit: It's Colombia, not columbia"
  cardLine: "A personal 2024 project, without AI. It turns the brand manual into color, Poppins, icons, and components for mobile, tablet, and desktop."
  cardTags:
    - Figma
    - Design System
    - UI Kit
  screenUrl: "https://www.figma.com/proto/mPaIRCq791jqOBT1CyIkit/Design-Systems-Colombia?node-id=529-22811&viewport=-286%2C-1923%2C0.18&t=N0fSo52ckhklQomP-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=529%3A22811&page-id=93%3A263"
  screenLabel: "View the presentation"
  productType: "Design system"
  sector: "Brand"
  kind: "UI kit"
---

*A personal 2024 project about the public country brand. It is not an official commission. It was built by hand, without artificial intelligence.*

## 1. Initial problem

*Tension: why did this matter?*

**Business context:** The deck opens with "It's Colombia, not Columbia" and with "Colombia, everyone's home." The system exists so the brand stays coherent when it shows the country's places, and so it is recognized abroad.

**User problem:** Someone arriving to learn, buy, or invest should not meet a different brand on every screen. The site has to stay current and welcome them before that decision.

**How we knew:** The brand manual and the logo themselves. This file has no interviews and no tests with people.

**Constraints:** Follow the manual. Turn it into a kit instead of inventing another palette. A personal project, made in Figma, without artificial intelligence.

**Goal and success metric:** A UI kit that leaves color, type, icons, and components ready for mobile, tablet, and desktop. The deck closes by inviting a review of the prototype and the handoff.

## 2. Research

*Discovery: what was not obvious?*

**Methods:** A reading of the manual and of the "CO Colombia" logo, then a translation into kit pieces: moodboard, color, shapes, type, icons, buttons, bar, cards, mockups, and sketches for home, sign-in, and city.

**Findings:**

- Yellow is tied to the sun and to the riches of the heritage.
- Blue, to the rivers and the oceans.
- Red stands for joy and passion.
- Green stands for natural wealth.
- Violet is a nod to the orchid, the national flower.
- The logo yields five color versions. The brand becomes a container that adapts to what the country holds.
- There are also black-and-white, grayscale, and single-tone versions.
- The kit's voice is Poppins, in Bold, Medium, and Regular. The scale runs from a 96 px H1 to a 10 px overline.
- The values the brand wants people to perceive are warmth, diversity, hospitality, and joy.

![Principles and values board: the brand essence text and four yellow chips, Warmth, Diversity, Hospitality, and Joy.](/casos/caso-06-principios.png "The values the brand wants people to perceive.")

The logo says it this way: "This is our face to the world, how we like to see ourselves and how we are surely already known. It stands for the meeting of our regions and their different riches. It is colorful, outgoing, and warm, like our people. The image of our exports, tourism, and investment projects is also that of each Colombian who greets the world with a smile that does not fade."

> **Insight that changed direction:** The five colors are not decoration. Each one names a part of the country, and the kit has to carry that.

## 3. Solution architecture

*Decision: what did you choose, and what did you set aside?*

**Key decisions:** One kit instead of one-off screens. A new palette was set aside: color comes from the logo. Poppins is the only family. Buttons cover default, hover, focus, and disabled, in blue, yellow, red, secondary blue, and ghost, and in small, medium, and large. Mobile, tablet, and desktop are separate views with keyframes, so interactive pieces behave the same way and no information is lost. The grid is fixed at 360, 1024, and 1440 px.

**System and components:** Interface text uses blue `#103F5C`. Yellow `#F3BD37` marks the values. These are the kit's boards.

**Moodboard:** Visual references and color samples, before the components.

![Brand Colombia moodboard: yellow, blue, and red references, with Blue/600, Yellow/400, and Red/600 swatches.](/casos/caso-06-moodboard.png "Visual references that follow the manual's yellow, blue, and red.")

**Layouts:** Three widths. On mobile, 360 px, 4 columns, a 16 px margin, and a 16 px gutter. On tablet, 1024 px, 8 columns, and a 24 px margin. On desktop, 1440 px, 12 columns, and a 24 px margin. The tablet and desktop gutter is also 16 px.

**Colors:** Besides the logo's five, there are ramps for neutral, gray, and secondary colors, and alerts for warning, error, check, and info.

![Kit ramps: neutrals, primary blue, yellow, red, and alerts for error, information, warning, and confirmation.](/casos/caso-06-rampas.png "Besides the logo's five, the kit sets neutrals, a primary, secondaries, and alerts.")

**Shapes:** A table of shapes. The board says that how text, images, and buttons are arranged defines the experience and the usability.

![Shape table: radii from 0 to 56 px, solid and dashed styles, and borders of 0, 1, and 2 px.](/casos/caso-06-shapes.png "Shape sets the radius and the border of buttons, cards, fields, and alerts.")

**Icons:** Four groups: Edit, Tools, Alerts, and Custom.

![Icon grid with names: search, gear, arrows, trash, map, location, calendar, and others.](/casos/caso-06-iconos.png "Icons name the action so the interface stays recognizable.")

**Buttons:** Default, hover, focus, and disabled. Types are primary blue, primary yellow, primary red, secondary blue, and ghost. Sizes are small, medium, and large.

![Small and medium buttons in blue, yellow, red, outline, and a light fill, in default, hover, focus, and disabled.](/casos/caso-06-botones.png "Each size repeats the same colors and the four states.")

**Text fields:** Label, supporting text, icon on the left, icon on the right, and icon on both sides. States are default, focus, active, filled, error, disabled, and filled/disabled. Sizes are small and medium. There are also fields for country, phone, email, and password.

**Navigation bar:** On mobile, home, places, and calendar. The icon has default, select, and disabled. On desktop, the menu reads «Dónde quieres ir», «Esto es colombia», «Cultura», and «Extranjeros».

![Mobile bar with Home, Places, and Calendar. Each row marks one of the three.](/casos/caso-06-nav.png "The active icon changes color to say which page the person is on.")

**Dropdown:** Default, open, filled, error, disabled, and filled/disabled, in small and medium.

**Search:** Default, hover, select, and open. The top bar has a plain state and a state with a notification. The avatar can be active, inactive, or a letter.

**Cards:** Three modes, primary, second, and third, in default, hovered, focus, and disabled. There are Caribe and Andes cards, in default and large.

![San Andrés cards on mobile, tablet, and desktop, repeated in three states.](/casos/caso-06-cards.png "The same card changes layout with the width and the state.")

**Menus:** Title and subtitle in default, hover, and select, with a close control, and a main menu for mobile.

**Tabs:** Default and select. Tags name Caribe, Andes, Amazonas, Pacífico, and Llanos orientales, in small and medium, with default, hover, and select.

**Responsive:** The same page in three frames. Mobile is 360 × 800 px, with a top bar, search, tags, an image, stacked cards, and a bottom bar. Tablet is 1024 × 768 px and desktop is 1440 × 1024 px, with an image, "Colombia, everyone's home," and this line: "Colombia offers you a unique diversity in its tourism, where you can enjoy adventure, cultural, community, and food tourism, and much more." On desktop the menu sits at the top, next to search and the avatar.

**Validation:** *To complete: tests with people.* The deck has no usage results. It closes by inviting a review of the prototype and the handoff.

## 4. Results and learnings

*Impact and reflection*

**Results:** A personal UI kit that turns the manual into reusable pieces: moodboard, layouts, colors, shapes, icons, buttons, text fields, navigation bar, dropdown, search, cards, menus, tabs, and responsive views, plus the Poppins scale and the home, sign-in, and city sketches. There is no adoption figure. The file does not say the country brand shipped it.

## 5. Visual support

*Visual evidence*

![Card titled Design System. The text says the Brand Colombia system seeks visual coherence when showing the country's places and making the brand recognizable.](/casos/caso-06-marca.png "Why the system exists: the same brand when showing the country's places.")

![Branding board with the CO Colombia logo, the meaning of yellow, blue, red, green, and violet, five color versions, colombia.co in those hues, and black-and-white, grayscale, and single-tone versions.](/casos/caso-06-colores.png "The logo's five colors and the versions that turn the brand into an adaptable container.")

![Three Poppins weights, Bold, Medium, and Regular, and the scale from a 96 px H1 to a 10 px overline.](/casos/caso-06-tipo.png "Poppins is the only family. The scale covers titles, body, buttons, caption, and overline.")
