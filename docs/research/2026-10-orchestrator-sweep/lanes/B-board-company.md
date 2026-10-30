# Lane B-board-company — Board-driven and "company" orchestrators

Research date 2026-10-13, compared against `skills/orchestrate` v1.31.0. Grades: **repo-read** (I read
the implementing file) · **docs** (vendor docs, blog or changelog read from the primary page) ·
**post-only**. Star counts and push dates are from `gh api` on 2026-10-13.

What the lane says in four lines:
- Seven of the fifteen tools take work from a tracker or chat and let the ticket state steer the
  agent (Symphony, Paperclip, Warp Factories, QM loops, Cursor Projects subscriptions, Factory
  automations, RalphBlaster). Orchestrate's `loop` stops at "cheap gate script on a tick".
- The serious budget designs (Paperclip, Auto-Company, QM) converge on admission control and
  fail-closed accounting. Orchestrate's budget is a rule plus one post-hoc finding.
- Cursor's "15x": it is $20,057 / $1,339, and the $20,057 run is an informal, ungraded solo-Fable run.
  The controlled spread is 7.9x. The skill already cites the ~8x (`shared-model-routing.md` rule 11).
- Persona and org-chart layers have no measured benefit in any source. What persists in the good
  systems is state and standing orders, with workers ephemeral. Orchestrate already works that way.

## Top candidates (ranked, 3–6)

1. **Budget as admission control, not a post-hoc finding** — from Paperclip (repo-read), Auto-Company
   (docs + script), QM swarms (docs) · value H · effort M · lands: `scripts/board` (`dispatch` and
   `launch` refuse past a hard cap; `check` findings at 80% and 100%; `--budget` accepts `usd=`/`soft=`),
   `shared-safety-rails.md` "Loops & budgets" (:33-38), `strategy-loop.md` Rails (persistent pause +
   explicit resume), `shared-flight-plan.md` budget line · why it beats what we have: today the rule says
   "budget exhausted → stop" (`shared-safety-rails.md:37`) but only `agents` is compared, after the fact
   (`scripts/board:3084-3086`); `tokens` and `cycles` are stored and never checked against receipts (the
   `claude` launch preview only carries a `--max-budget-usd <cap>` placeholder, `scripts/board:201`); a
   parallel wave can overshoot because nothing counts lanes in flight.
   - Paperclip, repo-read (`server/src/services/budgets.ts`, `budget-reservations.ts`): soft at
     `warnPercent` (default 80), hard at 100% pauses the scope and cancels active runs; admission is also
     blocked while any earlier run's accounting is pending or unpriced (`observedBlocks`); a reservation
     is taken before dispatch ("Estimates constrain admission; they cannot cap a provider's bill. A
     reservation survives timeouts and restarts until accounting proves closure"); one open incident per
     policy, threshold and window; resolve = raise-and-resume, resume-once, or keep paused. Docs say the
     80% alert is delivered to the agent ("focus on critical tasks only"). Enforcement is on billed
     dollars only (tokens are deliberately not enforced, per the plan doc); `subscription_included` usage
     does not count against the money budget (relevant: our lanes often run on subscription logins).
   - Auto-Company, docs (`docs/usage-governance.md`) plus constants read from `scripts/core/auto-loop.sh`: a
     pending cycle identity is written before the provider call; unknown usage is `null`, never zero; a
     hard-limit metric missing for any cycle in the window is state `unverifiable` and pauses; a hard limit
     lets the current cycle finish, then writes a persistent pause marker only an explicit `resume` clears
     (one cycle, bound to the exact ledger). Circuit breaker: 5 consecutive errors, 300 s cooldown.
   - QM swarms, docs (`docs/swarms.md`): finite per-swarm budgets reserved atomically with what consumes
     them: agents 32 (failed spawns still count, so retry storms cannot mint agents), depth 4, messages
     128, notifications 256, lifetime 1 h from first spawn, 10 min per turn.
   - Counter-example: Symphony has no spend cap at all (turns, concurrency and a stall timeout only;
     token accounting is observability, SPEC §13.5). Pair its intake loop with this.

2. **Tracker-intake loop recipe: the ticket board as claim ledger and stop signal** — from Symphony
   (repo-read), Paperclip (docs), Warp Factories (docs), QM loops (docs), Cursor Projects (docs), Factory
   automations (docs) · value H · effort M · lands: `strategy-loop.md` new variant beside "Measured-target
   loop", `triage.md` ops row, a recipe in `docs/recipes.md` (optional ~100-line stdlib `scripts/intake`;
   claims are board tasks with the ticket id in the title, e.g. `board todo 7 "GH-123 …"`, since agent
   names must match `role-N`, `scripts/board:150`) · why it beats what we have: `strategy-loop.md:62` gives
   one line for event-based triggers, so a ticket closed mid-run keeps its worker running and a restarted
   loop can dispatch the same ticket twice.
   - Symphony SPEC (repo-read §5, 7, 8, 10.5, 14): reconcile before dispatch on every tick (tracker state
     is the stop signal: terminal → kill worker and clean workspace; no longer active → kill, keep the
     tree); claim states Unclaimed/Claimed/Running/RetryQueued/Released; candidates = active state ∩
     opt-in labels ∩ not blocked ∩ unclaimed ∩ free slot, sorted priority → created → id; global cap 10
     plus per-state caps; stall 5 min → kill and retry; failure retry `min(10 s · 2^(n−1), 5 min)`, clean
     exit → 1 s continuation re-check; continuation turns send guidance only, up to `max_turns` 20; a
     handoff column (Human Review) is not an active state, so the worker stops and a human moving the card
     to Merging/Rework re-dispatches; input/approval requests may never stall a run (reference config:
     auto-approve, user-input = failure; since May 2026 input-blocked sessions are shown, not stalled);
     tracker tokens never reach the child (`linear_graphql`, `github_api`, `jira_rest` run host-side);
     restart recovery = poll the tracker + reuse workspaces, no database.
   - Hardening that came from use (commit log): opt-in label required for dispatch (2026-06-04),
     blocker links gate dispatch (Jira, 2026-07-20), last good config kept on an invalid reload (2026-07-17).
   - Warp's default factory triage chooses implement | spec | wait for each work item (docs).
   - Not "an agent per lifecycle stage" as the tweet says: one session per ticket while it sits in an
     active state; `elixir/WORKFLOW.md` routes the flow by status, and the single `## Codex Workpad`
     comment is the plan/progress/validation record ("Rework = full approach reset": close PR, delete
     workpad, fresh branch).

