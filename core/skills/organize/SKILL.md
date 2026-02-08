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

Some naming rules depend on where the folders live. Apply the right set:

| Context | Spaces OK? | Hyphens/underscores required? | Why |
|---------|-----------|------------------------------|-----|
| **Personal/creative drives** | Yes | No — readability matters more | `Winter Lodge Restaurant` is easier to read than `Winter-Lodge-Restaurant`. OS handles spaces natively |
| **Code projects & websites** | No | Yes — use hyphens or underscores | Spaces break scripts, URLs, CLI commands, and version control |
| **Shared/team drives** | Depends | Match team convention | Consistency within the team matters more than any single rule |

**Don't apply code conventions to personal drives, or personal conventions to codebases.** Match the rules to the environment.

### File Name Semantics

Beyond folder names, individual **file names** should communicate what the file contains at a glance. A good file name answers "what is this?" without opening it. A bad file name forces you to open, preview, or remember.

#### Non-Semantic Names (Flag These)

| Pattern | Example | Problem |
|---------|---------|---------|
| **Hash / ID strings** | `50bacb7db3dbda5ba74ce3b7e51aa624.jpg` | Tells you nothing. Could be anything |
| **Generic defaults** | `Untitled.png`, `images.jfif`, `download (1).jfif` | Indistinguishable from every other default-named file |
| **Screenshot auto-names** | `Screenshot (163).png` | The number is meaningless — what's in the screenshot? |
| **Bare timestamps** | `photo_2021-03-15_09-25-00.jpg` | When it was taken, not what it shows |
| **AI generation prompts as filenames** | `alexandersthompson_UI_design_of_a_Forest_Exploration_Game_Landi_d400767c...png` | The prompt is useful context but too long for a filename. Truncated hashes make it worse |
| **Platform export names** | `IMG_20200417_180854_994.jpg`, `1568483796.pastelcore_noah_hippo.png` | Camera roll IDs or platform metadata, not content descriptors |
| **URL slugs** | `most-beautiful-places-in-the-world-pamukkale.jpeg` | SEO text from the source website, not your description |

#### What Makes a Good File Name

| Principle | Example |
|-----------|---------|
| **Describes the content** | `ice-cave-interior.jpg` not `89381.jpg` |
| **Uses your vocabulary** | `bear-head-front-view.png` not `head-01.jpg` |
| **Distinguishes from siblings** | `moraine-lake-sunrise.jpg` and `crater-lake-aerial.jpg` not `image1.jpg` and `image2.jpg` |
| **Keeps reasonable length** | 3-6 words. Long enough to identify, short enough to scan |
| **Preserves useful metadata as a suffix** | `desert-canyon-ref_antelope-canyon.jpg` — your description first, source attribution after |

#### When to Flag vs. When to Ignore

Not every non-semantic filename is worth flagging. Apply context:

| Situation | Action |
|-----------|--------|
| **Files in a curated, final-destination folder** | Flag non-semantic names — these are artifacts you'll revisit |
| **Files in `_Ideas/` or reference/inspiration folders** | Flag if the folder has 10+ files and they're all hashes/timestamps — batch renaming would help navigation |
| **Files inside a transit folder (`~`)** | **Ignore** — transit content is WIP (see *Transit Folder Analysis Scope*) |
| **Files in a scaffolding placeholder** | Ignore — the placeholder will be renamed when content arrives |
| **A handful of files with obvious visual context** (e.g., 3 photos in a character folder) | Low priority — if you can visually browse them, names matter less |

#### Suggesting Better Names

When flagging non-semantic names, suggest replacements based on:
1. **The folder context** — a file in `Arctic/Locations/Natural/_Ideas/` is probably a nature/landscape reference
2. **The file's visible content** — if you can read the image, describe what you see
3. **Sibling files** — if named files exist alongside unnamed ones, match the pattern
4. **Don't require perfection** — `snowy-village.jpg` is better than `241076.jpg`, even if it's not a complete description

---

## Decision Guide: Where Does This File Go?

When you have a file and don't know where to put it, ask these questions in order. Stop at the first "yes."

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

Folders serve two different cognitive purposes. Mixing them creates confusion.

| Folder type | Purpose | Brain mode | Examples |
|-------------|---------|------------|---------|
| **Active (doing)** | Work in progress, projects, deliverables | "I'm producing something" | `Launch/`, `Ship/`, `Hire/`, `Campaign/` |
| **Reference (knowing)** | Lookup material, policies, standards, guides | "I'm finding an answer" | `Reference/`, `Policies/`, `Standards/`, `Templates/` |

**The test:** "Am I opening this folder to *do work* or to *look something up*?"

