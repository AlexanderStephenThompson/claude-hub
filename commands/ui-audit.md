---
description: Audit HTML semantics and CSS for consolidation opportunities
argument-hint: [optional hint — e.g., "buttons feel inconsistent" or "check the card components"]
---

# /ui-audit

ultrathink

Audit HTML structure and CSS for semantic correctness, consistency, and consolidation opportunities. The goal: clean, maintainable UI code where similar elements share unified styles and HTML uses the right elements for the job.

## User Hint
$ARGUMENTS

**Scope:** Always audit the full project.

**Hint:** If the user provided a hint above, treat it as a starting point or area of concern. Prioritize findings related to that hint, but still perform the full audit. If no hint is provided, run the standard audit with no special emphasis.

---

## The AI-Generated CSS Problem

AI tends to create CSS that works but accumulates inconsistencies:
- Similar components with slightly different padding, margins, or colors
- Near-duplicate rules that could be consolidated
- Hardcoded values that should be design tokens
- Div soup where semantic HTML would be clearer
- **CSS file sprawl** — new files created instead of consolidating into existing ones

This audit finds those patterns and proposes consolidation.

---

## Core Principle: Reduce CSS Files

**The 5-file structure is the target for vanilla CSS projects.** Fewer files = easier maintenance, faster onboarding, less duplication.

```
styles/
├── tokens.css      # CSS variables only
├── base.css        # Reset + element defaults
├── layouts.css     # Page scaffolding, grids
├── components.css  # All component styles
└── utilities.css   # Helper classes
```

**This is not optional.** If the project has more than 5 CSS files:

1. **Flag it as a Critical finding** in the report
2. **Propose a consolidation plan** — which files merge into which
3. **If 5 files truly isn't possible**, explain specifically why:
   - Large component library (50+ components) may justify splitting `components.css` by domain
   - Third-party CSS that can't be merged
   - Framework constraints (e.g., CSS Modules require per-component files)

**The burden of proof is on expansion, not reduction.** Default to fewer files. Only accept more when there's a clear, documented reason.

| CSS Files | Verdict |
|-----------|---------|
| ≤5 | Target state |
| 6-7 | Acceptable with justification |
| 8+ | Requires consolidation plan |

**Note:** This constraint applies to vanilla CSS projects only. Tailwind, CSS-in-JS, and CSS Modules have different organizational patterns — adapt accordingly but still push for minimal file count within that paradigm.

---

## Parallel Audit Architecture

This command uses **parallel sub-agents** for focused analysis. Each auditor goes deep on one dimension of UI code quality.

---

### Phase 1: Discovery (Sequential)

Gather the UI codebase context:

1. **Find all CSS files** — `.css`, `.scss`, `.module.css`, inline styles in JS/JSX
2. **Count CSS files** — Record the exact number. This is a key metric.
3. **Find all HTML/JSX files** — `.html`, `.jsx`, `.tsx`
4. **Identify the styling approach** — Vanilla CSS? Tailwind/utility classes? CSS-in-JS (styled-components, Emotion)? CSS Modules? Adapt the audit accordingly.
5. **Evaluate against the 5-file target** — For vanilla CSS projects:
   - **≤5 files**: Target state achieved
   - **6-7 files**: Note which files could merge; require justification for each extra file
   - **8+ files**: Flag as **Critical** — create consolidation plan before other findings

   Expected structure:
   ```
   styles/
   ├── tokens.css      # CSS variables only
   ├── base.css        # Reset + element defaults
   ├── layouts.css     # Page scaffolding, grids
   ├── components.css  # All component styles
   └── utilities.css   # Helper classes
   ```

   For each file beyond 5, document:
   - What's in it
   - Why it can't merge into one of the 5 core files
   - If the reason isn't compelling, propose the merge

6. **Identify the design token source** — Should be `tokens.css`. Look for CSS variables in `:root`. Note if tokens are missing or in the wrong file.
7. **Count components** — How many UI components exist?

