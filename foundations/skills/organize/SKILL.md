---
name: organize
description: Folder organization system using the L1/L2/L3 cognitive-phase framework. Applies to home, work, and shared drives for designing folder hierarchies, reorganizing structures, or deciding where files belong.
---

# Organization Skill

**Version:** 1.2
**Source:** L1/L2/L3 Cognitive-Phase Framework

> Folder structure should match how your brain navigates, not how a database stores records.

---

## North Star

**Goal:** You always know where you are and what you're looking for.

**Definition:** Any person (or AI) should be able to find a file in 3 decisions or fewer, without guessing which folder it's in.

**Smell:** If you open a folder and feel lost, the structure has failed.

---

## Quick Start

Already know what you need? Start here:

| I want to... | Go to |
|--------------|-------|
| Organize my personal/home drive | `assets/home-drive-template.md` — pick arenas, build L2, let L3 emerge |
| Organize a business/team drive | `assets/work-drive-template.md` — Fulfill/Maintain/Grow framework |
| Reorganize a messy existing drive | `references/migration-guide.md` — phase-by-phase migration |
| Name files and folders correctly | `references/naming-patterns.md` — conventions by layer |
| Audit a drive for structural issues | `scripts/audit_structure.py <path>` — automated health check |

For the full framework explanation, read on.

---

## The L1/L2/L3 Framework

Folder navigation is three cognitive phases. Each phase answers a different question, and folder names should match the type of thinking you're doing at that level.

### L1: Context (Nouns / Arenas)

**Question:** "Where am I operating?"

**Brain mode:** Wayfinding. You're orienting yourself to a domain before doing any work.

**Folder names are typically nouns** — broad arenas of activity. Mindset-based verbs (e.g., `Fulfill`, `Maintain`, `Grow`) are valid when they trigger the same wayfinding shift:

```
Drive/
├── Finance/
├── Marketing/
├── Operations/
├── Production/
├── Legal/
└── Personal/
```

**Test:** You're still in L1 as long as you're narrowing the domain. You might click through multiple folders and still be in L1 if each click is answering "which world am I in?"

**Success condition:** Your brain naturally shifts from "where am I?" to "what am I trying to do?"

### L2: Execution (Verbs / Outcomes / Subject Categories)

**Question:** "What am I trying to accomplish?" — or in creative/domain-heavy projects — "What type of thing am I working on?"

**Brain mode:** Targeting. You've picked an arena, now you're selecting an objective or subject focus.

**Folder names are verbs, outcomes, or subject categories** — what work gets done here:

```
Marketing/                    # Business example — verbs/outcomes
├── Launch/
├── Grow/
├── Campaign/
├── Brand/
└── Analyze/

Arctic/                       # Creative example — subject categories
├── Locations/                # "I'm working on PLACES"
├── Residents/                # "I'm working on CHARACTERS"
└── Lore/                     # "I'm working on STORY"
```

**L2 doesn't require verb names.** In creative, world-building, or domain-heavy projects, subject-matter categories (Locations, Characters, Assets, Environments) function as L2 when they trigger the brain shift from wayfinding to intent. The test is whether your brain changes modes — not whether the folder name is a verb.

**Test:** You're in L2 as long as you're narrowing the objective, work mode, or subject focus. L2 completes when you start hunting for a specific artifact.

**Success condition:** Your brain shifts from "what am I doing?" to "which thing do I need?"

### L3: Retrieval (Objects / Artifacts)

**Question:** "What exact thing do I need?"

**Brain mode:** Grabbing. You've picked an outcome, now you grab the thing.

**Folder names are specific objects** — the artifacts themselves:

```
Campaign/
├── Q1-2025-Product-Launch/
│   ├── Brief.docx
│   ├── Timeline.xlsx
│   ├── Assets/
│   └── Results.pdf
└── Q2-2025-Brand-Refresh/
    └── ...
```

**Test:** You're in L3 when you're scanning for a specific file or artifact. You know what you want — you're just finding it.

---

## Key Principle: Layers Are Cognitive Phases

The layers are NOT literal folder counts. They describe your mental state as you navigate.

