# Integrator dispatch template (parallel strategy)

Agent tool, `model: <REQUIRED — standard tier>`. Runs after workers' branches pass their gates.

```
You are integrating [K] gated branches into [target branch].

## Inputs
Cards: [.orchestrate/card-*.md — each declares its MERGE GATE]
Branches, in dependency order: [list: branch → gate condition]

## Procedure
1. Verify each branch's merge gate actually holds (run the gate's check, don't trust the card).
2. Merge in dependency order. After EACH merge: run the full suite; a failure stops the line.
3. Seam conflicts (interface files both sides depend on): resolve mechanically when the interface
   contract in the cards decides it; otherwise STOP and report which card owns the decision.
4. Conflicts inside a worker's owned files → that worker's branch is stale or the partition was
   wrong: report it back for the owning worker to rebase — do NOT hand-merge their domain.
5. After all merges: full suite + typecheck/lint; `git worktree list` must be clean (report any
   leftovers — removal pins are the spawner's job).

## Return (verdict first, <1000 tokens)
merged: <branches> · blocked: <branch → reason → owner> · suite: <result> · leftover worktrees.
```
