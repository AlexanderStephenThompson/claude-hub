# AI Context Systems: What Actually Works

The research converges on one insight: **context engineering is infrastructure, not prompting.** You're not writing better instructions — you're building a persistent operating system for your AI. The difference between generic output and output that sounds like you wrote it comes down to a small set of high-signal reference files, structured in layers, with the most important information loaded first. Teams and individuals who get the most from AI treat these files like code — version-controlled, tested against real interactions, and ruthlessly pruned. The goal isn't comprehensive documentation. It's the minimum set of tokens that make the AI behave as if it already knows you and your project.

---

## 1. What Moves the Needle (Ranked by Impact)

Not all context is equal. Research and practitioner experience identify a clear hierarchy.

### Tier 1: Transformative (Do These First)

**Voice samples, not voice descriptions.** The single highest-impact thing you can do is give AI examples of your actual writing — not descriptions of your voice, but samples it can pattern-match against. A researcher demonstrated: without a voice file, Claude produced "The mentoring program represents a comprehensive approach to addressing the challenges faced by at-risk youth." With one loaded, it wrote "We're testing whether a cheap, scalable mentoring program can reduce violence among high-risk young men." The method: feed 5-10 diverse samples (minimum 1,000 words total; diversity of format matters more than volume), have the AI analyze your patterns, then distill into a 300-500 word voice spec with **testable rules** ("keep topic sentences under 12 words") rather than vague adjectives ("be conversational").

**Banned-word lists.** Disproportionate improvement per second invested. Banning AI-default vocabulary — *delve, leverage, multifaceted, furthermore, robust, compelling, navigate, foster, transformative, pivotal* — produces instant quality improvements. Each word is a diagnostic signal that the AI is ignoring your voice and reverting to its statistical average. Takes 30 seconds to write, improves every interaction. Each project gets its own list on top of global bans.

**Specific constraints over elaborate descriptions.** "Often, three highly relevant sentences outperform three comprehensive paragraphs." Constraints like word counts, format requirements, terminology mandates, and explicit exclusions create tighter output than open-ended quality descriptions. Critical placement: put the most important requirements at the **start** of your context (highest attention weight), reinforce at the **end** (second-highest), never bury important information in the middle. This is backed by the "Lost-in-the-Middle" phenomenon (Liu et al., 2023), which proved that LLM performance degrades significantly when relevant information is placed in the middle of a long context window — models attend most to the beginning and end.

**Annotated examples (few-shot).** 2-5 is the sweet spot. OpenAI's testing showed 5 few-shot examples boosted classification accuracy from 84.5% to 91.5%. Beyond 5, diminishing returns. Contrastive few-shotting — showing a "good" vs. "bad" version of the *exact same task* — is significantly more effective than providing good examples alone (Anthropic's "Effective Context Engineering," 2025). Examples of *bad* output are as valuable as good ones — they create boundaries the model respects. Annotate each with *why* it works or fails. This trains judgment, not just rules.

### Tier 2: Meaningful Improvement (Add Next)

**Audience psychographics** — but only with behavioral data. Pain points, intent signals, and tone preferences matter more than demographics. "You're not writing 'for a marketer'; you're writing for someone who registered for your last two webinars and prefers short, bullet-pointed content."

**Domain terminology glossaries.** Prevents "AI words" and enforces project-specific vocabulary. Structure as substitution tables: Use This / Not This.

**Structural templates for recurring content types.** Named patterns ("The Discovery Arc," "The Technical Deep-Dive") produce dramatically more usable output than vague instructions like "start with a hook."

**Architectural decisions for code projects.** "We use Server Components by default; only add 'use client' when state or effects are needed" or "Repository pattern for all data access." These prevent the AI from making structural choices that conflict with your design.

### Tier 3: Helpful, Not Transformative

Brand voice guidelines without samples, content strategy context, SEO keywords, campaign details. These help but produce weaker results without Tier 1 elements.

**Multimodal visual context** is an emerging exception: for current multimodal models (Claude 3.5 Sonnet, GPT-4o), including UI screenshots, wireframes, or visual mood boards as reference files allows coding agents to match design intent (spacing, alignment, visual tone) more accurately than text-based design tokens alone. This moves visual context from "zero impact" to high-impact specifically for frontend work.

### Actively Harmful Noise

- Redundant behavioral reminders ("don't hallucinate" repeated 5 times)
- Entire document dumps without preprocessing
- Vague qualitative instructions ("write clearly," "be engaging")
- Contradicting rules
- Using context files as a linter ("use 2-space indentation" — let Prettier handle that)

