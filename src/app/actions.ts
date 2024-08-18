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

export type SuccessfulSubmitPostResponse = {}

export type SubmitPostResponse = ErrorResponse | SuccessfulSubmitPostResponse

export async function submitPost(_: SubmitPostResponse, formData: FormData): Promise<SubmitPostResponse> {
    const imageFolder = path.join(process.cwd(), "public", "external")
    
    const text = formData.get("text")
    const image = formData.get("image")

    if (!text && !image) return { error: "No text or image provided" }

    let filename = ""
    if (image) {
        const imageBlob = image as Blob
        console.log(imageBlob.type)
        const buffer = await imageBlob.arrayBuffer()

        const dirLength = (await readdir(imageFolder)).length
        filename = `${dirLength}.${imageBlob.type.match(/(?<=image\/).*/) ?? "blob"}`

        writeFile(path.join(imageFolder, filename), Buffer.from(buffer))
    }
    
    return {}
}

export type SuccessfulCreateAccountResponse = {}

export type CreateAccountResponse = ErrorResponse | SuccessfulCreateAccountResponse

export async function createAccount(_: CreateAccountResponse, formData: FormData): Promise<CreateAccountResponse> {
    const username = formData.get("username")
    const password = formData.get("password")
    const verifypassword = formData.get("verify-password")

    if (!username) return { error: "No username was given" }
    if (!password) return { error: "No password was given" }
    if (!verifypassword) return { error: "No password verification was given" }
    if (password !== verifypassword) return { error: "Passwords do not match" }
    
    const success = await addAccount(username as string, password as string)
    if (!success) return { error: "Username already exists" }
    
    return {}
}

