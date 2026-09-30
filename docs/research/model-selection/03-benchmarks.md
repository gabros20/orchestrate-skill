# 03 - Independent benchmarks (research lane 3)

Run date 2026-09-30. All numbers seen 2026-09-30 unless a different date is given. Grade [B] = independent
benchmark; rows that are really vendor-run or vendor-reported are tagged [V] even when an aggregator carries
them. Screenshots are under `.orchestrate/raw/shots/` (paths cited inline). Epoch AI's benchmark hub CSV
bundle [S5] was used as a structured mirror of many external leaderboards; every Epoch-mirrored row keeps its
original runner in the "Who runs it" column.

## Summary

- Two things dominate: the frontier moved in the last 8 days. Claude Opus 5.5 (2026-09-22) and Sonnet 5.5
  (2026-09-28) are new; GPT-6 Sol / Luna shipped 2026-09-22 and **GPT-6.1 Sol replaced GPT-6 Sol on 2026-09-29**
  ("GPT-6.1 Sol replaces GPT-6 Sol after just 7 days" - AA article list [S2]). Treat `gpt-6-sol` as superseded
  by `gpt-6.1-sol`. Many leaderboards (Terminal-Bench 4.0, SWE-rebench, METR, VISTA, Fiction.LiveBench) do NOT yet
  include the newest models: check the "coverage" column before trusting an absence. [B]
- Overall intelligence (AA Intelligence Index v4.3): Opus 5.5 max 58 > Opus 5.5 xhigh 56 = Sonnet 5.5 max 56 >
  Opus 5.5 high 54 > Fable 5.1 / GPT-6 Astra max 53 > GPT-6.1 Sol max 52 = Sonnet 5.5 xhigh 52. [B, S1]
  Cost per index task varies 10x for the same score band: GPT-6.1 Sol max 52 at $0.72 vs Fable 5.1 max 53 at
  $7.63 vs Sonnet 5.5 max 56 at $7.60. Opus 5.5 high (54, $1.82) is the strongest cost/score point among Anthropic
  configs. [B, S1]
- Coding agents (AA Coding Agent Index v1.5, harness + model, pass@1 over 3 benchmarks): Claude Code + Sonnet 5.5
  max 68 ($14.2/task) > Claude Code + Opus 5.5 max 66 ($13.0) > **Codex + GPT-6.1 Sol xhigh 63 ($1.04)** >
  Claude Code + Fable 5.1 / Codex + GPT-6 Astra max 62. Codex + GPT-6.1 Sol is ~12x cheaper per task than the top
  Claude Code configs for a 3-5 point deficit: the clear Pareto pick for high-volume coding workers. [B, S3]
- Terminal work (tbench.ai Terminal-Bench 4.0, harness-native): GPT-6 Astra max/Codex 58.2 +-2.8 ~ Fable 5.1
  max/Claude Code 57.9 +-3.8 (statistical tie), Opus 5 xhigh 53.9; Astra costs ~half ($3.3k vs $6.2k per run).
  AA's own TB4.0 run gives Astra 59 / Fable 5.1 52 [S2 article, WebFetch summary]. Opus 5.5 / Sonnet 5.5 / GPT-6.x Sol
  are not on the board yet. [B, S4]
- Harness matters as much as the model: on TB2.0 the same Opus 4.6 scored 58.0 in Claude Code vs 76.4
  (Meta-Harness), 75.3 (Capy), 74.7 (Terminus-KIRA); Gemini 3.1 Pro 61.4 in Gemini CLI vs 80.2 (TongAgents).
  A harness swap moves scores 15-20 points; do not compare models across harness rows. [B, S4 screenshot
  `tbench.png`]
- Long-horizon autonomy: METR's page is stale (last update 2026-05-08; TH1.1): Mythos Preview (early) 50% =
  17.4 h (CI 8.5-55 h) and above METR's own 16 h reliability ceiling. METR's GPT-5.6 Sol note (2026-06-26): 11.3 h
  (CI 5-40 h) but "We do not consider any of these numbers to represent a robust measurement". No METR data for
  Opus 5.x / Fable / GPT-6. Proxy for long-horizon: Vending-Bench 2 (GPT-6 Astra $15.5k > GPT-6 Sol $14.4k >
  Opus 5 $11.2k > Opus 5.5 $9.2k; Fable 5.1 only $5.4k) and FrontierSWE (11 h average runs). [B, S6, S7, S12]
- Computer use (OSWorld 2.0, 108 long tasks): official runs put Opus 5 max at 77.7 partial / 44.3 binary;
  Fable 5.1 77.9 and GPT-6 Astra 72.6 are vendor-reported on different releases/graders. No official Opus 5.5 or
  Sonnet 5.5 number. Anthropic models lead; OpenAI's GPT-6 Astra is close on partial score. [B+V, S9, S10]
- Vision: independent evidence is thin and stale. LMArena Vision (2026-09-28): Fable 5 high 1310 +-7 top, Qwen3.8-Max
  1301, then Opus 4.6/4.7 at ~1299 (top-10 spread all within CI). Scale VISTA has not been updated past GPT-5.4. No
  current ScreenSpot-Pro / MMMU-Pro from an independent runner found. [B, S13]
- Best coding cheap-workers by evidence: GPT-6.1 Sol (low/medium/high), DeepSeek V4.1 Flash max (AA 39 at $0.27,
  209 tok/s; LiveBench agentic coding 77.3, top of board, $0.029/task), MiMo-V2.6-Pro (AA 46 at $0.13),
  Gemini 3.8 Flash (DeepSWE pass@1 73.8 at $2.36; AA 242 tok/s), GPT-6 Luna (AA 37 at $0.07 but TB4.0 only 17.3
  for GPT-5.6 Luna). Claude Haiku 4.5 is weak: SWE-Bench Pro V2 HARD 25.5, MCP-Atlas 40.2 - not a competitive
  cheap worker. [B, S1, S3, S5, S8, S11]

## Findings

### F1. Matrix: model x benchmark (score, benchmark date, source id)

Legend: cfg = reasoning setting / harness. "-" = not on that leaderboard (checked); "?" = benchmark exists but
value unread. AA II = Artificial Analysis Intelligence Index v4.3.2; AA CAI = AA Coding Agent Index v1.5 (harness in
brackets); TB4 = tbench.ai Terminal-Bench 4.0; SWE-P V2H = Scale SWE-Bench Pro V2 HARD (update 2026-09-22).
[B] for all rows unless tagged.

