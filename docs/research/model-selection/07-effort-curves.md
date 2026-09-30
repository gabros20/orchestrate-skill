# 07 - Effort curves (research lane 8)

Run date 2026-09-30 (page reads 09:35-09:45 CEST). All numbers seen 2026-09-30. Grades: [B] independent, [V] vendor,
[P] practitioner, [L] local. Artificial Analysis (AA) per-model pages were read as HTML text (each effort variant has
its own URL, e.g. `/models/claude-opus-5-5-high`); the TTFT/E2E columns come from the AA table screenshots already on disk
(`aa-models-c0..c3.png`, lane 3). AA index = Intelligence Index v4.3.2. CursorBench 4.0 = Cursor's own first-party bench
(private tasks), read from its public page text [V-first-party, S3].

Formulas (used everywhere below):
- **Cost multiplier (cx)** = AA "cost per Intelligence Index task" at effort E / same at the model's default effort.
- **Token multiplier (tx)** = AA "output tokens from Intelligence Index" at E / same at the default.
- **Marginal pt per $** = (index(E) - index(E-1)) / (cost(E) - cost(E-1)). Knee = last step where a step buys >=3 points for <=1.5x cost, or (cheap models) where marginal pt/$ stays well above ~3.
- Not `tokens x price`: AA cost is a weighted per-task figure including input/cache, so cost grows slower than output tokens (Opus 5.5 max: 6.8x tokens, 4.5x cost). Do not multiply tokens by list price.
- Defaults used as the reference: Opus 5.5 = medium, Sonnet 5.5 / Fable 5.1 = high [V S4]; GPT-6 Astra / 6.1 Sol / Luna = medium (OpenAI: "medium (default)" for 6.1 Sol [V S6]; the Codex catalog lists Astra/6.1-Sol default `low` [L lane 2], so a Codex user must use the low column as reference); Grok 4.7 = high [V lane 2]; Kimi K3 and Gemini 3.8 Flash: only two/three points exist.
- Every Claude row on AA is labelled "with fallback" (falls back to another Claude model on classifier blocks) [B S2].

## Summary

- Quality rises monotonically but concavely in every model; cost rises convexly. Nearly all of the value is in low->medium->high; xhigh and max buy 0-4 index points for 1.2-2.8x more cost per step. Opus 5.5: medium->high +3 pt for 1.36x, high->xhigh +2 for 1.9x, xhigh->max +2 for 1.7x. [B S2]
- Quality peak is at the top setting for Opus 5.5 (58 at max), Sonnet 5.5 (56), Astra (53), 6.1 Sol (52), Luna (37), Kimi K3 (44); no clean AA degradation at max for those. Exceptions: Fable 5.1 xhigh = max = 53 (max costs 1.28x more, +0 pt), Grok 4.7 high = xhigh = 46 (xhigh 1.37x cost, +0 pt). [B S2]
- Best knee per dollar: Opus 5.5 medium->high (54 at $1.82 vs 51 at $1.34); GPT-6.1 Sol high (50 at $0.32; xhigh +1 for +$0.07 is still cheap, max +1 for +$0.33 is not); Astra medium/high (high +1 pt for +$0.19); Sonnet 5.5 high (47 at $1.08; next step +5 for 2.5x); Fable 5.1 low/medium. [B S2]
- Sonnet 5.5 is a poor buy at high effort: it needs xhigh (52, $2.74) to match Opus 5.5 medium (51, $1.34), and max (56, $7.60) costs more than Opus 5.5 xhigh (56, $3.46) for the same index. On CursorBench Opus 5.5 medium (52.5, $2.91) ~ Sonnet 5.5 xhigh (53.1, $3.88). [B S2, V-fp S3]
- Opus 5.5 low (AA 42, $0.55) is on par with Sonnet 5.5 medium (41, $0.59), consistent with r/ClaudeCode "Opus 5.5 Low is one point better than Sonnet 5.5 medium and is ~10% cheaper" [P lane 5, R12]. [B S2]
- Latency is the hidden cost of the top levels: time to first chunk at max is 115-694 s on AA (Opus 5.5 max 694 s, Sonnet 5.5 max 407 s, Astra max 291 s, Fable 5.1 max 276 s) vs 1-30 s at low/medium. Interactive roles must not use max. [B lane 3 S1]
- Anthropic documents over-thinking / over-engineering behavior: Sonnet 5.5 at xhigh/max "can start its own rounds of review and verification, sometimes with subagents" and make related fixes; a prompt line cut "session cost by about a third, with no change in quality". Opus 5.5 "tends to think more per turn than Claude Opus 5, especially at xhigh and max". Opus 4.7 (older) guidance: max "can lead to overthinking". Low-end risk: Sonnet 5.5 at low can skip verification; at low/medium it "sometimes checks in before the work is done". [V S4, S5, S7]
- Codex `ultra` ("Maximum reasoning with automatic task delegation") has no quality or cost number anywhere found; unmeasured. [L lane 2; gap]

