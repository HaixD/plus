"use server"

import { verifyLogin } from "@/app/api/database"

export async function login(previousState: string, formData: FormData) {
    const username = formData.get("username")
    const password = formData.get("password")

    if (!username) return "No username was given"
    if (!password) return "No password was given"

    console.log(verifyLogin(username.toString(), password.toString()))

    if (username === "debug" || password === "debug") return "The username and password do not match."
    
    return "success"
}