# Handoff — compacting a dying context into a fresh one

Purpose: Transfer or resume an orchestration run from durable state without replaying chat.

Read when:
- The controller changes, context compacts, work pauses, or another session resumes the run.

Skip when:
- The same controller completes the one-shot run without interruption.

Inputs:
- Run record, progress ledger, git state, open workers, pending gates, and blockers.

Produces:
- A resumable handoff with exact next action and cleanup obligations.

When a stage's context is nearly spent (or you're partitioning work across fresh sessions), write
a handoff FILE and re-dispatch fresh. Never let a degraded context keep driving.

## Principles

1. **State, not instructions** — "logout endpoint is not yet implemented", never "implement
   logout next". The fresh agent decides actions; you give ground truth.
2. **Reference, don't duplicate** — point to briefs/reports/ledger/ADRs/PRs by path; re-embedding
   them makes the handoff stale and bloated.
3. **Capture the WHY** — decisions made and approaches REJECTED (with reasons) are the least
   recoverable information. Traps & dead ends save the successor from re-paying them.
4. **Trust nothing blindly** — frame claims as context to verify against code, not facts.
5. **Redact secrets**; reference where credentials live, never values.
6. **Be ruthless** — cut anything the next agent can trivially get from the code, the ledger, or
   project config.

## Template (`.orchestrate/handoff-<stage>.md`)

```
# HANDOFF: <title>          Session focus: <one line>
## Goal                     (1–3 sentences, the north star)
## Current state            DONE / PARTIAL / NOT STARTED — as status, not actions
## Key decisions (why)      chose X over Y because …
## Traps & dead ends        tried A — failed because …; do NOT do B
## Files & pointers         path:lines — what's there; ledger; reports; PRs
## Open work                remaining state + dependency order (not a command list)
## Prompt for the fresh agent
   Declarative background. End with: read every file listed above before acting;
   verify claims against the code; then wait for instructions.
```

## Probe-test before trusting it

After writing a handoff (or any compaction summary), probe it: can it answer — *which files
changed, at which revision? what was the original error? what's the next open item? what must
not change?* — from its own text + pointers? If not, regenerate. Artifact-trail loss is the
measured worst failure mode of compression.

## In this skill

- The ledger (`progress.md`) already carries per-task state — the handoff adds the WHY layer and
  cross-task context the ledger doesn't hold. `board resume` GENERATES the state layer in this
  template's order (goal, state per task, open-stint locators, decisions, probed pointers, open
  work, cleanup) from the journal and the disk, marks every claim no artifact backs `NOT_PROVEN`,
  prints the engine's resume-by-id line for every open subprocess lane that journaled a session,
  and ends with a **receipt** — HEAD, the journal cursor (seq + hash), tokens per accepted task
  and a receipt hash — so a successor can tell a stale handoff from a current one. Start from it,
  add the WHY and the traps, then probe-test.
- A successor arriving with a newer skill: `scripts/workspace` refreshes the zero-install
  `.orchestrate/board`; `board check` names a workspace that predates the journal; `board init
  PLAN --resume …` adopts it (ledger and reports kept, journal started, pre-journal history
  `inconclusive` under `--replay`) — never a bare `init`, which is refused over live work.
- Sub-orchestrators and long loop runs should write a handoff at budget exhaustion as part of
  stopping cleanly (`shared-safety-rails.md`).

## Across runs — project memory

A run's workspace is archived by the next kickoff; what it learned is not, unless the repo keeps
project memory (`.agent/PROJECT_CONTEXT.jsonl`, the `project-context` skill — any tool reads and
writes it). Orchestrate never depends on it and never runs `ctx`; it composes when the files are
there and stays silent when they are not:
- **Kickoff** (`board init` prints the line): the CONTROLLER pulls one bounded packet per scope
  (`ctx context --scope <x> --budget 1500 > .orchestrate/memory-<x>.md`, plus `ctx attempts
  --outcome failed`) and pins it in the briefs — past decisions, failed approaches and gotchas
  reach every worker as pointers. Workers never call `ctx`: a linked worktree has no ledger.
- **Finish or handoff** (`board finish` / `board resume` print the line): `board memory --out
  .orchestrate/memory.json` renders the run as ONE record — an observation when the final gate
  stands, else a handoff — with decisions and their why, failed attempts (`learn --kind failed`,
  BLOCKED/REFUSED returns), learnings, commits, verification and the frontier; then `ctx append`
  or `ctx handoff --agent orchestrate --session-id <run> --input …` records it. The record's
  `task.id` is the run id, so a run is one entry the next run or the next tool can recall.
