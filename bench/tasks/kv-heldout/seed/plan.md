# Plan — kv

Python 3.11+, standard library only. Package `kv/`. Write unit tests under `tests/` (unittest). Commit each task.

## Task 1: Store

`kv/store.py` — `KV(path, clock=time.time)`: a JSON file at `path` (loaded at construction when it exists).
- `set(key, value, ttl=None)` — `value` is any JSON value; `ttl` seconds from `clock()`; writes the file.
- `get(key, default=None)` — the value, or `default` when missing or expired.
- `delete(key) -> bool` — False when missing or already expired.
- `keys() -> list[str]` — live keys, sorted.
- `purge() -> int` — removes expired entries, writes the file, returns how many were removed.

## Task 2: CLI

`kv/cli.py` — `main(argv: list[str]) -> int`. File: `--file PATH` (before the command), else `kv.json`.
- `set KEY VALUE [--ttl S]` — VALUE is parsed as JSON when it parses, else kept as a string.
- `get KEY` prints the value as JSON (`json.dumps`); exit 1 when missing.
- `del KEY` exit 1 when missing · `keys` prints one key per line.
