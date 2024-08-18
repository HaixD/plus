import sqlite3 from "sqlite3"

const db = new sqlite3.Database("plus.db")
db.serialize(
    () => {
        db.run(`
            CREATE TABLE IF NOT EXISTS "accounts" (
                "email" TEXT UNIQUE NOT NULL PRIMARY KEY,
                "password" TEXT NOT NULL
            )
        `)
        db.close()
    }
)