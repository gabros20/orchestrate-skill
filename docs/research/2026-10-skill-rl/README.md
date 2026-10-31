# Skill RL — a benchmark and a feedback loop for `orchestrate` — research record

> **Status:** phase 1 (the field loop) implemented for v1.34.0 — [design](../../designs/v1.34.0-field-loop.md); the bench and the evolve loop are proposals (research on main @ `ae2bcbc`).
> Research date: 2026-10-30.

*Method: three Sonnet researcher lanes. Lane A read Microsoft SkillOpt and about 15 neighbouring optimizers and
benchmarks (`ghrelay` skim/read, `gh api`). Lane B searched X discussion through `xrelay`: 25 read-only calls,
35 searches, 17 thread reads and the user's bookmark cache. Lane C covered methods papers (arXiv abstracts
through firecrawl). The controller checked the load-bearing claim ("Skill Issue", arXiv 2609.12742) against
its abstract, and read this repo's evals, `board postmortem` and the ten real run journals on this machine.
Raw lane reports are in [`lanes/`](lanes/). The lanes grade each claim repo-read · docs · post-only. Lane C
names which of its papers were verified this session and which came from memory.*

**Question:** how do we measure whether a change to `orchestrate` made real runs better or worse? And how do
we turn real runs into improvement signal for the skill's text and tools: reinforcement learning without
weights?

---

## TL;DR

1. **The field has converged on one loop, and it is RL in text space.** SkillOpt, GEPA, EvoSkill, Hermes
   self-evolution, AHE and skill-creator share the same shape:
   - run on tasks with a verifier;
   - reflect on the traces;
   - propose a *bounded, anchored* edit;
   - accept only on held-out evidence;
   - remember rejected edits;
   - leave a human at the PR.

   Ungated loops collapse. SkillOpt-Sleep's ungated twin fell from 0.554 to 0.026 accuracy in five nights;
   the gated twin rejected every one of those edits.
2. **Noise is the enemy at our scale.** "Skill Issue" (2609.12742, checked) could not separate GEPA's
   +4.9 points from run-to-run variance on one repository, and SkillOpt moved +0.1. An app-build run costs
   $5–50 and 30–120 minutes, so a pass/fail score over three runs detects only very large effects. We need
   many signals per run, not one.
3. **We already have the trace. Most optimizers have to build one.** Ten real runs on this machine hold
   1,481 journal events, every one stamped with the skill version (`"v"`). They cover:
   - 189 gates, 132 reviews, 114 checks with exit codes, 141 returns;
   - 37 token receipts, 67 learnings, 8 finishes.

   `board postmortem` already prints a per-run scorecard: per-tier dispatches, first-attempt-clean rate,
   gate rounds per task, checks ok and report≠return mismatches. What is missing:
   - comparison across versions;
   - a controlled benchmark;
   - a calibration signal;
   - a channel back to this repo.
4. **Skills can hurt, and orchestration is not free.** On 36.78% of tasks a skill helps one configuration and
   hurts another (2610.08875). Focused skills beat large bundles (SkillsBench). Anthropic's rule of thumb is
   that one agent with skills often beats multi-agent setups. So a benchmark must keep a thin-skill and a
   single-agent arm, and must reward deletions as much as additions. SkillMOO found that pruning dominates
   successful edits.
5. **Edit the tool before the prose.** AHE's ablation: the gains came from tools, middleware and memory, not
   system-prompt prose. This matches our own v1.33 finding: five of five flight plans went unshown until
   `board dispatch` refused, and no amount of prose fixed it.
6. **"RLCR" has two meanings.** On X it is mostly *Reinforcement Learning from Collective Rewards*, which
   trains weights and does not transfer. The useful one is *RL with Calibration Rewards* (MIT, 2507.16806):
   reward = correct − (confidence − correct)². Without weights it becomes a confidence on every return and
   review verdict, scored by Brier against later truth. That gives tens of data points per run instead of
   one, which is the densest cheap signal available to us.

## Proposed design — three loops, three cadences

| Loop | Cadence | Cost | Signal | Output |
|---|---|---|---|---|
| **Field** | every real run, at finish and milestones | ~0 (deterministic) + one retro pass | the run's journal + board friction log | `board score`, `.orchestrate/retro/`, issue drafts filed on the user's yes |
| **Bench** | every release candidate | ~$30–90 per comparison | hidden acceptance tests + score vector, paired vN vs vN−1 | `bench/results/`, a regressed / improved / unproven verdict per metric |
| **Evolve** | when field issues and bench data accumulate | one maintainer session + bench runs | issue clusters, good-vs-bad run contrast | bounded-edit PRs with falsifiable predictions |