- If both → split into two L2 folders. The active folder holds the work and links to the reference folder for lookup.
- Active folders archive when the work is done. Reference folders persist.

---

## Overlap Resolution

When a file feels like it belongs in two places, use this pattern:

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

Some folders are infrastructure, not content. They support the system itself rather than holding domain-specific work. These use a **leading underscore** to signal "this is a system folder — don't file your work here."

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

Some folders hold content that is **actively being moved** from one location to another. This is distinct from `_Unsorted/` (destination unknown) — transit folders have a known destination and an in-progress migration. These use a **leading tilde** (`~`) to signal "this content is in transit — it has a destination and shouldn't live here permanently."

| Transit Folder | Purpose | Example |
|----------------|---------|---------|
| `~Transfer/` | Staging area for content being moved into a project | Raw assets being processed into final structure |
| `~Import/` | Incoming content being integrated from an external source | Files from a collaborator being sorted into the project |
| `~Migrate/` | Content moving between organizational structures | Files being reorganized from an old hierarchy to a new one |

### How Transit Differs from System Folders

| Prefix | Meaning | Duration | Destination |
|--------|---------|----------|-------------|
| `_` (underscore) | System infrastructure — supports the structure | Permanent | N/A — it IS the destination |
| `~` (tilde) | Content in active transit | Temporary | Known — the content has a final home |

`_Unsorted/` means "I don't know where this goes yet." `~Transfer/` means "I know exactly where this goes — I'm actively moving it."

### Naming Convention

Transit folders use **two signals** to communicate their status: a **date suffix** on the folder name and a **`_STATUS.md`** file inside.

#### Date Suffix

Append the year-month the transfer was started or last actively worked on:

```
~Transfer 2026-02/          ← started or last active February 2026
~Import 2025-11/            ← started or last active November 2025
```

The date provides at-a-glance recency. When you return to a transit folder after time away, update the date suffix to the current month to signal "I'm back on this."

#### _STATUS.md

Every transit folder that can't be completed in a single session should contain a `_STATUS.md` file:

```markdown
# Transfer Status

**Destination:** Implement/Location building/
**Started:** 2026-01
**Last active:** 2026-02-07

## What's being transferred
Updated location development reference material — interior design
principles, room layouts, architectural details.

## What's left
- [ ] Interior/Lighting — needs curating
- [ ] Interior/Floor Plans — destination empty, source has drafts
- [x] Interior/Details — done
- [x] Exterior/ — done

## Notes
~ Floor Space Design and ~Anthropometrics are still being refined
before moving to destination.
```

The `_STATUS.md` is the definitive answer to "is this active or stale?" If the file exists and describes remaining work with recent dates, the transfer is active. If the file is missing or outdated, the transfer needs attention.

### Rules for Transit Folders

| Rule | Rationale |
|------|-----------|
| **Always tilde-prefixed** | Visually distinct from both content folders and `_` system folders |
| **Include a date suffix** | `~Transfer 2026-02/` — at-a-glance recency without opening the folder |
| **Include `_STATUS.md` for multi-session transfers** | Documents what's moving, where, and what's left. The single source of truth for transfer state |
| **Transit folders are temporary** | They exist only while migration is in progress. When the transfer is complete, delete the source `~` folder |
| **Don't nest transit folders at the top level** | `~Transfer/~Import/` is a red flag — each transit operation gets one `~` folder |
| **`~` subfolders within a destination are OK** | A `~`-prefixed subfolder inside a destination folder means "this area is still receiving content." Remove the `~` when that subfolder's transfer is complete |
| **Parallel structure is a good sign** | If the transit folder mirrors the destination's structure, the transfer is well-organized. This is correct, not a duplication problem |

### Where `~` Can Appear

| Location | Meaning | Example |
|----------|---------|---------|
| **Top-level transit folder** | "This entire folder is a staging area" | `~Transfer 2026-02/` |
| **Subfolder inside a transit folder** | Redundant but harmless — everything inside `~` is already in transit | `~Transfer/~Drafts/` |
| **Subfolder inside a destination** | "This specific area is still receiving content from a transit source" | `Implement/~Floor Space Design/` |
| **A destination folder itself** | **Never.** The destination is the final home — it should have a normal name | ~~`~Implement/`~~ |

### Transit Folder Lifecycle

```
Created → Active → Draining → Empty → Deleted
```

