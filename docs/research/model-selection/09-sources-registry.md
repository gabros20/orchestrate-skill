# Sources registry — model selection (as of 2026-09-30)

Every source the lanes marked **(re-run)**: re-check these whenever a new model ships or a benchmark
changes version. Grouped by lane; the lane file holds the full source list with what each gave.

## Which source fills which column

| Column | Primary source (re-run first) | Cross-check |
|---|---|---|
| model ids, effort enum, default, status | vendor model pages + the harness's own list command (`grok models`, `~/.codex/models_cache.json`, `opencode models --verbose`, `pi --list-models`, `kimi` config, `muse`) [V/L] | OpenRouter model page |
| price, cache, long-context tier, plan limits | vendor pricing page [V] | `opencode models --verbose` (models.dev), OpenRouter |
| context usable in the harness | harness catalog [L] (Codex `context_window` vs `max_context_window`; Kimi plan tiers) | vendor page |
| modalities, computer use | vendor model page + tool lists [V] | OSWorld official board |
| intelligence + cost to run + speed + per-effort curves | Artificial Analysis (index version!) [B] | LiveBench |
| agentic coding (harness+model) | AA Coding Agent Index, Terminal-Bench (tbench.ai) [B] | SWE-bench Pro, SWE-rebench, DeepSWE, FrontierSWE |
| long horizon | METR time horizons, FrontierSWE, Vending-Bench 2 [B] | practitioner run-length reports [P] |
| computer use / vision | OSWorld (official), LMArena Vision [B] | vendor OSWorld numbers (flag version) |
| human preference | LMArena Text / WebDev / Agent Arena [B] | — |
| real use, quota burn, regressions | X via `xrelay` (serialized), Reddit via `search.rss` + browser UA (endpoint verified HTTP 200 this run [L]; not yet used for data), HN via hn.algolia.com API [P] | re-check after 7 days |
| routing method | 06-routers.md sources | — |

## 01-vendor-specs — 20 re-run source(s)

Lane rule: Re-check on every model release: S1, S2, S7, S8, S15, S17-S20, S22, S23, S27, S28, S35-S38, S42, S45, S46.

- [S1] Claude models overview — https://platform.claude.com/docs/en/models/overview — accessed 2026-09-30 — ids, prices, context, effort default, cutoffs, retirement; high reliability, updates with each release.
- [S2] Claude pricing — https://platform.claude.com/docs/en/about-claude/pricing — 2026-09-30 — full price, cache, batch, fast mode, tokenizer note, computer/browser toolset overhead; high.
- [S7] Claude effort docs — https://platform.claude.com/docs/en/build-with-claude/effort — 2026-09-30 — levels per model, defaults, per-message effort.
- [S8] Claude computer use docs — https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool — 2026-09-30 — supported-model list (fetch summary; medium reliability).
- [S15] Claude Code model config — https://code.claude.com/docs/en/model-config — 2026-09-30 — aliases, defaults, effort, 1M; fetch summary, `/fast` line judged wrong.
- [S17] OpenAI GPT-6 Astra — https://developers.openai.com/api/docs/models/gpt-6-astra — 2026-09-30; summary.
- [S18] OpenAI GPT-6 Luna — https://developers.openai.com/api/docs/models/gpt-6-luna — 2026-09-30; summary.
- [S19] OpenAI GPT-6.1 Sol — https://developers.openai.com/api/docs/models/gpt-6.1-sol — 2026-09-30; summary. The "release date: April 30" it printed is the cutoff, not the release.
- [S20] OpenAI models index — https://developers.openai.com/api/docs/models — 2026-09-30 — current-model list and one-line descriptions; summary.
- [S22] OpenAI API changelog — https://developers.openai.com/api/docs/changelog — 2026-09-30 — release dates (Astra 09-03, Sol/Luna 09-22, 6.1 Sol 09-29, Ultrafast 09-29); summary.
- [S23] Codex models — https://learn.chatgpt.com/docs/models (redirect from developers.openai.com/codex/models) — 2026-09-30 — Codex roster, plan access, effort names, GPT-5.5 retirement; summary.
- [S27] Local `grok models` (grok 1.0.41) — [L] 2026-09-30 — Grok CLI roster.
- [S28] xAI models page (embedded page data) — https://docs.x.ai/developers/models — 2026-09-30 — ids, context, price units, rate limits, aliases; parsed from raw HTML.
- [S35] Gemini API models and per-model pages — https://ai.google.dev/gemini-api/docs/models and `/models/gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.5-flash`, `gemini-3.1-pro-preview` — 2026-09-30 — tokens, modalities, computer use, update dates; raw HTML parsed.
- [S36] Gemini API pricing — https://ai.google.dev/gemini-api/docs/pricing — 2026-09-30 — per-model prices; raw HTML parsed; high.
- [S37] Antigravity models — https://antigravity.google/docs/models — 2026-09-30 — plan roster; summary, possibly stale.
- [S38] Cursor Models and Pricing — https://cursor.com/docs/models — 2026-09-30 — prices, pools, plans; raw HTML parsed.
- [S42] Kimi Code docs — https://www.kimi.com/code/docs/en/ — 2026-09-30 — plan-gated models, "260 tokens/s"; summary.
- [S45] OpenRouter model API — https://openrouter.ai/api/v1/models — pulled 2026-09-30 — context, max output, prices, modalities, listing dates; secondary cross-check only, provider-specific.
- [S46] Local `opencode models` (v1.18.27) and Hermes v0.18.2 version probe — [L] 2026-09-30.

