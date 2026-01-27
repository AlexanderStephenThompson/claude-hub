---
description: Review the current work for content clarity, code quality, organization, and consistency
---

# Review

ultrathink

Run a focused, opinionated review of what we've been working on.

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

### 1. Content & Information Design

The user experience of understanding. Every piece of content should teach, guide, or clarify.

**Structure & Flow**
- Is the hierarchy clear? Can you scan headings alone and understand what this covers?
- Are headings descriptive and progressive — do they tell a story top to bottom?
- Is there a clear entry point? Does the user know where to start and what to expect?
- Do sections flow logically? Is information introduced before it's referenced?
- Is progressive disclosure used? Simple first, details available when needed.

**Clarity & Comprehension**
- Is complex information broken into digestible chunks?
- Is the language plain and direct? No unnecessary jargon or ambiguity.
- Are examples provided where abstract concepts need grounding?
- Does the content answer "why should I care?" before "how does it work?"
- Are edge cases and gotchas surfaced where the user would actually encounter them?

**Usefulness**
- Is every piece of text earning its place? No filler, no redundancy.
- Are CTAs and next steps obvious and actionable?
- Could someone follow this without asking you clarifying questions?
- Would a first-time user understand what to do without external instructions?

### 2. Code Quality

Clean code for both humans and AI. If an AI agent can't read your code and immediately understand what to change and where, it's not clean enough.

**Naming & Intent**
- Do names describe intent, not implementation? (`getUserPermissions` not `fetchData2`)
- Could someone — human or AI — understand this file without reading other files first?
- Are comments explaining "why", while the code explains "what"?
- No misleading names, no abbreviations that require tribal knowledge.

**Clarity & Simplicity**
- Are functions and components doing one thing?
- Is the abstraction level consistent within a file? (Don't mix high-level orchestration with low-level details)
- Are there magic values that should be named constants?
- Is dead code removed? Unused imports, commented-out code, unreachable branches.
- Could you delete any code and nothing would break?

**AI Readability**
- Is the code self-documenting enough that an AI agent could modify it confidently?
- Are relationships between files discoverable from imports and naming alone?
- Are there implicit dependencies or conventions that aren't visible in the code itself?

### 3. File & Folder Organization

The codebase should be navigable by intuition. If you have to search to find something, the structure isn't working.

- Does the folder structure mirror the mental model of the project?
- Are related files grouped together? Would you look here first to find them?
- Are file names descriptive and consistent? Could you guess a file's purpose from its name?
- Could you find any file by guessing its name and location?
- Are there files doing too much that should be split?
- Are there scattered files that belong together and should be consolidated?
- Is nesting depth reasonable? No deeply nested folders for single files.
- Are shared utilities and constants in a discoverable, predictable location?

### 4. Consistency & Patterns

Inconsistency is where confusion starts — for you and for the AI working in your codebase.

- Are naming conventions consistent across files? (casing, prefixes, verb choices)
- Are similar problems solved the same way throughout?
- Do new additions follow established patterns, or introduce a different approach?
- Are there emerging patterns that should be made explicit? (Extract to shared, document the convention)
- Is formatting and code style uniform? No mixed conventions within the same scope.

---

## Output Format

Start with context, then findings:

### Context
2-3 sentences: what this code does, who it serves, and the main concern heading into this review. This grounds every finding that follows.

### Findings

Organize by **impact**, not by category:

1. **Critical** — Broken, misleading, or structurally wrong. Must fix.
2. **Important** — Unclear, inconsistent, or poorly organized. Should fix.
3. **Polish** — Minor naming tweaks, small reorganizations, style nits. Fix if convenient.

For each finding:
- **Location**: file path and line number or component name
- **Issue**: what's wrong and why it matters
- **Fix**: the specific change to make

Up to **10 findings**, focused on what moves the needle most.

### Example

**Weak finding:**
"Function naming could be improved."

**Strong finding:**

**Location**: `src/utils/helpers.ts:42` — `processData()`

**Issue**: Name doesn't describe what data or what processing. A developer or AI agent searching for price calculation logic wouldn't find this.

**Fix**: Rename to `calculateOrderTotal()` — matches the domain language used in the checkout module.

### Avoid
- Vague observations without a specific location
- Checkbox-style "looks good" or "needs work" without explaining why
- Findings without a concrete fix
- Nitpicks that don't affect understanding, maintainability, or navigation

---

Finally, ask which findings to implement — offer to start with Critical, work through Important, or tackle a specific category.
