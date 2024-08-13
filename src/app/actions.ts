"use server"

import { verifyLogin, addAccount } from "@/app/api/database"

export async function login(previousState: string, formData: FormData) {
    const username = formData.get("username")
    const password = formData.get("password")

    if (!username) return "No username was given"
    if (!password) return "No password was given"

    if (!verifyLogin(username.toString(), password.toString())) return "The username and password do not match."
    
    return "success"
}

export async function createAccount(previousState: string, formData: FormData) {
    const username = formData.get("username")
    const password = formData.get("password")

    if (!username) return "No username was given"
    if (!password) return "No password was given"

    if (!addAccount(username.toString(), password.toString())) return "Email already exists."
    
    return "success"
}