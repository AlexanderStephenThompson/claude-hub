# Work Drive Template

A starting structure for a business or team work drive using the L1/L2/L3 framework, organized around three mindsets:

- **Fulfill** — What do we do? (Delivering the promise)
- **Maintain** — What keeps it running? (Money, tools, legal, systems, people)
- **Grow** — What moves it forward? (Strategy, product evolution, marketing, sales, retention)

---

## L1: Arenas

```
Business/
├── Fulfill/            # Delivering value — clients, projects, products
├── Maintain/           # Keeping it running — finance, legal, ops, people
└── Grow/               # Moving it forward — strategy, attract, convert, retain
```

---

## L2: Outcomes (per arena)

### Fulfill/

```
Fulfill/
├── Clients/
│   └── {Client Name}/
├── Projects/
├── Products & Services/
├── Deliverables/
└── Quality & Feedback/
```

### Maintain/

```
Maintain/
├── Finance/
│   ├── Invoices & Billing/
│   ├── Expenses & Receipts/
│   ├── Taxes/
│   │   └── {Year}/
│   ├── Payroll/
│   └── Reports & Statements/
├── Legal/
│   ├── Contracts & Agreements/
│   ├── Business Registration/
│   ├── Insurance/
│   └── Compliance/
├── People/
│   ├── Hiring/
│   ├── Onboarding/
│   ├── Policies & Handbooks/
│   ├── Team Records/
│   └── Contractors/
└── Operations/
    ├── Systems & Tools/
    ├── Processes & SOPs/
    └── Office & Facilities/
```

### Grow/

```
Grow/
├── Strategy & Planning/           # Vision, roadmaps, OKRs, annual plans
├── Product Development/           # New features, prototypes, R&D
├── Attract/
│   ├── Brand Assets/              # Logo, colors, guidelines
│   ├── Content/                   # Blog posts, social, newsletters
│   ├── Campaigns/
│   │   └── {Campaign Name}/
│   ├── Analytics/
│   └── Partnerships & Outreach/
├── Convert/
│   ├── Leads & Pipeline/
│   ├── Proposals & Pitches/
│   ├── Pricing & Packages/
│   └── Testimonials & Case Studies/
└── Retain/
    ├── Customer Success/          # Welcome kits, onboarding sequences
    ├── Communication/             # Check-ins, newsletters, updates
    ├── Loyalty & Rewards/
    ├── Upsells & Renewals/
    └── Feedback & Surveys/
```

---

## L3: Artifacts (examples)

### Fulfill

```
Fulfill/
└── Clients/
    └── Acme-Corp/
        ├── Contract-2025.pdf
        ├── SOW-Phase-2.docx
        ├── Deliverables/
        │   ├── 2025-01_Monthly-Report.pdf
        │   └── 2025-02_Monthly-Report.pdf
        └── Communication/
            ├── Kickoff-Notes.docx
            └── Change-Request-001.docx
```

### Maintain

```
Maintain/
├── Finance/
│   └── Taxes/
│       └── 2025/
│           ├── W2-Employer.pdf
│           ├── 1099-Freelance.pdf
│           └── Return-Federal-2025.pdf
└── Legal/
    └── Contracts & Agreements/
        ├── Lease-Office-2024-2026.pdf
        └── SaaS-Vendor-Agreement.pdf
```

### Grow

```
Grow/
└── Attract/
    └── Campaigns/
        └── Q1-2025-Product-Launch/
            ├── Brief.docx
            ├── Timeline.xlsx
            ├── Assets/
            │   ├── Hero-Banner-1200x628.png
            │   └── Social-Square-1080x1080.png
            └── Results/
                └── Analytics-Report.pdf
```

---

## Where Does This Go?

Common items that feel ambiguous:

| Item | Goes in | Why |
|------|---------|-----|
| Client contract | Fulfill/Clients/{Name}/ | Part of the delivery relationship |
| Vendor contract | Maintain/Legal/Contracts/ | Keeping operations running |
| Invoice (sent or received) | Maintain/Finance/Invoices/ | Money is always Maintain |
| Brand guidelines | Grow/Attract/Brand Assets/ | How you present to market |
| Employee handbook | Maintain/People/Policies/ | People operations |
| Product roadmap | Grow/Strategy & Planning/ | Forward-looking |
| Blog post draft | Grow/Attract/Content/ | Marketing content |
| Internal SOP | Maintain/Operations/Processes/ | How the machine runs |
| Pitch deck | Grow/Convert/Proposals/ | Sales material |
| Company logo files | Grow/Attract/Brand Assets/ | Marketing assets |
| Meeting notes | _Shared/Meeting Notes/ | Cross-functional |

**Rule of thumb:** Ask "is this about delivering, running, or growing?" If still unclear, ask "who needs this most?" and file it in their arena.

---

## Shared Spaces

For cross-functional work that doesn't belong to a single arena:

```
Business/
├── ...arenas above...
└── _Shared/
    ├── Templates/          # Company-wide templates
    ├── Cross-Team/         # Multi-department projects
    └── Meeting Notes/      # All-hands, leadership syncs
```

**Rule:** `_Shared/` is not a dumping ground. Every file there should have a clear reason it can't live in a single arena.

---

## Access Control Alignment

Map L1/L2 to access permissions:

| Path | Access |
|------|--------|
| Fulfill/ | Delivery team, project managers |
| Maintain/Finance/ | Finance team + leadership |
| Maintain/Legal/ | Legal + leadership |
| Maintain/People/ | HR only (sensitive data) |
| Grow/ | Marketing, sales, leadership |
| _Shared/ | All staff |

This keeps permissions simple and predictable. If someone asks "who can see this?", the folder path answers the question.

---

## Scaling Guide

Not every business needs every folder. Start with what you use and expand as needed:

**Solo / Freelancer:**
```
Business/
├── Fulfill/
│   └── Clients/
├── Maintain/
│   └── Finance/
└── Grow/
    └── Attract/
```

**Small Team (2-10):**
```
Business/
├── Fulfill/            # + Projects/, Products & Services/
├── Maintain/           # + Legal/, People/, Operations/
└── Grow/               # + Convert/, Retain/
```

**Established Org:** Use the full template. Add L2 folders as departments form around them.

---

## Customization Notes

- **Scale to your size** — don't create folders for departments that don't exist yet.
- **Don't pre-build L3** — let teams create their own artifact structures within L2.
- **Archive completed work** — use `_Archive/` within each L2 outcome.
- **Enforce naming conventions** — agree on casing and date formats across the org.
- **{Placeholders}** indicate folders created per instance (per client, per year, per campaign).
