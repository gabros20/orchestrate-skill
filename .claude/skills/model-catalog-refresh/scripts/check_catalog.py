#!/usr/bin/env python3
"""Consistency check between the board's CATALOG defaults and references/shared-model-catalog.md.
Run before every release that touches either. Exit 1 with one line per problem.

Checks: the as-of dates agree · every model the board defaults to appears in the catalog's harness matrix ·
Claude-only picks use aliases native subagents accept · every role has all three postures · every posture
the board knows is named in the catalog's role table.
"""
from __future__ import annotations

import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parents[4]
CAT = (REPO / "skills/orchestrate/references/shared-model-catalog.md").read_text()
BOARD = (REPO / "skills/orchestrate/scripts/board").read_text()
ALIASES = {"opus", "sonnet", "fable", "haiku"}


def main() -> int:
    bad: list[str] = []
    board_asof = (re.search(r'^CATALOG_AS_OF = "([\d-]+)"', BOARD, re.M) or [None, ""])[1]
    cat_asof = (re.search(r"As of \*\*(\d{4}-\d{2}-\d{2})\*\*", CAT) or [None, ""])[1]
    if not board_asof or board_asof != cat_asof:
        bad.append(f"as-of dates differ: board CATALOG_AS_OF {board_asof or 'missing'} vs catalog {cat_asof or 'missing'}")
    block = re.search(r"^CATALOG = \{(.*?)^\}", BOARD, re.S | re.M)
    if not block:
        bad.append("board has no CATALOG block")
        body = ""
    else:
        body = block.group(1)
    matrix = "\n".join(l for l in CAT.splitlines() if l.startswith("| ") and " · `" in l)
    for mid in sorted(set(re.findall(r"(?:claude|codex|kimi|grok|opencode) ([\w.-]+) @", body))):
        full = mid if not mid.startswith(("opus", "sonnet", "fable", "haiku")) else f"claude-{mid}"
        if mid not in matrix and full not in matrix:
            bad.append(f"board default model `{mid}` is not in the catalog's harness matrix")
    for role, rows in re.findall(r'"(\w+)": \{(.*?)\}(?:,|\n)', body, re.S):
        postures = re.findall(r'"(frontier|balanced|economy)": \("([^"]*)", "([^"]*)"\)', rows)
        if postures and {p for p, _, _ in postures} != {"frontier", "balanced", "economy"}:
            bad.append(f"role {role}: postures {sorted(p for p, _, _ in postures)} — need frontier, balanced, economy")
        for p, _, claude_only in postures:
            alias = claude_only.split(" @")[0].strip()
            if alias not in ALIASES:
                bad.append(f"role {role} / {p}: Claude-only pick `{claude_only}` is not a native subagent alias {sorted(ALIASES)}")
    for p in ("frontier", "balanced", "economy"):
        if f"| {p} |" not in CAT:
            bad.append(f"catalog role table never names posture `{p}`")
    for b in bad:
        print(f"check_catalog: {b}")
    print("check_catalog: OK" if not bad else f"check_catalog: {len(bad)} problem(s)")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
