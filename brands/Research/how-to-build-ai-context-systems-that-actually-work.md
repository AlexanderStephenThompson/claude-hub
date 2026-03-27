# How to build AI context systems that actually work

**The single highest-impact thing you can do is give AI examples of your actual writing — not descriptions of your voice, but samples it can pattern-match against.** Combined with a banned-word list and workspace-level project isolation, this trio eliminates 80% of generic AI output for roughly 30 minutes of setup per project. The rest is progressive refinement. This report synthesizes research from Anthropic's official engineering guidance, academic studies of 400+ real repositories, community-maintained collections of thousands of context files, and practitioner case studies to provide a concrete, prioritized system for your four-project setup.

The AI coding agent ecosystem has converged on a shared pattern: a markdown file in your repo that the agent reads before doing anything. Claude Code uses `CLAUDE.md`, Cursor uses `.cursor/rules/*.mdc`, GitHub Copilot uses `.github/copilot-instructions.md`, and a vendor-neutral standard called `AGENTS.md` is emerging across tools. The principles below apply universally.

---

## The context categories that move the needle, ranked by impact

Not all context is created equal. Research and practitioner experience consistently identify a clear hierarchy. Here are the categories ordered by their impact on output quality, from transformative to noise.

**Tier 1 — Transformative impact (do these first):**

**Voice/style samples** are the single most effective context category. Providing 5–10 actual writing samples produces dramatically better results than any descriptive instructions. A researcher demonstrated the contrast starkly: without a voice file, Claude produced "The mentoring program represents a comprehensive approach to addressing the challenges faced by at-risk youth." With one loaded, it wrote "We're testing whether a cheap, scalable mentoring program can reduce violence among high-risk young men. The program combines CBT-based self-regulation training with a small cash grant." The AI pattern-matches against examples far more reliably than it follows abstract rules like "be conversational." The optimal approach: feed AI 5–10 diverse samples of your best work, have it analyze your patterns, then distill the analysis into a **300–500 word voice spec** with testable rules (e.g., "keep topic sentences under 12 words") rather than vague adjectives.

**Anti-terminology ban lists** deliver disproportionate improvement per second invested. Explicitly banning AI-default vocabulary — *delve, leverage, multifaceted, furthermore, robust, compelling, navigate, foster, transformative, pivotal* — produces instant quality improvements. Every one of these words is a diagnostic signal that the AI is ignoring your voice and reverting to its statistical average. This takes 30 seconds to write and improves every interaction.

**Specific constraints and requirements** outperform elaborate descriptions. "Often, three highly relevant sentences outperform three comprehensive paragraphs" in shaping AI behavior. Constraints like word counts, format requirements, terminology mandates, and explicit exclusions create tighter output than open-ended quality descriptions. Critical placement detail: put the most important requirements at the **start** of your context (highest attention weight), reinforce at the **end** (second-highest), and never bury important information in the middle.

**Tier 2 — Meaningful, measurable improvement:**

**Audience psychographics** shift output from generic to targeted, but only when they include behavioral data. Pain points, intent signals, and tone preferences matter far more than demographics. "You're not just writing 'for a marketer'; you're writing for someone who registered for your last two webinars, clicked the email about AI subject lines, and prefers short, bullet-pointed content."

**Few-shot examples of desired output** — **2–5 is the sweet spot**. OpenAI's own testing showed adding 5 few-shot examples boosted classification accuracy from 84.5% to 91.5%. Beyond 5, diminishing returns set in. Examples of *bad* output are as valuable as good ones — they create boundaries the model respects. Annotate each example with *why* it works rather than just pasting samples.

**Structural templates** for recurring content types (named patterns like "The Discovery Arc" or "The Technical Deep-Dive") produce dramatically more usable output than vague instructions like "start with a hook."

**Tier 3 — Helpful but not transformative alone:**

Brand voice guidelines (written rules without samples), domain-specific terminology glossaries, and content strategy context all help but produce weaker results when used without the Tier 1 elements. Visual identity and design system information has **zero impact on text generation** — only relevant for multimodal outputs.

**What's actively harmful noise:** redundant behavioral reminders ("don't hallucinate" repeated five times), entire document dumps without preprocessing, vague qualitative instructions ("write clearly," "be engaging"), and contradicting rules. Anthropic's research confirms **context rot is real** — as token count increases, recall accuracy decreases across all models, even within the window. Every token must earn its place.

---

## File structure: less is more, with progressive disclosure