## 02-cli-catalogs — 3 re-run source(s)

- [S1] `claude --version`, `claude --help` — local, 2026-09-30 — CLI version, --model/--effort/--fallback-model. Re-check on each Claude Code update.
- [S2] ~/.codex/models_cache.json (python3 parse, fetched_at 2026-09-30T07:25:00Z; not an auth file) — full codex catalog. Re-run whenever a new GPT ships; refreshes from server.
- [S5] `opencode --version`, `opencode models [provider] --verbose`, `opencode auth list` (names only) — local, 2026-09-30; models.dev-backed. Re-run with `--refresh` when a model ships.

## 03-benchmarks — 14 re-run source(s)

Lane rule: Mark [R] = worth re-checking whenever a new model ships (re-run this lane).

- [S1] Artificial Analysis - LLM Leaderboard (models) - https://artificialanalysis.ai/leaderboards/models - accessed 2026-09-30 - Intelligence Index v4.3.2 with cost per task, speed, latency, context for ~150 models; screenshots `.orchestrate/raw/shots/aa-models.png`, `aa-models-c0..c4.png`, `aa-home.png`, `aa-home-long-5..10.png`. High reliability (independent, first-party runs); numbers are from screenshot transcription. [R]
- [S2] Artificial Analysis - article list and "Benchmarking GPT-6 Astra" (2026-09-09) - https://artificialanalysis.ai/articles and https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra - accessed 2026-09-30 - release timeline (GPT-6.1 Sol replaces GPT-6 Sol 09-29; Opus 5.5 09-22; Sonnet 5.5 09-28), Astra vs Fable 5.1 stats. WebFetch (small-model summary): medium-low fidelity. [R]
- [S3] Artificial Analysis - Coding Agent Benchmarks - https://artificialanalysis.ai/agents/coding-agents - accessed 2026-09-30 - Coding Agent Index v1.5, cost per task, tokens; `aa-agents-coding.png`, `aa-agents-coding-c0.png`, `aa-agents-cost-c.png`. [R]
- [S4] Terminal-Bench - https://www.tbench.ai/leaderboard (4.0) and https://www.tbench.ai/leaderboard/terminal-bench/2.0 - accessed 2026-09-30 - TB4.0 and TB2.0 tables with harness, CI, tokens, cost; `tbench-home.png`, `tbench.png`, `tbench-c0.png`. [R]
- [S5] Epoch AI - Capabilities & Benchmarking hub, data bundle - https://epoch.ai/data/benchmark_data.zip (page https://epoch.ai/benchmarks) - accessed 2026-09-30 (files stamped 2026-09-30 06:26) - CC-BY structured mirrors of ARC-AGI-2, DeepSWE, FrontierSWE, FrontierCode, CursorBench, APEX-Agents, LMCA, MirrorCode, Furniture Assembly, FrontierMath, HLE, Vending-Bench 2, OSWorld 2.0, METR, Terminal-Bench, ECI, etc. Reliable mirror; original runner per row noted; some vendor-run boards. [R]
- [S6] METR - Task-Completion Time Horizons - https://metr.org/time-horizons/ - accessed 2026-09-30 - TH1.1 values from embedded page JSON, changelog to 2026-05-08; `metr.png`. Also GPT-5.6 Sol summary https://metr.org/blog/2026-06-26-gpt-5-6-sol/ (WebFetch). High reliability, stale. [R]
- [S7] Andon Labs - Vending-Bench 2 - https://andonlabs.com/evals/vending-bench-2 - accessed 2026-09-30 - current leaderboard; `vendingbench.png`. [R]
- [S8] Scale Labs - leaderboards (landing, SWE-Bench Pro V2, MCP Atlas, HLE Diamond, VISTA, SWE Atlas, HiL) - https://labs.scale.com/leaderboard, /leaderboard/swe_bench_pro_public_v2, /mcp_atlas, /visual_language_understanding, /hle-diamond, legacy https://labs.scale.com/leaderboard/swe_bench_pro_public - accessed 2026-09-30 - `scale-swepro-v2-hard.png`, `scale-swepro-v2-full-c.png`, `scale-mcp-atlas-c.png`, `scale-vlu.png`, `swebench-pro.png`. Scale sells data to labs (COI note). [R]
- [S9] OSWorld 2.0 official results JSON - https://osworld-v2.xlang.ai/static/data/leaderboard/official-results.json - accessed 2026-09-30 (`updatedAt` 2026-09-17) - author-run results. Project page https://os-world.github.io/ (`osworld.png`). [R]
- [S10] Yutori OSWorld 2.0 leaderboard and Steel.dev OSWorld 2.0 leaderboard - https://yutori.com/leaderboards/osworld-2.md (updated 2026-09-03) and https://leaderboard.steel.dev/leaderboards/osworld-2.md (updated 2026-09-04) - vendor self-report rows with their own caveats. Third-party aggregators; treat as [V] where marked. [R]
- [S13] Arena (LMArena) leaderboards - https://lmarena.ai/leaderboard/text, /code (WebDev), /vision, /agent - accessed 2026-09-30 (page dates 09-26, 09-29, 09-28, 09-28) - `lmarena-text-c.png`, `lmarena-code.png`, `lmarena-vision2.png`, `lmarena-agent.png`, `lmarena-overview.png`. Cookie modal dims screenshots; figures legible. [R]
- [S14] ARC Prize leaderboard - https://arcprize.org/leaderboard - accessed 2026-09-30 - ARC-AGI-1/2/3 with cost per task; `arc-leaderboard.png`, `arc-c.png`. [R]
- [S15] LiveBench - https://livebench.ai/ - accessed 2026-09-30 - `livebench.png` (header release 2026-06-25, table includes September models). [R]
- [S16] SWE-rebench (Nebius) - https://swe-rebench.com/ - accessed 2026-09-30 - window 2026-05-15..2026-07-01; `swerebench.png`, `swerebench-c.png`. [R]

