# Claude Code as a subprocess (`claude -p`) — engine block

Purpose: Provide the verified headless launch, budget, session and fleet facts for Claude Code lanes.

Read when:
- A dispatch shells out to `claude -p` (symmetry, cross-account, or a background fleet).

Skip when:
- The host is Claude Code and native subagents satisfy the dispatch (`strategy-xcli.md` rule 7).

Inputs:
- The brief as a spec file, model + effort, permission mode, a dollar cap, and the session id.

Produces:
- A stream-json lane with usage in its final event, resumable by id, capped in dollars.

Live-verified 2026-09-16, Claude Code 2.1.273.

```bash
ID=$(uuidgen)
claude -p --bare --session-id "$ID" --output-format stream-json --include-partial-messages \
  --model sonnet --effort high --permission-mode acceptEdits --max-budget-usd 2.00 \
  --agents '{"worker":{"description":"…","prompt":"…"}}' "$(cat spec.md)" > events.jsonl
board dispatch N --agent task-N-claude --model sonnet --engine claude --session "$ID" --log raw/lane-N.jsonl
claude -p --resume "$ID" "<nudge>"             # resume by id (bare --continue is cwd-scoped)
```
- `--bare` for scripts/CI (no auto-discovery; auth via env). `--json-schema` for validated output.
  `--effort low|medium|high|xhigh|max` (no `ultra`). There is **no `--max-turns` on `-p`** — the
  lane cap is `--max-budget-usd` (a hard dollar ceiling). `--restricted` strips Bash/code-exec/
  WebFetch and confines file tools to `--add-dir` — the containment tier above `acceptEdits`.
- Stream observability: `--include-partial-messages`, `--forward-subagent-text`,
  `--include-hook-events`; the final `result` event carries usage — journal it.
- Fleet: `claude --bg "task"` → `claude agents --json` (id, state, pid, waitingFor, sessionId; also
  accepts `--model/--effort/--permission-mode` as launch defaults), `claude logs <id>`, `claude
  attach <id>`, `claude stop|kill <id>`, `claude rm <id>` (with worktree cleanup), `claude respawn`.
  Cloud lanes: `--cloud`, `--environment`, `--from-pr`, `--teleport`.
- Auto mode gates subagent hand-back through a safety classifier (2.1.269+) — an extra signal,
  never a gate substitute. Dynamic-workflow concurrency caps and usage-limit auto-pause/resume are
  host primitives (`shared-hosts.md`).
