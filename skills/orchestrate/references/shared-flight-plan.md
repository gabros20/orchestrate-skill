# Flight plan — print the design, gate on approval, then dispatch

Purpose: Render the resolved orchestration design for the user and obtain approval before the first dispatch.

Read when:
- A run is about to dispatch more than one agent, or any code-writing worker.

Skip when:
- The run is solo or single-reviewer — the gate's overhead exceeds its value there.

Inputs:
- Resolved dimensions from `run.md`, task cards or briefs, the model + effort map, the budget estimate, and the host's ASK_USER binding.

Produces:
- A printed flight plan, a recorded approval or skip reason, and possibly re-resolved dimensions.

No silent launch: the user sees the design BEFORE the fleet exists, in the shape they could tweak.
The flight plan is `run.md` RENDERED, never a second source — every line is read back from the
resolved record, and the outcome (approved / changed / skipped and why) is appended to `run.md`.

## When the gate fires

- **Interactive, about to dispatch >1 agent or any writer** → print the plan, then gate with the
  host's ASK_USER binding (`shared-hosts.md`) — one question: approve, or name a change.
- **`confirm=off`** (dimension or alias) → print the plan, launch immediately. The gate is
  skippable; the print is not — the user can still interrupt.
- **Headless (`-p`)** → print the plan into the output and proceed: a gate that cannot render
  must not hang the run (several hosts auto-answer or suppress questions headless).
- Re-triage mid-run (scope expansion) → the NEW plan goes through the gate again; a changed
  design is a new launch.

## The format — topology tree + tweak keys (three blocks, plain Unicode)

1. **Header**: `strategy=<x>` + the triage pick's one-line why, and the originally stated goal
   verbatim (the same line the final-deliverable gate will judge against).
2. **Topology tree**: one node per agent that will exist; `├─`/`└─` nesting shows who spawns
   whom. Each node line carries: role · assignment (card/task/domain) · `model @ effort` ·
   isolation (worktree name, shared tree, or subprocess engine). Review gates appear as child
   lines of what they gate; the final-deliverable gate appears once, last.
3. **Footer strips**, one line each:
   `gates` — which gates run, and the fan-in expectation (returns counted against dispatches) ·
   `rails` — branch, isolation, PR cap, notable active protections ·
   `budget` — agent count and an estimated token RANGE (never a precision you don't have) ·
   `tweak` — the numbered keys.

Tweak keys number the standard dimensions — `[1] strategy [2] models [3] effort [4] engine
[5] review [6] isolation [7] budget` — plus strategy-specific extras as `[8]+`. A "change N …"
answer re-resolves that dimension, reprints ONLY the changed lines, and re-asks; approval
dispatches. This block layout is a format contract (like the report line shapes), kept stable so
users can read any run's plan the same way.

## Shape per strategy (same three blocks; the tree adapts)

- **parallel / hierarchical / team** — the literal spawn tree: workers, sub-orchestrators, or
  teammates as children; the integrator or lead as the last node.
- **staged / loop** — the tree shows the REPEATING unit once (implementer → spec ✓ → quality ✓)
  with `×N tasks` or `×≤N cycles` on the header line; Finish / goal-met close the tree.
- **workflow** — phases as nodes with per-phase agent counts and models (`find ×5 · verify ×3
  per finding`), plus the pilot slice named first.
- **advisor** — the lanes (executor · advisor · reviewer) with the consult budget on the advisor
  node; Variant C shows its routing lanes instead of a fixed worker.
- **adversarial** — planner vs counter with their lineages and the round cap, then the execution
  tree the consensus plan hands off to.
- **xcli lanes** — the engine sits in the node line (`codex terra @ high · spec file · empty-diff
  check`).

## Honest budget line

Count agents from the actual plan (tasks × roles + gates + integrator/final gate). State tokens
as a range derived from the multipliers this pack already carries (single tool-using agent ≈ 4×
a chat interaction, multi-agent ≈ 15× — `shared-token-economy.md`, honest numbers). If the
estimate crosses a stated budget or an alias cap, say so ON the budget line — the flight plan is
where cost surprises are supposed to die, not the ledger afterwards.
