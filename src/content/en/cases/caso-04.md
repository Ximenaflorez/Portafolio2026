---
slug: case-04-vacancy-pipeline
type: product
status: published
order: 4
title: "The vacancy pipeline stalls in the first stages"
seo:
  title: "Vacancy pipeline | Case study"
  description: "Research on a B2B ATS vacancy pipeline: up to 20 stages, more than 50% dropped at the start, and 45% of use coming from mobile."
summary:
  product: "The pipeline an applicant moves through, up to 20 stages, including medical, psychological, and technical tests and their integrations."
  role: "UX/UI Designer"
  team: "Product Owner, Customer Success, and development"
  duration: "To complete"
  keyResult: "An analyst spent up to 10 days gathering candidates, and more than 50% were dropped in the first two stages."
  indexLine: "Up to 10 days to gather candidates, and more than 50% dropped at the start."
  productType: "B2B / ATS"
  sector: "ATS"
  kind: "Redesign research"
---

_Company names and some figures were anonymized and changed for confidentiality._

## 1. Initial problem

_Tension: why did this matter?_

**Business context:** The vacancy module of a B2B recruiting platform is the pipeline. An applicant moves through an evaluation of up to 20 stages: medical, psychological, and technical tests, and the integration for each one.

**User problem:** Analysts' daily work was stalling. Gathering candidates could take up to 10 days. In the first two stages more than 50% were dropped automatically —for example, from 500 to 200— often because conditional questions were misconfigured. The people who remained were not always the best fit, so the analyst spent a whole morning searching the rejected set to add them back by hand. The database key was the email address, not the ID document: the same person, using different emails, showed up as many as 3 times. If someone withdrew from fatigue or a poor experience, they vanished. The company never received the reason.

**How we knew:** A focus group with large companies and observation of how they ran the pipeline.

**Constraints:** Technical complexity. The module depends on several integrations, each with its own versioning. Without a map of the last edge case, development could not estimate time or cost.

**Goal and success metric:** Give visibility and control over a process of up to 20 stages, and let someone move from one stage to another that is not the next, for example from stage 3 to stage 15. On mobile —45% of use today, mostly small businesses— the hypothesis was to reach 55% in the first quarter and cut by 20% the people who complained about the layout.

## 2. Research and data

_Discovery: what was not obvious?_

- **10 days** to gather candidates in the pipeline
- **50%** or more were dropped in the first two stages
- **45%** of the people using the module come in on mobile

**Methods:** A focus group with large companies and process observation. That was set against the time an analyst spent gathering candidates and against desktop and mobile use.

**Sample:** Analysts at large companies who run the pipeline, and module use at small businesses, which account for most mobile access.

**Findings:**

- They did not know how long someone had been stuck in a stage. They had charts in an analytics board, but not the day-to-day detail.
- The file the platform exported was vertical. It could not be filtered, so they built their own spreadsheet to lay the data out horizontally.
- There was no veto filter. If someone who had already been a problem applied again and moved forward, analysts hunted for them by hand to remove them.
- Psychometric tests blocked the pipeline stage by stage and delayed the process for days. People asked to run those evaluations in parallel.

> **Insight that changed the course:** The pipeline does not stall only because it has 20 stages. It stalls because the analyst cannot see how long someone has been in a stage, cannot filter what they export, and has to hunt by hand for someone who should not have moved forward.

## 3. Solution architecture

_Decision: what did you choose and what did you drop?_

**Key decisions:** _To complete · how someone moved between non-consecutive stages, and which approach was dropped._

**System and components:** _To complete · stages, movement, the mobile view, and integrations._

**Collaboration with engineering:** Development would not estimate time or cost until design had mapped the last edge case. Each integration had its own versioning, and without that map viability did not close.

**Validation:** _To complete · tests of the redesign with analysts._

## 4. Results and learnings

_Impact and reflection_

**Results:** _To complete · effect on gathering time, on drop-off, and on mobile use._

**What didn't work:** _To complete · which redesign hypotheses failed, or what had to be corrected._

**What I would do differently:** _To complete · your reflection as a designer._

**Next steps:** _To complete · a pilot, and metrics for mobile use and time in each stage._

## 5. Visual support

_Visual evidence_

**Visual refactor:**
![Refactored pipeline view: filters on the left, the candidate list in the center, and talent and stage management on the right.](/casos/caso-04-refactor.png "Refactor visual.")

**Version before the refactor and the research:**
![Pipeline table before the redesign: suggested, candidates, preselected, and hired stages, with columns for application date, profile, education, age, gender, salary, experience, and languages.](/casos/caso-04-antes.png "Pipeline version before the refactor and the research.")

**Mobile view:** _To complete · image here._

**Individual candidate management, desktop:**
![A candidate profile on desktop: personal details on the left, résumé and video in the center, and notifications and stages on the right.](/casos/caso-04-candidato.png "Individual candidate management on desktop.")
