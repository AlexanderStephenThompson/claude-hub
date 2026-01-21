# Skill Validation Checklist

Run through this before packaging. Items marked **[CRITICAL]** must pass.

---

## Phase 1: Clean Up Template Files

Do this FIRST before anything else.

- [ ] **[CRITICAL]** Renamed or deleted `references/_example-reference.md`
- [ ] **[CRITICAL]** Renamed or deleted `scripts/_process-data.py`
- [ ] **[CRITICAL]** Renamed or deleted `scripts/_setup-environment.sh`
- [ ] **[CRITICAL]** Renamed or deleted files in `assets/` starting with `_`
- [ ] **[CRITICAL]** Deleted this CHECKLIST.md

---

## Phase 2: Validate SKILL.md

### Frontmatter

- [ ] **[CRITICAL]** `name` is lowercase-hyphenated (e.g., `my-skill`)
- [ ] **[CRITICAL]** `description` is 50-100 words
- [ ] `description` explains: what it does, when to trigger, scope boundaries
- [ ] `allowed_tools` lists tools this skill needs
- [ ] **[CRITICAL]** All placeholder text replaced with real content

### Structure

- [ ] **[CRITICAL]** Under 500 lines / <2000 tokens total
- [ ] Core Workflow has 3-5 clear steps
- [ ] Hard Rules use **Never:** and **Always:** format (scannable in 5 seconds)
- [ ] Decision Logic section deleted if only one workflow path
- [ ] Deleted unused optional sections (Reference Files, Scripts, Assets)

### Examples

- [ ] **[CRITICAL]** At least one complete example with User/Claude format
- [ ] Example shows realistic usage (not placeholder text)

---

## Phase 3: Validate Supporting Files

### References (`references/*.md`)

- [ ] All files are `.md` format
- [ ] Filenames describe trigger (e.g., `instagram.md`, not `ref1.md`)
- [ ] Each documented in SKILL.md Reference Files table
- [ ] No duplicate content with SKILL.md

### Scripts (`scripts/*.py` or `scripts/*.sh`)

- [ ] Filenames are verb-first (e.g., `process-data.py`, `setup-environment.sh`)
- [ ] Each has docstring with Usage, Arguments, Examples
- [ ] **[CRITICAL]** Scripts run without errors: `python scripts/name.py --help`
- [ ] Each documented in SKILL.md Scripts table

### Assets (`assets/`)

- [ ] Filenames are noun-based (what it IS, not what it does)
- [ ] Each documented in SKILL.md Assets table

---

## Phase 4: Functional Testing

Actually test your skill before shipping.

- [ ] **[CRITICAL]** Tested with a real task (not just read the code)
- [ ] Common case works without loading references
- [ ] Edge case loads correct reference file
- [ ] Script outputs match documented behavior
- [ ] Errors produce helpful messages (not crashes)

---

## Phase 5: Token Efficiency

- [ ] Information lives in ONE place (no duplication)
- [ ] Heavy details in references, not SKILL.md
- [ ] Total skill is reasonable size (<1000 lines across all files)

---

## Summary

| Phase | Critical Items |
|-------|----------------|
| 1. Cleanup | 5 |
| 2. SKILL.md | 5 |
| 3. Supporting Files | 1 |
| 4. Testing | 1 |
| 5. Efficiency | 0 |
| **Total** | **12** |

**Ready to package when:** All [CRITICAL] items checked.
