# Changelog

All notable changes to the **orchestrate** skill are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) ·
Versioning: [SemVer](https://semver.org/) — **MAJOR** = invocation grammar or strategy-contract
breaks, **MINOR** = new strategies/dimensions/aliases or new reference material that changes
behavior, **PATCH** = fixes, doc corrections, prompt tuning with unchanged behavior.

The skill's current version lives in `skills/orchestrate/SKILL.md` frontmatter (`version:`) and is
tagged in git as `v<version>`. Every release PR updates **both** plus this file.

## [Unreleased]

### Added
- `docs/research/token-optimization.md` — research record on token/context/cost optimization for
  multi-agent orchestration (caveman-style output compression, report-only verbosity contracts,
  context-window economics, proven ecosystem techniques). Research only; no skill behavior changed.
- `CHANGELOG.md` + `version:` frontmatter field — release/versioning machinery for the skill.

## [1.0.0] — 2026-07-13

### Added
- Initial public release: 9 strategies (staged, parallel, hierarchical, team, workflow, loop,
  advisor, adversarial, xcli) as presets over 8 dimensions, auto-triage, dual review gates,
  file-based handoffs (`.orchestrate/` workspace), model routing, safety rails, saved aliases.
- `skills/orchestrate/` skill tree (SKILL.md router + references + prompts + scripts + config.yaml).
- Docs (`docs/`), visual guide (`site/` → orchestrate-skill.vercel.app), skills.sh-standard
  install (`install.sh`, `npx skills add gabros20/orchestrate`).

[Unreleased]: https://github.com/gabros20/orchestrate/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/gabros20/orchestrate/releases/tag/v1.0.0
