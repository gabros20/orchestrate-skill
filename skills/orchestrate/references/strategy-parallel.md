# parallel — worktree-isolated fan-out with an integrator

Purpose: Fan independent tasks out to isolated workers and integrate their results safely.

Read when:
- Tasks share no files or can be partitioned into non-overlapping ownership.

Skip when:
- Workers need shared mutable state or unresolved contracts between their tasks.

Inputs:
- Partitioned task cards, worker count, isolation mode, integration owner, and review mode.

Produces:
- Concurrent worker results, integration sequence, conflicts, and gated merge.

Preset: `topology=parallel review=dual isolation=worktree workers=3..5`.
N workers execute independent tasks simultaneously, each in its own git worktree; an integrator
merges. Physical isolation prevents file conflicts, NOT logical ones — partitioning does that.

Read with this file: `shared-isolation.md`, `shared-contracts.md`, `shared-review-gates.md`.
Prompts: `prompt-implementer.md` (per worker), `prompt-integrator.md`.

## Gate: is parallel actually right?

Decision tree (run it, don't skip it):
```
multiple independent problems?
  no  → one agent sees everything (solo/staged)
  yes → do they share files or mutable state?
          yes → sequential (staged) — or repartition until they don't
          no  → parallel
```
The cheap first cut is the **fake-edge test**: does this step actually need the previous step's
output? No edge → no wait → it can run concurrently; the file-overlap check answers the other
half. Then partition along ONE axis — by layer, by component, by concern, or **by file ownership**
(strongest for writers: each worker owns an exclusive file set, written into its brief).

## Task cards (narrow contracts)

Each worker gets a card in `.orchestrate/card-<k>.md`:
```
Objective · Owned files (exclusive) · Requirements · Interface contract (what other tasks expect)
Acceptance criteria · Out of scope · MERGE GATE: <the exact condition allowing integration>
```
A card cannot advance without its artifact existing; merge-readiness is judged **by the gate, not
vibes**. Return contract per worker: verdict first, <1000 tokens, branch/PR ref + report path.
Dispatch each card with its ownership on the record (`board dispatch k --agent … --owns
"src/ui/**"`) and tell the worker it is not alone: `board peers --agent <you>` lists the other
open workers and what they own, so a worker that must touch a neighbour's area mails that
neighbour first (`board send --to <peer> "will change src/api/auth.ts — import path moves"`),
and one that needs an interface decision asks the controller (`--ask` + `board wait`) instead of
guessing. Mail is information; the card and the gate stay the contract. If you chose
`isolation=off` (two writers in one tree), the brief carries the derived rail the board prints:
commit by path, never `git add -A`.

## Flow

1. Partition — the CONTROLLER decides any cross-cutting design question up front and records it
   in `decisions.md` with an ID and owner (`shared-contracts.md`); no two cards may leave the
   same design question open → write cards (priming anatomy applies; pin `read:` pointers with
   `@ <sha>` — every worker gets its own worktree; run `scripts/brief-check` per card) →
   check no two cards own the same file (grep the lists; overlap → fix the partition or add an
   integrator-owned seam file both depend on).
2. Dispatch workers (single message, parallel tool calls), each with `isolation: worktree`, an
   explicit model, its card path, and the repo's gitignored `.env*` copied into the fresh worktree
   (a fresh worktree has none — builds fail mysteriously without it).
3. Workers implement/test/commit in their tree and return: PR-or-branch ref + summary. Ledger and
   knowledge writes stay with YOU, not the workers.
4. **Review per worker** (dual, as staged) — reviews can run as each worker finishes; don't barrier
   on the slowest worker before reviewing the fastest.
5. **Integrate**: dispatch the integrator to merge gated branches in dependency order, run the
   full suite after each merge. The integrator resolves collisions impartially on behalf of all
   parties FIRST — mechanical merges, and semantic ones it can settle from the cards/reports
   already on disk; it bounces back to the owning worker only when resolution needs that worker's
   INTENT, never hand-merged by the controller.
6. **Final-deliverable gate**: after integration, before the run reports done — one fresh-context
   review of the accumulated merged change set against the ORIGINALLY stated goal
   (`shared-review-gates.md`); per-branch gates cannot see drift across branches.
7. **Cleanup is mandatory**: `git worktree remove` each finished tree (a leftover pins its branch);
   verify `git worktree list` is clean; kill any per-worker dev servers. Before removal, anything
   still needed from a worktree's `.orchestrate/raw/` is cited (excerpt) in the task report or
   copied next to it (`shared-token-economy.md`).

## Limits & failure handling

- 3–5 workers is the sweet spot; scale only when work is genuinely independent.
- **One snapshot per batch**: every worker in a batch pins the same `@ <sha>` and the same
  revision of the shared records (`decisions.md`, plan, inventory). A mid-batch change to shared
  state is a re-dispatch decision, never a silent update (`shared-token-economy.md`).
- **Fan-in guard**: every merge or synthesis step counts returns against dispatches and refuses to
  synthesize on a partial set — `shared-monitoring.md` rule 3 catches one silent worker, this
  catches the aggregate, where a single dead worker slips into a report that looks complete. On
  wide runs, layer the fan-in: summarize in batches, then combine the summaries, so no synthesizer
  swallows N full reports at once.
- Worker BLOCKED → same escalation ladder as staged. On API overload NEVER spawn a duplicate
  worker for the same card — resume/nudge the one that exists (`shared-safety-rails.md`).
- Respect review bandwidth: don't open more PRs than the human can review; queue the rest.
- A worker that finished with an unchanged tree = its worktree auto-removes; still collect its
  report (a no-op result is information).
