---
slug: case-05-rules-orchestrator
type: product
status: published
order: 1
featured: true
title: "Orchestrator of metrics and qualitative feedback with AI"
seo:
  title: "Metrics and feedback with AI | Case study"
  description: "The monthly close of a B2B ATS groups complaints and computes the metrics under a 3 USD cap. The decision stays with a person."
summary:
  product: "A monthly close for a B2B ATS: it groups complaints, computes the metrics, and leaves the decision with a person, under a spending cap the model cannot cross."
  role: "UX Lead, Technical Product Designer"
  team: "UX leadership and engineering (simulated)"
  duration: "Fourth quarter of 2026"
  keyResult: "The close went from a manual process to a cycle under 3 minutes, with a 3 USD cap and no ticket created without a person."
  indexLine: "From a manual close to a cycle under 3 minutes and 3 USD."
  productType: "B2B / ATS"
  sector: "Spec-Driven Development"
  kind: "Spec-led design with a human decision"
  screenUrl: "https://ximenaflorez.github.io/orquestador/"
  specUrl: "https://github.com/Ximenaflorez/orquestador"
---

_Company names and some figures were anonymized and changed for confidentiality._

![UX metrics for the month: the Excel upload, CSAT and CES for vacancy creation, catalog, and vacancy management, in July and August 2026, with the total and how many people rated.](/casos/caso-05-metricas.jpg "UX metrics for the month: CSAT and CES by module.")

## 1. Initial problem

_Tension: why did it matter?_

**Business context:** Each month, a B2B ATS operation delivers a workbook with satisfaction (CSAT), effort (CES), and dozens of comments. That is what the committee uses to decide which pains to address.

**User problem:** As UX Lead, putting the monthly report together depended entirely on my manual work. I used spreadsheets with parametric formulas and NotebookLM to explore the qualitative feedback. The real bottleneck was data intake: it was done by hand, section by section. The analysis took hours of operational work to label the information and deliver a structured, actionable backlog to the Product Manager (PM).

**How we knew:** All the qualitative information arrived through an open field, so the same pain was written in a thousand different ways (for example, “The screen stays blank” vs. “The screen goes blank”). We knew that standardizing this required the same data-correlation logic that makes NotebookLM so strong: embeddings.

**Constraints:** The work started in writing, before the screen. The run creates no tickets: Jira opens only by hand, and only from what was already kept. The model does not compute figures or choose the alert color; the program does. Each run has a 3 USD cap and must finish in under 3 minutes. If the spend hits the cap, it stops and the rest returns to a person. If a sheet is missing or the month does not add up, there is no official report: a notice arrives. The source workbook stays intact.

**Goal and success metric:** The metrics table and the labeled list come out in under 3 minutes. At least 85% of comments keep the correct label and module, without me correcting them.

## 2. Research

_Discovery: what was not obvious?_

**Methods:** Before choosing tools, I separated which part of the close is arithmetic and which part needs reading. Averages can be redone: a 10% sample of the scores has to return the same CSAT and the same CES if someone calculates them by hand again.

**Sample:** The real workbook does not enter the repository. Tests use fictional books for July, August, and September. Each rate comes from that month’s book.

**Findings:**

- The program computes CSAT, CES, and the alert color. The model does not write figures.
- What needs reading is the complaint: what kind it is, and which part of the product it belongs to. If confidence falls below 70%, it is not forced into a label. It waits for a person.
- If the model decides alone, the two example sentences can land in the same group or in two, depending on the day.

> **Insight that changed direction:** Working with AI, here, meant writing rules the model cannot change. It groups comments only if the source workbook is complete. The screen shows what that run already saved.

## 3. Solution architecture

_Decision: what did you choose, and what did you set aside?_

**Key decisions:** The order was constitution, specification, plan, tasks, and only then implementation. Four controls are checked on every change: a human gate, a closed taxonomy, an audit log, and a kill switch. Without an audit, the finding cannot go to the board. If I turn the cycle off, the report leaves the committee's inbox and the Excel file stays intact for a manual close. A chat among several agents was dropped, as was asking the model for the averages, and using a notebook or the paid chat plan as the engine: the run needs an API it can call, cut off, and count.

**System and components:** The cycle is a graph of five steps: intake, metrics, voice of the customer, report, and gate. Sentences whose cosine similarity reaches 0.85 form one finding. On this machine that comparison comes from Gemini, model gemini-embedding-001. The title summarizes, in two lines at most. Each original comment, already anonymized, is kept, and the program does the count. The screen has four trays, and they are states of a decision:

- **Save the month.** There is no decision yet. It stays or it goes.
- **Labeled.** It stays, and it has no key yet. Send to Jira appears only here.
- **Backlog.** It already has a key.
- **Excluded.** It goes, and it is kept as a discard. It is not deleted.

**Collaboration with engineering:** I am the UX Lead. I left the rules written before the screen, I use the close, and I open Jira by hand. Engineering on this cut is simulated: the code was written only after an explicit yes, and only inside what those rules had already closed.

**Validation:** With the July book I read the report without opening the sheets. If the file is incomplete, there is a notice and no official report. If a comment falls below 70%, it enters the queue and no ticket is born.

## 4. Results and learnings

_Impact and reflection_

**Results:** On the test months the cycle fits in under 3 minutes and in 3 USD. At least 85% of comments keep the correct label and module, without me correcting them. `listo_para_comite` also requires a completion rate of at least 85%. Closing the queue by hand does not turn that flag on. Findings that reach the committee bring the anonymized comment and the reason. No run creates tickets on its own. _To complete · the figure from the real workbook, which does not enter the repository._

**What didn't work:** The screen nearly asked the model for a new reading every time someone wanted to see the comment. The spend would have moved to the consultation, not the close.

**What I would do differently:** I would leave the 0.85 threshold as a visible decision in the interface, not only in the configuration. Whoever recruits or leads design needs to see that grouping is a rule, not a preference of the model.

![UX metrics for the month: the Excel upload, CSAT and CES for vacancy creation, catalog, and vacancy management, in July and August 2026, with the total and how many people rated.](/casos/caso-05-metricas.jpg "UX metrics for the month: CSAT and CES by module.")

![Findings for July 2026: summary, module, label, severity, and how many times each repeats, with Stay and Go.](/casos/caso-05-hallazgos.png "Findings for the month: Stay or Go.")

_The public page is read-only. Uploading the Excel file, saving whether it stays or goes, and sending to Jira run on a private server, with the Python program, the Jira credentials, and that month's files. On a public URL those keys would be exposed, and anyone could change the data or create tickets._
