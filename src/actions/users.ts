"use server"

import { db } from "@/database/drizzle"
import { accounts, profiles, tokens } from "@/database/schema/users"
import { randomUUID } from "crypto"
import { and, eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

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
