import unittest


class Slug(unittest.TestCase):
    def test_slug(self):
        from textkit.slug import slugify
        self.assertEqual(slugify("  Héllo, Wörld!  "), "hello-world")
        self.assertEqual(slugify("a--b__c"), "a-b-c")
        self.assertEqual(slugify("Hello World Again", max_len=11), "hello-world")
        self.assertEqual(slugify("¿¡!"), "")


class Roman(unittest.TestCase):
    def test_roundtrip(self):
        from textkit.roman import from_roman, to_roman
        self.assertEqual(to_roman(1994), "MCMXCIV")
        self.assertEqual(to_roman(3999), "MMMCMXCIX")
        self.assertTrue(all(from_roman(to_roman(n)) == n for n in range(1, 4000)))

    def test_invalid(self):
        from textkit.roman import from_roman, to_roman
        for bad in (0, 4000, -1):
            with self.assertRaises(ValueError):
                to_roman(bad)
        for bad in ("IIII", "IC", "VX", "", "iv", "MMMM"):
            with self.assertRaises(ValueError):
                from_roman(bad)


class Stats(unittest.TestCase):
    def test_stats(self):
        from textkit.stats import stats
        s = stats("The cat sat. The cat ran! Did it? Yes")
        self.assertEqual((s["words"], s["unique"], s["sentences"]), (9, 7, 3))
        self.assertEqual(s["top"], [("cat", 2), ("the", 2), ("did", 1)])
        self.assertEqual(stats("no terminator here")["sentences"], 1)
        self.assertEqual(stats("  ... "), {"words": 0, "unique": 0, "sentences": 0, "top": []})


class Csv(unittest.TestCase):
    def test_types(self):
        from textkit.csvjson import csv_to_records
        recs = csv_to_records('name,age,score,ok,note\nAda,36,9.5,TRUE,"a, b"\nBob,,0.25,false,\n')
        self.assertEqual(recs, [{"name": "Ada", "age": 36, "score": 9.5, "ok": True, "note": "a, b"},
                                {"name": "Bob", "age": None, "score": 0.25, "ok": False, "note": None}])
        self.assertEqual(csv_to_records("a\n1\n", types=False), [{"a": "1"}])


if __name__ == "__main__":
    unittest.main()
