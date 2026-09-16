# opencode (`opencode run`) — engine block

Purpose: Provide the verified launch, session, receipt and delegation facts for opencode lanes.

Read when:
- A dispatch shells out to `opencode run`, or opencode is the controller host.

Skip when:
- No opencode lane is planned.

Inputs:
- The brief (attached with `-f`), `provider/model`, variant, agent name, and output path.

Produces:
- A raw-JSON event lane, resumable by session id, with `opencode stats` receipts.

Live-verified 2026-09-16, opencode 1.18.27.

```bash
opencode run -f spec.md "Execute the attached brief." --model <provider/model> --variant high \
  --agent worker --format json > events.jsonl
opencode run -s <session> "<nudge>"            # resume by id (-c continues "last" — cwd-scoped); --fork branches it
opencode stats --days 1 --models               # token/cost receipts; opencode export <id> --sanitize = audit JSON
```
- `--format json` streams raw JSON events; `--variant` = provider-specific reasoning effort
  (high/max/minimal); `--auto` auto-approves permissions (dangerous — leave off); `--attach
  <server-url>`, `--dir`, `--share`.
- In-session delegation is synchronous — for N-way parallelism run N `opencode run` processes in
  separate worktrees, or drive `opencode serve` (REST) / `opencode acp` (ACP) from the controller.
- `.opencode/agents/*.md` pin model + granular permissions per agent (`opencode agent create/list`);
  `opencode mcp add|list|auth` manages MCP clients; `opencode pr <n>` / `opencode github` is a
  built-in PR lane. Its `question` tool gives structured ask-user in interactive runs only; skills
  are invoked via its `skill` tool (no slash form).