## 04-x-reports — 8 re-run source(s)

Lane rule: Primary post links: `https://x.com/<handle>/status/<id>`; accessed 2026-09-30 via xrelay. Grade [P] unless noted. "re-check" marks fast-moving items.

- [S1] (index) Opus 5.5 vs Fable comparison threads: see S2, S6, S7 (re-check weekly).
- [S2] kunchenguid, role line-up - x.com/kunchenguid/status/2103277022235766963 - 38k followers, builds "firstmate" orchestrator. Full text read. Re-check.
- [S5] PawelHuryn, GPT-6.1 Sol 105-bug test - x.com/PawelHuryn/status/2105065401193279918 - 133k, newsletter; n=1 to 3; harness Antigravity CLI (reply 2105075246940233766). Re-check: more efforts promised.
- [S19] zhuokaiz, SWE-Together leaderboard update - x.com/zhuokaiz/status/2102825912471527738 - Meta researcher; 2,616 trials; `[P/B?]` self-run leaderboard, contamination-controlled sandbox. Re-check.
- [S3] jpschroeder, "Astra: the good, the bad, and the Fable" - x.com/jpschroeder/status/2097735365905829924 - 13.8k, co-founder Standard Agents; long-form review. Quotes verbatim.
- [S16] blader - x.com/blader/status/2105095660450320571 - 407k; internal evals for his product; conflict of interest.
- [S18] PawelHuryn, Sonnet 5.5 105-bug test - x.com/PawelHuryn/status/2104818995316527105.
- [S49] bridgebench - x.com/bridgebench/status/2105018236165099538.

