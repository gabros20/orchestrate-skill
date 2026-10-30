# Lane A-workspace-apps — desktop and terminal workspaces that run many coding agents (ADEs)

Scope: the 28 bookmarked posts, ~24 tools. Compared against orchestrate v1.31.0 (`board` surface in
`$R/board-help.txt`, `scripts/board`, `references/shared-monitoring.md`, `shared-isolation.md`,
`shared-lane-hygiene.md`, `shared-model-routing.md`, `shared-contracts.md`, `shared-flight-plan.md`).
Method: ghrelay skim/read on every repo except Supacode (metadata only), Traycer's docs site fetched,
Paseo and Herdr docs read from their repos, five xrelay read calls (tier-list thread, Maestri x2,
Synara, Empryo), no code run.

Headline. This is a UI-and-attention lane, not a protocol lane: I found nothing here that beats
orchestrate's journal, typed gates, model routing or priced flight plan, and the two best "state is
derived, never stored" designs (Agent Orchestrator, Plannotator Inbox) are the same idea as
`journal.jsonl` plus the board as a view. Where these tools are ahead is the part of a run that
happens after the code is written or when something goes wrong: **worktree cleanup with a proof
predicate, PR/CI awareness, continuing on another model when a provider blocks, structured human
decisions, and a push when a person is needed.** Four tools (herdr-projects, Traycer, CompozyOS, AO)
converged independently on the same worktree-removal rules, which is the strongest signal in the
lane; Orca reaches the same place at terminal level (settled workers must be reused, retained or
released before the coordinator may finish). On stalls the honest finding is that no tool here has a
verified stall detector better than orchestrate's artifact-delta rule (3b); the tier-list complaint
about Traycer ("stall and need repeated nudges") is real, Traycer has an `agent.stalled` event, and
its detection rule is closed source.

## Top candidates (ranked, 3–6)

1. **`board sweep` — worktree and branch removal with a proof predicate, and a finish gate that
   refuses leftovers** — from herdr-projects (`sweep.rs`), Traycer (Sweep + auto-cleanup), CompozyOS
   (first-class worktrees), AO (`cleanup.go`), Orca (terminal-level completion accounting) · value H ·
   effort S–M · lands as a new `board sweep [--dry-run|--yes]`, a `check --finish` finding, `shared-isolation.md`
   rule 5, `shared-lane-hygiene.md` rule 11 (sibling of reap) · beats ours because rule 5 says removal
   is "mandatory" but nothing checks it: `check --finish` refuses leftover processes
   (`scripts/board` `check()`), not leftover worktrees or branches, and `board resume` only prints
   "worktrees to account for" (board:3534).
   Shape (the four tools agree on the automatic path): owned = journaled stint worktree or branch under
   a run prefix (herdr-projects uses `hp/<slug>/`); skip any with an open stint or live pid in it (reap
   data); never force a dirty tree automatically (herdr-projects never passes `--force`; Compozy needs
   "an explicit second step for dirty or unique-unpushed work"; Traycer's manual Sweep allows stopping
   activity only after a review step that names what will be stopped, its auto-cleanup never does);
   classify each as Landed (tip contained in the integration/default branch, or a merged PR matching
   the tip) / At base (no commits beyond BASE, clean) / Not proven (dirty, unpushed, detached,
   unreadable, inconclusive check) / In use / Shared with another task / Orphaned; pre-select and
   remove only Landed and At base that are idle and exclusive; delete a branch only when merged and
   local tip == merged head (herdr-projects); re-check immediately before removing; an "unconfirmed"
   removal is never auto-retried (Traycer). Traycer's rule worth quoting: "Age alone never makes a
   worktree safe to delete." Residue from a failed launch (a worktree or branch created before the
   engine started: herdr-projects notes a failed `git worktree add` can leave the branch behind; Orca's
   failed `worker-start` returns `residualResources`) is what the journal's dispatch record lets sweep
   find.

