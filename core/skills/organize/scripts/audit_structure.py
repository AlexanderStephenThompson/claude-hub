"""Audit a folder structure against the L1/L2/L3 organization framework.

Scans a directory tree and reports:
- Depth analysis (how deep does nesting go?)
- Catch-all folder detection (Misc, Other, Stuff, etc.)
- Empty folder detection
- Overpopulated folders (100+ items)
- Naming convention issues (spaces, special characters, inconsistent casing)
- L1 arena count assessment
- Transit folder (~) detection and staleness checks

Usage:
    python audit_structure.py <path>
    python audit_structure.py <path> --depth 3
    python audit_structure.py <path> --context personal
    python audit_structure.py <path> --json

Context modes:
    code      Strict naming: no spaces, no special characters (default)
    personal  Relaxed naming: spaces are OK, only flag special characters
    team      Match team convention: spaces flagged as warnings, not errors
"""

import argparse
import json
import os
import re
import sys
import time
from collections import Counter
from pathlib import Path

CATCH_ALL_NAMES = {
    "misc", "miscellaneous", "other", "stuff", "temp", "tmp",
    "new folder", "new folder (2)", "new folder (3)",
    "untitled", "untitled folder", "random", "junk",
    "old", "old stuff", "archive", "backup",
    "documents", "my documents", "files", "data",
}

SYSTEM_PREFIXES = {"_"}
TRANSIT_PREFIX = "~"
TRANSIT_STALE_DAYS = 60

PROBLEM_CHARACTERS = re.compile(r"[#%&'\"\(\)@\[\]\{\}!;,=\+]")
SPACE_PATTERN = re.compile(r"\s")
NON_ASCII_PATTERN = re.compile(r"[^\x00-\x7F]")

VALID_CONTEXTS = {"code", "personal", "team"}

MAX_ITEMS_PER_FOLDER = 30
MAX_DEPTH = 4
IDEAL_L1_MIN = 5
IDEAL_L1_MAX = 8
L1_ABSOLUTE_MAX = 12


def scan_directory(root_path, max_scan_depth=6, context="code"):
    """Walk the directory tree and collect statistics.

    Args:
        root_path: Root directory to audit.
        max_scan_depth: Maximum depth to scan.
        context: Naming context - "code" (strict), "personal" (spaces OK),
                 or "team" (spaces warned).
    """
    findings = {
        "root": str(root_path),
        "context": context,
        "total_folders": 0,
        "total_files": 0,
        "max_depth": 0,
        "l1_count": 0,
        "catch_all_folders": [],
        "empty_folders": [],
        "overpopulated_folders": [],
        "deep_folders": [],
        "naming_issues": [],
        "transit_folders": [],
    }

    root = Path(root_path)

    if not root.is_dir():
        print(f"Error: '{root_path}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    l1_entries = [
        entry for entry in root.iterdir()
        if entry.is_dir() and not entry.name.startswith(".")
    ]
    findings["l1_count"] = len(l1_entries)

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [
            d for d in dirnames
            if not d.startswith(".") and d != "__pycache__"
        ]

        current = Path(dirpath)
        depth = len(current.relative_to(root).parts)

        if depth > max_scan_depth:
            dirnames.clear()
            continue

        findings["total_folders"] += 1
        findings["total_files"] += len(filenames)

        if depth > findings["max_depth"]:
            findings["max_depth"] = depth

        folder_name = current.name
        item_count = len(dirnames) + len(filenames)

        if folder_name.lower() in CATCH_ALL_NAMES:
            findings["catch_all_folders"].append({
                "path": str(current.relative_to(root)),
                "depth": depth,
                "items": item_count,
            })

        if item_count == 0 and depth > 0:
            findings["empty_folders"].append(
                str(current.relative_to(root))
            )

        if item_count > MAX_ITEMS_PER_FOLDER:
            findings["overpopulated_folders"].append({
                "path": str(current.relative_to(root)),
                "items": item_count,
                "depth": depth,
            })

        if depth > MAX_DEPTH:
            findings["deep_folders"].append({
                "path": str(current.relative_to(root)),
                "depth": depth,
            })

        if folder_name.startswith(TRANSIT_PREFIX):
            check_transit(current, current.relative_to(root), depth, findings)

        check_naming(folder_name, current.relative_to(root), depth, findings, context)

        for fname in filenames:
            check_naming(fname, current.relative_to(root) / fname, depth, findings, context)

    return findings


