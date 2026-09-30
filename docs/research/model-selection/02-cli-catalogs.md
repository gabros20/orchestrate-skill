# 02 — Live CLI catalogs (probed 2026-09-30, macOS, this machine)

All rows [L] (local probe) unless tagged [V] (vendor doc). Listing commands only; no prompts sent; no auth files read.

## Summary
- **Codex catalog is newer than the seed list**: `gpt-6.1-sol` (GPT-6.1-Sol, "Latest workhorse model for coding and everyday work", priority 1, default effort low) is listed above gpt-6-astra. Its nux text: "near-Astra performance at a lower cost" (vendor string in cache). [L S2]
- Codex effort enum has **six** levels on Astra/Sol/Terra: low, medium, high, xhigh, max, **ultra** ("Maximum reasoning with automatic task delegation"). Luna tops out at max; gpt-5.5 at xhigh. [L S2]
- Codex context: `context_window` 272000, `max_context_window` 872000 for all GPT-6/5.6 (5.5: 272000/272000); `effective_context_window_percent` 95. No prices in the codex cache. [L S2]
- **GPT-5.5 retires 2026-10-14** (upgrade target gpt-5.6-sol). `gpt-reserve` and `codex-auto-review` are hidden. [L S2]
- Claude Code exposes no list command; aliases fable/opus/sonnet/haiku/best/opusplan. On the Anthropic API `opus` = Opus 5.5, `sonnet` = Sonnet 5.5; default model on Pro/Max/Team/Enterprise/API = Opus 5.5. Effort enum: low, medium, high, xhigh, max. [V S3]
- Grok CLI: 4 models, default grok-4.7; `--reasoning-effort`/`--effort` flag exists but enum not printed by help. [L S4]
- **opencode is the richest local catalog**: `--verbose` prints per-token USD/1M costs, context, output limit, effort variants, release date (models.dev-sourced). Includes claude-fable-5-1, claude-opus-5-5, claude-sonnet-5-5 and gpt-6.1-sol, gpt-6-*, grok-4.7, kimi-k3, glm-5.3, qwen3.8-max, deepseek-v4.1-flash, gemini-3.8-flash. [L S5]
- **Not usable here**: cursor-agent (broken symlink; also stale 2025.10.02 build), agy/Antigravity, pi (not installed). Hermes and kimi have no non-interactive model list (kimi: "No providers configured"). [L]
- Caveat: opencode prices are models.dev/provider-listed (not benchmark quality); the same model differs by route (e.g. claude-opus-5-5 $4/$20 on Zen; grok cache-read differs). Codex cache reports `client_version 0.159.2` while `codex --version` prints 0.144.6 (unexplained mismatch, treat cache as server-provided catalog). [L]

## Findings

