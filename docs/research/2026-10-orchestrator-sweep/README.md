# Orchestrator sweep — the user's X bookmarks, October 2026 — research record

> **Status:** research-only — nothing here has been adopted into `orchestrate` v1.31.0 (main @ `2761fc5`).
> Research date: 2026-10-13.

*Method: the user's X bookmark cache (`xrelay`), first repaired — its incremental sync had stopped at a
recently bookmarked old post and was missing 2,045 bookmarks from June to October (6,941 after the repair).
A keyword filter kept 451 orchestration posts (263 since June 2026); about 130 tools and posts went into six
lanes. Six Sonnet researcher lanes read the repos (`ghrelay` skim/read, `gh api`) and docs (WebFetch,
firecrawl), graded every claim **repo-read** · **docs** · **post-only**, and compared each against
`SKILL.md`, the references and `scripts/board`. Lane A alone used `xrelay` (5 read calls). The controller
re-checked every load-bearing "orchestrate lacks X" claim against the code before ranking it; the
`file:line` citations below are from that check. Raw lane reports: [`lanes/`](lanes/).*

**Question:** what do other orchestration tools do better, more innovatively, or that `orchestrate` does
not do at all — and which of those are worth adopting?

---

## TL;DR

1. **The cohort enforces what `orchestrate` only states.** The strongest pattern across lanes is not a new
   idea but a missing mechanism: rules the skill writes in prose that the board never checks. Budgets
   (`budget=` is parsed, but only an `agents` overrun is ever flagged, after the fact —
   `scripts/board:3084-3086`), readiness (universal rule 12 "dispatch on readiness", but `Task` has no
   dependency field — `scripts/board:482-500`), worktree removal ("Removal is mandatory",
   `shared-isolation.md:45`, but nothing checks it — worktrees are only listed at handoff,
   `scripts/board:3537`), "never spawn a duplicate" (a re-dispatch just gets `-rN`, with no guard on an
   open stint for the same task — `scripts/board:883-887`), `--owns` (stored and displayed, never compared
   with what the lane wrote — `scripts/board:584`), read-only lanes (instruction only), and the loop's
   protected Goal (prose only). Paperclip, open-multi-agent, herdr-projects, Orca and Warp's `oz-for-oss`
   each make one of these mechanical.
2. **They are ahead at the end of a run and on the unhappy path.** Worktree cleanup with a proof predicate
   (four tools converged on the same rules), PR/CI awareness, knowing an engine's quota before dispatching
   to it and continuing on another engine when it blocks, nudges that know whether they landed, review
   rounds that converge (continue the fixer, re-review only the fix, let a wrong finding be disputed, refuse
   votes from seats that read nothing), structured human decisions, and a push notification when a person is
   needed. `orchestrate` is strong while work is flowing and thin when it stops.
3. **Unattended loops need fences.** The loop's evolve pass edits the loop contract in place with no
   snapshot, prediction, revert or size cap; the contract itself is never linted; a prompt arriving by
   schedule or webhook goes to an actor that holds write tools. HarnessX, Agentic Harness Engineering,
   Looper, Auto-Company and Anthropic's dynamic-workflows post supply the fences.
4. **Verification should prove, not assert.** Red-first fixing (a check that has never failed proves
   nothing), a per-repo verify recipe with a model-free Doctor precheck, and isolation for concurrent
   verifiers — v1.31.0 made concurrency the default, but nothing isolates two verifiers driving one app.
5. **The reference host moved.** Claude Code's Agent tool has a fork mode (`subagent_type: "fork"`, on by
   default in interactive sessions since 2.1.232) that inherits the parent's model and ignores `model` and
   `effort` — a fork for a pinned role silently breaks rule 1 — and spawns run in the background. No
   reference mentions it.
