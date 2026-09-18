---
name: orchestrate
description: >-
  Coordinate multi-agent work by selecting and running a bounded orchestration strategy. Use for
  implementation plans or multi-step tasks needing staged reviews, parallel worktrees, hierarchical
  fleets, agent teams, workflows, goal loops, advisor/executor splits, adversarial
  planning, or external coding CLIs. Triggers include "orchestrate this", "run this plan with
  subagents", "fan out agents", "goal loop", and "agent swarm". Do not use for small coupled tasks
  one agent can complete efficiently or for choosing a digital-product lifecycle; orchestrate only
  coordinates agents and execution.
---

# Orchestrate

## Mission and boundary

Coordinate, dispatch, review, and gate multi-agent work through one of nine strategy presets. The
invoking agent is the controller: it resolves the execution topology and maintains durable state;
subagents perform the implementation or investigation.

`orchestrate` owns **how work is assigned across agents**. It does not decide which product-lifecycle
domains are required, replace a domain skill, or own product progress. A lifecycle composer such as
`digital-product` may request orchestration, but neither capability depends on the other.

## Invocation grammar

Use the explicit form supported by the client: `$orchestrate` in Codex, `/orchestrate` in
slash-command clients, or the host's equivalent. Documentation uses `/orchestrate` as shorthand.

```text
<plan-file | task description>
  [strategy=auto|staged|parallel|hierarchical|team|workflow|loop|advisor|adversarial|xcli]
  [review=dual|spec|quality|panel:N|consensus:N|off]
  [engine=claude|codex|grok|cursor|agy|opencode|hermes|kimi|pi|mixed]
  [models=orchestrator:<tier>,worker:<tier>,advisor:<tier>,reviewer:<tier>]
  [effort=<level | role:level map>]
  [isolation=worktree|branch|off]
  [trigger=once|goal:"<stop condition>"|interval:<t>|schedule:"<cron>"]
  [workers=N] [budget=<cycles|agents|tokens>] [confirm=on|off] [alias=<saved-preset>]
```

Selection priority: explicit `strategy=` > `alias=` from [config.yaml](config.yaml) >
[auto-triage](references/triage.md) > ask. Ask only when triage signals genuinely conflict.

## Route before acting

1. Reject orchestration when the coordination cost exceeds the expected benefit.
2. Resolve the host and its available primitives before choosing a strategy.
3. Select one strategy and record all resolved dimensions in `.orchestrate/run.md`.
4. Read the selected strategy plus only the supporting routes its roles and gates require.
5. Never preload the entire reference library.

### Strategy route

| Strategy | Use when | Read | Contribution |
|---|---|---|---|
| **staged** *(default)* | Mostly independent plan tasks need fresh implementation and ordered dual review | [Staged](references/strategy-staged.md) | Sequential task cycle, fix-wave rules, and merge gate |
| **parallel** | Tasks share no files and can run concurrently in isolated worktrees | [Parallel](references/strategy-parallel.md) | Partition, fan-out, integration, and overload behavior |
| **hierarchical** | Work is too broad for one context and needs domain sub-orchestrators | [Hierarchical](references/strategy-hierarchical.md) | Domain decomposition and delegated controller hierarchy |
| **team** | Workers must message, debate, or coordinate across layers | [Team](references/strategy-team.md) | Shared-context team protocol and host degradation |
| **workflow** | Large deterministic fan-out should be held by a script rather than model memory | [Workflow](references/strategy-workflow.md) | Pilot, budget, batch, verify, and aggregation procedure |
| **loop** | Work repeats until a verifiable goal or scheduled condition is met | [Loop](references/strategy-loop.md) | Bounded cycle, stop condition, kill switch, and evolution pass |
| **advisor** | Expensive reasoning should be separated from cheaper execution | [Advisor](references/strategy-advisor.md) | Consultation cadence and advisor/executor contract |
| **adversarial** | A high-stakes plan deserves independent challenge before execution | [Adversarial](references/strategy-adversarial.md) | Debate roles, synthesis, and hardened plan |
| **xcli** | External coding CLIs act as workers, peers, or second opinions | [External CLIs](references/strategy-xcli.md) | Verified CLI invocation, isolation, monitoring, and result capture |

Strategies compose through dimension overrides: `strategy=staged engine=codex`,
`strategy=loop topology=parallel`, or `strategy=parallel review=panel:3`.

### Shared route

