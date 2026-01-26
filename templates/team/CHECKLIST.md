# Team Template Checklist

Use this checklist before packaging your team plugin.

## Structure

- [ ] `.claude-plugin/plugin.json` exists with valid manifest
- [ ] `agents/` directory contains all agent markdown files
- [ ] `commands/` directory contains at least one command
- [ ] `README.md` exists with all required sections
- [ ] `scripts/` directory exists (if scripts are referenced)

## Plugin Manifest

- [ ] `name` is kebab-case and matches folder name
- [ ] `version` follows semver (X.Y.Z)
- [ ] `description` is concise and accurate
- [ ] All agents are listed in manifest
- [ ] All commands are listed in manifest

## Agents

For each agent:
- [ ] Frontmatter includes: name, description, model, color
- [ ] Frontmatter includes: skills (list of skill names)
- [ ] Description explains when to invoke
- [ ] Core Principles section exists
- [ ] Workflow Position section shows team diagram
- [ ] Handoff rules are explicit (receive from, hand off to)
- [ ] Output format/template is defined
- [ ] Anti-patterns section exists

## Commands

For each command:
- [ ] Clear description of what it does
- [ ] Usage examples provided
- [ ] Arguments documented
- [ ] Entry point agent specified

## README

- [ ] Team description (what and when)
- [ ] Workflow diagram (ASCII art)
- [ ] Agent table (role, model, color)
- [ ] Prerequisites section
- [ ] Installation instructions
- [ ] Quick start examples
- [ ] How It Works section (autonomous, gates, early exits)
- [ ] Components section (agents, skills, commands, scripts)
- [ ] Skills Inheritance by Agent table
- [ ] Workflow Phases section
- [ ] File Structure diagram
- [ ] Design Principles section
- [ ] Author attribution

## Quality

- [ ] All agents use consistent formatting
- [ ] Handoff chain is complete (no dead ends)
- [ ] Loop limits are defined
- [ ] Early exit conditions are specified
- [ ] Skills referenced actually exist in `skills/`

## Validation

- [ ] `claude plugin validate ./[team-name]` passes
- [ ] Plugin loads without errors
- [ ] All agents invoke successfully
- [ ] Commands execute correctly

---

**Delete this file after completing the checklist.**
