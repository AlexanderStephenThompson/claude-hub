#!/bin/bash
#
# EXAMPLE BASH SCRIPT
# Rename this file to verb-first format (e.g., setup-environment.sh, deploy-app.sh).
# Remove the _ prefix when ready.
# Document in SKILL.md > Scripts table.
#
# ---
#
# {{verb-noun}}.sh - {{ONE_LINE_DESCRIPTION}}
#
# Usage:
#     bash scripts/{{verb-noun}}.sh <required-arg> [optional-arg]
#
# Arguments:
#     required-arg  - {{REQUIRED_DESCRIPTION}}
#     optional-arg  - {{OPTIONAL_DESCRIPTION}} (default: {{DEFAULT}})
#
# Examples:
#     bash scripts/{{verb-noun}}.sh input
#     bash scripts/{{verb-noun}}.sh input custom
#
# Output:
#     {{OUTPUT_DESCRIPTION}}
#

set -e  # Exit on error

# Configuration
REQUIRED_ARG="$1"
OPTIONAL_ARG="${2:-default}"

# Validation
if [ -z "$REQUIRED_ARG" ]; then
    echo "Error: Required argument missing" >&2
    echo "Usage: bash scripts/{{verb-noun}}.sh <required-arg>" >&2
    exit 1
fi

# =====================
# YOUR LOGIC HERE
# =====================

echo "Success"
