---
name: organization
description: >
  Folder organization system for computer drives using the L1/L2/L3 cognitive-phase
  framework. Applies to home drives, work drives, and shared team drives. Use when
  designing folder hierarchies, reorganizing existing structures, or deciding where
  files belong. Not code-specific — this is general-purpose digital organization.
user-invocable: false
---

# Organization Skill

**Version:** 1.0
**Source:** L1/L2/L3 Cognitive-Phase Framework

> Folder structure should match how your brain navigates, not how a database stores records.

---

## North Star

**Goal:** You always know where you are and what you're looking for.

**Definition:** Any person (or AI) should be able to find a file in 3 decisions or fewer, without guessing which folder it's in.

**Smell:** If you open a folder and feel lost, the structure has failed.

---

## The L1/L2/L3 Framework

Folder navigation is three cognitive phases. Each phase answers a different question, and folder names should match the type of thinking you're doing at that level.

### L1: Context (Nouns / Arenas)

**Question:** "Where am I operating?"

**Brain mode:** Wayfinding. You're orienting yourself to a domain before doing any work.

**Folder names are nouns** — broad arenas of activity:

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

### L2: Execution (Verbs / Outcomes)

**Question:** "What am I trying to accomplish?"

**Brain mode:** Targeting. You've picked an arena, now you're selecting an objective.

**Folder names are verbs or outcomes** — what work gets done here:

```
Marketing/
├── Launch/
├── Grow/
├── Campaign/
├── Brand/
└── Analyze/
```

**Test:** You're in L2 as long as you're narrowing the objective or work mode. L2 completes when you start hunting for a specific artifact.

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
| No spaces in folder names | Use hyphens or underscores. Spaces break scripts and URLs |
| No special characters | Stick to `A-Z`, `0-9`, `-`, `_` |
| Consistent casing | Pick Title-Case, kebab-case, or snake_case per level and stick with it |
| Front-load the distinguishing word | `Budget-2025` not `2025-Budget` (unless sorting by date matters more) |

---

## Decision Guide: Where Does This File Go?

When you have a file and don't know where to put it:

```
1. What domain does this relate to?         → That's your L1 folder
2. What activity or goal produced this?      → That's your L2 folder
3. Is this the actual artifact?              → Put it at L3

If you can't answer #1, the file may need a new L1 arena.
If you can't answer #2, the file may belong in a general "Resources"
   or "Reference" subfolder within L1.
If a file could go in two places, pick the primary owner and
   shortcut/link from the secondary.
```

### The "Two Places" Problem

Files sometimes feel like they belong in two arenas. Resolution:

| Strategy | When to Use |
|----------|-------------|
| **Pick the primary owner** | Default. Most files have a natural home |
| **Use shortcuts/links** | When two teams genuinely need the same file |
| **Use a shared space** | Cross-functional projects with no clear owner |
| **Never duplicate** | Two copies means one gets stale |

---

## Common Arena Templates

See `assets/` for full templates:

- `assets/home-drive-template.md` — Personal computer or home drive
- `assets/work-drive-template.md` — Professional or team work drive

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

## Adapting by Scale

### Personal Drive (One Person)

- L1 arenas map to life domains: `Work`, `Personal`, `Creative`, `Finance`, `Learning`
- L2 can be lightweight — sometimes just a project name
- L3 is where most files live

### Team Drive (Small Team)

- L1 arenas map to functions: `Engineering`, `Design`, `Marketing`, `Operations`
- L2 becomes more structured — processes, projects, time periods
- Shared ownership rules matter — decide who owns each L1 arena

### Organization Drive (Company)

- L1 arenas map to departments or business units
- L2 needs naming conventions enforced across teams
- Consider access controls aligned with L1 boundaries
- Archive strategy: move completed L2 folders to `_Archive/` within their L1

---

## Archive Strategy

Completed work shouldn't clutter active navigation but should remain findable.

```
Marketing/
├── Campaign/                    # Active L2
│   ├── Q1-2025-Launch/         # Current
│   └── _Archive/               # Completed campaigns
│       ├── Q4-2024-Holiday/
│       └── Q3-2024-Rebrand/
└── ...
```

| Rule | Rationale |
|------|-----------|
| Prefix with `_Archive` | Sorts to top/bottom predictably, visually distinct |
| Archive at L2 level | Keep the L1 arena clean, preserve L2 context |
| Never delete unless required | Storage is cheap, regret is expensive |

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

## Anti-Patterns

| Anti-Pattern | What It Looks Like | Why It Fails |
|--------------|-------------------|--------------|
| **The Filing Cabinet** | Rigid categories that don't match how you think | Forces you to memorize arbitrary locations |
| **The Chronological Dump** | Everything sorted by date first | Dates don't help you find things by topic |
| **The Mirror** | Folder structure mirrors org chart exactly | Org charts change; your files don't reorganize themselves |
| **The Perfectionist** | 20 empty folders "for someday" | Empty structure creates noise and false promises |
| **The Flat Earth** | Everything in one giant folder with search | Works until search fails or context is lost |

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

Move files in batches. Start with the arena you use most. Don't try to reorganize everything at once.
