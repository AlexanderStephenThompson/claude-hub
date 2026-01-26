#!/usr/bin/env python3
"""
Project Structure Validator for Claude Code Customizations

Validates the structure and consistency of the claude-customizations repository:
- YAML frontmatter syntax and required fields in Markdown files
- File structure consistency (agents, skills, commands, teams)
- JSON syntax validity
- Cross-reference integrity (skills referenced in agent frontmatter exist)
- README structure for teams

Usage:
    python validate_project.py [--format text|json] [--verbose]

Exit codes:
    0 - All validations passed
    1 - Errors found
    2 - Warnings found (no errors)
"""

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import List, Dict, Optional, Any


@dataclass
class Issue:
    """A validation issue."""
    file: str
    issue: str
    severity: str  # "error", "warning", "info"
    fix: str


@dataclass
class ValidationResult:
    """Result of all validations."""
    issues: List[Issue] = field(default_factory=list)
    files_checked: int = 0

    @property
    def errors(self) -> List[Issue]:
        return [i for i in self.issues if i.severity == "error"]

    @property
    def warnings(self) -> List[Issue]:
        return [i for i in self.issues if i.severity == "warning"]

    @property
    def info(self) -> List[Issue]:
        return [i for i in self.issues if i.severity == "info"]


def parse_yaml_frontmatter(content: str) -> Optional[Dict[str, Any]]:
    """
    Parse YAML frontmatter from Markdown content.
    Returns None if no frontmatter found.
    Raises ValueError if frontmatter is malformed.
    """
    if not content.startswith('---'):
        return None

    # Find the closing ---
    end_match = re.search(r'\n---\s*\n', content[3:])
    if not end_match:
        raise ValueError("Frontmatter not closed with ---")

    yaml_content = content[3:end_match.start() + 3]

    # Simple YAML parsing (handles our use case without PyYAML dependency)
    result = {}
    current_key = None
    current_value_lines = []

    for line in yaml_content.split('\n'):
        # Skip empty lines
        if not line.strip():
            if current_key and current_value_lines:
                current_value_lines.append('')
            continue

        # Check for key: value pattern
        key_match = re.match(r'^(\w[\w-]*)\s*:\s*(.*)', line)
        if key_match:
            # Save previous key if exists
            if current_key:
                value = '\n'.join(current_value_lines).strip()
                if value.startswith('>'):
                    value = ' '.join(value[1:].split())
                elif value.startswith('|'):
                    value = value[1:].strip()
                result[current_key] = value

            current_key = key_match.group(1)
            current_value_lines = [key_match.group(2)]
        elif current_key:
            # Continuation of multiline value
            current_value_lines.append(line.strip())

    # Don't forget the last key
    if current_key:
        value = '\n'.join(current_value_lines).strip()
        if value.startswith('>'):
            value = ' '.join(value[1:].split())
        elif value.startswith('|'):
            value = value[1:].strip()
        result[current_key] = value

    # Parse list values (skills, tools, etc.)
    for key in result:
        value = result[key]
        if isinstance(value, str):
            # Check if it's a list format
            if value.startswith('-'):
                items = [line.strip().lstrip('- ') for line in value.split('\n') if line.strip().startswith('-')]
                result[key] = items
            elif ',' in value and key in ['skills', 'tools', 'allowed_tools']:
                result[key] = [item.strip() for item in value.split(',')]

    return result


def validate_agent_file(filepath: Path, available_skills: List[str]) -> List[Issue]:
    """Validate an agent Markdown file."""
    issues = []
    rel_path = str(filepath)

    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        issues.append(Issue(rel_path, f"Cannot read file: {e}", "error", "Check file permissions"))
        return issues

    # Check for frontmatter
    try:
        frontmatter = parse_yaml_frontmatter(content)
    except ValueError as e:
        issues.append(Issue(rel_path, f"Invalid frontmatter: {e}", "error", "Fix YAML syntax"))
        return issues

    if frontmatter is None:
        issues.append(Issue(rel_path, "Missing YAML frontmatter", "error", "Add --- delimited frontmatter at top of file"))
        return issues

    # Required fields for agents
    required_fields = ['name', 'description']
    for field_name in required_fields:
        if field_name not in frontmatter:
            issues.append(Issue(rel_path, f"Missing required field: {field_name}", "error", f"Add '{field_name}:' to frontmatter"))

    # Check name matches filename
    if 'name' in frontmatter:
        expected_name = filepath.stem
        if frontmatter['name'] != expected_name:
            issues.append(Issue(
                rel_path,
                f"Name '{frontmatter['name']}' doesn't match filename '{expected_name}'",
                "warning",
                f"Change name to '{expected_name}' or rename file"
            ))

    # Check skills references (if skills field exists)
    if 'skills' in frontmatter:
        skills = frontmatter['skills']
        if isinstance(skills, list):
            for skill in skills:
                if skill not in available_skills:
                    issues.append(Issue(
                        rel_path,
                        f"References non-existent skill: {skill}",
                        "warning",
                        f"Create skill '{skill}' or remove from skills list"
                    ))

    # Check for proper Markdown structure
    if '# ' not in content:
        issues.append(Issue(rel_path, "Missing top-level heading (# Title)", "warning", "Add a title heading after frontmatter"))

    return issues


