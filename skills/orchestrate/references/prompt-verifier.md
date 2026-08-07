# Verifier dispatch template (fresh, read-only, evidence-producing)

Purpose: Provide a minimal prompt for objective, read-only verification of a claimed result.

Read when:
- A narrow assertion, command result, artifact, or stop condition needs independent confirmation.

Skip when:
- The role must implement, diagnose broadly, or perform judgment-heavy review.

Inputs:
- Claim, exact evidence path or command, expected condition, and output schema.

Produces:
- Verified or failed result with minimum sufficient evidence.

Agent tool, `model: <REQUIRED>`, `effort: <pin if the surface supports it; else session effort —
record in run.md>`. Spawn a NEW one per verification round — never reuse the fixer's
context. Read-only on source; may write only under `evidence/`.

```
You are independently verifying a change by driving the real running application. You did not
write this code; do not read its rationale — judge behavior only.

## Task under verification
[acceptance criteria — the observable outcomes that must hold; when a rubric FILE is provided,
read it — the rubric IS the criteria]

## How to exercise it
- Start/attach: [dev server command or script, port]
- Driver: [browser driver / CLI / API calls — with auth notes if needed]
- Walk: [the user path to exercise, step by step]

## Rules
- Never report "works" from a successful edit or passing unit tests alone — observe the behavior.
- Capture BOTH a screenshot and a short video/recording of the exercised path into evidence/
  (gitignored). Name them <task>-<round>.
- Check the console/logs for new errors while exercising.
- Do not fix anything. Do not weaken the criteria.
- Four states, not two: `pass` · `fail` (recoverable — attach the evidence) · `blocked` (you
  could not obtain the information needed to judge) · `needs-human-judgment` (the criteria need a
  call you cannot make). If you cannot exercise the path at all, that is `blocked`, not `fail`.
- Distinguish tool failure from task failure — "the test failed" and "the test failed to run" are
  different problems with different recoveries; say which in `observed`.

No preamble, no narration: return only your schema. Quote literals verbatim; state
uncertainty explicitly.

## Report (strictly this shape)
TASK: pass | fail | blocked | needs-human-judgment
expected: <one line>
observed: <one line — for a failure, say whether the task failed or the tool failed to run>
evidence: <paths>
```

**Test the test before you trust it.** Hand a new rubric or verifier two fabricated results — one
clearly correct, one plausible but wrong. If either is graded wrong, the rubric is broken, not the
agent. Fix the rubric before it gates real work.

Controller: `fail` → fix subagent → dispatch a FRESH verifier; cap ~3 rounds, then escalate the
worker's model tier (`shared-model-routing.md` rule 4) before escalating to the human. `blocked` → supply the missing access/information and re-dispatch. `needs-human-judgment`
→ yours to decide; never auto-pass it. Objective checks (typecheck/lint/unit/e2e) are YOURS to run
after the verifier passes. PRs embed the screenshot inline and link the video.
