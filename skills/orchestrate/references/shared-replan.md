# Replan — when reality breaks the plan

Purpose: Turn a failed plan assumption into a redesign or a user decision, never a workaround.

Read when:
- A worker returns `DESIGN_CONFLICT`, or BLOCKED returns repeat on one theme.
- A review finds a patch around the design.

Skip when:
- The failure is local: a thin brief, a missing file, a flaky tool (`shared-contracts.md` ladder).

Inputs:
- The conflict report(s), the design doc and plan, what is built, decisions and rails.

Produces:
- A triage verdict, an architect pass or a user question, recorded decisions, a revised plan.

## The rule

A plan is a hypothesis. When reality contradicts it, the design changes — the code never routes
around it. A **patch** is: special-casing one path, duplicating logic instead of changing its
owner, bypassing an interface, reaching into private state, suppressing an error or a test,
runtime patching (monkey patches), a flag that routes around the design. Each hides the flaw and
taxes every later task; fixing the foundation costs more with every task built on it.

## Who owns the conflict

| Topology | Worker's conflict goes to | Resolves it | Passes it up when |
|---|---|---|---|
| staged · parallel · xcli · loop | controller | controller | — |
| hierarchical | its lead (`--by`) | the lead, inside its domain | it crosses a domain or a shared interface: the lead returns DESIGN_CONFLICT |
| team | controller (`board send --ask`) | controller | — |
| workflow script | its verify stage | controller, after the run | always — a script never redesigns |
| advisor | the advisor, one consult | advisor | the plan must change: controller |

## Triage (the controller, or a lead inside its domain)

1. **Brief** — the plan holds, the brief was wrong or thin: fix the brief, re-dispatch.
2. **Design** — a plan assumption fails and more than this task rests on it (an interface, the
   data model, a library's real behavior, performance, a missed edge case): architect pass.
3. **Product** — any option changes what users see, business logic, scope or a public
   contract: the user decides; the architect may run first to lay out the options.
Unsure between 2 and 3 → 3.

## The architect pass

Fresh context beats the controller's: the controller is anchored on the plan that failed and
carries run noise. `board dispatch N --role architect --model <strongest> --effort high|max`
(agent `arch-N`) with [prompt-architect.md](prompt-architect.md) and a packet: design doc + plan
paths, every conflict report on this theme, what is built (commits, interfaces, tests), what is
queued, decisions and rails, budget left. Model: the catalog's architect row for the run's posture
(`shared-model-catalog.md`; the flight plan prints it). The architect writes a delta; it never implements.

## Apply

1. Pause what rests on the old design: ONE nudge to running lanes on it (stop at a safe point);
   gated lanes on the task already refuse to start; dispatch no dependents.
2. `board decide D-n "…" --why "…" --task N` per decision — re-deciding an id supersedes it and
   every running worker gets it at its next board call (`(revised)`). The board keeps the
   conflict open until a decision names the task or the task is re-dispatched.
3. Update the design doc and plan; `board todo` new tasks; a refactor of built work is its own
   task with its own review — never folded into a feature task.
4. Re-brief, re-dispatch.

## Bounds

- Two architect passes per run without the user (`REDESIGN_CAP`); the third is a `board check`
  finding until a decision `--owner user` lands.
- A pass must change something — a decision, a plan delta, a task. "Keep going" is no redesign.
- The same conflict after a redesign → the user, with both reports.
- Foundation first: the change that fixes the core beats one that works at the edges.
