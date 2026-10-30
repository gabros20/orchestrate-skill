# Lane D — cross-harness agent messaging, durable/attachable sessions, spawn and routing

Researched 2026-10-13 against orchestrate v1.31.0 (`skills/orchestrate/`). Evidence grades: **repo-read** (I read the
implementing file), **docs** (README / vendor docs), **post-only**. "(via helper)" marks claims read by one of four
read-only sub-agents that I did not re-open myself; the load-bearing claim of each top candidate I re-read, and its
supporting claims are marked "via helper" where I did not.

**Verdict.** Orchestrate already owns the durable half of this lane (hash-chained journal, resume-by-id, receipts,
per-engine nudge bindings, `reap`, stall detectors, cross-family judges) and is ahead of nearly every tool here on lane
hygiene. Four real gaps: no live quota awareness when routing, no user-owned task-class routing rules, a vote that can be
decided by a seat that read nothing, and fix waves that re-prime from scratch. Two currency items: Claude Code's fork mode,
and ACP as the transport four independent tools converged on. "Attach / multi-device" is a host feature (Claude Code
cross-session messaging + Remote Control, Codex `--remote`, Pi Durable) — orchestrate should not build PTY lanes.

## Top candidates (ranked)

1. **Quota-aware engine choice, plus a quota ledger the journal derives for free** — from kunchenguid's firstmate +
   quota-axi (repo-read), omg.dev account ranking (repo-read), Octopus quota-watcher (via helper) · value **H** · effort
   **M** (the S slice ships alone) · lands in `shared-model-routing.md` (new rule 15), `shared-model-catalog.md` "How to
   pick" step 1, `scripts/capabilities`, `board plan` / `board launch`, `shared-lane-hygiene.md` rule 5 · beats today
   because quota is a filter in the catalog with no source (`shared-model-catalog.md` step 1 says "plan quota"; nothing in
   `scripts/board` or `scripts/capabilities` reads it — grep for quota / rate-limit: no runtime hits) and a stall is only discovered when a lane dies
   (`BLOCKED`, lane-hygiene 5), after priming is paid. The catalog's own research calls usage-limit burn "the top axis of
   differentiation, not raw quality" (`docs/research/model-selection/04-x-reports.md:12`).
   - **S slice (no new inputs):** `board return --status BLOCKED --resets <ISO>` journals when an engine is back; `board`
     derives `engine blocked until T`; `board launch --engine E` refuses before T (`--force` to override — the existing
     "never retry-loop against a subscription quota" rule made mechanical), `board plan` prints it.
   - **M slice:** when the user already has `quota-axi` (capabilities detects it; never installed unasked), `board plan`
     takes ONE snapshot and applies firstmate's order: (1) eligibility — model is in that harness's own catalog, an unknown
     quota is disclosed uncertainty and stays eligible; (2) reasoning-class fit — never downgrade the strongest class just
     to save quota; (3) runway floor — a known `projected_exhaustion` before the task's horizon fails; then rank by
     `spendPriority` (positive = allowance on track to expire unused). Print the numbers; never treat `unknown` as 0.
   - Two policies exist in the wild: firstmate = use-it-or-lose-it (`quota-array-dispatch/SKILL.md`), omg.dev = most
     headroom in the tightest window first (`src/claude-accounts.ts:221-285`). Recommend firstmate's plus its runway gate.

