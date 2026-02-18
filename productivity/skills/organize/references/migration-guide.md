# Migration Guide

How to reorganize an existing messy drive into the L1/L2/L3 framework without losing anything.

---

## Principles

1. **Never delete during migration** — move, don't destroy
2. **Migrate in phases** — don't try to reorganize everything at once
3. **Start with the arena you use most** — build momentum with high-impact changes
4. **Keep a `_Unsorted/` folder** — temporary holding pen for files that don't have a home yet
5. **Set a deadline for `_Unsorted/`** — review it weekly, empty it monthly

---

## Phase 1: Audit the Current State

Before moving anything, take inventory.

### Step 1: List Top-Level Folders

Write down every top-level folder. For each one, classify it:

| Current Folder | Classification | Notes |
|----------------|---------------|-------|
| `Documents/` | Catch-all | Contains everything, no clear domain |
| `2024/` | Date-based | Should be L2 or L3, not L1 |
| `Work/` | Valid L1 arena | Keep, but audit contents |
| `New Folder (3)/` | Junk | Delete or sort contents |
| `Photos/` | Valid L1 arena | Rename to `Media` if it fits |

### Step 2: Identify Your Real Arenas

Ask yourself: "What are the 5-8 major domains of my life/work?"

Write them down. These become your L1 folders.

### Step 3: Count Files Per Folder

Folders with 100+ files need immediate L2 structure. Folders with 0 files are empty promises — delete them.

---

## Phase 2: Build the New Skeleton

Create the L1 and L2 structure before moving any files.

```
New-Drive/
├── [Your L1 arenas]
│   ├── [Your L2 outcomes]
│   └── _Archive/
└── _Unsorted/          # Temporary: for files with no clear home
```

**Do NOT create L3 structure yet.** Let it emerge as you move files.

---

## Phase 3: Migrate One Arena at a Time

### Pick the highest-impact arena first

Choose the one you access daily. Getting it organized gives you the biggest productivity boost and builds confidence in the system.

### Move files in batches

For each batch of files:

1. **Ask L1:** "What domain does this relate to?" → Move to that arena
2. **Ask L2:** "What activity produced this?" → Move to that outcome folder
3. **If unsure:** Move to `_Unsorted/` and move on — don't get stuck

### Handle ambiguous files

| Situation | Action |
|-----------|--------|
| File could go in two arenas | Pick the primary owner, note the secondary |
| File doesn't fit any arena | It might signal a missing L1 — add one if needed |
| File is outdated but not deletable | Move to the relevant arena's `_Archive/` |
| File is truly junk | Move to `_To-Delete/` — review in 30 days, then delete |

---

## Phase 4: Clean Up Legacy Structures

### Flattening Deep Nesting

Before:
```
Documents/
└── Work/
    └── Projects/
        └── 2024/
            └── Q3/
                └── Client-Acme/
                    └── Deliverables/
                        └── Final/
                            └── Report.pdf
```

After:
```
Work/
└── Projects/
    └── Acme-Q3-2024/
        └── Report-Final.pdf
```

**Rule:** If the path has more than 4 levels, flatten by combining context into fewer, more descriptive folder names.

### Merging Duplicate Folders

Common duplicates:
- `Documents/` and `My Documents/`
- `Work/` and `Job/` and `Professional/`
- `Photos/` and `Pictures/` and `Images/`

**Resolution:** Pick one name. Move everything from the duplicates into it. Delete the empty duplicates.

### Dissolving Catch-All Folders

For folders like `Misc/`, `Other/`, `Stuff/`:

1. Open the folder
2. For each file, ask the L1/L2 questions
3. Move each file to its real home
4. Delete the empty catch-all

---

## Phase 5: Establish Ongoing Habits

### The 2-Minute Rule

When saving a new file: if you can put it in the right place in under 2 minutes, do it now. If not, drop it in `_Unsorted/` and sort it during your weekly review.

### Weekly Review (15 minutes)

1. Empty `_Unsorted/` — sort every file into its L1/L2 home
2. Check `Downloads/` — move or delete everything
3. Archive completed L2 outcomes — move to `_Archive/`

### Monthly Review (30 minutes)

1. Check each L1 arena — does it still reflect your actual domains?
2. Review L2 outcomes — archive anything completed
3. Delete `_To-Delete/` contents older than 30 days

### Quarterly Review (1 hour)

1. Full L1 audit — add or merge arenas if life/work has changed
2. Naming convention check — is everything still consistent?
3. Access review (shared drives) — do permissions still match L1 boundaries?

---

## Common Migration Scenarios

### Scenario: "Everything is in Documents/"

1. Create L1 arenas alongside `Documents/`
2. Move files from `Documents/` to their real arenas
3. When `Documents/` is empty, delete it
4. Anything remaining goes to `_Unsorted/`

### Scenario: "Everything is sorted by year"

1. Create L1 arenas (domain-first, not date-first)
2. For each year folder, distribute files into arenas
3. Use dates at L2 or L3 where chronology matters
4. The year folder structure dissolves naturally

### Scenario: "Shared drive with no conventions"

1. Propose L1 arenas to the team (align with departments or functions)
2. Assign an owner per L1 arena
3. Each owner designs their L2 outcomes
4. Migrate one arena at a time, starting with the most-used
5. Agree on naming conventions before starting (see `references/naming-patterns.md`)

### Scenario: "Business drive with department folders"

The Fulfill/Maintain/Grow model often replaces scattered department folders:

1. Map existing folders to the three mindsets:
   - `Sales/`, `Marketing/`, `Outreach/` → **Grow/** (Attract + Convert)
   - `Finance/`, `Legal/`, `HR/`, `IT/`, `Admin/` → **Maintain/**
   - `Projects/`, `Clients/`, `Production/`, `Deliverables/` → **Fulfill/**
2. Create the three L1 arenas with their L2 structure (see `assets/work-drive-template.md`)
3. Move files from each old department folder into the matching mindset arena
4. Former department names often become L2 folders: `Marketing/` becomes `Grow/Attract/`, `Finance/` becomes `Maintain/Finance/`
5. Delete empty department folders once drained

**The mindset test:** For any file, ask "is this about delivering, running, or growing?" That answers L1 immediately.

### Scenario: "I have 10,000+ files"

1. Don't try to sort everything manually
2. Start with L1 arenas and move recent files (last 6 months)
3. Move older files to `_Archive/` within each arena
4. Sort archived files only when you actually need them
5. Anything truly old and untouched can stay in a legacy `_Pre-Migration/` folder
