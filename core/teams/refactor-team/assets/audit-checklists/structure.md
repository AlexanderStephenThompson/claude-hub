# Structure Focus Checklists

When focus is `structure`, these 5 specialized auditors **replace** the single File Organization Auditor from the core checklists. The other 3 core auditors (Code Quality, Scalability, Developer Experience) still run alongside them.

---

## 1a. Root & Config Auditor

The root is the first impression. It should be clean and intentional.

- [ ] Is the root free of stray files? (No orphaned scripts, temp files, leftover configs)
- [ ] Are config files necessary and current? (No unused `.eslintrc`, `tsconfig`, etc.)
- [ ] Is there a clear entry point? (`README`, `index`, `main` — whatever fits)
- [ ] Are dotfiles and configs grouped or hidden where possible?
- [ ] Is `package.json` (or equivalent) clean? No unused scripts, no leftover dependencies.

---

## 1b. Folder Structure Auditor

The shape of the project should mirror how you think about it.

**Logical Grouping**
- [ ] Does the folder structure reflect the project's mental model?
- [ ] Are related files co-located? (Component + styles + tests + types live together)
- [ ] Would you look in this folder first to find this file?

**Depth & Balance**
- [ ] Is nesting depth reasonable? No folders three levels deep containing a single file.
- [ ] Are there empty folders that should be removed? **Exception:** Keep empty folders if part of an intentional repeating pattern (e.g., template directories, scaffolding like `assets/`, `scripts/`, `references/`).
- [ ] Are top-level folders balanced? No single folder with 40 files next to one with 2.

**Structural Opportunities**
- [ ] Are there obvious groupings that would benefit from folders? (e.g., 5+ files with a shared prefix)
- [ ] Only suggest new structure when the benefit is clear — don't impose organization on simple projects.

---

## 1c. File Organization Auditor

Every file should have a clear reason to exist and a clear place to live.

**Placement**
- [ ] Is every file in the most logical folder for its purpose?
- [ ] Are there files that have outgrown their original location?
- [ ] Are shared files in a discoverable, predictable location?

**Splitting & Consolidation**
- [ ] Are there files doing too many things that should be split? (500+ lines is a smell)
- [ ] Are there tiny files that exist for no good reason and should be merged?
- [ ] Are there duplicate or near-duplicate files that should be consolidated?

**Dead Weight**
- [ ] Any unused files? (No imports pointing to them)
- [ ] Any leftover generated files, build artifacts, or temp files?
- [ ] Any commented-out code blocks that should just be deleted?
- [ ] Is `.gitignore` catching everything it should?

---

## 1d. Naming Conventions Auditor

Naming is navigation. Consistent naming means you can guess your way through the project.

- [ ] Are file names descriptive? Could you understand the purpose without opening the file?
- [ ] Is the naming pattern consistent? (If one component is `UserProfile.tsx`, another shouldn't be `profileSettings.tsx`)
- [ ] Do file names match their primary export?
- [ ] Are index files used intentionally? (Clean public APIs, not just re-exporting everything)
- [ ] No generic names: `helpers.ts`, `utils.ts`, `misc.ts` — name them by what they do

**Non-Semantic Names (Flag for Attention)**

Flag files with meaningless names — especially images and assets. Don't rename automatically; surface for the user.

- [ ] `untitled`, `Untitled-1`, `new`, `copy`, `final`, `final-v2`
- [ ] Random strings: `a8f3b2c1.png`, `IMG_20240115.jpg`
- [ ] Generic placeholders: `image.png`, `file.pdf`, `test.js`
- [ ] Screenshot defaults: `Screenshot 2024-01-15`, `Capture.PNG`

---

## 1e. Documentation Placement Auditor

Docs should live where you'd look for them.

- [ ] Is there a root `README` that orients newcomers?
- [ ] Do major folders have a `README` if their purpose isn't obvious from naming alone?
- [ ] Are docs co-located with the code they describe, or buried in a separate `/docs` folder nobody checks?
- [ ] Is there a single source of truth for project setup and getting started?