| Condition | Read | Contribution |
|---|---|---|
| Any non-reference host or uncertain primitive | [Hosts](references/shared-hosts.md) | Host detection, primitive binding, and honest degradation |
| Before the first multi-agent dispatch | [Flight plan](references/shared-flight-plan.md) | Rendered topology plan, approval gate, and tweak loop |
| Every dispatched task | [Contracts](references/shared-contracts.md) | Brief, status, report, findings, and workspace schemas |
| Any review-enabled run | [Review gates](references/shared-review-gates.md) | Ordered spec/quality gates and panel behavior |
| Any role or engine selection | [Model routing](references/shared-model-routing.md) | Explicit model tiers, cost posture, and drift verification |
| Any external-CLI dispatch | [Engines](references/shared-engines.md) → one block: [codex](references/engine-codex.md) · [grok](references/engine-grok.md) · [claude](references/engine-claude.md) · [cursor](references/engine-cursor.md) · [agy](references/engine-agy.md) · [opencode](references/engine-opencode.md) · [hermes](references/engine-hermes.md) · [kimi](references/engine-kimi.md) · [pi](references/engine-pi.md) | The cross-engine session/receipt/cap map, then the one engine's verified invocation block |
| Any external-CLI launch, resume, or quota stall | [Lane hygiene](references/shared-lane-hygiene.md) | Flag probing, wrapper launches, resume-by-id, stall recovery, usage receipts |
| More than one writer | [Isolation](references/shared-isolation.md) | Worktree/branch rules and integration ownership |
| Background, long-running, or external work | [Monitoring](references/shared-monitoring.md) | Polling, liveness, timeout, and recovery rules |
| Every run | [Safety rails](references/shared-safety-rails.md) | Main-branch, overload, loop, budget, and reward-hacking guards |
| Resume, compaction, or controller transfer | [Handoff](references/shared-handoff.md) | Durable state and clean controller handoff |
| Every dispatch and returned report | [Token economy](references/shared-token-economy.md) | Role-scoped communication blocks and priming anatomy |

### Prompt route

| Role | Read | Contribution |
|---|---|---|
| Implementation worker | [Implementer](references/prompt-implementer.md) | Executable task brief and dense report contract |
| Spec reviewer | [Spec reviewer](references/prompt-spec-reviewer.md) | Requirement-compliance review prompt |
| Quality reviewer | [Quality reviewer](references/prompt-quality-reviewer.md) | Maintainability and correctness review prompt |
| Integration owner | [Integrator](references/prompt-integrator.md) | Cross-worktree merge and conflict-resolution prompt |
| Domain sub-orchestrator | [Sub-orchestrator](references/prompt-sub-orchestrator.md) | Delegated planning, dispatch, and summary contract |
| Advisor | [Advisor prompt](references/prompt-advisor.md) | Bounded consultation prompt |
| Triage assessor | [Triage assessor](references/prompt-triage-assessor.md) | Independent strategy-assessment prompt |
| Verification-only worker | [Verifier](references/prompt-verifier.md) | Minimal objective verification prompt |
| Adversarial planner | [Planner debate](references/prompt-planner-debate.md) | Independent proposal and challenge prompt |
| Loop evolution pass | [Evolve](references/prompt-evolve.md) | Periodic pattern extraction and process-improvement prompt |

## Dimensions

| Dimension | Values | Default |
|---|---|---|
| `topology` | solo · staged · parallel · hierarchical · team · workflow · loop | selected strategy |
| `planning` | none · plan-first · interview · adversarial | plan-first |
| `review` | off · spec · quality · dual · panel:N · consensus:N | dual |
| `engine` | claude · codex · grok · cursor · agy · opencode · hermes · kimi · pi · mixed | host-appropriate |
| `models` | advisor · orchestrator · reasoner · worker · reviewer · peer tier map | model routing |
| `effort` | per-host reasoning levels (e.g. low · medium · high · xhigh · max) | pinned per dispatch where the surface supports it; else session effort, recorded |
| `isolation` | none · worktree · branch | worktree for multiple writers |
| `trigger` | once · goal · interval · schedule | once |
| `budget` | max cycles · agents · tokens · open PRs | selected strategy |
| `confirm` | on · off | on for any multi-agent dispatch; headless prints the plan and proceeds |

## Universal rules

1. **The controller coordinates; subagents work.** Do not silently implement a failed task in the
   controller. Fix the brief, model, context, or worker and re-dispatch deliberately.
2. **Artifacts on disk are the interface.** Keep briefs, reports, findings, raw logs, and ledgers in
   `.orchestrate/`; do not rely on chat memory.
3. **Pin a model on every dispatch.** An omitted model may inherit an unintended expensive default.
4. **Enforce typed gates.** When dual review is enabled, spec review precedes quality review.
5. **Ledger before memory.** Append progress after every gated unit; on resume, trust the ledger and
   repository state over recollection.
6. **Keep safety rails active.** Never begin on main/master without consent; cap loops and open work;
   on overload resume or nudge the existing agent rather than spawn a duplicate.
7. **Prime with pointers, work silent, report dense.** Preserve required safety and coordination
   messages while eliminating routine narration and raw output dumps.
