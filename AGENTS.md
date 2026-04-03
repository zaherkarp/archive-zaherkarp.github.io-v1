# AGENTS.md

Instructions for Claude Code agents working on this repository.

## Focus Group Agent

Simulates multi-round user feedback panels reviewing the portfolio site. Each round uses distinct personas who evaluate `src/config.ts` content and the rendered components.

### How to Run

When asked to run focus groups:

1. Read the current `src/config.ts` and relevant components to understand the full portfolio state
2. Simulate 3 rounds of panel feedback (typically 4 panelists per round)
3. Each panelist should have a name, title, and specific perspective (hiring manager, peer, recruiter, UX reviewer, etc.)
4. One round should include **antagonists** — critical peers in the same field who pressure-test claims, specificity, and positioning
5. After all rounds, produce a synthesis table of actionable changes with consensus strength
6. Implement changes to `src/config.ts` and components, then build to verify

### Panel Composition Guidelines

- **Supportive round**: Hiring managers, recruiters, peers who give constructive feedback
- **Antagonist round**: Senior practitioners in the same field (healthcare data engineering) who challenge claims, question specificity, and identify positioning weaknesses. These panelists should be blunt and specific.
- **Closing round**: Balanced mix — potential direct hires, UX reviewers, junior peers who validate the narrative

### What Panelists Evaluate

- Experience bullet specificity and outcome language ("so what?")
- Claims that lack denominators or verifiable context
- Section ordering and visual hierarchy
- Resume gaps or entries that raise questions
- Narrative coherence across the career arc
- Technical credibility signals (measure names, tool specificity, audit readiness)
- Publication and presentation section length and redundancy

### History

Focus group rounds are documented in `docs/focus-groups.md`. Refer to that file for past feedback and what was implemented.

| Session | Rounds | Branch / PR |
|---------|--------|-------------|
| Initial persona review | Pre-round | `claude/focus-groups-personas-BToAa` / PR #55 |
| Rounds 1-3 | Supportive panels | `claude/focus-groups-personas-BToAa` / PR #55 |
| Rounds 4-6 | Mixed panels, removed citation chart | `claude/focus-groups-personas-BToAa` / PR #55 |
| Rounds 7-9 | Supportive + antagonist + balanced | `claude/add-antagonist-focus-group-QrHR6` |