3. **Unattended-loop rails: single-flight, interrupted-cycle pause, protected Boundaries, bounded waits,
   coordinator lockout** — from Auto-Company (repo-read), Paperclip monitors (docs), QM and Cursor
   coordinators (docs), Symphony claim map · value M–H · effort S–M · lands: `strategy-loop.md` Rails and
   contract, `shared-monitoring.md:136` (external waits), `scripts/board check` · why it beats what we
   have: the loop contract is authoritative by convention only and the evolve pass may rewrite "Goal/SOP
   drift" (`strategy-loop.md:122+`); nothing hashes it, nothing stops two ticks overlapping, and the
   LoopX-derived backoff escalates 15 → 30 → 60 min with no bound.
   - Auto-Company `scripts/core/consensus-guard.sh` (repo-read, first 120 lines): preflight refuses if the
     baton lacks exactly one canonical Human Overrides + Priority Issues section (pause
     `human_override_invalid`); an unresolved P1 blocks the cycle before the engine runs; begin-cycle
     snapshots the baton and writes a pending marker; a killed cycle leaves the marker, and the next start
     pauses (`interrupted_cycle`) instead of auto-resuming. The charter and `PROMPT.md` (docs) add: a
     changed Human Overrides region rolls the whole cycle back and pauses the loop, and the same Next
     Action twice in a row means stuck (change direction or shrink scope).
   - Paperclip issue monitors (execution-semantics §8): one-shot, never recurring; `nextCheckAt`, `notes`,
     `timeoutAt`, `maxAttempts`, `recoveryPolicy` = wake_owner | create_recovery_issue | escalate_to_board;
     re-arming an exhausted monitor is rejected. Ours has no deadline or poll cap on a wait.
   - Coordinator that cannot implement: QM's `responsive_spine` coordinators lose command execution,
     background process tools, credential execution and provider-native delegation, dispatch with
     `subagents.open`, end the turn, and are woken on completion; Cursor Projects' coordinator "doesn't
     write code itself … never blocked". Our universal rule 1 is a rule; for unattended runs it could be a
     PreToolUse/`--disallowed-tools` recipe scoped to source paths (allow `.orchestrate/**`).

