# Code Review Checklist

Comprehensive checklist for reviewing code changes. Use as a reviewer guide or self-review before submitting.

---

## Correctness

- [ ] Code does what the description/ticket says it should do
- [ ] Edge cases are handled (empty inputs, nulls, boundaries)
- [ ] Error paths are handled correctly (no swallowed errors)
- [ ] No off-by-one errors in loops or comparisons
- [ ] Race conditions considered (if concurrent code)

## Testing

- [ ] Tests exist for new/changed behavior
- [ ] Tests are meaningful (not just coverage padding)
- [ ] Tests use Arrange-Act-Assert structure
- [ ] Test names describe behavior, not implementation
- [ ] Edge cases have dedicated tests
- [ ] Tests are isolated and deterministic
- [ ] Existing tests still pass

## Naming

- [ ] Names pass the read-aloud test
- [ ] Functions start with verbs
- [ ] Booleans prefixed with `is`/`has`/`should`/`can`
- [ ] No abbreviations (except universally understood ones)
- [ ] No generic names (`data`, `temp`, `info`, `stuff`)
- [ ] Directional clarity where applicable (`to`/`from`)

## Structure

- [ ] Functions do one thing (single responsibility)
- [ ] No function exceeds ~30 lines
- [ ] Max 3 levels of nesting (early returns used)
- [ ] No God objects or classes doing too much
- [ ] Dependencies flow in one direction

## Error Handling

- [ ] Inputs validated at boundaries
- [ ] Specific exceptions caught (not bare `except`)
- [ ] No empty catch blocks
- [ ] Errors include useful context (what failed, why)
- [ ] Resources cleaned up properly (connections, files, locks)

## Constants & Clarity

- [ ] No magic numbers or strings -- all extracted to named constants
- [ ] Boolean parameters use named arguments or option objects
- [ ] Complex logic broken into named steps
- [ ] Code is explicit, not cleverly compressed

## Documentation

- [ ] Public APIs have complete docstrings
- [ ] Comments explain "why", not "what"
- [ ] No stale comments (code changed but comment didn't)
- [ ] TODOs have context (ticket reference, reason)

## Security

- [ ] User input validated and sanitized
- [ ] No SQL/command injection vulnerabilities
- [ ] No secrets hardcoded in source
- [ ] Parameterized queries used for all database access
- [ ] Least privilege applied (minimal permissions)

## Performance

- [ ] No unnecessary database queries in loops
- [ ] No obvious N+1 query patterns
- [ ] Large data sets handled with pagination/streaming
- [ ] No blocking operations in hot paths (unless intentional)

## Maintainability

- [ ] Change is appropriately scoped (not too large)
- [ ] No dead code or commented-out code left behind
- [ ] No unnecessary abstractions or premature optimization
- [ ] Follows existing patterns in the codebase
- [ ] Would a new team member understand this code?

---

## Review Mindset

**As reviewer:**
- Focus on correctness and maintainability, not style preferences
- Ask questions before assuming intent: "What happens when X?"
- Suggest, don't demand: "Consider extracting this to..." vs "You must..."
- Approve when "good enough" -- perfection is the enemy of shipping

**As author:**
- Self-review before requesting review (use this checklist)
- Keep changes small and focused
- Provide context in the PR description
- Respond to feedback constructively
