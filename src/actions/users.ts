"use server"

import { db } from "@/database/drizzle"
import { accounts, tokens } from "@/database/schema/users"
import { randomUUID } from "crypto"
import { and, eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

function applyToken(userID: number) {
    const token = randomUUID()

    db.insert(tokens).values({ token, id: userID })

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
