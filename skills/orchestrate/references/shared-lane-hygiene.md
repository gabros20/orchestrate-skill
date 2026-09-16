# Lane hygiene — launching, resuming and recovering subprocess engines

Purpose: Keep every external-CLI lane launch, resume and quota recovery honest and cheap, on any engine.

Read when:
- Any external engine is about to be launched, resumed, or has stalled on a quota, timeout, or flags error.

Skip when:
- The run dispatches only native in-host subagents.

Inputs:
- The engine's `--help` output for this session, the brief file, the journal, and the engine's session store path.

Produces:
- A launch that cannot silently misfire, a resume that hits the cached session, and a journaled stall.

Observed 2026-09-15/16 on a live Codex lane; each item generalizes to any subprocess engine.
1. **Probe flags first, per session** — `<cli> --help`, `<cli> <sub> --help`. Codex dropped `-a`
   from `exec` between 0.144 and 0.149; Grok renamed `-p` to `--single` and grew
   `--reasoning-effort`; sub-commands (`resume`) carry a NARROWER flag set than the main command.
2. **Wrapper script, not a one-liner** — put the launch, its redirects and `echo "exit=$?"` in a
   file and run THAT in the background; a background shell can silently drop redirects, and a
   lane that prints "Reading prompt from stdin…" into the wrong file is indistinguishable from a
   hung one.
3. **Prompt from a file** (`- < spec.md`, `--prompt-file`, `-f`); positional prompts + redirected
   stdin behave differently per engine and per sub-command (Codex `resume` ignores the positional).
4. **Resume by explicit id, never "last"** — `--last`/`-c continue` are cwd-scoped and any probe
   run in the same repo since (a model check, a cheap ping) hijacks them. Find the id in the
   engine's session store (`shared-hosts.md` table) by grepping the brief's title.
5. **A quota/rate-limit stall is a BLOCKED return with a reset time**, journaled
   (`board return --status BLOCKED --msg "quota; resets <t>"`), then a *resume of the same session*
   after the reset — the primed context is cached (97% cache hits observed), a fresh launch
   re-pays it. Never retry-loop.
6. **Journal every launch and every failed launch** (`board dispatch`, `board note`): three
   failed launches in a row are a flags problem, not a model problem.
7. **Capture usage** where the engine offers it (Codex `--json` `turn.completed.usage`, Hermes
   `--usage-file`, Claude `stream-json` usage) and journal it — budgets need receipts.

