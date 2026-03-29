---
description: Transform transcript, notes, or bullet points into a formatted SOP
argument-hint: [path to transcript/notes or paste content]
---

# /draft-sop

TODO: Build this command.

## Purpose

Takes raw input (transcript, rough notes, bullet points) and produces a formatted SOP following Avid Analytics playbook standards.

## Output Structure

Uses the template from `knowledge/playbook-template.md`:
- Purpose — why this process exists
- Scope — what's in and out of bounds
- Prerequisites — what's needed before starting
- Steps — numbered, clear, with decision points called out
- Escalation — when and how to escalate
- Metrics — how to measure if the process is working

## Rules

- Every SOP's scope must be clearly defined
- Include Mermaid diagram for visual flow
- Flag steps that are candidates for automation
- Simplify as much as possible — if a step can be eliminated, call it out

## References

- `knowledge/business-acumen.md` — systems/building systems section
- `~/.claude/skills/architecture/SKILL.md` — structural clarity
