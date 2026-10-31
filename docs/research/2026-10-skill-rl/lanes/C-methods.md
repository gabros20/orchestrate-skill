# Lane C: papers and methods for a no-weights skill improvement loop

Scope: methods explained to the level needed to implement against the `board` journal. Items
marked (verified) were read this session as abstracts via the arXiv-backed paper index; others
are from prior knowledge with arXiv IDs, and details should be spot-checked before they are cited
in a public issue. "Transfer" is one line each.

## 0. Headline findings (read this first)

1. Skill optimization is now its own literature (2026). The closest prior art to what we want is
   **SkillOpt** (Microsoft, arXiv 2605.23904, verified): a separate optimizer model turns scored
   rollouts into *bounded add/delete/replace edits* on one skill doc; an edit is accepted only if
   it **strictly improves a held-out validation score**; a "textual learning rate" caps edit size;
   a rejected-edit buffer prevents re-proposing losers; epoch-wise slow/meta updates. Claims best
   or tied in 52 cells vs GEPA, TextGrad, human skills. Code: https://aka.ms/skillopt
2. **But the same literature warns it does not survive small N.** "Skill Issue: Lessons from
   Optimizing Repository SKILLs for Coding Agents" (2609.12742, verified): on 3 repos, GEPA gain
   +4.9pp "cannot be separated from the agent's run-to-run variance"; SkillOpt left score at
   +0.1pp. Our app-build runs are far costlier than their tasks, so *we cannot validate by
   score alone*. The honest path is paired comparison + many cheap proxy signals from journals.
3. **Skills often don't help, or hurt.** SkillsBench (2602.12670, verified): curated skills +16.6pp
   avg (33.9 to 50.5), focused skills (<=3 modules) beat exhaustive ones; LLM-authored skills gave
   no gain (SkillAxe 2606.10546). "Empirical Study of Agent Skills' Downstream Utility" (2610.08875):
   the same skill helps some configs and hurts others on **36.78% of tasks**; recommended
   procedures become an "execution burden". SkillMOO (2604.09297): pass rate alone is
   insufficient; optimize pass rate x cost (NSGA-II), and *pruning and substitution* dominate
   successful edits. => orchestrate (a big, procedure-heavy skill) should expect that deleting text
   is as valuable as adding it, and must always be measured against a **no-skill / thin-skill
   baseline arm**.
4. Self-feedback alone drifts: SkillLearnBench (2604.20087, verified) finds "multiple iterations
   facilitate genuine improvement via external feedback, whereas self-feedback alone induces
   recursive drift". Journals contain *external* feedback (exit codes, gate verdicts, commits, user
   corrections). Use only that as ground truth.

## 1. Reward design for text-space RL

### RLCR (calibration reward)
- Paper: "Beyond Binary Rewards: Training LMs to Reason About Their Uncertainty", MIT, arXiv 2507.16806.
- Problem: binary correctness RL (RLVR) makes models overconfident and guess.
- Loop: model emits answer + a verbalized confidence q (and an uncertainty analysis); reward =
  1[correct] - (q - 1[correct])^2, i.e. correctness plus a Brier term. The Brier score is a *proper*
  scoring rule, so honest confidence is the optimum. Calibration error dropped sharply with
  accuracy roughly preserved; confidence is usable at test time (confidence-weighted voting).
- Regressions/overfitting: n/a for weights; proper-scoring-rule property means the agent cannot
  game it by always saying 0.9.