## 05-reddit-hn — 28 re-run source(s)

Lane rule: Re-check whenever a new model ships: S3, S6, S8, S9, S14 and the R-list.

- [S3] Claude Opus 5.5 — https://news.ycombinator.com/item?id=49803892 — 2026-09-22, 1806 pts, 1116 comments; pricing table quoted by GodelNumbering (Opus 5.5 $4 in / $20 out per M vs Opus 5 $5 / $25); booty 49804529 (cheap orchestrator).
- [S6] GPT 6.1 Sol: Near-Astra intelligence for a fifth of the price — https://news.ycombinator.com/item?id=49896586 — 2026-09-29, 892 pts, 804 comments; the_duke 49897054, A_D_E_P_T 49896732, rspeele 49897552 [S10], proxysna 49898356.
- [S8] Sonnet 5.5 — https://news.ycombinator.com/item?id=49881850 — 2026-09-28, 875 pts, 605 comments; Sol- 49882083, abejora 49882146, wkcheng, heyjstn 49882641, mnicky 49882964, azuanrb 49886033.
- [S9] same as S7 (A_D_E_P_T comment) and Mimo mention.
- [S14] Grok 4.7 — https://news.ycombinator.com/item?id=49788838 — 2026-09-21, 609 pts, 539 comments; mchusma 49793859, saejox 49790166, jmaker 49812720, everfrustrated 49791425.
- [R1] r/ClaudeCode "Is Opus 5.5 really better than Fable in your experience?" ~2026-09-23 — https://www.reddit.com/r/ClaudeCode/comments/1woe3lo/is_opus_55_really_better_than_fable_in_your/
- [R2] r/ClaudeCode "What's the point of Fable if Opus 5.5 is stronger than it, in every category?" — https://www.reddit.com/r/ClaudeCode/comments/1wnk74q/whats_the_point_of_fable_if_opus_55_is_stronger/ ; r/ClaudeCode "With Opus 5.5, where's fable or astra standing at now?" ~2026-09-24 — https://www.reddit.com/r/ClaudeCode/comments/1wohh59/with_opus_55_wheres_fable_or_astra_standing_at_now/
- [R3] r/ClaudeCode "Fable 5.1 or Opus 5.5?" ~2026-09-27 — https://www.reddit.com/r/ClaudeCode/comments/1wrfr8p/fable_51_or_opus_55/
- [R4] r/Anthropic Opus 5.5 announcement, "905 votes, 215 comments" — https://www.reddit.com/r/Anthropic/comments/1wnecjb/introducing_claude_opus_55_the_first_model_in_our/ ; r/ClaudeAI "Opus 5.5 v/s Astra 6" ~2026-09-27 — https://www.reddit.com/r/ClaudeAI/comments/1wrlr29/opus_55_vs_astra_6/
- [R5] r/codex "Astra vs Opus 5.5, my impressions on hard project" ~2026-09-25 — https://www.reddit.com/r/codex/comments/1wpveoe/astra_vs_opus_55_my_impressions_on_hard_project/ ; r/codex "Opus 5.5 leads the code review benchmark (at ~3x the cost gpt-6 sol)" ~2026-09-26 — https://www.reddit.com/r/codex/comments/1wq866g/opus_55_leads_the_code_review_benchmark_at_3x_the/
- [R6] r/codex "GPT-6 vs OPUS 5.5 Comparison" ~2026-09-25 — https://www.reddit.com/r/codex/comments/1wpdlx2/gpt6_vs_opus_55_comparison/ ; r/codex "I gave Astra, Sol, and Opus 5.5 the same Rust task" ~2026-09-23 — https://www.reddit.com/r/codex/comments/1wnx8i9/i_gave_astra_sol_and_opus_55_the_same_rust_task/
- [R7] r/OpenAI "Luna 6 is a massive downgrade over Luna 5.6" ~2026-09-23 — https://www.reddit.com/r/OpenAI/comments/1wnxg0n/luna_6_is_a_massive_downgrade_over_luna_56_misses/ ; r/codex "GPT-6-SOL - not impressed" — https://www.reddit.com/r/codex/comments/1wnnszs/gpt6sol_not_impressed/
- [R8] r/codex "Sol 6 was insufferable. Glad to be back to 5.6" ~2026-09-24 — https://www.reddit.com/r/codex/comments/1worwfr/sol_6_was_insufferable_glad_to_be_back_to_56/
- [R9] r/codex "anybody not having a bad time with gpt 6 sol ?" ~2026-09-24 — https://www.reddit.com/r/codex/comments/1wpasz8/anybody_not_having_a_bad_time_with_gpt_6_sol/
- [R10] r/codex "Sol 5.6 - how do you handle overengineering of SOL?" — https://www.reddit.com/r/codex/comments/1w0re81/sol_56_how_do_you_handle_overengineering_of_sol/
- [R11] r/ClaudeCode "Sonnet 5.5 is not worth using it unless at Low/Med effort" ~2026-09-29 — https://www.reddit.com/r/ClaudeCode/comments/1wsqfzk/sonnet_55_is_not_worth_using_it_unless_at_lowmed/
- [R12] r/ClaudeCode "Sonnet 5.5 beats Opus 5.5 at coding and it's half the price??" ~2026-09-28 — https://www.reddit.com/r/ClaudeCode/comments/1wsmhaz/sonnet_55_beats_opus_55_at_coding_and_its_half/
- [R13] r/ClaudeCode "Same prompt, same setup: Claude Sonnet 5.5 vs Opus 5.5" ~2026-09-29 — https://www.reddit.com/r/ClaudeCode/comments/1wspepd/same_prompt_same_setup_claude_sonnet_55_vs_opus/
- [R14]-[R17] r/google_antigravity Gemini 3.8 Flash threads — https://www.reddit.com/r/google_antigravity/comments/1wajpay/gemini_38_flash_might_be_googles_biggest_coding/ ; .../1w96dbj/antigravity_with_gemini_38_flash_highly_unreliable/ ; .../1w9574o/gemini_flash_38_is_wasting_all_my_tokens/ ; .../1w5i29e/review_of_gemini_38_flash_from_a_person_who/
- [R18] r/LocalLLaMA "What's the verdict on Kimi K3, Qwen3.8-2.4T..." — https://www.reddit.com/r/LocalLLaMA/comments/1vrupyu/whats_the_verdict_on_kimi_k3_qwen3824t/ ; r/opencode GLM 5.3 Flash vs DeepSeek V4.1 Flash (R18b) — https://www.reddit.com/r/opencode/comments/1wfqol6/glm_53_flash_vs_deepseek_v41_flash_which_one_do/
- [R19] r/ClaudeCode "Poor fable limits?" — https://www.reddit.com/r/ClaudeCode/comments/1wj1x6q/poor_fable_limits/ ; r/Anthropic "Fable 5.1 is really fantastic, but it's burning through the usage limit" — https://www.reddit.com/r/Anthropic/comments/1w5508t/fable_51_is_really_fantastic_but_its_burning/
- [R21] r/accelerate Astra + Blender MCP, "1.5K votes, 395 comments" — https://www.reddit.com/r/accelerate/comments/1w7nzal/dude_gpt6_astra_is_some_kind_of_turboagi_machine/
- [R22] r/OpenAI "Astra (GPT-6) High Intelligence, Low Intuition" — https://www.reddit.com/r/OpenAI/comments/1w7qxdr/astra_gpt6_high_intelligence_low_intuition/
- [R23] r/codex "GPT-6 Astra on low performs better than GPT-5.6 Sol on high" — https://www.reddit.com/r/codex/comments/1w9erx3/usage_tip_gpt6_astra_on_low_performs_better_than/
- [R24] r/cursor "Grok 4.7 is about 2.5 times as expensive as 4.6" — https://www.reddit.com/r/cursor/comments/1wmswj9/grok_47_is_about_25_times_as_expensive_as_46/
- [R26] r/cursor "I actually like Grok?" — https://www.reddit.com/r/cursor/comments/1vjstn9/i_actually_like_grok/
- [R27] r/cursor "Composer 2.5 Real World Reviews?" — https://www.reddit.com/r/cursor/comments/1tizaja/composer_25_real_world_reviews/ (pre-window thread id; low weight)
- [R28] r/AIToolsPerformance Grok 4.1 Fast 2M context — https://www.reddit.com/r/AIToolsPerformance/comments/1r7vena/grok_41_fast_vs_codexmax_51_i_compared_2m_context/ (2026-Q1 or earlier; outside window)

