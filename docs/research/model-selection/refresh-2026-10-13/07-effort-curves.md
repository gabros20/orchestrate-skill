# 07 - Effort curves (research lane 7, refresh 2026-10-13)

Run date 2026-10-13 (reads 12:26-12:55 CEST). Trigger: `claude-haiku-5-5`, released 2026-10-07. Grades: [V] vendor, [B] independent benchmark, [P] practitioner, [L] local probe. Baseline: `skills/orchestrate/references/shared-model-catalog.md` (as of 2026-09-30) and the previous lane file `docs/research/model-selection/07-effort-curves.md`.

How numbers were read:
- **AA (Artificial Analysis) per-effort model pages**: every effort has its own URL (`/models/claude-haiku-5-5-high`; the unlabeled slug is the top effort). Values come from the unrounded JSON embedded in each page (Intelligence Index v4.3.2), so the index has decimals; the rounded page text agrees. [B S1]
- **Anthropic launch-post charts**: exact. Each plotted point carries an `aria-label` in the page's inline SVG, e.g. "Haiku 5.5 · Low: 42.0% $0.07". [V S3]
- **System-card figures** are raster images: values marked "(chart)" are read off the figure and are good to about +-1 point; values without the mark are in the card's text or carry printed labels. [V S5]
- **CAI** = AA Coding Agent Index (DeepSWE v1.1, Terminal-Bench 4.0 and SWE-Atlas-QnA at equal weight, one row per harness + model + effort). **CursorBench 4.0** = Cursor's own private tasks in its own harness. [B S6, V-first-party S7]

Formulas (used everywhere below):
- **Cost multiplier** cx(E) = C(E) / C(ref), C = AA "cost per Intelligence Index task" (weighted USD per task). **Token multiplier** tx(E) = T(E) / T(ref), T = AA "output tokens from Intelligence Index" (whole-index total, e.g. 97M for Haiku 5.5 high).
- **Cost decomposition (verified)**: C(E) = T_out(E) x p_out + C_in(E), where T_out is AA's weighted output tokens per task, p_out the output price and C_in = cache-read + cache-write + non-cache-input dollars. Check: Haiku 5.5 high, 55,388 output tokens per task x $0.50/MTok = $0.02769, which is 34.9% of $0.0794; the other 65.1% is input side. Output cost is 35-45% of AA cost per task for the Claude models (Haiku 35-38%, Opus 37-40%, Sonnet 36-43%) and rises with effort only for Sol (30% to 53%) and Luna (23% to 37%). So cx is always below tx: never multiply tokens by list price. [B S1]
- **Step elasticity** = delta index / log2(C(E+1) / C(E)) = index points per doubling of cost. **Knee** = the highest effort reached by consecutive steps that each buy at least 2.0 index points AND at least 3.0 points per doubling. **Plateau** = lowest effort within 1.0 index point of the model's best. (Rules fixed before computing; computed by script from the decimals.)
- **Reference (default) effort for cx/tx**: Haiku 5.5 and Opus 5.5 = medium; Sonnet 5.5 = high on the API, medium in Claude Code; Fable 5.1 = high; GPT-6.1 Sol and Luna = medium on the API, Codex defaults Sol and Astra to low; Grok 4.7 = high. Kimi K3, GLM-5.3, Gemini 3.8 Flash: no default found, so no cx. [V S2, S8, S10; L S9]
- Every Claude row on AA except Haiku 5.5 is labelled "with fallback"; Haiku 5.5 has no server-side fallback. [B S1, V S4]

## Summary

**Changes vs catalog** (old, then new, grade, source):

1. **New model row: Claude Haiku 5.5** (`claude-haiku-5-5`; alias `haiku` now resolves to it on the Anthropic API, to Haiku 4.5 on Bedrock, Google Cloud, Foundry and the AWS platform). First Haiku with effort: low / medium (default) / high / xhigh / max; 1M context; $0.10 in / $0.50 out per MTok for prompts up to 100K tokens and $0.50 / $2.50 above; adaptive thinking on by default (API: can be disabled at high or below, not at xhigh or max; Claude Code cannot turn it off). AA Index 29.5 / 34.5 / 37.8 / 41.2 / 43.4 at $0.0245 / $0.0470 / $0.0794 / $0.1238 / $0.2128 per task (low to max). [V S2, S3, S4; B S1] Catalog had Haiku 4.5 with no AA data and "Haiku 4.5 not competitive": AA Haiku 4.5 (reasoning) is 16.9 at $0.277, so Haiku 5.5 low is +12.6 index at 0.09x the cost. [B S1]
2. **Sonnet 5.5 cost basis** (catalog: 56 max $7.60, 47 high $1.08): AA $/task now 56.0 max $5.46, 46.8 high $0.88, 51.9 xhigh $2.01 (was $2.74), 40.8 medium $0.48 (was $0.59), low 35.9 at $0.35 (was not benchmarked). Index unchanged; cost fell 18-28%. Cause: Anthropic halved Sonnet 5.5 cache reads ($0.20 to $0.10 per MTok) on 2026-10-07 ("We're halving the price of Claude Sonnet 5.5's cache reads"); adding one more cache-read term to each new total reproduces the 09-30 totals (xhigh 2.012 + 0.734 = 2.746 vs 2.74; medium 0.483 + 0.106 = 0.589 vs 0.59). CursorBench Sonnet 5.5 costs fell 26-28% the same day (max $9.67 to $7.05). [B S1, V S3, V-first-party S7]
3. **Row note "Opus 5.5 low ~ Sonnet 5.5 medium, cheaper"** (standard worker, balanced): index tie still holds (42.3 vs 40.8) but Sonnet medium is now 12% cheaper per AA task ($0.483 vs $0.551), so "cheaper" is stale. On CursorBench Sonnet 5.5 high (47.8, $1.20) now beats Opus 5.5 low (43.7, $1.17) at equal cost. [B S1, V-first-party S7]
4. **Sol effort picks** (long-horizon balanced = Sol xhigh "CAI 63 at $1.04"; standard worker = Sol high; cheap frontier = Sol medium): the CAI now has all five Sol efforts in Codex: low 57.2 ($0.50), medium 61.4 ($0.70), high 60.1 ($0.89), xhigh 62.9 ($1.04), max 60.1 ($1.55). Medium, high and xhigh span only 2.8 points (about 1.2 standard errors of a difference, with ~1.6 per row by my 0/1 approximation); max is lower than xhigh and medium. Cheapest statistically equal setting is `medium`; Codex's own default is `low`. [B S6, L S9]
5. **Sonnet 5.5 max as the frontier grinder** (catalog: sonnet @max, "CAI 68 at $14.2/task"): the CAI supports it (max 68.4 vs xhigh 62.9) but at 4.3x the cost ($14.19 vs $3.33), and Cognition's FrontierCode, run in Claude Code, scores Sonnet 5.5 LOWER at max than at xhigh: Main 52.1 to 46.2, Extended 64.4 to 59.1, after about 12x more output tokens. Conflicting evidence; `xhigh` is the safer default and `max` an explicit gate. [B S6, V S5 (third-party run)]
6. **Native subagent effort** (catalog: "native subagents take the aliases ... and the session's effort"): Claude Code now lets a subagent carry its own effort, by `effort` frontmatter or a per-invocation `effort` parameter (Claude Code 2.1.292 or later; local install is 2.1.296). Precedence: env var `CLAUDE_CODE_EFFORT_LEVEL`, then per-invocation parameter, then frontmatter, then session level. So `haiku @medium` or `sonnet @high` can be dispatched per task. [V S2, L S9]
7. **Default effort per surface** (09-30 file used Sonnet 5.5 = high as reference): in Claude Code Opus 5.5, Sonnet 5.5 and Haiku 5.5 all default to `medium`; Sonnet 5.5's API default is `high`; Fable 5.1 defaults to `high` everywhere. [V S2]
8. **Effort section text** ("xhigh/max buy 0-4 points at 1.2-2.8x cost per step ... 115-694 s to first output at max"): becomes 0-5 points at 1.2-2.7x per step (Sonnet 5.5 xhigh step is +5.1; Haiku 5.5 xhigh +3.4) and 113-692 s at max (Luna 113 s, Opus 692 s; Haiku 5.5 310 s, xhigh 79 s). [B S1]
9. **GPT-6 Luna** moved up about +1 index at every effort (rounded 21/29/32/34/37 to 22/30/33/35/38; max 38.1 at $0.068); cause unknown (re-run). Luna in Codex on the CAI: 41.1 at $0.18 (catalog 41, unchanged). [B S1, S6]
10. **Newly on AA**: Grok 4.7 low 42.2 at $1.25 (was "not on AA"); GLM-5.3 low 34.3 at $0.85. CAI now lists per-effort rows (catalog: "one effort per harness+model"): Sonnet 5.5 x5, Haiku 5.5 x5, Sol x5, Muse Spark x2. [B S1, S6]
11. **New Haiku 5.5 behaviors** (not in catalog): at `low` in long agent prompts "the model is more likely to skip a search, stop early, or skip a check"; at `xhigh` "the model sometimes writes its whole answer in its thinking and ends the turn with no visible text". [V S4]
12. **Grinder / bug-hunt rows** (catalog: frontier `claude · sonnet-5-5 · max`, balanced `claude · opus-5-5 · xhigh` because it "dominates Sonnet 5.5 xhigh on AA"; evidence "xhigh dropped on one bug hunt [P, n=1-2]"): Bug Hunt Bench (n=3 per row) has Sonnet 5.5 max at 51.3 of 105, top of the board but $154 per round at pre-cut prices, against 36 at xhigh; Opus 5.5 xhigh 36 ($34.98) equals Sonnet 5.5 xhigh 36 ($42.86); GPT-6.1 Sol xhigh in Codex scores 42.7 at $4.35 (max 44.3 at $5.88), so it beats both Claude xhigh picks by 6.7 at roughly 0.1x the cost; no model dropped at its top effort. VulcanBench agrees on shape (Sonnet 5.5 92.0 at max on the steepest curve; Opus 5.5 flat from medium). `sonnet @max` holds only if the cost is acceptable; the balanced pick should become Codex `gpt-6.1-sol` at xhigh. [B/P S16, S17]
13. **No change** (re-checked): Opus 5.5 all five efforts (42.3 / 51.2 / 53.6 / 56.0 / 57.6; $0.55 / 1.34 / 1.82 / 3.46 / 5.98); Fable 5.1 (46.8 / 48.9 / 51.2 / 53.2 / 53.4; $2.37 to $7.63); Astra (45.8 to 52.7; $0.82 to $3.26); Sol on the AA Index (42.1 / 47.8 / 50.2 / 51.0 / 51.8); Grok 4.7 high and xhigh (46.3 / 46.4); Kimi K3 (30.1 / 43.6); GLM-5.3 max 44.8; DeepSeek V4.1 Flash max 39.5 ($0.27); MiMo V2.6 Pro 46.3 ($0.13); Gemini 3.8 Flash 39.8 / 40.9. Catalog CAI figures unchanged (Sonnet 68, Opus 66, Fable 62, Astra 62, Sol 63, Luna 41, Grok 56, K3 52, GLM 54, Gemini Flash 42). Vendor effort guidance for Opus 5.5, Sonnet 5.5, Fable 5.1 and OpenAI unchanged in substance. [B S1, S6; V S2, S4, S8]

