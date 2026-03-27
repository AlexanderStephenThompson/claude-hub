# AI Context Architecture: The Personalization Manifest

## 1. The Context Impact Matrix
Prioritize information based on how much it actually shifts AI behavior.

| Impact | Category | Implementation | Purpose |
| :--- | :--- | :--- | :--- |
| **High** | **Annotated Examples** | "Few-Shot" blocks | Shows "good" vs "bad" output. |
| **High** | **Negative Constraints** | "Banned List" | Stops "AI-isms" and generic defaults. |
| **Med** | **Domain Glossary** | Key Term Definitions | Enforces project-specific vocabulary. |
| **Med** | **Technical Stack** | Version-specific libs | Prevents hallucinating wrong libraries. |
| **Low** | **General Bio** | Career History | Useful for background, but low logic impact. |

---

## 2. The Three-Layer Hierarchy
Avoid "context bleed" by scoping information to the correct level of the file system.

### Layer 1: Global Identity (~/.cursorrules)
*Stable across all projects. Defines who you are and how you work.*
- **Communication Style:** (e.g., "Direct, high-leverage advice; skip the fluff.")
- **Anti-Patterns:** List words/phrases to NEVER use (e.g., "delve," "unlocking," "tapestry").
- **Global Formatting:** (e.g., "Use 2-space indentation," "Standardize on LaTeX for math.")

### Layer 2: Project Architecture (./CLAUDE.md or .cursor/rules/)
*Specific to the repository. Defines the project's laws.*
- **The "North Star":** The core goal of the project (e.g., "Consolidation of fragmented tools.")
- **Domain Logic:** (e.g., "This system treats all inputs as immutable events.")
- **Tech Stack:** (e.g., "Python 3.11, Tailwind CSS, no external UI libraries.")
- **File Structure:** "Components live in /ui, logic lives in /core."

### Layer 3: Session Intent (./PLAN.md)
*Volatile. Changes daily to keep the agent focused.*
- **Current Sprint:** "Refactoring the authentication module."
- **Definitions of Done:** Checklist the AI must verify before completion.

---

## 3. Implementation: XML-Structured Rules
AI models respond better to XML tags than prose. Use these blocks in your project rules.

### <technical_standards>
- **Naming:** Use `snake_case` for variables, `PascalCase` for components.
- **Error Handling:** Never swallow exceptions; always log with context.
- **Testing:** New features require a corresponding `test_*.py` file.
</technical_standards>

### <voice_and_tone>
- **On-Tone Example:** "Fragmentation is a tax on focus. Consolidate or lose the thread."
- **Off-Tone Example:** "It is important to integrate your tools for better efficiency."
- **Constraint:** Avoid rhetorical questions and marketing "hype" words.
</voice_and_tone>

---

## 4. Solving "Brand Bleed"
To prevent styles from one project infecting another:
1. **Nested Rules:** Always place specific rules in the root of the project folder. Modern agents prioritize the `.cursorrules` or `.md` file closest to the active file.
2. **Distinct Glossaries:** If Project A uses "Subscribers" and Project B uses "Members," define these explicitly in their respective project-level files.

---

## 5. Maintenance: The "Decay" Strategy
To prevent context rot without manual labor:
1. **The Hand-Off:** At the end of every session, ask the AI: *"Summarize our progress and update PROJECT_STATE.md."*
2. **The Purge:** Every 30 days, delete "Layer 3" (Session Intent) files to keep the context window clean for new tasks.