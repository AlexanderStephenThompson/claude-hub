# Synthesize Research

Combine multiple research files into one cohesive document. Takes the best of each source, removes redundancy, and produces a single authoritative reference.

---

## Instructions

The user will point you to a folder or list of markdown files containing research from different sources on the same topic.

1. **Read every file completely.** Do not skim. Note what each source does best and where it's weakest.

2. **Identify the unique contributions of each source:**
   - What does this source say that the others don't?
   - Where is this source the strongest (evidence, frameworks, examples, specifics)?
   - Where does it overlap with others (keep the better version)?

3. **Build a single cohesive document that:**
   - Opens with the core insight (one paragraph — what does the research converge on?)
   - Organizes by topic, not by source (never "Source A says... Source B says...")
   - Keeps the strongest version of each idea (best evidence, clearest framing, most actionable)
   - Preserves specific numbers, studies, and named frameworks with attribution
   - Cuts redundancy ruthlessly — if three sources say the same thing, keep one
   - Maintains a priority structure (what matters most → what matters least)
   - Ends with concrete next steps or an implementation sequence

4. **Quality checks:**
   - No source gets special treatment — judge by quality of insight, not source prestige
   - No "according to Source A" framing — synthesize, don't summarize
   - No filler transitions ("interestingly," "it's worth noting")
   - Every section earns its place — if removing it wouldn't change the reader's actions, cut it
   - Preserve links to external resources, repos, and papers

5. **Write the synthesized file** to the same folder as the sources, named `synthesized.md` (or a descriptive name if the user specifies one).

6. **Report:** List what each source contributed to the final document and what was cut.

7. **Generate a NotebookLM prompt.** After the synthesis is complete, generate a prompt the user can paste into NotebookLM (or any other AI research tool) for a critique pass. Write it to the same folder as `notebooklm-prompt.md`. The prompt should:
   - Frame it as: "I have several deep research reports and one synthesized document on [topic]"
   - **Explicitly state that the synthesis is already written and does NOT need to be rewritten**
   - Ask for a **short critique and additions report** — findings only, not a new document
   - The report should cover: gaps (what's missing), weak claims (what's wrong), new evidence (what to add), and contradictions between sources
   - For each finding, ask for enough detail to integrate it (the stat, the source, where it fits)
   - **Explicitly say: "Keep your response to findings only — no rewriting, no restructuring, no full updated document. I'll handle the integration."**
   - Be self-contained — the reader should understand what they're looking at without context from this conversation

   The user will bring NotebookLM's critique back to Claude for integration into `synthesized.md`.
