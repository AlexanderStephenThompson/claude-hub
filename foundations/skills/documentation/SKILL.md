---
name: documentation
description: Documentation standards for changelogs, feature specs, and module documentation
user-invocable: false
---

# Documentation Skill

**Version:** 1.0
**Source:** Documentation Standards

> Non-negotiable documentation standards. Documentation ships with code, not after it.

---

## Core Principles

1. **Documentation Ships with Code** — Every feature includes updated documentation
2. **Single Source of Truth** — `/Documentation` folder is THE reference
3. **Agent Continuity** — Documentation enables agents to understand context
4. **Living Documents** — Keep documentation current, not stale

---

## The Documentation Feedback Loop

```
Agent reads /Documentation → Understands context → Does work → Updates /Documentation → Next agent reads
```

When you update `/Documentation`, you're helping the next agent (including future you) understand the project.

---

## Semantic Versioning (SemVer)

### Format

```
MAJOR.MINOR.PATCH
```

| Type | When to Bump | Examples |
|------|--------------|----------|
| **MAJOR** | Breaking change to behavior, inputs, outputs, or structure | API contract changes, removed features, renamed files |
| **MINOR** | New user-visible capability or workflow | New feature, new endpoint, new command |
| **PATCH** | Bug fixes, small improvements, no new capability | Fix typo, improve performance, formatting |

### Release Naming Convention

```
vX.Y.Z — [Program] / [Module]: [Feature]
```

| Component | Type | Description |
|-----------|------|-------------|
| **Program** | Noun | Major domain (e.g., Kitchen, Garden) |
| **Module** | Noun-phrase | Capability area (e.g., Planning, Tasks) |
| **Feature** | Verb/Noun-phrase | Specific action (e.g., Create meal plan) |

**Examples:**
- `v0.2.0 — Kitchen / Planning: Create weekly meal plan`
- `v0.3.0 — Garden / Tasks: Track watering routine`
- `v0.4.1 — Kitchen / Planning: Fix missing quantities`

### Scope Tags (Machine-Friendly)

```
scope: program.module.feature
```

**Examples:**
- `scope: kitchen.planning.generate-shopping-list`
- `scope: garden.tasks.track-watering-routine`

### Compatibility Rules

**MAJOR bump when ANY of these change in a breaking way:**
- File/folder paths or naming conventions
- Required inputs or workflow order
- Output contract (required sections, templates)

**MINOR bump when:**
- New workflow outcome added
- Module gains end-to-end feature
- Docs gain new non-breaking sections

**PATCH bump when:**
- Bug fixes, formatting, typos
- Performance improvements without contract change

---

## Folder Structure

```
/Documentation/
  project-roadmap.md       # Living plan + progress tracking
  architecture.md          # System design overview
  changelog.md             # Version history (Keep a Changelog)
  features/
    [program-name]/
      [module-name]/
        _[module-name].md  # Module explainer (underscore sorts first)
        feature-name-1.md  # Feature specification
        feature-name-2.md  # Feature specification
```

### Key Files

| File | Purpose |
|------|---------|
| `project-roadmap.md` | Strategic roadmap (v0.1 → v1.0), milestones |
| `architecture.md` | System design, data flow, key components |
| `changelog.md` | Version history (Keep a Changelog format) |
| `_*.md` (module) | Module overview, features list, dependencies |
| `*.md` (feature) | User story, acceptance criteria, tech notes |

---

## Root README

The README is a **bridge**, not a brochure. Its job is to take someone from "what is this?" to "I have it running and understand how to use it." If a reader follows the README top to bottom and can't get the project working, the README failed — not the reader.

### Two Audiences, One Document

- **"Just run it" readers** — Want a working state in 5 minutes. They'll read Title, Quick Start, and Setup.
- **"Understand it" readers** — Want to know why things work. They still want Quick Start first — understanding is easier once you've seen the thing running.

The section order below serves both. Skim readers exit early with a working result. Deep readers continue into structure and configuration.

### Section Order

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Title + One-Liner** | "Is this relevant to me?" in 10 seconds |
| 2 | **Quick Start** | First success in ≤5 minutes |
| 3 | **What This Does / Doesn't** | Set correct expectations |
| 4 | **Prerequisites** | Honest dependency list |
| 5 | **Setup** | Full environment setup with validation |
| 6 | **Usage** | Core workflows with real examples |
| 7 | **Project Structure** | Where things live and why |
| 8 | **Configuration** | What's customizable and how |
| 9 | **Troubleshooting** | Common failures + fixes |
| 10 | **Contributing** | How to help, where to start |

