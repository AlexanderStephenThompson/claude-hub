# Web Project Template

Scaffolding for new web projects that follow the 3-tier architecture.

## What's Included

| File | Purpose |
|------|---------|
| `project-roadmap.md` | Living roadmap template — milestones, versioning, feature tracking, GitHub mapping |

## Architecture Standard

The code structure follows the architecture skill's web profile:

`~/.claude/skills/architecture/references/web.md`

That reference defines:
- **3-tier folder structure:** `01-presentation/` -> `02-logic/` -> `03-data/`
- **Dependency flow rules:** Presentation -> Logic -> Data (no reverse, no skipping)
- **Naming conventions:** PascalCase components, PascalCase+Service, PascalCase+Repository
- **Red flags:** 12 common violations with root causes and fixes
- **Project infrastructure:** Documentation/, config/, tests/ patterns
- **Recommended validators:** Architecture boundaries, design tokens, naming

## How to Use

1. Copy this folder into your new project's root
2. Fill in `project-roadmap.md` with your project's specifics
3. Create the tier folders per the architecture reference:
   ```
   mkdir 01-presentation 02-logic 03-data config tests Documentation
   ```
4. Set up validators (`validate:arch`, `validate:tokens`, `validate:naming`)
5. Start building — Data tier first, Logic second, Presentation last