### 1. Field loop: every run produces data, in the shipped skill

- **`board score [--json]`** turns the journal into a versioned score vector, with no model calls. Each
  group has a different role in the loop:

  | Group | Metrics | Role |
  |---|---|---|
  | Outcome | finish valid; tasks done or open; user corrections | optimized |
  | Quality | first-pass gate rate; rounds per gate; churn; findings by severity; report≠return | diagnostic |
  | Discipline | `check` findings; plan shown before dispatch | diagnostic |
  | Efficiency | tokens and receipts; wall time; dispatches per accepted task; nudges; escalations; re-dispatches | optimized |
  | Communication | mail per task; time an ask stayed unanswered | diagnostic |
  | Calibration | Brier score (below) | optimized |

  Only outcome, cost and calibration are optimized. The other groups explain a result and are never the
  goal: "fewer gate rounds" is gamed by a lenient reviewer.
- **Board friction log.** `board` already knows when it was misused: every refusal, parse error, `--help`
  read and stale copy. It would append one line to `.orchestrate/raw/friction.log`, outside the journal so
  the journal stays semantic. In v1.33 we mined this by hand from transcripts (12 `--help` reads of about
  5.4k characters each; 5 of 5 plans unshown), so the data is clearly worth having.
- **Confidence on claims (RLCR without weights).** `board return … --confidence 0.8`, with the same on
  review verdicts. At finish, `board score` joins each claim to its later truth:
  - the first gate passed or failed;
  - a later fix touched it;
  - the hidden tests passed (in the bench).

  It then computes Brier per role × model. Runtime use: a low-confidence DONE earns an extra gate. Loop
  use: this is the low-noise metric. One field, no extra agent cost.
- **The retro step: `references/shared-retro.md`, read only at finish or a milestone.** This is the sub-path
  sub-skill. It runs `board score`, `board postmortem` and the friction log, then sorts each finding as
  either *project-local* (it stays in `board learn` and `board memory`) or *skill-level*: a rule that
  misled, a missing or confusing board behaviour, a routing miss, a template gap. Only skill-level findings
  become issue drafts in `.orchestrate/retro/issue-*.md`. Each draft follows AHE's falsifiable contract:
  - **Evidence:** journal seq refs; `v`, host, models, strategy. No project code, paths or secrets.
  - **Root-cause hypothesis.**
  - **Proposed fix class:** skill text, `board`, routing or bench.
  - **Predicted effect:** a named metric moves in a named direction.

  Before filing anything it searches open issues to avoid duplicates. Filing is outward-facing, so the
  default is a draft, and `gh issue create` runs only on the user's explicit yes. A `retro=off|draft|ask`
  dimension controls this. Only external evidence counts: SkillLearnBench shows that self-feedback alone
  drifts.
- **Repo side.** A `.github/ISSUE_TEMPLATE/field-report.yml` whose YAML header (version, host, models,
  metric, prediction) a script can aggregate across reports. Every fixed field report becomes a regression
  case: an eval case, a decision replay or a board selftest fixture. Every incident becomes an eval.

### 2. Bench loop: controlled comparison, maintainer-side `bench/`, not shipped

- **Tasks in Terminal-Bench form.** Each task is `bench/tasks/<id>/`:
  - `spec.md` and an optional `plan.md`;
  - `seed/`, the starting repo;
  - `accept/`, the hidden tests;
  - `oracle/`, a reference solution;
  - `task.toml`: prompt, time limit, budget, strategy hint.

  ABC validity check on every task: a null agent must fail `accept/` and the oracle must pass it. Start with
  three tasks:
  - **chain:** a CLI with SQLite, about 20 minutes (exercises `staged`);
  - **fan-out:** an API with four independent endpoints (exercises `parallel`);
  - **held-out:** one spec never used while tuning.
- **Replay tasks from real runs.** This follows Skill Issue's method. A journal's `run` event already carries
  the base commit and the plan. Reset to the base, give the plan, and use the finished repo's tests as the
  hidden acceptance suite. These are the most realistic tasks we can get. They stay local
  (`~/.orchestrate-bench/`) because they contain the user's private projects.
