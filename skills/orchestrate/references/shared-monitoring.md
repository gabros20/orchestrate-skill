# Monitoring — watching agents you spawned

Purpose: Monitor background agents and external processes without duplicating work or flooding context.

Read when:
- Work continues asynchronously, may stall, or writes output outside the controller session.

Skip when:
- All dispatched work returns synchronously and immediately.

Inputs:
- Worker identifiers, process or session stores, output paths, timeouts, and stop rules.

Produces:
- Liveness checks, bounded polling, recovery action, and terminal status.

## Contents

- The board (any host)
- In-session (Claude Code)
- Background sessions · Session transcripts · Hooks
- Trajectory stalls — detecting the worker that hasn't noticed
- Waiting on external systems (stateful backoff)
- Rules

Match the surface to the mechanism; don't poll what notifies you.

## The board (any host)

`scripts/board` renders the journal + `.orchestrate/` as a live kanban in a pane the USER opens
(`board`; zero-install copy at `.orchestrate/board`). It re-renders on artifact deltas and keeps
two clocks per card: **artifact time** (deliverable mtimes — the only liveness signal, rule 3b)
and **heartbeat time** (`board note`, events — never liveness). `! stale` fires after 10 min
without an artifact delta on ANY open stint, reviewers included; a chatty worker cannot hide a
missing deliverable. It observes; it never transitions. Keep it honest by journaling every
dispatch AND return (`board dispatch N --agent <real id> --model M`, `board return N --agent
--status`) — a dispatch with no return is exactly the silence rule 3 is about. Recovery actions
are journaled too (`board nudge`, `board escalate N --to MODEL --why`), so the roster shows who was
nudged or escalated. **Tests and scripts are visible too**: run them THROUGH the journal —
`board exec N --name tests -- npm test` captures the log under `raw/`, journals exit + duration,
and the card shows `tests ok 12s` / `lint fail` (a `checks` line in the header counts them; a
failed check is an `x` in attention and blocks `board done`). Lanes are a projection: `board init
--lanes todo,implement,verify,review,integrate,done,blocked` shows a verifier's stint under
VERIFY and an integrator's under INTEGRATE — the state model underneath never changes.
**Mail** rides the same journal: a worker's `--ask` is a `?` in attention with the reply command
ready, `mail N unread · M for you` sits in the header, and `board inbox --agent controller` is
part of every liveness check (an unanswered ask is a worker parked in `board wait`). **The
controller's own watch is the journal, and the reliable primitive is a blocking wait that
exits**: `board wait --task N --timeout 0` in a background shell returns once per landing (0 =
its work is on disk, 3 = it cannot land: BLOCKED/REFUSED or a dead lane) — one clean
notification, CLI-agnostic, no stream to lose. A streaming tail (`board follow --for controller`:
one line per event that needs you, ends on `finish`; or a harness monitor) is a convenience on
top, never the only signal — observed: a harness stream delivered lane exits 10–17 min late,
twice. `board wait --agent controller` blocks until the next mail. Lanes started with
`board launch` journal their `exit` — a lane that exited with no return is `!`/`x` in attention
before the stale clock would have noticed; exit 125 means its dependency cannot land and its
engine never started (return it BLOCKED, fix the dependency, relaunch). Controller
side: `board attention` lists what to act on, most urgent first (`x` blocked / failed
gate / failed check, `!` stale, silent reviewer or a third attempt with no escalation, `?`
pending gate / concerns / mail for you); run `board check` at every liveness check and before any recovery
action — it lists journal-chain breaks, dispatched-never-returned, reviewer silence,
report-without-review, done over a failed gate or check, done with no gate ever opened, quality
before spec, xcli DONE without commits or without a usage receipt, model drift and budget
overrun, and exits 1 while any remain; `board check --replay` re-derives every card from the
journal alone and reports any fact that reached the disk without its journal line.

## In-session (Claude Code)

- Spawned subagents/background work: `/tasks` (list, attach, stop); named background subagents
  show in the @-mention typeahead with status. Harness-tracked work re-invokes you on completion
  — schedule a LONG fallback, never a short poll.
- Workflows: `/workflows` — phases, per-agent tokens, pause `p` / stop `x` / restart `r`; drill
  into any agent's prompt + tool calls. Journal: `<transcriptDir>/journal.jsonl` records each
  agent's actual return — read it before diagnosing an empty result.
- Teams: the agent panel (arrows + Enter to open a teammate, Escape interrupts); idle
  notifications arrive automatically; task list via Ctrl+T.
- Usage: `/usage` (by skills/subagents/MCPs) · bare `/goal` (turns + tokens so far).

## Background sessions (agent fleet on this machine)

```bash
claude agents --json        # id, state(working|blocked|done|failed|stopped), pid, waitingFor, sessionId
claude logs <id>            # recent output (persists ~5min after exit)
claude attach <id>          # step in when one is blocked
```
State files: `~/.claude/daemon/roster.json`, `~/.claude/jobs/<id>/state.json`.

## Session transcripts (deep record, cross-engine)

- Claude: `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl` — tail for live events, mine for
  post-hoc analysis (the evolve pass reads these). Convention, not documented API — verify the
  path exists before scripting against it.
