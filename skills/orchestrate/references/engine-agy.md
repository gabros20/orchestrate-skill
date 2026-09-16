# Antigravity CLI (`agy -p`) — engine block

Purpose: Provide the documented headless surface and CI auth for Antigravity (Gemini lineage) lanes.

Read when:
- A dispatch shells out to `agy`, or a cross-lineage panel needs the Gemini vote.

Skip when:
- No Antigravity lane is planned.

Inputs:
- The brief, cwd, model, effort, output format, and a conversation id for resume.

Produces:
- A stream-json lane with per-call effort and a resumable conversation.

Docs-verified 2026-09-16 (antigravity.google/docs/cli/headless; not installed here) — probe
`agy --help` before scripting; model slugs and whether `--sandbox` is OS-level are unverified.

```bash
agy -p --cwd /path/to/repo --model <slug> --effort high --output-format stream-json \
  --print-timeout 10m "$(cat spec.md)" > events.jsonl
agy -p --conversation <id> "<nudge>"           # resume by conversation id (-c/--continue = last)
```
- `--output-format text|json|stream-json`, `--input-format`, `--json-schema`, `--effort
  low|medium|high`, `--agent`, `--sandbox`, `--print-timeout` (default 5m — the lane cap),
  `--dangerously-skip-permissions` (leave off). CI auth: `modelProvider: "gemini"` +
  `GEMINI_API_KEY` runs without interactive sign-in (≥1.1.13, 2026-08-14).
- Interactive `agy` is orchestration-strong (async subagents to depth 10, any-to-any
  `send_message`, per-subagent worktrees) but subagents inherit the parent model — for tier
  separation pin the model per PROCESS. IDE and CLI use different global skill dirs
  (`~/.gemini/config/skills` vs `~/.gemini/antigravity-cli/skills`); first skill activation may
  show a consent prompt.
