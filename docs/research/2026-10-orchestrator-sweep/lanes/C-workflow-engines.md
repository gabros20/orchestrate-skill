# Lane C-workflow-engines — code-defined plans, loops and event-sourced runtimes

Compared against `skills/orchestrate` at v1.31.0 (main @ 2761fc5), 2026-10-13. Grades: **repo-read** (I read the implementing
file) · **docs** (vendor docs or spec read) · **post-only**. Read-only throughout: nothing run, installed or posted.
Prior sweeps: the 2026-08-07 sweep already produced 1.9.0's fan-in guard, replay-safety rules, fake-edge test and the "graph"
vocabulary note (`CHANGELOG.md` 1.9.0). It saw `tournament` only as one vendor's built-in shape
(`docs/research/2026-08-frontier-sweep-x.md`, norlava section). Nothing for tournament, generate-and-filter or quarantine has landed:
zero hits across `skills/`, `docs/*.md`, `site/`, `README.md`, `CHANGELOG.md`, `AGENTS.md`.

## Top candidates (ranked, 3–6)

1. **Plan graph as data the board can read: task edges, `board ready`, stale-on-change, brief hash at dispatch** — from Devin DW ·
   Claude Code DW · open-multi-agent · Mastra · acpx · value H · effort M · lands in `scripts/board` (Task model, `todo`/`init`,
   `attention`, `check`, `plan`), `shared-contracts.md` (journal vocabulary), `strategy-parallel.md` "Waves on the graph",
   `triage.md` Step 2, `shared-replan.md` Apply · why: every engine here keeps the plan where a lazy or compacted model cannot lose
   it, while ours keeps the dependency edges behind rule 12 ("dispatch on readiness") in the plan's prose and the controller's head.
   - Verified gap: `Task` has no edge field (`scripts/board:484`); `--after` exists only on a launched lane (`:1435`);
     `scripts/brief-check:91-121` prints read↔write deps as hints and records nothing; `board check` guesses "mis-ordered" from task
     numbers (`:3063`), which `triage.md` says are not dependencies.
   - Shape: record edges when tasks are queued (`board todo N "title" --after 1,2`, or a `Depends:` line under each `# Task N`).
     Refuse unknown ids, self-edges and cycles at queue time (OMA `runFromPlan` "throws rather than run a broken plan"; Mastra
     validates references and per-edge compatibility before persisting, errors carry a path such as `graph.2.steps.0`). Derive
     `board ready` = hard deps done and merged, soft deps' interface decided, not yet dispatched, capped by `workers=`; show it in
     `attention`, print real waves in `board plan` (today a static label, `:2328`), and flag "ready 12 min, never dispatched" and
     "dispatched before hard dep landed" in `check`.
   - Stale-on-change: dispatch journals the brief's content hash (`git hash-object`, which review gates already use for verdicts,
     `shared-review-gates.md` "A verdict binds the brief it judged"); `check` flags a brief edited after dispatch and a
     `board decide … --task N` touching done dependents, so a replan lists what rests on the old design instead of the controller
     remembering (`shared-replan.md` Apply 1). This is the "first changed prompt and everything after re-runs" resume of Devin/CC/
     Active Graph in ledger form.
   - Boundary: edge discovery stays judgment (the fake-edge test); the board only stores, validates and computes.

2. **Quarantine: readers of untrusted content hold read-only tools and hand actors only a schema-bound summary; relayed prompts
   cannot raise privilege** — from Anthropic's dynamic-workflows post (triage section, Fig G) · the 14-steps article §13 · CC docs
   (the `ultracode` keyword is ignored from `-p`, scheduled tasks, webhook payloads and PR comments since v2.1.210) · value M-H ·
   effort S · lands in `shared-safety-rails.md` "Data hygiene", `strategy-loop.md` "Roles at scale", `triage.md` (`ops`, `research`
   rows), `prompt-researcher.md`, optionally a `brief-check` line for reader roles · why: the research play already has the shape
   (lanes are told read-only, the synthesizer reads lane files instead of raw pages: `prompt-researcher.md:23`,
   `shared-research.md:23`) but holds it by instruction, not by tool grant; the `ops`/triage loops have no reader/actor split at all
   (`strategy-loop.md` "Roles at scale" has the orchestrator read the queue and hand the executor the item), and the only defence
   is "treat it as data" (`shared-safety-rails.md:84-91`, `prompt-researcher.md:119`) while these runs go unattended on open input.
   - Rule text: reader lanes run in the host's read-only mode where it exists (the primitive reviewer lanes already use,
     `shared-review-gates.md` Output review) and carry no send/post/deploy skill; they return a schema (ids, class, dedupe key, a
     ≤200-char gist, capped quotes); the actor receives ids plus that summary and re-fetches under its own grant; a prompt that
     arrives by schedule, webhook or comment never widens fan-out, budget or permissions.

