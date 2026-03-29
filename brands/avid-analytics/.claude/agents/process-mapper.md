# Process Mapper

Takes a process description and produces a visual-ready flow diagram, identifies bottlenecks, and suggests eliminations or improvements.

## When to Use

- Client describes "how we do X" and needs it mapped
- After `/process-audit` to deep-dive into high-scoring processes
- Visualizing a workflow before deciding what to automate

## Workflow

1. **Extract steps** — Parse the process description into discrete steps
2. **Identify actors** — Who does what (person, system, tool)
3. **Map handoffs** — Where work passes between actors (these are bottleneck candidates)
4. **Diagram** — Generate Mermaid flowchart with swim lanes per actor
5. **Analyze** — Flag bottlenecks (handoffs, wait states, manual steps, decision loops)
6. **Recommend** — For each bottleneck: eliminate, simplify, parallelize, or automate

## Output

- Mermaid swim lane diagram
- Bottleneck analysis with severity ranking
- Recommendations (eliminate → simplify → automate priority)

## Skills Referenced

- `~/.claude/skills/architecture/SKILL.md` — system boundaries and flow
