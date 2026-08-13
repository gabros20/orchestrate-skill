# Engines — per-CLI invocation blocks (the catalog)

Purpose: Provide verified invocation, model, effort, and quirk facts for every external coding CLI an orchestration run may drive.

Read when:
- A dispatch shells out to an external engine, or a pin/flag/slug for one needs verifying.

Skip when:
- The run uses only the host's native subagents.

Inputs:
- Engine choice, task text, working directory, sandbox and approval posture, and output path.

Produces:
- A correct, verified CLI invocation and the engine-specific caveats that keep it honest.

## Contents

- Codex (`codex exec`) — the most script-friendly
- Grok (`grok -p`)
- Claude Code as a subprocess (for symmetry / cross-account)
- Cursor (`cursor-agent`)
- Antigravity CLI (`agy`)
- opencode (`opencode run`)
- Hermes (`hermes -z`)
- Kimi (`kimi -p`)
- Pi (`pi -p`)

This is the catalog behind `strategy-xcli.md` — that file holds the rules, lane hardening, and
division of labor; this one holds the per-engine facts, which grow with every engine and drift
with every release. **Verify flags before trusting them** — run `<cli> --help` once per session
before scripting against it; every verified date below is the day the fact was checked, not a
guarantee it still holds.

## Codex (`codex exec`) — the most script-friendly

```bash
codex --version && codex login status          # preflight; not logged in → user runs `codex login`
OUT=$(mktemp)
codex exec --cd /path/to/repo \
  -m gpt-5.6-terra -c model_reasoning_effort=high \
  --sandbox workspace-write \
  -o "$OUT" \
  "Full task: goal, constraints, files to touch, definition of done." </dev/null
cat "$OUT"; git -C /path/to/repo status --short   # read result; inspect what it actually changed
```
- `</dev/null` is MANDATORY in scripts — open stdin makes codex wait forever. Long prompt →
  `codex exec [flags] - < task.md`.
- Structured output: `--output-schema schema.json` (validated) · events: `--json` (JSONL:
  `thread.started/turn.completed/item.completed/error`).
- Models (verified 2026-07-13): `gpt-5.6-sol` (flagship — reasoner/advisor/peer tier),
  `gpt-5.6-terra` (balanced — standard worker/reviewer), `gpt-5.6-luna` (cheap — mechanical
  worker); `gpt-5.5`/`gpt-5.4[-mini]` remain available. Re-verify before pinning: model lists
  drift (`codex exec -m <slug>` errors loudly on an unknown slug).
- Reasoning effort: `-c model_reasoning_effort=none|minimal|low|medium|high|xhigh|max` (medium
  default; enum live-verified against codex 0.144.3 on 2026-08-07 — **there is no `ultra`**, an
  unknown value errors loudly). Effort is the first cost knob (`shared-model-routing.md` rule 8).
- Approvals: `-a untrusted|on-request|never`; network inside sandbox:
  `-c sandbox_workspace_write.network_access=true`. NEVER `--dangerously-bypass-approvals-and-sandbox`.
- Follow-up same session: `codex exec resume --last "…" </dev/null` (cwd-scoped).
- Monitor/session store: `$CODEX_HOME` (default `~/.codex`). Codex-as-MCP: `codex mcp-server`.

## Grok (`grok -p`)

```bash
grok -p "task" --output-format json          # plain|json|streaming-json
grok --cwd /path -m <model> -s "$(uuidgen)" -p "task"   # session id MUST be a UUID (CLI ≥0.2.x)
grok -r <id> -p "follow-up"                  # resume; -c = continue last
```
- Models (verified 2026-07-14 API / 2026-07-20 CLI): the flagship is **`grok-4.5`** (500k
  context, built for coding/agentic work, reasoning effort `low|medium|high`, high default) — grok
  CLI 0.2.106 now defaults to it as the sole listed model too. Lists drift — run `grok models`
  before pinning.
- Approval is all-or-nothing (`--always-approve`) — prefer read-only tasks, or babysit.
- Sessions on disk: `~/.grok/sessions`. Long-lived JSON-RPC: `grok agent stdio` (ACP).
- No reasoning-effort flag in the CLI; effort is an API-side knob.

