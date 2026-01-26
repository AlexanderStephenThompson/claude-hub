# Templates

Boilerplate templates for extending the customization system.

## Available Templates

### Team Template

Location: `team/`

Use this template to create a new multi-agent team plugin. A team is a coordinated workflow of agents that accomplish a complex task.

**Contents:**
- `README.md` - Team documentation template (workflow, agents, installation)
- `CHECKLIST.md` - Validation checklist before packaging

**To create a new team:**

1. Copy the entire `team/` folder to `teams/[team-name]/`
2. Fill in the README.md template with your team details
3. Create agents using the agent template (see below)
4. Create `.claude-plugin/plugin.json` manifest
5. Run through `CHECKLIST.md` before shipping
6. Delete `CHECKLIST.md` when done

---

### Agent Template

Location: `agent/`

Use this template to create agents for teams. An agent is a specialized role in a team workflow.

**Contents:**
- `AGENT.md` - Agent definition template (frontmatter, workflow, output format)
- `CHECKLIST.md` - Validation checklist before finalizing

**To create a new agent:**

1. Copy `AGENT.md` to `teams/[team-name]/agents/[agent-name].md`
2. Fill in the template with your agent details
3. Ensure skills referenced exist in `skills/`
4. Run through `CHECKLIST.md` before shipping
5. Delete `CHECKLIST.md` when done

---

### Command Template

Location: `command/`

Use this template to create commands for team plugins. A command is an entry point that triggers a team workflow.

**Contents:**
- `COMMAND.md` - Command definition template (usage, examples, workflow)
- `CHECKLIST.md` - Validation checklist before finalizing

**To create a new command:**

1. Copy `COMMAND.md` to `teams/[team-name]/commands/[command-name].md`
2. Fill in the template with your command details
3. Add the command to `.claude-plugin/plugin.json`
4. Run through `CHECKLIST.md` before shipping
5. Delete `CHECKLIST.md` when done

---

### Skill Template

Location: `skill/`

Use this template to create new skills for teams. A skill is a reusable knowledge module that agents can inherit and apply.

**Contents:**
- `SKILL.md` - Main skill definition (workflow, rules, examples)
- `CHECKLIST.md` - Validation checklist before packaging
- `references/` - Detailed reference documents (loaded on-demand)
- `scripts/` - Python/Bash scripts for automation
- `assets/` - Config files, images, templates

**To create a new skill:**

1. Copy the entire `skill/` folder to `skills/[skill-name]/`
2. Rename placeholder files (remove `_` prefix)
3. Fill in your content following the template structure
4. Run through `CHECKLIST.md` before shipping
5. Delete `CHECKLIST.md` when done

---

## Template Conventions

- Files starting with `_` are placeholders (rename or delete)
- Delete sections marked "delete if unused"
- Delete `CHECKLIST.md` files after completing them
- Keep skills under 500 lines / 2000 tokens
- Document all references, scripts, and assets in SKILL.md
- Skills are shared at repository root in `skills/`, not inside teams
