# Prepare — clarify, equip, scout, set up (before any dispatch)

Purpose: Turn a request into a run the fleet can execute without guessing — decisions made by the user, tools found on the machine, gaps closed with the user's yes.

Read when:
- Every run, before triage settles a strategy (`prep=auto`, the default).

Skip when:
- `prep=off` (the inventory script still runs — it is free), or triage step 0 found the work solo (universal rule 8).

Inputs:
- The request or plan, the repository, `.orchestrate/capabilities.md`, your own tool list (MCP servers), the host's ASK_USER binding.

Produces:
- User-owned decisions on the journal, the run's toolchain (`board set tools=…`), approved installs done and verified, a scout report when the toolchain was undecided, and Task 0 when the environment needs setting up.

## Contents

- The order · P1 Clarify · P2 Equip · P3 Gaps · P4 Scout · P5 Set up · Bounds

Dispatching into an unclear request or a missing toolchain makes every worker guess, and every
guess is re-paid in review.

## The order

```
scripts/workspace; board init --goal "<request verbatim>" --prep auto   journal first, no plan yet
P2 equip    scripts/capabilities --refresh                   free, always
P1 clarify  rounds until the frontier is empty               only when the request is not a spec
P3 gaps     machine tools and paid services asked in a round only when a need is unmet
P4 scout    a research run on the toolchain                  only when the toolchain is undecided
→ triage (triage.md) → board init PLAN --resume --strategy … --kind … --tools "…"
→ flight plan, Task 0 first → P5 set up: Task 0 installs, configures, smoke-verifies the project tooling
```

Equip runs before clarify: a missing tool is a question in round 1, not a surprise in a lane. Init
comes first because a kickoff archives any journal it finds — a decision written before `board
init` would vanish. The plan is queued only at triage, once clarify has settled the scope: queued
earlier, a dropped task or a domain regroup would be stranded (the board has no drop command).

## P1 Clarify — grilling rounds

Fire when you cannot write down the goal, observable done, scope in and out, hard constraints and
the stop condition without guessing a *decision* — a loose idea, a plan with contradictions
(staged's pre-flight scan), a choice only the user owns (product behavior, cost, risk). A plan that
passes the brief probe-test (`shared-token-economy.md`) does not.

The technique is Matt Pocock's `grilling` (mattpocock/skills, MIT), adopted as the one interview
every strategy uses (`strategy-adversarial.md` and `strategy-advisor.md` point here):

1. Map the request as a **design tree**: each decision has the decisions that hang off it.
2. Ask in **rounds**. A round is the whole **frontier** — every open decision whose prerequisites
   are settled, and nothing that depends on an answer still open in the same round. Number and
   title each question; put your **recommended answer** on its own line, worded so "yes" accepts it:
   ```
   ❓ Q1 — Ship macOS first and add Windows after v1?
   ➡️ yes — one platform keeps the first release testable end to end
   ```
3. **Facts are yours; decisions are the user's.** Never ask what the repo, the machine or a quick
   lookup can answer — read it, or send an explorer subagent, and do not hold the round for it:
   only the questions downstream of a running lookup wait.
4. Recompute the frontier after every answer set. Push back on vague answers, name contradictions
   with earlier ones, and prefer a few rounds of many questions over many rounds of one. A user
   whose instructions say "one question at a time" gets one at a time.
5. **Ungrillable** questions — how a thing should look or feel — stop the talking: propose a
   throwaway prototype lane, then return with a one-line answer.
6. Done when the frontier is empty **and** the user confirms the understanding is shared. An agent
   that answers its own decision questions, or starts building when the questions run out, has
   broken the interview.

Record every answer: `board decide D-n "…" --why "…" --owner user`. A goal the interview sharpened is
re-set with the user's confirmation (`board set goal="…"`) — that is the goal the final gate judges.
Rounds are plain text in this format; a structured ask-user tool (Claude Code's takes four questions
at most) fits a closing yes/no, not a frontier. Headless (`-p`), nobody can answer: record each
would-be question as an assumption (`board decide D-n "…" --why "assumed: …"`) — the flight plan
counts them so the user can check them. `confirm=off` skips only the flight-plan gate: a user who is
present still gets the rounds.

## P2 Equip — what the machine already has

`scripts/capabilities --refresh` (zero tokens) writes `.orchestrate/capabilities.md` — CLIs with their
cost class and install hints, gaps, engines, every skill on disk for every host. Read down to
`## Skills on disk`, grep the rest for the task's words, and add your own MCP tools (the script
cannot see them).

- **Manual-only skills are invisible otherwise.** A skill marked `disable-model-invocation: true`
  never appears in your skill list and cannot load through the Skill tool, yet its SKILL.md is a
  file: read it, and use it for a need the approved `tools=` line names, briefing workers with the
  path (`read: <dir>/x-relay/SKILL.md — the X funnel`). Some skills are manual-only on purpose: one
  that sends, posts, deploys, buys or logs in is used only when the user named it in a clarify
  round, and its write actions keep their own approval rules.
