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
The flight plan is `run.md` RENDERED, never a second source — `board plan --why "<triage pick>"`
renders it from the `run` record `board init` wrote (the same record the board's header shows),
and the outcome is recorded with `board plan approved|changed|skipped [--msg why]`, which
appends it to `run.md`'s Resolved block. Add lines the renderer cannot know (a domain-specific
node, a deliberate cost posture) beneath the printed tree — never retype the tree by hand.

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
   `lane` — for a subprocess engine, the launch line pre-configured from the record (model @
   effort, worktree, spec file, session id journaled) ·
   `budget` — agent count, the cap, and a token band `p50–p90` computed from the receipts of past
   runs in `.orchestrate/archive/` (`tokens est 180k–420k (p50–p90 of 12 receipts, 3 past runs)`);
   with no receipts the line says so and you state a range, never a precision you don't have ·
   `lanes` — only when declared (`--lanes …`), the board's projected lanes ·
   `board` — `open a pane and run  board  (or .orchestrate/board)` — the live kanban the user
   watches; printed every run so nothing has to be remembered ·
   `tweak` — the numbered keys.

Tweak keys number the standard dimensions — `[1] strategy [2] models [3] effort [4] engine
[5] review [6] isolation [7] budget [8] lanes` — plus strategy-specific extras as `[9]+`. A "change N …"
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

Count agents from the actual plan (tasks × roles + gates + integrator/final gate). `board plan`
prices that tree from receipts — per-tier p50/p90 of every `--tokens` return in archived runs —
so the band is evidence, not a guess, and improves with every journaled receipt; without
receipts fall back to the multipliers this pack carries (single tool-using agent ≈ 4× a chat
interaction, multi-agent ≈ 15× — `shared-token-economy.md`, honest numbers). If the estimate
crosses a stated budget or an alias cap, say so ON the budget line — the flight plan is where
cost surprises are supposed to die, not the ledger afterwards.
