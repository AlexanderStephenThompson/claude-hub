# Root README Guide

How to write a README that people actually read, actually follow, and reliably end up with the intended result.

---

## What a README Is (and Isn't)

A README is a **bridge**, not a brochure. Its job is to take someone from "what is this?" to "I have it running and understand how to use it." If someone reads your README top to bottom and can't get the project working, the README failed — not the reader.

**Two audiences, one document:**
- **"Just run it" readers** — They want to get to a working state in 5 minutes. They'll read the title, Quick Start, and Setup. If those sections work, they trust the rest.
- **"Understand it" readers** — They want to know why things work the way they do. They'll read everything. But they still want the Quick Start first, because understanding is easier once you've seen the thing working.

The section order below serves both. Skim readers exit early with a working result. Deep readers continue into structure and configuration.

---

## Section Order

This order is intentional. Each section earns its position.

| # | Section | Purpose | Reader Gets |
|---|---------|---------|-------------|
| 1 | **Title + One-Liner** | "Is this relevant to me?" in 10 seconds | Relevance check |
| 2 | **Quick Start** | First success in ≤5 minutes | Working result, trust |
| 3 | **What This Does / Doesn't** | Set correct expectations | Scope clarity |
| 4 | **Prerequisites** | Honest dependency list | No surprise failures at step 7 |
| 5 | **Setup** | Full environment setup with validation | Running environment |
| 6 | **Usage** | Core workflows with real examples | Productive capability |
| 7 | **Project Structure** | Where things live and why | Navigation confidence |
| 8 | **Configuration** | What's customizable and how | Personalized setup |
| 9 | **Troubleshooting** | Common failures + fixes | Self-unblocking ability |
| 10 | **Contributing** | How to help, where to start | Team onboarding path |

**Why this order:**
- Sections 1–2 are **engagement gates**. Fail here and the reader leaves.
- Sections 3–5 are **foundation**. Skip these and the reader gets lost later.
- Sections 6–8 are **reference**. Readers dip in and out as needed.
- Sections 9–10 are **safety nets**. They exist for when things go wrong or someone wants to contribute.

---

## Section Details

### 1. Title + One-Liner

The title is the project name. The one-liner says what it does in plain language — no marketing, no jargon.

**Good:**
```markdown
# Meal Planner

Generate weekly meal plans based on dietary preferences and grocery budgets.
```

**Bad:**
```markdown
# MealPlannerPro

A next-generation, AI-powered, full-stack meal planning solution leveraging
cutting-edge algorithms for optimal nutritional outcomes.
```

The one-liner should pass the "explain it to a colleague" test. If you'd feel silly saying it out loud, rewrite it.

---

### 2. Quick Start

The most important section in the entire README. This is where trust is built or lost.

**Rules:**
- Maximum 5 steps
- No explanation of why — just what to do
- Every step has a success signal ("you should see X")
- If prereqs are needed, say so in one line and link to the Prerequisites section

**Good:**
```markdown
## Quick Start

> Requires Node.js 18+ ([full prerequisites](#prerequisites))

1. Clone and install:
   ```bash
   git clone https://github.com/you/meal-planner.git
   cd meal-planner
   npm install
   ```

2. Set up environment:
   ```bash
   cp .env.example .env
   ```

3. Start the app:
   ```bash
   npm start
   ```
   You should see: `Server running on http://localhost:3000`

4. Open http://localhost:3000 — you should see the meal planning dashboard.
```

**Bad:**
```markdown
## Getting Started

First, make sure you have the right version of Node.js installed. We recommend
using nvm to manage your Node versions. You can install nvm by following the
instructions at https://github.com/nvm-sh/nvm. Once nvm is installed...

