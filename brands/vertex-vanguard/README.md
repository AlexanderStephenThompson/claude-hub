# Vertex Vanguard

Worldbuilding documentation and education hub — the commands, agents, and brand context that power content creation. This repo is a Claude Code plugin that references universal skills from [claude-hub](https://github.com/AlexanderStephenThompson/claude-hub).

## Repo Structure

```
vertex-vanguard/
├── CLAUDE.md                        # Claude Code project instructions
├── README.md
│
├── brand/                           # Brand identity and voice
│   ├── identity.md                  # Mission, audience, outputs, tech stack
│   ├── voice.md                     # Tone, rules, banned words
│   ├── domain.md                    # Brand terminology, pipeline, world anatomy model
│   ├── golden-tests.md              # Voice quality checks
│   └── samples.md                   # Good/bad examples, content patterns
│
├── knowledge/                       # Business and content knowledge
│   ├── grow.md                      # Growth strategy (from Business knowledge base)
│   └── content-pipeline.md          # Content creation pipeline: idea → publish → repurpose
│
├── .claude/
│   ├── commands/                    # Slash commands for content workflows
│   │   ├── tutorial-script.md       # Problem-Fix Tutorial script
│   │   ├── framework-distill.md     # Distill complex topic into clean framework
│   │   ├── bts-post.md              # Behind-the-scenes social post
│   │   └── world-design-review.md   # Review world design against World Anatomy Model
│   │
│   └── agents/                      # Agents for complex content production
│       └── tutorial-builder.md      # Full tutorial from concept/problem → published script
```

## How It Works

This repo is a **Claude Code plugin**. Install it with:

```bash
claude plugin install <path-or-url>
```

### Relationship to claude-hub

| This repo (vertex-vanguard) | claude-hub |
|---|---|
| Content creation workflows | Universal coding standards |
| Brand-specific commands and agents | Domain-agnostic skills (unity-csharp, vrc-udon, etc.) |
| Brand voice, identity, content pipeline | Architecture, security, code-quality |
| "How we create and teach worldbuilding content" | "How we write good code" |

### Relationship to Kelston Chronicles

| Vertex Vanguard | Kelston Chronicles |
|---|---|
| The craft behind the worlds | The worlds themselves |
| "How I build worlds" | The lore, story, universe |
| Tutorials, frameworks, BTS content | Creative fiction, worldbuilding output |
| Standalone value — no KC knowledge required | May reference VV for process details |

### The test

> "Is this about the craft of building, or the thing being built?"
>
> **Craft** → it belongs in Vertex Vanguard
> **Creative output** → it belongs in Kelston Chronicles

## Content Pattern → Tool Map

| Content Type | Command | Agent |
|--------------|---------|-------|
| **Problem-Fix Tutorial** | `/tutorial-script` | `tutorial-builder` |
| **Framework Distillation** | `/framework-distill` | — |
| **Behind-the-Scenes Post** | `/bts-post` | — |
| **World Design Review** | `/world-design-review` | — |

## Shared Skills (from claude-hub)

| Skill | Purpose |
|-------|---------|
| `unity-csharp` | C# patterns for Unity — MonoBehaviour, architecture, VR performance |
| `vrc-udon` | UdonSharp patterns — networking, sync, interactions |
| `vrc-worlds` | VRChat world building — setup, lighting, optimization |
| `vrc-avatars` | VRChat avatar building — expressions, performance |
| `code-quality` | Baseline code standards |
