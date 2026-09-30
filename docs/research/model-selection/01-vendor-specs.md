# 01 — Vendor specs (lane research-1)

Accessed 2026-09-30 unless a cell says otherwise. Grades: [V] vendor-official, [B] independent benchmark, [P] practitioner or press, [L] local probe. `[V-sec]` = OpenRouter API metadata, used as secondary cross-check only. Source ids `[S#]` are in `## Sources`. Prices are USD per 1M tokens (MTok). "unknown" means not found, not zero.

## Summary

- **The seed list is stale in three places.** OpenAI shipped `gpt-6.1-sol` on 2026-09-29 [V S22, S25] and Codex now lists Astra, 6.1 Sol and Luna, not `gpt-6-sol` [V S23]. Anthropic's own model page says "start with Claude Opus 5.5 for most workloads" [V S1]. Antigravity's documented roster still stops at Claude 4.6 [V S37].
- **Claude 5.5 line is the cost-tier ladder.** Fable 5.1 is $10/$50, Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Haiku 4.5 $1/$5. All but Haiku have a 1M window at flat price and 128K max output [V S1, S2]. Default effort is `high` (Fable, Sonnet) or `medium` (Opus 5.5) [V S1, S7]. Thinking is adaptive and cannot be disabled on Fable 5.1 and Opus 5.5.
- **Claude tool-use quirk that breaks orchestration harnesses.** Fable 5.1 rejects forced tool use (`tool_choice` `any` or `tool` returns 400) [V S14]. Opus 5.5 and Sonnet 5.5 have the same error [V S4, S5]. Parallel tool calling is "more variable" on Fable 5.1 [V S14].
- **OpenAI GPT-6 family is one shape, three price points.** All have 1.05M context, 128K output, text+image in, text out, and effort `low` to `max` (Sol and Luna also `none`) [V S16-S19]. Prices: Astra $10/$50, 6.1 Sol $2/$10, Luna $0.10/$0.50. Long context above 272K costs 2x input and 1.5x output [V S16, S17]. Codex adds an `ultra` effort tier (parallel subagents) and Fast/Ultrafast speed modes that use 2-8x allowance [V S23, S24].
- **The "Grok ~2M context" claim is real but historical.** `grok-4-1-fast` had a 2M window at $0.20/$0.50 [V S31]. xAI retired it on 2026-05-15 and points users to `grok-4.3` [V S30]. The Grok CLI does not expose it. Local `grok models` shows only `grok-4.7` (default), `grok-4.7-build-fast`, `grok-4.6`, `grok-4.5` [L S27]. Current Grok windows are 500K (4.7, 4.6, 4.5) and 1M (4.3, 4.20) on xAI's own docs [V S28].
- **Cheapest capable long-context options.** Gemini 3.8 Flash is $0.75/$3.75 with a 1M window and audio/video/PDF input, but the price doubles on 2027-01-01 [V S36]. Open-weight flagships (Kimi K3 $3/$15, GLM-5.3 $1.4/$4.4, Qwen3.8-Max ~$2/$6, MiniMax M3 ~$0.30/$1.20, DeepSeek V4 Pro ~$0.66-1.32/$1.98-3.96) all report 1M windows [V/V-sec, see Table 1].
- **Computer use.** Claude's `computer_toolset_20260801` is GA on Fable 5.1, Opus 5.5 and Sonnet 5.5 [V S8]. Haiku 4.5 is not on the supported list. OpenAI lists `computer_use` on all three GPT-6 models [V S16-S18]. Gemini 3.8 Flash has computer use in Preview [V S35]. No computer use was found for Grok or Kimi.
- **Speed is the weakest column.** No vendor publishes tokens/s for the Claude 5.x models (only relative claims: Opus 5.5 "30% faster" than Opus 5, fast mode "up to 2.5x") [V S13]. Published or reported figures: Kimi K2.7 Code HighSpeed "260 tokens/s" [V S42], Gemini 3.8 Flash 305 tok/s with 13.3 s time to first token [B/P, secondary, S49], GPT-6 Sol 104.4 vs Astra 57.7 tok/s [P S48].
- **Re-check candidates.** Haiku 5.5 ("coming weeks" [V S12]), Codex catalog after CLI update, Cursor's list (still GPT-5.6, no GPT-6 [V S38]), Antigravity roster, Gemini Pro successor (none found).

## Findings

### Table 1 — Numeric specs, one row per model

Column key: Ctx = context window; Out = max output; In/Out$ = input/output price; CacheR / CacheW = cache read / write; Batch = batch pricing.

**Anthropic (Claude Code and API)**

