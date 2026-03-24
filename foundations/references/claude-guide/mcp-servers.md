# MCP Servers (Model Context Protocol)

> Standardized connections between Claude Code and external tools, services, and data sources.

---

## What Is MCP?

MCP lets Claude Code directly access databases, APIs, workflow tools, and services. Configured MCP servers expose tools that Claude can call during your session — similar to built-in tools like Read and Bash.

**Examples of what MCP enables:**
- Query a PostgreSQL database directly
- Read and comment on GitHub issues
- Check Sentry errors
- Send Slack messages
- Browse with Playwright

---

## Adding MCP Servers

### HTTP (Recommended for cloud services)

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp

# With authentication
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### Stdio (For local processes)

```bash
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server

# Windows requires cmd /c wrapper for npx
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

### SSE (Deprecated — use HTTP)

```bash
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

**Important:** All options (`--transport`, `--env`, `--scope`, `--header`) must come before the server name.

---

## Managing Servers

```bash
claude mcp list              # List all configured servers
claude mcp get github        # Get details for a server
claude mcp remove github     # Remove a server
/mcp                         # Check status within Claude Code
```

---

## Configuration Scopes

| Scope | Storage | Applies To | Shared? |
|-------|---------|-----------|---------|
| **Local** (default) | `~/.claude.json` | Current project, you only | No |
| **Project** | `.mcp.json` (repo root) | This project, all team | Yes (version control) |
| **User** | `~/.claude.json` | All projects, you only | No |

```bash
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

**Priority:** Local > Project > User (same-name servers).

Project-scoped servers require approval before first use (`/mcp` to approve).

---

## Environment Variables in .mcp.json

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

Supports `${VAR}` and `${VAR:-default}` syntax. Works in `command`, `args`, `env`, `url`, and `headers`.

---

## Authentication

### OAuth (Most cloud services)

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
/mcp  # Follow browser login flow
```

Tokens stored securely and refreshed automatically.

### Pre-configured OAuth

```bash
claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

### Revoking Access

Use `/mcp` > "Clear authentication" to revoke tokens.

---

## How MCP Tools Appear in Claude Code

Once configured, MCP tools are available automatically:

- **Tools** — Claude calls them when relevant to your request
- **Resources** — Reference with `@` mentions: `@github:issue://123`
- **Prompts** — Invoke as commands: `/mcp__github__list_prs`

---

## Tool Search (Many Servers)

When MCP tool descriptions exceed 10% of context, Claude Code enables Tool Search automatically — loading tools on-demand instead of upfront.

```bash
ENABLE_TOOL_SEARCH=auto:5 claude    # Custom 5% threshold
ENABLE_TOOL_SEARCH=false claude     # Disable (load all upfront)
```

---

## Output Limits

- Warning at 10,000 tokens per tool output
- Default max: 25,000 tokens
- Override: `MAX_MCP_OUTPUT_TOKENS=50000`

---

## Scoping MCP to Agents

Agents can have their own MCP servers (see [agents.md](agents.md)):

```yaml
# In agent frontmatter
mcpServers:
  - playwright:
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
```

Inline servers connect when agent starts, disconnect when it finishes.

---

## Managed MCP (Organizations)

Admins can control MCP servers organization-wide:

**Exclusive control:** Deploy `managed-mcp.json` to system directories:
- macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- Linux/WSL: `/etc/claude-code/managed-mcp.json`
- Windows: `C:\Program Files\ClaudeCode\managed-mcp.json`

**Policy-based:** Use `allowedMcpServers` and `deniedMcpServers` with server name, command, or URL pattern matching.

---

## Security Best Practices

1. Never commit secrets to version control — use environment variable expansion
2. Verify server trustworthiness before installing (prompt injection risk)
3. Keep sensitive credential servers at local scope, not project scope
4. Use `/mcp` to manage and revoke OAuth access

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection closed" on Windows with `npx` | Use `cmd /c npx` wrapper |
| OAuth callback fails | Copy callback URL manually from browser |
| Project servers not working | Run `/mcp` to approve project-scoped servers |
| Stdio server can't find executable | Use full absolute path |

Configure startup timeout: `MCP_TIMEOUT=10000 claude`

---

## Related

- [agents.md](agents.md) — Scoping MCP servers to specific agents
- [skills.md](skills.md) — Skills that use MCP tools
- [remote-work.md](remote-work.md) — MCP in headless/CI contexts
