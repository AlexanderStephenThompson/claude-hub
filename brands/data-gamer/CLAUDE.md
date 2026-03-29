# CLAUDE.md

## Project Overview

**data-gamer** is the content system for Data Gamer — a YouTube and Twitch channel that makes game guides backed by actual data. NOT an education channel. Gaming content first, data is the proof that makes guides more useful and trustworthy than anything else out there.

This is a Claude Code plugin. It does NOT contain coding skills or standards — those live in [claude-hub](https://github.com/AlexanderStephenThompson/claude-hub) and deploy to `~/.claude/skills/`. Agents here reference those shared skills.

## Architecture

```
brand/          → Brand identity, voice, terminology (read before any content output)
.claude/
  commands/     → Slash commands for content workflows
  agents/       → Multi-step agents for complex content production
templates/      → Content scaffolds (wiki entries, etc.)
```

## Key Principles

### Brand Voice (always apply)

Read `brand/voice.md` before generating ANY content. Key rules:

- **Voice:** Curious, slightly irreverent, data-first but never dry. "I analyzed every Pokemon" energy.
- **Lead with the counterintuitive stat or finding**, not context
- **First sentence must contain a specific number or claim**
- **Use "I" not "we"** — this is one person's curiosity
- **Sentences average under 15 words**; break up anything over 25
- **Every video hook:** "I [did X] and [surprising result]"
- **Humility about process**, confidence about findings
- **Gaming-first framing** — always. The game is the content; data is the proof.

### What Never Sounds Right

- "In this video we'll explore" — generic opener, wastes attention
- Hype-bro energy ("INSANE", "SMASH that like button")
- Educational framing ("Today we'll learn about...")
- Leading with the tool instead of the game ("I used Tableau to analyze...")
- Corporate voice ("we at Data Gamer")
- Any word from the banned list in `brand/voice.md`

### Tools (Behind the Scenes)

Data Gamer uses Tableau, Excel, and SQL to produce the analysis — but the audience sees the *findings*, not the tools. Tools are backstage, not content.

### Games

Systems-heavy titles where data analysis adds genuine play value:
- 7 Days to Die
- Oxygen Not Included
- Factorio

### Twitch Channel Point Rewards

Use exact names — these are brand terms:
- **Stat Check** — Viewer-submitted questions
- **Challenge the Hypothesis** — Viewer-proposed counter-analysis
- **Show the Spreadsheet** — Behind-the-data segment (25K points)
- **Kill Process** — Stream-ending redemption

### Content Patterns

All video scripts follow the Data Story pattern (from `brand/samples.md`):
1. **Hook:** Counterintuitive stat or bold claim
2. **Context:** "Here's what I did" — how data was collected
3. **Findings:** Walk through data with visuals noted
4. **So what:** Gameplay implications
5. **CTA:** Natural ("I'm tracking [next thing] — subscribe if you want to see that")

Run `brand/golden-tests.md` prompts after changes to voice/identity files.

## Shared Skills (from claude-hub)

Agents in this repo reference these skills at `~/.claude/skills/`:

| Skill | Used By |
|-------|---------|
| `data-sql` | `data-storyteller` (querying game data) |
| `data-python` | `data-storyteller` (analysis and processing) |

## Brand References

| Need | File |
|------|------|
| Who we are, audience, revenue model | `brand/identity.md` |
| Tone, rules, banned words | `brand/voice.md` |
| Brand terminology, channel points, tools | `brand/domain.md` |
| Voice quality checks | `brand/golden-tests.md` |
| Good/bad examples, content patterns | `brand/samples.md` |

## Development

| Change Type | Where |
|-------------|-------|
| Brand voice/identity | `brand/` |
| Content commands | `.claude/commands/` |
| Content agents | `.claude/agents/` |
| Content templates | `templates/` |
| Coding skills/standards | **Not here** — go to claude-hub |

## File Conventions

- Commands: kebab-case (`video-script.md`, `video-hook.md`)
- Agents: kebab-case (`data-storyteller.md`, `wiki-builder.md`)
- Brand files: lowercase (`identity.md`, `voice.md`)
- Template files: lowercase README.md per template folder
