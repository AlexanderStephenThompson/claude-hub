# Agent Template Checklist

Use this checklist before finalizing your agent definition.

## Frontmatter

- [ ] `name` is lowercase kebab-case
- [ ] `description` is clear and explains when to invoke
- [ ] `skills` lists all relevant skills (must exist in `skills/`)
- [ ] `when_to_invoke` lists specific conditions
- [ ] `examples` show realistic usage scenarios
- [ ] `model` is specified (sonnet/opus)
- [ ] `color` is specified
- [ ] `tools` are listed if needed

## Structure

- [ ] Overview section explains role and mission
- [ ] Workflow Position shows diagram and handoff rules
- [ ] Core Principles section (5-7 principles)
- [ ] Main workflow section with numbered steps
- [ ] Output template with example format
- [ ] Anti-patterns section (3-5 things NOT to do)
- [ ] Route back conditions specified
- [ ] Handoff section with template
- [ ] Summary section with North Star
- [ ] When in Doubt guidance

## Content Quality

- [ ] Role is clearly scoped (what it does AND doesn't do)
- [ ] Principles are actionable, not vague
- [ ] Steps are specific enough to follow
- [ ] Output template is concrete and usable
- [ ] Handoff includes all context needed by next agent
- [ ] Anti-patterns are realistic and instructive

## Integration

- [ ] Receives from previous agent in workflow
- [ ] Hands off to next agent in workflow
- [ ] Loop conditions are specified (if applicable)
- [ ] Early exit conditions are specified (if applicable)
- [ ] Skills referenced are available and appropriate

## Validation

- [ ] Agent loads without errors
- [ ] Agent can be invoked via @[agent-name]
- [ ] Output matches expected format
- [ ] Handoff triggers correctly

---

**Delete this file after completing the checklist.**
