---
description: Score processes by frequency, time cost, and error risk to prioritize improvements
argument-hint: [process descriptions or path to documentation]
---

# /process-audit

TODO: Build this command.

## Purpose

Walks through a client's processes, scores each using the prioritization matrix, and outputs a ranked improvement roadmap.

## Scoring Matrix

| Factor | Question | Score |
|--------|----------|-------|
| **Frequency** | How often does this happen? | Daily = 3, Weekly = 2, Monthly = 1 |
| **Time cost** | How long each time? | 1+ hour = 3, 15-60 min = 2, Under 15 min = 1 |
| **Error risk** | How often does it go wrong? | Often = 3, Sometimes = 2, Rarely = 1 |

- Score 7-9: first priority
- Score 3-4: can wait
- Tiebreaker: pick the one closest to revenue

## Output

1. Scored process list (ranked)
2. Top 3 recommendations with expected impact
3. For each: eliminate, simplify, or automate?

## References

- `knowledge/business-acumen.md` — systems section, scoring matrix
