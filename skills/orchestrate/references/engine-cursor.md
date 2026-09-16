# Cursor (`cursor-agent -p`) — engine block

Purpose: Provide the headless launch and containment facts for Cursor CLI lanes.

Read when:
- A dispatch shells out to `cursor-agent`, or Cursor is the controller host.

Skip when:
- No Cursor lane is planned.

Inputs:
- The brief as a spec file, model, worktree name, trust posture, and output path.

Produces:
- A stream-json lane in its own worktree; human gates handled outside bare `-p`.

Docs-verified 2026-09-16 (not installed here) — probe `cursor-agent --help` before scripting.

```bash
cursor-agent -p --model <id> --output-format stream-json --stream-partial-output \
  --worktree lane-N "$(cat spec.md)" > events.jsonl
cursor-agent --continue                        # resume latest; ACP (`cursor-agent acp`) for real blocking asks
```
- Headless GOTCHA (recorded 2026-08): in bare `-p` the ask-user tool auto-received "skipped by
  user". Docs now show `-p --mode plan|ask` with presented questions — **re-verify live** before
  dropping the ACP workaround; until then anything human-gated runs through ACP or interactively.
- Untrusted workspaces fail closed without `--trust`/`--force` (`--force`/`--yolo` = one alias pair
  auto-approving trust + MCP + commands — leave off). `--worktree-base` picks the base ref;
  `agent persist [attach]` reconnects to a background agent.
- As CONTROLLER: `.cursor/agents/*.md` subagents give parallel + background dispatch with per-agent
  `model:` (depth 1); custom slash commands don't work in the CLI — invoke the skill.
