# Data Engineering Cleaning Profile

Project type detection: `.sql` files, Jupyter notebooks (`.ipynb`), `dbt_project.yml`, Terraform/CDK files, or Airflow DAGs present.

---

## SQL Formatting

### Keyword Casing

Detect the dominant style and enforce consistency:
- **UPPERCASE keywords** (most common): `SELECT`, `FROM`, `WHERE`, `JOIN`
- **lowercase keywords**: `select`, `from`, `where`, `join`

Don't mix styles within the same project.

### Indentation

- Indent subqueries and CTEs consistently
- Align `JOIN` conditions under the `JOIN` keyword
- Use consistent comma placement (leading or trailing — match project convention)

### Naming

- Flag tables/columns with inconsistent casing (mixing `snake_case` and `camelCase`)
- Flag single-letter aliases beyond common conventions (`t` for table, `c` for column)

---

## Notebook Cleanup

### Jupyter Notebooks (`.ipynb`)

- Clear all cell outputs (reduce file size and git diff noise)
- Remove empty cells
- Flag cells with execution count out of order (indicates non-linear execution)
- Flag notebooks with no markdown cells (missing documentation)
- Remove trailing whitespace in cells

### Notebook Organization

- First cell should be imports
- Second cell should be configuration/constants
- Group related operations with markdown headers
- Flag notebooks longer than 50 cells (consider splitting)

---

## Config File Consistency

If a project has multiple config formats, flag the inconsistency:
- YAML vs JSON vs TOML for the same purpose
- Environment-specific configs should follow the same format
- Flag config files with hardcoded paths or credentials

---

## Pipeline Files

### Airflow DAGs
- Flag DAGs with default `dag_id` (should be descriptive)
- Flag tasks with no `retries` configured
- Flag hardcoded connection strings

### dbt
- Flag models with no documentation (`description` in schema.yml)
- Flag models with no tests defined
- Ensure consistent naming: staging (`stg_`), intermediate (`int_`), marts (`fct_`, `dim_`)

---

## Anti-Patterns

- **Don't reformat SQL that uses a project-specific formatter** — Check for `.sqlfluff`, `.sql-formatter` configs first
- **Don't clear notebook outputs if they contain important visualizations** — Flag instead
- **Don't change config formats** — Just flag the inconsistency
- **Don't modify Terraform state files** — Only touch `.tf` source files
