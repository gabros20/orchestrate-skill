# bench — did this change make real runs better or worse?

This is maintainer-side and never installed with the skill. It measures `orchestrate` in three tiers,
cheapest first. A change only climbs to the next tier when it survives the one below.

| Tier | Command | Cost | What it catches |
|---|---|---|---|
| 0 · static | `scripts/check-sync` (runs `bench validate` too) | free | broken invariants, blocks, board selftest, invalid bench tasks |
| 1 · decision replays | `bench/bench replay [--case ID]` | cents per case | the controller's next move at a frozen state (plan pending, report landed, finished run) |
| 2 · builds | `bench/bench run --task T --arm A --k N` | dollars per run | outcome, cost and calibration on a whole small app, scored by hidden tests |
| field | `bench/bench field` | free (read-only) | every real run on this machine, its `board score`, by release (a trend, never proof) |

## Tasks (`tasks/<id>/`)

Each task is a small, stdlib-only Python app. Nothing to install, and the tests are `unittest`. A task
directory holds:

- `task.json`: the task's id, shape, split and prompt.
- `seed/`: the starting repo, containing `plan.md`.
- `accept/`: the **hidden** acceptance tests. They never enter the repo the agent builds.
- `oracle/`: a reference solution.

`bench validate` checks every task in both directions: the seed alone must fail its tests, and the seed
plus the oracle must pass them. A task where either check fails measures nothing.

| Task | Shape | Split | Exercises |
|---|---|---|---|
| `notes-chain` | chain (3 tasks build on each other) | train | `staged`: one writer, ordered gates |
| `textkit-fanout` | fan-out (4 independent modules) | train | `parallel`: concurrency, isolation, integration |
| `kv-heldout` | chain (2 tasks) | **held-out** | never look at it while tuning. It is the overfitting check |

## A build run

```bash
bench/bench run --task notes-chain --arm skill --model opus --k 3 --budget 15     # the candidate (working tree)
bench/bench run --task notes-chain --arm prev  --model opus --k 3 --budget 15     # the previous release tag
bench/bench compare prev-<tag>-opus skill-v<ver>-wt-opus
bench/bench run --task notes-chain --arm skill --dry-run                          # the exact command, nothing run
```

Each run follows these steps:

1. **Fresh repo.** It copies the seed into `~/.orchestrate-bench/<stamp>-…` as a fresh git repo with no
   remote and no history, so there is no solution to fetch.
2. **Skill as a project skill.** It installs the arm's skill as the repo's own skill
   (`.claude/skills/orchestrate`) with that skill's `board` first on PATH.
3. **Isolated headless build.** It runs Claude Code headless with `--setting-sources project,local
   --strict-mcp-config`, so your `~/.claude` skills and MCP servers do not load. This was verified
   2026-10-31: only the project skill and the built-ins load.
4. **Score the committed work.** It runs the hidden tests against a **clean clone of what was committed**.
   It also records the build's `board score --json`, cost, turns, subagents spawned, wall time, and
   whether uncommitted work was left behind.
5. **Write the result** to `results/<label>/<task>/<n>.json`. Results are committed, because they are the
   history.

**Arms:**
- **`skill`:** the candidate; `--ref` picks a commit.
- **`prev`:** the last release tag.
- **`thin`:** no skill, a "one subagent per task, review each diff" prompt.
- **`solo`:** no skill, one agent.

Run `thin` and `solo` now and then. A study found the same skill helps some configurations and hurts
others on 37% of tasks, so `orchestrate` has to keep earning its overhead against them.

**`compare` is paired, per task.** It reports the pass rate (hidden tests passed / total), pass^k (did
every repeat fully pass, which measures reliability rather than best-of-k), cost, wall time and
calibration. A metric is *improved* or *REGRESSED* only beyond the larger spread of the two sides'
repeats. Anything else is *unproven*. Any task that loses its pass rate or its pass^k is a regression,
whatever the means say.

**Budget.** A build costs a few dollars, scaled by the model and the run's size. Plan a release
comparison as 2 train tasks × k=3 × 2 arms, with `kv-heldout` once at the end, and cap every run with
`--budget`. Runs use `--permission-mode bypassPermissions` inside the temp repo, so run the bench where
you accept that.

## Decision replays (`replays.json`)

**A case** is a frozen `.orchestrate/` state, built by the candidate's own `board`, plus one prompt and a
few turns. It is graded by regex: commands and text that must appear, and commands that must not. Each
case makes one `evals/output/cases.json` scenario executable, named in its `covers` field. Add a case
whenever a field report or a bug shows a wrong move at a known state.

## Field data and the ledger

**`bench field`** reads every run the board has registered (`~/.orchestrate/runs`) and groups their
`board score` by the release each run started on. Use it to spot a trend worth a bench comparison,
never as proof: different releases ran different repos and goals.

**`ledger.jsonl`** is the evolve loop's memory. It holds every proposed skill edit with its prediction,
its evidence and its verdict: shipped, rejected or unproven. Proposals read the ledger first, so a
rejected idea is not proposed again (`.claude/skills/orchestrate-evolve/`).

## Rules

- **Hidden tests stay hidden.** Never quote `accept/` into the skill, a brief or a prompt. The
  optimizer sees what a test checks, never the test.
- **Pin the setup.** Pin the model, and record the harness version with the result. Scaffold dominates
  score: the same weights scored 62% in one harness and 33% in another.
- **One change per comparison.** Re-measure the baseline whenever the model or harness changes.
- **Keep the held-out task unseen.** A change tuned while looking at `kv-heldout` has no held-out
  evidence left.
