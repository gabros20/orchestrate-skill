# xcli — external coding CLIs as workers, peers, and second opinions

Purpose: Use external coding-agent CLIs as isolated workers, peers, or second-opinion engines.

Read when:
- A selected engine is external to the current host or portability requires headless CLI processes.

Skip when:
- The host's native subagents satisfy the task without external-engine benefit.

Inputs:
- Verified CLI help, authentication state, working directory, prompt, sandbox, and output path.

Produces:
- Executed CLI command, captured output, repository diff, and engine-specific caveats.

## Contents

- Lane hardening (empty diff, spec files, timeout, no silent fallback)
- Staged-codex recipe
- Rules (all engines)
- Division-of-labor heuristic

Preset: `engine=codex|grok|cursor|agy|opencode|hermes|kimi|pi|mixed` — usually a dimension on another
strategy rather than a standalone topology (e.g. `staged engine=codex`, `adversarial
counter=codex`). Why: genuinely different capabilities (different model lineages for
cross-validation; separate subscription quotas; codex's sandbox), at the price of serialization
overhead and zero shared context — the prompt must carry EVERYTHING. xcli is also the
**portability floor**: on a host missing a native primitive, these engines recover parallel
fan-out and model pinning as background processes (`shared-hosts.md`).

**Per-engine invocation blocks** — flags, model slugs, effort enums, quirks, each with its
verified date — live one file per engine (`engine-<name>.md`, indexed with the cross-engine
session / receipt / cap map in `shared-engines.md`). Verify flags before trusting them: CLIs
drift; run `<cli> --help` once per session before scripting against it.

**Task text carries the WORKER communication block** (`shared-token-economy.md`) with
`.orchestrate/raw/` paths made absolute for the CLI's cwd — external workers narrate by default
and their stdout lands in YOUR context; the contract is the filter.

## Lane hardening (observed on a live Codex lane; generalizes to every subprocess engine)

- **An empty diff is never `complete`.** `codex exec` loads the user's `~/.codex/AGENTS.md` on
  every invocation, so a rule written for one project governs every lane on the machine; asked to
  violate it, codex correctly declines rather than silently substituting — and the run returns
  **exit 0, an empty diff, and a polite refusal in the final message**. If the exit code is 0 and
  `git diff` shows nothing changed, the status is `refused`: quote the final message verbatim,
  never record it as done (observed live 2026-08-04).
- **Declare the opt-out in the spec preamble** — state that this lane is an explicit opt-out of
  global AGENTS.md orchestration/model rules for this invocation. Belt-and-braces; it is not a
  substitute for the empty-diff check.
- **One spec file per lane, via `mktemp`** (`mktemp -t codex-spec.XXXXXX`) — never a fixed path
  (parallel lanes on one path corrupt each other), never inline shell quoting.
- **Portable timeout**: `T=$(command -v gtimeout || command -v timeout || true)` — macOS has no
  `timeout` without coreutils; when `$T` is empty, WARN that the lane is running uncapped rather
  than silently dropping the cap.
- **No silent vendor fallback.** A cross-vendor lane that quietly becomes a same-vendor lane
  defeats the reason it was chosen — fail loudly and say which engine was unavailable
  (`shared-hosts.md`: degrade, and say so).
- **`refused` is a journaled status**: `board return N --agent A --status REFUSED --msg "<final
  message verbatim>"` — the card lands in blocked with the reason, `board check` flags any xcli
  `DONE` return that carries no commits, and the roster keeps the refusal beside the attempt.
- **Launch hygiene is a rule set, not folklore** — probe flags per session, wrapper script with
  explicit redirects, prompt from a file, session id journaled and resumed by id, quota stall =
  BLOCKED + resume the same session after the reset, receipt journaled, lane capped at the
  engine (`shared-lane-hygiene.md`). Observed: three consecutive failed launches (`-a` removed,
  `resume` rejecting `--sandbox`, positional prompt ignored) cost 40 minutes and zero tokens —
  every one was a flags fact, journaled as a note.
- **Verification runs THROUGH the journal**: `board exec N --name tests -- npm test` runs the check,
  captures its log under `raw/`, journals exit code + duration, and shows it on the card
  (`tests ok 12s`); a check that ran elsewhere is journaled with `board result N --name --exit`.
  `board done` is refused over a failed check exactly as over a failed gate.

## Staged-codex recipe (`strategy=staged engine=codex`)

Per task, choose model AND effort by complexity (mechanical → cheap tier at high effort; judgment
→ strong tier) · brief written to its own spec file · session id + log journaled at dispatch ·
empty-diff check on every return, before the task reaches a review gate · usage receipt on every
return · reviews stay on the controller's engine, since cross-model review is the point. The
flight plan prints the lane's launch line pre-configured from the record (`board plan` → `lane`).

## Rules (all engines)

1. One task per launch; split big jobs. The CLI sees NOTHING of your session — brief files work
   here too: write the brief, reference nothing conversational.
2. One git worktree per concurrent run, never two engines in one tree; copy `.env*` in.
3. Runs take minutes with no timeout — background them (Claude Code `run_in_background`; other
   hosts `nohup … &`) and poll the output file; don't block the controller.
4. **Review the diff yourself** (or via your review gate) before accepting — external engines
   don't inherit your review discipline.
5. Rate limit hit → report to the user; never retry-loop against a subscription quota.
6. Auth is the user's: `codex login` / grok cookie / `claude` login / `kimi login`. Never read or copy
   credential files.
7. **Prefer a native in-host subagent when the host can pin the model you want.** A shelled-out
   CLI forfeits the host's tool loop and permission enforcement: its output is text you must
   re-trust, not a subagent running under your rails. A subprocess lane earns its place only when
   it buys something the host cannot — a model, a quota, or a primitive the host lacks.

## Division-of-labor heuristic

Claude = reasoning/architecture/review · Codex (GPT lineage) = heavy implementation + honest peer
counter · Grok = fast second opinion / search-adjacent tasks · Kimi (Moonshot lineage, K3 —
Artificial Analysis Intelligence Index 4/189 as of 2026-07-20) = the fourth vote in cross-lineage
panels and the pick for 1M-context work · Cursor/agy/opencode/Hermes = alternate workers when
quotas, sandboxing, or lineage diversity matter (agy = Gemini lineage, the third vote) · Pi =
provider-agnostic carrier with NO lineage of its own — it adds no panel vote; reach for it when it
carries a model or subscription quota no other lane offers, and contain it (no sandbox, no
approvals — `engine-pi.md`). Cross-validation: send the same review to two engines, dedup
findings, keep the union (conflicting severity → higher). Vendor-native review layers (Codex
Guardian, Claude's auto-mode classifier) are extra independent signals, never gate substitutes.
