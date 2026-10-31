import json
import os
import time


class KV:
    def __init__(self, path, clock=time.time):
        self.path, self.clock = path, clock
        self.data = {}
        if os.path.exists(path):
            with open(path, encoding="utf-8") as fh:
                self.data = json.load(fh)

    def _save(self):
        with open(self.path, "w", encoding="utf-8") as fh:
            json.dump(self.data, fh)

    def _live(self, k):
        e = self.data.get(k)
        return e is not None and (e["exp"] is None or e["exp"] > self.clock())

    def set(self, key, value, ttl=None):
        self.data[key] = {"v": value, "exp": None if ttl is None else self.clock() + ttl}
        self._save()

    def get(self, key, default=None):
        return self.data[key]["v"] if self._live(key) else default

    def delete(self, key):
        live = self._live(key)
        if key in self.data:
            del self.data[key]
            self._save()
        return live

    def keys(self):
        return sorted(k for k in self.data if self._live(k))

    def purge(self):
        dead = [k for k in self.data if not self._live(k)]
        for k in dead:
            del self.data[k]
        self._save()
        return len(dead)
