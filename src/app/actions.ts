"use server"

import { verifyLogin, addAccount } from "@/app/api/database"
import { writeFile, readdir } from "node:fs/promises"
import path from "path"

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

export async function submitPost(previousState: string, formData: FormData) {
    const imageFolder = path.join(process.cwd(), "public", "external")
    
    const text = formData.get("text")
    const image = formData.get("image")

    if (!text && !image) return "No text or image provided"

    let filename = ""
    if (image) {
        const imageBlob = image as Blob
        console.log(imageBlob.type)
        const buffer = await imageBlob.arrayBuffer()

        const dirLength = (await readdir(imageFolder)).length
        filename = `${dirLength}.${imageBlob.type.match(/(?<=image\/).*/) ?? "blob"}`

        writeFile(path.join(imageFolder, filename), Buffer.from(buffer))
    }
    
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