- Cost: only needs a later binary truth label.
- Transfer without weights: add a required `confidence` (0-1 or 5 buckets) to worker returns and
  reviewer verdicts/findings; at finish, join each claim to its later truth (`board exec` exit
  code, gate pass/fail, did a later commit revert it, did the user accept) and compute Brier /
  reliability diagram **per role x model x claim-type**. Outputs: (a) a calibration table the
  router can use (low-confidence returns get an extra gate; model X's "done" at 0.9 is right 60%);
  (b) a per-run metric usable as an eval signal that is far less noisy than pass/fail because
  every return gives one datapoint (tens per run, not one per run).

### RLVR vs process rewards vs rubric rewards
- RLVR: reward from a programmatic verifier (tests, exit code). Highest trust, lowest coverage.
  For us: `board exec` results, test suites, a hidden acceptance suite on the benchmark app.
- Process reward models: score each step ("Let's Verify Step by Step", 2305.20050). Dense but need
  step labels; for agents the analogue is *trajectory checks* (did it run tests before claiming
  done; did it edit tests; did the gate precede merge). Our journal already records these events,
  so process rewards can be computed by **deterministic journal predicates** with no judge.
- Rubric rewards: "Rubrics as Rewards" (RaR, 2507.17746): decompose a task into weighted, binary,
  independently checkable criteria (essential/important/optional/pitfall), score by an LLM per
  criterion, aggregate (explicit weighted sum or implicit holistic). Much more reliable than a
  single 1-10 judge score because each item is a narrow yes/no. Related: DR-Rubric (2606.01091,
  verified) shows rubrics should themselves be built from evidence/research, not guessed.
  Transfer: write a ~20-item **run rubric** per benchmark (spec items delivered, README accurate,
  no secret committed, tests present...) mixing programmatic items (preferred) and judge items.
  Report each item, never only the sum.

### LLM-as-judge reliability
- MT-Bench/Chatbot Arena judge study (2306.05685): GPT-4 agrees with humans ~80%, but shows
  position bias, verbosity bias, self-preference. "Judging the Judges" (2406.07791): position bias
  varies by model and task; swap order and require consistency.
- Practice: (1) pairwise A/B for *comparing two versions' artifacts*, always both orders, count
  only order-consistent wins, ties otherwise; (2) absolute scores only on narrow binary rubric
  items; (3) judge model different from (and not weaker than) the builder; (4) judge sees
  evidence (diff, test output), not the agent's narration; (5) n>=3 samples at temperature>0 on
  borderline items; (6) calibrate the judge once against ~20 human-labelled items and report
  agreement. Pairwise is better for "is v2 better than v1"; absolute/rubric is better for tracking.
  Transfer: use judges only for items the journal cannot decide; never let the judge be the
  gate for accepting a skill edit.

## 2. Text-space optimizers (what each contributes)

| Method | Core loop | Reward | Anti-overfit | Cost | Transfer |
|---|---|---|---|---|---|
| **GEPA** (2507.19457) | Sample trajectories, an LLM *reflects in natural language* on traces to diagnose and propose prompt mutations; keep a **Pareto frontier** of candidates (best on >=1 instance), sample parents from it, optional merge of lineages | Per-instance score + textual feedback | Pareto keeps diverse specialists instead of one overfit winner; minibatch gate before full eval | Up to 35x fewer rollouts than GRPO claimed (hundreds, not 10^4) | Treat each skill section/prompt as a gene; score vectors are per-task or per-rubric-item, so the frontier is over *rubric items*, not tasks |
| **TextGrad** (2406.07496) | LLM critique as "textual gradient" backpropagated through a compound system | Any loss, incl. LLM | Weak: no validation gate by default | Many calls | The reflector prompt style (critique -> edit); not the framework |
| **OPRO** (2309.03409) | Meta-prompt lists past (prompt, score) pairs sorted ascending; LLM proposes next | Scalar score | Needs scored history | Cheap per step, needs many evals | Keep a **score ledger of skill versions** in the repo and show the optimizer the last k versions with deltas |
| **ACE** (2510.04618) | Generator runs, **Reflector** extracts lessons from execution feedback, **Curator** applies **delta updates** (add/modify/remove itemised bullets with ids and helpful/harmful counters) to a context "playbook" | Execution feedback, no labels | Delta updates + counters avoid "context collapse" (rewrite shrinks knowledge) and "brevity bias" | Modest; +10.6% agents, big latency cut vs rewrites | Closest to `board learn`: learnings as itemised bullets with ids and use/helpful/harmful counters, merged by deterministic curator code, never by free rewrite |
| **Dynamic Cheatsheet** (2504.07952) | Test-time memory the model reads and rewrites after each query | Self-judged | None strong; drift risk | Cheap | Warns that unvetted self-written memory drifts (matches SkillLearnBench) |
| **Training-Free GRPO** (2510.08191) | Run a *group* of rollouts per task; an LLM compares winners vs losers in the group and writes a **semantic advantage** (what differed); update an experience library (add/delete/modify/keep); no gradients | Group relative outcome | Needs a group, so within-task variance is the signal | ~100 samples, ~$18 claimed | Needs k>=2 runs of the same task under identical seeds; compare a good and a bad run's journals to extract "what differed" |
| **ReasoningBank** (2509.25140) | Distil strategies from **both successes and failures** into structured memory items (title/desc/content), retrieve at inference; memory-aware test-time scaling | Judge self-label | Failure-derived "pitfall" items | Low | Journals of failed gates are the richest source; store as "when X, do Y, because failure Z" |
| **Reflexion** (2303.11366) | After failure, write a verbal reflection into episodic memory for the next attempt | Binary/scalar env feedback | Within-episode only | Low | Already `board learn`; make it conditional on external failure evidence |
| **Voyager** (2305.16291) | Executable skill library, only skills that pass self-verification are stored, retrieved by embedding | Env feedback + self-verify | Verification gate before admission | Medium | Admit a candidate tool/script into `board` only after a replayed journal test |
| **DGM** (2505.22954) / **SICA** (2504.15228) | Agent edits its own code; **archive** of all variants (open-ended, not hill-climbing); evaluated on SWE-bench/Polyglot, parent chosen by performance x novelty | Benchmark score | Archive + stepping stones; the DGM paper also documented the agent faking test logs (reward hacking) | Heavy (thousands of $) | Archive every skill version with its scores; keep non-elitist branches (SkillNEO below) |
| **AlphaEvolve** (2506.13131) | Evolutionary program database + LLM mutations + automated evaluators with cascaded cheap-to-expensive tests | Programmatic eval | Eval cascade; island populations | Heavy | **Evaluator cascade**: static lint -> journal predicates -> cheap replay -> full app build, only survivors advance |

Skill-specific additions (all verified abstracts):
- **SkillNEO** (2610.20926): non-elitist; select the version to *use* separately from versions
  to *keep improving*; compare related versions on the same task to see what to preserve/repair.
  Counter to strict "only accept strict improvement": multi-edit repairs need intermediate
  low-score states.
- **SkillGrad** (2605.27760): trajectory-level loss, text gradients, **momentum** memory of
  recurring diagnostics, layer-aware patches.
- **SkillAxe** (2606.10546): label-free; decomposes skill quality into quality impact, trigger
  precision, instruction compliance with fault attribution, solution-path coverage. Trajectories
  from the wild, 22 skills raised SpreadsheetBench 16 to 52%.
- **Skills-Coach** (2604.27488): training-free GRPO applied to skills with a diverse task
  generator. **COBRA-Skills** (2609.11682): contextual bandit chooses which candidate edit to
  evaluate, to cut eval cost (relevant to our budget). **EvoSkill v2** (2610.25931): stateful
  evolver agent reading solver rollouts. **Shapley valuation of skill units** (2608.04562):
  credit assignment to rules/examples/scripts (ablation-based; too expensive for us except on
  journal-replayable units). **SkillReducer** (2603.29919): 60% of skill body non-actionable.
  **SIGIL** (2607.27309): compile a skill's procedure into an executable harness; the thing the
  `board` CLI already does for the deterministic parts. **SkillCT** (2610.38147), **SkillEval**
  (2608.06891), **MCRI** (2610.01506): execution-free quality scoring of skill text; useful as
  the cheapest cascade stage.

## 3. Evaluation methodology for agentic benchmarks

- **pass@k vs pass^k** (tau-bench, 2406.12045): pass@k = at least one of k attempts passes
  (capability ceiling, flattering). pass^k = *all* k attempts pass (reliability); for tau-bench
  retail pass^8 fell below ~25% for models with pass^1 ~60%. For a skill that promises a
  predictable process, **pass^k and variance of outcome matter more than best-of-k**. A 2026
  paper (2608.14711 verified) shows many harnesses misapply pass@k by setting n to test count
  rather than independent rollouts; use the unbiased estimator on real independent runs only.
- **Seeds and variance**: agent runs are non-deterministic even at temperature 0. "Adding Error
  Bars to Evals" (2411.00640) and "AI Agents That Matter" (2407.01502, cost-controlled
  evaluation): report confidence intervals, paired differences, and cost beside accuracy.
  With N=3 runs per arm, only effects >>20pp on the headline score are detectable; so the
  benchmark must expose **many per-run metrics** (rubric items, gate-first-pass rate, cost) and
  use *paired, same-task, same-seed-inputs* comparisons (McNemar/sign test on rubric items,
  bootstrap over items) rather than one pass/fail.
