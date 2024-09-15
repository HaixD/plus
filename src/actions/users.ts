"use server"

import { db } from "@/database/drizzle"
import { accounts, profiles, tokens } from "@/database/schema/users"
import { randomUUID } from "crypto"
import { and, eq } from "drizzle-orm"
import { readdir, writeFile } from "fs/promises"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import path from "path"

export async function getUserID(token: string | undefined) {
    if (!token) return

    return db
        .select({ id: accounts.id })
        .from(accounts)
        .innerJoin(tokens, eq(accounts.id, tokens.id))
        .where(eq(tokens.token, token))
        .limit(1)
        .then(result => result[0]?.id)
}

async function applyToken(userID: number) {
    const token = randomUUID()

    await db.insert(tokens).values({ token, id: userID })

    const cookieStore = cookies()
    cookieStore.set("token", token, { sameSite: "strict" })
}

export async function login(_: any, formData: FormData) {
    const username = formData.get("username") as string | null
    const password = formData.get("password") as string | null

    if (!username) return { error: "No username was given." }
    if (!password) return { error: "No password was given." }

    const accountSelection = await db
        .select({ id: accounts.id })
        .from(accounts)
        .where(
            and(
                eq(accounts.username, username),
                eq(accounts.password, password)
            )
        )
        .limit(1)

    if (!accountSelection.length)
        return { error: "Incorrect username or password." }

    const account = accountSelection[0]
    applyToken(account.id)

    redirect("/home")
}

export async function createAccount(_: any, formData: FormData) {
    const username = formData.get("username") as string | null
    const password = formData.get("password") as string | null
    const verifypassword = formData.get("verify-password") as string | null
    var special = /[^\w]|_/

    if (!username) return { error: "No username was given." }
    if (special.test(username))
        return { error: "Username cannot contain special characters." }
    if (!password) return { error: "No password was given." }
    if (!verifypassword) return { error: "No password verification was given." }

    try {
        const account = (
            await db
                .insert(accounts)
                .values({ username, password })
                .returning({ id: accounts.id })
        )[0]
        applyToken(account.id)

        await db.insert(profiles).values({ id: account.id })
    } catch (error) {
        return { error: "Username has already been taken." }
    }

    redirect("/home")
}

export async function logout() {
    const cookieStore = cookies()
    cookieStore.delete("token")

    redirect("/login")
}

export async function getProfile() {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) redirect("/login")

    try {
        const profile = (
            await db
                .select({
                    username: accounts.username,
                    bio: profiles.bio,
                    picture: profiles.picture,
                })
                .from(accounts)
                .innerJoin(profiles, eq(accounts.id, profiles.id))
                .limit(1)
        )[0]

        return profile
    } catch (error) {
        redirect("/login")
    }
}

export async function validateToken() {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) redirect("/login")

    const selection = await db
        .select()
        .from(tokens)
        .where(eq(tokens.token, token))
        .limit(1)

    if (!selection.length) {
        cookieStore.delete("token")
        redirect("/login")
    }
}

export async function changeUsername(_: any, formData: FormData) {
    const cookieStore = cookies()
    const userID = await getUserID(cookieStore.get("token")?.value)

    if (!userID) redirect("/login")

    const username = formData.get("username") as string | null
    if (!username) return { error: "No username was given." }
    if (/[^\w]|_/.test(username))
        return { error: "Username cannot contain special characters." }

    await db.update(accounts).set({ username }).where(eq(accounts.id, userID))
    redirect("/settings")
}

export async function changePassword(_: any, formData: FormData) {
    const cookieStore = cookies()
    const userID = await getUserID(cookieStore.get("token")?.value)

    if (!userID) redirect("/login")

    const password = formData.get("password") as string | null
    const verifypassword = formData.get("verify-password") as string | null

    if (!password) return { error: "No password was given." }
    if (!verifypassword) return { error: "No password verification was given." }
    if (password !== verifypassword) return { error: "Passwords do not match." }

    await db.update(accounts).set({ password }).where(eq(accounts.id, userID))
    redirect("/settings")
}

export async function changeBio(_: any, formData: FormData) {
    const cookieStore = cookies()
    const userID = await getUserID(cookieStore.get("token")?.value)

    if (!userID) redirect("/login")

    const bio = formData.get("bio") as string
    const pfp = formData.get("picture") as Blob

    const imageFolder = path.join(process.cwd(), "public", "external")

    if (!bio) return { error: "Bio could not be saved." }
    if (!pfp) return { error: "Profile picture could not be saved." }

    let filename: string | null = null
    if (pfp) {
        if (pfp.size === 0 || !/^image/.test(pfp.type))
            return { error: "Image cannot be accepted." }

        const buffer = await pfp.arrayBuffer()

        const dirLength = (await readdir(imageFolder)).length
        filename = `${dirLength}.${pfp.type.match(/(?<=image\/).*/) ?? "blob"}`

        writeFile(path.join(imageFolder, filename), Buffer.from(buffer))
    }

    await db
        .update(profiles)
        .set({ bio, picture: filename })
        .where(eq(profiles.id, userID))
}
