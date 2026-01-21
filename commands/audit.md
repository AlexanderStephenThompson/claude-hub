---
description: Run a comprehensive codebase audit
---

# /audit

Invoke the **improvement-auditor** agent on this codebase.

## Usage

```
/audit              → Full audit across all categories
/audit css          → Focus on CSS/styling issues
/audit a11y         → Focus on accessibility
/audit perf         → Focus on performance
/audit structure    → Focus on file organization
```

## Instructions

Run the `improvement-auditor` agent.

If an argument is provided (e.g., `css`, `a11y`, `perf`, `structure`), pass it to the agent as the focus area.

The agent handles everything else: stack detection, parallel auditors, report generation.