The research is unambiguous on structure: **keep your root context file under 200 lines** (some high-performing teams use under 60), and use progressive disclosure for everything else. Research shows frontier LLMs can reliably follow roughly 150–200 instructions total. Claude Code's system prompt already consumes ~50 of those. That leaves you 100–150 instructions before quality degrades — and degradation is uniform across all instructions, not just the newest ones.

**The recommended architecture for each project:**

```
project/
├── CLAUDE.md                    # Root context (always loaded, <200 lines)
├── .cursor/rules/
│   ├── core.mdc                 # Always-on rules
│   ├── react-components.mdc     # Auto-attached for React files
│   └── api-patterns.mdc         # Agent-requested when relevant
├── .claude/
│   ├── rules/                   # Path-scoped rules
│   ├── skills/                  # On-demand capability bundles
│   └── commands/                # Reusable slash commands
├── docs/
│   ├── architecture.md          # Detailed architecture (referenced, not embedded)
│   ├── terminology.md           # Domain glossary
│   └── voice-guide.md           # Voice spec + samples
└── .github/
    └── copilot-instructions.md  # Copilot-specific (or symlink to AGENTS.md)
```

**The root context file (CLAUDE.md) should contain only universally applicable information** structured around three questions, following the WHAT/WHY/HOW framework:

- **WHAT**: Tech stack, project structure, key directories — a codebase map
- **WHY**: Purpose of the project and its key components
- **HOW**: Build commands, test commands, package manager preferences, how to verify changes

**Everything else uses progressive disclosure** — your root file *points to* detailed documents rather than embedding them. CLAUDE.md supports an `@path/to/file` import syntax. Cursor uses glob patterns to auto-attach rules only when matching files are referenced. This prevents context window overload while ensuring the agent can find what it needs.

**One file vs. many:** The agent doesn't care — it treats all context as a continuous text stream. Split files when *you* need to maintain them separately, when different parts of a monorepo need different context, or when you want to reuse rules across projects. The canonical pattern: a lean root file plus a `docs/` or `agent_docs/` directory with topic-specific files (building, testing, conventions, architecture, domain terms).

**Critical anti-pattern:** Don't use context files as a linter. Instructions like "use 2-space indentation" waste precious context tokens on something Prettier handles deterministically. Use hooks and formatters for style enforcement; reserve context tokens for things the AI genuinely can't infer.

---

## What effective Custom GPTs and Claude Projects include that amateur ones miss

Effective setups consistently include six categories that amateur ones omit or conflate:

**1. Separation of behavior rules from reference material.** Instructions define *how the AI behaves* (tone, decision-making, workflow). Knowledge files provide *what the AI references* (docs, data, style guides). Mixing them degrades both. Put rules in Instructions/system prompts; put reference material in uploaded files or knowledge bases.

**2. "Do NOT" lists alongside positive instructions.** Telling AI what to avoid is often more effective than telling it what to do, because it creates boundaries around the creative space. The pattern: for every positive voice attribute, define its negative boundary.

| We ARE | We are NOT |
|--------|------------|
| Confident | Condescending |
| Expert | Academic/Stuffy |
| Playful | Unprofessional |
| Direct | Blunt/Rude |

**3. Contrastive examples.** Include 3–5 pairs showing generic output vs. your desired voice. Both on-tone and off-tone examples, annotated with *why* each works or fails. One practitioner's framework: "AI-generated lines that sound too generic, sentences that are too symmetrical or polished" as explicit anti-samples.

**4. Output format templates with variables.** Markdown templates with placeholders like `{{audience}}`, `{{tone}}` enforce consistency and give the AI structural anchors.

**5. Version control and iteration tracking.** Amateurs build once and forget. Effective setups save prior instruction versions, iterate after every 3–5 conversations, and treat the "fix loop" (where fixing one thing breaks another) as a known risk requiring version history.

**6. Prompt injection awareness.** Users can potentially extract Custom GPT instructions and knowledge base contents. Only include non-sensitive material.

For Claude Projects specifically, **project instructions stack on top of profile preferences** — you define universal rules once at the profile level (formatting, research-first requirements, communication style) and project-specific rules per workspace. Don't repeat global rules in every project.

---

## Keeping four brands separate without voice bleed

Voice bleed between projects is the central risk for multi-project creators. The research is emphatic: **workspace-level isolation is the only reliable solution.** Human memory is not a reliable firewall between distinct brand personalities.

**The architecture for your four projects:**

Create **four completely separate AI environments** — four Claude Projects AND/OR four Custom GPTs, each with its own voice charter, sample content, terminology glossary, and "Do NOT" lists. Claude Projects are inherently isolated: a Work Project cannot access information from a Personal Project. Custom GPTs are similarly sandboxed.

