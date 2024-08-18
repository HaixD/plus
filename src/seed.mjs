import sqlite3 from "sqlite3"

const db = new sqlite3.Database("plus.db")
db.serialize(
    () => {
        db.run(`
            CREATE TABLE IF NOT EXISTS "accounts" (
                "username" TEXT UNIQUE NOT NULL PRIMARY KEY,
                "password" TEXT NOT NULL
            )
        `)
        db.run(`
            CREATE TABLE IF NOT EXISTS "posts" (
                "id" INTEGER PRIMARY KEY DEFAULT NULL,
                "content" TEXT,
                "image_path" TEXT,
                "poster" TEXT REFERENCES "accounts" ("username"),
                "likes" INTEGER NOT NULL DEFAULT 0
            )
        `)
        db.run(`
            CREATE TABLE IF NOT EXISTS "comments" (
                "original_post" INTEGER REFERENCES "posts" ("id"),
                "comment" INTEGER REFERENCES "posts" ("id")
            )
        `)
        db.run(`
            CREATE TABLE IF NOT EXISTS "likes" (
                "username" TEXT REFERENCES "accounts" ("username"),
                "post" INTEGER REFERENCES "posts" ("id")
            )
        `)
        db.run(`
            CREATE TABLE IF NOT EXISTS "bookmarks" (
                "username" TEXT REFERENCES "accounts" ("username"),
                "post" INTEGER REFERENCES "posts" ("id")
            )
        `)

        // placeholder data seeding
        db.run(`
            INSERT INTO "accounts" ("username", "password")
            VALUES ('admin', 'admin')
            ON CONFLICT DO NOTHING
        `)
    }
)
db.close()