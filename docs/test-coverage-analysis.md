# Test Coverage Analysis

**Date**: 2026-04-05

## Current State

The codebase has **zero automated tests**:

- No test files (`*.test.*`, `*.spec.*`, `__tests__/`) exist
- No test framework is installed (no vitest, jest, playwright, etc.)
- No `test` script in `package.json`
- CI/CD (`deploy.yml`) runs `npm run build` only — no test step
- The only validation is `npm run build` (Astro build + TypeScript type-checking)

The `@zaherkarp/skillsprout-client` package is imported as a dependency and includes `testCases` / `runTestCase` exports, but these are run **manually via the UI** (`TestSuiteRunner` in `SkillSproutDemo.tsx`), not in an automated test harness.

---

## Recommended Testing Framework

**Vitest** is the natural choice:
- Native ESM support (the project uses `"type": "module"`)
- First-class TypeScript support
- Compatible with Vite/Astro toolchain
- Fast, lightweight, no config overhead

Setup: `npm install -D vitest` + add `"test": "vitest run"` to `package.json`.

---

## Priority 1 — Pure Logic (High Value, Easy to Test)

### 1.1 Resume PDF Generation (`src/pages/resume.pdf.ts`)

This file contains extractable pure functions with layout math:

| What to test | Why |
|---|---|
| `addHeader()` — name/title/contact positioning | Regression-proof layout changes |
| `addExperience()` — bullet formatting, date alignment | Complex two-column layout logic |
| `addSkills()` — category grouping and rendering | Data-driven output |
| Layout constants (`CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT`) | Catch accidental changes |

**Approach**: Extract the layout helper functions into a separate `src/lib/resume-layout.ts` module and unit test them with a mocked PDFDocument.

### 1.2 Publications Citation Fetching (`src/components/Publications.astro`)

| What to test | Why |
|---|---|
| `fetchCitationCounts()` — happy path | Verify correct API URL construction and response parsing |
| Partial API failure (some `Promise.allSettled` rejected) | Ensure graceful degradation |
| All API failures | Should fall back to config values |
| Data merging: `liveCounts.get(title) ?? pub.citationCount ?? 0` | Verify fallback chain |

**Approach**: Extract `fetchCitationCounts()` and the merge logic into `src/lib/publications.ts`. Test with mocked `fetch`.

### 1.3 Blog Utilities (duplicated in two files)

`formatDate()` is defined identically in both `src/pages/blog/index.astro` and `src/pages/blog/[...slug].astro`. Draft filtering logic (`data.draft !== true`) also appears in both.

| What to test | Why |
|---|---|
| `formatDate(new Date('2025-01-15'))` → `"January 15, 2025"` | Locale-sensitive formatting |
| Draft filtering: `draft: true`, `draft: false`, `draft: undefined` | The `!== true` check has subtle behavior with `undefined` |
| Sort order: posts sorted by `publishDate` descending | Regression guard |

**Approach**: Extract to `src/lib/blog-utils.ts` and unit test. This also eliminates code duplication.

---

## Priority 2 — Integration / Component Logic (Medium Value)

### 2.1 SkillSprout Client Integration

The `SkillSproutDemo.tsx` component imports from `@zaherkarp/skillsprout-client` and uses:
- `callApi()` — API request construction
- `listOccupations()` — full occupation list
- `testCases` / `runTestCase()` — built-in test suite

| What to test | Why |
|---|---|
| `runTestCase()` for all `testCases` | Automate what's currently manual-only UI testing |
| `listOccupations()` returns non-empty array | Sanity check for data loading |
| `callApi()` with known inputs | Verify matching algorithm produces expected results |

**Approach**: Write a `tests/skillsprout-client.test.ts` that imports directly from the package and runs the existing test cases automatically. This is the lowest-effort, highest-value test — the test cases already exist, they're just not automated.

### 2.2 SkillSproutDemo UI Logic

The component contains filtering logic that could be extracted and tested:

| What to test | Why |
|---|---|
| `filteredOccupations` — search + category filter | Complex compound filter |
| `allMatches` aggregation from 3 category arrays | Data combination correctness |
| Request body construction in `handleSearch/handleMore/handleFilter/handleAddSkills` | API contract compliance |

**Approach**: Extract filtering and request-building functions from the component into a `src/lib/skillsprout-helpers.ts` and test them in isolation.

### 2.3 SEO / Metadata (`src/components/BaseHead.astro`)

| What to test | Why |
|---|---|
| OG image URL construction | Broken social previews are invisible until shared |
| Canonical URL generation | SEO-critical, easy to break with path changes |
| JSON-LD Article schema structure | Search engine indexing depends on valid schema |

**Approach**: Extract URL/schema construction to `src/lib/seo.ts`. Snapshot test the JSON-LD output for known inputs.

---

## Priority 3 — Build & Config Validation (Safety Net)

### 3.1 Site Configuration Schema (`src/config.ts`)

The config is the single source of truth for the entire site but has no runtime validation.

| What to test | Why |
|---|---|
| Required fields are present and non-empty | Prevent blank sections from deploying |
| Social links are valid URLs | Catch typos |
| Color values are valid hex | Prevent broken themes |
| `experience`, `publications`, `education` arrays have expected shape | Guard against accidental structural changes |

**Approach**: Write a Zod schema (or reuse patterns from `src/content/config.ts`) and validate `siteConfig` in a test.

### 3.2 Build Smoke Test

| What to test | Why |
|---|---|
| `npm run build` succeeds | Already done in CI, but a test makes it explicit |
| Generated HTML contains expected elements | Catch rendering regressions |
| All blog posts render without errors | Content validation |
| `resume.pdf` endpoint produces valid PDF bytes | Prevent broken downloads |

**Approach**: Run `astro build` in test setup, then assert against the `dist/` output.

---

## Priority 4 — Browser / E2E Tests (Lower Priority)

### 4.1 Theme Toggle

| What to test | Why |
|---|---|
| Toggle switches `data-theme` attribute | Core functionality |
| Theme persists across page loads via `localStorage` | User experience |
| Default theme is `"dark"` when no preference stored | Expected behavior |

### 4.2 Blog Post Rendering

| What to test | Why |
|---|---|
| KaTeX math expressions render | Complex client-side transformation |
| Mermaid diagrams render | DOM manipulation of code blocks |

**Approach**: Use Playwright for these. Lower priority since they test third-party library integration.

---

## Suggested File Structure

```
tests/
├── lib/
│   ├── blog-utils.test.ts
│   ├── publications.test.ts
│   ├── resume-layout.test.ts
│   ├── seo.test.ts
│   └── skillsprout-helpers.test.ts
├── skillsprout-client.test.ts
├── config-validation.test.ts
└── build-smoke.test.ts
```

---

## Recommended Implementation Order

1. **Install Vitest** and add `test` script — 5 min setup
2. **SkillSprout client test cases** — automate existing `testCases` / `runTestCase()` — highest ROI since test data already exists
3. **Extract and test `blog-utils.ts`** — eliminate duplication, add date/filter tests
4. **Extract and test `publications.ts`** — API resilience is critical for build reliability
5. **Config validation test** — safety net for the single source of truth
6. **Resume PDF layout tests** — protect complex layout math
7. **SEO/metadata tests** — prevent invisible social sharing breakage
8. **Build smoke test** — catch rendering regressions
9. **Playwright E2E** (optional) — theme toggle, KaTeX, Mermaid

---

## CI Integration

Add to `.github/workflows/deploy.yml` before the build step:

```yaml
- name: Run tests
  run: npm test
```

This ensures no code deploys without passing tests.
