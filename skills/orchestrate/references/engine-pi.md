# Pi (`pi -p`) — engine block

Purpose: Provide the launch, thinking, session and containment facts for Pi (provider-agnostic carrier) lanes.

Read when:
- A dispatch shells out to `pi` to reach a model or subscription quota no other lane offers.

Skip when:
- Another lane already carries that lineage — a Pi lane adds no panel vote of its own.

Inputs:
- The brief file, `provider/model`, thinking level, trust flags, and output mode.

Produces:
- A JSONL lane with no sandbox and no approvals — contained externally.

Docs-verified 2026-09-16 (0.85.1; flags unchanged since 0.85.0) — no live install; probe `pi --help`.

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent   # auth: interactive /login or provider env key
cd /path/to/repo && pi -p -nc --no-session --model <provider>/<model> --thinking high \
  --mode json @spec.md "Execute this brief." </dev/null > events.jsonl
pi --session <path|id> -p "<nudge>"           # resume by id (-c = most recent); --fork branches
```
- Provider-agnostic — it brings NO lineage of its own (`--model <provider/id>`, `sonnet:high`
  shorthand, `--list-models`); now also reaches `gpt-6-astra` via a Codex subscription. Effort is
  a first-class flag: `--thinking off|minimal|low|medium|high|xhigh|max`.
- `--mode json` emits JSONL (session header first; the authoritative message arrives in
  `message_end`); `--mode rpc` is a JSON-RPC surface.
- **No sandbox and no approval prompts AT ALL**; headless modes bypass even the project-trust
  prompt. Worktree + diff review is the MINIMUM containment; a container for untrusted work.
- Loads `AGENTS.md`/`CLAUDE.md` by default — `-nc` (`--no-context-files`) + `--no-extensions` for a
  hermetic lane; `defaultProjectTrust` in `~/.pi/agent/settings.json`. Sessions under
  `~/.pi/agent/sessions/` (cwd-organized). No built-in MCP, subagents or background bash — a true
  leaf that will not swarm.