| Scenario | Folders Clicked | Actual Layer |
|----------|----------------|--------------|
| `Work > Clients > Acme Corp` | 3 folders | Still L1 — you're still answering "which world?" |
| `Finance > Accounts Payable` | 2 folders | L1 → L2 transition — you shifted from domain to outcome |
| `Campaign > Q1 Launch > Brief.docx` | 3 folders | L1 → L2 → L3 — full cognitive progression |

**The test isn't "how many folders?" but "has my brain shifted modes?"**

---

## Diagnostic Guard

Before diagnosing a structure as broken or a layer as missing, apply these checks:

| Check | If yes → |
|-------|----------|
| Can the user reach their file in 3 decisions without feeling lost? | The structure works — don't restructure |
| Do the cognitive shifts happen, even if folder names don't match the framework's vocabulary? | The layers are present — don't rename to force verb/noun compliance |
| Is the structure consistent and predictable across parallel branches? | The pattern works — document it, don't flatten it |
| Is the domain inherently hierarchical (geography, physical spaces, taxonomies)? | Extended L1 wayfinding is expected — don't mistake it for a missing L2 |

**The framework serves navigation, not the other way around.** If someone navigates smoothly, the structure is working regardless of whether folder names are verbs, nouns, or subject categories. Diagnose problems people actually experience, not theoretical label mismatches.

---

## Scaffolding Evaluation

Empty folders aren't always clutter. Pre-built folder structures serve a real purpose in creative and content-heavy projects — they communicate "this is a slot for future content" and ensure consistency across parallel branches. Before flagging empty structure as a problem, determine whether it's **intentional scaffolding** or **scattered clutter**.

### Intentional Scaffolding (Acknowledge It)

Scaffolding is working when it passes these checks:

| Signal | What It Looks Like |
|--------|-------------------|
| **Consistent template** | The same structure repeats uniformly across parallel branches (e.g., every biome has Locations + Residents with the same subtypes) |
| **Reflects a domain model** | The folder template maps to a real structure — a taxonomy, a physical space, a content pipeline — that will need filling |
| **Progressive filling** | Some branches have real content while others are still placeholders. Work is happening within the template |
| **Placeholder convention** | Generic names (numbered slots, "Idea 1/2/3") are obviously temporary markers meant to be renamed when content arrives |
| **Bounded depth** | Scaffolding doesn't exceed 2-3 levels of empty folders before reaching the content layer |

When you encounter scaffolding that passes these checks, **acknowledge it as useful structure** rather than flagging it for removal. Note where content has filled in and where it hasn't, but don't recommend tearing down the framework.

**Example — good scaffolding in a world-building project:**

```
VR World/
├── Arctic/
│   ├── Locations/
│   │   ├── Commercial/
│   │   │   ├── _Ideas/
│   │   │   └── Winter Lodge Restaurant/    ← named, filling in
│   │   ├── Natural/
│   │   │   └── _Ideas/
│   │   └── Residential/
│   │       └── Dream House/                ← built out with rooms
│   └── Residents/
│       └── Alexander Borealis/             ← named character
├── Forest/                                  ← same template, different fill state
│   └── Residents/
│       ├── Big Bear/                        ← fully developed
│       └── Zebra Fox/
└── Desert/                                  ← same template, less filled
    └── ...
```

The template is consistent, reflects the world-building domain (biomes × content types), and is progressively filling with real content. The empty slots are a content roadmap, not noise.

**Example — good scaffolding in a content pipeline:**

```
character-types/
├── bears/images/
│   ├── head/        (31 files)              ← filling in
│   ├── body/        (15 files)
│   └── tail/        (0 files)               ← empty but expected
├── dogs/images/
│   ├── head/        (26 files)
│   └── legs-and-feet/ (28 files)
└── foxes/images/                            ← mostly empty, work not started yet
```

Same body-part template across 25 species. Bears and dogs are well-populated; foxes haven't started yet. The empty folders are task slots in a production pipeline.

### Scattered Clutter (Flag It)

Scaffolding has become clutter when:

| Signal | What It Looks Like |
|--------|-------------------|
| **No repeating pattern** | Empty folders are one-offs, not part of a template |
| **Asymmetric parallel branches** | Sibling branches have different structures with no domain reason for the difference |
| **Zero content anywhere** | The entire tree is empty — no branch has real content |
| **Stale with no plan** | Created months ago, never used, and no work is planned for it |
| **Ambiguous purpose** | Folder names don't communicate what content belongs there (`New Folder`, `Stuff`, `temp`) |

