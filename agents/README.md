# Standalone Agents

Reference documentation for Claude Code agents stored in `~/.claude/agents/`. Unlike plugin team agents, standalone agents are invoked automatically by Claude when their description matches the current task.

---

## Available Agents

| Agent | Model | Purpose |
|-------|-------|---------|
| [codebase-scout](./codebase-scout.md) | Opus | Explore and document unfamiliar codebases |
| [improvement-auditor](./improvement-auditor.md) | Opus | Deep-dive codebase analysis for refactoring |

---

## Codebase Scout

**Purpose**: Systematically explore codebases and produce actionable documentation that accelerates onboarding for AI agents and developers.

### When It's Invoked

Claude automatically uses this agent when you:
- Ask to "explore this codebase"
- Request a "quick overview" of a project
- Need to "update CLAUDE.md"
- Ask "how do I run this?"
- Want to understand "the architecture"

### Exploration Protocol

The agent follows a 7-phase protocol:

| Phase | Focus |
|-------|-------|
| **1. Initial Survey** | Directory structure, project type, existing docs |
| **2. Build & Run** | Commands, package manager, CI config |
| **3. Tech Stack** | Languages, dependencies, dev tooling |
| **4. Architecture** | Entry points, modules, core abstractions, data flow |
| **5. Tests** | Location, framework, patterns, commands |
| **6. Patterns** | Coding style, error handling, logging, config |
| **7. Tribal Knowledge** | Git history, tech debt markers, gotchas |

### Scope Calibration

The agent adjusts its approach based on codebase size:

| Size | Files | Approach |
|------|-------|----------|
| Tiny | <20 | Read everything |
| Small | 20-100 | Full exploration |
| Medium | 100-500 | Focus on key modules, sample patterns |
| Large | 500-2000 | Map structure, deep-dive critical paths |
| Very Large | 2000+ | High-level map, parallel deep-dives |

### Parallel Exploration

For medium-to-large codebases, the agent launches parallel Task agents:

```
Coordinator (you):
├── Agent 1: Frontend specialist
├── Agent 2: Backend specialist
├── Agent 3: Test analysis
└── Agent 4: Infrastructure/DevOps
```

### Output Formats

| User Need | Output |
|-----------|--------|
| "Explore this codebase" | Full CLAUDE.md |
| "Quick overview" | Summary (1-2 paragraphs + key commands) |
| "Update CLAUDE.md" | Diff/additions to existing file |
| "How do I run this?" | Quick Start section only |
| "What's the architecture?" | Architecture section only |

### CLAUDE.md Structure

The agent generates documentation with:

**Required sections:**
- Project Overview (2-3 paragraphs)
- Quick Start (install, run, test, build commands)
- Tech Stack (language, framework, key deps)
- Architecture (directory structure, entry points, key modules)

**Recommended sections:**
- Development Workflow
- Configuration (env vars table)
- Common Patterns

**Optional sections:**
- Known Issues & Tech Debt
- Areas for Deeper Exploration

### Security Awareness

The agent never documents:
- API keys, tokens, secrets
- Passwords or credentials
- Internal URLs or IP addresses
- PII or sensitive business data

If hardcoded secrets are found, it flags them for remediation.

### Tool Preferences

| Prefer | Avoid |
|--------|-------|
| `Glob` - Find files by pattern | Running the project |
| `Grep` - Search file contents | Installing dependencies |
| `Read` - Read file contents | Modifying any files |
| `Bash` - Only for git commands | |

---

## Improvement Auditor

**Purpose**: Perform deep-dive codebase analysis to identify semantic clarity improvements, documentation gaps, and refactoring opportunities.

### When It's Invoked

Claude automatically uses this agent when you:
- Run `/deep-scan` command
- Ask to "audit this codebase"
- Request "improvement analysis"
- Need to identify "refactoring opportunities"

### Audit Categories

The agent analyzes across multiple dimensions:

| Category | Focus |
|----------|-------|
| **Naming Clarity** | Variables, functions, files, folders |
| **Documentation** | Missing docs, outdated content, gaps |
| **File Organization** | Structure, duplication, placement |
| **Code Patterns** | Consistency, anti-patterns, conventions |
| **Potential Improvements** | Refactoring opportunities |

### Priority Levels

Findings are prioritized by impact:

| Priority | Description |
|----------|-------------|
| **P0** | Critical issues blocking functionality |
| **P1** | High-impact improvements |
| **P2** | Medium improvements |
| **P3** | Nice-to-haves |

### Output

The agent produces `AUDIT-REPORT-[YYYY-MM-DD].md` containing:
- Executive summary
- Stack detection results
- Findings by category with file:line references
- Prioritized recommendations
- Suggested next steps

### Integration with Refactor Team

The audit report is automatically detected by `/refactor-team:refactor`:

```
/deep-scan                      # Produces AUDIT-REPORT-*.md
/refactor-team:refactor         # Finds and uses the report
```

This creates a seamless audit → refactor pipeline.

---

## Installing Agents

Agents are stored in `~/.claude/agents/`. To install:

```bash
# Create agents directory if it doesn't exist
mkdir -p ~/.claude/agents

# Copy agent file
cp codebase-scout.md ~/.claude/agents/
```

Agents become available immediately after placing the `.md` file in the directory.

---

## Creating Custom Agents

Agents are markdown files with YAML frontmatter:

```markdown
---
name: agent-name
description: "When to use this agent and what it does"
model: opus | sonnet | haiku
color: blue | green | red | purple | orange
---

# Agent Name

## Overview

What this agent does and its core principles.

## Instructions

Detailed instructions for how the agent should behave.
```

### Frontmatter Fields

| Field | Required | Purpose |
|-------|----------|---------|
| `name` | Yes | Agent identifier |
| `description` | Yes | Claude uses this to decide when to invoke |
| `model` | Yes | Which Claude model to use |
| `color` | No | Visual indicator in UI |

### Agent vs Command

| Aspect | Agent | Command |
|--------|-------|---------|
| Invocation | Automatic (by task match) | Manual (`/command`) |
| Scope | Persistent persona/role | One-shot task |
| Use case | Specialized expertise | Specific action |

---

## Agents vs Plugin Team Agents

| Aspect | Standalone Agents | Plugin Team Agents |
|--------|-------------------|-------------------|
| Location | `~/.claude/agents/` | `teams/{team}/agents/` |
| Invocation | Automatic by description | Via team command |
| Coordination | Independent | Part of multi-agent workflow |
| Skills | None | Can inherit from `skills/` folder |
| Use case | General-purpose helpers | Specialized team roles |