Build a file manifest and share it with all auditors in Phase 2.

---

### Phase 2: Parallel Auditors

**CRITICAL: Launch ALL 4 auditors in parallel using the Task tool.**

Use a SINGLE message with MULTIPLE Task tool calls (subagent_type="Explore") to run these simultaneously. Pass each auditor the file manifest from Phase 1 and their specific checklist below.

Each auditor returns findings in this format:

```markdown
## [Category] Findings

### Issues Found
- **What**: specific file(s) and line(s)
- **Why**: what's wrong or inconsistent
- **Action**: specific consolidation, replacement, or refactor
- **Effort**: Quick Fix / Consolidation / Refactor
```

---

#### Auditor 1: HTML Semantics

Proper HTML structure improves accessibility, SEO, and maintainability.

**Element Selection**
- Are `<div>` and `<span>` used where semantic elements would be better? (`<nav>`, `<header>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<aside>`)
- Are `<button>` used for actions and `<a>` for navigation? (Not divs with onClick)
- Are lists rendered with `<ul>`/`<ol>`/`<li>`? (Not divs styled as lists)
- Are tables used for tabular data with proper `<thead>`, `<tbody>`, `<th>`, `<td>`?

**Heading Hierarchy**
- Do headings follow a logical order? (`<h1>` → `<h2>` → `<h3>`, no skipping)
- Is there exactly one `<h1>` per page/view?
- Are headings used for structure only? Flag any `<h1>`-`<h6>` used purely for font size/weight — style with CSS classes instead.

**Forms**
- Do all inputs have associated `<label>` elements?
- Are form elements wrapped in `<form>` tags?
- Do buttons have explicit `type` attributes? (`type="button"` vs `type="submit"`)

**Images & Media**
- Do images have meaningful `alt` text? (Not empty, not "image")
- Are decorative images marked with `alt=""`?

**Class & Attribute Bloat**
- Are elements overloaded with classes? (5+ classes on one element is a smell — consolidate into a single semantic class)
- Are there redundant or conflicting classes? (e.g., `class="mt-4 mt-8"` or `class="hidden visible"`)
- Are custom `data-*` attributes excessive or unclear? Flag elements with 4+ data attributes.

**Inline Styles**
- Flag all inline `style=""` attributes. These should almost always be CSS classes instead.
- The goal: HTML describes structure, CSS handles presentation. Keep them separated.
- Only exceptions: truly dynamic values computed at runtime (e.g., `style={{ width: calculatedWidth }}`). Even then, prefer CSS custom properties when possible.

---

#### Auditor 2: CSS Consolidation

Find duplicate and near-duplicate CSS that should be unified.

**Exact Duplicates**
- Are there identical rule sets in different files?
- Are there rules that could be extracted to a shared class?

**Near Duplicates (The AI Problem)**
- Are there similar components with slightly different values?
  - Example: `.card-a { padding: 16px }` and `.card-b { padding: 1rem }` (same value, different unit)
  - Example: `.btn-primary { padding: 8px 16px }` and `.btn-secondary { padding: 8px 15px }` (should be identical)
- Are there color variations that should be the same? (`#3b82f6` vs `#3B82F6` vs `rgb(59, 130, 246)`)
- Are there spacing inconsistencies across similar components?

**Consolidation Opportunities**
- Could multiple similar classes be merged into one base class with modifiers?
- Are there repeated property groups that should be a utility class or mixin?
- Could component variants share a base style?

**Unused CSS**
- Are there selectors with no matching HTML elements?
- Are there classes defined but never applied?

---

#### Auditor 3: Design Token Compliance

All values should come from the design system, not be hardcoded.

**If no token system exists:** Focus on identifying repeated values that should become tokens. The audit becomes "here's what you'd gain from a token system" rather than "you're violating the system."

