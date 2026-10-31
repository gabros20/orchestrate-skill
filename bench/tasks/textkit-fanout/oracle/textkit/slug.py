import re
import unicodedata


def slugify(text, max_len=None):
    s = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    if max_len is not None:
        s = s[:max_len].rstrip("-")
    return s
