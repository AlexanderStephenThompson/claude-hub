# {Module Name}

> {One-line description of what this module does}

**Program:** [{program}](../)
**Status:** Planned | In Progress | Complete <!-- STATUS:planned -->
**Progress:** 0/{N} features <!-- PROGRESS:0/{N} -->

---

## Overview

[2-3 sentences describing what this module enables and why it matters]

**Key capabilities:**

- **[Capability name]** — [what it does]
- **[Capability name]** — [what it does]
- **[Capability name]** — [what it does]

---

## Features

| Feature | Description | Milestone | Status |
|---------|-------------|-----------|--------|
| [{feature-name}](./{feature-name}.md) | {one-line} | v{X.Y.Z} | ⏳ Planned <!-- STATUS:planned --> |

---

## Architecture

```
[ModuleName] (Module Root)
├── [Component Group]
│   ├── [Sub-component]
│   ├── [Sub-component]
│   └── [Sub-component]
├── [Component Group]
│   ├── [Sub-component]
│   └── [Sub-component]
└── [Component Group]
    ├── [Sub-component]
    └── [Sub-component]
```

---

## Data Models

```
[EntityName]
├── id: UUID
├── [field]: [type]
├── [field]: [type]
├── timestamps
│   ├── createdAt: DateTime
│   └── updatedAt: DateTime
└── relationships
    └── [relation]: [Entity]

[EntityName]
├── id: UUID
├── [field]: [type]
└── [field]: [type]
```

---

## Key Flows

### [Flow Name]

1. [Step] → [what happens]
2. [Step] → [what happens]
3. [Step] → [what happens]

### [Flow Name]

1. [Step] → [what happens]
2. [Step] → [what happens]

---

## Integration Points

| Connects To | Direction | Purpose |
|-------------|-----------|---------|
| [{module}](../{module}/_{module}.md) | → outbound | {why} |
| [{module}](../{module}/_{module}.md) | ← inbound | {why} |
| [{module}](../{module}/_{module}.md) | ↔ bidirectional | {why} |

---

## Technical Notes

[Implementation considerations, constraints, patterns used, performance notes]

---

## Open Questions

| Question | Impact | Status |
|----------|--------|--------|
| [Unresolved question?] | [What it affects] | Open |
