# hierarchical — orchestrator → sub-orchestrators → workers

Purpose: Delegate broad domains to sub-orchestrators that plan and supervise their own workers.

Read when:
- A build spans two or more domains that each need their own planning, workers and integration (triage's default for multi-domain builds), or one question needs a read-only fan-out too wide for one context.

Skip when:
- The work is a small flat set of directly assignable tasks.

Inputs:
- Domain boundaries, budgets, model tiers, reporting contract, and overall acceptance criteria.

Produces:
- Domain plans, delegated task results, domain summaries, and controller synthesis.

## Contents

- Depth reality (know the runtime before designing the tree)
- Design rules
- The domain lead's loop (the build play, one level down)
- Flow
- Mail in a tree (authority is lineage, not a name)

Preset: `topology=hierarchical review=dual models=orchestrator:strong,worker:cheap`.
Use when the work spans domains that each need real *thinking* plus their own worker fleet — the
shape of most full builds (backend · frontend · infra · data). Your context is the scarce resource:
you hold only conclusions; leads hold their domain; workers hold one task. **Independent domains are
the trigger, not size**: a 1M-token window removes the capacity reason to split, never the speed
reason — two domains a lead each can plan, build, review and merge at once finish in the time of the
slower one (`triage.md`).

Read with this file: `shared-model-routing.md`, `shared-contracts.md`.
Prompt: `prompt-sub-orchestrator.md`.

## Depth reality (know the runtime before designing the tree)

- **Claude Code subagents spawn subagents** — observed 2026-10-13 on Claude Code 2.1.296: a
  subagent dispatched a nested subagent, and the nested one reported the Agent tool too (the hosts
  matrix records depth 5; not probed past 2). So the native shape is the default: each lead is a
  background subagent on the orchestrator tier that dispatches its own workers. Older builds said
  otherwise — probe once per session (a one-line nested dispatch) before designing a tree on it.
  The other mechanisms stay available:
  1. **`board launch` lanes as leads**: a `claude -p` (or Codex, Grok…) lane is a full session with
     its own dispatch tool; `--by` defaults to the lane's name, so its workers journal under it.
  2. **Teammates as sub-orchestrators** (agent teams): a teammate is a full session that CAN spawn
     its own *foreground* subagents. Lead → teammates → subagents = 3 levels. Teammates can't
     nest teams or run background subagents.
  3. **Workflow nesting**: a workflow script can call `workflow()` exactly ONE level deep.
  4. **The main conversation as recursion stack** (RLM pattern): you sequentially play each
     sub-orchestrator yourself — fan out workers for domain A, aggregate, then domain B. Cheapest;
     no extra sessions; serializes the thinking layer — the fallback where nothing above exists.
- Anthropic managed-agents (server-side) also caps delegation at depth 1 — flat rosters, max 20
  agents, 25 threads. Same lesson everywhere: **wide and shallow beats deep**.

## Design rules

- Decompose into **2–7 domains** per level for a build (backend + frontend is the common
  two-lead case) and **3–7 partitions** for a read-only fan-out; one means you didn't need the
  level, more than 7 means the brief is too vague. Aggregation strategy declared up front: union ·
  synthesis · reduce.
- Each sub-orchestrator brief: domain scope, its worker budget (count + model tier), the typed
  report it must return (verdict + findings + artifact paths, <1500 tokens), and what it must NOT
  do (no cross-domain edits, no scope invention). Briefs follow the priming anatomy + pass
  `scripts/brief-check` (`shared-token-economy.md`); sub-orchestrators apply the same standard to
  their own worker briefs.
- Planners and sub-orchestrators make cross-cutting design decisions THEMSELVES and record them
  with IDs and owners in `decisions.md` (`shared-contracts.md`) — never delegate a cross-cutting
  decision to a worker; no two delegated subtrees may decide the same question.
- **Peek before deep**: have each sub-orchestrator sample structure (cheap greps/reads) before
  committing its worker fan-out.
- **Decide worker-control ownership before spawn.** On hosts where lifecycle controls
  (stop/attach) sit with the top controller, a flat-roster lead CANNOT stop its own hung workers
  — observed mid-incident, at full cost. Either grant the lead real control over its fleet, or
  pre-agree that stop requests route through the controller, or plan the lead's work serialized.
  Discovering this during the incident is the expensive path.
- **Shared rate-limited resources are declared per subtree**: a sub-orchestrator whose workers
  touch a per-IP/per-account-limited service gets the single-flight ownership rule in its brief
  (`shared-safety-rails.md`) — three sibling workers hitting one relay concurrently wedges the
  whole crew, not just the offending subtree.
- Token budget drives shape (it explains ~80% of multi-agent quality variance): give each branch
  an explicit effort tier; simple domain = 1 worker/3–10 tool calls, complex = several workers.
- **Blind parallel counsel** for judgment calls: task two different-lineage agents (e.g. an opus
  reasoner + a codex peer) on the SAME question in parallel, never showing either the other's
  answer; synthesize the best of both yourself.

## The domain lead's loop (the build play, one level down)

A lead owns one domain end to end, on a domain branch (`agent/<domain>`), and runs exactly what a
flat run would (`triage.md`, the build play): decide the domain's interfaces first (`board decide
D-<task>.<n>`) · criteria before code, once (every task's acceptance checks as one set, by a
non-implementer, before the first implementer starts) · its tasks in waves on the domain's
dependency graph, each worker in its own worktree cut from the domain branch, dispatched
on readiness — a hard dependency is ready once gated and merged into the domain branch
(`strategy-parallel.md`) · spec then quality review as each task lands ·
merge each gated branch into the domain branch, resolving conflicts itself (bouncing a merge back to
the worker only when it needs that worker's intent) · the domain's machine checks green on the
domain branch · then its typed return. The lead never implements; it plans, dispatches, reviews,
merges. Cross-domain contracts are the controller's, decided before any lead starts.

## Flow

1. Split domains → pick the depth mechanism (native nested subagents on Claude Code; `board launch`
   lanes elsewhere; teams if domains need long-lived coordination; recursion-stack if they're
   read-heavy analyses; workflow if homogeneous at scale). Decide the cross-domain contracts
   (shared types, API shapes, event names) in `decisions.md` before dispatching any lead. On the
   board the top-level tasks are the domains (`## Task 2: Backend`), one per lead; the plan's tasks
   become each lead's dotted subtasks (`board todo 2.1 …`, journaled by the lead) — regroup a flat
   plan that way before `board init PLAN --resume`. Prepare's Task 0 stays a single worker every lead waits for.
2. Dispatch sub-orchestrators with briefs; they run their own worker loops and return typed
   reports + artifacts on disk.
3. Integrate: the integrator merges the domain branches into the run branch in dependency order,
   runs the full suite after each merge, and resolves cross-domain collisions against the recorded
   contracts (`prompt-integrator.md`). Read-only fan-outs aggregate instead (union · synthesis ·
   reduce). Gaps → follow-up partition, not a redo of everything. A run that changed the repo owes
   the final-deliverable gate before reporting done: fresh context, accumulated change set vs the
   originally stated goal (`shared-review-gates.md`).
4. Review gates apply at the level that produced code (worker output → its sub-orchestrator's
   review; cross-domain integration → yours).
5. Ledger the tree: one line per sub-orchestrator completion with its artifact paths.

A worker's `DESIGN_CONFLICT` goes to its lead, who resolves it inside the domain; one that crosses
domains or a shared interface climbs to the controller (`shared-replan.md`).

## Mail in a tree (authority is lineage, not a name)

One flat journal, one board, any depth. A sub-orchestrator journals its subtree as dotted subtasks
of its own task (`board todo 3.1`, `board dispatch 3.1 --model M --by lead-3` — the board names the
worker `impl-3.1`, so the tree is readable from the names alone) — the `--by` is what makes it
their **lead**: `controller` and `lead` in a worker's `--to` resolve to
the agent that dispatched it, so a subtree's questions reach its lead, never you; the lead's mail
arrives tagged `[lead lead-3]` and binds like yours (`[controller]` binds everywhere); `board
peers` shows a worker its team first and "elsewhere in the run" after; a worker's `board learn`
line reaches its team and its lead, never another subtree — you see every learning in your inbox
and carry the cross-subtree ones into later briefs or the field guide. You see a subtree's ask
only when its lead leaves it unread past the stale threshold (`!` in attention, `board check`),
and then you nudge the lead or answer it yourself. A lead that has returned is no lead: its
workers' questions fall back to you. Inside a `board launch` lane, `--by` defaults to the lane's
own name, so an engine that dispatches its own workers is their lead without saying so — where the
engine's sandbox allows it. Where it does not (Codex: nested `codex exec` is blocked by the
sandbox), the worker-control rule above applies literally: the lead writes the briefs and journals
the todos, asks you in ONE mail to launch them, and you launch each `--by <lead>`; the lead then
waits with `board wait --agent <lead> --task N.1 --task N.2 --timeout 540 --or-mail` (5 = a worker
asked it something first). Observed live: the lead decided the shared interface up front
(`board decide`), handled a shared-tree scoop by escalating ONE ask to the controller, recorded its
workers' returns and integrated — 6.7M tokens for 4 accepted tasks on the cheap tier at max effort.