4. **Review verdicts bound to the reviewed revision** — from gstack `/autoplan` (repo-read), QM (repo-read)
   · value M · effort S · lands: `scripts/board` (`gate` and `vote` take `--at <sha>`; `check` and `done`
   compare it with the task's last return commit), `shared-review-gates.md`, tie-in to
   `shared-contracts.md:32-34` · why it beats what we have: `board gate` stores task, kind, verdict, round,
   findings and agent only (`scripts/board:4440`); `done` checks that no gate failed, not that the verdict
   saw the final commit (`scripts/board:4447-4452`); only the final gate is HEAD-bound (`finish_invalid`,
   `scripts/board:2555`). The hole is narrow (a fix wave starts a new attempt and resets gates), so value
   is M, not H.
   - gstack `autoplan/DRIVER.md`: every result must start `INPUT: <phase> <snapshot sha256>`, a wrong
     INPUT is refused, `revise` reopens every phase whose reviewed plan changed (eng last), gate replies
     bind to `gate_rev` (bare yes/no unparsed), the parent relays the owner gate and never approves it.
   - QM `AGENTS.md`: the `Wall of shame review` CI check fails until the PR description reports every lens
     at the PR head. Two independent sources, same rule.

5. **Failure-catalog lenses: always-reviewed tier plus cheap-model lens triage** — from QM `docs/SPEC.md`
   "Wall of shame" + `AGENTS.md` (repo-read) · value M · effort S · lands: `shared-review-gates.md` Panels
   (:99-114), `prompt-quality-reviewer.md`, `shared-prepare.md` P2 (look for the repo's catalog) · why it
   beats what we have: lenses are chosen by the controller per run (`shared-review-gates.md:101`) and
   nothing reads a repo's own failure history. Only where a repo keeps such a file; Prepare can offer to
   start one.
   - Mechanism: the spec is human-written, agents may only append wall-of-shame entries; each category
     (Overengineering, Band-aid fixes, Duplication, Hand-rolling, Non-durability, Config-matrix expansion,
     …) lists dated examples with PR links and a status (wound back / still present / unknown); categories
     marked "always reviewed" get a fresh-context reviewer on every PR and "triage cannot mark them not
     relevant"; the rest go through one Haiku-class triage pass that keeps any lens it is unsure about;
     each reviewer returns accept | request changes, a 0-100 score and 1-2 sentences; no aggregate
     threshold. Review depth scales with blast radius judged "by checking callers, not by counting files".

6. **Agent-readiness probe and a journaled baseline before fan-out** — from Symphony (README + WORKFLOW),
   Factory (docs) · value M · effort S · lands: `shared-prepare.md` P2/P5, `shared-flight-plan.md` (a
   `readiness` footer), `triage.md` (wide fan-out on a repo with no runnable verifier → warn or narrow)
   · why it beats what we have: Task 0 smoke-tests tooling it installs (`board exec 0 --name smoke`,
   `shared-prepare.md` P5), but nothing runs the repo's own test/build on a clean checkout, so a red
   baseline makes every later gate ambiguous. One existing primitive does it: `board exec 0 --name
   baseline -- <cmd>`.
   - Symphony README: "works best in codebases that have adopted harness engineering"; WORKFLOW.md
     requires "reproduce first … record the signal" before changing code (we have no reproduce-first
     rule for `kind=fix`; criteria-before-code covers builds). Factory (announcement page, via WebFetch
     summary): Agent Readiness scores a repo out of five, "most enterprise customers start at level two",
     a documented one-line setup command is a criterion, and Missions are said to work best on
     repositories at level four or above.

Smaller adoptions (unranked, detail in the tool entries):
- Gather-replies join: `board wait --replies` returns once every `--ask` this agent sent has a reply or its
  recipient's stint ended (OpenBot 0.23, docs) · L–M · S.
- Population loop recipe for `strategy=loop topology=parallel`, which `SKILL.md:75` names without
  mechanics: N experimenters, a periodic leader check, seed the next wave from the best measured commit
  (ClawTeam README, self-reported) · M · S.
- Count only settled, effective cycles toward the evolve/replan cadence; today a no-op run is a successful
  run and counts (`strategy-loop.md:88`) (LoopX 1.3/1.4, docs) · L · S.
- Inventory named subagent definitions (`.claude/agents`, `.codex/agents`) like skills: `scripts/capabilities:27-34`
  lists skill roots only, and five tools here ship roles as files · L–M · S.
- State "a child's authority never exceeds its parent's" in `strategy-hierarchical.md` (OpenBot 0.24,
  QM, docs); it has per-lead worker budgets (:62) but no authority rule · L–M · S.
- Classify returns `plan_only` / `empty_response` for any worker and re-dispatch once with a specific nudge
  (Paperclip heartbeat protocol, docs); we have the empty-diff check for xcli lanes only (`scripts/board:3055`) · L · S.
- `$0` stub-model dry run over the real inputs before a paid workflow fan-out (gstack `/eval-plan`, README
  row only) · L · S.

## Tools

### OpenAI Symphony — polls an issue tracker and runs one coding-agent session per ticket
- Links: https://github.com/openai/symphony (27.7k stars, last push 2026-09-15, Apache-2.0; Elixir
  reference implementation, language-agnostic `SPEC.md` Draft v1)
- Evidence: repo-read. All 2,312 lines of `SPEC.md` (sections 5-8, 10.5, 13.5, 14, 15.5 and Appendix A
  read closely), `elixir/WORKFLOW.md`, `elixir/README.md`, 40 recent commits. Elixir code not read.
- Mechanism: see candidate 2. Intake, claim, reconcile, retry, stall, handoff states. Additional: tracker
  adapters now Linear, GitHub Issues, Jira Cloud, Asana, GitLab; optional SSH worker pool (per-host cap;
  a rerun after side effects is a new attempt, never invisible failover); strict template rendering (an
  unknown variable fails the render); hot-reloaded `WORKFLOW.md` is the policy file (prompt + front matter,
  versioned in the repo).
- Versus orchestrate: partial. Have: durable record (journal, `progress.md`), stall flag
  (`shared-monitoring.md:33`, 10 min), concurrency by default, a handoff gate. Missing: tracker adapter,
  claim/reconcile semantics, tracker-driven stop, per-state caps (`strategy-loop.md:62` is one line).
- Adopt: candidate 2 (recipe, not the Elixir runtime) and the `readiness` half of candidate 6. No: SSH
  pool, host-side credential tools (our workers do not hold tracker tokens).

### Paperclip — a control plane for an organisation of agents (tasks, budgets, heartbeats, approvals)
- Links: https://github.com/paperclipai/paperclip (101.5k stars, pushed 2026-10-13, MIT); release v2026.1012.0
  (2026-10-12, 130 commits, 9 contributors); the tweet's "70k+" was a 2026-06-29 snapshot.
- Evidence: repo-read for `server/src/services/budgets.ts` and `budget-reservations.ts`; docs for
  `doc/SPEC.md`, `execution-semantics.md` (§6, §8 monitors, §11), `TASK-WATCHDOG.md`,
  `architecture/durable-continuation-scheduler.md`, `guides/execution-policy.md`,
  `guides/agent-developer/heartbeat-protocol.md`, the budget plan, the full release notes. About 10,000
  files; the 150 KB execution-semantics doc was skimmed past §6/§8.
- Mechanism:
  - Org model: a human Board (approves hires and the CEO's initial plan, can pause any agent or subtree,
    overrides any budget); agents with role, `reportsTo`, budget and heartbeat; "tasks are the
    communication channel"; single assignee with atomic checkout (409 on conflict, never retry).
  - Heartbeat is a protocol, not a runtime: a finite run (identity → approvals → inbox → pick → checkout →
    context → work → status → delegate) that exits; the scheduler ticks every 30 s (min 10 s) and
    reconciles stranded issues. Invariant: an assigned open issue has a live path, a durable wait, or a
    visible terminal/blocking disposition. The doc's own post-mortem (DOT-2) shows the failure: a worker
    reporting `done` that the evidence classifier rejected was re-woken every tick; "increasing the polling
    interval only hides the bug".
  - Budgets: candidate 1. Execution policy: the runtime intercepts `done` into `in_review`, the executor
    is excluded from reviewing, a decision needs a comment in the same PATCH, changes-requested returns to
    the same stage, and a run that leaves no comment gets one retry (`missing_issue_comment`).
  - Three watchdogs: task watchdog (an agent that audits a stopped issue tree, authority limited to the
    subtree, cannot approve governance), silent active-run watchdog (flags at 5 and 15 min, changed from
    1 h and 4 h in 1012, no auto-cancel), liveness recovery. Monitors: candidate 3.
  - Run liveness classes: completed, advanced, plan_only, empty_response, blocked, failed, needs_followup;
    only `plan_only` and `empty_response` get a bounded re-wake; "workspace provisioning alone is not
    progress". Child → parent reporting has three channels; low-trust presets withhold the direct-parent
    comment because a report is a prompt-injection carrier into higher-trust context.
  - v2026.1012.0: Claude Code, Codex, OpenCode and any MCP client join as a signed-in user (experimental,
    off by default); default CEO instructions cut from about 1,900 words to 20, new hires get one sentence,
    bundled planning skills about 400 words and "no longer force a child-task matrix"; a Codex turn killed
    by a restart resumes "once the old process is proven gone"; model-at-capacity auto-retries after 1 then
    2 min; experimental AI-connection pools rotate new tasks across saved accounts (pinned per task);
    stored grants with unknown selectors now deny.
- Versus orchestrate: partial. Have: flight-plan approval, `board check` covers the watchdog's checks
  (blocked needs owner + next action `scripts/board:3048`, dispatched-never-returned :3024, done with no
  review :3042), reviewer lineage ≠ implementer's. Missing: enforced budget (candidate 1), bounded waits
  (candidate 3). No heartbeat or pull model; the controller pushes, which is fine.
- Adopt: candidates 1 and 3; the liveness-class labels (small list). No: org charts and persona CEO, the
  separate watchdog agent (a script already does those checks for free), the MCP surface. The instruction
  shrink supports the existing prompt-weight work (`evals/compression-ablation`); no change proposed.

### LoopX (delta only) — external state kernel for 200+ hour agent loops
- Links: https://github.com/huangruiteng/loopx (6.3k stars, Apache-2.0, pushed 2026-10-13); v1.3.0 and
  v1.3.1 (2026-10-06), v1.4.0 (2026-10-11).
- Evidence: docs. v1.4.0 and v1.3.0 release notes (headings and the sections on cadence, progress review,
  delegation stop), the 2026-10-07 EdgeBench interim note (first 9 KB). Code not read.
- Did the August candidates land? All four, in v1.9.0: the invariants in `shared-contracts.md:32-34`,
  stateful backoff in `shared-monitoring.md:136-142`, `replan_noop` and the Outcome Floor in
  `strategy-loop.md:102-111`, "repair never lowers the gate" in `shared-safety-rails.md:64`.
- What changed in LoopX: new Goals default to a canonical SQLite state kernel with hard leases (breaking;
  reviewed migration with backup and reverse path); a review obligation every N settled work Turns (1-5 in
  1.3.0, default six in 1.4.0) where monitor polls, duplicate retries, unspent writeback and missing
  settlement do not count and accepted negative results do; an acceptance-bound progress review that runs
  in shadow before assist ("a counter is not progress", "a model opinion is not accepted evidence", stale
  criterion/result binding rejected); governed delegation stop that separates acknowledgement, proved
  process drain and settlement ("do not infer host exit … from absent records"). EdgeBench (Lean, blind,
  Resume path, early v14 vs current): raw score at 180 min 0.1103 → 0.3478 and at 450 min 0.1882 → 0.5243;
  across the Resume and Explore paths the ratios run 2.8–3.5x on `gpt-6.1-sol / xhigh`. The note itself
  says prompts, runner and control plane changed together, so it is not a causal gain.
- Versus orchestrate: covered. `board reap` already separates a stop from proof the process is gone.
- Adopt: settled-cycle counting (small list); shadow-before-enforce for any new gate, as a one-line note
  in `shared-review-gates.md` (L value). No: SQLite kernel.

### YC QM — multiplayer agent harness (Slack + web), per-person and per-room scopes
- Links: https://github.com/yc-software/qm (15.4k stars, MIT, created 2026-07-29, pushed 2026-10-13;
  TypeScript, Postgres)