## Findings

### F1. Model x effort matrix (AA Intelligence Index v4.3.2, 2026-09-30) [B, S2]

Columns: index; $ per task; output tokens for the whole index run; cx / tx vs the model default (`*`); output tok/s; TTFT and end-to-end (E2E) seconds (AA table screenshots, lane 3; `?` = row not in the screenshots).

| Model | Effort | Index | $/task | Tokens | cx | tx | tok/s | TTFT s | E2E s |
|---|---|---|---|---|---|---|---|---|---|
| Claude Opus 5.5 | low | 42 | 0.55 | 20M | 0.41 | 0.53 | 72.2 | 14.3 | 21.2 |
| | medium* | 51 | 1.34 | 38M | 1.00 | 1.00 | 73.2 | 24.2 | 31.0 |
| | high | 54 | 1.82 | 53M | 1.36 | 1.39 | 73.8 | 33.2 | 40.0 |
| | xhigh | 56 | 3.46 | 100M | 2.58 | 2.63 | 79.5 | 129.8 | 136.0 |
| | max | 58 | 5.98 | 260M | 4.46 | 6.84 | 92.2 | 694.0 | 699.4 |
| Claude Sonnet 5.5 | low | not benchmarked ("N/A") | - | - | - | - | 85.9 | ? | ? |
| | medium | 41 | 0.59 | 29M | 0.55 | 0.58 | 90.4 | 1.3 | 6.9 |
| | high* | 47 | 1.08 | 50M | 1.00 | 1.00 | 91.5 | 14.5 | 19.9 |
| | xhigh | 52 | 2.74 | 100M | 2.54 | 2.00 | 103.0 | 33.5 | 38.4 |
| | max | 56 | 7.60 | 410M | 7.04 | 8.20 | 138.8 | 407.2 | 410.8 |
| Claude Fable 5.1 | low | 47 | 2.37 | 33M | 0.61 | 0.53 | 47.7 | 4.6 | 15.0 |
| | medium | 49 | 2.98 | 44M | 0.76 | 0.71 | 50.2 | 8.4 | 18.3 |
| | high* | 51 | 3.91 | 62M | 1.00 | 1.00 | 51.0 | 29.0 | 38.8 |
| | xhigh | 53 | 5.98 | 120M | 1.53 | 1.94 | 61.2 | 108.0 | 116.2 |
| | max | 53 | 7.63 | 190M | 1.95 | 3.06 | 69.3 | 276.4 | 283.6 |
| Claude Opus 5 (previous) | high* | 48 | 3.61 | 81M | 1.00 | 1.00 | 52.6 | ? | ? |
| | xhigh | 50 | 4.88 | 110M | 1.35 | 1.36 | 50.7 | ? | ? |
| | max | 51 | 5.86 | 140M | 1.62 | 1.73 | 54.5 | ? | ? |
| GPT-6 Astra | low | 46 | 0.82 | 10M | 0.53 | 0.53 | 45.5 | 3.0 | 14.0 |
| | medium* | 50 | 1.54 | 19M | 1.00 | 1.00 | 45.4 | 5.9 | 16.9 |
| | high | 51 | 1.73 | 26M | 1.12 | 1.37 | 46.8 | 49.8 | 60.5 |
| | xhigh | 52 | 2.31 | 38M | 1.50 | 2.00 | 49.3 | 126.3 | 136.4 |
| | max | 53 | 3.26 | 60M | 2.12 | 3.16 | 55.1 | 291.0 | 300.1 |
| GPT-6.1 Sol | low | 42 | 0.13 | 9.0M | 0.62 | 0.60 | 68.0 | ? | ? |
| | medium* | 48 | 0.21 | 15M | 1.00 | 1.00 | 59.4 | 5.7 | 14.1 |
| | high | 50 | 0.32 | 25M | 1.52 | 1.67 | 64.9 | 58.0 | 65.7 |
| | xhigh | 51 | 0.39 | 36M | 1.86 | 2.40 | 63.9 | 69.2 | 77.0 |
| | max | 52 | 0.72 | 67M | 3.43 | 4.47 | 69.3 | 205.9 | 213.1 |
| GPT-6 Sol (superseded 09-29) | low / med / high / xhigh / max | 34 / 40 / 43 / 44 / 48 | 0.13 / 0.25 / 0.38 / 0.52 / 1.05 | 8.9 / 16 / 25 / 40 / 77M | 0.52 / 1 / 1.52 / 2.08 / 4.20 | 0.56 / 1 / 1.56 / 2.50 / 4.81 | 68.4 / ? / 65.9 / 70.3 / 76.0 | max 185.7, others ? | ? |
| GPT-6 Luna | low | 21 | 0.0045 | 8.1M | 0.22 | 0.28 | 124.4 | ? | ? |
| | medium* | 29 | 0.02 | 29M | 1.00 | 1.00 | unread | ? | ? |
| | high | 32 | 0.03 | 47M | 1.50 | 1.62 | 123.7 | 15.2 | 19.2 |
| | xhigh | 34 | 0.04 | 69M | 2.00 | 2.38 | 131.2 | 20.1 | 23.9 |
| | max | 37 | 0.07 | 140M | 3.50 | 4.83 | 145.2 | 115.0 | 118.4 |
| Grok 4.7 | high* | 46 | 2.73 | 200M | 1.00 | 1.00 | 75.8 | 30.7 | 37.3 |
| | xhigh | 46 | 3.74 | 240M | 1.37 | 1.20 | 77.0 | 79.8 | 86.3 |
| | low / medium | not on AA | - | - | - | - | - | - | - |
| Kimi K3 | low | 30 | 1.15 | 22M | 0.58 (vs max) | 0.14 (vs max) | 38.2 | ? | ? |
| | max | 44 | 2.00 | 160M | 1.00 | 1.00 | 36.3 | 4.0 | 72.9 |
| | medium / high | not on AA | - | - | - | - | - | - | - |
| Gemini 3.8 Flash | low | 33 | n/a | n/a | - | - | - | - | - |
| | medium | 40 | 0.93 | 95M | 0.75 | 0.56 | unread | ? | ? |
| | high* | 41 | 1.24 | 170M | 1.00 | 1.00 | 242.1 | 20.8 | 22.8 |