- **Free and local first**, in this order: a local CLI or skill · host-native tools (web search and
  fetch) · a free API over curl (HN Algolia, Reddit `search.rss`, package registries) · a free-account
  tool the user already authed · **paid** (credits, API keys) — only as a named fallback the user
  approved, for what the free tiers cannot do.
- **Respect the established toolchain.** In an existing repo the manifests, lockfile and conventions
  files decide the test runner, linter and package manager. Changing them is a user decision with a
  reason, never a side effect of a run.
- Record the run's toolchain in one line — `board set tools="research: xrelay·ghrelay·web · tests: bun
  test · e2e: agent-browser"`. The flight plan prints it; briefs carry that line and the SKILL.md
  paths their task needs. Only scout and setup lanes read the whole `capabilities.md` — it runs to
  thousands of tokens.

## P3 Gaps — propose, never install unasked

A need with no installed tool, a skill whose CLI is missing (`capabilities.md` lists both), a free
tool that would beat the fallback — each becomes a question in the next round, with the exact
command and why:
```
❓ Q4 — Install ytrelay for the YouTube lane? `npm i -g youtube-relay-mcp`
➡️ yes — free and local; without it the lane falls back to scraping pages
```
Installing changes the user's machine: one batched yes per round, never a silent install, never
`sudo`, user-level installs over system ones, and logins stay the user's (suggest `! <command>`).
P3 covers **machine tools the agents themselves run** — a research CLI, a browser driver: after the
yes the controller runs the one command, verifies it (`<cli> --version` or its `doctor`), re-runs
`scripts/capabilities --refresh`, and records it (`board decide D-n "installed …" --owner user`).
**Project tooling** — dependencies and config in the repo — is Task 0's (P5). A paid tool is
proposed the same way, with its cost.

## P4 Scout — when the toolchain is undecided

Scout when the work needs tools the repo has not chosen: a new project or platform (desktop,
mobile, CLI, game), no test runner for the code being built, a capability the inventory lacks with
no obvious tool, or the user asks for "the best" setup. Never scout an established repo's existing
choices, and never scout what P2 already answers.

The scout is a small research run (`shared-research.md`) on the researcher prompt in scout mode,
lanes by source: X (`xrelay`), GitHub (`ghrelay`, `gh`), the web, registries, HN and Reddit. Its
answer is one table: per need (test runner, e2e/browser, lint/format, build/package, CI…) the pick,
the runner-up, the evidence, the install command, the adoption risk.

How it picks:
- **Track record beats novelty.** A tool weeks old with one viral post and no releases goes on the
  watchlist, not into the run — unless the user asks for the bleeding edge. Adopt what is
  maintained (releases or commits in the last ~90 days, issues answered), adopted (downloads,
  dependents, named users), licensed for the use, and backed by more than one maintainer or an org.
- **Fast wins ties.** A native (Rust, Go, Zig) runner or linter with equal correctness and ecosystem
  fit beats the slower one — and a speed claim needs a benchmark you can open, never a post.
- **Fewest tools that cover the needs.** Every added tool is setup, config and a failure surface.

The scout is a multi-agent dispatch, so it is announced before it runs: its lanes, models and budget
go into a clarify round as their own question, and the yes is its launch approval
(`board plan approved --msg "scout"`). Its lanes are Task 0's subtasks — `board todo 0.1 "scout: X
lane"`, dispatched `--role researcher` (`research-0.1`) — so the build plan's numbering stays
intact. A lane is accepted when the fact-check of the scout report built from it passes: `board gate
0.N --kind factcheck --verdict ok --findings research/factcheck.md`, then `board done 0.N` (a done
lane with no gate is a `board check` finding). Its proposal returns as the next round's questions,
one per tool choice.

## P5 Set up — Task 0

Approved project tooling becomes **Task 0: environment** — `## Task 0: environment` in the plan, the
approved flight plan's first node. A worker runs it in the main tree on the run branch (no
worktree): every later worktree is cut after it lands, so it carries the toolchain, and the
refreshed recipes land in the main `.orchestrate/`. Its brief lists the exact approved commands
and packages under Must NOT install anything else — a further need (a browser download, an extra
dev dependency) comes back as an ask. It installs, configures (test runner wired, a smoke test that
runs), verifies (`board exec 0 --name smoke -- <cmd>`), and refreshes `scripts/toolbox` and
`scripts/capabilities`. Every implementation task waits for it — a hard dependency
(`strategy-parallel.md`). One toolchain per run, decided once (`board decide D-tools "…"`): workers
never pick their own test runner.

## Bounds

- Prep is cheap by construction: the inventory is a script, the interview costs the user minutes,
  and the scout runs only on an undecided toolchain.
- The interview has no question cap; scope is the control. Dozens of rounds mean the request is
  several requests — split it, then grill each one.
- `prep=full` forces the interview and the scout; `prep=off` skips both (the inventory still runs).
- Prep leaves records, not chat: decisions on the journal, the toolchain in `tools`, installs
  verified, the scout's report under `.orchestrate/research/`.