### What To Do With Each

| Finding | Action |
|---------|--------|
| Consistent template, actively filling | **Keep.** Acknowledge it as useful scaffolding |
| Consistent template, stale everywhere | **Flag** as possibly abandoned. Ask if work is still planned |
| Partial pattern, inconsistent application | **Suggest** completing the pattern — make it consistent or remove the outliers |
| One-off empties with no pattern | **Recommend removal.** Create folders when content arrives |

### The Key Test

> **Would deleting this empty folder lose information?** If the folder name + location tells you "this is a slot for [specific type of content]," it's scaffolding. If deleting it wouldn't confuse anyone about what goes where, it's clutter.

---

## Progressive Disclosure

The framework uses progressive disclosure — each level reveals only what you need for your current decision:

```
Step 1: See 5-8 arenas          (L1 — which world?)
Step 2: See 3-6 outcomes         (L2 — which goal?)
Step 3: See the artifacts         (L3 — grab the thing)
```

### Ideal Counts per Level

| Level | Target | Max Before Splitting |
|-------|--------|---------------------|
| L1 arenas | 5-8 | 12 |
| L2 outcomes per arena | 3-6 | 10 |
| L3 artifacts per outcome | Varies | 30 (then subgroup) |

If any level exceeds its max, it's a signal to split or restructure.

---

## Naming Conventions

### L1 Names: Broad, Stable, Recognizable

| Pattern | Examples |
|---------|----------|
| **Use nouns** | `Finance`, `Marketing`, `Operations`, `Legal` |
| **Capitalize** | Title Case for top-level arenas |
| **Keep stable** | These rarely change — they represent domains of your life/work |
| **No dates** | Dates belong in L2 or L3, not L1 |

### L2 Names: Action-Oriented, Scannable

| Pattern | Examples |
|---------|----------|
| **Use verbs or outcomes** | `Launch`, `Grow`, `Hire`, `Ship`, `Fulfill` |
| **Or use clear process names** | `Onboarding`, `Reporting`, `Budgeting` |
| **Allow time-scoping** | `2025-Budget`, `Q1-Campaign` when recurrence matters |

### L3 Names: Specific, Descriptive, Findable

| Pattern | Examples |
|---------|----------|
| **Be specific** | `Invoice-2025-03-Acme.pdf`, not `Invoice.pdf` |
| **Date-prefix for chronology** | `2025-03-15_Meeting-Notes.md` |
| **Type-suffix for scannability** | `Logo-Primary.png`, `Logo-Dark.png` |
| **No ambiguity** | Every name should be unique enough to find via search |

### Universal Naming Rules

| Rule | Rationale |
|------|-----------|
| Consistent casing | Pick Title-Case, kebab-case, or snake_case per level and stick with it |
| Front-load the distinguishing word | `Budget-2025` not `2025-Budget` (unless sorting by date matters more) |
| No special characters | Stick to `A-Z`, `0-9`, `-`, `_`, and spaces (where appropriate) |

### Context-Sensitive Naming Rules

| Context | Spaces OK? | Hyphens/underscores required? | Why |
|---------|-----------|------------------------------|-----|
| **Personal/creative drives** | Yes | No — readability matters more | `Winter Lodge Restaurant` is easier to read than `Winter-Lodge-Restaurant`. OS handles spaces natively |
| **Code projects & websites** | No | Yes — use hyphens or underscores | Spaces break scripts, URLs, CLI commands, and version control |
| **Shared/team drives** | Depends | Match team convention | Consistency within the team matters more than any single rule |

**Don't apply code conventions to personal drives, or personal conventions to codebases.** Match the rules to the environment.

### File Name Semantics

File names should communicate what the file contains at a glance. A good file name answers "what is this?" without opening it.

#### Non-Semantic Names (Flag These)

