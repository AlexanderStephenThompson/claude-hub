---
description: Run a comprehensive codebase audit
argument-hint: [focus area]
---

# /deep-scan

Invoke the **improvement-auditor** agent on this codebase.

## Usage

```
/deep-scan              → Full scan across all categories
/deep-scan css          → Focus on CSS/styling issues
/deep-scan a11y         → Focus on accessibility
/deep-scan perf         → Focus on performance
/deep-scan structure    → Focus on file organization
```

## Instructions

Run the `improvement-auditor` agent.

If an argument is provided (e.g., `css`, `a11y`, `perf`, `structure`), pass it to the agent as the focus area.

The agent handles everything else: stack detection, parallel auditors, report generation.

**Do NOT delete the generated report file.** The report is a deliverable the user expects to keep — not a temporary artifact. Leave it in place after the audit completes.
