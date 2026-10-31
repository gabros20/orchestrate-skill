---
name: orchestrate-evolve
description: Improve the orchestrate skill from evidence — field reports filed by real runs (`board retro`), `bench field` trends, bench results and local run journals — by proposing small, falsifiable edits (prefer board behaviour and deletions over new prose), gating them through the bench tiers (check-sync → decision replays → builds against the previous release), recording every proposal in bench/ledger.jsonl, and shipping only what held up. Use when field-report issues accumulate, before a release, when the user asks "what should we improve in orchestrate", "run the evolve loop", "check last release's fixes", or after a model change that may have shifted the skill's behaviour.
---

# orchestrate-evolve — text-space RL for the skill, with a human at the merge

The loop is the one the research converged on (`docs/research/2026-10-skill-rl/`):

> evidence → diagnosis → a bounded edit with a prediction → gated evaluation → keep, revert or "unproven"
> → ledger → the user merges

Ungated loops collapse: SkillOpt-Sleep's ungated twin went from 0.554 to 0.026. Gains below the noise of
the repeats are not gains: "Skill Issue" could not tell +4.9 points from variance. Expect to ship few
edits. SkillOpt's best skills end with one to four accepted edits, so a loop that accepts most proposals
is shipping slop.

## 1. Gather evidence (read-only)

```bash
gh issue list --repo gabros20/orchestrate-skill --state all --search "[field] in:title" --json number,title,state,body
bench/bench field                      # real runs by release: outcome, finish-stands, attempts/accepted, cost, calibration
cat bench/ledger.jsonl                 # what was tried before, and what it did; never re-propose a rejected idea unchanged
ls bench/results/                      # the latest bench labels; bench/bench compare A B to read one
```

Only **external** evidence counts:
- exit codes, gate verdicts and hidden-test results;
- `board score` and its friction counts;
- reverts, and user corrections in field reports.

The skill's own opinion of itself drifts (SkillLearnBench). A local journal may be read for detail
(`board score --json`, `board retro`, `board log`) but stays local: never copy a project's content into
an issue, edit or ledger line.

## 2. Diagnose: cluster, then contrast

- **Cluster** field reports and signals by mechanism, not by symptom. Ten reports about one refusal
  message are one cluster.
- **Contrast** a good and a bad run on the same task or state (Training-Free GRPO's group advantage):
  what did the good one do that the bad one did not? This beats reflecting on failures alone.
- **Check old predictions first.** For every *shipped* ledger entry whose release now has field or bench
  data, did its metric move as predicted? If not, reopen it as a cluster: the fix did not work, or the
  diagnosis was wrong.

## 3. Propose: at most four anchored edits per candidate

Each edit is one ledger line *before* anything is evaluated:

```json
{"id": "E-2026-11-01-a", "date": "2026-11-01", "evidence": ["#12", "#15", "bench field 1.34 friction"],
 "cause": "…", "edit": "board: … | references/x.md: delete … | prompt-y.md: …", "class": "board|skill text|routing|bench",
 "metric": "friction.refusal per run", "prediction": "−50% on runs ≥ 1.35", "status": "proposed"}
```

- **Edit the tool before the prose.** A board refusal, default or derived hint beats a sentence agents
  may skip. AHE found its gains came from tools and memory, not system-prompt prose. Our own v1.33 found
  that prose never got the flight plan shown, and a `dispatch` refusal did.
- **Prefer deletion.** In SkillMOO, pruning dominated successful edits, and focused skills beat bundles
  (SkillsBench). Every candidate states its token delta (`scripts/count-skill-tokens`).
- **Keep the protected regions.** `scripts/check-sync`'s registry, the byte-identical blocks and the
  honest numbers stay intact. An edit that needs to change one updates every home in the same edit.
- **No test-shaped edits.** Never quote `bench/tasks/*/accept/` or a replay's regexes into the skill. A
  rule that only makes sense for one bench task is overfitting.

## 4. Evaluate: the cascade, cheapest first

On a branch, stop at the first tier that fails:

1. **Static:** `scripts/check-sync`, plus a new selftest fixture for a board change.
2. **Replays:** `bench/bench replay --model sonnet`. Every case passes, including a new case that
   reproduces the cluster's wrong move, written *before* the edit and failing on the old skill.
3. **Builds (release candidates only):**
   - Run `bench/bench run --arm prev` and `--arm skill` on the train tasks with k=3, then compare.
   - **Accept** only if no task regresses (pass rate or pass^k) and the predicted metric moves beyond the
     noise of the repeats.
   - **Run `kv-heldout` last**, once, after the decision. Never tune against it.
   - **Budget:** ask the user for a cap before tier 3, and state the expected spend.

Anything below the noise floor is **unproven**. Record it, and don't ship it as a fix. A pure deletion
that is neutral on every metric **may** ship: equal outcome at fewer tokens is an improvement.

## 5. Record and hand off

- **Update each ledger line:**
  - `status`: shipped, rejected or unproven;
  - the bench labels;
  - the observed deltas.

  Rejected and unproven lines stay. They are the buffer that stops the next pass re-proposing them.
- **Open a PR** with the edits, the ledger diff, and the compare table in the body. Link the field-report
  issues it answers.
- **The user merges.** Release with `scripts/release`. Close or comment on the issues only after the
  release, and say which metric will tell whether the fix worked.
- **No-op is a valid, common outcome.** "Nothing cleared the gate" plus the ledger lines is a complete
  run.