**Selection findings**

- **Vendor headline numbers for Haiku 5.5 are max-effort numbers; the default is far lower.** TB4 39.2% at max vs 20.3% at medium; OSWorld 2.1 72.4% vs 53.3%; HLE 45.9% vs 35.5%; GDPval-AA 1620 vs 1277 Elo; PhysicianBench 43.0% vs 25.2%. Max costs 4.5x medium on AA and 8x the tokens. [V S3, S5]
- **Where Haiku 5.5 wins at equal cost (vendor-run): computer use and low-to-mid-effort knowledge work.** OSWorld: Haiku high 61.3% at $0.18 vs Luna max 48.9% at $0.20 and Sonnet low 57.9% at $0.68; GDPval-AA: Haiku xhigh 1513 Elo at $0.27 vs Sonnet medium 1324 at $0.27. CursorBench: Haiku xhigh 44.3 at $0.56 beats Opus 5.5 low 43.7 at $1.17 and Sonnet medium 39.2 at $0.52. [V S3, V-first-party S7]
- **Where it loses: long-horizon agentic coding.** Vendor TB4: from $0.62 upward Sonnet 5.5 scores higher at the same cost (only Haiku low, $0.42 for 12.7%, is cheaper than any Sonnet point); Anthropic: "Sonnet 5.5 and Opus 5.5 remain better choices for complex agentic coding tasks like those measured by Terminal-Bench 4.0". AA CAI: Haiku 5.5 in Claude Code peaks at 41.4 ($0.61), below Sonnet 5.5 low 42.1 ($0.48) and Sonnet medium 45.9 ($0.62), and only ties GPT-6 Luna max in Codex (41.1) at 3.4x the cost ($0.18 vs $0.61). [V S3, B S6]
- **AA's Index understates Haiku 5.5's real cost in agentic use.** AA prices Haiku 5.5 only at the up-to-100K-prompt rate (output cost = tokens x $0.50 exactly). Anthropic bills 5x per token above 100K tokens per request; average CAI prompts are 70-106K tokens per request. Same-effort cost ratio Haiku:Sonnet is 0.04-0.10 on the AA Index, 0.16-0.37 on CursorBench and the CAI, 0.25-1.00 on vendor TB4 (list-price ratio 0.05 at the cheap tier, 0.25 at the long-prompt tier). [B S1, S6, V S2, S3, S7]
- **Haiku 5.5 xhigh is its knee, max is not worth it for agent work.** AA: each step through xhigh buys 3.4-5.0 points at 1.6-1.9x cost; max adds 2.1 for 1.7x. CAI in Claude Code: xhigh 41.4, max 36.5 (cost x4.2, 87 min wall, 990K output tokens); the drop is SWE-Atlas-QnA 51.6 to 33.6 while Terminal-Bench still rises 23.7 to 29.8. Max is justified only for single-shot QA-style calls (FrontierCode Main 46.4, HealthBench Professional 64.8 are best at max). [B S1, S6; V S5]
- **Degradation evidence now exists for three models**: Haiku 5.5 CAI max < xhigh (above); Sonnet 5.5 FrontierCode max < xhigh (above); Opus 5.5 FrontierCode flat or lower above medium (Main 54.6 / 53.9 / 51.4 / 54.4 for medium to max; CursorBench high = xhigh = 56.0). Claude Code docs: "`max` may show diminishing returns and is prone to overthinking, so test before adopting it broadly". [V S2, S5; B S6; V-first-party S7]
- **The effort ceiling depends on the task, so set effort by role.** On exploratory bug hunting (Bug Hunt Bench) every model scores highest at its top effort (Sonnet 5.5 19 to 51.3, Sol 22.5 to 44.3, Haiku 5.5 11 to 21.5) and VulcanBench has Sonnet 5.5 rising to max; plateaus and drops show up on focused implementation and Q&A work (FrontierCode, CAI QnA and DeepSWE, VulcanBench Opus 5.5 flat from medium). Audit and bug-hunt roles pay for xhigh or max; implementation roles plateau at medium to xhigh. [B/P S16, S17; B S6; V S5]
- **Vision and computer use**: tools matter more than effort. Haiku 5.5 Chartography: ~38% (low) to 46.4% (max) without tools, ~55% (low) to 86.2% (max) with a crop tool, so low-with-tools already beats max-without-tools. Haiku 5.5 is now a usable computer-use model (OSWorld offline subset 72.4% at max, 53.3% at the default; Haiku 4.5 scored 15.7%). All vendor-run. [V S3, S5]
- **Cross-model equal-cost picture on the AA Index**: Luna max 38.1 at $0.068 ties Haiku 5.5 high; Haiku 5.5 xhigh 41.2 at $0.124 ties Sol low 42.1 at $0.131; Haiku 5.5 max is dominated by Sol medium (47.8 at $0.214). Haiku 5.5 xhigh is the only Haiku point on the Pareto frontier. [B S1]

## Findings

### F1. Model x effort matrix, AA Intelligence Index v4.3.2, 2026-10-13 [B, S1]