## 06-routers — 9 re-run source(s)

Lane rule: Re-run marks: (re-run) = check whenever a new model ships.

- [S1] OpenRouter Auto Router — https://openrouter.ai/docs/guides/routing/routers/auto-router — accessed 2026-09-30 — spend-based task-type ranking, cost_tier, allowed/excluded models, no fee — vendor doc, summarised by tool. (re-run)
- [S3] OpenRouter provider routing — https://openrouter.ai/docs/guides/routing/provider-selection — 2026-09-30 — provider params, :nitro, :floor — vendor doc. (re-run)
- [S4] GitHub Copilot auto model selection — https://docs.github.com/en/copilot/concepts/auto-model-selection — 2026-09-30 — health/availability plus complexity, 10% discount, exclusions — vendor doc. (re-run)
- [S5] Cursor, How Cursor Router works — https://cursor.com/blog/how-cursor-router-works — 2026-09-30 — Compass, taxonomy, 75% uplift, model strengths, savings as of 2026-08-06 — vendor blog; own-metric claims. (re-run)
- [S6] Cursor Router docs — https://cursor.com/docs/cursor-router — 2026-09-30 — modes, billing, `auto-smart`/`optimize_for`, Teams/Enterprise availability — vendor doc. (re-run)
- [S11] Arch-Router paper — https://arxiv.org/abs/2506.16655 — 2026-09-30 — 1.5B, domain-action policies, human-preference alignment — abstract. [S11b] Plano preference-aligned routing — https://docs.planoai.dev/guides/llm_router.html — same day — routing_preferences schema, ordered models, fallback on 429/5xx, latency from Prometheus — vendor doc. (re-run)
- [S21] Artificial Analysis intelligence benchmarking methodology — https://artificialanalysis.ai/methodology/intelligence-benchmarking — 2026-09-30 — Index v4.3.2 weights, CI < ±1% — independent; tool summary. (re-run)
- [S22] Artificial Analysis models overview — https://artificialanalysis.ai/models — 2026-09-30 — three-axis framing, 3:1 price blend, first-party API basis — search snippet. (re-run)
- [S23] LMArena / Arena-Rank / help center — https://news.lmarena.ai/arena-rank , https://help.arena.ai/articles/7011479247-how-to-see-ai-rankings-in-arena-leaderboards-2-0-wip — 2026-09-30 — Bradley-Terry, Style Control, categories — search summaries incl. third-party pages; moderate reliability. (re-run)

