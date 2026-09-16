# Engines — the per-CLI catalog (index)

Purpose: Route an external-CLI dispatch to its engine block and give the cross-engine facts every lane shares.

Read when:
- A dispatch shells out to an external engine, or a pin/flag/slug for one needs verifying.

Skip when:
- The run uses only the host's native subagents.

Inputs:
- Engine choice, task text, working directory, sandbox and approval posture, and output path.

Produces:
- The one engine file to read, plus the session / receipt / cap / hermetic-flag map that keeps lanes honest.

One file per engine, so a one-engine run loads one block (~400 tokens), not the catalog:
[Codex](engine-codex.md) · [Grok](engine-grok.md) · [Claude](engine-claude.md) ·
[Cursor](engine-cursor.md) · [Antigravity](engine-agy.md) · [opencode](engine-opencode.md) ·
[Hermes](engine-hermes.md) · [Kimi](engine-kimi.md) · [Pi](engine-pi.md). Rules and lane
hardening live in `strategy-xcli.md`; the launch/resume/quota discipline every subprocess engine
shares in `shared-lane-hygiene.md`. **Verify flags before trusting them** — `<cli> --help` once
per session; every verified date is the day the fact was checked, not a guarantee it still holds.

## The cross-engine map (what the journal wants from every lane)

| Engine | Session id | Resume by id | Receipt | Lane cap | Hermetic flags |
|---|---|---|---|---|---|
| Codex | `thread.started` in `--json` | `codex exec resume <id> - < nudge.md` | `turn.completed.usage` (root turn only) | quota + `--worktree` | spec-preamble opt-out of `~/.codex/AGENTS.md` |
| Grok | `-s $(uuidgen)` pre-pinned | `grok -r <id> --prompt-file` | `grok usage <id>` | `--max-turns` | `--no-subagents` |
| Claude | `--session-id $(uuidgen)` | `claude -p --resume <id>` | final `result` event | `--max-budget-usd` | `--bare`, `--restricted` |
| Cursor | latest only | `cursor-agent --continue` | — (docs) | — | `--trust` fail-closed |
| Antigravity | `--conversation <id>` | `agy -p --conversation <id>` | — (docs) | `--print-timeout` | — |
| opencode | printed session id | `opencode run -s <id>` | `opencode stats`, `export --sanitize` | — | `--agent <pinned file>` |
| Hermes | `--pass-session-id` | `hermes -z … --resume <id>` | `--usage-file`, `insights` | `chat --max-turns` | `--ignore-rules`, `--safe-mode` |
| Kimi | session store | `kimi -S <id>` | — (`/usage` TUI-only) | — | instruct: no swarm |
| Pi | `--session <id>` | `pi --session <id>` | — | — | `-nc --no-extensions` |

`board launch N --agent A --engine <e> --model M [--effort E --owns … --extra='<approval flags>'] --
spec.md` does the whole row for you — wrapper, session pin/capture, dispatch, detached start, `exit`
and `receipt` events when it ends (`--dry-run` to look first). By hand: journal the session id at
dispatch (`board dispatch … --session <id> --log raw/lane-N.jsonl`) or at return (`--session`) —
`board resume` then prints the engine's resume line for every open lane instead of sending the
next controller to the session store. Receipts go in `board return
--tokens`; the flight plan's cost band and `board postmortem` are only as honest as those receipts.

## Division of labor

Claude = reasoning/architecture/review · Codex (GPT lineage) = heavy implementation + honest peer
counter · Grok = fast second opinion / search-adjacent tasks · Kimi (Moonshot lineage) = the
fourth vote in cross-lineage panels and the pick for 1M-context work · Antigravity = Gemini
lineage, the third vote · Cursor/opencode/Hermes = alternate workers when quotas, sandboxing or
lineage diversity matter · Pi = provider-agnostic carrier with NO lineage of its own — reach for
it when it carries a model or subscription quota no other lane offers, and contain it.
Cross-validation: send the same review to two engines, dedup findings, keep the union
(conflicting severity → higher). `REFUSED` is a status, not a failure to hide (`strategy-xcli.md`).
