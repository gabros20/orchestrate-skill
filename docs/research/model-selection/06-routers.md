# 06 — How model routers decide (accessed 2026-09-30)

Grades: [V] vendor-official, [B] independent benchmark, [P] practitioner/secondary, [L] local probe. Most content here was read
through WebFetch/WebSearch summaries (a small model paraphrases the page); quoted strings are as returned by the tool, so
re-verify any quote before publishing it verbatim. Nothing here is a local probe.

## Summary

- Every router reduces to the same pipeline: filter candidates by hard constraints (allow/deny list, modality, plan/policy, availability), predict quality per candidate from a task label or embedding, then choose on a cost/latency/quality trade-off, with an ordered fallback list. [V S1,S3,S5,S6,S9,S10]
- The one quality signal that is empirical and refreshed is per-task-label observed performance: Cursor uses a "one-sided 75% uplift threshold" per task label [V S5]; OpenRouter Auto uses trailing-7-day community spend per ~30 task types [V S1]. Neither uses vendor benchmark scores.
- Independent evidence says learned routers are weak: LLMRouterBench (Jan 2026, 21 datasets, 33 models, 10 baselines) found commercial routers "fail to reliably outperform a simple baseline" [B S12]; OpenRouter scored "-24.7%" vs best single model GPT-5 in its performance-cost setting [B S12b]. Curated small pools beat big pools [B S12].
- For an orchestrator this argues for a hand-curated role table (small, explicit) rather than a per-prompt learned router. Roles are a coarse task taxonomy that a human can label reliably, which is where classifiers are strongest (Cursor's domain/task/modifier taxonomy is the same idea) [V S5].
- Parameters that actually change decisions across routers: hard filters (allow/exclude, modality, context fit, policy), a single quality-vs-cost dial (Not Diamond 0-10, OpenRouter cost_tier bands, Martian willingness_to_pay, RouteLLM threshold, Cursor cost/balanced/intelligence), latency/throughput preference, and fallback order on 429/5xx.
- Human-preference leaderboards (LMArena) and index scores (Artificial Analysis) are used to shortlist, not to route: AA gives a 3-axis intelligence/speed/price frontier, LMArena gives style-controlled Bradley-Terry Elo by category. Both are pool-level, not task-level.
- Cline/Kilo guidance is the same role split we need: frontier reasoner for plan, cheaper fast model for act; context window matched to repo size [V S15,S16 / P S17].
- Auto routers bill at the routed model's list price (OpenRouter no fee; Cursor list price + token rate for third party) so there is no cost penalty for routing itself, but there is opacity. [V S1,S6]

## Findings

### Table 1 — routers x decision inputs

Legend: Y = documented input, - = not documented in what I could read (not a claim it is absent).

| Router | Task features | Quality prediction | Price | Latency | Context need | Modality | User pref / Pareto weight | Fallback / availability | Src |
|---|---|---|---|---|---|---|---|---|---|
| OpenRouter Auto (current) | Y: classifier assigns one of "~30 fine-grained task types" | Y: ranking by trailing-7-day aggregate community spend per task type, not a quality score | Y: `cost_tier` band low/medium/high/xhigh/max ("a band, not a ceiling") | - | - | Y: respects "output-modality requirements" | `allowed_models` / `excluded_models` wildcards; `cost_quality_tradeoff` deprecated | account restrictions, guardrails | [V S1] |
| OpenRouter Auto (old, Not Diamond powered) | prompt complexity, task type | Y (Not Diamond) | `cost_quality_tradeoff` 0 (quality) to 10 (cost), default 7 | - | - | - | that dial | - | [P S2, deprecated] |
| OpenRouter provider routing (per model) | - | - | `sort: price`, `max_price`, `:floor` (flex tier) | `sort: latency`, `preferred_max_latency`, `preferred_min_throughput`, `:nitro` (priority tier) | - | - | `order`, `only`, `ignore`, `quantizations`, `data_collection` | `allow_fallbacks`, `require_parameters` | [V S3] |
| Not Diamond | prompt content | Y: pre-trained cross-domain router or custom router trained on your eval data ("preference ID") | Y: "Cost tradeoff - Prefer cheaper models when quality is comparable" | Y: latency mode | - | - | `cost_quality_tradeoff` integer 0-10 blends signals; Pareto optimisation | default/fallback not documented in pages read | [V S7, P S7b] |
| Martian | prompt; "model mapping" predicts performance without running the model | Y | `max_cost` | - | - | - | `willingness_to_pay` ("how many dollars you are willing to pay for a 10% better answer") | `models` list restricts pool | [P S8 search summary; docs page 404 on direct fetch] |
| RouteLLM (LMSYS) | prompt embedding | Y: win-probability of strong model from human preference data; routers mf, sw_ranking, bert, causal_llm | implicit via threshold | - | - | - | one `cost threshold`, calibrated to a target strong-model call ratio | - (binary strong/weak pair) | [V S9, S10] |
| Arch-Router / Plano (Katanemo) | domain + action inferred by 1.5B model | no: matches to user-written `name`+`description` policies, not measured quality | - | `fastest` routing reads observed latency from Prometheus | - | - | user-defined route policies; `models` ordered list | first model primary, rest fallbacks on 429/5xx | [V S11, S11b] |
| Cursor Router (Auto) | Y: turn signals, task category, recent tool calls; taxonomy of domains/tasks/modifiers; "Compass" complexity predictor | Y: per-label observed performance, eligible only above "one-sided 75% uplift threshold" | Y: cheap model (Grok) for low-complexity turns; budget-constrained mix | speed in Balance mode | conversation state | visual-heavy modifier | modes cost / balanced / intelligence (`auto-smart`, `optimize_for`) | admin can enable/disable, force default | [V S5, S6] |
| GitHub Copilot auto | task complexity | Y: separate complexity system | 10% discount on paid plans | Y: real-time system health | - | - | plan/policy | excludes models unavailable in plan, admin-restricted, data-residency/FedRAMP-restricted | [V S4] |
| Requesty | classifies task (code, chat, SQL, creative) | Y | Y | Y: latency routing from live response times | - | - | policies: fallback, load_balance, latency; nestable | Y | [P S13] |
| Portkey | request metadata (plan, region, beta flag) | no | load-balance weights | - | - | - | conditional rules on metadata | fallback chains, strategies nestable | [P S14] |
| Kilo Auto | - | - | `kilo-auto/efficient`, `kilo-auto/free` tiers | - | - | - | tier choice | - | [V S16] |

Cells I could not fill (Unify, Kilo Auto internals, OpenRouter new Auto quality method beyond spend) are unknown, not "no".

### Table 2 — evidence on whether routers work

| Claim | Number | Grade / source | Note |
|---|---|---|---|
| RouteLLM cost reduction at 95% of GPT-4 quality | "up to 85%" on MT Bench | [V S10] vendor-reported | Two-model pair only (GPT-4 vs Mixtral); old models |
| RouteLLM vs commercial routers | ">40% cheaper" at same performance | [V S10] | Vendor-reported |
| Router transfer | routers "maintain their performance even when the strong and weak models are changed at test time" | [V S9 abstract] | Supports swapping models in a table without retraining |
| Route to Reason | >60% token reduction, above best single model, 7 models x 4 reasoning strategies | [V S18 abstract] | Routes model AND reasoning strategy: analogue of harness+effort |
| Cursor Auto Intelligence | "above Fable-level user satisfaction at 68% lower cost" (as of 2026-08-06) | [V S5] vendor, own satisfaction metric | Not independently verifiable |
| Cursor Auto Balance | "outperforms Opus 4.8 at 41% lower cost" (as of 2026-08-06) | [V S5] | Same caveat |
| LLMRouterBench (2026-01-12) | 400K+ instances, 21 datasets, 33 models, 10 baselines; commercial routers "fail to reliably outperform a simple baseline"; OpenRouter -24.7% vs best single (GPT-5) | [B S12] independent academic | Measured the older OpenRouter/NotDiamond-era router, not today's spend-based Auto |
| Oracle gap | "persistent model-recall failures": on queries where <=3 experts are right (11.9% of test), best routers reach 24.6% / 23.2% | [B S12] | Routers cannot find the rare model that is uniquely right |
| Pool size | "careful curation can outweigh simply scaling the pool" | [B S12] | Supports small role table |
| RouterEval (2503.10657) | 200M+ records, 12 evals, 8,500+ LLMs; capable router beats best single as candidates grow; big gap to oracle remains | [B S19 via search summary] | Exact numbers not read |
| RouterBench (2403.12031) | 405k+ inference outcomes; "no single model can optimally address all tasks and applications" | [B S20 abstract] | |

### Table 3 — leaderboards as selection aids

| Source | What it gives | How it says to choose | Grade / src |
|---|---|---|---|
| Artificial Analysis Intelligence Index v4.3.2 | 10 evals: Agents 30% (AA-Briefcase v1.1 15, GDPval-AA v2.1 10, AutomationBench-AA 5), Coding 20% (Terminal-Bench 4.0 10, SciCode 10), General 30% (AA-Omniscience 15, GDP.pdf 10, AA-LCR v1.1 5), Sci reasoning 20% (HLE 10, CritPt 10). CI "less than ±1%". Text/English only; vision, multilingual, speech separate | Three axes: intelligence, speed (output tokens/s), price (USD/1M, 3:1 input:output blend); pick along intelligence/price/speed frontiers. "they do not all follow the same price-quality curve" (older page) | [B S21, S22] |
| LMArena | 7M+ votes, 360+ models, Bradley-Terry with confidence intervals, Style Control removes length/format bias, categories (Coding, Hard Prompts, Multilingual, Long-Query, Vision, Multi-turn), Code Arena WebDev | Shortlist with style-controlled + category boards; check rank spread, not point score | [B/P S23 secondary] |

### Notes

- What is a decision input vs noise. Across routers the inputs that recur are: task label, cost dial, latency preference, hard filters (modality, policy, allow-list), fallback order. Nobody routes on vendor MMLU-style scores; the quality signal is either human-preference (RouteLLM, LMArena), aggregate spend (OpenRouter), observed per-label outcomes with an uplift threshold (Cursor), or user-authored policy (Arch-Router).
- Cursor's rule is the most transferable statistical idea: a candidate is eligible for a task label only when its observed result beats the baseline with one-sided 75% confidence, then choose the best mix within budget [V S5]. For an orchestrator, translate as: a model may take a role only if there is evidence (benchmark or own run) that it beats the cheap default for that role.
- Cursor's own per-model strengths (as of 2026-08-06) are a practitioner-grade data point on role fit: Grok cheap for Git commands and DB ops; Sol planning and codebase comprehension; Opus devops, DB queries, perf optimisation; Fable debugging and visual implementation [V S5, vendor claim from its own traffic].
- Arch-Router's key design: "decouples routing policy (how to choose) from model assignment (what to run)" [V S11b]. That is exactly a role table: roles are stable, models bound to roles are edited when models ship. Its `models` list is ordered, first primary and rest fallbacks.
- Copilot and Cursor both exclude models by plan/policy before ranking: availability is a filter, not a score.
- Cline plan/act split: frontier reasoner for plan and cheaper faster model for act [P S17, secondary summary of docs.cline.bot plan-and-act; direct docs page for model guide returned 404]. Kilo: premium for large refactors and architecture, mid-tier for everyday coding, context 32-64K small / 128K standard / 256K+ large codebases [V S16].
- Roo Code was archived 2026-05-15 and Kilo is described as the upgrade path [P S24, search summary; low reliability].

## (2) What generalizes to an orchestrator choosing per ROLE

1. Keep the taxonomy small and human-labelled (roles), because classifier accuracy is the weak link in learned routers (model-recall failures) [B S12]. A role label is given by the orchestrator, so recall failure is removed.
2. Two-stage decision like Cursor and Copilot: (a) cheap default unless the role's complexity warrants a premium model; (b) among premium models pick the one with best evidence for that role. Encode as `tier` per role plus per-role override.
3. Hard filters first, scores second: harness installed and authenticated, plan/quota available, modality (vision/computer-use), context fits, data policy. These are booleans; only survivors are ranked.
4. One dial, not many: expose a single cost-vs-quality setting (analogue of Not Diamond 0-10, OpenRouter cost_tier, Cursor optimize_for) that selects among the tiers; do not let it override hard filters.
5. Ordered fallback per role, as in Plano `models` lists and OpenRouter `allow_fallbacks`: trigger on 429/5xx/quota exhaustion.
6. Route model AND effort/strategy together (Route to Reason) [V S18]: the row is (harness, model, effort), not just model.
7. Keep a curated small pool and re-verify on each new model (curation beats scale) [B S12].
8. Evidence gate before a model enters a role (Cursor 75% rule): require at least one independent benchmark signal or a local run for the role's task type; otherwise mark `unproven` and use only as peer/fallback.
9. Diversity across roles: reviewer should differ from author (model-complementarity is the premise of routing, confirmed in LLMRouterBench [B S12]). A `family` column lets the orchestrator enforce it.
10. Log the decision and outcome per run (RouteLLM/Not Diamond custom routers train on eval data): this is the local probe [L] channel that eventually outranks third-party numbers.

## (3) PROPOSED schema for the model-capability table

One row per (harness, model, effort) offering. Columns marked MIN change a routing decision and are the minimum set; the rest are recommended metadata.

| Column | Definition | Unit / values | Filled by (source) | MIN |
|---|---|---|---|---|
| `harness` | CLI that exposes the model (claude, codex, grok, agy, cursor-agent, opencode, kimi ...) | enum | vendor CLI docs, `--help`/model list command [V/L] | MIN |
| `model_id` | Exact string passed to the harness | string | harness model list [L] | MIN |
| `family` | Vendor/lineage for reviewer diversity | enum (anthropic, openai, xai, google, moonshot, ...) | vendor [V] | MIN |
| `effort` | Reasoning/effort setting offered and default | enum (none/low/med/high/xhigh/max) | vendor docs [V] | MIN |
| `available` | Installed, authenticated, and quota not exhausted right now | bool + reason | local probe (`--version`, one-token call) [L] | MIN |
| `tier` | Placement: frontier / strong / mid / cheap / specialist | enum | derived by rule (below) | MIN |
| `roles_ok` | Roles this row is approved for (architect, planner, long-worker, reviewer, cheap-worker, vision, peer) | set | derived from evidence columns + manual sign-off | MIN |
| `agentic_coding_score` | Independent agentic-coding result (e.g. Terminal-Bench, SWE-bench-family variant) with benchmark name, version, date | number + id | independent benchmark [B]; vendor number only if flagged | MIN |
| `intel_index` | Artificial Analysis Intelligence Index (state version, currently v4.3.2) | number | artificialanalysis.ai [B] | MIN |
| `price_in`, `price_out`, `price_cached_in` | List price per 1M tokens | USD | vendor pricing page [V] | MIN |
| `cost_to_run` | Effective cost on a fixed workload (price x tokens used), since reasoning tokens vary | USD per task or per index run | AA cost-to-run, or [L] | MIN if available |
| `context_window` | Max input tokens actually usable in this harness (not API max) | tokens | vendor + [L] | MIN |
| `modalities_in` | image, audio, video, pdf, computer-use | set | vendor [V] | MIN (vision role) |
| `speed_tps`, `ttft_s` | Output tokens/s and time to first token | number | AA [B] or [L] | recommended; MIN for interactive roles |
| `long_horizon` | Evidence of multi-hour autonomous runs without drift (task horizon, or run length in local logs) | hours + source | independent (METR-style) [B] or [L] | MIN for long-worker |
| `tool_reliability` | Tool-call/format failure rate in harness | % | tau-bench-type [B] or [L] | recommended |
| `hallucination_rate` | Fabrication rate (AA-Omniscience style) | % | [B] | recommended for reviewer |
| `arena_score` | LMArena style-controlled score, category, rank spread | number | LMArena [B/P] | optional (human-preference; weak for agentic work) |
| `plan_limits` | Subscription quota / rate limit form (5h window, weekly, per-request multiplier) | text | vendor [V] | MIN (availability) |
| `data_policy` | Retention/training/region constraints | text | vendor [V] | MIN when policy required |
| `status` | GA / preview / deprecated / restricted access, with sunset date | enum + date | vendor [V] | MIN |
| `fallback_to` | Ordered list of row ids to try on 429/5xx/quota | list | orchestrator policy | MIN |
| `evidence_grade` | Highest grade backing each score cell | V/B/P/L | recorder | MIN |
| `as_of` | Date each number was read | ISO date | recorder | MIN |
| `source_id` | Pointer into Sources | id | recorder | MIN |

Minimum set that changes a routing decision: harness, model_id, family, effort, available, status, tier, roles_ok, one agentic-coding score, intel_index, prices, context_window, modalities_in (for the vision role), long_horizon (for the long-worker role), plan_limits, fallback_to, plus as_of/evidence_grade/source_id so stale or vendor-only cells are visible. Everything else is tie-break or diagnostic. Justification: these are exactly the inputs the routers above actually use (filters, one quality signal, price, latency, fallback) [V S1,S3,S5,S11b].

Design rules for the table:
- Never store a score without benchmark name, version and date; AA's index changed version (v4.0 to v4.3.2 in the sources read) and numbers across versions are not comparable [B S21,S22].
- Store vendor-reported and independent numbers in separate cells, or mark `evidence_grade`.
- Empty cell means unknown, never zero.

## (4) PROPOSED update procedure when a new model ships

Run in this order (cheapest and most authoritative first; stop early if the model fails a gate):

1. Identify. Vendor announcement/changelog and the harness's own model list (`claude`/`codex`/`grok`/`agy` model picker or list command) to get exact `model_id`, `effort` options, `status`, and which harness exposes it. [V/L] Record `as_of`.
2. Availability probe. Confirm install, auth, one-token call, and note plan quota form. [L] Gate: if not callable on this machine, mark `available=false` and stop at recording vendor facts.
3. Price and limits. Vendor pricing page and plan docs: prices, cached price, context, plan limits, data policy. [V]
4. Independent benchmarks, in this order: (a) Artificial Analysis (index version, cost to run, tokens/s); (b) agentic/terminal and contamination-resistant coding boards that are independently run; (c) long-horizon or reliability evaluations; (d) hallucination/omniscience-style; (e) LMArena style-controlled category scores as a tie-break only. Reject numbers older than the model's GA date and any that were run at an unstated effort. [B]
5. Practitioner check. Search for early reports (harness-specific bugs, quota burn, tool-call regressions, behaviour changes) and note conflicts of interest; treat as [P] and never as the sole basis for a tier. Re-check after 7 days since day-one reports are noisy.
6. Place in a tier. Rule (proposed): compare against the current incumbent for each role using the same benchmark cells.
   - Candidate enters role R only if it clears the evidence gate for R (independent agentic-coding or role-relevant cell at or above the incumbent's, minus the measurement CI) AND passes the filters (available, status GA or accepted preview, context fits, modality).
   - `frontier` = top of the agentic-coding board within the CI; `strong` = within a stated margin of frontier at materially lower price; `mid`/`cheap` = above the mechanical-worker floor on the board at the lowest cost_to_run; `specialist` = only wins a modality/role (vision, computer-use, long-context).
   - If price-quality dominated (worse and pricier than an incumbent on both axes) do not add.
7. Place in a harness row. Add one row per (harness, model, effort) actually offered; a model reachable from two harnesses gets two rows because quota, tools and context differ. Set `fallback_to` so the reviewer's `family` differs from the author's.
8. Local probe on the role (optional but decisive): run the orchestrator's own small fixed task set for the role, record pass rate, cost, wall time as [L]; local results override third-party ones.
9. Sign-off and log. Update `roles_ok`, set `as_of`, write source ids, and bump the table version. Superseded models: set `status=deprecated`, keep the row 30 days for reproducibility.
10. Cadence: re-run steps 3-5 for the top rows whenever a benchmark version changes or a vendor changes pricing; full sweep monthly. Sources worth re-checking on every new model are marked (re-run) below.

## Gaps

- Not Diamond, Martian, Unify: docs pages either 404 on direct fetch (Martian) or were only readable as index/summary; I have no quantitative accuracy numbers for them and their current (2026) algorithm is unknown. Unify not researched (time).
- OpenRouter's new spend-based Auto has no independent evaluation; LLMRouterBench measured an older router. Whether Auto beats best-single today is unknown.
- Cursor numbers (68%/41% lower cost) are vendor-reported on proprietary satisfaction metric; not verifiable. Cursor Router docs say Teams/Enterprise only at time of reading, so its availability through cursor-agent for an individual user is unverified.
- Cline model-selection doc page 404; Cline/Roo guidance came from secondary summaries. Kilo's model guidance is generic (no per-mode model list, which its docs page confirms).
- Arch-Router benchmark numbers and latency figures were not read (only abstract-level claims).
- RouterEval and RouterBench details are abstract-level; I did not read the full papers, so no router-vs-oracle numbers beyond LLMRouterBench.
- LMArena facts come from search-result summaries of secondary and first-party pages; no direct fetch of the leaderboard.
- Artificial Analysis: read methodology summary only; no current leaderboard values (out of this lane). The index version is 4.3.2 on the methodology page while a search snippet shows v4.0 component list; treat components as of the methodology page only.
- No local probes were run (contract lane is research-only for docs).

## Sources

Re-run marks: (re-run) = check whenever a new model ships.

- [S1] OpenRouter Auto Router — https://openrouter.ai/docs/guides/routing/routers/auto-router — accessed 2026-09-30 — spend-based task-type ranking, cost_tier, allowed/excluded models, no fee — vendor doc, summarised by tool. (re-run)
- [S2] OpenRouter model routing search results (deprecated NotDiamond Auto, cost_quality_tradeoff) — https://openrouter.ai/docs/guides/features/routers/auto-router — 2026-09-30 — history of Auto router — search snippet only, low reliability.
- [S3] OpenRouter provider routing — https://openrouter.ai/docs/guides/routing/provider-selection — 2026-09-30 — provider params, :nitro, :floor — vendor doc. (re-run)
- [S4] GitHub Copilot auto model selection — https://docs.github.com/en/copilot/concepts/auto-model-selection — 2026-09-30 — health/availability plus complexity, 10% discount, exclusions — vendor doc. (re-run)
- [S5] Cursor, How Cursor Router works — https://cursor.com/blog/how-cursor-router-works — 2026-09-30 — Compass, taxonomy, 75% uplift, model strengths, savings as of 2026-08-06 — vendor blog; own-metric claims. (re-run)
- [S6] Cursor Router docs — https://cursor.com/docs/cursor-router — 2026-09-30 — modes, billing, `auto-smart`/`optimize_for`, Teams/Enterprise availability — vendor doc. (re-run)
- [S7] Not Diamond key concepts — https://docs.notdiamond.ai/docs/key-concepts — 2026-09-30 — tradeoff modes, 0-10 dial, preference ID — vendor doc. [S7b] search summary of Not Diamond docs (Pareto, custom router) — same day — secondary.
- [S8] Martian router docs (search summary; direct fetch 404) — https://docs.withmartian.com/martian-model-router/model-router/how-the-router-works — 2026-09-30 — models, max_cost, willingness_to_pay — secondary summary, low reliability.
- [S9] RouteLLM paper — https://arxiv.org/abs/2406.18665 — 2026-09-30 — abstract claims (2x cost, transfer) — paper abstract.
- [S10] RouteLLM repo — https://github.com/lm-sys/RouteLLM — 2026-09-30 — router types, threshold calibration, 85%/95% and >40% claims — repo README, vendor-reported numbers.
- [S11] Arch-Router paper — https://arxiv.org/abs/2506.16655 — 2026-09-30 — 1.5B, domain-action policies, human-preference alignment — abstract. [S11b] Plano preference-aligned routing — https://docs.planoai.dev/guides/llm_router.html — same day — routing_preferences schema, ordered models, fallback on 429/5xx, latency from Prometheus — vendor doc. (re-run)
- [S12] LLMRouterBench — https://arxiv.org/abs/2601.07206 (submitted 2026-01-12) — 2026-09-30 — independent benchmark, commercial routers no better than best single, pool curation — the strongest independent evidence in this file. [S12b] same paper HTML https://arxiv.org/html/2601.07206 — OpenRouter -24.7% vs GPT-5, 11.9% hard queries, 24.6%/23.2%.
- [S13] Requesty routing docs and blog — https://docs.requesty.ai/features/managed-policies , https://docs.requesty.ai/features/latency-routing — 2026-09-30 — policies fallback/load_balance/latency, smart routing — search summary, vendor marketing tone.
- [S14] Portkey conditional routing — https://portkey.ai/docs/guides/use-cases/combining-routing-strategies — 2026-09-30 — metadata conditions, nested strategies — search summary of vendor docs.
- [S15] Cline plan and act — https://docs.cline.bot/core-workflows/plan-and-act — 2026-09-30 — separate plan/act models — via search summary. [S17] fast.io Cline plan-mode guide — https://fast.io/resources/cline-plan-mode-guide/ — 2026-09-30 — "frontier reasoning model for Plan, cheap fast for Act" pattern — third-party blog, low reliability, named models are dated.
- [S16] Kilo model selection — https://kilo.ai/docs/code-with-ai/agents/model-selection — 2026-09-30 — premium vs mid-tier guidance, context sizes, Auto Efficient/Free — vendor doc.
- [S18] Route to Reason — https://arxiv.org/abs/2505.19435 — 2026-09-30 — joint model+strategy routing, >60% token reduction — abstract.
- [S19] RouterEval — https://arxiv.org/abs/2503.10657 — 2026-09-30 — 200M records, 8,500+ LLMs, oracle gap — search summary of abstract.
- [S20] RouterBench — https://arxiv.org/abs/2403.12031 — 2026-09-30 — 405k outcomes — abstract.
- [S21] Artificial Analysis intelligence benchmarking methodology — https://artificialanalysis.ai/methodology/intelligence-benchmarking — 2026-09-30 — Index v4.3.2 weights, CI < ±1% — independent; tool summary. (re-run)
- [S22] Artificial Analysis models overview — https://artificialanalysis.ai/models — 2026-09-30 — three-axis framing, 3:1 price blend, first-party API basis — search snippet. (re-run)
- [S23] LMArena / Arena-Rank / help center — https://news.lmarena.ai/arena-rank , https://help.arena.ai/articles/7011479247-how-to-see-ai-rankings-in-arena-leaderboards-2-0-wip — 2026-09-30 — Bradley-Terry, Style Control, categories — search summaries incl. third-party pages; moderate reliability. (re-run)
- [S24] Kilo/Roo comparison pages — https://kilo.ai/compare/roo-vs-cline-vs-kilo — 2026-09-30 — Roo archived 2026-05-15 claim — vendor comparison, conflict of interest.
