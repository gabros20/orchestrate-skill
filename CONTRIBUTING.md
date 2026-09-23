# Contributing

Improve strategy selection, dispatch contracts, host bindings, safety, review gates, or measurable
coordination efficiency without absorbing domain workflows or digital-product lifecycle logic.

## Pull-request checklist

1. Update the smallest owning runtime file and every deliberately replicated invariant.
2. Preserve byte-identical communication blocks in the prompt templates assigned to each role.
3. Add or update activation, traversal, output, and regression fixtures affected by the change.
4. Execute representative runtime scripts when their behavior changes.
5. Run:

   ```bash
   scripts/check-sync
   scripts/count-skill-tokens
   ```

6. Update README/user docs when the public workflow changes and `AGENTS.md`/`CLAUDE.md` when
   repository invariants change.
7. Record user-visible behavior in `CHANGELOG.md`.

Use semantic versioning. Start a release with `scripts/bump <version>` (VERSION, the board's constant,
plugin.json), then write the `## [<version>]` entry and the board's `MIGRATIONS` line — `none` when
additive, `action` when a run started on an older release must do something (it becomes a `board check`
finding until `board version --ack`). Release with `scripts/release <version>` (`--dry-run` first): it refuses
unless the tree is clean on a feature branch, `scripts/check-sync` passes, `CHANGELOG.md` has the
`## [<version>]` entry and `.codex-plugin/plugin.json` matches, and the tag does not exist — then
pushes, opens and merges the PR, tags `v<version>`, creates the GitHub Release from the changelog
section and reinstalls every local copy (`./install.sh all`). It stops at the first failing step;
never release by hand-chaining those commands. Runtime `SKILL.md` contains no version metadata.
