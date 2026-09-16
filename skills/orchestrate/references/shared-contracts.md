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

`DONE` · `DONE_WITH_CONCERNS` · `NEEDS_CONTEXT` · `BLOCKED` · `REFUSED` (xcli lanes only: exit 0,
empty diff, a polite decline — `strategy-xcli.md`)
Never silently produce unsure work — that's what DONE_WITH_CONCERNS and BLOCKED are for.
Controller handling: DONE → gate. CONCERNS → read report; correctness/scope → address first.
NEEDS_CONTEXT → supply + re-dispatch same model. BLOCKED → ladder (context → stronger model →
split task → human). Never re-dispatch unchanged.
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
| triage assessor | scale · independence · verifiability · recommended strategy + why |
| search/explore worker | `path:line — symbol — ≤10-word note` per hit + `totals: <n> files` (or `No match.`) |

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
  `run.md`). Briefs CITE IDs, never restate.
  Contradictions reconcile in the record FIRST, by the owner (integrator only when explicitly
  designated, never invents design intent), then propagate outward.
  **The record outranks the brief**: when a brief and the binding record (decisions.md, the
  run's inventory/plan) disagree, workers defer to the record and FLAG the contradiction — never
  silently follow the brief (observed: a deliverable double-assigned across two briefs didn't
  clobber precisely because the worker deferred to the binding inventory).
- `field-guide.md` — optional, created only on the first controller-accepted surprise (any
  WORKER-role report may append one `surprise:` line; controller curates), per-run scope, hard
  ≤40-line cap; entry criteria in `shared-token-economy.md`.
- `card-<k>.md` — parallel task cards
- `review-<b7>..<h7>.diff` — review packages
- `review-task<N>-<kind>-r<round>.md` — reviewer findings files
- `raw/` — full command/tool output, redirected at execution time (`shared-token-economy.md`)
- `toolbox.md` — this repo's probed orientation recipes (`scripts/toolbox`; read, don't re-probe)
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

