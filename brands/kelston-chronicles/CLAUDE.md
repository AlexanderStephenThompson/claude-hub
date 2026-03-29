# CLAUDE.md

## Project Overview

**Kelston Chronicles** is an original anthro universe — a creative IP built around resident-adapted architecture across biome regions. This repo contains the brand voice, world-building commands, agents, and templates that produce KC content.

This is pure creative writing. No claude-hub skills apply here. No code standards, no architecture patterns — just world-building.

## The World

Kelston is a place where regions are distinct biomes, each with architecture, infrastructure, and everyday objects designed from the ground up for residents with fundamentally different physical forms. The concept is **resident-adapted architecture** — not accessibility, but a world where the built environment assumes diversity of body type, size, and lifestyle.

### 8 Regions

| Region | Palette | Mood |
|--------|---------|------|
| Tundra | Cool blues | Quiet, vast, still |
| Desert | Warm golds | Bright, expansive, dry heat |
| Rainforest | Deep greens | Humid, layered, alive |
| Coastal | Salt-washed blues | Breezy, tidal, weathered |
| Alpine | Crisp whites | Elevated, thin air, sharp light |
| Wetlands | Muted greens | Still, reflective, patient |
| Urban Canopy | Warm amber | Dense, vertical, lived-in |
| Nocturnal District | Purple/dark | Moody, intimate, glowing edges |

### Content Pillars

The World -> Regions -> Locations -> Residents -> Lore

Character as entry point, not story chronology. Cross-linking between residents, locations, and regions.

## Key Rules

### Voice (always apply)

Read `brand/voice.md` before generating any KC content. Non-negotiable rules:

- **Tone:** Soft, atmospheric, slightly poetic. Lo-fi album cover meets storybook atlas.
- **Emotional targets:** Cozy (warm + safe), wonder (quiet mystery), minimal pressure (no CTAs)
- **Sensory detail required:** Every description must have at least one sensory detail — light, sound, temperature, texture
- **Walking pace:** Lore reads slowly. Short paragraphs, no urgency words

### Banned Patterns

These are absolute. No exceptions, no edge cases.

- No CTAs: "click here," "learn more," "explore our world," "welcome to" — EVER
- No product language: users, features, content, platform, brand
- No design lineage: never mention Zootopia, "anthro universe," or design inspirations on the site
- No tourism language: "bustling," "popular destination," "must-see"
- No LinkedIn bios: "passionate about," "dedicated to," trait-listing character descriptions

### World Terms

Use Kelston's vocabulary, not generic terms:

| Use | Not |
|-----|-----|
| Residents | Characters |
| Regions | Zones, areas, biomes |
| Adapted architecture | Accessible design |
| Locations | Places, landmarks |
| Lore | History, backstory |

KC is a *place*, not a product. Write like you live there.

### Content Constraints

| Content Type | Constraint |
|--------------|------------|
| Character cards | Under 40 words, personality hook required |
| Homepage text | Under 100 words total — visual-first |
| Region pages | Color palette shifts per biome |
| Lore fragments | Found objects, not encyclopedia entries |

### Visual Direction

- **Base:** Dark atmospheric (midnight/charcoal)
- **Accents:** Warm amber lamplight + desaturated blue/teal
- **Surfaces:** Soft gradients, gentle shadows, rounded corners
- **Motion:** Subtle only — slow parallax, drifting dust/stars
- **Per-region:** Color palette shifts when entering a region page

## Architecture

```
brand/          -> Brand identity, voice, terminology, quality tests
.claude/
  commands/     -> Slash commands for writing KC content
  agents/       -> Multi-step agents for world-building workflows
templates/      -> Scaffolds for new regions, characters, lore
```

## File Conventions

- Commands: lowercase (`region-page.md`, `character-card.md`)
- Agents: kebab-case (`world-writer.md`, `consistency-checker.md`)
- Brand files: lowercase (`identity.md`, `voice.md`)
- Templates: by content type (`templates/region/`, `templates/character/`, `templates/lore/`)

## Quality Checks

Run `brand/golden-tests.md` prompts after any changes to voice or identity files. The test is simple: does the output feel like entering a world, or reading a product page?
