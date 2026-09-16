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
division of labor; `shared-lane-hygiene.md` holds the launch/resume/quota discipline that every
subprocess engine shares; this one holds the per-engine facts, which grow with every engine and drift
with every release. **Verify flags before trusting them** — run `<cli> --help` once per session
before scripting against it; every verified date below is the day the fact was checked, not a
guarantee it still holds.

## Codex (`codex exec`) — the most script-friendly

```bash
codex --version && codex login status          # preflight; not logged in → user runs `codex login`
codex exec --help | grep -E '^\s+-'            # flags drift per release — probe once per session
OUT=$(mktemp); SPEC=$(mktemp -t codex-spec.XXXXXX)   # brief → spec file (never inline quoting)
codex exec --cd /path/to/repo \
  -m gpt-6-astra -c model_reasoning_effort=high \
  --sandbox workspace-write -c sandbox_workspace_write.network_access=true \
  -c web_search=live -i screenshot.png \
  --json -o "$OUT" - < "$SPEC" > events.jsonl 2> stderr.txt
cat "$OUT"; git -C /path/to/repo status --short   # read result; inspect what it actually changed
```
- Prompt from stdin with `-` (long briefs); a positional prompt needs `</dev/null` or codex waits
  forever. **Run lanes through a wrapper script** with explicit redirects — a background shell can
  drop them, and "Reading prompt from stdin…" with no output file is the symptom.
- Structured output: `--output-schema schema.json` (validated) · events: `--json` (JSONL:
  `thread.started/turn.started/item.completed/turn.completed{usage}/error`) — `turn.completed`
  carries input/cached/output/reasoning token counts: journal them (`board return --tokens`).
- Models (live-verified 2026-09-16, codex 0.154.0, ChatGPT account): **`gpt-6-astra`** (flagship —
  reasoner/advisor/peer; efforts `low..max` + `ultra`), `gpt-5.6-sol` (previous flagship),
  `gpt-5.6-terra` (balanced — worker/reviewer), `gpt-5.6-luna` (cheap — research/mechanical
  worker), `gpt-5.5`. Astra needs client ≥0.153 — `-m gpt-6-astra` on 0.149 errors "not supported
  with a ChatGPT account". Catalog on disk: `~/.codex/models_cache.json` (slugs + effort enums).
- Reasoning effort: `-c model_reasoning_effort=low|medium|high|xhigh|max|ultra` — **`ultra` =
  "maximum reasoning with automatic task delegation"** (sol/terra/astra only; luna tops at `max`).
  An unknown value errors loudly. Effort is the first cost knob (`shared-model-routing.md` rule 8).
- **Multi-agent**: `[features] multi_agent = true` (stable). Custom agents are TOML files in
  `~/.codex/agents/<name>.toml`: `name`, `description`, `model`, `model_reasoning_effort`,
  `developer_instructions`, optional `sandbox_mode` (NOT `sandbox`). The parent spawns them by
  description; pin cheap research tiers there (luna @ max) and keep the expensive lane reading.
- Sandbox: `--sandbox read-only|workspace-write`; network inside: `-c sandbox_workspace_write.network_access=true`.
  **`codex exec` no longer accepts `-a`** (0.149+; approvals are a top-level/TUI concern) — a stale
  `-a never` fails the launch with "unexpected argument". NEVER `--dangerously-bypass-approvals-and-sandbox`.
- Worktrees: `codex exec --worktree` (0.154) starts the lane in a fresh git worktree natively.
- **Resume = same session, cached context** (a quota stall or timeout mid-lane costs no re-prime):
  `codex exec resume <SESSION_ID> -c model_reasoning_effort=… -c 'sandbox_mode="workspace-write"'
  -o "$OUT" --json - < nudge.md`. `resume` takes `-c/-m/-i/-o/--json` but **not `--sandbox`** (use
  the `sandbox_mode` config key), and **ignores a positional prompt when stdin is redirected** —
  pipe it. **Never `--last` from a controller**: it is cwd-scoped and any probe run in the same repo
  since (a model check, a luna ping) hijacks it — find the id in `~/.codex/sessions/<y>/<m>/<d>/
  rollout-*-<id>.jsonl` (grep the brief's title) and resume by id.
- Quota: ChatGPT-plan usage limits hit mid-lane as `error … usage limit … try again at <time>` —
  journal `BLOCKED` with the reset time, never retry-loop, resume the session after the reset.
  Exit 0 + empty diff + a polite decline is `REFUSED`, journaled as such (`strategy-xcli.md`).
- Monitor/session store: `$CODEX_HOME` (default `~/.codex`). Codex-as-MCP: `codex mcp-server`.

## Grok (`grok -p`)

```bash
grok -p "task" --output-format json          # -p/--single; plain|json|streaming-json
grok --cwd /path -m grok-4.6 --reasoning-effort high -s "$(uuidgen)" --prompt-file spec.md
grok -w wt-name -p "task"                    # -w/--worktree: new git worktree for the session
grok -r <id> -p "follow-up"                  # resume by id/title; -c = continue last (cwd-scoped — prefer -r <id>)
```
- Models (live-verified 2026-09-16, grok CLI 1.0.25): default and sole listed model **`grok-4.6`**;
  `grok models` lists what the account sees — run it before pinning.
- `--reasoning-effort <EFFORT>` exists in the CLI now (1.0.x); `--prompt-file` replaces inline
  quoting; `--json-schema`, `--agents <JSON>` / `--agent <NAME>`, `--no-subagents`, `--max-turns`,
  `--sandbox <PROFILE>`, `--permission-mode`, `--allow/--deny` rules, `--disable-web-search`.
- Approval: `--always-approve` is all-or-nothing — prefer read-only tasks, or babysit.
- Sessions on disk: `~/.grok/sessions`. Long-lived JSON-RPC: `grok agent stdio` (ACP).

## Claude Code as a subprocess (for symmetry / cross-account)

```bash
claude -p --bare --output-format stream-json --max-turns 30 \
  --model sonnet --effort high --permission-mode acceptEdits \
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
opencode run "task" --model <provider/model> --variant high --agent <name> --format json
opencode run -f spec.md -s <session> "continue"   # -f attaches files; -s resumes by id, -c continues last
```
- (live-verified 2026-09-16, opencode 1.18.27) `--format json` streams raw JSON events;
  `--variant` is the provider-specific reasoning effort (high/max/minimal); `--auto` auto-approves
  permissions (dangerous — leave off); `--fork`, `--attach <server-url>`, `--dir`.
- In-session delegation is synchronous — for N-way parallelism run N `opencode run` processes in
  separate worktrees (or drive `opencode serve` + its SDK from the controller).
- `.opencode/agents/*.md` pin model + granular permissions per agent; its `question` tool gives
  structured ask-user in interactive runs.

## Hermes (`hermes -z`)

```bash
hermes -z "task" --model <id> --usage-file usage.json   # clean stdout one-shot; also: hermes chat -q
hermes -z "task" --worktree                              # new git worktree; --resume <id> / --continue [name]
```
- (live-verified 2026-09-16, Hermes 0.18.2) `--usage-file PATH` writes a JSON usage report
  (estimated cost, token counts, model, api_calls) after a one-shot — journal it
  (`board return --tokens`). `--worktree`, `--resume SESSION`, `-t TOOLSETS`, `--provider`.
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
