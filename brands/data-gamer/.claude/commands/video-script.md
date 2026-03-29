---
description: Write a full Data Story video script from game data and findings
argument-hint: "<game> <topic> — provide data findings in the conversation"
---

# Video Script

Write a full Data Story video script for a Data Gamer YouTube video.

## Before You Start

Read these files for voice and framing:
- `brand/voice.md` — tone rules and banned words
- `brand/samples.md` — the Data Story pattern and contrastive examples
- `brand/domain.md` — brand terminology

## Input

The user provides:
1. **Game** — which game this covers
2. **Topic** — what was analyzed
3. **Data findings** — the actual results from the analysis

## Output: Data Story Script

Write the script following this exact structure:

### 1. Hook (first 10 seconds)

- Open with the most counterintuitive stat or finding
- Must follow the pattern: "I [did X] and [surprising result]"
- Must contain a specific number or claim
- Challenge a common belief the audience holds
- NO "In this video" or "Hey guys welcome back"

### 2. Context ("Here's what I did")

- Brief explanation of methodology — what was tracked, how many runs/hours/tests
- Keep it under 30 seconds of script
- Humility about the process ("took me 3 hours of logging every drop")
- Mention the game naturally, not as a subject of study

### 3. Findings (the meat)

- Walk through data points one at a time
- For each finding, note `[VISUAL: description]` for what should appear on screen
- Use specific numbers — never "a lot" or "significantly"
- Build toward the most surprising conclusion
- Use gaming language, not analytics language ("the drop rate is garbage" not "the probability distribution skews left")
- Break complex findings into bite-sized pieces — one idea per sentence

### 4. So What (gameplay implications)

- Translate findings into actionable gameplay advice
- "So next time you're deciding between X and Y, the numbers say..."
- Be confident about what the data shows
- Acknowledge edge cases where the answer might change

### 5. CTA (natural close)

- Tie the CTA to what comes next in the content pipeline
- "I'm tracking [next thing] — subscribe if you want to see that"
- NEVER say "call to action" on camera
- NEVER say "smash that like button" or any hype-bro closer

## Voice Checks

Before delivering the script, verify:
- [ ] First sentence contains a specific number or claim
- [ ] "I" not "we" throughout
- [ ] No sentences over 25 words
- [ ] Average sentence length under 15 words
- [ ] No banned words from `brand/voice.md`
- [ ] No educational framing ("today we'll learn", "let's explore")
- [ ] Tools (Tableau, Excel, SQL) are NOT mentioned — only findings
- [ ] Gaming-first framing — the game is the content, not data science
- [ ] Every `[VISUAL]` tag describes what the viewer sees, not the tool used

## TODO

<!-- TODO: Add script length targets (short/standard/long) based on video format -->
<!-- TODO: Add B-roll and gameplay footage suggestions per section -->
<!-- TODO: Add thumbnail concept suggestion tied to the hook -->
