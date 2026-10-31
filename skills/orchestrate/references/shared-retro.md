# Retro — every run is data for the skill

Purpose: Turn a finished run (or milestone) into a versioned score and, when the skill or the board
got something wrong, a field report the user can file against this skill.

Read when:
- `board finish` is recorded, a milestone of a long run closes, or the user asks for a retro.

Skip when:
- The run was a single dispatch, or the user turned retros off (`retro: off` in the run's prose).

Inputs:
- The run's journal (`board score`, `board retro`), the board's friction log, and what you saw
  while running it.

Produces:
- The score in your closing report; at most one field-report draft in `.orchestrate/retro/`, filed
  only on the user's yes.

## Steps

1. `board retro` prints the score and the record's skill-level signals:
   - **Score.** Outcome, cost and calibration are what a change to the skill should move. Quality,
     discipline and communication explain them; they are never a goal on their own, because "fewer
     gate rounds" is also what a lenient reviewer produces.
   - **Signals.** Friction (refusals, usage errors and help reads, all from
     `.orchestrate/raw/friction.jsonl`), report≠return, drift, churn, miscalibration, a forced
     finish, open `check` findings.
2. **Sort every signal and every surprise of your own:**
   - **Project-local:** this repo's gotcha, a flaky test, a vague plan. It belongs in
     `board learn` / `board memory` and never in a report.
   - **Skill-level:** a rule that misled you, a template that left a gap, a board behaviour that
     was missing, wrong or confusing, a routing pick that failed for reasons beyond this repo.
   - **Test:** would it recur in a different repo on the same skill version? If not, it is
     project-local.
3. **No skill-level finding means no draft.** Put the score line in the closing report and stop.
4. **Otherwise, `board retro --draft`.** It writes `.orchestrate/retro/field-report-<run>.md` and
   never overwrites your edits. Then:
   - Fill each `<…>` line: what happened, likely cause, the smallest fix, and the metric it
     should move with a predicted direction. A report with no prediction cannot be checked
     later.
   - Prefer a board change or a deletion over new prose.
   - Delete the project-local signals.
   - Keep it shareable: no project code, file contents, secrets, private names or paths. Journal
     seq numbers and metric values are fine.
5. **Dedupe.** Run the `gh issue list … --search` line `retro --draft` prints. If an open issue
   matches, the draft becomes a comment on it; a closed one that recurs is evidence its fix did
   not work.
6. **Ask once, in your closing report:**
   - Show the draft whole: the user cannot see tool output.
   - File it only on an explicit yes, with the `gh issue create … --body-file` line `retro --draft`
     prints.
   - No `gh`, or no yes: the draft stays in `.orchestrate/retro/` for the user.

## Confidence (calibration)

Implementer reports and reviewer verdicts carry `Confidence: 0–1`, and the board reads that line
itself at `return` and `gate`. The two claims mean different things:

- **An implementer's confidence:** that the attempt passes review with no fix wave.
- **A reviewer's confidence:** that the pass verdict holds, meaning no later check on the task and
  no later gate of its kind fails.

`board score` turns these into a Brier score and a bias (positive means overconfident), per run
and comparable across versions. During a run, an implementer's low confidence on DONE is a reason
to read its report before the gate, never to skip the gate.
