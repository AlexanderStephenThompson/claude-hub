# CLAUDE.md

## Project Overview

**vertex-vanguard** is the worldbuilding documentation and education hub where Alexander documents and teaches the craft of 3D art, VRChat world development, and universe design. This is NOT a storefront. It's a workshop — where the process, tools, and methodology are shared systematically.

This is a Claude Code plugin. It does NOT contain coding skills or standards — those live in [claude-hub](https://github.com/AlexanderStephenThompson/claude-hub) and deploy to `~/.claude/skills/`. Agents here reference those shared skills.

## Architecture

```
brand/          → Brand identity, voice, terminology (read before any content output)
knowledge/      → Business frameworks, content pipeline, growth strategy
.claude/
  commands/     → Slash commands for content creation workflows
  agents/       → Multi-step agents for complex content production
```

## Relationship to Kelston Chronicles

Vertex Vanguard explains the craft. Kelston Chronicles is the creative output.

- **VV** = "How I build worlds" — process, tools, methodology, frameworks
- **KC** = The worlds themselves — lore, story, characters, universe

VV tutorials may reference KC projects as real examples, but VV stands alone. Someone who never touches KC should still get full value from VV content.

## Key Principles

### Voice (always apply for any content output)

Read `brand/voice.md` before generating any content. Key rules:

- **Instructional + encouraging + systematic.** Workshop mentor, not professor.
- Tutorials open with the problem, not the tool
- Include at least one personal failure or struggle per tutorial
- Distill complex topics into reusable frameworks and mental models
- Show settings and numbers — never "adjust to your preference" without a starting point
- End tutorials with the principle behind the fix, not just the fix
- Run `brand/golden-tests.md` prompts after changes to voice/identity files

### Banned Phrases

Never use:

- "In this tutorial we will explore"
- "comprehensive", "premier", "world-class", "cutting-edge"
- "Step 1: Open Blender" (skip to the non-obvious part)
- "Your mileage may vary" (be specific instead)
- Any global AI-isms from `brand/voice.md`

### Tech Stack

| Tool | Use |
|------|-----|
| **Blender** | Modeling, texturing |
| **Unity** | World assembly |
| **VRChat SDK + UdonSharp** | Interactivity, networking |
| **ORL Shaders** | Materials |

**Not:** Unreal. Not Meta XR Toolkit.

### The Pipeline

Always in this order, never skip steps:

1. Retopo
2. UV unwrap
3. Texture

### VRChat World Anatomy Model

Alexander's framework for world design:

```
Spawn > Social Zones (small/medium/large) > Feature Layers > Connectors
```

- **Spawn:** Entry point, first impression
- **Social zones:** Scaled spaces for different group sizes
- **Feature layers:** Cross-zone systems (exploration, lighting, interactivity)
- **Connectors:** Tissue between zones (not just hallways — mood transitions)

Use terminology from `brand/domain.md` — e.g., "social zones" not "rooms", "connectors" not "hallways", "UdonSharp" not "Udon."

## Content Patterns

See `brand/samples.md` for full examples. The three core patterns:

| Pattern | When to Use |
|---------|-------------|
| **Problem-Fix Tutorial** | Something broke, here's how to fix it and why |
| **Framework Distillation** | Complex topic reduced to a reusable mental model |
| **Behind-the-Scenes** | In-progress update from the trenches |

## Shared Skills (from claude-hub)

Agents in this repo reference these skills at `~/.claude/skills/`:

| Skill | Used By |
|-------|---------|
| `unity-csharp` | `tutorial-builder`, world dev tutorials |
| `vrc-udon` | `tutorial-builder`, UdonSharp tutorials |
| `vrc-worlds` | `tutorial-builder`, `/world-design-review` |
| `vrc-avatars` | Avatar-related content |
| `code-quality` | All agents (baseline) |

## Development

| Change Type | Where |
|-------------|-------|
| Brand voice/identity | `brand/` |
| Business/growth frameworks | `knowledge/` |
| Content commands | `.claude/commands/` |
| Content agents | `.claude/agents/` |
| Coding skills/standards | **Not here** — go to claude-hub |

## File Conventions

- Commands: lowercase (`tutorial-script.md`, `bts-post.md`)
- Agents: kebab-case (`tutorial-builder.md`)
- Brand files: lowercase (`identity.md`, `voice.md`)
- Knowledge files: kebab-case (`content-pipeline.md`, `grow.md`)
