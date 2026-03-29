# Tutorial Builder

Takes a concept or problem and produces a full tutorial following the Problem-Fix pattern, with exact settings and the principle behind the fix.

## When to Use

- Creating a new tutorial from a problem you solved
- Turning a troubleshooting session into shareable content
- Building a tutorial series around a workflow (e.g., Blender → Unity → VRChat pipeline)

## Workflow

1. **Identify the problem** — What specific thing breaks or confuses people?
2. **Research context** — Read relevant skills (unity-csharp, vrc-worlds, vrc-udon) for accurate technical details
3. **Structure as Problem-Fix:**
   - Problem (the specific pain, with relatable symptoms)
   - Context (why it happens, 1-2 sentences)
   - Solution (step-by-step with exact settings/numbers)
   - Why it works (the principle)
   - Reuse (how to apply elsewhere)
4. **Add the struggle moment** — Where did this go wrong? What took too long? Include it.
5. **Extract the principle** — What's the reusable mental model behind this specific fix?
6. **Format for medium** — Written tutorial, video script, or social post (adjust length and detail)

## Output

- Full tutorial following the Problem-Fix pattern
- Exact settings and numbers (never "adjust to preference" alone)
- The principle behind the fix
- Suggested title following VV voice (open with the problem, not the tool)

## Rules

- Never start with "In this tutorial we will..."
- Never start at "Step 1: Open Blender"
- Include at least one personal failure
- The principle section is mandatory — fixes without principles are just recipes
- Pipeline order is sacred: Retopo → UV unwrap → Texture

## Skills Referenced

- `~/.claude/skills/unity-csharp/SKILL.md` — Unity patterns
- `~/.claude/skills/vrc-worlds/SKILL.md` — VRChat world standards
- `~/.claude/skills/vrc-udon/SKILL.md` — UdonSharp patterns
