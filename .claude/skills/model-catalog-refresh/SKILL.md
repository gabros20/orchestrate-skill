---
name: model-catalog-refresh
description: Refresh the orchestrate skill's model catalog (which harness · model · effort each role and posture gets) from fresh evidence — vendor specs and prices, live CLI catalogs, independent benchmarks, X / Reddit / HN practitioner reports, effort curves — then fact-check, apply to the catalog reference and the board defaults, and release. Use whenever a new model ships (Claude, GPT, Grok, Gemini, Kimi, DeepSeek, Qwen, GLM, MiniMax, Muse…), a price or context window changes, a model is retired or renamed, a CLI changes its model list, the catalog's as-of date is over a month old, or the user asks to re-check, update, or re-run the model research — even if they just say "new model out, add support".
---

# Model catalog refresh

The orchestrate skill picks models from `skills/orchestrate/references/shared-model-catalog.md` and the
board's `CATALOG`. Both go stale weekly. This skill re-runs the research that built them (first run:
`docs/research/model-selection/`, 2026-09-30) as an orchestrated, fact-checked refresh, and applies only
what the evidence moved. It is an orchestrate run: use the board, the flight plan, and the gates.

## 1. Scope the trigger

| Trigger | Lanes | Why these |
|---|---|---|
| **new-model** (a model shipped / was renamed) | 1 vendor · 2 CLI catalogs · 3 benchmarks · 4 X · 5 Reddit+HN · 7 effort (+8 other labs if not Anthropic/OpenAI/xAI) | ids, price, availability per harness, independent scores, real use, best effort |
| **price** (price, context, plan limits) | 1 vendor · 2 CLI catalogs · 3 benchmarks, cost rows only | cost-to-run and the Pareto picks move with price alone; scores don't |
| **sweep** (monthly, or catalog over a month old) | 1 2 3 4 5 7 8 (+6 routers quarterly) | everything drifts; routers change rarely |

Name the trigger's models exactly (the user's words, a launch post, `grok models`, the Codex cache).
**Confirm the trigger is real before fanning out**: a rumored model or an unverified price runs lanes 1–2
first; the other lanes start only once a vendor page or a harness list shows it. Never edit the catalog
on a premise the evidence has not confirmed.

## 2. Set up the run

```bash
S=.claude/skills/model-catalog-refresh/scripts
python3 $S/prepare_run.py plan --trigger new-model --models "<ids>"      # writes refresh-DATE/PLAN.md, prints board init
skills/orchestrate/scripts/board init <PLAN> --fresh …                  # the line it printed
python3 $S/prepare_run.py briefs --trigger new-model --models "<ids>"    # contract + briefs, seeded from the current catalog
skills/orchestrate/scripts/board plan --why "<trigger>" [--format md]   # flight plan; the user approves or tweaks
```

Before dispatch: `which -a codex` and each harness's `--version` — a stale binary on PATH (Codex
0.144.6 was seen with no GPT-6 models) makes lane 2 report the wrong catalog. Say so in the plan.

At the approval stop, tell the user the whole path, not only the lanes: dispatch → synthesis → task 9
fact-check (Opus, fresh context) → apply (`references/apply.md`) → `check_catalog.py`, selftest,
`scripts/bump` + CHANGELOG + MIGRATIONS line → `scripts/release`.

## 3. Dispatch and watch

One Sonnet worker per lane, in parallel (`board dispatch N --model sonnet --role researcher`), each
told: read the contract, then its brief; write only its file. Rules that come from the first run:

- **Only lane 4 uses `xrelay`**, serialized (X rate-limits parallel calls). Others must not touch it.
- **Reddit only through `search.rss`** with a browser User-Agent (JSON/HTML paths answer 403).
- **Stuck lane**: nothing on disk 20 min → one nudge ("write what you have now, finish in 10 min");
  still nothing → `TaskStop`, `board return N --status BLOCKED`, record the gap. Don't wait longer —
  the first run lost an hour to a lane that never wrote.
- A lane that finds a better method writes it in its `## Gaps`; fold it into `references/lanes.md` after
  the run.

## 4. Synthesize

Write `refresh-DATE/SYNTHESIS.md`: a **Changes vs catalog** table first (row · old → new · grade ·
lane), then updated role picks with the evidence, then gaps. Apply the evidence rules the catalog uses:

- Harness + model is the unit (the same model moves 15–20 points between harnesses) — never compare
  models across harness rows.
- A candidate enters a role only above the incumbent minus the benchmark's CI, on independent evidence;
  vendor numbers and practitioner reports inform, never decide alone.
- Effort: find each model's knee (points per dollar) and peak; max only for rare non-interactive roles.
- Unknown is "unknown", never a guess; every cell keeps grade + date.

## 5. Fact-check (never skip)

Dispatch task 9 to a fresh-context Opus verifier (`board dispatch 9 --agent verify-9 --model opus --role
verifier` — the flight plan shows every card on the worker model; override it here) with its brief (rendered from
`references/final-gate.md`). Fix every finding it confirms; say in the synthesis header that the gate
ran and how many findings were applied. The first run's draft failed with 25 real findings.

## 6. Apply and release

Follow `references/apply.md`: catalog reference, board `CATALOG` + `CATALOG_AS_OF`, selftest strings,
engine blocks, routing examples, `llms.txt`. Then:

```bash
python3 .claude/skills/model-catalog-refresh/scripts/check_catalog.py
skills/orchestrate/scripts/board --selftest && scripts/check-sync
scripts/bump X.Y.Z   # + CHANGELOG entry and the MIGRATIONS line
scripts/release X.Y.Z
```

`board done` each lane, `board reap`, `board finish` with the gate's findings as evidence. If the user
asked for research only, stop after step 5 and commit the research on a branch.

## Files

- `assets/research-contract.md` — the contract every lane reads (grades, delta rule, stuck rule, probes).
- `references/lanes.md` — the eight lane briefs (edit here when a method changes).
- `references/final-gate.md` — the verifier's brief.
- `references/apply.md` — what to edit where, and the release lines.
- `scripts/prepare_run.py` — trigger → lanes → plan, contract, briefs.
- `scripts/check_catalog.py` — board `CATALOG` ↔ catalog reference consistency.