- **Runner: `bench/run --skill <git-ref> --arm skill|prev|thin|solo --task <id> --k 3 --host claude|codex`.**
  - It creates a fresh repo with no remote and no history to fetch solutions from (Cursor and Vals: models
    find answers in git history).
  - It installs the candidate skill as a project skill (`.claude/skills/orchestrate` or `.agents/skills/`).
  - It runs headless with harness version, model and effort pinned. Scaffold dominates score: the same
    weights scored 62% in one harness and 33% in another. On Claude Code that is
    `claude -p … --output-format stream-json --max-budget-usd N`.
  - Afterwards it copies `accept/` into a clean checkout and runs it.
  - It writes `board score --json`, the transcript's tokens and cost, wall time and any test-file edits
    after the first gate (a reward-hacking signal) to `bench/results/<ref>/<task>/<n>.json`.
- **`bench/compare A B`.** For each task and metric: the paired difference, pass^k (reliability, not best of
  k) and the spread. Each metric gets a verdict:
  - *improved* or *regressed*: beyond the noise floor measured from the baseline's own repeats;
  - *unproven*: otherwise.

  Run the thin and solo arms once per few releases. They prove that orchestrate pays for itself.
- **Evaluator cascade (AlphaEvolve).** Cheapest first; only survivors advance:
  1. `check-sync` and static evals: free.
  2. **Decision replays**: a frozen `.orchestrate/` state at a decision point (report landed, findings in,
     plan pending, worker asked) plus the skill. The question is "what are your next calls?", graded
     deterministically on the first 1–3 tool calls. A few cents per case and k=5 or more is affordable.
     This also makes the assertion lists in `evals/output/cases.json` executable; today nothing runs them.
  3. One tiny task, one run (smoke).
  4. The full matrix, for release candidates only.

### 3. Evolve loop: the "RL" step, maintainer skill `.claude/skills/orchestrate-evolve/`

This skill sits next to `model-catalog-refresh` and is never installed for users. Its inputs are open field
reports, bench results and local journals. The procedure:

1. **Cluster failures across runs.** Contrast a good run and a bad run on the same task to find what differed
   (Training-Free GRPO's group advantage).
2. **Propose candidates of at most four anchored edits.** Prefer `board` and gate changes and *deletions* to
   new prose. Each edit carries a prediction. `check-sync`'s invariants are protected regions.
3. **Branch, then run the cascade.**
4. **Accept only if** no task's hidden pass rate drops, and the predicted metric moves beyond the noise
   floor.
5. **Otherwise record it as unproven** in `bench/ledger.jsonl`, the rejected-edit buffer and version archive
   (OPRO and EvoSkill). The next proposals read the ledger.
6. **Hand off.** The human merges the PR. After release, the version-stamped field journals check whether
   the prediction held, and a wrong prediction reopens the issue.
7. **Expect a low acceptance rate.** SkillOpt's best skills end with one to four accepted edits. A loop that
   accepts most proposals is shipping slop.

It reuses the existing evolve pass (`prompt-evolve.md`), which today improves a `loop` run's contract. This
skill applies the same discipline to the skill itself.

## What not to do

- **Training weights** (Agent Lightning RL, the RLCR "collective rewards" sense, GRPO): it needs open models
  and GPUs. Only its evaluation lessons transfer.
- **Ungated or full-rewrite optimizers, or online self-editing** (Dynamic Cheatsheet style): they collapse,
  through brevity bias and context collapse.
- **An LLM judge as the accept gate.** Judges are a secondary signal: pairwise, order-swapped, on a binary
  rubric, seeing diffs rather than narration.
- **Optimizing process metrics.** That is Goodhart's law. Optimize outcome, cost and calibration.
- **Automatic issue filing.** It is outward-facing and may leak project detail.

## Phasing

1. **v1.34 (cheap, useful immediately):**
   - `board score`;
   - the friction log;
   - `--confidence` on return and review;
   - `shared-retro.md` and the finish step;
   - the `field-report` issue template.

   From then on, every real run is data.
2. **Bench MVP:**
   - two tasks plus one held-out;
   - `bench/run` for Claude Code, then Codex;
   - `bench/compare`;
   - decision replays covering the 16 output cases;
   - the first baseline, v1.33 against v1.34.
3. **Evolve:**
   - the maintainer skill;
   - the ledger;
   - replay tasks from local journals;
   - ACE-style helpful/harmful counters on `board learn` items, so learnings that never helped are pruned.

## Open questions

- **Bench budget.** The proposal is about $30–90 per release comparison, and the user sets the cap.
- **Default `retro` posture.** Draft at every finish, or only ask when there is a skill-level finding.
- **Field reports from other people's runs.** Opt-in only, with a redaction pass, if the skill is ever used
  beyond this machine.
- **Verify before citing publicly.** Lane C's from-memory arXiv IDs and Lane B's post-only claims still need
  checking: the SkillsBench numbers, Harness², and the Anthropic reward-hacking notes.
