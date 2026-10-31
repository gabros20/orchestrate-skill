import csv
import io
import re


def _conv(v):
    if v == "":
        return None
    if re.fullmatch(r"[+-]?\d+", v):
        return int(v)
    if re.fullmatch(r"[+-]?(\d+\.\d*|\.\d+)", v):
        return float(v)
    if v.lower() in ("true", "false"):
        return v.lower() == "true"
    return v


def csv_to_records(text, types=True):
    rows = list(csv.reader(io.StringIO(text)))
    if not rows:
        return []
    head = rows[0]
    return [{h: (_conv(v) if types else v) for h, v in zip(head, r)} for r in rows[1:] if r]
