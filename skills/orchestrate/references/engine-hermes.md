# Hermes (`hermes -z`) — engine block

Purpose: Provide the verified one-shot launch, hermetic flags, receipts and session facts for Hermes lanes.

Read when:
- A dispatch shells out to `hermes`, or Hermes is the controller host.

Skip when:
- No Hermes lane is planned.

Inputs:
- The brief, `--model`, a usage-file path, and the session id for resume.

Produces:
- A clean-stdout one-shot with a JSON usage receipt, resumable by session id.

Live-verified 2026-09-16, Hermes 0.18.2.

```bash
hermes -z "$(cat spec.md)" --model <id> --usage-file usage.json --worktree --ignore-rules > out.md
hermes -z "<nudge>" --resume <SESSION>         # resume by id (-c/--continue [name] = last: cwd-scoped)
hermes insights --days 1                       # cost / tool-pattern rollup; hermes sessions export <id> = transcript
```
- `--usage-file PATH` writes a JSON usage report (estimated cost, tokens, model, api_calls) after a
  one-shot — journal it (`board return --tokens`). `--worktree`, `--resume SESSION`, `-t TOOLSETS`,
  `--provider`, `--pass-session-id`.
- Hermetic lane: `--ignore-rules` / `--ignore-user-config` / `--safe-mode` (disables user config,
  AGENTS.md, plugins, MCP). `--yolo` bypasses ALL dangerous-command approvals — never. The hard
  turn cap exists only under `hermes chat -q "…" --max-turns N` (default 90), not under `-z`.
- Its internal per-task model override is accepted then silently ignored — pin the model per
  PROCESS, one invocation per tier. `clarify` (ask-user) times out after ~120s then proceeds, and
  is blocked inside leaf subagents — keep human gates at the controller.
- Also ships: `hermes serve` (JSON-RPC/WebSocket gateway — NOT an OpenAI-compatible server; `proxy`
  forwards to providers), `hermes acp`, `hermes mcp serve`, `hermes prompt-size --json` (the
  fixed prompt budget of a fresh session, offline), and a native `hermes kanban` (SQLite board:
  `task_runs` with separate status and outcome, `dispatch --failure-limit N`, `swarm goal --worker
  --verifier --synthesizer`, `heartbeat --note`) — a peer design of `board`, not a replacement.
- Host quirks: skills live user-level (`~/.hermes/skills`), invocation is explicit `/orchestrate`
  only; don't mutate context/toolset mid-session (its prompt-cache doctrine).
