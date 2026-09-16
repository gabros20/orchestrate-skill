# Codex (`codex exec`) — engine block

Purpose: Provide the verified launch, resume, receipt, model and quirk facts for Codex CLI lanes.

Read when:
- A dispatch, resume, nudge or receipt involves `codex`.

Skip when:
- The run never shells out to Codex.

Inputs:
- The brief as a spec file, the cwd, sandbox posture, output path, and the session id after launch.

Produces:
- A launch that cannot silently misfire, a resumable cached session, and a journaled usage receipt.

Live-verified 2026-09-16, codex 0.154.0, ChatGPT account. Probe `codex exec --help` once per
session — flags drift per release (`shared-lane-hygiene.md` rule 1).

```bash
codex --version && codex login status          # preflight; not logged in → user runs `codex login`
OUT=$(mktemp); SPEC=$(mktemp -t codex-spec.XXXXXX)   # brief → spec file (never inline quoting)
codex exec --cd /path/to/repo -m gpt-6-astra -c model_reasoning_effort=high \
  --sandbox workspace-write -c sandbox_workspace_write.network_access=true \
  --worktree --json -o "$OUT" - < "$SPEC" > events.jsonl 2> stderr.txt
ID=$(head -1 events.jsonl | python3 -c 'import json,sys; print(json.load(sys.stdin)["thread_id"])')
board dispatch N --agent impl-N-codex --model gpt-6-astra --engine codex --session "$ID" --log raw/lane-N.jsonl
cat "$OUT"; git -C /path/to/repo status --short   # read the result; inspect what it actually changed
```
- Prompt from stdin with `-`; a positional prompt needs `</dev/null` or codex waits forever.
  Run lanes through a wrapper script with explicit redirects — a background shell can drop them.
- **Session id** = `thread.started` (first `--json` event). Resume by id, never `--last` (cwd-scoped,
  hijacked by any later run in the repo): `codex exec resume <ID> -c model_reasoning_effort=…
  -c 'sandbox_mode="workspace-write"' -o "$OUT" --json - < nudge.md` — `resume` takes
  `-c/-m/-i/-o/--json` but **not `--sandbox`**, and ignores a positional prompt when stdin is
  redirected. Store: `$CODEX_HOME/sessions/<y>/<m>/<d>/rollout-*-<id>.jsonl`; `codex resume --all`
  lifts the cwd filter when browsing.
- **Nudge a running lane** without attaching: `codex queue --thread <ID> --message "…"`.
- Structured output `--output-schema schema.json`; events `--json` (`thread.started` /
  `turn.started` / `item.completed` / `turn.completed{usage}` / `error`). `turn.completed.usage` is
  the receipt (`board return --tokens`) — journal the ROOT turn only: nested subagent tokens
  already roll up into it (0.151+), counting them twice overstates the run.
- Models: **`gpt-6-astra`** (flagship — reasoner/advisor/peer; efforts `low..max` + `ultra`; needs
  client ≥0.153), `gpt-5.6-sol`, `gpt-5.6-terra` (balanced — worker/reviewer), `gpt-5.6-luna`
  (cheap — research/mechanical; tops at `max`), `gpt-5.5`. Catalog: `~/.codex/models_cache.json`.
- Effort `-c model_reasoning_effort=low|medium|high|xhigh|max|ultra` — `ultra` = maximum reasoning
  with automatic delegation (sol/terra/astra). Unknown values error loudly.
- Multi-agent: `[features] multi_agent = true` (stable; `multi_agent_v2` exists, unstable). Agents:
  `~/.codex/agents/<name>.toml` — `name`, `description`, `model`, `model_reasoning_effort`,
  `developer_instructions`, optional `sandbox_mode` (NOT `sandbox`); pin cheap research tiers there.
- Sandbox `--sandbox read-only|workspace-write|danger-full-access`; network inside via
  `-c sandbox_workspace_write.network_access=true`. `exec` takes **no `-a`** (0.149+);
  `--approve-for-me` routes approvals through automatic review under workspace-write. NEVER
  `--dangerously-bypass-approvals-and-sandbox`. Web search is top-level `codex --search` only —
  `exec` has no search flag and no `web_search` config key exists.
- Guardian (0.153+): a vendor-side approval-review layer that survives compaction and isolates
  subagent history — an extra independent signal, never a substitute for the spec/quality gates.
- Fleet view `codex agents` (every session on the app-server daemon); `codex review --base <branch>
  | --commit <sha>` is a non-interactive review lane; `codex features list` shows flags live. There
  is **no `codex mcp-server`** — `codex mcp` manages EXTERNAL servers; `codex app-server` is the
  experimental daemon (unverified as an MCP entry point).
- **A Codex lane cannot launch Codex lanes**: nested `codex exec` inside the workspace-write sandbox
  fails with `failed to initialize in-process app-server client: Operation not permitted` (observed
  live 2026-09-16, 0.154). A Codex sub-orchestrator therefore plans, writes its workers' briefs,
  journals `board todo N.1`, and asks the controller to launch them `--by <lead>`; the controller
  owns the processes, the lead owns the subtree (`strategy-hierarchical.md`, worker-control rule).
- Quota: `error … usage limit … try again at <time>` → `BLOCKED` with the reset time, resume the
  same session after it (97% cache hits observed); never retry-loop. Exit 0 + empty diff + a
  polite decline = `REFUSED` (`strategy-xcli.md`): the global `~/.codex/AGENTS.md` governs every
  lane — declare the opt-out in the spec preamble.
