# Lane F-harness-memory-efficiency — harness engineering, memory and self-improvement, cost and speed

Researched 2026-10-13 against orchestrate v1.31.0 (`skills/orchestrate/`, `scripts/board`). No xrelay. Grades:
**repo-read** (read the implementing file) · **docs** (docs page or paper full text) · **post-only**.
The prior sweeps (`docs/research/2026-08-*`, `2026-09-review-sweep.md`, `token-optimization.md`) named none of
these tools except ECC (as a skills source), Hermes (as an engine, not the Curator) and Rohit's article;
everything below is new ground except Rohit, where I checked what landed.

Shape of the finding: orchestrate's learning loop is strong *inside* a run (`board learn` → digest →
field-guide → `board memory`) and weak in three places the lane's tools all converge on — it cannot
measure its own cost in price-weighted terms across runs, its evolve pass edits the loop's constitution
ungated, and what a run learns dies at the next kickoff unless the user also runs `ctx`. Model routing and
the shape of delegation are already where Devin Fusion and Cursor ended up; snapshot/fork/resume is mostly
infrastructure a skill cannot adopt.

## Top candidates (ranked, 3–6)

1. **Price-weighted, cross-run measurement — make `board postmortem` the instrument the token economy says
   it lacks** — from Cursor's efficiency prompt (§1 baseline, §8 validate, "weight by billing type"), Devin
   Fusion / Artificial Analysis ("+70% tokens, ~3× turns, yet −36% cost"), Rohit (cost per accepted task),
   AHE/HarnessX (no edit is judged without per-task metrics) · value **H** · effort **M** · lands in
   `scripts/board` (`fetch_receipt`, `receipts()`/`cost_band()`, `render_postmortem`, new `board runs
   --stats`), `shared-flight-plan.md` budget strip, `shared-token-economy.md` (Cache hygiene, Honest numbers),
   `scripts/count-skill-tokens` · beats today because a Claude receipt adds cache reads at face value into one
   `tokens` figure, Codex's receipt drops the cached split, "cost per accepted task" and the flight-plan band
   are raw tokens, so "cache hygiene" is declared "not a measured lever" and the 10–25% saving cannot be
   re-checked by the repo itself (`evals/compression-ablation/cases.json` is two cases naming v1.4.0/v1.5.0 with
   no runner).
   - Store the usage split on the `receipt` event (input / output / cache_read / cache_write + engine `cost`
     when given); `postmortem` prints **$ per accepted task, cache-read share, minutes per accepted task**
     beside tokens; the flight plan prices its band in $ and minutes from the same archive receipts it already
     walks.
   - `board runs --stats`: one row per registered run — release stamp (already on every event), kind,
     strategy, posture, accepted/dispatched, first-attempt-clean, $/accepted, min/accepted. Aggregation over
     data the journals already hold; it turns "is v1.31.0's work log worth ~120 tokens a dispatch?" into a
     query. This is the A/B the Honest-numbers section says is the only trustworthy measure.
   - A worker-surface rollup (which `board` verbs each role actually called, learn rate) so the 751-token
     WORKER block is pruned on evidence (Cursor: "per tool, the share of runs that call it").
   - Calibrate `count-skill-tokens`: measured here with o200k_base, the 48 skill `.md` files are 81.8K tokens vs
     the script's ~68K (+20%; table-heavy `shared-model-catalog.md` +46%, `shared-hosts.md` +48%; the WORKER block
     is 831 vs the stated 751).
   - ADK's lesson (docs/context-budget.md): its prompt prefix reached 70,774 chars with a green suite because
     only per-component caps existed; they then added an aggregate guard (plus a per-tool one) about a third above
     what ships. `check-sync` guards only line counts — SKILL.md ≤250 (231 now) and `shared-hosts.md` ≤200 (190) —
     so add an aggregate ceiling on the always-loaded + per-dispatch set.

