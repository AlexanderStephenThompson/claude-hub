# Python Cleaning Profile

Project type detection: `pyproject.toml`, `setup.py`, `setup.cfg`, or `requirements.txt` exists.

---

## Import Organization

Sort imports in this order (per isort/PEP 8):

```python
# 1. Standard library
import os
import sys
from pathlib import Path

# 2. Third-party
import pandas as pd
import numpy as np

# 3. Local/project
from .utils import helper
from myproject.core import engine
```

- Remove unused imports
- Remove duplicate imports
- Consolidate `from x import a` and `from x import b` into `from x import a, b`

---

## `__init__.py` Cleanup

- Remove unnecessary re-exports that exist only for convenience
- Remove empty `__init__.py` files if the project uses implicit namespace packages
- Flag `__init__.py` files that import everything (`from .module import *`)

---

## Docstring Consistency

Detect the dominant style and enforce it:

| Style | Pattern |
|-------|---------|
| Google | `Args:`, `Returns:`, `Raises:` |
| NumPy | `Parameters`, `Returns`, `Raises` with `----------` underlines |
| reStructuredText | `:param name:`, `:returns:`, `:raises:` |

Flag functions that use a different style than the project majority.

---

## Type Hint Consistency

- If the project uses type hints, flag untyped public functions
- Don't add type hints if the project doesn't use them (respect project convention)
- Remove redundant type comments if proper annotations exist

---

## Dependency Management

- Flag packages in `requirements.txt` that aren't imported anywhere
- Flag unpinned versions in `requirements.txt` (no `==` or `>=`)
- If both `requirements.txt` and `pyproject.toml` exist, flag potential drift between them

---

## Anti-Patterns

- **Don't change `*` imports in test files** — Test frameworks often use them
- **Don't remove imports that look unused but are used for side effects** — Flag instead
- **Don't enforce one docstring style over another** — Match what the project already uses
- **Don't add type hints to a project that doesn't use them** — That's a policy decision, not cleanup