### Installed versions [L]
| CLI | Command | Output | Path |
|---|---|---|---|
| claude | `claude --version` | `2.1.285 (Claude Code)` | ~/.local/bin/claude |
| codex | `codex --version` | `codex-cli 0.144.6` | fnm node bin |
| grok | `grok --version` | `grok 1.0.41 (4220f3b224a6) [stable]` | ~/.local/bin/grok; `agent` is a symlink to ~/.grok/bin/agent (same grok 1.0.41, NOT Cursor's agent) |
| opencode | `opencode --version` | `1.18.27` | ~/.opencode/bin/opencode |
| hermes | `hermes --version` | `Hermes Agent v0.18.2 (2026.7.7.2) · upstream 31c08a9a` | ~/.local/bin/hermes |
| kimi | `kimi --version` | `0.28.0` (Kimi Code) | fnm node bin |
| cursor-agent | `cursor-agent --version` | MISSING: ~/.local/bin/cursor-agent is a symlink to a nonexistent 2025.10.02 build; not on effective PATH | broken |
| agy (Antigravity) | `agy --version` | not installed (no binary, no app, no ~/.antigravity) | none |
| pi | `pi --version` | not installed | none |
Also present, out of scope: droid, jcode, muse (~/.local/bin); `cursor` editor CLI at /usr/local/bin/cursor (not the agent).

### Codex — `python3` over ~/.codex/models_cache.json (fetched_at 2026-09-30T07:25:00Z, cache client_version 0.159.2) [L S2]
Pass as `codex -m <slug> -c model_reasoning_effort=<level>` (exact CLI flag not probed; slugs and enums below are verbatim).
| slug | display | visibility | desc (verbatim) | default effort | supported efforts | ctx / max ctx | tiers | modalities |
|---|---|---|---|---|---|---|---|---|
| gpt-6.1-sol | GPT-6.1-Sol | list, prio 1 | "Latest workhorse model for coding and everyday work." | low | low,medium,high,xhigh,max,ultra | 272000 / 872000 | priority "2x speed, increased usage" | text,image |
| gpt-6-astra | GPT-6-Astra | list, prio 2 | "Frontier intelligence for the most demanding work." | low | low,medium,high,xhigh,max,ultra | 272000 / 872000 | priority "2x speed, increased usage" | text,image |
| gpt-6-sol | GPT-6-Sol | list, prio 3 | "Previous generation workhorse model." | medium | low..ultra (6) | 272000 / 872000 | priority "1.5x speed" | text,image |
| gpt-6-luna | GPT-6-Luna | list, prio 4 | "Fast and affordable model for easier tasks." | medium | low,medium,high,xhigh,max | 272000 / 872000 | priority "1.5x speed" | text,image |
| gpt-reserve | GPT-Reserve | HIDE | "Fast and affordable agentic coding model." | medium | low..max (5) | 272000 / 872000 | priority | text,image |
| gpt-5.6-sol | GPT-5.6-Sol | list, prio 5 | "Older generation workhorse model." | low | low..ultra (6) | 272000 / 872000 | 1.5x | text,image |
| gpt-5.6-terra | GPT-5.6-Terra | list, prio 8 | "Older balanced model for straightforward work." | medium | low..ultra (6) | 272000 / 872000 | 1.5x | text,image |
| gpt-5.6-luna | GPT-5.6-Luna | list, prio 9 | "Older fast and efficient model." | medium | low..max (5) | 272000 / 872000 | 1.5x | text,image |
| gpt-5.5 | GPT-5.5 | list, prio 13 | "Legacy coding model." | medium | low,medium,high,xhigh | 272000 / 272000 | 1.5x | text,image |
| codex-auto-review | Codex Auto Review | HIDE | "Automatic approval review model for Codex." | medium | low..max (5) | 272000 / 872000 | 1.5x | text,image |
Notes: all `supported_in_api: true`; `effective_context_window_percent` 95; `default_verbosity` low; `default_reasoning_summary` none. gpt-5.5 `upgrade`: model gpt-5.6-sol, "GPT-5.5 retires on October 14, 2026. Switch to GPT-5.6 Sol to continue working in Codex." (retirement_at 2026-10-14T19:00:00Z). No other upgrade mappings. Cache has no price fields.

### Claude Code [L S1, V S3]
- `claude --help`: `--model <model>` "Provide an alias for the latest model (e.g. 'fable', 'opus', or 'sonnet') or a model's full name."; `--effort <level>` "(low, medium, high, xhigh, max)"; `--fallback-model <model>` accepts comma-separated list. No model-list command.
- [V S3] aliases: default; best ("fable where available, otherwise opus"); fable; sonnet; opus; haiku; sonnet[1m]; opus[1m]; opusplan ("opus in plan mode, switches to sonnet for execution").
- [V S3] Alias resolution, Anthropic API: opus = Opus 5.5, sonnet = Sonnet 5.5. Claude Platform on AWS: Opus 5.5 / Sonnet 4.6. Bedrock and Google Agent Platform: Opus 5.5 / Sonnet 4.5. Foundry: Opus 4.6 / Sonnet 4.5. Default model: Opus 5.5 (Pro/Max/Team/Enterprise/API/AWS/Bedrock/GCP); Sonnet 4.5 (Foundry).
- [V S3] Effort: Fable 5.1/5, Opus 5.5, Sonnet 5.5, Opus 5, Sonnet 5, Opus 4.8, 4.7 = low,medium,high,xhigh,max; Opus 4.6/Sonnet 4.6 = low,medium,high,max.
- [V S3] 1M native: Fable 5.1/5, Sonnet 5+, Opus 4.7+; auto-compact ~967K. Env pins: ANTHROPIC_DEFAULT_{FABLE,OPUS,SONNET,HAIKU}_MODEL, CLAUDE_CODE_SUBAGENT_MODEL, ANTHROPIC_DEFAULT_MODEL.
- Full IDs listed [V S3]: claude-fable-5-1, claude-fable-5, claude-opus-5-5, claude-opus-5, claude-opus-4-8/4-7/4-6, claude-sonnet-5-5, claude-sonnet-5, claude-sonnet-4-6, claude-sonnet-4-5, claude-haiku-4-5. Haiku 5.x not listed.

### Grok CLI — `grok models` [L S4]
```
You are logged in with grok.com.
Default model: grok-4.7
  * grok-4.7 (default)
  - grok-4.7-build-fast
  - grok-4.6
  - grok-4.5
```
Flags: `-m, --model <MODEL>`, `--reasoning-effort <EFFORT>` (alias `--effort`; enum not shown in help). Context/price not shown. Auth = grok.com login (SuperGrok subscription; per hermes status the same OAuth is used there).

### opencode — `opencode models [provider] --verbose` (models.dev-sourced; `--refresh` re-pulls) [L S5]
Credentials configured (names only, from `opencode auth list`): OpenRouter api, Anthropic oauth, OpenCode Zen api, OpenCode Go api, xAI oauth. Counts: opencode(Zen) 79, opencode-go 29, openrouter 387, xai 12 (anthropic provider not listed by `opencode models`, only via auth). Unit: USD per 1M tokens (in/out/cache-read); ctx = context limit; effort = `variants` keys. Pass as `-m provider/id`.

opencode (Zen) current rows (in/out/cacheR | ctx | out limit | efforts | released):
| id | $in/$out/$cR | ctx | max out | efforts | release |
|---|---|---|---|---|---|
| opencode/claude-fable-5-1 | 10/50/0.25 | 1,000,000 | 128000 | low,medium,high,xhigh,max | 2026-09-01 |
| opencode/claude-fable-5 | 10/50/1 | 1,000,000 | 128000 | same | 2026-06-09 |
| opencode/claude-opus-5-5 | 4/20/0.2 | 1,000,000 | 128000 | low..max | 2026-09-22 |
| opencode/claude-opus-5 | 5/25/0.5 | 1,000,000 | 128000 | low..max | 2026-07-24 |
| opencode/claude-sonnet-5-5 | 2/10/0.2 | 1,000,000 | 128000 | low..max | 2026-09-28 |
| opencode/claude-sonnet-5 | 2/10/0.2 | 1,000,000 | 128000 | low..max | 2026-06-30 |
| opencode/claude-haiku-4-5 | 1/5/0.1 | 200,000 | 64000 | high,max | 2025-10-15 |
| opencode/gpt-6.1-sol | 2/10/0.1 | 1,050,000 | 128000 | low..max | 2026-09-29 |
| opencode/gpt-6-astra | 10/50/1 | 1,050,000 | 128000 | low..max | 2026-09-04 |
| opencode/gpt-6-sol | 2/10/0.2 | 1,050,000 | 128000 | none,low..max | 2026-09-22 |
| opencode/gpt-6-luna | 0.1/0.5/0.01 | 1,050,000 | 128000 | none,low..max | 2026-09-22 |
| opencode/gpt-5.6-sol / terra / luna | 4/20 ; 2.5/15 ; 0.2/1.2 | 1,050,000 | 128000 | none..max | 2026-07-09 |
| opencode/gemini-3.8-flash | 1.5/7.5/0.15 | 1,048,576 | 65536 | low,medium,high | 2026-09-02 |
| opencode/gemini-3.7-flash | 1.5/7.5/0.15 | 1,048,576 | 65536 | low,medium,high | 2026-08-13 |
| opencode/gemini-3.1-pro | 2/12/0.2 | 1,048,576 | 65536 | low,medium,high | 2026-02-19 |
| opencode/gemini-3.5-flash-lite | 0.3/2.5/0.03 | 1,048,576 | 65536 | minimal..high | 2026-07-21 |
| opencode/grok-4.7 | 2/6/0.5 | 500,000 | 500000 | low,medium,high,xhigh | 2026-09-21 |
| opencode/grok-4.6 / 4.5 | 2/6 | 500,000 | 500000 | ..xhigh / ..high | 2026-08-12 / 07-08 |
| opencode/grok-build-0.1 | 1/2/0.2 | 256,000 | 256000 | none listed | 2026-04-16 |
| opencode/kimi-k3 | 3/15/0.3 | 1,048,576 | 131072 | max | 2026-07-16 |
| opencode/kimi-k2.7-code | 0.95/4/0.19 | 262,144 | 262144 | none listed | 2026-06-12 |
| opencode/glm-5.3 | 1.4/4.4/0.26 | 1,000,000 | 131072 | low,high,max | 2026-08-14 |
| opencode/glm-5.3-flash | 0.15/0.5/0.03 | 1,000,000 | 131072 | low,high,max (img) | 2026-08-26 |
| opencode/minimax-m3 | 0.3/1.2/0.06 | 512,000 | 128000 | none listed (img) | 2026-06-01 |
| opencode/deepseek-v4-pro | 1.74/3.84/0.145 | 1,000,000 | 384000 | high,max | 2026-04-24 |
| opencode/deepseek-v4.1-flash | 0.3/1.2/0.006 | 1,000,000 | 384000 | low,high,max (img) | 2026-09-10 |
| opencode/deepseek-v4-flash | 0.14/0.28/0.028 | 1,000,000 | 384000 | low,high,max | 2026-07-31 |
| opencode/qwen3.8-max | 2/6/0.25 | 262,144 | 131072 | none listed | 2026-08-03 |
| opencode/qwen3.8-flash | 0.15/0.47/0.016 | 1,000,000 | 131072 | low,medium,xhigh | 2026-08-26 |
| opencode/muse-spark-1.3 | 1.25/4.25/0.15 | 1,048,576 | 131072 | minimal..xhigh | 2026-09-02 |
| free tier: opencode/{big-pickle, ling-3.0-flash-fin-free, longcat-2.5-preview-free, mimo-v2.6-flash-free, nemotron-3-ultra-free, nemotron-3.5-lightning-free, space-bunny-free, muse-spark-1.3-contributor-free} | 0/0 | 200K–1.05M | | | 2025-10 to 2026-09-25 |
All Zen rows above with `img` capability: everything except big-pickle, deepseek-v4-pro/flash (non-vision), glm-5*/non-flash, minimax-m2.x, nemotron, ling, gpt-5.3-codex-spark.

opencode-go (subscription bundle, cheaper open-weight routes; in/out): deepseek-v4-pro 0.66/1.98; deepseek-v4.1-flash 0.15/0.6; glm-5.3 1.4/4.4; glm-5.3-flash 0.15/0.5; kimi-k3 3/15; kimi-k2.7-code 0.95/4; qwen3.8-max 2/6 (ctx 1M here vs 262K on Zen); qwen3.8-flash 0.15/0.47; mimo-v2.6-pro 0.435/0.87 (1,048,576 ctx, img); mimo-v2.6-flash 0.14/0.28; minimax-m3 0.3/1.2 (1M ctx); hy4-preview 0.834/2.501 (ctx 1,024,000); longcat-2.0 0.3/1.2; gpt-6-luna 0.1/0.5; grok-4.7 2/6; muse-spark-1.3-contributor 0.1/0.2.

xai provider (direct): grok-4.7 2/6 (ctx 500000, released 2026-09-21); grok-4.6; grok-4.5; grok-4.3 1.25/2.5 (ctx 1,000,000, out limit 30000, efforts none..high); grok-4.20-0309-{reasoning,non-reasoning,multi-agent} 1.25/2.5 ctx 1,000,000; grok-build-0.1 1/2 ctx 256000; grok-imagine-image/-quality, grok-imagine-video/-1.5 (media). No "Grok 4.1 Fast / 2M context" model appears in this catalog. `grok-4.7-build-fast` (grok CLI) is not in opencode's xai list.

openrouter (387 models; selected flagships, in/out USD per 1M, all released dates from catalog):
| id | $in/$out | ctx | efforts |
|---|---|---|---|
| anthropic/claude-fable-5.1 | 10/50 | 1,000,000 | low..max |
| anthropic/claude-opus-5.5 | 4/20 | 1,000,000 | low..max |
| anthropic/claude-sonnet-5.5 | 2/10 | 1,000,000 | low..max |
| openai/gpt-6-astra (+ -pro) | 10/50 | 1,050,000 | low..max |
| openai/gpt-6.1-sol (+ -pro) | 2/10 | 1,050,000 | low..max |
| openai/gpt-6-luna | 0.1/0.5 | 1,050,000 | none..max |
| x-ai/grok-4.7 | 2/6 | 500,000 | low..xhigh |
| google/gemini-3.8-flash | 0.75/3.75 | 1,048,576 | low,medium,high |
| moonshotai/kimi-k3 | 3/15 | 1,048,576 | low,high,max |
| z-ai/glm-5.3 ; glm-5.3-prime | 1.4/4.4 ; 2.8/8.8 | 1,048,576 ; 1,000,000 | low,high,max |
| deepseek/deepseek-v4.1-flash ; v4-pro-0813 | 0.3/1.2 ; 1.32/3.96 | 1,048,576 | low,high,max |
| qwen/qwen3.8-max-prime ; qwen3.8-max-0902 | 4/12 ; 2/6 | 1,000,000 | minimal..xhigh |
| qwen/qwen3.8-2.4t-a95b | 2/6 | 1,048,576 | low,medium,xhigh |
| minimax/minimax-m3 | 0.3/1.2 | 1,048,576 | none listed |
| xiaomi/mimo-v2.6-pro | 0.435/0.87 | 1,050,000 | low,medium,high |
| nvidia/nemotron-3-ultra-550b-a55b | 0.6/2.4 | 262,144 | medium,high |
| meta/muse-spark-1.3 | 1.25/4.25 | 1,048,576 | minimal..max |
Rolling aliases exist: `openrouter/~anthropic/claude-{fable,opus,sonnet,haiku}-latest`, `~openai/gpt-{astra,sol,terra,luna,mini}-latest`, `~x-ai/grok-latest`, `~google/gemini-{pro,flash}-latest`, `~moonshotai/kimi-latest`, `~deepseek/...`, `~z-ai/...`. Note `~anthropic/claude-haiku-latest` still resolves to a 200K, $1/$5 model (Haiku 4.5 class); no Haiku 5.x row anywhere in this catalog.

### Hermes [L S6]
`hermes --version` → v0.18.2. `hermes status` (keys redacted by tool; only presence read): Model **grok-4.3**, Provider "xAI Grok OAuth (SuperGrok / Premium+)"; API keys present: Anthropic, Tavily; absent: OpenRouter, OpenAI, Google, DeepSeek, xAI key, NVIDIA, Z.AI, Kimi, MiniMax, StepFun; Nous Portal and OpenAI Codex not logged in. `hermes model` is an interactive picker (`--refresh` re-fetches each provider's /v1/models); no non-interactive list. `hermes chat -m MODEL --provider PROVIDER` (example in help: `anthropic/claude-sonnet-4`); `hermes fallback`, `hermes moa` exist. Effort flag not in `chat --help` excerpt.

### Kimi CLI [L S7]
`kimi --version` 0.28.0; `-m, --model <model>` = "LLM model alias ... Defaults to default_model in config.toml"; `kimi provider list` → "No providers configured."; `kimi provider catalog` imports from models.dev; `kimi doctor`: config.toml OK, tui.toml absent. No effort flag in top-level help. Model ids k3 / kimi-for-coding not verifiable locally (no provider configured; config not read).

## Harness × model availability (exact id to pass)
| Model | Claude Code | Codex | Grok CLI | opencode `-m` | Hermes | Kimi | Cursor/agy/pi |
|---|---|---|---|---|---|---|---|
| Fable 5.1 | `claude-fable-5-1` or alias `fable`/`best` [V S3] | no | no | `opencode/claude-fable-5-1`, `openrouter/anthropic/claude-fable-5.1` | via anthropic key, id untested | no | n/a |
| Opus 5.5 | `claude-opus-5-5` or `opus` (default) [V S3] | no | no | `opencode/claude-opus-5-5` | idem | no | n/a |
| Sonnet 5.5 | `claude-sonnet-5-5` or `sonnet` | no | no | `opencode/claude-sonnet-5-5` | idem | no | n/a |
| Haiku 4.5 | `claude-haiku-4-5` or `haiku` | no | no | `opencode/claude-haiku-4-5` | idem | no | n/a |
| GPT-6.1-Sol | no | `gpt-6.1-sol` | no | `opencode/gpt-6.1-sol` | not logged in | no | n/a |
| GPT-6-Astra | no | `gpt-6-astra` | no | `opencode/gpt-6-astra` | no | no | n/a |
| GPT-6-Sol / Luna | no | `gpt-6-sol` / `gpt-6-luna` | no | `opencode/gpt-6-sol`, `opencode/gpt-6-luna`, `opencode-go/gpt-6-luna` | no | no | n/a |
| GPT-5.6-Sol/Terra/Luna | no | `gpt-5.6-sol` etc. | no | `opencode/gpt-5.6-*` | no | no | n/a |
| Grok 4.7 | no | no | `grok-4.7` (default) | `xai/grok-4.7`, `opencode/grok-4.7` | current auth path (model set: grok-4.3) | no | n/a |
| grok-4.7-build-fast | no | no | `grok-4.7-build-fast` | not listed | unknown | no | n/a |
| Grok 4.6 / 4.5 | no | no | `grok-4.6`, `grok-4.5` | `xai/grok-4.6`, `xai/grok-4.5` | unknown | no | n/a |
| Gemini 3.8 Flash / 3.1 Pro | no | no | no | `opencode/gemini-3.8-flash`, `opencode/gemini-3.1-pro` | no key | no | agy absent |
| Kimi K3 | no | no | no | `opencode/kimi-k3`, `opencode-go/kimi-k3` | no key | needs provider config | n/a |
| GLM-5.3 / MiniMax M3 / Qwen3.8-max / DeepSeek V4.1 | no | no | no | `opencode-go/glm-5.3`, `opencode-go/minimax-m3`, `opencode-go/qwen3.8-max`, `opencode-go/deepseek-v4.1-flash` | no key | no | n/a |
"no" = not offered by that harness natively. opencode access to Zen/Go/OpenRouter depends on the configured API keys (listed above); model presence in the catalog does not prove a working quota.

## Gaps
- Cursor CLI: binary is a dangling symlink (2025 build removed); Composer/Cursor model list unobtainable locally. Antigravity and pi not installed: no catalogs. Need another lane (web) for these.
- Kimi CLI: no configured provider; k3 / kimi-for-coding / -highspeed not confirmable locally. opencode shows kimi-k3 and kimi-k2.7-code only.
- Hermes: no non-interactive model list; effort enum not probed. `hermes model` is interactive (not run).
- Codex: no prices in cache; the exact `-m`/effort flag spelling was not probed (`codex --help` not run); cache client_version (0.159.2) differs from binary (0.144.6). "ultra" delegation semantics unverified. Whether this account can use Astra was not probed.
- opencode prices/contexts come from models.dev and Zen/Go routing, not vendor pages; verify against vendor pricing before budget decisions. Some values differ by route (Qwen3.8-max ctx 262K on Zen vs 1M on Go).
- Grok CLI effort enum and context/price not printed; "Grok 4.1 Fast / 2M" claim not found in any local catalog.
- No Haiku 5.5, Mythos, or gpt-6.1-astra/luna present in any catalog as of 2026-09-30.

## Sources
- [S1] `claude --version`, `claude --help` — local, 2026-09-30 — CLI version, --model/--effort/--fallback-model. Re-check on each Claude Code update.
- [S2] ~/.codex/models_cache.json (python3 parse, fetched_at 2026-09-30T07:25:00Z; not an auth file) — full codex catalog. Re-run whenever a new GPT ships; refreshes from server.
- [S3] https://code.claude.com/docs/en/model-config — accessed 2026-09-30 — aliases, resolution, effort, 1M, env pins, ids (via WebFetch summary; vendor-official [V], summarized by tool — quote-check if load-bearing).
- [S4] `grok --version`, `grok models`, `grok --help` — local, 2026-09-30.
- [S5] `opencode --version`, `opencode models [provider] --verbose`, `opencode auth list` (names only) — local, 2026-09-30; models.dev-backed. Re-run with `--refresh` when a model ships.
- [S6] `hermes --version`, `hermes --help`, `hermes model --help`, `hermes chat --help`, `hermes status` — local, 2026-09-30.
- [S7] `kimi --version`, `kimi --help`, `kimi provider list`, `kimi doctor` — local, 2026-09-30.
