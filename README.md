# Claude Customizations

Personal Claude Code customizations: multi-agent teams, standalone commands, agents, and shared skills.

## Structure

```
claude-customizations/
├── teams/          # Multi-agent plugin teams (installed via marketplace)
├── commands/       # Standalone slash commands
├── agents/         # Standalone agents
├── skills/         # Shared skills (single source of truth)
└── templates/      # Boilerplate for extending the system
```

---

## Teams

Installable plugin teams with multiple coordinated agents.

| Team | Description | Version |
|------|-------------|---------|
| [refactor-team](./teams/refactor-team) | 7-agent refactoring workflow | 2.0.0 |
| [implement-team](./teams/implement-team) | 5-agent TDD implementation | 1.0.0 |
| [diagnose-team](./teams/diagnose-team) | 5-agent diagnostic workflow | 1.0.0 |

### Installation

```bash
# Add marketplace (one-time)
claude plugin marketplace add https://github.com/AlexanderStephenThompson/claude-hub

# Install teams
claude plugin install refactor-team
claude plugin install implement-team
claude plugin install diagnose-team
```

### Team Commands

| Command | Description |
|---------|-------------|
| `/refactor-team:refactor [path] [focus]` | Run 7-agent refactoring workflow |
| `/implement-team:implement <feature>` | Run 5-agent TDD implementation workflow |
| `/diagnose-team:diagnose <problem>` | Run 5-agent diagnostic workflow |

---

## Commands

Standalone commands stored in `~/.claude/commands/` (reference docs only).

| Command | Description |
|---------|-------------|
| [/commit](./commands/commit.md) | Stage all changes and create a well-crafted commit message |
| [/optimize-prompt](./commands/optimize-prompt.md) | Rewrite a prompt for clarity, specificity, and effectiveness |
| [/orient](./commands/orient.md) | Orient yourself to this project before starting work |

---

## Quality & Audit Commands

Four commands for analyzing codebase health. Each uses parallel sub-agents to go deep on specific dimensions.

| Command | Focus | When to Use |
|---------|-------|-------------|
| [/deep-scan](./commands/deep-scan.md) | Deep multi-category analysis | Before major refactoring — identifies improvement opportunities across code quality, CSS, accessibility, performance, and structure |
| [/review](./commands/review.md) | Current work quality | After implementing a feature — checks content clarity, code quality, organization, and consistency |
| [/structure](./commands/structure.md) | Project structure | When the project feels messy — audits file organization, naming, folder structure, and navigability |
| [/ui-audit](./commands/ui-audit.md) | HTML/CSS hygiene | When UI code has grown organically — finds semantic HTML issues, CSS duplication, missing states, and design token violations |

### Quick Reference

```
/deep-scan          → "What needs improving?" (spawns improvement-auditor agent)
/deep-scan css      → Focus on CSS/styling issues
/deep-scan a11y     → Focus on accessibility
/deep-scan perf     → Focus on performance

/review             → "Is this work solid?" (4 parallel reviewers)
/review code        → Focus on code quality

/structure          → "Is the project organized?" (5 parallel auditors)
/structure src/     → Focus on specific directory

/ui-audit           → "Is the UI code clean?" (4 parallel auditors)
/ui-audit buttons   → Hint to prioritize button-related findings
```

---

## Agents

Standalone agents stored in `~/.claude/agents/` (reference docs only).

| Agent | Description |
|-------|-------------|
| [Codebase Scout](./agents/codebase-scout.md) | Explore and document unfamiliar codebases |
| [Improvement Auditor](./agents/improvement-auditor.md) | Deep-dive codebase analysis for refactoring |

---

## Skills (Single Source of Truth)

Shared skills that all teams and agents reference. Each skill contains standards, references, assets, and validation scripts.

| Skill | Purpose |
|-------|---------|
| [architecture/](./skills/architecture/) | Architecture principles, module boundaries |
| [code-quality/](./skills/code-quality/) | TDD, naming, docstrings, 3-tier structure |
| [code-standards/](./skills/code-standards/) | Language-specific standards (JS, Python, SQL) |
| [design/](./skills/design/) | Design system, semantic HTML, CSS, accessibility |
| [documentation/](./skills/documentation/) | SemVer, changelog, feature specs |
| [security/](./skills/security/) | OWASP Top 10, input validation, auth patterns |

**Web-specific:** web-accessibility, web-css, web-graphql, web-performance, web-react, web-testing

---

## Templates

Boilerplate templates for extending the customization system.

| Template | Purpose |
|----------|---------|
| [team/](./templates/team/) | Create new multi-agent teams |
| [agent/](./templates/agent/) | Create new agents for teams |
| [command/](./templates/command/) | Create new slash commands |
| [skill/](./templates/skill/) | Create new skills |

---

## Deployment

Deploy customizations to your local Claude Code installation:

```bash
# Deploy skills, agents, and commands
cp -r skills/* ~/.claude/skills/
cp agents/*.md ~/.claude/agents/
cp commands/*.md ~/.claude/commands/

# Install teams via marketplace
claude plugin install refactor-team
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.

---

## Architecture

```
This Repo (Source)              ~/.claude/ (Deployed)
─────────────────               ───────────────────
skills/           ─────────►    skills/
agents/           ─────────►    agents/
commands/         ─────────►    commands/
teams/            ─────────►    plugins/ (via marketplace)
```

- **Skills** are the single source of truth - all teams reference `~/.claude/skills/`
- **Teams** are installed as plugins but use shared skills
- **Updates to skills** automatically apply to all teams after redeployment
