# Frontier sweep — X/Twitter, August 2026 — research record

> **Status:** research-only — nothing here has been adopted into `orchestrate` v1.8.0. Research date: 2026-08-07.

*Method: 15 X/Twitter URLs supplied by the user, all read in full via x-relay (`xrelay thread`,
`xrelay article` for the six that are X Articles behind a bare link, `xrelay search
"conversation_id:<id>"` to recover reply trees that `thread` returned empty, `xrelay media --out`
+ image reads for the three that carry load-bearing images). Novelty judged against
`skills/orchestrate/SKILL.md` and targeted reads of `references/shared-model-routing.md`,
`shared-token-economy.md`, `shared-review-gates.md`, `shared-contracts.md`, `shared-monitoring.md`,
`shared-safety-rails.md`, `strategy-loop.md`, `strategy-workflow.md`, plus greps across the whole
reference set for the specific mechanisms claimed.*

**Note on numbering:** the source list the user supplied skips 3 and 11 and splits 5 into three
tweets. Sections below use the user's numbers exactly, so the gaps are intentional.

---

## TL;DR — what converges across fifteen independent sources

1. **The bottleneck everyone names is review, not generation.** Five sources independently arrive
   at the same funnel: generation is cheap and unbounded, human review is the neck, and the only
   way past it is a *machine* verdict with a threshold you set once. Avid (1) calls it "the second
   neck"; Argona (9) calls it the difference between a thermometer and a thermostat; Fishbein (10)
   builds a whole factory whose sixth station is "the teacher grades the homework"; Kopadze (12)
   makes the checker "the whole trick"; Rohit (8) makes verification "independent" a design layer.
   `orchestrate` already gates, but it gates with a *reviewing agent*, not with a cheap calibrated
   number, and it has no notion of a threshold that lets work through unread.
2. **"Graph engineering" is the July-2026 name for what this skill calls parallel + workflow.**
   Three sources (12, 14, 15) are dedicated graph-engineering explainers. Stripped of the branding,
   the substance is: nodes with declared read/write contracts, the fake-edge test for finding
   parallelism, the fan-out → reduce-in-code → verify-fresh → synthesize diamond, and a named set
   of failure modes (context collapse on fan-in, false independence via shared resources, silent
   node death). Most of this is already in `strategy-parallel.md`/`strategy-workflow.md` —
   but three of the failure modes and the fake-edge test are not, and the vocabulary is now what
   users will bring to the skill.
3. **Model routing has moved from "pick a tier per role" to "pick a tier per *stage*, at max
   thinking, and escalate on trajectory evidence."** Sources 4, 5a/b/c, 6 and 8 all land here.
   The strongest single line in the whole sweep is a reply to 5a: *"the whole setup lives or dies
   on that escalation decision. a great router with weak models beats great models with a router
   that always picks luna to save cost."* The skill escalates only on `BLOCKED`; nobody in this
   corpus escalates on status — they escalate on *evidence from the trajectory* (repeated errors,
   ping-pong, no progress for N steps, budget burn).
4. **Reasoning effort is the cheap lever and it is off by default.** 5c (3,558 likes, 1.1M views)
   and the Artificial Analysis chart in 5b establish the Pareto point: a cheap model at *max*
   thinking sits in the attractive quadrant against a strong model at *low* thinking, at a fraction
   of the cost. The skill's rule 8 knows effort knobs exist and says "cheap stage = low effort" —
   which is close to the opposite of what this corpus does.
5. **Multi-model orchestration has a real, well-argued counterweight.** dan_saffar under source 6:
   *"Every handoff to a second model costs a context tax, and that tax compounds… For most work
   that actually ships, one strong model inside a tight plan-eval-act loop beats two specialists
   that keep re-explaining the world to each other. Specialization only wins when the handoff is
   almost free, and it rarely is."* Field reports under 5a corroborate (multiple users report the
   cheap-implementer lane producing a mess), and the plugin under discussion **retired its cheap
   lane between v0.2.0 and v0.3.0**. This is the honest-numbers material the skill's house style
   demands.
6. **"Any failure you do not turn into a permanent test, you will meet again."** Sources 1, 2, 9
   and 10 all build the same loop: a production failure becomes a sealed eval case. `orchestrate`
   has no rule anywhere that a caught defect becomes a durable check — grepping the whole reference
   set for "regression test" returns nothing.
7. **Long-horizon runs need an external control plane, not a longer context.** LoopX (13) is the
   only source here with a hard number on duration — two trajectories at 220.7 and 272.9 hours —
   and its central claim is that the model context cannot hold the five control questions, so
   goal/authority/evidence/cadence/recovery must live outside it. The skill's ledger + handoff are
   the same instinct at a smaller scale; LoopX's four invariants are sharper than anything the
   skill states.

---

## 1 — Avid (@Av1dlive), "How to Build Your First Agent Factory" — 29 Jul 2026

Bare-link tweet (539 likes, 1,786 bookmarks, 1.08M views) fronting a ~5,400-word X Article. The
companion repo `github.com/codejunkie99/sageroute` is a sibling agent's beat; noted as a link only.

**What it claims.** An "agent factory" is a five-station line (spec, stamp, prove, certify,
operate) whose product is a *certified agent*, gated by one law: **"no evals, no production."**
The framing device is two bottlenecks, and it is the sharpest thing in the article:

> ```
> first neck   certify the agent    once, by a human       -> the light switch
> second neck  gate its output      every run, forever     -> has to be a machine
> ```

The first neck stays human — *"certification is the station that stays human"*, enforced literally
as `if input("sign it? [y/N] ")…`. The second neck is a calibrated decision-model call (Levanto's
"Sage", `yesno`/`choice`/`scale` kinds) returning a probability you threshold. Supporting
mechanisms worth extracting independently of the vendor:

- **The ABOM** (agent bill of materials): a JSON card carrying `model` primary+fallback, `tools`,
  `tools_denied`, `gate_question`, `evals.pass_bar`, `cost_envelope_usd`, `identity`.
- **The broker**: *"Every tool call goes through a broker that reads the card first"* — with
  `DENIED_EXPLICIT` beating `DENIED_UNGRANTED`, because *"denied wins over allowed. a card listing
  a tool in both is a bug, and the safe reading of a bug is no."* Policy enforced outside the model:
  *"An agent can't prompt its way past a grant it was never given."*
- **The digest check**: the eval record stores `abom_digest` (sha256 of the card); certification
  fails if the card changed after the sealed run. *"Without it the loop is: run the suite, read
  the failures, tune until it passes, ship; an agent fitted to its own test."*
- **Sealed cases**: *"Sealed cases are the half the builder never sees. Rotate them. An agent tuned
  against a visible suite is optimizing the suite."*
- **`dry=True` as a testing mode**: *"An agent under test that can write to the suite it is judged
  against is not being tested, it is being consulted."* In dry mode every tool becomes a recorder,
  so denials still count but nothing touches disk.
- **`tool_denials` in the record**: *"An agent that passes its suite while reaching for tools it
  doesn't have is not passing."*
- **Four autonomy tiers**, `C0 observe / C1 draft / C2 act_with_approval / C3 act`, with C0 defined
  as running on live work and shipping nothing: *"It's the only tier where being wrong costs you
  nothing."* And: *"Autonomy is evidence you produced, not confidence you feel."*
- **restamp**: fixing a master re-derives its variants **and revokes their certificates**. *"A fix
  that propagates without revoking is worse than no propagation at all, because now the certificate
  is lying."*
- **The run gate / SageRoute router**, the part most relevant to us: five *local* detectors read the
  harness's own resent conversation to decide when to ask for an escalation decision — same action
  returning the same observation 3×; one error class 3× back to back; two actions alternating 4×
  inside the last 8; write-fail-write-fail cycles; no successful execution for N steps, *"where
  progress means a command ran, not that a file changed."* What is sent upward is not the
  transcript: *"Reasoning is never evidence; it reduces to counts, classes and digests"* —
  `tool_calls=14 tool_errors=6 recent_error_rate=0.67 loop_detected=true loop_kind=ping_pong
  consecutive_failed_verifications=3 steps_since_progress=7 cost_usd=0.41 budget_usd=5.00`.
- **`restart_clean`**, flagged by the author as the steal-this option: *"It rebuilds the request
  keeping the user task, tool calls and outputs, and drops the model's own reasoning, because
  polluted context is how one bad turn becomes ten."*
- **Two questions, not one**: a `yesno` "does this run need intervention" gate at 0.6, and only on
  clearing it a `choice` between continue/switch_model/restart_clean/escalate_human. The author
  shipped the four-way alone first and *"it under-escalated… Narrow questions calibrate. Wide ones
  smear."*
- **Fail-open logging discipline**: the Sage client 403'd without a User-Agent and every run
  silently went to a human. *"A gate that is never reached looks exactly like a gate that always
  says no."* And after shipping the same class of bug twice: *"never let two different failures
  print the same string"* / *"A check you skipped and a check that passed must never look the
  same."*

**Evidence quality.** Working code with reproduced terminal output (seven guard exit-1s each shown
firing), one verified vendor latency claim (*"they claim ~200ms… my calls came back at 191ms"*), and
an unusually honest "What I Haven't Built" section — the worker was never actually connected to a
model key, so all runs logged `offline`. The router's economics are explicitly *not* claimed:
*"What I still can't tell you is the dollar figure across many tasks. I'd rather say that than
round it up."* Vendor-adjacent (Levanto's free tier is promoted) but not sponsored-shaped, and the
author draws the line himself: *"A vendor offering to automate that box is selling you the one
thing you should not buy."*

**Delta vs orchestrate v1.8.0.**
- Two-neck framing: **genuinely new as a framing**. The skill's `shared-review-gates.md` has one
  neck (an agent reviewer) and no concept of a machine verdict with a numeric bar.
- The broker / grant enforcement outside the model: **partially covered** —
  `shared-safety-rails.md` says "Workers get the NARROWEST permission mode that works; headless
  runs pre-allowlist the exact commands", which is the same idea at the host-permission layer, but
  there is no per-agent card, no deny-beats-allow rule, and no denial count in any report schema.
- Trajectory detectors + mid-run escalation: **genuinely new**. `shared-monitoring.md` rule 4 has
  "thrash signals" but they route to *repartition*, not to a model escalation, and they are
  qualitative ("repeated conflicts/rework WITHOUT acceptance-gate movement"). Nothing in the skill
  counts ping-pong, error-class repeats, or steps-since-progress; nothing defines progress as "a
  command ran, not a file changed".
- `restart_clean`: **genuinely new**. The skill's answer to a poisoned context is a fresh
  subagent (whole context discarded); nobody rebuilds a context keeping tool results and dropping
  reasoning.
- Digest-pin of the brief against the eval record: **partially covered** — briefs pin file
  pointers with `@ <sha>` (`shared-token-economy.md`), but no artifact hashes the brief itself so
  that a post-review edit invalidates the gate.
- "Autonomy is evidence you produced" / tiered rights: **already covered** —
  `shared-safety-rails.md`, "Tiered autonomy: ship-alone rights are EARNED per work-class by track
  record". C0-as-shadow-mode is the one rung the skill lacks.