**Why this order:** Sections 1–2 are engagement gates (fail here and the reader leaves). Sections 3–5 are foundation (skip these and the reader gets lost later). Sections 6–8 are reference (dip in and out as needed). Sections 9–10 are safety nets (when things go wrong or someone wants to contribute).

### Key Principles

1. **Success Horizons** — Every instruction ends with what the reader should see. `npm run db:migrate` alone is incomplete. Add: *You should see: `Migrations complete. 12 tables created.`*
2. **Honest Prerequisites** — List exact versions with check commands. Hidden requirements become support tickets.
3. **Concrete Over Abstract** — Use the project's actual names and paths, not `{placeholder}` patterns.
4. **Jargon Translation** — If a term would make someone stop and Google, translate it immediately.
5. **Failure Modes** — Document common failures inline (`> **If you see [error]:** [cause]. Fix: [what to do]`), catch the rest in Troubleshooting.
6. **Scannable Structure** — Headers, code blocks, tables, short paragraphs. Never walls of text.

> **Full guide:** `references/readme-guide.md` — Section-by-section details with Good/Bad examples and anti-patterns
> **Template:** `assets/readme-template.md` — Copy-paste starter with all 10 sections

---

## Feature Specifications

### Required Elements

Every feature file MUST include:

1. **One-line description**
2. **Module reference and status**
3. **User story** (As a / I want / So that)
4. **Overview and basic scenario**
5. **Acceptance criteria** (testable checkboxes)
6. **Data model** (if applicable)
7. **Technical notes with Standards Checklist**
8. **Open questions**
9. **Related features**

Use the template at `assets/feature-template.md`. Every feature file must include: one-line description, module reference + status, user story (As/Want/So), overview with basic scenario, testable acceptance criteria, data model (if applicable), technical notes with standards checklist, open questions, and related features.

---

## Module Explainers

Use the template at `assets/module-template.md`. Each module explainer includes: one-line description, program reference + status count, overview, feature table (with status + links), dependencies, and architecture notes.

---

## Changelog Format

Follow [Keep a Changelog](https://keepachangelog.com/) format. Use the template at `assets/changelog-template.md`.

### Change Types

| Type | Description |
|------|-------------|
| **Added** | New features |
| **Changed** | Changes in existing functionality |
| **Deprecated** | Soon-to-be removed features |
| **Removed** | Now removed features |
| **Fixed** | Bug fixes |
| **Security** | Vulnerability fixes |

---

## Status Formats

| Context | Format | Values |
|---------|--------|--------|
| `project-roadmap.md` | Emoji | ⏳ Planned, 🔄 In Progress, ✅ Complete, 🚫 Blocked |
| Feature/Module files | Text | Planned, In Progress, Complete |
| Open questions | Text | Open, Resolved |

**Rationale:** Emoji in roadmap for visual scanning. Text in feature files for AI parsing.

---

## Documentation Checklist

Before considering documentation complete:

### Feature Files
- [ ] One-line description present
- [ ] Status is current and accurate
- [ ] User story follows As/Want/So format
- [ ] Acceptance criteria are testable checkboxes
- [ ] Standards checklist is complete
- [ ] Open questions addressed or documented

### Module Explainers
- [ ] Feature table is current
- [ ] Status counts are accurate
- [ ] Dependencies listed

### Project-Level
- [ ] Roadmap reflects current state
- [ ] Changelog updated for release
- [ ] Architecture doc current

---

## References

- `references/semver-guide.md` — Complete semantic versioning guide
- `references/changelog-format.md` — Keep a Changelog format
- `references/feature-spec-guide.md` — Feature specification writing guide
- `references/readme-guide.md` — Root README writing guide

## Assets

- `assets/feature-template.md` — Feature file template
- `assets/module-template.md` — Module explainer template
- `assets/changelog-template.md` — Changelog template
- `assets/readme-template.md` — README template

## Scripts

- `scripts/validate_docs.py` — Validate documentation structure
- `scripts/generate_feature.py` — Generate feature file from template