- Evidence: repo-read. README, `docs/SPEC.md` (north stars, subsystems, Wall of shame), `AGENTS.md`,
  `docs/swarms.md`, `docs/persistent-subagent-sessions.md`, `docs/loop-ingestion.md`. Not read:
  `capability-tokens.md`, `background-ownership.md`, `memory-records.md`, `session-tape-spec.md`.
- Mechanism: each scope has its own memory, files, keychain view, crons and durable sandbox; org posture
  Strict | Auto | Dangerous that narrower scopes can only tighten; swarm budgets (candidate 1); spawn and
  send take a `requestId` (same payload returns the original, different payload fails); worker control
  pause/resume/stop where "an agent may control only itself or its descendants"; no automatic
  reply-to-reply notifications; workers never inherit the root's approval grants; inter-agent messages are
  "external data, not human authorization", screened per message; Loops ingest from schedule, signed
  webhooks, Slack events and Gmail Pub/Sub with durable receipt before ack, dedupe, and discovery skipped
  for ingested work, held drafts behind ship gates; Wall of shame (candidate 5). North stars worth quoting:
  "Unhobble … keep the harness as thin as possible", "Delete before you add", and system prompt for
  orientation only because "strict checks belong locally".
- Versus orchestrate: partial. Have: mail with caps, `board reap`, the review panel (`board vote`).
  Missing: candidates 1 (the list of finite budgets), 3 (coordinator lockout), 5.