**Adoption candidate.** Two edits and one new script-shaped idea.
(a) A **trajectory-escalation** subsection in `shared-monitoring.md`: five countable stall
signals + the rule that the escalation packet is counts/classes/digests, never the transcript.
(b) `restart_clean` as a named recovery move in `shared-monitoring.md` rule 2's ladder, sitting
between "nudge" and "respawn".
(c) A **fail-open logging rule** in `shared-safety-rails.md`: a skipped check and a passed check
must never print the same string; log every fail-open. This is cheap, universal, and the skill's
gates are exactly the place it bites.
Reject: the Sage/Levanto dependency itself and the full five-station factory — `orchestrate`
coordinates runs, it does not own an agent registry, and adopting a certification lifecycle would
cross into territory the skill deliberately doesn't hold.

---

## 2 — Akshay Pachaar (@akshay_pachaar), "Your Agent Harness Should Repair Itself" — 8 Jun 2026

Bare-link tweet (1,450 likes, 3,602 bookmarks, 1.4M views) fronting an X Article.

**What it claims.** Observability that stops at the trace leaves four questions, three of them
manual: *"'What happened' → the platform handles this / 'Why it happened' → manual / 'Here's the
fix' → manual / 'This won't break again' → manual."* Opik's answer is a four-layer loop — tracing
via one decorator, an in-platform coding agent ("Ollie") that reads span trees and proposes a diff,
plain-English test-suite assertions (`suite.add_assertion("The response must include specific deal
details, not just a count")`) compiled to LLM-as-judge checks, and an agent sandbox that runs the
whole graph rather than one prompt. The load-bearing sentence: *"every failing trace you debug
automatically becomes a new test case. The suite grows from real production failures, not synthetic
scenarios someone wrote in advance."*

