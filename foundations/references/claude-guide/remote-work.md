# Remote Work

> Running Claude Code without a human at the terminal — headless mode, CI/CD, cloud execution, and the Agent SDK.

---

## Headless Mode (`-p` Flag)

Run Claude Code non-interactively for scripts and automation:

```bash
claude -p "Find and fix the bug in auth.py" --allowedTools "Read,Edit,Bash"
```

### Key Flags

| Flag | Purpose |
|------|---------|
| `-p` / `--print` | Non-interactive mode, no session created |
| `--bare` | Skip auto-discovery (hooks, skills, plugins, MCP, CLAUDE.md) for consistent results |
| `--allowedTools` | Pre-approve tools to skip permission prompts |
| `--output-format` | `text` (default), `json`, `stream-json` |
| `--json-schema` | Enforce structured output with JSON Schema |
| `--max-turns` | Limit conversation turns (cost control) |
| `--model` | Specify model |
| `--continue` | Resume most recent conversation |
| `--resume <id>` | Continue specific session |
| `--append-system-prompt` | Add custom instructions |

### Output Formats

**JSON with metadata:**
```bash
claude -p "Summarize this project" --output-format json
# Returns: { "result": "...", "session_id": "...", "usage": {...} }
```

**Structured output:**
```bash
claude -p "Extract function names" --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}}}'
```

**Streaming:**
```bash
claude -p "Explain recursion" --output-format stream-json --verbose | \
  jq -rj 'select(.type == "stream_event" and .event.delta.type? == "text_delta") | .event.delta.text'
```

### Bare Mode

Skips all auto-discovery for deterministic results. Pass configuration explicitly:

```bash
claude --bare -p "Your prompt" \
  --settings <file-or-json> \
  --mcp-config <file-or-json> \
  --allowedTools "Tool1,Tool2"
```

---

## CI/CD: GitHub Actions

### Quick Setup

```bash
claude /install-github-app
```

### Manual Setup

1. Install: https://github.com/apps/claude
2. Add `ANTHROPIC_API_KEY` to repository secrets
3. Add workflow file

### Basic Workflow

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

Trigger with `@claude` mentions in PR/issue comments.

### Code Review on Every PR

```yaml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Review for code quality, correctness, and security"
          claude_args: "--max-turns 5"
```

### Cloud Provider Integration

Supports AWS Bedrock and Google Vertex AI via their respective credential mechanisms. See official docs for full YAML examples.

---

## Cloud Execution (Claude Code on the Web)

Run tasks on Anthropic-managed infrastructure without local code:

```bash
claude --remote "Fix the authentication bug in src/auth/login.ts"
```

### Key Features

- **Parallel sessions** — Each `--remote` is independent
- **Diff view** — Review changes before creating a PR
- **Teleporting** — Continue a web session locally: `claude --teleport`
- **Default environment** — Python, Node.js, Ruby, Java, Go, Rust, PostgreSQL, Redis

### Teleporting Requirements

Clean git state, correct repository (not a fork), branch pushed to remote, same account.

---

## Agent SDK

Programmatic access to Claude Code via Python or TypeScript:

### Installation

```bash
npm install @anthropic-ai/claude-agent-sdk   # TypeScript
pip install claude-agent-sdk                   # Python
```

### Basic Usage (Python)

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Find and fix the bug in auth.py",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
):
    if hasattr(message, "result"):
        print(message.result)
```

### Key Capabilities

- **Sessions** — Resume conversations with `resume=session_id`
- **Hooks** — Custom callbacks on tool use (e.g., audit logging)
- **Subagents** — Delegate to specialized agents
- **MCP integration** — Connect to external tools programmatically
- **Structured output** — JSON Schema enforcement

### Authentication

| Provider | Setup |
|----------|-------|
| Claude API | `ANTHROPIC_API_KEY=sk-ant-...` |
| AWS Bedrock | `CLAUDE_CODE_USE_BEDROCK=1` + AWS credentials |
| Google Vertex | `CLAUDE_CODE_USE_VERTEX=1` + GCP credentials |
| Azure Foundry | `CLAUDE_CODE_USE_FOUNDRY=1` + Azure credentials |

---

## Common Patterns

**Auto-create commits:**
```bash
claude -p "Create a commit for staged changes" \
  --allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"
```

**Security review with custom system prompt:**
```bash
gh pr diff "$1" | claude -p \
  --append-system-prompt "You are a security engineer. Review for vulnerabilities." \
  --output-format json
```

**Multi-step with session resumption:**
```bash
session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id')
claude -p "Now focus on database queries" --resume "$session_id"
```

---

## Best Practices

1. **Define standards in CLAUDE.md** at repo root for CI consistency
2. **Use `--max-turns`** to control costs
3. **Use `--bare`** for reproducible automation
4. **Pre-approve safe tools** to reduce permission prompts
5. **Scope permissions carefully** — read-only for reviews, write for fixes
6. **Never commit API keys** — always use secrets management
7. **Test on small tasks first** before full automation

---

## Limitations

1. Headless mode can't invoke `/skills` or `/commands` — describe the task instead
2. Bare mode skips CLAUDE.md (by design)
3. Cloud execution is GitHub-only (no GitLab/Gitea yet)
4. No custom environments in cloud (pre-built image only)
5. Parallel agents = parallel token cost
6. Some package managers don't work with cloud proxy (e.g., Bun)

---

## Related

- [agents.md](agents.md) — Agent definitions for SDK and CI
- [teams.md](teams.md) — Multi-agent coordination
- [mcp-servers.md](mcp-servers.md) — External tools in remote contexts
