import datetime
import sqlite3


class Store:
    def __init__(self, path):
        self.db = sqlite3.connect(path)
        self.db.execute("create table if not exists notes (id integer primary key autoincrement, title text not null,"
                        " body text not null, tags text not null, created text not null)")
        self.db.commit()

    @staticmethod
    def _row(r):
        return {"id": r[0], "title": r[1], "body": r[2], "tags": [t for t in r[3].split(",") if t], "created": r[4]}

    def add(self, title, body="", tags=()):
        if not str(title).strip():
            raise ValueError("title is required")
        tg = ",".join(sorted({str(t).strip().lower() for t in tags if str(t).strip()}))
        cur = self.db.execute("insert into notes (title, body, tags, created) values (?, ?, ?, ?)",
                              (title, body, tg, datetime.datetime.now().isoformat(timespec="seconds")))
        self.db.commit()
        return cur.lastrowid

    def get(self, id):
        r = self.db.execute("select * from notes where id = ?", (id,)).fetchone()
        return self._row(r) if r else None

    def list(self):
        return [self._row(r) for r in self.db.execute("select * from notes order by id")]

    def search(self, term):
        t = f"%{term.lower()}%"
        return [self._row(r) for r in self.db.execute(
            "select * from notes where lower(title) like ? or lower(body) like ? order by id", (t, t))]

    def delete(self, id):
        cur = self.db.execute("delete from notes where id = ?", (id,))
        self.db.commit()
        return cur.rowcount > 0
