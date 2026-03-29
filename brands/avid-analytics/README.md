# Avid Analytics

Business delivery system for Avid Analytics — the commands, agents, and templates that power client engagements. This repo is a Claude Code plugin that references universal skills from [claude-hub](https://github.com/AlexanderStephenThompson/claude-hub).

## Repo Structure

```
avid-analytics/
├── CLAUDE.md                        # Claude Code project instructions
├── README.md
│
├── brand/                           # Brand identity and voice
│   ├── identity.md                  # Mission, tiers, positioning, audience
│   ├── voice.md                     # Tone, rules, banned words
│   ├── domain.md                    # Brand terminology and metrics
│   ├── golden-tests.md              # Voice quality checks
│   └── samples.md                   # Good/bad examples, content patterns
│
├── knowledge/                       # Business knowledge (non-code)
│   ├── business-acumen.md           # Full business framework (validate → fulfill → grow → maintain)
│   ├── service-catalog.md           # Detailed service descriptions, scope, deliverables, pricing tiers
│   └── playbook-template.md         # Standard SOP template for client deliverables
│
├── .claude/
│   ├── commands/                    # Slash commands (deploy to ~/.claude/commands/)
│   │   ├── client-intake.md         # Discovery questionnaire → routes to right service
│   │   ├── scope-proposal.md        # Intake output → scoped proposal with pricing
│   │   ├── draft-sop.md             # Transcript/notes → formatted SOP
│   │   ├── playbook-review.md       # Review existing SOP for quality
│   │   ├── audit-data.md            # Data lineage map + gap report from a client repo
│   │   ├── process-audit.md         # Score processes → prioritized improvement roadmap
│   │   ├── automation-audit.md      # Score manual processes → automation candidates
│   │   └── dashboard-spec.md        # Business question + data source → dashboard spec
│   │
│   └── agents/                      # Agents (deploy to ~/.claude/agents/)
│       ├── data-documenter.md       # Crawls data project → lineage docs + data dictionary
│       ├── sop-builder.md           # Raw input → SOP + diagram → versioned playbook
│       ├── process-mapper.md        # Process description → flow diagram + bottleneck analysis
│       ├── automation-designer.md   # Process → trigger/workflow design + tool recommendations
│       └── data-quality-checker.md  # Dataset profiling → structured quality report
│
└── templates/                       # Project scaffolds for client engagements
    ├── data-project/                # Starter for data engineering/analytics clients
    │   ├── README.md
    │   ├── CLAUDE.md
    │   └── ...
    └── rag-project/                 # Starter for RAG implementation clients
        ├── README.md
        ├── CLAUDE.md
        └── ...
```

## How It Works

This repo is a **Claude Code plugin**. Install it with:

```bash
claude plugin install <path-or-url>
```

### Relationship to claude-hub

| This repo (avid-analytics) | claude-hub |
|---|---|
| Client-facing delivery workflows | Universal coding standards |
| Business-specific commands and agents | Domain-agnostic skills (data-sql, data-python, etc.) |
| Brand voice, identity, templates | Architecture, security, code-quality |
| "How we serve clients" | "How we write good code" |

Agents in this repo reference skills from `~/.claude/skills/` (deployed by claude-hub). For example, `data-documenter` uses `data-pipelines` and `data-sql` skills but adds Avid Analytics delivery workflow on top.

### The test

> "Would a stranger using Claude Code benefit from this?"
>
> **Yes** → it belongs in claude-hub
> **No, it's specific to running this business** → it belongs here

## Service → Tool Map

| Service | Commands | Agents |
|---------|----------|--------|
| **Data Engineering** | `/audit-data` | `data-documenter`, `data-quality-checker` |
| **Data Analytics** | `/dashboard-spec` | `data-quality-checker` |
| **RAG Systems** | `/audit-data` | `data-documenter` |
| **Process Improvement** | `/process-audit` | `process-mapper` |
| **Operations Playbooks** | `/draft-sop`, `/playbook-review` | `sop-builder` |
| **Automation & Orchestration** | `/automation-audit` | `automation-designer` |
| **Cross-cutting** | `/client-intake`, `/scope-proposal` | — |

## Build Order

Priority based on frequency x time cost x error risk:

1. `/draft-sop` + `sop-builder` — bootstraps itself; you use it to document everything else
2. `/client-intake` + `/scope-proposal` — the front door for all engagements
3. `/process-audit` + `process-mapper` — Systems pillar intake
4. `/audit-data` + `data-documenter` — Data pillar intake
5. Templates (data-project, rag-project) — scaffolds for delivery
