# Focus Group Notes

Running log of all simulated focus group rounds reviewing the portfolio at zaherkarp.com.

---

## Session 1: Initial Persona Review + Rounds 1-6

**Branch:** `claude/focus-groups-personas-BToAa` | **PR:** #55 | **Date:** March 2026

### Pre-Round: Persona Review

Reviewed site copy, structure, and email obfuscation through persona lenses. Changes across 10 files including Hero, About, Contact, Footer, Header, and config.

**Changes implemented:**
- Updated site copy and structure across multiple components
- Added email obfuscation
- Added Now section and GitHub activity component adjustments

### Rounds 1-3: Constructive Feedback Panels

**Key feedback themes:**
- Experience section lacked depth — BHA had only 1 bullet
- healthfinch Specialist and Manager roles had duplicated bullets, didn't show progression
- Project ordering didn't lead with strongest work
- No location signal for remote/geographic availability
- Presentations gap (last one 2017) needed explanation
- Experience entries needed conversational context lines

**Changes implemented:**
- Expanded Baltimore Health Analytics from 1 to 3 specific bullets
- De-duplicated healthfinch Specialist vs Manager roles to show clear progression
- Reordered projects: Stars Dashboard first, SkillSprout moved lower
- Added Baltimore, MD location signal in hero subtitle
- Added conversational `context` lines to experience entries (e.g., "The person who makes sure the methodology is right before it ships to health plans")
- Added note bridging presentations gap to blog link

### Rounds 4-6: Mixed Panels

**Key feedback themes:**
- CitationMetrics bar chart over-emphasized modest citation counts
- Sustainable Clarity 2-month consulting entry needed consolidation
- healthfinch Manager context line too similar to Specialist
- Health Catalyst bullets lacked tech specificity
- Statistics & Research Methods skills section was too narrow

**Changes implemented:**
- Removed CitationMetrics bar chart component entirely (7 files)
- Consolidated Sustainable Clarity 2-month entry to context-only (no bullets)
- Fixed healthfinch Manager context: "Promoted to lead the analytics function and tie it directly to revenue"
- Added tech specificity to Health Catalyst bullets: Python, dbt, Redshift, Tableau, SQL
- Expanded Statistics & Research Methods: added Mixed Methods Research, Survey Design, Interrupted Time Series
- Removed incorrect Baltimore, MD from hero (replaced with Remote in later commit)

---

## Session 2: Rounds 7-9 (with Antagonist Round)

**Branch:** `claude/add-antagonist-focus-group-QrHR6` | **Date:** April 2026

### Round 7: Supportive Panel

**Panelists:**
- Maya — VP of Analytics at a mid-size health plan, hiring manager
- Raj — Healthcare data engineer, 8 years experience, peer comparison
- Ellen — Recruiter specializing in healthcare IT placements
- Tom — CTO of a health tech startup

**Key feedback:**
- Hero title ("Healthcare Data Engineering") is the field, not the pitch — undersells seniority
- Sustainable Clarity 2-month entry is a resume gap magnet — fold or drop it
- No certifications visible (dbt, AWS, etc.)
- SkillSprout project dilutes the healthcare+data narrative
- Education section AHRQ jargon isn't scannable for non-academics

### Round 8: Antagonist Panel (Critical Peers in Healthcare Data Engineering)

**Panelists:**
- Derek — Principal Data Engineer at Humana, 20 years in managed care data
- Priya — Director of HEDIS Operations at a large PBM, 50+ measure implementations
- Carl — Former peer at Health Catalyst, now at Optum
- Sheila — Healthcare data consultant, conference speaker, competitive positioning

**Key feedback (blunt):**
- **Derek:** "Designing data architecture across several small databases" — the word "small" should never appear. "Working within a legacy Rails orchestration layer" reads as coping with constraints, not achievement. Reframe as what was built despite the constraint.
- **Priya:** HEDIS claim is thin — which measures? How many? No mention of NCQA, audit readiness, or measure validation. Every health plan builds HEDIS pipelines; what's different about yours?
- **Carl:** "Cutting infrastructure costs by 50%" needs a denominator. Without the baseline, the percentage is meaningless. Same for "reduced pipeline load times by a full day" — a day off of what? Bullets are designed to sound good without committing to anything verifiable.
- **Sheila:** The "15+ years" framing counts writing/editing and research as data engineering, which they're not. Publications with 24 max citations — maybe don't auto-fetch that number. Blog link is prominent but no indication of activity level.

### Round 9: Balanced Closing Panel

**Panelists:**
- Anika — Analytics Director at a regional health plan, potential direct hire
- James — Senior recruiter, health tech
- Lena — UX/portfolio design consultant
- Marcus — Healthcare data engineer, 5 years experience

**Key feedback:**
- **Anika:** BHA bullets need "so what" outcomes — every bullet should answer what happened as a result. "Several small databases" isn't a weakness if framed as complexity management, but currently it reads as scale limitation.
- **James:** Sustainable Clarity 2-month entry is a red flag. Hero should show geographic availability (Remote) more prominently.
- **Lena:** Presentations section is too long (17 entries). Show top 5 and collapse the rest. Per-publication citation links all point to same Google Scholar profile — consolidate into one profile link.
- **Marcus:** Career arc from writing to research to engineering is compelling but only visible if you scroll to the bottom. Consider making the transition more visible.

### Synthesis: Changes Implemented

| # | Change | Sources | Status |
|---|--------|---------|--------|
| 1 | Rewrite BHA bullets: removed "small," reframed Rails, added HEDIS specificity (SUPD, SPC, PQA), audit readiness, NCQA alignment | Derek, Priya, Anika | Done |
| 2 | Remove Sustainable Clarity 2-month entry; extend BHA date to Sep 2025 | Raj, James | Done |
| 3 | Add absolute framing to Health Catalyst metrics (replace bare percentages with outcome language) | Carl | Done |
| 4 | Reframe SkillSprout as "Healthcare Workforce Transition Discovery Platform" with healthcare motivation | Tom | Done |
| 5 | Collapse older presentations behind expand/collapse toggle (top 2 year groups visible, rest behind "Show more") | Lena | Done |
| 6 | Consolidate per-publication Google Scholar links into single profile link in Publications header; keep only paper-specific PubMed/ResearchGate | Lena | Done |
| 7 | Add outcome language to experience bullets: healthfinch Manager, healthfinch Specialist, UW-Madison | Anika | Done |

### Notable feedback NOT acted on (for future consideration)

- **Hero title pitch** — Maya suggested weaving Stars/HEDIS into the hero tagline to convey seniority. Not changed this round.
- **Certifications** — Ellen noted absence of dbt/AWS certs. No certs to add currently.
- **"15+ years" framing** — Sheila challenged counting writing career as data engineering. The meta description still says 15+ years. Could be revisited.
- **Career arc visualization** — Marcus suggested a timeline making the writing-to-research-to-engineering transition visible at a glance. Not implemented.
- **Blog activity signal** — Sheila noted blog link is prominent but there's no indicator of how active it is.
