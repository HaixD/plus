import sqlite3 from "sqlite3"

export async function addToken(userID: number, token: string) {
    const db = new sqlite3.Database("plus.db")
    await new Promise<void>((resolve, reject) => {
        db.get(`
            INSERT INTO "tokens" ("token", "id")
            VALUES (?, ?)
            ON CONFLICT ("token") DO NOTHING
            RETURNING *
        `, [token, userID], (error, row) => {
            if (error || row === undefined) {
                reject("Error occured when generating credentials")
            } else {
                resolve()
            }
        })
    })
}

export async function updateToken(userID: number, token: string) {
    const db = new sqlite3.Database("plus.db")
    await new Promise<void>((resolve, reject) => {
        db.run(`
            DELETE FROM "tokens"
            WHERE "id" = ?
            RETURNING *
        `, [userID], (error) => {
            if (error) {
                reject("Error occured when generating credentials")
            } else {
                resolve()
            }
        })
    })
    await addToken(userID, token)
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
    await new Promise<void>((resolve, reject) => {
        db.get(`
            UPDATE "accounts"
            SET
                "username" = ?
            WHERE "id" = ?
            RETURNING *
        `, [newUsername, posterID], (error, row: any) => {
            if (error) {
                if ("errno" in error && error.errno === 19) {
                    reject("Username is already taken")
                } else {
                    reject("Error occured when changing account username")
                }
            } else if (row === undefined) {
                reject("Error occured when changing account username")
            } else {
                resolve()
            }
        })
        db.close()
    })
}

export async function changePassword(token: string, newPassword: string) {
    const posterID = await getUserID(token)
    
    const db = new sqlite3.Database("plus.db")
    await new Promise<void>((resolve, reject) => {
        db.get(`
            UPDATE "accounts"
            SET
                "password" = ?
            WHERE "id" = ?
            RETURNING *
        `, [newPassword, posterID], (error, row: any) => {
            if (error || row === undefined) {
                reject("Error occured when changing account username")
            } else {
                resolve()
            }
        })
        db.close()
    })
}

export async function addPost(token: string, content: string | null, imagePath: string | null) {
    const posterID = await getUserID(token)

    const db = new sqlite3.Database("plus.db")
    await new Promise<void>((resolve, reject) => {
        db.run(`
            INSERT INTO "posts" ("poster", "content", "image_path")
            VALUES (?, ?, ?)
        `, [posterID, content, imagePath], error => {
            if (error) {
                reject("Error occured when adding post")
            } else {
                resolve()
            }
        })
        db.close()
    })
}

//* this isn't finished, 
export async function updateBio(userID: number, token: string) {
    const db = new sqlite3.Database("plus.db")
    await new Promise<void>((resolve, reject) => {
        db.run(`
            DELETE FROM "tokens"
            WHERE "id" = ?
            RETURNING *
        `, [userID], (error) => {
            if (error) {
                reject("Error occured when updating Bio")
            } else {
                resolve()
            }
        })
    })
    await addToken(userID, token)
}

