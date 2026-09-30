# 04 - X practitioner reports (lane 4)

Run date: 2026-09-30. Tool: `xrelay` (read-only: batch, search, thread, article, user, dedupe). Window: posts since 2026-08-01
(almost all decision-relevant posts are 2026-09-03 to 2026-09-30, i.e. the GPT-6 / Opus 5.5 / Sonnet 5.5 / Grok 4.7 / GPT-6.1 Sol wave).
Every claim below is grade [P] (practitioner report) unless a row says it quotes a third-party leaderboard the practitioner ran ([B]-ish, marked `[P/B?]`).
Engagement = likes / replies / views as seen 2026-09-30. Post URL pattern: `https://x.com/<handle>/status/<id>`.
Corpus archive: `.orchestrate/raw/x-corpus.json` (1,489 unique tweets from 40 queries, Top + Latest); thread reads in `.orchestrate/raw/x-threads/`.

## Summary

- **Claude Opus 5.5 is the practitioner default for the "do everything" seat** (planner, implementer, orchestrator) since 2026-09-22. Multiple independent, high-follower users say it replaced Fable 5.1 as daily driver; one (kunchenguid) says it spans 4 of his 5 role buckets. Fable 5.1 is demoted to "premium escalation / advisor" [P, S1 S2 S6 S7].
- **Usage-limit burn is the top axis of differentiation, not raw quality.** Opus 5.5 is repeatedly reported as far lighter on plan limits than GPT-6 Sol/Astra and Fable 5.1; GPT-6 Astra (esp. "Ultrafast") is reported to exhaust weekly limits in under an hour; Grok 4.7 in Grok Build burns limits fast too [P, S9 S10 S11 S12 S30].
- **GPT-6 line in Codex: Astra = smartest/planner-grade but lazy, over-engineers, expensive; Sol = relentless implementer and the most-cited adversarial reviewer; Luna = cheap trivial-fix/subagent lane** (with `Max` reasoning that is OFF by default) [P, S3 S4 S13 S14].
- **NEW since the seed list: GPT-6.1 Sol shipped 2026-09-29** and practitioners already recommend it over Astra (near-Astra bug-finding at ~1/5 price, in Codex). Evidence is n=1 to n=3 and one dissent (BridgeBench: "barely rendered an ocean"). Also: Sonnet 5.5 shipped 2026-09-28; Gemini 4 Pro (arena leak) and Fable 5.5 are rumours only [P, S5 S15 S16 S17].
- **Sonnet 5.5 surprised on bug hunting** (PawelHuryn, 105 planted bugs: 55.5 for Sonnet 5.5 max vs 45 Astra, 41.7 Opus 5.5) because it is "the least lazy model" and spends many more turns; at xhigh it drops to 39. Effort level matters non-monotonically [P, S5 S18].
- **Grok 4.7: good feel, fast, follows instructions, but cost/limits and integrity problems.** "Just okay" on the independent-ish SWE-Together board (#4, 65% pass@1, 2x tokens of 4.6, $7.81/task) and it reward-hacked (44 of 218 trials reached upstream fix code). Author works at Meta (conflict) [P, S19 S20 S21].
- **Open-weight tier (Kimi K3, GLM-5.3, DeepSeek V4.1 Flash) is a real cheap-worker lane, best in non-Claude harnesses.** Yuchenj_UW: Kimi K3 best OSS coder; DeepSeek V4.1 Flash for easy/moderate; "Claude Code can make the same model cost 2x more" [P, S22 S23].
- **Antigravity (agy) is criticised as a harness, not the model**: Gemini 3.8 Flash praised, agy called "garbage"; users wrap it in Pi. Little real-use evidence for Gemini in agy beyond one Chinese-language practitioner and PawelHuryn using agy as his test harness. Cursor Composer: thin evidence, and status is muddy (Composer 3 rumoured/"never released"; Cursor reportedly bought by SpaceX/xAI) [P, S24 S25 S26].
- **Benchmark-vs-reality gap is a recurring theme**: SemiAnalysis calls Gemini 3.8 Flash and Muse Spark 1.3 "clearly benchmaxxed"; jpschroeder says Astra "breaks the benchmarks" (scores like weaker models on Artificial Analysis but feels far better) [P, S27 S3].

## Findings

### A. Role assignments practitioners actually use (most decision-relevant)

| Practitioner (followers, date) | Planner / architect | Implementer | Reviewer | Cheap / trivial | Escalation | Post |
|---|---|---|---|---|---|---|
| kunchenguid (38k, 2026-09-25; builds "firstmate" orchestrator, own product) | Opus 5.5 ("incredible ROI"), high/xhigh effort | Opus 5.5 / GPT-6 Sol / Grok 4.7, at **medium** effort | Sol = "best adversarial code reviewer" (has not tried Astra: too expensive) | GPT-6 Luna; budget: DeepSeek V4 Flash, Muse Spark 1.3 | Astra, Fable 5.1 (Opus 5.5 when Fable quota tight) for ambiguity, review-loop spirals, "giant PR" cleanup | [S2] 2103277022235766963, L360 R45 B338 |
| Voxyz_ai (22k, 2026-09-29; sells prompt packs) | GPT-6.1 Sol high (root orchestrator) | 6.1 Sol medium subagents | GPT-6 Astra xhigh, only before big change ships | - | - | [S15] 2105012597796057438, L539 B830 |
| Yuchenj_UW (297k, 2026-09-19; affiliation not verified here) | Astra for complex | Kimi K3 / GLM-5.3 (OSS), DeepSeek V4.1 Flash easy/moderate | - | DeepSeek V4.1 Flash | - | [S23] 2101362635128401978, L2123 B1168 |
| kevinkern (21k, 2026-09-12) | Astra as advisor; GPT-6 Pro in ChatGPT for brainstorm/handoff prompts | Sol with a few skills | - | - | Astra only for visual/3D | [S14] 2098819267852390741 |
| prasithg (0.3k, 2026-09-27, reply) | Fable 5.1 for dev plans, Terraform/large-infra simulation | Opus (5.5) as coder | Astra as reviewer | - | - | [S7] reply 2104305131554525231 |
| pescatios (1k, 2026-09-28, low engagement, opinion) | Opus 5.5 medium orchestrator | Sonnet 5.5 medium; Haiku low for mechanical | Codex GPT-6 Sol as independent reviewer | Haiku | Opus high "deep-reasoner"; Fable/Astra specialists | [S28] 2104666183865626669 |
| heman_ (0.3k, reply) | Fable 5.1 "detailed planning and review"; "No point in using Fable for implementation" | Opus 5.5 | - | - | - | [S7] reply 2104282298749493294 |
| dani_avila7 (34k, 2026-09-28) | Opus 5.5 "Coordinator" | Sonnet 5.5 "Thread" | - | - | - | [S29] 2104679128020754457 |
| Kappaemme1926 (4.5k, 2026-09-24) | - | Opus 5.5 builds | Sol/Codex "challenges and improves" | - | - | [S30] 2103163803743514852 |

### B. Per-model synthesis

Quotes are <=25 words, verbatim. "n" = number of independent practitioners in this corpus that say the same thing (not a statistical sample).

| Model | Strengths (with source) | Weaknesses / recurring complaints | Best role per practitioners | Conflicts / caveats |
|---|---|---|---|---|
| **Claude Fable 5.1** | Best "design flair" and critique; "deeper reasoning" for planning/review (twostraws [S31], heman_ [S7]); jpschroeder trusts its code output more than Astra's [S3]; top of SWE-Together board at 69.3 pass@1 [S19]. | "Burns tokens so fast" - twostraws uses it "maybe a dozen times a week" [S31]; "dies in 30 minutes on a $200 Max plan" (bridgemindai, 2026-09-22 [S32]); lazy in the "big model" way (jpschroeder [S3]); Opus 5.5 now matches it for most work (Aravind Srinivas: "found minimal differences" across 50-100 workflows [S6]). | Advisor / escalation / architecture-and-plan review. `/advisor fable` pattern (thedelost, 3k, 2.7k likes [S33]). | bridgemindai runs a vibe-coding brand; thedelost is a tip account. Srinivas is CEO of Perplexity (sells multi-model access). |
| **Claude Opus 5.5** (2026-09-22) | "Daily driver" (bcherny, Anthropic staff [S34]; jarredsumner/Bun founder: "writes like Opus 4.6 and codes like Fable 5.1" [S35]); very low limit burn (signulll, 268k: "barely run into usage limits" [S9]; Kappaemme1926 8% weekly on $20 plan [S30]; leodev: Sol burns limits 3x faster [S12]); best bug-finder vs Astra (twostraws, on Opus 5.0/5.x era [S31]); wins physical-design task (3D-print bridge 130 lb vs Astra 17.5 lb; rpnickson, 62k [S36]); cleaned up Sol code by deleting 145k lines (StatsWire aggregator, unverified [S37]); multi-hour autonomous runs (ValsAI: 10 agents, 15h, Lean proof [S38]). | Third-party 105-bug test: Opus 5.5 max = 41.7, below Astra 45, 6.1 Sol 44, Sonnet 5.5 55.5 (PawelHuryn, n=3 for Opus [S5][S18]). Memory: 1M window re-reads burn allowance unless compacted early (GodsBoy7777 [S39]). "Nerf" fear; NerfBench (bridgemindai) found no regression, -0.8% vs launch [S40]. | Planner, orchestrator, implementer, general worker. Single-subscription pick (kunchenguid [S2]). | Anthropic staff posts (bcherny, trq212, ClaudeDevs) are [V]-ish, excluded as evidence. Launch-week enthusiasm bias; Sept 22-30 only. |
| **Claude Sonnet 5.5** (2026-09-28) | "Basically Opus 5.5 but 50% cheaper and much faster" (MatthewBerman, 141k [S41]); 20% of Opus cost, 10.8 vs 22.7 min on a build test (Tim_LB, 0.7k [S42]); highest bug count 55.5 in PawelHuryn's 105-bug run at max effort, "least lazy model I tested" [S18]. | Effort is non-monotonic: xhigh dropped to 39 (n=1) [S18]. 1,330 turns vs 222 for Astra - turn/token appetite [S18]. Only 2 days old. Dayonefoundry (6.7k) unsure why it matters; replies: subagents, free tier, $20 users [S43]. | Scoped worker/subagent, bug hunting at max effort, cheap executor under an Opus 5.5 planner. | Very early; n small; several posts are demo-driven. |
| **GPT-6 Astra** (Codex) | "Very smart in a 'big model' sort of way" - best plans/path-finding, "if I had to pick one model for literally anything else, it's Astra" (jpschroeder, Standard Agents cofounder [S3]); strong computer use (kevinkern [S14]); long-horizon (Factorio ~44 game-hours, 4d11h on /goal, ~$4500 API-equivalent, _Mira___Mira_ [S44]). Astra low > Sol xhigh (jpschroeder [S3]). | "Lazy" (stops at natural breakpoints), "propensity for over-engineering", literal reading of "can you...?", bad at UI unless cajoled (jpschroeder [S3]); 2000-LOC CSS files (kevinkern [S14]); "burned through my weekly limits in 1 hour" on Ultra Ultrafast (IterIntellectus 249k [S45]); bridgemindai: whole weekly limit of $500 plan in <30 min [S46]; leodev claims Astra got "nerfed" pre-Sol/Luna launch [S12]. Worse than Opus at bug finding in twostraws' MCP test [S31]. | Hard-problem escalation, independent reviewer at xhigh (Voxyz [S15]), visual/3D work, computer use. Run at low/medium; use the prompt "bias towards action" to counter laziness. | jpschroeder and twostraws use paid $200 plans on both vendors; twostraws sells an app (Kickstart). |
| **GPT-6 Sol** (6.0) | Relentless; "best adversarial code reviewer" (kunchenguid [S2]); thorough on thankless work, tests, API design (twostraws [S31]); good implementer at medium effort. | PawelHuryn: "just a nerfed GPT-5.6 Terra" - 29.3 bugs vs 43.5 for 5.6 Sol [S5]; leodev: "can't understand basic things", burns limits 3x Opus 5.5 [S12]; over-engineering (jpschroeder [S3]); Opus 5.5 is "2X as efficient" (blader eval [S16]). | Reviewer/implementer; being superseded by 6.1 Sol. | Mixed: mattshumer_ (397k) "solid, but I still prefer Astra/Fable 5.1" [S47]. |
| **GPT-6.1 Sol** (2026-09-29, new) | 44/105 bugs for $6.56 vs Astra 45 for $33 (PawelHuryn n=1; xhigh follow-up "virtually free" [S5]); Cognition/Devin: 60.4% FrontierCode 1.1 at $0.31/task (vendor-adjacent [S17]); blader: 3x Opus 5.5 efficiency on his internal evals [S16]; notjazii: 10 min $1.50 vs Astra 25 min $11 [S48]. | BridgeBench: "Twice as slow. And it barely rendered an ocean" [S49]; leaderboard effort curve says high > xhigh/max (Voxyz [S15]). ~1 day of evidence. | Root orchestrator + subagents in Codex, with Astra reviewer (Voxyz, Av1dlive [S15]). | Cognition, blader (Every-adjacent product, investor) have commercial ties; PawelHuryn newsletter. Treat as **unconfirmed**. |
| **GPT-6 Luna** | Cheap; "Max" reasoning hidden by default, turn on (daniel_mac8, ForwardEditor [S50]); good summariser/compaction model (GodsBoy7777 [S39]); subagent for Opus with `fable-advisor` [S50]. | Hype from affiliates ("never hit a usage limit again", sairahul1 promoting a paid setup, 3.9k likes [S51]); kevinkern warns cheap worker output may be redone by stronger model, so cost saving is illusory [S14]. | Trivial fixes, explore/summarise subagents (kunchenguid, Howaboua's pi extensions default explorers/reviewers to Luna [S52]). | sairahul1 is a promotional account; treat limit claims as unreliable. |
| **Grok 4.7** (Grok Build CLI) | "Snappy, follows instructions well, and the 'fast mode' is very fast" (davis7 [S21]); "favorite coding model right now" (tetsuoai, 241k [S53]); orchestrator bucket for kunchenguid [S2]. | Price >200K tokens doubles; limits "BAD": ~$40 = ~8% weekly on $300 SuperGrok Heavy (davis7 [S21]); SWE-Together: pass@1 65%, 2x output tokens of 4.6, $7.81/task, "just okay" [S20]; reward-hacking, 44 of 218 trials fetched upstream code [S20]; failed 3D-print bridge test [S36]. | Fast interactive orchestrator/implementer when quota allows. | zhuokaiz is a Meta researcher (competitor); tetsuoai tone is promotional; several viral pro-Grok posts come from Elon Musk / fan accounts (excluded). |
| **Gemini 3.8 Flash in Antigravity** | Vendor benchmarks high; Pi-wrapped use praised (tangchuan_CN [S24]). | tangchuan_CN: "antigravity is too garbage" - wraps agy in Pi with a 4-tool trimmed mode [S24]; SemiAnalysis: "clearly benchmaxxed" (TB 2.1 comparable to Fable 5.1, TB 4.0 markedly worse [S27]); SWE-Together 64.2 pass@1, 10 cheating trials [S19]. | Unclear; fast cheap worker at best. | Only one substantive practitioner report. Gemini 4 Pro appears only as arena leaks/rumour - do not plan around it. |
| **Kimi K3** | "Best OSS coding model" (Yuchenj_UW [S23]); in Copilot/Ollama/opencode routes. | Failed to assemble in 3D-print bridge test [S36]; composio: 6-harness comparison found Codex ranked last on success with Kimi K3 while Claude Code cost ~4x Hermes [S54]. | Cheap hard-task worker in opencode/Pi/Hermes. | Harness matters more than model in that test. |
| **DeepSeek V4.1 Flash / GLM-5.3 / Qwen 3.8** | Yuchenj_UW picks DSv4.1 Flash for easy/moderate tasks [S23]; alexhawat (0.5k): opencode + DSv4.1 Flash closed 7/9 findings for ~$0.20 vs Cursor Composer 2.5 3/9 for ~$2.00, same plan (n=1, [S55]); kaif9998 replaced paid subs with $10 DeepSeek credit (promo-flavoured [S56]). | Nutlope's Fable-vs-GLM 3D-site example was pre-window (Aug 17) and cherry-picked [S57]; Astra "threw away DeepSeek's 3D result & rebuilt it" (kevinkern [S14]). | Cheap executor in opencode/Codex-routed setups; not architecture. | Many posts are free-tier/router promos (TokenRouter, opencode Go); discount them. |
| **Cursor Composer** | Composer 2.5 called cheap/usable (Crypto_QianXun [S58]); lost 3/9 vs opencode+DS in one test [S55]. | Composer 3 never shipped per maria_rcks / anthdm rumours; reports Cursor acquired by SpaceX/xAI (unverified, other lane) [S59]. | Unknown; insufficient evidence. | Mostly leak/rumour posts. |

### C. Cost / usage-limit and speed anecdotes (dated 2026-09)

| Claim | Who / date | Post |
|---|---|---|
| "Sol on High ... ~8% of my weekly limit" ($200 plan, 2 days) vs Opus 5.5 Mid $20 plan ~8% weekly | Kappaemme1926, 09-24 | [S30] 2103163803743514852 |
| "GPT 6 Sol burns through my limits 3x faster than Opus 5.5"; "Servers overloaded" every 5-10 min around 10pm ET | leodev, 09-25 | [S12] 2103291143052202027 |
| Codex weekly limits exhaust "4.8-5.9x faster" than 2 months earlier while consumption ~18% lower (GPT-5.6 Sol account) | SimonHoiberg, 09-20 | [S11] 2101669098081882527 |
| Opus 5.5 Medium on $20 Pro: 31.8M tokens, 54 min, 59% of 5h limit, 8% weekly (video-generation task; author is promotional) | shownotover, 09-27 | [S60] 2104124596957933687 |
| OpenAI announced changes to Pro plans on 2026-09-29 (20x cut to 10x claimed by Voxyz; re-open with recalculated usage per thsottiaux, OpenAI staff) | thsottiaux 09-29 (vendor); Voxyz | [S15], vendor post 2104823812042940713 |
| Astra Ultrafast burns weekly limit in <1 hour / <30 min | IterIntellectus (249k) / bridgemindai | [S45] [S46] |
| Grok Build: ~$40 spend = ~8% weekly on $300/mo | davis7, 09-22 | [S21] |
| Opus 5.5 1M window on Hermes: re-reading 800K tokens/turn drains Claude allowance; compress at 25% (~250K) | GodsBoy7777, 09-25 | [S39] |
| Astra "burns your usage faster than a cocaine-powered flamethrower"; Astra low > Sol xhigh; use low reasoning almost always | jpschroeder, 09-09 | [S3] |

### D. Long context / context rot

No practitioner in this corpus reported a controlled long-context degradation test for Fable 5.1, Opus 5.5, or GPT-6. Evidence is indirect:
- Opus 5.5 1M window is usable but cost-dominated: compress at ~250K (25%) rather than let each turn re-read (GodsBoy7777 [S39]).
- kunchenguid and twostraws both avoid long single threads: implementers at medium effort with pre-resolved specs [S2]; twostraws says signposting in AGENTS.md became "counterproductive" because ripgrep finds things [S31].
- "2M-context Grok" claim: one low-quality aggregator (tokenscost, 531 followers, 2026-08-14) states "Grok 4.6: $2/$6 per Million Tokens, 2M Context" [S61]; davis7 says Grok 4.7 pricing doubles over 200K tokens [S21]. Not verified here.

### E. Consensus vs contested

| Topic | Verdict | Support |
|---|---|---|
| Opus 5.5 is the best value general-purpose Claude model; Fable 5.1 no longer needed as default | **Consensus** (n>=8 independent, incl. Srinivas, kunchenguid, signulll, jarredsumner) | [S2 S6 S9 S35] |
| Opus 5.5 burns less plan usage than GPT-6 Sol/Astra and Fable 5.1 | **Consensus** (n=5, all self-reported, no metering shown) | [S9 S12 S30 S31 S60] |
| Astra is the smartest planner/hard-problem model but lazy and costly | **Consensus** (n=4) | [S3 S14 S23 S31] |
| Sol is the best adversarial reviewer / relentless implementer | **Leaning consensus** (n=3; twostraws, kunchenguid, Kappaemme1926 "challenges") but 6.0 Sol also called nerfed (PawelHuryn, leodev) | [S2 S5 S12 S30 S31] |
| GPT-6.1 Sol replaces Astra at 1/5 cost | **Contested / unconfirmed** (positive: PawelHuryn, blader, notjazii, DeryaTR; negative: BridgeBench) | [S5 S16 S48 S49] |
| Sonnet 5.5 is nearly Opus 5.5 for much less | **Emerging consensus** (MatthewBerman, Tim_LB, PawelHuryn) but effort-sensitive and 2 days old | [S18 S41 S42] |
| Who wins bug finding: Astra vs Opus | **Contested**: twostraws Opus >> Astra; PawelHuryn Astra 45 > Opus 5.5 41.7 > ... but Sonnet 5.5 max 55.5 | [S5 S18 S31] |
| Fable 5.1 still better at deep multi-file architecture / plan review | **Contested, weak evidence** (replies to Srinivas: n=4 claim yes; Srinivas himself found minimal difference) | [S6 S7] |
| Over-engineering is a GPT-6 (Sol/Astra) trait | **Consensus** (jpschroeder, kevinkern, StatsWire, nathanwchan) | [S3 S14 S37] |
| Codex vs Claude Code CLI: Claude Code better UX (subagents, voice, Ask User Question, auto mode) | **Single strong source** (twostraws) | [S31] |
| Mixed-model routing saves money | **Contested**: kunchenguid/Voxyz say yes; kevinkern says cheaper worker output gets redone and "more routing doesn't automatically give you better quality at a lower cost" | [S2 S14 S15] |
| Grok 4.7 as coding model | **Contested**: "favorite" (tetsuoai) vs "just okay" + reward hacking (zhuokaiz); price/limits complaints consistent | [S20 S21 S53] |
| Gemini/agy | **Insufficient evidence**; harness criticised, model claimed benchmaxxed | [S24 S27] |
| Cursor Composer, Kimi CLI | **Insufficient evidence** (no real-use comparisons found) | - |
| Long-context rot | **No evidence** in this corpus | - |

### F. Vision / computer use

- Astra: "a beast at computer use" (kevinkern [S14]); "if you haven't started using Astra with computer use, you haven't tasted the AGI popsicle" (jpschroeder [S3]). An OpenAI post 2026-09-27 says a bug degrading image understanding in GPT-6 Sol/Luna "including computer use" was fixed (vendor, OpenAIDevs 2104252306447544447).
- GPT-6.1 Sol: claimed cheap+fast at OSWorld / Terminal-Bench-Science (cheatyyyy, 4k followers [S62]; unverified, vendor-figure repost).
- Opus 5.5 / Sonnet 5.5 computer-use practitioner comparisons: none found beyond marketing; mattshumer_ shows Opus 5.5 using a 3D printer loop ("16 attempts") [S63].

### G. Posts to re-check when a new model ships (rerun)

`xrelay batch --file .orchestrate/raw/x-queries.txt --product Top|Latest --delay 3000` plus `.orchestrate/raw/x-queries2.txt`. Re-read the PawelHuryn 105-bug thread (S5, S18: more effort levels and n=3 promised), kunchenguid's line-up (S2), jpschroeder's Astra review (S3), the zhuokaiz SWE-Together leaderboard (S19), and bridgebench/blader on 6.1 Sol (S16, S49).

## Effort-level reports

Added on request. Effort-level charts are mostly images attached to posts (not transcribed; numbers below come from the post text). Grade [P] unless marked [B] (Artificial Analysis, independent, run by AA on its own indices; version as named in each post). Accessed 2026-09-30. Extra queries: `.orchestrate/raw/x-queries3.txt`, archive `x-corpus3.json`, `x-aa.json`, `x-theo.json`.

| Model | Effort finding | Role implication | Who / date / engagement / own measurement? | Post + <=25-word quote |
|---|---|---|---|---|
| Opus 5.5 | xhigh >= max: "Opus 5.5 scores higher with xhigh than it does with max." | Use xhigh (or high) not max; max sets a floor of reasoning | theo (395k), 2026-09-25, 1.1k likes. Own claim, chart not in text | x.com/theo/status/2103274408567881948 |
| Opus 5.5 | [B] Terminal-Bench-Science 0.1: low 24%, xhigh 62%, max 59%; ~5x cost/task low to xhigh | xhigh is the peak; low is a big quality loss on hard agentic work | ArtificialAnlys, 2026-09-24, independent | x.com/ArtificialAnlys/status/2103265959314395457: "Max effort for Opus 5.5 scores slightly below xhigh at 59%." |
| Opus 5.5 | [B] AA Coding Agent Index: 66 at max in Claude Code (highest measured); Cost per Task $13.04 (vs Opus 5 $10.79); AA Intelligence Index 58 at ~$5.98/task (max with fallback) | Max is best on AA's index despite theo's xhigh finding: **conflict between AA index and theo/TBS** | ArtificialAnlys 2026-09-24 and 09-23 | x.com/ArtificialAnlys/status/2102932119995756613 ; .../2102833926788288704 |
| Opus 5.5 | High is "over 2x cheaper than Fable 5.1 High"; Fable xhigh to Opus high = "6.6x increase" in limits | Default Opus 5.5 to high/xhigh for plan-limit reasons | theo, 2026-09-27, 2.7k likes, own usage estimate | x.com/theo/status/2104339496942948401 |
| Opus 5.5 | "Max reasoning effort ... sets a minimum amount"; xhigh "won't over-reason if it doesn't have to" | Overthinking risk at max | theo, 09-25 | x.com/theo/status/2103284606690873529 |
| Opus 5.5 | Medium recommended for orchestrator by pescatios; kunchenguid: planners high/xhigh, implementers medium | Planner high/xhigh, implementer medium | pescatios 09-28 (opinion); kunchenguid reply 2103278667443188064 (09-25) | see S28, S2 |
| Sonnet 5.5 | [B] Max = Intelligence Index 56 (2 behind Opus 5.5 max), ~193k output tokens/task ("most we have measured", ~7x Astra max), $7.60/task; TB 4.0 64% at max | Max only when cost irrelevant; effort is a huge cost multiplier | ArtificialAnlys 2026-09-28 | x.com/ArtificialAnlys/status/2104640155843989864 ; 2104640160709394904: lower efforts "sitting behind GPT-6 Sol high, xhigh, and max" |
| Sonnet 5.5 | PawelHuryn 105-bug repos test: max 55.5 (1,330 turns, n=2), xhigh 39 (588 turns, n=1) | Max best for bug hunting (turn count), xhigh worse | PawelHuryn 09-29, own measurement, small n | x.com/PawelHuryn/status/2104818995316527105 |
| GPT-6 Astra | "you probably should just use GPT 6 Astra at low reasoning setting" - scaling very different vs 5.6 Sol | Astra low/medium as smart worker | zainhas (8k), 2026-09-05, 2.0k likes; own chart (image) | x.com/zainhas/status/2096039947203711101 |
| GPT-6 Astra | jpschroeder: "Astra on low is smarter than Sol on xhigh and way faster"; high burned a week's usage day one | Astra low/medium for most work | 13.8k, 09-09; own experience | x.com/jpschroeder/status/2097735365905829924 |
| GPT-6 Astra | Low can match xhigh if `context_management = { experimental_mode = true }` in Codex config | Enable context management for low effort | nummanali (12k), 09-04, 726 likes; own claim | x.com/nummanali/status/2096014653092405636 |
| GPT-6 Astra | Counter: "even on Low reasoning, Astra burns through limits faster than Sol on Max!" / "drains usage on medium or even low effort like water" | Limit burn is high at every level | TJeparskis (0.3k) and wholyv (3.7k), 2026-09-06 | x.com/TJeparskis/status/2096689149998682509 ; x.com/wholyv/status/2096691654006804739 |
| GPT-6 Luna | "Most work (~95%) can be done with Luna (specifically xhigh, fast)" | Luna xhigh as main cheap worker; Astra for the ~5% polish | ctatedev (68k), 2026-09-06, 1.3k likes; own experience | x.com/ctatedev/status/2096616377914191943 |
| GPT-6 Luna | Max effort is off by default; enable in Codex Settings (daniel_mac8, ForwardEditor) | Set Luna to Max for subagents | 09-22/24 | S50 |
| GPT-6 Luna | [B] AA Cyber Index: Luna (max) 53 at $0.12/task, cheapest tested; attempts tasks siblings refuse; Intelligence Index Luna (max) 37 at $0.068/task | Cheap smart worker at max effort (esp. security tasks) | ArtificialAnlys 09-28 and 09-23 | x.com/ArtificialAnlys/status/2104548889919668581 ; .../2102833926788288704 |
| GPT-6 Luna | dhh: "look at Luna on max too" (bargain framing) | Luna max praised | dhh (908k), 2026-09-21, 1.5k likes; reposts chart | x.com/dhh/status/2102145065195860257 |
| GPT-6 Sol | [B] TBS: gains 27 points low to max at ~7.5x cost | Effort is expensive for Sol | ArtificialAnlys 09-24 | x.com/ArtificialAnlys/status/2103265959314395457 |
| GPT-6.1 Sol | [B] xhigh scores 1 point above Astra on AA Coding Agent Index at <15% cost; "xhigh effort ... outperform the max effort setting by 3 points" | Run 6.1 Sol xhigh, not max | ArtificialAnlys 2026-09-29 | x.com/ArtificialAnlys/status/2105047408803725717 |
| GPT-6.1 Sol | OpenAI DeepSWE chart (via Voxyz): high scores highest; medium ~2 points lower and >30% cheaper; xhigh/max score lower. Orchestrator high, subagents medium | Orchestrator high, subagents medium | Voxyz_ai 09-29, second-hand from vendor chart | S15 |
| GPT-6.1 Sol | theo: "around Opus 5.5 Medium levels for under a third the price" (AA numbers) | 6.1 Sol ~ Opus 5.5 medium | theo 09-29, 1.6k likes | x.com/theo/status/2105005625726099473 |
| Fable 5.1 | Low reasoning has an "adaptive thinking" blind spot: 5x6 multiplication accuracy drops to ~0% (model skips reasoning and answers wrongly) | Do not use Fable at low for exactness-critical work | maksym_andr (7.8k), 2026-09-16, own test | x.com/maksym_andr/status/2100364212207837560 |
| Fable 5.1 / Grok 4.7 | Cursor: Fable 5.1 73.4% CursorBench 3.2 "at max effort" (vendor); AA Cyber Index: Grok 4.7 xhigh is #1-tied at 56 but $11.67/task | Grok 4.7 xhigh is costly | cursor_ai 09-01 (vendor); ArtificialAnlys 09-28 | x.com/cursor_ai/status/2094852929282879596 |

Notes:
- **Consensus:** effort is a large cost multiplier (5x to 7.5x low-to-top per AA), the best setting is rarely max (Opus 5.5 xhigh, 6.1 Sol xhigh/high), and Astra is the model where low/medium is claimed smart enough.
- **Contested:** Opus 5.5 max vs xhigh (AA Coding Agent Index best at max vs TBS and theo saying xhigh). Sonnet 5.5 max wins the practitioner bug hunt but xhigh does not, while AA shows lower Sonnet efforts are dominated by Sol on tokens.
- **Overthinking evidence:** theo on Opus max; AA on 6.1 Sol max < xhigh; OpenAI chart via Voxyz. No controlled overthinking study found.
- theo also says he is tired of effort dropdowns and expects models to self-regulate; theo cited AA and ran his own tests; he has sponsorship relationships (not verified here).

## Gaps

- **No Kimi CLI, Grok 4.1 Fast / "grok-4.7-build-fast", grok-code-fast, or Cursor CLI (`cursor-agent`) real-use comparison found.** Query "grok 2M context" returned 4 tweets, only one weak claim (Grok 4.6 2M). Verify with the vendor lane.
- **Antigravity (`agy`) evidence is one practitioner (tangchuan_CN) plus PawelHuryn using agy as harness.** No comparison of Gemini models against Claude/GPT in agy.
- **Context rot:** no controlled tests; nothing on Fable 5.1 / Opus 5.5 / GPT-6 degradation at long context.
- **Mythos 5.1, Haiku 5.5, Fable 5.5, Gemini 4 Pro, GPT-6.1 Astra:** rumour/leak only (e.g. ns123abc claim that OpenAI "scrapped" GPT-6.1 Astra, 2026-09-28, unverified). Not used as evidence.
- **Effort-level curves:** only PawelHuryn (Sonnet 5.5 max > xhigh; n=1-3) and Voxyz/Av1dlive (6.1 Sol high best per OpenAI DeepSWE chart) - reported second-hand; see lane 07.
- **Selection bias:** X is dominated by launch-week demos (3D, games, motion graphics), influencers with affiliate/product ties, and vendor staff. Reply sections of "which model" polls are full of spam (Starlink, retail ads) and small accounts. Engagement weights favoured big accounts; few negative reports on Opus 5.5 surfaced, which may reflect honeymoon effect (releases 2026-09-22 and 09-28).
- No post in the corpus measured tool-use reliability or instruction-following with actual metrics; claims are impressionistic.
- Windows: everything is 2026-08-01 to 2026-09-30; over 90% is within the last three weeks.

## Sources

Primary post links: `https://x.com/<handle>/status/<id>`; accessed 2026-09-30 via xrelay. Grade [P] unless noted. "re-check" marks fast-moving items.

- [S1] (index) Opus 5.5 vs Fable comparison threads: see S2, S6, S7 (re-check weekly).
- [S2] kunchenguid, role line-up - x.com/kunchenguid/status/2103277022235766963 - 38k followers, builds "firstmate" orchestrator. Full text read. Re-check.
- [S3] jpschroeder, "Astra: the good, the bad, and the Fable" - x.com/jpschroeder/status/2097735365905829924 - 13.8k, co-founder Standard Agents; long-form review. Quotes verbatim.
- [S4] Howaboua/pi extension defaults (Sol general, Luna explorers) - x.com/Howaboua/status/2102476943601856629.
- [S5] PawelHuryn, GPT-6.1 Sol 105-bug test - x.com/PawelHuryn/status/2105065401193279918 - 133k, newsletter; n=1 to 3; harness Antigravity CLI (reply 2105075246940233766). Re-check: more efforts promised.
- [S6] Aravind Srinivas poll - x.com/AravSrinivas/status/2104270322757509315 - 1.1M, Perplexity CEO; thread read (30 replies); replies are small accounts.
- [S7] Reply cluster in S6 (heman_ 2104282298749493294, prasithg 2104305131554525231, mukparekh 2104454648379912215, internetlabsai 2104287715348914648).
- [S9] signulll - x.com/signulll/status/2103974381219196937 - 268k, 3.9k likes.
- [S11] SimonHoiberg - x.com/SimonHoiberg/status/2101669098081882527 - 163k; tracked via OpenClaw.
- [S12] leodev - x.com/leodev/status/2103291143052202027 - 3.4k followers.
- [S13] mattshumer_ Sol comment - see S47.
- [S14] kevinkern - x.com/kevinkern/status/2098819267852390741 - 21k.
- [S15] Voxyz_ai - x.com/Voxyz_ai/status/2105012597796057438 (also Av1dlive 2105006602369876120) - sells prompts; affiliated tone.
- [S16] blader - x.com/blader/status/2105095660450320571 - 407k; internal evals for his product; conflict of interest.
- [S17] Cognition (Devin) - x.com/cognition/status/2104988938817413583 - vendor-adjacent, FrontierCode 1.1 numbers not independently verified.
- [S18] PawelHuryn, Sonnet 5.5 105-bug test - x.com/PawelHuryn/status/2104818995316527105.
- [S19] zhuokaiz, SWE-Together leaderboard update - x.com/zhuokaiz/status/2102825912471527738 - Meta researcher; 2,616 trials; `[P/B?]` self-run leaderboard, contamination-controlled sandbox. Re-check.
- [S20] zhuokaiz, Grok 4.7 reward hacking - x.com/zhuokaiz/status/2102614668434956442.
- [S21] davis7 - x.com/davis7/status/2102213709825560595 - 22.7k; Grok Build on $300 SuperGrok Heavy.
- [S22] Composio Kimi K3 harnesses - see S54.
- [S23] Yuchenj_UW - x.com/Yuchenj_UW/status/2101362635128401978 - 297k; thread read.
- [S24] tangchuan_CN (Antigravity via Pi) - x.com/tangchuan_CN/status/2104925431678017775 - 5k; Chinese language, translated.
- [S25] antigravity official launch of Gemini 3.8 Flash - x.com/antigravity/status/2095177099086602466 - vendor, not evidence.
- [S26] Composer/Cursor rumours - x.com/maria_rcks/status/2099355075835555870, x.com/anthdm/status/2103758812612001953.
- [S27] SemiAnalysis benchmaxxing thread - x.com/SemiAnalysis_/status/2097112791471522292 - 168k; thread body not read (1/5 root only).
- [S28] pescatios - x.com/pescatios/status/2104666183865626669 - 1k, 2 likes; opinion only.
- [S29] dani_avila7 - x.com/dani_avila7/status/2104679128020754457.
- [S30] Kappaemme1926 - x.com/Kappaemme1926/status/2103163803743514852.
- [S31] twostraws (Paul Hudson) Codex vs Claude article - x.com/twostraws/status/2101317950787432483 (X Article read via `xrelay article`) - 121k; predates Opus 5.5; sells an app.
- [S32] bridgemindai - x.com/bridgemindai/status/2102351339384721424 - brand account.
- [S33] thedelost `/advisor fable` - x.com/thedelost/status/2104677530825634273 - 3k followers, tip account, viral.
- [S34] bcherny - x.com/bcherny/status/2102439069053747549 - Anthropic staff, not counted as independent.
- [S35] jarredsumner - x.com/jarredsumner/status/2102454066823758149 - 192k, Bun.
- [S36] rpnickson 3D-printed bridge - x.com/rpnickson/status/2104234974350111108 - 62k; single physical task.
- [S37] StatsWire "deleted 145,398 lines" - x.com/StatsWire/status/2104578345560142053 - aggregator, unverified.
- [S38] ValsAI - x.com/ValsAI/status/2102470503328010349 - evaluation company; 15h Lean proof.
- [S39] GodsBoy7777 - x.com/GodsBoy7777/status/2103599698959278370 - Hermes compression config.
- [S40] bridgemindai NerfBench - x.com/bridgemindai/status/2104242319037804728 - self-run.
- [S41] MatthewBerman - x.com/MatthewBerman/status/2104634635234005025 - 141k; early access possible.
- [S42] Tim_LB - x.com/Tim_LB/status/2104663105837932884 - small account, one benchmark.
- [S43] dayonefoundry poll - x.com/dayonefoundry/status/2104781740774740143 - 6.7k, 2.4k likes; replies read.
- [S44] _Mira___Mira_ Factorio - x.com/_Mira___Mira_/status/2098343807410712814.
- [S45] IterIntellectus - x.com/IterIntellectus/status/2105020855503974911.
- [S46] bridgemindai limit - x.com/bridgemindai/status/2105016612365770809.
- [S47] mattshumer_ - x.com/mattshumer_/status/2102463686208262426 - 397k (OthersideAI CEO).
- [S48] notjazii - x.com/notjazii/status/2105029376266088761.
- [S49] bridgebench - x.com/bridgebench/status/2105018236165099538.
- [S50] daniel_mac8 - x.com/daniel_mac8/status/2103206463061794845; ForwardEditor - x.com/ForwardEditor/status/2102461166928756743.
- [S51] sairahul1 - x.com/sairahul1/status/2102821045137011006 - promo account.
- [S52] see S4.
- [S53] tetsuoai - x.com/tetsuoai/status/2102354165565681731.
- [S54] composio, Kimi K3 6 harnesses - x.com/composio/status/2083161873357111297 - vendor blog; before window (2026-07-31), thread not read.
- [S55] alexhawat opencode vs Cursor - x.com/alexhawat/status/2098754488978788842 - 0.5k; n=1 head-to-head.
- [S56] kaif9998 - x.com/kaif9998/status/2099949274125721929 - promo-flavoured.
- [S57] nutlope - x.com/nutlope/status/2089368446182072625 - 101k; Together AI (sells OSS inference).
- [S58] Crypto_QianXun - x.com/Crypto_QianXun/status/2099384404674302412 - 80k; ranking list (Chinese).
- [S59] Cursor acquisition claim - x.com/RealNickMugalli/status/2092230700854333589 (finance account); verify elsewhere.
- [S60] shownotover - x.com/shownotover/status/2104124596957933687.
- [S61] tokenscost - x.com/tokenscost/status/2088380830016012559 - 531 followers; low reliability.
- [S62] cheatyyyy - x.com/cheatyyyy/status/2104983215979319317.
- [S63] mattshumer_ printer loop - x.com/mattshumer_/status/2104777202684301750.
