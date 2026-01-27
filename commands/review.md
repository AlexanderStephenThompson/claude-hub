---
description: Review the current work for quality, clarity, security, and correctness
---

# Code Review

ultrathink

Run a thorough, opinionated review of the code we've been working on.

## Focus Area
$ARGUMENTS

If no focus area specified above, run the full review. Otherwise, prioritize the specified area but still flag critical issues from other categories.

---

## Before Reviewing

Answer these framing questions first — they set the priority for everything below:

1. **What is this code's job?** (What user goal or system responsibility does it serve?)
2. **Does the implementation serve that job effectively?**
3. **What would confuse, slow down, or break things** for a user or a future developer?

Use these answers to decide what matters most in the review.

---

## Review Categories

### Correctness & Safety
- Does the logic handle edge cases? (empty, null, overflow, concurrent access)
- Are there security concerns? (XSS, injection, auth bypass, data exposure)
- Is error handling present where failure is possible?
- State management: race conditions, stale closures, derived state computed correctly?

### Clarity & Semantics
- Do names (variables, functions, components, files) say what they mean?
- Would a new team member understand this code without verbal explanation?
- Is the code scannable — can you find what you need quickly?
- **Semantic:** Do labels and terms mean what they say? No jargon without context, no misleading names.
- **Intuitive:** Would a first-time user understand what to do without instructions?
- **Practical:** Does every element serve a real user need, or is it filler?
- Are headings, labels, and CTAs specific and action-oriented?

### Structure & Maintainability
- Single responsibility: is each file/component doing one job?
- Repeated code that should be extracted into shared functions or components?
- Unused imports, variables, or dead code?
- Magic numbers or strings that should be constants?
- File length and complexity reasonable, or should it be split?

### Accessibility (where applicable)
- Semantic HTML elements used correctly?
- Alt text for images, ARIA labels for interactive elements?
- Interactive elements keyboard-operable?

### Testing
- Are the changed code paths covered by tests?
- Do existing tests still pass with these changes?
- Are there untested edge cases that should be covered?

### Performance (where applicable)
- Unnecessary re-renders or expensive computations?
- Missing memoization, lazy loading, or pagination opportunities?
- Large dependencies that could be lighter?

---

## Output Format

Organize findings by **impact**, not by category:

1. **Critical** — Bugs, security issues, broken functionality. Must fix.
2. **Important** — Clarity problems, missing error handling, structural issues. Should fix.
3. **Polish** — Minor naming tweaks, optional optimizations, style nits. Fix if convenient.

For each finding:
- **Location**: file path and line number or component name
- **Issue**: what's wrong and why it matters
- **Fix**: the specific change to make

Limit to the **10 most impactful findings**. A focused review beats an exhaustive one.

---

Finally, ask if we should implement the changes, starting with Critical items.
