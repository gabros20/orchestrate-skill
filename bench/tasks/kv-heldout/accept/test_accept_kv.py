import contextlib
import io
import os
import tempfile
import unittest

from kv.store import KV


class Clock:
    def __init__(self):
        self.t = 1000.0

    def __call__(self):
        return self.t


class StoreTest(unittest.TestCase):
    def setUp(self):
        self.path = os.path.join(tempfile.mkdtemp(), "kv.json")
        self.clock = Clock()

    def test_set_get_persist(self):
        KV(self.path, self.clock).set("a", {"x": [1, 2]})
        self.assertEqual(KV(self.path, self.clock).get("a"), {"x": [1, 2]})
        self.assertEqual(KV(self.path, self.clock).get("nope", 7), 7)

    def test_ttl_keys_purge(self):
        kv = KV(self.path, self.clock)
        kv.set("b", 1); kv.set("a", 2, ttl=10); kv.set("c", 3, ttl=5)
        self.assertEqual(kv.keys(), ["a", "b", "c"])
        self.clock.t += 6
        self.assertIsNone(kv.get("c")); self.assertEqual(kv.keys(), ["a", "b"])
        self.assertEqual(kv.purge(), 1)
        self.assertFalse(kv.delete("c"))
        self.clock.t += 10
        self.assertEqual(kv.purge(), 1)
        self.assertEqual(KV(self.path, self.clock).keys(), ["b"])
        self.assertTrue(kv.delete("b")); self.assertFalse(kv.delete("b"))


class CliTest(unittest.TestCase):
    def run_cli(self, *argv):
        from kv.cli import main
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            rc = main(["--file", self.path, *argv])
        return rc, buf.getvalue()

    def setUp(self):
        self.path = os.path.join(tempfile.mkdtemp(), "kv.json")

    def test_cli(self):
        self.assertEqual(self.run_cli("set", "n", "42")[0], 0)
        self.run_cli("set", "s", "hello world")
        self.assertEqual(self.run_cli("get", "n"), (0, "42\n"))
        self.assertEqual(self.run_cli("get", "s"), (0, '"hello world"\n'))
        self.assertEqual(self.run_cli("get", "zz")[0], 1)
        self.assertEqual(self.run_cli("keys"), (0, "n\ns\n"))
        self.assertEqual(self.run_cli("del", "n")[0], 0)
        self.assertEqual(self.run_cli("del", "n")[0], 1)


if __name__ == "__main__":
    unittest.main()