## Claude Code as a subprocess (for symmetry / cross-account)

```bash
claude -p --bare --output-format stream-json --max-turns 30 \
  --model sonnet --permission-mode acceptEdits \
  --agents '{"worker":{"description":"…","prompt":"…"}}' "task"
```
- `--bare` for scripts/CI (no auto-discovery; auth via env). `--json-schema` for validated output.
- Background fleet: `claude --bg "task"` → monitor `claude agents --json`, `claude logs <id>`,
  attach with `claude attach <id>`. Session lookup is cwd-scoped for `--resume`.

## Cursor (`cursor-agent`)

```bash
cursor-agent -p "task" --model <id> --output-format json
```
- Headless GOTCHA: in `-p` mode the agent's ask-user tool auto-receives "skipped by user" — a
  headless Cursor worker silently skips its own clarification gates. Anything human-gated needs
  ACP (`cursor-agent acp`, JSON-RPC over stdio with real blocking ask/permission requests) or an
  interactive session — never bare `-p`.
- Native `--worktree <name>`; when Cursor is the CONTROLLER, `.cursor/agents/*.md` subagents give
  parallel + background dispatch with per-agent `model:` pinning (depth 1).

## Antigravity CLI (`agy`)

```bash
agy -p "task" --cwd /path/to/repo     # the one vendor-documented headless form
```
- Flag surface beyond `-p`/`--cwd` (output format, approvals, non-interactive auth) is
  under-documented — probe `agy --help` yourself before scripting; treat blog-reported flags as
  rumors. Auth is keyring/OAuth (no confirmed CI path).
- Interactive `agy` is orchestration-strong (async subagents to depth 10, `/agents` panel,
  any-to-any send_message, per-subagent worktrees) but subagents inherit the parent model — for
  tier separation, pin the model per PROCESS instead.

## opencode (`opencode run`)

```bash
opencode run "task" --model <provider/model> --agent <name>
```
- In-session delegation is synchronous — for N-way parallelism run N `opencode run` processes in
  separate worktrees (or drive `opencode serve` + its SDK from the controller).
- `.opencode/agents/*.md` pin model + granular permissions per agent; its `question` tool gives
  structured ask-user in interactive runs.

## Hermes (`hermes -z`)

```bash
hermes -z "task"                      # clean stdout one-shot; also: hermes chat -q --quiet
```
- Its internal per-task model override is accepted then silently ignored (open upstream bugs) —
  pin the model per PROCESS (`hermes -z --model <id>`), one invocation per tier.
- `clarify` (its ask-user) times out after ~120s then proceeds on best judgment, and is blocked
  inside leaf subagents — keep human gates at the controller level. Also ships an
  OpenAI-compatible API server + JSONL batch runner for fleet-style use.

## Kimi (`kimi -p`)

```bash
kimi --version && kimi doctor                 # preflight; not logged in → user runs `kimi login` (device-code OAuth)
cd /path/to/repo && kimi -p "Full task: goal, constraints, files to touch, definition of done." \
  -m k3 --output-format text </dev/null   # no cwd flag — cd first; stdin undocumented, `</dev/null` defensively
```
- `--output-format text|stream-json` (only valid with `-p`) — `text` prefixes thinking/assistant
  lines with `•`; `stream-json` emits one JSON object per line.
- `-p` forces the `auto` permission policy — no approval gating exists headless (rejects
  `--yolo`/`--auto`/`--plan`); worktree + diff review is the ONLY containment.
- Models: `k3` (flagship, up to 1M context, `reasoning_effort: low|high|max`, default `high`) ·
  `kimi-for-coding` (256k, balanced worker) · `kimi-for-coding-highspeed` (6× speed at 3× quota —
  not a cheap tier, none exists). Effort has NO CLI flag — set via `/effort`,
  `[models."<alias>".overrides]` in config.toml, or the `KIMI_MODEL_*` env channel; switching
  model or effort mid-session invalidates the prompt cache.
