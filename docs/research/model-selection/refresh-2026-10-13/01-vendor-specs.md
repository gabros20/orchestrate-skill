# Lane 1 — vendor specs (refresh 2026-10-13, trigger: claude-haiku-5-5)

Every number below was read on 2026-10-13 (CEST) from the vendor source named in its tag, unless a date is given. Grades: [V] vendor-official, [P] practitioner or third party (marked unverified), [L] local probe (only one, relayed by a peer and not re-run by me); secondary cross-checks say so. No [B] independent benchmark appears in this lane. Vendor benchmark numbers are vendor-run and labelled as such; they are not independent evidence.

## Summary

**Changes vs catalog (shared-model-catalog.md, as of 2026-09-30)**

- **NEW row `claude-haiku-5-5`** (released 2026-10-07): 1M context, 128K max output, $0.10 / $0.50 per MTok for prompts up to 100K tokens and **$0.50 / $2.50 above 100K**, cache read $0.01 ($0.05 above 100K), batch -50%, effort `low|medium|high|xhigh|max` default `medium`, text+image in, computer use and browser use supported [V S1, S2, S4, S7, S11]. Catalog's only Haiku row (200K, 1 / 5) is Haiku **4.5**; it becomes a separate legacy row.
- **Alias move**: on the Anthropic API the Claude Code alias `haiku` now resolves to Haiku 5.5 (Claude Code >= v2.1.293); on Bedrock, Google Cloud, Foundry and Claude Platform on AWS it still resolves to Haiku 4.5 [V S3]. Native subagents with `model: haiku` / `CLAUDE_CODE_SUBAGENT_MODEL=haiku` therefore change model by provider. `claude-haiku-5-5` has no date suffix and no alias [V S7].
- **`claude-haiku-4-5` status**: "Legacy (still available)", price unchanged 1 / 5, 200K context, 64K max output, knowledge cutoff Feb 2025, "Not sooner than October 15, 2026" retirement, no deprecation notice issued as of today (Anthropic promises "at least 60 days' notice") [V S9, S10]. Catalog error: Haiku 4.5 does support computer use (older `computer_20250124` tool), catalog says "CU no" [V S7].
- **Sonnet 5.5 cache read halved** $0.20 -> $0.10 per MTok on 2026-10-07 [V S5]. New cache columns not in catalog: Opus 5.5 read $0.20, Fable 5.1 $0.25, GPT-6.1 Sol $0.10 (GPT-6 Sol $0.20), Luna $0.01.
- **Gemini 3.8 Flash price is introductory**: $0.75 / $3.75 "through December 31, 2026", **$1.50 / $7.50 from 2027-01-01** (cache $0.075 -> $0.15) [V S25]. Catalog's 0.75 / 3.75 stays correct today but expires. 3.8 Flash GA 2026-09-02; 3.7 Flash deprecated and auto-routed to it on 2026-10-08 [V S25].
- **Id corrections**: DeepSeek's own API id is `deepseek-flash` (DeepSeek-V4.1-Flash; `deepseek-v4-flash` still routed) while the catalog/OpenRouter use `deepseek-v4.1-flash` [V S23, S15]. MiMo ids are all-lowercase `mimo-v2.6-pro` and **V2.5 ids stop working 2026-10-21** (auto-route to V2.6 starts 2026-10-14 18:00 UTC+8) [V S24].
- **No change** (re-checked, matches catalog): Opus 5.5 4 / 20, 1M [V S1, S2]; Sonnet 5.5 2 / 10, 1M; Fable 5.1 10 / 50, 1M; GPT-6 Astra 10 / 50; GPT-6.1 Sol 2 / 10; GPT-6 Luna 0.10 / 0.50 (all three: 1.05M API window, long-context tier above 272K) [V S16, S17]; Grok 4.7 2 / 6 (4 / 12 at >=200K prompt), 500K [V S20]; Kimi K3 3 / 15, 1M [V S21]; GLM-5.3 1.4 / 4.4, 1M [V S22]; DeepSeek V4.1 Flash 0.15-0.30 / 0.60-1.20 (off-peak / peak), 1M [V S23]; MiMo V2.6 Pro 0.435 / 0.87, 1M [V S24].
- **Not verifiable from vendor pages** (left as catalog): Codex harness window "272K (872K max)" is a local-probe fact, not on any vendor page (API says 1,050,000); K3 "256K on lower plans" (API docs list K2.7 Code / K2.6 at 256K, K3 at 1M); the Gemini "(Zen route 2x)" remark (a route-specific price; Google's own page shows 0.75 / 3.75 now and 1.50 / 7.50 from 2027-01-01).
- **Do not use OpenRouter list prices for the catalog**: OpenRouter shows GLM-5.3 at $0.079 / $4.80, K3 at $0.73 / $13.50 and DeepSeek V4.1 Flash at $0.044 / $0.891 vs vendor $1.40 / $4.40, $3 / $15 and $0.15-0.30 / $0.60-1.20; its K3 batch row is dearer than its live row. It matched vendor lists for Claude, GPT-6, Grok 4.7, MiMo and Gemini 3.8 Flash [S15 vs V].

**What matters for selection**

- **Haiku 5.5 vs Luna is a price tie only up to 100K prompt tokens.** Same list price ($0.10 / $0.50 / cache read $0.01) but Haiku 5.5 jumps 5x on both sides above 100K tokens while Luna's step is 2x input / 1.5x output above 272K [V S2, S17]. Between 100K and 272K tokens Luna is 5x cheaper. Haiku 5.5's tokenizer also yields about 30% more tokens than Haiku 4.5 for the same text [V S7].
- **Anthropic's own run says Haiku 5.5 beats Luna on every shared row, but it is vendor-run at max effort**: Terminal-Bench 4.0 39.2 vs 16.4, OSWorld 2.1 offline partial 72.4 vs 48.9 (Anthropic ran Luna through OpenAI's API), FrontierCode Main 46.4 vs 42.4, GDPval-AA 1620 vs 1437 [V S5, S6]. The effort curves narrow that: on Cognition's FrontierCode plot Luna at max (about 42.4%, about 58K output tokens) sits on the same point as Haiku 5.5 at high (about 41.9%, about 56K tokens), and Haiku 5.5 pulls ahead only by spending 100K-180K tokens (xhigh/max 45.8-46.4%) [V-relayed S6, Table 5, read by eye]; on OSWorld at equal cost (about $0.12-0.20 per task) Haiku 5.5 leads Luna by roughly 14-16 partial-score points. Needs independent confirmation (AA and Terminal-Bench lanes) before it displaces `codex · gpt-6-luna` in the cheap-worker row.
- **Haiku 5.5 is not a coding-agent replacement for Sonnet/Opus**: Terminal-Bench 4.0 39.2 vs Sonnet 5.5 70.6 and Opus 5.5 66.4 (xhigh); SWE-bench Pro 64.8 vs 81.3 [V S6]. Anthropic: "Sonnet 5.5 and Opus 5.5 remain better choices for complex agentic coding tasks" [V S5]. Fits subagent, summarization, extraction, routing and browser/computer-use roles.
- **Effort matters more than the label**: Haiku 5.5 FrontierCode Main is 46.4 at max vs 45.8 at xhigh (Sonnet 5.5: 46.2 max vs 52.1 xhigh); `low` skips searches, stops early and skips checks in long agent prompts; `low` -> `medium` roughly halved early stopping at more than 2x output tokens [V S6, S7]. Default `medium` is right for workers; never carry a level across models.
- **Forced tool use differs**: Opus 5.5, Sonnet 5.5, Fable 5.1 return a 400 on `tool_choice` `any`/named tool; Haiku 5.5 accepts it but then skips thinking before the call [V S10, S7]. Haiku 5.5 also rejects assistant prefill and any `temperature`/`top_p` other than 1 / 0.99, and its safety classifiers can return `stop_reason: "refusal"` with no server-side fallback, so a Haiku subagent doing security work can stop mid-task (Anthropic's own Terminal-Bench run: 12 of 660 trials flagged, all failed) [V S7, S6].
- **Context is not "1M flat" for every Claude model**: Opus 5.5, Sonnet 5.5, Fable 5.1 bill the full 1M at the base rate; Haiku 5.5 does not [V S2]. Catalog row "long-context reader: Opus 5.5 high (1M, flat price)" stays valid.
- **Computer use support set** (vendor docs): Claude Opus 5.5, Sonnet 5.5, Fable 5.1, Haiku 5.5 (GA on Claude API and Google Cloud); GPT-6 Astra / 6.1 Sol / Luna (computer use tool in the Responses API); Gemini 3.8 Flash (Preview); no vendor computer-use tool documented for Grok 4.7, K3, GLM-5.3, DeepSeek V4.1 Flash; MiMo V2.6 claims native computer-use ability without a documented tool API [V S11, S16, S25, S24].
- **Date-driven events to re-check** (see Dated events): OpenAI retires GPT-5.5 from Codex on 2026-10-14; MiMo V2.5 ids die 2026-10-21; Haiku 4.5 retirement floor 2026-10-15; Sonnet 4.5 retires 2026-11-30; Gemini 3.8 Flash doubles 2027-01-01.

## Findings

### Table 1a — identity, dates, windows

| Model | API id (Anthropic) · other platforms | Released | Context | Max output | Status · retirement |
|---|---|---|---|---|---|
| claude-opus-5-5 | `claude-opus-5-5` · Bedrock `anthropic.claude-opus-5-5`; Vertex, Foundry, Platform-on-AWS `claude-opus-5-5` [V S1] | 2026-09-22 [V S10] | 1M [V S1] | 128K sync; 300K Batch with beta header `output-300k-2026-03-24` [V S1] | Active; not sooner than 2027-09-22 [V S9] |
| claude-sonnet-5-5 | `claude-sonnet-5-5` · `anthropic.claude-sonnet-5-5`; others same [V S1] | 2026-09-28 [V S10] | 1M | 128K; 300K Batch beta | Active; not sooner than 2027-09-28 [V S9] |
| claude-fable-5-1 | `claude-fable-5-1` · `anthropic.claude-fable-5-1`; others same [V S1] | 2026-09-01 [V S10] | 1M | 128K (not on the 300K Batch list) | Active; not sooner than 2027-09-01 [V S9] |
| **claude-haiku-5-5 (NEW)** | `claude-haiku-5-5` (fixed id, no date suffix, no alias) · `anthropic.claude-haiku-5-5`; Vertex, Foundry, Platform-on-AWS `claude-haiku-5-5` [V S4, S7] | **2026-10-07** [V S4, S5] | 1M [V S4]; prompts >100K billed higher [V S2] | 128K sync; 300K Batch beta [V S4] | Active (latest); not sooner than 2027-10-07 [V S9] |
| claude-haiku-4-5 | `claude-haiku-4-5-20251001` (alias `claude-haiku-4-5`) · Bedrock `anthropic.claude-haiku-4-5`; Vertex `claude-haiku-4-5@20251001` [V S7, S10] | 2025-10-15 [V S10] | 200K [V S10] | 64K [V S10] | **Legacy**; not sooner than 2026-10-15; no deprecation notice as of 2026-10-13 [V S9, S10] |
| gpt-6-astra | `gpt-6-astra` [V S16] | 2026-09-03 [V S19] | 1,050,000; prompts >272K input: 2x input and cache rates, 1.5x output for the whole request [V S16] | 128,000 [V S16] | Current |
| gpt-6.1-sol | `gpt-6.1-sol` [V S16] | 2026-09-29 [V S19] | 1,050,000 (same >272K rule) | 128,000 | Current; Codex: Plus, Pro, Business, Enterprise, Edu (Enterprise/Edu off until admin enables); Free and Go "not included at launch" [V S18] |
| gpt-6-luna | `gpt-6-luna` [V S16] | 2026-09-22 (with gpt-6-sol) [V S19] | 1,050,000 (same >272K rule) | 128,000 | Current; Codex docs point Free and Go plans to Luna in the desktop app "when available"; Enterprise/Edu admin must enable it first [V S18] |
| grok-4.7 | `grok-4.7` [V S20] | 2026-09-21 [V S20] | 500,000; >=200K prompt tokens: long-context rates on all tokens [V S20] | "no text output limit" [V S20] (OpenRouter lists 450,000 [S15]) | Latest |
| kimi-k3 | `kimi-k3` [V S21] | July 16, 2026 per aggregators [P S26, unverified; official docs undated] | 1,048,576, flat price [V S21] | `max_completion_tokens` default 131,072, up to 1,048,576 [V S21] | Flagship; open weights released [V S21] |
| glm-5.3 | `glm-5.3` [V S22] | 2026-08-18 [V S22] | 1M [V S22] | 128K [V S22] | Current (GLM-5.3-Flash 2026-08-26) |
| deepseek-v4.1-flash | `deepseek-flash` = DeepSeek-V4.1-Flash; legacy `deepseek-v4-flash` still routed [V S23] | 2026-09-10 [V S23] | 1M [V S23] | "MAXIMUM: 384K" [V S23] (OpenRouter 943,718 [S15]) | Current |
| mimo-v2.6-pro | `mimo-v2.6-pro` (lowercase) [V S24] | V2.6 series page dated 2026-09-22 [V S24] | 1M [V S24] | 128K [V S24] | Current; open weights [V S24] |
| gemini-3.8-flash | `gemini-3.8-flash` [V S25] | 2026-09-02 (GA) [V S25] | 1,048,576 [V S25] | 65,536 [V S25] | Current; replaces 3.7 Flash since 2026-10-08 [V S25] |

### Table 1b — price per MTok (USD)

| Model | Input / output | Cache read · write | Batch | Long-context tier | Other modes |
|---|---|---|---|---|---|
| Opus 5.5 | 4 / 20 [V S2] | read 0.20 (0.05x); write 5m 5, 1h 8 [V S2] | -50% [V S1] | none; full 1M at base rate [V S2] | Fast mode (research preview, API only) 8 / 40, up to 2.5x output tokens/s [V S13] |
| Sonnet 5.5 | 2 / 10 [V S2] | read **0.10** (was 0.20 until 2026-10-07); write 5m 2.50, 1h 4 [V S2, S5] | -50% | none | — |
| Fable 5.1 | 10 / 50 [V S2] | read 0.25 (0.025x); write 5m 12.50, 1h 20 [V S2] | -50% | none | — |
| **Haiku 5.5** | **0.10 / 0.50** up to 100K prompt tokens [V S2, S4] | read 0.01; write 5m 0.125, 1h 0.20 [V S2] | -50% [V S4] | **>100K prompt: 0.50 / 2.50; read 0.05; write 0.625 / 1.00**; prompt length counts cache reads and writes; whole request is repriced [V S2] | US-only inference x1.1 (also on the higher tier) [V S2]; Priority Tier not supported [V S7] |
| Haiku 4.5 | 1 / 5 [V S2] | read 0.10; write 5m 1.25, 1h 2 | -50% | none (200K window) | — |
| GPT-6 Astra | 10 / 50 [V S17] | cached 1.00; cache write 12.50 [V S17] | Batch and Flex 5 / 25 [V S17] | >272K: 20 / 75, cached 2, write 25 | Fast 20 / 100; Ultrafast (6x) 60 / 300 [V S17] |
| GPT-6.1 Sol | 2 / 10 [V S17] | cached **0.10** (GPT-6 Sol 0.20); write 2.50 [V S17, S19] | Batch and Flex 1 / 5 | >272K: 4 / 15, cached 0.20, write 5 | Fast 4 / 20; Ultrafast 12 / 60 (available to all API users since 2026-10-08) [V S17, S19] |
| GPT-6 Luna | 0.10 / 0.50 [V S17] | cached 0.01; write 0.125 | Batch and Flex 0.05 / 0.25 | >272K: 0.20 / 0.75 | Fast 0.20 / 1.00 |
| Grok 4.7 | 2.00 / 6.00 [V S20] | cached 0.50 [V S20] | Batch API not supported [V S20] | >=200K: 4 / 12, cached 1.00 [V S20] | "Grok 4.7 Fast" 2x (1.5x long ctx), only in Cursor and Grok Build, not on the public API; US endpoint x1.1 [V S20] |
| Kimi K3 | 3.00 / 15.00 [V S21] | cached 0.30; cache write 5m 3.00, 1h 6.00 [V S21] | not listed | none: "no tiering by context length" [V S21] | — |
| GLM-5.3 | 1.4 / 4.4 [V S22] | cached 0.26; storage limited-time free [V S22] | — | — | GLM-5.3-Flash 0.15 / 0.50; FlashX 0.37 / 1.25 [V S22] |
| DeepSeek V4.1 Flash | off-peak 0.15 / 0.60; peak 0.30 / 1.20 (cache miss) [V S23] | hit off-peak 0.003, peak 0.006 [V S23] | — | none | Peak = 01:00-04:00 and 06:00-10:00 UTC, Mon-Fri excl. Chinese holidays [V S23] |
| MiMo V2.6 Pro | 0.435 / 0.87 (overseas) [V S24] | hit 0.0036; write limited-time free [V S24] | Batch 0.2175 / 0.435 [V S24] | none stated | UltraSpeed 4.35 / 8.7 ("up to 20x" speed); V2.6-Flash 0.14 / 0.28 [V S24] |
| Gemini 3.8 Flash | 0.75 / 3.75 through 2026-12-31; **1.50 / 7.50 from 2027-01-01**; output includes thinking tokens [V S25] | cache 0.075 (-> 0.15) plus storage 0.50 (-> 1.00) per MTok-hour [V S25] | Batch and Flex -50% [V S25] | none stated | Priority 1.35 / 6.75 (-> 2.70 / 13.50) [V S25] |

### Table 1c — effort, thinking, cutoff, limits, speed

| Model | Effort levels · default | Thinking | Knowledge cutoff | Rate / usage limits | Speed (published) |
|---|---|---|---|---|---|
| Opus 5.5 | low, medium, high, xhigh, max · `medium` (API and Claude Code) [V S8, S3] | Adaptive, always on; `disabled` returns 400 at every effort [V S8] | Jun 2026 [V S1] | Start tier 1,000 RPM / 2M ITPM / 400K OTPM; Build 5,000 / 5M / 1M; Scale 10,000 / 10M / 2M; limits are per model, Opus 5.5 and Sonnet 5.5 each have their own bucket [V S13] | "Moderate" comparative latency [V S1] |
| Sonnet 5.5 | same five · `high` on the API [V S8, S1]; **`medium` in Claude Code** [V S3] | Adaptive; lowest setting `between_tools` (works at <= high; 400 at xhigh/max) [V S8] | Jun 2026 | same as Opus 5.5 [V S13] | "Fast" [V S1] |
| Fable 5.1 | same five · `high` [V S8, S1] | Adaptive, always on | Jun 2026 | Start 1,000 / 500K / 100K; Build 2,000 / 1.5M / 300K; Scale 4,000 / 4M / 800K; one bucket shared by Fable 5.1 and Fable 5 [V S13] | "Slower" [V S1] |
| **Haiku 5.5** | low, medium, high, xhigh, max · **`medium`** (API and Claude Code) [V S8, S3] | Adaptive. API: `thinking:{"type":"disabled"}` accepted at low/medium/high, 400 at xhigh/max [V S7, S8]. Claude Code: "You can't turn thinking off" [V S3]. Thinking tokens count toward `max_tokens` [V S7] | Jun 2026 (reliable and training) [V S4, S6] | Start tier 1,000 / 2M / 400K, Build 5,000 / 5M / 1M, Scale 10,000 / 10M / 2M, same as Haiku 4.5 [V S13] | "Fastest" comparative latency; "fastest model to date at each model's standard speed", slower than Opus in Fast mode [V S1, S5]; no tokens/s published |
| Haiku 4.5 | not supported [V S10] | Manual extended thinking with `budget_tokens` [V S10] | Feb 2025 [V S10] | same as Haiku 5.5 [V S13] | — |
| GPT-6 Astra | low, medium, high, xhigh, max; `none` not supported; default not stated on the model page [V S16, S19]. Codex maps Light = `low` [V S18] | Reasoning tokens; Reasoning label "Highest" | Apr 30, 2026 [V S16] | API tiers Build 5,000 RPM / 1M TPM; Launch 10,000 / 4M; Grow 15,000 / 40M [V S16] | Speed label "Fast"; Ultrafast 6x price [V S16, S17] |
| GPT-6.1 Sol | low, medium (default), high, xhigh, max; `none`, `minimal` unsupported [V S16] | Reasoning tokens | Apr 30, 2026 [V S16] | Build 5,000 / 1M; Launch 10,000 / 4M; Grow 15,000 / 40M [V S16] | Ultrafast mode [V S19] |
| GPT-6 Luna | none, low, medium (default), high, xhigh, max; Codex: up to Max, no Ultra [V S16, S18] | Reasoning tokens; Reasoning label "High" | **May 18, 2026** [V S16] | Build 5,000 / 2M; Launch 10,000 / 10M; Grow 30,000 / 180M [V S16] | Speed label "Fast" |
| Grok 4.7 | low, medium, high (default), xhigh [V S20] | Reasoning; Responses API always returns `reasoning.encrypted_content` [V S20] | not published | 150 requests/s, 50,000,000 tokens/min as listed on the model page [V S20] | none published |
| Kimi K3 | low, high, max · `max` [V S21] | Always on [V S21] | not published | By cumulative recharge: Tier0 ($1) 1 concurrent / 3 RPM / 500K TPM / 1.5M TPD; Tier1 ($10) 15 / 100 / 2M; Tier3 ($100) 50 / 200 / 3M; Tier5 ($3,000) 100 / 300 / 5M [V S21] | none published |
| GLM-5.3 | low, high, max · `max` [V S22] | Always on; disabling "not supported"; `thinking.type:"disabled"` now fails [V S22] | not published | not captured | none published |
| DeepSeek V4.1 Flash | low, high, max · `high`; medium -> high, xhigh -> high, ultra -> max [V S23] | Thinking default on; `thinking:{"type":"disabled"}` allowed [V S23] | not published | Concurrency limit 2,500 (Flash) [V S23] | none published |
| MiMo V2.6 Pro | not found | Deep thinking supported [V S24] | not published | 100 RPM / 10M TPM [V S24] | UltraSpeed "up to 20x" [V S24] |
| Gemini 3.8 Flash | thinking low, medium, high; `minimal` returns an error [V S25] | Supported | **Mar 2026** [V S25] | not captured | none published |

### Table 2 — modalities, computer use, tool-use quirks

| Model | Input modalities | Output | Multi-image · PDF | Computer / browser use | Tool-use quirks |
|---|---|---|---|---|---|
| Opus 5.5 | Text, image [V S1] | Text | Up to 600 images/request (100 for 200K-window models), 32 MB request cap; PDF up to 600 pages (100 when window <1M) [V S12] | Computer use GA on Claude API and Google Cloud via `computer_toolset_20260801`; Bedrock accepts `computer_20251124`; browser use `browser_toolset_20260801` on Claude API and Google Cloud [V S11] | Forced `tool_choice` returns 400; thinking cannot be disabled; thinking blocks tied to the model [V S10] |
| Sonnet 5.5 | Text, image | Text | as above | same [V S11] | Forced tool use 400; `between_tools` thinking mode [V S10] |
| Fable 5.1 | Text, image | Text | as above | same [V S11] | Forced tool use 400; only Fable/Mythos 5.1 read its thinking blocks [V S10] |
| **Haiku 5.5** | **Text, image** ("Text and images -> text") [V S4]; high-resolution image tier (2,576 px / 4,784 visual tokens; ~2.5x visual tokens of Haiku 4.5 for a 2000x1500 image) [V S7] | Text | Up to 600 images (1M window); PDF up to 600 pages [V S12] | **Computer use GA on Claude API and Google Cloud (`computer_toolset_20260801`); beta on Bedrock (`computer_20251124`), Claude Platform on AWS and Foundry; browser use on Claude API and Google Cloud; toolset adds ~4,500 / ~6,600 input tokens per request** [V S11] | Accepts forced `tool_choice` but the reply starts with the call, no thinking block; no assistant prefill (400); `temperature` must be 1 and `top_p` 0.99 or omitted; no `top_k`; structured outputs unavailable on Bedrock; `stop_reason:"refusal"` with no fallback; thinking blocks account-bound and append-only [V S7] |
| Haiku 4.5 | Text, image [V S10] | Text | 100 images (200K window) [V S12] | `computer_20250124` only [V S7]; no browser tool [V S7] | prefill allowed with thinking off; `temperature` allowed [V S7] |
| GPT-6 Astra | Text, image [V S16] | Text | Audio and video not supported; PDF not listed on the model page | Computer use listed as supported (Responses API) [V S16]; also Agents API hosted browser (2026-09-29) [V S19] | Tool calling requires the Responses API; no custom `temperature`/`top_p`/`logprobs` [V S19] |
| GPT-6.1 Sol | Text, image | Text | as above | Computer use supported [V S16] | Responses API for tool calling; Chat Completions without tools; Multi-agent (beta) [V S16, S19] |
| GPT-6 Luna | Text, image | Text | as above | Computer use supported [V S16] | Chat Completions function calling only with `reasoning_effort: none`; Decisions API (beta) "10x faster than the Responses API" [V S16, S19]; image-encoding bug fixed 2026-09-25 [V S19] |
| Grok 4.7 | Text, image [V S20] | Text | image understanding documented; multi-image and PDF not stated | no computer-use tool listed (tools: function calling, web search, X search, code execution, image generation, collections, MCP) [V S20] | Batch API not supported; encrypted reasoning always returned [V S20] |
| Kimi K3 | Text, image, video [V S21] | Text | Images as content parts, video via Files (`purpose:"video"`) [V S21] | none documented | `tool_choice` auto/none/required; temperature fixed 1.0, `top_p` 0.95; return the full assistant message (reasoning) on multi-turn tool calls [V S21] |
| GLM-5.3 | **Text only** [V S22] (GLM-5.3-Flash has native vision [V S22]) | Text | — | none | Reasoning cannot be disabled [V S22] |
| DeepSeek V4.1 Flash | Text, image ("native multimodal visual understanding") [V S23] | Text | not stated | none documented | Pass `reasoning_content` back when tools are present; `temperature` ignored in thinking mode [V S23] |
| MiMo V2.6 Pro | "Full-modal Understanding" (text, image, audio, video) [V S24] | Text | not stated | Vendor claims native computer-use ability, no tool API documented [V S24] | Vendor blog "Diagnosing and Mitigating Tool-Call Repetition in MiMo-V2.6" (not read) [V S24] |
| Gemini 3.8 Flash | Text, image, video, audio, PDF [V S25] | Text | native PDF | **Computer use "Supported (Preview)"** [V S25] | Function calling, structured outputs, code execution, caching supported [V S25] |

### Table 3 — vendor positioning (verbatim)

| Model | Quote | Source |
|---|---|---|
| Haiku 5.5 | "For high-volume, latency-sensitive tasks such as classification, extraction, and routing" | [V S1, S4] |
| Haiku 5.5 | "the cheapest, fastest, and most capable small model we’ve ever released." | [V S5] |
| Haiku 5.5 | "It pairs well with Opus 5.5 and Sonnet 5.5 as a subagent on coding work." | [V S5] |
| Haiku 5.5 | "Sonnet 5.5 and Opus 5.5 remain better choices for complex agentic coding tasks like those measured by Terminal-Bench 4.0." | [V S5] |
| Sonnet 5.5 | "The best combination of speed and intelligence" | [V S1] |
| Opus 5.5 | "For long-running agentic coding and knowledge work" | [V S1] |
| Fable 5.1 | "For demanding reasoning and long-horizon agentic work" | [V S1] |
| Anthropic default | "start with Claude Opus 5.5 for most workloads" | [V S1] |
| Plans page, API section | Fable 5.1 "Next generation intelligence for long-running agents"; Opus 5.5 "Daily driver for agentic coding and enterprise work"; Sonnet 5.5 "High-performance model for coding and agents"; Haiku 5.5 "Fastest, most cost-efficient model" | [V S28] |
| Haiku 4.5 | "Claude Haiku 4.5 is a legacy model; Claude Haiku 5.5 is the current Haiku model." | [V S10] |
| GPT-6 Astra | "Our most capable model for the most demanding work." | [V S16] |
| GPT-6.1 Sol | "delivers near-Astra performance at a lower cost for complex coding, computer use, and professional work" | [V S16] |
| GPT-6 Luna | "Our most efficient model for focused, high-volume tasks." | [V S16] |
| Grok 4.7 | "SpaceXSI's frontier model for coding, agentic tasks, and knowledge work." | [V S20] |
| Kimi K3 | "our flagship model for long-horizon coding and end-to-end knowledge work" | [V S21] |
| GLM-5.3 | "Z.ai's latest flagship model, delivering comprehensive advancements in complex software engineering and agent capabilities." | [V S22] |
| DeepSeek V4.1 Flash | "the smallest model in our new architecture family, with native multimodal visual understanding." | [V S23] |
| MiMo V2.6 Pro | "Our most powerful flagship reasoning model to date — omni-modal, ultra-high performance, trillion-parameter" | [V S24] |
| Gemini 3.8 Flash | "our most intelligent Flash model, engineered for long-horizon software engineering, autonomous agents, and complex enterprise workflows" | [V S25] |

### Table 4 — Haiku 5.5 vendor-reported benchmarks (Anthropic-run, max effort unless noted; NOT independent)

| Benchmark | Haiku 5.5 | Haiku 4.5 | Sonnet 5.5 | Opus 5.5 | GPT-6 Luna |
|---|---|---|---|---|---|
| Terminal-Bench 4.0 (Claude Code, 10 trials/task for Haiku) | 39.2 ±1.9 | 0.0 | 70.6 ±2.5 | 66.4 ±2.6 (xhigh) | 16.4 ±2.7 (public leaderboard, Codex CLI max) |
| Terminal-Bench-Science 0.1 | 20.6 ±3.7 | 0.1 | 59.9 | 58.7 | not reported |
| FrontierCode 1.1 Main | 46.4 (max), 45.8 (xhigh) | — | 46.2 (max), 52.1 (xhigh) | — | 42.4 |
| FrontierCode Extended | 58.4 (max) | — | 59.1 (max), 64.4 (xhigh) | — | — |
| SWE-bench Pro / Multilingual / Multimodal | 64.8 / 83.7 / 30.7 | — / 67.4 / 19.8 | 81.3 / 90.3 / 54.3 | — | — |
| FrontierSWE v2 | 43.8 | — | — | — | (Fable 5 47.0; GPT-5.6 Sol 32.2) |
| ProgramBench (166 tasks) | 82.0 | — | 79.7 | 91.2 | — |
| OSWorld 2.1 offline subset (82 of 108 tasks), partial / strict | 72.4 / 37.1 | 15.7 | 83.9 / 48.8 | 87.2 / 53.2 | 48.9 (Anthropic ran it via OpenAI's API) |
| Humanity's Last Exam, no tools / with tools | 45.9 / 57.4 | 10.2 / 18.7 | 56.9 / 64.5 | — | — |
| OfficeQA / OfficeQA Pro | 73.5 / 60.3 | 63.0 / 47.1 | 76.9 / 65.6 | — | — |
| GDPval-AA v2.1 (Elo) · AA-Briefcase v1.1 | 1620 · 1578 | 735 · 614 | 1840 · 1824 | — | 1437 · 1336 |
| HealthBench Professional (length-adjusted) · Chartography no tools | 64.8 · 46.4 | 32.2 · 6.4 | 69.2 · 61.6 | — | — · 29.1 |

Source: Haiku 5.5 System Card sections 8.1-8.10 and announcement [V S6, S5]. Leaderboard context in the same card: Terminal-Bench 4.0 GPT-6 Sol 49.4 ±3.2, GPT-6.1 Sol 58.2 ±3.1, GPT-6 Astra 58.2 ±2.8 (OpenAI-reported 57.9 at high effort), all Codex CLI at max effort [V S6]. The system card's OSWorld numbers use the 82-task offline subset and are not comparable with the earlier full-set figure (catalog: Opus 5.5 81.8). Context caveat: benchmark runs use "adaptive thinking at max effort" with up to the 1M window [V S6]; cost per task is not in the tables.

### Table 5 — effort curves from the Haiku 5.5 system card figures (vendor-published plots; values read by eye, about ±2 points and ±15% on cost or tokens, except the HLE score labels which are printed on the chart)

| Figure | Haiku 5.5 low / medium / high / xhigh / max | GPT-6 Luna | Sonnet 5.5 | Opus 5.5 / others |
|---|---|---|---|---|
| OSWorld 2.1 offline, partial score at mean $/task (Fig 8.9.3.B; Anthropic-run) | 42% at $0.07 / 53% at $0.12 / 61% at $0.18 / 68% at $0.28 / 72.4% at $0.55 | 19% at $0.04, then 37.5% at $0.12, 42.5% at $0.14, 45% at $0.17, 49% at $0.21 (low to max) | 58% at $0.70, 66% at $0.9, 73% at $1.1, 81% at $2.2, 84% at $5.6 | Opus 5.5 64% at $1.0 up to 87% at $8.7; GPT-6.1 Sol 66-77% at $1.0-1.9; Haiku 4.5 15.7% at about $1.45 |
| OSWorld 2.1 offline, strict pass rate (Fig 8.9.3.C) | 13% / 21% / 27% / 30.5% / 37.1% | 3%, 11.6%, 13%, 14.8%, 17% | 24% at $0.68 up to 48.8% at $5.6 | Opus 5.5 28.7% at $1.0 up to 53.2% at $8.7; GPT-6.1 Sol 33-41% |
| HLE with tools, score (labels printed) at cost/task (Fig 8.8.1.A) | 38.6% (about $0.005) / 45.0% ($0.025) / 50.1% ($0.075) / 54.8% ($0.27) / 57.4% ($0.65) | not shown | 47.6% / 50.5% / 56.7% / 62.0% / 64.5% (about $0.075 up to $2.2) | Opus 5.5 57.4% / 63.0% / 63.9% / 66.4% / 67.7% (about $0.075 up to $2); Haiku 4.5 18.7% at 60K thinking budget. Opus and Sonnet costs assume a perfect cache hit rate; Haiku costs use list price on recorded usage (not like for like) |
| FrontierCode Main, score at output tokens/task (Fig 8.3.A; Cognition ran every model; Claude in Claude Code, GPT in Codex; x-axis tokens, not $) | 34.7% at 24K tokens / 41.6% at 36K / 41.9% at 56K / 45.8% at 100K / 46.4% at 178K | 17% at 13K (`none`); 42.4% at about 58K (`max`) | xhigh 52.1% at about 48K; max 46.2% at about 570K (max is worse than xhigh and 12x the tokens) | Opus 5.5 about 47% at 9K, 54.6% at 19K, max 54.4% at about 170K; GPT-6 Sol max about 49.3% at 42K; Fable 5.1 max about 50.3% at 90K |

Reading: for Haiku 5.5, `medium` -> `high` adds about 0.3 FrontierCode points for about 55% more output tokens, `xhigh` adds about 4 points for about 80% more, `max` adds 0.6 for about 80% more again; on HLE, going up from `medium` (to high, xhigh, max) adds about 5, 5 and 3 points while cost per task rises about 3x, 3.6x and 2.4x. Inference: these same-benchmark price points support `medium` as the worker default and `high`/`xhigh` only where the task is checked and valuable. These are vendor-published figures, not an independent sweep.

### Notes by model

- **Haiku 5.5 prompting facts that change orchestration** [V S7]: at `low` effort in long agent prompts it "is more likely to skip a search, stop early, or skip a check"; Anthropic's fix is a system-prompt paragraph telling it to keep working until done and run a real check before reporting. It treats user text inside `tool_result` blocks as untrusted (trained against prompt injection), so mid-turn user input must go in a user turn. At `xhigh` in multi-turn chats it sometimes writes the whole answer in thinking and returns no visible text (check for empty replies). Telling it to "answer directly" did not stop thinking in Anthropic's tests; lower effort does.
- **Haiku 5.5 safety classifiers** [V S5, S7]: cybersecurity safeguards are stricter than Haiku 4.5's, looser than Sonnet 5.5's; they "still block penetration testing"; categories `cyber`, `frontier_llm`, `bio`, `general_harms`; no server-side fallback. Anthropic's own Terminal-Bench run lost 12 of 660 trials to flags (1.8%) [V S6].
- **Claude Code facts** [V S3, S14]: Haiku 5.5 needs Claude Code >= v2.1.293; "On the Anthropic API, Haiku 5.5 runs with the 1M context window on every plan"; sessions auto-compact near 967K. Built-in Explore subagent runs on the main conversation's model, not Haiku (override by defining a user or project subagent named `Explore` with `model: haiku`); `CLAUDE_CODE_SUBAGENT_MODEL=haiku` plus `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` forces all subagents, teammates and workflow agents (needs v2.1.257+). Subagents inherit the session's thinking setting since v2.1.198. Per-invocation `effort` for subagents needs v2.1.292+.
- **Claude plan facts** [V S28, S29]: individual plans table (Free / Pro / Max 5x / Max 20x): Sonnet and Haiku "Yes" on all four, Opus "No" on Free, Fable "No" on Free, "Usage credits" on Pro and "50% of weekly limits" on Max; every plan has a rolling five-hour session limit and paid plans add weekly limits. Haiku 5.5 window on paid plans: 1M tokens in chat and in Claude Code. The plans page lists the API prices above and puts Haiku 4.5 under "Legacy models".
- **Effort default cross-check** (peer research-2 via board, local probe of the Claude Code 2.1.296 binary registry, [L, unverified by me]): `default_effort` medium for claude-haiku-5-5, claude-sonnet-5-5, claude-opus-5-5 and high for claude-fable-5-1. This agrees with the Claude Code docs [V S3]. The raw API default for Sonnet 5.5 remains `high` [V S8, S10], so a harness that sends no `effort` gets different behavior from Claude Code on Sonnet 5.5.
- **Anthropic cost levers for Haiku 5.5**: minimum cacheable prompt now 512 tokens (4,096 on Haiku 4.5); thinking blocks from all earlier turns stay in context and count as input, so multi-turn agents carry more input tokens than the tokenizer change alone explains [V S7].
- **OpenAI/Codex**: Recommended in Codex: GPT-6.1 Sol for complex coding and agentic work, Luna for "focused, repeatable tasks", Astra for the hardest end-to-end work; "Start with High for Luna or Light for Astra" [V S18]. Codex "Ultra" effort fans out with subagents (refused on lanes per catalog). Current Codex releases do not support `wire_api = "chat"` custom providers (Responses API endpoints only) [V S18]. GPT-5.5 leaves Codex with ChatGPT sign-in on 2026-10-14 [V S18]. A 2026-09-25 image-encoding fix "degraded image understanding in GPT-6 Sol and GPT-6 Luna" before then, so vision or computer-use evidence on those two dated before 09-25 is suspect [V S19].
- **Vendor-documented routes into other harnesses** [V S21, S22, S23, S24]: Kimi documents K3 in Claude Code (`ANTHROPIC_BASE_URL=https://api.moonshot.ai/anthropic`, `kimi-k3[1m]`; its example puts `kimi-k2.7-code` on the haiku tier), Codex (Kimi Responses API), OpenCode and Hermes Agent. Z.ai: Claude Code and Goose at `https://api.z.ai/api/anthropic`, Codex at `https://api.z.ai/api/v1`; Coding Plan tiers Max, Pro, Lite. DeepSeek: `https://api.deepseek.com/anthropic` with `deepseek-flash[1m]` (haiku tier and `CLAUDE_CODE_SUBAGENT_MODEL` set to plain `deepseek-flash`). MiMo: OpenAI Responses-compatible API "supported in the latest Codex" and a Claude Code integration page. This confirms the catalog's "K3 also via Claude Code / Codex base URL".
- **Kimi/Z.ai/MiMo subscriptions**: K3 needs a minimum $1 top-up and the Kimi Code subscription API is separate from the platform API [V S21]; the GLM Coding Plan uses a points quota and charges 50% points off-peak including weekends [V S22]; MiMo has Token Plan subscriptions and a 50% Batch API [V S24].
- **Gemini 3.8 Flash model card** (Google, vendor-run, older competitor columns): DeepSWE v1.1 73.7, Terminal-Bench 4.0 19.1, OSWorld-2.0 partial 59.0, GDPval-AA v2 1545; cutoff March 2026; built on Gemini 3.7 Flash [V S25]. DeepSeek V4.1 Flash release notes list Terminal-Bench 4.0 31.2, DeepSWE v1.1 74.2, HLE 36.8, Chartography w/tools 78.9 (harness and effort not stated in that release note) [V S23]. GLM-5.3: Terminal-Bench 3.0 28.3, DeepSWE v1.1 66.9, Agents' Last Exam 28.5 [V S22]. All vendor-run; the independent lanes decide ranks.

### Dated events (for "Keeping it current")

| Date | Event | Source |
|---|---|---|
| 2026-10-14 | OpenAI retires GPT-5.5 from Codex and ChatGPT sign-in (API unaffected) | [V S18] |
| 2026-10-14 18:00 UTC+8 | MiMo V2.5-Pro / V2.5 requests auto-route to V2.6-Pro / V2.6-Flash; old ids invalid 2026-10-21 10:00 UTC+8 | [V S24] |
| 2026-10-15 | Earliest possible retirement of `claude-haiku-4-5-20251001` ("not sooner than"); needs a deprecation notice with >=60 days first; none issued | [V S9] |
| 2026-11-30 | Claude Sonnet 4.5 retires on the Claude API (deprecated 2026-09-30, replacement `claude-sonnet-5-5`) | [V S9] |
| 2027-01-01 | Gemini 3.8 Flash introductory price ends: 0.75 / 3.75 -> 1.50 / 7.50 | [V S25] |
| 2027-09-01 / 09-22 / 09-28 / 10-07 | Earliest retirement floors Fable 5.1 / Opus 5.5 / Sonnet 5.5 / Haiku 5.5 | [V S9] |

## Gaps

- **Tokens per second**: no vendor publishes it for any model in scope; only qualitative labels (Haiku 5.5 "Fastest", GPT-6 "Fast"), Opus Fast mode (up to 2.5x), Ultrafast (6x price) and MiMo UltraSpeed ("up to 20x"). Independent speed belongs to the Artificial Analysis lane.
- **Claude plan access for Haiku 5.5**: resolved only at family level. The plans table lists "Haiku" as available on Free, Pro, Max 5x and Max 20x (Opus: No on Free; Fable: No on Free) [V S28], and the help center lists Claude Haiku 5.5 at 1M tokens for chat and Claude Code on paid plans [V S29]; the announcement says nothing about plans. A third-party claim that Haiku 5.5 is "not on the Free plan" [P S27] conflicts with the family-level "Yes" and is unverified. How much of a subscription's session or weekly limit a Haiku 5.5 turn consumes: unknown.
- **Codex harness window and default effort** for GPT-6 models are not on any vendor page (API: 1,050,000); Astra's default effort is not stated. Needs the local-probe lane (`~/.codex/models_cache.json`).
- **Knowledge cutoffs** not published for Grok 4.7, K3, GLM-5.3, DeepSeek V4.1 Flash, MiMo V2.6.
- **K3**: official release date, the "256K on lower plans" claim, and any computer-use support are not in the Moonshot API docs. **MiMo V2.6 Pro**: effort levels, release day and computer-use API not found. **Gemini 3.8 Flash**, **GLM-5.3**: rate limits not captured.
- **Anthropic Models API `capabilities` object** (exact per-model flags) needs an API key; not read (credentials out of scope).
- **Haiku 5.5 on Bedrock/Vertex**: regional availability, quotas and structured-output gap noted, but per-region pricing not read (partner-operated pricing is set by AWS and Google) [V S2].
- PDF input for OpenAI, xAI, DeepSeek, MiMo, K3 is not stated on their model pages; marked "not stated", not "unsupported".
- Parallel tool-call behavior and per-vendor limits on tools per request were not compared; the Anthropic Haiku 5.5 pages say nothing about parallel calls. Not decision-relevant until a role needs it.
- Cost per task appears in the Haiku 5.5 system card only as chart axes (OSWorld, HLE, DRACO, WANDR, Chartography); I read OSWorld, HLE and FrontierCode by eye (Table 5, approximate), not DRACO, WANDR or Chartography. Cognition's FrontierCode files report tokens, not cost, for Haiku 5.5. No chart is independent of Anthropic's setup (Luna's OSWorld run was Anthropic's, with OpenAI's own context compaction).

## Sources

All accessed 2026-10-13. Raw copies are in the session scratchpad (not in the repo).

- [S1] Claude models overview — https://platform.claude.com/docs/en/models/overview (via /about-claude/models/overview) — compare table, ids per platform, latency, retirement floors, legacy list — vendor docs, primary. Re-check on every new Claude model.
- [S2] Claude pricing — https://platform.claude.com/docs/en/about-claude/pricing — price table incl. Haiku 5.5 tiers, long-context rule, data residency, Fast mode — vendor, primary. Re-check on every release or price change (Sonnet 5.5 cache read changed 2026-10-07).
- [S3] Claude Code model configuration — https://code.claude.com/docs/en/model-config (raw .md) — aliases per provider, effort defaults, thinking-off rule, 1M context, version history — vendor, primary. Re-check whenever an alias moves.
- [S4] Claude Haiku 5.5 model page — https://platform.claude.com/docs/en/models/haiku-5-5/overview — specs, price tiers, release date, retirement, platforms — vendor, primary.
- [S5] Introducing Claude Haiku 5.5 — https://www.anthropic.com/claude-haiku-5-5 (HTML parsed locally) — positioning, vendor benchmark table, Sonnet 5.5 cache cut, API credits — vendor launch post, vendor-run numbers.
- [S6] Claude Haiku 5.5 System Card (PDF, 13 MB, pdftotext) — https://www-cdn.anthropic.com/e1080d6bf5ae2018ea3c2f414064be03232f5be5/Claude%20Haiku%205.5%20System%20Card.pdf — sections 2, 8.1-8.10 — effort settings, SE, trials, leaderboard context — vendor, primary; Anthropic-run comparisons.
- [S7] Haiku 5.5 What's new / Migration guide / Prompting guide — https://platform.claude.com/docs/en/models/haiku-5-5/whats-new-haiku-5-5 ; .../migration-guide ; https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-haiku-5-5 — quirks, ids per platform, tokenizer, behaviors — vendor, primary.
- [S8] Effort — https://platform.claude.com/docs/en/build-with-claude/effort — levels, defaults per model, thinking-off rules — vendor, primary.
- [S9] Model deprecations — https://platform.claude.com/docs/en/about-claude/model-deprecations — status table, retirement floors, 60-day notice rule, Sonnet 4.5 retirement — vendor, primary. Re-check weekly while Haiku 4.5 is legacy.
- [S10] Model pages — https://platform.claude.com/docs/en/models/{opus-5-5,sonnet-5-5,fable-5-1,haiku-4-5}/overview and whats-new pages for Opus 5.5 / Sonnet 5.5 (raw .md) — release dates, forced-tool-use rule, Haiku 4.5 specs — vendor, primary.
- [S11] Computer use tool / Browser use tool — https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool ; .../browser-use-tool — supported-model lists, platform status, token overhead — vendor, primary.
- [S12] Vision / PDF support — https://platform.claude.com/docs/en/build-with-claude/vision ; .../pdf-support — image and page limits — vendor, primary.
- [S13] Rate limits / Service tiers / Fast mode — https://platform.claude.com/docs/en/api/rate-limits ; .../api/service-tiers ; .../build-with-claude/fast-mode — tier tables, Priority Tier status, Fast mode scope — vendor, primary.
- [S14] Claude Code subagents — https://code.claude.com/docs/en/sub-agents — subagent model resolution, Explore model — vendor, primary.
- [S15] OpenRouter model list API — https://openrouter.ai/api/v1/models — secondary price/context cross-check only; aggregator, shows cheapest-provider prices, unreliable for non-Anthropic/OpenAI/xAI/Google/Xiaomi rows.
- [S16] OpenAI model pages — https://developers.openai.com/api/docs/models/gpt-6-astra ; .../gpt-6.1-sol ; .../gpt-6-luna — specs, effort, cutoff, tools, usage tiers — vendor, primary.
- [S17] OpenAI pricing — https://developers.openai.com/api/docs/pricing — Standard, Batch, Flex, Fast, Ultrafast tables, short/long context — vendor, primary.
- [S18] OpenAI Codex/ChatGPT models page — https://learn.chatgpt.com/docs/models (redirect of developers.openai.com/codex/models) — Codex recommendations, plan rollout, GPT-5.5 retirement, efforts — vendor, primary. Re-check on every GPT release.
- [S19] OpenAI API changelog — https://developers.openai.com/api/docs/changelog — release dates, Ultrafast, Decisions API, image-encoding fix — vendor, primary.
- [S20] xAI docs — https://docs.x.ai/developers/models/grok-4.7 ; /developers/pricing ; /developers/release-notes (JS app, read with headless Chrome --dump-dom) — specs, prices, efforts, release date — vendor, primary.
- [S21] Moonshot Kimi API docs — https://platform.kimi.ai/docs/pricing/chat ; /docs/guide/kimi-k3-quickstart ; /docs/api/models-overview ; /docs/pricing/limits ; /docs/guide/use-reasoning-effort (.md endpoints) — price, window, effort, limits, quirks — vendor, primary.
- [S22] Z.ai docs — https://docs.z.ai/guides/overview/pricing ; /guides/llm/glm-5.3 ; /release-notes/new-released (.md endpoints) — price, text-only, effort, dates — vendor, primary.
- [S23] DeepSeek API docs — https://api-docs.deepseek.com/quick_start/pricing ; /guides/thinking_mode ; /updates — id, price, peak hours, effort mapping, release notes — vendor, primary.
- [S24] Xiaomi MiMo docs — https://mimo.mi.com/docs/en-US/price/pay-as-you-go ; /quick-start/summary/model ; /news/latest/v2-6 (JS app, headless Chrome) — price, limits, V2.5 retirement, V2.6 claims — vendor, primary.
- [S25] Google Gemini API — https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash ; /pricing ; /changelog ; https://deepmind.google/models/model-cards/gemini-3-8-flash/ — specs, scheduled price rise, GA date, cutoff, vendor benchmarks — vendor, primary. Re-check price before 2027-01-01.
- [S26] WebSearch result snippets from aggregators (devtk.ai, getdeploying.com, anotherwrapper.com, letsdatascience.com, tosea.ai, pricepertoken.com) — used only for the K3 release date and to find official pages — [P], unverified.
- [S27] WebSearch snippet citing apidog.com and testmuai.com on Claude Code plan access for Haiku 5.5 — [P], vendor-adjacent API-tooling blogs, unverified.
- [S28] Claude plans and API pricing page — https://claude.com/pricing — plans comparison (Free / Pro / Max 5x / Max 20x and Team / Enterprise), per-family model access, API price cards with positioning lines — vendor, primary. Re-check on every release.
- [S29] Claude Help Center, "How large is the context window on paid Claude plans?" — https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans — per-model window by surface (chat, Claude Code, Cowork); lists Haiku 5.5 at 1M tokens for chat and Claude Code — vendor, primary ("Updated this week").
