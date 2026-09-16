# Review sweep — skill, board, engines, factories — research record

> **Status:** implemented — this review fed **v1.16.0** (design:
> [../designs/v1.16.0-checks-lanes.md](../designs/v1.16.0-checks-lanes.md)); base was v1.15.0
> @ `b88dbb1`. Review date: 2026-09-16.

*Method: controller read of `SKILL.md`, the shared/strategy references, `scripts/board`
(`load`, `header_rows`, `build_rows`, `render_plan`, `check`), `scripts/count-skill-tokens`;
five Sonnet subagents in parallel — two live `--help` probes (codex 0.154.0, claude 2.1.273,
grok 1.0.25, opencode 1.18.27, hermes 0.18.2; cursor/agy/kimi/pi docs-only), an X sweep
(xrelay, 388 tweets → 15 full reads, 2026-08-07 → 09-16), a web sweep (changelogs, repos,
papers since 2026-08-01) and a lane/stage-model survey (CI graphs, agent kanbans, TUIs). Every
load-bearing drift claim was re-run live by the controller. Raw reports: session scratchpad
`cli-probe-a.md`, `cli-probe-b.md`, `x-sweep.md`, `web-sweep.md`, `lanes-research.md`.*

## TL;DR

1. **The engine catalog has five factual errors and ~25 undocumented controller-relevant
   surfaces** (§1). Wrong today: `claude -p --max-turns` (no such flag; `--max-budget-usd` is the
   cap), `codex mcp-server` (does not exist), `-c web_search=live` (unverified; `--search` is
   top-level only, not on `exec`), Grok "sole model grok-4.6" (4.5 is listed too), Grok "`-p`
   renamed" (it is an alias of `--single`). Biggest additions: Grok `-s <uuid>` pre-pins a session
   id (kills the grep-the-store step), `grok usage`, Codex `queue --thread` (native nudge),
   `--approve-for-me`, Claude `--restricted`, opencode `stats`/`export --sanitize`, Hermes
   `insights`, `--ignore-rules`, a native `hermes kanban`.
2. **Tests and verification are invisible on the board — and on every other agent kanban** (§3).
   No tool surveyed surfaces check runs inside "in progress"; CI/PR tools give checks their own
   badge surface, not a lane. Smallest fix: a `check` event with a badge row per card; the
   composable follow-up is lanes as a *projection* of state × open-stint role, not a per-strategy
   table.
3. **Three factory ideas are worth adopting** (§2): an *offline journal replay* that re-derives
   state from the journal alone (OMA `verifyRun()`), a *governance floor* judged on the execution
   receipt without reading worker text (we have half of it in `board check`), and a *pre-flight
   cost band* from past receipts (`preflight` P50/P90) — the flight plan's missing number.
4. **Token weight sits in two catalogs**: `shared-engines.md` (2.9k tokens) and `shared-hosts.md`
   (2.5k) load whole for a one-engine run; a per-engine split saves ~2.4k per xcli controller
   context (§4). 32 reference preambles cost ~90 tokens each — minor, but the `## Contents`
   blocks duplicate headings.
5. **Skepticism preserved:** the 1,393-subagent/19-hour refactor is a self-promotional,
   unverifiable number; the Terminal-Bench "harness moved 52.8→66.5%" figure comes from a
   low-follower account; "software factory" peaked as a funding narrative the week practitioners
   pushed back on the framing. Keep positioning as an orchestration *harness*, not a factory brand.

## 1. Engine catalog — drift and additions (live unless marked docs)

