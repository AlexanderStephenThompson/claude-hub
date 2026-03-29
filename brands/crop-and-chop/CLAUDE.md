# CLAUDE.md

## Project Overview

**crop-and-chop** is the brand delivery system for Crop & Chop -- a local microgreens subscription business with a mascot (Laura the Giraffe). This repo contains the commands, agents, and brand context that power content creation and market presence.

This is a Claude Code plugin. It does NOT contain coding skills or standards -- those live in [claude-hub](https://github.com/AlexanderStephenThompson/claude-hub) and deploy to `~/.claude/skills/`. Agents here reference those shared skills.

## Architecture

```
brand/          -> Brand identity, voice, terminology (read before any content output)
.claude/
  commands/     -> Slash commands for content workflows
  agents/       -> Multi-step agents for content repurposing
templates/      -> Reusable content scaffolds (signage, packaging, subscription)
```

## Key Principles

### Brand Voice (always apply)

Read `brand/voice.md` before generating ANY content. Key rules:

- **Tone:** Warm, specific, conversational. Like a note from a neighbor.
- **Laura the Giraffe:** First person, warm, enthusiastic -- never baby-talk, never corporate. She gets excited about harvest day and genuinely cares about the greens.
- **Sensory first:** Every product description needs sensory words (taste, texture, crunch). Lead with flavor, not health.
- **Social posts:** Under 50 words, 1-2 emoji max. Zero emoji is fine.
- **Email subjects:** Under 8 words, feel like a text from a friend. No urgency.
- **Subscriber language:** "Your greens" not "the product." Personal, not institutional.

### Banned Words (non-negotiable)

Never use these terms in any content:

- **Regulatory risk:** organic (unless certified), superfood, detox, cleanse, cure, prevent, treat, all-natural
- **Tone violations:** farm-fresh, locally-sourced, nutrient-packed, wellness, health journey
- **Urgency/scarcity:** don't miss out, limited time, act now, exclusive offer
- **AI-isms:** delve, leverage, multifaceted, furthermore, robust, compelling, navigate, foster, transformative, pivotal

### Products

Three tiers -- always use brand names, never generic sizes:

| Tier | Name | Price |
|------|------|-------|
| Small | Snack Pack | $7 |
| Medium | Family Fresh | $12 |
| Large | Chef's Choice | $18 |

### Channels

- **Farmers markets** -- primary sales channel, face-to-face
- **Subscription delivery** -- local recurring revenue
- **Social media** -- Instagram, Facebook

### Revenue Goal

Stable local cash flow. This is Alexander's primary cash flow engine -- not a venture-scale play. Grow steadily, serve well.

### Content Rules

1. Never lead with health claims -- lead with flavor or use
2. Every product mention includes at least one sensory detail
3. Laura posts are under 30 words, first person, warm
4. Social posts are under 50 words (excluding hashtags)
5. Email subjects are under 8 words
6. Max 1-2 emoji per post -- emoji soup kills the neighborly tone
7. Use brand terminology from `brand/domain.md` -- "varieties" not "types", "harvest" not "farm-fresh"
8. Run `brand/golden-tests.md` prompts after any voice/identity changes

## Development

| Change Type | Where |
|-------------|-------|
| Brand voice/identity | `brand/` |
| Content commands | `.claude/commands/` |
| Content agents | `.claude/agents/` |
| Content templates | `templates/` |
| Coding skills/standards | **Not here** -- go to claude-hub |

## File Conventions

- Commands: lowercase (`harvest-post.md`, `market-email.md`)
- Agents: kebab-case (`content-repurposer.md`)
- Brand files: lowercase (`identity.md`, `voice.md`)
- Template files: lowercase README.md per template folder