- Codex: `$CODEX_HOME` (default `~/.codex`) — sessions/rollouts/logs. Grok: `~/.grok/sessions`.
  Kimi: `~/.kimi-code` (`KIMI_CODE_HOME`) — `sessions/<workDirKey>/<sessionId>/` with
  `state.json` + `agents/<id>/wire.jsonl` per subagent. Cursor/agy/opencode/Hermes: stores vary
  and drift — don't script against them.
- External CLI runs: capture `--json` / `--output-format streaming-json` to a file per run and
  tail THAT — more stable than their internal stores (and the only portable option on hosts
  whose stores aren't documented — `shared-hosts.md`).

## Hooks (mechanical enforcement, not observation)

- `SubagentStop` → append to a progress ledger + run a validator as a hard gate (the
  brease-factory pattern: hooks enforce, orchestrator trusts the ledger).
- `TeammateIdle` / `TaskCompleted` → exit code 2 blocks + sends feedback ("keep working", "task
  isn't done: X missing").
- `Stop` → the Ralph loop re-feed (`strategy-loop.md`).
- Optional heavier rigs (OTel export, hook→HTTP→dashboard) exist; reach for them only when
  running fleets daily — one dashboard is worth less than one good ledger.

## Trajectory stalls — detecting the worker that hasn't noticed

The instruments above bound how long a run may thrash; none of them *detect* thrashing, and
BLOCKED-only escalation never sees the worker that is confidently going nowhere. Five countable
controller-side signals, read from the ledger, artifacts and raw logs with no extra
infrastructure: the same action returning the same observation ~3× · one error class ~3× back to
back · two actions alternating ~4× within the last ~8 · rewrite→retest→fail cycles (here the agent
never repeats an *identical* action, so naive loop detection stays silent) · no successful
execution for N steps. **Progress means a successful execution, not a file rewrite** — counting
rewrites as progress is exactly what lets a thrashing agent look healthy. The thresholds are
illustrative defaults from one working-code source, chosen by reasoning rather than by benchmark;
tune them per run.

Run the detector scan at every liveness check and before any recovery action — a detector that
never runs detects nothing; there is no separate cadence to remember.

What travels upward on a stall is **evidence, never a transcript**: counts, error classes and
digests, plus the plan, the files at their shas, the actions attempted, and paths to the failure
evidence. Reasoning is never evidence. The escalation itself follows `shared-model-routing.md`
rule 4 — capability before retry, asymmetric hysteresis.

## Waiting on external systems (stateful backoff)

Waiting on CI, a review, or a long external CLI, keep per-target state: identity, next due time,
last-result fingerprint, consecutive no-change count. A due poll has exactly three outcomes —
changed → record the evidence and create the successor work; unchanged → update fingerprint and
counter, quiet no-op; inconclusive → record a blocker, never fake progress. Escalate the interval
on no-change (e.g. 15 → 30 → 60 min) and reset it on any state change. **A monitor that isn't due
never wakes a strong model.**

## Rules

1. Every long-running dispatch gets `run_in_background` (Claude Code; hosts without background
   shells — codex — use `nohup … &`) + a deliverable FILE path you can check.
2. An idle-without-report agent gets the disk check FIRST, then ONE nudge (SendMessage on Claude
   Code, `send_message` on Antigravity; subprocess lanes by their journaled session id — Codex
   `queue --thread`, Grok `-r`, opencode `-s`, Hermes `--resume`: `shared-lane-hygiene.md` 10) — if it
   still returns nothing, read its transcript; don't respawn blind. Field note: this is the
   single most common worker failure observed (six occurrences across one skill-family program,
   including finished reviews parked undelivered) — the work is almost always complete and the
   nudge yields the finished report instantly; delivery, not execution, is the fragile step.
2b. **`restart_clean` sits between nudge and respawn** when the context, not the model, is the
   problem: rebuild the replacement's context keeping the task, the tool calls and their real
   outputs, and dropping the prior model's narration and reasoning — polluted context is how one
   bad turn becomes ten. It does not help when the model simply cannot do the work; change
   capability first (`shared-model-routing.md` rule 4).
3. Silence is not success: no report + no artifact = failed, treat it as BLOCKED.
3b. **Liveness is read from artifact deltas — existence and mtime of the deliverable path — never
   from process count or idle state, which lie in BOTH directions:** hung child processes outlive
   their stopped parent agents (look alive, are dead), and a quietly working agent looks stalled
   while writing perfectly good files. Check the deliverable's mtime before any recovery action.
4. Thrash signals — repeated conflicts/rework WITHOUT acceptance-gate movement, a growing
   contested seam/file (megafile: flag it, controller queues an isolated decomposition task), or
   duplicate structural expansion — are REPARTITION signals, not push-harder ones; no absolute
   commit/LOC thresholds, activity ≠ progress → repartition (`strategy-parallel.md`).
5. **Never address an agent by a provisional handle.** A setup handle returned before the agent
   exists is not an identity — correlate the real one from post-spawn metadata (identity, project,
   path, time, state) before polling, reading, or messaging it. And "report back" means YOU
   perform the wait and the read: never assume an automatic child callback.
