# 05 — Reddit and Hacker News practitioner reports (window 2026-08-01 to 2026-09-30)

All claims here are grade [P] (practitioner report) unless marked otherwise. Accessed 2026-09-30.
Access note: Reddit blocked curl, old.reddit.com, headless Chrome and WebFetch, and the Firecrawl scraper
refuses reddit.com ("we do not support this site"). The Chrome extension was not connected. Reddit
evidence below is therefore limited to search-result excerpts (title, relative date, one snippet) obtained
through `firecrawl_search`, with NO scores, NO comment counts (except where the excerpt printed them) and
NO full threads. HN evidence is full-text from the Algolia API (`hn.algolia.com/api/v1/items/<id>`), with
story points and comment counts; HN does not expose per-comment scores. Reddit relative dates ("5 days
ago") are converted to approximate absolute dates against 2026-09-30 (marked "~"). Treat each Reddit row
as one anonymous poster, unverified.

## Summary

- Claude Opus 5.5 (released 2026-09-22) is the current consensus daily driver on both sites: cheaper and
  faster than Fable 5.1, "first real leap since Opus 4.5", far lower quota burn, better prose than Opus 5.
  Contested point: Fable 5.1 still has more "criteria" (planning, design review, hard multi-step judgement).
  [P: S3, S7, S8, R1-R4]
- Role split that practitioners converge on: Fable 5.1 (or Astra max) for architecture, adversarial review and
  orchestration of larger work; Opus 5.5 for implementation and broad refactors; Sonnet 5.5/Luna/DeepSeek/Mimo
  for scoped or mechanical work. Several dissent and use a cheap orchestrator with expensive subagents.
  [P: S4, S9, S10, S11, S13]
- GPT-6 family is polarised. Astra: best for computer use, 3D/Blender/CAD, hard obscure architectural bugs and
  vision; costly and reported to burn quota very fast (one report: 215% of a weekly budget vs 20% for Opus 5.5
  on the same task). GPT-6 Sol and Luna: multiple "downgrade / lazy / poor instruction following" reports on
  both sites vs 5.6. GPT-6.1 Sol shipped 2026-09-29 (after the seed list); unproven. [P: S5, S6, R5-R9]
- Over-engineering: GPT-5.6 Sol widely reported (factory-of-factories); mixed on whether GPT-6 fixed it
  (Reddit: "Sol 6 stops when it finds a problem. It's lazy"; HN: Codex still over-engineers per aleksiy123,
  contradicted by Kovah for Claude vs Codex). Opus 5.5 is reported verbose/cautious. [P: S12, R7-R10]
- Sonnet 5.5 has weak standing: multiple threads say Opus 5.5 at low/medium effort matches or beats it per
  dollar; only defended for "dumb simple thing" tasks. A vendor system-card caveat (fallback-model
  contamination in Terminal-Bench) was surfaced on HN. [P: S8, R11-R13]
- Grok 4.7: HN sentiment is negative on quality/cost ("slower & more expensive", "Not even close to astra");
  Cursor/Grok Build users report speed and good value on Cursor plans but very fast quota drain on SuperGrok.
  Grok context in Grok Build is 500k (Cursor caps 256K); NO evidence found of a current 2M-context Grok in the
  window (2M claims are from 2025, for Grok 4 Fast / 4.1 Fast). [P: S14, S15]
- Open-weight: DeepSeek V4.1 Flash, Kimi K3, GLM-5.3 are the practitioner favourites for cheap execution;
  the one structured reviewer comparison found open models catch "1/4 to 1/2" of what the Fable/Opus stack
  finds. Antigravity/Gemini 3.8 Flash: fast and cheap, but Reddit split between "biggest coding leap" and
  "highly unreliable / corrupts code". [P: S16-S20, R14-R18]
- Reddit vs HN: Reddit (r/codex, r/ClaudeCode) is louder about usage-limit burn and Sol 6 regression; HN is
  more sceptical of "nerf" claims and of benchmarks, and more favourable to Chinese open-weight models on
  price. Both agree Astra is strong on vision/computer use and weak on cost.

## Findings

### Per-model table (strength / weakness / best role)

| Model | Strengths | Weaknesses | Best role (as practitioners use it) | Evidence |
|---|---|---|---|---|
| Fable 5.1 | Planning, design/architecture review, judgement ("criteria"), orchestrating Opus/Sonnet subagents on large tasks, best reviewer in one maximalist pipeline, 10+ h autonomous runs | Very high quota burn ("burning through the usage limit"), slow, random guardrails, dense prose; Opus 5.5 now near it at much lower cost | Architect / adversarial reviewer / orchestrator of long tasks, at high/xhigh only where it matters | [P] S4, S9, S11, S8, R1-R4, R19 |
| Opus 5.5 | Efficient, fast TTFT, sips quota, clear writing, best at broad refactors, finds test bugs, good UI/visual, beats Astra on real repo task in one report | Verbose end-of-turn essays (Concise style ignored), cautious/over-cautious, 128k thinking cap at "max", cyber-safeguard false flags, refuses some settings edits; nerf suspicions (disputed) | Default long-horizon worker and implementer; reviewer where Fable is too costly | [P] S3, S7, S8, S2, R1, R4, R11 |
| Sonnet 5.5 | Fast, does "the dumb simple thing", cheap per token; 1.5% fallback rate on Terminal-Bench per system card (as quoted by HN) | Opus 5.5 low/medium reportedly cheaper-per-task and as good; "not worth using unless at Low/Med" | Scoped, well-defined implementation subtasks only | [P] S8, R11-R13 |
| GPT-6 Astra | Computer use, browser automation, Blender/CAD/3D, vision, hard obscure architectural bugs, reads whole design | Very expensive in real workloads, "lazy"/stubs critical parts, needs tests as-given, poor UI defaults, high-intelligence low-intuition | Architect/reasoner (max effort) and computer-use/vision worker; not the bulk implementer | [P] S5, S9, S10, S13, R5, R6, R21-R23 |
| GPT-6 Sol | Half the price of Opus 5.5 per one Reddit poster; solid for some | Multiple regression reports vs 5.6 (poor instruction following, stops at first problem, slow), quota burn; over-engineering history | Contested: use only if it has been probed locally | [P] S5, S6, R7-R9 |
| GPT-6 Luna | Cheap (HN: "half the price of GPT-5.6 Luna"), long goals without maxing limits, cheap orchestrator, good code-review signal in cycles | "Massive downgrade over Luna 5.6... Lazy" (r/OpenAI), omits content | Cheap orchestrator / cheap reviewer with narrow scope | [P] S5, S10, S21, R7 |
| GPT-6.1 Sol (2026-09-29) | Claimed near-Astra at a fifth of the price (vendor claim, not verified here) | No practitioner reports yet beyond launch-day comments | Unknown; re-check | [P] S6 |
| Grok 4.7 | Fast, concise communication, decent on Cursor plans | HN: slower/more expensive than 4.6 and "Not even close to astra"; Reddit: 2.5x cost of 4.6 per task; SuperGrok quota drained in 20-30 prompts | Cheap/fast implementer inside Cursor only; not a planner | [P] S14, S15, R24-R26 |
| Gemini 3.8 Flash (Antigravity) | Fast and cheap, good at HTML/JS, "SRE/chaos auditor" style review | Reddit: unreliable, loops, token waste, sycophancy, corrupts code; Antigravity ecosystem confusion, quota complaints | Fast cheap worker for verifiable/retryable tasks; not for unsupervised long runs | [P] S17, S18, R14-R17 |
| Kimi K3 | Frontend, good planner/implementer pairing, close to Fable 5 on coding per cost/task (AA figure quoted by a poster), willing to do security work | Slow (AA 10.3 min vs Luna 2.6 in a Reddit excerpt), 2.8T weights impractical locally | Planner in an open-weight stack (paired with DeepSeek Flash) | [P] S16, S19, R18 |
| DeepSeek V4.1 Flash | Very cheap, fast, good micro-review subagent and grunt work; 80% of Astra on computer-use task per one poster | Heavy reasoner, one-shot fluid intelligence behind US frontier, Chinese-language leakage | Cheap implementer / micro-reviewer | [P] S13, S16, S19, S22 |
| GLM-5.3 (+Flash) | "Absolutely still shy of Sol and Fable, but only just" (HN), strong on security/cyber, design skills better than DS per one poster | GLM-5.3 Flash very slow per AA (14.4 min in a Reddit excerpt title) | Open-weight worker; security research | [P] S20, R18 |
| Cursor Composer 2.5 | Fast, accurate, cheap implementer; used after Sol/Opus planning | Cursor acquired by SpaceX; OpenAI cut Cursor access (S23) and third-party models are expensive there | Implementation model in plan-with-X, execute-with-Composer flows | [P] S23, S15, R27 |
| Xiaomi Mimo v2.6 | "Outstanding as a light and cheap model" (one HN poster) | Single anecdote | Grunt work under an Astra/Fable architect | [P] S9 |
| Cognition SWE-2 (post-trained from Kimi K3) | Claimed Fable-5.1/Astra-class | Terminal-Bench 2.1 92.8% vs Terminal Bench 4 27.3% read as benchmaxxing; requires Devin | Ignore for orchestration | [P] S24 |

### Consensus vs contested

| Claim | Status | Reddit | HN | Evidence |
|---|---|---|---|---|
| Opus 5.5 is much more quota-efficient than Fable 5.1 | Consensus | yes | yes | S3, S7, S8, R1, R4 |
| Opus 5.5 >= Fable 5.1 for coding | Contested | split ("Fable is still quite a bit better" vs "Opus 5.5 stronger in every category") | mostly Opus, Fable kept for judgement/planning | R1, R2, S7 |
| Fable 5.1 is the best planner / adversarial reviewer | Mostly consensus | "Fable is still way better for planning design" | criley2 pipeline; xlayn "more criteria" | R2, S11, S4 |
| Astra best for computer use / 3D / vision | Consensus | yes (Blender threads) | yes | R21-R23, S13 |
| Astra costs far more per real task than Opus 5.5 | Consensus (multiple independent) | yes | yes (rspeele: 215% vs 20%) | R5, S10 |
| Astra beats Opus 5.5 on hard architecture / obscure bugs | Contested | r/codex: "Astra XHIGH is still miles ahead" vs r/codex "Opus 5.5 blows Astra out of the water for broad code changes" | rspeele: Opus better on same repo | R5, R6, S10 |
| GPT-6 Sol/Luna regressed vs 5.6 | Contested-leaning-yes | many r/codex threads; a counter-thread "anybody not having a bad time" | the_duke switched to Opus 5.5 | R7-R9, S5 |
| Sol over-engineers | Contested | 5.6 yes; 6 reportedly "lazy" instead | mixed both ways | S12, R8-R10 |
| Sonnet 5.5 is worth using | Mostly no | "not worth using unless at Low/Med" | "why would you use Sonnet 5.5 on xhigh" | R11, R12, S8 |
| Model "nerfing" is real | Contested | recurring | HN majority sceptical (johnfn, solenoid0937), pro (sheepscreek) | S2 |
| Grok 4.7 is competitive for coding | Mostly no | mixed; cost complaint | mostly no | S14, R24-R26 |
| Open-weight (DeepSeek/Kimi/GLM) is good enough for execution | Consensus for cheap work; contested for review | r/opencode, LocalLLaMA positive | proxysna/azuanrb strongly pro; criley2 says catches 1/4-1/2 of Fable stack | S4, S8, S16, R18 |
| Antigravity/Gemini for coding | Contested | split within one sub | HN sceptical | R14-R17, S17, S18 |

### Per-model notes with linked evidence

**Fable 5.1 (released 2026-09-01; HN launch thread 1419 pts / 1380 comments [S1])**
- criley2 (HN, 2026-09-14, comment [S11a]): "Right now, Fable 5.1 delivers incredible reviews." Uses Fable high for critical domains and
  issue validators, xhigh for the design agent; Opus high/medium elsewhere; open-weight models "find between 1/4 to 1/2" of what the
  Fable/Opus stack finds and "often miss the most critical issues". Single practitioner, half-year of iteration, private-data employer.
- mnicky (HN, 2026-09-28, [S8c]): "Fable 5.1 is very good at prompting/orchestrating Opus/Sonnet subagents when working on a larger task."
- jmaker (HN, 2026-08-22, [S12b]): 1 h of Fable in a short session uses up quota; "either Opus or Fable if you want some quality."
- Reddit (~2026-09-23..29): threads on Fable burning the 20x plan in an hour and a half; a poster on 2 Max accounts reports a 14-hour
  autonomous session; another says power users report 10+ h runs [R19].
- r/ClaudeCode ~2026-09-30 (excerpt): "With Opus 5.5 removes most, if not all, of the use case for both fable and astra. Fable is still way better for planning design" [R2 variant, sentence-level paraphrase of excerpt, not verbatim].
- Best role: architect / adversarial reviewer / orchestrator on a limited budget, not a bulk worker.

**Opus 5.5 (released 2026-09-22; HN 1806 pts / 1116 comments [S3])**
- nr378 (HN Ask, 2026-09-25, [S7a]): "the first real leap I've felt since Opus 4.5" and "It also burns Claude subscription quota much more slowly than Fable."
- Sol- (HN Sonnet thread, 2026-09-28, [S8a]; top by replies, 184): with Opus 5.5's efficiency the 5x plan limits "are simply sufficient" for everyday work.
- user43928 (HN, 2026-09-28, [S2b]): verbosity is the main complaint; "Opus 5.5 writes whole essays at the end of the turn."
- rspeele (HN, 2026-09-29, [S10]): same repo/tests, Astra used 215% of a weekly budget vs Opus 20%; Opus found a bug in the test suite where Astra faked B-splines. n=1, one domain, self-declared bias risk.
- Reddit (r/codex ~2026-09-25, [R6]): "Opus 5.5 blows Astra out of the water for broad code changes like refactoring and optimization."
- Best role: default long-horizon worker; implementer; reviewer where Fable is too expensive.

**Sonnet 5.5 (2026-09-28; HN 875 pts / 605 comments [S8])**
- abejora (HN, [S8d]): Sonnet 70.6 vs Opus 66.4 on Terminal-Bench, but Opus "had 10% of its trials answered by a fallback model due to safeguards" vs 1.5% for Sonnet, citing system-card section 8.5. Do not over-read the vendor benchmark ([V]-derived claim quoted second-hand).
- wkcheng (HN, [S8e]): on the cost/performance chart Sonnet looks worse than Opus in almost all configs.
- Reddit (~2026-09-28..29): "Sonnet 5.5 is not worth using it unless at Low/Med effort" [R11]; "Opus 5.5 Low is one point better than Sonnet 5.5 medium and is ~10% cheaper" [R12].
- Best role: cheap scoped subtasks; heyjstn (HN) asks for Fable planner / Opus decomposer / Sonnet implementer but reports no results.

**GPT-6 Astra (released 2026-09-03; HN 2279 pts / 2075 comments [S5])**
- A_D_E_P_T (HN Ask, 2026-09-25, [S9a]): "the new meta is using Astra-6-Max for orchestration and architecture, and Mimo for grunt work." Also: "Opus 5.5 is definitely better at coding, but nothing even comes close to 6-Astra for work in 3D graphics" (HN, 2026-09-29, [S6a]).
- akmarinov (HN, 2026-09-24, [S13a]): automates browser use; Astra "really good at it, but very expensive"; DeepSeek "about 80% of Astra but lasts forever"; $100 Codex plan lasts about a day of weekly limit on Astra/Sol.
- gizmodo59 (HN, 2026-09-06, [S13b]): recommends computer use with Astra through Codex; vishalanton (HN, 2026-09-18): Astra computer use "burn[s] a ton of tokens".
- Reddit: r/codex ~2026-09-25 "Astra XHIGH is still miles ahead of Opus 5.5 in terms of attention to details and very hard obscure Architectural Issues" [R5]; r/OpenAI "Astra (GPT-6) High Intelligence, Low Intuition" [R22]; r/accelerate "1.5K votes, 395 comments" on Astra + Blender MCP [R21] (excerpt-printed counts); r/codex "Astra low ... better across the board" than 5.6 Sol high in one test [R23].
- Best role: architect at max effort; computer-use/vision worker; not bulk implementation.

**GPT-6 Sol / Luna / 6.1 Sol**
- the_duke (HN, 2026-09-29, [S6b]): "Sol 6 was so bad that I switched over to Opus 5.5 exclusively"; regression vs 5.6, same for Luna; "Even Astra is very unreliable for coding."
- Reddit r/codex ~2026-09-24 "Sol 6 stops when it finds a problem. It's lazy" [R8]; r/OpenAI ~2026-09-23 "Luna 6 is a massive downgrade over Luna 5.6" [R7]; counter-thread r/codex ~2026-09-24 "anybody not having a bad time with gpt 6 sol" with a positive reply "it's pretty solid" [R9].
- Positive Luna: nickandbro (HN, 2026-09-22): "can have Luna going after a goal for 10 days and not run into maxing out the limits." mewse-hn (HN, 2026-08-21): finished a big port with Luna in opencode "for like $0.40".
- Over-engineering: Someone1234 (HN, 2026-09-22): 5.6 Sol produced "a factory-factory" (paraphrased from "four single-use methods, an interface, and a factory-factory"); aleksiy123 (HN, 2026-08-21): Sol "tends to overengineer and be overly cautious", contradicted by Kovah.
- 6.1 Sol: vendor claim only ("Near-Astra intelligence for a fifth of the price", HN title, 2026-09-29, 892 pts). revolvingthrow speculates a rename of "Astra-Minor". Cache input $0.10/M quoted by minimaxir. No usage reports yet. Re-check.

**Grok 4.7 (2026-09-21; HN 609 pts / 539 comments [S14])**
- mchusma (HN, [S14a]): 4.7 "definitely slower & more expensive" than 4.6; "feels like they really had it burn tokens to claw up the benchmarks."
- saejox (HN, [S14b]): "Not even close to astra."
- jmaker (HN, 2026-09-23): SuperGrok allowance gone after "About 20-30 simple coding or code review prompts" in Grok Build; everfrustrated (HN, 2026-09-21): Grok Build has a 500k context window, Cursor limits it to 256K, and Cursor's $60 plan is "insanely good value".
- Positive (HN, 2026-08-12, Grok 4.6 thread [S15]): mpalczewski daily-drives Grok Build with 4.5: "quick" and concise; small_model: Grok Build "2-5x faster than Claude Code in my opinion" (opinion, no measurement).
- Reddit: r/cursor "Grok 4.7 is about 2.5 times as expensive as 4.6" ($8.82 vs $3.53 per task, secondhand) [R24]; r/cursor "Grok 4.5 is excellent workhorse. Not so smart but does solid job" [R26].
- 2M context: NO 2026-08/09 evidence found. Excerpts only cover 2025-2026 Q1 posts for "Grok 4 Fast / 4.1 Fast" [R28]. Unverified for this window.

**Antigravity / Gemini**
- HN 2026-09-01 [S17] (82 pts): "Google Antigravity introduces Boost deep reasoning (/boost)"; skeptical comments ("throw more money/tokens"), quota complaints (dr_kiszonka), "seems like they are ignoring antigravity IDE".
- HN 2026-09-02 [S18] Gemini 3.8 Flash (1160 pts): brap: fast/cheap models "are great for tasks that are verifiable and can be retried infinitely"; mattlondon quotes leaderboards (AA 59, same as Opus 5 medium - secondhand, [B] not verified here). verdverm (HN, 2026-09-19): "gemini is terrible at coding by comparison". antonvs (HN 2026-08-12) uses Antigravity daily with 3.5 Flash, "quite a bit cheaper than Claude".
- Reddit r/google_antigravity: "Gemini 3.8 Flash might be Google's biggest coding leap yet" [R14] vs "Antigravity with Gemini 3.8 Flash - Highly unreliable ... goes into its own world and corrupt the code" [R15], "wasting ALL my tokens" [R16], "does exactly what I tell it to do" [R17]. Sample sizes: single posters.

**Kimi K3 / DeepSeek / GLM / Qwen (opencode, Pi, omp)**
- Frannky (HN, 2026-08-06, [S16a]): oh-my-pi with Kimi K3 as planner and DeepSeek Flash as implementer; still on Claude Max but Opus 5 "seems tuned to make messes".
- gertlabs (HN, 2026-09-16, [S19]; a benchmark vendor): DeepSeek V4.1 Flash near GLM 5.3 and Kimi K3 in agentic coding at lower cost; "American frontier models are still far ahead" on one-shot fluid intelligence; Chinese models iterate well in a harness (+~20 percentile). [B]-like, self-run, vendor data at gertlabs.com/rankings, not verified.
- HarHarVeryFunny (HN, 2026-08-16): AA cost per task "Fable 5 at $3.14/task vs Kimi K3 at $0.84/task, with very little difference between them in coding capability" (poster's reading of AA).
- proxysna / azuanrb (HN, 2026-09-28/29): DeepSeek/GLM "intelligence difference is negligible" and far cheaper; opposing view from criley2 and gertlabs above.
- HN 2026-09-10 Cognition SWE-2 [S24] is post-trained from Kimi K3; skeptics cite the Terminal Bench 2.1 vs 4 gap.
- Reddit: r/LocalLLaMA "Kimi K3... generated a lot of code that worked in one shot" (Q1_M local) [R18]; r/opencode "GLM 5.3 Flash vs Deepseek V4.1 Flash": DeepSeek lower latency, GLM maybe better at design [R18b].

**Cursor Composer**
- rippeltippel (HN, 2026-08-29, [S23]): plans with Sol/Terra, then "let Composer (free) deal with the implementation." satvikpendem (HN, 2026-08-12): Cursor plans give "a lot [of] tokens on ... first party models (Grok and Composer)". redox99: Cursor is "only worth it if you're going to use mostly grok/composer" for third-party cost reasons.
- OpenAI announced a Cursor decision after the SpaceX acquisition (HN 852 pts, 2026-08-29). Availability of GPT models inside Cursor may have changed; verify before routing.
- Reddit r/cursor Composer 2.5 threads: "cheaper implementation model. Blazing fast and fairly accurate" [R27]. Composer 2.5 threads predate the window (thread IDs earlier) - use with care.

### Cross-cutting angles

| Angle | What practitioners say | Evidence |
|---|---|---|
| Architecture vs implementation vs review | Split is common: Astra/Fable plan, Opus/Composer/DeepSeek implement, Fable/Opus review; cheap-orchestrator/big-subagent inverse also used (Luna orchestrator with Sol/Astra subagents) | S4, S9, S11, S13, S21 |
| Long-horizon autonomy | Opus 5.5 running subagents "for the last 20h without any input" (jryan49, HN 2026-09-25, outcome unknown); Fable 14 h session (Reddit); Luna 10-day goals | S7, R19, S5 |
| Context rot | Little direct data; a Claude Code engineer says plan mode no longer useful (S26). Grok Build 500k context burns credits faster | S26, S14 |
| Over-engineering / laziness | Sol 5.6 over-engineers; Sol 6 and Luna 6 "lazy"; Opus 5.5 verbose/cautious; Astra stubs hard parts | S12, S10, R7-R10 |
| Tool reliability | Opus 5.5 refuses to edit settings.json (redox99, HN 2026-09-28); Claude Code uses awk/sed/python for edits since the 5 series (IgorPartola, HN 2026-09-03); Antigravity Gemini corrupts code (Reddit) | S2, S25, R15 |
| Cost / usage limits | Codex quota widely praised earlier (jeffnash, HN 2026-09-22) but Astra drains $100 plans in about a day; Pro $200 plan cut from 20x to 10x (Aboutplants HN quote of a news item, 2026-09-29); Fable quota burn; Opus 5.5 sips | S5, S6, S8, R19 |
| Speed | Grok Build fast; Opus 5.5 TTFT better than Fable/Opus 5; Sol "as slow as usual" (r/codex); Kimi K3 and GLM 5.3 Flash slow per AA | S7, R7, R18 |
| Vision / computer use | Astra clearly best; DeepSeek about 80% of Astra on one browser task; Sol/Luna "not that great" | S13, R21-R23 |
| Nerf claims | Disputed; HN livenerf/Nerf Bench threads; majority sceptical | S2 |

## Gaps

- No Reddit scores, comment counts, upvote ratios or full comment threads: Reddit blocks every fetch path used
  (curl, old.reddit, api.reddit.com, headless Chrome, WebFetch, Firecrawl scrape). Only Firecrawl search excerpts
  were usable, and two batches were rate limited (HTTP 429), so the last search set (Kimi CLI, GPT-6.1 Sol reactions,
  Opus 5.5 over-engineering) is missing on Reddit. Re-run when the Chrome extension is connected or when Reddit
  access is available.
- Reddit relative dates are approximate. Reddit rows are single anonymous posters with unknown scores.
- No evidence for a 2M-context Grok in the window; only 2025/early-2026 posts about Grok 4 Fast / 4.1 Fast.
- Kimi CLI (kimi-for-coding, highspeed) specifics: no practitioner report found.
- Cursor Composer: no post-2026-08-01 Reddit thread with content; HN evidence is incidental.
- HN comment scores are not exposed; ordering uses reply-count as a proxy for engagement, not agreement.
- Gemini in Antigravity 2.0 / CLI and Boost: only two HN threads and split Reddit excerpts.
- Benchmark figures quoted by commenters (AA, deepswe, Terminal-Bench, Nerf Bench) were not verified here; treat as second-hand.
- Some HN quotes are from truncated comments; all are paraphrased only where marked.

## Sources

Reddit rows: excerpt-only via `firecrawl_search` (includeDomains reddit.com), accessed 2026-09-30; scores unknown unless stated.
Re-check whenever a new model ships: S3, S6, S8, S9, S14 and the R-list.

Hacker News (Algolia API, full text, accessed 2026-09-30):
- [S1] Claude Fable 5.1 and Claude Mythos 5.1 — https://news.ycombinator.com/item?id=49525378 — 2026-09-01, 1419 pts, 1380 comments.
- [S2] Livenerf: Has Opus 5.5 been nerfed yet? — https://news.ycombinator.com/item?id=49901736 — 512 pts (nerf debate; xlayn 49902403; also user43928 verbosity comment 49875283 in S2b thread "Prompting Claude Opus 5.5" https://news.ycombinator.com/item?id=49874728; redox99 49876610; IgorPartola in S25).
- [S3] Claude Opus 5.5 — https://news.ycombinator.com/item?id=49803892 — 2026-09-22, 1806 pts, 1116 comments; pricing table quoted by GodelNumbering (Opus 5.5 $4 in / $20 out per M vs Opus 5 $5 / $25); booty 49804529 (cheap orchestrator).
- [S4] Ask HN comments used: criley2 https://news.ycombinator.com/item?id=49703409 (in S21 thread), gregwebs https://news.ycombinator.com/item?id=49704469.
- [S5] GPT-6 Astra — https://news.ycombinator.com/item?id=49554643 — 2026-09-03, 2279 pts, 2075 comments.
- [S6] GPT 6.1 Sol: Near-Astra intelligence for a fifth of the price — https://news.ycombinator.com/item?id=49896586 — 2026-09-29, 892 pts, 804 comments; the_duke 49897054, A_D_E_P_T 49896732, rspeele 49897552 [S10], proxysna 49898356.
- [S7] Ask HN: Is Opus 5.5 another step change? — https://news.ycombinator.com/item?id=49850798 — 2026-09-25, 18 pts, 19 comments; nr378 49851837, A_D_E_P_T 49851021 [S9a], brianwawok, tkgally, sznio, jryan49.
- [S8] Sonnet 5.5 — https://news.ycombinator.com/item?id=49881850 — 2026-09-28, 875 pts, 605 comments; Sol- 49882083, abejora 49882146, wkcheng, heyjstn 49882641, mnicky 49882964, azuanrb 49886033.
- [S9] same as S7 (A_D_E_P_T comment) and Mimo mention.
- [S10] rspeele Astra vs Opus 5.5 repo comparison — https://news.ycombinator.com/item?id=49897552.
- [S11] criley2 — https://news.ycombinator.com/item?id=49703409 (S11a).
- [S12] A week of using Codex more than Claude — https://news.ycombinator.com/item?id=49393051 — 2026-08-21, 248 pts, 199 comments; aleksiy123 49393505, Kovah 49393770, jmaker 49397117, 217 49393603, mewse-hn 49393638.
- [S13] Astra computer use comments: akmarinov https://news.ycombinator.com/item?id=49832331, gizmodo59 https://news.ycombinator.com/item?id=49583037, vishalanton https://news.ycombinator.com/item?id=49757217.
- [S14] Grok 4.7 — https://news.ycombinator.com/item?id=49788838 — 2026-09-21, 609 pts, 539 comments; mchusma 49793859, saejox 49790166, jmaker 49812720, everfrustrated 49791425.
- [S15] Grok 4.6 scores 61 on the Artificial Analysis Intelligence Index — https://news.ycombinator.com/item?id=49275385 — 2026-08-12, 343 pts, 304 comments (mpalczewski 49278621, satvikpendem 49275571, small_model 49276498).
- [S16] Frannky (Kimi K3 planner + DeepSeek implementer) — https://news.ycombinator.com/item?id=49197680; HarHarVeryFunny https://news.ycombinator.com/item?id=49322499.
- [S17] Google Antigravity introduces Boost deep reasoning (/boost) — https://news.ycombinator.com/item?id=49517537 — 2026-09-01, 82 pts.
- [S18] Gemini 3.8 Flash and 3.8 Flash Cyber — https://news.ycombinator.com/item?id=49537553 — 2026-09-02, 1160 pts; verdverm https://news.ycombinator.com/item?id=49763056; antonvs https://news.ycombinator.com/item?id=49270257.
- [S19] DeepSeek v4.1 Flash Is Now Our Best Hacking Model — https://news.ycombinator.com/item?id=49725800 (gertlabs comment 49730270) ; DeepSeek v4.1 Flash https://news.ycombinator.com/item?id=49639090 — 1016 pts.
- [S20] GLM-5.3: Frontier coding with emergent cyber capabilities — https://news.ycombinator.com/item?id=49294997 — 2026-08-14, 1171 pts (aliljet 49295043, leobuskin 49297537).
- [S21] GPT-5.6 Luna vs. GPT-6 Astra: Is a $1.20 Model Good Enough for Code Review? — https://news.ycombinator.com/item?id=49703003 — 2026-09-14, 167 pts (CharlieDigital 49704458, jacobgold 49703387); GPT-6 Sol and Luna https://news.ycombinator.com/item?id=49805509 — 1777 pts (jeffnash 49805972, Someone1234 49805977, nickandbro 49805613).
- [S22] Silagi (DS4.1 Flash micro-review subagents) — https://news.ycombinator.com/item?id=49804620.
- [S23] Our decision on Cursor following its acquisition by SpaceX — https://news.ycombinator.com/item?id=49486172 — 2026-08-29, 852 pts (rippeltippel 49487167, redox99 49486323).
- [S24] Cognition launches new SWE-2 model — https://news.ycombinator.com/item?id=49645443 — 2026-09-10, 447 pts (postalcoder 49646410).
- [S25] Which tools do Claude, Codex and Cursor choose? — https://news.ycombinator.com/item?id=49557206 (IgorPartola 49559680).
- [S26] Plan mode is dead — https://news.ycombinator.com/item?id=49850929 (bcherny, self-identified Claude Code engineer).

Reddit (excerpts only; relative date at 2026-09-30):
- [R1] r/ClaudeCode "Is Opus 5.5 really better than Fable in your experience?" ~2026-09-23 — https://www.reddit.com/r/ClaudeCode/comments/1woe3lo/is_opus_55_really_better_than_fable_in_your/
- [R2] r/ClaudeCode "What's the point of Fable if Opus 5.5 is stronger than it, in every category?" — https://www.reddit.com/r/ClaudeCode/comments/1wnk74q/whats_the_point_of_fable_if_opus_55_is_stronger/ ; r/ClaudeCode "With Opus 5.5, where's fable or astra standing at now?" ~2026-09-24 — https://www.reddit.com/r/ClaudeCode/comments/1wohh59/with_opus_55_wheres_fable_or_astra_standing_at_now/
- [R3] r/ClaudeCode "Fable 5.1 or Opus 5.5?" ~2026-09-27 — https://www.reddit.com/r/ClaudeCode/comments/1wrfr8p/fable_51_or_opus_55/
- [R4] r/Anthropic Opus 5.5 announcement, "905 votes, 215 comments" — https://www.reddit.com/r/Anthropic/comments/1wnecjb/introducing_claude_opus_55_the_first_model_in_our/ ; r/ClaudeAI "Opus 5.5 v/s Astra 6" ~2026-09-27 — https://www.reddit.com/r/ClaudeAI/comments/1wrlr29/opus_55_vs_astra_6/
- [R5] r/codex "Astra vs Opus 5.5, my impressions on hard project" ~2026-09-25 — https://www.reddit.com/r/codex/comments/1wpveoe/astra_vs_opus_55_my_impressions_on_hard_project/ ; r/codex "Opus 5.5 leads the code review benchmark (at ~3x the cost gpt-6 sol)" ~2026-09-26 — https://www.reddit.com/r/codex/comments/1wq866g/opus_55_leads_the_code_review_benchmark_at_3x_the/
- [R6] r/codex "GPT-6 vs OPUS 5.5 Comparison" ~2026-09-25 — https://www.reddit.com/r/codex/comments/1wpdlx2/gpt6_vs_opus_55_comparison/ ; r/codex "I gave Astra, Sol, and Opus 5.5 the same Rust task" ~2026-09-23 — https://www.reddit.com/r/codex/comments/1wnx8i9/i_gave_astra_sol_and_opus_55_the_same_rust_task/
- [R7] r/OpenAI "Luna 6 is a massive downgrade over Luna 5.6" ~2026-09-23 — https://www.reddit.com/r/OpenAI/comments/1wnxg0n/luna_6_is_a_massive_downgrade_over_luna_56_misses/ ; r/codex "GPT-6-SOL - not impressed" — https://www.reddit.com/r/codex/comments/1wnnszs/gpt6sol_not_impressed/
- [R8] r/codex "Sol 6 was insufferable. Glad to be back to 5.6" ~2026-09-24 — https://www.reddit.com/r/codex/comments/1worwfr/sol_6_was_insufferable_glad_to_be_back_to_56/
- [R9] r/codex "anybody not having a bad time with gpt 6 sol ?" ~2026-09-24 — https://www.reddit.com/r/codex/comments/1wpasz8/anybody_not_having_a_bad_time_with_gpt_6_sol/
- [R10] r/codex "Sol 5.6 - how do you handle overengineering of SOL?" — https://www.reddit.com/r/codex/comments/1w0re81/sol_56_how_do_you_handle_overengineering_of_sol/
- [R11] r/ClaudeCode "Sonnet 5.5 is not worth using it unless at Low/Med effort" ~2026-09-29 — https://www.reddit.com/r/ClaudeCode/comments/1wsqfzk/sonnet_55_is_not_worth_using_it_unless_at_lowmed/
- [R12] r/ClaudeCode "Sonnet 5.5 beats Opus 5.5 at coding and it's half the price??" ~2026-09-28 — https://www.reddit.com/r/ClaudeCode/comments/1wsmhaz/sonnet_55_beats_opus_55_at_coding_and_its_half/
- [R13] r/ClaudeCode "Same prompt, same setup: Claude Sonnet 5.5 vs Opus 5.5" ~2026-09-29 — https://www.reddit.com/r/ClaudeCode/comments/1wspepd/same_prompt_same_setup_claude_sonnet_55_vs_opus/
- [R14]-[R17] r/google_antigravity Gemini 3.8 Flash threads — https://www.reddit.com/r/google_antigravity/comments/1wajpay/gemini_38_flash_might_be_googles_biggest_coding/ ; .../1w96dbj/antigravity_with_gemini_38_flash_highly_unreliable/ ; .../1w9574o/gemini_flash_38_is_wasting_all_my_tokens/ ; .../1w5i29e/review_of_gemini_38_flash_from_a_person_who/
- [R18] r/LocalLLaMA "What's the verdict on Kimi K3, Qwen3.8-2.4T..." — https://www.reddit.com/r/LocalLLaMA/comments/1vrupyu/whats_the_verdict_on_kimi_k3_qwen3824t/ ; r/opencode GLM 5.3 Flash vs DeepSeek V4.1 Flash (R18b) — https://www.reddit.com/r/opencode/comments/1wfqol6/glm_53_flash_vs_deepseek_v41_flash_which_one_do/
- [R19] r/ClaudeCode "Poor fable limits?" — https://www.reddit.com/r/ClaudeCode/comments/1wj1x6q/poor_fable_limits/ ; r/Anthropic "Fable 5.1 is really fantastic, but it's burning through the usage limit" — https://www.reddit.com/r/Anthropic/comments/1w5508t/fable_51_is_really_fantastic_but_its_burning/
- [R21] r/accelerate Astra + Blender MCP, "1.5K votes, 395 comments" — https://www.reddit.com/r/accelerate/comments/1w7nzal/dude_gpt6_astra_is_some_kind_of_turboagi_machine/
- [R22] r/OpenAI "Astra (GPT-6) High Intelligence, Low Intuition" — https://www.reddit.com/r/OpenAI/comments/1w7qxdr/astra_gpt6_high_intelligence_low_intuition/
- [R23] r/codex "GPT-6 Astra on low performs better than GPT-5.6 Sol on high" — https://www.reddit.com/r/codex/comments/1w9erx3/usage_tip_gpt6_astra_on_low_performs_better_than/
- [R24] r/cursor "Grok 4.7 is about 2.5 times as expensive as 4.6" — https://www.reddit.com/r/cursor/comments/1wmswj9/grok_47_is_about_25_times_as_expensive_as_46/
- [R26] r/cursor "I actually like Grok?" — https://www.reddit.com/r/cursor/comments/1vjstn9/i_actually_like_grok/
- [R27] r/cursor "Composer 2.5 Real World Reviews?" — https://www.reddit.com/r/cursor/comments/1tizaja/composer_25_real_world_reviews/ (pre-window thread id; low weight)
- [R28] r/AIToolsPerformance Grok 4.1 Fast 2M context — https://www.reddit.com/r/AIToolsPerformance/comments/1r7vena/grok_41_fast_vs_codexmax_51_i_compared_2m_context/ (2026-Q1 or earlier; outside window)
- Raw HN JSON saved locally at .orchestrate/raw/hn/*.json (not committed).
