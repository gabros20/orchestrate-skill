# Hosts — running orchestrate on any Agent-Skills agent

Orchestrate is written against six abstract primitives; Claude Code binds all of them natively,
other hosts bind a subset. This file is the adapter: detect your host, look up the bindings,
degrade honestly where a binding is missing. Strategy files stay written in Claude Code terms
(the reference host) — non-Claude hosts translate through the tables here.

**Facts drift.** The matrix below was researched 2026-07-14 against vendor docs. Before relying
on a binding you haven't used this session, verify it (`<cli> --help`, probe your own toolset) —
same rule as xcli flags.

## Detect your host (zero tool calls — look at your own toolset)

| You have… | You are on |
|---|---|
| an Agent/Task tool + AskUserQuestion | **Claude Code** — every binding native; you can stop reading this file |
| `invoke_subagent` / `send_message` / `ask_question` | **Antigravity** (IDE or `agy` CLI) |
| a `skill` tool that loads skills by name | **opencode** |
| `delegate_task` + `clarify` | **Hermes** |
| TOML agents in `~/.codex/agents`, `apply_patch`, sandbox modes | **Codex CLI** |
| `.cursor/agents` subagents, `--worktree` sessions | **Cursor CLI** |
| `/goal`, `/loop`, `/fork` slash commands + auto-worktree subagents | **Grok Build** |

Record the resolved host in `.orchestrate/run.md` next to the dimensions. If detection is
ambiguous, ask the user — a wrong host assumption mis-binds every dispatch after it.

## Capability matrix

| Primitive | Claude Code | Codex | Cursor | Antigravity | opencode | Grok Build | Hermes |
|---|---|---|---|---|---|---|---|
| DISPATCH (spawn subagent) | ✅ Agent tool, depth 5 | ✅ agents TOML, 6 threads, depth 1 | ✅ agent files, depth 1 | ✅ `invoke_subagent`, depth 10 | ⚠️ synchronous only | ✅ up to 8, auto-worktree | ⚠️ `delegate_task`, 3, flat |
| …with per-dispatch model pin | ✅ | ✅ `model` + effort in TOML | ✅ `model:` frontmatter | ❌ inherits parent | ✅ agent file `model:` | ❌ unconfirmed | ❌ accepted, silently ignored |
| PARALLEL (N at once) | ✅ | ✅ (≤6) | ✅ + background | ✅ async by default | ❌ in-session | ✅ (≤8) | ⚠️ (≤3) |
| MESSAGE (inter-agent) | ✅ SendMessage / teams | ❌ | ❌ | ✅ `send_message` any-to-any | ❌ | ❌ | ❌ |
| ASK_USER (structured) | ✅ AskUserQuestion | ⚠️ TUI-only | ⚠️ broken in `-p`; ACP only | ✅ `ask_question` | ✅ `question` tool | ⚠️ free-form via `/plan` | ⚠️ `clarify`, 120s timeout |
| WORKTREE helper | ✅ isolation/EnterWorktree | ❌ plain git | ✅ `--worktree` | ✅ per-subagent option | ❌ plain git | ✅ automatic | ❌ plain git |
| BACKGROUND shell tasks | ✅ | ❌ nohup+poll | ✅ | ✅ `/tasks` | ⚠️ | ✅ | ⚠️ |
| LOOP (native re-feed) | ✅ Stop hook | ❌ | ❌ | ✅ Stop `decision:"continue"` + `/schedule` | ❌ | ✅ `/goal`, `/loop` | ❌ |
| Workflow-script engine | ✅ Workflow tool | ❌ | ❌ | ❌ (teamwork = paid preview) | ❌ (external SDK) | ❌ | ❌ |
| Headless worker mode | ✅ `claude -p` | ✅ `codex exec` | ✅ `cursor-agent -p` | ✅ `agy -p` (flags thin) | ✅ `opencode run` | ✅ `grok -p` | ✅ `hermes -z` |

## The degradation ladder (apply in order, state the step you landed on)

1. **Native binding** from the matrix above.
2. **xcli shell-out** — every host can run bash, so every host can drive any headless engine
   (`strategies/xcli.md` has per-engine invocation blocks). This recovers PARALLEL (N background
   processes in worktrees), model pinning (pick the engine/model per process), and DISPATCH depth.
3. **Solo with a warning** — do the work in-context, tell the user which strategy you couldn't
   honor and why. Never silently pretend a primitive worked.

Degradation is stated, never silent: write the landed-on bindings in run.md and say the downgrade
out loud ("team unavailable on codex → hierarchical with file handoff").