**Hardcoded Values to Flag**
- Colors: hex codes, rgb(), hsl() that aren't in CSS variables
- Spacing: pixel or rem values that should use `--space-*` tokens
- Typography: font sizes, weights, line heights not using tokens
- Borders: radii, widths not using tokens
- Shadows: box-shadow values not using tokens
- Z-index: arbitrary numbers instead of `--z-*` tokens
- Transitions: durations/easings not using tokens

**Token Candidates**
- Are there repeated values that should become new tokens?
- Are there magic numbers that need names?

**Token Misuse**
- Are tokens being overridden with hardcoded fallbacks that defeat the purpose?
- Are similar tokens used inconsistently? (`--space-4` in one place, `--space-md` in another for the same intent)

---

#### Auditor 4: Component State Coverage

Interactive elements need complete state coverage.

**Required States** (all 5 for interactive elements)
- **Default**: Base appearance defined
- **Hover**: Visual feedback on mouse over (`:hover`)
- **Active**: Visual feedback when pressed (`:active`)
- **Focus**: Keyboard focus indicator (`:focus-visible`)
- **Disabled**: Non-interactive appearance (`:disabled`, `[disabled]`, `.is-disabled`)

**State Consistency**
- Do similar components have matching state treatments?
- Are hover/focus transitions consistent across the UI?
- Do disabled states use consistent opacity/color treatment?

**Missing States**
- Are there interactive elements (buttons, links, inputs) missing any of the 5 states?
- Are focus indicators visible and meet contrast requirements?

---

### Phase 3: Synthesis (Sequential)

After ALL auditors complete:

1. **Collect** all auditor outputs
2. **Deduplicate** overlapping findings
3. **Classify** each finding by effort level
4. **Generate** the final report in the output format below

---

## Output Format

### UI Code Health Summary

Brief overview with quick stats:
- **CSS Files**: X files (target: ≤5) — **PASS** / **NEEDS CONSOLIDATION** / **CRITICAL: requires consolidation plan**
- **HTML**: X semantic issues, Y inline styles, Z class bloat instances
- **CSS**: X near-duplicates, Y unused selectors
- **Tokens**: X% coverage (or "No token system — Y candidates identified")
- **States**: X components missing states

**CSS file count is the first metric.** If it's over 5, the consolidation plan appears before other findings.

One-sentence verdict: Is this codebase clean, needs tidying, or needs significant work?

### Findings

Organize by **effort level**:

1. **Quick Fixes** — Single-line changes, typo fixes, unit normalization
2. **Consolidation** — Merging duplicate rules, extracting shared styles
3. **Refactors** — Replacing div soup with semantic HTML, restructuring component CSS

For each finding:

- **What**: the file(s), selector(s), or element(s) affected
- **Why**: what's wrong, inconsistent, or duplicated
- **Action**: the specific change (with before/after examples for consolidation)

### Example Findings

**Weak finding:**
"The buttons have inconsistent styles."

**Strong finding:**

**What**: `.btn-primary` in `Button.css:12` and `.action-button` in `Modal.css:45`

**Why**: Nearly identical styles with minor differences:
```css
/* Button.css */
.btn-primary { padding: 8px 16px; background: #3b82f6; border-radius: 4px; }

/* Modal.css */
.action-button { padding: 0.5rem 1rem; background: var(--color-primary); border-radius: var(--radius-sm); }
```

**Action**: Consolidate to single `.btn-primary` class using design tokens. Delete `.action-button`, update Modal to use `.btn-primary`.

---

### Avoid

- Flagging intentional variations (primary vs secondary buttons are supposed to differ)
- Flagging utility class patterns as "bloat" if the project uses Tailwind or similar — that's the architecture, not a problem
- Proposing consolidation that would reduce clarity
- Treating this as a visual design review — focus on code quality, not aesthetics
- Suggesting changes that would break existing functionality

---

Finally, ask which findings to implement — offer to start with Quick Fixes, work through Consolidation, or discuss Refactors first.
