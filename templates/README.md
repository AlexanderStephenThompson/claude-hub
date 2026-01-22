# Templates

Boilerplate templates for extending the customization system.

## Available Templates

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

1. Copy the entire `skill/` folder to your target location
2. Rename placeholder files (remove `_` prefix)
3. Fill in your content following the template structure
4. Run through `CHECKLIST.md` before shipping
5. Delete `CHECKLIST.md` when done

**Example location for new skills:**
- `skills/my-new-skill/` (skills are shared at repository root, not inside teams)

## Template Conventions

- Files starting with `_` are placeholders (rename or delete)
- Delete sections marked "delete if unused"
- Keep skills under 500 lines / 2000 tokens
- Document all references, scripts, and assets in SKILL.md
