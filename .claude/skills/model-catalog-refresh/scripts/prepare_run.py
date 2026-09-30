#!/usr/bin/env python3
"""Set up a model-catalog refresh run: pick the lanes for the trigger, write the plan, then (after `board init`)
render the research contract and one brief per lane into .orchestrate/.

  prepare_run.py plan   --trigger new-model --models "claude-haiku-5-5, grok-5"   # writes PLAN.md, prints board init
  prepare_run.py briefs --trigger new-model --models "..."                        # after board init: contract + briefs

Triggers → lanes (lane N writes 0N-<slug>.md):
  new-model  1 vendor · 2 cli · 3 benchmarks · 4 x · 5 reddit/hn · 7 effort   (+8 other labs with --other-labs)
  price      1 vendor · 2 cli · 3 benchmarks, cost-to-run rows only
  sweep      1 2 3 4 5 7 8                                                      (+6 routers with --routers)
Task 9 is always the fresh-context final gate.
"""
from __future__ import annotations

import argparse
import datetime as dt
import os
import pathlib
import re
import subprocess
import sys

SKILL = pathlib.Path(__file__).resolve().parents[1]


def main_repo() -> pathlib.Path:
    """The repo the board writes to: the MAIN worktree (the board resolves its workspace the same way), so a
    run started from a linked worktree still lands in one place."""
    try:
        common = subprocess.run(["git", "rev-parse", "--path-format=absolute", "--git-common-dir"], capture_output=True,
                                text=True, cwd=SKILL, check=True).stdout.strip()
        return pathlib.Path(common).parent
    except (OSError, subprocess.CalledProcessError):
        return SKILL.parents[2]


REPO = main_repo()
WS = pathlib.Path(os.environ["ORCHESTRATE_WS"]) if os.environ.get("ORCHESTRATE_WS") else REPO / ".orchestrate"
CATALOG = REPO / "skills/orchestrate/references/shared-model-catalog.md"
BOARD = REPO / "skills/orchestrate/scripts/board"
LANES = {"new-model": [1, 2, 3, 4, 5, 7], "price": [1, 2, 3], "sweep": [1, 2, 3, 4, 5, 7, 8]}


def parse_lanes() -> dict[int, tuple[str, str, str]]:
    text = (SKILL / "references/lanes.md").read_text()
    out = {}
    for m in re.finditer(r"^## Lane (\d+): ([^\n]+)\nslug: (\S+)\n\n```brief\n(.*?)\n```", text, re.S | re.M):
        out[int(m.group(1))] = (m.group(2).strip(), m.group(3), m.group(4))
    return out