| Model | API id (Anthropic / Bedrock / Vertex) | Released | Ctx | Out | In / Out $ | CacheR / CacheW (5m, 1h) | Batch | Speed | Effort levels (default) | Thinking | Knowledge cutoff | Grade / src |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` / `anthropic.claude-fable-5-1` / `claude-fable-5-1` | 2026-09-01 | 1M | 128K | $10 / $50 | $0.25 / $12.50, $20 | $5 / $25 | "Slower" (relative only) | low, medium, high, xhigh, max (`high`); per-message effort (beta) | Adaptive, always on | Jun 2026 (reliable and training) | [V S1, S2, S3, S7] |
| Claude Mythos 5.1 | `claude-mythos-5-1` | announced with Fable 5.1 (date not on page) | 1M | 128K | $10 / $50 | $0.25 / $12.50, $20 | $5 / $25 | unknown | same as Fable 5.1 | same | unknown | [V S2, S14]; restricted to Project Glasswing participants, "contact your Anthropic, AWS, or Google Cloud account team" |
| Claude Opus 5.5 | `claude-opus-5-5` / `anthropic.claude-opus-5-5` / `claude-opus-5-5` | 2026-09-22 | 1M | 128K (300K on Batch with beta header) | $4 / $20 | $0.20 / $5, $8 | $2 / $10 | "Moderate"; "30% faster" than Opus 5; fast mode up to 2.5x at $8 / $40 (research preview, API only, no Batch) | low, medium, high, xhigh, max (`medium`) | Adaptive, always on; `thinking: disabled` returns 400 | Jun 2026 | [V S1, S2, S4, S7, S13] |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` / `anthropic.claude-sonnet-5-5` / `claude-sonnet-5-5` | 2026-09-28 | 1M (Claude Code auto-compacts near 967K) | 128K (300K Batch beta) | $2 / $10 | $0.20 / $2.50, $4 | $1 / $5 | "Fast"; "30%+ faster" than Sonnet 5 | low, medium, high, xhigh, max (`high`); per-message effort (beta) | Adaptive; `between_tools` turns off up-front thinking (works at `high` or below) | Jun 2026 | [V S1, S2, S5, S7, S12, S15] |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` (alias `claude-haiku-4-5`) / `anthropic.claude-haiku-4-5` / `claude-haiku-4-5@20251001` | 2025-10-15 | 200K | 64K | $1 / $5 | $0.10 / $1.25, $2 | $0.50 / $2.50 | "Fastest" (relative only) | effort not supported | Extended (`budget_tokens`), manual | Feb 2025 reliable, Jul 2025 training | [V S1, S2, S6]; retirement "not sooner than October 15, 2026" |
| Claude Opus 5 (legacy) | `claude-opus-5` | before 2026-09 (exact date unknown) | 1M | 128K | $5 / $25 | $0.50 / $6.25, $10 | $2.50 / $12.50 | fast mode $10 / $50 | 5 levels (`high`) | adaptive | unknown | [V S2, S7] |
| Claude Sonnet 5 (legacy) | `claude-sonnet-5` | before 2026-09 | 1M | 128K | $2 / $10 (was to become $3/$15 on 2026-09-01; now standard, "will not occur") | $0.20 / $2.50, $4 | $1 / $5 | unknown | 5 levels (`high`) | adaptive | unknown | [V S2, S7] |
| Claude Fable 5 (legacy) | `claude-fable-5` | before 2026-09 | 1M | 128K | $10 / $50 | $1 / $12.50, $20 | $5 / $25 | unknown | 5 levels (`high`) | adaptive | unknown | [V S2, S7] |

Notes on Anthropic numbers:
- Tokenizer: models from Opus 4.7 onward "produce approximately 30% more tokens for the same text" than Sonnet 4.6 and earlier [V S2]. Compare per-task cost, not only per-MTok.
- Fable 5.1 cache reads are 0.025x base and Opus 5.5 0.05x base; all other Claude models 0.1x [V S2].
- US-only inference (`inference_geo: "us"`) costs 1.1x on all categories [V S2].
- Long context: 1M window "at standard pricing"; a 900K-token request is billed at the 9K rate [V S2].
- Claude Code defaults: `default` alias is Opus 5.5 on Pro, Max, Team, Enterprise, API, Bedrock, Claude Platform on AWS; Foundry defaults to Sonnet 4.5 [V-via-summary S15]. Aliases: `default`, `opus`, `sonnet`, `haiku`, `fable`, `opusplan`. Effort via `/effort`, `--effort`, `CLAUDE_CODE_EFFORT_LEVEL`.
- Subscription note: at Opus 5.5 launch "Pro, Max, Team, and Enterprise" users got "increased five-hour usage limits and a rate limit reset capability" [V-via-summary S13]. Numeric limits: unknown.
- Fallback rule: Fable 5.1 refusals can fall back only to Opus 4.8 or Opus 5 (server-side fallback) [V S14]. Refusals before output are billed for some categories since 2026-09-24.
- Data retention: Fable 5.1 and Mythos 5.1 carry 30-day retention and are not available under zero data retention unless Anthropic authorizes it [V S14].
- Non-default `temperature`, `top_p` or `top_k` returns 400 on Fable 5.1 and Sonnet 5.5 [V S5, S14]. Assistant prefill returns 400 on Fable 5.1 [V S14].

**OpenAI (Codex CLI and API)**

| Model | API id | Released | Ctx | Out | In / Out $ | Cached in / cache write | Batch / Flex, Fast | Long-context tier | Speed | Effort levels (default) | Cutoff | Grade / src |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GPT-6 Astra | `gpt-6-astra` | 2026-09-03 (announced), OR listing 2026-09-04 | 1.05M (922K max input per [P]) | 128K | $10 / $50 | $1 / $12.50 [V-sec] | 50% off; Fast 2x | above 272K: 2x input, 1.5x output ($20 / $75) | 57.7 tok/s [P S48, unverified source]; Ultrafast tier added 2026-09-29 | low, medium, high, xhigh, max (default not on model page); [P] says `high`, `xhigh` or `max` required, `none` rejected; Codex adds `ultra` | 2026-04-30 | [V S17, S21, S22]; [P S47, S48]; [V-sec S45] |
| GPT-6.1 Sol | `gpt-6.1-sol` | 2026-09-29 | 1.05M | 128K | $2 / $10 | $0.10 / $2.50 [V-sec] | 50% off; Fast 2x (per 6-sol page) | above 272K: $4 / $15 (pricing page) | unknown | low, medium, high, xhigh, max (`medium`); Codex reaches `ultra` | 2026-04-30 | [V S19, S21, S22]; "Multi-agent in beta" per changelog |
| GPT-6 Sol | `gpt-6-sol` | 2026-09-22 | 1.05M | 128K | $2 / $10 | $0.20 / $2.50 | 50% off; Fast 2x | above 272K: 2x input and cache, 1.5x output | 104.4 tok/s [P S48] | none, low, medium, high, xhigh, max (`medium`) | 2026-04-20 | [V S16, S21]; not in the API "current frontier" list on 2026-09-30 [V S20]; image-encoding bug fixed 2026-09-25 [V S22] |
| GPT-6 Luna | `gpt-6-luna` | 2026-09-22 | 1.05M | 128K | $0.10 / $0.50 | $0.01 / $0.125 [V-sec] | 50% off; Priority 2x | above 272K: $0.20 / $0.75 | unknown | none, low, medium, high, xhigh, max (`medium` on API; Codex docs say Luna defaults to High) | 2026-05-18 | [V S18, S21, S23]; Codex: reasoning up to Max, not Ultra |
| GPT-5.6 Sol / Terra / Luna (legacy) | `gpt-5.6-sol` etc. | ~2026-07 (date not fetched) | 272K default, 872K max in Codex catalog [L S26] | unknown | Sol $4 / $20; Terra $2 / $12 and Luna $0.20 / $1.20 (Cursor list) | Sol cached $0.40 (Cursor) | unknown | Sol above long ctx $8 / $30 | unknown | low to max, plus `ultra` on Sol and Terra [L S26] | unknown | [L S26], [V S21, S38]; Codex labels them "Older generation" |
| GPT-5.5 | `gpt-5.5` | earlier | 272K [L S26] | unknown | Cursor list $5 / $30 | $0.50 (Cursor) | unknown | unknown | unknown | low, medium, high, xhigh | unknown | Codex: "Legacy coding model"; retires 2026-10-14 [V S23] |

Notes on OpenAI numbers:
- Rate limits, API Tier 5: 15,000 RPM and 40,000,000 TPM (Astra and Sol). Tier 1: 500 RPM and 500K TPM [V S16, S17, S18].
- Endpoints: Chat Completions, Responses, Batch. Realtime, Assistants and fine-tuning not supported on Astra [V S17].
- Tools listed on all three: `web_search`, `file_search`, `image_generation`, `code_interpreter`, `hosted_shell`, `apply_patch`, `skills`, `computer_use`, `mcp`, `tool_search` [V S16-S18].
- Astra is the first OpenAI model at the "Critical" cyber level. Enterprise accounts must enable it in the admin console [P S47]. Astra in Codex needs Plus or higher [V S23].
- Codex access [V S23]: Free/Go get Luna only. Plus, Pro and Business get Astra, 6.1 Sol and Luna. Enterprise and Edu need admin enablement for Sol.
- Codex usage [V-via-summary S24]: Plus about 350-3,000 local messages per 5 hours on Luna. Business 15-160 messages on 6.1 Sol. Pro ($100-$500/month) has no fixed 5-hour limit, and the $500 tier adds "Astra Ultrafast access". Fast and Ultrafast modes use 2-8x allowance. Vanja Petreski [P S48] reports Sol gives about 3x Astra's messages per 5-hour window.
- Codex CLI: 0.158.0 released 2026-09-28; GPT-6 Sol and Luna were added in 0.157.0 on 2026-09-25 [V S25]. The local install is 0.144.6 and its catalog has no GPT-6 entries [L S26]. Update before routing to GPT-6.
- Codex effort names [V S23]: Light, Medium, High, Extra High, Max, "Ultra (parallel subagent processing)". CLI default is Medium.

**xAI (Grok CLI / Grok Build, API)**

| Model | API id | Released | Ctx | Out | In / Out $ | Cached in | Long-context tier | Speed | Effort (default) | Cutoff | Grade / src |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Grok 4.7 | `grok-4.7` | 2026-09-21 | 500K API; Cursor: 256K standard, 500K long | "No text output limit" (OR shows 450K) | $2 / $6 | $0.50 | at or above 200K prompt: $4 / $12, cached $1 (all tokens billed at higher rate) | Fast variant "twice the output speed at twice the price"; tok/s unknown | low, medium, high (`high`), xhigh | May 2026 | [V S28, S29, S32, S39]; 150 rps, 50M TPM; Batch API not supported |
| Grok 4.7 Fast (Grok CLI id `grok-4.7-build-fast`) | not on public API | 2026-09-21 | 500K | unknown | 2x standard ($4 / $12); 1.5x more for long context | unknown | see left | 2x speed | unknown | May 2026 | [V S29, S32]: fast variant "available only in Cursor and Grok Build". The `-build-fast` id appears in [L S27]; no vendor page names that id. Mapping to the fast variant is an inference. |
| Grok 4.6 | `grok-4.6` | 2026-08-12 (OR listing) | 500K | unknown | $2 / $6 | $0.50 | $4 / $12 at 200K+ | unknown | unknown | unknown | [V S28], [V-sec S45] |
| Grok 4.5 | `grok-4.5` | 2026-07-08 (OR listing) | 500K | unknown | $2 / $6 | $0.30 | $4 / $12, cached $0.60 | "80 tokens per second" [P, unattributed search summary] | unknown | unknown | [V S28], [V-sec S45] |
| Grok Build 0.1 | `grok-build-0.1` (alias `grok-build-latest`) | 2026-05-20 (OR listing) | 256K | none stated | $1 / $2 | $0.20 | $2 / $4 | unknown | unknown | unknown | [V S28]; replaces `grok-code-fast-1`; API early access |
| Grok 4.3 | `grok-4.3` | 2026-04 | 1M | unknown | $1.25 / $2.50 | $0.20 | $2.50 / $5 | unknown | `none` and `low` used as retirement targets | unknown | [V S28, S30] |
| Grok 4.20 (reasoning, non-reasoning, multi-agent) | `grok-4.20-0309-reasoning` etc. | 2026-03 | 1M on xAI docs; 2M on OpenRouter | unknown | $1.25 / $2.50 | $0.20 | $2.50 / $5 | unknown | n/a | unknown | [V S28] vs [V-sec S45]: conflict, xAI docs win |
| Grok 4.1 Fast (retired) | `grok-4-1-fast-reasoning`, `-non-reasoning` | 2025-11-19 | 2M | unknown | $0.20 / $0.50 | $0.05 | n/a | unknown | n/a | unknown | [V S31] verbatim: "our best tool-calling model with a 2M context window". Retired 2026-05-15, replaced by `grok-4.3` (low or none effort) [V S30] |
| grok-code-fast-1 (retired) | `grok-code-fast-1` | 2025 | 256K | unknown | original price unknown; the alias now resolves to `grok-build-0.1` ($1 / $2) in xAI page data | unknown | unknown | unknown | n/a | unknown | Retired 2026-05-15 to `grok-build-0.1` [V S28, S30] |

Notes on xAI numbers:
- xAI price fields in the embedded page data are integer units. I converted using the 4.7 row ($2.00 input equals "20000"), so treat sub-dollar conversions as [V, derived].
- Grok Build access: "early beta for all SuperGrok and X Premium Plus subscribers" (announced 2026-05-25) [V S33]; API key auth also works [V S34]. xAI says users can try Grok 4.7 free at x.ai/build [V-via-summary S32]. Grok 4.7 Fast is excluded from Grok Build's free tier [V S29 via search summary].
- Grok Build 1.0.0 shipped 2026-08-07 and runs up to 8 parallel subagents in git worktrees [P, search summary]. Local CLI is 1.0.41 [L S27].
- Grok CLI supports custom models via `~/.grok/config.toml` (any OpenAI-compatible `base_url`) [V S34].

**Google (Gemini API, Antigravity `agy`)**

| Model | API id | Released | Ctx in / out | In / Out $ | Cache / batch | Speed | Thinking levels | Grade / src |
|---|---|---|---|---|---|---|---|---|
| Gemini 3.8 Flash | `gemini-3.8-flash` | 2026-09-02 | 1,048,576 / 65,536 | $0.75 / $3.75 through 2026-12-31; $1.50 / $7.50 from 2027-01-01 | cache $0.075 (then $0.15); batch $0.375 / $1.875 | 305.1 tok/s and 13.3 s time to first token (Artificial Analysis, via [P] summary) | low, medium, high; `minimal` returns an error | [V S35, S36]; [B/P S49] |
| Gemini 3.7 Flash | `gemini-3.7-flash` | 2026-08-13 (OR); page updated Aug 2026 | 1,048,576 / 65,536 | same as 3.8 Flash | same | unknown | not fetched | [V S35, S36] |
| Gemini 3.6 Flash | `gemini-3.6-flash` | 2026-07 (approx) | 1,048,576 / 65,536 (OR) | same as 3.8 Flash | same | unknown | not fetched | [V S36], [V-sec S45] |
| Gemini 3.5 Flash | `gemini-3.5-flash` | May 2026 | 1,048,576 / 65,536 | $1.50 / $9.00 | cache $0.15; batch $0.75 / $4.50 [V-sec] | unknown | not fetched | [V S35, S36] |
| Gemini 3.5 Flash-Lite | `gemini-3.5-flash-lite` | 2026-07 | 1,048,576 / 65,536 (OR) | $0.30 / $2.50 | cache $0.03; batch $0.15 / $1.25 | unknown | not fetched | [V S36] |
| Gemini 3.1 Pro (preview) | `gemini-3.1-pro-preview` (+ `-customtools`) | Feb 2026 (page "Latest update February 2026") | 1,048,576 / 65,536 | $2 / $12 up to 200K; $4 / $18 above | cache $0.20 / $0.40; batch $1 / $6 up to 200K | unknown | not detailed | [V S35, S36] |

Notes on Google numbers:
- Modalities on 3.8, 3.7, 3.1 Pro: input "Text, Image, Video, Audio, and PDF"; output text only [V S35].
- Knowledge cutoff: not published on the model pages I could read.
- Antigravity docs list: Gemini 3.8, 3.7, 3.6 Flash and 3.1 Pro on all plans; Claude Sonnet 4.6 (thinking), Claude Opus 4.6 (thinking) and GPT-OSS-120b on Free, Pro and Ultra; "Nano Banana 2" for image generation. Rate limits differ for Gemini versus Claude/GPT models [V S37]. Docs show no Claude 5.x models; this may be stale.
- `agy` is the successor to Gemini CLI, which was shut down 2026-06-18 [P]. `agy` is not installed locally, so no [L] roster.
- No Gemini Pro newer than 3.1 was found. the-decoder reported "missing frontier models like Gemini 3.5 Pro and Gemini 4" [P S49]. Per-task cost of 3.8 Flash rose about 40% over 3.7 Flash ($0.58 vs $0.40) at identical token prices [P S49].

**Cursor CLI (`cursor-agent`) and Cursor-hosted models**

| Model | Cursor id | Ctx (standard / max) | In / Out $ | Cache read | Notes | Grade / src |
|---|---|---|---|---|---|---|
| Composer 2.5 | `composer-2.5` | 200K / none | $0.50 / $2.50 | $0.20 | "Jointly trained by Cursor and SpaceXAI". Fast variant $3 / $15 (cache read $0.50), the product default. Cursor only, not a public API [P]. Released May 2026 [P]. | [V S38, S39]; [P] |
| Grok 4.7 / 4.6 / 4.5 in Cursor | `grok-4.7` etc. | 256K / 500K | $2 / $6; Fast $4 / $12; 500K variant $4 / $12 (Fast $6 / $18) | $0.50 | Effort xhigh, high (default), medium, low. Fast is the default speed tier on Pro and up. | [V S38, S39] |
| Claude Fable 5.1 in Cursor | `claude-fable-5-1` | 300K / 1M | $10 / $50 | $0.25 | Privacy Mode needs admin approval of Anthropic's retention policy | [V S39] |
| Claude Opus 5.5, Sonnet 5.5 in Cursor | | 1M | $4 / $20; $2 / $10 | $0.20 | Same as Anthropic list | [V S38] |
| Gemini 3.8 Flash in Cursor | `gemini-3.8-flash` | 200K / 1M | $0.75 / $3.50 | $0.075 | Cursor lists $3.50 output vs Google's $3.75; effort high (default), medium, low | [V S38, S39] vs [V S36] |
| Gemini 3.1 Pro | | unknown | $2 / $12 | $0.20 | | [V S38] |
| Meta Muse Spark 1.3 | `muse-spark-1.3` | 300K / 1M | $1.25 / $4.25 | $0.15 | Effort: minimal, low, medium, high (default), extra high, max. "Meta's flagship model", released 2026-09-02 (OR). Multimodal input including video per OR. | [V S39], [V-sec S45] |
| GPT-5.6 Sol / Terra / Luna | | unknown | $4 / $20; $2 / $12; $0.20 / $1.20 | $0.40 / $0.20 / $0.02 | No GPT-6 entries on 2026-09-30 | [V S38] |

- Plans: Pro $20/mo, Pro Plus $60/mo, Ultra $200/mo, Teams $40 or $120 per seat, Start (India only) 649 INR/mo with the Cursor Models pool only [V S38].
- Two usage pools: "Cursor Models" (Grok 4.7/4.6/4.5, Composer 2.5) and "Other Models" (third-party, at API price). Teams and Enterprise add a $0.25/MTok Cursor Token Rate on third-party models [V S38].
- `cursor-agent` is not installed locally. The CLI docs only show `--model "gpt-5"` as an example. CLI model roster: unknown (see Gaps).

**Kimi (Moonshot) and other open-weight flagships**

| Model | API id | Released | Ctx | Out | In / Out $ | Cache | Effort / thinking | Modalities in | Grade / src |
|---|---|---|---|---|---|---|---|---|---|
| Kimi K3 | `kimi-k3` | 2026-07-16; open weights 2026-07-27 (Modified MIT) [P] | 1,048,576 | 943,718 (OR) | $3 / $15 | hit $0.30 | `reasoning_effort` low, high, max (`max`) | text, image, video | [V S40, S41], [V-sec S45], [P] |
| Kimi K2.7 Code | `kimi-k2.7-code` | 2026-06-12 (OR) | 262,144 | 235,929 (OR) | $0.95 / $4.00 (Moonshot); OR $0.67 / $3.35 | hit $0.19 | unknown | text, image (OR) | [V S40], [V-sec S45] |
| Kimi K2.6 | `kimi-k2.6` | earlier | 262,144 | unknown | $0.95 / $4.00 | hit $0.16 | unknown | unknown | [V S40] |
| Kimi Code: K3 | K3 | 2026-07 | up to 1M; "Moderato/Plus members and above"; effort low, high, max | | plan quota | | | | [V S42] |
| Kimi Code: K3 256K | K3 256K | | 256K | | "roughly half the quota" of full K3; no video input | | | | [V S42] |
| Kimi Code: K2.8 Preview | `kimi-for-coding` | | 1M | | "Andante/Plus tier subscribers and above" | | multiple reasoning levels | | [V S42] |
| Kimi Code: K2.7 Code HighSpeed | `kimi-for-coding-highspeed` | | up to 1M per page | | "Allegretto/Pro members and above" | | | | [V S42]: "260 tokens/s inference" |
| DeepSeek V4 Pro | `deepseek-v4-pro` (`-0813` snapshot 2026-08-12) | 2026-04 base | 1M | 384K | miss $0.66-1.32; output $1.98-3.96 (off-peak half of peak; peak 01:00-04:00 and 06:00-10:00 UTC weekdays) | hit $0.022-0.044 | thinking yes | text only | [V S43, ambiguous range], [V-sec S45] ($1.32 / $3.96 for `-0813`) |
| DeepSeek Flash | `deepseek-flash` (V4.1 Flash listed 2026-09-10 on OR) | | 1M | 384K | miss $0.15-0.30; output $0.60-1.20 | hit $0.003-0.006 | thinking yes | text and image (vision yes) | [V S43], [V-sec S45] ($0.30 / $1.20 for v4.1-flash) |
| GLM-5.3 (Z.ai) | `glm-5.3` (also 5.3-Flash, FlashX) | 2026-08-14 [P] | 1M [P, V-sec] | 128K [P]; OR 943,717 | $1.4 / $4.4; Flash $0.15 / $0.50; FlashX $0.37 / $1.25 | cached $0.26; Flash $0.03 | unknown | text only (OR); Flash and FlashX add image, video | [V S44], [V-sec S45], [P S50] |
| Qwen3.8-Max | `qwen3.8-max` | early Aug 2026 (OR `-0902` snapshot 2026-09-03) [P] | 1M | 131,072 (OR) | $2 / $6 | cache $0.25 (OR) | unknown | text, image, video (OR) | [P S50], [V-sec S45]; 2.4T total, 95B active |
| MiniMax M3 | `minimax-m3` | 2026-06-01 [P] | 1M | 512K | about $0.30 / $1.20 (varies by provider) | $0.06 (OR) | unknown | text, image, video | [P S50], [V-sec S45]; 428B MoE, about 23B active |

- Local `opencode models` [L S46] shows two catalogs. `opencode/` (Zen) hosts Claude Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 4.5, GPT-5.x, `gpt-6-astra`, `gpt-6-sol`, `gpt-6.1-sol`, `gpt-6-luna`, Gemini 3.x, Grok 4.5-4.7, `grok-build-0.1`, `kimi-k2.5`. `opencode-go/` adds `kimi-k3`, `kimi-k2.7-code`, `glm-5.3`, `deepseek-v4-pro`, `qwen3.8-max`, `minimax-m3`, `mimo-v2.6-pro`, `longcat-2.0`, `hy4-preview`, plus `gpt-6-luna`, `grok-4.7`. OpenRouter is also wired (292 ids).
- Hermes v0.18.2 is installed locally [L]; Pi is not. Neither exposes a fixed roster (provider-agnostic).

### Table 2 — Modalities and computer use matrix

| Model | Image in | Multi-image | PDF | Audio in | Video in | Out | Computer use / browser use | Grade / src |
|---|---|---|---|---|---|---|---|---|
| Claude Fable 5.1 | yes | yes: up to 600 images and 600 PDF pages per request (100 for 200K-context models); each image up to 8000x8000 px, but above 20 images per request each must be 2000 px or less; high-res tier 2576 px / 4,784 visual tokens | yes, 32 MB request cap | no | no | text | `computer_toolset_20260801` and `browser_toolset_20260801` (about 4,500 and 6,600 tool-definition tokens); GA on Claude API and Google Cloud, Beta on Bedrock, Claude Platform on AWS, Foundry | [V S1, S3, S8, S9, S10, S2] |
| Claude Opus 5.5 | yes | yes (same) | yes | no | no | text | same toolset; the older `computer_20251124` is rejected on Claude API and Google Cloud; Bedrock accepts both. OSWorld 2.1: 81.8% partial credit (vendor-reported) | [V S4, S8, S13] |
| Claude Sonnet 5.5 | yes | yes (same) | yes | no | no | text | same toolset. OSWorld 2.1: 80.1% partial credit (vendor-reported). "first Sonnet model to beat Pokemon Red from screenshots alone" | [V S5, S8, S12] |
| Claude Haiku 4.5 | yes | yes, cap 100 images and 100 PDF pages (200K window); standard-resolution tier (1568 px, 1,568 tokens) | yes | no | no | text | not on the `computer_toolset_20260801` supported list; older toolset support for Haiku: unknown | [V S6, S8, S9, S10] |
| Claude Mythos 5.1 | yes | yes | yes | no | no | text | supported (listed) but restricted access | [V S8] |
| GPT-6 Astra | yes | unknown limit | not stated on model page (OR shows `file` input) | no | no | text | `computer_use` tool listed | [V S17], [V-sec S45] |
| GPT-6.1 Sol / GPT-6 Sol | yes | unknown limit | as above | no | no | text | `computer_use` listed | [V S16, S19] |
| GPT-6 Luna | yes | unknown limit | as above | no | no | text | `computer_use` listed | [V S18] |
| Grok 4.7 / 4.6 / 4.5 | yes | unknown | `file` on OR only | no | no | text | none listed. Tools: function calling, web search, X search, code execution | [V S29], [V-sec S45] |
| Grok Build 0.1 | yes | unknown | `file` on OR only | no | no | text | none listed | [V-sec S45] |
| Gemini 3.8 Flash / 3.7 / 3.5 | yes | unknown limit | yes | yes | yes | text | computer use "Supported (Preview)" | [V S35] |
| Gemini 3.1 Pro | yes | unknown limit | yes | yes | yes | text | not listed | [V S35] |
| Composer 2.5 (Cursor) | "including images for vision-capable models"; Composer 2.5 vision unknown | unknown | unknown | unknown | unknown | text | Cursor agent has a Browser tool (screenshots, testing) available to all models | [V S39] |
| Kimi K3 | yes | unknown | unknown | no | yes | text | none listed | [V S41] |
| Kimi K2.7 Code | yes (OR) | unknown | unknown | no | no | text | none listed | [V-sec S45] |
| DeepSeek V4 Pro / Flash | Pro no; Flash yes | unknown | no | no | no | text | none listed | [V S43] |
| GLM-5.3 / Qwen3.8-Max / MiniMax M3 | GLM-5.3 no; Qwen and MiniMax yes | unknown | unknown | Qwen3.8 Omni Flash has audio (OR) | Qwen, MiniMax yes | text | none listed | [V-sec S45], [P] |

Tool-use quirks by vendor:
- Claude Fable 5.1, Opus 5.5 and Sonnet 5.5: forced tool use unsupported; `tool_choice` `auto` and `none` work. Fix: `strict: true`, structured outputs, or prompt instruction [V S14, S4, S5]. Parallel tool calls "more variable" on Fable 5.1, with a one-line batching instruction as the documented fix [V S14]. Text between tool calls returns in `thinking` blocks that are empty at the default `display`; `display: "updates"` (beta) restores it [V S14, S4].
- Claude thinking blocks are bound to the producing model. Earlier models cannot read Fable 5.1 thinking blocks, and editing earlier turns invalidates them (enforced for accounts created on or after 2026-08-31) [V S14]. This affects any router that swaps models mid-conversation.
- OpenAI: forced tool use and parallel tool behavior: unknown, not documented on the model pages. Tool search and skills are first-class tools [V S16].
- xAI and Gemini: forced tool use and parallel calls: unknown. Gemini offers a `gemini-3.1-pro-preview-customtools` variant "for those building with a mix of bash and custom tools" [V S35].

### Table 3 — Vendor positioning quotes (verbatim, 25 words or fewer)

| Model | Quote | Grade / src |
|---|---|---|
| Claude Fable 5.1 | "For demanding reasoning and long-horizon agentic work" | [V S1] |
| Claude Fable 5.1 (usage guidance) | "Use Claude Fable 5.1 for demanding reasoning and long-horizon agentic work, or when your evals on Claude Opus 5.5 at higher effort still fall short." | [V S1] |
| Claude Opus 5.5 | "For long-running agentic coding and knowledge work" | [V S1] |
| Claude Opus 5.5 (default pick) | "start with Claude Opus 5.5 for most workloads." (Fable 5.1's own page still says Opus 5: stale) | [V S1] vs [V S3] |
| Claude Opus 5.5 (launch) | performing "at the level of Claude Fable 5.1 on most work" (quote as relayed by fetch summary; recheck against source) | [V S13] |
| Claude Sonnet 5.5 | "The best combination of speed and intelligence" | [V S1, S5] |
| Claude Sonnet 5.5 (launch) | "well-scoped everyday tasks, fixing bugs, and creating polished documents" (as relayed by fetch summary) | [V S12] |
| Claude Haiku 4.5 | "The fastest model with near-frontier intelligence" | [V S1, S6] |
| GPT-6 Astra | "Our most capable model for the most demanding work." | [V S17, S20] |
| GPT-6 Astra (Codex) | "Choose Astra when a task needs the strongest capability across steps and tools." | [V S23] |
| GPT-6.1 Sol | "Near-Astra performance for complex work at a lower cost." | [V S19, S20] |
| GPT-6.1 Sol (Codex) | "Consider GPT-6.1 Sol for work across code, apps, and documents when cost matters." | [V S23] |
| GPT-6 Sol | "Built for complex coding and agentic workflows" | [V S16] |
| GPT-6 Luna | "Our most efficient model for focused, high-volume tasks." | [V S18] |
| GPT-6 Luna (Codex) | "Choose Luna for specific, high-volume tasks when you know what a good result looks like" | [V S23] |
| Grok 4.7 | "our most capable model for coding and knowledge work" | [V S32] |
| Grok 4.7 (docs) | "SpaceXAI's frontier model built for coding, agentic tasks, and knowledge work" | [V S29] |
| Grok Build | "a powerful and extensible coding agent" | [V S34] |
| Gemini 3.8 Flash | "Our most intelligent Flash model, engineered for long-horizon software engineering, autonomous agents, and complex enterprise workflows" | [V S35, S36] |
| Gemini 3.1 Pro | "Our 3rd generation Pro model, built for multimodal understanding, agentic capabilities, and vibe-coding." | [V S36] |
| Gemini 3.5 Flash-Lite | "A cost-efficient model, optimized for high-volume agentic tasks, translation, and simple data processing." | [V S36] |
| Composer 2.5 | "Cursor's own agentic model." | [V S39] |
| Muse Spark 1.3 | "built for agentic coding: long tool-use chains, multi-step debugging, and large-repository work." | [V S39] |
| Kimi K3 | "our flagship model for long-horizon coding and end-to-end knowledge work" | [V S41] |
| Kimi K2.7 Code HighSpeed | "260 tokens/s inference" (speed claim, K2.7 Code HighSpeed) | [V S42] |

### Vendor benchmark claims (context only; other lanes own benchmarks)

All [V] and vendor-reported, not independent.

- Fable 5.1 [V S11]: Terminal-Bench 4.0 55.8% (Fable 5: 42.0%; Mythos 5.1: 60.9%); OSWorld 2.0 77.9% partial; CursorBench 3.2.0 73.4%; Humanity's Last Exam 60.9% (no tools).
- Opus 5.5 [V S13]: Terminal-Bench 4.0 66.4%; FrontierCode v1.1 54.4%; CursorBench 4.0 57.8%; GDPval-AA v2.1 1846; OSWorld 2.1 81.8% partial.
- Sonnet 5.5 [V S12]: Terminal-Bench 4.0 70.6%; CursorBench 4.0 55.5%; GDPval-AA v2.1 1844; FrontierCode 1.1 46.2% at Max; OSWorld 2.1 80.1% partial. Terminal-Bench numbers were relayed by a fetch summary and Sonnet 5.5 outscoring Opus 5.5 on Terminal-Bench 4.0 looks anomalous; confirm from source before use.
- Grok 4.7 [V S32]: CursorBench 4.0 46.3%; DeepSWE v1.1 71.0%. Gemini 3.8 Flash: DeepSWE v1.1 73.7% vs Opus 5 74.0% and GPT-5.6 Sol 72.7% [P S49, vendor figure repeated by press].
- Artificial Analysis Intelligence Index [B, via press]: Gemini 3.8 Flash 59, "matching GPT-5.6 Sol and Grok 4.6" [P S49]; Astra 53 vs Sol 48 [P S48]. These two figures use different index versions and do not compare with each other.

### Discrepancies found

1. Codex docs list `gpt-6.1-sol`; the seed list and the API index for GPT-6 Sol differ. API index treats 6.1 Sol as current and 6 Sol as older [V S20, S23].
2. Fable 5.1's model page says "start with Claude Opus 5"; the models overview says Opus 5.5 [V S3 vs S1].
3. Gemini 3.8 Flash output: $3.75 (Google) vs $3.50 (Cursor list) [V S36 vs S38].
4. Grok 4.20 context: 1M on xAI docs, 2M on OpenRouter [V S28 vs V-sec S45]. The 2M figure matches the retired Grok 4.1 Fast, and possibly xAI's launch marketing for 4.20. It is not on the current xAI page.
5. Claude Code `/fast`: the fetch summary said it "toggles between Opus and Sonnet"; Anthropic's pricing and Opus 5.5 pages define fast mode as faster Opus output at premium price [V S2, S13, S15]. Treat the summary as wrong.
6. Anthropic's Antigravity roster (Claude 4.6) trails Anthropic's own current line (5.5) [V S37 vs S1].

## Gaps

- **Tokens/s** for Claude 5.x, GPT-6.1 Sol, Astra, Grok 4.7: not published by vendors. Only [P] or secondary figures exist (Astra 57.7, Sol 104.4, Gemini 3.8 Flash 305.1). A local timing probe would settle it.
- **Astra default effort** on the API and in Codex: the model page lists levels but no default. [P] says `none` is rejected.
- **Exact plan usage limits** for Claude Code (Pro/Max) and Grok Build: not published in the pages fetched. Codex gives ranges only.
- **Cursor CLI roster and flags**: `cursor-agent` not installed and the docs page shows only `--model "gpt-5"`. Cursor's model list has no GPT-6 yet.
- **Composer 2.5**: vision support, max context beyond 200K, tokens/s for this version: unknown. The 250 tok/s figure I saw was for the original 2025 Composer [P].
- **`grok-4.7-build-fast`**: exists locally [L]; no vendor document. Its mapping to "Grok 4.7 Fast" and its price in Grok Build are unverified.
- **Antigravity / `agy`**: not installed; current CLI roster unverified. The docs page may lag.
- **Gemini** knowledge cutoff, 3.7/3.6 thinking levels, and audio/video price on 3.8 Flash: not extracted.
- **Open-weight flagships** (Qwen3.8-Max, MiniMax M3, GLM-5.3, DeepSeek V4.1): official model cards not fetched; specs rest on search summaries [P] and OpenRouter [V-sec]. DeepSeek's two-number price ranges assume the higher figure is peak-hour pricing, which the page implies but I did not confirm on the raw page.
- **Forced tool use and parallel tools** for OpenAI, xAI, Gemini, Kimi: undocumented on the pages read.
- **Mythos 5.1 release date** and any access terms beyond "Project Glasswing participants only".
- **Fetch method caveat.** Most `WebFetch` results are summaries produced by a small model, not raw page text. Where a number could drive a decision, I cross-checked it against a second source, mostly the OpenRouter API (`/api/v1/models`, pulled 2026-09-30) and raw HTML for xAI, Google and Cursor. Rows tagged "via summary" were not double-checked.
- **Firecrawl and screenshots**: not needed; no page was JS-only after curl fallbacks. No screenshots taken.

## Sources

Re-check on every model release: S1, S2, S7, S8, S15, S17-S20, S22, S23, S27, S28, S35-S38, S42, S45, S46.

- [S1] Claude models overview — https://platform.claude.com/docs/en/models/overview — accessed 2026-09-30 — ids, prices, context, effort default, cutoffs, retirement; high reliability, updates with each release.
- [S2] Claude pricing — https://platform.claude.com/docs/en/about-claude/pricing — 2026-09-30 — full price, cache, batch, fast mode, tokenizer note, computer/browser toolset overhead; high.
- [S3] Fable 5.1 model page — https://platform.claude.com/docs/en/models/fable-5-1/overview — 2026-09-30 — release date, specs; page still recommends Opus 5.
- [S4] Opus 5.5 model page — https://platform.claude.com/docs/en/models/opus-5-5/overview — 2026-09-30 — release date, breaking changes.
- [S5] Sonnet 5.5 model page — https://platform.claude.com/docs/en/models/sonnet-5-5/overview — 2026-09-30 — release date, `between_tools`, sampling params.
- [S6] Haiku 4.5 model page — https://platform.claude.com/docs/en/models/haiku-4-5/overview — 2026-09-30.
- [S7] Claude effort docs — https://platform.claude.com/docs/en/build-with-claude/effort — 2026-09-30 — levels per model, defaults, per-message effort.
- [S8] Claude computer use docs — https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool — 2026-09-30 — supported-model list (fetch summary; medium reliability).
- [S9] Claude vision docs — https://platform.claude.com/docs/en/build-with-claude/vision — 2026-09-30 — image limits, resolution tiers; high (full text).
- [S10] Claude PDF docs — https://platform.claude.com/docs/en/build-with-claude/pdf-support — 2026-09-30 — 600 pages (100 if window under 1M), 32 MB; high (first 2 KB read).
- [S11] Fable 5.1 and Mythos 5.1 announcement — https://www.anthropic.com/claude-fable-and-mythos-5-1 — 2026-09-30 — benchmarks, Mythos access programs; fetch summary.
- [S12] Sonnet 5.5 announcement — https://www.anthropic.com/claude-sonnet-5-5 — 2026-09-30 — speed claim, Haiku 5.5 "coming weeks", benchmarks; fetch summary.
- [S13] Opus 5.5 announcement — https://www.anthropic.com/claude-opus-5-5 — 2026-09-30 — fast mode, plan limits, benchmarks; fetch summary.
- [S14] What's new in Fable 5.1 — https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1 — 2026-09-30 — forced tool use, parallel tools, thinking binding, fallback targets, retention; high (full text).
- [S15] Claude Code model config — https://code.claude.com/docs/en/model-config — 2026-09-30 — aliases, defaults, effort, 1M; fetch summary, `/fast` line judged wrong.
- [S16] OpenAI GPT-6 Sol — https://developers.openai.com/api/docs/models/gpt-6-sol — 2026-09-30 — specs, price, rate limits; summary.
- [S17] OpenAI GPT-6 Astra — https://developers.openai.com/api/docs/models/gpt-6-astra — 2026-09-30; summary.
- [S18] OpenAI GPT-6 Luna — https://developers.openai.com/api/docs/models/gpt-6-luna — 2026-09-30; summary.
- [S19] OpenAI GPT-6.1 Sol — https://developers.openai.com/api/docs/models/gpt-6.1-sol — 2026-09-30; summary. The "release date: April 30" it printed is the cutoff, not the release.
- [S20] OpenAI models index — https://developers.openai.com/api/docs/models — 2026-09-30 — current-model list and one-line descriptions; summary.
- [S21] OpenAI pricing — https://developers.openai.com/api/docs/pricing — 2026-09-30 — long-context and fast tiers; summary.
- [S22] OpenAI API changelog — https://developers.openai.com/api/docs/changelog — 2026-09-30 — release dates (Astra 09-03, Sol/Luna 09-22, 6.1 Sol 09-29, Ultrafast 09-29); summary.
- [S23] Codex models — https://learn.chatgpt.com/docs/models (redirect from developers.openai.com/codex/models) — 2026-09-30 — Codex roster, plan access, effort names, GPT-5.5 retirement; summary.
- [S24] Codex pricing and limits — https://learn.chatgpt.com/docs/pricing — 2026-09-30 — plan limits; summary.
- [S25] Codex changelog — https://learn.chatgpt.com/docs/changelog — 2026-09-30 — CLI versions and model additions; summary.
- [S26] Local `codex debug models` (codex-cli 0.144.6) — [L] 2026-09-30 — catalog with ctx 272K/872K, effort lists, speed tiers; stale relative to S25.
- [S27] Local `grok models` (grok 1.0.41) — [L] 2026-09-30 — Grok CLI roster.
- [S28] xAI models page (embedded page data) — https://docs.x.ai/developers/models — 2026-09-30 — ids, context, price units, rate limits, aliases; parsed from raw HTML.
- [S29] xAI Grok 4.7 docs — https://docs.x.ai/developers/grok-4-7 and /developers/models/grok-4.7 — 2026-09-30 — effort, fast variant, rate limits, cutoff May 2026.
- [S30] xAI May 15 2026 retirement — https://docs.x.ai/developers/migration/may-15-retirement — 2026-09-30 — retired ids and replacements; summary.
- [S31] xAI Grok 4.1 Fast launch — https://x.ai/news/grok-4-1-fast — 2026-09-30 — 2M context quote, price, ids; summary.
- [S32] xAI Grok 4.7 launch — https://x.ai/news/grok-4-7 — 2026-09-30 — positioning, benchmarks; summary.
- [S33] xAI Grok Build launch — https://x.ai/news/grok-build-cli — 2026-09-30 — SuperGrok and X Premium Plus beta access; summary.
- [S34] Grok Build docs — https://docs.x.ai/build/overview.md — 2026-09-30 — CLI usage, custom models; raw text.
- [S35] Gemini API models and per-model pages — https://ai.google.dev/gemini-api/docs/models and `/models/gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.5-flash`, `gemini-3.1-pro-preview` — 2026-09-30 — tokens, modalities, computer use, update dates; raw HTML parsed.
- [S36] Gemini API pricing — https://ai.google.dev/gemini-api/docs/pricing — 2026-09-30 — per-model prices; raw HTML parsed; high.
- [S37] Antigravity models — https://antigravity.google/docs/models — 2026-09-30 — plan roster; summary, possibly stale.
- [S38] Cursor Models and Pricing — https://cursor.com/docs/models — 2026-09-30 — prices, pools, plans; raw HTML parsed.
- [S39] Cursor per-model pages — https://cursor.com/docs/models/cursor-composer-2-5, `grok-4-7`, `muse-spark-1-3`, `claude-fable-5-1`, `gemini-3-8-flash` — 2026-09-30 — context, effort, positioning; raw HTML parsed.
- [S40] Kimi platform pricing — https://platform.kimi.ai/docs/pricing/chat — 2026-09-30 — K3, K2.7 Code, K2.6 prices; summary.
- [S41] Kimi K3 guide — https://platform.kimi.ai/docs/guide/use-kimi-k3-model — 2026-09-30 — modalities, reasoning_effort; summary.
- [S42] Kimi Code docs — https://www.kimi.com/code/docs/en/ — 2026-09-30 — plan-gated models, "260 tokens/s"; summary.
- [S43] DeepSeek pricing — https://api-docs.deepseek.com/quick_start/pricing — 2026-09-30 — models and peak/off-peak price; summary, ranges ambiguous.
- [S44] Z.ai pricing — https://docs.z.ai/guides/overview/pricing — 2026-09-30 — GLM-5.x prices; summary.
- [S45] OpenRouter model API — https://openrouter.ai/api/v1/models — pulled 2026-09-30 — context, max output, prices, modalities, listing dates; secondary cross-check only, provider-specific.
- [S46] Local `opencode models` (v1.18.27) and Hermes v0.18.2 version probe — [L] 2026-09-30.
- [S47] Daniel Vaughan, "GPT-6 Astra in Codex CLI" — https://codex.danielvaughan.com/2026/09/04/gpt-6-astra-codex-cli-integration-guide-critical-cyber-threshold/ — 2026-09-30 (page updated same day) — [P] single blogger, no stated conflict; Astra effort constraints, 922K max input.
- [S48] Vanja Petreski, "GPT-6 Sol and Luna" — https://vanja.io/gpt-6-sol-luna/ — 2026-09-30 — [P] single Codex user; tok/s figures and Astra-vs-Sol comparisons; source of the speed numbers unstated.
- [S49] Gemini 3.8 Flash coverage — https://the-decoder.com/gemini-3-8-flash-is-googles-third-budget-model-in-six-weeks-while-frontier-models-remain-mia/ and eesel.ai review (via search) — 2026-09-30 — [P] press; Artificial Analysis 305.1 tok/s and 13.3 s TTFT, DeepSWE figures, per-task cost.
- [S50] Search-result summaries for Kimi K3, MiniMax M3, GLM-5.3, Qwen3.8-Max launches (datanorth.ai, cloudprice.net, zenmux.ai, crnasia.com, others) — 2026-09-30 — [P] release dates and architecture; not vendor pages.
