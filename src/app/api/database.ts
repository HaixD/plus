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
    
        db.serialize(() => {
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
            const userId = username
            db.run(`
                INSERT INTO "profile" ("id", "bio", "picture")
                VALUES (?, '', '/default.png')
                ON CONFLICT ("id") DO NOTHING
                RETURNING *
        `   , [userId], (error: any, row: any) => {
            if (error) {
                reject("Error occured when creating Biography")
            } else if (row === undefined) {
                reject("User already has existing biography")
            } else {
                resolve()
            }
        })
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

//this also is not finished, make it so there is an option to save the profile picture as well. 
export async function addBioModal(token: string, bio: string, imagePath: string | null) {
    const userID = await getUserID(token)
    
    const db = new sqlite3.Database("plus.db")
    await new Promise<void>((resolve, reject) => {
        //not sure if this has to be in order for the columns
        db.run(`
            INSERT INTO "profile" ("id", "bio", "picture")
            VALUES (?, ?, ?)
            ON CONFLICT ("id") DO NOTHING
            RETURNING *
        `, [bio, imagePath], (error: any, row: any) => {
            if (error) {
                reject("Error occured when creating Biography")
            } else if (row === undefined) {
                reject("User already has existing biography")
            } else {
                resolve()
            }
        })
        db.close()
    })
}

// this isn't finished,  and I'm frankly confused
export async function changeBioModal(token: string, bio: string | null, imagePath: string | null) {
    //not sure what to do with this as ID has to be matched to the profile
    const userID = await getUserID(token)
    
    const db = new sqlite3.Database("plus.db")
    await new Promise<void>((resolve, reject) => {
        db.get(`
            INSERT INTO 
                profiles ("bio", "picture", "id")
                VALUES (?, ?, ?)
                ON CONFLICT (id) DO UPDATE SET 
                   bio = EXCLUDED.bio,
                   picture = EXCLUDED.picture
                RETURNING *
        `, [bio, imagePath, userID], (error, row: any) => {

            console.log(error, row)

            if (row === undefined) {
                reject("Error. changes were not saved.")
            } else {
                resolve()
            }
        })
        db.close()
    })
}
