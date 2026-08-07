# Model routing — tiers, and the rules that keep costs honest

Purpose: Select explicit model tiers for each orchestration role while controlling cost and capability risk.

Read when:
- A run dispatches any worker, reviewer, advisor, peer, or sub-orchestrator.

Skip when:
- No agent dispatch occurs.

Inputs:
- Available models, host pinning support, role complexity, risk, and budget.

Produces:
- Explicit per-role model map, effort settings, and drift verification steps.

## Contents

- Tier table
- The context tax (why fewer boundaries is the default posture)
- Planner placement (recorded ruling)
- Rules

## Tier table

| Tier | Job | Default | Never |
|---|---|---|---|
| **advisor** | rare judgment consults, OUT of the hot path | strongest available | executes or edits |
| **orchestrator** | plans, decomposes, assigns, measures | strong (opus-class) | implements |
| **reasoner** | architecture, hard debugging, algorithms | opus-class | mechanical batches |
| **worker** | scoped execution, boilerplate, tests, transforms | sonnet-class / cheap engine | design decisions |
| **reviewer** | spec/quality/verification | sonnet-class floor; panel lenses may go higher | writes |
| **peer** | different-lineage second opinion | codex/grok | seeing the other peer's answer pre-synthesis |

## The context tax (why fewer boundaries is the default posture)

The table is a menu, not a mandate. Every model boundary inside a run costs a re-explanation and
the tax compounds: *"one strong model inside a tight plan-eval-act loop beats two specialists that
keep re-explaining the world to each other. Specialization only wins when the handoff is almost
free, and it rarely is"* (practitioner argument, reasoned not measured). Two corroborations:
repeated field reports of cheap-implementer lanes producing work that had to be redone, and the
most-cited cheap-lane preset in that discussion retiring its own cheap lane between v0.2.0 and
v0.3.0. Add a tier only when the handoff is cheap and the tier changes an outcome.

## Planner placement (recorded ruling)

