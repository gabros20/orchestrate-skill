def to_markdown(notes):
    parts = []
    for n in notes:
        s = f"## {n['title']}\n\n"
        if n.get("body"):
            s += f"{n['body']}\n\n"
        if n.get("tags"):
            s += "Tags: " + ", ".join(n["tags"]) + "\n\n"
        parts.append(s.rstrip("\n") + "\n")
    return "\n".join(parts)
