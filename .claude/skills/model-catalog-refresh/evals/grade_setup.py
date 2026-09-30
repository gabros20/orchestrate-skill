#!/usr/bin/env python3
"""Programmatic grading for iteration N: reads each run's clone + outputs, writes grading.json per run."""
import json, pathlib, re, sys
WSP = pathlib.Path(__file__).resolve().parent
it = WSP / sys.argv[1]
def txt(p):
    try: return p.read_text(errors="replace")
    except Exception: return ""
def journal(c):
    j = c / ".orchestrate/journal.jsonl"
    return [json.loads(l) for l in txt(j).splitlines() if l.strip().startswith("{")]
def briefs(c):
    return {p.name: txt(p) for p in (c / ".orchestrate").glob("task-*-brief.md")} if (c / ".orchestrate").exists() else {}
LANE = {"vendor": r"vendor", "cli": r"cli catalog|live cli|catalogs", "bench": r"benchmark", "x": r"\bx\b|xrelay|twitter",
        "reddit": r"reddit|hacker news|\bhn\b", "effort": r"effort"}
for n, ev in enumerate(("new-model-haiku", "price-cut-astra")):
    for cfg in (("with_skill", "without_skill") if sys.argv[1] == "iteration-1" else ("with_skill",)):
        c = WSP / ("clones" if sys.argv[1] == "iteration-1" else "clones2") / f"{ev}-{cfg}"; out = it / f"eval-{n}-{ev}" / cfg / "run-1" / "outputs"
        reply = txt(out / "reply.md").lower()
        allout = reply + "\n".join(txt(p).lower() for p in out.glob("**/*") if p.is_file() and p.name != "reply.md")
        evs = journal(c); b = briefs(c); bt = "\n".join(b.values()).lower()
        plan_titles = " ".join(str(e.get("title", "")).lower() for e in evs if e.get("ev") == "todo")
        plan_files = "\n".join(txt(q).lower() for q in out.glob("**/*.md") if q.name.lower() != "reply.md")
        plan_titles = plan_titles or " ".join(re.findall(r"^#+ .*$", plan_files, re.M))   # a plan without the board still counts
        scope = plan_titles + " " + " ".join(b.keys()).lower() + " " + bt[:0]
        r = []
        def add(text, ok, evidence): r.append({"text": text, "passed": bool(ok), "evidence": evidence})
        has_board = any(e.get("ev") == "run" for e in evs)
        add("setup went through the board (run journaled)", has_board, f"{len(evs)} journal events")
        add("nothing was dispatched", not any(e.get("ev") == "dispatch" for e in evs), "dispatch events: " + str(sum(e.get("ev") == "dispatch" for e in evs)))
        add("per-lane briefs written to .orchestrate", len(b) >= 2, f"briefs: {sorted(b)}")
        add("a fresh-context fact-check gate is planned", re.search(r"fact-check|final gate|verifier", plan_titles + reply), "plan titles + reply")
        if ev == "new-model-haiku":
            miss = [k for k, pat in LANE.items() if not re.search(pat, plan_titles)]
            add("all six new-model lanes planned (vendor, CLI, benchmarks, X, Reddit/HN, effort)", not miss, f"missing: {miss}")
            add("both trigger models seeded into the briefs/contract", ("haiku-5-5" in bt + txt(c / '.orchestrate/research-contract.md').lower()) and ("grok-5" in bt + txt(c / '.orchestrate/research-contract.md').lower()), "searched briefs + contract")
            add("X lane serialized via xrelay and Reddit via RSS", re.search(r"xrelay", bt) and re.search(r"search\.rss|\.rss", bt), "searched briefs")
            add("reply names both apply targets (catalog reference + board CATALOG)", "shared-model-catalog" in allout and re.search(r"catalog\b.*board|board.*catalog", allout), "reply + outputs")
            add("reply names the release path (bump / release / migration)", re.search(r"scripts/release|scripts/bump|migrations", allout), "reply + outputs")
        else:
            social = re.search(LANE["x"], plan_titles) or re.search(LANE["reddit"], plan_titles)
            add("scope stays narrow: no X or Reddit/HN lanes for a price change", bool(plan_titles) and not social, f"plan titles: {plan_titles[:160]}")
            add("vendor and CLI catalog lanes planned", re.search(LANE["vendor"], plan_titles) and re.search(LANE["cli"], plan_titles), f"plan titles: {plan_titles[:160]}")
            add("reply names the catalog rows / cost figures the price moves", "shared-model-catalog" in allout and re.search(r"cost|price", reply), "reply + outputs")
            add("reply says whether role picks could change", re.search(r"role|pick|posture|pareto", reply), "reply")
            if cfg == "with_skill":
                add("price run limits the benchmark lane to cost rows", "price run" in bt, "searched briefs")
        g = {"expectations": r, "summary": {"passed": sum(x["passed"] for x in r), "failed": sum(not x["passed"] for x in r),
             "total": len(r), "pass_rate": round(sum(x["passed"] for x in r) / len(r), 2)}}
        (it / f"eval-{n}-{ev}" / cfg / "run-1").mkdir(parents=True, exist_ok=True)
        json.dump(g, open(it / f"eval-{n}-{ev}" / cfg / "run-1" / "grading.json", "w"), indent=2)
        print(f"{ev:18} {cfg:14} {g['summary']['passed']}/{g['summary']['total']}")
