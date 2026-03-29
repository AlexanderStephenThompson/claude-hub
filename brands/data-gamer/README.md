# Data Gamer

Content system for Data Gamer — the commands, agents, and templates that power video scripts, social posts, stream descriptions, and wiki entries. This repo is a Claude Code plugin that references universal skills from [claude-hub](https://github.com/AlexanderStephenThompson/claude-hub).

## Repo Structure

```
data-gamer/
├── CLAUDE.md                        # Claude Code project instructions
├── README.md
│
├── brand/                           # Brand identity and voice
│   ├── identity.md                  # Mission, channels, audience, revenue model
│   ├── voice.md                     # Tone, rules, banned words
│   ├── domain.md                    # Brand terminology, channel points, tools
│   ├── golden-tests.md              # Voice quality checks
│   └── samples.md                   # Good/bad examples, content patterns
│
├── .claude/
│   ├── commands/                    # Slash commands for content workflows
│   │   ├── video-script.md          # Game + topic + data → full Data Story script
│   │   ├── video-hook.md            # 5 hook options for a video
│   │   ├── video-title.md           # 5 YouTube title options
│   │   ├── social-post.md           # Social media posts promoting videos
│   │   ├── stream-description.md    # Twitch stream descriptions
│   │   └── wiki-entry.md            # Data-backed wiki entries with DG voice
│   │
│   └── agents/                      # Agents for complex content production
│       ├── data-storyteller.md      # Raw data → narrative data story + viz suggestions
│       └── wiki-builder.md          # Game data → structured, cross-referenced wiki entries
│
└── templates/
    └── wiki-entry/                  # Scaffold for wiki entries
        └── README.md                # Template fields and structure
```

## How It Works

This repo is a **Claude Code plugin**. Install it with:

```bash
claude plugin install <path-or-url>
```

### Relationship to claude-hub

| This repo (data-gamer) | claude-hub |
|---|---|
| Content workflows for YouTube/Twitch | Universal coding standards |
| Brand-specific commands and agents | Domain-agnostic skills (data-sql, data-python, etc.) |
| Brand voice, identity, templates | Architecture, security, code-quality |
| "How we make content" | "How we write good code" |

Agents in this repo reference skills from `~/.claude/skills/` (deployed by claude-hub). For example, `data-storyteller` uses `data-sql` and `data-python` skills for the analysis that feeds into content.

### The test

> "Would a stranger using Claude Code benefit from this?"
>
> **Yes** → it belongs in claude-hub
> **No, it's specific to Data Gamer content** → it belongs here

## Content Type → Tool Map

| Content Type | Commands | Agents |
|--------------|----------|--------|
| **YouTube Videos** | `/video-script`, `/video-hook`, `/video-title` | `data-storyteller` |
| **Social Media** | `/social-post` | — |
| **Twitch Streams** | `/stream-description` | — |
| **Wiki / Reference** | `/wiki-entry` | `wiki-builder` |

## Build Order

Priority based on frequency and content pipeline:

1. `/video-hook` + `/video-title` — the front door for every video
2. `/video-script` + `data-storyteller` — core content production
3. `/social-post` — distribution after video ships
4. `/stream-description` — Twitch setup
5. `/wiki-entry` + `wiki-builder` — reference content library
