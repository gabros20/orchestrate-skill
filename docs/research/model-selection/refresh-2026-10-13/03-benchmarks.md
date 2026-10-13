# 03 - Independent benchmarks (research lane 3, refresh 2026-10-13)

Run date 2026-10-13 (trigger: `claude-haiku-5-5`, released 2026-10-07). Baseline: `skills/orchestrate/references/shared-model-catalog.md`
(as of 2026-09-30) and the 2026-09-30 lane file `docs/research/model-selection/03-benchmarks.md`. Grades: [B] independent benchmark (runner named
in the row), [B, community-run] = open single-author benchmarks (F16), [V] vendor-official, "derived" = computed by me from cited numbers. No [P] or [L] evidence in this lane.
Method: leaderboards were read from server-rendered HTML or from the JSON embedded in the page (exact values, not OCR), then cross-checked against
headless-Chrome screenshots (`.orchestrate/raw/shots/r3-*.png`). Raw captures and parsers' output: `.orchestrate/raw/r3-*`. Haiku 5.5 is six days old:
absence from a board is reported with the date checked (2026-10-13) and is not a score.

## Summary

- **Changes vs catalog** (AA Intelligence Index v4.3.2 and Coding Agent Index v1.5 are the same versions as on 2026-09-30, so numbers compare directly):
  - NEW `claude-haiku-5-5`. AA II: max 43 ($0.21 per task) · xhigh 41 ($0.12) · high 38 ($0.08) · medium 34 ($0.05) · low 29 ($0.02), 1M context
    [B, S1]. Coding Agent Index (Claude Code harness): xhigh 41.4 ($0.61) · max 36.5 ($2.58) · high 35.1 · medium 33.6 · low 28.2 [B, S4]. Price $0.10 in /
    $0.50 out per MTok for prompts up to 100K tokens and $0.50 / $2.50 above; default effort medium; 128K max output [V, S2]. Haiku 4.5 on the same
    index: 16.9 (AA flags it deprecated) [B, S1].
  - Catalog "Haiku 4.5 not competitive [B]": still true of 4.5, superseded by 5.5. Haiku 5.5 beats GPT-6 Luna max on AA II (43 vs 38), but only its
    xhigh setting (41.2 at $0.124) is on AA's cost/score Pareto front, by $0.007 over GPT-6.1 Sol low (42.1 at $0.131) [B, S1; front derived].
  - GPT-6 Luna AA II: max 37 → 38 · xhigh 34 → 35 · high 32 → 33; cost unchanged ($0.07 / $0.04 / $0.03) [B, S1].
  - Sonnet 5.5 AA cost per task: max $7.60 → $5.46 · xhigh $2.74 → $2.01 · high $1.08 → $0.88 · medium $0.59 → $0.48; scores unchanged (56/52/47/41) [B, S1].
    Cause: Anthropic halved Sonnet 5.5 cache-read price ($0.20 → $0.10 per MTok) on 2026-10-07 [V, S2]. Catalog "Opus 5.5 low ≈ Sonnet 5.5 medium,
    cheaper" now holds on score (42 vs 41) but Sonnet medium is the cheaper one ($0.48 vs $0.55).
  - Terminal-Bench 4.0 (tbench.ai, 35 rows) now lists the 5.5 / GPT-6.x generation: **Opus 5.5 (Claude Code, max) 64.8 +-3.1 is #1**, above the catalog's cited
    leader GPT-6 Astra 58.2 +-2.8; Sonnet 5.5 61.8 +-2.9; GPT-6.1 Sol (Codex, max) 58.2 +-3.1 at $634 per run vs Astra $3,267; GPT-6 Luna 16.4 +-2.7 [B, S5].
    Haiku 5.5 is not on it.
  - Coding Agent Index: incumbents unchanged (Sonnet 5.5 68.4 at $14.19 · Opus 5.5 66.0 at $13.04 · Sol xhigh 62.9 at $1.04 · Fable 5.1 62.2 · Astra 61.6),
    so the catalog's "63 at $1.04/task vs 66 at $13.0" holds. New cheap points: Codex + Sol medium 61.4 ($0.70), low 57.2 ($0.50). Board grew 30 → 39 rows [B, S4].
  - Epoch Capabilities Index (which lacked these models on 09-30 per the previous lane file) now includes them: Opus 5.5 167.3 (#1), Astra 166.5, GPT-6.1 Sol 166.1, Sonnet 5.5 165.0,
    Fable 5.1 164.7 (CIs overlap), Luna 156.3 [B, S9]. Catalog "Thin evidence" line is half retired: Terminal-Bench now covers Opus 5.5 / Sonnet 5.5 / GPT-6.1 Sol / Luna;
    METR (frozen, page last updated 2026-09-08, newest model Mythos Preview 2026-04-07) and OSWorld official (updated 2026-10-05, no 5.5 / GPT-6 rows) still do not, and
    SWE-rebench is still on its 2026-05-15..07-01 window [B, S5, S12, S13, S14].
  - New entrants outside the seed list: **Gemini 4 Argon** (2026-09-30; AA II 53 high at $1.99; Vals Index #1 68.90%; Coding Agent Index 63.8 at $5.84; LMArena Text #1
    1525 preliminary) and **Muse Wonder / Wonder Full** (2026-10-12; AA II 52 / 56; Coding Agent Index 63.5 / 68.0; Vals Index #5 64.57% for Wonder Full) [B, S1, S4, S6, S8].
  - Catalog "grinder / bug hunt" rows now have independent evidence: Bug Hunt Bench (community-run; 105 planted bugs; board updated 2026-10-08): Sonnet 5.5 max 51.3 is #1 (GPT-6 Astra max 45 · GPT-6.1 Sol max 44.3 · Fable 5.1 max 43 · Opus 5.5 max 41.7), and xhigh drops hard (Sonnet 5.5 51.3 → 36, Opus 5.5 41.7 → 36, Fable 5.1 43 → 29), which corroborates the catalog's "xhigh dropped on one bug hunt [P, n=1-2]" and its frontier pick `sonnet @max`; Opus 5.5 xhigh ties Sonnet 5.5 xhigh at 36 (cheaper: $34.98 vs $42.86), so the catalog's "Opus 5.5 xhigh dominates Sonnet 5.5 xhigh" holds on cost, not on score, here [B, community-run, S20]. Haiku 5.5 on the same board: max 21.5 · xhigh 18.3 · high 16 · medium 12 · low 11 (1-3 runs per row) [B, community-run, S20].
  - Re-checked, no change: AA II and cost for Opus 5.5 (all efforts), Fable 5.1, Astra, Sol 6.1, MiMo-V2.6-Pro (46 at $0.13), DeepSeek V4.1 Flash (39 at $0.27),
    GLM-5.3 (45), Kimi K3 (44), Grok 4.7 (46), Gemini 3.8 Flash (41 at $1.24); the Coding Agent Index rows for those; FrontierSWE; Scale HLE Diamond; ARC-AGI-2 [B, S1, S4, S7, S9, S11].
- **Haiku 5.5 vs GPT-6 Luna (same $0.10/$0.50 base price).** Haiku leads on terminal work (AA TB4.0 32.8% vs 12.6% at max, 29.3 vs 8.1 at xhigh; Vals mini-swe-agent 35.35 vs 13.64),
  knowledge-work Elo (GDPval-AA 1618 vs 1430; AA-Briefcase 1577 vs 1336), HLE (44.4 vs 38.5) and hallucination rate (40% vs 77%). Luna leads on repo-level SWE
  (DeepSWE inside the Coding Agent Index 63.7 vs 46.0-49.0), AutomationBench-AA (53.2 vs 35.4, which AA calls understated), factual recall (Omniscience accuracy 44% vs 36%;
  SimpleQA Verified 41.4 vs 23.8) and FrontierMath Tier 4 (56.1 vs 46.3). At equal II (about 38) cost per task is level ($0.079 vs $0.068) but Haiku uses 3.2x Luna's output
  tokens at max (162K vs 50K) and costs 3.1x per task ($0.213 vs $0.068) [B, S1, S3, S4, S8, S9].
- **Coding workers: the evidence conflicts by suite, so Haiku 5.5 is not a clean replacement for Sonnet 5.5 low/medium or GPT-6.1 Sol low/medium.** Hard, long-horizon suites say no: in Claude Code, Haiku xhigh 41.4 at $0.61 and 26 min per task vs Sonnet low 42.1 at $0.48 / 6 min and medium 45.9 at $0.62 / 9 min (Coding Agent Index); across harnesses Codex + Sol low 57.2 at $0.50 and Vals TB4.0 (Sol 55.05% at $1.72 vs Haiku 35.35% at $3.05) dominate it [B, S4, S8]. Moderate-difficulty suites say yes inside Claude Code: VulcanBench Frontier v4 (23 tasks) Haiku xhigh 91.83 at $0.84 beats Sonnet xhigh 90.20 at $3.38 and is level with or above Opus 5.5 (86.4-91.1 at $1.70-4.11, SEs 0.6-1.3) with the same 22/23 passes as Sonnet, though at Low-High it passes fewer tasks than Sonnet (13/13/17 vs 15/17/20) and wins on the LLM-judged quality share [B, community-run, S21]; Bug Hunt Bench puts Haiku max 21.5 at $5.83 level with Opus 5.5 low 22.3 ($8.34) and Sonnet 5.5 medium 23.3 ($11.11), but GPT-6.1 Sol low 22.5 at $1.34 and MiMo-V2.6-Flash 23.3 at $0.49 match it for far less [B, community-run, S20]. AA's II alone makes Haiku look 3-4x cheaper than Sonnet low/medium for equal score; in agent loops its prompts average 70-106K tokens per step, so the 5x price tier above 100K and 2-4x the steps erase most of that gap (derived, F5; corroborated by VulcanBench's cost floor/ceiling) [B, S4, S21; V, S2].
- **Effort: xhigh is the ceiling for Haiku 5.5 and, in agent loops, usually the value point.** AA II rises monotonically (29.5 → 34.5 → 37.8 → 41.2 → 43.4, cost x1.6-2.0 per step) and high is its cheapest strong point ($0.079). In agent work max is no better than xhigh: Coding Agent Index 36.5 vs 41.4 at 4.2x cost and 3.4x wall time; VulcanBench 92.16 vs 91.83 and Bug Hunt Bench 21.5 vs 18.3, both inside noise, at 1.8x and 1.2x cost; xhigh was VulcanBench's cheapest and fastest level ($0.84 and 19 min vs $1.25 and 27 min at high). TTFT is 310 s at max vs 79 s at xhigh and 25 s at high. The vendor default is medium (II 34.5, CAI 33.6; VulcanBench 84.03 with 13/23 passes) [B, S1, S4; B, community-run, S20, S21; V, S2].
- **Where Haiku 5.5 is genuinely strong (independent):** Vals Vibe Code Bench v1.1 90.44% (#3 of 112) at $6.07 per test, level with Opus 5.5 90.29% ($57.92) and Sol 88.93% ($6.23); Scale FORTRESS risk score
  #2; Vals CyberBench v1.1 75.48% (#6); OTIS Mock AIME 98.9% at xhigh. **Weak:** SWE-Bench Pro V2 Full 87.23 (last of 13) and HARD 52.94 +-13.01; Vals Index 54.31% (#18 of 47) vs MiMo-V2.6-Pro
  55.20% at $0.41 per test and Sol 61.15% at $3.24; Terminal-Bench Science 10.0, SRE Bench 5.7, Harvey LAB 1.25 [B, S7, S8, S9]. VulcanBench Frontier v4: Haiku 5.5 max 92.16 is #4 of 63 model-effort columns, level with Sonnet 5.5 max (92.02) at about 28% of its cost per task [B, community-run, S21].
- **Frontier picture moved.** Opus 5.5 is now #1 on AA II (58), tbench.ai TB4.0 (64.8), ECI (167.3), LMArena WebDev (1813 +-15) and Agent Arena (+17.9%); Sonnet 5.5 leads the Coding Agent Index (68.4) and
  Vals Vibe Code Bench; but Vals notes Opus 5.5's TB4.0 65.15% falls to 58.08% if fallback-served attempts count as failures. GPT-6.1 Sol is the Pareto workhorse (CAI 62.9 at $1.04; tbench.ai 58.2 at $634;
  Vals Index 61.15% at $3.24; II 50 at $0.32). Fable 5.1 stays dominated (II 53 at $7.63) [B, S1, S4, S5, S6, S8].
- **Trust and coverage.** Haiku 5.5's AA numbers are provisional: AA says AutomationBench-AA (35%) is "likely understated" after a pre-release over-refusal and its cost figures exclude the >100K tier [B, S3].
  Vendor Terminal-Bench 4.0 numbers run 4-9 points above independent runs (Haiku 39.2 vs 32.8 AA / 35.35 Vals; Sonnet 5.5 70.6 vs 61.8-64.1) [V, S2; B, S1, S5, S8]. Independent computer-use, vision and
  >100K-context evidence for the 5.5 generation is still absent; Haiku 5.5's only computer-use number is vendor-reported (OSWorld 2.1 offline subset 72.4%) [V, S2].
- **Role implications (evidence only; the synthesis decides).** Claude-only cheap worker (`haiku`): Haiku 5.5 high/xhigh for non-agentic bulk work (extraction, summaries, lookups, classification) and, inside Claude Code, for moderate-difficulty coding (VulcanBench, Vibe Code Bench); keep `sonnet @low/medium` when tasks are hard or long-horizon (Coding Agent Index, TB4.0, SWE-Bench Pro HARD). Cross-harness cheap worker: Luna max/high stays the price floor and GPT-6.1 Sol low/medium the first step up (it wins on correctness per dollar on the Coding Agent Index, Vals TB4.0 and Index, Bug Hunt Bench and VulcanBench tasks passed; Haiku leads Sol on Vibe Code Bench and on VulcanBench's combined score at xhigh/max). Economy standard worker rows (MiMo-V2.6-Pro, DeepSeek V4.1 Flash) unchanged. Grinder / bug hunt: Sonnet 5.5 max leads (Bug Hunt Bench) and loses 15 points at xhigh (3 runs each), so the catalog's max-only reading stands.

## Findings

### F1. Coverage map: where Haiku 5.5 is and is not listed (checked 2026-10-13)

| Board (runner) | Haiku 5.5? | Value or note | Board date |
|---|---|---|---|
| AA Intelligence Index v4.3.2 (Artificial Analysis) | yes, 5 efforts | 43 / 41 / 38 / 34 / 29 [B, S1] | 2026-10-13 |
| AA Coding Agent Index v1.5 | yes, Claude Code only, 5 efforts | best 41.4 (xhigh) [B, S4] | 2026-10-13 |
| AA FrontierCode 1.1 (Cognition suite, AA-run) | yes | 41.8% at max [B, S1, S16] | 2026-10-12 |
| tbench.ai Terminal-Bench 4.0 | no (35 rows) | - [B, S5] | 2026-10-13 |
| Vals AI (Index v2.1, TB4.0, Vibe Code Bench, 20 more) | yes, max effort only | Vals Index 54.31% [B, S8] | 2026-10-12 |
| Scale SWE-Bench Pro V2 | yes (mini-swe-agent, high) | Full 87.23 +-2.36; HARD 52.94 +-13.01 [B, S7] | rows added 2026-10-08 |
| Scale FORTRESS / MultiChallenge | yes | risk score 9.48 (#2) / 67.67 (#6) [B, S7] | 2026-10-13 |
| Scale MCP-Atlas, HLE Diamond, RLI, VISTA | no | - [B, S7] | 2026-10-13 |
| LMArena WebDev | yes | 1587 +-20, 978 votes, rank 30 [B, S6] | 2026-10-08 |
| LMArena Text / Vision / Agent | no | boards dated 10-08 / 10-09 / 10-12 [B, S6] | - |
| Epoch-run (FrontierMath T1-3 and T4 v2, GPQA Diamond, SimpleQA Verified, OTIS Mock AIME, EBR, Furniture Assembly, Mystery Game Puzzles) | yes | see F9 [B, S9] | 2026-10-07..09 |
| Epoch ECI and mirrors (FrontierSWE, DeepSWE, FrontierCode, APEX-Agents, LMCA, CursorBench, Vending-Bench, OSWorld, METR) | no | - [B, S9] | bundle 2026-10-13 |
| LiveBench (2026-06-25 release table) | yes, xHigh | overall 72.1 [B, S10] | 2026-10-13 |
| ARC Prize (ARC-AGI-1/2/3) | no | - [B, S11] | 2026-10-13 |
| OSWorld 2.0 official + Yutori / Steel aggregators | no | vendor-only 72.4% [V, S2] | official JSON 2026-10-05 |
| METR time horizons | no | page "no longer actively updated" [B, S13] | 2026-09-08 |
| SWE-rebench | no | window 2026-05-15..07-01 [B, S14] | - |
| Vending-Bench 2 | row hidden | top 10 visible only; chart palette names Haiku 5.5 [B, S15] | 2026-10-13 |
| Bug Hunt Bench (community-run) | yes, 5 efforts | 21.5 / 18.3 / 16 / 12 / 11 of 105 [B, community-run, S20] | 2026-10-08 |
| VulcanBench Frontier v4 (community-run) | yes, 5 efforts | combined 92.16 max · 91.83 xhigh · 88.01 high · 84.03 medium · 84.42 low [B, community-run, S21] | 2026-10-12 |
| Fiction.LiveBench, OpenAI-MRCR v2, ScreenSpot-Pro | no | no 5.x / 6.x rows anywhere [B, S19] | - |

### F2. Artificial Analysis Intelligence Index v4.3.2: cost, speed, latency (snapshot 2026-10-13 12:49 local) [B, S1]

Cost = "weighted average cost per Intelligence Index task" (USD); tok/s = median output speed; TTFT = first chunk (s); E2E = total response (s). ", fb" = Anthropic rows served with a refusal
fallback to another Claude model (AA label "with fallback"); Haiku 5.5 rows have no fallback label. Speed and latency are rolling medians: max/xhigh latencies moved up to 30% between two fetches
25 minutes apart (Luna max TTFT 120 s → 101 s), so read them as +-30%. Haiku 5.5 cost is provisional and excludes the >100K tier [B, S3].

| Model (setting) | Index | $ per task | tok/s | TTFT s | E2E s | Context |
|---|---|---|---|---|---|---|
| Claude Haiku 5.5 (max) | 43 | 0.21 | 238 | 309.80 | 311.90 | 1M |
| Claude Haiku 5.5 (xhigh) | 41 | 0.12 | 188 | 78.69 | 81.34 | 1M |
| Claude Haiku 5.5 (high) | 38 | 0.08 | 176 | 24.59 | 27.43 | 1M |
| Claude Haiku 5.5 (medium) | 34 | 0.05 | 179 | 12.73 | 15.53 | 1M |
| Claude Haiku 5.5 (low) | 29 | 0.02 | 171 | 8.89 | 11.81 | 1M |
| GPT-6 Luna (max) | 38 | 0.07 | 135 | 101.14 | 104.85 | 1M |
| GPT-6 Luna (xhigh) | 35 | 0.04 | 128 | 45.83 | 49.72 | 1M |
| GPT-6 Luna (high) | 33 | 0.03 | 134 | 19.68 | 23.42 | 1M |
| GPT-6 Luna (medium) | 30 | 0.02 | -- | -- | -- | 1M |
| GPT-6 Luna (low) | 22 | 0.0045 | 126 | 2.55 | 6.52 | 1M |
| GPT-6.1 Sol (max) | 52 | 0.72 | 65 | 330.58 | 338.25 | 1M |
| GPT-6.1 Sol (xhigh) | 51 | 0.39 | 60 | 177.62 | 186.00 | 1M |
| GPT-6.1 Sol (high) | 50 | 0.32 | 58 | 59.66 | 68.34 | 1M |
| GPT-6.1 Sol (medium) | 48 | 0.21 | 55 | 7.64 | 16.70 | 1M |
| GPT-6.1 Sol (low) | 42 | 0.13 | 52 | 2.58 | 12.17 | 1M |
| MiMo-V2.6-Pro | 46 | 0.13 | 48 | 3.94 | 56.12 | 1M |
| MiMo-V2.6-Flash | 38 | 0.06 | 63 | 3.20 | 43.01 | 1M |
| DeepSeek V4.1 Flash (max) | 39 | 0.27 | 198 | 1.02 | 13.67 | 1M |
| GLM-5.3-Flash | 42 | 0.28 | 67 | 2.86 | 40.35 | 1M |
| Gemini 3.8 Flash (high) | 41 | 1.24 | 143 | 23.97 | 27.48 | 1M |
| Gemini 3.8 Flash (medium) | 40 | 0.93 | -- | -- | -- | 1M |
| Gemini 4 Argon (high) | 53 | 1.99 | -- | -- | -- | 1M |
| Claude Sonnet 5.5 (max, fb) | 56 | 5.46 | 135 | 450.38 | 454.07 | 1M |
| Claude Sonnet 5.5 (xhigh, fb) | 52 | 2.01 | 104 | 36.14 | 40.94 | 1M |
| Claude Sonnet 5.5 (high, fb) | 47 | 0.88 | 99 | 13.91 | 18.93 | 1M |
| Claude Sonnet 5.5 (medium, fb) | 41 | 0.48 | 99 | 0.87 | 5.90 | 1M |
| Claude Sonnet 5.5 (low, fb) | 36 | 0.35 | 101 | 0.57 | 5.53 | 1M |
| Claude Opus 5.5 (max, fb) | 58 | 5.98 | 95 | 683.90 | 689.14 | 1M |
| Claude Opus 5.5 (xhigh, fb) | 56 | 3.46 | 82 | 159.26 | 165.36 | 1M |
| Claude Opus 5.5 (high, fb) | 54 | 1.82 | 83 | 56.83 | 62.84 | 1M |
| Claude Opus 5.5 (medium, fb) | 51 | 1.34 | 82 | 27.83 | 33.96 | 1M |
| Claude Opus 5.5 (low, fb) | 42 | 0.55 | 81 | 12.35 | 18.55 | 1M |
| Claude Fable 5.1 (max, fb) | 53 | 7.63 | 70 | 243.75 | 250.93 | 1M |
| Claude Fable 5.1 (high, fb) | 51 | 3.91 | 56 | 17.98 | 26.91 | 1M |
| GPT-6 Astra (max) | 53 | 3.26 | 64 | 343.07 | 350.92 | 1M |
| GPT-6 Astra (low) | 46 | 0.82 | 56 | 2.48 | 11.40 | 1M |
| Grok 4.7 (high) | 46 | 2.73 | 77 | 49.16 | 55.70 | 500k |
| Kimi K3 (max) | 44 | 2.00 | 44 | 3.14 | 60.38 | 1.05M |
| GLM-5.3 (max) | 45 | 2.01 | 67 | 3.32 | 40.66 | 1M |
| Muse Wonder (max) | 52 | 4.52 | 115 | 20.18 | 41.92 | 1.05M |
| Muse Wonder Full (max) | 56 | -- | -- | -- | -- | 1M |
| Muse Spark 1.3 (max) | 48 | 1.60 | 127 | 41.68 | 61.32 | 1M |

AA's own class standing for Haiku 5.5 (max): 43 on the Intelligence Index, speed rank 13 of 147, verbosity 440M output tokens for the whole index (rank 60 of 60 in its class, median 95M) [B, S1]. AA text:
"Haiku 5.5 (max) uses ~162k output tokens per Intelligence Index task, ~3x GPT-6 Luna (max, ~50k)" [B, S3]. Haiku 5.5 (max) AA capability indexes: Finance and Accounting 43.9, Strategy and Ops 40.4,
Legal 42.3, Healthcare 44.1, Engineering 44.9, Economics 51.2 [B, S1].

### F3. AA per-eval matrix, same index version (values from the page's embedded JSON, 2026-10-13) [B, S1]

Evals inside II v4.3.2: AA-Briefcase v1.1, GDPval-AA v2.1, AutomationBench-AA, Terminal-Bench 4.0, SciCode, HLE, GDP.pdf, CritPt, AA-Omniscience, AA-LCR v1.1. FrontierCode 1.1 is standalone (not in II).
"rel. time/task" is AA's `intelligenceIndexTimePerTask` field: unit not stated unambiguously (chart label says minutes, values imply seconds), use only as a ratio. Omniscience = accuracy % / hallucination rate %.

| Model (effort) | II | $/task | out k-tok/task | rel. time/task | TB4.0 % | FrontierCode % | AA-Briefcase Elo | GDPval-AA Elo | HLE % | SciCode % | AA-LCR % | Omniscience acc / halluc | AutomationBench % | CritPt % |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Haiku 5.5 max | 43.4 | 0.213 | 162 | 421 | 32.8 | 41.8 | 1577 | 1618 | 44.4 | 55.0 | 82.7 | 36 / 40 | 35.4 | 18.9 |
| Haiku 5.5 xhigh | 41.2 | 0.124 | 89 | 290 | 29.3 | - | 1533 | 1511 | 42.7 | 51.7 | 78.3 | 35 / 44 | 36.0 | 22.6 |
| Haiku 5.5 high | 37.8 | 0.079 | 55 | 196 | 21.7 | - | 1442 | 1418 | 37.3 | 48.7 | 77.3 | 35 / 45 | 33.7 | 18.6 |
| Haiku 5.5 medium | 34.5 | 0.047 | 33 | 117 | 15.2 | - | 1372 | 1274 | 33.8 | 49.0 | 77.3 | 34 / 45 | 28.6 | 12.9 |
| Haiku 5.5 low | 29.5 | 0.024 | 17 | 66 | 12.6 | - | 1112 | 1122 | 27.0 | 49.2 | 72.0 | 33 / 45 | 22.9 | 9.1 |
| Haiku 4.5 (reasoning) | 16.9 | 0.277 | 18 | 150 | 0.0 | - | 616 | 732 | 10.4 | 42.2 | 74.3 | 18 / 27 | 3.2 | 0.0 |
| GPT-6 Luna max | 38.1 | 0.068 | 50 | 373 | 12.6 | 41.9 | 1336 | 1430 | 38.5 | 54.6 | 83.3 | 44 / 77 | 53.2 | 19.4 |
| GPT-6 Luna high | 32.9 | 0.029 | 20 | 151 | 4.5 | - | 1186 | 1340 | 32.9 | 50.3 | 79.3 | 43 / 84 | 47.8 | 15.4 |
| GPT-6.1 Sol max | 51.8 | 0.724 | 38 | 601 | 56.1 | 49.1 | 1561 | 1593 | 52.9 | 54.2 | 83.0 | 62 / 54 | 64.9 | 31.7 |
| GPT-6.1 Sol high | 50.2 | 0.319 | 13 | 230 | 51.5 | - | 1465 | 1510 | 51.4 | 55.8 | 82.3 | 61 / 49 | 64.5 | 30.0 |
| GPT-6.1 Sol low | 42.1 | 0.131 | 4 | 77 | 30.8 | - | 1116 | 1317 | 47.4 | 53.2 | 84.0 | 59 / 52 | 52.6 | 24.9 |
| Opus 5.5 max | 57.6 | 5.982 | 119 | 800 | 59.6 | 52.2 | 1807 | 1866 | 61.4 | 66.9 | 84.7 | 66 / 59 | 69.5 | 31.7 |
| Opus 5.5 high | 53.6 | 1.823 | 36 | 272 | 56.6 | - | 1690 | 1705 | 55.6 | 60.4 | 82.7 | 65 / 68 | 63.2 | 30.9 |
| Opus 5.5 low | 42.3 | 0.551 | 10 | 81 | 31.3 | - | 1279 | 1234 | 48.3 | 58.6 | 80.7 | 64 / 68 | 52.9 | 17.7 |
| Sonnet 5.5 max | 56.0 | 5.461 | 197 | 932 | 63.6 | 45.8 | 1823 | 1838 | 55.0 | 61.0 | 82.7 | 54 / 47 | 71.8 | 31.4 |
| Sonnet 5.5 high | 46.8 | 0.884 | 37 | 238 | 43.9 | - | 1638 | 1550 | 45.8 | 53.7 | 78.0 | 52 / 65 | 59.4 | 24.6 |
| Sonnet 5.5 medium | 40.8 | 0.483 | 21 | 132 | 29.8 | - | 1442 | 1323 | 39.8 | 52.9 | 76.3 | 47 / 51 | 54.9 | 16.9 |
| Fable 5.1 max | 53.4 | 7.630 | 78 | 711 | 52.0 | 49.0 | 1675 | 1756 | 59.1 | 63.1 | 85.3 | 67 / 73 | 59.4 | 29.7 |
| GPT-6 Astra max | 52.7 | 3.258 | 27 | 437 | 59.1 | 47.0 | 1571 | 1572 | 54.7 | 56.5 | 80.7 | 63 / 51 | 68.5 | 31.7 |
| Gemini 4 Argon high | 52.6 | 1.990 | 62 | - | 57.1 | - | 1488 | 1624 | 57.1 | 61.8 | 79.7 | 50 / 15 | 77.5 | 27.1 |
| Muse Wonder Full max | 55.8 | - | 54 | - | 57.1 | - | 1729 | 1857 | 53.6 | 62.6 | 83.7 | 43 / 23 | 71.3 | 32.9 |
| Muse Wonder max | 52.4 | 4.516 | 54 | 528 | 52.0 | - | 1659 | 1770 | 50.1 | 60.3 | 80.7 | 41 / 27 | 68.1 | 28.3 |
| MiMo-V2.6-Pro | 46.3 | 0.133 | 64 | 1320 | 34.8 | 45.4 | 1517 | 1682 | 49.4 | 60.9 | 86.3 | 35 / 41 | 58.6 | 26.6 |
| DeepSeek V4.1 Flash max | 39.5 | 0.265 | 89 | 326 | 26.8 | 44.0 | 1422 | 1600 | 39.2 | 51.9 | 84.0 | 46 / 96 | 68.9 | 14.3 |
| Gemini 3.8 Flash high | 40.9 | 1.243 | 71 | 491 | 19.7 | 36.4 | 1203 | 1436 | 47.8 | 56.6 | 81.3 | 55 / 55 | 59.9 | 18.3 |
| GLM-5.3-Flash | 41.8 | 0.284 | 69 | 810 | 32.8 | 41.0 | 1454 | 1644 | 39.9 | 51.6 | 80.0 | 28 / 28 | 60.4 | 15.4 |
| Kimi K3 max | 43.6 | 2.000 | 48 | 1008 | 12.6 | 43.6 | 1501 | 1536 | 46.9 | 59.5 | 88.7 | 48 / 53 | 58.3 | 23.4 |
| Grok 4.7 xhigh | 46.4 | 3.738 | 81 | 916 | 25.8 | 33.8 | 1644 | 1712 | 43.1 | 57.4 | 76.7 | 47 / 29 | 65.6 | 17.7 |

Haiku 5.5 (max) AA-Briefcase 95% CI 1566-1588 [B, S1]. Spread of AA-LCR across current models is 72-89%: it does not separate them (see F11).

### F4. Cost efficiency on the AA II (derived Pareto front over the 186 AA models that report a cost per task) [B, S1]

Front, ascending cost (a point is on the front when no cheaper-or-equal model scores higher): Luna high 32.9 at $0.029 → Luna xhigh 34.6 at $0.042 → MiMo-V2.6-Flash 37.9 at $0.062 → Luna max 38.1 at $0.068 →
**Haiku 5.5 xhigh 41.2 at $0.124** → GPT-6.1 Sol low 42.1 at $0.131 → MiMo-V2.6-Pro 46.3 at $0.133 → Sol medium 47.8 at $0.214 → Sol high 50.2 at $0.319 → Sol xhigh 51.0 at $0.393 → Sol max 51.8 at $0.724 →
Opus 5.5 high 53.6 at $1.82 → Opus 5.5 xhigh 56.0 at $3.46 → Sonnet 5.5 max 56.0 at $5.46 → Opus 5.5 max 57.6 at $5.98. Not on it: Haiku 5.5 max / high / medium / low, every Sonnet 5.5 low-xhigh setting below max,
Fable 5.1, Astra, Gemini 3.8 Flash, DeepSeek V4.1 Flash, Grok 4.7, GLM-5.3, Kimi K3.

Matched pairs (same cost band or same score band):

| Comparison | Reading |
|---|---|
| Haiku high 37.8 at $0.079 vs Luna max 38.1 at $0.068 vs MiMo-Flash 37.9 at $0.062 | tie on II; AA TB4.0 Haiku 21.7 vs Luna 12.6 vs MiMo-Flash 22.7 (Luna trails in terminal work), Haiku 55K output tokens vs Luna 50K |
| Haiku xhigh 41.2 at $0.124 vs Sol low 42.1 at $0.131 vs MiMo-Pro 46.3 at $0.133 | Sol low and MiMo-Pro are +1 / +5 points at +$0.007 / +$0.009; Sol low TB4.0 30.8 ≈ Haiku xhigh 29.3 |
| Haiku max 43.4 at $0.213 vs Sol medium 47.8 at $0.214 | Sol medium +4.4 points at the same cost, 1/20 of the output tokens (8K vs 162K) |
| Haiku xhigh 41.2 at $0.124 vs Sonnet low 35.9 at $0.345 / Sonnet medium 40.8 at $0.483 / Opus low 42.3 at $0.551 | within Claude, Haiku xhigh is 2.8-4.4x cheaper for equal or higher II; but rel. time/task 290 vs 81 (Opus low) and 132 (Sonnet medium) |
| Haiku 5.5 high 37.8 vs Haiku 4.5 16.9 | +20.9 points at 29% of Haiku 4.5's cost per task ($0.079 vs $0.277) |

### F5. AA Coding Agent Index v1.5 (agent = harness + model; pass@1 over 3 attempts; DeepSWE v1.1 [Datacurve, 113 tasks], Terminal-Bench 4.0 [Laude Institute, 66 tasks], SWE-Atlas-QnA [Scale, 124 tasks]; 39 rows, 2026-10-13) [B, S4]

| Index | Harness - model (effort) | $ per task | wall min | steps | DeepSWE % | QnA % | TB4.0 % |
|---|---|---|---|---|---|---|---|
| 68.4 | Claude Code - Sonnet 5.5 (max) | 14.19 | 87 | 266 | 72.0 | 66.9 | 66.2 |
| 68.0 | Muse Code - Muse Wonder Full (max) | - | 29 | 195 | 77.0 | 68.0 | 59.1 |
| 66.0 | Claude Code - Opus 5.5 (max) | 13.04 | 64 | 155 | 68.4 | 66.4 | 63.1 |
| 63.8 | Antigravity CLI - Gemini 4 Argon (high) | 5.84 | 35 | 149 | 78.8 | 56.5 | 56.1 |
| 63.5 | Muse Code - Muse Wonder (max) | 8.05 | 22 | 192 | 75.8 | 67.2 | 47.5 |
| 62.9 | Codex - GPT-6.1 Sol (xhigh) | 1.04 | 16 | 40 | 73.2 | 61.0 | 54.5 |
| 62.9 | Claude Code - Sonnet 5.5 (xhigh) | 3.33 | 27 | 78 | 68.4 | 62.1 | 58.1 |
| 62.2 | Claude Code - Fable 5.1 (max, with fallback) | 12.39 | 35 | 37 | 64.3 | 64.8 | 57.6 |
| 61.7 | Devin Fusion CLI - Fable 5.1 xhigh + SWE-2 medium | 7.90 | 36 | 100 | 63.1 | 65.9 | 56.1 |
| 61.6 | Codex - GPT-6 Astra (max) | 7.47 | 29 | 39 | 67.6 | 61.8 | 55.6 |
| 61.4 | Codex - GPT-6.1 Sol (medium) | 0.70 | 11 | 38 | 72.0 | 60.8 | 51.5 |
| 60.1 | Codex - GPT-6.1 Sol (high) | 0.89 | 13 | 39 | 70.5 | 59.9 | 50.0 |
| 60.1 | Codex - GPT-6.1 Sol (max) | 1.55 | 24 | 40 | 69.6 | 57.8 | 53.0 |
| 59.7 | Claude Code - Opus 5 (max) | 10.79 | 42 | 152 | 62.5 | 62.1 | 54.5 |
| 58.9 | Devin Fusion CLI - Astra xhigh + SWE-2 medium | 4.54 | 25 | 79 | 67.3 | 59.4 | 50.0 |
| 57.2 | Codex - GPT-6.1 Sol (low) | 0.50 | 9 | 36 | 67.6 | 55.1 | 49.0 |
| 56.7 | Codex - GPT-6 Sol (max) | 2.99 | 22 | 87 | 69.0 | 57.5 | 43.4 |
| 56.3 | Grok Build - Grok 4.7 (xhigh) | 8.82 | 39 | 163 | 72.6 | 62.9 | 33.3 |
| 55.0 | Claude Code - Sonnet 5.5 (high) | 1.24 | 12 | 37 | 66.7 | 56.5 | 41.9 |
| 54.6 | Codex - GPT-5.6 Sol (max) | 6.35 | 21 | 116 | 72.3 | 54.0 | 37.4 |
| 54.3 | Muse Code - Muse Spark 1.3 (max) | 3.98 | 18 | 185 | 71.7 | 59.4 | 31.8 |
| 53.6 | Opencode - GLM-5.3 (max) | 4.24 | 48 | 107 | 61.4 | 59.4 | 39.9 |
| 51.9 | Kimi Code CLI - Kimi K3 | 5.05 | 61 | 173 | 68.4 | 66.1 | 21.2 |
| 51.2 | Claude Code - Step 5 Preview | 1.66 | 56 | 139 | 61.9 | 58.3 | 33.3 |
| 48.3 | Muse Code - Muse Spark 1.3 (xhigh) | 3.47 | 18 | 187 | 73.2 | 54.6 | 17.2 |
| 47.0 | Grok Build - Grok 4.6 (xhigh) | 3.57 | 19 | 112 | 64.9 | 58.3 | 17.7 |
| 45.9 | Claude Code - Sonnet 5.5 (medium) | 0.62 | 9 | 22 | 65.5 | 44.9 | 27.3 |
| 43.3 | Claude Code - Qwen3.8 Max | 3.48 | 63 | 110 | 51.0 | 62.1 | 16.7 |
| 43.2 | Codex - GPT-5.6 Luna (max) | 0.44 | 24 | 122 | 66.4 | 48.7 | 14.6 |
| 43.1 | Codex - DeepSeek V4 Pro 0813 (max) | 0.24 | 40 | 138 | 57.2 | 61.8 | 10.1 |
| 42.1 | Claude Code - Sonnet 5.5 (low) | 0.48 | 6 | 19 | 61.9 | 39.0 | 25.3 |
| 41.9 | Antigravity SDK - Gemini 3.8 Flash (high) | 2.47 | 12 | 188 | 65.8 | 45.2 | 14.6 |
| **41.4** | **Claude Code - Haiku 5.5 (xhigh)** | 0.61 | 26 | 75 | 49.0 | 51.6 | 23.7 |
| 41.1 | Codex - GPT-6 Luna (max) | 0.18 | 21 | 89 | 63.7 | 44.4 | 15.2 |
| 38.7 | Codex - DeepSeek V4 Flash 0731 (max) | 0.09 | 18 | 122 | 54.3 | 51.3 | 10.6 |
| **36.5** | **Claude Code - Haiku 5.5 (max)** | 2.58 | 87 | 121 | 46.0 | 33.6 | 29.8 |
| **35.1** | **Claude Code - Haiku 5.5 (high)** | 0.36 | 18 | 59 | 46.3 | 46.2 | 12.6 |
| **33.6** | **Claude Code - Haiku 5.5 (medium)** | 0.23 | 14 | 44 | 47.5 | 41.7 | 11.6 |
| **28.2** | **Claude Code - Haiku 5.5 (low)** | 0.14 | 12 | 34 | 45.4 | 33.1 | 6.1 |

The "GPT-5.6 Luna" row (43.2) is the older model; the current `gpt-6-luna` row is 41.1. "DeepSeek V4 Flash 0731" is not DeepSeek V4.1 Flash (not on this index). Haiku 5.5 max: 3 of 198 Terminal-Bench attempts were
refusal-fallbacks to Claude Opus 5 (1.5%), so its TB4.0 cell includes a little help from a larger model [B, S4].

**Cost-basis check for Haiku 5.5 in agent loops (derived).** Average prompt per step in the Haiku rows (input tokens incl. cached / steps) is 70-106K tokens, straddling the 100K price step. Recomputing cost from AA's mean tokens
per task (cache-hit rate 89-96%) at Haiku 5.5's list prices:

| Claude Code - Haiku 5.5 | steps | avg prompt k-tok/step | AA cost | all prompts <=100K tier | all prompts >100K tier |
|---|---|---|---|---|---|
| low | 34 | 70 | $0.14 | $0.06 | $0.31 |
| medium | 44 | 78 | $0.23 | $0.09 | $0.43 |
| high | 59 | 85 | $0.36 | $0.13 | $0.64 |
| xhigh | 75 | 92 | $0.61 | $0.20 | $1.02 |
| max | 121 | 106 | $2.58 | $0.78 | $3.91 |

The same recomputation lands within about 11% of AA for Codex + GPT-6 Luna max ($0.19-0.20 vs $0.176) and within 17-28% below AA for Sonnet 5.5 low/medium ($0.38-0.52 vs $0.48-0.62), but undershoots AA for Haiku 5.5 by 2.6-3.1x, with AA sitting
33-58% of the way to the all-upper-tier bound and rising with prompt length. This is consistent with AA having priced the >100K tier in these rows (AA does not say so; method uncertain), and it means the headline $0.10 / $0.50 does not
describe Claude Code-style loops [derived from S4 token counts and S2 prices]. Independent corroboration: VulcanBench priced its 115 Haiku 5.5 Claude Code runs per request at $138.31, against a floor of $31.10 (every request at the standard tier) and a ceiling of $155.50, and states that most of Haiku 5.5's requests carry long prompts [B, community-run, S21]. Per steps: Haiku xhigh 75 steps vs Sonnet low 19 and medium 22 [B, S4].

### F6. Terminal work: tbench.ai Terminal-Bench 4.0 (harness-native agents, 330 trials per row, 95% CI, 2026-10-13) [B, S5]

| Rank | Model | Agent | Effort | Resolution rate | Date | Run cost | Tokens (B) |
|---|---|---|---|---|---|---|---|
| 1 | Opus 5.5 | Claude Code | max | 64.8 +-3.1 | 2026-09-22 | $4.7k | 8.03 |
| 2 | Sonnet 5.5 | Claude Code | max | 61.8 +-2.9 | 2026-09-28 | $7.3k | 19.41 |
| 3 | GPT-6 Astra | Codex | max | 58.2 +-2.8 | 2026-09-03 | $3.3k | 1.53 |
| 3 | GPT-6.1 Sol | Codex | max | 58.2 +-3.1 | 2026-09-29 | $634 | 1.46 |
| 5 | Fable 5.1 | Claude Code | max | 57.9 +-3.8 | 2026-09-01 | $6.2k | 2.75 |
| 5 | GPT-6 Astra | Codex | xhigh | 57.9 +-2.7 | 2026-09-03 | $2.4k | 1.20 |
| 5 | GPT-6 Astra | Codex | high | 57.9 +-3.0 | 2026-09-03 | $2.3k | 1.21 |
| 5 | Fable 5.1 | Claude Code | xhigh | 57.9 +-3.4 | 2026-09-01 | $4.9k | 2.34 |
| 9 | Fable 5.1 | Claude Code | high | 54.5 +-3.4 | 2026-09-01 | $4.0k | 2.23 |
| 10 | GPT-6 Astra | Codex | medium | 54.2 +-2.7 | 2026-09-03 | $1.9k | 1.05 |
| 11 | Fable 5.1 | Claude Code | medium | 53.9 +-3.4 | 2026-09-01 | $2.8k | 1.62 |
| 11 | Opus 5 | Claude Code | xhigh | 53.9 +-3.2 | 2026-07-24 | $6.1k | 6.90 |
| 13 | Opus 5 | Claude Code | max | 51.8 +-3.4 | 2026-07-24 | $6.0k | 6.53 |
| 14 | GPT-6 Astra | Codex | low | 50.6 +-2.8 | 2026-09-03 | $1.6k | 0.89 |
| 15 | Opus 5 | Claude Code | high | 50.3 +-3.7 | 2026-07-24 | $4.7k | 5.48 |
| 16 | GPT-6 Sol | Codex | max | 49.4 +-3.2 | 2026-09-22 | $1.5k | 4.98 |
| 17 | Opus 5 | Claude Code | medium | 44.9 +-3.8 | 2026-07-24 | $3.2k | 3.67 |
| 18 | Fable 5 | Claude Code | max | 44.5 +-3.9 | 2026-06-09 | $7.3k | 3.79 |
| 19 | Fable 5.1 | Claude Code | low | 43.3 +-3.6 | 2026-09-01 | $2.4k | 1.33 |
| 20 | GLM-5.3 | Claude Code | max | 41.8 +-3.2 | 2026-08-14 | $2.7k | 8.68 |
| 21 | Grok 4.7 | Grok Build | xhigh | 37.6 +-3.5 | 2026-09-21 | $3.7k | 5.49 |
| 22 | GPT-5.6 Sol | Codex | max | 37.3 +-3.8 | 2026-06-26 | $2.5k | 4.41 |
| 23 | GLM-5.3-Flash | Claude Code | none | 35.8 +-3.5 | 2026-08-26 | $2.9k | 2.92 |
| 24 | Opus 5 | Claude Code | low | 34.9 +-3.9 | 2026-07-24 | $2.4k | 2.72 |
| 25 | Qwen3.8-Max-0902 | Claude Code | max | 27.0 +-3.8 | 2026-09-02 | $4.6k | 2.96 |
| 26 | Opus 4.8 | Claude Code | max | 23.6 +-3.6 | 2026-05-28 | $6.5k | 6.42 |
| 27 | GPT-5.6 Terra | Codex | max | 21.5 +-3.2 | 2026-06-26 | $1.7k | 5.68 |
| 28 | Grok 4.6 | Grok Build | high | 20.3 +-3.1 | 2026-08-12 | $3.6k | 4.00 |
| 29 | Gemini 3.8 Flash | mini-SWE-agent | high | 19.1 +-3.4 | 2026-09-02 | $1.8k | 17.19 |
| 30 | GPT-5.6 Luna | Codex | max | 17.3 +-2.9 | 2026-06-26 | $347 | 11.56 |
| 31 | GPT-6 Luna | Codex | max | 16.4 +-2.7 | 2026-09-22 | $72 | 3.91 |
| 32 | Muse Spark 1.3 | Muse Code | xhigh | 14.6 +-2.9 | 2026-09-02 | - | 9.01 |
| 33 | Grok 4.5 | Grok Build | high | 12.4 +-2.6 | 2026-07-16 | $2.1k | 3.40 |
| 33 | Sonnet 5 | Claude Code | max | 12.4 +-3.1 | 2026-06-30 | $9.6k | 21.56 |
| 35 | Gemini 3.7 Flash | mini-SWE-agent | high | 11.2 +-2.5 | 2026-08-13 | $1.3k | 11.14 |

Cross-runner check (same model, different independent runners; TB4.0 resolution %, 2026-10-12/13). The runners agree within about 5 points, so rankings are stable; vendor-reported numbers sit higher.

| Model (effort) | tbench.ai (own harness) [S5] | Vals, mini-swe-agent, 198 attempts [S8] | AA II harness [S1] | AA Coding Agent Index harness [S4] | Vendor [V, S2] |
|---|---|---|---|---|---|
| Haiku 5.5 (max) | not listed | 35.35 +-2.20, $3.05, 51 min | 32.8 | 29.8 (Claude Code) | 39.2 |
| Haiku 5.5 (xhigh) | not listed | - | 29.3 | 23.7 | - |
| GPT-6 Luna (max) | 16.4 +-2.7 | 13.64, $0.35 | 12.6 | 15.2 (Codex) | 16.4 |
| GPT-6.1 Sol (max) | 58.2 +-3.1 | 55.05, $1.72 | 56.1 | 53.0 | - |
| Opus 5.5 (max) | 64.8 +-3.1 | 65.15 (58.08 if 22 fallback-served attempts count as failures) | 59.6 | 63.1 | - |
| Sonnet 5.5 (max) | 61.8 +-2.9 | 64.14 | 63.6 | 66.2 | 70.6 |
| GPT-6 Astra (max) | 58.2 +-2.8 | 59.60 | 59.1 | 55.6 | - |
| Fable 5.1 (max) | 57.9 +-3.8 | 58.08 | 52.0 | 57.6 | - |
| Gemini 4 Argon (high) | not listed | 57.58 | 57.1 | 56.1 (Antigravity CLI) | - |
| Gemini 3.8 Flash (high) | 19.1 +-3.4 (mini-SWE) | 19.70 | 19.7 | 14.6 (Antigravity SDK) | - |
| MiMo-V2.6-Pro | not listed | 31.31, $0.50, 2h42m | 34.8 | - | - |
| DeepSeek V4.1 Flash (max) | not listed | 19.70, $0.50 | 26.8 | - | - |

### F7. Repo-level SWE and coding quality

**Scale SWE-Bench Pro V2** (642 public tasks, 11 repos; locked protocol; Scale-run; page text: "Rank (UB): 1 + the number of models whose lower CI bound exceeds this model's upper CI bound"; screenshot `r3-scale-swepro-v2.png`) [B, S7].
HARD split (2026-10-13): Opus 5 (Claude Code, xhigh) 98.00 · Fable 5.1 (CC, high) 92.20 · Astra (Codex, high) 90.20 · Kimi-K3 (mini-swe, max) 88.20 · Sonnet 5 (CC, xhigh) 88.20 · GPT-5.6 Terra 86.30 · GLM-5.3 84.30 · GPT-5.6 Sol 82.40 ·
**Sonnet 5.5 (mini-swe-agent, xhigh) 70.59 [new]** · Gemini 3.8 Flash (mini-swe, high) 58.80 · Inkling 56.90 · **Haiku 5.5 (mini-swe-agent, high) 52.94 +-13.01 [new]** · Haiku 4.5 (Claude Code, xhigh) 25.50.
Full split: Opus 5 99.4 · Fable 5.1 99.1 · Kimi-K3 97.7 · Astra 96.9 · **GPT-6.1 Sol (mini-swe, xhigh) 96.11 +-1.24 [new]** · **Sonnet 5.5 (mini-swe, xhigh) 95.79 +-1.30 [new]** · GLM-5.3 95.6 · GPT-5.6 Sol 95.5 · Gemini 3.8 Flash 94.86 · Sonnet 5 93.15 · Terra 92.37 ·
Inkling 89.88 · **Haiku 5.5 (mini-swe, high) 87.23 +-2.36 [new, last of 13]**. Rows mix harnesses (Claude Code, Codex, mini-swe-agent), so compare Haiku 5.5 only with other mini-swe rows (Gemini 3.8 Flash 94.86 / 58.80, Sonnet 5.5 95.79 / 70.59). Full is saturated; HARD is the usable split and Haiku's
HARD interval (39.9-65.9) cannot be separated from Gemini 3.8 Flash (58.80) or Inkling (56.90). Opus 5.5 and Luna are not listed.

**AA FrontierCode 1.1** (Cognition's private-task suite, 100-task Main set, AA-run in the Stirrup harness, 3 attempts; standalone, not in II; article 2026-10-12) [B, S16]: Opus 5.5 (max, fb) 52% (pass rate 58%) · GPT-6.1 Sol (max) 49% at $0.81 per task ·
Fable 5.1 49% · MiMo-V2.6-Pro 45% at $0.18 (best open) · DeepSeek V4.1 Flash and Kimi K3 44% · GPT-6 Luna (max) 42% at $0.09 · **Haiku 5.5 (max) 41.8%** · GLM-5.3-Flash 41% · Gemini 3.8 Flash 36%. AA's Pareto front of score vs cost: Luna max (42%, $0.09) → MiMo-V2.6-Pro (45%, $0.18) →
Sol max (49%, $0.81) → Opus 5.5 max (52%, $10.15); Haiku 5.5 is not on it (its cost was not read). Quote: "Leading models still fail more than 40% of the time." [B, S16].

**Epoch mirrors (bundle 2026-10-13)** [B, S9]: FrontierSWE (frontierswe.com, proximus harness, mean@5, 34 tasks): Astra 65.5 · Opus 5.5 62.3 ($99 per run) · Sonnet 5.5 61.9 · Fable 5.1 56.3 · Gemini 4 Argon 55.0 · GLM-5.3 30.2 · Grok 4.7 29.5 · Kimi K3 25.9 · Gemini 3.8 Flash 19.6 (unchanged vs 09-30 except Argon).
DeepSWE v1.1 (Datacurve, mini-swe-agent): Astra xhigh 74.1 · Gemini 3.8 Flash high 73.8 at $2.36 · GLM-5.3 69.0 · Kimi K3 68.5 · GLM-5.3-Flash 63.4 at $0.48; no 5.5-generation Anthropic rows. FrontierCode (Cognition, vendor-run): Opus 5.5 medium 54.6 (Claude Code) · Sonnet 5.5 xhigh 52.1 ·
Sol 6.1 medium 50.2 (Codex) · Luna max 42.4. CursorBench (Cursor, vendor): Opus 5.5 max 57.8 ($13.43) · Sonnet 5.5 max 55.5 ($9.67), high 47.8 ($1.67). APEX-Agents (Mercor): Gemini 4 Argon 82.2 · Sonnet 5.5 75.5 · Opus 5.5 73.5 · Fable 5.1 68.6 · Astra 64.7 · Gemini 3.8 Flash 64.3 · Sol 6.1 60.0 · MiMo-V2.6-Pro 59.5.

**SWE-rebench** (Nebius; fresh monthly tasks): still the 2026-05-15..07-01 window (111 problems, 65 repos), no model newer than Fable 5 / Opus 5 / GPT-5.6 Sol; unchanged since 09-30 [B, S14]. **SWE-bench Verified**: Vals archived it as saturated ("we no longer run this benchmark on new model releases"; top 97.00%), footnote only [B, S8].

### F8. Vals AI (independent; Haiku 5.5 run at compute effort max, temperature 1, no refusal fallback; refusal rate 0.22%, fallback rate 0.00%) [B, S8]

Haiku 5.5 results (rank of N models on that benchmark, 2026-10-13): Vals Index v2.1 54.31 +-1.41 (#18/47; $2.99 per test; 21.93B input / 747.95M output tokens; 47 min) · Vibe Code Bench v1.1 90.44 (#3/112) · CyberBench v1.1 75.48 (#6/47) · MedScribe 89.54 (#6/108) · ProofBench v1.1 89.00 (#10/50) ·
BioMysteryBench 70.37 (#12/27) · Public Benefits Bench 63.19 (#25/50) · EMB (Excel modeling) 59.02 (#36/74) · Finance Agent v2 54.14 (#26/78) · MedCode 51.54 (#15/106) · IOI 47.28 (#29/44) · SAGE 45.78 (#38/91) · Code Migration 44.57 (#21/77) ·
SWE-bench Multimodal 43.96 (#7/15) · Legal Research Bench 43.27 (#22/78) · MysteryMechanism 35.13 (#10/27) · **Terminal-Bench 4.0 35.35 +-2.20 (#14/47)** · Tax Agent Bench 31.92 (#20/69) · Vibe Code Bench 1-100 20.41 (#7/22) · Terminal-Bench Science 10.00 (#16/40) ·
SRE Bench 5.72 (#15/33) · ProgramBench 2.50 (#8/64) · Harvey's Legal Agent Benchmark 1.25 (#57/79). Content-filter refusals count as failures: "8 of 270 BioMysteryBench attempts and 1 of 70 Terminal-Bench Science tasks" [B, S8]. Versus Haiku 4.5 (thinking): Vibe Code Bench 11.39 → 90.44, Code Migration 7.55 → 44.57, EMB 22.66 → 59.02 [B, S8].

Vals Index v2.1 (GDP-weighted finance / coding / legal / tax; Vals-private benchmarks; updated 2026-10-12) and the two coding boards, selected rows:

| Model | Vals Index % ($/test) | Vals TB4.0 mini-swe-agent % ($/test) | Vibe Code Bench v1.1 OpenHands % ($/test, duration) |
|---|---|---|---|
| Gemini 4 Argon | 68.90 ($15.68) | 57.58 ($17.64) | 91.91 ($8.11, 37m) |
| Claude Sonnet 5.5 | 67.04 ($21.34) | 64.14 ($16.51) | 92.39 ($31.25, 61m) |
| Claude Opus 5.5 | 66.97 ($32.14) | 65.15 ($13.20) | 90.29 ($57.92, 96m) |
| Claude Fable 5.1 | 65.83 ($28.71) | 58.08 ($17.18) | 90.26 ($33.37, 58m) |
| Muse Wonder Full | 64.57 ($8.56) | 58.08 ($10.53) | 86.00 ($2.29, 11m) |
| GPT-6 Astra | 63.13 ($18.46) | 59.60 ($9.58) | 89.59 ($38.51, 39m) |
| GPT-6.1 Sol | 61.15 ($3.24) | 55.05 ($1.72) | 88.93 ($6.23, 75m) |
| MiMo-V2.6-Pro | 55.20 ($0.41) | 31.31 ($0.50) | 85.22 ($1.04, 61m) |
| Gemini 3.8 Flash | 54.89 ($5.71) | 19.70 ($8.65) | - |
| **Claude Haiku 5.5** | **54.31 ($2.99)** | **35.35 ($3.05)** | **90.44 ($6.07, 35m)** |
| MiMo-V2.6-Flash | 53.23 ($0.20) | 24.24 ($0.22) | - |
| DeepSeek V4.1 Flash | 51.32 ($0.33) | 19.70 ($0.50) | 84.74 ($0.41, 15m) |
| GPT-6 Luna | 51.22 ($0.43; 9.74B in / 201M out tokens) | 13.64 ($0.35) | 81.65 ($1.35, 37m) |
| Kimi K3 | 50.30 ($6.44) | 17.17 ($12.48) | 84.97 ($10.01) |

Vals caveat: Sonnet 5.5, Opus 5.5 and Fable 5.1 index scores include some tasks served by a fallback model after a refusal; counting those as failures gives 65.85 / 65.05 / 64.59 [B, S8]. Haiku 5.5 was run without fallback. Vibe Code Bench is near-saturated at the top
(places 1-10 span 87.8-92.4), so #3 means "in the top cluster", not "better than #5".

### F9. Epoch-run, LiveBench, ARC, ECI, other Scale boards

**Epoch-run evaluations** (Epoch AI runs these itself; max effort unless noted; stderr in parentheses where Epoch reports it) [B, S9]:

| Benchmark | Haiku 5.5 | GPT-6 Luna max | GPT-6.1 Sol max | Opus 5.5 max | Sonnet 5.5 max |
|---|---|---|---|---|---|
| FrontierMath Tiers 1-3 v2 (private) | 75.1 (2.6) | 78.9 | 93.7 | 91.2 | 88.8 |
| FrontierMath Tier 4 v2 (private) | 46.3 (7.9) | 56.1 | 100.0 | 95.0 | 80.5 |
| GPQA Diamond (public, saturated) | 89.6 (2.0) | 90.5 | 95.4 | 90.6 | 95.6 |
| SimpleQA Verified | 23.8 (1.3) | 41.4 | 73.9 | 72.2 | 46.5 |
| OTIS Mock AIME 2024-2025 | 98.9 (xhigh; high 97.2) | 98.9 | 100 | 100 | 100 |
| EBR bench | 43.8 | - | 54.3 | 71.4 | - |
| Furniture Assembly | 47.5 (6.4) | 44.2 | 80.0 | 83.3 | 75.0 |
| Mystery Game Puzzles | 30.0 | 7.0 | 80.0 | 71.0 | 65.0 |

Haiku 4.5 for reference: GPQA Diamond 60.5 (71.2 with 32K thinking), SimpleQA Verified 13.2, OTIS 35.8 [B, S9].

**LiveBench** (release label 2026-06-25, table already lists September-October models; contamination-resistant, rolling) [B, S10]:

| Model | Overall | Reasoning | Coding | Agentic coding | Math | Data analysis | Language | Instruction following | $ per successful task |
|---|---|---|---|---|---|---|---|---|---|
| Haiku 5.5 xHigh | 72.1 | 81.2 | 76.4 | 51.4 | 92.8 | 72.8 | 63.5 | 66.5 | 0.019 |
| GPT-6 Luna max | 72.0 | 81.8 | 79.0 | 51.2 | 89.1 | 73.4 | 73.8 | 55.9 | 0.026 |
| GPT-6.1 Sol max | 81.6 | 92.6 | 80.4 | 54.5 | 96.8 | 82.7 | 90.1 | 74.2 | 0.142 |
| Opus 5.5 max | 83.2 | 92.2 | 89.3 | 71.7 | 97.1 | 80.3 | 86.3 | 65.7 | 0.799 |
| Sonnet 5.5 xHigh | 77.8 | 86.8 | 88.9 | 39.3 | 96.7 | 78.6 | 83.4 | 70.5 | 0.141 |
| DeepSeek V4.1 Flash max | 81.1 | 86.7 | 80.0 | 77.3 | 93.3 | 79.3 | 81.2 | 70.0 | 0.029 |
| Gemini 3.8 Flash high | 75.8 | 89.3 | 72.5 | 54.2 | 91.6 | 54.0 | 87.8 | 81.4 | 0.307 |

**ARC Prize** (2026-10-13; Haiku 5.5 and Sonnet 5.5 not listed) [B, S11]: new GPT-6.1 Sol rows: max ARC-AGI-2 94.2% at $0.254 per task, ARC-AGI-3 52.7% Standard ($7.6K) / 96.2% Provider Adapter ($3.8K); xhigh 91.7% at $0.178; high 91.7% at $0.135; medium 86.7% at $0.100; low 76.7% at $0.086.
Unchanged: Astra max ARC-AGI-2 95.0% at $1.12; Opus 5.5 high 93.3% at $0.408, xhigh 92.5%, max 91.7%; Fable 5.1 max 90.0% at $4.49; Gemini 3.8 Flash high 89.2% at $0.400; Luna max 59.3% at $0.062 (ARC-AGI-3 0.1%); DeepSeek V4.1 Flash max 72.9% at $0.129.

**Epoch Capabilities Index** (2026-10-13) [B, S9]: Opus 5.5 167.33 (CI 164.06-171.68) · GPT-6 Astra 166.45 · GPT-6.1 Sol 166.09 · Sonnet 5.5 165.03 · Fable 5.1 164.70 · Opus 5 162.78 · GPT-6 Sol 162.72 · Kimi K3 157.45 · Gemini 3.8 Flash 156.71 · GPT-6 Luna 156.28; Haiku 4.5 142.41; Haiku 5.5 not yet in.

**Other Scale boards** [B, S7]: FORTRESS (adversarial robustness risk score, lower is safer): gpt-oss-120b 8.24 (#1), **Claude Haiku 5.5 9.48 +-1.34 (#2)**, Claude Opus 4.8 18.19. MultiChallenge (multi-turn instruction following): GPT-6.1 Sol 81.95 +-4.16 (#1), Muse Spark 1.1 75.3, **Haiku 5.5 67.67 +-5.34 (#6)**.
HLE Diamond top (unchanged): Astra 60.6, Opus 5.5 55.0, Fable 5.1 51.3. Remote Labor Index: Opus 5.5 21.25 (#1), Astra 20.83, Fable 5.1 17.92. MCP-Atlas: unchanged (Muse Spark 1.1 88.1, Fable 5.1 87.2; Haiku 4.5 40.2 at #34); VISTA stale (top Gemini 2.5 Pro Experimental 54.65, gpt-5.4-pro 53.89).

### F10. LMArena (crowd blind votes, style control on; boards dated 2026-10-08 Text and WebDev, 10-09 Vision, 10-12 Agent) [B, S6]

| Board | Haiku 5.5 | Top | Incumbents and neighbours |
|---|---|---|---|
| WebDev (852,934 votes, 142 models) | **claude-haiku-5.5-high 1587 +20/-20, 978 votes, rank 30 (spread 26-35)** | Opus 5.5 max 1813 +15/-15 (2,294 votes) | Astra max 1786 · Sonnet 5.5 xhigh 1774 · Sol 6.1 max 1755 · Fable 5.1 max 1744 · Sonnet 5.5 high 1715 · Gemini 4 Argon high 1678 (prelim) · MiMo-V2.6-Flash 1637 · MiMo-V2.6-Pro 1629 · GLM-5.3-Flash 1609 · DeepSeek V4.1 Flash 1619 · Gemini 3.8 Flash high 1583 (+-8, prelim) · **GPT-6 Luna max 1581 (+-7, 12,332 votes)** · Haiku 4.5 1330 (+-5) |
| Text (8,734,330 votes, 414 models) | not listed | Gemini 4 Argon high 1525 +-9 (prelim, 4,892 votes) | Opus 5.5 high 1507 +-8 (6,272) · Fable 5.1 max 1501 +-6 · Gemini 3.8 Flash high 1497 (prelim) · Kimi K3 1488 · Sol 6.1 max 1484 +-9 (4,512) · MiMo-V2.6-Pro 1480 · GLM-5.3 1478 · Sonnet 5.5 xhigh 1476 +-9 (4,838) · Astra max 1475 · DeepSeek V4.1 Flash 1475 · Luna max 1443 +-5 · Haiku 4.5 1414 +-2 |
| Vision (1,462,389 votes, 165 models) | not listed | Fable 5 high 1308 +-7 | Sol 6.1 max 1294 +-14 · Opus 5.5 high 1293 +-13 · Gemini 3.8 Flash high 1289 (prelim) · Fable 5.1 max 1286 · Astra max 1286 · GLM-5.3-Flash 1273 · Sonnet 5.5 xhigh 1266 +-14 · DeepSeek V4.1 Flash 1260 · MiMo-V2.6-Pro 1246 · Luna max 1241 +-12 |
| Agent (51 models; net improvement in real sessions) | not listed | Opus 5.5 max +17.89% +-4.24 (5,686 sessions, $5.69 per task P50, 113.6K output tokens) | GPT-6.1 Sol max +13.81% ($0.64, 30.3K) · GPT-6 Sol +12.60% · Gemini 4 Argon +12.37% · Astra +12.34% · Fable 5.1 +11.74% · Sonnet 5.5 max +10.75% ($3.42, 136K) · Gemini 3.8 Flash +5.18% · MiMo-V2.6-Pro +3.08% ($0.11) · **GPT-6 Luna max +2.76% ($0.08, 40.6K)** |

Rank ties are not separations: Haiku 5.5's WebDev score (+-20 on 978 votes) is statistically level with Luna max, Gemini 3.8 Flash and GLM-5.3-Flash and 30 Elo below DeepSeek V4.1 Flash. Human WebDev preference puts Haiku 5.5 226 Elo below Opus 5.5, while Vals' rubric-based Vibe Code Bench puts it level with Opus 5.5: the two
measure different things (visual and UX preference vs spec and test completion). No Copilot arena found; the site's nav is Agent / Chat / Code / Image / Video.

### F11. Computer use, vision, long context, tool use: independent coverage of the 5.5 generation

- **Computer use.** OSWorld 2.0 official JSON (updated 2026-10-05; 108 long tasks): rows are Opus 5 (max, v2.1 full: 77.67 partial / 44.33 binary; offline 79.2 / 48.65), "Sai w/ Claude Opus 5" 79.38 / 41.67 ($1,548.72), GPT-5.6 Sol max 62.72 / 27.34 (offline 64.13 / 28.1), Opus 4.8, GPT-5.5, older. **No Haiku 5.5, Opus 5.5, Sonnet 5.5 or GPT-6.x row**; Yutori and Steel aggregator pages
  have none either [B, S12]. Vendor only: Haiku 5.5 72.4% on the OSWorld 2.1 offline subset vs Haiku 4.5 15.7%, GPT-6 Luna 48.9%, Sonnet 5.5 83.9% [V, S2]; one aggregator write-up says the 72.4 is partial credit with 37.1% strict pass (unverified against Anthropic; not used) [S18].
- **Vision.** AA MMMU-Pro (121 models): Opus 5.5 max 87.7 · Astra 86.9 · Sol 6.1 max 86.0 · Gemini 3.8 Flash 85.6 · Kimi K3 80.5 · GPT-6 Luna max 79.7 · MiMo-V2.6-Flash 73.1 · Haiku 4.5 58.6; **not run for Haiku 5.5 or Sonnet 5.5** [B, S1]. LMArena Vision: Haiku 5.5 absent (F10). Vendor only: Chartography
  46.4% no tools (Haiku 4.5 6.4, Luna 29.1, Sonnet 5.5 61.6) [V, S2]. Scale VISTA stale; ScreenSpot-Pro official board has no 5.5 / GPT-6 rows [B, S7, S19].
- **Long context.** AA-LCR v1.1 covers documents of 10K-100K tokens only (100 questions; AA text: "ranging from 10k to 100k tokens"), scores of current models span 72-89 (Kimi K3 88.7, Step 5 88.3, MiMo-V2.6-Pro 86.3, Fable 5.1 85.3, Opus 5.5 84.7, Luna 83.3, Sol 83.0, Haiku 5.5 max 82.7 / xhigh 78.3 / high 77.3, Haiku 4.5 74.3) [B, S1, S17].
  Haiku 5.5's price steps 5x at exactly 100K prompt tokens [V, S2], and nothing independent measures any current model beyond 100K (Fiction.LiveBench has no 2026-Q3 rows; OpenAI-MRCR v2 only appears on aggregators repeating vendor numbers) [B, S19].
- **Tool use and agent orchestration.** LMArena Agent (F10) has no Haiku 5.5. Scale MCP-Atlas unchanged. AA's tau2 field is null for Haiku 5.5 and saturated (0.95+) for older models; no independent BrowseComp board [B, S1, S7].
- **Knowledge work.** AA GDPval-AA v2.1 / AA-Briefcase (F3): Haiku 5.5 max 1618 / 1577 exceeds GPT-6.1 Sol max (1593 / 1561), Astra (1572 / 1571) and Luna (1430 / 1336), and trails Opus 5.5 (1866 / 1807), Sonnet 5.5 (1838 / 1823), Muse Wonder Full (1857 / 1729); the AA-Briefcase CI is +-11, so the Sol and Astra gaps there are ties. Vendor and AA agree: Anthropic's table shows 1620 / 1578 for Haiku 5.5 and 1437 / 1336 for Luna [V, S2; B, S1].

### F12. Vendor numbers vs independent (Anthropic launch table 2026-10-07; benchmarks chosen by the vendor)

| Benchmark | Vendor Haiku 5.5 / Luna / Sonnet 5.5 [V, S2] | Independent [B] | Gap |
|---|---|---|---|
| GDPval-AA v2.1 | 1620 / 1437 / 1840 | 1618 / 1430 / 1838 [S1] | none (AA is the runner of both) |
| AA-Briefcase v1.1 | 1578 / 1336 / 1824 | 1577 / 1336 / 1823 [S1] | none |
| Terminal-Bench 4.0 | 39.2 / 16.4 / 70.6 | Haiku 32.8 (AA), 35.35 (Vals); Luna 16.4 (tbench.ai), 13.64 (Vals); Sonnet 61.8 (tbench.ai), 64.14 (Vals), 63.6 (AA) [S1, S5, S8] | Haiku +4 to +6; Sonnet +6 to +9; Luna 0 to +4 (the vendor figure equals the tbench.ai entry) |
| HLE no tools | 45.9 / - / 56.9 | Haiku 44.4, Sonnet 55.0 (AA) [S1] | +1.5 / +1.9 |
| FrontierCode 1.1 (Main) | 46.4 / 42.4 / 52.1 (xhigh) | Haiku 41.8, Luna 41.9, Sonnet 5.5 45.8 (AA, Stirrup harness) [S1, S16] | +4.6 / +0.5 / +6.3 |
| OSWorld 2.1 offline subset | 72.4 / 48.9 / 83.9 | none exists | unverifiable |
| Chartography (vision) | 46.4 / 29.1 / 61.6 | none exists | unverifiable |

Quote: "Sonnet 5.5 and Opus 5.5 remain better choices for complex agentic coding tasks like those measured by Terminal-Bench 4.0." [V, S2]. The vendor also positions Haiku 5.5 for "classification, extraction, and routing" and subagent work and says computer use and browser use are an especially good fit [V, S2].

### F13. Per-capability rankings (evidence-weighted; each rank names the boards behind it; ties stated where CIs overlap)

1. **Architecture and hard reasoning.** AA II: Opus 5.5 max 57.6 > Muse Wonder Full 55.8 = Opus 5.5 xhigh 56.0 = Sonnet 5.5 max 56.0 > Opus 5.5 high 53.6 > Fable 5.1 53.4 ≈ Astra 52.7 ≈ Gemini 4 Argon 52.6 ≈ Muse Wonder 52.4 ≈ Sol 6.1 max 51.8; Haiku 5.5 max 43.4 [S1]. ECI: Opus 5.5 167.3 ≈ Astra 166.5 ≈ Sol 6.1 166.1 ≈ Sonnet 5.5 165.0 ≈ Fable 5.1 164.7 (CIs overlap) [S9].
   ARC-AGI-2: Astra 95.0 ≈ Sol 6.1 94.2 ≈ Opus 5.5 high 93.3 [S11]. HLE (AA): Opus 5.5 61.4 > Fable 5.1 59.1 > Opus xhigh 57.5 ≈ Argon 57.1 > Sonnet 5.5 55.0 ≈ Astra 54.7 [S1]. FrontierMath T1-3: Sol 6.1 = Astra 93.7 > Opus 5.5 91.2 > Fable 5.1 90.2 > Sonnet 5.5 88.8 [S9].
   Best cost-adjusted reasoner: GPT-6.1 Sol medium-high (47.8-50.2 at $0.21-0.32); cheap reasoners: Luna, MiMo-V2.6-Pro, Haiku 5.5 xhigh (F4).
2. **Long-horizon agentic coding.** Coding Agent Index: Sonnet 5.5 (CC, max) 68.4 ≈ Muse Wonder Full 68.0 > Opus 5.5 (CC) 66.0 > Argon 63.8 ≈ Wonder 63.5 > Sol xhigh (Codex) 62.9 = Sonnet 5.5 xhigh 62.9 (the cheap Pareto point is Sol at $1.04) [S4]. FrontierSWE: Astra 65.5 > Opus 5.5 62.3 ≈ Sonnet 5.5 61.9 > Fable 5.1 56.3 [S9].
   FrontierCode (AA): Opus 5.5 52 > Sol 49 = Fable 5.1 49 [S16]. SWE-Bench Pro V2 HARD: Opus 5 98.0 > Fable 5.1 92.2 > Astra 90.2 (no Opus 5.5 row) [S7]. Vibe Code Bench (app building): Sonnet 5.5 92.4 > Argon 91.9 > **Haiku 5.5 90.4** ≈ Opus 5.5 90.3 ≈ Fable 5.1 90.3 > Astra 89.6 > Sol 88.9 [S8]. Bug Hunt Bench (105 planted bugs): Sonnet 5.5 max 51.3 > Astra max 45 > Sol 6.1 max 44.3 > Fable 5.1 max 43 > Opus 5.5 max 41.7; Haiku 5.5 max 21.5 [S20]. VulcanBench Frontier v4 (23 tasks, combined score): Grok 4.7 (Cursor) 93.2 > Haiku 5.5 max 92.2 ≈ Sonnet 5.5 max 92.0 ≈ Fable 5.1 max 91.8 > Opus 5.5 high 91.1 > Astra max 89.3 > Sol 6.1 xhigh 88.8; Luna max 81.4 [S21]. METR: no 5.x / 6.x data [S13].
3. **Terminal work.** tbench.ai: Opus 5.5 64.8 > Sonnet 5.5 61.8 > Astra 58.2 = Sol 6.1 58.2 = Fable 5.1 57.9 (Opus 5.5 vs Astra separated; Sonnet 5.5 vs Astra overlaps) [S5]; Vals (one harness): Opus 5.5 65.15 (58.08 counting fallbacks as failures) ≈ Sonnet 5.5 64.14 > Astra 59.60 > Fable 5.1 / Wonder Full 58.08 > Argon 57.58 > Sol 6.1 55.05 [S8].
   AA's own run: Sonnet 5.5 63.6 > Opus 5.5 59.6 ≈ Astra 59.1 > Argon / Wonder Full 57.1 > Sol 56.1. Cheap tier: Haiku 5.5 29-35 > MiMo-V2.6-Pro 31-35 (but 2-3 h per run) > GLM-5.3-Flash 33 > DeepSeek V4.1 Flash 20-27 > Gemini 3.8 Flash 19-20 > Luna 13-16 [S1, S5, S8].
4. **Computer use (GUI).** No independent ranking for the 5.5 / GPT-6 generation. Last independent data: Opus 5 (max) 77.7-79.2 partial on OSWorld 2.0 and GPT-5.6 Sol 62.7-64.1 [S12]. Vendor-only: Haiku 5.5 72.4, Sonnet 5.5 83.9, Luna 48.9 on OSWorld 2.1 offline [V, S2]. Do not rank on this.
5. **Vision.** LMArena Vision (10-09): Fable 5 1308 > Sol 6.1 1294 ≈ Opus 5.5 1293 ≈ Gemini 3.8 Flash 1289 ≈ Fable 5.1 1286 ≈ Astra 1286 > Sonnet 5.5 1266 > Luna 1241; top 20 within ~25 Elo, CIs +-7-14, so near-tie [S6]. AA MMMU-Pro: Opus 5.5 87.7 > Astra 86.9 > Sol 6.1 86.0 > Gemini 3.8 Flash 85.6; Haiku 5.5 not run [S1]. No independent Haiku 5.5 vision number.
6. **Long context.** Only AA-LCR (10-100K): flat 77-89 across current models; Kimi K3 / MiMo-V2.6-Pro / Fable 5.1 / Opus 5.5 lead by 1-3 points (noise). Nothing independent beyond 100K [S1, S17]. Advertised windows: 1M for all Claude 5.x, GPT-6.x, Gemini, MiMo, DeepSeek, GLM; Grok 4.7 500K [S1].
7. **Tool use and agent orchestration.** Agent Arena: Opus 5.5 +17.9 > Sol 6.1 +13.8 > Sol 6 +12.6 > Argon +12.4 > Astra +12.3 > Fable 5.1 +11.7 > Sonnet 5.5 +10.8 (CIs +-2-4: top 7 are a near-tie below Opus 5.5) [S6]. MultiChallenge: Sol 6.1 82.0 (#1) vs Haiku 5.5 67.7 [S7].
8. **Knowledge work and professional tasks.** GDPval-AA: Opus 5.5 1866 > Muse Wonder Full 1857 > Sonnet 5.5 1838 > Muse Wonder 1770 > Fable 5.1 1756 > Grok 4.7 1712 > MiMo-V2.6-Pro 1682 > GLM-5.3-Flash 1644 > Argon 1624 ≈ Haiku 5.5 1618 > DeepSeek V4.1 Flash 1600 > Sol 6.1 1593 > Astra 1572 (this board does not track overall capability: Haiku 5.5 sits above Sol and Astra) [S1]. Vals Index: Argon 68.9 > Sonnet 5.5 67.0 ≈ Opus 5.5 67.0 > Fable 5.1 65.8 > Wonder Full 64.6 > Astra 63.1 > Sol 6.1 61.2 > MiMo-V2.6-Pro 55.2 > Haiku 5.5 54.3 [S8].
   APEX-Agents: Argon 82.2 > Sonnet 5.5 75.5 > Opus 5.5 73.5 [S9].
9. **Cost efficiency (score per dollar; use the front, not the ratio).** AA II front: F4. Coding Agent Index: Sol low 57.2 at $0.50 → Sol medium 61.4 at $0.70 → Sol xhigh 62.9 at $1.04 → Argon 63.8 at $5.84 → Opus 5.5 66.0 at $13.04 → Sonnet 5.5 68.4 at $14.19 [S4]. tbench.ai run cost: Sol 6.1 $634 for 58.2 vs Astra $3.3k vs Opus 5.5 $4.7k for 64.8 [S5].
   Vals Index per test: MiMo-V2.6-Pro 55.2 at $0.41 · Luna 51.2 at $0.43 · Sol 61.2 at $3.24 · Haiku 5.5 54.3 at $2.99 (7x Luna's cost for +3.1 points) · Argon 68.9 at $15.68 [S8]. Vals TB4.0: Sol 55.05 at $1.72 vs Haiku 35.35 at $3.05 [S8]. Vibe Code Bench: DeepSeek V4.1 Flash 84.7 at $0.41 · MiMo-V2.6-Pro 85.2 at $1.04 · Haiku 5.5 90.4 at $6.07 · Sol 88.9 at $6.23 · Argon 91.9 at $8.11 [S8].

### F14. Haiku 5.5 operating notes (what the numbers imply for how to run it)

| Effort | AA II | $/task | out k-tok | TTFT s | AA TB4.0 % | CAI (Claude Code) | CAI $ / wall min / steps |
|---|---|---|---|---|---|---|---|
| low | 29.5 | 0.024 | 17 | 8.9 | 12.6 | 28.2 | 0.14 / 12 / 34 |
| medium (vendor default) | 34.5 | 0.047 | 33 | 12.7 | 15.2 | 33.6 | 0.23 / 14 / 44 |
| high | 37.8 | 0.079 | 55 | 24.6 | 21.7 | 35.1 | 0.36 / 18 / 59 |
| xhigh | 41.2 | 0.124 | 89 | 78.7 | 29.3 | **41.4** | 0.61 / 26 / 75 |
| max | 43.4 | 0.213 | 162 | 309.8 | 32.8 | 36.5 | 2.58 / 87 / 121 |

- II steps are monotonic and cheap until xhigh; max adds 2.2 points for 1.7x cost and 3.9x TTFT. In the AA agent harness max is worse than xhigh (QnA 33.6 vs 51.6 and 87 min per task suggest overthinking or timeouts); VulcanBench and Bug Hunt Bench show max level with xhigh within noise at 1.2-1.8x the cost. Do not run max in an orchestrator loop.
- Cost is a lower bound twice over: AA's II cost excludes the >100K tier [B, S3], and agent loops average 70-106K tokens per step (F5; VulcanBench's own accounting agrees, F16). Compare Luna, whose price has no step below 272K tokens per the catalog [V].
- Verbosity: 3.2x Luna max's output tokens and 4.3x Sol max's (162K vs 50K vs 38K per II task), and in Vals 748M output tokens vs Luna 201M and Sol 105M [B, S1, S8]. Time per task follows tokens, not tok/s: Haiku xhigh (relative 290) is slower per task than Opus 5.5 low (81) and Sonnet 5.5 medium (132) despite 188 vs 81-99 tok/s.
- Refusals: AA saw an over-refusal in pre-release testing that depresses AutomationBench-AA (35%, rerun pending); Vals measured a 0.22% refusal rate; 3 of 198 AA Terminal-Bench attempts fell back to Opus 5; VulcanBench had 3 of 115 Haiku runs (one task) stopped by a safety classifier with an empty patch [B, S3, S8, S4; B, community-run, S21].
- Calibration: AA-Omniscience hallucination rate 40% at 36% accuracy, well below Luna (77%), DeepSeek V4.1 Flash (96%), Gemini 3.8 Flash (55%), Sol (54%) and Opus 5.5 (59%), level with MiMo-V2.6-Pro (41%), but above GLM-5.3-Flash (28%), Grok 4.7 (29%) and Gemini 4 Argon (15%). It declines more and knows less (SimpleQA Verified 23.8%) [B, S1, S9].

### F15. Benchmark facts and gaming resistance

Rating: HIGH = private or rolling-fresh tasks and independent runner; MED = public tasks but independent runner and anti-contamination steps; LOW = public and saturated or vendor-run.

| Benchmark | Runner | Cadence | Isolates | Gaming / contamination resistance | Numbers taken | Source |
|---|---|---|---|---|---|---|
| AA Intelligence Index v4.3.2 (10 evals) | Artificial Analysis, runs every model itself; cost and tokens measured | version bumps every 1-3 months; models within days | broad economic-task capability: knowledge work, agentic, science, long context | MED-HIGH (private AA-Briefcase, mixed public / private sets); Haiku 5.5 provisional (AutomationBench understated) | 2026-10-13 | S1 |
| AA Coding Agent Index v1.5 | AA; harness + model, pass@1 over 3 attempts, equal weights | per release; 30 → 39 rows | end-to-end coding agent quality, cost, wall time | MED (three third-party public suites; TB4.0 has anti-crawl marker) | 2026-10-13 | S4 |
| AA FrontierCode 1.1 | Cognition suite (private 100 tasks), AA-run in Stirrup | launched 2026-10-12 | whether a maintainer would merge the change | HIGH (private tasks, LLM-judge + tests; vendor-built suite) | 2026-10-12 | S16 |
| tbench.ai Terminal-Bench 4.0 | Harbor / Laude Institute; vendor and maintainer submissions, 330 trials, CI shown | on submission | terminal and shell agent work, per harness | MED (public tasks, GUID marker; some self-run) | 2026-10-13 | S5 |
| Vals Terminal-Bench 4.0 (mini-swe-agent) | Vals AI, one harness for all models, 198 attempts | within days of release | terminal work under a fixed scaffold | MED (public tasks; fixed harness gives comparability); counts fallback attempts separately | 2026-10-12 | S8 |
| Vals Index v2.1 and Vibe Code Bench v1.1 | Vals AI; private benchmarks ("no other party has full access") | per release | finance, coding, legal, tax agent work; app building from scratch | MED-HIGH; Vibe Code Bench near-saturated at the top | 2026-10-12 | S8 |
| LMArena (Text, WebDev, Vision, Agent) | Arena; crowd blind votes, Bradley-Terry with CI; Agent uses session signals | continuous, dated | human preference, front-end web dev, vision, tool orchestration | HIGH vs contamination, MED vs style tuning; new models have wide CIs (Haiku 5.5 +-20 on 978 votes) | 2026-10-08..12 | S6 |
| Scale SWE-Bench Pro V2 | Scale; 642 public copyleft-repo tasks, locked protocol | V2 released 2026-09-22; rows added weekly | repo-level SWE fixes | MED; Full saturated (99), HARD usable but new rows have CI +-13 | 2026-10-13 | S7 |
| Epoch-run evals (FrontierMath, SimpleQA Verified, OTIS, Furniture Assembly, ...) | Epoch AI | within 1-2 days of release | hard math, factual recall, spatial planning | HIGH for private sets (FrontierMath); GPQA Diamond and OTIS saturated | 2026-10-07..09 | S9 |
| ECI | Epoch AI; composite of ~40 benchmarks | continuous | one latent capability score | HIGH (aggregate, robust to single-benchmark gaming) | 2026-10-13 | S9 |
| FrontierSWE / DeepSWE / APEX-Agents / CursorBench | frontierswe.com / Datacurve / Mercor / Cursor (vendor), mirrored by Epoch | model additions | long SWE / repo SWE / professional services / IDE tasks | MED-HIGH / MED / MED / LOW-MED (first-party) | bundle 2026-10-13 | S9 |
| LiveBench | White et al. / Abacus | six-monthly refresh; table gets new models | general tasks, separate agentic-coding category | HIGH (rolling), MED-LOW for coding depth | 2026-10-13 | S10 |
| ARC-AGI-2 / ARC-AGI-3 | ARC Prize Foundation | per release | fluid abstraction; interactive novel environments | ARC-2 nearly saturated (95); ARC-3 HIGH and unsaturated | 2026-10-13 | S11 |
| OSWorld 2.0 | XLANG authors plus vendor and aggregator self-reports | official JSON 2026-10-05 | long-horizon GUI computer use, partial and binary credit | MED (executable validators; release / grader drift) | 2026-10-05 | S12 |
| METR time horizons | METR | frozen: "no longer actively updated" | task length at 50% / 80% success | HIGH but stale and unreliable above 16 h | 2026-09-08 | S13 |
| SWE-rebench | Nebius; fresh monthly tasks | window frozen at 2026-07-01 | SWE repair on unseen tasks | HIGH by design, stale | 2026-07-01 | S14 |
| AA-LCR v1.1 | AA; 100 questions, documents 10-100K tokens | with II | long-context reasoning up to 100K | MED; near-saturated range (72-89) | 2026-10-13 | S1, S17 |
| Scale FORTRESS / MultiChallenge | Scale AI (also sells data to labs) | model additions | adversarial robustness; multi-turn instruction following | MED | 2026-10-13 | S7 |
| Vending-Bench 2 | Andon Labs | model additions | year-long business coherence | MED-HIGH (simulation) | 2026-10-13 | S15 |
| Bug Hunt Bench | phuryn (Product Compass), single author; blind judge model from another lab | per model; board 2026-10-08 | fixing planted real bugs in two production repos, in the vendor's own CLI | HIGH on contamination (withheld keys, planted bugs); noise 9 points on a fixed config; n 1-5 per row | 2026-10-08 | S20 |
| VulcanBench Frontier v4 | morganlinton, single author (also sells a team product) | per report; board 2026-10-12 | rewriting legacy binaries from specs; hidden tests plus 33% LLM-judged code quality | MED-HIGH (hidden tests, withheld keys; one third model-judged; harness and judge-protocol versions differ by column) | 2026-10-12 | S21 |

### F16. Community-run, open-data benchmarks that include Haiku 5.5 (single-author labs; corroboration, not ground truth)

First flagged by a peer lane (board notes #17 and #23) and verified here against the primary pages. Grade [B, community-run]: independent of the model vendors and with published methods and data, but one author each, small n and an LLM-judged component.
Read them as corroboration of the AA / Vals / Scale picture, not as separate proof.

**Bug Hunt Bench** (phuryn, Product Compass; board updated 2026-10-08; 105 planted bugs in two production codebases (45 + 60), answer keys withheld; one round per repo in the vendor's own CLI; each diff graded blind by a judge model from another lab; 174 rows from 210 scored runs, 43 models;
costs are token estimates at list rates unless tagged bill or floor) [S20]. Fixed bugs out of 105 (cost per row in dollars; n = runs averaged). The author measured a 9-point range across runs of one fixed configuration and a median 1.8-point move between a first run and a 3-run mean, so differences under about 5 points are noise.

| Model (harness) | max | xhigh | high | medium | low |
|---|---|---|---|---|---|
| **Haiku 5.5 (Claude Code)** | 21.5 ($5.83; n=2) | 18.3 ($4.80; n=3) | 16 ($3.56; n=2) | 12 ($2.66; n=1) | 11 ($1.61; n=1) |
| Sonnet 5.5 (Claude Code) | 51.3 ($154.03; n=3) | 36 ($42.86; n=3) | 34.3 ($19.85; n=3) | 23.3 ($11.11; n=3) | 19 ($5.73; n=3) |
| Opus 5.5 (Claude Code) | 41.7 ($58.53; n=3) | 36 ($34.98; n=3) | 31.7 ($22.25; n=3) | 30.3 ($15.68; n=3) | 22.3 ($8.34; n=3) |
| Fable 5.1 (Claude Code) | 43 ($87.18; n=1) | 29 ($53.61; n=1) | 33 ($48.58; n=1) | 21 ($23.73; n=1) | 29 ($33.00; n=1) |
| GPT-6.1 Sol (Codex) | 44.3 ($5.88; n=3) | 42.7 ($4.35; n=3) | 36.5 ($3.26; n=2) | 29 ($1.76; n=2) | 22.5 ($1.34; n=2) |
| GPT-6 Astra (Codex) | 45 ($33.03; n=3) | 43 ($24.22; n=1) | 35 ($20.60; n=1) | 34 ($15.78; n=1) | 27 ($11.69; n=1) |
| GPT-6 Luna (Codex) | 18.3 ($0.52; n=3) | 14 ($0.39; n=1) | 9 ($0.13; n=1) | 4 ($0.06; n=1) | 4 ($0.20; n=1) |

Other cheap rows: MiMo-V2.6-Flash (Claude Code via OpenRouter, default effort) 23.3 ($0.49 billed; n=3) · MiMo-V2.6-Pro 22.7 ($0.86 billed; n=3) · DeepSeek V4.1 Flash max 21.7 ($0.78 billed; n=3), high 19 ($0.31 billed) · GLM-5.3 Flash max 17.7 ($1.03; n=3) ·
Gemini 3.8 Flash (Antigravity CLI) high 18 ($11.03; n=3) · Grok 4.7 (Grok Build) xhigh 29 · Haiku 4.5 default 1.5 ($2.22; n=2). Haiku 5.5 max ranks 52nd of the 109 displayed rows. Reading: Haiku 5.5's curve is monotonic (11 → 12 → 16 → 18.3 → 21.5) and its max is level with Opus 5.5 low (22.3) and Sonnet 5.5 medium (23.3)
at 52-70% of their cost, but GPT-6.1 Sol low (22.5 at $1.34), MiMo-V2.6-Flash (23.3 at $0.49) and DeepSeek V4.1 Flash max (21.7 at $0.78) match it for a fraction of that.

**VulcanBench Frontier v4** (morganlinton; board updated 2026-10-12; 23 behavioural-reconstruction tasks: rewrite a legacy binary from a specification, hidden tests; one attempt per task per effort level, 3-hour bound; combined score = 50% functional correctness + 8.5% lint and complexity + 8.5% security + 33% code quality judged by
Muse Spark 1.3 and Grok 4.6; harness versions differ between columns; the author also sells a team product; 13 models, 63 model-effort columns, 1,435 runs) [S21]. Cells: combined score +-1 SE / tasks passed of 23 / $ per task / minutes per task (Claude Code's per-request list-price total, or API-equivalent list price for Codex; none is a bill).

| Model (harness) | Low | Medium | High | Extra-high | Max |
|---|---|---|---|---|---|
| **Haiku 5.5 (Claude Code)** | 84.42 +-1.97 / 13 / $1.04 / 23 | 84.03 +-2.50 / 13 / $1.36 / 24 | 88.01 +-1.42 / 17 / $1.25 / 27 | 91.83 +-0.39 / 22 / $0.84 / 19 | 92.16 +-0.37 / 22 / $1.54 / 28 |
| Sonnet 5.5 (Claude Code) | 81.63 +-1.38 / 15 / $2.88 / 20 | 84.10 +-1.20 / 17 / $3.00 / 21 | 86.79 +-1.15 / 20 / $2.39 / 15 | 90.20 +-0.57 / 22 / $3.38 / 22 | 92.02 +-0.35 / 23 / $5.52 / 38 |
| Opus 5.5 (Claude Code) | 86.36 +-1.30 / 17 / $1.70 / 14 | 90.86 +-0.64 / 23 / $2.84 / 19 | 91.11 +-0.57 / 22 of 22 / $3.27 / 21 | 90.68 +-1.10 / 22 / $4.11 / 21 | 90.22 +-1.02 / 21 / $8.75 / 38 |
| GPT-6.1 Sol (Codex) | 86.22 +-0.82 / 20 / $0.31 / 7 | 86.44 +-0.78 / 22 / $0.40 / 11 | 88.23 +-0.40 / 23 / $0.33 / 10 | 88.78 +-0.40 / 23 / $0.43 / 15 | 88.35 +-0.33 / 23 / $0.46 / 15 |
| GPT-6 Luna (Codex) | 40.83 +-2.04 / 0 / $0.03 / 6 | 45.72 +-1.32 / 0 / $0.01 / 4 | 57.35 +-3.80 / 2 / $0.05 / 16 | 78.79 +-3.02 / 11 / $0.16 / 53 (2 timeouts) | 81.42 +-2.88 / 12 / $0.10 / 61 (4 timeouts; 67.26 counting them as 0) |

- Haiku 5.5 max is #4 of 63 columns (behind only Grok 4.7's three top levels, judged by a different panel), extra-high #7, high #25, low #37, medium #40; Sonnet 5.5 max is #5. Its combined-score lead over Sonnet 5.5 at Low-High comes from the LLM-judged code-quality share (74.8-77.6 vs 61.7-70.8) while it passes fewer tasks (13/13/17 vs 15/17/20);
  its functional-correctness factor is 88.7 / 87.0 / 94.1 / 100 / 100 from Low to Max [B, community-run, S21].
- Safety-classifier stops: on one task ("paddockcore") at Medium, Extra-high and Max the classifier ended the session with an empty patch while Haiku 5.5 probed a legacy binary (3 of 115 runs; counted as failures); Claude Code's refusal fallback was on and never used. Opus 5.5 had one such stop (High). Quote: "Anthropic's default effort for Haiku 5.5 is Medium, on the API and in Claude Code." [S21; V, S2].
- Cost: Claude Code's per-request total for the 115 Haiku runs is $138.31 against a floor of $31.10 and a ceiling of $155.50: "Claude Code's total sits well toward the ceiling at every level: most of Haiku 5.5's requests carry long prompts." [S21].
- Cross-suite reading (derived): Haiku 5.5 matches Sonnet 5.5 and Opus 5.5 at xhigh-max on moderate-difficulty suites (Vibe Code Bench 90.4 vs 92.4 / 90.3; VulcanBench 91.8-92.2 vs 90.2-92.0 / 90.2-91.1) at roughly 10-50% of their cost, but trails on the hardest ones (Coding Agent Index DeepSWE 46-49 vs 66-72 and TB4.0 24-30 vs 42-66; SWE-Bench Pro HARD 52.9 vs Sonnet 5.5 70.6; Bug Hunt Bench 21.5 vs Sonnet 5.5 51.3).
  A lower ceiling reached cheaply fits all of them: use it where the task is within reach and checking the result is cheap.

**Agents on Rails** (Rails Foundation site, "Maximum effort" report 2026-09-21, flagged by peer lane research-5; predates Haiku 5.5, Opus 5.5, Sonnet 5.5 and GPT-6.1 Sol, so it contains none of them) [S22]. Stage 2: 20 feature tickets on the Fizzy app, 3 attempts per ticket (60 runs per cell), hidden checks, caps of 90 minutes, 400 steps and $60 per run;
the effort level is pinned in the model name. Success and sweep cost, default (or noted) effort → max: GPT-6 Astra medium 35% ($150, 9 min) → max 53% ($398, 24 min) · Claude Fable 5.1 high 32% ($548, 23 min) → max 32% ($1,146, 45 min) · Claude Opus 5 high 25% ($591) → max 32% ($902) · GPT-5.6 Sol medium 18% ($45) → max 28% ($221) ·
GPT-5.6 Luna medium 0% ($1.69) → max 27% ($29, 19 min) · Gemini 3.8 Flash medium 28% ($175) → high 23% ($191) · Muse Spark 1.3 medium 10% ($158) → max 20% ($782) · Grok 4.6 high 15% → xhigh 17% · DeepSeek V4.1 Flash high 12% ($23) → max 17% ($33) after the harness was fixed (a first max sweep scored 37% by using the exposed API key to fetch the source; discarded).
Selection-relevant readings: Fable 5.1 high → max buys nothing at twice the cost, which matches the catalog's "Fable 5.1 xhigh = max"; Astra gains 18 points from medium to max on agent feature work, so AA II's "Astra knee medium" does not carry over to agent tickets; max Luna is a real worker only at max effort (0% → 27%);
and the post's measurement of what "max" means: reasoning tokens per step rise "roughly 3 to 8x" for OpenAI models, "about 60%" for Claude Opus, 25% for Grok and 3% for Gemini, so effort levels are not comparable across providers.

## Gaps

- **Haiku 5.5 absent** (checked 2026-10-13) from tbench.ai, LMArena Text / Vision / Agent, OSWorld official and both aggregators, ARC Prize, METR, SWE-rebench, ECI and the Epoch mirrors of agentic boards, Scale MCP-Atlas / HLE / RLI. Re-check in 1-2 weeks: tbench.ai, LMArena Text and Vision, ARC Prize, ECI are the likeliest to add it first.
- **Vending-Bench 2**: only the top 10 rows are server-rendered ("Show 59 more" is client-side); the chart palette names Haiku 5.5, so a row probably exists but I could not read it. The Epoch mirror has no Haiku 5.5 row.
- **Computer use**: no independent number for Haiku 5.5, Opus 5.5, Sonnet 5.5 or any GPT-6.x; the only Haiku 5.5 figure is vendor-reported (72.4%, offline subset, partial credit). A secondary write-up's 37.1% strict-pass figure is unverified.
- **Vision**: AA MMMU-Pro not run for Haiku 5.5 or Sonnet 5.5; LMArena Vision has no Haiku 5.5; Scale VISTA stale; ScreenSpot-Pro official board has no 5.5 / GPT-6 rows; a Roboflow head-to-head page returned HTTP 429 and was not read.
- **Long context beyond 100K**: no independent data for any current model. AA-LCR stops at 100K, which is exactly Haiku 5.5's price step. Fiction.LiveBench page timed out in headless Chrome and the Epoch mirror has no 5.x / 6.x rows; MRCR v2 only via aggregators.
- **Provisional AA numbers for Haiku 5.5**: AutomationBench-AA understated per AA (rerun pending, II would rise), cost excludes the >100K tier per AA. AA's Coding Agent Index tier handling is inferred (F5), not documented.
- **AA "time per task"** unit is ambiguous (chart label minutes, values imply seconds); used only as a ratio. AA FrontierCode per-model cost and pass rate sit behind a data manifest I did not read; only Haiku 5.5's 41.8% score and the article text were used.
- **tau2-bench, BrowseComp, OpenAI GDPval (non-AA)**: no independent current leaderboard for the 5.5 generation; GDPval-AA used instead.
- **LMArena** "code" URL hung in headless Chrome (WebDev used); no Copilot arena found; Haiku 5.5 has only 978 WebDev votes. Scale HARD split CI is +-13 for new rows. Vals ran Haiku 5.5 at effort max only, so its per-effort behaviour there is unknown.
- **Scope**: Gemini 4 Argon and Muse Wonder rows are board data only; their specs, prices and harness availability belong to the vendor and CLI lanes. Grok 4.7, Kimi K3, GLM-5.3 and Qwen3.8 Max rows were re-read only where they appear in the tables above.
- **Agents on Rails (S22)** predates every model in the 5.5 / GPT-6.1 generation (it has GPT-5.6 Luna, not GPT-6 Luna) and contains no Haiku 5.5; it is used only for effort behaviour of older rows.
- **Community benchmarks (S20, S21)** are single-author: Bug Hunt Bench rows for Haiku 5.5 are 1-3 runs against a measured 9-point range on a fixed config; VulcanBench's combined score is one third model-judged, and its columns were judged under different protocol revisions (Haiku v3.24, Sonnet v3.23, Sol v3.18, Luna v3.16) and different Claude Code / Codex versions; MiMo, DeepSeek and Gemini 3.8 Flash are on Bug Hunt Bench but not on VulcanBench. VulcanBench's GitHub `docs/results` had no Haiku 5.5 folder when a peer checked; the website reports are the source.
- Vals SWE-bench Verified is archived; Scale SWE-Bench Pro "commercial" split page does not exist at the URL pattern tried (404).

## Sources

Mark [R] = worth re-checking whenever a new model ships (re-run this lane). Raw captures are under `.orchestrate/raw/` with prefix `r3-`; screenshots under `.orchestrate/raw/shots/` with prefix `r3-`.

- [S1] Artificial Analysis - LLM leaderboard and per-model pages - https://artificialanalysis.ai/leaderboards/models and /models/<slug> (65 pages) - accessed 2026-10-13 12:25-12:50 local - Intelligence Index v4.3.2 table (server-rendered), per-eval values, token counts, pricing and capability indexes from the pages' embedded JSON (`r3-aa-models2.tsv`, `r3-aa-merged.json`, `r3-aa-matrix.tsv`); screenshots `r3-aa-models.png`, `r3-aa-haiku-5-5.png`. High reliability (independent, AA runs every model). [R]
- [S2] Anthropic - "Introducing Claude Haiku 5.5" and model docs - https://www.anthropic.com/claude-haiku-5-5 and https://platform.claude.com/docs/en/models/haiku-5-5/overview - accessed 2026-10-13 - [V] launch benchmark table, price tiers, default effort, context and output limits, Sonnet 5.5 cache-read price cut. Vendor-chosen benchmarks. [R]
- [S3] Artificial Analysis - "Anthropic has released Claude Haiku 5.5" (2026-10-07) - https://artificialanalysis.ai/articles/claude-haiku-5-5 - accessed 2026-10-13 - AA's own analysis: verbosity, tier-pricing caveat, AutomationBench understatement, Terminal-Bench and Omniscience comparisons. [R]
- [S4] Artificial Analysis - Coding Agent Index v1.5 - https://artificialanalysis.ai/agents/coding-agents - accessed 2026-10-13 - 39 rows with cost, wall time, steps, tokens, per-benchmark scores from the page payload (`r3-aa-agents-table.tsv`); screenshot `r3-aa-agents.png`. [R]
- [S5] Terminal-Bench - https://www.tbench.ai/leaderboard - accessed 2026-10-13 - 35 rows from the embedded leaderboard JSON (`r3-tbench-table.tsv`); screenshot `r3-tbench.png`. [R]
- [S6] Arena (LMArena) leaderboards - https://lmarena.ai/leaderboard/text, /webdev, /vision, /agent - accessed 2026-10-13 (page dates 10-08, 10-08, 10-09, 10-12) - rendered DOM via headless Chrome with a normal user agent (curl gets a Cloudflare 403 and the default headless agent a Cloudflare challenge page); `r3-lmarena-*.tsv`; screenshot `r3-lmarena-webdev.png` (cookie modal dims it and it shows only the top 11 WebDev rows, so Haiku 5.5's rank-30 row is from the DOM capture, not the screenshot). [R]
- [S7] Scale Labs leaderboards - https://labs.scale.com/leaderboard/swe_bench_pro_public_v2, /fortress, /multichallenge, /mcp_atlas, /hle-diamond, /rli, /visual_language_understanding - accessed 2026-10-13 - rows from server-rendered page data (`r3-misc/scale-*.html`, `r3-scale/`); screenshot `r3-scale-swepro-v2.png`. Scale sells data to labs (conflict note). [R]
- [S8] Vals AI - https://www.vals.ai/models/anthropic_claude-haiku-5-5, /benchmarks/vals_index, /terminal-bench-4, /vibe-code, /swebench - accessed 2026-10-13 - Haiku 5.5 results across 23 benchmarks, Vals Index v2.1, TB4.0 and Vibe Code Bench boards, run settings; screenshot `r3-vals-index.png`. [R]
- [S9] Epoch AI - Capabilities and benchmarking data bundle (CC-BY) - https://epoch.ai/data/benchmark_data.zip - accessed 2026-10-13 (files stamped 2026-10-13 10:19) - Epoch-run FrontierMath, GPQA Diamond, SimpleQA Verified, OTIS, EBR, Furniture Assembly, Mystery Game Puzzles; ECI; mirrors of FrontierSWE, DeepSWE, FrontierCode, CursorBench, APEX-Agents, Vending-Bench, OSWorld, METR. [R]
- [S10] LiveBench - https://livebench.ai/ - accessed 2026-10-13 - table via headless Chrome DOM (`r3-livebench.tsv`); release label 2026-06-25. [R]
- [S11] ARC Prize leaderboard - https://arcprize.org/leaderboard - accessed 2026-10-13 - table via headless Chrome DOM (`r3-arc.tsv`). [R]
- [S12] OSWorld 2.0 official results JSON - https://osworld-v2.xlang.ai/static/data/leaderboard/official-results.json (`updatedAt` 2026-10-05); aggregators https://yutori.com/leaderboards/osworld-2.md and https://leaderboard.steel.dev/leaderboards/osworld-2.md - accessed 2026-10-13. [R]
- [S13] METR - https://metr.org/time-horizons/ - accessed 2026-10-13 - "This page is no longer actively updated", last updated September 8, 2026; newest model in the data Claude Mythos Preview (early). [R]
- [S14] SWE-rebench (Nebius) - https://swe-rebench.com/ - accessed 2026-10-13 - window 2026-05-15..07-01, unchanged. [R]
- [S15] Andon Labs - Vending-Bench 2 - https://andonlabs.com/evals/vending-bench-2 - accessed 2026-10-13 - top 10: Astra $15,514.70, GPT-6 Sol $14,427.85, Gemini 4 Argon $13,718.16 (new), Opus 5 $11,181.87, Sonnet 5.5 $11,165.28 (new), Opus 4.7, Grok 4.7, GPT-5.6 Sol, Opus 5.5 $9,235.25, Grok 4.6; remaining rows client-side. [R]
- [S16] Artificial Analysis - "Announcing FrontierCode on Artificial Analysis" (2026-10-12) and evaluation page - https://artificialanalysis.ai/articles/frontiercode and https://artificialanalysis.ai/evaluations/frontiercode - accessed 2026-10-13. [R]
- [S17] Artificial Analysis - AA-LCR v1.1 evaluation page - https://artificialanalysis.ai/evaluations/artificial-analysis-long-context-reasoning - accessed 2026-10-13 - benchmark definition (10K-100K token documents) and leaders.
- [S18] WebSearch results (apidog, benchlm, roboflow, lmmarket-cap, computingforgeeks and similar aggregators) - accessed 2026-10-13 - used only to locate Vals and the vendor table; their own numbers were not carried into tables (low reliability, internally inconsistent).
- [S19] ScreenSpot-Pro official leaderboard https://gui-agent.github.io/grounding-leaderboard/ , Context Arena https://contextarena.ai/ , Fiction.LiveBench via Epoch `fictionlivebench_external.csv` - accessed 2026-10-13 - checked for Haiku 5.5 / Opus 5.5 rows: none.
- [S20] Bug Hunt Bench (phuryn, Product Compass) - https://github.com/phuryn/bug-hunt-bench (README leaderboard, 174 rows, updated 2026-10-08) and https://bughunt.productcompass.pm - accessed 2026-10-13 - 105 planted bugs, per-effort rows for Haiku 5.5 and incumbents; `r3-community/bug-hunt-bench-README.md`. Community-run, single author; first flagged by peer lane research-4. [R]
- [S21] VulcanBench Frontier v4 (morganlinton) - https://vulcanbench.com/leaderboard.html , /benchmarks/swe-v4-haiku55-vs-frontier.html , /benchmarks/swe-v4-haiku55-v324.html - accessed 2026-10-13 (reports dated 2026-10-12) - 23-task suite, five-effort sweeps, cost floor and ceiling for Haiku 5.5; `r3-community/vulcan-*.html`. Community-run, single author, sells a team product; first flagged by peer lane research-4. [R]
- [S22] Agents on Rails (Rails Foundation site) - https://rubyonrails.org/2026/9/21/agents-on-rails-maximum-effort-and-deepseek-4-1-flash - accessed 2026-10-13 - per-effort success and cost on 20 Fizzy feature tickets for Astra, Fable 5.1, Opus 5, GPT-5.6 Sol/Luna, Gemini 3.8 Flash, Muse Spark 1.3, Grok 4.6, DeepSeek V4.1 Flash; `r3-community/rails-agents.html`. Independent of the vendors; flagged by research-5. [R]
