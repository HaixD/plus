import sqlite3 from "sqlite3"

const db = new sqlite3.Database("plus.db")
db.run(`
    CREATE TABLE IF NOT EXISTS "accounts" (
        "email" TEXT UNIQUE NOT NULL PRIMARY KEY,
        "password" TEXT NOT NULL
    )
`)

db.run(`
    INSERT INTO "accounts"
    VALUES
        ('admin', 'admin')
    ON CONFLICT DO NOTHING
`)
db.close()

export function verifyLogin(email: string, password: string) {
    const db = new sqlite3.Database("plus.db")

    let found = false
    db.get(`
        SELECT * FROM "accounts" WHERE ("email" = ?) AND ("password" = ?)
    `, [email, password], (error, row: any) => {
        if (!error && row.email && row.password) found = true
    })
    
    db.close()
    return found
}

export function addAccount(email: string, password: string) {
    const db = new sqlite3.Database("plus.db")

    let success = false
    db.get(`
        INSERT INTO "accounts"
        VALUES
            (?, ?)
    `, [email, password], (error, _) => {
        if (!error) success = true
    })
    
    db.close()
    return success
}