| Model | AA II (best cfg) | AA CAI | TB4 (tbench.ai) | SWE-P V2 HARD / Full | FrontierSWE | DeepSWE p@1 | OSWorld 2.0 partial (binary) | Vending-B2 $ | ARC-AGI-2 | HLE |
|---|---|---|---|---|---|---|---|---|---|---|
| Claude Opus 5.5 | 58 max [S1] | 66 (Claude Code, max) [S3] | - | - | 62.3 [S5] | - | - | 9,235 +-785 [S7] | 91.7 max / 92.5 xhigh [S14] | 55.0 (Scale Diamond) [S8] |
| Claude Sonnet 5.5 | 56 max [S1] | 68 (Claude Code, max) [S3] | - | - | 61.9 [S5] | - | - | - | - | - |
| Claude Fable 5.1 | 53 max [S1] | 62 (Claude Code, max, fallback) [S3] | 57.9 +-3.8 (max, CC) [S4] | 92.2 / 99.1 (CC high) [S8] | 56.3 [S5] | - (Fable 5: 69.7) [S5] | 77.9 (41.7) [V, S10] | 5,422 [S7] | 90.0 [S14] | 46.5 (Epoch) / 51.3 (Scale) [S5,S8] |
| Claude Opus 5 | (not in "current" AA table) | 60 (from AA Astra article, v earlier) [S2] | 53.9 +-3.2 (xhigh, CC) [S4] | 98.0 / 99.4 (CC xhigh) [S8] | 52.0 [S5] | 73.6 (max) [S5] | 77.7 (44.3) official, v2.1 full [S9] | 11,182 +-2,094 [S7] | 90.4 [S14] | - |
| Claude Sonnet 5 | - | - | 12.4 +-3.1 (max, CC) [S4] | 88.2 / 93.15 (CC xhigh) [S8] | - | - | - | 6,378 [S5] | - | - |
| Claude Haiku 4.5 | - | - | - | 25.5 (CC xhigh) [S8] | - | - | - | - | - | - |
| GPT-6 Astra | 53 max [S1] | 62 (Codex, max) [S3] | 58.2 +-2.8 (max, Codex) [S4] | 90.2 / 96.9 (Codex high) [S8] | 65.5 [S5] | 74.1 (xhigh) [S5] | 72.6 [V, S10] | 15,515 +-1,074 [S7] | 95.0 max [S14] | 54.8 (Epoch) / 60.6 (Scale) [S5,S8] |
| GPT-6.1 Sol | 52 max [S1] | 63 (Codex, xhigh) [S3] | - | - | - | - | - | - | - | - |
| GPT-6 Sol (superseded 09-29) | 48 max [S1] | - | - | - | - | - | - | 14,428 +-1,051 [S7] | 89.6 max [S14] | - |
| GPT-6 Luna | 37 max [S1] | 41 (Codex, max) [S3] | 17.3 (GPT-5.6 Luna, Codex) [S4] | - | - | - | - | - | 59.3 max [S14] | - |
| GPT-5.6 Sol | 47 max [S2] | 55 [S2] | 37.3 (max, Codex) [S4] | 82.4 / 95.5 (Codex xhigh) [S8] | 32.2 (GPT-5.6) [S5] | 72.7 (max) [S5] | 62.6-62.7 [V+B, S9,S10] | 9,619 [S7] | 92.5 max [S5] | - |
| Grok 4.7 | 46 xhigh [S1] | 56 (Grok Build, xhigh) [S3] | 37.6 +-3.5 (xhigh, Grok Build) [S4] | - | 29.5 [S5] | - | - | 10,537 +-652 [S7] | - | - |
| Gemini 3.8 Flash | 41 high [S1] | 42 (Antigravity SDK, high) [S3] | 19.1 +-3.4 (high, mini-SWE) [S4] | 58.8 / 94.86 (mini-swe high) [S8] | 19.6 [S5] | 73.8 (high) [S5] | 59.0 (batched tool) [V, S10] | 5,094 [S5] | 89.2 high [S14] | 44.5 [S5] |
| Muse Spark 1.3 | 48 max [S1] | 54 (Muse Code, max) [S3] | - | - | - | - | 66.9 (32.0) [V, S10] | - | - | - |
| Kimi K3 | 44 max [S1] | 52 (Kimi Code CLI) [S3] | - | 88.2 / 97.7 (mini-swe max) [S8] | 25.9 [S5] | 68.5 (max) [S5] | 58.3 [V, S10] | 5,165 [S5] | - | - |
| GLM-5.3 | 45 max [S1] | 54 (Opencode) [S3] | 41.8 +-3.2 (max, Claude Code) [S4] | 84.3 / 95.6 (mini-swe max) [S8] | 30.2 [S5] | 69.0 (max) [S5] | - | 8,164 [S7] | - | - |
| DeepSeek V4.1 Flash / V4 Pro 0813 | 39 / 36 (max) [S1] | 43 (Codex, V4 Pro) [S3] | - | - | - | - | - | - | 61.4 (V4 Pro max) [S14] | - |
| Qwen3.8 Max (0902) | 45 [S1] | 43 (Claude Code) [S3] | - | - | 15.8 [S5] | - | - | - | - | - |
| MiMo-V2.6-Pro | 46 [S1] | - | - | - | - | - | - | - | - | - |

Second matrix (other independent boards; same legend):

