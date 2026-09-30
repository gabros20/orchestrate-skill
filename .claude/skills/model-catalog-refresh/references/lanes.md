# Lane brief templates

Rendered by `scripts/prepare_run.py` into `.orchestrate/task-N-brief.md`. Placeholders: `{OUT}` the lane's
output file, `{DATE}` today, `{SINCE}` the evidence window start, `{CATALOG}` the current catalog reference.
Lane numbers match the output file numbers (01–08). Edit a template here when a lane's method changes;
record why in the lane's `## Gaps` of the run that taught it.

## Lane 1: Vendor specs
slug: vendor-specs

```brief
Read .orchestrate/research-contract.md first.
For EVERY model in scope, from vendor sources [V] (docs, pricing, model cards, launch posts; OpenRouter
model pages as a secondary cross-check for price/context): API id per platform, release date, context
window (and any long-context price tier), max output, price per MTok (input, output, cache read/write,
batch), speed (tokens/s where published), reasoning/effort levels and default, thinking on/off,
modalities in (text, single image, MULTI-image, PDF, audio, video) and out, computer use / browser use
tool support, tool-use quirks (forced tool use, parallel tools), knowledge cutoff, subscription vs API
availability, rate/usage-limit notes. Also: vendor-stated positioning ("best for …") quoted verbatim.
Flag every change against {CATALOG} (new id, price, context, effort default, status/retirement).
Table 1: one row per model with all numeric fields. Table 2: modalities + computer use matrix.
Table 3: positioning quotes. Budget: be thorough; ~60 fetches is fine.
```

## Lane 2: Live CLI catalogs
slug: cli-catalogs

```brief
Read .orchestrate/research-contract.md first. Grade everything [L] (local probe) unless cited.
Probe what each INSTALLED harness actually exposes on this machine — cheap listing commands only, NO model
turns (no prompts sent), never read auth files:
- claude --version; claude --help (model/effort/aliases lines); docs page code.claude.com/docs/en/model-config for alias targets.
- codex --version; python3 over ~/.codex/models_cache.json (slug, display_name, description, default/supported reasoning levels, context_window, service tiers, upgrade map) — this file is NOT an auth file.
- grok --version; grok models.
- cursor-agent (or agent) --version and its model-listing command (find it via --help).
- agy --version and its model listing (find via --help).
- opencode --version; opencode models (may list providers' models).
- hermes --version and model listing; kimi --version and model config (kimi --help); pi --version; pi --list-models.
For each: exact command, exact output excerpt (trim to the model rows), which models are default, effort
enums, context shown, any price shown, version, date. If a CLI is missing, say so.
Deliver a harness × model availability table (which model ids each CLI can actually run today, with the
exact id string to pass) and per-harness notes (subscription vs API key, quirks).
```

## Lane 3: Independent benchmarks
slug: benchmarks

```brief
Read .orchestrate/research-contract.md first. Grade [B]; note for each benchmark: who runs it, refresh
cadence, contamination/gaming resistance, what capability it isolates, date of the numbers you took.
Cover (current leaderboards, newest models in scope; screenshot JS pages):
- Artificial Analysis: Intelligence Index, Coding Index, Agentic Index, cost to run the index, output speed, latency, context — per model.
- LMArena: Text, WebDev, Vision (and Copilot/coding arena if present) — Elo + CI + votes.
- Terminal-Bench 2.x (tbench.ai) — per model AND per harness/agent where listed (Claude Code, Codex CLI, …).
- SWE-bench Pro (Scale, public + commercial), SWE-rebench (fresh monthly tasks), SWE-bench Verified only as a footnote (saturated/contaminated).
- METR time-horizon (50%/80%) — long-horizon autonomy.
- OSWorld-Verified (computer use), ScreenSpot-Pro, and a vision benchmark (MMMU-Pro or similar); multi-image if any.
- Long context: Fiction.LiveBench, OpenAI MRCR v2, or equivalent — effective context vs advertised.
- Agentic/tool use: tau2-bench, BrowseComp, Vending-Bench; knowledge work: GDPval; reasoning: HLE, ARC-AGI-2/3; LiveBench.
Deliver: one matrix model × benchmark (score, date, source id), then per-capability rankings
(architecture/reasoning, long-horizon agentic coding, terminal work, computer use, vision, long
context, cost-efficiency = score per dollar where AA gives cost), and a "gaming-resistance" rating per
benchmark. Budget: thorough; screenshots are expected.
```

