# Model catalog — harness × model × effort, per role and posture

Purpose: Pick a concrete harness, model and effort for every role from dated evidence, not memory.

Read when:
- Resolving `models=` / `posture=`, rendering the flight plan, or escalating a model.

Skip when:
- The user pinned every role's model explicitly.

Inputs:
- The role, the posture, the harnesses installed and authed, modality and context needs.

Produces:
- One (harness · model · effort) per role, with the evidence behind it.

## Contents

- How to pick · Role table · Harness matrix · Effort · Thin evidence · Keeping it current

As of **2026-10-13** (Claude Haiku 5.5 refresh: `docs/research/model-selection/refresh-2026-10-13/`).
Full evidence, grades and 90+ sources: `docs/research/model-selection/` in the skill repo. Grades: [V]
vendor · [B] independent benchmark · [P] practitioner · [L] local probe.

## How to pick

1. Filter: harness installed + authed, model in its catalog (`board version`-era CLIs drift — probe),
   modality, context that fits **in that harness**, plan quota, data policy.
2. Posture — the flight plan asks, the user overrides (`board set posture=…`): **frontier** (quality
   first; architecture you cannot gamble on) · **balanced** (default) · **economy** (volume, budget).
3. Take the role's row below; the Claude-only column when the run's engine is `claude`. Native
   subagents take the aliases `opus`/`sonnet`/`fable`/`haiku` and, on Claude Code ≥ 2.1.292, their own
   effort (agent `effort` frontmatter or the per-invocation parameter; `CLAUDE_CODE_EFFORT_LEVEL`
   outranks both). `haiku` = Haiku 5.5 on the Anthropic API but Haiku 4.5 on Bedrock, Google Cloud,
   Foundry and Claude Platform on AWS — pin the provider's Haiku 5.5 id there (Bedrock
   `anthropic.claude-haiku-5-5`) or set `ANTHROPIC_DEFAULT_HAIKU_MODEL`.
4. Reviewer lineage ≠ implementer lineage when a second harness exists.
5. Pin the full model id on lanes; the receipt records what served it.

## Role table

Cross-harness column = `harness · model · effort`. Claude-only = alias @ effort.