6. **Where `orchestrate` is already ahead — keep it.** The hash-chained, append-only journal with derived
   views (Agent Orchestrator and Plannotator reach "state is derived, never stored" too; open-multi-agent
   has lineage but no hash chain); ordered spec → quality gates with cross-lineage reviewers; the priced
   flight plan with model and effort per agent (Warp's `/orchestrate` approval gate has neither); the dated,
   graded model catalog and posture dial; host portability with honest degradation (almost every tool here
   is one app or one host); DESIGN_CONFLICT → architect; cross-session resume (Claude Code's dynamic
   workflows resume only in the same session). No tool in the cohort has a verified stall detector better
   than the artifact-delta rule (Traycer ships an `agent.stalled` event whose rule is closed source).

---

## Adoption candidates — ranked

| # | Candidate | From | Value | Effort | Lands in |
|---|---|---|---|---|---|
| 1 | Budgets that bind, priced receipts | Paperclip, Auto-Company, QM, Active Graph, Cursor prompt | H | M | `scripts/board`, `shared-safety-rails.md`, flight plan, `shared-token-economy.md` |
| 2 | The plan graph as data | Devin and Claude Code dynamic workflows, open-multi-agent, Mastra, gstack, QM | H | M | `scripts/board`, `strategy-parallel.md`, `shared-replan.md`, `shared-review-gates.md` |
| 3 | Cleanup and duplicate guards | herdr-projects, Traycer, CompozyOS, Agent Orchestrator, Orca | H | S–M | `board sweep`, `check --finish`, `shared-isolation.md`, `dispatch` guard |
| 4 | Nudge and recovery discipline | Orca, Agent Orchestrator, Herdr, herdr-projects | M–H | S | `shared-monitoring.md`, `board attention` |
| 5 | Red-first fixing and a journaled baseline | Matt Pocock `diagnosing-bugs`, Apodex 1.1, OpenAI harness engineering, Symphony | H | S–M | new `shared-fix.md`, `triage.md`, `strategy-staged.md` |
| 6 | Per-repo verify recipe with Doctor and concurrent isolation | tester-army, AI-Builder-Club, Warp `verify-pr` | H | M | `shared-prepare.md`, `prompt-verifier.md`, `shared-isolation.md` |
| 7 | Quota awareness and `board handoff` | firstmate + quota-axi, Claude Octopus, Traycer, Agent Orchestrator, T3 Code v2 | H | S → M | `scripts/board`, `shared-lane-hygiene.md`, `shared-model-routing.md`, catalog |
| 8 | Fence the evolve pass, lint the loop | Agentic Harness Engineering, HarnessX, Prime Agent, Looper, Auto-Company | H (loops) | S–M | `prompt-evolve.md`, `strategy-loop.md`, `scripts/loop-check` |
| 9 | Quarantine readers of untrusted input | Anthropic dynamic-workflows post, Claude Code `ultracode` rules, firstmate | M–H | S | `shared-safety-rails.md`, `strategy-loop.md`, `prompt-researcher.md` |
| 10 | Review loops that converge | no-mistakes, `/lightning`, obra/superpowers, BHolmes `review-cycle`, Claude Octopus | M | S | `strategy-staged.md`, new `prompt-re-reviewer.md`, `board vote`, `shared-review-gates.md` |
| 11 | Claude Code fork mode and background spawns | Claude Code docs (≥ 2.1.232) | M | S | `engine-claude.md`, `shared-hosts.md`, routing rules 1 and 13 |
| 12 | Deterministic lane-boundary checks | Warp `oz-for-oss`, Impeccable | M | S–M | `board return`/`done`, `scripts/review-package` |
| 13 | Decision cards and push notifications | Plannotator Inbox, herdr-projects, Traycer | M | S | `board send --ask`, `board follow --exec`, report schema |
| 14 | Claim-sharded fact-check and citation lint | Apodex 1.1, Feynman | M–H | S–M | `prompt-verifier.md`, `shared-research.md`, `scripts/cite-check` |
| 15 | Lessons that survive the archive; path-scoped learnings | teamlore, Agent Memory Repo / Devin Dreaming, Hermes Curator, ECC | M–H | M | `KEEP_ON_ARCHIVE`, `board learn`, `docs/recipes.md` |
| 16 | Standing routing rules and a speed tier | firstmate, Devin Fusion, `/lightning` | M | S–M | `config.yaml`, `shared-model-routing.md`, catalog, flight plan |
| 17 | Tracker-intake loop recipe | OpenAI Symphony, Warp Factories, Paperclip | H (ops) | M | `strategy-loop.md`, `triage.md`, `docs/recipes.md` |
| 18 | PR/CI facts on the card, a bounded PR-shepherd loop | Agent Orchestrator, herdr-projects | M–H | M–L | `board pr`, `strategy-loop.md` recipe |

### 1. Budgets that bind, priced receipts — lanes B, C, F

**Gap (verified):** the grammar says `budget=<cycles|agents|tokens>` and `shared-safety-rails.md:37` says
"budget exhausted → stop", but `board check` compares only the agent count, after dispatch
(`scripts/board:3084-3086`); tokens and cycles are display-only; there is no USD or wall-clock cap, though
cost receipts are journaled. Receipts blur the price: a Claude receipt adds cache reads and writes into one
`tokens` figure (`scripts/board:3692`), a Codex receipt keeps input + output only (`:3685`), so
`board postmortem`'s "cost per accepted task" is raw tokens and the token economy's cache-hygiene saving
cannot be measured by the repo itself.

**Shape:** `budget=` accepts `usd`, `tokens`, `cycles`, `agents`, `minutes`, with `soft=` (default 80%);
`board dispatch` and `launch` refuse past a hard cap unless `--over "reason"` (journaled); a soft-cap
`check` finding; unknown usage is `unverifiable` and pauses rather than counting as zero (Auto-Company);
exhaustion is an event naming the dimension (Active Graph `runtime.budget_exhausted`); count lanes in
flight so a parallel wave cannot overshoot (Paperclip takes a reservation before dispatch: "Estimates
constrain admission; they cannot cap a provider's bill"). Receipts store the usage split (input / output /
cache read / cache write) plus the engine's `cost`; `postmortem` prints $ and minutes per accepted task and
the cache-read share; `board runs --stats` gives one row per registered run (release, kind, strategy,
posture, accepted/dispatched, first-attempt-clean, $/accepted, min/accepted) — the A/B the token economy's
"Honest numbers" section says is the only trustworthy measure. Subscription-included usage is reported but
not charged to a USD cap (Paperclip does the same).

### 2. The plan graph as data — lanes C, B

**Gap (verified):** `Task` has no edge field (`scripts/board:482-500`); `--after` exists only on a launched
lane; `brief-check` prints read↔write dependencies as hints and records nothing; `board check` infers
"mis-ordered" from task numbers, which `triage.md` itself says are not dependencies. Rule 12's "dispatch on
readiness" lives in the plan's prose and the controller's head — the place every engine in lane C moved the
plan *out of* ("the plan lives in code instead of an agent's head", Devin). A gate verdict records task,
kind, verdict, round, findings and agent (`scripts/board:4441-4442`), not the commit it judged.

**Shape:** edges at queue time (`board todo N "title" --after 1,2`, or a `Depends:` line under each
`# Task N`), refused on unknown ids, self-edges and cycles (open-multi-agent "throws rather than run a broken
plan"; Mastra validates references before persisting, errors carry a path). `board ready` = hard deps done
and merged, not yet dispatched, capped by `workers=`; `attention` shows "ready 12 min, never dispatched" and
"dispatched before its dependency landed"; `board plan` prints real waves. Dispatch journals the brief's
content hash, so `check` flags a brief edited after dispatch and a `board decide` that touches done
dependents (Devin and Claude Code re-run "the first changed prompt and everything after"; this is that rule
in ledger form). `board gate` and `vote` take `--at <sha>`; `done` refuses a verdict on an older commit than
the task's last return (gstack's `INPUT: <phase> <sha256>`, QM's per-lens CI check at the PR head). Edge
discovery stays judgment (the fake-edge test); the board only stores, validates and computes.

### 3. Cleanup and duplicate guards — lane A

**Gap (verified):** `shared-isolation.md:45` "Removal is mandatory", but `check --finish` refuses leftover
processes and open stints (`scripts/board:3101`), not leftover worktrees or branches. A second dispatch on
a task whose first stint is still open is accepted and named `-r2` (`scripts/board:883-887`); the cardinal
"never spawn a duplicate" is prose.

**Shape:** `board sweep [--dry-run|--yes]` classifies every journaled worktree and run-prefixed branch —
**Landed** (tip contained in the integration branch, or a merged PR at the tip) · **At base** (no commits,
clean) · **Not proven** (dirty, unpushed, detached, unreadable, inconclusive) · **In use** (open stint or
live pid, from reap's data) · **Shared** · **Orphaned** — and removes only Landed and At-base trees that are
idle and exclusive, never forcing a dirty one, re-checking just before removal, and deleting a branch only
when merged and its local tip equals the merged head. Four tools (herdr-projects `sweep.rs`, Traycer,
CompozyOS, Agent Orchestrator `cleanup.go`) converged on exactly this; Traycer's line is the rule: "Age alone
never makes a worktree safe to delete." `check --finish` gains a finding for unaccounted worktrees.
`dispatch`/`launch` refuse a second open stint for the same task and role until the first is returned or
reaped, and a superseded worker is told on its next board call to stop without a report (Orca
`consumer_fenced`).

### 4. Nudge and recovery discipline — lane A

**Gap (verified):** `attention` and `check` print "disk check, then ONE nudge" (`scripts/board:1483`,
`:3022`) whether or not the nudge already happened; no rule covers a lane parked on an approval dialog.

**Shape:** a table in `shared-monitoring.md` mapping proven state to permitted action (Orca: "Only positive
proof of exit authorizes stop, abandon, or retry … absence included, is a checkpoint"). Never nudge a lane
blocked on a permission or approval prompt — answer it or fail the lane (Agent Orchestrator: "Automation
must never inject input into a blocked session"). A nudge is confirmed only by an artifact delta, log growth
or an exit after it; unconfirmed means read the transcript, never resend (Herdr: a timeout "does not prove
that no input was sent"). `attention` then says "nudged 1× at T, no delta since — read the transcript,
restart clean or escalate". Optional: a per-run `stale=` knob instead of the `STALE_AFTER` constant.

### 5. Red-first fixing and a journaled baseline — lanes E, B

**Gap (verified):** `triage.md:48` gives `kind=fix` a shape (solo/staged, team debug, loop) but no play;
criteria-before-code has a different agent write the checks but never proves a check *can fail* — "a gate
that can't fail the work isn't a gate" (`shared-review-gates.md`) applies to acceptance checks too. Task 0
smoke-tests tools it installs, but nothing runs the repo's own suite on a clean checkout before fan-out, so
a red baseline makes every later gate ambiguous.

**Shape:** a `shared-fix.md` play from Matt Pocock's `diagnosing-bugs`: (1) a tight, deterministic,
agent-runnable, red-capable command already run once — no hypothesis before it exists; (2) minimise the
repro; (3) 3–5 ranked falsifiable hypotheses ("if X is the cause, changing Y makes it vanish"); (4)
one-variable probes, debug logs tagged for one-grep cleanup; (5) a regression test at the right seam,
watched failing, then passing; (6) the winning hypothesis named in the commit. Apodex 1.1 states the
acceptance rule: fail-to-pass tests must fail on the base state; "tests passing before the fix point to
incorrect test selection". Both proofs are one journaled exit code with primitives that already exist:
`board exec N --name accept-base -- <cmd>` (must fail) and `board exec 0 --name baseline -- <suite>`
(recorded before the first dispatch). The same-error-twice rule belongs inside step 3.

### 6. Per-repo verify recipe with Doctor and concurrent isolation — lanes E, B

**Gap:** the verifier's context ("Start/attach · Driver · Walk") is rebuilt by hand per dispatch; nothing
separates "the app is down" from "the feature is broken" before a verifier is spent; `shared-isolation.md`
says dev servers die with the run but nothing covers *concurrent* verifiers sharing ports, one database or
one test account.

**Shape:** Prepare probes and writes `.orchestrate/verify.md` — Launch · **Doctor** (one model-free,
read-only "is this instance worth driving?" check, run through `board exec N --name doctor`; failure is
`blocked`, never `fail`) · **Isolate** (the controller starts a shared stack once and lanes attach; else a
port per lane and one disposable account per lane — "explorers that share an account report each other's
edits as bugs"; a single-instance resource is single-flight; the first finisher never tears the stack down)
· Drive · **Evidence** (proof standards: the real user path, the action *and* the resulting state, side
effects checked in their stores) · Cleanup · **Gotchas** (appended from `board learn --kind gotcha`). The
recipe is run once before it is trusted ("a generated skill that was never executed is a draft",
tester-army). `prompt-verifier.md` reads it; `scripts/capabilities` flags existing `verify-*` skills and
Warp's `metadata.verification: true` marker.

### 7. Quota awareness and `board handoff` — lanes D, A

**Gap (verified):** the catalog's "How to pick" step 1 filters on plan quota, but nothing in `scripts/board`
or `scripts/capabilities` reads one; a quota block is discovered only when a lane dies, after its priming is
paid, and `shared-lane-hygiene.md` rule 5 then knows one move — "BLOCKED with a reset time, resume the same
session" — so a 5-hour or weekly window stalls the critical path while an equivalent model sits idle in the
catalog. The catalog's own research calls usage-limit burn "the top axis of differentiation, not raw
quality" (`docs/research/model-selection/04-x-reports.md:12`).

**Shape:** (a) the S slice needs no new input — `board return --status BLOCKED --resets <ISO>` journals when
the engine is back, the board derives "engine blocked until T", `board launch --engine E` refuses before T
unless `--force`, and `board plan` prints it (the existing "never retry-loop against a subscription quota"
rule, made mechanical; Claude Octopus marks a provider quota-dead with a parsed TTL); (b) the fallback
ladder — wait only if the reset is within a bound and the lane is off the critical path → another account on
the same engine → the catalog's equivalent-tier model on another harness → tell the user (Traycer's order);
(c) `board handoff N --to-engine E --model M` writes a continuation brief from deterministic facts (the
brief, journal decisions and learnings, `git diff BASE..HEAD`, the last report), optionally asks the old lane
for a handoff note within a bounded wait (Agent Orchestrator records `timed_out` without blocking), launches
in the same worktree only after `board reap` proves the old lane stopped (AO: an `unknown` probe "never
authorizes … a second target"; firstmate: never a fresh spawn while the old worktree is unaccounted for),
and journals a `handoff` event; if the first engine later resumes, it gets the delta, never a blind resume
(T3 Code v2). (d) The M slice: when the user already has a quota CLI (kunchenguid's `quota-axi`, detected by
`capabilities`, never installed unasked), `board plan` takes one snapshot and applies firstmate's order —
eligibility (an unknown quota is disclosed and stays eligible, never read as 0), never downgrade the
strongest reasoning class to save quota, a runway floor before the task's horizon, then prefer allowance
that would otherwise expire unused.

### 8. Fence the evolve pass, lint the loop — lanes F, C, B

**Gap:** `prompt-evolve.md` applies "the least that helps" to the loop contract in place and returns a prose
`watch:` line: nothing snapshots, predicts, attributes, reverts, caps growth or independently checks the one
agent that edits the loop's own constitution, and lever 1 lists "fuzzy verification bars" as editable.
Briefs are linted (`brief-check`); loop contracts are not. Nothing stops two ticks overlapping or an
interrupted cycle auto-resuming.

**Shape:** (a) **fence** — hash the protected sections at loop start (Goal, the verifier command, budget,
kill switch, stop condition, the ship-alone boundary) and compare after each pass (AHE's read-only verifier
and tracer, HarnessX `write_scope_gate.py`, Prime Agent's immutable base prompt); (b) **manifest** per change
— evidence (journal seq), root cause, predicted fix, guard, a signature that proves it fired; snapshot
first, and the next pass attributes before it edits and reverts falsified changes (AHE measured the
evolver's own regression forecasts at roughly 2× random — "regression blindness" — so revert on metrics,
not on its at-risk list); (c) **trigger on evidence**, skipping a pass with nothing new (Prime Agent, Hermes
Curator, MemoryRepo); (d) **growth cap** — an add pairs with a consolidation (HarnessX: five same-type
"reminder" edits, then the sixth dropped compliance 94.7% → 80.7%); (e) the **enforcement ladder** — a
mistake that survives a prose fix moves to a script or a `board check` rule (AHE's ablation: the system
prompt alone regressed, tools and middleware carried the gain); (f) `scripts/loop-check` beside
`brief-check`: numeric cycle cap, kill-switch path, a machine budget cap, a success stop *and* a
no-progress stop, an exit-code validation command, a named judge from another family when a gate must block,
a duplicate-action check for side effects (loops restart), and a flag for "stop conditions that need
subjective self-satisfaction" (Looper); (g) single-flight ticks and an interrupted-cycle pause that only an
explicit resume clears (Auto-Company); bounded waits with an exhaustion policy (Paperclip monitors).

### 9. Quarantine readers of untrusted input — lane C

**Gap:** research lanes are read-only by instruction, not by tool grant (`prompt-researcher.md:23`); `ops`
and triage loops have no reader/actor split (`strategy-loop.md` "Roles at scale"); the only defence is
"treat it as data" (`shared-safety-rails.md:84-91`) while these runs go unattended on open input.

**Shape:** reader lanes run in the host's read-only mode where it exists and carry no send/post/deploy
skill; they return a schema (ids, class, dedupe key, a ≤200-character gist, capped quotes); the actor gets
ids plus that summary and re-fetches under its own grant; a prompt that arrives by schedule, webhook or
comment never widens fan-out, budget or permissions (Claude Code ignores `ultracode` from `-p`, scheduled
tasks, webhook payloads and PR comments since 2.1.210). The same rule, stated for outputs: a `kind=research` or `kind=review`
run authorizes no change by itself — "evidence is never authorization" (firstmate) — and text in a prompt
grants no filesystem, network, credential or publication access (steipete's maintainer orchestrator).

### 10. Review loops that converge — lanes D, E

**Gap (verified):** a fix wave is "ONE fix subagent carrying the full implementer contract"
(`strategy-staged.md:87`) — a fresh re-prime — although the skill's own lane hygiene measured a resumed
session at "97% cache hits"; the round after it re-runs the full reviewer template; no reference defines a
way for a fixer to dispute a finding, so a false positive burns rounds until the tier-escalation cap (a
stronger *implementer* cannot fix a wrong *reviewer*); and `panel:N` is a plain majority of `ok`/`warn` votes
(`scripts/board` `quorum()`), so a quota-stalled or sandbox-blind reviewer that says "ok" can be the
deciding seat.

**Shape:** (a) **continue the fixer, keep reviewers fresh** — a same-tier corrective round resumes the
author's session with only the failing findings (`board dispatch --continue impl-3`); tier escalation or a
polluted context still means a new agent (rule 4, `restart_clean`); cap at two continues without gate
movement (no-mistakes: "Only the fixer resumes sessions; review turns remain fresh"; `/lightning` stops after
two corrective resumes); (b) **scoped re-review** — `prompt-re-reviewer.md` takes the previous findings
verbatim plus the fix diff, returns ADDRESSED / NOT ADDRESSED per finding, new breakage, and out-of-scope
notes ledgered for the final gate (superpowers' `re-review-prompt.md`); a failed gate still resets the other
gate; (c) **a dispute path** — the fixer may return a finding `DISPUTED` with evidence once, the controller
adjudicates (directly or `consensus:3` on that finding) and records `board decide`; a re-raise without new
evidence goes to the user (BHolmes: "explain the evidence once, then surface the disagreement"); (d) **valid
votes** — `board vote --evidence PATH` and an `Inspected:` line in the reviewer prompts; an empty, refusal or
"I cannot access the files" seat is excluded from quorum, and approval needs distinct model families (Claude
Octopus `council.sh`, born from a Gemini seat whose "I cannot access the implementation plan" counted as the
second provider). The derived gate text then reads `approve 2/3 ok · 1 blind`.

### 11. Claude Code fork mode and background spawns — lane D

**Gap (verified):** no reference mentions Claude Code's fork mode. Facts (docs, 2026-10-13, and this
session's own Agent-tool schema): `subagent_type: "fork"` inherits the system prompt, tools, **model** and full
history, reads the parent's prompt cache, and ignores `model` and per-invocation `effort`; it cannot spawn
forks; fork mode is on by default in interactive sessions since 2.1.232, and spawns run in the background.

**Shape:** in `engine-claude.md`, the Claude column of `shared-hosts.md` and routing rules 1 and 13: never use
a fork for a pinned role — it breaks rule 1 and surfaces as drift under rule 13; fork deliberately for
same-model side quests, or for N variants over one large shared context (the "primed fork fan-out" that
cmux and Traycer use); workers stay fresh-context with pointers; the controller waits on notifications and
never assumes an Agent call blocks.

### 12. Deterministic lane-boundary checks — lane E

**Shape:** at `board return`, `git diff --name-only` of the returned commits against the stint's `--owns`
globs, and a non-empty diff from a read-only role (researcher, reviewer, verifier), become `check` findings
that `done` refuses (Warp `assert_write_surface` raises before push); a `review-lint` flags any `path:line`
in a findings file that is not in the diff package (Warp drops such comments; we flag them); `board check`
validates that evidence artifacts are non-empty, not just present (Impeccable's "check 0": "a verdict
derived from a broken capture launders the breakage into an approval").

### 13. Decision cards and push notifications — lane A

**Gap:** a worker's `board send --ask` is free text, every `?` row looks alike, and answering never records
a decision, so the next worker re-asks; the board is a pane the user must watch.

**Shape:** `board send --ask "…" [--stops|--holds] [--options "A|B"] [--rec A]`, attention sorted by
severity (Plannotator: Stopped on you → Holding up work → Waiting on you), `board send --re N --decide D-n`
answers and records in one act, and a `## Next` section (≤5 imperative lines) in the report schema
(herdr-projects). `board follow --exec CMD` runs a hook on edge transitions only — new ask, blocked, failed
gate or check, finish — with `BOARD_SEVERITY`, `BOARD_EVENT`, `BOARD_TASK`, built from fixed phrases and ids,
never worker text (herdr-projects, Traycer); a recipe for `osascript`, `notify-send` and `ntfy`.

### 14. Claim-sharded fact-check and citation lint — lane E

**Gap:** the research play's fact-check is one verifier re-deriving every load-bearing claim from the same
cited source; it never asks for a second source, lets a single-source load-bearing claim ship, and returns
a refuted claim to the synthesizer with no new evidence-gathering.

**Shape:** (a) shard — one narrow verifier per claim cluster in parallel, each given one claim, its evidence
and the constraint, told to attack it (counterexample, atomic details, an independent source *class*),
verdicts through `board vote`; a `single-source` verdict; (b) a claim ledger (load-bearing / corroborated /
disputed / unresolved) the synthesizer cannot overwrite; (c) one targeted follow-up wave for refuted,
unverifiable or single-source load-bearing claims (Apodex "adaptive team effort"); (d) `scripts/cite-check`
through `board exec`: every `[N]` resolves, no orphan source, every number cites, URLs answer, arXiv/DOI
titles match (Feynman's verifier); (e) a provenance sidecar with sources rejected and a "Removed unsupported
claims" section. Apodex's numbers are vendor-reported and its team is closed; the mechanism rests on the
1.1 paper and Feynman's open prompts.

### 15. Lessons that survive the archive; path-scoped learnings — lane F

**Gap (verified):** `KEEP_ON_ARCHIVE` (`scripts/board:94`) keeps board, toolbox and capabilities, so
`field-guide.md` moves to the archive at the next kickoff; the only cross-run path is `board memory` →
`ctx`, which needs the project-context skill. `State.receives()` delivers every learning to the whole team
(`scripts/board:707`), so at fan-out each worker pays for lessons about files it does not touch.

**Shape:** a `.orchestrate/lessons.md` in `KEEP_ON_ARCHIVE` (orchestrate still never depends on
project-context; `ctx` stays an optional sink), one line per lesson with `path:`, `source:` (archive journal
seq), `added:` and `verify_by:`; promoted at `board finish` by the existing curation gate; renewed when a
later run re-confirms it, expired otherwise, archived never deleted (teamlore, Agent Memory Repo, Hermes
Curator, ECC). A brief points at it only when a lesson's path overlaps the task's `--owns`. A learning with
`--path` reaches only stints whose `--owns` overlaps, with "k learnings held back" printed so nothing hides.
Cognition's "Dreaming" is then a recipe, not a feature: `kind=ops strategy=loop trigger=schedule:"0 3 * * *"`
running a consolidation pass, skipped when nothing is new.

### 16. Standing routing rules and a speed tier — lanes D, F

**Gap:** an `alias` is per invocation and the catalog is per role; neither can say "trivial fixes go to the
subscription I already pay for, image work and investigations to Codex" (kunchenguid's setup). Speed is bought
implicitly or not at all: Codex's own model catalog lists a Fast service tier at "2x speed, increased usage" for
gpt-6.1-sol and gpt-6-astra (`~/.codex/models_cache.json`, 2026-10-13) while `engine-codex.md:61` says 1.5×, and
no rule pins the tier — the silent-inheritance problem rule 1 describes for effort.

**Shape:** `routes:` in `config.yaml` beside `aliases:` — `when` (natural language) → an ordered `use:` list of
harness · model · effort (· tier), `why`, optional `approval: user` and a quota `floor`; precedence explicit
per-task > best-fit rule > default > catalog posture; the flight plan prints a `route:` line, and with routes
present a dispatch with no resolved profile is a `check` finding (firstmate `config/crew-dispatch.json`).
Classify from the task's goal only and send a low-confidence pick to ask or escalate, never to an arbitrary
choice (firstmate's benchmark: same accuracy at ~0.6k vs ~4.3k tokens). Speed becomes a pinned axis spent only
on serial roles — staged chain, integrator, final gate, interactive controller — never on fan-out workers or
background lanes (Devin Fusion exposes Normal | Fast), after candidate 1 supplies wall-clock.

### 17. Tracker-intake loop recipe — lane B

**Gap:** `strategy-loop.md:62` gives event-based triggers one line, so a ticket closed mid-run keeps its
worker running and a restarted loop can dispatch the same ticket twice.

**Shape (OpenAI Symphony `SPEC.md`, repo-read):** reconcile before dispatch on every tick — tracker state is
the stop signal (terminal → stop the worker and clean up; no longer active → stop, keep the tree); claims as
board tasks with the ticket id in the title; candidates = active state ∩ opt-in label ∩ not blocked ∩
unclaimed ∩ a free slot; a handoff column (Human Review) is not an active state, so the worker stops and a
human moving the card re-dispatches; tracker credentials stay host-side. Hardening from Symphony's own log:
opt-in label required, blocker links gate dispatch, the last good config kept on an invalid reload. Pair it
with candidate 1 — Symphony has no spend cap.

### 18. PR/CI facts on the card, a bounded PR-shepherd loop — lane A

**Shape:** `board pr N <url>` reads `gh pr view --json state,reviewDecision,statusCheckRollup,mergeable`;
attention rows `x ci failed`, `? changes requested`, `? landing`; "merged" is landed-evidence for candidate
3. Rules both implementations learned the hard way: one nudge per (condition, signature), persisted so a
restart never re-nudges; at most three attempts per review comment; conditions queued independently so a CI
failure never hides review feedback; the agent's own comments never re-trigger it; the prompt carries counts
and the `gh` command, never GitHub text (Agent Orchestrator `reactions.go`, herdr-projects `steps.rs`).

---

---

## Smaller items

- **Tournament and generate-and-filter are unnamed plays.** Of Anthropic's six dynamic-workflow patterns,
  classify-and-act, fan-out-and-synthesize, adversarial verification and loop-until-done are covered;
  generate-and-filter is partial (the judge-panel variant, `strategy-adversarial.md:45`) and tournament has
  no hit anywhere. A match = a fresh judge sees two artifacts and a rubric, never their authors, sides
  swapped on a second pass; the bracket lives in the journal (a `match` vote kind). Value M–L, effort S.
- **A portable fan-out driver** (`board fanout`): items × brief template → todo cards plus gated `board
  launch` lanes with a sliding window from `--after` edges and a fan-in guard — the workflow strategy
  exists for Claude Code only and points other hosts at an unlicensed driver. Value H off Claude Code, L on
  it; effort M–L; risk of scope creep toward a runtime.
- **A builder check closes clarify**: a fresh cheap subagent sees only the goal, the decisions and the
  capabilities, and lists the questions where a wrong guess would change the plan ("nothing important left"
  is a valid answer); a decision the user cannot make alone becomes a questionnaire for a named person while
  independent work proceeds (obra/superpowers v7, released 2026-10-10; Matt Pocock `to-questionnaire`). Value
  M, effort S.
- **Record gate isolation**: the findings file's first line says whether the gate ran in a fresh subagent or
  inline (degraded, with the reason), and `board finish` prints "gates run degraded: N" (Impeccable: "a silent
  degraded critique is a failed critique"); machine-check output reaches the synthesis only after the
  unanchored review returned. Value M, effort S.
- **ACP as a second lane transport** (strategic): six of nine engine templates are docs-only dry runs and
  flag drift has cost real runs; the Agent Client Protocol gives one typed surface for the model and effort
  pin, resume, cancel and permission callbacks, and four tools here converged on it. Use only ACP servers
  the user already has; effort over ACP is adapter-defined. Value M, effort L — do not rush.
- **Capacity admission**: `board launch` defers (exit "queued, not blocked") when load average or memory is
  past a ceiling (firstmate exit 75, omg.dev RAM budget, herdr-gpui spare-core formula). Value L–M, effort S.
- **No blind turn-end**: an opt-in Stop-hook snippet that refuses to end the controller's turn while a lane has
  no armed waiter (firstmate's per-harness turn-end guards). Value M, effort M.
- **`brief-check --overlap`**: a pairwise check of the tasks' `owns:` globs before a parallel wave (today a
  manual grep in `strategy-parallel.md`; project-orchestrator colours waves by declared files). Value L–M,
  effort S.
- **Machine check before the model judge** in loops: run the deterministic gates, then the judge (Hermes
  `/goal gate add`). Value L, effort S.
- **Leaf workers never spawn**: no implementer, reviewer or verifier prompt says not to dispatch a nested
  subagent, which would be unpinned and unjournaled; count Agent-tool calls in a few transcripts first.
  Value M, effort S (byte-identical across the replicated blocks).
- **A failure-catalog lens**: where a repo keeps its own record of recurring agent mistakes, its "always
  reviewed" categories get a fresh reviewer on every change (QM's wall of shame). Value M, effort S.
- **Guided review for the human at finish**: the integrator writes ordered sections and `check --finish`
  verifies that every changed file appears exactly once (Plannotator). Value M, effort S–M.
- **Privilege ceiling**: a lane's sandbox and approval mode never exceed the controller's; bypass flags only
  with a recorded user grant (T3 Code v2, OpenBot 0.24, QM). Value L–M, effort S.
- **Replies join**: `board wait --replies` returns once every ask this agent sent has an answer or its
  recipient's stint ended (OpenBot 0.23). Value L–M, effort S.
- **Overfitting check** in the quality reviewer: names or comments that need the conversation to be
  understood; shims for signatures that only existed earlier in the run (BHolmes `/simplify`). Value M,
  effort S.
- **Primed fork fan-out**: prime one session with a large shared read, then fork it per worker with the
  engine's existing fork switch (cmux, Traycer). Cache saving unmeasured. Value L–M, effort S.
- **Population loop recipe** for `strategy=loop topology=parallel`, named in `SKILL.md` without mechanics:
  N experimenters, a periodic leader check, the next wave seeded from the best measured commit (ClawTeam,
  self-reported). Value M, effort S.

## Doc corrections found

- `strategy-loop.md:59` says the `/goal` evaluator "re-checks each stop attempt". Per the Claude Code docs it
  receives the condition and the conversation, calls no tools, and can only judge what the worker already
  printed — so the validation command's raw output must land in the transcript — and it has a third verdict,
  `impossible`, that the contract should map to `board blocked` / `escalate`.
- `strategy-workflow.md:83` "Subagents run acceptEdits regardless of session mode" conflicts with the
  sub-agents page (a subagent inherits the main conversation's permission mode unless one is set) —
  re-verify live.
- `strategy-workflow.md:66-71`: widen "no clocks, no randomness" to environment variables, filesystem state,
  network responses and generated ids (Devin's rule); add that a failed or individually stopped agent
  re-runs every later-started agent on resume; loop-until-dry must dedupe against everything seen, not only
  what was confirmed, or rejected findings reappear and it never converges.
- `shared-model-routing.md` rule 11 cites Cursor's ~8× spread correctly; the widely quoted "15×" divides an
  informal, ungraded solo-Fable run ($20,057) by the cheapest hybrid ($1,339). Optional addition: planner
  spend stayed near $0.9–1.2k across mixes while worker spend ran $411 to $9,373, so the lever is the worker
  lane's model and effort.
- `engine-codex.md:61` says the Codex `--fast` service tier is 1.5× speed; Codex's own model catalog
  (`~/.codex/models_cache.json`, 2026-10-13) lists Fast as "2x speed, increased usage" for gpt-6.1-sol and
  gpt-6-astra. Re-verify per model and pin the tier (candidate 16).
- Claude Code's fork mode and background Agent spawns are undocumented in every reference (candidate 11).
- `scripts/count-skill-tokens` measured about 20% under an `o200k_base` count across the 48 skill files
  (table-heavy files up to +48%). That is OpenAI's tokenizer, not Anthropic's; calibrate against a real
  count before trusting either.

## Not worth adopting

- **Persona and org-chart layers** (Auto-Company's 14 experts, Paperclip's CEO, gstack's role skills): no
  source measures a benefit, and Paperclip itself cut its default CEO instructions from about 1,900 words to 20.
- **Remote and phone steering, Teleport, multi-machine threads, session import, desktop UI features** (Paseo,
  Empryo, T3 Code, Herdr, Traycer, Maestri, Superset): they need a daemon and a relay; the skill's lever is
  the push hook (candidate 11) and whatever the host offers.
- **Snapshot and fork runtimes** (Stanford's agent-native Git, Kimi AgentENV, Active Graph fork-and-diff):
  infrastructure, and replay is free only when the controller is deterministic; ours is a model.
- **A learned router or keyword routing** (Cursor Router, Mission Control): needs live-traffic scale, or is
  the shape the better tools reject; we already log the same outcome label (first-attempt-clean).
- **Managed platforms with no inspectable mechanism** (OpenAI Agents API, Kimi Work, Factory Environments)
  and infrastructure control planes (Google AX).
- **A persistent concurrent sidekick** (Devin Fusion): needs two live sessions; our default shape already
  matches Fusion's economics with fresh, cache-cold workers.
- **`/batch-grill-me`**: Matt Pocock folded it into `grilling` on the day it shipped (2026-07-16); Prepare P1
  already holds every mechanic it had.
- **Interactive PTY lanes that type into a TUI** (tmux-bridge-mcp, OctoGent, pi-interactive-shell,
  firstmate's crew windows): idle detection by timers and regexes is the fragile layer; headless lanes with
  resume-by-id give takeover without it. Claude Code now ships cross-session messaging natively, which also
  retires claude-peers.
- **Persistent "secondmate" homes, bots and coordination servers** (firstmate, omg.dev, project-orchestrator,
  Continuous-Claude-v3): a second source of truth beside the journal, or an infrastructure dependency for a
  stdlib-only skill.
- **Codex app-server brokers** (codex-plugin-cc): open lifecycle bugs; keep the detached `codex exec` wrappers.
- **steipete's 5-minute heartbeat as tweeted**: he walked it back himself (2026-08-08: "max 8 lanes, an
  admission ceiling, not a fill quota"; "Do not create a heartbeat" unless asked) — evidence for rules
  `orchestrate` already has.
- **Issue-tracker lifecycle products** (Multica, vibe-kanban — now sunsetting): `orchestrate` does not own the
  product lifecycle; the tracker recipe (candidate 15) is the portable part.

## Gaps

- Closed products are docs-graded or post-only: Traycer's host (the `agent.stalled` rule), Devin and Claude
  Code dynamic workflows, Apodex's team, Cursor Projects, Warp Oz, OpenAI's Agents API.
- Vendor and self-reported numbers were not reproduced: Apodex benchmarks, Prime Agent's ARC-AGI-3 score,
  HarnessX and AHE gains, Cursor's prompt figures, Empryo's scale claims, ClawTeam's results.
- The article behind the "Loop → Graph engineering" post was not fetched (the quoted article is a GraphRAG
  tutorial); Boris Cherny's original "I write loops" interview was not located.
- Adoption candidates are judged by fit and evidence, not measured in `orchestrate` runs. Candidate 1 is
  what would let later candidates be measured.

## Addendum — `incremental-implementation` (addyosmani/agent-skills, MIT), 2026-10-17

Read at sha aeac41d. It teaches one agent to build in thin slices, test and commit each one, and stay in
scope. Most of it was already in `orchestrate`, enforced rather than stated: brief schema with Out of
scope and Must NOT, verification commands run and reported, independent spec and quality gates,
`toolbox` recipes. Adopted (in `[Unreleased]`, folded into v1.32.0):

- **Proof first** (its risk-first slicing): several tasks resting on an unproven assumption get one thin
  end-to-end task in the first implementation wave; dependents take a hard edge — `triage.md`, the
  parallel and hierarchical strategies, the lead prompt; the triage assessor reports `unproven:`.
- **Noticed, not touched** (its scope discipline): workers leave out-of-scope fixes and report them; the
  controller makes a task only of what the goal needs. Replaces "improve what you touch". This is the
  prompt half of candidate 12; the `--owns` diff check at `board return` is the enforced half, still open.
- **Simplicity** in the quality reviewer's Judge list, and one implementer line asking for the simplest
  design that meets the brief.
- **Stop when checks pass**: its "don't re-run a passing command on unchanged code" plus the vendor's
  measured stop-and-report line for Sonnet 5.5 at max effort (no self-started review rounds or reviewer
  subagents; about a third less session cost, no quality change — `../model-selection/07-effort-curves.md`).

Not adopted: the per-slice loop and checklist (current models do it unprompted, and the board runs the
checks), feature flags and safe defaults (repo conventions and domain skills own those), and wholesale
installation into worker prompts (a per-dispatch token cost for little gain). Installing the skill
remains an option: Prepare lists it, and a brief can point a worker at it.

## Addendum — `elephant-goldfish-model` (google/elephant-goldfish-model, Apache-2.0), 2026-10-29

Read at sha f0ba151 (2026-10-28): 7 skills, 9 reviewer personas, Claude adapters, 5 rubrics, design
docs, tests and the harness test record. EGM drafts and reviews design documents only — "No
Skill.md is required" for implementation — so it overlaps `orchestrate` at the review gate and the
brainstorm swarm, not at execution. Its runtime is ~12k words of skills against our ~69k tokens of
references, but the scopes differ by about 10×.

**Adopted** (v1.32.0, unreleased):
- *Convergence, not zero findings* (its PR #168): settled findings stay closed across fresh rounds,
  a fix does not settle, a round is clean with no unsettled blocker, churn stops the loop. Applied
  controller-side so reviewers stay fresh (`shared-review-gates.md`).
- *A checkable contest* (`egm-resolve`): dismissals cite evidence the reviewer could read; evidence
  it could not see goes to the record or the user; never change a severity; don't add context only
  to satisfy a reviewer.
- *A reviewer that did not run is not a reviewer with zero findings*: our `board` passed
  `panel:3` on two ok votes with the third lens missing; now pending, and `board done` refuses.
- *Paraphrase first* (its comprehension persona): plan review and the counter-planner restate what
  the plan builds and how the parts connect.
- *Post-review pruning* (its Stage 8 zoom-out), applied maker-side: a fix answers its findings and
  nothing more.

**Not adopted**: shouty prompts ("CRITICAL"/"STRICTLY FORBIDDEN" 12–14× per skill, against current
Anthropic guidance); a Delegation paragraph pasted into 7 skills with no sync test (our check-sync
covers this); question payloads specified to the JSON and one question per turn (our clarify
rounds batch); strict stage-by-stage execution; regex "deterministic" scenario tests (reward the
shape of an answer); `omitClaudeMd` for code reviewers (our quality reviewer must see the repo's
conventions).

**Deferred to a later release**: host-enforced read-only reviewers (Claude agent definitions with
`tools: [Read, Grep, Glob]`), a harness test record (host · version · date · strategy · evidence ·
gaps), and plugin distribution (`claude plugin install`, Codex marketplace) instead of `install.sh`.

**Our read load, measured** (`scripts/count-skill-tokens --traversal`, words×1.35): the traversal
cases name only each case's distinguishing files, so they are lower bounds — 7.1k (adversarial
plan) to 15.2k (external Codex). A full parallel build's controller read set (router, prepare,
triage, safety rails, flight plan, parallel, isolation, contracts, review gates, token economy,
model routing and catalog, implementer/spec/quality/integrator prompts) is ≈34k tokens, read once
per run: ~17% of a 200K window, ~3.4% of 1M. The heaviest single files on that path are
`shared-token-economy.md` (3.8k), `shared-contracts.md` (3.7k) and `SKILL.md` (3.5k) — the place
to start a dedicated trimming pass, which this release deliberately did not attempt.

## Sources

Six lane reports in [`lanes/`](lanes/), each with per-tool links, evidence grades and its own gaps:
A — agent workspace apps · B — board- and company-style orchestrators · C — plans as code · D — agent-to-agent
messaging and cross-harness setups · E — verification, research quality and clarification · F — harness
design, memory and efficiency.
