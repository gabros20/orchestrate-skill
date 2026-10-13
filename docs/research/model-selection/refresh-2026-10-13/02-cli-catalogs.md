# Lane 2 — Live CLI catalogs (research-2), 2026-10-13

Probed 2026-10-13 from 12:25 CEST on one macOS arm64 machine. Cheap listing commands only: no model turn, no prompt
sent, no auth file read (login modes come from each CLI's own status command; `hermes status` masks its keys and none are
copied here). Grades: [L] local probe · [V] vendor doc · [P] community registry (models.dev, behind opencode's numbers).
Raw logs stayed in the lane scratchpad; every excerpt below is verbatim.

## Summary

- **Changes vs catalog.**
  (1) claude · Haiku: the `haiku` alias now resolves to Haiku 5.5, so the catalog's Claude-only `haiku` picks and its
  "Haiku 4.5 not competitive [B]" evidence no longer describe the model the alias serves. Baseline row
  `claude-haiku-4-5 · 200K · 1 / 5 · no effort` becomes `claude-haiku-5-5 · 1M native · 0.10 / 0.50 up to a 100K-token
  prompt, 0.50 / 2.50 above · 128K max output · effort low–max, default medium · image input (models.dev also lists pdf)`
  [V S2; L S3 for ids, alias map and price table; P S7 for modalities]. Lane 1's vendor reading (01-vendor-specs.md) gives
  the same 1M, 128K, 0.10 / 0.50 and 0.50 / 2.50 tiers and a 2026-10-07 release [V, lane 1]. Haiku 4.5 stays the alias target only on
  Bedrock, Vertex, Foundry and Claude Platform on AWS [V S2].
  (2) claude · effort defaults, absent from the catalog: Opus 5.5, Sonnet 5.5 and Haiku 5.5 default to `medium`, Fable 5.1
  to `high`, Opus 4.7 to `xhigh` [V S2; L S3]. Every "alias @ effort" pick needs an explicit `--effort`.
  (3) codex · efforts: `ultra` exists only on gpt-6.1-sol, gpt-6-astra, gpt-6-sol, gpt-5.6-sol, gpt-5.6-terra; gpt-6-luna
  tops out at `max`; default effort is `low` on gpt-6.1-sol and gpt-6-astra, `medium` on gpt-6-luna [L S4]. This machine's
  `~/.codex/config.toml` sets `model = "gpt-6.1-sol"` and `model_reasoning_effort = "low"` [L S5]: a codex lane with no
  explicit effort runs at low here.
  (4) codex · `gpt-5.5` retires 2026-10-14T19:00:00Z (upgrade target gpt-6.1-sol); roster rows the catalog lacks:
  `gpt-6-sol`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, hidden `gpt-reserve` and `codex-auto-review` [L S4].
  (5) grok · `grok models` lists `grok-4.7` (default), `grok-4.7-build-fast`, `grok-4.6`, `grok-4.5`; `grok-4.7-build-fast`
  is new to the catalog [L S6].
  (6) opencode · `mimo-v2.6-pro` has no effort variants on the `opencode-go/` route (variants list empty) and is not on
  Zen (`opencode/`); `low, medium, high` exist only on `openrouter/xiaomi/mimo-v2.6-pro`. The economy pick
  "mimo-v2.6-pro · high" cannot be pinned on the Go route [L S7].
  (7) Machine state: `/opt/homebrew/bin/codex` is broken, `/opt/homebrew/bin/opencode` is 1.15.3 behind the 1.18.27 first
  on PATH, `agent` on PATH is the grok binary, `cursor-agent` is a dangling symlink, `agy` is absent, `pi` 0.74.0 exists
  but off PATH, `muse` 1.4.1 is on PATH [L S4, S6, S7, S10, S11, S12].
- **No change (re-checked).** Codex context 272000 (max 872000, 95 % effective) for gpt-6-astra, gpt-6.1-sol, gpt-6-luna
  [L S4]; Claude list prices Opus 5.5 4 / 20, Sonnet 5.5 2 / 10, Fable 5.1 10 / 50 and 1M windows [L S3 price table;
  P S7]; gpt-6-astra 10 / 50, gpt-6.1-sol 2 / 10, gpt-6-luna 0.10 / 0.50 on Zen [P S7]; grok-4.7 500K at 2 / 6 (4 / 12
  above 200K) [P S7]; glm-5.3 1.4 / 4.4, 1M, text-only [P S7]; deepseek-v4.1-flash 0.30 / 1.20 on Zen and 0.15 / 0.60 on
  Go, 1M, text + image [P S7]; mimo-v2.6-pro 0.435 / 0.87, vision yes [P S7]; gemini-3.8-flash 1.5 / 7.5 on Zen (= 2x of
  0.75 / 3.75), 1,048,576 [P S7]; kimi-k3 3 / 15, 1,048,576, only variant `max` [P S7]; Grok's retired 2M model is
  still absent from `grok models` [L S6].
- **Haiku 5.5 runs today in Claude Code 2.1.296 (docs: "Use v2.1.293 or later with Haiku 5.5.") and is listed, with
  credentials present, on three opencode routes.** Hermes (Anthropic key set, roster predates it) and pi (roster tops at
  haiku-4-5) are unverified; codex, grok, kimi, muse cannot (single-vendor catalogs). Table A has the strings to pass.
  Nothing was exercised with a model turn, so "resolves" means docs + the binary's baked alias map + no local override.
- **Claude Code ships a counter-measure for Haiku 5.5 stopping early.** The 2.1.296 binary has capability
  `haiku_5_5_early_stopping_guidance` and a system-prompt block that says "It does not change how much of the request you
  are expected to finish." and "The size of a task is not a reason to check in first." [L S3]. Inference, not measured:
  Anthropic saw check-in-early behaviour worth patching, so worker prompts for Haiku 5.5 on other harnesses (opencode,
  hermes) should carry an equivalent "finish, do not ask" instruction.
- **Probe trap.** The first `opencode models` after the cache goes stale returns the old list and refreshes in the
  background: my first call showed no Haiku 5.5, the second showed three routes (diff: 507 → 509 ids). Use
  `opencode models --refresh` before concluding a model is absent [L S7]. Logged as board learning #16.
- **Rosters that cannot be trusted for new models:** hermes 0.18.2 (static Anthropic roster tops at `claude-fable-5`,
  `claude-opus-4-8`, `claude-sonnet-5`, `claude-haiku-4-5`; its configured default `grok-4.3` via `xai-oauth` reports
  "xAI OAuth state is missing access_token") [L S9]; pi 0.74.0 (Anthropic tops at Opus 4.7 / Sonnet 4.6 / Haiku 4.5,
  openai-codex at gpt-5.5) [L S11].
- **Mythos is not an option.** The binary lists `claude-mythos-5` and `claude-mythos-5-1` at the Fable price tier, and its
  system text says "Claude Mythos 5.1 is available without those measures to only approved organizations." Fable 5.1 is
  "our most intelligent generally available model" [L S3].
- **Login modes on this machine:** claude `claude.ai` Max plan on first-party API; codex ChatGPT login; grok grok.com
  login; opencode credentials for OpenRouter (api), Anthropic (oauth), OpenCode (api), OpenCode Go (api), xAI (oauth);
  hermes Anthropic API key only [L S1, S4, S6, S7, S9].

## Findings

### A. Haiku 5.5 — which installed harness can run it

| Harness | Runs it today? | Exact string to pass | Effort selector | Grade, source |
|---|---|---|---|---|
| claude 2.1.296 | Yes, firstParty login; `haiku` alias maps to it | `--model haiku` or `--model claude-haiku-5-5` | `--effort low, medium, high, xhigh, max`; default `medium` | [V S2], [L S3]; resolution not exercised with a turn |
| opencode 1.18.27 | Listed on 3 routes, all with credentials here | `-m opencode/claude-haiku-5-5` (Zen), `-m opencode-go/claude-haiku-5-5` (Go), `-m openrouter/anthropic/claude-haiku-5.5` | `--variant low, medium, high, xhigh, max` | [L S7]; not exercised |
| hermes 0.18.2 | Unverified | would be `-m claude-haiku-5-5 --provider anthropic`; roster does not list it | none found in `--help` | [L S9]; `hermes model` is interactive, no non-interactive listing |
| pi 0.74.0 | Not listed | roster newest is `anthropic/claude-haiku-4-5` | `--thinking off, minimal, low, medium, high, xhigh` | [L S11]; off PATH |
| codex, grok, kimi, muse | No: OpenAI-only, xAI-only, Moonshot-only, Meta-only catalogs | — | — | [L S4, S6, S8, S10] |
| cursor-agent, agy | Not usable: dangling symlink, absent | — | — | [L S12] |

### B. Claude Code (2.1.296) — registry embedded in the binary, cross-checked against the docs

`--effort` help text: `Effort level for the current session (low, medium, high, xhigh, max)`. `--model` help text: `Provide an
alias for the latest model (e.g. 'fable', 'opus', or 'sonnet') or a model's full name.` (`haiku` is a documented alias but
not in that example) [L S1]. Baked alias map in the binary: `family:{fable:"claude-fable-5-1",opus:"claude-opus-5-5",
sonnet:"claude-sonnet-5-5",haiku:"claude-haiku-5-5"}` [L S3].

| Model | Exact id | Alias (Anthropic API) | Effort levels | Default | Context | $ in / out per MTok | Max output | advisor_rank | Grade, source |
|---|---|---|---|---|---|---|---|---|---|
| Haiku 5.5 | `claude-haiku-5-5` | `haiku` | low, medium, high, xhigh, max | medium | 1M native, all plans | 0.10 / 0.50; above 100K prompt tokens 0.50 / 2.50 | 128000 | 4 | [V S2], [L S3] |
| Sonnet 5.5 | `claude-sonnet-5-5` | `sonnet` | same | medium | 1M native | 2 / 10 | 128000 | 6 | [V S2], [L S3] |
| Opus 5.5 | `claude-opus-5-5` | `opus` | same | medium | 1M native | 4 / 20 | 128000 | 7 | [V S2], [L S3] |
| Fable 5.1 | `claude-fable-5-1` | `fable` (`best` = fable where available) | same | high | 1M native | 10 / 50 | 64000 default, 128000 upper | 9 | [V S2], [L S3] |
| Haiku 4.5 | `claude-haiku-4-5` | `haiku` only on Bedrock, Vertex, Foundry, Claude Platform on AWS | not in the effort table, so none | n/a | 200K | 1 / 5 | 64000 [P S7] | 1 | [V S2], [L S3] |
| Mythos 5.1 / 5 | `claude-mythos-5-1`, `claude-mythos-5` | none | n/a | high / n/a | 1M | 10 / 50 | n/a | 9 / 8 | [L S3]; approved organizations only |

- Provider table, verbatim row: `| Anthropic API | Opus 5.5 | Sonnet 5.5 | Haiku 5.5 |`. Claude Platform on AWS: Opus 5.5, Sonnet 4.6, Haiku 4.5.
  Bedrock and Google Agent Platform: Opus 5.5, Sonnet 4.5, Haiku 4.5. Foundry: Opus 4.6, Sonnet 4.5, Haiku 4.5 [V S2].
- Verbatim: `Use v2.1.293 or later with Haiku 5.5.` · `Its model ID is `claude-haiku-5-5`.` · `A Haiku 5.5 request costs more per
  token when its prompt is longer than 100K tokens.` · `You can't turn thinking off on Opus 5.5, Sonnet 5.5, Haiku 5.5, or the
  Fable models.` · `The effort scale is calibrated per model, so the same level name does not represent the same underlying
  value across models.` [V S2]
- A requested level the model lacks falls back "to the highest supported level at or below the one you set" [V S2].
  `ultracode` is "A Claude Code setting rather than a level" [V S2].
- Resumed sessions: a saved Haiku 4.5 session resumes on Haiku 5.5 when `model` is `haiku` [V S2].
- Third-party provider ids for Haiku 5.5 exist in the registry (`us.anthropic.claude-haiku-5-5`, `claude-haiku-5-5` on
  Vertex and Foundry) with `fallback_3p:"claude-haiku-4-5"`, so on those providers the alias stays at 4.5 unless
  `ANTHROPIC_DEFAULT_HAIKU_MODEL` is set [L S3, V S2].
- `advisor_rank` is a field name in the embedded registry; what it feeds is inferred from the name, not verified.
- Default-effort discrepancy raised by lane 1 (API default `high` for Sonnet 5.5 versus Claude Code's `medium`): the binary's
  registry carries `default_effort:"medium"` for `claude-haiku-5-5`, `claude-sonnet-5-5` and `claude-opus-5-5` and `"high"` for
  `claude-fable-5-1` [L S3]. That settles the Claude Code side only; the raw API default is lane 1's question.
- This machine: no `ANTHROPIC_DEFAULT_*_MODEL`, `ANTHROPIC_MODEL` or `CLAUDE_CODE_SUBAGENT_MODEL` in the environment;
  `~/.claude/settings.json` has `"model": "opus"`, `"effortLevel": "high"` and `modelSettings."claude-opus-5-5".effortLevel =
  "medium"` [L S1]. Nothing pins `haiku`.

### C. Harness binaries on this machine [L S1, S4, S6, S7, S8, S9, S10, S11, S12]

| Harness | Path | `--version` (verbatim) | Note |
|---|---|---|---|
| claude | `~/.local/bin/claude` -> `~/.local/share/claude/versions/2.1.296` | `2.1.296 (Claude Code)` | |
| codex | fnm shim first, `~/.local/state/fnm_multishells/26285_1791875625418/bin/codex` | `codex-cli 0.160.0` | works |
| codex | `/opt/homebrew/bin/codex` second | `Error: spawn /opt/homebrew/lib/node_modules/@openai/codex/node_modules/@openai/codex-darwin-arm64/vendor/aarch64-apple-darwin/codex/codex ENOENT` | broken: vendored platform binary missing; version unknown |
| grok | `~/.local/bin/grok` -> `~/.grok/bin/grok` -> `grok-1.0.46-macos-aarch64` | `grok 1.0.46 (2765805b9442) [stable]` | `~/.local/bin/agent` is a symlink to the same binary |
| kimi | fnm shim `.../bin/kimi` (`@moonshot-ai/kimi-code`) | `0.28.0` | |
| opencode | `~/.opencode/bin/opencode` first | `1.18.27` | |
| opencode | `/opt/homebrew/bin/opencode` second | `1.15.3` | older duplicate |
| hermes | `~/.local/bin/hermes` -> `~/.hermes/hermes-agent/venv/bin/hermes` | `Hermes Agent v0.18.2 (2026.7.7.2) · upstream 31c08a9a` | "Update available: 1631 commits behind" |
| muse | `~/.local/bin/muse` (bash launcher, self-updating channel `muse-stable`) | `Muse Code 1.4.1 (1.4.1-R4503.1)` | on PATH although not in the task's installed list |
| pi | `~/.local/share/fnm/node-versions/v22.22.1/installation/bin/pi` -> `@earendil-works/pi-coding-agent` | `0.74.0` | not on the active PATH; `which pi` finds nothing |
| cursor-agent | `~/.local/bin/cursor-agent` -> `.../cursor-agent/versions/2025.10.02-bd871ac/cursor-agent` | not runnable | dangling symlink, target purged; `/usr/local/bin/cursor` is only the IDE launcher |
| agy | not found anywhere checked | — | not installed |

### D. Harness × model availability — exact id strings accepted by each CLI's own listing [L]

| Model | claude | codex | grok | opencode (credentialed routes) | others |
|---|---|---|---|---|---|
| Haiku 5.5 | `haiku`, `claude-haiku-5-5` | no | no | `opencode/claude-haiku-5-5`, `opencode-go/claude-haiku-5-5`, `openrouter/anthropic/claude-haiku-5.5`, alias `openrouter/~anthropic/claude-haiku-latest` | hermes, pi unverified |
| Haiku 4.5 | `claude-haiku-4-5` | no | no | `opencode/claude-haiku-4-5`, `openrouter/anthropic/claude-haiku-4.5` | pi `anthropic/claude-haiku-4-5`; hermes `claude-haiku-4-5-20251001` |
| Opus 5.5 | `opus`, `claude-opus-5-5` | no | no | `opencode/claude-opus-5-5`, `openrouter/anthropic/claude-opus-5.5` | not in hermes, pi |
| Sonnet 5.5 | `sonnet`, `claude-sonnet-5-5` | no | no | `opencode/claude-sonnet-5-5`, `openrouter/anthropic/claude-sonnet-5.5` | not in hermes, pi |
| Fable 5.1 | `fable`, `claude-fable-5-1` | no | no | `opencode/claude-fable-5-1`, `openrouter/anthropic/claude-fable-5.1` | hermes has `claude-fable-5` only |
| GPT-6 Astra | no | `gpt-6-astra` | no | `opencode/gpt-6-astra`, `openrouter/openai/gpt-6-astra` | pi openai-codex tops at gpt-5.5 |
| GPT-6.1 Sol | no | `gpt-6.1-sol` | no | `opencode/gpt-6.1-sol`, `openrouter/openai/gpt-6.1-sol` | |
| GPT-6 Luna | no | `gpt-6-luna` | no | `opencode/gpt-6-luna`, `opencode-go/gpt-6-luna`, `openrouter/openai/gpt-6-luna` | |
| Grok 4.7 | no | no | `grok-4.7` (default), `grok-4.7-build-fast` | `xai/grok-4.7`, `opencode/grok-4.7`, `opencode-go/grok-4.7`, `openrouter/x-ai/grok-4.7` | hermes default is older `grok-4.3` |
| Kimi K3 | no | no | no | `opencode/kimi-k3`, `opencode-go/kimi-k3`, `openrouter/moonshotai/kimi-k3` | kimi CLI `-m <alias>`; alias not discoverable |
| GLM-5.3 | no | no | no | `opencode/glm-5.3`, `opencode-go/glm-5.3`, `openrouter/z-ai/glm-5.3` | |
| DeepSeek V4.1 Flash | no | no | no | `opencode/deepseek-v4.1-flash`, `opencode-go/deepseek-v4.1-flash`, `openrouter/deepseek/deepseek-v4.1-flash` | |
| MiMo V2.6 Pro | no | no | no | `opencode-go/mimo-v2.6-pro`, `openrouter/xiaomi/mimo-v2.6-pro` (not on Zen) | |
| Gemini 3.8 Flash | no | no | no | `opencode/gemini-3.8-flash`, `openrouter/google/gemini-3.8-flash` | agy absent |
| Muse Spark 1.3 | no | no | no | `opencode/muse-spark-1.3`, `openrouter/meta/muse-spark-1.3` | `muse --model <id>` free-form, no listing command |

Board catalog default names map to: `opus-5-5` -> `claude-opus-5-5`, `fable-5-1` -> `claude-fable-5-1`, `gpt-6-astra`,
`gpt-6.1-sol`, `gpt-6-luna` -> codex slugs unchanged; `k3` -> `kimi-k3` on opencode, but the kimi CLI's own alias for it could not
be discovered [L S4, S7, S8].

Codex roster (installed 0.160.0, `codex debug models`; cache `fetched_at` 2026-10-13T10:27:19Z, etag unchanged since the
2026-10-12 fetch by client 0.162.0, identical `comp_hash` on all 10 slugs) [L S4, S5]. Every model: context 272000, max 872000,
95 % effective (gpt-5.5: 272000 / 272000), input text + image, service tier `priority`, speed tier `fast`.

| Slug | Visibility, priority | Default effort | Supported efforts | Description (verbatim) |
|---|---|---|---|---|
| `gpt-6.1-sol` | list, 1 | low | low, medium, high, xhigh, max, ultra | `Latest workhorse model for coding and everyday work.` |
| `gpt-6-astra` | list, 2 | low | low, medium, high, xhigh, max, ultra | `Frontier intelligence for the most demanding work.` |
| `gpt-6-sol` | list, 3 | medium | low, medium, high, xhigh, max, ultra | `Previous generation workhorse model.` |
| `gpt-6-luna` | list, 4 | medium | low, medium, high, xhigh, max | `Fast and affordable model for easier tasks.` |
| `gpt-reserve` | hide, 4 | medium | low, medium, high, xhigh, max | `Fast and affordable agentic coding model.` |
| `gpt-5.6-sol` | list, 5 | low | low, medium, high, xhigh, max, ultra | `Older generation workhorse model.` |
| `gpt-5.6-terra` | list, 8 | medium | low, medium, high, xhigh, max, ultra | `Older balanced model for straightforward work.` |
| `gpt-5.6-luna` | list, 9 | medium | low, medium, high, xhigh, max | `Older fast and efficient model.` |
| `gpt-5.5` | hide, 13 | medium | low, medium, high, xhigh | `Legacy coding model.` Retires 2026-10-14T19:00:00Z, upgrade to gpt-6.1-sol |
| `codex-auto-review` | hide, 43 | medium | low, medium, high, xhigh, max | `Automatic approval review model for Codex.` |

`gpt-6.1-sol` nudge (verbatim): `Maximize usage with GPT-6.1 Sol. Try it on complex work for near-Astra performance at a lower cost.`
`multi_agent_reasoning_effort` is `xhigh` on gpt-6.1-sol and gpt-6-astra (multi-agent v2), null elsewhere. The cache carries no price.

grok (`grok models`, 2026-10-13) [L S6]:

```
You are logged in with grok.com.

Default model: grok-4.7

Available models:
  * grok-4.7 (default)
  - grok-4.7-build-fast
  - grok-4.6
  - grok-4.5
```

### E. What `opencode models --verbose` reports per seed model (1.18.27, cache rewritten 2026-10-13 12:26) [L S7; values from models.dev, P]

| Route id | $ in / out per MTok | Context · max output | Input modalities | Effort variants | Released |
|---|---|---|---|---|---|
| `opencode/`, `opencode-go/claude-haiku-5-5`, `openrouter/anthropic/claude-haiku-5.5` | 0.10 / 0.50 (cache read 0.01); tier above 100K 0.50 / 2.50 in the raw cache | 1,000,000 · 128,000 | text, image, pdf | low, medium, high, xhigh, max | 2026-10-07 |
| `opencode/claude-haiku-4-5` | 1 / 5 | 200,000 · 64,000 | text, image, pdf | high, max | 2025-10-15 |
| `opencode/claude-opus-5-5` | 4 / 20 | 1,000,000 · 128,000 | text, image, pdf | low, medium, high, xhigh, max | 2026-09-22 |
| `opencode/claude-sonnet-5-5` | 2 / 10 | 1,000,000 · 128,000 | text, image, pdf | low, medium, high, xhigh, max | 2026-09-28 |
| `opencode/claude-fable-5-1` | 10 / 50 | 1,000,000 · 128,000 | text, image, pdf | low, medium, high, xhigh, max | 2026-09-01 |
| `opencode/gpt-6-astra` | 10 / 50; above 200K 20 / 75 | 1,050,000 (input 922,000) · 128,000 | text, image, pdf | low, medium, high, xhigh, max | 2026-09-04 |
| `opencode/gpt-6.1-sol` | 2 / 10; above 200K 4 / 15 | 1,050,000 (input 922,000) · 128,000 | text, image, pdf | low, medium, high, xhigh, max | 2026-09-29 |
| `opencode/gpt-6-luna` | 0.10 / 0.50; above 200K 0.20 / 0.75 | 1,050,000 (input 922,000) · 128,000 | text, image, pdf | none, low, medium, high, xhigh, max | 2026-09-22 |
| `xai/grok-4.7` (same on `opencode/`) | 2 / 6; above 200K 4 / 12 | 500,000 · 500,000 | text, image, pdf | low, medium, high, xhigh | 2026-09-21 |
| `opencode/kimi-k3` (same on `opencode-go/`) | 3 / 15 | 1,048,576 · 131,072 | text, image, video | max | 2026-07-16 |
| `opencode/glm-5.3` (same on `opencode-go/`) | 1.4 / 4.4 | 1,000,000 · 131,072 | text | low, high, max | 2026-08-14 |
| `opencode/deepseek-v4.1-flash` | 0.30 / 1.20 | 1,000,000 · 384,000 | text, image | low, high, max | 2026-09-10 |
| `opencode-go/deepseek-v4.1-flash` | 0.15 / 0.60 | 1,000,000 · 384,000 | text, image | low, high, max | 2026-09-10 |
| `opencode-go/mimo-v2.6-pro` | 0.435 / 0.87 | 1,048,576 · 131,072 | text, audio, image, video | none listed | 2026-09-22 |
| `openrouter/xiaomi/mimo-v2.6-pro` | 0.435 / 0.87 | 1,050,000 · 131,072 | text, audio, image, video | low, medium, high | 2026-09-22 |
| `opencode/gemini-3.8-flash` | 1.5 / 7.5 | 1,048,576 · 65,536 | text, audio, image, video, pdf | low, medium, high | 2026-09-02 |
| `opencode/muse-spark-1.3` | 1.25 / 4.25 | 1,048,576 · 131,072 | text, audio, image, video, pdf | minimal, low, medium, high, xhigh | 2026-09-02 |

The GPT-6 rows show a 200K price tier and a 1.05M window on the API route; the catalog's "GPT-6 bills 2x input >272K" and "Codex
exposes 272K (872K max)" concern the vendor tier and the Codex harness. The 200K-versus-272K tier threshold is not settled here
(lane 1 owns vendor pricing).

### F. Effort selectors per harness [L]

| Harness | Flag or key | Values | Source |
|---|---|---|---|
| claude | `--effort <level>` | low, medium, high, xhigh, max (per model, see B) | S1 |
| codex | `-c model_reasoning_effort="<level>"` (config key seen in `config.toml`; `-c key=value` documented) | per slug, see D | S4, S5 |
| grok | `--reasoning-effort <EFFORT>` (alias `--effort`) | help prints no enum; opencode lists low, medium, high, xhigh for grok-4.7 | S6, S7 |
| opencode | `--variant` ("provider-specific reasoning effort, e.g., high, max, minimal") | per route, see E | S7 |
| pi | `--thinking <level>`; also `--model sonnet:high` shorthand | off, minimal, low, medium, high, xhigh | S11 |
| muse | `--reasoning-effort <EFFORT>` | none, minimal, low, medium, high, xhigh, max, ultra (default high) | S10 |
| kimi | no effort flag in `kimi --help` | — | S8 |
| hermes | no effort flag found in `hermes --help` or `hermes chat --help` | — | S9 |

### G. Per-harness notes

- **claude.** `claude auth status`: `{"loggedIn": true, "authMethod": "claude.ai", "apiProvider": "firstParty", "subscriptionType":
  "max"}` [L S1]: subscription, so the "Anthropic API" row of the alias table applies and Haiku 5.5's 1M window applies "on every
  plan" [V S2]. Native subagents take `haiku`, `sonnet`, `opus`, `fable`; `CLAUDE_CODE_SUBAGENT_MODEL` accepts an alias or full id
  [V S2]. The 5.5 models "always use adaptive reasoning"; thinking cannot be disabled [V S2].
- **codex.** `codex login status`: `Logged in using ChatGPT` (subscription) [L S4]. No `[model_providers.*]` or `[profiles.*]`
  table headers in `config.toml`, so no non-OpenAI route [L S5]. `ultra` fans out (the catalog refuses it on lanes).
- **grok.** grok.com login (subscription, not an API key). `agent` on PATH is this binary, not Cursor's CLI [L S6, S12].
  `grok models` prints no context, price or effort enum; those come from the xai/opencode listing (E).
- **opencode.** `opencode providers list` shows credentials for OpenRouter (api), Anthropic (oauth), OpenCode (api),
  OpenCode Go (api), xAI (oauth); `opencode models` lists no `anthropic/` ids at all (0 of 509), so the Anthropic oauth
  credential exposes nothing. Providers by id count after refresh: openrouter 380, opencode 85, opencode-go 31, xai 13.
  `~/.config/opencode/opencode.json` pins `opencode-go/deepseek-v4-flash` for the `general`, `explore` and `scout` agents, so
  lanes that omit `-m` run that older model. `opencode models --refresh` exists ("refresh the models cache from models.dev") [L S7].
- **hermes.** Default `model: default: grok-4.3`, `provider: xai-oauth` in `config.yaml`; `hermes status` shows the xAI OAuth
  state without an access token and no Nous, Codex, Qwen or MiniMax login. Among LLM keys only Anthropic is set (value masked
  by hermes). Hermes gives lanes a working path only through that Anthropic key, with a roster that predates the 5.5 generation
  [L S9].
- **kimi.** `kimi doctor`: `OK config.toml  /Users/tamas/.kimi-code/config.toml`; the file has no keys (181 bytes) and
  `kimi provider list` prints `No providers configured.` The model comes from the built-in default after `kimi login`; the
  alias list is not exposed by any cheap command [L S8].
- **pi.** `pi --list-models` shows only providers with credentials: anthropic (23 ids) and openai-codex (10 ids) [L S11].
  Default provider per `--help`: google.
- **muse.** Providers `echo`, `meta`, `local`; `--model <MODEL>` free-form; no listing command. The launcher is a self-updating
  bash script (`MUSE_CHANNEL` default `muse-stable`), so any `muse` call may update it [L S10].
- **cursor-agent, agy.** Not usable (C). Rosters for Cursor and Antigravity stay unverified locally, as in the catalog's
  "Thin evidence" note.

## Gaps

- No model turn was run (brief): alias resolution `haiku -> claude-haiku-5-5`, the three opencode Haiku 5.5 routes, and hermes
  and pi pass-through of an unlisted id are inferred from listings, docs and the binary, not exercised.
- Haiku 5.5 capability and quality (benchmarks, computer use, tool-call reliability, whether it still stops early under
  Claude Code's injected guidance) are outside this lane. Computer-use support is unknown here; lane 1 cites the vendor page for
  "Text and images -> text", while models.dev additionally lists pdf [P S7].
- Vendor price pages and the 100K long-prompt rule are confirmed only through Claude Code's embedded price table and docs, not
  the Anthropic pricing page (lane 1).
- kimi: the K3 alias for `kimi -m`, the login state and the effort controls are not discoverable without reading credentials or
  running a turn. muse: model ids and login state unknown. grok: context, price and effort enum not printed by the CLI.
- hermes: no non-interactive model listing (`hermes model` is interactive); live `/v1/models` contents unknown.
- agy and cursor-agent rosters cannot be probed (absent, dangling).
- The 200K (opencode schema) versus 272K (catalog) GPT-6 long-context price threshold is unresolved.
- Whether `tengu_idempotent_wolf`, the server flag that gates the Haiku 5.5 guidance block, is on for this account is unknown.
- Latest published Claude Code version is unknown (no `claude update` run); 2.1.296 satisfies the docs' 2.1.293 minimum.

## Sources

All accessed 2026-10-13.

- [S1] `claude --version`, `claude --help`, `claude auth status`, targeted key greps of `~/.claude/settings.json` and `env` — local — flags, effort enum, login mode, user settings. [L]
- [S2] Claude Code docs, Model configuration — https://code.claude.com/docs/en/model-config (fetched as markdown, HTTP 200, 116,499 bytes) — alias table, Haiku 5.5 section, effort levels and defaults, 1M window, env vars. [V] Re-check whenever a Claude model ships.
- [S3] Claude Code binary `~/.local/share/claude/versions/2.1.296` (240,664,432 bytes), read-only byte scan — embedded model registry (ids, provider ids, context, max output, default effort, capabilities, advisor_rank), price table (`haiku_55`, `haiku_45`, tier keys), baked alias map, Haiku 5.5 early-stopping block, Fable / Mythos identity text. [L; vendor client data] Re-run on every Claude Code update.
- [S4] `codex --version` (both binaries), `codex --help`, `codex debug --help`, `codex debug models` (601,547 bytes, 10 models), `codex login status`. [L]
- [S5] `~/.codex/models_cache.json` (not an auth file; `fetched_at` 2026-10-13T10:27:19Z, client 0.160.0, etag `W/"43a1439a20b18da98684ea780688d913"`) and lines 1, 2, 4 of `~/.codex/config.toml`; table-header grep for `model_providers` / `profiles`. [L] Re-check on every OpenAI release.
- [S6] `grok --version`, `grok models`, `grok --help`, `ls -l` of the symlinks. [L]
- [S7] `opencode --version` (both binaries), `opencode models` (two runs, 507 then 509 ids), `opencode models --verbose`, `opencode models --help`, `opencode run --help`, `opencode providers list`, `~/.cache/opencode/models.json` (models.dev dump, 228 providers, mtime 2026-10-13 12:26), agent blocks of `~/.config/opencode/opencode.json`. [L; price, limit and date values originate from models.dev, community-maintained, graded P] Re-run with `--refresh` on every model release.
- [S8] `kimi --version`, `kimi --help`, `kimi provider --help`, `kimi provider list`, `kimi doctor`, directory listing of `~/.kimi-code` (credentials not read). [L]
- [S9] `hermes --version`, `hermes --help`, `hermes model --help`, `hermes status` (keys masked, not copied), `model:` block of `~/.hermes/config.yaml`, greps of `~/.hermes/hermes-agent/hermes_cli/models.py`. [L]
- [S10] `muse --version`, `muse --help`, `muse exec --help`, head of `~/.local/bin/muse`. [L]
- [S11] `pi --version`, `pi --help`, `pi --list-models` via `~/.local/share/fnm/node-versions/v22.22.1/installation/bin/pi`; `~/.pi/agent` directory listing (auth file not read). [L]
- [S12] `which -a` for every supported harness, `ls -l` of `~/.local/bin/{agent,cursor-agent,grok}`, `/usr/local/bin/cursor`, existence checks for Cursor.app, Antigravity.app, `~/.pi`, `~/.agy`. [L]
