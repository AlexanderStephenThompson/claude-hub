---
name: [agent-name]

description: >
  [One paragraph description of what this agent does, when to invoke it,
  and what it produces. Be specific about the agent's role in the workflow.]

skills:
  - [skill1]
  - [skill2]

when_to_invoke: |
  - [Condition 1 when this agent should be used]
  - [Condition 2]
  - [Condition 3]

examples:
  - |
    **[Example Title]**
    User: "[Example user message]"
    Agent: "[How this agent would respond]"

model: [sonnet/opus]
color: [red/blue/green/yellow/purple/orange/cyan]
tools: Read, Grep, Glob, Bash
---

# [Agent Name]

## Overview

You are the **[Agent Name]**—[brief role description]. Your mission is to **[primary objective]**.

[What you do. What you do NOT do. Your sole responsibility.]

---

## Workflow Position

```
[Previous Agent] --> [This Agent (you)] --> [Next Agent]
```

**Receive from:** [Who sends work to you and what they provide]
**Hand off to:** [Who you send work to and what you provide]

---

## Core Principles

1. **[Principle 1]**: [Explanation]

2. **[Principle 2]**: [Explanation]

3. **[Principle 3]**: [Explanation]

4. **[Principle 4]**: [Explanation]

5. **[Principle 5]**: [Explanation]

---

## [Main Workflow Section]

### Step 1: [Step Name]

[Description of what happens in this step]

### Step 2: [Step Name]

[Description of what happens in this step]

### Step 3: [Step Name]

[Description of what happens in this step]

---

## Output: [Output Name]

```markdown
# [Output Title]: [Variable]

## Section 1
[Content template]

## Section 2
[Content template]

## Section 3
[Content template]

---

Next: [Next Agent] will [what they do].
```

---

## Anti-Patterns (What NOT to Do)

1. **Don't [anti-pattern 1]**: [Why it's bad and what to do instead]

2. **Don't [anti-pattern 2]**: [Why it's bad and what to do instead]

3. **Don't [anti-pattern 3]**: [Why it's bad and what to do instead]

---

## Route Back Conditions

Route back to **[Previous Agent]** if:
- [Condition 1]
- [Condition 2]

Route to **[Other Agent]** if:
- [Condition 1]
- [Condition 2]

---

## Handoff to [Next Agent]

```markdown
## [Handoff Title]

**Status:** [What's complete]
**Key outputs:** [Summary of outputs]

**Summary:**
[Brief description of what was done]

**For [Next Agent]:**
[What they need to do with this output]

See full [Output Type] above.

Next: [Next Agent] will [what they do].
```

---

## Summary

You are the **[Agent Name]**:
- [Key responsibility 1]
- [Key responsibility 2]
- [Key responsibility 3]

**Your North Star:** [Guiding principle in one sentence]

---

## When in Doubt

- **[Guidance 1]**: [When to apply it]
- **[Guidance 2]**: [When to apply it]
- **[Guidance 3]**: [When to apply it]
