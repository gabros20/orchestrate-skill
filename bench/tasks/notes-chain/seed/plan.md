# Plan — notes

Python 3.11+, standard library only (sqlite3, argparse). Package `notes/` at the repo root.
Write unit tests for your code under `tests/` (unittest). Commit each task.

## Task 1: Storage

`notes/store.py` — `Store(path)` backed by SQLite (`path` may be `":memory:"`).
- `add(title, body="", tags=()) -> int` — returns the new id (ids start at 1). Empty or blank title → `ValueError`.
- `get(id) -> dict | None` — keys `id, title, body, tags, created`; `tags` is a sorted list of unique
  lowercase strings; `created` an ISO-8601 string.
- `list() -> list[dict]` — every note, ordered by id.
- `search(term) -> list[dict]` — notes whose title or body contains `term`, case-insensitive, ordered by id.
- `delete(id) -> bool` — False when there was no such note.

## Task 2: CLI

`notes/cli.py` — `main(argv: list[str]) -> int`, runnable as `python -m notes.cli`. Database path: `--db PATH`
(before the command), else the `NOTES_DB` environment variable, else `notes.db`.
- `add TITLE [--body B] [--tag T ...]` prints the new id.
- `list` and `search TERM` print one line per note: `{id}\t{title}\t{tags joined by ","}`.
- `rm ID` prints nothing; exit code 1 when the note does not exist.
- Uses Task 1's `Store`.

## Task 3: Markdown export

`notes/export.py` — `to_markdown(notes: list[dict]) -> str`: for each note, `## {title}`, a blank line, the
body (when non-empty, then a blank line), and `Tags: a, b` (when it has tags); notes separated by one blank line;
the result ends with exactly one newline ("" for no notes). CLI: `export [--tag T]` prints the markdown of all
notes, or only those carrying tag `T`.