`*` = reference effort for cx/tx. TTFAT = time to first answer token, E2E = AA end-to-end time for a 500-token answer; both include thinking and are live medians (they move a few percent between reads: Opus 5.5 max TTFAT is 692 s on its page and 717 s in lane 3's table the same day).

| Model | Effort | Index | $/task | cx vs ref | Output tokens (index run) | tx vs ref | tok/s | TTFAT s / E2E s |
|---|---|---|---|---|---|---|---|---|
| Claude Haiku 5.5 | low | 29.5 | 0.0245 | 0.52 | 32M | 0.60 | 170 | 9 / 12 |
|  | medium* | 34.5 | 0.0470 | 1.00 | 54M | 1.00 | 175 | 13 / 16 |
|  | high | 37.8 | 0.0794 | 1.69 | 97M | 1.81 | 175 | 25 / 27 |
|  | xhigh | 41.2 | 0.1238 | 2.63 | 180M | 3.35 | 190 | 79 / 82 |
|  | max | 43.4 | 0.2128 | 4.52 | 435M | 8.09 | 238 | 310 / 312 |
| Claude Opus 5.5 | low | 42.3 | 0.5512 | 0.41 | 20M | 0.51 | 80 | 12 / 19 |
|  | medium* | 51.2 | 1.3360 | 1.00 | 38M | 1.00 | 79 | 25 / 32 |
|  | high | 53.6 | 1.8225 | 1.36 | 53M | 1.38 | 82 | 53 / 59 |
|  | xhigh | 56.0 | 3.4591 | 2.59 | 100M | 2.61 | 81 | 159 / 166 |
|  | max | 57.6 | 5.9820 | 4.48 | 260M | 6.81 | 95 | 692 / 697 |
| Claude Sonnet 5.5 | low | 35.9 | 0.3452 | 0.39 | 23M | 0.44 | 100 | 1 / 6 |
|  | medium | 40.8 | 0.4833 | 0.55 | 31M | 0.60 | 95 | 1 / 6 |
|  | high* | 46.8 | 0.8844 | 1.00 | 52M | 1.00 | 96 | 14 / 19 |
|  | xhigh | 51.9 | 2.0120 | 2.27 | 105M | 2.02 | 103 | 36 / 41 |
|  | max | 56.0 | 5.4609 | 6.17 | 416M | 7.99 | 135 | 452 / 456 |
| Claude Fable 5.1 | low | 46.8 | 2.3710 | 0.61 | 33M | 0.52 | 56 | 2 / 11 |
|  | medium | 48.9 | 2.9826 | 0.76 | 44M | 0.71 | 54 | 10 / 19 |
|  | high* | 51.2 | 3.9125 | 1.00 | 62M | 1.00 | 52 | 18 / 28 |
|  | xhigh | 53.2 | 5.9783 | 1.53 | 121M | 1.94 | 62 | 114 / 122 |
|  | max | 53.4 | 7.6297 | 1.95 | 188M | 3.04 | 68 | 247 / 254 |
| GPT-6 Astra | low | 45.8 | 0.8175 | 0.53 | 10M | 0.53 | 55 | 2 / 11 |
|  | medium* | 49.6 | 1.5406 | 1.00 | 19M | 1.00 | 55 | 6 / 15 |
|  | high | 50.9 | 1.7253 | 1.12 | 26M | 1.39 | 55 | 94 / 103 |
|  | xhigh | 52.4 | 2.3088 | 1.50 | 38M | 2.00 | 59 | 161 / 169 |
|  | max | 52.7 | 3.2575 | 2.11 | 60M | 3.17 | 63 | 326 / 334 |
| GPT-6.1 Sol | low | 42.1 | 0.1308 | 0.61 | 9M | 0.59 | 52 | 2 / 12 |
|  | medium* | 47.8 | 0.2137 | 1.00 | 15M | 1.00 | 54 | 8 / 17 |
|  | high | 50.2 | 0.3191 | 1.49 | 25M | 1.66 | 57 | 55 / 64 |
|  | xhigh | 51.0 | 0.3929 | 1.84 | 36M | 2.36 | 59 | 174 / 182 |
|  | max | 51.8 | 0.7242 | 3.39 | 67M | 4.40 | 65 | 322 / 330 |
| GPT-6 Luna | low | 21.5 | 0.0045 | 0.26 | 8M | 0.29 | 129 | 3 / 6 |
|  | medium* | 29.9 | 0.0175 | 1.00 | 29M | 1.00 | - | - |
|  | high | 32.9 | 0.0290 | 1.66 | 47M | 1.64 | 132 | 18 / 22 |
|  | xhigh | 34.6 | 0.0422 | 2.41 | 69M | 2.40 | 126 | 41 / 45 |
|  | max | 38.1 | 0.0678 | 3.88 | 144M | 5.06 | 134 | 113 / 117 |
| Grok 4.7 | low | 42.2 | 1.2480 | 0.46 | 75M | 0.38 | 65 | 7 / 15 |
|  | high* | 46.3 | 2.7261 | 1.00 | 198M | 1.00 | 74 | 46 / 53 |
|  | xhigh | 46.4 | 3.7383 | 1.37 | 240M | 1.22 | 84 | 87 / 93 |
| Kimi K3 | low | 30.1 | 1.1463 | - | 22M | - | 46 | 47 / 58 |
|  | max | 43.6 | 2.0001 | - | 161M | - | 43 | 50 / 61 |
| GLM-5.3 | low | 34.3 | 0.8522 | - | 88M | - | 73 | 30 / 37 |
|  | max | 44.8 | 2.0056 | - | 209M | - | 67 | 33 / 41 |
| Gemini 3.8 Flash | medium | 39.8 | 0.9310 | - | 95M | - | - | - |
|  | high | 40.9 | 1.2428 | - | 172M | - | 141 | 23 / 26 |

Other single AA points: Haiku 4.5 (reasoning) 16.9 at $0.277, 78M tokens, 94 tok/s, TTFAT 22 s; DeepSeek V4.1 Flash max 39.5 at $0.265 (non-reasoning 24.7 at $0.147); MiMo V2.6 Pro 46.3 at $0.133 (48 tok/s, TTFAT 46 s); GPT-6 Luna non-reasoning 18.5 at $0.0113; Gemini 4 Argon (high) 52.6 at $1.99 and Muse Spark 1.3 (max 48.1 at $1.60, xhigh 45.1 at $1.37) are outside the seed list. Sonnet 5.5 cx against its Claude Code default (medium): low 0.71, high 1.83, xhigh 4.16, max 11.3. Sol cx against Codex's default (low): medium 1.63, high 2.44, xhigh 3.00, max 5.54. AA decode time per Index task: Haiku 5.5 66 / 117 / 196 / 290 / 421 s (low to max) vs Opus 5.5 81 / 203 / 272 / 506 / 800 s. No AA rows: Grok 4.7 medium, K3 and GLM-5.3 medium/high, DeepSeek V4.1 Flash efforts, Gemini 4 Argon medium/low (404 on AA). Gemini 3.8 Flash low has an index (33) but no cost (page has no token counts). [B S1]

### F2. Step economics and knee, AA Index (delta index / cost multiple / index points per doubling) [B, S1]

| Model | low to medium | medium to high | high to xhigh | xhigh to max | knee | plateau |
|---|---|---|---|---|---|---|
| Claude Haiku 5.5 | +5.0 / x1.92 / 5.3 | +3.4 / x1.69 / 4.4 | +3.4 / x1.56 / 5.4 | +2.1 / x1.72 / 2.7 | xhigh | max |
| Claude Opus 5.5 | +8.9 / x2.42 / 7.0 | +2.3 / x1.36 / 5.2 | +2.4 / x1.90 / 2.6 | +1.6 / x1.73 / 2.1 | high | max |
| Claude Sonnet 5.5 | +5.0 / x1.40 / 10.2 | +5.9 / x1.83 / 6.8 | +5.1 / x2.27 / 4.3 | +4.1 / x2.71 / 2.8 | xhigh | max |
| Claude Fable 5.1 | +2.1 / x1.26 / 6.4 | +2.2 / x1.31 / 5.7 | +2.1 / x1.53 / 3.4 | +0.2 / x1.28 / 0.4 | xhigh | xhigh |
| GPT-6 Astra | +3.8 / x1.88 / 4.1 | +1.3 / x1.12 / 8.3 | +1.5 / x1.34 / 3.5 | +0.3 / x1.41 / 0.6 | medium | xhigh |
| GPT-6.1 Sol | +5.7 / x1.63 / 8.0 | +2.5 / x1.49 / 4.2 | +0.8 / x1.23 / 2.7 | +0.8 / x1.84 / 0.9 | high | xhigh |
| GPT-6 Luna | +8.4 / x3.87 / 4.3 | +3.0 / x1.66 / 4.1 | +1.6 / x1.45 / 3.0 | +3.6 / x1.61 / 5.2 | high | max |
| Grok 4.7 | low to high: +4.1 / x2.18 / 3.7 | - | +0.1 / x1.37 / 0.3 | - | high | high |
| Kimi K3 | low to max: +13.5 / x1.74 / 16.8 | - | - | - | max (two points) | max |
| GLM-5.3 | low to max: +10.5 / x2.35 / 8.5 | - | - | - | max (two points) | max |
| Gemini 3.8 Flash | - | +1.2 / x1.33 / 2.8 | - | - | medium | high |

The rule reproduces the catalog's existing knees where they overlap (Opus 5.5 high, Astra medium, Grok 4.7 high, Fable 5.1 xhigh = max, Luna high with an efficient max step). Luna's curve is convex at the top (max step +3.6 for x1.61), so max is also worth it on Luna. Sonnet 5.5 has the steepest curve among the Claude models: every step through xhigh buys 4-6 points. AA publishes no CI. Using decimals removes the +-0.5 rounding of the integer reading, but run-to-run noise is unpublished, so steps below about +1 index point should be read as noise. [B S1]

### F3. Claude Haiku 5.5: every board that names an effort

**F3a. Headline (max) vs default (medium) vs low**

| Benchmark | max (headline) | medium (default) | low | Source |
|---|---|---|---|---|
| AA Intelligence Index | 43.4 | 34.5 | 29.5 | [B S1] |
| AA CAI, Claude Code (best is xhigh 41.4) | 36.5 | 33.6 | 28.2 | [B S6] |
| CursorBench 4.0 | 48.4 | 36.9 | 30.9 | [V-first-party S7] |
| Terminal-Bench 4.0 pass@1 % (Anthropic run) | 39.2 | 20.3 | 12.7 | [V S3] |
| OSWorld 2.1 offline subset, partial credit % | 72.4 | 53.3 | 42.0 | [V S3] |
| HLE no tools % / with tools % | 45.9 / 57.4 | 35.5 / 45.0 | 30.9 / 38.6 | [V S3, S5 chart] |
| GDPval-AA v2.1 Elo (AA-run) | 1620 | 1277 | 1125 | [V S3, S5] |
| AA-Briefcase v1.1 Elo | 1578 | 1372 | n/a | [V S5] |
| HealthBench Professional, length-adjusted % | 64.8 | 59.9 | 57.9 | [V S5] |
| PhysicianBench pass % | 43.0 | 25.2 | 17.8 | [V S5] |
| FrontierCode Main / Extended (Cognition run) | 46.4 / 58.4 | ~41.6 / ~55.0 | ~34.7 / ~48.2 | [V S5, chart for medium/low] |

**F3b. Anthropic launch-post effort sweeps (exact SVG labels; score then cost per attempt in USD; vendor-run, Sonnet 5.5 and Luna also run by Anthropic)** [V S3]

| Benchmark | Model | low | medium | high | xhigh | max |
|---|---|---|---|---|---|---|
| OSWorld 2.1 offline, partial % / $ | Haiku 5.5 | 42.0 / 0.07 | 53.3 / 0.13 | 61.3 / 0.18 | 67.6 / 0.28 | 72.4 / 0.61 |
|  | Sonnet 5.5 | 57.9 / 0.68 | 66.0 / 0.93 | 73.2 / 1.38 | 81.1 / 2.22 | 83.9 / 5.73 |
|  | GPT-6 Luna | 19.2 / 0.04 | 37.5 / 0.13 | 42.3 / 0.14 | 44.8 / 0.17 | 48.9 / 0.20 |
| GDPval-AA v2.1 Elo / $ | Haiku 5.5 | 1125 / 0.01 | 1277 / 0.03 | 1420 / 0.09 | 1513 / 0.27 | 1620 / 0.87 |
|  | Sonnet 5.5 | 1179 / 0.22 | 1324 / 0.27 | 1551 / 0.62 | 1731 / 1.88 | 1840 / 6.78 |
|  | GPT-6 Luna | 1036 / 0.004 | 1262 / 0.02 | 1344 / 0.03 | 1364 / 0.05 | 1437 / 0.09 |
| HLE no tools % / $ | Haiku 5.5 | 30.9 / 0.003 | 35.5 / 0.007 | 39.7 / 0.02 | 44.1 / 0.06 | 45.9 / 0.21 |
|  | Sonnet 5.5 | 41.4 / 0.03 | 43.2 / 0.03 | 47.9 / 0.08 | 53.0 / 0.20 | 56.9 / 0.89 |
| Terminal-Bench 4.0 pass@1 % / $ | Haiku 5.5 | 12.7 / 0.42 | 20.3 / 0.68 | 24.8 / 1.04 | 31.5 / 1.75 | 39.2 / 2.64 |
|  | Sonnet 5.5 ($0.10 cache read) | 20.0 / 0.62 | 28.8 / 0.68 | 43.0 / 1.46 | 61.5 / 4.34 | 70.6 / 10.44 |
|  | Sonnet 5.5 (old $0.20 cache read) | 20.0 / 0.79 | 28.8 / 0.86 | 43.0 / 1.97 | 61.5 / 5.83 | 70.6 / 14.15 |

Haiku 4.5 single points (max/fixed budget): OSWorld 15.7 / $1.45, GDPval 735 / $0.24, HLE 10.2 / $0.09, TB4 0.0 / $0.79. Luna max values here (OSWorld 48.9, GDPval 1437, TB4 16.4) match Anthropic's table.

**F3c. System-card sweeps read off charts (score %, low / medium / high / xhigh / max)** [V S5; chart readings +-1; HLE with-tools points are printed labels]

| Benchmark (tools, source) | Haiku 5.5 | Sonnet 5.5 | Opus 5.5 |
|---|---|---|---|
| FrontierCode Main (Cognition, Claude Code) | 34.7 / 41.6 / 41.9 / 45.8 / 46.4 | 29.3 / 36.5 / 49.4 / 52.1 / 46.2 | 47.3 / 54.6 / 53.9 / 51.4 / 54.4 |
| FrontierCode Extended | 48.2 / 55.0 / 55.8 / 58.1 / 58.4 | 43.4 / 50.4 / 61.4 / 64.4 / 59.1 | 60.3 / 65.3 / 65.2 / 63.5 / 63.5 |
| HLE with tools | 38.6 / 45.0 / 50.1 / 54.8 / 57.4 | 47.6 / 50.5 / 56.7 / 62.0 / 64.5 | 57.4 / 63.0 / 63.9 / 66.4 / 67.7 |
| DRACO (deep research) | 64.3 / 72.4 / 77.8 / 80.5 / 81.5 | 64.6 / 71.2 / 81.0 / 85.7 / 87.0 | 72.5 / 83.9 / 85.0 / 86.7 / 87.4 |
| WANDR (wide research, soft F1) | 3.5 / 12.9 / 37.3 / 45.9 / 49.9 | 10.0 / 29.9 / 56.3 / 66.6 / 70.0 | 31.2 / 62.8 / 67.3 / 71.3 / 72.3 |

FrontierCode Main tokens per task, Haiku 5.5: ~24K / 36K / 56K / 100K / 180K; Sonnet 5.5 ~6K / 7.5K / 12K / 48K / 560K; Opus 5.5 ~9K / 19K / 28K / 60K / 165K (chart). Opus 5.5 medium 54.6 on Main matches Anthropic's Opus 5.5 launch claim. Haiku 5.5 cost axes on DRACO/WANDR/HLE are unlabeled log axes and are not tabulated; the card states "Costs for Opus 5.5 and Sonnet 5.5 assume a perfect cache hit rate; Haiku 4.5 and 5.5 use list prices on recorded usage" (HLE, DRACO, WANDR) and, for Chartography and BenchCAD, "Claude Haiku 5.5 is charged per request at the rate for that request's prompt length (above or below 100K tokens)". Text-stated (exact): HealthBench 59.9 / 60.2 / 60.3 / 61.1 / 61.6 (low to max; response 4-8 s below max, ~44 s at max); HealthBench Professional 57.9 / 59.9 / 61.3 / 61.0 / 64.8 with high and xhigh "not distinguishable" (8-21 s per answer low to xhigh, ~110 s max); PhysicianBench 17.8 / 25.2 / 31.6 / 35.8 / 43.0, model time 48 s (low), 133 s (high), ~11 min (max); Sonnet 5.5, Opus 5.5 and Fable 5.1 "each varied by less than 2 points across the five levels" on HealthBench Professional and sit above Haiku 5.5 at every level below max. Chartography, Haiku 5.5: without tools ~38% (low) rising to 46.4% (max); with an image-crop tool ~55% (low) to 86.2% (max). OSWorld 2.1 offline at max: Haiku 5.5 72.4% partial / 37.1% strict, Sonnet 5.5 83.9 / 48.8, Opus 5.5 87.2 / 53.2. [V S5]

**F3d. Same-harness per-effort boards**

AA Coding Agent Index (harness + model + effort; mean per task; page read 2026-10-13; no CI published; with ~909 attempts per row a 0/1 approximation gives a standard error of about 1.6 index points, my estimate) [B S6]:

| Effort | Claude Code Haiku 5.5: CAI / $ / wall min / output tokens | Claude Code Sonnet 5.5 | Codex GPT-6.1 Sol |
|---|---|---|---|
| low | 28.2 / 0.14 / 11.6 / 48K | 42.1 / 0.48 / 6.3 / 16K | 57.2 / 0.50 / 8.6 / 15K |
| medium | 33.6 / 0.23 / 14.0 / 68K | 45.9 / 0.62 / 8.5 / 21K | 61.4 / 0.70 / 10.9 / 22K |
| high | 35.1 / 0.36 / 18.4 / 105K | 55.0 / 1.24 / 12.3 / 41K | 60.1 / 0.89 / 13.3 / 29K |
| xhigh | 41.4 / 0.61 / 25.9 / 190K | 62.9 / 3.33 / 27.0 / 126K | 62.9 / 1.04 / 15.5 / 35K |
| max | 36.5 / 2.58 / 87.1 / 990K | 68.4 / 14.19 / 87.4 / 601K | 60.1 / 1.55 / 24.4 / 62K |
| cx vs default (Haiku, Sonnet medium; Sol low) | 0.63 / 1.00 / 1.61 / 2.70 / 11.4 | 0.78 / 1.00 / 2.00 / 5.39 / 22.9 | 1.00 / 1.41 / 1.78 / 2.08 / 3.12 |
| per-eval DeepSWE / QnA / TB4 at low, medium, high, xhigh, max | 45.4/33.1/6.1; 47.5/41.7/11.6; 46.3/46.2/12.6; 49.0/51.6/23.7; 46.0/33.6/29.8 | 61.9/39.0/25.3; 65.5/44.9/27.3; 66.7/56.5/41.9; 68.4/62.1/58.1; 72.0/66.9/66.2 | 67.6/55.1/49.0; 72.0/60.8/51.5; 70.5/59.9/50.0; 73.2/61.0/54.5; 69.6/57.8/53.0 |

Other CAI rows: Claude Code Opus 5.5 (max) 66.0 at $13.04; Codex GPT-6 Astra (max) 61.6 at $7.47; Codex GPT-6 Luna (max) 41.1 at $0.18 (DeepSWE 63.7, QnA 44.4, TB4 15.2); Grok Build Grok 4.7 (xhigh) 56.3 at $8.82; Codex DeepSeek V4 Pro 0813 (max) 43.1 at $0.24 and DeepSeek V4 Flash 0731 (max) 38.7 at $0.09 (version labels differ from the catalog's `deepseek-v4.1-flash`). Haiku 5.5 flat spot: DeepSWE stays 45-49 at every effort, QnA peaks at xhigh, only Terminal-Bench keeps climbing to max.

CursorBench 4.0, Cursor harness (score % / $ per task / tokens per task; page read 2026-10-13, latest changelog entry Oct 7, 2026 "Updated Sonnet 5.5 results to account for adjusted pricing"; no GPT-6 rows, only GPT-5.6) [V-first-party S7]:

| Effort | Haiku 5.5 | Sonnet 5.5 | Opus 5.5 | Fable 5.1 | Grok 4.7 |
|---|---|---|---|---|---|
| low | 30.9 / 0.08 / 23K | 35.8 / 0.37 / 12K | 43.7 / 1.17 / 16K | 45.1 / 5.44 / 35K | 33.1 / 1.58 / 16K |
| medium | 36.9 / 0.17 / 43K | 39.2 / 0.52 / 16K | 52.5 / 2.91 / 38K | 46.8 / 7.05 / 45K | 41.6 / 3.49 / 37K |
| high | 42.3 / 0.32 / 77K | 47.8 / 1.20 / 37K | 56.0 / 3.97 / 53K | 49.2 / 9.08 / 58K | 43.9 / 4.69 / 56K |
| xhigh | 44.3 / 0.56 / 144K | 53.1 / 2.81 / 100K | 56.0 / 6.98 / 101K | 51.6 / 13.01 / 87K | 46.3 / 6.01 / 70K |
| max | 48.4 / 1.12 / 326K | 55.5 / 7.05 / 272K | 57.8 / 13.43 / 218K | 51.8 / 17.28 / 117K | - |
| cx vs default | 0.47 / 1.00 / 1.88 / 3.29 / 6.59 | 0.71 / 1.00 / 2.31 / 5.40 / 13.6 | 0.40 / 1.00 / 1.36 / 2.40 / 4.62 | 0.60 / 0.78 / 1.00 / 1.43 / 1.90 | 0.34 / 0.74 / 1.00 / 1.28 / - |

Steps per task, Haiku 5.5: 25 / 39 / 59 / 93 / 163 (Sonnet 5.5 max 170, Opus 5.5 max 185). Terminal-Bench 4.0 leaderboard (tbench.ai, rendered 2026-10-13): one effort per model (Opus 5.5 max 64.8 +-3.1, Sonnet 5.5 max 61.8, Astra max 58.2, 6.1 Sol max 58.2 +-3.1 at $0.6k, Fable 5.1 max 57.9, Grok 4.7 xhigh 37.6, GPT-6 Luna max 16.4 +-2.7); Haiku 5.5 not listed yet, so it gives no per-effort pair. SWE-rebench lists GPT-5.6 Sol/Luna [medium] and Opus 4.8-xhigh only (no Haiku 5.5, 5.5-generation or GPT-6 rows). [B S11, S12]

**F3e. Two open practitioner benchmarks with full per-effort sweeps (found by lane 4, verified here from the repos)** [B/P S16, S17]

Bug Hunt Bench (phuryn / productcompass, updated Oct 8, 2026): 105 planted bugs in two production codebases, one round per repo in each model's own CLI, diffs graded blind against a withheld key (OpenAI arms by Grok, all others by GPT-5.5 through Codex). Fixed bugs out of 105 / list-price cost per round / wall minutes; `n` = runs averaged. Author's noise estimate: over 36 configurations run three times, the mean of three moved by a median 1.8 points against the first run (more than 2 in 17 of 36, maximum 5.7), so gaps of a few points between single runs are noise. [B/P S16]

| Model (harness) | low | medium | high | xhigh | max |
|---|---|---|---|---|---|
| Haiku 5.5 (Claude Code) | 11 / $1.61 / 9 (n=1) | 12 / $2.66 / 16 (n=1) | 16 / $3.56 / 19 (n=2) | 18.3 / $4.80 / 24 (n=3) | 21.5 / $5.83 / 32 (n=2) |
| Sonnet 5.5 (Claude Code) | 19 / $5.73 / 8 (n=3) | 23.3 / $11.11 / 17 (n=3) | 34.3 / $19.85 / 28 (n=3) | 36 / $42.86 / 73 (n=3) | 51.3 / $154.03 / 287 (n=3) |
| Opus 5.5 (Claude Code) | 22.3 / $8.34 / 12 (n=3) | 30.3 / $15.68 / 17 (n=3) | 31.7 / $22.25 / 24 (n=3) | 36 / $34.98 / 42 (n=3) | 41.7 / $58.53 / 67 (n=3) |
| Fable 5.1 (Claude Code) | 29 / $33.00 / 33 (n=1) | 21 / $23.73 / 23 (n=1) | 33 / $48.58 / 36 (n=1) | 29 / $53.61 / 60 (n=1) | 43 / $87.18 / 73 (n=1) |
| GPT-6.1 Sol (Codex) | 22.5 / $1.34 / 25 (n=2) | 29 / $1.76 / 30 (n=2) | 36.5 / $3.26 / 70 (n=2) | 42.7 / $4.35 / 99 (n=3) | 44.3 / $5.88 / 139 (n=3) |
| GPT-6 Astra (Codex) | 27 / $11.69 / 32 (n=1) | 34 / $15.78 / 28 (n=1) | 35 / $20.60 / 40 (n=1) | 43 / $24.22 / 59 (n=1) | 45 / $33.03 / 90 (n=3) |
| GPT-6 Luna (Codex) | 4 / $0.20 / 19 (n=1) | 4 / $0.06 / 9 (n=1) | 9 / $0.13 / 24 (n=1) | 14 / $0.39 / 57 (n=1) | 18.3 / $0.52 / 99 (n=3) |
| Grok 4.7 (Grok Build) | 15.7 / $9.36 floor / 22 (n=3) | 26.7 / $16.76 floor / 31 (n=3) | 19.3 / $12.29 floor / 38 (n=3) | 29 / $22.96 floor / 45 (n=5) | - |

Haiku 4.5: 1.5 of 105 at $2.22. Run dates: Haiku 5.5 2026-10-07/08, Sonnet 5.5 2026-09-29/30 (priced before the 10-07 cache-read cut, so roughly 20-28% lower now), Opus 5.5 09-23, Sol 6.1 09-30/10-01. The run notes state Haiku 5.5 costs are "priced per request at Haiku 5.5's prompt-length tiers - most requests land in the upper tier under Claude Code", which independently supports F5. Cost per fixed bug: Luna max $0.03, Sol medium $0.06 to max $0.13, Haiku 5.5 $0.15 (low) to $0.27 (max), Opus 5.5 $0.37 to $1.40, Sonnet 5.5 $0.30 to $3.00. Reading: the top tier scored highest for every model (no degradation at max on this task); mid-tier dips exist (Grok 4.7 high 19.3 below medium 26.7 with n=3 each; Fable 5.1 on single runs). Haiku 5.5 rises 11 to 21.5 with max +3.2 over xhigh (borderline against the noise). Sol medium (29 at $1.76) beats Haiku 5.5 max (21.5 at $5.83) at 0.30x the cost, and Luna max (18.3 at $0.52) matches Haiku xhigh (18.3 at $4.80) at 0.11x the cost.

VulcanBench "Frontier v4" (morganlinton, `docs/results/swe-v4-*/…efforts.csv`, October 2026): 23 behavioural-reconstruction tasks; combined score = 100 x (0.50 functional + 0.085 lint/complexity + 0.085 security + 0.33 code quality), shown with its standard error; harness not stated in the CSVs. Score +- SE / USD per task / minutes / tasks passed of 23: [B/P S17]

| Model | low | medium | high | xhigh | max |
|---|---|---|---|---|---|
| Opus 5.5 | 86.4 +-1.3 / $1.70 / 13.7 / 17 | 90.9 +-0.6 / $2.84 / 18.6 / 23 | 91.1 +-0.6 / $3.27 / 21.4 / 22 | 90.7 +-1.1 / $4.11 / 20.7 / 22 | 90.2 +-1.0 / $8.75 / 37.5 / 21 |
| Sonnet 5.5 | 81.6 +-1.4 / $2.88 / 20.0 / 15 | 84.1 +-1.2 / $3.00 / 20.8 / 17 | 86.8 +-1.1 / $2.39 / 14.8 / 20 | 90.2 +-0.6 / $3.38 / 21.6 / 22 | 92.0 +-0.4 / $5.52 / 38.0 / 23 |
| GPT-6.1 Sol | 86.2 +-0.8 / $0.31 / 6.9 / 20 | 86.4 +-0.8 / $0.40 / 10.6 / 22 | 88.2 +-0.4 / $0.33 / 10.2 / 23 | 88.8 +-0.4 / $0.43 / 15.4 / 23 | 88.3 +-0.3 / $0.46 / 14.5 / 23 |
| GPT-6 Astra | 87.4 +-0.5 / $1.72 / 4.2 / 22 | 87.7 +-0.3 / $1.48 / 3.8 / 23 | 88.2 +-0.4 / $1.71 / 4.9 / 23 | 89.2 +-0.3 / $2.30 / 8.1 / 23 | 89.3 +-0.4 / $2.57 / 10.3 / 23 |

Confound: the Opus 5.5 rows report the share of replies served by Opus 4.8 after a safeguard fallback, 0 / 6.4 / 20.9 / 32.4 / 47.8% (low to max; 0 / 3 / 7 / 8 / 12 runs with a fallback), so Opus 5.5 high and above is partly measuring Opus 4.8; Sonnet 5.5 rows show 0. Reading: Opus 5.5 plateaus at medium (90.9, then 91.1 / 90.7 / 90.2 within the standard errors) while its cost rises 3.1x to max, matching FrontierCode and CursorBench; Sonnet 5.5 climbs steeply with no plateau (+10.4 low to max, xhigh to max +1.8 for x1.6 cost) and its low and medium rows cost no less than high ($2.88 / $3.00 vs $2.39) because they run longer; Sol is flat from high (88.2 to 88.8); Astra is nearly flat (+1.9 across all five levels) and cheapest at medium. No Haiku 5.5 rows yet.

### F4. Equal-cost comparisons

**F4a. AA Intelligence Index (cost per task at the cheap price tier); catalog's cheap and worker tiers named in the brief** [B S1]

| Haiku 5.5 point | Equal-cost rival | Reading |
|---|---|---|
| low 29.5 / $0.0245 | Luna medium 29.9 / $0.0175; Luna high 32.9 / $0.0290 | Luna medium dominates (higher at 0.71x cost) |
| medium 34.5 / $0.0470 | Luna xhigh 34.6 / $0.0422 | Tie (Luna 0.90x cost; TTFAT 41 s vs 13 s) |
| high 37.8 / $0.0794 | Luna max 38.1 / $0.0678 | Tie (Luna 0.85x cost; TTFAT 113 s vs 25 s) |
| xhigh 41.2 / $0.1238 | 6.1 Sol low 42.1 / $0.1308; MiMo V2.6 Pro 46.3 / $0.133 | Frontier point; Sol low +0.8 at 1.06x with TTFAT 2 s vs 79 s; MiMo +5.1 at 1.08x (48 tok/s) |
| max 43.4 / $0.2128 | 6.1 Sol medium 47.8 / $0.2137 | Dominated: Sol medium +4.4 at the same cost, TTFAT 8 s vs 310 s |

Named comparisons: vs Opus 5.5 low (42.3 / $0.551): Haiku 5.5 xhigh is -1.1 at 0.22x cost, Haiku 5.5 max +1.1 at 0.39x, but TTFAT 79 s / 310 s vs 12 s. vs Sonnet 5.5 medium (40.8 / $0.483): Haiku 5.5 xhigh matches the index at 0.26x cost, TTFAT 79 s vs 1 s. vs Haiku 4.5 (reasoning) 16.9 / $0.277: Haiku 5.5 low is +12.6 at 0.09x. vs Luna max 38.1 / $0.068: tie with Haiku 5.5 high. vs 6.1 Sol low (42.1 / $0.131): tie with Haiku 5.5 xhigh; vs Sol high (50.2 / $0.319): +9 over Haiku 5.5 xhigh at 2.6x its cost. Pareto frontier (cost ascending): Luna low through max, Haiku 5.5 xhigh, Sol low, MiMo V2.6 Pro, Sol medium through max, Opus 5.5 high, xhigh, then Sonnet 5.5 max (56.00 vs Opus xhigh 55.99 at 1.6x cost) and Opus 5.5 max. Dominated outright: every other Haiku 5.5 effort, Opus 5.5 low and medium, Sonnet 5.5 low through xhigh, Astra at every effort, Fable at every effort. [B S1]

**F4b. By board, where Haiku 5.5 sits against its nearest cost neighbours**

| Board | Haiku 5.5 point | Neighbour | Reading |
|---|---|---|---|
| CursorBench [V-first-party S7] | xhigh 44.3 / $0.56 | Opus 5.5 low 43.7 / $1.17; Sonnet 5.5 medium 39.2 / $0.52 | Haiku +0.6 at 0.48x vs Opus low; +5.1 at 1.08x vs Sonnet medium |
|  | max 48.4 / $1.12 | Sonnet 5.5 high 47.8 / $1.20 | Tie (Haiku 0.93x) |
|  | high 42.3 / $0.32 | Sonnet 5.5 low 35.8 / $0.37 | Haiku +6.5 at 0.86x |
| CAI, Claude Code vs Codex [B S6] | xhigh 41.4 / $0.61 | Sonnet 5.5 low 42.1 / $0.48; medium 45.9 / $0.62; Codex Luna max 41.1 / $0.18; Codex Sol low 57.2 / $0.50 | Dominated by all four; Sol low is +15.8 at 0.82x |
|  | high 35.1 / $0.36 | Codex Luna max 41.1 / $0.18 | Luna +6.0 at 0.5x |
|  | low 28.2 / $0.14 | Codex Luna max 41.1 / $0.18 | Cheapest row on the board, Luna +12.9 for +$0.04 |
| Vendor OSWorld [V S3] | high 61.3% / $0.18 | Luna max 48.9% / $0.20; Sonnet low 57.9% / $0.68 | Haiku +12.4 at 0.9x vs Luna; +3.4 at 0.26x vs Sonnet |
|  | max 72.4% / $0.61 | Sonnet low 57.9% / $0.68; Opus 5.5 low ~64% / ~$1.0 (chart) | Haiku +14.5 at 0.9x vs Sonnet low |
| Vendor GDPval-AA [V S3] | xhigh 1513 / $0.27 | Sonnet medium 1324 / $0.27 | Haiku +189 Elo at equal cost |
|  | high 1420 / $0.09 | Luna max 1437 / $0.09 | Tie |
| Vendor HLE [V S3, S5] | no tools xhigh 44.1% / $0.06 | Sonnet medium 43.2% / $0.03 | Sonnet cheaper |
|  | with tools max 57.4% | Opus 5.5 low 57.4% at ~1/10 of the cost (chart; Opus costs assume perfect cache hits) | Opus low dominates |
| Vendor DRACO [V S5, chart] | medium 72.4% (~$0.09) | Opus 5.5 low 72.5% (~$0.28); Sonnet 5.5 medium 71.2% (~$0.17) | Haiku medium cheapest; above medium dominated |
| Vendor TB4 [V S3] | medium 20.3% / $0.68 | Sonnet 5.5 medium 28.8% / $0.68; low 20.0% / $0.62 | Sonnet better at equal cost |
|  | max 39.2% / $2.64 | Sonnet 5.5 high 43.0% / $1.46 | Sonnet better at 0.55x |

Net: computer use and short, low-to-medium-effort knowledge or edit tasks favour Haiku 5.5; long-horizon terminal and multi-file feature work does not. [V S3, S5, B S6, V-first-party S7]

### F5. Cost bases: why AA's Haiku 5.5 dollars and the harness dollars differ [B S1, S6, V S2, S3, S7]

| Evidence | Value |
|---|---|
| Haiku 5.5 list price per MTok | input / cache write 5m / cache hit / output: $0.10 / $0.125 / $0.01 / $0.50 for prompts up to 100K tokens; $0.50 / $0.625 / $0.05 / $2.50 above (per request; the prompt length counts cache reads and writes) [V S2] |
| AA Intelligence Index price used | $0.10 / $0.50 only (output cost per task equals tokens x $0.50/MTok exactly), so the Index $ are the cheap tier [B S1] |
| Vendor GDPval-AA cost vs AA's per-eval cost, low to max | Haiku 5.5 x0.96 / 1.45 / 2.06 / 2.93 / 3.91; Sonnet 5.5 x1.05 / 0.85 / 0.90 / 0.96 / 0.99; Luna x1.05 / 1.18 / 0.94 / 1.09 / 1.01. Only Haiku diverges, and the gap grows with effort (longer contexts). Consistent with the long-prompt tier; the post does not state its cost method for this chart [V S3, B S1] |
| CAI average prompt per request (input tokens / steps) | Haiku 5.5 70K / 78K / 85K / 92K / 106K (low to max), Sonnet 5.5 52K / 56K / 71K / 89K / 102K, Sol 48K / 60K / 72K / 79K / 97K [B S6] |
| CAI Haiku 5.5 reported $ vs base-tier reconstruction from the row's own tokens | 2.4x (low) to 3.5x (max) higher (e.g. xhigh $0.61 vs $0.19-0.20 at the cheap tier, $0.96-0.99 if every request were over 100K). The same reconstruction is within about 10% for Sol and 20-30% below the reported figure for Sonnet 5.5, so treat it as +-30%; implied share of Haiku spend at the long-prompt tier is 37% (low) to 60% (max), or 25-43% if the Sonnet offset is applied [B S6, my reconstruction] |
| Same-effort cost ratio Haiku 5.5 : Sonnet 5.5, low / medium / high / xhigh / max | AA Index 0.07 / 0.10 / 0.09 / 0.06 / 0.04; vendor OSWorld 0.10 / 0.14 / 0.13 / 0.13 / 0.11; vendor GDPval 0.05 / 0.11 / 0.15 / 0.14 / 0.13; CursorBench 0.22 / 0.33 / 0.27 / 0.20 / 0.16; CAI 0.30 / 0.37 / 0.30 / 0.18 / 0.18; vendor TB4 0.68 / 1.00 / 0.71 / 0.40 / 0.25. List ratio: 0.05 cheap tier, 0.25 long-prompt tier [B S1, S6; V S2, S3; V-first-party S7] |

Practical formula for the real bill of a Haiku 5.5 worker: C_real = sum over requests of [in_nocache x p_in + cache_read x p_cr + cache_write x p_cw + out x p_out], with all four prices taken from the long-prompt tier for any request whose prompt exceeds 100K tokens. Rule of thumb from the table: budget Haiku 5.5 at 0.2-0.4x of Sonnet 5.5 at the same effort for agent work, not 0.05x. Haiku 5.5 uses much more output and more steps than Sonnet at the same effort (CursorBench 77K vs 37K tokens, 59 vs 41 steps at high; CAI 105K vs 41K tokens at high). [B S6, V-first-party S7]

### F6. Per model: quality peak, knee, degradation [B S1, S6; V S5; V-first-party S7] (FrontierCode values are chart readings, +-1)

| Model | Peak | Knee (F2 rule) | Evidence of degradation or no-gain above the knee |
|---|---|---|---|
| Claude Haiku 5.5 | AA: max (43.4); CAI: xhigh (41.4); CursorBench, FrontierCode, HealthBench Pro, PhysicianBench, OSWorld, GDPval, Bug Hunt Bench (11 / 12 / 16 / 18.3 / 21.5): max | xhigh (AA); medium to high for latency | CAI max 36.5 < xhigh 41.4, QnA 51.6 to 33.6, cost x4.2, 87 min, 990K output tokens; HealthBench Pro high 61.3 ~ xhigh 61.0; xhigh can end a multi-turn chat with no visible text (vendor); AA TTFAT 79 s (xhigh) and 310 s (max) |
| Claude Opus 5.5 | AA: max (57.6) | high (AA); medium on focused tasks | FrontierCode medium 54.6 > high 53.9 > xhigh 51.4 (Main), 65.3 / 65.2 / 63.5 (Extended); VulcanBench medium 90.9 ~ high 91.1 ~ xhigh 90.7 ~ max 90.2 (SE 0.6-1.1; Opus 4.8 fallback share 6-48%); CursorBench high = xhigh = 56.0; AA +1.6 for 1.73x at max, TTFAT 692 s; vendor: "tends to think more per turn ... especially at xhigh and max". Bug Hunt Bench still rises to max (41.7) |
| Claude Sonnet 5.5 | AA, CAI, CursorBench, VulcanBench (92.0), Bug Hunt Bench (51.3): max; FrontierCode: xhigh | xhigh | FrontierCode max 46.2 / 59.1 vs xhigh 52.1 / 64.4 with 11.7x the tokens; CAI max +5.5 for 4.3x cost and Bug Hunt max +15.3 for 3.6x; vendor: xhigh/max start own review rounds, a stop-after-done prompt "cut session cost by about a third, with no change in quality"; low can skip verification; VulcanBench low and medium cost no less than high |
| Claude Fable 5.1 | xhigh (53.2 = max 53.4) | xhigh | AA max +0.15 for x1.28; CursorBench xhigh 51.6 ~ max 51.8; vendor: at xhigh and max it may draft a long deliverable in thinking and write it again |
| GPT-6 Astra | AA: max (52.7), practical xhigh (52.4) | medium | AA max +0.3 for x1.41; VulcanBench +1.9 across all five efforts, cheapest at medium; Bug Hunt rises to max (45); TTFAT 6 s (medium) to 94 s (high) |
| GPT-6.1 Sol | AA: max (51.8), practical xhigh; CAI: xhigh (62.9); VulcanBench: xhigh (88.8); Bug Hunt: max (44.3) | high (AA), medium (CAI), high (VulcanBench) | CAI medium 61.4, high 60.1, xhigh 62.9, max 60.1 (SE ~1.6); VulcanBench max 88.3 < xhigh 88.8 (within SE); AA max +0.8 for x1.84; TTFAT 55 s (high) to 322 s (max); Bug Hunt keeps rising, so audit work pays for xhigh |
| GPT-6 Luna | max (38.1) | high; max also efficient | no degradation on AA (every step up adds 1.6-8.4); low unusable (21.5); Bug Hunt rises to max (18.3); TB4 16.4 and OSWorld 48.9 at max |
| Grok 4.7 | high = xhigh on AA (46.3 / 46.4) | high | AA xhigh +0.1 for x1.37; CursorBench keeps rising to xhigh (46.3 vs 43.9) |
| Kimi K3, GLM-5.3 | max (two AA points each) | unknown | low to max +13.5 / +10.5 index; GLM CursorBench 33.3 (low) / 38.0 (high) / 42.6 (max) |
| Gemini 3.8 Flash | high (40.9) | medium (39.8 at 0.75x cost) | high +1.2 for x1.33; CursorBench medium 37.3 / high 39.6 |

### F7. Vendor guidance per surface [V S2, S4, S8, S10; L S9]

| Model | Levels | Default API | Default Claude Code / Codex | Vendor start point (verbatim where quoted) |
|---|---|---|---|---|
| Haiku 5.5 | low, medium, high, xhigh, max | medium | medium (Claude Code) | "Claude Haiku 5.5 supports all five effort levels, and `medium` is the default." low = chat, short tool tasks, simple high-volume; high = knowledge work, longer agent tasks, strict instruction following; xhigh/max only where evals show a gain, and compare with Sonnet 5.5 |
| Opus 5.5 | five | medium | medium | Start at medium; "Reserve `xhigh` and `max` for work where you've measured a quality gain." |
| Sonnet 5.5 | five | high | medium | agentic coding: medium for well-specified tasks, high for harder or longer; chat and latency-sensitive: medium or low |
| Fable 5.1 | five | high | high | start at high, then test the others |
| GPT-6.1 Sol | low, medium, high, xhigh, max (Codex adds ultra) | medium | low (Codex) | xhigh: "Only use when your evals show a clear benefit that justifies the extra latency and cost"; `none` and `minimal` unsupported |
| GPT-6 Astra | same, Codex adds ultra | not stated in the pages read | low (Codex) | `none` unsupported |
| GPT-6 Luna | low to max; API also accepts none | medium | medium (Codex) | no Luna-specific text |
| Grok 4.7 | low, medium, high, xhigh | high | high | xhigh: "Maximum reasoning depth, with correspondingly higher latency"; reasoning cannot be disabled |
| K3, GLM-5.3, DeepSeek V4.1 Flash, MiMo V2.6 Pro, Gemini 3.8 Flash | not probed here (lane 2) | - | - | AA exposes K3 low/max, GLM low/max, DeepSeek max and non-reasoning, Gemini low/medium/high |

Claude Code facts: `/effort`, `--effort`, `CLAUDE_CODE_EFFORT_LEVEL`; `max` applies to the current session only unless set through the environment variable; Haiku 5.5 uses adaptive reasoning always; thinking cannot be turned off on Opus 5.5, Sonnet 5.5, Haiku 5.5 or Fable. Changing the top-level effort between requests invalidates the prompt cache; per-message effort (beta, Claude API and Google Cloud) keeps it. OpenAI's equivalent is a `configuration_update` input item; OpenAI also has `reasoning.mode: pro`, independent of effort and unmeasured. Subagent effort: `effort` frontmatter or a per-invocation parameter, "it can also pass an `effort` parameter for that invocation", overriding the frontmatter field. Haiku 5.5 guidance: moving from `low` to `medium` "roughly halved early stopping. It also more than doubled the output tokens for each attempt." Codex `ultra` = "Maximum reasoning with automatic task delegation": still no score or cost found anywhere. A Claude Code team member's single-person tests (Opus 5.5 builds: 1.5 / 4 / 11 / 67 min at low / medium / high / max for one app) and "interview at low, implement, then verify at high" workflow are anecdote, [V-adjacent S13].

### F8. Recommended effort per role per model (each tied to evidence above)

| Model | Role: effort (evidence) |
|---|---|
| Claude Opus 5.5 | architect: xhigh, max only as a single final gate (F1 56.0 at $3.46 vs 57.6 at $5.98, TTFAT 159 s vs 692 s; FrontierCode shows no gain above medium). orchestrator: high (F2 knee, 53.6 at $1.82, TTFAT 53 s); medium for chatty turns (default; per-message effort keeps the cache). long-horizon worker: high (CursorBench high = xhigh; FrontierCode medium >= high > xhigh; VulcanBench medium 90.9 ~ high 91.1 ~ xhigh 90.7; xhigh only for the vendor's >30 min class). grinder / bug hunt: xhigh or max only if staying Claude-only (Bug Hunt 36 at $34.98 and 41.7 at $58.53, both beaten by Codex Sol xhigh at $4.35). standard worker: medium (CursorBench 52.5 at $2.91; FrontierCode best point). reviewer: high. vision/computer use: high with a crop tool (vendor OSWorld 87.2% at max; no independent per-effort data). cheap worker: low (F1 42.3 at $0.55) only when staying Claude-only |
| Claude Sonnet 5.5 | long-horizon worker / grinder: xhigh (CAI 62.9 at $3.33 vs max 68.4 at $14.19; FrontierCode peak; CursorBench 53.1 at $2.81); max as an explicit gate for audit work (Bug Hunt 51.3 at $154 vs 36 at $42.86; VulcanBench 92.0 vs 90.2). standard worker: high (CAI medium to high +9.1 for x2.0; AA +5.9 for x1.83), medium only for well-specified or latency-bound tasks (TTFAT 1 s). cheap worker: low or medium with the stop-after-done and verify prompts (CAI low 42.1 at $0.48). reviewer: high. vision: high with a crop tool |
| Claude Fable 5.1 | reviewer, architect, orchestrator: high; never max (xhigh = max on AA and CursorBench); xhigh only when measured (AA +2.1 for x1.53) |
| Claude Haiku 5.5 | cheap/mechanical worker: medium (vendor default; AA 34.5 at $0.047, CursorBench 36.9 at $0.17, CAI 33.6 at $0.23); high for knowledge work, strict instruction following and longer agent prompts (CursorBench 42.3 at $0.32); xhigh for bulk or offline jobs where 79 s to first answer and ~26 min wall are acceptable (AA frontier point, CAI peak 41.4, CursorBench 44.3 at $0.56); low only for routing, classification, compaction (never in long agent prompts: skips checks and stops early); max never for agent coding (CAI 36.5 at $2.58), acceptable for a single QA-style call. vision/computer-use worker: high to xhigh with screenshot and crop tools (OSWorld 61.3% at $0.18 to 67.6% at $0.28; Chartography with tools beats no-tools max at low effort). reviewer, architect, long-horizon coding, bug hunt: not recommended (CAI, vendor TB4; Bug Hunt Bench 21.5 at max, $0.27 per fix vs Sol $0.06-0.13 and Luna $0.03) |
| GPT-6 Astra | architect second opinion: xhigh (52.4 at $2.31; max +0.3 for x1.41). reviewer: medium for latency (TTFAT 6 s) or high (50.9, 94 s). long-horizon worker: xhigh (leaderboard TB4 58.2 at max; no per-effort CAI). Codex default is low (45.8 at $0.82): raise it explicitly |
| GPT-6.1 Sol | standard and long-horizon implementation worker: medium (CAI 61.4 at $0.70; xhigh +1.5 is inside the noise for x1.5 cost; VulcanBench high 88.2 ~ xhigh 88.8); Codex default is low (57.2 at $0.50), so raising to medium is the cheapest real gain (+4.2 for x1.41). grinder / bug hunt / audit: xhigh (Bug Hunt 42.7 at $4.35 vs 36.5 at high and 44.3 at max for $5.88; beats Claude xhigh at roughly 0.1x the cost). cheap worker: low (CAI 57.2 at $0.50 beats every Haiku 5.5 setting by 15.8+ points). reviewer: high (AA +2.5 for x1.49 over medium). peer: high. max: only for audit work |
| GPT-6 Luna | cheap/mechanical worker: high (knee, 32.9 at $0.029) or max when time allows (38.1 at $0.068, CAI 41.1 at $0.18, TTFAT 113 s); not low; not for terminal tasks (TB4 16.4) |
| Grok 4.7 | peer for diversity: high (46.3 at $2.73; xhigh +0.1 on AA, +2.4 on CursorBench) |
| Kimi K3 | peer: max (only two AA points; low 30.1 to max 43.6) |
| GLM-5.3, DeepSeek V4.1 Flash, MiMo V2.6 Pro (opencode) | economy worker: GLM max (44.8 at $2.01), DeepSeek max (39.5 at $0.27; reasoning adds +14.8 over non-reasoning), MiMo single setting (46.3 at $0.133) |
| Gemini 3.8 Flash | economy worker: medium (39.8 at $0.93 vs high 40.9 at $1.24) |

Orchestrate-specific consequences: (a) `haiku` as a native subagent should be dispatched with an explicit effort (medium default, high for instruction-heavy work), via the per-invocation `effort` parameter or frontmatter, never inheriting a session `max`; (b) the Claude-only economy cheap-worker pick `haiku` is justified for narrow edits, computer use and summarisation, not for DeepSWE-class feature work, where Codex Sol low or Luna max beat it per dollar in the CAI; (c) Sol workers in Codex should be set to `medium` rather than left at Codex's `low` or raised to `xhigh` by default.

## Gaps

- No independent (non-Anthropic) per-effort data for Haiku 5.5 vision, long context or computer use. Every OSWorld, Chartography, BenchCAD, GDPval, TB4 and HLE sweep for it is vendor-run (GDPval-AA and AA-Briefcase were run by AA; FrontierCode by Cognition); Anthropic ran Luna, Sol and Sonnet itself. Cost methods differ across the vendor charts (perfect cache hits for Opus and Sonnet in HLE/DRACO/WANDR; per-request tier for Haiku).
- Cause of Haiku 5.5's CAI max drop is not documented. At max the mean run is 990K output tokens, 121 steps, 87 min vs 190K, 75, 26 min at xhigh, consistent with budget or time limits but unverified. The xhigh "empty reply" quirk is the vendor's, not shown in the CAI.
- No CI on AA Index or CAI scores; my 1.6-point standard error is a 0/1 approximation (about 909 attempts per row) and understates the variance of a mean of three evaluations with partial credit. Per-eval differences (QnA -18 on 124 tasks) are far outside it; composite differences of 2-3 points (Sol medium vs xhigh vs max; Haiku xhigh vs max, 4.9 points, about 2 SE) are not conclusive.
- The long-prompt-tier share of Haiku 5.5 spend is my reconstruction from the CAI rows' mean tokens, uncertain by roughly +-30% (it comes out 20-30% below the reported cost for Sonnet 5.5 and within 10% for Sol); AA does not publish its tier handling for the CAI or whether the Index applies it (the Index output cost matches the cheap tier exactly).
- FrontierCode and the other system-card figures are rasters read to about +-1 point; FrontierCode has no uncertainty intervals, so Opus 5.5's 54.6 vs 53.9 vs 51.4 and Sonnet 5.5's max < xhigh could partly be noise (the Sonnet gap is 5-6 points).
- CursorBench has no GPT-6 rows (GPT-5.6 only); Terminal-Bench and SWE-rebench list no Haiku 5.5 or per-effort pairs; LMArena does not name effort levels.
- Bug Hunt Bench and VulcanBench are single-author open benchmarks: Bug Hunt rows are 1-3 runs of 105 bugs (single-run rows, including Haiku 5.5 low and medium, are within the author's own noise of a median 1.8 points), costs are list estimates (Sonnet 5.5 priced before the 10-07 cache-read cut), and the judge is GPT-5.5 through Codex for every non-OpenAI arm. VulcanBench has 23 tasks, no stated harness in the CSVs, an unknown Sonnet 5.5 cost date, and no Haiku 5.5 rows yet. Both were found by lane 4 and verified here from the repos, not independently replicated.
- AA's Opus 5.5, Sonnet 5.5 and Fable 5.1 rows are "with fallback": VulcanBench measured up to 48% of Opus 5.5 max replies served by Opus 4.8 after safeguard fallbacks, so AA's Opus 5.5 high-and-above numbers may partly reflect another model. Not quantified for AA; Haiku 5.5 has no server-side fallback.
- AA does not list Grok 4.7 medium, K3 or GLM-5.3 medium/high, DeepSeek V4.1 Flash efforts or Gemini 4 Argon medium/low; the effort levels each harness (opencode variants, kimi, agy) really offers for K3, GLM, DeepSeek, MiMo and Gemini were not probed here (lane 2). Moonshot and Google effort guidance not found.
- Codex `ultra` and OpenAI `reasoning.mode: pro`: no benchmark, cost or latency anywhere found. Astra's API default effort was not stated in the pages read (Codex catalog says low).
- AA latency (TTFAT, E2E) are live medians; lane 3's table differs by 1-10% from the page records read here.
- Practitioner effort reports for Haiku 5.5: not covered here (lanes 4 and 5); one WebSearch found only a vendor-adjacent explainer (beam.ai) restating AA's 43 (max) vs 34 (default).
- The Claude Code blog post cited is a vendor-team member's n=1 tests on Opus 5.5 and Fable 5.1, not Haiku 5.5.

## Sources

Mark: RECHECK = re-run whenever a new model or effort level ships. All accessed 2026-10-13.

1. [S1] AA per-effort model pages, https://artificialanalysis.ai/models/<slug> for `claude-haiku-5-5[-xhigh|-high|-medium|-low]`, `claude-opus-5-5*`, `claude-sonnet-5-5*`, `claude-fable-5-1*`, `gpt-6-astra*`, `gpt-6-1-sol*`, `gpt-6-luna*`, `grok-4-7[-high|-low]`, `kimi-k3[-low]`, `glm-5-3[-low]`, `gemini-3-8-flash[-medium]`, `deepseek-v4-1-flash*`, `mimo-v2-6-pro`, `claude-4-5-haiku-reasoning` (unlabeled slug = top effort) - index with decimals, token counts, cost split by token type, speed, TTFAT, E2E, prices, release date, parsed from the embedded Next.js JSON - [B], Intelligence Index v4.3.2, no CI; RECHECK.
2. [S2] Anthropic docs (markdown): https://platform.claude.com/docs/en/build-with-claude/effort.md ; https://code.claude.com/docs/en/model-config.md ; https://code.claude.com/docs/en/sub-agents.md ; https://platform.claude.com/docs/en/about-claude/pricing.md - levels, defaults per model and surface, Haiku 5.5 long-prompt tier, subagent effort control - [V]; RECHECK.
3. [S3] Anthropic, "Introducing Claude Haiku 5.5", https://www.anthropic.com/claude-haiku-5-5 (Oct 7, 2026; the /news/ path 404s) and product page https://www.anthropic.com/claude/haiku - effort charts (exact points from SVG aria-labels), benchmark table, pricing, Sonnet 5.5 cache-read cut - [V], vendor-run with conflict of interest; RECHECK.
4. [S4] Anthropic prompting guides (markdown): https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-haiku-5-5.md ; .../prompting-claude-opus-5-5.md ; .../prompting-claude-sonnet-5-5.md ; .../prompting-claude-fable-5-1.md ; https://platform.claude.com/docs/en/models/haiku-5-5/whats-new-haiku-5-5.md - per-level behavior and guidance - [V]; Opus, Sonnet, Fable guidance unchanged since 2026-09-30; RECHECK.
5. [S5] Claude Haiku 5.5 System Card, https://www.anthropic.com/claude-haiku-5-5-system-card (144 pp.; figure pages rendered to `.orchestrate/raw/shots/r7-haiku55-syscard-p113..134-*.png`, zoom `r7-haiku55-syscard-p113-frontiercode-main-upper-zoom.png`) - effort sweeps (FrontierCode, HLE, DRACO, WANDR, Chartography, BenchCAD, OSWorld, HealthBench, PhysicianBench), cost methodology - [V]; FrontierCode by Cognition, GDPval/Briefcase by AA; RECHECK.
6. [S6] AA Coding Agent Index, https://artificialanalysis.ai/agents/coding-agents (39 rows with harness + model + effort; DeepSWE v1.1, Terminal-Bench 4.0, SWE-Atlas-QnA, equal weights; parsed from embedded JSON) - [B], no CI, version label not found on the page (09-30 file recorded v1.5); RECHECK.
7. [S7] Cursor, CursorBench 4.0, https://cursor.com/cursorbench (68 model-effort rows; changelog latest Oct 7, 2026) - [V-first-party], private tasks, Cursor harness; RECHECK.
8. [S8] OpenAI docs: https://developers.openai.com/api/docs/guides/reasoning.md ; https://developers.openai.com/api/docs/guides/latest-model/gpt-6-astra.md - effort levels, defaults, `none` support, pro mode, `configuration_update` - [V]; RECHECK.
9. [S9] Local probes: `~/.codex/models_cache.json` (client 0.160.0, fetched_at 2026-10-13T10:27:19Z; gpt-6.1-sol and gpt-6-astra default `low`, gpt-6-luna and gpt-6-sol `medium`, `ultra` on Sol/Astra/Sol) and `claude --version` = 2.1.296 - [L]; RECHECK.
10. [S10] xAI docs, https://docs.x.ai/developers/model-capabilities/text/reasoning and https://docs.x.ai/developers/grok-4-7 (page dated Oct 10, 2026) - Grok 4.7 effort levels and default - [V]; fetched, replaces the 09-30 search-summary source.
11. [S11] Terminal-Bench 4.0 leaderboard, https://www.tbench.ai/leaderboard/terminal-bench/4.0 (rendered with headless Chrome `--dump-dom`) - one effort per model, 95% CI - [B]; RECHECK for Haiku 5.5.
12. [S12] SWE-rebench, https://swe-rebench.com/ - no relevant rows - [B].
13. [S13] claude.dev blog, "Using Claude Code: Spending your effort", https://claude.dev/blog/spending-your-effort/ - [V-adjacent], n=1 anecdotes.
14. [S14] beam.ai, https://beam.ai/agentic-insights/claude-haiku-5-5-subagents - via WebSearch only, restates AA - not independent.
15. [S15] Baselines and inputs: `skills/orchestrate/references/shared-model-catalog.md`, `docs/research/model-selection/07-effort-curves.md` (2026-09-30), and lane 3's AA table dump `.orchestrate/raw/r3-aa-models.tsv` (read-only; used for slugs and cross-checks of index and cost).
16. [S16] Bug Hunt Bench, https://github.com/phuryn/bug-hunt-bench (README leaderboard updated Oct 8, 2026; `results/run-notes.md`; live board https://bughunt.productcompass.pm) - 174 rows with per-effort sweeps for Haiku 5.5, Sonnet 5.5, Opus 5.5, Fable 5.1, Sol 6.1, Astra, Luna, Grok 4.7; noise statement; Haiku 5.5 tier-pricing note - [B/P], single author, n=1-3 runs per row, blind judge; pointer from lane 4's board note; RECHECK.
17. [S17] VulcanBench Frontier v4, https://github.com/morganlinton/VulcanBench (`docs/results/swe-v4-sonnet55-2026-10/sonnet55-vs-frontier-efforts.csv`, `docs/results/swe-v4-gpt6-vs-gpt56-2026-09/gpt61sol-opus55-astra-efforts.csv`; README for the scoring formula) - per-effort combined score +- SE, USD per task, minutes, tasks passed, Opus 4.8 fallback share - [B/P], 23 tasks; pointer from lane 4's board note; RECHECK for Haiku 5.5 rows.