8. **Do not orchestrate small coupled work.** If one agent can complete the task efficiently within
   one coherent context, use solo execution and optionally one reviewer.
9. **No silent launch.** Before the first multi-agent dispatch, print the flight plan — the
   topology, models, gates, and budget the user is about to pay for — and gate on their approval
   ([flight plan](references/shared-flight-plan.md)). `confirm=off` skips the gate, never the
   print; headless runs print and proceed.

## Core workflow

1. Inspect the task, plan, repository state, host capabilities, and stop condition — and the
   repo's project memory when it keeps one (`board init` names it): one `ctx context --scope`
   packet per scope, pinned in the briefs, so the run starts from what earlier runs learned.
2. Resolve strategy, dimensions, roles, models, budget, isolation, review, and degradation.
3. Initialize `.orchestrate/` with [workspace](scripts/workspace); record the resolved run with
   [board](scripts/board) — `board init PLAN --strategy … --goal "…"` writes the `## Resolved`
   block of `run.md` and queues every planned task; prose (the why) goes below the block. **An
   existing `.orchestrate/` with work in it is adopted, never restarted**: `board init … --resume`
   starts or continues the journal over the ledger and reports that are there (a workspace from
   an older skill included — `board check` says "predates the journal"); a bare `init` refuses,
   and only `--fresh` archives unfinished work on purpose. Re-resolve a dimension with `board set key=value`, never by editing; declare
   the board's lanes when the shape has more stages than the five defaults (`--lanes`).
4. Create task briefs with [task-brief](scripts/task-brief) and validate them with
   [brief-check](scripts/brief-check).
5. Render the flight plan from the resolved record (`board plan --why "…"`) and gate on the
   user's approval ([flight plan](references/shared-flight-plan.md)); apply any tweaks by
   re-resolving that dimension and re-asking; record the outcome (`board plan approved`).
6. Dispatch only ready work, and journal it: every dispatch and return (`board dispatch N
   --model M` names the agent `<role>-<task>` for you — `impl-3`, `lead-1`, `impl-1.1` — and
   `board return N --agent …` closes it; a subprocess lane is one command, `board launch N --agent --engine --model
   [--after M] -- brief.md`, which sleeps in the shell until task M's work is on disk, journals
   its exit and receipt, and never starts its engine if that work cannot land), every gate
   (`board review` / `board gate` / `board vote`), every machine check (`board exec N --name
   tests -- <cmd>`), every recovery (`board nudge` / `board escalate`). Agents talk through the
   journal, never mid-turn: `board send` / `inbox` / `wait` — information and questions only,
   capped, loop-proof; `board learn N "…"` is a worker's one-line discovery, handed to its team
   at their next board call together with any decision you recorded since their dispatch;
   dispatch parallel workers with `--owns` so `board peers` tells each one
   who else is working. Monitor without duplicating agents: `board attention`, `board inbox
   --agent controller`, `board check`, and one blocking `board wait --task N --timeout 0` in a
   background shell per landing you wait on (exit 3 = it cannot land). Integrate through the
   selected strategy's owner.
7. Package review evidence with [review-package](scripts/review-package), enforce configured gates,
   and send failures back to the correct worker or owner.
8. Close each gated unit with `board done N` (it writes the ledger line; refused over a failed
   gate or check); `board check --finish` must be clean and `board finish --gate pass|fail --evidence`
   recorded before you finish or hand off (`board resume` is the handoff's state layer, with a
   receipt; `board postmortem` feeds the evolve pass; `board memory` renders the run as one
   project-context record when the repo keeps project memory). Finish only when the stop
   condition is verified.

Use [toolbox](scripts/toolbox) to inventory available tools once and reuse the recorded result.
The journal (`.orchestrate/journal.jsonl`) is the run's spine and the board a view over it, never
a second record; `board --help` is grouped by role — the controller records transitions, workers
only observe (`board note` / `exec --agent <you>` / `learn` / mail; a read-only lane prints the
line to carry in its return instead of failing), the user watches from a pane of their own (`board`).

## Artifact contract

Every run owns `.orchestrate/run.md`, `journal.jsonl`, `progress.md`, task briefs, worker reports, review findings,
and any raw evidence required to reproduce a gate. Record resolved dimensions, exact role/model
assignments, budgets, branch/worktree ownership, decisions, failures, and the verified stop
condition.

## Completion and handoff

Complete only when every in-scope task has a terminal status, required reviews passed, integration
is verified, temporary worktrees or processes are accounted for, and the goal or one-shot stop
condition is satisfied. On interruption or controller transfer, emit the durable handoff defined in
[shared handoff](references/shared-handoff.md); never force the next controller to reconstruct state
from chat.
