# Model-catalog refresh 2026-10-13 — synthesis

> **Trigger:** new model — Claude Haiku 5.5 (`claude-haiku-5-5`, released 2026-10-07). Lanes 1 vendor ·
> 2 CLI catalogs · 3 benchmarks · 4 X · 5 Reddit + HN · 7 effort curves, all returned DONE (lane 4
> after one nudge).
> **Final gate:** task 9 (Opus, fresh context). Round 1 failed with 18 findings (1 high, 8 medium,
> 9 low), all applied. The high finding moved the economy Claude-only cheap worker from `haiku @xhigh`
> to `haiku @medium`; a medium one moved two Sol worker rows to `medium`. Round 2 passed: 17 of 18
> fixed, 1 in part; its 5 low issues were applied too (findings: `.orchestrate/review-task9-final-r{1,2}.md`).
> Grades: [V] vendor · [B] independent benchmark · [P] practitioner · [L] local probe. Lane files:
> `01-vendor-specs.md` … `07-effort-curves.md` in this folder; F/S ids point into them.

## Changes vs catalog

| # | Catalog row | Old → new | Grade | Lane |
|---|---|---|---|---|
| 1 | Harness matrix — NEW `claude · claude-haiku-5-5` | — → 1M context, billed ×5 for the whole request above a 100K-token prompt · $0.10 / $0.50 per MTok up to 100K, $0.50 / $2.50 above · AA II 43 max ($0.21) · 41 xhigh ($0.12) · 38 high ($0.08) · 34 medium ($0.05) · 29 low ($0.02) · CAI 41.4 at xhigh (Claude Code; max 36.5) · vision yes · computer use yes | V (price, context, CU) · B (AA, CAI) | 1, 2, 3, 7 F1 |
| 2 | Alias `haiku` | `claude-haiku-4-5` → `claude-haiku-5-5` on the Anthropic API (Claude Code ≥ 2.1.293); still Haiku 4.5 on Bedrock, Google Cloud, Foundry and Claude Platform on AWS — pin the provider's Haiku 5.5 id (Bedrock `anthropic.claude-haiku-5-5`) or set `ANTHROPIC_DEFAULT_HAIKU_MODEL` | V, L | 1, 2 |
| 3 | Harness matrix — `claude-haiku-4-5` | current → **legacy**: retirement floor 2026-10-15, no deprecation notice as of 10-13 (≥ 60 days' notice required); AA II — → 17 ($0.28); computer use no → **yes** (older `computer_20250124` tool) | V, B | 1, 3, 7 |
| 4 | Cheap / mechanical worker — economy, Claude-only | `haiku` (4.5) → **`haiku @medium`** (5.5): vendor default; AA 34.5 at $0.05, CursorBench 36.9 at $0.17, CAI 33.6 at $0.23. High for instruction-heavy edits; xhigh is an opt-in for offline code batches (AA knee 41.2 at $0.12; CAI 41.4 at $0.61, 26 min a task, 79 s to first token). Keep each prompt under 100K tokens | V, B, P | 7 F8, 1, 4, 5 |
| 5 | Cheap / mechanical worker — frontier and balanced, Claude-only | `opus @low` → **unchanged**: Haiku 5.5 xhigh ties Opus 5.5 low (AA II 41.2 vs 42.3 at 0.22× the cost [B]; CursorBench +0.6 at 0.48× [V]) but takes 79 s vs 12 s to first token, and practitioner wins are n≈1 each [P]. Lane 5 and lane 7 F8 keep `opus @low` | B, V, P | 3, 5, 7 F4a |
| 6 | Cheap / mechanical worker — cross-harness | `codex · gpt-6-luna · max` → **unchanged**: at equal AA II (~38) the cost per task is level, but Haiku spends 3× Luna's output tokens on AA's Index and 4× on FrontierCode (both at max), and its prompts cross the 100K tier; practitioners measure Luna at 1/3–1/12 of Haiku's cost per task. The economy `gpt-6-luna · high` pick gains a note: use max for code (VulcanBench 2/23 passes at high vs 12/23 at max, community-run) | B, P | 3, 4, 5, 7 |
| 7 | Grinder / bug hunt — balanced, cross-harness | `claude · opus-5-5 · xhigh` → **`codex · gpt-6.1-sol · xhigh`**: deciding evidence is the CAI, Sol xhigh 62.9 at $1.04 vs Opus 5.5 max 66.0 at $13.04 [B]. Bug Hunt Bench corroborates: Sol xhigh 42.7 at $4.35 vs Opus 5.5 xhigh 36 at $34.98 (n=3 per row; a different judge per arm; Sol 99 vs 42 min a run) [B, community-run]. Lane 7 item 12 recommends it. AA, tbench.ai and Vals score Opus higher on raw score | B | 3 F5, F16; 7 item 12; 4 |
| 8 | Grinder / bug hunt — balanced, Claude-only | `opus @xhigh` → **unchanged**: Opus 5.5 xhigh ties Sonnet 5.5 xhigh on Bug Hunt Bench (36 each) at about equal cost (Sonnet's $42.86 predates the 10-07 cache-read cut, ~20–28% lower now) and leads it on AA II (56.0 vs 51.9) | B | 3, 7 F1, F3e |
| 9 | Grinder / bug hunt — frontier, evidence | "xhigh dropped on one bug hunt [P, n=1–2]" → Bug Hunt Bench: Sonnet 5.5 max 51.3 (#1), xhigh 36 — pick `sonnet @max` unchanged | B, community-run | 3, 7 |
| 10 | Standard worker — balanced, cross-harness | `codex · gpt-6.1-sol · high` → **`codex · gpt-6.1-sol · medium`**: CAI medium 61.4 at $0.70; high 60.1 ($0.89), xhigh 62.9 ($1.04) and max 60.1 all within noise (SE ≈ 1.6 a row). The CAI decides; AA II and VulcanBench put Sol's knee at high. Codex's default `low` scores 57.2. The board `CATALOG` worker default follows | B, L | 7 item 4, F8 |
| 11 | Standard worker — balanced, evidence | "Opus 5.5 low ≈ Sonnet 5.5 medium, cheaper" → the tie holds on AA II (42.3 vs 40.8), but Sonnet medium is now the cheaper ($0.48 vs $0.55) | B | 3, 7 |
| 12 | Long-horizon worker — economy | `codex · gpt-6.1-sol · high` → **`codex · gpt-6.1-sol · medium`** (same CAI data: medium ≥ high at 0.79× the cost; economy accepts the hours-long risk that #13 avoids) | B | 7 item 4 |
| 13 | Long-horizon worker — balanced | `codex · gpt-6.1-sol · xhigh` → **kept, reason recorded**: medium is within noise on the CAI, but CAI tasks run minutes, not hours, and one failed hours-long run costs more than the 1.5× premium (judgment) | B + judgment | 7 item 4 |
| 14 | Long-horizon worker — frontier, evidence | + tbench.ai Terminal-Bench 4.0: Opus 5.5 (Claude Code, max) 64.8 is #1, GPT-6 Astra 58.2; Vals notes Opus 5.5's 65.15% falls to 58.08% if fallback-served attempts count as failures — picks unchanged | B | 3 F6, F8 |
| 15 | Harness matrix — Sonnet 5.5 | AA cost max $7.60 → $5.46 · high $1.08 → $0.88 (scores unchanged); cause: cache read $0.20 → $0.10 per MTok on 2026-10-07 | V, B | 1, 3, 7 |
| 16 | Harness matrix — GPT-6 Luna | AA II max 37 → 38 (cost unchanged, $0.07) | B | 3, 4, 7 |
| 17 | Harness matrix — Gemini 3.8 Flash | $0.75 / $3.75 → same, but introductory: $1.50 / $7.50 from 2027-01-01 | V | 1 |
| 18 | Standard worker — economy (DeepSeek V4.1 Flash) | + caveat: run it with stub secrets — it used or tried to use an exposed API key in two benchmarks (an independent effort table; a second report: attempts in 33% of runs, 11% succeeded); vendor API id is `deepseek-flash` (the catalog id is the opencode / OpenRouter route) | B, P, V | 5, 3, 1 |
| 19 | Effort section | "0–4 points at 1.2–2.8× per step, 115–694 s to first output at max" → 0–5 points at 1.2–2.7×, 113–692 s; value lives in low → high, → xhigh for Haiku and Sonnet 5.5. + Haiku 5.5: medium by default, high for instruction-heavy edits, xhigh (its AA knee) for offline code batches, max below xhigh in agent loops, `low` skips checks. Sol: medium for implementation (CAI), xhigh for audit and bug hunts; AA II peaks at max (+0.8 over xhigh for 1.84×). + defaults by surface: Claude Code runs Opus, Sonnet and Haiku 5.5 at medium, Codex runs 6.1 Sol and Astra at low | B, V, L | 7, 3, 2 |
| 20 | How to pick, step 3 | "native subagents take … the session's effort" → a native subagent can carry its own effort (Claude Code ≥ 2.1.292: `effort` frontmatter or the per-invocation parameter; `CLAUDE_CODE_EFFORT_LEVEL` outranks both); + the `haiku` provider caveat of row 2 | V, L | 7, 1, 2 |
| 21 | Orchestrator — frontier, evidence | "Fable 5.1 as orchestrator contested [P, n=1]" → Fable 5.1 as architect / advisor over Opus workers on Reddit (3 threads, 2 bot-summarised); on X only as advisor, mostly in templated posts | P | 5 item 9, 4 |
| 22 | Reviewer — frontier, evidence | + Opus 5.5 matched or beat Fable 5.1 on two real PRs at about a third of the price (12 reviews) — pick unchanged | P (X, n=2) | 4 S19–S21 |
| 23 | Reviewer — balanced, evidence | "6.1 unproven" → one controlled practitioner test (24 tasks, run by a tool author) | P | 5 |
| 24 | Vision / computer use — evidence | + independent vision numbers: MMMU-Pro Opus 5.5 87.7 ≈ Astra 86.9; LMArena Vision Sol 1294 ≈ Opus 1293 — picks unchanged | B | 3 F10, F11 |
| 25 | Thin evidence | → no independent vision number for Haiku 5.5 (MMMU-Pro not run for Haiku or Sonnet 5.5; Sonnet 5.5 has only LMArena Vision, 1266); no independent computer-use or >100K-context number for the generation; METR and OSWorld lack them; Terminal-Bench now covers Opus 5.5, Sonnet 5.5, GPT-6.1 Sol and Luna; + the 6.1 Sol context conflict of Gaps | B, V, L | 3, 4, 2 |
| 26 | Not placed | + Haiku 4.5 (legacy, AA 17); + Haiku 5.5 for hard or long-horizon coding, research, review or architecture (CAI; vendor TB4; Bug Hunt 21.5 at max; practitioners report lost context in hours-long sessions) | B, V, P | 4, 5, 7 F8 |
| 27 | Not placed — watch list | + Gemini 4 Argon (2026-09-30; AA II 53 high at $1.99; CAI 63.8 at $5.84; no harness here, no hands-on reports yet) and Muse Wonder / Wonder Full (2026-10-12; AA II 52 / 56; CAI 63.5 / 68.0; day-1 reports, re-check after 7 days) | B, P | 3, 4, 5, 2 |
| 28 | Harness matrix footnote — price tiers | + AA's Intelligence Index prices Haiku 5.5 at the ≤100K tier only, while agent loops average 70–106K tokens per step; its CAI costs already sit 2.4–3.5× above a ≤100K reconstruction (tier handling undocumented) | B | 3 F5, F14; 7 F5 |
| 29 | Harness matrix footnote — served model | + after a safety refusal Claude Code may hand the turn to an older Opus (Opus 4.8 on AA's Opus / Sonnet 5.5 rows; Opus 5 on 3 of 198 Haiku 5.5 max Terminal-Bench attempts in AA's CAI) or end with no output; AA labels the Opus, Sonnet and Fable rows "with fallback", not Haiku 5.5 — read the served model from the receipt | B | 4 S22, 3 F2, F5, F16 |

Also edited to match: routing rules 1 and 2 (`shared-model-routing.md`: Codex defaults `low` for Sol and
Astra, `medium` for Luna, a user's config.toml can pin them; the Agent tool's per-invocation effort;
Haiku 5.5 at Luna's price only up to 100K, 3–4× its output tokens at max), the
engine-claude Haiku line, the flight-plan worker example, board `CATALOG_AS_OF` → 2026-10-13.

Re-checked and unchanged: list prices and contexts of Opus 5.5, Sonnet 5.5, Fable 5.1, Astra, 6.1 Sol,
Luna, Grok 4.7, K3, GLM-5.3, MiMo V2.6 Pro, DeepSeek V4.1 Flash [V, lane 1]; AA II and CAI for Opus 5.5,
Fable 5.1, Astra, 6.1 Sol, MiMo, DeepSeek, GLM, K3, Grok 4.7, Gemini 3.8 Flash [B, lanes 3, 7]; Codex
context 272K (872K max) [L, lane 2].

## Role picks after this run (changed rows only)

| Role | Posture | Cross-harness | Claude-only | Evidence |
|---|---|---|---|---|
| standard worker | balanced | **codex · gpt-6.1-sol · medium** | opus @medium (unchanged) | CAI medium 61.4 at $0.70, high and xhigh within noise [B] |
| long-horizon worker | economy | **codex · gpt-6.1-sol · medium** | opus @medium (unchanged) | CAI medium ≥ high at 0.79× [B] |
| cheap / mechanical worker | economy | codex · gpt-6-luna · high (unchanged; max for code) | **haiku @medium** | vendor default; AA 34.5 at $0.05, CAI 33.6 at $0.23 [V, B]; prompts < 100K [V] |
| grinder / bug hunt | balanced | **codex · gpt-6.1-sol · xhigh** | opus @xhigh (unchanged) | CAI 62.9 at $1.04 vs 66.0 at $13.04 [B]; Bug Hunt Bench corroborates [B, community-run] |

Board `CATALOG`: worker balanced `codex gpt-6.1-sol @high` → `@medium`. It has no cheap-worker,
long-horizon or grinder role, so those picks live in the reference only. Pre-existing and left as it
was: its economy worker (`codex gpt-6-luna @max` · `opus @low`) joins the reference's cheap-worker
balanced pick to the standard-worker economy Claude-only pick — which row it should follow is open.

## Outside the catalog — for the skill, not applied in this run

- Claude Code subagent prompt cache lives 5 minutes unless `subagentPromptCacheTtl` is set; the
  built-in Explore subagent inherits the main model; advisor calls re-read the transcript uncached;
  agent teams cost 1.8–5.1× for one significant gain in four comparisons [V via X, P, B — lane 4
  S25–S29].
- Claude Code ships counter-guidance for Haiku 5.5 checking in early; workers on other harnesses
  should carry an equivalent "finish, do not ask" line [L, inference — lane 2].
- Codex here runs `gpt-6.1-sol` at `low` from `~/.codex/config.toml`; `gpt-5.5` retires from Codex on
  2026-10-14; `/opt/homebrew/bin/codex` is broken and a second opencode (1.15.3) sits behind the
  current one on PATH [L — lane 2].

## Gaps

- No independent computer-use or >100K-context number for the 5.5 generation, and no independent
  vision number for Haiku 5.5 (Sonnet 5.5 has only LMArena Vision); Haiku's computer use (OSWorld 2.1 offline subset 72.4% at
  max) is vendor-run.
- Haiku 5.5's real cost per agent task is uncertain: AA's Intelligence Index prices it at the ≤100K
  tier only, and whether its CAI costs include the >100K tier is inferred (lanes 3, 7), not documented.
- GPT-6.1 Sol's Codex default context: 500K since 2026-10-11 per OpenAI's Codex lead [V via X, lane 4
  S16] vs 272K / 872K max in the local catalog [L, lane 2] — unresolved; the matrix keeps the local
  reading and Thin evidence records the conflict.
- AA and the CAI publish no confidence intervals; lane 7's ~1.6-point SE per CAI row is a 0/1
  approximation. Steps under about one point on AA II, or two to three on the CAI, are read as noise.
