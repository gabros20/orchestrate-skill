import re
from collections import Counter


def stats(text):
    words = re.findall(r"[a-z']+", text.lower())
    if not words:
        return {"words": 0, "unique": 0, "sentences": 0, "top": []}
    sentences = len(re.findall(r"[.!?]+", text)) or 1
    c = Counter(words)
    top = sorted(c.items(), key=lambda kv: (-kv[1], kv[0]))[:3]
    return {"words": len(words), "unique": len(c), "sentences": sentences, "top": top}
