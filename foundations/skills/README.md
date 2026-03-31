# Skills (Single Source of Truth)

Shared skills that all teams and agents can reference. Each skill is a comprehensive module containing standards, references, assets, and scripts.

## Available Skills

### Core Skills (Complete)

Fully developed skills with comprehensive standards, examples, and checklists.

| Skill | Purpose | Status |
|-------|---------|--------|
| [architecture](./architecture/) | Architecture principles, module boundaries, design patterns. Domain profiles distributed: `web.md` in `web-development/skills/`, `unity/vrchat/blender.md` in `world-building/skills/`, `data-iac.md` in `data/skills/` — all merge on deploy | Complete |
| [code-quality](./code-quality/) | TDD, naming, conventions, docstrings, 3-tier structure, language references | Complete |
| [documentation](./documentation/) | SemVer, changelog, feature specs, module templates | Complete |
| [security](./security/) | OWASP Top 10, input validation, auth patterns | Complete |

### Web Skills

Web-specific skills with comprehensive SKILL.md content. Located in `web-development/skills/`.

| Skill | Purpose |
|-------|---------|
| [design](../../web-development/skills/design/) | Design system, design tokens, component states, layout philosophy |
| [semantic-structure](../../web-development/skills/semantic-structure/) | Document structure, landmarks, headings |
| [semantic-content](../../web-development/skills/semantic-content/) | Images, lists, tables, text formatting, media |
| [semantic-interaction](../../web-development/skills/semantic-interaction/) | Buttons, links, forms, keyboard nav, focus, ARIA |
| [css-selectors](../../web-development/skills/css-selectors/) | Selectors, naming (BEM), specificity, cascade, dead CSS |
| [css-positioning](../../web-development/skills/css-positioning/) | Box model, grid, flexbox, responsive patterns, property order |
| [css-styling](../../web-development/skills/css-styling/) | Design tokens, colors, typography, shadows, animation, states |
| [web-performance](../../web-development/skills/web-performance/) | Performance optimization |

### Data Engineering Skills

Skills for data processing, pipelines, and cloud infrastructure.

Located in `data/skills/`.

| Skill | Purpose |
|-------|---------|
| [data-python](../../data/skills/data-python/) | Python for data processing (pandas, polars, pyspark) |
| [data-sql](../../data/skills/data-sql/) | Query optimization, window functions, schema design |
| [data-pipelines](../../data/skills/data-pipelines/) | ETL patterns, orchestration, idempotency, data quality |
| [data-aws](../../data/skills/data-aws/) | AWS data services (Glue, Lambda, S3, Athena, Redshift) |
| [data-iac](../../data/skills/data-iac/) | Infrastructure as Code (Terraform, CDK, CloudFormation) |

### Unity & VRChat Skills

Skills for Unity game development and VRChat content creation. Located in `world-building/`.

| Skill | Purpose |
|-------|---------|
| [unity-csharp](../../world-building/unity/skills/unity-csharp/) | Unity C# scripting, MonoBehaviour patterns, VR/mobile performance |
| [vrc-udon](../../world-building/vr-chat/skills/vrc-udon/) | Udon/UdonSharp for VRChat worlds, networking |
| [vrc-worlds](../../world-building/vr-chat/skills/vrc-worlds/) | VRChat world building, lighting, optimization |
| [vrc-avatars](../../world-building/vr-chat/skills/vrc-avatars/) | VRChat avatars, expressions, PhysBones, performance limits |

## Skill Relationships

Skills have defined boundaries to avoid duplication. See each skill's "Scope and Boundaries" section.

```
                         ┌─────────────┐
                         │ code-quality│ (TDD, naming, conventions, docstrings)
                         └──────┬──────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
         ┌────▼─────┐                       ┌─────▼──────┐
         │architecture│                     │documentation│
         └───────────┘                      └─────────────┘

    ┌─────────────────────────────────────────────────────────┐
    │                      DOMAIN SKILLS                       │
    └─────────────────────────────────────────────────────────┘

    Web Stack              Data Engineering        Unity/VRChat
    ──────────             ────────────────        ────────────
    design                 data-python             unity-csharp
    semantic-structure     data-sql                vrc-udon
    semantic-content       data-pipelines          vrc-worlds
    semantic-interaction   data-aws                vrc-avatars
    css-selectors          data-iac
    css-positioning
    css-styling
    web-performance

    ┌─────────────────────────────────────────────────────────┐
    │                       CROSS-CUTTING                      │
    │                         security                         │
    └─────────────────────────────────────────────────────────┘
```

**Key relationships:**
- `code-quality` is foundational; most skills build on it
- `design` defines visual principles; `css-selectors`, `css-positioning`, `css-styling` implement them
- `semantic-structure`, `semantic-content`, `semantic-interaction` cover HTML element selection (previously split across `design` and `web-accessibility`)
- `security` is cross-cutting and applies to all domains
- Domain skills (web, data, unity) are independent of each other

## Skill Structure

Each skill contains:

```
skill-name/
├── SKILL.md           # Main standards document (the source of truth)
├── assets/            # Templates, checklists, configs
├── references/        # Detailed reference guides
└── scripts/           # Validation and analysis tools
```

## Usage

**For Teams:** Reference skills in agent definitions to inherit standards.

**For Agents:** Load relevant SKILL.md and references based on task context.

**For Developers:** Use as authoritative guidelines for all work.

## Key Principle

> **These skills are the single source of truth.** All teams, agents, and workflows reference these shared skills. Edits here propagate everywhere.