## Strategy availability by host

- Portable everywhere (natively or via ladder step 2): `staged` · `parallel` · `hierarchical` ·
  `advisor` · `adversarial` · `xcli` · `loop`.
  - opencode/Hermes parallel: N headless processes (or `opencode serve` + SDK), not in-session.
  - Loop outside Claude/Antigravity/Grok: external driver — `while :; do <cli> -p "$(cat
    prompt.md)" …; check_stop && break; done`, state in files + git per `strategies/loop.md`.
- `team`: Claude Code (experimental teams) or Antigravity (`send_message` approximates; no shared
  task list). Elsewhere → `hierarchical` with file-based handoff — artifact-first rules make this
  a mild downgrade.
- `workflow`: Claude Code only. Elsewhere → a controller-held driver script fanning out headless
  engines per item (keep workflow.md's pilot/budget/verify discipline), or `parallel`.
- Model-tier separation (`shared/model-routing.md`) on Antigravity/Grok/Hermes: per-dispatch pins
  don't exist — route tiered work through xcli engines, or run one model and use effort knobs.

## ASK_USER bindings

Claude Code `AskUserQuestion` · Antigravity `ask_question` (multi-choice) · opencode `question` ·
Codex `request_user_input` (interactive TUI only) · Hermes `clarify` (120s timeout, then the agent
proceeds on best judgment; blocked inside leaf subagents) · Cursor: interactive or ACP only — in
`-p` mode the question is auto-answered "skipped by user", so NEVER put a human gate inside a
headless Cursor worker · Grok: no structured primitive; ask free-form in an interactive session.
Universal fallback: stop and ask in plain conversation — a gate that can't render is still a gate.

## WORKTREE binding (canonical, works everywhere)

```bash
git worktree add /tmp/wt-<task> -b agent/<task>   # create
git worktree remove /tmp/wt-<task>                # mandatory cleanup (see shared/isolation.md)
```
Host accelerators (optional): Claude `isolation:"worktree"` / `--worktree` · Cursor `--worktree` ·
Grok subagents auto-worktree · Antigravity per-subagent worktree option.

## State & transcript paths (for monitoring/evolve deep reads)

| Host | Where state lives |
|---|---|
| Claude Code | `~/.claude/projects/<encoded-cwd>/<session>.jsonl` · daemon/jobs under `~/.claude/` |
| Codex | `$CODEX_HOME` (default `~/.codex`) — sessions/rollouts/logs |
| Grok Build | `~/.grok/sessions` |
| Cursor / Antigravity / opencode / Hermes | stores vary and drift — don't script against them; capture each run's `--json`/stream output to `.orchestrate/raw/` and read THAT |

## Per-host quirks that bite

- **Codex**: `codex exec` hangs forever on open stdin — always `</dev/null`. No background
  shells — long processes need `nohup … &` + polling the output file. Tool names differ from
  Claude's entirely (shell/apply_patch/…): never tell a Codex worker to "use the Edit tool".
- **Cursor**: headless ask-user is broken (above); custom slash commands don't work in the CLI —
  invoke the skill, not a command file.
- **Antigravity**: `agy -p` is confirmed but its flag surface (output format, approvals, CI auth)
  is under-documented — probe `agy --help` before scripting; no confirmed non-interactive auth.
  IDE and CLI use different global skill dirs (`~/.gemini/config/skills` vs
  `~/.gemini/antigravity-cli/skills`).
- **Gemini-lineage consent**: skill activation may show the user a confirmation prompt
  (Gemini CLI always; Antigravity may) — first activation isn't silent.
- **opencode**: delegation blocks the session — treat it as staged-only in-session; skills are
  invoked via its `skill` tool, there is no slash form.
- **Grok Build**: reads `.claude/` (skills/rules/agents) wholesale — a repo carrying Claude
  config effectively configures Grok too; skills load at session start only (adding one
  mid-session needs a new session); approvals are all-or-nothing (`--always-approve`).
- **Hermes**: skills live user-level (`~/.hermes/skills`, no confirmed project dir), invocation is
  explicit `/orchestrate` only (no description auto-trigger); its schema likes
  `version`/`author` frontmatter (we ship `version`); don't mutate context/toolset mid-session
  (its prompt-cache doctrine).

## Invocation names per host

Slash `/orchestrate`: Claude Code, Cursor, Antigravity CLI (skills auto-register as commands),
Hermes, Grok. Tool-call: opencode (`skill` tool). Codex: skills surface by name/description —
"use the orchestrate skill". Natural-language activation works on every host that auto-triggers
on description (all except Hermes).
