# Contracts — typed returns, ledger, cards

Purpose: Define the durable brief, status, report, findings, and workspace contracts used between controller and workers.

Read when:
- Any orchestration run creates or consumes task artifacts.

Skip when:
- The task is not being orchestrated.

Inputs:
- Objective, scope, files, constraints, acceptance criteria, report paths, and ownership.

Produces:
- Validated task briefs, typed statuses, dense reports, and reproducible evidence paths.

## Contents

- The four invariants
- Status enum · Chat-return schemas
- Workspace files
- The ledger
- Task cards

The interface between any two agents is an artifact on disk, never the conversation. Everything
pasted into a dispatch or printed back stays resident in the controller's context forever — so
briefs and reports are FILES, and chat returns are capped summaries.

## The four invariants (they govern every status, gate, and ledger line)

```
observation ≠ transition          proposal ≠ authority
tool success ≠ accepted progress
accepted progress = validation + durable writeback + committed readback
```
The third closes a hole this pack had in several places: **an exit code of 0 only proves the
process exited**, not that the work landed. Source: a long-horizon control plane reporting
200+-hour trajectories (self-reported, repo-linked, unverified here).

## Status enum (every worker, every strategy)

`DONE` · `DONE_WITH_CONCERNS` · `NEEDS_CONTEXT` · `BLOCKED` · `DESIGN_CONFLICT` (a plan assumption
failed; only a patch would fit it) · `REFUSED` (xcli lanes only: exit 0, empty diff, a polite
decline — `strategy-xcli.md`)
Never silently produce unsure work — that's what DONE_WITH_CONCERNS and BLOCKED are for.
Controller handling: DONE → gate. CONCERNS → read report; correctness/scope → address first.
NEEDS_CONTEXT → supply + re-dispatch same model. BLOCKED → ladder (context → stronger model →
split task → replan). DESIGN_CONFLICT → [replan](shared-replan.md): brief · architect pass · user.
Never re-dispatch unchanged.
**Noticed, not touched** (a report section) is what a worker saw outside its task and left alone —
never its to fix, never folded into a running task. One the goal needs becomes its own task
(`board todo`, its own brief and review); the rest go to the user in your closing report — adding
them unasked is scope expansion (`triage.md`, re-triage triggers).
**An escalation carries a packet, never an empty prompt**: the plan, the relevant files at their
shas, the actions attempted, and the failure evidence (excerpt + raw path). That is model
switching without losing the work; a stall escalation carries the same packet plus its counts
(`shared-monitoring.md`).

## Chat-return schemas (what comes back INLINE — keep it tiny)

Inline returns are CAPPED (≈1–2K tokens max, per this table); report FILES carry the depth and
are read on demand. Terseness is a grammar, not a vibe — line shapes below are contracts. Depth is
not padding: **a report file states what the schema needs and stops** — no filler sections,
redundant summaries, or boilerplate (current models write long files by default).

| Role | Returns (max) |
|---|---|
| implementer | <15 lines: Status · commits · 1-line tests · concerns · report path · optional `surprise:` line |
| reviewer | verdict first (✅/❌/⚠️) · counts by severity · findings FILE path (see below) |
| verifier | `pass` / `fail` / `blocked` / `needs-human-judgment` · expected · observed · evidence path |
| sub-orchestrator | <1500 tokens: verdict · findings summary · artifact paths · optional `surprise:` line |
| parallel worker | verdict first, <1000 tokens: branch/PR ref · report path · optional `surprise:` line |
| triage assessor | kind · scale · graph (waves, widest) · unproven assumption · domains · independence · verifiability · recommended strategy + why |
| search/explore worker | `path:line — symbol — ≤10-word note` per hit + `totals: <n> files` (or `No match.`) |
| researcher (lane or scout) | ≤12 lines: Status · up to 5 graded findings with source URLs · lane file path · queries run · gaps |

