# Lane hygiene — launching, resuming and recovering subprocess engines

Purpose: Keep every external-CLI lane launch, resume and quota recovery honest and cheap, on any engine.

Read when:
- Any external engine is about to be launched, resumed, nudged, or has stalled on a quota, timeout, or flags error.

Skip when:
- The run dispatches only native in-host subagents.

Inputs:
- The engine's `--help` output for this session, the brief file, the journal, and the engine's session id.

Produces:
- A launch that cannot silently misfire, a resume that hits the cached session, a journaled stall, a receipt.

Observed 2026-09-15/16 on live Codex lanes and re-probed across nine engines (`shared-engines.md`
map); each item generalizes to any subprocess engine.
1. **Probe flags first, per session** — `<cli> --help`, `<cli> <sub> --help`. Codex dropped `-a`
   from `exec` between 0.144 and 0.149 and never had `mcp-server`; Claude `-p` has no
   `--max-turns`; sub-commands (`resume`) carry a NARROWER flag set than the main command.
2. **Wrapper script, not a one-liner** — put the launch, its redirects and `echo "exit=$?"` in a
   file and run THAT in the background (`board dispatch … --cmd-file raw/lane-N.sh`); a background
   shell can silently drop redirects, and a lane that prints "Reading prompt from stdin…" into the
   wrong file is indistinguishable from a hung one.
3. **Prompt from a file** (`- < spec.md`, `--prompt-file`, `-f`, `@spec.md`); positional prompts +
   redirected stdin behave differently per engine and per sub-command (Codex `resume` ignores
   the positional).
4. **Pin or capture the session id, then resume by id — never "last".** Pre-pin where the engine
   allows (Grok `-s $(uuidgen)`, Claude `--session-id`), else read it from the first event
   (Codex `thread.started`) — and journal it (`board dispatch --session`, or `board return
   --session`). `--last`/`-c continue` are cwd-scoped and any probe run in the same repo since (a
   model check, a cheap ping) hijacks them; `board resume` prints the resume-by-id line per lane.
5. **A quota/rate-limit stall is a BLOCKED return with a reset time**, journaled
   (`board return --status BLOCKED --msg "quota; resets <t>"`), then a *resume of the same session*
   after the reset — the primed context is cached (97% cache hits observed), a fresh launch
   re-pays it. Never retry-loop.
6. **Journal every launch and every failed launch** (`board dispatch`, `board note`): three
   failed launches in a row are a flags problem, not a model problem.
7. **Capture the receipt** where the engine offers one — Codex `turn.completed.usage` (the root
   turn only: nested subagent tokens already roll up into it), Grok `grok usage <id>`, Claude's
   final `result` event, Hermes `--usage-file`, opencode `stats`/`export` — and journal it
   (`board return --tokens`): the flight plan's cost band and `board postmortem` read nothing else.
8. **Cap the lane at the engine, not only at the controller** — Claude `--max-budget-usd`, Grok
   `--max-turns`, Hermes `chat --max-turns`, Antigravity `--print-timeout`, plus the portable
   `timeout`/`gtimeout` wrapper (`strategy-xcli.md`); an uncapped lane is a budget with no floor.
9. **Hermetic lane flags** keep global config out of a lane: Claude `--bare`/`--restricted`, Pi
   `-nc --no-extensions`, Hermes `--ignore-rules`/`--safe-mode`, Codex spec-preamble opt-out of
   `~/.codex/AGENTS.md` — the refusal class of failure prevented, not detected.
10. **Nudge binding per engine** (monitoring rule 2, ONE nudge after the disk check): Claude Code
    SendMessage · Codex `codex queue --thread <id> --message` · Grok `-r <id>` · opencode `-s <id>` ·
    Hermes `--resume <id>` · Kimi `-S <id>` · Pi `--session <id>` — always the journaled id.