2. **Standing routing rules (`routes:` in `config.yaml`)** — from firstmate `config/crew-dispatch.json` (repo-read) and the
   user-owned CLAUDE.md routing tables in the Fable posts (diegocabezas01 / shannholmberg / pablostanley, post-only) ·
   value **M** · effort **S** · lands in `config.yaml` beside `aliases:`, SKILL.md "Selection priority", `shared-model-routing.md`
   precedence, `triage.md`, flight-plan `route:` line, `board dispatch` warning · beats today because an `alias` is per
   invocation and the catalog is per role: neither encodes "trivial fixes go to the Grok subscription I already pay for,
   image work and investigations to Codex" (kunchenguid's actual setup).
   - Shape (firstmate's, trimmed): `when` (natural language) → ordered `use:[harness·model·effort(·speed tier)]`, `why`,
     optional `approval: user` (a rule that never dispatches without a yes — for the strongest profile), optional `floor`
     (min % quota left, else fall to `default`). Precedence: explicit per-task > best-fit rule > default > catalog posture.
     If routes exist, a dispatch with no resolved profile is a `board check` finding (firstmate's spawn refuses outright).
   - Do NOT copy its optional hosted classifier (typesafe.ai "Jev"): paid, and the controller is already an LLM. Keep two
     lessons from its benchmark (`docs/verification/dispatch-resolve.md`): classify from the task's goal/spec only (≈0.6k
     tokens vs ≈4.3k for the whole scaffolded brief, same 16/16 top-rule accuracy), and route low-confidence picks to
     ask/escalate, never to an arbitrary choice (25 briefs: 0 wrong "clear" results in the first run, 1 in the second).
   - Fold in speed: Codex's own catalog lists `service_tiers: priority/"Fast" — "2x speed, increased usage"` for
     gpt-6.1-sol and gpt-6-astra ([L] `~/.codex/models_cache.json`, 2026-10-13); `engine-codex.md:61` knows `--fast`
     exists but says 1.5× (stale for those two models) and no rule pins it. Treat the tier as a fourth pinned axis
     (default = standard, which is what this machine's `config.toml` pins; fast only for latency-bound lanes, because it
     is "increased usage" — the same silent-inheritance bug rule 1 describes for effort).

3. **Vote validity: blind or ungrounded seats do not count, and approvals need distinct lineages** — from Claude Octopus
   `scripts/lib/council.sh` (repo-read) · value **M** · effort **S** · lands in `scripts/board` (`vote --evidence PATH`,
   derived gate text `approve 2/3 ok · 1 blind`, `check` finding), `shared-review-gates.md` "Panels and consensus",
   `prompt-spec-reviewer.md` / `prompt-quality-reviewer.md` (return an `Inspected:` line; optional schema-forced return
   `{verdict, inspected[], findings[]}` via `codex exec --output-schema` / `claude --json-schema`) · beats today because
   `board vote` takes a verdict and a free-text `--why` and `panel:N` is a plain majority (`scripts/board:859-862`), so a
   quota-stalled or sandbox-blind reviewer that says "ok" can be the deciding vote.
   - Octopus rules, read in code: a seat is excluded from quorum when its response is empty, a host stub, a short "I cannot
     access the plan/files" reply, or a refusal-only "blind" seat; quorum needs ≥N DISTINCT approving model families, with
     any family holding a non-APPROVE seat subtracted and the chair excluded; a missing or unclear `VERDICT:` line counts
     as REVISE. Observed failures that produced the rules (code comments): a Gemini seat's "I cannot access the
     implementation plan" REVISE counted as the second provider; a double-seated vendor passing on its one approving seat;
     a single vendor standing in for consensus. (Caveat: its "75% consensus gate" is a completion ratio over result files
     in `quality.sh`/`testing.sh` — via helper — not agreement; don't copy the marketing.)

4. **Fix wave = continue the author with only the failing evidence; reviewers stay fresh** — from no-mistakes
   `internal/agent/review_roles.go` ("Only the fixer resumes sessions; review turns remain fresh"; reviewer and fixer are
   separate role agents with an optional later-round overlay `Late`/`LateFrom`), the /lightning skill (resume the same
   executor, stop after two corrective resumes — via helper), pablostanley's /fableloso ("send fixes back to the same
   agent", post-only) · value **M** · effort **S** · lands in `strategy-staged.md` step 6 + Finish, `strategy-parallel.md`,
   `shared-review-gates.md` findings loop, `shared-model-routing.md` rule 4, `board dispatch --continue impl-3` · beats
   today because a fix wave is "ONE fix subagent carrying the full implementer contract" (`strategy-staged.md:87`) — a
   re-prime — while orchestrate's own measurement says a resumed session re-hits cache ("97% cache hits",
   `shared-lane-hygiene.md` rule 5). Guard rails: same-tier corrective = continue; tier escalation or polluted context =
   new agent (rule 4, monitoring 2b `restart_clean`); cap at two continues without gate movement.

5. **Fork-aware dispatch for Claude Code ≥ 2.1.232** — from delba_oliveira's `/fork` and dani_avila7's "build context
   first, then fork" (docs fetched 2026-10-13; also visible in this session's own Agent-tool schema) · value **M** · effort
   **S** · lands in `engine-claude.md` / `shared-hosts.md` Claude column, `shared-model-routing.md` rules 1 and 13,
   `shared-monitoring.md` rule 1, `shared-token-economy.md` priming · beats today because no reference mentions it (only
   Grok/Kimi `/fork` as a session branch, `shared-hosts.md`).
   - Facts (docs): `subagent_type:"fork"` inherits system prompt, tools, **model** and full history; its first request
     reads the parent's prompt cache; **no model or per-invocation `effort`** (that parameter is non-fork only); result
     returns as a message; cannot spawn forks; `isolation:"worktree"` allowed; `/subtask` (≥2.1.212) replaced the old
     `/fork` command; fork mode is **on by default in interactive sessions since 2.1.232 and then every Agent spawn runs in
     the background** ("Claude can't ask for the foreground").
   - Rules to add: never use a fork for a pinned role (it breaks rule 1 and shows up as model drift in rule 13); fork
     deliberately for same-model side quests or N variants over a large shared context; the default for workers stays
     fresh-context + pointers; the controller waits on notifications, it never assumes a blocking Agent call.

6. **ACP (Agent Client Protocol) as a second lane transport** — from agent-sh/consult `acp/` (repo-read), Buzz `buzz-acp`
   and omg.dev (via helper), no-mistakes `acpx` (listed, not read) · value **M** · effort **L** (strategic; do not rush) ·
   lands in a new `engine-acp.md` + one `board launch --engine acp --acp-cmd '<cmd>'` template · beats today because six of
   nine engine templates are `dry-run (docs)` only (`shared-engines.md` map) and flag drift has cost real runs ("three
   consecutive failed launches… 40 minutes"); ACP is `initialize` → `session/new` | `session/load` (only if `loadSession`
   advertised) → `session/set_config_option` / `set_model` → `session/prompt` → `session/cancel`, with a permission callback
   and streamed updates — one typed surface for model/effort pin, resume, cancel and structured permission handling, i.e.
   the "no CLI-agnostic interrupt" gap in `strategy-team.md`. Orchestrate already lists `opencode acp`, `hermes acp`,
   `grok agent stdio`, `cursor-agent acp` but only as workarounds (`engine-*.md`). Constraints: use only ACP servers the
   user already has installed (consult's registry fetches Claude/Codex adapters with `npx -y` — refuse that); effort over
   ACP is adapter-defined (consult echoes it without applying; Buzz sets it via the advertised `thought_level` option);
   start read-only (consult auto-approves read/search and cancels the rest).

Not top-6 but worth a line each in the next release: `kind=research|review` outputs authorize no change (firstmate "evidence
is never authorization"; `shared-safety-rails.md` has the PR-grant rule only); machine-capacity admission in `board launch`
(firstmate exit 75 = "deferred, stays queued, not blocked"; omg.dev RAM admission) ; a `board send --ring` doorbell for
Codex lanes via `codex queue --thread` (record stays the delivery); opt-in Stop-hook "no blind turn-end" guard; `brief-check
--overlap` (pairwise `owns:` check — today a manual grep, `strategy-parallel.md` Flow step 1).

## Tools

### firstmate / secondmate / crewmate (kunchenguid) — an "agent distro": one supervisor agent runs a crew through tmux/Herdr
- Links: github.com/kunchenguid/firstmate — 7,870★, MIT, created 2026-06-12, pushed 2026-10-12; no separate docs site.
- Evidence: **repo-read** — `AGENTS.md` (whole), `VISION.md`, `.agents/skills/{quota-array-dispatch, harness-adapters (+3
  common refs), stuck-crewmate-recovery, secondmate-provisioning (first third)}`, `docs/configuration.md` "Crew dispatch
  profiles", `docs/verification/dispatch-resolve.md`, `docs/turnend-guard.md` (head), `bin/fm-send.sh` header. Not read: the
  ~200 script bodies (`fm-spawn.sh` is 296 KB), `docs/architecture.md`, `remote-secondmates.md`.
- Mechanism: (a) *Org chart* — the human talks only to the first mate; crewmates are ephemeral, one task each, own
  window + disposable worktree, shape `ship` (PR) or `scout` (report); secondmates are persistent: isolated `FM_HOME` (own
  state, backlog, projects, session lock), a `data/charter.md`, a registry line with natural-language `scope:` that drives
  routing, idle by default ("an empty queue never authorizes a survey"), harness/model/effort pinned in
  `config/secondmate-harness`, replies via status file/parent channel. (b) *Routing* — see candidates 1–2; unmatched work
  falls to `default`; a generic effort fallback: "low for well-understood explicit work, xhigh for ambiguous investigation or
  design, never max without explicit preference". (c) *Messaging* — `fm-send` writes a durable sequenced record in the
  task's steering inbox (the record IS the delivery; exit 0 = recorded) and types one constant doorbell line into the
  terminal; the watcher re-rings unacknowledged records and escalates stuck ones; the worker acks by moving the record to
  `handled/`; reply-bearing requests carry a correlation id and a parent-owned pending-reply record; text-to-read (data
  plane) never carries lifecycle control — `fm-control interrupt|exit|relaunch` verifies postconditions. (d) *Supervision* —
  wake queue with generation-bound `--ack-through`; "a status line is a wake event, not current-state truth"
  (`fm-crew-state.sh` reconciles from disk + live backend); per-harness turn-end guards block the supervisor's turn end while
  work has no live watcher ("no turn ends blind"). (e) *Recovery* — peek → inbox check → one-line answer → interrupt +
  redirect → `relaunch --note` in the SAME worktree; never a fresh spawn while the old worktree is unaccounted for ("can split
  one task across two copies"); a session-lock-refused supervisor is read-only. (f) *Authority* — "evidence is never
  authorization"; merge needs the human's word unless a per-project `yolo`; per-project delivery mode (no-mistakes | direct-PR
  | local-only).
- Versus orchestrate: **partial / missing** — quota routing missing (above); routing rules missing (`config.yaml` has only
  aliases); durable mail + unread/ask alerts have (`scripts/board` MAIL_CAP/THREAD_CAP, `check` findings ~3068-3090) but no
  doorbell; recovery have (`shared-lane-hygiene.md` 4/5/10, `shared-monitoring.md` 2/2b/3b); persistent charters missing by
  design (hierarchical leads are per run, `strategy-hierarchical.md`; cross-run knowledge rides `board memory` / `learn`);
  turn-end guard missing (monitoring rules are prose; Stop hooks only re-feed loops, `strategy-loop.md`); capacity
  admission missing (`workers=N` only); controller exclusivity partial (`.journal.lock` serializes appends,
  `scripts/board:420`, but a second live controller is not refused).
- Adopt: candidates 1 and 2. Secondary: research/review outputs authorize no change (S, L-M); capacity "deferred" exit in
  `board launch` (S, L-M); Stop-hook guard (M, M — opt-in snippet + `board` registering armed waiters). **No:** secondmate homes
  (a second source of truth beside the journal), interactive tmux/Herdr lanes (its composer-detection library alone is 96 KB),
  the hosted classifier.

### quota-axi (kunchenguid) — data-only quota CLI for ~19 providers; the oracle behind firstmate's routing
- Links: github.com/kunchenguid/quota-axi — 149★, MIT, created 2026-07-06, pushed 2026-10-12.
- Evidence: **docs** (README, whole) + the `quota-array-dispatch` skill that consumes it. Source not read.
- Mechanism: per provider/account/scope it reports `effectivePercentRemaining`, `runway` (`through_reset` |
  `projected_exhaustion` | `exhausted_now` | `unknown`) and `spendPriority`. Per bounding window
  `S_w = percentRemaining − burnMultiple × timeRemaining%`, `gap_w = S_w / timeRemaining%`, scope metric = cycle-weighted
  mean of `gap_w`, clamped to ±100: positive = allowance on track to be forfeited at reset, 0 = exact, negative = overdrawn;
  any window without trusted pace makes the whole scope `unknown` (never 0). Never routes — "the consumer does any
  ranking".
- Versus orchestrate: missing (see candidate 1). Caveat: it reads vendor credential stores (Keychain, `auth.json`) itself;
  orchestrate's no-credential-reading rule stays intact only if it consumes the CLI's output and never reimplements it.
- Adopt: consume if present (candidate 1, M slice). No: bundling or reimplementing it.

### no-mistakes (kunchenguid) — `git push no-mistakes`: a local git proxy that gates a push through an AI pipeline
- Links: github.com/kunchenguid/no-mistakes — 8,860★, created 2026-04-05, pushed 2026-10-13; docs site in-repo.
- Evidence: **repo-read** `internal/agent/{review_roles,fallback}.go`, `benchmarks/issue-1284/results.md`, README; the 100 KB
  pipeline-steps reference and review-conversation docs not read.
- Mechanism: push → disposable worktree → review → test → docs → lint → push → PR → CI-watch with auto-fix; findings are
  typed (safe mechanical fix vs "approve / fix / skip" for the human); agent-agnostic with ordered fallbacks that fire only on
  agent-unavailable errors (`start:`, `exited:`), not on findings or rate limits; reviewer and fixer are separate role agents
  with a per-round overlay; only the fixer resumes sessions; `NeutralizesGateInstructions` is checked fail-closed across the
  whole fallback set (the repo's own AGENTS.md/CLAUDE.md are neutralized for gate agents; one unverified member refuses the
  gate). Its benchmarks publish flat results as flat.
- Versus orchestrate: review gates have (`shared-review-gates.md` spec→quality, cross-family default, final-deliverable
  gate, tier escalation after N rounds); fix continuity missing (candidate 4); instruction-file neutralization is the same
  failure class orchestrate prevents with a spec-preamble opt-out and hermetic flags (`strategy-xcli.md` lane hardening,
  lane-hygiene 9), at a different layer.
- Adopt: candidate 4. No: the git-proxy pipeline (a different product; PR delivery is outside orchestrate's boundary).

### Claude Code native cross-session features (dani_avila7, delba_oliveira) — SendMessage across sessions, Agent view, fork, `-n -w`
- Links: code.claude.com/docs/en/{cross-session-messaging, sub-agents, agent-view}; v2.1.296 is current.
- Evidence: **docs** (cross-session-messaging fetched whole; sub-agents fork section) + this session's own tool schemas
  (fork ignores `model`/`effort`; `SendMessage.notify_when_idle`; Agent spawns are background).
- Mechanism: ≥2.1.224 `ListAgents` + `SendMessage` reach other local sessions over a per-session Unix socket (other machines
  via Remote Control); a message is read between tool calls — never interrupting a running tool — or starts a turn if idle;
  `notify_when_idle` (≥2.1.236, main conversation → local sessions only) is a one-shot idle/exit notice; `claude -p` workers
  bind a socket (not `--bare`) and need `crossSessionInbound=accept` via `--settings` to take messages unattended; the
  default **holds** a message for approval when a bypass-permissions receiver gets a message from a non-bypass sender; hooks
  and Bash get `CLAUDE_CODE_MESSAGING_SOCKET`/`_TOKEN`; a message cannot approve, reconfigure or run commands. `claude -n NAME
  -w` names the session (the SendMessage address and attach/logs key) and creates `.claude/worktrees/NAME`.
  `claude agents --json` states: working|blocked|done|failed|stopped, `waitingFor`.
- Versus orchestrate: nudge via SendMessage and `claude agents --json` already documented (`shared-monitoring.md`,
  `engine-claude.md:68`); fork mode and cross-session mail not mentioned. Native delivery drains at every tool round while
  `board` mail waits for the next `board` call — but only for Claude sessions, and the hold rule can stall unattended
  bypass-mode lanes.
- Adopt: candidate 5. Optional: for Claude lanes, mention SendMessage as the doorbell. No: building on `-n/-w` beyond a
  line in `engine-claude.md` (it already pins `--session-id`).

### Claude Octopus (nyldn) — Claude Code plugin routing across 12 external providers with "consensus gates"
- Links: github.com/nyldn/claude-octopus — v11.13.2, MIT, ~4.2k★ (via helper), pushed 2026-10-13; ~1,400 files, mostly bash.
- Evidence: **repo-read** `scripts/lib/council.sh` (substantive/blind-seat and quorum code, re-read); routing, quota-watcher,
  circuit breaker, cost gates and the tangle snapshot post-conditions via helper.
- Mechanism: router is a regex cascade, no LLM (`scripts/lib/routing.sh`); provider per role from
  `~/.claude-octopus/config/providers.json` with fallback chains; each provider is a headless subprocess with the prompt on
  stdin and an `env -i` allowlist; `quota-watcher.sh` kills a child when a terminal-quota regex persists over 2 polls and
  marks the provider quota-dead with a parsed TTL ("Resets in 156h"); a per-provider circuit breaker (3 transient failures →
  300 s open); the council's seat/quorum rules (candidate 3); a before/after git-snapshot digest the worker cannot rewrite
  proves a tangle produced changes. Weak spots: the hook "quality score" is `len//7` plus keywords, non-blocking by default;
  the "75% consensus" is a completion ratio.
- Versus orchestrate: panel/consensus votes have, validity rules missing; empty-diff check have (`strategy-xcli.md` lane
  hardening); quota TTL marks missing (candidate 1 S slice is the journal-native version).
- Adopt: candidate 3; TTL'd quota-dead marks inside candidate 1. No: the router, personas, "Dark Factory".

### omg.dev (BennyKok, formerly lfg) — self-hosted control plane for Claude/Codex/OpenCode/Pi/Grok sessions, web + iOS
- Links: github.com/BennyKok/omg.dev — 548★, MIT, created 2026-06-17, pushed 2026-10-13; the hosted half is closed.
- Evidence: **repo-read** `src/claude-accounts.ts` (re-read); the rest via helper (`src/commands/subagent.ts`, `mcp.ts`,
  `session-recovery.ts`, `bots/*`, `agent-admission.ts`).
- Mechanism: "long-lived tmux" is legacy; harnesses are detached processes driven by an append-only per-session command
  file polled every 250 ms. A running agent calls MCP `omg_create_subagent` / `omg_delegate_to_agent` (agent, model,
  thinkingLevel, cwd, worktree; nesting cap 4); the child gets a fixed report grammar (`[subagent progress|complete|blocked|
  failed]`) sent back with `omg_send_session_message` (steer interrupts a busy non-persistent parent; a dead parent is revived
  first); `omg_find_sessions` / `omg_get_session_messages` give agents substring search over past sessions; recovery adopts
  live harnesses, relaunches dead ones with resume ids and stamps `interruptedAt` — never replays a turn; admission = plan
  limit + RAM budget; "bots" are persona + durable session with rotation-with-checkpoint; Claude accounts are ranked by
  measured 5h/7d utilization (candidate 1).
- Versus orchestrate: spawn/resume/receipts have; report grammar have (`board return --status`); cross-session search belongs
  to the memory lane; standing leads missing by design; RAM admission and quota ranking missing.
- Adopt: ranking idea (candidate 1), RAM/load admission (secondary). No: the web/iOS attach (a UI product), bots.

### Pi Durable + PiNomad (Earendil; ninthbit_ai) — a checkpointed harness substrate; a multi-device client built on it
- Links: earendil.com/posts/pi-1-0 and /posts/pi-durable (2026-10-01); github.com/earendil-works/pi `packages/durable`
  (v1.2.0, "Experimental"); github.com/bubbleptr/pinomad — 24★, Apache-2.0, created 2026-10-04.
- Evidence: **docs** (both posts read whole by me); code (`harness/tool.ts`, `inbox.ts`, `session/observation.ts`,
  PiNomad `packages/protocol`) via helper.
- Mechanism: every step (model call, tool call, compaction) is a task that stores a checkpoint first; tool *intent* is
  committed before the tool runs; after a crash a cut-off tool reruns only if declared `replay:"safe"` (default unsafe),
  otherwise the model is told it was interrupted; `requestId` dedupes submissions; any number of clients attach to one
  conversation (view first, then deltas) and may steer (`whenBusy:"steer"` lands after the current tool round, `followUp`
  after the final answer, `reject`); one process owns a storage (PiNomad adds a lockfile). PiNomad wraps it in a Noise-IK
  channel, QR pairing, a self-hosted relay, one worktree per conversation.
- Versus orchestrate: durability is a host property; orchestrate persists run state on disk instead (journal,
  `board resume`, `check --replay`) and delegates in-lane crash recovery to the engines (resume-by-id). Per-step replay
  safety has no analogue because orchestrate does not own the model/tool loop.
- Adopt: no. (Cheap carry-over considered and dropped: `requestId` on `board send` — the 8-per-stint cap already bounds a
  double send.) Optional, low: a read-only `board serve` for phone viewing — a UI project, not a coordination gap.

### agentsys + consult/debate (agent-sh) — marketplace of 24 plugins / 50 agents for five platforms; the real cross-harness piece is ACP
- Links: github.com/agent-sh/agentsys — v6.1.1, ~1k★ (via helper), pushed 2026-10-08; github.com/agent-sh/consult — 3★.
- Evidence: **repo-read** `consult/acp/{providers.json,client.js}` (re-read); workflow state, adapters and gates via helper.
- Mechanism: "five platforms" is install-time text transformation (`lib/adapter-transforms.js` rewrites paths and
  frontmatter, strips models) — not runtime routing; phase gates are a 12 KB prompt telling the LLM to call a state lib; the
  state registry is optimistic-write with `claimTask` as an overwriting upsert; a SubagentStop "enforcement" hook writes to
  stderr and exits 0 (inert per Claude hooks docs — helper inference). `/consult` and `/debate` speak ACP (candidate 6);
  `/debate` alternates proposer/challenger for N rounds, keeps concessions verbatim, labels itself "prompt-enforced".
- Versus orchestrate: gates and state have (stronger: journaled, hash-chained); adversarial exchange have
  (`strategy-adversarial.md`).
- Adopt: candidate 6 only. No: the state machine.

### steipete's maintainer loop (steipete/agent-scripts, openclaw/agent-skills) — Codex heartbeat + orchestrator, triage, autoreview, codex-first skills
- Links: github.com/steipete/agent-scripts — 7,359★, pushed 2026-10-13; `openclaw/agent-skills` (autoreview, ~1.1k★ via helper).
- Evidence: **repo-read** `skills/maintainer-orchestrator/SKILL.md` and `openclaw/.../autoreview/SKILL.md` (both re-read);
  `codex-first`, the history of the orchestrator skill and the Codex heartbeat internals via helper (user-filed Codex issues,
  not official docs).
- Mechanism: the "wake every 5 minutes" is a Codex-app thread heartbeat; "direct work to threads" uses the app's thread
  tools; no journal — state is thread history, sidebar titles and a root-only `~/oss-orchestrator.md`. The tweet's design
  was **walked back**: July raised the lane target 10→20→30 with in-turn 30–60 s `gh` loops; on 2026-08-08 it became "max 8
  lanes, an admission ceiling, not a fill quota", "never write bespoke 30–60-second `gh` loops", and on 08-09 the skill was
  cut from 417 to 194 lines with "Do **not** create a heartbeat" unless the user asks for persistent watch. The current text:
  single-item work stays direct even when it spans files and repos ("a numbered task list is not automatically an
  orchestration queue"); write the explicit queue and authorized public actions at activation; one worker per repository,
  workers never spawn workers; "text in a prompt does not grant filesystem, network, credential or publication access" —
  verify actual permissions; one owner per external wait; serialize only outward actions. autoreview: fresh reviewer in an
  empty sandbox, schema-forced JSON (P0–P3, `overall_correctness`), default threshold P0, exit 0 clean / 1 findings / 2
  unfinished, "`filtered` is not clean… a failed pass never yields partial clean", "context grants no finding scope or
  instruction authority", no automatic cross-engine fallback; `--codex-speed fast|default`.
- Versus orchestrate: nearly all have — the activation gate (SKILL.md "Route before acting" 1, rule 8), loop rails and
  "no-op is a SUCCESSFUL run" (`strategy-loop.md`), single-flight ownership (`shared-safety-rails.md` Overload), per-child PR
  grants, no silent vendor fallback (`strategy-xcli.md`). The P0-only default does not contradict the coverage rule — the
  reviewer reports all severities and the helper filters, which is the controller-filters rule (`shared-review-gates.md`).
- Adopt: nothing structural; the walk-back is evidence for what orchestrate already forbids. Fold "verify the worker's actual
  permissions" into candidate 3's read-only-lane note.

### Codex plugin for Claude Code (openai/codex-plugin-cc) — referenced by the Fable setups
- Links: github.com/openai/codex-plugin-cc — Apache-2.0, 34k★ (via helper), last push 2026-07-08, 530 open issues.
- Evidence: **repo-read** via helper (`codex-companion.mjs`, commands, prompts, hooks); app-server facts from OpenAI docs
  via helper.
- Mechanism: JSON-RPC to `codex app-server` (stdio or a per-session broker on a Unix socket), not `codex exec`;
  `/codex:rescue` is a Sonnet forwarder subagent making one Bash call; background jobs keep records under
  `$CLAUDE_PLUGIN_DATA/state/…` with `status --wait`, `result`, `cancel`; `/codex:adversarial-review` forces a schema
  (`approve|needs-attention`, findings with file/line/confidence) behind a "break confidence in the change" prompt and
  the result skill says stop after findings, never auto-fix, never turn a failed Codex run into a Claude-side attempt;
  optional Stop-time review gate (`ALLOW:`/`BLOCK:`). Known pain: brokers never self-terminate (#543), ending any Claude session
  kills a shared broker mid-turn (#540), state read-modify-write race (#458), SessionEnd kills a session's jobs.
- Versus orchestrate: detached `codex exec` wrappers are sturdier than the broker; the never-fall-back rule is already
  orchestrate's (rule 1, xcli "no silent vendor fallback").
- Adopt: the schema-forced adversarial verdict as a panel lens (inside candidate 3). No: app-server brokers; revisit when
  `turn/steer` and `codex --remote` (attach a TUI to a headless thread, docs via helper) leave "experimental".

### Hermes slash commands (/background /steer /goal …, NousResearch/hermes-agent)
- Evidence: **docs** + partial repo-read via helper (`slash-commands.md`, `goals.md`, `agent_runtime_helpers.py`).
- Mechanism: `/background` is a separate session whose result does NOT re-enter the main history (the pitch said it did);
  `/steer` stores text in a slot, applied after the tool batch as a user-role row so role alternation, the transcript and the
  prompt cache stay intact; `redirect()` cancels only the in-flight model request; `/goal` runs a cheap judge after each turn
  (`done|blocked|continue|wait`; `wait` parks on a pid/pattern/timer), 20 continuation turns, fail-open to `continue`,
  deterministic gates (`/goal gate add <cmd>`) run BEFORE the judge.
- Versus orchestrate: `strategy-loop.md` has the verifier, state, cap and kill switch; the judge-after-gates ordering and a
  `wait` verdict are not written down.
- Adopt: low — one sentence in `strategy-loop.md` ("run the machine check before any model judge"). No: the rest.

### /lightning (dabit3/lightning-orchestrator) — frontier model plans and reviews, a 1,000 tok/s model implements
- Evidence: **repo-read** via helper (SKILL.md 11 KB, AGENT.md); pricing from Devin docs via helper; speed claim is vendor/post-only.
- Mechanism: Devin `run_subagent` with a profile that pins `model: swe-1.7-lightning`; self-contained work order
  (objective, criteria, constraints, known context, validation, return grammar); the orchestrator reads the diff, treats the
  report as evidence, resumes the same executor with only the failing evidence, stops after two corrective resumes; refuses
  to offload a few low-risk lines or read-only questions. Speed is a priced SKU: Lightning lists at 5× SWE-1.7's per-token
  price for the same weights.
- Versus orchestrate: handoff-cost reasoning have (`shared-model-routing.md` "context tax"); resume-the-executor missing
  (candidate 4); speed as an axis missing (candidate 2).
- Adopt: candidates 2 and 4. No: Devin-only dispatch.

### claude-peers (louislva) — SQLite broker + MCP channel so Claude sessions find and message each other
- Links: github.com/louislva/claude-peers-mcp — 2,206★, created 2026-03-21, pushed 2026-04-26.
- Evidence: **repo-read** `broker.ts`, `shared/types.ts`, `CLAUDE.md`.
- Mechanism: localhost:7899 HTTP daemon with `peers` (pid, cwd, git_root, summary) and `messages` (`delivered` flag) tables;
  liveness = `kill(pid, 0)` every 30 s; MCP servers poll once a second and push through Claude Code's channel protocol;
  `list_peers` scoped machine/directory/repo; optional model-written summaries. No auth — any local process can register
  and message.
- Versus orchestrate: `board peers`/`send`/`inbox` are journaled, capped and ack'd; and Claude Code ≥2.1.224 now ships the
  same capability natively (above).
- Adopt: no.

### tmux-bridge-mcp (howardpen9) — MCP over `tmux send-keys` / `capture-pane`
- Links: github.com/howardpen9/tmux-bridge-mcp — 101★, created 2026-03-28, pushed 2026-07-19.
- Evidence: **repo-read** `src/tmux-bridge.ts`, `system-instruction/smux-skill.md`.
- Mechanism: read, type, message, keys, name, resolve; a file-based read guard (must `tmux_read` a pane before typing, and
  every act clears the guard); self-send loop prevention; messages are typed with a header `[tmux-bridge from:X pane:%N
  id:abc]`; "never poll — replies arrive in your pane". No persistence, ack or verification.
- Versus orchestrate: nothing to add; journaled mail replaces keystrokes. The read-before-act guard is a compare-and-swap for
  typed input, relevant only if lanes were ever interactive.
- Adopt: no.

### pi-interactive-shell + pi-subagents (nicobailon)
- Links: github.com/nicobailon/pi-interactive-shell — 593★, no LICENSE file; pi-subagents — 3,922★, MIT.
- Evidence: **repo-read** via helper.
- Mechanism: interactive-shell drives CLIs in a `zigpty` PTY with a headless xterm screen; dispatch mode wakes the agent with
  `pi.sendMessage(..., {triggerTurn:true})` — in-process, no ack, no persistence; "done" for an interactive CLI is an 8-second
  quiet timer that kills the session; user takeover is not exclusive (agent writes are not blocked at the PTY). pi-subagents:
  markdown agent files with `tools`, `model`, `thinking`, depth caps; async runs finish into a results directory watched
  with batching; an acceptance ladder (claimed → attested → checked → verified → reviewed) where the host runs verify
  commands; steer receipts; lease-protected resume.
- Versus orchestrate: `board exec` already runs checks through the journal; lane exits and receipts are explicit, not inferred
  from silence.
- Adopt: no. One carried principle already in force: never read quiet as success.

### Continuous-Claude-v3, project-orchestrator, OctoGent, Buzz, LLMJunky swarms — frameworks with little to add
- Evidence: **repo-read** via helper for all five.
- CC-v3 (parcadei, 3.9k★, last push 2026-01-26): Postgres sessions/file claims via a Python spawn per hook; claims are never
  released and one imported module is missing from the tree. project-orchestrator (this-rs, 140★, MIT with BUSL parts):
  Neo4j + Meilisearch + NATS; no atomic task claim; ideas worth a line — `interrupted` as a state distinct from `failed`,
  conflict-coloured waves from declared `affected_files`. OctoGent (hesamsheikh, 1.4k★, last code push 2026-04-20): bare
  `claude` typed into a PTY after a fixed 4 s, in-memory message queue released on Stop hooks. Buzz (block/buzz, Apache-2.0):
  chat on Nostr + Postgres/Redis/S3; state is lossy prose, no worktree code, agents cannot spawn agents; good doctrine on
  wake discipline and a fail-closed memory read. swarms (am-will, 232★, stale since April): plan-file DAG with evidence-
  required completion, but unbounded retries.
- Versus orchestrate: journal, caps, stall detectors and rails are stronger; `strategy-loop.md` has bounds this lacks.
- Adopt: `brief-check --overlap` (S, L-M) from project-orchestrator; nothing else.

### Fable-as-orchestrator posts (diegocabezas01, theo, shannholmberg, pablostanley) and sol-advisor (daniel_mac8)
- Evidence: **post-only**; theo's CLAUDE.md section is an image not present in the sources.
- Already covered: diegocabezas01 and the shannholmberg swarm post (`docs/research/foundations.md:35,41,111-126`);
  sol-advisor (`2026-08-frontier-sweep-repos-web.md` R3) whose "a pin you requested is not a pin you got" landed as
  `shared-model-routing.md` rule 13 (`--observed-model`).
- New and small: shannholmberg Jul 17 ("a subagent left alone inherits Fable's reasoning level, so set the model explicitly
  at spawn", route code to GPT, drafting to Sonnet) is rule 1 plus candidate 2; pablostanley's "review their diffs yourself,
  send fixes back to the same agent" is candidate 4.
- Adopt: via candidates 2 and 4.

## Not worth adopting (one line each, why)

- Interactive PTY lanes that type into a TUI (OctoGent, pi-interactive-shell, firstmate crew windows, tmux-bridge): idle
  detection by timers and regexes is the fragile layer (fixed 4 s delays, an 8 s quiet-kill, a 96 KB composer library);
  headless lanes with resume-by-id give takeover without it (`board resume` prints `codex resume <id>`).
- Durable / multi-device attach (Pi Durable, PiNomad, omg.dev, Buzz mobile): host products; orchestrate's journal already
  survives host death.
- Persistent secondmate homes / bots / tentacles: a second source of truth beside the journal; cross-run knowledge already
  has `board memory` + `learn`.
- Graph or SQL coordination servers (project-orchestrator, CC-v3, claude-peers): an infrastructure dependency for a
  stdlib-only skill; none gives an atomic claim that `--owns` plus worktrees does not.
- Codex app-server brokers (codex-plugin-cc): open lifecycle bugs (#540, #543); keep `codex exec` wrappers.
- Hosted dispatch classifier (typesafe.ai): paid external dependency; the controller is the classifier.
- Octopus router/personas/"Dark Factory", agentsys phase machine: prompt-level gates weaker than the journaled ones.

## Gaps (what I could not verify, and why)

- x.com returned HTTP 402 to fetches, so tweet text comes only from the sources file; theo's CLAUDE.md screenshot and the
  demo videos (dani_avila7, rileybrown, hot_town) were not seen.
- Nothing was installed or executed. Claude Code behaviours are docs (fetched 2026-10-13) plus this session's tool schemas;
  Codex `turn/steer`, `thread/fork` and `--remote` are docs via helper, unprobed.
- Via helper, not re-opened by me: Buzz, OctoGent, omg.dev (except account ranking), agentsys workflow state, CC-v3,
  project-orchestrator, pi-interactive-shell, pi-subagents, Pi Durable code, PiNomad, steipete's `codex-first` and commit
  history, /lightning, Hermes, LLMJunky, codex-plugin-cc; star counts for those are helper-reported `gh api` numbers.
- Not read: firstmate's script bodies, `docs/architecture.md`, `remote-secondmates.md`; no-mistakes `pipeline-steps.md` and
  review-conversation docs (so its finding taxonomy is from README only); quota-axi source (README only, so its output schema
  stability, "schema 6", is unchecked); Octopus `docs/PROVIDERS.md`; the typesafe.ai "Jev" classifier internals.
- Unknown: whether `quota-axi` is installed on the author's machine, and whether it can be called without prompting for
  keychain access; whether Claude Code's `claude -p` lanes accept `crossSessionInbound=accept` in the board's launch
  template without side effects; whether Buzz's README claim of replay-on-restart holds (helper found a 15-minute reach-back
  and no persisted cursor).
- Prior sweeps: none of this lane's tools except the three Fable/sol-advisor items appears in `docs/research/*.md`,
  `CHANGELOG.md` or `references/` (grepped by name); nothing here is a "changed since" update.
