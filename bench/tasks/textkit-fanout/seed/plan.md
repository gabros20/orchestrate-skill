# Plan — textkit

Python 3.11+, standard library only. Package `textkit/`. The four tasks are independent of each other.
Write unit tests under `tests/` (unittest). Commit each task.

## Task 1: Slugs

`textkit/slug.py` — `slugify(text, max_len=None) -> str`: Unicode folded to ASCII (NFKD, drop non-ASCII),
lowercased, every run of non-alphanumeric characters becomes one `-`, no leading or trailing `-`. With `max_len`,
cut to at most `max_len` characters, then strip a trailing `-`.

## Task 2: Roman numerals

`textkit/roman.py` — `to_roman(n: int) -> str` for 1..3999 (anything else → `ValueError`), and
`from_roman(s: str) -> int` accepting only canonical uppercase numerals (`"IIII"`, `"IC"`, `"VX"`, `""`,
lowercase → `ValueError`).

## Task 3: Text statistics

`textkit/stats.py` — `stats(text) -> dict` with `words` (count of `[a-z']+` tokens in the lowercased text),
`unique` (distinct words), `sentences` (runs of `.`, `!` or `?`; text with words but no terminator counts as 1;
no words → 0), `top` (up to 3 `(word, count)` tuples, by count descending, then word ascending).

## Task 4: CSV to records

`textkit/csvjson.py` — `csv_to_records(text, types=True) -> list[dict]`: the first row is the header. With `types`,
values convert: integers → `int`, decimals → `float`, `true`/`false` (any case) → `bool`, empty → `None`, otherwise
`str`. With `types=False` every value stays a string. Quoted fields with commas work (use `csv`).
