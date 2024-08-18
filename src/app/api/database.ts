import sqlite3 from "sqlite3"

export async function setToken(userID: number, token: string) {
    const db = new sqlite3.Database("plus.db")
    return await new Promise<void>((resolve, reject) => {
        db.get(`
            INSERT INTO "tokens" ("token", "id")
            VALUES (?, ?)
            ON CONFLICT ("token") DO NOTHING
            RETURNING *
        `, [token, userID], (error, row) => {
            if (error || row === undefined) {
                reject("Error occured when generating credentials")
            }
        })
    })
}

export async function getUserID(token: string) {
    const db = new sqlite3.Database("plus.db")
    return await new Promise<number>((resolve, reject) => {
        db.get(`
            SELECT "id" from "tokens" WHERE "token" = ?
        `, [token], (error, row: any) => {
            if (error) {
                reject("Error occured while accessing user information")
            } else if (row === undefined) {
                reject("Credentials have expired")
            } else {
                resolve(row.id)
            }
        })
    })
}

export async function verifyLogin(username: string, password: string) {
    const db = new sqlite3.Database("plus.db")
    return await new Promise<number>((resolve, reject) => {
        db.get(`
            SELECT "id" FROM "accounts" WHERE ("username" = ?) AND ("password" = ?)
        `, [username, password], (error, row: any) => {
            if (error) {
                reject("Error occured when searching for account")
            } else if (row !== undefined) {
                resolve(row.id)
            } else {
                reject("Invalid password for the given username")
            }
        })
        db.close()
    })
}

export async function addAccount(username: string, password: string) {
    const db = new sqlite3.Database("plus.db")
    return await new Promise<number>((resolve, reject) => {
        db.get(`
            INSERT INTO "accounts" ("username", "password")
            VALUES
                (?, ?)
            ON CONFLICT DO NOTHING
            RETURNING "id"
        `, [username, password], (error, row: any) => {
            if (error) {
                reject("Error occured when adding account")
            } else if (row !== undefined) {
                resolve(row.id)
            } else {
                reject("Username already exists")
            }
        })
        db.close()
    })
}

export async function changeUsername(token: string, newUsername: string) {
    const posterID = await getUserID(token)
    
    const db = new sqlite3.Database("plus.db")
    return await new Promise<void>((resolve, reject) => {
        db.get(`
            UPDATE "accounts"
            SET
                "username" = ?
            WHERE "id" = ?
            RETURNING *
        `, [newUsername, posterID], (error, row: any) => {
            if (error || row === undefined) {
                reject("Error occured when changing account username")
            } else {
                resolve()
            }
        })
        db.close()
    })
}

export async function addPost(posterID: number, content: string, imagePath: string) {
    const db = new sqlite3.Database("plus.db")
    return await new Promise<boolean>((resolve, reject) => {
        db.get(`
            INSERT INTO "posts" ("poster", "content", "image_path")
            VALUES
                (?, ?, ?)
        `, [posterID, content, imagePath], (error, _) => {
            if (error) {
                reject("error occured when adding post")
            }
        })
        db.close()
    })
}