## 07-effort-curves — 6 re-run source(s)

Lane rule: Mark: RECHECK = re-run when a new model or effort level ships.

- [S1] AA models table screenshots (lane 3) `.orchestrate/raw/shots/aa-models-c0..c3.png` - https://artificialanalysis.ai/models - accessed 2026-09-30 - TTFT / E2E / tok/s per effort - [B], RECHECK.
- [S2] AA per-effort model pages, e.g. https://artificialanalysis.ai/models/claude-opus-5-5-high (`-low`, `-medium`, `-xhigh`; unlabeled slug = max; same pattern for `claude-sonnet-5-5`, `claude-fable-5-1`, `gpt-6-astra`, `gpt-6-1-sol`, `gpt-6-sol`, `gpt-6-luna`, `grok-4-7[-high]`, `kimi-k3[-low]`, `gemini-3-8-flash[-low|-medium|-high]`, `claude-opus-5[-high|-xhigh]`) - accessed 2026-09-30 - Intelligence Index v4.3.2, cost per task, output tokens, tok/s, extracted from page text by script - [B]; integers only; RECHECK.
- [S3] Cursor CursorBench 4.0 - https://cursor.com/cursorbench - accessed 2026-09-30 - score / cost / tokens / steps for 64 model-effort rows; changelog latest task update 2026-09-10 - [V-first-party], private tasks; RECHECK.
- [S4] Anthropic effort docs https://platform.claude.com/docs/en/build-with-claude/effort and Sonnet 5.5 prompting guide https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5 - accessed 2026-09-30 - level table, per-model recommendations, xhigh/max thoroughness, low-effort verification - [V]; RECHECK.
- [S5] Anthropic Opus 5.5 prompting guide https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5 - accessed 2026-09-30 - "Calibrate effort", visual/computer-use effort claims - [V]; RECHECK.
- [S8] Anthropic Opus 5.5 announcement https://www.anthropic.com/news/claude-opus-5-5 - accessed 2026-09-30 - effort-labelled claims and customer quotes via WebFetch summary - [V], RECHECK.