- **ABC: Agentic Benchmark Checklist** (2507.02825, verified): three axes: task validity (task
  solvable only if capability present; env/ground-truth correct), outcome validity (verifier
  strong enough; e.g. SWE-bench Verified has weak tests, tau-bench counted empty responses as
  success; errors up to 100% relative), and reporting (statistical significance, uncertainty,
  non-agent baselines such as a trivial or no-op agent, interpretation). Applying it cut CVE-Bench
  overestimation by 33%. Transfer: run a **null agent** and a **no-skill agent** on the benchmark;
  a verifier that passes the null agent is broken.
- **Reward hacking in coding agents**: EvilGenie (2511.21654: hardcoding tests, editing test
  files; detected by held-out tests, LLM judges, test-file-edit detection), SpecBench (2605.21384),
  Terminal Wrench (2604.17596: 331 hackable terminal environments, 3,632 exploit trajectories),
  hacker-fixer loops (2606.08960: 16% of 1,968 terminal tasks hackable), BenchJack (2605.12673),
  unearned passes (2609.34262: audit passing trajectories). Transfer: the hidden acceptance suite
  must live outside the build workspace; journal predicate "test files modified after gate
  start"; "same commit passes locally and in a clean checkout"; held-out tests the builder never
  saw.
- **Contamination**: pick an app spec not in public benchmarks, rotate 3-5 spec variants, and
  freeze them. Maintain a held-out spec never used while tuning the skill (train/dev/test split of
  *specs*; this is the main overfitting guard for skill optimization).
