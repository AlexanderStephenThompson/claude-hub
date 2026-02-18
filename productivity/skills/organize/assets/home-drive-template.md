# Home Drive Template

A starting structure for a personal computer or home drive using the L1/L2/L3 framework.

---

## L1: Arenas

```
Home/
├── Career/             # Professional life — education, job search, current role
├── Finances/           # Money matters — bills, taxes, banking
├── Hobbies/            # One subfolder per hobby as needed
├── Home/               # Housing — lease, utilities, maintenance
├── Media/              # Photos, videos, music, screenshots
├── Personal/           # Life stuff that doesn't fit above
└── Archive/            # Cold storage for completed life chapters
```

---

## L2: Outcomes (per arena)

### Career/

```
Career/
├── Education/
│   ├── Degrees & Transcripts/
│   ├── Certifications & Licenses/
│   └── Continuing Education/
├── Job Search/
│   ├── Resumes & Cover Letters/
│   ├── Applications/
│   ├── Interview Prep/
│   └── Portfolio & Samples/
└── Current Job/
    ├── Pay & Income/
    ├── Benefits/
    ├── Reviews & Evaluations/
    ├── Policies & Handbooks/
    ├── Training/
    └── Clients/                # Remove if not applicable
```

### Finances/

```
Finances/
├── Bills & Payments/
├── Taxes/                      # Subfolders by year (2025/, 2026/)
├── Bank Statements/
├── Investments/                # Brokerage statements, research
└── Insurance/                  # Policies, claims
```

### Hobbies/

```
Hobbies/
├── Photography/                # One subfolder per hobby
├── Gaming/
└── Woodworking/
```

### Home/

```
Home/
├── Lease & Mortgage/
├── Utilities/
├── Repairs & Maintenance/
├── Insurance/                  # Renter's or homeowner's
└── Warranties & Manuals/
```

### Media/

```
Media/
├── Photos/
├── Videos/
├── Music/
└── Screenshots/
```

### Personal/

```
Personal/
├── Recipes/
├── Travel/                     # Itineraries, bookings, packing lists
├── Health/                     # Medical records, prescriptions, fitness
├── Identity/                   # Passport scans, licenses, vital records
└── Pets/                       # Vet records, registrations
```

---

## L3: Artifacts (examples)

```
Finances/
└── Taxes/
    └── 2025/
        ├── W2-Employer.pdf
        ├── 1099-Freelance.pdf
        ├── Return-Federal-2025.pdf
        ├── Return-State-2025.pdf
        └── Receipts/
            ├── 2025-01-15_Office-Supplies.pdf
            └── 2025-03-22_Software-License.pdf
```

---

## Where Does This Go?

Common items that feel ambiguous:

| Item | Goes in | Why |
|------|---------|-----|
| Car insurance policy | Finances/Insurance/ | It's a financial product |
| Home insurance policy | Home/Insurance/ | Tied to the dwelling |
| Medical bills | Finances/Bills & Payments/ | Money is Finances, even for health costs |
| Doctor visit records | Personal/Health/ | Medical history, not a bill |
| Tax receipts | Finances/Taxes/{Year}/ | Tax-related always goes to Taxes |
| Vacation photos | Media/Photos/ | Media owns all photos |
| Travel itinerary | Personal/Travel/ | Planning docs, not media |
| College diploma scan | Career/Education/Degrees/ | Career credential |
| Student loan statement | Finances/Bills & Payments/ | It's a financial obligation |
| Hobby purchase receipt | Finances/Bills & Payments/ | Money is always Finances |
| Pet vet bill | Finances/Bills & Payments/ | Money goes to Finances |
| Pet vaccination record | Personal/Pets/ | Health record, not a bill |

**Rule of thumb:** If it involves money, it goes in Finances. If it's a record about something, it goes in the arena that something belongs to.

---

## Customization Notes

- **Adjust L1 arenas** to match your actual life domains. Drop what doesn't apply, add what does.
- **L2 will vary** based on what you actually do. Don't create empty folders for hypothetical outcomes.
- **L3 emerges naturally** — don't pre-build it. Let structure follow work.
- **Archive at L2** — when a project or tax year is done, move it to `Archive/` within its arena.