| Model | LiveBench 2026-06-25 release (overall / coding / agentic coding / cost per successful task) [S15] | LMArena Text 09-26 [S13] | LMArena WebDev 09-29 [S13] | Agent Arena 09-28 net improvement [S13] | MCP-Atlas (Scale) [S8] | CursorBench [V, S5] | FrontierCode (Cognition) [V, S5] | LMCA [S5] | APEX-Agents (Mercor) [S5] | SWE-rebench 05-15..07-01 [S16] |
|---|---|---|---|---|---|---|---|---|---|---|
| Claude Opus 5.5 | 83.2 / 89.3 / 71.7 / $0.799 | 1509 +-12 (high, 2,307 votes) | 1820 (max, 1,887 votes) | 11.84% (high) | - | 57.8 max ($13.43) | - | 68.2 | 73.5 | - |
| Claude Sonnet 5.5 | 77.8 / 88.9 / 39.3 / $0.141 | - | 1699 (high, 1,205 votes) | - | - | 55.5 max ($9.67); 47.8 high ($1.67) | 52.1 | - | 75.5 | - |
| Claude Fable 5.1 | 83.4 / 86.4 / 66.1 / $1.212 | 1501 +-7 (max) | 1753 (max) | 14.06% (max, #1) | 87.2 | 51.8 max ($17.28) | 50.9 | 65.5 | 68.6 | - |
| Claude Opus 5 | 80.1 / 81.4 / 65.2 / $0.699 | - | 1694 (max) | 9.54% (max) | 85.8 | 46.6 max | 53.4 | 63.3 | 65.8 | 63.4 (high, $3.47) |
| GPT-6 Astra | 82.2 / 80.4 / 57.3 / $0.736 | - | 1792 (max, 5,754 votes) | 10.36% (max) | - | - | 53.3 | 64.4 | 64.7 | - |
| GPT-6.1 Sol | 81.6 / 80.4 / 54.5 / $0.142 | - | - | - | - | - | - | - | - | - |
| GPT-6 Sol | 79.3 / 81.8 / 52.9 / $0.268 | - | 1692 (max) | 8.80% (max) | - | - | - | - | - | - |
| GPT-5.6 Sol | 81.0 / 83.9 / 56.2 / $0.515 | - | - | 6.26% (xhigh) | 81.8 | - | 47.5 | - | - | 62.3 (medium, $0.85) |
| Grok 4.7 | 77.4 / 77.2 / 54.0 / $0.718 | - | - | 4.02% (xhigh) | - | 46.3 xhigh ($6.01) | - | - | - | (Grok 4.5 high 63.8, $1.47) |
| Gemini 3.8 Flash | 75.8 / 72.5 / 54.2 / $0.307 | 1492 +-5 (high, prelim) | - | 3.75% (high) | (3.5 Flash: 83.6) | - | 41.2 | - | 64.3 | - |
| Muse Spark 1.3 | 81.6 / 81.1 / 64.1 / $0.219 | 1494 +-7 (max) | (not read; rows 9-11 hidden by cookie modal) | 3.83% (max) | 88.1 (Spark 1.1) | - | - | - | 57.8 | - |
| Kimi K3 | 79.2 / 81.4 / 62.2 / $0.348 | - | (top-20) | - | 82.3 | - | 44.2 | - | - | - |
| GLM-5.3 | 76.1 / 79.0 / 60.9 / $0.450 | - | - | 2.78% (max) | 84.2 | - | - | - | 56.6 | (GLM-5.2 high 62.9, $1.40) |
| DeepSeek V4.1 Flash | 81.1 / 80.0 / 77.3 / $0.029 | - | - | 3.86% (max) | - | - | - | - | - | - |
| Qwen3.8 Max | 78.5 / 72.9 / 64.6 / $0.275 | - | 1671 (prelim) | 2.46% | 84.5 (2.4T A95B) | - | - | - | - | - |

Coverage caveats for the second matrix: LiveBench's header says release 2026-06-25 but its table already lists
Fable 5.1, Opus 5.5 and GPT-6.1 Sol (screenshot `livebench.png`); SWE-rebench's window (05-15 to 07-01) predates all
September models, so Fable 5, Opus 5, GPT-5.6 Sol, GLM-5.2 and Grok 4.5 are the only current-gen models on it.

### F2. Per-benchmark facts: what it is, who runs it, cadence, gaming resistance

Gaming-resistance rating: HIGH = private or rolling-fresh tasks, independent runner, unpublished grader or crowd
votes; MED = public tasks but independent runner and anti-contamination steps; LOW = public tasks/saturated or
vendor-run/reported.

| Benchmark | Who runs it | Refresh cadence | What it isolates | Contamination / gaming resistance | Numbers taken (date) | Source |
|---|---|---|---|---|---|---|
| Artificial Analysis Intelligence Index v4.3.2 (10 evals: AA-Briefcase v1.1, GDPval-AA v2.1, AutomationBench-AA, Terminal-Bench 4.0, SciCode, Humanity's Last Exam, GDP.pdf, CritPt, AA-Omniscience, AA-LCR v1.1) | Artificial Analysis (independent, runs every model itself) | Index version bumped every 1-3 months (v4.3 announced 2026-09-07); models added within days of release | Broad economic-task capability, knowledge-work + agentic + science + long-context | MED-HIGH: AA runs all evals itself, mixes public and private sets; index v4.3 was rebuilt in Sept. Cost and token counts are measured, not claimed | 2026-09-30 | [S1] `aa-models-c*.png`, `aa-home.png` |
| AA Coding Agent Index v1.5 (DeepSWE v1.1 113 tasks [Datacurve], Terminal-Bench 4.0 66 tasks [Laude Institute], SWE-Atlas-QnA 124 tasks [Scale AI]) | Artificial Analysis, agent (harness + model) combos, pass@1 averaged over 3 attempts | Updated with model releases; v1.5 current | Coding agent end-to-end quality + cost + wall time, per harness | MED-HIGH: three third-party task suites, AA-run, equal weight; only 15 of 30 rows visible in screenshot | 2026-09-30 | [S3] `aa-agents-coding.png`, `aa-agents-coding-c0.png`, `aa-agents-cost-c.png` |
| Terminal-Bench 4.0 (tbench.ai; Stanford / Harbor / Laude Institute) | Harbor framework, submissions by labs + runs by maintainers; 95% CI shown | New major version roughly yearly (2.0 -> 4.0 by Sept 2026); leaderboard updated on submission | Terminal / shell agent tasks; reports per-run tokens and cost | MED: task content is public but carries a GUID anti-crawl marker; agent-vendor submissions are partly self-run; 2.0 saturated (84.7%) | 2026-09-30 | [S4] `tbench-home.png` (4.0), `tbench.png` (2.0, stale rows to Nov-2025..May-2026) |
| LMArena (Arena) Text / Code(WebDev) / Vision / Agent | Arena (LMArena) crowd blind votes, style control on; Bradley-Terry Elo with CI | Continuous, dated per page (Text 2026-09-26, WebDev 2026-09-29, Vision 2026-09-28, Agent 2026-09-28) | Human preference (Text/Vision); front-end web dev preference (WebDev); tool orchestration (Agent) | MED-HIGH against contamination (fresh human prompts) but prone to style/vendor tuning; new models have wide CI (Opus 5.5 Text +-12 on 2,307 votes, rank spread 1-10) | as listed | [S13] `lmarena-text-c.png`, `lmarena-code.png`, `lmarena-vision2.png`, `lmarena-agent.png` |
| SWE-Bench Pro V2 (Scale Labs; co-developed with Reflection) | Scale AI; public split 642 tasks / 11 repos, locked protocol, agent phase reaches only the model endpoint | V2 released 2026-09-22 | Long-horizon repo-level SWE fixes | MED (was designed GPL-copyleft for contamination resistance) but **saturated in "Full" (99.4)**, HARD is the usable split (98.0 top). Scale notes two open residual attack surfaces (code inside patch executed by verifier) and that it caught Opus 5 forging a go.sum. The legacy V1 page (2026-Q1 data) is stale | 2026-09-30 | [S8] `scale-swepro-v2-hard.png`, `scale-swepro-v2-full-c.png`, `swebench-pro.png` |
| SWE-rebench (Nebius) | Nebius team; fresh GitHub tasks per month, time-window selection, marks potential contamination | Monthly-ish; current window 2026-05-15..2026-07-01 (111 problems, 65 repos); last note 2026-07-01 | SWE-task repair on tasks the model could not have trained on; also reports agents (Junie, Claude Code, Codex) | HIGH by design (fresh tasks + contamination flags), but 111 problems -> +-1.0-1.8 CI and stale for September models | 2026-09-30 | [S16] `swerebench.png`, `swerebench-c.png` |
| SWE-bench Verified | many | - | - | LOW: saturated/contaminated; footnote only. Scale states V-Pro top was "around 23%" vs "70%+" on Verified when V1 launched | - | [S8] legacy page |
| METR time horizon (TH1.1 suite) | METR (independent non-profit) | Ad hoc; page last updated 2026-05-08; model-specific posts (GPT-5.6 Sol 2026-06-26) | Task length (human-expert time) at which the agent succeeds 50% / 80% | HIGH on secrecy of grading, but METR states measurement above 16 h "unreliable" (task suite saturated) and flagged cheating in GPT-5.6 Sol's runs | 2026-09-30 | [S6] `metr.png`, page HTML |
| OSWorld 2.0 (XLANG; 108 long tasks, median ~1.6 h human time, avg ~318 tool calls) | Benchmark authors (official leaderboard), Snorkel AI + Simular (co-authors) independent runs, vendor self-reports | Official JSON `updatedAt` 2026-09-17; OSWorld 2.0 announced 2026-06-26 | Long-horizon GUI computer use, partial-credit checkpoints (avg 27.25 per task) + binary | MED: executable validators, but grader/release drift (06.24, 08.08, v2.1 release versions; Anthropic says its Fable 5.1 run "modified tasks and grading") | 2026-09-17 / 09-30 | [S9], [S10] |
| DeepSWE v1.1 | Datacurve (public site), harness mini-swe-agent, 4 runs/model | Model additions Jun-Sept | SWE tasks with cost per model | MED (independent runner, fixed harness -> comparable across models) | 2026-09-30 | [S5] `deepswe_external.csv` |
| FrontierSWE (frontierswe.com; 34 tasks, mean@5, proximus harness, avg 11.6 h/run) | FrontierSWE site (independent) | Model additions to Sept 28 | Very long autonomous SWE (implementation/performance/research) | MED-HIGH: costs $138 avg per Fable 5.1 run; few labs can game it | 2026-09-30 | [S5] `frontierswe_external.csv` |
| FrontierCode | Cognition (vendor; harness claude-code, Mean@5) | Sept | Coding tasks | LOW-MED: vendor of a competing agent (Devin); rows use Claude Code harness | 2026-09-30 | [S5] |
| CursorBench | Cursor (vendor) | Model additions | IDE-style agent tasks; cost per task published | LOW-MED: first-party, private tasks; still the only source with Sonnet 5.5 / Opus 5.5 cost-per-task curves | 2026-09-30 | [S5] `cursorbench_external.csv`, cursor.com/cursorbench |
| APEX-Agents | Mercor | Model additions | Professional-services tasks (banking, law, consulting) | MED | 2026-09-30 | [S5] |
| Vending-Bench 2 (Andon Labs) | Andon Labs (independent) | Model additions, dated | Year-long coherent business operation (long-horizon coherence) | MED-HIGH (simulation, unpublished trajectories; variance +-$0.7-2.1k) | 2026-09-30 | [S7] `vendingbench.png` |
| MirrorCode, Furniture Assembly, FrontierMath v2 Tier 4 | Epoch AI (independent) | Model additions | Long code re-implementation, physical/spatial planning, hard math | HIGH (Epoch private) but few models each | 2026-09-30 | [S5] |
| ARC-AGI-2 / ARC-AGI-3 (ARC Prize) | ARC Prize Foundation (verified runs, cost per task) | Model additions; latest row 2026-09-22 | Fluid abstraction (ARC-2); interactive novel-environment adaptation (ARC-3) | ARC-2 nearly saturated (95.0 top); ARC-3 is contamination-resistant and unsaturated: GPT-6 Astra 62.7% standard / 98.6% "Provider Adapter" harness, Opus 5 (High) ~30% (chart marker, unlabeled numerically) | 2026-09-30 | [S14] `arc-leaderboard.png`, `arc-c.png` |
| LiveBench | White et al. / Abacus (independent) | Six-monthly question refresh; latest release label 2026-06-25 | General LLM tasks; separate agentic-coding category; cost per successful task | HIGH for contamination (rolling), MED-LOW for coding depth | 2026-09-30 | [S15] `livebench.png` |
| Scale MCP-Atlas / HLE Diamond / HiL-Bench / SWE-Atlas | Scale AI (independent lab; sells data to labs - note COI) | Model additions | Tool use through MCP; frontier knowledge; asking clarifying questions; refactor/test-writing/QnA | MED (500 public + 500 held-out MCP tasks; HLE Diamond private) | 2026-09-30 | [S8] `scale-mcp-atlas-c.png`; page text |
| Epoch Capabilities Index (ECI) | Epoch AI (independent aggregate of ~40 benchmarks) | Continuous | Single latent capability score | HIGH (aggregate, robust to single-benchmark gaming) but lacks Opus 5.5, Sonnet 5.5, GPT-6.x Sol/Luna | 2026-09-30 | [S5] `eci_scores.csv`: Astra 166.6 (CI 163.0-172.0) > Fable 5.1 165.0 > Fable 5 163.6 > Opus 5 162.7 > GPT-5.5 Pro 162.5 > GPT-5.6 Sol 162.0; open weights leader Kimi K3 157.7 |

### F3. Detailed leaderboard extracts (tables)

**AA Intelligence Index v4.3 - cost, speed, latency, context (2026-09-30, screenshot `aa-models-c0..c3.png`).** Cost per Task =
"Weighted average cost per Intelligence Index task" (USD); speed = median output tokens/s; latency = first chunk (s);
context = AA's listed window. `(with fallback)` = Claude configuration that falls back to another Claude model on
classifier-blocked tasks. All [B, S1].

| Model (setting) | Index | $ per task | tok/s | TTFT s | E2E s | Context |
|---|---|---|---|---|---|---|
| Opus 5.5 (max, fallback) | 58 | 5.98 | 92 | 694.0 | 699.4 | 1M |
| Opus 5.5 (xhigh) | 56 | 3.46 | 80 | 129.8 | 136.0 | 1M |
| Sonnet 5.5 (max) | 56 | 7.60 | 139 | 407.2 | 410.8 | 1M |
| Opus 5.5 (high) | 54 | 1.82 | 74 | 33.2 | 40.0 | 1M |
| Fable 5.1 (max) | 53 | 7.63 | 69 | 276.4 | 283.6 | 1M |
| Fable 5.1 (xhigh) | 53 | 5.98 | 61 | 108.0 | 116.2 | 1M |
| GPT-6 Astra (max) | 53 | 3.26 | 55 | 291.0 | 300.1 | 1M |
| GPT-6 Astra (xhigh) | 52 | 2.31 | 49 | 126.3 | 136.4 | 1M |
| Sonnet 5.5 (xhigh) | 52 | 2.74 | 103 | 33.5 | 38.4 | 1M |
| GPT-6.1 Sol (max) | 52 | 0.72 | 69 | 205.9 | 213.1 | 1M |
| Opus 5.5 (medium) | 51 | 1.34 | 73 | 24.2 | 31.0 | 1M |
| Fable 5.1 (high) | 51 | 3.91 | 51 | 29.0 | 38.8 | 1M |
| GPT-6.1 Sol (xhigh) | 51 | 0.39 | 64 | 69.2 | 77.0 | 1M |
| GPT-6 Astra (high) | 51 | 1.73 | 47 | 49.8 | 60.5 | 1M |
| GPT-6.1 Sol (high) | 50 | 0.32 | 65 | 58.0 | 65.7 | 1M |
| GPT-6 Astra (medium) | 50 | 1.54 | 45 | 5.9 | 16.9 | 1M |
| Fable 5.1 (medium) | 49 | 2.98 | 50 | 8.4 | 18.3 | 1M |
| Muse Spark 1.3 (max) | 48 | 1.60 | 181 | 33.7 | 47.5 | 1M |
| GPT-6.1 Sol (medium) | 48 | 0.21 | 59 | 5.7 | 14.1 | 1M |
| GPT-6 Sol (max) | 48 | 1.05 | 76 | 185.7 | 192.2 | 872k |
| Fable 5.1 (low) | 47 | 2.37 | 48 | 4.6 | 15.0 | 1M |
| Sonnet 5.5 (high) | 47 | 1.08 | 92 | 14.5 | 19.9 | 1M |
| Grok 4.7 (xhigh) | 46 | 3.74 | 77 | 79.8 | 86.3 | 500k |
| Grok 4.7 (high) | 46 | 2.73 | 76 | 30.7 | 37.3 | 500k |
| MiMo-V2.6-Pro | 46 | 0.13 | 41 | 4.2 | 65.1 | 1M |
| GPT-6 Astra (low) | 46 | 0.82 | 46 | 3.0 | 14.0 | 1M |
| Qwen3.8 Max (0902) | 45 | 5.41 | 39 | 3.0 | 67.2 | 984k |
| GLM-5.3 (max) | 45 | 2.01 | 71 | 3.1 | 38.5 | 1M |
| Kimi K3 (max) | 44 | 2.00 | 36 | 4.0 | 72.9 | 1.05M |
| Gemini 3.8 Flash (high) | 41 | 1.24 | 242 | 20.8 | 22.8 | 1M |
| Sonnet 5.5 (medium) | 41 | 0.59 | 90 | 1.3 | 6.9 | 1M |
| Opus 5.5 (low) | 42 | 0.55 | 72 | 14.3 | 21.2 | 1M |
| DeepSeek V4.1 Flash (max) | 39 | 0.27 | 209 | 0.9 | 12.9 | 1M |
| GPT-6 Luna (max) | 37 | 0.07 | 145 | 115.0 | 118.4 | 1M |
| GPT-6 Luna (xhigh) | 34 | 0.04 | 131 | 20.1 | 23.9 | 1M |
| DeepSeek V4 Pro 0813 (max) | 36 | 0.67 | 81 | 1.7 | 32.5 | 1M |
| GPT-6 Luna (high) | 32 | 0.03 | 124 | 15.2 | 19.2 | 1M |

Note: latency at "max"/"xhigh" is dominated by thinking time (Opus 5.5 max: 11.5 minutes before the first chunk).
AA no longer headlines separate "Coding Index" / "Agentic Index" bars on its model page (v4.3 folded Terminal-Bench 4.0,
SciCode etc. into one index; the coding signal now lives in the Coding Agent Index below). Capability Indices v1.1
(2026-09-14) add Finance & Accounting (Opus 5.5 61, Sonnet 5.5 57, Fable 5.1 56, GPT-6 Astra 55 - screenshot
`aa-home-long-9.png`), Strategy & Ops, Legal, Healthcare, Engineering, Economics. [B, S1]

**AA Coding Agent Index v1.5 (2026-09-30, screenshots `aa-agents-coding-c0.png`, `aa-agents-cost-c.png`).** [B, S3]

| Harness + model | Index | Cost per task | Points per $ (derived) |
|---|---|---|---|
| Claude Code + Sonnet 5.5 (max) | 68 | $14.2 | 4.8 |
| Claude Code + Opus 5.5 (max) | 66 | $13.0 | 5.1 |
| Codex + GPT-6.1 Sol (xhigh) | 63 | $1.04 | 60.6 |
| Claude Code + Fable 5.1 (max, with fallback) | 62 | $12.4 | 5.0 |
| Devin Fusion + Fable 5.1 xhigh + SWE-2 medium | 62 | unread | - |
| Codex + GPT-6 Astra (max) | 62 | $7.47 | 8.3 |
| Devin Fusion + GPT-6 Astra xhigh + SWE-2 medium | 59 | unread | - |
| Grok Build + Grok 4.7 (xhigh) | 56 | $8.82 | 6.3 |
| Muse Code + Muse Spark 1.3 (max) | 54 | $3.98 | 13.6 |
| Opencode + GLM-5.3 | 54 | unread | - |
| Kimi Code CLI + Kimi K3 | 52 | unread | - |
| Claude Code + Qwen3.8 Max (max) | 43 | unread | - |
| Codex + DeepSeek V4 Pro 0813 (max) | 43 | unread | - |
| Antigravity SDK + Gemini 3.8 Flash (high) | 42 | $2.47 | 17.0 |
| Codex + GPT-6 Luna (max) | 41 | unread | - |

The AA 2026-09-09 Astra article gave Astra Coding cost $7.09; the v1.5 chart shows $7.47 (index revision, [S2]). Token
usage is large: Sonnet 5.5 max 27.7M tokens per task, DeepSeek V4 Pro 24.2M (chart `aa-agents-coding.png`).

**Terminal-Bench 4.0, tbench.ai (2026-09-30, `tbench-home.png`).** Resolution rate +-95% CI; tokens and cost are total for the run. [B, S4]

| Rank | Model (setting) | Agent | Score | Date | Tokens | Cost |
|---|---|---|---|---|---|---|
| 1 | GPT-6 Astra (max) | Codex | 58.2% +-2.8 | 2026-09-03 | 1.5B | $3.3k |
| 2 | Fable 5.1 (max) | Claude Code | 57.9% +-3.8 | 2026-09-01 | 2.7B | $6.2k |
| 3 | Opus 5 (xhigh) | Claude Code | 53.9% +-3.2 | 2026-07-24 | 6.9B | $6.1k |
| 4 | Fable 5 (max) | Claude Code | 44.5% +-3.8 | 2026-06-09 | 3.8B | $7.3k |
| 5 | GLM-5.3 (max) | Claude Code | 41.8% +-3.2 | 2026-08-14 | 8.7B | $2.7k |
| 6 | Grok 4.7 (xhigh) | Grok Build | 37.6% +-3.5 | 2026-09-21 | 5.5B | $3.7k |
| 7 | GPT-5.6 Sol (max) | Codex | 37.3% +-3.8 | 2026-06-26 | 4.4B | $2.5k |
| 8 | Opus 4.8 (max) | Claude Code | 23.6% +-3.6 | 2026-05-28 | 6.4B | $6.5k |
| 9 | GPT-5.6 Terra (max) | Codex | 21.5% +-3.3 | 2026-06-26 | 5.7B | $1.7k |
| 10 | Grok 4.6 (high) | Grok Build | 20.3% | 2026-08-12 | 4.0B | $3.6k |
| 11 | Gemini 3.8 Flash (high) | mini-SWE-agent | 19.1% +-3.4 | 2026-09-02 | 17.2B | $1.8k |
| 12 | GPT-5.6 Luna (max) | Codex | 17.3% +-2.8 | 2026-06-26 | 11.6B | $0.3k |
| 13 | Grok 4.5 (high) / Sonnet 5 (max, CC) | - | 12.4% each | 07-16 / 06-30 | - | $2.1k / $9.6k |
| 15 | Gemini 3.7 Flash (high) | mini-SWE-agent | 11.2% | 2026-08-13 | 11.1B | $1.3k |

TB4.0 is much harder than 2.0 (top 58 vs 85). AA reports a different TB4.0 run (Astra 59, Fable 5.1 52, GPT-5.6 Sol 40;
[S2] WebFetch summary, low-precision extraction) - differences are harness/run-to-run. Terminal-Bench 2.0 leaderboard
(page still live, `tbench.png`): top GPT-5.5 + NexAU-AHE 84.7%, GPT-5.5 + Codex CLI 82.2%, Opus 4.7 + WOZCODE
80.2%, Opus 4.6 + Claude Code 58.0%. Use only for harness-variance evidence.

**LMArena, 2026-09-26..29 (Arena, `lmarena-*.png`).** Elo, +-CI, votes. Rank 1 does not mean statistically alone. [B, S13]

| Board | Top entries |
|---|---|
| Text (2026-09-26, 8.53M votes, 409 models) | claude-opus-5.5-high 1509 +-12 (2,307 votes; rank spread 1-10); claude-opus-4-6-high 1505 +-3; claude-fable-5-high 1504 +-4; opus-4-7-high 1502 +-4; **fable-5.1-max 1501 +-7 (9,942)**; muse-spark-1.2 xhigh 1496 +-10; muse-spark-1.3-max 1494 +-7; gemini-3.8-flash-high 1492 +-5 (prelim); price shown $4/$2x for Opus 5.5 |
| WebDev / Code Arena (2026-09-29, 824k votes, 135 models) | opus-5.5-max 1820 (+17/-17; 1,887 votes); gpt-6-astra-max 1792 (+11/-11; 5,754); fable-5.1-max 1753 (+10/-10); sonnet-5.5-high 1699 (+19/-19; 1,205); opus-5-max 1694 (+7/-7; 16,563); gpt-6-sol-max 1692 (+12/-12); qwen3.8-max 1671 prelim (+12/-12) |
| Vision (2026-09-28, 1.42M votes, 156 models) | fable-5-high 1310 +-7 (13,483); qwen3.8-max 1301 +-7; opus-4-6-high 1299 +-6; opus-4-7 1299 +-7; opus-4-7-high 1298 +-7; gemini-3.7-flash-high 1295 +-11 (prelim); opus-4-6 1295; muse-spark 1294; muse-spark-1.2 xhigh 1292; top 10 within ~20 pts, CIs overlap -> a tie |
| Agent Arena (2026-09-28, 2.05M sessions, 46 models; net improvement in tool-orchestration tasks) | Fable 5.1 max +14.06% +-1.77; Opus 5.5 high +11.84% +-1.95; GPT-6 Astra max +10.36% +-2.28; Opus 5 max +9.54%; Opus 5 high +9.38%; GPT-6 Sol max +8.80% +-2.30; Fable 5 high +7.99; Opus 4.8 high +6.87; GPT-5.6 Sol xhigh +6.26; Grok 4.7 xhigh +4.02; DeepSeek V4.1 Flash max +3.86; Gemini 3.8 Flash high +3.75; GLM 5.3 max +2.78 |

"Copilot" arena: no separate leaderboard found; the site exposes Agent / Chat / Code / Work categories (nav in
`lmarena-agent.png`). Cookie banners dimmed the page in screenshots but figures stayed legible.

**METR time horizon (TH1.1, page last updated 2026-05-08; extracted from embedded JSON in the page HTML).** [B, S6]

| Model | Release | 50% horizon | 50% CI | 80% horizon |
|---|---|---|---|---|
| Claude Mythos Preview (early) | 2026-04-07 | 1045 min (17.4 h) | 509-3304 min | 186 min |
| Claude Opus 4.6 | 2026-02-05 | 719 min (12.0 h) | 317-3634 min | 70 min |
| Gemini 3.1 Pro | 2026-02-19 | 384 min (6.4 h) | 234-695 min | 90 min |
| GPT-5.2 | 2025-12-11 | 352 min | 198-815 | 66 min |
| GPT-5.3 Codex | 2026-02-05 | 350 min | 195-816 | 55 min |
| GPT-5.4 | 2026-03-05 | 342 min | 187-769 | 54 min |
| Claude Opus 4.5 | 2025-11-24 | 293 min | 162-624 | 49 min |
| GPT-5.6 Sol (METR post 2026-06-26, TH1.1) | 2026-07-09 | 11.3 h | 5-40 h | not reported; METR: "We do not consider any of these numbers to represent a robust measurement" (cheating detected; counting cheats as success -> >270 h) |

METR's own text on the page: measurements above 16 h are unreliable. Nothing published for Opus 5.x, Fable 5.x, GPT-6.x.
Search results mentioning "Claude Mythos 50%-time horizon of likely at least 16 hours" match the page.

**OSWorld 2.0 (official JSON `updatedAt` 2026-09-17, task version v2026.06.24, 500-step default).** [B official; V rows flagged] (`os-world.github.io` screenshot `osworld.png` says OSWorld-Verified 1.0 is superseded: "2026-06-26: OSWorld 2.0 is now available".)

| System (setting) | Partial | Binary | Release / scope | Runner |
|---|---|---|---|---|
| Claude Opus 5 max, batch tool | 77.67 | 44.33 | v2.1 full | official [B, S9] |
| Claude Opus 5 xhigh / high / medium / low | 73.11 / 68.92 / 64.85 / 59.09 | 33.33 / 36.89 / 33.01 / 18.81 | v2.1 full | official [B, S9] |
| Claude Opus 5 max | 68.31 | 31.43 | v2026.08.08 full | official [B, S9] |
| GPT-5.6 Sol max | 62.72 (offline 64.13) | 27.34 | v2026.08.08 | official; est. cost $1,117 offline run [B, S9] |
| Claude Fable 5.1 (max) | 77.9 | 41.7 | 08.08, 500 steps | Anthropic self-report; "modified tasks and grading" [V, S10] |
| Simular Sai (agent) | 73.0 | 28.25 | | Simular self-report ($15.70/task) [V, S10] |
| GPT-6 Astra (max) | 72.6 | - | 08.08 offline subset | OpenAI self-report [V, S10] |
| Muse Spark 1.3 (max) | 66.9 | 32.0 | 08.08 | Meta self-report [V, S10] |
| Claude Opus 4.8 (batched) | 54.8 | 20.6 | | official [B, S10] |

The official JSON is dominated by Opus 5 rows because the authors ran Opus 5 across effort levels; OpenAI numbers are
either their own or single Snorkel runs. No Opus 5.5 / Sonnet 5.5 / GPT-6.1 Sol on OSWorld 2.0 yet. Accuracy rises
monotonically with effort but binary completion is non-monotonic (high 36.89 > xhigh 33.33), so budget effort by partial
score, not by binary.

**Independent Epoch-mirrored boards (2026-09-30 snapshot).** Runner in header. [S5]

| Benchmark (runner) | Ranking (score) |
|---|---|
| FrontierSWE (frontierswe.com; mean@5, 34 tasks) | GPT-6 Astra 65.5; Opus 5.5 62.3; Sonnet 5.5 61.9; Fable 5.1 56.3; Opus 5 52.0; Fable 5 47.0; GPT-5.6 32.2; GLM-5.3 30.2; Grok 4.7 29.5; Kimi K3 25.9; Gemini 3.8 Flash 19.6 |
| DeepSWE v1.1 (Datacurve, mini-swe-agent) | Astra xhigh 74.1 ($6.52); Gemini 3.8 Flash high 73.8 ($2.36); Opus 5 max 73.6 ($11.84); Astra max 73.2 ($12.37); Sol 5.6 max 72.7 ($8.39); Fable 5 xhigh 69.9 ($13.41); GLM-5.3 max 69.0 ($3.99); Kimi K3 max 68.5 ($4.65) |
| FrontierCode (Cognition [V], Claude Code harness) | Fable 5 53.5; Opus 5 53.4; Astra 53.3; Sonnet 5.5 52.1; Fable 5.1 50.9; SWE-2 50.0; Grok 4.6 48.0; GPT-5.6 Sol 47.5 |
| CursorBench (Cursor [V]) | Opus 5.5 max 57.8 ($13.43) / xhigh 56.0 ($6.98); Sonnet 5.5 max 55.5 ($9.67) / xhigh 53.1 ($3.88) / high 47.8 ($1.67); Fable 5.1 max 51.8 ($17.28); Grok 4.7 xhigh 46.3 ($6.01); Opus 5 max 46.6 ($11.95) |
| APEX-Agents (Mercor) | Sonnet 5.5 75.5; Opus 5.5 73.5; Fable 5.1 68.6; Gemini 3.7 Flash 67.8; Opus 5 65.8; Grok 4.6 65.3; Astra 64.7; Gemini 3.8 Flash 64.3 |
| LMCA (conceptualreasoning.ai; +-2.7-3.2) | Opus 5.5 68.2; Fable 5.1 65.5; Opus 5 xhigh 64.5; Astra xhigh 64.4 |
| MirrorCode (Epoch) | Opus 5.5 max 77.4 +-8.3; Fable 5.1 high 73.3; Fable 5 high 63.9; **Astra high 46.7 +-11.9**; GPT-5.6 Sol high 20.0 |
| Furniture Assembly (Epoch) | Opus 5.5 max 83.3; Astra max 80.0; Sonnet 5.5 max 75.0; Fable 5.1 70.0; Opus 5 60.8; GPT-6 Sol 58.3; GPT-6 Luna 44.2 |
| FrontierMath Tier 4 v2 (Epoch, private) | Astra 97.6 (all efforts >=medium 97.5+); Opus 5.5 max 95.0; Fable 5 90.2; Fable 5.1 87.8; GPT-5.6 Sol 82.9 (near saturation) |
| HLE | Scale Diamond: Astra 60.6 +-3.0; Opus 5.5 55.0 +-3.1; Fable 5.1 51.3 +-3.1 [S8]. Epoch mirror: Astra 54.8; Fable 5.1 (xhigh) 46.5; Gemini 3.8 Flash 44.5 [S5] (runner not recorded in the row) |
| WeirdML v3 | Astra xhigh 42.2; Opus 5.5 xhigh 31.2; Fable 5.1 26.0; Opus 5 19.0 |
| Remote Labor Index | Astra 20.8; Fable 5.1 17.9; Fable 5 16.1; Opus 4.8 8.3 |
| SciCode | Opus 5.5 max 66.9; Fable 5.1 63.1; Sonnet 5.5 61.0 |
| GDP.pdf | GPT-5.6 Sol 30.7; Opus 5.5 30.6; Fable 5 30.0; Fable 5.1 29.6 (spread within noise) |
| GDPval (OpenAI; Epoch mirror) | stale: last rows are 2025 models (GPT-5.2 49.7% win). No current numbers found. |
| PostTrainBench (Epoch) | scores hidden in CSV (scaffold column only): Cursor CLI (Grok 4.5 High), Codex CLI (GPT-5.6 Sol Max), Claude Code (Fable 5 Max, Opus 5, Opus 4.8, Kimi K3, GLM 5.2) - all evaluated through their native harness |
| ARC-AGI-2 [ARC Prize, S14] | Astra max 95.0% ($1.12/task); Astra xhigh 93.3% ($0.829); Opus 5.5 high 93.3% ($0.408); Opus 5.5 xhigh 92.5% ($0.671); GPT-6 Sol max 89.6% ($0.439); Opus 5.5 max 91.7% ($1.85); Fable 5.1 max 90.0% ($4.49); Gemini 3.8 Flash high 89.2% ($0.400); GPT-6 Luna max 59.3% ($0.062) |
| ARC-AGI-3 [ARC Prize, S14] | Astra max 62.7% Standard ($26.1K) / 98.6% Provider-Adapter ($17.3K); Astra high 54.8% / 99.9%; Sol max 4.6% / 23.0% ($8.7K); Gemini 3.8 Flash high 10.4% / 35.0%; Opus 5.5 / Fable 5.1: "N/A" (not run); Grok 4.6 xhigh 2.1% Standard; Luna max 0.1% / 0.6% |

**SWE-rebench (2026-05-15..2026-07-01 window; 111 problems from 65 repos; screenshot `swerebench-c.png`).** Rows flagged "potential contamination" pink = models released before the window closed. [B, S16]

| # | Model / agent | Resolved % | pass@5 | Cost per problem | Tokens per problem |
|---|---|---|---|---|---|
| 1 | Fable 5 [high] | 64.5 +-1.41 | 78.4 | $4.40 | 2.52M |
| 2 | Grok 4.5 [high] | 63.8 +-0.60 | 77.5 | $1.47 | 2.43M |
| 3 | Opus 5 [high] | 63.4 +-1.35 | 74.8 | $3.47 | 4.32M |
| 4 | GLM-5.2 [high] | 62.9 +-1.19 | 81.1 | $1.40 | 5.52M |
| 5 | GPT-5.6 Sol [medium] | 62.3 +-1.83 | 79.3 | $0.85 | 0.61M |
| 6 | Junie (agent) | 61.8 +-0.54 | 73.9 | $0.81 | 1.68M |
| 7 | Claude Code (agent) | 60.4 +-1.03 | 75.7 | $3.39 | 3.34M |
| 8 | Codex (agent) | 58.0 +-1.29 | 73.0 | $1.59 | 2.07M |
| 9 | Sonnet 5 [high] | 56.8 +-0.94 | 74.8 | $1.43 | 4.65M |

Top five overlap CIs (a five-way tie). Cost per problem is the differentiator: GPT-5.6 Sol medium and Grok 4.5 are
the value picks; Sonnet 5 at $1.43 is 8 points behind. Claude Code and Codex agent rows score below their underlying models
(60.4 vs Opus 5's 63.4; 58.0 vs GPT-5.6 Sol's 62.3) - harness overhead, or a different scaffold vs the standard one.

**SWE-Bench Pro V2 (Scale, update 2026-09-22; 642 tasks, harness noted in row).** HARD: Opus 5 Claude Code xhigh 98.00;
Fable 5.1 Claude Code high 92.20; GPT-6 Astra Codex high 90.20; Sonnet 5 Claude Code xhigh 88.20; Kimi-K3 mini-swe max
88.20; GPT-5.6 Terra Codex xhigh 86.30; GLM-5.3 mini-swe max 84.30; GPT-5.6 Sol Codex xhigh 82.40; Gemini 3.8 Flash
mini-swe high 58.80; Inkling xhigh 56.90; Haiku 4.5 Claude Code xhigh 25.50. FULL: Opus 5 99.40 +-0.40; Fable 5.1 99.10
+-0.50; Kimi-K3 97.70 +-0.90; Astra 96.90 +-1.10; GLM-5.3 95.60; GPT-5.6 Sol 95.50; Gemini 3.8 Flash 94.86; Sonnet 5 93.15;
GPT-5.6 Terra 92.37; Inkling 89.88. [B, S8] The 99% Full numbers indicate saturation on that split; use HARD only.
Not on it: Opus 5.5, Sonnet 5.5, GPT-6 Sol/Luna. Also from Scale: MCP-Atlas Muse Spark 1.1 88.10; Fable 5.1 87.20
+-2.05; Opus 5 xhigh 85.80; Qwen3.8 2.4T 84.50; GLM 5.3 84.20; Fable 5 83.30; Kimi K3 82.30 (~2 points is within CI).
SWE-Atlas: Refactoring Astra/Codex xHigh 59.05 +-6.43 vs Fable 5.1 56.67 (tie); Test Writing Fable 5.1 67.04 vs
Opus 5 62.22; Codebase QnA Opus 5 63.17, Fable 5.1 59.95, Astra 59.14 (all within CI). HiL-Bench (clarifying questions):
Fable 5.1 61.5, Opus 5 57.0, Fable 5 56.3. [B, S8 page text]

**Vending-Bench 2 (Andon Labs, current leaderboard 2026-09-30, `vendingbench.png`; average across runs, +-CI).** [B, S7] GPT-6 Astra $15,514.70 +-1,074;
GPT-6 Sol $14,427.85 +-1,051 (tagged New); Claude Opus 5 $11,181.87 +-2,094; Claude Opus 4.7 $10,936.76 +-1,181; Grok 4.7
$10,536.83 +-652 (New); GPT-5.6 Sol $9,619.37 +-1,338; Claude Opus 5.5 $9,235.25 +-785 (New); Grok 4.6 $9,047.03; GLM-5.2 $8,313.78;
GLM-5.3 $8,163.61. From Epoch mirror: Fable 5.1 $5,421.56; Sonnet 5 $6,377.70; Kimi K3 $5,165; Gemini 3.8 Flash $5,094. Trend line
+$822/month, R^2 0.95. Opus 5.5 does NOT extend the Anthropic lead here; GPT-6 family does.

**Epoch Capabilities Index (ECI, independent composite).** Astra 166.6; Fable 5.1 165.0; Fable 5 163.6; Opus 5 162.7; GPT-5.5 Pro 162.5;
GPT-5.6 Sol 162.0; GPT-5.6 Terra 159.3; Opus 4.8 158.3; Gemini 3.7 Flash 157.7; Kimi K3 157.7 (best open-weights, non-commercial licence);
Gemini 3.8 Flash 157.1; Muse Spark 1.3 156.9; Qwen 3.8 Max 156.7; Grok 4.6 156.5; DeepSeek V4 Pro 0813 155.4 (best unrestricted open weights).
Opus 5.5, Sonnet 5.5, GPT-6 Sol/Luna: not yet in ECI. [B, S5]

### F4. Per-capability rankings (evidence-weighted; each rank names the boards behind it)

All rankings say "as of 2026-09-30 evidence", top = strongest by independent data; ties are stated when CIs overlap.
Cost-efficiency figures are AA cost-per-task unless stated. Models not on a board cannot be ranked on it.

1. **Architecture / hard reasoning (single-shot or few-shot, no tools).** Evidence: AA II, ECI, ARC-AGI-2, HLE (Scale), FrontierMath T4, LiveBench reasoning, LMCA.
   - GPT-6 Astra: AA 53 max, ECI #1 166.6, ARC-2 95.0, HLE 60.6/54.8, FrontierMath T4 97.6, LiveBench reasoning 92.7 (best). [S1,S5,S8,S14,S15]
   - Claude Opus 5.5: AA 58 (#1), HLE 55.0, ARC-2 93.3 (high, $0.41), LMCA 68.2 (#1), SciCode 66.9, FrontierMath 95.0, LiveBench reasoning 92.2. Near-tie with Astra; wins on AA and LMCA, loses on ECI-like composites (Opus 5.5 missing from ECI). [S1,S5,S14,S15]
   - Fable 5.1: AA 53, ECI #2 165.0, LMCA 65.5; more expensive (AA $7.63) for no lead over Opus 5.5. [S1,S5]
   - Gemini 3.8 Flash (AA 41, ARC-2 89.2 at $0.40) is the cheap reasoner; GPT-6.1 Sol (AA 52 at $0.72) is the best cost-adjusted reasoner.
2. **Long-horizon agentic coding (hours of work, repo-level).** Evidence: FrontierSWE, SWE-Bench Pro V2 HARD, DeepSWE, SWE-rebench, CursorBench, MirrorCode, AA Coding Agent Index, METR (stale).
   - FrontierSWE: Astra 65.5 > Opus 5.5 62.3 > Sonnet 5.5 61.9 > Fable 5.1 56.3 (Sonnet 5.5 is within 0.4 of Opus 5.5, at far lower per-token price). [S5]
   - MirrorCode: Opus 5.5 77.4 > Fable 5.1 73.3 >> Astra 46.7 (Astra weak on this one; n very small, SE ~10). [S5]
   - SWE-Bench Pro V2 HARD: Opus 5 98.0 (Claude Code) > Fable 5.1 92.2 > Astra 90.2 (Codex). [S8]
   - DeepSWE: statistical tie among Astra, Gemini 3.8 Flash, Opus 5, GPT-5.6 Sol (73-74). [S5]
   - AA Coding Agent Index: Sonnet 5.5 68 ~ Opus 5.5 66 > GPT-6.1 Sol 63 > Astra/Fable 5.1 62. [S3]
   - Composite call: for long-horizon builds, **Claude Opus 5.5 / Sonnet 5.5 in Claude Code** and **GPT-6 Astra in Codex** form the top tier; Fable 5.1 is not ahead of Opus 5.5 on any independent coding board and costs more; Sonnet 5.5 is the value pick (near-Opus results, CursorBench max 55.5 vs 57.8, lower cost).
   - METR (stale): Mythos Preview 17.4 h > Opus 4.6 12 h; no current-gen data; Vending-Bench 2 (coherence over a simulated year) favours GPT-6 Astra / GPT-6 Sol over Anthropic (Opus 5.5 9.2k, Fable 5.1 5.4k).
3. **Terminal / shell work.** TB4.0: Astra/Codex 58.2 ~ Fable 5.1/Claude Code 57.9 > Opus 5/CC 53.9 >> everything else (GLM-5.3 41.8, Grok 4.7 37.6, GPT-5.6 Sol 37.3). Opus 5.5 / Sonnet 5.5 / GPT-6.1 Sol unmeasured. AA CAI with TB4.0 as a component: Sonnet 5.5 (CC) 68, Opus 5.5 (CC) 66, GPT-6.1 Sol (Codex) 63. Harness effect is 15-20 points (TB2.0). [S3,S4]
4. **Computer use (GUI).** OSWorld 2.0: Claude (Opus 5 official 77.7; Fable 5.1 77.9 vendor) > GPT-6 Astra 72.6 (vendor) > Muse Spark 1.3 66.9 > GPT-5.6 Sol 62.7 > Gemini 3.8 Flash 59.0 > Kimi K3 58.3 > Qwen 3.7 Plus ~21.5. Binary completion is only 32-44% even at the top: expect stalls on multi-hour flows. Opus 5.5 / Sonnet 5.5 unmeasured. [S9,S10]
5. **Vision (image understanding).** LMArena Vision: Fable 5 high 1310 top, Qwen3.8-Max 1301, Opus 4.6/4.7 ~1299 (ties). Scale VISTA (rubric image tasks): stale (top gpt-5.4-pro 53.89, Gemini 2.5 Pro 54.65). No current independent MMMU-Pro, ScreenSpot-Pro or multi-image results. Conclusion: use Fable 5 / Opus family for vision tasks; evidence for GPT-6 vision and Gemini 3.8 Flash is missing. [S13] (see Gaps)
6. **Long context.** AA-LCR is inside AA II but its per-model score was not extracted. Fiction.LiveBench: no current data (page is the April 2026 edition, Epoch mirror ends 2025). OpenAI-MRCR v2: no independent current leaderboard found; aggregators repeating vendor numbers only (e.g. Opus 4.6 76% at 1M, GPT-5.4 36.6% at 512k-1M; treat as [V/P]). Advertised context: 1M (Anthropic, GPT-6.x, Muse, MiMo, GLM-5.3, Gemini 3.8 Flash, DeepSeek), 872k (GPT-6 Sol), 984k (Qwen3.8 Max), 1.05M (Kimi K3), 500k (Grok 4.7), per AA. Effective context: unknown for all current models. [S1]
7. **Tool use / agent orchestration.** MCP-Atlas: Muse Spark 1.1 88.1 ~ Fable 5.1 87.2 ~ Opus 5 85.8 > Qwen3.8 2.4T 84.5 ~ GLM 5.3 84.2 (CI +-2). Agent Arena: Fable 5.1 (+14.1) > Opus 5.5 (+11.8) > Astra (+10.4). tau2-bench / BrowseComp: only vendor-reported figures available (Gaps). [S8,S13]
8. **Knowledge work / professional tasks.** APEX-Agents: Sonnet 5.5 75.5 ~ Opus 5.5 73.5 > Fable 5.1 68.6. AA Finance & Accounting index: Opus 5.5 61, Sonnet 5.5 57, Fable 5.1 56, Astra 55, GPT-6.1 Sol 54. GDP.pdf all ~30. GDPval: no current independent data. [S1,S5]
9. **Cost-efficiency (score per dollar; derived, use the Pareto, not the ratio).**
   - AA II: GPT-6 Luna (max) 37 @ $0.07; MiMo-V2.6-Pro 46 @ $0.13; GPT-6.1 Sol medium 48 @ $0.21, high 50 @ $0.32, xhigh 51 @ $0.39, max 52 @ $0.72; Opus 5.5 high 54 @ $1.82 / xhigh 56 @ $3.46; DeepSeek V4.1 Flash 39 @ $0.27. Frontier segment above 50 costs $0.39 (GPT-6.1 Sol xhigh) to $7.63 (Fable 5.1 max).
   - AA Coding Agent Index: Codex + GPT-6.1 Sol xhigh 63 @ $1.04 (60.6 pts/$) vs Claude Code + Sonnet 5.5 max 68 @ $14.2 (4.8 pts/$). 12x cost for +5 points.
   - LiveBench cost per successful task: DeepSeek V4.1 Flash $0.029 (81.1), GPT-6.1 Sol $0.142 (81.6), Sonnet 5.5 $0.141 (77.8), Opus 5.5 $0.799 (83.2).
   - SWE-rebench: GPT-5.6 Sol medium $0.85 (62.3), Junie agent $0.81 (61.8), Grok 4.5 $1.47 (63.8), GLM-5.2 $1.40 (62.9) vs Fable 5 $4.40 (64.5).
   - CursorBench: Sonnet 5.5 high $1.67 (47.8), xhigh $3.88 (53.1), max $9.67 (55.5); Opus 5.5 xhigh $6.98 (56.0) vs max $13.43 (57.8): the last effort step buys 1.8 points for ~2x cost.
   - TB4.0 total run cost: Astra $3.3k (58.2) vs Fable 5.1 $6.2k (57.9) vs GLM-5.3 $2.7k (41.8).
   - Fable 5.1 is dominated by Opus 5.5 on AA (53 at $7.63 vs 58 at $5.98) and on most coding boards; keep only where Fable-specific evidence exists (Agent Arena #1, vision arena, MirrorCode 73).

### F5. Notes and caveats

- Effort settings behave differently per model: AA max latency is 5-12 minutes to the first chunk on Anthropic models (Opus 5.5 max 694 s TTFT) - an orchestrator loop must not run "max" synchronously. Opus 5.5 high has TTFT 33 s. [S1]
- Anthropic "with fallback" configs route blocked requests to another Claude model (FrontierSWE footnote on Fable 5.1: "Claude Opus 5 used as fallback for tasks blocked by content filters") - scores are not pure single-model. [S5]
- OSWorld 2.0's official leaderboard shows Opus 5 ran the biggest matrix; missing OpenAI rows reflect submission gaps, not weakness. [S9]
- Sonnet 5.5 is a surprise: AA CAI #1 (68), FrontierSWE 61.9, APEX #1, LiveBench coding 88.9 - yet LiveBench "agentic coding" 39.3 (lowest of the frontier; a contradiction with AA CAI) and no OSWorld/TB4.0 numbers. Different harnesses may explain it; do not assume Sonnet 5.5 beats Opus 5.5 on all agentic work until TB4.0 / SWE-P V2 HARD are published.
- Discrepancy to keep visible: tbench.ai TB4.0 has Fable 5.1 57.9 vs AA's own run 52 (WebFetch summary of AA article; treat as approximate).
- WebFetch summaries of AA articles come from a small model and are lower fidelity than the direct screenshots; numbers marked [S2] with "WebFetch summary" should be re-checked.
- Aggregator sites returned by WebSearch (datalearner, benchlm, benchmarklist, anotherwrapper, morphllm) restate vendor numbers and are internally inconsistent (e.g. one says "Gemini 3 Pro 84.8% on SWE-bench Pro"); excluded from matrices.

## Gaps

- **AA "Coding Index" / "Agentic Index" per model**: not published as separate bars in v4.3; only the composite II and the Coding Agent Index (harness-level, 15 of 30 rows visible). Individual eval scores (Terminal-Bench 4.0, GDPval-AA, AA-LCR, SciCode etc.) per model are behind interactive charts; not extracted. AA "context" column is only the listed window, not a measured effective window.
- **Opus 5.5 / Sonnet 5.5 / GPT-6.1 Sol / GPT-6 Luna** on Terminal-Bench 4.0, SWE-Bench Pro V2, SWE-rebench, METR, OSWorld 2.0, ECI, ARC-AGI-3: not yet listed (models are 2-8 days old). Re-check in 1-2 weeks.
- **METR**: no post-May-2026 general update; no Opus 5.x, Fable, Sonnet 5.5 or GPT-6 numbers. GPT-5.6 Sol figure is flagged non-robust by METR itself.
- **Vision**: no independent current ScreenSpot-Pro, MMMU-Pro, multi-image benchmark found. LMArena Vision top-10 ranks 10+ were hidden behind the cookie modal; Opus 5.x / Astra / Gemini 3.8 Flash vision ranks unseen. Scale VISTA stale.
- **Long context**: Fiction.LiveBench has no 2026-Q3 data accessible (page is the 2026-04-04 edition; data table JS-rendered, screenshot showed only the intro); MRCR v2 only via aggregators repeating vendor claims; AA-LCR per-model values not extracted. "Effective vs advertised context" is unknown for every current model.
- **tau2-bench, BrowseComp, GDPval (current)**: only vendor-reported or aggregator numbers; no independent leaderboard found (GDPval mirror stops at 2025 models). Not used for ranking.
- **LMArena**: a Copilot/coding-completion arena was not found; Agent Arena covers similar ground. WebDev rows 9-11 hidden behind the cookie modal.
- **Grok 4.1 Fast / grok-code-fast, Cursor Composer, Antigravity Gemini variants beyond Flash, Hermes/Pi models**: not covered by these leaderboards beyond what appears in the tables (Cursor's own Composer models do not appear on CursorBench rows read).
- **AA Coding Agent Index time per task and 15 of the 30 rows** (only top 15 rendered); cost for several harnesses "unread" in the table above.
- **Terminal-Bench 4.0** shows only 15 rows; rank 4+ tasks may be added; 2.0 leaderboard data in this file is from Nov 2025 - May 2026 rows.
- **Scale HiL-Bench, SWE-Atlas** only from the landing-page text (top 3 each).
- Epoch CSV bundle: several rows carry no release date or source; PostTrainBench scores column unread; HLE runner not recorded.

## Sources

Mark [R] = worth re-checking whenever a new model ships (re-run this lane).

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
- [S11] (reserved: AA per-eval charts) - not used.
- [S12] Andon Labs / Epoch mirror combos for FrontierSWE (https://www.frontierswe.com/) - via [S5].
- [S13] Arena (LMArena) leaderboards - https://lmarena.ai/leaderboard/text, /code (WebDev), /vision, /agent - accessed 2026-09-30 (page dates 09-26, 09-29, 09-28, 09-28) - `lmarena-text-c.png`, `lmarena-code.png`, `lmarena-vision2.png`, `lmarena-agent.png`, `lmarena-overview.png`. Cookie modal dims screenshots; figures legible. [R]
- [S14] ARC Prize leaderboard - https://arcprize.org/leaderboard - accessed 2026-09-30 - ARC-AGI-1/2/3 with cost per task; `arc-leaderboard.png`, `arc-c.png`. [R]
- [S15] LiveBench - https://livebench.ai/ - accessed 2026-09-30 - `livebench.png` (header release 2026-06-25, table includes September models). [R]
- [S16] SWE-rebench (Nebius) - https://swe-rebench.com/ - accessed 2026-09-30 - window 2026-05-15..2026-07-01; `swerebench.png`, `swerebench-c.png`. [R]
- [S17] WebSearch results (aggregators: datalearner, benchlm, benchmarklist, anotherwrapper, morphllm) - accessed 2026-09-30 - used only to confirm GPT-6 Sol release date 2026-09-22 (vktr.com/gori.me report) and to identify that no independent MRCR/tau2/ScreenSpot-Pro data exist; numbers not carried into tables. Low reliability.
- [S18] Fiction.live Fiction.LiveBench - https://fiction.live/stories/Fiction-liveBench-Sept-2026/oQdzQvKHw8JyXbN87 (resolves to the "Fiction.liveBench April 04 2026" edition) - accessed 2026-09-30 - `fictionlive.png`: intro page only, no current table extracted.