| Role | Posture | Cross-harness | Claude-only | Evidence |
|---|---|---|---|---|
| architect (rare, fresh context) | frontier | claude · opus-5-5 · max; 2nd opinion codex · gpt-6-astra · xhigh | opus @max | AA II top 58 at max [B]; Astra TB4 58.2, ARC-AGI-2 95 [B] |
| | balanced | claude · opus-5-5 · xhigh | opus @xhigh | AA 56 at $3.46 [B] |
| | economy | codex · gpt-6.1-sol · xhigh | opus @high | AA 51 at $0.39 [B] |
| orchestrator / planner (interactive) | frontier | claude · opus-5-5 · xhigh | opus @xhigh | default seat [P]; Fable 5.1 as architect/advisor over Opus workers on Reddit (3 threads, 2 bot-summarised); on X only as advisor, mostly templated posts [P] |
| | balanced | claude · opus-5-5 · high | opus @high | Anthropic knee: 54 at $1.82 [B] |
| | economy | codex · gpt-6.1-sol · high | opus @medium | 50 at $0.32 [B] |
| long-horizon worker (hours, clear spec) | frontier | claude · opus-5-5 · xhigh, or codex · gpt-6-astra · xhigh | opus @xhigh | FrontierSWE Astra 65.5 / Opus 5.5 62.3 [B]; tbench.ai TB4.0 Opus 5.5 64.8 (#1), Astra 58.2 [B] |
| | balanced | codex · gpt-6.1-sol · xhigh | opus @high | Coding Agent Index 63 at $1.04/task vs 66 at $13.0 [B]; Sol medium (61.4 at $0.70) is within noise — xhigh kept because a failed hours-long run costs more than the 1.5× premium (judgment) |
| | economy | codex · gpt-6.1-sol · medium | opus @medium | CAI Sol medium 61.4 at $0.70 ≥ high 60.1 at $0.89 [B] |
| standard worker | frontier | claude · opus-5-5 · high | opus @high | |
| | balanced | codex · gpt-6.1-sol · medium | opus @medium | CAI Sol medium 61.4 at $0.70; high 60.1 and xhigh 62.9 within noise at 1.3–1.5× (Codex default `low`: 57.2) [B]; Opus 5.5 low ≈ Sonnet 5.5 medium on AA II (42 vs 41), Sonnet medium now the cheaper ($0.48 vs $0.55) [B] |
| | economy | opencode · mimo-v2.6-pro · high, or deepseek-v4.1-flash · max | opus @low | AA 46 at $0.13 / 39 at $0.27 [B]; DeepSeek: stub secrets only — it used or tried to use an exposed key in two benchmarks [B, P] |
| cheap / mechanical worker | frontier | codex · gpt-6.1-sol · medium | opus @low | |
| | balanced | codex · gpt-6-luna · max | opus @low | Luna max 38 at $0.07 [B]; Haiku 5.5 xhigh ties Opus low — AA II 41.2 vs 42.3 at 0.22× the cost [B], CursorBench +0.6 at 0.48× [V] — but 79 s vs 12 s to first token; practitioner wins n≈1 [P] |
| | economy | codex · gpt-6-luna · high (max for code: VulcanBench 2/23 passes at high vs 12/23 at max [B, community-run]) | haiku @medium | Haiku 5.5: vendor default; AA 34.5 at $0.05, CAI 33.6 at $0.23 [V, B]; high for instruction-heavy edits, xhigh opt-in for offline code batches (CAI 41.4 at $0.61, 26 min/task) [B]; prompts < 100K [V]; Reddit + X tests [P] |
| grinder / bug hunt | frontier | claude · sonnet-5-5 · max | sonnet @max | CAI 68 at $14.2/task [B]; Bug Hunt Bench max 51.3 (#1), xhigh 36 [B, community-run] |
| | balanced | codex · gpt-6.1-sol · xhigh | opus @xhigh | CAI Sol xhigh 62.9 at $1.04 vs Opus 5.5 max 66.0 at $13.04 [B]; corroborated by Bug Hunt Bench 42.7 at $4.35 vs Opus xhigh 36 at $34.98 (different judges per arm; Sol 99 vs 42 min) [B, community-run]. Claude-only: Opus xhigh ties Sonnet xhigh there at about equal cost and leads it on AA II (56 vs 52) [B] |
| reviewer (lineage ≠ implementer) | frontier | claude · fable-5-1 · high, or codex · gpt-6-astra · high | fable @high | Opus 5.5 matched Fable on two real PRs at ~⅓ the price [P, X, n=2] |
| | balanced | codex · gpt-6.1-sol · high (Claude implementer) / claude · opus-5-5 · high (Codex implementer) | opus @high | GPT-6 Sol "best adversarial reviewer" [P, n=1]; 6.1: one controlled practitioner test (24 tasks, tool author) [P] |
| | economy | same split @ medium | opus @medium | open models catch 1/4–1/2 of Fable/Opus findings [P] |
| vision / computer use | any | claude · opus-5-5 · high; codex · gpt-6-astra · high as second run | opus @high | **conflict**: vendor OSWorld 2.1 Opus 5.5 81.8 vs practitioners' Astra [V, P]; independent vision: MMMU-Pro Opus 5.5 87.7 ≈ Astra 86.9, LMArena Vision Sol 1294 ≈ Opus 1293 [B] |
| long-context reader (≥300K) | any | claude · opus-5-5 · high (1M, flat price) | opus @high | GPT-6 bills 2× input >272K; Codex exposes 272K (872K max) [V, L] |
| peer (other lineage) | any | codex · gpt-6.1-sol · high; kimi · k3 · max | — | |

Not placed: Grok 4.7 as a worker (AA 46 at $2.73, dominated [B]); Haiku 4.5 (legacy, AA 17 [B]); Haiku
5.5 for hard or long-horizon coding, research, review or architecture [B, P]; Qwen3.8 Max (worst
cost/quality [B]); Codex `ultra` and Claude `ultracode` (fan out — refused on lanes). Watch: Gemini 4
Argon (AA 53 high at $1.99, CAI 63.8 [B]; no harness here, no hands-on reports yet) and Muse Wonder /
Wonder Full (AA 52 / 56, CAI 63.5 / 68.0 [B]; day-1 reports, re-check after 7 days).

## Harness matrix

| Harness · id | Context in harness | $ in / out per MTok | AA II @effort ($/task) | CAI | Vision · CU |
|---|---|---|---|---|---|
| claude · `claude-opus-5-5` (alias `opus`) | 1M | 4 / 20 | 58 max ($5.98) · 54 high ($1.82) · 51 medium | 66 | yes · yes |
| claude · `claude-sonnet-5-5` (`sonnet`) | 1M | 2 / 10 (cache read 0.10 since 10-07) | 56 max ($5.46) · 47 high ($0.88) | 68 | yes · yes |
| claude · `claude-fable-5-1` (`fable`) | 1M | 10 / 50 | 53 xhigh = max · 51 high ($3.91) | 62 | yes · yes |
| claude · `claude-haiku-5-5` (`haiku` on the Anthropic API) | 1M (whole request ×5 above a 100K prompt) | 0.10 / 0.50 (0.50 / 2.50 >100K) | 43 max ($0.21) · 41 xhigh ($0.12) · 38 high ($0.08) | 41 (xhigh) | yes · yes [V] |
| claude · `claude-haiku-4-5` — legacy; retirement floor 2026-10-15, no deprecation notice as of 10-13 (`haiku` on Bedrock / Google / Foundry / AWS) | 200K | 1 / 5 | 17 ($0.28) | — | yes · yes |
| codex · `gpt-6-astra` | 272K (872K max) | 10 / 50 | 53 max ($3.26) · 46 low ($0.82) | 62 | yes · yes |
| codex · `gpt-6.1-sol` | 272K (872K max) | 2 / 10 | 52 max · 50 high ($0.32) | 63 | yes · yes |
| codex · `gpt-6-luna` | 272K (872K max) | 0.10 / 0.50 | 38 max ($0.07) | 41 | yes · yes |
| grok · `grok-4.7` | 500K | 2 / 6 (4 / 12 ≥200K) | 46 high = xhigh ($2.73) | 56 | yes · no |
| kimi · `k3` (also via Claude Code / Codex base URL) | 1M (256K on lower plans) | 3 / 15 | 44 max ($2.00) | 52 | yes · no |
| opencode · `glm-5.3` | 1M | 1.4 / 4.4 | 45 max ($2.01) | 54 | no · no |
| opencode · `deepseek-v4.1-flash` (vendor API id `deepseek-flash`) | 1M | 0.15–0.30 / 0.60–1.20 | 39 max ($0.27) | — | yes · no |
| opencode · `mimo-v2.6-pro` | 1M | 0.435 / 0.87 | 46 ($0.13) | — | yes · no |
| opencode / agy · `gemini-3.8-flash` | 1M | 0.75 / 3.75 to 2026-12-31, 1.50 / 7.50 after (Zen route 2×) | 41 high ($1.24) | 42 | yes · preview |

AA II = Artificial Analysis Intelligence Index v4.3.2; CAI = AA Coding Agent Index v1.5 (harness +
model — the same model moves 15–20 points between harnesses, so compare rows, not models).
Grok's 2M-context model (`grok-4-1-fast`) was retired 2026-05-15. Meta's `muse` CLI (Muse Spark 1.3, AA
48 at $1.60) is installed-candidate, not yet an engine block. AA's Intelligence Index prices Haiku 5.5
at the ≤100K tier only; agent loops average 70–106K tokens per step, and its CAI costs sit 2.4–3.5×
above a ≤100K reconstruction (tier handling undocumented) [B]. After a safety refusal Claude Code may
hand the turn to an older Opus (Opus 4.8 on AA's Opus / Sonnet 5.5 rows; Opus 5 on 3 of 198 Haiku 5.5
max Terminal-Bench attempts in AA's CAI) or end with no output; AA labels the Opus, Sonnet and Fable
rows "with fallback", not Haiku 5.5 — the receipt names the model that served [B].

## Effort

Value lives in low → high (→ xhigh for Haiku and Sonnet 5.5); xhigh/max buy 0–5 points at 1.2–2.7× cost
per step and minutes of latency (113–692 s to first output at max). Per model: **Opus 5.5** knee high,
peak max (workers ≤ high, xhigh for long terminal work, max only architect / final gate) · **Sonnet
5.5** weak at high, use xhigh/max or Opus instead · **Fable 5.1** xhigh = max, low can skip reasoning —
medium–xhigh · **Haiku 5.5** medium by default, high for instruction-heavy edits, xhigh (its AA knee)
for offline code batches; max below xhigh in agent loops (CAI 36.5 vs 41.4 at 4.2×); `low` skips checks
· **Astra** knee medium · **6.1 Sol** medium for implementation (CAI 61.4 at $0.70; high, xhigh and max
within noise — AA II and VulcanBench put the knee at high), xhigh for audit and bug hunts (Bug Hunt
rises to max); AA II peaks at max (+0.8 over xhigh for 1.84×) · **Luna** high–max · **Grok 4.7** high =
xhigh → high · **K3** max. Defaults differ by surface — Claude Code runs Opus, Sonnet and Haiku 5.5 at
medium, Codex runs 6.1 Sol and Astra at low — so pass effort explicitly. Never carry an effort level
across models.

## Thin evidence — re-check before trusting

No independent vision number for Haiku 5.5 (MMMU-Pro not run for Haiku or Sonnet 5.5; Sonnet 5.5 has only
LMArena Vision, 1266), and no independent
computer-use or >100K-context number for the 5.5 / GPT-6 generation (Haiku 5.5's computer use is
vendor-run only); METR and OSWorld lack them, Terminal-Bench now covers Opus 5.5, Sonnet 5.5, GPT-6.1 Sol
and Luna; GPT-6.1 Sol in Codex: 500K default per OpenAI's Codex lead since 10-11 [V via X] vs the local
catalog's 272K (872K max) [L] — unresolved; Haiku 5.5 practitioner reports are under 7 days old; Cursor,
Antigravity and Pi rosters unverified locally.

## Keeping it current

A new model: identify (vendor + the harness's own list: `grok models`, `~/.codex/models_cache.json`,
`opencode models --verbose`, `pi --list-models`) → probe availability → price and limits → AA (index
version!), then Terminal-Bench / SWE-bench Pro / FrontierSWE, then METR / OSWorld → practitioners after 7
days (X via `xrelay`, HN API, Reddit `search.rss`) → enter a role only above the incumbent minus the CI
→ one row per harness → date every cell. Superseded models stay 30 days.
