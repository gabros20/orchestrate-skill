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

Live-verified 2026-09-28, Claude Code 2.1.284 (Sonnet 5.5 launch day); flags from `claude --help`.

- **Models.** `claude-sonnet-5-5` (Sonnet 5.5: 1M ctx, 128k out, $2/$10 per M — Sonnet 5's price,
  ~30% faster, fewer tokens per task; adaptive thinking, Claude Code default effort `medium`) ≈
  worker/reviewer. `claude-opus-5-5` (Opus 5.5: $4/$20, default `medium`, thinking always on) ≈
  orchestrator/reasoner. `claude-fable-5-1` ($10/$50) = hardest reasoning. `haiku` = 4.5 until
  Haiku 5.5 ships. Effort levels are recalibrated per model — re-sweep, never carry a setting over.
- **Aliases move server-side, mid-session — pin full ids.** On launch day, same 2.1.284 binary,
  `--model sonnet` served `claude-sonnet-5`, then `claude-sonnet-5-5` ~30 min later (`opus` →
  `claude-opus-5-5`, `haiku` → `claude-haiku-4-5-20251001`). `board launch` journals the served id from `modelUsage` as the
  receipt's `served`; an alias resolving shows in `board agents` as `sonnet = claude-sonnet-5`, a
  pinned id served by another model is drift.
- **API-level changes a lane parser meets** (Opus 5.5, Sonnet 5.5): text between tool calls
  arrives in `thinking` blocks, empty by default — progress streaming goes quiet, the `result`
  usage is unaffected. Thinking can't be turned off on Opus 5.5 / Fable; Sonnet 5.5's lowest
  setting is `between_tools` (API-only, `high` effort or below).

```bash
ID=$(uuidgen)
claude -p --session-id "$ID" --output-format stream-json --verbose --include-partial-messages \
  --model claude-sonnet-5-5 --effort medium --permission-mode acceptEdits --max-budget-usd 2.00 \
  --agents '{"worker":{"description":"…","prompt":"…"}}' "$(cat spec.md)" > events.jsonl
board dispatch N --agent impl-N-claude --model claude-sonnet-5-5 --engine claude --session "$ID" --log raw/lane-N.jsonl
claude -p --resume "$ID" "<nudge>"             # resume by id (bare --continue is cwd-scoped)
```
- `-p --output-format stream-json` REQUIRES `--verbose` (exit 1 otherwise — observed live 2026-09-16 on
  2.1.273; `board launch` passes it). `--bare` is for CI with `ANTHROPIC_API_KEY` in the env ONLY: it
  also skips the login credential, so under a subscription login the lane returns "Not logged in ·
  Please run /login" as a one-turn `result` (observed live 2026-09-16) — `board launch` never passes
  it; add `--extra='--bare'` knowingly. `--json-schema` for validated output.
  `--effort low|medium|high|xhigh|max`. **`ultracode` is not an effort**: `xhigh` + Claude planning
  its own dynamic workflows (up to 16 concurrent agents) — `board launch` refuses it, and every Claude
  lane runs with `CLAUDE_CODE_DISABLE_WORKFLOWS=1` (also defeats a user's `"ultracode": true`); the
  `ultracode` keyword never triggers from a `-p` prompt (2.1.210+). There is **no `--max-turns` on
  `-p`** — the lane cap is `--max-budget-usd`. `--restricted` strips Bash/code-exec/WebFetch and
  confines file tools to `--add-dir` — the containment tier above `acceptEdits`.
- New on 2.1.284: `--permission-prompts none` (anything that would prompt is denied, never
  waits) · `--no-session-persistence` (unresumable — never on a lane) · `--fallback-model a,b` (a
  fallback serving the lane shows as drift) · `--autocompact <auto|100k–1M>` ·
  `--exclude-dynamic-system-prompt-sections` (better cross-lane cache reuse) · permission modes
  `acceptEdits|auto|bypassPermissions|manual|dontAsk|plan`. Documented but not in 2.1.284's help:
  `--advisor <model>` (accepted, hidden), `--exec`, `--ref`, `--append-subagent-system-prompt` —
  probe before relying on them.
- Stream observability: `--include-partial-messages`, `--forward-subagent-text`,
  `--include-hook-events`; the final `result` event carries usage — journal it.
- Fleet: `claude --bg "task"` → `claude agents --json` (id, state, pid, waitingFor, sessionId; also
  accepts `--model/--effort/--permission-mode` as launch defaults), `claude logs <id>`, `claude
  attach <id>`, `claude stop|kill <id>`, `claude rm <id>` (with worktree cleanup), `claude respawn`.
  Cloud lanes: `--cloud`, `--environment`, `--from-pr`, `--teleport`.
- Auto mode gates subagent hand-back through a safety classifier (2.1.269+) — an extra signal,
  never a gate substitute. Dynamic-workflow concurrency caps and usage-limit auto-pause/resume are
  host primitives (`shared-hosts.md`).