- **Cost-normalized scores**: report score per dollar, tokens, wall-clock; SkillMOO's Pareto
  (pass x cost) is the model. An orchestration skill that adds coordination should be judged
  against single-agent baseline at equal budget.
- **SWE-bench Verified lessons**: human-validated subset (500) fixed underspecified tasks, but
  tests still weak (ABC; SWE-bench+ 2410.06992 found solution leakage and weak tests). Lesson:
  validation of the verifier is as important as of the agent.
- **Terminal-Bench task format** (tbench.ai): one directory per task: instruction text, Docker
  environment, pytest test file run in the container after the agent finishes, oracle solution
  script, time limit, metadata (difficulty, category). Pass = tests exit 0. Transfer: package each
  benchmark app spec the same way (`spec.md`, `docker`/fixture, `accept/` hidden tests, `oracle`
  optional) so it can also be run under other harnesses and judged by non-agent code.
- **Skill-specific benchmark designs**: SkillsBench (paired no-skill vs skill, deterministic
  verifiers, 87 tasks); SWE-Skills-Bench (2603.15401); WebDev-Skills-Bench (2608.23067: should
  the skill even be injected); Skill-Use (2608.04828: progressive disclosure, does the agent
  actually load and follow the skill); SkillScriptBench (2610.04008: revising scripts without
  breaking correct behaviour - a *preservation* test, relevant to `board` edits).

## 4. What transfers: mechanisms by evidence source in the journal

| Journal signal | Truth quality | Use |
|---|---|---|
| `board exec` exit code and duration | Programmatic, high | RLVR-style reward; per-check pass rate; time-to-green |
| Gate/review verdicts and findings, later confirmed or reverted | Medium (reviewer may be wrong) | Reviewer precision/recall: a finding is "true" if a later commit fixes it, "false" if dismissed with evidence |
| Returns with commits vs claims | High | Claim-vs-evidence mismatch rate ("done" with no commit / failing test) |
| Dispatch -> observed model | High | Did the router's model assignment get honoured; model x role stats |
| `board learn` entries | Low until counted | ACE counters: was the learning retrieved and did the next run avoid the failure |
| Mail/user corrections | High, rare | Strongest negative reward; weight heavily |
| Token receipts, duration | High | Cost axis |
| Finish verdict vs hidden acceptance | High | Verdict calibration (did "ready" mean ready) |

## 5. Ranked: mechanisms to adopt (no weights, $5-50 runs, small N, rich journals)

1. **Journal-derived metrics suite + paired comparison harness (RLVR/process-reward predicates).**
   Compute 15-30 deterministic per-run metrics from the journal (first-pass gate rate, rework
   cycles, claim-vs-evidence mismatches, test-file edits after gate, tokens, wall-clock, exec
   pass rate, user corrections). Compare version N vs N-1 on the same spec set with paired
   statistics and report all metrics, not one score. Cheapest, highest information per dollar, and
   the only thing that works at N=3 (Sec. 3, "Skill Issue" warning).