**Evidence quality.** **Marketing** — explicitly sponsored (*"Thanks to Comet ML for sponsoring
today's issue"*, *"don't forget to star 🌟"*). No numbers beyond a star count. The article's one
non-vendor claim — that Cursor's harness work "never really ends" — is unsourced here. Treat the
architecture as a hypothesis, not evidence.

**Delta vs orchestrate v1.8.0.** The "failing trace becomes a permanent regression case" rule is
**genuinely new** to the skill (grep for "regression test" across `references/` returns nothing),
but source 9 makes the same point with far better evidence, so credit it there. Everything else is
product surface. The one transferable framing: `orchestrate` currently answers "what happened"
(ledger, reports, raw logs) and "here's the fix" (fix subagent + re-review) but has no step that
makes a caught defect *durable* beyond one line in `progress.md`.

**Adoption candidate.** **Reject as a source** (sponsored, no evidence). Fold its one real idea
into the source-9 candidate.

---

## 4 — Ray Fernando (@RayFernando1337), the per-stage model/effort assignment table — 4 Aug 2026

Head tweet (1,418 likes, 2,651 bookmarks, 150K views): *"I finally cracked it! There is a better
way to run Codex agents without the slop. As bonus it saves you tokens! Engineers at top FANG
companies are using this workflow to ship production software."* The head carries **one** image
(not several — `xrelay media` returns exactly one photo, and the only self-reply in the
conversation is a quote of a livestream announcement). `thread` returned zero replies; the reply
tree was recovered with `conversation_id:` search and contains the substance, almost all of it from
**@norlava**, who builds the tool under discussion (Atomic, `github.com/bastani-inc/atomic`).

**The image, transcribed in full.** Header "Full assignment across the run:", a four-column table
Stage / Model / Thinking / Role:

| Stage | Model | Thinking | Role |
|---|---|---|---|
| change-map ← *running* | gpt-5.6-luna | max | research workhorse |
| security-audit | gpt-5.6-sol | max | judgment |
| migration-audit | gpt-5.6-sol | max | judgment |
| deployment-plan | gpt-5.6-terra | max | planner |
| user-impact | gpt-5.6-terra | max | planner |
| key-lifecycle | gpt-5.6-terra | max | planner |
| synthesis | gpt-5.6-terra | max | planner |
| adversarial-challenge | gpt-5.6-sol | max | judgment |
| triage | gpt-5.6-sol | max | judgment |
| repair-N | gpt-5.6-luna | max | worker |
| verify-N | gpt-5.6-sol | max | judgment |
| deployment-runbook | gpt-5.6-terra | max | planner |

Every stage runs at **max** thinking. Three roles only — research/worker (cheap), planner (mid),
judgment (strong) — and the *same* model recurs across non-adjacent stages.

**What the reply tree claims** (all @norlava, verbatim):
- Typed hand-off between stages: *"stages declare typed output schemas so change-map emits a
  validated structured result. Bulk context goes to files and artifacts on disk and audit receives
  the path plus instructions to read rather than a blog to inject into its prompt. Downstream
  stages consume only declared outputs so the contract between stages stays explicit."*
- Where the savings actually come from: *"the bigger win is catching plausible but wrong
  implementations at a review gate. Then context savings come from the stages doing hand off
  through files instead of inheriting transcripts and long running stages get compacted (via
  verbatim compaction so lossy context is reduced). And cheaper models handle the mechanical work."*
- The Pareto posture: *"Max thinking on cheaper models and then Sol only for review gates and hard
  debugging. So luna does the bulk of the work and trivial mechanical steps route to cheaper
  models. You spend the 'frontier' tokens only for tasks that are critical to the loop."*
- Why the strong model is **not** the planner: *"terra plans at basically sol's accuracy for a
  fraction of the cost and sol's tendency to over-engineer is worse in a planner because then the
  plan over scope every downstream stage."* And why it *is* the reviewer: *"Sol doesn't write the
  code so it over-engineers less… and for reviewing it's ok if it over-engineers."*
- Automated tier selection: *"keeping a pareto analysis of the cost vs accuracy per role built from
  live coding agent benchmarks and workflows pick per stage models from your configured catalog
  with fallbacks so you don't have to constantly reevaluate."*
- The honest cost: *"The tradeoff is time not quality. Review gates and verifier passes make a run
  slower than one shot prompting so this is built for long running background work, not quick
  answers. And for small changes the graph overhead is not wroth it [sic]."*
- Built-in workflow shapes: *"fan out and synthesize, adversarial-verification, tournament, loop
  until done, classify and act"* — authored as TypeScript graphs, no prompt files.

**Evidence quality.** **Working code with a vendor's voice.** @norlava is the tool's author, so
the claims are self-interested, but the source is open and repeatedly offered for inspection, the
stage table is a screenshot of a real run, and the cost/latency tradeoff is stated against
interest. No independent numbers.

**Delta vs orchestrate v1.8.0.**
- The three-role/per-stage assignment: **already covered in structure** —
  `shared-model-routing.md`'s tier table has advisor/orchestrator/reasoner/worker/reviewer/peer,
  and rule 9 already pins the exact same slugs (*"codex (verified 2026-07-13): `gpt-5.6-luna` ≈
  cheap worker · `gpt-5.6-terra` ≈ standard worker/reviewer · `gpt-5.6-sol` ≈
  reasoner/advisor/peer"*). Independent corroboration of our own map — worth recording.
- But **one contradiction worth a ruling**: our map puts terra at "standard worker/reviewer"; this
  source puts terra at **planner** and sol at **reviewer**, with an argued reason (over-engineering
  is destructive upstream of a fan-out and harmless in a review). The skill's tier table has no
  "planner" row at all — planning is folded into `orchestrator`.
- **Max effort everywhere**: **contradicts** rule 8's *"Cheap stage = low effort; judge stage =
  high."* This corpus's position is that effort is the cheapest quality lever and the cheap model
  should be run at max, with the model tier — not the effort dial — carrying the cost decision.
- Typed output schemas as the inter-stage contract: **partially covered**. `shared-contracts.md`
  types the *status enum* and caps chat returns, and `strategy-workflow.md` mentions `schema:` on
  `agent()` calls, but no reference says a downstream consumer may read *only* the declared
  outputs of an upstream stage. The skill's equivalent is "artifacts on disk are the interface",
  which is the same instinct without the schema.
- Pointer-not-payload hand-off: **already covered** and stated more precisely than the source
  (`shared-token-economy.md`, "Pointers, not payloads").

**Adoption candidate.** (a) A recorded **seam ruling** in `shared-model-routing.md` on
planner-vs-reviewer placement, with this source's argument quoted and the counter-evidence from
5a's reply tree attached. (b) Revisit rule 8's effort default in light of 5b's Pareto chart —
this is a *numbers* question, and 5b supplies the numbers. (c) A one-line addition to
`shared-contracts.md`: where a stage's output is machine-consumed, declare its shape and let the
downstream stage read only that.

---

## 5a — Daniel Mac (@daniel_mac8), "sol-advisor" — 1 Aug 2026

Head tweet, 3,674 likes / 6,452 bookmarks / 661K views, with a video (not transcribed):

> "Codex users: here's an amazing way to take advantage of the efficiency and capability of
> GPT-5.6 Luna Max. It's called 'sol-advisor'. 1. GPT-5.6 Sol High as orchestrator 2. GPT-5.6 Luna
> Max as implementer for routine tasks 3. GPT-5.6 Terra Max as implementer for complex tasks
> 4. Fresh GPT-5.6 Sol instance as reviewer… I dare you to install it, and tell me if you hit your
> weekly usage limits using 'sol-advisor'. I doubt you can."

**What the reply tree adds** — and this is where the real evidence is:
- The plugin **removed its cheap lane**. @mancifbier: *"It looks like author changed implementation
  recently and removed Luna from the plugin: - Older v0.2.0: Luna routine tasks / Terra complex
  tasks / Sol review. - Current v0.3.0: Luna is retired; all implementation goes through Terra /
  High and then Sol review."* Corroborated independently by @killianhuyghe (*"The repo doesn't seem
  to use Luna at all… you won't get what is advertised with plain plugin install"*), @_Jake_Rogers_
  (*"Why does v0.3 remove the earlier Luna implementation lane?"*) and @packyourbagson (*"It's not
  even configured to use max reasoning for luna/terra…"*).
- The sharpest orchestration line in the sweep, @ptbthefirst then @freewoojp: *"stacking sol as
  orchestrator with luna and terra as implementers only works if the orchestrator actually knows
  when to escalate to terra instead of defaulting to the cheaper option."* → *"the whole setup
  lives or dies on that escalation decision. a great router with weak models beats great models
  with a router that always picks luna to save cost."*
- Negative field reports, several: @TrdNico (*"Luna Max made a full mess. Half of the week tokens
  burnt and in the process it didn't deliver"*), @YunaBPM (*"Luna writes bad code. I would never
  approve it from a junior."*), @Turicianu_ reporting the orchestrator failing at the coordination
  itself (*"Sol-medium fails to orchestrate (e.g. not even capable to enforce threads to report
  back and stop, despite repeated requests from me)"*), @cotyledonlab on the strong model
  (*"sol max over engineers everything and comes up with its own domain specific language that
  devolves into gibberish over many iterations"*).
- A complete alternative topology, @JamesDowell2: *"Sol medium plans, then a loop of luna max
  working & sol medium on QA. QA eval is made by sol after plan approval but before luna begins.
  3 QA fail verdicts allowed, at which point sol medium just takes over."* — note the two rules
  worth keeping: **the eval is authored after plan approval but before implementation starts**,
  and **a bounded fail count converts into a model escalation**.
- The deflation, @talemi: *"This is nearly identical to saying 'breakthrough that'll change your
  life is using cursor plan mode with [insert favorite leading model] and executing with [still
  good but cheap model]'."*

**Evidence quality.** Head tweet is **practitioner-anecdote bordering on hype** ("I dare you").
The reply tree is a genuine mixed field trial: no numbers, but multiple independent users
reporting concrete failures, and a falsifiable claim (the advertised lane doesn't exist in the
current version) confirmed by three separate readers of the repo.

**Delta vs orchestrate v1.8.0.** The topology itself is **already covered** — this is
`strategy-advisor.md` plus `shared-model-routing.md`'s tier map, and the skill's rule 2 already
warns *"Too-cheap models take 2–3× the turns and lose the savings."* What is **genuinely new** is
the escalation-decision framing: the skill's rule 4 escalates only when a worker returns
`BLOCKED`, which means the router never notices a cheap worker that is confidently producing
mediocre work. @JamesDowell2's "3 QA fail verdicts, then the strong model takes over" is a concrete
mechanism the skill lacks — its review loop caps at ~3 rounds then escalates *to a human*, never to
a *tier*.

**Adoption candidate.** Edit `shared-review-gates.md`'s findings loop and
`shared-model-routing.md`'s rule 4: **N failed review rounds on the same task is a model-tier
escalation, not only a human escalation** — take over with the reviewer tier rather than looping
the worker tier a fourth time. Also record the v0.2→v0.3 retirement in the honest-numbers material:
the most-cited cheap-implementer preset in this corpus deleted its own cheap implementer.

---

## 5b — Evan Reiser (@evanreiser), the parallel-task measurement — 1 Aug 2026

137 likes / 122 bookmarks / 59K views. The only source in the sweep that ran a controlled-ish
comparison:

> "RE: Lunamaxxing (tm) There is a lot of hype to use Luna Max as a cheaper version of Sol Medium.
> I tried ~10 parallel tasks last night: Luna max succeeds in the task about ~70% of the time for
> ~70% cheaper BUT sol was able to accomplish the task ~50% faster time/fewer turns"

**The image, transcribed.** An Artificial Analysis chart, "Intelligence vs. Cost per Intelligence
Index Task" — Intelligence Index (y) against cost per task in USD on a log x-axis, with a shaded
"most attractive quadrant" covering roughly ≥47.5 index at ≤$0.23/task. Reading the plotted points:
Luna (low) ≈33.5 at $0.04, Luna (medium) ≈38 at $0.05, Luna (high) ≈46 at $0.09, Luna (xhigh) ≈49
at $0.13, **Luna (max) ≈51 at $0.21**; Terra (low) ≈40.5 at $0.10, Terra (medium) ≈45.5 at $0.13,
Terra (high) ≈49 at $0.22, Terra (xhigh) ≈51.5 at $0.35, Terra (max) ≈55 at $0.55; **Sol (low)
≈49.5 at $0.20**, Sol (medium) ≈53.5 at $0.32, Sol (high) ≈56 at $0.45, Sol (xhigh) ≈57.5 at
$0.68, Sol (max) ≈59 at $1.05. GPT-5.5 traces below all three. (Coordinates read off the chart by
eye — treat as approximate, and re-derive from Artificial Analysis directly before citing them
anywhere binding.)

The chart is the actual argument for "max thinking on the cheap model": Luna at max is the *only*
point of the twenty that reaches ≈51 inside the attractive quadrant, and it beats Sol at low
effort on both axes. It also bounds the claim honestly — Luna at max never reaches Sol at medium.

A useful reading in the same conversation, @YesSuhBossman: *"Based on this data, Luna would be good
for scheduled tasks and accomplishing /goals while you're AFK. and SOL is great for when youre not
AFK"* — i.e. the cheap-at-max lane is a *background/latency-insensitive* lane, which matches
@norlava's "built for long running background work, not quick answers" in source 4.

**Evidence quality.** **Tested with numbers**, though small-n and self-reported (~10 tasks, one
night, no task list published). The chart is third-party (Artificial Analysis) and is the strongest
citable artifact in the sweep. Contradicting anecdotes exist in the same corpus: @IFITALEX under
5c reports *"Sol medium is 20% higher than Luna max in quality and 50% faster in speed, but there
is no one-sixth difference in cost."*

**Delta vs orchestrate v1.8.0.** **Directly relevant to rule 8** ("Cheap stage = low effort; judge
stage = high"), which the chart argues is the wrong shape: *effort is nearly free relative to tier*,
so the cheap tier should run at high/max effort and the tier choice should carry the cost decision.
Also relevant to rule 2 ("turn count beats token price") — 5b's own finding is that the cheap lane
costs 70% less but takes ~50% more wall-clock/turns, which is rule 2 confirmed rather than refuted,
and gives it its first published number.

**Adoption candidate.** Rewrite `shared-model-routing.md` rule 8's default from "cheap stage = low
effort" to **cheap tier, high effort, latency-insensitive lane** — with the ~70%/70%/50% numbers,
the chart's provenance, and the contradicting anecdote all cited. This is the highest-confidence
edit in the sweep because it is the only one with a third-party measurement behind it.

---

## 5c — Daniel Mac (@daniel_mac8), "Max reasoning effort is off by default" — 31 Jul 2026

3,558 likes / 2,935 bookmarks / **1.096M views** — the highest-reach practitioner claim in the sweep.

> "Codex users: do this right *now*. Max reasoning effort is off by default. Luna at Max reasoning
> is ~ Sol Medium / Opus 5 Medium level at 1/6th the cost. Change your life today."

The reply tree splits. Supporting: @froydinger (*"24 hrs into an open world build… Virtually
identical results as Sol"*), @JasminPate10088, @mackody_. Contradicting: @IFITALEX's 20%/50%
measurement above; @thisispiyushK (*"although it performs similarly to glm in benchmarks, in real
life usage the difference is night and day"*); @editxshub asking the right question nobody answers
(*"Do we have proof the price is 1/6 also in the subscription and not just in the API?"*). The best
line is @coscosmico's: *"Default-off max reasoning is a quiet footgun. People benchmark the wrong
setting then blame the model."*

**Evidence quality.** **Practitioner-anecdote with a suspicious headline number.** 5b's chart puts
Luna-max at ≈51 and Sol-medium at ≈53.5 — close, but not equal, and the cost ratio there is ~$0.21
vs ~$0.32, i.e. **~1.5×, not 6×**. The "1/6th the cost" figure appears to be a per-token list-price
ratio, not a per-task one, and per-task is what a run pays. Do not repeat the 6× number.

**Delta vs orchestrate v1.8.0.** Reinforces the 5b candidate and adds one operational rule the
skill genuinely lacks: **effort defaults are host-specific and often not the maximum**, so an
un-set effort is as much a silent inheritance bug as an un-pinned model. Rule 1 says "Model
explicit on EVERY dispatch"; nothing says *effort* explicit on every dispatch, even though rule 8
lists the flags for four engines.

**Adoption candidate.** Extend `shared-model-routing.md` rule 1 to **model *and effort* explicit on
every dispatch** — an omitted effort silently takes the host default, which on Codex is medium and
on Kimi is high. One-line edit, zero controversy, immediately actionable.

---

## 6 — Daniel Mac (@daniel_mac8), "fable-advisor" — 4 Aug 2026

309 likes / 513 bookmarks / 41K views, video not transcribed. Companion repos
(`fable-advisor` / `sol-advisor`) are a sibling agent's beat.

> "'sol-advisor' reached 1,300+ GitHub stars in 4 days… 'fable-advisor' is for the Claude Code
> users. Uses the same pattern as 'sol-advisor': 1. Opus 5 as orchestrator 2. Fable 5 as high
> complexity implementer 3. GPT-5.6 Luna Max as routine implementer 4. Fable 5 as advisor"

Author's own justification, in a self-reply: *"If you're wondering why Opus is the orchestrator
over Fable, it's because Opus is better at long-horizon agentic tasks that require coherence."*

**Three replies carry more than the head tweet.**
1. **The in-process router vs the subprocess lane**, @HarshKamdar67: *"One thought on the
   codex-implementer lane. It shells out to the Codex CLI, so that lane is a subprocess handing
   back text. Airlock does it a level lower: a loopback router inside the Claude Code process, so
   gpt-5.6-luna runs as a native subagent with Claude Code's own tool loop and permissions."*
   This is a direct architectural comment on exactly what `strategy-xcli.md` does.
2. **The context-tax counterargument**, @dan_saffar — the most careful skeptical paragraph in the
   sweep, quoted in full because it belongs in the skill's honest-numbers material:
   *"Opus owning long-horizon orchestration makes sense because coherence across many steps and
   tool calls is exactly where weaker models drift, invent state, or drop constraints. What I doubt
   is the clean split that makes Fable the pure one-shot specialist. In real agent loops the hard
   implementation step still needs memory of prior failures and the same constraints the planner
   already holds. Every handoff to a second model costs a context tax, and that tax compounds. I
   have watched multi-model setups look clean in a diagram and then lose an hour to summary drift
   on a non-trivial codebase. For most work that actually ships, one strong model inside a tight
   plan-eval-act loop beats two specialists that keep re-explaining the world to each other.
   Specialization only wins when the handoff is almost free, and it rarely is."*
3. **A running fleet's operational surface**, @FCMJD: two Claude and two GPT subscriptions, four
   Macs, *"you can go 24/7 with about 15 to 20 agents"*, with — the transferable parts —
   *"You get a heartbeat every 15 minutes with vitals, like if it's slacking or whatever, which can
   quite often happen. You've got to put guardrails in to stop that, and it checks the RAM on each
   of the computers"*; three fixed daily **check-in sheets** (06:00 / 14:00 / 20:00) covering
   unanswered questions and links to staging/production; and three named throughput modes,
   *"Full speed ahead 15+ agents, purring which is 5 agents, budget when we're running out of
   tokens, which is my choice"*. Also a direct contradiction of the head tweet: *"When it
   occasionally flicks from Fable to Opus 5, it all goes tits up."*
   Another contradiction from @cmd_alt_ecs: *"Personally I think opus is worse for orchestration.
   Fable fanning out to (a team of) opus 5 And then adversarial review via codex plugin seems to be
   my best flow."*

**Evidence quality.** Head tweet: **practitioner-anecdote**, star count as social proof. Replies:
practitioner-anecdote, but the two contradicting reports on which model should orchestrate are
worth as much as the claim. dan_saffar's argument is **untested opinion, well-reasoned** — no
numbers, but it names a mechanism (summary drift across handoffs) that is testable.

**Delta vs orchestrate v1.8.0.**
- Advisor/executor split: **already covered** (`strategy-advisor.md`, and rule 7's published
  economics, "executor+advisor ≈ 92% of the strong model's quality at ~63% cost").
- Subprocess-vs-in-process worker: **partially covered**. `strategy-xcli.md` is entirely the
  subprocess shape, and `shared-model-routing.md` rule 12 already records which hosts can pin
  per-dispatch — but nothing names the *tradeoff* Harsh names: a shelled-out CLI worker loses the
  host's tool loop and permission model, so its output is text you must re-trust, not a subagent
  under your rails. That is a real argument for preferring a native subagent whenever the host has
  one.
- The context tax: **genuinely new as a stated counterweight**. The skill has rule 8 ("Do not
  orchestrate small coupled work") and the ~4×/~15× multipliers, which are about *whether to
  orchestrate*; nothing states that each additional *model boundary* inside a run costs a
  re-explanation and that specialization only pays when the handoff is near-free.
- Heartbeat/vitals + throughput modes: **partially covered**. `shared-monitoring.md` reads liveness
  from artifact deltas (better than a heartbeat), but the skill has no notion of a *fleet-level
  budget mode* the user can switch, and no periodic batched check-in — `shared-safety-rails.md`
  says "Batch questions… ONE question, not a drip" without giving it a cadence.

**Adoption candidate.** (a) A short **"the context tax"** paragraph in
`shared-model-routing.md`, quoting dan_saffar, as the counterweight to the tier table — the skill
currently reads as if more tiers is always better routing. (b) One line in `strategy-xcli.md`:
prefer a native in-host subagent over a shelled-out CLI when the host can pin the model, because
the subprocess lane forfeits the host's tool loop and permission enforcement. (c) Optional, lower
value: named budget modes in `run.md`'s resolved dimensions.

---

## 7 — Thariq (@trq212, Anthropic), "The new rules of context engineering for Claude 5 models" — 24 Jul 2026

**15,985 likes / 32,647 bookmarks / 4.5M views** — by reach and by authority the most important
source in the sweep. Head tweet: *"We removed ~80% of the Claude Code system prompt for our newest
models, this is what we've learned about writing system prompts, skills and Claude.MDs for them."*

**What it claims.** *"We removed over 80% of Claude Code's system prompt for models like Claude
Opus 5 and Claude Fable 5 with no measurable loss on our coding evaluations."* The cause is
over-constraint: *"when we read transcripts of our own internal usage of Claude Code, we see
several conflicting messages in a single request like 'leave documentation as appropriate,' or 'DO
NOT add comments' as our system prompt, skills, and user requests clash with each other."* Six
then/now reversals, each of which lands on this skill's own prompt templates:

1. **Then: give Claude rules. Now: let Claude use judgement.** The retired instruction is quoted:
   *"In code: default to writing no comments. Never write multi-paragraph docstrings or multi-line
   comment blocks — one short line max. Don't create planning, decision, or analysis documents
   unless the user asks for them…"*. Its replacement is one sentence: *"Write code that reads like
   the surrounding code: match its comment density, naming, and idiom."*
2. **Then: give Claude examples. Now: design interfaces.** *"With our newest models, we've found
   that giving examples actually constrains them to a certain exploration space."* Instead, make
   the tool's parameters expressive — a status enum of pending/in_progress/completed *"hints to
   Claude about how to use it"*.
3. **Then: put it all upfront. Now: use progressive disclosure.** Verification and code review
   moved out of the system prompt into skills; some tools are deferred-loading behind ToolSearch
   *"so they don't take up context until they're needed"*. Applied to skills: *"For long skills,
   try and use progressive disclosure as much as possible- divide it into many files and split them
   out."*
4. **Then: repeat yourself. Now: simple tool descriptions.** Instructions belong in the tool
   description, not duplicated in the system prompt.
5. **Then: memory in CLAUDE.md. Now: auto-memory.**
6. **Then: simple specs. Now: rich references.** *"A spec may also be a detailed test suite, or a
   function in a different codebase that Claude might port."* And on rubrics: *"Rubrics allow
   Claude to try and verify your taste in a particular field (e.g. what does a good API design look
   like) by using dynamic workflows and spinning up verifier agents with those rubrics."*
   Plus the file-format preference: *"Generally you should prefer files that are in code as it
   provides clear, high-fidelity instructions to Claude in a language it knows very well. For
   example, a HTML mockup of a design will generally produce better results than a description of
   the design or a screenshot."*
   On CLAUDE.md specifically: *"spend most of the tokens on gotchas inside of the codebase… Avoid
   stating 'the obvious' things Claude should know by looking at your file system or your repo."*
   On skills: *"Avoid making them overconstrained, except in highly important areas."*

**Evidence quality.** **The highest in the sweep** — first-party, from the team that ships the
harness, with an evaluated claim ("no measurable loss on our coding evaluations"). The eval itself
isn't published, and the guidance is Claude-specific by construction; it should not be assumed to
transfer to Codex/Grok/Kimi workers.

**Delta vs orchestrate v1.8.0.** This is the source with the most direct bearing on the skill's own
artifacts, and the news is mixed.
- **Progressive disclosure: already covered, and well.** The router-plus-references shape, "Never
  preload the entire reference library", and each reference's Read when/Skip when header are
  exactly rule 3. The skill is on the right side of this one.
- **Pointers over payloads: already covered** (`shared-token-economy.md`, "Pointers, not payloads").
- **Rubrics-as-references and spec-as-test-suite: partially covered.** `shared-review-gates.md`
  gives reviewers "the plan's Global Constraints VERBATIM" and panel lenses, but no reference tells
  a controller to hand a *rubric file* to a verifier, and `shared-token-economy.md`'s priming
  anatomy lists interfaces and constraint tables as inline-able but never names a test suite or a
  reference implementation as the spec itself.
- **"Let the model use judgement" vs the skill's prescriptive blocks: a genuine tension.** The
  WORKER communication block is ~300 tokens of behavioral constraint pasted verbatim into every
  dispatch, and `shared-token-economy.md` already sizes the blocks by role, which is the same
  instinct. But several reference files carry exactly the shape Anthropic just deleted: absolute
  prohibitions stated as never/always, and near-duplicate guidance in more than one file (the
  WORKER block's "read targeted" line, the orientation ritual, and the controller diet all say
  overlapping things about reading). Worth a deliberate audit rather than a reflexive trim: the
  skill's blocks earn their keep by *removing narration*, which is a different job from
  *constraining judgement*, and the measured savings (10–25% session-level) are already recorded.
- **"Examples constrain the exploration space": genuinely new and mildly uncomfortable.** Several
  prompt references lead with example-shaped literals (report line shapes, the `BLOCKED — what /
  evidence / …` grammar). Those are output *contracts* that downstream tooling parses, not
  behavioral examples, so the finding probably doesn't apply — but it deserves an explicit ruling
  rather than an assumption.

**Adoption candidate.** (a) A **`/doctor`-style audit pass** over the skill's own prompt references
looking for the two named defects: conflicting instructions across files, and rules that exist to
prevent a worst case the current model no longer hits. This is the highest-leverage internal task
in the sweep and it needs a design decision, not a one-line edit. (b) Add **rubric-as-reference**
and **test-suite-as-spec** to `shared-token-economy.md`'s priming anatomy item 4 and to
`prompt-verifier.md`'s inputs. (c) Record the "examples constrain" finding as a ruling: output
contracts stay, illustrative examples of *behavior* go.

---

## 8 — Rohit (@rohit4verse), "How to build a Full stack Agentic stack" — 22 Jul 2026

234 likes / 874 bookmarks / 302K views. An X Article; the longest and most systematic of the
"build the whole stack" pieces.

**What it claims.** Seven layers — interface, model router, context engine, tool layer, control
loop, memory, evaluation/observability — plus permissions and budgets. Extracts that bear on this
skill:

- **The five-part task contract**: outcome; the context the agent may use; the tools it may
  operate; the evidence required for completion; the actions that still require human approval.
  *"Without it, the model optimizes for producing a convincing response. With it, the system
  optimizes for producing a verifiable result."*
- **Verification matched to work type**: *"Frontend tasks need rendered screenshots, interaction
  checks, and visual comparison. Backend tasks need tests, logs, type checks, and repeatable
  commands. Research tasks need source trails and contradiction checks. Infrastructure work needs
  plans, diffs, health checks, and rollback paths."*
- **The four-section context pack**, rebuilt before important calls rather than accumulated:
  stable context / retrieved context / task state / evidence. *"That prevents the conversation
  history from becoming the only source of truth."*
- **Tool-failure vs task-failure**: *"The agent should be able to distinguish 'the test failed'
  from 'the tool failed to run.' Those are different problems and require different recovery
  paths."*
- **Escalation that carries state**: *"If the first model fails the same test twice, loses required
  context, or exceeds its task budget, route the complete task state to the next lane. Do not
  restart from an empty prompt. Carry the plan, relevant files, actions attempted, and failure
  evidence forward. That is model switching without losing the work."*
- **Machine-readable verification results**, four states: *"Pass. Fail with recoverable evidence.
  Blocked by missing information. Requires human judgment."*
- **Three memory kinds**: working (current plan/state), project (stable facts), outcome (*"which
  approach worked, what failed, how much it cost, and what reviewers changed"*). *"Only promote
  information into long-term memory when it will improve future decisions."*
- **Budgets at three levels** — per call, per task, per day — and *"When the agent reaches one, it
  should stop, summarize its state, and request a decision."*
- **The metric**: *"Tokens are an infrastructure metric. Accepted work is the product metric."*
  Optimize **cost per accepted task**, not cost per token.
- **Single-vendor risk**, opened with a dated incident: Fable 5 added to paid plans 9 June,
  suspended 12 June under a US export-control directive, *"The suspension lasted nineteen days"*,
  returning behind prepaid credits at $10/M in and $50/M out. *"If your workflow depends on a
  single model, the provider owns part of your architecture."* Recovery plan = four questions
  (which tasks continue, which model receives them, what capabilities are lost, how fast state
  transfers) and *"A backup that has never handled real traffic is a theory."*

**Evidence quality.** **Untested opinion, well-organized**, with two verifiable-looking external
anchors (the Frontend Code Arena Elo of 1,679 for Kimi K3; Artificial Analysis Intelligence Index
of 57 for K3) and a detailed pricing comparison. The pricing section is partly promotional in tone
toward K3, and the article visibly changes register mid-way (a stray "## 2. The arithmetic of
staying" heading suggests two pieces spliced) — **do not cite its price arithmetic without
re-deriving it**. The export-control suspension is stated with specific dates and would be easy to
verify; we did not verify it in this sweep.

**Delta vs orchestrate v1.8.0.**
- Task contract, verification-per-type, budgets, permissions: **largely already covered** —
  the priming anatomy's seven parts subsume the five-part contract, `shared-review-gates.md`'s
  /verify split covers evidence-by-type for user-facing work, `shared-safety-rails.md` covers
  budgets and approval.
- **Escalation carrying full state forward: partially covered and worth sharpening.**
  `shared-contracts.md` says "BLOCKED → ladder (context → stronger model → split task → human).
  Never re-dispatch unchanged" — correct, but silent on *what travels with the escalation*. This
  source's "carry the plan, relevant files, actions attempted, and failure evidence forward" is a
  concrete packet definition, and it pairs exactly with source 1's escalation-evidence format.
- **Four-state verification result: partially covered.** The skill's status enum
  (`DONE`/`DONE_WITH_CONCERNS`/`NEEDS_CONTEXT`/`BLOCKED`) is the worker's; the *verifier's* return
  is `works|broken` only. "Fail with recoverable evidence" vs "blocked by missing information" vs
  "requires human judgment" is a strictly richer verifier vocabulary and would let the controller
  branch without reading prose.
- **Tool-failure vs task-failure: genuinely new.** Nothing in the skill distinguishes them, and
  they have genuinely different recoveries (retry/repair the tool vs re-brief the worker).
- **Cost per accepted task: genuinely new as a metric.** `shared-token-economy.md`'s honest numbers
  are all token-side; there is no notion of dividing spend by *accepted* work.
- **Provider failover: not covered at all**, and arguably out of scope — `orchestrate` picks
  engines per role but has no fallback semantics if an engine disappears mid-run. Worth a line in
  `shared-model-routing.md` at most (the ABOM in source 1 has `"fallback": "kimi-k2.5"` for the
  same reason).

**Adoption candidate.** (a) Extend the **verifier return schema** in `shared-contracts.md` from
`works|broken` to the four states. (b) Define the **escalation packet** in `shared-contracts.md`'s
BLOCKED ladder: plan, files at their shas, actions attempted, failure evidence path. (c) Add
**tool-failure ≠ task-failure** to the BLOCKED grammar. (d) Optional: a fallback-engine field
alongside the pinned model.

---

## 9 — Argona (@Argona0x), "Eval Engineering: the step that turns a $200 model into a $200,000 system" — 28 Jul 2026

355 likes / 1,115 bookmarks / 338K views. The densest source in the sweep on the judge itself.

**What it claims.** Opens with a measured pair of numbers from an unnamed team's travel agent
across 100 real sessions: *"How good the answers were: 83.9%. How much of those answers was
grounded in what the tools actually returned: 32.3%."* — *"The agent wrote beautifully and told the
truth about a third of the time. Nobody caught it, because the writing was the only part anyone
ever looked at."*

Then a blind benchmark: two researchers took 100 production traces from a live voice agent, had a
human expert label every failure (39 labeled failures), hid the labels and ran every eval platform
against them. Reported results: *"Braintrust Loop: 87.2%… Codex on GPT-5.5 High: 84.6% recall,
82.8% precision. LangSmith: 79.5%. Arize AX: 74.4% recall, and the cleanest precision of the group
at 91.0%."* The conclusion the author draws: a general coding agent on a subscription you already
pay for beat two dedicated evaluation platforms, and within four weeks four eval vendors shipped
their expertise as skills installable into someone else's coding agent.

The mechanisms worth stealing:

- **The one-line thesis**, attributed to a founder whose post got two likes: *"A score that never
  changes behavior is analytics. An eval that changes the next edge is engineering."* With six
  wirings: `low context recall → reject the handoff` / `bad tool use → retry or swap the node` /
  `hallucination → quarantine the branch` / `schema failure → block the edge` / `compliance risk →
  route to human review` / `verified completion → terminate the run`.
- **Five rules for the judge**: (1) *"Judge from another family: a model recognizes its own writing
  and grades it kinder once it does… same family generates and grades, so the blind spots are
  shared."* (2) *"Write the rubric as one line: the working form is literally Pass iff [the
  independently observable successful outcome]. One primary verdict, never a bundle of proxy
  scores."* (3) *"Split the work by kind: the judge decides the semantic calls, plain code decides
  the objective ones."* (4) *"Never reward the shape of an answer: the rule written into the skill
  forbids scoring on response length, keywords, citation count, exact phrasing, tool-call count or
  similarity to a reference. Reward the shape and the agent learns the shape."* (5) *"Pin the judge
  and log its version: an examiner that silently upgrades makes every score before and after
  incomparable, and you will not notice for a month."*
- **Where test cases come from** — 25 complete traces, no more, chosen so good and bad sit side by
  side: a normal request that finished; a request the user confirmed; *"A request the user
  corrected or rephrased: the correction is the label, free of charge"*; a run with a failed, empty
  or repeated tool call; a run with an external failure. Each written up in four lines:
  `Observed behavior / Comparison / Attribution: agent behavior, dependency behavior, or unclear /
  Eval candidate`.
- **Three rules that stop the common failures**: *"Never treat the recorded answer as truth: the
  trace tells you what your agent did, never what it should have done"*; *"Test the test before you
  trust it: hand the verifier two fake results by hand, one clearly correct and one plausible but
  wrong. If either goes the wrong way, the rubric is broken, not the agent"*; watch for the
  environment giving away the answer.
- **Hiding the answer key**: *"The instruction and the environment are visible to the agent being
  tested. The expected outcome, the rubric and the judge's credentials are not, and that separation
  is the only reason the score means anything."*
- **The self-merge gate**, four signals combined into a confidence score: deterministic guardrail
  result; recent eval trajectory for this exact agent version; historical revert rate for this
  agent on this repo on this class of change; sandbox outcome. *"Three of those four are history
  and deterministic checks, and exactly one of them touches the model at all. Trust in an agent is
  an actuarial calculation."* Reported outcomes: *"19 of every 20 pull requests on the fully
  autonomous agent merge with no human involved"*, *"about three quarters of merged work goes in
  without a single human edit"*, *"Guardrails alone bounces one pull request in five before a
  person ever sees it."*
- **How to turn it on**: shadow mode first (*"the gate scores every pull request and merges none of
  them, for at least 4 hours of real traffic"*), a 2% deviation threshold between automated and
  human verdicts, trace sampling at 1–5%.
- **The counterweight, from a team that ran 285 iterations to 1,094 merged PRs with zero
  regressions**: *"38 green tests coexisted with a completely broken product. A suite can go all
  green while the product it guards falls apart, which is why the loop has to converge on the spec
  rather than on the score."*
- **The five first evals**: empty tool result; repeated call (*"the same lookup with the same
  arguments twice. That is a loop, and the eval fails it"*); boundary refusal; **handoff
  integrity** (*"what the previous node produced is what the next node reads, with nothing invented
  in between"*); **verified completion** (*"done means a real signal says done, never the agent's
  own word for it"*).
- **Suite economics**: hold out 300–800 cases, keep 500 running in under 5 minutes. *"A suite that
  takes longer than a coffee break stops being run."*
- Closing three lines: *"Measure the path the agent took, never only the answer it landed on. A
  verdict that does not change the next edge is a report. Any failure you do not turn into a
  permanent test, you will meet again."*

**Evidence quality.** **Mixed but the best-sourced of the aggregator pieces.** The blind benchmark,
the 83.9/32.3 pair, the 19-in-20 merge rate and the 285-iteration counterexample are all specific
and attributed-but-unnamed — none of the underlying sources is linked, so every number here is
**second-hand and unverified**. The install commands and folder layouts are checkable and look
real. The article has newsletter-growth CTAs at both ends. Treat the *mechanisms* as high-value and
every *number* as needing a primary source before it's quoted anywhere binding.

**Delta vs orchestrate v1.8.0.**
- **Judge from another family: partially covered, and the skill's version is weaker.**
  `shared-review-gates.md` offers lineage decorrelation as a panel *option* ("Lenses may also
  decorrelate… by ENGINE LINEAGE"), and `shared-model-routing.md` rule 6 requires a different
  *instance*. Neither states the mechanism — a model grades its own family's writing more kindly —
  nor makes cross-family the default for a judge.
- **Pin and log the judge's version: genuinely new.** Rule 1 pins the model on dispatch for *cost*
  reasons; nothing says a *reviewer* model change makes scores across a run incomparable. For a
  multi-round review loop this is a real defect: rounds 1 and 3 judged by different reviewer models
  are not comparable, and the skill's re-review loop does not record which model judged.
- **Never reward the shape of an answer: genuinely new** and directly applicable — the skill's
  reviewer prompts do not forbid scoring on length/keywords/similarity-to-reference.
- **Split semantic vs objective checks: already covered**, and well — that is exactly the /verify
  split (subjective fresh verifier first, objective codified checks second).
- **Hide the rubric from the agent under test: genuinely new.** The skill hands the implementer its
  own verification command in the brief (priming anatomy item 5), which is deliberate and probably
  right for implementation work, but for a *verification* task it means the target can see its
  answer key.
- **Test the test (two fake results): genuinely new** and cheap — a one-line addition to
  `prompt-verifier.md` would materially raise gate trust.
- **The failing-trace-becomes-a-permanent-test loop: genuinely new** (with source 2 and source 1's
  `harvest`/evalsmith agreeing). The skill's `progress.md` records that a defect was found and
  fixed; nothing converts it into a check that runs next time.
- **The actuarial merge gate: genuinely new**, and the most interesting long-horizon idea in the
  sweep — it is the mechanism that would let `strategy-loop.md`'s "Autonomy is EARNED per
  work-class" become a *computed* threshold rather than a human judgement call. Note the skill
  already holds the safety half of this (open-PR cap 1) and would need the evidence half.
- **Shadow mode before enforcement: genuinely new** and pairs with source 1's C0 tier.

**Adoption candidate.** The richest source in the sweep for concrete edits:
(a) **Judge hygiene** block in `shared-review-gates.md` — cross-family default, pin-and-log the
judge version per round, forbid shape-rewarding, one-line rubrics.
(b) **"Test the test"** in `prompt-verifier.md` — two hand-made results, one right and one
plausibly wrong, before the verifier's verdict is trusted.
(c) **Failure-to-durable-check** rule in `shared-contracts.md`'s ledger section: a Critical/
Important finding closes only when it is expressed as a check that would catch it again.
(d) Longer-term: **evidence-based autonomy thresholds** in `shared-safety-rails.md`, with shadow
mode as the required first phase.

---

## 10 — Mike Fishbein (@mfishbein), "This is my personal software factory" — 25 Jul 2026

2,770 likes / 5,550 bookmarks / 177K views. A full nine-step pipeline written out in the tweet
body, plus a diagram.

**What it claims.** A `/factory` skill acts as foreman — *"the foreman that remembers where the
project stands and sends in the right worker for the job"* — over nine stations:
`/factory-plan` as interviewer (extracts missing context by interview, writes a product brief) and
then as planner; `/factory-tests` as "the professor", which is the ordering that matters —
*"Before anyone writes code, every task gets an exam. This skill defines the success criteria for
each task, and how the coding agent can prove to itself that what it built works or needs
iteration"*; `/factory-explain` as presenter, justified by a bottleneck claim worth quoting —
*"Now that coding agents can write more code, faster than any human ever could, the new bottleneck
is human understanding of the code"*; `/factory-handoff` packaging *"the brief, plan, tests, safety
rails, and stop conditions into one work order"* and explicitly switching tiers at the handoff —
*"Factory uses the best models for the planning in the previous steps above, then hands the work
order to a lower token usage model like Grok 4.5 for execution"*; an overnight `/loop` with
*"circuit breakers stop it from confidently digging a deeper hole while I sleep"*;
`/factory-review` where *"The student doesn't grade it's own homework. A fresh agent that never met
the builder tries to break the result"*; `/auto-loom-proof`, which screen-records the agent
performing its own tests with a voiceover and sends a narrated demo video; and a plain-language
owner's manual so *"I understand my own codebase, so I can make decisions without becoming the
bottleneck or outsourcing my thinking to AI."*

**The diagram, transcribed.** Titled "MIKE'S SOFTWARE FACTORY (/factory = the foreman — reads
STATE.md and always knows which step you're on)". Boxes and their artifacts:
1 THE INTERVIEW (factory-plan) "one question at a time, a recommendation each" → `factory/BRIEF.md`;
2 THE BLUEPRINT (factory-plan) "small tasks in order, each one visible & testable" →
`factory/PLAN.md`; 3 THE EXAM SHEET (factory-tests) "every task gets a proof: 'run this, you'll see
that'" → criteria + contract inside PLAN.md; an optional stop where factory-explain "draws you the
plan as a picture before it costs a night"; 4 THE WORK ORDER (factory-handoff) "you read it + sign
it; night crew asks questions BEFORE you go to bed" → `factory/HANDOFF.md`; 5 THE NIGHT SHIFT
(overnight loop) "Cursor loop, nobody watching: build → test → write diary → repeat; diary:
progress.md + log.md"; 6 THE INSPECTOR (factory-review) "fresh eyes, never met the builders, tries
to BREAK it" → `factory/REVIEW.md`; 7 THE TOUR VIDEO (auto-loom-proof) "watch the app pass its own
exam (MP4)"; 8 OWNER'S MANUAL (factory-explain) "how it all works, like you're 10" →
`factory/GUIDE.md`.

The closing note is the honest one: *"getting AI to work reliably and at scale for you can't be
fully automated. LLM-as-judge helps, but a judge needs a rubric, examples, and input from someone
with subject matter expertise. You still need a human reviewing the work and teaching the system
how to perform better."*

**Evidence quality.** **Practitioner-anecdote with a public repo** (linked from a follow-up post,
not read in this sweep). No numbers, no cost figures, no failure rates. But it is a real personal
system described concretely enough to copy, and it is the closest external analogue to
`orchestrate`'s own shape.

**Delta vs orchestrate v1.8.0.** Mostly **already covered**, which is itself a useful finding — the
skill's staged strategy plus workspace contract is this factory:
`.orchestrate/run.md` ≈ STATE.md, `task-N-brief.md` ≈ HANDOFF.md, `progress.md` ≈ the diary,
`prompt-spec-reviewer`/`quality-reviewer` ≈ the inspector, `strategy-loop.md` ≈ the night shift with
its regression breaker as the circuit breaker. Three things are not:
- **The exam before the build.** `/factory-tests` writes the success criteria *as its own station*,
  after planning and before handoff. In `orchestrate` the verification command is item 5 of the
  brief, authored by whoever writes the brief — there is no independent step, and no separate agent,
  whose only job is defining how each task proves itself. @JamesDowell2 under 5a independently
  describes the same ordering (*"QA eval is made by sol after plan approval but before luna
  begins"*), which makes it two sources.
- **The explain station.** The claim that *"the new bottleneck is human understanding of the
  code"* is not something the skill addresses at all; its handoff artifacts are written for the
  next *controller*, never for the human owner. Plausible but unevidenced.
- **Narrated video evidence.** `shared-review-gates.md` already requires screenshot + video
  evidence for user-facing changes; the voiceover is decoration.

**Adoption candidate.** A **"criteria before code"** note in `strategy-staged.md` and
`shared-review-gates.md`: for multi-task plans, author each task's acceptance check as its own
step after plan approval and before the first dispatch — ideally by a different agent than the one
that will implement. Two independent sources, cheap to adopt, and it closes the gap where a brief's
verification line is written by the same reasoning that wrote the task. Reject the explain/video
stations as out of scope.

---

## 12 — Anatoli Kopadze (@AnatoliKopadze), "Graph Engineering explained" — 24 Jul 2026

1,622 likes / **6,957 bookmarks** / 4.37M views — the highest-reach of the three graph explainers
and by some distance the best of them.

**What it claims.**
- Provenance, stated honestly: *"A month ago the whole field was talking about loops. Then Peter
  Steinberger posted the line above, and a corner of the internet that had just finished learning
  loops declared them old news overnight… And engineers pushed back on the hype within hours,
  pointing out this is a decades-old idea wearing a new name. They are right, and that is the good
  news."*
- **The node contract**: *"A node whose output is a wall of free text is a node only a human can
  read. A node with a fixed output shape is one the next node can consume without guessing"* —
  written out as JOB (one job, nothing else) / IN (passed in, never assumed) / OUT (typed) /
  SCHEMA (*"enforced. if the agent returns free text, it's rejected and retried"*).
- **The fake-edge test**: *"At each step, ask one thing: does this step actually need the result of
  the one before it? If yes, the edge is real… If no, there is no edge, and the wait is wasted."*
  With the arithmetic: *"A linear workflow with 40 steps has 40 points of sequential failure and
  the latency of all 40 added together. The same 40 jobs drawn as a graph have only as many real
  dependencies as actually exist, usually three to five, and finish at the speed of your slowest
  layer."* And: *"The model was never the bottleneck. The line you drew was."*
- **The diamond** — *"fan out, reduce, synthesize"* — with the reduce step done in **plain code, no
  model, no tokens** (`dedupeBySource`), cheap models on the fan-out nodes and the strong model on
  the judgment and synthesis nodes, and `freshContext: true` on every verifier.
- **The checker rule, stated as sharply as anywhere in the corpus**: *"you never let the agent that
  did the work check the work… Here is the catch nobody names: that checker needs a clean context.
  Give it the same chat the worker had and it is not checking anything, it is nodding along to
  itself in a different font. A graph of agents sharing one context is just a single loop in a
  costume, and it breaks the same way, only later and pricier."* Verifier node spec: input is the
  finding only, never the worker's chat; three skeptics in parallel with different questions (is it
  correct / is it current / is the source real); keep on majority.
- **Three named failure modes with fixes**: (1) *context collapse* — fan out 1,000 nodes and pour
  all outputs into one synthesis step; fix is layered fan-in (batch 40, summarize each batch,
  combine ~25 summaries). (2) *false independence* — *"Two nodes look independent because their
  prompts never mention each other, but they both write to the same file or hit the same
  rate-limited API. That is a hidden edge."* With a cited incident: *"When Bun's team first fanned a
  big job across many agents, they shared one workspace and overwrote each other."* Fix: a worktree
  per worker; *"any two nodes writing the same file need an edge, not parallelism"*. (3) *silent
  node failure* — *"In a chain, one failure stops everything, annoying but obvious. In a graph, one
  dead node among two hundred can slip into a report that looks complete."* Fix: every merge step
  counts its inputs against the number expected and flags the gap — *"never synthesize on a partial
  set and call the report complete"*.
- **When not to graph**: small/isolated tasks, work where you want to approve every step,
  exploratory work where you don't know what you're looking for, genuinely sequential steps.
  *"The tell is the fake-edge test. If you cannot find two jobs with no edge between them, there is
  no graph to build. It is a loop, and a loop is fine."*
- **Anchors — the best paragraph in the sweep on why topology isn't truth**: *"Every node watches
  another node, and every one of them reads a report. The audit checks the numbers against the
  finance numbers, which came from the same system in the first place. Everything is consistent.
  Nothing is verified. This graph fails exactly like the single loop did, just later, more
  expensively, and with far more green lights on the way down. Topology alone does not buy truth.
  The graph needs anchors: nodes that cannot be argued with. Tests that actually ran, not 'should
  pass,' did pass. Revenue that landed in the bank. Customers who actually stayed. And some rules
  must be frozen, the ones an optimizer would be tempted to weaken, kept off-limits precisely
  because they are the ones it would bend to win."*
- **Cost honesty**: *"A graph costs more than a normal chat. A lot more. The coordination is what
  gets cheaper, not the work itself."* With the public example: the Bun runtime rewrite, *"around
  535,000 lines of one language into over a million lines of another in about eleven days"*, *"about
  50 workflows, with up to 64 agents going at once"*, *"roughly $165,000 in usage"*, and the caveat
  that it *"got real criticism over whether that much AI-written code can even be reviewed safely."*
- Nine copy-paste GRAPH SPEC blocks (research desk, SEO content, GTM kit, refactor sweep, discovery
  loop) all sharing a shape: GOAL / FAN OUT / VERIFY / MERGE / CAP / REPORT / HUMAN GATE.

**Evidence quality.** **Practitioner explainer with two checkable external anchors** (the Bun
rewrite numbers; the Bun-team shared-workspace incident) and unusually good epistemic hygiene — it
concedes the idea is decades old, names the hype, and prices the failure honestly. The code blocks
are illustrative pseudo-TypeScript against an unnamed `agent()`/`parallel()` API, not runnable. No
first-party measurements.

**Delta vs orchestrate v1.8.0.**
- Fan-out/verify-fresh/synthesize, worktree isolation, cheap-vs-strong per node, caps, human gates:
  **already covered** across `strategy-parallel.md`, `strategy-workflow.md`, `shared-isolation.md`,
  `shared-review-gates.md`. The skill's versions are generally more precise.
- **Reduce in plain code between model stages: partially covered.** `strategy-loop.md`'s evolve
  pass has "lift repeated DETERMINISTIC work into a script pre-stage (never qualitative calls)",
  which is the same principle but scoped to loops. `strategy-workflow.md` has `pipeline()` and
  script-held plans but never says *the merge step itself should be code, not an agent*.
- **Layered fan-in against context collapse: genuinely new.** Nothing in `strategy-parallel.md` or
  `strategy-workflow.md` addresses what happens when N worker reports exceed the synthesizer's
  context — the skill's answer is implicit (reports are files, chat returns are capped), but there
  is no batch-summarize-then-combine rule.
- **Fan-in count guard against silent node death: genuinely new**, and the skill is exposed here.
  `shared-monitoring.md` rule 3 says "Silence is not success: no report + no artifact = failed" —
  correct for one agent, but there is no *aggregate* rule that the merge step compares returned
  count against dispatched count and refuses to synthesize on a partial set. Given
  `shared-contracts.md`'s own "reconcile the ledger against the artifacts actually on disk", this
  is a small, well-aligned addition.
- **False independence via shared resources: already covered and better** —
  `shared-safety-rails.md`'s single-flight ownership rule is the same insight with a harder-won
  field note attached.
- **The fake-edge test: partially covered.** `prompt-triage-assessor.md` asks "do tasks' file lists
  overlap?" which is the *isolation* half; the *dependency* half ("does this step actually need the
  previous step's output") is not stated as a test anywhere, and it is the cheaper of the two to
  apply.
- **Anchors: genuinely new, and the most important conceptual gap this sweep found.** The skill has
  reward-hacking prohibitions (`shared-safety-rails.md`) and evidence requirements
  (`shared-review-gates.md`), but nothing states that a review topology made entirely of agents
  reading each other's reports can be fully consistent and entirely unverified. Every gate in
  `orchestrate` that isn't backed by a command that ran is exposed to precisely this.

**Adoption candidate.** (a) An **anchors** paragraph in `shared-review-gates.md`: every gate names
at least one fact no agent produced (a command that ran, a file that exists, an external readback),
and some constraints are frozen against optimization. (b) A **fan-in guard** line in
`strategy-parallel.md` and `strategy-workflow.md`: count returns against dispatches, flag the gap,
never synthesize silently on a partial set. (c) **Layered fan-in** for wide runs. (d) The
**fake-edge test** as a one-line partition heuristic in `triage.md`/`strategy-parallel.md`.

---

## 13 — Ruiteng Huang (@huangruiteng), "LoopX: 200+ hours of continuous agent execution" — 3 Aug 2026

138 likes / 263 bookmarks / 31K views. Written in Chinese; quotations below are the original with a
translation, since the terminology is load-bearing. Repo: `github.com/huangruiteng/loopx`.

**What it claims.** Two real trajectories have run continuously for **220.7 and 272.9 hours**
across waits, human feedback, writebacks, model switches and resumes. The thesis:
*"模型上下文有限，长程 Agent 需要外置结构化状态"* — model context is finite, so a long-horizon agent
needs externalized structured state; each model call completes one **bounded Turn** and the control
plane organizes those bounded calls into a system that can advance, verify, wait and recover.

- **The five control questions a long context cannot answer**: which system owns the current fact;
  which agent has authority to advance which part; did this tool call produce an acceptable result;
  should we continue, wait, ask, replan or finish; and after an interruption, where does the next
  round resume.
- **Relationship to a native goal primitive**, compressed to two lines:
  `Native Goal = objective + goal lifecycle + completion audit` versus
  `LoopX State = goal boundary + work graph + authority + evidence + cadence + recovery`.
- **Six layers with one owner each**: External Truth (GitHub decides whether a PR is merged, CI
  decides whether checks passed) / Domain State / Capability Pack (translates observations into a
  *finite set of typed proposals* — `checks_failed -> runnable_successor`, `merged ->
  terminal_candidate`, `negative_evidence -> retirement_candidate`) / State Kernel (owns goal,
  todo, claim, gate, quota, evidence lineage, handoff) / Host-Runtime (*"Runtime 是暂时的 worker，
  每次只拿到一个 bounded action"* — the runtime is a temporary worker that receives one bounded
  action at a time) / Projection (status, kanban, reports are a **read model**, rebuilt from source
  state, never a second source of truth).
- **The four invariants**, which are the most quotable thing in the piece:
  `observation != transition` · `proposal != authority` · `tool success != accepted progress` ·
  `accepted progress = validation + durable writeback + committed readback`.
  Expanded: *"命令返回 0 只能证明进程成功退出"* — an exit code of 0 only proves the process exited.
- **Quota semantics**: *"Quota slot 代表一次有效推进，不代表一次模型调用"* — a quota slot represents
  one *effective advance*, not one model call. Read-only status, scheduler ACKs, monitors that saw
  no change, and quiet no-ops all cost nothing.
- **Stateful backoff for waiting**: a `continuous_monitor` carries target identity, next due time,
  last result fingerprint, consecutive no-change count and successor rules; a due poll has exactly
  three outcomes (external fact changed → write evidence and create a successor/gate/terminal
  candidate; unchanged → update hash, counter and next due time, quiet no-op; observation
  inconclusive → record a blocker, *"不伪造进展"* / never fake progress). Backoff identity is
  `goal + agent + lifecycle reason + monitor target`, escalating 15 → 30 → 60 minutes and resetting
  when the todo, gate, evidence or target changes. *"未到期的 monitor 不调用强模型"* — a monitor that
  isn't due doesn't invoke a strong model.
- **Handoff carries frontier, not transcript**: *"它传递的是可恢复 frontier 与 lineage，而不是复制
  完整 transcript"* — a new peer must reconstruct an equivalent objective, authority boundary,
  validation surface, next action and stop condition, *"它不需要逐字复现旧 session 的推理过程"* (it
  does not need to reproduce the old session's reasoning verbatim). Recovery is
  `next decision = replay(committed project state) + inspect(fresh environment)`.
- **Replan is a state transition, not a reflection**: triggers are structural (succession gap;
  acceptance gap; long todo chain past a bounded review threshold; monitor no-change streak;
  exhausted monitor frontier; periodic review/no-progress; external direction change). A valid
  replan must produce at least one machine-visible delta — split a todo, add a successor, retire a
  falsified branch, convert waiting work into a monitor with a resume condition, create a user gate,
  patch the vision. *"只记录'已 replan'不会清除 obligation"* — recording that you replanned does not
  discharge the obligation; a result with no successor, resume condition, next action, gate or
  vision patch is flagged `replan_noop`.
- **Replan has a precedence order** so that new information can't preempt live work: existing
  scoped obligation / blocking handoff gate → ready deferred successor / blocking user work →
  succession or acceptance gap → bounded long-chain review → stalled monitor / exhausted watch
  frontier.
- **Delivery scale ≠ delivery outcome**: *"一个 multi-file diff 可能仍是 surface_only，一个很小但
  解开关键 blocker 的 transition 反而是 outcome_progress"* — a multi-file diff can still be
  surface-only while a tiny transition that unblocks something is real progress. An **Outcome
  Floor** detects consecutive surface-only or no-progress rounds and forces either a primary result
  next round or entry into self-repair.
- **Self-repair vs replan vs dreaming, each owning one layer**: self-repair handles stalls caused
  by the *control plane itself* (a projection missing a field, claim/lease drift, a wrong workspace
  route, a host effect with no receipt, a scheduler repeating an ineffective cadence), and
  critically *"Repair 不通过降低 gate、猜测缺失状态或把 no-progress 改名为 success 来恢复"* — repair
  never recovers by lowering a gate, guessing at missing state, or renaming no-progress as success.
- **Terminal is an acceptance decision**: *"open todo count == 0 只说明当前列表暂时为空"* — an empty
  todo list only means the list is empty; closure additionally checks user gates, active monitors,
  successors/handoffs, replan obligations, acceptance gaps, retryable projection postconditions and
  evidence-backed no-followups.
- **Seven layered quality gates**, near to far: unit/contract → focused deterministic smoke →
  public-safe decision replay → risk-based canary by git diff → actual-default model qualification
  → exact-commit release qualification → matched outcome baseline. With the rule that an
  independent semantic oracle must state the correct decision from source facts first —
  *"不能从当前程序输出反推'期望值'"* (you cannot derive the expected value from the current program's
  output).
- Closing: *"模型决定单步上限，控制面决定长期协作下限"* — the model sets the ceiling on a single
  step; the control plane sets the floor on long-term collaboration.

**Evidence quality.** **Working code with the only duration numbers in the sweep** (220.7 / 272.9
hours, with the trajectories linked in the repo), plus a linked eight-part architecture course.
Single-author open-source project, low engagement, self-reported metrics — the hours are
plausible-but-unverified and the architecture is elaborate enough that adoption cost is real. The
conceptual content stands on its own regardless.

**Delta vs orchestrate v1.8.0.**
- Externalized durable state, ledger-over-memory, handoff without transcript: **already covered** —
  `shared-contracts.md` ("Reports are claims; the disk is the record") and `shared-handoff.md` hold
  the same position. LoopX is the same instinct scaled to ten-day runs.
- **The four invariants: genuinely new as *stated rules*, and the skill half-holds each of them.**
  "tool success != accepted progress" is the strongest: `shared-monitoring.md` says silence isn't
  success, but nothing says a *zero exit code* isn't success, and every strategy's gates would
  benefit from `accepted progress = validation + durable writeback + committed readback`.
- **Committed readback after writeback: genuinely new.** The skill's ledger reconciliation happens
  "after any fan-out completes"; LoopX makes readback part of every single transaction.
- **Stateful backoff with a no-change fingerprint: genuinely new.** `shared-monitoring.md` says
  "schedule a LONG fallback, never a short poll", which is the same instinct with none of the
  machinery — no fingerprint, no no-change counter, no escalating interval, and no rule that an
  undue monitor must not wake a strong model.
- **`replan_noop`: genuinely new** and immediately applicable to `strategy-loop.md`, whose evolve
  pass explicitly allows a no-op ("no-op valid and common") without requiring the *replan* case to
  produce a delta. Those are different things and the distinction is worth importing.
- **Delivery scale vs outcome, and the Outcome Floor: genuinely new.**
  `shared-monitoring.md` rule 4 comes closest ("activity ≠ progress") but routes to repartition; it
  has no notion of consecutive surface-only rounds forcing a primary result.
- **Terminal-as-acceptance: partially covered.** SKILL.md's completion section already lists five
  conditions; LoopX adds the ones the skill misses — outstanding monitors, unresolved replan
  obligations, and evidence-backed "no follow-up needed" as an explicit closure category.
- **Self-repair must not lower the gate: genuinely new** and belongs in `shared-safety-rails.md`
  next to the reward-hacking prohibition, which currently covers the *worker* weakening tests but
  not the *controller* weakening its own gates to make a stalled run finish.

**Adoption candidate.** (a) The **four invariants** as a boxed set in `shared-contracts.md` — the
single densest import available from this sweep, and they read as if written for this skill.
(b) **Stateful backoff + no-change fingerprint** in `shared-monitoring.md` for any run that waits on
external systems (CI, review, long external CLIs). (c) **`replan_noop`** and the **Outcome Floor**
in `strategy-loop.md`. (d) "**Repair never lowers the gate**" in `shared-safety-rails.md`.

---

## 14 — The AI Edge (@aiedge_), "Claude Graph Engineering 101" — 5 Aug 2026

134 likes / 411 bookmarks / 72K views. A beginner explainer covering the same ground as source 12,
more thinly.

**What it claims.** A four-era progression (*"2023 → prompt engineering / 2025 → context
engineering / June 2026 → loop engineering / July 2026 → graph engineering"*); loops fail because
*"Loops can't run things in parallel, and this is the biggest limitation"*; the canonical shape is
planner → worker → three parallel reviewers (security / logic / style) → synthesizer → gate that
routes failures back. A four-step adoption process: audit your loops for bottlenecks, find what can
run in parallel (*"Does this depend on another step's output?"*), physically draw the graph
(Excalidraw MCP suggested), then paste a screenshot of the drawing to Claude with a GRAPH PROMPT.
The prompt template's one genuinely useful line: *"Gate: if the review fails, route feedback back
to the specific node that caused it. Do not re-run the whole graph."*

Two honest notes at the end: *"Graphs are faster, not always cheaper"* and *"Not everything needs a
graph: /loop in Claude is still a very helpful command… Graphs are best when you value time and
speed > cost."* Plus the deflation that matters: *"To be clear, the mechanism used here is
subagents. A graph is just what you get when you give those subagents defined roles, dispatch them
in parallel, and write a rule for where failures go."*

It also records a provenance detail worth keeping: *"Within days, there were competing definitions,
a wave of copycat posts, and even a fabricated study claiming a Stanford grant that never existed."*

**Evidence quality.** **Untested opinion / explainer**, with a newsletter CTA. No numbers, no
first-hand runs, illustrative diagrams described but not shown. Its value is as corroboration that
the vocabulary has settled, plus one warning that the topic has attracted a fabricated citation.

**Delta vs orchestrate v1.8.0.** **Already covered** in full. Planner → parallel lensed reviewers →
synthesizer → gate *is* `strategy-parallel.md` + `review=panel:N`, and the skill's version is more
rigorous (severity+confidence, dedup rules, no self-filtering). The one line worth extracting —
route the failure back to the node that caused it, don't re-run the graph — is already the skill's
findings loop ("Critical/Important → fix subagent → RE-REVIEW"), scoped to the failing task.
The `--planner-drawing` input idea (draw it, screenshot it, hand it over) is mildly interesting
against source 7's "prefer files that are in code… a HTML mockup will generally produce better
results than a description", but that argues *against* screenshots, not for them.

**Adoption candidate.** **Reject.** No new mechanism; use only as evidence that "graph" is now the
user-facing word for the skill's parallel/workflow strategies, which may justify a vocabulary note
in `triage.md` so a user saying "run this as a graph" routes correctly. Also worth carrying forward
as a caution: this topic has already produced at least one fabricated study, so any
graph-engineering citation needs a primary source.

---

## 15 — Ruuj (@RuujSs), "How to Use Graph Engineering to Build an Alpha Orchestration Layer" — 4 Aug 2026

38 likes / 104 bookmarks / 66K views. A quantitative-finance application of the graph vocabulary —
the domain is out of scope, but two of its ideas are not.

**What it claims.** The failure it addresses is five individually good strategies losing money
together *"Because nothing sat between the strategies and the portfolio deciding how they should
actually combine."* The graph framing is used for a specific reason: *"A graph fixes this by
design, not by discipline… A node declaring reads=["neutralized_signals", "risk_budget"] physically
cannot reach into the live position book and corrupt it, because the architecture never gave it a
way to. This is the actual reason to choose this over one monolithic system. When something breaks,
the blast radius is exactly the set of nodes downstream of that failure. Nothing more."*

The two transferable ideas:

1. **Constraints inside the solve, not after it.** *"That naive design averages the neutralized
   signals into one score, then hands the result to a separate risk check that vetoes or trims
   whatever violates a limit. The failure is baked into the order itself. A violation gets proposed
   first and rejected second, and the system spends its entire cycle generating positions it
   already knew, structurally, it could never hold."* The fix is to make the constraint part of the
   objective so an infeasible answer is never proposed.
2. **Snapshot isolation for shared state** — the article's own "harder half":
   *"It's not a node reading stale data. It's two nodes reading different versions of the truth
   during the same decision cycle, each one confident it's correct… Both numbers are individually
   correct. Combined, they describe a portfolio that was never actually coherent at any single
   instant, and nothing in the system throws an error to tell you that happened."* Fix: *"At the
   start of every decision cycle, take one frozen snapshot of state, and every node in that cycle
   reads exclusively from it, never from the live, mutating store."* And the generalization:
   *"This is fundamentally a distributed systems correctness problem… not a finance problem dressed
   up in finance vocabulary."*

Also worth noting for completeness: signal nodes must emit score **plus confidence plus sample
size**, because *"A downstream node handed only a direction has nothing left to weight
intelligently"* — a young strategy gets shrunk toward zero until it earns a track record. That is
the same actuarial instinct as source 9's merge gate, arrived at independently in a different field.

**Evidence quality.** **Working-code-shaped but untested here** — the Python is illustrative,
runnable-looking, and the finance claims (Millennium's reported 5%/7.5% drawdown triggers, netting
risk) are hedged with "reportedly". No backtests, no numbers from a running system. The
distributed-systems argument stands on its own merits regardless of the domain.

**Delta vs orchestrate v1.8.0.**
- Declared reads/writes per node: **already covered, and this is a nice independent validation** —
  `shared-token-economy.md`'s `read: <path> — <why>` / `write: <path> — <what>` pointers with
  `scripts/brief-check` failing two briefs that claim the same `write:` path is exactly this
  mechanism, enforced by a script rather than by a class.
- **Snapshot isolation: partially covered, and the gap is real.** The skill pins pointers with
  `@ <sha>` *"whenever more than one writer is active or the run uses worktrees — a branch name is
  not a pin"*, which is snapshot isolation for *files*. What it does not do is pin **one snapshot
  for the whole fan-out**: nothing says every worker in a batch reads the same repository revision,
  and nothing covers non-file shared state (`decisions.md`, the plan, the inventory) changing
  mid-batch. Source 15's failure — two workers each correct against a different version of the
  truth, with no error raised — is a live risk in any parallel run where the controller edits
  `decisions.md` while workers are running.
- **Constraint-inside-the-solve: partially covered** by the plan-veto gate (rejecting a plan is
  cheaper than rejecting code), but stated differently. The skill's version rejects *after*
  proposal; this source's point is that a constraint expressed in the brief prevents the proposal.
  In practice that means the brief's negative constraints do this job — which
  `shared-token-economy.md` already requires. Fair to call **already covered**.
- Confidence + sample size on an output: **genuinely new in a small way.** Reviewer findings already
  carry "severity + confidence" (`shared-review-gates.md`), but worker reports carry neither, and
  nothing weights a *new* worker's or engine's claims differently from a proven one's.

**Adoption candidate.** One edit: **one revision snapshot per fan-out batch** in
`shared-token-economy.md`'s pointer rules and `strategy-parallel.md` — all workers in a batch pin
the same `@ <sha>` and the same decisions-file revision, and a mid-batch change to shared state is a
re-dispatch decision, not a silent update. Everything else is domain-specific or already held.

---

## Adoption candidates — ranked

Ranked by (evidence quality × gap size × cost to adopt). Each names the exact file it would touch.

1. **Model *and effort* explicit on every dispatch** — `shared-model-routing.md` rule 1.
   Sources 5c, 4. One line; the effort default is off-max on Codex and varies by host, so an unset
   effort is the same class of silent inheritance bug rule 1 already forbids for models.
2. **Rewrite rule 8's effort default: cheap tier at high/max effort, as a latency-insensitive
   lane** — `shared-model-routing.md`. Sources 5b (third-party Pareto chart), 4 (every stage at
   max), 5c. The only candidate in the sweep with a third-party measurement behind it. Carry the
   contradicting anecdotes and drop the "1/6th the cost" headline — 5b's own chart says ~1.5×
   per task, not 6×.
3. **The four LoopX invariants** — `shared-contracts.md`. Source 13.
   `observation != transition` · `proposal != authority` · `tool success != accepted progress` ·
   `accepted progress = validation + durable writeback + committed readback`. Dense, verbatim,
   and the third clause closes a real hole: the skill treats a clean exit as evidence in several
   places.
4. **Judge hygiene** — `shared-review-gates.md`. Source 9, with 12 corroborating.
   Cross-family judge as the default (not a panel option), pin and log the judge model per review
   round, forbid rewarding answer shape (length, keywords, citation count, similarity to a
   reference), one-line rubrics of the form `Pass iff [independently observable outcome]`.
5. **Anchors: every gate names at least one fact no agent produced** — `shared-review-gates.md`.
   Source 12. *"Everything is consistent. Nothing is verified."* The skill's gates are
   agent-on-agent by construction; this is the rule that keeps a review topology honest, and it
   pairs with candidate 3's third clause.
6. **Trajectory escalation** — `shared-monitoring.md` + `shared-model-routing.md` rule 4.
   Sources 1 (five countable detectors, evidence-not-transcript packet), 5a (three failed QA
   verdicts → the strong model takes over), 8 (escalation carries plan + files + attempts +
   evidence). Today the skill only escalates on a `BLOCKED` status, so a confidently mediocre
   cheap worker is invisible to the router.
7. **Failure becomes a durable check** — `shared-contracts.md` ledger section.
   Sources 9, 1, 2, 10 (four independent sources). A Critical/Important finding closes only when
   it is expressed as something that would catch it again. Grep confirms the skill has no such rule.
8. **Fan-in guard + layered fan-in** — `strategy-parallel.md`, `strategy-workflow.md`. Source 12.
   Count returns against dispatches and refuse to synthesize on a partial set; batch-summarize
   before combining on wide runs. Small, mechanical, and the skill is genuinely exposed.
9. **Stateful backoff with a no-change fingerprint** — `shared-monitoring.md`. Source 13.
   For runs waiting on CI, review, or long external CLIs: target identity + last result
   fingerprint + no-change counter + escalating interval, resetting on any state change, with
   undue monitors never waking a strong model.
10. **The prompt-reference audit against Anthropic's own guidance** — all `prompt-*.md` +
    `shared-token-economy.md`. Source 7 (highest-authority source in the sweep). Hunt for
    conflicting instructions across files and rules that guard against worst cases current models
    no longer hit. Needs a design decision, not an edit — the skill's blocks exist to remove
    *narration*, which is a different job from constraining *judgement*, and their savings are
    already measured.
11. **The context tax** — `shared-model-routing.md`. Source 6 (dan_saffar), corroborated by the
    field reports under 5a and the v0.2→v0.3 retirement of the cheap lane. The tier table currently
    reads as if more tiers is always better routing; this is the counterweight, and the skill's
    house style demands it be present.
12. **Verifier return schema, four states** — `shared-contracts.md`, `prompt-verifier.md`.
    Source 8. `pass` / `fail with recoverable evidence` / `blocked by missing information` /
    `requires human judgment`, plus the tool-failure ≠ task-failure distinction in the BLOCKED
    grammar.
13. **"Test the test"** — `prompt-verifier.md`. Source 9. Two hand-made results, one clearly right
    and one plausibly wrong, before the verifier's verdict is trusted. *"If either goes the wrong
    way, the rubric is broken, not the agent."*
14. **Criteria before code** — `strategy-staged.md`, `shared-review-gates.md`. Sources 10 and 5a
    independently. Author each task's acceptance check as its own step after plan approval and
    before the first dispatch, ideally by a different agent than the implementer.
15. **One revision snapshot per fan-out batch** — `shared-token-economy.md`, `strategy-parallel.md`.
    Source 15. All workers in a batch pin the same `@ <sha>` *and* the same shared-record revision;
    a mid-batch change to `decisions.md` is a re-dispatch decision, not a silent update.
16. **`replan_noop` and the Outcome Floor** — `strategy-loop.md`. Source 13. A replan that produces
    no successor, resume condition, next action, gate or vision patch has not discharged its
    obligation; consecutive surface-only rounds force a primary result or self-repair.
17. **Fail-open logging + `restart_clean`** — `shared-safety-rails.md`, `shared-monitoring.md`.
    Source 1. A skipped check and a passed check must never print the same string; and rebuilding a
    context that keeps the task and tool results while dropping the model's own reasoning is a
    recovery move between "nudge" and "respawn".
18. **Planner-vs-reviewer tier ruling** — `shared-model-routing.md` tier table. Source 4.
    The tier table has no planner row; source 4 argues the strongest model is the *wrong* planner
    (over-engineering propagates into every downstream stage) and the right reviewer. Needs a
    recorded ruling, not a silent edit.
19. **Prefer a native in-host subagent over a shelled-out CLI** — `strategy-xcli.md`. Source 6
    (@HarshKamdar67). A subprocess lane forfeits the host's tool loop and permission enforcement;
    its output is text you must re-trust.
20. **"Graph" as a routing synonym** — `triage.md`. Sources 12, 14, 15. Users now say "run this as
    a graph" for what the skill calls parallel/workflow. A vocabulary line costs nothing. Carry the
    caution too: this topic has already produced at least one fabricated study, so any
    graph-engineering citation needs a primary source.

**Rejected outright:** source 2 (sponsored, no evidence — its one idea is candidate 7, credited to
source 9); source 14 as a mechanism source (explainer with nothing new); source 1's five-station
certification lifecycle and the Sage/Levanto dependency (crosses out of coordination into agent
registry and vendor lock-in); source 10's explain/video stations (out of scope); source 15's
finance-specific nodes.

**Numbers not to repeat without a primary source:** the "1/6th the cost" Luna claim (5b's own
chart implies ~1.5× per task); every figure in source 9 (all second-hand and unattributed); source
8's price arithmetic (the article visibly splices two pieces and is promotional toward one model);
source 13's 220.7/272.9 hours (self-reported, repo-linked but unverified here); the Bun rewrite's
$165,000 and 64-agent figures in source 12 (checkable, not checked in this sweep).
