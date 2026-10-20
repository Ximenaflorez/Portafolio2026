---
slug: case-02-partner-financial-reports
type: product
status: published
order: 2
title: "Clear financial reports for a fintech's partners"
seo:
  title: "Financial reports for partners | Case study"
  description: "Research and redesign of a B2B platform's reports so a lender's partners can understand their accounting close."
summary:
  product: "An accessible reading of collections, credit, and the accounting close, so a partner understands the money without being an analyst."
  role: "Product Designer"
  team: "Four people in product design"
  duration: "To complete"
  keyResult: "83.3% used the company's own reports, but 33.3% had no financial knowledge."
  indexLine: "Redesigning reports so a partner can read the close and sell the credit."
  productType: "B2B / Fintech"
  sector: "Fintech"
  kind: "Research and interface design"
---

_Company names and some figures were anonymized and changed for confidentiality._

## 1. Initial problem

_Tension: why did this matter?_

**Business context:** A consumer-credit fintech had a B2B platform for its partner stores. The underlying question was whether the financial reports were clear. If they were not, the partner stopped offering credit.

**User problem:** Partners struggled to read the accounting close and the day's account reconciliation. They could not tell whether the portfolio was theirs or the fintech's, and internal terms —such as the name of the guarantee— meant nothing to them. The money took more than 104 days to come back, and some businesses stopped offering credit. Without live detail on collections, they built their own control on paper.

**How we knew:** Interviews with partners from different sectors and sizes, including mattresses, general retail, and footwear, according to how often they opened the reports.

**Constraints:** 33.3% of the people interviewed had no knowledge of data analysis or finance. The interface had to be readable without that training.

**Goal and success metric:** Understand how they use the reports, in order to propose something useful in daily operations: how they read the figures, what blocks them, which data matters, and when they look.

## 2. Research and data

_Discovery: what was not obvious?_

- **83.3%** used the fintech's own reports
- **33.3%** had no financial or data-analysis knowledge
- **104 days** or more before the money came back to the business

**Methods:** Interviews with partners from different sectors. Business size and how often they used the reports were both considered. Findings were grouped in an affinity map.

**Sample:** Partner stores of different sizes and sectors, including mattresses, general retail, and footwear.

**Findings:**

- Almost everyone used the fintech's reports. Nobody opened an external analytics tool.
- The platform did not allow the store's own discounts to be attached.
- The hierarchy and the names of the values raised the cognitive load.
- Payment reports did not include the detail of each movement.
- There was no training, and the frequently asked questions did not clarify the terms.

> **Insight that changed the course:** The partner's customer has no credit culture either, so the partner has to explain the process. If the partner does not understand the report, they cannot sell the credit.

## 3. Solution architecture

_Decision: what did you choose and what did you drop?_

- **Dashboard:** Sales, credit, collections, and dates\
  Core piece of the MVP
- **Glossary:** Financial terms and frequently asked questions\
  Second piece of the MVP

**Key decisions:** The MVP was the dashboard and the glossary. A guided tour for new and existing people mattered a lot, but it was less feasible right away, so it stayed out of this release.

**System and components:** The "My reports" tab opens a dashboard, credit, collections, and statistical and commercial reports. The dashboard compares collections, credit, and cancellations with the previous period. The close separates what is in the partner's favor from the next payment, with weekly sales bars and a breakdown of credit issued, portfolio balance, and collections. The UI kit brings together color, typography, chips, bar charts, and number cards. References included accounting software, another fintech's payment reports, and clear financial glossaries.

**Collaboration with engineering:** _To complete · handoff and changes to the current reporting system._

**Validation:** Tests with people. Everyone found the information from the side menu. The accounting-close summary was understandable, and green for money in and red for money out sped up reading the dashboard.

## 4. Results and learnings

_Impact and reflection_

**Results:** In the test, everyone reached the information they cared about from the side menu. The accounting-close summary was understandable. Color —green for money in, red for money out— made the dashboard faster to read.

**What didn't work:** The amount to receive or to pay needed to stand out more, and the partner's balance needed to be separated more clearly. Explanations for technical words were missing, as was the cancellation history on the dashboard.

**What I would do differently:** A clean interface is not enough if the person does not know the concepts. The glossary and the guided tour should have shipped with the dashboard, not after it.

**Next steps:** One place to explain financial terms, a step-by-step tour for people opening it for the first time and for people who already used the platform, and short videos when the platform changes.

## 5. Visual support

_Visual evidence_

![My reports dashboard with collections, credit, cancellations, the current balance, the period close, and weekly sales.](/casos/caso-02.png "My reports: the partner dashboard.")

**Findings:**
![What we found: charts of report use and financial knowledge, next to two store account closes.](/casos/caso-02-hallazgos.jpg "What the research found.")

**My reports architecture:**
![Platform tree: My reports, credit, collections, and accounting, statistical, and commercial reports, with the dashboard marked.](/casos/caso-02-arquitectura.jpg "My reports information architecture.")

**Prioritization matrix:**
![Importance and feasibility matrix, with the dashboard and the glossary in the high-importance, high-feasibility area.](/casos/caso-02-priorizacion.jpg "Prioritization: importance and feasibility.")

**Affinity map:**
![Affinity map in two groups: technical gaps in the reports, and missing knowledge or information.](/casos/caso-02-afinidad.jpg "Affinity map of the findings.")
