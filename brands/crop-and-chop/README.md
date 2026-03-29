# Crop & Chop

Brand delivery system for Crop & Chop -- the commands, agents, and brand context that power content for a local microgreens subscription business. This repo is a Claude Code plugin that references universal skills from [claude-hub](https://github.com/AlexanderStephenThompson/claude-hub).

## Repo Structure

```
crop-and-chop/
├── CLAUDE.md                        # Claude Code project instructions
├── README.md
│
├── brand/                           # Brand identity and voice
│   ├── identity.md                  # Mission, products, audience, visual identity
│   ├── voice.md                     # Tone rules, banned words, testable constraints
│   ├── domain.md                    # Brand terminology and tagline
│   ├── golden-tests.md              # Voice quality checks (run after changes)
│   └── samples.md                   # Good/bad examples, named content patterns
│
└── .claude/
    ├── commands/                    # Slash commands (deploy to ~/.claude/commands/)
    │   ├── harvest-post.md          # Weekly harvest social media post
    │   ├── product-card.md          # Product card for a microgreen variety
    │   ├── laura-post.md            # Social post from Laura the Giraffe
    │   ├── market-email.md          # Subscriber email for market/harvest updates
    │   └── subscription-pitch.md    # Copy converting market shoppers to subscribers
    │
    └── agents/                      # Agents (deploy to ~/.claude/agents/)
        └── content-repurposer.md    # One piece of content -> multiple formats
```

## How It Works

This repo is a **Claude Code plugin**. Install it with:

```bash
claude plugin install <path-or-url>
```

### Relationship to claude-hub

| This repo (crop-and-chop) | claude-hub |
|---|---|
| Brand-specific content workflows | Universal coding standards |
| Microgreens content commands and agents | Domain-agnostic skills (code-quality, architecture, etc.) |
| Brand voice, identity, product info | Security, documentation, design skills |
| "How we talk to customers" | "How we write good code" |

### The test

> "Would a stranger using Claude Code benefit from this?"
>
> **Yes** -> it belongs in claude-hub
> **No, it's specific to running Crop & Chop** -> it belongs here

## Service -> Tool Map

| Activity | Commands | Agents |
|----------|----------|--------|
| **Weekly content** | `/harvest-post`, `/laura-post` | `content-repurposer` |
| **Product marketing** | `/product-card` | `content-repurposer` |
| **Email marketing** | `/market-email` | `content-repurposer` |
| **Subscriber conversion** | `/subscription-pitch` | -- |
| **Content scaling** | -- | `content-repurposer` |

## Build Order

Priority based on frequency x impact:

1. `/harvest-post` -- weekly cadence, most frequent content need
2. `/laura-post` -- mascot voice is hardest to maintain consistently
3. `/product-card` -- needed for each variety, reusable
4. `/market-email` -- weekly subscriber touchpoint
5. `/subscription-pitch` -- conversion copy, iterate based on market feedback
6. `content-repurposer` -- multiplies all of the above
