# Lane E — Verification, review independence, research evidence, clarification

Method: 16 posts → resolved every t.co by redirect header, then read repos with `gh api` / `ghrelay`
and pages with firecrawl. Compared against `shared-review-gates.md`, `prompt-verifier.md`,
`prompt-spec-reviewer.md`, `prompt-quality-reviewer.md`, `shared-research.md`, `prompt-researcher.md`,
`shared-prepare.md`, `triage.md`, `strategy-{staged,parallel,team}.md`, `shared-isolation.md`,
`scripts/{board,toolbox,review-package}`. Prior sweeps (`2026-08-*`, `2026-09-review-sweep`,
`foundations.md`) never mention scoped re-review, builder check, write-surface guards, claim-level
verification, repro-first fixing or per-repo verify recipes; the one overlap is AI-Builder-Club
`verifier-setup`, already adopted verbatim as the fresh-verifier template (`foundations.md:258`).

## Top candidates (ranked, 3–6)

1. **Red-first: a recorded base-red run before any fix or acceptance check is trusted** — from Matt
   Pocock `diagnosing-bugs` (repo-read), OpenAI harness-engineering (docs: video of the failure, then
   of the fix), Apodex 1.1 §3.1.1 (paper: fail-to-pass tests must fail on the base state, pass-to-pass
   must pass on both; "tests passing before the fix point to incorrect test selection") · value **H** ·
   effort **S–M** · lands: `triage.md:48` (the `fix` row names a shape
   but no play) → new `references/shared-fix.md`; `strategy-staged.md:51` / `strategy-parallel.md:62`
   (criteria-before-code); `prompt-implementer.md` (tagged debug logs); `board exec N --name
   accept-base -- <cmd>` already exists, so the proof is one journaled exit code, plus an optional
   `board check` finding. Why it beats what we have: criteria-before-code makes a *different agent*
   write the checks but never proves a check **can fail** — "a gate that can't fail the work isn't a
   gate" (`shared-review-gates.md`) applies to acceptance checks too — and `fix` has no
   reproduce-first discipline.
   The play, from `diagnosing-bugs`: (1) a tight, deterministic, agent-runnable, *red-capable* command
   you have already run once — no hypothesis before it exists; (2) reproduce, then minimise until every
   remaining element is load-bearing; (3) 3–5 ranked **falsifiable** hypotheses ("if X is the cause,
   changing Y makes it vanish"), shown to the user if one is present, not blocking if AFK (`strategy-team.md:37`
   debug mode has the three hypothesis-owning investigators, not the prediction format); (4) one-variable
   probes, debug logs tagged `[DEBUG-xxxx]` so cleanup is one grep; (5) regression test at the *correct
   seam* — no correct seam is itself the finding — watch it fail, prove a forced red landed (diff
   against pristine), fix, watch it pass; (6) cleanup checklist, the winning hypothesis named in the
   commit. For UI work the failing run is the "before" recording, the verifier's pass the "after";
   the PR embeds both.

