# Research contract — every lane (read fully before starting)

Run: model-catalog refresh for the orchestrate skill, {DATE}. Trigger: {TRIGGER}. The orchestrator must pick a
harness (CLI) + model + effort per role (architect/reasoner, orchestrator/planner, long-horizon worker,
reviewer, cheap/mechanical worker, vision/computer-use worker, peer) from DATA, not vibes.

## Scope: harnesses and the models they expose (seed list — verify, correct, extend)
Seed = the current catalog ({CATALOG}, as of {AS_OF}) plus the trigger's models:
{SEED}
Today is {DATE}. Models change weekly: record the date you saw every number.

## Baseline and deltas (every lane)
The current catalog is the baseline. Your `## Summary` starts with **Changes vs catalog**: every number,
id, status, ranking or role pick your evidence moves (old → new, grade, source id). "No change" is a
finding too — say which rows you re-checked and found unchanged.

## Evidence grades (tag EVERY claim)
- [V] vendor-official (docs, pricing page, model card) · [B] independent benchmark (name + version + date)
- [P] practitioner report (who, where, date, link; note sample size / conflicts of interest) · [L] local probe
- Never invent or interpolate a number. Unknown = "unknown", not a guess. Quote key claims verbatim (≤25 words).
- Prefer contamination-resistant, independently run evals over vendor-reported ones; say which a number is.
- A JS-only page you cannot extract: screenshot it —
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,4000 --screenshot=.orchestrate/raw/shots/<name>.png "<url>"
  then Read the PNG and transcribe; cite the screenshot path. Crop with python PIL if needed.

## Rules
- Write ONLY your own output file (path in your brief) and screenshots under .orchestrate/raw/shots/.
  Write a partial file early and update it: a lane with nothing on disk after 20 minutes is treated as
  stuck and stopped, and whatever is on disk is what survives.
  Do not edit anything else in the repo. Do not commit.
- Never read credential or auth files (~/.codex/auth.json, ~/.grok/auth.json, keychains, .env).
- Probe only the harnesses orchestrate supports (claude, codex, grok, cursor-agent, agy, opencode, hermes,
  kimi, pi, muse); an unrelated CLI's `--version` can auto-update it (seen: droid, 2026-09-30).
- Tools: WebFetch, WebSearch, Bash (curl, headless Chrome), the firecrawl MCP tools if loaded (ToolSearch "firecrawl").
- No preamble, no narration: return only your schema. Quote literals verbatim; state uncertainty explicitly.

## Output file shape (markdown)
1. `## Summary` — 5–10 bullets: what matters for model SELECTION.
2. `## Findings` — tables first (one row per model where it fits), then notes. Every cell or row carries its grade + source id.
3. `## Gaps` — what you could not find or verify, and why.
4. `## Sources` — numbered: [S1] title — URL — accessed 2026-09-30 — what it gave — reliability note.
   Mark sources worth re-checking whenever a new model ships with (re-run).

## Return (INLINE, <200 words)
Status: DONE | DONE_WITH_CONCERNS | BLOCKED · file path · 3 most decision-relevant findings · biggest gap.