| Pattern | Example | Problem |
|---------|---------|---------|
| **Hash / ID strings** | `50bacb7db3dbda5ba74ce3b7e51aa624.jpg` | Tells you nothing |
| **Generic defaults** | `Untitled.png`, `download (1).jfif` | Indistinguishable |
| **Screenshot auto-names** | `Screenshot (163).png` | What's in the screenshot? |
| **Bare timestamps** | `photo_2021-03-15_09-25-00.jpg` | When, not what |
| **AI prompts as filenames** | `alexandersthompson_UI_design_of_a_Forest...png` | Too long, truncated hashes |
| **Platform export names** | `IMG_20200417_180854_994.jpg` | Camera roll IDs |

#### What Makes a Good File Name

| Principle | Example |
|-----------|---------|
| **Describes the content** | `ice-cave-interior.jpg` not `89381.jpg` |
| **Uses your vocabulary** | `bear-head-front-view.png` not `head-01.jpg` |
| **Distinguishes from siblings** | `moraine-lake-sunrise.jpg` and `crater-lake-aerial.jpg` |
| **Keeps reasonable length** | 3-6 words |
| **Preserves useful metadata as a suffix** | `desert-canyon-ref_antelope-canyon.jpg` |

#### When to Flag vs. When to Ignore

| Situation | Action |
|-----------|--------|
| **Files in a curated, final-destination folder** | Flag — these are artifacts you'll revisit |
| **Files in `_Ideas/` or reference folders** | Flag if 10+ files with hashes/timestamps |
| **Files inside a transit folder (`~`)** | **Ignore** — transit content is WIP |
| **Files in a scaffolding placeholder** | Ignore — will be renamed when content arrives |
| **A handful of files with obvious visual context** | Low priority |

#### Suggesting Better Names

When flagging non-semantic names, suggest replacements based on:
1. **The folder context** — a file in `Arctic/Locations/Natural/_Ideas/` is probably a nature/landscape reference
2. **The file's visible content** — if you can read the image, describe what you see
3. **Sibling files** — if named files exist alongside unnamed ones, match the pattern
4. **Don't require perfection** — `snowy-village.jpg` is better than `241076.jpg`, even if it's not a complete description

---

## Decision Guide: Where Does This File Go?

| Ask yourself... | If yes → |
|-----------------|----------|
| Is this active work I'm producing right now? | L2 outcome folder for that project/activity |
| Is this reference material I look up but don't edit? | `Reference/` within the relevant L1 arena |
| Is this a template I reuse across projects? | `_Templates/` (shared or per-arena) |
| Is this a finished deliverable? | L3 artifact inside the outcome that produced it |
| Is this someone else's output I need to access? | Shortcut/link to the owner's L2, not a copy |
| I genuinely don't know | `_Unsorted/` — sort it during your weekly review |

---

## Active vs Reference: The Intent Test

| Folder type | Purpose | Brain mode | Examples |
|-------------|---------|------------|---------|
| **Active (doing)** | Work in progress, projects, deliverables | "I'm producing something" | `Launch/`, `Ship/`, `Hire/` |
| **Reference (knowing)** | Lookup material, policies, standards, guides | "I'm finding an answer" | `Reference/`, `Policies/`, `Standards/` |

**The test:** "Am I opening this folder to *do work* or to *look something up*?"

- If both → split into two L2 folders. The active folder holds the work and links to the reference folder.
- Active folders archive when work is done. Reference folders persist.

---

## Overlap Resolution

> **The active folder owns the work. The reference folder owns the knowledge. They link to each other — never duplicate.**

| Situation | Resolution |
|-----------|-----------|
| File could live in two L1 arenas | Pick the primary owner based on who produced it. Shortcut from the other arena |
| File is both active work AND reference | Put it in the active folder now. Move to reference when the project completes |
| Two teams need the same file | One team owns it. The other gets a shortcut. If neither owns it → `_Shared/` |
| Same data, different formats | One source of truth. The canonical version lives in the owner's folder |

**Never duplicate.** Two copies means one gets stale.

---

## System Folders

Infrastructure folders that support the structure, not content. Use a **leading underscore**.

| System Folder | Purpose | Scope |
|---------------|---------|-------|
| `_Archive/` | Completed work that's no longer active | Within each L2 outcome |
| `_Unsorted/` | Temporary inbox for files without a clear home | One per drive (top level) |
| `_Templates/` | Reusable document templates | Per L1 arena or shared at top level |
| `_Shared/` | Cross-functional items with no single owner | Top level only |