Failure returns are single structured lines, never essays:
`BLOCKED — what / evidence (excerpt + raw path) / what you tried / what you need`.
The verifier's four states separate recoveries the controller would otherwise have to infer from
prose: `fail` is recoverable with the attached evidence, `blocked` means information it could not
obtain, `needs-human-judgment` is yours. Inside a failure, tool-failure and task-failure are
different problems — "the test failed" and "the test failed to run" have different fixes.

**Reviewer findings go to a FILE**, collision-proof name
`review-task<N>-<spec|quality|lens-<k>>-r<round>.md` — inline caps can never truncate findings.
Reviewer "read-only" means the REPO; `.orchestrate/` is the one place a reviewer writes.

## Workspace files (`.orchestrate/`, via `scripts/workspace`)

- `run.md` — written at kickoff, appended as facts land. Its `## Resolved` block is GENERATED
  by `board init` (and kept current by `board plan`/`return`/`rail`) — never hand-edit it; prose
  goes below. It carries: the task + the ORIGINALLY stated goal verbatim (the final-deliverable
  gate judges against it) · resolved dimensions + budget · host + landed bindings and named
  degradations (`shared-hosts.md`, `board rail`) · requested AND observed model/effort per role
  (`shared-model-routing.md` rule 13, `board return --observed-model`) · single-flight owners of
  shared rate-limited resources (`shared-safety-rails.md`) · deliberately chosen cost postures
  (e.g. mid-tier planner) · the flight-plan outcome (approved / changed / skipped and why,
  `shared-flight-plan.md`) · timestamp
- `task-N-brief.md` / `task-N-report.md` — per-task handoffs (report named off brief); briefs
  follow the priming anatomy and pass `scripts/brief-check` (`shared-token-economy.md`)
- `decisions.md` — cross-cutting decisions, one line each: ID + owner (small runs: keep in
  `run.md`). Briefs CITE IDs, never restate. A lead's ids are namespaced to its task
  (`D-<task>.<n>`); a user-owned decision (`--owner user`, from clarify) is revised only by the
  user — the board refuses anyone else.
  Contradictions reconcile in the record FIRST, by the owner (integrator only when explicitly
  designated, never invents design intent), then propagate outward.
  **The record outranks the brief**: when a brief and the binding record (decisions.md, the
  run's inventory/plan) disagree, workers defer to the record and FLAG the contradiction — never
  silently follow the brief (observed: a deliverable double-assigned across two briefs didn't
  clobber precisely because the worker deferred to the binding inventory).
- `field-guide.md` — optional, created only on the first controller-accepted surprise (workers
  journal candidates as `board learn` lines, or a report's `surprise:` line when the lane could
  not journal; controller curates), per-run scope, hard ≤40-line cap; entry criteria in
  `shared-token-economy.md`.
- `card-<k>.md` — parallel task cards
- `review-<b7>..<h7>.diff` — review packages
- `review-task<N>-<kind>-r<round>.md` — reviewer findings files
- `raw/` — full command/tool output, redirected at execution time (`shared-token-economy.md`)
- `toolbox.md` — this repo's probed orientation recipes (`scripts/toolbox`; read, don't re-probe)
- `capabilities.md` — what the machine can do: research/data CLIs (free or paid, installed or
  missing), gaps with install hints, engines, every skill on disk including manual-only ones
  (`scripts/capabilities`; refreshed by Prepare, kept across kickoffs like `toolbox.md`)
- `research/` — `lane-<N>.md` per research or scout lane (queries · candidates · graded findings ·
  dissent · gaps) and the synthesizer's `report.md` (`shared-research.md`)
- `journal.jsonl` + `board` — the run's append-only, hash-chained journal (schema 2) and a
  runnable copy of `scripts/board` (the journal section below); `archive/<run-id>/` holds every
  previous run's whole workspace — one workspace, one run
- `progress.md` — THE LEDGER (below)
- `loop-<name>.md` — loop contracts

## The ledger (`progress.md`)

