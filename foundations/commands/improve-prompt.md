---
description: Refine a rough prompt into a clear, effective one
argument-hint: <rough prompt or paste below>
---

**Input:** $ARGUMENTS

# Improve Prompt

Good prompts share five traits: a clear goal, defined audience, explicit constraints, sufficient context, and bounded scope. Most rough prompts are missing at least two. This command diagnoses what's weak and rewrites with annotations so you learn the patterns over time.

---

## Instructions

1. **Receive the prompt** from the arguments above. If empty, ask the user to provide their rough prompt.

2. **Diagnose** the prompt against these five dimensions. For each, note whether it's present, partial, or missing:

   | Dimension | Question |
   |-----------|----------|
   | **Goal** | What does the user want back? Is the desired output clear? |
   | **Audience/Persona** | Who is Claude in this interaction? What expertise is needed? |
   | **Constraints** | Are format, length, tone, and exclusions specified? |
   | **Context** | Is there enough background for Claude to work with? |
   | **Scope** | Is it clear what's included and what's NOT included? |

3. **Produce the improved prompt** with inline `<!-- annotations -->` explaining each significant change. Annotations should teach — not just describe what changed, but WHY it's better.

4. **Show a comparison table** of the most important changes:

   | Original | Improved | Why |
   |----------|----------|-----|
   | [vague phrase] | [specific phrase] | [what this fixes] |

5. **If the original was ambiguous**, offer three variants:
   - **Conservative** — Minimal changes. Keeps the user's voice and structure, just patches the gaps.
   - **Moderate** — Restructured for clarity. Reorders and rephrases but preserves intent.
   - **Expansive** — Fully rewritten with inferred intent. Adds structure, constraints, and context the user likely meant but didn't say.

   If the original is clear enough, skip variants and provide the single improved version.

---

## Output Format

```markdown
## Diagnosis

| Dimension | Status | Notes |
|-----------|--------|-------|
| Goal | ✓ / Partial / Missing | [brief note] |
| Audience | ✓ / Partial / Missing | [brief note] |
| Constraints | ✓ / Partial / Missing | [brief note] |
| Context | ✓ / Partial / Missing | [brief note] |
| Scope | ✓ / Partial / Missing | [brief note] |

## Improved Prompt

[The rewritten prompt with <!-- annotations --> on key changes]

## What Changed

| Original | Improved | Why |
|----------|----------|-----|
| ... | ... | ... |

## Variants (if ambiguous)

### Conservative
[Minimal-change version]

### Moderate
[Restructured version]

### Expansive
[Fully rewritten version]
```

---

## Guidelines

- **Preserve the user's voice** in conservative variants. Don't make it sound like a different person wrote it.
- **Don't over-constrain.** If the user left something open, that might be intentional. Note it in the diagnosis but don't always fill it in.
- **Annotations are the point.** The improved prompt is useful once; the annotations teach a pattern that's useful forever. Invest in clear, specific annotations.
- **Be honest about trade-offs.** More specificity means less flexibility. Flag when added constraints might narrow results too much.