2. **Gate the evolve pass like an experiment** (fence, manifest with predictions, snapshot and revert,
   evidence trigger, growth cap, independent check) — from Agentic Harness Engineering, HarnessX, Prime Agent's
   Continual Harness, hermes-agent-self-evolution, HALO · value **H** for loop users · effort **S–M** · lands in
   `references/prompt-evolve.md` (Return block, fence, leakage self-check), `references/strategy-loop.md` (evolve
   section: trigger, snapshot, attribution, revert), `references/shared-safety-rails.md` ("Repair never lowers
   the gate" extended from the controller to the evolve pass), `board postmortem` (failure-mode rollup) ·
   beats today because `prompt-evolve.md` applies "the least that helps" in place and returns a prose `watch:`
   line: nothing snapshots the contract, predicts, attributes, reverts, caps its growth, or reviews it (the
   regression breaker covers a cycle's product changes, not the contract edits; routing rule 6, maker ≠ checker,
   is not applied to the one agent that edits the loop's own constitution), and lever 1 even lists "fuzzy
   verification bars" as editable.
   - **Fence** (AHE: workspace-only, verifier/tracer/LLM config read-only, seed prompt non-deletable; HarnessX
     `write_scope_gate.py`; Prime Agent: immutable base + mutable supplemental state): evolve may edit SOP,
     Current understanding, Logs and helper scripts — never Goal, the ship-alone line of Boundaries, the
     verifier command, budget, kill switch or stop condition. A deterministic check: hash the protected
     sections at loop start, compare after the pass.
   - **Manifest** (AHE `change_manifest.json`; HarnessX Table 9): per change — evidence (journal seq / log
     lines) · root cause · predicted fix (which recurring failure should stop) · guard (what must not
     regress) · signature (what in the next logs proves it fired). Snapshot the contract first (git commit or
     `.prev`); the next pass **attributes before it edits** and reverts deterministically (fix not seen in N
     cycles, or a guard metric worse). AHE measured why the trigger must be metrics, not the evolver's own
     at-risk list: fix precision 33.7% / recall 51.4% (≈5× random) but regression precision 11.8% / recall 11.1%
     (≈2× random) — "regression blindness".
   - **Trigger on evidence, not only cadence**: HarnessX's Digester short-circuits below an actionability
     threshold; Prime Agent runs a cheap review first, with a cooldown, and only an approving review refines;
     Hermes defers the first run one interval; MemoryRepo dreams only if there is new input. Today the pass is
     dispatched every N runs and a no-op still costs a full agent.
   - **Growth ceiling**: the contract is "injected every cycle" and has no size cap; lever 2 says "when
     uncertain, keep". HarnessX Telecom: five consecutive same-bucket "reminder" edits, then the sixth took
     compliance 94.7% → 80.7%; self-evolution rejects a variant over `max_prompt_growth` and applies a length
     penalty from 90% of the size limit; Cursor: "expect removals to win". Rule: an add must be paired with a
     consolidation; cap lines.
   - **Climb the enforcement ladder**: AHE's single-component ablation — system prompt only 67.4% (below the
     69.7% seed), tools 73.0, middleware 71.9, memory 75.3 — and its own prompt: "same failure persists across 2+
     iterations at one component level → roll back, try another level". In orchestrate terms, a recurring
     mistake that survives a prose SOP fix is lifted to lever 3 (a script) or a `board check` / `brief-check`
     rule, not another sentence.
   - **Leakage self-check** (HarnessX `leakage_guard.py`, verbatim idea): before returning, "could this section
     have been written without seeing these runs? would it help a different run next month?" If not, it is
     state with a `verify_by`, not an SOP rule.
   - **Evidence input** (HALO: a general agent reading raw transcripts "would often overfit to an error present
     in a single/few traces"): feed the pass `postmortem` aggregates — failed checks by name, BLOCKED reasons,
     escalations by tier/role, nudges, repeated `learn --kind failed` keys — each with count and journal-seq
     citations, then have it verify against the repo (HALO's own skill file warns that the engine's file paths are
     dead reckoning until grepped).

3. **Cross-run lessons that survive the archive — path-scoped, line-capped, expiring, never dependent on
   `ctx`** — from teamlore, Agent Memory Repo / Devin Dreaming / MemoryRepo, Hermes Curator, ECC instincts,
   Cursor §6 · value **M–H** · effort **M** · lands in `references/shared-contracts.md` (workspace files),
   `scripts/board` (`KEEP_ON_ARCHIVE`, finish hint, optional `board memory --format amr`),
   `references/shared-token-economy.md` (priming item 3, the field-guide pointer), `docs/recipes.md` (a
   scheduled consolidation recipe) · beats today because `field-guide.md` ("per-run scope", ≤40 lines) is moved
   to `archive/<run-id>/` at the next kickoff (`KEEP_ON_ARCHIVE` keeps only board, toolbox, capabilities,
   archive), so the only cross-run path is `board memory` → `ctx append`, which needs the project-context
   skill — a user without it re-pays every lesson, and Cursor names exactly this file ("a small
   agent-maintained notes file with a line budget, loaded at start") as the promising cross-run saving.
   - Keep the user's ruling (orchestrate never depends on project-context): a plain `.orchestrate/lessons.md`
     in KEEP_ON_ARCHIVE; `ctx` stays an optional sink.
   - Entry shape = Agent Memory Repo's one-line bullet plus teamlore's scope and expiry: `- <lesson> [path:
     src/api/**; source: archive/<run>/journal#seq; added: 2026-10-13; verify_by: 2027-01-13]`. Promotion at
     `board finish` is the existing controller curation gate (surprise not derivable from the repo, names the
     wasted turn); a lesson re-confirmed by a later run renews, an unconfirmed one expires (ECC: confidence
     from recurrence; Curator: active → stale → archived, never deleted, pinned entries exempt).
   - Pointer only where it applies: a brief carries `read: .orchestrate/lessons.md` only when a lesson's
     `path:` overlaps the task's `--owns` (teamlore's recall is path-scoped, capped at 5 entries / 3,200 chars,
     silent when nothing matches). Reason for the scoping: AHE's ACE/TF-GRPO playbooks ride every call and
     cost +11–29% tokens on a different task surface while regressing success.
   - "Dreaming" is not a feature, it is a recipe the skill already supports: `kind=ops strategy=loop
     trigger=schedule:"0 3 * * *"` running a consolidation prompt (merge duplicates, expire past `verify_by`,
     resolve contradictions by opening the cited run's journal — MemoryRepo's `read_source`), skipped when no
     new learnings exist, one commit per pass, its cost ledgered.
   - Say what a lesson is not (Devin docs, teamlore): task status, anything cheap to rediscover from the code,
     secrets, session summaries.

4. **Path-scoped `board learn` delivery** — from teamlore's `recall.js`, Cursor principle 3 ("static context is
   for what most turns need") · value **M** · effort **S** · lands in `scripts/board` (`State.receives()` /
   `unread_learn()`, the digest line) and `shared-token-economy.md` · beats today because `receives()` is team
   scope only — every unread learning reaches every worker under the same dispatcher at its next board call
   (up to `LEARN_SHOW=12` lines of ≤300 chars) and `--path` is display-only, so at fan-out each of N workers
   pays for lessons about files it does not touch. Deliver a learning with `--path` only to open stints whose
   `--owns` overlaps it, broadcast path-less ones, and print "k learnings held back (other areas) — `board
   learn` lists them" so nothing is hidden. Dedup stays normalized-exact (ADK documents the same limit and
   defers real dedup to the nightly pass — candidate 3's consolidation).

5. **Leaf workers never spawn; depth is a recorded fact** — from PawelHuryn's delegation block (Haiku never
   spawns, max depth 2, "return to the parent rather than spawning up"), Cursor §6 ("if the model already
   delegates on its own, remove prompting that pushes it to"; "a different model only when the harness says
   so") · value **M** · effort **S** (but the line must land byte-identically in the replicated blocks,
   `check-sync`) · lands in the WORKER / REVIEWER / MINIMAL blocks (`shared-token-economy.md`, the `prompt-*`
   files) and `strategy-hierarchical.md` ("Depth reality") · beats today because the pack itself probed
   (Claude Code 2.1.296) that a subagent can dispatch a nested one, and no implementer, reviewer or verifier
   prompt says not to — an unprompted child would be unpinned (universal rule 3) and unjournaled (the board
   records only agents the controller dispatches). Frequency in real runs is unknown: before shipping, count
   Agent-tool calls inside a few implementer transcripts. Only `lead-*` / orchestrator-tier roles dispatch; a leaf that needs help
   returns NEEDS_CONTEXT or BLOCKED.

6. **Speed as a dimension, spent on the critical path only — after candidate 1 supplies wall-clock** — from
   Devin Fusion (the config is base model · sidekick model · **Speed: Normal | Fast** · reasoning level; with
   Astra as lead, 24.7 min/task vs 29.4 for Codex alone), the pack's own catalog facts (Opus 5.5 fast mode up to
   2.5× at $8/$40, API-only research preview; Codex `--fast` 1.5× and Ultrafast; Grok fast 2×/2×; Kimi HighSpeed
   6×/3×) · value **M** · effort **M** · lands in `shared-model-routing.md` (append a rule; never renumber),
   `shared-model-catalog.md` (a speed column), SKILL.md dimensions table (+2 lines; 231/250 now), the flight
   plan (a minutes band beside the $ band) · beats today because speed is bought implicitly or not at all: no
   flight-plan line shows wall-clock, so "pay 2× for 2×" is undecidable. Rule: fast only on serial roles
   (staged chain, integrator, final gate, interactive orchestrator); never on fan-out workers (parallelism already
   buys wall-clock) or background lanes (rule 8's cheap-at-max lane is latency-insensitive by design).

## Tools

### Cursor — "Improve this agent harness's token efficiency" prompt (@ericzakariasson, Sep 23; 3.3K likes, 7.9K bookmarks)
- Links: x.com/ericzakariasson/status/2102853511637774551 (the prompt is the post; no repo).
- Evidence: post-only — the full prompt read; every figure in it (≈7% overall cut, −46.9% tokens with MCP schemas
  offloaded, −1.6% from sparse line numbers, +12.5% retrieval accuracy, 10× fewer tool errors, 1/8 cost for
  planner + cheap workers) is one team's production data and cannot be reproduced.
- Mechanism: a procedure, not a tool — map the harness, measure per *task* with price-weighted tokens by billing
  type, rank by share × removable ÷ risk, change directly only telemetry / cache layout / file-offloaded outputs,
  flag prompt and compaction edits, merely propose model-mix and routing changes.
- Versus orchestrate, item by item (`shared-token-economy.md`, `shared-model-routing.md`, `scripts/board`):

| Cursor item | orchestrate today | Verdict |
|---|---|---|
| Objective: price-weighted cost per completed task | `postmortem` prints tokens per accepted task (raw); engine `cost` only when the receipt has one | partial |
| Weight by billing type; per-request usage by type, cache hit rate | `fetch_receipt` sums input+output+cache_read+cache_creation (Claude) or input+output (Codex) into one number; flight-plan band is raw tokens | **missing** (candidate 1) |
| Per-tool share of runs / error rate | journal has per-worker note/exec/learn/send events but no rollup | missing, cheap (candidate 1) |
| P1 Do not ask the model to conserve tokens | blocks ask for signal, not thrift; "reading to understand is work, not waste"; v1.31.0 reversed silent workers | have |
| P2 Definitions not commands; emphasis | ≤2 lines with NEVER/MUST/ALWAYS/IMPORTANT/DO NOT per prompt file (grep); "Must NOT … IN CAPS" kept on two live observations (priming item 2) = Cursor's own "quirks you saw in transcripts" clause; routing rule 10 re-tunes per model | have |
| P3 Static context only for what most turns need | router + lazy references, pointers not payloads, "never preload the entire reference library" | have (strongest) |
| P4 Expect removals to win | "scaffolding is itself a cost" recorded as an open challenge; WORKER block grew 624 → 751 tokens in v1.31.0; no removal audit or ablation runner | partial |
| §2 Label every instruction keep / rewrite / delete / move | no per-line audit; `count-skill-tokens` is per file and undercounts ~20% | partial |
| §2 Volatile content after the cache boundary | blocks byte-stable, per-task variables late ("Cache hygiene") — unmeasured | have, unmeasured |
| §2 Drop caps on tool calls as models improve | the orientation ritual keeps call budgets (≈5 / ≈15 calls) — exactly the kind of cap Cursor removed; re-test per model | partial |
| §3 Offload rarely used tools | host owns schemas; `board` is a CLI; skills load lazily | n/a |
| §4 Never switch models mid-conversation; use a fresh-context subagent | escalation is a fresh re-dispatch one tier up (rule 4); the controller's own model swap is not addressed (Fusion swaps at compaction, where the cache is already cold) | have |
| §5 Big outputs to a file, return path + size + tail | raw-output convention (worker-side) | have |
| §5 Classify tool errors | verifier separates tool failure from task failure (`prompt-verifier.md`); no per-tool rates | partial |
| §6 Compaction short, plan state forward, full history searchable | handoff + probe-test (`shared-handoff.md`); the controller's own transcript path is not in the resume receipt | partial |
| §6 Notes file with a line budget, loaded at start, across runs | `field-guide.md` ≤40 lines but per-run and archived at kickoff | partial → candidate 3 |
| §6 Short subagent handoffs; measure the whole tree; planner judged by worker spend; routing and effort | report schema; rule 11 already quotes the same swarm data; postmortem has per-tier tokens; rules 3, 4, 8, 14 | have |
| §7 Fit the harness to each model | engine blocks + rule 10; no recorded per-model prompt deltas | partial |
| §8 Validate offline and online, record null results | `check-sync` proves structure, not cost or success; "only a billing-page A/B is trustworthy" | **missing** (candidate 1) |
| Traps | one hit: "optimizing raw token counts instead of cost" | — |
- Adopt: candidate 1 (measurement) and the notes-file half of candidate 3; two doc lines — "re-test the orientation
  call budgets whenever the catalog's role pick changes" (`shared-token-economy.md`) and a removal pass as a
  release step (`CONTRIBUTING.md`). Value H / effort M.

### HarnessX — a harness foundry whose evolution engine (AEGIS) edits the harness from traces (Darwin Agent Team; arXiv 2606.14249)
- Links: arxiv.org/abs/2606.14249 (v3, 23 Jul 2026) · github.com/Darwin-Agent/HarnessX (491★, MIT, pushed 2026-10-10).
- Evidence: docs (paper full text read, incl. §4, §6.6, §7, §10.3) + repo-read of two guards
  (`harnessx/meta_harness/processors/write_scope_gate.py`, `leakage_guard.py`); the AEGIS Critic/gate code was not read.
- Mechanism: the harness is a typed composition of processors; each round runs Digester (compress ~10M raw tokens
  per GAIA iteration into per-task outcome, failure category, implicated component, evidence) → Planner (landscape of
  tried and untried edit types, the anti-under-exploration step) → Evolver (candidate edits, each with a change
  manifest and, for new code, a smoke test) → Critic (one revision request) → a **deterministic gate** (manifest
  complete, normalized, smoke test, **seesaw**: no previously solved task regresses); failing candidates are archived
  with the reason. Digester/Planner/Evolver may short-circuit ("no-op round"); Critic and gate never. "LLM subagents
  explore, hypothesize and propose; typed structure and deterministic gates determine what ships." Reported: +14.5%
  average over 15 model×benchmark configs, up to +44.0% (Qwen3.5-9B on ALFWorld) — the weakest model gains most.
  Observed pathologies: reward hacking (a shipped edit raised GAIA 74.8 → 79.6 partly by exploiting verifier
  format), catastrophic forgetting (five same-type edits, then −14.0%), under-exploration (prompt-level edits,
  ship-prediction accuracy 80% → 0%). Variant isolation (fork a harness variant instead of rejecting a mixed edit)
  fixed GAIA's collapse (49.5% → 87.4% final) at 107.8M vs 143.7M tokens. Limitation stated by the authors: no
  held-out evaluation.
- Versus orchestrate: partial. The gates philosophy is shared (`shared-review-gates.md`; "repair never lowers the
  gate"); the evolve pass (`prompt-evolve.md`, `strategy-loop.md`) has none of the gate, manifest, fence, or
  selective invocation.
- Adopt: candidate 2 (fence, manifest with guard set, evidence trigger, same-bucket concentration → consolidate,
  leakage self-check). No: variant isolation, ensemble routing, GRPO co-evolution (need benchmark partitions or
  training).

### HALO — Hierarchical Agent Loop Optimizer (context-labs / inference.net; RLM over OTel traces)
- Links: github.com/context-labs/HALO (1,192★, MIT, pushed 2026-09-08) · PyPI `halo-engine` · cited as the ranking
  step in OpenAI's cookbook "Build an Agent Improvement Loop with Traces, Evals, and Codex".
- Evidence: repo-read (README, `skills/claude/SKILL.md`, `engine/agents/prompt_templates.py`, `prompt_caching.py`);
  benchmark figures are the README's own.
- Mechanism: harness emits OTel-shaped JSONL spans; a root agent with a trace toolkit (`get_dataset_overview` first,
  `query_traces`/`count_traces` with indexed filters, `view_trace` only under ~150K chars else
  `search_trace` → `view_spans`, `synthesize_traces`) writes a report of ranked failure modes with trace ids; a
  *separate* coding agent maps findings to code, makes the smallest edit and re-measures. Design claim: "a general-purpose
  harness like Claude Code is the wrong tool for trace analysis … would often overfit to an error present in a single/few
  traces". Prompt rules worth stealing: `has_errors=false` does not prove success — also search semantic markers
  (`success=false`, `stop_reason`, `timeout`, `quota`, `max_turns`, `budget`); never fabricate ids; on an oversized
  response do not retry, switch tool; a git-pickaxe workflow to find the commit that introduced a prompt fragment
  seen in the traces. Reported: AppWorld Sonnet 4.6 dev SGC 73.7 → 89.5, test_normal 62.5 → 73.2; Gemini 3 Flash
  36.8 → 52.6 / 37.5 → 48.2 (`test_normal` used as a proxy for overfitting).
- Versus orchestrate: partial. The journal *is* a structured trace, but `render_postmortem` rolls up only per-tier
  counts; the evolve pass reads "the last dozen runs' logs" and optionally raw session JSONL.
- Adopt: the evidence-input half of candidate 2 (a deterministic failure-mode rollup with counts and seq citations;
  "ask about the data, then verify against the repo"). No: the RLM engine itself (needs OTel spans and an
  OpenAI-compatible key; the journal makes it redundant).

### Agentic Harness Engineering (AHE) — Fudan / PKU / Qiji Zhifeng, arXiv 2604.25850
- Links: arxiv.org/abs/2604.25850 (v4, 18 May 2026) · github.com/china-qijizhifeng/agentic-harness-engineering (918★, MIT,
  pushed 2026-08-03).
- Evidence: docs (paper full text incl. Alg. 1, Table 3, §4.4.2, App. B.2 evolve prompt); repo not read.
- Mechanism: seven component types as files in one git workspace (prompt, tool description, tool code, middleware,
  skill, sub-agent config, long-term memory), one commit per logical edit. An "Agent Debugger" turns millions of
  trajectory tokens into a layered corpus (benchmark overview → per-task root-cause report → raw traces, progressive
  disclosure). The Evolve agent writes only inside the workspace (runs/, tracer, verifier, LLM config read-only; seed
  prompt non-deletable) and attaches a manifest to every edit: failure evidence, root cause, targeted fix, predicted
  impact (tasks to fix + tasks at risk). The next round intersects prediction with observed deltas and **reverts
  falsified edits at file granularity before** distilling new evidence. Terminal-Bench 2 pass@1 69.7 → 77.0 in ten
  iterations (~32 h), beating Codex 71.9 and ACE 68.9 / TF-GRPO 72.3 from the same seed; frozen harness on
  SWE-bench-verified: 75.6% vs seed 75.2% using 461K vs 526K tokens (−12%) while ACE/TF-GRPO used +11–29% more and lost.
  Ablation: tools, middleware and memory carry the gain; the system prompt alone *regresses* (67.4 vs 69.7); stacked
  components interact non-additively (single-component gains sum to +11.1 pp vs +7.3 pp for the full set).
- Versus orchestrate: missing as a loop discipline (`prompt-evolve.md` returns `changes / evidence / watch` prose).
  Supports the pack's existing direction of encoding rules as `board` enforcement rather than reference prose.
- Adopt: candidate 2 (manifest, attribute-before-edit, revert, enforcement-ladder rule). Value H / effort S–M.

### Hermes Curator + hermes-agent-self-evolution (Nous Research)
- Links: github.com/NousResearch/hermes-agent (253K★, MIT, pushed 2026-10-13; `agent/curator.py`) ·
  github.com/NousResearch/hermes-agent-self-evolution (5.5K★, pushed 2026-06-17; README says MIT, API shows no license file).
- Evidence: repo-read (`curator.py` header and transitions; self-evolution README, `fitness.py`, `constraints.py`);
  the docs page agrees except the thresholds (docs 30/90 days, code 14/30).
- Mechanism: the Curator is **inactivity-triggered** (idle ≥2 h and last run older than 168 h; no daemon; first
  observation only seeds the clock). Layer 1 is deterministic with no LLM: usage timestamps move agent-created
  skills active → stale → archived; layer 2, LLM consolidation, is *off by default* (`hermes curator run
  --consolidate`). Invariants: only agent-created skills touched, **never delete — archive, recoverable**, pinned
  bypass everything, cron-referenced skills count as pinned, the fork never touches the main prompt cache,
  `--dry-run` previews, backup and rollback commands exist. Self-evolution (DSPy + GEPA, ~$2–10 per run) reads
  execution traces, mutates a SKILL.md, scores with an LLM judge (correctness 0.5 / procedure 0.3 / conciseness
  0.2, length penalty from 90% of the size cap) and then applies **hard constraint gates**: size limit, growth
  limit vs baseline, non-empty, structure, full test suite at 100%, and a PR for human review — never a direct
  commit. Rigario's tip: add a second cron job that evaluates the first and stops anything gaming the loop.
- Versus orchestrate: missing for cross-run state; the loop's evolve pass is the closest analogue and has no growth
  gate. Orchestrate creates no skills, so the skill-lifecycle half does not transfer — the invariants do.
- Adopt: the lifecycle invariants and the growth limit inside candidates 2 and 3 (deterministic prune before any LLM
  consolidation; archive, never delete; pin; dry-run). No: the DSPy/GEPA optimizer (needs a runnable eval set, which
  the repo lacks until candidate 1).

### Cognition "Dreaming", Agent Memory Repo, MemoryRepo (open implementation)
- Links: cognition.com/agent-memory-repo · github.com/AgentMemoryRepo/agentmemoryrepo (778★, MIT, created 2026-10-04) ·
  docs.devin.ai/product-guides/memory · github.com/supermemoryai/memoryrepo (97★, pushed 2026-10-06).
- Evidence: repo-read (SPEC.md, README, memoryrepo README) + docs (Devin memory page, Cognition spec page).
  Devin's dreaming agent itself is not in the open repo ("scheduled Dreaming is not included").
- Mechanism: memory is a git repo of Markdown; `MEMORY.md` is the always-loaded entry ("only what every session needs,
  plus links"); entries are one-line bullets with `[source: <session link>; added: YYYY-MM-DD]`; `[[path]]` links;
  loop = clone → grep/follow links → update with no human → push after every edit; concurrent writes via git (second
  push rejected, agent reads both). Devin: not saved — session summaries, task state, anything cheap to rediscover,
  secrets; new memory applies to future sessions only; automation-started sessions do not read or write memory.
  **Dreaming** = a separate daily background agent that consolidates overlapping notes, removes transient and unused
  stale notes, adds missed lessons, reorganizes the index, preserves source links and explicit preferences.
  MemoryRepo's version: runs every 4 h *only if new messages exist*, its own model choice, tools `bash`, `write_file`,
  `read_source` (open the conversation behind a `[source]` to resolve a contradiction), `commit`; one commit per dream;
  a same-file conflict drops the dream and retries; every turn and dream has a cost ledger.
- Versus orchestrate: partial. `board learn --path` + `board memory` carry lessons and sources within and out of a run,
  but nothing persists them across runs without `ctx`, and nothing consolidates (`learn` dedup is normalized-exact).
- Adopt: candidate 3 (bullet shape with source and date; dream as a scheduled `ops` loop recipe, grounded by opening
  the cited journal; skip when idle; one revertible commit). Optional: `board memory --format amr` as a second printed
  sink (value L / effort S). Caveats from the independent analysis (rywalker.com): retrieval quality and dreaming accuracy
  are unmeasured, consolidation can turn a one-off into a rule, git history keeps deleted content.

### Google ADK "Long Horizon" agent harness (Apache-2.0 reference; google/adk-samples)
- Links: github.com/google/adk-samples/tree/main/core/python/long-horizon-harness (repo 10.4K★, pushed 2026-10-13).
- Evidence: repo-read (`docs/memory.md`, `docs/context-budget.md`, `conversation/graceful_halt.py`,
  `iteration_budget.py`); the Google Cloud Tech "5 design patterns" post via a mirror.
- Mechanism worth lifting: (1) a **review fork** after each turn — a restricted cheap model with only memory and
  skill-write tools, fire-and-forget, throttled (120 s cooldown, 50 per session), drained ~4 s at shutdown; (2) a
  **pre-compaction flush fork** that rescues durable facts right before old events are summarized; (3) memory
  writes scanned for invisible Unicode, injection and exfil patterns because memory is replayed into future turns;
  (4) char-budgeted memory (user 1,375, agent 2,200 — the same numbers as Hermes); (5) dedup is exact-text only,
  real dedup and contradiction reconciliation only in the nightly pass (`memories.generate`, 24 h lookback, 50
  sessions, returns `{created, updated, deleted}` counts); (6) a skill curator with usage counters (≥3 edits promote,
  ≥5 views and 0 edits flag); (7) **graceful halt**: at an iteration or tool-call cap the harness strips the tools
  and appends a text-only "summary / remaining / next steps" turn; (8) a prompt-size budget test (see candidate 1);
  (9) per-turn volatile content rides as trailing `<system-reminder>` blocks, never in the cached system prompt.
  The dream itself is a managed Vertex Memory Bank call and cannot run locally.
- Versus orchestrate: mostly have — the journal replaces memory forks, `board resume` replaces the pre-compaction
  flush, `clean()` strips the same invisible Unicode (`scripts/board` `CONTROL_RE`) though not injection patterns,
  safety-rails ask for a handoff at budget exhaustion. The harness-level strip-tools halt is not available to a skill.
- Adopt: the aggregate prompt-budget guard (candidate 1). No: Memory Bank, forks (host-level).

### Stanford "Shepherd" — agent-native Git (Northeastern + Stanford; arXiv 2605.10913)
- Links: github.com/shepherd-agents/shepherd (2.5K★, MIT, pushed 2026-09-09, "early alpha") · pip `shepherd-ai`.
- Evidence: repo-read (README) + docs (paper §3–§5, App. A, E).
- Mechanism: a Python runtime that records a run as typed effect events and commits process + filesystem state
  copy-on-write, so any past state is forked, replayed or reverted (reported ~5× faster than `docker commit`; >95%
  prompt-cache reuse on replay because the prefix is byte-identical); tasks are bodiless Python functions whose
  signature is the permission surface (`May[GitRepo, ReadOnly]`), enforced by Seatbelt/Landlock; work comes back as a
  *retained output* — a proposal to `select` / `apply` (three-way merge onto a workspace that moved on) / `discard`.
  Meta-agents on top: a **runtime supervisor** that observes both workers' effect streams every few seconds and uses
  three verbs — `inject` guidance, `handoff` (fork the leading worker's scope as the follower's new root), `discard` —
  took CooperBench pair-coding from 28.8% (peers messaging) to 54.7% with an Opus supervisor (solo ceiling 57.2%) at
  24.2 vs 28.4 min solo; and **Counterfactual Replay Optimization**, which forks the trace at the first commit an edit
  would affect, replays only the suffix, and validates each edit on a *fix set plus a guard set* (best on 4 of 5
  datasets, 27–58% less wall-clock than MetaHarness). Irreversible effects: refused at the syscall, not undone.
- Versus orchestrate: partial for the principles. Worktrees + `board resume` (state layer + HEAD + journal cursor +
  resume-by-id) are the file-state half; mail, `nudge`, `escalate` and `reap` are the supervisor verbs minus a mid-turn
  channel ("no CLI-agnostic interrupt exists", `strategy-team.md`); the fix/guard split is what candidate 2 imports.
  The recovery ladder (`shared-review-gates.md`: fix wave → tier escalation → human) has no "reset the worktree to the last
  gated commit and re-dispatch the remainder" rung (workers commit in small steps, so the sha exists).
- Adopt: no for the runtime (CoW process snapshots are infrastructure). Two cheap, low-value residues: a salvage rung in
  the ladder, and the controller's own session/transcript path in the `board resume` receipt so a successor or the
  evolve pass can grep what the summary dropped (Cursor §6). Value L / effort S.

### Kimi AgentENV (Moonshot × kvcache-ai)
- Links: github.com/kvcache-ai/AgentENV (3.6K★, MIT, pushed 2026-10-13).
- Evidence: repo-read (README head only).
- Mechanism: Firecracker microVMs at scale (OCI images via overlaybd; resume <50 ms, pause <100 ms; incremental memory +
  filesystem snapshots <100 ms; a running sandbox forks into several independent ones — a secondary summary says up to
  16; S3 or distributed-FS snapshots); built for agentic RL training of Kimi K3. Linux 6.8+, `/dev/kvm`; the README warns
  the API authenticates requests but does not encrypt traffic.
- Versus orchestrate: n/a — infrastructure under the harness. Adopt: no (one line: a possible future sandbox backend, not a
  skill matter).

### Devin Fusion — frontier lead + cheaper sidekick (Cognition; benchmarked by Artificial Analysis)
- Links: cognition.com/blog/devin-fusion · deeplearning.ai/the-batch/one-agent-works-another-directs · @dabit3 and
  @ArtificialAnlys posts. SWE-2 is proprietary (a Kimi K3 fine-tune), only in Devin Desktop/CLI.
- Evidence: docs (Cognition blog and The Batch, both read through a summarizer, not raw); AA numbers via The Batch.
- Mechanism: two agents run in parallel, each with its own tools, **persistent context and prompt cache**; the lead
  should "only read what is absolutely necessary", keeps the plan, the interpretation of ambiguity and the final review, and
  delegates a brief (constraints, success criteria — per The Batch; the blog does not specify the brief format); the
  sidekick (reading, editing, testing) reports back; lightweight
  classifiers during execution signal when work returns to the lead or the sidekick is upgraded; **swaps happen at
  compaction, because that "would trigger a cache miss anyway"**. SWE-2 is RL-trained with a reward that subtracts money
  and time from success. AA Coding Agent Index v1.5: Fable 5.1 (xhigh) lead + SWE-2 (medium) = 62 at $7.90/task, 35.8 min
  vs Claude Code with Fable 5.1 alone 62 at $12.40, 34.8 min; Astra lead + SWE-2 = 59 at $4.54, 24.7 min vs Codex Astra alone
  62 at $7.47, 29.4 min; Fusion used +70% tokens and ~3× the turns of Fable alone; Vals code-migration mixed; Cognition's
  own page: "delegating judgment-heavy work backfires", cost cuts of 25–62% per task with mixed scores.
- Versus orchestrate: have — the default shape (orchestrator tier that reads little + worker tier) is the Fusion shape, with
  explicit briefs and typed returns; routing rules 2, 3, 6, 7 and posture cover the same economics. Differences: orchestrate's
  workers are short-lived and fresh by design (context-rot argument, `token-optimization.md`), and a tier change is a fresh
  dispatch, which is already cache-free. The controller's own model/effort re-pick at a handoff or compaction boundary is
  unstated.
- Adopt: evidence rows for the catalog (the lead + cheap-executor shape retains quality at lower $ but *raises* tokens and
  turns — the case for candidate 1); one sentence in `shared-model-routing.md` ("re-pick the controller's tier only at a
  handoff or compaction, where the cache is already cold"); the speed dial is candidate 6. No: building a persistent
  concurrent sidekick (needs a host that keeps two live sessions).

### Atomic Fusion / Atomic Agent Desktop
- Links: atomicagent.io; post by @atomicagent_io.
- Evidence: post-only for "Atomic Fusion orchestrates cloud and local models to reduce costs" — the site does not mention
  Fusion; it documents a local llama.cpp desktop agent (local model returns a list of next actions under grammar constraints,
  risky steps pause for approval), a TurboQuant-quantized long-context claim, and one benchmark (GAIA L1, 53 tasks: 69.8% vs
  Hermes 58.5%, 217 s vs 351 s).
- Versus orchestrate / Adopt: no mechanism to compare; local-first routing is already `opencode`/`pi` engines plus the
  catalog's open-model rows.

### Prime Agent (Prime Intellect) — RLM harness with a "Continual Harness"
- Links: github.com/PrimeIntellect-ai/prime-agent (22.0K★, MIT per README, pushed 2026-10-13) · arXiv 2608.23552 and
  2605.09998 (Continual Harness).
- Evidence: repo-read (README, `crates/pa-core/src/refinement/mod.rs`, `session_engine/auto_refine_trigger.rs`); the
  ARC-AGI-3 headline (95.5% best@1 with Opus 5, vs 30.2% on a vanilla harness) is vendor-reported and was contested in
  the press as possibly benchmark-gaming; not verified.
- Mechanism: a persistent IPython kernel is the single built-in tool; subagents are `rlm.spawn(...)` calls; skills are
  importable packages. **Continual Harness** keeps supplemental state (kinds: prompt, memory, skill, subagent, factory) as
  versioned entries with a `refinement_history.jsonl` of events `{trigger, changes, evidence, outcome}`; `/refine`
  applies "small, evidence-backed updates", **never rewrites the immutable base system prompt**, snapshots support
  rollback. Auto-refine is armed by a successful compaction, then a *review* decides (cooldown, settled-turn count, stale
  rounds on an abandoned branch dropped) and only an approving review refines. The state module caps its "overview" at 3
  entries per kind, 10 refinements and 140 characters each (module constants; I did not trace the prompt renderer).
- Versus orchestrate: partial — `strategy-workflow.md` holds fan-out in a script and `strategy-hierarchical.md` already
  names the RLM "recursion stack" pattern. The immutable-base / mutable-supplement split is the fence in candidate 2.
- Adopt: candidate 2 (review-then-refine with cooldown; evidence and outcome recorded per event; bounded overview into the
  prompt). Also a possible `engine=` for lane D to probe (headless print mode, ACP daemon) — not tested here.

### Fractal (Trampoline AI) — RLM CLI on `predict-rlm`
- Links: github.com/Trampoline-AI/fractal (199★, pushed 2026-07-16). Evidence: repo skim (README head): early alpha,
  macOS-only, needs Docker `sbx`. Versus orchestrate: the RLM idea is already in `strategy-hierarchical.md` and
  `strategy-workflow.md`. Adopt: no.

### Composio harness comparisons (Kimi K3 across 6 harnesses; DeepSeek V4 Flash across 4 more)
- Links: Composio X threads (not reachable without xrelay); secondary press only.
- Evidence: post-only. Secondary summaries disagree on setup (a 26-task six-harness claim vs a 28-task three-harness report)
  and report: Hermes ~$0.39, Pi ~$0.40, Claude Code ~$1.47 per task, Kimi K3 using ~6× the tokens in Claude Code as in
  Kimi Code at a similar success rate, median task 61K–340K tokens, Codex last on success; DeepSeek V4 Flash: Oh My Pi
  17/30, Claude Code and Codex 16/30, OpenCode 14/30, ~3× cost and 2.2× speed spread.
- Versus orchestrate: have the principle ("the same model moves 15–20 points between harnesses, so compare rows",
  `shared-model-catalog.md`). Adopt: no — optionally a "tokens per task, same model" column once candidate 1 can measure it;
  the unverified numbers should not enter the catalog.

### Rohit (@rohit4verse) — seven-layer agentic stack (Jul 31 re-post of the Jul 22 article, "using Kimi K3")
- Evidence: docs (`$R/x/rohit-7-layers.md` read) + the Aug sweep's entry 8 (`2026-08-frontier-sweep-x.md`).
- Delta: none structural. The seven layers, five-part task contract, four-section context pack, tool-vs-task failure,
  escalation-with-state, three memory kinds, three budget levels, single-vendor risk are the same; the re-post adds K3 prices
  and arena/AA figures (catalog territory).
- Landed since the sweep: the four-state verifier (`prompt-verifier.md`), tool-vs-task failure (`prompt-verifier.md`,
  `shared-contracts.md:76–77`), the escalation packet (`shared-contracts.md:50–52`), cost per accepted task
  (`board postmortem`, `board resume`). Still open: provider failover / a fallback pick per role (rule 13 observes drift
  but names no fallback) and a *daily* budget level (the `budget` dimension is cycles | agents | tokens | $). Value L.

### pidotdev / Earendil — "what a harness is"
- Evidence: post-only (blog not found: a guessed pi.dev URL 404s; searches returned nothing). Four parts — system prompt, tools,
  agentic loop, a translation layer across models — the same decomposition as Akshay's article. Adopt: no.

### Akshay Pachaar — "The Anatomy of an Agent Harness" ($R/x/akshay-harnessx.md; quoted by the HarnessX post)
- Evidence: docs (read). A synthesis of the twelve harness components; the claims relevant here are already encoded:
  three-tier memory with the agent treating memory as a *hint* to verify (`shared-handoff.md`: "frame claims as context to
  verify"), observation masking and just-in-time retrieval (raw-output convention), "wide and shallow beats deep"
  (`strategy-hierarchical.md`), Anthropic's "thin harness, delete scaffolding as models improve" (Cursor P4, same point as
  candidate 2's growth ceiling). Adopt: no.

### ECC — "agent harness operating system" (affaan-m/ECC)
- Links: github.com/affaan-m/ECC (278K★, MIT, pushed 2026-10-12; 4.6K files across a dozen harness dirs).
- Evidence: repo-read of `skills/continuous-learning-v2/SKILL.md` only; the bundle itself was not audited.
- Mechanism: Pre/PostToolUse hooks capture 100% of tool activity to `observations.jsonl` per project; a background Haiku
  observer (off by default, every 5 min, ≥20 observations) writes atomic *instincts* — one trigger, one action, confidence
  0.3–0.9, evidence, scope project|global; `/promote` moves an instinct to global when seen in ≥2 projects; `/evolve`
  clusters instincts into skills, commands, agents. Project id = hash of the git remote, to stop cross-project contamination.
- Versus orchestrate: partial — `board learn` kinds and `--path` are the instinct without confidence, scope promotion or
  clustering. Hook capture is host-specific (Claude Code); the journal already records deterministic events on every host.
- Adopt: the recurrence → confidence → promotion idea inside candidate 3 (a lesson re-confirmed by a later run renews and
  promotes; scope by repo remote). No: the hook observer.

### teamlore — team memory as a folder in the repo (lak7/teamlore, npm 0.3.0)
- Links: github.com/lak7/teamlore (74★, MIT, pushed 2026-07-31). Evidence: repo-read (`templates/skill/SKILL.md`,
  `scripts/recall.js` head); `scarmap` and the installer not read.
- Mechanism: `.lore/YYYY-MM-DD-slug.md`, one lesson per file, front matter `paths` (globs), `kind` (mistake | gotcha |
  decision), `by`, `commit` (anchors staleness), `verify_by` (~+90 days), body ≤120 words; write triggers (the user corrects
  you; a surprising failure; a decision with a stated why; about to edit a file that has lore); a negative list (status,
  preferences, secrets, anything the code says); staged but **never committed by the agent — a human merges through PR**;
  recall is hook-injected, path-scoped (SessionStart digest from git-recent files, PreToolUse per file), hard-capped at 5
  entries / 3,200 chars (~800 tokens) and silent when nothing matches.
- Versus orchestrate: partial — `learn --kind … --path` has kinds and a path but no scoping at delivery, no staleness anchor,
  no cross-run persistence. Adopt: candidates 3 and 4. Value M / effort M.

### 0xMovez — "trace every run → judge with an LLM → diagnose → fix → ship"
- Evidence: post-only (the underlying X article x.com/i/article/2064357550225510400 is unfetched; xrelay not allowed in this
  lane). The same loop is documented first-party in OpenAI's cookbook (docs: traces → human + model feedback → generated
  evals → Promptfoo gate at a 0.8 rubric threshold → HALO ranks changes → a Codex handoff), whose own stated limitation is
  that the gate scores the same traces the evals came from — not held-out.
- Versus orchestrate: the loop *is* journal → `postmortem` → evolve; the missing links are the held-out/guard set and the
  gate (candidate 2). Adopt: no separate item.

### PawelHuryn — task-delegation block for CLAUDE.md
- Evidence: post (full block read); the ">50% token saving in a week" is the author's bet, unmeasured.
- Content vs orchestrate: don't spawn when the parent needs the reasoning or spawn overhead dominates (universal rule 8,
  "reject orchestration when …"); Haiku bulk / Sonnet scoped / Opus tradeoffs (routing rule 3 and the catalog, richer);
  parent owns synthesis (rule 1); free-first tool ladder and "wrap recurring fetch patterns as dedicated tools"
  (Prepare + evolve lever 3). **New**: leaf tiers never spawn, depth ≤2, return to the parent instead of spawning up →
  candidate 5. Minor: `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80` and `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` as controller-session
  knobs for "Session hygiene" in `shared-token-economy.md` (orchestrate's state is on disk, so early compaction is cheap) —
  value L, unverified savings.

## Not worth adopting (one line each, why)
- **AgentENV / Shepherd runtime**: copy-on-write VM and process snapshots are infrastructure; a skill can only keep git worktrees and the journal.
- **HarnessX variant isolation, ensemble routing, GRPO co-evolution**: need benchmark partitions or model training.
- **HALO engine, DSPy/GEPA optimizer**: need OTel spans or a runnable eval set; the journal plus candidate 1 come first.
- **ADK Memory Bank, review/flush forks, strip-tools halt**: managed-service and harness-level; the journal, `board resume` and the handoff cover the skill-level intent.
- **ECC hook observer**: host-specific; the journal captures deterministic events on every host.
- **Fractal / predict-rlm, Atomic Agent Desktop**: alpha CLI and local desktop app; RLM recursion is already `strategy-workflow` / the hierarchical "recursion stack".
- **Persistent concurrent sidekick (Fusion)**: needs two live sessions; the fresh-worker design is deliberate.
- **Composio numbers, pidotdev, Akshay's anatomy, 0xMovez**: secondary, definitional, or already encoded.
- **TTL-aware resume-vs-redispatch**: considered and dropped — re-prefilling a stalled session costs cents against a worker redoing output tokens, so resume-by-id stays the rule.

## Gaps (what you could not verify, and why)
- Cursor's figures (7%, 46.9%, 1.6%, 12.5%, 10×, 1/8 cost) are one team's production data in a post — no source to open.
- HarnessX: AEGIS Critic prompts and the gate implementation were not read (only two guard processors); AHE's repo was not read
  (paper only); Prime Agent's `/refine` prompt and the Continual Harness paper body were not read (abstract only).
- The ARC-AGI-3 and AppWorld headline numbers are vendor-reported; no independent replication seen.
- Devin Dreaming's own algorithm is not published (the spec repo says so); only the daily cadence and behaviors from the docs page.
  memoryrepo.dev itself returned only a title; the open implementation was read from its GitHub README.
- Cognition's blog and The Batch were read through a summarizing fetch, not raw; Fusion's AA numbers are second-hand.
- 0xMovez's article, pidotdev's post and Composio's threads were not retrievable (X article / blog not found); Atomic Fusion has
  no documented mechanism.
- Whether workers in real runs spawn unprompted nested subagents (candidate 5) — no transcripts read.
- That Codex's `turn.completed.usage` carries a cached-input field — not verified here (the board reads input and output only);
  Claude's `result.usage` four fields are read by the board's own parser. The o200k token ratios are OpenAI's tokenizer, not
  Anthropic's (Anthropic's newer tokenizer is reported to produce ~30% more tokens than earlier ones).
- ECC's other 4.6K files (security scanner, other commands) were not audited; teamlore's `scarmap` and installer neither.
