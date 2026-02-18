<!--
SKILL TEMPLATE
Fill in your content, delete sections marked "delete if unused".
Delete this comment block when done.
-->
---
name: my-skill-name
description: >
  50-100 words covering: what this skill does, when Claude should use it
  (triggers), and scope boundaries. Example: "Brand voice guidelines for
  Acme Corp. Use when creating social media posts, email copy, or marketing
  materials. Also use for reviewing content consistency."
allowed_tools: Read, Write, Glob
---

## Core Workflow

1. First step
2. Second step
3. Third step
4. Validate output
5. Deliver result


## Decision Logic  <!-- delete if single workflow -->

| If the user wants... | Then... |
|----------------------|---------|
| Scenario A           | Follow workflow below |
| Scenario B           | Load references/detail.md |
| Scenario C           | Run scripts/process.py |


## Hard Rules

**Never:**
- Critical constraint
- Another constraint

**Always:**
- Required behavior
- Another requirement


## Reference Files  <!-- delete if no references -->

| When the task involves... | Load |
|---------------------------|------|
| Trigger condition         | `references/file.md` |

**Don't load for:** Simple cases where SKILL.md guidance is sufficient.


## Scripts  <!-- delete if no scripts -->

| Script | Purpose | Usage |
|--------|---------|-------|
| `process-data.py` | Description | `python scripts/process-data.py input` |


## Assets  <!-- delete if no assets -->

| Asset | When to use |
|-------|-------------|
| `assets/path/file` | When to use it |


## Examples

### Typical Request

**User:** Example request

**Claude:**
```
Example output
```

### Edge Case  <!-- delete if not needed -->

**User:** Edge case request

**Claude:**
```
Edge case output
```