Context rot is real — as token count increases, recall accuracy decreases across all models, even within the window. Every token must earn its place.

---

## 2. The Three-Layer Architecture

Every strong setup separates context into three scope levels. This prevents overloading any single file and keeps brand boundaries clean.

### Layer 1: Global Identity (Stable Across All Projects)

Who you are and how you work. Rarely changes.

- Role and core principles
- Communication style preferences
- Global anti-patterns and banned words
- Decision biases (e.g., "simple > scalable > systemized")
- Formatting preferences

### Layer 2: Project Context (Specific to One Project)

The project's laws and personality. Changes slowly.

- Mission / "north star" for this project
- Audience profile with psychographics
- Voice spec with samples and anti-samples
- Domain terminology glossary
- Tech stack and architectural decisions
- Design tokens and naming conventions
- Content structure templates

### Layer 3: Session Intent (Volatile, Changes Daily)

What you're doing right now. Disposable.

- Current priorities and sprint goals
- Active tasks and definitions of done
- Recent decisions that affect current work

**Key rule:** Layer 1 and 2 are persistent infrastructure. Layer 3 is ephemeral. Don't mix them.

---

## 3. File Structure

### The Root File: Under 200 Lines of Instructions

Research on a 108,000-line codebase found that keeping root context under 200 lines with progressive disclosure kept meta-infrastructure overhead to 4.3% of total work while enabling 80%+ of prompts to be under 100 words. Frontier LLMs can reliably follow ~150-200 instructions total. Your agent's system prompt already consumes ~50. That leaves 100-150 before quality degrades uniformly across all instructions.

**Important distinction:** The 200-line limit applies to *instructional logic* (rules, constraints, behavioral guidance — the "how to behave" layer). Reference knowledge (API docs, glossaries, data schemas) can be much longer without the same degradation, provided it is clearly separated from rules. Context rot occurs when instructions are buried in noise, not when reference data is present alongside clean rules.

### The Pattern: Lean Root + Referenced Detail

```
/context
  /global
    identity.md          # Who you are, how you think
    voice.md             # Communication style, banned words
    standards.md         # Code conventions, thinking standards

  /projects
    /project-name
      identity.md        # What it is, audience, mission
      voice.md           # Project-specific tone + samples
      domain.md          # Terminology substitution table
      samples.md         # Annotated good/bad examples
      standards.md       # Tech stack, architecture, design tokens
```

**Small files > big files.** Split by topic, not by importance. The AI treats all context as a continuous stream — split files when *you* need to maintain them separately or when different contexts apply to different tasks.

**Progressive disclosure:** Your root file *points to* detailed documents rather than embedding them. Load detail on demand, not all at once.

---

## 4. Preventing Brand Bleed

For creators working across multiple distinct projects, voice bleed is the central risk. The research is emphatic: **workspace-level isolation is the only reliable solution.**

1. **One project = one context folder.** Each project gets its own complete voice charter, terminology glossary, and anti-sample list.

2. **Load context intentionally.** Never mix brands in a single conversation. Start fresh when switching projects.

3. **Contrastive voice boundaries.** For every positive voice attribute, define its negative boundary:

| We ARE | We are NOT |
|--------|------------|
| Confident | Condescending |
| Expert | Academic/Stuffy |
| Playful | Unprofessional |
| Direct | Blunt/Rude |

4. **Distinct glossaries.** If Project A uses "Residents" and Project B uses "Characters," define these explicitly in each project's domain file.

---

## 5. What Improves Code Output

Beyond universal coding standards, project-level context that reflects your domain makes AI-generated code feel native rather than Stack Overflow generic.

**Highest impact — architectural decisions:** "Event-driven architecture between services via RabbitMQ" or "Soft deletes only — never DELETE, always set deleted_at." These prevent structural choices that conflict with your design.

**Domain terminology in code:** Following DDD principles — "Use domain language for all class and method names. No 'Manager', 'Helper', 'Util'. A 'Campaign' in our system refers to..." This produces `HarvestScheduler` instead of `DataManager` and `calculateYieldPerTray()` instead of `processData()`.

**Design token context:** "Use CSS custom properties from `/styles/tokens.css` — never hardcode colors. Brand colors: `--mg-color-primary` (#2D5016)." One instruction eliminates an entire class of code review feedback.

