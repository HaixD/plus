import sqlite3 from "sqlite3"

export async function verifyLogin(email: string, password: string) {
    const db = new sqlite3.Database("plus.db")
    return await new Promise<boolean>((resolve, reject) => {
        db.get(`
            SELECT * FROM "accounts" WHERE ("email" = ?) AND ("password" = ?)
        `, [email, password], (error, row: any) => {
            if (error) {
                reject(error)
            } else if (row !== undefined && Boolean(row.email) && Boolean(row.password)) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
        db.close()
    })
}

export async function addAccount(email: string, password: string) {
    const db = new sqlite3.Database("plus.db")
    return await new Promise<boolean>((resolve, reject) => {
        db.get(`
            INSERT INTO "accounts"
            VALUES
                (?, ?)
        `, [email, password], (error, _) => {
            if (error) {
                reject(error)
            } else {
                resolve(true)
            }
        })
        db.close()
    })
}