One line per gated unit, appended only after the gate passes:
```
Task 3: complete (commits a1b2c3d..e4f5a6b, review clean)
Card api: merged (gate: contract tests green)
Cycle 7: shipped PR #142 (verifier: pass, evidence/run7.png)
```
**Reports are claims; the disk is the record.** After any fan-out completes, reconcile the ledger
against the artifacts actually on disk — never against report summaries alone (observed: reports
regressing on their own raw files, and a message race resolved only by disk evidence). A ledger
line that names an artifact nobody can `ls` is a defect.
**A failure becomes a durable check or the ledger says why not.** A Critical or Important finding
closes only when it is expressed as something that would catch it again — a test, a lint or
`brief-check` rule, an eval case — otherwise the ledger line records the finding and the reason no
check was possible. Four independent sources converge on the same sentence: a failure you don't
turn into a permanent check, you will meet again.
Resume rule: on any restart/compaction, `cat progress.md` + `git log` are the truth; recollection
is not. The single most expensive observed failure is re-dispatching completed work. `git clean
-fdx` destroys the workspace → reconstruct from `git log`.

## The journal (`journal.jsonl`, via `scripts/board`)

The run's spine: one append-only line per fact the disk cannot show, written by the CONTROLLER
at the step it already performs. Every line is an envelope — `schema`, `run` (the run id), `seq`
(monotonic), `ts`/`ts_utc`, `actor`, the event, `prev`/`hash` (a sha256 chain) — so `board check`
detects a line edited in place, inserted, removed or reordered, and a resume receipt can name the
exact cursor it was generated at. **Never edit the journal; re-resolve with `board set`.**

**Who writes what.** Only the controller records transitions — a worker saying "done" is a
proposal. Workers have three observation lines — `board note` (a heartbeat, never liveness:
`shared-monitoring.md` 3b), `board exec N --name tests --agent <you> -- <cmd>` (their own check: an
exit code is an observation, not a transition), `board learn` (one line the next worker would re-pay:
3 per stint, 300 chars, deduped run-wide, team-scoped) — and mail. Every command's syntax is in
`board help controller|lead|worker|views`; the script's docstring is the one source.

**Kickoff.** `board init PLAN --strategy … --goal` archives the previous run to `archive/<run-id>/`
(one workspace, one run), writes the `run` record with branch + base sha, queues every task and
generates `run.md`'s Resolved block. Prepare inits with `--goal --prep` only; triage records the
rest with `board init PLAN --resume --strategy …`, which keeps what was recorded and puts an approved
plan back to pending when it re-resolves anything. `board set key=value` re-resolves a dimension
(`lanes=todo,implement,verify,review,integrate,done,blocked` declares the board's lanes — a
projection of state × role; `todo/done/blocked` required).

**Dispatch and return.** `board dispatch` (and `review --agent`, `launch`) writes the agent's card,
`.orchestrate/prompts/<agent>.md`: the role's template verbatim under a header naming the agent, its
brief, its report or findings path and its board identity. The agent's prompt starts with the line
it prints; `return` and `gate` read the card's paths when `--report` / `--findings` are absent, and
`dispatch` takes the role from the agent's name. Every dispatch pins `--model` (rule 3) and is refused while the flight
plan is pending; every implementer dispatch is a new *attempt*, which resets the review cycle; the
session id is what `board resume` resumes by. **Agent names are `<role>-<task>[-tag]`** — `impl-3`,
`lead-1`, `impl-1.1` (under `lead-1`), `spec-3`, `quality-3`, `verify-3`, `integ-1`, `fix-3-r2`,
`research-2`, `synth-5`: the role says what a sender IS, the task id where it sits in the tree.
Omit `--agent` and the board derives it (`-rN` on a repeat); `controller` is reserved; a trailing tag
tells twins apart (`spec-3-codex`); spawn native subagents under the same name. `board return N
--agent A --status …` is the typed return (`--observed-model` is rule 13's observation, `--tokens`
the receipt, `--confidence` the report's `Confidence:` line, read by the board when the flag is absent). A task that reaches the ledger closes any stint that never returned — it shows as
"closed, no return", never stale. `board launch` is dispatch + wrapper + session in one command;
its `exit` and `receipt` events are observations, never transitions.

**Gates and done.** `board gate N --kind K --verdict ok|fail|warn [--findings FILE]` closes a gate
explicitly and outranks the findings-file parse (which takes the FIRST verdict mark in text order).
`board vote` derives the gate by quorum — `panel:N` majority once every lens voted, `consensus:N`
any-deny — under the rules in force when the vote was cast; an explicit `board gate` outranks.
`board exec` runs a machine check through the journal (log under `raw/`, exit + duration on the
card); `board result` records one that ran elsewhere. `board done N` writes the ledger line itself —
refused while the current attempt has a failed gate, a failed check, or a gate waiting on votes — and
while a gate the run's `review` requires has no pass (dual → spec and quality; panel, consensus and
factcheck → any): fewer gates is a recorded `board set review=…`, which the retro reports. A pass
needs a reviewer on record (`board review N --kind K --agent <kind>-N`, or votes) — never the
controller; one without takes `--msg "why"` and is reported as unreviewed.
`board finish --gate pass|fail --evidence PATH` binds HEAD, the goal hash and the journal cursor:
later work, a moved HEAD, a changed goal or an open task means it no longer stands; `pass` is
refused while `check --finish` is dirty unless `--force --reason`. `board hold "the user's reason"`
/ `--off` records the user's pause as run state (HELD on the board), never as a rail.

