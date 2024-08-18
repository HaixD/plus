import sqlite3 from "sqlite3"

export async function verifyLogin(username: string, password: string) {
    const db = new sqlite3.Database("plus.db")
    return await new Promise<boolean>((resolve, reject) => {
        db.get(`
            SELECT * FROM "accounts" WHERE ("username" = ?) AND ("password" = ?)
        `, [username, password], (error, row: any) => {
            if (error) {
                reject(error)
            } else if (row !== undefined) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
        db.close()
    })
}

export async function addAccount(username: string, password: string) {
    const db = new sqlite3.Database("plus.db")
    return await new Promise<boolean>((resolve, reject) => {
        db.get(`
            INSERT INTO "accounts" ("username", "password")
            VALUES
                (?, ?)
        `, [username, password], (error, _) => {
            if (error) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
        db.close()
    })
}

export async function addPost(poster: string, content: string, imagePath: string) {
    const db = new sqlite3.Database("plus.db")
    return await new Promise<boolean>((resolve, reject) => {
        db.get(`
            INSERT INTO "posts" ("poster", "content", "image_path")
            VALUES
                (?, ?, ?)
        `, [poster, content, imagePath], (error, _) => {
            if (error) {
                reject(error)
            } else {
                resolve(true)
            }
        })
        db.close()
    })
}