# Problem-Fix Tutorial Template

Standard template for all Vertex Vanguard tutorials. Used by `/tutorial-script` and the `tutorial-builder` agent.

---

## [Title]

Format: "[What broke/went wrong] — [The fix]"

Examples:
- "FBX Export Breaks Scale — Here's the Settings That Fix It"
- "VRChat Lighting Looks Washed Out — Post Processing Fix"

Never: "A Comprehensive Guide to..." or "Tutorial: How to..."

---

### Problem

What the reader sees going wrong. Be specific — name the symptoms.

- What symptom they see (broken normals, wrong scale, rotation 90 degrees off)
- Why it's frustrating (they've tried the obvious fixes, it worked yesterday)
- "If you've ever [common struggle], this is why."

### Context

Why it happens. 1-2 sentences max. Technical but accessible — explain the cause without a lecture.

### Solution

Step-by-step with exact settings.

**Prerequisites:**
- Tool version: [e.g., Blender 4.x, Unity 2022.3+]
- Required packages/plugins: [e.g., VRChat SDK, ORL Shaders]

**Steps:**

1. **[Action]** — [Clear instruction with exact settings]
   - Setting: `[Name]` → `[Value]`
   - [SCREENSHOT: description of what to capture]
   - Expected result: [what you should see after this step]

2. **[Action]** — [Clear instruction]
   - Setting: `[Name]` → `[Value]`

3. Continue until complete...

**Pipeline order reminder:** Retopo → UV unwrap → Texture (never skip steps)

### Why It Works

The principle behind the fix — not just "do this" but "because [principle]." This is the reusable takeaway the reader carries to other problems.

### Reuse

Where else this pattern applies. "This same [principle] also fixes [related problem] and matters when you're [adjacent workflow]."

### The Struggle Moment

_Placeholder for the personal failure detail._

"This took me [X hours/attempts] because I was [wrong assumption]. What finally clicked was [insight]."

This is mandatory — every tutorial needs at least one honest struggle. It's what makes VV feel like a workshop, not a textbook.

---

## Pre-Publish Checklist

- [ ] Opens with the problem, not the tool
- [ ] Includes at least one personal failure or struggle
- [ ] All settings are exact (no "adjust to preference" without a starting point)
- [ ] Ends with the principle, not just the fix
- [ ] Never starts at "Step 1: Open Blender" — audience knows the basics
- [ ] Title doesn't say "comprehensive," "tutorial," or "guide"
- [ ] Pipeline order respected (Retopo → UV unwrap → Texture)
- [ ] Uses VV domain terms (world, spawn space, feature layers, connectors)
- [ ] No banned words (see `brand/voice.md`)
- [ ] Includes [SCREENSHOT] markers for visual callouts
