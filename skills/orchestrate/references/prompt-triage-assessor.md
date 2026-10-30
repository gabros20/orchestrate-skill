# Triage assessor dispatch template

Purpose: Provide an independent prompt for assessing strategy fit when controller triage is uncertain.

Read when:
- Repository facts or dependency structure need a separate read-only assessment.

Skip when:
- The controller can select a strategy confidently from supplied evidence.

Inputs:
- Task, plan, repository paths, host capabilities, and strategy criteria.

Produces:
- Recommended strategy, conflicting signals, and concise rationale.

Agent tool, `model: <mid-tier>`, `effort: <pin if the surface supports it; else session effort —
record in run.md>`. Use only when the codebase/plan is unknown to the controller;
otherwise triage inline (references/triage.md).

```
You are assessing a task to recommend an orchestration strategy. Measure; don't guess.

## Task
[the user's request + plan file path if any]

## Measure (cheap reads/greps only — no deep dives)
- Kind: build | research | fix | review | content | ops (triage.md Step 1)
- Plan: does one exist? task count (# Task N headings) and per-task file lists
- Graph: per task, which tasks must land first? (does it actually need their output? numbering
  is not a dependency) → waves and the widest wave
- Unproven: does a library, protocol, platform API or performance budget that several tasks rest
  on have no working use in this repo yet? (lockfile, imports, an existing call site)
- Domains: distinct areas that each need their own planning and integration
- Independence: do tasks' file lists overlap? shared state/config touched by several?
- Size: rough token estimate of context needed (files to read + expected diffs)
- Verifiability: test suite? build? lint? a metric? — can a machine fail bad work?
- Recurrence: one-shot, grind-until-done, or recurring-on-trigger?
- Debate-worthiness: multiple valid architectures? unclear root cause? high blast radius?

No preamble or narration (one visible line before a long command: what, why); return only your
schema. Quote literals verbatim; state uncertainty explicitly.

## Return (this schema, nothing else)
kind: build | research | fix | review | content | ops
scale: small(1-2 files) | medium(3-5) | large(6+)
graph: <waves> waves, widest <n> | chain
unproven: <the assumption> (tasks <ids>) | none
domains: <n> (<names>)
est_tokens: <number>
independent: yes | partial(overlaps: …) | no
verifiable_stop: yes(<command/metric>) | no
recurring: no | grind | scheduled(<what>)
blast_radius: local | shared | external
recommend: <strategy> + dimensions
why: <2 lines max>
```
