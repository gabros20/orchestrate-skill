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

## Contents

- When the gate fires · The format · Shape per strategy · Rendering per surface · Honest budget line

No silent launch: the user sees the design BEFORE the fleet exists, in the shape they could tweak.
**The user cannot see tool output.** Agents treat it as already shown (observed in 5 of 5 real runs:
`board plan | tail -25`, then `plan approved --msg "plan printed"`). So the whole block goes into
your reply — never piped through head/tail, never summarized — and `board dispatch` / `launch`
refuse while the plan is pending. The plan ends with a `board: ↑ …` relay line saying exactly this.
The flight plan is `run.md` RENDERED, never a second source — `board plan --why "<triage pick>"`
renders it from the `run` record `board init` wrote (the same record the board's header shows),
and the outcome is recorded with `board plan approved|changed|skipped [--msg why]`, which
appends it to `run.md`'s Resolved block. Add lines the renderer cannot know (a domain-specific
node, a deliberate cost posture) beneath the printed tree — never retype the tree by hand.

## When the gate fires

- **Interactive, about to dispatch >1 agent or any writer** → show the plan, then gate with the
  host's ASK_USER binding (`shared-hosts.md`) — one question: approve, or name a change. On Claude
  Code, `board plan --ask` prints the AskUserQuestion payload whose Approve option previews the
  whole plan, so the question cannot arrive without it.
- **`confirm=off`** (dimension or alias) → show the plan, record `board plan skipped --msg "confirm=off"`,
  launch. The question is skippable; the showing is not — the user can still interrupt.
- **Headless (`-p`)** → put the plan in the output and proceed: a gate that cannot render
  must not hang the run (several hosts auto-answer or suppress questions headless).
- Re-triage mid-run (scope expansion) → the NEW plan goes through the gate again; a changed
  design is a new launch.
- **Prepare's scout** (`shared-prepare.md` P4) dispatches before the run's plan exists: its lanes,
  models and budget are announced as their own question inside a clarify round, and the yes is its
  approval (`board plan approved --msg "scout"`). The run's own flight plan follows after triage.

## The format — topology tree + change keys (three blocks, plain Unicode, ≤ ~22 lines)

1. **Header**: `strategy=<x>` + the triage pick's one-line why, and the originally stated goal
   verbatim (the same line the final-deliverable gate will judge against); then one posture line
   with kind, prep, and how many decisions the user made in clarify and how many were assumed
   (headless), so assumptions are checked before the fleet exists.
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
   `tools` — the run's toolchain from Prepare (`board set tools=…`): which tool serves which need,
   free first, any approved paid fallback named ·
   `replan` — the architect a `DESIGN_CONFLICT` would get ·
   `change` — the numbered keys. `--full` adds the `mail` (checkpoint delivery) and `board` (open
   the live kanban) lines; a run with nothing left prints "nothing left to run" and no price.

Change keys number the standard dimensions — `[1] strategy [2] models [3] effort [4] engine
[5] review [6] isolation [7] budget [8] lanes [9] posture [10] tools` — plus strategy-specific extras
as `[11]+`.
The header prints the **posture** (frontier · balanced · economy) and which catalog column unpinned
roles took (`shared-model-catalog.md`). A "change N …"
answer re-resolves that dimension, reprints ONLY the changed lines, and re-asks; approval
dispatches. This block layout is a format contract (like the report line shapes), kept stable so
users can read any run's plan the same way.

## Shape per strategy (same three blocks; the tree adapts)

- **parallel / hierarchical / team** — the literal spawn tree: workers, sub-orchestrators, or
  teammates as children; the integrator or lead as the last node. A hierarchical build shows each
  lead's loop (parallel waves, worktrees, gates per task, domain integration) and the integrator
  that merges the domain branches.
- **research** (`kind=research`) — one researcher node per source lane (read-only, its lane file),
  the synthesizer, and the final-deliverable gate as the fact-check of the load-bearing claims;
  per-lane gates only when `review` is not off.
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

## Rendering per surface

Same record, three forms — pick by what the host renders, then paste ALL of it:
- **Terminal** (Claude Code CLI, Codex, Grok, Kimi, opencode): `board plan` inside a ```` ```text ````
  fence (monospace keeps the tree aligned), then "Approve, or change N …".
- **App** (desktop/web, IDE panels, Antigravity): `board plan --format md` as-is — a roles table, the
  tree in a fence, footer bullets, a bold **Approve?** line. Never the text form outside a fence.
- **Claude Code question**: `board plan --ask` → pass its JSON to AskUserQuestion unchanged.

## Honest budget line

Count agents from the actual plan (tasks × roles + gates + integrator/final gate). `board plan`
prices that tree from receipts — per-tier p50/p90 of every `--tokens` return in archived runs —
so the band is evidence, not a guess, and improves with every journaled receipt; without
receipts fall back to the multipliers this pack carries (single tool-using agent ≈ 4× a chat
interaction, multi-agent ≈ 15× — `shared-token-economy.md`, honest numbers). If the estimate
crosses a stated budget or an alias cap, say so ON the budget line — the flight plan is where
cost surprises are supposed to die, not the ledger afterwards.
