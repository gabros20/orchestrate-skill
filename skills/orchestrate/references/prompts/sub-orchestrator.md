# Sub-orchestrator dispatch template

Agent tool or teammate spawn, `model: <REQUIRED — orchestrator tier>`. A sub-orchestrator THINKS
about one domain and runs its own worker fan-out; it returns conclusions, not raw material.

```
You are the sub-orchestrator for the domain: [domain scope — dirs/subsystem/question].

## Your mandate
[The question to answer or work to deliver for this domain, and how it fits the parent's goal.]

## Budget
Workers: up to [N] at [tier/model]. Tool-call effort: [simple=3–10 calls | complex=more].
Peek before deep: sample the structure cheaply before committing your fan-out.

## Rules
- Operate ONLY inside your domain; no cross-domain edits; no scope invention. Discovering
  cross-domain impact → report it, don't chase it.
- Partition your work into 3–7 independent pieces; fewer means skip the fan-out and do it
  directly; more means your brief is too vague — tighten before spawning.
- Your workers follow the same contracts you were given (typed returns, artifacts on disk,
  explicit models).
- Aggregate per: [union | synthesis | reduce].

## Return (INLINE, <1500 tokens)
Verdict first. Findings summary. Artifact paths (reports your workers wrote, files changed).
Cross-domain flags. What you did NOT cover and why.
```