2. **A durable per-repo verification recipe — Launch · Doctor · Isolate · Drive · Evidence · Cleanup ·
   Gotchas — made in Prepare, read by the verifier** — from tester-army `create-verification-skill`
   (repo-read), AI-Builder-Club `verifier-setup` + `setup-codebase-harness` (repo-read; this is what
   jasonzhou1993's post links), Warp `verify-pr` (repo-read), BHolmes `test-desktop-app` (repo-read),
   OpenAI harness-engineering (docs) · value **H** (UI/product runs) · effort **M** · lands:
   `shared-prepare.md` P2 (probe: launch command, driver, evidence dir, auth helper, regression
   commands, local-vs-sandbox) → P3 (each gap a question) → P5/Task 0 writes `.orchestrate/verify.md`
   (or, on the user's yes, a repo-local `verify-<app>` skill) and *runs it once* ("a generated skill that
   was never executed is a draft, not a deliverable"); `scripts/capabilities` flags existing
   `verify-*` / `metadata.verification: true` skills (Warp's discovery marker); flight plan prints a
   `verify:` strip beside `tools`; `prompt-verifier.md:34` reads the recipe instead of the controller
   re-composing "Start/attach · Driver · Walk" per dispatch. Why it beats what we have: `scripts/toolbox`
   stops at structure/outline recipes, the verifier's context is rebuilt by hand each dispatch, nothing
   separates "the app is down" from "the feature is broken" before a verifier is spent, and what a
   run learns dies with its archive.
   Pieces worth taking whole: **Doctor** — one model-free, read-only check that answers "is this
   instance worth driving?" (smoke test exit 0), run through `board exec N --name doctor` *before*
   dispatching a verifier; failure = environment, so `blocked`, never `fail`. **Proof standards** —
   exercise the real user path not test-only endpoints; capture the action *and* resulting state;
   verify side effects (files, rows, messages) in their stores; when the safe path is a dry run, verify
   what it skips by watching files/network/refs, not its name. **Isolate** (the concurrency half; today
   `shared-isolation.md` only says dev servers die with the run, `shared-isolation.md:49`, and nothing
   covers *concurrent* verifiers although v1.31.0 made concurrency the default): the controller starts
   the shared stack once and lanes attach (`reuseExisting`); otherwise port 0 / `PORT=$((4000+N))` per
   lane; one disposable account per lane ("explorers that share an account report each other's edits as
   bugs"); a single-instance resource (one DB, one simulator) is single-flight like the relay tools;
   the first finisher must not tear the stack down under the rest; stop only what you started, never
   by process name (`board reap --keep` for the shared stack). **Gotchas** — what reads as broken but
   is not — appended from `board learn --kind gotcha` at finish. Watchlist, not pick: tester-army/e2e
   itself (10k stars but created 2026-07-22 — fails Prepare's own track-record rule); the recipe is
   tool-agnostic.

3. **Claim-sharded asymmetric fact-check with independent-source triangulation, a claim ledger and a
   targeted follow-up wave** — from Apodex 1.0 blog + 1.1 paper §3.2.3–3.2.5 (docs), Feynman
   `verifier`/`reviewer`/`deepresearch` + its deterministic eval (repo-read) · value **M–H** (research
   runs) · effort **S–M** · lands: `prompt-verifier.md` fact-check mode, `shared-research.md` step 5 and
   Bounds, `prompt-researcher.md` synthesis mode, one stdlib `scripts/cite-check`. Why it beats what we
   have: our fact-check is one verifier re-deriving every load-bearing claim from the *same cited
   source* (`prompt-verifier.md` fact-check mode) — Apodex's argument is that a verifier of equal
   capability asked to re-solve the whole thing becomes "a second, equally unconstrained chain of
   errors"; ours never asks for a second source, lets a single-source load-bearing claim ship, and
   sends a refuted claim back to the same synthesizer with no new evidence-gathering.
   Changes: (a) **shard** — one narrow verifier per claim cluster in parallel, each given *one claim,
   its evidence and the constraint* and told to attack it: counterexample search, atomic details
   (names/dates/numbers/versions), triangulation with a genuinely independent source *class*; verdicts
   cast through the existing `board vote` quorum (`consensus` = any-deny); verdict vocabulary gains
   `single-source`; (b) **claim ledger** `research/claims.md`, each claim load-bearing / corroborated /
   disputed / unresolved; the synthesizer qualifies or omits what it cannot trace, returns a missing
   load-bearing dependency to the controller instead of "filling it with plausible prose", and cannot
   overwrite a verifier's verdict; (c) **one targeted follow-up wave** — a refuted, unverifiable or
   single-source load-bearing claim gets a new lane on a different source class or query framing
   (Apodex "Adaptive Max Team Effort": extra work only on weak, contested or load-bearing claims);
   (d) **deterministic pre-pass** through `board exec N --name cites`: every `[N]` resolves, no orphan
   source, every sentence carrying a number/benchmark/"improvement" claim cites, every URL's HTTP
   status, arXiv/DOI title+year+first author matched against two indexes (Feynman `verifier.md`) — an
   "anchor" in the sense of `shared-review-gates.md` (a fact no agent produced); (e) a provenance
   sidecar — sources consulted / accepted / rejected, `Verification: PASS | PASS WITH NOTES | BLOCKED` —
   and a `Removed unsupported claims` section when material was cut. Evidence caveat: Apodex's SOTA
   numbers are vendor-reported [V]; the heavy-duty team itself is not open source (the
   `ApodexAI/AgentHarness` repo is the benchmark harness only), so the mechanism rests on the paper text
   and Feynman's open prompts.

4. **Deterministic validators at lane boundaries — write-surface guard + review-citation lint +
   evidence validity** — from Warp `oz-for-oss` (repo-read: `oz/repo_local.py::assert_write_surface`
   raises `WriteSurfaceViolation` on any changed path outside the loop's allowed prefixes before push;
   `oz/review_validation.py` parses diff hunks and drops reviewer comments whose path:line is not a
   commentable diff line, reviewers being handed `[OLD:n]/[NEW:n]`-annotated diffs) and Impeccable's
   finish-reviewer "check 0" (repo-read: required captures must exist and be valid *before* any judging;
   "a verdict derived from a broken capture launders the breakage into an approval") · value **M** ·
   effort **S–M** · lands: `scripts/board` (`return`: `git diff --name-only` of the returned commits vs
   the stint's `--owns` globs, and an empty diff for read-only roles — researcher, spec/quality
   reviewer, verifier — becomes a `check` finding and `board done` refuses it, like a failed gate),
   `scripts/review-package` (annotated diff), a small `review-lint` (every `path:line` in a findings
   file must exist in the diff package; unresolvable → flagged for the controller, not dropped),
   `board check` (evidence artifacts non-empty, not just present). Why it beats what we have:
   `--owns` is declarative today (`scripts/board:584`, shown by `board peers`, never compared with what
   the lane wrote), read-only roles rest on prompt rules and sandbox flags, `board check` verifies
   that an artifact named in the ledger exists (`scripts/board:3032`) but not that it is valid, and a
   reviewer's `file:line` is believed.

5. **Scoped re-review and a contested-finding path** — from obra/superpowers `re-review-prompt.md`
   (repo-read; added 2026-07-15), `receiving-code-review` (repo-read), BHolmes `review-cycle`
   (repo-read) · value **M** · effort **S** · lands: new `references/prompt-re-reviewer.md` (~45 lines),
   one paragraph in `shared-review-gates.md` §2, `strategy-staged.md:85-92`. Why it beats what we have:
   a fix round re-runs the full reviewer template (`prompt-spec-reviewer.md` `-r<round>`) and the fixer
   has no way to say "this finding is wrong" — `shared-review-gates.md` forbids letting rationale
   downgrade severity, so a false positive burns rounds until the tier-escalation cap even though a
   stronger *implementer* cannot fix a wrong *reviewer*.
   Re-reviewer: inputs = brief + the previous findings verbatim + the fix diff since the head the last
   review saw + the fix report; one verdict per finding, ADDRESSED / NOT ADDRESSED with file:line
   ("attempted" is not addressed); "new breakage in the fix diff"; "out-of-scope observations" —
   ledgered for the final gate, never extending the loop; no suite re-runs; may not spawn reviewers;
   cheap-to-mid tier for small diffs (still pinned and logged, still cross-family where the host
   allows). Interaction: a failed gate still resets the cycle, so the *other* gate runs full on the new
   head; the scoped pass replaces only the repeat of the gate that failed. Dispute path: the fixer may
   return a finding as `DISPUTED` with evidence **once**; the controller adjudicates (directly, or
   `review=consensus:3` on that one finding), records `board decide`, and the closed finding is shown to
   the re-reviewer as adjudicated; a reviewer re-raising it without new evidence is surfaced to the user
   rather than looped (BHolmes: "explain the evidence once, then surface the disagreement").

6. **Builder check at the end of clarify, and an exit for decisions the user cannot make alone** — from
   obra/superpowers v7.0.0 brainstorming `builder-check-prompt.md` (repo-read; released 2026-10-10) and
   Matt Pocock `to-questionnaire` (repo-read) · value **M** · effort **S** · lands: `shared-prepare.md`
   P1 step 6 + new `references/prompt-builder-check.md` (~12 lines). Why it beats what we have: P1's
   exit test is "frontier empty and the user confirms" — both judged by the agent that holds the
   context; the plan-veto reviewer reads a plan, after planning cost. Builder check: a fresh cheap
   subagent sees only goal + decisions + capabilities, is told it cannot talk to the author, and
   reports *only* the ranked questions where a wrong guess would change the plan ("nothing important
   left" is valid). The controller sorts them: answered already → add to the record · minor → settle it
   and `board decide D-n "…" --why "assumed: …"` (the flight plan already counts assumptions) · the
   user's → one last round. `to-questionnaire`: a decision the user cannot answer ("grill the *send*,
   not the subject": who gets it, what you need back) becomes `.orchestrate/questionnaire-<slug>.md` for a
   named person, and the branch is parked as `board decide D-n "pending: <who>"` while independent work
   proceeds.

Also, smaller (details under the tools): independence class recorded per gate and a loud banner when a
gate ran degraded (Impeccable) · "overfitting to the run" in the quality reviewer (BHolmes `/simplify`) ·
post-run retro that turns recurring *mechanical* review findings into deterministic checks (Matt `retro`,
OpenAI) · research-quality eval with no LLM judge (Feynman `evals/`) · persisted open-question tree
(wayfinder) · phase-boundary note in `shared-handoff.md` · ADR promotion at finish · same-error-twice
rule in the implementer prompt.

## What batch-grill-me adds beyond Prepare P1: nothing

`/batch-grill-me` was an in-progress skill added 2026-07-16 (commit c70cb091); the commit that
"Fold[s] the batch-grill-me experiment into grilling and delete[s] it" (a4b2009a) is authored the same
day; the grilling docs page says "There is no `batch-grill-me` to install". The merged `grilling` skill is: design tree · rounds that ask
the whole frontier · numbered questions, each with a recommended answer · facts found by a sub-agent
that never holds the round (only questions downstream of it wait) · done when the frontier is empty and
the user confirms. `shared-prepare.md` P1 contains every one of those (and the later "word each question
so yes accepts the recommendation", Matt's #1193 of 2026-10-07). What is left is cosmetic (Matt separates
questions with a horizontal rule and bolds the title) plus the limits his own docs concede: the frontier
is chosen by judgement, not computed — "it can put two questions in one round and only later find one
answer should have changed the other"; weaker/faster models skip the confirmation gate (his fix is a
line in AGENTS.md; ours is the flight-plan approval, which is mechanical); and he declines an async
variant because "a grilling session that nobody answers has produced the agent's opinion rather than
yours" — which is exactly why P1's headless path labels answers `assumed:` and counts them on the
flight plan. The real clarify deltas are candidate 6, `wayfinder` persistence and the AI-Q clarifier's
"clarify the output type" (below).

## Tools

### Matt Pocock's skills — grilling · wayfinder · to-questionnaire · ask-matt · code-review · retro · diagnosing-bugs
- Links: github.com/mattpocock/skills (289k stars, pushed 2026-10-13, MIT)
- Evidence: repo-read — `grilling`, `grill-me`, `grill-with-docs`, `domain-modeling` (+ADR-FORMAT), `to-questionnaire`,
  `wait-what`, `wayfinder`, `research`, `code-review`, `retro`, `handoff`, `implement`, `implement-spec`,
  `diagnosing-bugs`, `loop-me`, `ask-matt/PHASE-BOUNDARIES.md`, `docs/productivity/grilling.md`, and the
  git history of the grilling skill. The 2026-07-22 decision-tree post is `PHASE-BOUNDARIES.md`.
- Mechanism: **wayfinder** externalises the design tree as issues on the tracker — typed HITL
  (grilling, prototype) or AFK (research, task) — with native blocking edges so the *frontier is
  computed by the tracker* (open, unblocked, unclaimed), a claim-by-assignee rule for concurrent
  sessions, "Decisions so far" as an index (a decision lives in exactly one place), "Not yet specified"
  (fog) and "Out of scope" sections, and "never resolve more than one ticket per session" except
  research. **Phase boundaries**: a five-way tree applied at the boundary between phases, first yes
  wins — continue (free; the next phase needs this one as a primary source, or ~150k tokens of smart zone
  remain) → `/clear` (context disposable; one-way: you lose the *why*) → `/handoff` (only when something
  must *travel*: new harness, new directory, colleague, side-task fork) → subagent (AFK-able, e.g.
  automated review) → `/compact` last ("default, not the first reach"). **code-review** runs Standards
  and Spec as two parallel sub-agents, carries a fixed Fowler smell baseline as labelled judgement calls
  that a documented repo standard overrides, and requires finding every standards source in the repo
  first. **retro** sorts a session's failures into navigation / automated checks / coding standards /
  AGENTS.md bloat / tool economy / no-ops / information access and says "default to building the check
  over writing the rule" for mechanical violations. **domain-modeling** writes GLOSSARY.md and ADRs as
  decisions crystallise (ADR only if hard to reverse, surprising without context, and a real trade-off).
- Versus orchestrate: **have** — frontier rounds, facts-to-a-subagent, recommended answers, no cap
  (`shared-prepare.md` P1); graph-frontier parallel builds (`implement-spec` ≈ `strategy-parallel.md`);
  `handoff` (`shared-handoff.md`, `board resume`); `research` (thin next to `shared-research.md`).
  **partial** — phase boundaries (`shared-handoff.md` covers handoff and the probe-test, not the
  continue-first ordering or the one-way cost of `/clear`); open questions (only answers are journaled —
  a session that dies mid-clarify loses the unanswered tree); standards discovery (`scripts/toolbox`
  lists CLAUDE.md / AGENTS.md / CONTRIBUTING.md / .editorconfig; `prompt-quality-reviewer.md` lists
  "repository conventions" as an input but nothing says to find a CODING_STANDARDS-style file).
  **missing** — repro-first fixing (candidate 1), `to-questionnaire` (candidate 6), review-finding → deterministic-check promotion.
- Adopt: candidate 1 (value H, effort S–M) and the `to-questionnaire` half of candidate 6. Smaller:
  (a) a 4-line phase-boundary note in `shared-handoff.md` (value L, effort S) — continue-first, `/clear`
  only when the *why* is already in `board decide … --why`; (b) add `CODING_STANDARDS.md` / `STYLE*.md`
  to `scripts/toolbox` and tell the controller to paste them into the quality-reviewer brief, with the
  smell list as heuristics the repo overrides (value L–M, effort S); (c) at `board finish` print "findings
  a mechanical check could have caught" — recurring reviewer findings classified mechanical (lint/hook/CI)
  vs judgement vs navigation, so `prompt-evolve.md` gets a fifth lever, REPO (value M, effort S–M;
  corroborated by OpenAI "when documentation falls short, promote the rule into code" and AIBC "custom
  lints with remediation messages"); (d) wayfinder persistence: only if clarify sessions outlive a
  context — record open questions with `--after` edges like `launch --after`, which also makes the
  frontier computable and fixes the "judged, not computed" limit (value L–M, effort M; defer).

### obra/superpowers — v7 brainstorming, SDD re-review, receiving-code-review
- Links: github.com/obra/superpowers (299k stars, pushed 2026-10-10, MIT)
- Evidence: repo-read (`brainstorming/SKILL.md` + `builder-check-prompt.md`, `subagent-driven-development/re-review-prompt.md`,
  `receiving-code-review/SKILL.md`; commit dates). shannholmberg's post is a summary of the pre-v7 brainstorming.
- Mechanism: v7 brainstorming is the *opposite* philosophy to P1 — one open question per message anchored
  in a real moment, recon only when offered, "think wide privately", playback in 200–300-word chunks that
  alternate with questions ("mark anything you're guessing as your guess; only what they said goes in as
  theirs"), size the work, spike to feel things out, HARD-GATE (no building, scaffolding or installs before
  approval), then the builder check. `receiving-code-review`: restate, verify against the codebase, push
  back with reasoning, ask about *all* unclear items before implementing any, YAGNI-grep before "implementing
  properly".
- Versus orchestrate: P1 deliberately chose rounds with recommended answers; the playback chunking and the
  one-question mode are only needed when a user's instructions ask for them (P1 already allows it). The
  HARD-GATE is the flight-plan gate plus "never install unasked" (`shared-prepare.md` P3). **Missing:**
  builder check; scoped re-review; any dispute path.
- Adopt: candidates 5 and 6 (value M each, effort S each). No: the visual companion (out of scope; the
  "ungrillable → prototype lane" rule covers it) and `diagnosing-superpowers` (LLM analyst lenses over
  session transcripts — heavy; `board postmortem` is deterministic and free).

### tester-army/e2e `create-verification-skill` (+ the `e2e` runner)
- Links: github.com/tester-army/e2e (10.0k stars, created 2026-07-22, pushed 2026-10-13, Apache-2.0)
- Evidence: repo-read — `skills/create-verification-skill/SKILL.md` (155 lines), `skills/e2e/references/bug-bash.md`,
  `docs/coding-agents.mdx`. The e2e runtime, its step cache and `explore` engine were not read.
- Mechanism: interview the *repo*, not the user (surface, run, e2e state, observe, isolate, name); write
  `.agents/skills/verify-<app>/` with sections Read-first · Launch · Doctor · Drive (live over MCP vs
  scripted) · Evidence (trace page per failed test; `.e2e/results/` is cleared by the next run, so a proof
  that must outlive it goes to `--output .e2e/proof/<name>`) · Bug bash · Cleanup · Helpers; a feature
  map with one file per user-facing feature (sub-features · how to get to it · driving · **Proof** — the
  observable end state on screen *and* in the side-effect store · charters · gotchas); then **run the
  generated skill's own instructions once** before handing over, including "the steps prove the charter
  ran, not the exit code: `1` is also what a run that executed no step exits with". The **bug bash**
  (`bug-bash.md`): charters (one area × one posture persona), fan-out as background shell jobs four at a
  time, merge, **triage into buckets with a named settling check** (explorer artifact · environment ·
  design · fixture · candidate), then **a finding counts only when a repro test fails with
  `ASSERTION_FAILED` on the assertion that encodes it** — a locator error or timeout means the test is
  wrong, a passing test means the bug did not reproduce; "never report an unverified finding as a bug".
- Versus orchestrate: `prompt-verifier.md` + `shared-review-gates.md` §Verification are **have** for the
  fresh read-only verifier, the four-state verdict, screenshot+video, PR evidence. **Missing:** the
  durable recipe, Doctor, proof standards, isolation for concurrent drivers (candidate 2), and the QA
  "bug bash" play — `kind=review` is "parallel lenses" over code (`triage.md`), nothing fans charters over a
  running app and then makes every finding earn its place by a failing repro.
- Adopt: candidate 2 (value H, effort M). The bug-bash triage taxonomy and the "finding needs an
  executable repro" bar fit `shared-review-gates.md` as the controller's rejection vocabulary for
  behavioural findings (value L–M, effort S). A full `kind=review` bug-bash play is optional, only once a
  repo has a recipe (effort M). Pick/watchlist: the e2e runner is a scout *watchlist* entry by Prepare's rule.

### AI-Builder-Club/skills `verifier-setup` (jasonzhou1993's post) — plus `setup-codebase-harness`
- Links: github.com/AI-Builder-Club/skills (1.3k stars, created 2026-06-14, pushed 2026-09-15, no license file)
- Evidence: repo-read — `verifier-setup/SKILL.md`, `assets/verify.template.md`, `setup-codebase-harness/SKILL.md`.
  `dev-local-setup`, `crabbox-setup`, `e2e-setup`, `agent-context-audit` listed, not read.
- Mechanism: a *setup* skill that inventories first ("check before you add anything; adapt, never clobber"),
  then ensures a one-command dev stack (`dev-local`), asks local vs per-agent cloud sandbox (crabbox),
  confirms the driver (`playwright-cli`), and generates a committed `/verify` skill whose SOP is: bring the
  stack up once → fresh read-only verifier drives the app → screenshot **and** video to `evidence/` → fix →
  fresh verifier, cap ~3 → regression sweep run by the controller → PR with the screenshot inline, the video
  linked (GitHub will not play uploaded video from automation), uploaded to a stable URL (`pr-evidence`
  prerelease via `gh release upload` by default). `setup-codebase-harness` frames the pillars legible /
  executable / verifiable, with mechanical lints that inject the remediation into agent context.
- Versus orchestrate: the verifier *template* is **have** (adopted verbatim — `foundations.md:258`). New
  since then: the **generator** and the **inventory-first** discipline, the sandbox-per-agent argument
  ("per-worktree local doesn't fix fixed ports, one Docker daemon, one DB — the worktrees still share the
  host"), and the evidence-upload step. `shared-review-gates.md` says "PRs ship with the evidence" but not how.
- Adopt: candidate 2 (value H, effort M); one line on stable-URL evidence upload in `shared-review-gates.md`
  (value L, effort S). No: crabbox-style cloud boxes (a product dependency; the isolation rules in candidate 2
  cover local use).

### Warp / BHolmesDev — `oz-for-oss` loops (triage, spec, review, verify, self-improvement), `/taste-review`, `/simplify`, `/done`, `review-cycle`
- Links: github.com/warpdotdev/oz-for-oss (313 stars, pushed 2026-09-17), github.com/bholmesdev/skills (177 stars,
  pushed 2026-08-07, MIT), bholmesdev/hubble.md `.agents/skills`
- Evidence: repo-read — `update-pr-review/SKILL.md`, `oz/repo_local.py` (`assert_write_surface`),
  `oz/review_validation.py` (head and function list; `validate_review_payload` body not read), `verify-pr/SKILL.md`;
  BHolmes `taste-review`, `simplify`, `done`, hubble `review-cycle`, `test-desktop-app`, `implementation`.
  `/test-app` (the tweet's third skill) is in no public repo I could find — post-only.
- Mechanism: the self-improving loops are `update-triage`, `update-dedupe`, `update-pr-review`: a script
  aggregates a week of **human feedback on the agent's outputs** (replies calling a review comment wrong,
  severity/scope/line-targeting corrections, human overrides, human-only threads) into JSON; the skill
  changes only the repo-local `-local` companion skills, never the shared core contract; evidence rules —
  "multiple threads or a strong explicit maintainer statement", "do not weaken correctness, security or
  data-loss checks because of a single disagreement", "avoid encoding one-off preferences as universal
  rules"; commits to a branch it does not push — the runner diffs against allowed prefixes first and aborts
  on a violation, then opens a PR with a named reviewer. `verify-pr` discovers repo verification skills by a
  `metadata: verification: true` frontmatter marker, runs each, and aggregates one `verification_report.json`
  (`passed | failed | mixed`, one entry per skill, `skipped` allowed). `/simplify`: names and comments are
  prose (Orwell), derivable state is not stored, and **no backward compatibility with code that never shipped**;
  "if a change only makes sense to someone who watched it happen, it is overfitted". `/taste-review`: shells
  out to `claude -p` from another harness for a cross-model taste call. `/done`: atomic commits, rebase the
  worktree, PR or merge, close the ticket, remove the worktree.
- Versus orchestrate: `/taste-review` ≈ **have** (`strategy-advisor.md`, `strategy-xcli.md` second opinions; it
  also reads a subscription token from the Keychain, which our rules forbid); `/done` ≈ **have** (integrator,
  finish, `board reap`). `prompt-evolve.md` improves the loop contract from run history but has no
  external-feedback ingestion, no core-vs-local split, and a **prose** "never touch the Goal" instead of a
  mechanical write-surface check. **Missing:** write-surface guard and citation lint (candidate 4), the
  dispute path (candidate 5), the `verification: true` discovery marker (candidate 2), overfitting check.
- Adopt: candidates 4, 5 and the marker in 2. `prompt-quality-reviewer.md` "Judge": add one bullet —
  "overfitting to the run: names or comments that need the brief or conversation to be understood; a shim
  for an older signature that only existed earlier in this run" (value M, effort S; multi-agent runs
  produce exactly this). Self-improvement from review feedback is worth a later look only when orchestrate
  has a feedback signal to learn from (accepted vs adjudicated-invalid findings per lens and model could be
  derived from the journal once candidate 5 exists) — defer.

### Feynman — open-source research agent
- Links: github.com/getcompanion-ai/feynman (9.96k stars, created 2026-03-19, pushed 2026-10-13, MIT)
- Evidence: repo-read — `.feynman/agents/{researcher,verifier,reviewer,writer}.md`, `.feynman/SYSTEM.md`,
  `prompts/{deepresearch,audit}.md`, `evals/README.md` + a result file, `skills/paper-code-audit`.
- Mechanism: pipeline = plan file with a *scale decision before owners are assigned* ("what is X" explainers get
  direct search by the lead; no subagents unless asked) → researchers (parallel, capped 2/3–4/4–6 by
  question shape) → the lead drafts ("do not delegate synthesis") → **verifier** (anchors every claim with
  `[N]`, no orphan citations or sources, fetches every URL, cross-checks arXiv/DOI against two indexes,
  removes or TODOs unsupported numbers, "refuse fake certainty": the words *verified/confirmed/reproduced* only
  with the evidence) → **reviewer** (verification pass, FATAL/MAJOR/MINOR, "single-source critical claims" and
  "overstated confidence" named, "keep looking after the first problem") → fix FATAL and run one more review
  → deliver with a provenance sidecar (sources consulted/accepted/rejected, `Verification: PASS | PASS WITH
  NOTES | BLOCKED`). The verifier and reviewer never run in the same parallel call. **`evals/`**: 12 fixed
  questions, deterministic scoring with no LLM judge — do the cited arXiv IDs/DOIs resolve, does the
  resolved title appear on the line carrying the ID (catches an ID attached to the wrong paper), recall of
  expected key papers, `done` = final file + provenance sidecar exist, tokens/cost summed over every session
  file — and the rule "run it before and after any prompt change, commit both result files".
- Versus orchestrate: **have** — direct-search for small questions (`shared-research.md` "Skip when"),
  graded claims, fresh verifier with lineage ≠ synthesizer, `blocked` as a first-class verdict,
  coverage/gaps section, data-not-instructions. **Missing:** the mechanical citation lint and two-index
  identifier check, the provenance sidecar's *rejected* count, single-source flagging, and any
  deterministic regression eval for the research play — `evals/` here holds activation, traversal,
  compression and behavioural-assertion fixtures (`evals/output/cases.json` has research cases judged by
  rubric); nothing scores a research report's citations mechanically.
- Adopt: the citation lint, single-source flag, provenance sidecar and `Removed unsupported claims` section
  are in candidate 3. A fixed-question research eval scored with stdlib (IDs resolve, title match, key-source
  recall, sidecar exists, tokens from receipts) under `evals/research/` would catch prompt regressions in the
  research play before a release (value M for the maintainer, effort M).

### Apodex 1.0 / 1.1 — deep-research agent team
- Links: apodex.ai, apodex.com/blog/apodex-1.0 (2026-06-08), arXiv 2608.23283 (Apodex 1.1), github.com/ApodexAI/AgentHarness (459 stars, benchmark harness)
- Evidence: docs — the 1.0 blog in full and §3.1–3.3 of the 1.1 paper (3.1.1 fail-to-pass, 3.2.3–3.2.5
  verification/effort/synthesis, 3.3.2 task board). The team code is not public; no tech report PDF read.
- Mechanism: a main agent decomposes and *asynchronously* spawns specialised sub-agents (own context, prompt,
  tools) for retrieval **and** verification; reports land in a shared report pool whose status table the
  orchestrator reads without blocking on the slowest; verification agents fire on events — **two reports disagree**
  (conflict reviewer), **a claim needs grounding** (fact checker), **a draft is ready** (draft reviewer) — then a
  global verifier reasons over the assembled evidence ("from *which answer is most agreed upon* to *what does the
  full body of evidence support*"). 1.1 adds **asymmetric verification** (a verifier gets one claim + its
  evidence + the delivery constraint and attacks it; "the asymmetry is in the task, not necessarily in model
  size"), **adaptive team effort**, a **claim–evidence graph** that marks claims load-bearing / corroborated /
  disputed / unresolved before a writer drafts, and a task board (§3.3.2) that is also a runtime
  finalization gate (answer accepted only when every item is resolved or cancelled; planning mode
  additionally requires one delegated branch and an independent verifier, and denies dispatch and file
  mutation until planning finishes — what `board check` detects after the fact as "flight plan never
  approved yet agents were dispatched", `scripts/board:3088`). Vendor-reported numbers (BrowseComp 90.3, up to 150
  sub-agents over 15,000 steps) are [V].
- Versus orchestrate: the board-as-finalization-gate is **have** (`board check --finish`, the governance
  floor, "done lane with no gate"). Event-triggered *mid-run* verification (a conflict reviewer when two lanes
  disagree) is **missing** — lane files record "Dissent" but only the final synthesizer sees it. Claim-level
  ledger, asymmetric verification and the follow-up wave: **missing** (candidate 3).
- Adopt: candidate 3. Also consider a conflict reviewer: when two lane files hold opposing findings on a
  load-bearing claim, `board send` it to a fresh arbiter before synthesis rather than leaving it to the report
  (value L–M, effort S).

### NVIDIA AI-Q agent skill (Deep Researcher Agent Blueprint)
- Links: github.com/NVIDIA-AI-Blueprints/aiq (897 stars, pushed 2026-10-09, Apache-2.0); skill at `skills/deep-researcher-research`
- Evidence: repo-read — the skill (`SKILL.md`, `BENCHMARK.md`), README, `docs/source/architecture/agents/clarifier.md`.
  The planner/researcher/writer prompts were not read.
- Mechanism: the "agent skill" is a thin client for a deployed backend (NeMo Agent Toolkit + LangChain Deep
  Agents, Nemotron models): `health` check first, name the exact backend URL before sending a query (non-local
  needs the user's yes), async job + poll, stop on a failed job without auto-retry, then `ask` / `redo` follow-ups.
  Server side: an orchestration node classifies meta vs research and shallow vs deep; a clarifier capped at
  3 turns asks only when the request is ambiguous, including the *type of output* (report, table,
  comparison, brief answer); follow-ups can be delta research with the parent report as context; the skill
  itself was evaluated for uplift against a no-skill baseline on 3 tasks (correctness +22% on claude-code,
  +31% on codex) — a with-vs-without-skill uplift measure, where our `evals/` fixtures are behavioural assertions.
- Versus orchestrate: shallow-vs-deep is **have** (triage step 0, "one lookup answers it"); a clarify cap is
  deliberately **not** adopted (Matt's docs argue against it and P1 says scope is the control); research
  continuation from a parent report is **missing** (`board init --resume` continues a run, but a finished research
  run's report is archived by the next kickoff).
- Adopt: no for the skill and the backend (infra-heavy; our lanes compose native tools). Two micro-items:
  put "deliverable form" (report / table / comparison / recommendation) among P1's research-run decisions
  (value L, effort S); a `delta` mode that pins the previous `report.md` + `factcheck.md` and researches only
  what changed (value L–M, effort S–M, defer until a recurring research watch exists).

### Impeccable (pbakaus) — `/critique`, detector, hooks, finish reviewer
- Links: github.com/pbakaus/impeccable (80.7k stars, pushed 2026-10-13, Apache-2.0)
- Evidence: repo-read — `reference/critique.md` (the first ~230 of 828 lines), `reference/hooks.md`,
  `agents/impeccable_finish_reviewer.toml` (head). The detector rule set was not read.
- Mechanism: `/critique` runs **two isolated sub-agents that must not see each other**: A (holistic design
  review, including a "design specificity" verdict made *before* any detector output) and B (the deterministic
  `impeccable detect` CLI + browser overlay). "Assessment A must finish before detector findings enter the
  parent synthesis context. Detector output is deterministic, but it still anchors judgment." Inline execution
  is permitted only when no sub-agent tool exists, and then the report's **first line** must be `⚠️ DEGRADED:
  single-context (<reason>)` — "a silent degraded critique is a failed critique"; otherwise `Method: dual-agent
  (A: <id> · B: <id>)`. Synthesis weaves, not concatenates: where they agree, what the detector caught that
  the LLM missed, which detector findings are false positives. The hooks run the detector after each UI edit
  (mechanical rules only, per edit) and defer taste rules to one deduplicated pass on `Stop`; suppressions go
  through a CLI at the narrowest scope with the evidence named in `--reason`, and self-serve stops at
  value-level ignores. The finish reviewer validates evidence first (check 0) and inventories the comp "in
  your own words before reading the direction contract or any builder-authored summary".
- Versus orchestrate: anti-anchoring is **partial** — `scripts/review-package` already gives reviewers a diff
  only, never test output, and the verifier prompt says "do not read its rationale"; but spec/quality
  reviewers *do* receive the implementer's report, and nothing says when machine-check output may enter the
  controller's synthesis. Gate independence is **partial** — the findings file's first line records model,
  round and brief hash (`prompt-spec-reviewer.md`), not whether the gate ran isolated or inline, and
  `shared-hosts.md` degradation is stated in `run.md` and the flight plan, not carried into the gate verdict
  or the final report.
- Adopt: (a) `isolation: fresh-subagent | inline(degraded: <reason>)` on the findings file's first line, an
  optional `board gate --isolation`, and `board finish` / `board resume` printing "gates run degraded: N"
  (value M, effort S); (b) one sentence in `shared-review-gates.md` "Judge hygiene": run the unanchored review
  and the deterministic checks as separate steps and let machine output reach the synthesis only after the
  reviewer has returned (value L–M, effort S); (c) evidence validity from candidate 4. No for the detector and
  hooks themselves (UI-design-specific; worker-side hooks are host- and repo-specific).

### Sakana MASS — Multi-Agent Self-Supervision
- Links: pub.sakana.ai/mass, arXiv 2610.12176, github.com/SakanaAI/mass (239 stars, created 2026-09-29, no license)
- Evidence: docs — the blog in full; the paper and code were not read.
- Mechanism: a training loop (inner: evolve the multi-agent *workflow* against self-judged pairwise comparisons;
  outer: fine-tune on the winning team's trajectories), 27B open-weights model, two rounds, 1.2–1.6× score per
  output token on four research benchmarks and 0.94–0.96× on SWE-bench Verified / Terminal-Bench. A workflow is
  role + instruction + **contract** (what each subagent must return, including required checks) + **hop** (call
  order, including loops back). Findings: optimal workflows move task information out of roles and instructions
  and into contracts and hops; upgrading the *optimizer* helps more than upgrading only the evaluator; search is
  noisy ("strong iterations followed by sharp regressions"); homogeneous loops share blind spots, so they
  measured with external judges whose verdicts were withheld from the loop.
- Versus orchestrate: nothing to adopt at runtime — it is weight training. The findings agree with rules we
  already have (cross-family judge by default; evolve = one change on repeated evidence, no-op valid; briefs
  and report schemas as contracts). Two cheap confirmations, both weak-transfer (a 27B training setting):
  per-task report contracts could name *required machine-checked fields* (their finance example returns
  `no_future_leakage: bool`), and `prompt-evolve.md` runs on the "standard tier" while the architect gets the
  strongest — watch, do not change on this evidence.
- Adopt: no.

### BHolmes `/taste-review`, `/simplify`, `/test-app` — see Warp entry above. cjzafir "don't fight errors" — post-only.
- cjzafir's rule ("same error twice → research the web, find 3–5 fixes, choose the most efficient") has no
  benchmark behind it (one practitioner's anecdote that medium beats xhigh when xhigh wrote the plan).
  `shared-model-routing.md` rule 4 already escalates *capability before retry* and `prompt-implementer.md`
  "When you're in over your head" stops on "file after file without progress", but there is no worker-level
  *same-error-twice* trigger. Adopt as one line inside candidate 1's hypothesis step, where it has repo-read
  backing (`diagnosing-bugs` Phase 3), not as a standalone rule (value L, effort S).
- The "plan with the strongest model, execute with a cheaper one" half is `strategy-advisor.md` / architect → worker (have).

### theplgeek "harness-ready" assessment prompt ← OpenAI "Harness engineering" (Lopopolo, 2026-02-11)
- Links: openai.com/index/harness-engineering/
- Evidence: docs — the article in full. The prompt itself is two lines: assess the repo for harness
  readiness against the article and produce a prioritised task list.
- Mechanism: AGENTS.md as a ~100-line map into a versioned `docs/` system of record; the app bootable per git
  worktree; Chrome DevTools Protocol wired into the agent runtime; an *ephemeral per-worktree observability
  stack* (logs/metrics/traces queryable) so "startup under 800 ms" becomes a checkable prompt; custom lints
  whose error messages inject the remediation; minimal blocking merge gates when agent throughput exceeds
  human attention; recurring "golden principles" cleanup loops; and a bug flow that records a video of the
  failure and a second of the fix.
- Versus orchestrate: the readiness assessment is an *equip* concern — Prepare P2/P3 already inventories
  machine tools and turns gaps into questions, but only for tools the agents run, not for whether the *repo*
  can be launched, driven and proven. The article's merge philosophy ("corrections are cheap, waiting is
  expensive") is the counterweight to `review=dual` and is already expressible as `review=off|spec` plus a
  cleanup loop (`strategy-loop.md`).
- Adopt: the readiness check becomes the `verify:` strip and P3 questions in candidate 2 rather than a separate
  "assess the repo" step (value H as part of 2). No separate harness-engineering step: it would make
  orchestrate decide how a repo is engineered, which `AGENTS.md` places outside its boundary.

### claude-code-best-practice (shanraisshan) · Thariq's Agent SDK workshop (via Mnilax) — one line each
- claude-code-best-practice (67.5k stars, MIT): a curated tips and workflows repo; its cross-model workflow
  (plan in Claude, Codex reviews the plan by *adding* "Codex Finding" phases without rewriting the originals,
  implement, Codex verifies) is plan-veto + cross-family judge, both have. No.
- Thariq/Mnilax: post-only — the X article is behind login and the workshop video was not fetched; the six-part
  harness frame (tools, prompts, file systems, skills, sub-agents, memory) and "I built 14 sub-agents, kept 4"
  agree with universal rule 8 and the prior sweep's context-tax item. No.

## Not worth adopting (one line each, why)
- NVIDIA AI-Q skill/backend — a client for a heavyweight server (NIM models, Helm); our lanes compose native tools.
- Apodex model, AgentOS runtime, 150-agent scale — vendor model and closed runtime; only the verification ideas travel (candidate 3).
- Sakana MASS — weight training; confirms existing judge-hygiene rules, nothing to build.
- Impeccable detector/hooks — UI-design lint; the transferable parts are the isolation banner and anchoring order.
- superpowers one-question brainstorming, visual companion, `diagnosing-superpowers` — opposite design from P1 (still reachable via a user's "one at a time"), out of scope, and heavy.
- BHolmes `/taste-review` (have: advisor/xcli; reads a Keychain token) and `/done` (have).
- Matt's `research`, `handoff`, `implement-spec`, `wait-what` — thinner than, or the same as, what exists.
- claude-code-best-practice, the Thariq workshop — curation / conceptual.
- cjzafir's rule as a standalone item — post-only anecdote.
- A clarify question cap (AI-Q clarifier, 3 turns) — Matt's docs and `shared-prepare.md` Bounds both argue scope is the control.

## Gaps (what you could not verify, and why)
- Apodex: the heavy-duty team is closed; mechanism evidence is the blog and §3 of the 1.1 paper. Benchmark
  numbers are vendor-reported. The 1.0 technical-report PDF was not read.
- Sakana MASS: blog only; the arXiv paper and code were not opened. Transfer of its findings from a 27B
  training setting to a prompting skill is unestablished.
- NVIDIA AI-Q: planner/researcher/writer prompts and the `deep-researcher-deploy` skill were not read; I judged the
  skill client and the clarifier doc only.
- Impeccable: ~230 of `critique.md`'s 828 lines, the hooks doc and the finish reviewer's head; the detector rules and
  `degraded/` prompts were not read.
- tester-army/e2e: the two skills and `bug-bash.md` were read; the runtime, `explore`, and the step cache (`docs/cache.mdx`)
  were not, and 10k stars in under three months says nothing about track record.
- Warp `oz-for-oss`: `assert_write_surface` was read; `validate_review_payload`'s body, the Oz cloud runner and
  the cron schedule behind "loops on a cron" were not, so how often those loops actually run is unverified.
- Post-only: BHolmes `/test-app` (no public repo found; `test-desktop-app` in hubble.md is a project-specific
  cousin), cjzafir's medium-beats-xhigh result, Mnilax's article, Thariq's workshop video, Matt's decision-tree
  image (I read `PHASE-BOUNDARIES.md`, which carries the same tree).
- Like and bookmark counts are the sources file's, not re-checked. Nothing was run or installed; no xrelay; no
  file inside the repo was written.