3. **Budgets that bind: tokens, cycles, USD and minutes checked, refused at dispatch, exhaustion recorded as an event** — from
   Active Graph (`runtime/budget.py`, 8 limits, graceful stop with `runtime.budget_exhausted` naming the dimension) · Claude Code
   (`budget` is a hard ceiling, `agent()` throws at the total) · OMA (consensus stops issuing judge calls at the cap) · Looper
   (anti-pattern: "a budget cap in prose but not in `loop_control`") · synapse-ai (`max_total_cost_usd`, `timeout_minutes`) ·
   value M · effort S · lands in `scripts/board` (`check`, `dispatch`, flight-plan `budget` line), `SKILL.md` grammar,
   `shared-safety-rails.md` "Loops & budgets" · why: the grammar says `budget=<cycles|agents|tokens>`; the rails add `$`; the board
   only flags an `agents` overrun (`scripts/board:3084-3086`), tokens and cycles are display-only (`:1834-1839`), `$` and wall-clock do
   not exist although cost receipts are journaled (`Stint.cost`, `:1205`), and `dispatch` never refuses.
   - Shape: `budget=` accepts tokens, cycles, agents, usd, minutes; each is a `check` finding; `board dispatch` refuses past a cap
     unless `--over "reason"` (journaled); the flight plan prints the caps it will enforce.

4. **Loop-contract lint plus the /goal evaluator rule** — from Looper (control, goal, verification rubrics; compile + lint) ·
   `/goal` docs · Avi Chawla's 9-section template · value M · effort S (doc) + S-M (script) · lands in `strategy-loop.md`,
   a new `scripts/loop-check` beside `brief-check`, `scripts/check-sync` · why: we lint briefs but not the loop contract that
   decides whether an unattended run burns money, and `strategy-loop.md:59` misdescribes the evaluator.
   - Fix now: `:59` says the evaluator "re-checks each stop attempt". Per the docs it receives the condition plus the conversation,
     calls no tools, and can only judge what the worker already printed, with a third verdict `impossible` we do not name. Write the
     Goal contract's validation step so the check's raw exit/output lands in the transcript, name `impossible` as an exit (maps to
     `board blocked`/`escalate`), and cite the "no tool use for several turns" stop.
   - `loop-check` (bash, like `brief-check`): numeric cycle cap · kill-switch path · a machine budget cap · both a success stop and a
     no-progress stop with a window · a validation command that resolves and is exit-code based · a named judge from another family
     when a gate must block · a side-effect rule (approval plus duplicate-action check, since loops restart) · the reward-hacking
     clause · the ship-alone-versus-ask line · flag "stop conditions that need subjective self-satisfaction".
   - Optional: a cycle-level stall signal over verifier output (the same failing `board exec` log digest N cycles running).

5. **A portable fan-out driver for hosts without a Workflow tool (`board fanout`)** — from Devin DW · Claude Code DW · acpx ·
   OMA · value H on non-Claude hosts and headless/CI, L on Claude Code · effort M (slice 1) to L (slice 2) · lands in
   `scripts/board` (or a sibling script), `strategy-workflow.md` "Host availability", `shared-hosts.md:69,104` · why: the workflow
   strategy tells every other host to write its own driver and points at `gpt-workflow`, whose code is unlicensed and unusable
   (`strategy-workflow.md:23-30`), so the biggest idea in this lane exists for one host only.
   - Slice 1 (M): items × brief template → N todo cards plus N gated `board launch` lanes with a sliding concurrency window built from
     existing `--after` edges (lane i+K waits on lane i), `--owns` per item, and a fan-in count guard that refuses a partial aggregate
     unless `--allow-partial` logs the dropped list. No scheduler of its own.
   - Slice 2 (L): per-item JSON result validated against a small schema with up to K re-asks in the same session, and resume keyed by
     brief hash (skip lanes whose hash and result exist).
   - Risk: scope creep toward a runtime; Looper's own spec draws the line ("scaffold, don't run").