Notes: TTFT and E2E are wall-clock medians over the whole index (multi-step agentic tasks), not single-turn latency; Opus 5.5 low (14.3 s) lower than medium (24.2 s) as read. Kimi K3 low vs max: 7.3x the tokens for +14 index points and 1.74x the cost, the steepest effort-to-quality slope on the board (K3's per-token price is low). Gemini thinking levels on AA exist for 3.8 Flash only (low/medium/high); no Gemini Pro row on 2026-09-30 (`gemini-3-8-pro` slug returns nothing). [B S2]

### F2. Marginal return per effort step (derived from F1) [B, S2]

| Model | Step | +index | cost x | +$ | pt per $ |
|---|---|---|---|---|---|
| Opus 5.5 | low->medium | +9 | 2.44 | +0.79 | 11.4 |
| | medium->high | +3 | 1.36 | +0.48 | 6.2 |
| | high->xhigh | +2 | 1.90 | +1.64 | 1.2 |
| | xhigh->max | +2 | 1.73 | +2.52 | 0.8 |
| Sonnet 5.5 | medium->high | +6 | 1.83 | +0.49 | 12.2 |
| | high->xhigh | +5 | 2.54 | +1.66 | 3.0 |
| | xhigh->max | +4 | 2.77 | +4.86 | 0.8 |
| Fable 5.1 | low->medium | +2 | 1.26 | +0.61 | 3.3 |
| | medium->high | +2 | 1.31 | +0.93 | 2.2 |
| | high->xhigh | +2 | 1.53 | +2.07 | 1.0 |
| | xhigh->max | 0 | 1.28 | +1.65 | 0.0 |
| GPT-6 Astra | low->medium | +4 | 1.88 | +0.72 | 5.6 |
| | medium->high | +1 | 1.12 | +0.19 | 5.3 |
| | high->xhigh | +1 | 1.34 | +0.58 | 1.7 |
| | xhigh->max | +1 | 1.41 | +0.95 | 1.1 |
| GPT-6.1 Sol | low->medium | +6 | 1.62 | +0.08 | 75 |
| | medium->high | +2 | 1.52 | +0.11 | 18 |
| | high->xhigh | +1 | 1.22 | +0.07 | 14 |
| | xhigh->max | +1 | 1.85 | +0.33 | 3.0 |
| GPT-6 Luna | low->medium | +8 | 4.4 | +0.016 | ~500 |
| | medium->high | +3 | 1.5 | +0.01 | ~300 |
| | high->xhigh | +2 | 1.33 | +0.01 | ~200 |
| | xhigh->max | +3 | 1.75 | +0.03 | ~100 |
| Opus 5 | high->xhigh, xhigh->max | +2, +1 | 1.35, 1.20 | +1.27, +0.98 | 1.6, 1.0 |
| Grok 4.7 | high->xhigh | 0 | 1.37 | +1.01 | 0.0 |
| Gemini 3.8 Flash | medium->high | +1 | 1.33 | +0.31 | 3.2 |

AA shows integer index points, so each row carries about +-0.5 rounding error: a +1 step is within noise; +0 steps (Fable 5.1 xhigh->max, Grok 4.7 high->xhigh) are the only clear no-gain cases. No CI on the pages read. Luna costs are rounded to cents by AA, so its pt/$ values are order-of-magnitude only. [B S2]

### F3. Second effort curve: CursorBench 4.0 (score %, cost per task, tokens per task) [V-first-party, S3]

Cursor runs every model at every effort on the same private agentic tasks in its own harness. Task mix differs from AA, so this corroborates shape rather than level. Changelog: latest task update 2026-09-10. No GPT-6 rows (GPT-5.6, superseded, only).

| Model | low | medium | high | xhigh | max |
|---|---|---|---|---|---|
| Opus 5.5 | 43.7 / $1.17 / 15.8k | 52.5 / $2.91 / 38.0k | 56.0 / $3.97 / 53.1k | 56.0 / $6.98 / 101.1k | 57.8 / $13.43 / 218.4k |
| Sonnet 5.5 | 35.8 / $0.50 / 11.7k | 39.2 / $0.70 / 16.0k | 47.8 / $1.67 / 37.4k | 53.1 / $3.88 / 100.2k | 55.5 / $9.67 / 271.9k |
| Fable 5.1 | 45.1 / $5.44 / 34.8k | 46.8 / $7.05 / 45.4k | 49.2 / $9.08 / 58.4k | 51.6 / $13.01 / 87.3k | 51.8 / $17.28 / 117.2k |
| Opus 5 | 40.7 / $4.87 | 43.3 / $6.94 | 44.7 / $9.00 | 46.1 / $11.43 | 46.6 / $11.95 |
| Sonnet 5 | 24.1 / $1.39 | 28.0 / $2.31 | 30.8 / $3.48 | 32.0 / $4.55 | 34.1 / $7.17 |
| Grok 4.7 | 33.1 / $1.58 / 15.7k | 41.6 / $3.49 / 36.7k | 43.9 / $4.69 / 56.4k | 46.3 / $6.01 / 70.1k | - |
| GPT-5.6 Sol | 24.6 / $0.87 | 31.1 / $1.77 | 35.7 / $2.85 | 37.7 / $4.40 | 41.7 / $8.23 |
| GPT-5.6 Luna | 16.0 / $0.03 | 22.2 / $0.08 | 29.4 / $0.25 | 33.0 / $0.44 | 35.9 / $1.03 |
| Gemini 3.8 Flash | - | 37.3 / $4.06 | 39.6 / $4.70 | - | - |
| GLM 5.3 | 33.3 / $2.04 | - | 38.0 / $3.24 | - | 42.6 / $5.05 |
| Muse Spark 1.3 | 29.3 / $0.93 (minimal 24.3 / $0.56) | 32.6 / $1.49 | 33.4 / $1.66 | 37.5 / $2.10 | 41.6 / $2.64 |

CursorBench cost multipliers vs default: Opus 5.5 (medium $2.91): low 0.40x, high 1.36x, xhigh 2.40x, max 4.62x. Sonnet 5.5 (high $1.67): medium 0.42x, xhigh 2.32x, max 5.79x. Fable 5.1 (high $9.08): low 0.60x, xhigh 1.43x, max 1.90x. Grok 4.7 (high $4.69): low 0.34x, xhigh 1.28x.

Readings AA cannot give: (1) Opus 5.5 high and xhigh tie (56.0) while xhigh costs 1.76x; only max adds +1.8 at 3.4x high's cost. (2) Sonnet 5.5's curve does not flatten until max (35.8, 39.2, 47.8, 53.1, 55.5) whereas Opus 5.5's flattens at high (43.7, 52.5, 56.0, 56.0, 57.8). (3) Fable 5.1 is 3x-5x more expensive per task than Opus 5.5 at every level for lower scores here (Fable max 51.8 $17.28 vs Opus 5.5 medium 52.5 $2.91).

### F4. Vendor effort claims (no plotted-point charts were extractable)

Anthropic Opus 5.5 launch post (https://www.anthropic.com/news/claude-opus-5-5, read via WebFetch summary 2026-09-30; a headless screenshot rendered blank, so chart points beyond the quoted text were not read; treat as [V], tool-summarized, quote-check before relying) [V, S8]:
- Terminal-Bench 4.0: Opus 5.5 xhigh 66.4%; default (medium) "beats Opus 5 at max effort for ~1/5 the cost" (summary paraphrase).
- FrontierCode v1.1: "At default effort (medium), Opus 5.5 scores 54.6%, higher than all other models, beating GPT-6 Astra's top score (53.3%) for about a fifth of the cost per task."
- CursorBench: "At default effort (medium), Opus 5.5 scores 52.5%, compared to 51.8% for Fable 5.1 (max) and 46.6% for Opus 5 (max)." Matches S3 exactly (52.5 / 51.8 / 46.6).
- GDPval-AA v2.1: Opus 5.5 max 1846 Elo.
- Customer quotes (vendor-selected): "At its lowest effort setting, Claude Opus 5.5 beat Opus 5 at high effort on our BigFinance Bench with about 60% fewer output tokens."; "Even at its lowest effort setting, Claude Opus 5.5 caught 72% of known bugs in our code reviews to Opus 5's 56% at high effort."

Anthropic docs:
- Opus 5.5 guide [V S5]: "Claude Opus 5.5 at `medium` matches or exceeds Claude Opus 5 at `high` on coding and knowledge-work evaluations, and on several coding evaluations `low` comes close to it at much lower cost." Also: "At a given level, Claude Opus 5.5 tends to think more per turn than Claude Opus 5, especially at `xhigh` and `max`."
- Effort levels table [V S4]: xhigh = "Long-running agentic and coding tasks (over 30 minutes) with token budgets in the millions"; low = "Simpler tasks that need the best speed and lowest costs, such as subagents"; medium = "Agentic tasks that require a balance of speed, cost, and performance".
- Sonnet 5.5 guide [V S4]: for agentic coding "start at `medium` for well-specified tasks and move to `high` for harder or longer ones"; "Reserve `xhigh` and `max` for work where you've measured a quality gain"; at xhigh/max "the model is especially thorough. After it finishes a task, it can start its own rounds of review and verification"; a stop-after-done prompt "cut session cost by about a third, with no change in quality".
- Fable 5.1 guide [V S6a]: "At `medium`, results roughly match Claude Fable 5 at lower cost"; "At `low`, Claude Fable 5.1 is often competitive with Claude Opus and Claude Sonnet models on cost per task while scoring higher". AA does not support the cost half against Opus 5.5: Fable low 47 at $2.37 vs Opus 5.5 low 42 at $0.55 (4.3x the cost).
- Sonnet 5.5 vision [V S4]: "with tools at `high` effort, the model read charts more accurately than without tools at `max` effort, at a fraction of the cost."

OpenAI [V S6, WebFetch summaries]: low "Ideal for use cases requiring tool-use, planning, search, or multi-step decision making"; medium "Default configuration for most workloads"; xhigh "Deep research, asynchronous workflows and agentic tasks that require long runs. Only use when your evals show a clear benefit."; starts: "Data analysis, drafting, coding, support: Start with low", "Agentic coding, research, spreadsheets: Use medium", "Complex debugging, security review: Consider high or xhigh"; effort is "a tuning knob, not the primary way to recover quality" (paraphrase). API docs list five levels and say `none` is unsupported for Astra and 6.1 Sol (differs from lane 1's note that Sol/Luna support none; recheck).

xAI: four levels low/medium/high (default)/xhigh [V per WebSearch summary of docs.x.ai, not fetched]. Only CursorBench gives per-level data (above). Moonshot, Google: no effort guidance found.

### F5. Effort-labelled entries on other boards (no same-model multi-effort pairs)

| Board | Entry | Score / cost | Grade | Source |
|---|---|---|---|---|
| Terminal-Bench 4.0 (tbench.ai, 2026-09-30) | GPT-6 Astra max, Codex | 58.2 +-2.8, 1.5B tok, $3.3k | [B] | lane 3 |
| | Fable 5.1 max, Claude Code | 57.9 +-3.8, 2.7B tok, $6.2k | [B] | lane 3 |
| | Opus 5 xhigh, Claude Code | 53.9 +-3.2, 6.9B tok, $6.1k | [B] | lane 3 |
| | Grok 4.7 xhigh, Grok Build | 37.6 +-3.5, 5.5B tok, $3.7k | [B] | lane 3 |
| | GPT-5.6 Luna max, Codex | 17.3 +-2.8, 11.6B tok, $0.3k | [B] | lane 3 |
| AA Coding Agent Index v1.5 | Claude Code + Sonnet 5.5 max 68 ($14.2); Opus 5.5 max 66 ($13.0); Codex + 6.1 Sol xhigh 63 ($1.04); Codex + Astra max 62 ($7.47); Grok Build + Grok 4.7 xhigh 56 ($8.82) | one effort per harness+model | [B] | S9 |

The Coding Agent Index lists one effort per harness+model, so how effort behaves inside Claude Code or Codex is measured only by CursorBench (vendor harness). Sonnet 5.5 max used 27.7M tokens per Coding Agent task [B S9]. Recommendation drawn from these rows must therefore lean on AA's index curve.

### F6. Cross-model comparisons at equal cost (AA cost per Index task) [B, S2]

| Cost band | Configs (index) | Read |
|---|---|---|
| ~$0.07-0.13 | Luna max 37 ($0.07); 6.1 Sol low 42 ($0.13) | Sol low is +5 for ~1.9x. |
| ~$0.2-0.4 | 6.1 Sol medium 48 ($0.21); high 50 ($0.32); xhigh 51 ($0.39) | No Anthropic, xAI or Google config is within 4x of this cost at this score. |
| ~$0.55-0.75 | Opus 5.5 low 42 ($0.55); Sonnet 5.5 medium 41 ($0.59); 6.1 Sol max 52 ($0.72) | Sol max beats Opus 5.5 low by 10 points at 1.3x cost; Opus low ~ Sonnet medium. |
| ~$0.8-1.3 | Astra low 46 ($0.82); Sonnet 5.5 high 47 ($1.08); Gemini 3.8 Flash high 41 ($1.24); Opus 5.5 medium 51 ($1.34) | Opus 5.5 medium best Anthropic point. |
| ~$1.5-1.9 | Astra medium 50 ($1.54); Astra high 51 ($1.73); Opus 5.5 high 54 ($1.82) | Opus 5.5 high leads by 3-4 points. |
| ~$2.0-2.8 | Kimi K3 max 44 ($2.00); Astra xhigh 52 ($2.31); Fable 5.1 low 47 ($2.37); Sonnet 5.5 xhigh 52 ($2.74); Grok 4.7 high 46 ($2.73) | Fable low, Grok high, K3 max are dominated by Opus 5.5 high (54, $1.82). |
| ~$3.3-3.9 | Astra max 53 ($3.26); Opus 5.5 xhigh 56 ($3.46); Fable 5.1 high 51 ($3.91); Grok 4.7 xhigh 46 ($3.74) | Opus 5.5 xhigh leads. |
| ~$6-7.6 | Opus 5.5 max 58 ($5.98); Fable 5.1 xhigh 53 ($5.98); Sonnet 5.5 max 56 ($7.60); Fable 5.1 max 53 ($7.63) | Fable 5.1 is dominated on AA at equal cost; any case for it rests on non-AA behavior (planning/long-horizon, [P lane 5]). |

Brief's named triple: Luna@max (37, $0.07) vs Sol@low (42, $0.13) vs Sonnet 5.5@medium (41, $0.59): Sol low dominates Sonnet 5.5 medium (higher score at 0.22x the cost); Luna max is cheaper but 5 points lower. [B S2]

### F7. Per model: peak, knee, degradation

| Model | Quality peak effort | Knee | Degradation / over-spend evidence | Grade |
|---|---|---|---|---|
| Claude Opus 5.5 | max on AA (58); high = xhigh on CursorBench (56.0), max 57.8 | medium->high (AA +3 for 1.36x; CB +3.5 for 1.36x) | xhigh->max +2 (AA) / +1.8 (CB) for 1.7x / 1.9x; CB xhigh adds nothing over high; vendor: thinks more at xhigh/max | [B S2, V-fp S3, V S5] |
| Claude Sonnet 5.5 | max (56 AA; 55.5 CB) | medium->high (AA +6 for 1.83x); xhigh if quality-gated | max 410M tokens (8.2x high) for +4; thoroughness at xhigh/max spawns review rounds; low may skip verification; low/medium check in early | [B S2, V S4] |
| Claude Fable 5.1 | xhigh (53 = max) | low->medium (+2 for 1.26x); nothing above high is efficient | xhigh = max on AA at 1.28x cost; CB xhigh 51.6 ~ max 51.8 at 1.33x | [B S2, V-fp S3] |
| GPT-6 Astra | max (53) | medium->high (+1 for 1.12x); medium is the practical knee | each step above high is +1 pt for 1.3-1.4x; TTFT 50 s high, 126 s xhigh, 291 s max | [B S2] |
| GPT-6.1 Sol | max (52) | high (50 at $0.32); xhigh still cheap | max +1 pt for 1.85x cost, TTFT 206 s vs 69 s at xhigh | [B S2] |
| GPT-6 Luna | max (37) | high or xhigh (pennies) | low unusable (21); TTFT 115 s at max vs 15-20 s at high/xhigh | [B S2] |
| Grok 4.7 | high = xhigh on AA (46); xhigh 46.3 vs high 43.9 on CB | high on AA; medium->high on CB (+2.3 for 1.34x) | AA xhigh +0 for 1.37x | [B S2, V-fp S3] |
| Kimi K3 | max (44); no medium/high data | unknown (two points) | low 30 -> max 44: large headroom | [B S2] |
| Gemini 3.8 Flash | high (41) | medium (40 at 0.75x cost, 0.56x tokens) | high +1 for 1.33x, 1.8x tokens | [B S2] |

### F8. Recommended effort per role per model (each tied to evidence)

| Role | Recommended | Alternatives | Evidence |
|---|---|---|---|
| Architect / reasoner | Claude Opus 5.5 xhigh (AA 56, $3.46, TTFT 130 s); max only for one hard decision (58, $5.98, TTFT 694 s) | GPT-6 Astra xhigh (52, $2.31) or max (53, $3.26) as second opinion; Fable 5.1 high (51, $3.91) only if judgement style beats index [P lane 5] | F1, F2, F7; OpenAI xhigh "Only use when your evals show a clear benefit" |
| Orchestrator / planner | Opus 5.5 medium (default; 51, $1.34, TTFT 24 s) or high (54, $1.82, 33 s) | 6.1 Sol high (50, $0.32, 58 s); Sonnet 5.5 medium only if TTFT < 10 s matters (1.3 s, index 41) | F1; Anthropic: Opus 5.5 "Start at medium"; per-message effort keeps the cache, so an orchestrator can run routine turns low and planning turns high [V S4] |
| Long-horizon worker | Opus 5.5 high, xhigh for >30 min tasks; Codex + GPT-6.1 Sol xhigh as the cost-efficient worker (CAI 63 at $1.04) | Astra xhigh/max (TB4 58.2 at max); Fable 5.1 xhigh | Anthropic xhigh row "over 30 minutes"; F1 knees; AA CAI [V S4, B S3/S9] |
| Reviewer | Different family from the author, at high: Opus 5.5 high or Astra high (54 / 51); Sol high as cheap reviewer (50, $0.32) | Opus 5.5 low for first-pass screening (vendor customer: low caught "72% of known bugs") | F1; if using Sonnet 5.5 at xhigh/max, add the "don't launch reviewer sub-agents" line [V S4] |
| Cheap / mechanical worker | 6.1 Sol low or medium (42 / 48 at $0.13 / $0.21); Luna high/xhigh for trivial edits (32-34 at $0.03-0.04) | Opus 5.5 low (42, $0.55) inside Claude Code; Sonnet 5.5 medium (41, $0.59, TTFT 1.3 s) for latency | F6; Anthropic: low for "subagents"; Sonnet 5.5 at low needs the verification prompt [V S4] |
| Vision / computer-use worker | Opus 5.5 medium with a crop/zoom tool (vendor: default effort matched Opus 5's success at "a much higher effort setting" on computer use) | Astra high/xhigh for browser/CAD [P lane 5]; Sonnet 5.5 high with a crop tool | Vendor guides [V S4, S5]; no independent per-effort vision data (gap) |
| Peer | Other vendor, same tier as architect: Astra xhigh, or 6.1 Sol xhigh (cheap) | Grok 4.7 high (46, $2.73) for diversity only; price-dominated | F6 |

Codex note: Codex catalog defaults Astra and 6.1 Sol to `low` [L lane 2], the 0.53x / 0.62x point of the curve (Astra low 46, Sol low 42). Setting medium/high costs 1.9x/2.1x (Astra) or 1.6x/2.4x (Sol) for +4/+5 (Astra) or +6/+8 (Sol) index points, so raise effort explicitly for worker roles that need quality. Practitioner split on Astra vs Opus 5.5 is contested [P lane 5].

## Gaps

- Codex `ultra` ("automatic task delegation"): no benchmark, cost or doc quote found; the OpenAI API docs list five levels, `ultra` appears only in the local Codex catalog (lane 2).
- Sonnet 5.5 low has no AA index/cost ("N/A"; CursorBench has 35.8 / $0.50). Grok 4.7 low/medium and Kimi K3 medium/high are not on AA (Grok has CursorBench low/medium). Gemini 3.8 Flash low has an index (33) but no cost/tokens; no Gemini Pro data on AA.
- AA index is integer-rounded with no CI on the pages read; +1 steps are within noise. AA Coding Agent Index has one effort per row, so real in-harness effort curves are measured only by CursorBench (Cursor harness, vendor-run).
- Vendor plotted charts not transcribed: Anthropic post read only via WebFetch summary (screenshot blank); Sonnet 5.5 launch post URL 404; no OpenAI, xAI, Moonshot or Google effort charts located.
- Latency `?` cells were not in lane 3's screenshots. AA Claude rows include the "fallback" behavior.
- No independent evidence of accuracy DEGRADATION above a level for current models; only over-spend / no-gain (Fable 5.1 xhigh->max, Grok 4.7 high->xhigh, CursorBench Opus 5.5 high->xhigh). Overthinking / over-engineering evidence is vendor prose (Anthropic guides; Opus 4.7 statement is older-model).
- Opus/Sonnet/Fable/Astra/Sol `max` rows live on the unlabeled AA slug (the `-max` slug 404s); Haiku 4.5 has no effort control.
- xAI effort levels and AA's Grok compare-page latency figures are from WebSearch summaries, not fetched pages.

## Sources

Mark: RECHECK = re-run when a new model or effort level ships.

1. [S1] AA models table screenshots (lane 3) `.orchestrate/raw/shots/aa-models-c0..c3.png` - https://artificialanalysis.ai/models - accessed 2026-09-30 - TTFT / E2E / tok/s per effort - [B], RECHECK.
2. [S2] AA per-effort model pages, e.g. https://artificialanalysis.ai/models/claude-opus-5-5-high (`-low`, `-medium`, `-xhigh`; unlabeled slug = max; same pattern for `claude-sonnet-5-5`, `claude-fable-5-1`, `gpt-6-astra`, `gpt-6-1-sol`, `gpt-6-sol`, `gpt-6-luna`, `grok-4-7[-high]`, `kimi-k3[-low]`, `gemini-3-8-flash[-low|-medium|-high]`, `claude-opus-5[-high|-xhigh]`) - accessed 2026-09-30 - Intelligence Index v4.3.2, cost per task, output tokens, tok/s, extracted from page text by script - [B]; integers only; RECHECK.
3. [S3] Cursor CursorBench 4.0 - https://cursor.com/cursorbench - accessed 2026-09-30 - score / cost / tokens / steps for 64 model-effort rows; changelog latest task update 2026-09-10 - [V-first-party], private tasks; RECHECK.
4. [S4] Anthropic effort docs https://platform.claude.com/docs/en/build-with-claude/effort and Sonnet 5.5 prompting guide https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5 - accessed 2026-09-30 - level table, per-model recommendations, xhigh/max thoroughness, low-effort verification - [V]; RECHECK.
5. [S5] Anthropic Opus 5.5 prompting guide https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5 - accessed 2026-09-30 - "Calibrate effort", visual/computer-use effort claims - [V]; RECHECK.
6. [S6] OpenAI guides https://developers.openai.com/api/docs/guides/latest-model/gpt-6-astra.md and https://developers.openai.com/api/docs/guides/reasoning.md - accessed 2026-09-30 - levels, defaults, task starts (WebFetch summaries) - [V], tool-summarized, quote-check.
   [S6a] Anthropic Fable 5.1 prompting guide https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1 ("Consider all effort levels") - accessed 2026-09-30 - [V].
7. [S7] Effort docs, Opus 4.7 section (URL of S4) - "max... can lead to overthinking" - [V], older-model guidance.
8. [S8] Anthropic Opus 5.5 announcement https://www.anthropic.com/news/claude-opus-5-5 - accessed 2026-09-30 - effort-labelled claims and customer quotes via WebFetch summary - [V], RECHECK.
9. [S9] AA Coding Agent Benchmarks screenshot `.orchestrate/raw/shots/aa-agents-r8.png` (this lane) - https://artificialanalysis.ai/agents/coding-agents - accessed 2026-09-30 - Coding Agent Index v1.5, token usage - [B].
10. [S10] Sibling lane files in this folder: `02-cli-catalogs.md` (effort enums, defaults), `03-benchmarks.md` (TB4.0 rows, AA table), `05-reddit-hn.md` (R11/R12) - [L]/[B]/[P] as tagged there.
11. [S11] xAI Grok 4.7 levels and AA compare page - WebSearch summaries of https://docs.x.ai/developers/grok-4-7 and https://artificialanalysis.ai/models/comparisons/grok-4-7-high-vs-grok-4-7 - accessed 2026-09-30 - not fetched; low confidence.
