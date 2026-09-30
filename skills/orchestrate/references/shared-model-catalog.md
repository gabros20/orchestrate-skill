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

As of **2026-09-30**. Full evidence, grades and 90+ sources: `docs/research/model-selection/` in the
skill repo. Grades: [V] vendor · [B] independent benchmark · [P] practitioner · [L] local probe.

## How to pick

1. Filter: harness installed + authed, model in its catalog (`board version`-era CLIs drift — probe),
   modality, context that fits **in that harness**, plan quota, data policy.
2. Posture — the flight plan asks, the user overrides (`board set posture=…`): **frontier** (quality
   first; architecture you cannot gamble on) · **balanced** (default) · **economy** (volume, budget).
3. Take the role's row below; the Claude-only column when the run's engine is `claude` (native
   subagents take the aliases `opus`/`sonnet`/`fable`/`haiku` and the session's effort).
4. Reviewer lineage ≠ implementer lineage when a second harness exists.
5. Pin the full model id on lanes; the receipt records what served it.

## Role table

Cross-harness column = `harness · model · effort`. Claude-only = alias @ effort.

| Role | Posture | Cross-harness | Claude-only | Evidence |
|---|---|---|---|---|
| architect (rare, fresh context) | frontier | claude · opus-5-5 · max; 2nd opinion codex · gpt-6-astra · xhigh | opus @max | AA II top 58 at max [B]; Astra TB4 58.2, ARC-AGI-2 95 [B] |
| | balanced | claude · opus-5-5 · xhigh | opus @xhigh | AA 56 at $3.46 [B] |
| | economy | codex · gpt-6.1-sol · xhigh | opus @high | AA 51 at $0.39 [B] |
| orchestrator / planner (interactive) | frontier | claude · opus-5-5 · xhigh | opus @xhigh | default seat [P]; Fable 5.1 as orchestrator contested [P, n=1] |
| | balanced | claude · opus-5-5 · high | opus @high | Anthropic knee: 54 at $1.82 [B] |
| | economy | codex · gpt-6.1-sol · high | opus @medium | 50 at $0.32 [B] |
| long-horizon worker (hours, clear spec) | frontier | claude · opus-5-5 · xhigh, or codex · gpt-6-astra · xhigh | opus @xhigh | FrontierSWE Astra 65.5 / Opus 5.5 62.3; TB4 Astra 58.2 [B] |
| | balanced | codex · gpt-6.1-sol · xhigh | opus @high | Coding Agent Index 63 at $1.04/task vs 66 at $13.0 [B] |
| | economy | codex · gpt-6.1-sol · high | opus @medium | |
| standard worker | frontier | claude · opus-5-5 · high | opus @high | |
| | balanced | codex · gpt-6.1-sol · high | opus @medium | Opus 5.5 low ≈ Sonnet 5.5 medium, cheaper [B] |
| | economy | opencode · mimo-v2.6-pro · high, or deepseek-v4.1-flash · max | opus @low | AA 46 at $0.13 / 39 at $0.27 [B] |
| cheap / mechanical worker | frontier | codex · gpt-6.1-sol · medium | opus @low | |
| | balanced | codex · gpt-6-luna · max | opus @low | Luna max 37 at $0.07 [B]; Haiku 4.5 not competitive [B] |
| | economy | codex · gpt-6-luna · high | haiku | |
| grinder / bug hunt | frontier | claude · sonnet-5-5 · max | sonnet @max | CAI 68 at $14.2/task [B]; xhigh dropped on one bug hunt [P, n=1–2] |
| | balanced | claude · opus-5-5 · xhigh | opus @xhigh | dominates Sonnet 5.5 xhigh on AA [B] |
| reviewer (lineage ≠ implementer) | frontier | claude · fable-5-1 · high, or codex · gpt-6-astra · high | fable @high | |
| | balanced | codex · gpt-6.1-sol · high (Claude implementer) / claude · opus-5-5 · high (Codex implementer) | opus @high | GPT-6 Sol "best adversarial reviewer" [P, n=1]; 6.1 unproven |
| | economy | same split @ medium | opus @medium | open models catch 1/4–1/2 of Fable/Opus findings [P] |
| vision / computer use | any | claude · opus-5-5 · high; codex · gpt-6-astra · high as second run | opus @high | **conflict**: vendor OSWorld 2.1 Opus 5.5 81.8 vs practitioners' Astra [V, P] |
| long-context reader (≥300K) | any | claude · opus-5-5 · high (1M, flat price) | opus @high | GPT-6 bills 2× input >272K; Codex exposes 272K (872K max) [V, L] |
| peer (other lineage) | any | codex · gpt-6.1-sol · high; kimi · k3 · max | — | |

Not placed: Grok 4.7 as a worker (AA 46 at $2.73, dominated [B]); Haiku 4.5 above mechanical work;
Qwen3.8 Max (worst cost/quality [B]); Codex `ultra` and Claude `ultracode` (fan out — refused on lanes).

## Harness matrix

| Harness · id | Context in harness | $ in / out per MTok | AA II @effort ($/task) | CAI | Vision · CU |
|---|---|---|---|---|---|
| claude · `claude-opus-5-5` (alias `opus`) | 1M | 4 / 20 | 58 max ($5.98) · 54 high ($1.82) · 51 medium | 66 | yes · yes |
| claude · `claude-sonnet-5-5` (`sonnet`) | 1M | 2 / 10 | 56 max ($7.60) · 47 high ($1.08) | 68 | yes · yes |
| claude · `claude-fable-5-1` (`fable`) | 1M | 10 / 50 | 53 xhigh = max · 51 high ($3.91) | 62 | yes · yes |
| claude · `claude-haiku-4-5` (`haiku`) | 200K | 1 / 5 | — | — | yes · no |
| codex · `gpt-6-astra` | 272K (872K max) | 10 / 50 | 53 max ($3.26) · 46 low ($0.82) | 62 | yes · yes |
| codex · `gpt-6.1-sol` | 272K (872K max) | 2 / 10 | 52 max · 50 high ($0.32) | 63 | yes · yes |
| codex · `gpt-6-luna` | 272K (872K max) | 0.10 / 0.50 | 37 max ($0.07) | 41 | yes · yes |
| grok · `grok-4.7` | 500K | 2 / 6 (4 / 12 ≥200K) | 46 high = xhigh ($2.73) | 56 | yes · no |
| kimi · `k3` (also via Claude Code / Codex base URL) | 1M (256K on lower plans) | 3 / 15 | 44 max ($2.00) | 52 | yes · no |
| opencode · `glm-5.3` | 1M | 1.4 / 4.4 | 45 max ($2.01) | 54 | no · no |
| opencode · `deepseek-v4.1-flash` | 1M | 0.15–0.30 / 0.60–1.20 | 39 max ($0.27) | — | yes · no |
| opencode · `mimo-v2.6-pro` | 1M | 0.435 / 0.87 | 46 ($0.13) | — | yes · no |
| opencode / agy · `gemini-3.8-flash` | 1M | 0.75 / 3.75 (Zen route 2×) | 41 high ($1.24) | 42 | yes · preview |

AA II = Artificial Analysis Intelligence Index v4.3.2; CAI = AA Coding Agent Index v1.5 (harness +
model — the same model moves 15–20 points between harnesses, so compare rows, not models).
Grok's 2M-context model (`grok-4-1-fast`) was retired 2026-05-15. Meta's `muse` CLI (Muse Spark 1.3,
AA 48 at $1.60) is installed-candidate, not yet an engine block.

## Effort

Value lives in low → high; xhigh/max buy 0–4 points at 1.2–2.8× cost per step and minutes of latency
(115–694 s to first output at max). Per model: **Opus 5.5** knee high, peak max (workers ≤ high,
xhigh for long terminal work, max only architect / final gate) · **Sonnet 5.5** weak at high, use
xhigh/max or Opus instead · **Fable 5.1** xhigh = max, low can skip reasoning — medium–xhigh ·
**Astra** knee medium · **6.1 Sol** high/xhigh, AA reports xhigh > max · **Luna** high–max ·
**Grok 4.7** high = xhigh → high · **K3** max. Never carry an effort level across models.

## Thin evidence — re-check before trusting

No independent current numbers for vision, effective long context or computer use on the 5.5 / GPT-6
generation; METR / OSWorld / Terminal-Bench lack Opus 5.5, Sonnet 5.5, GPT-6.x Sol/Luna; GPT-6.1 Sol
was one day old; Cursor, Antigravity and Pi rosters unverified locally.

## Keeping it current

A new model: identify (vendor + the harness's own list: `grok models`, `~/.codex/models_cache.json`,
`opencode models --verbose`, `pi --list-models`) → probe availability → price and limits → AA (index
version!), then Terminal-Bench / SWE-bench Pro / FrontierSWE, then METR / OSWorld → practitioners after 7
days (X via `xrelay`, HN API, Reddit `search.rss`) → enter a role only above the incumbent minus the CI
→ one row per harness → date every cell. Superseded models stay 30 days.
