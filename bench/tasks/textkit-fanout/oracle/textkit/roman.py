VALS = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
        (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]


def to_roman(n):
    if not isinstance(n, int) or isinstance(n, bool) or not 1 <= n <= 3999:
        raise ValueError(n)
    out = ""
    for v, s in VALS:
        while n >= v:
            out, n = out + s, n - v
    return out


def from_roman(s):
    if not s or not isinstance(s, str):
        raise ValueError(s)
    total, i = 0, 0
    for v, sym in VALS:
        while s.startswith(sym, i):
            total, i = total + v, i + len(sym)
    if i != len(s) or not 1 <= total <= 3999 or to_roman(total) != s:
        raise ValueError(s)
    return total
