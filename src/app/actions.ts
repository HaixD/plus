"use server"

import { verifyLogin, addAccount } from "@/app/api/database"
import { PublicAccountInfo } from "@/models/PublicAccountInfo"
import { writeFile, readdir } from "node:fs/promises"
import path from "path"

export type ErrorResponse = {
    error: string
}

export type SuccessfulLoginResponse = {
    token: string
} & PublicAccountInfo

export type LoginResponse = ErrorResponse | SuccessfulLoginResponse

export async function login(_: LoginResponse, formData: FormData): Promise<LoginResponse> {
    const username = formData.get("username")
    const password = formData.get("password")

    if (!username) return { error: "No username was given" }
    if (!password) return { error: "No password was given" }

    const matched = await verifyLogin(username as string, password as string)
    if (!matched) return { error: "The username and password do not match." }
    
    return {
        token: username as string,
        username: username as string
    }
}

export async function submitPost(_: string, formData: FormData) {
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

