# Review gates — plan-veto before, output review after

Purpose: Define ordered spec, quality, panel, and consensus gates with durable findings.

Read when:
- A run enables review or needs objective acceptance before integration.

Skip when:
- Review is explicitly off and the task's risk permits it.

Inputs:
- Task brief, diff or artifact, acceptance criteria, reviewer roles, and findings path.

Produces:
- Typed review findings, pass/fail result, fix instructions, and re-review state.

## Contents

- Plan-veto (before any execution)
- Output review (after execution)
- Anchors — topology is not truth
- Judge hygiene
- Panels and consensus
- Final-deliverable gate
- Verification with evidence (the /verify split)

Two DISTINCT gate kinds; don't conflate them. Gates are enforced, not trusted: a gate that can't
fail the work isn't a gate. Machine checks (tests, lint, `scripts/check-sync`) are the cheapest
gate of all: run them through the journal (`board exec N --name tests -- …`) so the exit code is
on the record and on the card, and `board done` is refused over a failure. The record itself is a
gate: `board check` fails a task marked done with no review gate ever opened (review on) or with
quality opened before spec — an output-blind governance floor, judged on roles and order alone.
Vendor-native review layers (Codex Guardian, Claude Code's auto-mode classifier) are additional
independent signals; they never replace `board gate`.

## 1. Plan-veto (before any execution)

A dedicated reviewer that can REJECT the plan and force rework — cheaper than rejecting code.
Forms, by rising cost: controller self-check against the four lenses (overbuilt/fragile/missing/
structure-fights-goal) → independent plan-review subagent → adversarial debate
(`strategy-adversarial.md`) → team plan-approval (teammate stays read-only until the lead
approves). Rejected plans go back with REASONS; cap the cycles (default 3), then escalate.

## 2. Output review (after execution)

**Order is law: spec compliance FIRST, quality SECOND.** Spec answers "did they build what was
asked — nothing missing, nothing extra"; quality answers "is it well-built". Quality-reviewing
non-compliant code is wasted tokens.

- Reviewers are **read-only** and get: the brief, the implementer's report, the diff package, and
  the plan's Global Constraints VERBATIM (exact values, formats, relationships).
- **Do-not-trust-the-report**: reviewers verify by reading code, never by believing claims.
  Implementer rationale never downgrades a severity.
- **Never pre-judge findings** in a reviewer prompt ("don't flag X", "at most Minor", "the plan
  chose this") — if you're typing that, you're dodging a review loop you need.
- **The coverage rule — never instruct a reviewer to self-filter** ("only flag high-severity",
  "be conservative", "at most N issues"): measured to silently drop recall. Reviewers report
  EVERYTHING found, each with severity + confidence; filtering/triage is the CONTROLLER's job at
  the dedup/merge step. Terseness rules apply to a reviewer's prose, never its finding count.
  Findings go to the findings file (`shared-contracts.md`) so inline caps can't truncate them.
- Every gate is journaled: `board review N --kind K --round R` when dispatched, `board gate N
  --kind K --verdict ok|fail|warn --findings <file>` when it closes (the explicit verdict outranks
  the findings-file parse). A fix wave is a new implementer *attempt* — the review cycle resets
  and the ledger stays closed (`board done` refuses) until the current attempt's gates pass.
- Findings loop: Critical/Important → fix subagent → RE-REVIEW (no skipping); Minor → ledger,
  batch to final review. ⚠️ "cannot verify from diff" → the CONTROLLER resolves (it holds
  cross-task context), never auto-pass. N failed rounds on the same task (default 2–3) is a
  model-tier escalation (`shared-model-routing.md` rule 4), never another identical round.
- **A verdict binds the brief it judged**: the findings file records the brief's content hash
  (`git hash-object <brief>`) beside the judge line — a brief edited after review re-opens the
  gate, because the gate no longer describes the work that will ship.

## Anchors — topology is not truth

A gate topology built entirely of agents reading each other's reports can be fully consistent and
entirely unverified — *"Everything is consistent. Nothing is verified."* Every gate that judges
PRODUCED WORK therefore names at least one fact **no agent produced**: a command that ran, with
its output; a file that exists on disk at a stated sha; an external readback (CI status, a
deployed response, a merged PR). Plan-veto is outside this scope — nothing is built yet, so it
judges intent. And some constraints are **frozen** — the ones an optimizer would be tempted to
weaken are off-limits precisely because bending them is how it would win.

## Judge hygiene

- **Cross-family judge by default** wherever the host allows it: a model grades its own family's
  writing more kindly, and same-family generate-and-grade shares its blind spots. (Lineage
  decorrelation is an option for panels below; for a judging role it is the default.)
- **Pin AND log the judge model per review round**, in the findings file. A silently upgraded
  judge makes round 1 and round 3 incomparable, and nothing in the output says so.
- **Never reward the shape of an answer**: no scoring on response length, keyword presence,
  citation count, exact phrasing, tool-call count, or similarity to a reference. Reward the shape
  and the agent learns the shape.
- **One-line rubrics** wherever the check allows: `Pass iff [independently observable outcome]` —
  one primary verdict, never a bundle of proxy scores.

## Panels (`review=panel:N`) and consensus (`review=consensus:N`)

- Panel: N reviewers, each ONE lens (security / performance / architecture / testing / a11y…).
  Diverse lenses catch what redundant copies can't.
- **Votes, not a verdict you tally by hand**: each panelist casts `board vote N --kind <gate>
  --agent <me> --verdict ok|fail|warn --why "…"`; the gate is derived — `panel:N` = majority of
  ok, `consensus:N` = any-deny (one fail fails it) — under the rules in force when the vote was
  cast, and shows on the card as `approve 2/3 ok` / `fail (deny: sec-lens)`. The controller may
  still close a gate explicitly (`board gate` outranks) — with the reason journaled. `kind=plan`
  makes the plan-veto a multi-approver gate with the same mechanics.
- Lenses may also decorrelate by INPUT — diff-only · codebase-only (still brief + constraints, no
  diff) · diff+report+brief (standard) — or by ENGINE LINEAGE (xcli peers/peer tier); worker
  transcripts are post-mortem forensics only (`shared-monitoring.md` paths), referenced, never
  pasted into a dispatch.
- Review compute is high-return — cheaper than the work it audits; decorrelated lenses stack, no
  single lens catches everything (Cursor 2026, bounded observation).
- Dedup rules: same file:line + same issue → merge, credit all finders; conflicting severity →
  take the HIGHER; conflicting recommendations → keep both, attributed.
- Severity calibration: impact × likelihood; externally exploitable → always Critical/High.
- Consensus: N independent verifiers vote real/refuted per finding; majority rules; prompt them
  to REFUTE (default-skeptic), or the vote is decorative.

## Final-deliverable gate (before the run reports done)

Per-task gates structurally cannot see scope drift ACROSS tasks: each task passed its own review
and the accumulated change set still misses the point. So before a run reports done, one review of
the whole accumulated change set, in a fresh context, judged against the ORIGINALLY stated goal
rather than the conversation. Verdict: **ship / fix-first / rethink**. Two caveats, carried from
the source: when the reviewer and the implementer are the same model this is a fresh-eyes check,
not an independent-model check; and any fix made after the review discards the verdict — run a new
fresh review. In `staged` this gate is the whole-branch review at Finish (`strategy-staged.md`);
every other strategy owes it as its own step.

## Verification with evidence (the /verify split)

For anything user-facing or high-stakes, split verification:
1. **Subjective first — a FRESH read-only verifier subagent** drives the real running app (dev
   server + browser/CLI driver): exercises the change like a user, captures screenshot AND video
   to a gitignored `evidence/` dir, returns strictly one of `pass | fail | blocked |
   needs-human-judgment` / expected / observed / evidence (`prompt-verifier.md`). Fresh =
   independence; the model that wrote the code grades its own homework too generously.
2. **Objective second — the controller** runs the codified checks (typecheck/lint/unit/e2e) as a
   regression sweep.
`fail` → fix → a NEW fresh verifier; cap ~3 rounds — then escalate the worker's tier
(`shared-model-routing.md` rule 4) before escalating to the human. PRs ship with the evidence:
screenshot embedded inline, video linked — reviewers approve behavior, not vibes. A fix that
doesn't move the real metric isn't a fix — keep watching it next cycle.
