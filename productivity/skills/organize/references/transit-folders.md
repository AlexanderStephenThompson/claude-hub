# Transit Folders

Folders that hold content **actively being moved** from one location to another. Distinct from `_Unsorted/` (destination unknown) — transit folders have a known destination and an in-progress migration. They use a **leading tilde** (`~`) to signal "this content is in transit."

| Transit Folder | Purpose | Example |
|----------------|---------|---------|
| `~Transfer/` | Staging area for content being moved into a project | Raw assets being processed into final structure |
| `~Import/` | Incoming content being integrated from an external source | Files from a collaborator being sorted into the project |
| `~Migrate/` | Content moving between organizational structures | Files being reorganized from an old hierarchy to a new one |

---

## How Transit Differs from System Folders

| Prefix | Meaning | Duration | Destination |
|--------|---------|----------|-------------|
| `_` (underscore) | System infrastructure — supports the structure | Permanent | N/A — it IS the destination |
| `~` (tilde) | Content in active transit | Temporary | Known — the content has a final home |

`_Unsorted/` means "I don't know where this goes yet." `~Transfer/` means "I know exactly where this goes — I'm actively moving it."

---

## Naming Convention

Transit folders use **two signals** to communicate their status: a **date suffix** on the folder name and a **`_STATUS.md`** file inside.

### Date Suffix

Append the year-month the transfer was started or last actively worked on:

```
~Transfer 2026-02/          <- started or last active February 2026
~Import 2025-11/            <- started or last active November 2025
```

The date provides at-a-glance recency. When you return to a transit folder after time away, update the date suffix to the current month to signal "I'm back on this."

### _STATUS.md

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

---

## Rules for Transit Folders

| Rule | Rationale |
|------|-----------|
| **Always tilde-prefixed** | Visually distinct from both content folders and `_` system folders |
| **Include a date suffix** | `~Transfer 2026-02/` — at-a-glance recency without opening the folder |
| **Include `_STATUS.md` for multi-session transfers** | Documents what's moving, where, and what's left. The single source of truth for transfer state |
| **Transit folders are temporary** | They exist only while migration is in progress. When the transfer is complete, delete the source `~` folder |
| **Don't nest transit folders at the top level** | `~Transfer/~Import/` is a red flag — each transit operation gets one `~` folder |
| **`~` subfolders within a destination are OK** | A `~`-prefixed subfolder inside a destination folder means "this area is still receiving content." Remove the `~` when that subfolder's transfer is complete |
| **Parallel structure is a good sign** | If the transit folder mirrors the destination's structure, the transfer is well-organized. This is correct, not a duplication problem |

---

## Where `~` Can Appear

| Location | Meaning | Example |
|----------|---------|---------|
| **Top-level transit folder** | "This entire folder is a staging area" | `~Transfer 2026-02/` |
| **Subfolder inside a transit folder** | Redundant but harmless — everything inside `~` is already in transit | `~Transfer/~Drafts/` |
| **Subfolder inside a destination** | "This specific area is still receiving content from a transit source" | `Implement/~Floor Space Design/` |
| **A destination folder itself** | **Never.** The destination is the final home — it should have a normal name | ~~`~Implement/`~~ |

---

## Transit Folder Lifecycle

```
Created -> Active -> Draining -> Empty -> Deleted
```

| Stage | What It Looks Like | Action |
|-------|-------------------|--------|
| **Created** | `~Transfer YYYY-MM/` appears with raw content and a `_STATUS.md` | Begin sorting content into its destination |
| **Active** | Files are being moved; `_STATUS.md` shows remaining work | Continue processing. Update the date suffix if a month boundary passes |
| **Draining** | Most content moved, only stragglers remain. `_STATUS.md` mostly checked off | Prioritize finishing — don't let it stall |
| **Empty** | All content has been moved to its final home | Delete `~Transfer/` immediately. Remove any `~` prefixes from destination subfolders |
| **Stale** | See staleness signals below | Decide: finish the transfer or abandon and delete |

---

## Staleness Signals

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

---

## Transit Folder Analysis Scope

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
