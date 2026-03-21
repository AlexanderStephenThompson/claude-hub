---
description: Produce a clear explanation using the Subject or Situational framework
argument-hint: <topic or question to explain>
---

**User request:** $ARGUMENTS

# Explain Command

Produce an explanation following the explaining skill framework. Read the skill before generating anything.

---

## Instructions

1. **Load the skill.** Read `~/.claude/skills/explaining/SKILL.md` to ground yourself in the framework.

2. **Classify the request.** Determine which framework fits:
   - **Subject** (default) — The user wants to understand what something is, how it works, or why it exists.
   - **Situational** — The user wants to decide, be persuaded, or change perspective.
   - If unclear, default to Subject.

3. **Choose depth.** Look for explicit cues in the request:
   - Words like "quick", "brief", "summary", "TL;DR" → **Short**
   - Words like "deep dive", "essay", "long-form", "in depth" → **Long**
   - No cue → **Medium** (default)
   - The user can also specify depth directly: `/explain --short`, `/explain --long`

4. **Build the explanation** using the matching 3-phase structure:

   **If Subject** (Context → Content → Connection):
   - Context: Orient the listener. What is it, where does it fit, why does it exist?
   - Content: How does it work? Be concrete, semantic, example-driven.
   - Connection: Why does it matter? Translate meaning back to the listener's world.

   **If Situational** (Establish Context → Reveal Problem → Solve):
   - Context: Frame the situation. What's happening, why it matters, connect to listener values.
   - Problem: Surface the gap. What's at stake if nothing changes?
   - Solve: Path forward with clarity, proof, and action.

5. **Add relatability tools** only if they improve clarity. Don't force analogies or metaphors — structure carries the explanation, tools enhance it. Match tool density to depth:
   - Short: Rare
   - Medium: Occasional
   - Long: Frequent

6. **Verify before delivering:**
   - No phase is skipped
   - Context comes before Content/Problem
   - Explanation ends with meaning, not mechanics
   - Depth matches the request
   - If the topic is complex, consider loading the relevant technique catalog (`references/subject-tools.md` or `references/situational-tools.md`) for phase-specific technique selection

---

## Output Format

Deliver the explanation directly — no meta-commentary about the framework, no "I'll use the Subject framework at Medium depth" preamble. The listener should experience the explanation, not the process.

### Structure

Every explanation follows this visual structure:

1. **Intro summary** — A clean 1-3 sentence overview before any phases. Sets up the entire topic at a glance. Separated from the phases by whitespace.

2. **Numbered phases** — Each phase gets an emoji number and a descriptive title:
   - Subject: `1️⃣ [Title] — [subtitle]` / `2️⃣ [Title] — [subtitle]` / `3️⃣ [Title] — [subtitle]`
   - Situational: Same numbering pattern
   - Titles should be concrete and descriptive, not just "Context" or "Content." Example: `1️⃣ What an API Is — a defined communication contract`

3. **Visual hierarchy within each phase:**
   - Short paragraphs (2-4 sentences max per paragraph)
   - Bullet points for lists, examples, and scannable content
   - Bold key terms on first introduction
   - "For example:" or "This means:" as transition devices to break up density
   - Generous whitespace between sections

### Naming Practice

When the topic has a jargon name, acronym, or historically arbitrary label, lead with what it actually does — then introduce the official name. This is the **Semantic Rename** technique.

**Pattern:** Introduce the intuitive name in the intro summary or Phase 1 title, then anchor the official term to it.

**Examples:**
- `1️⃣ The Internet's Address Book — what DNS actually does`
- `1️⃣ A Communication Contract — what an API is`
- Intro: "DMAIC is a structured improvement cycle — a measure-and-fix loop that organizations use to find and eliminate problems."

**When to apply:** Any time the official name doesn't communicate what the thing does. If the name is already intuitive (e.g., "version control," "spell check"), skip it — don't rename what already makes sense.

### Formatting Rules

- **No wall-of-text paragraphs.** If a paragraph runs past 4 sentences, break it up or convert supporting points to a different format.
- **Bold sparingly but consistently.** Bold key terms when first introduced. Bold setup phrases like "The key idea:" or "In practice:" to create visual anchors.
- **Whitespace is structure.** A blank line between every paragraph and every section transition. Generous spacing makes content feel approachable, not intimidating.

### Format Selection Guide

Choose the format that matches the information's structure. When in doubt, ask: "What's the relationship between these pieces of information?"

**Short paragraphs** (2-4 sentences) — Use for:
- Narrative reasoning and cause-effect explanations
- Introducing a concept before breaking it down
- Transitional passages that connect ideas
- Any content that reads naturally as flowing thought

**Bullet points** (unordered) — Use for:
- Parallel items with no inherent order (features, benefits, traits, components)
- Examples that illustrate a single point ("For example:" followed by bullets)
- Lists of 3+ items that would feel cramped in a sentence
- Takeaways or implications at the end of a section

