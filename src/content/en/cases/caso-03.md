---
slug: case-03-candidate-catalog
type: product
status: published
order: 3
title: "Talent search in a catalog of 50,000 profiles"
seo:
  title: "Candidate catalog search | Case study"
  description: "Redesign of cold search in a B2B catalog of 50,000 profiles, so a recruiter can filter without repeating the task or exporting the list."
summary:
  product: "A dense table and a single prompt, so a recruiter can find talent without typing ID numbers one by one."
  role: "Product Designer, UX/UI Lead B2B"
  team: "Customer Success and Product Management"
  duration: "Third quarter of 2026"
  keyResult: "Search went from 8 clicks to 3, without typing each ID or exporting the list."
  indexLine: "From 8 clicks to 3, to search talent in a catalog of 50,000 profiles."
  productType: "B2B / ATS"
  sector: "ATS"
  kind: "Research and interface design"
---

_Company names and some figures were anonymized and changed for confidentiality._

## 1. Initial problem

_Tension: why did this matter?_

**Business context:** The candidate catalog is the core database of a B2B recruiting platform. Companies search talent across 50,000 profiles, often cold: the person has not applied to that opening.

**User problem:** That search was not tuned, and the friction contributed to 3 Enterprise companies leaving every month. To review someone, the analyst typed the ID number one by one. They could not save filters for the operational roles that come back, so they rebuilt the same search from scratch. Because the key facts were not together, they exported the list to a spreadsheet to block vetoed profiles and cross city, experience, and salary expectation.

**How we knew:** Time spent on desktop and mobile, crossed with NPS, CSAT, and CES, and those three accounts leaving each month.

**Constraints:** The work was planned for the third quarter of 2026 and competed with technical debt in other B2B products. It had to be argued to leadership, product management, customer success, and the development lead before it could enter the quarter.

**Goal and success metric:** Cut search time, make talent visible, and set the parameters with artificial intelligence, going after the causes of churn. In the test, the task had to take fewer clicks than in the previous system.

## 2. Research and data

_Discovery: what was not obvious?_

- **50,000** profiles available in the catalog
- **7** companies in the focus group, the highest-revenue ones
- **3** Enterprise companies leaving each month

**Methods:** Mixed analysis. Quantitatively, time on screen for desktop and mobile, crossed with NPS, CSAT, and CES. Qualitatively, a focus group. Findings were ordered by technical difficulty and frequency of use.

**Sample:** The 7 companies that generate the most revenue, with recruiters who search high-turnover roles.

**Findings:**

- Their mental model was anchored in the professional search tool they already used every day.
- They could not ask for similar profiles automatically for roles that repeat.
- To decide if someone fit, city, education, keywords, salary expectation, and ID were enough, without opening the full résumé.
- Needs were scattered across the roadmap. They were grouped so development could ship in MVPs.

> **Insight that changed the course:** The recruiter does not want another way to look at people: they want to search the way they already search, and decide from a few facts. If they have to open every résumé, cold search does not close.

## 3. Solution architecture

_Decision: what did you choose and what did you drop?_

- **Dense table:** Name, profile, date, age, city, salary\
  Main view of the catalog
- **One prompt:** The description becomes filters\
  Category, experience, and salary

**Key decisions:** A card layout was dropped. With this many profiles, scanning at volume needs a dense table, as in the reference search tool and in a CRM built for large data sets. A continuous chat for refining the profile was also dropped: keeping the conversation through an API was too expensive, and companies were not going to pay that extra cost. What remained was one prompt per search, in a single transaction.

**System and components:** A panel on the left takes a description in natural language —for example, a technical lead with five years and certain languages— and turns it into filters for job category, years of experience, and salary range. The table shows name and photo, profile percentage, last update, age, location, salary, latest job, and a keyword-match indicator. Each row has a selector so several profiles can be acted on without leaving the screen.

**Collaboration with engineering:** The continuous chat was reviewed with development during prototyping. The cost of keeping the conversation made it unviable. One transaction per search was the form that worked for cost and for use.

**Validation:** Usability tests compared with the previous system. Recruiters found and used frequent options more quickly. The search task went from 8 clicks to 3.

## 4. Results and learnings

_Impact and reflection_

**Results:** In the comparative test, search dropped from 8 clicks to 3, and frequent options were used more quickly. _To complete: effect on account churn after launch._

**What didn't work:** The continuous chat, like refining the profile in a conversation, did not hold. The API cost was prohibitive, and companies were not going to absorb it.

**What I would do differently:** I would measure the cost of each search before prototyping the chat. One strong prompt is enough to set the parameters, and the cost does close.

**Next steps:** _To complete · later catalog MVPs and churn metrics to measure._

## 5. Visual support

_Visual evidence_

**AI search:**
![Candidate catalog: on the left, AI search that builds filters from a description; on the right, the table with profile percentage, location, salary, and last job.](/casos/caso-03-busqueda.png "AI search in the catalog.")

**Candidate table:**
![AI search results table with columns for name, profile percentage, update, age, location, salary, last job, and keyword match, plus a panel to personalize the search.](/casos/caso-03-tabla.png "Candidate table from the AI search.")

**Wireframes:** _To complete · image here._

**Focus group:**
![Focus group around a table, with laptops and colored dots for prioritization.](/casos/caso-03-grupo-focal.jpg "Focus group for the catalog.")