6. **Name the two missing plays, tournament and generate-and-filter; tighten `strategy-workflow.md` against three docs** — from the
   Anthropic post · Sid Bidasaria's thread · `workflow-authoring` reference · Devin docs · value M-L · effort S · lands in
   `strategy-adversarial.md` variants, `shared-review-gates.md` (judge hygiene), `triage.md` Step 3, `strategy-workflow.md` · why:
   ranking at scale and best-of-N taste work have no play, and our only comparator is an absolute verdict.
   - Tournament: a match is a fresh judge that sees two artifacts and a rubric, never their authors; the bracket lives in the journal
     (a `match` vote kind with an `a|b` verdict), not in context, so 100+ items rank without any one context holding them; a second
     pass with sides swapped (my addition, standard judge hygiene, not in the sources) cancels order bias. Anthropic says comparative
     judgment is "more reliable than absolute scoring"; that is a vendor assertion with no measurement.
   - Generate-and-filter: N candidates, dedupe in code, rubric filter, survivors only; today only the "judge panel" variant
     (`strategy-adversarial.md:45`) approximates it.
   - Workflow-doc fixes: (a) widen "no clocks, no randomness" (`strategy-workflow.md:66-71`) to environment, filesystem, network and
     generated ids, which belong inside an `agent()` call (Devin docs); (b) add the Claude Code caveat that a failed or individually
     stopped agent re-runs every later-started agent, completed ones included; (c) loop-until-dry must dedupe against everything
     seen, not only confirmed, or rejected findings reappear and it never converges (`workflow-authoring`); (d) a verifier that cannot
     run is "unverified", never counted as refuted or confirmed (`/deep-research` behavior); (e) add `workflowSizeGuideline`
     (small <5, medium <10 default, large <50 agents) and note that ultracode suppresses the large-workflow warning, so the flight plan
     must still print the budget (rule 9 already says so); (f) re-verify `:83` "Subagents run acceptEdits regardless of session mode"
     against the sub-agents page, which says a subagent inherits the main conversation's permission mode unless one is set.

### The six patterns against orchestrate

| Pattern | Status | Compared against |
|---|---|---|
| classify-and-act | have at task level; absent per item and as a classifier that picks the model | `triage.md` Steps 0-3; static scale-gating `:105` |
| fan-out-and-synthesize | have | `strategy-parallel.md`, `strategy-hierarchical.md`, `strategy-workflow.md`, `shared-research.md` synthesizer |
| adversarial verification | have | `shared-review-gates.md` Panels, `review=consensus:N`, workflow discipline 4 |
| generate-and-filter | partial | judge-panel variant, `strategy-adversarial.md:45` |
| tournament | missing | no hit anywhere |
| loop-until-done | have | `strategy-loop.md`; workflow dry-round counter (discipline 2) |

## Tools

### Claude Code dynamic workflows (with the six patterns, Sid Bidasaria's tips, the PM guide, the 14-steps article)
- Links: `code.claude.com/docs/en/workflows`; `claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code`
  (2026-06-02, Shihipar and Bidasaria); `x.com/sidbid/status/2060047508806746142` (2,438 likes, 2,692 bookmarks); research preview since
  2026-05-28; closed source.
- Evidence: docs — workflows page read in full, the blog, the bundled `workflow-authoring` reference, `/goal` page, sub-agents
  permission section. No code (closed); no workflow was run.