def validate_skill_file(filepath: Path) -> List[Issue]:
    """Validate a SKILL.md file."""
    issues = []
    rel_path = str(filepath)

    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        issues.append(Issue(rel_path, f"Cannot read file: {e}", "error", "Check file permissions"))
        return issues

    # Check for frontmatter
    try:
        frontmatter = parse_yaml_frontmatter(content)
    except ValueError as e:
        issues.append(Issue(rel_path, f"Invalid frontmatter: {e}", "error", "Fix YAML syntax"))
        return issues

    if frontmatter is None:
        issues.append(Issue(rel_path, "Missing YAML frontmatter", "error", "Add --- delimited frontmatter at top of file"))
        return issues

    # Required fields for skills
    required_fields = ['name', 'description']
    for field_name in required_fields:
        if field_name not in frontmatter:
            issues.append(Issue(rel_path, f"Missing required field: {field_name}", "error", f"Add '{field_name}:' to frontmatter"))

    # Check name matches parent folder
    if 'name' in frontmatter:
        expected_name = filepath.parent.name
        if frontmatter['name'] != expected_name:
            issues.append(Issue(
                rel_path,
                f"Name '{frontmatter['name']}' doesn't match folder name '{expected_name}'",
                "warning",
                f"Change name to '{expected_name}' or rename folder"
            ))

    return issues


def validate_command_file(filepath: Path) -> List[Issue]:
    """Validate a command Markdown file."""
    issues = []
    rel_path = str(filepath)

    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        issues.append(Issue(rel_path, f"Cannot read file: {e}", "error", "Check file permissions"))
        return issues

    # Check for frontmatter (optional for commands, but recommended)
    try:
        frontmatter = parse_yaml_frontmatter(content)
    except ValueError as e:
        issues.append(Issue(rel_path, f"Invalid frontmatter: {e}", "error", "Fix YAML syntax"))
        return issues

    # Commands don't require frontmatter, but should have content
    if len(content.strip()) < 50:
        issues.append(Issue(rel_path, "Command file appears too short", "warning", "Add command documentation"))

    return issues


def validate_json_file(filepath: Path) -> List[Issue]:
    """Validate a JSON file."""
    issues = []
    rel_path = str(filepath)

    try:
        content = filepath.read_text(encoding='utf-8')
        json.loads(content)
    except json.JSONDecodeError as e:
        issues.append(Issue(rel_path, f"Invalid JSON: {e}", "error", "Fix JSON syntax"))
    except Exception as e:
        issues.append(Issue(rel_path, f"Cannot read file: {e}", "error", "Check file permissions"))

    return issues


def validate_team_readme(filepath: Path) -> List[Issue]:
    """Validate a team README.md file."""
    issues = []
    rel_path = str(filepath)

    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        issues.append(Issue(rel_path, f"Cannot read file: {e}", "error", "Check file permissions"))
        return issues

    # Check for key sections
    recommended_sections = [
        ('## The Team', 'team roster'),
        ('## Quick Start', 'usage instructions'),
        ('## How It Works', 'workflow description'),
    ]

    for section, description in recommended_sections:
        if section not in content:
            issues.append(Issue(
                rel_path,
                f"Missing recommended section: {section}",
                "info",
                f"Add {section} section with {description}"
            ))

    return issues


def validate_python_syntax(filepath: Path) -> List[Issue]:
    """Validate Python file syntax."""
    issues = []
    rel_path = str(filepath)

    try:
        content = filepath.read_text(encoding='utf-8')
        compile(content, filepath, 'exec')
    except SyntaxError as e:
        issues.append(Issue(rel_path, f"Python syntax error: {e.msg} at line {e.lineno}", "error", "Fix Python syntax"))
    except Exception as e:
        issues.append(Issue(rel_path, f"Cannot validate: {e}", "warning", "Check file"))

    return issues


def find_available_skills(base_path: Path) -> List[str]:
    """Find all available skill names in the skills directory."""
    skills_path = base_path / 'skills'
    if not skills_path.exists():
        return []

    skills = []
    for item in skills_path.iterdir():
        if item.is_dir() and (item / 'SKILL.md').exists():
            skills.append(item.name)

    return skills