## Lane 4: X practitioner reports
slug: x-reports

```brief
Read .orchestrate/research-contract.md first. Grade [P]. Tool: the xrelay CLI (read-only commands ONLY:
search, user, thread, batch, dedupe — NEVER post/like/reply/follow). Read ~/.claude/skills/x-relay/SKILL.md
first and follow its funnel. NEVER run parallel xrelay calls; serialize with 3s gaps (batch --delay 3000);
on RATE_LIMITED back off by retryAfterMs.
Find real-use comparisons from practitioners (not marketing accounts) since {SINCE} on every model in the
contract's seed list and anything newer you find (especially the models that triggered this run).
system design quality, long-horizon autonomy, instruction following, over-engineering, laziness,
context-rot at long context, tool-use reliability, cost / usage-limit burn, speed, vision/computer use,
"which model for planning vs implementing vs reviewing". Query variants: model names, "vs", "switched from",
"for planning", "for implementation", "Terminal-Bench", "burned through", "usage limit", "context window".
Gate 1 wide (batch ~20 queries, --product Top and Latest), keep ~25 finalists, read threads only for those.
Deliver: per model — strengths, weaknesses, best role, recurring complaints — each backed by 1–3 linked
posts (author, followers, date, engagement, ≤25-word quote); flag conflicts of interest (vendor staff,
paid). Then a "consensus vs contested" table. Save the raw batch archive to .orchestrate/raw/x-corpus.json.
```

## Lane 5: Reddit and HN practitioner reports
slug: reddit-hn

```brief
Read .orchestrate/research-contract.md first. Grade [P].
Sources: Reddit (r/ClaudeAI, r/ClaudeCode, r/codex, r/OpenAI, r/ChatGPTCoding, r/cursor, r/grok,
r/LocalLLaMA, r/singularity, r/Bard, r/kimi) via the ATOM RSS endpoints ONLY — every JSON/HTML path
answered 403 on 2026-09-30, RSS answered 200:
  search  https://www.reddit.com/r/<sub>/search.rss?q=<url-encoded>&restrict_sr=1&sort=top&t=month
  thread  https://www.reddit.com/r/<sub>/comments/<id>/.rss
curl with -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36",
2s between requests, on 429 wait 60s ONCE then move on; parse with python3 xml.etree. RSS has no scores:
rank by comment count and independent agreement. Write partial results to {OUT} after every 3 subs —
a lane that writes nothing for 20 minutes is treated as stuck and stopped.
Hacker News: https://hn.algolia.com/api/v1/search?query=<q>&tags=story, then item comments.
Same angles as the X lane: which model for architecture vs implementation vs review, long-horizon
autonomy, context rot, over-engineering, laziness, tool reliability, cost/usage limits, speed, vision,
computer use — for every model in the contract's seed list and anything newer. Since {SINCE}.
Deliver: per model — strengths/weaknesses/best role with 1–3 linked threads each (score, comments,
date, ≤25-word quote), sample-size caveats, and a consensus-vs-contested table. Note where Reddit and
HN disagree.
```

## Lane 6: How model routers decide
slug: routers