[300 words later, reader still hasn't typed a command]
```

The Quick Start is a speedrun. Save explanations for later sections.

---

### 3. What This Does / Doesn't

Prevent wrong expectations. Two bullet lists, nothing more.

```markdown
## What This Does

- Generates weekly meal plans from dietary preferences
- Creates grocery lists with estimated costs
- Tracks pantry inventory to reduce waste

## What This Doesn't Do

- Does not handle meal delivery or ordering
- Does not provide nutritional advice (consult a dietitian)
- Does not integrate with grocery store APIs (yet)
```

**Why this matters:** Without this section, users discover limitations at the worst time — after they've invested 30 minutes setting it up for a use case it doesn't support.

---

### 4. Prerequisites

Be brutally honest. Every hidden prerequisite is a future support ticket.

**Rules:**
- List exact versions, not ranges
- Include a verification command for each
- Don't assume anything is "obvious" — if they need it, list it

**Good:**
```markdown
## Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| Node.js | 18.0+ | `node --version` |
| npm | 9.0+ | `npm --version` |
| PostgreSQL | 15+ | `psql --version` |
| Git | Any | `git --version` |
```

**Bad:**
```markdown
## Prerequisites

- Node.js
- A database
```

"A database" — which one? What version? How do I check if I have it? This saves you from the issue where someone follows your setup perfectly but fails at step 5 because they have PostgreSQL 12 instead of 15.

---

### 5. Setup

The full setup, with validation at every step. This is where you earn "reliably end up with the intended result."

**The pattern for every step:**
1. What to do (the command or action)
2. What you should see (the success signal)
3. If it didn't work (common failure + fix)

**Good:**
```markdown
## Setup

### 1. Install dependencies

```bash
npm install
```

You should see `added XXX packages` with no errors.

> **If you see permission errors:** Run `npm install` without `sudo`.
> If that fails, check your npm prefix: `npm config get prefix`

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set these values:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/mealplanner` |
| `SESSION_SECRET` | Any random string (32+ chars) | `a1b2c3d4...` |

> **Tip:** Generate a session secret with `openssl rand -hex 32`

### 3. Set up the database

```bash
npm run db:migrate
npm run db:seed
```

You should see `Migrations complete` and `Seeded 50 recipes`.

### 4. Verify everything works

```bash
npm test
```

All tests should pass. If they do, run `npm start` — the app is ready.
```

**Bad:**
```markdown
## Setup

Run `npm install`, create a `.env` file with your database credentials,
run the migrations, and start the server.
```

The bad version fails because: which credentials? What format? What migrations command? The reader is left guessing at every step.

---

### 6. Usage

Show the 2-3 most common workflows with real examples. Not an API reference — a "here's what you'll actually do" guide.

**Good:**
```markdown
## Usage

### Create a Meal Plan

```bash
npm run plan:create -- --days 7 --diet vegetarian
```

This generates a 7-day vegetarian meal plan and saves it to `plans/`.

### Generate a Grocery List

```bash
npm run groceries -- --plan plans/week-of-2026-01-15.json
```

Output: a categorized grocery list with estimated costs.
```

Show the happy path first. Edge cases and options belong in Configuration or a dedicated docs folder.

---

### 7. Project Structure

A directory tree with one-line explanations. This section answers "I need to change X — where do I look?"

```markdown
## Project Structure

```
meal-planner/
  01-presentation/       # UI components and pages
  02-logic/              # Business rules (meal generation, cost calculation)
  03-data/               # Database models, repositories, migrations
  config/                # Environment config, constants
  tests/                 # Integration and E2E tests
  Documentation/         # Feature specs, architecture docs
```
```

Keep it to the top 1-2 levels. Don't map every file — that's what the architecture skill's project type profiles are for.

---

### 8. Configuration

Table format. Every configurable value with its purpose, default, and valid options.

```markdown
## Configuration

All configuration is in `.env`. See `.env.example` for defaults.

| Variable | Purpose | Default | Options |
|----------|---------|---------|---------|
| `PORT` | Server port | `3000` | Any available port |
| `LOG_LEVEL` | Logging verbosity | `info` | `debug`, `info`, `warn`, `error` |
| `MEAL_PLAN_DAYS` | Default plan length | `7` | `1`–`30` |
```

---

### 9. Troubleshooting

Cover the failures you've seen (or can predict). Each entry: symptom, cause, fix.

```markdown
## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `ECONNREFUSED` on startup | PostgreSQL not running | Start PostgreSQL: `brew services start postgresql` |
| `Migration failed` | Database doesn't exist | Create it: `createdb mealplanner` |
| Tests timeout | Slow database connection | Check `DATABASE_URL` in `.env` points to localhost |
| `Module not found` after pull | New dependencies added | Run `npm install` again |
```

**Don't skip this section** because "it should just work." It won't, and the reader will be stuck with no help.

---

### 10. Contributing

How to help, where to start, what the workflow looks like.

```markdown
## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes following the project conventions
4. Run tests: `npm test`
5. Submit a PR

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.
```

For small projects, this section can be brief. For larger ones, link to a dedicated file.

---

## Writing Principles

### 1. Success Horizons

Every instruction ends with what the reader should see. This is the single most important principle.

**Without success horizon:**
```bash
npm run db:migrate
```

**With success horizon:**
```bash
npm run db:migrate
```
You should see: `Migrations complete. 12 tables created.`

The success horizon does two things: it confirms the reader is on track, and it gives them something to compare against when things go wrong.

### 2. Honest Prerequisites

Never hide a requirement. If they need PostgreSQL 15, say so before they start — not when `db:migrate` fails on line 40.

List exact versions. Include a check command. If a prereq takes more than 5 minutes to install, link to an external guide rather than embedding installation instructions in your README.

### 3. Concrete Over Abstract

Use your project's actual names, paths, and commands — not placeholders.

**Abstract:** `Run the {build_command} to generate {output_artifact}`

**Concrete:** `Run npm run build to generate the dist/ folder`

When showing patterns (like the project structure), use real examples from the project, not generic terms.

### 4. Jargon Translation

If a term might be unfamiliar, translate it immediately.

**Jargon:** "Hydrate the client-side state from the server-rendered markup."

**Translated:** "Load the app's initial data from the server so the page is interactive immediately, without a loading spinner."

You don't need to define every term — just the ones that would make someone stop and Google.

### 5. Failure Modes

Document what goes wrong. Not every possible error — just the common ones. Format:

```
> **If you see [error]:** [cause]. Fix: [what to do].
```

Place these immediately after the step where they occur, not in a separate section. Troubleshooting at the end catches the rest.

### 6. Scannable Structure

Readers scan before they read. Make scanning productive.

- **Headers** for every section and subsection
- **Bold** for key terms and important notes
- **Code blocks** for commands and output
- **Tables** for reference data (variables, options, errors)
- **Blockquotes** for tips and warnings
- **Short paragraphs** — 3 lines max before a break

Never write a wall of text. If you need to explain something complex, break it into numbered steps or a bulleted list.

---

## Anti-Patterns

Things that make READMEs useless. Avoid these.

### Installation Hell
Bare commands with no prereq checks. `npm install && npm start` fails for anyone who doesn't have Node.js, the right version, or write access to the directory. Always check prerequisites first and validate each step.

### Assumed Context
Referencing things the reader doesn't know yet. "Configure your environment variables" assumes the reader knows what environment variables are, where to set them, and what values to use. Be specific: which file, which variables, what format, what values.

### Example Mismatch
Examples from a domain the reader can't map to their situation. If your project is a meal planner, don't show auth examples from a healthcare app. Use the project's own domain for all examples.

### No Success Horizon
Instructions without validation. The reader finishes all the steps and has no idea if it worked. Every significant step needs a "you should see X" confirmation.

### Why-First Failure
Explaining the mechanism before the benefit. "We use a pub/sub architecture with event sourcing and CQRS to..." — the reader doesn't care about the mechanism. They care about what it does for them. Lead with "Changes propagate instantly to all connected clients" then explain how, for curious readers.

### Wall of Text
Dense paragraphs with no visual hierarchy. If the reader can't find what they need by scanning headers in 10 seconds, they'll leave. Use headers, code blocks, tables, and short paragraphs.

### Outdated Examples
Commands or version numbers that don't match the current state of the project. A README with `npm install react@17` when the project uses React 19 destroys trust. Keep examples current or use dynamic references that don't hardcode versions.

---

## Quality Checklist

Before considering a README done:

- [ ] Someone unfamiliar with the project can go from zero to running in one sitting
- [ ] Every command has a success signal ("you should see X")
- [ ] Prerequisites are listed with versions and check commands
- [ ] Quick Start works in ≤5 minutes
- [ ] No jargon is used without explanation
- [ ] Examples use the project's own domain and real paths
- [ ] Troubleshooting covers the 3-5 most common failures
- [ ] The structure is scannable — headers, code blocks, tables, short paragraphs
- [ ] All links and paths are valid and current
- [ ] No section refers to something introduced in a later section