def check_transit(abs_path, relative_path, depth, findings):
    """Check a ~prefixed transit folder for staleness."""
    status = "active"
    issues = []

    try:
        mtime = abs_path.stat().st_mtime
        age_days = (time.time() - mtime) / 86400
    except OSError:
        age_days = 0

    if age_days > TRANSIT_STALE_DAYS:
        status = "stale"
        issues.append(f"no modification in {int(age_days)} days (threshold: {TRANSIT_STALE_DAYS})")

    parent_children = [
        d.name for d in abs_path.parent.iterdir()
        if d.is_dir() and not d.name.startswith(TRANSIT_PREFIX)
    ] if abs_path.parent.exists() else []

    stripped = abs_path.name.lstrip(TRANSIT_PREFIX).strip()
    for sibling in parent_children:
        if sibling.lower() == stripped.lower():
            status = "stale"
            issues.append(f"destination '{sibling}/' exists as sibling — transit may be complete")
            break

    findings["transit_folders"].append({
        "path": str(relative_path),
        "depth": depth,
        "status": status,
        "age_days": int(age_days),
        "issues": issues,
    })


def check_naming(name, relative_path, depth, findings, context="code"):
    """Check a file or folder name for convention violations.

    Skips tilde in transit-prefixed folder names since ~ is a valid
    semantic prefix (see SKILL.md Transit Folders).

    Context controls space handling:
        code:     Spaces are flagged as issues (breaks scripts, URLs, CLI).
        personal: Spaces are allowed (readability matters more).
        team:     Spaces are flagged as warnings (depends on team convention).
    """
    if name.startswith(TRANSIT_PREFIX) or name.startswith("_"):
        return

    issues = []

    if SPACE_PATTERN.search(name):
        if context == "code":
            issues.append("contains spaces")
        elif context == "team":
            issues.append("contains spaces (check team convention)")
        # personal: spaces are fine, don't flag

    if PROBLEM_CHARACTERS.search(name):
        issues.append("contains special characters")

    if NON_ASCII_PATTERN.search(name):
        issues.append("contains non-ASCII characters")

    if issues:
        findings["naming_issues"].append({
            "path": str(relative_path),
            "name": name,
            "issues": issues,
        })