**Each project workspace gets a voice charter document following this template:**

```
Brand: Microgreens Business
Audience: Health-conscious home growers, intermediate knowledge, 
  care about sustainability and food sovereignty
We sound like: Knowledgeable neighbor, practical, grounded, occasionally playful
We do NOT sound like: Corporate wellness brand, preachy, overly scientific
Words we always use: [domain glossary]
Words we NEVER use: leverage, optimize, synergy, unlock, "journey"
Sentence style: Short and direct, contractions yes, em dashes sparingly
ON-tone examples: [2-3 real samples]
OFF-tone examples: [2-3 anti-samples]
```

Repeat with distinct parameters for the data analytics consultancy (authoritative, precise, jargon-comfortable), the gaming content brand (energetic, community-native, meme-literate), and the creative worldbuilding project (evocative, lore-dense, immersive).

**Critical anti-bleed rules:** Always start a fresh conversation when switching projects — never continue in the same thread. Don't rely on AI memory across project boundaries. If using ChatGPT, you can `@mention` a Custom GPT inside a Project to layer voice rules on top of project knowledge, but never mix brands in a single conversation.

For code projects, use nested context files. Your microgreens e-commerce site, your consultancy dashboard, and your gaming brand's web presence each get their own `CLAUDE.md` with domain-specific naming conventions, component patterns, and design tokens. Cursor's glob-based auto-attach rules ensure backend conventions only fire for backend files.

---

## Code-specific context that changes output quality

Beyond universal coding standards, **project-level context that reflects your domain** is what makes AI-generated code feel native to your codebase rather than Stack Overflow generic.

**Architectural decisions are the highest-impact code context.** Statements like "We use Server Components by default; only add 'use client' when state or effects are needed" or "Repository pattern for all data access" or "Event-driven architecture between services via RabbitMQ" prevent the AI from making structural choices that conflict with your design.

**Domain terminology in code** matters enormously. Following Domain-Driven Design principles in your context file: "Use domain language for all class and method names. Avoid generic technical terms in the domain layer — no 'Manager', 'Helper', 'Util'. A 'Campaign' in our system refers to..." This produces components named `HarvestScheduler` instead of `DataManager` and methods named `calculateYieldPerTray()` instead of `processData()`.

**Design token context** prevents hardcoded values: "Use CSS custom properties from `/styles/tokens.css` — never hardcode colors. Design tokens follow `--{namespace}-{category}-{property}-{modifier}`. Brand colors: `--mg-color-primary` (#2D5016)." This single instruction eliminates an entire class of code review feedback.

**The key insight from practitioner research: document the conventions *around* usage, not the technology itself.** Claude can read API docs. What it can't infer is your team's patterns for authentication flow, error handling shape, retry logic, and webhook processing. An effective code context section looks like:

```markdown
## Error Handling
- All external API calls wrapped in try/catch
- Retry transient errors (429, 503) with exponential backoff
- Return standardized error shape: { code, message, retryable }
- Log errors to Sentry with request context

## Data Access
- Users have tenant_id — ALL queries MUST filter by tenant
- Soft deletes only — never DELETE, always set deleted_at
- Use @/lib/db alias, not relative imports
```

---

## Content context that eliminates the editing treadmill

The root cause of generic AI content is structural: models are trained via RLHF where human raters pick preferred outputs, producing responses calibrated to a hypothetical median user — not you. Without aggressive voice steering, you get the statistical average of all writing on the internet.

**The three things that close the gap between "needs heavy editing" and "sounds like me":**

**First, a voice file loaded into every conversation.** Not a description of your voice — an AI-generated analysis of your actual writing. Feed 5–10 diverse samples (minimum 1,000 words total; diversity of format matters more than volume), have the AI analyze patterns, then distill into testable rules. "Keep topic sentences under 12 words" beats "write clearly." "$400/month replacing $400k/year — not 'cost-effective'" teaches more than "use concrete details." Load this into persistent project instructions, not one-off chats.

**Second, the ban list.** This is your fastest win. Beyond the universal AI-default words, each project gets its own: the microgreens business bans wellness-brand speak ("transform your health journey"), the consultancy bans startup hype ("disruptive," "game-changing"), the gaming brand bans corporate stiffness ("utilize," "facilitate"), and the worldbuilding project bans modern anachronisms.

