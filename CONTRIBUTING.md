# Contributing to Claude Customizations

This guide explains how to extend the customization system with new teams, agents, commands, and skills.

## Quick Reference

| What to Add | Template Location | Target Location |
|-------------|-------------------|-----------------|
| Team | `templates/team/` | `teams/[team-name]/` |
| Agent | `templates/agent/` | `teams/[team-name]/agents/[agent].md` |
| Command | `templates/command/` | `teams/[team-name]/commands/[command].md` |
| Skill | `templates/skill/` | `skills/[skill-name]/` |

---

## Adding a New Team

### 1. Create the Structure

```bash
mkdir -p teams/[team-name]/{.claude-plugin,agents,commands}
```

### 2. Use the Template

Copy `templates/team/README.md` to `teams/[team-name]/README.md` and fill in:
- Team description and workflow diagram
- Agent table (role, model, color)
- Prerequisites and installation
- Workflow phases
- File structure
- Skills inheritance table

### 3. Create the Plugin Manifest

Create `teams/[team-name]/.claude-plugin/plugin.json`:

```json
{
  "name": "[team-name]",
  "version": "1.0.0",
  "description": "[Brief description]",
  "agents": [
    "agents/[agent1].md",
    "agents/[agent2].md"
  ],
  "commands": [
    "commands/[command].md"
  ]
}
```

### 4. Create Agents

Use the agent template (see below) for each agent in the workflow.

### 5. Create Commands

Use the command template (see below) for the entry point command.

### 6. Validate

```bash
claude plugin validate ./teams/[team-name]
```

---

## Adding a New Agent

### 1. Copy the Template

```bash
cp templates/agent/AGENT.md teams/[team-name]/agents/[agent-name].md
```

### 2. Fill in the Frontmatter

```yaml
---
name: [agent-name]
description: >
  [What this agent does and when to invoke it]
skills:
  - [skill1]
  - [skill2]
when_to_invoke: |
  - [Condition 1]
  - [Condition 2]
model: [sonnet/opus]
color: [red/blue/green/yellow/purple/orange/cyan]
tools: Read, Grep, Glob, Bash
---
```

### 3. Define the Agent

Required sections:
- **Overview**: Role and mission
- **Workflow Position**: Diagram showing where in the workflow
- **Core Principles**: 5-7 guiding principles
- **Workflow Steps**: Numbered steps the agent follows
- **Output Template**: Format of what the agent produces
- **Anti-Patterns**: What NOT to do
- **Handoff**: How to pass work to the next agent

### 4. Add to Plugin Manifest

Add the agent path to `plugin.json`:

```json
"agents": [
  "agents/[new-agent].md"
]
```

---

## Adding a New Command

### 1. Copy the Template

```bash
cp templates/command/COMMAND.md teams/[team-name]/commands/[command-name].md
```

### 2. Fill in the Template

- **Usage**: Show command syntax with arguments
- **Examples**: Realistic usage scenarios
- **What It Does**: Numbered steps of what happens
- **Entry Point**: Which agent starts the workflow
- **Workflow**: Diagram showing agent flow
- **Prerequisites**: What's needed before running
- **Output**: What the user will see

### 3. Add to Plugin Manifest

```json
"commands": [
  "commands/[new-command].md"
]
```

---

## Adding a New Skill

### 1. Copy the Template

```bash
cp -r templates/skill/ skills/[skill-name]/
```

### 2. Rename Placeholder Files

Remove the `_` prefix from placeholder files:
- `references/_example-reference.md` -> `references/[name].md`
- `scripts/_process-data.py` -> `scripts/[name].py`
- etc.

### 3. Fill in SKILL.md

Required sections:
- **Version and Source**: Metadata
- **Scope and Boundaries**: What this skill covers vs defers
- **Core Principles**: Key rules (5-8)
- **Main Content**: The standards, patterns, examples
- **Quick Reference**: Checklist for compliance
- **References/Assets/Scripts**: Document what's included

### 4. Keep It Focused

- Under 500 lines / 2000 tokens
- Single responsibility
- Clear boundaries with other skills

### 5. Reference from Agents

Add the skill to agent frontmatter:

```yaml
skills:
  - [new-skill]
```

---

## Skill Guidelines

### Skill Boundaries

Each skill should have a "Scope and Boundaries" section that defines:
- **This skill covers**: Explicit list of responsibilities
- **Defers to other skills**: What it does NOT cover
- **When to use**: Guidance for agents

### Skill Relationships

Skills can reference each other but should not duplicate content:
- `code-quality` covers TDD, naming, docstrings
- `architecture` covers module boundaries, layering
- `design` covers design tokens, semantic HTML
- `web-accessibility` covers WCAG, ARIA, keyboard nav
- `web-css` covers CSS architecture, variables, responsive
- `security` covers OWASP, input validation, auth
- `documentation` covers versioning, changelog, specs
- `code-standards` covers language-specific patterns

---

## Validation

### Before Committing

1. Run the project validator:
   ```bash
   python scripts/validate_project.py
   ```

2. Validate plugin structure:
   ```bash
   claude plugin validate ./teams/[team-name]
   ```

3. Test the workflow:
   ```bash
   claude --plugin-dir ./teams/[team-name]
   /[team-name]:[command] [args]
   ```

### Checklist Templates

Each template folder includes a `CHECKLIST.md`. Complete it before shipping, then delete it.

---

## Commit Messages

Follow conventional commits:

```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
refactor(scope): improve structure
```

Scopes: `teams`, `skills`, `templates`, `scripts`, `[team-name]`, `[skill-name]`

Include co-author line:
```
Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## Questions?

- Check existing teams for examples
- Review the templates for structure guidance
- Skills are the single source of truth for standards