def seed_list(extra: str) -> tuple[str, str]:
    """Current catalog ids (harness matrix) + the board's defaults + the trigger's models."""
    cat = CATALOG.read_text()
    as_of = (re.search(r"As of \*\*(\d{4}-\d{2}-\d{2})\*\*", cat) or [None, "unknown"])[1]
    ids = []
    for line in cat.splitlines():
        m = re.match(r"^\| (\w[\w /-]*?) · `([^`]+)`", line)
        if m and m.group(2) not in [i for _, i in ids]:
            ids.append((m.group(1).strip(), m.group(2)))
    lines = [f"- {h}: `{i}`" for h, i in ids]
    board = BOARD.read_text()
    picks = sorted(set(re.findall(r"(?:claude|codex|kimi|grok|opencode) ([\w.-]+) @", board)))
    lines.append("- board catalog defaults: " + ", ".join(f"`{p}`" for p in picks))
    if extra.strip():
        lines.append("- **trigger models (new or changed):** " + ", ".join(f"`{x.strip()}`" for x in extra.split(",") if x.strip()))
    return "\n".join(lines), as_of


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("stage", choices=["plan", "briefs"])
    ap.add_argument("--trigger", choices=sorted(LANES), required=True)
    ap.add_argument("--models", default="", help="comma-separated ids/names that triggered the run")
    ap.add_argument("--other-labs", action="store_true")
    ap.add_argument("--routers", action="store_true")
    ap.add_argument("--date", default=dt.date.today().isoformat())
    ap.add_argument("--since", default="", help="evidence window start (default: 60 days before --date)")
    a = ap.parse_args()
    lanes = list(LANES[a.trigger]) + ([8] if a.other_labs and 8 not in LANES[a.trigger] else []) + ([6] if a.routers else [])
    lanes = sorted(set(lanes))
    since = a.since or (dt.date.fromisoformat(a.date) - dt.timedelta(days=60)).isoformat()
    out_dir = REPO / f"docs/research/model-selection/refresh-{a.date}"
    rel = out_dir.relative_to(REPO)
    spec = parse_lanes()
    if a.stage == "plan":
        board = REPO / "skills/orchestrate/scripts/board"
        if (WS / "journal.jsonl").exists():
            env = dict(os.environ, ORCHESTRATE_WS=str(WS))
            show = subprocess.run([str(board), "show", "--no-color"], capture_output=True, text=True, env=env, cwd=REPO).stdout
            if "RUN COMPLETE" not in show and "done" in show:
                sys.exit(f"prepare_run: {WS} holds an unfinished run — `board init --fresh` would archive it mid-flight. "
                         "Finish it (board finish) or hand it off first.")
        out_dir.mkdir(parents=True, exist_ok=True)
        plan = [f"# Plan: model-catalog refresh {a.date} ({a.trigger}{': ' + a.models if a.models else ''})", "",
                "Goal: re-check the model catalog against fresh evidence; report every change vs the current catalog.", ""]
        plan += [f"## Task {n}: {spec[n][0]}" for n in lanes] + ["## Task 9: Final gate: fact-check the synthesis"]
        (out_dir / "PLAN.md").write_text("\n".join(plan) + "\n")
        print(f"wrote {rel}/PLAN.md · lanes {', '.join(map(str, lanes))} + final gate 9 "
              "(dispatch 9 as: board dispatch 9 --agent verify-9 --model opus --role verifier)")
        print(f"next: skills/orchestrate/scripts/board init {rel}/PLAN.md --fresh --strategy parallel --review off "
              f"--engine claude --models worker=sonnet --isolation off --budget agents={len(lanes) + 3} "
              f"--goal \"Model-catalog refresh {a.date}: changes vs catalog, fact-checked\"")
        return 0
    ws = WS
    if not (ws / "journal.jsonl").exists():
        sys.exit("prepare_run: no journal — run the `board init` line from the plan stage first")
    seed, as_of = seed_list(a.models)
    contract = (SKILL / "assets/research-contract.md").read_text()
    for k, v in {"{DATE}": a.date, "{TRIGGER}": f"{a.trigger}{' — ' + a.models if a.models else ''}", "{SEED}": seed,
                 "{CATALOG}": str(CATALOG.relative_to(REPO)), "{AS_OF}": as_of}.items():
        contract = contract.replace(k, v)
    (ws / "research-contract.md").write_text(contract)
    (ws / "raw/shots").mkdir(parents=True, exist_ok=True)
    for n in lanes:
        title, slug, body = spec[n]
        out = f"{rel}/0{n}-{slug}.md"
        for k, v in {"{OUT}": out, "{DATE}": a.date, "{SINCE}": since, "{CATALOG}": str(CATALOG.relative_to(REPO))}.items():
            body = body.replace(k, v)
        if a.trigger == "price" and n == 3:   # a price change moves cost-to-run, never the scores
            body = ("PRICE RUN: re-read ONLY cost-to-run / $-per-task rows (Artificial Analysis, CursorBench, LiveBench cost "
                    "columns) for the repriced models. Never rescale an old $/task by hand — the new number or `stale`.\n" + body)
        (ws / f"task-{n}-brief.md").write_text(f"# Task {n}: {title} — output: {out}\n{body}\n")
    gate = (SKILL / "references/final-gate.md").read_text()
    gate = gate.split("```brief\n", 1)[1].split("\n```", 1)[0].replace("{DIR}", str(rel)).replace("{CATALOG}", str(CATALOG.relative_to(REPO)))
    (ws / "task-9-brief.md").write_text(f"# Task 9: Final gate — fact-check the synthesis\n{gate}\n")
    print(f"wrote .orchestrate/research-contract.md (seed: catalog as of {as_of}) and briefs for tasks "
          f"{', '.join(map(str, lanes))} + 9 → outputs under {rel}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