| Engine | Fix (wrong today) | Add (verified, useful to a controller) |
|---|---|---|
| Claude 2.1.273 | drop `--max-turns` from the block | `--max-budget-usd` (hard $ cap per `-p` run) · `--restricted` (no Bash/WebFetch, file tools confined to `--add-dir`) · `--include-partial-messages`, `--forward-subagent-text`, `--include-hook-events` · fleet `claude stop|rm|respawn` · `claude agents --model/--effort/--permission-mode` = launch defaults · cloud: `--cloud`, `--environment`, `--from-pr`, `--teleport` |
| Codex 0.154.0 | remove `codex mcp-server`; remove `-c web_search=live` (`--search` exists top-level only, not on `exec`); sandbox enum has `danger-full-access` | `--approve-for-me` (exec/queue) · `codex queue --thread <id> --message` = native nudge into a running lane · `codex agents` (all sessions on the app-server daemon) · `codex review --base/--commit` · `codex features list` · `codex resume --all` (drops cwd filter) · `multi_agent_v2` exists but `stable false` · `app-server` is the experimental daemon (unverified as MCP) |
| Grok 1.0.25 | models: `grok-4.6` (default) **and** `grok-4.5`; `-p` is an alias of `--single`, never removed | `-s/--session-id <uuid>` pre-launch pin · `grok usage <id> [turn]` token/cost receipt · `--output-format streaming-messages-json` (Anthropic wire format — one parser serves two engines) · `grok trace/export/dashboard` · `grok worktree`, `--restore-code` · `grok agent headless|serve|leader` |
| opencode 1.18.27 | none | `opencode stats --days N --models` (cost receipts) · `export <id> --sanitize` (audit) · `acp` · `pr <n>` / `github` lane · `agent create/list`, `session list` |
| Hermes 0.18.2 | "OpenAI-compatible server + JSONL batch runner" is stale (`serve` = JSON-RPC/WS gateway; `proxy` forwards *to* providers; no `batch`) | `--ignore-rules` / `--ignore-user-config` / `--safe-mode` (hermetic lane) · `--max-turns` (chat only, default 90) · `--yolo` (NEVER) · `hermes insights --days N` · `sessions export/stats/prune` · `mcp serve`, `acp` · `prompt-size --json` (fixed-prompt budget, offline) · **`hermes kanban`**: SQLite board, `task_runs` with separate *status* and *outcome*, `dispatch --failure-limit N` auto-block, `swarm goal --worker --verifier --synthesizer`, event kinds `completed/blocked/gave_up/crashed/timed_out`, `heartbeat --note` |
| Cursor (docs) | ask-user "auto-skip" gotcha may be superseded by `-p --mode plan|ask` — mark *re-verify live* before dropping the ACP workaround | `--output-format stream-json`, `--stream-partial-output` · untrusted workspaces fail closed without `--trust`/`--force` · `--worktree-base` · `agent persist [attach]` · `--continue` |
| agy (docs) | "rumor tier" is over — official headless docs list the surface | `--output-format text|json|stream-json`, `--json-schema`, `--effort low|medium|high`, `--conversation <id>`, `--print-timeout` (5m default), CI auth `modelProvider: gemini` + `GEMINI_API_KEY` (≥1.1.13) |
| Kimi (docs) | agent-core-v2 default (≥0.33); subagent pool **on by default** — "don't swarm" moves from advice to the default state; quota now fails fast (0.30+) — "no headless quota signal" needs re-verification | `print_background_mode = "steer"`; `stream-json` honors `Retry-After` |
| Pi (docs) | none (0.85.1) | reaches `gpt-6-astra` via Codex subscription — same flagship as Codex, no new lineage |

**Lane hygiene generalisations** (`shared-lane-hygiene.md`): rule 4 → *pre-pin the id when the
engine allows* (Grok `-s`, Claude `--session-id`), grep the store only otherwise; rule 7 receipt
list → Grok `usage`, opencode `stats`/`export`, Hermes `insights`/`--usage-file`, Codex
`turn.completed.usage`; new rule 8 *cap the lane at the engine* (`--max-budget-usd`, Hermes
`--max-turns`, agy `--print-timeout`, Grok `--max-turns`); new rule 9 *hermetic lane flags*
(`claude --bare`, `pi -nc`, `hermes --ignore-rules`, Codex spec-preamble opt-out) — the
AGENTS.md-refusal class of failure, prevented instead of detected; nudge binding per engine
(Claude SendMessage · Codex `queue --thread` · Grok `-r <id>` · opencode `-s` · Hermes `--resume`).

## 2. Factory / harness ideas (web + X), mapped

| Mechanism | Source | Have? | Smallest adoption |
|---|---|---|---|
| Offline journal replay — re-derive every state from the journal alone, cold | OMA `verifyRun()` | partial (chain check) | `board check --replay`: rebuild state from `journal.jsonl` only, diff against the disk-derived view, print `inconclusive` for archived artifacts, never a false fail |
| Governance floor judged on the receipt, output-blind | OMA | partial | `check` rules: done with review≠off and no reviewer stint · quality gate opened before spec ok · xcli DONE without a receipt · 3rd implementer attempt without an escalate event |
| Pre-dispatch cost band (P50/P90 by role from local history) | `preflight` | no | `board plan` reads `archive/*/journal.jsonl` returns → per-role token quantiles → `budget ~9 agents · tokens est 180k–420k (3 runs)`; fallback = pack multipliers × tasks |
| Cost per accepted outcome, not raw tokens | soujikomanager (X) | no | `board finish` prints `tokens/done-task`; resume receipt carries it |
| Vendor-native gates layered on ours (Codex Guardian, Claude auto-mode classifier) | changelogs | no doc | one line each in the engine block: an extra independent signal, never a substitute for spec/quality gates |
| Nested-subagent token rollup (Codex) | changelog 0.151 | no doc | receipts rule: journal the *root* `turn.completed.usage` only; child tokens are inside it |
| Postmortem-driven routing (one change, repeated evidence, never off one success) | BTFR loop (X) | no | `board postmortem` (or `resume` section): per role requested→observed, attempts, gate rounds, tokens; feeds `prompt-evolve.md` |
| Bash-first tool interface (typed catalogs −21..24 pts, +19–72% tokens) | Microsoft/TheAgentCompany via X | no | one line in `prompt-implementer.md` |
| Auto-block after N failed attempts | Hermes kanban `--failure-limit` | no | `attention` `!` on attempt ≥3 (routing rule 4 hysteresis made visible) |
| Native task dashboards (`codex agents`, `claude agents`, `grok dashboard`) | probes | yes — `board` is engine-agnostic | none |
| Shared cross-engine channel (Radio/Caravel) | X | partial | `board note` doubles as a mailbox when a host lacks team messaging; document, don't build |
| Multi-approver gating (majority + any-deny) | Campfire (X) | partial | `panel:N`/`consensus:N` already generalise; low priority |

