import contextlib
import io
import os
import tempfile
import unittest

from notes.store import Store


def cli(*argv, db):
    from notes.cli import main
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        rc = main(["--db", db, *argv])
    return rc, buf.getvalue()


class StoreTest(unittest.TestCase):
    def setUp(self):
        self.s = Store(":memory:")

    def test_add_get(self):
        i = self.s.add("Milk", "buy 2", ["Home", "shop", "home"])
        self.assertEqual(i, 1)
        n = self.s.get(i)
        self.assertEqual((n["title"], n["body"], n["tags"]), ("Milk", "buy 2", ["home", "shop"]))
        self.assertIsInstance(n["created"], str)

    def test_blank_title(self):
        with self.assertRaises(ValueError):
            self.s.add("   ")

    def test_list_search_delete(self):
        self.s.add("Alpha", "first"); self.s.add("beta", "Second ALPHA mention"); self.s.add("gamma")
        self.assertEqual([n["id"] for n in self.s.list()], [1, 2, 3])
        self.assertEqual([n["id"] for n in self.s.search("alpha")], [1, 2])
        self.assertTrue(self.s.delete(2)); self.assertFalse(self.s.delete(2))
        self.assertIsNone(self.s.get(2))


class CliTest(unittest.TestCase):
    def setUp(self):
        self.db = os.path.join(tempfile.mkdtemp(), "n.db")

    def test_add_list_search_rm(self):
        self.assertEqual(cli("add", "Milk", "--tag", "home", "--tag", "shop", db=self.db), (0, "1\n"))
        cli("add", "Bread", "--body", "rye", db=self.db)
        self.assertEqual(cli("list", db=self.db)[1], "1\tMilk\thome,shop\n2\tBread\t\n")
        self.assertEqual(cli("search", "RYE", db=self.db)[1], "2\tBread\t\n")
        self.assertEqual(cli("rm", "1", db=self.db)[0], 0)
        self.assertEqual(cli("rm", "1", db=self.db)[0], 1)

    def test_env_db(self):
        os.environ["NOTES_DB"] = self.db
        try:
            from notes.cli import main
            with contextlib.redirect_stdout(io.StringIO()):
                main(["add", "Env"])
            self.assertEqual(Store(self.db).list()[0]["title"], "Env")
        finally:
            del os.environ["NOTES_DB"]


class ExportTest(unittest.TestCase):
    def test_markdown(self):
        from notes.export import to_markdown
        ns = [{"title": "A", "body": "x", "tags": ["t"]}, {"title": "B", "body": "", "tags": []}]
        self.assertEqual(to_markdown(ns), "## A\n\nx\n\nTags: t\n\n## B\n")
        self.assertEqual(to_markdown([]), "")

    def test_cli_export_tag(self):
        db = os.path.join(tempfile.mkdtemp(), "n.db")
        cli("add", "A", "--body", "x", "--tag", "t", db=db); cli("add", "B", db=db)
        self.assertEqual(cli("export", "--tag", "t", db=db)[1], "## A\n\nx\n\nTags: t\n")


if __name__ == "__main__":
    unittest.main()
