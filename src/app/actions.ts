"use server"

import { verifyLogin, addAccount } from "@/app/api/database"

export async function login(previousState: string, formData: FormData) {
    const username = formData.get("username")
    const password = formData.get("password")

    if (!username) return "No username was given"
    if (!password) return "No password was given"

    const matched = await verifyLogin(username.toString(), password.toString())
    if (!matched) return "The username and password do not match."
    
    return "success"
}

export async function createAccount(previousState: string, formData: FormData) {
    const username = formData.get("username")
    const pass = formData.get("password")
    const verifypassword = formData.get("verify-password")

    if (!username) return "No username was given"
    if (!pass) return "No password was given"

    const matched = await addAccount(username.toString(), pass.toString())
    if (!addAccount(username.toString(), pass.toString())) return "Email already exists."
    
    return "success"
}

export async function createAccountpage(previousState: string, formData: FormData) {
    const username = formData.get("username")
    const password = formData.get("password")
    const verifypassword = formData.get("verify-password")

    if (username === "existingusername") return "Username already exists"

    else if (password !== verifypassword) return "Passwords do not match"
    
    return "success"
}

