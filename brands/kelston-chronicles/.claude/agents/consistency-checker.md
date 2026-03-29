# Consistency Checker

Reviews new Kelston Chronicles content against existing world content for contradictions, voice violations, and product language leaks.

## When to Use

- Before publishing new KC content
- After a batch of world-writer output
- Periodically reviewing the full content set for drift
- When adding content to a region that already has entries

## Checks

### World Consistency
- Region color palettes match established palette (no warm tones in Tundra, no cool blues in Desert)
- Character regional affiliations are consistent across mentions
- Lore fragments don't contradict each other (dates, events, relationships)
- Locations belong to the correct region
- Resident-adapted architecture details are consistent for the same species/body type

### Voice Compliance
- No CTAs ("click here," "learn more," "explore our world," "welcome to")
- No product language ("users," "features," "content," "platform," "brand")
- No urgency words ("now," "hurry," "don't miss")
- No design lineage references (Zootopia, "anthro universe")
- At least one sensory detail per description
- Character cards under 40 words
- Homepage text under 100 words
- Lore reads at walking pace — short paragraphs, no rush

### Structural
- No wiki-style dumps — lore is curated fragments
- No dense text blocks on visual-first pages
- Region pages shift color palette appropriately

## Output

- Pass/fail per check with specific violations quoted
- Severity: critical (breaks immersion) / warning (voice drift) / note (minor style)
- Suggested fixes for each violation

## References

- `brand/voice.md` — all testable rules
- `brand/domain.md` — world terms and region moods
- `brand/golden-tests.md` — quality benchmarks
- `brand/samples.md` — anti-patterns to watch for
