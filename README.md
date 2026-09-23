# Orchestrate

Select and run bounded multi-agent execution strategies with durable artifacts, explicit model
routing, typed review gates, and safe recovery. Point `orchestrate` at a plan or multi-step task;
it chooses a strategy—or follows one you force—and coordinates the workers without absorbing their
implementation into the controller context.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Visual guide:** [orchestrate-skill.vercel.app](https://orchestrate-skill.vercel.app)

## Boundary

`orchestrate` owns **how work is assigned and coordinated across agents**. It does not decide which
product, design, engineering, marketing, sales, or operations work a digital product requires. A
lifecycle composer such as `digital-product` owns that dependency graph and may optionally request
multi-agent execution; neither skill depends on the other.

Do not orchestrate small, tightly coupled work that one agent can complete efficiently in one
context.

## Strategies

| Strategy | Use when |
|---|---|
| **staged** *(default)* | Mostly independent tasks need fresh implementation and ordered dual review |
| **parallel** | Independent tasks can run concurrently in isolated worktrees |
| **hierarchical** | Several domains need their own sub-orchestrators and workers |
| **team** | Workers must message, debate, or coordinate across layers |
| **workflow** | Large repeated fan-out should be held by a deterministic script |
| **loop** | Work repeats until a verifiable goal or scheduled condition is met |
| **advisor** | Expensive reasoning should be separated from cheaper execution |
| **adversarial** | A high-stakes plan needs independent challenge before execution |
| **xcli** | External coding CLIs (Codex, Grok, Cursor, agy, opencode, Hermes, Kimi, Pi) act as workers, peers, or second opinions |

Strategies are presets over `topology`, `planning`, `review`, `engine`, `models`, `isolation`,
`trigger`, and `budget`. Explicit dimension overrides win over the selected preset.

## Install

With skills.sh:

```bash
npx skills add gabros20/orchestrate-skill -g
```

Or clone and install for a specific client:

```bash
git clone https://github.com/gabros20/orchestrate-skill.git
cd orchestrate-skill
./install.sh codex
```

| Target | Destination |
|---|---|
| `codex` | `${CODEX_HOME:-$HOME/.codex}/skills/orchestrate` |
| `agents` | `~/.agents/skills/orchestrate` |
| `claude` | `~/.claude/skills/orchestrate` |
| `cursor` | `~/.cursor/skills/orchestrate` |
| `antigravity` | Gemini IDE and Antigravity CLI skill paths |
| `opencode` | `~/.config/opencode/skills/orchestrate` |
| `grok` | `~/.grok/skills/orchestrate` |
| `hermes` | `~/.hermes/skills/orchestrate` |
| `kimi` | `~/.kimi-code/skills/orchestrate` + `~/.agents/skills/orchestrate` |
| `pi` | `~/.pi/agent/skills/orchestrate` + `~/.agents/skills/orchestrate` |
| `all` | Claude, Codex, and the cross-agent path |

The installer stages a complete runtime copy before replacement and restores the prior
installation if replacement fails.

## Use

Codex explicit invocation uses `$orchestrate`:

```text
Use $orchestrate to execute plan.md with automatic strategy selection.
Use $orchestrate to run plan.md strategy=parallel workers=4.
Use $orchestrate to audit every service strategy=workflow.
Use $orchestrate to keep iterating until tests pass strategy=loop budget=cycles:10.
```

Documentation uses `/orchestrate` as shorthand. Other clients may expose a slash command,
`@orchestrate`, a skill tool, or natural-language activation.

Selection priority is:

```text
explicit strategy > saved alias > auto-triage > ask on genuine conflict
```

Saved aliases live in `skills/orchestrate/config.yaml`; explicit dimensions always override an
alias.

## Supported hosts

Claude Code is the reference host. The skill resolves six abstract primitives—dispatch, parallel,
message, ask-user, worktree, and loop—through the current client's native tools where possible,
then an external CLI, then a named solo degradation.

| Host | Native subagents | Model pinning | Important constraint |
|---|---|---|---|
| Claude Code | Deep, background, teams | Yes | Reference implementation |
| Codex | Parallel agents | Yes | Bind to the current Codex agent tools and limits |
| Cursor | Parallel/background | Yes | Headless ask-user support varies |
| Antigravity | Async agents and messaging | Inherits parent | IDE and CLI paths differ |
| opencode | Synchronous in-session | Agent-file model | External processes recover fan-out |
| Grok Build | Parallel, auto-worktree | Host-dependent | Skills load at session start |
| Hermes | Small flat pool | Host-dependent | Explicit activation may be required |
| Kimi Code CLI | `Agent`/`AgentSwarm`, built-in coder/explore/plan | Host-dependent | `-p` auto-approves every action — worktree + diff review only |
| Pi | None — xcli processes only | Per xcli process | Thinnest host: no sandbox or approvals; docs-verified, no live probe |

The runtime [host adapter](skills/orchestrate/references/shared-hosts.md) instructs the controller to
verify current tools and CLI flags rather than trust a static matrix. Kimi bindings: flag surface
live-verified against v0.28.0; end-to-end smoke run pending.

## Safety and quality model

- **No silent launch**: before the first multi-agent dispatch, the flight plan prints the
  topology, models, effort, gates, and budget, and gates on the user's approval
  (`confirm=off` skips the gate, never the print).
- **Controller does not silently implement** failed worker tasks.
- **Artifacts on disk are the interface** under `.orchestrate/`.
- **Every dispatch pins a model and a reasoning effort** rather than inheriting an accidental
  default — and verifies the pin actually landed.
- **Dual review is ordered**: spec review, then quality review.
- **Ledger before memory**: durable progress wins over recollection after resume or compaction.
- **No duplicate workers on overload**: resume or nudge the existing worker.
- **Branch and loop rails stay active**: explicit consent, cycle caps, kill switch, and open-work cap.

## The journal and the board

Every run has a spine: `.orchestrate/journal.jsonl`, an append-only, hash-chained record written
only by the controller at the steps it already performs — kickoff, flight-plan approval, each
dispatch and typed return, each review gate, each machine check, each escalation and decision,
the final gate. Everything else is derived from it and the disk: `run.md`'s resolved block, the
flight plan, the roster, the reconciliation check, the resume packet. A worker saying "done" is a
proposal; the gate is the transition.

### The board

`board` is the view — a CLI-agnostic terminal kanban you open in a pane of your own (any host,
stdlib python3). Cards are three columns, task · who · one signal; the attention strip is the
controller's "act on this" list; lanes are todo · in progress · review · done · blocked, or ones you declare.

```text
  ORCHESTRATE   payments-api @ main                                           1/5 done  ·  4m
  goal       Ship the rate-limit rewrite behind a flag
  run        parallel  ·  review dual  ·  host Claude Code
  models     worker sonnet  ·  reviewer opus
  attention  x 1 blocked/failed  ·  ? 2 pending
  mail       2 sent  ·  1 for controller  ·  1 question  ·  learn 2  ·  2 new for controller

  ╭─ IN PROGRESS ──────────────────────────────────────────────────────────────────── 2 ─╮
  │  3  Migrate the DB layer   impl-3         ? asked controller #23 · 6m · tests ok 12s │
  │  4  Ship the docs          impl-4 ·codex  > 4m                                       │
  ╰──────────────────────────────────────────────────────────────────────────────────────╯
  ╭─ REVIEW ───────────────────────────────────────────────────────────────────────── 1 ─╮
  │  2  Auth token refresh     quality-2      spec ok r1 · quality .. r1                 │
  ╰──────────────────────────────────────────────────────────────────────────────────────╯
  ╭─ DONE ─────────────────────────────────────────────────────────────────────────── 1 ─╮
  │  1  Extract rate-limit …   quality-1      4f2c91a..a7d3e10                           │
  ╰──────────────────────────────────────────────────────────────────────────────────────╯
  ╭─ BLOCKED ──────────────────────────────────────────────────────────────────────── 1 ─╮
  │  5  Integration            integ-5        x needs the vendor token — owner …         │
  ╰──────────────────────────────────────────────────────────────────────────────────────╯
```

```bash
board                                   # live board in your pane · e expand · a attention-only · r reload · q
board plan                              # the flight plan, priced from past receipts
board exec 3 --name tests -- npm test   # a check through the journal: exit + duration on the card
board check --replay                    # reconciliation: chain, gates, receipts, journal vs disk
board resume                            # the handoff's state layer, with a receipt and resume-by-id lines
board reap [--kill]                     # what the run left running (servers, watchers) · finish refuses leftovers
board postmortem                        # per-tier evidence for routing, recommend-only
```

A subprocess lane is one command — `board launch N --agent A --engine grok --model M -- brief.md`
— and journals its own exit and usage receipt; `--after N` makes it sleep in the shell until task N's
work is on disk (zero tokens), and a dependency that cannot land stops it before its engine starts;
`scripts/brief-check` names the dependencies it can see between briefs, and a lane in a read-only
sandbox degrades to a printed line instead of failing. Panels vote (`board vote`): majority or
any-deny, derived.

### Shared context

Parallel agents share one journal, not a chat. Every worker-side board call hands over what the
worker has not seen yet, under one watermark, never mid-turn, on every host (no server, no host
feature):

- **mail** — `board send` / `inbox` / `wait`: information ("I will touch your area") and questions
  (`--ask`), hard-capped so two agents can never talk instead of working; `board peers` says who
  else is working and what they own. Controller and lead mail is an instruction, peer mail is
  information. In a hierarchy authority is lineage: a sub-orchestrator that dispatches `--by`
  itself becomes its workers' lead.
- **learn** — `board learn N "…"`: one line about what a peer would otherwise re-pay (a stale
  fixture, a failed approach, an invariant), capped and deduped, handed to the worker's team at
  their next board call; a decision the controller changes mid-run reaches the workers already
  running as a record change, with its why — checked before acting.
- **memory** — `board memory` renders the run as one
  [`project-context`](https://github.com/gabros20/project-context) record (decisions with their
  why, failed attempts, learnings, verification, the frontier) so the next run, in any tool,
  starts from what this one learned. No dependency: the board prints the `ctx` command when the
  repo keeps project memory and stays silent otherwise.

```text
$ board inbox                      # what impl-3 sees at its next checkpoint
mail for impl-3:
#28 12:58 [peer impl-2] renamed src/auth/session.ts — import path moves
learned since your last check:
  #26 12:58 [peer impl-4 · fact] the docs build reads VERSION from package.json, not from the tag
record changes since your dispatch:
  #31 12:58 decision D-01 (revised) cookie auth, not header — why: browser clients keep the session
```

`install.sh` puts `board` on your PATH; every workspace also carries a zero-install copy. Existing
`.orchestrate/` folders from older versions are adopted (`board init … --resume`), never restarted.
Command reference: [docs/usage.md](docs/usage.md#the-journal-flight-plan--board--resume).

## Runtime resources

```text
skills/orchestrate/SKILL.md       activation, routing, workflow, and completion
skills/orchestrate/config.yaml    saved strategy/dimension aliases
skills/orchestrate/references/    41 flat strategy, shared, engine, and prompt references
skills/orchestrate/scripts/       workspace, brief, review-package, toolbox, and board helpers
```

All references are directly linked from `SKILL.md`; no required route depends on directory
discovery or a second-hop index.

## Repository map

```text
.codex-plugin/plugin.json  Codex plugin and release metadata
AGENTS.md / CLAUDE.md      repository and client-specific maintainer guidance
skills/orchestrate/        portable runtime skill and client metadata
evals/                     activation, traversal, output, and compression fixtures
docs/                      installation, usage, strategies, recipes, research, and designs
site/                      optional visual guide
remotion/                  visual-guide animation source
scripts/                   baseline and orchestration-specific release gates
```

## Validate

```bash
scripts/check-sync
scripts/count-skill-tokens
```

The baseline gate validates packaging, flat direct routing, reference headers and contents lists,
plugin/client metadata, runtime scripts, evaluation fixtures, and version alignment. The specialized
gate then checks byte-identical role communication blocks, honest token-cost statements, replicated
invariants, and host-layer limits.

## Documentation

- [Installation](docs/installation.md)
- [Usage](docs/usage.md)
- [Strategies](docs/strategies.md)
- [Recipes](docs/recipes.md)
- [Evaluation fixtures](evals/README.md)

## Versioning and releases

Each release synchronizes `.codex-plugin/plugin.json`, the newest `CHANGELOG.md` release, git tag
`v<version>`, and the matching GitHub Release. Runtime `SKILL.md` intentionally carries no version
or repository metadata.

## Contributing

See [AGENTS.md](AGENTS.md) for repository invariants and [CONTRIBUTING.md](CONTRIBUTING.md) for the
change and release workflow. The repository is independently versioned and remains usable without
`digital-product` or any sibling skill checkout.

## Requirements

- An Agent Skills-compatible client with either native subagents or access to a supported external
  coding CLI.
- `git` for branch/worktree isolation.
- Any selected external engine installed, authenticated, and verified with its current `--help`.

## License

[MIT](LICENSE) · Tamás Gábor ([@gabros20](https://github.com/gabros20))
