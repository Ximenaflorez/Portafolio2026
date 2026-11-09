---
slug: case-04-vacancy-pipeline
type: product
status: published
order: 2
title: "The vacancy pipeline stalls in the first stages"
seo:
  title: "Vacancy pipeline | Case study"
  description: "Research on a B2B ATS vacancy pipeline: up to 20 stages, more than 50% dropped at the start, and 45% of use coming from mobile."
summary:
  product: "The pipeline an applicant moves through: up to 20 stages, with medical, psychological, and technical tests, and the integration for each one."
  role: "UX/UI Designer"
  team: "Product Owner, Customer Success, and development"
  duration: "2 months from design"
  keyResult: "An analyst spent up to 10 days gathering candidates, and more than 50% were dropped in the first two stages."
  indexLine: "Up to 10 days to gather candidates, and more than 50% dropped at the start."
  cardLine: "Redesign and edge-case mapping for a 20-stage ATS pipeline. The 50% went to automatic discards the analyst could not see."
  cardTags:
    - UX Research
    - Flow maps
    - ATS
  productType: "B2B / ATS"
  sector: "ATS"
  kind: "Redesign research"
---

_Company names and some figures were changed for confidentiality._

![Vacancy prototype: filters on the left, the candidate list in the center, and talent management, with the stages, on the right.](/casos/caso-04-prototipo.jpg "Final vacancy prototype.")

## 1. Initial problem

_Tension: why did this matter?_

**Business context:** The vacancy module of a B2B recruiting platform is the pipeline. An applicant moves through up to 20 stages: medical, psychological, and technical tests, and the integration for each one.

**User problem:** Analysts' daily work was stalling. Gathering candidates could take up to 10 days. In the first two stages more than 50% were dropped automatically, for example from 500 to 200, often because conditional questions were misconfigured. Those discards often passed without the analyst seeing them. When they refined the set, they also did not know where each person had landed, because the subtables split them up. The people who remained were not always the best fit, so an analyst spent a whole morning searching the rejected set to add them back by hand. The database key was the email address, not the ID document: the same person, using different emails, showed up as many as 3 times. If someone withdrew from fatigue or a poor experience, they vanished, and the company never received the reason.

**How we knew:** A focus group with large companies, observation of the pipeline, Power BI dashboards, and analytics.

**Constraints:** Technical complexity. The module depends on several integrations, and each one has its own versioning. Without a map of the last edge case, development could not estimate time or cost.

**Goal and success metric:** Give visibility and control over up to 20 stages, and let someone move from one stage to another that is not the next, for example from stage 3 to stage 15. On mobile, 45% of use today and mostly at small businesses, the refactor aims to raise that 45% to 55% in the first quarter and to cut by 20% the complaints about the layout. Many people do not come in because of the number of problems and the lack of accessibility. Analysts said that, if they could, they would handle many decision points from the phone.

## 2. Research and data

_Discovery: what was not obvious?_

- **10 days** to gather candidates in the pipeline
- **50%** or more were dropped in the first two stages
- **45%** of the people using the module come in on mobile

**Methods:** A focus group with large companies and process observation. Power BI dashboards and analytics were reviewed, and vacancies with high mobility were taken as the sample. That was set against the time an analyst spent gathering candidates.

**Sample:** Analysts at large companies who run the pipeline, and module use at small businesses, where most mobile access is concentrated.

**Findings:**

- They did not know how long someone had been stuck in a stage. There were charts on an analytics board, but not the day-to-day detail.
- The file the platform exported was vertical and could not be filtered. They built their own spreadsheet and laid the data out horizontally.
- There was no veto filter. If someone who had already been a problem applied again and moved forward, analysts searched for them by hand to remove them.
- Psychometric tests blocked the move from one stage to the next and delayed the process for days. People asked to run those evaluations in parallel.

> **Insight that changed the course:** The pipeline does not stall only because it has 20 stages. It stalls because the analyst cannot see how long someone has been in a stage, cannot filter what they export, and has to search by hand for someone who should not have moved forward.

## 3. Solution architecture

_Decision: what did you choose and what did you drop?_

**Key decisions:** The first approach was a kanban board, like those in Jira or Azure. It did not work: the volume of data did not fit that view and, above all, analysts already work the way they do on LinkedIn. Because that board was not approved, the next design sat closer to LinkedIn. Filters stay on the right and stay in view. The cards, or the table, are more compact and show only what is relevant. Selection works as it does in Salesforce. Stages were the sharpest pain because they sat at the top. Now they are visible, and the analyst chooses a person and sends them on by dragging the component. Someone who was not chosen stays in one place. Automatic discards stay in view, so the team does not fall into a layer-8 error. Moving someone from one stage to another that is not the next, for example from stage 3 to stage 15, is already in the product and still in progress.

**Collaboration with engineering:** Development would not estimate time or cost until design had mapped the last edge case. Each integration had its own versioning. Without that map, viability did not close.

**Validation:** There was an early validation with analysts from 8 companies and with the internal sales people, who are the ones that sell the product. Each feature and each integration was shown. It helped because, together, they saw how each company operated and closed with a check on the macro processes: filters, the data that stays visible, and integrations. Even so, an early delivery with artificial intelligence is still needed, to avoid errors and to review the mobility and the layers of the integrations that may not have come up in those tests.

## 4. Results and learnings

_Impact and reflection_

**What didn't work:** Custom solutions were built for a long time. There were sub-boards for people who had been discarded or eliminated. An analyst could barely see, in one place, how their vacancies were going: they had to open stage by stage. The urgent move was to standardize, so the old versions would be left behind.

**What I would do differently:** From there I opened spaces with support, sales, and the companies, so we could react earlier, before the problem was already on top of us, and so what the companies needed could be connected to new features.

## 5. Visual support

_Visual evidence_

![Pipeline table before the redesign: suggested, candidates, preselected, and hired stages, with columns for application date, profile, education, age, gender, salary, experience, and languages.](/casos/caso-04-antes.png "Before")
![Pipeline after the redesign: filters on the left, the candidate list in the center, and talent and stage management on the right.](/casos/caso-04-despues.jpg "After")

**Mobile view:**

![Mobile candidate list for Auxiliar de empaque: each card shows city, ID, application status, match, date, completeness, and experience. A bar at the bottom switches the stage.](/casos/caso-04-movil.png "Mobile view of the pipeline.")
