# Triage — picking a strategy when the user didn't

Purpose: Classify the task, then select the fastest orchestration shape that keeps every required gate — concurrency by default, sequence only where a real dependency demands it.

Read when:
- No explicit strategy or saved alias was supplied.

Skip when:
- The user forced a valid strategy and host compatibility is already resolved.

Inputs:
- The request or plan (sharpened by Prepare), repository shape, `capabilities.md`, host capabilities, dependencies, risk, and budget.

Produces:
- Task kind, selected strategy, resolved degradations, and a one-line rationale.

## Contents

- Step 0 — should you orchestrate at all? · Step 1 — classify the kind · Step 2 — measure the shape
- Step 3 — map shape → strategy (the build play) · Step 4 — resolve and record · Re-triage triggers

Step 0 runs first, before Prepare — a solo task needs no preparation. Steps 1–4 run after Prepare
(`shared-prepare.md`) and BEFORE dispatching anything. It costs one cheap assessment, not a subagent, unless the codebase is unknown (then dispatch
`prompt-triage-assessor.md` on a mid-tier model). The user should never need to know a strategy
name: the kind picks the play, the dependency graph picks the shape.

## Step 0 — should you orchestrate at all?

Estimate total context the work needs (files to read + plan + expected diffs).
- **< 50K tokens AND tasks are coupled → `solo`.** Do the work directly; add a single reviewer
  subagent if the change is risky. Orchestration overhead would exceed its return (measured
  baselines: one tool-using agent ≈ 4× a chat interaction's tokens; multi-agent ≈ 15×).
- A loop earns its cost only when ALL four hold (Karpathy test): the task repeats or grinds;
  verification is automated; the token budget can absorb retries; the agent has real tools to see
  failures. Miss one → don't pick `loop`.
- **Host gate** (non-Claude-Code hosts only): resolve the host first (`shared-hosts.md`). `team`
  needs Claude Code or Antigravity; `workflow` needs Claude Code; in-session parallel fan-out is
  missing on opencode/Hermes. An unsupported pick maps to its degradation (team→hierarchical,
  workflow→scripted xcli fan-out, parallel→headless engines in worktrees) — name the downgrade in
  the one-line pick.

## Step 1 — classify the kind (`board set kind=…`)

| Kind | The request is… | Default play |
|---|---|---|
| **build** | a plan, PRD, feature set, app, service — code that must exist | the dependency graph decides (Step 2): hierarchical · parallel waves · staged |
| **research** | a question many sources answer: "find the best…", "deep research", "what exists for…" | `parallel` source lanes → synthesis → fact-check (`shared-research.md`) |
| **fix** | a bug, failing suite, regression, perf target | known cause → solo/staged · unclear root cause → `team` debug · grind to green → `loop` |
| **review** | audit a branch, codebase or design | `parallel` lenses (`review=panel:N`) or `workflow` when 20+ items |
| **content** | writing, video, decks, assets with research behind them | research lanes first, then production lanes per artifact |
| **ops** | recurring or triggered work (schedule, queue, monitor) | `loop` with a trigger |

Unsure between two kinds → it is usually two runs: research first, then build on what it found.

## Step 2 — measure the shape (build plans)

| Signal | How to read it |
|---|---|
| Plan exists? | plan file / PRD / issue list present → planning=none (already planned); none → Prepare's clarify writes one |
| Task count + size | count `# Task N` headings or enumerable units |
| **Dependency graph** | per task: which tasks must land first (the fake-edge test below) — gives the waves and their width |
| **Unproven assumption** | do several tasks rest on something nobody has run in this stack — a library's real behavior, a protocol, a performance budget, a platform API, the seam every task crosses? → proof first (Step 3) |
| **Domains** | distinct areas that each need their own planning and integration (backend · frontend · infra · data · mobile …) |
| Shared files | do tasks' file lists overlap? overlap → repartition or an integrator-owned seam file |
| Verifiable stop? | tests/build/metric that can fail the work without a human |
| Blast radius | prod/customers/external sends → human gates ON regardless of strategy |

**The fake-edge test**: for each step ask *does this step actually need the previous step's
output?* No edge → no wait → it runs concurrently. Pair it with the file-overlap check
(`prompt-triage-assessor.md`), which answers the isolation half. Most plans written as a numbered
list are not chains: the numbering is the author's order, not a dependency.

## Step 3 — map shape → strategy

```
coupled tasks, <50K ............................................ solo
build, ≥2 domains each with ≥2 tasks (or ≥8 tasks across areas) . hierarchical  (lead per domain)
build, one domain, ≥2 tasks with no edge between them .......... parallel      (waves on the graph)
build, a true chain (every task needs the previous one) ........ staged
research question, many sources ................................ parallel      (source lanes)
one repo question spanning huge context ........................ hierarchical  (read-only fan-out)
workers must argue/coordinate mid-task ......................... team
20+ homogeneous items, or verify-each-finding .................. workflow
grind-until-green OR recurring on trigger ...................... loop
budget-constrained + strong model only for judgment ............ advisor
high-stakes plan, wrong-plan cost >> debate cost ............... adversarial   (then the build play)
task fits another CLI's specialty / second opinion ............. xcli (usually as engine= on another strategy)
```

A domain with one task is not worth a lead: when most domains hold one task, the run is `parallel`,
not hierarchical.

**Concurrency is the default; sequence is a finding.** Pick `staged` only when the graph says chain —
never because the plan is numbered, never because parallel feels riskier. The gates do not change
with the shape: every task still gets criteria before code, its spec and quality reviews, its
machine checks, and the run its final-deliverable gate. Parallel runs them as each task lands.

**The build play** (what hierarchical and parallel share): Prepare's Task 0 (environment) first →
contracts first (the controller or each lead decides shared interfaces in `decisions.md` before any
fan-out) → criteria before code (every task's acceptance checks written once, as a set, by an agent
that implements none of them) → implementation in waves on the graph, dispatched on readiness (a
hard dependency is ready once gated and merged), reviewed as each lands, merged continuously by
the integrator → final-deliverable gate. Hierarchical adds a lead per
domain who runs that loop inside the domain; the controller integrates the domains.

**Proof first** — when several tasks rest on an unproven assumption (Step 2), the plan gets one
thin task that runs it end to end through every layer it touches, and nothing more. It goes in the
first implementation wave beside every task that does not rest on the assumption; the tasks that
do take a hard edge to it. The edge is real — they need its evidence — so this is a finding, not a
retreat to `staged`. A proof that fails goes to replan (`shared-replan.md`), caught for the price
of one task instead of a wave. Proven ground needs no proof task: the stack's existing patterns, an
interface the repo already serves. (Risk-first slicing, from Addy Osmani's
incremental-implementation skill — addyosmani/agent-skills, MIT.)

Scale-gating (task count refines within a strategy): 1–2 files w/ complete spec → cheapest worker
tier; 3–5 → standard flow; 6+ → require a written plan first (planning=plan-first).

**Long-context note**: a 1M-token window removes the *capacity* reason to split work, not the
*speed* reason. Room alone never routes to `hierarchical`; independent domains do — and independent
tasks route to concurrency whatever the window size.

**Vocabulary**: users now say "graph" for what this skill calls `parallel` (independent nodes) and
`workflow` (script-held fan-out, verify, merge) — route the word, don't invent a strategy for it.
Caution when a user brings graph-engineering material: the topic has already produced at least one
fabricated study, so any citation needs a primary source.

## Step 4 — resolve and record

1. State the pick in one line: `strategy=X because <signals>` (kind, waves and width, domains,
   the proof task if there is one).
   Apply user dimension overrides. `board set strategy=X kind=K tools="…"`.
2. Only if two strategies fit equally and the cost difference is large → ask the user
   (AskUserQuestion on Claude Code; host equivalent per `shared-hosts.md`) with the trade-off —
   ideally inside the last clarify round. Otherwise proceed.
3. Before the first multi-agent dispatch, render the flight plan and gate on approval
   (`shared-flight-plan.md`) — the pick line above becomes its header.

## Re-triage triggers (mid-run)

- Scope expansion (new features/constraints/tech discovered) → STOP, restart triage with the
  integrated requirements. Do not bolt new scope onto a running strategy.
- `DESIGN_CONFLICT`, or repeated BLOCKED on one theme → the plan is wrong: `shared-replan.md`
  (architect for internal design, the user for product behavior).
- Budget exhausted → summarize state to the ledger, report, stop. Never silently downgrade review.
