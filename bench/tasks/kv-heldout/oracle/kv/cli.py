import argparse
import json
import sys

from kv.store import KV


def main(argv):
    ap = argparse.ArgumentParser(prog="kv")
    ap.add_argument("--file", default="kv.json")
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("set"); p.add_argument("key"); p.add_argument("value"); p.add_argument("--ttl", type=float)
    p = sub.add_parser("get"); p.add_argument("key")
    p = sub.add_parser("del"); p.add_argument("key")
    sub.add_parser("keys")
    a = ap.parse_args(argv)
    kv = KV(a.file)
    if a.cmd == "set":
        try:
            v = json.loads(a.value)
        except ValueError:
            v = a.value
        kv.set(a.key, v, a.ttl)
    elif a.cmd == "get":
        miss = object()
        v = kv.get(a.key, miss)
        if v is miss:
            return 1
        print(json.dumps(v))
    elif a.cmd == "del":
        return 0 if kv.delete(a.key) else 1
    elif a.cmd == "keys":
        for k in kv.keys():
            print(k)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
