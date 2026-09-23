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

Live-verified 2026-09-16, Claude Code 2.1.273; model aliases re-verified live 2026-09-22 on 2.1.280
(the Claude Opus 5.5 launch day).

- **`--model opus` now resolves to `claude-opus-5-5`** (observed in the final `result` event's
  `modelUsage`, 2.1.280): Opus 5.5 — 1M context, 128k output, $4/$20 per M (20% under Opus 5,
  cache reads $0.20), default effort `medium`, adaptive thinking always on. Every run that pinned
  the `opus` tier moved with the alias; pin `claude-opus-5-5` (or `claude-opus-5`) explicitly
  when a run must be reproducible, and journal the observed id from `modelUsage` — an alias that
  moved is not model drift, a different family is. Two API-level changes ride along: thinking
  cannot be disabled (effort is the only knob), and text the model emits **between tool calls
  now arrives in `thinking` blocks that are empty by default** — a lane parser that streamed that
  text as progress goes quiet mid-turn; the `result` event's usage is unaffected.

```bash
ID=$(uuidgen)
claude -p --session-id "$ID" --output-format stream-json --verbose --include-partial-messages \
  --model sonnet --effort high --permission-mode acceptEdits --max-budget-usd 2.00 \
  --agents '{"worker":{"description":"…","prompt":"…"}}' "$(cat spec.md)" > events.jsonl
board dispatch N --agent impl-N-claude --model sonnet --engine claude --session "$ID" --log raw/lane-N.jsonl
claude -p --resume "$ID" "<nudge>"             # resume by id (bare --continue is cwd-scoped)
```
- `-p --output-format stream-json` REQUIRES `--verbose` (exit 1 otherwise — observed live 2026-09-16 on
  2.1.273; `board launch` passes it). `--bare` is for CI with `ANTHROPIC_API_KEY` in the env ONLY: it
  also skips the login credential, so under a subscription login the lane returns "Not logged in ·
  Please run /login" as a one-turn `result` (observed live 2026-09-16) — `board launch` never passes
  it; add `--extra='--bare'` knowingly. `--json-schema` for validated output.
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
