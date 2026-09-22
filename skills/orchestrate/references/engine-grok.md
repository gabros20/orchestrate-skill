# Grok (`grok -p`) — engine block

Purpose: Provide the verified launch, session, receipt, model and quirk facts for Grok CLI lanes.

Read when:
- A dispatch, resume or receipt involves `grok`.

Skip when:
- The run never shells out to Grok.

Inputs:
- The brief as a prompt file, the cwd, a pre-generated session id, and the output path.

Produces:
- A launch with a known session id, a resumable session, and a `grok usage` receipt.

Live-verified 2026-09-22, grok 1.0.40. Probe `grok --help` and `grok models` once per session.

```bash
ID=$(uuidgen)                                  # pin the session id BEFORE launch — no store grep later
grok --cwd /path/to/repo -m grok-4.7 --reasoning-effort high -s "$ID" \
  --prompt-file spec.md --output-format json > out.json 2> stderr.txt
board dispatch N --agent task-N-grok --model grok-4.7 --engine grok --session "$ID" --log raw/lane-N.json
grok usage "$ID"                               # token/cost receipt per session (or per turn) → board return --tokens
grok -r "$ID" --prompt-file nudge.md           # resume by id (-c = continue "last": cwd-scoped, never from a controller)
grok -w wt-name --prompt-file spec.md          # -w/--worktree: a new git worktree for the session
```
- Models (`grok models`, 1.0.40): **`grok-4.7`** (default; xAI's frontier model since 2026-09-21,
  500k context, $2/$6 per M in/out under 200k prompt, $4/$12 above) · `grok-4.7-build-fast` (the
  same model on faster serving: about 2× output speed at 2× the price — measured live, one
  turn ≈30k tokens cost $0.034 against $0.021; a latency lane, never a cheap tier) · `grok-4.6` ·
  `grok-4.5`. `grok models` lists what the account sees — run it before pinning; lists drift.
- Receipt naming: a lane pinned `-m grok-4.7` reports `modelUsage` under **`grok-4.7-build`**
  (the fast variant under `grok-4.7-build-fast`). That is the same model, not drift — do not pass
  it as `--observed-model`; `-m grok-4.7-build` itself is refused ("unknown model id").
- `--reasoning-effort` (alias `--effort`) takes **`low|medium|high|xhigh`** only — `max` and
  `minimal` are errors before the model runs; `board launch --engine grok` refuses them up front.
- `-p`/`--single` are one flag (both spellings work). `--prompt-file` replaces inline quoting;
  `--json-schema`, `--agents <JSON>` / `--agent <NAME>`, `--no-subagents`, `--max-turns` (the lane
  cap), `--sandbox <PROFILE>` (env `GROK_SANDBOX`), `--permission-mode
  default|acceptEdits|auto|dontAsk|bypassPermissions|plan`, `--allow/--deny`, `--tools` /
  `--disallowed-tools`, `--disable-web-search`, `--rules <RULES>`, `--system-prompt-override`,
  `--fork-session`, `--prompt-json`, `--worktree-ref` (1.0.40 additions).
- `--output-format plain|json|streaming-json|streaming-messages-json` — the last is the Anthropic
  Messages wire format, so one Claude `stream-json` parser serves both engines.
- Approval: `--always-approve` is all-or-nothing — prefer read-only tasks, or babysit.
- Observability: `grok dashboard` (every session incl. subagents), `grok trace <ID>`, `grok export
  <ID>` (Markdown transcript). Sessions on disk: `~/.grok/sessions`. Long-lived modes: `grok agent
  stdio` (ACP) · `headless` · `serve` · `leader`. Custom agent types in `.grok/agents/`; hook
  events (`PreToolUse` … `SubagentStop`, `TaskCompleted`) in `~/.grok/user-settings.json`.
- Host quirk: reads `.claude/` (skills/rules/agents) wholesale — a repo carrying Claude config
  configures Grok too; skills load at session start only.