- Adopt: candidates 1, 3, 4, 5; authority-never-exceeds-parent (small list). No: Postgres tape, scopes.

### Auto-Company ("Autonomous Company") — a daemon that runs 14 persona agents in a loop on a shared baton
- Links: https://github.com/MaxMiksa/Auto-Company (3.1k stars, MIT, pushed 2026-10-13; renamed in v3)
- Evidence: repo-read for `CLAUDE.md` (charter), `PROMPT.md`, `docs/usage-governance.md`,
  `scripts/core/consensus-guard.sh` (first 120 lines), constants in `scripts/core/auto-loop.sh`; docs for
  the README. Not read: the rest of the loop script, the Product Center.
- Mechanism: launchd/systemd daemon → one CLI call per cycle → squad of 3-5 of 14 expert-persona files →
  mandatory update of `memories/consensus.md` (fixed template: Next Action, Human Overrides, Priority
  Issues) → sleep. Convergence rule (`PROMPT.md`, Chinese, translated here): cycle 1 brainstorm, cycle 2
  pre-mortem + market + unit economics → GO/NO-GO, every cycle after 2 must produce an artifact, pure
  discussion is forbidden; the critic role may veto but not delay. Circuit breaker `MAX_CONSECUTIVE_ERRORS=5`, `COOLDOWN_SECONDS=300`; consensus rollback;
  guards and usage ledger as in candidates 1 and 3. Product Center runs up to four projects at once.
- Versus orchestrate: partial. Loop rails (cap, kill switch, regression breaker) exist; budgets,
  override guard and interrupted-cycle pause do not.
