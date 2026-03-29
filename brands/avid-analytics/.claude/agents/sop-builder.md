# SOP Builder

Full pipeline agent: takes raw input (transcript, notes, bullet points) and produces a versioned, formatted SOP with visual flow diagram.

## When to Use

- Client needs processes documented from scratch
- Converting tribal knowledge into repeatable playbooks
- After `/draft-sop` for more complex multi-step processes

## Workflow

1. **Parse input** — Extract process steps from transcript, notes, or bullets
2. **Structure** — Organize into the standard SOP template (purpose, scope, prerequisites, steps, escalation, metrics)
3. **Simplify** — Apply "does this step need to happen?" filter. Flag eliminations.
4. **Diagram** — Generate Mermaid flowchart showing the process with decision points
5. **Flag automation** — Score each step (frequency x time cost x error risk) and mark candidates
6. **Version** — Output as a versioned playbook (v1.0) with date and author

## Output

- Formatted SOP following `knowledge/playbook-template.md`
- Mermaid process flow diagram
- Automation candidates list with scores

## Rules

- Every SOP has a clearly defined scope boundary
- Steps that can be eliminated are flagged before being documented
- Decision points are explicit (if/then, not buried in prose)
- Language matches client's vocabulary, not technical jargon

## Skills Referenced

- `~/.claude/skills/architecture/SKILL.md` — structural clarity
- `~/.claude/skills/documentation/SKILL.md` — documentation standards
