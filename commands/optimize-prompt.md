---
description: Rewrite a prompt for clarity, specificity, and effectiveness
argument-hint: <raw prompt>
---

# /optimize-prompt

Take the provided prompt and return an optimized version.

## Input

```
$ARGUMENTS
```

## Optimization Process

Analyze the prompt for these issues:

1. **Ambiguity** - Vague words, unclear scope, missing context
2. **Lack of specificity** - No concrete details, undefined terms, missing constraints
3. **Poor structure** - Buried requirements, wall of text, no clear ask
4. **Missing context** - No background, undefined audience, unclear purpose
5. **Weak framing** - Passive voice, negative constraints instead of positive goals

## Output Format

Return ONLY this structure:

### Original Prompt
> [Quote the original]

### Issues Identified
- [List 2-4 specific issues found]

### Optimized Prompt
```
[The rewritten prompt]
```

### What Changed
- [Brief bullets explaining key improvements]

## Rewriting Principles

- **Be specific**: Replace "good" with measurable criteria
- **Add structure**: Use numbered steps, sections, or constraints
- **Define scope**: Specify what's in/out of scope
- **Clarify output**: State the expected format and length
- **Front-load the ask**: Put the main request first, context second
- **Remove fluff**: Cut filler words and redundant phrases
- **Make implicit explicit**: Surface hidden assumptions

## Examples

**Weak**: "Write something about authentication"
**Strong**: "Write a 500-word technical overview of JWT vs session-based authentication for a Node.js API. Include: security tradeoffs, implementation complexity, and a recommendation for a B2B SaaS with 10K users."

**Weak**: "Fix the bug"
**Strong**: "The login form submits but returns a 401 even with correct credentials. Expected: successful login and redirect to /dashboard. Actual: 401 Unauthorized. Reproduce: use test@example.com / password123 on /login."

**Weak**: "Make it better"
**Strong**: "Refactor this function to: (1) reduce cyclomatic complexity below 10, (2) extract the validation logic into a separate function, (3) add JSDoc comments for parameters and return type."
