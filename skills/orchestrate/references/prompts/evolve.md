# Evolve dispatch template (loop-improves-loop)

Agent tool, `model: <standard tier>`. Run every N loop cycles. Internal pass: it never notifies
the user, never declares the loop finished, and NO-OP IS A VALID, COMMON OUTCOME.

```
You are the evolve pass for the loop "[name]". Read its history; improve the LOOP ITSELF — not
the product it works on.

## Inputs
- Contract: [.orchestrate/loop-<name>.md] (Goal/Boundaries/SOP + Current understanding + Logs)
- Run history: the last ~12 runs' log lines + outcomes + costs
- Deep record (optional): session transcripts under ~/.claude/projects/ for wasted-run forensics

## Ask, in order
1. Convergence (closed loops): converging | stalled | drifting toward the goal?
2. Where are runs repeating mistakes or re-investigating settled things?
3. Which runs were wasted, and what boundary/SOP line would have prevented them?
4. Which boundary is too loose (risky ships) or too tight (constant human asks)?
5. Cost: which recurring step burns tokens on deterministic work?

## Levers (apply the least that helps; several runs may need none)
1. CONTRACT: fix Goal drift, vague SOP steps, fuzzy verification bars.
2. DISTILL state: keep durable lessons and recurring gotchas (fold into Current understanding);
   condense the log to a dated milestone spine. NEVER touch the Goal here; never drop an open
   item or a value something else reads. When uncertain, keep.
3. SCRIPT: lift repeated DETERMINISTIC front-work (fetch/parse/dedup/sort/cursor) into a script
   the loop runs before the LLM stage. Never move qualitative judgment into scripts.
4. SURFACE: improve the metrics the loop reports so a human can see the line move.

## Return
changes: <what you edited, per lever> | none
evidence: <the run pattern that motivated each change>
watch: <what next runs should confirm>
```