## 3. The board: lanes, checks, projection

**Today:** `COLUMNS` is a fixed list; a card's state is `max(candidates)` over disk mtimes and
journal events; a stint's `--role` is journaled but never changes the lane; no event exists for
running a script or a test. Everywhere surveyed (GitHub Actions, GitLab, Argo, Temporal/Prefect/
Dagster) a *small canonical run state* sits under a *pipeline-generated stage graph*, and checks
get their own surface (GitHub PR Checks: grouped rows, duration, rerun). Agent kanbans
(vibe-kanban, openkanban, docker-agent-board) keep fixed generic lanes and hide tests.

**Recommendation — two steps, no invariant changes:**

1. **`check` as a journal event with a badge row** (ship first). `board exec N --name tests --
   npm test` runs the command *through* board: journals `check` start/finish with exit code,
   duration and a `raw/check-N-<name>.log` path; `board check-result N --name … --exit …` for
   checks run elsewhere. Card meta gains `tests ok 12s · check-sync fail`; a failed check is an
   `x` in attention; header gets `checks 3/4 ok`. Same rendering path as `gate_entries`.
2. **Lanes as a projection, declared or defaulted** (follow-up). `board init --lanes
   todo,implement,verify,review,integrate,done` stored as a run dim (like `strategy`); the lane
   of a card = f(canonical state, open-stint role): implementer→implement, verifier→verify,
   *reviewer→review, integrator→integrate, blocked/done unchanged. Omitted → today's five. No
   per-strategy table, so it cannot drift from `board plan`; `--selftest` asserts both the
   default and a declared set.

**Pre-configured → run → projected → journaled:** `board dispatch` should also take
`--session <id> --cmd-file raw/lane-N.sh --log raw/lane-N.jsonl` so the roster shows the
session id and log path, the expanded card shows the exact command, and `board resume` prints
the engine-specific *resume-by-id* line instead of telling the controller to go and find it.

## 4. Skill token efficiency (caveman lens: input side, per-run)

- `shared-engines.md` 2,922 tokens + `shared-hosts.md` 2,549 load whole for any xcli dispatch.
  Split into `engine-<name>.md` (≈300–500 each, flat, each linked from SKILL.md to satisfy the
  lint) and keep `shared-hosts.md` to detection + capability matrix + ladder (~1.2k) with the
  per-host quirks moved next to their engine. Saves ≈2.4k tokens per xcli controller context.
- `shared-token-economy.md` 2,902 tokens is routed "every dispatch"; the three blocks are ~700 of
  it — split the blocks from the anatomy essay (already deferred in v1.15; byte-identity gates make
  it a careful move).
- 32 references × (Purpose / Read when / Skip when / Inputs / Produces / Contents) ≈ 90 tokens
  each; the `Contents` lists duplicate the headings — drop them (≈40 tokens × 32).
- SKILL.md 2,370 tokens: fine.

## 5. Proposed shape of the next release (v1.16.0 — "checks, receipts, lanes")

1. Catalog + hygiene fixes (§1) — facts, do first; re-verify Cursor `--mode ask` and Kimi quota
   live before changing those two rows.
2. Board: `check` event + `board exec`, dispatch `--session/--cmd-file/--log`, resume prints
   resume-by-id, `plan` cost band from archived receipts, `finish` cost-per-outcome, `check
   --replay`, governance-floor rules, attempt≥3 attention.
3. Structure: engine split, Contents removal, bash-first line, vendor-gate + rollup notes.
4. Later: `--lanes` dim, `board postmortem`, nested child journals (still deferred).