One working-code source argues the strongest model is the *wrong* planner and the right reviewer:
its tendency to over-engineer propagates into every downstream stage from a plan, while in a
review it is harmless — so plan at mid tier and review at the top. Counter-reports run both ways
(*"Personally I think opus is worse for orchestration"* against *"When it occasionally flicks from
Fable to Opus 5, it all goes tits up"*), all practitioner-anecdote. **Ruling:** orchestrator/planner stays at the strong-reasoner
tier by default; the mid-tier-planner + strong-reviewer configuration is a legitimate recorded
cost posture, not a defect — pick it deliberately, name it in `run.md`, and remember the mechanism
that justifies it (over-engineering is destructive upstream of a fan-out, harmless in review).

## Rules

Rule numbers are a stable citation surface (cited from five other files): append new rules at the
end, never renumber.

1. **Model — and reasoning effort — explicit on EVERY dispatch.** An omitted model silently
   inherits the session's most expensive one; an unset effort silently takes the host default
   (codex: medium), the same silent-inheritance bug one rung down. Both appear in every prompt
   template header; where the dispatch surface has no per-dispatch effort parameter (the reference
   host's Agent tool — only workflow `agent()` and xcli flags pin effort per call), the session
   effort governs — record it in `run.md` rather than pretending it was pinned.
2. **"Turn count beats token price."** Too-cheap models take 2–3× the turns and lose the savings.
   Mid-tier is the FLOOR for reviewers and prose-driven implementers; the cheapest tier only for
   transcription-grade work (the plan already contains the code). Corroboration: a harness vendor
   reports observing complex code-execution workflows on Haiku 4.5 costing more than the same work
   on Sonnet 4.6, purely on turn count (vendor-observed, unquantified).
3. **Task-class signals**: 1–2 files + complete spec → cheap worker · multi-file integration →
   standard worker · design judgment / whole-branch review → most capable.
4. **Escalation is a model change, and evidence triggers it — not only a self-report.**
   BLOCKED-for-reasoning re-dispatches the SAME task one tier up; never the same model unchanged.
   Beyond BLOCKED: N failed review or verification rounds on the same task (default 2–3) is a
   **model-tier escalation**, because repetition is evidence the task was misclassified, and a
   confidently mediocre worker never reports itself stuck. **Capability before retry** — a stuck
   worker gets a stronger model before it gets a fresh context; a restart hands the same task to
   the model that already couldn't do it. **Asymmetric hysteresis** — the cheap→strong hop is
   cheap and reversible, so fire it on one bad checkpoint; restarts and human escalation need
   repeated agreement.
5. **Token budget ≈ quality** (it explains ~80% of multi-agent quality variance): scale effort by
   complexity — simple lookup = 1 agent / 3–10 tool calls; comparison = 2–4 agents; complex =
   more. State the budget in the brief; cap chat returns per `shared-contracts.md`.
6. **Separate maker from checker — always.** Writer cheap+fast, reviewer strict, different
   instance. A worker checking its own work never replaces review.
7. **Advisor economics** (published): executor+advisor ≈ 92% of the strong model's quality at
   ~63% cost, advisor consulted ~once per task. When budget-pressed, prefer advisor-shaped
   routing over downgrading the whole run.
8. **Effort is the FIRST cost knob; model tier is the second.** Flags: Claude `--effort low..max`,
   codex `-c model_reasoning_effort=none|minimal|low|medium|high|xhigh|max` (medium default; enum
   live-verified 2026-08-07, `shared-engines.md`), grok-4.5 API `reasoning_effort=low|medium|high`
   (high default; no CLI flag as of grok CLI 0.2.106); kimi's is in rule 9.
   Use low/medium liberally wherever quality holds; step up to xhigh/max for demanding agentic
   work — and re-run an effort sweep for the model you are actually dispatching instead of
   inheriting defaults tuned on a prior one. **The cheap-at-max lane is real and
   latency-insensitive**: a third-party intelligence-vs-cost-per-task chart (coordinates read off
   the plot by eye — treat as approximate, re-derive before citing anywhere binding) puts
   `gpt-5.6-luna` at max effort at ≈51 index for ~$0.21/task against `gpt-5.6-sol` at low effort at
   ≈49.5 for ~$0.20; the one field comparison beside it (~10 parallel tasks, self-reported) found
   the cheap-at-max lane succeeding ~70% of the time at ~70% lower cost, while the strong model
   finished ~50% faster and in fewer turns — a speed gap a second, contradicting hands-on report
   also saw, adding ~20% higher quality on the strong model at medium effort. Route the
   cheap-at-max lane to background work, never an interactive loop, and weigh both reports.
   Effort does not shorten visible output — output discipline stays prompt-driven
   (`shared-token-economy.md`'s blocks). **Never disable thinking to save cost**: thinking at `low`
   effort beats thinking disabled at similar cost, and a rule telling a model not to think
   increases thinking-tag and tool-call leakage into user-facing text (vendor guidance).
9. Engine tier map — codex (verified 2026-07-13): `gpt-5.6-luna` ≈ cheap worker ·
   `gpt-5.6-terra` ≈ standard worker/reviewer · `gpt-5.6-sol` ≈ reasoner/advisor/peer.
   Grok (verified 2026-07-14): `grok-4.5` = flagship (500k ctx, coding/agentic/reasoning) ≈
   reasoner/advisor/peer; grok CLI (0.2.106, verified 2026-07-20) defaults to `grok-4.5` as its
   sole listed model — lists drift, re-verify with `grok models` before pinning. Kimi (verified
   2026-07-20, live 0.28.0): `k3` = flagship (1M ctx on
   Allegretto+ membership, 256k below; `reasoning_effort: low|high|max`, default `high` — set via
   config.toml or `/effort`, NOT a CLI
   flag) ≈ reasoner/advisor/peer · `kimi-for-coding` ≈ balanced worker/reviewer (256k ctx) ·
   `kimi-for-coding-highspeed` ≈ latency-critical worker (6× speed at 3× quota — budget-relevant,
   not a cheap tier; no cheap tier exists). Switching model or effort mid-session invalidates
   Kimi's prompt cache — pin both per session. Model lists drift — re-verify slugs before pinning
   (`shared-engines.md`).
10. Sensitivity to emphasized/literal wording varies by model — re-tune dispatch templates per
    model at a recorded boundary, never mid-run (cache hygiene, `shared-token-economy.md`).
11. **Hybrid preferred when the brief is transcription-grade**: planner spend converts
    prose-driven tasks into transcription-grade ones — buy the conversion, don't upgrade the
    worker. Eligible only if the brief passes `scripts/brief-check`, scope is narrow and declared,
    verification is exact, and no design/cross-task seam is unresolved; otherwise rule 2's floor
    applies unchanged. Judge a planner by the **worker tokens its plans induce**, not its own bill —
    terse plans are not free (Cursor 2026 swarm data: similar quality across mixes, ~8× cost
    spread, workers ≥69–90% of tokens — bounded observation, not a causal law).
12. **Host caveat** (non-Claude-Code hosts): per-dispatch pinning is native on Codex (agents
    TOML), Cursor (`model:` frontmatter), and opencode (agent files) — but Antigravity subagents
    inherit the parent model, Hermes accepts a per-task model then silently ignores it, and there is
    no documented per-dispatch pin on Kimi. On those hosts, tier separation routes
    through xcli engines (one process per tier, `strategy-xcli.md`) or collapses to one model +
    effort knobs — record which in run.md (`shared-hosts.md`).
13. **A pin you requested is not a pin you got — observe it.** Claude Code silently falls back to
    the session model when a pinned model isn't available on the account (resolution order:
    `CLAUDE_CODE_SUBAGENT_MODEL` env → per-invocation `model` → agent frontmatter → session
    model), and Codex TOML role pins can be unobservable at runtime. After dispatch, verify the
    model that actually ran — runtime/spawn metadata first, else the model's self-report in the
    report header, else host logs — and record the observation in `run.md` beside the requested
    pin. Unobservable routing is a **recorded risk**, not an assumed success; it does not stop the
    lane (`shared-hosts.md`'s degrade-and-say-so still governs), but a run whose tier separation
    was never observed cannot claim it.