- No programmatic quota check headless (`/usage` is TUI-only, rejected in `-p` mode) — don't
  dispatch a fleet assuming quota headroom.
- Kimi workers carry their OWN subagents (`Agent`/`AgentSwarm`) — nested orchestration multiplies
  spend like any unbudgeted fan-out; instruct workers not to swarm unless intended.
- Poisoned-session landmine: malformed tool-call JSON can wedge a session into permanent HTTP 400
  loops with no self-recovery — kill and restart as a NEW session, never resume a wedged run
  (legacy-tracker provenance; re-verify before trusting it as fixed).
- Resume: `-c` (most recent session, cwd-scoped) · `-S <id>` (specific; bare = picker) — mutually
  exclusive.
- State: `~/.kimi-code` (`KIMI_CODE_HOME` relocates it), sessions cwd-scoped underneath.
- CI env: `KIMI_CODE_NO_AUTO_UPDATE=1` (skip update preflight), `KIMI_DISABLE_TELEMETRY=1`.
- Legacy Python `MoonshotAI/kimi-cli` is a DIFFERENT tool (verified 2026-07-20 against live
  0.28.0) — its flags (`--print`, `--input-format`, `--quiet`, `--final-message-only`) are absent
  from kimi-code 0.28.0; never cite them.

## Pi (`pi -p`)

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent   # install; auth: interactive /login or provider env key
pi --version                                  # preflight; run `pi --help` before first scripting — facts below are docs-verified only
cd /path/to/repo && pi -p -nc --no-session \
  --model <provider>/<model> --thinking high \
  @brief.md "Execute this brief: goal, constraints, files to touch, definition of done." \
  </dev/null > "$(mktemp)" 2>&1        # no cwd flag — cd first; piped stdin becomes message content, so close it
git status --short                            # inspect what it actually changed
```
- **Provider-agnostic carrier — it brings NO lineage of its own.** `--model <provider/id>` (plus a
  `:thinking` shorthand like `sonnet:high`), `--provider`, `--list-models`; auth is the user's via
  `/login` OAuth (Claude Pro/Max, ChatGPT Plus/Pro, Copilot) or a provider API-key env var. The
  lineage and tier are whatever model it pins — a Pi lane never counts as an extra vote in a
  cross-lineage panel. Its value: reaching a model or **subscription quota** no other lane offers.
- Effort is a first-class flag: `--thinking off|minimal|low|medium|high|xhigh|max` — model AND
  effort pin on one command line (`shared-model-routing.md` rule 1 satisfied natively).
- Structured events: `--mode json` emits JSONL (first line = session header; the final
  authoritative message arrives in `message_end`, `agent_end` closes) — e.g.
  `pi --mode json "task" 2>/dev/null | jq -c 'select(.type == "message_end")'`. A JSON-RPC
  stdin/stdout surface exists via `--mode rpc`.
- **No sandbox and no approval prompts AT ALL** — built-in tools (`read`/`bash`/`edit`/`write`/…)
  run with the pi process's full user permissions, and headless modes (`-p`, `--mode json/rpc`)
  bypass even the project-trust prompt. Worktree + diff review is the MINIMUM containment; the
  vendor's own guidance for untrusted work is a container/VM with only the files and credentials
  the task needs.
- Loads `AGENTS.md`/`CLAUDE.md` by default — the codex AGENTS.md-refusal gotcha applies. For a
  hermetic lane pass `-nc` (`--no-context-files`) and `--no-extensions`; project-local resources
  are gated by `defaultProjectTrust` in `~/.pi/agent/settings.json` (`-a`/`-na` per-run override).
- Sessions: `~/.pi/agent/sessions/` (cwd-organized) — resume `-c` (most recent) or
  `--session <path|id>`, branch with `--fork`; `--no-session` keeps fleet one-shots ephemeral.
- Intentionally minimal: no built-in MCP, subagents, or background bash (extensions can add them) —
  a Pi worker is a true leaf; unlike Kimi it will not swarm on its own.
- Docs-verified 2026-08-13 against pi.dev/docs/latest — no live install checked; verify the flag
  surface with `pi --help` before scripting against it.
