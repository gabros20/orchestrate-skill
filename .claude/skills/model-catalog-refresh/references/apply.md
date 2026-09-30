# Apply a refresh to the skill — file by file

Only rows the evidence moved change. Every changed cell keeps its grade and gets the run's date.

| What moved | Edit |
|---|---|
| any catalog number, id, pick, effort note | `skills/orchestrate/references/shared-model-catalog.md` — the row, and `As of **YYYY-MM-DD**` |
| a role's default (harness · model · effort) | `skills/orchestrate/scripts/board` → `CATALOG` (cross-harness, Claude-only) and `CATALOG_AS_OF` |
| a default model string the selftest asserts | board `selftest()` — grep `default_model(` and `gpt-`/`opus` literals in the catalog test block |
| a model id, flag, effort enum, context, CLI version | the engine block: `references/engine-<cli>.md` (and its "Live-verified" stamp) |
| an effort enum a lane launch must refuse | board `GROK_EFFORT` / `CODEX_EFFORT` / `CLAUDE_EFFORT` + selftest |
| the tier table's example defaults | `references/shared-model-routing.md` tier table (keep rule numbers; append, never renumber) |
| the architect / final-gate default | follows `CATALOG["architect"]`; check `prompt-architect.md` and `shared-replan.md` wording |
| a headline a first-time visitor should know | `site/llms.txt` one line; the site only if a posture or harness appears or disappears |
| the research record | `docs/research/model-selection/refresh-DATE/SYNTHESIS.md` (changes table first), and one line in `docs/research/model-selection/README.md` pointing to it |

## Release

```bash
python3 .claude/skills/model-catalog-refresh/scripts/check_catalog.py   # board CATALOG ↔ catalog reference
skills/orchestrate/scripts/board --selftest                              # string assertions follow the catalog
scripts/bump X.Y.Z                                                       # patch: numbers only · minor: a pick or harness changed
# CHANGELOG "## [X.Y.Z]" (what changed, with old → new) and the board MIGRATIONS line:
#   ("X.Y.Z", "none", "catalog refresh DATE: <the picks that changed>")
scripts/check-sync && scripts/release X.Y.Z
```

A pick change is `none` in MIGRATIONS: running lanes keep the model they were dispatched with; only new
dispatches take the new default. A removed or renamed model id that a run may still pin is `action`
("repin <old> → <new>").