### Rules for System Folders

| Rule | Rationale |
|------|-----------|
| **Always underscore-prefixed** | Sorts separately from content folders, visually distinct |
| **Never nest system folders** | `_Archive/_Archive/` is a red flag — flatten it |
| **`_Unsorted/` is temporary** | It's an inbox, not a permanent home. Review weekly |
| **`_Shared/` requires justification** | Every file there should have a reason it can't live in a single arena |
| **Don't create system folders preemptively** | Add `_Archive/` when you first need to archive, not before |

---

## Transit Folders

Folders holding content that is **actively being moved** to a known destination. Use a **leading tilde** (`~`). Distinct from `_Unsorted/` (destination unknown).

| Folder | Purpose |
|--------|---------|
| `~Transfer/` | Staging area for content being moved into a project |
| `~Import/` | Incoming content from an external source |
| `~Migrate/` | Content moving between organizational structures |

Key rules: always tilde-prefixed, include a date suffix (`~Transfer 2026-02/`), include `_STATUS.md` for multi-session transfers, delete when empty.

For full details (naming conventions, lifecycle, staleness signals, analysis scope), see `references/transit-folders.md`.

---

## File Lifecycle

```
Created → Active → Completed → Archived → (Deleted)
```

Files move through stages based on project status. Archive at L2 level (`_Archive/` within the outcome folder). Default to keeping — storage is cheap, regret is expensive.

For full lifecycle rules, archive strategy, and maintenance cadence (weekly/monthly/quarterly), see `references/lifecycle.md`.

---

## Adapting by Scale

| Scale | L1 Maps To | L2 Emphasis | Key Consideration |
|-------|-----------|-------------|-------------------|
| **Personal** (one person) | Life domains: `Career`, `Finances`, `Home`, `Media`, `Personal` | Lightweight — project names or simple outcomes | L3 is where most files live |
| **Team** (small group) | Mindsets: `Fulfill`, `Maintain`, `Grow` | Structured — processes, projects, time periods | Decide who owns each L1 arena |
| **Organization** (company) | Departments or business units | Enforced naming conventions across teams | Align access controls with L1 boundaries |

---

## Red Flags

Stop and reorganize when you see:

| Smell | Problem | Fix |
|-------|---------|-----|
| **Catch-all folders** | `Misc/`, `Other/`, `Stuff/`, `New Folder/` | Decide the real L1 arena or L2 outcome |
| **Deep nesting (6+ levels)** | You're mixing cognitive phases in one branch | Flatten by separating L1/L2/L3 concerns |
| **Date-only folders at L1** | `2024/`, `2025/` at the top level | Dates are L2 or L3 — put the domain first |
| **Duplicate file names** | Same file in two places | Pick the owner, link from elsewhere |
| **Everything in one folder** | 100+ files in one directory | Split into L2 outcomes or L3 artifact types |
| **Ambiguous names** | `Documents/`, `Files/`, `Data/` | Replace with specific arena names |
| **Mixing layers** | `Finance/Invoice-2025-03.pdf` (skipped L2) | Add the outcome: `Finance/Accounts-Payable/Invoice-2025-03.pdf` |

---

## Anti-Patterns

| Anti-Pattern | What It Looks Like | Why It Fails |
|--------------|-------------------|--------------|
| **The Filing Cabinet** | Rigid categories that don't match how you think | Forces you to memorize arbitrary locations |
| **The Chronological Dump** | Everything sorted by date first | Dates don't help you find things by topic |
| **The Mirror** | Folder structure mirrors org chart exactly | Org charts change; your files don't reorganize themselves |
| **The Perfectionist** | Scattered empty folders with no consistent template and no content anywhere | Random empties create noise without communicating intent. (Note: consistent templates with progressive filling are **scaffolding**, not perfectionism — see *Scaffolding Evaluation*) |
| **The Flat Earth** | Everything in one giant folder with search | Works until search fails or context is lost |

---

## Exceptions: When to Break the Rules

Every rule in this framework has legitimate exceptions. The key: **break rules consciously, not by accident.**

### Date-First at L1