**Numbered lists** (ordered) — Use for:
- Sequential steps or processes where order matters
- Ranked items where position implies priority
- Procedures or instructions the reader follows
- Cause-and-effect chains with distinct stages

**Tables** — Use for:
- Comparing 2+ things across the same dimensions (features, tradeoffs, options)
- Attribute grids where rows and columns both carry meaning
- Quick-reference lookups (term → definition, input → output)
- Before/after or side-by-side contrasts

**Bold callout phrases** — Use for:
- Introducing a shift: "The key idea:", "In practice:", "For example:", "This means:"
- Highlighting a term when first defined
- Drawing attention to a critical sentence within a paragraph
- Creating visual rhythm — readers' eyes catch bold as anchor points

**Blockquotes** — Use for:
- A single key takeaway or insight worth pulling out
- A memorable summary line the reader should remember
- Quoting a principle, rule, or external source

**Inline code** — Use for:
- Technical terms, commands, file names, or literal values
- Anything the reader would type, paste, or reference exactly as written

**Nested bullets** — Use for:
- Elaborating on a parent bullet with sub-details
- Showing hierarchy (category → items within it)
- Keep to one level of nesting max — deeper nesting signals you need a different format

### Decision Flow

When you have information to present, run through this:

1. **Is it a sequence?** → Numbered list
2. **Is it a comparison across dimensions?** → Table
3. **Is it a set of parallel items?** → Bullet points
4. **Is it a single key insight?** → Bold callout phrase or blockquote
5. **Is it reasoning or narrative?** → Short paragraph
6. **Is it technical/literal?** → Inline code or code block
7. **Is it a mix?** → Lead with a short paragraph, then break into the appropriate format for the supporting detail

### Depth-Specific Formatting

**Short:** Intro summary (1-2 sentences) + three short numbered phases. Minimal bullets. Can be as brief as 1-2 sentences per phase.

**Medium:** Intro summary + three numbered phases with 1-3 paragraphs each. Use bullets for examples, lists, and supporting points. This is the default and should feel spacious and scannable.

**Long:** Intro summary + three numbered phases with multiple paragraphs each. Rich examples, analogies, and layered reasoning. Still uses bullets and whitespace — long doesn't mean dense.

---

## Depth Flag Reference

| Flag | Depth | Phase Length |
|------|-------|-------------|
| `--short` | Short | 1-2 sentences per phase |
| (default) | Medium | 4-6 sentences per phase |
| `--long` | Long | Multiple paragraphs per phase |

---

## Recovery & Follow-Up

### Core Rule

**Never add more detail forward when the user is confused.** Confusion means a phase is missing or unclear — adding more information buries the gap deeper. Always rewind first, then continue.

### Signal → Action Map

When the user struggles or asks a follow-up, match their signal to the right response:

| User Signal | What's Missing | Action |
|-------------|---------------|--------|
| "But what *is* it?" | Context — they have no mental model yet | Rewind to Phase 1. Give a simpler definition, a familiar bridge, or a scope frame. Then rebuild forward. |
| "Okay, but why should I care?" | Connection — you ended on mechanics | Jump to Phase 3. Translate the mechanism into meaning, relevance, or personal impact. |
| "How does it actually work?" | Content — too abstract or hand-wavy | Rebuild Phase 2 with a concrete example, a step-by-step walkthrough, or a worked demonstration. |
| "Can you simplify that?" | Depth mismatch — too deep for the listener | Scale down one level (Long → Medium, Medium → Short). Rebuild with less detail, not less structure. All three phases still apply. |
| "Can you go deeper?" | Depth mismatch — too shallow | Scale up one level. Expand the phase they're most interested in. Ask which part if unclear. |
| "I don't get [specific part]" | Targeted gap in one phase | Rebuild only that phase. Don't restart the whole explanation — anchor to what they already understand. |
| "Can you give me an example?" | Content phase needs grounding | Add a worked example, anecdote, or concrete scenario to Phase 2. Examples make abstract mechanisms tangible. |
| "What's the difference between X and Y?" | Needs comparison | Use a Compare and Contrast technique — table or side-by-side. This is a new mini-explanation, not a patch on the original. |
| Asks a follow-up about a specific aspect | Curiosity, not confusion | Treat as a new explanation request. Carry forward the context already established — don't re-explain what they already understand. |
| Silence or disengagement | Likely lost at Context | Check if Context was sufficient. If the listener never had orientation, nothing after it landed. |

### Depth Adjustment

When scaling depth up or down:
- **Scaling down:** Keep all three phases. Shorten each one. Remove examples and tools first, keep structure last.
- **Scaling up:** Expand the phase they're most curious about. Add examples, analogies, and nuance. The other phases can stay the same depth.
- **Never skip phases when rescaling.** A Short explanation still needs Context → Content → Connection. A Long explanation doesn't skip Context because "they probably get it."

### Follow-Up Explanations

When the user asks a related but new question after an explanation:
- Don't repeat context they already have
- Anchor to what was already established: "Building on [previous concept]..."
- If the new question changes the framework (Subject → Situational or vice versa), start fresh with the new framework
