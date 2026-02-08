# Naming Patterns by Layer

Detailed naming examples and conventions for each cognitive layer.

---

## L1: Context Names (Arenas)

L1 names should feel like rooms in a building — broad, stable, immediately recognizable.

### Personal Drive Arenas

| Good | Bad | Why |
|------|-----|-----|
| `Finance` | `Money-Stuff` | Professional, scannable |
| `Creative` | `My-Projects` | Describes the domain, not ownership |
| `Learning` | `School` | Broader — covers courses, books, research |
| `Personal` | `Misc` | Has clear scope; misc has none |
| `Work` | `Job` | More professional, encompasses career scope |

### Work Drive Arenas

| Good | Bad | Why |
|------|-----|-----|
| `Engineering` | `Dev` | Full word, no ambiguity |
| `Marketing` | `Mktg` | Don't abbreviate L1 names |
| `People` | `HR` | More human, less bureaucratic |
| `Operations` | `Ops` | Spell it out at the top level |
| `Leadership` | `Management` | Signals strategic focus |

### Rules for L1 Names

1. **Always nouns** — never verbs, never dates
2. **Title Case** — `Finance`, not `finance` or `FINANCE`
3. **Singular or plural, but consistent** — pick one convention
4. **No abbreviations** — L1 names are read hundreds of times, clarity matters
5. **5-8 arenas maximum** — if you have 12+, some are probably L2 outcomes hiding at L1

---

## L2: Execution Names (Outcomes)

L2 names should answer "what do I do here?" — they're the verbs and goals within an arena.

### Verb-Based L2 Names

| Arena | Good L2 Names | Pattern |
|-------|---------------|---------|
| Marketing | `Launch`, `Grow`, `Analyze`, `Campaign` | Action verbs |
| Engineering | `Ship`, `Maintain`, `Plan`, `Tooling` | Work modes |
| Finance | `Budget`, `Invoice`, `Report`, `Audit` | Process names |
| People | `Hire`, `Onboard`, `Review`, `Develop` | HR lifecycle verbs |

### Process-Based L2 Names

When verbs feel forced, use process nouns:

| Arena | Good L2 Names | Pattern |
|-------|---------------|---------|
| Legal | `Contracts`, `Compliance`, `IP`, `Disputes` | Legal domains |
| Design | `Brand`, `Product`, `Research`, `Assets` | Design domains |
| Operations | `Vendors`, `Facilities`, `Processes` | Operational areas |

### Time-Scoped L2 Names

When recurrence matters, prefix with time:

| Pattern | Example | When to Use |
|---------|---------|-------------|
| `YYYY-Topic` | `2025-Budget` | Annual processes |
| `QN-Topic` | `Q1-Campaign` | Quarterly work |
| `Topic` (no date) | `Onboarding` | Ongoing, no time boundary |

### Rules for L2 Names

1. **Verbs or process nouns** — answer "what am I doing?"
2. **kebab-case or Title-Case** — be consistent within each L1 arena
3. **3-6 outcomes per arena** — more than 10 means your L1 is too broad
4. **Archive completed outcomes** — use `_Archive/` to keep active list short

---

## L3: Retrieval Names (Artifacts)

L3 names should be unique enough to find via search and specific enough to identify without opening.

### File Naming Patterns

| Pattern | Example | When to Use |
|---------|---------|-------------|
| `Type-Subject.ext` | `Invoice-Acme-Corp.pdf` | Default pattern |
| `YYYY-MM-DD_Subject.ext` | `2025-03-15_Meeting-Notes.md` | Chronological files |
| `Subject-Version.ext` | `Proposal-v3.docx` | Versioned documents |
| `Subject-Variant.ext` | `Logo-Dark.png`, `Logo-Light.png` | Multiple variants |

### Subfolder Naming at L3

When L3 has too many artifacts, group by type:

```
Q1-2025-Launch/
├── Planning/
│   ├── Brief.docx
│   └── Timeline.xlsx
├── Assets/
│   ├── Hero-Banner.png
│   └── Social-Post.png
├── Copy/
│   └── Landing-Page.docx
└── Results/
    └── Analytics-Report.pdf
```

These subfolders are still L3 — they're organizing artifacts, not changing your cognitive mode.

### Rules for L3 Names

1. **Be specific** — `Invoice-2025-03-Acme.pdf`, not `Invoice.pdf`
2. **Front-load the distinguishing word** — what makes this file different from others?
3. **Use hyphens between words** — `Meeting-Notes`, not `MeetingNotes` or `meeting_notes`
4. **Include dates when chronology matters** — ISO format: `YYYY-MM-DD`
5. **No spaces** — spaces break command-line tools, URLs, and scripts
6. **Lowercase extensions** — `.pdf`, not `.PDF`

---

## Casing Conventions

Pick one convention per level and enforce it across the entire drive.

| Level | Recommended | Alternative | Avoid |
|-------|-------------|-------------|-------|
| L1 | Title Case (`Finance`) | UPPER (`FINANCE`) | lowercase (`finance`) |
| L2 | Title-Case (`Product-Launch`) | kebab-case (`product-launch`) | camelCase |
| L3 files | kebab-case (`meeting-notes.md`) | Title-Case (`Meeting-Notes.md`) | spaces |
| L3 folders | Title-Case (`Assets`) | kebab-case (`assets`) | ALL-CAPS |

### Why Consistency Matters

- Inconsistent casing makes visual scanning harder
- Mixed conventions create duplicates (`Finance/` vs `finance/`)
- Alphabetical sorting behaves differently for UPPER vs lower
- Scripts and automation break on unexpected casing

---

## Special Characters to Avoid

| Character | Problem |
|-----------|---------|
| Spaces | Break CLI tools, URLs, scripts |
| `#` | Interpreted as comments in many tools |
| `%` | URL encoding conflicts |
| `&` | Shell interpretation issues |
| `'` `"` | Quote escaping problems |
| `@` | Email address confusion |
| `(` `)` | Regex and shell interpretation |
| Non-ASCII | Encoding issues across systems |

**Safe characters:** `A-Z`, `a-z`, `0-9`, `-`, `_`, `.`

### Semantic Prefixes

Some characters are reserved as **folder name prefixes** with specific meaning. These are not general-purpose — they signal a folder's role in the system.

| Prefix | Meaning | Examples | Duration |
|--------|---------|----------|----------|
| `_` (underscore) | System/infrastructure folder | `_Archive/`, `_Unsorted/`, `_Templates/` | Permanent |
| `~` (tilde) | Content in active transit | `~Transfer/`, `~Import/`, `~Migrate/` | Temporary — remove when transfer completes |

**Rules:**
- These prefixes are only valid as the **first character** of a folder name
- `~` should only appear on **source/staging** folders, never on the destination
- If a `~` folder persists for 60+ days without activity, it's stale and should be resolved
- Don't combine prefixes (`_~Transfer/` or `~_Archive/` are both wrong)
