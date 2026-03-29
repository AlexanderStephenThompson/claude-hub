---
description: Write a Problem-Fix tutorial script
argument-hint: [what went wrong and what the fix is]
---

# /tutorial-script

Write a tutorial following the Problem-Fix pattern.

## Output Pattern

1. **Problem** — The specific pain point. Open with what went wrong, not what tool you're using. ("Every time I exported from Blender to Unity, something broke.")
2. **Context** — Why it happens. Brief, 1-2 sentences max.
3. **Solution** — Step-by-step with exact settings and numbers. Never "adjust to your preference" without a starting point.
4. **Why it works** — The principle behind the fix, not just the fix itself.
5. **Reuse** — How to apply this pattern to other situations.

## Rules

- Open with the problem, never "In this tutorial we will..."
- Include at least one personal failure or struggle ("took me 3 hours," "I broke this twice")
- Show exact settings and numbers — no vague defaults
- End with the principle, not just the solution
- Never start at "Step 1: Open Blender" — audience knows the basics
- Use "here's what works" framing, not "here's the theory"

## References

- `brand/voice.md` — workshop mentor tone, testable rules
- `brand/samples.md` — Problem-Fix Tutorial pattern
- `brand/domain.md` — use correct pipeline terms (Retopo → UV unwrap → Texture)
- `~/.claude/skills/unity-csharp/SKILL.md` — when Unity-specific
- `~/.claude/skills/vrc-worlds/SKILL.md` — when VRChat-specific
