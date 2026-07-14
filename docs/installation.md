# Installation

How to get `/orchestrate` running, confirm it's registered, update it, and remove it. `orchestrate`
is a plain [Agent Skills](https://agentskills.io)-format skill — a directory with a
`SKILL.md` — so any agent that reads that format can use it. This guide targets Claude Code
(the reference host) and notes the other hosts' paths where they differ; the per-host capability
matrix lives in the README's "Supported agents" section and
`skills/orchestrate/references/shared/hosts.md`.

## Prerequisites

- `git` — the skill uses `git worktree` for isolation (`strategy=parallel`, `isolation=worktree`)
  and expects a git repo for branch-first work.
- An Agent Skills host: [Claude Code](https://claude.com/product/claude-code) (reference), or
  Codex CLI / Cursor CLI / Antigravity / opencode / Grok Build / Hermes.
- Optional, only if you plan to use `engine=codex|grok|cursor|agy|opencode|hermes`: that CLI
  installed and on `PATH`, logged in. See [Optional: external engines](#optional-external-engines-codexgrok) below.

## Install (pick one)

### 1. skills.sh ecosystem

If you already use the [skills.sh](https://skills.sh) registry:

```bash
npx skills add gabros20/orchestrate@orchestrate -g
```

The `-g` installs it globally (available in every project); drop it to install into the current
project only.

### 2. Clone + installer script

```bash
git clone https://github.com/gabros20/orchestrate && cd orchestrate
./install.sh claude   # or: codex | cursor | antigravity | opencode | grok | hermes | agents | all
```

`install.sh` takes one argument (default `claude` if omitted):

| Argument | Installs to |
|---|---|
| `claude` | `~/.claude/skills/orchestrate/` |
| `codex` / `agents` | `~/.agents/skills/orchestrate/` (the cross-agent standard path — Cursor, opencode, Copilot, Amp read it too) |
| `cursor` | `~/.cursor/skills/orchestrate/` |
| `antigravity` | `~/.gemini/config/skills/` (IDE) **and** `~/.gemini/antigravity-cli/skills/` (agy) |
| `opencode` | `~/.config/opencode/skills/orchestrate/` |
| `grok` | `~/.grok/skills/orchestrate/` (Grok Build also reads `~/.claude/skills` directly) |
| `hermes` | `~/.hermes/skills/orchestrate/` (Hermes has no confirmed project-level dir; invoke explicitly with `/orchestrate`) |
| `all` | `claude` + `agents` — covers most hosts without littering every vendor dir |

It's a straight copy — `rm -rf <dest>` then `cp -R skills/orchestrate <dest>` — so re-running it is
also how you update (see [Updating](#updating) below). No other arguments are accepted; anything
else prints usage and exits 1.

### 3. Manual copy

```bash
cp -R skills/orchestrate ~/.claude/skills/orchestrate
```

Equivalent to the installer's `claude` target — use this if you want the skill under a different
name, or if you're vendoring it into a monorepo's own skills directory instead of `~/.claude/skills`.

## Verifying it registered

Claude Code loads skills from `~/.claude/skills/*/SKILL.md` at session start, keyed by the
frontmatter `name` field. After installing:

1. Start a **new** Claude Code session (skills already-running sessions won't pick up a fresh
   install).
2. Type `/orchestrate` — it should be offered as a slash command. You can also just describe the
   task in the trigger phrases from the frontmatter description ("orchestrate this", "run this plan
   with subagents", "fan out agents", "goal loop", "agent swarm") and Claude Code should invoke the
   skill on its own.
3. If neither works, confirm the file exists and has valid frontmatter:
   ```bash
   head -5 ~/.claude/skills/orchestrate/SKILL.md
   ```
   You should see `name: orchestrate` and a `description:` line. A missing or malformed
   frontmatter block is the usual reason a skill silently fails to register.

For the other hosts, registration is governed by each CLI's own skill-discovery mechanism —
confirm the directory and `SKILL.md` exist, then note the per-host invocation differences:
opencode invokes skills via its `skill` tool (no slash form); Gemini-lineage hosts may show a
one-time consent prompt on first activation; Grok Build loads skills at session start only (start
a new session after installing); Hermes requires explicit `/orchestrate` (no description
auto-trigger). Quirk list: `skills/orchestrate/references/shared/hosts.md`.

## Updating

There's no separate update command — re-run whichever install path you used:

```bash
# clone + installer
cd orchestrate && git pull && ./install.sh claude

# skills.sh
npx skills add gabros20/orchestrate@orchestrate -g

# manual
cp -R skills/orchestrate ~/.claude/skills/orchestrate
```

Each of these overwrites the installed copy in place (`install.sh` does `rm -rf` first), so there's
nothing to reconcile — just make sure you're pulling the latest source before you re-copy it.

## Uninstalling

```bash
rm -rf ~/.claude/skills/orchestrate      # Claude Code
rm -rf ~/.agents/skills/orchestrate      # Codex, if installed there
```

Uninstalling doesn't touch any repo's `.orchestrate/` workspace (run ledgers, briefs, reports) —
that's per-project state, not part of the skill install. Delete it separately (`rm -rf
.orchestrate/`) if you want it gone too.

## Optional: external engines (codex/grok)

Needed only if you plan to dispatch work with `engine=codex|grok|cursor|agy|opencode|hermes`,
`engine=mixed`, or the `xcli` strategy (see [strategies.md](strategies.md#xcli) and
[usage.md](usage.md#invocation-grammar)).

| Engine | Install | Auth | Notes |
|---|---|---|---|
| `codex` | `codex` CLI on `PATH` | `codex login status` — not logged in → run `codex login` | Most script-friendly; sessions in `~/.codex` |
| `grok` | `grok` CLI on `PATH` | cookie-based session; run once interactively to authenticate | Approval is all-or-nothing (`--always-approve`); sessions in `~/.grok/sessions` |
| `cursor` | `cursor-agent` on `PATH` | interactive login once | Headless ask-user is broken — human-gated work needs ACP or interactive |
| `agy` | `agy` on `PATH` | keyring/OAuth (interactive) | `agy -p` confirmed; other flags under-documented — probe `agy --help` first |
| `opencode` | `opencode` on `PATH` | provider keys via its config | `opencode run` one-shots; parallel via multiple processes or `opencode serve` |
| `hermes` | `hermes` on `PATH` | its own config | `hermes -z` one-shots; pin models per process (in-agent pinning is broken upstream) |

`orchestrate` never reads or copies credential files for either CLI — auth is always the user's,
done outside the skill. CLI flags drift between versions; run `codex --help` / `grok --help` once
per session before scripting against either, per `references/strategies/xcli.md`.

Without either CLI installed, every other strategy and `engine=claude` (the default) works with no
extra setup — external engines are additive, not required.
