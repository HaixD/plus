import sqlite3 from "sqlite3"

const db = new sqlite3.Database("plus.db")
db.serialize(
    () => {
        db.run(`
            CREATE TABLE IF NOT EXISTS "accounts" (
                "id" INTEGER DEFAULT NULL PRIMARY KEY,
                "username" TEXT UNIQUE NOT NULL,
                "password" TEXT NOT NULL
            )
        `)
        db.run(`
            CREATE TABLE IF NOT EXISTS "posts" (
                "id" INTEGER DEFAULT NULL PRIMARY KEY,
                "content" TEXT,
                "image_path" TEXT,
                "poster" INTEGER REFERENCES "accounts" ("id"),
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
                "username" INTEGER REFERENCES "accounts" ("id"),
                "post" INTEGER REFERENCES "posts" ("id")
            )
        `)
        db.run(`
            CREATE TABLE IF NOT EXISTS "bookmarks" (
                "username" INTEGER REFERENCES "accounts" ("id"),
                "post" INTEGER REFERENCES "posts" ("id")
            )
        `)
        db.run(`
            CREATE TABLE IF NOT EXISTS "tokens" (
                "token" TEXT PRIMARY KEY,
                "id" INTEGER REFERENCES "accounts" ("id")
            )
        `)

        db.run(`
            CREATE TABLE IF NOT EXISTS "tokens" (
                "token" TEXT PRIMARY KEY,
                "id" INTEGER REFERENCES "accounts" ("id")
            )
        `)

        db.run(`
            CREATE TABLE IF NOT EXISTS "profiles" (
                "picture" TEXT DEFAULT '',
                "bio" TEXT DEFAULT '',
                "id" INTEGER PRIMARY KEY REFERENCES "accounts" ("id")
            )
        `)


        // placeholder data seeding
        db.run(`
            INSERT INTO "accounts" ("username", "password")
            VALUES ('admin', 'admin')
            ON CONFLICT DO NOTHING
        `)

        db.run(`
            INSERT INTO "profiles" ("id")
            VALUES (1)
        `)
    }
)
db.close()