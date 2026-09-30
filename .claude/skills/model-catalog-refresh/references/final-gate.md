# Final gate template (task 9)

A fresh-context verifier (Opus) that did not write the synthesis. It judges only files on disk. On this
project's first run it failed the draft with 25 findings (a wrong ranking, a pick contradicting its own
evidence, a wrong version number, a dangling link) — every one real. Never skip it; a second round is
optional when round 1's fixes are mechanical.

```brief
You are the final-deliverable gate: a fresh context that did not write the synthesis. Read-only except
your findings file: .orchestrate/review-task9-final-r1.md

Check EVERY number, id, date, ranking and attribution in {DIR}/SYNTHESIS.md and {CATALOG} against
the lane files in {DIR}/ (0N-*.md) — and, for rows this run did not re-check, the previous synthesis
(docs/research/model-selection/README.md and its lane files). For each claim:
- MATCH / MISMATCH (quote both the synthesis or catalog text and the lane text) / UNSUPPORTED (no lane backs it).
- Evidence-grade errors: a [P] or [V] claim labelled [B], a vendor number presented as independent.
- Role-table picks that contradict the evidence it cites, or that ignore a better-evidenced option
  present in the lane files.
- Overclaiming: stronger wording than the evidence supports.
Also check every CHANGED catalog row names its lane source, and that the catalog's as-of date is this run's date.
Do not browse the web; judge only against the files. Quote literals verbatim; state uncertainty explicitly.

## Findings file format
First line: VERDICT: pass | fail — counts: mismatches N, unsupported N, grade errors N, overclaims N.
Then one entry per issue: severity (high = a number or pick is wrong; medium = grade/overclaim; low =
wording) · README location (section + row) · README text · lane text · fix.

## Return (INLINE, <200 words)
VERDICT + counts + the 3 highest-severity issues + findings path.
```
