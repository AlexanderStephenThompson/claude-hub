---
description: End-to-end feature workflow: plan → challenge → implement (strict TDD + docs) → challenge → security/refactor as needed → ship
argument-hint: <feature request / ticket / acceptance criteria>
---

You are running a fully automated multi-agent feature workflow. The user should not be interrupted with progress checks.
Only ask the user a question if there is a true blocker or an explicit Stop-ship decision.

---

## Operating Rules

- **Default**: Proceed autonomously with stated assumptions.
- **Max user interruption**: One tight question only, if required to proceed safely.
- **Agent handoffs**: Always pass full context and the latest artifacts (plan, decisions, diffs, test results).
- **Gating decisions**: Ship / Ship with fixes / Stop-ship (follow the routing the gate specifies).
- **Loop policy**: Handle "Ship with fixes" automatically (max 2 cycles per gate); escalate only on Stop-ship or repeated failure.

---

## Prerequisite Check

Before starting, verify:
- Git initialized in target directory (`git status` works)
- Working directory clean (no uncommitted changes)
- Tests passing (if test suite exists)

If git is missing: Initialize it (`git init`, initial commit) before proceeding.
If tests fail: Fix them first. Do not build features on a broken baseline.

### Web App Template Prerequisites (if applicable)

If this is a Web App Template project, additionally verify:
- Validators installed: `npm run validate` works
- Design tokens exist: `styles/global.css` present
- Documentation structure exists:
  - `Documentation/project-roadmap.md`
  - `Documentation/changelog.md`
  - `Documentation/features/` folder
- All 8 validators passing or have clear guidance messages

If using `/Feature` command context:
- Parse `{program}/{module}/{feature}` from arguments
- Verify feature file exists at `Documentation/features/{program}/{module}/{feature}.md`
- Verify module explainer exists at `Documentation/features/{program}/{module}/_{module}.md`

---

## Early Exit: Trivial Request

If the request is trivial (single-line fix, typo correction, obvious bug with no design decisions):
- Skip the full planning workflow
- Implement directly with TDD discipline
- Hand off to Challenger for quick diff review
- Ship

---

## Workflow

### Step 1: Plan
Invoke the planner agent.
Ask for 1–3 vertical slices with:

