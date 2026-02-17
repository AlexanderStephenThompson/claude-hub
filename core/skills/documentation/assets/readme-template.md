# Project Name

> One-line description: what this project does in plain language.

<!--
  Keep this to one sentence. No jargon, no marketing.
  Test: would you feel silly saying this out loud? Rewrite it.
  Example: "Generate weekly meal plans based on dietary preferences and grocery budgets."
-->

---

## Quick Start

<!--
  Maximum 5 steps. No explanations — just commands and success signals.
  Link to Prerequisites if there are hard requirements.
  This section builds trust: if it works, the reader trusts the rest.
-->

> Requires [runtime] [version]+ ([full prerequisites](#prerequisites))

1. Clone and install:
   ```bash
   git clone <repo-url>
   cd <project-name>
   <install-command>
   ```

2. Configure:
   ```bash
   cp .env.example .env
   ```

3. Start:
   ```bash
   <start-command>
   ```
   You should see: `<expected output>`

4. Open <URL> — you should see <what the running app looks like>.

---

## What This Does

<!-- List the 3-5 core capabilities. Be specific. -->

- Capability 1
- Capability 2
- Capability 3

## What This Doesn't Do

<!--
  Prevent wrong expectations. Be honest about scope.
  This saves users from investing 30 minutes only to discover
  the project doesn't support their use case.
-->

- Does not handle X
- Does not integrate with Y (yet)

---

## Prerequisites

<!--
  Be brutally honest. Every hidden prerequisite is a future support ticket.
  Include exact versions and a check command for each.
-->

| Requirement | Version | Check |
|-------------|---------|-------|
| Runtime | X.Y+ | `<runtime> --version` |
| Database | X.Y+ | `<db-check-command>` |
| Tool | X.Y+ | `<tool> --version` |

---

## Setup

<!--
  Full setup with validation at every step.
  Pattern: What to do → What you should see → If it didn't work
-->

### 1. Install dependencies

```bash
<install-command>
```

You should see `<expected output>` with no errors.

> **If you see permission errors:** <fix>

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set these values:

| Variable | Description | Example |
|----------|-------------|---------|
| `VARIABLE_1` | What it controls | `example-value` |
| `VARIABLE_2` | What it controls | `example-value` |

### 3. Initialize data

```bash
<migration-or-setup-command>
```

You should see: `<expected output>`

### 4. Verify

```bash
<test-command>
```

All tests should pass. If they do, the project is ready.

---

## Usage

<!--
  Show the 2-3 most common workflows with real examples.
  Not an API reference — a "here's what you'll actually do" guide.
-->

### Primary Workflow

```bash
<command>
```

This does <what it does>. Output: <what the user gets>.

### Secondary Workflow

```bash
<command>
```

---

## Project Structure

<!--
  Top 1-2 levels only. One-line explanations.
  Answers: "I need to change X — where do I look?"
-->

```
project-name/
  folder-1/          # What's in here
  folder-2/          # What's in here
  folder-3/          # What's in here
  config/            # Configuration files
```

---

## Configuration

<!--
  Table format. Every configurable value with its purpose and default.
  "All configuration is in <location>."
-->

All configuration is in `.env`. See `.env.example` for defaults.

| Variable | Purpose | Default | Options |
|----------|---------|---------|---------|
| `VARIABLE_1` | What it controls | `default` | Valid options |
| `VARIABLE_2` | What it controls | `default` | Valid options |

---

## Troubleshooting

<!--
  Cover failures you've seen or can predict.
  Don't skip this because "it should just work." It won't.
-->

| Problem | Cause | Fix |
|---------|-------|-----|
| `Error message 1` | Why it happens | What to do |
| `Error message 2` | Why it happens | What to do |
| Feature doesn't work after pull | New dependencies | Run `<install-command>` again |

---

## Contributing

<!--
  How to help, where to start, what the workflow looks like.
  For larger projects, link to a dedicated CONTRIBUTING.md.
-->

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes
4. Run tests: `<test-command>`
5. Submit a PR (merge with `--no-ff`, do not delete the branch)
