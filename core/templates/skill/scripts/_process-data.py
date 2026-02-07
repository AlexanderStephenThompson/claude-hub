#!/usr/bin/env python3
"""
EXAMPLE PYTHON SCRIPT
Rename this file to verb-first format (e.g., process-data.py, validate-output.py).
Remove the _ prefix when ready.
Document in SKILL.md > Scripts table.

---

{{verb-noun}}.py - {{ONE_LINE_DESCRIPTION}}

Usage:
    python scripts/{{verb-noun}}.py <input> [--option VALUE]

Arguments:
    input      - {{INPUT_DESCRIPTION}}
    --option   - {{OPTION_DESCRIPTION}} (default: {{DEFAULT}})

Examples:
    python scripts/{{verb-noun}}.py data.json
    python scripts/{{verb-noun}}.py data.json --option custom

Output:
    {{OUTPUT_DESCRIPTION}}
"""

import argparse
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="{{DESCRIPTION}}")
    parser.add_argument("input", help="Input file")
    parser.add_argument("--option", default="default", help="Optional parameter")

    args = parser.parse_args()

    # Validate input
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"Error: File not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    # =====================
    # YOUR LOGIC HERE
    # =====================

    print("Success")


if __name__ == "__main__":
    main()