**Document conventions around usage, not the technology itself.** The AI can read API docs. It can't infer your patterns for error handling shape, retry logic, and auth flow:

```markdown
## Error Handling
- All external API calls wrapped in try/catch
- Retry transient errors (429, 503) with exponential backoff
- Return standardized error shape: { code, message, retryable }
- Log errors to Sentry with request context
```

---

## 6. What Improves Content Output

The root cause of generic AI content: models are trained via RLHF where human raters pick preferred outputs, producing responses calibrated to a hypothetical median user — not you.

**The three things that close the gap:**

1. **Voice file in every conversation.** Not a description — an AI-generated analysis of your actual writing, distilled into testable rules. Load into persistent project instructions, not one-off chats.

2. **Banned-word list.** Beyond universal AI defaults, each project gets its own: the local business bans wellness-brand speak, the consultancy bans startup hype, the gaming brand bans corporate stiffness.

3. **Annotated structural templates.** Named patterns for recurring content types: "Product Update Post" (open with the change > explain why > show how to use > what's next). These produce content needing paragraph-level tweaks rather than rewrites.

**What doesn't work:** vague tone adjectives without examples, demographics without psychographics, dumping entire style guides into context, and providing more than 5 examples per task.

---

## 7. Maintenance: What Decays vs. What Stays

### Evergreen (Review Quarterly)

- Brand voice and personality traits
- Core identity and mission
- Domain terminology glossaries
- Coding conventions and architectural decisions
- Audience persona fundamentals

### Volatile (Review Monthly or More)

- Current priorities and goals
- Active campaigns and projects
- Recent content examples
- Pricing, features, team composition
- Tool versions and dependencies

### The Maintenance Strategy

**Two-tier architecture:** Root context files contain only stable, universally applicable information (the "project constitution"). Volatile information lives in separate referenced documents updated as needed without touching the root file.

**Compounding mechanism:** When the AI makes a mistake, fix the context file — not just the output. Build a "Gotchas" section and add failure points over time.

**Decay detection:** Every 2-4 weeks on active projects, scan for outdated priorities, stale examples, and instructions the AI consistently ignores (a sign the file is too long). Prune aggressively — if removing a line wouldn't cause the AI to make mistakes, cut it. For volatile Layer 3 files, purge based on milestones (feature complete, sprint done), not arbitrary calendar intervals.

**Golden test set:** Keep 3-5 prompts that historically triggered generic or off-brand output. After any context file update, re-run these prompts to verify the change actually shifted behavior. This is the only reliable way to know if a context update worked.

**Session hand-off:** At the end of every session, ask the AI to summarize progress and update the session-level context file.

---

## 8. Named Frameworks and Resources

**CO-STAR** (Context, Objective, Style, Tone, Audience, Response format) — Won Singapore's inaugural GPT-4 prompt engineering competition. Best for content creation tasks.

**RISEN** (Role, Instructions, Steps, End Goal, Narrowing) — Best for complex multi-step agent tasks. The "Narrowing" component (explicit constraints on what NOT to do) cut hallucination rates more than any positive instruction.

**Key research:**
- "Codified Context: Infrastructure for AI Agents in a Complex Codebase" (arXiv, Feb 2026) — 283 Claude Code sessions across 108K lines. Codified context acts as "persistent velocity."
- Anthropic's "Effective Context Engineering for AI Agents" (Sep 2025) — "Good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome."

**Curated collections of real context files:**
- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — 10K+ stars, 130+ cursor rules by framework
- [sanjeed5/awesome-cursor-rules-mdc](https://github.com/sanjeed5/awesome-cursor-rules-mdc) — 879 .mdc files in Cursor's current format
- [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) — Best practices with real examples
- [cursor.directory](https://cursor.directory) — Searchable web directory of cursor rules

---

## 9. Implementation: The 30-Minute / 2-Hour / Ongoing Stack

**30 minutes per project (captures 80% of value):**
- Root context file under 200 lines (tech stack, key commands, architecture)
- Banned-word list
- 5 writing samples for voice analysis

**2 hours per project (the remaining 20%):**
- Few-shot examples of desired output with annotations
- Audience psychographic profiles
- Structural templates for recurring content types
- Contrastive "We ARE / We are NOT" voice boundaries

**Ongoing (compounds over time):**
- Every AI mistake becomes a context file update
- Every code review finding becomes an architectural rule
- Every off-brand output refines the voice spec
- Quarterly review of evergreen files, monthly review of volatile ones
