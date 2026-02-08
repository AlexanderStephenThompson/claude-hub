# Work Drive Template

A starting structure for a professional or team work drive using the L1/L2/L3 framework.

---

## L1: Arenas

```
Work-Drive/
├── Engineering/        # Product development, technical work
├── Design/             # UI/UX, brand, visual assets
├── Marketing/          # Campaigns, content, analytics
├── Operations/         # Processes, vendor management, logistics
├── Finance/            # Budgets, invoicing, reporting
├── People/             # HR, hiring, onboarding, culture
└── Leadership/         # Strategy, planning, board materials
```

---

## L2: Outcomes (per arena)

### Engineering/

```
Engineering/
├── Ship/               # Active product releases and features
├── Maintain/           # Bug fixes, tech debt, infrastructure
├── Plan/               # Roadmaps, RFCs, architecture decisions
├── Tooling/            # Dev environment, CI/CD, internal tools
└── Reference/          # Standards, runbooks, postmortems
```

### Design/

```
Design/
├── Brand/              # Logos, guidelines, typography, color
├── Product/            # UI mockups, prototypes, user flows
├── Research/           # User interviews, surveys, personas
└── Assets/             # Final exported assets, icon sets, templates
```

### Marketing/

```
Marketing/
├── Campaign/           # Organized by campaign name or quarter
├── Content/            # Blog posts, social media, newsletters
├── Analytics/          # Reports, dashboards, attribution
├── Brand/              # Messaging, positioning, press kits
└── Events/             # Conferences, webinars, sponsorships
```

### Operations/

```
Operations/
├── Processes/          # SOPs, workflows, checklists
├── Vendors/            # Contracts, evaluations, contacts
├── Facilities/         # Office management, equipment
└── Compliance/         # Audits, certifications, policies
```

### Finance/

```
Finance/
├── Budgeting/          # Annual budgets, forecasts, actuals
├── Invoicing/          # AR/AP, organized by vendor or client
├── Reporting/          # Monthly/quarterly financial reports
├── Payroll/            # Payroll records, benefits admin
└── Procurement/        # Purchase orders, approvals
```

### People/

```
People/
├── Hiring/             # Job descriptions, candidates, offers
├── Onboarding/         # New hire packets, training schedules
├── Performance/        # Reviews, feedback, development plans
├── Culture/            # Team events, surveys, recognition
└── Policies/           # Employee handbook, leave policies
```

### Leadership/

```
Leadership/
├── Strategy/           # Vision docs, OKRs, annual plans
├── Board/              # Board decks, meeting minutes
├── Partnerships/       # Strategic partnerships, M&A
└── Communications/     # All-hands materials, internal memos
```

---

## L3: Artifacts (examples)

```
Marketing/
└── Campaign/
    └── Q1-2025-Product-Launch/
        ├── Brief.docx
        ├── Timeline.xlsx
        ├── Budget.xlsx
        ├── Assets/
        │   ├── Hero-Banner-1200x628.png
        │   ├── Social-Square-1080x1080.png
        │   └── Email-Header-600x200.png
        ├── Copy/
        │   ├── Landing-Page-v2.docx
        │   └── Email-Sequence.docx
        └── Results/
            ├── Analytics-Report.pdf
            └── Retrospective.docx
```

---

## Shared Spaces

For cross-functional work that doesn't belong to a single arena:

```
Work-Drive/
├── ...arenas above...
└── _Shared/
    ├── Templates/          # Company-wide templates
    ├── Cross-Team/         # Multi-department projects
    └── Meeting-Notes/      # All-hands, leadership syncs
```

**Rule:** `_Shared/` is not a dumping ground. Every file there should have a clear reason it can't live in a single arena.

---

## Access Control Alignment

Map L1 arenas to access permissions:

| Arena | Access |
|-------|--------|
| Engineering/ | Engineering team |
| Finance/ | Finance team + leadership |
| People/ | HR team only (sensitive data) |
| Leadership/ | Leadership + board |
| _Shared/ | All staff |

This keeps permissions simple and predictable. If someone asks "who can see this?", the L1 folder answers the question.

---

## Customization Notes

- **Adapt arenas to your org** — a startup might combine several arenas; an enterprise might split them further.
- **Don't pre-build L3** — let teams create their own artifact structures within L2.
- **Archive completed projects** — use `_Archive/` within each L2 outcome.
- **Enforce naming conventions** — agree on casing and date formats across the org.
