# Contracts — typed returns, ledger, cards

The interface between any two agents is an artifact on disk, never the conversation. Everything
pasted into a dispatch or printed back stays resident in the controller's context forever — so
briefs and reports are FILES, and chat returns are capped summaries.

## Status enum (every worker, every strategy)

`DONE` · `DONE_WITH_CONCERNS` · `NEEDS_CONTEXT` · `BLOCKED`
Never silently produce unsure work — that's what DONE_WITH_CONCERNS and BLOCKED are for.
Controller handling: DONE → gate. CONCERNS → read report; correctness/scope → address first.
NEEDS_CONTEXT → supply + re-dispatch same model. BLOCKED → ladder (context → stronger model →
split task → human). Never re-dispatch unchanged.

## Chat-return schemas (what comes back INLINE — keep it tiny)

| Role | Returns (max) |
|---|---|
| implementer | <15 lines: Status · commits · 1-line tests · concerns · report path |
| reviewer | verdict first (✅/❌/⚠️) · issues as Critical/Important/Minor + file:line · assessment |
| verifier | `works|broken` · expected · observed · evidence path |
| sub-orchestrator | <1500 tokens: verdict · findings summary · artifact paths |
| parallel worker | verdict first, <1000 tokens: branch/PR ref · report path |
| triage assessor | scale · independence · verifiability · recommended strategy + why |

## Workspace files (`.orchestrate/`, via `scripts/workspace`)

- `run.md` — resolved dimensions, budget, task, timestamp (written at kickoff)
- `task-N-brief.md` / `task-N-report.md` — per-task handoffs (report named off brief)
- `card-<k>.md` — parallel task cards
- `review-<b7>..<h7>.diff` — review packages
- `progress.md` — THE LEDGER (below)
- `loop-<name>.md` — loop contracts

## The ledger (`progress.md`)

One line per gated unit, appended only after the gate passes:
```
Task 3: complete (commits a1b2c3d..e4f5a6b, review clean)
Card api: merged (gate: contract tests green)
Cycle 7: shipped PR #142 (verifier: works, evidence/run7.png)
```
Resume rule: on any restart/compaction, `cat progress.md` + `git log` are the truth; recollection
is not. The single most expensive observed failure is re-dispatching completed work. `git clean
-fdx` destroys the workspace → reconstruct from `git log`.

## Task cards (parallel/team writers)

```
Objective · Owned files (exclusive) · Requirements · Interface contract ·
Acceptance criteria · Out of scope · MERGE GATE: <exact integration precondition>
```
State advances only when the exit artifact exists; merge-readiness is judged by the gate, not by
anyone's assessment. Blocked cards carry an owner + next action or they're not "blocked", they're
abandoned.