- Mechanism: the plan is a JS file the runtime executes in an isolated environment (no `import`, no filesystem or shell): a literal
  `meta`, `agent(prompt, {schema, model, effort, isolation, agentType, label, stallMs})`, `pipeline()` (no barrier), `parallel()`
  (barrier), `phase/log/args/budget`, one-level nested `workflow()`. Validation: a schema that contradicts itself fails before the
  subagent starts; output is re-asked up to 5 times; `Date.now/Math.random/new Date()` throw so a replay repeats the same calls.
  Judgment sits in agents, loops/routing/intermediates in script variables (Claude's context holds only the final answer); named
  failure modes are laziness, self-preferential bias, goal drift. Resume: replay in start order, completed calls return saved results,
  the first differing prompt and everything after re-runs, a failed or individually stopped agent re-runs every later-started agent,
  same session only (carried into background and cloud sessions). Stalled agents restart up to 5 times; a usage limit pauses the run
  (max two waits, interactive subscription sessions only); a skipped or dead agent is `null`. Limits: 16 concurrent (1–256), 4,096
  items per call, 1,000 agents per run; "Large workflow" advisory above 25 agents or 1.5M projected tokens; size guideline default
  `medium`. First-agent cache-prefix stagger (5 s). `/workflows` drill-down shows prompt, tool calls, result and tokens per agent.
  Saved to `.claude/workflows/`, `~/.claude/workflows/`, a plugin, or shipped in a skill (treat as a template).
- Versus orchestrate: **have**, and accurate against the docs — `strategy-workflow.md` matches 16/1,000, 25/1.5M, the `budget` API,
  pipeline-over-barrier, fan-in guard, replay rules. **Missing**: tournament, generate-and-filter, quarantine (candidates 2, 6);
  the failed-agent-reruns-siblings caveat; CC-only (`shared-hosts.md:69,104`). Orchestrate is ahead on cross-session resume (CC is
  same-session), host coverage, spec-then-quality gates, priced flight plan, hash-chained record.
- Adopt: candidates 6, 2 and 3 (the `budget` ceiling).

### Devin Dynamic Workflows (announced 2026-10-13)
- Links: `docs.devin.ai/work-with-devin/dynamic-workflows`; `x.com/devindevelopers/status/2109887510184964285` (210 likes, 82
  bookmarks). Factory's same-day launch (Environments) is a sandbox product, not orchestration.
- Evidence: docs — page read in full. No code (closed).
- Mechanism: deterministic Python — `register_workflow(meta)`, `agent(prompt, phase, schema, label)`, `pipeline`, `parallel`, `log`.
  Each agent is a full Devin session on its own VM (code handed off by pushing a branch and returning its name in the structured
  result) or pinned to the orchestrator's VM (parallel writers must own disjoint files); a cheaper Devin mode can be pinned per stage.
  Every call is recorded under a run ID, keyed by hash(prompt, schema, execution settings); resume re-executes the script from the top
  and completed calls replay. The determinism rule: no current time/date, randomness, generated ids, environment variables,
  filesystem state or network responses; anything that inspects the outside world goes inside an `agent()` call whose recorded output
  the script consumes. A failed agent's fate is the script's call (skip, default, retry, fail); a resumed run retries failed agents in
  new sessions; runs resume up to 7 days later; approval is auto by default.
- Versus orchestrate: **partial**. Converges with CC; the widened determinism rule is missing (`strategy-workflow.md:66-71`), and
  content-hash replay plus run ids are the model for candidate 1's brief hash. Branch handoff matches `shared-isolation.md`.
- Adopt: candidate 6(a); candidate 1.

### open-multi-agent (OMA) — `open-multi-agent/open-multi-agent`, 6,996 stars, MIT, pushed 2026-10-11
- Links: `x.com/ivanburazin/status/2040112100597506107` (3,445 likes, 5,979 bookmarks); docs in the repo `docs/`. Earlier look:
  `docs/designs/v1.16.0-checks-lanes.md` §5 (2026-09-16) took only the "governance floor". Since then nothing new in kind: the docs
  for plan artifacts (first commit 2026-07-01), adaptive recovery (07-26), durable approvals (08-07) and the run journal (08-28) all
  predate that look, so the mechanisms below are seen-but-unadopted, not new.
- Evidence: docs — run-journal, plan-replay, adaptive-recovery, consensus, task-scheduling, durable-approvals read; repo-read of
  `packages/core/src/journal/verify.ts` and `hash.ts`.
- Mechanism: a coordinator decomposes a goal into a task DAG; an event-driven scheduler runs the ready set through a pool semaphore
  and a dispatch gate (cancel, budget, approval, capacity). **Plan artifact**: `planOnly` → JSON → hand-edit → `runFromPlan`, DAG
  validated for unknown ids and cycles first ("pin the graph, not the answer"). **Adaptive recovery**: a `Replanner` returns a
  `PlanPatch` (addTasks, retargetPending, supersedePending, by id not title) at an outcome barrier — validated, optionally approved,
  applied atomically and checkpointed before the triggering task releases its dependents; limits reject a patch, never truncate it;
  history stays truthful (`recoveredByRevision`, `supersededByRevision`). **Consensus**: proposer(s) then judges who refute, `quorum`,
  `maxRounds`, `onDissent` revise|reject|keep; judges run sequentially so quorum or budget can stop the rest; the coordinator's JSON
  may set mode/quorum/rounds but never the judge roster or prompts. Typed retry classes (validation, cancel, budget terminal; rate
  limit, 5xx, network, timeout retryable) with one in-run schema correction. Structured dependency payloads never silently fall back
  to raw text. **Durable approvals**: suspend, decide by `requestId` plus the hash of the content reviewed, restore; first decision
  wins; a stale hash is rejected; integrity across checkpoint and ledger, explicitly not a signature against the storage admin.
  **Run journal** (opt-in): lineage `sourceEventSeqs` for every model-visible block and an offline `verifyRun()` with verdicts failure
  / inconclusive / ok (`verify.ts`: sequence monotonicity and lineage reproducibility; `hash.ts`: canonical content hashes, no
  prev/hash chain).
- Versus orchestrate: closest cousin. **Have**: governance floor and `board check --replay` with `inconclusive`; quorum votes
  (`scripts/board:858`); approvals bound to what was reviewed (brief hash in `shared-review-gates.md`; plan back to pending when a
  dimension re-resolves); bounded replan (`shared-replan.md` `REDESIGN_CAP`). **Stronger in orchestrate**: a prev/hash chain over the
  whole stream, cross-session handoff, an architect pass for design conflicts. **Missing**: a validated plan graph (candidate 1);
  plan patches as an append-only operation set with a `superseded` state (our `board todo` only adds); early-exit panels (ours
  dispatch all N); typed retry classes.
- Adopt: candidate 1. Small: panel `escalating` mode (two judges, a third only on a split) and a `superseded` task state on replan,
  both S.

### acpx flows — `openclaw/acpx`, 3,339 stars, MIT, pushed 2026-10-13
- Links: `x.com/onusoz/status/2038565725690900992` (1,146 likes, 1,841 bookmarks); `docs/flows.md`,
  `docs/2026-03-25-acpx-flows-architecture.md`, `docs/2026-03-26-acpx-flow-trace-replay.md`,
  `docs/2026-03-28-acpx-flow-permission-requirements.md`, `examples/flows/pr-triage/{README,TUNING}.md`, `docs/compare.md`.
- Evidence: docs — repo docs read in full or large part; no source file read. The permission doc calls itself a design target, not
  fully enforced.
- Mechanism: a TS module `defineFlow({name, startAt, nodes, edges})`; topology is plain data, node-local callbacks are code, "the
  worker is not the workflow engine". Node kinds: `acp` (model turn), `action` (runtime-owned shell/HTTP), `compute` (pure),
  `decision` (constrained-choice branch with typed `decisionEdge` routing), `checkpoint` (pause for a human or external trigger). The
  runtime owns order, retries, timeouts (15 min per active step by default, abort signal, no new launches after cancel, process-group
  cleanup) and persistence. A run bundle holds `manifest.json`, `flow.json` (the resolved graph), an append-only `trace.ndjson` as
  truth, derived projections, per-session event logs and content-addressed `sha256-…` artifacts; immutable once terminal; a replay
  viewer scrubs it. On reconnect a persistent session must load the same backend session and a failed load fails the step — never a
  silent fresh session. A flow declares a required permission grant and fails before step 1 without it. `acpx compare a b c 'prompt'`
  runs one prompt across agents and tabulates status and wall time; `--prompt-retries` retries only before any side effect is
  observed. `TUNING.md` logs each tuning change with its reason and "what we decided not to do".
- Versus orchestrate: **partial**. Have: journal as truth with derived views, resume by session id, never respawn blind
  (`shared-safety-rails.md`), `board reap`. Missing: declared permission needs checked before the first dispatch — the flight plan
  prints topology, models, gates and budget but no "workers will need write paths, push, network, these commands" row
  (`shared-flight-plan.md`; Task 0 only smoke-verifies tooling); a deterministic node class between "agent" and "board command".
  The "priming" case for same-session prompt sequences is the author's unmeasured claim; ours deliberately uses fresh reviewers.
- Adopt: a `needs:` row in the flight plan plus a preflight canary (S; value L-M). acpx as an xcli driver belongs to lane D.

### Mastra dynamic workflows (2026-08-12, beta)
- Links: `mastra.ai/docs/workflows/dynamic-workflows`, `mastra.ai/reference/workflows/dynamic-workflow-definition`; `mastra-ai/mastra`
  28,786 stars, pushed 2026-10-13; `x.com/calcsam/status/2087576557229593033` (260 likes, 262 bookmarks).
- Evidence: docs — guide and definition reference read in full. No code.
- Mechanism: a workflow is a JSON `DynamicWorkflowGraph` (JSON-Schema in/out/state; ordered entries agent, classifier, tool, mapping,
  workflow, parallel, conditional, foreach, loop, sleep, sleepUntil; predicates are a JSON DSL, no closures). `addDynamicWorkflow()`
  validates before touching storage or the registry: structure (placement rules), references (agent/workflow/tool ids resolve to the
  registry or the same bundle), schema flow (each entry's input compatible with the previous output). Bundles validate atomically
  ("if validation fails, none registered") and register in dependency order; definitions persist and restore on startup; replacing an id
  affects new runs only; separate read/write/execute scopes. A `classifier` entry returns typed answers (choice, score, probability)
  that `conditional` entries route on.
- Versus orchestrate: **missing** a machine-validated plan format (ours is prose plus `# Task N` headings plus `brief-check`). The
  validator rules are the transferable part, not the DSL: orchestrate's plan is coordinated, not executed.
- Adopt: the rules (references resolve, no cycles, per-edge contract, errors with a path, all-or-nothing bundle) inside candidate 1.

### Active Graph — `yoheinakajima/activegraph`, 706 stars, Apache-2.0, pushed 2026-09-26
- Links: `docs.activegraph.ai`; arXiv 2605.21997 "The Log is the Agent", 2606.10241 "Regimes"; `x.com/yoheinakajima/status/2057099245430222926`
  (543 likes, 612 bookmarks); the author calls it "an early experiment".
- Evidence: repo-read (`runtime/diff.py`, `llm/cache.py`, `runtime/budget.py`) plus docs (`concepts/forking`, `replay`,
  `failure-model`, `guides/fork-test-promote`); arXiv abstracts only.
- Mechanism: an append-only event log is truth, the graph is a projection, behaviors react to graph patterns. **Fork** = a new run
  sharing the parent's log up to an inclusive event; the prefix replays from a cache keyed by LLM prompt hash and tool+args hash so no
  model call re-runs; strict replay raises `ReplayDivergenceError` pinned to the first divergent event; `--set` records a setting
  override as an event; `diff` is structural only ("semantic comparison is a behavior's job"). **Promote** = a three-way merge back
  (base at fork point, parent now, fork now), the whole promote fails on any both-sides change, audited by a `promote.applied` marker.
  Failures and budget exhaustion are events with reason codes. "Regimes": a repair is promoted only after static checks, sandbox,
  in-sample and held-out evaluation (five held-out splits, +0.05 to +0.10 in four, +0.01 in one the author calls over-promotion;
  single-author preprint).
- Versus orchestrate: same instinct as the journal (events are truth, views derived, `board check --replay`, chain). Fork-and-diff is
  **missing** and not portable: it works because behaviors are deterministic functions of the log, while our controller is an LLM, so
  there is no free prefix replay beyond the ledger (done tasks are not redone).
- Adopt: no fork/diff (value L, effort L). Take budget-exhaustion-as-event (candidate 3).

### Looper — `ksimback/looper`, 711 stars, MIT, v0.4 spec, pushed 2026-08-09 (adjacent: `cobusgreyling/loop-engineering`, 11,520 stars)
- Links: `x.com/KSimback/status/2067874418232119347`; repo `looper-spec.md`, `references/{control,goal,verification,council}-rubric.md`,
  `RUNNER-CONTRACT.md`, `schemas/loop.v1.schema.json`, `scripts/looper.py`, `conformance/check_runner.py`. loop-engineering adds a
  `loop doctor` readiness score and autonomy levels (README only).
- Evidence: repo-read — README, spec, four rubrics; `looper.py` not run.
- Mechanism: a design layer. Interview and critique against rubrics produce a schema-validated `loop.yaml`, compiled to
  `loop.resolved.json`, then `RUN_IN_SESSION.md` and a thin `run-loop.py`. Verification is typed (`programmatic` argv + expect,
  `judge` rubric + JSON verdict, `human`). Gates carry a `verdict_source`: a gate that must block needs a judge or a human, and a
  reviewer-only gate "cannot honestly claim clean". `loop_control` holds max iterations, per-gate revision caps, `no_progress`
  (stalled iterations; signals: same blocker repeats, artifact unchanged, verifier output unchanged), wall-clock/token/USD budgets,
  human checkpoints, and an execution boundary (where files may change; side effects need approval and a duplicate-action check because
  loops restart). The control rubric lists anti-patterns such as "a judge gate with no judge" and "stop conditions that require
  subjective self-satisfaction". Scope is stated honestly: not a durable orchestration engine.
- Versus orchestrate: **mostly have** — `strategy-loop.md` carries qualify-first, contract file, rails, measured-target variant,
  Outcome Floor, evolve pass, earned autonomy, and worker-level stall signals live in `shared-monitoring.md` (Trajectory stalls).
  **Missing**: a deterministic lint of the contract (we lint briefs, not loops), a typed verification block, the duplicate-action
  check, a cycle-level stall signal over verifier output.
- Adopt: candidate 4.

### /goal anatomy (Avi Chawla's post plus the official docs)
- Links: `x.com/_avichawla/status/2055930732930122158` (251 likes, 324 bookmarks); `code.claude.com/docs/en/goal`.
- Evidence: docs — read in full. The 9-section template (GOAL, CONTEXT, CONSTRAINTS, PRIORITY, PLAN, DONE WHEN, VERIFY, OUTPUT, STOP
  RULES) is a community artifact by the post's own account: post-only.
- Mechanism: `/goal` wraps a session-scoped prompt-based Stop hook. After each turn a small fast model gets the condition and the
  conversation and returns not-yet, met or **impossible**; it calls no tools, so the condition must be something the worker's own
  output demonstrates ("`npm test` exits 0" works because the run lands in the transcript). Up to 4,000 characters; a turn or time
  clause goes inside the condition; several turns without tool use stop the loop and return control; running background work defers
  evaluation (check-ins at 30 min, then doubling up to 4×); errors you must fix (auth, credit, context overflow, model unavailable)
  clear the goal, transient ones retry 3× then pause. `ANTHROPIC_DEFAULT_HAIKU_MODEL` changes the evaluator and also re-points the
  `haiku` alias.
- Versus orchestrate: **partial, with one inaccuracy** (`strategy-loop.md:59`, see candidate 4); the goal contract (`:64-66`) has a
  validation command but not "its raw output must land in the transcript". The template's VERIFY and STOP RULES fields restate our
  contract.
- Adopt: candidate 4.

### Tardigrade — `clavia-labs/tardigrade`, 394 stars, MIT, created 2026-08-13, pushed 2026-10-13
- Links: `x.com/arjunkmrm/status/2095544229384925612` (618 likes, 947 bookmarks).
- Evidence: docs — README, Why, Comparisons, Verifying behavior, `trace-review.md`; code and the TLA+/Quint files unread.
- Mechanism: a single-agent harness built as components (Moore machines) folded over an immutable event log on Effect-TS:
  `{view, effects} = f(log)`. Effects are proposed and their results recorded as events; compaction is a derived view, never a deletion
  (the budget still counts calls that left the model's window); safety rules are projections checked against generated trajectories;
  hosts as Durable Objects. `trace-review.md` is an unshipped design note for a reviewer agent that turns traces into a failure-mode
  catalog and asks an expert only where an answer resolves uncertainty.
- Versus orchestrate: the same architecture at the single-agent level (journal is truth, views derived, `board resume` with
  `NOT_PROVEN`); nothing for a coordination skill. Its "trace-level detection is not a catalog change" split matches `board postmortem`
  being recommend-only.
- Adopt: no.

### eve (Vercel) workflow tools and `/traces` — `vercel/eve`, 5,548 stars, Apache-2.0
- Links: `x.com/eve/status/2102427873923707350` (251 likes, 156 bookmarks), `x.com/eve/status/2083301026296201499`; docs shipped in the
  npm package (`docs/tools/workflows.mdx`, `docs/guides/dev-tui.md`, `docs/guides/instrumentation/agent-runs.mdx`).
- Evidence: docs — package docs v0.78.0 and the 0.27.1 dynamic-workflows guide. No code.
- Mechanism: (1) `defineWorkflowTool`, a developer-written durable function whose `"use workflow"` body replays deterministically
  (side effects, clocks, env only inside `"use step"`), waits on hooks, webhooks or timers without holding compute, and asks humans via
  `ctx.ask`. (2) a model-authored `Workflow` tool: JS in a QuickJS sandbox with an allowlist (only `tools.<agent>` bridges), counted as
  one durable step, a `maxSubagents` budget (default 100; over-budget calls return a `WORKFLOW_SUBAGENT_LIMIT_REACHED` result instead
  of failing the run), root-only so children cannot recurse. `/traces` is the local trace viewer in `eve dev`; Agent Runs is Vercel's
  paid beta over OpenTelemetry.
- Versus orchestrate: durability needs the hosted Workflow SDK, so it is not portable. The transferable parts are already in
  `strategy-workflow.md` (deterministic body, budget guard) and `strategy-hierarchical.md` (depth). Trace viewing is covered by `board`
  plus the host's own viewer (`grok trace`, `claude --resume`).
- Adopt: no.

## Not worth adopting (one line each, why)
- **Google AX** (`google/ax`, 13,507 stars, Apache-2.0): a Kubernetes control plane for sandboxed agent Tasks (Task/Workspace/Model,
  suspend/resume, `ax ssh`) on Agent Substrate; infrastructure a skill cannot host, its docs say it deliberately does not model
  plan/delegate/fan-out, and stateful task branching is roadmap only. docs-graded.
- **synapse-ai** (`synapseorch-ai/synapse-ai`, 327 stars, AGPL-3.0): a no-code step-graph builder (agent, evaluator, parallel, loop,
  human steps; per-step `max_turns` and timeout; JSONL run journal that keeps only structural events after 20,000); evaluator routes as
  tools equal acpx's `decision`, and the licence rules out borrowing code. repo-read (data model, journal).
- **TinyAGI/fractals** (646 stars, MIT, last push 2026-03-06): classify atomic/composite then decompose into 2–7 subtasks ("when in doubt
  choose atomic"), lineage in the prompt, then `claude --dangerously-skip-permissions` per leaf; `triage.md:89` already says a one-task
  domain is not worth a lead and `shared-safety-rails.md:23` forbids `--dangerously-*`. repo-read (`llm.ts`).
- **ROMA** (`sentient-agi/ROMA`, 5,182 stars, last push 2026-02-16): atomizer, planner, executor, aggregator with a depth cap and forced
  execution at max depth (DSPy, checkpoints, MLflow); covered by `strategy-hierarchical.md` (depth reality) and `triage.md` Step 0, and
  stale for eight months. repo-read (`solve.py` header).
- **Loop→Graph article (Kirill)**: the fetched article is a GraphRAG / Neo4j / Kimi K3 tutorial about knowledge graphs, not agent
  orchestration; its tweet's claims (nodes/edges/state/policy, diamond/supervisor/pipeline, Anthropic's five workflow patterns,
  "determinism via verifiers, code fallbacks, reality anchors") are post-only and map onto what we already name (Aug-sweep TL;DR 2,
  `triage.md:112-115`, Anchors in `shared-review-gates.md:76-84`). Delta versus the Aug sweep: none worth a change; "code fallback" is
  Devin's "the script decides: skip, default, retry, fail".
- **Boris "I write loops"**: the X article behind that post (`x/boris-loops.md`) is not by Boris but a secondary 14-step guide that
  restates the Anthropic post (adds the barrier-versus-pipeline rule, quarantine, a mistakes list; no new mechanism, covered above).
  Boris's own interview was not located; the findable video is a third-party Chinese commentary (9 min) — under-staff on purpose and
  give unlimited tokens, roles merge into "builder" — philosophy, no mechanism.
- **Pawel Huryn's PM guide** ("113 agents, 1.95M tokens, 12.5 minutes; the coordinating JavaScript spent zero tokens"): one self-reported
  run; the extract → canonicalize → score-in-code → generate/triage → build → inspect-and-rerun flow is a good worked example for
  `strategy-workflow.md` but adds no mechanism.

## Gaps (what you could not verify, and why)
- The article behind Kirill's tweet (`x.com/i/article/2087202421952950273`) was not fetched: X articles are unsupported by firecrawl and
  `xrelay` is lane A only. `x/kirillk-loop-to-graph.md` holds the quoted GraphRAG article instead, so the tweet's agent-graph claims are
  post-only.
- Boris Cherny's original interview was not located; only a third-party commentary transcript (`ytrelay`, video `eq9WJxErzaY`).
- No Claude Code or Devin workflow was run (read-only rule): resume, stall-restart, usage-limit pause and the permission-mode claim
  (`strategy-workflow.md:83` against the sub-agents page) are docs-graded, and the two conflict on wording.
- Devin: docs only; no pricing beyond "far more ACUs", no limits other than the 7-day run budget, live product unseen.
- Mastra: docs only, beta, no code; stored-workflow RBAC not tested.
- acpx: spec and example docs; `src/flows` unread; the permission doc says not every part is enforced yet.
- OMA: six docs and two source files; `checkpoint.md`, `budgets-and-limits.md`, journal backends and the scheduler source only skimmed or
  unread; the "verifiable offline, byte for byte" README claim is covered only for lineage (`verify.ts`).
- Active Graph: arXiv abstracts only; no independent measurement of fork cost; docs say fork needs a SQLite store.
- Tardigrade: code and TLA+/Quint specs unread; AX: `DESIGN.md` and Agent Substrate unread; eve: `execution-model-and-durability.mdx`
  downloaded, not read in depth; ROMA: GEPA prompt-optimization pipeline unevaluated.
- No source offers a controlled measurement of token, cost or quality effects. Pawel's run is self-reported; "comparative judgment is
  more reliable than absolute scoring" is an assertion; the 9-section `/goal` template's provenance is a community post.
- "Missing" greps covered `skills/`, `docs/*.md`, `site/`, `README.md`, `CHANGELOG.md`, `AGENTS.md`, `CONTRIBUTING.md`; `docs/designs/`
  and `docs/research/` were searched for tournament only (Aug X sweep) and for OMA/ROMA names.