Vocabulary (all through `scripts/board`): `board init PLAN --strategy … --goal` (kickoff: archives
the previous run's workspace to `archive/<run-id>/`, writes the `run` record with branch + base
sha, queues every task, generates `run.md`'s Resolved block) · `board set key=value` (re-resolve a
dimension; the plan goes back to pending; `lanes=todo,implement,verify,review,integrate,done,blocked`
declares the board's lanes — a projection of state × role, `todo/done/blocked` required) · `board
plan approved|changed|skipped` · `board dispatch N --model M [--agent --role --engine
--effort --worktree --owns --by <lead> --session ID --log raw/lane-N.jsonl --cmd-file]` (`--model` is REQUIRED — rule
3; every implementer dispatch is a new *attempt*, which resets the review cycle; the session id
is what `board resume` resumes by). **Agent names are `<role>-<task>[-tag]`** — `impl-3`, `lead-1`,
`impl-1.1` (under `lead-1`), `spec-3`, `quality-3`, `verify-3`, `integ-1`, `fix-3-r2`: the role says
what the sender IS when a worker reads `[peer impl-1.2]`, the task id says WHERE it sits in the tree,
the run makes it unique. Omit `--agent` and the board derives it from `--role` and the task
(`-rN` when the name would repeat — a re-dispatch is attempt N); an explicit name is refused unless
it fits; `controller` is reserved; a trailing tag tells twins apart (`spec-3-codex`). Spawn native
subagents under the same name (`name:`) so the journal and the host agree · `board return N --agent A --status
DONE|DONE_WITH_CONCERNS|NEEDS_CONTEXT|BLOCKED|REFUSED [--commits --report --observed-model
--tokens --session]` (the typed return; rule 13's observation; usage receipts) · `board review N
--kind spec|quality --round K` (gate opened) · `board gate N --kind K --verdict ok|fail|warn
[--findings FILE]` (gate closed explicitly — outranks the findings-file parse, which takes the FIRST
verdict mark in text order) · `board launch N --agent A --engine E --model M -- spec.md` (the lane as one command: dispatch +
wrapper + session; `exit` and `receipt` events land when it ends — observations, never
transitions; `board receipt` fetches or states a receipt by hand) · `board exec N --name tests --
<cmd>` (a machine check run THROUGH the journal: log under `raw/`, exit + duration journaled;
`board result N --name --exit` for one that ran elsewhere) · `board nudge` / `board escalate N --to MODEL --why` · `board decide ID
"…"` (mirrors into `decisions.md`) · `board rail "…"` · `board done N [--msg]` (writes the ledger
line itself — refused while the current attempt has a failed gate or a failed check) · `board finish --gate pass|fail
--evidence PATH` (`pass` is refused while `check --finish` is dirty unless `--force --reason`; binds
HEAD, the goal hash and the journal cursor, so later work, a moved HEAD or a changed goal render it
STALE). Workers get two optional observation lines — `board note N "<msg>"` (a heartbeat, never a
status and never liveness — liveness is artifact deltas only, `shared-monitoring.md` 3b) and
`board exec N --name tests --agent <you> -- <cmd>` (their own verification run; an exit code is an
observation, not a transition) — and **mail**: `board send --from <you> --to <agent|controller|all>
"…" [--ask] [--re SEQ]` / `board inbox --agent <you>` / `board wait --agent <you> [--task N]` (mail, or a dependency's
work on disk — exit 3 when it cannot land) / `board peers --agent <you>` (open peers and what they own; returned peers and what
they delivered). Mail is journaled (`mail`, and an `ack` when read) and delivered at the recipient's
next board call — every worker-side command (`note`, `exec`, `send`, `peers`, `vote`) hands
over unread mail, so delivery rides on calls the worker makes anyway; never mid-turn, on any host.
`board follow [--for controller]` is the controller's filtered tail of the same journal. Controller mail is an INSTRUCTION; peer mail is
INFORMATION; in a tree, `--by <lead>` on a dispatch makes the lead's mail an instruction too and
routes the worker's `--to controller` asks to that lead while it is open (`strategy-hierarchical.md`). Loop-proof by construction: `MAIL_CAP` sends per stint, `THREAD_CAP` replies deep,
no duplicates, no mail to a returned agent; `board check` flags chatter, unread-past-stale and
unanswered asks. Votes: `board vote N --kind K --agent A --verdict ok|fail|warn` — the gate is
derived by quorum (`panel:N` majority, `consensus:N` any-deny) under the rules in force when the
vote was cast; an explicit `board gate` outranks. Parallel writers are serialized by a journal lock;
a lane in a read-only sandbox cannot write it, so worker-side commands print the line to carry in
the inline return instead of failing. `board --help` is grouped by role.

Views, all derived from the journal plus the files above (briefs → todo, reports and findings →
review, ledger → done — final, always wins): the kanban the user watches from their own pane
(`board`; `e` all cards, `enter` one card, `a` attention only), `board plan` (the flight plan),
`board agents` (roster with attempts, drift, usage), `board log`, `board attention` (what to act on,
most urgent first), `board task N`, `board check [--finish] [--replay] [--json]` (chain integrity,
dispatched-never-returned, reviewer silence, ledger lines naming missing commits/artifacts, done
over a failed gate or check, done with no gate opened, quality before spec, xcli DONE without
commits or receipt, a third attempt without escalation, drift, budget overrun, unapproved launch,
finish validity; `--replay` derives every card from the journal alone and diffs the disk view),
`board postmortem` (per-tier evidence for the evolve pass, recommend-only), and
`board resume` (the handoff's
state layer with a receipt: head, journal cursor, probed pointers, resume-by-id line per open
lane, cost per accepted task, `NOT_PROVEN` on every claim no artifact backs). **The journal never outranks the
ledger**, and it obeys the invariants: a worker saying "done" is a proposal, so **only the
controller records transitions**. The user opens and closes the pane; the skill only keeps the record.

## Task cards (parallel/team writers)

```
Objective · Owned files (exclusive) · Requirements · Interface contract ·
Acceptance criteria · Out of scope · Must NOT (hard prohibitions, IN CAPS) · MERGE GATE: <exact integration precondition>
```
State advances only when the exit artifact exists; merge-readiness is judged by the gate, not by
anyone's assessment. Blocked cards carry an owner + next action or they're not "blocked", they're
abandoned.