Testable acceptance criteria (Given/When/Then)
Explicit assumptions (numbered + verification method)
Dependency boundaries (what's injected, mocked, tested)
Docs Delta (which docs ship with this slice)
Top 3 risks with mitigations

No code. Just the plan.

### Step 2: Challenge the Plan (Mandatory)
Invoke the challenger agent for plan review.
Require a single decision with explicit routing:

Ship → Proceed to Step 3
Ship with fixes → Send fixes to planner, then re-run Step 2 only (max 2 cycles total)
Stop-ship → Stop. Ask the user ONLY for the missing info to unblock (nothing else)

Do NOT loop back to Step 1 on "Ship with fixes." The Planner will fix and resubmit; Challenger stays in Step 2 for the re-review.

### Step 3: Implement (Strict TDD + Docs + Standards)
Invoke the implementor agent with the approved plan and Challenger's notes.
Require:

Strict Red-Green-Refactor cycle (failing test first, minimal code, refactor for clarity)
Full tests covering all acceptance criteria + edge cases (80% coverage minimum for Web App Template)
Docstrings on all public APIs
Docs-site updates per Docs Delta

**Web App Template additional requirements:**
- Build order: Data → Logic → Presentation (03-data first, 01-presentation last)
- Design tokens only (no hardcoded CSS, all values from `styles/global.css`)
- Documentation updates (atomic with code):
  - Feature file status update
  - Module explainer feature table update
  - Roadmap milestone status update
  - Changelog version entry
- Validators must pass before handoff: `npm run validate`

Implement slice-by-slice. No scope expansion beyond the plan.

### Step 4: Challenge the Implementation (Mandatory)
Invoke the challenger agent for diff review.
Require a single decision with explicit routing:

Ship → Continue to Step 5
Ship with fixes → Send fixes to implementor for code changes only, then re-run Step 4 only (max 2 cycles total)
Stop-ship → Stop. Ask the user ONLY if a true blocker remains after one implementor fix attempt

Do NOT loop back to Plan or full re-implementation. This is a diff review gate; fixes are code-level only.

### Step 4.5: Standards Validation Gate (Web App Template)

If this is a Web App Template project, after Challenger approves the diff:

1. **Run all validators**:
   ```bash
   npm run validate
   ```
   All 8 validators must pass:
   - `validate:tokens` - No hardcoded CSS
   - `validate:arch` - Architecture boundaries
   - `validate:coverage` - 80% test coverage
   - `validate:naming` - File naming conventions
   - `validate:secrets` - No hardcoded secrets
   - `validate:docs` - Documentation structure
   - `validate:html` - Semantic HTML
   - `validate:contrast` - WCAG AA contrast

2. **If any validator fails**:
   - Route back to Implementor with specific fixes
   - Max 2 cycles, then escalate to user

3. **If all validators pass**:
   - Proceed to Step 5 (Security Review if applicable) or Step 7 (Finalize)

This gate is MANDATORY for Web App Template projects. Cannot ship without all validators passing.

### Step 5: Conditional Security Review
Invoke the security agent IF the work touches:

Authentication, authorization, sessions, tokens, identity
Payments or financial flows
PII or regulated data (health, finance, minors, etc.)
Multi-tenant boundaries
Publicly exposed endpoints/webhooks
File upload/download, template rendering, deserialization
New dependencies, privileged permissions, infrastructure changes
Hard-to-reverse data migrations

Require:

Threat Model Lite (assets, entry points, trust boundaries, abuse cases)
Security requirements and verification plan
Decision: Pass / Pass with fixes / Stop-ship

If Pass with fixes:

Route to implementor (code fixes) and/or planner (design changes)
Re-run Step 5 once after fixes

If Stop-ship:

Stop immediately. Escalate to user with the exact trigger and required change.

### Step 6: Conditional Refactor
Invoke the refactorer IF:

Challenger flagged structural issues (god files, poor naming, duplication), OR
Implementor noted maintainability concerns, OR
Code structure would benefit from improvement before next feature

Refactorer improves structure WITHOUT behavior change, then hands back to Challenger for structural verification.

### Step 7: Finalize + Report (Single Output)
Provide one concise final summary:
## Outcome
Shipped / Blocked

## What Changed
- Key files created/modified
- Modules added/refactored
- Dependencies added (if any)

## Tests Added
- Unit tests: N (covering acceptance criteria)
- Integration tests: N (end-to-end flows)
- Edge cases: N
- All passing: ✅

## Documentation Updated
- API.md: [what changed]
- docs/[page].md: [what changed]
- Docstrings: [what was added]
- README: [updated if needed]

## Web App Template Compliance (if applicable)

### Validators Status
| Validator | Status |
|-----------|--------|
| Design Tokens | ✅ |
| Architecture Boundaries | ✅ |
| Test Coverage | ✅ [X]% |
| File Naming | ✅ |
| Secret Scanner | ✅ |
| Documentation | ✅ |
| Semantic HTML | ✅ |
| Contrast Checker | ✅ |

### Documentation Updates
- Feature file: `Documentation/features/{program}/{module}/{feature}.md` → Status: Complete
- Module explainer: `Documentation/features/{program}/{module}/_{module}.md` → Feature added
- Roadmap: `Documentation/project-roadmap.md` → Milestone status updated
- Changelog: `Documentation/changelog.md` → Version entry added

### Version
vX.Y.Z — [Program] / [Module]: [Feature]

## Follow-ups (If Any)
- Only if truly needed
- Clear and specific

---

## Task to Implement
$ARGUMENTS