2. **Limit-block fallback ladder and `board handoff` (continue the task on another engine)** — from
   Traycer (Model routing), AO (agent-switch saga), herdr-gpui (Teleport handoff note), T3 Code
   (orchestration-v2 handoff design), CompozyOS ("Continue with another agent", post-only) · value H ·
   effort M · lands as `shared-lane-hygiene.md` rule 5b, `shared-model-routing.md` new rule 13 using the
   catalog's cross-harness alternates, and `board handoff N --to-engine E --model M` · beats ours
   because rule 5 only knows "BLOCKED with a reset time, then resume the same session"; a long reset
   (5-hour or weekly window) stalls the critical path while an equivalent model sits idle in
   `shared-model-catalog.md`.
   Shape: ladder = (1) wait, only if the reset is within a tunable bound (Traycer default 6 h, range
   1 h–7 d) and the lane is off the critical path; (2) another account on the same engine, if the
   machine has one; (3) the catalog's equivalent-tier model on another harness; (4) tell the user and
   stop. `board handoff` writes a continuation brief from deterministic facts (task brief, journal
   decisions and learnings, `git diff BASE..HEAD`, last report) plus, optionally, a bounded-time
   handoff note requested from the old lane (AO asks the source generation inside a bounded window and
   records `timed_out` without blocking the switch; herdr-gpui has the old agent write `handoff-N.md`),
   launches in the same worktree only after `board reap --agent A` proves the old lane
   stopped (AO's runbook: an `unknown` probe "never authorizes source restoration or a second target"),
   and journals a `handoff` event so the
   card reads "continued on E". T3's design adds the one subtlety worth copying: if the first engine
   later resumes, give it a delta of what the other engine did, never resume it blind.

3. **Recovery contract: proven-state table, nudge discipline, one open attempt per task** — from Orca
   (orchestration skill: "Absence never authorizes stop, abandon, retry, or release"), AO (`blocked` vs
   `waiting_input`; `sendOnce`), Herdr (`agent_blocked`, `agent_prompt_stalled`), herdr-projects
   (`prompt_unconfirmed`), Paseo (heartbeat with expiry), CompozyOS (work-signal liveness) · value M–H ·
   effort S · lands as `shared-monitoring.md` rule 2 and a new "proven state → permitted action" table,
   `board attention` text, and a guard in `board dispatch`/`launch` · beats ours because attention
   keeps printing "disk check, then ONE nudge" (board:1483) after the nudge happened (board:1183 only
   increments `s.nudges`, attention never reads it), no rule covers a lane parked on an approval
   dialog, and the cardinal rule "never spawn a duplicate" is prose only: `board launch` validates the
   agent name (`check_agent`, board:890) and never checks for a live lane on the same task.
   Shape: (a) never nudge a lane that is blocked on a permission or approval decision; answer it or fail
   the lane (AO: "Automation must never inject input into a blocked session"; Herdr refuses the send);
   (b) a nudge is confirmed only by an artifact delta, log growth or exit after it; unconfirmed means
   read the transcript and never resend (Herdr: a timeout "does not prove that no input was sent");
   (c) `attention` says "nudged 1x at T, no delta since: read the transcript, restart_clean or escalate";
   (d) refuse a second open stint for the same task+role until the first is returned or reaped (today
   `agent_name` just derives `-rN`, board:883); tell a superseded worker on its next board call to stop
   and write no report (Orca `consumer_fenced`); (e) opt-in
   `heartbeat=<t>,expire=<t>` for engines that stop early (Paseo's answer to "agents stall"), never a
   default; (f) a per-run `stale=` knob (Compozy `needs_attention_after`; `STALE_AFTER` is a constant,
   board:91).

4. **PR/CI facts on the card and a bounded feedback loop** — from AO (`reactions.go`, SCM observer),
   herdr-projects (`steps.rs` PR poll, `pr-followup` routine, the "Landing" group), Superconductor ("your
   branch knows what comes next"), Superset (PR panel sends line comments to an agent) · value M–H ·
   effort M–L · lands as `board pr N <url>` (reads `gh pr view --json state,reviewDecision,
   statusCheckRollup,mergeable`), attention rows (`x ci failed`, `? changes requested`, `? landing`),
   a PR-shepherd recipe in `strategy-loop.md` / `shared-monitoring.md`, and "merged" as landed-evidence
   for #1 · beats ours because orchestrate stops at "branch/PR ref" plus the open-PR cap
   (`shared-safety-rails.md:75`); CI red and changes-requested are where the human babysits, and that is
   the tier-list author's stated pain ("less babysitting").
   Rules both implementations learned the hard way: one nudge per (condition, signature) persisted so a
   restart never re-nudges (AO); at most 3 attempts per review comment (AO `reviewMaxNudge`); conditions
   queued independently so a CI failure never hides review feedback (AO, a bug they fixed); comments by
   the agent's own login never re-trigger it (herdr-projects); the prompt carries counts and the `gh`
   command to read them, never GitHub text (herdr-projects: injection hygiene); defer teardown while the
   agent is still active because a merge can precede the next PR (AO, herdr-projects).

5. **Decision cards: severity-tagged asks, `## Next` lines, answer-and-record** — from Plannotator Inbox
   (`Stopped:` / `Holds up:` / none, options, `Recommended:`, "records a decision"), herdr-projects
   (`## Next` in every report, forwarded by number), Orca (`gate-create --question --options`) · value
   M · effort S · lands as `board send --ask [--stops|--holds] [--options "A|B"] [--rec A]`, attention
   ordering by severity, `board send --re N --decide D-07`, a `## Next` section (at most 5 imperative
   lines of at most 100 chars) in `shared-contracts.md`'s report schema, and the card shape in
   `prompt-implementer.md` / `shared-token-economy.md` · beats ours because `--ask` is free text, every
   `?` row looks alike, and answering never records the decision, so the next worker re-asks (Plannotator's
   own fix: one act files the answer as a project decision). Plannotator's rule for a good ask (1–3
   sentences of context, a recommendation, at most about 8 questions a round) is close to what Prepare
   already asks of the user (`shared-prepare.md`: numbered questions, recommended answer on its own line);
   the worker-to-controller `--ask` has no such shape.

6. **Ambient attention: `board follow --exec` notify hook (and an optional lane viewer pane)** — from
   Traycer (severities needs_action / failure / done / info; command or HTTP hook; events
   `approval.requested`, `agent.stalled`, ...), herdr-projects (edge-triggered items, deduped per report
   hash, wake text built only from fixed phrases), cmux (notification rings), openharness (jump to the
   harness waiting on you), the notch and "agent tray" apps (X) · value M · effort S · lands as
   `board follow [--exec CMD]` (env `BOARD_SEVERITY`, `BOARD_EVENT`, `BOARD_TASK`, `BOARD_MSG`), a recipe
   in `shared-monitoring.md`'s Hooks section (osascript, notify-send, ntfy), and optionally `board open N`
   (tail the lane log in a tmux/herdr/cmux split) · beats ours because the board is a pane the user must
   watch and `follow` is addressed to the controller; every tool in this lane answers "less babysitting"
   with a push, and the user can walk away from a long run.
   Rules to keep: push only on edge transitions (new ask, blocked, failed gate/check, finish), dedupe on
   a signature, fixed phrases plus ids only, never worker text.

Below the cut (details under Tools): guided review for the human at finish (Plannotator: ordered
sections, files checked against the real diff) · a literal `next` argv on each attention row
(Orca `nextAction`; `board show --json` already exposes `{mark, task, why}`, board:3586) ·
primed-fork fan-out (cmux/Traycer/T3: fork = resume-by-id plus the engine's fork switch) · privilege
ceiling rule (T3 v2: a child never exceeds its parent's mode) · load-aware lane admission (herdr-gpui
Smart Dispatch spare-core formula).

## Tools

### Orca (stablyai/orca) — desktop ADE whose shipped `orchestration` skill is the closest analogue to this skill
- Links: github.com/stablyai/orca (91,463 stars, pushed 2026-10-13, MIT); skill text in `skill-guides/orchestration.md` + `references/{coordinator-loop,messaging-and-gates,recovery-and-cleanup,worker-contract,placement-and-remote,low-level-topology}.md`.
- Evidence: repo-read of the shipped skill text (the agent-side contract is the skill itself, so this is the implementing artifact for the agent behaviour); the app and CLI runtime code was not read.
- Mechanism: Run (namespace + coordinator inbox) → Task → Dispatch (one authoritative attempt). Workers get an injected preamble with ids; they `ask` (blocking, resumable by message id after a timeout), send heartbeats at the preamble's cadence ("proves liveness, not completion"), `check` for follow-ups at checkpoints (`consumer_fenced` tells a superseded worker to stop), and send `worker_done` once with `--outcome succeeded|failed`. The coordinator blocks on `check --wait --types worker_done,escalation,question`, receives the oldest FIFO batch, replays it until `--ack`ed, and after three empty waits enumerates `worker-list` rows that carry `projection.liveness` (`live`/`unverifiable`/`exited`), attention categories and a literal `nextAction` argv. Safety floor: "Only positive proof of exit authorizes stop, abandon, or retry, and only an accepted settlement authorizes release. Every other observation, absence included, is a checkpoint." A state→safe-action table (failed/stopped → `--retry-of`; outcome_unknown → inspect then stop or abandon; unverifiable → never act). Every mutation takes `--retry-request` and `request-show` answers completed/pending/absent. Three consecutive failures circuit-break a Task ("Do not route around that boundary with a new Run or an unrelated Dispatch."). A failed `worker-start` returns `failedStage` and `residualResources`. Completion accounting: each settled worker is reused, retained or released, and the coordinator may not end its turn until `worker-list --terminal-state reclaimable` returns none. Decision gates (`gate-create --question --options`, `gate-resolve`) are DAG nodes.
- Versus orchestrate: have — typed task-spec (Target/Change/Constraints/Ownership/Acceptance ≈ `task-brief` + `brief-check`), controller never implements (SKILL rule 1), liveness from evidence not idle state (`shared-monitoring.md` 3b), requested-vs-effective model (receipts record the served model). Partial — "absence authorizes nothing": rule 3 says silence is BLOCKED, rule 2 says disk check then one nudge, but there is no table of what proof authorizes stop/retry; mail ack is a watermark (`st.acks`). Missing — duplicate-attempt guard, superseded-worker notice, residue receipt on a failed start, reclaimable accounting at finish, machine-readable next argv.
- Adopt: candidates 1, 3, 5 and "below the cut" (`attention --json`). Keep our deliberate differences: Orca defaults to the current workspace and inherits the user's model unless one is named; orchestrate pins model and effort on every dispatch and isolates multiple writers (cost governance, rules 1 and 3).

### herdr-projects (eliasstravik) — Rust plugin for Herdr: one coordinator conversation, parallel worker threads on their own branches
- Links: github.com/eliasstravik/herdr-projects (639 stars, pushed 2026-09-28, MIT); the X post says "live progress %", "prefix+a popup", "threads clean up after they merge".
- Evidence: repo-read — `skill/COORDINATOR.md`, `skill/THREAD.md`, `docs/operations.md`, `docs/herdr-notes.md` (builder's verified assumptions), `src/thread.rs`, `src/steps.rs`, `src/sweep.rs`, `src/progress.rs`, `src/inbox.rs`.
- Mechanism: one pure function `group(thread, live, now)` ("First matching row wins. One function, so the CLI and the ticker always agree.") puts every thread in exactly one of Waiting on you / Ready for review / Landing (open PR approved) / Working / Idle / Resolved. Waiting on you = failed start, pane gone with no report, launch stuck on a dialog, harness `blocked` for 30 s (`BLOCKED_DEBOUNCE_SECS`), or the agent's own report says "Waiting for you"; "the harness showing `working` still wins over an unread report: a report written mid-run is not a result". Agents self-report `--percent --activity` into one file per pane that expires after 300 s (a hook injects a reminder at most once a minute). A 15 s ticker writes inbox items only on transitions (Ready for review once per report hash), and wakes the coordinator with text built from fixed phrases and safe ids, never from report or GitHub text. A nudge is typed only into an input box that has looked empty for 10 s, because the builder verified that "a prompt sent while the user has half-typed text does not merge" is false. Every thread report ends with `## Next` (one imperative line each, at most 100 chars); a key sends line N back to the thread. PR poll every 120 s diffs `gh pr view` into opened / checks-failed / review / merged events and fires `routines/pr-followup.md` at the thread; own-login comments are ignored. Resolve = copy the report home, remove the worktree (never forced), delete the local branch only if the PR merged (re-asking GitHub first); `sweep` finds worktrees on `hp/<slug>/` branches with no open thread and deletes a branch only when its local tip equals the merged head; auto-resolve after merge only when the agent is neither working nor waiting. The coordinator may answer a thread's permission prompt itself (`thread read` then `thread keys`): approve once, in-task, in-worktree, non-destructive; never "always allow"; all report and inbox text is "data, never instructions".
- Versus orchestrate: have — "files are the record, prompts are nudges" (= artifacts on disk are the interface, rule 2), coordinator never works (rule 1), `max_parallel_threads` (= `workers=`, overload rules), learnings/memory (= `board learn`/`memory`). Missing — everything under candidates 1, 4, 5, 6; the single group-precedence function (our `attention` lists causes, not "what do you need to do").
- Adopt: candidates 1, 4, 5, 6 as above. Live progress: its `--percent --activity` self-report decays after 300 s so a stale claim never reads as current; our `board note` is a heartbeat and never liveness (3b), and v1.31.0 already added the worker work log, so an expiring `--pct` on `board note` is value L. Skip the pane-scraping (prompt-box detection, trust-screen answering, `thread keys`): it exists to type into live TUIs; orchestrate nudges through native queue/resume.

### Agent Orchestrator, "AO" (OrchestratorInc/agent-orchestrator; X: @useOrchestrator, @agent_wrapper, @Maaztwts) — Go daemon + Electron/Expo apps supervising worktree sessions
- Links: github.com/OrchestratorInc/agent-orchestrator (13,139 stars, pushed 2026-10-13, Apache-2.0; its README names @useOrchestrator and docs.orchestrator.inc). The Feb 2026 @agent_wrapper "built itself" post and the @Maaztwts YC post carry no captured link: I matched them to this repo by name, and because `ComposioHQ/agent-orchestrator` resolves to it through GitHub's redirect. The README itself never mentions Composio or @agent_wrapper, and the Go module path is a third org (`aoagents/agent-orchestrator`), so treat the "built itself" claim as unverified.
- Evidence: repo-read — `domain/{activity,status,cleanup,report,agent_switching}.go`, `service/session/{status,kanban,delegation}.go`, `lifecycle/{reactions,steps}.go`; docs — `docs/architecture.md`, kanban-status spec, agent-switch failure runbook.
- Mechanism: durable facts, display status derived at read time ("Display status is never stored"). Precedence (docs): terminated → merged; `waiting_input`/`blocked` → needs_input; PR pipeline (ci_failed, draft, changes_requested, merge_conflict, mergeable, approved, review_pending, pr_open); active → working; signal-capable harness silent for 90 s (`noSignalGrace`) → `no_signal` rather than a confident idle. Activity comes from the harness's own hooks, not transcript inference. `waiting_input` (empty prompt, safe to message) and `blocked` (pending permission decision, never inject) both render as needs_input but demand opposite automation, and both are sticky (not aged by time). SCM observer polls every 30 s; `ApplyPRObservation` queues CI-failure, review-comment, changes-requested and merge-conflict nudges independently, `sendOnce` dedups on a persisted signature, caps review nudges at 3, re-reads the session immediately before writing (fail-closed), and orders send → memory → persist so a crash costs one extra nudge, never a lost one. A session ends only when runtime and process are both dead, there is no recent activity, and no merged-PR ownership; a failed probe "is not proof of death". Cleanup keeps a disposition per worktree (pending / removed / preserved_dirty / failed) with capped-backoff retries and a pause on dirty. Workers file structured reports (`checkpoint|needs_input|stuck|done` + outputs `artifact|pr_created|pr_reviewed`) through an outbox (pending → claimed → acknowledged) with a 5-minute settlement window after `done`; reports are claims and "neither changes authoritative session state". Agent switch is a durable saga (preparing_handoff → stopping_source → source_stopped → starting_target → target_ready → delivering_context) with generation fencing, context built from deterministic facts, optional source-authored handoff (bounded wait) and a transcript tail.
- Versus orchestrate: have — derived view over an append-only record (`journal.jsonl` + the board), workers observe and only the controller transitions (matches "reports are claims"), honest unknown (`NOT_PROVEN alive`, board:3470 ≈ `no_signal`), reap identity checks. Missing — PR facts, the blocked/waiting split, signature-deduped bounded feedback, cleanup dispositions, cross-harness switch.
- Adopt: candidates 1 (dispositions), 2 (context layers, fencing), 3, 4. The worker `stuck` report state is already covered by `send --ask` + `board wait`; do not add a new status.

### Plannotator Inbox (backnotprop/plannotator) — local review surface and decision inbox across Claude Code, Codex, Gemini, Pi, OpenCode, Copilot, Amp, Droid, Kiro
- Links: github.com/backnotprop/plannotator (9,394 stars, pushed 2026-10-13, MIT/Apache); post of 2026-10-09, blog "An Async Surface for Long-Running Agents".
- Evidence: docs — `adr/implementation/inbox-thread-state.md` (states it is written from the code and checked by a model-based test), `apps/marketing/.../the-age-of-the-inbox.md`, `docs/guides/questions.md`, `lib/inbox-prompt.md`, `adr/specs/guided-review-20260702-195351.md`; store code unread.
- Mechanism: agents write to `plannotator inbox` through an MCP server (`send_message`, `read_thread`, `wait_for_reply` with a cursor, `resolve_message`, idempotency keys) or per-harness plugins; a reply arrives as the session's next turn and the thread shows "Delivered to Claude Code". An ask is a `:::question` block with options, context and `Recommended:`; a `Stopped:` or `Holds up:` line declares how much work it blocks. Fixed section precedence: Stopped on you → Holding up work → Waiting on you → New since you looked → Sent → Quiet. Question states are derived (open / picked / sent / superseded / closed); an agent can supersede its own stale question; "Mark read" closes waiting questions as set-aside and tells the agent 10 s later, with undo. Answering can record a project decision ("Records a decision"). Guided review: a read-only agent job emits ordered sections (core first, support last), each with prose and per-file diffs; the server enforces "every changed file must appear exactly once across sections + unplacedFiles" and discards fabricated paths.
- Versus orchestrate: have — worker→controller asks with reply command in attention (`?` rows), `board decide` for recorded decisions, a questions-with-recommended-answer format for the user (`shared-prepare.md` clarify rounds). Missing — severity on a worker ask, options/recommendation, supersede, answer-and-record in one act, a human-facing reading order of the change.
- Adopt: candidate 5. Guided review: have the integrator or final reviewer write `.orchestrate/guide.md` (sections: title, why, kind core|consequence|support, files) and let `board check --finish` verify that every file in `git diff --name-only BASE..HEAD` appears exactly once; value M, effort S–M, pairs with the final-deliverable gate in `shared-review-gates.md`.

### Traycer (traycerai/traycer; desktop app v1.3, host v1.4.1) — free MIT desktop app for Claude Code, Codex, OpenCode, Cursor and others
- Links: github.com/traycerai/traycer (1,608 stars, pushed 2026-10-13) holds the client and protocol only; the Host that coordinates agents lives in a private repo. Docs: docs.traycer.ai (llms.txt index).
- Evidence: docs — changelogs (app, host, CLI), `concepts/{sweep,notifications,agent-to-agent,worktrees}`, `settings/{worktrees,model-routing,notifications}`, `agents-and-models/usage-limits-and-routing`, `first-run`. Host internals unread.
- Mechanism: (1) Sweep: lists worktrees with Landed / At base commit / Review (not proven landed) / Also used by another Task / In use / Orphaned / Still checking; only Landed or At-base, idle, exclusively owned ones start checked; a second review step names possible loss and what will be stopped; checks are refreshed right before removal; branches are never deleted. Optional daily auto-cleanup (off by default, 30-day default): "Age alone never makes a worktree safe to delete"; eligible = Landed, At base, or Unreferenced (clean, fully pushed, no task or agent references it, and a successful no-PR or merged-PR check); skips dirty, detached HEAD, unreadable Git data, anything with a live session; "an inconclusive required PR check also prevents deletion". (2) Model routing: when a rate limit, sign-out or billing problem blocks a chat, try in order another account on the same provider (skipping accounts already at their limit), an equivalent model in the same tier (frontier / flagship / standard), wait for the reset if it is within a configurable bound (default 6 h), then notify; a 15 s cancel countdown; per-problem overrides; a "Test a model" simulator; terminal agents are never switched. (3) Notifications: severities needs_action / failure (errored turns, stalls, crashes, rate limits) / done / info; OS notification only when no window is focused, a newer one replaces an older one for the same agent; hooks run a command or HTTP POST per severity with events `approval.requested`, `interview.requested`, `agent.stopped`, `agent.stalled`. (4) Session import scans Claude Code, Codex and OpenCode session stores, groups sessions by repository into Tasks, shows Imported / Unreadable, and continues on the original agent. (5) Agent-to-agent: create, message, read transcripts, fork, stop; a message to an agent with no inbox is "rejected, not queued"; referencing an agent, reading its transcript and messaging it are separate capabilities.
- Versus orchestrate: have — mail with caps (`MAIL_CAP`/`THREAD_CAP`), peers (`--owns`, `board peers`), resume-by-id. Missing — sweep predicate, limit routing, notification hooks. Stall: Traycer ships an `agent.stalled` event and no documented rule; the tier-list complaint is therefore unresolved evidence about Traycer, not a mechanism to copy.
- Adopt: candidates 1 (predicate), 2 (ladder and thresholds), 6 (severity taxonomy and hook contract). Session import: no (see below).

### CompozyOS (compozy/compozy; X: @CompozyOS) — Go daemon plus desktop shell that runs ACP agents with Loops, triggers and approvals
- Links: github.com/compozy/compozy (2,801 stars, pushed 2026-10-13, MIT); v0.3.0-beta line.
- Evidence: docs — in-repo release notes `.release-notes/archive/v0.3.0/*.md` and `v0.0.x`; product code unread. The beta.33 "Continue with another agent" feature is post-only (not yet in the repo's notes).
- Mechanism (release-note claims): fail-closed completion — "success requires an explicit completion event; disconnect, terminal error, and process exit stay three distinct outcomes", crash evidence carries exit code and signal, a prompt is never replayed automatically because it may have caused side effects. Supervision "considers agent progress, running tools, active children, Loop runs, task leases, and scheduled waits"; a quiet transcript alone is not idle, "if a work-signal source cannot answer, supervision reports attention and suspends automatic stopping"; observed silence warns after 30 min and enters a stop ladder after 10 more; fresh work cancels the pending stop. Worktrees are runtime objects: phased `pending → ready` creation with ownership checkpoints and rollback, removal fenced as `removing`, activity and Git safety re-checked under the repo lock, explicit second step for dirty or unique-unpushed work, an assisted-exit ladder (commit, push, PR, merged evidence, cleanup). Fan-out settles with `wait_all | fail_fast | race | best_effort` (threshold plus explicit `missing: acceptable`) and "a partial result stays partial everywhere it is read". `ask` and `review` nodes park a Loop on a human; a review block takes a decision allowlist and `responders: { agents: deny }`. Session messages carry their origin and chains stop at eight hops. One daemon-owned attention model covers pending input, permission requests and finished-unseen sessions.
- Versus orchestrate: have — fan-in guard that refuses to synthesize a partial set (`strategy-parallel.md`), mail caps, journal-only terminal authority (the daemon, not the worker, settles; same as controller-only transitions), exit-vs-return distinction (`attention`: lane exited with no return). Partial — work-signal liveness (we use artifact deltas, stricter). Missing — worktree lifecycle, a declared quorum for fan-outs.
- Adopt: candidate 1 (removal fencing) and 3 (`stale=` knob, "signal source cannot answer → attention, do not auto-stop" is what `NOT_PROVEN` already does). A declared partial-fan-out quorum (`best_effort:66%`, reported as coverage) is a low-value extension of the fan-in guard. Re-check "Continue with another agent" when its notes land.

### Herdr (herdrdev/herdr) and herdr-gpui "Teleport" (penso/herdr-gpui) — the terminal runtime these plugins sit on, and a native client
- Links: github.com/herdrdev/herdr (43,779 stars, Apache-2.0); github.com/penso/herdr-gpui (1,232 stars, pushed 2026-10-13).
- Evidence: docs — Herdr `docs/next/.../agent-automation.mdx`, `concepts.mdx`; herdr-gpui `crates/herdr-gpui/README.md` (Teleport, Smart Dispatch, Orchestrator sections); neither codebase read.
- Mechanism: Herdr marks every pane working / blocked / idle / done / unknown; `done` is idle-but-unseen and `completion_seq` identifies a completed turn independently of who viewed it ("Startup readiness, restoring an idle conversation, and switching agent conversations do not count as completed work"). `agent prompt` returns `agent_blocked` without sending input to a blocked agent; `--wait` returns `agent_prompt_stalled` if no `working` or `blocked` is seen within 5 s; "a timeout or `agent_prompt_stalled` does not prove that no input was sent. Read the agent before retrying." Agents can `agent wait --until blocked`. Teleport moves a worktree to another host: commits as a Git bundle of what the destination lacks, uncommitted work as two temporary commits built through a temporary index (source untouched), restored exactly including binaries; ignored files and submodule contents stay; agent sessions move in each engine's own format (Claude transcript into the new cwd's project dir, Codex rollout, opencode export/import, pi session file) with the checkout path rewritten; an agent the destination lacks first writes `handoff-N.md` and a replacement starts from it; "Teleport back" backs the destination up to `refs/herdr-teleport/backup/...` first. Smart Dispatch ranks hosts by spare cores (cores - load average - 0.5 per working agent - 1 if a clone is needed; memory over 90% halves it). Dispatch names branches `agent/<number>-<slug>-<hash>` so runs are rediscoverable from Git alone.
- Versus orchestrate: have — resume by id and per-engine session-store paths (`shared-monitoring.md`, `shared-lane-hygiene.md` 4), nudge binding per engine (rule 10). Missing — blocked-aware prompting, `completion_seq` style "new completion" discrimination, handoff-note continuation, load-aware admission.
- Adopt: candidate 2 (handoff note, delta), candidate 3 (a, b). Load-aware lane admission (refuse or queue a `board launch` when load average exceeds cores) is value L–M, effort S. Teleport itself: no (needs a daemon on both ends).

### T3 Code (pingdotgg/t3code; SS tier in the tier list) — "agent harness control surface" with web, desktop and mobile
- Links: github.com/pingdotgg/t3code (27,361 stars, pushed 2026-10-13).
- Evidence: docs — the in-repo design set `docs/orchestration-v2/{README,provider-switching-and-context,orchestrator-mcp-server}.md` (a target architecture, "not a patch plan for the current implementation"; code unread); the author's reply in the tier-list thread (post-only).
- Mechanism: the reason it ranks first is UX ("how it hides what I don't need to see", the PR flow, the iOS app), not orchestration; Theo's own reply lists orchestration as unfinished: a meta "home" thread that controls all threads, control of threads on other machines, "better primitives for threads to wait for each other", "easier fork from here with message". The v2 design makes provider switching an explicit `ContextHandoff` artifact (delta since the target engine last saw the task, full summary, checkpoint summary; superseded rather than mutated; a staleness policy), exposes `delegate_task` / `task_status` / `t3_thread_send|wait|interrupt` over an authenticated MCP endpoint, derives idempotent work from a `clientRequestId`, and enforces a privilege ceiling (a child's runtime and interaction mode may equal or narrow the parent's, never escalate).
- Versus orchestrate: have — wait primitives (`board wait`), controller as the "home" thread, delegation with only the task prompt copied (pointers, not history). Missing — an explicit privilege-ceiling rule in `shared-safety-rails.md`; handoff artifacts.
- Adopt: the handoff-artifact and delta ideas in candidate 2; a one-line privilege-ceiling rule ("a lane's sandbox and approval mode never exceed the controller's; bypass flags only with a recorded user grant") — value L–M, effort S.

### Paseo (getpaseo/paseo) — daemon plus desktop, web and mobile clients; agents can launch and message other agents
- Links: github.com/getpaseo/paseo (20,765 stars, pushed 2026-10-13); public-docs/orchestration*.md, `skills/paseo-committee`, `skills/paseo-advisor`.
- Evidence: docs (public-docs, README); code unread.
- Mechanism: injected MCP tools (`create_agent`, `send_agent_prompt`, `list_agents`, profiles with "When to use" notes) let a main agent delegate across providers and machines; schedules start a fresh agent on a cron; heartbeats re-prompt the same agent periodically, can be set to expire, and are deleted on completion ("keep an agent working", "build babysitting"); the committee skill runs two contrasting profiles in parallel, no edits, and trusts the finish notification instead of polling. A user in the tier thread notes Paseo's ACP base makes session import/export between devices rough.
- Versus orchestrate: have — panel/consensus review, advisor split, `trigger=interval`, per-role model choice. Missing — heartbeat-with-expiry as a stall answer.
- Adopt: candidate 3(e) only, opt-in.

### cmux (manaflow-ai/cmux) — Ghostty-based macOS terminal with notification rings and agent session forking
- Links: github.com/manaflow-ai/cmux (28,148 stars, pushed 2026-10-13); v0.64.19 "Fork Conversation".
- Evidence: README plus code search (`AgentLaunchSanitizer*`, `ForkParentFallbackSessionIndexTests`) — partial repo-read.
- Mechanism: fork = resume the detected session id with the engine's fork switch (`--fork-session` for Claude), using the pane's recorded launch argv after a sanitizer strips prompt arguments and pins boolean flags so a following one-word prompt is never replayed on resume. Notification rings and a panel list who needs attention; `cmux claude-teams` shows teammates as native splits.
- Versus orchestrate: have — resume-by-id lines per engine (`board resume`). Missing — a fork variant of resume.
- Adopt: below the cut. "Primed fork fan-out": when N workers need the same large read, prime one session and fork it (`claude --resume ID --fork-session`, `grok --fork-session`, `pi --fork`, `opencode --fork`, all already named in `engine-*.md`); the saving is cache sharing, which I did not measure. One paragraph in `strategy-parallel.md` / `shared-token-economy.md`, value L–M, effort S.

### Superset (superset-sh/superset) — desktop workspaces with worktrees, diff viewer, PR panel, design mode
- Links: github.com/superset-sh/superset (15,132 stars, pushed 2026-10-13). Evidence: README only. Takeaway: select diff lines in the Pull requests view and send the feedback to a running or new agent session (the PR-feedback loop of candidate 4, human-driven); "Pages" (an agent publishes a report, teammates pin comments, a watching agent revises). Worktrees "do not sandbox processes or prevent merge conflicts" (honest note, matches `shared-isolation.md`). Nothing else orchestration-specific read.

### Superconductor (super.engineering; X: @superdoteng) — closed native Rust macOS app
- Links: super.engineering. Evidence: site text only (post-only for mechanisms). Claims `sc team run` (one lead, specialist roles), `sc agent send`, `sc coordination-state` (shared decisions and handoffs), a feature-level `FEATURE.md` context across repos, and a "branch knows what comes next" router. The tier-list author ranks it C. Takeaway only the next-action router (candidate 4).

### Multica (multica-ai/multica; X: @jiayuan_jy, @hasantoxr) — issue board where agents are assignees
- Links: github.com/multica-ai/multica (52,692 stars). Evidence: README. Agents pick up issues, comment, raise blockers, hand back for review; squads with a leader; cron "autopilots"; "reply while it works and the message lands in the current run" (steering, Claude/Codex/Grok); per-run and per-issue usage; review gates. This is lifecycle ownership (the issue tracker), which orchestrate deliberately does not own. No adoption.

### vibe-kanban (BloopAI/vibe-kanban) — kanban for agents; sunsetting
- Links: github.com/BloopAI/vibe-kanban (28,347 stars, last push 2026-09-19). Evidence: README, which now reads "Vibe Kanban is sunsetting." The earlier sweep (`2026-09-review-sweep.md` §3) already noted its fixed generic lanes and hidden tests; nothing new, drop from watch lists.

### openharness (autonomous-ai/openharness) — native app plus per-machine tmux daemon, relay-connected
- Links: github.com/autonomous-ai/openharness (1,240 stars). Evidence: README. "Harness never wraps an agent. It reads transcripts and uses the vendor's own hooks"; one daemon per machine dials out; end-to-end encrypted relay; a key jumps to the harness waiting on you; opt-in `harness send` messaging. Same hook-not-wrapper stance as AO; takeaway only the attention jump (candidate 6).

### Others (one line each)
- Supacode (supabitapp/supacode, 2,393 stars): native macOS worktree command center on libghostty; metadata only, nothing read.
- Lysium (dabit3/lysium, 28 stars, last push 2026-06): Devin-backed PR/issue triage with swipe actions and an "Assess" brief per PR; a decision-triage UI, no coordination mechanism.
- axel (scarce/axel, renamed from txtx/axel-app, 208 stars): task list + tmux/Ghostty + worktrees + SSE inbox of permission requests; same shape as herdr-projects without the semantics.
- Maestri (@maestriapp, X only): canvas app; "Maestro mode" lets an agent recruit, role-assign, connect and dismiss other agents; device "portals" (simulators on the canvas); notes shared between connected agents. Equivalent to team/hierarchical strategies; post-only.
- Synara (@trySynara, X only): v1.0.2 "Hubs" with 1–8 parallel workers, queued work and human approvals, a "Synara orchestrator" that spins up cross-provider work, monitors, nudges and answers questions (user description); Inbox and Activity views. Post-only; no mechanism visible.
- Empryo (@BniWael, X only): claims "work survives a crash: the next start resumes the turn, nothing lost or run twice", "see and stop every engine", a Council feature, phone steering over Tailscale, "10k subagents" and "1929 PRs in 30 days / 43.9B tokens". All self-reported and unverifiable; the "nothing run twice" claim is the same exactly-once concern as candidate 3(d). Treat as marketing.
- nyx (@Kraggich, X only): every branch a canvas zone with its own agents, preview and diff; UI only.
- Not in the lead's list but in the sources: a notch app for Claude/Codex/Cursor/Hermes sessions (@brenhubr) showing who is working, waiting or needs attention; an "agent tray" floating window found while searching (X, 2026-10-13). Both are the candidate-6 pattern as a product.

## Not worth adopting (one line each, why)
- Remote and phone steering as a product (Paseo, Empryo, T3, Orca, AO mobile, Maestri, Traycer mobile): needs a persistent daemon and relay; the skill's lever is the push hook (candidate 6) and whatever remote control the host offers.
- Multi-machine threads and Teleport (herdr-projects `--machine`, herdr-gpui, Traycer hosts, openharness): needs a daemon per machine; our lanes are local processes. The portable part (handoff note) is in candidate 2.
- Session import (Traycer, AO import offer, Multica resume): converts the user's own past sessions into app objects; every orchestrate session is already journaled by id (`board dispatch --session`), foreign sessions are not our run.
- In-app browser, design mode, device portals, Notion-style markdown editing (Traycer, cmux, Superset, Orca, Maestri): UI features with no coordination content.
- Issue-tracker lifecycle (Multica, vibe-kanban, axel TASKS): `orchestrate` "does not select or own the digital-product lifecycle" (SKILL, Mission).
- Dynamic recruit/dismiss teams (Maestri, Superconductor `sc team run`): same as team and hierarchical strategies; no new mechanism.
- Terminal draft detection and trust-screen answering (herdr-projects `prompt_box.rs`, `thread keys`): only needed to type into live TUIs.
- Live per-agent cost meters (Traycer Usage, Multica analytics, AO usage observers): we have post-exit receipts (`board receipt`), the cost band in the flight plan, and `--max-budget-usd` (`shared-lane-hygiene.md` 8); mid-run meters need log parsers that drift ("stores vary and drift", `shared-monitoring.md`). Pre-flight quota headroom is a nice idea but no engine exposes it uniformly.
- Loop time-travel (diff / rerun-from-node / fork a run, CompozyOS): workflow-engine feature, belongs to lane C.
- Scale and speed claims (Empryo 10k subagents, 1929 PRs, 43.9B tokens): self-reported, unverifiable.

## Gaps (what you could not verify, and why)
- Traycer Host is closed source: the `agent.stalled` rule, routing internals and the Sweep predicate's implementation are docs-only. The tier-list stall complaint cannot be traced to a mechanism.
- CompozyOS "Continue with another agent" and "Agents message each other" (beta.33) are post-only; the repo's release notes did not contain them yet and its product code was not read.
- AO: `contract.DeriveStatus` and the SCM observer bodies were not read (precedence is from `docs/architecture.md`); the agent-switch saga was read as domain types plus docs, not its runner; the list of "signal-capable" harnesses was not checked. The link between the @agent_wrapper / @Maaztwts posts and this repo is inferred (name plus the Composio redirect), not stated by either side; the "AI that builds itself" claim is unverified.
- Plannotator: ADR and guides read; the Inbox store code and its model test were not run, so "checked by a model" is the ADR's claim.
- Orca: skill text read, runtime code not; `consumer_fenced`, `request-show` and the circuit breaker are described by the contract, not verified against behaviour.
- T3 Code orchestration-v2 is a target design; I did not check how much has shipped. SS-tier ranking rests on one user's daily use (post-only).
- Superset, Supacode, Multica, openharness, axel, Lysium: README level only. cmux: fork mechanism from code search hits and tests, not a full read.
- Maestri, Synara, Empryo, nyx, Superconductor internals: posts and site copy only. xrelay used 5 read calls (tier-list thread of 60 of 222 replies, Maestri search, Maestri posts, Synara search, Empryo author posts); the thread was truncated at 60 replies.
- Nothing was installed or executed; no cache-sharing or cost number for forked fan-out was measured; thresholds quoted from Traycer (6 h wait), Compozy (30 + 10 min), AO (90 s, 3 attempts) and herdr-projects (30 s, 300 s, 10 s) are their defaults, not validated for this skill.
