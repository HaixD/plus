"use server"

import { verifyLogin, addAccount, changeUsername as dbChangeUsername, setToken } from "@/app/api/database"
import { PublicAccountInfo } from "@/models/PublicAccountInfo"
import { writeFile, readdir } from "node:fs/promises"
import { setTimeout } from "node:timers/promises"
import path from "path"

export type ErrorResponse = {
    error: string
}

export type SuccessfulLoginResponse = {
    token: string
} & PublicAccountInfo

export type LoginResponse = ErrorResponse | SuccessfulLoginResponse

async function createLoginResponse(userIDPromise: Promise<number>, username: string): Promise<LoginResponse> {
    let token = ""
    try {
        const userID = await userIDPromise
        token = username // TEMPORARY SOLUTION
        setToken(userID, token)
    } catch (error) {
        return { error: error as string }
    }
    
    return {
        token: token,
        username: username
    }
}

export async function login(_: LoginResponse, formData: FormData): Promise<LoginResponse> {
    const username = formData.get("username") as string | null
    const password = formData.get("password") as string | null

    if (!username) return { error: "No username was given" }
    if (!password) return { error: "No password was given" }

    return createLoginResponse(verifyLogin(username, password), username)
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

export async function createAccount(_: LoginResponse, formData: FormData): Promise<LoginResponse> {
    const username = formData.get("username") as string | null
    const password = formData.get("password") as string | null
    const verifypassword = formData.get("verify-password") as string | null

    if (!username) return { error: "No username was given" }
    if (!password) return { error: "No password was given" }
    if (!verifypassword) return { error: "No password verification was given" }
    if (password !== verifypassword) return { error: "Passwords do not match" }
    
    return createLoginResponse(addAccount(username, password), username)
}



export type SuccessfulChangeUsernameResponse = {
    username: string
}

export type ChangeUsernameResponse = ErrorResponse | SuccessfulChangeUsernameResponse

export async function changeUsername(_: ChangeUsernameResponse, formData: FormData): Promise<ChangeUsernameResponse> {
    const username = formData.get("username") as string | null
    const token = formData.get("token") as string | null

    if (!username) return { error: "No username was given" }
    if (!token) return { error: "Credentials are invalid, please login again" }
    
    try {
        console.log("STAR")
        await dbChangeUsername(token, username)
    } catch (error) {
        console.log("BAD")
        return { error: error as string }
    }
    
    return { username }
}