2. **Hidden acceptance suite + null/no-skill baselines (ABC, Terminal-Bench format).** Per spec:
   verifier outside the workspace, validated by running a null agent (must fail) and a reference
   solution (must pass). Always include a thin-skill arm; SkillsBench and the 36.78% result say a
   skill can hurt.
3. **Calibrated confidence on returns and reviews, scored by Brier against later truth (RLCR).**
   One datapoint per claim, tens per run, no extra agent cost beyond a field. Yields per-role
   reliability tables that feed routing decisions (when to add a gate) and a noise-robust eval
   metric.
4. **ACE-style delta curation of learnings.** Itemised bullets with ids, helpful/harmful counters
   incremented from journal outcomes, deterministic merge/prune by the CLI, never whole-document
   rewrites. This protects against context collapse and gives the skill-pruning signal (SkillMOO:
   deletion is a top edit).
5. **Bounded-edit optimizer with held-out gate and rejected-edit buffer (SkillOpt + GEPA Pareto +
   SkillNEO).** Use as the offline "RL" step: reflector reads journals of k failed vs passed runs
   (Training-Free GRPO's group contrast; ReasoningBank for failure pitfalls), proposes <=N-line
   edits; cascade evaluation (AlphaEvolve): static/lint and execution-free skill-quality scores
   -> journal-replay checks -> a single cheap benchmark spec -> full multi-spec run only for
   survivors. Keep an archive of all versions with score vectors (DGM); accept on Pareto
   improvement over rubric items plus cost, validated on a held-out spec. Treat gains below the
   noise floor as "unproven", not accepted.
6. **Rubric-based judging for what predicates cannot decide, pairwise and order-swapped.** ~20
   binary items per run (RaR), judge sees diffs/outputs not narration, judge calibrated against 20
   human labels; use only as a secondary signal and never as the accept gate for skill edits.
7. **pass^k / variance reporting and cost-normalization.** Report per-spec outcome stability
   across >=3 runs for any change that is about to ship; report score per dollar. Reserve
   multi-run to release candidates, not every edit.
8. **Post-run issue-proposer sub-skill as a reflector with evidence discipline (SkillAxe fault
   attribution + ACE reflector).** It outputs proposed issues each linked to journal event ids and
   a metric, and classifies as skill-text / `board` tool / model-routing / benchmark-validity.
   Uses only external-evidence signals (SkillLearnBench: self-feedback drifts); a human approves
   before filing; dedupe against open issues; also tracks whether last release's fix moved the
   metric it targeted (closing the loop).

Practical sequencing: 1 and 2 first (they define what "better" means), 3 and 4 in parallel
(runtime changes, cheap), then 5 once ~10+ journal-rich runs exist, with 8 as the human-facing
output of 1-4 and the proposal front end of 5.

## 6. Source list
SkillOpt https://arxiv.org/abs/2605.23904 ; SkillsBench 2602.12670 ; Skill Issue 2609.12742 ;
Downstream Utility 2610.08875 ; SkillMOO 2604.09297 ; SkillNEO 2610.20926 ; SkillGrad 2605.27760 ;
SkillAxe 2606.10546 ; SkillLearnBench 2604.20087 ; Skills-Coach 2604.27488 ; COBRA 2609.11682 ;
EvoSkill v2 2610.25931 ; ABC 2507.02825 ; tau-bench 2406.12045 ; Beyond pass@k 2608.14711 ;
RLCR 2507.16806 ; RaR 2507.17746 ; DR-Rubric 2606.01091 ; GEPA 2507.19457 ; TextGrad 2406.07496 ;
OPRO 2309.03409 ; ACE 2510.04618 ; Dynamic Cheatsheet 2504.07952 ; Training-Free GRPO 2510.08191 ;
ReasoningBank 2509.25140 ; Reflexion 2303.11366 ; Voyager 2305.16291 ; DGM 2505.22954 ;
SICA 2504.15228 ; AlphaEvolve 2506.13131 ; EvilGenie 2511.21654 ; Terminal Wrench 2604.17596 ;
Hacker-Fixer 2606.08960 ; BenchJack 2605.12673 ; Unearned passes 2609.34262 ; MT-Bench judge
2306.05685 ; Judging the Judges 2406.07791 ; Error bars 2411.00640 ; AI Agents That Matter
2407.01502 ; Terminal-Bench https://www.tbench.ai . All arXiv IDs resolve at
https://arxiv.org/abs/<id>.