- Adopt: candidates 1 and 3. No: persona prompts (the README's "thinks like Bezos" has no measured
  effect in any source; Cursor's measured gains come from separating planner and worker context).

### ClawTeam — leader agent spawns worker CLIs in worktrees and tmux, coordinates through the filesystem
- Links: https://github.com/HKUDS/ClawTeam (5.5k stars, MIT, last push 2026-05-09, five months quiet)
- Evidence: docs (README, 34 KB). Code and the linked `novix-science/autoresearch` results not read.
- Mechanism: `clawteam spawn` gives each worker a git worktree, tmux window and identity; inbox, task list
  and `clawteam board show` live on disk. The autoresearch case: 8 agents on 8 H100s (four on the default
  agent, four spawned as Codex), leader checks every 30 min, reads each `results.tsv`, seeds new agents
  from the best commit/config, kills idle agents and recreates worktrees. Claimed 2,430+ experiments and
  val_bpb 1.044 → 0.977 (6.4%),
  about 30 GPU-hours, all self-reported. The tweet says "killed underperforming agents"; the README says
  "killed idle agents".
- Versus orchestrate: partial. `SKILL.md:75` lists `strategy=loop topology=parallel` with no mechanics;
  the measured-target loop is single-agent.
- Adopt: population-loop recipe (small list, low confidence). No: tmux transport (we have `board launch`).

### gstack — Garry Tan's skill pack (23 role-named skills), plus a stateful review runner
- Links: https://github.com/garrytan/gstack (136.3k stars, MIT, pushed 2026-10-13)
- Evidence: repo-read for `autoplan/DRIVER.md` (first 80 lines, up to the gate-reply grammar) and
  `benchmark-models/SKILL.md` (keyword skim); README (88 KB) searched by keyword, not read end to end.
  `autoplan/SKILL.md` (65 KB) and `/eval-plan` not read.
- Mechanism: not a conductor. "Conductor" is a separate product (conductor.build) Garry uses to run 10-15
  sprints in parallel. gstack is a process: Think → Plan → Build → Review → Test → Ship → Reflect. The one
  orchestrated piece is `/autoplan`: a runner that keeps state while the parent agent dispatches two
  voices per phase (native, plus another model family) for ceo → design → dx → eng, with findings carrying
  severity and a `user_challenge` flag only for changes of scope, cost or direction, an owner gate,
  `--spend-cap <usd>`, and `status|resume` after a crash. See candidate 4.
- Versus orchestrate: have most of it (plan-veto panel `kind=plan`, cross-lineage reviewers, pilot slice).
  Missing: the revision binding.
- Adopt: candidate 4; the stub dry run (small list). No: role-named skills, `gstack-model-benchmark`
  (same prompt across Claude/GPT/Gemini for latency, tokens, cost, judge score; a catalog-refresh concern),
  `gstack-context-bill` (token bill of materials for a skills tree; lane F's topic).

### Mission Control (builderz-labs) — self-hosted dashboard and dispatcher for agent runtimes
- Links: https://github.com/builderz-labs/mission-control (6.3k stars, MIT, pushed 2026-10-12). The
  bookmarked t.co link is unexpanded; description, SQLite, Kanban, cost tracking and the Aegis gate match
  the post.
- Evidence: docs (README, `docs/orchestration.md`).
- Mechanism: inbox → assigned → in_progress → review → done; atomic queue claim with per-agent
  `max_capacity` and priority → due date → FIFO; auto-dispatch with keyword model routing (Opus for
  "debug, architect, migration", Haiku for "format, rename, ping"); Aegis reviewer agent (3 rejections →
  failed); stale requeue after 10 min with an offline agent (5 requeues → failed); cron templates that
  spawn dated tasks; dispatch failures cap at 5.
- Versus orchestrate: have. Every counter ends in a terminal `failed`, which `board check` and the
  redesign cap already do.
- Adopt: no. The keyword router is the pattern Paperclip's routing plan and QM's Wall of shame both reject.

### OpenBot v0.23 — local-first desktop workspace of persistent AI teammates
- Links: https://github.com/nightly-labs/openbot (549 stars, pushed 2026-10-13, license NOASSERTION),
  changelog https://openbot.run/changelog (0.38.2 shipped today; v0.23.0 was 2026-09-27)
- Evidence: docs. Official changelog 0.21.2-0.24.0 read in full; 0.25-0.38 not read.
- Mechanism: 0.23: an agent's plan renders as a live task list in chat (Codex, Claude, OpenCode, Grok
  agents send plans); a "Waiting for replies" block lists each asked teammate as asked | working | replied
  | failed; "Let an agent read all the replies of its teammates in one turn. Before, an agent that asked
  two or more teammates started one turn for each reply"; "An agent can stop only a turn that its own
  messages started. It cannot stop work from you, a routine, a channel or another agent." 0.24: an agent
  can configure another (provider, model, effort, skills, Workspace-only) but "A new agent gets the access
  limits of the agent that creates it", and only the human can grant Full access, Computer Use or MCP.
- Versus orchestrate: partial. `board wait` in mail mode returns on the first mail (`scripts/board:3947`);
  `--task` is repeatable ("all must have landed") but replies to our own asks have no join. Live plan
  card and stop scoping exist as the kanban and `board reap`.
- Adopt: the replies join and the authority rule (small list). No: the desktop product.

### Warp Oz `/orchestrate` and Warp Factories — approval-gated parent/child runs; factory-as-code
- Links: https://docs.warp.dev/platform/orchestration , https://warp.dev/blog/open-infrastructure-for-building-a-software-factory
  (2026-08-18), https://www.warp.dev/blog/the-factory-stack (2026-09-05); client repo `warpdotdev/warp`
  (65.4k stars, AGPL); Oz and the server are proprietary per The New Stack (secondary).
- Evidence: docs. Orchestration concept page, multi-agent-runs page, both Factories posts.
- Mechanism: `/orchestrate` proposes children, each prompt and environment and the expected return, then
  waits for approval; orchestrations are one level deep; every run has its own lifecycle (INPROGRESS,
  SUCCEEDED, FAILED, BLOCKED, ERROR, CANCELLED); a durable inbox with a global sequence so "the parent
  never observes a child's SUCCEEDED state before the message that produced the result"; cancelling a
  parent does not cancel its children, by design. Factories: `factory.yaml` (agents per stage, runners,
  automations, scorers), a foreman dispatches triage (implement | spec | wait) → spec → implement →
  review → verify, work enters from Slack/Teams, Linear/Jira, GitHub/GitLab or a Factory MCP; scorers
  (LLM judge), replay of real work at its exact initial state, benchmarks across model/harness configs,
  and observer agents that open PRs against the factory definition. Warp reports automating about 30% of
  its own tasks this way (vendor-reported).
- Versus orchestrate: have the approval gate and ours is richer (model and effort per node, priced
  budget). Our journal is one total order for mail and transitions. Missing: replay and benchmark.
- Adopt: triage `wait` (inside candidate 2). Defer: replaying journaled tasks under another model mix
  needs a stable recurring workload; `board postmortem` plus the catalog refresh cover the one-off case.

### RalphBlaster — ticket → generated PRD → approval → Ralph loop in a worktree
- Links: none found (WebSearch and `gh search` return nothing; `Wildfront/ralphblaster-agent`, 0 stars,
  no description, is unverified).
- Evidence: post-only. A personal tool at Symphony's shape: ticket, click-to-generate PRD, approve,
  isolated worktree, ping when done, automatic cleanup.
- Adopt: no.

### Cursor Projects and the SQLite-rebuild experiment
- Links: https://cursor.com/blog/projects (2026-09-10), https://cursor.com/blog/agent-swarm-model-economics
  (Wilson Lin, 2026-07-20), https://cursor.com/blog/how-cursor-router-works (2026-08-06),
  github.com/cursor/minisqlite (286 stars)
- Evidence: docs. All three posts read from the primary pages; the cost chart read from its image.
- The numbers (chart in the post, read directly; `*` = "informal run for cost calibration; not part of the
  controlled comparison", graded informally, no quality conclusions drawn):

  | Mix | Cost | Note |
  |---|---|---|
  | Opus 4.8 planner + Composer 2.5 workers | $1,339 | planner about 2/3 of cost, worker fleet $411 |
  | Grok 4.5 planner and worker | $1,928 | |
  | Fable 5 planner + Composer 2.5 workers | $2,234 | planner bill slightly below Opus's, workers several times the tokens |
  | Opus 4.8 solo* | $5,153 | |
  | GPT-5.5 planner and worker | $10,565 | workers alone $9,373 |
  | Fable 5 solo* | $20,057 | |

  "15x" = $20,057 / $1,339 = 14.98 and compares an ungraded run with the cheapest hybrid. The controlled
  spread is 7.9x. Quality: new harness 73-85% of sqllogictest at four hours across mixes (Fable hybrid
  about two-thirds in the first hour), old harness 11-77%, and "Every new configuration went on to pass
  100% of the suite." Workers carry at least 69% of tokens (over 90% in most runs). GPT-5.6 Sol was dropped because it
  "appears more sensitive to literal and emphasized wording" and spiralled. Old harness: 68,000 commits in
  two hours (70x the new pace), over 70,000 merge conflicts, 54 crates vs 9; engine code 64,305 vs 9,908
  lines (Fable mix), 19,013 at 97% vs 4,645 at 100% (Opus mix).
- Projects (docs): one coordinator thread that "doesn't write code itself … never blocked"; cloud by
  default; shared context files synced across machines; subscriptions (Slack channel, schedule, follow
  all PRs, fix CI, act on open/merge). Vendor-reported: new users merge 30% more PRs, Projects-primary
  users six times as many (selection-confounded). Their migration pattern: review each PR closely early,
  less as fixes hold; gardening: "adds a lint rule whenever it sees the same mistake twice".
- Router (docs, vendor-reported): learned from hundreds of thousands of live turns, label = whether the
  user moves on or corrects the agent; a model is routed to only if it clears a one-sided 75% uplift
  threshold against the price-efficient model; Auto Intelligence "above Fable-level user satisfaction at
  68% lower cost", Auto Balance "outperforms Opus 4.8 at 41% lower cost".
- Versus orchestrate: have, and the skill already cites this post: `shared-model-routing.md` rule 11
  (~8x, workers 69-90% of tokens) and rule 10, `shared-review-gates.md:109-114` (lenses by input),
  `strategy-hierarchical.md:69` (no two subtrees decide the same question), `shared-monitoring.md:166-167`
  (megafile, thrash), `strategy-loop.md:119` (earned autonomy), `shared-contracts.md:139` (durable check),
  `CHANGELOG.md:1197`. Our `board postmortem` first-attempt-clean rate is the same outcome label as the router's.
- Adopt: no new mechanism. Optional doc fix: rule 11 could add that the tweet's 15x includes an ungraded
  solo run, and that planner spend stays near $0.9-1.2k across mixes (read off the plot) while worker
  spend runs $411 to $9,373, so the lever is the worker lane's model and effort.

### Kimi Work swarm
- Evidence: docs, thin. The product page (WebFetch summary): up to 300 agents from one instruction, results
  "assembled into a single coherent output", "assigns and executes sub-tasks across its agent swarm,
  verifies the results, and feeds them back into the next round"; Goal Mode saves the goal and decides each
  round complete | blocked | paused | continue (already mirrored in `strategy-loop.md` for Kimi `/goal`).
  No internals, shared state or failure handling documented.
- Adopt: no.

### OpenAI Agents API
- Evidence: post-only plus secondary coverage. The official page returned 403 to WebFetch. Secondary
  sources (runtimewire, tbreak, Product Hunt) agree on: public beta 2026-09-10, managed Codex harness,
  sandboxes (OpenAI, own or partner), days-long sessions, auto-compaction, tool search, an example with
  up to three concurrent subagents.
- Adopt: no; no inspectable orchestration mechanism.

### Factory Environments (2026-10-12) — reusable sandbox definitions for cloud Droids
- Links: https://factory.com/news/droids-now-have-a-fleet-of-sandboxes
- Evidence: docs, announcement level (WebFetch summary plus the X thread). An Environment is "a reusable
  definition of the sandbox your Droids run on", built into images ahead of time, "rebuilt every few hours
  and validated … only successful builds are promoted"; Missions fan out across sandboxes; Automations
  run on a schedule or on Slack/GitHub/webhooks from a fresh sandbox, as you or a service account under
  the same policy; admins decide reachable hosts and which shell commands need approval or never run;
  Agent Readiness (see candidate 6). Budgets and limits: not documented.
- Adopt: candidate 6's readiness line. No: image pipeline.

Also seen: Mike Fishbein's factory (already covered, `2026-08-frontier-sweep-x.md` §10; criteria-before-code
landed); @happylinks' "companies will own their own cloud agent orchestrator" is a quote-tweet with no
content (post-only).

## Not worth adopting (one line each, why)
- Persona or org-chart roles (Auto-Company's 14 experts, Paperclip's CEO/CTO, gstack's role skills): no
  source measures a benefit, and Paperclip itself cut default CEO instructions from about 1,900 words to 20.
  Cursor's measured gains come from separating planner and worker context, which we do.
- Hiring and budget-delegation governance (Paperclip Board gates): even its own SPEC marks budget
  delegation "TBD"; our flight plan is the approval gate.
- Keyword or regex model routing (Mission Control): Paperclip's routing plan and QM's Wall of shame both
  reject it; our task-class signals plus evidence-triggered escalation (rule 4) is the better shape.
- A learned router (Cursor Router): needs live-traffic scale; we already log the same label.
- Factory-as-code, observer agents that PR the factory, replay/benchmark (Warp): platform scope; our
  analogs are aliases, the evolve pass and `model-catalog-refresh`.
- A separate task-watchdog agent (Paperclip): `board check` already encodes the stop-legitimacy checks.
- Managed products with no inspectable mechanism (Agents API, Kimi Work, Factory Environments).
- UI products (Mission Control, OpenBot): the features we would want already exist as `board` views.
- SSH worker pools, AI-account rotation pools, sandbox image pipelines: infrastructure, not coordination.
- Persistent coordinator thread (Cursor Projects): our runs are bounded and resume through `board resume`;
  always-on is the host's `/loop` and `/schedule`.

## Gaps (what you could not verify, and why)
- Cursor's 15x is resolved from the chart image, but the post gives no per-mix pass rates beyond "every
  new configuration went on to pass 100%", and the planner/worker split of each bar is eyeballed except
  the two figures the text states ($411 and $9,373).
- Symphony: Elixir code and the `land` skill not read; its claims about stage handling come from SPEC and
  WORKFLOW.md, which is the reference prompt, not enforced behaviour.
- Paperclip: the 80% "focus on critical tasks only" delivery to the agent is from docs, not confirmed in
  code; I did not read the agent-companies spec at source or the rest of the 150 KB execution-semantics doc.
- QM: four docs not read (listed above); star counts differ across secondary sources, the 15.4k is `gh`.
- Auto-Company: only the first 120 lines of `consensus-guard.sh` and constants from `auto-loop.sh`; the
  cycle 1/2/3 convergence rule is read from `PROMPT.md`, its effect on output is unmeasured.
- LoopX: repo and the 104 KB v1.3.0 notes beyond headings and three sections not read; EdgeBench is an
  interim note with confounded changes.
- gstack: the autoplan skill body and `/eval-plan` not read; README searched, not read in full.
- Mission Control: owner link to the bookmarked post is inferred from the description.
- OpenBot: 0.25-0.38 changelog not read; the project moves roughly daily.
- Factory and Kimi pages were read through WebFetch summaries (lossy); docs.factory.com not read.
- OpenAI Agents API: official page blocked (403); secondary coverage only.
- RalphBlaster: no source found.
- ClawTeam: results repo not read; self-reported numbers.
- Metered calls: two Firecrawl calls (one search, 2 credits; one X-thread scrape, 30 credits) to find and
  read the Factory announcement. No other metered tool was used; no `xrelay`.
