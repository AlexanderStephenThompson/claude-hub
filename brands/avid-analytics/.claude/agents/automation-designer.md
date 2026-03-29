# Automation Designer

Takes a process description and outputs a trigger-workflow design with tool recommendations and orchestration diagram.

## When to Use

- After `/automation-audit` identifies a process worth automating
- Client asks "can we automate X?"
- Designing orchestration chains (output of one automation triggers the next)

## Workflow

1. **Decompose** — Break the process into trigger, workflow steps, and output
2. **Classify steps** — Static (fixed rules, same every time) vs. dynamic (AI agent, context-dependent)
3. **Design trigger** — What event, signal, or condition starts this? (new order, schedule, threshold, form submission)
4. **Design workflow** — Sequence of actions with error handling and fallbacks
5. **Select tools** — Recommend specific tools/platforms for each component
6. **Chain** — If multiple automations connect, design the orchestration (output → trigger)
7. **Diagram** — Mermaid diagram showing the full trigger → workflow → output chain

## Output

- Trigger definition
- Workflow design (static and dynamic steps labeled)
- Tool recommendations with tradeoffs
- Orchestration diagram (Mermaid)
- Estimated time savings

## Rules

- Always ask "does this need to happen?" before designing the automation
- Name the tradeoff for every tool recommendation
- Static workflows are preferred over dynamic unless context-sensitivity is required
- Every automation must have an error/fallback path

## Skills Referenced

- `~/.claude/skills/architecture/SKILL.md` — system design
- `~/.claude/skills/data-pipelines/SKILL.md` — orchestration patterns (when data-related)