**Third, annotated structural templates for recurring content types.** Define named patterns: "Product Update Post" (open with the change → explain why it matters → show how to use it → close with what's next) or "Analytical Breakdown" (state the finding → show the evidence → address counterarguments → draw conclusions). These structural anchors produce content that needs paragraph-level tweaks rather than rewrites.

**What doesn't work:** vague tone adjectives without examples ("be authentic"), demographics without psychographics, dumping entire style guides into context, and providing more than 5 examples per task (diminishing returns set in and the model gets confused by variation rather than guided by it).

---

## What decays and what stays stable

Context maintenance is the hidden cost of these systems. The research identifies a clear split between evergreen and volatile context, with specific strategies for each.

**Evergreen context (review quarterly):** brand voice and personality traits, core identity and mission, domain terminology glossaries, coding conventions and architectural decisions, audience persona fundamentals, directory structure and tech stack. These change slowly and form your "hot memory" layer.

**Volatile context (review monthly or more):** current priorities and quarterly goals, active campaigns and projects, recent content examples, pricing and feature details, team composition, tool versions and dependencies. These are your "cold memory" — referenced but not embedded in root context files.

**The maintenance strategy that scales:** Use a **two-tier architecture**. Your root context file (CLAUDE.md, project instructions) contains only stable, universally applicable information — the "project constitution." Volatile information lives in separate referenced documents that you update as needed without touching the root file. An academic study of a 108,000-line codebase found this approach kept meta-infrastructure overhead to just **4.3% of total work** while enabling over 80% of prompts to be under 100 words.

**Practical maintenance rhythm:** When the AI makes a mistake, fix the context file — not just the output. This is the compounding mechanism. Build a "Gotchas" section in every context file and add failure points over time. Run a "decay detector" review every 2–4 weeks on active projects: scan for outdated priorities, stale examples, and instructions the AI consistently ignores (a sign the file is too long). Prune aggressively — if removing a line wouldn't cause Claude to make mistakes, cut it.

---

## Real frameworks and where to find working examples

**The best curated collections of real context files:**

- **[PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)** — 10,000+ stars, 130+ cursor rules organized by framework. The canonical starting point.
- **[sanjeed5/awesome-cursor-rules-mdc](https://github.com/sanjeed5/awesome-cursor-rules-mdc)** — 879 `.mdc` files converted to Cursor's current format.
- **[shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)** — Exhaustive best practices organized by category with real examples.
- **[ChrisWiles/claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase)** — Complete working project with hooks, skills, agents, and a real CLAUDE.md.
- **[cursor.directory](https://cursor.directory)** — Web-based directory of cursor rules searchable by framework.

**Named frameworks worth knowing:**

**CO-STAR** (Context, Objective, Style, Tone, Audience, Response format) won Singapore's inaugural GPT-4 prompt engineering competition and is the most practical framework for content creation tasks. **RISEN** (Role, Instructions, Steps, End Goal, Narrowing) is best for complex multi-step agent tasks — its "Narrowing" component (explicit constraints on what NOT to do) cut hallucination rates more than any positive instruction. Neither framework is exclusive; the best practitioners mix elements from multiple frameworks.

**The definitive academic case study** is "Codified Context: Infrastructure for AI Agents in a Complex Codebase" (arXiv, February 2026), which documented 283 Claude Code sessions across a 108,000-line codebase. Key finding: codified context acts as "persistent velocity" — captured experience prevents repeated trial-and-error across sessions and enables collaborative debugging that wouldn't be possible with fresh context each time.

**Anthropic's "Effective Context Engineering for AI Agents"** (September 2025) is the authoritative meta-guide: "Good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome." Their just-in-time context principle — maintain lightweight identifiers and dynamically load detail at runtime — mirrors how human cognition works and is the foundation of the progressive disclosure pattern.

---

## Conclusion: the 30-minute, 2-hour, and ongoing investment tiers

The research converges on a clear priority stack. **In 30 minutes per project**, you can capture 80% of the value: write a root context file under 200 lines covering your tech stack, key commands, and architectural decisions; create a banned-word list; and gather 5 writing samples for voice analysis. **In 2 hours per project**, add few-shot examples of desired output, audience psychographic profiles, structural templates for recurring content types, and "Do NOT" lists for each brand. **Ongoing**, the system compounds: every AI mistake becomes a context file update, every code review finding becomes an architectural rule, and every off-brand output refines the voice spec.

The insight that ties everything together: **context engineering is infrastructure, not prompting.** The teams and individuals who get the most from AI tools treat their context files like code — version-controlled, reviewed, tested against real interactions, and ruthlessly pruned. The goal isn't comprehensive documentation. It's the minimum set of high-signal tokens that make the AI behave as if it already knows your project.
