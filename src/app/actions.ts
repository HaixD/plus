"use server"

import {
    verifyLogin,
    addAccount,
    changeUsername as dbChangeUsername,
    changePassword as dbChangePassword,
    addBioModal,
    changeBioModal as dbChangeBio,
    addPost,
    addToken,
    updateToken,
    getUserID,
    getPublicInfo,
} from "@/app/api/database"
import { PublicAccountInfo } from "@/models/PublicAccountInfo"
import { writeFile, readdir } from "node:fs/promises"
import { randomBytes } from "node:crypto"
import path from "path"

const TOKEN_SIZE = 48

function generateToken() {
    return randomBytes(TOKEN_SIZE).toString("hex")
}

export type ErrorResponse = {
    error: string
}

export type SuccessfulLoginResponse = SuccessfulChangePasswordResponse &
    PublicAccountInfo

export type LoginResponse = ErrorResponse | SuccessfulLoginResponse

async function createLoginResponse(
    userIDPromise: Promise<number>
): Promise<LoginResponse> {
    try {
        const userID = await userIDPromise
        const token = generateToken()
        const publicInfo = await getPublicInfo(userID)
        addToken(userID, token)
        return { token, ...publicInfo }
    } catch (error) {
        return { error: error as string }
    }
}

export async function login(
    _: LoginResponse,
    formData: FormData
): Promise<LoginResponse> {
    const username = formData.get("username") as string | null
    const password = formData.get("password") as string | null

    if (!username) return { error: "No username was given." }
    if (!password) return { error: "No password was given." }

    return createLoginResponse(verifyLogin(username, password))
}

export type SuccessfulSubmitPostResponse = {}

export type SubmitPostResponse = ErrorResponse | SuccessfulSubmitPostResponse

export async function submitPost(
    _: SubmitPostResponse,
    formData: FormData
): Promise<SubmitPostResponse> {
    const imageFolder = path.join(process.cwd(), "public", "external")

    const text = formData.get("text") as string | null
    const image = formData.get("image") as Blob | null
    const token = formData.get("token") as string | null

    if (!text && !image) return { error: "No text or image provided." }
    if (!token) return { error: "Credentials are invalid, please login again." }

    let filename: string | null = null
    if (image) {
        if (image.size === 0 || !/^image/.test(image.type))
            return { error: "Image cannot be accepted." }

        const buffer = await image.arrayBuffer()

        const dirLength = (await readdir(imageFolder)).length
        filename = `${dirLength}.${
            image.type.match(/(?<=image\/).*/) ?? "blob"
        }`

        writeFile(path.join(imageFolder, filename), Buffer.from(buffer))
    }

    try {
        await addPost(token, text, filename)
    } catch (error) {
        return { error }
    }

    return {}
}

export async function createAccount(
    _: LoginResponse,
    formData: FormData
): Promise<LoginResponse> {
    const username = formData.get("username") as string | null
    const password = formData.get("password") as string | null
    const verifypassword = formData.get("verify-password") as string | null
    var special = /[^\w]|_/

    if (!username) return { error: "No username was given." }
    if (special.test(username))
        return { error: "Username cannot contain special characters." }
    if (!password) return { error: "No password was given." }
    if (!verifypassword) return { error: "No password verification was given." }
    if (password !== verifypassword) return { error: "Passwords do not match." }

    return createLoginResponse(addAccount(username, password))
}

export type SuccessfulChangeUsernameResponse = {
    username: string
}

export type ChangeUsernameResponse =
    | ErrorResponse
    | SuccessfulChangeUsernameResponse

export async function changeUsername(
    _: ChangeUsernameResponse,
    formData: FormData
): Promise<ChangeUsernameResponse> {
    const username = formData.get("username") as string | null
    const token = formData.get("token") as string | null

    if (!username) return { error: "No username was given." }
    if (/[^\w]|_/.test(username))
        return { error: "Username cannot contain special characters." }
    if (!token) return { error: "Credentials are invalid, please login again." }

    try {
        await dbChangeUsername(token, username)
    } catch (error) {
        return { error: error as string }
    }

    return { username }
}

export type SuccessfulChangePasswordResponse = {
    token: string
}

export type ChangePasswordResponse =
    | ErrorResponse
    | SuccessfulChangePasswordResponse

export async function changePassword(
    _: ChangePasswordResponse,
    formData: FormData
): Promise<ChangePasswordResponse> {
    const password = formData.get("password") as string | null
    const verifypassword = formData.get("verify-password") as string | null
    const oldToken = formData.get("token") as string | null

    if (!password) return { error: "No password was given." }
    if (!verifypassword) return { error: "No password verification was given." }
    if (password !== verifypassword) return { error: "Passwords do not match." }
    if (!oldToken)
        return { error: "Credentials are invalid, please login again." }

    let token = ""
    try {
        await dbChangePassword(oldToken, password)
        token = generateToken()
        await updateToken(await getUserID(oldToken), token)
    } catch (error) {
        return { error: error as string }
    }

    return { token }
}

//past here is full test
export type SuccessfulSaveBioResponse = {}

export type SaveBioResponse = ErrorResponse | SuccessfulSaveBioResponse

export async function createBioModal(
    _: SaveBioResponse,
    formData: FormData
): Promise<SaveBioResponse> {
    const imageFolder = path.join(process.cwd(), "public", "external")

    const bio = formData.get("bio") as string
    const pfp = formData.get("picture") as Blob
    const token = formData.get("token") as string | null

    if (!pfp || !bio)
        return {
            error: "Bio cannot be empty and you must upload a picture.",
        }

    if (!token)
        return {
            error: "Credentials are invalid, please login again.",
        }

    let filename: string | null = null
    if (pfp) {
        if (pfp.size === 0 || !/^image/.test(pfp.type))
            return { error: "Image cannot be accepted." }

        const buffer = await pfp.arrayBuffer()

        const dirLength = (await readdir(imageFolder)).length
        filename = `${dirLength}.${pfp.type.match(/(?<=image\/).*/) ?? "blob"}`

        writeFile(path.join(imageFolder, filename), Buffer.from(buffer))
    }

    try {
        await addBioModal(token, bio, filename)
    } catch (error) {
        return { error }
    }

    return {}
}

export type SuccessfulChangeBioResponse = {
    pfp: string
    bio: string
}

export type ChangeBioResponse = SuccessfulChangeBioResponse | ErrorResponse

//tested down here for change
export async function changeBioModal(
    _: ChangeBioResponse,
    formData: FormData
): Promise<ChangeBioResponse> {
    const bio = formData.get("bio") as string
    const pfp = formData.get("picture") as Blob
    const token = formData.get("token") as string | null

    const imageFolder = path.join(process.cwd(), "public", "external")

    if (!bio) return { error: "Bio could not be saved." }

    if (!pfp) return { error: "Profile picture could not be saved." }

    if (!token) return { error: "Credentials are invalid, please login again." }

    let filename: string | null = null
    if (pfp) {
        if (pfp.size === 0 || !/^image/.test(pfp.type))
            return { error: "Image cannot be accepted." }

        const buffer = await pfp.arrayBuffer()

        const dirLength = (await readdir(imageFolder)).length
        filename = `${dirLength}.${pfp.type.match(/(?<=image\/).*/) ?? "blob"}`

        writeFile(path.join(imageFolder, filename), Buffer.from(buffer))
    }

    try {
        await dbChangeBio(token, bio, filename)
    } catch (error) {
        return { error: error as string }
    }
    //trying to return bio also, originally just only pfp
    return { pfp: `/external/${filename}`, bio }
}