**Mail and the digest.** `board send` / `board inbox` / `board wait` / `board peers` — journaled, delivered at the
recipient's next board call (every worker-side command hands over unread mail), never mid-turn, on
any host. Controller mail is an INSTRUCTION; peer mail is INFORMATION; in a tree, `--by <lead>` on a
dispatch makes the lead's mail an instruction too and routes the worker's `--to controller` asks to
that lead while it is open (`strategy-hierarchical.md`). `send --ask --wait` asks and blocks in one
call. Loop-proof by construction: `MAIL_CAP` sends per stint, `THREAD_CAP` replies deep, no
duplicates, no mail to a returned agent. One watermark per checkpoint hands over unread mail, the
team's learnings, and the decisions (`board decide ID "…" --why "…"`; re-deciding an id supersedes it)
and rails recorded AFTER the dispatch — the brief snapshot predates them, so the worker reconciles or
returns NEEDS_CONTEXT. A question waits only while its asker is still at work.

**Project memory.** `board memory [--observation|--handoff --scope a,b --out PATH]` renders the run
as ONE project-context record (decisions with their why, failed attempts, learnings, commits,
verification, the frontier — paths, never bodies); the board prints the `ctx append` / `ctx
handoff` line when the repo keeps `.agent/PROJECT_CONTEXT.jsonl` and never runs it. Parallel writers
are serialized by a journal lock; a lane in a read-only sandbox cannot write it, so worker-side
commands print the line to carry in the inline return instead of failing.

**Views**, all derived from the journal plus the files above (briefs → todo, reports and findings →
review, ledger → done — final, always wins): `board next` (the controller's checkpoint: run state,
what needs you most urgently with its command, the next step), the kanban the user opens in their
own pane (`board`), `board plan`, `board agents`, `board attention`, `board task N`, `board log`,
`board check [--finish] [--replay]` (chain integrity, silence, ledger vs disk, gate order, drift,
budget, finish validity; `--replay` re-derives every card from the journal alone), `board learn`,
`board postmortem` (evidence for the evolve pass, recommend-only), `board score` / `board retro`
(the run's versioned score and its skill-level signals — [retro](shared-retro.md)) and `board resume` (the handoff's
state layer with a receipt; `NOT_PROVEN` on every claim no artifact backs). **The journal never
outranks the ledger.**

## Task cards (parallel/team writers)

```
Objective · Owned files (exclusive) · Requirements · Interface contract ·
Acceptance criteria · Out of scope · Must NOT (hard prohibitions, IN CAPS) · MERGE GATE: <exact integration precondition>
```
State advances only when the exit artifact exists; merge-readiness is judged by the gate, not by
anyone's assessment. Blocked cards carry an owner + next action or they're not "blocked", they're
abandoned.
