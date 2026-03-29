# Kelston Chronicles

World-building system for Kelston Chronicles — an original anthro universe where resident-adapted architecture shapes every region, location, and life within it. This repo contains the brand voice, content commands, world-building agents, and templates that produce KC content.

## Repo Structure

```
kelston-chronicles/
├── CLAUDE.md                           # Claude Code project instructions
├── README.md
│
├── brand/                              # Brand identity and voice
│   ├── identity.md                     # World concept, audience, content pillars
│   ├── voice.md                        # Tone, emotional targets, banned words
│   ├── domain.md                       # World terminology, region palettes, visual direction
│   ├── golden-tests.md                 # Voice quality checks (region, character, homepage, lore)
│   └── samples.md                      # Good/bad examples, content patterns, anti-patterns
│
├── .claude/
│   ├── commands/                       # Slash commands for content creation
│   │   ├── region-page.md              # Write a region page (palette, atmosphere, locations, residents)
│   │   ├── character-card.md           # Write a character card (under 40 words, personality hook)
│   │   ├── lore-fragment.md            # Write a lore fragment (found object, not wiki entry)
│   │   └── location-sketch.md          # Write a location description (sensory, immersive)
│   │
│   └── agents/                         # Multi-step agents
│       ├── world-writer.md             # Seed idea -> interconnected world content
│       └── consistency-checker.md      # Review content for contradictions and voice violations
│
└── templates/                          # Scaffolds for new content
    ├── region/README.md                # Template for region pages
    ├── character/README.md             # Template for character cards
    └── lore/README.md                  # Template for lore fragments
```

## Content Type Map

| Content Type | Command | Template | Agent |
|--------------|---------|----------|-------|
| Region page | `/region-page` | `templates/region/` | `world-writer` |
| Character card | `/character-card` | `templates/character/` | `world-writer` |
| Lore fragment | `/lore-fragment` | `templates/lore/` | `world-writer` |
| Location sketch | `/location-sketch` | — | `world-writer` |
| Cross-content review | — | — | `consistency-checker` |

## Relationship to Vertex Vanguard

| Kelston Chronicles | Vertex Vanguard |
|---|---|
| The creative output | The craft behind it |
| "Here is a world" | "Here is how we built it" |
| Atmospheric, immersive, no meta-commentary | Educational, transparent, process-focused |
| Residents experience the world | Readers learn the techniques |

KC never explains itself. It shows the world and lets visitors inhabit it. Vertex Vanguard is where the design thinking, technical breakdowns, and craft discussions live. The two never cross on-site — KC stays in-world, VV stays behind-the-scenes.

## What This Is Not

- Not a business play. Alexander-first, always.
- Not a code project. No claude-hub skills apply here.
- Not a wiki. Lore is fragments, not encyclopedias.
- Not a product. No users, no features, no platform language.

Monetization is distant and never the driver. This is creative IP with a soul.
