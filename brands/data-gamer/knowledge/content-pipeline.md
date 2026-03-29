# Data Gamer — Content Pipeline

How content gets made. Every video starts with data, not a script. The pipeline is what makes Data Gamer different from every other gaming channel — the work happens before the camera turns on.

---

## 1. Data Collection

The foundation. Before there's a video, there's a spreadsheet.

- **In-game tracking** — Manual logging during playthroughs. Track specific metrics: item drops, resource rates, build performance, trade prices. Use consistent methodology across runs so the data is comparable.
- **Spreadsheet setup** — Excel is the primary tracking tool. One sheet per experiment, clear column headers, timestamps. The spreadsheet IS the proof — it needs to be shareable if anyone asks.
- **SQL queries** — When game data is structured (databases, save files, exported data), query it directly. Faster than manual tracking, larger sample sizes.
- **Sample size matters** — One playthrough is an anecdote. 10+ runs is data. Always note sample size — it's the difference between "I think" and "the data says."

TODO: Document specific tracking templates per game (7D2D, ONI, Factorio).

## 2. Analysis

Finding the story. The data has a dozen angles — pick the one that challenges what people believe.

- **Look for the counterintuitive** — What does everyone assume that the data contradicts? That's your hook. "Everyone says rush the trader" + "the math says otherwise" = video.
- **Tableau for visualization** — Build charts that tell the story at a glance. The audience sees the chart in the video, not the tool. Tableau is backstage.
- **Confirm before you claim** — Check edge cases. Does the finding hold across difficulty levels? Game versions? Different play styles? Note caveats early — they become the "Caveat" section in the video.
- **The hook test** — Can you complete this sentence? "I [did X] and [surprising result]." If yes, you have a video. If not, keep digging.

TODO: Standard analysis checklist per video type (breakdown vs. deep dive).

## 3. Script

Turning findings into a Data Story. Use `/video-script` and `/video-hook`.

**Data Story structure:**
1. **Hook** — The counterintuitive stat or bold claim. First sentence has a number.
2. **Context** — "Here's what I did." Brief — how the data was collected, how many runs, what was tracked. 2-3 sentences max.
3. **Findings** — Walk through what the data shows. One finding per section. Visual callouts: [CHART: description], [GAMEPLAY: what to show].
4. **So what** — What this means for how you play the game. Practical takeaway.
5. **CTA** — Natural. "I'm tracking [next thing] — subscribe if you want to see that." Never "SMASH that like button."

**Script rules:**
- Sentences average under 15 words
- Use "I" not "we"
- Gaming-first — the game is the subject, data is the proof
- No "In this video we'll explore"
- Humility about process ("took me 3 hours"), confidence about findings ("the data says")

## 4. Production

Recording, editing, thumbnails. Keep this section brief — the data pipeline is the differentiator, not the production.

- **Recording** — Gameplay footage that matches the script's visual callouts. Capture the specific moments referenced in findings.
- **Chart overlays** — Tableau charts overlaid on game footage. This is the Data Gamer visual signature.
- **Thumbnails** — Spreadsheet/chart overlaid on game footage. NOT reaction faces. NOT red arrows. The data visualization IS the thumbnail hook.
- **Editing** — Tight cuts. No long intros. The video starts at the hook — everything before it gets cut.

TODO: Thumbnail template and style guide.

## 5. Distribution

Get it in front of people. One video becomes multiple pieces.

- **YouTube upload** — Title from `/video-title` (gaming claim first, specific numbers, bold). Description follows the pattern from `brand/samples.md`.
- **Social posts** — `/social-post` for each platform. Under 30 words, lead with the surprising finding.
- **Repurposing chain:**
  - Full video → 2-3 short clips (one finding each)
  - Full video → social post per finding
  - Full video → wiki entry for permanent reference
  - Full video → Twitch discussion topic

TODO: Platform-specific posting schedule and format requirements.

## 6. Twitch Integration

Streams are both content AND research. The audience generates future video topics.

- **Channel point rewards drive content:**
  - **Stat Check** — Viewer asks a question → gets logged as a potential video topic
  - **Challenge the Hypothesis** — Viewer proposes a counter-analysis → potential video angle
  - **Show the Spreadsheet** (25K points) — Behind-the-data segment → builds trust, shows methodology
  - **Kill Process** — Stream-ending redemption → community engagement

- **Data collection during streams** — Track in real-time during gameplay. The audience watches the spreadsheet fill up. This is the "proof of work" that makes the channel credible.

- **Progression tiers** build community identity: Lurker → Regular → Data Nerd → Analyst → Statistician

- **Topic pipeline** — Every Stat Check and Challenge the Hypothesis gets logged. High-engagement questions become video topics. The stream audience pre-validates what's worth a full video.

TODO: Topic logging system and how stream topics get prioritized into the video pipeline.

## 7. Wiki Pipeline

Videos are ephemeral; wiki entries are the permanent reference. Use `/wiki-entry` and the `wiki-builder` agent.

- **After every video** — Extract the key findings into a wiki entry. The video tells the story; the wiki entry is the reference.
- **Wiki entry structure:** Topic → Key finding → Methodology → Data tables → Gameplay implications → Caveats
- **Cross-referencing** — Related entries link to each other. A trade pricing entry links to the economy overview entry.
- **Version tracking** — Game updates can invalidate findings. Every entry notes the game version. Outdated entries get flagged, not deleted.
- **Batch production** — After a deep tracking session, use `wiki-builder` to produce multiple entries at once with consistent formatting.

TODO: Wiki entry review cadence (check for outdated entries after game patches).

---

## Pipeline Summary

```
Track data → Find the counterintuitive angle → Script the Data Story
    → Record + edit → Distribute → Stream for more data → Document in wiki
                                        ↑                        |
                                        └────────────────────────┘
                                     (wiki + stream feed next video)
```

The pipeline is a loop. Streams generate questions. Questions become tracking sessions. Tracking becomes data. Data becomes videos. Videos become wiki entries. Wiki gaps become new questions. Repeat.