## 08-other-labs-harness — 4 re-run source(s)

- [S1] Kimi Code Docs — Model Configuration — https://www.kimi.com/code/docs/en/kimi-code/models — accessed 2026-09-30 — model ids, mapping, ctx, tiers, effort, HighSpeed quota, 401 behaviour (raw HTML text read; verbatim). Vendor [V]. Re-check whenever a Kimi model ships.
- [S6] Pi docs and source — https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/docs/{cli,providers,models}.md; packages/ai/src/providers/{kimi-coding,meta}.ts; packages/ai/scripts/generate-models.ts — accessed 2026-09-30 — flags, env vars, provider ids, implied Kimi costs, quirks. [V] (open-source repo). Re-run `pi --list-models` when installed.
- [S9] Artificial Analysis leaderboard — https://artificialanalysis.ai/leaderboards/models — accessed 2026-09-30 — Intelligence Index, cost, speed, latency (WebFetch transcription; page date not shown). [B]. Re-check weekly.
- [S10] Terminal-Bench 4.0 leaderboard — https://www.tbench.ai/leaderboard/terminal-bench/4.0 — accessed 2026-09-30 — screenshot `.orchestrate/raw/shots/t9-tbench4.png` transcribed; 15 rows. [B], high reliability, contamination-resistant intent. Re-check on each release.