| Stage | What It Looks Like | Action |
|-------|-------------------|--------|
| **Created** | `~Transfer YYYY-MM/` appears with raw content and a `_STATUS.md` | Begin sorting content into its destination |
| **Active** | Files are being moved; `_STATUS.md` shows remaining work | Continue processing. Update the date suffix if a month boundary passes |
| **Draining** | Most content moved, only stragglers remain. `_STATUS.md` mostly checked off | Prioritize finishing — don't let it stall |
| **Empty** | All content has been moved to its final home | Delete `~Transfer/` immediately. Remove any `~` prefixes from destination subfolders |
| **Stale** | See staleness signals below | Decide: finish the transfer or abandon and delete |

### Staleness Signals

A transit folder has gone stale when **multiple** of these are true:

| Signal | What It Means |
|--------|--------------|
| **`_STATUS.md` is missing or has no recent date** | No one is tracking the transfer |
| **Date suffix is 3+ months old and hasn't been updated** | The folder was created or last touched a quarter ago |
| **No files have been added, removed, or modified recently** | No actual transfer activity is happening |
| **Temporary/lock files remain** (`.tmp`, `~$` files) | The transfer was interrupted and never resumed |

**Important:** These signals must be evaluated together. A single signal is not enough:

- Parallel structure between source and destination is **not** a staleness signal — it means the transfer is organized.
- A transit folder that's months old but has a current `_STATUS.md` with remaining work is **active, not stale**.
- A transit folder with no `_STATUS.md` and no recent file changes **is** likely stale, regardless of how the structure looks.

### Transit Folder Analysis Scope

When auditing or analyzing a folder structure, **do not diagnose the internal contents of transit folders.** Transit folders are work-in-progress by definition — their contents will be messy, duplicated, inconsistently named, and structurally imperfect. That's the nature of an active transfer. Flagging issues inside a `~` folder creates noise that obscures the real problems in the settled structure.

**What to evaluate for transit folders:**

