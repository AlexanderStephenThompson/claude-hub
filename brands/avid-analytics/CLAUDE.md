# CLAUDE.md

## Project Overview

**avid-analytics** is the business delivery system for Avid Analytics — a productized data and process consulting business. This repo contains the commands, agents, templates, and brand context that power client engagements.

This is a Claude Code plugin. It does NOT contain coding skills or standards — those live in [claude-hub](https://github.com/AlexanderStephenThompson/claude-hub) and deploy to `~/.claude/skills/`. Agents here reference those shared skills.

## Architecture

```
brand/          → Brand identity, voice, terminology (read before any client-facing output)
knowledge/      → Business frameworks and service definitions (read before scoping or pricing)
.claude/
  commands/     → Slash commands for delivery workflows
  agents/       → Multi-step agents for complex deliverables
templates/      → Project scaffolds copied to start client work
```

## Key Principles

### Brand Voice (always apply for client-facing output)

Read `brand/voice.md` before generating any client-facing content. Key rules:
- Lead with the recommendation, not the analysis
- Every recommendation names the tradeoff
- Use "I recommend" — never "maybe we could"
- No sentence with more than one industry term without explanation
- Proposals must have scope caps — never open-ended deliverables
- Run `brand/golden-tests.md` prompts after changes to voice/identity files

### Service Model

Three tiers, each builds on the previous:
- **Clarity** (Tier 1): Information architecture — files, folders, shared drives → organized and navigable
- **Trust** (Tier 2): Structured data — databases, pipelines, integrations → reliable and documented
- **Leverage** (Tier 3): Activated data — AI readiness, RAG, automation → future-proofed

Use brand terminology from `brand/domain.md` — e.g., "taxonomy reset" not "reorganization", "scope cap" not "limit".

### Delivery System

All engagements follow the same loop (from `knowledge/business-acumen.md`):
1. **Kickoff call** — align expectations
2. **Gather inputs** — get what's needed upfront, not as you go
3. **Get it built** — ship deliverable within 5 days (commit to 7)
4. **Review** — check client progress
5. **Get the win** — confirm value, ask for referrals

### Pricing

- Price on value created, not time spent
- Cost x 5 = price floor (ensures 80%+ margin)
- Every deliverable has a scope cap
- Three-tier pricing structure on every offer

## Shared Skills (from claude-hub)

Agents in this repo reference these skills at `~/.claude/skills/`:

| Skill | Used By |
|-------|---------|
| `data-sql` | `data-documenter`, `data-quality-checker`, `/audit-data` |
| `data-python` | `data-documenter`, `data-quality-checker` |
| `data-pipelines` | `data-documenter`, `/audit-data` |
| `data-aws` | `data-documenter` (when AWS infrastructure) |
| `data-iac` | `data-documenter` (when IaC present) |
| `architecture` | `process-mapper`, `automation-designer` |
| `code-quality` | All agents (baseline) |

## Development

| Change Type | Where |
|-------------|-------|
| Brand voice/identity | `brand/` |
| Business frameworks | `knowledge/` |
| Delivery commands | `.claude/commands/` |
| Delivery agents | `.claude/agents/` |
| Client project scaffolds | `templates/` |
| Coding skills/standards | **Not here** — go to claude-hub |

## File Conventions

- Commands: lowercase (`client-intake.md`, `draft-sop.md`)
- Agents: kebab-case (`sop-builder.md`, `data-documenter.md`)
- Brand files: lowercase (`identity.md`, `voice.md`)
- Knowledge files: kebab-case (`business-acumen.md`, `service-catalog.md`)
