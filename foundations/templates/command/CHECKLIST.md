# Command Template Checklist

Use this checklist before finalizing your command definition.

## Frontmatter

- [ ] `name` is lowercase kebab-case
- [ ] `description` is clear and concise (one line)

## Documentation

- [ ] Usage section shows full command syntax
- [ ] Arguments table lists all arguments with required/optional
- [ ] Examples section shows realistic usage scenarios
- [ ] What It Does section explains the workflow
- [ ] Entry Point specifies which agent starts
- [ ] Workflow diagram shows agent flow
- [ ] Prerequisites list what's needed before running
- [ ] Output section describes what user will see
- [ ] Notes section includes important caveats

## Integration

- [ ] Command is listed in plugin.json manifest
- [ ] Entry point agent exists and is correctly named
- [ ] Workflow matches the actual agent handoff chain
- [ ] Prerequisites are accurate

## Validation

- [ ] Command can be invoked via /[plugin]:[command]
- [ ] Arguments are parsed correctly
- [ ] Entry point agent is triggered
- [ ] Error handling works for missing prerequisites

---

**Delete this file after completing the checklist.**
