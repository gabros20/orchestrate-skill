import argparse
import os
import sys

from notes.export import to_markdown
from notes.store import Store


def main(argv):
    ap = argparse.ArgumentParser(prog="notes")
    ap.add_argument("--db")
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("add"); p.add_argument("title"); p.add_argument("--body", default=""); p.add_argument("--tag", action="append", default=[])
    sub.add_parser("list")
    p = sub.add_parser("search"); p.add_argument("term")
    p = sub.add_parser("rm"); p.add_argument("id", type=int)
    p = sub.add_parser("export"); p.add_argument("--tag")
    a = ap.parse_args(argv)
    st = Store(a.db or os.environ.get("NOTES_DB") or "notes.db")
    line = lambda n: print(f"{n['id']}\t{n['title']}\t{','.join(n['tags'])}")
    if a.cmd == "add":
        print(st.add(a.title, a.body, a.tag))
    elif a.cmd == "list":
        for n in st.list():
            line(n)
    elif a.cmd == "search":
        for n in st.search(a.term):
            line(n)
    elif a.cmd == "rm":
        return 0 if st.delete(a.id) else 1
    elif a.cmd == "export":
        ns = [n for n in st.list() if not a.tag or a.tag.lower() in n["tags"]]
        sys.stdout.write(to_markdown(ns))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
