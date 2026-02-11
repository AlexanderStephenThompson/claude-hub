# File Lifecycle and Maintenance

How files move through stages, archive strategy, and maintenance cadence.

---

## File Lifecycle

Files move through stages. Knowing the stage tells you where the file belongs right now.

```
Created -> Active -> Completed -> Archived -> (Deleted)
```

| Stage | Where It Lives | What Happens |
|-------|---------------|--------------|
| **Created** | L2 outcome folder (or `_Unsorted/` if unknown) | New file, just produced or received |
| **Active** | L2 outcome folder | Being worked on, edited, referenced regularly |
| **Completed** | Stays in L2 outcome folder | Done but still relevant to the current project |
| **Archived** | `_Archive/` within the L2 outcome | Project is finished, file preserved for lookup |
| **Deleted** | Gone | Only when legally/contractually safe and truly worthless |

### Lifecycle Rules

- **Don't skip stages.** A file goes Active -> Completed -> Archived, not Active -> Deleted.
- **Completed is not Archived.** A finished deliverable stays in the active folder until the *project* is done. Then the whole outcome folder moves to `_Archive/`.
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
