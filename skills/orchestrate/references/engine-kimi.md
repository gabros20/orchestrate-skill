# Kimi (`kimi -p`) — engine block

Purpose: Provide the headless launch, model, quota and swarm facts for Kimi Code CLI lanes.

Read when:
- A dispatch shells out to `kimi`, or a panel needs the Moonshot lineage vote.

Skip when:
- No Kimi lane is planned.

Inputs:
- The brief inline, model alias, output format, and the session id for resume.

Produces:
- A stream-json lane on the `auto` permission policy; containment = worktree + diff review.

Live-verified 2026-07-20 (kimi-code 0.28.0); docs-checked 2026-09-16 (0.41.0) — re-probe
`kimi --help` before scripting.

```bash
kimi --version && kimi doctor                 # preflight; not logged in → user runs `kimi login`
cd /path/to/repo && kimi -p "$(cat spec.md)" -m k3 --output-format stream-json </dev/null > events.jsonl
kimi -S <id> -p "<nudge>"                     # resume by id (-c = most recent, cwd-scoped) — never resume a wedged session
```
- `--output-format text|stream-json` (only with `-p`); no `--cwd` — `cd` first. `-p` forces the
  `auto` permission policy (rejects `--yolo`/`--auto`/`--plan`) — no headless gating exists.
- Models: `k3` (flagship, 1M context, `reasoning_effort: low|high|max`) · `kimi-for-coding`
  (256k, balanced) · `kimi-for-coding-highspeed` (6× speed at 3× quota — not a cheap tier). Effort
  has NO CLI flag (`/effort`, config overrides, or `KIMI_MODEL_*` env); switching model or effort
  mid-session invalidates the prompt cache.
- Since 0.33 the CLI runs agent-core-v2 by default and the **subagent pool is on by default** —
  instruct workers not to swarm unless intended (nested fan-out multiplies spend). Quota
  exhaustion fails fast since 0.30 (was a silent ~3-min retry); `/usage` remains TUI-only.
- Landmine: malformed tool-call JSON can wedge a session into permanent HTTP 400 loops — kill and
  start a NEW session. State `~/.kimi-code` (`KIMI_CODE_HOME`); CI env `KIMI_CODE_NO_AUTO_UPDATE=1`,
  `KIMI_DISABLE_TELEMETRY=1`. Tool names differ (`FetchURL`, `AgentSwarm`) — never brief with
  Claude names; skills read from `.kimi-code/skills/` + `.agents/skills/`.
