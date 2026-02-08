# Naming Patterns by Layer

Detailed naming examples and conventions for each cognitive layer.

---

## L1: Context Names (Arenas)

L1 names should feel like rooms in a building — broad, stable, immediately recognizable.

### Personal Drive Arenas

| Good | Bad | Why |
|------|-----|-----|
| `Career` | `Job` | Encompasses education, job search, and current role |
| `Finances` | `Money-Stuff` | Professional, scannable |
| `Home` | `House-Stuff` | Specific domain — housing, utilities, maintenance |
| `Media` | `My-Files` | Describes content type, not ownership |
| `Personal` | `Misc` | Has clear scope; misc has none |

### Work Drive Arenas

Work drives can use **mindset-based names** instead of nouns when the business has a clear deliver/sustain/expand pattern. The cognitive test still applies: does the name trigger wayfinding ("which mode am I in?")?

| Good | Bad | Why |
|------|-----|-----|
| `Fulfill` | `Delivery` | Action-oriented — answers "what do we do?" |
| `Maintain` | `Admin` | Encompasses finance, legal, ops, people under one intent |
| `Grow` | `Sales-Marketing` | Broader — covers strategy through retention |

### Rules for L1 Names

1. **Typically nouns** — dates never belong at L1. Verbs are OK when they represent mindsets (e.g., `Fulfill`, `Maintain`, `Grow`) that trigger the same wayfinding shift as nouns
2. **Title Case** — `Finance`, not `finance` or `FINANCE`
3. **Singular or plural, but consistent** — pick one convention
4. **No abbreviations** — L1 names are read hundreds of times, clarity matters
5. **5-8 arenas maximum** — if you have 12+, some are probably L2 outcomes hiding at L1

---

## L2: Execution Names (Outcomes)

L2 names should answer "what do I do here?" — they're the verbs and goals within an arena.

### Outcome-Based L2 Names (Work Drive)

Under the Fulfill/Maintain/Grow model, L2 names describe what each mindset produces or manages:

| Arena | Good L2 Names | Pattern |
|-------|---------------|---------|
| Fulfill | `Clients`, `Projects`, `Products & Services`, `Deliverables` | What we produce |
| Maintain | `Finance`, `Legal`, `People`, `Operations` | What keeps it running |
| Grow | `Attract`, `Convert`, `Retain`, `Strategy & Planning` | How we expand |

### Process-Based L2 Names

Within Maintain, L2 folders often break down further into process areas:

| L2 Folder | Good L3 Groups | Pattern |
|-----------|----------------|---------|
| Finance | `Invoices & Billing`, `Expenses & Receipts`, `Taxes`, `Payroll` | Financial processes |
| Legal | `Contracts & Agreements`, `Business Registration`, `Compliance` | Legal domains |
| Operations | `Systems & Tools`, `Processes & SOPs`, `Office & Facilities` | Operational areas |

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