def generate_report(findings):
    """Generate a human-readable audit report."""
    lines = []
    lines.append("=" * 60)
    lines.append("FOLDER STRUCTURE AUDIT")
    lines.append(f"Root: {findings['root']}")
    lines.append("=" * 60)

    lines.append("")
    lines.append("SUMMARY")
    lines.append("-" * 40)
    lines.append(f"Total folders:  {findings['total_folders']}")
    lines.append(f"Total files:    {findings['total_files']}")
    lines.append(f"Max depth:      {findings['max_depth']}")
    lines.append(f"L1 arenas:      {findings['l1_count']}")

    lines.append("")
    lines.append("L1 ARENA ASSESSMENT")
    lines.append("-" * 40)
    l1 = findings["l1_count"]
    if l1 < IDEAL_L1_MIN:
        lines.append(f"  [{l1} arenas] Too few — you may be lumping unrelated domains together.")
        lines.append(f"  Target: {IDEAL_L1_MIN}-{IDEAL_L1_MAX} arenas.")
    elif l1 <= IDEAL_L1_MAX:
        lines.append(f"  [{l1} arenas] Good — within the ideal range of {IDEAL_L1_MIN}-{IDEAL_L1_MAX}.")
    elif l1 <= L1_ABSOLUTE_MAX:
        lines.append(f"  [{l1} arenas] Slightly high — consider merging related arenas.")
        lines.append(f"  Target: {IDEAL_L1_MIN}-{IDEAL_L1_MAX} arenas.")
    else:
        lines.append(f"  [{l1} arenas] Too many — some L2 outcomes are likely hiding at L1.")
        lines.append(f"  Target: {IDEAL_L1_MIN}-{IDEAL_L1_MAX} arenas, max {L1_ABSOLUTE_MAX}.")

    if findings["transit_folders"]:
        stale = [t for t in findings["transit_folders"] if t["status"] == "stale"]
        active = [t for t in findings["transit_folders"] if t["status"] == "active"]
        lines.append("")
        lines.append(f"TRANSIT FOLDERS ({len(findings['transit_folders'])} found)")
        lines.append("-" * 40)
        if stale:
            lines.append(f"  STALE ({len(stale)}):")
            for t in stale:
                detail = "; ".join(t["issues"]) if t["issues"] else f"age: {t['age_days']}d"
                lines.append(f"    {t['path']}  ({detail})")
            lines.append("  Action: Finish the transfer and delete, or abandon these folders.")
        if active:
            lines.append(f"  ACTIVE ({len(active)}):")
            for t in active:
                lines.append(f"    {t['path']}  (age: {t['age_days']}d)")

    if findings["catch_all_folders"]:
        lines.append("")
        lines.append(f"CATCH-ALL FOLDERS ({len(findings['catch_all_folders'])} found)")
        lines.append("-" * 40)
        for f in findings["catch_all_folders"]:
            lines.append(f"  {f['path']}  ({f['items']} items)")
        lines.append("  Action: Sort contents into real L1/L2 homes, then delete these folders.")

    if findings["empty_folders"]:
        lines.append("")
        lines.append(f"EMPTY FOLDERS ({len(findings['empty_folders'])} found)")
        lines.append("-" * 40)
        for path in findings["empty_folders"][:20]:
            lines.append(f"  {path}")
        if len(findings["empty_folders"]) > 20:
            lines.append(f"  ...and {len(findings['empty_folders']) - 20} more")
        lines.append("  Action: Delete empty folders — they create noise and false promises.")

    if findings["overpopulated_folders"]:
        lines.append("")
        lines.append(f"OVERPOPULATED FOLDERS ({len(findings['overpopulated_folders'])} found)")
        lines.append("-" * 40)
        for f in sorted(findings["overpopulated_folders"], key=lambda x: -x["items"]):
            lines.append(f"  {f['path']}  ({f['items']} items, depth {f['depth']})")
        lines.append(f"  Action: Split into L2 outcomes or L3 subgroups (target: <{MAX_ITEMS_PER_FOLDER} items).")

    if findings["deep_folders"]:
        lines.append("")
        lines.append(f"DEEP NESTING ({len(findings['deep_folders'])} folders beyond depth {MAX_DEPTH})")
        lines.append("-" * 40)
        for f in findings["deep_folders"][:20]:
            lines.append(f"  {f['path']}  (depth {f['depth']})")
        if len(findings["deep_folders"]) > 20:
            lines.append(f"  ...and {len(findings['deep_folders']) - 20} more")
        lines.append("  Action: Flatten by combining context into fewer, more descriptive folder names.")

    if findings["naming_issues"]:
        lines.append("")
        lines.append(f"NAMING ISSUES ({len(findings['naming_issues'])} found)")
        lines.append("-" * 40)
        for issue in findings["naming_issues"][:30]:
            problems = ", ".join(issue["issues"])
            lines.append(f"  {issue['path']}  ({problems})")
        if len(findings["naming_issues"]) > 30:
            lines.append(f"  ...and {len(findings['naming_issues']) - 30} more")
        lines.append("  Action: Rename to use hyphens, remove special characters, use ASCII only.")

    stale_transit = [t for t in findings["transit_folders"] if t["status"] == "stale"]
    issue_count = (
        len(stale_transit)
        + len(findings["catch_all_folders"])
        + len(findings["empty_folders"])
        + len(findings["overpopulated_folders"])
        + len(findings["deep_folders"])
        + len(findings["naming_issues"])
    )

    lines.append("")
    lines.append("=" * 60)
    if issue_count == 0:
        lines.append("RESULT: Clean — no issues found.")
    else:
        lines.append(f"RESULT: {issue_count} issues found across 5 categories.")
    lines.append("=" * 60)

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Audit a folder structure against the L1/L2/L3 organization framework."
    )
    parser.add_argument("path", help="Root directory to audit")
    parser.add_argument(
        "--depth", type=int, default=6,
        help="Maximum depth to scan (default: 6)"
    )
    parser.add_argument(
        "--context", choices=["code", "personal", "team"], default="code",
        help="Naming context: code (strict, default), personal (spaces OK), team (spaces warned)"
    )
    parser.add_argument(
        "--json", action="store_true",
        help="Output findings as JSON instead of human-readable report"
    )

    args = parser.parse_args()

    findings = scan_directory(args.path, max_scan_depth=args.depth, context=args.context)

    if args.json:
        print(json.dumps(findings, indent=2))
    else:
        print(generate_report(findings))


if __name__ == "__main__":
    main()