| Exception | Example | Why It's OK |
|-----------|---------|-------------|
| **Tax/legal compliance** | `2024-Tax-Returns/`, `2025-Tax-Returns/` | Legal requirements are inherently annual. The year IS the domain |
| **Academic semesters** | `Fall-2025/`, `Spring-2026/` | Each semester is a self-contained world |

**Test:** Is the time period genuinely the primary organizing principle, not just a habit?

### More Than 12 L1 Arenas

| Exception | Example | Why It's OK |
|-----------|---------|-------------|
| **Client-based businesses** | One L1 per major client | Each client is a genuinely separate world |
| **Multi-property management** | One L1 per property | Physical locations are natural arenas |

**Test:** Would merging any two arenas force you to constantly context-switch within a single folder?

### Flat L3 With Many Files

| Exception | Example | Why It's OK |
|-----------|---------|-------------|
| **Photo libraries** | 200+ photos in a dated event folder | You're browsing visually, not reading names |
| **Log files** | Chronological logs in a single folder | Sorted by date, accessed by recency |

**Test:** Can you still find what you need without subgrouping? If search or date-sorting is sufficient, don't force artificial categories.

### General Rule for Exceptions

> If you're breaking a rule, write down *why* in a `_README.md` at that level. If you can't articulate the reason, you shouldn't break the rule.

---

## Quality Checks

Before considering a drive "organized," verify these rules hold.

### Structure Checks

| Check | Pass Condition |
|-------|---------------|
| Every L1 arena has at least one active L2 outcome | No empty arenas cluttering the top level |
| No L2 folder tries to be both active work AND reference lookup | Split into separate doing/knowing folders |
| Every active L2 folder has artifacts, subfolders, or is part of a consistent template scaffold | No scattered one-off empty folders |
| No L3 artifact is duplicated across arenas | One owner, shortcuts from elsewhere |
| `_Unsorted/` has fewer than 20 items | You're keeping up with weekly sorting |

### Naming Checks

| Check | Pass Condition |
|-------|---------------|
| L1 names are nouns (arenas) | No verbs, dates, or abbreviations at the top level |
| L2 names signal intent (verbs, outcomes, or subject categories) | Reading the name tells you what happens here |
| L3 names are specific enough to find via search | No `Document.pdf` or `Notes.txt` |
| Consistent casing within each level | Not mixing `Title-Case` and `lowercase` at the same depth |
| Naming matches context | Spaces OK on personal drives; hyphens/underscores required in code projects |

### Boundary Checks

| Check | Pass Condition |
|-------|---------------|
| Active folders contain work, not reference material | Reference has its own folder |
| Reference folders contain lookup material, not active projects | Work has its own folder |
| `_Shared/` contains only genuinely cross-functional items | Not a dumping ground |
| Archive folders live within their L1 arena | Not a top-level `Archive/` that loses context |

---

## Applying the Framework

### Step 1: Audit Current State

List your top-level folders. For each one, ask:
- Is this clearly an L1 arena (a domain of activity)?
- Or is it something else? (date, project, catch-all)

### Step 2: Design L1 Arenas

Write down the 5-8 major domains of your life or work. These become your L1 folders. They should feel natural and stable.

### Step 3: Design L2 Outcomes Per Arena

For each arena, list the 3-6 things you actually do there. These are your L2 folders.

### Step 4: Let L3 Emerge

Don't pre-create L3 structure. Let it emerge as you actually produce artifacts. Structure follows work.

### Step 5: Migrate Gradually

Move files in batches. Start with the arena you use most. Don't try to reorganize everything at once. For detailed migration steps, see `references/migration-guide.md`.

---

## References

- `references/naming-patterns.md` — Detailed naming examples and conventions for each layer
- `references/migration-guide.md` — Step-by-step guide for reorganizing existing messy drives
- `references/transit-folders.md` — Transit folder conventions, lifecycle, and staleness signals
- `references/lifecycle.md` — File lifecycle rules, archive strategy, and maintenance cadence

## Assets

- `assets/home-drive-template.md` — Starter structure for a personal home drive
- `assets/work-drive-template.md` — Starter structure for a professional work drive

## Scripts

- `scripts/audit_structure.py` — Scan a folder tree and report L1/L2/L3 issues (catch-alls, depth, naming)