| Evaluate | Skip |
|----------|------|
| Does the `~` folder exist? | Folder structure inside `~` |
| Does it have a `_STATUS.md`? | Naming quality of files inside `~` |
| Is the `_STATUS.md` current? | Depth of nesting inside `~` |
| Does it have a date suffix? | Duplication between `~` source and destination |
| Is it active or stale? (use Staleness Signals) | Empty folders inside `~` |
| Is the `~` prefix used at a destination? (it shouldn't be) | Overpopulation inside `~` |

**Report transit folders as a status table** — active, stale, or missing conventions — and move on. Trust the `_STATUS.md` as the source of truth for transfer progress.

> The user already knows the transit folder is messy. That's why it's marked with `~`. Analyze the structure they've *committed to*, not the staging area they're still working through.

---

## File Lifecycle

Files move through stages. Knowing the stage tells you where the file belongs right now.

```
Created → Active → Completed → Archived → (Deleted)
```

| Stage | Where It Lives | What Happens |
|-------|---------------|--------------|
| **Created** | L2 outcome folder (or `_Unsorted/` if unknown) | New file, just produced or received |
| **Active** | L2 outcome folder | Being worked on, edited, referenced regularly |
| **Completed** | Stays in L2 outcome folder | Done but still relevant to the current project |
| **Archived** | `_Archive/` within the L2 outcome | Project is finished, file preserved for lookup |
| **Deleted** | Gone | Only when legally/contractually safe and truly worthless |

### Lifecycle Rules

- **Don't skip stages.** A file goes Active → Completed → Archived, not Active → Deleted.
- **Completed ≠ Archived.** A finished deliverable stays in the active folder until the *project* is done. Then the whole outcome folder moves to `_Archive/`.
- **Reference material doesn't follow this lifecycle.** It's persistent by nature — it lives in `Reference/` and stays there.
- **Default to keeping.** If you're unsure whether to delete, archive instead. You can always delete later; you can't un-delete.

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

## Adapting by Scale

| Scale | L1 Maps To | L2 Emphasis | Key Consideration |
|-------|-----------|-------------|-------------------|
| **Personal** (one person) | Life domains: `Work`, `Personal`, `Creative`, `Finance` | Lightweight — project names or simple outcomes | L3 is where most files live |
| **Team** (small group) | Functions: `Engineering`, `Design`, `Marketing`, `Operations` | Structured — processes, projects, time periods | Decide who owns each L1 arena |
| **Organization** (company) | Departments or business units | Enforced naming conventions across teams | Align access controls with L1 boundaries |

---

## Maintenance Cadence

Structure decays without regular upkeep. These reviews prevent entropy.

### Weekly (15 minutes)

| Task | Purpose |
|------|---------|
| Empty `_Unsorted/` | Sort every file into its L1/L2 home |
| Clear `Downloads/` | Move or delete everything in your downloads folder |
| Archive completed L2 outcomes | Move finished work to `_Archive/` |

### Monthly (30 minutes)

| Task | Purpose |
|------|---------|
| Review each L1 arena | Does it still reflect your actual domains? |
| Check L2 outcomes | Archive anything completed, remove empty folders |
| Review `_Shared/` | Move anything that now has a clear owner |
| Check naming consistency | Fix any drift in casing or conventions |

### Quarterly (1 hour)

| Task | Purpose |
|------|---------|
| Full L1 audit | Add or merge arenas if life/work has changed |
| Count items per folder | Flag anything over the max thresholds |
| Access review (shared drives) | Do permissions still match L1 boundaries? |
| Run `audit_structure.py` | Get a machine-readable health check |

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
| **The Perfectionist** | Scattered empty folders with no consistent template and no content anywhere. One-off "for someday" folders that serve no structural purpose | Random empties create noise without communicating intent. (Note: consistent templates with progressive filling are **scaffolding**, not perfectionism — see *Scaffolding Evaluation*) |
| **The Flat Earth** | Everything in one giant folder with search | Works until search fails or context is lost |

---

## Exceptions: When to Break the Rules

Every rule in this framework has legitimate exceptions. The key: **break rules consciously, not by accident.**

### Date-First at L1

The rule says "no dates at L1." The exception:

| Exception | Example | Why It's OK |
|-----------|---------|-------------|
| **Tax/legal compliance** | `2024-Tax-Returns/`, `2025-Tax-Returns/` | Legal requirements are inherently annual. The year IS the domain |
| **Academic semesters** | `Fall-2025/`, `Spring-2026/` | Each semester is a self-contained world with its own classes and work |

**Test:** Is the time period genuinely the primary organizing principle, not just a habit?

### More Than 12 L1 Arenas

The rule says "5-8, max 12." The exception:

| Exception | Example | Why It's OK |
|-----------|---------|-------------|
| **Client-based businesses** | One L1 per major client | Each client is a genuinely separate world with its own context |
| **Multi-property management** | One L1 per property | Physical locations are natural arenas |

**Test:** Would merging any two arenas force you to constantly context-switch within a single folder?

### Flat L3 With Many Files

The rule says "max 30 items, then subgroup." The exception:

| Exception | Example | Why It's OK |
|-----------|---------|-------------|
| **Photo libraries** | 200+ photos in a dated event folder | You're browsing visually, not reading names |
| **Log files** | Chronological logs in a single folder | Sorted by date, accessed by recency |

**Test:** Can you still find what you need without subgrouping? If search or date-sorting is sufficient, don't force artificial categories.

### General Rule for Exceptions

> If you're breaking a rule, write down *why* in a `_README.md` at that level. If you can't articulate the reason, you shouldn't break the rule.

---

## Quality Checks

Before considering a drive "organized," verify these rules hold. These are the structural equivalent of unit tests — if any fail, there's a boundary violation somewhere.

### Structure Checks

| Check | Pass Condition |
|-------|---------------|
| Every L1 arena has at least one active L2 outcome | No empty arenas cluttering the top level |
| No L2 folder tries to be both active work AND reference lookup | Split into separate doing/knowing folders |
| Every active L2 folder has artifacts, subfolders, or is part of a consistent template scaffold | No scattered one-off empty folders. Consistent scaffolding with progressive filling is OK (see *Scaffolding Evaluation*) |
| No L3 artifact is duplicated across arenas | One owner, shortcuts from elsewhere |
| `_Unsorted/` has fewer than 20 items | You're keeping up with weekly sorting |

### Naming Checks

| Check | Pass Condition |
|-------|---------------|
| L1 names are nouns (arenas) | No verbs, dates, or abbreviations at the top level |
| L2 names signal intent (verbs, outcomes, or subject categories) | Reading the name tells you what happens here or what type of thing lives here |
| L3 names are specific enough to find via search | No `Document.pdf` or `Notes.txt` |
| Consistent casing within each level | Not mixing `Title-Case` and `lowercase` at the same depth |
| Naming matches context | Spaces OK on personal drives; hyphens/underscores required in code projects (see Context-Sensitive Naming Rules) |

### Boundary Checks

| Check | Pass Condition |
|-------|---------------|
| Active folders contain work, not reference material | Reference has its own folder |
| Reference folders contain lookup material, not active projects | Work has its own folder |
| `_Shared/` contains only genuinely cross-functional items | Not a dumping ground for "I don't know where this goes" |
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

## Assets

- `assets/home-drive-template.md` — Starter structure for a personal home drive
- `assets/work-drive-template.md` — Starter structure for a professional work drive

## Scripts

- `scripts/audit_structure.py` — Scan a folder tree and report L1/L2/L3 issues (catch-alls, depth, naming)