```brief
Read .orchestrate/research-contract.md first.
Study how routing systems pick a model per request/task and which PARAMETERS they use: Not Diamond,
Martian, OpenRouter (Auto router, provider routing, :nitro/:floor), RouteLLM (LMSYS paper + repo),
Arch-Router (Katanemo), Cursor Auto, GitHub Copilot auto model, Requesty/Unify/Portkey routing,
Kilo/Cline/Roo model-selection guidance, and academic work (RouterBench, RouterEval, "Route to Reason",
cost-quality Pareto routing). Also how Artificial Analysis and LMArena suggest choosing.
Deliver: (1) a table of routers × decision inputs (task features, quality prediction, price, latency,
context need, modality, user preference/Pareto weight, fallback/availability); (2) what generalizes to
an orchestrator choosing per ROLE rather than per prompt; (3) a PROPOSED schema for our model-capability
table — every column with its definition, unit, and the source that fills it — and the minimum set of
columns that change a routing decision; (4) a PROPOSED repeatable update procedure: when a new model
ships, which sources to re-run in what order, and how to place it in a tier and a harness row.
```

## Lane 7: Effort curves
slug: effort-curves

```brief
Read .orchestrate/research-contract.md first. Do NOT use xrelay (the X lane owns it).
Question: for each frontier model, how do quality AND cost change with reasoning effort, where does quality
peak, and where does it degrade (overthinking, over-engineering)? Which effort is best for which role?
Models: every model in the contract's seed list, at every effort level its harness offers.
Sources, in order:
1. Artificial Analysis — it lists models per effort (e.g. "<model> (max)"): Intelligence/Coding/Agentic index
   per effort, "tokens used to run the index" per effort, cost to run per effort, output speed. Screenshot the
   per-model pages and the index table filtered to each model. From tokens × price derive the COST MULTIPLIER
   per effort step (state the formula). This is the key table.
2. Vendor effort charts (launch posts often plot score vs cost by effort) — transcribe the plotted points
   with the caveat they are read off a chart.
3. Terminal-Bench / LMArena / SWE-rebench entries that name the effort level; AA's Coding Agent Index
   entries per harness+effort.
4. Vendor guidance text on effort (docs "effort" pages: Anthropic recalibrated levels, Claude Code defaults;
   OpenAI reasoning-effort guidance; Codex "ultra" = automatic delegation).
Deliver: (a) model × effort matrix: score(s), tokens, cost to run, cost multiplier vs that model's default,
latency — with grade + source; (b) per model: the quality peak effort, the "knee" (best score per dollar),
any evidence of degradation above a level; (c) cross-model comparisons at equal cost (e.g. Luna@max vs
Sol@low vs Sonnet 5.5@medium); (d) a recommended effort per role per model, each tied to evidence.
```

## Lane 8: Other labs x harness
slug: other-labs-harness

```brief
Read .orchestrate/research-contract.md first. Do NOT use xrelay.
Cover the current flagship coding/agentic models from labs other than Anthropic/OpenAI/xAI:
Moonshot Kimi (K3, kimi-for-coding, highspeed), MiniMax (current M-series), Meta (Muse / latest Llama-line
agentic model), DeepSeek (V4.x / R-line), Qwen (3.8 / Qwen-Coder), Zhipu GLM (5.x), Google Gemini (3.x Pro/Flash).
For each: exact model ids, release date, open-weight or not, context window, max output, price per MTok
(first-party API and OpenRouter), modalities (vision, multi-image), tool-use reliability notes, reasoning
modes/effort, independent benchmark results (Artificial Analysis indices + cost to run, Terminal-Bench,
SWE-rebench, LMArena WebDev) with dates, and practitioner verdicts (HN / Reddit via RSS:
https://www.reddit.com/r/<sub>/search.rss?q=...&restrict_sr=1&sort=top&t=month with a browser UA, 2s gaps).
HARNESS MAPPING (the key deliverable): which of our harnesses can run each model and how —
Kimi CLI (kimi), opencode (provider ids: check the 02-cli-catalogs.md of this run
for what opencode lists locally; opencode docs for providers), Cursor CLI (cursor-agent model list from Cursor
docs), Pi (provider-agnostic, --model provider/id), Hermes (providers), Antigravity (agy — Gemini).
Give the exact --model string per harness, auth needed (subscription vs API key vs OpenRouter), and quirks.
Deliver: a lab × model spec table, a model × harness availability table with exact ids, benchmark table,
and per-model "best role" with evidence.
```