def validate_project(base_path: Path, verbose: bool = False) -> ValidationResult:
    """Run all validations on the project."""
    result = ValidationResult()

    # Find available skills first
    available_skills = find_available_skills(base_path)
    if verbose:
        print(f"Found {len(available_skills)} skills: {', '.join(available_skills)}")

    # Validate agent files
    for agents_dir in base_path.rglob('agents'):
        if agents_dir.is_dir():
            for agent_file in agents_dir.glob('*.md'):
                if agent_file.name != 'README.md':
                    result.files_checked += 1
                    result.issues.extend(validate_agent_file(agent_file, available_skills))

    # Validate SKILL.md files
    skills_path = base_path / 'skills'
    if skills_path.exists():
        for skill_dir in skills_path.iterdir():
            if skill_dir.is_dir():
                skill_file = skill_dir / 'SKILL.md'
                if skill_file.exists():
                    result.files_checked += 1
                    result.issues.extend(validate_skill_file(skill_file))
                else:
                    result.issues.append(Issue(
                        str(skill_dir),
                        "Missing SKILL.md file",
                        "error",
                        "Create SKILL.md in skill folder"
                    ))

    # Validate command files
    for commands_dir in base_path.rglob('commands'):
        if commands_dir.is_dir():
            for cmd_file in commands_dir.glob('*.md'):
                if cmd_file.name != 'README.md':
                    result.files_checked += 1
                    result.issues.extend(validate_command_file(cmd_file))

    # Validate JSON files
    for json_file in base_path.rglob('*.json'):
        result.files_checked += 1
        result.issues.extend(validate_json_file(json_file))

    # Validate team READMEs
    teams_path = base_path / 'teams'
    if teams_path.exists():
        for team_dir in teams_path.iterdir():
            if team_dir.is_dir():
                readme = team_dir / 'README.md'
                if readme.exists():
                    result.files_checked += 1
                    result.issues.extend(validate_team_readme(readme))
                else:
                    result.issues.append(Issue(
                        str(team_dir),
                        "Missing README.md for team",
                        "warning",
                        "Create README.md in team folder"
                    ))

    # Validate Python scripts
    for py_file in base_path.rglob('*.py'):
        result.files_checked += 1
        result.issues.extend(validate_python_syntax(py_file))

    return result


def format_text_output(result: ValidationResult) -> str:
    """Format validation result as human-readable text."""
    output = []
    output.append("=" * 60)
    output.append("PROJECT VALIDATION REPORT")
    output.append("=" * 60)
    output.append("")

    output.append(f"Files checked: {result.files_checked}")
    output.append(f"Errors: {len(result.errors)}")
    output.append(f"Warnings: {len(result.warnings)}")
    output.append(f"Info: {len(result.info)}")
    output.append("")

    def format_issues(items: List[Issue], label: str, icon: str):
        if items:
            output.append(f"{icon} {label}:")
            output.append("-" * 40)
            for item in items:
                output.append(f"  {item.file}")
                output.append(f"    Issue: {item.issue}")
                output.append(f"    Fix: {item.fix}")
            output.append("")

    format_issues(result.errors, "ERRORS", "X")
    format_issues(result.warnings, "WARNINGS", "!")
    format_issues(result.info, "INFO", "i")

    output.append("=" * 60)

    if result.errors:
        output.append("VALIDATION FAILED - Fix errors before proceeding")
    elif result.warnings:
        output.append("VALIDATION PASSED WITH WARNINGS")
    else:
        output.append("VALIDATION PASSED")

    return '\n'.join(output)


def format_json_output(result: ValidationResult) -> str:
    """Format validation result as JSON."""
    return json.dumps({
        'files_checked': result.files_checked,
        'errors': len(result.errors),
        'warnings': len(result.warnings),
        'info': len(result.info),
        'issues': [asdict(i) for i in result.issues],
        'passed': len(result.errors) == 0,
    }, indent=2)


def main():
    parser = argparse.ArgumentParser(description='Validate claude-customizations project structure')
    parser.add_argument('--format', choices=['text', 'json'], default='text', help='Output format')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    parser.add_argument('path', nargs='?', default='.', help='Path to project root')

    args = parser.parse_args()

    # Find the claude-customizations directory
    base_path = Path(args.path)
    if not base_path.exists():
        print(f"Error: Path does not exist: {base_path}", file=sys.stderr)
        sys.exit(1)

    # If we're in claude-customizations, use current dir
    # Otherwise look for it
    if (base_path / 'skills').exists() or (base_path / 'teams').exists():
        project_path = base_path
    elif (base_path / 'claude-customizations').exists():
        project_path = base_path / 'claude-customizations'
    else:
        project_path = base_path

    result = validate_project(project_path, args.verbose)

    if args.format == 'json':
        print(format_json_output(result))
    else:
        print(format_text_output(result))

    # Exit code
    if result.errors:
        sys.exit(1)
    elif result.warnings:
        sys.exit(0)  # Warnings are acceptable
    else:
        sys.exit(0)


if __name__ == '__main__':
    main()
